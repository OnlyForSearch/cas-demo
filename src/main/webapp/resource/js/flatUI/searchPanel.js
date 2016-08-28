(function($){
	"use strict";
	var PLUG_NAME = "SEARCH_PANEL_CTRL",ACTION_URL='/servlet/spAction.do'; //ȫ�ļ������
	var CHANGED_NAME="CHANGED",NO_CHANGED_NAME="NO_CHANGED",BTN_TYPE_ALL="ALL",BTN_TYPE_NORMAL="NORMAL";

	function SearchPanel(element,opts){
		this.init(element,opts);
	}
	
	$.fn.searchPanel = function () {
		var args = arguments;
		var option=args[0];
		return this.each(function () {
			var $this = $(this)
		        , data = $this.data(PLUG_NAME)
		        , options = typeof option == 'object' && option;
				if (!data)
					$this.data(PLUG_NAME, (data = new SearchPanel(this,options)));
		      if (typeof option == 'string') {
		    	  data[option].apply(data,args);
//		    	  data[option]();
		      }
		});
	};
	
	SearchPanel.prototype = {
		constructor : SearchPanel,
		
		init : function(element, options) {
			this.$element = $(element);
			this.options = this.getOptions(options);
			//�����հ������
			var mainPanel = this.options.panelTpl;
			this.$element.append(mainPanel);
			
			this.$element.bind("itemSelect",function(evt,self){
				if(self.$element.find('.sp-changed-inner > button[panelId]').length>0)
					self.$element.find('.sp-reset,.sp-save').show();
				else
					self.$element.find('.sp-reset,.sp-save').hide();
			});
			
			if(this.options.isShowLoading){
				this.$element.bind('searchStart',function(evt,self){self.showLoading();});
				this.$element.bind('searchComplete',function(evt,self){self.hideLoading();});
			}
		
			//��Ҫ�ֶ��������� $('#searchPanelDiv').searchPanel('search',{sCont:'*',CLASS_ID:100101});
//			this.search();
			
			this.$element.find('.sp-reset').click($.proxy(this.resetAll, this));
			this.$element.find('.sp-save').click($.proxy(this.showSavePane, this));
			this.$element.find('.sp-hide-btn').click($.proxy(this.togglePanel, this));
		},
		
		initPanels : function(){
			var self = this,showChilds=false;
			
			if(this.$panelList){
				this.$panelList.empty();
				this.$panelList.append('<strong>��ѡ������</strong>');
			}
				
			else
				this.$panelList = this.$element.find('.sp-panel-list');
//			if(!this.options.panelState) this.options.panelState={};
			
			var panels = this.options.panels;
			for(var i=0;i<panels.length;i++){
				//�������
				if(panels[i].items.length==0)
					continue;
				var itemVals=[];
				var panelObj = {panelId:panels[i].panelId,panelName:panels[i].panelName};
				
				var $panelItem = $(templateUtil.getStr(this.options.panelItemTpl,panelObj));
				this.$panelList.append($panelItem);
				
				var $panelItemInner=$panelItem.find('#' + panels[i].panelId + '-panel-inner');
				
				var items,panelState = this.options.panelState[panels[i].panelId];
				
				if(panels[i].items.length == 1 && panels[i].items[0].items
										&& panels[i].items[0].items.length>0){
					items = panels[i].items[0].items;
					showChilds=true;
				}else{
					items = panels[i].items;
				}
				
				//����ѱ�ѡ��
//				if(panelState==CHANGED_NAME){
//					if(panels[i].items[0].items && panels[i].items[0].items.length>0)
//						items = panels[i].items[0].items;
//					else
//						items = panels[i].items;
//				}else{
//					items = panels[i].items;
//				}
				
				for(var j=0;j<items.length;j++){
					var childItems = items[j].items,
						itemObj = {
							panelId : panels[i].panelId,
							itemName : items[j].itemName,
							numFound : items[j].numFound
						};
					itemVals.push(items[j].itemValue);
					//������ť
					var $optBtn = $(templateUtil.getStr(this.options.optBtnTpl,itemObj));
					var btnData = $.extend({}, itemObj, {
						panelName : panels[i].panelName,
						itemValue : items[j].itemValue,
						hasLeaf:childItems && childItems.length>0,
						items:childItems
					});
					$optBtn.data('sp-attr',btnData);
					if(childItems && childItems.length>0){
						$optBtn.hover(function(evt){self.enterBtn($(this));},
									  function(evt){self.leaveBtn($(this));});
					}else{
						$optBtn.click(function(evt){
							self.btnClick($(this));
						});
					}
					$panelItemInner.append($optBtn);
				}
				
//				if(panelState==CHANGED_NAME && items.length>1){
				if(panelState==CHANGED_NAME && showChilds && items.length>1){
					var allItemObj = {
							 panelId:panels[i].panelId,
							 panelName:panels[i].panelName,
							 itemName:panels[i].items[0].itemName,
							 itemValue:itemVals,
							 numFound:panels[i].items[0].numFound
					};
					//TODO ���ȫ����ť��������bug
					self.prependAllBtn($panelItemInner,allItemObj,itemVals);
				}
			}
			
			if(this.$panelList.html()==''){
				var $blankCont=$(this.options.blankContTpl);
				this.$panelList.append($blankCont);
			}
		},
		
		getOptions: function (options) {
			options = $.extend({}, $.fn.searchPanel.defaults, options, this.$element.data());
//			if(!options.panels){
//				var datas = this.getSearchDatas(options.queryData);
//				this.search(options.queryData);
//				options.panels = this.datas.panels;
//			}
		    return options;
		},

		getSearchDatas : function(queryData,onDataSuccFn) {
			var self=this,qryData = queryData;
			var isStoreNeIds = this.$element.data('isStoreNeIds');
			if(typeof qryData === 'object'){
				qryData = $.param(qryData, true);
			}
			if(isStoreNeIds)
				qryData += '&isStoreNeIds='+isStoreNeIds;
			qryData += '&viewType=' + self.options.viewType
			
			$.ajax({
				url : ACTION_URL + '?method=searchBySolr',
				async : true,
				data : qryData,
				dataType : 'json',
				success : onDataSuccFn,
				error : function() {
					alert("��ȡ��������ʧ�ܣ���������ǣ�"+qryData);
				}
			});
		},
		
		btnClick : function($btn){
			var selectedCss = this.options.selectedCss;
			if($btn.hasClass(selectedCss)){
				//console.log("��ѡ => δѡ");
				this.noSelectBtn($btn);
				this.removeChangedItem($btn);
			}else{
				//console.log("δѡ => ��ѡ");
				this.selectType='single';
				this.selectBtn($btn);
				this.addChangedItem($btn.data('sp-attr'));
			}
			this.search();
		},
		
		addChangedItem : function(btnData){
			var self = this,attr = btnData;
			if(self.selectType=='single'){
				//��ѡ��ɾ����PanelId��ѡ��Ŀ
				self.$element.find('.sp-changed-inner > button[panelId='+attr.panelId+']').each(function(){
					self.removeChangedItem($(this));
				});
			}
			
			this.options.panelState[attr.panelId]=CHANGED_NAME;
			
			var itemObj = {
				panelId : attr.panelId,
				panelName : attr.panelName,
				itemValue : attr.itemValue,
				itemName : attr.itemName
			};
			var $changedBtn = $(templateUtil.getStr(this.options.changedBtnTpl,itemObj));
			this.$element.find('.sp-changed-inner').prepend($changedBtn);
			$changedBtn.data('sp-attr',attr);
			
			$changedBtn.click(function(e){
				var width = $(this).width();
				if(e.offsetX>width-5 && e.offsetX<(width+15)){
					//��Լ��X�ַ�Χ��
					self.removeChangedItem($(this));
					self.triggerEvent();
					self.search();
				}
			});
//			this.search();
			self.triggerEvent();
		},
		
		removeChangedItem : function($el){
			//����Ŀ����Ǵ�ѡ�б�ť��Ҳ��������ѡ�б�İ�ť
			var self=this,attr = $el.data('sp-attr'),$removeEl=$el,isOptBtn=false;
			this.options.panelState[attr.panelId]=NO_CHANGED_NAME;
			
			if(self.options.queryData && self.options.queryData[attr.panelId])
				delete self.options.queryData[attr.panelId];
			
			var $panelInner = this.$element.find('#'+attr.panelId+'-panel-inner');
			$panelInner.find('button').each(function(i){
				if($(this).data('sp-attr').itemValue==attr.itemValue){
					self.noSelectBtn($(this));
					if($(this)[0] == $el[0] ){
						isOptBtn=true;
					}
				}
			});
			//���������ѡ�б�ť
			if(isOptBtn){
				self.$element.find('.sp-changed-inner > button').each(function(j){
					if($(this).data('sp-attr') && $(this).data('sp-attr').itemValue==attr.itemValue){
						$removeEl=$(this);
					}
				});
			}
			$removeEl.remove();
			
//			this.search();
			self.triggerEvent();
		},
		
		triggerEvent : function(evtName){
			if(!evtName) evtName = 'itemSelect';
//			$(this).trigger(evtName, this);
			this.$element.trigger(evtName, this);
		},
		
		selectBtn : function($el){
			$el.removeClass(this.options.noSelectCss);
			$el.addClass(this.options.selectedCss);
		},
		
		noSelectBtn : function($el){
			$el.removeClass(this.options.selectedCss);
			$el.addClass(this.options.noSelectCss);
		},
		
		showExpandPanel : function($btn){
			var self = this,$expandPanel,itemVals=[];
//			if($btn.hasClass(this.options.selectedCss))
//				return;
			if($btn.parent().find('.sp-exp-list').length==0){
				$expandPanel = $(self.options.expandPanelTpl);
				$expandPanel.css('display','none');
				$btn.parent().append($expandPanel);
			}else{
				$expandPanel = $btn.parent().find('.sp-exp-list');
				$expandPanel.empty();
			}
			
			for(var k=0;k<$btn.data('sp-attr').items.length;k++){
				var childItem = $btn.data('sp-attr').items[k];
				itemVals.push(childItem.itemValue);
				
				var childItemObj = $.extend({}, $btn.data('sp-attr'), {
					itemName : childItem.itemName,
					itemValue : childItem.itemValue,
					numFound:childItem.numFound
				});
				var $childBtn = $(templateUtil.getStr(self.options.optBtnTpl,childItemObj));
				var childBtnData = $.extend({}, $btn.data('sp-attr'), {
					itemValue : childItem.itemValue,
					itemName : childItem.itemName,
					numFound:childItem.numFound,
					items:[],
					hasLeaf:false
				});
				$childBtn.data('sp-attr',childBtnData);
				$childBtn.click(function() {
					self.btnClick($(this));
				});
				$expandPanel.append($childBtn);
			}
			
			if($btn.data('sp-attr').items.length>1){
				self.prependAllBtn($expandPanel,$btn.data('sp-attr'),itemVals);
			}
			
			//ȥ��������ť��ѡ��״̬
			$btn.parent().find('button').each(function(){
				if($btn.html()!=$(this).html())
					self.noSelectBtn($(this));
			});
			self.selectBtn($btn);
			$expandPanel.show();
			
			var pos = $btn.position();
			
//			var panelWidth = $expandPanel.find('button').length * 58;
			var btnWidth = $btn.width();
			var panelWidth = $expandPanel.width();
			var screenWidth = $('body').width();
			var left,top=pos.top;
			left = pos.left-panelWidth/2+btnWidth/2;
			if(left<3)
				left = 3;
			else if(left+panelWidth > screenWidth)
				left = screenWidth - panelWidth-3;
			
			var offset = {left:left,top:top+28};
			$expandPanel.offset(offset);
			
			$expandPanel.hover(function(evt) {
				self.enterExpandPanel($btn);
			}, function(evt) {
				self.leaveExpandPanel($btn);
			});
		},
		
		hideExpandPanel:function($btn){
			var self = this;
			$btn.parent().find('.sp-exp-list').hide('fast');
			self.noSelectBtn($btn);
		},
		
		enterBtn : function($btn){
//			$btn.attr('hoverState','in');
			if ($btn.parent().timeout) clearTimeout($btn.parent().timeout);
			$btn.parent().attr('hoverState','in');
			this.showExpandPanel($btn);
		},
		
		leaveBtn : function($btn){
			var self = this,hideDelay= 230;
			if ($btn.parent().timeout) clearTimeout($btn.parent().timeout);
//			$btn.attr('hoverState','out');
			$btn.parent().attr('hoverState','out');
			$btn.parent().timeout = setTimeout(function() {
		        if ($btn.parent().attr('hoverState') == 'out') 
		        	self.hideExpandPanel($btn);
		      }, hideDelay);
		},
		
		enterExpandPanel : function($btn){
			if ($btn.parent().timeout) clearTimeout($btn.parent().timeout);
			$btn.parent().attr('hoverState','in');
		},
		
		leaveExpandPanel : function($btn){
			var self = this,hideDelay= 150;
			if ($btn.parent().timeout) clearTimeout($btn.parent().timeout);
			$btn.parent().attr('hoverState','out');
			$btn.parent().timeout = setTimeout(function() {
		        if ($btn.parent().attr('hoverState') == 'out') 
		        	self.hideExpandPanel($btn);
		      }, hideDelay);
		},
		
		searchByPage : function(){
			var self=this,funcName=arguments[0],searchParams=arguments[1];
			self.triggerEvent("searchPageStart");
			self.getSearchDatas(searchParams,onDataSucc);
			function onDataSucc(datas){
				self.datas=datas;
				self.triggerEvent("searchPageComplete");
			}
		},
		
		//���ⲿ���ã����ӣ�$('#searchPanelDiv').searchPanel('search',{sCont:'*'}); 
		search : function(){
			var self = this,qryData;
			var funcName=arguments[0],searchParams=arguments[1],isKeep=arguments[2],selectedInfo=arguments[3];
			if(isKeep){
				this.resetChangedPanel();
				self.options.queryData = searchParams;
				qryData = searchParams;
//				self.selectType = 'multi';
			}else if(searchParams){
				this.resetChangedPanel();
				self.options.queryData = {sCont:searchParams.sCont?searchParams.sCont:'*'};
				qryData = searchParams;
//				self.selectType = 'multi';
			}else{
				qryData = this.getQueryData();
			}
			if(selectedInfo){
				//TODO �������б������ʱ����bug������������б��ʱ����Ҫ��selectInfoҲ����
//				self.options.queryData = {sCont:searchParams.sCont?searchParams.sCont:'*'};
				//������ѡ��Ŀ CLASS_ID:{value:[591,571],label:['����','�㽭'],title:''}
				for(var pId in selectedInfo){
					var itemName,tip=false;
					if(selectedInfo[pId].label.length > 15){
						itemName = selectedInfo[pId].label.substr(0,15) + '...';
						tip = true;
					}
					else{
						itemName = selectedInfo[pId].label;
					}
					var itemObj = {
							panelId : pId,
							panelName : selectedInfo[pId].title,
							itemValue : selectedInfo[pId].value,
							itemName : itemName
						};
					this.options.panelState[pId]=CHANGED_NAME;
					
					var $changedBtn = $(templateUtil.getStr(this.options.changedBtnTpl,itemObj));
					if(tip){
						$changedBtn.attr('data-toggle','tooltip');
						$changedBtn.attr('data-placement','top');
						$changedBtn.attr('title',selectedInfo[pId].label);
					}
					this.$element.find('.sp-changed-inner').prepend($changedBtn);
					$("[data-toggle='tooltip']").tooltip();
					
					var attr = {
							panelId:pId,
							itemName:selectedInfo[pId].label,
							numFound:null,
							panelName:selectedInfo[pId].title,
							itemValue:selectedInfo[pId].value,
							hasLeaf:false
					}
					$changedBtn.data('sp-attr',attr);
					
					$changedBtn.click(function(e){
						var width = $(this).width();
						if(e.offsetX>width-5 && e.offsetX<(width+15)){
							//��Լ��X�ַ�Χ��
							self.removeChangedItem($(this));
							self.triggerEvent();
							self.search();
						}
					});
					self.triggerEvent();
				}
			}

			self.triggerEvent("searchStart");
			self.getSearchDatas(qryData,onDataSucc);
			
			function onDataSucc(datas){
				self.datas=datas;
				self.options.panels=self.datas.panels;
				
				self.initPanelsState(searchParams); //ֻ���ñ��δ����ѯ������Ĭ�ϲ�ѯ����������
				self.initPanels();
				//�ж�����Ƕ�ѡ��Ҳ�����ָ�
				self.selectType = 'single';
				for(var o in searchParams){
					if(jQuery.isArray(searchParams[o]) && searchParams[o].length > 1){
						self.selectType = 'multi';
						break;
					}
				}
				if(!isKeep && self.selectType != 'multi'){
					//������ִ�������Ͳ���Ҫ�ָ���ѡ��Ŀ�����ⲿ����ʱ�����˴������б�����������������Ҫ�ָ���ѡ��Ŀ
					self.restoreSelectedItem(searchParams);
					self.highlightChanged();
				}
				self.triggerEvent("searchComplete");
			}
		},
		
		highlightChanged : function(){
			var self=this,$changedBtns = this.$element.find('.sp-changed-inner > button');
			$changedBtns.each(function(i){
				var attr = $(this).data('sp-attr');
				if(attr){
					var $panelInner = self.$element.find('#'+attr.panelId+'-panel-inner');
					$panelInner.find('button').each(function(i){
						if(attr.btnType && $(this).data('sp-attr').btnType==attr.btnType){
							self.selectBtn($(this));
						}else if($(this).data('sp-attr').itemValue==attr.itemValue){
							self.selectBtn($(this));
						}
					});
				}
			});
		},
		
		getQueryData : function(){
			var $changedBtns = this.$element.find('.sp-changed-inner > button');
			var params={};
			$changedBtns.each(function(i){
				var attr = $(this).data('sp-attr');
				if(attr){
					var iv;
					if(typeof attr.itemValue == 'string')
						iv = attr.itemValue.split(',');
					else
						iv = attr.itemValue;
					if(params[attr.panelId]){

						$.merge(params[attr.panelId],iv);
						$.unique(params[attr.panelId]);//TODO ���غ������ظ�,��Ҫ����
					}
					else
						params[attr.panelId] = iv;
				}
			}); 
			//��֤��ʲô������û�е�����¿�������Ĭ������
			return $.extend({},$.fn.searchPanel.defaults.queryData,params,this.options.queryData);
		},
		
		prependAllBtn : function($panel,btnData,itemVals){
			var self = this;
			var allItemObj = $.extend({}, btnData, {
					itemName : 'ȫ��',
					itemValue : itemVals.join(',')
				});
			var $allBtn = $(templateUtil.getStr(self.options.optBtnTpl,allItemObj));
			$allBtn.click(function(){
				self.btnClick($(this));
			});
			var allBtnData = $.extend({}, allItemObj, {
				itemName:'ȫ��-'+btnData.itemName,
				items:[],
				hasLeaf:false,
				btnType:BTN_TYPE_ALL
			});
			$allBtn.data('sp-attr',allBtnData);
			$panel.prepend($allBtn);
		},
		
		resetChangedPanel : function(){
			var self=this,$changedBtns = this.$element.find('.sp-changed-inner > button[panelId]');
			$changedBtns.each(function(){
				self.removeChangedItem($(this));
			});
		},
		
		resetAll : function(){
			this.resetChangedPanel();
			//�п��ܴ����洫��Ĳ�����removeChangedItem������û�б�PanelState������������ٴ����
			this.options.panelState={};
			this.search();
		},
		
		showSavePane : function(){
			var self=this,$savePanel;
			var SEARCH_KEY = '�����ؼ���';
			if(!this.$element.is('.sp-save-panel')){
				$savePanel = $(this.options.savePanelTpl);
				this.$element.append($savePanel);
			}else{
				$savePanel = this.$element.find('.sp-save-panel');
				$savePanel.find('.sp-save-body').empty();
			}
			var sCont = this.options.queryData.sCont;
			if(sCont){
				addSaveItem(SEARCH_KEY,sCont);
			}
			var $changedBtns = this.$element.find('.sp-changed-inner > button[panelId]');
			$changedBtns.each(function(i){
				var panelName = $(this).data('sp-attr').panelName;
				var panelCont = $(this).data('sp-attr').itemName;
				addSaveItem(panelName, panelCont);
			});
			var $saveNameItem = $(this.options.saveNameItemTpl);
			var now=new Date();
			var saveName = '���б�_'+(now.getMonth()+1)+now.getDate();
			$savePanel.find('.sp-save-body').append($saveNameItem);
			$saveNameItem.find('input').val(saveName);
			var $saveBtn =  $savePanel.find('.sp-save-foot > button').eq(0);
			$saveBtn.click(function() {
				$saveBtn.attr({"disabled":"disabled"});
				var params = self.getQueryData();
				var typeName = $saveNameItem.find('input').val();
				var viewType = self.options.viewType;
				$.post(ACTION_URL + '?method=saveQueryList', {
					typeName : typeName,
					condValue : JSON.stringify(params),
					viewType : viewType
				}, function(data) {
					if(data.result=="success"){
						alert('����ɹ���');
						self.triggerEvent("saveSuccess");
					}
					else{
						alert('����ʧ�ܣ����Ʋ��ܳ���25���ַ���');
						self.triggerEvent("saveFail");
					}
					$saveBtn.removeAttr("disabled");
					$("#flat_modal_overlay").fadeOut(200);
					$savePanel.hide();
				}, "json");
			});
			var $closeBtn = $savePanel.find('.sp-save-foot > button').eq(1);
			$savePanel.flatModal({closeButton:$closeBtn});
			
			function addSaveItem(panelName,panelCont){
				var saveItemObj ={panelName:panelName,panelCont:panelCont};
				var $saveItem = $(templateUtil.getStr(self.options.saveItemTpl,saveItemObj));
				$savePanel.find('.sp-save-body').append($saveItem);
			}
		},
		
		hideSavePanel : function(){
			
		},
		
		togglePanel : function(){
			if(this.$panelList.is(":hidden")){
				this.$panelList.slideDown(200);
				this.$element.find('button.sp-hide-btn').text('����ɸѡ');
			}else{
				this.$panelList.slideUp(200);
				this.$element.find('button.sp-hide-btn').text('��ʾɸѡ');
			}
		},
		
		initPanelsState : function(queryData){
			if(!this.options.panelState) this.options.panelState={};
			for(var o in queryData){
				for(var p in this.options.panels){
					if(o==this.options.panels[p].panelId){
						this.options.panelState[o] = CHANGED_NAME;
					}
				}
			}
		},
		
		restoreSelectedItem : function(queryData){
			var self = this;
			for(var o in queryData){
				var panelId = o;
				var $buttons = this.$element.find('#'+panelId+'-panel-inner > button');
				
				if(queryData[o] instanceof Array
						&& queryData[o].length == $buttons.length-1){
					var strData = queryData[o].join(',');
					if(isExist($buttons,strData))
						continue;
				}
				
				$buttons.each(function(){
					var btnData = $(this).data('sp-attr');
					if(queryData[o] instanceof Array){
						for(var i=0;i<queryData[o].length;i++){
							if(queryData[o][i]==btnData.itemValue)
								self.addChangedItem(btnData);
						}
					}else{
						if(queryData[o]==btnData.itemValue){
							self.addChangedItem(btnData);
						}
					}
				});
			}
			
			function isExist($buttons,data){
				var exist = false;
				$buttons.each(function(){
					var btnData = $(this).data('sp-attr');
					if(data==btnData.itemValue){
						self.addChangedItem(btnData);
						exist=true;
						
					}
				});
				return exist;
			}
		},
		
		getUrlQueryStr : function(){
			//TODO ��ɴ�URLȡ��QueryData����
		},
		
		disable:function(){
			if(this.$panelList){
				this.$panelList.slideUp(200);
				this.$element.find('button.sp-hide-btn').text('��ʾɸѡ');
				this.$element.find('button.sp-hide-btn').attr('disabled','disabled');
				this.resetChangedPanel();
			}
		},
		
		enable : function(){
			if(this.$panelList){
				this.$panelList.slideDown(200);
				this.$element.find('button.sp-hide-btn').text('����ɸѡ');
				this.$element.find('button.sp-hide-btn').removeAttr("disabled");
			}
		},
		
		setShowLoading :function(){
			var self=this,state;
			if(arguments.length==1)
				state=arguments[0];
			else
				state=arguments[1];
			if(state){
				this.options.isShowLoading=true;
			}else{
				this.options.isShowLoading=false;
			}
		},
		
		showLoading : function(){
			if(this.options.isShowLoading)
				this.$element.showLoading();
		},
		
		hideLoading:function(){
			this.$element.hideLoading();
		}
		,getDatas:function(){
			return this.datas;
		}
	};
	
	$.fn.searchPanel.Constructor = SearchPanel;

	$.fn.searchPanel.defaults = {
		selectedCss : 'btn-primary',
		noSelectCss : 'btn-link',
		panelTpl:'<div class="sp-changed-panel">'
				+'	<div style="float:left;line-height:30px;position��absolute;font-weight: bold;">��ѡ��������</div>'
				+'	<div class="sp-changed-inner">'
				+'		&nbsp;<button type="button" class="btn btn-sm btn-default sp-reset"><i class="fa fa-repeat">&nbsp;</i>����</button>'
				+'		<button type="button" class="btn btn-sm btn-default sp-save"><i class="fa fa-save">&nbsp;</i>����</button>'
				+'	</div>'
				+'	<div class="tools">'
				+'		<button type="button" class="btn btn-info btn-sm sp-hide-btn">����ɸѡ</button>'
				+'	</div><div style="clear:both"></div>'
				+'</div>'
				+'<div class="sp-panel-list"><strong>��ѡ������</strong></div>',
		panelItemTpl : '<div class="div_param_list_panel" panelId="{panelId}">'
				+ '<span>{panelName}��</span>'
				+ '<span id="{panelId}-panel-inner"></span>'
				+ '</div>',
		expandPanelTpl:'<div class="sp-exp-list"></div>',
		optBtnTpl:'<button type="button" panelId="{panelId}" class="btn btn-link btn-sm margin-1px">{itemName}<span style="color:#ff5c33">[{numFound}]</span></button>',
		allBtnTpl:'<button type="button" panelId="{panelId}" class="btn btn-link btn-sm margin-1px">{itemName}</button>',
		changedBtnTpl:'<button type="button" class="btn btn-default btn-sm margin-1px"  panelId="{panelId}">'
					+ '{panelName}��<span style="color:red">{itemName}</span><span class="btnClose">X</span></button>',
		savePanelTpl:'<div class="sp-save-panel">'
					+'	<div class="sp-save-title">���������б�</div>'
					+'	<div style="font-size:14px;background-color:#fff;padding-top:10px;padding-left:10px;">��Ҫ�����������ݵ������б�</div>'
					+'	<div class="sp-save-body"></div>'
					+'	<div class="sp-save-foot"><button class="btn btn-info btn-sm"><i class="fa fa-save">&nbsp;</i>�� �� </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class="btn btn-default btn-sm"><i class="fa fa-close">&nbsp;</i> ȡ �� </button></div>'
					+'</div>',
		saveItemTpl:'<div style="height:30px;"><div style="float:left;height:30px;">{panelName}��</div><div style="position:absolute;margin-left:80px;height:30px;width:385px;float:left;">{panelCont}</div></div>',
		saveNameItemTpl:'<div style="height:70px;margin-top:10px;"><div style="float:left;height:30px;font-size:14px;">��Ϊ�����������б�������</div><div style="margin-left:10px;margin-right:10px;padding-top:40px;"><input class="form-control input-sm" type="text"></input></div></div>',
		blankContTpl: '<div>�������Ϊ�գ�</div>',
		queryData:{sCont:'*'},
		isShowLoading:true,
		viewType:0 //IS_BUSI_CI 0����ҵ��ϵͳ��1��ҵ��ϵͳ��-1��������
	};
})(jQuery);

