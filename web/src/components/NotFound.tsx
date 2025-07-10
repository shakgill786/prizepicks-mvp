import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold mb-2">404</h1>
      <p className="mb-6 text-lg">Sorry, that page doesn’t exist.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2"
      >
        Go Home
      </Link>
    </div>
  )
}
