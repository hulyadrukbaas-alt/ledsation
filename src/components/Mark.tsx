const LIT_CELLS = new Set([8, 12, 1, 5, 9, 13, 6, 10, 14, 11, 15]);

interface MarkProps {
  size?: number;
  color?: string;
  dim?: string;
  glow?: boolean;
}

export default function Mark({
  size = 64,
  color = "#2DF5A6",
  dim = "rgba(255,255,255,0.06)",
  glow = true,
}: MarkProps) {
  const radius = Math.max(1, Math.round(size * 0.035));
  const gap = Math.max(1, Math.round(size * 0.07));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gridTemplateRows: "repeat(4,1fr)",
        width: size,
        height: size,
        gap,
      }}
    >
      {Array.from({ length: 16 }, (_, i) => {
        const on = LIT_CELLS.has(i);
        return (
          <div
            key={i}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: radius,
              background: on ? color : dim,
              boxShadow: on && glow ? `0 0 ${Math.round(size * 0.18)}px ${color}66` : "none",
            }}
          />
        );
      })}
    </div>
  );
}
