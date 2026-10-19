// ─────────────────────────────────────────────────────────────────────────────
// Wayfinder — Building Image Map
// Maps building IDs to their preview images.
//
// TO ADD REAL IMAGES:
// Option A (local asset):
//   Replace null with: require('../../assets/buildings/main-building.jpg')
//   Then place the photo in: wayfinder/assets/buildings/
//   And re-run: npx expo export
//
// Option B (remote URL):
//   Replace null with: 'https://your-cdn.com/buildings/main-building.jpg'
//
// The BuildingImagePreview component handles both require() objects and URL
// strings automatically — no other code changes needed.
// ─────────────────────────────────────────────────────────────────────────────

export const BUILDING_IMAGES = {
  gate:               null,
  motorcycle_parking: null,
  parking_lot:        null,
  canteen:            null,
  canteen_two:        null,
  ccss:               null,
  chapel:             null,
  new_building:       null,
  ibed:               null,
  kindergarten:       null,
  engineering:        null,
  main_building:      null,
  sr_building:        null,
  ea_tower:           null,
  kitchen_hall:       null,
  gymnasium:          null,
};

/**
 * Returns the image source for a building, or null if none is set.
 * Accepts both require() objects (number) and URL strings.
 *
 * @param {string} buildingId - The building's id field
 * @returns {number|string|null}
 */
export const getImageForBuilding = (buildingId) => {
  if (!buildingId) return null;
  return BUILDING_IMAGES[buildingId] ?? null;
};
