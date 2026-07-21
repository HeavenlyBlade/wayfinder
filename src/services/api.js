import { API_BASE } from '../constants/api';

const TIMEOUT_MS = 8000;

// ── Timeout-aware fetch ───────────────────────────────────────────────────────
function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

// ── Fetch all buildings from backend ─────────────────────────────────────────
export async function fetchBuildings() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/navigation/buildings`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Object.fromEntries(data.map(b => [b.id, b]));
  } catch (e) {
    console.error('fetchBuildings error:', e.message);
    return null;
  }
}

// ── Get A* route waypoints from backend ──────────────────────────────────────
export async function fetchRoute(userLat, userLng, destinationId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/navigation/route`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_lat:       userLat,
        user_lng:       userLng,
        destination_id: destinationId,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.waypoints ?? [];
  } catch (e) {
    console.error('fetchRoute error:', e.message);
    return [];
  }
}

// ── Send voice audio to backend ───────────────────────────────────────────────
export async function sendVoiceCommand(audioUri) {
  try {
    const formData = new FormData();
    formData.append('audio', { uri: audioUri, type: 'audio/m4a', name: 'command.m4a' });
    const res = await fetchWithTimeout(`${API_BASE}/voice/command`, {
      method: 'POST',
      body:   formData,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('sendVoiceCommand error:', e.message);
    return null;
  }
}
