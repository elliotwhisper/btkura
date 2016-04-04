'use strict';

var levi = require('levi')
var chinese = require('levi-chinese')

var db = levi('/opt/btkura/kuradb')
    .use(levi.tokenizer()).use(levi.stemmer()).use(levi.stopword())
    .use(chinese.converter()).use(chinese.segmenter())

var http = require('http');
var path = require('path');
var express = require('express');
var routes = require('./routes');

var app = express();
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "jade");
app.locals.db = db;
app.locals.pretty = true;
app.locals.count = 0;
routes(app);

var count = 0;
db.readStream().on('data', function(data){
    app.locals.count++;
});

var server = http.createServer(app);
server.listen(8080, '0.0.0.0', function(){
    console.log('Listening on port 8080...');
});

