// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — ViroARNavScene
//
// AR navigation arrow using ViroBox only (confirmed safe in v2.53.1).
//
// Design: a clear downward-pointing navigation arrow (like a map pin arrow)
// that sits in front of the user at eye level. Smaller and less intrusive
// than previous versions — readable but not overwhelming.
//
// Key fixes vs previous:
// - 5° dead zone on rotation updates (was 1°) — prevents jitter/flying
// - Arrow is smaller and anchored closer to camera (1.8m not 2.5m)
// - No complex hover animations that fight with ARCore transforms
// - Single scale pulse only — minimal state changes = stable rendering
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from "react";
import { Platform } from "react-native";
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroNode,
  ViroBox,
  ViroSphere,
  ViroText,
  ViroMaterials,
  ViroAnimations,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";

ViroMaterials.createMaterials({
  arrowGreen: { lightingModel: "Constant", diffuseColor: "#00FF88" },
  arrowGlow:  { lightingModel: "Constant", diffuseColor: "#00FF88", transparency: 0.4 },
  orbGreen:   { lightingModel: "Constant", diffuseColor: "#00FFCC", transparency: 0.15 },
});

ViroAnimations.registerAnimations({
  pulse: {
    properties: { scaleX: "1.0 => 1.12 => 1.0", scaleY: "1.0 => 1.12 => 1.0", scaleZ: "1.0 => 1.12 => 1.0" },
    easing: "EaseInOut",
    duration: 1400,
    loop: true,
  },
});

// ── Arrow shape: classic downward-pointing navigation pin ─────────────────────
//
//      ████   ← wide top bar  (body top)
//      ████   ← body
//      ████   ← body bottom
//       ██    ← narrow tip pointing down
//
// Built from 3 ViroBox pieces rotated to face the camera
function Arrow({ materials }) {
  return (
    <>
      {/* Body — tall rectangle */}
      <ViroBox width={0.16} height={0.30} length={0.08} position={[0, 0.05, 0]} materials={materials} />
      {/* Wide shoulders at top */}
      <ViroBox width={0.28} height={0.10} length={0.08} position={[0, 0.17, 0]} materials={materials} />
      {/* Pointed tip at bottom */}
      <ViroBox width={0.10} height={0.16} length={0.08} position={[0, -0.14, 0]} rotation={[0, 0, 0]} materials={materials} />
      {/* Diagonal cuts for the tip — left */}
      <ViroBox width={0.10} height={0.14} length={0.08} position={[-0.07, -0.17, 0]} rotation={[0, 0, 28]} materials={materials} />
      {/* Diagonal cuts for the tip — right */}
      <ViroBox width={0.10} height={0.14} length={0.08} position={[0.07, -0.17, 0]} rotation={[0, 0, -28]} materials={materials} />
    </>
  );
}

// ── Inner AR scene ────────────────────────────────────────────────────────────
function NavScene(props) {
  const { angleDiff, heading } = props;

  const [isTracking,    setIsTracking]    = useState(false);
  const [arrowRotation, setArrowRotation] = useState(0);
  const [isLimitedMode, setIsLimitedMode] = useState(false);

  // Use refs to debounce rotation updates — prevents jitter/flying
  const lastRotationRef = useRef(0);
  const smoothRotRef    = useRef(0);
  const timeoutRef      = useRef(null);

  function handleTrackingUpdated(state) {
    const ok = state === ViroTrackingStateConstants.TRACKING_NORMAL ||
               state === ViroTrackingStateConstants.TRACKING_LIMITED;
    if (ok && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsTracking(ok);
  }

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

    let targetRot;
    if (heading != null && angleDiff != null) {
      const bearing = ((heading + angleDiff) % 360 + 360) % 360;
      let rot = bearing - camYaw;
      if (rot >  180) rot -= 360;
      if (rot < -180) rot += 360;
      targetRot = rot;
    } else {
      targetRot = angleDiff ?? 0;
    }

    // 5° dead zone — ignore tiny changes that cause jitter
    const diff = Math.abs(targetRot - lastRotationRef.current);
    const normalDiff = diff > 180 ? 360 - diff : diff;
    if (normalDiff < 5) return;

    // Simple lerp smoothing — 30% toward target each frame
    // This prevents the "flying away" snap when ARCore updates
    const lerped = lastRotationRef.current + (targetRot - lastRotationRef.current) * 0.3;
    lastRotationRef.current = lerped;

    // Only trigger React state update when change is meaningful (>5°)
    setArrowRotation(Math.round(lerped));
  }

  return (
    <ViroARScene
      onTrackingUpdated={handleTrackingUpdated}
      onCameraTransformUpdate={handleCameraTransform}
    >

      {isTracking && (
        <ViroNode
          position={[0, 0, -1.8]}
          rotation={[0, arrowRotation, 0]}
          animation={{ name: "pulse", run: true, loop: true }}
        >
          {/* Main arrow */}
          <Arrow materials={["arrowGreen"]} />

          {/* Glow halo — slightly larger, transparent */}
          <ViroBox width={0.34} height={0.12} length={0.04} position={[0, 0.17, 0]} materials={["arrowGlow"]} />
          <ViroBox width={0.20} height={0.34} length={0.04} position={[0, 0.05, 0]} materials={["arrowGlow"]} />

          {/* Ground dot — anchors the arrow to a spot */}
          <ViroSphere
            radius={0.05}
            widthSegmentCount={8}
            heightSegmentCount={8}
            position={[0, -0.32, 0]}
            materials={["orbGreen"]}
          />
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
          position={[0, -0.6, -2]}
          scale={[0.4, 0.4, 0.4]}
          color="#FFD600"
        />
      )}

    </ViroARScene>
  );
}

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
