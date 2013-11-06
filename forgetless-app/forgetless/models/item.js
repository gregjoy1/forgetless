module.exports = function(id, loadWithJson, callback){

    var model = Object;

    model.loadFromId = function(id, callback){
        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query('SELECT * FROM item WHERE id = ' + id, null, function(err, rows){
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

        model.zoneId = (
            object.hasOwnProperty('zone_id') ?
                object.zone_id :
                ''
        );

        model.title = (
            object.hasOwnProperty('title') ?
                object.title :
                ''
        );

        model.content = (
            object.hasOwnProperty('content') ?
                object.connect :
                ''
        );

        model.duration = (
            object.hasOwnProperty('duration') ?
                object.duration :
                ''
        );

        model.auditID = (
            object.hasOwnProperty('audit_id') ?
                object.audit_id :
                ''
        );

        model.deadline = (
            object.hasOwnProperty('deadline') ?
                object.deadline :
                ''
        );

        model.itemType = (
            object.hasOwnProperty('item_type') ?
                object.item_type :
                ''
        );

        process.nextTick(function(){
            callback(false, model)
        });

    };

    model.save = function(callback){
        GLOBAL.dbPool.getConnection(function(err, connection){
            if(model.id == ''){
                connection.query('UPDATE user SET ?? WHERE id = ?', [model, model.id], function(err, rows){
                    callback(err);
                });
            } else {
                connection.query('INSERT user SET ?', model, function(err, rows){
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

        exportObject.zone_id = model.zoneId;
        exportObject.title = model.title;
        exportObject.content = model.content;
        exportObject.duration = model.duration;
        exportObject.audit_id = model.auditID;
        exportObject.deadline = model.deadline;
        exportObject.item_type = model.itemType;

        callback(exportObject);

    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(id, callback);
    } else {
        model.loadFromId(id, callback);
    }

};