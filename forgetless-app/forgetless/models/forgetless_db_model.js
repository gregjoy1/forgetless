var model = Object;

model.prototype.loadFromId = function(id, tableName, zoneID, callback){

    var sql = 'SELECT * FROM ' + tableName + ' WHERE id = ? ';
    var escapeArray = '';

    if(zoneID == null){
        escapeArray = id;
    } else {
        escapeArray = [id, zoneID];
        sql += 'AND zone_id = ?'
    }

    GLOBAL.dbPool.getConnection(function(err, connection){
        connection.query(sql, escapeArray, function(err, rows){
            if(err){
                callback(err, model);
            } else {
                model.loadWithObject(rows[0], callback);
            }
            connection.release();
        });
    });
};

model.prototype.loadFromJson = function(json, callback){

    if(typeof json == 'string')
    {
        json = JSON.parse(json);
    }

    if(json && (typeof json == 'object')){
        model.loadWithObject(json, callback);
    } else {
        callback("Invalid JSON.", model);
    }
};

model.prototype.loadWithObject = function(object, callback){};

model.prototype.saveModel = function(tableName, callback){
    GLOBAL.dbPool.getConnection(function(err, connection){
        if(model.id == ''){
            model.prototype.createDbExportObject(false, function(object){
                connection.query('UPDATE ? SET ?? WHERE id = ?', [tableName, object, model.id], function(err, rows){
                    callback(err);
                    connection.release();
                });
            });
        } else {
            model.prototype.createDbExportObject(true, function(object){
                connection.query('INSERT ? SET ??', [tableName, object], function(err, rows){
                    callback(err);
                    connection.release();
                });
            });
        }
    });
};

model.prototype.createDbExportObject = function(skipId, callback){};

model.prototype.loadChildren = function(callback){};

module.exports = model;