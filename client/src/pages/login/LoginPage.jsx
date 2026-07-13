import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResetSuccess, setShowResetSuccess] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.resetSuccess) {
      setShowResetSuccess(true)
      setTimeout(() => setShowResetSuccess(false), 3000)
    }
  }, [])

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to access your saved locations</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="search-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="search-input"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {showResetSuccess && <p className="admin-success">Password reset successfully. You can now log in.</p>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading && <span className="btn-spinner" />}
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="auth-links">
          <span>Don't have an account?</span>
          <Link to="/register">Register</Link>
        </div>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>

        <Link to="/" className="back-btn">Back to home</Link>
      </div>
    </div>
  )
}
