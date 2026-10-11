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
