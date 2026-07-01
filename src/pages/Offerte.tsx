import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import Mark from "../components/Mark";
import { PRODUCTS, getProduct } from "../data/products";
import { AANVRAGEN_TABLE, BESCHIKBAARHEID_VIEW, getSupabase } from "../lib/supabase";
import { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, FALLBACK_EMAIL, isEmailjsConfigured } from "../lib/offerte-config";
import "./Offerte.css";

const EVENT_TYPES = ["Corporate event", "Beurs / stand", "Concert / festival", "Bruiloft / feest", "Anders"];
const UNSURE = "Weet ik nog niet";

interface FormState {
  eventType: string;
  date: string;
  dateEnd: string;
  location: string;
  indoor: string;
  notes: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

const EMPTY_FORM: FormState = {
  eventType: "", date: "", dateEnd: "", location: "", indoor: "", notes: "",
  name: "", company: "", email: "", phone: "",
};

interface Booking {
  product: string;
  s: number;
  e: number;
}

function parseISO(s: string): Date | null {
  if (!s) return null;
  const p = s.split("T")[0].split("-").map(Number);
  if (p.length < 3 || !p[0]) return null;
  return new Date(p[0], p[1] - 1, p[2]);
}

const MONTHS = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

function fmtRange(a: Date, b: Date): string {
  const d1 = a.getDate(), m1 = a.getMonth(), d2 = b.getDate(), m2 = b.getMonth();
  if (a.getTime() === b.getTime()) return `${d1} ${MONTHS[m1]}`;
  if (m1 === m2) return `${d1}–${d2} ${MONTHS[m1]}`;
  return `${d1} ${MONTHS[m1]} – ${d2} ${MONTHS[m2]}`;
}

type Availability =
  | { state: "none" }
  | { state: "ok"; rangeLabel: string }
  | { state: "conflict"; conflictProduct: string; rangeLabel: string; alternatives: string[] };

function Logo({ size }: { size: number }) {
  return (
    <Link to="/" className="brand">
      <Mark size={size} />
      <span className="brand-text">
        <span className="gradient-text">LED</span>sation
      </span>
    </Link>
  );
}

function sendViaMailto(name: string, email: string, product: string, f: FormState) {
  const line = (label: string, val: string) => (val.trim() ? `${label}: ${val}\n` : "");
  const body =
    "Nieuwe offerteaanvraag via ledsation.nl\n" +
    "----------------------------------------\n\n" +
    "GEWENST SCHERM\n" +
    line("Product", product) + "\n" +
    "EVENEMENT\n" +
    line("Type", f.eventType) +
    line("Datum", f.date) +
    line("Locatie", f.location) +
    line("Binnen/buiten", f.indoor) + "\n" +
    "OPMERKINGEN\n" +
    line("Opmerkingen", f.notes) + "\n" +
    "CONTACT\n" +
    line("Naam", name) +
    line("Bedrijf", f.company) +
    line("E-mail", email) +
    line("Telefoon", f.phone);
  const subject = `Offerteaanvraag${name ? " – " + name : ""}${product !== UNSURE ? ` (${product})` : ""}`;
  window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function Offerte() {
  const [searchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [f, setF] = useState<FormState>(EMPTY_FORM);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [availability, setAvailability] = useState<Booking[]>([]);
  const [availLoaded, setAvailLoaded] = useState(false);

  useEffect(() => {
    const pid = searchParams.get("p");
    if (pid) {
      const product = getProduct(pid);
      if (product) setSelectedProduct(product.name);
    }
  }, [searchParams]);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    (async () => {
      try {
        const res = await sb.from(BESCHIKBAARHEID_VIEW).select("product,event_start,event_end");
        if (res.error) {
          console.warn("Beschikbaarheid:", res.error.message);
          return;
        }
        const av = (res.data ?? [])
          .map((r): Booking | null => {
            const s = parseISO(r.event_start);
            const e = parseISO(r.event_end) ?? s;
            return s ? { product: r.product, s: s.getTime(), e: (e ?? s).getTime() } : null;
          })
          .filter((b): b is Booking => b !== null);
        setAvailability(av);
        setAvailLoaded(true);
      } catch (err) {
        console.warn("Beschikbaarheid:", err);
      }
    })();
  }, []);

  const availabilityInfo: Availability = useMemo(() => {
    const realProduct = selectedProduct && selectedProduct !== UNSURE;
    if (!realProduct || !f.date || !availLoaded) return { state: "none" };
    const s = parseISO(f.date);
    if (!s) return { state: "none" };
    const e = parseISO(f.dateEnd) ?? s;
    const s1 = s.getTime(), e1 = e.getTime();
    if (e1 < s1) return { state: "none" };
    const overlaps = (b: Booking) => s1 <= b.e && b.s <= e1;
    const conflict = availability.some((b) => b.product === selectedProduct && overlaps(b));
    const rangeLabel = fmtRange(s, e);
    if (!conflict) return { state: "ok", rangeLabel };
    const alternatives = PRODUCTS.map((p) => p.name).filter(
      (n) => n !== selectedProduct && !availability.some((b) => b.product === n && overlaps(b)),
    );
    return { state: "conflict", conflictProduct: selectedProduct, rangeLabel, alternatives };
  }, [selectedProduct, f.date, f.dateEnd, availability, availLoaded]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setF((s) => ({ ...s, [key]: value }));
  }

  function pickProduct(name: string) {
    setSelectedProduct(name);
    setError("");
  }

  async function saveToSupabase(name: string, email: string) {
    const sb = getSupabase();
    if (!sb) return;
    try {
      const res = await sb.from(AANVRAGEN_TABLE).insert({
        name,
        email,
        company: f.company || null,
        phone: f.phone || null,
        product: selectedProduct || UNSURE,
        event_type: f.eventType || null,
        event_start: f.date || null,
        event_end: f.dateEnd || null,
        location: f.location || null,
        indoor: f.indoor || null,
        notes: f.notes || null,
        status: "pending",
      });
      if (res.error) console.warn("Supabase insert:", res.error.message);
    } catch (err) {
      console.warn("Supabase insert:", err);
    }
  }

  async function sendRequest(name: string, email: string) {
    await saveToSupabase(name, email);
    const product = selectedProduct || UNSURE;
    if (!isEmailjsConfigured()) {
      sendViaMailto(name, email, product, f);
      setSubmitted(true);
      setError("");
      window.scrollTo(0, 0);
      return;
    }
    setSending(true);
    setError("");
    const params = {
      subject: `Offerteaanvraag${name ? " – " + name : ""}${product !== UNSURE ? ` (${product})` : ""}`,
      product,
      event_type: f.eventType || "—",
      event_date: f.date || "—",
      location: f.location || "—",
      indoor: f.indoor || "—",
      notes: f.notes || "—",
      name,
      company: f.company || "—",
      reply_email: email,
      phone: f.phone || "—",
    };
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, { publicKey: EMAILJS_PUBLIC_KEY });
      setSending(false);
      setSubmitted(true);
      setError("");
      window.scrollTo(0, 0);
    } catch {
      sendViaMailto(name, email, product, f);
      setSending(false);
      setSubmitted(true);
      setError("");
      window.scrollTo(0, 0);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    const name = f.name.trim();
    const email = f.email.trim();
    if (!name || !email) {
      setTouched(true);
      setError("Vul je naam en e-mailadres in zodat we contact kunnen opnemen.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setTouched(true);
      setError("Controleer je e-mailadres — dit lijkt niet te kloppen.");
      return;
    }
    if (availabilityInfo.state === "conflict") {
      setError(
        `${availabilityInfo.conflictProduct} is al verhuurd op de gekozen datums. Kies een andere datum of een beschikbaar alternatief hieronder.`,
      );
      return;
    }
    void sendRequest(name, email);
  }

  const todayISO = new Date().toISOString().split("T")[0];
  const missing = (v: string) => touched && !v.trim();
  const badEmail = touched && f.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim());

