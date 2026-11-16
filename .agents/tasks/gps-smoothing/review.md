# GPS Smoothing / Warm-up Gate / Quality Chip — Code Review

**Commit:** feat: GPS smoothing, warm-up gate, and quality chip  
**Build evidence:** `npx expo export --platform android` — exit 0, 1204 modules bundled  
**Verdict:** APPROVED

---

## Requirement-by-requirement evidence

### Req 1 — Rolling 5-fix weighted-average GPS smoothing
`useLocation.js` exports a module-level `smoothedPosition(buffer)` that sums `1/accuracy` weights, then divides each coordinate sum by the total weight — a correct normalized weighted average. `GPS_BUFFER_SIZE = 5`; the buffer is shifted when it exceeds five entries. Both the `getCurrentPositionAsync` path (line ~99) and the `watchPositionAsync` callback (line ~126) push to `gpsBufRef.current` and call `smoothedPosition` before calling `setLocation`. Heading/magnetometer/gyroscope/accelerometer code is untouched. ✅

### Req 2 — gpsReady / gpsWarning
Both state values start `false`. A `useEffect([], [])` schedules a 12-second `setTimeout`; when it fires it checks `gpsReadyRef.current` (prevents double-set) then sets `gpsReady=true` and `gpsWarning=true`. The first GPS fix with `acc <= 15` clears the timer and sets `gpsReady=true` while leaving `gpsWarning` unchanged (`false`). `gpsReady` is returned from the hook. ✅

### Req 3 — gpsQuality string
Quality is set after every accepted fix: `acc <= 10 → 'good'`, `acc <= 20 → 'fair'`, else `'poor'`. Uses the raw (unsmoothed) accuracy value from each fix, not the averaged position. Applied in both fix paths. ✅

### Req 4 — ARScreen loading gate, dismissible banner, single quality chip
- `isLoading = !gpsReady || !location || !routeReady` (line 320). ✅  
- Banner: `gpsWarning && !gpsWarnDismissed && !isLoading && !arrived` (line 363). Dismisses via `setGpsWarnDismissed(true)`. ✅  
- Single `<StatusChips quality={gpsQuality} lang={lang} />` GPS quality chip (lines 377–382). No additional chip components added. ✅

### Req 5 — MapScreen passes gpsQuality
`gpsQuality` destructured from `useLocation()` at line ~139. Passed as `<StatusChips quality={gpsQuality} lang={lang} />` at line ~247. ✅

### Req 6 — StatusChips quality-aware with fallback
Accepts `{ quality, lang }` props. Color resolves to green/amber/red for good/fair/poor, or `colors.primary` when quality is undefined/null. Label resolves via `t(\`gps.quality.${quality}\`, lang)` when quality is truthy, or `'GPS Active'` as fallback. ✅

### Req 7 — i18n keys in both locales

| Key | en | fil |
|---|---|---|
| `gps.weakSignal` | 'GPS signal is weak — navigation may be less accurate' | 'Mahina ang GPS signal — maaaring hindi tumpak ang navigasyon' |
| `gps.quality.good` | 'GPS Good' | 'GPS Mahusay' |
| `gps.quality.fair` | 'GPS Fair' | 'GPS Katamtaman' |
| `gps.quality.poor` | 'GPS Poor' | 'GPS Mahina' |

All 4 keys present in both `en` and `fil` sections with exact specified values. ✅

### Req 8 — Hard constants unchanged
Confirmed byte-for-byte in `ARScreen.js`:
- `const ORB_ADVANCE_DIST   = 4;` ✅  
- `const ARRIVAL_DIST        = 20;` ✅  
- `const ARRIVAL_CONFIRMATIONS = 3;` ✅  
- `const GPS_ACCURACY_FILTER  = 25;` ✅  

Confirmed in `useLocation.js`:
- `if (pos.coords.accuracy > 25) return;` ✅

### Req 9 — No forbidden Viro/material props
Grep across all JS files finds `ViroCylinder`, `ViroCone`, `ViroPolygon`, `specularColor`, `shininess` only in comments inside `ViroARNavScene.js` (unchanged, pre-existing). None in any changed file. ✅

### Req 10 — No variable arithmetic inside StyleSheet.create()
The new `gpsWarnBanner` style contains `Platform.OS === "android" ? 130 : 100` — a static ternary between two literal numbers, not arithmetic involving a variable. The same pattern (`Platform.OS === "android" ? 90 : 60`, etc.) was present in `indoorBanner`, `hudTop`, and `backBtn` before this diff. No variable arithmetic introduced. ✅

---

## Blockers

None.
