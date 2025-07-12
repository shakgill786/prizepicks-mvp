import React, { type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import ContestList from './components/ContestList'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProfilePage from './pages/ProfilePage'
import ContestPage from './pages/ContestPage'
import AdminPage from './pages/AdminPage'
import MyPicksPage from './pages/MyPicksPage'
import NotFound from './components/NotFound'
import { useAuth } from './contexts/AuthContext'

interface ProtectedProps {
  children: ReactNode
}
function Protected({ children }: ProtectedProps) {
  const { user } = useAuth()
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  const location = useLocation()

  return (
    <Layout>
      <Routes location={location} key={location.pathname}>
        {/* public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* private */}
        <Route
          path="/"
          element={
            <Protected>
              <ContestList />
            </Protected>
          }
        />
        <Route
          path="/contests/:id"
          element={
            <Protected>
              <ContestPage />
            </Protected>
          }
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <ProfilePage />
            </Protected>
          }
        />
        <Route
          path="/admin"
          element={
            <Protected>
              <AdminPage />
            </Protected>
          }
        />
        <Route
          path="/mypicks"
          element={
            <Protected>
              <MyPicksPage />
            </Protected>
          }
        />
        {/* catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

// wrap this in BrowserRouter in your entry-point (main.tsx):
// createRoot(...).render(
//   <BrowserRouter>
//     <App/>
//   </BrowserRouter>
// )
