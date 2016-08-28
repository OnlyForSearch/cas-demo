/**
 *  简单 div 弹出层实现
 *    e.g.
 *      var sb = $('#divId').simpleBlock();
 *      显示：sb.show()
 *      隐藏: sb.hide()
 */
(function ($) {
	var zIndex = 300;
    $.fn.simpleBlock = function (option) {
		var settings = $.extend({
            width: null,
            height: null
        }, option);
    
		// 创建遮罩层
		var zzDiv = $('<div class="simpleblock-mask"></div>').appendTo($('body')).css({
			'z-index': settings.zIndex || zIndex++
		});

        var $target = this.eq(0);
        var title = $target.attr('title');
        $target.removeAttr('title');
        
        if (settings.width) {
            $target.width(settings.width);
        }
        
        if (settings.height) {
            $target.height(settings.height);
        }

        if (title) {
            // 添加窗口标题
            var header = '<div class="simpleblock-header">' +
                '<div class="title">' + title + '</div>' +
                '<div class="close"></div>' +
                '</div>';

            $(header).prependTo($target).find('.close').click(function () {
                hide();
            });
        }
        
        $target.show();
        var divWidth = $target.width();
        var divHeight = $target.height();
		$target.hide().css('z-index', settings.zIndex != null ?  settings.zIndex + 1 : zIndex++);
        
        // 显示遮罩层
        function show() {
            var winWidth = $(document).width();
            var winHeight = $(document).height();

            zzDiv.css({
                width: winWidth,
                height: winHeight
            }).fadeIn(200);

			var top = $(window).scrollTop() + ($(window).height() - divHeight)/2;
                       
            $target.css({
                position: 'absolute'
            }).animate({
                left: (winWidth - divWidth)/2,
                top: top,
                opacity: 'show'
            }, "fast");
        }

        function hide() {
            $target.hide();
            zzDiv.hide();
        }

        return {
            show: function () {
                show();
            },
            hide: function () {
                hide();
            }
        };
    };
})(jQuery);

