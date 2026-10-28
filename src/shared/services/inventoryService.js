import apiClient from './apiClient'

export const inventoryService = {
  /**
   * Get current stock levels per outlet
   */
  async getStock(params = {}) {
    return await apiClient.get('/tenant/stock', params)
  },

  /**
   * Get audit log of inventory movements (in, out, transfer, adjustment)
   */
  async getMovements(params = {}) {
    return await apiClient.get('/tenant/stock/movements', params)
  },

  /**
   * Adjust stock manually (e.g., waste, damage, correction)
   */
  async adjustStock(data) {
    return await apiClient.post('/tenant/stock/adjust', data)
  },

  /**
   * Submit physical stock opname count
   */
  async opnameStock(data) {
    return await apiClient.post('/tenant/stock/opname', data)
  },
}

export default inventoryService
