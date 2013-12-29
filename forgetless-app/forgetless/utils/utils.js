module.exports = {
    GetTimeStampFromDate: function(date, callback) {
        callback(Math.round(date.getTime() / 1000));
    },
    GetDateFromISODate: function(date, callback) {
        // creates date instance from ISO date
        // eg 2013-11-06T13:45:35.000Z >> 1383745535000

        if(date == null) {
            callback(null);
        } else {
            callback(new Date().setTime(Math.round(Date.parse(date) / 1000)));
        }
    }
};
