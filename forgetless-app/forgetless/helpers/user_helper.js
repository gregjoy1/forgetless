module.exports = {
    Login:function(email, password, response, callback){
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
                                        new GLOBAL.defs.User(null, null, function(err, user) {
                                            user.loadFromId(
                                                rows[0].id,
                                                user.TABLE_NAME,
                                                user,
                                                null,
                                                function(err, userModel){
                                                    userModel.generateNewUserToken(function(userModel) {
                                                        userModel.save(function(err) {
                                                            if(err) {
                                                                // TODO add real logging...
                                                                console.log(err);
                                                                callback(false, null);
                                                            } else {
                                                                if(response != undefined) {

                                                                    response.cookie(
                                                                        'usertoken',
                                                                        userModel.userTokenHash
//                                                                        {
                                                                            // TODO check this out..
//                                                                            expires: new Date(Date.now() + 900000),
//                                                                            maxAge: 99999
//                                                                        }
                                                                    );
                                                                    callback(true, userModel);
                                                                }
                                                            }
                                                        })
                                                    });
                                                }
                                            );
                                        });
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
    },
    LoginWithUserToken:function(userTokenHash, callback){
        if(userTokenHash == ''){
            callback(false, null);
        } else {
            console.log('testing');
            GLOBAL.dbPool.getConnection(function(err, connection){
                console.log('testing2');
                var sql = 'SELECT id FROM user WHERE user_token_hash = ?';
                connection.query(sql, userTokenHash, function(err, rows){
                    if(err){
                        console.log(err);
                        callback(err, model);
                    } else {
                        if(rows.length == 0) {
                            callback(false, null);
                        } else {
                            new GLOBAL.defs.User(null, null, function(err, user) {
                                user.loadFromId(
                                    rows[0].id,
                                    user.TABLE_NAME,
                                    user,
                                    null,
                                    function(err, userModel){
                                        callback(true, userModel);
                                    }
                                );
                            });
                        }
                    }
                    connection.release();
                });
            });
        }
    },
    IsUserLoggedIn:function(request, callback){
        var userToken = request.cookies.usertoken;
        if(userToken != null) {
            this.LoginWithUserToken(userToken, callback);
        } else {
            callback(false, null);
        }
    }

};