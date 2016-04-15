'use strict';

var assert = require('assert');
var mongodb = require('mongodb');
var client = mongodb.MongoClient;

var Database = function(dburl){
    if (!(this instanceof Database)){
	return new Database(dburl);
    }
    this._dburl = dburl;    
    client.connect(this._dburl, function(err, db){
	assert.equal(err, null);
	db.close();
    });
};

var _findOne = function(db, key, callback){
    var coll = db.collection('documents');
    coll.findOne({"_id" : key}, function(err, data){
	assert.equal(err, null);
	callback(data);
	db.close();
    });
};

var _findMany = function(db, keyword, callback){
    var coll = db.collection('documents');
    coll.find({$text: {$search: keyword}}, {score: {$meta: 'textScore'}})
	.sort({score: {$meta: "textScore"}})
	.toArray(function(err, results){
	    assert.equal(err, null);
	    db.close();
	    callback(results);
	});
};

Database.prototype.get = function(key, callback){
    client.connect(this._dburl, function(err, db){
	assert.equal(err, null);
//	_findOne(db, key, callback);
	var coll = db.collection('documents');
	coll.findOne({"_id" : key}, function(err, data){
	    assert.equal(err, null);
	    callback(data);
	    db.close();
	});
    });
};

Database.prototype.search = function(keyword, skip, limit, callback){
    client.connect(this._dburl, function(err, db){
	assert.equal(err, null);
	//_findMany(db, keyword, callback);
	var coll = db.collection('documents');
	coll.find({$text: {$search: keyword}}, {score: {$meta: 'textScore'}})
	    .sort({score: {$meta: "textScore"}}).skip(skip).limit(limit)
	    .toArray(function(err, results){
		assert.equal(err, null);
		db.close();
		callback(results);
	    });
    });
};

Database.prototype.count = function(callback){
    client.connect(this._dburl, function(err, db){
	assert.equal(err, null);
	var coll = db.collection('documents');
	coll.count({}, function(err, count){
	    callback(count);
	    db.close();
	});
    });
};

module.exports = Database;
