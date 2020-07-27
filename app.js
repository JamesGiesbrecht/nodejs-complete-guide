const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const PORT = 3000

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

//  Third party middleware to parse requests
app.use(bodyParser.urlencoded({ extended: false }))

//  Importing routes to app.js, the order still matters
app.use(adminRoutes)
app.use(shopRoutes)

app.use((req, res) => {
  res.status(404).send('<h1>404: Page not found</h1>')
})

app.listen(PORT)
// eslint-disable-next-line no-console
console.log(`Server is live on port ${PORT}`)
