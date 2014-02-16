module.exports = function(mysql, config){

    return mysql.createPool({
        host: config.db_host,
        user: config.db_user,
        password: config.db_password,
        database: config.db_schema,
        waitForConnections: false
    });

    // TODO make sure this closes properly

};