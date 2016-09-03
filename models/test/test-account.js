var User = require('../account');

var account = {
	name: 'xizhihui',
	password: '1234568'
};

// var user = new User(account);

// user.save(function(err, result) {
// 	if (err) console.log('user.save is wrong.\n', err);
// 	else console.log('user.save works ok.\n');
// });

User.validate(account, function(err, bool) {
	if (err) console.log('user.validate is wrong.\n', err);
	else console.log('user.validate works ok.   \n', bool);
});

var newUser = {
	name: 'xizhihui23',
	password: '456789'
};

// User.update(account, function(err, result) {
// 	if (err) console.log('user.update is wrong.\n', err);
// 	else console.log('user.update works ok.\n');
// });

// User.update(newUser, function(err, result) {
// 	if (err) console.log('user.update is wrong again.\n', err);
// 	else console.log('user.update works ok again.\n');
// });

// User.delete('xizhihui22', function(err, result) {
// 	if (err) console.log('user.delete is wrong again.\n', err);
// 	else console.log('user.delete works ok again.\n');
// });

// User.delete('xizhihui', function(err, result) {
// 	if (err) console.log('user.delete is wrong.\n', err);
// 	else console.log('user.delete works ok.\n');
// });

User.get('xizhihui', function(err, result) {
	if (err) console.log('user.get err \n', err);
	else console.log('user.get works well. \n', result);
});