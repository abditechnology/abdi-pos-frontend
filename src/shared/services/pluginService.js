import apiClient from './apiClient'

export const pluginService = {
  /**
   * Get all available plugins with tenant activation status
   */
  async getTenantPlugins() {
    return await apiClient.get('/tenant/plugins')
  },

  /**
   * Toggle activation for a plugin key
   */
  async togglePlugin(pluginKey) {
    return await apiClient.post(`/tenant/plugins/${pluginKey}/toggle`)
  },

  /**
   * Admin catalogue of platform plugins
   */
  async getPlatformPlugins() {
    return await apiClient.get('/admin/plugins')
  },
}

export default pluginService
