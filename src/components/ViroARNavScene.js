// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — ViroARNavScene
//
// Arrow-based AR navigation (USE_ARROWS = true):
//   - NavigationArrow: camera-relative directional arrow, always centered in
//     view, rotates by angleDiff toward next waypoint. Immune to GPS drift.
//   - DestinationPin: GPS-projected gold pin at destination, shown when ≤40m.
//
// Orb trail fallback (USE_ARROWS = false): restores original orb behavior.
//
// ViroBox and ViroSphere ONLY. No ViroCylinder, ViroCone, or ViroPolygon.
// No specularColor or shininess in materials (Android crash).
// onTrackingUpdated: compare state to numeric constants 3 and 2.
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
} from "@reactvision/react-viro";

// ── Feature killswitch — set false to restore orb trail ──────────────────────
const USE_ARROWS = true;

ViroMaterials.createMaterials({
  orbSolid:    { lightingModel: "Constant", diffuseColor: "#00FF88" },
  orbGlow:     { lightingModel: "Constant", diffuseColor: "#00FF88", transparency: 0.5 },
  destSolid:   { lightingModel: "Constant", diffuseColor: "#FFD600" },
  destGlow:    { lightingModel: "Constant", diffuseColor: "#FFD600", transparency: 0.5 },
  arrowGreen:  { lightingModel: "Constant", diffuseColor: "#00FF88" },
  arrowGlow:   { lightingModel: "Constant", diffuseColor: "#00FF88", transparency: 0.35 },
  pinGold:     { lightingModel: "Constant", diffuseColor: "#FFD600" },
  pinGoldGlow: { lightingModel: "Constant", diffuseColor: "#FFD600", transparency: 0.35 },
});

ViroAnimations.registerAnimations({
  orbPulse: {
    properties: { scaleX: "1.0 => 1.3 => 1.0", scaleY: "1.0 => 1.3 => 1.0", scaleZ: "1.0 => 1.3 => 1.0" },
    easing: "EaseInOut", duration: 1000, loop: true,
  },
  glowPulse: {
    properties: { scaleX: "1.0 => 1.8 => 1.0", scaleY: "1.0 => 1.8 => 1.0", scaleZ: "1.0 => 1.8 => 1.0" },
    easing: "EaseOut", duration: 1000, loop: true,
  },
  arrowPulse: {
    properties: { scaleX: "1.0 => 1.1 => 1.0", scaleY: "1.0 => 1.1 => 1.0", scaleZ: "1.0 => 1.1 => 1.0" },
    easing: "EaseInOut", duration: 800, loop: true,
  },
  pinBob: {
    properties: { positionY: "0.5 => 0.65 => 0.5" },
    easing: "EaseInOut", duration: 1200, loop: true,
  },
});

// TRACKING_NORMAL = 3, TRACKING_LIMITED = 2
const TRACKING_NORMAL  = 3;
const TRACKING_LIMITED = 2;

// Distance at which the destination pin becomes visible (metres)
const PIN_SHOW_DIST = 40;

function waypointToARPos(wp, userLoc) {
  if (!userLoc) return null;
  const { bearingTo, distanceTo } = require("../utils/arMath");
  const bearing     = bearingTo(userLoc.lat, userLoc.lng, wp.lat, wp.lng);
  const dist        = distanceTo(userLoc.lat, userLoc.lng, wp.lat, wp.lng);
  const clampedDist = Math.min(dist, 8);
  const bearingRad  = bearing * Math.PI / 180;
  return [
    Math.sin(bearingRad) * clampedDist,
    -0.3,
    -Math.cos(bearingRad) * clampedDist,
  ];
}

// ── Camera-relative directional arrow ────────────────────────────────────────
// Always appears at [0, -0.3, -1.5] in front of the user.
// Rotates around Y by angleDiff so it points toward the next waypoint.
// Built from ViroBox only (Android safe): sleek shaft + prominent wide arrowhead.
function NavigationArrow({ angleDiff }) {
  const angle = angleDiff ?? 0;
  return (
    <ViroNode
      position={[0, -0.3, -1.5]}
      rotation={[0, angle, 0]}
      animation={{ name: "arrowPulse", run: true, loop: true }}
    >
      {/* Shaft — sleek central stem pointing along -Z */}
      <ViroBox
        scale={[0.045, 0.035, 0.28]}
        position={[0, 0, 0.08]}
        materials={["arrowGreen"]}
      />
      {/* Shaft glow */}
      <ViroBox
        scale={[0.065, 0.05, 0.28]}
        position={[0, 0, 0.08]}
        materials={["arrowGlow"]}
      />

      {/* Arrowhead — prominent wide diamond tip (31cm wide across wings) */}
      <ViroBox
        scale={[0.22, 0.04, 0.22]}
        position={[0, 0, -0.11]}
        rotation={[0, 45, 0]}
        materials={["arrowGreen"]}
      />
      {/* Arrowhead left barb fin */}
      <ViroBox
        scale={[0.045, 0.038, 0.18]}
        position={[-0.08, 0, -0.06]}
        rotation={[0, 32, 0]}
        materials={["arrowGreen"]}
      />
      {/* Arrowhead right barb fin */}
      <ViroBox
        scale={[0.045, 0.038, 0.18]}
        position={[0.08, 0, -0.06]}
        rotation={[0, -32, 0]}
        materials={["arrowGreen"]}
      />
      {/* Arrowhead glow */}
      <ViroBox
        scale={[0.26, 0.055, 0.26]}
        position={[0, 0, -0.11]}
        rotation={[0, 45, 0]}
        materials={["arrowGlow"]}
      />
    </ViroNode>
  );
}

