// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — VoiceButton
//
// A floating mic button that drives the AI voice command flow:
//   Idle        → tap → recording (pulsing red)
//   Recording   → tap again OR 8s timeout → processing (spinner)
//   Done        → show result card with destination + reply
//   Error       → show error card
//
// Props:
//   onDestinationResolved(destinationId: string) — called when a destination
//     is successfully identified, so MapScreen can select/navigate to it.
//   lang        {string}  "en" | "fil"
//   style       {object}  optional extra container style (position, bottom, etc.)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';
import useVoiceCommand from '../hooks/useVoiceCommand';

const GREEN = '#00C853';
const RED   = '#FF3B30';

export default function VoiceButton({ onDestinationResolved, lang = 'en', style }) {
  const { startRecording, stopRecording, reset, state, result, error } = useVoiceCommand();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef(null);

  // ── Pulse animation while recording ──────────────────────────────────────
  useEffect(() => {
    if (state === 'recording') {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.0, duration: 500, useNativeDriver: true }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    }
  }, [state]);

  // ── When a result arrives, notify parent if a destination was found ───────
  useEffect(() => {
    if (state === 'done' && result?.destinationId) {
      onDestinationResolved?.(result.destinationId);
    }
  }, [state, result]);

  // ── Button tap handler ────────────────────────────────────────────────────
  function handlePress() {
    if (state === 'idle' || state === 'done' || state === 'error') {
      reset().then(() => startRecording(lang === 'fil' ? 'fil' : 'en'));
    } else if (state === 'recording') {
      stopRecording(lang === 'fil' ? 'fil' : 'en');
    }
    // 'processing' — ignore taps, let it finish
  }

  const isRecording   = state === 'recording';
  const isProcessing  = state === 'processing';
  const showResult    = state === 'done' || state === 'error';

  return (
    <View style={[s.wrapper, style]} pointerEvents="box-none">

      {/* ── Result / error card ── */}
      {showResult && (
        <View style={[s.resultCard, state === 'error' && s.errorCard]}>
          {result?.transcript ? (
            <Text style={s.transcript} numberOfLines={2}>
              🎙 "{result.transcript}"
            </Text>
          ) : null}
          <Text style={[s.replyText, state === 'error' && s.errorText]} numberOfLines={3}>
            {error ?? result?.reply ?? 'Unknown error'}
          </Text>
          {result?.destinationId && (
            <Text style={s.destChip}>→ {result.destinationId.replace(/_/g, ' ')}</Text>
          )}
          <TouchableOpacity style={s.dismissBtn} onPress={reset} hitSlop={8}>
            <Text style={s.dismissText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Mic FAB ── */}
      <View style={s.fabRow}>
        <Animated.View style={[
          s.pulseRing,
          isRecording && s.pulseRingActive,
          { transform: [{ scale: pulseAnim }] },
        ]} />

        <TouchableOpacity
          style={[s.fab, isRecording && s.fabRecording]}
          onPress={handlePress}
          activeOpacity={0.85}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#071209" />
          ) : (
            <Text style={s.micIcon}>{isRecording ? '⏹' : '🎙'}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Status label ── */}
      <Text style={s.statusLabel}>
        {isRecording   ? 'Listening… tap to stop'  :
         isProcessing  ? 'Processing…'              :
         state === 'done'  ? 'Done'                 :
         state === 'error' ? 'Try again'            :
         'Ask AI'}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 4,
  },

  // Result card
  resultCard: {
    backgroundColor: 'rgba(10,20,12,0.97)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,200,83,0.25)',
    padding: 12,
    marginBottom: 8,
    maxWidth: 240,
    gap: 4,
    position: 'relative',
  },
  errorCard: {
    borderColor: 'rgba(255,59,48,0.4)',
  },
  transcript: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    fontStyle: 'italic',
  },
  replyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e0e8e0',
    lineHeight: 18,
  },
  errorText: {
    color: '#FF9500',
  },
  destChip: {
    fontSize: 11,
    fontWeight: '800',
    color: GREEN,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  dismissBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '700',
  },

  // FAB
  fabRow: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
  },
  pulseRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pulseRingActive: {
    borderColor: RED,
    backgroundColor: 'rgba(255,59,48,0.12)',
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabRecording: {
    backgroundColor: RED,
  },
  micIcon: {
    fontSize: 22,
  },

  // Status label
  statusLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
