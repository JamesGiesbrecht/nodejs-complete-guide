const bcrypt = require('bcryptjs')

const User = require('../models/user')

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
  })
}

exports.getSignUp = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
    // isAuthenticated: false,
  })
}

exports.postLogin = (req, res) => {
  const { email, password } = req.body
  let foundUser
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new Error('User not found')
      }
      foundUser = user
      return bcrypt.compare(password, user.password)
    })
    .then((doMatch) => {
      if (doMatch) {
        req.session.isAuthenticated = true
        req.session.user = foundUser
        return req.session.save()
      }
      throw new Error('Invalid Password')
    })
    .then((error) => {
      if (error) throw error
      res.redirect('/')
    })
    .catch((error) => {
      console.log(error)
      res.redirect('/login')
    })
}

exports.postSignUp = (req, res) => {
  const { email, password, confirmPassword } = req.body
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Error('User already exists')
      }
      return bcrypt.hash(password, 12)
    })
    .then((hashedPassword) => {
      const newUser = new User({
        email,
        password: hashedPassword,
        cart: { items: [] },
      })
      return newUser.save()
    })
    .then((result) => res.redirect('/login'))
    .catch((error) => {
      console.log(error)
      res.redirect('/signup')
    })
}

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err)
    res.redirect('/')
  })
}
