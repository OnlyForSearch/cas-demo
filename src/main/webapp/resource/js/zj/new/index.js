$(document).ready(function() {

	$.ajaxSetup({
		cache : false
	});
	
	userModual.init();
	boardModual.init();
	menuModual.init();
	quickModual.init();
	favoriteModual.init();
	todoModual.init();
	searchModual.init();
	floatNavModual.init();
	userIdentityModual.init();
	accessLogModual.init();

	$('#resbar').fadeOut();

});


var handlerModual = {			
	isEmpty: function(val) {
			if(val && val != 'undefined'){
				return false;
			}
			return true;
	},
	
	importCss: function(_href) {
		$("<link>").attr({ 
			rel: "stylesheet", 
			type: "text/css", 
			href: _href
		}).appendTo("head");
	}
}

var floatNavModual = {
	init : function() {
		$('#floatNav').floatNav({
			position: {left: '420px'},
			items : getJsonFromHtmlData('floatItemNavCache'),
			middle : getJsonFromHtmlData('floatMainNavCache')[0],
			dragCallback : function(self, e) {
				var _left = $(self).position().left,
					_top = $(self).position().top;
				if (_left > document.body.clientWidth - 60
						|| _left < 30 || _top < -30) {
					layer.confirm('导航君太调皮,让它消失会?', {
						btn : [ '隐藏', '取消' ]
					// 按钮
					}, function(index) {
						$(self).hide(800);
						layer.close(index);
						layer.msg('主人,我先离开会!您可以随时点击用户头像Call我哦!', {
							icon : 5,
							shift : 6
						});
					});
				}
			}
		});
		
		//掌上二维码标
		layer.open({
			  type: 1,
			  title: false,
			  closeBtn: 2, //不显示关闭按钮
			  shade: 0,
			  area: ['180px', '220px'],
			  offset: 'rb', //右下角弹出
			  time: 8000, //5秒后自动关闭
			  shift: 2,
			  content:'<center><i class="fa fa-mobile-phone fa-2x"></i>&nbsp;ITSM网管App<img style="width: 130px; height:130px;" src="/resource/image/indexZJ/zjPalmCode.jpg" alt="掌上端二维码" onClick="floatNavModual.showPalmCode2();"></img>&nbsp;&nbsp;<i class="fa fa-quote-left"></i>&nbsp;扫码有惊喜!</center>',
			  end: function() {
				  $('#floatNav').animate({left: $('body').width() - 200 +'px'},3000);
			  }
		});
	},
	
	showPalmCode: function(){
		var layerIndex = layer.tips('<div style="display: table;"><img style="width: 130px; height:130px;" src="/resource/image/indexZJ/zjPalmCode.jpg" alt="掌上端二维码"></img><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-quote-left"></i>&nbsp;扫码有惊喜!</p><span style="text-align:center;vertical-align:middle;display:table-cell; padding:0 10px;">IT掌上运维下载</br>快快使用手机扫描!<br><i class="fa fa-info-circle"></i>&nbsp;由于腾讯安全认证原因，暂不支持微信、QQ二维码扫描下载，参考软件:支付宝，淘宝，UC浏览器，易信<br><i class="fa  fa-key"></i>&nbsp;账号为ITSM账号，如果忘记密码，请联系ITSM支撑人员!</span></div>', this,{tips:1,area:['480px','160px'],time: 60000});
	    $.data(this, 'layerIndex', layerIndex);
	},
	
	hidePalmCode: function(){
		layer.close($.data(this, 'layerIndex'));
	},
	
	showTimeLine: function(){
		var index = layer.open({
		  type: 2,
		  title: '升级记录',
		  content: '/workshop/base/zj/releasetimeline.jsp?flag=ZJ_ITSM',
		  area: ['1060px', '600px'],
		  maxmin: true
		});
		layer.full(index);
	},
	
	showPalmCode2: function() {
		layer.open({
		    type: 1,
		    shade: false,
		    area: ['600px','190px'],
		    title: false, //不显示标题
		    content: '<div style="display: table;"><img style="width: 130px; height:130px;" src="/resource/image/indexZJ/zjPalmCode.jpg" alt="掌上端二维码"></img><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-quote-left"></i>&nbsp;扫码有惊喜!</p><span style="text-align:center;vertical-align:middle;display:table-cell; padding:0 10px;">IT掌上运维下载</br>快快使用手机扫描!<br><i class="fa fa-info-circle"></i>&nbsp;由于腾讯安全认证原因，暂不支持微信、QQ二维码扫描下载，参考软件:支付宝，淘宝，UC浏览器，易信<br><i class="fa  fa-key"></i>&nbsp;账号为ITSM账号，如果忘记密码，请联系ITSM支撑人员!</span></div>'
		});
	},
	
	openOld:function(){ //返回旧版
		layer.msg('亲,回不去了!',{icon:5,shift:6});
	},
	
	showAssisDocument: function() {
		if(!$(this).data("loaded")){
			layer.config({
				extend: 'extend/layer.ext.js'
			}); 
			$import("/assets/plugins/fancybox/source/jquery.fancybox.pack.min.js");
			handlerModual.importCss("/assets/plugins/fancybox/source/jquery.fancybox.min.css");
		
			$(this).data("loaded",true);
		}
		
		ResultUtil.query('ZJ_GET_ASSIS_DOCUMENT', function(dataList){
			var tabDataList = [];
			for(var i = 0; i < dataList.length; i++){
				tabDataList.push({
					title: dataList[i].TAB_TITLE,
				    content: dataList[i].TAB_CONTENT
				});
			};
				
			var tabLayerId = layer.tab({   //tab层
			  area: ['800px', '550px'],
			  maxmin: true,
			  tab: tabDataList
			});
			
			layer.full(tabLayerId);

			var $tabMain = $('.layui-layer-tabmain');
			$tabMain.find('img').wrap(function(){
				return "<a class='fancybox' href='"+ $(this).attr("src") +"'>";
			});
			
			$tabMain.find('a.fancybox').fancybox();

		}).refresh({TAB_TYPE:'ZJ_ITSM_ASSIS'});
	}
	
	
}

//公告栏
var BOARD_LIST_TPL = '<li class="f-toe" title="{BOARD_TITLE}"><marquee scrollAmount=3><a href="/workshop/board/boardInfoContent.jsp?boardInfoId={BOARD_ID}" target="_target"><i class="fa fa-volume-up"></i>&nbsp;[{SUBMIT_DATE}]&nbsp;{BOARD_TITLE}</a></marquee></li>';
var boardModual = {
	init : function() {
		var boardCache = getRowSetObjArray(getXmlFromHtmlData("boardInfoCache"));
		if(boardCache.length > 0){
			// 日期格式转化
			$(boardCache).each(function(index, data) {
				var date = new Date(('20' + data.SUBMIT_DATE).replace(/-/g, "/"));
				data.SUBMIT_DATE = (date.getMonth() + 1) + '-' + date.getDate();
			});
			
			$('.m-notice .u-lst>ul').append(
					templateUtil.getStr(BOARD_LIST_TPL, boardCache));
		}else{
			$('.m-notice .u-lst>ul').append('<em style="font-size:16px;font-style: italic;color:#ccc;"><i class="fa fa-warning"></i>&nbsp;暂无公告信息!</em>');
		}
		
	}
}

