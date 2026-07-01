import { useState } from "react";
import { colorForProduct } from "./demoData";
import { fmtRange, MONTHS_FULL, parseISO } from "./dateUtils";
import type { Aanvraag } from "./types";

const WEEKDAYS = ["ma", "di", "wo", "do", "vr", "za", "zo"];

function shortProductName(product: string): string {
  return product.replace(/sation$/i, "");
}

interface AgendaViewProps {
  requests: Aanvraag[];
}

export default function AgendaView({ requests }: AgendaViewProps) {
  const approved = requests
    .filter((r) => r.status === "approved")
    .map((r) => ({
      raw: r,
      s: parseISO(r.event_start),
      e: parseISO(r.event_end) ?? parseISO(r.event_start),
      color: colorForProduct(r.product),
    }))
    .filter((r): r is typeof r & { s: Date; e: Date } => r.s !== null);

  const [cal, setCal] = useState<{ year: number; month: number } | null>(null);

  const base = (() => {
    if (cal) return cal;
    const firstApproved = approved.slice().sort((a, b) => a.s.getTime() - b.s.getTime())[0];
    const d = firstApproved ? firstApproved.s : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  })();

  function goPrev() {
    let { year, month } = base;
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
    setCal({ year, month });
  }

  function goNext() {
    let { year, month } = base;
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
    setCal({ year, month });
  }

  const daysInMonth = new Date(base.year, base.month + 1, 0).getDate();
  const firstWeekday = (new Date(base.year, base.month, 1).getDay() + 6) % 7;

  interface DayCell {
    key: string;
    blank: boolean;
    day?: number;
    weekend?: boolean;
    bookings?: typeof approved;
  }

  const cells: DayCell[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push({ key: `b${i}`, blank: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(base.year, base.month, d).getTime();
    const bookings = approved.filter((r) => dt >= r.s.getTime() && dt <= r.e.getTime());
    const weekend = (firstWeekday + d - 1) % 7 >= 5;
    cells.push({ key: `d${d}`, blank: false, day: d, weekend, bookings });
  }
  while (cells.length % 7 !== 0) cells.push({ key: `t${cells.length}`, blank: true });

  const bookingsList = approved.slice().sort((a, b) => a.s.getTime() - b.s.getTime());

  const seen = new Set<string>();
  const legend = approved.filter((r) => {
    if (seen.has(r.raw.product)) return false;
    seen.add(r.raw.product);
    return true;
  });

  return (
    <div>
      <div className="dash-agenda-header">
        <div className="dash-agenda-nav">
          <button className="dash-agenda-nav-btn" onClick={goPrev}>
            ‹
          </button>
          <div className="dash-agenda-month">
            {MONTHS_FULL[base.month]} {base.year}
          </div>
          <button className="dash-agenda-nav-btn" onClick={goNext}>
            ›
          </button>
        </div>
        <div className="dash-agenda-legend">
          {legend.map((r) => (
            <div className="dash-legend-item" key={r.raw.product}>
              <span className="dash-legend-dot" style={{ background: r.color }} />
              <span>{r.raw.product}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dash-calendar">
        <div className="dash-calendar-weekdays">
          {WEEKDAYS.map((wd) => (
            <div className="dash-calendar-weekday" key={wd}>
              {wd}
            </div>
          ))}
        </div>
        <div className="dash-calendar-grid">
          {cells.map((c) =>
            c.blank ? (
              <div key={c.key} />
            ) : (
              <div
                className={"dash-calendar-cell" + (c.bookings && c.bookings.length ? " dash-calendar-cell-filled" : "")}
                key={c.key}
              >
                <div className={"dash-calendar-day" + (c.weekend ? " dash-calendar-day-weekend" : "")}>{c.day}</div>
                {(c.bookings ?? []).slice(0, 3).map((r) => (
                  <span
                    className="dash-calendar-pill"
                    style={{ background: `${r.color}26`, color: r.color }}
                    key={`${r.raw.id}_${c.day}`}
                  >
                    {shortProductName(r.raw.product)}
                  </span>
                ))}
                {(c.bookings?.length ?? 0) > 3 && (
                  <span className="dash-calendar-more">+{(c.bookings?.length ?? 0) - 3}</span>
                )}
              </div>
            ),
          )}
        </div>
      </div>

      <h2 className="dash-agenda-list-title">Geplande verhuur</h2>
      {bookingsList.length === 0 ? (
        <div className="dash-agenda-empty">
          Nog geen goedgekeurde aanvragen. Keur een aanvraag goed om die hier in te plannen.
        </div>
      ) : (
        <div className="dash-bookings-list">
          {bookingsList.map((r) => (
            <div className="dash-booking-row" key={r.raw.id}>
              <span className="dash-booking-dot" style={{ background: r.color }} />
              <div className="dash-booking-product">{r.raw.product}</div>
              <div className="dash-booking-customer">
                {(r.raw.company || r.raw.name || "—") + " · " + (r.raw.event_type || "")}
              </div>
              <div className="dash-booking-location">{r.raw.location || "—"}</div>
              <div className="dash-booking-date">{fmtRange(r.raw.event_start, r.raw.event_end)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
