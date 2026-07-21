// ─────────────────────────────────────────────────────────────────────────────
// Network connectivity checker
//
// Checks if device has internet access by trying to reach the backend API.
// Returns true if online, false if offline.
// ─────────────────────────────────────────────────────────────────────────────

import { API_BASE } from '../constants/api';

/**
 * Check if the device has internet connectivity.
 * @param {number} timeout - Timeout in milliseconds (default: 3000)
 * @returns {Promise<boolean>} - true if online, false if offline
 */
export async function checkInternetConnection(timeout = 3000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timer);
    return response.ok;
  } catch (error) {
    clearTimeout(timer);
    return false;
  }
}

/**
 * Check if the backend voice API is reachable.
 * More specific than general internet check.
 * @param {number} timeout - Timeout in milliseconds (default: 2000)
 * @returns {Promise<boolean>} - true if voice API reachable, false otherwise
 */
export async function checkVoiceAPIAvailable(timeout = 2000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    await fetch(`${API_BASE}/voice/command`, {
      method: 'OPTIONS',
      signal: controller.signal,
    });
    clearTimeout(timer);
    return true; // any response means the server is reachable
  } catch (error) {
    clearTimeout(timer);
    return false;
  }
}
