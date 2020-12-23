const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    docTitle: 'Add Product',
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
    res.render('admin/product-list', {
      prods: products,
      docTitle: 'Admin Products',
      path: '/admin/admin-products',
    })
  })
}

exports.getEditProduct = (req, res) => {
  res.render('admin/edit-product', {
    docTitle: 'Edit Product',
    path: '/admin/edit-product',
  })
}
