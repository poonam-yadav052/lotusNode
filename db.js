var mysql      = require('mysql');
var connection = mysql.createPool({
    host     : '38.109.112.183',
    user     : 'shreeweb_test',
    password : 'shreeweb_test',
    database : 'shreeweb_test'
});
module.exports=connection;