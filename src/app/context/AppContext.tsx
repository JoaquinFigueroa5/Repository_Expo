import { createContext, useContext, useState, useRef, useCallback, type ReactNode } from "react";
import type { Tool, Loan, ViewType, LoanForm, ToastItem, NewCareerForm, AdminReq, Career } from "../types";
import { TOOLS0 } from "../data/tools";
import { LOANS0, ADMIN_REQS0 } from "../data/loans";
import { CURRENT_USER, CAREERS_DEFAULT } from "../data/user";
import { CATEGORIES_DEFAULT } from "../data/categories";
import { C } from "../constants/design";
import { today } from "../utils";

interface AppState {
  view: ViewType;
  showLoginPass: boolean;
  showRegPass: boolean;
  showRegPass2: boolean;
  selectedCareer: string | null;
  verifyCode: string[];
  tools: Tool[];
  loans: Loan[];
  adminReqs: AdminReq[];
  categories: string[];
  careers: Career[];
  activeCat: string | null;
  searchQ: string;
  searchFocused: boolean;
  selectedTool: Tool | null;
  loanFormTool: Tool | null;
  accountSection: string;
  adminPage: string;
  favorites: number[];
  viewedTools: number[];
  toasts: ToastItem[];
  loanForm: LoanForm;
  loanStep: "form" | "confirm" | "success";
  editTool: Tool | null;
  newCareerForm: NewCareerForm;
  newCatName: string;
}

interface AppContextValue {
  state: AppState;
  update: (partial: Partial<AppState>) => void;
  toast: (msg: string, icon?: string, type?: "success" | "error" | "info") => void;
  getTool: (id: number) => Tool | undefined;
  openToolDetail: (t: Tool) => void;
  openLoanForm: (t: Tool) => void;
  submitLoan: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    view: "landing",
    showLoginPass: false,
    showRegPass: false,
    showRegPass2: false,
    selectedCareer: null,
    verifyCode: ["", "", "", "", "", ""],
    tools: TOOLS0,
    loans: LOANS0,
    adminReqs: ADMIN_REQS0,
    categories: CATEGORIES_DEFAULT,
    careers: CAREERS_DEFAULT,
    activeCat: null,
    searchQ: "",
    searchFocused: false,
    selectedTool: null,
    loanFormTool: null,
    accountSection: "inicio",
    adminPage: "panel",
    favorites: [3, 7],
    viewedTools: [1, 3, 8],
    toasts: [],
    loanForm: { qty: 1, startDate: today(), endDate: "", notes: "" },
    loanStep: "form",
    editTool: null,
    newCareerForm: { name: "", icon: "🎓", color: C.blue },
    newCatName: "",
  });

  const toastId = useRef(0);
  const nextLoanId = useRef(20);
  const nextReqId = useRef(20);

  const update = useCallback((partial: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...partial }));
  }, []);

  const toast: AppContextValue["toast"] = useCallback((msg, icon = "✅", type = "success") => {
    const id = ++toastId.current;
    setState(prev => ({ ...prev, toasts: [...prev.toasts, { id, msg, icon, type }] }));
    setTimeout(() => {
      setState(prev => ({ ...prev, toasts: prev.toasts.filter(t => t.id !== id) }));
    }, 3500);
  }, []);

  const getTool: AppContextValue["getTool"] = (id: number) => state.tools.find(t => t.id === id);

  const openToolDetail: AppContextValue["openToolDetail"] = (t: Tool) => {
    setState(prev => ({
      ...prev,
      selectedTool: t,
      viewedTools: [t.id, ...prev.viewedTools.filter(id => id !== t.id)].slice(0, 8),
    }));
  };

  const openLoanForm: AppContextValue["openLoanForm"] = (t: Tool) => {
    setState(prev => ({
      ...prev,
      selectedTool: null,
      loanFormTool: t,
      loanForm: { qty: 1, startDate: today(), endDate: "", notes: "" },
      loanStep: "form",
    }));
  };

  const submitLoan: AppContextValue["submitLoan"] = () => {
    let toolName = "";
    setState(prev => {
      const tool = prev.loanFormTool;
      if (!tool) return prev;
      toolName = tool.name;
      const newLoan: Loan = {
        id: nextLoanId.current++, toolId: tool.id, qty: prev.loanForm.qty,
        loanDate: prev.loanForm.startDate, dueDate: prev.loanForm.endDate,
        returnDate: null, status: "active",
      };
      const updatedTools = (prev.tools as Tool[]).map(t =>
        t.id === tool.id
          ? { ...t, available: Math.max(0, t.available - prev.loanForm.qty), status: (t.available - prev.loanForm.qty <= 0 ? "in_use" : t.status) as Tool["status"] }
          : t
      ) as Tool[];
      return { ...prev, loans: [...prev.loans, newLoan], tools: updatedTools, loanStep: "success" };
    });
    if (toolName) toast(`Préstamo de "${toolName}" registrado`);
  };

  return (
    <AppContext.Provider value={{ state, update, toast, getTool, openToolDetail, openLoanForm, submitLoan }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
