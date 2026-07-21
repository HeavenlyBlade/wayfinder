// ─────────────────────────────────────────────────────────────────────────────
// useVoiceCommand — intelligent voice navigation hook with offline/online modes
//
// Flow:
//   1. Record audio on-device via expo-audio
//   2. Check settings.offlineMode:
//      - If ON (forced offline): Use local keyword matcher immediately
//      - If OFF (auto): Check internet connectivity
//        → Online: POST to backend (Whisper STT + LLaMA) — best quality
//        → Offline: Fall back to local keyword matcher
//   3. Server timeout (6s) also triggers offline fallback
//
// The hook exposes the same API as before so no screen changes are needed.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';
import { API_BASE } from '../constants/api';
import { resolveDestination, buildReply } from '../utils/offlineVoice';
import { checkInternetConnection } from '../utils/networkStatus';
import { useSettings } from '../context/SettingsContext';

// How long to wait for the server before giving up (ms)
const SERVER_TIMEOUT_MS = 6000;

// ── Timeout-aware fetch ───────────────────────────────────────────────────────
async function fetchWithTimeout(url, options, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export default function useVoiceCommand() {
  const [isListening, setIsListening] = useState(false);
  const [transcript,  setTranscript]  = useState('');
  const [aiReply,     setAiReply]     = useState('');
  const [destId,      setDestId]      = useState(null);
  const [isOffline,   setIsOffline]   = useState(false); // true when using offline fallback

  const { settings } = useSettings();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  async function startListening() {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) return;
      setAiReply('');
      setTranscript('');
      setDestId(null);
      await audioRecorder.record();
      setIsListening(true);
    } catch (e) {
      console.error('useVoiceCommand startListening:', e);
    }
  }

  async function stopListening() {
    if (!isListening) return;
    try {
      setIsListening(false);
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      if (!uri) return;

      // ── 1. Check if we should use offline mode ──────────────────────────
      const forceOffline = settings.offlineMode; // User explicitly enabled offline mode
      let shouldUseOffline = forceOffline;

      // If not forced offline, check internet connectivity
      if (!forceOffline) {
        const hasInternet = await checkInternetConnection(3000);
        shouldUseOffline = !hasInternet;
        
        if (!hasInternet) {
          console.log('⚠️ No internet detected, using offline voice processing');
        }
      } else {
        console.log('📵 Offline mode enabled in settings, skipping server');
      }

      // ── 2. If offline mode (forced or no internet), use local matcher ───
      if (shouldUseOffline) {
        return _resolveOffline('');
      }

      // ── 3. Try server (Whisper + LLaMA) ─────────────────────────────────
      try {
        const formData = new FormData();
        formData.append('audio', { uri, type: 'audio/m4a', name: 'command.m4a' });

        const res  = await fetchWithTimeout(
          `${API_BASE}/voice/command`,
          { method: 'POST', body: formData },
          SERVER_TIMEOUT_MS,
        );
        const data = await res.json();

        if (data?.destination_id) {
          setTranscript(data.transcript    ?? '');
          setAiReply(  data.reply          ?? buildReply(data.transcript, data.destination_id));
          setDestId(   data.destination_id);
          setIsOffline(false);
          return data;
        }

        // Server responded but found no destination — fall through to offline
        const rawText = data?.transcript ?? '';
        return _resolveOffline(rawText);

      } catch (_serverErr) {
        // Server unreachable / timed out — go fully offline
        console.log('❌ Server timeout, falling back to offline mode');
        return _resolveOffline('');
      }

    } catch (e) {
      console.error('useVoiceCommand stopListening:', e);
    }
  }

  // ── Offline resolver ───────────────────────────────────────────────────────
  // Called when the server fails. We don't have a transcript text at this point
  // (no STT) so we show a prompt and ask the user to try the search bar instead,
  // OR we resolve the last known transcript if one exists.
  function _resolveOffline(rawText) {
    setIsOffline(true);
    const text = rawText || transcript; // reuse previous transcript if available

    const id    = resolveDestination(text);
    const reply = id
      ? buildReply(text, id)
      : '📡 Offline mode — type in the search bar to find a building.';

    setAiReply(reply);
    if (id) setDestId(id);
    return { transcript: text, reply, destination_id: id };
  }

  return {
    isListening,
    transcript,
    aiReply,
    destId,
    isOffline,
    startListening,
    stopListening,
  };
}
