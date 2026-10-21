import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { colors, radius } from "../constants/theme";
import BuildingIcon from "./BuildingIcon";
import { distanceTo } from "../utils/arMath";
import { NODES } from "../constants/campusGraph";
import FloorBrowser from "./FloorBrowser";
import { useSettings } from "../context/SettingsContext";
import { t } from "../constants/i18n";
import BuildingImagePreview from "./BuildingImagePreview";

const { width } = Dimensions.get("window");

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Format a raw metre value to a human-readable string. */
function formatDist(metres) {
  if (metres == null || isNaN(metres)) return "—";
  if (metres < 1000) return `${Math.round(metres)}m`;
  return `${(metres / 1000).toFixed(1)}km`;
}

/** Walking-time estimate based on 1.4 m/s average pace. */
function formatEta(metres) {
  if (metres == null || isNaN(metres)) return "";
  const seconds = metres / 1.4;
  if (seconds < 60) return "< 1 min";
  return `~${Math.ceil(seconds / 60)} min`;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * BuildingCard
 *
 * Props:
 *   building     — building object from buildings.js
 *   userLocation — { lat, lng } from useLocation hook (optional).
 *                  When provided, distance and ETA are computed live.
 *   onClose      — () => void
 *   onNavigate   — (building) => void
 */
export default function BuildingCard({ building, userLocation, onClose, onNavigate }) {
  const slideY = useRef(new Animated.Value(40)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const { settings } = useSettings();
  const lang = settings?.language ?? "en";
  const [floorBrowserVisible, setFloorBrowserVisible] = useState(false);

  useEffect(() => {
    // Reset and re-animate whenever the selected building changes
    slideY.setValue(40);
    fadeIn.setValue(0);
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
  }, [building?.id]);

  if (!building) return null;

  // Compute live distance when GPS is available, otherwise fall back to the
  // static label baked into the building data.
  let distLabel = building.dist_label ?? building.dist ?? "—";
  let etaLabel  = building.eta ?? "";

  if (
    userLocation?.lat != null &&
    userLocation?.lng != null &&
    building.id !== "gate" // avoid showing "0m" for the gate itself
  ) {
    const node = NODES[building.id];
    if (node) {
      const metres = distanceTo(
        userLocation.lat, userLocation.lng,
        node.lat,         node.lng,
      );
      distLabel = formatDist(metres);
      etaLabel  = formatEta(metres);
    }
  }

  return (
    <Animated.View
      style={[s.card, { opacity: fadeIn, transform: [{ translateY: slideY }] }]}
    >
      {/* Building image preview */}
      <BuildingImagePreview buildingId={building.id} buildingName={building.name} style={s.imagePreview} />

      {/* Close button */}
      <TouchableOpacity style={s.close} onPress={onClose} activeOpacity={0.7}>
        <Text style={s.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={s.header}>
        <View style={[s.iconWrap, { backgroundColor: (building.color ?? "#1a3a1a") + "cc" }]}>
          <BuildingIcon iconKey={building.icon} size={22} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.title} numberOfLines={1}>{building.name}</Text>
          <Text style={s.sub}  numberOfLines={1}>{building.subtitle}</Text>
        </View>
      </View>

      {/* Distance row */}
      <View style={s.distRow}>
        <Text style={s.distVal}>{distLabel}</Text>
        {etaLabel ? <Text style={s.distLabel}> away · {etaLabel} walk</Text> : null}
      </View>

      {/* Facilities */}
      {building.facilities?.length > 0 && (
        <>
          <Text style={s.sectionLabel}>FACILITIES</Text>
          <View style={s.tags}>
            {building.facilities.slice(0, 8).map((f) => (
              <View key={f} style={s.tag}>
                <Text style={s.tagText}>{f}</Text>
              </View>
            ))}
            {building.facilities.length > 8 && (
              <View style={[s.tag, s.tagMore]}>
                <Text style={s.tagText}>+{building.facilities.length - 8} more</Text>
              </View>
            )}
          </View>
        </>
      )}

      {/* Action buttons */}
      <View style={s.actions}>
        {/* View Floors — only shown when floor data exists */}
        {building.floors?.length > 0 && (
          <TouchableOpacity
            style={s.btnFloors}
            onPress={() => setFloorBrowserVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={s.btnFloorsText}>{t('map.viewFloors', lang)}</Text>
          </TouchableOpacity>
        )}

        {/* Navigate + Close row */}
        <View style={s.actionsRow}>
          <TouchableOpacity
            style={s.btnPrimary}
            onPress={() => onNavigate(building)}
            activeOpacity={0.85}
          >
            <Text style={s.btnPrimaryText}>▶ {t('map.navigate', lang)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.btnSecondary}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={s.btnSecondaryText}>{t('map.close', lang)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Floor browser sheet */}
      <FloorBrowser
        building={building}
        visible={floorBrowserVisible}
        onClose={() => setFloorBrowserVisible(false)}
      />
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: {
    position: "absolute",
    bottom: 80,
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
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 15, fontWeight: "800", color: "#fff" },
  sub:   { fontSize: 11, color: colors.textMuted, marginTop: 2 },

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
  tagMore: {
    backgroundColor: "rgba(0,200,83,0.08)",
    borderColor: "rgba(0,200,83,0.2)",
  },
  tagText: { fontSize: 10, fontWeight: "700", color: colors.textSecondary },

  actions: { flexDirection: "column", gap: 8 },
  actionsRow: { flexDirection: "row", gap: 8 },
  btnFloors: {
    width: "100%",
    backgroundColor: "rgba(0,200,83,0.1)",
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.25)",
  },
  btnFloorsText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primary,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnPrimaryText: { fontSize: 13, fontWeight: "800", color: colors.primaryText },
  btnSecondary: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnSecondaryText: { fontSize: 13, fontWeight: "700", color: colors.textSecondary },

  imagePreview: {
    marginHorizontal: -20,
    marginTop: -20,
    marginBottom: 14,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
});
