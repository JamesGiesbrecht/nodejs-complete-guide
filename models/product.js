const mongoose = require('mongoose')

const { Schema } = mongoose

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Products', productSchema)

/*
const mongodb = require('mongodb')
const { getDb } = require('../util/database')


class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this._id = id ? new mongodb.ObjectID(id) : null
    this.userId = userId
  }

  save() {
    const db = getDb()
    let dbOp
    if (this._id) {
      dbOp = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this })
    } else {
      dbOp = db.collection('products').insertOne(this)
    }
    return dbOp
      .then((result) => {
        // console.log(result)
      })
      .catch((error) => console.log(error))
  }

  static fetchAll() {
    const db = getDb()
    return db.collection('products')
      .find()
      .toArray() // Only use if there is only a few docs
      .then((products) => {
        // console.log(products)
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
        // console.log(product)
        return product
      })
      .catch((error) => console.log(error))
  }

  static deleteById(prodId) {
    const db = getDb()
    return db.collection('products')
      .deleteOne({ _id: new mongodb.ObjectID(prodId) })
      .then((product) => {
        console.log('Deleted', product.title)
      })
      .catch((error) => console.log(error))
  }
}

module.exports = Product
*/
