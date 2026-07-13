const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { validEmail } = require('../utils/validate')
const User = require('../models/User')
const { sendEmailChangeVerification } = require('../services/emailService')

async function getProfile(req, res) {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
}

async function updateProfile(req, res) {
  try {
    const { email, currentPassword, newPassword } = req.body

    if (email !== undefined) {
      if (!email || !validEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address.' })
      }
      if (!currentPassword) return res.status(400).json({ error: 'Current password is required.' })

      const full = await User.findByIdFull(req.user.id)
      const valid = await bcrypt.compare(currentPassword, full.password_hash)
      if (!valid) return res.status(400).json({ error: 'Current password is incorrect.' })

      if (email === full.email) return res.status(400).json({ error: 'That is already your email address.' })

      const existing = await User.findByEmail(email)
      if (existing) return res.status(409).json({ error: 'Email already in use.' })

      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
      await User.setEmailChangeToken(full.id, email, token, expiresAt)

      await sendEmailChangeVerification(email, token)
      return res.json({ message: `Verification email sent to ${email}. Click the link to confirm the change.` })
    }

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ error: 'Current password is required.' })
      if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' })

      const full = await User.findByIdFull(req.user.id)
      const valid = await bcrypt.compare(currentPassword, full.password_hash)
      if (!valid) return res.status(400).json({ error: 'Current password is incorrect.' })

      const same = await bcrypt.compare(newPassword, full.password_hash)
      if (same) return res.status(400).json({ error: 'New password must be different from your current password.' })

      await User.updateById(req.user.id, { password_hash: await bcrypt.hash(newPassword, 10) })
      return res.json({ message: 'Password updated.' })
    }

    res.status(400).json({ error: 'No fields to update.' })
  } catch {
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

async function verifyEmailChange(req, res) {
  const client = process.env.CLIENT_URL
  const user = await User.findByEmailChangeToken(req.params.token)

  if (!user) {
    return res.redirect(`${client}/verify-result?status=email-invalid`)
  }

  if (new Date(user.email_change_token_expires_at) < new Date()) {
    return res.redirect(`${client}/verify-result?status=email-expired`)
  }

  const existing = await User.findByEmail(user.pending_email)
  if (existing && existing.id !== user.id) {
    return res.redirect(`${client}/verify-result?status=email-taken`)
  }

  await User.applyEmailChange(user.id)
  res.redirect(`${client}/verify-result?status=email-changed`)
}

module.exports = { getProfile, updateProfile, verifyEmailChange }
