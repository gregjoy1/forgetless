module.exports = function(id, loadWithJson, callback){

    var model = GLOBAL.defs.DbModelBase;

    model.isCategoryLink = 'yes';

    model.loadWithObject = function(object, callback){

        var model = Object.create(GLOBAL.defs.DbModelBase);

        model.id = (
            object.hasOwnProperty('id') ?
                object.id :
                ''
            );

        model.title = (
            object.hasOwnProperty('title') ?
                object.title :
                ''
            );

        model.userId = (
            object.hasOwnProperty('user_id') ?
                object.user_id :
                ''
            );

        model.categoryID = (
            object.hasOwnProperty('category_id') ?
                object.category_id :
                ''
            );

        callback(false, model);

    };

    model.createDbExportObject = function(skipId, callback){

        var exportObject = Object;

        if(!skipId){
            exportObject.id = model.id;
        }

        exportObject.title = model.title;
        exportObject.user_id = model.userId;
        exportObject.category_id = model.categoryID;

        callback(exportObject);

    };

    model.GetAllCategoryLinksForUser = function(userID, callback){
        var sql = 'SELECT * FROM category_link WHERE user_id = ?';
        var escapeArray = userID;

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err, rows){
                if(err){
                    console.log(err, model);
                } else {
                    var CategoryLinks = [];

                    for(var inc = 0; inc < rows.length; inc++){
                        new GLOBAL.defs.CategoryLink(null, rows[inc], function(err, link){
                            CategoryLinks.push(link);
                            if(CategoryLinks.length == rows.length){
                                callback(null, CategoryLinks);
                            }
                        });

                    }
                }
                connection.release();
            });
        });
    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(loadWithJson, callback);
    } else if(id != null) {
        model.loadFromId(id, 'category_link', null, callback);
    } else {
        callback(null, model);
    }

};