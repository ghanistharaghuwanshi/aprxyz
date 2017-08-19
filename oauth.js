var oauth2orize = require('oauth2orize');
var passport = require('passport');
var pool = require('./db');

var server = oauth2orize.createServer();

/*OAuth Handling*/
server.serializeClient((client, done) => done(null, client.client_id));

// Register deserialization function
server.deserializeClient(function(id, callback) {
    var queryString = "select * from clients where client_id='" + id + "'";
    pool.query(queryString, function(err, rows, fields) {

        if (err) {
            return callback(err); }
        client = rows[0];
        console.log(client);
        return callback(null, client);
    });

});

server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
    // Create a new authorization code
    var value = uid(16);
    var clientId = client.client_id,
        userId = user.id;
    if (redirectUri == '') {
        redirectUri = client.redirecturi;
    }
    var queryString = "insert into code values('NULL','" + value + "','" + clientId + "','" + redirectUri + "','" + userId + "', '1')";

    pool.query(queryString, function(err, rows, fields) {
        if (err) {
            return callback(err); }
        return callback(null, value);
    });
}));

exports.authorization = [server.authorization(function(clientId, redirectUri, callback) {
        var queryString = "select c.*,u.name from clients c INNER JOIN user_master u ON u.id = c.vendor_id  where c.client_id='" + clientId + "'";
        pool.query(queryString, function(err, rows, fields) {

            if (err) { console.log('in');
                return callback(err); }
            client = rows[0];
            if (redirectUri == '') {
                redirectUri = client.redirecturi;
            }
            return callback(null, client, redirectUri);
        });
    }),
    function(req, res) {

        if (req.query.secret_key == req.oauth2.client.oauth_key) {
            var queryString = "select c.* from code c where c.client_id='" + req.oauth2.client.client_id + "' and c.user_id='" + req.user.id + "'";
            pool.query(queryString, function(err, rowsp, fields) {
                if (err) { res.render('errorbox', { error: 'Oauth unable to respond at this moment, Please contact administrator!' }); }
                if (req.oauth2.redirectURI == '') {
                    res.render('errorbox', { error: "Could not find End-point URL." });
                } else if (rowsp.length > 0) {

                    if (rowsp[0].status == 1) {
                        redUrl = req.oauth2.redirectURI + '?code=' + rowsp[0].value;
                        res.redirect(redUrl);
                        res.end();
                    } else {
                        var newCode = uid(16);
                        var Q = 'update code set status = 1, value="' + newCode + '" where value="' + rowsp[0].value + '" and client_id="' + rowsp[0].client_id + '"';
                        pool.query(Q, function(err, rowsp) {
                            if (err) {
                                console.log(err);
                            } else {
                                redUrl = req.oauth2.redirectURI + '?code=' + newCode;
                                res.redirect(redUrl);
                                res.end();
                            }
                        });

                    }
                } else {
                    var host = req.protocol + '://' + req.headers.host + '/';
                    res.render('dialog', { host: host, referer: req.headers.referer, transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
                }
            });
        } else {
            res.render('errorbox', { error: 'Invalid Credentials, Authentication Failed!' });
        }
    }

];
exports.decision = [
    server.decision()
];

exports.token = [
    server.token(),
    server.errorHandler()
];

function uid(len) {
    var buf = [],
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
