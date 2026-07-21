# WAYFINDER — Developer Notes

AR campus navigation app for St. Anne College Lucena Inc. (SACLI).
React Native + Expo (frontend), FastAPI + PostgreSQL on Supabase (backend).

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React Native 0.81.5, Expo 54, React Navigation (Stack) |
| AR / 3D | expo-camera (CameraView), expo-gl, Three.js, expo-sensors (Magnetometer) |
| Backend | FastAPI (Python), deployed on Vercel |
| Database | PostgreSQL via Supabase free tier (pooler connection) |
| Voice AI | Groq API — Whisper Large v3 (STT) + LLaMA 3.1 8B (intent parsing) |
| Pathfinding | A* — runs on backend (server-side) and on-device (offline fallback) |
| Sensors | expo-location, expo-sensors, expo-audio |

---

## Project Structure

```
WAYFINDER-FULLPACKAGE/
├── wayfinder/                      ← React Native app (Expo)
│   ├── App.js                      ← Root navigator + SettingsProvider wrapper
│   ├── DEVNOTES.md                 ← This file
│   └── src/
│       ├── screens/
│       │   ├── SplashScreen.js     ← Animated 3s intro
│       │   ├── OnboardingScreen.js ← 3-step intro carousel (shown once)
│       │   ├── HomeScreen.js       ← Quick destinations + search entry
│       │   ├── MapScreen.js        ← SVG campus map, voice mic, building cards
│       │   ├── ARScreen.js         ← Live camera + 3D orb trail navigation
│       │   ├── SettingsScreen.js   ← 4 user toggles + current status display
│       │   ├── AboutScreen.js      ← App info, tech stack, developer credits
│       │   └── SurveyScreen.js     ← DEV TOOL: GPS coordinate collection
│       ├── components/
│       │   ├── CampusMapSVG.js     ← Fully offline SVG map with building polygons
│       │   ├── BuildingCard.js     ← Building info card, navigate button, floor trigger
│       │   ├── FloorBrowser.js     ← Bottom sheet: floor tabs + scrollable room list
│       │   ├── BottomPanel.js      ← Draggable panel: explore / route / about tabs
│       │   ├── SearchModal.js      ← Full-screen search by name, room, facility
│       │   ├── StatusChips.js      ← GPS / AI / AR animated status indicators
│       │   ├── BuildingIcon.js     ← Icon renderer keyed by building.icon string
│       │   ├── SearchBar.js        ← (unused — kept for reference)
│       │   └── icons/index.js      ← All SVG icon components
│       ├── hooks/
│       │   ├── useVoiceCommand.js  ← Full voice pipeline (online AI + offline fallback)
│       │   └── useLocation.js      ← GPS position + north-referenced compass heading
│       ├── context/
│       │   └── SettingsContext.js  ← Global settings, persisted via AsyncStorage
│       ├── services/
│       │   └── api.js              ← Backend fetch calls (all with timeout + res.ok check)
│       ├── utils/
│       │   ├── pathfinding.js      ← A* search, nearestNode, getWaypoints
│       │   ├── arMath.js           ← GPS → screen projection, Haversine distance
│       │   ├── gpsToSvg.js         ← GPS → SVG coordinate mapping
│       │   ├── offlineVoice.js     ← Keyword-based building intent matcher
│       │   └── networkStatus.js    ← Internet connectivity check (pings /health)
│       └── constants/
│           ├── api.js              ← API_BASE URL (single source of truth)
│           ├── buildings.js        ← All building data, floors, rooms, QUICK_DESTINATIONS
│           ├── campusGraph.js      ← NODES + EDGES for local A* (see GPS Survey section)
│           └── theme.js            ← colors, radius, fonts design tokens
│
└── wayfinder-backend/              ← FastAPI backend
    ├── main.py                     ← App entry, CORS, router registration
    ├── database.py                 ← SQLAlchemy engine, get_db() session
    ├── models.py                   ← CampusNode, CampusEdge, Building ORM models
    ├── seed.py                     ← Populates all three DB tables from hardcoded data
    ├── routers/
    │   ├── navigation.py           ← GET /buildings, POST /route
    │   └── voice.py                ← POST /voice/command
    └── utils/
        └── groq_ai.py              ← transcribe_audio() + parse_navigation_intent()
```

---

## Environment Variables

