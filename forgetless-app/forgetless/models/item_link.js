module.exports = function(id, loadWithJson, callback){

    var model = require('./forgetless_db_model.js');

    model.loadWithObject = function(object, callback){

        model.id = (
            object.hasOwnProperty('id') ?
                object.id :
                ''
            );

        model.listId = (
            object.hasOwnProperty('list_id') ?
                object.list_id :
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

        model.flag = (
            object.hasOwnProperty('flag') ?
                object.flag :
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

        exportObject.list_id = model.listId;
        exportObject.item_id = model.itemId;
        exportObject.user_id = model.userId;
        exportObject.flag = model.flag;

        callback(exportObject);

    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(loadWithJson, callback);
    } else {
        model.loadFromId(id, 'item_link', 1, callback);
    }

};