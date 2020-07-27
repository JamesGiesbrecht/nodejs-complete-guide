const express = require('express')
const path = require('path')

const rootDir = require('../util/path')

const router = express.Router()

router.get('/product', (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'product.html'))
})

router.post('/product', (req, res) => {
  console.log(req.body)
  res.redirect('/')
})

exports.routes = router
