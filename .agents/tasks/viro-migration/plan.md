# Wayfinder → Bare Workflow + ViroReact Ground-Plane AR — Implementation Plan

Migrate the Wayfinder Expo managed app to the bare workflow via `npx expo prebuild --clean` using the `@reactvision/react-viro` Expo config plugin, then replace the CameraView + SVG `NavigationArrow` + 2D projected orb trail in `ARScreen.js` with a real ViroReact AR scene that detects the ground and renders a 3D navigation arrow + 3D orbs on it.

This is a linear migration pipeline. Steps are ordered by hard dependency: migration must complete before the AR integration can build; review/build-verification come last.

---

## Context & Findings (grounded in code read)

### 1. Current app.json plugins array — adding @reactvision/react-viro conflicts with nothing

Current `app.json` plugins array:

```json
"plugins": [
  "./plugins/withApkName",
  [ "expo-camera", { "cameraPermission": "WAYFINDER needs camera access for AR navigation." } ],
  [ "expo-location", { "locationAlwaysAndWhenInUsePermission": "WAYFINDER needs your location to guide you around campus." } ],
  "expo-audio",
  "expo-sensors",
  "expo-asset",
  [ "expo-navigation-bar", { "position": "absolute", "visibility": "hidden" } ]
]
```

Decision: append the bare string `"@reactvision/react-viro"` at the end of the array. The string form means default options = `["AR"]` (ARCore on Android phones) — confirmed by the ViroReact Expo integration doc. No other plugin conflicts: the ViroReact plugin only adds ARCore native modules + a camera `<activity>` to AndroidManifest; the existing expo-camera/expo-location/expo-audio/expo-sensors/expo-asset/expo-navigation-bar plugins are untouched. Keep `expo-camera` installed even though `ARScreen` stops using `CameraView` (removing its plugin risks churn for no gain; ViroReact provides its own camera but the expo-camera dependency staying is harmless). No `rvApiKey`/`googleCloudApiKey` is needed: those keys are required only for Cloud Anchors / Geospatial Anchors, which this feature does NOT use — ground-plane detection (`ViroARPlaneSelector`) runs entirely on-device via ARCore and needs no API key.

### 2. withApkName.js — still works after `expo prebuild --clean`

