// TODO populate this...
module.exports.StatusCodes = {
    // Generic error status...
    "UNKNOWN_ERROR" : {
        "code"          : 'GE-0',
        "description"   : "Unknown error.",
        "error"         : true
    },

    "INCORRECT_FORM_SUBMISSION" : {
        "code"          : 'GE-1',
        "description"   : "Incorrect form submission.",
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
    "LOGGED_IN" : {
        "code"          : 'US-1',
        "description"   : "User logged in.",
        "error"         : false
    },
    "CORRECT_LOGIN_CREDENTIALS" : {
        "code"          : 'US-2',
        "description"   : "Correct login credentials.",
        "error"         : false
    },
    "CORRECT_USER_PRIVILEGES" : {
        "code"          : 'US-3',
        "description"   : "Correct user privileges.",
        "error"         : false
    },

    // Stack Related errors
    "UNABLE_TO_DUMP_STACK" : {
        "code"          : 'SE-1',
        "description"   : "Unable to dump stack.",
        "error"         : true
    },

    // Stack Related statuses
    "STACK_DUMPED_SUCCESSFULLY" : {
        "code"          : 'SS-1',
        "description"   : "Stack dumped successfully.",
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
    "UNABLE_TO_FIND_PREEXISTING_ITEM" : {
        "code"          : 'IE-4',
        "description"   : "Unable to find pre-existing item.",
        "error"         : true
    },
    "UNABLE_TO_FIND_PREEXISTING_ITEMS" : {
        "code"          : 'IE-5',
        "description"   : "Unable to find pre-existing items.",
        "error"         : true
    },
    "UNABLE_TO_FIND_AND_UPDATE_ITEM" : {
        "code"          : 'IE-6',
        "description"   : "Unable to find and update item.",
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
        "description"   : "Item created and associated successfully.",
        "error"         : false
    },
    "ITEM_FOUND_AND_REMOVED_SUCCESSFULLY" : {
        "code"          : 'IS-3',
        "description"   : "Item found and removed successfully.",
        "error"         : false
    },
    "ITEM_FOUND_AND_ASSOCIATED_SUCCESSFULLY" : {
        "code"          : 'IS-4',
        "description"   : "Item found and associated item successfully.",
        "error"         : false
    },
    "ITEMS_FOUND_AND_ASSOCIATED_SUCCESSFULLY" : {
        "code"          : 'IS-5',
        "description"   : "Items found and associated items successfully.",
        "error"         : false
    },
    "ITEM_FOUND_AND_UPDATED_SUCCESSFULLY" : {
        "code"          : 'IS-6',
        "description"   : "Item found and updated item successfully.",
        "error"         : false
    },


    // List helper orientated errors
    "UNABLE_TO_CREATE_LIST" : {
        "code"          : 'LE-1',
        "description"   : "Unable to create list.",
        "error"         : true
    },
    "UNABLE_TO_CREATE_AND_ASSOCIATE_LIST" : {
        "code"          : 'LE-2',
        "description"   : "Unable to create and associate list.",
        "error"         : true
    },
    "UNABLE_TO_REMOVE_LIST_ASSOCIATION" : {
        "code"          : 'LE-3',
        "description"   : "Unable to remove list association.",
        "error"         : true
    },
    "UNABLE_TO_FIND_PREEXISTING_LIST" : {
        "code"          : 'LE-4',
        "description"   : "Unable to find pre-existing list.",
        "error"         : true
    },
    "UNABLE_TO_FIND_AND_UPDATE_LIST" : {
        "code"          : 'LE-5',
        "description"   : "Unable to find and update list.",
        "error"         : true
    },



    // List helper orientated statuses
    "LIST_CREATED_SUCCESSFULLY" : {
        "code"          : 'LS-1',
        "description"   : "List created successfully.",
        "error"         : false
    },
    "LIST_CREATED_AND_ASSOCIATED_SUCCESSFULLY" : {
        "code"          : 'LS-2',
        "description"   : "List created and associated item successfully.",
        "error"         : false
    },
    "LIST_FOUND_AND_REMOVED_SUCCESSFULLY" : {
        "code"          : 'LS-3',
        "description"   : "List found and removed successfully.",
        "error"         : false
    },
    "LIST_FOUND_AND_ASSOCIATED_SUCCESSFULLY" : {
        "code"          : 'LS-4',
        "description"   : "List found and associated item successfully.",
        "error"         : false
    },
    "LIST_FOUND_AND_UPDATED_SUCCESSFULLY" : {
        "code"          : 'LS-5',
        "description"   : "List found and updated item successfully.",
        "error"         : false
    },

    // Category helper orientated errors
    "UNABLE_TO_CREATE_CATEGORY" : {
        "code"          : 'CE-1',
        "description"   : "Unable to create category.",
        "error"         : true
    },
    "UNABLE_TO_CREATE_AND_ASSOCIATE_CATEGORY" : {
        "code"          : 'CE-2',
        "description"   : "Unable to create and associate category.",
        "error"         : true
    },
    "UNABLE_TO_REMOVE_CATEGORY_ASSOCIATION" : {
        "code"          : 'CE-3',
        "description"   : "Unable to remove category association.",
        "error"         : true
    },
    "UNABLE_TO_FIND_PREEXISTING_CATEGORY" : {
        "code"          : 'CE-4',
        "description"   : "Unable to find pre-existing category.",
        "error"         : true
    },
    "UNABLE_TO_FIND_AND_UPDATE_CATEGORY" : {
        "code"          : 'CE-5',
        "description"   : "Unable to find and update category.",
        "error"         : true
    },


    // Category helper orientated statuses
    "CATEGORY_CREATED_SUCCESSFULLY" : {
        "code"          : 'CS-1',
        "description"   : "Category created successfully.",
        "error"         : false
    },
    "CATEGORY_CREATED_AND_ASSOCIATED_SUCCESSFULLY" : {
        "code"          : 'CS-2',
        "description"   : "Category created and associated item successfully.",
        "error"         : false
    },
    "CATEGORY_FOUND_AND_REMOVED_SUCCESSFULLY" : {
        "code"          : 'CS-3',
        "description"   : "Category found and removed successfully.",
        "error"         : false
    },
    "CATEGORY_FOUND_AND_ASSOCIATED_SUCCESSFULLY" : {
        "code"          : 'CS-4',
        "description"   : "Category found and associated item successfully.",
        "error"         : false
    },
    "CATEGORY_FOUND_AND_UPDATED_SUCCESSFULLY" : {
        "code"          : 'CS-5',
        "description"   : "Category found and updated item successfully.",
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