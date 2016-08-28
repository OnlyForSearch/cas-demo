Ext.namespace("health.rpt.submitRpt");
Ext.QuickTips.init(); 
health.rpt.submitRpt.northPanel = function(config)
{
	config['_makepn']['health.rpt.submitRpt.northPanel'] = this;
	Ext.apply(this, config);
	this.config = config;
	health.rpt.submitRpt.northPanel.superclass.constructor.call(this, {
		 border:false,
		 region:'north',
		 html:'<div style="width:100%"><table align="center"><tr><td align="center"><h4>诊断报告填写结果</h4></td></tr></table></div>',
		 frame:true
	});	
};

Ext.extend(health.rpt.submitRpt.northPanel, Ext.Panel, {});
//表格*****************************************************
health.rpt.submitRpt.gridPanel = function(config)
{
	config['_makepn']['health.rpt.submitRpt.gridPanel'] = this;
	Ext.apply(this, config);
	this.config = config;
    Ext.QuickTips.init();
	var fields = [
		       {name : 'NE_NAME'}, 
			   {name : 'HEALTH_INSTANCE_ID'},
			   {name : 'NE_ID'},
			   {name : 'PERSON_VERIFY_RESULT'},
			   {name : 'VERIFY_RESULT_DESC'},
			   {name : 'MANAGE_VERIFY_RESULT'}
			   ];
	 function showImage(val)
	 {
    	var disable = '<div>'+val+'</div>';
            return disable;
        
    };
    var sm = new Ext.grid.CheckboxSelectionModel(); //复选框
	var colModel = new Ext.grid.ColumnModel([
		{header : '对象',dataIndex : 'NE_NAME',sortable:true,width:80,menuDisabled : true}, 
		{header : '人工诊断意见',dataIndex : 'VERIFY_RESULT_DESC',sortable:true,width:300,menuDisabled : true,align:"center"}, 
		{header : '诊断结果',dataIndex : 'PERSON_VERIFY_RESULT',sortable:true,menuDisabled : true},
		sm
	]);
  	store = new Ext.data.Store({
					pruneModifiedRecords : true,
					id : 'hds',
					baseParams:{pinstance_id:this.config.pinstance_id},
					autoLoad	: true,
					proxy : new Ext.data.HttpProxy({
								url : '../../servlet/healthRptAction?action=8'
										
							}),
					reader : new Ext.data.JsonReader({
								root : 'rows'
	
							}, fields),
					remoteSort : true
	
				});
	health.rpt.submitRpt.gridPanel.superclass.constructor.call(this, {
	   border:true,
       store: store,
       stripeRows			: true,
       cm:colModel,
       loadMask            : true,
       sm:sm,
       viewConfig : 
       	{   
                forceFit : true,   
                rowSelectorDepth:100
               
        },
       listeners:
       {
			rowdblclick:
			{
				fn:this.onRowDblClickFn,
				scope:this
	
			}
       }
	});	
	
};

