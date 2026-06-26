import type { CSSProperties } from "react";
import { STATUS_MAP } from "../../constants/design";

export function Badge({ s }: { s: string }) {
  const c = STATUS_MAP[s] || STATUS_MAP.pending;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: c.bg, color: c.color, border: `1px solid ${c.color}28`, letterSpacing: 0.3, whiteSpace: "nowrap" as const, textTransform: "uppercase" as const }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
      {c.label}
    </span>
  );
}
