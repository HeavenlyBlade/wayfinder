# Implementation Plan — AR Screen Crash Fix

**Root cause:** `ViroARNavScene` (which wraps `ViroARSceneNavigator`) is rendered *inside*
`<View style={s.cameraSection}>`. ViroReact requires `ViroARSceneNavigator` to be the
root/outermost view — nesting it inside any sibling View triggers an immediate crash.

**Fix strategy:** Flatten the screen into a single root `<View style={s.fill}>` that contains:
1. `ViroARNavScene` as the very first child, filling the whole screen via `StyleSheet.absoluteFill`.
2. All HUD elements as absolutely-positioned overlays stacked on top.
3. The map info panel as an absolutely-positioned panel anchored to the bottom.

No logic changes. No changes to `ViroARNavScene.js`.

---

## File to modify
`c:\Users\Asus\WAYFINDER-FULLPACKAGE\wayfinder\src\screens\ARScreen.js`

---

## Steps (ordered by dependency)

- [ ] 1. **Add `useCallback` to the React import.**

  `useCallback` is already used in the file (the `loadRoute` callback uses it), but it is
  missing from the import line — this will currently cause a ReferenceError. Add it.

  **Change:**
  ```js
  // Before
  import React, { useEffect, useRef, useState } from "react";
  // After
  import React, { useCallback, useEffect, useRef, useState } from "react";
  ```

  Files: `src/screens/ARScreen.js` (line 1)
  Verify: `npx expo export --platform android --dev false` — no "useCallback is not defined" error.

---

- [ ] 2. **Remove MapView / react-native-maps imports.**

  `MapView`, `Polyline`, and `Marker` will no longer be rendered. Remove the import to
  eliminate dead code and prevent any bundler warnings about unused native modules.

  **Change:**
  ```js
  // Remove entirely:
  import MapView, {
    Polyline, Marker,
  } from "react-native-maps";
  ```

  Also remove `miniMapRef` (the `useRef(null)` for the MapView) and the
  `miniMapRef.current.animateToRegion(...)` call inside the heading/arrival `useEffect`.
  Keep the `routeCoords` state and `setRouteCoords` — they are still used for the totalDist
  calculation and could be reused later; if you want to trim further, they can stay unused
  without error.

  Files: `src/screens/ARScreen.js`
  Verify: bundler output contains no reference to `react-native-maps`.

---

