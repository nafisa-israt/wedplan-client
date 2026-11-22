import { authClient } from "./auth-client";
import { API_URL } from "./constants";


export async function apiFetch(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";

  if (auth) {
    const { data, error } = await authClient.token();
    if (error || !data?.token) {
      throw new Error("Please sign in again");
    }
    headers.Authorization = `Bearer ${data.token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    
  }

  if (!res.ok) {
    const err = new Error(data?.message || "Something went wrong");
    err.status = res.status;
    throw err;
  }
  return data;
}