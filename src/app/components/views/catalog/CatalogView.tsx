import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../../../context/AppContext";
import { C, glass, glassDark, glassBlue, STATUS_MAP, CAT_ICONS, CAT_COLORS } from "../../../constants/design";
import { useUser } from "../../../context/useUser";
import { fadeUp } from "../../../animate/variants";
import { Logo } from "../../atoms/Logo";
import { useTools } from "../../../../hooks/useTools";
import { useAddFavorite, useRemoveFavorite } from "../../../../hooks/useFavorites";
import { mapApiToolToTool } from "../../../../lib/mappers";

const HERO_IMAGES = [
  { url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1600&h=600&fit=crop&auto=format", label: "Taller de Mecánica" },
  { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=600&fit=crop&auto=format", label: "Laboratorio de Electricidad" },
  { url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1600&h=600&fit=crop&auto=format", label: "Lab de Computación" },
  { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=600&fit=crop&auto=format", label: "Equipos de Medición" },
];

export default function CatalogView() {
  const { state, update, toast, openToolDetail, openLoanForm, user, logout } = useApp();
  const u = useUser();
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 4000);
    return () => clearInterval(iv);
  }, []);

  const { data: apiTools, isLoading } = useTools();
  useEffect(() => {
    if (apiTools) {
      update({ tools: apiTools.map(mapApiToolToTool) as any });
    }
  }, [apiTools]);

  const overdueLoans = state.loans.filter(l => l.status === "overdue");

  const filtered = state.tools.filter(t => {
    if (state.activeCat && t.cat !== state.activeCat) return false;
    if (state.searchQ && !t.name.toLowerCase().includes(state.searchQ.toLowerCase()) && !t.code.toLowerCase().includes(state.searchQ.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header style={{ ...glassDark, position: "sticky", top: 0, zIndex: 80, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, padding: "13px 24px" }}>
          <Logo />
          <div style={{ flex: 1, maxWidth: 420, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", ...glass(state.searchFocused ? 0.09 : 0.05, 12), borderRadius: 12, padding: "9px 14px", gap: 9, border: state.searchFocused ? `1px solid ${C.blue}55` : "1px solid rgba(255,255,255,0.08)", transition: "border 0.2s, box-shadow 0.2s", boxShadow: state.searchFocused ? `0 0 0 3px ${C.blue}22, 0 0 20px ${C.blue}18` : "none" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={state.searchFocused ? C.blue : C.muted} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, transition: "stroke 0.2s" }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input value={state.searchQ}
                onChange={e => update({ searchQ: e.target.value })}
                onFocus={() => update({ searchFocused: true })}
                onBlur={() => setTimeout(() => update({ searchFocused: false }), 150)}
                placeholder="Buscar herramienta o código..."
                style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, width: "100%", color: C.text }} />
              {state.searchQ && <button onClick={() => update({ searchQ: "" })} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 14, padding: 0, flexShrink: 0 }}>✕</button>}
            </div>
            <AnimatePresence>
              {(state.searchFocused && state.searchQ.length > 0) && (() => {
                const hits = state.tools.filter(t =>
                  t.name.toLowerCase().includes(state.searchQ.toLowerCase()) ||
                  t.code.toLowerCase().includes(state.searchQ.toLowerCase()) ||
                  t.cat.toLowerCase().includes(state.searchQ.toLowerCase())
                ).slice(0, 6);
                return (
                  <motion.div key="autocomplete"
                    initial={{ opacity: 0, y: -6, scaleY: 0.95 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 200, ...glassDark, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.blue}33`, boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 20px ${C.blue}18` }}>
                    {hits.length === 0 ? (
                      <div style={{ padding: "14px 16px", fontSize: 13, color: C.muted, textAlign: "center" }}>Sin resultados para "{state.searchQ}"</div>
                    ) : hits.map(t => {
                      const sc = STATUS_MAP[t.status];
                      const hi = (str: string) => {
                        const idx = str.toLowerCase().indexOf(state.searchQ.toLowerCase());
                        if (idx < 0) return <span>{str}</span>;
                        return <span>{str.slice(0, idx)}<mark style={{ background: `${C.blue}44`, color: C.text, borderRadius: 3, padding: "0 2px" }}>{str.slice(idx, idx + state.searchQ.length)}</mark>{str.slice(idx + state.searchQ.length)}</span>;
                      };
                      return (
                        <div key={t.id} onMouseDown={() => { openToolDetail(t); update({ searchQ: "", searchFocused: false }); }}
                          style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.12s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = `${C.blue}12`)}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          <img src={t.image} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{hi(t.name)}</div>
                            <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{hi(t.code)} · {t.cat}</div>
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: sc.bg, color: sc.color, whiteSpace: "nowrap", border: `1px solid ${sc.color}28` }}>{sc.label}</span>
                        </div>
                      );
                    })}
                    {hits.length > 0 && (
                      <div style={{ padding: "8px 14px", fontSize: 11.5, color: C.blue, fontWeight: 600, textAlign: "center", cursor: "pointer", borderTop: "1px solid rgba(255,255,255,0.04)" }}
                        onMouseDown={() => update({ searchFocused: false })}>
                        Ver todos los resultados ({state.tools.filter(t => t.name.toLowerCase().includes(state.searchQ.toLowerCase()) || t.code.toLowerCase().includes(state.searchQ.toLowerCase())).length}) →
                      </div>
                    )}
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            <a href="#" style={{ color: C.muted, textDecoration: "none", fontSize: 13, fontWeight: 500, padding: "7px 12px", borderRadius: 9 }}
            onClick={e => { e.preventDefault(); update({ view: "landing" }); }}>← Inicio</a>
          </nav>
          <div style={{ display: "flex", gap: 8, marginLeft: "auto", alignItems: "center" }}>
            {overdueLoans.length > 0 && (
              <div style={{ ...glass(0.05), borderRadius: 10, padding: "7px 12px", fontSize: 12, fontWeight: 600, color: C.red, display: "flex", alignItems: "center", gap: 6, border: `1px solid ${C.red}28` }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.red, display: "inline-block" }} />
                {overdueLoans.length} atrasado{overdueLoans.length > 1 ? "s" : ""}
              </div>
            )}
            <button onClick={() => update({ view: "account" })} style={{ ...glass(0.07), borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: C.text, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${C.blue}22`, border: `1px solid ${C.blue}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.blue }}>{u.name[0]}</div>
              Mi Cuenta
            </button>
            {user?.role === "ADMIN" && (
              <button onClick={() => update({ view: "admin" })} style={{ ...glass(0.05), borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 600, color: C.muted, cursor: "pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ verticalAlign: "middle", marginRight: 5 }}><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M4.93 4.93a10 10 0 0 0 0 14.14" /></svg>
                Admin
              </button>
            )}
            <button onClick={() => { logout(); update({ view: "landing" }); }} style={{ ...glass(0.05), borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 600, color: C.red, cursor: "pointer" }}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <section style={{ position: "relative", overflow: "hidden", padding: "56px 24px 44px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <AnimatePresence mode="sync">
          <motion.div key={heroIdx}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 0.07, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: `url(${HERO_IMAGES[heroIdx].url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        </AnimatePresence>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(ellipse at 30% 60%, rgba(10,132,255,0.15), transparent 55%)" }} />
        <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${C.blue}18`, border: `1px solid ${C.blue}30`, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: C.blue, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 18 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.blue, display: "inline-block" }} />
            Sistema de Gestión de Inventario
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 44, fontWeight: 800, lineHeight: 1.15, marginBottom: 14, letterSpacing: "-0.03em" }}>
            Préstamo de Equipos<br />
            <span style={{ background: `linear-gradient(90deg,${C.blue},${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>y Herramientas</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible"
            style={{ color: C.muted, fontSize: 15, maxWidth: 500, lineHeight: 1.8, marginBottom: 28 }}>
            Plataforma institucional para consulta de disponibilidad, solicitud de préstamos y gestión de devoluciones.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.03, boxShadow: "0 12px 32px rgba(10,132,255,0.45)" }} whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("grid-tools")?.scrollIntoView({ behavior: "smooth" })} style={{ ...glassBlue, borderRadius: 12, padding: "11px 24px", fontWeight: 700, fontSize: 14, color: "#fff", cursor: "pointer", border: "none" }}>
              Explorar Equipos →
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => update({ view: "account" })} style={{ ...glass(0.07), borderRadius: 12, padding: "11px 24px", fontWeight: 600, fontSize: 14, color: C.text, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)" }}>
              Mis Préstamos
            </motion.button>
          </motion.div>
          <div style={{ display: "flex", gap: 32, marginTop: 36, flexWrap: "wrap" }}>
            {[
              { n: state.tools.filter(t => t.status === "available").length, l: "Disponibles", c: C.green },
              { n: state.tools.filter(t => t.status === "in_use").length, l: "En Uso", c: C.red },
              { n: state.tools.filter(t => t.status === "maintenance").length, l: "Mantenimiento", c: C.muted },
              { n: state.tools.length, l: "Total Equipos", c: C.blue },
            ].map(({ n, l, c }, i) => (
              <motion.div key={l} variants={fadeUp} custom={4 + i} initial="hidden" animate="visible" style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 30, fontWeight: 800, color: c, letterSpacing: "-0.03em" }}>{n}</div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{l}</div>
              </motion.div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 28 }}>
            {HERO_IMAGES.map((img, i) => (
              <button key={i} onClick={() => setHeroIdx(i)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 6 }}>
                <motion.div animate={{ width: heroIdx === i ? 24 : 8, background: heroIdx === i ? C.blue : "rgba(255,255,255,0.25)" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: 8, borderRadius: 4 }} />
              </button>
            ))}
            <AnimatePresence mode="wait">
              <motion.span key={heroIdx} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.3 }}
                style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginLeft: 4, letterSpacing: "0.04em" }}>
                {HERO_IMAGES[heroIdx].label}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1320, margin: "0 auto", padding: "28px 24px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em" }}>Áreas de Equipos</h2>
          {state.activeCat && <button onClick={() => update({ activeCat: null })} style={{ fontSize: 12, fontWeight: 600, color: C.blue, background: "none", border: "none", cursor: "pointer" }}>Ver todo ×</button>}
        </div>
        <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {state.categories.map((c, i) => {
            const cnt = state.tools.filter(t => t.cat === c).length;
            const avail = state.tools.filter(t => t.cat === c && t.status === "available").length;
            const col = CAT_COLORS[c] || C.blue;
            const active = state.activeCat === c;
            return (
              <motion.div key={c} variants={fadeUp} custom={i} initial="hidden" animate="visible"
                whileHover={{ scale: 1.02, boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${col}40` }}
                whileTap={{ scale: 0.98 }}
                onClick={() => update({ activeCat: state.activeCat === c ? null : c })}
                style={{ ...glass(active ? 0.09 : 0.05), borderRadius: 16, padding: "18px 20px", cursor: "pointer", border: active ? `1px solid ${col}50` : "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 14 }}>
                <motion.div animate={{ rotate: active ? [0, -8, 8, 0] : 0 }} transition={{ duration: 0.4 }}
                  style={{ width: 44, height: 44, borderRadius: 12, background: `${col}18`, border: `1px solid ${col}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{CAT_ICONS[c] || "📦"}</motion.div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: active ? col : C.text }}>{c}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3 }}><span style={{ color: C.green, fontWeight: 600 }}>{avail}</span> / {cnt} disponibles</div>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${col}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 16, fontWeight: 800, color: col }}>{avail}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="grid-tools" style={{ maxWidth: 1320, margin: "0 auto", padding: "20px 24px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em" }}>
            {state.activeCat || "Todos los Equipos"}
            <span style={{ fontSize: 13, fontWeight: 400, color: C.muted, marginLeft: 8 }}>{filtered.length} resultados</span>
          </h2>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ k: "all", l: "Todos" }, { k: "available", l: "Disponibles" }, { k: "in_use", l: "En Uso" }].map(({ k, l }) => (
              <button key={k} style={{ ...glass(0.05), borderRadius: 8, padding: "5px 12px", fontSize: 11.5, fontWeight: 600, cursor: "pointer", color: C.muted, border: "1px solid rgba(255,255,255,0.07)" }}>{l}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: C.muted }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Sin resultados</div>
            <div style={{ fontSize: 13 }}>Intenta con otro término o categoría.</div>
          </div>
        ) : (
          <motion.div className="tool-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            <AnimatePresence mode="popLayout">
            {filtered.map((tool, i) => {
              const isFav = state.favorites.includes(tool.id);
              const sc = STATUS_MAP[tool.status];
              const catCol = CAT_COLORS[tool.cat] || C.blue;
              return (
                <motion.div key={tool.id} className="glow-card"
                  variants={fadeUp} custom={i % 6} initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }} layout
                  whileHover={{ y: -5, boxShadow: `0 24px 56px rgba(0,0,0,0.55), 0 0 0 1px ${catCol}35` }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openToolDetail(tool)}
                  style={{ ...glass(0.05), borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer" }}>
                  <div style={{ height: 128, position: "relative", overflow: "hidden", background: "rgba(0,0,0,0.3)" }}>
                    <img src={tool.image} alt={tool.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(6,10,20,0.85) 0%,transparent 55%)" }} />
                    <div style={{ position: "absolute", top: 10, left: 10 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: sc.bg, color: sc.color, border: `1px solid ${sc.color}28`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", textTransform: "uppercase", letterSpacing: 0.3 }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: sc.color }} />{sc.label}
                      </span>
                    </div>
                    <button onClick={e => { e.stopPropagation(); if (state.favorites.includes(tool.id)) { removeFav.mutate(tool.id); } else { addFav.mutate(tool.id); } }}
                      style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "none", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: isFav ? C.yellow : "rgba(255,255,255,0.5)" }}>
                      {isFav ? "★" : "☆"}
                    </button>
                    <div style={{ position: "absolute", bottom: 8, left: 10, fontSize: 9, color: "#94a3b8", fontWeight: 600, background: "rgba(0,0,0,0.55)", padding: "2px 7px", borderRadius: 6, backdropFilter: "blur(8px)" }}>
                      {CAT_ICONS[tool.cat] || "📦"} {tool.cat}
                    </div>
                  </div>
                  <div style={{ padding: "12px 13px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, lineHeight: 1.3, color: C.text }}>{tool.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted }}>
                      <span style={{ color: catCol, fontWeight: 600 }}>#{tool.code}</span>
                      <span>📍 {tool.location}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 4 }}>
                      <div>
                        <div style={{ fontSize: 10, color: C.muted, marginBottom: 1 }}>Disponibles</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: tool.available > 0 ? C.green : C.red, lineHeight: 1, letterSpacing: "-0.02em" }}>
                          {tool.available}<span style={{ fontSize: 11, fontWeight: 500, color: C.muted }}>/{tool.totalQty}</span>
                        </div>
                      </div>
                      <motion.button whileHover={{ scale: tool.available > 0 ? 1.05 : 1 }} whileTap={{ scale: tool.available > 0 ? 0.95 : 1 }}
                        onClick={e => { e.stopPropagation(); if (tool.available > 0) openLoanForm(tool); else toast("Sin unidades disponibles", "⚠️", "error"); }}
                        style={{ ...(tool.available > 0 ? glassBlue : glass(0.05)), borderRadius: 9, padding: "6px 13px", fontSize: 12, fontWeight: 700, color: tool.available > 0 ? "#fff" : C.muted, cursor: tool.available > 0 ? "pointer" : "not-allowed", border: tool.available > 0 ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
                        {tool.available > 0 ? "Solicitar" : "Sin stock"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <footer style={{ background: "rgba(4,8,18,0.98)", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px", marginTop: "auto" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <Logo />
          <div style={{ fontSize: 12, color: "rgba(107,127,168,0.5)" }}>© 2026 Instituto Técnico Superior · Sistema de Gestión de Inventario</div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.muted }}>
            <span>+502 2345 6789</span><span>talleres@instituto.edu.gt</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
