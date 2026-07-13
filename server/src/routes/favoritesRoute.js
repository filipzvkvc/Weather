const express = require('express')
const requireAuth = require('../middleware/authMiddleware')
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoritesController')

const router = express.Router()

router.use(requireAuth)

router.get('/', getFavorites)
router.post('/', addFavorite)
router.delete('/:id', removeFavorite)

module.exports = router