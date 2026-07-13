import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user])

  const [email, setEmail] = useState(user?.email || '')
  useEffect(() => {
    api.getProfile()
      .then((data) => {
        setEmail(data.email)
        if (data.email !== user?.email) updateUser({ email: data.email })
      })
      .catch(() => {})
  }, [])

  const [emailPassword, setEmailPassword] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailMessage, setEmailMessage] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  async function handleEmailSave(e) {
    e.preventDefault()
    setEmailError('')
    setEmailMessage('')
    setSavingEmail(true)
    try {
      const data = await api.updateProfile({ email, currentPassword: emailPassword })
      setEmailMessage(data.message)
      setEmailPassword('')
      setTimeout(() => setEmailMessage(''), 3000)
    } catch (err) {
      setEmailError(err.message)
      setTimeout(() => setEmailError(''), 3000)
    } finally {
      setSavingEmail(false)
    }
  }

  async function handlePasswordSave(e) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      setTimeout(() => setPasswordError(''), 3000)
      return
    }
    setPasswordError('')
    setSavingPassword(true)
    try {
      await api.updateProfile({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSuccess(true)
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err) {
      setPasswordError(err.message)
      setTimeout(() => setPasswordError(''), 3000)
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="app">
      <div className="auth-card">
        <h1 className="auth-title">Profile</h1>
        <p className="auth-subtitle">{user?.email}</p>

        <form className="auth-form" onSubmit={handleEmailSave}>
          <div className="form-group">
            <label className="form-label">New email</label>
            <input
              className="search-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Current password</label>
            <input
              className="search-input"
              type="password"
              placeholder="Current password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              required
            />
          </div>
          {emailError && <p className="auth-error">{emailError}</p>}
          {emailMessage && <p className="admin-success">{emailMessage}</p>}
          <button className="auth-btn" type="submit" disabled={savingEmail}>
            {savingEmail && <span className="btn-spinner" />}
            {savingEmail ? 'Sending...' : 'Update email'}
          </button>
        </form>

        <hr className="profile-divider" />

        <form className="auth-form" onSubmit={handlePasswordSave}>
          <div className="form-group">
            <label className="form-label">Current password</label>
            <input
              className="search-input"
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">New password</label>
            <input
              className="search-input"
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm new password</label>
            <input
              className="search-input"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {passwordError && <p className="auth-error">{passwordError}</p>}
          {passwordSuccess && <p className="admin-success">Password updated.</p>}
          <button className="auth-btn" type="submit" disabled={savingPassword}>
            {savingPassword && <span className="btn-spinner" />}
            {savingPassword ? 'Saving...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
