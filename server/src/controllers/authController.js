const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { validEmail } = require('../utils/validate')
const User = require('../models/User')
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService')
const TokenBlacklist = require('../models/TokenBlacklist')

const { TOKEN_TTL_MS } = require('../constants/auth')

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

function tokenExpiry() {
  return new Date(Date.now() + TOKEN_TTL_MS).toISOString()
}

function isExpired(expires_at) {
  return !expires_at || new Date(expires_at) < new Date()
}

async function register(req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  if (!validEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address.' })
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' })
  }

  if (await User.findByEmail(email)) {
    return res.status(409).json({ error: 'Email already in use' })
  }

  const password_hash = await bcrypt.hash(password, 10)
  const token = generateToken()
  await User.create(email, password_hash, token, tokenExpiry())

  try {
    await sendVerificationEmail(email, token)
  } catch {
    return res.status(500).json({ error: 'Failed to send verification email. Please try again.' })
  }

  res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' })
}

async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const user = await User.findByEmail(email)
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  if (!user.is_verified) {
    if (isExpired(user.verification_token_expires_at)) {
      const token = generateToken()
      await User.updateVerificationToken(user.id, token, tokenExpiry())
      try {
        await sendVerificationEmail(user.email, token)
      } catch {
        return res.status(500).json({ error: 'Failed to send verification email. Please try again.' })
      }
      return res.status(403).json({
        error: 'Your verification link had expired. \nWe sent a new one — please check your email.',
      })
    }

    return res.status(403).json({
      error: 'Please verify your email before logging in. \nCheck your inbox for the verification link.',
    })
  }

  res.json({ token: signToken(user), user: { id: user.id, email: user.email, is_admin: user.is_admin } })
}

async function verifyEmail(req, res) {
  const client = process.env.CLIENT_URL
  const user = await User.findByVerificationToken(req.params.token)

  if (!user) {
    return res.redirect(`${client}/verify-result?status=invalid`)
  }

  if (isExpired(user.verification_token_expires_at)) {
    return res.redirect(`${client}/verify-result?status=expired`)
  }

  await User.verify(user.id)
  res.redirect(`${client}/verify-result?status=success`)
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })
    if (!validEmail(email)) return res.status(400).json({ error: 'Invalid email address.' })

    const user = await User.findByEmail(email)
    if (!user) return res.status(404).json({ error: 'No account found with that email.' })

    const token = generateToken()
    const expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    await User.setResetToken(user.id, token, expires_at)

    await sendPasswordResetEmail(email, token)
    res.json({ message: 'If that email is registered, a reset link has been sent.' })
  } catch {
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

async function validateResetToken(req, res) {
  try {
    const { token } = req.params
    const user = await User.findByResetToken(token)
    if (!user) return res.status(400).json({ error: 'Invalid or expired reset link.' })
    if (isExpired(user.reset_password_token_expires_at)) return res.status(400).json({ error: 'This reset link has expired.' })
    res.json({ valid: true })
  } catch {
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

async function resetPassword(req, res) {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!password) return res.status(400).json({ error: 'Password is required' })
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' })

    const user = await User.findByResetToken(token)
    if (!user) return res.status(400).json({ error: 'Invalid or expired reset link.' })
    if (isExpired(user.reset_password_token_expires_at)) return res.status(400).json({ error: 'This reset link has expired.' })

    const same = await bcrypt.compare(password, user.password_hash)
    if (same) return res.status(400).json({ error: 'New password must be different from your current password.' })

    const password_hash = await bcrypt.hash(password, 10)
    await User.clearResetToken(user.id, password_hash)

    res.json({ message: 'Password reset successfully.' })
  } catch {
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

async function logout(req, res) {
  const auth = req.headers.authorization
  if (auth?.startsWith('Bearer ')) await TokenBlacklist.add(auth.slice(7))
  res.status(204).send()
}

module.exports = { register, login, verifyEmail, forgotPassword, validateResetToken, resetPassword, logout }
