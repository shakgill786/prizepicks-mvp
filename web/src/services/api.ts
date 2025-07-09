// web/src/services/api.ts
const API_BASE = 'http://localhost:4000';

async function handleRes(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export function getSports() {
  return fetch(`${API_BASE}/api/sports`).then(handleRes);
}

export function getTemplates() {
  return fetch(`${API_BASE}/api/templates`).then(handleRes);
}

export function getContests() {
  return fetch(`${API_BASE}/api/contests`).then(handleRes);
}

export function createContest(data: {
  sportId: number;
  templateId: number;
  contestType: string;
  startAt: string;
  endAt: string;
}) {
  return fetch(`${API_BASE}/api/contests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleRes);
}

export function submitPick(
  contestId: number,
  payload: { userId: number; choice: string }
) {
  return fetch(`${API_BASE}/api/contests/${contestId}/picks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(handleRes);
}

export function getLeaderboard(contestId: number) {
  return fetch(`${API_BASE}/api/contests/${contestId}/leaderboard`).then(
    handleRes
  );
}

export async function getMyPicks(userId: number) {
  const res = await fetch(`http://localhost:4000/api/users/${userId}/picks`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}