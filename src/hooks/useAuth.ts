import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { setToken, clearToken, getToken } from '../lib/auth'
import type {
  ApiUser,
  LoginInput,
  RegisterInput,
  AuthResponse,
  ChangePasswordInput,
  ForgotPasswordInput,
  VerifyCodeInput,
  ResetPasswordInput,
} from '../app/types'

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: LoginInput) => api.post<AuthResponse>('/auth/login', data),
    onSuccess: (res) => {
      setToken(res.token)
      qc.setQueryData(['auth', 'me'], res.user)
      qc.invalidateQueries()
    },
  })
}

export function useRegister() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RegisterInput) => api.post<AuthResponse>('/auth/register', data),
    onSuccess: (res) => {
      setToken(res.token)
      qc.setQueryData(['auth', 'me'], res.user)
      qc.invalidateQueries()
    },
  })
}

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get<ApiUser>('/auth/me'),
    enabled: !!getToken(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) =>
      api.put('/auth/password', data),
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordInput) =>
      api.post<{ message: string; code?: string }>('/auth/forgot-password', data),
  })
}

export function useVerifyCode() {
  return useMutation({
    mutationFn: (data: VerifyCodeInput) =>
      api.post<{ valid: boolean }>('/auth/verify-code', data),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordInput) =>
      api.post<{ message: string }>('/auth/reset-password', data),
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return () => {
    clearToken()
    qc.clear()
  }
}
