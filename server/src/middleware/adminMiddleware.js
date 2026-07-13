const jwt = require('jsonwebtoken')
const User = require('../models/User')
const TokenBlacklist = require('../models/TokenBlacklist')

module.exports = async function adminMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })

  const token = auth.slice(7)
  if (await TokenBlacklist.has(token)) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    if (!user.is_admin) return res.status(403).json({ error: 'Forbidden' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