//菜单
var MENU_TPL = '<li class="u-lst {isActive}" menuId="{menuId}" onmouseover="menuModual.menuHover(this);" onmouseout="menuModual.menuOut(this);" onmouseenter="menuModual.menuItemHover(this,{options});" onmouseleave="menuModual.menuItemOut(this);" tip="{tip}"><a class="f-ib f-csp f-pr" href="javascript:menuModual.itemClick(\'{serverUrl}\');">{menuName}</a><div class="m-menu-wrap f-clr f-dn" ishiden={ishiden}><a class="u-lp f-csp f-ib" onclick="menuModual.leftClick(this);"><i class="f-larrow u-larrow"></i></a><div class="m-menu-ct"><div style="padding:5px;"><span class="u-f f-csp" onClick="menuModual.toggleFavorite(this);"><i class="fa fa-star f-text-yellow"></i><b>收藏</b></span>&nbsp;&nbsp;<input type="text" onkeydown="menuModual.filter(this);" class="u-ff form-control" placeholder="&#9770;菜单过滤"></input>&nbsp;<span class="f-text-gray"><i class="fa fa-1_3x fa-info-circle"></i>&nbsp;多个检索词间以空格间隔,按回车键开始搜索</span></div><div class="m-menu-inner f-prz" style="width:{allWidth}px">{menuItems}</div><div class="m-menu-panel f-dn" id="menuPanel_{menuId}"></div></div><a class="u-rp f-csp f-ib" onclick="menuModual.rightClick(this);"><i class="f-rarrow u-rarrow"></i></a></div></li>';
var MENU_PANEL_TPL = '<h2 class="u-title f-csp" onclick="menuModual.hidePanel(this);"><img src="{imageUrl}" style="width:32px;height:32px;vertical-align:middle;"></img>{menuName}(all)</h2><a class="u-return f-csp f-text-gray" onclick="menuModual.hidePanel(this);"><i class="fa fa-mail-reply-all"></i>返回</a><p class="u-line"/><div class="m-menu-panel-wrap"><div class="m-menu-panel-ct">{panelCt}</div></div>';
var MENU_PANEL_SECOND_LEVEL_TPL = '<ul style="width:{menuWidth}px;" class="f-toe">{thirdLevel}</ul>';

var MENU_START_TPL = '<i model="{MODEL}" class="u-favorite fa fa-1_5x {CLASS} f-text-yellow f-csp" onmouseenter="favoriteModual.itemMouseIn(this);" onmouseleave="favoriteModual.itemMouseOut(this)" onclick="favoriteModual.itemClick(this);"></i>';
//
var MENU_SECOND_LEVEL_TPL = '<ul style="width:{menuWidth}px;" class="f-toe"><li class="u-md f-csp f-wobble-bottom" style="width:{menuWidth}px;" onmouseenter="menuModual.menuItemHover(this,&#123;tips:1&#125;);" onmouseleave="menuModual.menuItemOut(this);" tip="{tip}"  menuId="{menuId}"><img style="vertical-align:middle;" src="{imageUrl}"></img><a href="javascript:void(0);" onclick="menuModual.showPanel(this,{menuId});">{label}</a></li>{thirdLevel}</ul>';
var MENU_THIRD_LEVEL_TPL = '<li class="u-item {itemClass}" onmouseenter="menuModual.menuItemHover(this);" onmouseleave="menuModual.menuItemOut(this);" tip="{tip}" isFavorite="{isFavorite}" privilegeId="{privilegeId}"><a privilegeId="{privilegeId}" onclick="menuModual.accessClick(this);" href="{serverUrl}" target="_blank">{label}</a>{menuStar}</li>';

//统计
var MENU_PERSONAL_PANEL_TPL = '<li class="u-lst f-fr" onmouseover="menuModual.menuHover(this);" onmouseout="menuModual.menuOut(this);"><a class="f-ib f-csp f-pr"><i class="fa fa-leaf"></i>&nbsp;{menuName}<span class="f-label f-label-warning" style="position:absolute; top:8px; right:-5px; ">新</span></a><div class="m-menu-wrap f-clr f-dn"><div class="m-menu-ct" style="padding: 20px;">{panel}</div></div></li>';
var PERSON_TOP_ITEM_TPL = '<li class="f-toe"><a onclick="menuModual.accessClick(this);" privilegeId="{PRIVILEGE_ID}" flag="ZJ_PERSON_TOP_MENU" href="{URL}" target="_blank">{NO}. &nbsp;{MENU_NAME}</a><span class="f-label f-label-primary f-fr">{CLICK_CNT} click!</span></li>';
var HOT_TOP_ITEM_TPL = '<li class="f-toe"><a onclick="menuModual.accessClick(this);" privilegeId="{PRIVILEGE_ID}" flag="ZJ_HOT_TOP_MENU" href="{URL}" target="_blank">{NO}. &nbsp;{MENU_NAME}</a><span class="f-label f-label-primary f-fr">{CLICK_CNT} click!</span></li>';
var MENU_PERSONAL_TAB_TPL = '<ul class="u-tab"><li class="active"><a data-target="#personTopWrap" href="javascript:void(0);" onclick="menuModual.toggleTab(this);"><i class="fa fa-eye"></i>&nbsp;个人点击次数Top20</a></li><li><a data-target="#hotTopWrap" href="javascript:void(0);" onclick="javascript:menuModual.toggleTab(this);"><i class="fa fa-header"></i> &nbsp;热门点击Top20</a></li></ul><div id="statisticsTabCt"><div id="personTopWrap">{personTopClickHtml}</div><div id="hotTopWrap" class="f-dn">{hotTopClickHtml}</div></div>';

