export interface Wall {
  id: string;
  name: string;
  sub: string;
  spec: string;
  nowPlaying: string | null;
  power: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  duration: string;
  res: string;
  status: "ready" | "processing";
  progress?: number;
  url: string | null;
}

export interface Playlist {
  id: string;
  name: string;
  items: string[];
  playingOn: string | null;
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  detail: string;
  color: string;
  live: boolean;
}

export type AanvraagStatus = "pending" | "approved" | "rejected";

export interface Aanvraag {
  id: string;
  name: string;
  company: string | null;
  product: string;
  event_type: string | null;
  event_start: string | null;
  event_end: string | null;
  location: string | null;
  notes: string | null;
  status: AanvraagStatus;
}

export type DashboardView = "content" | "screens" | "playlists" | "planning" | "requests" | "agenda";
