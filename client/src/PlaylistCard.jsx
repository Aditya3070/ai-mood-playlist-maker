export default function PlaylistCard({ playlist, tracks = [] }) {
  if (!playlist) return null;

  return (
    <div className="card" style={{marginTop: 16}}>
      <h3 style={{marginTop: 0}}>Playlist Ready</h3>
      <div className="small">{playlist.name}</div>

      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlist.id}`}
        width="100%"
        height="380"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify Player"
        style={{marginTop: 8, borderRadius: 8}}
      />

      {tracks.length > 0 && (
        <div style={{marginTop: 12}}>
          <h4 style={{margin: "8px 0"}}>Track List</h4>
          {tracks.slice(0, 20).map(t => (
            <div key={t.id} className="track">
              <div>{t.name}</div>
              <div className="small">{(t.artists||[]).map(a=>a.name).join(", ")} • {t.album?.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
