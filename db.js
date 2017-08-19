    var mySQL = require('mysql');
    var pool  = mySQL.createPool({
        host:  'localhost',
        user:'root',
        password:'',
        database:'allyi',
		migrate: 'safe',
		connectionLimit : 10,
    });
    module.exports = pool;