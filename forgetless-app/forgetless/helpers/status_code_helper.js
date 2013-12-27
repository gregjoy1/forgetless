// TODO populate this...
module.exports.StatusCodes = {
    // Generic error status... (shouldn't be used)
    "UNKNOWN_ERROR" : {
        "code"          : 0,
        "description"   : "Unknown error.",
        "error"         : true
    },

    // User orientated Errors
    "NOT_LOGGED_IN" : {
        "code"          : 1,
        "description"   : "Not logged in.",
        "error"         : true
    },
    "INCORRECT_LOGIN_CREDENTIALS" : {
        "code"          : 2,
        "description"   : "Incorrect login credentials.",
        "error"         : true
    },
    "INCORRECT_USER_PRIVILEGES" : {
        "code"          : 3,
        "description"   : "Incorrect user privileges.",
        "error"         : true
    },

    // User orientated Statuses
    "CORRECT_LOGIN_CREDENTIALS" : {
        "code"          : 4,
        "description"   : "Correct login credentials.",
        "error"         : false
    },
    "CORRECT_USER_PRIVILEGES" : {
        "code"          : 5,
        "description"   : "Correct user privileges.",
        "error"         : false
    }

};

module.exports.GenerateStatusCodeJSONString = function(code, callback) {
    this.GetStatusCode(code, function(object) {
        callback(JSON.stringify(object));
    });
};

module.exports.GetStatusCode = function(code, callback) {
    if(typeof code == "string") {
        if(this.StatusCodes[code] != undefined) {
            callback(this.StatusCodes[code]);
        } else {
            callback(this.StatusCodes["UNKNOWN_ERROR"]);
        }
    } else {
        callback(code);
    }
};