- [ ] 3. **Remove the `cameraSection` wrapper View and restructure the return statement.**

  The root `<View style={s.fill}>` stays. Replace its children as described below. The key
  rule: `ViroARNavScene` must be the **first child** of the root view and must carry
  `style={StyleSheet.absoluteFill}`.

  **New JSX structure (inside the main `return`, after the permission/error gates):**

  ```jsx
  return (
    <View style={s.fill}>
      <StatusBar style="light" hidden />

      {/* ① AR scene — fills the whole screen; MUST be first child */}
      <ViroARNavScene
        style={StyleSheet.absoluteFill}
        angleDiff={nextAngle}
        waypoints={orbTrailRef.current.slice(0, 5)}
        userLocation={location}
        heading={heading}
      />

      {/* ② Loading overlay — absolute, full-screen */}
      {isLoading && !arrived && (
        <View style={s.loadingOverlay}>
          <Text style={s.loadingIcon}>[...]</Text>
          <Text style={s.loadingText}>
            {!location ? t('ar.gpsAcquiring', lang) : t('ar.plotting', lang)}
          </Text>
          <Text style={s.loadingSub}>{t('ar.pointAhead', lang)}</Text>
        </View>
      )}

      {/* ③ Indoor warning banner — absolute */}
      {indoorStatus && !arrived && !isLoading && (
        <View style={s.indoorBanner}>
          <Text style={s.indoorBannerText}>{t('ar.indoor.title', lang)}</Text>
          <TouchableOpacity onPress={() => setIndoorStatus(null)}>
            <Text style={s.indoorBannerDismiss}>{t('ar.indoor.dismiss', lang)}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ④ BearingHUD — absolute top-center */}
      {!isLoading && !arrived && (
        <SafeAreaView style={s.hudTop} edges={["top"]} pointerEvents="box-none">
          <BearingHUD
            angleDiff={nextAngle}
            distance={distToNext}
            destName={destName}
            lang={lang}
          />
        </SafeAreaView>
      )}

      {/* ⑤ Distance chip — absolute bottom-left, above map panel */}
      {!isLoading && !arrived && distToNext !== null && (
        <View style={s.distChip} pointerEvents="none">
          <Text style={s.distVal}>{distToNext}m</Text>
          <Text style={s.distLabel}>{t('ar.toNext', lang)}</Text>
        </View>
      )}

      {/* ⑥ Compass calibrator — absolute bottom-right, above map panel */}
      {!isLoading && !arrived && (
        <View style={s.calibratorWrap}>
          <CompassCalibrator
            offset={compassOffset}
            onAdjust={handleOffsetChange}
            heading={heading}
            lang={lang}
          />
        </View>
      )}

      {/* ⑦ Back button — absolute top-left */}
      {!arrived && (
        <SafeAreaView style={s.backWrap} edges={["top"]}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <IconArrowLeft size={18} color="#ffffff" />
          </TouchableOpacity>
        </SafeAreaView>
      )}

      {/* ⑧ Map info panel — absolute bottom */}
      <View style={s.mapSection}>
        <View style={s.routeBar}>
          <View style={s.routeBarLeft}>
            <Text style={s.routeDestName} numberOfLines={1}>{destName}</Text>
            {totalDist != null && (
              <Text style={s.routeTotalDist}>{totalDist}m total</Text>
            )}
          </View>
          {!arrived && (
            <View style={s.routeBarRight}>
              <Text style={s.nextLabel}>{t('ar.nextTurn', lang)}</Text>
              <Text style={s.nextDist}>{distToNext != null ? `${distToNext}m` : "—"}</Text>
            </View>
          )}
        </View>

        {/* Simple info panel replacing MapView */}
        <View style={s.miniMapReplace}>
          <Text style={s.miniMapDestName} numberOfLines={1}>{destName}</Text>
          {totalDist != null && (
            <Text style={s.miniMapDist}>{totalDist}m away</Text>
          )}
          <Text style={s.miniMapHint}>▶ Tap arrow to navigate</Text>
        </View>

        {/* Arrived overlay on map section */}
        {arrived && (
          <View style={s.arrivedMapOverlay}>
            <Text style={s.arrivedMapIcon}>OK</Text>
            <Text style={s.arrivedMapTitle}>{t('ar.arrived', lang)}</Text>
            <Text style={s.arrivedMapSub}>{destName}</Text>
            <View style={s.arrivedMapBtns}>
              {!NO_INDOOR_PROMPT.has(destinationId) && (
                <TouchableOpacity
                  style={s.arrivedMapBtn}
                  onPress={() => {
                    if (TWO_STAIRCASE_BUILDINGS.has(destinationId) && !selectedStaircase) {
                      setStaircasePickerVisible(true);
                    } else {
                      setArrivalPromptVisible(true);
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={s.arrivedMapBtnText}>{t('ar.findRoom', lang)}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[s.arrivedMapBtn, s.arrivedMapBtnBack]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.85}
              >
                <Text style={[s.arrivedMapBtnText, { color: "rgba(255,255,255,0.6)" }]}>
                  {t('ar.backToMap', lang)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* ── Staircase picker ── */}
      <StaircasePicker
        visible={staircasePickerVisible}
        buildingId={destinationId}
        buildingName={destName}
        lang={lang}
        onSelect={(stairKey) => {
          setSelectedStaircase(stairKey);
          setStaircasePickerVisible(false);
          setArrivalPromptVisible(true);
        }}
        onDismiss={() => setStaircasePickerVisible(false)}
      />

      {/* ── Arrival prompt ── */}
      <ArrivalPrompt
        visible={arrivalPromptVisible}
        buildingId={destinationId}
        buildingName={destName}
        lang={lang}
        staircase={selectedStaircase === "staircase_2" ? "s2" : "s1"}
        onClose={() => setArrivalPromptVisible(false)}
      />

      {/* ── AR Tutorial — first launch only ── */}
      <ARTutorial lang={lang} />
    </View>
  );
  ```

  Files: `src/screens/ARScreen.js`
  Verify: `npx expo export --platform android --dev false` — no JSX parse errors.

