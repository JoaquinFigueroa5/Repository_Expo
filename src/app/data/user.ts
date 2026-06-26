import type { Career } from "../types";

export const CURRENT_USER = {
  name: "Carlos García Pérez", career: "Computación e Informática",
  workshop: "Lab Computación A", carnet: "2023-1234",
  email: "carlos.garcia@instituto.edu.gt", phone: "+502 4567 8901",
};

export const CAREERS_DEFAULT: Career[] = [
  { id: 1, name: "Computación e Informática", color: "#0A84FF", icon: "💻" },
  { id: 2, name: "Mecánica Automotriz", color: "#FF9F0A", icon: "⚙️" },
  { id: 3, name: "Electricidad y Electrónica", color: "#FFD60A", icon: "⚡" },
];
