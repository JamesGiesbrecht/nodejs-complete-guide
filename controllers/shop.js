const Product = require('../models/product')
const Order = require('../models/order')

exports.getCart = (req, res) => {
  console.log(req.session.isAuthenticated)
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      res.render('shop/cart', {
        pageTitle: 'My Cart',
        path: '/cart',
        products: user.cart.items,
        isAuthenticated: req.session.isAuthenticated,
      })
    })
    .catch((error) => console.log(error))
}

exports.postCart = (req, res) => {
  const { productId } = req.body
  Product.findById(productId)
    .then((product) => (
      req.user.addToCart(product)
    ))
    .catch((error) => console.log(error))
    .finally(() => res.redirect('/cart'))
}

exports.postCartDeleteItem = (req, res) => {
  const { productId } = req.body

  req.user
    .removeFromCart(productId)
    .catch((error) => console.log(error))
    .finally(() => res.redirect('/cart'))
}

exports.getOrders = (req, res) => {
  Order
    .find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        pageTitle: 'My Orders',
        path: '/orders',
        orders,
        isAuthenticated: req.session.isAuthenticated,
      })
    })
    .catch((error) => console.log(error))
}

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
    isAuthenticated: req.session.isAuthenticated,
  })
}

exports.getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isAuthenticated,
      })
    })
    .catch((error) => console.log(error))
}

exports.getProductDetail = (req, res) => {
  res.render('shop/product-detail', {
    pageTitle: 'Product Detail',
    path: '/product-detail',
    isAuthenticated: req.session.isAuthenticated,
  })
}

exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isAuthenticated,
      })
    })
    .catch((error) => console.log(error))
}

exports.getProduct = (req, res) => {
  const { productId } = req.params
  Product.findById(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: `${product.title} Details`,
        path: '/products',
        isAuthenticated: req.session.isAuthenticated,
      })
    })
    .catch((error) => console.log(error))
}

exports.postOrder = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((item) => (
        { quantity: item.quantity, productData: { ...item.productId._doc } }
      ))
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products,
      })
      return order.save()
    })
    .then((result) => req.user.clearCart())
    .catch((error) => console.log(error))
    .finally(() => res.redirect('/orders'))
}
