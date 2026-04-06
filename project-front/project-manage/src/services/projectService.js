import { api } from './api'

export const projectService = {
  async getProjects() {
    const { data } = await api.get('/projects')
    return data
  },

  async getProjectById(projectId) {
    const { data } = await api.get(`/projects/${projectId}`)
    return data
  },

  async createProject(payload) {
    const { data } = await api.post('/projects', payload)
    return data
  },
}
