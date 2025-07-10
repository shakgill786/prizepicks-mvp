import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'

export default function LandingPage() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-primary-light to-primary-dark text-white px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
        Build your winning streak
      </h1>
      <p className="max-w-xl text-center mb-8">
        Pick player props in NBA, NFL, MLB &amp; WNBA — compete with friends &amp; earn bragging rights.
      </p>
      <div className="space-x-4">
        <Link to="/">
          <Button className="bg-accent text-white hover:bg-accent/90">Get Started</Button>
        </Link>
        <Link to="/admin">
          <Button className="bg-primary text-white hover:bg-primary-dark">Admin Console</Button>
        </Link>
      </div>
      <footer className="mt-auto py-6 text-sm opacity-80">
        © {new Date().getFullYear()} PrizePicks MVP
      </footer>
    </section>
  )
}
