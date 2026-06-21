import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../constants/theme';

export default function SearchBar({ onMicPress, isListening, transcript, aiReply }) {
  return (
    <View>
      <View style={s.bar}>
        <Text style={s.icon}>🔍</Text>
        <TextInput
          style={s.input}
          placeholder={isListening ? 'Listening...' : 'Where do you want to go?'}
          placeholderTextColor={isListening ? '#00e5a0' : colors.textMuted}
          value={transcript}
          editable={false}
        />
        <TouchableOpacity
          style={[s.mic, isListening && s.micActive]}
          onPress={onMicPress}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16 }}>{isListening ? '⏹' : '🎤'}</Text>
        </TouchableOpacity>
      </View>
      {aiReply ? (
        <View style={s.replyBubble}>
          <Text style={s.replyText}>🤖 {aiReply}</Text>
        </View>
      ) : null}
    </View>
  );
}

// Add to stylesheet:
// micActive:   { backgroundColor: '#ff4444' },
// replyBubble: { backgroundColor: 'rgba(0,229,160,0.1)', borderRadius: 12,
//                padding: 10, marginTop: 8, borderWidth: 1,
//                borderColor: 'rgba(0,229,160,0.3)' },
// replyText:   { fontSize: 12, color: colors.primary, fontWeight: '600' },

const s = StyleSheet.create({
  bar: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: radius.full,
    paddingHorizontal: 16, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    shadowColor: '#000', shadowOpacity: 0.4,
    shadowRadius: 20, elevation: 8,
  },
  icon:  { fontSize: 18 },
  input: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1a1f2a' },
  mic:   {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
});