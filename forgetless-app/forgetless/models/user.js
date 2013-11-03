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

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(id, callback);
    } else {
        model.loadFromId(id, callback);
    }

};