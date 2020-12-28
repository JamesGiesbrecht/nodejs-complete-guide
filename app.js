const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const sequelize = require('./util/database')

const app = express()
const PORT = 3000

app.set('view engine', 'ejs')

const errorController = require('./controllers/error')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

//  Third party middleware to parse requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

//  Importing routes to app.js, the order still matters
app.use('/admin', adminRoutes) // Filtering admin routes with a /admin in the url
app.use(shopRoutes)

app.use(errorController.get404)

sequelize.sync()
  .then((result) => {
    // console.log(result)
    app.listen(PORT)
  })
  .catch((error) => console.log(error))

// eslint-disable-next-line no-console
console.log(`Server is live on port ${PORT}`)
