module.exports = {
    FindItemStack: function(userId, listId, itemId, callback) {
        var sql = 'SELECT id, item_id FROM item_link WHERE user_id = ? AND item_id = ? AND list_id = ?';

        var escapeArray = [userId, itemId, listId];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err, rows){
                if(err) {
                    callback(err, null);
                } else if(rows.length == 0) {
                    callback('Empty Result Set', null);
                } else {
                    GLOBAL.defs.ItemLink(rows[0].id, null, function(err, itemLink) {
                        if(err) {
                            callback(err, null);
                        } else {
                            GLOBAL.defs.Item(rows[0].item_id, null, function(err, item) {
                                if(err) {
                                    callback(err, null);
                                } else {
                                    itemLink.Item = item;
                                    callback(null, itemLink);
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    CreateAndAssociateItemToList: function(userId, listId, title, content, duration, deadline, itemType, callback) {
        GLOBAL.defs.Item.createNewItem(title, content, duration, deadline, itemType, userId, function(err, item) {
            if(err) {
                callback(err, null);
            } else {
                GLOBAL.defs.ItemLink.createNewItemLink(userId, item.id, listId, function(err, itemLink) {
                    if(err) {
                        callback(err, null);
                    } else {
                        itemLink.Item = item;
                        callback(err, itemLink);
                    }
                });
            }
        });
    },
    UpdateItemStack: function(itemId, userId, listId, title, content, duration, deadline, itemType, callback) {
        this.FindItemStack(userId, listId, itemId, function(err, itemLink) {

            if(title != null) {
                itemLink.title = title;
            }

            if(content != null) {
                itemLink.Item.content = content;
            }

            if(duration != null) {
                itemLink.Item.duration = duration;
            }

            if(deadline != null) {
                itemLink.Item.deadline = deadline;
            }

            if(itemType != null) {
                itemLink.Item.itemType = itemType;
            }

            // if nothing has changed, then dont save...
            GLOBAL.async.waterfall(
                [
                    function(callback) {
                        if(title != null) {
                            itemLink.save(function(err) {
                                callback(err);
                            });
                        } else {
                            callback(null);
                        }
                    },
                    function(callback) {
                        if((content || duration || deadline || itemType) != null) {
                            itemLink.Item.save(function(err) {
                                callback(err);
                            });
                        } else {
                            callback(null);
                        }
                    }
                ],
                function(err) {
                    callback(err, itemLink);
                }
            );

        });
    },
    AssociatePreExistingItemToList: function(userId, listId, itemId, callback) {
        GLOBAL.defs.Item(itemId, null, function(err, item) {
            if(err) {
                callback(err, null);
            } else {
                GLOBAL.defs.ItemLink.createNewItemLink(userId, itemId, listId, function(err, itemLink) {
                    if(err) {
                        callback(err, null);
                    } else {
                        itemLink.Item = item;
                        callback(err, itemLink);
                    }
                });
            }
        });
    },
    RemoveItemAssociationToList: function(userId, listId, itemId, callback) {
        var sql = 'DELETE FROM item_link WHERE user_id = ? AND item_id = ? AND list_id = ?';

        var escapeArray = [userId, itemId, listId];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err){
                callback(err);
            });
        });
    },
    AssociateListOfItemsToUser: function(userId, fromUserId, listId, callback) {
        var sql = 'SELECT item_id FROM item_link WHERE user_id = ? AND list_id = ?';

        var escapeArray = [fromUserId, listId];

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
                        var itemLinks = [];
                        for(var inc = 0; inc < rows.length; inc++) {
                            this.AssociatePreExistingItemToList(
                                userId,
                                listId,
                                rows[inc].item_id,
                                function(item) {
                                    itemLinks.push(item);
                                    if(itemLinks.length == rows.length) {
                                        callback(false, itemLinks);
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