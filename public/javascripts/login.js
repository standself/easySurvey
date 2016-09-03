var $login = $('input#login');
$login.click(function(e) {
	var tag = true;
	$('input').each(function(index, e) {
		var $this = $(this);
		if ($this.attr('id') == 'username' || $this.attr('id') == 'password' ) {
			if ($this.val().length > 0 ) ;
			else {
				tag = false;
				$this.after($('<span>不能为空</span>'));
			}
		}
	});
	return tag;
});