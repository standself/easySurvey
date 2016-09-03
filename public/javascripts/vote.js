$('#submit').click(function() {
	var answers = {},
		$answer = $('#answer');

	var $questions = $('.questions');
	$questions.each(function(index, ele) {
		var ele = $(ele);
		var qBody = ele.find('.question_body').val(),
			type = ele.find('ul').attr('data-type'),
			choice;
		if ( type == 'checkbox' ) {
			choice = [];
			ele.find('ul').find('input:'+ type + ":checked").each(function(index, element) {
				choice.push($(this).next().val());
			});
		} else if (type == 'radio') {
			choice = ele.find('ul').find('input:'+ type + ":checked").next().val();
		}
		else {
			choice = ele.find('textarea').val();
		}
		answers[qBody] = choice;
	});
	answers = JSON.stringify(answers);
	$answer.val(answers);
});