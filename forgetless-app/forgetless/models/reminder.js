module.exports = function(id, loadWithJson, callback, zoneIdOverride){

    var model = Object.create(GLOBAL.defs.DbModelBase);

    model.TABLE_NAME = 'reminder';

    model.loadWithObject = function(object, callback){

//        var model = Object.create(GLOBAL.defs.DbModelBase);

        object = (object == undefined ? {} : object);

        model.id = (
            object.hasOwnProperty('id') ?
                object.id :
                undefined
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

        GLOBAL.defs.Utils.GetDateFromISODate(model.dateCreated, function(date) {
            var exportObject = {};

            if(!skipId) {
                exportObject.id = model.id;
            }

            exportObject.item_id = model.itemId;
            exportObject.user_id = model.userId;
            exportObject.date_created = date;
            exportObject.repeat = model.repeat;
            exportObject.zone_id = model.zoneId;

            callback(exportObject);
        });

    };

    model.createNewReminder = function(date, repeat, itemId, userId, callback) {
        model.dateTime = date;

        if(repeat != (undefined || null)) {
            model.repeat = repeat;
        }

        model.itemId = itemId;
        model.userId = userId;

        model.save(function(err, reminderModel) {
            if(err) {
                // TODO implement logging...
            }

            callback(err, reminderModel);

        });
    };

    model.save = function(callback) {
        model.saveModel(model.TABLE_NAME, model, callback);
    };

    zoneIdOverride = (zoneIdOverride == undefined ? 1 : null);

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(loadWithJson, model, callback);
    } else if(id != null) {
        model.loadFromId(id, 'reminder', model, zoneIdOverride, callback);
    } else {
        callback(null, model);
    }

};