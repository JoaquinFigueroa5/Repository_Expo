import type { ReactNode } from "react";
import { C } from "../../constants/design";

export function TH({ children }: { children: ReactNode }) {
  return <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase" as const, letterSpacing: 0.5, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{children}</th>;
}

export function TD({ children, colSpan }: { children?: ReactNode; colSpan?: number }) {
  return <td colSpan={colSpan} style={{ padding: "11px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)", verticalAlign: "middle" as const }}>{children}</td>;
}

export function Table({ children }: { children: ReactNode }) {
  return <div style={{ overflowX: "auto" as const }}><table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13 }}>{children}</table></div>;
}
