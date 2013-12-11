module.exports = function(id, loadWithJson, callback){

    var model = Object.create(GLOBAL.defs.DbModelBase);

    model.TABLE_NAME = 'list_link';

    model.loadWithObject = function(object, callback){

//        var model = Object.create(GLOBAL.defs.DbModelBase);

        model.id = (
            object.hasOwnProperty('id') ?
                object.id :
                ''
            );

        model.userId = (
            object.hasOwnProperty('user_id') ?
                object.user_id :
                ''
            );

        model.listId = (
            object.hasOwnProperty('list_id') ?
                object.list_id :
                ''
            );

        model.parentListId = (
            object.hasOwnProperty('parent_id') ?
                object.parent_id :
                ''
            );

        model.title = (
            object.hasOwnProperty('title') ?
                object.title :
                ''
            );

        callback(false, model);

    };

    model.createDbExportObject = function(skipId, callback){

        var exportObject = {};

        if(!skipId){
            exportObject.id = model.id;
        }

        exportObject.user_id = model.userId;
        exportObject.list_id = model.listId;
        exportObject.parent_list_id = model.parentListId;
        exportObject.title = model.title;

        callback(exportObject);

    };

    model.GetAllListLinksForUser = function(userID, categoryID, callback){
        var sql = 'SELECT * FROM list_link WHERE user_id = ? AND category_id = ?';
        var escapeArray = [userID, categoryID];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err, rows){
                if(err){
                    console.log(err, model);
                } else {

                    var ListLinks = [];
                    for(var inc = 0; inc < rows.length; inc++){
                        new GLOBAL.defs.ListLink(null, rows[inc], function(err, object){
                            ListLinks.push(object);

                            if(ListLinks.length == rows.length){
                                callback(null, ListLinks);
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
        model.loadFromId(id, 'list_link', model, null, callback);
    } else {
        callback(null, model);
    }

};