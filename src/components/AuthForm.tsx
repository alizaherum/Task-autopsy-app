import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

export function AuthForm() {
  const { signInWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const result = await signInWithEmail(email)

    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center shadow-lg shadow-black/20">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/15 text-violet-300">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-100">Check your email</h2>
        <p className="mt-1.5 text-sm text-slate-400">
          We sent a sign-in link to <span className="text-slate-200">{email}</span>. Open
          it on this device to finish signing in.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-4 text-sm text-slate-400 hover:text-slate-200"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-lg shadow-black/20">
      <h2 className="text-lg font-bold text-slate-100">Sign in</h2>
      <p className="mt-1 text-sm text-slate-400">
        Enter your email and we'll send you a link to sign in — no password needed. Your
        tasks and reflections sync across every device you use it on.
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
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-violet-950/40 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:shadow-none"
        >
          {submitting ? 'Sending…' : 'Send sign-in link'}
        </button>
      </form>
    </div>
  )
}
