import type { Loan, AdminReq } from "../types";

export const LOANS0: Loan[] = [
  { id: 1, toolId: 1, qty: 1, loanDate: "2026-06-10", dueDate: "2026-06-13", returnDate: null, status: "active" },
  { id: 2, toolId: 3, qty: 1, loanDate: "2026-06-05", dueDate: "2026-06-10", returnDate: "2026-06-09", status: "returned" },
  { id: 3, toolId: 8, qty: 1, loanDate: "2026-06-15", dueDate: "2026-06-20", returnDate: null, status: "overdue" },
  { id: 4, toolId: 7, qty: 2, loanDate: "2026-06-18", dueDate: "2026-06-22", returnDate: "2026-06-21", status: "returned" },
];

export const ADMIN_REQS0: AdminReq[] = [
  { id: 1, toolId: 5, qty: 1, startDate: "2026-06-23", endDate: "2026-06-26", notes: "Proyecto final de semestre", status: "pending", reqDate: "2026-06-21", student: "Ana López Morales", career: "Electricidad y Electrónica" },
  { id: 2, toolId: 1, qty: 2, startDate: "2026-06-24", endDate: "2026-06-28", notes: "Práctica de redes", status: "pending", reqDate: "2026-06-22", student: "Pedro Ramírez Torres", career: "Computación e Informática" },
  { id: 3, toolId: 2, qty: 1, startDate: "2026-06-20", endDate: "2026-06-22", notes: "Taller de mecánica", status: "approved", reqDate: "2026-06-19", student: "María González", career: "Mecánica Automotriz" },
];
