import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { colors, radius } from "../constants/theme";

const { width } = Dimensions.get("window");

export default function BuildingCard({ building, onClose, onNavigate }) {
  const slideY = useRef(new Animated.Value(40)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [building]);

  if (!building) return null;

  return (
    <Animated.View
      style={[s.card, { opacity: fadeIn, transform: [{ translateY: slideY }] }]}
    >
      {/* Close button */}
      <TouchableOpacity style={s.close} onPress={onClose}>
        <Text style={s.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={s.header}>
        <View style={[s.iconWrap, { backgroundColor: building.color }]}>
          <Text style={{ fontSize: 22 }}>{building.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>{building.name}</Text>
          <Text style={s.sub}>{building.subtitle}</Text>
        </View>
      </View>

      {/* Distance */}
      <View style={s.distRow}>
        <Text style={s.distVal}>{building.dist}</Text>
        <Text style={s.distLabel}> away · {building.eta} walk</Text>
      </View>

      {/* Facilities */}
      <Text style={s.sectionLabel}>FACILITIES</Text>
      <View style={s.tags}>
        {building.facilities.map((f) => (
          <View key={f} style={s.tag}>
            <Text style={s.tagText}>{f}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={s.actions}>
        <TouchableOpacity
          style={s.btnPrimary}
          onPress={() => onNavigate(building)}
          activeOpacity={0.85}
        >
          <Text style={s.btnPrimaryText}>▶ Navigate Here</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.btnSecondary}
          onPress={onClose}
          activeOpacity={0.85}
        >
          <Text style={s.btnSecondaryText}>Back</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: {
    position: "absolute",
    bottom: 320,
    alignSelf: "center",
    width: width - 32,
    backgroundColor: "rgba(10,14,20,0.97)",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  close: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  closeText: { color: colors.textSecondary, fontSize: 14 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 15, fontWeight: "800", color: "#fff" },
  sub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  distRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 12 },
  distVal: { fontSize: 18, fontWeight: "900", color: colors.primary },
  distLabel: { fontSize: 12, color: colors.textMuted },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  tagText: { fontSize: 10, fontWeight: "700", color: colors.textSecondary },
  actions: { flexDirection: "row", gap: 8 },
  btnPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnPrimaryText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primaryText,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnSecondaryText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
  },
});
