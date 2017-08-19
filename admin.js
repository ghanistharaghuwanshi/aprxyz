exports.login = function(crypto,pool){
    return function(req,res){
    {
     
        sess=req.session;
        var userName = req.body.userName;
        var password = req.body.password;
        var queryString = 'SELECT * FROM admin_master where username = "'+userName+'"';
        var result = {};

        pool.query(queryString, function(err, rows, fields) {

            if (err)
            {
                result.error= err;
            }
            else
            {
                if(rows.length==0)
                {
                    result.error= "User not Exist.";
                }
                else
                {
                    if (rows[0].status==1) 
                    {   //Creating hash with received password value for comparison : DR
                        var passwordn = crypto.createHash('md5').update(password).digest("hex");
                        if (passwordn == rows[0].password) 
                        {
                            sess.userID = rows[0].id;
                            sess.userPrivilege = 1;
                            sess.userLevel = "admin";
                            result.success = rows[0];
                        }
                        else
                        {
                            result.error = "Password didn't match.";
                        }
                    }
                    else
                    {
                        result.error = "User Not Varified.";
                    }

                }

             }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result)); 
      
        });
        
         
    };
  };
};


        exports.authenticated = function(req,res){
              var userLevel = req.params.access;
              sess=req.session;
              var result = {};
             if(typeof sess.userID !=='undefined' && sess.userID!='' && sess.userLevel==userLevel){
                 result.status = 'success';
             }else{
                 result.status = 'fail';
             }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result)); 
        };



    exports.logout = function(req,res){
        var result = {};
        sess = req.session;
        sess.userID ='' ;
        sess.userPrivilege = 0;
        sess.userLevel = '';
        result.success = 'Logged out successfully';
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result)); 
    }

    
    
    
    
exports.resetPasswordProcess = function(transporter,randomstring,pool)
{
    return function(req,res){
   
        var email = req.body.email;
        
        var result = {};  
         var queryString = 'select * from admin_master where email ="'+email+'"';
              pool.query(queryString, function(err, rows, fields)  {
                     if (err){
                         result.error= err;
                         
                     } 
                    else
                    { 
                      if(rows.length==0){
                          result.error="Email Not Exist";
                          res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify(result));   
                      }else{
                        var adminid = rows[0].id;
                        var userObj = rows[0];
                        var randS = randomstring.generate();    
                         queryString1 = 'UPDATE admin_master SET forget_token= "'+randS+'" where id = '+adminid;
                  pool.query(queryString1, function(err, rows, fields)  {
                              if (err)
                              {
                                result.error= err;
                                result.success="Please contact Administrator";
                                res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify(result));   
                              }
                              else
                              {   transporter.sendMail({
                                    from: 'kalika.deltabee@gmail.com',
                                    to: userObj.email,
                                    subject: 'Reset Password',
                                    html: 'Hey '+userObj.username+'!<br/> Please click <a href="https://allyi.herokuapp.com/#/newPassword/'+randS+'/'+userObj.id+'">here</a> to Reset Password!'
                                }, function(error, response) {
                                   if (error) {
                                        console.log(error);
                                   } else {
                                        console.log('Message sent');
                                   }
                                });
                                  result.success="Please check mail to reset password";
                                  res.setHeader('Content-Type', 'application/json');
                                  res.send(JSON.stringify(result));   


                              }
                          });
                        }
                    }
                });

                
    };
};


exports.confirmToken= function (pool){
     return function(req,res){
    var token = req.body.token;
    var id = req.body.userid;
    var result = {};
    var pool = global.pool;
   
              var queryString = 'select * from admin_master where  forget_token ="'+token+'" and id = "'+id+'"';
              pool.query(queryString, function(err, rows, fields)  {
                     if (err){
                         result.error= err;
                         res.setHeader('Content-Type', 'application/json');
                         res.send(JSON.stringify(result));   
                     }
                     else
                     {
                      if(rows.length==0)
                        {
                            result.error= "You are not authorize to change password for the user";
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(result));   
                        }
                      else
                        {
                            result.succes = "go";
                            result.id = id;
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(result));       
                        }
                           
                     }
              });
       
};
};

exports.updatePassword =  function(crypto,pool){
    return function(req,res){
 
    var id = req.body.id;
    var newpass = req.body.pass;
    var passwordn = crypto.createHash('md5').update(newpass).digest("hex");
    var result = {};
    
           
             var queryString = 'UPDATE admin_master SET  password ="'+passwordn+'",forget_token=""  where id = "'+id+'"';
            
            pool.query(queryString, function(err, rows, fields)  {
                     if (err){
                         result.error= err;
                         res.setHeader('Content-Type', 'application/json');
                         res.send(JSON.stringify(result));   
                     }
                     else
                     {  
                            result.succes = "Your Password has been changed successfully.";
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(result));       
                     }
              });
        

};
};
                      
                     

