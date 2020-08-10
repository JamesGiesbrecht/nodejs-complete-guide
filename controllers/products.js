const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
  })
}

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body.title)
  product.save()
  res.redirect('/')
}

exports.getAdminProducts = (req, res) => {
  res.render('admin/product-list', {
    docTitle: 'Admin Products',
    path: '/admin/admin-products',
  })
}

exports.getEditProduct = (req, res) => {
  res.render('admin/edit-product', {
    docTitle: 'Edit Product',
    path: '/admin/edit-product',
  })
}

exports.getCart = (req, res) => {
  res.render('shop/cart', {
    docTitle: 'My Cart',
    path: '/shop/cart',
  })
}

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/shop/checkout',
  })
}

exports.getShop = (req, res) => {
  res.render('shop/index', {
    docTitle: 'Shop',
    path: '/',
  })
}

exports.getProductDetail = (req, res) => {
  res.render('shop/product-detail', {
    docTitle: 'Product Detail',
    path: '/shop/product-detail',
  })
}

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      docTitle: 'Products',
      path: '/products',
    })
  })
}
