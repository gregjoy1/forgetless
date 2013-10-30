
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

var http = require('http');
var path = require('path');

var config = require('./config/config.js')(express, app, path);

var router = require('./router/router.js');

router.setUpAndStartRouting(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

