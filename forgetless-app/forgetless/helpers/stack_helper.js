module.exports = {
    getCompleteJSONStackDump:function(userId, callback){
        GLOBAL.async.waterfall(
            [
                // Gets dump safe user (doesnt contain hashes etc)
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
                    // validates that there are category lists, skips if not
                    if(user.CategoryLinks == undefined) {
                        callback(null, user);
                    } else {

                        if(user.CategoryLinks.length > 0) {
                            // iterates through all the category links
                            GLOBAL.async.each(
                                // array
                                user.CategoryLinks,
                                // iterator function
                                function(item, callback) {

                                    var index = user.CategoryLinks.indexOf(item);
                                    var categoryId = user.CategoryLinks[index].categoryId;

                                    // loads and instantiates the category with the category id
                                    GLOBAL.defs.Category(categoryId, null, function(err, category) {
                                        GLOBAL.defs.Audit(category.auditId, null, function(err, audit) {
                                            category.Audit = audit;
                                            // adds it to the category link
                                            user.CategoryLinks[index].Category = category;
                                            callback(err);
                                        });
                                    });

                                },
                                // callback
                                function(err) {
                                    if(err) {
                                        callback(err, null);
                                    } else {
                                        callback(null, user);
                                    }
                                }
                            );

                        } else {
                            callback(true, user);
                        }
                    }
                },
                // Gets all the list links for a category
                function(user, callback){

                    GLOBAL.async.each(
                        // array
                        user.CategoryLinks,
                        // iterator function
                        function(item, callback) {
                            var index = user.CategoryLinks.indexOf(item);
                            var categoryId = user.CategoryLinks[index].categoryId;

                            GLOBAL.defs.ListLink(null, null, function(err, listLink) {
                                listLink.GetAllListLinksForUser(userId, categoryId, function(err, listLinks){
                                    user.CategoryLinks[index].Category.ListLinks = listLinks;

                                    callback(err, user);

                                });
                            });
                        },
                        // callback
                        function(err) {
                            if(err) {
                                callback(err, null);
                            } else {
                                callback(null, user);
                            }
                        }
                    );

                },
                // Gets the list for each list link
                function(user, callback){
                    var count = 0;

                    GLOBAL.async.each(
                        // category links array
                        user.CategoryLinks,
                        // iterator function
                        function(categoryLink, callback) {

                            var categoryIndex = user.CategoryLinks.indexOf(categoryLink);
                            var category = categoryLink.Category;

                            GLOBAL.async.each(
                                // list link array
                                category.ListLinks,
                                // iterator function
                                function(listLink, callback) {

                                    var listLinkIndex = category.ListLinks.indexOf(listLink);
                                    var listId = listLink.listId;

                                    GLOBAL.defs.List(listId, null, function(err, list) {
                                        GLOBAL.defs.Audit(list.auditId, null, function(err, audit){
                                            list.Audit = audit;
                                            user.CategoryLinks[categoryIndex].Category.ListLinks[listLinkIndex].List = list;

                                            callback(err, user);

                                        });
                                    });

                                },
                                // callback
                                function(err) {
                                    if(err) {
                                        callback(err, null);
                                    } else {
                                        callback(null, user);
                                    }
                                }
                            )

                        },
                        // callback
                        function(err) {
                            if(err) {
                                callback(err, null);
                            } else {
                                callback(null, user);
                            }
                        }
                    );

                },
                // Gets all the item links for each link
                function(user, callback){

                    GLOBAL.async.each(
                        // category links array
                        user.CategoryLinks,
                        // iterator function
                        function(categoryLink, callback) {

                            var categoryIndex = user.CategoryLinks.indexOf(categoryLink);
                            var category = categoryLink.Category;

                            GLOBAL.async.each(
                                // list link array
                                category.ListLinks,
                                // iterator function
                                function(listLink, callback) {
                                    var listLinkIndex = category.ListLinks.indexOf(listLink);

                                    var listId = listLink.List.id;
                                    GLOBAL.defs.ItemLink(null, null, function(err, list){
                                        list.GetAllItemLinksForUser(userId, listId, function(err, itemLinks){
                                            user.CategoryLinks[categoryIndex].Category.ListLinks[listLinkIndex].List.ItemLinks = itemLinks;
                                            callback(err, user);
                                        });
                                    });

                                },
                                // callback
                                function(err) {
                                    if(err) {
                                        callback(err, null);
                                    } else {
                                        callback(null, user);
                                    }
                                }
                            );
                        },
                        // callback
                        function(err) {
                            if(err) {
                                callback(err, null);
                            } else {
                                callback(null, user);
                            }
                        }
                    );

                },
                // Gets the item for each item link
                function(user, callback){

                    GLOBAL.async.each(
                        // category links array
                        user.CategoryLinks,
                        // iterator function
                        function(categoryLink, callback) {

                            var categoryIndex = user.CategoryLinks.indexOf(categoryLink);
                            var category = categoryLink.Category;

                            GLOBAL.async.each(
                                // list link array
                                category.ListLinks,
                                // iterator function
                                function(listLink, callback) {

                                    var listLinkIndex = category.ListLinks.indexOf(listLink);

                                    GLOBAL.async.each(
                                        // list link array
                                        listLink.List.ItemLinks,
                                        // iterator function
                                        function(itemLink, callback) {

                                            var itemLinkIndex = listLink.List.ItemLinks.indexOf(itemLink);

                                            var itemId = itemLink.itemId;
                                            GLOBAL.defs.Item(itemId, null, function(err, item){
                                                GLOBAL.defs.ReminderHelper.GetAllRemindersForUserAndItem(false, user.id, item.id, function(err, reminders) {
                                                    item.Reminders = reminders;
                                                    GLOBAL.defs.Audit(item.auditId, null, function(err, audit){
                                                        item.Audit = audit;
                                                        user.CategoryLinks[categoryIndex].Category.ListLinks[listLinkIndex].List.ItemLinks[itemLinkIndex].Item = item;
                                                        callback(err, user);
                                                    });
                                                });
                                            });

                                        },
                                        // callback
                                        function(err) {
                                            if(err) {
                                                callback(err, null);
                                            } else {
                                                callback(null, user);
                                            }
                                        }
                                    );

                                },
                                // callback
                                function(err) {
                                    if(err) {
                                        callback(err, null);
                                    } else {
                                        callback(null, user);
                                    }
                                }
                            );
                        },
                        // callback
                        function(err) {
                            if(err) {
                                callback(err, null);
                            } else {
                                callback(null, user);
                            }
                        }
                    );

                }
            ],
            function(err, object){
                callback(err, object);
            }
        );
    }
};


