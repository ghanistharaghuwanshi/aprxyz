exports.getVendorsList = function(pool) {
    return function(req, res) {


        var queryString = 'SELECT * FROM user_master WHERE user_type = 2 and status="Y"';

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

exports.vendorList = function(pool) {
    return function(req, res) {
        var draw = req.query.draw;
        var start = req.query.start;
        var length = req.query.length;
        var search_key = req.query.search.value;
        var end = parseInt(start) + parseInt(length);

        var pageSize = length != null ? parseInt(length) : 0;
        var skip = start != null ? parseInt(start) : 0;
        var recordsTotal = 0;

        var queryString = 'SELECT id,name,lisence_file,license_number,mobile_number,balance,DATE_FORMAT(dob,"%d, %b %Y ") as dob,multiplier,di_number,pin,url, status, user_type FROM user_master WHERE user_type = 2 ';

        if (search_key != '') {
            queryString += 'AND  name like "%' + search_key + '%" ';
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



exports.addVendor = function(formidable, fs, pool, crypto, transporter) {
    return function(req, res) {
        {


            var form = new formidable.IncomingForm();
            var $data = form.parse(req, function(err, fields, files) {
                if (err) {

                    return;
                }
                /*res.writeHead(200, {'content-type': 'text/plain'});*/
                // This last line responds to the form submission with a list of the parsed data and files.
                $data = JSON.parse(fields.model);

                var name = $data.first_name;
                var email = $data.email;
                var mobile_number = $data.mobile;
                var balance = '0:0:0';
                //var dob = $data.dob;
                //var di_number= $data.diNumber;
                var pin = $data.pin;
                var status = $data.verified;
                var user_type = 2;

                var result = {};
                /*Generate Password*/
                var string = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM1234567890@#$';
                var parts = string.split('');
                for (var i = parts.length; i > 0; i--) {
                    var random = parseInt(Math.random() * i);
                    var temp = parts[--i];
                    parts[i] = parts[random];
                    parts[random] = temp;
                }
                var password = parts.join('');
                var pass = password.substr(0, 8);
                var encryptedPass = crypto.createHash('md5').update(pass).digest("hex");

                transporter.sendMail({
                    from: 'kalika.deltabee@gmail.com',
                    to: email,
                    subject: 'Welcome to Allyi',
                    html: 'Hey ' + name + '!<br/>You are register as a vendor on Allyi.<br> Here is your login details<br><b>Email: </b>' + email + '<br><b>Password:</b>' + pass
                }, function(error, response) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Message sent');
                    }
                });

                var queryString = 'INSERT INTO `user_master`(`name`,`email`,`password`, `mobile_number`, `balance`, `pin`, `user_type`,`multiplier`, `status`) VALUES ("' + name + '",  "' + email + '", "' + encryptedPass + '", "' + mobile_number + '","' + balance + '","' + pin + '",' + user_type + ',1, "' + status + '")';

                pool.query(queryString, function(err, rows, fields) {

                    if (err) {
                        result.error = err;
                    } else {

                        result.success = "Record Inserted Successfully.";
                    }

                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));

                });
            });

        };
    };
};


exports.singleVendorData = function(pool) {
    return function(req, res) {
        var id = req.session.userID;
        var queryString = 'SELECT id,name,lisence_file,license_number,mobile_number,balance,DATE_FORMAT(dob,"%d, %b %Y ") as dob,multiplier,di_number,pin,url,status, user_type FROM user_master WHERE id="' + id + '"';


        var result = {};
        pool.query(queryString, function(err, rows, fields) {
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


/*
exports.editVendor = function(formidable,fs,pool){
//return function(req,res){
{

var form = new formidable.IncomingForm();
var $data = form.parse(req, function(err, fields, files) {
if (err) {

return;
}

$data = JSON.parse(fields.model);
var  id = $data.id;
var multiplier=  $data.multiplier;
var url= $data.url;
var status = $data.status;

var queryString = "update `user_master` set multiplier='"+multiplier+"',  url = '"+url+"', status='"+status+"' ";    

queryString += " where id="+id;

pool.query(queryString, function(err, rows, fields)  {

if (err)
{
result.error= err;
}

else{

result.success= "Record Updated Successfully.";

}

res.setHeader('Content-Type', 'application/json');
res.send(JSON.stringify(result)); 

});

});  
};
};  
};

*/

exports.vendorLogin = function(crypto, pool) {
    return function(req, res) {
        {
            sess = req.session;
            var email = req.body.email;
            var password = req.body.password;
            var queryString = 'SELECT * FROM user_master where email = "' + email + '" and user_type=2';
            var result = {};

            pool.query(queryString, function(err, rows, fields) {

                if (err) {
                    result.error = err;
                } else {
                    if (rows.length == 0) {
                        result.error = "User not Exist.";
                    } else {
                        if (rows[0].status == 'Y') {
                            var passwordn = crypto.createHash('md5').update(password).digest("hex");
                            if (passwordn == rows[0].password) {
                                sess.userID = rows[0].id;
                                sess.userPrivilege = 2;
                                sess.userLevel = "vendor";
                                result.success = rows[0];
                            } else {
                                result.error = "Password didn't match.";
                            }
                        } else {
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


exports.authenticated = function(req, res) {
    var userLevel = req.params.access;
    sess = req.session;
    var result = {};
    if (typeof sess.userID !== 'undefined' && sess.userID != '' && sess.userLevel == userLevel) {
        result.status = 'success';
    } else {
        result.status = 'fail';
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
};



exports.logout = function(req, res) {
    var result = {};
    sess = req.session;
    sess.userID = '';
    sess.userPrivilege = 0;
    sess.userLevel = '';
    result.success = 'Logged out successfully';
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
};





exports.resetPasswordProcess = function(transporter, randomstring, pool) {
    return function(req, res) {
        var email = req.body.email;
        var host = req.protocol + '://' + req.headers.host + '/';
        var result = {};
        var queryString = 'select * from user_master where email ="' + email + '"';

        pool.query(queryString, function(err, rows, fields) {
            if (err) {
                result.error = err;
                console.log(err);
            } else {
                if (rows.length == 0) {
                    result.error = "Email Not Exist";
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));
                } else {
                    var vendorid = rows[0].id;
                    var userObj = rows[0];
                    var randS = randomstring.generate();
                    queryString1 = 'UPDATE user_master SET forget_token= "' + randS + '" where id = ' + vendorid;
                    pool.query(queryString1, function(err, rows, fields) {
                        if (err) {
                            result.error = err;
                            result.success = "Please contact Administrator";
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(result));
                        } else {
                            transporter.sendMail({
                                from: 'kalika.deltabee@gmail.com',
                                to: userObj.email,
                                subject: 'Reset Password',
                                html: 'Hey ' + userObj.name + '!<br/> Please click <a href="' + host + '#/vendor-newPassword/' + randS + '/' + userObj.id + '">here</a> to Reset Password!'
                            }, function(error, response) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Message sent');
                                }
                            });
                            result.success = "Please check mail to reset password";
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(result));


                        }
                    });
                }
            }
        });
    };
};



exports.confirmToken = function(pool) {
    return function(req, res) {
        var token = req.body.token;
        var id = req.body.userid;
        var result = {};


        var queryString = 'select * from user_master where  forget_token ="' + token + '" and id = "' + id + '"';
        pool.query(queryString, function(err, rows, fields) {
            if (err) {
                result.error = err;
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            } else {
                if (rows.length == 0) {
                    result.error = "You are not authorize to change password for the user";
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));
                } else {
                    result.succes = "go";
                    result.id = id;
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));
                }

            }
        });

    };
};


exports.updatePassword = function(crypto, pool) {
    return function(req, res) {

        var id = req.body.id;
        var newpass = req.body.pass;
        var passwordn = crypto.createHash('md5').update(newpass).digest("hex");
        var result = {};


        var queryString = 'UPDATE user_master SET  password ="' + passwordn + '",forget_token=""  where id = "' + id + '"';

        pool.query(queryString, function(err, rows, fields) {
            if (err) {
                result.error = err;
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            } else {
                result.succes = "Your Password has been changed successfully.";
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            }
        });


    };
};
exports.updateMultiplier = function(pool) {
    return function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var id = req.body.id;
        var multiplier = req.body.multiplier;
        var result = {};
        var queryString = 'UPDATE user_master SET  multiplier ="' + multiplier + '" where id = "' + id + '"';
        pool.query(queryString, function(err, rows, fields) {
            if (err) {
                result.error = err;

                res.send(JSON.stringify(result));
            } else {
                result.succes = "Multiplier Updated Successfully !";
                res.send(JSON.stringify(result));
            }
        });
    };
};
exports.updateUrl = function(pool) {
    return function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var id = req.body.id;
        var url = req.body.url;
        console.log(req.body);
        var result = {};
        var queryString = 'UPDATE user_master SET  url ="' + url + '" where id = "' + id + '"';
        pool.query(queryString, function(err, rows, fields) {
            if (err) {
                result.error = err;

                res.send(JSON.stringify(result));
            } else {
                result.succes = "Url Updated Successfully !";
                res.send(JSON.stringify(result));
            }
        });
    };
};

exports.updateName = function(pool) {
    return function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var id = req.body.id;
        var url = req.body.name;
        console.log(req.body);
        var result = {};
        var queryString = 'UPDATE user_master SET  name ="' + url + '" where id = "' + id + '"';
        pool.query(queryString, function(err, rows, fields) {
            if (err) {
                result.error = err;

                res.send(JSON.stringify(result));
            } else {
                result.succes = "Name Updated Successfully !";
                res.send(JSON.stringify(result));
            }
        });
    };
};
exports.updatePin = function(pool) {
    return function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var id = req.body.id;
        var url = req.body.pin;
        console.log(req.body);
        var result = {};
        var queryString = 'UPDATE user_master SET  pin ="' + url + '" where id = "' + id + '"';
        pool.query(queryString, function(err, rows, fields) {
            if (err) {
                result.error = err;

                res.send(JSON.stringify(result));
            } else {
                result.succes = "Pin Updated Successfully !";
                res.send(JSON.stringify(result));
            }
        });
    };
};
exports.updateProfile = function(formidable, fs, pool) {
    return function(req, res) {
        var form = new formidable.IncomingForm();
        var $data = form.parse(req, function(err, fields, files) {
            if (err) {
                return;
            }
            /*res.writeHead(200, {'content-type': 'text/plain'});*/
            // This last line responds to the form submission with a list of the parsed data and files.
            $data = JSON.parse(fields.model);
            var id = $data.id;
            var datetimestamp = Date.now();
            var licensefileName = datetimestamp + "-" + files.file.name.replace(/ /g, '');
            var result = {};
            var newfile = 'public/uploads/' + licensefileName;

            fs.copy(files.file.path, newfile, function(err) {
                if (err) {

                    req.flash("error", "Oops, something went wrong! (reason: copy)");

                }
                fs.unlink(files.file.path, function(err) {
                    if (err) {
                        req.flash("error", "Oops, something went wrong! (reason: deletion)");
                    }

                });
            });
            var queryString = 'update user_master set lisence_file="' + licensefileName + '" where id="' + id + '"';
            pool.query(queryString, function(err, rows, fields) {
                if (err) {
                    result.error = err;
                } else {
                    result.success = "Updated Successfully.";
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            });

        });

    };
};
exports.vendorCommaSeperatedList = function(pool) {
    var queryString = 'SELECT id FROM user_master WHERE user_type = 2 and status="Y"';

    var result = [];
    pool.query(queryString, function(err, rows, fields) {
        if (err) {
            result.error = err;

        } else {
            for (var i = rows.length - 1; i >= 0; i--) {
                result.push(rows[i].id.toString());
            }
            result.join();
            return result;
        }


    });
}
