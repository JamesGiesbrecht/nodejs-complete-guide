/* eslint-disable no-param-reassign */
const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  })
}

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body
  const product = new Product({ title, price, description, imageUrl, userId: req.user })
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
      })
    })
    .catch((error) => console.log(error))
}

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, price, description } = req.body

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/')
      }
      product.title = title
      product.price = price
      product.description = description
      product.imageUrl = imageUrl
      return product.save()
        .then((result) => res.redirect('/admin/products'))
    })
    .catch((error) => {
      console.log(error)
      res.redirect('/admin/products')
    })
}

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then((result) => console.log(`Destroyed product: ${productId}`))
    .catch((error) => console.log(error))
    .finally(() => res.redirect('/admin/products'))
}

exports.getProducts = (req, res) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      })
    })
    .catch((error) => console.log(error))
}
