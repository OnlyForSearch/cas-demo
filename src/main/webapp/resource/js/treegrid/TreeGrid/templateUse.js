﻿var GlobalUse = {
	treeGrid      :  undefined,
	searhGrid     :  undefined,
	store         :  undefined,
	urlParam      :  undefined,
	searchParm    :  undefined,
	myMask        :  undefined,
	alarmRuleUrl  :  "/servlet/ruleServlet?",
	dsUrl         : "/servlet/netElementManage?"
}
Ext.LoadMask.prototype.msg = "加载数据中,请稍后...";
//只显示网元
Ext.grid.newCheckboxSelectionModel = Ext.extend(Ext.grid.CheckboxSelectionModel, {
    renderer : function(v, p, record){	
		if(record.data['_parent']==''){
			return '<div class="x-grid3-row-checker">&#160;</div>';
		}else{
			return '';
		}
    }
});
//重写单选框的设置和获取值方法
Ext.override(Ext.form.RadioGroup, {   
    getValue: function(){   
        var v;   
        if (this.rendered) {   
            this.items.each(function(item){   
                if (!item.getValue())    
                    return true;   
                v = item.getRawValue();   
                return false;   
            });   
        }   
        else {   
            for (var k in this.items) {   
                if (this.items[k].checked) {   
                    v = this.items[k].inputValue;   
                    break;   
                }   
            }   
        }   
        return v;   
    },   
    setValue: function(v){   
        if (this.rendered)    
            this.items.each(function(item){   
                item.setValue(item.getRawValue() == v);   
            });   
        else {   
            for (var k in this.items) {   
                this.items[k].checked = this.items[k].inputValue == v;   
            }   
        }   
    }   
});  

