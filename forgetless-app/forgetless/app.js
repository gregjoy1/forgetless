
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

var http = require('http');
var path = require('path');
var mysql = require('mysql');
var config = require('./config/config.js')(express, app, path);
var db = require('./config/database.js')(mysql, config);
var router = require('./router/router.js');

router.setUpAndStartRouting(app, db);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

