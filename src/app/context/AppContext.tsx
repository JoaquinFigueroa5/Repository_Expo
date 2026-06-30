import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import type { Tool, Loan, ViewType, VerifyMode, LoanForm, ToastItem, NewCareerForm, AdminReq, Career, ApiUser } from "../types";
import { C } from "../constants/design";
import { today } from "../utils";
import { useMe, useLogout } from "../../hooks/useAuth";
import { useTools } from "../../hooks/useTools";
import { useMyLoans } from "../../hooks/useLoans";
import { useMyFavorites } from "../../hooks/useFavorites";
import { useAdminCategories, useAdminCareers } from "../../hooks/useAdmin";
import { useAllRequests } from "../../hooks/useRequests";
import { isAuthenticated } from "../../lib/auth";
import { mapApiToolToTool, mapApiLoanToLoan, mapApiRequestToAdminReq, mapApiCareerToCareer } from "../../lib/mappers";

interface AppState {
  view: ViewType;
  showLoginPass: boolean;
  showRegPass: boolean;
  showRegPass2: boolean;
  selectedCareer: string | null;
  verifyCode: string[];
  verifyEmail: string;
  verifyMode: VerifyMode;
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
  user: ApiUser | undefined;
  isAuth: boolean;
  logout: () => void;
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
    verifyEmail: "",
    verifyMode: "reset",
    tools: [],
    loans: [],
    adminReqs: [],
    categories: [],
    careers: [],
    activeCat: null,
    searchQ: "",
    searchFocused: false,
    selectedTool: null,
    loanFormTool: null,
    accountSection: "inicio",
    adminPage: "panel",
    favorites: [],
    viewedTools: [1, 3, 8],
    toasts: [],
    loanForm: { qty: 1, startDate: today(), endDate: "", notes: "" },
    loanStep: "form",
    editTool: null,
    newCareerForm: { name: "", icon: "🎓", color: C.blue },
    newCatName: "",
  });

  const { data: user } = useMe();
  const isAuth = isAuthenticated();
  const logout = useLogout();

  const { data: apiTools } = useTools();
  const { data: apiMyLoans } = useMyLoans();
  const { data: apiMyFavorites } = useMyFavorites();
  const { data: apiAdminCategories } = useAdminCategories();
  const { data: apiAdminCareers } = useAdminCareers();
  const { data: apiRequests } = useAllRequests();

  const toastId = useRef(0);

  const update = useCallback((partial: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...partial }));
  }, []);

  useEffect(() => {
    const patch: Partial<AppState> = {};
    if (apiTools) patch.tools = apiTools.map(mapApiToolToTool) as Tool[];
    if (apiMyLoans) patch.loans = apiMyLoans.map(mapApiLoanToLoan) as Loan[];
    if (apiMyFavorites) patch.favorites = apiMyFavorites.map(t => t.id);
    if (apiAdminCategories) patch.categories = apiAdminCategories.map(c => c.name);
    if (apiAdminCareers) patch.careers = apiAdminCareers.map(mapApiCareerToCareer) as Career[];
    if (apiRequests) patch.adminReqs = apiRequests.map(mapApiRequestToAdminReq) as AdminReq[];
    if (Object.keys(patch).length > 0) update(patch);
  }, [apiTools, apiMyLoans, apiMyFavorites, apiAdminCategories, apiAdminCareers, apiRequests, update]);

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

  return (
    <AppContext.Provider value={{ state, update, toast, getTool, openToolDetail, openLoanForm, user, isAuth, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
