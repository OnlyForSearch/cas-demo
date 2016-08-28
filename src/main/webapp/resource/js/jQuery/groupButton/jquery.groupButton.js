/**
 * 创建组按钮插件
 * e.g.
 *		<input type="hidden" id="xxEl" />
 *		$('#xxEl').groupButton({
 *			data: {
 *				按钮1: 'val1',
 *				按钮2: 'val2'
 *			},
 *			codeType: 'xxx', // 从 codelist 获取数据，可选
 *			value: 'val2'
 *			change: function(val) {
 *				alert('变更后的值: ' + val)
 *			}
 *		});
 *
 */
(function($) {
	if (typeof templateUtil == 'undefined') {
		$.ajaxSetup({async: false});
		$.getScript('/resource/js/strTemplateUtil.js');
		$.ajaxSetup({async: true});
	}

	var CODE_URL = '/servlet/codeListCtrl.do?method=getCodeList';

	function getCodelist(codeType) {
		var result = {};
		$.ajax({
			url: CODE_URL, 
			async: false,
			data: {
				type: codeType
			},
			dataType: 'text',
			success: function(data) {
				var xml = new ActiveXObject("Microsoft.XMLDOM");
				xml.async = false;
				xml.loadXML(data);

				var rows = xml.selectNodes('/root/rowSet');
				for (var i = 0; i < rows.length; i++) {
					result[rows[i].selectSingleNode('MEAN').text]  = rows[i].selectSingleNode('CODE').text;
				}
			}
		});

		return result;
	}

	$.fn.groupButton = function(opt) {
		var defaults = {
			data: null,
			change: function() {},
			value: null
		};

		var options = $.extend(defaults, opt);

		if (options.codeType)
			options.data = $.extend(options.data, getCodelist(options.codeType));

		if (options.data == null)
			return this;

		var CHECKED_CLS = 'a_button_checked';
		var BUTTON_GROUP = '<div class="button_group"></div>';
		var ITEM_TPL = '<a class="a_button {cls}" value="{value}">{label}</a>';

		var $el = $(this);

		var items = [], 
			cls, 
			defaultValue = null;
		for (var name in defaults.data) {
			cls = '';
			if (options.value != null && defaults.data[name] == options.value) {
				defaultValue = options.value;
				cls = CHECKED_CLS;
			}

			items.push({
				label: name,
				value: defaults.data[name],
				cls: cls
			});
		}

		if (defaultValue == null) {
			items[0].cls = CHECKED_CLS;
			defaultValue = items[0].value;
		}

		var itemHtml = templateUtil.getStr(ITEM_TPL, items);
		var group = $(BUTTON_GROUP).insertAfter($el).html(itemHtml);

		// 添加事件
		group.find('a').click(function() {
			var item = $(this);
			if (item.hasClass(CHECKED_CLS))
				return;

			item.addClass(CHECKED_CLS).siblings().removeClass(CHECKED_CLS);
			var oldVal = $el.val();
			var newVal = item.attr('value');
			$el.val(newVal);

			if ($.isFunction(defaults.change)) {
				defaults.change(newVal, oldVal);
			}
		});
		
		$el.val(defaultValue);

		return this;
	};
})(jQuery);
