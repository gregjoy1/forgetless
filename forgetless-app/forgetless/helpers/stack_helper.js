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
                    // validates that there are category lists, skips if not
                    if(user.CategoryLinks == undefined) {
                        callback(null, user);
                    } else {
                        if(user.CategoryLinks.length > 0) {
                            for(var inc = 0; inc < user.CategoryLinks.length; inc++) {
                                var index = inc;
                                GLOBAL.defs.Category(user.CategoryLinks[inc].categoryId, null, function(err, category) {
                                    GLOBAL.defs.Audit(category.auditId, null, function(err, audit) {
                                        category.Audit = audit;
                                        user.CategoryLinks[index].Category = category;
                                        count++;
                                        if(count == user.CategoryLinks.length) {
                                            callback(null, user);
                                        }
                                    });
                                });
                            }
                        } else {
                            callback(true, user);
                        }
                    }
                },
                // Gets all the list links for a category
                function(user, callback){
                    var count = 0;
                    for(var inc = 0; inc < user.CategoryLinks.length; inc++) {
                        var index = inc;
                        GLOBAL.defs.ListLink(null, null, function(err, listLink) {
                            listLink.GetAllListLinksForUser(userId, user.CategoryLinks[index].Category.id, function(err, listLinks){
                                user.CategoryLinks[index].Category.ListLinks = listLinks;
                                if(listLinks.length == 0) {
                                    callback(true, user);
                                } else {
                                    count++;
                                    if(count == user.CategoryLinks.length){
                                        callback(null, user);
                                    }
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
                            GLOBAL.defs.List(listId, null, function(err, list) {
                                GLOBAL.defs.Audit(list.auditId, null, function(err, audit){
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
                            GLOBAL.defs.ItemLink(null, null, function(err, list){
                                list.GetAllItemLinksForUser(userId, listId, function(err, itemLinks){
                                    user.CategoryLinks[categoryIndex].Category.ListLinks[listIndex].List.ItemLinks = itemLinks;
                                    // validates that there are itemLinks and skips if there are none
                                    if(itemLinks.length == 0) {
                                        callback(true, user);
                                    } else {
                                        count++;
                                        if(count == user.CategoryLinks[categoryIndex].Category.ListLinks.length){
                                            callback(null, user);
                                        }
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
                            // validates if there are any ItemLinks and skips if not
                            if(user.CategoryLinks[catInc].Category.ListLinks[listInc].List.ItemLinks == undefined) {
                                callback(null, user);
                            } else {
                                for(var itemInc = 0; itemInc < user.CategoryLinks[catInc].Category.ListLinks[listInc].List.ItemLinks.length; itemInc++) {
                                    var itemIndex = itemInc;
                                    var itemId = user.CategoryLinks[categoryIndex].Category.ListLinks[listIndex].List.ItemLinks[itemIndex].itemId;
                                    GLOBAL.defs.Item(itemId, null, function(err, item){
                                        GLOBAL.defs.ReminderHelper.GetAllRemindersForUserAndItem(false, user.id, item.id, function(err, reminders) {
                                            item.Reminders = reminders;
                                            GLOBAL.defs.Audit(item.auditId, null, function(err, audit){
                                                item.Audit = audit;
                                                user.CategoryLinks[categoryIndex].Category.ListLinks[listIndex].List.ItemLinks[itemIndex].Item = item;
                                                count++;
                                                if(count == user.CategoryLinks[categoryIndex].Category.ListLinks[listIndex].List.ItemLinks.length){
                                                    callback(null, user);
                                                }
                                            });
                                        });
                                    });
                                }
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