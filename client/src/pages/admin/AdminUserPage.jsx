import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'

export default function AdminUserPage() {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '', is_verified: false, is_admin: false })
  const [originalEmail, setOriginalEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!currentUser?.is_admin) return
    setLoading(true)
    api.admin.getUser(id)
      .then((u) => {
        setForm({ email: u.email, password: '', is_verified: !!u.is_verified, is_admin: !!u.is_admin })
        setOriginalEmail(u.email)
      })
      .catch((err) => {
        if (err.message === 'User not found') setNotFound(true)
        else { setError('Failed to load user.'); setTimeout(() => setError(''), 3000) }
      })
      .finally(() => setLoading(false))
  }, [id, currentUser])

  if (!currentUser?.is_admin) {
    return (
      <div className="app">
        <div className="centered">
          <p className="error-icon">🔒</p>
          <p className="hint">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (form.password && form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      setTimeout(() => setError(''), 3000)
      return
    }
    setSaving(true)
    try {
      const payload = {
        email: form.email,
        is_verified: form.is_verified,
      }
      if (Number(id) !== currentUser.id) payload.is_admin = form.is_admin
      if (form.password) payload.password = form.password
      await api.admin.updateUser(id, payload)
      setSuccess('User updated successfully.')
      setForm((f) => ({ ...f, password: '' }))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (notFound) {
    return (
      <div className="app">
        <div className="centered">
          <p className="error-icon">404</p>
          <p className="hint">User not found.</p>
          <button className="location-btn" onClick={() => navigate('/admin')}>Back to users</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="auth-card">
        <h1 className="auth-title">Edit user</h1>
        {!loading && <p className="auth-subtitle">{originalEmail}</p>}

        {loading ? (
          <div className="centered"><div className="spinner" /></div>
        ) : (
          <form className="auth-form" onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="search-input"
                type="email"
                autoComplete="off"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New password <span style={{ opacity: 0.5 }}>(leave blank to keep current)</span></label>
              <input
                className="search-input"
                type="password"
                placeholder="New password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>

            <div className="admin-toggles">
              <label className="admin-toggle">
                <input
                  type="checkbox"
                  checked={form.is_verified}
                  onChange={(e) => setForm((f) => ({ ...f, is_verified: e.target.checked }))}
                />
                <span>Email verified</span>
              </label>

              {Number(id) !== currentUser.id && (
                <label className="admin-toggle">
                  <input
                    type="checkbox"
                    checked={form.is_admin}
                    onChange={(e) => setForm((f) => ({ ...f, is_admin: e.target.checked }))}
                  />
                  <span>Admin role</span>
                </label>
              )}
            </div>

            {error && <p className="auth-error">{error}</p>}
            {success && <p className="admin-success">{success}</p>}

            <button className="auth-btn" type="submit" disabled={saving}>
              {saving && <span className="btn-spinner" />}
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        )}

        {!loading && <button className="back-btn" onClick={() => navigate('/admin')}>Back to users</button>}
      </div>
    </div>
  )
}
