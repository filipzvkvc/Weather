import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const STATES = {
  success: {
    icon: '✅',
    hint: 'Your account is now active. You can log in.',
    action: { label: 'Go to login', path: '/login' },
  },
  invalid: {
    icon: '🔗',
    hint: 'This verification link is invalid or has already been used.',
    action: { label: 'Go to login', path: '/login' },
  },
  expired: {
    icon: '⏱️',
    hint: 'This verification link has expired. Try logging in and we\'ll send you a new one.',
    action: { label: 'Go to login', path: '/login' },
  },
  'email-changed': {
    icon: '✅',
    hint: 'Your email address has been updated. Please log in with your new email.',
    action: { label: 'Go to login', path: '/login' },
  },
  'email-invalid': {
    icon: '🔗',
    hint: 'This link is invalid or has already been used.',
    action: { label: 'Go to profile', path: '/profile' },
  },
  'email-expired': {
    icon: '⏱️',
    hint: 'This link has expired. Please request a new email change from your profile.',
    action: { label: 'Go to profile', path: '/profile' },
  },
  'email-taken': {
    icon: '⚠️',
    hint: 'That email address is already in use by another account.',
    action: { label: 'Go to profile', path: '/profile' },
  },
}

export default function VerifyResultPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { clearSession } = useAuth()
  const status = params.get('status')
  const state = STATES[status] ?? STATES.invalid

  useEffect(() => {
    if (status === 'email-changed') clearSession()
  }, [])

  return (
    <div className="app">
      <div className="centered">
        <p className="error-icon">{state.icon}</p>
        <p className="hint">{state.hint}</p>
        <button className="location-btn" onClick={() => navigate(state.action.path)}>
          {state.action.label}
        </button>
      </div>
    </div>
  )
}
