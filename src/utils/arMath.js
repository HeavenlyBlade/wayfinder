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
// Returns { x, y, visible, distance } where x/y are 0-1 normalised screen coords
//
// compassHeading  = device compass in degrees (0 = north)
// hFov            = horizontal field of view of the camera in degrees (typically 60-70)
// screenW/H       = screen pixel dimensions
export function projectToScreen({
  userLat, userLng,
  targetLat, targetLng,
  compassHeading,
  hFov = 65,
  screenW, screenH,
}) {
  const bearing  = bearingTo(userLat, userLng, targetLat, targetLng);
  const distance = distanceTo(userLat, userLng, targetLat, targetLng);

  // Angle between the direction you're facing and the direction to the target
  let angleDiff = bearing - compassHeading;
  // Normalise to -180..180
  if (angleDiff >  180) angleDiff -= 360;
  if (angleDiff < -180) angleDiff += 360;

  // Is the target within the camera's field of view?
  const halfFov = hFov / 2;
  const visible = Math.abs(angleDiff) < halfFov + 10; // +10 = soft edge

  // Map angle to horizontal screen position
  const xNorm = 0.5 + (angleDiff / hFov);

  // Vertical position: closer = lower on screen (floor perspective)
  // Objects further away appear higher up
  const MAX_DIST = 50; // metres — beyond this orb sits near top
  const depthRatio = Math.min(distance / MAX_DIST, 1);
  const yNorm = 0.82 - depthRatio * 0.48;

  // Orb size: bigger when closer
  const orbSize = Math.max(14, 44 - depthRatio * 30);

  return {
    x: xNorm * screenW,
    y: yNorm * screenH,
    visible,
    distance: Math.round(distance),
    orbSize,
    angleDiff,
  };
}