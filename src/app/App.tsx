import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { pageBg, C, glassDark } from "./constants/design";
import { toastVariant, viewTransition } from "./animate/variants";
import { api } from "../lib/api";
import Landing from "./components/views/Landing";
import Login from "./components/views/auth/Login";
import Register from "./components/views/auth/Register";
import ForgotPassword from "./components/views/auth/ForgotPassword";
import VerifyCode from "./components/views/auth/VerifyCode";
import CatalogView from "./components/views/catalog/CatalogView";
import ToolModal from "./components/views/catalog/ToolModal";
import AccountView from "./components/views/account/AccountView";
import AdminView from "./components/views/admin/AdminView";

function AppContent() {
  const { state, update, user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mousePos, setMousePos] = useState({ x: -400, y: -400 });
  const initialized = useRef(false);
  const programmaticNav = useRef(false);

  // 1. En montaje, leer la URL actual como estado inicial
  useEffect(() => {
    const viewMap: Record<string, string> = {
      '/': 'landing', '/login': 'login', '/register': 'register',
      '/forgot-password': 'forgot', '/verify-code': 'verify',
      '/catalog': 'catalog', '/account': 'account', '/admin': 'admin',
    }
    const target = viewMap[location.pathname]
    if (target && target !== state.view) {
      update({ view: target as any })
    }
    initialized.current = true
  }, [])

  // 2. state.view → URL (solo después del montaje para no pisar la URL inicial)
  useEffect(() => {
    if (!initialized.current) return
    const pathMap: Record<string, string> = {
      landing: '/', login: '/login', register: '/register',
      forgot: '/forgot-password', verify: '/verify-code',
      catalog: '/catalog', account: '/account', admin: '/admin',
    }
    const target = pathMap[state.view]
    if (target && location.pathname !== target) {
      programmaticNav.current = true
      navigate(target, { replace: true })
    }
  }, [state.view, navigate])

  // 3. URL → state.view (solo back/forward del navegador, no navegaciones programáticas)
  useEffect(() => {
    if (!initialized.current) return
    if (programmaticNav.current) {
      programmaticNav.current = false
      return
    }
    const viewMap: Record<string, string> = {
      '/': 'landing', '/login': 'login', '/register': 'register',
      '/forgot-password': 'forgot', '/verify-code': 'verify',
      '/catalog': 'catalog', '/account': 'account', '/admin': 'admin',
    }
    const target = viewMap[location.pathname]
    if (target && target !== state.view) {
      update({ view: target as any })
    }
  }, [location.pathname, update])

  // Redirigir al login si el token expira
  useEffect(() => {
    api.onUnauthorized = () => {
      update({ view: 'login' })
    }
    return () => { api.onUnauthorized = undefined }
  }, [update])

  // Redirigir si un no-admin intenta acceder al panel
  useEffect(() => {
    if (state.view === 'admin' && user && user.role !== 'ADMIN') {
      update({ view: 'catalog' })
    }
  }, [state.view, user, update])

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div style={pageBg}>
      <style>{`
        * { box-sizing: border-box; }
        body { font-family: 'Inter', 'Plus Jakarta Sans', sans-serif; }
        input::placeholder, textarea::placeholder { color: rgba(107,127,168,0.45); }
        select option { background:#0D1424; color:#E8EEFF; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(10,132,255,0.2); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(10,132,255,0.4); }
        textarea { font-family: 'Inter', sans-serif; }
        a { color: inherit; }
        .rema-letter-col { flex: 1; display: grid; height: 100%; grid-template-rows: 1fr 1fr; position: relative; cursor: pointer; }
        .rema-letter-col .rema-half { position: relative; z-index: 5; }
        .rema-letter-h1 { position: absolute; left: 0; right: 0; top: 50%; z-index: 0; color: #fff; font: 900 72px 'Plus Jakarta Sans', Montserrat, sans-serif; text-align: center; text-shadow: 0 0 40px rgba(37,99,235,0.7), 0 10px 25px rgba(0,0,0,0.5); text-transform: uppercase; transition: margin-top 0.3s cubic-bezier(0.23,1,0.32,1), color 0.3s, text-shadow 0.3s; pointer-events: none; margin-top: -36px; letter-spacing: 0.06em; }
        .rema-letter-col:hover .rema-letter-h1 { color: #38BDF8; text-shadow: 0 0 60px rgba(56,189,248,0.9), 0 0 20px rgba(37,99,235,0.8), 0 10px 25px rgba(0,0,0,0.5); }
        .rema-letter-col .rema-half:nth-child(1):hover ~ .rema-letter-h1 { margin-top: -56px; }
        .rema-letter-col .rema-half:nth-child(2):hover ~ .rema-letter-h1 { margin-top: -16px; }
        @keyframes borderRipple {
          0%   { outline: 3px solid rgba(56,189,248,0.9); outline-offset: 0px; }
          70%  { outline: 3px solid rgba(56,189,248,0.08); outline-offset: 8px; }
          100% { outline: 3px solid rgba(56,189,248,0); outline-offset: 14px; }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 8px rgba(37,99,235,0.5), 0 0 20px rgba(37,99,235,0.2); }
          50%      { box-shadow: 0 0 16px rgba(56,189,248,0.7), 0 0 36px rgba(37,99,235,0.35); }
        }
        button:not(:disabled) { position: relative; }
        button:not(:disabled):hover {
          box-shadow: 0 0 0 1.5px rgba(56,189,248,0.6), 0 0 14px rgba(37,99,235,0.55), 0 0 32px rgba(37,99,235,0.22) !important;
          transition: box-shadow 0.22s ease !important;
        }
        button:not(:disabled):active {
          animation: borderRipple 0.5s cubic-bezier(0.23,1,0.32,1) forwards !important;
          transform: scale(0.97) !important;
        }
        .landing-cta:hover {
          animation: glowPulse 1.8s ease-in-out infinite !important;
          box-shadow: 0 0 0 1.5px rgba(56,189,248,0.7), 0 0 20px rgba(37,99,235,0.6), 0 0 50px rgba(37,99,235,0.25) !important;
        }
        .glow-card { transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.22s ease !important; cursor: pointer; }
        .glow-card:hover {
          box-shadow: 0 0 0 1px rgba(10,132,255,0.55), 0 0 18px rgba(10,132,255,0.32), 0 0 48px rgba(10,132,255,0.12), 0 14px 40px rgba(0,0,0,0.45) !important;
          border-color: rgba(10,132,255,0.45) !important;
          transform: translateY(-5px) !important;
        }
        .glow-card-green:hover {
          box-shadow: 0 0 0 1px rgba(48,209,88,0.5), 0 0 18px rgba(48,209,88,0.28), 0 0 44px rgba(48,209,88,0.1), 0 14px 40px rgba(0,0,0,0.4) !important;
          border-color: rgba(48,209,88,0.4) !important;
          transform: translateY(-5px) !important;
        }
        @media (max-width: 768px) {
          .land-header-inner { padding: 0 18px !important; height: 56px !important; }
          .land-nav { display: none !important; }
          .land-logo img { height: 30px !important; }
        }
        @media (max-width: 900px) {
          .rema-letter-h1 { font: 900 48px 'Plus Jakarta Sans', sans-serif !important; margin-top: -24px !important; }
          .rema-letter-col { flex: 0 0 44px !important; }
          .rema-letter-col.rema-big { flex: 0 0 60px !important; }
          .rema-letter-col .rema-half:nth-child(1):hover ~ .rema-letter-h1 { margin-top: -38px !important; }
          .rema-letter-col .rema-half:nth-child(2):hover ~ .rema-letter-h1 { margin-top: -12px !important; }
        }
        @media (max-width: 600px) {
          .rema-letter-h1 { font: 900 34px 'Plus Jakarta Sans', sans-serif !important; margin-top: -17px !important; }
          .rema-letter-col { flex: 0 0 30px !important; }
          .rema-letter-col.rema-big { flex: 0 0 42px !important; }
          .rema-letter-col .rema-half:nth-child(1):hover ~ .rema-letter-h1 { margin-top: -27px !important; }
          .rema-letter-col .rema-half:nth-child(2):hover ~ .rema-letter-h1 { margin-top: -8px !important; }
        }
        @media (max-width: 900px) {
          .feat-grid { grid-template-columns: 1fr 1fr !important; }
          .test-grid  { grid-template-columns: 1fr 1fr !important; }
          .qs-grid    { grid-template-columns: 1fr !important; }
          .cat-grid   { grid-template-columns: 1fr !important; }
          .tool-grid  { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .hero-pad   { padding: 40px 20px !important; }
        }
        @media (max-width: 600px) {
          .feat-grid  { grid-template-columns: 1fr !important; }
          .test-grid  { grid-template-columns: 1fr !important; }
          .tool-grid  { grid-template-columns: 1fr !important; }
          .hero-pad   { padding: 24px 16px !important; }
          .sect-pad   { padding: 48px 16px !important; }
          .cta-banner { flex-direction: column !important; padding: 36px 24px !important; text-align: center !important; }
          .cta-banner button { width: 100% !important; }
        }
        @media (max-width: 768px) {
          .login-layout { flex-direction: column !important; }
          .login-left   { display: none !important; }
          .login-right  { width: 100% !important; min-height: 100vh !important; padding: 24px 20px !important; align-items: flex-start !important; padding-top: 40px !important; }
          .login-card   { width: 100% !important; max-width: 100% !important; }
        }
        @media (max-width: 768px) {
          .cat-header { flex-wrap: wrap !important; gap: 10px !important; padding: 10px 14px !important; }
          .cat-search { max-width: 100% !important; order: 3 !important; flex-basis: 100% !important; }
          .cat-actions { gap: 6px !important; }
        }
        @media (max-width: 768px) {
          .sidebar-fixed { width: 100% !important; height: 56px !important; top: auto !important; bottom: 0 !important; left: 0 !important; flex-direction: row !important; overflow-x: auto !important; overflow-y: hidden !important; border-right: none !important; border-top: 1px solid rgba(255,255,255,0.06) !important; padding: 0 8px !important; align-items: center !important; }
          .sidebar-fixed nav { flex-direction: row !important; padding: 0 !important; gap: 0 !important; overflow-x: auto !important; }
          .sidebar-fixed nav > div { flex-direction: column !important; padding: 6px 10px !important; font-size: 9px !important; gap: 3px !important; border-left: none !important; border-bottom: none !important; min-width: 56px !important; text-align: center !important; }
          .sidebar-fixed nav > div span:first-child { font-size: 18px !important; }
          .sidebar-logo, .sidebar-back, .sidebar-footer { display: none !important; }
          .sidebar-content { margin-left: 0 !important; margin-bottom: 56px !important; }
        }
        @media (max-width: 600px) {
          .modal-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .kpi-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .admin-kpi-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
        }
      `}</style>

      {state.view === "landing" && (
        <div style={{ position: "fixed", left: mousePos.x - 200, top: mousePos.y - 200, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(56,189,248,0.07) 45%, transparent 70%)", pointerEvents: "none", zIndex: 9997, transition: "left 0.06s ease-out, top 0.06s ease-out", mixBlendMode: "screen" }} />
      )}

      <AnimatePresence mode="wait">
        {state.view === "landing" && (
          <motion.div key="landing" variants={viewTransition} initial="hidden" animate="visible" exit="exit">
            <Landing />
          </motion.div>
        )}
        {state.view === "login" && (
          <motion.div key="login" variants={viewTransition} initial="hidden" animate="visible" exit="exit">
            <Login />
          </motion.div>
        )}
        {state.view === "register" && (
          <motion.div key="register" variants={viewTransition} initial="hidden" animate="visible" exit="exit">
            <Register />
          </motion.div>
        )}
        {state.view === "forgot" && (
          <motion.div key="forgot" variants={viewTransition} initial="hidden" animate="visible" exit="exit">
            <ForgotPassword />
          </motion.div>
        )}
        {state.view === "verify" && (
          <motion.div key="verify" variants={viewTransition} initial="hidden" animate="visible" exit="exit">
            <VerifyCode />
          </motion.div>
        )}
        {state.view === "catalog" && (
          <motion.div key="catalog" variants={viewTransition} initial="hidden" animate="visible" exit="exit">
            <CatalogView />
          </motion.div>
        )}
        {state.view === "account" && (
          <motion.div key="account" variants={viewTransition} initial="hidden" animate="visible" exit="exit">
            <AccountView />
          </motion.div>
        )}
        {state.view === "admin" && user?.role === "ADMIN" && (
          <motion.div key="admin" variants={viewTransition} initial="hidden" animate="visible" exit="exit">
            <AdminView />
          </motion.div>
        )}
      </AnimatePresence>

      <ToolModal />
      <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 8, zIndex: 9999 }}>
        <AnimatePresence>
          {state.toasts.map(t => {
            const borderCol = t.type === "error" ? C.red : t.type === "info" ? C.blue : C.green;
            return (
              <motion.div key={t.id} variants={toastVariant} initial="hidden" animate="visible" exit="exit"
                style={{ ...glassDark, padding: "12px 16px", borderRadius: 14, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 10, maxWidth: 340, border: `1px solid ${borderCol}28`, boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${borderCol}18` } as React.CSSProperties}>
                <span style={{ fontSize: 16 }}>{t.icon}</span>
                <span style={{ color: C.text }}>{t.msg}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
