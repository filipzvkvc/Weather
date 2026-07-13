import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../utils/api'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="app">
        <div className="auth-card">
          <h1 className="auth-title">Check your inbox</h1>
          <p className="auth-subtitle">
            If <strong>{email}</strong> is registered, you'll receive a reset link shortly. Check your spam folder if it doesn't arrive.
          </p>
          <button className="auth-btn" onClick={() => navigate('/login')}>Go to login</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="auth-card">
        <h1 className="auth-title">Forgot password</h1>
        <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>

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

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading && <span className="btn-spinner" />}
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <Link to="/login" className="back-btn">Back to login</Link>
      </div>
    </div>
  )
}
