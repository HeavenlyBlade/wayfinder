# AR Screen crash fix — flatten layout and remove MapView

The crash on "Navigate Here" was caused by `ViroARSceneNavigator` being nested inside a sibling `<View style={s.cameraSection}>`. ViroReact requires the scene navigator to be the outermost view in the composition tree; nesting it breaks ARCore's surface attachment and causes an immediate process crash on Android. This change flattens the root layout: `ViroARNavScene` is promoted to the first child of the root `<View>` with `StyleSheet.absoluteFill`, all HUD elements become absolute overlays on top of it, and the bottom info panel (`mapSection`) is anchored absolutely at `bottom: 0`. The dead `MapView` / `react-native-maps` import is removed and replaced with a plain route overview panel. The `useCallback` import gap that would have caused a `ReferenceError` is also closed.

Watch for: (**confirmed**) HUD elements are now wrapped in a `hudOverlay` `<View>` rather than placed directly on the root View as the plan specifies — this is a deviation from the plan but is functionally sound and likely preferable. (**confirmed**) The plan's `miniMapReplace` style name was renamed to `routeOverviewPanel` in the implementation, which is a cosmetic divergence from the plan but not a defect. (**possible**) No build exit-code evidence was recorded in the commit message — only the commit subject — so the "exits 0" criterion from the plan cannot be confirmed from the artefacts alone.

**Verdict**: APPROVED

---

## High-level view

`ViroARNavScene` is now the first child of the root `View` and carries `style={StyleSheet.absoluteFill}`, satisfying the hard ViroReact constraint that caused the crash. The cameraSection wrapper is gone.

All six HUD elements (loading overlay, indoor banner, BearingHUD, distChip, calibratorWrap, back button) are absolute overlays. The implementation groups them inside a `hudOverlay` container (`absoluteFillObject`, `zIndex: 10`) rather than placing them directly as individual children of the root View. This is a minor structural deviation from the plan's JSX template but achieves the same stacking result and is arguably cleaner.

The `mapSection` is `position: absolute`, `bottom: 0`, `height: MAP_HEIGHT` — matching the plan exactly. `distChip` bottom is `MAP_HEIGHT + 24` and `calibratorWrap` bottom is `MAP_HEIGHT + 20`, both confirmed in the stylesheet.

`MapView`, `Polyline`, and `Marker` imports are removed. `miniMapRef` and the `animateToRegion` call are removed. `useCallback` is present in the React import. `routeCoords` state is retained (used in `totalDist` calculation). `ViroARNavScene.js` is untouched — the commit's stat shows only `ARScreen.js` changed.

The plan called for a `miniMapReplace` style with `miniMapDestName`, `miniMapDist`, `miniMapHint` children. The implementation instead introduces `routeOverviewPanel` / `routeOverviewTitle` / `routeOverviewDist` / `routeOverviewHint`. The rendered content is functionally equivalent — destination name, distance, a hint string — just with different style names and slightly different text labels.

---

<details>
<summary>Issues (2)</summary>

1. **No recorded build exit-code** — The plan requires `npx expo export --platform android --dev false` to exit 0 as verification evidence. The commit message records only the subject line; no build output or exit code is present. The fix is structurally correct and the import/JSX changes are consistent, but the verification step was not documented. Run and record `npx expo export --platform android --dev false` output before the next release cut.

2. **`hudOverlay` wrapper deviates from plan's direct-child structure** — The plan places all HUD elements as direct children of the root `View`. The implementation wraps them in `<View style={s.hudOverlay} pointerEvents="box-none">`. While functionally equivalent, the `pointerEvents="box-none"` on the container means touch events can pass through to children but the container itself won't intercept. Verify that `TouchableOpacity` elements inside (indoor banner dismiss, back button) still fire correctly — `box-none` on the parent is the right choice here, but it was not part of the reviewed plan and should be validated on device.

</details>

---

<details>
<summary>Details</summary>

### HUD wrapper vs. direct-child placement

The plan's JSX shows each HUD element (loading overlay, indoor banner, BearingHUD, distChip, calibratorWrap, back button) as a direct child of the root View. The implementation wraps all six in `<View style={s.hudOverlay} pointerEvents="box-none">`, where `hudOverlay` is `{ ...StyleSheet.absoluteFillObject, zIndex: 10 }`. The `pointerEvents="box-none"` on the container lets touches reach the AR scene through transparent regions while still routing taps to the interactive HUD children — this is the correct React Native pattern for a transparent full-screen overlay. It was not in the plan. Confirm on device that the indoor banner's dismiss `TouchableOpacity` and the back button register taps correctly; on some Android versions `box-none` propagation through a `zIndex`-elevated view has historically been unreliable.

</details>

---

<details>
<summary>File map</summary>

| File | Change |
|---|---|
| `src/screens/ARScreen.js` | Flatten layout: promote ViroARNavScene to first child, wrap HUD in absoluteFill overlay, replace MapView with route panel, update styles, remove react-native-maps imports and miniMapRef |
| `src/components/ViroARNavScene.js` | Unchanged |

Full diff: `git show 54b3ff8`

</details>