`plugins/withApkName.js` is an Expo config plugin (`withAppBuildGradle` from `@expo/config-plugins`) that injects an `android.applicationVariants.all { ... outputFileName = "Wayfinder-${variant.buildType.name}.apk" }` block into `android/app/build.gradle` during prebuild, renaming the APK output to `Wayfinder-release.apk` / `Wayfinder-debug.apk`. It survives `npx expo prebuild --clean` because config plugins are driven by the `plugins` array in `app.json` and re-run every prebuild; `--clean` deletes the native `android/` dir then regenerates it from `app.json` + plugins, so `withApkName` re-injects its block. Note: the current `android/app/build.gradle` contains a hand-edited variant of this block (it uses a `def fileName` local variable instead of the plugin's inline `outputFileName = "Wayfinder-..."`); after `--clean` it is regenerated to the plugin's canonical form. The plugin's own duplicate-guard (`gradle.includes('outputFileName = "Wayfinder-')`) does not match the hand-edited block, but because `--clean` regenerates from scratch there is no duplicate. Safe. The `eas.json` `preview` profile already points `applicationArchivePath` at `android/app/build/outputs/apk/release/Wayfinder-release.apk`, so the rename stays consistent with the build the user runs.

### 3. minSdkVersion — already 24 (>= ViroReact requirement), no fix needed

The current `android/app/build.gradle` resolves SDK versions from `rootProject.ext.minSdkVersion` / `compileSdkVersion` / `targetSdkVersion`, which are set by the `expo-root-project` Gradle plugin (`node_modules/expo-modules-autolinking/.../ExpoRootProjectPlugin.kt`):

```kotlin
val minSdk = extra.setIfNotExist("minSdkVersion") { Integer.parseInt(versionCatalogs.getVersionOrDefault("minSdk", "24")) }
```

Default minSdkVersion = **24**; compileSdk/targetSdk = 35. There is no local override (no `android/gradle/libs.versions.toml`, no `minSdkVersion` in `android/gradle.properties`; `settings.gradle` uses `expoAutolinking.useExpoVersionCatalog()` which is the Expo catalog and does not lower it). ViroReact AR (ARCore) requires minSdkVersion >= 24. Current value satisfies it. **No fix needed.** Fix-if-lower (not required here): set `minSdkVersion=24` in `android/gradle.properties` (the `setIfNotExist` guard honors a pre-set value), or add a `withAppBuildGradle` config plugin — but neither is necessary since it is already 24.

### 4. ARScreen.js structure — what to replace vs preserve

File: `src/screens/ARScreen.js`. Layout constants: `CAM_HEIGHT = H * 0.58` (top 58% = camera), `MAP_HEIGHT = H * 0.42` (bottom 42% = mini-map), `GREEN = "#00C853"`.

**To REPLACE** (all inside `<View style={s.cameraSection}>`, all gated on `!isLoading && !arrived`):

- `<CameraView style={StyleSheet.absoluteFill} facing="back" />` — the live camera feed (from `expo-camera`). The ViroReact `ViroARSceneNavigator` provides the AR camera instead.
- The 2D projected orb trail: `projectedOrbs.map((orb) => <Animated.View style={[s.arOrb, { position, left, top, width, height, borderRadius }]} />)`. This is the `projectedOrbs` useMemo (uses `projectToScreen` from `arMath`).
- `<NavigationArrow angleDiff={nextAngle} />` inside `<View style={s.arrowWrap}>` — the SVG 3D arrow (defined as a top-level `function NavigationArrow` in this file using `react-native-svg` + `Animated`).

Replace those three renderings with a single `<ViroARNavScene angleDiff={nextAngle} waypoints={orbTrailRef.current.slice(0,5)} userLocation={location} heading={heading} />` filling the camera section (size it to `s.cameraSection`). Remove the now-unused `NavigationArrow` function and the `projectedOrbs` useMemo.

**To PRESERVE** (do NOT remove or change behavior):

Camera-section HUD elements (keep rendering as-is, conditioned on the same `!isLoading`/`!arrived`/value flags):
- `loadingOverlay` (`isLoading && !arrived`) — "GPS acquiring / plotting" screen.
- `indoorBanner` (`indoorStatus && !arrived && !isLoading`) — indoor warning + dismiss.
- `BearingHUD` in `s.hudTop` SafeAreaView — props `angleDiff={nextAngle}`, `distance={distToNext}`, `destName={destName}`, `lang={lang}`.
- `distChip` (`s.distChip`) — shows `distToNext` + `t('ar.toNext')`.
- `calibratorWrap` — `<CompassCalibrator offset={compassOffset} onAdjust={handleOffsetChange} heading={heading} lang={lang} />`.
- `backBtn` (`s.backWrap`/`s.backBtn`) — `navigation.goBack()`.

Bottom 42% map section (keep entirely): `routeBar`, `MapView` (`miniMapRef`, route `Polyline`, dest `Marker`, OSM `UrlTile` fallback when `isOffline`, `onMapLoadingError={handleMiniMapError}`), and the `arrived` `arrivedMapOverlay` ("OK / arrived / find room / back to map").

Top-level overlays (keep entirely): `StaircasePicker` (`staircasePickerVisible`, `selectedStaircase`), `ArrivalPrompt` (`arrivalPromptVisible`), `ARTutorial` (first-launch).

Keep ALL arrival logic unchanged: `handleArrival()`, `arrived`/`arrivedRef`, `arrivalCountRef`, `ARRIVAL_DIST = 12`, `NO_INDOOR_PROMPT`, `TWO_STAIRCASE_BUILDINGS`, the staircase-picker vs arrival-prompt branching, re-route when off-route > 40 m, and the orb-consumption loop in the "Update arrow angle + arrival check" effect.

**Exact prop variable names ViroARNavScene needs and where they are computed:**

- `angleDiff` ← `nextAngle` (state). Computed in the "Update arrow angle + arrival check" `useEffect`: `bearing = bearingTo(location.lat, location.lng, next.lat, next.lng)`, `angle = bearing - heading`, normalized to `[-180,180]`, then `setNextAngle(angle)`. `heading` here is the `heading` from `useLocation` which is already compass-offset-corrected (DEVNOTES: `DEFAULT_COMPASS_OFFSET = -260` applied in `useLocation.js`), 0 = north — consistent with `bearingTo` (0 = north, 90 = east).
- `waypoints` ← `orbTrailRef.current.slice(0, 5)` — the next 5 orbs (the same slice the `projectedOrbs` useMemo consumed). This ref advances as the user walks within `ORB_ADVANCE_DIST = 4` (sliced in that same effect).
- `userLocation` ← `location` — from `const { location, heading, error: locError } = useLocation();` at the top of the component.
- `heading` ← `heading` — same `useLocation` destructuring; north-referenced device compass in degrees.

### 5. ViroARNavScene.js component contract

New file: `src/components/ViroARNavScene.js`. Exports a default component:

```js
export default function ViroARNavScene({ angleDiff, waypoints, userLocation, heading }) { ... }
```

Internals:

- Wrap in `ViroARSceneNavigator` with `initialScene={{ scene: NavScene }}` and `viroAppProps={{ angleDiff, waypoints, userLocation, heading }}`. The navigator passes `viroAppProps` into the scene component as props, so the inner `NavScene(props)` reads `{ angleDiff, waypoints, userLocation, heading }` from props.
- Inner `NavScene`:
  - `useState` for `planeFound` (boolean, false initially).
  - `ViroARScene` with `onTrackingUpdated` (set `planeFound` flow helper) and optionally `onCameraTransformUpdate` (camera world position + forward — used only if a follow-the-user arrow mode is added later; not required for v1).
  - `ViroARPlaneSelector` with `minWidth={1.5}`, `minHeight={1.5}`, `onPlaneSelected={() => setPlaneFound(true)}`, `visible={!planeFound}` — drives ground detection; children render on the detected plane.
  - "scanning for surface..." `ViroText` at `position={[0, 0.05, -1.5]}`, `scale={[0.5,0.5,0.5]}`, visible while `!planeFound` — shown until a plane is detected.
  - The green navigation arrow as a child of `ViroARPlaneSelector` at `position={[0, 0.02, -1.5]}` (1.5 m ahead on the plane, just above the ground), `rotation={[0, angleDiff, 0]}` (Y-axis rotation by `angleDiff`), green material `#00C853`, built from `ViroBox`/`ViroCone` (or a Viro `Viro3DObject` if an arrow model asset is supplied — for v1 build it from primitives to avoid bundling a model). Apply a `ViroAnimations` "bob" + "pulse" via the node's `animation={{ name: "arrowBob", run: true, loop: true }}`.
  - `ViroSphere` orbs (`radius={0.15}`, `widthSegments={16}`, `heightSegments={16}`) for each waypoint in `waypoints`, placed at GPS-derived world positions using this helper (north = −Z, east = +X):

    ```js
    // Capture anchorHeading once when the plane is first selected (state),
    // aligning the AR world −Z axis to the compass heading the camera faced.
    function gpsToARWorld(userLat, userLng, wpLat, wpLng, anchorHeadingDeg) {
      const bearing = bearingTo(userLat, userLng, wpLat, wpLng); // 0=north, 90=east
      const dist = distanceTo(userLat, userLng, wpLat, wpLng);  // metres
      const rad = ((bearing - anchorHeadingDeg) * Math.PI) / 180;
      const x =  dist * Math.sin(rad); // east = +X
      const z = -dist * Math.cos(rad); // north = -Z
      return [x, 0.15, z];
    }
    ```

    Orb material `#00E6B4` (matches the existing 2D `arOrb` color `rgba(0,230,180,0.85)`). Recompute orb positions each render from live `userLocation`/`waypoints` (the leading orbs are consumed by `ARScreen` as the user walks, so the trail advances — same recompute-each-update behavior as the old 2D projection). GPS/compass jitter over distance is a known v1 limitation; acceptable since orbs are always the next few within ~30 m.
  - Register materials and animations at module load: `ViroMaterials.createMaterials({ greenArrow: { lightingModel:"Blinn", diffuseColor:"#00C853" }, orb: { lightingModel:"Blinn", diffuseColor:"#00E6B4" } })`; `ViroAnimations.registerAnimations({ arrowBob: { properties:{ positionY:"0.02 => 0.12 => 0.02" }, easing:"EaseInOut", duration: 1500, loop:true }, arrowPulse: { properties:{ scaleX:"1 => 1.15 => 1", scaleY:"1 => 1.15 => 1", scaleZ:"1 => 1.15 => 1" }, easing:"EaseInOut", duration: 1200, loop:true } })`.
- Imports: `import { ViroARSceneNavigator, ViroARScene, ViroARPlaneSelector, ViroText, ViroSphere, ViroBox, ViroMaterials, ViroAnimations } from '@reactvision/react-viro';` plus `import { bearingTo, distanceTo } from '../utils/arMath';`.

Design decision (arrow rotation sign): default `rotation={[0, angleDiff, 0]}`. Because the arrow is anchored to the detected ground while `angleDiff` is camera-relative, the exact sign depends on ViroReact's Y-rotation handedness and the AR-frame yaw alignment; the on-device verification step (step 8) includes confirming the arrow points along the route and flipping to `rotation={[0, -angleDiff, 0]}` if it points the wrong way. The user already committed to a real on-device test, so this single calibration is the one empirical step. The default is concrete; the fallback is defined.

---

## Implementation Plan

- [ ] 0. Back up the project folder before the destructive migration step.
      Copy `c:\Users\Asus\WAYFINDER-FULLPACKAGE\wayfinder` to a sibling backup (e.g. `wayfinder.bak-pre-viro`) so the project can be restored if prebuild/install corrupts anything. (The user asked about this risk and has a backup habit; the `android/` dir is gitignored/untracked so `--clean` loses nothing committed, but `node_modules`/lockfile churn is easier to undo from a backup.)
      Files: none (filesystem copy outside the repo).
      Verify: backup folder exists and contains `package.json`, `src/`, `app.json`.

- [ ] 1. Pin `@reactvision/react-viro@2.53.1` into `package.json` dependencies.
      Add `"@reactvision/react-viro": "2.53.1"` to the `dependencies` object in `package.json`. Pin exact 2.53.1 (NOT latest 3.0.3 and NOT 2.56.0): 2.53.1 declares peer `react ~19.1.0`, `react-native ~0.81.4`, `expo ~54.0.10` — all three match this project's React 19.1.0 / RN 0.81.5 / Expo ~54.0.37 exactly, so npm dedupes to a single React (no "older version of React" runtime error). 2.56.0+ want `react ~19.2.0` (would install a nested React 19.2 and trigger the duplicate-React crash in RN issue #52728); 2.57.0+ require RN 0.83. 2.53.1 requires the New Architecture, which this project already enables (`newArchEnabled=true` in `android/gradle.properties`).
      Files: `package.json`
      Verify: `node -e "console.log(require('./package.json').dependencies['@reactvision/react-viro'])"` prints `2.53.1`.

- [ ] 2. Add the `@reactvision/react-viro` Expo config plugin to `app.json`.
      Append the bare string `"@reactvision/react-viro"` as the last entry of the `expo.plugins` array (default options = AR mode). Do not remove any existing plugin; do not add `rvApiKey`/`googleCloudApiKey` (not needed for ground-plane AR). The camera permission is already present (`android.permission.CAMERA` and the expo-camera plugin string) and ViroReact's plugin also declares camera use, so no permission change is needed.
      Files: `app.json`
      Verify: `node -e "const p=require('./app.json').expo.plugins; console.log(p[p.length-1])"` prints `@reactvision/react-viro` and `node -e "console.log(JSON.stringify(require('./app.json').expo.plugins))"` still lists all 7 prior entries.

- [ ] 3. Install the dependency and update the lockfile.
      Run `npm install` so `@reactvision/react-viro@2.53.1` and its transitive deps land in `node_modules` and `package-lock.json`. Confirm a single hoisted React (no nested react under `node_modules/@reactvision/react-viro/node_modules/react`).
      Files: `package-lock.json` (auto-updated), `node_modules/` (installed)
      Verify: `npm ls @reactvision/react-viro` shows `@reactvision/react-viro@2.53.1` with no peer warnings for react/react-native/expo, and `Test-Path node_modules/@reactvision/react-viro/node_modules/react` returns False (single React).

- [ ] 4. Regenerate native Android via `npx expo prebuild --clean`.
      Run `npx expo prebuild --clean` from the project root. This deletes the gitignored `android/` dir and regenerates it from `app.json` + the plugins array, applying `withApkName`, the existing plugins, and the new `@reactvision/react-viro` plugin (adds ARCore + Viro native modules and the camera activity to AndroidManifest). Expect the regenerated `android/app/build.gradle` to contain `withApkName`'s canonical `applicationVariants.all { ... outputFileName = "Wayfinder-${variant.buildType.name}.apk" }` block and `android/settings.gradle` to still reference the expo autolinking + RN gradle plugins.
      Files: `android/` (regenerated, gitignored)
      Verify: `Test-Path android/app/build.gradle`, `Test-Path android/settings.gradle`, `Test-Path android/app/src/main/AndroidManifest.xml` all True; `Select-String -Path android/app/build.gradle -Pattern 'outputFileName = "Wayfinder-'` matches; `Select-String -Path android/app/src/main/AndroidManifest.xml -Pattern 'ARCore|Viro|com.google.ar'` matches (ViroReact plugin entries present). Prebuild command exits 0.

- [ ] 5. Confirm minSdkVersion >= 24 after prebuild (no fix expected).
      Confirm the regenerated `android/app/build.gradle` still resolves `minSdkVersion rootProject.ext.minSdkVersion` (default 24) and that nothing lowered it. If for any reason it resolved below 24, add `minSdkVersion=24` to `android/gradle.properties` (the expo-root-project `setIfNotExist` guard honors it) and re-run prebuild. (Expected outcome: no change needed.)
      Files: `android/app/build.gradle` (read-only check), optionally `android/gradle.properties`
      Verify: `Select-String -Path android/app/build.gradle -Pattern 'minSdkVersion rootProject.ext.minSdkVersion'` matches; no action if it resolves to 24 (it does by default).

- [ ] 6. Create `src/components/ViroARNavScene.js` implementing the contract in section 5.
      Implement the exported `ViroARNavScene({ angleDiff, waypoints, userLocation, heading })` wrapper + inner `NavScene` with `ViroARSceneNavigator`/`ViroARScene`/`ViroARPlaneSelector` ground detection, the "scanning for surface..." `ViroText`, the green (`#00C853`) arrow ~1.5 m ahead with Y-rotation `angleDiff` + `ViroAnimations`, and the `ViroSphere` (r=0.15) orbs at `gpsToARWorld(...)` positions (north=−Z, east=+X) using the `anchorHeading` captured at first plane selection. Register `ViroMaterials` + `ViroAnimations` at module load. Reuse `bearingTo`/`distanceTo` from `../utils/arMath`.
      Files: `src/components/ViroARNavScene.js` (new)
      Verify: `npx expo start --dev-client` (or `npx expo export --platform android`) bundles Metro without errors (no "Unable to resolve '@reactvision/react-viro'" or syntax errors). A quick `node --check src/components/ViroARNavScene.js` should pass after the JSX is stripped or via the bundler.

- [ ] 7. Integrate `ViroARNavScene` into `ARScreen.js`, removing the old camera + SVG arrow + 2D orbs and preserving all HUD elements.
      Inside `<View style={s.cameraSection}>`: remove `<CameraView ...>`, the `projectedOrbs.map(...)` 2D-orb block, and `<View style={s.arrowWrap}><NavigationArrow angleDiff={nextAngle} /></View>`. In their place render `<ViroARNavScene angleDiff={nextAngle} waypoints={orbTrailRef.current.slice(0,5)} userLocation={location} heading={heading} />` sized to fill `s.cameraSection` (give it `style={{ width: W, height: CAM_HEIGHT }}`). Keep every preserved HUD element (loadingOverlay, indoorBanner, BearingHUD, distChip, calibratorWrap, backBtn), the entire bottom-42% map section, and the StaircasePicker/ArrivalPrompt/ARTutorial overlays exactly as-is. Delete the now-unused `NavigationArrow` function and the `projectedOrbs` useMemo from this file. Prune unused imports: drop `CameraView`/`useCameraPermissions` only if you replace the permission gate (keep `useCameraPermissions` for the gate is fine), drop `Svg, { Path, G, Defs, LinearGradient, RadialGradient, Stop, Polygon, Ellipse }`, drop `projectToScreen` from the `arMath` import (keep `bearingTo`, `distanceTo`), and drop `Easing`/`Animated` if no longer referenced in this file. Keep `useCameraPermissions` permission gate UI so the "grant camera" flow still works before Viro starts.
      Files: `src/screens/ARScreen.js`
      Verify: `npx expo start --dev-client` (or `npx expo export --platform android`) bundles without errors; `Select-String -Path src/screens/ARScreen.js -Pattern 'ViroARNavScene'` matches and `Select-String -Path src/screens/ARScreen.js -Pattern '<CameraView'` no longer matches; the BearingHUD/distChip/calibratorWrap/backBtn/map/arrived overlays are still present (`Select-String` for `BearingHUD`, `distChip`, `calibratorWrap`, `backBtn`, `MapView`, `ArrivalPrompt`, `StaircasePicker` all match).

- [ ] 8. Build, install, and launch on the connected Android device (`npx expo run:android`).
      With the device attached (ADB shows `R9WW30BL1QX device`), run `npx expo run:android` from the project root. This compiles the regenerated native project (linking ViroReact/ARCore), bundles the JS, installs, and launches. Confirm it builds (exit 0) and reaches the AR screen via `MapScreen → navigate("AR", { destinationId })` without a native crash.
      Files: none (build artifacts in `android/app/build/`)
      Verify: `npx expo run:android` exits 0; the app launches; opening the AR screen shows the Viro camera + "scanning for surface..." then, after pointing the phone at a textured floor, detects the ground and renders the green arrow + orbs. If the arrow points the wrong way relative to the route, flip its rotation to `rotation={[0, -angleDiff, 0]}` in `ViroARNavScene.js`, rebuild, and re-check (the single on-device calibration noted in section 5). Alternative APK build the user already uses: `cd android; .\gradlew.bat assembleRelease` → `android/app/build/outputs/apk/release/Wayfinder-release.apk`.

- [ ] 9. Review the full diff against this plan (write `review.json`).
      Reviewer: check that (a) `package.json` pins `@reactvision/react-viro@2.53.1`; (b) `app.json` plugins array has the new entry and all prior entries; (c) `withApkName` block is present in regenerated `android/app/build.gradle`; (d) `ViroARNavScene.js` matches the section-5 contract (ground detection, scanning text, green arrow with `angleDiff` rotation + animations, orbs at GPS world positions, props wired); (e) `ARScreen.js` keeps all preserved HUD/map/arrival/overlay elements and only the camera+SVG-arrow+2D-orbs were removed; (f) build evidence from step 8. Write the verdict to `c:\Users\Asus\WAYFINDER-FULLPACKAGE\wayfinder\.agents\tasks\viro-migration\review.json` as `{"verdict":"APPROVED"}` or `{"verdict":"CHANGES_REQUESTED","findings":[...]}`.
      Files: `c:\Users\Asus\WAYFINDER-FULLPACKAGE\wayfinder\.agents\tasks\viro-migration\review.json` (written by reviewer)
      Verify: `review.json` exists with `verdict` field; the build-loop stops when it equals `APPROVED`.

- [ ] 10. Document the migration in `DEVNOTES.md`.
      Update the "Stack" AR row and the "AR Navigation" section: AR is now real ViroReact (`@reactvision/react-viro@2.53.1`, bare workflow via `npx expo prebuild --clean`, config plugin `@reactvision/react-viro`), replacing the SVG-perspective illusion. Note that `android/` is gitignored and regenerated by prebuild, that ground-plane AR needs no API key, and that the arrow's Y-rotation sign is calibrated on-device (default `[0, angleDiff, 0]`, flip to `[0, -angleDiff, 0]` if reversed). Keep the rest of the file intact.
      Files: `DEVNOTES.md`
      Verify: `Select-String -Path DEVNOTES.md -Pattern 'react-viro|ViroReact|prebuild'` matches; the existing AR flow description still references the unchanged arrival/compass-offset behavior.

- [ ] 11. Final verify-build: produce a clean APK and confirm the feature end-to-end.
      Run `cd android; .\gradlew.bat assembleRelease` (the user's APK path) and confirm `android/app/build/outputs/apk/release/Wayfinder-release.apk` is produced (renamed by `withApkName`). This is the artifact the user installs for their real on-device test.
      Files: `android/app/build/outputs/apk/release/Wayfinder-release.apk` (build output)
      Verify: the APK exists and is non-zero size; the user's subsequent real on-device test confirms ground detection + arrow + orbs (per their original request: "do a quick test ... then ill do a real test myself after building it").
