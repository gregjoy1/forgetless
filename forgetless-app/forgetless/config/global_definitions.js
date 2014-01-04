module.exports = function(express, app) {

    var path = require('path');
    var mysql = require('mysql');

    GLOBAL.async = require('async');
    GLOBAL.config = require('../config/config.js')(express, app, path);
    GLOBAL.dbPool = require('../config/database.js')(mysql, GLOBAL.config);

    GLOBAL.defs = {
        'DbModelBase':require('../models/forgetless_db_model.js'),
        'User':require('../models/user.js'),
        'CategoryLink':require('../models/category_link.js'),
        'Category':require('../models/category.js'),
        'ListLink':require('../models/list_link.js'),
        'List':require('../models/list.js'),
        'ItemLink':require('../models/item_link.js'),
        'Item':require('../models/item.js'),
        'Reminder':require('../models/reminder.js'),
        'Audit':require('../models/audit.js'),
        'StackHelper':require('../helpers/stack_helper.js'),
        'CategoryHelper':require('../helpers/category_helper.js'),
        'ListHelper':require('../helpers/list_helper.js'),
        'ItemHelper':require('../helpers/item_helper.js'),
        'AuditHelper':require('../helpers/audit_helper.js'),
        'ReminderHelper':require('../helpers/reminder_helper.js'),
        'HashHelper':require('../helpers/hash_helper.js'),
        'UserHelper':require('../helpers/user_helper.js'),
        'StatusCodeHelper':require('../helpers/status_code_helper.js'),
        'Utils':require('../utils/utils.js'),
        'LogHelper': require('../helpers/log_helper.js')
    };
};