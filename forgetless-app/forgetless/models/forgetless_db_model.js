var model = Object;

model.loadFromId = function(id, tableName, zoneID, callback){

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
            console.log(err);
            if(err){
                callback(err, model);
            } else {
                model.loadWithObject(rows[0], callback);
            }
            connection.release();
        });
    });
};

model.loadFromJson = function(json, callback){

    json = JSON.parse(json);

    if(json){
        model.loadWithObject(json, callback(false, model));
    } else {
        callback("Invalid JSON.", model);
    }
};

model.loadWithObject = function(object, callback){};

model.save = function(tableName, callback){
    GLOBAL.dbPool.getConnection(function(err, connection){
        if(model.id == ''){
            connection.query('UPDATE ? SET ?? WHERE id = ?', [tableName, model, model.id], function(err, rows){
                callback(err);
            });
        } else {
            connection.query('INSERT ? SET ??', [tableName, model], function(err, rows){
                callback(err);
            });
        }
    });
};

model.createDbExportObject = function(skipId, callback){};

module.exports = model;