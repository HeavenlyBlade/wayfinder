# Implementation Plan

## Project context
- **Location**: `c:\Users\Asus\WAYFINDER-FULLPACKAGE\wayfinder`
- **Framework**: Expo SDK 54 / React Native 0.81.5
- **Build command**: `npx expo export:embed --platform android --dev false` (or `npx expo start` for dev)
- **Style pattern**: all styles in `StyleSheet.create` at the bottom of the file, named `s` or `ts`; constants (`GREEN`, `W`, `H`) at module level; comment blocks use `// ── Label ──` style
- **No test runner** is configured — verification is done by confirming the Metro bundler completes without errors

---

## FIX 1 — Tutorial storage keys + 100 ms delay

### What to read first
- `src/components/ARTutorial.js` — `STORAGE` constant on line 17, `useEffect` on line 44
- `src/screens/HomeScreen.js` — `useEffect` on line ~139, `handleTutorialFinish` on line ~144
- `src/screens/SettingsScreen.js` — two `AsyncStorage.removeItem` calls inside the "Replay AR Tutorial" and the home tutorial `onPress` handlers

---

- [ ] 1. **Update storage key and add 100 ms delay in `ARTutorial.js`**

  Two changes in `src/components/ARTutorial.js`:

  1. Change the `STORAGE` constant from `"wayfinder_ar_tutorial_v3"` to `"wayfinder_ar_tutorial_v4"`.
  2. Wrap the `AsyncStorage.getItem` call inside the `useEffect` with a 100 ms `setTimeout` so the Modal has time to mount before the check fires.

  **Before** (lines ~44–47):
  ```js
  useEffect(() => {
    AsyncStorage.getItem(STORAGE).then(val => {
      if (val === "true") setVisible(false); // already seen — hide it
    });
  }, []);
  ```

  **After**:
  ```js
  useEffect(() => {
    const timer = setTimeout(() => {
      AsyncStorage.getItem(STORAGE).then(val => {
        if (val === "true") setVisible(false); // already seen — hide it
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  ```

  **File**: `src/components/ARTutorial.js`

  **Verify**: Start Metro (`npx expo start`). Open the AR screen. The tutorial Modal appears. Dismiss it, close and reopen AR — it no longer appears. No bundler syntax errors.

---

- [ ] 2. **Update storage key, add 100 ms delay, and fix `handleTutorialFinish` in `HomeScreen.js`**

  Three changes in `src/screens/HomeScreen.js`:

  1. In `useEffect`, wrap `AsyncStorage.getItem("wayfinder_tutorial_done")` in a 100 ms `setTimeout` and change the key to `"wayfinder_home_tutorial_v2"`.
  2. In `handleTutorialFinish`, change `AsyncStorage.setItem("wayfinder_tutorial_done", "true")` to use the new key `"wayfinder_home_tutorial_v2"`.

  **Before** (useEffect, lines ~139–142):
  ```js
  useEffect(() => {
    AsyncStorage.getItem("wayfinder_tutorial_done").then((val) => {
      if (val === "true") setShowTutorial(false);
    });
  }, []);
  ```

  **After**:
  ```js
  useEffect(() => {
    const timer = setTimeout(() => {
      AsyncStorage.getItem("wayfinder_home_tutorial_v2").then((val) => {
        if (val === "true") setShowTutorial(false);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  ```

  **Before** (handleTutorialFinish, lines ~144–147):
  ```js
  async function handleTutorialFinish() {
    await AsyncStorage.setItem("wayfinder_tutorial_done", "true");
    setShowTutorial(false);
  }
  ```

  **After**:
  ```js
  async function handleTutorialFinish() {
    await AsyncStorage.setItem("wayfinder_home_tutorial_v2", "true");
    setShowTutorial(false);
  }
  ```

  **File**: `src/screens/HomeScreen.js`

  **Verify**: Open Home screen. Tutorial modal appears. Complete or skip it. Close and reopen Home — tutorial does not appear again. No bundler errors.

