// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — ViroARNavScene
//
// GPS-driven waypoint orbs: each waypoint in the orb trail is projected
// into AR space using bearingTo/distanceTo from arMath. No camera-yaw
// rotation needed — the GPS bearing already points the right direction.
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
  ViroSphere,
  ViroText,
  ViroMaterials,
  ViroAnimations,
} from "@reactvision/react-viro";

ViroMaterials.createMaterials({
  orbSolid:  { lightingModel: "Constant", diffuseColor: "#00FF88" },
  orbGlow:   { lightingModel: "Constant", diffuseColor: "#00FF88", transparency: 0.5 },
  destSolid: { lightingModel: "Constant", diffuseColor: "#FFD600" },
  destGlow:  { lightingModel: "Constant", diffuseColor: "#FFD600", transparency: 0.5 },
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

// TRACKING_NORMAL = 3, TRACKING_LIMITED = 2
const TRACKING_NORMAL  = 3;
const TRACKING_LIMITED = 2;

function waypointToARPos(wp, userLoc) {
  if (!userLoc) return null;
  const { bearingTo, distanceTo } = require("../utils/arMath");
  const bearing     = bearingTo(userLoc.lat, userLoc.lng, wp.lat, wp.lng);
  const dist        = distanceTo(userLoc.lat, userLoc.lng, wp.lat, wp.lng);
  const clampedDist = Math.min(dist, 8);
  const bearingRad  = bearing * Math.PI / 180;
  return [
    Math.sin(bearingRad) * clampedDist,   // x
    -0.3,                                  // y (ground level)
    -Math.cos(bearingRad) * clampedDist,  // z
  ];
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

  // angleDiff-based ahead check for turn indicator
  const isAhead = Math.abs(angleDiff ?? 0) < 70;

  const visibleWaypoints = (waypoints || []).slice(0, 3);

  return (
    <ViroARScene onTrackingUpdated={handleTrackingUpdated}>

      {/* GPS-driven waypoint orbs */}
      {isTracking && visibleWaypoints.map((wp, i) => {
        const pos = waypointToARPos(wp, userLocation);
        if (!pos) return null;
        const isDest    = !!wp.isDestination;
        const solidMat  = isDest ? "destSolid" : "orbSolid";
        const glowMat   = isDest ? "destGlow"  : "orbGlow";
        const solidR    = isDest ? 0.16 : 0.12;
        const glowR     = isDest ? 0.24 : 0.18;
        return (
          <ViroNode key={"orbnode-" + i} position={pos}>
            <ViroNode
              key={"orb-" + i}
              animation={{ name: "orbPulse", run: true, loop: true }}
            >
              <ViroSphere
                radius={solidR}
                widthSegmentCount={10}
                heightSegmentCount={10}
                materials={[solidMat]}
              />
            </ViroNode>
            <ViroNode
              key={"glow-" + i}
              animation={{ name: "glowPulse", run: true, loop: true }}
            >
              <ViroSphere
                radius={glowR}
                widthSegmentCount={8}
                heightSegmentCount={8}
                materials={[glowMat]}
              />
            </ViroNode>
          </ViroNode>
        );
      })}

      {/* Left/right turn indicator when destination is not ahead */}
      {isTracking && !isAhead && (
        <ViroText
          text={angleDiff > 0 ? ">> Turn Right" : "<< Turn Left"}
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
