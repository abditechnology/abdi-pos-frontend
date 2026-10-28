import apiClient from './apiClient'

export const shiftService = {
  /**
   * Get list of shifts (PRD §9.13)
   */
  async getShifts(params = {}) {
    return await apiClient.get('/tenant/shifts', params)
  },

  /**
   * Get active open shift for currently logged in cashier
   */
  async getCurrentShift(params = {}) {
    return await apiClient.get('/tenant/shifts/current', params)
  },

  /**
   * Open cashier shift with initial cash float
   */
  async openShift(data) {
    return await apiClient.post('/tenant/shifts/open', data)
  },

  /**
   * Close and reconcile cashier shift
   */
  async closeShift(shiftId, data) {
    return await apiClient.post(`/tenant/shifts/${shiftId}/close`, data)
  },
}

export default shiftService
