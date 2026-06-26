import { motion } from "motion/react";
import { useApp } from "../../../context/AppContext";

export default function ForgotPassword() {
  const { update } = useApp();

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Plus Jakarta Sans',sans-serif", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#0a1628 0%,#0d1f3f 50%,#091422 100%)" }}>
      <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translateX(-50%)", width: 500, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(37,99,235,0.18),transparent 70%)", pointerEvents: "none" }} />

      <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
        style={{ position: "relative", zIndex: 1, width: 420, background: "#fff", borderRadius: 22, padding: "44px 38px", boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 60px rgba(37,99,235,0.12)" }}>

        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 22 }}>🔑</div>

        <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 8 }}>Olvidé mi contraseña</h2>
        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, marginBottom: 28 }}>
          Ingresa tu correo institucional y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Correo institucional</label>
          <input placeholder="correo@instituto.edu.gt" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, color: "#111827", outline: "none", background: "#F9FAFB", boxSizing: "border-box" as const }} />
        </div>

        <motion.button whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(37,99,235,0.4)" }} whileTap={{ scale: 0.97 }}
          onClick={() => update({ view: "verify" })}
          style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 18, boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}>
          Enviar enlace de recuperación
        </motion.button>

        <button onClick={() => update({ view: "login" })} style={{ width: "100%", padding: "11px", background: "none", border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#6B7280", cursor: "pointer" }}>
          ← Volver al login
        </button>
      </motion.div>
    </div>
  );
}
