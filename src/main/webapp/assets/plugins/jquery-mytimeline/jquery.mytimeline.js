(function($){
	$.fn.mytimeline = function(options){
		var defaults = {
			data:[],
			dateAlias:'date',
			titleAlias:'title',
			contentAlias:'content',
			tagAlias:'tag',
			gradeAlias:'grade',
			title : '',
			height: '100',
			groupDateFomat:function(date){return new Date(date).toLocaleDateString();},
			itemDateFormat:function(date){return date;},
			fadeCallBack:function(){}
		}
		
		
		return this.each(function(){
			var opts = $.extend(true,{}, defaults, options);
			new $.mytimeline(this,opts).init();
		});
				
	}
		
		
	$.mytimeline = function(self,opts){
		this.formatGroup = function(){ //…˙≥…≈≈–Ú
			var groupsObj = _.groupBy(opts.data,function(obj){
				return opts.groupDateFomat(obj[opts.dateAlias]);
			});
			
			var keysArr = _.sortBy(_.keys(groupsObj),function(value){ return -value;});
			
			return {
				groups: groupsObj,
				keys  : keysArr
			}
		};
		this.getGroupsHtml = function(isNeedHead){
			var groupInfo = this.formatGroup();
			var groupsHtml = [];
 			$(groupInfo.keys).each(function(index,groupDate){
 				groupsHtml.push('<div class="my-timeline-group">');
    			 	groupsHtml.push('<ul>');
    			 	if(isNeedHead && index == 0){
    			 		groupsHtml.push('<h2 class="date"><a href="javascript:void(0);">'+ groupDate +'</a>'+ opts.title +'</h2>');
    			 	}else{
    			 		groupsHtml.push('<h2 class="date date02"><a href="javascript:void(0);">'+ groupDate +'</a></h2>');
    			 	}
    			 
    			var items = _.sortBy(groupInfo.groups[groupDate],function(obj){
    			   	return -new Date(obj[opts.dateAlias]);
    			});  	
			    $(items).each(function(index,item){
			   	    groupsHtml.push('<li date="'+ item[opts.dateAlias] +'" class="my-timeline-item '+ (item.color ? item.color : '') +'">');
		      			groupsHtml.push('<h3 class="date">'+ opts.itemDateFormat(item[opts.dateAlias])+'<span>'+ (item[opts.tagAlias] ? item[opts.tagAlias] : '' ) +'</span></h3>');
		      			groupsHtml.push('<dl>');
		      			    groupsHtml.push('<dt class="my-timeline-ct" style="width:'+ ($(self).width() - 310)+'px"><span class="label '+ (item.color ? 'label-'+ item.color : '') +'">'+ (item[opts.gradeAlias] ? item[opts.gradeAlias] : '') +'</span>'+ item[opts.titleAlias] +'<span class="ct">'+ item[opts.contentAlias]+'</span></dt>');
		      			groupsHtml.push('</dl>');
		      		groupsHtml.push('</li>');	
			    });
			  		groupsHtml.push('</ul>');
			    groupsHtml.push('</div>');
 			});
 			return groupsHtml;
		};
		this.append = function(){
			var _self = $(this.getGroupsHtml().join('')).appendTo($(self));
			this.initEvents(_self);
		};
		this.init = function(){
			var timelineHtml = [];
			timelineHtml.push('<div class="my-timeline-wrap">');
			timelineHtml = timelineHtml.concat(this.getGroupsHtml(true));
			timelineHtml.push('</div>');   
			$(self).html(timelineHtml.join(''));
			
			this.initEvents(self);
			
			var $wrap = $(self).children('.my-timeline-wrap'),
				$group = $(self).find('.my-timeline-group'),
			    wrapHeight = $wrap.height();
			    
	        $wrap.css({'height':59}).animate({'height': wrapHeight}, 2000 ,function(){
	        	$(this).css({'height':'auto'});
	        });

			$(self).bind('append.timeline',function(e,args){
				opts.data = args.data;
				new $.mytimeline($wrap,opts).append();
			});
		};
		this.initDotDotDot = function(_self){
			$(_self).find('.my-timeline-ct').bind(
				'click',
				function() {
					var _target = window.event.target || window.event.srcElement; 
					if(_target.nodeName != "IMG") {
						$(this).toggleClass('opened');
						if ($(this).hasClass('opened')) {
							$(this).trigger('destroy');
						} else {
							$(this).dotdotdot({
								height: parseInt(opts.height)
							});
						}
						opts.fadeCallBack.call(this, this);
					}
					//return false;
				}
			).dotdotdot({height: parseInt(opts.height)});
		};
		this.initEvents = function(_self){
			var $date = $(_self).find("h2.date a");
			$date.bind('click',function(){
				$(this).parent().siblings().slideToggle();
			});
			this.initDotDotDot(_self);
		};
		
	}

})(jQuery);