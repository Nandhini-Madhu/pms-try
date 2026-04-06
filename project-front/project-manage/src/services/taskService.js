import { api } from './api'

export const taskService = {
  async getTasksByProject(projectId) {
    const { data } = await api.get(`/tasks/project/${projectId}`)
    return data
  },

  async createTask(payload) {
    const { data } = await api.post('/tasks', payload)
    return data
  },

  async updateTask(taskId, payload) {
    const { data } = await api.patch(`/tasks/${taskId}`, payload)
    return data
  },
}
