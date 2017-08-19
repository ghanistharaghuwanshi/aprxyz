function authenticationMiddleware () {
  return function (req, res, next) {
    var vendor_id = '';
    if(req.query.hasOwnProperty('vendor_id'))
    {
     vendor_id = req.query.vendor_id;        
    }
    else if(req.body.hasOwnProperty('vendor_id'))
    {
     vendor_id = req.body.vendor_id;        
    }
    
    var sess =  req.session;
    
    
    if (vendor_id==sess.userID) {
      return next()
    }
    res.redirect('/');
  }
}

module.exports = authenticationMiddleware