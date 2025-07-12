const API_BASE = 'http://localhost:4000'

interface AuthStorage {
  token: string
  user: any
}

function getAuthHeaders(): Record<string,string> {
  const raw = localStorage.getItem('auth')
  if (!raw) {
    throw new Error('Not authenticated')
  }
  const { token }: AuthStorage = JSON.parse(raw)
  return { Authorization: `Bearer ${token}` }
}

async function handleRes(res: Response) {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}

export function getSports() {
  return fetch(`${API_BASE}/api/sports`).then(handleRes)
}

export function getTemplates() {
  return fetch(`${API_BASE}/api/templates`).then(handleRes)
}

export function getContests() {
  return fetch(`${API_BASE}/api/contests`).then(handleRes)
}

export function createContest(data: {
  sportId: number
  templateId: number
  contestType: string
  startAt: string
  endAt: string
}) {
  return fetch(`${API_BASE}/api/contests`, {
    method: 'POST',
    credentials: 'include',               // ← send cookies
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),                // ← send token header too, if you use one
    },
    body: JSON.stringify(data),
  }).then(handleRes)
}

export function submitPick(
  contestId: number,
  payload: { choice: string }
) {
  return fetch(`${API_BASE}/api/contests/${contestId}/picks`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  }).then(handleRes)
}

export function getLeaderboard(contestId: number) {
  return fetch(`${API_BASE}/api/contests/${contestId}/leaderboard`).then(
    handleRes
  )
}

export function getMyPicks(userId: number) {
  return fetch(`${API_BASE}/api/users/${userId}/picks`, {
    credentials: 'include',               // ← **this** forces your auth cookie to go too
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),                // ← and still send the Bearer header if you’ve got it
    },
  }).then(handleRes)
}

export function updateProfile(
  userId: number,
  data: { displayName?: string; avatarUrl?: string }
) {
  return fetch(`${API_BASE}/api/users/${userId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  }).then(handleRes)
}
