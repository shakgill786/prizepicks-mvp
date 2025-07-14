// web/src/contexts/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'

export interface User {
  id: number
  email: string
  displayName?: string
  avatarUrl?: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  setUser: (u: User | null) => void
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // on mount: load saved token, re-validate /api/auth/me
  useEffect(() => {
    const saved = localStorage.getItem('auth')
    if (!saved) {
      setLoading(false)
      return
    }
    const { token: t } = JSON.parse(saved) as { token: string; user: User }
    setToken(t)

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error('Session expired')
        return r.json() as Promise<User>
      })
      .then((u) => {
        setUser(u)
        localStorage.setItem('auth', JSON.stringify({ token: t, user: u }))
      })
      .catch(() => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('auth')
      })
      .finally(() => setLoading(false))
  }, [])

  // persist on user/token change
  useEffect(() => {
    if (token && user) {
      localStorage.setItem('auth', JSON.stringify({ token, user }))
    }
  }, [token, user])

  async function login(email: string, password: string) {
    const resp = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!resp.ok) throw new Error(await resp.text())
    const { token: t, user: u } = await resp.json()
    setToken(t)
    setUser(u)
    navigate('/')
  }

  async function signup(
    email: string,
    password: string,
    displayName: string
  ) {
    const resp = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    })
    if (!resp.ok) throw new Error(await resp.text())
    const { token: t, user: u } = await resp.json()
    setToken(t)
    setUser(u)
    navigate('/')
  }

  function logout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth')
    navigate('/login')
  }

  if (loading) {
    // or a spinner
    return <div>Loading session…</div>
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, token, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
