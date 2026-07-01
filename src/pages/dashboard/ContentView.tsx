import { useRef, useState } from "react";
import type { MediaItem, Wall } from "./types";

function shortName(name: string): string {
  return name.replace(/\.[^.]+$/, "");
}

interface ContentViewProps {
  walls: Wall[];
  media: MediaItem[];
  onFilesSelected: (files: FileList | null) => void;
  onPlay: (mediaId: string) => void;
  onStop: (mediaId: string) => void;
}

export default function ContentView({ walls, media, onFilesSelected, onPlay, onStop }: ContentViewProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const isLiveMedia = (id: string) => walls.some((w) => w.power && w.nowPlaying === id);

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        multiple
        onChange={(e) => {
          onFilesSelected(e.target.files);
          e.target.value = "";
        }}
        style={{ display: "none" }}
      />

      <div
        className={"dash-dropzone" + (dragging ? " dash-dropzone-active" : "")}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFilesSelected(e.dataTransfer.files);
        }}
      >
        <div className="dash-dropzone-icon">↑</div>
        <div className="dash-dropzone-text">
          <div className="dash-dropzone-title">Sleep je video hierheen</div>
          <div className="dash-dropzone-sub">
            of <span className="dash-dropzone-browse">blader op je computer</span> · MP4 of MOV · max 4K · 16:9
            aanbevolen
          </div>
        </div>
      </div>

      <div className="dash-section-heading">
        <h2>Live op je schermen</h2>
        <span className="dash-section-count">{walls.length} schermen verbonden</span>
      </div>
      <div className="dash-walls-grid">
        {walls.map((w) => {
          const m = w.power && w.nowPlaying ? media.find((x) => x.id === w.nowPlaying) : undefined;
          const statusLabel = !w.power ? "UIT" : m ? `LIVE · ${shortName(m.name).toUpperCase().slice(0, 18)}` : "STAND-BY";
          const dot = !w.power ? "#5A6B66" : m ? "#2DF5A6" : "#F2A65A";
          return (
            <div className="dash-wall-card" key={w.id}>
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
              <div className="dash-wall-info">
                <div className="dash-wall-info-text">
                  <div className="dash-wall-name">{w.name}</div>
                  <div className="dash-wall-sub">{m ? `Nu: ${m.name}` : w.sub}</div>
                </div>
                <span className="dash-wall-spec">{w.spec}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dash-section-heading">
        <h2>Mediabibliotheek</h2>
        <span className="dash-section-count">{media.length} video's</span>
      </div>
      <div className="dash-media-grid">
        {media.map((m) => {
          const isProcessing = m.status === "processing";
          const isLive = isLiveMedia(m.id);
          const hasUrl = !!m.url && !isProcessing;
          const meta = [m.res, m.duration].filter((x) => x && x !== "—").join(" · ") || "Wordt verwerkt";
          return (
            <div className="dash-media-card" key={m.id}>
              <div className="dash-media-preview">
                {hasUrl ? (
                  <video src={m.url ?? undefined} loop playsInline muted className="dash-wall-video" />
                ) : !isProcessing ? (
                  <div className="dash-media-play-icon" />
                ) : null}
                {isProcessing && (
                  <div className="dash-media-processing">
                    <div className="dash-spinner" />
                    <div className="dash-media-progress-track">
                      <div className="dash-media-progress-fill" style={{ width: `${m.progress ?? 0}%` }} />
                    </div>
                    <div className="dash-media-progress-label">Verwerken… {m.progress ?? 0}%</div>
                  </div>
                )}
                {isLive && (
                  <div className="dash-media-live-badge">
                    <span className="dash-live-dot" />
                    LIVE
                  </div>
                )}
              </div>
              <div className="dash-media-body">
                <div>
                  <div className="dash-media-name">{m.name}</div>
                  <div className="dash-media-meta">{meta}</div>
                </div>
                <div className="dash-media-actions">
                  {m.status === "ready" && !isLive && (
                    <button className="dash-btn-mint" onClick={() => onPlay(m.id)}>
                      Toon op scherm
                    </button>
                  )}
                  {isLive && (
                    <button className="dash-btn-ghost" onClick={() => onStop(m.id)}>
                      Van scherm halen
                    </button>
                  )}
                  {isProcessing && <div className="dash-media-processing-label">Bezig met verwerken…</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
