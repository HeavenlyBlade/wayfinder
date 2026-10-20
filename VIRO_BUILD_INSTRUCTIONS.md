# Wayfinder — ViroReact AR Build Instructions

## What changed

The app is now in **Expo bare workflow** after running `npx expo prebuild --clean`.
The `android/` folder is generated (gitignored) and must be regenerated after a clean checkout.

ViroReact (`@reactvision/react-viro@2.53.1`) replaces the old camera + SVG arrow.
The AR screen now uses **ARCore plane detection** — the camera scans the floor,
the user taps a detected surface, and a 3D green arrow + orb trail appear on that surface.

---

## How to build

### Option A — EAS Build (recommended, no local Android SDK required)

```bash
# APK for sideloading / testing
eas build --platform android --profile preview

# Production AAB for Play Store
eas build --platform android --profile production
```

EAS runs in the cloud with the correct Java 17/21 environment.
Your Java 25 (local) is **incompatible** with Gradle 8.x — do not use local Gradle builds.

### Option B — Local build (requires Java 17 or 21)

If you install Java 21 (Temurin 21 from adoptium.net) and set `JAVA_HOME`:

```bash
# Regenerate android/ if not present
npx expo prebuild --clean

# Build APK
cd android
.\gradlew.bat assembleRelease
# Output: android/app/build/outputs/apk/release/Wayfinder-release.apk
```

### Option C — expo run:android (installs directly to connected device)

```bash
# Device must be connected via USB with ADB enabled
npx expo run:android
```

---

## Expo Go is no longer supported

ViroReact requires native ARCore libraries that are not in Expo Go.
Use a production APK (EAS preview build) or `expo run:android` with a dev client.

---

## AR feature — on-device notes

- AR requires a **real Android device** with ARCore support. Emulators do not work.
- On first launch of the AR screen, point the camera at a textured floor and slowly
  move the phone. A grid overlay will appear indicating detected surfaces.
- **Tap the grid** to place the navigation arrow on the ground.
- The green arrow rotates to point toward the next waypoint.
- Green orbs mark the waypoints ahead along the route.
- If the arrow points the wrong way (opposite to the route), open `ViroARNavScene.js`
  and change `rotation={[0, angleDiff, 0]}` to `rotation={[0, -angleDiff, 0]}` —
  this is a one-time sign calibration that depends on device handedness.

---

## Regenerating android/ after a clean checkout

```bash
npm install
npx expo prebuild --clean
```

The `@reactvision/react-viro` config plugin automatically:
- Adds ARCore to AndroidManifest.xml
- Links all four Viro native modules (react_viro, arcore_client, gvr_common, viro_renderer)
- Registers `ReactViroPackage` in MainApplication.kt
- Sets up the VR/AR activity

No manual native file editing is needed.
