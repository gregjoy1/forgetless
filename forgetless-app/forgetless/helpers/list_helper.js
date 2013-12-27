module.exports = {
    getCompleteJSONStackDump:function(userId, callback){
        GLOBAL.async.waterfall(
            [
                // Gets all category links for a specified user
                function(callback){
                    GLOBAL.defs.User(null, null, function(err, user) {
                        user.loadDumpSafeUserFromId(userId, function(err, safeUser) {
                            callback(err, safeUser);
                        });
                    });
                },
                // Gets all category links for a specified user
                function(user, callback){
                    GLOBAL.defs.CategoryLink(null, null, function(err, object) {
                        object.GetAllCategoryLinksForUser(userId, function(err, links) {
                            user.CategoryLinks = links;
                            callback(err, user);
                        });
                    });
                },
                // Gets the category linked to the category links
                function(user, callback){
                    var count = 0;
                    for(var inc = 0; inc < user.CategoryLinks.length; inc++) {
                        var index = inc;
                        new GLOBAL.defs.Category(user.CategoryLinks[inc].categoryID, null, function(err, category){
                            new GLOBAL.defs.Audit(category.auditID, null, function(err, audit){
                                category.Audit = audit;
                                user.CategoryLinks[index].Category = category;
                                count++;
                                if(count == user.CategoryLinks.length) {
                                    callback(null, user);
                                }
                            });
                        });
                    }
                },
                // Gets all the list links for a category
                function(user, callback){
                    var count = 0;
                    for(var inc = 0; inc < user.CategoryLinks.length; inc++) {
                        var index = inc;
                        new GLOBAL.defs.ListLink(null, null, function(err, listLink) {
                            listLink.GetAllListLinksForUser(userId, user.CategoryLinks[index].Category.id, function(err, listLinks){
                                user.CategoryLinks[index].Category.ListLinks = listLinks;
                                count++;
                                if(count == user.CategoryLinks.length){
                                    callback(null, user);
                                }
                            })
                        });
                    }
                },
                // Gets the list for each list link
                function(user, callback){
                    var count = 0;
                    for(var catInc = 0; catInc < user.CategoryLinks.length; catInc++){
                        var categoryIndex = catInc;
                        for(var listInc = 0; listInc < user.CategoryLinks[catInc].Category.ListLinks.length; listInc++){
                            var listIndex = listInc;
                            var listId = user.CategoryLinks[categoryIndex].Category.ListLinks[listIndex].listId;
                            new GLOBAL.defs.List(listId, null, function(err, list) {
                                new GLOBAL.defs.Audit(list.auditID, null, function(err, audit){
                                    list.Audit = audit;
                                    user.CategoryLinks[categoryIndex].Category.ListLinks[listIndex].List = list;
                                    count++;
                                    if(count == user.CategoryLinks[categoryIndex].Category.ListLinks.length){
                                        callback(null, user);
                                    }
                                });
                            });
                        }
                    }
                },
                // Gets all the item links for each link
                function(user, callback){
                    var count = 0;
                    for(var catInc = 0; catInc < user.CategoryLinks.length; catInc++){
                        var categoryIndex = catInc;
                        for(var listInc = 0; listInc < user.CategoryLinks[catInc].Category.ListLinks.length; listInc++){
                            var listIndex = listInc;
                            var listId = user.CategoryLinks[categoryIndex].Category.ListLinks[listIndex].List.id;
                            new GLOBAL.defs.ItemLink(null, null, function(err, list){
                                list.GetAllItemLinksForUser(userId, listId, function(err, itemLinks){
                                    user.CategoryLinks[categoryIndex].Category.ListLinks[listIndex].List.ItemLinks = itemLinks;
                                    count++;
                                    if(count == user.CategoryLinks[categoryIndex].Category.ListLinks.length){
                                        callback(null, user);
                                    }
                                });
                            });
                        }
                    }
                },
                // Gets the item for each item link
                function(user, callback){
                    var count = 0;
                    for(var catInc = 0; catInc < user.CategoryLinks.length; catInc++){
                        var categoryIndex = catInc;
                        for(var listInc = 0; listInc < user.CategoryLinks[catInc].Category.ListLinks.length; listInc++){
                            var listIndex = listInc;
                            for(var itemInc = 0; itemInc < user.CategoryLinks[catInc].Category.ListLinks[listInc].List.ItemLinks.length; itemInc++) {
                                var itemIndex = itemInc;
                                var itemId = user.CategoryLinks[categoryIndex].Category.ListLinks[listIndex].List.ItemLinks[itemIndex].itemId;
                                new GLOBAL.defs.Item(itemId, null, function(err, item){
                                    new GLOBAL.defs.Audit(item.auditID, null, function(err, audit){
                                        item.Audit = audit;
                                        user.CategoryLinks[categoryIndex].Category.ListLinks[listIndex].List.ItemLinks[itemIndex].Item = item;
                                        count++;
                                        if(count == user.CategoryLinks[categoryIndex].Category.ListLinks[listIndex].List.ItemLinks.length){
                                            callback(null, user);
                                        }
                                    });
                                });
                            }
                        }
                    }
                }
            ],
            function(err, object){
                callback(err, object);
            }
        );
    }
};