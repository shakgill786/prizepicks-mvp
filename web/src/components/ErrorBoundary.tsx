// web/src/components/ErrorBoundary.tsx
import React, { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // You could log this to an external service
    console.error('ErrorBoundary caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-4xl mx-auto p-4 text-red-600">
          <h2 className="text-xl font-bold">Oops—something went wrong.</h2>
          <p>
            An unexpected error occurred. Please refresh the page or contact support if
            the problem persists.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
