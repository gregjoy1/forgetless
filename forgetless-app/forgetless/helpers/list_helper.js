module.exports = {
    getSchemaDrop:function(userId, callback){
        GLOBAL.async.waterfall(
            [
                function(callback){
                    GLOBAL.defs.CategoryLink(null, null, function(err, object) {
                        object.GetAllCategoryLinksForUser(userId, function(err, links) {
                            callback(err, links);
                        });
                    });
                },
                function(categoryLinks, callback){
                    var count = 0;
                    for(var inc = 0; inc < categoryLinks.length; inc++){
                        var index = inc;
                        new GLOBAL.defs.Category(categoryLinks[inc].categoryID, false, function(err, category){
                            categoryLinks[index].Category = category;
                            count++;
                            if(count == categoryLinks.length){
                                callback(null, categoryLinks);
                            }
                        });
                    }
                },
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
                function(categoryLinks, callback){
                    var count = 0;
                    for(var catInc = 0; catInc < categoryLinks.length; catInc++){
                        var categoryIndex = catInc;
                        for(var listInc = 0; listInc < categoryLinks[catInc].Category.ListLinks.length; listInc++){
                            var listIndex = listInc;
                            var listId = categoryLinks[categoryIndex].Category.ListLinks[listIndex].ListId;
                            new GLOBAL.defs.List(listId, null, function(err, list) {
                                categoryLinks[categoryIndex].Category.ListLinks[listIndex].List = list;
                                count++;
                                if(count == categoryLinks[categoryIndex].Category.ListLinks.length){
                                    callback(null, categoryLinks);
                                }
                            });
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