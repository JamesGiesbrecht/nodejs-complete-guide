const express = require('express')
const path = require('path')

const bodyParser = require('body-parser')

const app = express()
const PORT = 3000

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

//  Third party middleware to parse requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

//  Importing routes to app.js, the order still matters
app.use('/admin', adminRoutes) // Filtering admin routes with a /admin in the url
app.use(shopRoutes)

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(PORT)
// eslint-disable-next-line no-console
console.log(`Server is live on port ${PORT}`)
