const User = require('../models/user')

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session.isAuthenticated,
  })
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
  })
}

exports.postLogin = (req, res) => {
  User.findById('5ff8cd59150eb77b38129228')
    .then((user) => {
      req.session.isAuthenticated = true
      req.session.user = user
      req.session.save()
    })
    .catch((error) => console.log(error))
    .finally(() => res.redirect('/'))
}

exports.postSignup = (req, res) => {}

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err)
    res.redirect('/')
  })
}
