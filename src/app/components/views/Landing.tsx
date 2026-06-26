import { motion } from "motion/react";
import { useApp } from "../../context/AppContext";

const HERO_IMAGES = [
  { url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1600&h=600&fit=crop&auto=format", label: "Taller de Mecánica" },
  { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=600&fit=crop&auto=format", label: "Laboratorio de Electricidad" },
  { url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1600&h=600&fit=crop&auto=format", label: "Lab de Computación" },
  { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=600&fit=crop&auto=format", label: "Equipos de Medición" },
];

export default function Landing() {
  const { update } = useApp();

  const W = {
    bg:        "#050505",
    bgGrad:    "linear-gradient(135deg, #050505 0%, #111827 60%, #050505 100%)",
    surface:   "#111827",
    surfaceHi: "#1a2540",
    border:    "rgba(37,99,235,0.22)",
    border2:   "rgba(37,99,235,0.12)",
    block:     "rgba(37,99,235,0.10)",
    blockDark: "#2563EB",
    glow:      "rgba(37,99,235,0.35)",
    text:      "#F9FAFB",
    textMed:   "#7DD3FC",
    textLight: "#38BDF8",
    textFaint: "rgba(125,211,252,0.45)",
    accent:    "#2563EB",
    accentHi:  "#38BDF8",
  };
  const wCard: React.CSSProperties = {
    background: W.surface,
    border: `1px solid ${W.border}`,
    borderRadius: 12,
    boxShadow: `0 0 32px rgba(37,99,235,0.06)`,
  };

  const features = [
    { icon: "◎", title: "Catálogo de Equipos", desc: "Consulta disponibilidad en tiempo real de herramientas, laptops y equipos de laboratorio." },
    { icon: "◇", title: "Solicitud de Préstamo", desc: "Solicita equipos en pocos pasos, con validación automática por carrera autorizada." },
    { icon: "△", title: "Control de Devoluciones", desc: "Seguimiento de fechas límite, alertas de atraso y registro de devoluciones al instante." },
    { icon: "□", title: "Panel Administrativo", desc: "El encargado gestiona inventario, aprueba solicitudes y genera reportes completos." },
  ];
  const testimonials = [
    { name: "Carlos G.", role: "Estudiante · Computación", text: "\"Antes tenía que ir físicamente al taller para saber si había equipo disponible. Ahora lo veo desde mi celular.\"", stars: 5 },
    { name: "Mariela T.", role: "Encargada de Taller", text: "\"El panel de control me permite aprobar solicitudes y llevar el inventario sin papeles ni hojas de Excel.\"", stars: 5 },
    { name: "Pedro R.", role: "Estudiante · Mecánica", text: "\"El sistema me avisa cuando se acerca la fecha de devolución. Nunca más me han cobrado atraso.\"", stars: 5 },
  ];
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: "'Inter','Plus Jakarta Sans',sans-serif", background: W.bgGrad, color: W.text, minHeight: "100vh" }}>
      <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
        style={{ background: "rgba(5,5,5,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${W.border}`, position: "sticky", top: 0, zIndex: 80 }}>
        <div className="land-header-inner" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 64 }}>
          <div className="land-logo" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/src/imports/E__2_-1.png" alt="REMA" style={{ height: 38, width: "auto", filter: "brightness(1.1) drop-shadow(0 0 8px rgba(56,189,248,0.4))" }} />
          </div>
          <nav className="land-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {[
              { l: "¿Cómo funciona?", id: "como-funciona" },
              { l: "Quiénes somos",   id: "quienes-somos-info" },
              { l: "Contacto",        id: "contacto" },
            ].map(({ l, id }) => (
              <span key={l} onClick={() => scrollTo(id)}
                style={{ fontSize: 13, fontWeight: 500, color: W.textFaint, cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = W.textLight)}
                onMouseLeave={e => (e.currentTarget.style.color = W.textFaint)}>{l}</span>
            ))}
            <motion.button className="landing-cta" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => update({ view: "login" })}
              style={{ background: `linear-gradient(135deg,${W.accent},#1d4ed8)`, color: "#fff", border: `1px solid rgba(56,189,248,0.45)`, borderRadius: 8, padding: "9px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: `0 0 16px rgba(37,99,235,0.35)` }}>
              Iniciar Sesión →
            </motion.button>
          </nav>
        </div>
      </motion.header>

      <section style={{ position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", flexDirection: "column" as const, justifyContent: "center" }}>
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle,rgba(37,99,235,0.12),transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle,rgba(56,189,248,0.07),transparent 70%)`, pointerEvents: "none" }} />

        <div className="hero-pad" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", width: "100%" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: W.block, border: `1px solid ${W.border}`, borderRadius: 20, padding: "5px 18px", fontSize: 11, fontWeight: 700, color: W.textLight, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: W.accentHi, display: "inline-block" }} />
              Sistema Institucional · 2026
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 110, marginBottom: 0 }}>
              {["B","I","E","N","V","E","N","I","D","O","S"," ","A"].map((char, i) => (
                char === " " ? (
                  <div key={`sp-${i}`} style={{ width: 28 }} />
                ) : (
                  <div key={`${char}-${i}`} className="rema-letter-col" style={{ flex: "0 0 62px", display: "grid", height: "110px", gridTemplateRows: "1fr 1fr", position: "relative", cursor: "pointer" }}>
                    <div className="rema-half" style={{ position: "relative", zIndex: 5 }} />
                    <div className="rema-half" style={{ position: "relative", zIndex: 5 }} />
                    <h1 className="rema-letter-h1" style={{ position: "absolute", left: 0, right: 0, top: "50%", zIndex: 0, color: "#fff", font: "900 62px 'Plus Jakarta Sans', sans-serif", textAlign: "center" as const, textShadow: `0 0 40px rgba(37,99,235,0.7), 0 10px 25px rgba(0,0,0,0.5)`, textTransform: "uppercase" as const, transition: "margin-top 0.3s cubic-bezier(0.23,1,0.32,1), color 0.3s, text-shadow 0.3s", pointerEvents: "none" as const, marginTop: -31, letterSpacing: "0.04em" }}>{char}</h1>
                  </div>
                )
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 110 }}>
              {["R","gap","E","gap","M","gap","A"].map((char, i) => (
                char === "gap" ? (
                  <div key={`g-${i}`} style={{ width: 20 }} />
                ) : (
                  <div key={`rema-${char}-${i}`} className="rema-letter-col" style={{ flex: "0 0 90px", display: "grid", height: "110px", gridTemplateRows: "1fr 1fr", position: "relative", cursor: "pointer" }}>
                    <div className="rema-half" style={{ position: "relative", zIndex: 5 }} />
                    <div className="rema-half" style={{ position: "relative", zIndex: 5 }} />
                    <h1 className="rema-letter-h1" style={{ position: "absolute", left: 0, right: 0, top: "50%", zIndex: 0, color: W.accentHi, font: "900 88px 'Plus Jakarta Sans', sans-serif", textAlign: "center" as const, textShadow: `0 0 60px rgba(56,189,248,0.8), 0 0 20px rgba(37,99,235,0.9), 0 10px 30px rgba(0,0,0,0.6)`, textTransform: "uppercase" as const, transition: "margin-top 0.3s cubic-bezier(0.23,1,0.32,1), color 0.3s, text-shadow 0.3s", pointerEvents: "none" as const, marginTop: -44, letterSpacing: "0.06em" }}>{char}</h1>
                  </div>
                )
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
            style={{ textAlign: "center" as const, marginTop: 28 }}>
            <p style={{ fontSize: 15, color: W.textFaint, lineHeight: 1.8, maxWidth: 560, margin: "0 auto 32px" }}>
              Consulta disponibilidad, solicita herramientas y gestiona devoluciones — diseñado para los talleres y laboratorios del instituto.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", alignItems: "center", flexWrap: "wrap" as const }}>
              <motion.button className="landing-cta" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => update({ view: "login" })}
                style={{ background: `linear-gradient(135deg,${W.accent},#1d4ed8)`, color: "#fff", border: `1px solid rgba(56,189,248,0.45)`, borderRadius: 12, padding: "13px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: `0 0 24px rgba(37,99,235,0.45)` }}>
                Iniciar Sesión →
              </motion.button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 28, justifyContent: "center" }}>
              <div style={{ display: "flex" }}>
                {["C","M","E","P","A"].map((l, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${W.accent},#1d4ed8)`, border: `2px solid ${W.bg}`, marginLeft: i === 0 ? 0 : -8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>{l}</div>
                ))}
              </div>
              <span style={{ fontSize: 12.5, color: W.textFaint }}><strong style={{ color: W.textLight }}>+340</strong> estudiantes activos este ciclo</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6, ease: [0.22,1,0.36,1] }}
            style={{ maxWidth: 480, margin: "52px auto 0" }}>
            <div style={{ background: W.surface, border: `1px solid ${W.border}`, borderRadius: 20, padding: 8, boxShadow: `0 24px 80px rgba(0,0,0,0.7), 0 0 60px ${W.glow}` }}>
              <div style={{ background: "#0a0f1e", borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[W.accent,"#1d4ed8","rgba(37,99,235,0.3)"].map((c,i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                  </div>
                  <div style={{ width: 100, height: 6, background: "rgba(37,99,235,0.18)", borderRadius: 4 }} />
                  <div style={{ width: 24, height: 6, background: "rgba(37,99,235,0.12)", borderRadius: 4 }} />
                </div>
                <div style={{ background: W.surface, border: `1px solid ${W.border}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 9, color: W.textLight, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 4 }}>✦ Disponible</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: W.text }}>Taladro Bosch 18V</div>
                      <div style={{ fontSize: 10.5, color: W.textFaint, marginTop: 2 }}>MC-001 · Taller Mecánica</div>
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: W.block, border: `1px solid ${W.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>⚙️</div>
                  </div>
                  <div style={{ width: "100%", height: 4, background: "rgba(37,99,235,0.1)", borderRadius: 2, overflow: "hidden", marginBottom: 10 }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 1.2, delay: 0.8 }}
                      style={{ height: "100%", background: `linear-gradient(90deg,${W.accent},${W.accentHi})`, borderRadius: 2, boxShadow: `0 0 8px ${W.glow}` }} />
                  </div>
                  <div style={{ background: `linear-gradient(135deg,${W.accent},#1d4ed8)`, color: "#fff", borderRadius: 7, padding: "8px", textAlign: "center" as const, fontSize: 11, fontWeight: 700, boxShadow: `0 0 16px ${W.glow}` }}>Solicitar préstamo →</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[["Herramientas","48","📦"],[" Préstamos hoy","12","📋"]].map(([l,v,ic]) => (
                    <div key={l} style={{ background: W.block, border: `1px solid ${W.border2}`, borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ fontSize: 14, marginBottom: 4 }}>{ic}</div>
                      <div style={{ fontSize: 9.5, color: W.textFaint, marginBottom: 2 }}>{l}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: W.textLight }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${W.accent}66, transparent)` }} />
      </div>

      <section id="como-funciona" style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 40px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ textAlign: "center" as const, marginBottom: 52 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: W.textLight, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 12 }}>¿Qué puedes hacer?</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: W.text, marginBottom: 12 }}>Todo el control del inventario en un solo lugar</h2>
          <p style={{ fontSize: 15, color: W.textFaint, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>Desde consultar disponibilidad hasta aprobar solicitudes — el sistema cubre todo el ciclo de préstamos del instituto.</p>
        </motion.div>
        <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {features.map((f, i) => (
            <motion.div key={f.title} className="glow-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }}
              whileHover={{ y: -4 }}
              style={{ ...wCard, padding: "28px 24px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: W.block, border: `1px solid ${W.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: W.accentHi, marginBottom: 18, boxShadow: `0 0 16px ${W.glow}` }}>{f.icon}</div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: W.text, marginBottom: 10, letterSpacing: "-0.01em" }}>{f.title}</div>
              <div style={{ fontSize: 13, color: W.textFaint, lineHeight: 1.65 }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ background: "linear-gradient(180deg,#050505 0%,#0d1527 50%,#050505 100%)", borderTop: `1px solid ${W.border}`, borderBottom: `1px solid ${W.border}`, padding: "72px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ textAlign: "center" as const, marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", color: W.text, marginBottom: 10 }}>Visibilidad total del inventario</h2>
            <p style={{ fontSize: 14.5, color: W.textFaint, maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>Estadísticas, reportes y estado en tiempo real de cada herramienta del taller.</p>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              style={{ background: W.surface, borderRadius: 16, padding: 28, minHeight: 240, border: `1px solid ${W.border}` }}>
              <div style={{ width: 140, height: 10, background: `linear-gradient(90deg,${W.accent},${W.accentHi})`, borderRadius: 5, marginBottom: 16 }} />
              <div style={{ width: "100%", height: 1, background: W.border, marginBottom: 20 }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[{ v: 70, l: "Comput." }, { v: 50, l: "Mecánica" }, { v: 85, l: "Electricidad" }].map(({ v, l }, i) => (
                  <div key={i} style={{ background: W.block, border: `1px solid ${W.border2}`, borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: W.textLight }}>{v}%</div>
                    <div style={{ fontSize: 10, color: W.textFaint, marginBottom: 6 }}>{l}</div>
                    <div style={{ width: "100%", height: 4, background: "rgba(37,99,235,0.1)", borderRadius: 2, overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${v}%` }} viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.12 }}
                        style={{ height: "100%", background: `linear-gradient(90deg,${W.accent},${W.accentHi})`, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18 }}>
                {[90, 75, 60, 45].map((w, i) => (
                  <div key={i} style={{ width: `${w}%`, height: 7, background: `linear-gradient(90deg,${W.accent}${Math.round(255 * (1 - i * 0.2)).toString(16).padStart(2,"0")},transparent)`, borderRadius: 4, marginBottom: 8 }} />
                ))}
              </div>
            </motion.div>
            {[
              { label: "Disponibles ahora", sub: "Herramientas totales", val: "36", c: W.textLight },
              { label: "Préstamos activos", sub: "Este mes", val: "12", c: W.accentHi },
            ].map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                style={{ background: W.surface, borderRadius: 16, padding: 24, border: `1px solid ${W.border}` }}>
                <div style={{ fontSize: 11, color: W.textLight, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 8 }}>{card.label}</div>
                <div style={{ fontSize: 12, color: W.textFaint, marginBottom: 16 }}>{card.sub}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: (card as any).c || W.textLight, letterSpacing: "-0.03em" }}>{card.val}</div>
                <div style={{ width: "100%", height: 4, background: W.border, borderRadius: 2, marginTop: 16, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: i === 0 ? "55%" : "80%" }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.3, ease: [0.22,1,0.36,1] }}
                    style={{ height: "100%", background: W.blockDark, borderRadius: 2 }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="quienes-somos" style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 40px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ textAlign: "center" as const, marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: W.textLight, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 12 }}>Testimonios</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", background: `linear-gradient(90deg,${W.text},${W.textLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Lo que dicen estudiantes y encargados</h2>
        </motion.div>
        <div className="test-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {testimonials.map((t, i) => (
            <motion.div key={t.name} className="glow-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.45 }}
              whileHover={{ y: -3 }}
              style={{ ...wCard, padding: "28px 26px" }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {Array.from({ length: t.stars }).map((_, s) => (
                  <span key={s} style={{ fontSize: 14, color: W.accentHi }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: 14, color: W.textFaint, lineHeight: 1.7, marginBottom: 22, fontStyle: "italic" }}>{t.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 16, borderTop: `1px solid ${W.border2}` }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${W.accent},#1d4ed8)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: W.text }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: W.textLight }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="quienes-somos-info" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ textAlign: "center" as const, marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: W.textLight, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 12 }}>Quiénes Somos</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", background: `linear-gradient(90deg,${W.text},${W.textLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 14 }}>
            El equipo detrás de REMA
          </h2>
          <p style={{ fontSize: 15, color: W.textFaint, maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
            Manteniendo a Flote el Orden — somos el Instituto Técnico Superior, comprometidos con la educación técnica y el acceso a herramientas de calidad para cada estudiante.
          </p>
        </motion.div>
        <div className="qs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 52 }}>
          {[
            { icon: "🎯", title: "Misión", color: W.accent, desc: "Facilitar el acceso a herramientas y equipos de calidad para que cada estudiante pueda desarrollar sus habilidades técnicas sin barreras." },
            { icon: "🔭", title: "Visión", color: W.accentHi, desc: "Ser el sistema de referencia en gestión de inventario institucional en Guatemala, modelo de eficiencia y transparencia." },
            { icon: "⚓", title: "Valores", color: "#30D158", desc: "Orden, responsabilidad, accesibilidad y tecnología al servicio de la comunidad educativa técnica del instituto." },
          ].map((item, i) => (
            <motion.div key={item.title} className="glow-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -4 }}
              style={{ background: W.surface, border: `1px solid ${W.border}`, borderRadius: 18, padding: "32px 28px", position: "relative" as const, overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${item.color},transparent)`, borderRadius: "18px 18px 0 0" }} />
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${item.color}15`, border: `1px solid ${item.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 18 }}>{item.icon}</div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 18, fontWeight: 800, color: item.color, marginBottom: 12, letterSpacing: "-0.01em" }}>{item.title}</h3>
              <p style={{ fontSize: 13.5, color: W.textFaint, lineHeight: 1.75 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px 80px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ background: `linear-gradient(135deg,#111827 0%,#1e3a8a 50%,#111827 100%)`, border: `1px solid ${W.border}`, borderRadius: 20, padding: "56px 64px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, boxShadow: `0 0 80px ${W.glow}, inset 0 1px 0 rgba(56,189,248,0.15)`, position: "relative" as const, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-40%", left: "30%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle,${W.accent}44,transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", color: W.text, marginBottom: 10 }}>Accede al sistema ahora.</h2>
            <p style={{ fontSize: 14.5, color: W.textFaint, lineHeight: 1.7 }}>Consulta equipos, solicita préstamos y gestiona devoluciones desde cualquier dispositivo.</p>
          </div>
          <motion.button className="landing-cta" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
            onClick={() => update({ view: "login" })}
            style={{ background: `linear-gradient(135deg,${W.accentHi},${W.accent})`, color: "#fff", border: "1px solid rgba(56,189,248,0.5)", borderRadius: 12, padding: "14px 36px", fontSize: 15, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" as const, flexShrink: 0, position: "relative" as const, zIndex: 1, boxShadow: "0 0 24px rgba(37,99,235,0.5)" }}>
            Iniciar Sesión →
          </motion.button>
        </motion.div>
      </section>

      <footer id="contacto" style={{ background: "#050505", borderTop: `1px solid ${W.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 40px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 40 }}>
            <div>
              <div style={{ marginBottom: 14 }}>
                <img src="/src/imports/E__2_-1.png" alt="REMA" style={{ height: 36, width: "auto", filter: "brightness(1.1) drop-shadow(0 0 6px rgba(56,189,248,0.35))" }} />
              </div>
              <p style={{ fontSize: 13, color: W.textFaint, lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>Sistema institucional para préstamo de herramientas, equipos de laboratorio y dispositivos de los talleres.</p>
              <div style={{ display: "flex", gap: 10 }}>
                {["tw", "ig", "yt", "li"].map(s => (
                  <div key={s} style={{ width: 32, height: 32, borderRadius: 8, background: W.block, border: `1px solid ${W.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: W.textLight, cursor: "pointer" }}>{s.toUpperCase()}</div>
                ))}
              </div>
            </div>
            {[
              { title: "Sistema", links: ["Catálogo de Equipos", "Solicitar Préstamo", "Mis Préstamos", "Panel Admin"] },
              { title: "Áreas", links: ["Computación", "Mecánica", "Electricidad", "Laboratorios"] },
              { title: "Contacto", links: ["talleres@instituto.edu.gt", "+502 2345 6789", "Ciudad de Guatemala", "Lun–Vie 7–17h"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 11, fontWeight: 700, color: W.textLight, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 16 }}>{col.title}</div>
                {col.links.map(l => (
                  <div key={l} style={{ fontSize: 13, color: W.textFaint, marginBottom: 10, cursor: "pointer" }}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: W.border, marginBottom: 24 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: W.textFaint }}>
            <span>© 2026 Instituto Técnico Superior · Sistema de Gestión de Préstamos</span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacidad", "Términos", "Cookies"].map(l => <span key={l} style={{ cursor: "pointer", color: W.textFaint }}>{l}</span>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
