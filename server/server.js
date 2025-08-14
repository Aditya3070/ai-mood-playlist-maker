import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import crypto from "crypto";
import { moodToQuery } from "./moodMap.js";
import {
  getAuthUrl, getTokens, searchTracks, createPlaylist,
  addTracksToPlaylist, getMe
} from "./spotify.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env;
const SCOPES = [
  "playlist-modify-private",
  "user-read-email",
  "user-read-private"
];

let tokenStore = {}; // demo store (replace with DB/Redis for multi-user production)

/** Step 1: Login */
app.get("/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  const url = getAuthUrl(SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, state, SCOPES);
  tokenStore.state = state;
  res.redirect(url);
});

/** Step 2: Callback */
app.get("/callback", async (req, res) => {
  const { code, state } = req.query;
  if (!code || !state || state !== tokenStore.state) {
    return res.status(400).send("State mismatch");
  }
  try {
    const tokens = await getTokens({
      code,
      redirectUri: SPOTIFY_REDIRECT_URI,
      clientId: SPOTIFY_CLIENT_ID,
      clientSecret: SPOTIFY_CLIENT_SECRET
    });
    tokenStore = { ...tokenStore, ...tokens, obtainedAt: Date.now() };
    res.redirect(`${process.env.CLIENT_URL}?authed=1`);
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).send("Auth failed");
  }
});

/** Get current user */
app.get("/api/me", async (req, res) => {
  try {
    const me = await getMe(tokenStore.access_token);
    res.json(me);
  } catch (e) {
    res.status(401).json({ error: "Not authenticated" });
  }
});

/** Generate playlist (search → create → add) */
app.post("/api/generate", async (req, res) => {
  const { mood } = req.body;
  if (!tokenStore.access_token) {
    return res.status(401).json({ error: "Login with Spotify first." });
  }
  try {
    const vibe = moodToQuery(mood);
    const tracks = await searchTracks(tokenStore.access_token, { q: vibe.query, limit: 30 });

    const me = await getMe(tokenStore.access_token);
    const name = `Mood: ${mood} ${vibe.emoji}`;
    const description = `Auto-created by AI Mood Playlist Maker for "${mood}"`;

    const playlist = await createPlaylist(tokenStore.access_token, me.id, name, description);
    const uris = tracks.slice(0, 20).map(t => t.uri);
    if (uris.length) await addTracksToPlaylist(tokenStore.access_token, playlist.id, uris);

    res.json({ playlist, tracks });
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ error: "Failed to generate playlist" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));
