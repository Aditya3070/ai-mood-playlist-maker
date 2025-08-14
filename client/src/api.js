const BASE = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export async function getMe() {
  const res = await fetch(`${BASE}/api/me`);
  if (!res.ok) return null;
  return res.json();
}

export async function generatePlaylist(mood) {
  const res = await fetch(`${BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mood })
  });
  return res.json();
}

export function loginUrl() {
  return `${BASE}/login`;
}
