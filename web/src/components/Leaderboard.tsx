import useSWR from 'swr';
import { getLeaderboard } from '../services/api';

export default function Leaderboard({ contestId }: { contestId: number }) {
  const { data, error } = useSWR(
    `/api/contests/${contestId}/leaderboard`,
    () => getLeaderboard(contestId),
    { refreshInterval: 5000 }
  );

  if (error) return <div>Error loading leaderboard</div>;
  if (!data) return <div>Loading leaderboard...</div>;

  return (
    <table className="min-w-full border">
      <thead>
        <tr>
          <th className="border px-2">Pick ID</th>
          <th className="border px-2">Score</th>
        </tr>
      </thead>
      <tbody>
        {data.map((p: any) => (
          <tr key={p.id}>
            <td className="border px-2">{p.id}</td>
            <td className="border px-2">
              {p.score == null ? 'Pending' : p.score}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
