// JavaScript Document
$(document).ready(function(){
	$('.arrow').click(function(){
		$(this).parent().next().slideToggle(400);
    });
    // 라이트박스
    $('.light_box_btn').click(function (e) {
        e.preventDefault();
        $('.light_box_wrap').fadeIn(200);
        $('body').css('overflow', 'hidden');
    });
    $('.light_box_close').click(function (e) {
        e.preventDefault();
        $('.light_box_wrap').fadeOut(200);
        $('body').css('overflow', 'auto');
    });
});