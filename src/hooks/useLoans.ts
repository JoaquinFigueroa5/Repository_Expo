import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { ApiLoan } from '../app/types'

export function useMyLoans(params?: { status?: string }) {
  return useQuery({
    queryKey: ['loans', 'mine', params],
    queryFn: () => api.get<ApiLoan[]>('/user/loans', params as Record<string, string | undefined>),
    staleTime: 30 * 1000,
  })
}

export function useAllLoans(params?: { status?: string; overdue?: string }) {
  return useQuery({
    queryKey: ['loans', 'all', params],
    queryFn: () => api.get<ApiLoan[]>('/loans', params as Record<string, string | undefined>),
    staleTime: 15 * 1000,
  })
}

export function useReturnLoan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, returnDate }: { id: number; returnDate: string }) =>
      api.patch(`/loans/${id}/return`, { returnDate }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['loans'] })
      qc.invalidateQueries({ queryKey: ['tools'] })
    },
  })
}
