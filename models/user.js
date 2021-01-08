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
        console.log(result)
      })
      .catch((error) => console.log(error))
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((item) => (
      item._id.toString() === product._id.toString()
    ))

    const updatedCartItems = [...this.cart.items]

    let newQuantity = 1
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({
        _id: new mongodb.ObjectID(product._id),
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

  static findById(userId) {
    const db = getDb()
    return db.collection('users')
      .findOne({ _id: new mongodb.ObjectID(userId) })
      .then((user) => {
        console.log(user)
        return user
      })
      .catch((error) => console.log(error))
  }
}

module.exports = User
