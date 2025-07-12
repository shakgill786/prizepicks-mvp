import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getContests } from '../services/api'

export interface Contest {
  id: number
  sport: string
  type: string
  description: string
}

export default function ContestList() {
  const navigate = useNavigate()

  const {
    data: contests = [],
    status,
    error,
  } = useQuery<Contest[], Error>({
    // required shape:
    queryKey: ['contests'],
    queryFn: getContests,
  })

  if (status === 'loading') {
    return <div>Loading contests…</div>
  }

  if (status === 'error') {
    return <div className="text-red-500">Error loading contests: {error?.message}</div>
  }

  return (
    <section aria-labelledby="contests-heading">
      <h2 id="contests-heading" className="sr-only">
        Available Contests
      </h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((c: Contest) => (
          <motion.div
            key={c.id}
            role="link"
            tabIndex={0}
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate(`/contests/${c.id}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(`/contests/${c.id}`)
              }
            }}
            className="
              cursor-pointer
              bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg
              focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2
              transition p-6 flex flex-col
            "
          >
            <h3 className="text-lg font-semibold text-primary-dark dark:text-primary-light">
              {c.sport.toUpperCase()} – {c.type}
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300 flex-grow">
              {c.description}
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/contests/${c.id}`)
              }}
              className="
                mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-accent/90
                focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2
              "
              aria-label={`Go to contest ${c.id}`}
            >
              View &amp; Pick
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
