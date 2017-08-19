const passport = require('passport')

const isoauthAuthenticated = require('./oauthAuthenticated'); 

function initoauthCheck(){
   passport.isoauthAuthenticated = isoauthAuthenticated; 
}

module.exports = initoauthCheck;