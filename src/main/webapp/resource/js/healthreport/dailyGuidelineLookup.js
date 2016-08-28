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
				 html:'<div style="width:100%"><table align="center"><tr><td align="center"><h3>'+this.config.bigTitle+'</h3></td></tr></table></div>',
				 frame:true
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
				frame:true,
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
									url : '../../servlet/healthRptAction?action=33'
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
		    	var disable = '<div style=" background: #C8C8C8;border: solid #C8C8C8 2px"  ext:qtip="双击可以修改" >'+val+'</div>';
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
       		}else{
       			colModel = new Ext.grid.ColumnModel([
				new Ext.grid.RowNumberer(), //序号		
				{header : '指标名称',dataIndex : 'KPI_NAME',sortable:true,width:250,menuDisabled : true}, 
				{header : '指标值',dataIndex : 'AVG_VALUE',sortable:true,width:150,menuDisabled : true}, 
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
		      //stripeRows			: true,
		        //cls:'qp-center-centerGrid-panel',
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
			
		};
		
		Ext.extend(daily.ck.guideline.gridPanel, Ext.grid.EditorGridPanel,
		{
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
			    	proxy:new Ext.data.HttpProxy({url:'../../servlet/healthRptAction?action=32&typeid='+this.sid}), 
			    	reader:new Ext.data.JsonReader({ 
			    		 totalProperty      : 'rowCount',
			    		 root               : 'rowSet'
			    	}, 
			    	['NE_NAME','DAILY_INSTANCE_ID'] 
			    	) 
		    	}); 
		    this.ne_comBox=new Ext.form.ComboBox({ 
		       // id:'move-box',
		    	store:comboxStore, 
		    	fieldLabel:'text', 
		    	displayField:'NE_NAME', 
		    	alySave:[],
		    	typeAhead:true, 
		    	defValue:this.config.deNE_ID,
		    	width:300,
		    	loadingText: 'loading...',
		    	valueField:'DAILY_INSTANCE_ID',   
		    	value:this.config.deNE_NAME,
		    	//mode:'local', 
		    	emptyText:'选择维护的设备', 
		        triggerAction: 'all',
		        disabled:this.config.oprateFlag,
		        height:100,
		    	selectOnFocus:true,
		    	pageSize: 5,
		    	mode: 'remote',
		        resizable: false,
		        readOnly: true,
		    	listeners:{
		    	   select:{
			 	             fn:this.onSelectFn,
			 	             scope:this
		 	            }
		    	}
		    	});
		    	comboxStore.load({params:{start:0, limit:5}});  
 this.startDate = new Ext.form.DateField({
       //id:'beginDate',
       format:'Y-m-d',
        readOnly: true,
       disabled: this.config.oprateFlag,
       value:this.config.beginTime,
       width:150
    });      
    this.staffName=new Ext.form.TextField({
    	 disabled: true,
    	value:this.config.staffName
    })
     this.subDateTime = new Ext.form.DateField({
       format:"Y-m-d H:i:s",
       disabled: true,
       value:this.config.submitTime,
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
    //linjl 2012-3-13
    this.qryDailyBtn = new Ext.Toolbar.Button({
				text : '查看稽核报告',
				tooltip : '查看稽核报告',
				iconCls : 'jobIco',//'icon-view',
				pressed : true,
				handler : this.qryDailyck,
				scope : this
	});
    //end
    //linjl 2012-3-13
    if(this.config.sid == '1111'){
        daily.ck.guideline.centerPanel.superclass.constructor.call(this,
			{
				 border:false,
				 region:'center',
				 tbar:['选择设备:&nbsp;&nbsp;',this.ne_comBox,'-','&nbsp;&nbsp;&nbsp;检查时间：',this.startDate,'->','登记人：', this.staffName,'-','&nbsp;&nbsp;登记时间：',this.subDateTime ],
				layout:'border',
				items:[this.cPanel,this.eastPanel]
			});	
	}else{
	    daily.ck.guideline.centerPanel.superclass.constructor.call(this,
			{
				 border:false,
				 region:'center',
				 tbar:['选择设备:&nbsp;&nbsp;',this.ne_comBox,'-','&nbsp;&nbsp;&nbsp;检查时间：',this.startDate,'->','登记人：', this.staffName,'-','&nbsp;&nbsp;登记时间：',this.subDateTime ],
				layout:'border',
				items:[this.cPanel,this.eastPanel]
			});	
	}
	//end	
		};
		
		Ext.extend(daily.ck.guideline.centerPanel, Ext.Panel, {
		getDate : function(days)
		{
	         var myDate = new Date();
	         myDate.setDate(myDate.getDate()+days);
	         return myDate;
	     },
	     onSelectFn:function (ne_comBox)
	     	{
					this.gridPanel.store.load({params:{instid:ne_comBox.getValue()}});
					var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
					sendRequest.open("post",
							'../../servlet/healthRptAction?action=34&&instid='+ne_comBox.getValue(), false);
					sendRequest.send(null);
					if (sendRequest.readyState == 4 && sendRequest.status == 200) 
					 {
						var responseRoot = Ext.util.JSON
								.decode(sendRequest.responseText);
						var instInfo=responseRoot.rows;
						this.eastPanel.diagnoseInfo.setValue(instInfo[0].CHECK_IDEA);
						this.startDate.setValue(instInfo[0].BEGIN_TIME);
						
						   this.staffName.setValue(instInfo[0].SUBMIT_PERSON);
                           this.subDateTime.setValue(instInfo[0].SUBMIT_TIME);
						//alert(.BEGIN_TIME);
					 }
	     },
	     //linjl 2012-3-13
		 qryDailyck:function(){
			var w = window.screen.width;
			var h = window.screen.height - 20;
		    var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlHttp.open("POST","../../servlet/commonservlet?tag=201&paramValue=" + getAESEncode(encodeURIComponent("select * from (select logic_analyze_rule_id,analyze_task_batch_id,ANALYZE_END_DATE,rownum M from ( "
 				+" select b.logic_analyze_rule_id,b.analyze_task_batch_id,b.ANALYZE_END_DATE from DAILY_INSTANCE a,ANALYZE_TASK_BATCH b "
 				+" where a.daily_instance_id="+this.config.deNE_ID+" and a.daily_vindicate_id="+this.config.sid
				+" and a.ne_id=b.logic_analyze_rule_id and b.ANALYZE_END_DATE>=to_date('"+this.config.beginTime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') "
				+" and b.ANALYZE_END_DATE<=to_date('"+this.config.beginTime+" 23:00:00','yyyy-mm-dd hh24:mi:ss') "
				+" order by b.ANALYZE_END_DATE DESC)) where M=1")),false);
			xmlHttp.send();
			var id1='',id2='';
			try{
		    id1 = xmlHttp.responseXML.selectSingleNode("/root/rowSet/LOGIC_ANALYZE_RULE_ID").text;
			id2 = xmlHttp.responseXML.selectSingleNode("/root/rowSet/ANALYZE_TASK_BATCH_ID").text;
			}catch(e){}
			alert("analyseTaskBatchId="+id2+" logicAnalyseRuleId="+id1);
			window.showModelessDialog("../../../workshop/logicaudit/infoList.jsp?logicAnalyseRuleId="+id1
				+"&type=&analyseTaskBatchId="+id2,null,"dialogWidth="+w+";dialogHeight="+h
				+";help=0;scroll=yes;status=0;resizable=yes;center=yes");
		 }
		//end
		});
		//**************************************************
		daily.ck.guideline.MainPanel = function(config){
			Ext.apply(this, config);
			this.config = config;
			config['_makepn'] = {'MainPanel':this};
			this.northPanel = new daily.ck.guideline.northPanel(config);
			this.centerPanel = new daily.ck.guideline.centerPanel(config);
			
			//linjl 2012-3-15 
			if(this.config.action_type=='audit'){
				//维护作业审批
			daily.ck.guideline.MainPanel.superclass.constructor.call(this, {
				border:false,
				layout:'border',
				items:[this.northPanel,this.centerPanel],
				buttonAlign : 'center'
			});	
			
			}else{
			   daily.ck.guideline.MainPanel.superclass.constructor.call(this, {
				border:false,
				layout:'border',
				items:[this.northPanel,this.centerPanel],
				buttonAlign : 'center',
		        buttons : [{
					text : '修改',
					handler:this.subrptFn,
					pressed:true,
					disabled:this.config.saveFlag,
					scope:this
				}, {
					text : '取消',
					handler:function(){
						window.close();
					}
					
				}]
			});	
			}
			//end
			
		};
		Ext.extend(daily.ck.guideline.MainPanel, Ext.Panel, {
			subrptFn:function (){
				if(this.centerPanel.eastPanel.diagnoseInfo.getValue()==''){
					Ext.Msg.show({
									title : '验证错误',
									msg : '检查说明不能为空!',
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.WARNING
									});
									return false;
				}
				/*var gp=this.centerPanel.gridPanel;
					for (var i = 0; i < gp.store.getCount(); i++)
				{
					var r = gp.store.getAt(i);
					alert(r.data.deType);
					//alert(r.get("CONCLUSION_TYPE"));
				}*/
				
				var boxValue=this.config.deNE_ID;
				var sXml=this.sendXml(boxValue);
				var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
					sendRequest.open("post",
							'../../servlet/healthRptAction?action=35', false);
					sendRequest.send(sXml);
					
					if (sendRequest.readyState == 4 && sendRequest.status == 200) 
					 {
						var responseRoot = Ext.util.JSON
								.decode(sendRequest.responseText);
						if (responseRoot.success == true) 
						 {
						 	//alert(responseRoot.instId);
						 	this.centerPanel.gridPanel.store.load(this.centerPanel.gridPanel.store.lastOptions);
						 		Ext.Msg.show({
									title : '成功',
									msg : '设备维护日志已经修改!',
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.INFO
									});
						
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
			var root = sendXml.createElement("root");
			sendXml.appendChild(root);
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
			root.appendChild(objects);
			var gp=this.centerPanel.gridPanel;
			 var record =gp.store.getModifiedRecords();
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
					        win = new Ext.Window({
//					        	id:'be-win',
					            layout:'fit',
					            title:params.ptitle,
						        collapsible:false,
						        closable:false,
						        draggable:false,
						        iconCls:'objectIco',
						        resizable:false,
						        modal:true,
						       // x:0,
						        y:0,
							    width :w,// 1000,//(Ext.getBody().getSize().width -50),
								height :h,//650,// (Ext.getBody().getSize().height-25),
								constrain:true,
						        items:[mainPanel]
					        });	 
					    }  
					    win.show(); 
					mainPanel.centerPanel.gridPanel.store.load({params:{instid:params.deNE_ID,typeid:params.sid}});
				}