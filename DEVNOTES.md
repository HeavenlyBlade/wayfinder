# WAYFINDER — Developer Notes

AR campus navigation app for St. Anne College Lucena Inc. (SACLI).
React Native + Expo (frontend), FastAPI + PostgreSQL on Supabase (backend).

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React Native 0.81.5, Expo 54, React Navigation (Stack) |
| AR | expo-camera (CameraView), expo-sensors (Magnetometer), SVG arrow (react-native-svg) |
| Backend | FastAPI (Python), deployed on Vercel |
| Database | PostgreSQL via Supabase free tier (pooler connection) |
| Pathfinding | A* — runs on backend (server-side) and on-device (offline fallback) |
| Sensors | expo-location, expo-sensors, expo-audio |

**Note:** No Three.js or expo-gl are used. The AR "3D" arrow is a perspective-illusion built with SVG polygons in react-native-svg.

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
│       │   ├── HomeScreen.js       ← Quick destinations + search entry
│       │   ├── MapScreen.js        ← Google satellite map, building cards, route overlay
│       │   ├── ARScreen.js         ← Live camera + SVG 3D arrow navigation
│       │   ├── SettingsScreen.js   ← Language picker + dev tools (tutorial reset, survey)
│       │   ├── AboutScreen.js      ← App info, tech stack, developer credits
│       │   └── SurveyScreen.js     ← DEV TOOL: GPS coordinate collection
│       ├── components/
│       │   ├── BuildingCard.js     ← Building info card, navigate button, floor trigger
│       │   ├── FloorBrowser.js     ← Bottom sheet: floor tabs + scrollable room list
│       │   ├── BottomPanel.js      ← Draggable panel: explore / route / about tabs
│       │   ├── SearchModal.js      ← Full-screen search by name, room, facility
│       │   ├── StatusChips.js      ← GPS status indicator chip
│       │   ├── BuildingIcon.js     ← Icon renderer keyed by building.icon string
│       │   └── icons/index.js      ← All SVG icon components
│       ├── hooks/
│       │   └── useLocation.js      ← GPS position + north-referenced compass heading
│       ├── context/
│       │   └── SettingsContext.js  ← Global settings (language only), persisted via AsyncStorage
│       ├── services/
│       │   └── api.js              ← Backend fetch calls (all with timeout + res.ok check)
│       ├── utils/
│       │   ├── pathfinding.js      ← A* search, nearestNode, getWaypoints
│       │   ├── arMath.js           ← GPS → screen projection, Haversine distance
│       │   ├── gpsToSvg.js         ← GPS → SVG coordinate mapping
│       │   ├── offlineVoice.js     ← Building alias/keyword table (kept for future use)
│       │   ├── indoorDetection.js  ← Indoor building detection
│       │   └── networkStatus.js    ← Internet connectivity check (pings /health)
│       └── constants/
│           ├── api.js              ← API_BASE URL (single source of truth)
│           ├── buildings.js        ← All building data, floors, rooms, QUICK_DESTINATIONS
│           ├── campusGraph.js      ← NODES + EDGES for local A* (see GPS Survey section)
│           ├── i18n.js             ← English / Filipino translations
│           └── theme.js            ← colors, radius, fonts design tokens
│
└── wayfinder-backend/              ← FastAPI backend
    ├── main.py                     ← App entry, CORS, router registration
    ├── database.py                 ← SQLAlchemy engine, get_db() session
    ├── models.py                   ← CampusNode, CampusEdge, Building ORM models
    ├── seed.py                     ← Populates all three DB tables from hardcoded data
    ├── SECURITY_ACTION_REQUIRED.md ← Action items for rotating leaked secrets
    ├── routers/
    │   ├── navigation.py           ← GET /buildings, POST /route
    │   └── voice.py                ← POST /voice/command (rate-limited, size-checked)
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
| GET | `/navigation/buildings` | Returns all buildings as JSON array |
| POST | `/navigation/route` | Server-side A* — returns ordered waypoints |
| POST | `/voice/command` | Audio → Whisper STT → LLaMA intent → destination_id |

