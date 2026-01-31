/**
 * CHAKRAVYUH / TRACE – Backend API client
 * Uses same base URL as vanilla app (http://localhost:8000).
 */
import { getAuth } from "@/lib/auth";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

function getAuthHeader() {
  const auth = getAuth();
  const token = auth?.access_token;
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
}

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    let msg = `Request failed (${res.status})`;
    try {
      const j = JSON.parse(text);
      if (j.detail) msg = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail);
    } catch (_) {}
    throw new Error(msg);
  }
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) return res.json();
  return res.blob();
}

/**
 * POST /query – RAG query
 */
export async function query(body) {
  const res = await fetch(`${API_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

/**
 * POST /ingest – Upload file (FormData with key "file")
 * Supports progress callback
 */
export async function ingest(formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/ingest`);
    
    const authHeaders = getAuthHeader();
    if (authHeaders.Authorization) {
      xhr.setRequestHeader("Authorization", authHeaders.Authorization);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText);
          resolve(json);
        } catch (e) {
          resolve(xhr.responseText);
        }
      } else {
        let msg = `Request failed (${xhr.status})`;
        try {
          const j = JSON.parse(xhr.responseText);
          if (j.detail) msg = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail);
        } catch (_) {}
        reject(new Error(msg));
      }
    };

    xhr.onerror = () => reject(new Error("Network request failed"));
    
    xhr.send(formData);
  });
}

/**
 * GET /evidence/{chunk_id}
 */
export async function getEvidence(chunkId) {
  const res = await fetch(`${API_URL}/evidence/${encodeURIComponent(chunkId)}`, {
    headers: getAuthHeader(),
  });
  return handleResponse(res);
}

/**
 * POST /export/markdown – returns blob (markdown file)
 */
export async function exportMarkdown(queryResponse) {
  const res = await fetch(`${API_URL}/export/markdown`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(queryResponse),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Export failed");
  }
  return res.blob();
}

/**
 * POST /export/obsidian
 */
export async function exportObsidian(payload) {
  const res = await fetch(`${API_URL}/export/obsidian`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/** Base URL for evidence content (files, frames) */
export function getEvidenceContentUrl(relativePath) {
  if (!relativePath) return "";
  if (relativePath.startsWith("http")) return relativePath;
  return `${API_URL}${relativePath.startsWith("/") ? "" : "/"}${relativePath}`;
}
