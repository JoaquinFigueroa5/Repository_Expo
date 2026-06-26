import { motion } from "motion/react";
import { useApp } from "../../../context/AppContext";

export default function VerifyCode() {
  const { state, update } = useApp();

  const handleDigit = (val: string, idx: number) => {
    const next = [...state.verifyCode];
    next[idx] = val.slice(-1);
    update({ verifyCode: next });
    if (val && idx < 5) {
      const el = document.getElementById(`vcode-${idx + 1}`);
      el?.focus();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !state.verifyCode[idx] && idx > 0) {
      document.getElementById(`vcode-${idx - 1}`)?.focus();
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Plus Jakarta Sans',sans-serif", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#0a1628 0%,#0d1f3f 50%,#091422 100%)" }}>
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(37,99,235,0.2),transparent 70%)", pointerEvents: "none" }} />

      <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
        style={{ position: "relative", zIndex: 1, width: 440, background: "#fff", borderRadius: 22, padding: "48px 40px", boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 60px rgba(37,99,235,0.12)", textAlign: "center" as const }}>

        <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 24px" }}>✉️</motion.div>

        <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 10 }}>Verifica tu correo</h2>
        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, marginBottom: 32 }}>
          Enviamos un código de 6 dígitos a tu correo institucional. Ingrésalo para continuar.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 32 }}>
          {state.verifyCode.map((digit, i) => (
            <input key={i} id={`vcode-${i}`} maxLength={1} value={digit}
              onChange={e => handleDigit(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              style={{ width: 52, height: 60, textAlign: "center" as const, fontSize: 24, fontWeight: 800, color: "#111827", background: digit ? "#EFF6FF" : "#F9FAFB", border: digit ? "2px solid #2563EB" : "2px solid #E5E7EB", borderRadius: 12, outline: "none", boxSizing: "border-box" as const, transition: "border-color 0.2s, background 0.2s" }} />
          ))}
        </div>

        <motion.button whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(37,99,235,0.4)" }} whileTap={{ scale: 0.97 }}
          onClick={() => update({ view: "catalog" })}
          style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 18, boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}>
          Verificar cuenta →
        </motion.button>

        <p style={{ fontSize: 13, color: "#9CA3AF" }}>
          ¿No recibiste el código?{" "}
          <span style={{ color: "#2563EB", fontWeight: 700, cursor: "pointer" }}>Reenviar</span>
        </p>
        <button onClick={() => update({ view: "login" })} style={{ marginTop: 14, background: "none", border: "none", color: "#9CA3AF", fontSize: 13, cursor: "pointer" }}>
          ← Volver al login
        </button>
      </motion.div>
    </div>
  );
}
