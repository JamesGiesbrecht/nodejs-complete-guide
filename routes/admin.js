const express = require('express')

const productsController = require('../controllers/products')

const router = express.Router()

router.get('/add-product', productsController.getAddProduct)

router.post('/add-product', productsController.postAddProduct)

router.get('/admin-products', productsController.getAdminProducts)

module.exports = router
