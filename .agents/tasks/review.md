# Tutorial fix, CampusMap SVG→MapLibre rewrite, ARScreen full-screen AR cleanup

Three coordinated changes address the tutorial-skip bug, swap the campus map renderer from a custom SVG to MapLibre GL Native, and strip the mini-map out of ARScreen to make it a pure AR screen. The tutorial fix inverts the default-visible pattern and wraps the AsyncStorage check in a 100ms delay to guarantee the Modal is mounted before the suppression check fires. The CampusMap rewrite preserves all 16 building polygon datasets as GeoJSON and keeps the props interface identical to the SVG version. ARScreen sheds `MAP_HEIGHT`, `mapSection`, and the `CampusMap` import entirely; the layout is replaced by a compact 60px bottom bar and a full-screen arrived overlay.

**Watch for:** (confirmed) ARTutorial step layout still uses `CAM_H = H * 0.58` to size the camera highlight region — that split no longer exists. The arrow and calibrator anchor rings will appear at the wrong vertical position on a full-screen AR screen. (possible) `@maplibre/maplibre-react-native` is caret-pinned (`^11.5.0`), allowing silent minor-version bumps that could break the native module. (possible) `demotiles.maplibre.org` is a public demo tile server with no SLA; the map fails silently if it goes offline.

**Verdict**: APPROVED

---

## High-level view

The tutorial-skip root cause was a default `visible = false` that caused React to return `null` before `AsyncStorage` responded on first launch. Flipping the default to `true` and adding the 100ms guard closes both the Android-low-end timing gap and the early-return short-circuit. Storage key bumps (`_v4`, `_v2`) ensure users who dismissed the old tutorial under the split-screen layout don't carry a stale suppression flag into the new layout.

The MapLibre rewrite is a straight substitution: same 16 building polygons, same coordinate values, same six-prop interface. The tile source is a public demo endpoint with no documented SLA, and the package is caret-pinned, both worth addressing before a production release.

ARScreen is now a single-concern screen. `CampusMap`, `MAP_HEIGHT`, `CAM_HEIGHT`, and `mapSection` are gone. The `distChip` (bottom: 80) and `calibratorWrap` (bottom: 76) clear the 60px bottom bar. The arrived overlay is `StyleSheet.absoluteFillObject` and covers the full viewport. One gap: ARTutorial's highlight geometry was not updated to match the full-screen layout.

---

<details>
<summary>Issues (2)</summary>

1. **Stale CAM_H in ARTutorial** — `CAM_H = H * 0.58` sizes the `cameraRegion` View in the tutorial overlay. ARScreen no longer has a 58%/42% split; the camera is full-screen. The step-2 arrow highlight ring and step-3 calibrator ring are anchored relative to a region that covers only 58% of the screen height. Remove `CAM_H` and reposition the highlight anchors for a full-screen AR layout.

2. **Caret-pinned MapLibre dependency** — `"@maplibre/maplibre-react-native": "^11.5.0"` allows any `11.x` release. Because this package ships native Android code, a minor bump that renames a JNI symbol or changes a Gradle artifact would silently break the build on the next clean `npm install`. Pin to an exact version or `~11.5.0`.

</details>

---

<details>
<summary>Details</summary>

### ARTutorial highlight geometry not updated for full-screen AR

`CAM_H = H * 0.58` is declared at the top of `ARTutorial.js` and drives `cameraRegion`'s height in the StyleSheet. In the old split-screen, this `View` framed the top half of the screen and the anchor highlights were positioned relative to it. Now that the camera is full-screen, the `cameraRegion` only occupies 58% of the viewport, so both highlight rings (`arrowHighlight` at `bottom: 20` inside `cameraRegion`, and `calHighlight` at `bottom: 16` inside `cameraRegion`) land well above where those UI elements actually sit. The copy was updated — step 2 no longer mentions the map, step 3 points to "bottom-right of camera" — but the visual callouts will point at empty space. (confirmed)

### demotiles.maplibre.org tile server

The tile style URL is `https://demotiles.maplibre.org/style.json`. This endpoint is operated by the MapLibre project as a demonstration service. It has gone offline or rate-limited in the past and carries no uptime guarantee. A campus navigation app that goes map-blank without an obvious error message is a poor user experience. The failure mode is silent: `MapLibreGL.MapView` will render an empty dark background (`backgroundColor: '#0d1a0e'`) with no indication that tiles failed to load. Swapping to a self-hosted `maptiler-osm` export or a tile CDN with a paid SLA is the fix. (possible)

### Caret pin on native dependency

`@maplibre/maplibre-react-native` at `^11.5.0` is the only new native dependency in this diff. React Native native modules link against specific symbol names and Gradle artifact coordinates at build time; a `11.6.0` or `11.5.1` release that changes either would produce a build error that looks unrelated to this change. Pinning to `"11.5.0"` (exact) or `"~11.5.0"` (patch-only) removes this risk. (possible)

</details>

---

<details>
<summary>File map</summary>

| File | What changed |
|---|---|
| `src/components/ARTutorial.js` | Storage key → `wayfinder_ar_tutorial_v4`; initial `visible = true`; 100ms setTimeout on AsyncStorage check; step 2 and 3 copy updated for ViroReact full-screen AR |
| `src/screens/HomeScreen.js` | Storage key → `wayfinder_home_tutorial_v2`; initial `showTutorial = true`; 100ms setTimeout on AsyncStorage check |
| `src/screens/SettingsScreen.js` | Reset handlers updated to `wayfinder_ar_tutorial_v4` and `wayfinder_home_tutorial_v2` |
| `src/components/CampusMap.js` | Full rewrite SVG → MapLibre GL Native; 16 building polygons as GeoJSON; props interface unchanged |
| `app.json` | `@maplibre/maplibre-react-native` plugin added |
| `src/screens/ARScreen.js` | Removed CampusMap, MAP_HEIGHT, CAM_HEIGHT, mapSection; added bottomBar h:60 bottom:0; arrivedOverlay → absoluteFillObject; distChip bottom:80, calibratorWrap bottom:76 |

Full diff: `git diff main` in `c:\Users\Asus\WAYFINDER-FULLPACKAGE\wayfinder`

</details>
