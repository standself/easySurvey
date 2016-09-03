// var Db = require('mongodb').Db,
// 	server = require('mongodb').Server,
// 	settings = require('../settings');

// module.exports = new Db(settings.db, new server(settings.host, '27017', {}), {safe: true});

//用新的mongodb访问方式
var mongoClient = require('mongodb').MongoClient;
var settings = require('../settings');
var url = "mongodb://" + settings.host + ":27017/" + settings.db;

var getDoc = function(db, callback) {
	var collection = db.collection('writter');
	console.log(collection);
	collection.findOne({name: 'xizhihui'}, function(err, doc) {
		callback(doc);
	});
};


mongoClient.connect(url, function(err, db) {
	getDoc(db, function(doc) {
		console.log(doc);
	});
	db.close();
	module.exports = db;
});