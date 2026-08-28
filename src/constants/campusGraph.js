// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — Campus Graph (Nodes + Edges)
//
// NODE NAMING CONVENTION:
//   A1–A8   = path junction nodes (no voice — just routing waypoints)
//             Update lat/lng after each survey walk session.
//   others  = building entrance nodes (used by voice assistant + AR)
//
// SURVEY STATUS:
//   ✅ A1  entrance          — real GPS (13.9611772, 121.6115074, alt 78.5m)
//   ✅ A2  junction_s area   — real GPS (13.9611796, 121.6125051, alt 77.9m)
//   ⏳ A3  junction_c        — estimate, needs survey
//   ⏳ A4  junction_n        — estimate, needs survey
//   ⏳ A5  junction_nw       — estimate, needs survey
//   ⏳ A6  junction_ne       — estimate, needs survey
//   ⏳ A7  junction_cw       — estimate, needs survey
//   ⏳ A8  junction_ce       — estimate, needs survey
//
// HOW TO UPDATE:
//   1. Walk to each junction and save the point with the Survey Tool.
//   2. Replace the lat/lng for the matching A-node below.
//   3. Update seed.py with the same values.
//   4. Run: python seed.py
// ─────────────────────────────────────────────────────────────────────────────

import { distanceTo } from '../utils/arMath';

export const NODES = {
  // ── Campus gate / parking ─────────────────────────────────────────────────
  gate:               { id: 'gate',               lat: 13.9608966, lng: 121.6113253 },
  motorcycle_parking: { id: 'motorcycle_parking', lat: 13.961253,  lng: 121.611517  },

  // ── Path junction nodes (A1–A8) ───────────────────────────────────────────
  A1: { id: 'A1', lat: 13.9611772, lng: 121.6115074 }, // ✅ surveyed — entrance/motor parking junction
  A2: { id: 'A2', lat: 13.9611796, lng: 121.6125051 }, // ✅ surveyed — junction before parking/CCSS/SR
  A3: { id: 'A3', lat: 13.9614,    lng: 121.612     }, // ⏳ estimate — central junction
  A4: { id: 'A4', lat: 13.9619,    lng: 121.6123    }, // ⏳ estimate — north junction
  A5: { id: 'A5', lat: 13.962,     lng: 121.6121    }, // ⏳ estimate — northwest junction
  A6: { id: 'A6', lat: 13.962,     lng: 121.6127    }, // ⏳ estimate — northeast junction
  A7: { id: 'A7', lat: 13.9615,    lng: 121.6119    }, // ⏳ estimate — central-west junction
  A8: { id: 'A8', lat: 13.9615,    lng: 121.6125    }, // ⏳ estimate — central-east junction

  // ── Building entrance nodes (voice assistant uses these IDs) ─────────────
  main_building:  { id: 'main_building',  lat: 13.962011,  lng: 121.612419  },
  new_building:   { id: 'new_building',   lat: 13.9611464, lng: 121.6121069 }, // ✅ surveyed — Potenciano Hall
  ea_tower:       { id: 'ea_tower',       lat: 13.961942,  lng: 121.612789  },
  ibed:           { id: 'ibed',           lat: 13.961389,  lng: 121.612211  },
  sr_building:    { id: 'sr_building',    lat: 13.961367,  lng: 121.612669  },
  canteen:        { id: 'canteen',        lat: 13.961397,  lng: 121.611861  },
  canteen_two:    { id: 'canteen_two',    lat: 13.96165,   lng: 121.612831  },
  kitchen_hall:   { id: 'kitchen_hall',   lat: 13.962342,  lng: 121.612903  },
  gymnasium:      { id: 'gymnasium',      lat: 13.962375,  lng: 121.612702  },
  chapel:         { id: 'chapel',         lat: 13.961664,  lng: 121.612053  },
  ccss:           { id: 'ccss',           lat: 13.960983,  lng: 121.612456  },
  kindergarten:   { id: 'kindergarten',   lat: 13.961817,  lng: 121.612114  },
  parking_lot:    { id: 'parking_lot',    lat: 13.961022,  lng: 121.612058  },
};

const EDGES = [
  // Gate → A1 → paths
  ['gate',         'A1'],
  ['A1',           'motorcycle_parking'],
  ['A1',           'A2'],

  // A2 cluster (south/central)
  ['A2',           'A3'],
  ['A2',           'new_building'],
  ['A2',           'canteen'],
  ['A2',           'parking_lot'],

  // A3 cluster (central)
  ['A3',           'A4'],
  ['A3',           'A7'],
  ['A3',           'A8'],
  ['A3',           'ibed'],
  ['A3',           'chapel'],
  ['A3',           'ccss'],

  // A7/A8 splits (central west/east)
  ['A7',           'new_building'],
  ['A7',           'ibed'],
  ['A8',           'sr_building'],
  ['A8',           'canteen_two'],

  // A4 cluster (north)
  ['A4',           'A5'],
  ['A4',           'A6'],
  ['A4',           'kindergarten'],
  ['A4',           'main_building'],

  ['A5',           'main_building'],
  ['A5',           'kindergarten'],

  ['A6',           'ea_tower'],
  ['A6',           'main_building'],
  ['A6',           'canteen_two'],
  ['A6',           'kitchen_hall'],

  // Building shortcuts
  ['main_building', 'ea_tower'],
  ['main_building', 'kitchen_hall'],
  ['main_building', 'gymnasium'],
  ['kitchen_hall',  'gymnasium'],
  ['ea_tower',      'canteen_two'],
  ['ibed',          'new_building'],
  ['ibed',          'sr_building'],
  ['sr_building',   'canteen_two'],
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
