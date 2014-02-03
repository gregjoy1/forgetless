module.exports = {
    GetAllRemindersForUser: function(allZones, userId, callback) {
        var sql = 'SELECT id FROM reminder WHERE user_id = ?';

        if(!allZones) {
            sql += ' AND zone_id = 1';
        }

        var escapeArray = userId;

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err, rows){
                if(err) {
                    callback(err, []);
                } else {
                    var reminders = [];
                    for(var inc = 0; inc < rows.length; inc++) {
                        GLOBAL.defs.Reminder(rows[inc].id, false, function(err, reminder) {
                            reminders.push(reminder);
                            if(reminders.length == rows.length) {
                                callback(false, reminders);
                            }
                        }, allZones);
                    }
                }
            });
        });
    },
    GetAllRemindersForUserAndItem: function(allZones, userId, itemId, callback) {
        var sql = 'SELECT id FROM reminder WHERE user_id = ? AND item_id = ?';

        if(!allZones) {
            sql += ' AND zone_id = 1';
        }

        var escapeArray = [userId, itemId];

        GLOBAL.dbPool.getConnection(function(err, connection){
            connection.query(sql, escapeArray, function(err, rows){
                if(err) {
                    callback(err, []);
                } else {
                    var reminders = [];
                    if(rows.length > 0) {
                        for(var inc = 0; inc < rows.length; inc++) {
                            GLOBAL.defs.Reminder(rows[inc].id, false, function(err, reminder) {
                                reminders.push(reminder);
                                if(reminders.length == rows.length) {
                                    callback(false, reminders);
                                }
                            }, allZones);
                        }
                    } else {
                        callback(false, reminders);
                    }
                }
            });
        });
    }
};