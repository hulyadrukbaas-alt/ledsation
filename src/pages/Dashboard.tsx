import { useEffect, useRef, useState } from "react";
import { AANVRAGEN_TABLE, getSupabase } from "../lib/supabase";
import Sidebar from "./dashboard/Sidebar";
import LoginScreen from "./dashboard/LoginScreen";
import ContentView from "./dashboard/ContentView";
import ScreensView from "./dashboard/ScreensView";
import PlaylistsView from "./dashboard/PlaylistsView";
import PlanningView from "./dashboard/PlanningView";
import RequestsView from "./dashboard/RequestsView";
import AgendaView from "./dashboard/AgendaView";
import { DEMO_MEDIA, DEMO_PLAYLISTS, DEMO_REQUESTS, DEMO_SCHEDULE, DEMO_WALLS } from "./dashboard/demoData";
import type { Aanvraag, DashboardView, MediaItem } from "./dashboard/types";
import "./dashboard/dashboard.css";

const TITLES: Record<DashboardView, [string, string]> = {
  content: ["Mijn content", "Upload je video's en zet ze direct op je LED-wall."],
  screens: ["Mijn schermen", "Bedien elk scherm los en kies wat er speelt."],
  playlists: ["Afspeellijsten", "Bundel video's en speel ze in volgorde af."],
  planning: ["Planning", "Plan wat er wanneer op je schermen verschijnt."],
  requests: ["Aanvragen", "Beoordeel binnenkomende offerteaanvragen en keur ze goed."],
  agenda: ["Verhuuragenda", "Zie in één oogopslag wanneer welk product verhuurd is."],
};

