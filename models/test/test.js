// var 
// // Result = require('./results'),
// // 	Survey = require('./survey'),
// // 	User = require('./user'),
var	Writter = require('./writter');

// test writter.js
var  writter = new Writter({
	name:"helloxizhhiui",
	survey: "我的第一个文卷"
});

// var a = writter.save(function(err) {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log("writter.save is ok");
// 	}
// });
// writter.save(function(err, result) {
// 	if (err) {
// 		console.log("writter.save error\n", err);
// 	} else {
// 		console.log("writter.save is ok agian");
// 	}
// });
// Writter.get("helloxizhhiui", function(err, doc) {
// 	if (doc) {
// 		console.log("writter.get doc is ok", doc);
// 	}
// 	if ( err ) {
// 		console.log("writter.get is wrong\n", err);
// 	}
// });

Writter.update("xizihui", "q", function(err, doc) {
	if ( doc ) {
		console.log("writter.update doc is ok");
	}
	if ( err ) {
		console.log("writter.get is wrong\n", err);
	}
});
Writter.update("helloxizhhiui", "q", function(err, doc) {
	if ( doc ) {
		console.log("writter.update doc is ok");
	}
	if ( err ) {
		console.log("writter.get is wrong\n", err);
	}
});

// Writter.get(null, function(err, doc) {
// 	if ( doc ) {
// 		for ( var i = 0, len = doc.length; i < len; i++ ) {
// 			Writter.delete("helloxizhhiui", function(){});
// 		}
// 		console.log(doc.length);
// 	}
// });
// Writter.removeAll(true, function() {
// 	console.log("you have remove all docs.");
// });
Writter.get(null, function(err, doc) {
	if ( doc) console.log(doc);
});