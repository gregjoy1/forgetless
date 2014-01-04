module.exports = {
    CreateAndAssociateItemToList: function(userId, listId, title, content, duration, deadline, itemType, callback) {
        GLOBAL.defs.Item.createNewItem(title, content, duration, deadline, itemType, userId, function(item) {
            GLOBAL.defs.ItemLink.createNewItemLink(userId, item.id, listId, function(itemLink) {
                itemLink.Item = item;
                callback(itemLink);
            });
        });
    },
    AssociatePreExistingItemToList: function(userId, listId, itemId, callback) {
        GLOBAL.defs.Item(itemId, null, function(err, item) {
            if(err) {
                callback(err, null);
            } else {
                GLOBAL.defs.ItemLink.createNewItemLink(userId, itemId, listId, function(itemLink) {
                    itemLink.Item = item;
                    callback(err, itemLink);
                });
            }
        });
    },
    RemoveItemAssociationToList: function(userId, listId, itemId, callback) {
        var sql = 'UPDATE item_link SET flag = 0 WHERE user_id = ? AND item_id = ? AND list_id = ?';

        var escapeArray = [userId, itemId, listId];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err){
                callback(err);
            });
        });
    },
    AssociateListOfItemsToUser: function(userId, fromUserId, listId, callback) {
        var sql = 'SELECT item_id FROM item_link WHERE user_id = ? AND flag = 1 AND list_id = ?';

        var escapeArray = [fromUserId, listId];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err, rows){
                if(err) {
                    callback(err, null);
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
                            )
                        }
                    }
                }
            });
        });
    }
};