Ext.extend(health.rpt.submitRpt.gridPanel, Ext.grid.GridPanel, 
{
     onRowDblClickFn:function(grid, rowIndex, e)
     {
     	var data = grid.getStore().getAt(rowIndex).data;
     	var etPan=this.ownerCt.ownerCt.etPanel;
     	etPan.expand();
     	etPan.subForm.form.reset();
     	etPan.objName.setValue(data['NE_NAME']);
     	if(data['PERSON_VERIFY_RESULT']==""||data['PERSON_VERIFY_RESULT']==null)
     	{
     			etPan.roomCombo.setValue("正常");
     	}else{
     		etPan.roomCombo.setValue(data['PERSON_VERIFY_RESULT']);
     	}
     etPan.objid.setValue(","+data['NE_ID']);
     etPan.gridDow.store.load({params:{neid:etPan.objid.getValue()}});
     var items = etPan.bottomToolbar.items;
	 items.item("updateZhibiao").setDisabled(false);
	 etPan.diagnoseInfo.setValue(data['VERIFY_RESULT_DESC']);
	}
});
//****************************************************
health.rpt.submitRpt.infoWin = function(config)
{
	config['_makepn']['health.rpt.submitRpt.infoWin'] = this;
	Ext.apply(this, config);
	this.config = config;
		var sm = new Ext.grid.CheckboxSelectionModel();
			var fields = [
			   {name : 'HEALTH_INSTANCE_ID'}, 
			   {name : 'KPI_GROUP_ID'}, 
	           {name : 'NE_ID'}, 
		       {name : 'NE_NAME'}, 
			   {name : 'KPI_GROUP_NAME'},
			   {name : 'KPI_ID'},
			   {name : 'KPI_NAME'},
			   {name : 'SAMPLING_COUNT'},
			   {name : 'AVG_VALUE'},
			   {name : 'MAX_VALUE'},
			   {name : 'MIN_VALUE'},
			   {name : 'FIRST_VALUE'},
			   {name : 'LAST_VALUE'},
			   {name : 'SCORE'},
			   {name : 'AVAILABLE_DESC'}
			   ];
   var makeStore = new Ext.data.SimpleStore({
        fields: ['code','name'],
        data : [['中','中'],['低','低'],['可用','可用'],['不可用','不可用']]
    });
    
    	 function showImage(val){
	 	if(val=="低"){
	 		val="<font color=red>"+val+"</font>";
	 	}else if(val=="不可用"){
	 		val="<font color=red>"+val+"</font>";
	 	}
    	var disable = '<div ext:qtip="<div>10:中</div><div>20:低</div><div>50:可用</div><div>60:不可用</div>"> '+val+'</div>';
            return disable;
    };
     function showInfo(val){
    	var disable = '<div ><img class="show_img"  src="../../resource/image/perf.gif"></div>';
            return disable;
    };
	var colModel = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(), //序号		
		{header : '指标名称',dataIndex : 'KPI_NAME',sortable:true,width:100,menuDisabled : true}, 
		{header : '科目',dataIndex : 'KPI_GROUP_NAME',sortable:true,width:30,menuDisabled : true}, 
		{header : '平均值',dataIndex : 'AVG_VALUE',sortable:true,width:30,menuDisabled : true,
		editor:new Ext.form.NumberField({allowBlank:false})
		}, 
		{header : '最大值',dataIndex : 'MAX_VALUE',sortable:true,width:30,menuDisabled : true,
		editor:new Ext.form.NumberField({allowBlank:false})
		},
		{header : '最小值',dataIndex : 'MIN_VALUE',sortable:true,width:30,menuDisabled : true,
		editor:new Ext.form.NumberField({allowBlank:false})
		},
		{header : '可用度',dataIndex : 'AVAILABLE_DESC',sortable:true,width:30,menuDisabled : true, renderer: showImage, hideable: false, 
		editor: new Ext.form.ComboBox({
        			store:makeStore,
        			width:30,
        			valueField: 'code',
        			displayField:'name',
        			lookup:'currencySystem',
        			typeAhead: true,
        			mode: 'local',
        			triggerAction: 'all',
        			emptyText:'--请选择--',
        			selectOnFocus:true
    			})}
		
		
	]);
   io_store = new Ext.data.GroupingStore({
    	        pruneModifiedRecords : true,
                proxy : new Ext.data.HttpProxy({
                	//autoLoad:true,
							url : '../../servlet/healthRptAction?action=13'
						}),
				reader : new Ext.data.JsonReader({
							root : 'rows',
							totalProperty : 'results',
							fields:fields
						}),
				remoteSort : false,
		        groupField: 'KPI_GROUP_NAME',
		        sortInfo: {field: 'KPI_GROUP_NAME', direction: "ASC"}
    });

    this.infoGuidLinPanel=new Ext.Panel({
    	border:false,
    	height:150,
    	autoScroll:true,
    	html:'显示指标采样曲线图'
    })

	this.infoGrid=new Ext.grid.EditorGridPanel({
	  stripeRows			: true,
	  title:'修改指标信息',
       cm:colModel,
       loadMask            : true,
       store: io_store,
       width:555,
       autoScroll:true,
       tbar:[{text:'保存',handler:this.guidSave,scope:this,disabled:this.config.flag},{text:'刷新',handler:this.refreshGuid,scope:this,disabled:this.config.flag},'->','<font color="red">*双击可修改表格字段(平均值、最大值、最小值、可用度)</font>&nbsp;&nbsp;'],
       border:false,
       height:300,
       viewConfig : {   
                forceFit : true,   
                rowSelectorDepth:100
       },
      view: new Ext.grid.GroupingView({
        	id:'groupingView1',
        	forceFit:true,
        	groupTextTpl:'{text}({[values.rs.length]}条)',//定义分组行模版
        	groupByText:'使用当前字段进行分组',//表头提示信息
        	showGroupsText:'表格分组',//表头菜单提示
        	showGroupName:true,//显示字段名称
        	startColapsed:true,//展开分组
        	hideGroupedColumn:true    //隐藏分组列
        })
	});
	this.tmpPanel=new Ext.Panel({
        		height:300,
        		border:false,
        		autoScroll:true,
        		disabled:true,
        		html:'fdfdfdfdfdfdf',
        		title:'指标采样曲线图'
        	})
	this.showTab=new Ext.TabPanel({
		activeTab: 0,
       /* deferredRender:false,
        enableTabScroll:true,
         height:250,
        monitorResize: true,
        layoutOnTabChange:true,*/
        tabPosition: 'bottom',
		items:[this.infoGrid]
	})
	health.rpt.submitRpt.infoWin.superclass.constructor.call(this, {
		 closeAction:'hide',
		 width:700,
		 items:[this.showTab,{border:false,html:'<div><font color="red">___________________________________________________网管诊断建议___________________________________________________</div>'} ,this.infoGuidLinPanel],
		 height:500
	});	
	
};

