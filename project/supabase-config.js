// ─────────────────────────────────────────────────────────────────────────
// LEDsation — gedeelde opslag (Supabase)
//
// Hiermee komen echte offerteaanvragen automatisch in het dashboard.
// Het offerteformulier schrijft een aanvraag weg; het dashboard leest ze in
// en kan de status (goedgekeurd/afgewezen) terugschrijven.
//
// EENMALIGE SETUP:
// 1. Maak een gratis account + project op https://supabase.com
// 2. Open in je project de SQL Editor en voer dit uit:
//
//    create table aanvragen (
//      id uuid primary key default gen_random_uuid(),
//      created_at timestamptz default now(),
//      name text, company text, email text, phone text,
//      product text, event_type text,
//      event_start date, event_end date,
//      location text, indoor text, screen_size text, period text, notes text,
//      status text default 'pending'
//    );
//    alter table aanvragen enable row level security;
//    create policy "anon insert" on aanvragen for insert to anon with check (true);
//    create policy "anon select" on aanvragen for select to anon using (true);
//    create policy "anon update" on aanvragen for update to anon using (true) with check (true);
//
// 3. Ga naar Project Settings → API. Kopieer de "Project URL" en de
//    "anon public" key en plak ze hieronder (vervang VERVANG_MIJ).
//
// ─────────────────────────────────────────────────────────────────────────
// BEVEILIGEN MET LOGIN (aanbevolen)
// Standaard kan iedereen met de publishable key de aanvragen lezen. Om alleen
// ingelogde beheerders toegang te geven:
//
// A. Maak een beheerder aan: Authentication → Users → "Add user"
//    (vul een e-mail + wachtwoord in; zet "Auto confirm user" aan).
//
// B. Voer in de SQL Editor uit — publiek formulier mag blijven indienen,
//    maar lezen/bijwerken kan dan alleen na inloggen:
//
//    drop policy if exists "anon select" on aanvragen;
//    drop policy if exists "anon update" on aanvragen;
//    create policy "auth select" on aanvragen for select to authenticated using (true);
//    create policy "auth update" on aanvragen for update to authenticated using (true) with check (true);
//    -- (de "anon insert"-policy laat je staan, zodat het formulier blijft werken)
//
// Het dashboard toont dan automatisch een inlogscherm; het offerteformulier
// blijft gewoon werken zonder login.
// ─────────────────────────────────────────────────────────────────────────
//
// ─────────────────────────────────────────────────────────────────────────
// BESCHIKBAARHEID OP HET OFFERTEFORMULIER
// Het formulier controleert of een product al verhuurd is op de gekozen
// datums. Daarvoor is een publiek leesbare weergave nodig die ALLEEN product
// en datums toont (geen namen/e-mails). Voer dit één keer uit in de SQL Editor:
//
//    create or replace view beschikbaarheid as
//      select product, event_start, event_end
//      from aanvragen
//      where status = 'approved';
//    grant select on beschikbaarheid to anon, authenticated;
//
// Zo blijven de persoonsgegevens in "aanvragen" afgeschermd, terwijl het
// formulier wel kan zien welke schermen op welke datums bezet zijn.
// ─────────────────────────────────────────────────────────────────────────
window.LEDSATION_SUPABASE = {
  url: "https://foofsltmtlnaxyxfwkbd.supabase.co",       // ✓ ingevuld (kale Project URL)
  anonKey: "sb_publishable_brN4TnZCtU61XPWwnZqTeQ_wMG8Naqq",   // ✓ publishable key (veilig voor in de browser)
  table: "aanvragen",
};

// Levert (en hergebruikt) één Supabase-client zodra de SDK en config klaar zijn.
window.getLedsationSupabase = function () {
  var cfg = window.LEDSATION_SUPABASE || {};
  if (!cfg.url || String(cfg.url).indexOf("VERVANG_MIJ") !== -1) return null;
  if (!cfg.anonKey || String(cfg.anonKey).indexOf("VERVANG_MIJ") !== -1) return null;
  if (!window.supabase || !window.supabase.createClient) return null;
  if (!window.__ledsationSbClient) {
    window.__ledsationSbClient = window.supabase.createClient(cfg.url, cfg.anonKey);
  }
  return window.__ledsationSbClient;
};