var menuModual = {
	pageSize : 16,
	topPageSize: 10, //top click页条数
	init : function() {
		var $this = this,
			data = [],
			menuCache = getXmlFromHtmlData('menuCache');
		$(menuCache).find('Menu').children('[isHasPrivilege!="0"]').each(
				function(index) {
					var $chilrens = $(this).children('MenuItem');
					var menuObj = {
						isActive : (function() {
							if (index == 0) { // 首页默认选中
								return 'active';
							}
							return '';
						})(),
						allWidth : 0,
						menuId : $(this).attr('id'),
						ishiden : ($chilrens.length <= 0),
						menuName : $(this).attr('label'),
						serverUrl : $(this).attr('serverUrl'),
						tip : $(this).attr('tip'),
						options : '{tips:1}'
					};
					if ($chilrens.length > 0) { // 第二层
						var levelData = $this.initSecondLevel($chilrens);
						menuObj.menuItems = templateUtil.getStr(
								MENU_SECOND_LEVEL_TPL, levelData.items);
						menuObj.allWidth = levelData.allWidth;		
					}

					if (levelData && levelData.items.length > 0) {
						menuObj.ishiden == false;
					} else {
						menuObj.ishiden == true;
					}
					data.push(menuObj);
				});
		
		        
				$('.m-menu .u-ct>ul').html(
					templateUtil.getStr(MENU_TPL, data)
							+ templateUtil.getStr(MENU_PERSONAL_PANEL_TPL, {
								menuName : '统计',
								panel : templateUtil.getStr(MENU_PERSONAL_TAB_TPL,
										{
											personTopClickHtml : this
													.getPersonTopClickHtml(),
											hotTopClickHtml : this
													.getHotTopClickHtml()
										})
							}));
				
				$('input.u-ff').myplaceholder({
					type : 'model2'
				});
		this.initMenuWidth();
	},
	getPersonTopClickHtml:function(){
		var $this = this,
		    personTopHtml = '', 
		    personTopArr = [],
		    $personTopSets = $(getXmlFromHtmlData("personTopClickCache")).find('rowSet'),
		    personTopLen = $personTopSets.length;
		
		$personTopSets.each(function(index,item){
			personTopArr.push({
				NO		  : index + 1,
				PRIVILEGE_ID: $(item).children('PRIVILEGE_ID').text(),
				URL		  : $(item).children('SERVER_URL_NAME').text(),
				MENU_NAME : $(item).children('MENU_NAME').text(),
				CLICK_CNT : $(item).children('CLICK_CNT').text()
			});
			if((index != 0 && index % $this.topPageSize == 0) || index == personTopLen - 1){
				personTopHtml += '<ul class="u-tab-ct">'+templateUtil.getStr(PERSON_TOP_ITEM_TPL,personTopArr)+'</ul>';
				personTopArr = [];
			}
		});
		return personTopHtml;
	},
	getHotTopClickHtml:function(){
		var $this = this,
			hotTopHtml = '',
		    hotTopArr = [],
		    $hotTopSets = $(getXmlFromHtmlData("hotTopClickCache")).find('rowSet'),
		    hotTopLen = $hotTopSets.length;
		
		$hotTopSets.each(function(index,item){
			hotTopArr.push({
				NO		  : index + 1,
				PRIVILEGE_ID: $(item).children('PRIVILEGE_ID').text(),
				URL		  : $(item).children('SERVER_URL_NAME').text(),
				MENU_NAME : $(item).children('MENU_NAME').text(),
				CLICK_CNT : $(item).children('CLICK_CNT').text()
			});
			if((index != 0 && index % $this.topPageSize == 0) || index == hotTopLen - 1){
				hotTopHtml += '<ul class="u-tab-ct">'+templateUtil.getStr(HOT_TOP_ITEM_TPL,hotTopArr)+'</ul>';
				hotTopArr = [];
			}
		});
		return hotTopHtml;
		
	},
	toggleTab:function(self){
		$(self).parents('li').addClass('active').siblings().removeClass('active');
		$('#statisticsTabCt').children().hide();
		$($(self).attr('data-target')).show(300);
	},
	initDataById:function(id,filters){
		var menuCache = getXmlFromHtmlData('menuCache'),
			$children = $(menuCache).find('Menu').children('MenuItem[id='+id+']').children('MenuItem');
		if(filters && filters.length > 0){ //有过滤值时进行过滤
			$children.each(function(){
				  // 第三层					 
				 $(this).children('MenuItem')
				  .each(function(index,item) {
					  for(var i = 0 ;i < filters.length; i++){
						  if($(this).attr('label').indexOf(filters[i]) < 0){ 
							 $(this).attr('isHasPrivilege','0');
							 break;
						  }
					  } 
				  });				
			 });
		}
		return $children;
	},
	initSecondLevel:function($childrens){
		var $this = this;
		var returnObj = {
				items : [],
			 allWidth : 0
		};
		$childrens.each(function() {
			var $thirdChildrens = $(this).children('MenuItem[isHasPrivilege!="0"]');
			if ($thirdChildrens.length > 0) { //第三层有数据,第2层才显示
				var menuWidth = $(this).attr('width') ? $(this).attr('width') : 200;
				returnObj["allWidth"] += parseInt(menuWidth);
				var thirdLevelData = [];
				  // 第三层
				$thirdChildrens
					.each(function(index,
							item) {
							if (index < $this.pageSize) {
								thirdLevelData.push({
									tip			: $(this).attr('tip'),
									isFavorite	: $(this).attr('isFavorite'),
									privilegeId	: $(this).attr('privilegeId'),								
									serverUrl   : $(this).attr('serverUrl'),
										label   : $(this).attr('label')
								});						
							}									
					});
			

					returnObj["items"]
						.push({
							menuWidth : menuWidth,
							tip : $(this).attr('tip'),
							menuId : $(this).attr('id'),
							imageUrl : $(this).attr('imageUrl'),
							label : $(this).attr('label')
									+ ($thirdChildrens.length > $this.pageSize ? '&nbsp;<i class="fa fa-plus-circle f-text-yellow"></i><i class="fa f-text-yellow"></i>'
											: ''),
							thirdLevel : templateUtil.getStr(
									MENU_THIRD_LEVEL_TPL,
									thirdLevelData)
						});
			}
		});	
		return returnObj;
	},
	initMenuWidth:function(){
		$('.m-menu-wrap').width($('body').width() - 87);
		$('.m-menu-ct').width($('body').width() - 137);
		$('.m-menu-panel').width($('body').width() -110);
	},
	menuItemHover:function(self, options){	//tip提示
		if(!handlerModual.isEmpty($(self).attr('tip'))){
			options = options||{};
			var menuTipIndex = layer.tips($(self).attr('tip'), self, options);
			$(self).data('menuTipIndex', menuTipIndex);
		}
	},
	menuItemOut:function(self){
		layer.close($(self).data('menuTipIndex'));
	},
	menuHover : function(self) {
		if ($(self).hasClass('active')) {
			$(self).parent().clearQueue('hidect');
		} else {
			$(self).siblings().removeClass('active');
			$(self).addClass('active');

			//二级没有子项的不显示面板
			var $wrap = $(self).children('.m-menu-wrap');
			if ($wrap.attr('ishiden') != 'true') {
				$wrap.slideDown(200);
				if($wrap.attr('ishiden') != undefined){
					this.initTriangle($wrap);
				}				
			}
		}
		$(self).parent().clearQueue('reset');
	},
	menuOut : function(self) {
		if($(self).attr('menuId') != '1'){ //主页
			$(self).parent().delay(500,'reset').queue('reset',function(){				
				$(self).siblings().eq(0).addClass('active');
			});
			$(self).parent().delay(100,'hidect').queue('hidect',function(){
				$(self).removeClass('active').children('.m-menu-wrap').hide();	
			});
			$(self).parent().dequeue('reset').dequeue('hidect');
	    }
	},
	initTriangle:function($wrap,$inner){ //左右三角按鈕
		if(!$inner){
			$inner = $wrap.find('.m-menu-inner');
		}
		if ($inner.position().left < 0) {
			$wrap.find('.u-larrow').show();
		}else{
			$wrap.find('.u-larrow').hide();
		}
		if ($inner.width() + $inner.position().left > $wrap.width()) {
			$wrap.find('.u-rarrow').show();
		}else{
			$wrap.find('.u-rarrow').hide();
		}
	},
	leftClick : function(self) {
		var $this = this;
		var $wrap = $(self).parent('.m-menu-wrap');
		var $inner = $wrap.find('.m-menu-inner');
		if ($inner.position().left < 0) {
			$inner.animate({
				left : '+=200'
			}, 200,function(){
				$this.initTriangle($wrap,$inner);
			});	
		}
	},
	rightClick : function(self) {
		var $this = this,
		    $wrap = $(self).parent('.m-menu-wrap'),
		    $inner = $wrap.find('.m-menu-inner');
		if ($inner.width() + $inner.position().left > $wrap.width()) {
			$inner.animate({
				left : '-=200'
			}, 200,function(){
				$this.initTriangle($wrap,$inner);
			});	
		}
	},
	itemClick : function(url){
		if(!handlerModual.isEmpty(url)){
			window.open(url);
		}
	},
	accessClick:function(self){
		this.options = {
			privilegeId : $(self).attr('privilegeId'),
			flag		: $(self).attr('flag') ? $(self).attr('flag') : 'ZJ_INDEX_NEW_MENU'
		};
		accessLogModual.access.call(this);
	},
	showPanel:function(self,id){
		var $menu = $(self).parents('li.u-lst');
		if(!$menu.data('FILTER')){
			var $this = this,
				allWidth = 0;
			    menuCache = getXmlFromHtmlData('menuCache'),
			    $menuItem = $(menuCache).find('MenuItem[id=' + id + ']'),
			    menuWidth = $menuItem.attr('width') ? $menuItem.attr('width') : 200,
			    $favorite = $menu.find('.u-f');
	
			var thirdLevelData = [];
			var sencondLevelData = [];
	
			var $childrens = $menuItem.children('MenuItem[isHasPrivilege!="0"]');
			$childrens.each(function(index) {
				thirdLevelData.push({
						tip 	: $(this).attr('tip'),
					 isFavorite : $(this).attr('isFavorite'),
					privilegeId : $(this).attr('privilegeId'),
					  serverUrl : $(this).attr('serverUrl'),
						  label : $(this).attr('label'),
					  itemClass : $favorite.hasClass('active') ? 'u-fi' : '',
						menuStar: $favorite.hasClass('active') ? templateUtil.getStr(MENU_START_TPL, {
							MODEL: $(this).attr('isFavorite') == '1' ?  'static' : '', 
							CLASS: $(this).attr('isFavorite') == '1' ?  'fa-star': 'fa-star-o' 
						}) :''
				});
	
				if ((index != 0 && index % $this.pageSize == 0)
						|| index == $childrens.length - 1) {
					sencondLevelData.push({
						menuWidth : menuWidth,			
						thirdLevel : templateUtil.getStr(MENU_THIRD_LEVEL_TPL,
								thirdLevelData)
					});
					thirdLevelData = [];
					allWidth += parseInt(menuWidth);
				}
			});
	
			var $menuPanel = $menu.find('.m-menu-panel');
			$menuPanel.fadeIn().html(
					templateUtil.getStr(MENU_PANEL_TPL, {
						menuId : $menuItem.attr('id'),
						menuName : $menuItem.attr('label'),
						imageUrl : $menuItem.attr('imageUrl'),
						panelCt : templateUtil.getStr(MENU_PANEL_SECOND_LEVEL_TPL,
								sencondLevelData)
					})).css('height', $menuPanel.parents('.m-menu-wrap').height());
	
			$menuPanel.find('.m-menu-panel-ct').css({
				'width' : allWidth + 'px'
			});
	
			if (allWidth > $menuPanel.width()) { // 太多时,显示滚动条
				$menuPanel.find('.m-menu-panel-wrap').addClass('f-scroll-x');
			} else {
				$menuPanel.find('.m-menu-panel-wrap').removeClass('f-scroll-x');
			}
		}
	},
	hidePanel:function(self){
		$(self).parent('.m-menu-panel').fadeOut();
	},
	filter:function(self){
		if(window.event.keyCode == 13){
			var $parentMenu = $(self).parents('li.u-lst');
			if($.trim($(self).val())){
				var filters = $(self).val().split(' ');
				for(var i = 0 ;i < filters.length; i++){
					if(!$.trim(filters[i])){
						filters.splice(i,1);
					}
				}
				
				var $childrens = this.initDataById($parentMenu.attr('menuid'),filters);
				$parentMenu.data('FILTER',1);
			}else{
				var $childrens = this.initDataById($parentMenu.attr('menuid'));	
				$parentMenu.data('FILTER',0);
			}
			
			$parentMenu.find('.m-menu-inner').html(templateUtil.getStr(
					MENU_SECOND_LEVEL_TPL, this.initSecondLevel($childrens).items));
		}		
	},
	toggleFavorite:function(self){
	    if($(self).hasClass('active')){	    	
	    	var liItems = $(self).parents('.m-menu-ct').find('li.u-item');
	    	liItems.removeClass('u-fi').find('i.u-favorite').remove();
	    	$(self).removeClass('active').find('b').text('收藏');
	    }else{
	    	var liItems = $(self).parents('.m-menu-ct').find('li.u-item');
			liItems.addClass('u-fi').append(function(){  //后面添加星星
				 if($(this).attr('isFavorite') == '1'){  //已收藏的,鼠标划过时星星不闪烁
					return templateUtil.getStr(MENU_START_TPL,{MODEL:'static', CLASS: 'fa-star'});
				 }
				 return templateUtil.getStr(MENU_START_TPL,{ CLASS: 'fa-star-o'});
			});			
			$(self).addClass('active').find('b').text('完成');
	    }
	}
}

