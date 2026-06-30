import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import type { Tool, Loan, ViewType, VerifyMode, LoanForm, ToastItem, NewCareerForm, AdminReq, Career, ApiUser, CartItem } from "../types";
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
  cart: CartItem[];
  cartModalOpen: boolean;
}

interface AppContextValue {
  state: AppState;
  update: (partial: Partial<AppState>) => void;
  toast: (msg: string, icon?: string, type?: "success" | "error" | "info") => void;
  getTool: (id: number) => Tool | undefined;
  openToolDetail: (t: Tool) => void;
  openLoanForm: (t: Tool) => void;
  addToCart: (tool: Tool) => void;
  removeFromCart: (toolId: number) => void;
  updateCartItem: (toolId: number, patch: Partial<CartItem>) => void;
  clearCart: () => void;
  user: ApiUser | undefined;
  isAuth: boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem('rema_cart')
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

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
    cart: loadCart(),
    cartModalOpen: false,
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
    localStorage.setItem('rema_cart', JSON.stringify(state.cart))
  }, [state.cart])

  const cartRef = useRef(state.cart)
  useEffect(() => {
    const patch: Partial<AppState> = {};
    if (apiTools) {
      const tools = apiTools.map(mapApiToolToTool) as Tool[]
      patch.tools = tools
      const toolMap = new Map(tools.map(t => [t.id, t]))
      const refreshed = cartRef.current.map(c => {
        const fresh = toolMap.get(c.toolId)
        return fresh ? { ...c, tool: fresh } : c
      })
      patch.cart = refreshed
    }
    if (apiMyLoans) patch.loans = apiMyLoans.map(mapApiLoanToLoan) as Loan[];
    if (apiMyFavorites) patch.favorites = apiMyFavorites.map(t => t.id);
    if (apiAdminCategories) patch.categories = apiAdminCategories.map(c => c.name);
    if (apiAdminCareers) patch.careers = apiAdminCareers.map(mapApiCareerToCareer) as Career[];
    if (apiRequests) patch.adminReqs = apiRequests.map(mapApiRequestToAdminReq) as AdminReq[];
    if (Object.keys(patch).length > 0) update(patch);
  }, [apiTools, apiMyLoans, apiMyFavorites, apiAdminCategories, apiAdminCareers, apiRequests, update]);

  useEffect(() => { cartRef.current = state.cart }, [state.cart])

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

  const addToCart: AppContextValue["addToCart"] = (tool: Tool) => {
    setState(prev => {
      const existing = prev.cart.find(c => c.toolId === tool.id);
      if (existing) {
        return { ...prev, cart: prev.cart.map(c => c.toolId === tool.id ? { ...c, qty: Math.min(c.qty + 1, tool.available) } : c) };
      }
      return { ...prev, cart: [...prev.cart, { toolId: tool.id, tool, qty: 1 }] };
    });
  };

  const removeFromCart: AppContextValue["removeFromCart"] = (toolId: number) => {
    setState(prev => ({ ...prev, cart: prev.cart.filter(c => c.toolId !== toolId) }));
  };

  const updateCartItem: AppContextValue["updateCartItem"] = (toolId: number, patch: Partial<CartItem>) => {
    setState(prev => ({ ...prev, cart: prev.cart.map(c => c.toolId === toolId ? { ...c, ...patch } : c) }));
  };

  const clearCart: AppContextValue["clearCart"] = () => {
    localStorage.removeItem('rema_cart')
    setState(prev => ({ ...prev, cart: [] }));
  };

  return (
    <AppContext.Provider value={{ state, update, toast, getTool, openToolDetail, openLoanForm, addToCart, removeFromCart, updateCartItem, clearCart, user, isAuth, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
