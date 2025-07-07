import { useParams } from 'react-router-dom';
import PickForm from '../components/PickForm';
import Leaderboard from '../components/Leaderboard';

export default function ContestPage() {
  const { id } = useParams<{ id: string }>();
  const contestId = Number(id);
  const userId = 1; // hard-coded for MVP

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Contest #{contestId}</h1>
      <PickForm contestId={contestId} userId={userId} />
      <Leaderboard contestId={contestId} />
    </div>
  );
}
