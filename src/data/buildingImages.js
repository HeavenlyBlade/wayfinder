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
  // ── Photos available ──────────────────────────────────────────────────────
  chapel:             require('../../assets/buildings/chapel.jpg'),
  ea_tower:           require('../../assets/buildings/ea_tower.jpg'),
  gymnasium:          require('../../assets/buildings/gymnasium.jpg'),
  kindergarten:       require('../../assets/buildings/kindergarten.jpg'),
  kitchen_hall:       require('../../assets/buildings/kitchen_hall.jpg'),
  main_building:      require('../../assets/buildings/main_building.jpg'),
  engineering:        require('../../assets/buildings/engineering.jpg'),
  canteen_two:        require('../../assets/buildings/canteen_two.jpg'),
  sr_building:        require('../../assets/buildings/sr_building.jpg'),
  canteen:            require('../../assets/buildings/canteen.jpg'),
  ibed:               require('../../assets/buildings/ibed.jpg'),

  // ── Photos still needed ───────────────────────────────────────────────────
  gate:               null,   // Main Gate
  motorcycle_parking: null,   // Moto Parking
  parking_lot:        null,   // Parking Lot
  new_building:       null,   // New Building (RFID entrance)
  ccss:               null,   // CCSS Building
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
