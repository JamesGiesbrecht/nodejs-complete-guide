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
  // DB entry added in middleware
  req.user.createProduct({
    title,
    imageUrl,
    price,
    description,
  })
    .then((result) => console.log(`Created product: ${title}`))
    .catch((error) => console.log(error))
    .finally(() => res.redirect('/admin/products'))
}

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit
  if (!editMode) return res.redirect('/')

  const { productId } = req.params
  Product.findByPk(productId)
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
  Product.findByPk(productId)
    .then((product) => {
      product.title = title
      product.imageUrl = imageUrl
      product.price = price
      product.description = description
      return product.save()
    })
    .then((result) => {
      // product.save then
      console.log(`Updated Product: ${title}`)
    })
    .catch((error) => console.log(error))
    .finally(() => res.redirect('/admin/products'))
}

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body
  Product.findByPk(productId)
    .then((product) => product.destroy())
    .then((result) => console.log(`Destroyed product: ${productId}`))
    .catch((error) => console.log(error))
    .finally(() => res.redirect('/admin/products'))
}

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      })
    })
    .catch((error) => console.log(error))
}
