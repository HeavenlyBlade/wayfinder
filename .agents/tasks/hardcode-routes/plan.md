# Implementation Plan — Hardcode all campus routes + fix AR arrow

**Worktree:** `c:/Users/Asus/WAYFINDER-FULLPACKAGE/wayfinder`
**Goal:** Hardcode every campus navigation route as a static waypoint array so the path is correct regardless of Supabase/DB state, bypassing the buggy local A* graph and the timing-out backend. Also replace the flat horizontal AR arrow with an upright navigation-pin shape.

> Planner note: This is a single-file plan (no FEAT decomposition). The coder implements steps 1–4 in order. The coder must NOT invent coordinates for any node — every `{lat, lng}` below is copied verbatim from `src/constants/campusGraph.js` `NODES`.

---

## STEP 1 — Node existence verification (CRITICAL)

**Result: ALL node IDs found in `campusGraph.js` NODES. No missing nodes.**

The full set of unique node IDs referenced across the 19 routes is:

`gate, motorcycle_parking, parking_lot, J4, J5, R01–R05, R07–R15, R16–R22, R27–R30, R37, R38, R47–R51, R60–R63, R70–R84, main_building, main_building_2, new_building, engineering, ea_tower, ea_tower_2, ibed, ibed_2, sr_building, sr_building_2, canteen, canteen_two, kitchen_hall, gymnasium, chapel, ccss, kindergarten`

Every one of these is a key in `NODES`. (R06 is intentionally skipped in the route sequences and is correctly absent from use.) Therefore there is **no MISSING NODES section** and the coder does not need to call `send_message` for missing coordinates. If, during transcription, the coder finds a node ID that is NOT in `NODES`, it must NOT invent coordinates — it must call `send_message` with severity `warning` and stop.

---

## STEP 2 — Complete coordinate table (transcribe verbatim into `hardcodedRoutes.js`)

Each route below is keyed by its `destinationId`. The value is an **ordered array of `{lat, lng}` objects**, first element = `gate`, last element = the destination. The inline `// id` comment on each line is for verification only — the exported object contains only `{lat, lng}`.

Coordinates are copied verbatim from `src/constants/campusGraph.js` `NODES`. Note: `ccss` is intentionally co-located with `R30` (both `13.961008, 121.612466`), and `new_building`/`ibed` share `lng 121.6121` — transcribe exactly as shown.

### 1. main_building
```
main_building: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961224, lng: 121.612080 }, // R37
  { lat: 13.961301, lng: 121.612075 }, // R38
  { lat: 13.9616,   lng: 121.6121   }, // J4
  { lat: 13.9616,   lng: 121.6126   }, // J5
  { lat: 13.961588, lng: 121.612393 }, // R70
  { lat: 13.961650, lng: 121.612393 }, // main_building
],
```
Arrow sequence: gate -> R01 -> R02 -> R03 -> R04 -> R05 -> R07 -> R08 -> R09 -> R10 -> R11 -> R12 -> R13 -> R14 -> R15 -> R37 -> R38 -> J4 -> J5 -> R70 -> main_building (21 nodes)

### 2. ea_tower
```
ea_tower: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961224, lng: 121.612080 }, // R37
  { lat: 13.961301, lng: 121.612075 }, // R38
  { lat: 13.9616,   lng: 121.6121   }, // J4
  { lat: 13.9616,   lng: 121.6126   }, // J5
  { lat: 13.961588, lng: 121.612393 }, // R70
  { lat: 13.961592, lng: 121.612469 }, // R71
  { lat: 13.961607, lng: 121.612537 }, // R72
  { lat: 13.961635, lng: 121.612631 }, // R73
  { lat: 13.961686, lng: 121.612672 }, // R74
  { lat: 13.961732, lng: 121.612685 }, // R75
  { lat: 13.961780, lng: 121.612697 }, // R76
  { lat: 13.961744, lng: 121.612746 }, // ea_tower
],
```
Arrow sequence: gate -> ... -> R37 -> R38 -> J4 -> J5 -> R70 -> R71 -> R72 -> R73 -> R74 -> R75 -> R76 -> ea_tower (27 nodes)

