const mongodb = require('mongodb')
const { getDb } = require('../util/database')


class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
  }

  save() {
    const db = getDb()
    return db.collection('products')
      .insertOne(this)
      .then((result) => {
        console.log(result)
      })
      .catch((error) => console.log(error))
  }

  static fetchAll() {
    const db = getDb()
    return db.collection('products')
      .find()
      .toArray() // Only use if there is only a few docs
      .then((products) => {
        console.log(products)
        return products
      })
      .catch((error) => console.log(error))
  }

  static findById(prodId) {
    const db = getDb()
    return db.collection('products')
      .find({ _id: new mongodb.ObjectID(prodId) })
      .next() // Gets the next/last document
      .then((product) => {
        console.log(product)
        return product
      })
      .catch((error) => console.log(error))
  }
}

module.exports = Product
