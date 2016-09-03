//需要jQuery

//添加 问卷标题栏
function title() {
	//添加 问卷标题
	var $input_title = $('<div class="title"><input class="input_none" placeholder="请输入问卷标题" /></div>');
	return $input_title;
}


//添加 日期、保存发布栏
function date_publish_save() {
	var $deadLine = $('<div class="deadLine"></div>'),
		$input_deadLine = $('<input type="date" name="deadLine" id="deadline" value=' + new Date().toLocaleString() + '/>'),
		$input_save = $('<input name="save" id="save" type="button" value="保存问卷" />'),
		$input_publish = $('<input name="publish" id="publish" type="button" value="发布问卷" />');
	$deadLine.append('问卷截止日期：', $input_deadLine, $input_save, $input_publish);
	return $deadLine;	
}
//保存发布事件
function save_publish_event() {
	var $input_save = $('input#save'),
		$input_publish = $('input#publish');

	//点击保存，不发布
	$input_save.click(function() {
		var content = getSurveyContent(),
			result, deadline;
		if ( !content || content['title'] == '') {
			alert('你应该把问卷设计完成，再提交');
			return;
		}
		content['state'] = 'unpublished';

		deadline = $('#deadline').val();
		if (deadline == '') {
			alert('请确定问卷截止时间。');
			return;
		} else {
			if ( deadline < new Date().format('yyyy-MM-dd') ) {
				alert('截止时间应该要晚于今日时间。');
				return;
			}
			content['deadline'] = deadline;
		}

		result = window.confirm("确定要保存？");
		if (result) {
			$.post(
				'/save/',
				content,
				function(data) {
					document.write(data);
				},
				'html'
			);
		}
	});
	//点击发布，既保存也发布
	$input_publish.click(function() {
		var content = getSurveyContent(),
			result, deadline;
		if ( !content || content['title'] == '') {
			alert('你应该把问卷设计完成，再提交');
			return;
		}
		content['state'] = 'publishing';

		deadline = $('#deadline').val();
		if (deadline == '') {
			alert('请确定问卷截止时间。');
			return;
		} else {
			if ( deadline < new Date().format('yyyy-MM-dd') ) {
				alert('截止时间应该要晚于今日时间。');
				return;
			}
			content['deadline'] = deadline;
		}		
		
		result = window.confirm("确定要保存并发布出去？");
		if (result) {
			$.post(
				'/save/',
				content,
				function(data) {
					//页面已经跳转，不需要了。
					//document.write(data);
				},
				'html'
			);
		}
	});
}


//添加 添加问题按钮
function addQuestion() {
	var $addQuestion = $('<div class="addQuestion"></div>'),
	$addLogo = $('<div class="addLogo"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span>添加问题</div>');
	$addQuestion.prepend($addLogo);
	return $addQuestion;
}
//添加问题 按钮点击事件
function addQuestion_event() {
	var $addLogo = $('div.addLogo');
	var $ul = $('ul.addChoice');
	if ($ul.length == 0) {
		$addLogo.click(function() {
			//添加问题类型导航
			$ul = $('<ul class="addChoice"></ul>');
			for ( var i = 0, l = choices.length; i < l; i++ ) {
				var $li = $('<li></li>');
				$li.text(choices[i]);
				$ul.append($li);
			}
			$(this).prepend($ul).unbind();
			var $lis = $ul.children('li');
			$lis.click(function(e) {
				e = e || window.event;
				e.preventDefault();
				e.stopPropagation();
				var target = e.target || e.srcElement,
					$grandpa = $(this).parent().parent();
				$grandpa.before(newQuestion(target.innerText));
			});
		});
	}
	$ul.delegate('li', 'click', function(e) {
			e = e || window.event;
			e.preventDefault();
			e.stopPropagation();
			var target = e.target || e.srcElement,
				$grandpa = $(this).parent().parent();
			$grandpa.before(newQuestion(target.innerText));
	});	
}
//删除、上下移动、复用按钮的事件
function up_down_re_del($reuse) {
	//添加 上移 下移 复用 删除 按钮
	var btns_add = ['上移', '下移', '复用', '删除'],
		$ul_reuse = $reuse || $('ul.reuse');
	$ul_reuse.delegate('li', 'click', function() {
		var $this = $(this),
			txt = $this.text(),
			$wrapper = $('div.addQuestion'),
			$now_question = $this.parent().parent().parent();
		switch(txt) {
			case '上移':
				//删除当前，插入其前同辈元素的前面
				var $prev_question = $now_question.prev();
				if ($prev_question.length == 0) return;//如果不存在上一个元素，就直接返回，下同。
				$now_question.insertBefore($prev_question);
				var middle = $now_question.find('span').text();
				$now_question.find('span').text($prev_question.find('span').text());
				$prev_question.find('span').text(middle);
				break;
			case '下移':
				//删除当前，插入当前其同辈元素的前面
				var $next_question = $now_question.next();
				if ($next_question.length == 0) return;
				if ( $next_question.find('ul').hasClass('addChoice') ) return;//排除添加问题按钮
				$now_question.insertAfter($next_question);
				var middle = $now_question.find('span').text();
				$now_question.find('span').text($next_question.find('span').text());
				$next_question.find('span').text(middle);
				break;
			case '复用':
				//复制当前元素，并插入父元素的后面, 添加元素的前面
				var count = $('.questions').length + 1,
					$new_Question = $now_question.clone(true);
				$new_Question.find('span').text('Q' + count + ' ');
				$wrapper.find('div:last-of-type').before($new_Question);
				break;
			case '删除':
				$now_question.remove();
				break;
		}
	});
}
//选项添加删除按钮 
function choice_add_del($input_add, $input_del, type) {
	type = type || 'radio';
	var $input_add = $input_add || $('input.question_add:nth-of-type(1)'),
		$input_del = $input_del || $('input.question_add:nth-of-type(2)');
	$input_add.click(function() {
		var $this = $(this).parent();//this指代input_add,而li.clone后要插入的是input_add所在的li之前
		$('<li><input type="' + type + '" /><input type="text" class="question_choice input_none" placeholder="选项，点击修改" /></li>').insertBefore($this);
		console.log($this.prev());
	});
	$input_del.click(function() {
		var $this = $(this).parent(),
			$prev_li = $this.prev();
		$prev_li.remove();
	});
}


