// TODO populate this...
module.exports.StatusCodes = {
    // Generic error status... (shouldn't be used)
    "UNKNOWN_ERROR" : {
        "code"          : 'GE-0',
        "description"   : "Unknown error.",
        "error"         : true
    },

    // User orientated Errors
    "NOT_LOGGED_IN" : {
        "code"          : 'UE-1',
        "description"   : "Not logged in.",
        "error"         : true
    },
    "INCORRECT_LOGIN_CREDENTIALS" : {
        "code"          : 'UE-2',
        "description"   : "Incorrect login credentials.",
        "error"         : true
    },
    "INCORRECT_USER_PRIVILEGES" : {
        "code"          : 'UE-3',
        "description"   : "Incorrect user privileges.",
        "error"         : true
    },

    // User orientated Statuses
    "CORRECT_LOGIN_CREDENTIALS" : {
        "code"          : 'US-1',
        "description"   : "Correct login credentials.",
        "error"         : false
    },
    "CORRECT_USER_PRIVILEGES" : {
        "code"          : 'US-2',
        "description"   : "Correct user privileges.",
        "error"         : false
    },

    // Item helper orientated errors
    "UNABLE_TO_CREATE_ITEM" : {
        "code"          : 'IE-1',
        "description"   : "Unable to create item.",
        "error"         : true
    },
    "UNABLE_TO_CREATE_AND_ASSOCIATE_ITEM" : {
        "code"          : 'IE-2',
        "description"   : "Unable to create and associate item.",
        "error"         : true
    },
    "UNABLE_TO_REMOVE_ITEM_ASSOCIATION" : {
        "code"          : 'IE-3',
        "description"   : "Unable to remove item association.",
        "error"         : true
    },
    "UNABLE_TO_TO_FIND_PREEXISTING_ITEM" : {
        "code"          : 'IE-4',
        "description"   : "Unable to find pre-existing item.",
        "error"         : true
    },

    // Item helper orientated statuses
    "ITEM_CREATED_SUCCESSFULLY" : {
        "code"          : 'IS-1',
        "description"   : "Item created successfully.",
        "error"         : false
    },
    "ITEM_CREATED_AND_ASSOCIATED_SUCCESSFULLY" : {
        "code"          : 'IS-2',
        "description"   : "Item created and associated item successfully.",
        "error"         : false
    },
    "ITEM_FOUND_AND_ASSOCIATED_SUCCESSFULLY" : {
        "code"          : 'IS-3',
        "description"   : "Item found and associated item successfully.",
        "error"         : false
    }

};

module.exports.GenerateStatusCodeJSONString = function(code, details, callback) {
    this.GetStatusCode(code, function(object) {
        object.details = details;
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