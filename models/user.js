const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
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
