import { api } from './api'

export function getToken(): string | null {
  return localStorage.getItem('rema_token')
}

export function setToken(token: string) {
  localStorage.setItem('rema_token', token)
  api.setToken(token)
}

export function clearToken() {
  localStorage.removeItem('rema_token')
  api.clearToken()
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

interface JwtPayload {
  userId: number
  role: string
  exp: number
  iat: number
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function getUserId(): number | null {
  const token = getToken()
  if (!token) return null
  const payload = decodeToken(token)
  return payload?.userId ?? null
}

export function getUserRole(): string | null {
  const token = getToken()
  if (!token) return null
  const payload = decodeToken(token)
  return payload?.role ?? null
}
