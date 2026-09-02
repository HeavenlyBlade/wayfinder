// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — Campus Graph (Nodes + Edges)
//
// NODE NAMING CONVENTION:
//   J1–J8   = real intersection nodes (pinpointed on Google Maps)
//   W1–W10  = walkable road waypoints for path detail (Google Maps)
//   others  = building entrance nodes
//
// SURVEY STATUS:
//   ✅ All building entrance nodes — pinpointed on Google Maps
//   ✅ All junction nodes (J1–J8)  — pinpointed on Google Maps
//   ✅ All waypoint nodes (W1–W10) — pinpointed on Google Maps
//
// NOTE: EA Tower has two entrances; ea_tower uses the 1st (south) entrance.
//       SR Building has two entrances; sr_building uses the 1st (south) entrance.
// ─────────────────────────────────────────────────────────────────────────────

import { distanceTo } from '../utils/arMath';

export const NODES = {
  // ── Campus gate / parking ─────────────────────────────────────────────────
  gate:               { id: 'gate',               lat: 13.9609,  lng: 121.6114  }, // ✅
  motorcycle_parking: { id: 'motorcycle_parking', lat: 13.9612,  lng: 121.6115  }, // ✅
  parking_lot:        { id: 'parking_lot',        lat: 13.9611,  lng: 121.6123  }, // ✅

  // ── Intersection nodes ────────────────────────────────────────────────────
  J1: { id: 'J1', lat: 13.9612,  lng: 121.6116  }, // ✅ south — near gate / motorcycle parking
  J2: { id: 'J2', lat: 13.9612,  lng: 121.6121  }, // ✅ south-central
  J3: { id: 'J3', lat: 13.9612,  lng: 121.6126  }, // ✅ south-east — SR / CCSS / parking lot
  J4: { id: 'J4', lat: 13.9616,  lng: 121.6121  }, // ✅ mid — chapel / kindergarten / ibed / new_building
  J5: { id: 'J5', lat: 13.9616,  lng: 121.6126  }, // ✅ mid-east — canteen_two / SR 2nd entrance
  J6: { id: 'J6', lat: 13.9621,  lng: 121.6128  }, // ✅ north-east — EA Tower 2nd entrance area
  J7: { id: 'J7', lat: 13.9624,  lng: 121.6128  }, // ✅ far north — gymnasium / kitchen_hall
  J8: { id: 'J8', lat: 13.9614,  lng: 121.6116  }, // ✅ south-west — canteen branch

  // ── Walkable road waypoints (path detail) ────────────────────────────────
  W1: { id: 'W1', lat: 13.9612,  lng: 121.6119  }, // between J1 and J2
  W2: { id: 'W2', lat: 13.9612,  lng: 121.6123  }, // between J2 and J3
  W3: { id: 'W3', lat: 13.9614,  lng: 121.6126  }, // between J3 and J5
  W4: { id: 'W4', lat: 13.9616,  lng: 121.6122  }, // just east of J4
  W5: { id: 'W5', lat: 13.9616,  lng: 121.6119  }, // west of J4 — canteen side
  W6: { id: 'W6', lat: 13.9615,  lng: 121.6117  }, // between J8 and J4/W5
  W7: { id: 'W7', lat: 13.9616,  lng: 121.6125  }, // between J4/J5 area
  W8: { id: 'W8', lat: 13.9617,  lng: 121.6127  }, // between J5 and J6
  W9: { id: 'W9', lat: 13.9619,  lng: 121.6127  }, // between J6 and canteen_two/ea_tower

  // ── Building entrance nodes ───────────────────────────────────────────────
  main_building:  { id: 'main_building',  lat: 13.9617,  lng: 121.6124  }, // ✅
  new_building:   { id: 'new_building',   lat: 13.9613,  lng: 121.6121  }, // ✅
  ea_tower:       { id: 'ea_tower',       lat: 13.9618,  lng: 121.6128  }, // ✅ 1st entrance
  ibed:           { id: 'ibed',           lat: 13.9614,  lng: 121.6121  }, // ✅
  sr_building:    { id: 'sr_building',    lat: 13.9612,  lng: 121.6126  }, // ✅ 1st entrance
  canteen:        { id: 'canteen',        lat: 13.9614,  lng: 121.6119  }, // ✅
  canteen_two:    { id: 'canteen_two',    lat: 13.9617,  lng: 121.6128  }, // ✅
  kitchen_hall:   { id: 'kitchen_hall',   lat: 13.9624,  lng: 121.6129  }, // ✅
  gymnasium:      { id: 'gymnasium',      lat: 13.9624,  lng: 121.6128  }, // ✅
  chapel:         { id: 'chapel',         lat: 13.9616,  lng: 121.6121  }, // ✅
  ccss:           { id: 'ccss',           lat: 13.9610,  lng: 121.6125  }, // ✅
  kindergarten:   { id: 'kindergarten',   lat: 13.9618,  lng: 121.6121  }, // ✅
};

