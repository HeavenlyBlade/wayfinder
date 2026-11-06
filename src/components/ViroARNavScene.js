// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — ViroARNavScene
//
// Continuous chevron trail using ViroBox ONLY (ViroPolygon crashes on Android).
// 7 chevrons spaced along the direction of travel, each built from 3 ViroBox
// shapes (left wing, right wing, no center gap = solid chevron >).
// They scale smaller near user and far away — middle ones are largest.
// Flowing pulse animation creates a "moving forward" wave effect.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from "react";
import { Platform } from "react-native";
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroNode,
  ViroBox,
  ViroText,
  ViroMaterials,
  ViroAnimations,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";

// ── Materials ─────────────────────────────────────────────────────────────────
ViroMaterials.createMaterials({
  chevron0: { lightingModel: "Constant", diffuseColor: "#00FF88" }, // brightest — mid distance
  chevron1: { lightingModel: "Constant", diffuseColor: "#00EE77" },
  chevron2: { lightingModel: "Constant", diffuseColor: "#00CC66" },
  chevron3: { lightingModel: "Constant", diffuseColor: "#00AA55" }, // darkest — far
});

// ── Animations — staggered delays create flowing wave ────────────────────────
ViroAnimations.registerAnimations({
  pulse0: { properties: { opacity: "0.35 => 1.0 => 0.35" }, easing: "EaseInOut", duration: 750, loop: true },
  pulse1: { properties: { opacity: "0.35 => 1.0 => 0.35" }, easing: "EaseInOut", duration: 750, loop: true },
  pulse2: { properties: { opacity: "0.35 => 1.0 => 0.35" }, easing: "EaseInOut", duration: 750, loop: true },
  pulse3: { properties: { opacity: "0.35 => 1.0 => 0.35" }, easing: "EaseInOut", duration: 750, loop: true },
  pulse4: { properties: { opacity: "0.35 => 1.0 => 0.35" }, easing: "EaseInOut", duration: 750, loop: true },
  pulse5: { properties: { opacity: "0.35 => 1.0 => 0.35" }, easing: "EaseInOut", duration: 750, loop: true },
  pulse6: { properties: { opacity: "0.35 => 1.0 => 0.35" }, easing: "EaseInOut", duration: 750, loop: true },
});

// ── Trail config ──────────────────────────────────────────────────────────────
// z: distance ahead (negative = forward in -Z)
// s: scale multiplier — creates perspective (mid ones biggest)
// mat: material key
// anim: animation name
// delay: ms delay for staggered wave effect
const TRAIL = [
  { z: -0.8, s: 0.50, mat: "chevron2", anim: "pulse0", delay: 0   },
  { z: -1.4, s: 0.65, mat: "chevron1", anim: "pulse1", delay: 107 },
  { z: -2.1, s: 0.80, mat: "chevron0", anim: "pulse2", delay: 214 },
  { z: -2.9, s: 1.00, mat: "chevron0", anim: "pulse3", delay: 321 },
  { z: -3.8, s: 0.80, mat: "chevron1", anim: "pulse4", delay: 428 },
  { z: -4.8, s: 0.65, mat: "chevron2", anim: "pulse5", delay: 535 },
  { z: -5.9, s: 0.50, mat: "chevron3", anim: "pulse6", delay: 642 },
];

// ── Single chevron from 3 ViroBox shapes ─────────────────────────────────────
// Built as a ">" shape:
//   - Left wing: tilted left pointing forward
//   - Right wing: tilted right pointing forward
//   - Both are flat (thin height) lying on the ground
function Chevron({ scale, material }) {
  const w = 0.30 * scale;  // wing half-width
  const h = 0.04 * scale;  // flat height (lying on ground)
  const l = 0.28 * scale;  // wing length

  return (
    <>
      {/* Left wing */}
      <ViroBox
        width={h}
        height={h}
        length={l}
        position={[-w * 0.5, 0, w * 0.3]}
        rotation={[0, 35, 0]}
        materials={[material]}
      />
      {/* Right wing */}
      <ViroBox
        width={h}
        height={h}
        length={l}
        position={[w * 0.5, 0, w * 0.3]}
        rotation={[0, -35, 0]}
        materials={[material]}
      />
    </>
  );
}

// ── Inner AR scene ────────────────────────────────────────────────────────────
function NavScene(props) {
  const { angleDiff, heading } = props;

  const [isTracking,    setIsTracking]    = useState(false);
  const [arrowRotation, setArrowRotation] = useState(0);
  const [isLimitedMode, setIsLimitedMode] = useState(false);

  const lastArrowYRef = useRef(0);
  const timeoutRef    = useRef(null);

  function handleTrackingUpdated(state) {
    const ok = state === ViroTrackingStateConstants.TRACKING_NORMAL ||
               state === ViroTrackingStateConstants.TRACKING_LIMITED;
    if (ok && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsTracking(ok);
  }

  // 10s fallback for Samsung/Android 16 ARCore tracking bug
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIsTracking(prev => {
        if (!prev) { setIsLimitedMode(true); return true; }
        return prev;
      });
    }, 10000);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  function handleCameraTransform(ct) {
    const rawYaw = ct?.rotation?.[1] ?? 0;
    const camYaw = ((rawYaw % 360) + 360) % 360;

    if (heading != null && angleDiff != null) {
      const bearing = ((heading + angleDiff) % 360 + 360) % 360;
      let rot = bearing - camYaw;
      if (rot >  180) rot -= 360;
      if (rot < -180) rot += 360;
      if (Math.abs(rot - lastArrowYRef.current) < 1.0) return;
      lastArrowYRef.current = rot;
      setArrowRotation(rot);
    } else {
      setArrowRotation(angleDiff ?? 0);
    }
  }

  return (
    <ViroARScene
      onTrackingUpdated={handleTrackingUpdated}
      onCameraTransformUpdate={handleCameraTransform}
    >

      {isTracking && (
        // All chevrons rotate together as one group
        <ViroNode
          position={[0, -0.2, 0]}
          rotation={[0, arrowRotation, 0]}
        >
          {TRAIL.map((cfg, i) => (
            <ViroNode
              key={i}
              position={[0, 0, cfg.z]}
              animation={{ name: cfg.anim, run: true, loop: true, delay: cfg.delay }}
            >
              <Chevron scale={cfg.s} material={cfg.mat} />
            </ViroNode>
          ))}
        </ViroNode>
      )}

      {!isTracking && (
        <ViroText
          text="Initializing AR..."
          position={[0, 0, -2]}
          scale={[0.5, 0.5, 0.5]}
          color="#ffffff"
        />
      )}

      {isTracking && isLimitedMode && (
        <ViroText
          text="Limited AR"
          position={[0, -0.8, -2.5]}
          scale={[0.4, 0.4, 0.4]}
          color="#FFD600"
        />
      )}

    </ViroARScene>
  );
}

// ── Wrapper ───────────────────────────────────────────────────────────────────
export default function ViroARNavScene({ angleDiff, heading, style }) {
  return (
    <ViroARSceneNavigator
      style={style}
      autofocus={Platform.OS === "ios"}
      initialScene={{ scene: NavScene }}
      viroAppProps={{ angleDiff, heading }}
    />
  );
}
