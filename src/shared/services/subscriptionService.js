import apiClient from './apiClient'

export const subscriptionService = {
  // ---- Tenant Subscription ------------------------------------------------
  async getTenantSubscription() {
    return await apiClient.get('/tenant/subscription')
  },

  async getTenantInvoices() {
    return await apiClient.get('/tenant/billing/invoices')
  },

  // ---- Platform Superadmin Plans ------------------------------------------
  async getPlatformPlans() {
    return await apiClient.get('/admin/plans')
  },

  async getPlan(id) {
    return await apiClient.get(`/admin/plans/${id}`)
  },

  async createPlan(data) {
    return await apiClient.post('/admin/plans', data)
  },

  async updatePlan(id, data) {
    return await apiClient.put(`/admin/plans/${id}`, data)
  },

  async deletePlan(id) {
    return await apiClient.delete(`/admin/plans/${id}`)
  },

  async assignPlan(tenantId, planId) {
    return await apiClient.post(`/admin/tenants/${tenantId}/subscription`, { plan_id: planId })
  },

  async getAdminInvoices() {
    return await apiClient.get('/admin/billing/invoices')
  },
}

export default subscriptionService
