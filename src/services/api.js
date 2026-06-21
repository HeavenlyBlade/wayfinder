import { API_BASE } from '../constants/api';

// Fetch all buildings from backend instead of using local constants
export async function fetchBuildings() {
  try {
    const res  = await fetch(`${API_BASE}/navigation/buildings`);
    const data = await res.json();
    // Convert array to object keyed by id — same shape as local BUILDINGS constant
    return Object.fromEntries(data.map(b => [b.id, b]));
  } catch (e) {
    console.error('fetchBuildings error:', e);
    return null;
  }
}

// Get A* route waypoints from backend
export async function fetchRoute(userLat, userLng, destinationId) {
  try {
    const res  = await fetch(`${API_BASE}/navigation/route`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_lat:       userLat,
        user_lng:       userLng,
        destination_id: destinationId,
      }),
    });
    const data = await res.json();
    return data.waypoints ?? [];
  } catch (e) {
    console.error('fetchRoute error:', e);
    return [];
  }
}

// Send voice audio to backend — returns transcript + destination
export async function sendVoiceCommand(audioUri) {
  try {
    const formData = new FormData();
    formData.append('audio', {
      uri:  audioUri,
      type: 'audio/m4a',
      name: 'command.m4a',
    });
    const res  = await fetch(`${API_BASE}/voice/command`, {
      method: 'POST',
      body:   formData,
    });
    return await res.json();
  } catch (e) {
    console.error('sendVoiceCommand error:', e);
    return null;
  }
}