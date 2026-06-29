// ─────────────────────────────────────────────────────────────────────────────
// GPS → SVG coordinate projection
//
// Campus bounding box (4 corners provided by survey):
//   Top-left  (NW): { lat: 13.962797, lng: 121.611925 }
//   Top-right (NE): { lat: 13.962836, lng: 121.613578 }
//   Bot-right (SE): { lat: 13.960681, lng: 121.612847 }
//   Bot-left  (SW): { lat: 13.960911, lng: 121.611044 }
//
// We use a simple bilinear projection — the campus is ~250m × 300m so
// the flat-earth approximation is accurate to within a few centimetres.
//
// SVG canvas is fixed at SVG_W × SVG_H logical units.  All building polygon
// coordinates are projected into this space once at startup.
// ─────────────────────────────────────────────────────────────────────────────

export const SVG_W = 1000; // logical SVG width
export const SVG_H = 1200; // logical SVG height  (taller because campus is taller than wide)

// Campus boundary corners
const NW = { lat: 13.962797, lng: 121.611925 };
const NE = { lat: 13.962836, lng: 121.613578 };
const SE = { lat: 13.960681, lng: 121.612847 };
const SW = { lat: 13.960911, lng: 121.611044 };

/**
 * Convert a GPS coordinate to an SVG { x, y } point using bilinear interpolation
 * across the four campus corners.
 *
 * Algorithm:
 *   1. Compute how far east   the point is (0 = west edge, 1 = east edge) → u
 *   2. Compute how far south  the point is (0 = north edge, 1 = south edge) → v
 *   3. Map u → x (0..SVG_W),  v → y (0..SVG_H)
 *
 * This handles a slightly rotated / non-rectangular campus correctly.
 */
export function gpsToSvg(lat, lng) {
  // Longitude spread at the north edge and south edge
  const lngSpanN = NE.lng - NW.lng; // east spread at top
  const lngSpanS = SE.lng - SW.lng; // east spread at bottom

  // Latitude span on west and east edges
  const latSpanW = NW.lat - SW.lat; // north spread on left
  const latSpanE = NE.lat - SE.lat; // north spread on right

  // Estimate v (north→south fraction) from the west edge first
  const vApprox = latSpanW > 0 ? (NW.lat - lat) / latSpanW : 0;

  // Interpolate the west and east lng boundaries at this v
  const lngWest = SW.lng + (NW.lng - SW.lng) * (1 - vApprox);
  const lngEast = SE.lng + (NE.lng - SE.lng) * (1 - vApprox);
  const lngSpan = lngEast - lngWest;

  // u = east fraction
  const u = lngSpan !== 0 ? (lng - lngWest) / lngSpan : 0;

  // Interpolate the north and south lat boundaries at this u
  const latNorth = NW.lat + (NE.lat - NW.lat) * u;
  const latSouth = SW.lat + (SE.lat - SW.lat) * u;
  const latSpan  = latNorth - latSouth;

  // v = south fraction
  const v = latSpan !== 0 ? (latNorth - lat) / latSpan : 0;

  return {
    x: Math.round(u * SVG_W * 10) / 10,
    y: Math.round(v * SVG_H * 10) / 10,
  };
}

/**
 * Project an array of { latitude, longitude } polygon coords to SVG points string.
 * e.g.  "120.3,45.1 130.5,60.2 ..."
 */
export function polygonToSvgPoints(coordinates) {
  return coordinates
    .map(c => {
      const { x, y } = gpsToSvg(c.latitude, c.longitude);
      return `${x},${y}`;
    })
    .join(' ');
}

/**
 * Project an array of { lat, lng } waypoints to an SVG polyline points string.
 */
export function waypointsToSvgPoints(waypoints) {
  return waypoints
    .map(w => {
      const { x, y } = gpsToSvg(w.lat, w.lng);
      return `${x},${y}`;
    })
    .join(' ');
}
