// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — ViroARNavScene
//
// A real ViroReact AR navigation scene. It detects a horizontal ground plane,
// then renders a 3D green navigation arrow on that plane plus a trail of glowing
// orbs marking the next few waypoints.
//
// Props (forwarded to the inner scene via ViroARSceneNavigator.viroAppProps):
//   angleDiff     {number}            — degrees from current compass heading to
//                                        the next waypoint (the arrow's Y rotation)
//   waypoints     {Array<{lat,lng}>}   — the next few waypoints (orb trail)
//   userLocation  {{lat,lng}}          — current GPS fix
//   heading       {number}             — device compass heading (0 = north)
//   style         {style}              — sizing for the navigator host view
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useState } from "react";
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroARPlaneSelector,
  ViroText,
  ViroSphere,
  ViroBox,
  ViroNode,
  ViroMaterials,
  ViroAnimations,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";
import { bearingTo, distanceTo } from "../utils/arMath";

// ── Materials (registered once at module load) ───────────────────────────────
ViroMaterials.createMaterials({
  greenArrow: { lightingModel: "Blinn", diffuseColor: "#00C853" },
  orb:        { lightingModel: "Blinn", diffuseColor: "#00E6B4" },
});

// ── Animations (registered once at module load) ──────────────────────────────
ViroAnimations.registerAnimations({
  arrowBob: {
    properties: { positionY: "0.02 => 0.12 => 0.02" },
    easing: "EaseInOut",
    duration: 1500,
    loop: true,
  },
  arrowPulse: {
    properties: { scaleX: "1 => 1.15 => 1", scaleY: "1 => 1.15 => 1", scaleZ: "1 => 1.15 => 1" },
    easing: "EaseInOut",
    duration: 1200,
    loop: true,
  },
});

// GPS → local AR-world offset (metres). north = −Z, east = +X (ARCore space).
// anchorHeadingDeg aligns the AR −Z axis to the compass heading captured when
// the user first selects a ground plane, mapping GPS bearings into the AR frame.
function gpsToARWorld(userLat, userLng, wpLat, wpLng, anchorHeadingDeg) {
  const bearing = bearingTo(userLat, userLng, wpLat, wpLng); // 0 = north, 90 = east
  const dist    = distanceTo(userLat, userLng, wpLat, wpLng); // metres
  const rad     = ((bearing - anchorHeadingDeg) * Math.PI) / 180;
  const x =  dist * Math.sin(rad);  // east  = +X
  const z = -dist * Math.cos(rad);  // north = −Z
  return [x, 0.15, z];
}

// ── Inner AR scene (receives viroAppProps as its props) ───────────────────────
function NavScene(props) {
  const { angleDiff, waypoints, userLocation, heading } = props;

  const [planeFound,    setPlaneFound]    = useState(false);
  const [anchorHeading, setAnchorHeading] = useState(null);
  const selectorRef = useRef(null);

  // The ground plane is chosen when the user taps a detected surface.
  function handlePlaneSelected() {
    setPlaneFound(true);
    setAnchorHeading(heading ?? 0); // lock the AR frame to the current compass heading
  }

  // Re-show the scanning hint if AR tracking drops out entirely.
  function handleTrackingUpdated(state) {
    if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      setPlaneFound(false);
    }
  }

  // Recompute orb positions each render from the live userLocation + waypoints.
  const orbs =
    userLocation && anchorHeading != null && Array.isArray(waypoints) && waypoints.length > 0
      ? waypoints.map((wp) =>
          gpsToARWorld(userLocation.lat, userLocation.lng, wp.lat, wp.lng, anchorHeading)
        )
      : [];

  return (
    <ViroARScene
      anchorDetectionTypes={["planesHorizontal"]}
      onTrackingUpdated={handleTrackingUpdated}
      onAnchorFound={(a) => selectorRef.current && selectorRef.current.handleAnchorFound(a)}
      onAnchorUpdated={(a) => selectorRef.current && selectorRef.current.handleAnchorUpdated(a)}
      onAnchorRemoved={(a) => a && selectorRef.current && selectorRef.current.handleAnchorRemoved(a)}
    >
      {/* "scanning for surface…" until a ground plane is selected */}
      {!planeFound && (
        <ViroText
          text="Scanning for surface…"
          position={[0, 0.05, -1.5]}
          scale={[0.5, 0.5, 0.5]}
          width={2}
          extrusionDepth={0.02}
          color="#ffffff"
          outerStroke={{ type: "Outline", width: 0.5, color: "#000000" }}
        />
      )}

      {/* Ground detection + navigation content.
          Children only render once a plane is selected (tap to place). */}
      <ViroARPlaneSelector
        ref={selectorRef}
        alignment="Horizontal"
        minWidth={1.5}
        minHeight={1.5}
        onPlaneSelected={handlePlaneSelected}
      >
        {/* Glowing orb trail — the next few waypoints on the detected plane */}
        {orbs.map((pos, i) => (
          <ViroSphere
            key={i}
            radius={0.15}
            widthSegmentCount={16}
            heightSegmentCount={16}
            position={pos}
            materials="orb"
          />
        ))}

        {/* Green navigation arrow — ~1.5 m ahead on the plane, rotating with angleDiff */}
        <ViroNode
          position={[0, 0.02, -1.5]}
          rotation={[0, angleDiff ?? 0, 0]}
          animation={{ name: "arrowBob", run: true, loop: true }}
        >
          {/* shaft */}
          <ViroBox width={0.12} height={0.04} length={0.5} position={[0, 0, 0]} materials="greenArrow" />
          {/* arrowhead (diamond) */}
          <ViroBox
            width={0.34}
            height={0.04}
            length={0.34}
            position={[0, 0, -0.42]}
            rotation={[0, 45, 0]}
            materials="greenArrow"
          />
        </ViroNode>
      </ViroARPlaneSelector>
    </ViroARScene>
  );
}

// ── Wrapper: hosts the AR scene navigator and forwards props via viroAppProps ─
export default function ViroARNavScene({ angleDiff, waypoints, userLocation, heading, style }) {
  return (
    <ViroARSceneNavigator
      style={style}
      initialScene={{ scene: NavScene }}
      viroAppProps={{ angleDiff, waypoints, userLocation, heading }}
    />
  );
}