### 3. canteen
```
canteen: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961224, lng: 121.612080 }, // R37
  { lat: 13.961301, lng: 121.612075 }, // R38
  { lat: 13.961350, lng: 121.612069 }, // R47
  { lat: 13.961439, lng: 121.612069 }, // R48
  { lat: 13.961496, lng: 121.612067 }, // R49
  { lat: 13.961555, lng: 121.612068 }, // R50
  { lat: 13.961596, lng: 121.612076 }, // R51
  { lat: 13.961598, lng: 121.612011 }, // R60
  { lat: 13.961591, lng: 121.611942 }, // R61
  { lat: 13.961573, lng: 121.611896 }, // R62
  { lat: 13.961559, lng: 121.611866 }, // R63
  { lat: 13.9614,   lng: 121.6119   }, // canteen
],
```
Arrow sequence: gate -> ... -> R37 -> R38 -> R47 -> R48 -> R49 -> R50 -> R51 -> R60 -> R61 -> R62 -> R63 -> canteen (27 nodes)

### 4. ibed
```
ibed: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961224, lng: 121.612080 }, // R37
  { lat: 13.961301, lng: 121.612075 }, // R38
  { lat: 13.961350, lng: 121.612069 }, // R47
  { lat: 13.961439, lng: 121.612069 }, // R48
  { lat: 13.9614,   lng: 121.6121   }, // ibed
],
```
Arrow sequence: gate -> ... -> R37 -> R38 -> R47 -> R48 -> ibed (20 nodes)

### 5. sr_building
```
sr_building: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961224, lng: 121.612080 }, // R37
  { lat: 13.961301, lng: 121.612075 }, // R38
  { lat: 13.9616,   lng: 121.6121   }, // J4
  { lat: 13.9616,   lng: 121.6126   }, // J5
  { lat: 13.961530, lng: 121.612643 }, // sr_building
],
```
Arrow sequence: gate -> ... -> R37 -> R38 -> J4 -> J5 -> sr_building (20 nodes)

### 6. chapel
```
chapel: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961224, lng: 121.612080 }, // R37
  { lat: 13.961301, lng: 121.612075 }, // R38
  { lat: 13.9616,   lng: 121.6121   }, // J4
  { lat: 13.961650, lng: 121.612098 }, // chapel
],
```
Arrow sequence: gate -> ... -> R37 -> R38 -> J4 -> chapel (19 nodes)

### 7. kindergarten
```
kindergarten: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961224, lng: 121.612080 }, // R37
  { lat: 13.961301, lng: 121.612075 }, // R38
  { lat: 13.9616,   lng: 121.6121   }, // J4
  { lat: 13.961689, lng: 121.612115 }, // kindergarten
],
```
Arrow sequence: gate -> ... -> R37 -> R38 -> J4 -> kindergarten (19 nodes)

### 8. gymnasium
```
gymnasium: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961224, lng: 121.612080 }, // R37
  { lat: 13.961301, lng: 121.612075 }, // R38
  { lat: 13.9616,   lng: 121.6121   }, // J4
  { lat: 13.9616,   lng: 121.6126   }, // J5
  { lat: 13.961588, lng: 121.612393 }, // R70
  { lat: 13.961592, lng: 121.612469 }, // R71
  { lat: 13.961607, lng: 121.612537 }, // R72
  { lat: 13.961635, lng: 121.612631 }, // R73
  { lat: 13.961686, lng: 121.612672 }, // R74
  { lat: 13.961732, lng: 121.612685 }, // R75
  { lat: 13.961780, lng: 121.612697 }, // R76
  { lat: 13.961870, lng: 121.612718 }, // R77
  { lat: 13.961927, lng: 121.612731 }, // R78
  { lat: 13.962003, lng: 121.612751 }, // R79
  { lat: 13.962088, lng: 121.612775 }, // R80
  { lat: 13.962168, lng: 121.612798 }, // R81
  { lat: 13.962226, lng: 121.612804 }, // R82
  { lat: 13.962317, lng: 121.612814 }, // R83
  { lat: 13.962384, lng: 121.612815 }, // R84
  { lat: 13.9624,   lng: 121.6128   }, // gymnasium
],
```
Arrow sequence: gate -> ... -> J5 -> R70..R84 -> gymnasium (35 nodes)

