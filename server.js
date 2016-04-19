'use strict';

var http = require('http');
var path = require('path');
var express = require('express');
var routes = require('./routes');
var Database = require('./database');
var db = new Database('mongodb://localhost:27017/p2p');

var app = express();
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "pug");
app.locals.db = db;
app.locals.pretty = true;
app.locals.count = 0;
app.locals.hots = [];
app.locals.hots.push('Debian');
app.locals.hots.push('Connie Carter');
app.locals.hots.push('Alizee');
app.locals.hots.push('YYeTs');
app.locals.hots.push('The Flash');
routes(app);

var server = http.createServer(app);
server.listen(8080, '0.0.0.0', function(){
    console.log('Listening on port 8080...');
});

