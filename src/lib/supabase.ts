import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Gedeelde opslag (Supabase) voor offerteaanvragen — zie project/supabase-config.js
// voor de eenmalige SQL-setup (tabel "aanvragen" + de "beschikbaarheid"-view).
const SUPABASE_URL = "https://foofsltmtlnaxyxfwkbd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_brN4TnZCtU61XPWwnZqTeQ_wMG8Naqq";

export const AANVRAGEN_TABLE = "aanvragen";
export const BESCHIKBAARHEID_VIEW = "beschikbaarheid";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return client;
}