**Backend** (`wayfinder-backend/.env`):
```
GROQ_API_KEY=...        # Get from console.groq.com
DATABASE_URL=postgresql://...  # Supabase session pooler string
APP_HOST=0.0.0.0
APP_PORT=8000
```

**Frontend** (`src/constants/api.js`):
```js
export const API_BASE = "https://wayfinder-backend-woad.vercel.app";
```
Swap to `http://<your-local-IP>:8000` to test against a local backend instance.

---

## Backend API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | `{"status":"ok"}` — pinged by frontend to check connectivity |
| GET | `/navigation/buildings` | Returns all 15 buildings as JSON array |
| POST | `/navigation/route` | Server-side A* — returns ordered waypoints |
| POST | `/voice/command` | Audio file → Whisper STT → LLaMA intent → destination_id |

**Route request body:**
```json
{ "user_lat": 13.961, "user_lng": 121.612, "destination_id": "main_building" }
```
**Route response:**
```json
{ "start": "junction_s", "destination": "main_building", "waypoints": [...], "node_count": 4 }
```
**Voice response:**
```json
{ "transcript": "...", "destination_id": "main_building", "confidence": 0.95, "reply": "..." }
```

---

## Database (Supabase)

- **Provider:** Supabase free tier
- **Tables:** `campus_nodes`, `campus_edges`, `buildings`
- **RLS:** Disabled — intentional, public navigation data
- **Current data:** 21 nodes, 17 edges, 15 buildings
- **⚠️ Supabase pauses after 7 days of inactivity.** Restore at supabase.com/dashboard, then re-seed.

**Re-seed after restore:**
```bash
cd wayfinder-backend
.\venv\Scripts\python.exe seed.py   # Windows
# or
python seed.py                      # if venv is activated
```

---

## Settings

Stored in AsyncStorage under key `wayfinder_settings`.

| Key | Default | What it does |
|-----|---------|-------------|
| `arMode` | `true` | Launch AR camera when navigating; if OFF shows 2D map route only |
| `gpsTracking` | `true` | Show live blue dot on SVG map |
| `voiceCommands` | `true` | Enable microphone button on MapScreen |
| `offlineMode` | `false` | OFF = auto-detect internet; ON = always use offline keyword matcher |

---

## Voice Pipeline

```
User taps mic → expo-audio records M4A
    ↓
settings.offlineMode == true?
    ├── YES → offline keyword matcher immediately
    └── NO  → checkInternetConnection() [3s timeout to /health]
                  ├── online  → POST /voice/command (Whisper STT + LLaMA)
                  └── offline → offline keyword matcher
```

**Online path:** Audio uploaded → Whisper transcribes → LLaMA extracts `destination_id` + reply  
**Offline path:** `offlineVoice.js` scores transcript against building names, aliases, facilities  
**Fallback message:** "📡 Offline mode — type in the search bar to find a building."

**Status chip states (MapScreen):**
- `AI Online` (blue) — internet detected, using Groq
- `No Internet` (yellow) — auto-detected offline, using keyword matcher
- `Offline Mode` (yellow) — user forced offline in Settings

---

## AR Navigation

Flow: `MapScreen → navigate("AR", { destinationId })` → `ARScreen`

1. Waits for GPS lock
2. Fetches route from backend → falls back to on-device A* → falls back to straight line to destination
3. Interpolates waypoints into orbs every 7 metres (`buildOrbTrail`)
4. Projects each orb from GPS → screen coordinates using compass heading + 65° H-FOV (`arMath.js`)
5. Orbs consumed as user walks within 3m; re-route triggered if user drifts >40m
6. Arrival at 6m from destination node
7. **Visual-only** — no TTS in AR screen

---

## 🚧 GPS Survey — CRITICAL PENDING TASK

**This is the main blocker before the app can navigate accurately on campus.**

### What needs to be surveyed

The junction nodes in `campusGraph.js` are **estimated placeholder coordinates**, not real GPS readings. Until you walk the campus with the Survey Tool and record the real junction positions, the A* pathfinding will produce slightly wrong routes and AR orbs will appear offset from the actual footpaths.

**Nodes that need real GPS (all marked as approximate):**

| Node ID | Description | Current coords (approximate) |
|---------|-------------|-------------------------------|
| `entrance` | Path just inside the gate | 13.96094, 121.6113 |
| `junction_s` | South path junction | 13.9612, 121.6118 |
| `junction_c` | Central junction | 13.9614, 121.612 |
| `junction_n` | North junction | 13.9619, 121.6123 |
| `junction_nw` | Northwest junction | 13.962, 121.6121 |
| `junction_ne` | Northeast junction | 13.962, 121.6127 |
| `junction_cw` | Central-west junction | 13.9615, 121.6119 |
| `junction_ce` | Central-east junction | 13.9615, 121.6125 |

