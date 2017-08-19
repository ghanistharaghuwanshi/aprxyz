const passport = require('passport')

const authenticationMiddleware = require('./middleware')

function initPassport () {
  passport.authenticationMiddleware = authenticationMiddleware;
}

module.exports = initPassport;

