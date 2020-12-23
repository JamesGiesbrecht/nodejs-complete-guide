const Product = require('../models/product')

exports.getCart = (req, res) => {
  res.render('shop/cart', {
    pageTitle: 'My Cart',
    path: '/cart',
  })
}

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    pageTitle: 'My Orders',
    path: '/orders',
  })
}

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  })
}

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    })
  })
}

exports.getProductDetail = (req, res) => {
  res.render('shop/product-detail', {
    pageTitle: 'Product Detail',
    path: '/product-detail',
  })
}

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    })
  })
}