export default function Dashboard() {
  const sbClient = useRef(getSupabase()).current;

  const [view, setView] = useState<DashboardView>("content");
  const [authed, setAuthed] = useState<boolean | null>(sbClient ? null : true);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [walls, setWalls] = useState(DEMO_WALLS);
  const [media, setMedia] = useState<MediaItem[]>(DEMO_MEDIA);
  const [playlists, setPlaylists] = useState(DEMO_PLAYLISTS);
  const [schedule] = useState(DEMO_SCHEDULE);
  const [requests, setRequests] = useState<Aanvraag[]>(DEMO_REQUESTS);

  const seqRef = useRef(0);
  const timersRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  // Auth session
  useEffect(() => {
    if (!sbClient) return;
    sbClient.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = sbClient.auth.onAuthStateChange((_evt, session) => {
      setAuthed(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, [sbClient]);

  // Poll aanvragen while logged in
  useEffect(() => {
    if (!sbClient || authed !== true) return;
    let active = true;
    async function fetchRequests() {
      if (!sbClient) return;
      const res = await sbClient.from(AANVRAGEN_TABLE).select("*").order("created_at", { ascending: true });
      if (!active) return;
      if (res.error) {
        console.warn("Supabase select:", res.error.message);
        return;
      }
      if (Array.isArray(res.data)) setRequests(res.data as Aanvraag[]);
    }
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [sbClient, authed]);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearInterval);
    };
  }, []);

  async function handleLogin(email: string, password: string) {
    if (!sbClient || authLoading) return;
    if (!email || !password) {
      setAuthError("Vul je e-mailadres en wachtwoord in.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    const { error } = await sbClient.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) setAuthError("Inloggen mislukt — controleer je gegevens.");
  }

  async function handleLogout() {
    if (!sbClient) return;
    await sbClient.auth.signOut();
  }

  async function updateStatus(id: string, status: Aanvraag["status"]) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (!sbClient) return;
    const res = await sbClient.from(AANVRAGEN_TABLE).update({ status }).eq("id", id);
    if (res.error) console.warn("Supabase update:", res.error.message);
  }

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || !fileList.length) return;
    Array.from(fileList).forEach((file) => {
      if (file.type && file.type.indexOf("video") !== 0) return;
      const id = `u${seqRef.current++}`;
      const url = URL.createObjectURL(file);
      const res = file.size > 80 * 1024 * 1024 ? "4K" : "1080p";
      const item: MediaItem = { id, name: file.name, duration: "—", res, status: "processing", progress: 0, url };
      setMedia((prev) => [item, ...prev]);
      timersRef.current[id] = setInterval(() => {
        setMedia((prev) =>
          prev.map((m) => {
            if (m.id !== id) return m;
            const p = Math.min(100, (m.progress ?? 0) + 12 + Math.round(Math.random() * 8));
            if (p >= 100) {
              clearInterval(timersRef.current[id]);
              delete timersRef.current[id];
              return { ...m, progress: 100, status: "ready" };
            }
            return { ...m, progress: p };
          }),
        );
      }, 320);
    });
  }

  function assignToWall(wallId: string, mediaId: string) {
    setWalls((prev) =>
      prev.map((w) => (w.id === wallId ? { ...w, nowPlaying: w.nowPlaying === mediaId ? null : mediaId, power: true } : w)),
    );
    setPlaylists((prev) => prev.map((p) => (p.playingOn === wallId ? { ...p, playingOn: null } : p)));
  }

  function playOnPrimary(mediaId: string) {
    const primary = walls[0];
    setWalls((prev) => prev.map((w) => (w.id === primary.id ? { ...w, nowPlaying: mediaId, power: true } : w)));
    setPlaylists((prev) => prev.map((p) => (p.playingOn === primary.id ? { ...p, playingOn: null } : p)));
  }

  function stopMedia(mediaId: string) {
    setWalls((prev) => prev.map((w) => (w.nowPlaying === mediaId ? { ...w, nowPlaying: null } : w)));
  }

  function togglePower(wallId: string) {
    setWalls((prev) => prev.map((w) => (w.id === wallId ? { ...w, power: !w.power } : w)));
  }

  function playPlaylist(plId: string) {
    const primary = walls[0];
    const pl = playlists.find((p) => p.id === plId);
    const first = pl?.items[0] ?? null;
    setWalls((prev) => prev.map((w) => (w.id === primary.id ? { ...w, nowPlaying: first, power: true } : w)));
    setPlaylists((prev) => prev.map((p) => (p.id === plId ? { ...p, playingOn: primary.id } : { ...p, playingOn: null })));
  }

  function stopPlaylist(plId: string) {
    const pl = playlists.find((p) => p.id === plId);
    setWalls((prev) => prev.map((w) => (w.id === pl?.playingOn ? { ...w, nowPlaying: null } : w)));
    setPlaylists((prev) => prev.map((p) => (p.id === plId ? { ...p, playingOn: null } : p)));
  }

  if (sbClient && authed === null) {
    return (
      <div className="dash-auth-checking">
        <div className="dash-spinner dash-spinner-lg" />
      </div>
    );
  }

  if (sbClient && authed === false) {
    return <LoginScreen onLogin={handleLogin} loading={authLoading} error={authError} />;
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const [headerTitle, headerSub] = TITLES[view];
  const usingDemo = !sbClient;

  return (
    <div className="dash-app">
      <Sidebar
        view={view}
        onViewChange={setView}
        pendingCount={pendingCount}
        canLogout={!!sbClient}
        onLogout={handleLogout}
      />
      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1 className="dash-header-title">{headerTitle}</h1>
            <p className="dash-header-sub">{headerSub}</p>
          </div>
        </div>

        {view === "content" && (
          <ContentView
            walls={walls}
            media={media}
            onFilesSelected={handleFilesSelected}
            onPlay={playOnPrimary}
            onStop={stopMedia}
          />
        )}
        {view === "screens" && (
          <ScreensView walls={walls} media={media} onAssign={assignToWall} onTogglePower={togglePower} />
        )}
        {view === "playlists" && (
          <PlaylistsView
            playlists={playlists}
            media={media}
            primaryWallName={walls[0].name}
            onPlay={playPlaylist}
            onStop={stopPlaylist}
          />
        )}
        {view === "planning" && <PlanningView schedule={schedule} />}
        {view === "requests" && (
          <RequestsView
            requests={requests}
            usingDemo={usingDemo}
            onApprove={(id) => updateStatus(id, "approved")}
            onReject={(id) => updateStatus(id, "rejected")}
            onReset={(id) => updateStatus(id, "pending")}
          />
        )}
        {view === "agenda" && <AgendaView requests={requests} />}
      </main>
    </div>
  );
}
