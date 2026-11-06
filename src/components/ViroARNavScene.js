// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — ViroARNavScene
//
// AR navigation arrow — flat chevron on the ground + stretching line to
// next waypoint + pulsing orb at the tip. Similar to Google Maps Live View.
//
// Shape design:
//   - A flat ground-level chevron (ViroPolygon) pointing forward
//   - A thin line (ViroPolyline) stretching 4m ahead toward the waypoint
//   - A glowing pulsing orb (ViroSphere) at the end of the line
//   - Everything rotates in Y to face the correct compass direction
//
// Arrow rotation:
//   ARCore world -Z axis is wherever camera was at session start (arbitrary).
//   We use onCameraTransformUpdate to get camera yaw, then:
//     arrowRotation = absoluteCompassBearing - cameraYaw
//   where absoluteCompassBearing = (heading + angleDiff) mod 360
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from "react";
import { Platform } from "react-native";
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroNode,
  ViroPolygon,
  ViroPolyline,
  ViroSphere,
  ViroBox,
  ViroText,
  ViroMaterials,
  ViroAnimations,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";

// ── Materials ─────────────────────────────────────────────────────────────────
ViroMaterials.createMaterials({
  // Bright green — Constant so it's always full brightness outdoors
  chevronGreen: { lightingModel: "Constant", diffuseColor: "#00FF88" },
  // Orb at waypoint — slightly cyan for contrast vs chevron
  orbCyan:      { lightingModel: "Constant", diffuseColor: "#00FFDD", transparency: 0.1 },
  // Semi-transparent ground ring
  ringGreen:    { lightingModel: "Constant", diffuseColor: "#00FF88", transparency: 0.55 },
});

// ── Animations ────────────────────────────────────────────────────────────────
ViroAnimations.registerAnimations({
  // Orb pulses in size — gives a "alive" feel and draws the eye forward
  orbPulse: {
    properties: {
      scaleX: "1.0 => 1.35 => 1.0",
      scaleY: "1.0 => 1.35 => 1.0",
      scaleZ: "1.0 => 1.35 => 1.0",
    },
    easing: "EaseInOut",
    duration: 900,
    loop: true,
  },
  // Chevron bobs slightly — subtle up/down movement to attract attention
  chevronBob: {
    properties: { positionY: "0.05 => 0.12 => 0.05" },
    easing: "EaseInOut",
    duration: 1400,
    loop: true,
  },
});

// ── Chevron vertices (flat, pointing in -Z direction = forward in AR world) ──
// Lies flat on the ground (Y ≈ 0). A wide chevron like a ">" rotated 90°.
//   Width: 0.7m total span
//   Depth: 0.5m from tail to tip
const CHEVRON_VERTS = [
  // Tip (front, pointing -Z)
  [0,    0.06,  -0.25],
  // Left wing
  [-0.35, 0.06,  0.25],
  // Left inner notch
  [-0.15, 0.06,  0.08],
  // Right inner notch
  [ 0.15, 0.06,  0.08],
  // Right wing
  [ 0.35, 0.06,  0.25],
];
// Triangle indices for the chevron polygon faces (two triangles each side)
const CHEVRON_IDX = [
  [0, 1, 2], // left face
  [0, 2, 3], // center
  [0, 3, 4], // right face
];

// ── Inner AR scene ────────────────────────────────────────────────────────────
function NavScene(props) {
  const { angleDiff, heading } = props;

  const [isTracking,    setIsTracking]    = useState(false);
  const [arrowRotation, setArrowRotation] = useState(0);
  const [isLimitedMode, setIsLimitedMode] = useState(false);

  const cameraYawRef    = useRef(0);
  const lastArrowYRef   = useRef(0);
  const trackingTimeout = useRef(null);

  // ── Tracking state ──────────────────────────────────────────────────────────
  function handleTrackingUpdated(state) {
    const ok = state === ViroTrackingStateConstants.TRACKING_NORMAL ||
               state === ViroTrackingStateConstants.TRACKING_LIMITED;
    if (ok && trackingTimeout.current) {
      clearTimeout(trackingTimeout.current);
      trackingTimeout.current = null;
    }
    setIsTracking(ok);
  }

  // 10-second fallback — Samsung/Android 16 ARCore bug: tracking never settles
  useEffect(() => {
    trackingTimeout.current = setTimeout(() => {
      setIsTracking(prev => {
        if (!prev) { setIsLimitedMode(true); return true; }
        return prev;
      });
    }, 10000);
    return () => { if (trackingTimeout.current) clearTimeout(trackingTimeout.current); };
  }, []);

  // ── Camera yaw → arrow rotation ─────────────────────────────────────────────
  function handleCameraTransform(ct) {
    const rawYaw = ct?.rotation?.[1] ?? 0;
    const camYaw = ((rawYaw % 360) + 360) % 360;
    cameraYawRef.current = camYaw;

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

      {/* ── Main navigation arrow group ── */}
      {isTracking && (
        <ViroNode
          position={[0, 0, 0]}
          rotation={[0, arrowRotation, 0]}
        >
          {/* Flat chevron on the ground, 1.5m ahead */}
          <ViroNode
            position={[0, 0, -1.5]}
            animation={{ name: "chevronBob", run: true, loop: true }}
          >
            <ViroPolygon
              vertices={CHEVRON_VERTS}
              triangleIndices={CHEVRON_IDX}
              materials={["chevronGreen"]}
            />
          </ViroNode>

          {/* Stretching line from user to waypoint (1m to 4m ahead) */}
          <ViroPolyline
            points={[
              [0,  0.05, -0.8],  // start — near user's feet
              [0,  0.05, -4.0],  // end   — 4m ahead
            ]}
            thickness={0.025}
            materials={["chevronGreen"]}
          />

          {/* Pulsing orb at end of line — the "target" indicator */}
          <ViroNode
            position={[0, 0.12, -4.0]}
            animation={{ name: "orbPulse", run: true, loop: true }}
          >
            <ViroSphere
              radius={0.18}
              widthSegmentCount={12}
              heightSegmentCount={12}
              materials={["orbCyan"]}
            />
          </ViroNode>

          {/* Subtle ground ring at user's feet to anchor the direction */}
          <ViroBox
            width={0.55}
            height={0.012}
            length={0.55}
            position={[0, 0.006, -1.0]}
            materials={["ringGreen"]}
          />
        </ViroNode>
      )}

      {/* Initializing text */}
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
          position={[0, -0.5, -2.5]}
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
