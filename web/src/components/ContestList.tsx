import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ContestList() {
  const [contests, setContests] = useState<any[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        // Fetch real data immediately
        const res = await fetch('/api/contests');
        const data = await res.json();
        if (mounted) setContests(data);
      } catch (e) {
        if (mounted) setError(true);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return <div className="text-red-500">Failed to load contests</div>;
  }

  // Skeleton loading state
  if (!contests) {
    return (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse
                       bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200
                       dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
                       rounded-xl shadow border border-gray-300 dark:border-gray-600
                       p-6 h-48"
          >
            <div className="h-6 w-1/2 mb-4 bg-white dark:bg-gray-900 rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-white dark:bg-gray-900 rounded" />
              <div className="h-4 w-5/6 bg-white dark:bg-gray-900 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Actual data
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {contests.map((c) => (
        <motion.div
          key={c.id}
          whileHover={{ scale: 1.03 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col"
        >
          <h3 className="text-lg font-semibold text-primary-dark dark:text-primary-light">
            {c.sport.toUpperCase()} – {c.type}
          </h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300 flex-grow">
            {c.description}
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-accent/90"
          >
            View &amp; Pick
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
}
