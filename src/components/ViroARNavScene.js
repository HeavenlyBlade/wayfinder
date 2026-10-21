// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — ViroARNavScene
//
// A ViroReact AR navigation scene. Uses onTrackingUpdated (no plane selector)
// to show a 3D ViroCylinder + ViroCone arrow 2 m ahead in the AR world.
//
// Props (forwarded via ViroARSceneNavigator.viroAppProps):
//   angleDiff  {number}  — degrees from heading to next waypoint (arrow Y rotation)
//   style      {style}   — sizing for the navigator host view
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroText,
  ViroNode,
  ViroCylinder,
  ViroCone,
  ViroMaterials,
  ViroAnimations,
} from "@reactvision/react-viro";

// ── Materials (registered once at module load) ───────────────────────────────
ViroMaterials.createMaterials({
  arrowShaft: { lightingModel: "Blinn", diffuseColor: "#00FF88", specularColor: "#ffffff", shininess: 80 },
  arrowHead:  { lightingModel: "Blinn", diffuseColor: "#00FF88", specularColor: "#ffffff", shininess: 80 },
  groundRing: { lightingModel: "Constant", diffuseColor: "#00FF88", transparency: 0.5 },
});

// ── Animations (registered once at module load) ──────────────────────────────
ViroAnimations.registerAnimations({
  arrowGlow: {
    properties: { scaleX: "1 => 1.08 => 1", scaleZ: "1 => 1.08 => 1" },
    easing: "EaseInOut",
    duration: 1000,
    loop: true,
  },
});

// ── Inner AR scene (receives viroAppProps as its props) ───────────────────────
function NavScene(props) {
  const { angleDiff } = props;

  const [isTracking, setIsTracking] = useState(false);

  function handleTrackingUpdated(state) {
    setIsTracking(state === "NORMAL" || state === "LIMITED");
  }

  return (
    <ViroARScene onTrackingUpdated={handleTrackingUpdated}>
      {isTracking && (
        <ViroNode
          position={[0, 0.15, -2.0]}
          rotation={[0, angleDiff ?? 0, 0]}
          animation={{ name: "arrowGlow", run: true, loop: true }}
        >
          {/* Shaft — cylinder lying along Z axis */}
          <ViroCylinder
            height={0.6}
            radiusTop={0.04}
            radiusBottom={0.04}
            rotation={[-90, 0, 0]}
            position={[0, 0, 0.15]}
            materials={["arrowShaft"]}
          />
          {/* Cone arrowhead pointing in -Z (forward) direction */}
          <ViroCone
            height={0.4}
            radiusBottom={0.15}
            radiusTop={0}
            rotation={[-90, 0, 0]}
            position={[0, 0, -0.15]}
            materials={["arrowHead"]}
          />
        </ViroNode>
      )}

      {isTracking && (
        <ViroCylinder
          height={0.01}
          radiusTop={0.3}
          radiusBottom={0.3}
          position={[0, 0.01, -2.0]}
          materials={["groundRing"]}
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
    </ViroARScene>
  );
}

// ── Wrapper: hosts the AR scene navigator and forwards props via viroAppProps ─
export default function ViroARNavScene({ angleDiff, style }) {
  return (
    <ViroARSceneNavigator
      style={style}
      initialScene={{ scene: NavScene }}
      viroAppProps={{ angleDiff }}
    />
  );
}
