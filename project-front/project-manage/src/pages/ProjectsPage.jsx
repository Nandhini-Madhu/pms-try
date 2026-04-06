import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorState from '../components/common/ErrorState'
import Loader from '../components/common/Loader'
import { useAuth } from '../hooks/useAuth'
import { projectService } from '../services/projectService'

const initialForm = {
  name: '',
  description: '',
  status: 'Active',
  manager: '',
  teamMembers: '',
}

function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(initialForm)

  const loadProjects = async () => {
    setError('')
    setLoading(true)
    try {
      const response = await projectService.getProjects()
      setProjects(response.projects || response)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        name: form.name,
        description: form.description,
        status: form.status,
        manager: form.manager || undefined,
        teamMembers: form.teamMembers
          .split(',')
          .map((member) => member.trim())
          .filter(Boolean),
      }

      await projectService.createProject(payload)
      setForm(initialForm)
      await loadProjects()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loader text="Loading projects..." />
  }

  return (
    <div className="space-y-4">
      {error ? <ErrorState message={error} /> : null}

      {(user?.role === 'admin' || user?.role === 'manager') && (
        <form onSubmit={handleCreate} className="panel grid gap-3 p-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Project name</label>
            <input className="input" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Manager ID</label>
            <input className="input" value={form.manager} onChange={(e) => setForm((prev) => ({ ...prev, manager: e.target.value }))} placeholder="Manager user id" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-700">Description</label>
            <textarea className="input min-h-24" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
              <option>Active</option>
              <option>Completed</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Team member IDs</label>
            <input className="input" value={form.teamMembers} onChange={(e) => setForm((prev) => ({ ...prev, teamMembers: e.target.value }))} placeholder="id1,id2,id3" />
          </div>

          <div className="md:col-span-2">
            <button disabled={saving} className="btn-primary" type="submit">
              {saving ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project._id} className="panel p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-xl font-semibold text-ink">{project.name}</h3>
              <span className={`badge ${project.status === 'Completed' ? 'bg-sea/20 text-sea' : 'bg-coral/20 text-coral'}`}>
                {project.status}
              </span>
            </div>

            <p className="mt-2 line-clamp-3 text-sm text-slate-600">{project.description}</p>
            <p className="mt-3 text-xs text-slate-500">Manager: {project.manager?.name || 'Not assigned'}</p>

            <div className="mt-4 flex gap-2">
              <Link className="btn-secondary" to={`/projects/${project._id}`}>
                Details
              </Link>
              <Link className="btn-primary" to={`/projects/${project._id}/kanban`}>
                Open Kanban
              </Link>
            </div>
          </article>
        ))}

        {projects.length === 0 ? <p className="text-sm text-slate-500">No projects found.</p> : null}
      </section>
    </div>
  )
}

export default ProjectsPage
