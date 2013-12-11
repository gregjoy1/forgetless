module.exports = function(id, loadWithJson, callback){

    var model = Object.create(GLOBAL.defs.DbModelBase);

    model.TABLE_NAME = 'item_link';

    model.loadWithObject = function(object, callback){

//        var model = Object.create(GLOBAL.defs.DbModelBase);

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

    model.GetAllItemLinksForUser = function(userID, listID, callback){
        var sql = 'SELECT * FROM item_link WHERE user_id = ? AND list_id = ?';
        var escapeArray = [userID, listID];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err, rows){
                if(err){
                    console.log(err, model);
                } else {

                    var ItemLinks = [];
                    for(var inc = 0; inc < rows.length; inc++){
                        new GLOBAL.defs.ItemLink(null, rows[inc], function(err, object){
                            ItemLinks.push(object);

                            if(ItemLinks.length == rows.length){
                                callback(null, ItemLinks);
                            }
                        });
                    }
                }
                connection.release();
            });
        });
    };

    model.save = function(callback) {
        model.saveModel(model.TABLE_NAME, model, callback);
    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(loadWithJson, model, callback);
    } else if(id != null) {
        model.loadFromId(id, 'item_link', model, 1, callback);
    } else {
        callback(null, model);
    }

};