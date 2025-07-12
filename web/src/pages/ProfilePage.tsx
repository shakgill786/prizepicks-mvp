import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getMyPicks } from '../services/api'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [picks, setPicks] = useState<any[] | null>(null)

  useEffect(() => {
    if (user) {
      getMyPicks(user.id).then(setPicks).catch(console.error)
    }
  }, [user])

  if (!user) return <p>Loading…</p>

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <img
          src={user.avatarUrl || '/default-avatar.png'}
          alt="avatar"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.displayName}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="ml-auto px-3 py-1 bg-red-500 text-white rounded"
        >
          Log out
        </button>
      </div>

      <section>
        <h3 className="text-xl font-semibold mb-2">My Picks</h3>
        {picks == null ? (
          <p>Loading…</p>
        ) : (
          <ul className="space-y-4">
            {picks.map(p => (
              <li key={p.id} className="border p-4 rounded">
                <div>
                  <strong>{p.sport.toUpperCase()}</strong> — {p.description}
                </div>
                <div>
                  Your pick: <em>{p.choice.toUpperCase()}</em> @{' '}
                  {new Date(p.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
