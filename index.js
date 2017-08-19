    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var morgan = require('morgan');             // log requests to the console (express4)
    var url = require('url'); 
    var stormpath = require('express-stormpath');
    var nodemailer = require('nodemailer');
    var smtpTransport = require('nodemailer-smtp-transport');

    var multer = require('multer'); 

    var mysql = require('mysql');                     // mongoose for mysql
    var connection = require('express-myconnection');
    
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    
    var crypto = require('crypto');
    var session = require('express-session');
    
    var formidable = require("formidable");
    var fs = require('fs-extra');
    var randomstring = require("randomstring");
    var Q = require('q');
    var step = require('step');
    
    var admin = require("./admin");
    var user = require("./user");
    var vendor = require("./vendor");
    var recharge=require("./recharge");
    var trip = require("./trip");
    var vehicle = require("./vehicle");
    var router = require("./routes");
    
    
    app.use(express.static(__dirname + '/public'));// set the static files location /public/img will be /img for users
    
    app.use(morgan('dev'));  // log every request to the console
    app.use(multer({dest: './uploads'}));
    app.use(bodyParser.urlencoded({'extended':'true'}));
    // parse application/x-www-form-urlencoded
    app.use(url); 

    app.use(bodyParser.json());  
    // parse application/json
    
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
    // parse  app.use(methodOverride());
    app.use(
        connection(mysql,{

            host: 'us-cdbr-iron-east-04.cleardb.net',
            user: 'b148b696b460a5',
            password : '035a345e',
            database:'heroku_7fb70d043fd6cfd'
        },'request')
    );//route index, hello world
    app.use(session({secret: 'ssshhhhh',saveUninitialized: true,
                 resave: true}));
    /*Mail Setup*/
       var transporter = nodemailer.createTransport(smtpTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: 'kalika.deltabee@gmail.com',
                pass: 'kalika@123'
            }
        })); 
   
    /*Routing Handler*/
    
    /*Adimin login & other functionality*/
    app.post('/login', admin.login(crypto));
    app.get('/authentication/:access', admin.authenticated);
    app.get('/logout', admin.logout); 
    app.post('/resetPasswordProcess',admin.resetPasswordProcess(transporter,randomstring));
    app.post('/confirmToken',admin.confirmToken);
    app.post('/updatePassword',admin.updatePassword(crypto));

    /*User list & other functionality*/
    app.get('/userList', user.userlist);
    
    /*Vendore list & other functionality*/
    app.get('/vendorList', vendor.vendorList);
    app.post('/addVendor',vendor.addVendor(formidable,fs));
    app.get('/getVendorsList', vendor.getVendorsList);
    app.get('/singleVendorData/:id', vendor.singleVendorData);

     /*Recharge list & other functionality*/
    app.get('/rechargeList',  recharge.rechargelist);
    app.post('/addRecharge',  recharge.addRecharge);

     /*Trip list & other functionality*/
    app.get('/tripList', trip.triplist);
    app.get('/completedTripList', trip.completedTripList);
    app.get('/cancelledTripList', trip.cancelledTripList);
    app.post('/addTrip', trip.addTrip);
    app.get('/getOnGoingTripSingle/:id',trip.getOnGoingSingle);
    app.post('/updateOnGoingTripSingle',trip.updateOnGoingSingle);
    app.post('/addToComplete',trip.addToComplete(step));
    app.post('/CancelTrip',trip.CancelTrip);


     /*VEHICLElist & other functionality*/
    app.get('/vehicleList', vehicle.vehiclelist);
    app.get('/getvehiclelist', vehicle.getvehiclelist);
    app.get('/idleVehicleList', vehicle.idleVehicleList);
    app.post('/addVehicle', vehicle.addVehicle);
    app.post('/activateVehicle',vehicle.activateVehicle);
    app.post('/deActivateVehicle',vehicle.deActivateVehicle);
    
     /*Add user*/
    app.post('/addUser',user.addUser(formidable,fs));
    app.post('/editUser',user.editUser(formidable,fs));
    app.get('/getuserList', user.getuserlist);
    app.get('/singleUserData/:id', user.singleUserData);
    app.post('/deleteUser',user.deleteUser);
    

    app.use(app.router);
    /*Routing Handler*/
    
    app.listen(8080);
    console.log("App listening on port 8080");