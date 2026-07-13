import { API_BASE } from '../constants/api'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    ...options,
  })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed')
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  register: (email, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),

  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  logout: () => request('/auth/logout', { method: 'POST' }),

  forgotPassword: (email) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  validateResetToken: (token) =>
    request(`/auth/reset-password/${token}`),

  resetPassword: (token, password) =>
    request(`/auth/reset-password/${token}`, { method: 'POST', body: JSON.stringify({ password }) }),

  getProfile: () => request('/user/me'),
  updateProfile: (data) => request('/user/me', { method: 'PATCH', body: JSON.stringify(data) }),

  getFavorites: () => request('/favorites'),

  addFavorite: (location, country, latitude, longitude) =>
    request('/favorites', { method: 'POST', body: JSON.stringify({ location, country, latitude, longitude }) }),

  removeFavorite: (id) =>
    request(`/favorites/${id}`, { method: 'DELETE' }),

  admin: {
    getUsers: () => request('/admin/users'),
    getUser: (id) => request(`/admin/users/${id}`),
    updateUser: (id, data) => request(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  },
}
