module.exports = function(id, loadWithJson, callback){

    var model = Object.create(GLOBAL.defs.DbModelBase);

    model.TABLE_NAME = 'audit';

    model.loadWithObject = function(object, callback){

//        var model = Object.create(GLOBAL.defs.DbModelBase);
        object = (object == undefined ? {} : object);

        model.id = (
            object.hasOwnProperty('id') ?
                object.id :
                undefined
        );

        var dateCreated = (
            object.hasOwnProperty('date_created') ?
                object.date_created :
                0
        );

        var lastModified = (
            object.hasOwnProperty('last_modified') ?
                object.last_modified :
                0
        );

        var dateDeleted = (
            object.hasOwnProperty('date_deleted') ?
                object.date_deleted :
                null
        );

        GLOBAL.defs.Utils.GetDateFromISODate(dateCreated, function(date) {
            model.dateCreated = date;

            GLOBAL.defs.Utils.GetDateFromISODate(lastModified, function(date) {
                model.lastModified = date;

                GLOBAL.defs.Utils.GetDateFromISODate(dateDeleted, function(date) {
                    model.dateDeleted = date;

                    model.lastModifiedBy = (
                        object.hasOwnProperty('last_modified_by') ?
                            object.last_modified_by :
                            ''
                        );

                    try {
                        model.auditLog = (
                            object.hasOwnProperty('audit_log') ?
                                JSON.parse(object.audit_log) :
                                []
                            );
                    } catch (exception) {
                        model.audit_log = [];
                        // TODO add proper forgetless logging facility
                    }

                    callback(false, model);

                });
            });

        });

    };

    model.createDbExportObject = function(skipId, callback){

        var exportObject = {};

        if(!skipId){
            exportObject.id = model.id;
        }

        GLOBAL.defs.Utils.GetTimeStampFromDate(model.dateCreated, function(timestamp) {
            exportObject.date_created = timestamp;

            GLOBAL.defs.Utils.GetTimeStampFromDate(model.dateDeleted, function(timestamp) {
                exportObject.date_deleted = timestamp;

                GLOBAL.defs.Utils.GetTimeStampFromDate(model.lastModified, function(timestamp) {
                    exportObject.last_modified = timestamp;

                    exportObject.last_modified_by = model.lastModifiedBy;
                    exportObject.audit_log = JSON.stringify(model.auditLog);

                    callback(exportObject);

                });
            });
        });

    };

    model.createNewAudit = function(user, callback) {

        GLOBAL.defs.Utils.GetTimeStampFromDate(new Date(), function(timeStamp) {
            model.dateCreated = timeStamp;
            model.dateDeleted = null;
            model.lastModified = timeStamp;
            model.lastModifiedBy = user;

            model.addAuditLogEntry("Created", user, function(auditModel) {
                auditModel.save(function(err, auditModel) {
                    if(err) {
                        // TODO add proper logging...
                    }

                    callback(err, auditModel);

                });
            });
        });

    };

    model.addAuditLogEntry = function(log, user, callback) {

        var date = new Date();

        if(model.auditLog == undefined) {
            model.auditLog = [];
        }

        model.auditLog.push({
            date: date.toJSON(),
            user: user,
            log: log
        });

        model.lastModified = date;
        model.lastModifiedBy = user;

        callback(model);
    };

    model.save = function(callback) {
        model.saveModel(model.TABLE_NAME, model, callback);
    };

    if(loadWithJson != null && loadWithJson){
        model.loadFromJson(loadWithJson, model, callback);
    } else if(id != null && id != '') {
        model.loadFromId(id, 'audit', model, null, callback);
    } else {
        callback(null, model);
    }

};