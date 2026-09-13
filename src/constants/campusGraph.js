// WAYFINDER — Campus Graph (Nodes + Edges)
//
// NODE NAMING CONVENTION:
//   J1-J8   = major intersections (pinpointed on Google Maps)
//   W1-W9   = original walkable waypoints
//   R01-R85 = new detailed road/path nodes (perimeter road, internal paths)
//   others  = building entrance nodes
//
// All nodes pinpointed on Google Maps.
// Bad shortcut edges (crossing buildings) have been removed.
// EA Tower uses 1st (south) entrance. SR Building uses 1st (south) entrance.

import { distanceTo } from '../utils/arMath';

export const NODES = {
  // Campus gate / parking
  gate:               { id: 'gate',               lat: 13.9609,    lng: 121.6114   },
  motorcycle_parking: { id: 'motorcycle_parking', lat: 13.9612,    lng: 121.6115   },
  parking_lot:        { id: 'parking_lot',        lat: 13.9611,    lng: 121.6123   },

  // Major intersection nodes
  J1: { id: 'J1', lat: 13.9612, lng: 121.6116 }, // south - near gate / motorcycle parking
  J2: { id: 'J2', lat: 13.9612, lng: 121.6121 }, // south-central
  J3: { id: 'J3', lat: 13.9612, lng: 121.6126 }, // south-east - SR / CCSS / parking lot
  J4: { id: 'J4', lat: 13.9616, lng: 121.6121 }, // mid - chapel / kindergarten / ibed / new_building
  J5: { id: 'J5', lat: 13.9616, lng: 121.6126 }, // mid-east - canteen_two / SR 2nd entrance
  J6: { id: 'J6', lat: 13.9621, lng: 121.6128 }, // north-east - EA Tower 2nd entrance area
  J7: { id: 'J7', lat: 13.9624, lng: 121.6128 }, // far north - gymnasium / kitchen_hall
  J8: { id: 'J8', lat: 13.9614, lng: 121.6116 }, // south-west - canteen branch

  // Original walkable waypoints
  W1: { id: 'W1', lat: 13.9612, lng: 121.6119 }, // between J1 and J2
  W2: { id: 'W2', lat: 13.9612, lng: 121.6123 }, // between J2 and J3
  W3: { id: 'W3', lat: 13.9614, lng: 121.6126 }, // between J3 and J5
  W4: { id: 'W4', lat: 13.9616, lng: 121.6122 }, // just east of J4
  W5: { id: 'W5', lat: 13.9616, lng: 121.6119 }, // west of J4 - canteen side
  W6: { id: 'W6', lat: 13.9615, lng: 121.6117 }, // between J8 and W5
  W7: { id: 'W7', lat: 13.9616, lng: 121.6125 }, // between J4/J5 area
  W8: { id: 'W8', lat: 13.9617, lng: 121.6127 }, // between J5 and J6
  W9: { id: 'W9', lat: 13.9619, lng: 121.6127 }, // between J6 and canteen_two/ea_tower

  // R-nodes: Bottom perimeter road (southwest to east)
  R01: { id: 'R01', lat: 13.960943, lng: 121.611350 }, // far southwest - start of perimeter road
  R02: { id: 'R02', lat: 13.961004, lng: 121.611368 },
  R03: { id: 'R03', lat: 13.961056, lng: 121.611389 },
  R04: { id: 'R04', lat: 13.961089, lng: 121.611411 },
  R05: { id: 'R05', lat: 13.961127, lng: 121.611440 },
  R06: { id: 'R06', lat: 13.961195, lng: 121.611493 }, // near motorcycle parking
  R07: { id: 'R07', lat: 13.961194, lng: 121.611535 },
  R08: { id: 'R08', lat: 13.961191, lng: 121.611605 },
  R09: { id: 'R09', lat: 13.961191, lng: 121.611668 },
  R10: { id: 'R10', lat: 13.961189, lng: 121.611735 },
  R11: { id: 'R11', lat: 13.961189, lng: 121.611803 },
  R12: { id: 'R12', lat: 13.961187, lng: 121.611890 }, // near canteen entrance
  R13: { id: 'R13', lat: 13.961185, lng: 121.611947 },
  R14: { id: 'R14', lat: 13.961187, lng: 121.612017 },
  R15: { id: 'R15', lat: 13.961185, lng: 121.612079 },
  R16: { id: 'R16', lat: 13.961181, lng: 121.612153 },
  R17: { id: 'R17', lat: 13.961179, lng: 121.612207 },
  R18: { id: 'R18', lat: 13.961176, lng: 121.612256 },
  R19: { id: 'R19', lat: 13.961174, lng: 121.612319 },
  R20: { id: 'R20', lat: 13.961172, lng: 121.612381 },
  R21: { id: 'R21', lat: 13.961170, lng: 121.612451 }, // near parking lot / CCSS
  R22: { id: 'R22', lat: 13.961189, lng: 121.612502 },
  R23: { id: 'R23', lat: 13.961186, lng: 121.612533 }, // perimeter road east end

  // R-nodes: South branch paths (below main road, toward CCSS)
  R24: { id: 'R24', lat: 13.961158, lng: 121.612311 }, // branch toward CCSS
  R25: { id: 'R25', lat: 13.961113, lng: 121.612313 }, // car parking entrance
  R26: { id: 'R26', lat: 13.961122, lng: 121.612547 }, // east of CCSS
  R27: { id: 'R27', lat: 13.961085, lng: 121.612536 },
  R28: { id: 'R28', lat: 13.961058, lng: 121.612527 },
  R29: { id: 'R29', lat: 13.961028, lng: 121.612516 },
  R30: { id: 'R30', lat: 13.961008, lng: 121.612466 }, // CCSS entrance

  // R-nodes: East spine going north (toward canteen_two / EA Tower)
  R31: { id: 'R31', lat: 13.961269, lng: 121.612575 },
  R32: { id: 'R32', lat: 13.961325, lng: 121.612593 },
  R33: { id: 'R33', lat: 13.961406, lng: 121.612612 },
  R34: { id: 'R34', lat: 13.961491, lng: 121.612628 },
  R35: { id: 'R35', lat: 13.961548, lng: 121.612632 },
  R36: { id: 'R36', lat: 13.961602, lng: 121.612638 }, // near canteen_two

  // R-nodes: Internal cross paths (New Building / IBED area)
  R37: { id: 'R37', lat: 13.961224, lng: 121.612080 }, // south of new_building
  R38: { id: 'R38', lat: 13.961301, lng: 121.612075 }, // internal cross path hub
  R39: { id: 'R39', lat: 13.961302, lng: 121.612005 },
  R40: { id: 'R40', lat: 13.961303, lng: 121.611947 },
  R41: { id: 'R41', lat: 13.961305, lng: 121.611887 },
  R42: { id: 'R42', lat: 13.961309, lng: 121.611813 }, // west side going south
  R43: { id: 'R43', lat: 13.961298, lng: 121.612193 },
  R44: { id: 'R44', lat: 13.961296, lng: 121.612244 },
  R45: { id: 'R45', lat: 13.961294, lng: 121.612303 }, // near ibed
  R46: { id: 'R46', lat: 13.961294, lng: 121.612365 },
  R47: { id: 'R47', lat: 13.961350, lng: 121.612069 }, // internal horizontal
  R48: { id: 'R48', lat: 13.961439, lng: 121.612069 },
  R49: { id: 'R49', lat: 13.961496, lng: 121.612067 },
  R50: { id: 'R50', lat: 13.961555, lng: 121.612068 },
  R51: { id: 'R51', lat: 13.961596, lng: 121.612076 }, // horizontal east end
  R52: { id: 'R52', lat: 13.961409, lng: 121.612120 }, // vertical connector mid
  R53: { id: 'R53', lat: 13.961409, lng: 121.612179 },
  R54: { id: 'R54', lat: 13.961411, lng: 121.612271 },
  R55: { id: 'R55', lat: 13.961414, lng: 121.612361 },
  R56: { id: 'R56', lat: 13.961417, lng: 121.612381 },
  R57: { id: 'R57', lat: 13.961465, lng: 121.612389 }, // east branch
  R58: { id: 'R58', lat: 13.961518, lng: 121.612389 },
  R59: { id: 'R59', lat: 13.961546, lng: 121.612393 },
  R60: { id: 'R60', lat: 13.961598, lng: 121.612011 }, // internal northeast
  R61: { id: 'R61', lat: 13.961591, lng: 121.611942 },
  R62: { id: 'R62', lat: 13.961573, lng: 121.611896 },

  // R-nodes: Canteen benches area + north spine to top of campus
  R63: { id: 'R63', lat: 13.961559, lng: 121.611866 }, // canteen benches area
  R64: { id: 'R64', lat: 13.961428, lng: 121.611660 },
  R65: { id: 'R65', lat: 13.961394, lng: 121.611624 }, // canteen bench path south
  R66: { id: 'R66', lat: 13.961592, lng: 121.612153 }, // north spine start
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
  R78: { id: 'R78', lat: 13.961927, lng: 121.612731 }, // near main_building
  R79: { id: 'R79', lat: 13.962003, lng: 121.612751 },
  R80: { id: 'R80', lat: 13.962088, lng: 121.612775 },
  R81: { id: 'R81', lat: 13.962168, lng: 121.612798 },
  R82: { id: 'R82', lat: 13.962226, lng: 121.612804 }, // near ea_tower / canteen_two
  R83: { id: 'R83', lat: 13.962317, lng: 121.612814 }, // near kitchen_hall
  R84: { id: 'R84', lat: 13.962384, lng: 121.612815 },
  R85: { id: 'R85', lat: 13.962447, lng: 121.612821 }, // top of campus - near gymnasium

  // Building entrance nodes
  main_building:  { id: 'main_building',  lat: 13.9617, lng: 121.6124 },
  new_building:   { id: 'new_building',   lat: 13.9613, lng: 121.6121 },
  ea_tower:       { id: 'ea_tower',       lat: 13.9618, lng: 121.6128 }, // 1st entrance
  ibed:           { id: 'ibed',           lat: 13.9614, lng: 121.6121 },
  sr_building:    { id: 'sr_building',    lat: 13.9612, lng: 121.6126 }, // 1st entrance
  canteen:        { id: 'canteen',        lat: 13.9614, lng: 121.6119 },
  canteen_two:    { id: 'canteen_two',    lat: 13.9617, lng: 121.6128 },
  kitchen_hall:   { id: 'kitchen_hall',   lat: 13.9624, lng: 121.6129 },
  gymnasium:      { id: 'gymnasium',      lat: 13.9624, lng: 121.6128 },
  chapel:         { id: 'chapel',         lat: 13.961650, lng: 121.612098 }, // ✅ beside kindergarten
  ccss:           { id: 'ccss',           lat: 13.961008, lng: 121.612466 }, // ✅ matched to R30 entrance node
  kindergarten:   { id: 'kindergarten',   lat: 13.961689, lng: 121.612115 }, // ✅ beside chapel
};

