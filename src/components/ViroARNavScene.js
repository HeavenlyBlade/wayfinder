// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — ViroARNavScene
//
// AR navigation indicator using ViroBox ONLY (confirmed safe in v2.53.1).
//
// Design: a single large navigation arrow composed of:
//   - A wide flat arrowhead (pointing -Z = forward)
//   - A rectangular shaft below the arrowhead
// Placed at eye level 2.5m ahead. Rotates in Y to face direction of travel.
// Below it: 3 smaller pulse-rings on the ground to draw the eye forward.
//
// This is modeled after Google Maps' AR Live View directional indicator —
// a bold single arrow that fills the camera view and is impossible to miss.
//
// Color: bright #00FF88 (Constant lighting = full brightness outdoors/indoors)
// Animation: gentle hover (up/down) + ground rings pulse outward
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

// ── Materials ─────────────────────────────────────────────────────────────────
ViroMaterials.createMaterials({
  arrowSolid: {
    lightingModel: "Constant",
    diffuseColor: "#00FF88",
  },
  arrowGlow: {
    lightingModel: "Constant",
    diffuseColor: "#00FF88",
    transparency: 0.35,
  },
  ringFade: {
    lightingModel: "Constant",
    diffuseColor: "#00FF88",
    transparency: 0.55,
  },
});

// ── Animations ────────────────────────────────────────────────────────────────
ViroAnimations.registerAnimations({
  // Arrow hovers up and down — feels alive, draws attention
  arrowHover: {
    properties: { positionY: "0.0 => 0.18 => 0.0" },
    easing: "EaseInOut",
    duration: 1600,
    loop: true,
  },
  // Ground rings pulse outward (scale) and fade
  ringPulse1: {
    properties: { scaleX: "0.5 => 1.4 => 0.5", scaleZ: "0.5 => 1.4 => 0.5" },
    easing: "EaseOut",
    duration: 1200,
    loop: true,
  },
  ringPulse2: {
    properties: { scaleX: "0.5 => 1.4 => 0.5", scaleZ: "0.5 => 1.4 => 0.5" },
    easing: "EaseOut",
    duration: 1200,
    loop: true,
    delay: 400,
  },
  ringPulse3: {
    properties: { scaleX: "0.5 => 1.4 => 0.5", scaleZ: "0.5 => 1.4 => 0.5" },
    easing: "EaseOut",
    duration: 1200,
    loop: true,
    delay: 800,
  },
});

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

  // 10s Samsung/Android 16 ARCore bug fallback
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
        // Master rotation node — everything turns together
        <ViroNode
          position={[0, 0, -2.5]}
          rotation={[0, arrowRotation, 0]}
        >

          {/* ── MAIN ARROW — hovering at eye level ── */}
          <ViroNode
            position={[0, 0.15, 0]}
            animation={{ name: "arrowHover", run: true, loop: true }}
          >
            {/* Arrowhead — wide flat triangle shape made from 3 boxes */}
            {/* Center tip */}
            <ViroBox
              width={0.18}
              height={0.12}
              length={0.32}
              position={[0, 0, -0.18]}
              materials={["arrowSolid"]}
            />
            {/* Left wing */}
            <ViroBox
              width={0.32}
              height={0.12}
              length={0.18}
              position={[-0.22, 0, -0.02]}
              rotation={[0, 38, 0]}
              materials={["arrowSolid"]}
            />
            {/* Right wing */}
            <ViroBox
              width={0.32}
              height={0.12}
              length={0.18}
              position={[0.22, 0, -0.02]}
              rotation={[0, -38, 0]}
              materials={["arrowSolid"]}
            />
            {/* Shaft — below arrowhead */}
            <ViroBox
              width={0.14}
              height={0.12}
              length={0.28}
              position={[0, 0, 0.22]}
              materials={["arrowSolid"]}
            />

            {/* Outer glow — slightly larger, semi-transparent */}
            <ViroBox
              width={0.22}
              height={0.04}
              length={0.38}
              position={[0, 0, -0.18]}
              materials={["arrowGlow"]}
            />
            <ViroBox
              width={0.38}
              height={0.04}
              length={0.22}
              position={[-0.24, 0, -0.02]}
              rotation={[0, 38, 0]}
              materials={["arrowGlow"]}
            />
            <ViroBox
              width={0.38}
              height={0.04}
              length={0.22}
              position={[0.24, 0, -0.02]}
              rotation={[0, -38, 0]}
              materials={["arrowGlow"]}
            />
          </ViroNode>

          {/* ── GROUND INDICATOR — pulsing rings at user's feet ── */}
          {/* These rings pulse outward to show "walk this way" */}
          <ViroNode position={[0, -0.85, 0.4]}>
            <ViroBox
              width={0.7}
              height={0.015}
              length={0.7}
              position={[0, 0, 0]}
              animation={{ name: "ringPulse1", run: true, loop: true }}
              materials={["ringFade"]}
            />
          </ViroNode>
          <ViroNode position={[0, -0.85, 0.4]}>
            <ViroBox
              width={0.7}
              height={0.015}
              length={0.7}
              position={[0, 0, 0]}
              animation={{ name: "ringPulse2", run: true, loop: true }}
              materials={["ringFade"]}
            />
          </ViroNode>
          <ViroNode position={[0, -0.85, 0.4]}>
            <ViroBox
              width={0.7}
              height={0.015}
              length={0.7}
              position={[0, 0, 0]}
              animation={{ name: "ringPulse3", run: true, loop: true }}
              materials={["ringFade"]}
            />
          </ViroNode>

          {/* ── DESTINATION ORBS — 3 spheres fading into the distance ── */}
          <ViroSphere
            radius={0.07}
            widthSegmentCount={8}
            heightSegmentCount={8}
            position={[0, -0.5, -0.8]}
            materials={["arrowSolid"]}
          />
          <ViroSphere
            radius={0.055}
            widthSegmentCount={8}
            heightSegmentCount={8}
            position={[0, -0.6, -2.0]}
            materials={["arrowGlow"]}
          />
          <ViroSphere
            radius={0.04}
            widthSegmentCount={8}
            heightSegmentCount={8}
            position={[0, -0.65, -3.5]}
            materials={["arrowGlow"]}
          />

        </ViroNode>
      )}

      {/* Scanning text */}
      {!isTracking && (
        <ViroText
          text="Initializing AR..."
          position={[0, 0, -2]}
          scale={[0.5, 0.5, 0.5]}
          color="#ffffff"
        />
      )}

      {/* Limited mode badge */}
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
