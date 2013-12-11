module.exports = function(id, loadWithJson, callback){

    var model = Object.create(GLOBAL.defs.DbModelBase);

    model.TABLE_NAME = 'user';

    model.loadWithObject = function(object, callback){
//        var model = Object.create(GLOBAL.defs.DbModelBase);

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

        callback(false, model);

    };

    model.loadDumpSafeObjectFromModel = function(model, callback){

        var dumpSafeModel = {};

        dumpSafeModel.id = (
            model.hasOwnProperty('id') ?
                model.id :
                ''
        );

        dumpSafeModel.title = (
            model.hasOwnProperty('title') ?
                model.title :
                ''
        );

        dumpSafeModel.firstName = (
            model.hasOwnProperty('firstName') ?
                model.firstName :
                ''
        );

        dumpSafeModel.lastName = (
            model.hasOwnProperty('lastName') ?
                model.lastName :
                ''
        );

        dumpSafeModel.email = (
            model.hasOwnProperty('email') ?
                model.email :
                ''
        );

        callback(false, dumpSafeModel);

    };

    model.createDbExportObject = function(skipId, callback){

        var exportObject = {};

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

    model.loadDumpSafeUserFromId = function(id, callback){
        model.loadFromId(id, 'user', model, null, function(err, user){
            model.loadDumpSafeObjectFromModel(user, callback);
        });
    };

    model.login = function(email, password, callback){
        if(email == '' || password == ''){
            callback(false, null);
        } else {
            GLOBAL.dbPool.getConnection(function(err, connection){
                var sql = 'SELECT id, password_hash FROM user WHERE email = ?';
                connection.query(sql, email, function(err, rows){
                    if(err){
                        console.log(err);
                        callback(err, model);
                    } else {
                        if(rows.length == 0) {
                            callback(false, null);
                        } else {
                            GLOBAL.defs.HashHelper.EmailPasswordHashMatch(
                                rows[0].password_hash,
                                email,
                                password,
                                function(success){
                                    if(success){
                                        model.loadFromId(
                                            rows[0].id,
                                            model.TABLE_NAME,
                                            model,
                                            null,
                                            function(err, usermodel){
                                                // TODO set cookie
                                                callback(true, usermodel);
                                            }
                                        );
                                    } else {
                                        callback(false, null);
                                    }
                                }
                            );
                        }
                    }
                    connection.release();
                });
            });
        }
    };

    model.checkUserTokenHash = function(userTokenHash, callback){
        if(userTokenHash == ''){
            callback(false, null);
        } else {
            GLOBAL.dbPool.getConnection(function(err, connection){
                var sql = 'SELECT id FROM user WHERE user_token_hash = ?';
                connection.query(sql, userTokenHash, function(err, rows){
                    if(err){
                        console.log(err);
                        callback(err, model);
                    } else {
                        if(rows.length == 0) {
                            callback(false, null);
                        } else {
                            model.loadFromId(
                                rows[0].id,
                                model.TABLE_NAME,
                                model,
                                null,
                                function(err, usermodel){
                                    callback(true, usermodel);
                                }
                            );
                        }
                    }
                    connection.release();
                });
            });
        }
    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(id, model, callback);
    } else if(id != null) {
        model.loadFromId(id, 'user', model, null, callback);
    } else {
        callback(null, model);
    }

};