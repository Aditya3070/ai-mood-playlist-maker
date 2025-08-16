import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

const CLIENT_URL = process.env.CLIENT_URL;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

app.use(express.json());
app.use(cookieParser());

// CORS: allow your frontend
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("Mood Playlist API is running ✅");
});

// Step 1: Redirect to Spotify auth
app.get("/login", (req, res) => {
  const scope = [
    "playlist-modify-private",
    "playlist-modify-public",
    "user-read-email"
  ].join(" ");
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI
  });
  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

// Step 2: Spotify redirects here with a code. Exchange for token and set cookie.
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Missing code");
  try {
    const tokenRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const { access_token, refresh_token, expires_in } = tokenRes.data;

    // Set httpOnly cookie for access token
    res.cookie("spotify_access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: expires_in * 1000
    });
    // (Optional) store refresh in a cookie for demo only (normally you'd store server-side)
    res.cookie("spotify_refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 3600 * 1000
    });

    // Redirect back to client
    res.redirect(CLIENT_URL);
  } catch (e) {
    console.error(e?.response?.data || e.message);
    res.status(500).send("Token exchange failed");
  }
});

// Helper: get access token (refresh if needed - simplified)
async function getAccessToken(req, res) {
  const token = req.cookies.spotify_access_token;
  if (token) return token;
  const refresh = req.cookies.spotify_refresh_token;
  if (!refresh) return null;
  try {
    const refreshRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const { access_token, expires_in } = refreshRes.data;
    res.cookie("spotify_access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: expires_in * 1000
    });
    return access_token;
  } catch (e) {
    console.error("Refresh failed", e?.response?.data || e.message);
    return null;
  }
}

// Current user
app.get("/me", async (req, res) => {
  try {
    const token = await getAccessToken(req, res);
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const me = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(me.data);
  } catch (e) {
    console.error(e?.response?.data || e.message);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Generate playlist by mood (simple search-based)
app.post("/api/generate", async (req, res) => {
  try {
    const mood = (req.query.mood || req.body.mood || "").toString().trim();
    if (!mood) return res.status(400).json({ error: "Missing mood" });

    const token = await getAccessToken(req, res);
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    // 1) Get user id
    const meRes = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const userId = meRes.data.id;

    // 2) Search tracks by mood keywords
    const searchRes = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: mood, type: "track", limit: 30 }
    });
    const items = searchRes.data.tracks.items || [];
    const trackUris = items.map(t => `spotify:track:${t.id}`);

    // 3) Create playlist
    const name = `Moodify: ${mood}`;
    const createRes = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`,
      { name, public: false, description: `Auto-generated for "${mood}"` },
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );
    const playlist = createRes.data;

    // 4) Add tracks
    if (trackUris.length) {
      await axios.post(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        { uris: trackUris },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
    }

    // 5) Respond with playlist info
    res.json({
      playlist: { id: playlist.id, name: playlist.name, external_urls: playlist.external_urls },
      tracks: items.map(t => ({
        id: t.id, name: t.name,
        artists: t.artists.map(a => ({ id: a.id, name: a.name })),
        album: { id: t.album.id, name: t.album.name }
      }))
    });
  } catch (e) {
    console.error(e?.response?.data || e.message);
    res.status(500).json({ error: "Failed to generate playlist" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
