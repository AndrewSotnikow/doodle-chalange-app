import { Component, type ErrorInfo, type PropsWithChildren } from 'react'
import { Button } from './Button'

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info.componentStack)
  }

  private handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary" role="alert">
          <div>
            <p className="error-boundary__title">Something went wrong</p>
            <p className="error-boundary__copy">
              An unexpected error prevented the app from rendering.
            </p>
          </div>
          <Button variant="inline" onClick={this.handleReset} type="button">
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
