import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const statuses = ['Todo', 'In Progress', 'Done']

function SortableTaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task._id,
    data: { status: task.status },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priorityTone = {
    Low: 'bg-slate-100 text-slate-700',
    Medium: 'bg-amber-100 text-amber-700',
    High: 'bg-red-100 text-red-700',
  }

  return (
    <article ref={setNodeRef} style={style} {...attributes} {...listeners} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-slate-800">{task.title}</h4>
        <span className={`badge ${priorityTone[task.priority] || 'bg-slate-100 text-slate-700'}`}>
          {task.priority}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-xs text-slate-500">{task.description}</p>
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
        <span>{task.assignee?.name || 'Unassigned'}</span>
        <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</span>
      </div>
    </article>
  )
}

function KanbanBoard({ tasks, onTasksChange, onStatusChange }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const grouped = statuses.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status)
    return acc
  }, {})

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) {
      return
    }

    const activeTask = tasks.find((task) => task._id === active.id)
    const overTask = tasks.find((task) => task._id === over.id)

    if (!activeTask || !overTask) {
      return
    }

    if (activeTask.status === overTask.status) {
      const sourceColumn = grouped[activeTask.status]
      const oldIndex = sourceColumn.findIndex((task) => task._id === active.id)
      const newIndex = sourceColumn.findIndex((task) => task._id === over.id)
      const reordered = arrayMove(sourceColumn, oldIndex, newIndex)

      const nextTasks = tasks.map((task) => {
        if (task.status !== activeTask.status) {
          return task
        }
        return reordered.find((item) => item._id === task._id) || task
      })

      onTasksChange(nextTasks)
      return
    }

    const nextTasks = tasks.map((task) =>
      task._id === active.id ? { ...task, status: overTask.status } : task,
    )

    onTasksChange(nextTasks)
    onStatusChange(active.id, overTask.status)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 lg:grid-cols-3">
        {statuses.map((status) => (
          <section key={status} className="panel p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">{status}</h3>
              <span className="badge bg-slate-100 text-slate-600">{grouped[status].length}</span>
            </div>

            <SortableContext items={grouped[status].map((task) => task._id)} strategy={rectSortingStrategy}>
              <div className="space-y-3">
                {grouped[status].map((task) => (
                  <SortableTaskCard key={task._id} task={task} />
                ))}
                {grouped[status].length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">
                    Drop a task here
                  </div>
                ) : null}
              </div>
            </SortableContext>
          </section>
        ))}
      </div>
    </DndContext>
  )
}

export default KanbanBoard
