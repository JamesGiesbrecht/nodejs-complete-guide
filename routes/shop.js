const express = require('express')
const path = require('path')

const rootDir = require('../util/path')
const adminData = require('./admin')

const router = express.Router()

router.get('/', (req, res) => {
  console.log(adminData.products)
  res.render('shop')
})

exports.routes = router