---

- [ ] 3. **Update the two `AsyncStorage.removeItem` calls in `SettingsScreen.js`**

  Two changes in `src/screens/SettingsScreen.js`:

  1. In the "Replay AR Tutorial" `onPress` handler, change:
     ```js
     await AsyncStorage.removeItem("wayfinder_ar_tutorial_v3");
     ```
     to:
     ```js
     await AsyncStorage.removeItem("wayfinder_ar_tutorial_v4");
     ```
     The `Alert.alert` message strings ("AR tutorial will appear on your next navigation.") do not need to change.

  2. In the home tutorial reset `onPress` handler (the `t("settings.tutorial.reset", lang)` button), change:
     ```js
     await AsyncStorage.removeItem("wayfinder_tutorial_done");
     ```
     to:
     ```js
     await AsyncStorage.removeItem("wayfinder_home_tutorial_v2");
     ```

  **File**: `src/screens/SettingsScreen.js`

  **Verify**: Open Settings → "Replay AR Tutorial" → Reset. Open AR — tutorial appears again. Repeat for home tutorial reset. No bundler errors.

---

## FIX 2 — Replace CampusMap (SVG) with MapLibre Native

### What to read first
- `src/components/CampusMap.js` — full file; the `BUILDING_OVERLAYS` array (preserved verbatim) and the props interface (`style`, `selectedId`, `userLocation`, `routeWaypoints`, `onPressBuilding`, `mini`)
- `src/screens/MapScreen.js` — how CampusMap is called (lines ~165–174); confirm the props match
- `app.json` — the `plugins` array where the config plugin must be added
- `package.json` — to confirm the new package is added

---

- [ ] 4. **Install `@maplibre/maplibre-react-native`**

  Run inside `c:\Users\Asus\WAYFINDER-FULLPACKAGE\wayfinder`:

  ```
  npm install @maplibre/maplibre-react-native
  ```

  Do NOT run `expo prebuild` now. Prebuild must be run before the next EAS / native build. Document this in a comment at the top of the new `CampusMap.js` (see item 6).

  **File**: `package.json` (updated by npm automatically)

  **Verify**: `package.json` now contains `"@maplibre/maplibre-react-native"` in `dependencies`.

---

- [ ] 5. **Add the MapLibre config plugin to `app.json`**

  Add `"@maplibre/maplibre-react-native"` to the `expo.plugins` array in `app.json`. Insert it after the last existing plugin entry (after the `@reactvision/react-viro` block).

  **Before** (end of plugins array):
  ```json
  [
    "@reactvision/react-viro",
    {
      "android": {
        "xRMode": "AR"
      }
    }
  ]
  ```

  **After** (append `"@maplibre/maplibre-react-native"` as a new entry after the block above):
  ```json
  [
    "@reactvision/react-viro",
    {
      "android": {
        "xRMode": "AR"
      }
    }
  ],
  "@maplibre/maplibre-react-native"
  ```

  **File**: `app.json`

  **Verify**: `app.json` parses as valid JSON (`node -e "require('./app.json')"` from the project root returns no error) and `expo.plugins` contains the new entry.

---

