import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { getToken } from '../lib/auth'
import type { ApiRequest } from '../app/types'

export function useMyRequests(params?: { status?: string }) {
  return useQuery({
    queryKey: ['requests', 'mine', params],
    queryFn: () => api.get<ApiRequest[]>('/user/requests', params as Record<string, string | undefined>),
    staleTime: 30 * 1000,
    enabled: !!getToken(),
  })
}

export function useAllRequests(params?: { status?: string }) {
  return useQuery({
    queryKey: ['requests', 'all', params],
    queryFn: () => api.get<ApiRequest[]>('/requests', params as Record<string, string | undefined>),
    staleTime: 15 * 1000,
    enabled: !!getToken(),
  })
}

export function useCreateRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      toolId: number
      qty: number
      startDate: string
      endDate: string
      notes?: string
    }) => api.post<ApiRequest>('/requests', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requests'] })
      qc.invalidateQueries({ queryKey: ['tools'] })
    },
  })
}

export function useApproveRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.patch(`/requests/${id}/approve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requests'] })
      qc.invalidateQueries({ queryKey: ['loans'] })
      qc.invalidateQueries({ queryKey: ['tools'] })
    },
  })
}

export function useRejectRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, comment }: { id: number; comment?: string }) =>
      api.patch(`/requests/${id}/reject`, { comment }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requests'] })
      qc.invalidateQueries({ queryKey: ['tools'] })
    },
  })
}
