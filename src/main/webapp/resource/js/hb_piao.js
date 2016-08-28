(function($) {
    $.fn.floatAd = function(options) {
        var defaults = {
            imgSrc:"",
            url:"",
            openStyle: 1,
            speed: 30
        };
        var options = $.extend(defaults, options);
        var _target = options.openStyle == 1 ? "target='_blank'": '';
        var html = "<div id='float_ad' style='position:absolute;left:0px;top:0px;z-index:1000000;cleat:both;'>";
        html += "  <a href='" + options.url + "' " + _target + "><img src='" + options.imgSrc + "' border='0' class='float_ad_img'/></a>";
        html += "<div id='close_f_ad' style='position:absolute;width:30px;height:16px;top:-18px;right:0px;cursor:pointer;float:right;font-size:14px'>关闭</div></div>";
        $('body').append(html);
        function init() {
            var x = 0,
            y = 0;
            var xin = true,
            yin = true;
            var step = 1;
            var delay = 10;
            var obj = $("#float_ad");
            obj.find('img.float_ad_img').load(function() {
                var float = function() {
                    var L = T = 0;
                    var OW = obj.width();
                    var OH = obj.height();
                    var DW = $(document).width() ;
                    var DH = $(window).height() + $(document).scrollTop();//获取滚动条到顶部的高度;
                    x = x + step * (xin ? 1 : -1);
                    if (x < L) {
                        xin = true;
                        x = L;
                    }
                    if (x > DW - OW - 1) {
                        xin = false;
                        x = DW - OW - 1;
                    }
                    y = y + step * (yin ? 1 : -1);
                    if (y > DH - OH - 10) {
                        yin = false;
                        y = DH - OH - 10;
                    }
                    if (y < T) {
                        yin = true;
                        y = T;
                    }
                    if(y<$(document).scrollTop()){
                       yin = true;
                       y=$(document).scrollTop();
                    }
                    var left = x;
                    var top = y;
                    obj.css({
                        'top': top,
                        'left': left
                    })
                };
                var itl = setInterval(float, options.speed);
                $('#float_ad').mouseover(function() {
                    clearInterval(itl)
                });
                $('#float_ad').mouseout(function() {
                    itl = setInterval(float, options.speed)
                })
            })
        }
        init();
		$('#close_f_ad').click(function(){
                    $('#float_ad').css('display','none');
                });
    }
})(jQuery);

$(document).ready(function() {
    $(function() {
        $("body").floatAd({
            imgSrc: 'images/piao.png',
            url: '/workshop/form/hbFormFile/laborCompetitionIndex.html'
        });
    })
});