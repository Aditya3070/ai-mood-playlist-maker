import { useEffect, useState } from "react";
import { getMe, generatePlaylist, loginUrl } from "./api";
import PlaylistCard from "./PlaylistCard";

export default function App() {
  const [user, setUser] = useState(null);
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    (async () => {
      const me = await getMe();
      setUser(me);
    })();
  }, []);

  async function onGenerate() {
    if (!mood.trim()) return;
    if (!user) {
      window.location.href = loginUrl();
      return;
    }
    setLoading(true);
    const res = await generatePlaylist(mood);
    setPlaylist(res.playlist);
    setTracks(res.tracks || []);
    setLoading(false);
  }

  return (
    <div className="container">
      <header>
        <h1>Moodify <span className="badge">AI Mood DJ</span></h1>
        <p className="small">Type how you feel. Get a Spotify playlist for your vibe.</p>
        <div className="small">{user ? `Logged in as ${user.display_name}` : "Not logged in"}</div>
      </header>

      <div className="card" style={{marginTop: 16}}>
        <input
          className="input"
          value={mood}
          onChange={e => setMood(e.target.value)}
          placeholder="happy, nostalgic 90s, rainy chill…"
        />
        <button className="button" onClick={onGenerate} disabled={loading}>
          {loading ? "Generating…" : "Generate 🎶"}
        </button>
        <div className="small" style={{marginTop: 8}}>Tip: try “nostalgic 90s”, “rainy chill”, “energetic gym”</div>
      </div>

      {playlist && <PlaylistCard playlist={playlist} tracks={tracks} />}

      <footer className="footer">Built with Spotify API • No data stored • Private playlists</footer>
    </div>
  );
}
