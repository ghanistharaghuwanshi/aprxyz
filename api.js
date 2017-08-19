exports.user_details = function(pool) {
    return function(req, res) {
        var response = {};
        var data = req.user;

        if (data.status == '100') {
            response.request = { token: data.value, client: data.client_id };
            response.response = { data: { error: data.user }, status: '100' };
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(response));
        } else if (data.status == '101') {
            response.request = { token: data.value, client: data.client_id };
            response.response = { data: { error: data.user }, status: '101' };
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(response));
        } else if (data.status == '103') {
            response.request = { token: data.value, client: data.client_id };
            response.response = { data: { error: data.user }, status: '103' };
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(response));
        } else {
            client_id = data.client_id;
            user_id = data.user_id;
            queryString = "select um.id,name,um.email,um.mobile_number,um.dob, cl.vendor_id, cl.logout_url from user_master um inner join code c on c.user_id = um.id inner join clients cl on cl.client_id = c.client_id where cl.client_id='"+client_id+"' and um.user_type=1 and um.status ='Y' and c.user_id='"+user_id+"'";
            pool.query(queryString, function(err, rows, fields) {
                if (err) {


                } else {
                    response = {};
                    response.request = { token: data.value, client: data.client_id };
                    response.response = { data: { id: rows[0].id, name: rows[0].name, email: rows[0].email, mobile_number: rows[0].mobile_number, dob: rows[0].dob, vendor_id: rows[0].vendor_id, logOutUrl:  rows[0].logout_url }, status: '200' };
                    res.header("Access-Control-Allow-Origin", "*");
                    res.header("Access-Control-Allow-Headers", "X-Requested-With");
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(response));
                }
            });
        }
    };
};
exports.addTrack = function(pool, pack) {

    if (pack.hasOwnProperty('data')) {
        queryString = "insert into video_history(client_session,client_id,vendor_id,video_url,start_time,end_time, view_time, cuurent_multiplier) VALUES('" + pack.data.session_id + "'," + pack.data.client_id + "," + pack.data.vendor_id + ",'" + pack.data.video_url + "','" + pack.data.start_time + "','" + Date.now() + "','" + pack.count + "', '"+pack.multiplier+"')";

        pool.query(queryString, function(err, rows, fields) {
            if (err) {
                console.log(err);
                return true;
            } else {
                var view_time = pack.count*pack.multiplier;
                
                /*var ViewHours = Math.floor(view_time / 3600);
                var ViewMinutes = Math.floor(view_time / 60)%60;
                var ViewSeconds = Math.floor(view_time / 3600)%60;*/

                var Query = 'select balance from user_master where id = "'+pack.data.client_id+'"';
                pool.query(Query, function(err, rows, fields){
                    if (err) {
                        console.log(err);
                    }else{
                        if (rows.length>0) {
                            var CurrentBalance = rows[0].balance;
                            var balanceArr = CurrentBalance.split(':');
                            var hrs = balanceArr[0];
                            var min = balanceArr[1];
                            var sec = balanceArr[2];
                            var totalSec = ((hrs*3600) + (min*60) + parseInt(sec));
                            
                            var timeLeftInSec  = totalSec - view_time;
                            var ViewHours = Math.floor(timeLeftInSec / 3600);
                            var ViewMinutes = Math.floor(timeLeftInSec / 60)%60;
                            var ViewSeconds = Math.floor(timeLeftInSec %60);
                            ViewHours = (ViewHours<10) ? '0'+ViewHours : ViewHours;
                            ViewMinutes = (ViewMinutes<10) ? '0'+ViewMinutes : ViewMinutes;
                            ViewSeconds = (ViewSeconds<10) ?    '0'+ViewSeconds : ViewSeconds;

                            var timeLeft = ViewHours+':'+ViewMinutes+':'+ViewSeconds;
                            
                            var query = 'update user_master set balance="'+timeLeft+'" where id="'+pack.data.client_id+'"';
                            pool.query(query, function(err, row){
                                if (err) {
                                    console.log(err);
                                }else{

                                }
                            });
                        }
                    }
                });

                var Q = 'select balance from user_master where id = "'+pack.data.vendor_id+'"';
                pool.query(Q, function(err, rows, fields){
                    if (err) {
                        console.log(err);
                    }else{
                        if (rows.length>0) {
                            var CurrentBalance = rows[0].balance;
                            var balanceArr = CurrentBalance.split(':');
                            var hrs = balanceArr[0];
                            var min = balanceArr[1];
                            var sec = balanceArr[2];

                            var totalSec = ((hrs*3600) + (min*60) + parseInt(sec));
                            
                            var timeLeftInSec  = totalSec + view_time;
                            var ViewHours = Math.floor(timeLeftInSec / 3600);
                            var ViewMinutes = Math.floor(timeLeftInSec / 60)%60;
                            var ViewSeconds = Math.floor(timeLeftInSec % 60);
                            ViewHours = (ViewHours<10) ? '0'+ViewHours : ViewHours;
                            ViewMinutes = (ViewMinutes<10) ? '0'+ViewMinutes : ViewMinutes;
                            ViewSeconds = (ViewSeconds<10) ?    '0'+ViewSeconds : ViewSeconds;

                            var timeLeft = ViewHours+':'+ViewMinutes+':'+ViewSeconds;
                            var query = 'update user_master set balance="'+timeLeft+'" where id="'+pack.data.vendor_id+'"';
                            pool.query(query, function(err, row){
                                if (err) {
                                    console.log(err);
                                }else{
                                    
                                }
                            });
                        }
                    }
                });
            }
        });
    }
};