- [ ] 6. **Rewrite `CampusMap.js` using MapLibre Native**

  Replace the entire contents of `src/components/CampusMap.js` with the implementation below. The `BUILDING_OVERLAYS` array is copied verbatim from the old file (coordinates unchanged) and converted to a GeoJSON FeatureCollection at module level.

  **Key implementation details** (match existing code style — constants at top, `StyleSheet.create` at bottom named `styles`):

  ```js
  // ─────────────────────────────────────────────────────────────────────────────
  // WAYFINDER — CampusMap (MapLibre Native, no API key required)
  //
  // Replaces the SVG-based map with a real interactive vector tile map.
  // Uses OpenStreetMap tiles via MapLibre demotiles style — no API key needed.
  //
  // ⚠  IMPORTANT: Run `npx expo prebuild` before the next native build so the
  //    @maplibre/maplibre-react-native config plugin can link its native modules.
  //
  // Props (same interface as the old SVG version):
  //   style            {StyleProp<ViewStyle>}
  //   selectedId       {string|null}   — highlighted building id
  //   userLocation     {{lat,lng}|null}
  //   routeWaypoints   {Array<{lat,lng}>|null}
  //   onPressBuilding  {(id:string) => void}
  //   mini             {boolean}  when true: no gestures, no onPress
  // ─────────────────────────────────────────────────────────────────────────────

  import React, { useMemo } from 'react';
  import { View, StyleSheet } from 'react-native';
  import MapLibreGL from '@maplibre/maplibre-react-native';

  // No API key needed for OSM / demotiles
  MapLibreGL.setAccessToken(null);

  const STYLE_URL    = 'https://demotiles.maplibre.org/style.json';
  const CAMPUS_LAT   = 13.961706;
  const CAMPUS_LNG   = 121.612236;
  const CAMPUS_ZOOM  = 17;
  const GREEN        = '#00C853';

  // ── Building polygon data (preserved from SVG version) ────────────────────
  const BUILDING_OVERLAYS = [
    { id: 'gate', name: 'Gate',
      coords: [{ lat: 13.960973, lng: 121.611242 },{ lat: 13.960945, lng: 121.611378 },{ lat: 13.960904, lng: 121.611376 },{ lat: 13.960923, lng: 121.611214 }] },
    { id: 'motorcycle_parking', name: 'Moto P.',
      coords: [{ lat: 13.961333, lng: 121.611508 },{ lat: 13.961294, lng: 121.611572 },{ lat: 13.961197, lng: 121.611539 },{ lat: 13.961181, lng: 121.611431 }] },
    { id: 'parking_lot', name: 'Parking',
      coords: [{ lat: 13.961133, lng: 121.611678 },{ lat: 13.961108, lng: 121.612531 },{ lat: 13.961036, lng: 121.612508 },{ lat: 13.961031, lng: 121.612394 },{ lat: 13.960892, lng: 121.612375 },{ lat: 13.960914, lng: 121.611722 }] },
    { id: 'main_building', name: 'Main Bldg',
      coords: [{ lat: 13.962275, lng: 121.612361 },{ lat: 13.962236, lng: 121.612714 },{ lat: 13.962069, lng: 121.612697 },{ lat: 13.962075, lng: 121.612522 },{ lat: 13.961722, lng: 121.612481 },{ lat: 13.961739, lng: 121.6123 }] },
    { id: 'new_building', name: 'New Bldg',
      coords: [{ lat: 13.961325, lng: 121.611739 },{ lat: 13.961303, lng: 121.612431 },{ lat: 13.961197, lng: 121.612422 },{ lat: 13.961222, lng: 121.611717 }] },
    { id: 'ea_tower', name: 'EA Tower',
      coords: [{ lat: 13.962092, lng: 121.612728 },{ lat: 13.962053, lng: 121.612906 },{ lat: 13.961753, lng: 121.612811 },{ lat: 13.961792, lng: 121.612653 }] },
    { id: 'ibed', name: 'IBED',
      coords: [{ lat: 13.961578, lng: 121.611967 },{ lat: 13.961572, lng: 121.612086 },{ lat: 13.961478, lng: 121.612083 },{ lat: 13.961472, lng: 121.612356 },{ lat: 13.961556, lng: 121.612369 },{ lat: 13.96155, lng: 121.612453 },{ lat: 13.961317, lng: 121.612447 },{ lat: 13.961331, lng: 121.611961 }] },
    { id: 'canteen', name: 'Canteen',
      coords: [{ lat: 13.961622, lng: 121.611911 },{ lat: 13.961528, lng: 121.611944 },{ lat: 13.961331, lng: 121.611958 },{ lat: 13.961339, lng: 121.611581 }] },
    { id: 'kindergarten', name: 'Kinder',
      coords: [{ lat: 13.962078, lng: 121.612144 },{ lat: 13.96205, lng: 121.612256 },{ lat: 13.961672, lng: 121.612122 },{ lat: 13.961703, lng: 121.612008 }] },
    { id: 'chapel', name: 'Chapel',
      coords: [{ lat: 13.961694, lng: 121.612006 },{ lat: 13.961672, lng: 121.612097 },{ lat: 13.961633, lng: 121.612083 },{ lat: 13.961633, lng: 121.611989 }] },
    { id: 'kitchen_hall', name: 'Kitchen',
      coords: [{ lat: 13.962481, lng: 121.612853 },{ lat: 13.962472, lng: 121.612969 },{ lat: 13.962144, lng: 121.612936 },{ lat: 13.962156, lng: 121.612822 }] },
    { id: 'canteen_two', name: 'Canteen 2',
      coords: [{ lat: 13.961736, lng: 121.612842 },{ lat: 13.961708, lng: 121.612911 },{ lat: 13.961558, lng: 121.612836 },{ lat: 13.961578, lng: 121.61275 }] },
    { id: 'sr_building', name: 'SR Bldg',
      coords: [{ lat: 13.961581, lng: 121.612667 },{ lat: 13.961561, lng: 121.612783 },{ lat: 13.961169, lng: 121.612678 },{ lat: 13.961192, lng: 121.612569 }] },
    { id: 'ccss', name: 'CCSS',
      coords: [{ lat: 13.961031, lng: 121.612428 },{ lat: 13.961028, lng: 121.612486 },{ lat: 13.960922, lng: 121.612481 },{ lat: 13.960928, lng: 121.612406 }] },
    { id: 'gymnasium', name: 'Gymnasium',
      coords: [{ lat: 13.962278, lng: 121.612417 },{ lat: 13.962472, lng: 121.612417 },{ lat: 13.962472, lng: 121.612806 },{ lat: 13.962278, lng: 121.612778 }] },
    { id: 'engineering', name: 'New IBED',
      coords: [{ lat: 13.962050, lng: 121.612260 },{ lat: 13.962048, lng: 121.612330 },{ lat: 13.961659, lng: 121.612290 },{ lat: 13.961672, lng: 121.612145 }] },
  ];

  // ── Convert BUILDING_OVERLAYS to GeoJSON FeatureCollection ────────────────
  // Each polygon's coords are closed (first point repeated at end) as GeoJSON requires.
  function buildingsToGeoJSON(overlays) {
    return {
      type: 'FeatureCollection',
      features: overlays.map(b => ({
        type: 'Feature',
        id: b.id,
        properties: { id: b.id, name: b.name },
        geometry: {
          type: 'Polygon',
          // GeoJSON coords are [lng, lat]; ring must be closed
          coordinates: [[
            ...b.coords.map(c => [c.lng, c.lat]),
            [b.coords[0].lng, b.coords[0].lat], // close ring
          ]],
        },
      })),
    };
  }

  const BUILDINGS_GEOJSON = buildingsToGeoJSON(BUILDING_OVERLAYS);

  // ── Layer paint styles ────────────────────────────────────────────────────
  // FillLayer: selected building gets a brighter fill
  function buildFillPaint(selectedId) {
    return {
      'fill-color': [
        'case',
        ['==', ['get', 'id'], selectedId ?? ''],
        'rgba(0,200,83,0.55)',
        'rgba(0,200,83,0.22)',
      ],
      'fill-opacity': 1,
    };
  }

  function buildLinePaint(selectedId) {
    return {
      'line-color': GREEN,
      'line-width': [
        'case',
        ['==', ['get', 'id'], selectedId ?? ''],
        2.5,
        1.5,
      ],
    };
  }

  const ROUTE_PAINT = {
    'line-color': GREEN,
    'line-width': 3.5,
    'line-dasharray': [2, 1],
  };

  const USER_DOT_PAINT = {
    'circle-radius': 6,
    'circle-color': '#4285F4',
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff',
  };

  // ── Main component ────────────────────────────────────────────────────────
  export default function CampusMap({
    style,
    selectedId,
    userLocation,
    routeWaypoints,
    onPressBuilding,
    mini = false,
  }) {
    // GeoJSON for the route line
    const routeGeoJSON = useMemo(() => {
      if (!routeWaypoints || routeWaypoints.length < 2) return null;
      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: routeWaypoints.map(w => [w.lng, w.lat]),
        },
      };
    }, [routeWaypoints]);

    // GeoJSON for the user GPS dot
    const userGeoJSON = useMemo(() => {
      if (!userLocation) return null;
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [userLocation.lng, userLocation.lat],
        },
      };
    }, [userLocation]);

    const fillPaint = useMemo(() => buildFillPaint(selectedId), [selectedId]);
    const linePaint = useMemo(() => buildLinePaint(selectedId), [selectedId]);

    function handleBuildingPress(e) {
      if (mini || !onPressBuilding) return;
      const feature = e?.features?.[0];
      if (feature?.properties?.id) {
        onPressBuilding(feature.properties.id);
      }
    }

    return (
      <View style={[styles.container, style]}>
        <MapLibreGL.MapView
          style={styles.map}
          styleURL={STYLE_URL}
          // mini mode — disable all gestures and controls
          scrollEnabled={!mini}
          pitchEnabled={!mini}
          rotateEnabled={!mini}
          zoomEnabled={!mini}
          compassEnabled={false}
          attributionEnabled={false}
          logoEnabled={false}
        >
          <MapLibreGL.Camera
            centerCoordinate={[CAMPUS_LNG, CAMPUS_LAT]}
            zoomLevel={CAMPUS_ZOOM}
            animationDuration={0}
          />

          {/* Building fills */}
          <MapLibreGL.ShapeSource
            id="buildings"
            shape={BUILDINGS_GEOJSON}
            onPress={mini ? undefined : handleBuildingPress}
          >
            <MapLibreGL.FillLayer
              id="buildingsFill"
              style={fillPaint}
            />
            <MapLibreGL.LineLayer
              id="buildingsLine"
              style={linePaint}
            />
          </MapLibreGL.ShapeSource>

          {/* Route line */}
          {routeGeoJSON && (
            <MapLibreGL.ShapeSource id="route" shape={routeGeoJSON}>
              <MapLibreGL.LineLayer
                id="routeLine"
                style={ROUTE_PAINT}
              />
            </MapLibreGL.ShapeSource>
          )}

          {/* User GPS dot */}
          {userGeoJSON && (
            <MapLibreGL.ShapeSource id="userDot" shape={userGeoJSON}>
              <MapLibreGL.CircleLayer
                id="userCircle"
                style={USER_DOT_PAINT}
              />
            </MapLibreGL.ShapeSource>
          )}
        </MapLibreGL.MapView>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#0d1a0e',
      overflow: 'hidden',
    },
    map: {
      flex: 1,
    },
  });
  ```

  **File**: `src/components/CampusMap.js`

  **Verify**: Metro bundler parses the file without syntax errors. The MapScreen still renders (imports and prop calls are unchanged — same interface).

