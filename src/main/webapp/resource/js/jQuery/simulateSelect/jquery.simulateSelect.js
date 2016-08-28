(function($) {
	if (typeof templateUtil == 'undefined') {
		$.ajaxSetup({async: false});
		$.getScript('/resource/js/strTemplateUtil.js');
		$.ajaxSetup({async: true});
	}
    
	var CLS_OPEN = 'select-data-up';
	var CLS_CLOSE = 'select-data-down';
    var CLS_SELECTED = 'selected';

	$.fn.simulateSelect = function(option) {
		var settings = $.extend({
			change: $.noop,
			data: null,
			getValueCfgId: null,
            emptyOption: {
                NAME: '',
                VALUE: ''
            }
		}, option);
        
        var data = [];
        if (settings.emptyOption) {
            data.push(settings.emptyOption);
        }

        data = data.concat(settings.data || []);
        data = data.concat(getData(settings.getValueCfgId));
        
        var targetDataMenu = createDataMenu(data);
        var $body = $('body');

		this.filter(':text').each(function() {
			var $el = $(this);
			$el.off('click');

            var menuData = targetDataMenu.clone().appendTo($body).width($el.outerWidth() - 2);            
			addMark($el);
                        
            $el.click(function() {
                if (menuData.is(':visible')) {
                    return true;
                }                
                
                $('.select-data:visible').hide();
                
                var offset = $el.offset();
                menuData.css({
                    left: offset.left,
                    top: offset.top + $el.outerHeight()
                }).show();
                
                addDocClickFn(menuData);
                
                return false;
            }).prop('readonly', true);

            menuData.children().click(function() {
                selected($(this), $el);
            });            

			var defaultItem = menuData.find('li[svalue="' + $el.next(':hidden').val() + '"]');
			if (defaultItem.size() === 0) {
				defaultItem = menuData.find('li:first');	
			}
			defaultItem.click();
		});

		function selected($item, $targetEl) {
			if (!$item.hasClass(CLS_SELECTED)) {
				$item.addClass(CLS_SELECTED).siblings('.' + CLS_SELECTED).removeClass(CLS_SELECTED);
			
				$targetEl.val($item.html()).next(':hidden').val($item.attr('svalue'));
				settings.change({
					text: $item.html(),
					val: $item.attr('svalue')
				});
			}
			
			hideMenu($item.parent());
		}
        
        function addDocClickFn($menu) {
			$(document).click(function() {
				$menu.hide();
				//selDom.removeClass(OPEN_CLS).addClass(CLOSE_CLS);
				$(document).off('click');
			});
		}
        
        function hideMenu($menu) {
            $menu.hide();
        }
	};
    
    function createDataMenu(data) {
        var menu = '<ul class="select-data">';
        $.each(data, function(i, d) {
            menu += '<li svalue="' + d.VALUE + '">' + d.NAME + '</li>'
        });
        
        menu += '</ul>';
        
        return $(menu);
    }
    
    function getData(cfgId) {
		return [];
    }

	function addMark($el) {
		if ($el.parent().hasClass(CLS_CLOSE)) {
			return;	
		}

		var w = $el.width() - 20;
		$el.width(w);

		var rightPos = $el.parent().width() - 18;
		$el.parent().addClass(CLS_CLOSE).css({
			'background-position': rightPos + 'px center'
		});
	}
})(jQuery);
