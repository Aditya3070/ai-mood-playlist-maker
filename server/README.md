# Mood Playlist Server

Simple Express server that handles Spotify OAuth and creates playlists.
- Endpoints:
  - `GET /login` → Spotify login
  - `GET /callback` → Spotify OAuth redirect
  - `GET /api/me` → current user profile
  - `POST /api/generate` → create a private playlist from a mood
