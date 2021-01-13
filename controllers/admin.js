/* eslint-disable no-param-reassign */
const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isAuthenticated,
  })
}

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body
  const product = new Product({ title, price, description, imageUrl, userId: req.session.user })
  product
    .save()
    .then((result) => console.log(`Created product: ${title}`))
    .catch((error) => console.log(error))
    .finally(() => res.redirect('/admin/products'))
}

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit
  if (!editMode) return res.redirect('/')

  const { productId } = req.params

  Product.findById(productId)
    .then((product) => {
      if (!product) return res.redirect('/')
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
        isAuthenticated: req.session.isAuthenticated,
      })
    })
    .catch((error) => console.log(error))
}

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, price, description } = req.body

  Product.findById(productId)
    .then((product) => {
      product.title = title
      product.price = price
      product.description = description
      product.imageUrl = imageUrl
      return product.save()
    })
    .catch((error) => console.log(error))
    .finally(() => res.redirect('/admin/products'))
}

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body
  Product.findByIdAndRemove(productId)
    .then((result) => console.log(`Destroyed product: ${productId}`))
    .catch((error) => console.log(error))
    .finally(() => res.redirect('/admin/products'))
}

exports.getProducts = (req, res) => {
  Product.find()
    // .select('title price -_id')
    // .populate('userId')
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isAuthenticated,
      })
    })
    .catch((error) => console.log(error))
}
