import type { MediaItem, Wall } from "./types";

function shortName(name: string): string {
  return name.replace(/\.[^.]+$/, "");
}

interface ScreensViewProps {
  walls: Wall[];
  media: MediaItem[];
  onAssign: (wallId: string, mediaId: string) => void;
  onTogglePower: (wallId: string) => void;
}

export default function ScreensView({ walls, media, onAssign, onTogglePower }: ScreensViewProps) {
  const readyMedia = media.filter((m) => m.status === "ready");

  return (
    <div className="dash-screens-grid">
      {walls.map((w) => {
        const m = w.power && w.nowPlaying ? media.find((x) => x.id === w.nowPlaying) : undefined;
        const statusLabel = !w.power ? "UIT" : m ? `LIVE · ${shortName(m.name).toUpperCase().slice(0, 18)}` : "STAND-BY";
        const dot = !w.power ? "#5A6B66" : m ? "#2DF5A6" : "#F2A65A";
        return (
          <div className="dash-screen-card" key={w.id}>
            <div className="dash-wall-preview">
              {m ? (
                <video src={m.url ?? undefined} autoPlay loop playsInline muted className="dash-wall-video" />
              ) : (
                <span className="dash-wall-empty-label">{w.power ? "GEEN CONTENT INGEPLAND" : "SCHERM UIT"}</span>
              )}
              <div className="dash-wall-status">
                <span className="dash-status-dot" style={{ background: dot, boxShadow: `0 0 8px ${dot}` }} />
                {statusLabel}
              </div>
            </div>
            <div className="dash-screen-body">
              <div className="dash-screen-header">
                <div>
                  <div className="dash-screen-name">{w.name}</div>
                  <div className="dash-screen-sub">
                    {w.sub} · {w.spec}
                  </div>
                </div>
                <button
                  className={"dash-power-btn" + (w.power ? " dash-power-btn-on" : "")}
                  onClick={() => onTogglePower(w.id)}
                >
                  {w.power ? "Aan" : "Uit"}
                </button>
              </div>
              <div className="dash-screen-assign-label">Kies wat hier speelt</div>
              <div className="dash-screen-assign-grid">
                {readyMedia.map((x) => {
                  const active = w.nowPlaying === x.id && w.power;
                  return (
                    <div
                      key={x.id}
                      className={"dash-assign-tile" + (active ? " dash-assign-tile-active" : "")}
                      onClick={() => onAssign(w.id, x.id)}
                    >
                      {x.url ? (
                        <video src={x.url} loop playsInline muted className="dash-wall-video" />
                      ) : (
                        <div className="dash-media-play-icon dash-media-play-icon-sm" />
                      )}
                      {active && <div className="dash-assign-active-check">✓</div>}
                      <span className="dash-assign-label">{shortName(x.name).slice(0, 14)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
