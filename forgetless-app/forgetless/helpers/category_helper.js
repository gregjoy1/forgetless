module.exports = {
    FindCategoryStack: function(userId, categoryId, callback) {
        var sql = 'SELECT id, category_id FROM category_link WHERE user_id = ? category_id = ?';

        var escapeArray = [userId, categoryId];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err, rows){
                if(err) {
                    callback(err, null);
                } else if(rows.length == 0) {
                    callback('Empty Result Set', null);
                } else {
                    GLOBAL.defs.CategoryLink(rows[0].id, null, function(err, categoryLink) {
                        if(err) {
                            callback(err, null);
                        } else {
                            GLOBAL.defs.Category(rows[0].category_id, null, function(err, category) {
                                if(err) {
                                    callback(err, null);
                                } else {
                                    categoryLink.Category = category;
                                    callback(null, categoryLink);
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    CreateAndAssociateCategoryToUser: function(title, userId, callback) {
        GLOBAL.defs.Category(null, null, function(err, category) {
            category.createNewCategory(title, userId, function(err, category) {
                if(err) {
                    callback(err, null);
                } else {
                    GLOBAL.defs.CategoryLink(null, null, function(err, categoryLink) {
                        categoryLink.createNewCategoryLink(title, category.id, userId, function(err, categoryLink) {
                            if(err) {
                                callback(err, null);
                            } else {
                                categoryLink.Category = category;
                                callback(err, categoryLink);
                            }
                        });
                    });
                }
            });
        });
    },
    UpdateCategoryStack: function(title, categoryId, userId, callback) {
        this.FindCategoryStack(userId, categoryId, function(err, categoryLink) {

            if(err) {
                callback(err, null);
            } else {

                if(title != null) {
                    categoryLink.title = title;

                    categoryLink.save(function(err) {
                        callback(err);
                    });

                } else {
                    callback(null);
                }

            }
        });
    },
    AssociatePreExistingCategoryToUser: function(userId, categoryId, callback) {
        GLOBAL.defs.Category(categoryId, null, function(err, category) {
            if(err) {
                callback(err, null);
            } else {
                GLOBAL.defs.ItemLink.createNewCategoryLink(title, category.id, userId, function(err, categoryLink) {
                    if(err) {
                        callback(err, null);
                    } else {
                        categoryLink.Category = category;
                        callback(err, categoryLink);
                    }
                });
            }
        });
    },
    RemoveCategoryAssociationToUser: function(userId, categoryId, callback) {
        var sql = 'DELETE FROM category_link WHERE user_id = ? AND category_id = ?';

        var escapeArray = [userId, categoryId];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err){
                callback(err);
            });
        });
    },
    AssociateListOfCategoriesToUser: function(userId, fromUserId, listId, callback) {
//        TODO investigate and consider
//        var sql = 'SELECT category_id FROM category_link WHERE user_id = ? AND list_id = ?';
//
//        var escapeArray = [fromUserId, listId];
//
//        GLOBAL.dbPool.getConnection(function(err, connection){
//            connection.query(sql, escapeArray, function(err, rows){
//                if(err) {
//                    callback(err, null);
//                } else if(rows.length == 0){
//                    callback('Empty Result Set', null);
//                } else {
//                    if(rows.length == 0) {
//                        callback(err, null);
//                    } else {
//                        var itemLinks = [];
//                        for(var inc = 0; inc < rows.length; inc++) {
//                            this.AssociatePreExistingItemToList(
//                                userId,
//                                listId,
//                                rows[inc].item_id,
//                                function(item) {
//                                    itemLinks.push(item);
//                                    if(itemLinks.length == rows.length) {
//                                        callback(false, itemLinks);
//                                    }
//                                }
//                            );
//                        }
//                    }
//                }
//            });
//        });
    }
};