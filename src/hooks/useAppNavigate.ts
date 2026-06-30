import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ViewType } from '../app/types'

const viewToPath: Record<ViewType, string> = {
  landing: '/',
  login: '/login',
  register: '/register',
  forgot: '/forgot-password',
  verify: '/verify-code',
  catalog: '/catalog',
  account: '/account',
  admin: '/admin',
}

const pathToView: Record<string, ViewType> = {
  '/': 'landing',
  '/login': 'login',
  '/register': 'register',
  '/forgot-password': 'forgot',
  '/verify-code': 'verify',
  '/catalog': 'catalog',
  '/account': 'account',
  '/admin': 'admin',
}

export function useAppNavigate() {
  const navigate = useNavigate()

  const goTo = useCallback(
    (view: ViewType) => {
      const path = viewToPath[view]
      navigate(path)
    },
    [navigate]
  )

  const pathToViewType = useCallback((path: string): ViewType => {
    return pathToView[path] || 'landing'
  }, [])

  return { goTo, pathToViewType }
}
