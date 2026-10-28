import apiClient from './apiClient'

export const reportService = {
  async getSummary(params = {}) {
    return await apiClient.get('/tenant/reports/summary', params)
  },

  async getSales(params = {}) {
    return await apiClient.get('/tenant/reports/sales', params)
  },

  async getProducts(params = {}) {
    return await apiClient.get('/tenant/reports/products', params)
  },

  async getCategories(params = {}) {
    return await apiClient.get('/tenant/reports/categories', params)
  },

  async getOutlets(params = {}) {
    return await apiClient.get('/tenant/reports/outlets', params)
  },

  async getStaff(params = {}) {
    return await apiClient.get('/tenant/reports/staff', params)
  },

  async getInventory(params = {}) {
    return await apiClient.get('/tenant/reports/inventory', params)
  },
}

export default reportService
