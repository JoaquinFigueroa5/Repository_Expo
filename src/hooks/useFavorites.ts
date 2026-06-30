import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { getToken } from '../lib/auth'
import type { ApiTool } from '../app/types'

export function useMyFavorites() {
  return useQuery({
    queryKey: ['favorites', 'mine'],
    queryFn: () => api.get<ApiTool[]>('/user/favorites'),
    staleTime: 30 * 1000,
    enabled: !!getToken(),
  })
}

export function useAddFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (toolId: number) => api.post(`/user/favorites/${toolId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  })
}

export function useRemoveFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (toolId: number) => api.delete(`/user/favorites/${toolId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  })
}
