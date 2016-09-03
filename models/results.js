var mongoClient = require('mongodb').MongoClient;
var settings = require('../settings');

var url = 'mongodb://' + settings.host + ':27017/' + settings.db;


//totalScore的结构：
/* totalScore: {
 *	Q1: {
 *		a: 0,
 *		b: 0,
 *		c: 0,
 *		d: 0
 *	}
 * }
 */
function Results(title) {
	this.title = title;
}

Results.prototype.save = function(callback) {
	var newResult = {
		title: this.title,
		totalScore: {}
	};
	mongoClient.connect(url, function(err, db) {
		var collection = db.collection('results');
		collection.ensureIndex({"title": 1}, {unique: true, dropDups: true});
		collection.insert(newResult, {safe: true}, function(err, result) {
			db.close();
			callback(err, result);
		});
	});
};

/*获取title中writter的投票详情，如果writter为'total'，就获取title的结果统计; 如果为null，就输出整个。
 * title 	string 		投票名
 * writter 	string		投票者的名字
 */
Results.get = function(title, writter, callback) {
	writter = writter == 'total' ? "totalScore" :  writter;
	mongoClient.connect(url, function(err, db) {
		var collection = db.collection('results');
		collection.findOne({"title": title}, function(err, doc) {
			db.close();
			doc = writter ? doc[writter] : doc;
			callback(err, doc);
		});
	});
};

/* 更新title的新投票
 * writter 	{
 *	"name": "writter1",
 *  "time": "2016-08-14 234"
 *	"Q1": "a",
 *	"Q2": "b"
 * }
 */
Results.update = function(title, writter, callback) {
	var mid = {}, news = {};
	for (key in writter) {
		if ( key === 'name' || key ==="time" ) continue;
		mid[key] = writter[key];
	}
	news[writter.name] = mid;

	mongoClient.connect(url, function(err, db) {
		var collection = db.collection('results');
		collection.findOne({'title': title}, function(err, doc) {
			console.log('resutls update\n', doc);
			// if ( writter.name in doc ) {
			// 	err = new Error(writter.name + " has existed.");
			// 	db.close();
			// 	doc = '该名字已经存在了';
			// 	return callback(err, doc);
			// }
			collection.update({'title': title}, {$set: news}, {upsert: true}, function(err, doc) {
				db.close();
				callback(err, doc);
			});
		});
	});
};

Results.deleteWriter = function(title, writter, callback) {
	mongoClient.connect(url, function(err, db) {
		var collection = db.collection('results');
		var query = {};
		query[writter] = "";
		collection.update({"title": title}, {$unset: query}, function(err, result) {
			db.close();
			callback(err, result);
		});
	});
};

Results.deleteSurvey = function(title, callback) {
	mongoClient.connect(url, function(err, db) {
		var collection = db.collection('results');
		collection.remove({"title": title}, function(err, result) {
			db.close();
			callback(err, result);
		});
	});
}

Results.statistics = function(title, callback) {
	mongoClient.connect(url, function(err, db) {
		if (err) {
			db.close();
			console.error(err);
		}
		var collection = db.collection('results');
		collection.findOne({'title': title}, function(err, doc) {
			var keyName, keyQ, choice;
			//通过total把totalScore以前的统计数据清零。
			var total = {};
			for( keyName in doc ) {
				if ( keyName === 'title' || keyName === 'totalScore' || keyName === '_id') continue;
				var name = doc[keyName];
				for ( keyQ in name ) {
					//由于有单选和多选，多选的选定选项name[keyQ]是数组，干脆把单选的也弄成数组。
					//对于填空的，也是如此。在展示结果时，填空的直接展示有效数据量。
					var keyQQ = [];
					if (Object.prototype.toString.call(name[keyQ]) !== '[object Array]') {
						keyQQ.push(name[keyQ]);
					} else {
						keyQQ = name[keyQ];
					}
					while(keyQQ.length) {
						var keyQQPop = keyQQ.pop();
						if ( keyQ in total ) {
							if ( keyQQPop in total[keyQ] ) total[keyQ][keyQQPop] += 1;
							else total[keyQ][keyQQPop] = 1;
						} else {
							total[keyQ] = {};
							total[keyQ][keyQQPop] = 1;
						}
					}
				}
			}
			collection.update({'title': title}, {$set: {"totalScore": total}}, {upsert: true}, function(err, result) {
				db.close();
				callback(err, total);
			});
		});
	});
		/*{	// for( var key in mid ) {
			// 	if ( Object.prototype.toString.call(mid[key]) !== '[object Array]') {
			// 		var select = 'totalScore.' + key + '.' + mid[key];
			// 		console.log('select', select);
			// 		collection.update({'title': title}, {$inc: {select: 1}}, {upsert: true}, function(err, doc) {
			// 			count--;
			// 			if ( count == 0 ) {
			// 				db.close();
			// 				callback(err, doc);
			// 			}
			// 		});
			// 	} else {
			// 		count += mid[key].length;
			// 		for (var i = 0, len = mid[key].length; i < len; i++ ) {
			// 			var select = 'totalScore.' + key + '.' + mid[key][i];
			// 			collection.update({'title': title}, {$inc: {select: 1}}, {upsert: true}, function(err, doc) {
			// 				count--;
			// 				if ( count == 0 ) {
			// 					db.close();
			// 					callback(err, doc);
			// 				}
			// 			});
			// 		}
			// 	}
			// }
		}*/
}

module.exports = Results;