exports.updateExchangeRate = function(pool){
  return function(req,res){
    var exchange_rate = req.body.exchange_rate;
    var result = {};
    var query =  "update `admin_master` set exchange_rate='"+exchange_rate+"' ";      
    pool.query(query, function(err, rows, fields){
      if (err){
        result.error= err;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));   
      }
      else{  
        result.succes = "Exchange rate updated successfully";
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));       
      }
    });
  };
};
exports.getExchangeRate = function(pool){
  return function(req,res){
      var id =req.query.id;
      var result = {};
      var queryString ="select exchange_rate from admin_master";    
      pool.query(queryString, function(err, rows, fields) {
        if (err){
          result.error= err;
         }
        else{
          result.success = JSON.stringify(rows[0]);
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result)); 

      }); 
     }    
  };

  exports.addExchangeRequest= function(pool){
        return function(req,res){
            var vendor_id =  req.body.vendor_id;
            var hours= req.body.hours;
            var current_exchange_rate= req.body.current_exchange_rate;
            var status = req.body.status;    
            var queryString="INSERT INTO exchange_request(vendor_id, hours,current_exchange_rate,status) VALUES("+vendor_id+" ,'"+hours+"', '"+current_exchange_rate+"', 0)";
            var result = {};
            pool.query(queryString, function(err, rows, fields)  {
              if (err)
              {
                result.error= err;
              }
              else{
                var query = 'update user_master set balance="00:00:00" where id="'+vendor_id+'"';
                pool.query(query, function(err, rows, fields)  {

                });
                result.success = "Exchange Request inserted successfully";
              }
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify(result)); 
            });  
        };
    };
    exports.getExchangeRequest = function(pool){
        return function(req,res){
            
            var draw = req.query.draw;
            var start = req.query.start;
            var length = req.query.length;
            var search_key = req.query.search.value;
            var end = parseInt(start) + parseInt(length);
            
            var pageSize = length != null ? parseInt(length) : 0;
            var skip = start != null ? parseInt(start) : 0;
            var recordsTotal = 0;

            var queryString="select er.*, um.name as vendor_name from exchange_request as er inner join user_master as um on er.vendor_id=um.id where er.status=0";

            if(search_key!=''){
              queryString += ' AND um.name like "%'+search_key+'%"';
            }
            var result = {};  
            pool.query(queryString, function(err, rows, fields) {
                  if (err)
                  {
                    result.error= err;
                      
                  }
                  else
                  {
                        result.draw = draw;
                        recordsTotal = rows.length;
                        result.recordsTotal = recordsTotal;

                        var resultData = []
                        resultData.push(rows.slice(skip, parseInt(skip)+parseInt(pageSize)));
                       
                        result.recordsFiltered = recordsTotal;
                        result.success = JSON.stringify(resultData[0]);
                    
                  }
                
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify(result)); 
                  
                }); 
           }    
        };
exports.getExchange= function(pool){
        return function(req,res){
            
            var draw = req.query.draw;
            var start = req.query.start;
            var length = req.query.length;
            var search_key = req.query.search.value;
            var end = parseInt(start) + parseInt(length);
            
            var pageSize = length != null ? parseInt(length) : 0;
            var skip = start != null ? parseInt(start) : 0;
            var recordsTotal = 0;

           var queryString="select er.*, um.name as vendor_name from exchange_request as er inner join user_master as um on er.vendor_id=um.id where er.status=1";

            if(search_key!=''){
              queryString += ' AND um.name like "%'+search_key+'%"';
            }
            queryString += " order by er.id desc";
            var result = {};  
            pool.query(queryString, function(err, rows, fields) {
                  if (err)
                  {
                    result.error= err;
                      
                  }
                  else
                  {
                        result.draw = draw;
                        recordsTotal = rows.length;
                        result.recordsTotal = recordsTotal;

                        var resultData = []
                        resultData.push(rows.slice(skip, parseInt(skip)+parseInt(pageSize)));
                       
                        result.recordsFiltered = recordsTotal;
                        result.success = JSON.stringify(resultData[0]);
                    
                  }
                
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify(result)); 
                  
                }); 
        };
    };

    exports.updateExchangeStatus = function(pool){
        return function(req,res){
            var exchange_id =req.body.id;
            var result = {};
            var query =  "update `exchange_request` set status = 1  where id='"+exchange_id+"'  ";      
            pool.query(query, function(err, rows, fields){
              if (err){
                result.error= err;
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));   
              }
              else{  
                result.succes = "Exchange rate updated successfully";
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));       
              }
            });
          };
        };