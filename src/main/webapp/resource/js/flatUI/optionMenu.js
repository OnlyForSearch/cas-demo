(function($){
	"use strict";
	
	var PLUG_NAME = "OPTION_MENU_CTRL"; //带默认操作项的菜单控件

	function OptionMenu(element,opts){
		this._self = element;
		this.init(element,opts);
	}
	
	$.fn.optionMenu = function ( option ) {
		return this.each(function () {
			var $this = $(this)
		        , data = $this.data(PLUG_NAME)
		        , options = typeof option == 'object' && option;
		      if (!data) $this.data(PLUG_NAME, (data = new OptionMenu(this, options)));
		      if (typeof option == 'string') data[option]();
		});
	};
		  
	OptionMenu.prototype = {
		constructor: OptionMenu,
		init : function(element, options){
			this.$element = $(element);
			this.options = this.getOptions(options);
			if(this.options.menuType=='rightMenu'){
				this.initMenu();
			}else{
				this.initToolbar();
			}
		},
		show : function(){
			var pos = this.getPosition();
			
			var tp;
			this.$subMenu.css("display","block");//先显示才能取宽度
			var actualWidth = this.$subMenu[0].offsetWidth;
			if(this.options.placement=='left'){
				tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth};
			}else{
				tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2};
			}
			this.$subMenu.offset(tp);
		},
		hide : function(){
			this.$subMenu.css("display","none");
		},
		enter : function(){
			this.hoverState = 'in';
			this.show();
		},
		leave : function(){
			var self = this,hideDelay= 150;
			if (self.timeout) clearTimeout(self.timeout);
			this.hoverState = 'out';
			this.timeout = setTimeout(function() {
		        if (self.hoverState == 'out') 
		        	self.hide();
		      }, hideDelay);
		},
		getOptions: function (options) {
			options = $.extend({}, $.fn.optionMenu.defaults, options, this.$element.data());
		    return options;
		 },
		 getPosition: function () {
			 return $.extend({}, (this.$moreMenu.offset()), {
		    	  width: this.$moreMenu[0].offsetWidth
		        , height: this.$moreMenu[0].offsetHeight
		      });
		 },
		 initToolbar:function(){
			 var items = this.options.items;
			 var $toolbar = $(this.options.toolbarTpl);
			 this.$element.append($toolbar);
			 for(var i=0;i<items.length;i++){
				 var fn = this.getEventFn(items[i].event);
				 
				 var mainItem = templateUtil.getStr(this.options.mainItemTpl,{btnName:items[i].itemLabel});
				 var $mainItem = $(mainItem);
				 $mainItem.removeClass("btn-link");
				 $mainItem.removeClass("btn-default");
				 $toolbar.append($mainItem);
				 $mainItem.click(fn);
				 
				 if(this.getDisabled(items[i].disabled)){
					 $mainItem.attr("disabled","disabled");
				 }
			 }
		 },
		 initMenu:function(){
				var items = this.options.items;
//				this.$element.addClass("opt-menu");
				this.$subMenu = $(this.options.subMenuTpl);
				for(var i=0;i<items.length;i++){
					var fn = this.getEventFn(items[i].event);
					
					if(this.getItemType(items[i].itemType)=="main"){
						var mainItem = templateUtil.getStr(this.options.mainItemTpl,{btnName:items[i].itemLabel});
						var $mainItem = $(mainItem);
						this.$element.append($mainItem);
						$mainItem.click(fn);
						if(this.getDisabled(items[i].disabled)){
							$mainItem.attr("disabled","disabled");
						}
					}
					var subItem = templateUtil.getStr(this.options.subItemTpl,{btnName:items[i].itemLabel});
					var $subItem = $(subItem);
					this.$subMenu.append($subItem);
					$subItem.hover(function(){
						//over
						$(this).removeClass('btn-link');
						$(this).addClass('btn-primary');
					},function(){
						//out
						$(this).removeClass('btn-primary');
						$(this).addClass('btn-link');
					});
					$subItem.click(fn);
					if(this.getDisabled(items[i].disabled)){
						$subItem.attr("disabled","disabled");
					}
				}
				this.$moreMenu = $(this.options.moreItemTpl);
				this.$element.append(this.$moreMenu);
				this.$element.append(this.$subMenu);
				this.$moreMenu.bind("mouseenter",$.proxy(this.enter, this));
				this.$moreMenu.bind("mouseleave",$.proxy(this.leave, this));
				
				this.$subMenu.bind("mouseenter",$.proxy(this.enter, this));
				this.$subMenu.bind("mouseleave",$.proxy(this.leave, this));
				
//		        $(document).on('click.optionmenu.data-api', function () {});
		 },
		 getEventFn : function(event) {
			var fn;
			if (typeof event === 'function') {
				fn = event;
			} else {
				fn = eval('(' + event + ')');
			}
			return fn;
		},
		getItemType : function(itemType){
			if(typeof itemType === 'string'){
				if(itemType=='main' || itemType=='sub'){
					return itemType;
				}else{
					return eval('(' + itemType + ')')();
				}
			}else if(typeof itemType === 'function'){
				return itemType();
			}else{
				throw new Error('OptionMenu:get itemType error，itemType='+itemType);
			}
		},
		getDisabled : function(disabled){
			if(typeof disabled === 'string'){
				if(disabled=='true' || disabled=='false'){
					return eval('(' + disabled + ')');
				}else{
					return eval('(' + disabled + ')')();
				}
			}else if(typeof disabled === 'boolean'){
				return disabled;
			}else if(typeof disabled === 'function'){
				return disabled();
			}else{
				throw new Error('OptionMenu:get disabled error，disabled='+disabled);
			}
		}
	};			    
		  
	$.fn.optionMenu.Constructor = OptionMenu;
	
	$.fn.optionMenu.defaults = {
		animation: true,
		menuId : 1,
		placement: 'left', //可选left,right
		menuType:'rightMenu', //可选 barMenu,rightMenu
		toolbarTpl : '<div class="btn-group"></div>',
		mainItemTpl : '<button class="btn btn-link btn-xs btn-small">{btnName}</button>',
		moreItemTpl : '<button class="btn btn-white btn-xs btn-mini">…</button>',
		subMenuTpl : '<div class="menu-list"></div>',
		subItemTpl : '<button class="btn btn-link btn-xs btn-small">{btnName}</button>',
		template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
		items : [{
			itemId : 1,
			itemName : 'add',
			itemLabel : '新增',
			event : "function(){alert('add')}",
			disabled:true,
			itemType:'main'
		},{
			itemId : 2,
			itemName : 'edit',
			itemLabel : '修改',
			event : function(){alert("edit")},
			disabled:"false",
			itemType:'sub'
		},{
			itemId : 3,
			itemName : 'del',
			itemLabel : '删除',
			event : function(){alert("del")},
			disabled:"function(){return false}",
			itemType:'sub'
		},{
			itemId : 3,
			itemName : 'en',
			itemLabel : '启用',
			event : function(){alert("edit")},
			disabled:"false",
			itemType:'sub'
		},{
			itemId : 5,
			itemName : 'di',
			itemLabel : '禁用',
			event : function(){alert("del")},
			disabled:"function(){return false}",
			itemType:'sub'
		}]
		//,delay: 0
		//itemId,itemName,itemLabel,event,disabled
	};
})(jQuery);

