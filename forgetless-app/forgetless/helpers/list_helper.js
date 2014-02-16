// TODO redo this like item helper
module.exports = {
    FindListStack: function(userId, categoryId, listId, callback) {
        var sql = "SELECT id, list_id FROM list_link WHERE user_id = ? AND list_id = ? AND category_id = ?";

        var escapeArray = [userId, listId, categoryId];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err, rows){
                connection.release();
                if(err) {
                    callback(err, null);
                } else if(rows.length == 0) {
                    callback('Empty Result Set', null);
                } else {
                    GLOBAL.defs.ListLink(rows[0].id, null, function(err, listLink) {
                        if(err) {
                            callback(err, null);
                        } else {
                            GLOBAL.defs.List(rows[0].list_id, null, function(err, list) {
                                if(err) {
                                    callback(err, null);
                                } else {
                                    listLink.List = list;
                                    callback(null, listLink);
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    CreateAndAssociateListToCategory: function(userId, categoryId, title, parentListId, description, callback) {
        GLOBAL.defs.List(null, null, function(err, list) {
            list.createNewList(title, description, userId, function(err, list) {
                if(err) {
                    callback(err, null);
                } else {
                    GLOBAL.defs.ListLink(null, null, function(err, listLink) {
                        listLink.createNewListLink(title, userId, parentListId, list.id, categoryId, function(err, listLink) {
                            if(err) {
                                callback(err, null);
                            } else {
                                listLink.List = list;
                                callback(err, listLink);
                            }
                        });
                    });
                }
            });
        });
    },
    UpdateListStack: function(userId, listId, categoryId, title, parentListId, description, callback) {

        this.FindListStack(userId, categoryId, listId, function(err, listLink) {

            var changed = false;
            var auditLog = '';

            if(title != null && listLink.title != title) {
                auditLog = 'Title changed from ' + listLink.title + ' to ' + title;
                changed = true;

                listLink.title = title;
            }

            if(parentListId != null && listLink.parentListId != parentListId) {
                auditLog += (auditLog != '' ? ', ' : '');
                auditLog += 'Parent List ID changed from ' + listLink.parentListId + ' to ' + parentListId;
                changed = true;

                listLink.parentListId = parentListId;
            }

            if(description != null && listLink.List.description != description) {
                auditLog += (auditLog != '' ? ', ' : '');
                auditLog += 'Description changed from ' + listLink.description + ' to ' + description;
                changed = true;

                listLink.List.description = description;
            }

            // checks if audit id exists and if the title has changed
            if(listLink.List.auditId != undefined && changed) {
                GLOBAL.defs.Audit(listLink.List.auditId, null, function(err, audit) {
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
                                        if((title || parentListId) != null) {
                                            listLink.save(function(err) {
                                                callback(err);
                                            });
                                        } else {
                                            callback(null);
                                        }
                                    },
                                    function(callback) {
                                        if(description != null) {
                                            listLink.List.save(function(err) {
                                                callback(err);
                                            });
                                        } else {
                                            callback(null);
                                        }
                                    }
                                ],
                                function(err) {
                                    callback(err, listLink);
                                }
                            );
                        }
                    )
                });
            } else {
                callback(err, listLink);
            }

        });
    },
    AssociatePreExistingListToCategory: function(userId, fromUserId, listId, categoryId, parentListId, callback) {
        GLOBAL.defs.List(listId, null, function(err, list) {
            if(err) {
                callback(err, null);
            } else {
                GLOBAL.defs.ListLink(null, null, function(err, listLink) {
                    listLink.createNewListLink(list.title, userId, parentListId, listId, categoryId, function(err, listLink) {
                        // log list being dis-associated to user
                        GLOBAL.defs.List(listId, null, function(err, list) {
                            if(!err) {
                                if(list.auditId != undefined) {
                                    GLOBAL.defs.Audit(list.auditId, null, function(err, audit) {
                                        if(!err) {
                                            audit.addAuditLogEntry(
                                                'List Associated with user id ' + userId,
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

                        if(err) {
                            callback(err, null);
                        } else {
                            listLink.List = list;
                            GLOBAL.defs.ItemHelper.AssociateListOfItemsToUser(
                                userId,
                                fromUserId,
                                listId,
                                function(err, itemLinks) {
                                    listLink.List.ItemLink = itemLinks;
                                    callback(err, listLink);
                                }
                            );
                        }
                    });
                });
            }
        });
    },
    RemoveListAssociationToCategory: function(userId, listId, callback) {

        var errors = [];

        // using waterfall as 2 step process
        GLOBAL.async.waterfall(
            [
                // query finds all items linked to list that linked and uses helper method
                // to delete items
                function(callback) {
                    var sql = 'SELECT id FROM item_link WHERE user_id = ? AND list_id = ?';

                    var escapeArray = [userId, listId];

                    GLOBAL.dbPool.getConnection(function(err, connection){
                        connection.query(sql, escapeArray, function(err, rows){
                            connection.release();

                            if(rows.length > 0) {
                                for(var inc = 0; inc <  rows.length; inc++) {

                                    GLOBAL.async.each(
                                        rows,
                                        function(row, callback) {
                                            GLOBAL.defs.ItemHelper.RemoveItemAssociationToList(userId, listId, row.id, function(err) {
                                                if(err) {
                                                    errors.push(err);
                                                }
                                                callback(null);
                                            });
                                        },
                                        function() {
                                            callback((errors.length > 0 ? errors : null));
                                        }
                                    );

                                }
                            } else {
                                callback(null);
                            }
                        });
                    });
                },
                // deletes list link
                function(callback) {
                    var sql = 'DELETE FROM list_link WHERE user_id = ? AND list_id = ?';

                    var escapeArray = [userId, listId];

                    GLOBAL.dbPool.getConnection(function(err, connection){
                        connection.query(sql, escapeArray, function(err){
                            connection.release();

                            // log list being dis-associated to user
                            GLOBAL.defs.List(listId, null, function(err, list) {
                                if(!err) {
                                    if(list.auditId != undefined) {
                                        GLOBAL.defs.Audit(list.auditId, null, function(err, audit) {
                                            if(!err) {
                                                audit.addAuditLogEntry(
                                                    'List dis-associated with user id ' + userId,
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

                            if(err) {
                                errors.push(err);
                            }
                            callback((errors.length > 0 ? errors : null));
                        });
                    });
                }
            ],
            function(err) {
                callback(err)
            }
        );
    },
    AssociateCategoryOfListsToUser: function(userId, fromUserId, categoryId, callback) {
        var sql = 'SELECT list_id FROM list_link WHERE user_id = ? AND category_id = ?';

        var escapeArray = [fromUserId, categoryId];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err, rows){
                connection.release();

                if(err) {
                    callback(err, null);
                } else if(rows.length == 0){
                    callback('Empty Result Set', null);
                } else {
                    if(rows.length == 0) {
                        callback(err, null);
                    } else {
                        var listLinks = [];
                        for(var inc = 0; inc < rows.length; inc++) {
                            this.AssociatePreExistingListToCategory(
                                userId,
                                fromUserId,
                                rows[inc].list_id,
                                categoryId,
                                '',
                                function(list) {
                                    listLinks.push(list);
                                    if(listLinks.length == rows.length) {
                                        callback(false, listLinks);
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