var Controller = function(){
	function createGrid(){
	    GlobalUse.myMask = new Ext.LoadMask(Ext.getBody(), {msg:Ext.LoadMask.prototype.msg});
	    GlobalUse.myMask.show();
	    
	    var sys = $getSysVar("ALARM_RULE_URL_PARAM_CONFIG");
		if(!sys){
			Ext.Msg.alert('系统提示', "对不起，您没有配置告警规则URL参数！");
			return false;
		}
		var params = sys.split(",");
		var map = {};
		for (var i = 0; i < params.length; i++) {
			var param = params[i].split("=");
			map[param[0]] = param[1];
		}
		
		commonGlobal.ruleInfo.resultHistory = map.resultHistory;
		commonGlobal.ruleInfo.viewId = commonGlobal.ruleInfo.view_id  = map.viewId;
	    // create the data store		
	   	var record = Ext.data.Record.create([
	   		{name: 'neName'},
	   		{name: 'type'},
	   		{name: 'area',type:'string'},
	   		{name: 'business',type:'string'},
	     	{name: 'fromTemplate'},
	     	{name: 'isclash'},
	     	{name: 'control'},
	     	{name: 'ne_item_id'},	     	
	     	{name: '_id', type: 'int'},
	     	{name: '_parent', type: 'int'},     	
	     	{name: '_level', type: 'int'},
	     	//{name: '_lft', type: 'int'},
	     	//{name: '_rgt', type: 'int'},
	     	{name: '_is_leaf', type: 'bool'},
	     	{name: 'isNe'},
	     	{name: 'rule_id'}     	
	   	]);
	    
	    GlobalUse.urlParam = window.dialogArguments;        
	    //GlobalUse.urlParam = {NE_TYPE_ID:100105,TEMPLATE_ID:1585,ruleType:8};
	    var sendUrl = GlobalUse.alarmRuleUrl + 'tag=45&NE_TYPE_ID=' + 
			GlobalUse.urlParam.TEMPLATE_NE_TYPE_ID + "&TEMPLATE_ID="+GlobalUse.urlParam.TEMPLATE_ID+ "&RULE_TYPE_ID="+GlobalUse.urlParam.ruleType;	    
	    //var store = new Ext.ux.maximgb.treegrid.NestedSetStore({
	    GlobalUse.store = new Ext.ux.maximgb.tg.AdjacencyListStore({
	    	autoLoad : true,
	    	reader: new Ext.data.JsonReader({id: '_id'}, record),
			//proxy: new Ext.data.MemoryProxy(data2)
	    	proxy: new Ext.data.HttpProxy({url:sendUrl,timeout:300000})
	    });
	    // create the Grid
	    GlobalUse.treeGrid = new Ext.ux.maximgb.tg.GridPanel({
	      store: GlobalUse.store,
	      master_column_id : 'neName',
	      columns: [
	      	new Ext.grid.newCheckboxSelectionModel(),
	      	{header: "网元ID", width: 100, dataIndex: '_id', hidden:true},
	      	{header: "规则ID", width: 100, dataIndex: 'rule_id', hidden:true},
			{id:"neName",header: "名称", width: 160, dataIndex: 'neName'},
			{header: "网元类型", width: 100, dataIndex: 'type'},
			{header: "区域", width: 100, dataIndex: 'area'},
			{header: "所属业务系统", width: 100, dataIndex: 'business'},
			{header: "是否引用过该模版", width: 120, dataIndex: 'fromTemplate'},
			{header: "冲突类型", width: 100, dataIndex: 'isclash'},
	        {header: "操作", width: 150, dataIndex: 'control'}
	      ],
	      sm:new Ext.grid.newCheckboxSelectionModel({
	    	  checkOnly:true,
	    	  listeners:{
	    	      //全选时只选择网元
	    		  "beforerowselect":function(sm,rowIndex,keepExisting,record){
	    		  	  if(record.data._parent==''){
	    		  		  return true;
	    		  	  }else{
	    		  		  return false;
	    		  	  }
	    	  	  }
	    	  }
	      }),      
	      stripeRows: true,
	      autoExpandColumn: 'neName',
	      title: '模版应用',
	      tbar:[{
	    	 text:'查询',
	    	 tooltip:'查询',
	    	 iconCls:'icon-search',
	    	 id: 'templateUseSearch',
	    	 handler:searchUse
	      	 
	      },'-',{
	    	 text:'套用模版',
	     	 tooltip:'套用模版',
	     	 is:  'save',
	     	 iconCls:'icon-save',
	     	 handler:saveTemplate
	      }]
	      /*
	      root_title: 'Companies', 
	      plugins: expander,     
	      viewConfig : {
	      	enableRowBody : true
	      },
	      */
	    });
	    GlobalUse.treeGrid.on("rowdblclick",function(grid,rowIndex,EventObject){
	    	var data = grid.getStore().getAt(rowIndex).data;
	    	if(!data.isNe){
	    		data.ruleTypeId = GlobalUse.urlParam.ruleType;
	    		for(var key in GlobalUse.urlParam){
	    			data[key] = GlobalUse.urlParam[key];
	    		}
	    		//弹出查看
	    		
	    		var RULE_TYPE_ID = data.ruleType;		
	    		commonGlobal.ruleInfo.CLASS_NAME =  data.CLASS_NAME;		
	    		commonGlobal.ruleInfo.RULE_TITLE =  data.RULE_TITLE;		
	    		commonGlobal.ruleInfo.ruleType = commonGlobal.ruleInfo.rule_type = commonGlobal.ruleInfo.rule_type_id = RULE_TYPE_ID;
	    		commonGlobal.ruleInfo.ACTION = 'view';
	    		Global.ruleCtrl = factoryCtrl.newRuleCtrl(commonGlobal.ruleInfo.CLASS_NAME);	    		
	    		commonGlobal.ruleInfo.RULE_ID = data.rule_id;
	    		commonGlobal.ruleInfo.id = data.ne_item_id;
	    		Global.isTemplateUse = 1;	    		
	    		Global.ruleCtrl.edit(grid);
	    		setTimeout(function(){
	    			Ext.getCmp("info_save_btn").hide();
	    			Ext.getCmp("westPanel").hide();	    
	    			Ext.getCmp("ruleInfoPanel").doLayout();
	    		},10)
	    		//window.showModalDialog("templateRuleInfo.html",data,"dialogWidth=900px;dialogHeight=550px;help=0;scroll=1;status=0;");    		
	    	}
	    });
	    //初始化操作
	    GlobalUse.store.on("load",function(store,records,obj){
	    	var selectModel = GlobalUse.treeGrid.getSelectionModel();
	    	var selectArr = [];
	    	for(var i=0;i<records.length;i++){
	    		var data = records[i].data;    		
	    		if(data._parent == ""){  	
	    			if(GlobalUse.urlParam.historyCount > 1 && data.isclash == '<span class="noClash">无冲突</span>'){
	    				selectArr.push(i);
	    			}
	    		}
	    	}    	
	    	selectModel.selectRows(selectArr);
	    	GlobalUse.myMask.hide();
	    });
	    GlobalUse.store.on("exception",function(proxy,type,action){
	    	GlobalUse.myMask.hide();	    	    	
	    	Ext.Msg.alert("系统提示","获取数据出错 "+type +":" + action);
	    });
	    var vp = new Ext.Viewport({
	    	layout : 'fit',
	    	items : GlobalUse.treeGrid
	    });
	    //grid.getSelectionModel().selectFirstRow();
	}
	return {
		init : function()
		{
			createGrid();			
		}
	}
}();

