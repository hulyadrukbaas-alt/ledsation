import type { Aanvraag, MediaItem, Playlist, ScheduleEvent, Wall } from "./types";

export const DEMO_WALLS: Wall[] = [
  { id: "w1", name: "Main Stage Wall", sub: "Hoofdpodium", spec: "6×3 m · P2.6", nowPlaying: "m1", power: true },
  { id: "w2", name: "Entree Pilaar", sub: "Bij de ingang", spec: "2×3 m · P3.9", nowPlaying: null, power: true },
];

export const DEMO_MEDIA: MediaItem[] = [
  { id: "m1", name: "Aftermovie 2025.mp4", duration: "1:42", res: "4K", status: "ready", url: null },
  { id: "m2", name: "Sfeerloop dansvloer.mp4", duration: "0:30", res: "1080p", status: "ready", url: null },
  { id: "m3", name: "Logo-animatie.mov", duration: "0:08", res: "4K", status: "ready", url: null },
];

export const DEMO_PLAYLISTS: Playlist[] = [
  { id: "p1", name: "Opening & welkom", items: ["m3", "m1"], playingOn: null },
  { id: "p2", name: "Netwerkborrel", items: ["m2", "m3", "m1"], playingOn: null },
];

export const DEMO_SCHEDULE: ScheduleEvent[] = [
  { id: "e1", time: "09:00", title: "Opening & welkom", detail: "Afspeellijst · Main Stage Wall", color: "#2DF5A6", live: false },
  { id: "e2", time: "10:30", title: "Aftermovie 2025", detail: "Main Stage Wall · doorlopend", color: "#1FD8E6", live: true },
  { id: "e3", time: "12:30", title: "Logo-animatie (lunch)", detail: "Entree Pilaar · loop", color: "#8A6BF2", live: false },
  { id: "e4", time: "15:00", title: "Netwerkborrel", detail: "Afspeellijst · alle schermen", color: "#F2A65A", live: false },
  { id: "e5", time: "17:30", title: "Afsluiting", detail: "Sfeerloop dansvloer · Main Stage Wall", color: "#2DF5A6", live: false },
];

export const DEMO_REQUESTS: Aanvraag[] = [
  { id: "q1", name: "Mark de Wit", company: "DTF.nl", product: "Grandsation", event_type: "Supplierdays", event_start: "2026-09-01", event_end: "2026-09-02", location: "Jaarbeurs Utrecht", notes: "Opbouw graag de avond ervoor.", status: "approved" },
  { id: "q2", name: "Sanne Jansen", company: "Jansen Events", product: "Puresation", event_type: "Corporate event", event_start: "2026-09-05", event_end: "2026-09-06", location: "RAI Amsterdam", notes: "Content wordt later aangeleverd.", status: "pending" },
  { id: "q3", name: "Tom Bakker", company: "Studio Noord", product: "Kinesation", event_type: "Concert", event_start: "2026-09-09", event_end: "2026-09-09", location: "013 Tilburg", notes: "Graag een operator ter plaatse.", status: "pending" },
  { id: "q4", name: "Lisa de Vries", company: "", product: "Foundsation", event_type: "Bruiloft", event_start: "2026-09-12", event_end: "2026-09-13", location: "Landgoed Utrecht", notes: "—", status: "pending" },
  { id: "q5", name: "Peter Smit", company: "TechExpo BV", product: "Sunsation", event_type: "Beurs", event_start: "2026-09-18", event_end: "2026-09-20", location: "Ahoy Rotterdam", notes: "Buitenopstelling, check stroomvoorziening.", status: "approved" },
  { id: "q6", name: "Fatima El Amrani", company: "Gemeente Den Haag", product: "Puresation", event_type: "Congres", event_start: "2026-09-25", event_end: "2026-09-26", location: "Den Haag", notes: "Factuur op naam van de gemeente.", status: "pending" },
];

export const PRODUCT_COLORS: Record<string, string> = {
  Puresation: "#2DF5A6",
  Grandsation: "#1FD8E6",
  Sunsation: "#F2A65A",
  Kinesation: "#8A6BF2",
  Slimsation: "#4D9FFF",
  Foundsation: "#FF6B9D",
};

export function colorForProduct(product: string): string {
  return PRODUCT_COLORS[product] || "#8A9A95";
}
