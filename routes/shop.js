const express = require('express')

const router = express.Router()
const productsController = require('../controllers/products')

router.get('/', productsController.getShop)

router.get('/products', productsController.getProducts)

router.get('/cart', productsController.getCart)

module.exports = router
