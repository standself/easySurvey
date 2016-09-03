var mongoClient = require('mongodb').MongoClient;
var settings = require('../settings');
var url = "mongodb://" + settings.host + ":27017/" + settings.db;

function User(username) {
	this.name = username;
}

/* 存储用户，用户的问卷信息还是得由update来更新。
 * callback fn
 * callback(err, result)
 */
User.prototype.save = function(callback) {
	var that = this;//进入connect中后，this的指向就变了。
	mongoClient.connect(url, function(err, db) {
		var collection = db.collection('user');
		var newUser = { name: that.name };
		collection.ensureIndex({"name": 1}, {unique: true, dropDups: true});
		collection.insert(newUser, {safe: true}, function(err, result) {
			db.close();
			callback(err, result);
		});
	});
}

/* 查询指定问卷内容
 * user 	用户名
 * survey 	查询的问卷名，如果为空，则返回user下所有的问卷
 */
User.get = function(user, survey, callback) {
	mongoClient.connect(url, function(err, db) {
		var collection = db.collection('user');
		var query = { name: user };
		collection.findOne(query, function(err, doc) {
			db.close();
			var result = {};
			if (doc) {
				if ( survey ) {
					result[survey] = doc[survey];
					callback(err, result);
				} else {
					for( var key in doc) {
						if ( key === "name" || key === '_id') continue;
						result[key] = doc[key];
					}
					callback(err, result);
				}
			} else {
				var err = '没有这个用户';
				callback(err);
			}
		});
	});
}

User.getAll = function(user, callback) {
	mongoClient.connect(url, function(err, db) {
		var collection = db.collection('user');
		var query = { name: user};
		collection.find(query, function(err, doc) {
			db.close();
			console.log(err, '\n adsafadf');
		});
	});
}

/* 添加该用户的问卷
 * name 	用户名
 * survey 	新增的问卷
 *
 *var survey = {
 *	title: "大学生周末兼职情况",
 *	time: "2016-08-15 12:45",
 *	status: "finished",
 *	content: {
 *		"a": "you are"，
 *		...
 *	}
 *}
 */
User.update = function update(name, survey, callback) {
	var midSurvey = {}, newSurvey = {};
	for ( var key in survey ) {
		if ( key === "title" ) continue;
		midSurvey[key] = survey[key];
	}
	newSurvey[survey.title] = midSurvey;

	console.log("newSurvey", newSurvey);
	mongoClient.connect(url, function(err, db) {
		var	collection = db.collection("user");
		collection.findOne({name: name}, function(err, doc) {
			if ( doc ) {
				collection.update({name: name}, {$set: newSurvey});
				callback(err, doc);
			} else {
				collection.update({name: name}, {$set: newSurvey});
				console.log("you must create doc before you update it");
				callback(err);
			}
			db.close();
		});
	});
}

//删除某个用户
User.deleteUser = function del(name, callback) {
	mongoClient.connect(url, function(err, db) {
		var collection = db.collection('user');
		collection.deleteOne({name: name}, function(err, result) {
			//返回删除的项
			db.close();
			callback(err, result);
		})
	})
}

//删除“user”下的所有内容
User.removeAll = function(bool, callback) {
	if (!bool) return; 
	mongoClient.connect(url, function(err, db) {
		var collection = db.collection('user');
		collection.remove({}, function(err, result) {
			//返回删除的项
			db.close();
			callback(err, result);
		})
	})
};

User.deleteSurvey = function(name, surveyName, callback) {
	mongoClient.connect(url, function(err, db) {
		var collection = db.collection('user');
		var survey = {};
		survey[surveyName] = "";
		collection.update({name: name}, {"$unset": survey}, function(err, result) {
			db.close();
			console.log(err);
			if (err) return callback(err);
			callback(err, result);
		})
	})
}
module.exports = User;