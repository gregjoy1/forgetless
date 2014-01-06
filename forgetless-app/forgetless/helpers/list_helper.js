// TODO redo this like item helper
module.exports = {
    FindListStack: function(userId, categoryId, listId, callback) {
        var sql = "SELECT id, list_id FROM list_link WHERE user_id = ? AND list_id = ? AND category_id = ?";

        var escapeArray = [userId, listId, categoryId];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err, rows){
                if(err) {
                    callback(err, null);
                } else if(rows.length == 0) {
                    callback('Empty Result Set', null);
                } else {
                    GLOBAL.defs.ListLink(rows[0].id, null, function(err, listLink) {
                        if(err) {
                            callback(err, null);
                        } else {
                            GLOBAL.defs.List(rows[0].list_id, null, function(err, list) {
                                if(err) {
                                    callback(err, null);
                                } else {
                                    listLink.List = list;
                                    callback(null, listLink);
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    CreateAndAssociateListToCategory: function(userId, categoryId, title, parentListId, description, callback) {
        GLOBAL.defs.List.createNewList(title, description, userId, function(err, list) {
            if(err) {
                callback(err, null);
            } else {
                GLOBAL.defs.ListLink.createNewListLink(title, userId, parentListId, list.id, categoryId, function(err, listLink) {
                    if(err) {
                        callback(err, null);
                    } else {
                        listLink.List = list;
                        callback(err, listLink);
                    }
                });
            }
        });
    },
    UpdateListStack: function(userId, listId, categoryId, title, parentListId, description, callback) {
        this.FindListStack(userId, categoryId, listId, function(err, listLink) {

            if(title != null) {
                listLink.title = title;
            }

            if(parentListId != null) {
                listLink.parentListId = parentListId;
            }

            if(description != null) {
                listLink.List.description = description;
            }

            // if nothing has changed, then dont save...
            GLOBAL.async.waterfall(
                [
                    function(callback) {
                        if((title || parentListId) != null) {
                            listLink.save(function(err) {
                                callback(err);
                            });
                        } else {
                            callback(null);
                        }
                    },
                    function(callback) {
                        if(description != null) {
                            listLink.List.save(function(err) {
                                callback(err);
                            });
                        } else {
                            callback(null);
                        }
                    }
                ],
                function(err) {
                    callback(err, listLink);
                }
            );
        });
    },
    AssociatePreExistingListToCategory: function(userId, fromUserId, listId, categoryId, parentListId, callback) {
        GLOBAL.defs.List(listId, null, function(err, list) {
            if(err) {
                callback(err, null);
            } else {
                GLOBAL.defs.ListLink.createNewListLink(list.title, userId, parentListId, listId, categoryId, function(err, listLink) {
                    if(err) {
                        callback(err, null);
                    } else {
                        listLink.List = list;
                        GLOBAL.defs.ItemHelper.AssociateListOfItemsToUser(
                            userId,
                            fromUserId,
                            listId,
                            function(err, itemLinks) {
                                listLink.List.ItemLink = itemLinks;
                                callback(err, listLink);
                            }
                        );
                    }
                });
            }
        });
    },
    RemoveListAssociationToCategory: function(userId, listId, callback) {
        // using waterfall as 2 step process
        GLOBAL.async.waterfall(
            [
                // query finds all items linked to list that linked and uses helper method
                // to delete items
                function(callback) {
                    var sql = 'SELECT id FROM item_link WHERE user_id = ? AND list_id = ?';

                    var escapeArray = [userId, listId];

                    GLOBAL.dbPool.getConnection(function(err, connection){
                        connection.query(sql, escapeArray, function(err, rows){
                            var errors = [];
                            for(var inc = 0; inc <  rows.length; inc++) {
                                GLOBAL.defs.ItemHelper.RemoveItemAssociationToList(userId, listId, rows[inc].id, function(err) {
                                    if(err) {
                                        errors.push(err);
                                    }
                                    if(inc == (rows.length - 1)) {
                                        callback((errors.length > 0 ? errors : null));
                                    }
                                });
                            }
                        });
                    });
                },
                // deletes list link
                function(callback) {
                    var sql = 'DELETE FROM list_link WHERE user_id = ? AND list_id = ?';

                    var escapeArray = [userId, listId];

                    GLOBAL.dbPool.getConnection(function(err, connection){
                        connection.query(sql, escapeArray, function(err){
                            if(err) {
                                errors.push(err);
                            }
                            callback((errors.length > 0 ? errors : null));
                        });
                    });
                }
            ],
            function(err) {
                callback(err)
            }
        );
    },
    AssociateCategoryOfListsToUser: function(userId, fromUserId, categoryId, callback) {
        var sql = 'SELECT list_id FROM list_link WHERE user_id = ? AND category_id = ?';

        var escapeArray = [fromUserId, categoryId];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err, rows){
                if(err) {
                    callback(err, null);
                } else if(rows.length == 0){
                    callback('Empty Result Set', null);
                } else {
                    if(rows.length == 0) {
                        callback(err, null);
                    } else {
                        var listLinks = [];
                        for(var inc = 0; inc < rows.length; inc++) {
                            this.AssociatePreExistingListToCategory(
                                userId,
                                fromUserId,
                                rows[inc].list_id,
                                categoryId,
                                '',
                                function(list) {
                                    listLinks.push(list);
                                    if(listLinks.length == rows.length) {
                                        callback(false, listLinks);
                                    }
                                }
                            );
                        }
                    }
                }
            });
        });
    }
};