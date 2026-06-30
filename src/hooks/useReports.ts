import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export function useTopTools() {
  return useQuery({
    queryKey: ['reports', 'top-tools'],
    queryFn: () => api.get<{ name: string; count: number }[]>('/reports/top-tools'),
    staleTime: 60 * 1000,
  })
}

export function useLoansByMonth() {
  return useQuery({
    queryKey: ['reports', 'loans-by-month'],
    queryFn: () => api.get<{ year: number; month: number; count: number }[]>('/reports/loans-by-month'),
    staleTime: 60 * 1000,
  })
}

export function useDelays() {
  return useQuery({
    queryKey: ['reports', 'delays'],
    queryFn: () => api.get<{ totalOverdue: number; totalActive: number; rate: number }>('/reports/delays'),
    staleTime: 60 * 1000,
  })
}

export function useActiveUsers() {
  return useQuery({
    queryKey: ['reports', 'active-users'],
    queryFn: () => api.get<{ name: string; loanCount: number }[]>('/reports/active-users'),
    staleTime: 60 * 1000,
  })
}
