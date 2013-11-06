module.exports = function(id, loadWithJson, callback){

    var model = Object;

    model.loadFromId = function(id, callback){
        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query('SELECT * FROM audit WHERE id = ' + id, null, function(err, rows){
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

        model.dateCreated = (
            object.hasOwnProperty('date_created') ?
                object.date_created :
                ''
        );

        model.dateDeleted = (
            object.hasOwnProperty('date_deleted') ?
                object.date_deleted :
                ''
        );

        model.lastModified = (
            object.hasOwnProperty('last_modified') ?
                object.last_modified :
                ''
        );

        model.lastModifiedBy = (
            object.hasOwnProperty('last_modified_by') ?
                object.last_modified_by :
                ''
        );

        model.auditLog = (
            object.hasOwnProperty('audit_log') ?
                object.audit_log :
                ''
        );

        process.nextTick(function(){
            callback(false, model)
        });

    };

    model.save = function(callback){
        GLOBAL.dbPool.getConnection(function(err, connection){
            if(model.id == ''){
                connection.query('UPDATE audit SET ?? WHERE id = ?', [model, model.id], function(err, rows){
                    callback(err);
                });
            } else {
                connection.query('INSERT audit SET ?', model, function(err, rows){
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

        exportObject.date_created = model.dateCreated;
        exportObject.date_deleted = model.dateDeleted;
        exportObject.last_modified = model.last_modified;
        exportObject.last_modified_by = model.lastModifiedBy;
        exportObject.audit_log = model.auditLog;

        callback(exportObject);

    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(id, callback);
    } else {
        model.loadFromId(id, callback);
    }

};