// ─────────────────────────────────────────────────────────────────────────────
// useVoiceCommand — offline-first voice navigation hook
//
// Flow:
//   1. Record audio on-device via expo-audio
//   2. Try to POST to backend (Whisper STT + LLaMA) — best quality
//   3. If server unreachable or times out → fall back to expo-speech
//      recognition stub + offline keyword matcher
//
// The hook exposes the same API as before so no screen changes are needed.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef } from 'react';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';
import * as Speech from 'expo-speech';
import { API_BASE } from '../constants/api';
import { resolveDestination, buildReply } from '../utils/offlineVoice';

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

      // ── 1. Try server (Whisper + LLaMA) ─────────────────────────────────
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