//新建问题
function newQuestion(str) {
	str = str || '单选';//默认为单选
	var type = '';
	switch (str) {
		case '单选':
			type = 'radio';
			break;
		case '多选':
			type = 'checkbox';
			break;
		case '文本':
			type = 'textarea';
	}

	var $question = $('<div class="questions"></div>'),
		$ul = $('<ul></ul>'),//选项列表
		$li = $('<li></li>'),
		question_count = $('div.questions').length + 1,//问题序号
		$newInput;//用作类型是文本的时候

	//添加题干
	var question_body = $('<input type="text" class="question_body input_none" placeholder="你的问题。。。。"/>'),
		question_seq = $('<span>Q' + question_count + ' </span>');//问题序号的容器span
	$question.append(question_seq, question_body);

	//添加问题的选项
	if (type == 'textarea') {
		$newInput = $('<textarea class="question_choice"></textarea>');
		$ul.append($li.append($newInput));
	} else {
		$newInput= $('<input type="' + type + '" /><input type="text" class="question_choice input_none" placeholder="选项，点击修改" />');
		$li.append($newInput);
		$ul.append($li, $li.clone(true));
	}

	//添加 添加选项 按钮
	$li_add = $('<li></li>');
	$input_add = $('<input class="question_add input_none" value="+ 添加选项" type="button"></input>');
	$input_del = $('<input class="question_add input_none" value="- 删除选项" type="button"></input>');
	$li_add.append($input_add, $input_del);
	//如果不是textarea类型的问题，就添加选项添加删除按钮
	if (type != 'textarea') $ul.append($li_add);
	choice_add_del($input_add, $input_del);

	//添加 上移 下移 复用 删除 按钮
	var btns_add = ['上移', '下移', '复用', '删除'],
		$ul_reuse = $('<ul class="reuse"></ul>');
	for ( var i = 0, l = btns_add.length; i < l; i++ ) {
		var $li_reuse = $('<li>' + btns_add[i] + '</li>');
		$ul_reuse.append($li_reuse);  
	}
	up_down_re_del($ul_reuse);
	$ul.append($ul_reuse);
	$question.append($ul);
	return $question;
}

//获取问卷内容
function getSurveyContent() {
	var content = null;
	var tag = true;
	// content = {
	// 	title: title,
	// 	Q1: {
	// 		type: type,
	// 		choices: choices_arr,
	// 		body: body
	// 	}
	// }
	var title = $('div.title').find('input').val().trim();
	var $questions = $('.questions');
	$questions.each(function(index, element) {
		var question_seq, question_body, question_choices, type,
			question_choice_arr = [];
		content = content || {};
		var $this = $(this);
		question_seq = $this.find('span').text().trim();
		question_body = $this.find('.question_body').val().trim();
		question_choices = $this.find('.question_choice');
		question_choices.each(function(index, element) {
			var txt = $(this).val().trim(),
				$prev = $(this).prev();
			if ( $prev.length != 0 ) type = $prev.attr('type');
			else type = 'textarea';
			if ( txt)
			question_choice_arr.push(txt);
		});
		var middle = {};
		if ( title == '' || question_body == '' || question_choice_arr.length < 1) tag = false;
		middle['body'] = question_body;
		middle['choices'] = question_choice_arr;
		middle['type'] = type;
		content[question_seq] = middle;
		content['title'] = title;
	});
	if ( content ) {
		if ( isEmptyObj(content) ) {
			content = false;
		}
	}
	content = tag ? content : tag;
	return content;
}

function isEmptyObj(obj) {
	var isEmptyObj = false;
	for ( var pro in obj ) {
		if (pro) isEmptyObj = isEmptyObj || true;
	}
	return !isEmptyObj;
}

//format是网上直接找的代码。
Date.prototype.format = function dateFormat(format) {
    var o = {
        "M+" : this.getMonth()+1, //month
		"d+" : this.getDate(),    //day
		"h+" : this.getHours(),   //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
		"S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1, (this.getFullYear()+"").substr(4- RegExp.$1.length));
    for(var k in o)
    	if(new RegExp("("+ k +")").test(format))
       		format = format.replace(RegExp.$1, RegExp.$1.length==1? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}

var choices = ['单选', '多选', '文本'];

var $btn_new = $('div.new'),
	$main = $('main');

//根据$btn_new存在与否，查询是newSurvey还是editSurvey页面。
//不能用length是否存在。用 $ 获取的总是有length。
if ( $btn_new.length > 0 ) {
	//newSurvey页面
	$btn_new.click(function() {
		//隐藏 新建问卷 按钮
		$(this).hide();

		//添加 问卷标题
		var $input_title = title(),
		//添加 添加问题 按钮
			$addQuestion = addQuestion(),
		//添加 日期、保存发布栏
			$deadLine = date_publish_save();

		//将上面三个组件添加到页面
		$main.append($input_title, $addQuestion, $deadLine);

		//绑定事件
		addQuestion_event();
		save_publish_event();
	});
} else {
	//editSurvey页面
	addQuestion_event();
	choice_add_del();
	up_down_re_del();
	save_publish_event();
}