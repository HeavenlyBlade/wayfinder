// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — CompassCalibrator
//
// In-AR overlay that provides real-time internal magnetometer status
// and lets the user correct the compass offset on the fly (±5°).
//
// Explains clearly:
//   - Current magnetometer accuracy & magnetic field strength (µT)
//   - Why calibration is necessary (phone cases, concrete rebar, cables)
//   - When and how to apply offset
//   - Figure-8 motion for hardware recalibration
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { t } from "../constants/i18n";

const { width: W } = Dimensions.get("window");
const GREEN = "#00C853";

export default function CompassCalibrator({
  offset = 0,
  onAdjust,
  heading = 0,
  compassQuality = "good",
  magneticField = 45,
  lang = "en",
}) {
  const [expanded, setExpanded] = useState(false);

  const dotColor =
    compassQuality === "good"
      ? "#00C853"
      : compassQuality === "fair"
      ? "#FFC107"
      : "#FF5252";

  const qualityLabel =
    compassQuality === "good"
      ? "Good"
      : compassQuality === "fair"
      ? "Fair"
      : "Low";

  if (!expanded) {
    return (
      <TouchableOpacity
        style={[s.collapsed, compassQuality === "poor" && s.collapsedWarn]}
        onPress={() => setExpanded(true)}
        activeOpacity={0.8}
      >
        <View style={s.collapsedHeader}>
          <View style={[s.statusDot, { backgroundColor: dotColor }]} />
          <Text style={[s.collapsedText, compassQuality === "poor" && { color: "#FFC107" }]}>
            CAL {Math.round(heading)}°
          </Text>
        </View>
        <Text style={s.collapsedSub}>
          {offset !== 0 ? `${offset > 0 ? "+" : ""}${Math.round(offset)}° offset` : `Mag ${qualityLabel}`}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={s.panel}>
      {/* Header with sensor quality indicator */}
      <View style={s.panelHeader}>
        <View style={[s.statusDotLarge, { backgroundColor: dotColor }]} />
        <Text style={s.panelTitle}>Compass & Heading Offset</Text>
      </View>

      {/* Real-time magnetometer readout */}
      <View style={[s.statusBanner, { borderColor: dotColor + "60" }]}>
        <Text style={[s.statusBannerTitle, { color: dotColor }]}>
          Magnetometer: {qualityLabel.toUpperCase()} ({magneticField} µT)
        </Text>
        <Text style={s.statusBannerDesc}>
          {compassQuality === "good"
            ? "Internal compass is calibrated and stable."
            : "Magnetic distortion detected from nearby metal, cables, or building rebar."}
        </Text>
      </View>

      {/* Why CAL exists — presentation & user guide */}
      <View style={s.infoCard}>
        <Text style={s.infoCardTitle}>Why is CAL needed?</Text>
        <Text style={s.infoCardText}>
          Phone magnetometers detect Earth's weak magnetic field (~40 µT). Campus concrete rebar, metal phone cases, or power cables can pull heading off by 10°–20°.
        </Text>
        <Text style={[s.infoCardText, { marginTop: 4, color: "#fff", fontWeight: "700" }]}>
          When to use: If the AR arrow points slightly left or right of the physical walkway, tap +5° or −5° to align it straight.
        </Text>
      </View>

      {/* Heading Offset Controls */}
      <View style={s.row}>
        <TouchableOpacity
          style={s.btn}
          onPress={() => onAdjust(offset - 5)}
          activeOpacity={0.8}
        >
          <Text style={s.btnText}>−5°</Text>
        </TouchableOpacity>

        <View style={s.valueBox}>
          <Text style={s.valueText}>{offset >= 0 ? "+" : ""}{Math.round(offset)}°</Text>
          <Text style={s.valueSub}>{Math.round(heading)}° heading</Text>
        </View>

        <TouchableOpacity
          style={s.btn}
          onPress={() => onAdjust(offset + 5)}
          activeOpacity={0.8}
        >
          <Text style={s.btnText}>+5°</Text>
        </TouchableOpacity>
      </View>

      {/* Figure 8 motion tip */}
      <View style={s.tipRow}>
        <Text style={s.tipIcon}>∞</Text>
        <Text style={s.tipText}>Wave phone in a figure-8 motion to recalibrate sensor</Text>
      </View>

      {/* Actions: Reset & Done */}
      <View style={s.actionRow}>
        <TouchableOpacity
          style={s.resetBtn}
          onPress={() => onAdjust(0)}
          activeOpacity={0.7}
        >
          <Text style={s.resetText}>Reset (0°)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.closeBtn} onPress={() => setExpanded(false)} activeOpacity={0.7}>
          <Text style={s.closeText}>{t("compass.done", lang)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  collapsed: {
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(0,200,83,0.35)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignItems: "center",
    minWidth: 68,
  },
  collapsedWarn: {
    borderColor: "rgba(255,193,7,0.5)",
    backgroundColor: "rgba(30,20,0,0.85)",
  },
  collapsedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  collapsedText: { fontSize: 11, fontWeight: "900", color: GREEN },
  collapsedSub:  { fontSize: 8, color: "rgba(255,255,255,0.6)", marginTop: 2, fontWeight: "600" },

  panel: {
    backgroundColor: "rgba(7,18,9,0.96)",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(0,200,83,0.3)",
    padding: 16,
    width: Math.min(260, W - 48),
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDotLarge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  panelTitle: { fontSize: 13, fontWeight: "900", color: "#fff" },

  statusBanner: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: "100%",
  },
  statusBannerTitle: {
    fontSize: 10,
    fontWeight: "800",
  },
  statusBannerDesc: {
    fontSize: 9,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
    lineHeight: 12,
  },

  infoCard: {
    backgroundColor: "rgba(0,200,83,0.06)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: "100%",
  },
  infoCardTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: GREEN,
    marginBottom: 2,
  },
  infoCardText: {
    fontSize: 9.5,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 13,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  btn: {
    backgroundColor: "rgba(0,200,83,0.15)",
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.4)",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  btnText: { fontSize: 13, fontWeight: "900", color: GREEN },

  valueBox: { flex: 1, alignItems: "center" },
  valueText: { fontSize: 18, fontWeight: "900", color: "#fff" },
  valueSub:  { fontSize: 8.5, color: "rgba(255,255,255,0.45)", marginTop: 1 },

  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: "100%",
  },
  tipIcon: { fontSize: 14, color: "#FFC107", fontWeight: "900" },
  tipText: { fontSize: 8.5, color: "rgba(255,255,255,0.5)", flex: 1, lineHeight: 11 },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 4,
  },
  resetBtn: { paddingVertical: 6, paddingHorizontal: 8 },
  resetText: { fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: "700" },

  closeBtn: {
    backgroundColor: GREEN,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  closeText: { fontSize: 11, fontWeight: "900", color: "#071209" },
});
