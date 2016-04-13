define(['modules/jquery-mozu', 'hyprlive', 'underscore', 'modules/api', 'shim!vendor/bootstrap/js/affix[jquery=jQuery]', 'shim!vendor/bootstrap/js/scrollspy[jquery=jQuery]'], function ($, Hypr, _, api) {
  $(document).ready(function(){
    // Closes push menu
    $('#push-menu').find('.exit-push-menu').click(function(){
      if($('body').hasClass('push-menu-open')){
        $('body').removeClass('push-menu-open');
        $('.mz-mobilenav-item').removeClass('open');
      }
    });
    $('#push-menu-body-overlay').click(function(){
      if($('body').hasClass('push-menu-open')) {
        $('body').removeClass('push-menu-open');
        $('.mz-mobilenav-item').removeClass('open');
      }
    });
    // Opens push menu
    $('.mz-pageheader').find('.push-menu-toggle').click(function(){
      if($('body').not('push-menu-open')){
        $('body').toggleClass('push-menu-open');
      }
    });
    // Push menu nav toggles
    $('#push-menu').find('.mz-mobilenav-sub-toggle').click(function(){
      if($(this).closest('.mz-mobilenav-item').hasClass('open')) {
        $(this).closest('.mz-mobilenav-item').removeClass('open').find('.mz-mobilenav-sub').slideUp();
      } else {
        $('.mz-mobilenav-item').removeClass('open').find('.mz-mobilenav-sub').slideUp();
        $(this).closest('.mz-mobilenav-item').toggleClass('open');
        $(this).next().slideDown();
      }
    });
  });
});