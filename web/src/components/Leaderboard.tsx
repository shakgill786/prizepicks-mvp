import useSWR from 'swr';
import { getLeaderboard } from '../services/api';

export default function Leaderboard({ contestId }: { contestId: number }) {
  const { data, error } = useSWR(
    `/api/contests/${contestId}/leaderboard`,
    () => getLeaderboard(contestId),
    { refreshInterval: 5000 }
  );

  if (error) return <div className="text-red-500">Error loading leaderboard</div>;

  // Skeleton loading state: 5 rows placeholder
  if (!data) {
    return (
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1 text-left">Pick ID</th>
            <th className="border px-2 py-1 text-left">Score</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="border px-2 py-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8" />
              </td>
              <td className="border px-2 py-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-6" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Actual data
  return (
    <table className="min-w-full border border-gray-300 dark:border-gray-700">
      <thead>
        <tr className="bg-gray-100 dark:bg-gray-800">
          <th className="border px-2 py-1 text-left">Pick ID</th>
          <th className="border px-2 py-1 text-left">Score</th>
        </tr>
      </thead>
      <tbody>
        {data.map((p: any) => (
          <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
            <td className="border px-2 py-1">{p.id}</td>
            <td className="border px-2 py-1">
              {p.score == null ? 'Pending' : p.score}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
