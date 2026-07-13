const express = require('express')
const { register, login, verifyEmail, forgotPassword, validateResetToken, resetPassword, logout } = require('../controllers/authController')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/verify/:token', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.get('/reset-password/:token', validateResetToken)
router.post('/reset-password/:token', resetPassword)
router.post('/logout', logout)

module.exports = router