Ext.extend(health.rpt.submitRpt.infoWin, Ext.Window, {
			sendXml : function()
		{
			var sendXml = new ActiveXObject("Microsoft.XMLDOM");
			var root = sendXml.createElement("root");
			sendXml.appendChild(root);
			var editRoot = sendXml.createElement("edit");
			root.appendChild(editRoot);
			var record = this.infoGrid.store.getModifiedRecords();
			for (var i = 0, r, el, p; r = record[i]; i++)
			 {
	
	
					el = sendXml.createElement("guidLine");
					for (var c in r.data) 
					 {
							el.setAttribute(c, r.data[c]);
					 }
					editRoot.appendChild(el);
			 }
		
			return sendXml;
		},
		refreshGuid : function() 
		 {
		 	this.infoGrid.store.load(this.infoGrid.store.lastOptions);
		 },
		 guidSave:function ()
		 {
			 	if(this.infoGrid.store.getModifiedRecords().length<1){
			 		return ;
		 }
		 	var sendXml=this.sendXml();
		 		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
					sendRequest.open("post",
							'../../servlet/healthRptAction?action=14', false);
					sendRequest.send(sendXml);
					if (sendRequest.readyState == 4 && sendRequest.status == 200) 
					 {
						var responseRoot = Ext.util.JSON
								.decode(sendRequest.responseText);
						if (responseRoot.success == true) 
						 {
							alert('指标信息已经修改!');
							 this.refreshGuid();
							
						 } else {
							alert('指标信息已经修改失败!');
						}
					 }
					
		 }
});
//**************************
health.rpt.submitRpt.eastPanel = function(config)
{
	config['_makepn']['health.rpt.submitRpt.eastPanel'] = this;
	Ext.apply(this, config);
	this.config = config;
	var sm = new Ext.grid.CheckboxSelectionModel();
	this.infoWin=new health.rpt.submitRpt.infoWin(config);
		var dw_store = new Ext.data.Store({
			    baseParams:{pinstance_id:this.config.pinstance_id},
				url			: "../../servlet/healthRptAction?action=10",
				//autoLoad	: true,
				reader		: new Ext.data.JsonReader
				({
							root	: 'imgList'
							
				  },
				["HEALTH_OBJ_ATTACH_ID", "OWN_NE","FILE_NAME","FILE_PATH","FILE_SIZE"])
			});
	this.gridDow=new Ext.grid.GridPanel({
	   border:false,
       store: dw_store,
       width:260,
       sm:sm,
       height:210,
       stripeRows			: true,
       columns		: [sm,
       	               {
							header			: "文件名称",
							dataIndex		: 'FILE_NAME',
							width:120,
							menuDisabled	: true
						},
						{
							header			: "文件大小",
							dataIndex		: 'FILE_SIZE',
							//width:200,
							menuDisabled	: true
						}],
       loadMask            : true,
       autoScroll:true,
       tbar:[{text:'上传附件',handler:this.uploadFileFn,scope:this,disabled:this.config.flag},{text:'删除附件',handler:this.delFileFn,scope:this,disabled:this.config.flag},{text:'下载',handler:this.downloadFn,scope:this}]
      
	});
	//*************************************
	this.objName=new Ext.form.TextField({
		fieldLabel:'对象名称',
		width:160,
		style : 'margin:0,0,2,0;color:red;',
		//anchor:'95%',
		readOnly:true
	})
    this.uploadFile=new Ext.form.TextField({
		fieldLabel:'附件1',
		labelSeparator:':',
		name:'uploadFile',
		style : 'margin:0,0,2,0;',
		width:165,
		//anchor:'100%',
	    inputType: 'file'  
	})
	this.objid=new Ext.form.Hidden({
	})
	var itemTypeStore = new Ext.data.SimpleStore({
        fields: ['code','name'],
        data : [['正常','正常'],['异常','异常']]
    });
   this.roomCombo=new Ext.form.ComboBox({
		fieldLabel:'诊断结果',
		width:145,
		store: itemTypeStore,
		editable : true,
		style : 'margin:0,0,1,0;',
		//codeField:'code',
	     valueField: 'code',
		displayField:'name',
		lookup:'itemType',
		typeAhead: true,
		mode: 'local',
		triggerAction: 'all',
		emptyText:'--请选择--',
		selectOnFocus:true
		
	})
    this.diagnoseInfo=new Ext.form.TextArea({
    	fieldLabel:"填写诊断意见",
    	style : 'margin:0,0,2,0',
    	emptyText:'请填写意见',
    	//anchor:'95%',
    	width:160,
    	height:120
    })
    this.addUpload=new Ext.Button({
    	text:'保存意见',
    	disabled:this.config.flag,
    	pressed:true,
    	handler:this.addUploadbtnFn,
    	tooltip:'保存你选中对象的诊断意见',
    	scope:this
    })

	this.subForm=new Ext.form.FormPanel({
		labelWidth:60,
		border:false,
		//height:260,
		style:'padding:5px 5px 5px 10px;',
		fileUpload:true,   
		width:240,
        labelPad : 0,
        buttonAlign : 'left',
		border:false,
		items:[this.objName,this.roomCombo,this.objid,this.diagnoseInfo]
	})
	health.rpt.submitRpt.eastPanel.superclass.constructor.call(this, {
		border:true,
		width:260,
		height:500,
		//autoScroll:true,
		collapsible:true,
		collapsed:true, 
		collapseMode:'mini',
		split:true,
		region:'east',
		bbar:['&nbsp;&nbsp;&nbsp;&nbsp;',{text:'指标明细',pressed:true,handler:this.infoWinFn,scope:this,id:'updateZhibiao'},this.addUpload,{text:'重置',pressed:true,handler:this.removeFileFn,scope:this,disabled:this.config.flag}],
		title:'填写诊断意见',
		items:[this.subForm,this.gridDow]
	});	
	
	
};
Ext.extend(health.rpt.submitRpt.eastPanel, Ext.Panel, 
{
	addUploadbtnFn:function ()
	{
		if(this.objid.getValue()==null||this.objid.getValue()==''){
			alert('没有选择的网元对象');
			return false;
		}
		if(this.diagnoseInfo.getValue()=="")
		{
			alert('诊断描述不能为空');
			return false;
		}
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
			var root = sendXml.createElement('root');
			sendXml.appendChild(root);
			var objects = sendXml.createElement('objects');
			var health_id = sendXml.createElement('HEALTH_INSTANCE_ID');
			health_id.text=this.config.pinstance_id;
			objects.appendChild(health_id);
			var neid = sendXml.createElement('NE_ID');
			neid.text=this.objid.getValue();
			objects.appendChild(neid);
			var pvr = sendXml.createElement('PERSON_VERIFY_RESULT');
			pvr.text=this.roomCombo.getValue();
			objects.appendChild(pvr);
			var vrd = sendXml.createElement('VERIFY_RESULT_DESC');
			vrd.text=this.diagnoseInfo.getValue();
			objects.appendChild(vrd);
			root.appendChild(objects);
		    Ext.Ajax.request({
							url : '../../servlet/healthRptAction?action=15',
							waitMsg : '提交数据请稍后……',
							waitTitle : '提示',
							params : {
								
							},
							xmlData : sendXml,
							callback : this.autoLoadGd.createDelegate(this)
						});
		    this.collapse();
	},
	removeFileFn:function ()
	{
		this.diagnoseInfo.reset();
	},
	uploadFileFn:function ()
	{
		if(this.objid.getValue()==null||this.objid.getValue()==''){
			alert('没有选择的网元对象');
			return false;
		}
		 dialog = new Ext.ux.UploadDialog.Dialog({
		             url: '../../servlet/healthRptAction?action=9&pinstance_id='+this.config.pinstance_id+'&neid='+this.objid.getValue(),
			         width : 450,
			         height : 300,
			         draggable : true,
			         resizable : false,
			         modal: true,
	                 reset_on_hide: false,
	                 allow_close_on_upload: true, 
	                 animateTarget: 'btn',
	                 animCollapse: true,
	                 closeAction:'close',
					 listeners : {
								"beforeclose" : this.callLoad.createDelegate(this)
							     },
	                 permitted_extensions:['JPG','jpg','rar','RAR','pdf','PDF','doc','DOC','xls','XLS'],   
	                 upload_autostart: false 
		               });
		            dialog.show('show-button');
		           
	},
	infoWinFn:function ()
	{
		var gdp=this.ownerCt.gdPanel//this._makepn['health.rpt.submitRpt.gridPanel'];
		if(!gdp.getSelectionModel().getSelected()){
		
			alert('请选择一条记录');
			return false;
		}
		var manResult=gdp.getSelectionModel().getSelected().get("MANAGE_VERIFY_RESULT");
		this.infoWin.show();
		this.infoWin.setTitle(this.objName.getValue());
		var objid=this.objid.getValue().split(',');
		this.infoWin.showTab.setActiveTab(this.infoWin.infoGrid);
		this.infoWin.infoGrid.store.load({params:{neid:objid[1],pid:this.config.pinstance_id}});
		this.infoWin.infoGuidLinPanel.body.update('<div >'+manResult+'</div>');
	},
	callLoad:function ()
	{
		this.gridDow.store.load({params:{neid:this.objid.getValue()}});
	},
	delFileFn:function ()
	{
		 var sm = this.gridDow.getSelectionModel();
		 var records = sm.getSelections();
		 if(records.length<1)
		 {
		 	alert('必须选中你要删除的文件');
		 	return false;
		 }
		 var sendXml = new ActiveXObject("Microsoft.XMLDOM");
			var root = sendXml.createElement("root");
			sendXml.appendChild(root);
			var delRoot = sendXml.createElement("del");
			root.appendChild(delRoot);
		for(var i=0,n;n=records[i];i++)
		{
			el = sendXml.createElement("model");
			el.setAttribute('HEALTH_OBJ_ATTACH_ID', n.get('HEALTH_OBJ_ATTACH_ID'));
			el.setAttribute('OWN_NE', n.get('OWN_NE'));
			delRoot.appendChild(el);
		}
		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
					sendRequest.open("post",
							'../../servlet/healthRptAction?action=11&neid='+this.objid.getValue(), false);
					sendRequest.send(sendXml);
					if (sendRequest.readyState == 4 && sendRequest.status == 200) 
					 {
						var responseRoot = Ext.util.JSON
								.decode(sendRequest.responseText);
						if (responseRoot.success == true) 
						 {
							alert('附件已经删除!');
							this.gridDow.store.load(this.gridDow.store.lastOptions);
							
						 } else {
							alert('附件已经删除失败!');
						}
					 }
	},
	downloadFn:function()
	{
		var sm = this.gridDow.getSelectionModel();
		 var records = sm.getSelections();
		 if(records.length!=1)
		 {
		 	alert('只能选中一个附件下载');
		 	return false;
		 }
		 var hrefUrl=window.location.href;
	     var url=hrefUrl.substring(0,21);
	     var lastUrl=url+"/upload/malapy/"+records[0].data.FILE_PATH;
		 location.href=lastUrl
	},
	autoLoadGd:function(options, success, response) 
								{
									var responseMove = Ext.util.JSON.decode(response.responseText);
									if (responseMove.success == true)
									{
										Ext.Msg.show({
													title : '成功提示',
													msg : '数据已经保存!',
													buttons : Ext.Msg.OK,
													icon : Ext.Msg.INFO
												});
									this.ownerCt.gdPanel.store.load(this.ownerCt.gdPanel.store.lastOptions);
									} else {
										Ext.Msg.show({
													title : '错误提示',
													msg : '!数据保存失败',
													buttons : Ext.Msg.OK,
													icon : Ext.Msg.ERROR
												});
									}
			}
});
//************************************************
health.rpt.submitRpt.centerPanel = function(config)
{
	config['_makepn']['health.rpt.submitRpt.centerPanel'] = this;
	Ext.apply(this, config);
	this.config = config;
	this.gdPanel=new health.rpt.submitRpt.gridPanel(config);
	this.etPanel=new health.rpt.submitRpt.eastPanel(config);
	this.ckPerson=new Ext.form.TextField({
		fieldLabel:'对象名称',
		width:160,
		value:this.config.ckPerson,
		style : 'margin:0,0,2,0;',
		//anchor:'95%',
		readOnly:true
	})
	this.prtTile=new Ext.form.TextField({
		width:160,
		value:this.config.prtTile,
		readOnly:this.config.flag,
		style : 'margin:0,0,2,0;'
		//anchor:'95%',
		
	})
	this.ckPersonid=new Ext.form.Hidden({
		width:160,
		value:this.config.ckPid,
		style : 'margin:0,0,2,0;'
		//anchor:'95%',
		
	})
	this.gcPanel = new Ext.Panel({
		border:false,
		//collapseMode:'mini',
		split:true,
		region:'center',
		layout:'fit',
		items:[this.gdPanel]
	});
	health.rpt.submitRpt.centerPanel.superclass.constructor.call(this, 
	{
		border:false,
		region:'center',
		layout:'border',
		tbar:['<b>报告标题:</b>',this.prtTile,'-','<font color="red">*</font>',this.ckPerson,this.ckPersonid,{text:'选择审核人',pressed:true,handler:this.selectPersonFn,scope:this,disabled:this.config.flag},'->','<b>诊断时间：</b>'+this.config.nowDate+'&nbsp;&nbsp;'],
		buttonAlign : 'center',
		buttons : [{
					text : '批量填写',
					handler:this.somSubrptFn,
					disabled:this.config.flag,
					scope:this
					
				},{
					text : '提交报告',
					handler:this.subrptFn,
					pressed:true,
					disabled:this.config.flag,
					scope:this
					
					
				}, {
					text : '取消',
					handler:function(){
						window.close();
					}
					
				}],
		items:[this.gcPanel,this.etPanel]
	});	
	
};

