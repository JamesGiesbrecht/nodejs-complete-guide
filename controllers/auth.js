const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  }),
)

const User = require('../models/user')

exports.getLogin = (req, res) => {
  let errorMessage = req.flash('error')
  errorMessage = errorMessage.length > 0 ? errorMessage[0] : null
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage,
  })
}

exports.getSignUp = (req, res, next) => {
  let errorMessage = req.flash('error')
  errorMessage = errorMessage.length > 0 ? errorMessage[0] : null
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
    errorMessage,
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
      throw new Error('Invalid password')
    })
    .then((error) => {
      if (error) throw error
      res.redirect('/')
    })
    .catch((error) => {
      console.log(error)
      req.flash('error', error.message)
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
    .then((result) => (
      transporter.sendMail({
        to: email,
        from: process.env.SENDGRID_EMAIL,
        subject: 'Signup succeeded!',
        html: '<h1>You successfully signed up!</h1>',
      })
    ))
    .then((result) => res.redirect('/login'))
    .catch((error) => {
      console.log(error)
      req.flash('error', error.message)
      res.redirect('/signup')
    })
}

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err)
    res.redirect('/')
  })
}
