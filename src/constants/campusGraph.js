// WAYFINDER — Campus Graph (Nodes + Edges)
//
// ROUTING RULES:
//   - Gate → perimeter road → New Building (RFID) → campus interior
//   - Canteen: ONLY via ibed_2 (interior path) — no direct new_building→canteen shortcut
//   - Main Building: directly off R70 on the north spine (no MB1/MB2 hook)
//   - EA Tower: entrance off R76 (west approach) — no U-turn past R77/R78
//   - IBED: directly off R48 interior path — no J4 hook
//   - Motor Parking: direct from gate only
//   - CCSS / Car Parking: accessible from perimeter road south branch

import { distanceTo } from '../utils/arMath';

export const NODES = {
  // Campus gate / parking
  gate:               { id: 'gate',               lat: 13.9609,    lng: 121.6114   },
  motorcycle_parking: { id: 'motorcycle_parking', lat: 13.9612,    lng: 121.6115   },
  parking_lot:        { id: 'parking_lot',        lat: 13.9611,    lng: 121.6123   },

  // Major intersection nodes
  J4: { id: 'J4', lat: 13.9616, lng: 121.6121 },
  J5: { id: 'J5', lat: 13.9616, lng: 121.6126 },
  J7: { id: 'J7', lat: 13.9624, lng: 121.6128 },
  MB1: { id: 'MB1', lat: 13.96167,  lng: 121.61239  },
  MB2: { id: 'MB2', lat: 13.961628, lng: 121.612386 },

  // R-nodes: Bottom perimeter road (southwest to east)
  R01: { id: 'R01', lat: 13.960943, lng: 121.611350 },
  R02: { id: 'R02', lat: 13.961004, lng: 121.611368 },
  R03: { id: 'R03', lat: 13.961056, lng: 121.611389 },
  R04: { id: 'R04', lat: 13.961089, lng: 121.611411 },
  R05: { id: 'R05', lat: 13.961127, lng: 121.611440 },
  R07: { id: 'R07', lat: 13.961194, lng: 121.611535 },
  R08: { id: 'R08', lat: 13.961191, lng: 121.611605 },
  R09: { id: 'R09', lat: 13.961191, lng: 121.611668 },
  R10: { id: 'R10', lat: 13.961189, lng: 121.611735 },
  R11: { id: 'R11', lat: 13.961189, lng: 121.611803 },
  R12: { id: 'R12', lat: 13.961187, lng: 121.611890 },
  R13: { id: 'R13', lat: 13.961185, lng: 121.611947 },
  R14: { id: 'R14', lat: 13.961187, lng: 121.612017 },
  R15: { id: 'R15', lat: 13.961185, lng: 121.612079 },
  R16: { id: 'R16', lat: 13.961181, lng: 121.612153 },
  R17: { id: 'R17', lat: 13.961179, lng: 121.612207 },
  R18: { id: 'R18', lat: 13.961176, lng: 121.612256 },
  R19: { id: 'R19', lat: 13.961174, lng: 121.612319 },
  R20: { id: 'R20', lat: 13.961172, lng: 121.612381 },
  R21: { id: 'R21', lat: 13.961170, lng: 121.612451 },
  R22: { id: 'R22', lat: 13.961189, lng: 121.612502 },
  R23: { id: 'R23', lat: 13.961186, lng: 121.612533 },

  // R-nodes: South branch (toward CCSS)
  R24: { id: 'R24', lat: 13.961158, lng: 121.612311 },
  R25: { id: 'R25', lat: 13.961113, lng: 121.612313 },
  R26: { id: 'R26', lat: 13.961122, lng: 121.612547 },
  R27: { id: 'R27', lat: 13.961085, lng: 121.612536 },
  R28: { id: 'R28', lat: 13.961058, lng: 121.612527 },
  R29: { id: 'R29', lat: 13.961028, lng: 121.612516 },
  R30: { id: 'R30', lat: 13.961008, lng: 121.612466 },

  // R-nodes: Campus interior entry path
  R37: { id: 'R37', lat: 13.961224, lng: 121.612080 },
  R38: { id: 'R38', lat: 13.961301, lng: 121.612075 }, // interior hub
  R47: { id: 'R47', lat: 13.961350, lng: 121.612069 },
  R48: { id: 'R48', lat: 13.961439, lng: 121.612069 },
  R49: { id: 'R49', lat: 13.961496, lng: 121.612067 },
  R50: { id: 'R50', lat: 13.961555, lng: 121.612068 },
  R51: { id: 'R51', lat: 13.961596, lng: 121.612076 },
  R60: { id: 'R60', lat: 13.961598, lng: 121.612011 },
  R61: { id: 'R61', lat: 13.961591, lng: 121.611942 },
  R62: { id: 'R62', lat: 13.961573, lng: 121.611896 },

  // R-nodes: Canteen benches + north spine
  R63: { id: 'R63', lat: 13.961559, lng: 121.611866 },
  R64: { id: 'R64', lat: 13.961428, lng: 121.611660 },
  R65: { id: 'R65', lat: 13.961394, lng: 121.611624 },
  R66: { id: 'R66', lat: 13.961592, lng: 121.612153 },
  R67: { id: 'R67', lat: 13.961589, lng: 121.612210 },
  R68: { id: 'R68', lat: 13.961589, lng: 121.612279 },
  R69: { id: 'R69', lat: 13.961586, lng: 121.612338 },
  R70: { id: 'R70', lat: 13.961588, lng: 121.612393 },
  R71: { id: 'R71', lat: 13.961592, lng: 121.612469 },
  R72: { id: 'R72', lat: 13.961607, lng: 121.612537 },
  R73: { id: 'R73', lat: 13.961635, lng: 121.612631 },
  R74: { id: 'R74', lat: 13.961686, lng: 121.612672 },
  R75: { id: 'R75', lat: 13.961732, lng: 121.612685 },
  R76: { id: 'R76', lat: 13.961780, lng: 121.612697 },
  R77: { id: 'R77', lat: 13.961870, lng: 121.612718 },
  R78: { id: 'R78', lat: 13.961927, lng: 121.612731 },
  R79: { id: 'R79', lat: 13.962003, lng: 121.612751 },
  R80: { id: 'R80', lat: 13.962088, lng: 121.612775 },
  R81: { id: 'R81', lat: 13.962168, lng: 121.612798 },
  R82: { id: 'R82', lat: 13.962226, lng: 121.612804 },
  R83: { id: 'R83', lat: 13.962317, lng: 121.612814 },
  R84: { id: 'R84', lat: 13.962384, lng: 121.612815 },

  // Building entrance nodes
  // main_building entrance on south face, directly north of R70 (clean north approach)
  main_building:  { id: 'main_building',  lat: 13.961650,  lng: 121.612393 },
  main_building_2:{ id: 'main_building_2',lat: 13.962135,  lng: 121.612759 },
  new_building:   { id: 'new_building',   lat: 13.9613,    lng: 121.6121   }, // RFID — mandatory entry
  engineering:    { id: 'engineering',    lat: 13.961637,  lng: 121.612220 },
  // ea_tower entrance north of R76 — path continues northeast, no south backtrack
  ea_tower:       { id: 'ea_tower',       lat: 13.961744,  lng: 121.612746 },
  ea_tower_2:     { id: 'ea_tower_2',     lat: 13.962093,  lng: 121.612822 },
  // ibed entrance north-west of R48 — path goes north into entrance, no south backtrack
  ibed:           { id: 'ibed',           lat: 13.9614,    lng: 121.6121   },
  ibed_2:         { id: 'ibed_2',         lat: 13.961546,  lng: 121.612393 },
  sr_building:    { id: 'sr_building',    lat: 13.961530,  lng: 121.612643 },
  sr_building_2:  { id: 'sr_building_2',  lat: 13.961188,  lng: 121.612581 },
  // canteen entrance between bench path and ibed_2 — south-west of ibed_2, east of bench nodes
  canteen:        { id: 'canteen',        lat: 13.9614,    lng: 121.6119   },
  canteen_two:    { id: 'canteen_two',    lat: 13.9617,    lng: 121.6128   },
  kitchen_hall:   { id: 'kitchen_hall',   lat: 13.9624,    lng: 121.6129   },
  gymnasium:      { id: 'gymnasium',      lat: 13.9624,    lng: 121.6128   },
  chapel:         { id: 'chapel',         lat: 13.961650,  lng: 121.612098 },
  ccss:           { id: 'ccss',           lat: 13.961008,  lng: 121.612466 },
  kindergarten:   { id: 'kindergarten',   lat: 13.961689,  lng: 121.612115 },
};

