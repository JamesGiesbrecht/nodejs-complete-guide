const User = require('../models/user')

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session.isAuthenticated,
  })
}

exports.getSignUp = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
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

exports.postSignUp = (req, res) => {
  const { email, password, confirmPassword } = req.body
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.redirect('/signup')
      }
      const newUser = new User({
        email,
        password,
        cart: { items: [] },
      })
      return newUser.save()
    })
    .then((result) => res.redirect('/login'))
    .catch((error) => console.log(error))
}

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err)
    res.redirect('/')
  })
}
