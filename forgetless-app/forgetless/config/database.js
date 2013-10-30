module.exports = function(mysql, config){
    var connection = mysql.createConnection({
        host: config.db_host,
        user: config.db_user,
        password: config.db_password
    });

    connection.connect();

    connection.query('USE ' + config.db_schema + ';', function(err){
        if(err){
            throw err;
        }
    });

    return connection;

    // TODO make sure this closes properly

};