exports.getuserlist = function(pool) {
    return function(req, res) {

        var queryString = 'SELECT id,name,lisence_file,license_number,mobile_number,balance,DATE_FORMAT(dob,"%d, %b %Y ") as dob,di_number,pin, status, user_type FROM user_master WHERE user_type = 1';

        var result = {};
        pool.query(queryString, function(err, rows, fields) {
            if (err) {
                result.error = err;

            } else {

                result.success = JSON.stringify(rows);

            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));

        });

    };
};

exports.userlist = function(pool) {
    return function(req, res) {
        var draw = req.query.draw;
        var start = req.query.start;
        var length = req.query.length;
        var search_key = req.query.search.value;
        var end = parseInt(start) + parseInt(length);

        var pageSize = length != null ? parseInt(length) : 0;
        var skip = start != null ? parseInt(start) : 0;
        var recordsTotal = 0;


        var queryString = 'SELECT id,name,lisence_file,license_number,mobile_number,balance,DATE_FORMAT(dob,"%d, %b %Y ") as dob,di_number,pin,status, user_type FROM user_master WHERE user_type = 1';

        if (search_key != '') {
            queryString += ' AND  name like "%' + search_key + '%" ';
        }


        var result = {};
        pool.query(queryString, function(err, rows, fields) {
            if (err) {
                result.error = err;

            } else {
                result.draw = draw;
                recordsTotal = rows.length;
                result.recordsTotal = recordsTotal;

                var resultData = []
                resultData.push(rows.slice(skip, parseInt(skip) + parseInt(pageSize)));

                result.recordsFiltered = recordsTotal;
                result.success = JSON.stringify(resultData[0]);

            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));

        });

    };
};




exports.addUser = function(formidable, fs, pool) {
    return function(req, res) {
        var form = new formidable.IncomingForm();
        var $data = form.parse(req, function(err, fields, files) {
            if (err) {
                return;
            }
            /*res.writeHead(200, {'content-type': 'text/plain'});*/
            // This last line responds to the form submission with a list of the parsed data and files.
            $data = JSON.parse(fields.model);

            var name = $data.first_name;
            //var license_number = $data.license_number;
            var mobile_number = $data.mobile;
            var balance = '0:0:0';
            var dob = $data.dob;

            var date = new Date(dob);
            var newDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

            //var di_number= $data.diNumber;
            var pin = $data.pin;
            var status = $data.verified;
            var user_type = 1;
            /* var datetimestamp = Date.now();
            var licensefileName = datetimestamp+"-"+files.file.name.replace(/ /g,'');*/
            var result = {};
            /* var newfile = 'public/uploads/'+licensefileName;

            fs.copy(files.file.path, newfile, function(err) {
            if (err) {

            req.flash("error", "Oops, something went wrong! (reason: copy)");

            }
            fs.unlink(files.file.path, function(err) {
            if (err) {
            req.flash("error", "Oops, something went wrong! (reason: deletion)");

            }

            });
            });*/

            var queryString = "INSERT INTO `user_master`(`name`, `mobile_number`, `balance`, `dob`, `pin`, `user_type`, `status`) VALUES ('" + name + "','" + mobile_number + "','" + balance + "','" + newDate + "','" + pin + "'," + user_type + ",'" + status + "')";


            /*    var queryString = "INSERT INTO `user_master`(`name`, `lisence_file`, `license_number`, `mobile_number`, `balance`, `dob`, `di_number`, `pin`, `user_type`, `status`) VALUES ('"+name+"','"+licensefileName+"','"+license_number+"','"+mobile_number+"',"+balance+",'"+newDate+"','"+di_number+"','"+pin+"',"+user_type+",'"+status+"')";*/
            pool.query(queryString, function(err, rows, fields) {

                if (err) {
                    result.error = err;
                    console.log(err);
                } else {

                    result.success = "Record Inserted Successfully.";

                }

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));

            });

        });
    };
};


exports.singleUserData = function(pool) {
    return function(req, res) {

        var id = req.params.id;
        var queryString = 'SELECT id,name,lisence_file,license_number,mobile_number,balance,DATE_FORMAT(dob,"%d, %b %Y ") as dob,di_number,pin,status, user_type FROM user_master WHERE';

        queryString += " id = '" + id + "'";


        var result = {};
        return pool.query(queryString, function(err, rows, fields) {
            if (err) {
                result.error = err;

            } else {
                result.success = JSON.stringify(rows[0]);
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));

        });

    };
};

exports.editUser = function(formidable, fs, pool) {
    return function(req, res) {
        var data = req.body;
        var result = {};
        var query = 'SELECT * from user_master where mobile_number="'+data.mobile_number+'" and id !="'+data.id+'"';
        pool.query(query, function(err, resp, field){
          if (err) {
            console.log(err);
          }else{
            if (resp.length>0) {
              result.error = "Mobile Number Already Taken !";
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify(result));
            }else{
                var queryString = "update `user_master` set name='" + data.name + "',  mobile_number = '" + data.mobile_number + "', pin='" + data.pin + "'";
                
                queryString += " where id=" + data.id;
                pool.query(queryString, function(err, rows, fields) {
                    if (err) {
                        result.error = err;
                    } else {
                        result.success = "Record Updated Successfully.";
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));
                });
            }
          }
        })
        
    };
};

exports.deleteUser = function(pool) {
    return function(req, res) {
        var id = req.body.id;
        var data = {}

        pool.query("DELETE FROM user_master WHERE id=?", [id], function(err, rows, fields) {
            if (!!err) {
                data.error = err;
            } else {
                pool.query("DELETE FROM vehicles WHERE  vendor_id=?", [id], function(err, rows, fields) {
                    if (!!err) {
                        data.error = err;
                    } else {

                    }
                    data.success = "User deleted Successfully";
                });

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(data));

            };
        });

    };
};

exports.userRegistration = function(pool){
    return function(req, res) {
        var input = req.body;
        var data = {}
        pool.query("SELECT * from user_master where mobile_number=?", [input.mobile_number], function(err, rows, fields) {
            if (err) {
                data.error = err;
                console.log(err);
            } else {
                if (rows.length>0) {
                    data.error = "Mobile Number Already Taken !";
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(data));
                }else{
                    pool.query("INSERT INTO user_master(name, mobile_number, pin, user_type, status) VALUES(?, ?, ?, ?, ?)", [input.name, input.mobile_number, input.pin, '1', 'Y'], function(err, rows, fields) {
                        if (err) {
                            data.error = err;
                            console.log(err);
                        } else {
                            data.success = "Registration Successful. Try Login";
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(data));
                        }
                    });
                }
            };
        });
    };
}