// ── GPS-projected destination pin ────────────────────────────────────────────
// Gold pin placed at destination's AR position. Shown only when ≤40m away.
// Built from ViroBox only: vertical shaft + diamond arrowhead pointing down.
function DestinationPin({ pos }) {
  return (
    <ViroNode
      position={pos}
      animation={{ name: "pinBob", run: true, loop: true }}
    >
      {/* Vertical shaft */}
      <ViroBox
        scale={[0.07, 0.45, 0.07]}
        position={[0, 0, 0]}
        materials={["pinGold"]}
      />
      {/* Arrowhead — diamond shape: box rotated 45° on Z */}
      <ViroBox
        scale={[0.2, 0.2, 0.07]}
        position={[0, -0.3, 0]}
        rotation={[0, 0, 45]}
        materials={["pinGold"]}
      />
      {/* Glow halo */}
      <ViroBox
        scale={[0.12, 0.52, 0.12]}
        position={[0, 0, 0]}
        materials={["pinGoldGlow"]}
      />
    </ViroNode>
  );
}

function NavScene(props) {
  const { angleDiff, heading, waypoints, userLocation } =
    props?.sceneNavigator?.viroAppProps ?? {};

  const [isTracking,    setIsTracking]    = useState(false);
  const [isLimitedMode, setIsLimitedMode] = useState(false);

  const timeoutRef = useRef(null);

  function handleTrackingUpdated(state) {
    const ok = state === TRACKING_NORMAL || state === TRACKING_LIMITED;
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

  // Find destination waypoint and its AR position (for pin)
  const allWaypoints   = waypoints || [];
  const destWp         = allWaypoints.find(wp => wp.isDestination);
  const destPos        = destWp ? waypointToARPos(destWp, userLocation) : null;

  // Only show pin when user is close enough (GPS distance ≤ PIN_SHOW_DIST)
  const showPin = (() => {
    if (!destWp || !userLocation) return false;
    const { distanceTo } = require("../utils/arMath");
    return distanceTo(userLocation.lat, userLocation.lng, destWp.lat, destWp.lng) <= PIN_SHOW_DIST;
  })();

  // Orb trail (fallback)
  const visibleWaypoints = allWaypoints.slice(0, 3);

  return (
    <ViroARScene onTrackingUpdated={handleTrackingUpdated}>

      {isTracking && (USE_ARROWS ? (
        <>
          {/* Directional navigation arrow — always centered in view */}
          <NavigationArrow angleDiff={angleDiff} />

          {/* Destination pin — GPS-projected, shown when ≤40m */}
          {showPin && destPos && <DestinationPin pos={destPos} />}
        </>
      ) : (
        /* ── Orb trail fallback (USE_ARROWS = false) ── */
        visibleWaypoints.map((wp, i) => {
          const pos = waypointToARPos(wp, userLocation);
          if (!pos) return null;
          const isDest   = !!wp.isDestination;
          const solidMat = isDest ? "destSolid" : "orbSolid";
          const glowMat  = isDest ? "destGlow"  : "orbGlow";
          const solidR   = isDest ? 0.16 : 0.12;
          const glowR    = isDest ? 0.24 : 0.18;
          return (
            <ViroNode key={"orbnode-" + i} position={pos}>
              <ViroNode key={"orb-" + i} animation={{ name: "orbPulse", run: true, loop: true }}>
                <ViroSphere radius={solidR} widthSegmentCount={10} heightSegmentCount={10} materials={[solidMat]} />
              </ViroNode>
              <ViroNode key={"glow-" + i} animation={{ name: "glowPulse", run: true, loop: true }}>
                <ViroSphere radius={glowR} widthSegmentCount={8} heightSegmentCount={8} materials={[glowMat]} />
              </ViroNode>
            </ViroNode>
          );
        })
      ))}

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

export default function ViroARNavScene({ angleDiff, heading, waypoints, userLocation, style }) {
  return (
    <ViroARSceneNavigator
      style={style}
      autofocus={Platform.OS === "ios"}
      initialScene={{ scene: NavScene }}
      viroAppProps={{ angleDiff, heading, waypoints, userLocation }}
    />
  );
}
