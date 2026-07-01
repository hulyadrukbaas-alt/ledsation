import { useState } from "react";
import { Link } from "react-router-dom";
import Mark from "../components/Mark";
import { PRODUCTS, type ProductCategory } from "../data/products";
import "./Assortiment.css";

const CHIPS: { key: ProductCategory | "alle"; label: string }[] = [
  { key: "alle", label: "Alles" },
  { key: "binnen", label: "Binnen" },
  { key: "buiten", label: "Buiten" },
  { key: "creatief", label: "Creatief" },
];

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

export default function Assortiment() {
  const [filter, setFilter] = useState<ProductCategory | "alle">("alle");
  const products = PRODUCTS.filter((p) => filter === "alle" || p.cat === filter);

  return (
    <div className="assortiment">
      {/* NAV */}
      <nav className="nav">
        <Logo size={28} />
        <div className="nav-right">
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/assortiment" className="nav-link-active">
              Assortiment
            </Link>
            <Link to="/#projecten">Projecten</Link>
          </div>
          <Link to="/offerte" className="nav-cta">
            Offerte aanvragen
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <header id="assortiment" className="assortiment-hero">
        <div className="assortiment-hero-glow" />
        <div className="assortiment-hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Ons assortiment
          </div>
          <h1 className="assortiment-title">
            Voor elke ruimte de juiste <span className="gradient-text">LED-wall</span>.
          </h1>
          <p className="assortiment-lead">
            Van fijne pixelpitch voor je beursstand tot weerbestendige panelen voor buiten. Alles
            inclusief transport, opbouw en bediening.
          </p>
        </div>
      </header>

      {/* FILTER CHIPS */}
      <div className="filter-chips">
        {CHIPS.map((c) => (
          <button
            key={c.key}
            type="button"
            className={"filter-chip" + (filter === c.key ? " filter-chip-active" : "")}
            onClick={() => setFilter(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}
      <section className="product-grid-section">
        <div className="product-grid">
          {products.map((p) => (
            <Link to={`/product/${p.id}`} className="product-card" key={p.id}>
              <div className="product-card-image">
                {p.img ? (
                  <div className="product-card-photo" style={{ backgroundImage: `url("${p.img}")` }} />
                ) : (
                  <>
                    <div
                      className="product-card-noimg-glow"
                      style={{ background: `radial-gradient(circle at 70% 30%, ${p.glow}, transparent 65%)` }}
                    />
                    <Mark size={46} />
                    <span className="product-card-noimg-label">PRODUCTFOTO</span>
                  </>
                )}
                <span className="product-card-tag" style={{ color: p.tagColor }}>
                  {p.category}
                </span>
              </div>
              <div className="product-card-body">
                <div className="product-card-heading">
                  <h3>{p.name}</h3>
                  <span className="product-card-pitch">{p.pitch}</span>
                </div>
                <p className="product-card-desc">{p.desc}</p>
                <div className="product-card-price">
                  <span className="product-card-price-value">{p.price}</span>
                  <span className="product-card-price-unit">{p.priceUnit}</span>
                </div>
                <div className="product-card-specs">
                  {p.specs.slice(0, 4).map(([k, v]) => (
                    <div className="product-card-spec" key={k}>
                      <div className="product-card-spec-key">{k}</div>
                      <div className="product-card-spec-value">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="product-card-uses">
                  {p.uses.map((u) => (
                    <span key={u}>{u}</span>
                  ))}
                </div>
                <span className="product-card-cta">Bekijk product →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HELP STRIP */}
      <section className="help-strip-section">
        <div className="help-strip">
          <div className="help-strip-radial" />
          <div className="help-strip-copy">
            <h3>Niet zeker welk scherm je nodig hebt?</h3>
            <p>
              Vertel ons over je locatie en evenement — wij adviseren de juiste pixelpitch,
              helderheid en afmeting.
            </p>
          </div>
          <Link to="/offerte" className="help-strip-cta">
            Vraag advies aan →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <Logo size={26} />
          <div className="footer-copy">© 2026 LEDsation · LED Wall Verhuur · Nederland</div>
          <Link to="/dashboard" className="footer-link">
            Dashboard
          </Link>
        </div>
      </footer>
    </div>
  );
}
