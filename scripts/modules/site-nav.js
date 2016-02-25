require(["modules/jquery-mozu", "underscore", "hyprlive"], function ($, _, Hypr) {
	// $(document).ready(function() {

		/* Adds class to second half of top nav mega menu links */
		var numTopNavLinks = $('#mega-menu .mz-sitenav-list').children('.mz-sitenav-item').length;
		var	halfTopNavLinks = numTopNavLinks/2;
		$('#mega-menu .mz-sitenav-list').children('.mz-sitenav-item').each(function(){
			if ($(this).index() > halfTopNavLinks) {
				$(this).addClass('mm-float-right');
			}
		});

		/* Mega Menu column number JS */
		var endCol1 = Hypr.getThemeSetting('mm-1-col-end');
		var endCol2 = Hypr.getThemeSetting('mm-2-cols-end');
		var endCol3 = Hypr.getThemeSetting('mm-3-cols-end');
		$('#mega-menu .mz-sitenav-sub').each(function(){
			var numCategories = $(this).find('.mz-sitenav-link').length;
			if (numCategories >= endCol3) {
				$(this).parent('.mz-sitenav-item').addClass('mm-4-cols');
			} else if (numCategories >= endCol2 && numCategories < endCol3) {
				$(this).parent('.mz-sitenav-item').addClass('mm-3-cols');
			} else if (numCategories >= endCol1 && numCategories < endCol2) {
				$(this).parent('.mz-sitenav-item').addClass('mm-2-cols');
			} else if (numCategories < endCol1) {
				$(this).parent('.mz-sitenav-item').addClass('mm-1-col');
			}
		});
	// });
});