---

- [ ] 7. **Verify `MapScreen.js` — no changes needed**

  Read `src/screens/MapScreen.js` lines ~165–174 (the `<CampusMap … />` call). Confirm it passes `style`, `selectedId`, `userLocation`, `routeWaypoints`, and `onPressBuilding` — all of which match the new component's interface exactly. No edits required.

  If any prop name is mismatched (e.g. `initialZoom` was passed), remove it because the new MapLibre component does not accept `initialZoom` — the camera is fixed to `CAMPUS_ZOOM = 17`.

  **File**: `src/screens/MapScreen.js` (read-only confirmation; edit only if a prop mismatch is found)

  **Verify**: `npx expo start` — Metro bundles without errors referencing `MapScreen.js` or `CampusMap.js`.

---

## FIX 3 — Remove mini-map from ARScreen entirely

### What to read first
- `src/screens/ARScreen.js` — full file:
  - `MAP_HEIGHT` constant (line 14: `const MAP_HEIGHT = H * 0.42`)
  - `mapSection` View containing `routeBar`, `<CampusMap mini>`, and the `arrived` block
  - `distChip` style: `bottom: MAP_HEIGHT + 24`
  - `calibratorWrap` style: `bottom: MAP_HEIGHT + 20`
  - `arrivedOverlay` style: `...StyleSheet.absoluteFillObject` (already absoluteFill inside mapSection; now needs to cover full screen)
  - `arrivedBtns` style: `width: "100%"` (was bounded by `mapSection`; now needs pixel value)
  - `arrivedTitle`, `arrivedSub` — kept; `arrivedIcon` — kept; `arrivedBtn`, `arrivedBtnBack`, `arrivedBtnText` — kept

