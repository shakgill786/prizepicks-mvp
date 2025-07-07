export async function getSports() {
    const res = await fetch('/api/sports');
    return res.json();
  }
  
  export async function getTemplates() {
    const res = await fetch('/api/templates');
    return res.json();
  }
  
  export async function getContests() {
    const res = await fetch('/api/contests');
    return res.json();
  }
  
  export async function createContest(data: {
    sportId: number;
    templateId: number;
    contestType: string;
    startAt: string;
    endAt: string;
  }) {
    const res = await fetch('/api/contests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  
  export async function submitPick(
    contestId: number,
    data: { userId: number; choice: string }
  ) {
    const res = await fetch(`/api/contests/${contestId}/picks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  
  export async function getLeaderboard(contestId: number) {
    const res = await fetch(`/api/contests/${contestId}/leaderboard`);
    return res.json();
  }
  