### 9. kitchen_hall
```
kitchen_hall: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961224, lng: 121.612080 }, // R37
  { lat: 13.961301, lng: 121.612075 }, // R38
  { lat: 13.9616,   lng: 121.6121   }, // J4
  { lat: 13.9616,   lng: 121.6126   }, // J5
  { lat: 13.961588, lng: 121.612393 }, // R70
  { lat: 13.961592, lng: 121.612469 }, // R71
  { lat: 13.961607, lng: 121.612537 }, // R72
  { lat: 13.961635, lng: 121.612631 }, // R73
  { lat: 13.961686, lng: 121.612672 }, // R74
  { lat: 13.961732, lng: 121.612685 }, // R75
  { lat: 13.961780, lng: 121.612697 }, // R76
  { lat: 13.961870, lng: 121.612718 }, // R77
  { lat: 13.961927, lng: 121.612731 }, // R78
  { lat: 13.962003, lng: 121.612751 }, // R79
  { lat: 13.962088, lng: 121.612775 }, // R80
  { lat: 13.962168, lng: 121.612798 }, // R81
  { lat: 13.962226, lng: 121.612804 }, // R82
  { lat: 13.9624,   lng: 121.6129   }, // kitchen_hall
],
```
Arrow sequence: gate -> ... -> J5 -> R70..R82 -> kitchen_hall (33 nodes)

### 10. canteen_two
```
canteen_two: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961224, lng: 121.612080 }, // R37
  { lat: 13.961301, lng: 121.612075 }, // R38
  { lat: 13.9616,   lng: 121.6121   }, // J4
  { lat: 13.9616,   lng: 121.6126   }, // J5
  { lat: 13.961588, lng: 121.612393 }, // R70
  { lat: 13.961592, lng: 121.612469 }, // R71
  { lat: 13.961607, lng: 121.612537 }, // R72
  { lat: 13.961635, lng: 121.612631 }, // R73
  { lat: 13.961686, lng: 121.612672 }, // R74
  { lat: 13.9617,   lng: 121.6128   }, // canteen_two
],
```
Arrow sequence: gate -> ... -> J5 -> R70..R74 -> canteen_two (25 nodes)

### 11. engineering
```
engineering: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961224, lng: 121.612080 }, // R37
  { lat: 13.961301, lng: 121.612075 }, // R38
  { lat: 13.9616,   lng: 121.6121   }, // J4
  { lat: 13.9616,   lng: 121.6126   }, // J5
  { lat: 13.961588, lng: 121.612393 }, // R70
  { lat: 13.961592, lng: 121.612469 }, // R71
  { lat: 13.961607, lng: 121.612537 }, // R72
  { lat: 13.961635, lng: 121.612631 }, // R73
  { lat: 13.961686, lng: 121.612672 }, // R74
  { lat: 13.961732, lng: 121.612685 }, // R75
  { lat: 13.961780, lng: 121.612697 }, // R76
  { lat: 13.961870, lng: 121.612718 }, // R77
  { lat: 13.961637, lng: 121.612220 }, // engineering
],
```
Arrow sequence: gate -> ... -> J5 -> R70..R77 -> engineering (28 nodes)

### 12. new_building
```
new_building: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.9613,   lng: 121.6121   }, // new_building
],
```
Arrow sequence: gate -> R01..R15 -> new_building (16 nodes)

### 13. ccss
```
ccss: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
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
  { lat: 13.961008, lng: 121.612466 }, // R30
  { lat: 13.961008, lng: 121.612466 }, // ccss (co-located with R30)
],
```
Arrow sequence: gate -> R01..R22 -> R27 -> R28 -> R29 -> R30 -> ccss (27 nodes)

### 14. parking_lot
```
parking_lot: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961181, lng: 121.612153 }, // R16
  { lat: 13.961179, lng: 121.612207 }, // R17
  { lat: 13.961176, lng: 121.612256 }, // R18
  { lat: 13.961174, lng: 121.612319 }, // R19
  { lat: 13.9611,   lng: 121.6123   }, // parking_lot
],
```
Arrow sequence: gate -> R01..R19 -> parking_lot (20 nodes)

### 15. motorcycle_parking
```
motorcycle_parking: [
  { lat: 13.9609, lng: 121.6114 }, // gate
  { lat: 13.9612, lng: 121.6115 }, // motorcycle_parking
],
```
Arrow sequence: gate -> motorcycle_parking (2 nodes)