The `W` constant is already imported at module level (`const { width: W, height: H } = Dimensions.get("window")`), so `W - 64` resolves correctly.

---

- [ ] 8. **Rewrite `ARScreen.js` to remove the mini-map and add a compact bottom bar**

  Apply the following changes to `src/screens/ARScreen.js`. Make each change precisely — do not alter surrounding logic.

  **Change A — Remove `CampusMap` import**

  Remove this line:
  ```js
  import CampusMap from "../components/CampusMap";
  ```

  **Change B — Remove `MAP_HEIGHT` constant**

  Remove this line:
  ```js
  const MAP_HEIGHT = H * 0.42;
  ```

  **Change C — Replace the entire `mapSection` View with a compact bottom bar**

  Remove this entire block from the JSX (everything between and including the opening and closing `<View style={s.mapSection}>` tags, which contains `routeBar`, `<CampusMap>`, and the `{arrived && ...}` arrivedOverlay block):

  ```jsx
  {/* ── Bottom panel: route bar + campus mini-map ── */}
  <View style={s.mapSection}>

    <View style={s.routeBar}>
      ...
    </View>

    {/* SVG campus mini-map — no API key needed */}
    {!arrived && (
      <CampusMap
        style={s.miniMap}
        userLocation={location}
        routeWaypoints={waypointsRef.current}
        mini={true}
      />
    )}

    {/* Arrived overlay */}
    {arrived && (
      <View style={s.arrivedOverlay}>
        ...
      </View>
    )}
  </View>
  ```

  Replace it with:

  ```jsx
  {/* ── Compact bottom bar — destination + distance ── */}
  {!arrived && (
    <View style={s.bottomBar}>
      <Text style={s.bottomBarDest} numberOfLines={1}>{destName}</Text>
      <Text style={s.bottomBarDist}>
        {distToNext != null ? `${distToNext}m` : "—"}
      </Text>
    </View>
  )}

  {/* ── Arrived overlay — full-screen ── */}
  {arrived && (
    <View style={s.arrivedOverlay}>
      <Text style={s.arrivedIcon}>OK</Text>
      <Text style={s.arrivedTitle}>{t("ar.arrived", lang)}</Text>
      <Text style={s.arrivedSub}>{destName}</Text>
      <View style={s.arrivedBtns}>
        {!NO_INDOOR_PROMPT.has(destinationId) && (
          <TouchableOpacity
            style={s.arrivedBtn}
            onPress={() => {
              if (TWO_STAIRCASE_BUILDINGS.has(destinationId) && !selectedStaircase) {
                setStaircasePickerVisible(true);
              } else {
                setArrivalPromptVisible(true);
              }
            }}
            activeOpacity={0.85}
          >
            <Text style={s.arrivedBtnText}>{t("ar.findRoom", lang)}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[s.arrivedBtn, s.arrivedBtnBack]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={[s.arrivedBtnText, { color: "rgba(255,255,255,0.6)" }]}>
            {t("ar.backToMap", lang)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )}
  ```

  **Change D — Update `distChip` and `calibratorWrap` bottom values in `StyleSheet`**

  In the `StyleSheet.create` block at the bottom of the file:

  - `distChip`: change `bottom: MAP_HEIGHT + 24` to `bottom: 80`
  - `calibratorWrap`: change `bottom: MAP_HEIGHT + 20` to `bottom: 76`

  **Change E — Replace old `mapSection`-related styles with new `bottomBar` styles, and fix `arrivedOverlay` + `arrivedBtns`**

  In the `StyleSheet.create` block:

  1. **Remove** these style objects entirely (they belong to the deleted mapSection):
     - `mapSection`
     - `routeBar`
     - `routeBarLeft`
     - `routeBarRight`
     - `routeDestName`
     - `routeTotalDist`
     - `nextLabel`
     - `nextDist`
     - `miniMap`

  2. **Add** these new style objects (insert after `calibratorWrap` for logical grouping):
     ```js
     // Compact bottom bar
     bottomBar: {
       position: "absolute",
       bottom: 0, left: 0, right: 0,
       height: 60,
       backgroundColor: "rgba(7,18,9,0.85)",
       borderTopWidth: 1,
       borderTopColor: "rgba(0,200,83,0.2)",
       flexDirection: "row",
       alignItems: "center",
       paddingHorizontal: 16,
     },
     bottomBarDest: {
       flex: 1,
       fontSize: 13,
       fontWeight: "800",
       color: "#ffffff",
     },
     bottomBarDist: {
       fontSize: 16,
       fontWeight: "900",
       color: GREEN,
     },
     ```

  3. **Update** `arrivedOverlay` — it should now use `StyleSheet.absoluteFillObject` to cover the full screen (it was already defined that way; confirm it reads exactly):
     ```js
     arrivedOverlay: {
       ...StyleSheet.absoluteFillObject,
       backgroundColor: "rgba(7,18,9,0.92)",
       alignItems: "center",
       justifyContent: "center",
       gap: 8,
       zIndex: 10,
     },
     ```
     No change needed here — it already uses `absoluteFillObject`. Just confirm it is NOT nested inside any other positional container after the JSX rewrite.

  4. **Update** `arrivedBtns` — change `width: "100%"` to `width: W - 64`:
     ```js
     arrivedBtns: { flexDirection: "column", gap: 8, marginTop: 12, width: W - 64 },
     ```

  **File**: `src/screens/ARScreen.js`

  **Verify**: Metro bundles without syntax errors. The AR screen renders with the ViroReact fullscreen camera, HUD elements intact, the compact bottom bar visible at the bottom (hidden when arrived), and the arrived overlay covers the full screen when triggered.

