require(["modules/jquery-mozu", "underscore", "hyprlive"], function ($, _, Hypr) {
	$(document).ready(function() {
		$('html').click(function() {
			$('.mz-pageheader #searchbox').addClass('hidden');
		});
		$('.mz-pageheader .mz-header-search-toggle').click(function(){
			$(this).children('#searchbox').toggleClass('hidden');
			event.stopPropagation();
		});
		$('.mz-pageheader #searchbox').click(function(){
			event.stopPropagation();
		});
	});
});