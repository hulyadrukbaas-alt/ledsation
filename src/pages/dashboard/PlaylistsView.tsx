import type { MediaItem, Playlist } from "./types";

interface PlaylistsViewProps {
  playlists: Playlist[];
  media: MediaItem[];
  primaryWallName: string;
  onPlay: (playlistId: string) => void;
  onStop: (playlistId: string) => void;
}

export default function PlaylistsView({ playlists, media, primaryWallName, onPlay, onStop }: PlaylistsViewProps) {
  const find = (id: string) => media.find((m) => m.id === id);

  return (
    <div className="dash-playlists-grid">
      {playlists.map((p) => {
        const tracks = p.items.map((id, i) => {
          const m = find(id);
          return {
            n: String(i + 1).padStart(2, "0"),
            name: m?.name ?? "—",
            duration: m?.duration ?? "—",
            url: m?.url ?? null,
          };
        });
        const isLive = !!p.playingOn;
        const totalSecs = p.items.reduce((acc, id) => {
          const m = find(id);
          if (!m || !m.duration.includes(":")) return acc;
          const [mm, ss] = m.duration.split(":").map(Number);
          return acc + mm * 60 + ss;
        }, 0);
        const dur = `${Math.floor(totalSecs / 60)}:${String(totalSecs % 60).padStart(2, "0")}`;

        return (
          <div className="dash-playlist-card" key={p.id}>
            <div className="dash-playlist-header">
              <div className="dash-playlist-name">{p.name}</div>
              {isLive && (
                <span className="dash-playlist-live">
                  <span className="dash-live-dot" />
                  LIVE
                </span>
              )}
            </div>
            <div className="dash-playlist-meta">
              {p.items.length} video's · {dur} totaal
            </div>
            <div className="dash-playlist-tracks">
              {tracks.map((t, i) => (
                <div className="dash-playlist-track" key={i}>
                  <span className="dash-track-n">{t.n}</span>
                  <div className="dash-track-thumb">
                    {t.url && <video src={t.url} loop playsInline muted className="dash-wall-video" />}
                  </div>
                  <div className="dash-track-name">{t.name}</div>
                  <span className="dash-track-duration">{t.duration}</span>
                </div>
              ))}
            </div>
            <div className="dash-playlist-actions">
              {!isLive && (
                <button className="dash-btn-mint dash-btn-block" onClick={() => onPlay(p.id)}>
                  ▶ Afspelen op {primaryWallName}
                </button>
              )}
              {isLive && (
                <button className="dash-btn-ghost dash-btn-block" onClick={() => onStop(p.id)}>
                  Stoppen
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
