const express = require('express')
const { getProfile, updateProfile, verifyEmailChange } = require('../controllers/userController')
const requireAuth = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/me', requireAuth, getProfile)
router.patch('/me', requireAuth, updateProfile)
router.get('/verify-email-change/:token', verifyEmailChange)

module.exports = router
