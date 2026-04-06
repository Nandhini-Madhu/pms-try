import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'developer' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="panel w-full max-w-md p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-coral">ProjectFlow</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink">Create your account</h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Name</label>
            <input className="input" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
            <input className="input" type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} required minLength={6} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Role</label>
            <select className="input" value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="developer">Developer</option>
            </select>
          </div>

          {error ? <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}

          <button disabled={loading} className="btn-primary w-full" type="submit">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-semibold text-ink" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
