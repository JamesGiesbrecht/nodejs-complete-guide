const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getCart = (req, res) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = []
      products.forEach((product) => {
        const cartProductsData = cart.products.find((prod) => prod.id === product.id)
        if (cartProductsData) {
          cartProducts.push({ productData: product, qty: cartProductsData.qty })
        }
      })
      res.render('shop/cart', {
        pageTitle: 'My Cart',
        path: '/cart',
        products: cartProducts,
      })
    })
  })
}

exports.postCart = (req, res) => {
  const { productId } = req.body
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price)
  })
  res.redirect('/cart')
}

exports.postCartDeleteItem = (req, res) => {
  const { productId } = req.body
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price)
    res.redirect('/cart')
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
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      })
    })
    .catch((error) => console.log(error))
}

exports.getProductDetail = (req, res) => {
  res.render('shop/product-detail', {
    pageTitle: 'Product Detail',
    path: '/product-detail',
  })
}

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      })
    })
}

exports.getProduct = (req, res) => {
  const { productId } = req.params
  // Where syntax, returns an array
  // Product.findAll({
  //   where: { id: productId },
  // })
  Product.findByPk(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: `${product.title} Details`,
        path: '/products',
      })
    })
    .catch((error) => console.log(error))
}
