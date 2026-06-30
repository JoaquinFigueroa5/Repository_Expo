import { useApp } from './AppContext'

export function useUser() {
  const { user } = useApp()
  if (!user) return { name: 'Usuario', career: '', carnet: '', email: '', phone: '', workshop: '' }
  return {
    name: user.name,
    career: user.career || '',
    carnet: user.carnet || '',
    email: user.email,
    phone: user.phone || '',
    workshop: user.workshop || '',
  }
}
