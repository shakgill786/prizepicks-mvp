// web/src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getMyPicks, updateProfile } from '../services/api'

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth()
  const [picks, setPicks] = useState<any[] | null>(null)
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (!user) return
    // initialize form fields
    setDisplayName(user.displayName || '')
    setAvatarUrl(user.avatarUrl || '')
    // load picks
    getMyPicks(user.id).then(setPicks).catch(console.error)
  }, [user])

  if (!user) {
    return <p>Loading profile…</p>
  }

  const save = async () => {
    try {
      const updated = await updateProfile(user.id, { displayName, avatarUrl })
      setUser(updated)
      setEditing(false)
    } catch (err) {
      console.error('Failed to update profile', err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <img
          src={avatarUrl || '/default-avatar.png'}
          alt="avatar"
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1">
          {editing ? (
            <>
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Avatar URL"
                className="border p-1 rounded w-full mb-2"
              />
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                className="border p-1 rounded w-full"
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">{user.displayName}</h2>
              <button
                onClick={() => setEditing(true)}
                className="mt-1 text-sm text-blue-600"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
        <button
          onClick={logout}
          className="ml-auto px-3 py-1 bg-red-500 text-white rounded"
        >
          Log Out
        </button>
      </div>

      {editing && (
        <div className="flex space-x-2">
          <button
            onClick={save}
            className="px-4 py-1 bg-green-500 text-white rounded"
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditing(false)
              setDisplayName(user.displayName || '')
              setAvatarUrl(user.avatarUrl || '')
            }}
            className="px-4 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      )}

      <section>
        <h3 className="text-xl font-semibold mb-2">My Picks</h3>
        {picks == null ? (
          <p>Loading picks…</p>
        ) : picks.length === 0 ? (
          <p className="text-gray-500">You haven’t made any picks yet.</p>
        ) : (
          <ul className="space-y-4">
            {picks.map((p) => (
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
