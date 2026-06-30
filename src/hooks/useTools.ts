import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { getToken } from '../lib/auth'
import type { ApiTool } from '../app/types'

export function useTools(params?: { cat?: string; search?: string; status?: string }) {
  return useQuery({
    queryKey: ['tools', params],
    queryFn: () => api.get<ApiTool[]>('/tools', params as Record<string, string | undefined>),
    staleTime: 30 * 1000,
    enabled: !!getToken(),
  })
}

export function useTool(id: number) {
  return useQuery({
    queryKey: ['tools', id],
    queryFn: () => api.get<ApiTool>(`/tools/${id}`),
    enabled: id > 0 && !!getToken(),
  })
}

export function useCreateTool() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => api.post<ApiTool>('/tools', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tools'] }),
  })
}

export function useUpdateTool() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put<ApiTool>(`/tools/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tools'] }),
  })
}

export function useDeleteTool() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/tools/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tools'] }),
  })
}

export function useToolMovements(id: number) {
  return useQuery({
    queryKey: ['tools', id, 'movements'],
    queryFn: () => api.get<any[]>(`/tools/${id}/movements`),
    enabled: id > 0 && !!getToken(),
  })
}
