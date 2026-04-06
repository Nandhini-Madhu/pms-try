import { api } from './api'

export const commentService = {
  async getTaskComments(taskId) {
    const { data } = await api.get(`/comments/task/${taskId}`)
    return data
  },

  async createTaskComment(taskId, payload) {
    const { data } = await api.post(`/comments/task/${taskId}`, payload)
    return data
  },
}
