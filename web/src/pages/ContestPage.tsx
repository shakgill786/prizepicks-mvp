import React from 'react';
import { useParams } from 'react-router-dom';
import PickForm from '../components/PickForm';
import Leaderboard from '../components/Leaderboard';

export default function ContestPage() {
  const { id } = useParams<{ id: string }>();
  const contestId = Number(id);
  const userId = 1; // placeholder for MVP

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Contest #{contestId}</h1>

      <section aria-labelledby="pick-form-heading" className="space-y-4">
        <h2 id="pick-form-heading" className="text-xl font-semibold">
          Make Your Pick
        </h2>
        <PickForm contestId={contestId} userId={userId} />
      </section>

      <section aria-labelledby="leaderboard-heading" className="space-y-4">
        <h2 id="leaderboard-heading" className="text-xl font-semibold">
          Leaderboard
        </h2>
        <Leaderboard contestId={contestId} />
      </section>
    </div>
  );
}
