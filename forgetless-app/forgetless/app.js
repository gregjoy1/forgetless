
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

var http = require('http');
var path = require('path');
var mysql = require('mysql');

GLOBAL.config = require('./config/config.js')(express, app, path);
GLOBAL.dbPool = require('./config/database.js')(mysql, config);

var router = require('./router/router.js');

var utils = require('./utils/utils.js');

router.setUpAndStartRouting(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

