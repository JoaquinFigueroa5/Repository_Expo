export type ToolStatus = "available" | "in_use" | "maintenance" | "reserved";
export type LoanStatus = "active" | "returned" | "overdue";

export interface Tool {
  id: number; name: string; cat: string; code: string; desc: string;
  brand: string; location: string; totalQty: number; available: number;
  status: ToolStatus; image: string; maxDays: number;
  specs: { k: string; v: string }[]; careers: string[]; minRole?: string;
}

export interface Loan {
  id: number; toolId: number; qty: number;
  loanDate: string; dueDate: string; returnDate: string | null; status: LoanStatus;
}

export interface CartItem {
  toolId: number;
  tool: Tool;
  qty: number;
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

export type VerifyMode = "register" | "reset";

export interface LoanForm {
  qty: number; startDate: string; endDate: string; notes: string;
}

export interface ToastItem {
  id: number; msg: string; icon: string; type: "success" | "error" | "info";
}

export interface NewCareerForm {
  name: string; icon: string; color: string;
}

// ─── Tipos API (backend) ──────────────────────────────────────────

export type ApiToolStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RESERVED'
export type ApiLoanStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE'
export type ApiRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type ApiUserRole = 'STUDENT' | 'TEACHER' | 'COORDINATOR' | 'ADMIN'
export type ApiNotificationType = 'ALERT' | 'REMINDER' | 'INFO'

export interface ApiUser {
  id: number
  name: string
  email: string
  carnet: string | null
  phone: string | null
  photo: string | null
  career: string
  workshop: string | null
  role: ApiUserRole
  createdAt: string
  updatedAt: string
}

export interface ApiTool {
  id: number
  name: string
  cat: string
  code: string
  desc: string | null
  brand: string | null
  location: string
  totalQty: number
  available: number
  status: ApiToolStatus
  image: string | null
  maxDays: number
  specs: Record<string, string> | null
  careers: string[]
  minRole?: string
  categoryId: number | null
  category: Career | null
  createdAt: string
  updatedAt: string
}

export interface ApiLoan {
  id: number
  requestId: number | null
  userId: number
  toolId: number
  qty: number
  loanDate: string
  dueDate: string
  returnDate: string | null
  status: ApiLoanStatus
  createdAt: string
  updatedAt: string
  user?: { id: number; name: string; email: string; career: string }
  tool?: { id: number; name: string; code: string; image: string | null }
}

export interface ApiRequestItem {
  id: number
  requestId: number
  toolId: number
  qty: number
  startDate: string
  dueDate: string
  tool: { id: number; name: string; code: string; image: string | null }
}

export interface ApiRequestReview {
  id: number
  requestId: number
  coordinatorId: number
  action: ApiRequestStatus
  comment: string | null
  reviewedAt: string
  coordinator: { id: number; name: string }
}

export interface ApiRequest {
  id: number
  userId: number
  status: ApiRequestStatus
  reqDate: string
  notes: string | null
  createdAt: string
  updatedAt: string
  user: { id: number; name: string; email: string; career: string }
  items: ApiRequestItem[]
  review: ApiRequestReview | null
  loan: ApiLoan | null
}

export interface ApiNotification {
  id: number
  userId: number
  title: string
  message: string
  type: ApiNotificationType
  read: boolean
  link: string | null
  createdAt: string
}

export interface ApiMovement {
  id: number
  loanId: number | null
  userId: number | null
  toolId: number
  type: string
  description: string | null
  createdAt: string
  user?: { id: number; name: string }
}

// ─── Auth ────────────────────────────────────────────────────────

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  career: string
}

export interface AuthResponse {
  token: string
  user: ApiUser
  code?: string
}

export interface ForgotPasswordInput {
  email: string
}

export interface VerifyCodeInput {
  email: string
  code: string
}

export interface ResetPasswordInput {
  email: string
  code: string
  newPassword: string
}

export interface ChangePasswordInput {
  oldPassword: string
  newPassword: string
}

export interface UpdateProfileInput {
  name?: string
  phone?: string
  carnet?: string
}

// ─── Admin extras ─────────────────────────────────────────────────

export interface ApiCareer {
  id: number
  name: string
  color?: string
  icon?: string
}

export interface ApiCategory {
  id: number
  name: string
  icon?: string
  color?: string
}

// ─── Reports ──────────────────────────────────────────────────────

export interface DashboardStats {
  totalTools: number
  available: number
  inUse: number
  maintenance: number
  pendingReqs: number
  activeLoans: number
  totalUsers: number
}

export interface TopTool {
  name: string
  count: number
}

export interface LoanByMonth {
  year: number
  month: number
  count: number
}

export interface Delays {
  totalOverdue: number
  totalActive: number
  rate: number
}

export interface ActiveUser {
  name: string
  loanCount: number
}

// ─── Admin CRUD ───────────────────────────────────────────────────

export interface CreateToolInput {
  name: string
  cat: string
  code: string
  desc?: string
  brand?: string
  location: string
  totalQty: number
  available?: number
  image?: string
  maxDays?: number
  specs?: Record<string, string>
  careers: string[]
  minRole?: string
  categoryId?: number
}

export interface CareerForm {
  name: string
  color?: string
  icon?: string
}

export interface CategoryForm {
  name: string
  icon?: string
  color?: string
}

export interface WorkshopForm {
  name: string
  description?: string
  location?: string
}
