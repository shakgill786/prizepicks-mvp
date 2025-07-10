// web/src/App.tsx

import { HashRouter as Router, useLocation } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AnimatePresence } from 'framer-motion'

import Layout from './components/Layout'
import ContestList from './components/ContestList'
import AdminPage from './pages/AdminPage'
import ContestPage from './pages/ContestPage'
import MyPicksPage from './pages/MyPicksPage'
import NotFound from './components/NotFound'

const queryClient = new QueryClient()

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<ContestList />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/contests/:id" element={<ContestPage />} />
        <Route path="/profile" element={<MyPicksPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