Ext.onReady(Controller.init);

//单选框点击事件 flag： 1=覆盖规则,2=新增,3=覆盖
function radioClick(me,flag){
	var name = me.name;
	switch(flag){
		case 1:
			var neId = name.replace("control_","");
			var child = document.getElementsByName("control_child_"+neId);
			for(var i=0;i<child.length;i++){
				if(!child[i].disabled){
					child[i].checked = true;
					break;
				}
			}			
			break;
		case 2:
			var neId = name.replace("control_","");
			var child = document.getElementsByName("control_child_"+neId);
			for(var i=0; i<child.length; i++){
				child[i].checked = false;
			}
			break;
		case 3:
			var neId = name.replace("control_child_","");
			var par = Ext.getDom("two_"+neId);
			par.checked = true;
			break;			
	}
}
//查询
function searchUse(){
	if(!GlobalUse.searhGrid){
		var vAlign = (navigator.userAgent.toLowerCase()
				.indexOf("msie 8") > -1) ? "middle" : "baseline";	
		//网元类型树
		var neTypeTree = new Ext.ux.ComboBoxTree({
			fieldLabel	: '网元类型',
			id			: 'neType',
			width : 220,
			maxHeight: 230,
			tree : {
				xtype:'treepanel',
				id   : 'neTypeTree',
				listeners 	: {
					beforeload 	: function(node){
						if(node){
							if(!node.leaf){
								//var url = GlobalUse.alarmRuleUrl + "tag=46&sql=select b.ne_type_name,a.ne_type_id, (SELECT COUNT(NE_ID) FROM NET_ELEMENT WHERE STATE = '0SA' AND PARENT_NE_ID = A.NE_ID AND pkp_alarm_rule.isEntityNe(NE_ID) = 'N' AND NE_FLAG = 1) CHILD_COUNT" 
								//	+" from net_element a,ne_type b where a.ne_type_id = b.ne_type_id and a.ne_flag = 1 and b.parent_ne_type_id = "+node.attributes.id+" ORDER BY a.NE_NAME, a.SORT_ID";
								var param;								
								if(node.attributes.id == -1){									
									param = 'a.parent_ne_item_id = ' + (GlobalUse.urlParam.TEMPLATE_NE_ITEM_ID || 100);
								}else{
									param = 'a.parent_ne_item_id = '+node.attributes.id;
								}
								var url = GlobalUse.alarmRuleUrl + "tag=46&sql=select i.tree_label,k.ne_item_id,k.count from basic_tree_node i,(select relation_id,ne_item_id,(select count(ne_item_id) from ne_view_cfg where view_id = 1 and ITEM_TYPE <> 'FROM_CI_SUBJECT' AND ITEM_TYPE <> 'FROM_ENTITY_NE' and parent_ne_item_id = a.ne_item_id) count from ne_view_cfg a where ITEM_TYPE <> 'FROM_CI_SUBJECT' AND ITEM_TYPE <> 'FROM_ENTITY_NE' and "+ param + ") k where i.tree_id = k.relation_id and i.state = '0SA' and i.public_tree_key = 'CI_TYPE_TREE_FOR_CI_VIEW'";
								Ext.getCmp("neTypeTree").getLoader().dataUrl = url;
							}
						}
					}
				},
				iconCls		: "icon-accordian",
				autoScroll 	: true,
	       	 	root : new Ext.tree.AsyncTreeNode({id:'-1',text:'所有类型'})
	    	}
		});
		//区域树
		var regionTree = new Ext.ux.ComboBoxTree({
			fieldLabel	: '区域',
			id			: 'region',
			width : 220,
			maxHeight: 230,
			tree : {
				xtype:'treepanel',
				id   : 'regionTree',
				listeners 	: {
					beforeload 	: function(node){
						if(node){
							if(!node.leaf){
								var url = GlobalUse.alarmRuleUrl + "tag=46&sql=SELECT REGION_NAME,REGION_ID,(select count(*) from MANAGE_REGION where PARENT_REGION_ID = a.REGION_ID) CHILD_COUNT  FROM MANAGE_REGION a WHERE REGION_ID <> -1 CONNECT BY PARENT_REGION_ID = PRIOR REGION_ID START WITH REGION_ID = -1";
								Ext.getCmp("regionTree").getLoader().dataUrl = url;
							}
						}
					}
				},
				iconCls		: "icon-accordian",
				autoScroll 	: true,
	       	 	root : new Ext.tree.AsyncTreeNode({id:'-1',text:'全部区域'})
	    	}
		});
		
		//业务系统
		var business = new Ext.ux.ComboBoxTree({
			fieldLabel	: '业务系统',
			id			: 'business',
			width : 220,
			maxHeight: 230,
			tree : {
				xtype:'treepanel',
				id   : 'businessTree',
				listeners 	: {
					beforeload 	: function(node){
						if(node){
							if(!node.leaf){		
								var url;
								if(node.attributes.id == -1){
									url = GlobalUse.alarmRuleUrl + "tag=47";									
								}else{
									url = GlobalUse.alarmRuleUrl + "tag=47&id="+node.attributes.id;									
								}								
								Ext.getCmp("businessTree").getLoader().dataUrl = url;
							}
						}
					}
				},
				iconCls		: "icon-accordian",
				autoScroll 	: true,
	       	 	root : new Ext.tree.AsyncTreeNode({id:'-1',text:'所有业务系统'})
	    	}
		});
		
		//是否引用过模版
		var isUseTemplate = new Ext.form.RadioGroup({
			labelWidth : 220,
			fieldLabel	: '是否引用过模版',
			id : 'isUseTemplate',
			items : [
	         	{boxLabel: '全部', name: 'useTemplate', inputValue: '-1', checked: true},
	         	{boxLabel: '是', name: 'useTemplate', inputValue: '1'},
	         	{boxLabel: '否', name: 'useTemplate', inputValue: '0'}
			]
		});
		
		//是否冲突
		var isClash = new Ext.form.RadioGroup({
			labelWidth : 220,
			fieldLabel	: '是否冲突',
			id : 'isClash',
			items : [
	         	{boxLabel: '全部', name: 'clash', inputValue: '-1', checked: true},
	         	{boxLabel: '是', name: 'clash', inputValue: '1'},
	         	{boxLabel: '否', name: 'clash', inputValue: '0'}
			]
		});				
		
		var form = new Ext.Panel({
			labelWidth : 100,
			defaults : {
				width : 220,
				style : {
					verticalAlign : vAlign
				}
			},
			border : false,
			bodyStyle : {
				padding : '5 0 0 10',
				backgroundColor : '#DFE8F6'
			},			
			autoScroll : true,
			layout : 'form',
			baseCls: 'x-plain',
			items : [
			   {
				   width		: 220,
				   xtype		: 'textfield',
				   fieldLabel	: '网元名称',
				   id			: 'neName',
				   style 		: 'margin:0,0,0,0'				 
			   },neTypeTree,regionTree,business,isClash,isUseTemplate      
			]
			
		});
				
		GlobalUse.searhGrid = new Ext.Window({
			title : "查询参数",
			iconCls : "icon-param",
			layout : 'fit',
			width : 380,
			height : 300,
			minWidth : 380,
			closeAction : 'hide',
			modal : false,
			plain : true,
			items : form,
			initValue : [],
			buttons : [{
						text : '查询',
						handler : function() {
							var searchParm={};
							for(var i=0; i<form.items.items.length; i++){
								var v = '';
								if(form.items.items[i].getValue() != -1)v = form.items.items[i].getValue();
								searchParm[form.items.items[i].id] = v;
							}
							searchParm['fromSearch'] = 1;
							if(searchParm['isUseTemplate']=='1')searchParm['isUseTemplate']="是";
							else if(searchParm['isUseTemplate']=='0')searchParm['isUseTemplate']="否";
							if(searchParm['isClash']=='1')searchParm['isClash']='<span class="clash">冲突</span>';
							else if(searchParm['isClash']=='0')searchParm['isClash']='<span class="noClash">无冲突</span>';							
							GlobalUse.searchParm = searchParm;
							GlobalUse.searhGrid.hide();	
							GlobalUse.myMask.show();
							GlobalUse.store.removeAll(true);
							GlobalUse.store.load({
								params:searchParm,
								callback:function(){
									GlobalUse.myMask.hide();
								}
							});
						},
						scope : this
					}, {
						text : '取消',
						handler : function() {
							GlobalUse.searhGrid.hide(arguments[0]);
						}
					}]
			});
	}
	GlobalUse.searhGrid.show(arguments[0]);
}

