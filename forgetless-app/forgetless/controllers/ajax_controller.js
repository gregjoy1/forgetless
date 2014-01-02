module.exports.stackDump = function(request, response){
    // checks if user is logged in and provides user object for dumping stack
    module.exports.checkUser(request, response, function(success, user) {
        if(success) {
            GLOBAL.defs.StackHelper.getCompleteJSONStackDump(user.id, function(err, stackDump) {
                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.StatusCodes.LOGGED_IN,
                    stackDump,
                    function(status) {
                        response.end(status);
                        console.log(status);
                    }
                );
            });
        // if no one is logged in, sends not logged in JSON encoded error status object
        } else {
            GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                GLOBAL.defs.StatusCodeHelper.StatusCodes.NOT_LOGGED_IN,
                'No user is currently logged in.',
                function(errorJSONString) {
                    response.end(errorJSONString);
                }
            );
        }
    });
};

module.exports.login = function(request, response){

    this.checkUser(request, response, function(success, user) {
        if(success) {
            user.loadDumpSafeObjectFromModel(user, function(err, dumpSafeUser) {
                response.end(JSON.stringify(dumpSafeUser));
            });
        } else {
            // Checks if logging in with a user token
            if(request.cookies.usertoken != null) {
                // checks if the user token is actually correct
                this.checkUser(request, response, function(success, user) {
                    // if so, it JSON encodes limited user object (to avoid sending pw hashes etc)
                    if(success) {
                        user.loadDumpSafeObjectFromModel(user, function(err, dumpSafeUser) {
                            response.end(JSON.stringify(dumpSafeUser));
                        });
                        // else sends JSON encoded error status object
                    } else {
                        GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                            GLOBAL.defs.StatusCodeHelper.StatusCodes.NOT_LOGGED_IN,
                            'No user is currently logged in.',
                            function(errorJSONString) {
                                response.end(errorJSONString);
                            }
                        );
                    }
                });
            } else {
                var email = request.body.email;
                var password = request.body.password;
                // checks if email and password have actually been sent correctly
                if(email == undefined || password == undefined) {
                    // if not, it JSON encodes error status to tell frontend
                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                        GLOBAL.defs.StatusCodeHelper.StatusCodes.INCORRECT_LOGIN_CREDENTIALS,
                        'No user is currently logged in.',
                        function(errorJSONString) {
                            response.end(errorJSONString);
                        }
                    );
                    // else if all good, then attempts login with provided credentials
                } else {
                    GLOBAL.defs.UserHelper.Login(email, password, response, function(success, user) {
                        // if so, it JSON encodes limited user object (to avoid sending pw hashes etc)
                        if(success) {
                            user.loadDumpSafeObjectFromModel(user, function(err, dumpSafeUser) {
                                console.log(dumpSafeUser);
                                response.end(JSON.stringify(dumpSafeUser));
                            });
                            // else sends JSON encoded error status object
                        } else {
                            GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                                GLOBAL.defs.StatusCodeHelper.StatusCodes.INCORRECT_LOGIN_CREDENTIALS,
                                'No user is currently logged in.',
                                function(errorJSONString) {
                                    response.end(errorJSONString);
                                }
                            );
                        }
                    });
                }
            }
        }

    });
};

module.exports.checkUser = function(request, response, callback) {
    GLOBAL.defs.UserHelper.IsUserLoggedIn(request, callback);
};

module.exports.displayUserLoginStatus = function(request, response) {
    module.exports.checkUser(request, response, function(success, user) {
        if(success) {
            // if logged in, returns dump safe user model (to avoid sending hashes etc)
            user.loadDumpSafeObjectFromModel(user, function(err, dumpSafeUser) {
                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.StatusCodes.LOGGED_IN,
                    dumpSafeUser,
                    function(errorJSONString) {
                        response.end(errorJSONString);
                    }
                );
            });
            // if no one is logged in, sends not logged in JSON encoded error status object
        } else {
            GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                GLOBAL.defs.StatusCodeHelper.StatusCodes.NOT_LOGGED_IN,
                'No user is currently logged in.',
                function(errorJSONString) {
                    response.end(errorJSONString);
                }
            );
        }
    });
};