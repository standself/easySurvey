var express = require('express'),
	router = express.Router();
var crypto = require('crypto');
var today = require('./Date格式化');//html5 的input calinder和date对象之间的日期格式不对。用其来格式化。

//与数据库进行交互的api
/* Account 存储用户账户
 * User 存储用户设计的问卷
 * Result 存储他人填写的问卷明细
 * writter 存储的是他人填写过的问卷
 */
var Account = require('../models/account'),
	User = require('../models/user'),
	Result = require('../models/results'),
	Writter = require('../models/writter');

/* get home page */
router.get('/', function(req, res) {
	//从cookie中取出用于首页展示的问卷，如果没有，就设置为空数组.
	var indexList = req.cookies['indexList'];
	//console.log(req.cookies);
	res.render('index', {
		user: req.session.user,
		list: indexList || []
	});
});

router.get('/login', function(req, res, next) {
	checkNotLogin(req, res, next, '未登陆');
});
router.get('/login', function(req, res, err) {
	res.render('login', {
		user: req.session.user,
		error: res.locals.error
	});
});
router.post('/login', function(req, res, next) {
	checkNotLogin(req, res, next, '未登录');
});
router.post('/login', function(req, res, err) {
	var  md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	var user = {
		name: req.body.username,
		password: password
	};
	Account.validate(user, function(err, bool) {
		//登陆成功 
		if (bool) {
			req.session.user = user;
			//console.log('res.locals.post\n', res.locals.post);
			//下面是用于登陆后跳回登陆前的页面
			if (res.locals.post) {
				var url = res.locals.post;
				req.session.post = null;
				return res.redirect(url);
			}
			return res.redirect('/');
		} else {
		//登陆失败
			req.flash('error', err.message);
			return res.redirect('/login');
		}
	});
});

router.get('/logout', function(req, res) {
	req.session.user= null;
	res.redirect('/');
});


router.get('/register', function(req, res, err) {
	res.render('register', {
		user: req.session.user,
		error: res.locals.error
	});
});
router.post('/register', function(req, res, next) {
	//生成口令的散列值，进行加密 
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	var newUser = new Account({
		username: req.body.username,
		password: password,
		mail: req.body.mail,
		phone: req.body.phone
	});
	newUser.save(function(err, user) {
		if (err) {
			//主要是用户是否已经存在
			req.flash('error', err.message);
			return res.redirect('/register');
		} else {
			req.session.user = {
				name: req.body.username,
				//password: password//密码这样可能会被暴露
			};
			//这里没有考虑注册后跳转到前一页面
			return res.redirect('/');
		}
	});
});


router.get('/newSurvey', function(req, res, next) {
	checkLogin(req, res, next, '请先登录，这样才能新建问卷啊。*_*');
});
router.get('/newSurvey', function(req, res, err) {
	res.render('newSurvey', {
		user: req.session.user
	});
});
router.post('/save', function(req, res, err) {
	var username = req.session.user.name,
		survey = req.body;
	var user = new User(username);
	//console.log('save, survey', survey);

	//每次用户设计完问卷，如果点的是发布，那么这个问卷就应该加入到主页的问卷展示。
	//这里通过cookie来实现，主页的问卷展示仅限最新的15个问卷
	var indexListCookie = req.cookies['indexList'] || [],
		indexList = {};
	if ( survey.state == 'publishing' ) {
		indexList.title = survey.title;
		indexList.deadline = survey.deadline;
		indexList.author = username;
		today.checkDupAdd(indexListCookie, indexList);
		res.cookie('indexList', indexListCookie);
	}

	User.get(username, survey.title, function(err, result) {
		//如果该用户不存在，就新建用户并更新，否则直接更新
		if (err) {
			user.save(function(err, result) {
				User.update(username, survey, function(err, result) {
					if (err) {
						console.log(err);
					}
				});
			});
		} else {
			User.update(username, survey, function(err, result) {
				if (err) {
					console.log(err);
				}
			});
		}
	});
	res.redirect('/surveyList');
});


router.get('/surveyList', function(req,res, next) {
	checkLogin(req, res, next)
})
router.get('/surveyList', function(req, res) {
	var user = req.session.user.name,
		surveyList = [];
	//User.get的第二个参数为空就获取所有问卷。
	User.get(user, '', function(err, result) {
		if (err) {
			//当用户没有问卷时，就直接跳转到 新建问卷页面
			console.log(err);
			res.redirect('/newSurvey');
		} else {
			//console.log('result\n', result);
			//问卷列表页只展示问卷的标题、截止时间和发布状态
			//理论上
			for (var title in result) {
				var newobj = {};
				newobj.title = title;
				newobj.deadline = result[title]['deadline'];
				newobj.state = result[title]['state'];
				//如果问卷的截止日期要早于当日，那么状态就应该变为 关闭 published。
				if ( today.date > newobj.deadline) newobj.state = 'published';
				surveyList.push(newobj);
			}
			res.render('surveyList', {
				user: req.session.user,
				surveyList: surveyList
			});
		}
	});
});


