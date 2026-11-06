// WAYFINDER — Hardcoded Campus Routes
//
// Every route goes: gate → perimeter road (R01-R15) → RFID entry (new_building/R37/R38)
// → interior path (R47-R51, R60-R63) → north spine (R66-R84) → destination
//
// J4 and J5 are REMOVED as waypoints — they are imprecise graph junctions (4dp coords)
// that caused visible squiggles on the map. Routes now follow the actual R-node walkways.
//
// EA Tower: exits the spine at R76, goes directly to ea_tower entrance (no overshoot).

// Shared perimeter road segment: gate → R15
const PERIMETER = [
  { lat: 13.9609,    lng: 121.6114   }, // gate
  { lat: 13.960943,  lng: 121.611350 }, // R01
  { lat: 13.961004,  lng: 121.611368 }, // R02
  { lat: 13.961056,  lng: 121.611389 }, // R03
  { lat: 13.961089,  lng: 121.611411 }, // R04
  { lat: 13.961127,  lng: 121.611440 }, // R05
  { lat: 13.961194,  lng: 121.611535 }, // R07
  { lat: 13.961191,  lng: 121.611605 }, // R08
  { lat: 13.961191,  lng: 121.611668 }, // R09
  { lat: 13.961189,  lng: 121.611735 }, // R10
  { lat: 13.961189,  lng: 121.611803 }, // R11
  { lat: 13.961187,  lng: 121.611890 }, // R12
  { lat: 13.961185,  lng: 121.611947 }, // R13
  { lat: 13.961187,  lng: 121.612017 }, // R14
  { lat: 13.961185,  lng: 121.612079 }, // R15
];

// RFID entry into campus interior: R15 → R37 → R38
const RFID_ENTRY = [
  { lat: 13.961224,  lng: 121.612080 }, // R37
  { lat: 13.961301,  lng: 121.612075 }, // R38
];

// Interior horizontal path: R38 → R47 → R51
const INTERIOR_PATH = [
  { lat: 13.961350,  lng: 121.612069 }, // R47
  { lat: 13.961439,  lng: 121.612069 }, // R48
  { lat: 13.961496,  lng: 121.612067 }, // R49
  { lat: 13.961555,  lng: 121.612068 }, // R50
  { lat: 13.961596,  lng: 121.612076 }, // R51
];

// Bench path turning west toward canteen: R51 → R60 → R63
// ONLY used for the canteen route — other routes use SPINE_DIRECT instead
const BENCH_PATH = [
  { lat: 13.961598,  lng: 121.612011 }, // R60
  { lat: 13.961591,  lng: 121.611942 }, // R61
  { lat: 13.961573,  lng: 121.611896 }, // R62
  { lat: 13.961559,  lng: 121.611866 }, // R63
];

// Direct R38 → R66 shortcut for spine-bound routes (avoids bench path/canteen area)
const SPINE_DIRECT = [
  { lat: 13.961592,  lng: 121.612153 }, // R66 — directly north of R38
];

// North spine from R63/R66 northward
const SPINE_START = [
  { lat: 13.961592,  lng: 121.612153 }, // R66
  { lat: 13.961589,  lng: 121.612210 }, // R67
  { lat: 13.961589,  lng: 121.612279 }, // R68
  { lat: 13.961586,  lng: 121.612338 }, // R69
  { lat: 13.961588,  lng: 121.612393 }, // R70
];

const SPINE_MID = [
  { lat: 13.961592,  lng: 121.612469 }, // R71
  { lat: 13.961607,  lng: 121.612537 }, // R72
  { lat: 13.961635,  lng: 121.612631 }, // R73
  { lat: 13.961686,  lng: 121.612672 }, // R74
  { lat: 13.961732,  lng: 121.612685 }, // R75
  { lat: 13.961780,  lng: 121.612697 }, // R76
];

const SPINE_NORTH = [
  { lat: 13.961870,  lng: 121.612718 }, // R77
  { lat: 13.961927,  lng: 121.612731 }, // R78
  { lat: 13.962003,  lng: 121.612751 }, // R79
  { lat: 13.962088,  lng: 121.612775 }, // R80
  { lat: 13.962168,  lng: 121.612798 }, // R81
  { lat: 13.962226,  lng: 121.612804 }, // R82
];

// Helper to build a route by concatenating segments
function route(...segments) {
  return [].concat(...segments);
}

