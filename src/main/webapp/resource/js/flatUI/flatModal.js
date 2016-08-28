(function($) {
	"use strict";
	
	function FlatModal(element, opts) {
		this.$element = $(element);
		this.opts = $.extend($.fn.flatModal.defaults, opts);
		this.init(this.$element, this.opts);
	}

	FlatModal.prototype = {
		constructor : FlatModal,
		init : function($element) {
			var self = this;
			
			this.$overlay=$("#flat_modal_overlay");
			if (this.$overlay.length == 0) {
				this.$overlay = $("<div id='flat_modal_overlay'></div>");
				$("body").append(this.$overlay);
			}
			
			this.$overlay.click($.proxy(self.closeModal,this));
			if(this.opts.closeButton){
				if(this.opts.closeButton instanceof jQuery)
					$(this.opts.closeButton).click($.proxy(self.closeModal,this));
				else
					$(document).on('click',this.opts.closeButton,$.proxy(self.closeModal,this));
			}
				
			self.showModal();
		},
		showModal:function(){
			var position="fixed";
			var modalHeight = this.$element.outerHeight();
			var modalWidth = this.$element.outerWidth();
			this.$overlay.css({
				"display" : "block",
				opacity : 0
			});
			this.$overlay.fadeTo(200, this.opts.overlay);
			if(this.opts.fixed){
				position = "absolute";
			}
			this.$element.css({
				"display" : "block",
				"position" : position,
				"opacity" : 0,
				"z-index" : 999,
				"left" : 50 + "%",
				"margin-left" : -(modalWidth / 2) + "px",
				"top" : this.opts.top + "px"
			});
			this.$element.fadeTo(200, 1);
		},
		closeModal : function() {
			this.$overlay.fadeOut(200);
			this.$element.hide();
			return false;
		}
	};

	$.fn.flatModal = function(option) {
		var PLUG_NAME = "FLAT_MODAL_CTRL";

		return this.each(function() {
			var $this = $(this), data = $this.data(PLUG_NAME), 
			opts = typeof option == 'object' && option;
			if (!data)
				$this.data(PLUG_NAME, (data = new FlatModal(this, opts)));
			else
				data.showModal();
			if (typeof option == 'string')
				data[option]();

		});
	};
	
	$.fn.flatModal.Constructor = FlatModal;
	
	$.fn.flatModal.defaults = {
			top : 98,
			overlay : 0.5,
			closeButton : null,
			fixed:false
		};
})(jQuery);
