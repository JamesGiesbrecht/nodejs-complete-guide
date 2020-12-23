const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  })
}

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body
  const product = new Product(title, imageUrl, description, price)
  product.save()
  res.redirect('/')
}

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    })
  })
}

exports.getEditProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
  })
}
