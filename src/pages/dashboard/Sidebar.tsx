import Mark from "../../components/Mark";
import type { DashboardView } from "./types";

interface NavItem {
  key: DashboardView;
  label: string;
}

const NAV_MAIN: NavItem[] = [
  { key: "content", label: "Mijn content" },
  { key: "screens", label: "Mijn schermen" },
  { key: "playlists", label: "Afspeellijsten" },
  { key: "planning", label: "Planning" },
];

const NAV_BIZ: NavItem[] = [
  { key: "requests", label: "Aanvragen" },
  { key: "agenda", label: "Verhuuragenda" },
];

interface SidebarProps {
  view: DashboardView;
  onViewChange: (view: DashboardView) => void;
  pendingCount: number;
  canLogout: boolean;
  onLogout: () => void;
}

export default function Sidebar({ view, onViewChange, pendingCount, canLogout, onLogout }: SidebarProps) {
  function renderItem(item: NavItem) {
    const active = view === item.key;
    const badge = item.key === "requests" && pendingCount > 0 ? pendingCount : null;
    return (
      <div
        key={item.key}
        className={"dash-nav-item" + (active ? " dash-nav-item-active" : "")}
        onClick={() => onViewChange(item.key)}
      >
        <span className="dash-nav-dot" />
        <span className="dash-nav-label">{item.label}</span>
        {badge !== null && <span className="dash-nav-badge">{badge}</span>}
      </div>
    );
  }

  return (
    <aside className="dash-sidebar">
      <div className="dash-brand">
        <Mark size={26} />
        <span className="brand-text">
          <span className="gradient-text">LED</span>sation
        </span>
      </div>
      {NAV_MAIN.map(renderItem)}
      <div className="dash-nav-section-label">Verhuur</div>
      {NAV_BIZ.map(renderItem)}
      <div className="dash-sidebar-footer">
        <div className="dash-sidebar-account">
          <div className="dash-sidebar-avatar">D</div>
          <div>
            <div className="dash-sidebar-account-name">DTF.nl</div>
            <div className="dash-sidebar-account-sub">Supplierdays · 1 sept</div>
          </div>
        </div>
        {canLogout && (
          <button className="dash-logout-btn" onClick={onLogout}>
            Uitloggen
          </button>
        )}
      </div>
    </aside>
  );
}
