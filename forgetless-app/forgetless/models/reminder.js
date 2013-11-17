module.exports = function(id, loadWithJson, callback){

    var model = GLOBAL.defs.DbModelBase;

    model.loadWithObject = function(object, callback){

        var model = Object.create(GLOBAL.defs.DbModelBase);

        model.id = (
            object.hasOwnProperty('id') ?
                object.id :
                ''
        );

        model.itemId = (
            object.hasOwnProperty('item_id') ?
                object.item_id :
                ''
        );

        model.userId = (
            object.hasOwnProperty('user_id') ?
                object.user_id :
                ''
        );

        model.dateTime = (
            object.hasOwnProperty('date_time') ?
                object.date_time :
                ''
        );

        model.repeat = (
            object.hasOwnProperty('repeat') ?
                object.repeat :
                ''
        );

        model.zoneId = (
            object.hasOwnProperty('zone_id') ?
                object.zone_id :
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

        exportObject.item_id = model.itemId;
        exportObject.user_id = model.userId;
        exportObject.date_created = model.dateCreated;
        exportObject.repeat = model.repeat;
        exportObject.zone_id = model.zoneId;

        callback(exportObject);

    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(loadWithJson, callback);
    } else if(id != null) {
        model.loadFromId(id, 'reminder', 1, callback);
    } else {
        callback(null, model);
    }

};