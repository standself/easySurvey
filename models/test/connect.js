var mongodb = require('mongodb'),
	server = new mongodb.Server('localhost', 27017, {});
var db = new mongodb.Db('xizhihui', server, {safe: true});
var users = {
			name: "xizhihui1",
			word: "hello the crule world"
	};

db.open(function(err, db) {
	if (err) {
		console.log(err, "\n+++++++++++++++++++++++++++++++++++\n");
	}
	db.collection('tests', function(err, collection) {
		var all = collection.findOne({name: "test0"});
		collection.findOne({ name: "xizhihui1"}, function(err, doc) {
			console.log(doc);
			console.log('\ntest0: ', all);
		});
		var user = {
			name: users.name,
			word: users.word
		};
		collection.insert(user, {safe: true}, function(err) {
			console.log("err", err);
		});
		collection.update({name: "xizhihui1"}, {$set: {word: "crule"}});
		console.log("the system is ok \n");
		db.close();
	});

	console.log("the system is closed\n");
});

// db.open(function(err, db) {
// 	if (err) {
// 		console.log(err, "\n+++++++++++++++++++++++++++++++++++\n");
// 	}
// 	db.collection('tests', function(err, collection) {
// 		var all = collection.findOne({name: "test0"});
// 		collection.findOne({ name: "xizhihui1"}, function(err, doc) {
// 			console.log(doc);
// 			console.log('\ntest0: ', all);
// 		});
// 		var user = {
// 			name: users.name,
// 			word: users.word
// 		};
// 		collection.insert(user, {safe: true}, function(err) {
// 			console.log("err", err);
// 		});
// 		collection.update({name: "xizhihui1"}, {$set: {word: "crule"}});
// 	});
// 	console.log("the system is ok \n");
// 	db.close();
// });

module.exports = db;