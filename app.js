const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const sequelize = require('./util/database')

const app = express()
const PORT = 3000

const Product = require('./models/product')
const User = require('./models/user')

const errorController = require('./controllers/error')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.set('view engine', 'ejs')
//  Third party middleware to parse requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// Middleware to add the user to every request
app.use((req, res, next) => {
  User.findByPk(1)
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

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product) // Optional

sequelize
  // .sync({ force: true }) // Might not want to use this in prod
  .sync()
  .then((result) => User.findByPk(1))
  .then((user) => {
    if (!user) {
      return User.create({ name: 'James', email: 'test@test.com' })
    }
    return Promise.resolve(user)
  })
  .then((user) => app.listen(PORT))
  .catch((error) => console.log(error))

// eslint-disable-next-line no-console
console.log(`Server is live on port ${PORT}`)
