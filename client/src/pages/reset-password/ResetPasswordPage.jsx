import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../utils/api'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tokenError, setTokenError] = useState('')
  const [tokenChecking, setTokenChecking] = useState(true)

  useEffect(() => {
    api.validateResetToken(token)
      .catch((err) => setTokenError(err.message))
      .finally(() => setTokenChecking(false))
  }, [token])

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      setTimeout(() => setError(''), 3000)
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.resetPassword(token, password)
      navigate('/login', { state: { resetSuccess: true } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (tokenChecking) {
    return (
      <div className="app">
        <div className="centered"><div className="spinner" /></div>
      </div>
    )
  }

  if (tokenError) {
    return (
      <div className="app">
        <div className="centered">
          <p className="error-icon">🔗</p>
          <p className="hint">{tokenError}</p>
          <button className="location-btn" onClick={() => navigate('/forgot-password')}>Request a new link</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="auth-card">
        <h1 className="auth-title">Reset password</h1>
        <p className="auth-subtitle">Enter your new password below</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">New password</label>
            <input
              className="search-input"
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input
              className="search-input"
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading && <span className="btn-spinner" />}
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  )
}
