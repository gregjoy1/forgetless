module.exports = function(id, loadWithJson, callback){

    var model = GLOBAL.defs.DbModelBase;

    model.loadWithObject = function(object, callback){

        var model = Object.create(GLOBAL.defs.DbModelBase);

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

        callback(false, model);

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
        model.loadFromJson(loadWithJson, callback);
    } else if(id != null) {
        model.loadFromId(id, 'list', 1, callback);
    } else {
        callback(null, model);
    }

};