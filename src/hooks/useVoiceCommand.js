// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — useVoiceCommand
//
// Hook that handles the full voice → destination flow:
//
//   1. Request microphone permission (once, cached)
//   2. Record audio via expo-av Audio.Recording
//   3. Try uploading to backend /voice/command (Whisper + LLaMA)
//   4. If offline or backend fails, fall back to expo-speech recognition
//      via the offline keyword resolver (resolveDestination)
//   5. Return { startRecording, stopRecording, state, result, error }
//
// States: 'idle' | 'recording' | 'processing' | 'done' | 'error'
// Result: { destinationId: string|null, transcript: string, reply: string, source: 'ai'|'offline' }
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { API_BASE } from '../constants/api';
import { resolveDestination, buildReply } from '../utils/offlineVoice';

// Max recording duration before auto-stop (ms)
const MAX_RECORD_MS = 8000;

// Voice command API endpoint
const VOICE_ENDPOINT = `${API_BASE}/voice/command`;

// Recording quality: low bitrate, mono — keeps file small for fast upload
const RECORDING_OPTIONS = {
  ...Audio.RecordingOptionsPresets.LOW_QUALITY,
  android: {
    extension:            '.m4a',
    outputFormat:         Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder:         Audio.AndroidAudioEncoder.AAC,
    sampleRate:           16000,
    numberOfChannels:     1,
    bitRate:              64000,
  },
  ios: {
    extension:            '.m4a',
    audioQuality:         Audio.IOSAudioQuality.LOW,
    sampleRate:           16000,
    numberOfChannels:     1,
    bitRate:              64000,
    linearPCMBitDepth:    16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat:     false,
  },
};

export default function useVoiceCommand() {
  const [state,  setState]  = useState('idle');   // 'idle'|'recording'|'processing'|'done'|'error'
  const [result, setResult] = useState(null);     // { destinationId, transcript, reply, source }
  const [error,  setError]  = useState(null);     // string | null

  const recordingRef   = useRef(null);
  const autoStopTimer  = useRef(null);
  const permissionRef  = useRef(false);           // cached mic permission
  const stateRef       = useRef('idle');           // mirrors state for use inside callbacks

  // Helper: set state and keep ref in sync
  function setStateSync(s) {
    stateRef.current = s;
    setState(s);
  }

  // ── Request mic permission (idempotent) ──────────────────────────────────
  async function ensurePermission() {
    if (permissionRef.current) return true;
    const { status, canAskAgain } = await Audio.requestPermissionsAsync();
    permissionRef.current = status === 'granted';
    // Track if permanently denied so VoiceButton can show "Open Settings" hint
    permissionRef.permanentlyDenied = !permissionRef.current && !canAskAgain;
    return permissionRef.current;
  }

  // ── Upload audio and call AI backend ─────────────────────────────────────
  async function callBackend(uri, language) {
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists) throw new Error('Recording file not found');

    const form = new FormData();
    form.append('audio', {
      uri,
      name:  'voice.m4a',
      type:  'audio/m4a',
    });
    if (language) {
      // append as URL param
    }

    const langParam = language ? `?language=${encodeURIComponent(language)}` : '';

    // AbortController for 25-second timeout (Vercel cold starts can be slow)
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 25000);

    const response  = await fetch(`${VOICE_ENDPOINT}${langParam}`, {
      method:  'POST',
      body:    form,
      headers: { Accept: 'application/json' },
      signal:  controller.signal,
      // Note: do NOT set Content-Type — FormData sets it with the boundary automatically
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Backend ${response.status}: ${text.slice(0, 100)}`);
    }
    return response.json();
  }

  // ── Offline fallback: resolve destination from a transcript string ────────
  function resolveOffline(transcript) {
    const destinationId = resolveDestination(transcript);
    return {
      destinationId,
      transcript,
      reply:  buildReply(transcript, destinationId),
      source: 'offline',
    };
  }

  // ── Start recording ───────────────────────────────────────────────────────
  const startRecording = useCallback(async (language = null) => {
    // Use ref instead of state to avoid stale-closure issues
    if (stateRef.current === 'recording' || stateRef.current === 'processing') return;

    setError(null);
    setResult(null);
    setStateSync('idle');

    const granted = await ensurePermission();
    if (!granted) {
      setError('Microphone permission denied');
      setStateSync('error');
      return;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS:   true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(RECORDING_OPTIONS);
      recordingRef.current = recording;
      setStateSync('recording');

      // Auto-stop after MAX_RECORD_MS
      autoStopTimer.current = setTimeout(() => {
        stopRecording(language);
      }, MAX_RECORD_MS);
    } catch (e) {
      setError(`Could not start recording: ${e.message}`);
      setStateSync('error');
    }
  }, []);  // stable — uses stateRef instead of state

  // ── Stop recording and process ────────────────────────────────────────────
  const stopRecording = useCallback(async (language = null) => {
    if (autoStopTimer.current) {
      clearTimeout(autoStopTimer.current);
      autoStopTimer.current = null;
    }

    const recording = recordingRef.current;
    if (!recording) return;
    recordingRef.current = null;

    setState('processing');

    try {
      await recording.stopAndUnloadAsync();

      // Restore audio mode for playback
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      const uri = recording.getURI();
      if (!uri) throw new Error('No recording URI');

      // ── Try AI backend first ─────────────────────────────────────────────
      let res = null;
      try {
        const data = await callBackend(uri, language);
        res = {
          destinationId: data.destination_id ?? null,
          transcript:    data.transcript     ?? '',
          reply:         data.reply          ?? '',
          source:        'ai',
        };
      } catch (backendErr) {
        console.warn('[useVoiceCommand] Backend failed, using offline resolver:', backendErr.message);
        // ── Offline fallback: we don't have a transcript here, so we can't
        //    keyword-match. Show the actual error for debugging.
        const isAbort = backendErr.name === 'AbortError';
        const errMsg  = isAbort
          ? 'Request timed out. The server may be starting up — please try again.'
          : `Voice AI error: ${backendErr.message}`;
        res = {
          destinationId: null,
          transcript:    '',
          reply:         errMsg,
          source:        'offline',
        };
      } finally {
        // Clean up the recording file
        FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});
      }

      setResult(res);
      setStateSync('done');
    } catch (e) {
      setError(`Processing error: ${e.message}`);
      setStateSync('error');
    }
  }, []);

  // ── Cancel and reset ──────────────────────────────────────────────────────
  const reset = useCallback(async () => {
    if (autoStopTimer.current) {
      clearTimeout(autoStopTimer.current);
      autoStopTimer.current = null;
    }
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (_) {}
      recordingRef.current = null;
    }
    setResult(null);
    setError(null);
    setStateSync('idle');
  }, []);

  return { startRecording, stopRecording, reset, state, result, error };
}
