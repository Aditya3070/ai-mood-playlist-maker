# AI Mood Playlist Maker 🎧

Type how you feel — get a private Spotify playlist for your vibe.

## Stack
- React + Vite + Tailwind (client)
- Node + Express (server)
- Spotify Web API (OAuth)

## Quickstart
1) Create a Spotify app at https://developer.spotify.com/dashboard and add redirect URI `http://localhost:5000/callback`.
2) `cd server && cp .env.example .env` → fill your Spotify Client ID/Secret.
3) In `/server`: `npm i && npm run dev`
4) In `/client`: `cp .env.example .env && npm i && npm run dev`
5) Open http://localhost:5173 → click Generate → login with Spotify → enjoy 🎶
