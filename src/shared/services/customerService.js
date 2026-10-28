import apiClient from './apiClient'

export const customerService = {
  async getCustomers(params = {}) {
    return await apiClient.get('/tenant/customers', params)
  },

  async getCustomer(id) {
    return await apiClient.get(`/tenant/customers/${id}`)
  },

  async createCustomer(data) {
    return await apiClient.post('/tenant/customers', data)
  },

  async updateCustomer(id, data) {
    return await apiClient.put(`/tenant/customers/${id}`, data)
  },

  async deleteCustomer(id) {
    return await apiClient.delete(`/tenant/customers/${id}`)
  },
}

export default customerService
