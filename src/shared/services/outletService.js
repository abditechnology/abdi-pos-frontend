import apiClient from './apiClient'

export const outletService = {
  // ---- Outlets ------------------------------------------------------------
  async getOutlets(params = {}) {
    return await apiClient.get('/tenant/outlets', params)
  },

  async getOutlet(id) {
    return await apiClient.get(`/tenant/outlets/${id}`)
  },

  async createOutlet(data) {
    return await apiClient.post('/tenant/outlets', data)
  },

  async updateOutlet(id, data) {
    return await apiClient.put(`/tenant/outlets/${id}`, data)
  },

  async deleteOutlet(id) {
    return await apiClient.delete(`/tenant/outlets/${id}`)
  },

  // ---- Staff / Users ------------------------------------------------------
  async getUsers(params = {}) {
    return await apiClient.get('/tenant/users', params)
  },

  async getUser(id) {
    return await apiClient.get(`/tenant/users/${id}`)
  },

  async createUser(data) {
    return await apiClient.post('/tenant/users', data)
  },

  async updateUser(id, data) {
    return await apiClient.put(`/tenant/users/${id}`, data)
  },

  async deleteUser(id) {
    return await apiClient.delete(`/tenant/users/${id}`)
  },

  // ---- Roles & Permissions ------------------------------------------------
  async getRoles() {
    return await apiClient.get('/tenant/roles')
  },

  async getPermissions() {
    return await apiClient.get('/tenant/permissions')
  },
}

export default outletService
