import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../../../context/AppContext";
import { C, glass, glassDark, glassBlue, inp } from "../../../constants/design";
import { useUser } from "../../../context/useUser";
import { backdropVariant, scaleIn, fadeUp } from "../../../animate/variants";
import { today, fmtDate } from "../../../utils";
import { useCreateRequest } from "../../../../hooks/useRequests";
import { CAT_ICONS } from "../../../constants/design";

export default function CartModal() {
  const { state, update, toast, removeFromCart, updateCartItem, clearCart } = useApp();
  const u = useUser();
  const createRequest = useCreateRequest();
  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"cart" | "confirm" | "success">("cart");

  const minEnd = startDate || today();

  useEffect(() => {
    if (!state.cartModalOpen) { setStep("cart"); setEndDate(""); setNotes(""); }
  }, [state.cartModalOpen]);

  const isValid = state.cart.length > 0 && state.cart.every(c => {
    const t = c.tool;
    return c.qty >= 1 && c.qty <= t.available;
  }) && endDate !== "";

  const handleSubmit = async () => {
    try {
      await createRequest.mutateAsync({
        items: state.cart.map(c => ({
          toolId: c.toolId,
          qty: c.qty,
          startDate,
          endDate,
        })),
        notes: notes || undefined,
      });
      setStep("success");
    } catch (err: any) {
      toast(err?.message || "Error al crear solicitud", "❌", "error");
    }
  };

  const availableCount = (toolId: number) => {
    const t = state.tools.find(t => t.id === toolId);
    return t?.available || 0;
  };

  const maxDays = () => {
    return Math.min(...state.cart.map(c => c.tool.maxDays), 30);
  };

  const maxDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + maxDays());
    return d.toISOString().slice(0, 10);
  };

  if (!state.cartModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div variants={backdropVariant} initial="hidden" animate="visible" exit="exit"
        onClick={() => { update({ cartModalOpen: false }); }}
        style={{ position: "fixed", inset: 0, background: "rgba(6,10,20,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div variants={scaleIn} initial="hidden" animate="visible" exit="exit"
          onClick={e => e.stopPropagation()}
          style={{ ...glassDark, width: "min(560px,96vw)", maxHeight: "90vh", overflowY: "auto", borderRadius: 22, padding: "26px" }}>
          <AnimatePresence mode="wait">
          {step === "success" ? (
            <motion.div key="success" variants={scaleIn} initial="hidden" animate="visible" style={{ textAlign: "center", padding: "20px 0" }}>
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 14, stiffness: 260, delay: 0.1 }}
                style={{ width: 72, height: 72, borderRadius: "50%", background: `${C.green}18`, border: `1px solid ${C.green}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32 }}>✅</motion.div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>¡Solicitud Enviada!</h3>
              <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.7, marginBottom: 22 }}>Tu solicitud de {state.cart.length} equipo(s) fue registrada.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => { clearCart(); update({ cartModalOpen: false }); }} style={{ ...glassBlue, borderRadius: 10, padding: "10px 24px", fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", border: "none" }}>Entendido</motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => { clearCart(); update({ cartModalOpen: false, view: "account", accountSection: "loans" }); }} style={{ ...glass(0.07), borderRadius: 10, padding: "10px 20px", fontSize: 13.5, fontWeight: 600, color: C.blue, cursor: "pointer", border: `1px solid ${C.blue}28` }}>Ver Préstamos</motion.button>
              </div>
            </motion.div>
          ) : step === "confirm" ? (
            <motion.div key="confirm" variants={fadeUp} initial="hidden" animate="visible">
              <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 18, letterSpacing: "-0.02em" }}>Confirmar Solicitud</h3>
              <div style={{ ...glass(0.06), borderRadius: 14, padding: "16px", marginBottom: 18 }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{state.cart.length} equipo(s) en la solicitud:</div>
                {state.cart.map(c => (
                  <div key={c.toolId} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <img src={c.tool.image} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{c.tool.name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>#{c.tool.code} ×{c.qty}</div>
                    </div>
                  </div>
                ))}
                {[{ l: "Desde", v: fmtDate(startDate) }, { l: "Hasta", v: fmtDate(endDate) }, { l: "Solicitante", v: u.name }, { l: "Carrera", v: u.career }].map(({ l, v }) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13 }}>
                    <span style={{ color: C.muted }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setStep("cart")} style={{ ...glass(0.06), flex: 1, borderRadius: 10, padding: "11px", fontSize: 13, fontWeight: 600, color: C.muted, cursor: "pointer", border: "1px solid rgba(255,255,255,0.07)" }}>← Editar</motion.button>
                <motion.button whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(10,132,255,0.4)" }} whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  style={{ ...glassBlue, flex: 2, borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", border: "none", opacity: createRequest.isPending ? 0.7 : 1 }}>
                  {createRequest.isPending ? "Enviando..." : "Confirmar →"}</motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="cart" variants={fadeUp} initial="hidden" animate="visible">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>
                  Carrito <span style={{ fontSize: 14, fontWeight: 400, color: C.muted }}>({state.cart.length})</span>
                </h3>
                <div style={{ display: "flex", gap: 8 }}>
                  {state.cart.length > 0 && (
                    <button onClick={() => { clearCart(); toast("Carrito vaciado", "🗑️", "info"); }} style={{ ...glass(0.05), borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, color: C.red, cursor: "pointer", border: "none" }}>Vaciar</button>
                  )}
                  <button onClick={() => update({ cartModalOpen: false })} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20 }}>✕</button>
                </div>
              </div>

              {state.cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>🛒</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Carrito vacío</div>
                  <div style={{ fontSize: 12.5 }}>Agrega herramientas desde el catálogo.</div>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    {state.cart.map(c => {
                      const avail = availableCount(c.toolId);
                      return (
                        <div key={c.toolId} style={{ ...glass(0.05), borderRadius: 12, padding: "11px 14px", display: "flex", gap: 10, alignItems: "center" }}>
                          <img src={c.tool.image} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>{c.tool.name}</div>
                            <div style={{ fontSize: 10.5, color: C.muted, marginTop: 1 }}>{CAT_ICONS[c.tool.cat] || "📦"} {c.tool.cat} · Máx {c.tool.maxDays} días</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <button onClick={() => updateCartItem(c.toolId, { qty: Math.max(1, c.qty - 1) })}
                              style={{ ...glass(0.06), borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none", color: C.text, fontSize: 14, fontWeight: 700 }}>−</button>
                            <span style={{ fontSize: 14, fontWeight: 700, minWidth: 24, textAlign: "center" }}>{c.qty}</span>
                            <button onClick={() => updateCartItem(c.toolId, { qty: Math.min(avail, c.qty + 1) })}
                              style={{ ...glass(0.06), borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none", color: C.text, fontSize: 14, fontWeight: 700 }}>+</button>
                          </div>
                          <button onClick={() => { removeFromCart(c.toolId); toast(`${c.tool.name} eliminado`, "🗑️", "info"); }}
                            style={{ ...glass(0.05), borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none", color: C.red, fontSize: 12 }}>✕</button>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.3, display: "block", marginBottom: 6 }}>Fecha de préstamo</label>
                      <input type="date" value={startDate} min={today()} onChange={e => setStartDate(e.target.value)} style={inp} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.3, display: "block", marginBottom: 6 }}>Devolución</label>
                      <input type="date" value={endDate} min={minEnd} max={maxDate()} onChange={e => setEndDate(e.target.value)} style={inp} />
                      <div style={{ fontSize: 10.5, color: C.muted, marginTop: 3 }}>Máx. {maxDays()} días</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.3, display: "block", marginBottom: 6 }}>Observaciones</label>
                    <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Para qué práctica o proyecto..." style={{ ...inp, resize: "vertical" }} />
                  </div>

                  <motion.button whileHover={{ scale: isValid ? 1.02 : 1, boxShadow: isValid ? "0 8px 28px rgba(10,132,255,0.4)" : "none" }} whileTap={{ scale: isValid ? 0.97 : 1 }}
                    onClick={() => { if (!endDate) { toast("Indica la fecha de devolución", "⚠️", "error"); return; } setStep("confirm"); }}
                    disabled={!isValid} style={{ ...glassBlue, borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: isValid ? "pointer" : "not-allowed", border: "none", width: "100%", opacity: isValid ? 1 : 0.4 }}>
                    Revisar Solicitud ({state.cart.reduce((s, c) => s + c.qty, 0)} unidades) →
                  </motion.button>
                </>
              )}
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
