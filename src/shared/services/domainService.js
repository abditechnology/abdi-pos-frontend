import apiClient from './apiClient'

export const domainService = {
  async getDomains() {
    return await apiClient.get('/tenant/domains')
  },

  async createSubdomain(subdomain) {
    return await apiClient.post('/tenant/domains/subdomain', { subdomain })
  },

  async createCustomDomain(domain) {
    return await apiClient.post('/tenant/domains/custom', { domain })
  },

  async verifyDomain(id) {
    return await apiClient.post(`/tenant/domains/${id}/verify`)
  },

  async setPrimaryDomain(id) {
    return await apiClient.post(`/tenant/domains/${id}/primary`)
  },

  async deleteDomain(id) {
    return await apiClient.delete(`/tenant/domains/${id}`)
  },
}

export default domainService