var accessLogModual = {
	init: function(){
		setTimeout(this.addStaffBrowsserInfo, 3000);
	},
	access:function(){
		this.options = $.extend({}, {privilegeId: -2, flag:''} ,this.options);
		$.post('/CustZJAccessLog.do?method=access',{privilegeId: this.options.privilegeId, flag : this.options.flag});
	},
	addStaffBrowsserInfo:function(){
		$.post('/CustZJAccessLog.do?method=addStaffBrowserLog',{
			appName			: 	navigator.appName,
			userAgent		: 	navigator.userAgent,
			cookieEnabled	: 	navigator.cookieEnabled ? 1 : 0,
			browserLanguage	: 	navigator.browserLanguage,
			cpuClass		: 	navigator.cpuClass,
			platform 		: 	navigator.platform,
			screenWidth		:   window.screen.width,
			screenHeight	:	window.screen.height,
			javaEnabled		: 	navigator.javaEnabled() ? 1 : 0,
			colorDepth		: 	window.screen.colorDepth,
			deviceXdpi		: 	window.screen.deviceXDPI,
			deviceYdpi		:	window.screen.deviceYDPI,
			browserVersion	: 	parseInt($.browser.version),
			documentMode	: 	document.documentMode,
			clientWidth		:	document.body.clientWidth,
			clientHeight	: 	document.body.clientHeight,
			opener			: 	window.opener && window.opener.location.href 
	});
	}
}

//快速导航
var QUICK_LIST_TPL = '<li><a class="f-toe f-float-shadow" href="javascript:void(0);" onClick="javascript:{navUrl}; quickModual.accessClick(this);" onmouseover="quickModual.mouseOver(this);" onmouseout="quickModual.mouseOut(this);" imgUrl="{navImageUrl}" hoverImgUrl="{navImageHoverUrl}" privilegeId="{navPrivilegeId}"  style="background-image:url({navImageUrl});">{navName}</a></li>';

var quickModual = {
	getNavUrl : '/CustZJQuickNav.do?method=getNavList',
	saveNavUrl : '/CustZJQuickNav.do?method=saveStaffNav',
	getStaffNavUrl : '/CustZJQuickNav.do?method=getStaffNav',
	initByData : function(data) {
		var _quickUl = $('#quickSetCt');
		$(_quickUl).html(templateUtil.getStr(QUICK_LIST_TPL, data)).hide().show(500);
		if (data.length < 6) {
			$(_quickUl)
					.append(
							'<li class="u-add"><a class="f-toe f-transition-in" onclick="quickModual.showQuickWin();"></a></li>');
		}else{
			$('#quickSetBtn').attr('display', 'show').show();
		}
	},
	init : function() {
		$('#quickSetToggle').bind('click', function(){ //切换"快速导航" 和 "收藏夹"
			$(this).removeClass('f-text-gray');
			$('#favoriteEditBtn').hide();
			if($('#quickSetBtn').attr('display')=='show'){
				$('#quickSetBtn').show();
			}
			$('#favoriteToggle').addClass('f-text-gray');
			$('#quickSetCt').parent().animate({
				left : 0
			}, 300);
		});
		this.initByData(getJsonFromHtmlData("staffFastNavCache"));
	},
	reInit : function() {
		$.getJSON(quickModual.getStaffNavUrl, function(data) {
			if (data.success) {
				quickModual.initByData(data.message);
			}
		});
	},
	mouseOver : function(self) {
		$(self).css('background-image',
				'url(' + $(self).attr('hoverImgUrl') + ')');
	},
	mouseOut : function(self) {
		$(self).css('background-image', 'url(' + $(self).attr('imgUrl') + ')');
	},
	formatChecked : function(isChecked) {
		return isChecked >= 1 ? 'checked' : '';
	},
	getNavList : function(callback) {
		var quickSetHtml = [];
		$
				.getJSON(
						quickModual.getNavUrl,
						function(data) {
							$(data)
									.each(
											function(index, item) {
												if (index % 4 == 0) {
													if (index == 0) {
														quickSetHtml
																.push('<tr>');
													} else {
														quickSetHtml
																.push('</tr><tr>');
													}
												}
												quickSetHtml
														.push('<td width="150"><p class="f-tac"><img src="'
																+ item.navImageUrl
																+ '" /></p><p class="f-tac">'
																+ item.navName
																+ '</p><p class="f-tac"><input type="checkbox" navId='
																+ item.navId
																+ ' '
																+ quickModual
																		.formatChecked(item.isChecked)
																+ '/></p></td>');
											});
							quickSetHtml.push('</tr>');
							callback(quickSetHtml.join(''));
						});
	},
	showQuickWin : function() {
		this.getNavList(function(listHtml) {
			$('#quickSet').html(listHtml);
		});
		layer
				.open({
					title : [ '快速导航配置' ],
					closeBtn : 1,
					shade: false,
					area:['500px'],
					btn : [ '保存', '取消' ],
					yes : function(index, layero) {
						$('#quickSet').mask('');
						var checkInputs = $('#quickSet input[type=checkbox]:checked');
						if(checkInputs.length == 0){
							layer.msg('您选择了0项!',{shift:6});
						} else if (checkInputs.length > 6) {
							layer.msg('最多只能选择6个配置项,您选择了' + checkInputs.length
									+ '项!',{shift:6});
						} else {
							var sendData = [];
							checkInputs.each(function(index, item) {
								sendData.push($(item).attr('navId'));
							});
							
							$.post(quickModual.saveNavUrl, {
								info : JSON.stringify(sendData)
							}, function(data) {
								if (data.success) {
									layer.msg("保存成功!");
									quickModual.reInit();
								} else {
									layer.msg(data.message);
								}
							});
						}
					},
					shadeClose : true,
					shift : 3,
					success : function(layeo) {
						$('#quickSet').mask('');
					},
					content : '<table id="quickSet"></table>'
				});
	},
	accessClick:function(self){
		this.options = {
			privilegeId : $(self).attr('privilegeId'),
			flag		: 'ZJ_INDEX_NEW_QUICK_NAV'
		};
		accessLogModual.access.call(this);
	}
}

