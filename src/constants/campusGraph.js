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
  entrance: { id: "entrance", lat: 13.9321, lng: 121.6185 },
  junction_s: { id: "junction_s", lat: 13.9323, lng: 121.6185 },
  junction_c: { id: "junction_c", lat: 13.9325, lng: 121.6185 },
  junction_n: { id: "junction_n", lat: 13.9327, lng: 121.6185 },
  junction_nw: { id: "junction_nw", lat: 13.9327, lng: 121.6183 },
  junction_ne: { id: "junction_ne", lat: 13.9327, lng: 121.6187 },
  junction_cw: { id: "junction_cw", lat: 13.9325, lng: 121.61825 },
  junction_ce: { id: "junction_ce", lat: 13.9325, lng: 121.61875 },

  // Real building IDs now
  main_building: { id: "main_building", lat: 13.9329, lng: 121.6185 },
  new_building: { id: "new_building", lat: 13.9327, lng: 121.6181 },
  ea_tower: { id: "ea_tower", lat: 13.9327, lng: 121.6189 },
  ibed: { id: "ibed", lat: 13.9325, lng: 121.6181 },
  sr_building: { id: "sr_building", lat: 13.9325, lng: 121.61895 },
  canteen: { id: "canteen", lat: 13.93235, lng: 121.6181 },
  kitchen_hall: { id: "kitchen_hall", lat: 13.93235, lng: 121.6188 },
  chapel: { id: "chapel", lat: 13.9322, lng: 121.6186 },
  ccss: { id: "ccss", lat: 13.9324, lng: 121.6183 },
};
