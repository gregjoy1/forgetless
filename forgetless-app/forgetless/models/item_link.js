module.exports = function(id, loadWithJson, callback){

    var model = Object;

    model.loadFromId = function(id, callback){
        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query('SELECT * FROM list WHERE id = ' + id, null, function(err, rows){
                if(err){
                    callback(true, model);
                } else {
                    model.loadWithObject(rows[0], callback);
                }
                connection.release();
            });
        });
    };

    model.loadFromJson = function(json, callback){

        json = JSON.parse(json);

        if(json){
            model.loadWithObject(json, callback(false, model));
        } else {
            callback("Invalid JSON.", model);
        }
    };

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

    model.save = function(callback){
        GLOBAL.dbPool.getConnection(function(err, connection){
            if(model.id == ''){
                connection.query('UPDATE list_link SET ?? WHERE id = ?', [model, model.id], function(err, rows){
                    callback(err);
                });
            } else {
                connection.query('INSERT list_link SET ?', model, function(err, rows){
                    callback(err);
                });
            }
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
        model.loadFromJson(id, callback);
    } else {
        model.loadFromId(id, callback);
    }

};