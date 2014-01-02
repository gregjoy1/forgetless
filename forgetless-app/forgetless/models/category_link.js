module.exports = function(id, loadWithJson, callback){

    var model = Object.create(GLOBAL.defs.DbModelBase);

    model.TABLE_NAME = 'category_link';

    model.loadWithObject = function(object, callback){

//        var model = Object.create(GLOBAL.defs.DbModelBase);
        object = (object == undefined ? {} : object);

        model.id = (
            object.hasOwnProperty('id') ?
                object.id :
                undefined
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

        model.categoryId = (
            object.hasOwnProperty('category_id') ?
                object.category_id :
                ''
            );

        callback(false, model);

    };

    model.createDbExportObject = function(skipId, callback){

        var exportObject = {};

        if(!skipId){
            exportObject.id = model.id;
        }

        exportObject.title = model.title;
        exportObject.user_id = model.userId;
        exportObject.category_id = model.categoryId;

        callback(exportObject);

    };

    model.GetAllCategoryLinksForUser = function(userId, callback){
        var sql = 'SELECT * FROM category_link WHERE user_id = ?';
        var escapeArray = userId;

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

    model.createNewCategoryLink = function(title, categoryId, userId, callback) {
        model.title = title;
        model.categoryId = categoryId;
        model.userId = userId;

        model.save(function(err, categoryLinkModel) {
            if(err) {
                // TODO implement logging
            }

            callback(categoryLinkModel);

        });
    };

    model.save = function(callback) {
        model.saveModel(model.TABLE_NAME, model, callback);
    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(loadWithJson, model, callback);
    } else if(id != null) {
        model.loadFromId(id, 'category_link', model, null, callback);
    } else {
        callback(null, model);
    }

};