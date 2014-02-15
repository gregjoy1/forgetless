module.exports = {
    GetTimeStampFromDate: function(date, callback) {
        if(typeof date == 'object' && date instanceof Date) {
            date = Math.round(date.getTime() / 1000);
        }
        callback(date);
    },
    GetDateFromISODate: function(date, callback) {
        // creates date instance from ISO date
        // eg 2013-11-06T13:45:35.000Z >> 1383745535000
        if(date == null) {
            callback(null);
        } else {
            callback(new Date().setTime(Math.round(Date.parse(date) / 1000)));
        }
    },
    GetISODateFromTimeStamp: function(timestamp, callback) {
        // creates date instance from ISO date
        // eg 1383745535000 >> 2013-11-06T13:45:35.000Z
        if(timestamp == null) {
            callback(new Date().toJSON());
        } else {
            if(typeof timestamp == "object" && timestamp instanceof Date) {
                callback(timestamp.toJSON());
            } else {
                var date = new Date();
                date.setTime(timestamp);

                if(date.getFullYear() < 1980) {
                    date.setTime(timestamp * 1000);
                }

                callback(date.toJSON());
            }
        }
    },
    PadNumber: function(padString, amount, originalString, callback) {
        originalString = originalString + '';
        var paddedString = '';
        for(var inc = 0; inc < amount; inc++) {
            paddedString += padString;
        }
        var unSlicedResult = (paddedString + originalString);
        callback(unSlicedResult.slice(unSlicedResult.length - amount));
    }
};
