require(["modules/jquery-mozu", "underscore", "hyprlive"], function ($, _, Hypr) {
	$(document).ready(function() {
		$('html').click(function() {
			$('#header1 #searchbox').addClass('hidden');
		});
		$('#header1 .mz-header-search-toggle').click(function(){
			$(this).children('#searchbox').toggleClass('hidden');
			event.stopPropagation();
		});
		$('#header1 #searchbox').click(function(){
			event.stopPropagation();
		});
	});
});