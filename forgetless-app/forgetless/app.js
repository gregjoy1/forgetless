/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

var http = require('http');

// loads globals - this is loaded in this way to allow resource sharing with unit testing
require('./config/global_definitions.js')(express, app);

var router = require('./router/router.js');

var utils = require('./utils/utils.js');

router.setUpAndStartRouting(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

