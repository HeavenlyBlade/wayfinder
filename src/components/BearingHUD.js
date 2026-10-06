// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — BearingHUD (Option 3)
//
// A top-of-screen arc indicator that shows exactly where the destination is
// relative to your current heading. Always accurate regardless of compass
// quality — it only needs the bearing angle, not absolute GPS projection.
//
// Visual: a horizontal arc at the top of the screen with a pointer marker
// that moves left/right to show the direction to the destination.
// When the destination is directly ahead, the pointer is centered.
// When it's to the right, pointer shifts right. Behind you = edges.
//
// Props:
//   angleDiff  {number}  — degrees from current heading to destination
//                          (negative = left, positive = right, 0 = ahead)
//   distance   {number}  — metres to destination
//   destName   {string}  — name shown in the indicator
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import Svg, { Path, Circle, Line, Text as SvgText } from "react-native-svg";
import { t } from "../constants/i18n";

const { width: W } = Dimensions.get("window");
const GREEN    = "#00C853";
const ARC_W    = W - 32;
const ARC_H    = 56;
const HALF     = ARC_W / 2;

// Map angleDiff (-180 to 180) to x position on the arc (0 to ARC_W)
// Clamp at ±90° to keep the pointer visible
function angleToX(angleDiff) {
  const clamped = Math.max(-90, Math.min(90, angleDiff));
  return HALF + (clamped / 90) * HALF;
}

export default function BearingHUD({ angleDiff, distance, destName, lang = "en" }) {
  const animX = useRef(new Animated.Value(angleToX(angleDiff ?? 0))).current;

  useEffect(() => {
    Animated.spring(animX, {
      toValue:    angleToX(angleDiff ?? 0),
      speed:      20,
      bounciness: 2,
      useNativeDriver: false,
    }).start();
  }, [angleDiff]);

  const isAhead  = Math.abs(angleDiff ?? 0) < 25;
  const isBehind = Math.abs(angleDiff ?? 0) > 135;

  return (
    <View style={s.container}>
      {/* Arc background */}
      <Svg width={ARC_W} height={ARC_H} style={s.svg}>
        {/* Arc track */}
        <Path
          d={`M 0 ${ARC_H - 10} Q ${HALF} 0 ${ARC_W} ${ARC_H - 10}`}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={2}
          fill="none"
        />
        {/* Center tick — "straight ahead" */}
        <Line
          x1={HALF} y1={ARC_H - 20}
          x2={HALF} y2={ARC_H - 8}
          stroke="rgba(255,255,255,0.4)"
          strokeWidth={1.5}
        />
        {/* Left tick */}
        <Line
          x1={HALF * 0.2} y1={ARC_H - 12}
          x2={HALF * 0.2} y2={ARC_H - 6}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1}
        />
        {/* Right tick */}
        <Line
          x1={ARC_W - HALF * 0.2} y1={ARC_H - 12}
          x2={ARC_W - HALF * 0.2} y2={ARC_H - 6}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1}
        />
        {/* Labels */}
        <SvgText x={6}        y={ARC_H - 2} fontSize={8} fill="rgba(255,255,255,0.25)" textAnchor="start">◄</SvgText>
        <SvgText x={ARC_W - 6} y={ARC_H - 2} fontSize={8} fill="rgba(255,255,255,0.25)" textAnchor="end">►</SvgText>
      </Svg>

      {/* Animated destination pointer */}
      <Animated.View
        style={[
          s.pointer,
          {
            left: Animated.add(animX, new Animated.Value(16 - 6)), // 16=padding, 6=half pointer width
            backgroundColor: isBehind ? "#ff5555" : isAhead ? GREEN : "#ffc107",
          },
        ]}
      >
        <View style={[s.pointerTriangle, {
          borderBottomColor: isBehind ? "#ff5555" : isAhead ? GREEN : "#ffc107",
        }]} />
      </Animated.View>

      {/* Destination label + distance */}
      <View style={s.label}>
        <Text style={s.labelIcon}>
          {isBehind ? "<-" : isAhead ? "^" : angleDiff < 0 ? "<" : ">"}
        </Text>
        <Text style={s.labelDirHint}>
          {isBehind
            ? t("bearing.behind", lang)
            : isAhead
            ? t("bearing.ahead", lang)
            : angleDiff < 0
            ? t("bearing.left", lang)
            : t("bearing.right", lang)}
        </Text>
        <Text style={s.labelName} numberOfLines={1}>{destName}</Text>
        {distance != null && (
          <Text style={s.labelDist}>{distance}m</Text>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
  },
  svg: {
    position: "relative",
  },
  pointer: {
    position: "absolute",
    top: ARC_H - 18,
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 10,
  },
  pointerTriangle: {
    position: "absolute",
    top: -7,
    left: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(0,200,83,0.25)",
    maxWidth: W - 60,
  },
  labelIcon: { fontSize: 13, color: GREEN, fontWeight: "900" },
  labelDirHint: { fontSize: 10, fontWeight: "700", color: "rgba(255,255,255,0.45)" },
  labelName: { fontSize: 12, fontWeight: "800", color: "#fff", flex: 1 },
  labelDist: { fontSize: 11, fontWeight: "700", color: "rgba(255,255,255,0.5)" },
});
