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

export function setAuth(auth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAccessToken() {
  return getAuth()?.access_token || null;
}

export function getRefreshToken() {
  return getAuth()?.refresh_token || null;
}

