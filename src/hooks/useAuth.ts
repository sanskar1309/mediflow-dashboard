import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'
import { notificationService } from '@/services/notificationService'

export function useAuthInit() {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    notificationService.register()
    const unsubscribe = authService.onAuthChange((user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [setUser, setLoading])
}

export function useAuth() {
  const { user, loading, error } = useAuthStore()
  return { user, loading, error, isAuthenticated: !!user }
}
