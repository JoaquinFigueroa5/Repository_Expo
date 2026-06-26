export type ToolStatus = "available" | "in_use" | "maintenance" | "reserved";
export type LoanStatus = "active" | "returned" | "overdue";

export interface Tool {
  id: number; name: string; cat: string; code: string; desc: string;
  brand: string; location: string; totalQty: number; available: number;
  status: ToolStatus; image: string; maxDays: number;
  specs: { k: string; v: string }[]; careers: string[];
}

export interface Loan {
  id: number; toolId: number; qty: number;
  loanDate: string; dueDate: string; returnDate: string | null; status: LoanStatus;
}

export interface AdminReq {
  id: number; toolId: number; qty: number; startDate: string; endDate: string;
  notes: string; status: "pending" | "approved" | "rejected";
  reqDate: string; student: string; career: string;
}

export interface Career {
  id: number; name: string; color: string; icon: string;
}

export type ViewType = "landing" | "login" | "register" | "forgot" | "verify" | "catalog" | "account" | "admin";

export interface LoanForm {
  qty: number; startDate: string; endDate: string; notes: string;
}

export interface ToastItem {
  id: number; msg: string; icon: string; type: "success" | "error" | "info";
}

export interface NewCareerForm {
  name: string; icon: string; color: string;
}
