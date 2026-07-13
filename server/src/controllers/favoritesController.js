const Favorite = require('../models/Favorite')

async function getFavorites(req, res) {
  const favorites = await Favorite.getAllByUser(req.user.id)
  res.json(favorites)
}

async function addFavorite(req, res) {
  const { location, country, latitude, longitude } = req.body
  if (!location || latitude == null || longitude == null) {
    return res.status(400).json({ error: 'location, latitude and longitude are required' })
  }

  const result = await Favorite.create(req.user.id, location, country, latitude, longitude)
  res.status(201).json({ id: Number(result.lastInsertRowid), location, country, latitude, longitude })
}

async function removeFavorite(req, res) {
  const result = await Favorite.delete(req.params.id, req.user.id)
  if (result.rowsAffected === 0) {
    return res.status(404).json({ error: 'Favorite not found' })
  }
  res.status(204).send()
}

module.exports = { getFavorites, addFavorite, removeFavorite }
