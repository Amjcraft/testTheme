require(["modules/jquery-mozu", "underscore", "hyprlive"], function ($, _, Hypr) {
	$.getScript('//cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.0.0-beta.3/owl.carousel.min.js', function() {
	    //script is loaded and executed put your dependent JS here
		$(document).ready(function(){
			$('#fp-slider.owl-carousel').owlCarousel({
			    autoplay:false,
			    autoplayTimeout:5000,
			    autoplayHoverPause:true,
			    loop:true,
			    dots:false,
			    nav:true,
			    responsiveClass:true,
			    responsive:{
			        0:{
			            items:1
			        },
			        501:{
			            items:2
			        },
			        768:{
			            items:3
			        },
			        992:{
			            items:4
			        },
			        1200:{
			            items:5
			        }
			    }
			});
		});
	});
});