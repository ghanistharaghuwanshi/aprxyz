var express = require('express');
var app = express(); // create our app w/ express
var morgan = require('morgan'); // log requests to the console (express4)
var url = require('url');
var http = require('http');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy


var stormpath = require('express-stormpath');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var multer = require('multer');

var mysql = require('mysql');


var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

var crypto = require('crypto');
var session = require('express-session');
app.use(express.cookieParser());
var formidable = require("formidable");
var fs = require('fs-extra');
var randomstring = require("randomstring");
var Q = require('q');
var step = require('step');
var oauth2orize = require('oauth2orize');
var server = oauth2orize.createServer();

var admin = require("./admin");
var user = require("./user");
var vendor = require("./vendor");
var recharge = require("./recharge");
var trip = require("./trip");
var vehicle = require("./vehicle");
var router = require("./routes");
var pool = require('./db');
var client = require('./client');
var customer = require('./customer');
var moment = require('moment');
var api = require('./api');
var oauth2Controller = require('./oauth');
    var express = require('express'),
    app = express(),
    http = require('http'),
    appCom = http.createServer(app),

    io = require('socket.io').listen(appCom, { path: '/aprxyz.track' });
var usernames = {};
var usertracktracking = {};
var clientData = {};

var roomObj = { rooms: '' };
var roomData = {};

roomObj.rooms = ['room1'];

if (io.sockets.length > 0) {
    io.sockets.sockets.forEach(function(s) {
        s.disconnect(true);
    });

}

var queryString = 'SELECT id FROM user_master WHERE user_type = 2 and status="Y"';

function callback(data) {
    roomObj.rooms.push(data);
    roomData[data] = {};

}
pool.query(queryString, function(err, rows, fields) {
    if (err) {
        result.error = err;

    } else {
        for (var i = rows.length - 1; i >= 0; i--) {
            callback(rows[i].id.toString());
        }
    }
});
function getUserBalanceInsec(user_id, callbackForBalance){
    var response = '';
    var sql = 'SELECT * from user_master WHERE id = "'+user_id+'"';
    
    pool.query(sql, function(err, rows){
        if (err) {
            response = "Some Error Occured while fetching balance";
            console.log(response);
            callbackForBalance(0);
        }else{
            if (rows.length>0) {
                if (rows[0].user_type=='1' && rows[0].status=='Y') {
                    var CurrentBalance = rows[0].balance;
                    var balanceArr = CurrentBalance.split(':');
                    var hrs = balanceArr[0];
                    var min = balanceArr[1];
                    var sec = balanceArr[2];
                    var totalSec = ((hrs*3600) + (min*60) + parseInt(sec));
                    response = totalSec;
                    callbackForBalance(response);
                }else{
                    response = "Not a valid user!";
                    console.log(response);
                    callbackForBalance(0);
                }
            }else{
                response = "Please provide a valid user ID";
                console.log(response);
                callbackForBalance(0);
            }
        }
    })
}
function getMultiplier(vendor_id, callbackForMultipplier) {
    var response = '';
    var sql = 'SELECT * from user_master WHERE id = "'+vendor_id+'"';
    
    pool.query(sql, function(err, rows){
        if (err) {
            response = "Some Error Occured while fetching balance";
            console.log(response);
            callbackForMultipplier(0);
        }else{

            if (rows.length>0) {
                if (rows[0].user_type=='2' && rows[0].status=='Y') {
                    response = rows[0].multiplier;
                    callbackForMultipplier(response);
                }else{
                    response = "Not a valid user!";
                    console.log(response);
                    callbackForMultipplier(0);
                }
            }else{
                response = "Please provide a valid user ID";
                console.log(response);
                callbackForMultipplier(0);
            }
        }
    })
}
var rooms = roomObj.rooms;

