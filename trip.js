exports.triplist = function(pool){
   return function(req,res){
  var draw = req.query.draw;
  var start = req.query.start;
  var length = req.query.length;
  var search_key = req.query.search.value;
  var end = parseInt(start) + parseInt(length);
  
  var pageSize = length != null ? parseInt(length) : 0;
  var skip = start != null ? parseInt(start) : 0;
  var recordsTotal = 0;

  
var queryString = "SELECT um.name as vendor_name,um.multiplier, og.*, DATE_FORMAT(og.start_date,'%d, %b %Y ') as start_date FROM ongoing_trips as og INNER JOIN user_master as um on um.id=og.owner_id where og.status=1";
       
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
    
};
};
exports.triplistForVendor = function(pool){
   return function(req,res){
      
  var draw = req.query.draw;
  var start = req.query.start;
  var length = req.query.length;
  var search_key = req.query.search.value;
  var end = parseInt(start) + parseInt(length);
  
    sess=req.session;
    var id =  sess.userID;

  var pageSize = length != null ? parseInt(length) : 0;
  var skip = start != null ? parseInt(start) : 0;
  var recordsTotal = 0;

  
var queryString = "SELECT um.name as vendor_name,um.multiplier, og.*, DATE_FORMAT(og.start_date,'%d, %b %Y ') as start_date FROM ongoing_trips as og INNER JOIN user_master as um on um.id=og.owner_id where og.status=1 and og.owner_id='"+id+"'";
       
  if(search_key!=''){
    queryString += ' AND um.name like "%'+search_key+'%"';
  }

  
  var result = {};  
  pool.query(queryString, function(err, rows, fields) {
        if (err)
        {
          result.error= err;
            console.log(err);
            
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

    exports.getOnGoingSingle = function(pool){
      return function(req,res){    
     var getConnection = require('./db');

      var id = req.params.id;
      var queryString = "SELECT id,owner_id,DATE_FORMAT(start_date,'%d, %b %Y ') as start_date, start_time, vehicle_id, requester_id FROM ongoing_trips";

      queryString += " where id = '"+id+"'";

      var result = {}; 
      pool.query(queryString, function(err, rows, fields) {
            if (err)
            {
              result.error= err;

            }
            else
             {
              result.success = JSON.stringify(rows[0]);
             }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result)); 

          }); 

    };
    };


        exports.addTrip = function(pool){
              return function(req,res){
                  var getConnection = require('./db');
                  var owner_id=  req.body.owner_id;
                  var start_date = req.body.start_date;
                  var start_time= req.body.start_time;
                  var vehicle_id = req.body.vehicle_id;
                  var requester_id= req.body.requester_id;
                  var date = new Date(start_date);
                  var newDate =  date.getFullYear()+'-'+(date.getMonth() + 1) + '-' + date.getDate();


                      var result = {};
                      var queryString = 'insert into ongoing_trips(owner_id, start_date, start_time, vehicle_id, requester_id, status) values('+owner_id+',"'+newDate+'","'+start_time+'", "'+vehicle_id+'", '+requester_id+', 1)';
                      pool.query(queryString, function(err, rows, fields)  {
                            if (err)
                            {
                              console.log(err);
                              result.error= err;
                            }
                            else
                            {

                              var queryString1 = "update vehicles set trip_id="+rows.insertId+", status=1 where id="+vehicle_id;
                              pool.query(queryString1, function(err, rows, fields)  {

                                  result.success="Trip inserted successfully";
                              });

                            }

                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(result)); 
                      });  

        };
    };

exports.updateOnGoingSingle= function(pool){
      return function(req,res){
    
    var id =  req.body.id;
    var owner_id=  req.body.owner_id;
    var start_date = req.body.start_date;
    var start_time= req.body.start_time;
    var vehicle_id = req.body.vehicle_id;
    var requester_id= req.body.requester_id;
    var date = new Date(start_date);
    var newDate =  date.getFullYear()+'-'+(date.getMonth() + 1) + '-' + date.getDate();

    var data = {};
 

      var queryString = "SELECT * from ongoing_trips where id="+id;
      pool.query(queryString, function(err, rows, fields){
          if(!!err){
                data.error = err;
              }else{
                  if(rows[0].vehicle_id==vehicle_id){

                  }else{
                    pool.query("update vehicles set status = 0 where id="+vehicle_id, function(err, rows, fields){

                    });
                  }
                  pool.query("UPDATE ongoing_trips SET owner_id=?, start_date=?, start_time=?, vehicle_id=?, requester_id=?  WHERE id=?",[owner_id , newDate,start_time, vehicle_id ,  requester_id,id],function(err, rows, fields){
                        if(!!err){
                            data.error = err;
                        }else{
                            data.success = "Trip Updated Successfully";
                        }
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(data)); 
                    });
              }
      });
    
};
};


        exports.completedTripList = function(pool){
            return function(req,res){  
          res.setHeader('Content-Type', 'application/json');        
          var draw = req.query.draw;
          var start = req.query.start;
          var length = req.query.length;
          var search_key = req.query.search.value;
          var end = parseInt(start) + parseInt(length);

          var pageSize = length != null ? parseInt(length) : 0;
          var skip = start != null ? parseInt(start) : 0;
          var recordsTotal = 0;

          var queryString = "SELECT um.name as vendor_name,um.multiplier, og.*, DATE_FORMAT(og.start_date,'%d, %b %Y ') as start_date, DATE_FORMAT(og.end_date,'%d, %b %Y ') as trip_end_date FROM ongoing_trips as og INNER JOIN user_master as um on um.id=og.owner_id where og.status=2";
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

                res.send(JSON.stringify(result)); 

              }); 

        };
 };

        exports.vendorcompleteTripList = function(pool){
        return function(req,res){  
        res.setHeader('Content-Type', 'application/json');        
        var draw = req.query.draw;
        var start = req.query.start;
        var length = req.query.length;
        var search_key = req.query.search.value;
        var end = parseInt(start) + parseInt(length);
        
        sess=req.session;
        var id =  sess.userID;

        var pageSize = length != null ? parseInt(length) : 0;
        var skip = start != null ? parseInt(start) : 0;
        var recordsTotal = 0;

        var queryString = "SELECT um.name as vendor_name,um.multiplier, og.*, DATE_FORMAT(og.start_date,'%d, %b %Y ') as start_date, DATE_FORMAT(og.end_date,'%d, %b %Y ') as trip_end_date FROM ongoing_trips as og INNER JOIN user_master as um on um.id=og.owner_id where og.status=2  and og.owner_id='"+id+"'";
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

            res.send(JSON.stringify(result)); 

          }); 

        };
    };

