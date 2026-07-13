import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, user } = useAuth()
  const navigate = useNavigate()

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match')
      setTimeout(() => setError(''), 3000)
      return
    }
    setLoading(true)
    try {
      await register(email, password)
      setDone(true)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="app">
        <div className="auth-card">
          <p className="error-icon">📬</p>
          <h1 className="auth-title">Check your email</h1>
          <p className="auth-subtitle">We sent a verification link to <strong>{email}</strong>.</p>
          <p className="auth-subtitle">Click it to activate your account.</p>
          <p className="auth-subtitle">Can't find it? Check your spam folder.</p>
          <button className="auth-btn" onClick={() => navigate('/login')}>Go to login</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Save and sync your favorite locations</p>

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
              placeholder="Choose a password"
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
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading && <span className="btn-spinner" />}
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-links">
          <span>Already have an account?</span>
          <Link to="/login">Log in</Link>
        </div>

        <Link to="/" className="back-btn">Back to home</Link>
      </div>
    </div>
  )
}
