import { httpJson } from "@/lib/http.js";

export async function signup({ email, password }) {
  return httpJson("/auth/signup", {
    method: "POST",
    body: { email, password },
  });
}

export async function login({ email, password }) {
  return httpJson("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function refresh(refreshToken) {
  return httpJson("/auth/refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
}