exports.vendorcompleteSessionList = function(pool){
        return function(req,res){  
        res.setHeader('Content-Type', 'application/json');        
        var draw = req.query.draw;
        var start = req.query.start;
        var length = req.query.length;
        var search_key = req.query.search.value;
        var end = parseInt(start) + parseInt(length);
        
        sess=req.session;
        var id =  sess.userID;

        var pageSize = length != null ? parseInt(length) : 0;
        var skip = start != null ? parseInt(start) : 0;
        var recordsTotal = 0;

        var queryString = 'SELECT vm.*, um.name, ums.multiplier FROM video_history vm inner join user_master um on vm.client_id = um.id inner join user_master ums on ums.id = vm.vendor_id where vm.vendor_id = "' + id + '"';
        if(search_key!=''){
        queryString += ' AND um.name like "%'+search_key+'%" order by vm.id desc';
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

            res.send(JSON.stringify(result)); 

          }); 

        };
    };

        exports.cancelledTripList = function(pool){
          return function(req,res){    
          var draw = req.query.draw;
          var start = req.query.start;
          var length = req.query.length;
          var search_key = req.query.search.value;
          var end = parseInt(start) + parseInt(length);

          var pageSize = length != null ? parseInt(length) : 0;
          var skip = start != null ? parseInt(start) : 0;
          var recordsTotal = 0;      

          var queryString = "SELECT um.name as vendor_name,um.multiplier, v.reg_number, og.*, DATE_FORMAT(og.start_date,'%d, %b %Y ') as start_date FROM ongoing_trips as og INNER JOIN user_master as um on um.id=og.owner_id INNER JOIN vehicles as v ON v.id = og.vehicle_id where og.status=0";

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

        };
};

