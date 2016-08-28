		Ext.namespace("health.rpt.guideline");
		
		health.rpt.guideline.northPanel = function(config)
		{
			config['_makepn']['health.rpt.guideline.northPanel'] = this;
			Ext.apply(this, config);
			this.config = config;
			health.rpt.guideline.northPanel.superclass.constructor.call(this,
			{
				 border:false,
				 region:'north',
				 html:'<div style="width:100%"><table align="center"><tr><td align="center"><h4>'+config.data.hrpoNa+'网元指标统计信息'+'</h4></td></tr></table></div>',
				 frame:true
				//layout:'border',
				//items:[this.typePanel,this.centerPanel]
			});	
			
		};
		
		Ext.extend(health.rpt.guideline.northPanel, Ext.Panel, {});
	health.rpt.guideline.infoWin = function(config)
	{
		config['_makepn']['health.rpt.guideline.infoWin'] = this;
		Ext.apply(this, config);
		this.config = config;
			var sm = new Ext.grid.CheckboxSelectionModel();
				var fields = [
				   {name : 'SID'}, 
				   {name : 'KPI_ID'}, 
		           {name : 'FLOW_ID'}, 
			       {name : 'NE_ID'}, 
			       {name : 'REGION_NAME'}, 
				   {name : 'OPRTSTATE'},
				   {name : 'ALARMSTATE'},
				   {name : 'ALARMLEVEL'},
				   {name : 'PERF_MSG_ID'},
				   {name : 'ALARMCLASS'},
				   {name : 'GENERATEDATE'},
				   {name : 'LASTDATE'},
				   {name : 'DR_NAME'},
				   {name : 'ALARM_TYPE'},
				   {name : 'NE_NAME'},
				   {name : 'DATASOURCE'},
				   {name : 'KPI_VALUE'},
				   {name : 'MODULE_CODE'},
				   {name : 'KPI_NAME'},
				   {name : 'GENERATE_TIME'},
				   {name : 'LAST_GENERATE_TIME'},
				   {name : 'ALARM_TIMES'},
				   {name : 'OPRT_STATE'},
				   {name : 'ALARM_STATE'},
				   {name : 'FLOW_OPERATOR'},
				   {name : 'EXECUTETIM'}
				   ];
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
			{header : '所属中心',dataIndex : 'REGION_NAME',sortable:true,width:100,menuDisabled : true},
			{header : '告警类型 ',dataIndex : 'ALARM_TYPE',sortable:true,width:100,menuDisabled : true},
			{header : '网元  ',dataIndex : 'NE_NAME',sortable:true,width:100,menuDisabled : true},
			{header : '数据来源 ',dataIndex : 'DATASOURCE',sortable:true,width:100,menuDisabled : true},
			{header : 'KPI值  ',dataIndex : 'KPI_VALUE',sortable:true,width:100,menuDisabled : true},
			{header : '模块  ',dataIndex : 'MODULE_CODE',sortable:true,width:100,menuDisabled : true},
			{header : 'KPI',dataIndex : 'KPI_NAME',sortable:true,width:100,menuDisabled : true},
			{header : '产生时间  ',dataIndex : 'GENERATE_TIME',sortable:true,width:100,menuDisabled : true},
			{header : '最后时间  ',dataIndex : 'LAST_GENERATE_TIME',sortable:true,width:100,menuDisabled : true},
			{header : '次数   ',dataIndex : 'ALARM_TIMES',sortable:true,width:100,menuDisabled : true},
			{header : '操作状态   ',dataIndex : 'OPRT_STATE',sortable:true,width:100,menuDisabled : true},
			{header : '告警状态   ',dataIndex : 'ALARM_STATE',sortable:true,width:100,menuDisabled : true},
			{header : '故障单受理人  ',dataIndex : 'FLOW_OPERATOR',sortable:true,width:100,menuDisabled : true},
			{header : '处理时间   ',dataIndex : 'EXECUTETIM',sortable:true,width:100,menuDisabled : true}
		]);
	   io_store = new Ext.data.Store({
	   //	autoLoad:true,
	                proxy : new Ext.data.HttpProxy({
						url : '../../servlet/healthRptAction?action=25'
							}),
							reader: new Ext.data.JsonReader({
								root	: 'rowSet',
								totalProperty :'rowCount',
								id		: 'VALUE',
								fields:fields
							}),
					remoteSort : false
	    });
	   // io_store.load({params:{start:0, limit:20}});
		this.infoGrid=new Ext.grid.GridPanel({
		  stripeRows			: true,
	       cm:colModel,
	       loadMask            : true,
	       store: io_store,
	       width:1808,
	       border:false,
	       height:507,
	       bbar                : new Ext.PagingToolbar({
					         id              : 'pagingbar',
					         pageSize        : 25,
					         emptyMsg:"没有数据显示",
					         store           : io_store,
					         displayInfo     : true,
	                         displayMsg : '显示第 {0} 条到 {1} 条记录，一共 {2} 条'
					             })	,
	       viewConfig : {   
	                forceFit : false,   
	                rowSelectorDepth:100
	       },
	        listeners:{
				rowdblclick:{
					fn:this.onRowDblClickFn,
					scope:this
		
				}
	       }
		});
	    this.myGridPanel=new Ext.Panel({
	        		width:760,
	        		border:false,
	        		autoScroll:true,
	        		iconCls : "gaoJguanl",
	        		title:'指标相关告警',
	        		pid:0,
	        		height:600,
	        		//layout:'fit',
	        		items:[this.infoGrid]
	        	})
	     this.dsStore = new Ext.data.Store({
		        proxy: new Ext.data.HttpProxy(new Ext.data.Connection({
               url:'../../servlet/healthRptAction?action=5',
               timeout: 300000,
               method:'POST'
                })),
		        reader: new Ext.data.JsonReader({
		        	root               : 'rows'
		        }, 
		            [
		            {name :'imgPath'}
					])
		       });
		        this.locatName = new Ext.XTemplate(
		     '<table><tbody><tr><td valign="middle"><img src={imgPath} ></td></tr></tbody></table>' 
	);
		     var colModel = new Ext.grid.ColumnModel([
			{   
			header: "", renderer:(function(value, metadata, record, rowIndex, colIndex, store)
			        {
						var data = record.data;
						var html = this.locatName.apply(data);
						return html;
					}
				).createDelegate(this),
				width:980
			}
			       
		        ]);
	  this.tmpPanel=new Ext.grid.GridPanel({
				  	cm:colModel,
				  	title:'采样曲线图',
			        store:this.dsStore,
			       	border:false,
			       	pid:1,
			        cls:'qp-center-centerGrid-panel',
	        		height:630,
	        		iconCls : "reportIco",
	        		border:false,
					loadMask			: {msg:'图片加载中....'},
					viewConfig : {   
			                forceFit : false,   
			                rowSelectorDepth:100,
			                getRowClass : function(record,rowIndex,rowParams,store){   
			                   var colorr="";
			                   if(rowIndex%2==0)
			                  {
			                     colorr='qp-x-grid3-row1';
			                  }else{
			                  	colorr='qp-x-grid3-row2';
			                  }
			                    return colorr;
			                }
			            }
	        	})
	     this.rulePanel=new Ext.Panel({
	        		height:600,
	        		width:500,
	        		pid:2,
	        		iconCls : "kouFenMx",
	        		border:false,
	        		autoWidth:true,
	        		autoScroll:true,
	        		html:'这边显示指标扣分明细规则',
	        		title:'扣分明细规则'
	        	})
	     this.availableDesc=new Ext.form.TextField({
			    	fieldLabel:"当前可用度",
			    	style : 'margin:0,0,2,0',
			    	anchor:'55%'
			    	
			    })
	    this.availableOrd=new Ext.form.Hidden({id:'availableOrd_id'})
	    this.htmleE=new Ext.form.TextArea({
			    	fieldLabel:"建议信息",
			    	style : 'margin:0,0,2,0',
			    	anchor:'95%',
			    	height:330
			    })
	    this.savantForm=new Ext.form.FormPanel({//专家建议
	        		frame:true,
	        		border:true,
	        		labelWidth:100,
					height:400,
					pid:3,
			        labelPad : 0,
			        buttonAlign : 'center',
			        buttons:[{text:'保存',handler:this.addSavantFn,scope:this}],
	        		//autoWidth:true,
	        		//autoScroll:true,
	        		items:[ this.availableOrd,this.availableDesc,this.htmleE]
	        	}) 
	      this.savantPanel=new Ext.Panel({
	        		height:500,
	        		width:500,
	        		frame:true,
	        		iconCls : "savantx",
	        		pid:3,
	        		title:'专家建议',
	        		border:false,
	        	    layout:'column',
	        		items:[{border:true,columnWidth:.7,layout:'fit',items:[this.savantForm]},{frame:false,border:false,columnWidth:.3,html:'&nbsp;'}]
	        		
	        		
	        	})
		this.showTab=new Ext.TabPanel({
			//activeTab: 1,
	        deferredRender:false,
	        //autoScroll:true,
	        listeners:{
		    tabchange:{
			fn:this.tabChangeFn,
            scope : this
		     }		
	        },
	        /*enableTabScroll:true,
	         height:250,
	        monitorResize: true,
	        layoutOnTabChange:true,*/
	        tabPosition: 'top',
			items:[this.myGridPanel,this.tmpPanel,this.rulePanel,this.savantPanel]
		})
		health.rpt.guideline.infoWin.superclass.constructor.call(this, {
			 closeAction:'hide',
			 width:1000,
			 layout:'fit',
			 iconCls : "zhibiao",
			 resizable:false,
			 ckKpi:{},
			 items:[this.showTab],
			listeners:{
			    beforehide:{
				fn:this.onBeforehideFn.createDelegate(this),
	            scope : true
			       }		
	        },
			 height:630,
			 buttonAlign:'right',
			 buttons:[{text:'关闭',iconCls:'winClose',handler:this.onWinCloseFn,scope:this}]
		});	
		
	};
	
	Ext.extend(health.rpt.guideline.infoWin, Ext.Window, {
		addSavantFn:function(){
			if(this.htmleE.getValue()==''){
				alert('专家建议为空不能保存');
				return false;
			}
			var sendXml = new ActiveXObject("Microsoft.XMLDOM");
			var root = sendXml.createElement("root");
			sendXml.appendChild(root);
			var objects = sendXml.createElement('objects');
			var kpi_id = sendXml.createElement('kpi_id');
			kpi_id.text=this.ckKpi['KPI_ID'];
			objects.appendChild(kpi_id);
			var availableOrd = sendXml.createElement('availableOrd');
			availableOrd.text=this.ckKpi['AVAILABLE_ORD'];
			objects.appendChild(availableOrd);
			var savantInfo = sendXml.createElement('savantInfo');
			savantInfo.text=this.htmleE.getValue();
			objects.appendChild(savantInfo);
			root.appendChild(objects);
			var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
					sendRequest.open("post",
							'../../servlet/healthRptAction?action=44', false);
					sendRequest.send(sendXml);
					
					if (sendRequest.readyState == 4 && sendRequest.status == 200) 
					 {
						var responseRoot = Ext.util.JSON
								.decode(sendRequest.responseText);
						if (responseRoot.success == true) 
						 {
						 	alert('建议保存成功');
						
						 } else {
						 		
							alert('建议保存失败');
						}
					 }
			 // var sendRequest = Ext.lib.Ajax.request('POST', '../../servlet/healthRptAction?action=44', {success : function(request) {alert(request.responseText)}}, sendXml, {async:false});
				
			
             
		},
		tabChangeFn:function(tabpanel, panel){
			var win=tabpanel.ownerCt;
			
		//alert(panel.pid);g
			//alert(.ckKpi['NE_ID']);
			switch(panel.pid){
				case 0:
				win.infoGrid.store.load({params:{start:0, limit:25,KPI_ID:win.ckKpi.KPI_ID,NE_ID:win.ckKpi.NE_ID}});
				break;
				case 1:
				var data=win.ckKpi;
				var  imgPath="该指标采样曲线图";
		     	var subPar=new Array();
		    	var str_a1=win.config['startDate'];  
				var str_a1x2=str_a1.split(' ');
				var str_a2=win.config['endDate'];  
				var str_a2x2=str_a2.split(' ');
				var a1d=str_a1x2[0].split("-");
				var a2d=str_a2x2[0].split("-");
				var rulea1=a1d[1]+"/"+a1d[2]+"/"+a1d[0]+"  "+str_a1x2[1];
				var rulea2=a2d[1]+"/"+a2d[2]+"/"+a2d[0]+"  "+str_a2x2[1];
				var cha= (Date.parse(rulea1)-Date.parse(rulea2))/1000/60/60;
				if(Math.abs(cha)>25){
				   rulea1="DAY";
				}else{
				   rulea1="HOUR";
				}
		     	params={
				p_count_type:rulea1,
				beginDate:win.config['startDate'],
				endDate:win.config['endDate'],
				p_ne_id:data.NE_ID,
				p_kpi_id:data.KPI_ID,
				kpi_name:data.KPI_NAME
			   }
			   win.tmpPanel.store.load({params:params});
				break;
				case 2:
				win.showTab.setActiveTab(2);
				win.rulePanel.body.update('<table><tr><td>'+win.ckKpi['SCORE_DETAIL']+'</td></tr></table>');
				break;
				case 3:
				
				gridP=this._makepn['health.rpt.guideline.gridPanel'];
				win.ckKpi['EXP_ADVISE_INFO']=gridP.getSavantFn_(win.ckKpi['AVAILABLE_ORD'],win.ckKpi['KPI_ID']);
				win.showTab.setActiveTab(3);
				win.htmleE.setValue(win.ckKpi['EXP_ADVISE_INFO']);
				win.availableDesc.setValue(win.ckKpi['AVAILABLE_DESC']);
				win.availableOrd.setValue(win.ckKpi['AVAILABLE_ORD']);
				win.availableDesc.setDisabled(true);
				//win.rulePanel.body.update('<table><tr><td>'+win.ckKpi['SCORE_DETAIL']+'</td></tr></table>');
				break;
			}
		
	   },
	   onBeforehideFn:function (){
	   this.showTab.setActiveTab(2);
	   },
		    onWinCloseFn:function(){
		    	this.hide();
		    },
			onRowDblClickFn:function(grid, rowIndex, e){
				var datas=grid.getStore().getAt(rowIndex).data;
				var alarmId=datas.SID;
				window.open("../alarmManage/viewAlarmInfo.htm?alarmId="+alarmId+"&flag=''",'_blank',"resizable=1,scrollbars=1,top=0,left=0,help=0,status=0");
		                     }
	});
		health.rpt.guideline.gridPanel = function(config)
		  {
			config['_makepn']['health.rpt.guideline.gridPanel'] = this;
			Ext.apply(this, config);
			this.config = config;
			Ext.QuickTips.init();
			this.infoWin=new health.rpt.guideline.infoWin(config);
			this.rightClick = new Ext.menu.Menu({
		    id:'rightClickCont', 
		    items: [
		        {
		            id: 'rMenu1',
		            vid:2,
		            handler: this.onRuleInfoFn,
		            iconCls : "kouFenMx",
		            scope:this,
		            text: '查看扣分明细规则'
		           
		        },'-',
		        {
		            id: 'rMenu2',
		            vid:2,
		            iconCls : "reportIco",
		            handler: this.onGetimgFn,
		            scope:this,
		            text: '指标采样图'
		        },'-',
		        {
		            id: 'rMenu3',
		            vid:2,
		            iconCls : "savantx",
		            handler: this.onGetSavantFn,
		            scope:this,
		            text: '专家建议'
		        }
		    ]
		});

			var fields = [
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
					   {name : 'AVAILABLE_DESC'},
					   {name : 'STATIS_INFO'},
					   {name : 'END_TIME'},
					   {name : 'BEGIN_TIME'},
					   {name : 'MSG_REMARK'},
					   {name : 'SCORE_DETAIL'},
					   {name : 'AVAILABLE_ORD'},
					   {name : 'EXP_ADVISE_INFO'}
					   
					   ];
			 function showImage(val)
			    {
			 	  if(val=="")
				 	{
				 		val="中";
				 	}
			 if(val=="低")
			    {
			 		val="<font color=red>"+val+"</font>";
			 	}else if(val=="不可用")
			 	{
			 		val="<font color=red>"+val+"</font>";
			 	}
		    	var disable = '<table  ext:qtip="<div>10:中</div><div>20:低</div><div>50:可用</div><div>60:不可用</div>"><tr><td><br/>'+val+'</td></tr></table>';
		            return disable;
		    };
		      function show_kpiName(val)
		     {
		    	var disable = '<table><tr><td><br/>'+val+'</td></tr></table>';
		            return disable;
		     };
		     function showInfo(val)
		     {
		    	var disable = '<table style="padding:10"><tr><td>'+val+'</td></tr></table>';
		            return disable;
		     };
		     function msgInfo(val)
		     {
		    	var disable = '<table><tr><td><div><textarea rows="5" readonly="readonly" cols="100">'+val+'</textarea></div></td></tr></table>';
		            return disable;
		     };
		     
			var colModel = new Ext.grid.ColumnModel([
				new Ext.grid.RowNumberer(), //序号		
				{header : '指标名称',dataIndex : 'KPI_NAME',sortable:true,width:90,menuDisabled : true,renderer: show_kpiName}, 
				{header : '科目',dataIndex : 'KPI_GROUP_NAME',sortable:true,menuDisabled : true}, 
				{header : '平均值',dataIndex : 'AVG_VALUE',sortable:true,width:60,menuDisabled : true,renderer: show_kpiName}, 
				{header : '最大值',dataIndex : 'MAX_VALUE',sortable:true,width:65,menuDisabled : true,renderer: show_kpiName},
				{header : '最小值',dataIndex : 'MIN_VALUE',sortable:true,width:65,menuDisabled : true,renderer: show_kpiName},
				{header : '可用度',dataIndex : 'AVAILABLE_DESC',sortable:true,width:45,menuDisabled : true, renderer: showImage, hideable: false},
				{header : '系统诊断结果',dataIndex : 'STATIS_INFO',sortable:true,width:180,menuDisabled : true,renderer: showInfo},
				{header : '消息备注',dataIndex : 'MSG_REMARK',sortable:true,width:450,menuDisabled : true,renderer: showInfo}
				
			]);
		    var store = new Ext.data.GroupingStore({
		               proxy : new Ext.data.HttpProxy({
									url : '../../servlet/healthRptAction?action=3'
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
		//store.load({params:{uid:this.config.data.uid,neid:this.config.data.hrpoId,ptype:this.config.ptype,pid:this.config.data.uid}});
			health.rpt.guideline.gridPanel.superclass.constructor.call(this, {
			   border:false,
		       store: store,
		       stripeRows			: true,
		       cm:colModel,
		       loadMask            : {msg:'数据加载中...'},
		       listeners:
		       	{
					rowdblclick:
					{
						fn:this.onRowDblClickFn,
						scope:this
					},
					rowcontextmenu:{
					    fn:this.rightClickFn,
					    scope:this
					}
		       },
		        view: new Ext.grid.GroupingView({
		        	id:'groupingView1',
		        	forceFit:false,
		        	rowSelectorDepth:100,
		        	groupTextTpl:'{text}({[values.rs.length]}条)',
		        	groupByText:'使用当前字段进行分组',
		        	showGroupsText:'表格分组',
		        	showGroupName:true,
		        	startColapsed:true,
		        	hideGroupedColumn:true
		        })
			});	
			
		};
		
		Ext.extend(health.rpt.guideline.gridPanel, Ext.grid.GridPanel,
		{
			testFn:function(){
				alert('test');
			},
			getSavantFn_:function(ord,kpi_id){
				   var sendRequestSavant = new ActiveXObject("Microsoft.XMLHTTP");
					sendRequestSavant.open("post",
							'../../servlet/healthRptAction?action=45&availableOrd='+ord+'&kpi_id='+kpi_id, false);
					sendRequestSavant.send(null);
					var backDate = Ext.util.JSON.decode(sendRequestSavant.responseText);
					return backDate.savantInfo;
								
			},
			onGetimgFn:function(){
				r=this.infoWin.ckKpi;
				this.infoWin.show();
				this.infoWin.setTitle(this.infoWin.ckKpi.KPI_NAME);
				this.infoWin.showTab.setActiveTab(1);
				
			},
			onGetSavantFn:function(){
				r=this.infoWin.ckKpi;
				this.infoWin.show();
				this.infoWin.setTitle(this.infoWin.ckKpi.KPI_NAME);
				this.infoWin.showTab.setActiveTab(3);
				r['EXP_ADVISE_INFO']=this.getSavantFn_(r['AVAILABLE_ORD'],r['KPI_ID']);
				this.infoWin.htmleE.setValue(r['EXP_ADVISE_INFO']);
				this.infoWin.availableDesc.setValue(r['AVAILABLE_DESC']);
				this.infoWin.availableOrd.setValue(r['AVAILABLE_ORD']);
				this.infoWin.availableDesc.setDisabled(true);
				//this.infoWin.savantPanel.body.update('<table><tr><td>'+r['AVAILABLE_ORD']+'</td></tr></table>');
			},
			onRuleInfoFn:function (){
				r=this.infoWin.ckKpi;
				this.infoWin.show();
				this.infoWin.setTitle(this.infoWin.ckKpi.KPI_NAME);
				this.infoWin.showTab.setActiveTab(2);
				this.infoWin.rulePanel.body.update('<table><tr><td>'+r['SCORE_DETAIL']+'</td></tr></table>');
			},
			rightClickFn:function (grid,rowindex,e){
			    e.preventDefault();
			    this.rightClick.showAt(e.getXY());
			    this.infoWin.ckKpi=grid.store.getAt(rowindex).data;
			},

		     onRowDblClickFn:function(grid, rowIndex, e){
		     	this.infoWin.ckKpi=grid.getStore().getAt(rowIndex).data;
		     	this.infoWin.show();
		     	this.infoWin.setTitle(this.infoWin.ckKpi.KPI_NAME);
		     	this.infoWin.showTab.setActiveTab(1);
			}
		});
		health.rpt.guideline.centerPanel = function(config)
		   {
			config['_makepn']['health.rpt.guideline.center'] = this;
			Ext.apply(this, config);
			this.config = config;
			this.gridPanel=new health.rpt.guideline.gridPanel(config);
			health.rpt.guideline.centerPanel.superclass.constructor.call(this, {
				border:false,
				// region:'center',
				 layout:'fit',
				 items:[this.gridPanel]
				//layout:'border',
				//items:[this.typePanel,this.centerPanel]
			});	
			
		};
		
		Ext.extend(health.rpt.guideline.centerPanel, Ext.Panel, {});
		health.rpt.guideline.eastPanel = function(config){
			config['_makepn']['health.rpt.guideline.east'] = this;
			Ext.apply(this, config);
			this.config = config;
			if(config.data.ststisInfo==''){
				config.data.ststisInfo="该网元没有异常建议信息";
			}
			health.rpt.guideline.eastPanel.superclass.constructor.call(this,
			{
				border:false,
			    region:'east',
				width:200,
				collapsible:true,
				collapsed:false,
				collapseMode:'mini',
				split:true,
				autoScroll:true,
				title:'网元建议信息',
				html:'<div>&nbsp;&nbsp;'+config.data.ststisInfo+'</div>'
			});	
			
		};
		Ext.extend(health.rpt.guideline.eastPanel, Ext.Panel, {});
		
		//**************************************************
		health.rpt.guideline.MainPanel = function(config){
			config = config || {};
			config['_makepn'] = {'MainPanel':this};
			this.northPanel = new health.rpt.guideline.northPanel(config);
			this.listPanel = new health.rpt.guideline.centerPanel(config);
			this.eastPanel = new health.rpt.guideline.eastPanel(config);
			this.gridPanel = new Ext.Panel({
				border:false,
				split:true,
				region:'center',
				height:60,
				layout:'fit',
				items:[this.listPanel]
			});
			this.centercPanel = new Ext.Panel({
				border:false,
				//collapseMode:'mini',
				split:true,
				region:'center',
				tbar:['时间段：'+config.startDate,'至'+config.endDate],
				height:60,
				layout:'border',
				items:[this.gridPanel,this.eastPanel]
			});
			
			health.rpt.guideline.MainPanel.superclass.constructor.call(this, {
				border:false,
				layout:'border',
				items:[this.northPanel,this.centercPanel]
			});	
			
		};
		Ext.extend(health.rpt.guideline.MainPanel, Ext.Panel, {});
				
				
				function initLoad()
					{
					  var w=window.screen.width-45 ;
	     	          var h=window.screen.height-85;
						var params = window.dialogArguments;
						var win;
						var mainPanel = new health.rpt.guideline.MainPanel(params);
						if (!win)
					       {
					        win = new Ext.Window({
					        	id:'be-win',
					            layout:'fit',
					            title:params.data.hrpoNa,
						        collapsible:false,
						        closable:false,
						        draggable:false,
						        resizable:false,
						        iconCls:'objectIco',
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
					 mainPanel.listPanel.gridPanel.store.load({params:{uid:params.data.uid,neid:params.data.hrpoId,ptype:params.ptype,pid:params.data.uid}});;
				}