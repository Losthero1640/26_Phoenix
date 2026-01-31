function normalizeBaseUrl(url) {
  if (!url) return "";
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL || "http://localhost:8000"
);

