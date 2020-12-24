/* eslint-disable security/detect-object-injection */
const fs = require('fs')
const path = require('path')
const Cart = require('./cart')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json',
)

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([])
    } else {
      cb(JSON.parse(fileContent))
    }
  })
}

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save() {
    // Temp dummy id
    getProductsFromFile((products) => {
      if (this.id) {
        // Finding the product with that ID and updating it with the current one
        const existingProductsIndex = products.findIndex((product) => product.id === this.id)
        const updatedProducts = [...products]
        updatedProducts[existingProductsIndex] = this
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err)
        })
      } else {
        this.id = Math.random().toString()
        products.push(this)
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err)
        })
      }
    })
  }

  static fetchAll(cb) { getProductsFromFile(cb) }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id)
      cb(product)
    })
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id)
      const updatedProducts = products.filter((prod) => prod.id !== id)
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price)
        }
      })
    })
  }
}
