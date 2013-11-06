module.exports = function(id, loadWithJson, callback){

    var model = require('./forgetless_db_model.js');

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
        model.loadFromJson(loadWithJson, callback);
    } else {
        model.loadFromId(id, 'audit', null, callback);
    }

};