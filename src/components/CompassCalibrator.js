// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — CompassCalibrator (Option 2)
//
// A small in-AR overlay that lets the user correct the compass offset
// on the fly. Tap + or - to shift the heading by 5° at a time.
//
// HOW TO USE ON CAMPUS:
//   1. Stand facing a known direction (e.g. facing north toward a building)
//   2. Check what the compass reads in the top-right of ARScreen
//   3. Tap +5 or -5 until the arrows point the right way
//   4. The offset is saved — persists across sessions
//
// Props:
//   offset    {number}    — current offset in degrees
//   onAdjust  {function}  — (newOffset) => void
//   heading   {number}    — current corrected heading (for display)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { t } from "../constants/i18n";

const GREEN = "#00C853";

export default function CompassCalibrator({ offset, onAdjust, heading, lang = "en" }) {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <TouchableOpacity style={s.collapsed} onPress={() => setExpanded(true)} activeOpacity={0.8}>
        <Text style={s.collapsedText}>CAL {Math.round(heading)}°</Text>
        <Text style={s.collapsedSub}>{t("compass.cal", lang)}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={s.panel}>
      <Text style={s.panelTitle}>{t("compass.title", lang)}</Text>
      <Text style={s.panelSub}>{t("compass.sub", lang)}</Text>

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

      <TouchableOpacity
        style={s.resetBtn}
        onPress={() => onAdjust(0)}
        activeOpacity={0.7}
      >
        <Text style={s.resetText}>{t("compass.reset", lang)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.closeBtn} onPress={() => setExpanded(false)} activeOpacity={0.7}>
        <Text style={s.closeText}>{t("compass.done", lang)}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  collapsed: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.3)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 54,
  },
  collapsedText: { fontSize: 11, fontWeight: "800", color: GREEN },
  collapsedSub:  { fontSize: 8,  color: "rgba(255,255,255,0.4)", marginTop: 1 },

  panel: {
    backgroundColor: "rgba(7,18,9,0.95)",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(0,200,83,0.3)",
    padding: 16,
    width: 200,
    alignItems: "center",
    gap: 8,
  },
  panelTitle: { fontSize: 13, fontWeight: "900", color: "#fff" },
  panelSub:   { fontSize: 10, color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: 15 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  btn: {
    backgroundColor: "rgba(0,200,83,0.15)",
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.4)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  btnText: { fontSize: 14, fontWeight: "900", color: GREEN },

  valueBox: { flex: 1, alignItems: "center" },
  valueText: { fontSize: 18, fontWeight: "900", color: "#fff" },
  valueSub:  { fontSize: 9,  color: "rgba(255,255,255,0.4)", marginTop: 2 },

  resetBtn: { marginTop: 4 },
  resetText: { fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: "700" },

  closeBtn: {
    backgroundColor: GREEN,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginTop: 4,
  },
  closeText: { fontSize: 12, fontWeight: "900", color: "#071209" },
});
