var model = {
    loadFromId:function(id, tableName, loadModel, zoneID, callback){

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
                } else if(rows.length == 0) {
                    callback('Empty Result Set', model);
                } else {
                    loadModel.loadWithObject(rows[0], callback);
                }
                connection.release();
            });
        });
    },

    loadFromJson:function(json, loadModel, callback){

        if(typeof json == 'string')
        {
            json = JSON.parse(json);
        }

        if(json && (typeof json == 'object')){
            loadModel.loadWithObject(json, callback);
        } else {
            callback("Invalid JSON.", model);
        }
    },

    loadWithObject:function(object, callback){},

    saveModel:function(tableName, saveModel, callback){
        GLOBAL.dbPool.getConnection(function(err, connection){
            if(saveModel.id == '' || saveModel.id == undefined) {
                saveModel.createDbExportObject(true, function(object) {
                    connection.query('INSERT ?? SET ?', [tableName, object], function(err, rows){
                        saveModel.id = rows.insertId;
                        callback(err, saveModel);
                        connection.release();
                    });
                });
            } else {
                saveModel.createDbExportObject(false, function(object) {
                    connection.query('UPDATE ?? SET ? WHERE id = ?', [tableName, object, saveModel.id], function(err, rows){
                        callback(err, saveModel);
                        connection.release();
                    });
                });
            }
        });
    },

    createDbExportObject:function(skipId, callback){},

    loadChildren:function(callback){}

};

module.exports = model;