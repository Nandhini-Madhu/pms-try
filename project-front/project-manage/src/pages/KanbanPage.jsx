import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ErrorState from '../components/common/ErrorState'
import Loader from '../components/common/Loader'
import KanbanBoard from '../components/tasks/KanbanBoard'
import { taskService } from '../services/taskService'

function KanbanPage() {
  const { projectId } = useParams()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await taskService.getTasksByProject(projectId)
      setTasks(response.tasks || response)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskService.updateTask(taskId, { status })
    } catch (err) {
      setError(err.message)
      await loadTasks()
    }
  }

  if (loading) {
    return <Loader text="Loading kanban board..." />
  }

  if (error && tasks.length === 0) {
    return <ErrorState message={error} onRetry={loadTasks} />
  }

  return (
    <div className="space-y-4">
      {error ? <ErrorState message={error} /> : null}
      <KanbanBoard tasks={tasks} onTasksChange={setTasks} onStatusChange={handleStatusChange} />
    </div>
  )
}

export default KanbanPage
