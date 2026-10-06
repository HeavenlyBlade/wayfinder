// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — Indoor Detection Utility
//
// Determines whether the user is currently inside a campus building.
//
// Strategy:
//   1. If a building has a polygon, use ray-casting (point-in-polygon).
//   2. Otherwise, use a radius threshold from the building entrance node.
//      Buildings without polygons use 15m by default — tight enough to avoid
//      false positives between adjacent buildings.
//
// Usage:
//   const result = getIndoorStatus(userLat, userLng);
//   // result: null (outdoors) or { buildingId, buildingName, hasTwoStaircases }
// ─────────────────────────────────────────────────────────────────────────────

import { BUILDINGS }   from '../constants/buildings';
import { NODES }       from '../constants/campusGraph';
import { distanceTo }  from './arMath';

// Buildings that have 2 staircases/entrances — used by staircase picker
export const TWO_STAIRCASE_BUILDINGS = new Set([
  'main_building',
  'ea_tower',
  'sr_building',
]);

// Per-building indoor radius override (metres).
// Use tighter values for adjacent buildings to avoid false positives.
const INDOOR_RADIUS = {
  chapel:       12,
  kindergarten: 12,
  ibed:         14,
  new_building: 16,
  sr_building:  14,
  ccss:         14,
  default:      18,
};

// ── Ray-casting: point-in-polygon (GPS coordinates) ──────────────────────────
function pointInPolygon(lat, lng, polygon) {
  let inside = false;
  const n = polygon.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;
    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// ── Main export ───────────────────────────────────────────────────────────────
/**
 * Check whether the user is inside any campus building.
 *
 * @param {number} userLat
 * @param {number} userLng
 * @returns {{ buildingId: string, buildingName: string, hasTwoStaircases: boolean } | null}
 *   Returns null when the user is outdoors.
 */
export function getIndoorStatus(userLat, userLng) {
  if (userLat == null || userLng == null) return null;

  for (const [id, building] of Object.entries(BUILDINGS)) {
    // Skip non-navigable entries
    if (!building.name) continue;

    // --- Strategy 1: polygon check ---
    if (building.polygon && building.polygon.length >= 3) {
      if (pointInPolygon(userLat, userLng, building.polygon)) {
        return {
          buildingId:       id,
          buildingName:     building.name,
          hasTwoStaircases: TWO_STAIRCASE_BUILDINGS.has(id),
        };
      }
    }

    // --- Strategy 2: radius check using building entrance node ---
    const node = NODES[id];
    if (!node) continue;

    const radius = INDOOR_RADIUS[id] ?? INDOOR_RADIUS.default;
    const dist   = distanceTo(userLat, userLng, node.lat, node.lng);

    if (dist <= radius) {
      return {
        buildingId:       id,
        buildingName:     building.name,
        hasTwoStaircases: TWO_STAIRCASE_BUILDINGS.has(id),
      };
    }
  }

  return null; // outdoors
}

/**
 * Simple boolean helper for components that only need to know "am I inside?"
 */
export function isInsideBuilding(userLat, userLng) {
  return getIndoorStatus(userLat, userLng) !== null;
}
