var Result = require('../results');


// Result.deleteSurvey('我的第一个问卷', function(err, result) {
// 	if (err) console.log("deleteSurvey err: \n", err);
// 	else console.log('deleteSurvey result ok \n');
// });

var result = new Result({
	title: "我的第一个问卷",
	"totalScore": {}
});

result.save(function(err, doc) {
	if (err) console.log("result save is wrong\n", err);
	else {
		console.log('result save is ok\n', doc);
	}
});

Result.get("我的第一个问卷", null, function(err, doc) {
	if (err) {
		console.log("result.get is wrong.\n", err);
	} else {
		console.log("result.get is ok\n", doc);
	}
});

var writter1 = {
	"name": "xizhihui",
	"time": "2016-08-14 20:51",
	"Q1": "a",
	"Q2": "b",
	"Q3": "c"
};

var writter2 = {
	"name": "xizhihu",
	"time": "2016-08-14 20:51",
	"Q1": "a",
	"Q2": "a",
	"Q3": "d"
}
Result.update('我的第一个问卷', writter1, function(err, doc) {
	if (err) {
		console.log("result.update is wrong.\n%s", err);
	} else {
		console.log("result.update is ok\n");
	}	
});

Result.update('我的第一个问卷', writter2, function(err, doc) {
	if (err) {
		console.log("result.update is wrong.\n%s", err);
	} else {
		console.log("result.update is ok\n");
	}	
});

Result.statistics('我的第一个问卷', function(err, result) {
	if (err) console.log("result.statistics wrong, ", err);
	else console.log("result.statistics ok");
});

Result.get('我的第一个问卷', "hello", function(err, doc) {
	if (err) {
		console.log("result.get is wrong again.\n", err);
	} else {
		console.log("result.get is ok again\nget doc", doc);
	}
});