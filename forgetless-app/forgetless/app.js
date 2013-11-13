
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

var http = require('http');
var path = require('path');
var mysql = require('mysql');

GLOBAL.async = require('async');
GLOBAL.config = require('./config/config.js')(express, app, path);
GLOBAL.dbPool = require('./config/database.js')(mysql, config);

GLOBAL.defs = {
    'DbModelBase':require('./models/forgetless_db_model.js'),
    'User':require('./models/user.js'),
    'CategoryLink':require('./models/category_link.js'),
    'Category':require('./models/category.js'),
    'ListLink':require('./models/list_link.js'),
    'List':require('./models/list.js'),
    'ItemLink':require('./models/item.js'),
    'Item':require('./models/item.js'),
    'Reminder':require('./models/reminder.js'),
    'Audit':require('./models/audit.js'),
    'ListHelper':require('./helpers/list_helper.js')
};

var router = require('./router/router.js');

var utils = require('./utils/utils.js');

router.setUpAndStartRouting(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

