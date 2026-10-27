// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — ViroARNavScene
//
// ViroReact AR navigation scene. Uses ViroBox primitives only (compatible with
// @reactvision/react-viro@2.53.1 which does not export ViroCylinder/ViroCone).
//
// Arrow shape: a flat shaft box + wider head box, forming a clear directional
// arrow lying horizontally 0.15m above the detected surface, 2m ahead.
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
  arrowBob: {
    properties: { positionY: "0.15 => 0.25 => 0.15" },
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

      {/* Arrow — shown once tracking starts */}
      {isTracking && (
        <ViroNode
          position={[0, 0.15, -2.0]}
          rotation={[0, angleDiff ?? 0, 0]}
          animation={{ name: "arrowBob", run: true, loop: true }}
        >
          {/* Shaft — long thin box along -Z axis */}
          <ViroBox
            width={0.10}
            height={0.06}
            length={0.55}
            position={[0, 0, 0.10]}
            materials={["arrowGreen"]}
          />
          {/* Left wing of arrowhead */}
          <ViroBox
            width={0.20}
            height={0.06}
            length={0.22}
            position={[-0.12, 0, -0.22]}
            rotation={[0, -38, 0]}
            materials={["arrowGreen"]}
          />
          {/* Right wing of arrowhead */}
          <ViroBox
            width={0.20}
            height={0.06}
            length={0.22}
            position={[0.12, 0, -0.22]}
            rotation={[0, 38, 0]}
            materials={["arrowGreen"]}
          />
        </ViroNode>
      )}

      {/* Ground ring under the arrow */}
      {isTracking && (
        <ViroBox
          width={0.6}
          height={0.01}
          length={0.6}
          position={[0, 0.005, -2.0]}
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
