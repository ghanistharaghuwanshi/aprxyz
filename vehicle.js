exports.getvehiclelist = function(pool){
  return function(req,res){  
    
  var queryString = 'SELECT * FROM vehicles where status = 0';
  var result = {}; 
  pool.query(queryString, function(err, rows, fields) {
        if (err)
        {
          result.error= err;
            
        }
        else
        {
        
          result.success = JSON.stringify(rows);
          
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result)); 
 
      }); 
        
};
};

exports.vehiclelist = function(pool){
    return function(req,res){
  var draw = req.query.draw;
  var start = req.query.start;
  var length = req.query.length;
  var search_key = req.query.search.value;
  var end = parseInt(start) + parseInt(length);
  
  var pageSize = length != null ? parseInt(length) : 0;
  var skip = start != null ? parseInt(start) : 0;
  var recordsTotal = 0;        
 
  var queryString = 'SELECT um.name as vendor_name, v.* from vehicles as v LEFT JOIN user_master as um on um.id=v.vendor_id where v.status=1 ';

  if(search_key!=''){
    queryString +='AND  um.name like "%'+search_key+'%" ';
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


exports.addVehicle = function(pool){
    return function(req,res){
    var vendor_id =  req.body.user_id;
    var reg_number= req.body.reg_number;
    var description= req.body.description;
    
        
        var queryString="INSERT INTO vehicles(vendor_id, reg_number,description,status) VALUES("+vendor_id+" ,'"+reg_number+"', '"+description+"', 0)";
        
        
         var result = {};

        pool.query(queryString, function(err, rows, fields)  {
         
          if (err)
          {
              result.error= err;
          }
          else{
             result.success = "Vehicle inserted successfully";
          }
          
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result)); 
   
         
         
     });  
        
};
};


exports.idleVehicleList = function(pool){
  return function(req,res){
  var draw = req.query.draw;
  var start = req.query.start;
  var length = req.query.length;
  var search_key = req.query.search.value;
  var end = parseInt(start) + parseInt(length);
      

  var pageSize = length != null ? parseInt(length) : 0;
  var skip = start != null ? parseInt(start) : 0;
  var recordsTotal = 0;
        
 
  var queryString = 'SELECT um.name as vendor_name, v.* from vehicles as v LEFT JOIN user_master as um on um.id=v.vendor_id where (v.status=0 or v.status=-1) ';

  if(search_key!=''){
    queryString +='AND  um.name like "%'+search_key+'%" ';
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

exports.activateVehicle = function(pool){
          return function(req,res){    
            var id =  req.body.id;
            var data = {};
           
            pool.query("update vehicles set status=0 WHERE id=?",[id],function(err, rows, fields){
                  if(!!err){
                    data.error = err;
              }else{
                  data.success = "vehicle deleted Successfully";
              }
               res.setHeader('Content-Type', 'application/json');
               res.send(JSON.stringify(data)); 
        }); 
                
};
};

exports.deActivateVehicle = function(pool){
      return function(req,res){
            var id =  req.body.id;
            var data = {};
          
              pool.query("update vehicles set status=-1 WHERE id=?",[id],function(err, rows, fields){
                  if(!!err){
                    data.error = err;
              }else{
                  data.success = "vehicle deleted Successfully";
              }
               res.setHeader('Content-Type', 'application/json');
               res.send(JSON.stringify(data)); 
        });  
            
              
};
};


exports.VehicleList = function(pool){
  return function(req,res){
  var draw = req.query.draw;
  var start = req.query.start;
  var length = req.query.length;
  var search_key = req.query.search.value;
  var end = parseInt(start) + parseInt(length);
  
      
  var pageSize = length != null ? parseInt(length) : 0;
  var skip = start != null ? parseInt(start) : 0;
  var recordsTotal = 0;
 
  var queryString = "SELECT * from vehicles where vendor_id ='"+id+"' ";

  if(search_key!=''){
    queryString +='AND  um.name like "%'+search_key+'%" ';
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

