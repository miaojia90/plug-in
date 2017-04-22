# plug-in
模拟音频插件
html
<div class="audio-player">
    <img src="http://www.gbtags.com/gb/laitu/750x400" style="height: 65%;" />
    <a class="audio-action play"></a>
    <p class="schedule-area">
        <span class="startTime">00:00:00</span>
        <span class="schedule">
        <i class="schedule-active"></i>
        <i class="progress-button"></i>
      </span>
        <span class="endTime">00:00:00</span>
    </p>
</div>
scss
.audio-player{
    position:relative;
    overflow: hidden;
    img{
        width: 100%;
    }
    .audio-action{
        width: rem(50);
        height: rem(50);
        display: block;
        position:absolute;
        top:50%;
        left:50%;
        margin-top: rem(-25);
        margin-left:rem(-25);
        &.play{
            background:url(../img/cf/video/icon-play.png) no-repeat;
            background-size:cover;
        }
        &.replay{
            background:url(../img/cf/video/icon-replay.png) no-repeat;
            background-size:cover;
        }  
        &.suspend{
            background:url(../img/cf/video/icon-suspend.png) no-repeat;
            background-size:cover;      
        } 
    }
    .schedule-area{
        display: block;
        padding:rem(10);
        background-color:rgba(0,0,0,0.6);
        color: #FFF;
        position:absolute;
        left:0;
        right: 0;
        bottom:0;
        z-index: 100;
        text-align: center;
        .schedule{
            position:relative;
            display: inline-block;
            width: 55%;
            height: 2px;
            background-color:#868686;
            margin:0 rem(15);
            .schedule-active{
                display:block;
                width: 50%;
                height: 2px;
                background-color:#FFF;
            }
        }
    }     
}
.progress-button{  
    width: 20px;  
    height: 20px;  
    display: block;  
    background-color: #FFF;  
    border-radius: 10px;  
    position: absolute;  
    top:-9px;  
    left:50%;
}  
js
<script type="text/javascript">
//音频对象
var audio_object = {
    duration: 0,
    currentTime: 0,
    clearInterval: null,
    init: function() {
        var resultTime = audio_object.formatSeconds(audio_object.duration);
        $('.startTime').html('00:00:00');
        $('.endTime').html(resultTime);
        $('.schedule-active').css("width", 0 + "%");
        $('.progress-button').css("left", 0 + "%");
        //绑定事件
        $('body').on('touchstart', '.audio-action', function() {
            if ($(this).hasClass('replay') || $(this).hasClass('play')) {
                if ($(this).hasClass('replay')) {
                    audio_object.currentTime = 0;
                }
                $(this).removeClass('replay').removeClass('play').addClass('suspend');
                var that = $(this);
                audio_object.clearInterval = setInterval(function() {
                    if (audio_object.currentTime == audio_object.duration) {
                        var resultTimeTemp = audio_object.formatSeconds(audio_object.currentTime);
                        $('.startTime').html(resultTimeTemp);
                        that.removeClass('suspend').addClass('replay');
                        clearInterval(audio_object.clearInterval);
                        return;
                    }
                    audio_object.currentTime = audio_object.currentTime + 1;
                    var percent = (audio_object.currentTime / audio_object.duration) * 100;
                    $('.schedule-active').css("width", percent + "%");
                    $('.progress-button').css("left", percent + "%");
                    var resultTimeTemp = audio_object.formatSeconds(audio_object.currentTime);
                    $('.startTime').html(resultTimeTemp);
                }, 1000);
            } else {
                $(this).removeClass('suspend').addClass('play');
                //停止往前滚动
                clearInterval(audio_object.clearInterval);
                return;
            }
        });
    },
    formatSeconds: function(value) {
        var theTime = parseInt(value); // 秒
        var theTime1 = 0; // 分
        var theTime2 = 0; // 小时
        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if (theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }
        var result = "" + (parseInt(theTime) > 9 ? parseInt(theTime) : ("0" + parseInt(theTime)));
        if (theTime1 > 0) {
            result = "" + (parseInt(theTime1) > 9 ? parseInt(theTime1) : ("0" + parseInt(theTime1))) + ":" + result; //分
        } else {
            result = "" + "00" + ":" + result; //分 
        }
        if (theTime2 > 0) {
            result = "" + (parseInt(theTime2) > 9 ? parseInt(theTime2) : ("0" + parseInt(theTime2))) + ":" + result; //小时
        } else {
            result = "" + "00" + ":" + result; //小时
        }
        return result;
    }
};

//拖动的音频效果
var scale = function(btn, bar, cur_bar) {
    this.btn = $(btn);
    this.bar = $(bar);
    this.cur_bar = $(cur_bar);
    this.minLength = this.bar.offset().left;
    this.maxLength = this.minLength + this.bar.width();
    this.currentX = this.btn.offset().left;
    this.currentY = this.btn.offset().top;
};
scale.prototype = {
    init: function() {
        var f = this;
        f.btn.on("touchstart", function(e) {
            // e.preventDefault();
                        var p = e.touches[0];
            var moveX = p.clientX;
            var moveY = p.clientY;
            scale.prototype.eventOperate(moveX, moveY, f);
        });
        f.btn.on("touchmove", function(e) {
            var p = e.touches[0];
            var moveX = p.clientX;
            var moveY = p.clientY;
            scale.prototype.eventOperate(moveX, moveY, f);
        });
        f.btn.on("touchend", function(e) {
            e.preventDefault();
            // var p = e.touches[0];
            // var moveX = p.clientX;
            // var moveY = p.clientY;
            // scale.prototype.eventOperate(moveX, moveY, f);
        });
        f.bar.on("click", function(e) {
            var clientX = e.clientX;
            var clientY = e.clientY;
            scale.prototype.eventOperate(clientX, clientY, f);
        });
    },
    eventOperate: function(moveX, moveY, f) {
        if (Math.abs(moveX - f.currentX) > 5) {
            if (moveX < f.minLength) {
                f.cur_bar.css("width", "0%");
                f.btn.css("left", "0%");
                f.currentX = f.minLength;
                audio_object.currentTime = 0;
                $('.startTime').html("00:00:00");
                $('.audio-action').removeClass('replay').removeClass('suspend').addClass('play');
            } else if (moveX > f.maxLength) {
                f.cur_bar.css("width", "100%");
                f.btn.css("left", "100%");
                f.currentX = f.maxLength;
                audio_object.currentTime = audio_object.duration;
                var resultTimeTemp = audio_object.formatSeconds(audio_object.currentTime);
                $('.startTime').html(resultTimeTemp);
                $('.audio-action').removeClass('play').removeClass('suspend').addClass('replay');
            } else {
                var percent = ((moveX - f.minLength) * 100) / (f.maxLength - f.minLength);
                f.currentX = moveX;
                audio_object.currentTime = Math.ceil(percent / 100 * audio_object.duration);
                percent = (audio_object.currentTime / audio_object.duration) * 100;
                f.cur_bar.css("width", percent + "%");
                f.btn.css("left", percent + "%");
                var resultTimeTemp = audio_object.formatSeconds(audio_object.currentTime);
                $('.startTime').html(resultTimeTemp);
            }
        }
    }
};

$(function() {
    audio_object.duration = 450;
    audio_object.currentTime = 0;
    audio_object.init();
    var music_bar = new scale('.progress-button', '.schedule', '.schedule-active');
    music_bar.init();
});
</script>
