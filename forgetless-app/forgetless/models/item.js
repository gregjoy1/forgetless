module.exports = function(id, loadWithJson, callback){

    var model = require('./forgetless_db_model.js');

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
        model.loadFromJson(loadWithJson, callback);
    } else {
        model.loadFromId(id, 'item', 1, callback);
    }

};