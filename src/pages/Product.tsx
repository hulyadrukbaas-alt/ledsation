import { Link, useParams } from "react-router-dom";
import Mark from "../components/Mark";
import { PRODUCTS, getProduct } from "../data/products";
import "./Product.css";

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

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProduct(id) : undefined;

  if (!product) {
    return (
      <div className="product-page">
        <nav className="nav">
          <Logo size={28} />
          <div className="nav-right">
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/assortiment">Assortiment</Link>
              <Link to="/#projecten">Projecten</Link>
            </div>
            <Link to="/offerte" className="nav-cta">
              Offerte aanvragen
            </Link>
          </div>
        </nav>
        <div className="product-not-found">
          <div className="product-not-found-mark">
            <Mark size={56} />
          </div>
          <h1>Product niet gevonden</h1>
          <p>Dit product bestaat niet (meer). Bekijk het volledige assortiment.</p>
          <Link to="/assortiment" className="btn btn-primary">
            Naar het assortiment →
          </Link>
        </div>
      </div>
    );
  }

  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="product-page">
      {/* NAV */}
      <nav className="nav">
        <Logo size={28} />
        <div className="nav-right">
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/assortiment">Assortiment</Link>
            <Link to="/#projecten">Projecten</Link>
          </div>
          <Link to="/offerte" className="nav-cta">
            Offerte aanvragen
          </Link>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="product-breadcrumb">
        <Link to="/">HOME</Link> &nbsp;/&nbsp;
        <Link to="/assortiment">ASSORTIMENT</Link> &nbsp;/&nbsp;
        <span className="product-breadcrumb-current">{product.name.toUpperCase()}</span>
      </div>

      {/* HERO */}
      <header className="product-hero">
        <div className="product-hero-grid">
          <div className="product-hero-image">
            {product.img ? (
              <div className="product-hero-photo" style={{ backgroundImage: `url("${product.img}")` }} />
            ) : (
              <>
                <div
                  className="product-hero-noimg-glow"
                  style={{ background: `radial-gradient(circle at 60% 40%, ${product.glow}, transparent 65%)` }}
                />
                <div className="product-hero-noimg">
                  <div className="product-hero-noimg-mark">
                    <Mark size={64} />
                  </div>
                  <div className="product-hero-noimg-label">PRODUCTFOTO</div>
                </div>
              </>
            )}
            <span className="product-hero-tag" style={{ color: product.tagColor }}>
              {product.category}
            </span>
          </div>
          <div className="product-hero-info">
            <div className="product-hero-heading">
              <h1>{product.name}</h1>
              <span className="product-hero-pitch">{product.pitch}</span>
            </div>
            <p className="product-hero-long">{product.long}</p>
            <div className="product-hero-uses">
              {product.uses.map((u) => (
                <span key={u}>{u}</span>
              ))}
            </div>
            {product.price && (
              <div className="product-hero-price">
                <span className="product-hero-price-value">{product.price}</span>
                <span className="product-hero-price-unit">{product.priceUnit}</span>
                <span className="product-hero-price-note">excl. btw · incl. opbouw</span>
              </div>
            )}
            <div className="product-hero-actions">
              <Link to={`/offerte?p=${product.id}`} className="btn btn-primary">
                Offerte aanvragen →
              </Link>
              <Link to="/assortiment" className="btn btn-secondary">
                ← Terug naar assortiment
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* SPECS + FEATURES */}
      <section className="product-details">
        <div className="product-specs-card">
          <h2>Specificaties</h2>
          <div className="product-specs-list">
            {product.specs.map(([k, v]) => (
              <div className="product-spec-row" key={k}>
                <span className="product-spec-key">{k}</span>
                <span className="product-spec-value">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="product-features-card">
          <h2>Kenmerken</h2>
          <div className="product-features-list">
            {product.features.map((f) => (
              <div className="product-feature-row" key={f}>
                <span className="product-feature-check">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
          {product.source && (
            <a href={product.source} target="_blank" rel="noopener" className="product-source-link">
              ↗ Technische bron
            </a>
          )}
        </div>
      </section>

      {/* RELATED */}
      <section className="product-related">
        <h2>Ook interessant</h2>
        <div className="product-related-grid">
          {related.map((r) => (
            <Link to={`/product/${r.id}`} className="product-related-card" key={r.id}>
              <div className="product-related-image">
                {r.img ? (
                  <div className="product-related-photo" style={{ backgroundImage: `url("${r.img}")` }} />
                ) : (
                  <>
                    <div
                      className="product-related-noimg-glow"
                      style={{ background: `radial-gradient(circle at 70% 30%, ${r.glow}, transparent 65%)` }}
                    />
                    <Mark size={38} />
                  </>
                )}
              </div>
              <div className="product-related-body">
                <span className="product-related-name">{r.name}</span>
                <span className="product-related-pitch">{r.pitch}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <Logo size={26} />
          <div className="footer-copy">© 2026 LEDsation · LED Wall Verhuur · Nederland</div>
        </div>
      </footer>
    </div>
  );
}
