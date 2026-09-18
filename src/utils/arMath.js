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
  const altitudeDiff     = targetAltitude - userAltitude;
  const distance3D       = Math.sqrt(groundDistance ** 2 + altitudeDiff ** 2);

  // Horizontal angle between camera facing direction and target bearing
  let angleDiff = bearing - compassHeading;
  if (angleDiff >  180) angleDiff -= 360;
  if (angleDiff < -180) angleDiff += 360;

  // Is the target within horizontal FOV?
  const halfHFov = hFov / 2;
  const visible  = Math.abs(angleDiff) < halfHFov + 10;

  // Map horizontal angle → screen X
  const xNorm = 0.5 + (angleDiff / hFov);

  // Vertical FOV: most phone cameras have ~50-60° vFov.
  // Derive from hFov using a fixed 16:9 sensor ratio regardless of screen,
  // because the camera sensor aspect doesn't change with screen orientation.
  const vFov = hFov * (9 / 16); // e.g. 73° hFov → ~41° vFov

  // For outdoor ground-level orbs: place them in the lower portion of the
  // frame as if looking slightly down at the path ahead.
  // 0° = horizon (y = 0.5), negative angle = below horizon (y > 0.5).
  // We use a small fixed downward tilt of 10° to represent "looking at the path".
  const TILT_DEG  = 10; // degrees below horizon the camera is naturally tilted
  const yNorm     = 0.5 + (TILT_DEG / vFov); // fixed position — not GPS dependent

  // Perspective scale: closer orbs appear larger and lower, farther ones smaller and higher.
  // Map distance 0→45m to yNorm offset: close=bottom, far=horizon
  const perspOffset  = (1 - Math.min(groundDistance / 45, 1)) * 0.25;
  const yFinal       = Math.max(0.35, Math.min(0.88, yNorm - perspOffset + (1 - Math.min(groundDistance / 45, 1)) * 0.15));

  // Orb size: bigger when closer
  const depthRatio = Math.min(distance3D / 50, 1);
  const orbSize    = Math.max(10, 42 - depthRatio * 28);

  return {
    x: xNorm * screenW,
    y: yFinal * screenH,
    visible,
    distance: Math.round(groundDistance),
    orbSize,
    angleDiff,
  };
}