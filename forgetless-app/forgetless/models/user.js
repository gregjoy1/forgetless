module.exports = function(id, loadWithJson, callback){

    var model = Object;

    model.loadFromId = function(id, callback){
        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query('SELECT * FROM user WHERE id = ' + id, null, function(err, rows){
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

        model.title = (
            object.hasOwnProperty('title') ?
                object.title :
                ''
        );

        model.firstName = (
            object.hasOwnProperty('first_name') ?
                object.first_name :
                ''
        );

        model.lastName = (
            object.hasOwnProperty('last_name') ?
                object.last_name :
                ''
        );

        model.email = (
            object.hasOwnProperty('email') ?
                object.email :
                ''
        );

        model.passwordHash = (
            object.hasOwnProperty('password_hash') ?
                object.password_hash :
                ''
        );

        model.resetPasswordHash = (
            object.hasOwnProperty('reset_password_hash') ?
                object.reset_password_hash :
                ''
        );

        model.userTokenHash = (
            object.hasOwnProperty('user_token_hash') ?
                object.user_token_hash :
                ''
        );

        process.nextTick(function(){
            callback(false, model)
        });

    };

    model.save = function(callback){
        GLOBAL.dbPool.getConnection(function(err, connection){
            if(model.id == ''){
                connection.query('UPDATE user SET ?? WHERE id = ?', [model, model.id], function(err, rows){
                    callback(err);
                });
            } else {
                connection.query('INSERT user SET ?', model, function(err, rows){
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

        exportObject.title = model.title;
        exportObject.first_name = model.firstName;
        exportObject.last_name = model.lastName;
        exportObject.email = model.email;
        exportObject.password_hash = model.passwordHash;
        exportObject.reset_password_hash = model.resetPasswordHash;
        exportObject.user_token_hash = model.userTokenHash;

        callback(exportObject);

    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(id, callback);
    } else {
        model.loadFromId(id, callback);
    }

};