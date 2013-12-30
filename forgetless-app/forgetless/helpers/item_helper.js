module.exports = {
    CreateAndAssociateItemToUser: function(userId, listId, title, content, duration, deadline, itemType, callback) {
        GLOBAL.defs.Item.createNewItem(title, content, duration, deadline, itemType, userId, function(item) {
            GLOBAL.defs.ItemLink.createNewItemLink(userId, item.id, listId, function(itemLink) {
                itemLink.Item = item;
                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.ITEM_CREATED_AND_ASSOCIATED_SUCCESSFULLY,
                    itemLink,
                    callback
                );
            });
        });
    },
    AssociatePreExistingItemToUser: function(userId, listId, itemId, callback) {
        GLOBAL.defs.Item(itemId, null, function(err, item) {
            if(err) {
                // TODO logging...
                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.UNABLE_TO_TO_FIND_PREEXISTING_ITEM,
                    err,
                    callback
                );
            } else {
                GLOBAL.defs.ItemLink.createNewItemLink(userId, itemId, listId, function(itemLink) {
                    itemLink.Item = item;
                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                        GLOBAL.defs.StatusCodeHelper.ITEM_FOUND_AND_ASSOCIATED_SUCCESSFULLY,
                        itemLink,
                        callback
                    );
                });
            }
        });
    },
    RemoveItemAssociationToUser: function(userId, listId, itemId, callback) {
        GLOBAL.defs.Item(itemId, null, function(err, item) {
            if(err) {
                // TODO logging...
                GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                    GLOBAL.defs.StatusCodeHelper.UNABLE_TO_TO_FIND_PREEXISTING_ITEM,
                    err,
                    callback
                );
            } else {
                GLOBAL.defs.ItemLink.createNewItemLink(userId, itemId, listId, function(itemLink) {
                    itemLink.Item = item;
                    GLOBAL.defs.StatusCodeHelper.GenerateStatusCodeJSONString(
                        GLOBAL.defs.StatusCodeHelper.ITEM_FOUND_AND_ASSOCIATED_SUCCESSFULLY,
                        itemLink,
                        callback
                    );
                });
            }
        });
    }
};