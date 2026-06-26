import { motion } from "motion/react";
import { useApp } from "../../../context/AppContext";
import { C, glass, glassDark, glassBlue, STATUS_MAP } from "../../../constants/design";
import { CURRENT_USER } from "../../../data/user";
import { fadeUp, slideLeft } from "../../../animate/variants";
import { Logo } from "../../atoms/Logo";
import { Badge } from "../../atoms/Badge";
import { Table, TH, TD } from "../../atoms/Table";
import { Toggle } from "../../atoms/Toggle";
import { fmtDate } from "../../../utils";

const ACCOUNT_MENU = [
  { id: "inicio", label: "Inicio", icon: "⊞" },
  { id: "loans", label: "Mis Préstamos", icon: "📋" },
  { id: "profile", label: "Mi Perfil", icon: "👤" },
  { id: "career", label: "Mi Carrera", icon: "🎓" },
  { id: "favorites", label: "Favoritos", icon: "⭐" },
  { id: "settings", label: "Configuración", icon: "⚙️" },
];

function AccountInicio() {
  const { state, getTool } = useApp();
  const activeLns = state.loans.filter(l => l.status === "active");
  const overdueLns = state.loans.filter(l => l.status === "overdue");
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>Bienvenido, {CURRENT_USER.name.split(" ")[0]}</h2>
        <p style={{ color: C.muted, fontSize: 13.5 }}>{new Date().toLocaleDateString("es-GT", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>
      <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 22 }}>
        {[{ label: "En posesión", val: activeLns.length, c: C.blue, bg: `${C.blue}12` }, { label: "Atrasados", val: overdueLns.length, c: C.red, bg: `${C.red}12` }, { label: "Favoritos", val: state.favorites.length, c: C.yellow, bg: `${C.yellow}12` }].map(({ label, val, c, bg }) => (
          <div key={label} className="glow-card" style={{ ...glass(0.06), borderRadius: 16, padding: "18px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${c}28` }}>
            <div>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 30, fontWeight: 800, color: c, letterSpacing: "-0.03em" }}>{val}</div>
            </div>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, color: c }}>{val}</div>
            </div>
          </div>
        ))}
      </div>
      {overdueLns.length > 0 && (
        <div style={{ ...glass(0.05), borderRadius: 14, padding: "14px 18px", marginBottom: 18, background: "rgba(255,69,58,0.06)", border: "1px solid rgba(255,69,58,0.18)" }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.red, marginBottom: 6 }}>⚠️ {overdueLns.length} préstamo(s) con retraso</div>
          {overdueLns.map(l => { const t = getTool(l.toolId); return t ? <div key={l.id} style={{ fontSize: 12.5, color: "#fca5a5", marginTop: 3 }}>→ {t.name} · Venció: {fmtDate(l.dueDate)}</div> : null; })}
        </div>
      )}
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Equipos en tu Posesión</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {activeLns.length === 0 ? (
          <div style={{ ...glass(0.04), borderRadius: 14, padding: "36px", textAlign: "center", color: C.muted }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📦</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Sin préstamos activos</div>
            <div style={{ fontSize: 12.5 }}>No tienes equipos en posesión actualmente.</div>
          </div>
        ) : activeLns.map(l => {
          const t = getTool(l.toolId);
          if (!t) return null;
          const dl = Math.ceil((new Date(l.dueDate).getTime() - Date.now()) / 86400000);
          return (
            <div key={l.id} style={{ ...glass(0.06), borderRadius: 14, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center" }}>
              <img src={t.image} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>Prestado {fmtDate(l.loanDate)} · Devolver: {fmtDate(l.dueDate)}</div>
                <div style={{ marginTop: 8, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 4, background: dl < 0 ? C.red : dl <= 1 ? C.orange : C.blue, width: `${Math.min(100, Math.max(8, (1 - dl / t.maxDays) * 100))}%`, transition: "width 0.5s" }} />
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Badge s={l.status} />
                <div style={{ fontSize: 11, color: dl < 0 ? C.red : dl <= 1 ? C.orange : C.muted, marginTop: 4 }}>{dl < 0 ? `${Math.abs(dl)}d atrasado` : dl === 0 ? "Hoy" : `${dl}d restantes`}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AccountLoans() {
  const { state, getTool } = useApp();
  return (
    <div>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 18 }}>Mis Préstamos</h2>
      <div style={{ ...glass(0.05), borderRadius: 16, overflow: "hidden" }}>
        <Table>
          <thead><tr><TH>Equipo</TH><TH>Código</TH><TH>Préstamo</TH><TH>Devolución</TH><TH>Estado</TH></tr></thead>
          <tbody>
            {state.loans.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "32px", color: C.muted }}>Sin préstamos registrados.</td></tr>
            ) : [...state.loans].reverse().map(l => {
              const t = getTool(l.toolId);
              return (
                <tr key={l.id}>
                  <TD><div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {t && <img src={t.image} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                    <div><div style={{ fontWeight: 700, fontSize: 13 }}>{t?.name || "—"}</div><div style={{ fontSize: 11, color: C.muted }}>{t?.brand}</div></div>
                  </div></TD>
                  <TD><span style={{ fontSize: 11, color: C.blue, fontWeight: 600 }}>{t?.code || "—"}</span></TD>
                  <TD><span style={{ fontSize: 12.5, color: "#94a3b8" }}>{fmtDate(l.loanDate)}</span></TD>
                  <TD><span style={{ fontSize: 12.5, color: "#94a3b8" }}>{fmtDate(l.dueDate)}</span></TD>
                  <TD><Badge s={l.status} /></TD>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

function AccountProfile() {
  return (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20 }}>Mi Perfil</h2>
      <div style={{ ...glass(0.06), borderRadius: 18, padding: "24px", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 22, paddingBottom: 22, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${C.blue}20`, border: `2px solid ${C.blue}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0, fontWeight: 800, color: C.blue }}>{CURRENT_USER.name[0]}</div>
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em" }}>{CURRENT_USER.name}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>{CURRENT_USER.career}</div>
            <div style={{ marginTop: 6 }}><Badge s="active" /></div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
          {[{ l: "Carnet", v: CURRENT_USER.carnet }, { l: "Correo", v: CURRENT_USER.email }, { l: "Taller Asignado", v: CURRENT_USER.workshop }, { l: "Teléfono", v: CURRENT_USER.phone }].map(({ l, v }) => (
            <div key={l}>
              <label style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 5 }}>{l}</label>
              <input readOnly style={{ ...glass(0.05, 12), borderRadius: 10, padding: "9px 12px", fontSize: 13, outline: "none", color: "#E8EEFF", width: "100%" }} defaultValue={v} />
            </div>
          ))}
        </div>
        <button style={{ ...glassBlue, borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", border: "none", marginTop: 16 }}>Editar Perfil</button>
      </div>
    </div>
  );
}

function AccountCareer() {
  const { state, openToolDetail } = useApp();
  const careerTools = state.tools.filter(t => t.careers.includes(CURRENT_USER.career));
  return (
    <div>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20 }}>Mi Carrera</h2>
      <div style={{ ...glass(0.06), borderRadius: 16, padding: "20px", marginBottom: 20, display: "flex", gap: 14 }}>
        {[{ l: "Carrera", v: CURRENT_USER.career }, { l: "Taller", v: CURRENT_USER.workshop }].map(({ l, v }) => (
          <div key={l} style={{ ...glass(0.05), borderRadius: 12, padding: "14px", flex: 1 }}>
            <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>{l}</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginTop: 5, color: C.blue }}>{v}</div>
          </div>
        ))}
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Equipos Autorizados para tu Carrera</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
        {careerTools.map(t => (
          <div key={t.id} onClick={() => openToolDetail(t)} style={{ ...glass(0.05), borderRadius: 14, padding: "12px", display: "flex", gap: 10, alignItems: "center", cursor: "pointer", transition: "all 0.2s", border: "1px solid rgba(255,255,255,0.07)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${C.blue}40`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.07)"; }}>
            <img src={t.image} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{t.name}</div>
              <div style={{ marginTop: 5 }}><Badge s={t.status} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountFavorites() {
  const { state, openToolDetail, openLoanForm } = useApp();
  const favTools = state.tools.filter(t => state.favorites.includes(t.id));
  return (
    <div>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20 }}>Favoritos</h2>
      {favTools.length === 0 ? <div style={{ ...glass(0.04), borderRadius: 16, padding: "40px", textAlign: "center", color: C.muted }}>No tienes favoritos aún. Haz clic en ☆ en las tarjetas.</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 14 }}>
          {favTools.map(t => (
            <div key={t.id} style={{ ...glass(0.05), borderRadius: 14, overflow: "hidden" }}>
              <div style={{ height: 120, position: "relative", overflow: "hidden" }}>
                <img src={t.image} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(6,10,20,0.85) 0%,transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: 8, left: 10 }}><Badge s={t.status} /></div>
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>{t.name}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openToolDetail(t)} style={{ ...glass(0.06), flex: 1, borderRadius: 8, padding: "7px", fontSize: 12, fontWeight: 600, color: C.blue, cursor: "pointer", border: `1px solid ${C.blue}22` }}>Ver detalle</button>
                  {t.available > 0 && <button onClick={() => openLoanForm(t)} style={{ ...glassBlue, flex: 1, borderRadius: 8, padding: "7px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", border: "none" }}>Solicitar</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AccountSettings() {
  return (
    <div style={{ maxWidth: 520 }}>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20 }}>Configuración</h2>
      <div style={{ ...glass(0.05), borderRadius: 16, padding: "20px", marginBottom: 14 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 14 }}>🔔 Notificaciones</div>
        {[{ l: "Alertas de devolución próxima", d: "Aviso 24h antes del vencimiento" }, { l: "Solicitud aprobada", d: "Notificarme cuando el taller apruebe" }, { l: "Stock disponible", d: "Avisar cuando favorito esté disponible" }].map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div><div style={{ fontSize: 13, fontWeight: 600 }}>{item.l}</div><div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{item.d}</div></div>
            <Toggle on={i !== 2} onToggle={() => {}} />
          </div>
        ))}
      </div>
      <div style={{ ...glass(0.05), borderRadius: 16, padding: "20px" }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 14 }}>🔒 Seguridad</div>
        {["Contraseña actual", "Nueva contraseña", "Confirmar contraseña"].map(l => (
          <div key={l} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 5 }}>{l}</label>
            <input type="password" style={{ ...glass(0.05, 12), borderRadius: 10, padding: "9px 12px", fontSize: 13, outline: "none", color: "#E8EEFF", width: "100%" }} placeholder="••••••••" />
          </div>
        ))}
        <button style={{ ...glassBlue, borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", border: "none" }}>Cambiar Contraseña</button>
      </div>
    </div>
  );
}

export default function AccountView() {
  const { state, update } = useApp();
  const sMap: Record<string, () => React.ReactNode> = {
    inicio: AccountInicio, loans: AccountLoans, profile: AccountProfile,
    career: AccountCareer, favorites: AccountFavorites, settings: AccountSettings,
  };
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside className="sidebar-fixed" style={{ width: 240, minHeight: "100vh", ...glassDark, borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 50, overflowY: "auto" }}>
        <div style={{ padding: "18px 18px 14px" }}><Logo /></div>
        <button onClick={() => update({ view: "catalog" })} style={{ margin: "0 12px 8px", ...glass(0.05), border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "8px", textAlign: "center", fontSize: 12, fontWeight: 600, color: C.muted, cursor: "pointer" }}>← Volver al Catálogo</button>
        <nav style={{ flex: 1, padding: "4px 8px" }}>
          {ACCOUNT_MENU.map((item, i) => (
            <motion.div key={item.id} variants={slideLeft} custom={i} initial="hidden" animate="visible"
              whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
              onClick={() => update({ accountSection: item.id })}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", color: state.accountSection === item.id ? C.text : C.muted, fontSize: 13.5, cursor: "pointer", borderRadius: 10, background: state.accountSection === item.id ? "rgba(10,132,255,0.1)" : "transparent", borderLeft: state.accountSection === item.id ? `2px solid ${C.blue}` : "2px solid transparent", transition: "background 0.15s, color 0.15s", marginBottom: 2 }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}
            </motion.div>
          ))}
        </nav>
        <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{CURRENT_USER.name}</div>
          <div style={{ fontSize: 11, color: "rgba(107,127,168,0.5)", marginTop: 1 }}>{CURRENT_USER.carnet}</div>
        </div>
      </aside>
      <main className="sidebar-content" style={{ marginLeft: 240, flex: 1, padding: "32px 36px" }}>
        <div style={{ maxWidth: 880 }}>{(sMap[state.accountSection] || AccountInicio)({})}</div>
      </main>
    </div>
  );
}
