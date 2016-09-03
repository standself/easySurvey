//已经整合到newSurvey.js里面去了。
//添加 日期、保存发布栏
	var $deadLine = $('<div class="deadLine"></div>'),
		$input_deadLine = $('<input name="deadLine" value=' + new Date().toLocaleString() + '/>'),
		$input_save = $('<input name="save" id="save" type="button" value="保存问卷" />'),
		$input_publish = $('<input name="publish" id="publish" type="button" value="发布问卷" />');
	$deadLine.append('问卷截止日期：', $input_deadLine, $input_save, $input_publish);
	
	//提交页面内容
	//点击保存，不发布
	$input_save.click(function() {
		var content = getSurveyContent(),
			result = window.confirm("确定要保存？");
		content['state'] = 'unpublished';
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
			result = window.confirm("确定要保存并发布出去？");
		content['state'] = 'published';
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