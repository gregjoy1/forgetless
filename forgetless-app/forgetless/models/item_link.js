module.exports = function(id, loadWithJson, callback){

    var model = Object.create(GLOBAL.defs.DbModelBase);

    model.TABLE_NAME = 'item_link';

    model.loadWithObject = function(object, callback){

//        var model = Object.create(GLOBAL.defs.DbModelBase);
        object = (object == undefined ? {} : object);

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

        var exportObject = {};

        if(!skipId){
            exportObject.id = model.id;
        }

        exportObject.list_id = model.listId;
        exportObject.item_id = model.itemId;
        exportObject.user_id = model.userId;
        exportObject.flag = model.flag;

        callback(exportObject);

    };

    model.GetAllItemLinksForUser = function(userId, listId, callback){
        var sql = 'SELECT * FROM item_link WHERE user_id = ? AND list_id = ? AND flag != 0';
        var escapeArray = [userId, listId];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err, rows){
                if(err){
                    console.log(err, model);
                    // TODO handle this error...
                } else {
                    var ItemLinks = [];

                    if(rows.length == 0) {
                        callback(null, []);
                    } else {
                        for(var inc = 0; inc < rows.length; inc++){
                            new GLOBAL.defs.ItemLink(null, rows[inc], function(err, object){
                                ItemLinks.push(object);

                                if(ItemLinks.length == rows.length){
                                    callback(null, ItemLinks);
                                }
                            });
                        }
                    }

                }
                connection.release();
            });
        });
    };

    model.removeItemLink = function(callback) {
        model.flag = 0;
        model.save(function(err, itemLinkModel) {
            if(err) {
                // TODO add logging
            }

            callback(itemLinkModel);

        });
    };

    model.createNewItemLink = function(userId, itemId, listId, callback) {

        model.userId = userId;
        model.itemId = itemId;
        model.listId = listId;
        model.flag = 0;

        model.save(function(err, itemLinkObject) {
            if(err) {
                // TODO implment logging...
            }

            callback(itemLinkObject);
        });


    };

    model.save = function(callback) {
        model.saveModel(model.TABLE_NAME, model, callback);
    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(loadWithJson, model, callback);
    } else if(id != null) {
        model.loadFromId(id, 'item_link', model, null, callback);
    } else {
        callback(null, model);
    }

};