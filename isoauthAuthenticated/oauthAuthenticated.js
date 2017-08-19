function isoauthAuthenticated(pool) {
    return function(req, res, next) {
        var user_id = req.session.userID;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        if (typeof user_id === 'undefined' || user_id == '') {
            var host = req.protocol + '://' + req.headers.host + '/';
            var client_id = '';
            var res_type = '';
            var redirectUri = '';
            var secret_key = '';
            if (req.body.hasOwnProperty('client_id') && req.body.hasOwnProperty('response_type') && req.body.hasOwnProperty('redirect_uri') && req.body.hasOwnProperty('secret_key')) {
                client_id = req.body.client_id;
                res_type = req.body.response_type;
                redirectUri = req.body.redirect_uri;
                secret_key = req.body.secret_key;
            }

            if (req.query.hasOwnProperty('client_id') && req.query.hasOwnProperty('response_type') && req.query.hasOwnProperty('redirect_uri') && req.query.hasOwnProperty('secret_key')) {
                client_id = req.query.client_id;
                res_type = req.query.response_type;
                redirectUri = req.query.redirect_uri;
                secret_key = req.query.secret_key;
            }
            var params = 'client_id=' + client_id + '&response_type=' + res_type + '&redirect_uri=' + redirectUri + '&secret_key=' + secret_key;
            var RequestUrl = host + 'api/v1.0/authorize/?' + params;
            var data = {
                message: 'Please Login to Continue !',
                RequestUrl: RequestUrl,
                host: host
            }
            res.render('login', data);
            return;

        }
        var queryString = 'SELECT * from user_master where id=' + user_id;
        var result = {};
        pool.query(queryString, function(err, rows, fields) {
            if (err) {
                result.error = err;
                res.redirect('/');

            } else {
                user = rows[0];
                req.user = {};
                req.user = user;
                next();
            }
        });

    }
}

module.exports = isoauthAuthenticated