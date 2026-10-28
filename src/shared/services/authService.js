import apiClient from './apiClient'

export const authService = {
  /**
   * Login staff user (PRD §11.1)
   */
  async login(credentials) {
    const res = await apiClient.post('/auth/login', credentials)
    if (res?.data?.token) {
      apiClient.setToken(res.data.token)
    }
    return res
  },

  /**
   * Get current authenticated user
   */
  async me() {
    return await apiClient.get('/auth/me')
  },

  /**
   * Logout current device session
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      apiClient.clearToken()
    }
  },

  /**
   * Revoke all user sessions
   */
  async logoutAll() {
    try {
      await apiClient.post('/auth/logout-all')
    } finally {
      apiClient.clearToken()
    }
  },

  /**
   * Update profile information
   */
  async updateProfile(payload) {
    return await apiClient.put('/auth/profile', payload)
  },

  /**
   * Change user password
   */
  async updatePassword(payload) {
    return await apiClient.put('/auth/password', payload)
  },
}

export default authService