var FAVORITE_TPL = '<li title="{MENU_TEXT}" class="f-toe" privilegeid="{PRIVILEGE_ID}"><i class="fa fa-1_5x fa-star f-text-yellow f-csp" onClick="favoriteModual.remove(this);"></i>&nbsp;<a onclick="favoriteModual.open(this);;favoriteModual.accessClick(this);" url="{SERVER_URL_NAME}">{MENU_TEXT}</a></li>';
var FAVORITE_WRAP_TPL = '<div class="u-wrap" style="width:{WIDTH}">{CONTENT}</div><div class="u-page">{PAGE_CONTENT}<div>';
var FAVORITE_PAGE_POINT_TPL = '<i index="{INDEX}" class="f-csp fa fa-1_3x {CLASS}"></i>&nbsp;';
//收藏夹
var favoriteModual = {
	addFavoriteUrl : '/CustZJQuickNav.do?method=addFavorite',
	updateTextUrl: '/CustZJQuickNav.do?method=updateFavoriteText',
	delFavoriteUrl : '/CustZJQuickNav.do?method=delFavorite',
	init:function(){
		var $this = this;
		$('#favoriteToggle').bind('click', function(){
			$(this).removeClass('f-text-gray');
			$('#favoriteEditBtn').show(300);
			$('#quickSetBtn').hide();
			$('#quickSetToggle').addClass('f-text-gray');
			$('#favoriteCt').parent().animate({
				left : '-270px'
			}, 300);
			
			if(!$(this).data('isInited')){
				$this.initData();
				layer.config({
				  extend: 'extend/layer.ext.js'
				}); 
				$(this).data('isInited', true);
			}
		});
	},
	initData:function(){
		ResultUtil.query('ZJ_FAVORITE',function(data) {
					if(data.length > 0){
						var flag = 0,rowCounter = 0, dataLen = data.length;
						var tempArr = [], htmlArr = [], pageArr = [];
						$(data).each(function(index, item) {
									tempArr.push(item);
									rowCounter++;
									
									if(item.MENU_TEXT.length < 8){ //该块是为了控制同2个长度较短的内容排在同一行
										if(++flag >= 2){ 
											flag =0; rowCounter--;
										}					
									}else{
										flag = 0;
									}

									if(rowCounter > 8 || index == dataLen-1){									
										htmlArr.push('<ul>'+templateUtil.getStr(FAVORITE_TPL, tempArr)+'</ul>');
										pageArr.push({INDEX : pageArr.length , CLASS: (pageArr.length > 0) ? 
												'fa-circle-o f-text-gray':'fa-dot-circle-o f-text-green'});
										rowCounter = 0, flag=0 ;
										tempArr = [];
									}
								});
						$('#favoriteCt').html(templateUtil.getStr(FAVORITE_WRAP_TPL,
								{WIDTH:pageArr.length*250 + 'px', CONTENT:htmlArr.join(''), 
							     PAGE_CONTENT:templateUtil.getStr(FAVORITE_PAGE_POINT_TPL,pageArr)})).hide().fadeIn();
						
						$('#favoriteCt').find('.u-page').children().bind('mouseover',function(){
							$(this).siblings('.fa-dot-circle-o').removeClass('fa-dot-circle-o f-text-green').addClass('fa-circle-o f-text-gray');
							$(this).removeClass('fa-circle-o f-text-gray').addClass('fa-dot-circle-o f-text-green');
							
							$('#favoriteCt>.u-wrap').stop().animate({
								left : '-'+$(this).attr('index') * 250 + 'px'
							}, 500);
						});
					}
				}).refresh({t: new Date().toTimeString()});
	},
	itemMouseIn:function(self){
		if($(self).attr('model')!='static'){
			$(self).removeClass('fa-star-o').addClass('fa-star');
		}
	},
	itemMouseOut:function(self){
		if($(self).attr('model')!='static'){
			$(self).removeClass('fa-star').addClass('fa-star-o');
		}
	},
	itemClick:function(self){
		if($(self).attr('model') =='static'){
			$.post(favoriteModual.delFavoriteUrl, { privilegeId : $(self).parent().attr('privilegeId')},function(data){
				if(data.success){
					$(self).removeAttr('model').removeClass('fa-star').addClass('fa-star-o');
					$(self).parents('li.u-item').attr('isFavorite','0');
					layer.msg('移除收藏成功!');
				}else{
					layer.msg(data.message);
				}
			});
		}else{
			$.post(favoriteModual.addFavoriteUrl, { privilegeId : $(self).parent().attr('privilegeId'), menuText: $(self).parent().text().trim() },function(data){
				if(data.success){
					$(self).attr('model','static').removeClass('fa-star-o').addClass('fa-star');
					$(self).parents('li.u-item').attr('isFavorite','1');
					layer.msg('收藏成功!');
				}else{
					layer.msg(data.message);
				}
			});
		}
	},
	remove:function(self){
		if($('#favoriteCt').data('status')=='edit'){
			$.post(favoriteModual.delFavoriteUrl, { privilegeId : $(self).parent().attr('privilegeId')},function(data){
				if(data.success){
					$(self).attr('model','').removeClass('fa-star').addClass('fa-star-o');
					$(self).parents('li').hide(500);
				}else{
					layer.msg(data.message);
				}
			});
		}else{
			layer.msg('请先点击\"编辑\"进入可编辑模式!');
		}	
	},
	edit:function(self){
		if($('#favoriteCt').data('status')=='edit'){
			$(self).find('em').html('编辑');
			$('#favoriteCt').data('status','view');
			this.initData();
		}else{
			$(self).find('em').html('完成');
			$('#favoriteCt').data('status','edit').find('li').css({border:'1px dotted #337ab7'});
		}
	},
	open:function(self){
		if($('#favoriteCt').data('status') == 'edit'){
			layer.prompt({
				  title: '修改标签名称',
				  formType: 0,
				  value: $(self).text()
			}, function(text){
				$.post(favoriteModual.updateTextUrl, { privilegeId : $(self).parent().attr('privilegeId') , menuText: text},function(data){
					if(data.success){
						$(self).hide().html(text).show(300);
						layer.msg('修改成功!');
					}else{
						layer.msg(data.message);
					}
				}); 
			});
		}else{
			window.open($(self).attr('url'));
		}
		
	},
	accessClick:function(){
		this.options = {
			privilegeId : $(self).attr('privilegeId'),
			flag		: 'ZJ_INDEX_NEW_FAVORITE'
		};
		accessLogModual.access.call(this);
	}
}

//搜索
var SEARCH_FLOW_TPL = '<li><a class="f-toe f-wobble-bottom" href="/workshop/form/index.jsp?flowMod={FLOW_MOD}" target="_blank">{FLOW_NAME}</a></li>';
var SEARCH_FUNC_TPL = '<li><a class="f-toe f-wobble-bottom" href="{SERVER_URL_NAME}" target="_blank">{PRIVILEGE_NAME}</a></li>';
var SEARCH_TODO_TPL = '<li><a class="f-toe f-wobble-bottom" href="/workshop/form/index.jsp?flowId={FLOW_ID}" target="_blank">{FLOW_NAME}</a></li>';

