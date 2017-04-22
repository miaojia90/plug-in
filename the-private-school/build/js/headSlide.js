//初始化函数
$(function() {
    sliderObject.init();
});
//整屏切换 
var mySwiper = new Swiper('.swiper-container', {
    onSlideChangeEnd: function(swiper) {
        //触发点击事件
        var index = swiper.activeIndex;
        //找到需要处理的li的对象
        var obj = $(".nav-list li").eq(index);
        sliderObject.navClick(obj,1);
    }
});
//slider滑动的对象
var sliderObject = {
    data: {
        start_x: 0,
        start_y: 0,
        start_y_left: 0
    },
    init: function() {
        //初始化界面元素
        $(".nav-list").css("left", 0);
        $(".nav-list li").each(function() {
            $(".nav-list li").eq(0).addClass("active").siblings().removeClass("active");
        });
        //事件绑定
        $(".nav-list li").on('click', function() {
            sliderObject.navClick(this,0);
        });
        $(".nav-list").on('touchstart', function(e) {
            sliderObject.navTouchstart(e, this);
        });
        $(".nav-list").on('touchmove', function(e) {
            sliderObject.navTouchmove(e, this);
        });
    },
    navClick: function(that,type) {
        $(that).addClass("active").siblings().removeClass("active");
        var nav_w = parseInt($(that).width());
        var nav_list = parseInt($(".nav-list").width());
        var clientWidth = document.documentElement.clientWidth;
        var left_value = 0;
        var li_length = $(".nav-list li").length;
        var left_nav_value = parseInt($(that).position().left);
        var fn_w = (clientWidth - nav_w) / 2;
        if (left_nav_value <= fn_w) {
            left_value = 0;
        } else if (fn_w - left_nav_value <= clientWidth - nav_list) {
            left_value = clientWidth - nav_list;
        } else {
            left_value = fn_w - left_nav_value;
        }
        $(".nav-list").animate({
            "left": left_value
        }, 300);
        if(type==0){
          mySwiper.slideTo($(that).index());
        }
    },
    navTouchstart: function(e, that) {
        var touch = e.originalEvent.targetTouches[0];
        sliderObject.data.start_x = touch.pageX;
        sliderObject.data.start_y = touch.pageY;
        sliderObject.data.start_y_left = parseInt(parseInt($(that).css("left")));
    },
    navTouchmove: function(e, that) {
        var touch = e.originalEvent.targetTouches[0];
        var x = touch.pageX;
        var y = touch.pageY;
        var nav_list = parseInt($(".nav-list").width());
        var clientWidth = document.documentElement.clientWidth;
        if (sliderObject.data.start_y_left + x - sliderObject.data.start_x >= 0) {
            $(that).css("left", 0);
        } else if (sliderObject.data.start_y_left + x - sliderObject.data.start_x <= clientWidth - nav_list) {
            $(that).css("left", clientWidth - nav_list);
        } else {
            $(that).css("left", sliderObject.data.start_y_left + x - sliderObject.data.start_x);
        }
        if (Math.abs(y - sliderObject.data.start_y) > 0) {
            e.preventDefault();
        }
    }
};