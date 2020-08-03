const express = require('express')

const router = express.Router()

const products = []

router.get('/product', (req, res) => {
  res.render('product', {
    docTitle: 'Add Product',
    path: '/admin/product',
  })
})

router.post('/product', (req, res) => {
  products.push({ title: req.body.title })
  res.redirect('/')
})

exports.routes = router
exports.products = products
