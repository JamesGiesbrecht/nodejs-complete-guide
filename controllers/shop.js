const Product = require('../models/product')

exports.getCart = (req, res) => {
  res.render('shop/cart', {
    docTitle: 'My Cart',
    path: '/cart',
  })
}

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/checkout',
  })
}

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      docTitle: 'Shop',
      path: '/',
    })
  })
}

exports.getProductDetail = (req, res) => {
  res.render('shop/product-detail', {
    docTitle: 'Product Detail',
    path: '/product-detail',
  })
}

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      docTitle: 'All Products',
      path: '/products',
    })
  })
}
