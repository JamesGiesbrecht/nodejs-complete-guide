/* eslint-disable security/detect-object-injection */
const fs = require('fs')
const path = require('path')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json',
)

module.exports = class Cart {
  constructor() {
    this.products = []
    this.totalPrice = 0
  }

  static addProduct(id, price) {
    // Fetch prev cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 }
      if (!err) {
        cart = JSON.parse(fileContent)
      }

      // Check if cart has product already
      const existingProductIndex = cart.products.findIndex((prod) => prod.id === id)
      const existingProduct = cart.products[existingProductIndex]

      // Add new product/increase quantity
      let updatedProduct
      if (existingProduct) {
        updatedProduct = { ...existingProduct }
        updatedProduct.qty += 1
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = { id, qty: 1 }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice += +price
      fs.writeFile(p, JSON.stringify(cart), (error) => console.log(error))
    })
  }

  static deleteProduct(id, price) {
    fs.readFile(p, (err, fileContent) => {
      if (err) return
      const cart = JSON.parse(fileContent)
      const updatedCart = { ...cart }
      const product = updatedCart.products.find((prod) => prod.id === id)
      updatedCart.products = updatedCart.products.filter((prod) => prod.id !== id)
      updatedCart.totalPrice -= (product.qty * price)
      fs.writeFile(p, JSON.stringify(updatedCart), (error) => console.log(error))
    })
  }
}