export const HARDCODED_ROUTES = {

  // 1. main_building — perimeter → RFID → direct to spine → main_building
  main_building: route(
    PERIMETER, RFID_ENTRY, SPINE_DIRECT, SPINE_START,
    [{ lat: 13.961650, lng: 121.612393 }]
  ),

  // 2. ea_tower — perimeter → RFID → spine → R76 → ea_tower
  ea_tower: route(
    PERIMETER, RFID_ENTRY, SPINE_DIRECT, SPINE_START, SPINE_MID,
    [{ lat: 13.961744, lng: 121.612746 }]
  ),

  // 3. canteen (Big Canteen) — ONLY route using bench path (goes west to canteen)
  canteen: route(
    PERIMETER, RFID_ENTRY, INTERIOR_PATH, BENCH_PATH,
    [{ lat: 13.9614, lng: 121.6119 }]
  ),

  // 4. ibed — perimeter → RFID → ibed (straight north, no detour)
  ibed: route(
    PERIMETER, RFID_ENTRY,
    [{ lat: 13.9614, lng: 121.6121 }]
  ),

  // 5. sr_building — perimeter → RFID → spine → R71 → sr_building
  sr_building: route(
    PERIMETER, RFID_ENTRY, SPINE_DIRECT, SPINE_START,
    [
      { lat: 13.961592, lng: 121.612469 }, // R71
      { lat: 13.961530, lng: 121.612643 },
    ]
  ),

  // 6. chapel — perimeter → RFID → R66 → chapel
  chapel: route(
    PERIMETER, RFID_ENTRY, SPINE_DIRECT,
    [{ lat: 13.961650, lng: 121.612098 }]
  ),

  // 7. kindergarten — perimeter → RFID → R66 → R67 → kindergarten
  kindergarten: route(
    PERIMETER, RFID_ENTRY, SPINE_DIRECT,
    [
      { lat: 13.961589, lng: 121.612210 }, // R67
      { lat: 13.961689, lng: 121.612115 },
    ]
  ),

  // 8. gymnasium — perimeter → RFID → spine → R84 → gymnasium
  gymnasium: route(
    PERIMETER, RFID_ENTRY, SPINE_DIRECT, SPINE_START, SPINE_MID, SPINE_NORTH,
    [
      { lat: 13.962317, lng: 121.612814 },
      { lat: 13.962384, lng: 121.612815 },
      { lat: 13.9624,   lng: 121.6128   },
    ]
  ),

  // 9. kitchen_hall — perimeter → RFID → spine → R82 → kitchen_hall
  kitchen_hall: route(
    PERIMETER, RFID_ENTRY, SPINE_DIRECT, SPINE_START, SPINE_MID, SPINE_NORTH,
    [{ lat: 13.9624, lng: 121.6129 }]
  ),

  // 10. canteen_two — perimeter → RFID → spine → R73 → canteen_two
  canteen_two: route(
    PERIMETER, RFID_ENTRY, SPINE_DIRECT, SPINE_START,
    [
      { lat: 13.961592, lng: 121.612469 },
      { lat: 13.961607, lng: 121.612537 },
      { lat: 13.961635, lng: 121.612631 },
      { lat: 13.961708, lng: 121.612800 },
    ]
  ),

  // 11. engineering (New IBED Bldg) — perimeter → RFID → interior → engineering
  engineering: route(
    PERIMETER, RFID_ENTRY, INTERIOR_PATH,
    [{ lat: 13.961637, lng: 121.612220 }]
  ),

  // 12. new_building (RFID) — perimeter → new_building
  new_building: route(
    PERIMETER,
    [{ lat: 13.9613, lng: 121.6121 }] // new_building RFID entrance
  ),

  // 13. ccss — perimeter extended east → south branch → ccss
  ccss: route(
    PERIMETER,
    [
      { lat: 13.961181, lng: 121.612153 }, // R16
      { lat: 13.961179, lng: 121.612207 }, // R17
      { lat: 13.961176, lng: 121.612256 }, // R18
      { lat: 13.961174, lng: 121.612319 }, // R19
      { lat: 13.961172, lng: 121.612381 }, // R20
      { lat: 13.961170, lng: 121.612451 }, // R21
      { lat: 13.961189, lng: 121.612502 }, // R22
      { lat: 13.961085, lng: 121.612536 }, // R27
      { lat: 13.961058, lng: 121.612527 }, // R28
      { lat: 13.961028, lng: 121.612516 }, // R29
      { lat: 13.961008, lng: 121.612466 }, // ccss entrance
    ]
  ),

  // 14. parking_lot — perimeter extended east → parking_lot
  parking_lot: route(
    PERIMETER,
    [
      { lat: 13.961181, lng: 121.612153 }, // R16
      { lat: 13.961179, lng: 121.612207 }, // R17
      { lat: 13.961176, lng: 121.612256 }, // R18
      { lat: 13.961174, lng: 121.612319 }, // R19
      { lat: 13.9611,   lng: 121.6123   }, // parking_lot entrance
    ]
  ),

  // 15. motorcycle_parking — gate → motorcycle_parking direct
  motorcycle_parking: [
    { lat: 13.9609, lng: 121.6114 }, // gate
    { lat: 13.9612, lng: 121.6115 }, // motorcycle_parking
  ],

  // 16. ea_tower_2 (EA Tower 2nd entrance) — spine → R79 → ea_tower_2
  ea_tower_2: route(
    PERIMETER, RFID_ENTRY, SPINE_DIRECT, SPINE_START, SPINE_MID, SPINE_NORTH,
    [{ lat: 13.962093, lng: 121.612822 }]
  ),

  // 17. ibed_2 (IBED 2nd entrance) — spine to R70 area then to ibed_2
  ibed_2: route(
    PERIMETER, RFID_ENTRY, SPINE_DIRECT, SPINE_START,
    [{ lat: 13.961546, lng: 121.612393 }]
  ),

  // 18. sr_building_2 — perimeter east branch → sr_building_2
  sr_building_2: route(
    PERIMETER,
    [
      { lat: 13.961181, lng: 121.612153 }, // R16
      { lat: 13.961179, lng: 121.612207 }, // R17
      { lat: 13.961176, lng: 121.612256 }, // R18
      { lat: 13.961174, lng: 121.612319 }, // R19
      { lat: 13.961172, lng: 121.612381 }, // R20
      { lat: 13.961170, lng: 121.612451 }, // R21
      { lat: 13.961189, lng: 121.612502 }, // R22
      { lat: 13.961188, lng: 121.612581 }, // sr_building_2 entrance
    ]
  ),

  // 19. main_building_2 (Main Bldg 2nd entrance) — spine → R80 → main_building_2
  main_building_2: route(
    PERIMETER, RFID_ENTRY, SPINE_DIRECT, SPINE_START, SPINE_MID, SPINE_NORTH,
    [{ lat: 13.962135, lng: 121.612759 }]
  ),
};

// Returns the ordered waypoint array for a destinationId, or null if not found.
export function getHardcodedRoute(destinationId) {
  return HARDCODED_ROUTES[destinationId] ?? null;
}
