import { api } from './api'

export const userService = {
  async getUsers() {
    const { data } = await api.get('/users')
    return data
  },

  async createUser(payload) {
    const { data } = await api.post('/users', payload)
    return data
  },
}
