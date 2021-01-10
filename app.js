const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const PORT = 3000

const errorController = require('./controllers/error')
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')
const shopRoutes = require('./routes/shop')
const User = require('./models/user')

app.set('view engine', 'ejs')
//  Third party middleware to parse requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// Middleware to add the user to every request
app.use((req, res, next) => {
  User.findById('5ff8cd59150eb77b38129228')
    .then((user) => {
      req.user = user
      next()
    })
    .catch((error) => console.log(error))
})

//  Importing routes to app.js, the order still matters
app.use('/admin', adminRoutes) // Filtering admin routes with a /admin in the url
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404)

mongoose.connect('mongodb+srv://nodejs-user:nodejs-password@nodejs-complete-guide.bpxav.mongodb.net/shop?retryWrites=true&w=majority')
  .then((result) => {
    User.findOne()
      .then((user) => {
        if (!user) {
          new User({
            name: 'James',
            email: 'james@test.com',
            cart: { items: [] },
          }).save()
        }
      })
    app.listen(PORT)
    // eslint-disable-next-line no-console
    console.log(`Server is live on port ${PORT}`)
  })
  .catch((error) => console.log(error))
