module.exports = function(id, loadWithJson, callback){

    var model = Object.create(GLOBAL.defs.DbModelBase);

    model.TABLE_NAME = 'user';

    model.loadWithObject = function(object, callback){
//        var model = Object.create(GLOBAL.defs.DbModelBase);

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

        model.firstName = (
            object.hasOwnProperty('first_name') ?
                object.first_name :
                ''
        );

        model.lastName = (
            object.hasOwnProperty('last_name') ?
                object.last_name :
                ''
        );

        model.email = (
            object.hasOwnProperty('email') ?
                object.email :
                ''
        );

        model.passwordHash = (
            object.hasOwnProperty('password_hash') ?
                object.password_hash :
                ''
        );

        model.resetPasswordHash = (
            object.hasOwnProperty('reset_password_hash') ?
                object.reset_password_hash :
                ''
        );

        model.userTokenHash = (
            object.hasOwnProperty('user_token_hash') ?
                object.user_token_hash :
                ''
        );

        model.zoneId = (
            object.hasOwnProperty('zone_id') ?
                object.zone_id :
                ''
        );

        callback(false, model);

    };

    model.loadDumpSafeObjectFromModel = function(model, callback){

        var dumpSafeModel = {};

        dumpSafeModel.id = (
            model.hasOwnProperty('id') ?
                model.id :
                ''
        );

        dumpSafeModel.title = (
            model.hasOwnProperty('title') ?
                model.title :
                ''
        );

        dumpSafeModel.firstName = (
            model.hasOwnProperty('firstName') ?
                model.firstName :
                ''
        );

        dumpSafeModel.lastName = (
            model.hasOwnProperty('lastName') ?
                model.lastName :
                ''
        );

        dumpSafeModel.email = (
            model.hasOwnProperty('email') ?
                model.email :
                ''
        );

        dumpSafeModel.zoneId = (
            model.hasOwnProperty('zoneId') ?
                model.zoneId :
                ''
        );

        callback(false, dumpSafeModel);

    };

    model.createDbExportObject = function(skipId, callback){

        var exportObject = {};

        if(!skipId){
            exportObject.id = model.id;
        }

        exportObject.title = model.title;
        exportObject.first_name = model.firstName;
        exportObject.last_name = model.lastName;
        exportObject.email = model.email;
        exportObject.password_hash = model.passwordHash;
        exportObject.reset_password_hash = model.resetPasswordHash;
        exportObject.user_token_hash = model.userTokenHash;
        exportObject.zone_id = model.zoneId;

        callback(exportObject);

    };

    model.loadDumpSafeUserFromId = function(id, callback){
        model.loadFromId(id, 'user', model, null, function(err, user){
            model.loadDumpSafeObjectFromModel(user, callback);
        });
    };

    model.generateNewUserToken = function(callback) {
        GLOBAL.defs.HashHelper.GenerateHashToken(model.passwordHash, function(hash) {
            model.userTokenHash = hash;
            callback(model);
        });
    };

    model.generateNewPasswordHash = function(password, callback) {
        GLOBAL.defs.HashHelper.HashEmailPassword(model.email, password, function(hash) {
            model.passwordHash = hash;
            callback(model);
        });
    };

    model.createNewUser = function(title, firstName, lastName, email, password, callback) {
        model.title = title;
        model.firstName = firstName;
        model.lastName = lastName;
        model.email = email;
        model.zoneId = 1;

        model.generateNewPasswordHash('password', function(model) {
            model.generateNewUserToken(function(model) {
                callback(model);
            });
        });

    };

    model.disableUser = function(callback) {
        model.changeZone(0, function(model) {
            callback(model);
        });
    };

    model.changeZone = function(zone, callback) {
        model.zoneId = zone;
        callback(model);
    };

    model.save = function(callback) {
        model.saveModel(model.TABLE_NAME, model, callback);
    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(id, model, callback);
    } else if(id != null) {
        model.loadFromId(id, 'user', model, null, callback);
    } else {
        callback(null, model);
    }

};