---

- [ ] 4. **Update the StyleSheet — `cameraSection` removed, `mapSection` made absolute, HUD positions updated.**

  Replace the `s` StyleSheet with the following changes:

  **Remove:**
  - `cameraSection` — no longer exists; the root `fill` View covers the whole screen now.
  - `miniMap` — replaced by `miniMapReplace`.

  **Modify `mapSection`** — was a flex child; becomes an absolute panel at the bottom:
  ```js
  mapSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: MAP_HEIGHT,
    backgroundColor: "#0d1a10",
  },
  ```

  **Modify `distChip`** — raise it above the map panel (MAP_HEIGHT = H * 0.42):
  ```js
  distChip: {
    position: "absolute",
    bottom: MAP_HEIGHT + 24,   // was 24
    left: 16,
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 64,
  },
  ```

  **Modify `calibratorWrap`** — raise it above the map panel:
  ```js
  calibratorWrap: {
    position: "absolute",
    bottom: MAP_HEIGHT + 20,   // was 20
    right: 12,
  },
  ```

  **Add `miniMapReplace`** — dark placeholder panel replacing the MapView:
  ```js
  miniMapReplace: {
    flex: 1,
    backgroundColor: "#0a120c",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  miniMapDestName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    paddingHorizontal: 24,
  },
  miniMapDist: {
    fontSize: 13,
    color: GREEN,
    fontWeight: "700",
  },
  miniMapHint: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
    marginTop: 4,
  },
  ```

  All other style entries (`fill`, `center`, `loadingOverlay`, `indoorBanner`, `hudTop`,
  `backWrap`, `backBtn`, `routeBar`, `arrivedMapOverlay`, permission styles, etc.)
  remain **unchanged**.

  Files: `src/screens/ARScreen.js`
  Verify: `npx expo export --platform android --dev false` — build succeeds with no errors.

---

## Summary of what changes vs. what stays the same

| Area | Action |
|---|---|
| `useCallback` import | **ADD** to React import line |
| `MapView`, `Polyline`, `Marker` imports | **REMOVE** |
| `miniMapRef` ref and `animateToRegion` call | **REMOVE** |
| `routeCoords` state | Keep (used for totalDist calc, harmless) |
| `cameraSection` wrapper View | **DELETE** — flatten into root View |
| `ViroARNavScene` position | Move to first child of root View with `StyleSheet.absoluteFill` |
| All HUD elements | Convert from cameraSection children → absolute overlays on root View |
| `mapSection` style | `position: "absolute"`, `bottom: 0`, `height: MAP_HEIGHT` |
| `MapView` JSX block | **REPLACE** with `miniMapReplace` View (destName + totalDist + hint) |
| `distChip` bottom | `MAP_HEIGHT + 24` (was `24`) |
| `calibratorWrap` bottom | `MAP_HEIGHT + 20` (was `20`) |
| All logic (route loading, arrival, orbs, heading, staircase, arrival prompt, tutorial) | **UNCHANGED** |
| `ViroARNavScene.js` | **UNCHANGED** |

---

## Verification

After applying all changes, run:
```
cd c:\Users\Asus\WAYFINDER-FULLPACKAGE\wayfinder
npx expo export --platform android --dev false
```
Expected: exits 0, no errors about `useCallback`, `MapView`, or ViroReact nesting.

To confirm the crash is gone at runtime: build with `npx expo run:android` (or EAS) and
navigate to ARScreen — it should open without crashing, show the AR camera feed full-screen,
and display the dark info panel at the bottom.