const EDGES = [
  // ── Gate → south spine ───────────────────────────────────────────────────
  ['gate',            'motorcycle_parking'],
  ['gate',            'J1'],
  ['motorcycle_parking', 'J1'],

  // ── South horizontal spine (J1 → W1 → J2 → W2 → J3) ────────────────────
  ['J1',              'W1'],
  ['W1',              'J2'],
  ['J2',              'W2'],
  ['W2',              'J3'],

  // ── J1 → J8 branch (south-west, toward canteen) ─────────────────────────
  ['J1',              'J8'],
  ['J8',              'W6'],
  ['W6',              'W5'],
  ['W5',              'canteen'],
  ['W5',              'J4'],           // north via west path

  // ── J8 south-west path detail ────────────────────────────────────────────
  ['J8',              'canteen'],      // direct shortcut

  // ── J2 → new_building / ibed (south-central attachments) ────────────────
  ['J2',              'new_building'],
  ['J2',              'ibed'],

  // ── J3 south-east attachments ────────────────────────────────────────────
  ['J3',              'sr_building'],
  ['J3',              'ccss'],
  ['J3',              'parking_lot'],
  ['J3',              'W3'],
  ['W3',              'J5'],

  // ── J4 central hub ───────────────────────────────────────────────────────
  ['J4',              'chapel'],
  ['J4',              'kindergarten'],
  ['J4',              'ibed'],
  ['J4',              'new_building'],
  ['J4',              'W4'],
  ['W4',              'J5'],
  ['J4',              'W7'],
  ['W7',              'J5'],

  // ── J5 mid-east hub ──────────────────────────────────────────────────────
  ['J5',              'sr_building'],
  ['J5',              'canteen_two'],
  ['J5',              'W8'],
  ['W8',              'J6'],

  // ── J6 north-east ────────────────────────────────────────────────────────
  ['J6',              'W9'],
  ['W9',              'canteen_two'],
  ['W9',              'ea_tower'],
  ['J6',              'main_building'],
  ['J6',              'J7'],

  // ── J7 far north ─────────────────────────────────────────────────────────
  ['J7',              'gymnasium'],
  ['J7',              'kitchen_hall'],

  // ── main_building hub connections ────────────────────────────────────────
  ['main_building',   'kindergarten'],
  ['main_building',   'ea_tower'],
  ['main_building',   'kitchen_hall'],
  ['main_building',   'gymnasium'],

  // ── Northern cluster shortcuts ────────────────────────────────────────────
  ['kitchen_hall',    'gymnasium'],
  ['ea_tower',        'canteen_two'],
  ['ea_tower',        'kitchen_hall'],

  // ── Southern cluster shortcuts ────────────────────────────────────────────
  ['ibed',            'new_building'],
  ['ibed',            'sr_building'],
  ['sr_building',     'canteen_two'],
];

export function buildGraph() {
  const graph = {};
  for (const id of Object.keys(NODES)) {
    graph[id] = [];
  }
  for (const [a, b] of EDGES) {
    if (!NODES[a] || !NODES[b]) {
      console.warn(`campusGraph: edge [${a}, ${b}] references unknown node`);
      continue;
    }
    const dist = distanceTo(
      NODES[a].lat, NODES[a].lng,
      NODES[b].lat, NODES[b].lng,
    );
    graph[a].push({ id: b, dist });
    graph[b].push({ id: a, dist });
  }
  return graph;
}
