import { motion } from "motion/react";
import { useApp } from "../../../context/AppContext";

export default function Register() {
  const { state, update } = useApp();
  const careers = [
    { id: "comp", label: "Computación e Informática", icon: "💻", color: "#2563EB" },
    { id: "mec",  label: "Mecánica Automotriz",       icon: "⚙️", color: "#FF9F0A" },
    { id: "elec", label: "Electricidad y Electrónica", icon: "⚡", color: "#FFD60A" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Plus Jakarta Sans',sans-serif", position: "relative", overflow: "hidden", padding: "40px 20px" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0a1628 0%,#0e2a4a 30%,#1a4a7a 55%,#1e5fa0 70%,#0d2b4e 100%)", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.015) 2px,rgba(255,255,255,0.015) 4px)", opacity: 0.5 }} />
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 600, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(37,99,235,0.2),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}
        style={{ position: "relative", zIndex: 1, width: 480, background: "rgba(10,22,44,0.85)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(37,99,235,0.28)", borderRadius: 24, padding: "40px 36px", boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(37,99,235,0.15)" }}>

        <button onClick={() => update({ view: "login" })} style={{ background: "none", border: "none", color: "rgba(125,211,252,0.6)", cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
          ← Volver al login
        </button>

        <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", marginBottom: 28, textTransform: "uppercase" as const }}>
          Crear Cuenta
        </motion.h2>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(125,211,252,0.7)", letterSpacing: "0.07em", textTransform: "uppercase" as const, marginBottom: 6 }}>Nombre de usuario</label>
          <input placeholder="ej: carlos.garcia" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid rgba(37,99,235,0.3)", fontSize: 14, color: "#fff", outline: "none", background: "rgba(255,255,255,0.06)", boxSizing: "border-box" as const }} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(125,211,252,0.7)", letterSpacing: "0.07em", textTransform: "uppercase" as const, marginBottom: 6 }}>Correo institucional</label>
          <input placeholder="correo@instituto.edu.gt" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid rgba(37,99,235,0.3)", fontSize: 14, color: "#fff", outline: "none", background: "rgba(255,255,255,0.06)", boxSizing: "border-box" as const }} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(125,211,252,0.7)", letterSpacing: "0.07em", textTransform: "uppercase" as const, marginBottom: 6 }}>Contraseña</label>
          <div style={{ position: "relative" as const }}>
            <input type={state.showRegPass ? "text" : "password"} placeholder="••••••••" style={{ width: "100%", padding: "10px 42px 10px 14px", borderRadius: 10, border: "1.5px solid rgba(37,99,235,0.3)", fontSize: 14, color: "#fff", outline: "none", background: "rgba(255,255,255,0.06)", boxSizing: "border-box" as const }} />
            <button onClick={() => update({ showRegPass: !state.showRegPass })} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(125,211,252,0.6)", fontSize: 15, padding: 0 }}>{state.showRegPass ? "🙈" : "👁"}</button>
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(125,211,252,0.7)", letterSpacing: "0.07em", textTransform: "uppercase" as const, marginBottom: 6 }}>Confirmar contraseña</label>
          <div style={{ position: "relative" as const }}>
            <input type={state.showRegPass2 ? "text" : "password"} placeholder="••••••••" style={{ width: "100%", padding: "10px 42px 10px 14px", borderRadius: 10, border: "1.5px solid rgba(37,99,235,0.3)", fontSize: 14, color: "#fff", outline: "none", background: "rgba(255,255,255,0.06)", boxSizing: "border-box" as const }} />
            <button onClick={() => update({ showRegPass2: !state.showRegPass2 })} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(125,211,252,0.6)", fontSize: 15, padding: 0 }}>{state.showRegPass2 ? "🙈" : "👁"}</button>
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(125,211,252,0.7)", letterSpacing: "0.07em", textTransform: "uppercase" as const, marginBottom: 6 }}>Carrera</label>
          <div style={{ position: "relative" as const }}>
            <select value={state.selectedCareer ?? ""} onChange={e => update({ selectedCareer: e.target.value })}
              style={{ width: "100%", padding: "11px 36px 11px 14px", borderRadius: 10, border: state.selectedCareer ? "1.5px solid #2563EB" : "1.5px solid rgba(37,99,235,0.3)", fontSize: 14, color: state.selectedCareer ? "#fff" : "rgba(255,255,255,0.4)", outline: "none", background: "rgba(255,255,255,0.06)", boxSizing: "border-box" as const, cursor: "pointer", appearance: "none" as const, WebkitAppearance: "none" as const }}>
              <option value="" disabled style={{ background: "#0d1f3f", color: "#6B7280" }}>Selecciona tu carrera...</option>
              {careers.map(c => (
                <option key={c.id} value={c.id} style={{ background: "#0d1f3f", color: "#fff" }}>{c.icon} {c.label}</option>
              ))}
            </select>
            <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(125,211,252,0.6)", fontSize: 12 }}>▼</div>
            {state.selectedCareer && (
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 16 }}>
                {careers.find(c => c.id === state.selectedCareer)?.icon}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <span onClick={() => update({ view: "login" })} style={{ fontSize: 12.5, color: "#f59e0b", cursor: "pointer", fontWeight: 500 }}>¿Ya tienes cuenta? Inicia sesión</span>
        </div>

        <motion.button whileHover={{ scale: 1.02, boxShadow: "0 10px 32px rgba(37,99,235,0.5)" }} whileTap={{ scale: 0.97 }}
          onClick={() => update({ view: "verify" })}
          style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(37,99,235,0.4)" }}>
          Continua <span style={{ fontSize: 18 }}>→</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
