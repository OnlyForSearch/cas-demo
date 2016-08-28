	Ext.namespace("health.rpt");
	Ext.LoadMask.prototype.msg = "数据载入中...";
	Ext.BLANK_IMAGE_URL = '../../resource/js/ext-2.0.2/resources/images/default/s.gif';  
	
	//*************************************************************中间部分
	health.rpt.cTitlePanel = function(config){
		config['_makepn']['health.rpt.center.cTitlePanel'] = this;
	    Ext.apply(this, config);
	    this.config = config;
		health.rpt.cTitlePanel.superclass.constructor.call(this,
		{
			border:false,
			frame:true,
			height:80,
			html:"<table align='center'><tr><td><font  size=5><h1>"+this.config.bigTitle+"</h1></td></tr><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;——————"+this.config.prtTile+"</td></tr><table>"
		});	
	};
	
	Ext.extend(health.rpt.cTitlePanel, Ext.Panel,
	{
		
	});
	health.rpt.cListPanel = function(config)
		{
	        Ext.apply(this, config);
	        this.config = config;
	        this.locatName = new Ext.XTemplate(
			'<div><table width="150px" height="100%"><tbody><tr><td valign="middle"><br><br><br><br><br><br><br><br><br>{hrpoNa}</td></tr></tbody></table></div>' 
		);
		this.locatResult = new Ext.XTemplate(
	         '<div   style="width:100%"><br/><div align="left"><span>诊断科目：{verifySt}个</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>抽查指标：{verifyKpi}个</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>正常指标：{normalKpi}个</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>异常指标：{execeKpi}个</span></div>',
	         '<div align="center"><font color="#3d3ab6">———————————————————————————————————————————————————————————————————————————————————————————</font></div>',
	         '<div align="left">&nbsp;<span class="imgSpan" width="43%"><img src="{img1}" ext:qtip="双击图片可以查看详细信息"></span><span width="7%">&nbsp;&nbsp;&nbsp;</span><span class="imgSpan" width="50%"><img src="{img2}" ext:qtip="双击图片可以查看详细信息"></span></div></br>',
	         '<tpl if="this.isGirl(ststisInfo)">',
	         '<div align="center">——————————————————————————————————————改进建议——————————————————————————————————————————</div>',
	         '<div><table width="100%"><tbody><tr><td>{ststisInfo}</td></tr></tbody></table></div>',
	         '</tpl>',
		     '</div>',
		     {
			      isGirl: function(ststisInfo)
			      {
			      	var flag=true;
			      	if(ststisInfo=="")
			      	{
			      		flag=false;
			      	}
	                   return flag;
	               }
	
		     }
	    
	       );
	var loadM = new Ext.LoadMask(Ext.getBody(), {msg:"加载中..."});   
	this.locatResult.compile();
		        this.dsStore = new Ext.data.Store({
			           id:'hds',
					   proxy: new Ext.data.HttpProxy(new Ext.data.Connection({
		               url:'../../servlet/healthRptAction?action=22',
		               timeout: 300000,
		               method:'POST'
		              })),
			        reader: new Ext.data.JsonReader({
			        	root               : 'rows',
			          totalProperty      : 'results',
			            id: 'id'           
			        }, 
			            [
			            {name : 'hrpoId'},
			             {name :'hrpoNa'},
			            {name : 'verifySt'},
			            {name : 'verifyKpi'},
			            {name : 'normalKpi'},
			            {name : 'execeKpi'},
			            {name : 'img1'},
			            {name : 'neid'},
			            {name : 'img2'},
			            {name : 'ststisInfo'}
						]),
			      remoteSort: true
			       });
			      
			  var colModel = new Ext.grid.ColumnModel([
				        {header: "诊断对象",
				         renderer:(function(value, metadata, record, rowIndex, colIndex, store){
						 var data = record.data;
						 this.neid=data.neid;
						 var html = this.locatName.apply(data);
						 return html;
				      }).createDelegate(this), 
						//sortable: true,
						width:200
				        },
			 {header: "诊断结果", renderer:(function(value, metadata, record, rowIndex, colIndex, store){
					var data = record.data;
					var html = this.locatResult.apply(data);
					return html;
				}).createDelegate(this),
				width:1000
				}
				       
			        ]);
	health.rpt.cListPanel.superclass.constructor.call(this, 
		{
		    cm:colModel,
		    store:this.dsStore,
		   	border:false,
		    cls:'qp-center-centerGrid-panel',
		    pinstance_id:this.config.HEALTH_INSTANCE_ID,
		    neid:'',
		    listeners:
		    {
				rowdblclick:
				{
					fn:this.onRowDblClickFn,
					scope:this
		
				}		
		   },
	       tbar:[{text:this.config.subTitle,iconCls:'submitRpt',tooltip:'提交',pressed:true,handler:this.subRptFn,scope:this},'<b>开始时间：</b>'+ this.config.startDate, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;','<b>结束时间：</b>',this.config.endDate,'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;','->','<b>提交人:</b>'+this.config.subStaff+'&nbsp;&nbsp;&nbsp;&nbsp;','<b>诊断时间：</b>'+this.config.subDate+'&nbsp;&nbsp;'],
		   stripeRows			: true,
		   loadMask			: true,
	       height:500,
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
		});	
	};
	
	Ext.extend(health.rpt.cListPanel,Ext.grid.GridPanel, {
		getDate : function(days){
	         var myDate = new Date();
	         myDate.setDate(myDate.getDate()+days);
	         return myDate;
	
	     },
	     getNowDate:function ()
	     {
	     	var now=new Date();
	     	var todayString = now.format("Y-m-d H:m:s");
	        return todayString;
	     },
	     onRowDblClickFn:function(grid, rowIndex, e)
	     {
	     	var data1 = grid.getStore().getAt(rowIndex).data;
	     	data={
	     		uid:data1.hrpoId,
	     		hrpoId:data1.neid,
	     		hrpoNa:data1.hrpoNa,
	     		ststisInfo:data1.ststisInfo
	     	}
	     	var  params ={};
	     	params['data']=data;
	     	params.ptype="ckShow";
	     	params['startDate']=this.config.startDate;
	     	params['endDate']=this.config.endDate;
	     	var w=window.screen.width;
     	var h=window.screen.height;
			//window.showModalDialog("rptGuideline.html",params,"dialogWidth=1008px;dialogHeight=680px;help=0;scroll=0;status=0;");
			window.showModelessDialog("rptGuideline.html",params,"dialogWidth="+w+";dialogHeight="+h+";help=0;scroll=yes;status=0;resizable=yes;center=yes");
		},
		subRptFn:function (){
		        var  params ={};
					var sRequest = new ActiveXObject("Microsoft.XMLHTTP");
					sRequest.open("post",'../../servlet/healthRptAction?action=16&pinstance_id='+this.pinstance_id, false);
					sRequest.send(null);
					 if (sRequest.readyState==4 && sRequest.status==200)
					 {
					 		 var responseInfo= Ext.util.JSON.decode(sRequest.responseText);
					 		params['nowDate']=responseInfo.prt.submit_time;
					     	params['startDate']=responseInfo.prt.begin_time;
					     	params['endDate']=responseInfo.prt.end_time;
					     	params['prtTile']=responseInfo.prt.health_instance_name;
					     	params['ckPerson']=responseInfo.chekInfo;
					     	if(responseInfo.chekInfo=="")
					     	{
					     		params['flag']=false;
					     		var getDefalutRequest = new ActiveXObject("Microsoft.XMLHTTP");
								getDefalutRequest.open("post",'../../servlet/healthRptAction?action=23&pinstance_id='+this.pinstance_id, false);
								getDefalutRequest.send(null);
								if (getDefalutRequest.readyState==4 && getDefalutRequest.status==200)
								 {
								 	var backInfo=eval(getDefalutRequest.responseText);
								 	var tit=backInfo.prtTitle;
								 	params['prtTile']=tit[0].NE_NAME+"诊断报告";
								 	var pers=backInfo.persons;
								 	var ckPid="1,";
								 	var ckPname="admin、";
								 	for(i=0;i<pers.length;i++)
								 	{
								 		ckPid+=pers[i].STAFF_ID+",";
								 		ckPname+=pers[i].STAFF_NAME+"、";
								 	}
								 	params['ckPerson']=ckPname;
								 	params['ckPid']=ckPid;
								 }
					     	}else
					     	{
					     		params['flag']=true;
					     	}
					 }
					 
		        //今天做到这里
	     	params['pinstance_id']=this.pinstance_id;
	     	/*params['nowDate']=this.nowDate;
	     	params['startDate']=dt.format('Y-m-d H:i:s');
	     	params['endDate']=dt2.format('Y-m-d H:i:s');*/
	        window.showModalDialog("subitRptinfo.html",params,"dialogWidth=908px;dialogHeight=680px;help=0;scroll=0;status=0;");
		},
		aginLoad:function ()
		         {
			         this.pinstance_id="";
				     var dt = new Date(this.startDate.getValue());
				     var dt2 = new Date(this.endDate.getValue());
					 params={
						startDate:dt.format('Y-m-d H:i:s'),
						endDate:dt2.format('Y-m-d H:i:s'),
						ptype:'RPT'
				        }
					    
				    this.dsStore.load({params:params});
		         }  	
	});
	health.rpt.centerPanel = function(config)
	   {
		config['_makepn']['health.rpt.centerPanel'] = this;
	    Ext.apply(this, config);
	    this.config = config;
		this.ctPanel=new health.rpt.cTitlePanel(config);
		this.clPanel=new health.rpt.cListPanel(config);
			this.centerpanel = new Ext.Panel({
			border:false,
			region:'center',
			layout:'fit',
			items:[this.clPanel]
		});
		
		this.southpanel = new Ext.Panel({
			border:false,
			//collapseMode:'mini',
			split:true,
			region:'north',
			height:80,
			layout:'fit',
			items:[this.ctPanel]
		});
		health.rpt.centerPanel.superclass.constructor.call(this, {
			border:false,
			region:'center',
			layout:'border',
			items:[this.centerpanel,this.southpanel]
		});	
	};
	
	Ext.extend(health.rpt.centerPanel, Ext.Panel, {
		myPrint:function (){
			window.print();
		}
	});
	//*************************************************************
	health.rpt.MainPanel = function(config){
		config = config || {};
		config['_makepn'] = {'MainPanel':this};
		this.centerPanel = new health.rpt.centerPanel(config);
		health.rpt.MainPanel.superclass.constructor.call(this, {
			border:false,
			layout:'border',
			items:[this.centerPanel]
		});	
		
	};
	
	Ext.extend(health.rpt.MainPanel, Ext.Panel, {
		
	});
			function initLoad()
				{
					var win;
					var params1=getURLSearch();
					var  params ={};
					var sRequest = new ActiveXObject("Microsoft.XMLHTTP");
					sRequest.open("post",'../../servlet/healthRptAction?action=16&pinstance_id='+params1.HEALTH_INSTANCE_ID, false);
					sRequest.send(null);
					 if (sRequest.readyState==4 && sRequest.status==200)
					 {
					 	 var responseInfo= Ext.util.JSON.decode(sRequest.responseText);
					 		params['subDate']=responseInfo.prt.submit_time;
					     	params['startDate']=responseInfo.prt.begin_time;
					     	params['endDate']=responseInfo.prt.end_time;
					     	params['prtTile']=responseInfo.prt.health_instance_name;
					     	params['ckPerson']=responseInfo.chekInfo;
					     	params['subStaff']=responseInfo.prt.staff_name;
					     	
					     	if(responseInfo.chekInfo=="")
					     	{
					     		params['flag']=false;
					     		params['prtTile']='<font color="red">未来提交报告</font>';
					     	}else{
					     		params['flag']=true;
					     	}
					 }
					url ='../../servlet/healthRptAction?action=4&HrptBigTitle=HEALTH_RPT_BIG_TITLE';//请求的服务器地址
					var btitleRequest = new ActiveXObject("Microsoft.XMLHTTP");
					btitleRequest.open("post",url, false);
					btitleRequest.send(null);
					 if (btitleRequest.readyState==4 && btitleRequest.status==200)
					 {
					 		 var responseInfo= eval(btitleRequest.responseText);
					 		 params.bigTitle=responseInfo.bigtTitle;
					 }else{
					 	params.bigTitle="网元健康报告";
					 }
		               params.subTitle=params1.subTitle;
	                   params.HEALTH_INSTANCE_ID  = params1.HEALTH_INSTANCE_ID
	                  
					var mainPanel = new health.rpt.MainPanel(params);
					if (!win) 
						{
				        win = new Ext.Window({
				        	id:'be-win',
				            layout:'fit',
				            title:'健康报告',
					        collapsible:false,
					        closable:false,
					        draggable:false,
					        resizable:false,
					        modal:true,
					        x:0,
					        y:0,
						    width : Ext.getBody().getSize().width-25,
							height :Ext.getBody().getSize().height-10,
							constrain:true,
					        items:[mainPanel]
				        });	 
				    }           
				     win.show(); 
				     var gridLt=mainPanel.centerPanel.clPanel;
					 params=
					 	{
							HEALTH_INSTANCE_ID:params.HEALTH_INSTANCE_ID,
							ptype:'RPT'
					    } 
				     gridLt.dsStore.load({params:params});
			}