import { Component } from 'react'

// A crash in any screen otherwise unmounts the whole tree and leaves a white
// page — the worst possible failure during a live demo. This keeps the rest of
// the app alive and says what broke.
export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Screen crashed:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="space-y-4 text-center">
        <p className="text-lg font-extrabold text-navy">Something went wrong on this screen.</p>
        <p className="text-sm text-navy-lighter">
          The rest of the prototype is still running — go back and try again.
        </p>
        <pre className="overflow-x-auto rounded-xl bg-navy-subtle/40 p-3 text-left text-xs text-navy">
          {String(this.state.error?.message || this.state.error)}
        </pre>
        <button
          onClick={() => this.setState({ error: null })}
          className="rounded-full bg-orange px-5 py-2.5 text-sm font-bold text-white"
        >
          Try again
        </button>
      </div>
    )
  }
}
