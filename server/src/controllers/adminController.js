const bcrypt = require('bcrypt')
const { validEmail } = require('../utils/validate')
const User = require('../models/User')
const Favorite = require('../models/Favorite')

async function getUsers(req, res) {
  res.json(await User.getAll())
}

async function getUser(req, res) {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
}

async function updateUser(req, res) {
  const { email, password, is_verified, is_admin } = req.body
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  const fields = {}
  if (email !== undefined) {
    if (!email || !validEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address.' })
    }
    fields.email = email
  }
  if (password) fields.password_hash = await bcrypt.hash(password, 10)
  if (is_verified !== undefined) fields.is_verified = is_verified ? 1 : 0
  if (is_admin !== undefined) fields.is_admin = is_admin ? 1 : 0

  if (Object.keys(fields).length === 0) return res.status(400).json({ error: 'No fields to update' })

  await User.updateById(req.params.id, fields)
  res.json(await User.findById(req.params.id))
}

async function deleteUser(req, res) {
  if (Number(req.params.id) === req.user.id) return res.status(403).json({ error: 'You cannot delete your own account' })
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  await Favorite.deleteAllByUser(req.params.id)
  await User.deleteById(req.params.id)
  res.status(204).send()
}

module.exports = { getUsers, getUser, updateUser, deleteUser }