io.sockets.on('connection', function(socket) {

    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function(username, client, access) {
        
        // store the username in the socket session for this client
        socket.username = username;
        console.log(socket.username);
        // store the room name in the socket session for this client
        socket.room = client;
        // add the client's username to the global list
        usernames[username] = username;
        // send client to room 1
        socket.join(client);
        // echo to client they've connected
        usertracktracking[socket.username] = { count: 0 };
        var multiplier = 0;
        getMultiplier(client, function(mult){
            usertracktracking[socket.username].multiplier = mult;
        })

        if (access == 2) {
            io.sockets.in(client).emit('initView', socket.id, roomData[client]);
        }
        console.log(access); 
        if(access == 1 && typeof clientData == 'object')
        {   console.log(client); console.log(clientData[client]);
            if(clientData.hasOwnProperty(client) && clientData[client].hasOwnProperty('session') && (typeof clientData[client].session) == 'object')
            {    
                io.sockets.in(client).emit('initCustomerView', socket.id, clientData[client].session);      
            }

        }
        var userArr = username.split('-');
        var client_id = '';
        if (typeof userArr[2]!=='undefined') {
            client_id = userArr[2];
            clientData[client_id] = {};
            clientData[client_id].remainingtime = 2000;
            getUserBalanceInsec(client_id, function(balance){
                clientData[client_id].remainingtime = balance;
            });
        }
      
    });

    socket.on('endsession',function(u,t){
        
        var userArr = t.split('-');
        var client_id = '';
        if (typeof userArr[2]!=='undefined') {
            client_id = userArr[2];
        }
        if(u==client_id){
            if(clientData.hasOwnProperty(client_id) && clientData[client_id].hasOwnProperty('handler') && clientData[client_id].handler.hasOwnProperty(t))
                {  var tar = clientData[client_id].handler[t];
                   console.log(t);
                   delete clientData[client_id].session[tar];
                   delete clientData[client_id].handler[t];
                   if(io.sockets.connected.hasOwnProperty(tar))
                       {
                         io.sockets.connected[tar].emit('fire',1);      
                       }
                   
                }
           
    
        }
        

        });
    socket.on('__track', function(data) {
        var objTemp = usertracktracking[socket.username];
        if (!objTemp.hasOwnProperty('data')) {
            usertracktracking[socket.username].data = {};
            usertracktracking[socket.username].data = data;
            usertracktracking[socket.username].data.session_id = socket.username;
            socket.join(usertracktracking[socket.username].data.vendor_id);
            roomData[usertracktracking[socket.username].data.vendor_id][data.session_id] = data;
            io.sockets.in(usertracktracking[socket.username].data.vendor_id).emit('newrecord', roomData[usertracktracking[socket.username].data.vendor_id]);
         }
        usertracktracking[socket.username].count = usertracktracking[socket.username].count + 1;
        /*===================*/
        var userArr = socket.username.split('-');
        var client_id = '';
        if (typeof userArr[2]!=='undefined') {
            client_id = userArr[2];
            if (clientData.hasOwnProperty(client_id) && clientData[client_id].hasOwnProperty('session') && typeof clientData[client_id].session == 'object') {
                
                if (clientData[client_id].session.hasOwnProperty(socket.id)) {
                    clientData[client_id].remainingtime = clientData[client_id].remainingtime - 1;
                }else{
                    clientData[client_id].session[socket.id] = {};
                    clientData[client_id].session[socket.id] = data;
                    clientData[client_id].handler[data.session_id] = {};
                    clientData[client_id]['handler'][data.session_id] = socket.id;
                    clientData[client_id].remainingtime = clientData[client_id].remainingtime - 1;
                   }
            }else{
                clientData[client_id]['session'] = {};
                clientData[client_id]['session'][socket.id] = {};
                clientData[client_id]['session'][socket.id] =  data;
                clientData[client_id]['handler'] = {};
                clientData[client_id]['handler'][data.session_id] = '';
                clientData[client_id]['handler'][data.session_id] = socket.id;
               }
          }
         io.sockets.emit('newSession',clientData[data.client_id]['session'],data.client_id);
        /*===================*/
    });
    // when the user disconnects.. perform this
    socket.on('disconnect', function() {
        // remove the username from global usernames list
        var pack = usertracktracking[socket.username];
        if (typeof pack == 'object' && pack.hasOwnProperty('data')) {
            api.addTrack(pool, pack);
            rec = pack.data;
            v = s = '';
            if (rec.hasOwnProperty('vendor_id')) {
                v = rec.vendor_id;
            }
            if (rec.hasOwnProperty('session_id')) {
                s = rec.session_id;
            }
            io.sockets.in(v).emit('removerecord', s);
            delete roomData[usertracktracking[socket.username].data.vendor_id][s];
            io.sockets.emit('newSession',clientData[rec.client_id]['session'],rec.client_id);
        }
        //io.sockets.in().emit('removerecord',pack.data);
       
        delete usertracktracking[socket.username];
        delete usernames[socket.username];
        socket.leave(socket.room);
    });
});
/* Socket Ends */
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

app.use(morgan('dev')); // log every request to the console
app.use(multer({ dest: './uploads' }));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
// parse application/x-www-form-urlencoded
app.use(url);
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
// parse application/json

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// parse  app.use(methodOverride());

app.use(express.cookieParser());
app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true
}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'kalika.deltabee@gmail.com',
        pass: 'Delta09098888!@#'
    }
}));



require('./authentication').init(app);
require('./isoauthAuthenticated').init(app);
require('./apiAuthentication').init(app);
/*Adimin login & other functionality*/
app.post('/login', admin.login(crypto, pool));
app.get('/authentication/:access', admin.authenticated);
app.get('/logout', admin.logout);
app.post('/resetPasswordProcess', admin.resetPasswordProcess(transporter, randomstring, pool));
app.post('/confirmToken', admin.confirmToken(pool));
app.post('/updatePassword', admin.updatePassword(crypto, pool));


