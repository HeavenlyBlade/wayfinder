// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — ViroARNavScene
//
// Continuous arrow trail — multiple chevrons placed along the direction of
// travel, getting smaller with distance (perspective effect). Like the indoor
// navigation style in the reference screenshots.
//
// Each chevron is a ViroPolygon. They are spaced 0.8m apart, starting at 0.6m
// ahead and going to 5m. Each one scales down with distance to simulate depth.
// The whole group rotates in Y to face the correct compass direction.
//
// Arrow rotation:
//   ARCore world -Z axis is arbitrary (where camera pointed at session start).
//   We use onCameraTransformUpdate to get camera yaw, then:
//     arrowRotation = absoluteCompassBearing - cameraYaw
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from "react";
import { Platform } from "react-native";
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroNode,
  ViroPolygon,
  ViroText,
  ViroMaterials,
  ViroAnimations,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";

// ── Materials ─────────────────────────────────────────────────────────────────
ViroMaterials.createMaterials({
  arrowClose:  { lightingModel: "Constant", diffuseColor: "#00FF88" },
  arrowMid:    { lightingModel: "Constant", diffuseColor: "#00DD77" },
  arrowFar:    { lightingModel: "Constant", diffuseColor: "#009955" },
  arrowFarest: { lightingModel: "Constant", diffuseColor: "#006633" },
});

// ── Animations — chevrons flow forward like they're moving ────────────────────
ViroAnimations.registerAnimations({
  // Each chevron pulses opacity to create a flowing/moving trail effect
  flowPulse0: { properties: { opacity: "0.4 => 1.0 => 0.4" }, easing: "Linear", duration: 800,  loop: true },
  flowPulse1: { properties: { opacity: "0.4 => 1.0 => 0.4" }, easing: "Linear", duration: 800,  loop: true },
  flowPulse2: { properties: { opacity: "0.4 => 1.0 => 0.4" }, easing: "Linear", duration: 800,  loop: true },
  flowPulse3: { properties: { opacity: "0.4 => 1.0 => 0.4" }, easing: "Linear", duration: 800,  loop: true },
  flowPulse4: { properties: { opacity: "0.4 => 1.0 => 0.4" }, easing: "Linear", duration: 800,  loop: true },
  flowPulse5: { properties: { opacity: "0.4 => 1.0 => 0.4" }, easing: "Linear", duration: 800,  loop: true },
  flowPulse6: { properties: { opacity: "0.4 => 1.0 => 0.4" }, easing: "Linear", duration: 800,  loop: true },
});

// ── Single chevron vertices — pointing in -Z direction (forward) ──────────────
// Flat on Y plane (ground level). Width 0.5m, depth 0.35m.
// Shape: like ">>" — a pointed chevron
function makeChevronVerts(w, d) {
  // w = half-width, d = depth
  return [
    [ 0,   0.04, -d    ],  // tip (front)
    [-w,   0.04,  d*0.3],  // left outer
    [-w*0.4, 0.04, 0   ],  // left inner notch
    [ w*0.4, 0.04, 0   ],  // right inner notch
    [ w,   0.04,  d*0.3],  // right outer
  ];
}
const CHEVRON_IDX = [[0,1,2],[0,2,3],[0,3,4]];

// Trail config: [z_distance, scale, materialKey, animName, delayRatio]
// Chevrons start close (bright, big) and get smaller/darker further away
const TRAIL = [
  { z: -0.7,  s: 0.55, mat: "arrowClose",  anim: "flowPulse0", delay: 0.00 },
  { z: -1.3,  s: 0.70, mat: "arrowClose",  anim: "flowPulse1", delay: 0.12 },
  { z: -1.9,  s: 0.85, mat: "arrowMid",    anim: "flowPulse2", delay: 0.24 },
  { z: -2.6,  s: 1.00, mat: "arrowMid",    anim: "flowPulse3", delay: 0.36 },
  { z: -3.4,  s: 0.85, mat: "arrowFar",    anim: "flowPulse4", delay: 0.48 },
  { z: -4.3,  s: 0.70, mat: "arrowFar",    anim: "flowPulse5", delay: 0.60 },
  { z: -5.3,  s: 0.55, mat: "arrowFarest", anim: "flowPulse6", delay: 0.72 },
];

// Pre-build chevron vertices for each scale
const CHEVRON_VERTS_BY_SCALE = {};
TRAIL.forEach(({ s }) => {
  const key = s.toFixed(2);
  if (!CHEVRON_VERTS_BY_SCALE[key]) {
    CHEVRON_VERTS_BY_SCALE[key] = makeChevronVerts(0.28 * s, 0.22 * s);
  }
});

// ── Inner AR scene ────────────────────────────────────────────────────────────
function NavScene(props) {
  const { angleDiff, heading } = props;

  const [isTracking,    setIsTracking]    = useState(false);
  const [arrowRotation, setArrowRotation] = useState(0);
  const [isLimitedMode, setIsLimitedMode] = useState(false);

  const cameraYawRef  = useRef(0);
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

      {/* Continuous arrow trail — all chevrons rotate together */}
      {isTracking && (
        <ViroNode
          position={[0, -0.3, 0]}
          rotation={[0, arrowRotation, 0]}
        >
          {TRAIL.map((cfg, i) => {
            const key = cfg.s.toFixed(2);
            const verts = CHEVRON_VERTS_BY_SCALE[key];
            return (
              <ViroNode
                key={i}
                position={[0, 0, cfg.z]}
                animation={{
                  name: cfg.anim,
                  run: true,
                  loop: true,
                  delay: Math.floor(cfg.delay * 800),
                }}
              >
                <ViroPolygon
                  vertices={verts}
                  triangleIndices={CHEVRON_IDX}
                  materials={[cfg.mat]}
                />
              </ViroNode>
            );
          })}
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
