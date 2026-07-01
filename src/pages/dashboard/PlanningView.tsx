import type { ScheduleEvent } from "./types";

interface PlanningViewProps {
  schedule: ScheduleEvent[];
}

export default function PlanningView({ schedule }: PlanningViewProps) {
  return (
    <div className="dash-planning-card">
      <div className="dash-planning-header">
        <div className="dash-planning-date">Woensdag 1 september</div>
        <div className="dash-planning-now">
          <span className="dash-live-dot" />
          Nu 10:52
        </div>
      </div>
      {schedule.map((ev) => (
        <div className="dash-planning-row" key={ev.id}>
          <div className="dash-planning-time">{ev.time}</div>
          <div className="dash-planning-bar" style={{ background: ev.color }} />
          <div className="dash-planning-info">
            <div className="dash-planning-title-row">
              <span className="dash-planning-title">{ev.title}</span>
              {ev.live && <span className="dash-planning-live-badge">NU LIVE</span>}
            </div>
            <div className="dash-planning-detail">{ev.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