exports.addToComplete= function(step,pool,moment){

    return function(req,res){
      //console.log('1');
        
      var id =  req.body.id;
      var endDate=  req.body.endDate;
      var end_time = req.body.endTime;
      var amount= req.body.amount;
      var chennel= req.body.chennel;
      
      var date = new Date(endDate);
      var newDate =  date.getFullYear()+'-'+(date.getMonth() + 1) + '-' + date.getDate();
      
      var vehicle_id ='';
      var user_id = '';
      var owner_id='';
      var start_date='';
      var start_time='';
      var data = {};
      var vendor_balance = '0:0:0';
      var timeCount ='';
      var multiplier = 1;
      res.setHeader('Content-Type', 'application/json');
     
        
       step(

          function SlectFromTrip() {
            pool.query('SELECT * from ongoing_trips where id= ?;', [ id ], this);
          },

          function updateVehicle(error, rows) {
              if (error) {
                console.log(error);
                data.error = "Error in trip Selection";
                res.send(JSON.stringify(data))
              }
              else {
                  vehicle_id = rows[0].vehicle_id;
                  user_id = rows[0].requester_id;
                  owner_id = rows[0].owner_id;
                  start_date = rows[0].start_date;
                  start_time = rows[0].start_time;
                  pool.query('update vehicles set status = 0 where id= ?;', [ vehicle_id ], this);
              }
            },
            function getVendorbalance(error, rows) {
              if (error) {
                data.error = "Error in vendor balance Get";
                console.log(error);
                res.send(JSON.stringify(data))
              }else{

                 pool.query("select balance, multiplier from user_master where id='"+owner_id+"'", this);

              }
            },
            function selectFromUser(error, rows) {
              if (error) {
                data.error = "Error in vehicles updation";
                console.log(error);
                res.send(JSON.stringify(data))
              }
              else {
                    if (rows.length>0) {
                      vendor_balance = rows[0].balance;
                      multiplier = rows[0].multiplier;
                    }
                    pool.query('SELECT * from user_master where id= ?;', [ user_id ], this);
              }
            },

            function UpdateUserBalance(error, rows) {
              if (error) {
                data.error = "Error in user balance updation";
                console.log(error);
                res.send(JSON.stringify(data))
              }
              else {
                    var balance = rows[0].balance;
                    //var newBalance = parseInt(balance) - parseInt(amount);
                    var newStartDateTime =new Date(start_date.getFullYear()+'-'+(start_date.getMonth() + 1) + '-' + start_date.getDate()+' '+start_time);
                    var newEndDateTime = new Date(newDate+' '+end_time);

                    var start_dateTime = newStartDateTime.getTime();
                    var end_dateTime = newEndDateTime.getTime();
                    // get total seconds between the times
                    var delta = Math.abs(end_dateTime - start_dateTime) / 1000;

                    // calculate (and subtract) whole days
                    var days = Math.floor(delta / 86400);
                    delta -= days * 86400;

                    // calculate (and subtract) whole hours
                    var hours = Math.floor(delta / 3600) % 24;
                    var hrs = hours*24;
                    delta -= hours * 3600;

                    // calculate (and subtract) whole minutes
                    var minutes = Math.floor(delta / 60) % 60;
                    delta -= minutes * 60;
                    console.log(hours+'---'+minutes);
                    var vendorOldBalance = balance.split(':');
                    var vendorOldHrs =  (vendorOldBalance[0]!=='undefined') ? vendorOldBalance[0] : 0;
                    var vendorOldMin =  (vendorOldBalance[1]!=='undefined') ? vendorOldBalance[1] : 0;
                    var vendorOldSec =  (vendorOldBalance[2]!=='undefined') ? vendorOldBalance[2] : 0;
                    // what's left is seconds
                    var seconds = delta % 60;  // in theory the modulus is not required
                    var newHrs = parseInt(vendorOldHrs)-parseInt(multiplier*hrs);
                    var newMin = parseInt(vendorOldMin)-parseInt(multiplier*minutes);
                    var newSec = parseInt(vendorOldSec)-parseInt(multiplier*seconds);
                    console.log(newHrs+'=----'+newMin);
                    var noHrs =  (newMin<=0) ? parseInt(newHrs)-parseInt(1) : newHrs;
                    var noMin =  (newSec<=0)? parseInt(newMin%60)-parseInt(1) : (newMin%60);
                    var noSec =  (newSec%60);
                    console.log(noHrs+'=----'+noMin);
                    var total_time = noHrs+':'+noMin+':'+noSec;
                    console.log(total_time);
                  pool.query("update user_master set balance=? where id= ?;", [total_time, user_id ], this);

              }
            },
            function UpdateTripStatus(error, rows) {
              if (error) {
                data.error = "Error in trip updation";
                console.log(error);
                res.send(JSON.stringify(data))
              }
              else {

                  pool.query("update ongoing_trips set status=?, end_date=?, end_time=?, amount=? where id=?",[2, newDate, end_time, amount, id], this);
              }
            },
           
           function updateVendorBalance(error, rows) {
              if (error) {
                data.error = "Error in vendor balance updation";
                console.log(error);
                res.send(JSON.stringify(data))
              }
              else {
                    
                    var newStartDateTime =new Date(start_date.getFullYear()+'-'+(start_date.getMonth() + 1) + '-' + start_date.getDate()+' '+start_time);
                    var newEndDateTime = new Date(newDate+' '+end_time);

                    var start_dateTime = newStartDateTime.getTime();
                    var end_dateTime = newEndDateTime.getTime();
                    // get total seconds between the times
                    var delta = Math.abs(end_dateTime - start_dateTime) / 1000;

                    // calculate (and subtract) whole days
                    var days = Math.floor(delta / 86400);
                    delta -= days * 86400;

                    // calculate (and subtract) whole hours
                    var hours = Math.floor(delta / 3600) % 24;
                    var hrs = hours*24;
                    delta -= hours * 3600;

                    // calculate (and subtract) whole minutes
                    var minutes = Math.floor(delta / 60) % 60;
                    delta -= minutes * 60;
                    // what's left is seconds
                    var seconds = delta % 60;  // in theory the modulus is not required

                    timeCount = hrs+':'+minutes+':'+seconds;
                    
                    var vendorOldBalance = vendor_balance.split(':');
                    var vendorOldHrs =  (vendorOldBalance[0]!=='undefined') ? vendorOldBalance[0] : 0;
                    var vendorOldMin =  (vendorOldBalance[1]!=='undefined') ? vendorOldBalance[1] : 0;
                    var vendorOldSec =  (vendorOldBalance[2]!=='undefined') ? vendorOldBalance[2] : 0;
                    
                    var newHrs = parseInt(vendorOldHrs)+parseInt(multiplier*hrs);
                    var newMin = parseInt(vendorOldMin)+parseInt(multiplier*minutes);
                    var newSec = parseInt(vendorOldSec)+parseInt(multiplier*seconds);

                    var noHrs =  (newMin>=60) ? parseInt(newHrs)+parseInt(1) : newHrs;
                    var noMin =  (newSec>=60)? parseInt(newMin%60)+parseInt(1) : (newMin%60);
                    var noSec =  (newSec%60);
                    var total_time = noHrs+':'+noMin+':'+noSec;
                    pool.query("update user_master set balance ='"+total_time+"' where id ='"+owner_id+"'", this);
                  
              }
            },
            function (error, rows){
              if (error) {
                data.error = error;
              }else{
                
                pool.query("INSERT INTO `recharges`(`debit_id`, `chennel`, `time`, `amount`, `credit_id`) VALUES ('"+user_id+"','"+chennel+"','"+timeCount+"','"+amount+"','"+owner_id+"')", this);
              }
            },
            function (error, rows){
              if (error) {
                  data.error = error;
              }else{
                  data.success = "Trip Completed successfully";
              }
                
              res.send(JSON.stringify(data)); 

            }


        ); 
          
    };
};


exports.CancelTrip= function(pool){
      return function(req,res){
    
    var id =  req.body.id;
    var data = {};
   
  
      pool.query("update vehicles set status = 0 where trip_id="+id, function(err, rows, fields){

        });
  
      pool.query("UPDATE ongoing_trips SET status=0 WHERE id="+id,function(err, rows, fields){
            if(!!err){
                data.error = err;
            }else{
                data.success = "Trip Cancelled Successfully";
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data)); 
        });
           
};
};
