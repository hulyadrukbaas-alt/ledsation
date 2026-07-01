import { Link } from "react-router-dom";
import Mark from "../components/Mark";
import StripedPanel from "../components/StripedPanel";
import "./Landing.css";

const DIENSTEN = [
  {
    title: "Corporate events",
    body: "Keynotes, productlanceringen en awards. Strakke achtergrondschermen en zijpanelen die je merk groots in beeld brengen.",
  },
  {
    title: "Beurzen & stands",
    body: "Trek bezoekers naar je stand met heldere, opvallende schermen — ook overdag goed zichtbaar dankzij hoge helderheid.",
  },
  {
    title: "Feesten & bruiloften",
    body: "Een spectaculaire backdrop voor de dansvloer of een persoonlijke videowall vol herinneringen. Wij maken het onvergetelijk.",
  },
];

const WAAROM = [
  {
    n: "01",
    title: "Nieuwste panelen",
    body: "Naadloze beeldkwaliteit met fijne pixelpitch en hoge helderheid.",
  },
  {
    n: "02",
    title: "Volledig verzorgd",
    body: "Transport, opbouw, een operator op locatie en nette afbouw.",
  },
  {
    n: "03",
    title: "Maatwerk formaat",
    body: "Elke afmeting en verhouding — recht, gebogen of als plafond.",
  },
  {
    n: "04",
    title: "Snel geregeld",
    body: "Binnen één werkdag een heldere offerte op maat in je inbox.",
  },
];

const PROJECTEN = ["PROJECTFOTO · BEURSSTAND", "PROJECTFOTO · GALA", "PROJECTFOTO · BRUILOFT"];

function Logo({ size }: { size: number }) {
  return (
    <a href="#top" className="brand">
      <Mark size={size} />
      <span className="brand-text">
        <span className="gradient-text">LED</span>sation
      </span>
    </a>
  );
}

export default function Landing() {
  return (
    <div className="landing">
      {/* NAV */}
      <nav className="nav">
        <Logo size={28} />
        <div className="nav-right">
          <div className="nav-links">
            <a href="#diensten">Diensten</a>
            <Link to="/assortiment">Assortiment</Link>
            <a href="#projecten">Projecten</a>
          </div>
          <Link to="/offerte" className="nav-cta">
            Offerte aanvragen
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <header id="top" className="hero">
        <div className="hero-glow" />
        <div className="hero-grid">
          <div>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              LED Wall Verhuur · Nederland
            </div>
            <h1 className="hero-title">
              Maak van elke ruimte een <span className="gradient-text">sensatie</span>.
            </h1>
            <p className="hero-copy">
              Hoogwaardige LED walls voor corporate events, beurzen en feesten. Wij regelen levering,
              opbouw, bediening en afbouw — jij geniet van het resultaat.
            </p>
            <div className="hero-actions">
              <Link to="/offerte" className="btn btn-primary">
                Vraag een offerte aan →
              </Link>
              <Link to="/assortiment" className="btn btn-secondary">
                Bekijk het assortiment
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">
                  4500<span className="hero-stat-unit"> nits</span>
                </div>
                <div className="hero-stat-label">Ook bij daglicht helder</div>
              </div>
              <div>
                <div className="hero-stat-value">24/7</div>
                <div className="hero-stat-label">Op- en afbouw service</div>
              </div>
              <div>
                <div className="hero-stat-value">∞</div>
                <div className="hero-stat-label">Elk formaat & pixelpitch</div>
              </div>
            </div>
          </div>

          <StripedPanel className="hero-visual" stripeSize={14}>
            <div className="hero-visual-content">
              <div className="hero-visual-mark">
                <Mark size={72} />
              </div>
              <div className="hero-visual-label">
                PROJECTFOTO
                <br />
                LED-WALL OP LOCATIE
              </div>
            </div>
            <div className="hero-visual-live">● LIVE</div>
          </StripedPanel>
        </div>
      </header>

      {/* DIENSTEN */}
      <section id="diensten" className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Diensten</span>
            <h2 className="section-title">Voor elk evenement het juiste scherm</h2>
          </div>
          <p className="section-lead">
            Van een strakke beursstand tot een meeslepende dansvloer — wij denken mee over formaat,
            plaatsing en content.
          </p>
        </div>
        <div className="card-grid">
          {DIENSTEN.map((d) => (
            <div className="card" key={d.title}>
              <div className="card-icon">
                <Mark size={24} />
              </div>
              <h3 className="card-title">{d.title}</h3>
              <p className="card-body">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WAAROM */}
      <section id="waarom" className="section section-tight">
        <div className="waarom-panel">
          <span className="eyebrow">Waarom LEDsation</span>
          <h2 className="waarom-title">Zorgeloos van aanvraag tot afbouw</h2>
          <div className="waarom-grid">
            {WAAROM.map((w) => (
              <div key={w.n}>
                <div className="waarom-index">{w.n}</div>
                <h4 className="waarom-item-title">{w.title}</h4>
                <p className="waarom-item-body">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTEN */}
      <section id="projecten" className="section">
        <div className="projecten-heading">
          <span className="eyebrow">Projecten</span>
          <h2 className="section-title">Recent in beeld gebracht</h2>
        </div>
        <div className="projecten-grid">
          {PROJECTEN.map((label) => (
            <StripedPanel className="project-card" key={label} stripeSize={13}>
              <span className="project-card-label">{label}</span>
            </StripedPanel>
          ))}
        </div>
      </section>

      {/* OFFERTE CTA */}
      <section className="section offerte-section">
        <div className="offerte-card">
          <div className="offerte-radial" />
          <div className="offerte-grid">
            <div>
              <h2 className="offerte-title">Klaar om indruk te maken?</h2>
              <p className="offerte-copy">
                Vertel ons over je evenement en ontvang binnen één werkdag een offerte op maat.
              </p>
              <div className="offerte-contact">
                <div>
                  <span className="offerte-contact-arrow">→</span> 06 12 34 56 78
                </div>
                <div>
                  <span className="offerte-contact-arrow">→</span> hallo@ledsation.nl
                </div>
                <div>
                  <span className="offerte-contact-arrow">→</span> ledsation.nl
                </div>
              </div>
            </div>
            <div className="offerte-form-card">
              <div className="offerte-form-heading">
                <Mark size={38} />
                <span className="offerte-form-title">Offerte op maat</span>
              </div>
              <p className="offerte-form-copy">
                Vul in een paar minuten je evenement, gewenste scherm en contactgegevens in. Wij
                rekenen het door en sturen je een vrijblijvende offerte.
              </p>
              <div className="offerte-checklist">
                <div>
                  <span className="check">✓</span>
                  <span>Reactie binnen 1 werkdag</span>
                </div>
                <div>
                  <span className="check">✓</span>
                  <span>Incl. transport, opbouw & bediening</span>
                </div>
              </div>
              <Link to="/offerte" className="btn btn-primary offerte-form-cta">
                Naar het offerteformulier →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <Logo size={26} />
          <div className="footer-copy">© 2026 LEDsation · LED Wall Verhuur · Nederland</div>
          <div className="footer-links">
            <Link to="/dashboard" className="footer-link">
              Dashboard
            </Link>
            <Link to="/brandkit" className="footer-link">
              ↗ Brand kit
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
