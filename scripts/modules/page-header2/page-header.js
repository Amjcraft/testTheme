require(["modules/jquery-mozu", "underscore", "hyprlive"], function ($, _, Hypr) {
	$(document).ready(function() {
		$('html').click(function() {
			$('#header2 #searchbox').addClass('hidden');
		});
		$('#header2 .mz-header-search-toggle').click(function(){
			$(this).children('#searchbox').toggleClass('hidden');
			event.stopPropagation();
		});
		$('#header2 #searchbox').click(function(){
			event.stopPropagation();
		});
	});
});