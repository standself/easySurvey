var express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	logger = require('morgan'),
	path = require('path'),
	jade = require('jade'),
	session = require('express-session'),
	flash = require('connect-flash'),
	Mongodb = require('connect-mongo')(session),
	crypto = require('crypto');

//任务、错误日志系统
var fs = require('fs'),
	accessLogfile = fs.createWriteStream('access.log', {flags: 'a'}),
	errorLogfile = fs.createWriteStream('error.log', {flags: 'a'}),
	logger = require('morgan');


var index = require('./route/index');

var app = express();

//进行请求体解析req.body、cookie解析
app.use(bodyParser());
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');



//日志系统
app.use(logger({stream: accessLogfile}));
app.use(logger({stream: errorLogfile}));

//生产环境就不需要把错误的详细写出来了
app.use(function(req, res, err, next) {
	var meta = '[' + new Date() + ']' + req.url + '\n';
	errorLogfile.write(meta + err.stack + '\n');
	next();
	res.status(err.status || 500);
	var errorMessage = {};
	//如果是开发环境，就在错误页面显示错误.否则，只显示出错了.
	if ( app.get('env') === 'development' ) errorMessage = err;
	res.render('error', {
		message: err.message,
		error: errorMessage
	});
});

app.use(session({
	secret: 'survey',
	store: new Mongodb({
		url: 'mongodb://localhost/survey',
	})
}));

app.use(flash());
app.use(function(req, res, next){
  //res.locals用来设置全局变量，比如整站的已经登陆用户
  res.locals.user = req.session.user;
  res.locals.post = req.session.post;
  
  var error = req.flash('error');
  res.locals.error = error.length ? error : null;
 
  var success = req.flash('success');
  res.locals.success = success.length ? success : null;
  console.log('res.locals.success', res.locals.success, "\n");
  next();
});

app.use('/', index);

//如果是直接调用，就启动服务器。
if(!module.parent) {
	app.listen(3000);
console.log('the web is running on 3000.');
}