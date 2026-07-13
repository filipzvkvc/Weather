const db = require('../config/db')

const User = {
  async findByEmail(email) {
    const res = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] })
    return res.rows[0] || null
  },

  async findByIdFull(id) {
    const res = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [id] })
    return res.rows[0] || null
  },

  async findById(id) {
    const res = await db.execute({
      sql: 'SELECT id, email, is_admin, is_verified, created_at FROM users WHERE id = ?',
      args: [id],
    })
    return res.rows[0] || null
  },

  async getAll() {
    const res = await db.execute(
      'SELECT id, email, is_verified, is_admin, created_at FROM users ORDER BY created_at DESC'
    )
    return res.rows
  },

  async updateById(id, fields) {
    const sets = Object.keys(fields).map(k => `${k} = ?`).join(', ')
    const args = [...Object.values(fields), id]
    return await db.execute({ sql: `UPDATE users SET ${sets} WHERE id = ?`, args })
  },

  async deleteById(id) {
    return await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [id] })
  },

  async create(email, password_hash, verification_token, verification_token_expires_at) {
    return await db.execute({
      sql: 'INSERT INTO users (email, password_hash, verification_token, verification_token_expires_at) VALUES (?, ?, ?, ?)',
      args: [email, password_hash, verification_token, verification_token_expires_at],
    })
  },

  async findByVerificationToken(token) {
    const res = await db.execute({ sql: 'SELECT * FROM users WHERE verification_token = ?', args: [token] })
    return res.rows[0] || null
  },

  async verify(id) {
    return await db.execute({
      sql: 'UPDATE users SET is_verified = 1, verification_token = NULL, verification_token_expires_at = NULL WHERE id = ?',
      args: [id],
    })
  },

  async updateVerificationToken(id, token, expires_at) {
    return await db.execute({
      sql: 'UPDATE users SET verification_token = ?, verification_token_expires_at = ? WHERE id = ?',
      args: [token, expires_at, id],
    })
  },

  async findByResetToken(token) {
    const res = await db.execute({ sql: 'SELECT * FROM users WHERE reset_password_token = ?', args: [token] })
    return res.rows[0] || null
  },

  async setResetToken(id, token, expires_at) {
    return await db.execute({
      sql: 'UPDATE users SET reset_password_token = ?, reset_password_token_expires_at = ? WHERE id = ?',
      args: [token, expires_at, id],
    })
  },

  async clearResetToken(id, password_hash) {
    return await db.execute({
      sql: 'UPDATE users SET password_hash = ?, reset_password_token = NULL, reset_password_token_expires_at = NULL WHERE id = ?',
      args: [password_hash, id],
    })
  },

  async setEmailChangeToken(id, pendingEmail, token, expiresAt) {
    return await db.execute({
      sql: 'UPDATE users SET pending_email = ?, email_change_token = ?, email_change_token_expires_at = ? WHERE id = ?',
      args: [pendingEmail, token, expiresAt, id],
    })
  },

  async findByEmailChangeToken(token) {
    const res = await db.execute({ sql: 'SELECT * FROM users WHERE email_change_token = ?', args: [token] })
    return res.rows[0] || null
  },

  async applyEmailChange(id) {
    return await db.execute({
      sql: 'UPDATE users SET email = pending_email, pending_email = NULL, email_change_token = NULL, email_change_token_expires_at = NULL WHERE id = ?',
      args: [id],
    })
  },
}

module.exports = User
