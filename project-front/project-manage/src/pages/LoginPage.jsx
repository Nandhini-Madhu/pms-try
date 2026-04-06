import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="panel w-full max-w-md p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-sea">ProjectFlow</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to continue managing your delivery pipeline.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error ? <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}

          <button disabled={loading} className="btn-primary w-full" type="submit">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          New here?{' '}
          <Link className="font-semibold text-ink" to="/register">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
