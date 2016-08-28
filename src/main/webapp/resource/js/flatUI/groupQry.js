(function($){
	$import("util.js", "groupQry.js");
	var PLUG_NAME = "GROUP_QUERY_CTRL"; //筛选查询控件
	
	function GroupQuery(obj,options){
		var ACTION_URL = '/servlet/groupQueryAction.do';
		var compCfg = {time:'time_button',flatOpt:'flat_button',linkOpt:'link_button'};
		var selectedCss='btn-primary',noSelectCss='btn-link';
		var panelTpl,itemTpl,optBtnTpl,changedBtnTpl,ciSelect;
		
//		$('body').showLoading();
		var _self = obj;
		var _toolbarCfg = null,_toolbarId = null;
		
		this.options = getOptions(options);
		
		panelTpl = this.options.panelTpl;
		itemTpl = this.options.itemTpl;
		optBtnTpl = this.options.optBtnTpl;
		ciSelect = this.options.ciSelect;
		changedBtnTpl = this.options.changedBtnTpl;
		
		this.initGroupQuery = function(){
			//_toolbarCfg = getToolbarCfg(this.options.cfgId);
			_toolbarId = _toolbarCfg.pageCode;
			var panels = _toolbarCfg.panelCfgList;
			//创建空面板
			createBlankPanel(_toolbarId,_self);
			for(var i=0;i<panels.length;i++){
				var panel = panels[i];
				var panelCode = panel.panelCode;
				var panelName = panel.panelName;
				var isMultiple = panel.multiple;
				var compName = panel.compName;
				createItemPanel(_toolbarId, panelCode, panelName,isMultiple);
				
				for(var j=0;j<panel.panelFields.length;j++){
					var field = panel.panelFields[j];
					var obj = {
						compName:compName,
						panelName:panelName,
						panelCode:panelCode
					};
					var newField = jQuery.extend({},obj,field);
					createOption(panelCode+'-item', newField);
					//unlimited
				}
			}
			$(_self).trigger("ready", _self);
		}
		
		function setChangedItem(p){
			var item = getChangedItem(p.panelCode,p.ctrlId);
			if(getChangeStat(p.panelCode,p.ctrlId)) {
				closeChangedItem(item);
				$(_self).trigger("change", _self);
				return;
			}
			var changedBtn = templateUtil.getStr(changedBtnTpl,p);
			$('#'+getChangedPanelId()).append(changedBtn);
			$("#"+getChangedPanelId()+ " > button").click(function(e){
				var width = $(this).width();
				if(e.offsetX>width-5 && e.offsetX<(width+15)){
					//大约在X字范围内
					closeChangedItem($(this));
					$(_self).trigger("change", _self);
				}
			});
//				var val = $("button[panelName='haha']").attr("panelCode");
			$(_self).trigger("change", _self);
		}
		
		function getChangedItem(panelVal,ctrlId){
			var changeCtrlId = 'change_'+ctrlId;
			var jqChangPanel = $('#'+getChangedPanelId());
			var item = jqChangPanel.find('[ctrl_id='+changeCtrlId+']');
//			var exp = '#spanChanged > button[panelCode='+panelVal+'][ctrl_id='+changeCtrlId+']';
//			var item =$(exp);
			return item;
		}
		
		this.clearChangedItem = function(){
			//清空已选项目
			var $selectedBtns = $("#"+getChangedPanelId()+" > button");
			$selectedBtns.each(function(){
				closeChangedItem($(this));
			});
			
			$('#'+_toolbarId+'-panel').find('button.'+selectedCss).each(function(){
				$(this).removeClass(selectedCss);
				$(this).addClass(noSelectCss);
			});
		};
		
		this.togglePanel = function(){
			if($('#'+_toolbarId+'-panel').is(':hidden')){
				$('#'+_toolbarId+'-panel').show('normal');
			}else{
				$('#'+_toolbarId+'-panel').hide('slow');
			}
		};
		
		function closeChangedItem(jqBtn){
			var pv=jqBtn.attr("panelCode"),iv=jqBtn.attr("itemValue"),ctrlId=jqBtn.attr("ctrl_id");
			jqBtn.remove();
			ctrlId = ctrlId.replace('change_','');
			var jqObj = $('button[ctrl_id='+ctrlId+']');
			if(jqObj.length==0)
				jqObj = $('.p_link_list > button[ctrl_id='+ctrlId+']');
			jqObj.removeClass(selectedCss);
			jqObj.addClass(noSelectCss);
//			$('#spanChanged').trigger("change", this);
		}
		
		function getChangeStat(panelCode,ctrlId){
			var jqObj = getChangedItem(panelCode,ctrlId);
			if(jqObj.length>0)
				return true;
			else
				return false;
		}
		
		function createOption(elementName,p){
			p = jQuery.extend({},{unlimited:'false'}, p);
			var jqPanel=$('#'+elementName),optBtn = templateUtil.getStr(optBtnTpl,p);
			jqPanel.prepend(optBtn);
			$('#'+elementName+' > button:first-child').click(function(e){
				if(p.compName==compCfg.linkOpt)
					linkBtnClick($(this), elementName, p);
				else if(p.compName==compCfg.time)
					timeBtnClick($(this), elementName, p);
				else
					flatBtnClick($(this),elementName,p);
			});
			if($('#'+elementName+' > button:first-child').attr('itemValue')=='cust' && p.compName==compCfg.time){
				showCustTimeOpt($('#'+elementName+' > button:first-child'),p);
			}
			if($('#'+elementName+' > button:first-child').attr('itemValue')=='custMill' && p.compName==compCfg.time){
                showMillTimeOpt($('#'+elementName+' > button:first-child'),p);
            }
		}
		
		function createCiSelect(elementName,p){
			var $panel=$('#'+elementName),optBtn = templateUtil.getStr(ciSelect,p);
		}
		
		function btnClick(srcElement,elementName,p){
			var jqSrcEle = $(srcElement),jqPanel=$('#'+elementName);
			if(getChangeStat(elementName,p.ctrlId)){
				//已选 => 未选
//				console.log("已选 => 未选");
				//取消全选按钮
				var $selectAllBtn = jqPanel.find('.p_link_list > button[itemType="SELECT_ALL"]');
				if($selectAllBtn.length > 0){
					$selectAllBtn.removeClass(selectedCss);
					$selectAllBtn.addClass(noSelectCss);
				}
				
				jqSrcEle.removeClass(selectedCss);
				jqSrcEle.addClass(noSelectCss);
			}else{
				//未选 => 已选
//				console.log("未选 => 已选");
				jqSrcEle.removeClass(noSelectCss);
				jqSrcEle.addClass(selectedCss);
				if(jqSrcEle.attr('unlimited')=='true' || jqPanel.attr('isMultiple')!='0BT'){
//					console.log("单选或者不限按钮，取消其他按钮");
					//单选或者不限按钮，取消其他按钮
					$('#'+getChangedPanelId()+' > button[panelCode='+p.panelCode+'][unlimited!=true]').each(function(i){
						closeChangedItem($(this));
//						$('#spanChanged').trigger("change", me);
					});
					
				}else{
//					console.log("不是不限按钮，取消不限按钮");
					//不是不限按钮，取消不限按钮
					if(jqSrcEle.parent().find('button[unlimited=true]').length>0){
						var unlimitedCtrlId = 'change_'+jqSrcEle.parent().find('button[unlimited=true]').attr('ctrl_id');
						if(unlimitedCtrlId){
							var jqChangeItem = $('#'+getChangedPanelId()+' > button[panelCode='+p.panelCode+'][ctrl_id='+unlimitedCtrlId+']');
							if(jqChangeItem.length>0){
								closeChangedItem(jqChangeItem);
//								$('#spanChanged').trigger("change", me);
							}
						}
					}
				}
			}
		}
		function flatBtnClick(srcElement,elementName,p){
			btnClick(srcElement,elementName,p);
			setChangedItem(p);
		}
		function linkBtnClick(srcElement,elementName,p){
			var jqSrcEle = $(srcElement);
//			if(getChangeStat(elementName,p.ctrlId)){
			if(jqSrcEle.hasClass(selectedCss)){
				//已选 => 未选
				jqSrcEle.removeClass(selectedCss);
				jqSrcEle.addClass(noSelectCss);
				removeLinkOption(elementName);
			}else{
				//未选 => 已选
				$('#'+elementName+' > button[panelCode='+p.panelCode+']').each(function(i){
//					closeChangedItem($(this));
					$(this).removeClass(selectedCss);
					$(this).addClass(noSelectCss);
				});
				jqSrcEle.removeClass(noSelectCss);
				jqSrcEle.addClass(selectedCss);
				if(jqSrcEle.attr('unlimited')!='true'){
					showLinkOption(elementName, p);
				}else{
					//不限
					$('#'+getChangedPanelId()+' > button[panelCode='+p.panelCode+'][itemValue!=""]').each(function(i){
						closeChangedItem($(this));
						$(_self).trigger("change", _self);
						//trigger event
					});
					removeLinkOption(elementName);
				}
			}
		}
		function timeBtnClick(srcElement,elementName,p){
			var jqSrcEle = $(srcElement),
				jqPanel=$('#'+elementName),
				changeItem = getChangedItem(p.panelCode,p.ctrlId);
			if(jqSrcEle.attr('itemValue')=='cust'||jqSrcEle.attr('itemValue')=='custMill'){
				btnClick(srcElement,elementName,p);
				
				if(getChangeStat(p.panelCode,p.ctrlId)) {
					closeChangedItem(changeItem);
					//TODO 先屏蔽
					//$(_self).trigger("change", _self);
					//trigger event  fixbug
					//这里是个bug，需要在选择新的时间以后再关闭原来的时间
					return;
				}else{
					jqSrcEle.popover('show');
				}
				//showCustTimeOpt(jqSrcEle,p);
			}else{
				flatBtnClick(srcElement, elementName, p);
			}
		}
		
		
		function showLinkOption(elementName,p){
			var jqPanel=$('#'+elementName);
			var linkData = p.linkDatas;
			removeLinkOption(elementName);
			if(linkData.length>0)
				jqPanel.find('.p_link_list').show();
			for(var i=0;i<linkData.length;i++){
				var cp = {
						panelName : p.panelName,
						panelCode : p.panelCode,
						itemName : linkData[i].itemName,
						itemValue : linkData[i].itemValue,
						ctrlId 	: linkData[i].ctrlId,
						itemType : linkData[i].itemType
				};
				var optBtn = templateUtil.getStr(optBtnTpl,cp);
				jqPanel.find('.p_link_list').prepend(optBtn);
				jqPanel.find('.p_link_list > button:first-child').click(function(e){
					var jqSrc = $(this);
					if(jqSrc.attr("itemType")=="SELECT_ALL"){
						if(jqSrc.hasClass(selectedCss)){
							jqSrc.removeClass(selectedCss);
							jqSrc.addClass(noSelectCss);
							jqPanel.find('.p_link_list > button[itemType!="SELECT_ALL"]').each(function(i){
								var jqSrcEle = $(this);
								var changeItem = getChangedItem(p.panelCode,jqSrcEle.attr('ctrl_id'));
								if(changeItem.length>0)
									closeChangedItem(changeItem);
							});
						}else{
							jqSrc.removeClass(noSelectCss);
							jqSrc.addClass(selectedCss);
							jqPanel.find('.p_link_list > button[itemType!="SELECT_ALL"]').each(function(i){
								var jqSrcEle = $(this);
								jqSrcEle.removeClass(noSelectCss);
								jqSrcEle.addClass(selectedCss);
								
								if(getChangeStat(p.panelCode,jqSrcEle.attr('ctrl_id'))) {
									return;
								}
								var changedBtn = templateUtil.getStr(changedBtnTpl,{
														panelName : p.panelName,
														panelCode : p.panelCode,
														itemName : jqSrcEle.text(),
														itemValue : jqSrcEle.attr('itemValue'),
														ctrlId : jqSrcEle.attr('ctrl_id')}
												);
								$('#'+getChangedPanelId()).append(changedBtn);
								$("#"+getChangedPanelId()+" > button").click(function(e){
									var width = $(this).width();
									if(e.offsetX>width && e.offsetX<(width+15)){
										//大约在X字范围内
										closeChangedItem($(this));
										$(_self).trigger("change", _self);
									}
								});
							});
						}

						$(_self).trigger("change", _self);
					}else{
						flatBtnClick($(this),elementName,{
							panelName : p.panelName,
							panelCode : p.panelCode,
							itemName : jqSrc.text(),
							itemValue : jqSrc.attr('itemValue'),
							ctrlId : jqSrc.attr('ctrl_id')
						});
					}
				});
			}
			//选中已选择的按钮
			$('#'+getChangedPanelId()+' > button[panelCode='+p.panelCode+'][itemValue!=""]').each(function(i){
				var itemVal = $(this).attr("itemValue");
				var jqBtn = jqPanel.find('.p_link_list > button[itemValue="'+itemVal+'"]');
				jqBtn.removeClass(noSelectCss);
				jqBtn.addClass(selectedCss);
			});
			
			var noSelectItem = jqPanel.find('.p_link_list > button.'+noSelectCss);
			if(noSelectItem.length==1){
				if(noSelectItem.attr("itemType")=="SELECT_ALL"){
					noSelectItem.removeClass(noSelectCss);
					noSelectItem.addClass(selectedCss);
				}
			}
			
			var b = jqPanel.find('.p_link_list > button.'+selectedCss);
		}
		function removeLinkOption(elementName){
			var jqPanel=$('#'+elementName);
			jqPanel.find('.p_link_list').children().each(function(i){
				$(this).remove();
			});
			jqPanel.find('.p_link_list').hide();
		}
		function showCustTimeOpt(jqBtn,p){
			var ctrlId = jqBtn.attr("ctrl_id"),
				sPickerName=ctrlId+'-'+'stimepicker',
				ePickerName=ctrlId+'-'+'etimepicker',
				btnSelectName=ctrlId+'-'+'confirmpicker',
				btnCancelName=ctrlId+'-'+'cancelpicker';
			var timerInputTpl = '<form class="form-inline" role="form" style="width:210px"><div class="form-group">'
								+'<label style="margin-top:3px;" class=" control-label">开始时间</label>'
								+'<div class="input-group transparent clockpicker ">'
								+'<input style="cursor:pointer" readOnly="true" id="{startTime}" class="form-control input-sm" type="text" placeholder="选择开始时间">'
								+'<span class="input-group-addon">'
								+'<i class="fa fa-clock-o"></i>'
								+'</span>'
								+'</div>'
								+'<label style="margin-top:3px;" class="control-label">结束时间</label>'
								+'<div class="input-group transparent clockpicker ">'
								+'<input style="cursor:pointer" readOnly="true" id="{endTime}" class="form-control input-sm" type="text" placeholder="选择结束时间">'
								+'<span class="input-group-addon">'
								+'<i class="fa fa-clock-o"></i>'
								+'</span>'
								+'</div>' 
								+'<button id="{btnSelectTime}" style="margin-top:3px;" class="btn btn-white btn-xs btn-mini" type="button">确定</button>&nbsp;'
								+'<button id="{btnCancel}" style="margin-top:3px;" class="btn btn-white btn-xs btn-mini" type="button">取消</button>'
								+'</div></form>';
			var timerInput = templateUtil.getStr(timerInputTpl,
					{startTime:sPickerName,endTime:ePickerName,btnSelectTime:btnSelectName,btnCancel:btnCancelName});
			jqBtn.popover({
			    html: true,
			    trigger: 'manual',
			    animation : false,
			    placement:'bottom',
			    title:'自定义时间',
			    content: '<div style="width:210px">'+timerInput+'</div>'
			});
			jqBtn.on('shown.bs.popover',function(e){
				var targetBtn = e.currentTarget;
//				if(getChangeStat(p.panelCode,p.ctrlId)){
//					jqBtn.popover('hide');
//					return;
//				}
				createTimePicker($('#'+sPickerName));
				createTimePicker($('#'+ePickerName));
				$('#'+btnSelectName).click(function(){
					var s=$('#'+sPickerName);
					var e=$('#'+ePickerName);
					var itemVal,itemValTpl = '{st:\'{sTime}\',et:\'{eTime}\'}';
					var itemName,itemNameTpl = "{sTime} ~ {eTime}";
					if(s.val() && e.val()){
						itemVal = templateUtil.getStr(itemValTpl,{sTime:s.val(),eTime:e.val()});
						itemName = templateUtil.getStr(itemNameTpl,{sTime:s.val(),eTime:e.val()});
						var timeParam = jQuery.extend({},p,{itemValue:itemVal,itemName:itemName,itemType:"CUST_TIME"});
						setChangedItem(timeParam);
						jqBtn.popover('hide');
					}
					else{
						alert('请先选择时间！');
					}
//					this.setChangedItem(p);
				});
				$('#'+btnCancelName).click(function(){
					jqBtn.removeClass(selectedCss);
					jqBtn.addClass(noSelectCss);
					jqBtn.popover('hide');
				});
			});
			//jqBtn.popover('show');
		}
		
		function showMillTimeOpt(jqBtn,p){
            var ctrlId = jqBtn.attr("ctrl_id"),
                sPickerName=ctrlId+'-'+'stimepicker',
                ePickerName=ctrlId+'-'+'etimepicker',
                btnSelectName=ctrlId+'-'+'confirmpicker',
                btnCancelName=ctrlId+'-'+'cancelpicker';
            var timerInputTpl = '<form class="form-inline" role="form" style="width:210px"><div class="form-group">'
                                +'<label style="margin-top:3px;" class=" control-label">开始时间</label>'
                                +'<div class="input-group transparent clockpicker ">'
                                +'<input type="text" style="cursor:pointer;width:200px;height:27px;" id="'+sPickerName+'" class="Wdate" onFocus="WdatePicker({isShowClear:true,dateFmt:\'yyyy-MM-dd HH:mm:ss\'}); " />'                                
                                +'</div>'
                                +'<label style="margin-top:3px;" class="control-label">结束时间</label>'
                                +'<div class="input-group transparent clockpicker ">'
                                +'<input type="text" style="cursor:pointer;width:200px;height:27px;" id="'+ePickerName+'" class="Wdate" onFocus="WdatePicker({isShowClear:true,dateFmt:\'yyyy-MM-dd HH:mm:ss\'}); "/>'
                                +'</div>' 
                                +'<button id="'+btnSelectName+'" style="margin-top:3px;" class="btn btn-white btn-xs btn-mini" type="button">确定</button>&nbsp;'
                                +'<button id="'+btnCancelName+'" style="margin-top:3px;" class="btn btn-white btn-xs btn-mini" type="button">取消</button>'
                                +'</div></form>';
            //var timerInput = templateUtil.getStr(timerInputTpl,
            //        {startTime:sPickerName,endTime:ePickerName,btnSelectTime:btnSelectName,btnCancel:btnCancelName});
            jqBtn.popover({
                html: true,
                trigger: 'manual',
                animation : false,
                placement:'bottom',
                title:'自定义时间',
                content: '<div style="width:210px">'+timerInputTpl+'</div>'
            });
            jqBtn.on('shown.bs.popover',function(e){
                var targetBtn = e.currentTarget;
//              if(getChangeStat(p.panelCode,p.ctrlId)){
//                  jqBtn.popover('hide');
//                  return;
//              }
                //createTimePicker($('#'+sPickerName));
                //createTimePicker($('#'+ePickerName));
                $('#'+btnSelectName).click(function(){
                    var s=$('#'+sPickerName);
                    var e=$('#'+ePickerName);
                    var itemVal,itemValTpl = '{st:\'{sTime}\',et:\'{eTime}\'}';
                    var itemName,itemNameTpl = "{sTime} ~ {eTime}";
                    if(s.val() && e.val()){
                        itemVal = templateUtil.getStr(itemValTpl,{sTime:s.val(),eTime:e.val()});
                        itemName = templateUtil.getStr(itemNameTpl,{sTime:s.val(),eTime:e.val()});
                        var timeParam = jQuery.extend({},p,{itemValue:itemVal,itemName:itemName,itemType:"CUST_TIME"});
                        setChangedItem(timeParam);
                        jqBtn.popover('hide');
                    }
                    else{
                        alert('请先选择时间！');
                    }
//                  this.setChangedItem(p);
                });
                $('#'+btnCancelName).click(function(){
                    jqBtn.removeClass(selectedCss);
                    jqBtn.addClass(noSelectCss);
                    jqBtn.popover('hide');
                });
            });
            //jqBtn.popover('show');
        }
        
        
		function createTimePicker(jqObj){
			jqObj.datetimepicker({
				language:  'zh-CN',
				weekStart: 1,
				todayBtn:  1,
				autoclose: true,
				todayHighlight: 1,
				startView: 2,
				forceParse: 0,
				showMeridian: 1
			});
		}
		this.getToolbarCfg = function(cfgId){
			var self=this,dataCfg;
			$.ajax({
				url: ACTION_URL + '?method=getToolbarCfg',
				async: true,
				data: {cfgId:cfgId},
				dataType: 'json',
				success: $.proxy(onSuccess,this),
				error : function(){
					alert("载入组合查询工具栏数据失败！");
				}
			});
			
		}
		
		function onSuccess(data){
			if(!data){
				alert("载入组合查询工具栏数据失败！");
				return;
			}
			_toolbarCfg = data;
			this.initGroupQuery();
		}

		function createBlankPanel(toolbarId,renderTo){

			var panel = templateUtil.getStr(panelTpl,{toolbarId:toolbarId});
			$(renderTo).append(panel);
		}
		function createItemPanel(toolbarId,itemId,itemName,isMultiple){

			var item = templateUtil.getStr(itemTpl,{itemId:itemId,itemName:itemName,isMultiple:isMultiple});
			$('#'+toolbarId+'-list').append(item);
		}
		function getChangedPanelId(){
			return _toolbarId + '-changed';
		}
		function getPanelListId(){
			return _toolbarId + '-list';
		}
		function getOptions(options) {
			options = $.extend({}, $.fn.groupQuery.defaults, options, _self.data());
		    return options;
		}
		this.getQueryData = function(){
			function setTimeParams(itemVal){
				function fn(n){
					var currDate = new Date();
					var newDate = new Date(currDate-eval(n));
					var o = {st:newDate.toStr(),et:currDate.toStr()};
					return o;
				}
				return fn(itemVal);
			}
			var jqItems = $("#"+_toolbarId+'-changed'+" > button");
			var params = {};
			jqItems.each(function(){
				  var item = $(this);
				  var iv=item.attr("itemValue");
				  var pc=item.attr("panelCode");
				  var itemName = item.attr("itemName");
				  var itemType = item.attr("itemType");
				  var compName = item.attr("compName");
				  if(params[pc]==null){
					  if(itemType=="CUST_TIME"){
						  iv = eval("("+iv+")");
						  params[pc]=iv;
						  params[pc+'_STIME']=iv.st;
						  params[pc+'_ETIME']=iv.et;
					  }else if(compName == compCfg.time){
						  iv = setTimeParams(iv);
						  params[pc]=iv;
						  params[pc+'_STIME']=iv.st;
						  params[pc+'_ETIME']=iv.et;
					  }else {
						  if(iv!=""){
							  params[pc]=iv;
							  params[pc+'_LBL']=itemName;
						  }
					  }
				  }else{
					  var newObj={type: 'STRING', isMultiple: "0BT", value: null};
					  if((typeof params[pc] === 'object')){
						  newObj.value=params[pc].value + ',' + iv;
						  params[pc] = newObj;
					  }else{
						  newObj.value=params[pc] + ',' + iv;
						  params[pc] = newObj;
					  }
					  params[pc+'_LBL']=params[pc+'_LBL'] + '、' + itemName;
				  }
				  
				});
			return params;
		};
		this.getToolbarCfg(this.options.cfgId);
//		this.initGroupQuery();
	}
	
	$.fn.groupQuery = function(options){
		var _self = $(this).data(PLUG_NAME);
		if(_self){
			return _self;
		}else{
			var groupQry = new GroupQuery($(this),options);
			$(this).data(PLUG_NAME,groupQry);
			return groupQry;
		}
	};
	
	$.fn.groupQuery.defaults = {
		panelTpl : '<div class="grid-title no-border bottom_border" id="{toolbarId}-panel">'+
			'	<span style="">已选择条件：</span>'+
			'	<span id="{toolbarId}-changed"></span>'+
			'	<div class="tools">'+
			'		<span class="span-change">筛选</span> <a class="collapse" href="#"></a>'+
			'	</div>'+
			'</div>'+
			'<div class="grid-body no-border" id="{toolbarId}-list"></div>',
		itemTpl : '<div class="div_param_list_panel">'+
			'<span>{itemName}：</span>'+
			'<span id="{itemId}-item" isMultiple="{isMultiple}"><div class="p_link_list"></div></span>'+
			'</div>',
		optBtnTpl : '<button type="button" ctrl_id="{ctrlId}" class="btn btn-link btn-xs btn-small margin-left-1px" itemValue="{itemValue}" panelCode="{panelCode}" unlimited="{unlimited}" itemType="{itemType}">'+
			'{itemName}</button>',
		changedBtnTpl:'<button type="button" class="btn btn-white btn-xs btn-small margin-left-1px" '
				+' itemValue="{itemValue}" panelCode="{panelCode}" ctrl_id="change_{ctrlId}" itemType="{itemType}" compName="{compName}" itemName="{itemName}">'
				+'{panelName}：<span style="color:red">{itemName}</span>'
				+' <span class="btnClose">X</span></button>',
		ciSelect:'<div class="form-inline">'
				+'<input type="input" class="form-control input-sm" placeholder="选择网元">'
				+'<button class="btn btn-link btn-sm btn-small"><i class="fa fa-list-alt"></i></button>'
				+'</div>'

	};
})(jQuery);