  if (submitted) {
    const successName = f.name.trim() ? `, ${f.name.trim().split(" ")[0]}` : "";
    const successProduct = selectedProduct && selectedProduct !== UNSURE ? ` voor de ${selectedProduct}` : "";
    return (
      <div className="offerte-page">
        <nav className="nav">
          <Logo size={28} />
          <div className="nav-right">
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/assortiment">Assortiment</Link>
              <Link to="/#projecten">Projecten</Link>
            </div>
            <span className="nav-badge">Offerte</span>
          </div>
        </nav>
        <div className="offerte-success">
          <div className="offerte-success-check">✓</div>
          <h1>Aanvraag ontvangen!</h1>
          <p className="offerte-success-lead">Bedankt{successName} — we hebben je aanvraag binnen.</p>
          <p className="offerte-success-sub">
            Je hoort <strong>binnen één werkdag</strong> van ons met een offerte op maat{successProduct}.
          </p>
          <div className="offerte-success-actions">
            <Link to="/" className="btn btn-primary">
              Terug naar home
            </Link>
            <Link to="/assortiment" className="btn btn-secondary">
              Bekijk assortiment
            </Link>
          </div>
        </div>
        <footer className="footer">
          <div className="footer-inner">
            <Logo size={26} />
            <div className="footer-copy">© 2026 LEDsation · LED Wall Verhuur · Nederland</div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="offerte-page">
      <nav className="nav">
        <Logo size={28} />
        <div className="nav-right">
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/assortiment">Assortiment</Link>
            <Link to="/#projecten">Projecten</Link>
          </div>
          <span className="nav-badge">Offerte</span>
        </div>
      </nav>

      <div className="offerte-body">
        <div className="offerte-layout">
          <div className="offerte-intro">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Offerte aanvragen
            </div>
            <h1 className="offerte-heading">
              Vertel ons over je <span className="gradient-text">evenement</span>.
            </h1>
            <p className="offerte-intro-lead">
              Hoe meer je ons vertelt, hoe scherper onze offerte. Binnen één werkdag hoor je van
              ons — vrijblijvend en op maat.
            </p>
            <div className="offerte-reassurance">
              <div>
                <span className="check">✓</span>
                <span>Reactie binnen 1 werkdag</span>
              </div>
              <div>
                <span className="check">✓</span>
                <span>Advies over pitch, formaat & plaatsing</span>
              </div>
              <div>
                <span className="check">✓</span>
                <span>Incl. transport, opbouw & bediening</span>
              </div>
            </div>
            <div className="offerte-contact-block">
              <div>→ 06 12 34 56 78</div>
              <div>→ hallo@ledsation.nl</div>
            </div>
          </div>

          <form className="offerte-form" onSubmit={onSubmit} noValidate>
            <div className="offerte-section-label">01 · Welk scherm</div>
            <div className="offerte-product-chips">
              {PRODUCTS.map((p) => (
                <div
                  key={p.id}
                  className={"offerte-chip" + (selectedProduct === p.name ? " offerte-chip-active" : "")}
                  onClick={() => pickProduct(p.name)}
                >
                  <span className="offerte-chip-name">{p.name}</span>
                  <span className="offerte-chip-cat">{p.category.split(" · ")[0] === "BINNEN" ? "Binnen" : p.category.split(" · ")[0] === "BUITEN" ? "Buiten" : "Creatief"}</span>
                </div>
              ))}
              <div
                className={"offerte-chip" + (selectedProduct === UNSURE ? " offerte-chip-active" : "")}
                onClick={() => pickProduct(UNSURE)}
              >
                <span className="offerte-chip-name">Weet ik nog niet</span>
                <span className="offerte-chip-cat">Adviseer mij</span>
              </div>
            </div>

            <div className="offerte-section-label">02 · Je evenement</div>
            <div className="offerte-field-row">
              <label className="offerte-field">
                <span>Type evenement</span>
                <select value={f.eventType} onChange={(e) => updateField("eventType", e.target.value)}>
                  <option value="">Kies…</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="offerte-field">
                <span>Binnen of buiten?</span>
                <select value={f.indoor} onChange={(e) => updateField("indoor", e.target.value)}>
                  <option value="">Kies…</option>
                  <option value="Binnen">Binnen</option>
                  <option value="Buiten">Buiten</option>
                  <option value="Beide">Beide</option>
                </select>
              </label>
            </div>
            <div className="offerte-field-row">
              <label className="offerte-field">
                <span>Startdatum</span>
                <input type="date" min={todayISO} value={f.date} onChange={(e) => updateField("date", e.target.value)} />
              </label>
              <label className="offerte-field">
                <span>
                  Einddatum <span className="offerte-optional">(optioneel)</span>
                </span>
                <input type="date" min={todayISO} value={f.dateEnd} onChange={(e) => updateField("dateEnd", e.target.value)} />
              </label>
            </div>

            {availabilityInfo.state === "conflict" && (
              <div className="offerte-availability offerte-availability-conflict">
                <span className="offerte-availability-icon">!</span>
                <div>
                  <div className="offerte-availability-msg">
                    {availabilityInfo.conflictProduct} is al verhuurd op {availabilityInfo.rangeLabel}.
                  </div>
                  {availabilityInfo.alternatives.length > 0 ? (
                    <>
                      <div className="offerte-availability-note">
                        Wel beschikbaar op deze datums — kies een alternatief:
                      </div>
                      <div className="offerte-availability-alts">
                        {availabilityInfo.alternatives.map((alt) => (
                          <button type="button" key={alt} onClick={() => pickProduct(alt)}>
                            {alt}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="offerte-availability-note">
                      Op deze datums is helaas geen enkel scherm vrij. Kies een andere datum.
                    </div>
                  )}
                </div>
              </div>
            )}
            {availabilityInfo.state === "ok" && (
              <div className="offerte-availability offerte-availability-ok">
                <span>✓</span>
                <span>
                  {selectedProduct} is beschikbaar ({availabilityInfo.rangeLabel}).
                </span>
              </div>
            )}

            <label className="offerte-field offerte-field-full">
              <span>Locatie / plaats</span>
              <input
                type="text"
                placeholder="bijv. RAI Amsterdam"
                value={f.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </label>

            <div className="offerte-section-label">03 · Opmerkingen</div>
            <label className="offerte-field offerte-field-full">
              <span>
                Opmerkingen <span className="offerte-optional">(optioneel)</span>
              </span>
              <textarea
                rows={4}
                placeholder="Heb je nog vragen of wensen? Laat het hier weten…"
                value={f.notes}
                onChange={(e) => updateField("notes", e.target.value)}
              />
            </label>

            <div className="offerte-section-label">04 · Contactgegevens</div>
            <div className="offerte-field-row">
              <label className="offerte-field">
                <span>
                  Naam <span className="offerte-required">*</span>
                </span>
                <input
                  type="text"
                  placeholder="Voor- en achternaam"
                  value={f.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={missing(f.name) ? "offerte-input-invalid" : ""}
                />
              </label>
              <label className="offerte-field">
                <span>
                  Bedrijf <span className="offerte-optional">(optioneel)</span>
                </span>
                <input type="text" placeholder="Organisatie" value={f.company} onChange={(e) => updateField("company", e.target.value)} />
              </label>
            </div>
            <div className="offerte-field-row">
              <label className="offerte-field">
                <span>
                  E-mail <span className="offerte-required">*</span>
                </span>
                <input
                  type="text"
                  inputMode="email"
                  placeholder="info@ledsation.nl"
                  value={f.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={missing(f.email) || badEmail ? "offerte-input-invalid" : ""}
                />
              </label>
              <label className="offerte-field">
                <span>
                  Telefoon <span className="offerte-optional">(optioneel)</span>
                </span>
                <input type="tel" placeholder="06 …" value={f.phone} onChange={(e) => updateField("phone", e.target.value)} />
              </label>
            </div>

            {error && <div className="offerte-error">{error}</div>}

            <button type="submit" disabled={sending} className="offerte-submit">
              {sending ? "Versturen…" : "Verstuur aanvraag →"}
            </button>
            <p className="offerte-disclaimer">
              Je zit nergens aan vast. We gebruiken je gegevens alleen voor deze offerte.
            </p>
          </form>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <Logo size={26} />
          <div className="footer-copy">© 2026 LEDsation · LED Wall Verhuur · Nederland</div>
        </div>
      </footer>
    </div>
  );
}
