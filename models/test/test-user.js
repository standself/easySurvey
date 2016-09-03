var User = require('../user');

var user = new User({
	name: "xizhihui"
});

// user.save(function(err, result) {
// 	console.log("err", err);
// 	console.log("user.save work well");
// 	console.log("result", result);
// });

// var survey = {
// 	title: "大学生周末兼职情况",
// 	time: "2016-08-15 12:45",
// 	status: "finished",
// 	content: {
// 		"a": "you are"
// 	}
// }

// User.update("xizhihui", survey, function(err, result) {
// 	if (err) {
// 		console.log("user.update works in a wrong way\n", err);
// 	} else {
// 		console.log('result update', result);
// 	}
// });

User.get("xizhihui", null, function(err, result) {
	if (err) {
		console.log("user.get works in a wrong way\n", err);
	}
	console.log("result get", result);
});

// User.deleteSurvey('xizhihui', '大学生周末兼职情况', function(err, result) {
// 	if (err) {
// 		console.log('user.deleteSurvey wrong', err);
// 	} else {
// 		console.log("user.deleteSurvey result");
// 	}
// });
User.deleteUser('xizhihui', function(err, result) {
	console.log("err", err);
	console.log("result deleteUser\n", result);
})

User.get("xizhihui", null, function(err, result) {
	if (err) {
		console.log("user.get works in a wrong way\n", err);
	}
	console.log("result get again", result);
});