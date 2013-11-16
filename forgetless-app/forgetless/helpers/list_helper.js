module.exports = {
    getCompleteJSONDump:function(userId, callback){
        GLOBAL.async.waterfall(
            [
                // Gets all category links for a specified user
                function(callback){
                    GLOBAL.defs.CategoryLink(null, null, function(err, object) {
                        object.GetAllCategoryLinksForUser(userId, function(err, links) {
                            callback(err, links);
                        });
                    });
                },
                // Gets the category linked to the categery links
                function(categoryLinks, callback){
                    var count = 0;
                    for(var inc = 0; inc < categoryLinks.length; inc++){
                        var index = inc;
                        new GLOBAL.defs.Category(categoryLinks[inc].categoryID, null, function(err, category){
                            new GLOBAL.defs.Audit(category.auditID, null, function(err, audit){
                                category.Audit = audit;
                                categoryLinks[index].Category = category;
                                count++;
                                if(count == categoryLinks.length){
                                    callback(null, categoryLinks);
                                }
                            });
                        });
                    }
                },
                // Gets all the list links for a category
                function(categoryLinks, callback){
                    var count = 0;
                    for(var inc = 0; inc < categoryLinks.length; inc++){
                        var index = inc;
                        new GLOBAL.defs.ListLink(null, null, function(err, listLink) {
                            listLink.GetAllListLinksForUser(userId, categoryLinks[index].Category.id, function(err, listLinks){
                                categoryLinks[index].Category.ListLinks = listLinks;
                                count++;
                                if(count == categoryLinks.length){
                                    callback(null, categoryLinks);
                                }
                            })
                        });
                    }
                },
                // Gets the list for each list link
                function(categoryLinks, callback){
                    var count = 0;
                    for(var catInc = 0; catInc < categoryLinks.length; catInc++){
                        var categoryIndex = catInc;
                        for(var listInc = 0; listInc < categoryLinks[catInc].Category.ListLinks.length; listInc++){
                            var listIndex = listInc;
                            var listId = categoryLinks[categoryIndex].Category.ListLinks[listIndex].listId;
                            new GLOBAL.defs.List(listId, null, function(err, list) {
                                new GLOBAL.defs.Audit(list.auditID, null, function(err, audit){
                                    list.Audit = audit;
                                    categoryLinks[categoryIndex].Category.ListLinks[listIndex].List = list;
                                    count++;
                                    if(count == categoryLinks[categoryIndex].Category.ListLinks.length){
                                        callback(null, categoryLinks);
                                    }
                                });
                            });
                        }
                    }
                },
                // Gets all the item links for each link
                function(categoryLinks, callback){
                    var count = 0;
                    for(var catInc = 0; catInc < categoryLinks.length; catInc++){
                        var categoryIndex = catInc;
                        for(var listInc = 0; listInc < categoryLinks[catInc].Category.ListLinks.length; listInc++){
                            var listIndex = listInc;
                            var listId = categoryLinks[categoryIndex].Category.ListLinks[listIndex].List.id;
                            new GLOBAL.defs.ItemLink(null, null, function(err, list){
                                list.GetAllItemLinksForUser(userId, listId, function(err, itemLinks){
                                    categoryLinks[categoryIndex].Category.ListLinks[listIndex].List.ItemLinks = itemLinks;
                                    count++;
                                    if(count == categoryLinks[categoryIndex].Category.ListLinks.length){
                                        callback(null, categoryLinks);
                                    }
                                });
                            });
                        }
                    }
                },
                // Gets the item for each item link
                function(categoryLinks, callback){
                    var count = 0;
                    for(var catInc = 0; catInc < categoryLinks.length; catInc++){
                        var categoryIndex = catInc;
                        for(var listInc = 0; listInc < categoryLinks[catInc].Category.ListLinks.length; listInc++){
                            var listIndex = listInc;
                            for(var itemInc = 0; itemInc < categoryLinks[catInc].Category.ListLinks[listInc].List.ItemLinks.length; itemInc++) {
                                var itemIndex = itemInc;
                                var itemId = categoryLinks[categoryIndex].Category.ListLinks[listIndex].List.ItemLinks[itemIndex].itemId;
                                new GLOBAL.defs.Item(itemId, null, function(err, item){
                                    new GLOBAL.defs.Audit(item.auditID, null, function(err, audit){
                                        item.Audit = audit;
                                        categoryLinks[categoryIndex].Category.ListLinks[listIndex].List.ItemLinks[itemIndex].Item = item;
                                        count++;
                                        if(count == categoryLinks[categoryIndex].Category.ListLinks[listIndex].List.ItemLinks.length){
                                            callback(null, categoryLinks);
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