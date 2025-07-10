import useSWR from 'swr';
import { motion } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ContestList() {
  const { data, error } = useSWR('/api/contests', fetcher);

  if (error) return <div className="text-red-500">Failed to load contests</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {data.map((c: any) => (
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
