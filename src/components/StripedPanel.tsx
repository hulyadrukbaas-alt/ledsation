import type { CSSProperties, ReactNode } from "react";

interface StripedPanelProps {
  stripeSize?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export default function StripedPanel({ stripeSize = 14, className, style, children }: StripedPanelProps) {
  return (
    <div
      className={className}
      style={{
        background: `repeating-linear-gradient(45deg, var(--color-card-bg-alt), var(--color-card-bg-alt) ${stripeSize}px, var(--color-card-bg-alt-2) ${stripeSize}px, var(--color-card-bg-alt-2) ${stripeSize * 2}px)`,
        border: "1px solid var(--color-border)",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
