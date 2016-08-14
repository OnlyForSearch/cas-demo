/**
 * author:chenzw
 */
;(function($) {

	$.fn.myplaceholder = function(options) {
		var defaults = {
			type: 'normal',
			style: {
				color: '#c0c0c0'
			}
		}

		return this.each(function() {
			var opts = $.extend(true, {}, defaults, options);
			new $.myplaceholder(this, opts).init();
		});
	};

	$.myplaceholder = function(self, opts) {
		this.isPlaceHolderSupport = function() {
			return 'placeholder' in document.createElement("input");
		};
		this.init = function() {
			if (!this.isPlaceHolderSupport()) {
				if (opts.type == 'normal') {
					var _oldStyle = {},
						_newStyle = opts.style;
					$.each(_newStyle, function(p, item) {
						_oldStyle[p] = $(self).css(p);
					});
					$(self).css(_newStyle);

					$(self).val($(self).attr('placeholder'));
					$(self).bind('focusin', function() {
						if ($(self).attr('placeholder') == $(self).val()) {
							$(self).css(_oldStyle);
							$(self).val('');
						}
					});

					$(self).bind('focusout', function() {
						if ($(self).val() == '') {
							$(self).css(_newStyle);
							$(self).val($(self).attr('placeholder'));
						}
					});
				} else if (opts.type == 'model2') {
					var _left = parseInt($(self).css('margin-left')) + parseInt($(self).css('padding-left')) + parseInt($(self).css('border-left-width'));
					var _top = parseInt($(self).css('margin-top')) + parseInt($(self).css('padding-top')) + parseInt($(self).css('border-top-width'));

					$(self).wrap('<span style="position:relative; display:inline-block;border:0;margin:0; "></span>');
					var $label = $('<label style="position:absolute; top:0; left:0; z-index: 1;  color:#ccc; overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">' + $(self).attr('placeholder') + '</label>');
					$label.css({
						left: _left + 'px',
						top: _top + 'px',
						width: $(self).width() + 'px',
						height: $(self).height() + 'px',
						lineHeight: $(self).height() + 'px'
					}).css(opts.style);
					$label.insertAfter($(self));


					$label.bind('click', function() {
						$(self).focus();
						$label.hide();
					});
					
					$(self).bind('focusin', function() {
						$label.hide();
					});

					$(self).bind('focusout', function() {
						if ($(self).val() == '') {
							$label.show();
						}
					});
				}
			}
		}
	}
})(jQuery);