// web/src/ContestList.tsx
console.log('🔥 ContestList.tsx is running');

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Contest {
  id: number;
  sport: string;
  type: string;
  description: string;
}

export default function ContestList() {
  const [contests, setContests] = useState<Contest[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/api/contests')
      .then((r) => r.json())
      .then((data: Contest[]) => {
        if (mounted) setContests(data);
      })
      .catch(() => mounted && setError(true));
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return <div className="text-red-500">Failed to load contests</div>;
  }
  if (!contests) {
    return <div>Loading…</div>;
  }

  return (
    <section aria-labelledby="contests-heading">
      <h2 id="contests-heading" className="sr-only">
        Available Contests
      </h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((c) => (
          <Link
            key={c.id}
            to={`/contests/${c.id}`}
            className="
              block cursor-pointer
              bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg
              focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2
              transition p-6 flex flex-col no-underline
            "
          >
            <h3 className="text-lg font-semibold text-primary-dark dark:text-primary-light">
              {c.sport.toUpperCase()} – {c.type}
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300 flex-grow">
              {c.description}
            </p>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="
                mt-4 px-4 py-2 bg-accent text-white rounded text-center
                hover:bg-accent/90
              "
            >
              View &amp; Pick
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
