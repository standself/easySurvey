//发布中的问卷轮动;鼠标指向停止
function poll() {
	var timer_poll;
	timer_poll = setInterval(function() {
		var $lis = $('ul.publishing li'),
			$first_li = $lis[0],
			$ul = $('ul.publishing');
			$ul.append($first_li);
	}, 1500);
	return timer_poll;
}
var timer_poll = poll();
$('ul').mouseenter(function() {
	clearInterval(timer_poll);
}).mouseleave(function() {
	timer_poll = poll();
});