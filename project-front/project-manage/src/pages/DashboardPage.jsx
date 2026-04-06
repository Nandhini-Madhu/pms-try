import { useEffect, useState } from 'react'
import ErrorState from '../components/common/ErrorState'
import Loader from '../components/common/Loader'
import StatCard from '../components/layout/StatCard'
import { dashboardService } from '../services/dashboardService'

const fallback = {
  totalProjects: 0,
  tasksByStatus: { Todo: 0, 'In Progress': 0, Done: 0 },
  recentActivity: [],
}

function DashboardPage() {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOverview = async () => {
    setError('')
    setLoading(true)
    try {
      const response = await dashboardService.getOverview()
      setData(response)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOverview()
  }, [])

  if (loading) {
    return <Loader text="Loading dashboard metrics..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadOverview} />
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Projects" value={data.totalProjects} tone="ink" />
        <StatCard title="Todo Tasks" value={data.tasksByStatus?.Todo || 0} tone="coral" />
        <StatCard title="In Progress" value={data.tasksByStatus?.['In Progress'] || 0} tone="sun" />
        <StatCard title="Completed" value={data.tasksByStatus?.Done || 0} tone="sea" />
      </div>

      <section className="panel p-5">
        <h3 className="font-display text-xl font-semibold text-ink">Recent Activity</h3>
        <div className="mt-4 space-y-3">
          {data.recentActivity?.length ? (
            data.recentActivity.map((entry) => (
              <div key={entry._id || `${entry.action}-${entry.timestamp}`} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
                <p className="font-semibold text-slate-800">{entry.action}</p>
                <p className="text-xs text-slate-500">
                  {entry.user?.name || 'System'} • {new Date(entry.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No activity yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
