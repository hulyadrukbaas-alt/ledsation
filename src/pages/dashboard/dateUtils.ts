const MONTHS_SHORT = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
export const MONTHS_FULL = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December",
];

export function parseISO(s: string | null | undefined): Date | null {
  if (!s) return null;
  const p = s.split("T")[0].split("-").map(Number);
  if (p.length < 3 || !p[0]) return null;
  return new Date(p[0], p[1] - 1, p[2]);
}

export function fmtRange(a: string | null | undefined, b: string | null | undefined): string {
  const sa = parseISO(a);
  if (!sa) return "—";
  const sb = parseISO(b) ?? sa;
  const d1 = sa.getDate(), m1 = sa.getMonth(), d2 = sb.getDate(), m2 = sb.getMonth();
  if (sa.getTime() === sb.getTime()) return `${d1} ${MONTHS_SHORT[m1]}`;
  if (m1 === m2) return `${d1}–${d2} ${MONTHS_SHORT[m1]}`;
  return `${d1} ${MONTHS_SHORT[m1]} – ${d2} ${MONTHS_SHORT[m2]}`;
}
