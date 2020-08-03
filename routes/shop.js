const express = require('express')
const path = require('path')

const rootDir = require('../util/path')
const adminData = require('./admin')

const router = express.Router()

router.get('/', (req, res) => {
  const { products } = adminData
  res.render('shop', {
    prods: products, docTitle: 'Shop', path: '/', hasProducts: products.length > 0
  })
})

exports.routes = router
