var fileSystem = require('fs');
var path = require('path');

var getDateTimeString = function(callback) {
    getDateString(function(date) {
        getTimeString(function(time) {
            callback(date + ' ' + time);
        });
    });
};

var getTimeString = function(callback) {
    var date = new Date();

    GLOBAL.defs.Utils.PadNumber('0', 2, date.getUTCSeconds(), function(seconds) {
        GLOBAL.defs.Utils.PadNumber('0', 2, date.getUTCMinutes(), function(minutes) {
            GLOBAL.defs.Utils.PadNumber('0', 2, date.getUTCHours(), function(hours) {
                var milliSeconds = date.getUTCMilliseconds();
                callback(hours + ':' + minutes + ':' + seconds + ':' + milliSeconds);
            });
        });
    });
};

var getDateString = function(callback) {
    var date = new Date();

    GLOBAL.defs.Utils.PadNumber('0', 2, date.getUTCDate(), function(day) {
        GLOBAL.defs.Utils.PadNumber('0', 2, (date.getUTCMonth() + 1), function(month) {
            var year = date.getUTCFullYear();
            callback(day + '-' + month + '-' + year);
        });
    });
};

var getLogFolderMonthString = function(callback) {
    var date = new Date();

    GLOBAL.defs.Utils.PadNumber('0', 2, (date.getUTCMonth() + 1), function(month) {
        var year = date.getUTCFullYear();
        callback(month + '-' + year);
    });
};

var checkCreateAndReadLog = function(callback) {
    GLOBAL.async.waterfall(
        [
            function(callback) {
                fileSystem.exists(GLOBAL.config.log_path, function(exists) {
                    if(exists) {
                        callback(null);
                    } else {
                        fileSystem.mkdir(GLOBAL.config.log_path, '0777', function() {
                            fileSystem.exists(GLOBAL.config.log_path, function(exists) {
                                if(exists) {
                                    callback(null);
                                } else {
                                    callback('Could not create log directory...');
                                }
                            });
                        });
                    }
                });
            },
            function(callback) {
                getLogFolderMonthString(function(logMonthFolderName) {
                    var logMonthFolderPath = path.join(GLOBAL.config.log_path, logMonthFolderName);
                    console.log(logMonthFolderName);
                    fileSystem.exists(logMonthFolderPath, function(exists) {
                        if(exists) {
                            callback(null, logMonthFolderPath);
                        } else {
                            fileSystem.mkdir(logMonthFolderPath, '0777', function() {
                                fileSystem.exists(logMonthFolderPath, function(exists) {
                                    if(exists) {
                                        callback(null, logMonthFolderPath);
                                    } else {
                                        callback('Could not create log month directory: ' + logMonthFolderName);
                                    }
                                });
                            });
                        }
                    });
                });
            },
            function(logMonthFolderPath, callback) {
                getDateString(function(logDateString) {
                    var logFilePath = path.join(logMonthFolderPath, logDateString);
                    fileSystem.exists(logFilePath, function(exist) {
                        if(exist) {
                            fileSystem.readFile(logFilePath, function(err, content) {
                                callback(err, content, logFilePath);
                            });
                        } else {
                            fileSystem.writeFile(logFilePath, '', function(err) {
                                callback(err, '', logFilePath);
                            });
                        }
                    });
                });
            }
        ],
        function(err, contents, logFilePath) {

            if(contents == ('')) {
                contents = [];
            } else {
                contents = JSON.parse(contents);
            }

            callback(err, contents, logFilePath);
        }
    );
};

module.exports.WriteToLog = function(logEntry, callback) {
    checkCreateAndReadLog(function(err, contents, logFilePath) {
        if(err) {
            console.log('cant log ' + logFilePath + ' : ' + err);
            callback();
        } else {

            getDateTimeString(function(dateTime) {
                var entry = {
                    orderNumber:    1,
                    dateTime:       dateTime,
                    log     :       logEntry
                };

                if(contents.length > 0 && contents[(contents.length - 1)].orderNumber != undefined) {
                    entry.orderNumber = (contents[(contents.length - 1)].orderNumber + 1);
                }

                contents.push(entry);

                contents = JSON.stringify(contents);

                fileSystem.writeFile(logFilePath, contents, function(err) {
                    if(err) {
                        console.log('failed to write log: ' + logFilePath + ' : ' + err);
                    }
                    callback();
                });
            });
        }
    });
};