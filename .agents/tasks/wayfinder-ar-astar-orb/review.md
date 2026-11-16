# Review — wayfinder-ar-astar-orb

**Commit:** `0b2efb6` — "feat: always use A* for route start; GPS-driven orb trail in AR scene"  
**Files reviewed:** `src/screens/ARScreen.js`, `src/components/ViroARNavScene.js`  
**Build evidence:** `npx expo export --platform android` exited 0, 1204 modules bundled, no errors (recorded in commit message).

---

## Checklist

### 1. ARScreen.js — loadRoute
- `fetchRoute` import removed (line 21 deleted in diff). `grep fetchRoute` across the full `src/` tree returns no matches. ✓  
- `loadRoute` now calls only `nearestNode` → `aStar` → `getWaypoints` (ARScreen.js lines 136–139). ✓  
- Straight-line fallback via `NODES[destinationId]` is present (lines 141–145). ✓

### 2. ARScreen.js — orb-advance loop
- `while` loop uses `orbTrailRef.current.shift()` (line 219). ✓  
- `advanced` flag is set on each shift; `setOrbVersion(v => v + 1)` is called after the loop when `advanced` is true (lines 211, 221). ✓  
- `orbVersion` state declared at the top of the component: `const [orbVersion, setOrbVersion] = useState(0)` (line 85). ✓

### 3. ARScreen.js — ViroARNavScene JSX
- `waypoints={orbTrailRef.current.slice(0, 5)}` and `userLocation={location}` props passed (lines ~294–298). ✓

### 4. ViroARNavScene.js — materials
- Four materials defined: `orbSolid`, `orbGlow`, `destSolid`, `destGlow` (lines 27–32). ✓  
- No `specularColor` or `shininess` in any material definition. ✓

### 5. ViroARNavScene.js — no banned components
- `grep ViroCylinder|ViroCone|ViroPolygon` returns no matches. ✓  
- Neither the diff nor the current file contains any of these components. ✓

### 6. ViroARNavScene.js — GPS orb rendering
- `waypoints` and `userLocation` props accepted by `NavScene` and by the default export (lines 68, 173). ✓  
- `waypointToARPos` converts GPS → AR using `bearingTo` / `distanceTo` from `arMath` (lines 56–70). ✓  
- Distance clamped: `Math.min(dist, 8)` (line 62). ✓  
- Only the first 3 waypoints rendered: `(waypoints || []).slice(0, 3)` (line 101). ✓  
- Destination orb uses `destSolid`/`destGlow` (yellow `#FFD600`) and larger radii (0.16/0.24 vs 0.12/0.18) (lines 109–113). ✓  
- `ViroARSceneNavigator` is the root view of the default export (lines 173–180). ✓

### 7. ViroARNavScene.js — tracking
- `TRACKING_NORMAL = 3` and `TRACKING_LIMITED = 2` defined as numeric constants (lines 54–55). ✓  
- `handleTrackingUpdated` compares `state === TRACKING_NORMAL || state === TRACKING_LIMITED` — no `ViroTrackingStateConstants` reference. `ViroTrackingStateConstants` removed from the import list. ✓

---

## Blockers

None.

---

## Verdict

**APPROVED** — all seven requirement areas pass. No new correctness, security, or data failures introduced. Build evidence recorded.
