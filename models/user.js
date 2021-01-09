const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    }],
  },
})

function addToCart(product) {
  const cartProductIndex = this.cart.items.findIndex((item) => (
    item.productId.toString() === product._id.toString()
  ))

  const updatedCartItems = [...this.cart.items]

  let newQuantity = 1
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1
    updatedCartItems[cartProductIndex].quantity = newQuantity
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1,
    })
  }

  this.cart.items = updatedCartItems

  return this.save()
}

function removeFromCart(productId) {
  const updatedCartItems = this.cart.items.filter((item) => (
    item.productId.toString() !== productId.toString()
  ))

  this.cart.items = updatedCartItems
  return this.save()
}

function clearCart() {
  this.cart = { items: [] }
  return this.save()
}

userSchema.methods.addToCart = addToCart
userSchema.methods.removeFromCart = removeFromCart
userSchema.methods.clearCart = clearCart
module.exports = mongoose.model('User', userSchema)

/*
const mongodb = require('mongodb')
const { getDb } = require('../util/database')

class User {
  constructor(username, email, cart, id) {
    this.name = username
    this.email = email
    this.cart = cart
    this._id = id
  }

  save() {
    const db = getDb()
    return db.collection('users')
      .insertOne(this)
      .then((result) => {
        // console.log(result)
      })
      .catch((error) => console.log(error))
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((item) => (
      item.productId.toString() === product._id.toString()
    ))

    const updatedCartItems = [...this.cart.items]

    let newQuantity = 1
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectID(product._id),
        quantity: 1,
      })
    }

    const updatedCart = { items: updatedCartItems }
    const db = getDb()
    return db.collection('users')
      .updateOne(
        { _id: new mongodb.ObjectID(this._id) },
        { $set: { cart: updatedCart } },
      )
  }

  getCart() {
    const db = getDb()
    const productIds = this.cart.items.map((item) => item.productId)
    return db.collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => (
        products.map((product) => {
          const productQuantity = this.cart.items.find((item) => (
            item.productId.toString() === product._id.toString()
          )).quantity

          return {
            ...product,
            quantity: productQuantity,
          }
        })
      ))
      .catch((error) => console.log(error))
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter((item) => (
      item.productId.toString() !== productId
    ))

    const db = getDb()
    return db.collection('users')
      .updateOne(
        { _id: new mongodb.ObjectID(this._id) },
        { $set: { cart: { items: updatedCartItems } } },
      )
  }

  addOrder() {
    const db = getDb()
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectID(this._id),
            name: this.name,
          },
        }
        return db.collection('orders').insertOne(order)
      })
      .then((result) => {
        this.cart = { items: [] }
        return db.collection('users')
          .updateOne(
            { _id: new mongodb.ObjectID(this._id) },
            { $set: { cart: this.cart } },
          )
      })
      .catch((error) => console.log(error))
  }

  getOrders() {
    const db = getDb()
    return db.collection('orders')
      .find({ 'user._id': new mongodb.ObjectID(this._id) })
      .toArray()
      .catch((error) => console.log(error))
  }

  static findById(userId) {
    const db = getDb()
    return db.collection('users')
      .findOne({ _id: new mongodb.ObjectID(userId) })
      .then((user) => user)
      .catch((error) => console.log(error))
  }
}

module.exports = User
*/
