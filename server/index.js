require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || '*' }))
app.use(express.json())

app.get('/', (req, res) => {res.send('Server is running')})
app.use('/api/auth', require('./src/routes/authRoute'))
app.use('/api/user', require('./src/routes/userRoute'))
app.use('/api/favorites', require('./src/routes/favoritesRoute'))
app.use('/api/admin', require('./src/routes/adminRoute'))

// if (require.main === module) {
//   app.listen(port, () => console.log(`Server running on port ${port}`))
// }

module.exports = app
