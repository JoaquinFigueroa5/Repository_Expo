import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../../../context/AppContext";
import { C, glass, glassDark, glassBlue, STATUS_MAP } from "../../../constants/design";
import { useUser } from "../../../context/useUser";
import { backdropVariant, scaleIn } from "../../../animate/variants";
import { Badge } from "../../atoms/Badge";
import { fmtDate } from "../../../utils";
import { useTool } from "../../../../hooks/useTools";
import { mapApiToolToTool } from "../../../../lib/mappers";

export default function ToolModal() {
  const { state, update, toast, openLoanForm } = useApp();
  const u = useUser();
  const selected = state.selectedTool;
  const { data: liveTool } = useTool(selected?.id ?? 0);
  const t = liveTool ? { ...mapApiToolToTool(liveTool), specs: selected?.specs ?? [] } : selected;
  if (!t) return null;
  const sc = STATUS_MAP[t.status];
  const isAuth = t.careers.includes(u.career);
  const recentLoans = state.loans.filter(l => l.toolId === t.id).slice(-3);
  const catCol = CAT_COLORS[t.cat] || C.blue;
  return (
    <AnimatePresence>
      {state.selectedTool && (
        <>
          <motion.div variants={backdropVariant} initial="hidden" animate="visible" exit="exit"
            onClick={() => update({ selectedTool: null })}
            style={{ position: "fixed", inset: 0, background: "rgba(6,10,20,0.8)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div variants={scaleIn} initial="hidden" animate="visible" exit="exit"
              onClick={e => e.stopPropagation()}
              style={{ ...glassDark, width: "min(940px,96vw)", maxHeight: "90vh", overflowY: "auto", borderRadius: 22 }}>
              <div style={{ position: "relative", height: 250, overflow: "hidden" }}>
                <img src={t.image} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(6,10,20,0.98) 0%,rgba(6,10,20,0.2) 60%,transparent 100%)" }} />
                <button onClick={() => update({ selectedTool: null })} style={{ position: "absolute", top: 14, right: 14, ...glass(0.3, 12), border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.text, fontSize: 16 }}>✕</button>
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: [0.22,1,0.36,1] }}
                  style={{ position: "absolute", bottom: 20, left: 24, right: 24 }}>
                  <Badge s={t.status} />
                  <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 26, fontWeight: 800, marginTop: 8, lineHeight: 1.2, color: C.text, letterSpacing: "-0.02em" }}>{t.name}</h2>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{t.brand} · <span style={{ color: catCol, fontWeight: 600 }}>{t.code}</span></div>
                </motion.div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 22, padding: "22px" }}>
                <div>
                  <p style={{ fontSize: 13.5, color: "#94a3b8", lineHeight: 1.8, marginBottom: 20 }}>{t.desc}</p>
                  <h3 style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Especificaciones</h3>
                  <div style={{ ...glass(0.05), borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
                    {t.specs.map((sp, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: i < t.specs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <span style={{ fontSize: 13, color: C.muted }}>{sp.k}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{sp.v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                    {[{ icon: "📍", l: "Ubicación", v: t.location }, { icon: "⏱️", l: "Máx. días", v: `${t.maxDays} días` }, { icon: "📦", l: "Total", v: `${t.totalQty} uds.` }].map(({ icon, l, v }) => (
                      <div key={l} style={{ ...glass(0.05), borderRadius: 12, padding: "12px", textAlign: "center" }}>
                        <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
                        <div style={{ fontSize: 10.5, color: C.muted, marginBottom: 2 }}>{l}</div>
                        <div style={{ fontSize: 12.5, fontWeight: 700 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {recentLoans.length > 0 && (
                    <>
                      <h3 style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Historial Reciente</h3>
                      <div style={{ ...glass(0.05), borderRadius: 12, overflow: "hidden" }}>
                        {[...recentLoans].reverse().map((l, i) => (
                          <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: i < recentLoans.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", fontSize: 12.5 }}>
                            <span style={{ color: "#94a3b8" }}>Préstamo #{l.id} · {fmtDate(l.loanDate)}</span>
                            <Badge s={l.status} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ ...glass(0.06), borderRadius: 16, padding: "18px", textAlign: "center", border: `1px solid ${t.available > 0 ? C.green : C.red}20` }}>
                    <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>Disponibilidad</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 54, fontWeight: 800, color: t.available > 0 ? C.green : C.red, lineHeight: 1, letterSpacing: "-0.03em" }}>{t.available}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>de {t.totalQty} unidades</div>
                    <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, height: 6, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: t.available > 0 ? C.green : C.red, borderRadius: 8, width: `${(t.available / t.totalQty) * 100}%`, transition: "width 0.5s" }} />
                    </div>
                  </div>
                  <div style={{ ...glass(0.05), borderRadius: 14, padding: "14px" }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Autorización</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, padding: "8px 10px", borderRadius: 10, background: isAuth ? "rgba(48,209,88,0.08)" : "rgba(255,69,58,0.08)", border: `1px solid ${isAuth ? "rgba(48,209,88,0.2)" : "rgba(255,69,58,0.2)"}`, marginBottom: 10 }}>
                      <span style={{ fontSize: 15 }}>{isAuth ? "✅" : "❌"}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: isAuth ? C.green : C.red, fontSize: 12 }}>{isAuth ? "Autorizado" : "No Autorizado"}</div>
                        <div style={{ color: C.muted, fontSize: 10.5 }}>{u.career}</div>
                      </div>
                    </div>
                    {t.careers.map(c => (
                      <div key={c} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0", fontSize: 11.5, color: "#94a3b8" }}>
                        <span style={{ color: C.green, fontSize: 11 }}>✓</span> {c}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { if (!isAuth) { toast("Tu carrera no está autorizada", "⚠️", "error"); return; } if (t.available === 0) { toast("Sin unidades disponibles", "⚠️", "error"); return; } openLoanForm(t); }}
                    style={{ ...glassBlue, width: "100%", padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: isAuth && t.available > 0 ? "pointer" : "not-allowed", color: "#fff", opacity: isAuth && t.available > 0 ? 1 : 0.4, border: "none" }}>
                    Solicitar Préstamo →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
