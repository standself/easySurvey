//进行简易的注册验证
function validation(str, type) {
	var validation = {};
	validation.username = function(str) {
		//用户名规则：不能含特殊字符，由字母和数字组成，必须由字母开头，长度要大于6位。
		var reg = /^[a-zA-z](\w|\d){3,15}$/g,
			result = reg.test(str);
		if(str.length < 6 || !result) return "用户名格式不正确";
		else return true;
	};
	validation.password = function(str) {
		var reg = /\w|\d{6, 15}/g,
			result = reg.test(str);
		if (result !== true) return '密码格式不正确';
		else return true;
	};
	validation.passwordAgain = function(str) {
		if (validation.password(str) !== true) return '密码格式不正确';
		else return true;
	}

	validation.phone = function(str) {
		var reg = /^1\d{10}$/,
			result = reg.test(str);
		if ( !result ) return '电话号码格式不正确';
		else return true;
	};
	return validation[type](str);
};

//需要进行验证的输入框的id。
var ids = ['username', 'password', 'passwordAgain', 'phone'];

var $register = $('#register_login');
$register.click(function(e) {
	var tag = true;
	function test(id) {
		var $element = $('#' + id);
		console.log('element', $element);
		var	result = validation($element.val().trim(), id);
		if ( result !== true ) {
			$element.next().text(result);
			return false;
		} else {
			$element.next().text('');
			return true;
		}
		
	}
	for(var i = 0, l = ids.length; i < l; i++) {
		tag = tag && test(ids[i]);
	}
	if ( $('#password').val().trim() !== $('#passwordAgain').val().trim() ) {
		$('#passwordAgain').next().text("两次输入的密码不正确");
		tag = tag && false;
	}
	console.log(tag);
	// e = e || window.event;
	// e.preventDefault();
	// e.stopPropagation();
	return tag;
});
