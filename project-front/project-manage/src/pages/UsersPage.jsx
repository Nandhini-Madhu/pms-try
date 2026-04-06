import { useEffect, useState } from 'react'
import ErrorState from '../components/common/ErrorState'
import Loader from '../components/common/Loader'
import { userService } from '../services/userService'

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'developer',
}

function UsersPage() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadUsers = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await userService.getUsers()
      setUsers(response.users || response)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      await userService.createUser(form)
      setForm(initialForm)
      await loadUsers()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loader text="Loading users..." />
  }

  return (
    <div className="space-y-4">
      {error ? <ErrorState message={error} /> : null}

      <form onSubmit={handleCreate} className="panel grid gap-3 p-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Name</label>
          <input className="input" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
          <input className="input" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
          <input className="input" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required minLength={6} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Role</label>
          <select className="input" value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="developer">Developer</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button disabled={saving} className="btn-primary" type="submit">
            {saving ? 'Creating...' : 'Create user'}
          </button>
        </div>
      </form>

      <section className="panel overflow-x-auto p-4">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.08em] text-slate-500">
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((member) => (
              <tr key={member._id} className="border-b border-slate-100 text-slate-700">
                <td className="px-2 py-3 font-semibold">{member.name}</td>
                <td className="px-2 py-3">{member.email}</td>
                <td className="px-2 py-3">
                  <span className="badge bg-slate-100 text-slate-700">{member.role}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default UsersPage