**Route request body:**
```json
{ "user_lat": 13.961, "user_lng": 121.612, "destination_id": "main_building" }
```
**Route response:**
```json
{ "start": "J1", "destination": "main_building", "waypoints": [...], "node_count": 4 }
```
**Voice command:**
```
POST /voice/command?language=fil   (language param optional — omit for auto-detect)
Body: multipart/form-data, field "audio", content-type audio/*
```
**Voice response:**
```json
{ "transcript": "...", "destination_id": "main_building", "confidence": 0.95, "reply": "..." }
```

The voice endpoint is rate-limited to 10 requests per 60 seconds per IP and rejects audio larger than 10 MB.

---

## Database (Supabase)

- **Provider:** Supabase free tier
- **Tables:** `campus_nodes`, `campus_edges`, `buildings`
- **RLS:** Disabled — intentional, public navigation data
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
| `language` | `"en"` | UI language: `"en"` (English) or `"fil"` (Filipino) |

The app previously had 4 additional toggles (`arMode`, `gpsTracking`, `voiceCommands`, `offlineMode`) — these were removed because the features they controlled were not fully implemented. Navigation always uses AR mode; GPS tracking is always on; voice commands are not available in the current build.

---

## AR Navigation

Flow: `MapScreen → navigate("AR", { destinationId })` → `ARScreen`

1. Waits for GPS lock
2. Fetches route from backend → falls back to on-device A* → falls back to straight line to destination
3. Interpolates waypoints into orbs every 6 metres (`buildOrbTrail`)
4. Projects each orb from GPS → screen coordinates using compass heading + 65° H-FOV (`arMath.js`)
5. Orbs consumed as user walks within 4 m; re-route triggered if user drifts >40 m
6. Arrival at 12 m from destination node
7. **Visual-only** — no TTS

**Compass offset:** A hardcoded `DEFAULT_COMPASS_OFFSET = -260` (calibrated at SACLI campus) is applied to the magnetometer reading. This value is location-specific. Use the compass calibrator in the AR screen to fine-tune if direction accuracy feels off.

---

## 🚧 GPS Survey — CRITICAL PENDING TASK

**This is the main blocker before the app can navigate accurately on campus.**

The junction nodes in `campusGraph.js` are estimated placeholder coordinates. Walk the campus with the Survey Tool and record real junction positions so A* routes and AR orbs align with actual footpaths.

### How to do the survey

1. **Open the app** → Settings → DEV TOOLS → GPS Survey Tool
2. **Walk to each junction** — stand at the centre of the footpath intersection
3. **Wait for green lock** (accuracy ≤ 5 m, ideally ≤ 3 m)
4. **Tap the quick-save button** for that point
5. At the end, tap **Copy JSON** to copy all points
6. **Update two files** with the real coordinates:

**`src/constants/campusGraph.js`** — update the `NODES` section  
**`wayfinder-backend/seed.py`** — update the matching entries, then re-seed

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

## Security Notes

See `wayfinder-backend/SECURITY_ACTION_REQUIRED.md` for steps to rotate the Groq API key and Supabase DATABASE_URL that were previously committed to git history.

---

## Key Design Decisions

- **3-level route fallback:** Backend A* → on-device A* → straight line. User always gets navigation.
- **No auth:** Public campus navigation data. All students use it immediately without login.
- **Vercel backend:** Free serverless tier, zero maintenance, adequate for campus-scale traffic.
- **Supabase free tier:** Fine for this scale. 7-day pause policy — just restore when needed.
- **expo-dev-client bundled:** Enables full native feature testing without EAS cloud builds.
- **Language toggle only in Settings:** The 4 navigation/voice toggles were removed; these features are hardcoded to their sensible defaults until fully implemented.
