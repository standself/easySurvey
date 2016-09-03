// var db = require('./db');
var mongoClient = require('mongodb').MongoClient;
var settings = require('../settings');
var url = "mongodb://" + settings.host + ":27017/" + settings.db;

function Writter(writter) {
	this.name = writter.name;
	this.survey = writter.survey;
}

Writter.prototype.save = function(callback) {
	var that = this;
	mongoClient.connect(url, function(err, db) {
		var collection = db.collection('writter');
		var newwritter = {
			name: that.name,
			survey: [that.survey]
		};
		collection.ensureIndex({"name": 1}, {unique: true, dropDups: true});
		collection.insert(newwritter, {safe: true}, function(err, result) {
			db.close();
			callback(err, result);
		});
	});
}

Writter.get = function(name, callback) {
	mongoClient.connect(url, function(err, db) {
		var collection = db.collection('writter');
		var query = name ? {name: name} : {};
		collection.find(query).toArray(function(err, docs) {
			db.close();
			if ( docs) {
				callback(err, docs);
			} else {
				return callback(err,docs);
			}
		});
	});
}

Writter.update = function update(name, survey, callback) {
	mongoClient.connect(url, function(err, db) {
		var	collection = db.collection("writter");
		collection.findOne({name: name}, function(err, doc) {
			if ( doc ) {
				var oldSurvey = doc.survey;
				oldSurvey.push(survey);
				collection.update({name: name}, {survey: oldSurvey}, {upsert:true});
				callback(err, doc);
			} else {
				console.log("you must create doc before you update it");
				callback(err);
			}
			db.close();
		});
	});
}

Writter.delete = function del(name, callback) {
	mongoClient.connect(url, function(err, db) {
		var collection = db.collection('writter');
		collection.deleteOne({name: name}, function(err, result) {
			//返回删除的项
			db.close();
			callback(err, result);
		})
	})
}
Writter.removeAll = function(bool, callback) {
	if (!bool) return; 
	mongoClient.connect(url, function(err, db) {
		var collection = db.collection('writter');
		collection.remove({}, function(err, result) {
			//返回删除的项
			db.close();
			callback(err, result);
		})
	})
}
module.exports = Writter;