/*Vendore list & other functionality*/
app.post('/vendorLogin', vendor.vendorLogin(crypto, pool));
app.get('/vendorAuthentication/:access', vendor.authenticated);
app.get('/vendorLogout', vendor.logout);
app.post('/vendorResetPassword', vendor.resetPasswordProcess(transporter, randomstring, pool));
app.post('/vendorConfirmToken', vendor.confirmToken(pool));
app.post('/vendorUpdatePassword', vendor.updatePassword(crypto, pool));
app.get('/vendorList', vendor.vendorList(pool));
app.post('/addVendor', vendor.addVendor(formidable, fs, pool, crypto, transporter));
app.get('/getVendorsList', vendor.getVendorsList(pool));
app.get('/singleVendorData', vendor.singleVendorData(pool));
app.post('/updateMultiplier', vendor.updateMultiplier(pool));
app.post('/updateUrl', vendor.updateUrl(pool));
app.post('/updateName', vendor.updateName(pool));
app.post('/updatePin', vendor.updatePin(pool));
app.post('/updateProfile', vendor.updateProfile(formidable, fs, pool));
//app.post('/editVendor',vendor.editVendor(formidable,pool));

/*Recharge list & other functionality*/
app.get('/rechargeList', recharge.rechargelist(pool));
app.post('/addRecharge', recharge.addRecharge(pool));

/*Trip list & other functionality*/
app.get('/tripList', trip.triplist(pool));
app.get('/completedTripList', trip.completedTripList(pool));
app.get('/cancelledTripList', trip.cancelledTripList(pool));
app.post('/addTrip', trip.addTrip(pool));
app.get('/getOnGoingTripSingle/:id', trip.getOnGoingSingle(pool));
app.post('/updateOnGoingTripSingle', trip.updateOnGoingSingle(pool));
app.post('/addToComplete', trip.addToComplete(step, pool, moment));
app.post('/CancelTrip', trip.CancelTrip(pool));
app.get('/triplistForVendor', trip.triplistForVendor(pool));
app.get('/vendorcompleteTripList', trip.vendorcompleteTripList(pool));
app.get('/vendorcompleteSessionList', trip.vendorcompleteSessionList(pool));


/*VEHICLElist & other functionality*/
app.get('/vehicleList', vehicle.vehiclelist(pool));
app.get('/getvehiclelist', vehicle.getvehiclelist(pool));
app.get('/idleVehicleList', vehicle.idleVehicleList(pool));
app.post('/addVehicle', vehicle.addVehicle(pool));
app.post('/activateVehicle', vehicle.activateVehicle(pool));
app.post('/deActivateVehicle', vehicle.deActivateVehicle(pool));
app.post('/VehicleList', vehicle.VehicleList(pool));

app.post('/updateExchangeRate', admin.updateExchangeRate(pool));
app.get('/getExchangeRate', admin.getExchangeRate(pool));

app.post('/addExchangeRequest', admin.addExchangeRequest(pool));
app.get('/getExchangeRequest', admin.getExchangeRequest(pool));
app.get('/getExchange', admin.getExchange(pool));
app.post('/updateExchangeStatus', admin.updateExchangeStatus(pool));

/*User list & other functionality*/
app.get('/userList', user.userlist(pool));
app.post('/addUser', user.addUser(formidable, fs, pool));
app.post('/editUser', user.editUser(formidable, fs, pool));
app.get('/getuserList', user.getuserlist(pool));
app.get('/singleUserData/:id', user.singleUserData(pool));
app.post('/deleteUser', user.deleteUser(pool));
app.post('/postClient', passport.authenticationMiddleware(), client.postClient(pool));
app.get('/getClients', passport.authenticationMiddleware(), client.getClients(pool, crypto));
app.get('/refreshOauthKey', client.genOAuthKey(crypto));
app.post('/userRegistration', user.userRegistration(pool));

/*Routing Handler*/

/*Vendore list & other functionality*/
app.post('/customerLogin', customer.customerLogin(crypto, pool));
app.get('/customerAuthentication/:access', customer.customerAuthentication);
app.get('/customerLogout', customer.logout);
app.get('/api/v1.0/authorize', passport.isoauthAuthenticated(pool), oauth2Controller.authorization);
app.post('/api/v1.0/authorize', passport.isoauthAuthenticated(pool), oauth2Controller.decision);
app.post('/api/v1.0/token', passport.isoauthAuthenticated(pool), oauth2Controller.token);
app.post('/api/v1.0/user_details', passport.apiAuthentication(pool), api.user_details(pool));
app.post('/loginAuthentication', customer.customerLoginAndAuthentication(pool, crypto));
// Create endpoint handlers for oauth2 token

app.post('/getUserVideoHistory', customer.videoHistory(pool));

app.use(app.router);
appCom.listen(process.env.PORT || 3000);
console.log("App listening on port 3000");
