import { useState, useRef } from 'react';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';
import { API_BASE } from '../constants/api';

export default function useVoiceCommand() {
  const [isListening, setIsListening] = useState(false);
  const [transcript,  setTranscript]  = useState('');
  const [aiReply,     setAiReply]     = useState('');
  const [destId,      setDestId]      = useState(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  async function startListening() {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) return;
      await audioRecorder.record();
      setIsListening(true);
    } catch (e) {
      console.error('startListening error:', e);
    }
  }

  async function stopListening() {
    try {
      setIsListening(false);
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      if (!uri) return;

      const formData = new FormData();
      formData.append('audio', {
        uri,
        type: 'audio/m4a',
        name: 'command.m4a',
      });

      const res  = await fetch(`${API_BASE}/voice/command`, {
        method: 'POST',
        body:   formData,
      });
      const data = await res.json();

      setTranscript(data.transcript    ?? '');
      setAiReply(  data.reply          ?? '');
      setDestId(   data.destination_id ?? null);

      return data;
    } catch (e) {
      console.error('stopListening error:', e);
    }
  }

  return { isListening, transcript, aiReply, destId,
           startListening, stopListening };
}