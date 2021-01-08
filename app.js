const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const { mongoConnect } = require('./util/database')

const app = express()
const PORT = 3000

const errorController = require('./controllers/error')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const User = require('./models/user')

app.set('view engine', 'ejs')
//  Third party middleware to parse requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// Middleware to add the user to every request
app.use((req, res, next) => {
  User.findById('5ff79f6268d9dd7c15f6ac39')
    .then((user) => {
      req.user = user
      next()
    })
    .catch((error) => console.log(error))
})

//  Importing routes to app.js, the order still matters
app.use('/admin', adminRoutes) // Filtering admin routes with a /admin in the url
app.use(shopRoutes)

app.use(errorController.get404)

mongoConnect(() => {
  app.listen(PORT)
  // eslint-disable-next-line no-console
  console.log(`Server is live on port ${PORT}`)
})
