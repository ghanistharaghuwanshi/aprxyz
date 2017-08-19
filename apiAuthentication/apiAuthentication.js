function apiAuthentication (pool) {
  return function (req, res, next) {
    var token = '';
    var client_id = '';
    if(req.query.hasOwnProperty('token'))
    {
     token = req.query.token;
    }
    else if(req.body.hasOwnProperty('token'))
    {
     token = req.body.token;        
    }
    if(req.query.hasOwnProperty('client_id'))
    {
     client_id = req.query.client_id;
    }
    else if(req.body.hasOwnProperty('client_id'))
    {
     client_id = req.body.client_id;        
    }  
    
    if(token=='' || client_id=='')
        {
         
          req.user = {};
          req.user.status ='101';    
          req.user.user  = 'Required Parameter Missing!';
          req.user.value = token;
          req.user.client_id = client_id;
          next();
        
        }
    
    
    var queryString = "SELECT * from code where value='"+token+"' and client_id='"+client_id+"'";
   
    var result = {}; 
      pool.query(queryString, function(err, rows, fields) {
        if (err)
        {
          req.user = {};
          req.user.status ='100';    
          req.user.message  = 'Unable to connect with server!';
          req.user.value = token;
          req.user.client_id = client_id;
          next();
        }
        else
        {   if(rows.length>0)
            {
              user = rows[0];
              var Q = 'update code set status=0 where value="'+token+'" and client_id="'+client_id+'"';
              pool.query(Q, function(err, rowsp){
                if (err) {
                  console.log(err);
                }else{
                  req.user = {};
                  req.user = user;
                  next();
                }
              });
            }
            else
            {
              req.user = {};
              req.user.status ='103';    
              req.user.user  = 'User Access not allowed for current client!';
              req.user.value = token;
              req.user.client_id = client_id;    
              next();    
            }
        }
      });
      
      
   
  }
}

module.exports = apiAuthentication