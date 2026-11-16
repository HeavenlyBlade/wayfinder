# ViroReact Bare-Workflow Migration Log

Scope: Steps 1–4 of `plan.md` only — install ViroReact, add the config plugin to
`app.json`, run `npx expo prebuild --clean`, and verify the generated `android/`
project. `ARScreen.js` and `ViroARNavScene.js` were NOT touched (later step). No
business logic changed. No git commit made.

---

## Step 1 — Install ViroReact

Command: `npm install @reactvision/react-viro@2.53.1`

Pinned to exact 2.53.1 per plan §1 / step 1 (NOT latest 3.0.x and NOT 2.56.0+).
Reason: this project is `react 19.1.0` / `react-native 0.81.5` / `expo ~54.0.37`,
which matches 2.53.1's peer deps (`react ~19.1.0`, `react-native ~0.81.4`,
`expo ~54.0.10`) exactly, so npm dedupes to a single React. 2.56.0+ want
`react ~19.2.0` (would install a nested React 19.2 → RN duplicate-React crash
#52728); 2.57.0+ require RN 0.83. Installing `@reactvision/react-viro` without a
version would pull latest and set up that blocker, so the plan's pin is honored.

Result:
- Exit code 0. Output: `added 28 packages, and audited 708 packages in 2m`.
- One deprecation notice (`glob@10.5.0`) and pre-existing npm-audit advisories
  on transitive deps; **no peer-dependency errors** for react / react-native /
  expo.
- `npm install` inserted `"@reactvision/react-viro": "^2.53.1"` (caret) into
  `package.json` in alphabetical position and incidentally reformatted the
  `expo.install.exclude` array to multi-line. To honor the exact pin and keep a
  minimal diff, `package.json` was rewritten to a single
  `"@reactvision/react-viro": "2.53.1"` entry (alphabetical position, no caret)
  with the `exclude` array reverted to its original inline form. (An
  intermediate edit had briefly left a duplicate `react-viro` key — Node's
  last-wins parse still read `2.53.1`, but it was removed for a clean,
  validator-safe file.) The lockfile was re-synced with
  `npm install --package-lock-only`.

Verification:
- `package.json` dep = `2.53.1` (exact, no caret); valid JSON with exactly one
  `@reactvision/react-viro` key. `git diff` shows a single added dependency line.
- `package-lock.json`: root-deps spec = `2.53.1`, resolved version = `2.53.1`;
  `npm install --package-lock-only` exits 0 (lockfile consistent).
- `node_modules/@reactvision/react-viro/package.json` version = `2.53.1`.
- `npm ls @reactvision/react-viro` → `@reactvision/react-viro@2.53.1`, no peer
  warnings.
- Single hoisted React (no duplicate): `node_modules/@reactvision/react-viro/node_modules/react` = **False**; `.../node_modules/react-native` = **False**.

---

## Step 2 — Add the plugin to `app.json`

Two edits to `app.json`:

1. Added `"newArchEnabled": true` to the `expo` object (required by ViroReact
   2.53.1 — see Step 3 for why this was necessary).
2. Appended the ViroReact config plugin as the last entry of `expo.plugins` in
   the explicit-options form the task specified:
   `["@reactvision/react-viro", { "android": { "xRMode": "AR" } }]`.

`expo.plugins` after edit — **8 entries**, the prior 7 unchanged and still
first; `./plugins/withApkName` remains the first entry:

```json
[
  "./plugins/withApkName",
  ["expo-camera", { "cameraPermission": "WAYFINDER needs camera access for AR navigation." }],
  ["expo-location", { "locationAlwaysAndWhenInUsePermission": "WAYFINDER needs your location to guide you around campus." }],
  "expo-audio",
  "expo-sensors",
  "expo-asset",
  ["expo-navigation-bar", { "position": "absolute", "visibility": "hidden" }],
  ["@reactvision/react-viro", { "android": { "xRMode": "AR" } }]
]
```

Preserved config (verified): `android.config.googleMaps.apiKey` present;
`android.package` = `com.sacli.wayfinder`; `android.permissions` array intact;
`extra.eas.projectId`; `owner`. `app.json` parses as valid JSON.

The only "plugin conflict" the plan flagged was the version peer-dep mismatch
(resolved in Step 1 by pinning 2.53.1); the plan confirms no other plugin
conflicts, and the `withApkName` custom plugin continues to run.

---

## Step 3 — `npx expo prebuild --clean`

### First run — exit 0 ("Finished prebuild") but with warnings

The prebuild completed but emitted repeated warnings:

- `withViro: ViroReact requires React Native New Architecture (Fabric) to be enabled. Please enable New Architecture in your app configuration. Add "newArchEnabled": true to your app.json/app.config.js expo configuration...`
- `withViroAndroid: ViroReact requires New Architecture to be enabled. Please add "newArchEnabled=true" to your android/gradle.properties file.`

### Diagnosis

`app.json` had no `newArchEnabled` field, so the ViroReact plugin's config-phase
check warned. The plan had assumed `newArchEnabled=true` was already present in
`android/gradle.properties`; it was in the pre-`--clean` android dir, but
`--clean` deletes and regenerates `android/` from `app.json`, which lacked the
flag.

### Fix applied

Added `"newArchEnabled": true` to the `expo` object in `app.json`, then re-ran
`npx expo prebuild --clean`.

### Second run — exit 0 ("Finished prebuild")

The repeated `withViro` (app.json) warnings are gone. One `withViroAndroid`
warning remains:

> `withViroAndroid: ViroReact requires New Architecture to be enabled. Please add "newArchEnabled=true" to your android/gradle.properties file.`

### Root cause of the remaining warning — benign false-positive

Inspected `node_modules/@reactvision/react-viro/dist/plugins/withViroAndroid.js`.
The `withViroProjectBuildGradle` mod checks
`modResults.contents.includes("newArchEnabled=true")` against the **root
`android/build.gradle`** file. The flag actually lives in
`android/gradle.properties` (line 38: `newArchEnabled=true`), not in
`build.gradle`, so the string check is always false and the warning always
fires. The real requirement IS met: `android/gradle.properties` line 38 =
`newArchEnabled=true`, and `MainApplication.kt` sets
`isNewArchEnabled = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED`. **No action
needed.**

### Confirmed the same mod's two risky string-replaces on the root build.gradle were no-ops

Read `android/build.gradle` and confirmed:

- AGP downgrade regex `/classpath\("com.android.tools.build:gradle.*/` requires
  a **double-quoted** `classpath("...")`. The generated root build.gradle uses
  **single quotes** — `classpath('com.android.tools.build:gradle')` — with no
  inline version (the version comes from the expo-root-project version
  catalog). No match → **AGP was NOT downgraded** (stays at the Expo default 8.x;
  a 4.1.1 downgrade would have broken the RN 0.81 build).
- `replace(/minSdkVersion.*/, 'minSdkVersion = 24')` — the root build.gradle
  contains no `minSdkVersion` line → **no-op**.

### Full second-run prebuild output

```
! Git branch has uncommitted file changes
› It's recommended to commit all changes before proceeding in case you want to revert generated changes.
Git status is dirty but the command will continue because the terminal is not interactive.
- Clearing android
✓ Cleared android code
- Creating native directory (./android)
✓ Created native directory
- Updating package.json
✓ Updated package.json | no changes
- Running prebuild
» android: userInterfaceStyle: Install expo-system-ui in your project to enable this feature.
- Running prebuild
» android: withViroAndroid: ViroReact requires New Architecture to be enabled. Please add "newArchEnabled=true" to your android/gradle.properties file.
- Running prebuild
✓ Finished prebuild
```

(The `userInterfaceStyle` line is a pre-existing, unrelated Expo hint, not an
error. The raw logs are saved alongside this file as `prebuild.log` (first run)
and `prebuild2.log` (final run).)

---

## Step 4 — Verify the generated native project

`android/` was generated. Path checks:

- `android/app/src/main/java` exists — **True** (contains `com/sacli/wayfinder/MainApplication.kt`).
- `android/app/build.gradle` exists — **True**.
- `android/build.gradle` exists — **True**.
- `android/settings.gradle` exists — **True**.

### ViroReact native integration present

- `android/settings.gradle`:
  `include ':react_viro', ':arcore_client', ':gvr_common', ':viro_renderer'`,
  each with `projectDir = new File('../node_modules/@reactvision/react-viro/android/<module>')`.
- `android/app/src/main/AndroidManifest.xml`:
  `<package android:name="com.google.ar.core"/>` and
  `<meta-data android:name="com.google.ar.core" android:value="optional"/>` (ARCore).
- `android/app/build.gradle` `dependencies {` block: ViroReact New-Arch deps
  (`:gvr_common`, `:arcore_client`, `:react_viro`, `:viro_renderer`,
  `androidx.media3:media3-exoplayer:*`, `com.google.protobuf.nano:protobuf-javanano`,
  `com.google.android.gms:play-services-location`) appended after
  `implementation("com.facebook.react:react-android")`.
- `MainApplication.kt`: `import com.viromedia.bridge.ReactViroPackage` added and
  `add(ReactViroPackage(ReactViroPackage.ViroPlatform.AR))` registered in
  `getPackages()` (matches our `android.xRMode: "AR"` config);
  `isNewArchEnabled = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED`.

### minSdkVersion

- `android/app/build.gradle` line 93: `minSdkVersion rootProject.ext.minSdkVersion`
  (resolves via the expo-root-project Gradle plugin's
  `setIfNotExist("minSdkVersion") { getVersionOrDefault("minSdk", "24") }`).
- No local override lowers it: no `minSdk` in `android/gradle.properties`, and
  `android/gradle/libs.versions.toml` does not exist.
- **Resolved value = 24**, which satisfies ViroReact's requirement (>= 24).
  **No change made.**

### withApkName (APK naming) — still works

`android/app/build.gradle` contains the plugin's canonical rename block
immediately before the `dependencies {` block:

```groovy
// Rename APK output to Wayfinder-release.apk
android.applicationVariants.all { variant ->
    variant.outputs.all { output ->
        outputFileName = "Wayfinder-${variant.buildType.name}.apk"
    }
}
```

Effect: release build →
`android/app/build/outputs/apk/release/Wayfinder-release.apk`; debug →
`Wayfinder-debug.apk` (consistent with `eas.json` preview profile's
`applicationArchivePath`). Confirmed working after `--clean`: the plugin
re-injected its block, and there is no duplicate because `--clean` regenerates
from scratch (the plugin's `gradle.includes('outputFileName = "Wayfinder-')`
guard also prevents double-injection on non-clean runs).

---

## Outcome

Steps 1–4 are complete:

- ViroReact pinned to `2.53.1` and installed (single hoisted React, no peer warnings).
- `app.json`: ViroReact config plugin added as the last `expo.plugins` entry in
  explicit AR-mode form, plus `"newArchEnabled": true`; all prior plugins, the
  Google Maps API key, and the `withApkName` custom plugin preserved.
- `npx expo prebuild --clean` regenerated `android/` (exit 0) with ARCore, all
  four react-viro native modules linked, `ReactViroPackage` registered for AR
  mode, New Architecture enabled, minSdkVersion = 24, and the withApkName
  APK-rename block intact.
- The single remaining `withViroAndroid` warning is a benign false-positive
  (the plugin checks the root `build.gradle` for a string that correctly lives
  in `gradle.properties`); the actual New-Arch requirement is met.

No blockers. Ready for the later step that integrates `ViroARNavScene` into
`ARScreen.js`.
