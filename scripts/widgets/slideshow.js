define(['modules/jquery-mozu', 'hyprlive', 'underscore', 'modules/api', 'shim!vendor/bootstrap/js/affix[jquery=jQuery]', 'shim!vendor/bootstrap/js/scrollspy[jquery=jQuery]'], function ($, Hypr, _, api) {
	$(document).ready(function(){

		$("#mz-slideshow").carousel({
			interval: 5000,
			pause: "hover",
			wrap: true,
			keyboard: false
		});

		/* Touch swipe settings */
		// $.getScript('//code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js');
		// $("#mz-slideshow").swiperight(function() {  
		// 	$(this).carousel('prev');  
		// });
		// $("#mz-slideshow").swipeleft(function() {  
		// 	$(this).carousel('next');  
		// });
	});

});