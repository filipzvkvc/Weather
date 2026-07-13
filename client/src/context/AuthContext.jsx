import { createContext, useContext, useState } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  async function register(email, password) {
    await api.register(email, password)
  }

  async function login(email, password) {
    const data = await api.login(email, password)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }

  function updateUser(data) {
    const updated = { ...user, ...data }
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
  }

  function clearSession() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  async function logout() {
    clearSession()
    await api.logout().catch(() => {})
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, clearSession, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
