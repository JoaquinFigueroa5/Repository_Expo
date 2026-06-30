import { motion } from "motion/react";
import { useApp } from "../../../context/AppContext";
import { C, glass, glassDark, glassBlue, glassGreen, inp, STATUS_MAP, CAT_ICONS, CAT_COLORS } from "../../../constants/design";
import { fadeUp, slideLeft } from "../../../animate/variants";
import type { Tool } from "../../../types";
import { Logo } from "../../atoms/Logo";
import { Badge } from "../../atoms/Badge";
import { Table, TH, TD } from "../../atoms/Table";
import { today, fmtDate } from "../../../utils";
import { useAdminStats, useAdminCareers, useAdminCategories, useCreateCareer, useDeleteCareer } from "../../../../hooks/useAdmin";
import { useTools } from "../../../../hooks/useTools";
import { useAllLoans } from "../../../../hooks/useLoans";
import { useAllRequests, useApproveRequest, useRejectRequest } from "../../../../hooks/useRequests";
import { useTopTools, useLoansByMonth, useDelays, useActiveUsers } from "../../../../hooks/useReports";
import { useCreateTool, useUpdateTool, useDeleteTool } from "../../../../hooks/useTools";
import { useReturnLoan } from "../../../../hooks/useLoans";
import { useMyFavorites } from "../../../../hooks/useFavorites";
import { useMyLoans } from "../../../../hooks/useLoans";

const ADMIN_PAGES = [
  { id: "panel", label: "Panel de Control", icon: "⊞" },
  { id: "estadisticas", label: "Estadísticas", icon: "📈" },
  { id: "reportes", label: "Reportes", icon: "📄" },
  { id: "solicitudes", label: "Solicitudes", icon: "📬" },
  { id: "activos", label: "Préstamos Activos", icon: "🔧" },
  { id: "inventario", label: "Inventario", icon: "📦" },
  { id: "agregar", label: "Agregar Equipo", icon: "➕" },
  { id: "carreras", label: "Carreras", icon: "🎓" },
];

const blank: Tool = { id: 0, name: "", cat: "", code: "", brand: "", location: "", totalQty: 1, available: 1, maxDays: 3, desc: "", image: "", status: "available", specs: [{ k: "", v: "" }], careers: [] };

