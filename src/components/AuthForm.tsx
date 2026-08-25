import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

export function AuthForm() {
  const { signInWithPassword, signUpWithPassword } = useAuth()
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)

    const result =
      mode === 'sign-in'
        ? await signInWithPassword(email, password)
        : await signUpWithPassword(email, password)

    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    if (mode === 'sign-up') {
      setInfo('Account created. Check your email to confirm, then sign in.')
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-lg shadow-black/20">
      <h2 className="text-lg font-bold text-slate-100">
        {mode === 'sign-in' ? 'Sign in' : 'Create an account'}
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Sign in to sync your tasks and reflections across devices.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-slate-100 outline-none transition-colors focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-slate-100 outline-none transition-colors focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {info && <p className="text-sm text-emerald-400">{info}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-violet-950/40 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:shadow-none"
        >
          {submitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Sign up'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode((m) => (m === 'sign-in' ? 'sign-up' : 'sign-in'))
          setError(null)
          setInfo(null)
        }}
        className="mt-4 w-full text-center text-sm text-slate-400 hover:text-slate-200"
      >
        {mode === 'sign-in'
          ? "Don't have an account? Sign up"
          : 'Already have an account? Sign in'}
      </button>
    </div>
  )
}
