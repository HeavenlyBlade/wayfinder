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

import React, { useState, useRef } from "react";
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
  arrowGreen: { lightingModel: "Blinn", diffuseColor: "#00FF88" },
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

  function handleTrackingUpdated(state) {
    const tracking =
      state === ViroTrackingStateConstants.TRACKING_NORMAL ||
      state === ViroTrackingStateConstants.TRACKING_LIMITED;
    setIsTracking(tracking);
  }

  // onCameraTransformUpdate fires every frame with the camera's world-space transform.
  // rotation[1] is the camera's Y (yaw) in the AR world frame.
  // On Android/ARCore the AR world -Z axis is wherever the camera was at session start.
  // We use the camera yaw to compute the arrow rotation relative to the AR world:
  //   absoluteCompassBearing = (heading + angleDiff) mod 360
  //   arrowRotation = absoluteCompassBearing - cameraYaw
  // This makes the arrow point the correct compass direction regardless of
  // where the camera was pointing when the AR session started.
  function handleCameraTransform(cameraTransform) {
    const camYaw = cameraTransform?.rotation?.[1] ?? 0;
    cameraYawRef.current = camYaw;

    if (heading != null && angleDiff != null) {
      // absoluteCompassBearing: the absolute world compass bearing to next waypoint
      const absoluteBearing = (heading + angleDiff + 360) % 360;
      // arrowYRotation: how much to rotate the arrow in the AR world to face that bearing
      const arrowY = absoluteBearing - camYaw;
      setArrowRotation(arrowY);
    } else {
      // Fallback: just use angleDiff as relative rotation (original behavior)
      setArrowRotation(angleDiff ?? 0);
    }
  }

  return (
    <ViroARScene
      onTrackingUpdated={handleTrackingUpdated}
      onCameraTransformUpdate={handleCameraTransform}
    >
      {/* Upright navigation pin */}
      {isTracking && (
        <ViroNode
          position={[0, 0.8, -2.5]}
          rotation={[0, arrowRotation, 0]}
          animation={{ name: "arrowPulse", run: true, loop: true }}
        >
          {/* Shaft — thin tall vertical stem */}
          <ViroBox
            width={0.08}
            height={0.6}
            length={0.08}
            position={[0, 0, 0]}
            materials={["arrowGreen"]}
          />
          {/* Head — diamond arrowhead at top pointing forward */}
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

      {/* Ground ring */}
      {isTracking && (
        <ViroBox
          width={0.6}
          height={0.01}
          length={0.6}
          position={[0, 0.005, -2.5]}
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
