const express = require('express')
const adminMiddleware = require('../middleware/adminMiddleware')
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/adminController')

const router = express.Router()
router.use(adminMiddleware)

router.get('/users', getUsers)
router.get('/users/:id', getUser)
router.patch('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

module.exports = router
