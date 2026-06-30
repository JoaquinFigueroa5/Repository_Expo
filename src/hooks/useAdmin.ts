import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { getToken } from '../lib/auth'
import type { ApiUser, Career } from '../app/types'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get<{
      totalTools: number
      available: number
      inUse: number
      maintenance: number
      pendingReqs: number
      activeLoans: number
      totalUsers: number
    }>('/admin/stats'),
    staleTime: 30 * 1000,
    enabled: !!getToken(),
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => api.get<ApiUser[]>('/admin/users'),
    staleTime: 30 * 1000,
    enabled: !!getToken(),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => api.post('/admin/users', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/admin/users/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/admin/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useAdminCareers() {
  return useQuery({
    queryKey: ['admin', 'careers'],
    queryFn: () => api.get<Career[]>('/admin/careers'),
    staleTime: 60 * 1000,
    enabled: !!getToken(),
  })
}

export function useCreateCareer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; icon?: string; color?: string }) => api.post('/admin/careers', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'careers'] }),
  })
}

export function useUpdateCareer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/admin/careers/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'careers'] }),
  })
}

export function useDeleteCareer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/admin/careers/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'careers'] }),
  })
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => api.get<any[]>('/admin/categories'),
    staleTime: 60 * 1000,
    enabled: !!getToken(),
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; icon?: string; color?: string }) => api.post('/admin/categories', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/admin/categories/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/admin/categories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  })
}
