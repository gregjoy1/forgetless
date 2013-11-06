module.exports = function(id, loadWithJson, callback){

    var model = Object;

    model.loadFromId = function(id, callback){
        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query('SELECT * FROM list WHERE id = ' + id, null, function(err, rows){
                if(err){
                    callback(true, model);
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

    model.loadWithObject = function(object, callback){

        model.id = (
            object.hasOwnProperty('id') ?
                object.id :
                ''
        );

        model.title = (
            object.hasOwnProperty('title') ?
                object.title :
                ''
        );

        model.description = (
            object.hasOwnProperty('description') ?
                object.description :
                ''
        );

        model.zoneId = (
            object.hasOwnProperty('zone_id') ?
                object.zone_id :
                ''
        );

        model.auditID = (
            object.hasOwnProperty('audit_id') ?
                object.audit_id :
                ''
        );

        process.nextTick(function(){
            callback(false, model)
        });

    };

    model.save = function(callback){
        GLOBAL.dbPool.getConnection(function(err, connection){
            if(model.id == ''){
                connection.query('UPDATE list SET ?? WHERE id = ?', [model, model.id], function(err, rows){
                    callback(err);
                });
            } else {
                connection.query('INSERT list SET ?', model, function(err, rows){
                    callback(err);
                });
            }
        });
    };

    model.createDbExportObject = function(skipId, callback){

        var exportObject = Object;

        if(!skipId){
            exportObject.id = model.id;
        }

        exportObject.title = model.title;
        exportObject.description = model.description;
        exportObject.zone_id = model.zoneId;
        exportObject.audit_id = model.auditID;

        callback(exportObject);

    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(id, callback);
    } else {
        model.loadFromId(id, callback);
    }

};