Ext.extend(health.rpt.submitRpt.centerPanel, Ext.Panel,
{
	somSubrptFn:function(){
	    var sm = this.gdPanel.getSelectionModel();
		var records = sm.getSelections();
		if(records.length<1){
			alert('必须选中要填写的对象');
			return false;
		}
		this.etPanel.expand();
		this.etPanel.subForm.form.reset();
		var itemsTool =this.etPanel.bottomToolbar.items;
		if(records.length==1){
	       itemsTool.item("updateZhibiao").setDisabled(false);
         this.etPanel.diagnoseInfo.setValue(records[0].data['VERIFY_RESULT_DESC']);
		}else{
		  itemsTool.item("updateZhibiao").setDisabled(true);
		}
		var objNms="";
		var objId="";
			for (var i = 0, r; r = records[i]; i++)
             {
             	objNms+=r.data["NE_NAME"]+"、";
             	objId+=","+r.data["NE_ID"];
			 }
			 this.etPanel.roomCombo.setValue("正常");
			 this.etPanel.objName.setValue(objNms.substr(0,objNms.length-1));
			 this.etPanel.objid.setValue(objId);
			 
		this.etPanel.gridDow.store.load({params:{neid:this.etPanel.objid.getValue()}});
		
	},
	subrptFn:function ()
	{
		var ckPersonid=this.ckPersonid.getValue();
		var prtTile=this.prtTile.getValue();
		if(prtTile==''){
			alert('报告标题不能为空');
			return false;
		}
		if(ckPersonid==''){
			alert('审核人不能为空');
			this.selectPersonFn();
			return false;
		}
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
			var root = sendXml.createElement('root');
			sendXml.appendChild(root);
			var objects = sendXml.createElement('objects');
			var pers = sendXml.createElement('PERSONS');
			pers.text=ckPersonid;
			objects.appendChild(pers);
			var prtT = sendXml.createElement('prtTile');
			prtT.text=prtTile;
			objects.appendChild(prtT);
			var hiid = sendXml.createElement('HEALTH_INSTANCE_ID');
			hiid.text=this.config.pinstance_id;
			objects.appendChild(hiid);
			root.appendChild(objects);
				Ext.Ajax.request({
							url : '../../servlet/healthRptAction?action=6',
							waitMsg : '提交数据请稍后……',
							waitTitle : '提示',
							xmlData : sendXml,
							callback :function(options, success, response) 
								{
									var responseMove = Ext.util.JSON.decode(response.responseText);
									if (responseMove.success == true) {
										alert('报告提交成功');
										window.close();
								    }else{
								    	alert('报告提交失败');
								    }
							    }
						});
	},
    selectPersonFn:function (btn,e){ 	
    	 var staffId;
		 var staffInfo = choiceStaffToElement(staffBName,staffBId,true,"","",false,staffId); 
		 this.ckPerson.setValue(staffBName.value);
		 this.ckPersonid.setValue(staffBId.value);
	}
});
//**************************************************
health.rpt.submitRpt.MainPanel = function(config){
	config = config || {};
	config['_makepn'] = {'MainPanel':this};
	this.northPanel = new health.rpt.submitRpt.northPanel(config);
	this.centerPanel = new health.rpt.submitRpt.centerPanel(config);

	health.rpt.submitRpt.MainPanel.superclass.constructor.call(this, {
		border:false,
		layout:'border',
		buttonAlign:'center',
		style:'padding:10px;',
		items:[this.northPanel,this.centerPanel ]
	});	
	
};

Ext.extend(health.rpt.submitRpt.MainPanel, Ext.Panel, {});		
		function initLoad()
			{
				var win;
				var params = window.dialogArguments;
				var mainPanel = new health.rpt.submitRpt.MainPanel(params);
				if (!win) {
			        win = new Ext.Window({
			        	id:'be-win',
			            layout:'fit',
			            title:'时间段：'+params.startDate+'&nbsp;至&nbsp;'+params.endDate,
				        collapsible:false,
				        closable:false,
				        draggable:false,
				        resizable:false,
				        
				        modal:true,
					    width : 900,//(Ext.getBody().getSize().width -50),
						height :650,// (Ext.getBody().getSize().height-25),
						constrain:true,
				        items:[mainPanel]
			        });	 
			    }           
			    win.show(); 
		}