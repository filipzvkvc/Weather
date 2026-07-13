const db = require('../config/db')

const Favorite = {
  async getAllByUser(userId) {
    const res = await db.execute({ sql: 'SELECT * FROM favorites WHERE user_id = ?', args: [userId] })
    return res.rows
  },

  async create(userId, location, country, latitude, longitude) {
    return await db.execute({
      sql: 'INSERT INTO favorites (user_id, location, country, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
      args: [userId, location, country, latitude, longitude],
    })
  },

  async delete(id, userId) {
    return await db.execute({ sql: 'DELETE FROM favorites WHERE id = ? AND user_id = ?', args: [id, userId] })
  },

  async deleteAllByUser(userId) {
    return await db.execute({ sql: 'DELETE FROM favorites WHERE user_id = ?', args: [userId] })
  },
}

module.exports = Favorite
