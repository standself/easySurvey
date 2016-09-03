var mongodb = require('mongodb').MongoClient;
var settings = require('../settings'),
	url = 'mongodb://' + settings.host + ':27017/' + settings.db;

function User(user) {
	this.name = user.username;
	this.password = user.password;
	this.mail = user.mail;
	this.phone = user.phone;
}

User.prototype.save = function(callback) {
	var user = {
		name: this.name,
		password: this.password,
		mail: this.mail,
		phone: this.phone
	};
	mongodb.connect(url, function(err, db) {
		if (err) {
			db.close();
			return callback(err);
		}
		var collection = db.collection("account");
		collection.findOne({name: user.name}, function(err, doc) {
			if (err) {
				db.close();
				return callback(err);
			} else if (doc) {
				db.close();
				err =  new Error(user.name + " has existed.");
				return callback(err);
			} else {
				collection.ensureIndex({'name': 1}, {unique: true, dropDups: true});
				collection.insert(user, {safe: true}, function(err, doc) {
					db.close();
					return callback(err, doc);
				});
			}
		});
	});
};

User.get = function(username, callback) {
	mongodb.connect(url, function(err, db) {
		if (err) {
			db.close();
			return callback(err);
		}
		var collection = db.collection('account');
		collection.findOne({'name': username}, function(err, doc) {
			db.close();
			console.dir(doc);
			if (err) {
				return callback(err);
			}
			if (doc) {
				var user = {
					name: doc.name,
					password: doc.password,
					mail: doc.mail,
					phone: doc.phone
				};
				return callback(err, user);
			} else {
				return callback(err, '没有该用户');
			}
		});
	});
};

User.validate = function(user, callback) {
	mongodb.connect(url, function(err, db) {
		if (err) {
			db.close();
			return callback(err);
		}
		var collection = db.collection('account');
		collection.findOne({'name': user.name}, function(err, doc) {
			console.log('doc', doc, "\n");
			db.close();
			if ( doc ) {
				if ( doc.name == user.name && doc.password == user.password ) {
					return callback(err, true);
				} else {
					err = new Error("密码错误。");
					return callback(err, false);
				}
			} else {
				err = new Error("该用户不存在");
				return callback(err, false);
			}
		});
	});
};

User.delete = function(username, callback) {
	mongodb.connect(url, function(err, db) {
		if (err) {
			db.close();
			return callback(err);
		}
		var collection = db.collection('account');
		collection.deleteOne({name: username}, function(err, result) {
			db.close();
			return callback(err, result);
		});
	});
};

User.update = function(user, callback) {
	var name = user.name, password = user.password;
	mongodb.connect(url, function(err, db) {
		if (err) {
			db.close();
			return callback(err);
		}
		var collection = db.collection('account');
		collection.update({name: name}, {$set: { "password": password}}, function(err, result) {
			db.close();
			return callback(err, result);
		})
	});
};
User.removeAll = function(bool, callback) {
	if ( bool !== true ) return;
	mongodb.connect(url, function(err, db) {
		if (err) {
			db.close();
			return callback(err);
		}
		var collection = db.collection('account');
		collection.remove({}, function(err, result) {
			db.close();
			return callback(err, result);
		});
	});
};

module.exports = User;