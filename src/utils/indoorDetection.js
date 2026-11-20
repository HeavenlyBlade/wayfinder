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
// Use tight values to avoid false positives when walking near buildings.
// Buildings without polygon definitions rely solely on these radii.
const INDOOR_RADIUS = {
  gate:         5,    // very small — gate is a point, not a building
  chapel:       8,    // small structure, path runs close by
  kindergarten: 8,
  ibed:         10,
  new_building: 12,
  sr_building:  10,
  ccss:         10,
  canteen:      10,
  canteen_two:  10,
  motorcycle_parking: 5,
  parking_lot:  6,
  default:      10,
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

    // --- Strategy 1: polygon check (authoritative boundary) ---
    if (building.polygon && building.polygon.length >= 3) {
      if (pointInPolygon(userLat, userLng, building.polygon)) {
        return {
          buildingId:       id,
          buildingName:     building.name,
          hasTwoStaircases: TWO_STAIRCASE_BUILDINGS.has(id),
        };
      }
      // If building has an explicit polygon, DO NOT fall through to radius check.
      // The user is outside the building polygon.
      continue;
    }

    // --- Strategy 2: radius check ONLY for buildings without polygons ---
    const node = NODES[id];
    if (!node) continue;

    // Tight 7m radius for buildings without polygons to avoid false triggers on outdoor walkways
    const radius = INDOOR_RADIUS[id] ?? 7;
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
