const express = require('express')

const app = express()
const PORT = 3000

app.use((req, res, next) => {
  console.log('This always runs')
  next()
})

app.use('/add-product', (req, res, next) => {
  res.send('<h1>Product Added</h1>')
})

app.use((req, res, next) => {
  res.send('<h1>Hello from Express</h1>')
})

app.listen(PORT)

// eslint-disable-next-line no-console
console.log(`Server is live on port ${PORT}`)
