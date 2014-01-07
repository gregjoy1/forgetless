module.exports = {

    /*
    * ============================================================================
    * STACK CONTROLLERS
    * ============================================================================
    */

    // Dumps full stack
    stackDump: function(request, response){
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
    },

    /*
     * ============================================================================
     * USER CONTROLLERS
     * ============================================================================
     */

    // Logs user in
    login: function(request, response){

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
    },
    // checks if a user is logged in
    checkUser: function(request, response, callback) {
        GLOBAL.defs.UserHelper.IsUserLoggedIn(request, callback);
    },
    // checks if a user is logged in and returns status
    displayUserLoginStatus: function(request, response) {
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
    },

    /*
     * ============================================================================
     * ITEM CONTROLLERS
     * ============================================================================
     */

    // creates an item
    createItem: function(request, response) {

        // declare validation
        var expectedFields = [
            {
                name: 'userId',
                type: 'number',
                required: true
            },
            {
                name: 'listId',
                type: 'number',
                required: true
            },
            {
                name: 'content',
                type: 'string',
                required: false
            },
            {
                name: 'duration',
                type: 'number',
                required: false
            },
            {
                name: 'deadline',
                type: 'number',
                required: false
            },
            {
                name: 'title',
                type: 'string',
                required: true
            },
            {
                name: 'itemType',
                type: 'number',
                required: true
            }
        ];

        GLOBAL.defs.HTTPHelper.ValidateAndCollatePOSTSubmission(
            request,
            expectedFields,
            function(success, obj) {
                // if all required fields are posted then yay!
                if(success) {
                    GLOBAL.defs.ItemHelper.CreateAndAssociateItemToList(
                        obj.userId,
                        obj.listId,
                        obj.title,
                        obj.content,
                        obj.duration,
                        obj.deadline,
                        obj.itemType,
                        function(err, itemLink) {
                            if(err) {
                                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                                    GLOBAL.defs.StatusCodeHelper.UNABLE_TO_CREATE_AND_ASSOCIATE_ITEM,
                                    err,
                                    function(status) {
                                        response.end(status);
                                    }
                                );
                            } else {
                                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                                    GLOBAL.defs.StatusCodeHelper.ITEM_CREATED_AND_ASSOCIATED_SUCCESSFULLY,
                                    itemLink,
                                    function(status) {
                                        response.end(status);
                                    }
                                );
                            }
                        }
                    );
                } else {
                    // TODO consider logging these?
                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                        GLOBAL.defs.StatusCodeHelper.INCORRECT_FORM_SUBMISSION,
                        request.body,
                        function(status) {
                            response.end(status);
                        }
                    );
                }
            }
        );

    },
    updateItem: function(request, response) {

        // declare validation
        var expectedFields = [
            {
                name: 'itemId',
                type: 'number',
                required: true
            },
            {
                name: 'userId',
                type: 'number',
                required: true
            },
            {
                name: 'listId',
                type: 'number',
                required: true
            },
            {
                name: 'title',
                type: 'string',
                required: false
            },
            {
                name: 'content',
                type: 'string',
                required: false
            },
            {
                name: 'duration',
                type: 'number',
                required: false
            },
            {
                name: 'deadline',
                type: 'number',
                required: false
            },
            {
                name: 'itemType',
                type: 'number',
                required: false
            }
        ];

        GLOBAL.defs.HTTPHelper.ValidateAndCollatePOSTSubmission(
            request,
            expectedFields,
            function(success, obj) {
                if(success) {
                    GLOBAL.defs.ItemHelper.UpdateItemStack(
                        obj.itemId,
                        obj.userId,
                        obj.listId,
                        obj.title,
                        obj.content,
                        obj.duration,
                        obj.deadline,
                        obj.itemType,
                        function(err, itemStack) {
                            if(err) {
                                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                                    GLOBAL.defs.StatusCodeHelper.UNABLE_TO_FIND_AND_UPDATE_ITEM,
                                    err,
                                    function(status) {
                                        response.end(status);
                                    }
                                );
                            } else {
                                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                                    GLOBAL.defs.StatusCodeHelper.ITEM_FOUND_AND_UPDATED_SUCCESSFULLY,
                                    itemStack,
                                    function(status) {
                                        response.end(status);
                                    }
                                );
                            }
                        }
                    );
                } else {
                    // TODO consider logging these?
                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                        GLOBAL.defs.StatusCodeHelper.INCORRECT_FORM_SUBMISSION,
                        request.body,
                        function(status) {
                            response.end(status);
                        }
                    );
                }
            }
        );
    },
    // creates an item association to link
    linkPreExistingItemToList: function(request, response) {

        var userId, listId, itemId;

        GLOBAL.defs.AssociatePreExistingItemToList(userId, listId, itemId, function(err, itemLink) {
            if(err) {
                // TODO logging...
                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.UNABLE_TO_FIND_PREEXISTING_ITEM,
                    err,
                    function(status) {
                        response.end(status);
                    }
                );
            } else {
                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.ITEM_FOUND_AND_ASSOCIATED_SUCCESSFULLY,
                    itemLink,
                    function(status) {
                        response.end(status);
                    }
                );
            }
        });
    },
    // removes item association
    removeLinkToPreExistingItem: function(request, response) {

        var userId, listId, itemId;

        GLOBAL.defs.ItemHelper.RemoveItemAssociationToList(userId, listId, itemId, function(err) {
            if(err) {
                // TODO logging...
                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.UNABLE_TO_REMOVE_ITEM_ASSOCIATION,
                    err,
                    function(status) {
                        response.end(status);
                    }
                );
            } else {
                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.ITEM_FOUND_AND_REMOVED_SUCCESSFULLY,
                    GLOBAL.defs.StatusCodeHelper.ITEM_FOUND_AND_REMOVED_SUCCESSFULLY.description,
                    function(status) {
                        response.end(status);
                    }
                );
            }
        });
    },
    // copies all item associations from one users list to another
    linkAllItemsInListToUser: function(request, response) {

        var userId, fromUserId, listId;

        GLOBAL.defs.ItemHelper.AssociateListOfItemsToUser(userId, fromUserId, listId, function(err, itemLinks) {

            if(err) {

                var logDetails = JSON.stringify({
                    location:       'AssociateListOfItemsToUser',
                    'userId':       userId,
                    'fromUserId':   fromUserId,
                    'listId':       listId,
                    'error':        err
                });

                GLOBAL.defs.LogHelper.WriteToLog(logDetails, function() {
                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                        GLOBAL.defs.StatusCodeHelper.UNABLE_TO_FIND_PREEXISTING_ITEM,
                        err,
                        function(status) {
                            response.end(status);
                        }
                    );
                });
            } else {
                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.ITEMS_FOUND_AND_ASSOCIATED_SUCCESSFULLY,
                    itemLinks,
                    function(status) {
                        response.end(status);
                    }
                );
            }
        })
    },

    /*
     * ============================================================================
     * LIST CONTROLLERS
     * ============================================================================
     */

    createList: function(request, response) {

        var userId, categoryId, title, parentListId, description;

        GLOBAL.defs.ListHelper.CreateAndAssociateListToCategory(
            userId,
            categoryId,
            title,
            parentListId,
            description,
            function(err, listLink) {
                if(err) {
                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                        GLOBAL.defs.StatusCodeHelper.UNABLE_TO_CREATE_AND_ASSOCIATE_LIST,
                        err,
                        function(status) {
                            response.end(status);
                        }
                    );
                } else {
                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                        GLOBAL.defs.StatusCodeHelper.LIST_CREATED_AND_ASSOCIATED_SUCCESSFULLY,
                        listLink,
                        function(status) {
                            response.end(status);
                        }
                    );
                }
            }
        );
    },
    linkPreExistingListToCategory: function(request, response) {

        var userId, fromUserId, listId, categoryId, parentListId;

        GLOBAL.defs.ListHelper.AssociatePreExistingListToCategory(
            userId,
            fromUserId,
            listId,
            categoryId,
            parentListId,
            function(err, listLink) {
                if(err) {
                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                        GLOBAL.defs.StatusCodeHelper.UNABLE_TO_TO_FIND_PREEXISTING_LIST,
                        err,
                        function(status) {
                            response.end(status);
                        }
                    );
                } else {
                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                        GLOBAL.defs.StatusCodeHelper.LIST_FOUND_AND_ASSOCIATED_SUCCESSFULLY,
                        listLink,
                        function(status) {
                            response.end(status);
                        }
                    );
                }
            }
        );
    },
    removeLinkToPreExistingList: function(request, response) {

        var userId, listId;

        GLOBAL.defs.ListHelper.RemoveListAssociationToCategory(userId, listId, function(err) {
            if(err) {
                GLOBAL.defs.StackHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.UNABLE_TO_REMOVE_LIST_ASSOCIATION,
                    err,
                    function(status) {
                        response.end(status);
                    }
                );
            } else {
                GLOBAL.defs.StackHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.LIST_FOUND_AND_REMOVED_SUCCESSFULLY,
                    GLOBAL.defs.StatusCodeHelper.LIST_FOUND_AND_REMOVED_SUCCESSFULLY.description,
                    function(status) {
                        response.end(status);
                    }
                );
            }
        });
    },

    /*
     * ============================================================================
     * CATEGORY CONTROLLERS
     * ============================================================================
     */

    createCategory: function(request, response) {

        var title, categoryId, userId;

        GLOBAL.defs.CategoryHelper.CreateAndAssociateCategoryToUser(
            title,
            categoryId,
            userId,
            function(err, categoryLink) {
                if(err) {
                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                        GLOBAL.defs.StatusCodeHelper.UNABLE_TO_CREATE_AND_ASSOCIATE_CATEGORY,
                        err,
                        function(status) {
                            response.end(status);
                        }
                    );
                } else {
                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                        GLOBAL.defs.StatusCodeHelper.CATEGORY_CREATED_AND_ASSOCIATED_SUCCESSFULLY,
                        categoryLink,
                        function(status) {
                            response.end(status);
                        }
                    );
                }
            }
        );
    },
    linkPreExistingCategoryToUser: function(request, response) {

        var userId, categoryId;

        GLOBAL.defs.CategoryHelper.AssociatePreExistingCategoryToUser(
            userId,
            categoryId,
            function(err, categoryLink) {
                if(err) {
                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                        GLOBAL.defs.StatusCodeHelper.UNABLE_TO_FIND_PREEXISTING_CATEGORY,
                        err,
                        function(status) {
                            response.end(status);
                        }
                    );
                } else {
                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                        GLOBAL.defs.StatusCodeHelper.CATEGORY_FOUND_AND_ASSOCIATED_SUCCESSFULLY,
                        categoryLink,
                        function(status) {
                            response.end(status);
                        }
                    );
                }
            }
        );
    },
    removeLinkToPreExistingCategory: function(request, response) {

        var userId, categoryId;

        GLOBAL.defs.CategoryHelper.RemoveCategoryAssociationToUser(userId, categoryId, function(err) {
            if(err) {
                GLOBAL.defs.StackHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.UNABLE_TO_REMOVE_CATEGORY_ASSOCIATION,
                    err,
                    function(status) {
                        response.end(status);
                    }
                );
            } else {
                GLOBAL.defs.StackHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.CATEGORY_FOUND_AND_REMOVED_SUCCESSFULLY,
                    GLOBAL.defs.StatusCodeHelper.CATEGORY_FOUND_AND_REMOVED_SUCCESSFULLY.description,
                    function(status) {
                        response.end(status);
                    }
                );
            }
        });
    }
};