exports.postClient = function(pool) {
  
  return function(req,res){
      var client = {};
      client.client_id = req.body.client_id;
      client.vendor_id = req.body.vendor_id;
      client.oauth_key = req.body.oauth_key;
      client.redirecturi = req.body.redirecturi;
      client.logout_url=  req.body.logout_url;
      client.status = req.body.status;
      if(client.client_id=='')
      {
       var result = {};
       result.error= 
       result.status = 0;
       result.status.message = 'Client id is mandatory, something went wrong. please contact administrator';
       res.setHeader('Content-Type', 'application/json');
       res.send(JSON.stringify(result));      
       }
      var result = {};
      var queryString = 'update clients SET client_id="'+client.client_id+'", vendor_id="'+client.vendor_id+'", logout_url="'+client.logout_url+'",oauth_key="'+client.oauth_key+'",redirecturi="'+client.redirecturi+'", status="'+client.status+'" where vendor_id="'+client.vendor_id+'"';
      console.log(queryString); 
      pool.query(queryString, function(err, rows, fields) {
          if (err)
            {
              result = {};
              result.error= err;
              result.success ={};
              result.success = 0;
              result.success.message = 'API Access updation having some error.Please try after some-time';    
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify(result));      
              console.log(err);    

            }
            else
            {
              result = {};
              result.success = {};
              result.success.status='1';
              result.success.message='API Access updated successfully.';
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify(result));     
            }
    
          }); 
     
      };
};
exports.genOAuthKey = function(crypto){
    
    return function(req,res){
         var algorithm = 'aes-256-ctr';
         var password = 'K8gsd97'; 
         var dateStr = new Date().toString(); 
         var text2 = (Math.floor(Math.random()*90000) + 10000) - (Math.floor(Math.random()*300) + 10000) ;
         var cipher = crypto.createCipher(algorithm,password);
         var crypted2 = cipher.update(String(text2),'utf8','hex')
               crypted2 += cipher.final('hex');
          var result = {};
          result.ouath_key = crypted2;
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));  
    }
}
exports.getClients = function(pool,crypto){
    
  return function(req, res) {
      
    var queryString = 'SELECT * from clients where vendor_id='+req.query.vendor_id;
    var result = {}; 
      pool.query(queryString, function(err, rows, fields) {
        if (err)
        {
          result.error= err;

        }
        else
        {
            if(rows=='')
            {
              var algorithm = 'aes-256-ctr';
              var password = 'K8gsd97'; 
              var dateStr = new Date().toString();
                
              var text = req.query.vendor_id;
              var cipher = crypto.createCipher(algorithm,password)
              var crypted = cipher.update(text,'utf8','hex')
              crypted += cipher.final('hex');
              result.success ={};
              result.success.client_id = 'CLI-'+crypted;   
                
              var queryString2 = 'insert into clients(client_id, vendor_id, status) values("'+result.success.client_id+'","'+req.query.vendor_id+'","0")';
              console.log(queryString2);
              pool.query(queryString2, function(err2, rows2, fields2)  {
                  if (err)
                  {
                          result.error= err2;
                          console.log(err2);
                  }
                  else
                  {    
                      var text2 = (Math.floor(Math.random()*90000) + 10000) - (Math.floor(Math.random()*300) + 10000) ;
                      var cipher = crypto.createCipher(algorithm,password);
                      var crypted2 = cipher.update(String(text2),'utf8','hex')
                      crypted2 += cipher.final('hex');
                      result.success.client_id = 'CLI-'+crypted; 
                      result.success.ouath_key = crypted2;
                      result.success.status = 0; 
                      res.setHeader('Content-Type', 'application/json');
                      res.send(JSON.stringify(result));    
                  }
              });
                   
            }
            else
            {
               if(rows[0].oauth_key=='')
                   {
                      var algorithm = 'aes-256-ctr';
                      var password = 'K8gsd97'; 
                      var text2 = (Math.floor(Math.random()*90000) + 10000) - (Math.floor(Math.random()*300) + 10000) ;
                      var cipher = crypto.createCipher(algorithm,password);
                      var crypted2 = cipher.update(String(text2),'utf8','hex')
                      crypted2 += cipher.final('hex');
                      
                      result.success = {};
                      result.success.client_id = rows[0].client_id; 
                      result.success.ouath_key = crypted2;
                      result.success.logout_url = '';
                      result.success.status = 0; 
                      res.setHeader('Content-Type', 'application/json');
                      res.send(JSON.stringify(result));   
                   }
                else
                    {
                      result.success = {};
                      result.success.client_id = rows[0].client_id; 
                      result.success.ouath_key = rows[0].oauth_key;
                      result.success.logout_url = rows[0].logout_url;
                      result.success.status = rows[0].status;; 
                      res.setHeader('Content-Type', 'application/json');
                      res.send(JSON.stringify(result));    
                    }
            }
            
        }
       

      }); 
  
 };
};