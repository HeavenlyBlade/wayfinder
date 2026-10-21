// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — AR Navigation Tutorial
//
// Shown once when the user opens AR navigation for the first time.
// A 3-step walkthrough of the split-screen layout.
// Persisted via AsyncStorage — never shows again after dismissed.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, Dimensions, Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: W, height: H } = Dimensions.get("window");
const GREEN    = "#00C853";
const CAM_H    = H * 0.58;
const STORAGE  = "wayfinder_ar_tutorial_v2";

const STEPS = [
  {
    // Step 1 — Overview
    title:   "AR Navigation",
    body:    "The screen is split into two parts.\n\nTop half = live camera.\nBottom half = live map with your route.",
    hint:    null,
    anchor:  null,
  },
  {
    // Step 2 — Arrow
    title:   "The Arrow",
    body:    "Point your camera at the floor and slowly move the phone. When a surface grid appears, tap it to place the navigation arrow on the ground.\n\nThe green arrow floats above the surface, always pointing toward your next waypoint.",
    hint:    "Arrow turns red if the destination is behind you.",
    anchor:  "arrow",   // highlight the camera bottom-center area
  },
  {
    // Step 3 — Calibration
    title:   "Compass Calibration",
    body:    "If the arrow feels off, tap the Calibrate button (bottom-right of camera).\n\nTap +5 or -5 degrees to correct the heading until the arrow aligns with the real path.",
    hint:    "Do the figure-8 motion in Google Maps first for best accuracy.",
    anchor:  "cal",
  },
];

export default function ARTutorial({ lang = "en" }) {
  const [visible, setVisible] = useState(false);
  const [step,    setStep]    = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE).then(val => {
      if (val !== "true") setVisible(true);
    });
  }, []);

  async function dismiss() {
    await AsyncStorage.setItem(STORAGE, "true");
    setVisible(false);
  }

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible statusBarTranslucent>
      <View style={s.backdrop}>

        {/* Camera region — slightly dimmed, shows through */}
        <View style={s.cameraRegion} pointerEvents="none">

          {/* Arrow anchor highlight */}
          {current.anchor === "arrow" && (
            <View style={s.arrowHighlight}>
              <View style={s.highlightRing} />
              <Text style={s.highlightLabel}>↑ Follow this arrow</Text>
            </View>
          )}

          {/* Calibrator anchor highlight */}
          {current.anchor === "cal" && (
            <View style={s.calHighlight}>
              <View style={s.highlightRing} />
              <Text style={s.calHighlightLabel}>Calibrate here</Text>
            </View>
          )}
        </View>

        {/* Map region divider label */}
        {step === 0 && (
          <View style={s.mapLabel} pointerEvents="none">
            <Text style={s.mapLabelText}>↓ Live map below</Text>
          </View>
        )}

        {/* Tutorial card — pinned to bottom */}
        <View style={s.card}>

          {/* Step dots */}
          <View style={s.dotsRow}>
            {STEPS.map((_, i) => (
              <View key={i} style={[s.dot, i === step && s.dotActive]} />
            ))}
          </View>

          <Text style={s.title}>{current.title}</Text>
          <Text style={s.body}>{current.body}</Text>

          {current.hint && (
            <View style={s.hintBox}>
              <Text style={s.hintText}>* {current.hint}</Text>
            </View>
          )}

          {/* Buttons */}
          <View style={s.btnRow}>
            {step > 0 ? (
              <TouchableOpacity
                style={s.btnBack}
                onPress={() => setStep(s => s - 1)}
                activeOpacity={0.7}
              >
                <Text style={s.btnBackText}>← Back</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={s.btnSkip} onPress={dismiss} activeOpacity={0.7}>
                <Text style={s.btnSkipText}>Skip</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={s.btnNext}
              onPress={isLast ? dismiss : () => setStep(s => s + 1)}
              activeOpacity={0.85}
            >
              <Text style={s.btnNextText}>
                {isLast ? "Got it!" : "Next →"}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  // Camera region — transparent window so user can see layout
  cameraRegion: {
    width: W,
    height: CAM_H,
    position: "relative",
  },

  // Arrow highlight
  arrowHighlight: {
    position: "absolute",
    bottom: 20,
    left: W / 2 - 50,
    width: 100,
    alignItems: "center",
    gap: 6,
  },
  highlightRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2.5,
    borderColor: GREEN,
    backgroundColor: "rgba(0,200,83,0.1)",
  },
  highlightLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: GREEN,
    textAlign: "center",
  },

  // Calibrator highlight
  calHighlight: {
    position: "absolute",
    bottom: 16,
    right: 8,
    alignItems: "center",
    gap: 6,
  },
  calHighlightLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#ffc107",
    textAlign: "center",
  },

  // Map section divider label
  mapLabel: {
    height: H * 0.42,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 12,
  },
  mapLabelText: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(255,255,255,0.5)",
  },

  // Tutorial card
  card: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0d1a10",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: "rgba(0,200,83,0.25)",
    padding: 22,
    paddingBottom: Platform.OS === "android" ? 28 : 36,
    gap: 12,
  },

  dotsRow: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },
  dot: {
    width: 7, height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(0,200,83,0.2)",
  },
  dotActive: {
    backgroundColor: GREEN,
    width: 18,
  },

  title: {
    fontSize: 19,
    fontWeight: "900",
    color: "#ffffff",
    textAlign: "center",
  },
  body: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 22,
    textAlign: "center",
  },

  hintBox: {
    backgroundColor: "rgba(0,200,83,0.08)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  hintText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    lineHeight: 18,
    textAlign: "center",
  },

  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  btnSkip: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  btnSkipText: {
    fontSize: 13, fontWeight: "700",
    color: "rgba(255,255,255,0.3)",
  },
  btnBack: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
  },
  btnBackText: {
    fontSize: 13, fontWeight: "700",
    color: "rgba(255,255,255,0.4)",
  },
  btnNext: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 999,
    backgroundColor: GREEN,
    alignItems: "center",
  },
  btnNextText: {
    fontSize: 13, fontWeight: "900",
    color: "#071209",
  },
});
