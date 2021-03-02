const crypto = require('crypto')

const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator/check')

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
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render(
      res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign Up',
        errorMessage: errors.array()[0].msg,
      })
    )
  }
  const { email, password, confirmPassword } = req.body
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Error('User already exists')
      }
      if (!password) {
        throw new Error('Password must not be empty')
      // eslint-disable-next-line security/detect-possible-timing-attacks
      } else if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
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

exports.getReset = (req, res) => {
  let errorMessage = req.flash('error')
  errorMessage = errorMessage.length > 0 ? errorMessage[0] : null
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
    errorMessage,
  })
}

exports.postReset = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex')
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No Account with that email found.')
          return res.redirect('/reset')
        }
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000
        return user.save()
      })
      .then((result) => {
        transporter.sendMail({
          to: req.body.email,
          from: process.env.SENDGRID_EMAIL,
          subject: 'Password Reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
          `,
        })
      })
      .then((result) => res.redirect('/'))
      .catch((error) => {
        console.log(error)
      })
  })
}

exports.getNewPassword = (req, res) => {
  const { token } = req.params
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let errorMessage = req.flash('error')
      errorMessage = errorMessage.length > 0 ? errorMessage[0] : null
      res.render('auth/new-password', {
        pageTitle: 'New Password',
        path: '/reset',
        errorMessage,
        token,
        userId: user._id.toString(),
      })
    })
    .catch((error) => console.log(error))
}

exports.postNewPassword = (req, res) => {
  const { password, userId, token } = req.body
  let resetUser

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
    .then((user) => {
      resetUser = user
      return bcrypt.hash(password, 12)
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword
      resetUser.resetToken = null
      resetUser.resetTokenExpiration = null
      resetUser.save()
    })
    .then((result) => {
      res.redirect('/login')
    })
    .catch((error) => console.log(error))
}
