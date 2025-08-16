// Simple client API wrapper
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export const loginUrl = () => `${API_BASE}/login`;

export async function getMe() {
  try {
    const r = await fetch(`${API_BASE}/me`, { credentials: "include" });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

export async function generatePlaylist(mood) {
  const r = await fetch(`${API_BASE}/api/generate?mood=${encodeURIComponent(mood)}`, {
    method: "POST",
    credentials: "include"
  });
  return await r.json();
}
