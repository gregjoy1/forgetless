// TODO redo this like item helper
module.exports = {
    CreateAndAssociateListToCategory: function(userId, categoryId, title, parentListId, description, callback) {
        GLOBAL.defs.List.createNewList(title, description, userId, function(list) {
            GLOBAL.defs.ListLink.createNewListLink(title, userId, parentListId, list.id, categoryId, function(listLink) {
                listLink.List = list;
                callback(listLink);
            });
        });
    },
    AssociatePreExistingListToCategory: function(userId, fromUserId, listId, categoryId, parentListId, callback) {
        GLOBAL.defs.List(listId, null, function(err, list) {
            if(err) {
                callback(err, null);
            } else {
                GLOBAL.defs.ListLink.createNewListLink(list.title, userId, parentListId, listId, categoryId, function(listLink) {
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
    }
};