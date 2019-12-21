module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');

  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  },
  ensureAuthenticatedApi: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(400).json({ message: 'Please login to use that api' });
  }
};