//套用模版
function saveTemplate(){
	Ext.LoadMask.prototype.msg = "执行操作中...";
	var records = GlobalUse.treeGrid.getSelectionModel().getSelections();
	if(records.length == 0){
		Ext.Msg.show({
			title : '系统提示',
			msg : '请先选择需要套用模版的网元',
			buttons : Ext.Msg.OK,
			icon : Ext.Msg.ERROR
		});
		return;
	}
	if (QMsg("是否确定要套用模版")!=MSG_YES)	{
		return;
	}
	Ext.MessageBox.show({
         msg: '套用模版中,请稍后...',
         progressText: '执行中...',
         width:300,
         wait:true,
         waitConfig: {interval:2000},
         icon:'ext-mb-download', //custom class in msg-box.html
         animEl: 'save'
    });
	var ne,NEID = [],RULES = [],RULE_NEIDS=[],neControlDom,ruleDom;
	for(var i=0; i<records.length; i++){
		ne = records[i].data._id;
		var neControl='',rule='';
		neControlDom = document.getElementsByName("control_"+ne);
		for(var j=0;j<neControlDom.length;j++){
			if(!neControlDom[j].disabled && neControlDom[j].checked == true){
				neControl = neControlDom[j].value;
				break;
			}
		}		
		if(neControl == 1){//新增
			NEID.push(records[i].data._id);
		}else if(neControl == 2){//覆盖规则,需要遍历子规则
			ruleDom = document.getElementsByName("control_child_"+ne);
			for(var j=0;j<ruleDom.length;j++){
				if(!ruleDom[j].disabled && ruleDom[j].checked == true){
					rule = ruleDom[j].id.replace("two_child_","");
					break;
				}
			}
			if(!rule){
				rule = ruleDom[0].id.replace("two_child_","");
			}	
			RULE_NEIDS.push(ne);		
			RULES.push(rule);			
		}
	}	
	var sendUrl = GlobalUse.alarmRuleUrl + 'tag=44&RULE_TYPE_ID=' + 
					GlobalUse.urlParam.ruleType + "&NEID="+NEID.join(",")+"&RULE_NEIDS="+RULE_NEIDS+"&RULES="+RULES.join(",")+"&TEMPLATE_ID="+GlobalUse.urlParam.TEMPLATE_ID;
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	(function(){
		xmlhttp.open("post", sendUrl, false);
		xmlhttp.send();
		if(isSuccess(xmlhttp)){
			//GlobalUse.myMask.hide();
			Ext.MessageBox.hide();
			Ext.Msg.alert('系统提示', " 套用模版成功!", function(){
				window.close();
			});
		}else{
			Ext.MessageBox.hide();
			//Ext.Msg.alert('系统提示', " 套用模版失败!");
		}		
	}).defer(100);
	
     
	//GlobalUse.myMask = new Ext.LoadMask(Ext.getBody(), {msg:Ext.LoadMask.prototype.msg});
	//GlobalUse.myMask.show();//显示加载等待提示	
}