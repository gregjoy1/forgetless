// TODO redo this like item helper
module.exports = {
    CreateAndAssociateListToCategory: function(userId, categoryId, title, parentListId, description, callback) {
        GLOBAL.defs.List.createNewList(title, description, userId, function(list) {
            GLOBAL.defs.ListLink.createNewListLink(title, userId, parentListId, list.id, categoryId, function(listLink) {
                listLink.List = list;

                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.LIST_CREATED_AND_ASSOCIATED_SUCCESSFULLY,
                    listLink,
                    callback
                );
            });
        });
    },
    AssociatePreExistingListToCategory: function(userId, listId, categoryId, title, parentListId, description, callback) {
        GLOBAL.defs.List(listId, null, function(err, list) {
            if(err) {
                // TODO logging...
                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.UNABLE_TO_TO_FIND_PREEXISTING_LIST,
                    err,
                    callback
                );
            } else {
                GLOBAL.defs.ListLink.createNewListLink(userId, userId, parentListId, listId, categoryId, function(listLink) {
                    listLink.List = list;
                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                        GLOBAL.defs.StatusCodeHelper.LIST_FOUND_AND_ASSOCIATED_SUCCESSFULLY,
                        listLink,
                        callback
                        // TODO add child linking..
                    );
                });
            }
        });
    },
    RemoveListAssociationToCategory: function(userId, listId, itemId, callback) {
//        GLOBAL.defs.Item(itemId, null, function(err, item) {
//            if(err) {
//                // TODO logging...
//                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
//                    GLOBAL.defs.StatusCodeHelper.UNABLE_TO_TO_FIND_PREEXISTING_ITEM,
//                    err,
//                    callback
//                );
//            } else {
//                GLOBAL.defs.ItemLink.createNewItemLink(userId, itemId, listId, function(itemLink) {
//                    itemLink.Item = item;
//                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
//                        GLOBAL.defs.StatusCodeHelper.ITEM_FOUND_AND_ASSOCIATED_SUCCESSFULLY,
//                        itemLink,
//                        callback
//                    );
//                });
//            }
//        });
    }
};