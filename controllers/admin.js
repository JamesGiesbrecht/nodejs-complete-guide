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
  Product.create({
    title,
    imageUrl,
    price,
    description,
  })
    .then((result) => console.log(`Created product: ${title}`))
    .catch((error) => console.log(error))
}

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit
  if (!editMode) return res.redirect('/')

  const { productId } = req.params
  Product.findById(productId, (product) => {
    if (!product) return res.redirect('/')

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product,
    })
  })
}

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, price, description } = req.body
  const updatedProduct = new Product(productId, title, imageUrl, description, price)
  updatedProduct.save()
  res.redirect('/admin/products')
}

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body
  Product.deleteById(productId)
  res.redirect('/admin/products')
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
