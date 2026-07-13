const jwt = require('jsonwebtoken')
const TokenBlacklist = require('../models/TokenBlacklist')

module.exports = async function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' })
  }

  const token = header.split(' ')[1]
  if (await TokenBlacklist.has(token)) return res.status(401).json({ error: 'Token has been invalidated' })

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token expired or invalid' })
  }
}
