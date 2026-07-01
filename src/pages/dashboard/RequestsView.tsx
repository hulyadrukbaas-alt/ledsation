import { colorForProduct } from "./demoData";
import { fmtRange, parseISO } from "./dateUtils";
import type { Aanvraag } from "./types";

const STATUS_INFO: Record<Aanvraag["status"], { label: string; className: string }> = {
  pending: { label: "Nieuw", className: "dash-status-pending" },
  approved: { label: "Goedgekeurd", className: "dash-status-approved" },
  rejected: { label: "Afgewezen", className: "dash-status-rejected" },
};

const ORDER: Record<Aanvraag["status"], number> = { pending: 0, approved: 1, rejected: 2 };
const FAR_FUTURE = 8640000000000000;

interface RequestsViewProps {
  requests: Aanvraag[];
  usingDemo: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onReset: (id: string) => void;
}

export default function RequestsView({ requests, usingDemo, onApprove, onReject, onReset }: RequestsViewProps) {
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  const sorted = requests.slice().sort((a, b) => {
    const o = ORDER[a.status] - ORDER[b.status];
    if (o) return o;
    const da = parseISO(a.event_start);
    const db = parseISO(b.event_start);
    return (da ? da.getTime() : FAR_FUTURE) - (db ? db.getTime() : FAR_FUTURE);
  });

  return (
    <div>
      {usingDemo && (
        <div className="dash-demo-banner">
          <span className="dash-demo-banner-icon">ⓘ</span>
          <span>
            Dit zijn <strong>voorbeeldaanvragen</strong>. Koppel Supabase (zie{" "}
            <code>supabase-config.js</code>) om echte formulier-aanvragen live te tonen.
          </span>
        </div>
      )}
      <div className="dash-request-stats">
        <div className="dash-stat-card dash-stat-pending">
          <div className="dash-stat-value">{pendingCount}</div>
          <div className="dash-stat-label">Nieuw · wacht op beoordeling</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-value dash-stat-value-mint">{approvedCount}</div>
          <div className="dash-stat-label">Goedgekeurd · in agenda</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-value dash-stat-value-muted">{rejectedCount}</div>
          <div className="dash-stat-label">Afgewezen</div>
        </div>
      </div>
      <div className="dash-requests-list">
        {sorted.map((r) => {
          const si = STATUS_INFO[r.status];
          const color = colorForProduct(r.product);
          return (
            <div
              className={"dash-request-card" + (r.status === "pending" ? " dash-request-card-pending" : "") + (r.status === "rejected" ? " dash-request-card-rejected" : "")}
              key={r.id}
            >
              <div className="dash-request-top">
                <div className="dash-request-main">
                  <div className="dash-request-tags">
                    <span className="dash-product-tag" style={{ color, background: `${color}22` }}>
                      {r.product || "Onbekend"}
                    </span>
                    <span className={"dash-status-tag " + si.className}>{si.label}</span>
                  </div>
                  <div className="dash-request-customer">{r.company || r.name || "—"}</div>
                  <div className="dash-request-contact">
                    {(r.event_type || "Aanvraag") + " · " + (r.name || "")}
                  </div>
                </div>
                <div className="dash-request-actions">
                  {r.status === "pending" ? (
                    <div className="dash-request-decision-btns">
                      <button className="dash-btn-mint" onClick={() => onApprove(r.id)}>
                        ✓ Goedkeuren
                      </button>
                      <button className="dash-btn-ghost" onClick={() => onReject(r.id)}>
                        Afwijzen
                      </button>
                    </div>
                  ) : (
                    <button className="dash-btn-reset" onClick={() => onReset(r.id)}>
                      Ongedaan maken
                    </button>
                  )}
                </div>
              </div>
              <div className="dash-request-details">
                <div className="dash-request-detail">
                  <div className="dash-request-detail-label">Datum</div>
                  <div className="dash-request-detail-value">{fmtRange(r.event_start, r.event_end)}</div>
                </div>
                <div className="dash-request-detail">
                  <div className="dash-request-detail-label">Locatie</div>
                  <div className="dash-request-detail-value">{r.location || "—"}</div>
                </div>
                <div className="dash-request-detail dash-request-detail-wide">
                  <div className="dash-request-detail-label">Opmerkingen</div>
                  <div className="dash-request-detail-value">{r.notes || "—"}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