---

## Summary of all files changed

| File | Changes |
|---|---|
| `src/components/ARTutorial.js` | Storage key `v3` → `v4`; 100 ms setTimeout wrapping AsyncStorage.getItem |
| `src/screens/HomeScreen.js` | Storage key `wayfinder_tutorial_done` → `wayfinder_home_tutorial_v2` in useEffect and handleTutorialFinish; 100 ms setTimeout |
| `src/screens/SettingsScreen.js` | Two `removeItem` calls updated to new keys |
| `package.json` | `@maplibre/maplibre-react-native` added |
| `app.json` | `"@maplibre/maplibre-react-native"` added to `expo.plugins` |
| `src/components/CampusMap.js` | Full rewrite — MapLibre Native replaces SVG; same props interface |
| `src/screens/MapScreen.js` | Read-only verification (no changes expected) |
| `src/screens/ARScreen.js` | Remove CampusMap import, MAP_HEIGHT, mapSection; add compact bottomBar; fix arrivedOverlay to full-screen; fix arrivedBtns width to `W - 64` |

## Post-implementation note
Before the next EAS build (`eas build`) or `expo run:android`, run:
```
npx expo prebuild
```
from `c:\Users\Asus\WAYFINDER-FULLPACKAGE\wayfinder` so the MapLibre config plugin can link its native Android/iOS modules.
