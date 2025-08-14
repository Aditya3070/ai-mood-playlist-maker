import { useEffect, useState } from "react";

export default function PlaylistCard({ playlist }) {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (!playlist?.id) return;

    // Fetch playlist tracks from Spotify Web API
    fetch(`https://api.spotify.com/v1/playlists/${playlist.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("spotify_access_token")}`, // make sure your token is stored
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.tracks?.items) {
          // Filter duplicates + unwanted words
          const unique = [];
          const seen = new Set();
          data.tracks.items.forEach((item) => {
            const name = item.track.name.toLowerCase();
            if (
              !seen.has(name) &&
              !name.includes("nightcore") &&
              !name.includes("instrumental") &&
              !name.includes("remix")
            ) {
              seen.add(name);
              unique.push(item);
            }
          });
          setTracks(unique);
        }
      })
      .catch((err) => console.error(err));
  }, [playlist]);

  if (!playlist) return null;

  return (
    <div className="card mt-6">
      <h3 className="text-xl font-semibold mb-2">Playlist Ready</h3>
      <p className="text-sm opacity-80 mb-4">{playlist.name}</p>

      {/* Spotify Embed */}
      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlist.id}`}
        width="100%"
        height="380"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify Player"
      />

      {/* Track list with subtitles */}
      <ul className="mt-4 space-y-2">
        {tracks.map(({ track }) => (
          <li key={track.id} className="border-b border-white/10 pb-2">
            <strong>{track.name}</strong>
            <div className="text-sm opacity-70">
              {track.artists.map((a) => a.name).join(", ")} • {track.album.name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
