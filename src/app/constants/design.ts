import type { CSSProperties } from "react";

export const C = {
  blue: "#0A84FF", green: "#30D158", yellow: "#FFD60A",
  orange: "#FF9F0A", red: "#FF453A", purple: "#BF5AF2",
  muted: "#6B7FA8", dim: "rgba(255,255,255,0.35)",
  text: "#E8EEFF", surface: "rgba(255,255,255,0.05)",
};

export const glass = (opacity = 0.05, blur = 20): CSSProperties => ({
  background: `rgba(255,255,255,${opacity})`,
  backdropFilter: `blur(${blur}px) saturate(180%)`,
  WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
  border: "1px solid rgba(255,255,255,0.09)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
});

export const glassDark: CSSProperties = {
  background: "rgba(6,10,20,0.92)",
  backdropFilter: "blur(32px) saturate(200%)",
  WebkitBackdropFilter: "blur(32px) saturate(200%)",
  border: "1px solid rgba(255,255,255,0.07)",
  boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
};

export const glassBlue: CSSProperties = {
  background: "linear-gradient(135deg,#0A84FF,#0066CC)",
  border: "1px solid rgba(255,255,255,0.2)",
  boxShadow: "0 8px 24px rgba(10,132,255,0.35)",
};

export const glassGreen: CSSProperties = {
  background: "linear-gradient(135deg,#30D158,#25A244)",
  border: "1px solid rgba(255,255,255,0.2)",
  boxShadow: "0 6px 20px rgba(48,209,88,0.3)",
};

export const inp: CSSProperties = {
  ...glass(0.05, 12),
  borderRadius: 10, padding: "9px 12px", fontSize: 13,
  outline: "none", color: "#E8EEFF", width: "100%",
};

export const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  available:   { label: "Disponible",    color: C.green,  bg: "rgba(48,209,88,0.12)" },
  in_use:      { label: "En Uso",        color: C.red,    bg: "rgba(255,69,58,0.12)" },
  maintenance: { label: "Mantenimiento", color: C.muted,  bg: "rgba(107,127,168,0.12)" },
  reserved:    { label: "Reservado",     color: C.orange, bg: "rgba(255,159,10,0.12)" },
  active:      { label: "Activo",        color: C.blue,   bg: "rgba(10,132,255,0.12)" },
  returned:    { label: "Devuelto",      color: C.green,  bg: "rgba(48,209,88,0.12)" },
  overdue:     { label: "Atrasado",      color: C.red,    bg: "rgba(255,69,58,0.12)" },
  pending:     { label: "Pendiente",     color: C.yellow, bg: "rgba(255,214,10,0.12)" },
  approved:    { label: "Aprobado",      color: C.green,  bg: "rgba(48,209,88,0.12)" },
  rejected:    { label: "Rechazado",     color: C.red,    bg: "rgba(255,69,58,0.12)" },
};

export const pageBg: CSSProperties = {
  fontFamily: "'Inter','Plus Jakarta Sans',sans-serif",
  background: "radial-gradient(ellipse at 20% 0%, rgba(10,132,255,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(191,90,242,0.08) 0%, transparent 50%), #060A14",
  backgroundAttachment: "fixed",
  color: C.text,
  minHeight: "100vh",
};
