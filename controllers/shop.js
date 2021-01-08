const Product = require('../models/product')

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((cart) => cart.getProducts())
    .then((products) => {
      res.render('shop/cart', {
        pageTitle: 'My Cart',
        path: '/cart',
        products,
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
    .then((result) => {
      console.log(result)
    })
    .catch((error) => console.log(error))
    .finally(() => res.redirect('/cart'))
  // let fetchedCart
  // let newQuantity = 1
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart
  //     return cart.getProducts({ where: { id: productId } })
  //   })
  //   .then((products) => {
  //     const product = products.length > 0 && products[0]
  //     if (product) {
  //       newQuantity = product.cartItem.quantity + 1
  //       return product
  //     }
  //     return Product.findByPk(productId)
  //   })
  //   .then((updatedProduct) => {
  //     fetchedCart.addProduct(updatedProduct, { through: { quantity: newQuantity } })
  //   })
}

exports.postCartDeleteItem = (req, res) => {
  const { productId } = req.body

  req.user
    .getCart()
    .then((cart) => cart.getProducts({ where: { id: productId } }))
    .then(([product]) => product.cartItem.destroy())
    .catch((error) => console.log(error))
    .finally(() => res.redirect('/cart'))
}

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ['products'] })
    .then((orders) => {
      res.render('shop/orders', {
        pageTitle: 'My Orders',
        path: '/orders',
        orders,
      })
    })
    .catch((error) => console.log(error))
}

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  })
}

exports.getIndex = (req, res) => {
  Product.fetchAll()
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
  Product.fetchAll()
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
  Product.findById(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: `${product.title} Details`,
        path: '/products',
      })
    })
    .catch((error) => console.log(error))
}

exports.postOrder = (req, res) => {
  let cartProducts
  let fetchedCart
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then((products) => {
      cartProducts = products
      return req.user.createOrder()
    })
    .then((order) => (
      order.addProducts(cartProducts.map((product) => {
        // eslint-disable-next-line no-param-reassign
        product.orderItem = { quantity: product.cartItem.quantity }
        return product
      }))
    ))
    .then((result) => fetchedCart.setProducts(null))
    .catch((error) => console.log(error))
    .finally(() => res.redirect('/orders'))
}
