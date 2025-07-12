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
  setUser: (user: User | null) => void
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const navigate = useNavigate()

  // hydrate from localStorage once on mount
  useEffect(() => {
    const saved = localStorage.getItem('auth')
    if (saved) {
      const parsed = JSON.parse(saved)
      setToken(parsed.token)
      setUser(parsed.user)
    }
  }, [])

  // persist changes to user/token, but never wipe out on mount
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
