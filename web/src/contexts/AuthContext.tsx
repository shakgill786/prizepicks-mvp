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
  isAdmin: boolean        // ← added
}

interface AuthContextType {
  user: User | null
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

  // hydrate from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('auth')
    if (saved) {
      const { token, user } = JSON.parse(saved)
      setToken(token)
      setUser(user)
    }
  }, [])

  // persist on change
  useEffect(() => {
    if (token && user) {
      localStorage.setItem('auth', JSON.stringify({ token, user }))
    } else {
      localStorage.removeItem('auth')
    }
  }, [token, user])

  async function login(email: string, password: string) {
    const resp = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    if (!resp.ok) throw new Error(await resp.text())
    const { token, user } = await resp.json()
    setToken(token)
    setUser(user)
    navigate('/')
  }

  async function signup(
    email: string,
    password: string,
    displayName: string
  ) {
    const resp = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, displayName }),
    })
    if (!resp.ok) throw new Error(await resp.text())
    const { token, user } = await resp.json()
    setToken(token)
    setUser(user)
    navigate('/')
  }

  function logout() {
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
