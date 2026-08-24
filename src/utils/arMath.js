// Convert degrees to radians
const toRad = deg => deg * Math.PI / 180;

// Bearing from point A to point B in degrees (0 = north, 90 = east)
export function bearingTo(userLat, userLng, targetLat, targetLng) {
  const dLng   = toRad(targetLng - userLng);
  const lat1   = toRad(userLat);
  const lat2   = toRad(targetLat);
  const y      = Math.sin(dLng) * Math.cos(lat2);
  const x      = Math.cos(lat1) * Math.sin(lat2) -
                 Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
}

// Haversine distance in metres
export function distanceTo(lat1, lng1, lat2, lng2) {
  const R    = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a    = Math.sin(dLat / 2) ** 2 +
               Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
               Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

// Project a GPS waypoint onto the AR camera screen
// Returns { x, y, visible, distance } where x/y are pixel screen coordinates
//
// compassHeading  = device compass in degrees (0 = north)
// userAltitude    = device GPS altitude in metres (from useLocation)
// targetAltitude  = target waypoint altitude in metres (0 if unknown — assumes ground level)
// hFov            = horizontal field of view of the camera in degrees (typically 60-70)
// vFov            = vertical field of view (derived from hFov and screen aspect ratio)
// screenW/H       = screen pixel dimensions
export function projectToScreen({
  userLat, userLng, userAltitude = 0,
  targetLat, targetLng, targetAltitude = 0,
  compassHeading,
  hFov = 65,
  screenW, screenH,
}) {
  const bearing          = bearingTo(userLat, userLng, targetLat, targetLng);
  const groundDistance   = distanceTo(userLat, userLng, targetLat, targetLng);
  const altitudeDiff     = targetAltitude - userAltitude; // positive = target is above user

  // Total 3D distance to orb
  const distance3D = Math.sqrt(groundDistance ** 2 + altitudeDiff ** 2);

  // Horizontal angle between facing direction and target bearing
  let angleDiff = bearing - compassHeading;
  if (angleDiff >  180) angleDiff -= 360;
  if (angleDiff < -180) angleDiff += 360;

  // Vertical angle to target:
  // Positive = above horizon (look up), negative = below (look down)
  // For ground-level navigation, orbs slightly below eye level feel natural
  const EYE_HEIGHT_M = 1.5; // approximate eye level above ground
  const effectiveAltDiff = altitudeDiff - EYE_HEIGHT_M;
  const verticalAngle = groundDistance > 0
    ? Math.atan2(effectiveAltDiff, groundDistance) * (180 / Math.PI)
    : 0;

  // Is the target within horizontal FOV?
  const halfHFov = hFov / 2;
  const visible  = Math.abs(angleDiff) < halfHFov + 10; // +10 soft edge

  // Map horizontal angle → screen X
  const xNorm = 0.5 + (angleDiff / hFov);

  // Map vertical angle → screen Y
  // vFov derived from hFov and screen aspect ratio
  const aspectRatio = screenH / screenW;
  const vFov = hFov * aspectRatio;
  // 0.5 = horizon centre; positive verticalAngle = above horizon = smaller Y (higher on screen)
  const yNorm = 0.5 - (verticalAngle / vFov);

  // Orb size: bigger when closer
  const depthRatio = Math.min(distance3D / 50, 1);
  const orbSize = Math.max(14, 44 - depthRatio * 30);

  return {
    x: xNorm * screenW,
    y: Math.max(0.1 * screenH, Math.min(0.9 * screenH, yNorm * screenH)), // clamp on screen
    visible,
    distance: Math.round(groundDistance),
    orbSize,
    angleDiff,
  };
}