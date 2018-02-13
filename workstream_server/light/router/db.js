var mysql = require("mysql");
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'workstream'
});

// connection.connect();
// connection.query("set name utf8");
module.exports = connection;