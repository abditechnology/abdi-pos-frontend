import apiClient from './apiClient'

export const orderService = {
  /**
   * List orders for tenant (PRD §10.1)
   */
  async getOrders(params = {}) {
    return await apiClient.get('/tenant/orders', params)
  },

  /**
   * Get single order details with items and payments
   */
  async getOrder(id) {
    return await apiClient.get(`/tenant/orders/${id}`)
  },

  /**
   * Create POS transaction or self-order
   */
  async createOrder(data) {
    return await apiClient.post('/tenant/orders', data)
  },

  /**
   * Record payment for an order
   */
  async addPayment(orderId, data) {
    return await apiClient.post(`/tenant/orders/${orderId}/payments`, data)
  },

  /**
   * Void / cancel order
   */
  async voidOrder(orderId, data = {}) {
    return await apiClient.post(`/tenant/orders/${orderId}/void`, data)
  },
}

export default orderService
