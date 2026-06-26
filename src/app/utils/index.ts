export const today = () => new Date().toISOString().slice(0, 10);

export const fmtDate = (d: string) =>
  d ? new Date(d + "T12:00:00").toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" }) : "—";
