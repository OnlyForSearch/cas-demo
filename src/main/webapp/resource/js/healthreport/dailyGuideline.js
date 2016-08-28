		Ext.namespace("daily.ck.guideline");
		Ext.BLANK_IMAGE_URL = '../../resource/js/ext/resources/images/default/s.gif';
		daily.ck.guideline.northPanel = function(config)
		{
			config['_makepn']['daily.ck.guideline.northPanel'] = this;
			Ext.apply(this, config);
			this.config = config;
			daily.ck.guideline.northPanel.superclass.constructor.call(this,
			{
				 border:false,
				 region:'north',
				 html:'<div style="width:100%"><table align="center"><tr><td align="center"><h3>'+this.config.bigTitle+'</h3></td></tr></table></div>'
				// frame:true
				//layout:'border',
				//items:[this.typePanel,this.centerPanel]
			});	
			
		};
		
	Ext.extend(daily.ck.guideline.northPanel, Ext.Panel, {});
	daily.ck.guideline.eastPanel = function(config){
			config['_makepn']['daily.ck.guideline.east'] = this;
			Ext.apply(this, config);
			this.config = config;
	this.diagnoseInfo=new Ext.form.TextArea({
    	fieldLabel:"填写检查说明",
    	style : 'margin:0,0,2,0',
    	emptyText:'请填写说明',
    	value:this.config.content,
    	anchor:'95%',
    	height:130
    })
    this.cFormPanel=new Ext.form.FormPanel({
		labelWidth:100,
		border:false,
		//height:260,
		style:'padding:5px 5px 5px 10px;',
        labelPad : 0,
        buttonAlign : 'left',
		border:false,
		items:[this.diagnoseInfo]
	  })

	
	daily.ck.guideline.eastPanel.superclass.constructor.call(this,
			{
				border:false,
			    region:'south',
				collapsible:true,
				//frame:true,
				collapsed:false,
				collapseMode:'mini',
				height:160,
				split:true,
				
			items:[this.cFormPanel]
			});	
			
		};
		Ext.extend(daily.ck.guideline.eastPanel, Ext.Panel, {});
		daily.ck.guideline.gridPanel = function(config)
		  {
			config['_makepn']['daily.ck.guideline.center'] = this;
			Ext.apply(this, config);
			this.config = config;
			var fields;
			if(this.config.sid == '21' || this.config.sid == '22'){
				fields = [
			           {name : 'DAILY_INSTANCE_ID'}, 
			           {name : 'SAVE_INSERT_ID'}, 
			           {name : 'NE_NAME'}, 
				       {name : 'NE_ID'}, 
				       {name : 'INSERT_VALUE'},
					   {name : 'MSG_REMARK'},
					   {name : 'CONCLUSION_TYPE'}
					   ];
			}
			else{
				fields = [
			           {name : 'DAILY_INSTANCE_ID'}, 
			           {name : 'KPI_NAME'}, 
			           {name : 'KPI_ID'}, 
				       {name : 'NE_ID'}, 
					   {name : 'AVG_VALUE'},
					   {name : 'MAX_VALUE'},
					   {name : 'MIN_VALUE'},
					   {name : 'MSG_REMARK'},
					   {name : 'CONCLUSION_TYPE'}
					   ];
			}
					   
		    var store = new Ext.data.Store({
		    	       pruneModifiedRecords : true,
		               proxy : new Ext.data.HttpProxy({
									url : '../../servlet/healthRptAction?action=29'
								}),
						reader : new Ext.data.JsonReader({
									root : 'rows',
									totalProperty : 'results',
									fields:fields
								}),
								remoteSort : false
		        
		    });

		      function msgInfo(val)
		     {
		    	var disable = '<div style=" background: #C8C8C8;border: solid #C8C8C8 2px"  ext:qtip="单击可以修改" >'+val+'</div>';
		            return disable;
		     };
		     function showInfo(val, metadata, record, rowIndex, colIndex, store)
		     {
		     	var data = record.data;
		     	data.deType=data['CONCLUSION_TYPE'];
		    	var disable = '<table ><tr><td>'+val+'</td></tr></table>';
		            return disable;
		     };
		     
		     function renderContent(value, cell){
    			cell.attr = 'style="white-space:normal;"';
    			return  value ;
			}
		   var combo = new Ext.form.ComboBox({
          //name:"test", 
           hiddenName:"test",
           fieldLabel: "测试",
           store: new Ext.data.SimpleStore({ 
                fields : [ 'value',  'text'],
                data   : [[1, '正常'], [0, '异常']]
            }),
          //valueField:"value",
           displayField:"text",
           allowBlank:false,
           blankText:'结论必须填写' ,
           mode: "local",
           triggerAction:"all",
           emptyText:"请选择类型...",
           allowBlank:false,
           editable :true
       });
       		var colModel;
       		if(this.config.sid == '21' || this.config.sid == '22')
       		{
       			colModel = new Ext.grid.ColumnModel([
				new Ext.grid.RowNumberer(), //序号		
				{header : '设备名称',dataIndex : 'NE_NAME',sortable:true,width:150,menuDisabled : true}, 
				{header : '日志列表',dataIndex : 'INSERT_VALUE',sortable:true,width:350,menuDisabled : true,renderer: renderContent}, 
				{header : '结论',dataIndex : 'CONCLUSION_TYPE',sortable:true,width:70,menuDisabled : true,
				align:'center',
				renderer: msgInfo,
				editor: combo
			},
				{header : '消息备注',dataIndex : 'MSG_REMARK',sortable:true,width:500,menuDisabled : true,editor:new Ext.form.TextField({maxValue:200})}
				
			]);
       		}
       		else{
       			colModel = new Ext.grid.ColumnModel([
				new Ext.grid.RowNumberer(), //序号		
				{header : '指标名称',dataIndex : 'KPI_NAME',sortable:true,width:250,menuDisabled : true}, 
				{header : '平均值',dataIndex : 'AVG_VALUE',sortable:true,width:150,menuDisabled : true}, 
				{header : '最大值',dataIndex : 'MAX_VALUE',sortable:true,width:100,menuDisabled : true},
				{header : '最小值',dataIndex : 'MIN_VALUE',sortable:true,width:100,menuDisabled : true},
				{header : '结论',dataIndex : 'CONCLUSION_TYPE',sortable:true,width:70,menuDisabled : true,
				align:'center',
				renderer: msgInfo,
				editor: combo
			},
				{header : '消息备注',dataIndex : 'MSG_REMARK',sortable:true,width:500,menuDisabled : true,renderer: showInfo}
				
			]);
       		}
		
		
		
			daily.ck.guideline.gridPanel.superclass.constructor.call(this, {
			   border:false,
		       store: store,
		       clicksToEdit:1,
		       cm:colModel,
		       loadMask            : true,
		       listeners:
		       	{
					rowdblclick:
					{
						fn:this.onRowDblClickFn,
						scope:this
					}
		       },
		        viewConfig:{
		        	forceFit:false,
		        	rowSelectorDepth:100
		        }
		     
			});	
			store.on("beforeload",this.onBeforeloadFn,this);
		};
		
		Ext.extend(daily.ck.guideline.gridPanel, Ext.grid.EditorGridPanel,
		{
			che:function (){
						for (var i = 0; i < this.store.getCount(); i++)
					{
						var r = this.store.getAt(i);
						this.startEditing(i, 5);
					}
				
			},
			onBeforeloadFn:function(thiz,options){
				
			},
		     onRowDblClickFn:function(grid, rowIndex, e){
			}
		});
		daily.ck.guideline.centerPanel = function(config)
		{
			config['_makepn']['daily.ck.guideline.centerPanel'] = this;
			Ext.apply(this, config);
			this.config = config;
			this.eastPanel=new daily.ck.guideline.eastPanel(config);
			this.gridPanel=new daily.ck.guideline.gridPanel(config);
			var comboxStore = new Ext.data.Store({ 
			    	proxy:new Ext.data.HttpProxy({url:'../../servlet/healthRptAction?action=28&typeid='+this.sid}), 
			    	reader:new Ext.data.JsonReader({ 
			    		 totalProperty      : 'results',
			    		 root               : 'rows'
			    	}, 
			    	['SHORT_DESCRIPTION','INSTANCE_ID'] 
			    	) 
		    	}); 
		    this.ne_comBox=new Ext.form.ComboBox({
		        //id:'move-box',
		    	store:comboxStore, 
		    	fieldLabel:'text', 
		    	displayField:'SHORT_DESCRIPTION', 
		    	alySave:[],
		    	//typeAhead:true, 
		    	defValue:this.config.deNE_ID,
		    	width:300,
		    	loadingText: 'loading...',
		    	valueField:'INSTANCE_ID',   
		    	//value:this.config.deNE_NAME,
		    	//mode:'local', 
		    	emptyText:'选择维护的设备', 
		        triggerAction: 'all',
		        disabled:this.config.oprateFlag,
		        height:100,
		    	//selectOnFocus:true,
		    	//pageSize: 5,
		    	mode: 'remote',
		       // resizable: true,
		        readOnly: true,
		    	listeners:{
		    	   select:{
			 	             fn:this.onSelectFn,
			 	             scope:this
		 	            }
		    	}
		    	});
  //comboxStore.load({params:{start:0, limit:5}});  
 this.startDate = new Ext.form.DateField({
       id:'beginDate',
       format:'Y-m-d',
       readOnly: true,
       value:this.getDate(0),
       width:150
    });      
     this.cPanel=new Ext.Panel({
    	border:false,
    	region:'center',
    	autoScroll:true,
    	layout:'fit',
    	items:[this.gridPanel]
    	//height:150,
    	
    });
			daily.ck.guideline.centerPanel.superclass.constructor.call(this,
			{
				 border:false,
				 region:'center',
				 tbar:['检查时间：&nbsp;&nbsp;',this.startDate,'-','&nbsp;&nbsp;&nbsp;选择设备:',this.ne_comBox,'-','<font color=red>*&nbsp;单击结论列可以进行修改</font>','->','登记人：'+this.config.staffName,'-','&nbsp;&nbsp;登记时间：'+ this.startDate .getValue().format('Y-m-d')],
				layout:'border',
				items:[this.cPanel,this.eastPanel]
			});	
			
		};
		
		
		Ext.extend(daily.ck.guideline.centerPanel, Ext.Panel, {
		getDate : function(days)
		{
	         var myDate = new Date();
	         myDate.setDate(myDate.getDate()+days);
	         return myDate;
	     },
	     onSelectFn:function (ne_comBox){
	     	this.gridPanel.setDisabled(false);
	     	this.eastPanel.setDisabled(false);
	     	this.ne_comBox.defValue="selected";
	     	 var dt = new Date(this.startDate.getValue());
					     dt.setDate(dt.getDate()-1);
					     var dt2 = new Date(this.startDate.getValue());
					     dt2.setDate(dt2.getDate());
		    //linjl 2012-4-17
	        if(this.config.sid!='1111'){
		     	 var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			     xmlHttp.open("POST","../../../servlet/healthRptAction?action=59&typeid="
			     		+this.config.sid+"&ne_id="+this.ne_comBox.getValue()+"&startDate="+dt.format('Y-m-d')
			     		+"&endDate="+dt2.format('Y-m-d'),false);
			     xmlHttp.send();
			     var rsJson = xmlHttp.responseText;
			     rsJson = eval('('+rsJson+')');
			     this.eastPanel.diagnoseInfo.setValue(rsJson.MSG);
	        }
	        //end
			this.gridPanel.store.load({params:{daoType:this.config.oprateType,typeid:this.config.sid,ne_id:this.ne_comBox.getValue(),startDate:dt.format('Y-m-d'),endDate:dt2.format('Y-m-d')}});
	     }
		});
		//**************************************************
		daily.ck.guideline.MainPanel = function(config){
			Ext.apply(this, config);
			this.config = config;
			config['_makepn'] = {'MainPanel':this};
			this.northPanel = new daily.ck.guideline.northPanel(config);
			this.centerPanel = new daily.ck.guideline.centerPanel(config);
			
		daily.ck.guideline.MainPanel.superclass.constructor.call(this, {
				border:false,
				layout:'border',
				items:[this.northPanel,this.centerPanel],
				buttonAlign : 'center',
				title:config.ptitle,
				frame:true,
		        buttons : [{
					text : '保存',
					handler:this.subrptFn,
					pressed:true,
					//disabled:this.config.flag,
					scope:this
					
					
				}, {
					text : '取消',
					handler:function(){
						window.close();
					}
					
				}]
				
			});	
			
		};
		Ext.extend(daily.ck.guideline.MainPanel, Ext.Panel, {
			subrptFn:function (){
				var cp=this.centerPanel;
				if(cp.eastPanel.diagnoseInfo.getValue()==''){
						Ext.Msg.show({
									title : '验证错误',
									msg : '检查说明不为空!',
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.WARNING
									});
									return false;
				}
				var boxValue=this.centerPanel.ne_comBox.defValue;
				if(boxValue!='selected'){
					boxValue=this.config.deNE_ID;
				}else{
					boxValue=this.centerPanel.ne_comBox.getValue();
				}
				var alyS=this.centerPanel.ne_comBox.alySave;
		/*		for(i=0;i<alyS.length;i++){
					if(alyS[i]==boxValue){
							Ext.Msg.show({
									title : '重复填写',
									msg : '本次已经填写了该设备维护日志!',
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.CANCEL
									});
									return false;
					}
				}*/
				alyS.push(boxValue);
				var sXml=this.sendXml(boxValue);
				var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
					sendRequest.open("post",
							'../../servlet/healthRptAction?action=30&&daoType='+this.config.oprateType, false);
					sendRequest.send(sXml);
					if (sendRequest.readyState == 4 && sendRequest.status == 200) 
					 {
						var responseRoot = Ext.util.JSON
								.decode(sendRequest.responseText);
						if (responseRoot.success == true) 
						 {
						 	//alert(responseRoot.instId);
							Ext.Msg.show({
									title : '成功',
									msg : '设备维护日志已经增加!',
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.INFO
									});
					
							var gp=cp.ne_comBox;
					for (var i = 0; i < gp.store.getCount(); i++)
				{
					var r = gp.store.getAt(i);
					if(r.data.INSTANCE_ID==boxValue){
						gp.store.remove(r);
						break;
					}					
				}
					cp.ne_comBox.setValue("");
					if( gp.store.getCount()==0){
						cp.ne_comBox.setValue("本次已经全部填写完设备");
						cp.ne_comBox.setDisabled(true);
					}
					
					    cp.eastPanel.setDisabled(true);
					    cp.gridPanel.setDisabled(true);
					    cp.eastPanel.diagnoseInfo.reset();
							
						 } else {
						 	Ext.Msg.show({
									title : '失败',
									msg : '设备维护日志增加失败!',
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.ERROR
									});
							
						}
					 }
			},
	  sendXml : function(boxValue)
		{
			var sendXml = new ActiveXObject("Microsoft.XMLDOM");
			sendXml.loadXML("<?xml version='1.0' encoding='GBK'?><root/>");
			var root=sendXml.selectSingleNode("/root")
			var editRoot = sendXml.createElement("edit");
			root.appendChild(editRoot);
			var objects = sendXml.createElement('objects');
			var typeid = sendXml.createElement('TYPE_ID');
			typeid.text=this.config.sid;
			objects.appendChild(typeid);
			var neid = sendXml.createElement('NE_ID');
			neid.text=boxValue;
			objects.appendChild(neid);
			var stdate = sendXml.createElement('START_DATE');
			stdate.text=this.centerPanel.startDate .getValue().format('Y-m-d');
			objects.appendChild(stdate);
			var diaInfo = sendXml.createElement('DIAGNOSE_INFO');
			diaInfo.text=this.centerPanel.eastPanel.diagnoseInfo.getValue();
			objects.appendChild(diaInfo);
			//linjl 2012-4-18
			var itemId = sendXml.createElement('ITEMID');
			itemId.text = window.dialogArguments.itemid
			objects.appendChild(itemId);
			//end
			root.appendChild(objects);
			
			var gp=this.centerPanel.gridPanel;
			for (var i = 0; i< gp.store.getCount(); i++)
			 {
	                var r = gp.store.getAt(i);
					el = sendXml.createElement("guidLine");
					for (var c in r.data) 
					 {
					 	//if(c=='MSG_REMARK') {
					 	  el.setAttribute(c,xmlEncode(r.data[c]));
					 	//}
					 
							
					 }
					editRoot.appendChild(el);
			 }
			return sendXml;
		}
		});
				
				
				function initLoad()
					{
					  var w=window.screen.width-45 ;
	     	          var h=window.screen.height-85;
						var params = window.dialogArguments;
						var win;
						var mainPanel = new daily.ck.guideline.MainPanel(params);
						if (!win)
					       {
					        win =new Ext.Viewport({
					          layout:'fit',
					          title:params.ptitle,
					          items:[mainPanel]
					        })
					        
					        
					        /* win =new Ext.Window({
					        	id:'be-win',
					            layout:'fit',
					            iconCls:'objectIco',
						        collapsible:false,
						        closable:false,
						        draggable:false,
						        resizable:false,
						        modal:true,
						       // x:0,
						        y:0,
							    width :w,// 1000,//(Ext.getBody().getSize().width -50),
								height :h,//650,// (Ext.getBody().getSize().height-25),
								constrain:true,
						        items:[mainPanel]
					        });*/	 
					    }  
					    win.show(); 
					    //以下为默认加载
					    // var dt = new Date(mainPanel.centerPanel.startDate.getValue());
					     //dt.setDate(dt.getDate()-31);
					    // var dt2 = new Date(mainPanel.centerPanel.startDate.getValue());
					    // dt2.setDate(dt.getDate()-1);
					//mainPanel.centerPanel.gridPanel.store.load({params:{daoType:params.oprateType,typeid:params.sid,ne_id:params.deNE_ID,startDate:dt.format('Y-m-d'),endDate:dt2.format('Y-m-d')}});
					    var cp=mainPanel.centerPanel;
					    cp.eastPanel.setDisabled(true);
					    cp.gridPanel.setDisabled(true);
				}