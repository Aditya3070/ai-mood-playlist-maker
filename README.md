# AI Mood Playlist Maker (Moodify)

Type how you feel, get a Spotify playlist for your vibe.  
Frontend: React (Vite) on Vercel • Backend: Node/Express on Render • Spotify OAuth Authorization Code.

## Live Links
- Frontend: https://YOUR-VERCEL-APP.vercel.app
- Backend: https://YOUR-BACKEND.onrender.com

## Deploy (Quick)
### Backend (Render)
1. Push `/server` to GitHub (public or private).
2. Create **Web Service** on Render → connect repo.
3. Build: `npm install` • Start: `npm start`
4. Add env vars:
```
CLIENT_URL=https://YOUR-VERCEL-APP.vercel.app
SPOTIFY_CLIENT_ID=xxx
SPOTIFY_CLIENT_SECRET=xxx
SPOTIFY_REDIRECT_URI=https://YOUR-BACKEND.onrender.com/callback
```
5. Save the Render URL.

Update Spotify Dashboard Redirect URIs to **exactly** match your backend callback URL.

### Frontend (Vercel)
1. Push `/client` to GitHub.
2. Import on Vercel as **Vite** app.
3. Env var: `VITE_API_URL=https://YOUR-BACKEND.onrender.com`
4. Deploy.

## Local Dev
Backend
```
cd server
cp .env.example .env
# fill values (keep localhost callback for dev if needed):
# CLIENT_URL=http://localhost:5173
# SPOTIFY_CLIENT_ID=...
# SPOTIFY_CLIENT_SECRET=...
# SPOTIFY_REDIRECT_URI=http://127.0.0.1:5000/callback
npm install
npm run dev
```

Frontend
```
cd client
echo "VITE_API_URL=http://127.0.0.1:5000" > .env
npm install
npm run dev
```

## Notes
- The Spotify embed doesn't show per-track album by default, so we render our own track list w/ **artist • album** subtitles.
- For live synced lyrics, you need a Musixmatch commercial license (not included).
