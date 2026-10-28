// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — ViroARNavScene
//
// ViroReact AR navigation scene. Uses ViroBox primitives only (compatible with
// @reactvision/react-viro@2.53.1 which does not export ViroCylinder/ViroCone).
//
// Arrow shape: an UPRIGHT navigation pin — a thin tall vertical shaft (the
// flagpole stem) with a wide flat arrowhead at the top, tilted 45 deg on Z so it
// reads as a diamond/arrow from any angle. The whole pin stands vertically like a
// flagpole and rotates about Y (angleDiff) to face the direction of travel. A
// gentle scale pulse replaces the former flat-horizontal bob animation.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroText,
  ViroNode,
  ViroBox,
  ViroMaterials,
  ViroAnimations,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";

// ── Materials ─────────────────────────────────────────────────────────────────
ViroMaterials.createMaterials({
  arrowGreen: { lightingModel: "Blinn", diffuseColor: "#00FF88" },
  ringGreen:  { lightingModel: "Constant", diffuseColor: "#00FF88", transparency: 0.5 },
});

// ── Animations ────────────────────────────────────────────────────────────────
ViroAnimations.registerAnimations({
  arrowPulse: {
    properties: {
      scaleX: "1.0 => 1.08 => 1.0",
      scaleY: "1.0 => 1.08 => 1.0",
      scaleZ: "1.0 => 1.08 => 1.0",
    },
    easing: "EaseInOut",
    duration: 1200,
    loop: true,
  },
});

// ── Inner scene ───────────────────────────────────────────────────────────────
function NavScene(props) {
  const { angleDiff } = props;
  const [isTracking, setIsTracking] = useState(false);

  function handleTrackingUpdated(state) {
    setIsTracking(
      state === ViroTrackingStateConstants.TRACKING_NORMAL ||
      state === ViroTrackingStateConstants.TRACKING_LIMITED
    );
  }

  return (
    <ViroARScene onTrackingUpdated={handleTrackingUpdated}>

      {/* Upright navigation pin — shown once tracking starts */}
      {isTracking && (
        <ViroNode
          position={[0, 0.8, -2.5]}
          rotation={[0, angleDiff ?? 0, 0]}
          animation={{ name: "arrowPulse", run: true, loop: true }}
        >
          {/* Shaft — thin tall vertical flagpole stem */}
          <ViroBox
            width={0.08}
            height={0.6}
            length={0.08}
            position={[0, 0, 0]}
            materials={["arrowGreen"]}
          />
          {/* Head — wide flat arrowhead at the top, tilted 45 deg on Z so it
              reads as a diamond/arrow from any angle. The parent ViroNode's Y
              rotation (angleDiff) orients it toward the direction of travel. */}
          <ViroBox
            width={0.28}
            height={0.08}
            length={0.28}
            position={[0, 0.36, 0]}
            rotation={[0, 0, 45]}
            materials={["arrowGreen"]}
          />
        </ViroNode>
      )}

      {/* Ground ring beneath the pin */}
      {isTracking && (
        <ViroBox
          width={0.6}
          height={0.01}
          length={0.6}
          position={[0, 0.005, -2.5]}
          materials={["ringGreen"]}
        />
      )}

      {/* Scanning text while not tracking */}
      {!isTracking && (
        <ViroText
          text="Initializing AR..."
          position={[0, 0, -2]}
          scale={[0.5, 0.5, 0.5]}
          color="#ffffff"
        />
      )}
    </ViroARScene>
  );
}

// ── Wrapper ───────────────────────────────────────────────────────────────────
export default function ViroARNavScene({ angleDiff, style }) {
  return (
    <ViroARSceneNavigator
      style={style}
      initialScene={{ scene: NavScene }}
      viroAppProps={{ angleDiff }}
    />
  );
}
