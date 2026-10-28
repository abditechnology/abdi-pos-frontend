import apiClient from './apiClient'

export const productService = {
  // ---- Products -----------------------------------------------------------
  async getProducts(params = {}) {
    return await apiClient.get('/tenant/products', params)
  },

  async getProduct(id) {
    return await apiClient.get(`/tenant/products/${id}`)
  },

  async createProduct(data) {
    return await apiClient.post('/tenant/products', data)
  },

  async updateProduct(id, data) {
    return await apiClient.put(`/tenant/products/${id}`, data)
  },

  async deleteProduct(id) {
    return await apiClient.delete(`/tenant/products/${id}`)
  },

  // ---- Categories ---------------------------------------------------------
  async getCategories(params = {}) {
    return await apiClient.get('/tenant/categories', params)
  },

  async getCategory(id) {
    return await apiClient.get(`/tenant/categories/${id}`)
  },

  async createCategory(data) {
    return await apiClient.post('/tenant/categories', data)
  },

  async updateCategory(id, data) {
    return await apiClient.put(`/tenant/categories/${id}`, data)
  },

  async deleteCategory(id) {
    return await apiClient.delete(`/tenant/categories/${id}`)
  },
}

export default productService
