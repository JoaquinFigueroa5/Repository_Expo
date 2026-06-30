import { useState } from "react";
import { motion } from "motion/react";
import { useApp } from "../../../context/AppContext";
import { useVerifyCode, useResetPassword } from "../../../../hooks/useAuth";

export default function VerifyCode() {
  const { state, update, toast } = useApp();
  const verify = useVerifyCode();
  const reset = useResetPassword();
  const [step, setStep] = useState<"code" | "newpass">("code");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const code = state.verifyCode.join("");

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

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast("Ingresa el código completo de 6 dígitos", "⚠️", "error");
      return;
    }

    if (!state.verifyEmail) {
      update({ view: "catalog", verifyCode: ["", "", "", "", "", ""] });
      return;
    }

    try {
      await verify.mutateAsync({ email: state.verifyEmail, code });
      toast("Código verificado", "✅", "success");
      if (state.verifyMode === "register") {
        update({ view: "catalog", verifyCode: ["", "", "", "", "", ""], verifyEmail: "" });
      } else {
        setStep("newpass");
      }
    } catch (err: any) {
      toast(err?.message || "Código inválido", "❌", "error");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast("La contraseña debe tener al menos 6 caracteres", "⚠️", "error");
      return;
    }
    if (newPassword !== confirmPass) {
      toast("Las contraseñas no coinciden", "❌", "error");
      return;
    }
    try {
      await reset.mutateAsync({
        email: state.verifyEmail,
        code,
        newPassword,
      });
      toast("Contraseña actualizada. Inicia sesión con tu nueva contraseña", "✅", "success");
      update({ view: "login", verifyCode: ["", "", "", "", "", ""], verifyEmail: "" });
    } catch (err: any) {
      toast(err?.message || "Error al restablecer contraseña", "❌", "error");
    }
  };

  const handleResend = async () => {
    if (!state.verifyEmail) {
      toast("No hay correo registrado para reenvío", "⚠️", "error");
      return;
    }
    const { api } = await import("../../../../lib/api");
    try {
      await api.post<{ message: string }>("/auth/forgot-password", { email: state.verifyEmail });
      toast("Nuevo código enviado a tu correo", "📧", "info");
    } catch (err: any) {
      toast(err?.message || "Error al reenviar", "❌", "error");
    }
  };

  if (step === "newpass") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Plus Jakarta Sans',sans-serif", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#0a1628 0%,#0d1f3f 50%,#091422 100%)" }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(37,99,235,0.2),transparent 70%)", pointerEvents: "none" }} />
        <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
          style={{ position: "relative", zIndex: 1, width: 420, background: "#fff", borderRadius: 22, padding: "44px 38px", boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 60px rgba(37,99,235,0.12)" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 22 }}>🔐</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 24, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 8 }}>Nueva contraseña</h2>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, marginBottom: 28 }}>Crea una contraseña nueva para tu cuenta.</p>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Nueva contraseña</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, color: "#111827", outline: "none", background: "#F9FAFB", boxSizing: "border-box" as const }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Confirmar contraseña</label>
            <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, color: "#111827", outline: "none", background: "#F9FAFB", boxSizing: "border-box" as const }} />
          </div>

          <motion.button whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(37,99,235,0.4)" }} whileTap={{ scale: 0.97 }}
            onClick={handleResetPassword} disabled={reset.isPending}
            style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(37,99,235,0.35)", opacity: reset.isPending ? 0.7 : 1 }}>
            {reset.isPending ? "Actualizando..." : "Restablecer contraseña"}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Plus Jakarta Sans',sans-serif", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#0a1628 0%,#0d1f3f 50%,#091422 100%)" }}>
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(37,99,235,0.2),transparent 70%)", pointerEvents: "none" }} />

      <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
        style={{ position: "relative", zIndex: 1, width: 440, background: "#fff", borderRadius: 22, padding: "48px 40px", boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 60px rgba(37,99,235,0.12)", textAlign: "center" as const }}>

        <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 24px" }}>✉️</motion.div>

        <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", marginBottom: 10 }}>
          {state.verifyEmail ? "Verifica tu código" : "Verifica tu correo"}
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, marginBottom: 32 }}>
          {state.verifyEmail
            ? "Ingresa el código de 6 dígitos que enviamos a tu correo."
            : "Enviamos un código de 6 dígitos a tu correo institucional. Ingrésalo para continuar."}
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
          onClick={handleVerifyCode} disabled={verify.isPending}
          style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 18, boxShadow: "0 4px 16px rgba(37,99,235,0.35)", opacity: verify.isPending ? 0.7 : 1 }}>
          {verify.isPending
            ? "Verificando..."
            : state.verifyEmail ? "Verificar código →" : "Verificar cuenta →"}
        </motion.button>

        {state.verifyEmail && (
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>
            ¿No recibiste el código?{" "}
            <span onClick={handleResend} style={{ color: "#2563EB", fontWeight: 700, cursor: "pointer" }}>Reenviar</span>
          </p>
        )}
        <button onClick={() => { update({ view: "login", verifyCode: ["", "", "", "", "", ""], verifyEmail: "" }); }} style={{ marginTop: 14, background: "none", border: "none", color: "#9CA3AF", fontSize: 13, cursor: "pointer" }}>
          ← Volver al login
        </button>
      </motion.div>
    </div>
  );
}
