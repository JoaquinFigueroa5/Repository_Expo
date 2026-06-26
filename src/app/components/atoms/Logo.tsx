import { C } from "../../constants/design";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
      <div style={{ width: compact ? 32 : 36, height: compact ? 32 : 36, borderRadius: 10, background: "linear-gradient(135deg,#0A84FF22,#BF5AF222)", border: "1px solid rgba(10,132,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width={compact ? 16 : 18} height={compact ? 16 : 18} viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      </div>
      {!compact && (
        <div>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 14, color: C.text, lineHeight: 1.1, letterSpacing: "-0.02em" }}>INSTITUTO TÉCNICO</div>
          <div style={{ fontSize: 9.5, color: C.muted, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Gestión de Inventario</div>
        </div>
      )}
    </div>
  );
}