### 16. ea_tower_2
```
ea_tower_2: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961224, lng: 121.612080 }, // R37
  { lat: 13.961301, lng: 121.612075 }, // R38
  { lat: 13.9616,   lng: 121.6121   }, // J4
  { lat: 13.9616,   lng: 121.6126   }, // J5
  { lat: 13.961588, lng: 121.612393 }, // R70
  { lat: 13.961592, lng: 121.612469 }, // R71
  { lat: 13.961607, lng: 121.612537 }, // R72
  { lat: 13.961635, lng: 121.612631 }, // R73
  { lat: 13.961686, lng: 121.612672 }, // R74
  { lat: 13.961732, lng: 121.612685 }, // R75
  { lat: 13.961780, lng: 121.612697 }, // R76
  { lat: 13.961870, lng: 121.612718 }, // R77
  { lat: 13.961927, lng: 121.612731 }, // R78
  { lat: 13.962003, lng: 121.612751 }, // R79
  { lat: 13.962093, lng: 121.612822 }, // ea_tower_2
],
```
Arrow sequence: gate -> ... -> J5 -> R70..R79 -> ea_tower_2 (30 nodes)

### 17. ibed_2
```
ibed_2: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961224, lng: 121.612080 }, // R37
  { lat: 13.961301, lng: 121.612075 }, // R38
  { lat: 13.961350, lng: 121.612069 }, // R47
  { lat: 13.961439, lng: 121.612069 }, // R48
  { lat: 13.961496, lng: 121.612067 }, // R49
  { lat: 13.961555, lng: 121.612068 }, // R50
  { lat: 13.961596, lng: 121.612076 }, // R51
  { lat: 13.961546, lng: 121.612393 }, // ibed_2
],
```
Arrow sequence: gate -> ... -> R37 -> R38 -> R47 -> R48 -> R49 -> R50 -> R51 -> ibed_2 (23 nodes)

### 18. sr_building_2
```
sr_building_2: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961181, lng: 121.612153 }, // R16
  { lat: 13.961179, lng: 121.612207 }, // R17
  { lat: 13.961176, lng: 121.612256 }, // R18
  { lat: 13.961174, lng: 121.612319 }, // R19
  { lat: 13.961172, lng: 121.612381 }, // R20
  { lat: 13.961170, lng: 121.612451 }, // R21
  { lat: 13.961189, lng: 121.612502 }, // R22
  { lat: 13.961188, lng: 121.612581 }, // sr_building_2
],
```
Arrow sequence: gate -> R01..R22 -> sr_building_2 (23 nodes)

### 19. main_building_2
```
main_building_2: [
  { lat: 13.9609,   lng: 121.6114   }, // gate
  { lat: 13.960943, lng: 121.611350 }, // R01
  { lat: 13.961004, lng: 121.611368 }, // R02
  { lat: 13.961056, lng: 121.611389 }, // R03
  { lat: 13.961089, lng: 121.611411 }, // R04
  { lat: 13.961127, lng: 121.611440 }, // R05
  { lat: 13.961194, lng: 121.611535 }, // R07
  { lat: 13.961191, lng: 121.611605 }, // R08
  { lat: 13.961191, lng: 121.611668 }, // R09
  { lat: 13.961189, lng: 121.611735 }, // R10
  { lat: 13.961189, lng: 121.611803 }, // R11
  { lat: 13.961187, lng: 121.611890 }, // R12
  { lat: 13.961185, lng: 121.611947 }, // R13
  { lat: 13.961187, lng: 121.612017 }, // R14
  { lat: 13.961185, lng: 121.612079 }, // R15
  { lat: 13.961224, lng: 121.612080 }, // R37
  { lat: 13.961301, lng: 121.612075 }, // R38
  { lat: 13.9616,   lng: 121.6121   }, // J4
  { lat: 13.9616,   lng: 121.6126   }, // J5
  { lat: 13.961588, lng: 121.612393 }, // R70
  { lat: 13.961592, lng: 121.612469 }, // R71
  { lat: 13.961607, lng: 121.612537 }, // R72
  { lat: 13.961635, lng: 121.612631 }, // R73
  { lat: 13.961686, lng: 121.612672 }, // R74
  { lat: 13.961732, lng: 121.612685 }, // R75
  { lat: 13.961780, lng: 121.612697 }, // R76
  { lat: 13.961870, lng: 121.612718 }, // R77
  { lat: 13.961927, lng: 121.612731 }, // R78
  { lat: 13.962003, lng: 121.612751 }, // R79
  { lat: 13.962088, lng: 121.612775 }, // R80
  { lat: 13.962135, lng: 121.612759 }, // main_building_2
],
```
Arrow sequence: gate -> ... -> J5 -> R70..R80 -> main_building_2 (31 nodes)

