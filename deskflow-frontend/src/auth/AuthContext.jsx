import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

const STORAGE_KEY = 'deskflow.user'
const TOKEN_KEY = 'deskflow.token'

// Demo identities matching the accounts seeded on the backend
// (src/utils/seed.js). Used to drive the login toggle without
// exposing a manual email/password form, per the UI spec.
export const DEMO_ACCOUNTS = {
  Employee: { email: 'employee@deskflow.io', password: 'password123' },
  Admin: { email: 'admin@deskflow.io', password: 'password123' },
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [user])

  async function login(role) {
    const creds = DEMO_ACCOUNTS[role]
    if (!creds) throw new Error(`Unknown role: ${role}`)

    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/api/auth/login', creds)
      localStorage.setItem(TOKEN_KEY, data.token)
      setUser(data.user)
      return data.user
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setUser(null)
  }

  const value = { user, login, logout, isAuthenticated: Boolean(user), error, loading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export { AuthProvider, useAuth }