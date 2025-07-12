import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-4 p-6 bg-white dark:bg-gray-800 rounded"
    >
      <h2 className="text-2xl font-bold">Log In</h2>
      {error && <div className="text-red-500">{error}</div>}

      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Password</label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded">
        Log In
      </button>

      <p className="text-center text-sm text-gray-500">
        Don’t have an account?{' '}
        <Link to="/signup" className="text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  )
}