**Building nodes that also need verification:**

| Node ID | Notes |
|---------|-------|
| `chapel` | Coordinates in `buildings.js` and `seed.py` use lat ~13.932 — clearly wrong |
| `kindergarten` | Same issue — lat ~13.932 instead of ~13.961 |

### How to do the survey

1. **Open the app** → Settings → DEV TOOLS → GPS Survey Tool
2. **Walk to each junction** — stand at the centre of the footpath intersection
3. **Wait for green lock** (accuracy ≤ 5m, ideally ≤ 3m)
4. **Tap the quick-save button** for that point (Junction, Corner NW, etc.)
5. At the end, tap **Copy JSON** to copy all points
6. **Update two files** with the real coordinates:

**`src/constants/campusGraph.js`** — update the `NODES` section:
```js
entrance:    { id: 'entrance',    lat: <REAL>,  lng: <REAL>  },
junction_s:  { id: 'junction_s',  lat: <REAL>,  lng: <REAL>  },
// ... etc
```

**`wayfinder-backend/seed.py`** — update the matching entries in `NODES`:
```python
{"id": "entrance",   "name": "Entrance",  "lat": <REAL>, "lng": <REAL>, "category": "junction"},
{"id": "junction_s", "name": "Junction S","lat": <REAL>, "lng": <REAL>, "category": "junction"},
# ... etc
```

Then re-seed the database:
```bash
cd wayfinder-backend
python seed.py
```

### Survey checklist

- [ ] `entrance` — just inside the main gate
- [ ] `junction_s` — south path split
- [ ] `junction_c` — central crossroads
- [ ] `junction_n` — north path split
- [ ] `junction_nw` — northwest branch
- [ ] `junction_ne` — northeast branch
- [ ] `junction_cw` — central-west branch
- [ ] `junction_ce` — central-east branch
- [ ] `chapel` — fix wrong coordinates
- [ ] `kindergarten` — fix wrong coordinates

---

## How to Run Locally

### Backend:
```bash
cd wayfinder-backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend:
```bash
cd wayfinder

npm run web              # Browser (UI only, no camera/GPS)
npm start                # Expo Go via QR code (limited native)
npx expo run:android     # Full build on connected device (all features)
npm start --dev-client   # Hot reload after dev build is installed
```

---

## Current Status

### ✅ Done
- All 8 screens built and functional
- Offline SVG campus map with building polygons and route overlay
- AR orb trail (camera + GPS + compass) with 3-level fallback chain
- Voice commands — Groq AI online path + offline keyword matcher
- Offline mode toggle with automatic internet detection
- A* pathfinding — server-side and on-device
- Floor Browser — bottom sheet with floor tabs and room list
- 27 bugs fixed (crashes, animation leaks, stale closures, wrong compass, API timeouts)
- Backend live on Vercel, database live on Supabase
- EAS build config ready (development, preview, production profiles)

### 🚧 Pending — Must Do Before Real Use
1. **GPS survey of all 8 junction nodes** ← main blocker for accurate navigation
2. **Fix chapel + kindergarten coordinates** (lat is ~13.932, should be ~13.961)
3. **Commit and push** — 18 files changed, not yet pushed to remote
   ```bash
   git add .
   git commit -m "fix: 27 bugs, FloorBrowser, offline mode, API timeouts"
   git push origin main
   ```

### 🔜 Nice to Have
- Turn-by-turn voice announcements in AR using `expo-speech`
- Production APK build → `eas build --profile production --platform android`
- Campus distribution (Google Drive link or Play Store)
- Fix `SearchBar.js` — file exists but is unused dead code

---

## Key Design Decisions

- **Offline-first map:** SVG map works with zero internet. Internet only improves voice accuracy.
- **3-level route fallback:** Backend A* → on-device A* → straight line. User always gets navigation.
- **No auth:** Public campus navigation data. All students use it immediately without login.
- **Vercel backend:** Free serverless tier, zero maintenance, adequate for campus-scale traffic.
- **Supabase free tier:** Fine for this scale. 7-day pause policy — just restore when needed.
- **expo-dev-client bundled:** Enables full native feature testing without EAS cloud builds.
