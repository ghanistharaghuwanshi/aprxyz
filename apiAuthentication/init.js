const passport = require('passport')

const apiAuthentication = require('./apiAuthentication')

function initApiPassport () {
  passport.apiAuthentication = apiAuthentication;
}

module.exports = initApiPassport;

