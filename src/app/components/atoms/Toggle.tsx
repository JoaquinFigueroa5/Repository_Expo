import { C } from "../../constants/design";

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div onClick={onToggle} style={{ width: 40, height: 22, borderRadius: 11, background: on ? C.blue : "rgba(255,255,255,0.1)", position: "relative", cursor: "pointer", flexShrink: 0, transition: "background 0.2s", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 1, left: on ? 20 : 1, transition: "left 0.2s", boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }} />
    </div>
  );
}
