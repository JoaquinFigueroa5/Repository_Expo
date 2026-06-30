import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../../../context/AppContext";
import { C, glass, glassDark, glassBlue, inp } from "../../../constants/design";
import { useUser } from "../../../context/useUser";
import { backdropVariant, scaleIn, fadeUp } from "../../../animate/variants";
import { today, fmtDate } from "../../../utils";
import { useCreateRequest } from "../../../../hooks/useRequests";

export default function LoanFormModal() {
  const { state, update, toast } = useApp();
  const u = useUser();
  const createRequest = useCreateRequest();
  const t = state.loanFormTool;
  if (!t) return null;
  const maxDate = new Date(); maxDate.setDate(maxDate.getDate() + t.maxDays);
  const maxDateStr = maxDate.toISOString().slice(0, 10);
  const isValid = state.loanForm.qty >= 1 && state.loanForm.qty <= t.available && state.loanForm.endDate !== "";
  return (
    <AnimatePresence>
      {state.loanFormTool && (
        <motion.div variants={backdropVariant} initial="hidden" animate="visible" exit="exit"
          onClick={() => { update({ loanFormTool: null, loanStep: "form" }); }}
          style={{ position: "fixed", inset: 0, background: "rgba(6,10,20,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div variants={scaleIn} initial="hidden" animate="visible" exit="exit"
            onClick={e => e.stopPropagation()}
            style={{ ...glassDark, width: "min(520px,96vw)", maxHeight: "90vh", overflowY: "auto", borderRadius: 22, padding: "26px" }}>
          <AnimatePresence mode="wait">
          {state.loanStep === "success" ? (
            <motion.div key="success" variants={scaleIn} initial="hidden" animate="visible" style={{ textAlign: "center", padding: "20px 0" }}>
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 14, stiffness: 260, delay: 0.1 }}
                style={{ width: 72, height: 72, borderRadius: "50%", background: `${C.green}18`, border: `1px solid ${C.green}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32 }}>✅</motion.div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>¡Solicitud Enviada!</h3>
              <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.7, marginBottom: 22 }}>Tu solicitud fue registrada. El encargado te notificará cuando esté lista.</p>
              <div style={{ ...glass(0.06), borderRadius: 12, padding: "14px", marginBottom: 20, textAlign: "left" }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>Resumen:</div>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{t.name}</div>
                <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: "#94a3b8" }}>
                  <span>📅 {fmtDate(state.loanForm.startDate)}</span>
                  <span>→ {fmtDate(state.loanForm.endDate)}</span>
                  <span>×{state.loanForm.qty}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => { update({ loanFormTool: null, loanStep: "form" }); }} style={{ ...glassBlue, borderRadius: 10, padding: "10px 24px", fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", border: "none" }}>Entendido</motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => { update({ loanFormTool: null, loanStep: "form", view: "account", accountSection: "loans" }); }} style={{ ...glass(0.07), borderRadius: 10, padding: "10px 20px", fontSize: 13.5, fontWeight: 600, color: C.blue, cursor: "pointer", border: `1px solid ${C.blue}28` }}>Ver Préstamos</motion.button>
              </div>
            </motion.div>
          ) : state.loanStep === "confirm" ? (
            <motion.div key="confirm" variants={fadeUp} initial="hidden" animate="visible">
              <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 18, letterSpacing: "-0.02em" }}>Confirmar Solicitud</h3>
              <div style={{ ...glass(0.06), borderRadius: 14, padding: "16px", marginBottom: 18 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <img src={t.image} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div><div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div><div style={{ fontSize: 12, color: C.muted }}>{t.brand} · {t.code}</div></div>
                </div>
                {[{ l: "Cantidad", v: `${state.loanForm.qty} unidad(es)` }, { l: "Fecha préstamo", v: fmtDate(state.loanForm.startDate) }, { l: "Devolución", v: fmtDate(state.loanForm.endDate) }, { l: "Solicitante", v: u.name }, { l: "Carrera", v: u.career }].map(({ l, v }) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13 }}>
                    <span style={{ color: C.muted }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => update({ loanStep: "form" })} style={{ ...glass(0.06), flex: 1, borderRadius: 10, padding: "11px", fontSize: 13, fontWeight: 600, color: C.muted, cursor: "pointer", border: "1px solid rgba(255,255,255,0.07)" }}>← Editar</motion.button>
                <motion.button whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(10,132,255,0.4)" }} whileTap={{ scale: 0.97 }}
                  onClick={async () => {
                    try {
                      await createRequest.mutateAsync({
                        toolId: t.id,
                        qty: state.loanForm.qty,
                        startDate: state.loanForm.startDate,
                        endDate: state.loanForm.endDate,
                        notes: state.loanForm.notes || undefined,
                      });
                      update({ loanStep: "success" });
                    } catch (err: any) {
                      toast(err?.message || "Error al crear solicitud", "❌", "error");
                    }
                  }}
                  style={{ ...glassBlue, flex: 2, borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", border: "none", opacity: createRequest.isPending ? 0.7 : 1 }}>
                  {createRequest.isPending ? "Enviando..." : "Confirmar →"}</motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" variants={fadeUp} initial="hidden" animate="visible">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>Solicitar Préstamo</h3>
                <button onClick={() => { update({ loanFormTool: null, loanStep: "form" }); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20 }}>✕</button>
              </div>
              <div style={{ ...glass(0.06), borderRadius: 12, padding: "12px", marginBottom: 18, display: "flex", gap: 12, alignItems: "center" }}>
                <img src={t.image} alt="" style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{t.available} disponibles · Máx. {t.maxDays} días</div>
                </div>
              </div>
              {!t.careers.includes(u.career) && (
                <div style={{ ...glass(0.05), borderRadius: 10, padding: "10px 14px", marginBottom: 14, background: "rgba(255,69,58,0.07)", border: "1px solid rgba(255,69,58,0.2)", fontSize: 12.5, color: C.red, display: "flex", gap: 8, alignItems: "center" }}>
                  ⚠️ Tu carrera no está autorizada para este equipo.
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.3, display: "block", marginBottom: 6 }}>Cantidad</label>
                  <input type="number" min={1} max={t.available} value={state.loanForm.qty} onChange={e => update({ loanForm: { ...state.loanForm, qty: Math.min(t.available, Math.max(1, Number(e.target.value))) } })} style={inp} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.3, display: "block", marginBottom: 6 }}>Fecha de préstamo</label>
                    <input type="date" value={state.loanForm.startDate} min={today()} onChange={e => update({ loanForm: { ...state.loanForm, startDate: e.target.value } })} style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.3, display: "block", marginBottom: 6 }}>Devolución</label>
                    <input type="date" value={state.loanForm.endDate} min={state.loanForm.startDate || today()} max={maxDateStr} onChange={e => update({ loanForm: { ...state.loanForm, endDate: e.target.value } })} style={inp} />
                    <div style={{ fontSize: 10.5, color: C.muted, marginTop: 3 }}>Máx. {t.maxDays} días</div>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.3, display: "block", marginBottom: 6 }}>Observaciones</label>
                  <textarea rows={3} value={state.loanForm.notes} onChange={e => update({ loanForm: { ...state.loanForm, notes: e.target.value } })} placeholder="Para qué práctica o proyecto..." style={{ ...inp, resize: "vertical" }} />
                </div>
                <motion.button whileHover={{ scale: isValid ? 1.02 : 1, boxShadow: isValid ? "0 8px 28px rgba(10,132,255,0.4)" : "none" }} whileTap={{ scale: isValid ? 0.97 : 1 }}
                  onClick={() => { if (!state.loanForm.endDate) { toast("Indica la fecha de devolución", "⚠️", "error"); return; } update({ loanStep: "confirm" }); }}
                  disabled={!isValid} style={{ ...glassBlue, borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: isValid ? "pointer" : "not-allowed", border: "none", opacity: isValid ? 1 : 0.4 }}>
                  Revisar Solicitud →
                </motion.button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
