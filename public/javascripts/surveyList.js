//遮盖层
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
		'background-color': 'white',
		'border-radius': '15px'
	});
	$maskbody.find('h2').css({
		'width': "100%",
		'margin': "30px 0px",
		'padding': '0px',
		'color': 'red',
		'height': '50px',
		'line-height': '50px',
		'text-align': 'center'
	});
	$maskbody.find('p').css({
			'font-size': '30px',
			'margin': '20px',
			'text-align': 'center'
	});
	$maskbody.find('button').parent().css({
		'margin': '0px',
		'padding': '0px',
		'height': "40px",
		'line-height': '40px'
	});
	$maskbody.find('button').css({
		'height': '30px',
		'width': '60px',
		'margin': '10px 60px',
		'border-radius': '5px'
	});
	$('body').append($mask).append($maskbody);
	$maskbody.find('button').click(function() {
		if ( $(this).text() == '不删除' ) {
			$mask.remove();
			$maskbody.remove();
		} else {
			callback();
			$mask.remove();
			$maskbody.remove();
		}
	});
	return true;
};

//单选框的点击选中与取消
var $checkbox = $('input:checkbox');
$checkbox.click(function() {
	var checked = $(this).attr('checked');
	$(this).attr('checked', !checked);
	if ( $(this).attr('name') == 'list-selectAll' ) {
		$checkbox.each(function(index, ele) {
			if ( $(ele).attr('name') == 'selectAll' ) return;
			checked = $(ele).prop('checked');
			$(ele).prop('checked', !checked);
		})
	}
});


//按钮事件绑定
var tbody = $('tbody');
tbody.delegate('tr', 'click', function(e){
	var $this = $(this),
		title = $this.find('.list-title').text();

	e = e || window.event;
	var target = e.target || e.srcElement,
		$target = $(target),
		value = $target.val()
		if (value == '编辑') {
			window.location.href = '/editSurvey/' + title;
		} else if (value == '删除') {
			//把全选的按钮排除
			if ($target.attr('id') == 'list-delAll') return;
			showMask(function() {
				var url = '/deleteSurvey/' + title;
				$.ajax({
					type: 'post',
					url: url,
					success: function(msg) {
						if (msg.success == 'true') {
							console.log(msg);
							$this.remove();
						}
					}
				});
			});
		} else if (value == '查看结果') {
			window.location.href = '/results/' + title;
		}
});
$('input#list-delAll').click(function() {
	var titles = [];
	showMask(function() {
		$('input:checkbox').each(function(index, ele) {
			var checked = $(this).prop('checked');
			if ( $(this).attr('name') == 'list-selectAll' ) return;
			if ( checked == true ) {
				var $parent = $(this).parent().parent();
				titles.push($parent.find('.list-title').text());
				$parent.remove();
			}
		});
		$.ajax({
			type: 'post',
			url: '/deleteSurvey/all',
			data: {titles: titles},
			success: function(msg) {
				if(msg) {
					console.log(msg);
				}
			}
		});
		var $trs = tbody.find('tr');
		if ( $trs.length > 1 ) return;//最后有一个tr全选的，所以tr的个数最少是1。
		var newtr = $('<tr><td colspan=4><a href="/newSurvey">你的问卷空空如也，点我创建吧。</a></td></tr>');
		tbody.prepend(newtr);
	});
});