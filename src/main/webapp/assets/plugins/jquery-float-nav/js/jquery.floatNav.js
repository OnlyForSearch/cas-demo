/**
 * author: chenzw date : 2016-1-10
 */
;
(function($) {
	$.fn.floatNav = function(options) {
		var deafults = {
			// eg: {text:'测试', location: 'bottom',class:'my-class',
			// events:{click:function(){}, mouseover: function(){}}}
			items : [], // items数组对象包含3个属性:{text:'文本',location:'位置',class:'自定义样式',events:'事件'},位置包括:['top','top-right','right','bottom-right','bottom','bottom-left','left','top-left']
			middle : {
				text : '导航'
			},
			zIndex : 999,
			isStatic : false,
			position : {}, // 浮动位置{bottom:'相对底部偏移',top:'相对顶部偏移',left:'相对左边偏移量',right:'相对右边偏移量'}
			showDuration : 300,
			isCanDrag : true,// 是否可拖拽
			dragCallback : '' // 完成拖拽後回調
		}
		return this.each(function() {
			var opts = $.extend(true, {}, deafults, options);
			new $.floatNav(this, opts).init();
		});
	};

	$.floatNav = function(self, opts) {
		this.init = function() {
			$(self).addClass('float-nav').css(opts.position || {}).css(
					'z-index', opts.zIndex);
			if (!opts.isStatic) {
				var navHtml = [];
				navHtml.push('<span class="tt '
						+ ($(opts.middle).attr('text') ? $(opts.middle).attr(
								'text') : '') + '" >' + opts.middle.text
						+ '</span>');
				navHtml.push('<div class="box">');

				$(opts.items).each(
						function(index, item) {
							navHtml.push('<a class="'
									+ item.location
									+ ' '
									+ ($(item).attr('class') ? $(item).attr(
											'class') : '') + '">');
							navHtml.push('<span class="t-tt">' + item.text
									+ '</span>');
							navHtml.push('</a>');
						});
				navHtml.push('</div>');
				$(self).html(navHtml.join(''));

				var $box = $(self).children('.box');
				$(opts.items).each(function(index, item) {
					if(item.events){
						if(typeof(item.events) == "string"){
							item.events = eval('('+ item.events +')');
						}
						$box.find('.' + item.location).bind(item.events);
					} 
				});
			}

			if (opts.isCanDrag) {
				this.initDrag(opts);
			}

			this.initHover();

			$(self).hide().show(opts.showDuration);

		};

		this.initDrag = function(opts) {

			$(self).mousedown(function(e) {
				var e = e || window.event, t = e.target || e.srcElement,
				// 鼠标按下时的坐标x1,y1
				startX = e.clientX, startY = e.clientY,
				// 鼠标按下时的左右偏移量
				dragLeft = this.offsetLeft, dragTop = this.offsetTop;

				$(document).mousemove(function(e) {
					var e = e || window.event, t = e.target || e.srcElement,
					// 鼠标移动时的动态坐标
					x2 = e.clientX, y2 = e.clientY,
					// 鼠标移动时的坐标的变化量
					x = x2 - startX, y = y2 - startY;

					$(self).css({
						'left' : (dragLeft + x) + 'px',
						'top' : (dragTop + y) + 'px'
					});
				});

				$(document).mouseup(function(e) {
					$(document).unbind('mousemove');
					$(document).unbind('mouseup');
					if (opts.dragCallback) {
						opts.dragCallback(self, e);
					}
				});

			});
		};
		this.initHover = function() {
			var $box = $(self).find('.box');
			$(self).hover(function() {
				$box.stop().show(300);
			}, function() {
				$box.stop().hide(150);
			});
		}
	}
})(jQuery);