---

## STEP 3 — Implementation steps for the coder

Project facts the coder must respect (verified by the planner):
- Build system: Expo SDK 54 (`expo ~54.0.37`). `package.json` has **no test runner** and **no `build`/`test` script** — verification is the Expo bundle/export command below.
- `src/constants/*` uses ES module exports (`export const X`, `export function Y`) — see `campusGraph.js`, `buildings.js`, `api.js`. Match that style exactly.
- `src/services/api.js` is at `src/services/`, so the import path to constants is `../constants/hardcodedRoutes`.
- Current `fetchRoute(userLat, userLng, destinationId)` is `async`, POSTs to `${API_BASE}/navigation/route`, returns `data.waypoints ?? []` (or `[]` on error). `ARScreen.js` calls it as `await fetchRoute(loc.lat, loc.lng, destinationId)`; a plain (non-Promise) array return is fine because `await` resolves a non-thenable to itself.
- `ViroARNavScene.js` imports only `ViroBox` for primitives (no `ViroCylinder`/`ViroCone` in this Viro version) — keep the ViroBox-only constraint.
- `angleDiff` arrives via `viroAppProps` from `ARScreen` (`angleDiff={nextAngle}`); it is a compass bearing relative to device heading (yaw), so the pin must rotate about Y to face the next waypoint.

- [ ] 1. Create `src/constants/hardcodedRoutes.js` exporting `HARDCODED_ROUTES` and `getHardcodedRoute(destinationId)`.
      - `HARDCODED_ROUTES` is an object: key = destinationId (string), value = ordered array of `{lat, lng}` waypoint objects. Transcribe all 19 routes from the STEP 2 table verbatim. First element of every array is the `gate` waypoint, last element is the destination waypoint.
      - Add `export function getHardcodedRoute(destinationId) { return HARDCODED_ROUTES[destinationId] ?? null; }`.
      - Use ES module export syntax consistent with the rest of `src/constants` (e.g. `export const HARDCODED_ROUTES = { ... };` and `export function getHardcodedRoute(...)`). Include a header comment block matching the style of `campusGraph.js`.
      - Files: `c:/Users/Asus/WAYFINDER-FULLPACKAGE/wayfinder/src/constants/hardcodedRoutes.js`
      - Verify: `npx expo export --platform android 2>&1 | Select-Object -Last 6` (run from `c:/Users/Asus/WAYFINDER-FULLPACKAGE/wayfinder`) exits 0 (the module compiles and exports resolve). If any transcribed node ID is not in `campusGraph.js` NODES, do NOT invent coordinates — call `send_message` with severity `warning` and stop.

- [ ] 2. Update `fetchRoute` in `src/services/api.js` to return the hardcoded route first, keeping the backend POST as a fallback.
      - Add at the very top of the file: `import { getHardcodedRoute } from '../constants/hardcodedRoutes';`
      - As the first statements inside `fetchRoute` (before the existing `try { const res = await fetchWithTimeout(...) }`), add: `const hardcoded = getHardcodedRoute(destinationId); if (hardcoded) return hardcoded;`
      - Leave the existing backend POST and its catch/return-`[]` fallback untouched, so any destination NOT in `HARDCODED_ROUTES` still hits the backend, and `ARScreen`'s existing A* / straight-line fallbacks remain for unknown destinations.
      - Files: `c:/Users/Asus/WAYFINDER-FULLPACKAGE/wayfinder/src/services/api.js`
      - Verify: `npx expo export --platform android 2>&1 | Select-Object -Last 6` (run from `c:/Users/Asus/WAYFINDER-FULLPACKAGE/wayfinder`) exits 0.

