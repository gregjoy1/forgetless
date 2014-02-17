module.exports = {
    FindItemStack: function(userId, listId, itemId, callback) {
        var sql = 'SELECT id, item_id FROM item_link WHERE user_id = ? AND item_id = ? AND list_id = ?';

        var escapeArray = [userId, itemId, listId];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err, rows){
                connection.release();
                if(err) {
                    callback(err, null);
                } else if(rows.length == 0) {
                    callback('Empty Result Set', null);
                } else {
                    GLOBAL.defs.ItemLink(rows[0].id, null, function(err, itemLink) {
                        if(err) {
                            callback(err, null);
                        } else {
                            GLOBAL.defs.Item(rows[0].item_id, null, function(err, item) {
                                if(err) {
                                    callback(err, null);
                                } else {
                                    itemLink.Item = item;
                                    callback(null, itemLink);
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    CreateAndAssociateItemToList: function(userId, listId, title, content, duration, deadline, itemType, callback) {
        GLOBAL.defs.Item(null, null, function(err, item) {
            item.createNewItem(title, content, duration, deadline, itemType, userId, function(err, item) {
                if(err) {
                    callback(err, null);
                } else {
                    GLOBAL.defs.ItemLink(null, null, function(err, itemLink) {
                        itemLink.createNewItemLink(userId, item.id, listId, function(err, itemLink) {
                            if(err) {
                                callback(err, null);
                            } else {
                                itemLink.Item = item;
                                callback(err, itemLink);
                            }
                        });
                    });
                }
            });
        });
    },
    UpdateItemStack: function(itemId, userId, listId, title, content, duration, deadline, itemType, callback) {
        this.FindItemStack(userId, listId, itemId, function(err, itemLink) {

            var changed = false;
            var auditLog = '';

            if(title != null && itemLink.Item.title != title) {
                auditLog = 'Title changed from ' + itemLink.Item.title + ' to ' + title;
                changed = true;

                itemLink.Item.title = title;
            }

            if(content != null && itemLink.Item.content != content) {
                auditLog += (auditLog != '' ? ', ' : '');
                auditLog += 'Content changed from ' + itemLink.Item.content + ' to ' + content;
                changed = true;

                itemLink.Item.content = content;
            }

            if(duration != null && itemLink.Item.duration != duration) {
                auditLog += (auditLog != '' ? ', ' : '');
                auditLog += 'Duration changed from ' + itemLink.Item.duration + ' to ' + duration;
                changed = true;

                itemLink.Item.duration = duration;
            }

            if(deadline != null && itemLink.Item.deadline != deadline) {
                auditLog += (auditLog != '' ? ', ' : '');
                auditLog += 'Deadline changed from ' + itemLink.Item.deadline + ' to ' + deadline;
                changed = true;

                itemLink.Item.deadline = deadline;
            }

            if(itemType != null && itemLink.Item.itemType != itemType) {
                auditLog += (auditLog != '' ? ', ' : '');
                auditLog += 'Item type changed from ' + itemLink.Item.itemType + ' to ' + itemType;
                changed = true;

                itemLink.Item.itemType = itemType;
            }

            // checks if audit id exists and if anything has changed
            // TODO ensure everything has an audit id or else it wont save
            if(itemLink.Item.auditId != undefined && changed) {
                GLOBAL.defs.Audit(itemLink.Item.auditId, null, function(err, audit) {
                    audit.addAuditLogEntry(
                        auditLog,
                        userId,
                        // do nothing for now
                        function(err, auditModel) {

                            if(err) {
                                // todo properly log
                            }

                            // if nothing has changed, then dont save...
                            GLOBAL.async.waterfall(
                                [
                                    function(callback) {
                                        if(title != null) {
                                            itemLink.save(function(err) {
                                                callback(err);
                                            });
                                        } else {
                                            callback(null);
                                        }
                                    },
                                    function(callback) {
                                        if((content || duration || deadline || itemType) != null) {
                                            itemLink.Item.save(function(err) {
                                                callback(err);
                                            });
                                        } else {
                                            callback(null);
                                        }
                                    }
                                ],
                                function(err) {
                                    callback(err, itemLink);
                                }
                            );

                        }
                    );
                });
            } else {
                callback(err, itemLink);
            }
        });
    },
    AssociatePreExistingItemToList: function(userId, listId, itemId, callback) {
        GLOBAL.defs.Item(itemId, null, function(err, item) {
            if(err) {
                callback(err, null);
            } else {
                GLOBAL.defs.ItemLink(null, null, function(err, itemLink) {
                    itemLink.createNewItemLink(userId, itemId, listId, function(err, itemLink) {

                        if(item.auditId != undefined) {
                            GLOBAL.defs.Audit(item.auditId, null, function(err, audit) {
                                if(!err) {
                                    audit.addAuditLogEntry(
                                        'Item associated with user id ' + userId,
                                        userId,
                                        function(err) {
                                            if(err) {
                                                // todo some logging
                                            }
                                        }
                                    );
                                }
                            });
                        }

                        itemLink.Item = item;
                        callback(err, itemLink);
                    });
                });
            }
        });
    },
    RemoveItemAssociationToList: function(userId, listId, itemId, callback) {
        var sql = 'DELETE FROM item_link WHERE user_id = ? AND item_id = ? AND list_id = ?';

        var escapeArray = [userId, itemId, listId];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err){
                connection.release();

                // log list being dis-associated to user
                GLOBAL.defs.Item(itemId, null, function(err, item) {
                    if(!err) {
                        if(item.auditId != undefined) {
                            GLOBAL.defs.Audit(item.auditId, null, function(err, audit) {
                                if(!err) {
                                    audit.addAuditLogEntry(
                                        'Item dis-associated with user id ' + userId,
                                        userId,
                                        function(err) {
                                            if(err) {
                                                // todo some logging
                                            }
                                        }
                                    );
                                }
                            });
                        }
                    }
                });

                callback(err);
            });
        });
    },
    AssociateListOfItemsToUser: function(userId, fromUserId, listId, callback) {
        var sql = 'SELECT item_id FROM item_link WHERE user_id = ? AND list_id = ?';

        var escapeArray = [fromUserId, listId];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err, rows){
                connection.release();
                if(err) {
                    callback(err, null);
                } else {
                    if(rows.length == 0) {
                        callback(err, null);
                    } else {
                        var itemLinks = [];
                        for(var inc = 0; inc < rows.length; inc++) {
                            this.AssociatePreExistingItemToList(
                                userId,
                                listId,
                                rows[inc].item_id,
                                function(item) {
                                    itemLinks.push(item);
                                    if(itemLinks.length == rows.length) {
                                        callback(false, itemLinks);
                                    }
                                }
                            );
                        }
                    }
                }
            });
        });
    }
};