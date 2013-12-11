module.exports = function(id, loadWithJson, callback){

    var model = Object.create(GLOBAL.defs.DbModelBase);

    model.TABLE_NAME = 'audit';

    model.loadWithObject = function(object, callback){

//        var model = Object.create(GLOBAL.defs.DbModelBase);

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

        var exportObject = {};

        if(!skipId){
            exportObject.id = model.id;
        }

        exportObject.date_created = model.dateCreated;
        exportObject.date_deleted = model.dateDeleted;
        exportObject.last_modified = model.lastModified;
        exportObject.last_modified_by = model.lastModifiedBy;
        exportObject.audit_log = model.auditLog;

        callback(exportObject);

    };

    model.save = function(callback) {
        model.saveModel(model.TABLE_NAME, model, callback);
    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(loadWithJson, model, callback);
    } else if(id != null) {
        model.loadFromId(id, 'audit', model, null, callback);
    } else {
        callback(null, model);
    }

};