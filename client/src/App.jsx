import { useEffect, useState } from "react";
import "./styles.css";
import MoodInput from "./components/MoodInput.jsx";
import PlaylistCard from "./components/PlaylistCard.jsx";
import Loader from "./components/Loader.jsx";
import { getMe, generatePlaylist, loginUrl } from "./api.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]); // NEW

  useEffect(() => {
    (async () => {
      const me = await getMe();
      setUser(me);
    })();
  }, []);

  const handleGenerate = async (mood) => {
    if (!mood.trim()) return;
    if (!user) {
      window.location.href = loginUrl();
      return;
    }
    setLoading(true);
    const res = await generatePlaylist(mood);
    setPlaylist(res.playlist);
    setTracks(Array.isArray(res.tracks) ? res.tracks.slice(0, 20) : []); // NEW
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-anim text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Moodify <span className="text-sm px-2 py-1 rounded bg-white/10">AI Mood DJ</span>
          </h1>
          <p className="opacity-80 mt-2">Type how you feel. Get a Spotify playlist for your vibe.</p>
          <div className="mt-3 text-sm opacity-80">
            {user ? `Logged in as ${user.display_name}` : "Not logged in"}
          </div>
        </header>

        <MoodInput onSubmit={handleGenerate} />

        {loading && <Loader />}
        {playlist && <PlaylistCard playlist={playlist} tracks={tracks} />} {/* pass tracks */}

<footer className="mt-10 text-xs opacity-60">
  Showing live track list with artist and album details
</footer>
      </div>
    </div>
  );
}