var searchModual = {
	init:function(){
		$('#searchInput').keypress(function(event) {
			if (event.which == 13) {
				$('#searchSubmit').click();
			}
		}).myplaceholder({
			type : 'model2',
			style : {
				left : '50px'
			}
		});
		
		$('body').click(function(e){
			if($(e.target).parents('.m-sch .u-sch').length <= 0){
				$('#searchCt').hide(200);
			}
		});
		
	},
	flowSearch:function(qValue,callback){
		$('#searchFlowHd').show();
		$('#searchFlow').show().mask('');
		ResultUtil.query(
					'ZJ_FLOW_SEARCH',
					function(data) {
						if(data.length > 0){
							$(data).each(
									function(index, item) {
										item.FLOW_NAME = item.FLOW_NAME.replace(
												qValue, '<em>' + qValue
														+ '</em>');
									});
							
							$('#searchFlow').html(
									templateUtil.getStr(SEARCH_FLOW_TPL, data)).hide().show(800);
						}else{
							$('#searchFlow').hide().unmask('');
							$('#searchFlowHd').hide();
							//$('#searchFlow').find('li.msg').html('对不起,没搜索到<em>"'+qValue+'"</em>相关的流程!');
						}
						callback(data);
					}).refresh({
				SEARCH_VALUE : '%' + qValue + '%',
				ROW_NUM		 : 5
		});
	},
	funSearch:function(qValue,callback){
		$('#searchFuncHd').show();
		$('#searchFunc').show().mask('');
		ResultUtil.query(
				'ZJ_FUNC_SEARCH',
				function(data) {
					if(data.length > 0){
						$(data).each(
								function(index, item) {
									item.PRIVILEGE_NAME = item.PRIVILEGE_NAME
											.replace(qValue, '<em>'
													+ qValue + '</em>');
								});
						$('#searchFunc').html(
								templateUtil.getStr(SEARCH_FUNC_TPL, data)).hide().show(800);
					}else{	
						$('#searchFunc').hide().unmask('');
						$('#searchFuncHd').hide();
						//$('#searchFunc').find('li.msg').html('对不起,没搜索到<em>"'+qValue+'"</em>相关的功能报表!');
					}
					callback(data);
				}).refresh({
			SEARCH_VALUE : '%' + qValue + '%',
			ROW_NUM		 : 5
		});
	},
	todoSearch:function(qValue,callback){
		$('#searchTodoHd').show();
		$('#searchTodo').show().mask('');
		ResultUtil.query(
				'ZJ_TODO_SEARCH',
				function(data) {
					if(data.length > 0){
						$(data).each(
								function(index, item) {
									item.FLOW_NAME = item.FLOW_NAME.replace(
											qValue, '<em>' + qValue
													+ '</em>');
								});
						$('#searchTodo').html(
								templateUtil.getStr(SEARCH_TODO_TPL, data)).hide().show(800);
					}else{
						$('#searchTodo').hide().unmask('');
						$('#searchTodoHd').hide();
						//$('#searchTodo').find('li.msg').html('对不起,没搜索到<em>"'+qValue+'"</em>相关的待办信息!');
					}
					callback(data);
				}).refresh({
			SEARCH_VALUE : qValue ,
			ROW_NUM		 : 5
		});
	},
	getSearchVal :function(){
		return $('#searchInput').val();
	},
	search:function(self) {
		var a = 0,b = 0;
		var sValue = this.getSearchVal();

		if (sValue) {
			$('#searchCt').show();
		} else {
			layer.msg('悟空,你又调皮了...', {
				shift : 6
			});
		}
		
		this.sCallback = function(data){
			a++;
			if(data.length > 0){
				b++;
			}
			if(a == 3 && b == 0){
				$('#searchNoData').show(300).find('li.msg').html('<span class="f-text-yellow"><i class="fa fa-hand-o-right"></i>&nbsp;众里寻他千百度,换个关键词试试!</span>');
			}
		};
		
		$('#searchNoData').hide();
		this.flowSearch(sValue, this.sCallback);
		this.funSearch(sValue, this.sCallback);
		this.todoSearch(sValue, this.sCallback);
	},
	
	btnHover:function(self){
		$(self).addClass('active');
	},
	btnOut:function(self){
		$(self).removeClass('active');
	},
	flowMore:function(){
		window.open('/workshop/query/show_result.html?result=50000450&SEARCH_VALUE='+ encodeURIComponent('%'+this.getSearchVal()+'%'));
	},
	funcMore:function(){
		window.open('/workshop/query/show_result.html?result=50000451&SEARCH_VALUE='+ encodeURIComponent('%'+this.getSearchVal()+'%'));
	},
	todoMore:function(){
		window.open('/workshop/query/show_result.html?result=50000452&SEARCH_VALUE='+ encodeURIComponent(this.getSearchVal()));
	}
}




var TODO_COLUMN_TPL = '<li columnId="{columnId}" cfgName="{cfgName}"><a href="javascript:void(0);" class="f-float-shadow" columnId="{columnId}" style="background-image:url({image});" imgUrl="{image}" hoverImgUrl="{hoverImage}" onmouseOver="todoModual.mouseOver(this);" onmouseOut="todoModual.mouseOut(this);" onClick="todoModual.columnSelect(this);">{columnName}<span class="u-cnt" id="{cfgNameId}"><i class="fa fa-spinner fa-spin"></i></span></a><p></p></li>';
var ALL_TODO_COLUMN_TPL = '<li class="{isActive}"><a style="background-image:url({image})"  onclick="todoModual.switchColumn({index},this);"><input type="checkbox" columnId="{columnId}" style="position: relative; left:-15px;" {isChecked} onClick="todoModual.columnChecked(this);"/></a><center>{columnName}</center><p></p></li>';
var COLUMN_FLOW_TPL = '<li><span class="{isChecked}" columnId="{columnId}" flowId="{flowId}" onclick="todoModual.flowUpdate(this);">{flowName}</span></li>';
var LEFT_COLUMN_TPL = '<li flowMod="{flowMod}" onclick="todoModual.flowSelect(this);">{flowName}</li>';
var RIGHT_TODO_TPL = '<tr height="30px"><td class="u-sr f-toe" title="{FORM_SERIAL}">{FORM_SERIAL}</td><td class="u-ct" title="{CONTENT}"><a class="f-toe" href="{SEND_URL}" target="_blank">{CONTENT}</a></td></tr>';

var TODO_TYPES = {
	pending  :  "ZJ_PERSON_PENDING",
	pended   :  "ZJ_PERSON_PENDED",
	reading  :  "ZJ_PERSON_READING",
	readed   :  "ZJ_PERSON_READED",
	tail     :  "ZJ_PERSON_TAIL",
	assess   :  "ZJ_PERSON_ASSESS"
};

var todoFactory = function() {
	function abstractFunc() {
		var $this = this;
		this.handle = function(flowMod, callback) {
			ResultUtil.query($this.cfgName, function(data) {
				$this.format(data);
				callback(data);
				$this.initCnt();
			}).refresh({
				FLOW_MOD : flowMod,
				ROW_NUM  : 12
			});
		};
		this.initCnt = function(){ //统计数量
			if(TODO_TYPES.pended != $this.cfgName && TODO_TYPES.readed != $this.cfgName){  //已办和已阅不统计数量
				ResultUtil.query($this.cfgName+'_CNT', function(data) {
					$('#'+$this.cfgName+'_ID').html('['+data[0].CNT+']');
				}).refresh();
			}else{
				$('#'+$this.cfgName+'_ID').html('');
			}
		}
	}
	//待办
	this.pending = function(cfgName) {
		this.cfgName = cfgName;
		this.format = function(data) {
			$(data).each(
					function(index, item) {
						if (item.TYPE == '3') { // 已启动消息
							if (item.ISBINDFORM == '0') { // 无表单流程
								item.SEND_URL = '/FlowBrowse?flow_id='
										+ item.CONTENT_ID + '&system_code=G';
							}
						} else if (item.TYPE == '2') { // 待办
							if (item.ISBINDFORM == '0') { // 无表单流程
								item.SEND_URL = '/TacheExec?tch_id='
										+ item.CONTENT_ID + '&system_code=G';
							}
						}
					});
		};
		abstractFunc.call(this);
	}
	//已办
	this.pended = function(cfgName) {
		this.cfgName = cfgName;
		this.format = function(data) {
			$(data).each(
					function(index, item) {
						if (item.TYPE == '3') { // 已启动消息
							if (item.ISBINDFORM == '0') { // 无表单流程
								item.SEND_URL = '/FlowBrowse?flow_id='
										+ item.CONTENT_ID + '&system_code=G';
							}
						} else if (item.TYPE == '2') { // 待办
							if (item.ISBINDFORM == '0') { // 无表单流程
								item.SEND_URL = '/TacheExec?tch_id='
										+ item.CONTENT_ID + '&system_code=G';
							}
						}
					});
		};
		abstractFunc.call(this);
	};
	
	// 已阅
	this.readed = function(cfgName) {
		this.cfgName = cfgName;
		this.format = function(data) {
			$(data).each(
					function(index, item) {
						item.SEND_URL = '/workshop/msg/showMsg.html?msg_id='
								+ item.MESSAGE_ID + '&msg_tag=' + item.TAG
								+ '&msg_type=' + item.MESSAGE_TYPE
								+ '&msg_isSelf=' + item.IS_SELF;
					});
		};
		abstractFunc.call(this);
	}

	// 待阅
	this.reading = function(cfgName) {
		this.cfgName = cfgName;
		this.format = function(data) {
			$(data).each(
					function(index, item) {
						item.SEND_URL = '/workshop/msg/showMsg.html?msg_id='
								+ item.MESSAGE_ID + '&msg_tag=' + item.TAG
								+ '&msg_type=' + item.MESSAGE_TYPE
								+ '&msg_isSelf=' + item.IS_SELF;
					});
		};
		abstractFunc.call(this);
	}

	// 跟踪
	this.tail = function(cfgName) {
		this.cfgName = cfgName;
		this.format = function(data) {
			$(data).each(
					function(index, item) {
						if (item.TYPE == '3') { // 已启动消息
							if (item.ISBINDFORM == '0') { // 无表单流程
								item.SEND_URL = '/FlowBrowse?flow_id='
										+ item.CONTENT_ID + '&system_code=G';
							}
						} else if (item.TYPE == '2') { // 待办
							if (item.ISBINDFORM == '0') { // 无表单流程
								item.SEND_URL = '/TacheExec?tch_id='
										+ item.CONTENT_ID + '&system_code=G';
							}
						}
					});
		};
		abstractFunc.call(this);
	}
	// 评价
	this.assess = function(cfgName) {
		this.cfgName = cfgName;
		this.format = function(data) {
			$(data).each(
					function(index, item) {
						item.SEND_URL = '/workshop/form/index.jsp?flowId='
								+ item.FLOW_ID;
					});
		};
		abstractFunc.call(this);
		
	}

	return {
		getInstance : (function() {
			var types = {};
			types[TODO_TYPES.pending] = new pending(TODO_TYPES.pending);
			types[TODO_TYPES.pended] = new pended(TODO_TYPES.pended);
			types[TODO_TYPES.reading] = new reading(TODO_TYPES.reading);
			types[TODO_TYPES.readed] = new reading(TODO_TYPES.readed);
			types[TODO_TYPES.tail] = new tail(TODO_TYPES.tail);
			types[TODO_TYPES.assess] = new assess(TODO_TYPES.assess);
			return types;
		})(),
		getTodoTypes : function(type) {
			return this.getInstance[type];
		}
	};
}();