const EDGES = [
  // ── PERIMETER ROAD (one-directional from gate eastward) ──────────────────
  // NOTE: These are stored as bidirectional in buildGraph, but A* will naturally
  // route gate→east because that's the only direction with onward connections.
  ['gate',             'R01'],
  ['R01',              'R02'],
  ['R02',              'R03'],
  ['R03',              'R04'],
  ['R04',              'R05'],
  ['R05',              'R07'],
  ['R07',              'R08'],
  ['R08',              'R09'],
  ['R09',              'R10'],
  ['R10',              'R11'],
  ['R11',              'R12'],
  ['R12',              'R13'],
  ['R13',              'R14'],
  ['R14',              'R15'],
  ['R15',              'R16'],
  ['R16',              'R17'],
  ['R17',              'R18'],
  ['R18',              'R19'],
  ['R19',              'R20'],
  ['R20',              'R21'],
  ['R21',              'R22'],
  ['R22',              'R23'],
  ['R23',              'R26'],

  // ── DIRECT GATE DESTINATIONS (not passthrough nodes) ─────────────────────
  ['gate',             'motorcycle_parking'],

  // ── PERIMETER SOUTH BRANCH (CCSS / parking only) ─────────────────────────
  ['R21',              'R24'],
  ['R24',              'R25'],
  ['R25',              'parking_lot'],
  ['R19',              'parking_lot'],   // shortcut
  ['R22',              'R27'],
  ['R27',              'R28'],
  ['R28',              'R29'],
  ['R29',              'R30'],
  ['R30',              'ccss'],

  // ── NEW BUILDING: MANDATORY CAMPUS ENTRY ──────────────────────────────────
  ['R15',              'new_building'],  // perimeter → RFID entrance
  ['R15',              'R37'],           // perimeter → interior shortcut node
  ['R37',              'R38'],           // R37 → interior hub
  ['new_building',     'R38'],           // RFID → interior hub (via R38 westward — kept for backwards compat)
  ['new_building',     'R47'],           // RFID → interior path direct north — eliminates westward R38 first step
  // Canteen ONLY via ibed_2 interior path — NO direct new_building→canteen shortcut
  // (removed: ['new_building', 'canteen'])

  // ── INTERIOR CAMPUS HUB → internal paths ─────────────────────────────────
  ['R38',              'R47'],
  ['R47',              'R48'],
  ['R48',              'R49'],
  ['R49',              'R50'],
  ['R50',              'R51'],
  ['R51',              'R60'],
  ['R60',              'R61'],
  ['R61',              'R62'],
  ['R38',              'R66'],           // direct hub → north spine
  ['R38',              'J4'],            // hub → mid-campus junction

  // ── CANTEEN BENCH PATH (internal only) ───────────────────────────────────
  ['canteen',          'R63'],
  ['R63',              'R64'],
  ['R64',              'R65'],

  // ── J4 / J5 INTERSECTION ─────────────────────────────────────────────────
  ['J4',               'chapel'],
  ['J4',               'kindergarten'],
  // ibed removed from J4 — IBED now connects directly off R48 (no backtrack)
  ['J4',               'J5'],
  ['J5',               'sr_building'],
  ['J5',               'canteen_two'],
  ['J5',               'J7'],
  ['J5',               'MB2'],
  ['MB2',              'MB1'],
  ['MB1',              'main_building'],
  ['sr_building_2',    'R22'],
  ['J7',               'gymnasium'],
  ['J7',               'kitchen_hall'],
  ['J7',               'R82'],           // direct north spine connection

  // ── CANTEEN: via ibed_2 interior node ────────────────────────────────────
  // Canteen must be reached through the campus interior (past IBED), not via perimeter
  ['ibed_2',           'canteen'],       // IBED 2nd entrance → canteen (internal path)

  // ── IBED: direct off interior path — no J4 hook ─────────────────────────
  ['R48',              'ibed'],          // interior path → IBED entrance (straight in, no backtrack)
  ['R51',              'ibed_2'],        // interior path → IBED 2nd entrance

  // ── NORTH SPINE (canteen benches → top of campus) ────────────────────────
  ['R63',              'R66'],
  ['R66',              'engineering'],
  ['R66',              'R67'],
  ['R67',              'R68'],
  ['R68',              'R69'],
  ['R69',              'R70'],
  ['R70',              'main_building'], // Main Building: direct off spine — clean left turn, no backtrack
  ['R70',              'R71'],
  ['R71',              'R72'],
  ['R72',              'R73'],
  ['R73',              'R74'],
  ['R74',              'canteen_two'],
  ['R74',              'R75'],
  ['R75',              'R76'],
  ['R76',              'ea_tower'],      // EA Tower 1st: direct west approach — no U-turn past R77/R78
  ['R76',              'R77'],
  ['R77',              'R78'],
  // R78→ea_tower removed — ea_tower now connects at R76 (closer, no overshoot)
  ['R79',              'ea_tower_2'],    // EA Tower 2nd: terminal only
  ['R78',              'R79'],
  ['R79',              'R80'],
  ['R80',              'main_building_2'],
  ['R80',              'R81'],
  ['R81',              'R82'],
  ['R82',              'kitchen_hall'],
  ['R82',              'R83'],
  ['R83',              'R84'],
  ['R84',              'gymnasium'],
  ['R84',              'kitchen_hall'],
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
