require(["modules/jquery-mozu", "underscore", "hyprlive"], function ($, _, Hypr) {
	$(document).ready(function() {
		/* Controls subnav close when clicking elsewhere on tablets in landscape */
		$('html').click(function() {
			if ($('.mz-sitenav .mz-sitenav-sub').hasClass('show') || $('.mz-sitenav .mz-sitenav-sub-sub').hasClass('show')) {
				$('.mz-sitenav .mz-sitenav-sub').removeClass('show');
				$('.mz-sitenav .mz-sitenav-sub-sub').removeClass('show');
			}
		});
		/* Prevents subnav close on tablets in landscape when clicking on subnav, but not subnav link/toggle */
		$('.mz-sitenav .mz-sitenav-sub').click(function(){
			event.stopPropagation();
		});
		/* Controls subnav open toggles on tablets in landscape */
		$('.mz-sitenav .mz-sitenav-sub-toggle').click(function(){
			$(this).siblings('.mz-sitenav-sub-toggle').children('.mz-sitenav-sub').removeClass('show').find('.mz-sitenav-sub-sub').removeClass('show');
			$(this).children('.mz-sitenav-sub').toggleClass('show');
			event.stopPropagation();
		});
		/* Controls sub-subnav open toggles on tablets in landscape */
		$('.mz-sitenav .mz-sitenav-sub-sub-toggle').click(function(){
			$(this).siblings('.mz-sitenav-sub-sub-toggle').children('.mz-sitenav-sub-sub').removeClass('show');
			$(this).children('.mz-sitenav-sub-sub').toggleClass('show');
			event.stopPropagation();
		});

		/* Adds class to second half of top nav mega menu links */
		var numTopNavLinks = $('#mega-menu .mz-sitenav-list').children('.mz-sitenav-item').length;
		var	halfTopNavLinks = numTopNavLinks/2;
		$('#mega-menu .mz-sitenav-list').children('.mz-sitenav-item').each(function(){
			if ($(this).index() >= halfTopNavLinks) {
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
	});
});