//待办
var todoModual = {
	getColumnUrl : '/CustZJColumn.do?method=getAllColumnFLow',
	getStaffColumnUrl : '/CustZJColumn.do?method=getStaffColumns',
	updateColumnFlowUrl : '/CustZJColumn.do?method=updateColumnFlow',
	updateColumnUrl : '/CustZJColumn.do?method=updateColumn',
	getLeftColumnFlowUrl : '/CustZJColumn.do?method=getLeftColumnFlow',
	getRightTodoUrl : '/CustZJColumn.do?method=getLeftColumnFlow',
	tickCounter		: 0,
	refreshTicks	: 60,
	$refreshTickSpan : null,
	init : function() {
		this.initColumnByData(getJsonFromHtmlData("staffColumnCache"));
		this.$refreshTickSpan = $('#todoRefreshTick');
		
		window.setInterval(
				"todoModual.refreshTick()", 1000);
	},
	initColumn : function() {
		var $this = this;
		$.getJSON($this.getStaffColumnUrl, function(data) {
			$this.initColumnByData(data.message);
		});
	},
	initColumnByData : function(data) {
		var _data = [];
		$(data).each(function(index,item){
			if(item.isChecked == '1'){
				item.cfgNameId = item.cfgName + '_ID' ;
				_data.push(item);
			}
		});
		if(_data.length <= 0){ //未选中时,使用默认
			$(data).each(function(index,item){
				if(item.defaultShow == '1'){
					item.cfgNameId = item.cfgName + '_ID' ;
					_data.push(item);
				}
			});
		}
		$('.m-nav>ul')
				.html(templateUtil.getStr(TODO_COLUMN_TPL, _data))
				.append(
						'<li class="add"><a class="f-transition-in" href="javascript:void(0);" onClick="todoModual.showWin();"></a></li>').hide().show(800);

		var $navls = $('#nav>ul>li');
		if ($navls.length > 1) {  //默认选中第一项
			$navls.first().addClass('active');
			this.initLeftColumnFlow($navls.first().attr('columnId'));
		}
		
		$(_data).each(function(index,item){
			todoFactory.getTodoTypes(item.cfgName).initCnt();
		});
		
	},
	todoMask : function() {
		$('#rsnav').mask('');
	},
	todoUnMask : function() {
		$('#rsnav').unmask('');
	},
	getActiveFLowMod : function() {
		return $('#lsnav>ul>li.active').attr('flowMod');
	},
	getActiveColumn : function() {
		var $active = $('#nav>ul>li.active');
		return {
			columnId : $active.attr('columnId'),
			cfgName : $active.attr('cfgName')
		};
	},
	initLeftColumnFlow : function(columnId) { //初始化左边块的流程列表
		var $this = this;
		$
				.getJSON(
						this.getLeftColumnFlowUrl,
						{
							columnId : columnId
						},
						function(data) {
							if (data.success) {
								$('#lsnav>ul')
										.html(
												'<li class="active" onclick="todoModual.flowSelect(this);">全部</li>')
										.append(
												templateUtil.getStr(
														LEFT_COLUMN_TPL,
														data.message));
								if(data.message.length > 8){  //超过8个项目,显示滚动条
									$('#lsnav').addClass('f-scroll-y');
								}else{
									$('#lsnav').removeClass('f-scroll-y');
								}
								$this.initRightTodo();
							} else {
								layer.msg(data.message);
							}
						});
	},
	initRightTodo : function() { //初始化右边块的待办列表
		var $this = this;
		var $activeColumn = this.getActiveColumn();
		if($activeColumn.columnId){
			this.todoMask();
			var todoTypeObj = todoFactory.getTodoTypes($activeColumn.cfgName);
			todoTypeObj.handle(this.getActiveFLowMod(), function(data) {
				$('#rsnav tbody').stop().html(templateUtil.getStr(RIGHT_TODO_TPL, data));
				$this.todoUnMask();
			});
		}else{
			layer.msg('请先选择待办栏目!',{shift:6});
		}
	},
	refreshTick:function(){
		if(this.tickCounter >= this.refreshTicks){
			this.refreshRightTodo();
			this.tickCounter = 0;
		}else{
			this.tickCounter++;
		}
		this.$refreshTickSpan.html((this.refreshTicks - this.tickCounter)+'s');
	},
	refreshRightTodo : function() {
		this.initRightTodo();
		this.tickCounter = 0;
	},
	flowSelect : function(self) {
		$(self).siblings().removeClass('active');
		$(self).addClass('active');
		this.initRightTodo();
	},
	mouseOver : function(self) {
		$(self).css('background-image',
				'url(' + $(self).attr('hoverImgUrl') + ')');
	},
	mouseOut : function(self) {
		$(self).css('background-image', 'url(' + $(self).attr('imgUrl') + ')');		
	},
	columnSelect : function(self) { //切换栏目
		$(self).parent().siblings().removeClass('active');
		$(self).parent().addClass('active');
		this.initLeftColumnFlow($(self).attr('columnId'));
	},
	formatChecked : function(isChecked) {
		return isChecked >= 1 ? 'checked' : '';
	},
	formatFlow : function(data,columnId) {
		var $this = this;
		$(data).each(function(index, item) {
			item.isChecked = $this.formatChecked(item.isChecked);
			item.columnId = columnId;
		});
		return data;
	},
	getColumnList : function(callback) {
		var columnsHtml = [];
		var columnFlowsHtml = [];
		var $this = this;
		$.getJSON(todoModual.getColumnUrl, function(data) {
			columnFlowsHtml.push('<div class="m-flow-wrap" style="width:' + 740
					* data.message.length + 'px;">');
			$(data.message)
					.each(
							function(index, item) {
								item.isChecked = $this
										.formatChecked(item.isChecked);
								item.index = index;
								if (index == 0) {
									item.isActive = 'active';
								}
								columnsHtml.push(templateUtil.getStr(
										ALL_TODO_COLUMN_TPL, item));
								columnFlowsHtml.push('<ul>');
								columnFlowsHtml.push(templateUtil.getStr(
										COLUMN_FLOW_TPL, $this
												.formatFlow(item.flows, item.columnId)));
								columnFlowsHtml.push('</ul>');
							});
			columnFlowsHtml.push('</div>');
			callback(columnsHtml.join(''), columnFlowsHtml.join(''));
		});
	},
	showWin : function() {
		var $this = this;
		this.getColumnList(function(columnHtml, flowsHtml) {
			$('#todoSet>ul').html(columnHtml);
			$('#todoFLow').html(flowsHtml);
			$('#todoSetWrap').unmask();
		});
		layer
				.open({
					type : 0,
					title : [ '选择显示栏目' ],
					closeBtn : 1,
					area:'800px',
					shade: false,
					shadeClose : true,
					shift : 3,
					btn:['保存','取消'],
					success : function(layeo) {
						$('#todoSetWrap').mask('');
					},
					end : function() {
						$this.initColumn();
					},
					content : '<div id="todoSetWrap"><div class="m-todo-set" id="todoSet"><ul></ul></div><div class="m-todo-flow" id="todoFLow"></div></div>'
				});
	},
	flowUpdate : function(self) {
		$.post(this.updateColumnFlowUrl, {
			flowId : $(self).attr('flowId'),
			columnId : $(self).attr('columnId')
		}, function(data) {
			if (data.success) {
				if ($(self).hasClass('checked')) {
					$(self).removeClass('checked');
				} else {
					$(self).addClass('checked');
				}
			} else {
				layer.msg(data.message);
			}
		});

	},
	switchColumn : function(index, self) {
		$('.m-flow-wrap').animate({
			left : '-' + index * 740 + 'px'
		}, 500);
		$(self).parent().siblings().removeClass('active');
		$(self).parent().addClass('active');
	},
	columnChecked : function(self) {
		$.post(this.updateColumnUrl, {
			columnId : $(self).attr('columnId')
		}, function(data) {
			if (!data.success) {
				layer.msg(data.message);
			}
		});
	}
};

