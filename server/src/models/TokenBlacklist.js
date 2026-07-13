const db = require('../config/db')
const { JWT_TTL_MS } = require('../constants/auth')

const TokenBlacklist = {
  async add(token) {
    const expiresAt = new Date(Date.now() + JWT_TTL_MS).toISOString()
    await db.execute({
      sql: 'INSERT OR IGNORE INTO token_blacklist (token, expires_at) VALUES (?, ?)',
      args: [token, expiresAt],
    })
  },

  async has(token) {
    const res = await db.execute({
      sql: "SELECT 1 FROM token_blacklist WHERE token = ? AND expires_at > datetime('now')",
      args: [token],
    })
    return res.rows.length > 0
  },
}

module.exports = TokenBlacklist
