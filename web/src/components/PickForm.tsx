import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { submitPick } from '../services/api';

export default function PickForm({
  contestId,
  userId,
}: {
  contestId: number;
  userId: number;
}) {
  const [choice, setChoice] = useState<'over' | 'under'>('over');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await submitPick(contestId, { userId, choice });
    alert('Pick submitted!');
  }

  return (
    <form onSubmit={handleSubmit} className="space-x-2">
      <select
        value={choice}
        onChange={(e) => setChoice(e.target.value as 'over' | 'under')}
      >
        <option value="over">Over</option>
        <option value="under">Under</option>
      </select>
      <button
        type="submit"
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        Submit Pick
      </button>
    </form>
  );
}
