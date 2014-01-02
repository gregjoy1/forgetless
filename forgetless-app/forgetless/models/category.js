module.exports = function(id, loadWithJson, callback){

    var model = Object.create(GLOBAL.defs.DbModelBase);

    model.TABLE_NAME = 'category';

    model.loadWithObject = function(object, callback){

//        var model = Object.create(GLOBAL.defs.DbModelBase);
        object = (object == undefined ? {} : object);

        model.id = (
            object.hasOwnProperty('id') ?
                object.id :
                undefined
            );

        model.auditId = (
            object.hasOwnProperty('audit_id') ?
                object.audit_id :
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

        callback(false, model)

    };

    model.createDbExportObject = function(skipId, callback){

        var exportObject = {};

        if(!skipId){
            exportObject.id = model.id;
        }

        exportObject.zone_id = model.zoneId;
        exportObject.title = model.title;

        callback(exportObject);

    };

    model.createNewCategory = function(title, user, callback) {
        GLOBAL.defs.Audit.createNewAudit(user, function(auditModel) {
            model.zoneId = 1;
            model.title = title;
            model.auditId = auditModel.id;

            model.save(function(err, categoryModel) {
                if(err) {
                    // TODO proper logging
                }

                callback(categoryModel);

            });
        });
    };

    model.save = function(callback) {
        model.saveModel(model.TABLE_NAME, model, callback);
    };

    if(loadWithJson != null && loadWithJson) {
        model.loadFromJson(loadWithJson, model, callback);
    } else if(id != null) {
        model.loadFromId(id, 'category', model, 1, callback);
    } else {
        callback(null, model);
    }

};