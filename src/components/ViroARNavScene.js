// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — ViroARNavScene
//
// Design based on arxiv user study (n=24, 2025):
//   "All navigational aids enhanced performance; strongest preference = in-world arrows.
//    But on-screen indicators work best when destination is behind user."
//
// DUAL APPROACH (best of both worlds):
//   1. BearingHUD (screen-space) — ALWAYS visible, shows direction even when
//      destination is behind. Already implemented in ARScreen.js.
//   2. World-space focal point — a simple glowing orb + direction cone
//      placed 2m ahead in the direction of travel. Gives spatial depth cue
//      when the destination is in front. Minimal — doesn't compete with HUD.
//
// The orb is the ONLY 3D element. No complex arrow that "flies away."
// The BearingHUD arc at the top of the screen is the primary navigator.
//
// ViroBox only — ViroSphere confirmed safe. No ViroPolygon/ViroCylinder.
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
  orbSolid: { lightingModel: "Constant", diffuseColor: "#00FF88" },
  orbGlow:  { lightingModel: "Constant", diffuseColor: "#00FF88", transparency: 0.5 },
  cone:     { lightingModel: "Constant", diffuseColor: "#00FF88", transparency: 0.25 },
});

ViroAnimations.registerAnimations({
  orbPulse: {
    properties: {
      scaleX: "1.0 => 1.3 => 1.0",
      scaleY: "1.0 => 1.3 => 1.0",
      scaleZ: "1.0 => 1.3 => 1.0",
    },
    easing: "EaseInOut",
    duration: 1000,
    loop: true,
  },
  glowPulse: {
    properties: {
      scaleX: "1.0 => 1.8 => 1.0",
      scaleY: "1.0 => 1.8 => 1.0",
      scaleZ: "1.0 => 1.8 => 1.0",
    },
    easing: "EaseOut",
    duration: 1000,
    loop: true,
  },
});

function NavScene(props) {
  const { angleDiff, heading } = props;

  const [isTracking,    setIsTracking]    = useState(false);
  const [orbRotation,   setOrbRotation]   = useState(0);
  const [isLimitedMode, setIsLimitedMode] = useState(false);

  const lastRotRef  = useRef(0);
  const timeoutRef  = useRef(null);

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

    if (heading != null && angleDiff != null) {
      const bearing = ((heading + angleDiff) % 360 + 360) % 360;
      let rot = bearing - camYaw;
      if (rot >  180) rot -= 360;
      if (rot < -180) rot += 360;

      // 8° dead zone — prevent jitter from small phone movements
      const diff = Math.abs(rot - lastRotRef.current);
      const nd = diff > 180 ? 360 - diff : diff;
      if (nd < 8) return;

      // Lerp 25% toward target — smooth, no snapping
      const lerped = lastRotRef.current + (rot - lastRotRef.current) * 0.25;
      lastRotRef.current = lerped;
      setOrbRotation(Math.round(lerped));
    }
  }

  // Only show the orb when destination is roughly ahead (within ±70°)
  // When behind, the BearingHUD handles it — no need for a confusing world object
  const isAhead = Math.abs(angleDiff ?? 0) < 70;

  return (
    <ViroARScene
      onTrackingUpdated={handleTrackingUpdated}
      onCameraTransformUpdate={handleCameraTransform}
    >
      {isTracking && isAhead && (
        <ViroNode
          position={[0, 0, 0]}
          rotation={[0, orbRotation, 0]}
        >
          {/* Direction cone — subtle wedge showing "go this way" */}
          <ViroBox
            width={0.06}
            height={0.06}
            length={1.2}
            position={[0, -0.3, -1.1]}
            materials={["cone"]}
          />

          {/* Main orb — focal point 2m ahead */}
          <ViroNode
            position={[0, -0.1, -2.0]}
            animation={{ name: "orbPulse", run: true, loop: true }}
          >
            <ViroSphere
              radius={0.12}
              widthSegmentCount={10}
              heightSegmentCount={10}
              materials={["orbSolid"]}
            />
          </ViroNode>

          {/* Glow halo around orb */}
          <ViroNode
            position={[0, -0.1, -2.0]}
            animation={{ name: "glowPulse", run: true, loop: true }}
          >
            <ViroSphere
              radius={0.18}
              widthSegmentCount={8}
              heightSegmentCount={8}
              materials={["orbGlow"]}
            />
          </ViroNode>
        </ViroNode>
      )}

      {/* Show a subtle left/right indicator when destination is to the side */}
      {isTracking && !isAhead && (
        <ViroText
          text={angleDiff > 0 ? "► Turn Right" : "◄ Turn Left"}
          position={[angleDiff > 0 ? 0.4 : -0.4, 0, -1.5]}
          scale={[0.3, 0.3, 0.3]}
          color="#00FF88"
        />
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
