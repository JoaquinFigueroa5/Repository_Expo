import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { ApiUser } from '../app/types'

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Pick<ApiUser, 'name' | 'phone' | 'photo'>>) =>
      api.put<ApiUser>('/user/profile', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['auth', 'me'] }),
  })
}