//用户
var userModual={
		init:function(){
			//个人设置下拉
			$('.m-user .u-set').hover(function() {
				$(this).find('ul').clearQueue('hideUserSet').show(300);
			}, function() {
				$(this).find('ul').delay(200,'hideUserSet').queue('hideUserSet',function(){
					$(this).hide();
				}).dequeue('hideUserSet');
			});
			
			/*$('.m-user .u-avatar').hover(function(){
				layer.tips('<div><i class="fa fa-wifi"></i>您总共发起了<a href="#" id="userFlowLaunchCnt"><i class="fa fa-spinner fa-spin"></i></a>条流程,处理过<a href="#" id="userFlowHandleCnt"><i class="fa fa-spinner fa-spin"></i></a>张单子!</div>',this);
				
				var data = $(this).data('info');
				if(!data){
					ResultUtil.query('ZJ_STAFF_FLOW_INFO',function(dataList) {
						setInfoHtml(dataList[0]);
						$(this).data('info', dataList[0]);
					}).refresh();
				}else{
					setInfoHtml(data);
				}
			}).click(function(){
				$('#floatNav').css({left:'inherit',top:'inherit'}).show(800);
			});

			function setInfoHtml(data){
				$('#userFlowLaunchCnt').html(data.CREATE_CNT);
				$('#userFlowHandleCnt').html(data.HANDLE_CNT);
			}*/
		},
		showUserInfo:function(){
		   /*layer.open({
	            type: 2,
	            title: '用户信息',
	            shadeClose: true,
	            shade: false,
	            maxmin: true, //开启最大化最小化按钮
	            area: ['850px', '550px'],
	            content: '/workshop/user/individualInfo.jsp?tag=1'
	        }); */
			window.showModalDialog("/workshop/user/individualInfo.jsp?tag=1",null,"dialogWidth=750px;dialogHeight=500px;help=0;scroll=0;status=0;");
		},
		showErand:function(){
			/*layer.open({
	            type: 2,
	            title: '授权',
	            shadeClose: true,
	            shade: false,
	            maxmin: true, //开启最大化最小化按钮
	            area: ['950px', '450px'],
	            content: '/workshop/stafferrand/staffErrandInfoNoFilter.html'
	        }); */
			window.showModalDialog("/workshop/stafferrand/staffErrandInfoNoFilter.html",null,"dialogWidth=650px;dialogHeight=400px;help=0;scroll=0;status=0;");
		},
		updatePwd:function(){
			/*layer.open({
	            type: 2,
	            title: '密码修改',
	            shadeClose: true,
	            shade: false,
	            maxmin: true, //开启最大化最小化按钮
	            area: ['410px', '250px'],
	            content: '/workshop/user/changePw.html'
	        }); */
			window.showModalDialog("/workshop/user/changePw.html",null,"dialogWidth=410px;dialogHeight=200px;help=0;scroll=0;status=0;");
		},
		showMoreMsg:function(){
			/*layer.open({
	            type: 2,
	            title: '即时通讯',
	            shadeClose: true,
	            shade: false,
	            maxmin: true, //开启最大化最小化按钮
	            area: ['1200px', '550px'],
	            content: '/MoreMessagePage.html'
	        }); */
			window.showModalDialog("/MoreMessagePage.html",null,"dialogWidth=1000px;dialogHeight=520px;help=0;scroll=0;status=0;");
		},
		loginOut:function(){
			 window.location.href = "/logout";
		},
		showTipInfo:function(){
			ResultUtil.query(
					'ZJ_TIP_INFO',
					function(data) {
						var ulHtml = [];
						ulHtml.push('<ul id="tipCt">');
						$(data).each(function(index, item) {
							if(item.FLAG == '1'){ //影音
								ulHtml.push('<li><em>[影音]</em>&nbsp;&nbsp;&nbsp;<a onclick="">'+ item.TITLE +'</a></li>');
							}else{  //文档
								ulHtml.push('<li><em>[文档]</em>&nbsp;&nbsp;&nbsp;<a href="/servlet/downloadservlet?action=1&filename='+ encodeURIComponent(item.ATTACH_NAME) +'&fullPath='+ encodeURIComponent(item.ATTACH_ADDR)+'">'+item.TITLE+'</a></li>');
							}
						});
						ulHtml.push('</ul>');
						layer.open({
				            type   	  :	 1,
				            skin   	  :	'layui-layer-myblue',
				            title  	  : '小贴士',
				            shadeClose: true,
				            shade	  : false,
				            btn		  : ['查看更多'],
				            yes		  : function(){
				            	window.open('/workshop/form/zjFormFile/zj_note.html');
				            },
				            content   : ulHtml.join('')
				        });
					}).refresh();
			
		}
}

var userIdentityModual = function(){
	
	function getUserIdCardAndPhs(callbackFn){
		$.getJSON("/CustZJStaff/getStaffIdCardAndPhs.do", callbackFn);
	}
	
	function saveUserIndentityInfo(){
		$.post("/CustZJStaff/saveStaffIdCardAndPhs.do", $("#userIdentityForm").serialize(), function(data){
			if(!data.success){
			   layer.msg("保存用户身份信息出错!<br/>详细信息:["+ data.message +"]", {zIndex: layer.zIndex});
			   return;
			}
			layer.closeAll();
			layer.msg("保存成功!");
		});
	}
	
	function isShowStaffIdentity(showCallBackFn){
		$.getJSON("/CustZJStaff/isShowStaffIdentity.do", function(data){
			if(data.success){
				if(data["data"].isShow){
					showCallBackFn.apply(this);
				}
			} else {
				layer.msg(data.message);
			}
		});
	}
	
	return {
		init: function() {
			isShowStaffIdentity(function(){
				getUserIdCardAndPhs(function(data){
					if(!data["isPhsVaild"] || !data["isIdCardVaild"]){
						userIdentityModual.openVaildateWin(data);
					}
				})
			});
		},
		openVaildateWin : function(data){
			
			layer.open({
				 type: 1, 
				 title: '用户身份信息完善',
			     closeBtn: false,
			     content: getHtmlData("userIdentityFormCache"),
			     zIndex: layer.zIndex,
			    // area: '500px',
			     btn: ['保存'],
			     success : function(layero){
			    	 $("#idCardInput").val(data["idCard"]);
				     $("#phsInput").val(data["phs"]);
			     },
			     yes:function(){
			    	 saveUserIndentityInfo();
			     }
			});
		}
	}
	
}();
