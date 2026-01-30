/**
 * Logout helper for Trace app. Uses same localStorage key as main app (trace_auth_v1).
 * Redirects to "home" (main app landing). Set VITE_HOME_URL in .env when Trace runs on a different port (e.g. http://localhost:3000).
 */
const STORAGE_KEY = "trace_auth_v1";

export function getAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
}

// Main app (signup/login home). Use VITE_HOME_URL in .env to override (e.g. in production).
const DEFAULT_HOME = "http://localhost:3000";

export function getHomeUrl() {
  const url = import.meta.env.VITE_HOME_URL;
  if (url && String(url).trim()) return String(url).trim().replace(/\/$/, "") + "/";
  return DEFAULT_HOME + "/";
}

export function logoutAndGoHome() {
  clearAuth();
  // Add ?logout=1 so main app clears its session too (localStorage is per-origin)
  const home = getHomeUrl().replace(/\/$/, "");
  window.location.href = `${home}/?logout=1`;
}
