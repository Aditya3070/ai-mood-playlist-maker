import axios from "axios";

export function getAuthUrl(clientId, redirectUri, state, scopes) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes.join(" "),
    redirect_uri: redirectUri,
    state
  });
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getTokens({ code, redirectUri, clientId, clientSecret }) {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const data = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri
  });
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
      "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  };
  const res = await axios.post(tokenUrl, data.toString(), { headers });
  return res.data; // { access_token, refresh_token, expires_in, ... }
}

export async function searchTracks(accessToken, { q, limit = 30 }) {
  const res = await axios.get("https://api.spotify.com/v1/search", {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { q, type: "track", limit }
  });
  return res.data.tracks.items;
}

export async function createPlaylist(accessToken, userId, name, description) {
  const res = await axios.post(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    { name, description, public: false },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return res.data; // playlist object
}

export async function addTracksToPlaylist(accessToken, playlistId, uris) {
  await axios.post(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    { uris },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
}

export async function getMe(accessToken) {
  const res = await axios.get("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
}
