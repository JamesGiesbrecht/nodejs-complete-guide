const User = require('../models/user')

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session.isAuthenticated,
  })
}

exports.postLogin = (req, res) => {
  User.findById('5ff8cd59150eb77b38129228')
    .then((user) => {
      req.session.isAuthenticated = true
      req.session.user = user
      res.redirect('/')
    })
    .catch((error) => console.log(error))
}

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
}
