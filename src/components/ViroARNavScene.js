// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — ViroARNavScene
//
// ViroReact AR navigation scene.
//
// KEY INSIGHT from research:
//   ARCore (Android) does NOT support worldAlignment="GravityAndHeading".
//   The AR world's -Z axis is wherever the camera was pointing at session start
//   — completely arbitrary. To make the arrow point the correct compass direction
//   we use onCameraTransformUpdate to get the camera's current yaw from ARCore,
//   then compute: arrowRotation = compassBearing - cameraYaw
//   where compassBearing = (heading + angleDiff) is the absolute compass bearing
//   to the next waypoint, and cameraYaw is the camera's current Y rotation in
//   the AR world frame. This gives the correct rotation relative to the camera.
//
// Arrow: upright ViroBox navigation pin — shaft + diamond head, stands vertical,
//        rotates in Y to face direction of travel, scale-pulse animation.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from "react";
import { Platform } from "react-native";
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
  arrowGreen: { lightingModel: "Constant", diffuseColor: "#00FF88" },
  ringGreen:  { lightingModel: "Constant", diffuseColor: "#00FF88", transparency: 0.5 },
});

// ── Animations ────────────────────────────────────────────────────────────────
ViroAnimations.registerAnimations({
  arrowPulse: {
    properties: {
      scaleX: "1.0 => 1.1 => 1.0",
      scaleY: "1.0 => 1.1 => 1.0",
      scaleZ: "1.0 => 1.1 => 1.0",
    },
    easing: "EaseInOut",
    duration: 1000,
    loop: true,
  },
});

// ── Inner AR scene ────────────────────────────────────────────────────────────
function NavScene(props) {
  // angleDiff: bearing - heading (degrees), already computed in ARScreen
  // heading:   device compass heading (0=north), from useLocation
  const { angleDiff, heading } = props;

  const [isTracking,   setIsTracking]   = useState(false);
  const [arrowRotation, setArrowRotation] = useState(angleDiff ?? 0);
  const cameraYawRef = useRef(0); // camera's current Y rotation in AR world
  const lastArrowYRef = useRef(0);
  const [isLimitedMode, setIsLimitedMode] = useState(false);
  const trackingTimeoutRef = useRef(null);

  function handleTrackingUpdated(state) {
    const tracking = state === ViroTrackingStateConstants.TRACKING_NORMAL ||
                     state === ViroTrackingStateConstants.TRACKING_LIMITED;
    if (tracking && trackingTimeoutRef.current) {
      clearTimeout(trackingTimeoutRef.current);
      trackingTimeoutRef.current = null;
    }
    setIsTracking(tracking);
  }

  useEffect(() => {
    trackingTimeoutRef.current = setTimeout(() => {
      setIsTracking(prev => {
        if (!prev) {
          setIsLimitedMode(true);
          return true;
        }
        return prev;
      });
    }, 10000);
    return () => { if (trackingTimeoutRef.current) clearTimeout(trackingTimeoutRef.current); };
  }, []);

  // onCameraTransformUpdate fires every frame with the camera's world-space transform.
  // rotation[1] is the camera's Y (yaw) in the AR world frame.
  // On Android/ARCore the AR world -Z axis is wherever the camera was at session start.
  // We use the camera yaw to compute the arrow rotation relative to the AR world:
  //   absoluteCompassBearing = (heading + angleDiff) mod 360
  //   arrowRotation = absoluteCompassBearing - cameraYaw
  // This makes the arrow point the correct compass direction regardless of
  // where the camera was pointing when the AR session started.
  function handleCameraTransform(cameraTransform) {
    const rawYaw = cameraTransform?.rotation?.[1] ?? 0;
    // Normalize to 0-360 range — ViroReact may return -180 to +180 or 0 to 360
    const camYaw = ((rawYaw % 360) + 360) % 360;
    cameraYawRef.current = camYaw;

    if (heading != null && angleDiff != null) {
      // absoluteCompassBearing: the absolute world compass bearing to next waypoint
      const absoluteBearing = ((heading + angleDiff) % 360 + 360) % 360;
      // arrowYRotation: rotate arrow in AR world to face that compass bearing
      let arrowY = absoluteBearing - camYaw;
      // Normalize to shortest rotation path
      if (arrowY > 180) arrowY -= 360;
      if (arrowY < -180) arrowY += 360;
      if (Math.abs(arrowY - lastArrowYRef.current) < 1.0) return;
      lastArrowYRef.current = arrowY;
      setArrowRotation(arrowY);
    } else {
      setArrowRotation(angleDiff ?? 0);
    }
  }

  return (
    <ViroARScene
      onTrackingUpdated={handleTrackingUpdated}
      onCameraTransformUpdate={handleCameraTransform}
    >
      {/* Upright navigation pin — at eye level, 2.5m ahead */}
      {isTracking && (
        <ViroNode
          position={[0, 0.0, -2.5]}
          rotation={[0, arrowRotation, 0]}
          animation={{ name: "arrowPulse", run: true, loop: true }}
        >
          {/* Shaft — thin vertical stem */}
          <ViroBox
            width={0.08}
            height={0.5}
            length={0.08}
            position={[0, 0, 0]}
            materials={["arrowGreen"]}
          />
          {/* Head — diamond arrowhead at top */}
          <ViroBox
            width={0.26}
            height={0.08}
            length={0.26}
            position={[0, 0.30, 0]}
            rotation={[0, 0, 45]}
            materials={["arrowGreen"]}
          />
        </ViroNode>
      )}

      {/* Ground ring below the arrow */}
      {isTracking && (
        <ViroBox
          width={0.5}
          height={0.01}
          length={0.5}
          position={[0, -0.26, -2.5]}
          materials={["ringGreen"]}
        />
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

      {/* Limited AR mode indicator */}
      {isTracking && isLimitedMode && (
        <ViroText
          text="Limited AR"
          position={[0, -0.4, -2.5]}
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
      autofocus={Platform.OS === "ios"} // ARCore tracking optimized with autofocus=false on Android
      initialScene={{ scene: NavScene }}
      viroAppProps={{ angleDiff, heading }}
    />
  );
}
