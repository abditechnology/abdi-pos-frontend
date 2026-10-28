/**
 * Abdi POS — Unified API Client
 * Compatible with Laravel 13 Sanctum & PRD Section 11 (API & Response Standards)
 */

export class ApiError extends Error {
  constructor(message, status = 500, errors = {}, raw = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
    this.raw = raw
  }

  /**
   * Returns a friendly single string of the first validation error if any.
   */
  getFirstError() {
    if (!this.errors || typeof this.errors !== 'object') {
      return this.message
    }
    const keys = Object.keys(this.errors)
    if (keys.length > 0 && Array.isArray(this.errors[keys[0]])) {
      return this.errors[keys[0]][0]
    }
    return this.message
  }
}

class ApiClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1'
    this.tokenKey = 'abdi_pos_token'
  }

  /**
   * Retrieve active bearer token from storage
   */
  getToken() {
    return localStorage.getItem(this.tokenKey) || null
  }

  /**
   * Save active bearer token to storage
   */
  setToken(token) {
    if (token) {
      localStorage.setItem(this.tokenKey, token)
    } else {
      localStorage.removeItem(this.tokenKey)
    }
  }

  /**
   * Clear active bearer token
   */
  clearToken() {
    localStorage.removeItem(this.tokenKey)
  }

  /**
   * Build full URL with query parameters
   */
  buildUrl(endpoint, params = {}) {
    // If endpoint starts with http, use as is, else prepend baseURL
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${cleanEndpoint}`

    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val)
      }
    })

    const queryString = query.toString()
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString
    }

    return url
  }

  /**
   * Core request execution method
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      data = null,
      params = {},
      headers = {},
      signal = null,
    } = options

    const url = this.buildUrl(endpoint, params)
    const token = this.getToken()

    const requestHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    }

    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`
    }

    const config = {
      method,
      headers: requestHeaders,
      signal,
    }

    if (data && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
      config.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, config)

      // Handle 204 No Content
      if (response.status === 204) {
        return null
      }

      let json = {}
      try {
        json = await response.json()
      } catch (err) {
        json = { message: response.statusText || 'Gagal memproses respon server.' }
      }

      // Check HTTP error status
      if (!response.ok) {
        const message = json.message || `Request gagal dengan kode status ${response.status}`
        const errors = json.errors || {}

        // Special handling for 401 Unauthenticated
        if (response.status === 401) {
          this.clearToken()
          // Emit or dispatch unauthenticated event if necessary
        }

        throw new ApiError(message, response.status, errors, json)
      }

      // Return unpacked response payload according to PRD standard:
      // If server returned { success: true, data: [...] }, return that object or data
      return json
    } catch (err) {
      if (err instanceof ApiError) {
        throw err
      }
      // Network failure or abort
      throw new ApiError(
        err.name === 'AbortError' ? 'Permintaan dibatalkan' : 'Tidak dapat terhubung ke server backend.',
        0,
        {},
        err
      )
    }
  }

  // Shorthand HTTP helpers
  get(endpoint, params = {}, options = {}) {
    return this.request(endpoint, { method: 'GET', params, ...options })
  }

  post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, { method: 'POST', data, ...options })
  }

  put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, { method: 'PUT', data, ...options })
  }

  patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, { method: 'PATCH', data, ...options })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options })
  }
}

export const apiClient = new ApiClient()
export default apiClient
