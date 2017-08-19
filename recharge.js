exports.rechargelist = function(pool){
   return function(req,res){    
  var draw = req.query.draw;
  var start = req.query.start;
  var length = req.query.length;
  var search_key = req.query.search.value;
  var end = parseInt(start) + parseInt(length);

  var pageSize = length != null ? parseInt(length) : 0;
  var skip = start != null ? parseInt(start) : 0;
  var recordsTotal = 0;
  
  var queryString = 'SELECT um.name as user_name, r.* FROM recharges as r INNER JOIN user_master as um ON um.id = r.debit_id ';

  if(search_key!=''){
    queryString +=' where um.name like "%'+search_key+'%" ';
  }
 
console.log(queryString)
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

exports.addRecharge = function(pool){
      return function(req,res){
          var user_id=  req.body.user_id;
          var chennel_id = req.body.chennel;
          var balanceValue= req.body.balanceValue;
          var blanceRecieved = req.body.blanceRecieved;
          var chennel = 'Offline';
          if(chennel_id == 1){
            chennel = 'Online';
          }
        
              var result = {};
              var queryString = 'insert into recharges(user_id, chennel, value, balance, chennel_id) values('+user_id+',"'+chennel+'",'+balanceValue+', '+blanceRecieved+', '+chennel_id+')';
              pool.query(queryString, function(err, rows, fields)  {
                    if (err)
                    {
                      result.error= err;
                    }
                    else
                    {
                      queryString1 = 'select balance from user_master where id = '+user_id;
                      pool.query(queryString1, function(err, rows, fields)  {
                          if (err)
                          {
                            result.error= err;
                          }
                          else
                          {
                            var oldBalance = rows[0].balance;
                            var newBalance = parseInt(blanceRecieved) + parseInt(oldBalance);
                            queryString2 = 'UPDATE user_master SET balance = "'+newBalance+'" where id = '+user_id;
                              pool.query(queryString2, function(err, rows, fields)  {
                                  if (err)
                                  {
                                    result.error= err;
                                  }
                                  else
                                  {
                                    result.success="Rechagred successfully";
                                    res.setHeader('Content-Type', 'application/json');
                                    res.send(JSON.stringify(result)); 
                                  }
                              });
                          }
                      });
                    }
                });
                 

};
};