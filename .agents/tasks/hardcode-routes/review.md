# Review — Hardcode all campus routes + fix AR arrow

Worktree: `c:/Users/Asus/WAYFINDER-FULLPACKAGE/wayfinder`
Commit: `6a0a6ea` — "feat: hardcode all campus routes (bypass A* fallback), fix AR arrow to upright pin shape"
Files in commit (exactly the three in scope): `src/constants/hardcodedRoutes.js` (new, +548), `src/services/api.js` (+8), `src/components/ViroARNavScene.js`.

## Recorded build evidence (read from the commit message, not re-run)

```
Verify: npx expo export --platform android (from wayfinder/) -> exit 0; last lines:
_expo/static/js/android/index-7f79e06f85526f3948e594316ded687a.hbc (3.45 MB)
metadata.json (2.26 kB)
Exported: dist
EXIT_CODE=0
```
Build exits 0. No re-run performed.

## 1. hardcodedRoutes.js — all 19 destinations + coordinates vs campusGraph.js NODES

`HARDCODED_ROUTES` exports all 19 keys: `main_building, ea_tower, canteen, ibed, sr_building, chapel, kindergarten, gymnasium, kitchen_hall, canteen_two, engineering, new_building, ccss, parking_lot, motorcycle_parking, ea_tower_2, ibed_2, sr_building_2, main_building_2`. `getHardcodedRoute(destinationId)` returns `HARDCODED_ROUTES[destinationId] ?? null`. ES module style matches `campusGraph.js`.

Every route's `{lat,lng}` was checked against `src/constants/campusGraph.js` `NODES`. All match verbatim, including the noted co-locations (`ccss` == `R30` = `13.961008, 121.612466`). Node counts match the plan (the perimeter run `R01..R15` skips `R06`, so it is 14 nodes):

| # | destination | nodes | plan |
|---|-------------|------:|------|
| 1 | main_building | 21 | 21 |
| 2 | ea_tower | 27 | 27 |
| 3 | canteen | 27 | 27 |
| 4 | ibed | 20 | 20 |
| 5 | sr_building | 20 | 20 |
| 6 | chapel | 19 | 19 |
| 7 | kindergarten | 19 | 19 |
| 8 | gymnasium | 35 | 35 |
| 9 | kitchen_hall | 33 | 33 |
| 10 | canteen_two | 25 | 25 |
| 11 | engineering | 28 | 28 |
| 12 | new_building | 16 | 16 |
| 13 | ccss | 27 | 27 |
| 14 | parking_lot | 20 | 20 |
| 15 | motorcycle_parking | 2 | 2 |
| 16 | ea_tower_2 | 30 | 30 |
| 17 | ibed_2 | 23 | 23 |
| 18 | sr_building_2 | 23 | 23 |
| 19 | main_building_2 | 31 | 31 |

Order is correct (first element = `gate`, last = destination; no U-turn/backtrack sequences introduced). No missing or invented nodes.

## 2. api.js — fetchRoute checks hardcoded first

`import { getHardcodedRoute } from '../constants/hardcodedRoutes';` (correct path: `src/services/` -> `src/constants/`). `fetchRoute` runs `const hardcoded = getHardcodedRoute(destinationId); if (hardcoded) return hardcoded;` as its first statements, before the `try { fetchWithTimeout(...) }`. The backend POST and its `catch -> return []` fallback are preserved, so unknown destinations still hit the backend and ARScreen's A*/straight-line fallbacks remain. `fetchRoute` stays `async`, so a synchronous array return still resolves through `await` correctly.

Reachable-correctness check on the shared reference (hardcoded returns the same persistent array per call, unlike a fresh backend array per call): traced every use of the returned array in `src/screens/ARScreen.js` `loadRoute`. `buildOrbTrail` is read-only (builds a fresh `orbs` array); `waypointsRef.current` is only reassigned, never read or in-place mutated; `orbTrailRef.current` is only reassigned via `= buildOrbTrail(...)` and `= .slice(1)` (fresh arrays); no `.push/.splice/.sort/.reverse` or index writes touch the shared array. The fallback reassignments are skipped for non-empty hardcoded routes. The shared reference is therefore never mutated — no data-corruption path is reachable.

## 3. ViroARNavScene.js — upright pin

- `-15` X-tilt removed: `rotation={[0, angleDiff ?? 0, 0]}` (no X component).
- `arrowBob` gone; `arrowPulse` registered (scale 1.0 => 1.08 => 1.0, EaseInOut, 1200ms, loop) and applied via `animation={{ name: "arrowPulse", run: true, loop: true }}`.
- Upright pin: shaft `ViroBox` (0.08 x 0.6 x 0.08) at `[0,0,0]` + head `ViroBox` (0.28 x 0.08 x 0.28) at `[0, 0.36, 0]` with `rotation={[0, 0, 45]}`. ViroBox-only constraint honored (no ViroCylinder/ViroCone).
- Direction of travel: parent `ViroNode` rotates about Y by `angleDiff`. Unchanged caller `ARScreen.js` passes `angleDiff={nextAngle}` into `<ViroARNavScene>` (line 273), and `nextAngle` is the compass bearing to the next orb minus heading. Wiring intact.
- Ground ring moved to `position={[0, 0.005, -2.5]}` (Z aligned under the pin); `isTracking` gate and "Initializing AR..." text preserved. The unused `waypoints/userLocation/heading` props passed by ARScreen are harmlessly ignored (the new NavScene only consumes `angleDiff`, as the plan specifies).

## 4. Build green

Per the recorded commit evidence above: `npx expo export --platform android` -> `EXIT_CODE=0`, `Exported: dist`. Not re-run.

## Verdict

No blocking findings. All four required checks pass: correct/complete coordinates (no wrong/missing/invented nodes), `fetchRoute` uses hardcoded routes first with backend fallback, the AR arrow is an upright pin (no flat shape, no -15 tilt, scale pulse, Y rotation via angleDiff), and the recorded build is green.