router.get('/editSurvey', function(req, res) {
	//对于不是以post形式访问问卷编辑页，都重定向到主页。
	res.redirect('/');
});
router.get('/editSurvey/:title', function(req, res, next) {
	checkLogin(req, res, next);
});
router.get('/editSurvey/:title', function(req, res) {
	var user = req.session.user.name,
		title = req.params.title,
		//content用于把数据库中取出的数据，格式化为易于页面展示的结构，如下。
		content = {};
	// 示例：
	// content = {
	// 	"title": "我最喜欢的flose",
	// 	"Q1": {
	// 		"type": "radio",
	// 		"choices": ["荷花", "guoluhuang", "向日葵"],
	// 		"body": "我最喜欢的flose"
	// 	},
	// 	"Q2": {
	// 		"type": "checkbox",
	// 		"choices": ["荷花", "guoluhuang", "向日葵", "jflgjdlgjsl"],
	// 		"body": "我最喜欢的flosehkhkh"
	// 	}
	// };
	User.get(user, title, function(err, result) {
		content['title'] = title;
		var keys = Object.keys(result[title]);
		//格式化content
		for (var i = 0, l = keys.length; i < l; i++ ) {
			content[keys[i]] = result[title][keys[i]];
		}
		//console.log('editSurvey, get, \n', content);
		res.render('editSurvey', {
			user: req.session.user,
			content: content
		});
	});
});

router.post('/deleteSurvey/:title', function(req, res) {
	var title = req.params.title,
		user = req.session.user;
	if ( title != 'all') {
		User.deleteSurvey(user.name, title, function(err, result) {
			if (err) {
				console.log('删除失败');
				res.json({
					title: title,
					success: 'false'
				});
			} else {
				console.log('已经删除\n', result);
				res.json({
					title: req.params.title,
					success: 'true'
				});
			}
		});
	} else {
		User.deleteUser(title.name);
	}
});


router.get('/vote/:title&:author', function(req, res) {
	//content 格式与editSurvey里面的content相同
	var user = req.params.author,
		content = {},
		title = req.params.title;
	User.get(user, title, function(err, result) {
		content['title'] = title;
		var keys = Object.keys(result[title]);
		if ( result[title].state !== 'publishing') {
			res.render('error', {
				user: req.session.user,
				message: title + ' 问卷不存在或者尚未发布。'
			});
			//不返回的话，后面的代码都会执行。
			return;
		}
		//格式化content
		for (var i = 0, l = keys.length; i < l; i++ ) {
			content[keys[i]] = result[title][keys[i]];
		}
		res.render('vote', {
			user: req.session.user,
			content: content
		});
	});
});
router.post('/vote', function(req, res) {
	var title = req.body.title,
		//这里的body是通过前端的form表单提交得到的。
		//由于前端收集的数据存在表单中的格式是string，我使用了json字符串，所以这里要转化。
		writter = eval('(' + req.body.answer + ')');
	writter.name = req.body.writter;
	writter.time = today.date;
	//console.log('index writter', writter);
	var vote = new Result(title);
	vote.save(function(err, result) {
		Result.update(title, writter, function(err, result) {
			if (err) {
				console.log('router vote post\n', err);
			}
		});
	});
	req.flash('success', title);
	//console.log('vaote', typeof title);//title是string
	res.redirect('/results/');
});

router.get('/results/', function(req, res) {
	//这个是提供给问卷设计者，查看问卷结果的。
	var title = res.locals.success[0];
	//console.log('results', res.locals.success, typeof title);//res.locals.succes是对象？
	Result.statistics(title, function(err, result) {
		console.log('router results:', result);
		res.render('results', {
			user: req.session.user,
			queryData: result,
			title: title
		});
	});
});
router.get('/results/:title', function(req, res) {
	//这个是提供给游客查看问卷结果的。
	var title = req.params.title;
	Result.statistics(title, function(err, result) {
		//console.log('router results:', result);
		res.render('results', {
			user: req.session.user,
			queryData: result,
			title: title
		});
	});
});


function checkLogin(req, res, next, prompt) {
	prompt = prompt || "请先登录才进行这样的操作哦。+_+"
	req.session.post = req.url;
	if ( !req.session.user) {
		req.flash('error', prompt);
		req.session.post = '/login';
		return res.redirect('/login');
	}
	next();
}

function checkNotLogin(req, res, next, prompt) {
	if (req.session.user) {
		req.flash('error', prompt);
		return res.redirect('/');
	}
	next();
}
module.exports = router;