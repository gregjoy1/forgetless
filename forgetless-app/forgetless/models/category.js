module.exports = function(id, loadWithJson, callback){

    var model = GLOBAL.defs.DbModelBase;

    model.loadWithObject = function(object, callback){

        var model = Object.create(GLOBAL.defs.DbModelBase);

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

        callback(false, model)

    };

    model.createDbExportObject = function(skipId, callback){

        var exportObject = Object;

        if(!skipId){
            exportObject.id = model.id;
        }

        exportObject.zone_id = model.zoneId;
        exportObject.title = model.title;

        callback(exportObject);

    };

    if(loadWithJson != null && loadWithJson) {
        model.loadFromJson(loadWithJson, callback);
    } else if(id != null) {
        model.loadFromId(id, 'category', 1, callback);
    } else {
        callback(null, model);
    }

};