- [ ] 3. Replace the flat AR arrow with an upright navigation-pin shape in `src/components/ViroARNavScene.js`.
      - Remove the `-15` X-tilt and the `arrowBob` up/down bob animation; replace with an upright pin (vertical shaft + arrowhead at the top pointing forward) plus a gentle scale-pulse animation.
      - Change the arrow `ViroNode` to: `position={[0, 0.8, -2.5]}` and `rotation={[0, angleDiff ?? 0, 0]}` (remove the `-15` X component). The Y rotation (`angleDiff`) orients the whole pin toward the next waypoint / direction of travel.
      - Shaft: a thin tall vertical `ViroBox` (suggested `width={0.08} height={0.6} length={0.08}`) centered at the node origin (`position={[0, 0, 0]}`), `materials={["arrowGreen"]}` — the vertical flagpole stem.
      - Head: a wide flat arrowhead `ViroBox` at the top (suggested `width={0.28} height={0.08 length={0.28}`), positioned at the top of the shaft (suggested `position={[0, 0.36, 0]}`), `materials={["arrowGreen"]}`, with `rotation={[0, 0, 45]}` so it reads as a diamond/arrowhead from any angle. The parent `ViroNode`'s Y rotation (`angleDiff`) already makes it face the travel direction.
      - Animation: delete the `arrowBob` registration and register a gentle scale pulse, e.g. `arrowPulse: { properties: { scaleX: "1.0 => 1.08 => 1.0", scaleY: "1.0 => 1.08 => 1.0", scaleZ: "1.0 => 1.08 => 1.0" }, easing: "EaseInOut", duration: 1200, loop: true }`, and apply it to the arrow `ViroNode` via `animation={{ name: "arrowPulse", run: true, loop: true }}`.
      - Keep the ViroBox-only primitive constraint (no `ViroCylinder`/`ViroCone`). Keep the existing materials, the ground-ring block (align its `position` Z to `-2.5` so it sits beneath the new pin), the `isTracking` gate, and the "Initializing AR..." `ViroText` unchanged.
      - Files: `c:/Users/Asus/WAYFINDER-FULLPACKAGE/wayfinder/src/components/ViroARNavScene.js`
      - Verify: `npx expo export --platform android 2>&1 | Select-Object -Last 6` (run from `c:/Users/Asus/WAYFINDER-FULLPACKAGE/wayfinder`) exits 0 (JS compiles; note: AR visual correctness can only be confirmed on-device).

- [ ] 4. Verify the full build and commit only the three files.
      - From `c:/Users/Asus/WAYFINDER-FULLPACKAGE/wayfinder` run: `npx expo export --platform android 2>&1 | Select-Object -Last 6` and confirm it exits 0 with no bundle errors.
      - Then commit ONLY the three files:
        `git -C c:/Users/Asus/WAYFINDER-FULLPACKAGE/wayfinder add src/constants/hardcodedRoutes.js src/services/api.js src/components/ViroARNavScene.js`
        `git -C c:/Users/Asus/WAYFINDER-FULLPACKAGE/wayfinder commit -m "feat: hardcode all campus routes (bypass A* fallback), fix AR arrow to upright pin shape"`
      - Do NOT push. Do NOT stage any other files (do not use `git add .`/`-A`).
      - Files: `src/constants/hardcodedRoutes.js`, `src/services/api.js`, `src/components/ViroARNavScene.js`
      - Verify: `git -C c:/Users/Asus/WAYFINDER-FULLPACKAGE/wayfinder status --short` shows the three files committed and a clean working tree (modulo any pre-existing unrelated changes, which must NOT be staged).

---

## Notes / assumptions
- These routes are keyed by `destinationId` exactly as `ARScreen.js` receives `route.params.destinationId`. The 19 destination IDs match `BUILDINGS`/`NODES` keys, so every navigable building resolves to a hardcoded route; unknown destinations fall through to the existing backend + A* fallback.
- The hardcoded arrays contain only `{lat, lng}` (the inline `// id` comments in STEP 2 are reference aids; the coder may keep or drop them). `ARScreen.buildOrbTrail` interpolates these into the orb trail exactly as it does for backend waypoints, so no other changes are needed for routing to work end-to-end.
- AR arrow correctness is partially unverifiable off-device: `expo export` confirms the JS/JSX compiles and imports resolve, but the upright-pin visual and its facing direction can only be confirmed on-device.
