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

Database.prototype.get = function(key, callback){
    client.connect(this._dburl, function(err, db){
	assert.equal(err, null);
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
	var coll = db.collection('documents');
	var datas = coll.find({$text: {$search: keyword}}, {score: {$meta: 'textScore'}})
	    .sort({score: {$meta: "textScore"}}).limit(1000);
	datas.count({}, function(err, count){
	    datas.skip(skip).limit(limit)
		.toArray(function(err, results){
		    assert.equal(err, null);
		    db.close();
		    callback(count, results);
		});
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
