import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ErrorState from '../components/common/ErrorState'
import Loader from '../components/common/Loader'
import { commentService } from '../services/commentService'
import { projectService } from '../services/projectService'
import { taskService } from '../services/taskService'

const defaultTask = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Todo',
  assignee: '',
  deadline: '',
}

function ProjectDetailsPage() {
  const { projectId } = useParams()

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [comments, setComments] = useState({})
  const [taskForm, setTaskForm] = useState(defaultTask)
  const [commentText, setCommentText] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDetails = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [projectRes, taskRes] = await Promise.all([
        projectService.getProjectById(projectId),
        taskService.getTasksByProject(projectId),
      ])

      const resolvedProject = projectRes.project || projectRes
      const resolvedTasks = taskRes.tasks || taskRes

      setProject(resolvedProject)
      setTasks(resolvedTasks)

      const commentMap = {}
      await Promise.all(
        resolvedTasks.map(async (task) => {
          try {
            const response = await commentService.getTaskComments(task._id)
            commentMap[task._id] = response.comments || response
          } catch {
            commentMap[task._id] = []
          }
        }),
      )
      setComments(commentMap)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    loadDetails()
  }, [loadDetails])

  const handleTaskCreate = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await taskService.createTask({
        ...taskForm,
        project: projectId,
      })
      setTaskForm(defaultTask)
      await loadDetails()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCommentSubmit = async (taskId, event) => {
    event.preventDefault()
    const text = commentText[taskId]
    if (!text?.trim()) {
      return
    }

    try {
      await commentService.createTaskComment(taskId, { text })
      setCommentText((prev) => ({ ...prev, [taskId]: '' }))
      const response = await commentService.getTaskComments(taskId)
      setComments((prev) => ({ ...prev, [taskId]: response.comments || response }))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return <Loader text="Loading project details..." />
  }

  if (error && !project) {
    return <ErrorState message={error} onRetry={loadDetails} />
  }

  return (
    <div className="space-y-4">
      {error ? <ErrorState message={error} /> : null}

      <section className="panel p-5">
        <h2 className="font-display text-2xl font-bold text-ink">{project.name}</h2>
        <p className="mt-2 text-sm text-slate-600">{project.description}</p>
      </section>

      <form onSubmit={handleTaskCreate} className="panel grid gap-3 p-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Task title</label>
          <input className="input" value={taskForm.title} onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))} required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Assignee ID</label>
          <input className="input" value={taskForm.assignee} onChange={(e) => setTaskForm((prev) => ({ ...prev, assignee: e.target.value }))} />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-semibold text-slate-700">Description</label>
          <textarea className="input min-h-24" value={taskForm.description} onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))} required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Priority</label>
          <select className="input" value={taskForm.priority} onChange={(e) => setTaskForm((prev) => ({ ...prev, priority: e.target.value }))}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
          <select className="input" value={taskForm.status} onChange={(e) => setTaskForm((prev) => ({ ...prev, status: e.target.value }))}>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Deadline</label>
          <input className="input" type="date" value={taskForm.deadline} onChange={(e) => setTaskForm((prev) => ({ ...prev, deadline: e.target.value }))} />
        </div>

        <div className="md:col-span-2">
          <button className="btn-primary" type="submit">
            Add Task
          </button>
        </div>
      </form>

      <section className="space-y-4">
        {tasks.map((task) => (
          <article key={task._id} className="panel p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-800">{task.title}</h3>
              <div className="flex gap-2">
                <span className="badge bg-slate-100 text-slate-700">{task.status}</span>
                <span className="badge bg-amber-100 text-amber-700">{task.priority}</span>
              </div>
            </div>

            <p className="mt-2 text-sm text-slate-600">{task.description}</p>

            <div className="mt-3 border-t border-slate-200 pt-3">
              <h4 className="text-sm font-semibold text-slate-700">Comments</h4>
              <div className="mt-2 space-y-2">
                {(comments[task._id] || []).map((comment) => (
                  <div key={comment._id} className="rounded-lg border border-slate-200 bg-white p-2 text-sm">
                    <p>{comment.text}</p>
                    <p className="text-xs text-slate-500">
                      {comment.user?.name || 'Unknown'} • {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <form className="mt-3 flex gap-2" onSubmit={(event) => handleCommentSubmit(task._id, event)}>
                <input
                  className="input"
                  placeholder="Add a comment"
                  value={commentText[task._id] || ''}
                  onChange={(e) => setCommentText((prev) => ({ ...prev, [task._id]: e.target.value }))}
                />
                <button className="btn-secondary" type="submit">
                  Post
                </button>
              </form>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

export default ProjectDetailsPage
