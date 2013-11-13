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
                        GLOBAL.defs.ListLink(null, null, function(err, listLink) {
                            listLink.GetAllListLinksForUser(userId, categoryLinks[inc].CategoryId, function(err, itemLinks){
                                categoryLinks[inc].Category.ItemLinks = itemLinks;
                                count++;
                                if(count == categoryLinks.length){
                                    callback(null, categoryLinks);
                                }
                            })
                        });
                    }
                }
            ],
            function(err, object){
                callback(err, object);
            }
        );
    }
};