const express = require('express')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const PORT = 3000
const MONGODB_URI = 'mongodb+srv://nodejs-user:nodejs-password@nodejs-complete-guide.bpxav.mongodb.net/shop'

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
})

const errorController = require('./controllers/error')
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')
const shopRoutes = require('./routes/shop')
const User = require('./models/user')

app.set('view engine', 'ejs')
//  Third party middleware to parse requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'password',
  resave: false,
  saveUninitialized: false,
  store,
}))

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
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

mongoose.connect(MONGODB_URI)
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
