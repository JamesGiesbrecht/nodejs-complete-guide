const express = require('express')

const router = express.Router()

router.get('/product', (req, res) => {
  res.send('<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></input></form>')
})

router.post('/product', (req, res) => {
  console.log(req.body)
  res.redirect('/')
})

module.exports = router
