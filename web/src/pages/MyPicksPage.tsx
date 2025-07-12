// web/src/pages/MyPicksPage.tsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getMyPicks } from '../services/api'

interface Pick {
  id: number
  contestId: number
  choice: string
  createdAt: string
  sport: string
  type: string
  description: string
}

export default function MyPicksPage() {
  const { user } = useAuth()                    // <-- get the logged-in user
  const [picks, setPicks] = useState<Pick[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!user) return                          // don’t fire until we have a user
    let mounted = true
    console.log(`📣 MyPicksPage: fetching picks for user ${user.id}`)

    getMyPicks(user.id)                         // <-- use user.id, not 1
      .then((data) => {
        console.log('📣 MyPicksPage fetched:', data)
        if (mounted) setPicks(data)
      })
      .catch((e) => {
        console.error('⚠️ MyPicksPage error:', e)
        if (mounted) setError(true)
      })

    return () => {
      mounted = false
    }
  }, [user])

  if (!user) {
    return <div>Loading user…</div>
  }
  if (error) {
    return <div className="text-red-500">Failed to load your picks</div>
  }
  if (picks === null) {
    return <div>Loading your picks…</div>
  }
  if (picks.length === 0) {
    return <div className="text-gray-500">You haven’t made any picks yet.</div>
  }

  return (
    <section aria-labelledby="mypicks-heading">
      <h2 id="mypicks-heading" className="text-2xl font-bold mb-4">
        My Picks
      </h2>
      <ul className="space-y-4">
        {picks.map((p) => (
          <li
            key={p.id}
            className="border rounded-lg bg-white dark:bg-gray-800 p-4 shadow"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">
                {p.sport.toUpperCase()} – {p.type}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(p.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {p.description}
            </p>
            <p className="mt-1">
              Your pick:{' '}
              <strong className="text-primary-dark dark:text-primary-light">
                {p.choice.toUpperCase()}
              </strong>
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
