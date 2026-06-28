// In NODES, update the building IDs to match the new buildings.js keys:
// Replace:
//   'main'      → 'main_building'
//   'library'   → 'main_building'  (library is inside main building)
//   'gym'       → 'ea_tower'
//   'admin'     → 'new_building'
//   'lab'       → 'ibed'
//   'canteen'   → 'canteen'
//   'registrar' → 'main_building'  (registrar is inside main building)

export const NODES = {
  // ── Junctions / path intersections ──
  // Replace these with real GPS coordinates from your survey walk
  entrance: { id: "entrance", lat: 13.96094, lng: 121.6113 },
  junction_s: { id: "junction_s", lat: 13.9612, lng: 121.6118 },
  junction_c: { id: "junction_c", lat: 13.9614, lng: 121.612 },
  junction_n: { id: "junction_n", lat: 13.9619, lng: 121.6123 },
  junction_nw: { id: "junction_nw", lat: 13.962, lng: 121.6121 },
  junction_ne: { id: "junction_ne", lat: 13.962, lng: 121.6127 },
  junction_cw: { id: "junction_cw", lat: 13.9615, lng: 121.6119 },
  junction_ce: { id: "junction_ce", lat: 13.9615, lng: 121.6125 },

  // ── Buildings — use centroid of your polygon coordinates ──
  main_building: { id: "main_building", lat: 13.962011, lng: 121.612419 },
  new_building: { id: "new_building", lat: 13.961281, lng: 121.612078 },
  ea_tower: { id: "ea_tower", lat: 13.961942, lng: 121.612789 },
  ibed: { id: "ibed", lat: 13.961389, lng: 121.612211 },
  sr_building: { id: "sr_building", lat: 13.961367, lng: 121.612669 },
  canteen: { id: "canteen", lat: 13.961397, lng: 121.611861 },
  canteen_two: { id: "canteen_two", lat: 13.96165, lng: 121.612831 },
  kitchen_hall: { id: "kitchen_hall", lat: 13.962342, lng: 121.612903 },
  chapel: { id: "chapel", lat: 13.961664, lng: 121.612053 },
  ccss: { id: "ccss", lat: 13.960983, lng: 121.612456 },
  kindergarten: { id: "kindergarten", lat: 13.961817, lng: 121.612114 },
  gate: { id: "gate", lat: 13.960958, lng: 121.611279 },
  motorcycle_parking: {
    id: "motorcycle_parking",
    lat: 13.961253,
    lng: 121.611517,
  },
};
