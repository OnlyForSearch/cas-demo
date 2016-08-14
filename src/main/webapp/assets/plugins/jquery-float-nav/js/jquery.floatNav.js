/**
 * author: chenzw date : 2016-1-10
 */
;
(function($) {
	$.fn.floatNav = function(options) {
		var deafults = {
			// eg: {text:'����', location: 'bottom',class:'my-class',
			// events:{click:function(){}, mouseover: function(){}}}
			items : [], // items����������3������:{text:'�ı�',location:'λ��',class:'�Զ�����ʽ',events:'�¼�'},λ�ð���:['top','top-right','right','bottom-right','bottom','bottom-left','left','top-left']
			middle : {
				text : '����'
			},
			zIndex : 999,
			isStatic : false,
			position : {}, // ����λ��{bottom:'��Եײ�ƫ��',top:'��Զ���ƫ��',left:'������ƫ����',right:'����ұ�ƫ����'}
			showDuration : 300,
			isCanDrag : true,// �Ƿ����ק
			dragCallback : '' // �����ק����{
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
				// ��갴��ʱ������x1,y1
				startX = e.clientX, startY = e.clientY,
				// ��갴��ʱ������ƫ����
				dragLeft = this.offsetLeft, dragTop = this.offsetTop;

				$(document).mousemove(function(e) {
					var e = e || window.event, t = e.target || e.srcElement,
					// ����ƶ�ʱ�Ķ�̬����
					x2 = e.clientX, y2 = e.clientY,
					// ����ƶ�ʱ������ı仯��
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
