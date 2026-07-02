export class ApiError extends Error {
  public code: string
  public details?: unknown

  constructor(error: { code: string; message: string; details?: unknown }) {
    super(error.message)
    this.code = error.code
    this.details = error.details
  }
}

interface ApiResponse<T> {
  success: true
  data: T
  meta?: { total: number; page: number; limit: number }
}

interface ApiErrorResponse {
  success: false
  error: { code: string; message: string; details?: unknown }
}

type Response<T> = ApiResponse<T> | ApiErrorResponse

class ApiClient {
  private base: string
  private tokenKey = 'rema_token'
  public onUnauthorized?: () => void

  constructor() {
    this.base = import.meta.env.VITE_API_URL || 'https://rema-lilac.vercel.app/'
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  setToken(token: string | null) {
    if (token) localStorage.setItem(this.tokenKey, token)
    else localStorage.removeItem(this.tokenKey)
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey)
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string | undefined>
  ): Promise<T> {
    const url = new URL(`${this.base}${path}`)
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') url.searchParams.set(k, v)
      })
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    const token = this.getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (res.status === 204) return undefined as T

    const json: Response<T> = await res.json()

    if (!json.success) {
      if (json.error.code === 'UNAUTHORIZED') {
        this.clearToken()
        this.onUnauthorized?.()
      }
      throw new ApiError(json.error)
    }

    return json.data
  }

  get<T>(path: string, params?: Record<string, string | undefined>) {
    return this.request<T>('GET', path, undefined, params)
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>('POST', path, body)
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>('PUT', path, body)
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>('PATCH', path, body)
  }

  delete(path: string) {
    return this.request<void>('DELETE', path)
  }
}

export const api = new ApiClient()
