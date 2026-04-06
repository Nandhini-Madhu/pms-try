import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth-context'
import { authService } from '../services/authService'

const USER_KEY = 'user'

export function AuthProvider({ children }) {
  const hasToken = Boolean(localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY)
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(hasToken)

  useEffect(() => {
    if (!hasToken) {
      return
    }

    authService
      .me()
      .then((data) => {
        const profile = data.user || data
        setUser(profile)
        localStorage.setItem(USER_KEY, JSON.stringify(profile))
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem(USER_KEY)
        setUser(null)
      })
        .finally(() => setLoading(false))
      }, [hasToken])

  const login = async (credentials) => {
    const data = await authService.login(credentials)
    const token = data.token
    const profile = data.user

    localStorage.setItem('token', token)
    localStorage.setItem(USER_KEY, JSON.stringify(profile))
    setUser(profile)
    return profile
  }

  const register = async (payload) => {
    const data = await authService.register(payload)
    if (data.token && data.user) {
      localStorage.setItem('token', data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      setUser(data.user)
    }
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
