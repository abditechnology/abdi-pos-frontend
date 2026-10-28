import apiClient from './apiClient'

export const promotionService = {
  async getPromotions(params = {}) {
    return await apiClient.get('/tenant/promotions', params)
  },

  async getPromotion(id) {
    return await apiClient.get(`/tenant/promotions/${id}`)
  },

  async createPromotion(data) {
    return await apiClient.post('/tenant/promotions', data)
  },

  async updatePromotion(id, data) {
    return await apiClient.put(`/tenant/promotions/${id}`, data)
  },

  async deletePromotion(id) {
    return await apiClient.delete(`/tenant/promotions/${id}`)
  },
}

export default promotionService
