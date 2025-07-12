// web/src/main.tsx

import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { AuthProvider } from './contexts/AuthContext'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* Only one Router at the very top */}
      <BrowserRouter>
        {/* AuthProvider can safely use useNavigate() here */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>

      {/* React Query DevTools: placed outside Auth/Router so they never interfere */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
