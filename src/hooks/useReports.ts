import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { getToken } from '../lib/auth'

export function useTopTools() {
  return useQuery({
    queryKey: ['reports', 'top-tools'],
    queryFn: () => api.get<{ name: string; count: number }[]>('/reports/top-tools'),
    staleTime: 60 * 1000,
    enabled: !!getToken(),
  })
}

export function useLoansByMonth() {
  return useQuery({
    queryKey: ['reports', 'loans-by-month'],
    queryFn: () => api.get<{ year: number; month: number; count: number }[]>('/reports/loans-by-month'),
    staleTime: 60 * 1000,
    enabled: !!getToken(),
  })
}

export function useDelays() {
  return useQuery({
    queryKey: ['reports', 'delays'],
    queryFn: () => api.get<{ totalOverdue: number; totalActive: number; rate: number }>('/reports/delays'),
    staleTime: 60 * 1000,
    enabled: !!getToken(),
  })
}

export function useActiveUsers() {
  return useQuery({
    queryKey: ['reports', 'active-users'],
    queryFn: () => api.get<{ name: string; loanCount: number }[]>('/reports/active-users'),
    staleTime: 60 * 1000,
    enabled: !!getToken(),
  })
}
