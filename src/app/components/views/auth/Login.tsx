import { useState } from "react";
import { motion } from "motion/react";
import { useApp } from "../../../context/AppContext";
import { useLogin } from "../../../../hooks/useAuth";

export default function Login() {
  const { state, update, toast } = useApp();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      toast("Completa todos los campos", "⚠️", "error");
      return;
    }
    try {
      await login.mutateAsync({ email: email.trim(), password });
      update({ view: "catalog" });
    } catch (err: any) {
      toast(err?.message || "Error al iniciar sesión", "❌", "error");
    }
  };

  return (
    <div className="login-layout" style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg,#0a1628 0%,#0d1f3f 40%,#091422 100%)", fontFamily: "'Inter','Plus Jakarta Sans',sans-serif", color: "#fff" }}>
      <div className="login-left" style={{ flex: 1, display: "flex", flexDirection: "column" as const, justifyContent: "space-between", padding: "48px 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,0.18),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "0%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(56,189,248,0.09),transparent 70%)", pointerEvents: "none" }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <img src="/imports/E__2_-2.png" alt="REMA" style={{ height: 52, width: "auto", filter: "brightness(1.1) drop-shadow(0 0 12px rgba(56,189,248,0.45))" }} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease: [0.22,1,0.36,1] }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 52, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#fff", marginBottom: 16 }}>
            BIENVENIDOS<br />DE VUELTA
          </h1>
          <p style={{ fontSize: 15, color: "rgba(125,211,252,0.6)", lineHeight: 1.7, maxWidth: 340 }}>
            Accede al sistema de gestión de préstamos de herramientas del Instituto Técnico.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>MANTENIENDO A FLOTE EL ORDEN · 2026</p>
        </motion.div>
      </div>

      <div className="login-right" style={{ width: 460, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px", background: "rgba(255,255,255,0.02)", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.5, ease: [0.22,1,0.36,1] }}
          className="login-card" style={{ width: "100%", background: "#fff", borderRadius: 20, padding: "40px 36px", boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(37,99,235,0.15)" }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 28, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 28 }}>Login</h2>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Correo electrónico</label>
            <input value={email} onChange={e => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, color: "#111827", outline: "none", background: "#F9FAFB", boxSizing: "border-box" as const }} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Contraseña</label>
            <div style={{ position: "relative" as const }}>
              <input type={state.showLoginPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                style={{ width: "100%", padding: "11px 42px 11px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, color: "#111827", outline: "none", background: "#F9FAFB", boxSizing: "border-box" as const }} />
              <button onClick={() => update({ showLoginPass: !state.showLoginPass })} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 16, padding: 0 }}>
                {state.showLoginPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <div style={{ textAlign: "right" as const, marginBottom: 26 }}>
            <span onClick={() => update({ view: "forgot" })} style={{ fontSize: 12.5, color: "#2563EB", cursor: "pointer", fontWeight: 500 }}>Olvidé mi contraseña</span>
          </div>

          <motion.button whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(37,99,235,0.45)" }} whileTap={{ scale: 0.97 }}
            onClick={handleSubmit} disabled={login.isPending}
            style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px rgba(37,99,235,0.35)", opacity: login.isPending ? 0.7 : 1 }}>
            {login.isPending ? "Entrando..." : <>Vamos <span style={{ fontSize: 18 }}>→</span></>}
          </motion.button>

          <p style={{ textAlign: "center" as const, marginTop: 22, fontSize: 13, color: "#6B7280" }}>
            No tienes una cuenta?{" "}
            <span onClick={() => update({ view: "register" })} style={{ color: "#2563EB", fontWeight: 700, cursor: "pointer" }}>Regístrate</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
