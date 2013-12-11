module.exports = function(id, loadWithJson, callback){

    var model = Object.create(GLOBAL.defs.DbModelBase);

    model.loadWithObject = function(object, callback){

//        var model = Object.create(GLOBAL.defs.DbModelBase);

        model.TABLE_NAME = 'item';

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
                object.content :
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

    model.createDbExportObject = function(skipId, callback){

        var exportObject = {};

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

    model.save = function(callback) {
        model.saveModel(model.TABLE_NAME, model, callback);
    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(loadWithJson, model, callback);
    } else if(id != null) {
        model.loadFromId(id, 'item', model, 1, callback);
    } else {
        model.loadWithObject({}, callback);
    }

};