const EDGES = [
  // Gate -> perimeter road chain (southwest to east)
  ['gate',             'R01'],
  ['R01',              'R02'],
  ['R02',              'R03'],
  ['R03',              'R04'],
  ['R04',              'R05'],
  ['R05',              'R06'],
  ['R06',              'motorcycle_parking'],
  ['R06',              'R07'],
  ['R07',              'R08'],
  ['R08',              'R09'],
  ['R09',              'R10'],
  ['R10',              'R11'],
  ['R11',              'R12'],
  ['R12',              'canteen'],
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

  // Perimeter road south branch (CCSS / parking only — east path is BLOCKED)
  ['R21',              'R24'],
  ['R24',              'R25'],
  ['R25',              'parking_lot'],
  ['R22',              'R27'],
  ['R27',              'R28'],
  ['R28',              'R29'],
  ['R29',              'R30'],
  ['R30',              'ccss'],
  // R26 -> R31 east spine REMOVED — path physically blocked
  // SR Building is only accessible via new_building internal paths

  // Gate -> J1 -> main internal spine
  ['gate',             'J1'],
  ['J1',               'motorcycle_parking'],
  ['J1',               'W1'],
  ['W1',               'J2'],
  ['J2',               'W2'],
  ['W2',               'J3'],
  // J3 -> W3 -> J5 REMOVED — east path blocked, no longer reachable from south

  // J1 -> J8 -> canteen / internal paths
  ['J1',               'J8'],
  ['J8',               'W6'],
  ['W6',               'W5'],
  ['W5',               'canteen'],
  ['W5',               'J4'],

  // Internal cross paths: New Building / IBED area
  ['R15',              'R37'],
  ['R37',              'R38'],
  ['R38',              'new_building'],
  ['R38',              'R39'],
  ['R39',              'R40'],
  ['R40',              'R41'],
  ['R41',              'R42'],
  ['R42',              'R65'],
  ['R38',              'R43'],
  ['R43',              'R44'],
  ['R44',              'R45'],
  ['R45',              'ibed'],
  ['R45',              'R46'],
  ['R46',              'J5'],
  ['R38',              'R47'],
  ['R47',              'R48'],
  ['R48',              'R52'],
  ['R48',              'R49'],
  ['R49',              'R50'],
  ['R50',              'R51'],
  ['R51',              'R60'],
  ['R60',              'R61'],
  ['R61',              'R62'],
  ['R62',              'R63'],
  ['R52',              'R53'],
  ['R53',              'R54'],
  ['R54',              'R55'],
  ['R55',              'R56'],
  ['R56',              'R57'],
  ['R57',              'R58'],
  ['R58',              'R59'],
  ['R59',              'R70'],

  // Canteen bench paths
  ['canteen',          'R63'],
  ['R63',              'R64'],
  ['R64',              'R65'],
  ['R65',              'J8'],

  // North spine (canteen area -> top of campus)
  ['R63',              'R66'],
  ['R66',              'R67'],
  ['R67',              'R68'],
  ['R68',              'R69'],
  ['R69',              'R70'],
  ['R70',              'R71'],
  ['R71',              'R72'],
  ['R72',              'R73'],
  ['R73',              'R74'],
  ['R74',              'canteen_two'],
  ['R74',              'R75'],
  ['R75',              'R76'],
  ['R76',              'main_building'],
  ['R76',              'R77'],
  ['R77',              'R78'],
  ['R78',              'ea_tower'],
  ['R78',              'R79'],
  ['R79',              'R80'],
  ['R80',              'R81'],
  ['R81',              'R82'],
  ['R82',              'kitchen_hall'],
  ['R82',              'R83'],
  ['R83',              'R84'],
  ['R84',              'R85'],
  ['R85',              'gymnasium'],
  ['R85',              'kitchen_hall'],

  // J-node connections bridging old and new graph
  ['J2',               'R37'],
  // J3 -> R23 REMOVED — east path blocked
  ['J4',               'chapel'],
  ['J4',               'kindergarten'],
  ['J4',               'W4'],
  ['W4',               'J5'],
  ['J4',               'W7'],
  ['W7',               'J5'],
  ['J5',               'W8'],
  ['W8',               'J6'],
  ['J6',               'W9'],
  ['W9',               'canteen_two'],
  ['J6',               'J7'],
  ['J7',               'gymnasium'],
  ['J7',               'kitchen_hall'],

  // SR Building — only reachable via new_building internal paths
  ['R46',              'sr_building'],  // internal east branch connects to SR Building
  ['R59',              'sr_building'],  // internal east branch also connects
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
