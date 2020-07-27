const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const PORT = 3000

//  Third party middleware to parse requests
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/add-product', (req, res, next) => {
  res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></input></form>')
})

app.post('/product', (req, res) => {
  console.log(req.body)
  res.redirect('/')
})

app.use((req, res, next) => {
  res.send('<h1>Hello from Express</h1>')
})

app.listen(PORT)

// eslint-disable-next-line no-console
console.log(`Server is live on port ${PORT}`)
