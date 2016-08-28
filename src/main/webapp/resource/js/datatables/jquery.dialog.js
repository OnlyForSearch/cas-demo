(function($){
	$.fn.dialog=function(options){
		var defaults={titlebg:"#D0EBFC"};
		var options = $.extend(defaults, options); 
		var thisDialog=$(this);
		var title=$(this).attr("title")
		if(!$(this).is(":visible")){
			$(this).show();
			$(this).addClass("dialog");
		}else{
			return false;
		}
		middle($(this));
		//drag($(this));
		var toolbar=$("<div class=\"dialog-title\"><div style=\"float:left;font-weight:bold;margin:5px;\">"+title+"</div><div class=\"tool-close\"></div></div>");
		toolbar.css({"background-color":options.titlebg});
		$(this).prepend(toolbar);
		$(this).find('.tool-close').click(function(){
			$(this).closest(".dialog-title").remove();
			thisDialog.hide();
		});
		
		var footbar=$("<div class=\"dialog-bottom\"></div>");
		$(this).append(footbar);
		$.each(options.buttons, function(index,obj){ 
			var button=$("<input type='button' value="+obj.text+" class='dialog-btn'/>");
			button.click(function(){
				obj.handler();
			})
			footbar.append(button);
		});
	};
	
	$.fn.dialog.close=function(obj){
		obj.hide();
		obj.find(".dialog-title").remove();
	}
	//´¹Ö±¾ÓÖÐ
	function middle(obj){
		var winW=$(window).width();
//        var winW=document.body.clientWidth;
		var winH=$(window).height();
//        var winH=document.body.clientHeight;
//		var sclL=$(window).scrollLeft();
        var sclL=document.body.scrollLeft;
//      var sclT=$(window).scrollTop();
        var sclT=document.body.scrollTop;
		var layerW=obj.width();
		var layerH=obj.height();
		var left=sclL+(winW-layerW)/2;
		var top=sclT+(winH-layerH)/2;
		obj.css({"left":left,"top":top});
	}
	//¿ÉÍÏ×§
	var offsetX=0;
	var offsetY=0;
	var flag=false;
	function drag(obj){
		obj.mousedown(function(evt){
		    flag=true;
		    offsetX=evt.pageX-parseInt(obj.css('left'),10);
		    offsetY=evt.pageY-parseInt(obj.css('top'),10); 
		});
		obj.mousemove(function(evte){
		     if(!flag) return false;   
		     obj.css('top',evte.pageY-offsetY);
		     obj.css('left',evte.pageX-offsetX);     
		 });
		obj.mouseup(function(){    
		     flag=false; 
		 });
		
	}
})(jQuery);