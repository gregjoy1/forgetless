module.exports = function(id, loadWithJson, callback){

    var model = Object.create(GLOBAL.defs.DbModelBase);

    model.TABLE_NAME = 'list';

    model.loadWithObject = function(object, callback){

//        var model = Object.create(GLOBAL.defs.DbModelBase);
        object = (object == undefined ? {} : object);

        model.id = (
            object.hasOwnProperty('id') ?
                object.id :
                undefined
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

        model.auditId = (
            object.hasOwnProperty('audit_id') ?
                object.audit_id :
                ''
        );

        callback(false, model);

    };

    model.createDbExportObject = function(skipId, callback){

        var exportObject = {};

        if(!skipId){
            exportObject.id = model.id;
        }

        exportObject.title = model.title;
        exportObject.description = model.description;
        exportObject.zone_id = model.zoneId;
        exportObject.audit_id = model.auditId;

        callback(exportObject);

    };

    model.createNewList = function(title, description, user, callback) {

        GLOBAL.defs.Audit.createNewAudit(user, function(err, audit) {
            model.title = title;

            if(description != (undefined || null)) {
                model.description = description;
            }

            if(!err) {
                model.auditId = audit.id;
            }

            model.zoneId = 1;

            model.save(function(err, listModel) {

                if(err) {
                    // TODO implement logging...
                }

                callback(err, listModel);
            });

        });

    };

    model.save = function(callback) {
        model.saveModel(model.TABLE_NAME, model, callback);
    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(loadWithJson, model, callback);
    } else if(id != null) {
        model.loadFromId(id, 'list', model, 1, callback);
    } else {
        callback(null, model);
    }

};