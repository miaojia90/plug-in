/*
  function:音频播放
  add   by:major.miao 2017-04-22
*/
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
                    var resultTimeTemp;
                    if (audio_object.currentTime == audio_object.duration) {
                        resultTimeTemp = audio_object.formatSeconds(audio_object.currentTime);
                        $('.startTime').html(resultTimeTemp);
                        that.removeClass('suspend').addClass('replay');
                        clearInterval(audio_object.clearInterval);
                        return;
                    }
                    audio_object.currentTime = audio_object.currentTime + 1;
                    var percent = (audio_object.currentTime / audio_object.duration) * 100;
                    $('.schedule-active').css("width", percent + "%");
                    $('.progress-button').css("left", percent + "%");
                    resultTimeTemp = audio_object.formatSeconds(audio_object.currentTime);
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
        var resultTimeTemp;
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
                resultTimeTemp = audio_object.formatSeconds(audio_object.currentTime);
                $('.startTime').html(resultTimeTemp);
                $('.audio-action').removeClass('play').removeClass('suspend').addClass('replay');
            } else {
                var percent = ((moveX - f.minLength) * 100) / (f.maxLength - f.minLength);
                f.currentX = moveX;
                audio_object.currentTime = Math.ceil(percent / 100 * audio_object.duration);
                percent = (audio_object.currentTime / audio_object.duration) * 100;
                f.cur_bar.css("width", percent + "%");
                f.btn.css("left", percent + "%");
                resultTimeTemp = audio_object.formatSeconds(audio_object.currentTime);
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