function AdminPanel() {
  const { state } = useApp();
  const { data: stats } = useAdminStats();
  const available = stats?.available ?? state.tools.filter(t => t.status === "available").length;
  const inUse = stats?.inUse ?? state.tools.filter(t => t.status === "in_use").length;
  const maintenance = stats?.maintenance ?? state.tools.filter(t => t.status === "maintenance").length;
  const pending = stats?.pendingReqs ?? state.adminReqs.filter(r => r.status === "pending").length;
  return (
    <div>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20 }}>Panel de Control</h2>
      <div className="admin-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Disponibles", val: available, c: C.green, bg: `${C.green}12` },
          { label: "En Uso", val: inUse, c: C.red, bg: `${C.red}10` },
          { label: "Mantenimiento", val: maintenance, c: C.muted, bg: "rgba(107,127,168,0.1)" },
          { label: "Total Equipos", val: stats?.totalTools ?? state.tools.length, c: C.blue, bg: `${C.blue}12` },
          { label: "Solicitudes Pendientes", val: pending, c: C.yellow, bg: `${C.yellow}10` },
          { label: "Préstamos Activos", val: stats?.activeLoans ?? state.loans.filter(l => l.status === "active").length, c: C.orange, bg: `${C.orange}10` },
        ].map(({ label, val, c, bg }, i) => (
          <motion.div key={label} className="glow-card" variants={fadeUp} custom={i} initial="hidden" animate="visible"
            whileHover={{ scale: 1.02 }}
            style={{ ...glass(0.06), borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${c}25` }}>
            <div>
              <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600, marginBottom: 3 }}>{label}</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 28, fontWeight: 800, color: c, letterSpacing: "-0.03em" }}>{val}</div>
            </div>
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.07 + 0.2, type: "spring", damping: 16, stiffness: 280 }}
              style={{ width: 44, height: 44, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", background: bg, border: `1px solid ${c}20` }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 800, color: c }}>{val}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>
      <div style={{ ...glass(0.05), borderRadius: 18, padding: "20px" }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Actividad Reciente</h3>
        {[...state.loans].reverse().slice(0, 5).map(l => { const t = state.tools.find(t => t.id === l.toolId); return t ? (
          <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <img src={t.image} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div><div style={{ fontWeight: 700 }}>{t.name}</div><div style={{ fontSize: 11, color: C.muted }}>{fmtDate(l.loanDate)}</div></div>
            </div>
            <Badge s={l.status} />
          </div>
        ) : null; })}
      </div>
    </div>
  );
}

function AdminEstadisticas() {
  const { state } = useApp();
  const { data: stats } = useAdminStats();
  const { data: allLoans } = useAllLoans();
  const loans = allLoans ?? state.loans;
  const byCat = state.categories.map(c => ({ cat: c, total: state.tools.filter(t => t.cat === c).length, avail: state.tools.filter(t => t.cat === c && t.status === "available").length }));
  const maxTotal = Math.max(...byCat.map(b => b.total), 1);
  const totalLoans = loans.length;
  const returnRate = totalLoans > 0 ? Math.round((loans.filter((l: any) => l.status === "returned").length / totalLoans) * 100) : 0;
  const overdueRate = totalLoans > 0 ? Math.round((loans.filter((l: any) => l.status === "overdue").length / totalLoans) * 100) : 0;
  return (
    <div>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20 }}>Estadísticas</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[{ label: "Total Equipos", val: state.tools.length, c: C.blue }, { label: "Tasa Devolución", val: `${returnRate}%`, c: C.green }, { label: "Préstamos Total", val: totalLoans, c: C.yellow }, { label: "Tasa Atraso", val: `${overdueRate}%`, c: C.red }].map(({ label, val, c }) => (
          <div key={label} style={{ ...glass(0.06), borderRadius: 16, padding: "18px", textAlign: "center", border: `1px solid ${c}18` }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 32, fontWeight: 800, color: c, letterSpacing: "-0.03em", marginBottom: 4 }}>{val}</div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ ...glass(0.05), borderRadius: 18, padding: "22px", marginBottom: 16 }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Disponibilidad por Área</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {byCat.map(({ cat, total, avail }, i) => {
            const col = CAT_COLORS[cat] || C.blue;
            const pct = Math.round((avail / Math.max(total, 1)) * 100);
            return (
              <motion.div key={cat} variants={fadeUp} custom={i} initial="hidden" animate="visible">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  <span>{CAT_ICONS[cat] || "📦"} {cat}</span>
                  <span style={{ color: col }}>{avail}<span style={{ color: C.muted }}>/{total}</span></span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, height: 8, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: "100%", background: `linear-gradient(90deg,${col},${col}88)`, borderRadius: 8 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: C.muted, marginTop: 4 }}>
                  <span>{pct}% disponible</span>
                  <span>{total - avail} ocupados</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div style={{ ...glass(0.05), borderRadius: 18, padding: "22px" }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Equipos por Área</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, height: 140, paddingBottom: 8 }}>
          {byCat.map(({ cat, total }, i) => {
            const col = CAT_COLORS[cat] || C.blue;
            const barH = (total / maxTotal) * 110;
            return (
              <div key={cat} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <motion.span initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 + 0.3 }}
                  style={{ fontSize: 13, fontWeight: 800, color: col }}>{total}</motion.span>
                <motion.div initial={{ height: 0 }} animate={{ height: Math.max(barH, 10) }} transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: "100%", borderRadius: "8px 8px 0 0", background: `linear-gradient(180deg,${col},${col}55)`, border: `1px solid ${col}40` }} />
                <span style={{ fontSize: 18 }}>{CAT_ICONS[cat] || "📦"}</span>
                <span style={{ fontSize: 10, color: C.muted, textAlign: "center", lineHeight: 1.2 }}>{cat}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AdminReportes() {
  const { state, toast } = useApp();
  const { data: topTools } = useTopTools();
  const loanCounts = topTools?.reduce((acc: Record<string, number>, t: any) => { acc[t.name] = t.count; return acc; }, {}) ?? {};
  const toolUsage = state.tools.map(t => ({ tool: t, count: loanCounts[t.name] ?? state.loans.filter(l => l.toolId === t.id).length })).sort((a, b) => b.count - a.count).slice(0, 5);
  return (
    <div>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20 }}>Reportes</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Préstamos este mes", val: state.loans.filter(l => l.loanDate?.startsWith("2026-06")).length, c: C.blue },
          { label: "Devoluciones pendientes", val: state.loans.filter(l => l.status === "active").length, c: C.orange },
          { label: "Equipos sin actividad", val: state.tools.filter(t => !state.loans.some(l => l.toolId === t.id)).length, c: C.muted },
        ].map(({ label, val, c }) => (
          <div key={label} style={{ ...glass(0.06), borderRadius: 16, padding: "18px", display: "flex", alignItems: "center", gap: 14, border: `1px solid ${c}18` }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 32, fontWeight: 800, color: c, letterSpacing: "-0.03em" }}>{val}</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, lineHeight: 1.4 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ ...glass(0.05), borderRadius: 18, padding: "20px", marginBottom: 16 }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Top 5 Equipos Más Solicitados</h3>
        {toolUsage.map(({ tool: t, count }, i) => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? `${C.yellow}20` : `${C.blue}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: i === 0 ? C.yellow : C.muted, flexShrink: 0 }}>{i + 1}</div>
            <img src={t.image} alt="" style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{t.code} · {t.cat}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, color: C.blue }}>{count}</div>
              <div style={{ fontSize: 10.5, color: C.muted }}>préstamos</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...glass(0.05), borderRadius: 18, padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 700 }}>Historial Completo</h3>
          <button onClick={() => toast("Exportando reporte PDF...", "📄", "info")} style={{ ...glassBlue, borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", border: "none" }}>📥 Exportar PDF</button>
        </div>
        <Table>
          <thead><tr><TH>#</TH><TH>Equipo</TH><TH>Préstamo</TH><TH>Devolución</TH><TH>Estado</TH></tr></thead>
          <tbody>
            {[...state.loans].reverse().map(l => {
              const t = state.tools.find(t => t.id === l.toolId);
              return (
                <tr key={l.id}>
                  <TD><span style={{ fontSize: 11, color: C.muted }}>#{l.id}</span></TD>
                  <TD><div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {t && <img src={t.image} alt="" style={{ width: 32, height: 32, borderRadius: 7, objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                    <div><div style={{ fontWeight: 700, fontSize: 12.5 }}>{t?.name || "—"}</div><div style={{ fontSize: 10.5, color: C.muted }}>{t?.code}</div></div>
                  </div></TD>
                  <TD><span style={{ fontSize: 12, color: "#94a3b8" }}>{fmtDate(l.loanDate)}</span></TD>
                  <TD><span style={{ fontSize: 12, color: "#94a3b8" }}>{l.returnDate ? fmtDate(l.returnDate) : fmtDate(l.dueDate)}</span></TD>
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

function AdminSolicitudes() {
  const { state, toast } = useApp();
  const approve = useApproveRequest();
  const reject = useRejectRequest();
  return (
    <div>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20 }}>Solicitudes</h2>
      <div style={{ ...glass(0.05), borderRadius: 18, padding: "18px" }}>
        <Table>
          <thead><tr><TH>Estudiante</TH><TH>Equipo</TH><TH>Período</TH><TH>Estado</TH><TH>Acciones</TH></tr></thead>
          <tbody>
            {state.adminReqs.map(r => {
              const t = state.tools.find(t => t.id === r.toolId);
              return (
                <tr key={r.id}>
                  <TD><div style={{ fontWeight: 700 }}>{r.student}</div><div style={{ fontSize: 11, color: C.muted }}>{r.career}</div></TD>
                  <TD><div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {t && <img src={t.image} alt="" style={{ width: 34, height: 34, borderRadius: 7, objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                    <div><div style={{ fontWeight: 700 }}>{t?.name || "—"}</div><div style={{ fontSize: 11, color: C.muted }}>{t?.code} · ×{r.qty}</div></div>
                  </div></TD>
                  <TD><div style={{ fontSize: 12, color: "#94a3b8" }}>{fmtDate(r.startDate)}</div><div style={{ fontSize: 12, color: "#94a3b8" }}>→ {fmtDate(r.endDate)}</div></TD>
                  <TD><Badge s={r.status} /></TD>
                  <TD>{r.status === "pending" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { approve.mutate(r.id); toast(`Solicitud de ${r.student} aprobada`); }} style={{ ...glassGreen, borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", border: "none" }}>Aprobar</button>
                      <button onClick={() => { reject.mutate({ id: r.id, comment: "" }); toast("Solicitud rechazada", "❌", "error"); }} style={{ ...glass(0.05), borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, color: C.red, cursor: "pointer", border: `1px solid ${C.red}28` }}>Rechazar</button>
                    </div>
                  )}</TD>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

function AdminActivos() {
  const { state, toast } = useApp();
  const returnLoan = useReturnLoan();
  return (
    <div>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20 }}>Préstamos Activos</h2>
      <div style={{ ...glass(0.05), borderRadius: 18, padding: "18px" }}>
        <Table>
          <thead><tr><TH>Equipo</TH><TH>Código</TH><TH>Fecha Límite</TH><TH>Estado</TH><TH>Acción</TH></tr></thead>
          <tbody>
            {state.loans.filter(l => l.status === "active" || l.status === "overdue").map(l => {
              const t = state.tools.find(t => t.id === l.toolId);
              const dl = Math.ceil((new Date(l.dueDate).getTime() - Date.now()) / 86400000);
              return (
                <tr key={l.id}>
                  <TD><div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    {t && <img src={t.image} alt="" style={{ width: 34, height: 34, borderRadius: 7, objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                    <span style={{ fontWeight: 700 }}>{t?.name || "—"}</span>
                  </div></TD>
                  <TD><span style={{ fontSize: 11, color: C.blue, fontWeight: 600 }}>{t?.code}</span></TD>
                  <TD><span style={{ color: dl < 0 ? C.red : dl <= 1 ? C.orange : "#94a3b8", fontSize: 12.5 }}>{fmtDate(l.dueDate)} {dl < 0 ? `(${Math.abs(dl)}d atraso)` : dl === 0 ? "(Hoy)" : ""}</span></TD>
                  <TD><Badge s={l.status} /></TD>
                  <TD><button onClick={() => { returnLoan.mutate({ id: l.id, returnDate: today() }); toast("Devolución registrada ✅"); }}
                    style={{ ...glass(0.06), borderRadius: 8, padding: "6px 13px", fontSize: 12, fontWeight: 700, color: C.green, cursor: "pointer", border: `1px solid ${C.green}28` }}>
                    Registrar Devolución
                  </button></TD>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

function AdminInventario() {
  const { state, update, toast } = useApp();
  const deleteTool = useDeleteTool();
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>Inventario</h2>
        <button onClick={() => { update({ editTool: null, adminPage: "agregar" }); }} style={{ ...glassBlue, borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", border: "none" }}>+ Agregar Equipo</button>
      </div>
      <div style={{ ...glass(0.05), borderRadius: 18, padding: "18px" }}>
        <Table>
          <thead><tr><TH>Equipo</TH><TH>Código</TH><TH>Área</TH><TH>Disponibles</TH><TH>Estado</TH><TH>Acciones</TH></tr></thead>
          <tbody>
            {state.tools.map(t => (
              <tr key={t.id}>
                <TD><div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                    <img src={t.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div><div style={{ fontWeight: 700, fontSize: 13 }}>{t.name}</div><div style={{ fontSize: 11, color: C.muted }}>{t.brand}</div></div>
                </div></TD>
                <TD><span style={{ fontSize: 11, color: C.blue, fontWeight: 600 }}>{t.code}</span></TD>
                <TD><span style={{ fontSize: 12, color: "#94a3b8" }}>{CAT_ICONS[t.cat] || "📦"} {t.cat}</span></TD>
                <TD><span style={{ fontWeight: 700, color: t.available > 0 ? C.green : C.red }}>{t.available}/{t.totalQty}</span></TD>
                <TD>
                  <select value={t.status} onChange={e => { update({ tools: state.tools.map(x => x.id === t.id ? { ...x, status: e.target.value as Tool["status"] } : x) }); toast("Estado actualizado ✅"); }}
                    style={{ ...glass(0.05), borderRadius: 8, padding: "5px 8px", fontSize: 11.5, fontWeight: 700, color: C.text, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
                    <option value="available">Disponible</option>
                    <option value="in_use">En Uso</option>
                    <option value="maintenance">Mantenimiento</option>
                    <option value="reserved">Reservado</option>
                  </select>
                </TD>
                <TD>
                  <button onClick={() => { update({ editTool: t, adminPage: "agregar" }); }} style={{ background: "none", border: "none", fontSize: 15, cursor: "pointer", color: C.muted, padding: "3px 6px", borderRadius: 6 }}>✏️</button>
                  <button onClick={() => { if (!confirm(`¿Eliminar "${t.name}"?`)) return; deleteTool.mutate(t.id); toast("Equipo eliminado", "🗑️", "info"); }} style={{ background: "none", border: "none", fontSize: 15, cursor: "pointer", color: C.red, padding: "3px 6px", borderRadius: 6 }}>🗑️</button>
                </TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

function AdminAgregar() {
  const { state, update, toast } = useApp();
  const createTool = useCreateTool();
  const updateTool = useUpdateTool();
  const ef = state.editTool || blank;
  const isEdit = ef.id > 0;
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => update({ editTool: { ...ef, image: ev.target?.result as string } });
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>{isEdit ? "Editar Equipo" : "Agregar Equipo"}</h2>
        <button onClick={() => { update({ adminPage: "inventario", editTool: null }); }} style={{ ...glass(0.06), borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, color: C.muted, cursor: "pointer", border: "1px solid rgba(255,255,255,0.07)" }}>Cancelar</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, alignItems: "start" }}>
        <div style={{ ...glass(0.05), borderRadius: 18, padding: "22px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
            {[{ l: "Nombre *", k: "name", ph: "Ej. Laptop Dell XPS" }, { l: "Código *", k: "code", ph: "Ej. CP-001" }, { l: "Marca", k: "brand", ph: "Ej. Dell" }].map(({ l, k, ph }) => (
              <div key={k}>
                <label style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 5 }}>{l}</label>
                <input placeholder={ph} value={(ef as any)[k]} onChange={e => update({ editTool: { ...ef, [k]: e.target.value } })} style={inp} />
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 5 }}>Área *</label>
              <select value={ef.cat} onChange={e => update({ editTool: { ...ef, cat: e.target.value } })} style={inp}>
                <option value="">Seleccionar...</option>
                {state.categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            {[{ l: "Total Uds.", k: "totalQty" }, { l: "Disponibles", k: "available" }, { l: "Días Máx.", k: "maxDays" }].map(({ l, k }) => (
              <div key={k}>
                <label style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 5 }}>{l}</label>
                <input type="number" min="1" value={(ef as any)[k]} onChange={e => update({ editTool: { ...ef, [k]: Number(e.target.value) } })} style={inp} />
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 5 }}>Ubicación</label>
              <input placeholder="Ej. Lab Computación A-1" value={ef.location} onChange={e => update({ editTool: { ...ef, location: e.target.value } })} style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 5 }}>Estado Inicial</label>
              <select value={ef.status} onChange={e => update({ editTool: { ...ef, status: e.target.value as Tool["status"] } })} style={inp}>
                <option value="available">Disponible</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="reserved">Reservado</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 5 }}>Descripción</label>
            <textarea rows={4} placeholder="Descripción detallada..." value={ef.desc} onChange={e => update({ editTool: { ...ef, desc: e.target.value } })} style={{ ...inp, resize: "vertical" }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 8 }}>Carreras Autorizadas</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {state.careers.map(cr => {
                const sel = ef.careers.includes(cr.name);
                return (
                  <button key={cr.id} type="button" onClick={() => update({ editTool: { ...ef, careers: sel ? ef.careers.filter(x => x !== cr.name) : [...ef.careers, cr.name] } })}
                    style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: sel ? `1px solid ${cr.color}50` : "1px solid rgba(255,255,255,0.08)", background: sel ? `${cr.color}14` : "rgba(255,255,255,0.04)", color: sel ? cr.color : C.muted, transition: "all 0.15s" }}>
                    {cr.icon} {cr.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => { update({ adminPage: "inventario", editTool: null }); }} style={{ ...glass(0.06), borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, color: C.muted, cursor: "pointer", border: "1px solid rgba(255,255,255,0.07)" }}>Cancelar</button>
            <button onClick={async () => {
              if (!ef.name || !ef.code || !ef.cat) { toast("Nombre, código y área son obligatorios", "⚠️", "error"); return; }
              try {
                if (isEdit) {
                  await updateTool.mutateAsync({ id: ef.id, ...ef });
                  toast(`"${ef.name}" actualizado ✅`);
                } else {
                  await createTool.mutateAsync(ef);
                  toast(`"${ef.name}" agregado al inventario ✅`);
                }
                update({ editTool: null, adminPage: "inventario" });
              } catch (err: any) {
                toast(err?.message || "Error al guardar", "❌", "error");
              }
            }} style={{ ...glassBlue, borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", border: "none" }}>
              {isEdit ? "Guardar Cambios" : "✅ Agregar Equipo"}
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ ...glass(0.06), borderRadius: 18, padding: "18px" }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 12 }}>Imagen del Equipo</h3>
            <div style={{ width: "100%", height: 180, borderRadius: 12, overflow: "hidden", marginBottom: 12, background: "rgba(0,0,0,0.25)", border: "2px dashed rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {ef.image ? (
                <>
                  <img src={ef.image} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <button onClick={() => update({ editTool: { ...ef, image: "" } })} style={{ position: "absolute", top: 8, right: 8, ...glass(0.6, 8), border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </>
              ) : (
                <div style={{ textAlign: "center", color: C.muted }}>
                  <div style={{ fontSize: 36, marginBottom: 6 }}>🖼️</div>
                  <div style={{ fontSize: 12 }}>Sin imagen</div>
                </div>
              )}
            </div>
            <label style={{ display: "block", cursor: "pointer", marginBottom: 10 }}>
              <div style={{ ...glass(0.06), borderRadius: 10, padding: "10px", textAlign: "center", fontSize: 13, fontWeight: 700, color: C.blue, border: `1px solid ${C.blue}28`, cursor: "pointer" }}>
                📁 Subir imagen desde PC
              </div>
              <input type="file" accept="image/*" onChange={handleImageFile} style={{ display: "none" }} />
            </label>
            <div>
              <label style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 5 }}>O pegar URL</label>
              <input placeholder="https://..." value={ef.image.startsWith("data:") ? "" : ef.image} onChange={e => update({ editTool: { ...ef, image: e.target.value } })} style={inp} />
            </div>
          </div>
          <div style={{ ...glass(0.04), borderRadius: 14, padding: "14px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.blue, marginBottom: 8 }}>💡 Consejos</div>
            {["Imágenes cuadradas o 4:3 para mejor apariencia", "Formatos: JPG, PNG, WEBP", "Tamaño recomendado: 400×300 px"].map((tip, i) => (
              <div key={i} style={{ fontSize: 11, color: C.muted, padding: "3px 0" }}>· {tip}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminCarreras() {
  const { state, update, toast } = useApp();
  const createCareer = useCreateCareer();
  const deleteCareer = useDeleteCareer();
  const CAREER_COLORS = [C.blue, C.green, C.yellow, C.orange, C.purple, C.red];
  const CAREER_ICONS = ["💻", "⚙️", "⚡", "🔬", "🏗️", "🎨", "📐", "🔭", "🌱", "🎓"];
  return (
    <div>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20 }}>Gestión de Carreras</h2>
      <div style={{ ...glass(0.05), borderRadius: 18, padding: "20px", marginBottom: 18 }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Carreras Registradas</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {state.careers.map(cr => (
            <div key={cr.id} style={{ ...glass(0.06), borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, border: `1px solid ${cr.color}18` }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${cr.color}18`, border: `1px solid ${cr.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{cr.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{cr.name}</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>
                  {state.tools.filter(t => t.careers.includes(cr.name)).length} equipos autorizados ·
                  {state.loans.filter(l => { const t = state.tools.find(t => t.id === l.toolId); return t?.careers.includes(cr.name); }).length} préstamos históricos
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: cr.color }} />
                <button onClick={() => {
                  if (state.careers.length <= 1) { toast("Debe haber al menos 1 carrera", "⚠️", "error"); return; }
                  if (!confirm(`¿Eliminar "${cr.name}"?`)) return;
                  deleteCareer.mutate(cr.id);
                  toast(`Carrera "${cr.name}" eliminada`, "🗑️", "info");
                }} style={{ background: "none", border: "none", fontSize: 14, cursor: "pointer", color: C.red, padding: "4px 8px", borderRadius: 8 }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...glass(0.06), borderRadius: 18, padding: "22px" }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Crear Nueva Carrera</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, marginBottom: 14, alignItems: "end" }}>
          <div>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 5 }}>Nombre de la Carrera *</label>
            <input placeholder="Ej. Diseño Gráfico" value={state.newCareerForm.name} onChange={e => update({ newCareerForm: { ...state.newCareerForm, name: e.target.value } })} style={inp} />
          </div>
          <div>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 5 }}>Ícono</label>
            <select value={state.newCareerForm.icon} onChange={e => update({ newCareerForm: { ...state.newCareerForm, icon: e.target.value } })} style={{ ...inp, width: 80 }}>
              {CAREER_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 5 }}>Color</label>
            <div style={{ display: "flex", gap: 6, padding: "6px 0" }}>
              {CAREER_COLORS.map(col => (
                <div key={col} onClick={() => update({ newCareerForm: { ...state.newCareerForm, color: col } })} style={{ width: 22, height: 22, borderRadius: "50%", background: col, cursor: "pointer", border: state.newCareerForm.color === col ? "2px solid #fff" : "2px solid transparent", transition: "border 0.15s" }} />
              ))}
            </div>
          </div>
        </div>
        {state.newCareerForm.name && (
          <div style={{ ...glass(0.05), borderRadius: 12, padding: "12px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12, border: `1px solid ${state.newCareerForm.color}25` }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${state.newCareerForm.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{state.newCareerForm.icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: state.newCareerForm.color }}>{state.newCareerForm.name}</div>
              <div style={{ fontSize: 11, color: C.muted }}>Vista previa de la carrera</div>
            </div>
          </div>
        )}
        <button onClick={() => {
          if (!state.newCareerForm.name.trim()) { toast("Ingresa el nombre de la carrera", "⚠️", "error"); return; }
          if (state.careers.some(c => c.name.toLowerCase() === state.newCareerForm.name.trim().toLowerCase())) { toast("Ya existe una carrera con ese nombre", "⚠️", "error"); return; }
          createCareer.mutate({ name: state.newCareerForm.name.trim(), color: state.newCareerForm.color, icon: state.newCareerForm.icon });
          update({ newCareerForm: { name: "", icon: "🎓", color: C.blue } });
          toast(`Carrera "${state.newCareerForm.name}" creada ✅`);
        }} style={{ ...glassBlue, borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", border: "none" }}>
          ✅ Crear Carrera
        </button>
      </div>
    </div>
  );
}

export default function AdminView() {
  const { state, update } = useApp();
  const pageMap: Record<string, () => React.ReactNode> = {
    panel: AdminPanel, estadisticas: AdminEstadisticas, reportes: AdminReportes,
    solicitudes: AdminSolicitudes, activos: AdminActivos,
    inventario: AdminInventario, agregar: AdminAgregar, carreras: AdminCarreras,
  };
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside className="sidebar-fixed" style={{ width: 228, minHeight: "100vh", ...glassDark, borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 50, overflowY: "auto" }}>
        <div className="sidebar-logo" style={{ padding: "18px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <Logo />
          <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 5, background: `${C.blue}15`, border: `1px solid ${C.blue}28`, borderRadius: 6, padding: "2px 8px", fontSize: 9.5, fontWeight: 800, color: C.blue, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            ● Admin Panel
          </div>
        </div>
        <button className="sidebar-back" onClick={() => update({ view: "catalog" })} style={{ margin: "10px 10px 4px", ...glass(0.05), border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "8px", textAlign: "center", fontSize: 12, fontWeight: 600, color: C.muted, cursor: "pointer" }}>← Volver al Catálogo</button>
        <nav style={{ flex: 1, padding: "4px 8px" }}>
          {ADMIN_PAGES.map((pg, i) => (
            <motion.div key={pg.id} variants={slideLeft} custom={i} initial="hidden" animate="visible"
              whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
              onClick={() => update({ adminPage: pg.id })}
              style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", color: state.adminPage === pg.id ? C.text : C.muted, fontSize: 13, cursor: "pointer", borderRadius: 10, background: state.adminPage === pg.id ? "rgba(10,132,255,0.1)" : "transparent", borderLeft: state.adminPage === pg.id ? `2px solid ${C.blue}` : "2px solid transparent", transition: "background 0.15s, color 0.15s", marginBottom: 2 }}>
              <span style={{ fontSize: 14 }}>{pg.icon}</span>{pg.label}
            </motion.div>
          ))}
        </nav>
        <div className="sidebar-footer" style={{ padding: "12px 14px", fontSize: 9.5, color: "rgba(107,127,168,0.4)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>SISTEMA INVENTARIO v3.0</div>
      </aside>
      <div className="sidebar-content" style={{ marginLeft: 228, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ ...glassDark, display: "flex", alignItems: "center", gap: 12, padding: "0 28px", height: 52, position: "sticky", top: 0, zIndex: 60, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text, marginRight: "auto" }}>
            {ADMIN_PAGES.find(p => p.id === state.adminPage)?.label || "Panel de Control"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${C.blue}22`, border: `1px solid ${C.blue}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: C.blue }}>A</div>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 6, background: `${C.blue}14`, color: C.blue, textTransform: "uppercase", letterSpacing: 0.3 }}>Admin</span>
          </div>
        </div>
        <div style={{ padding: "28px 32px", flex: 1 }}>
          {(pageMap[state.adminPage] || AdminPanel)({})}
        </div>
      </div>
    </div>
  );
}
