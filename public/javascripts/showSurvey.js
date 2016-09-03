var $btns = $('input:button'),
	$radios = $('input:radio'),
	$newQuery = $('.newQuery');

//点击跳转至目的页面, 这里改成采用a来跳转了了
$btns.click(function() {
	var value = $(this).attr('value'),
		name = $(this).attr('name'),
		grandpa = $(this).parent().parent(),
		data = [];
	if ( value == 'edit' ) {
		//获取name值，跳转至对应的编辑页面
		window.location.href = '/details/:' + name;
	} else if ( value == 'show' ) {
		//获取name值,跳转至对应的结果展示页面
		window.location.href = '/results/:' + name;
	} else if ( value == 'delete' ) {
		//如果点击删除，那就弹出确认框。
		showMask(function() {
			grandpa.remove();
			data.push(name);
			if ( data.length > 0 ) {
				ajaxDelete(data);
			}
		});
	} else if ( value == 'deleteAll') {
		var $that = $(this);
		showMask(function() {
			$btns.each(function(index, ele) {
				if ( $(ele).attr('value') == 'deleteAll' ) return;
				if ( index % 3 == 0) {
					grandpa = $(ele).parent().parent();
					//如果该行没被选定，就不会集体删除
					if ( !grandpa.find('input:radio').prop('checked') ) return;
					grandpa.remove();
					data.push($(ele).attr('name'));					
				}
			});
			if ( data.length > 0 ) {
				ajaxDelete(data);
			}
			var newContent = $('<div class="row"><div class="col-md-4">已经没有问卷啦。</div></div>');
			newContent.insertBefore($that.parent());
		});	
	}
});
$newQuery.click(function(){
	window.location.href = '/new';
})


//单选框的点击选中与取消
$radios.click(function() {
	var checked = $(this).attr('checked');
	console.log(checked + '   here   ' + $(this).prop('checked'));
	$(this).attr('checked', !checked);
	if ( $(this).attr('name') == 'selectAll' ) {
		$radios.each(function(index, ele) {
			if ( $(ele).attr('name') == 'selectAll' ) return;
			checked = $(ele).prop('checked');
			$(ele).prop('checked', !checked);
		})
	}
});

function showMask(callback) {
	var $mask = $('<div>');
	var tpl = [
		'<div><h2 class="h-primary">警告</h3>',
		'<p>你确定要删除吗？</p>',
		'<div><button>不删除</button><button>删除</button></div></div>'
		].join(''),
		$maskbody = $(tpl);
	$mask.css({
		'position': 'fixed',
		'top': '0',
		'left': '0',
		'width': '100%',
		'height': '100%',
		'background': 'black',
		'opacity': '0.4',
		'filter': 'alpha(opacity=40)'
	});
	$maskbody.css({
		'z-index': '9999',
		'position': 'fixed',
		'top': '50%',
		'left': '50%',
		'width': '360px',
		'height': '260px',
		'margin': '-130px 0 0 -180px',
		'border-radius': '5px',
		'border': 'solid 2px #666',
		'background-color': 'white'
	});
	$('body').append($mask).append($maskbody);
	$maskbody.find('button').click(function() {
		if ( $(this).text() == '不删除' ) {
			$mask.remove();
			$maskbody.remove();
		} else {
			$mask.remove();
			$maskbody.remove();
			callback();
		}
	});
	return true;
};

//向服务器传递数据，data是json格式
function ajaxDelete(data) {
	$.ajax({
		type: 'post',
		url: '/delete',
		data: data,
		success: function(msg) {
			if (msg) {
				alert(msg);
			}
		},
	});
}