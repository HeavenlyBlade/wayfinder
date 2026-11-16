import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { colors } from "../constants/theme";
import { t } from "../constants/i18n";

function Chip({ color, label }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,   duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={[s.chip, { borderColor: color + "80" }]}>
      <Animated.View
        style={[s.dot, { backgroundColor: color, opacity: pulse }]}
      />
      <Text style={[s.label, { color }]}>{label}</Text>
    </View>
  );
}

// StatusChips — shows GPS status chip.
// When quality prop is provided ('good'|'fair'|'poor'), adjusts color and label.
// Voice/AI/offline/AR chips removed (features not implemented).
export default function StatusChips({ quality, lang }) {
  const color = quality === 'good'
    ? '#00C853'
    : quality === 'fair'
    ? '#FFC107'
    : quality === 'poor'
    ? '#FF5252'
    : colors.primary;
  const label = quality
    ? t(`gps.quality.${quality}`, lang)
    : 'GPS Active';
  return (
    <View style={s.row}>
      <Chip color={color} label={label} />
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1.5,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
});
