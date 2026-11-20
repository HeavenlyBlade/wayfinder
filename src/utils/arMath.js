// Convert degrees to radians
const toRad = deg => deg * Math.PI / 180;

// ── Approximate metres-per-degree at SACLI campus latitude (~13.96°N) ─────────
const LAT_M  = 111320;                              // metres per degree of latitude
const LNG_M  = 111320 * Math.cos(toRad(13.962));   // metres per degree of longitude

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

// ── Segment projection helpers ─────────────────────────────────────────────────
//
// projectOnSegment(p, a, b)
//   Projects GPS point p onto segment a→b using a flat-Earth approximation
//   (accurate to <0.5% within a 500m campus).
//
//   Returns:
//     t            – scalar 0..1 along segment (0 = at a, 1 = at b)
//     crossTrackDist – perpendicular distance from p to the infinite line in metres
//     distToB      – Haversine distance from p to b in metres
//     passed       – true when p has crossed the perpendicular plane at b
//                    (t >= 0.95 OR distToB < captureRadius)
//
export function projectOnSegment(p, a, b, captureRadius = 6.0) {
  // Convert to flat-Earth XY frame (metres) anchored at a
  const bx = (b.lng - a.lng) * LNG_M;
  const by = (b.lat - a.lat) * LAT_M;
  const px = (p.lng - a.lng) * LNG_M;
  const py = (p.lat - a.lat) * LAT_M;

  const segLenSq = bx * bx + by * by;
  let t = 0;
  if (segLenSq > 0) {
    t = (px * bx + py * by) / segLenSq;
  }

  // Closest point on the infinite line
  const closestX = t * bx;
  const closestY = t * by;
  const crossTrackDist = Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);

  const distToB = distanceTo(p.lat, p.lng, b.lat, b.lng);
  const passed  = t >= 0.95 || distToB < captureRadius;

  return { t, crossTrackDist, distToB, passed };
}

// getLookaheadPoint(waypoints, segmentIndex, lookaheadDist)
//
//   Starting from waypoints[segmentIndex + 1] (the "B" node of the active
//   segment), walks forward along the polyline until it has accumulated
//   lookaheadDist metres, then returns the intermediate { lat, lng }.
//   Falls back to the last waypoint if the path is shorter than lookaheadDist.
//
export function getLookaheadPoint(waypoints, segmentIndex, lookaheadDist = 8) {
  const startIdx = segmentIndex + 1;
  if (startIdx >= waypoints.length) return waypoints[waypoints.length - 1];

  let remaining = lookaheadDist;

  for (let i = startIdx; i < waypoints.length - 1; i++) {
    const a    = waypoints[i];
    const b    = waypoints[i + 1];
    const segD = distanceTo(a.lat, a.lng, b.lat, b.lng);

    if (remaining <= segD) {
      const frac = remaining / segD;
      return {
        lat: a.lat + (b.lat - a.lat) * frac,
        lng: a.lng + (b.lng - a.lng) * frac,
      };
    }
    remaining -= segD;
  }

  return waypoints[waypoints.length - 1];
}