	Ext.ns('duty.record.inst');
	Ext.onReady(dutyInst);
	function dutyInst()
	{	
		new duty.record.inst.instWin($request("dutyId"));
	};
	duty.record.inst.instWin=function(recordConfigID)
		{
			Ext.QuickTips.init();
		    Ext.form.Field.prototype.msgTarget = 'side';
			ds = new Ext.data.Store({
		        id:'hds',
				proxy: new Ext.data.HttpProxy({
		            url:'/servlet/dutyRecordConfig.do?method=dutyRecordModel&config='+recordConfigID
		        }),
		        reader: new Ext.data.JsonReader({
		        	root               : 'rows',
		            totalProperty      : 'results',
		            id: 'id'           
		        }, 
		            [
		            {name : 'COLNAME'},
		            {name : 'ISREQUEST'},
		            {name : 'INSTID'},
					{name : 'SORTNUM'},
					{name : 'COLDESCRIP'}
					]),
		      remoteSort: true,
		      listeners:{
					  load:{
							fn:function()
							{
								Ext.getCmp('COLNAME').setValue("");
								Ext.getCmp("fieldsetOne").setTitle("增加");
								Ext.getCmp('INSTID').setValue("0");
								Ext.getCmp('move-box').disable();
								Ext.getCmp('move-box').el.dom.value="移动到";
								Ext.getCmp('delCol-tbar').disable();
								Ext.getCmp('COLDESCRIP').setValue("");
								
							}
						 }		
			        }
		       });
		   
			function chiaREQUEST(value)
			{  
				if(value=='0BT')
					{
					 return "是";   
					}else{
						  return "否";   
						 } 
			}  
		    var colModel = new Ext.grid.ColumnModel([
			        {id:'COLNAME',header: "字段名称", width: 160, sortable: true, locked:false, dataIndex: 'COLNAME'},
			        {header: "是否必填", width: 75, dataIndex: 'ISREQUEST',renderer:chiaREQUEST},
			        {header: "INSTID", width: 75, sortable: true, dataIndex: 'INSTID',hidden:true},
			        {header: "SORTNUM", width: 75, sortable: true, dataIndex: 'SORTNUM',hidden:true},
			        {header: "COLDESCRIP", width: 75, sortable: true, dataIndex: 'COLDESCRIP',hidden:true}
		        ]);
		    var comboxStore = new Ext.data.Store({ 
			    	proxy:new Ext.data.HttpProxy({url:'/servlet/dutyRecordConfig.do?method=getcombox'}), 
			    	reader:new Ext.data.JsonReader({ 
			    	}, 
			    	['text','instID'] 
			    	) 
		    	}); 
		    
		    var moveBox=new Ext.form.ComboBox({ 
		        id:'move-box',
		    	store:comboxStore, 
		    	fieldLabel:'text', 
		    	displayField:'text', 
		    	typeAhead:true, 
		    	width:100,
		    	loadingText: 'loading...',
		    	valueField:'instID',    
		    	mode:'local', 
		    	triggerAction:'all', 
		    	emptyText:'移动到', 
		        triggerAction: 'all',
		        mode: 'local',
		        disabled:true,
		        height:100,
		    	selectOnFocus:true,
		    	listeners:{
		    	   select:{
			 	             fn:function (movb)
			 	             {
					        	Ext.Ajax.request({
					        		url :'/servlet/dutyRecordConfig.do?method=moveRow',//请求的服务器地址
					        		params : {beginInstid:Ext.getCmp("listGrid").getSelectionModel().getSelected().get("INSTID"),beginSortnum:Ext.getCmp("listGrid").getSelectionModel().getSelected().get("SORTNUM"),endInstid:movb.value},//请求参数
					        		callback : function(options,success,response)
					        		{
					        			var responseMove = Ext.util.JSON.decode(response.responseText); 
					        			if(responseMove.success==true)
						        			{
						        				 Ext.Msg.alert('成功',"["+Ext.getCmp("listGrid").getSelectionModel().getSelected().get("COLNAME")+']已经移动到'+movb.el.dom.value);
						        				 ds.load({params:{start:0, limit:5}});
					        			   }else{
					        				     	Ext.Msg.show({
														title : '错误提示',
														msg : '移动出错!',
														buttons : Ext.Msg.OK,
														icon : Ext.Msg.ERROR
														});
								        	 }
					        		}
					        	});
			                }
		 	            }
		    	}
		    	
		    	});
		    var gridForm = new Ext.FormPanel({
		        id: 'company-form',
		        frame: true,
		        labelAlign: 'left',
		        bodyStyle:'padding:5px;',
		        width: 600,
		        layout: 'column',	// Specifies that the items will now be arranged in columns
		        items: [{
		            columnWidth: 0.4,
		            layout: 'fit',
		            items: {
			            xtype: 'grid',
			            id:'listGrid',
			            frame:true, 
			            tbar:[{
					           pressed:true,text:'添加',iconCls:'addinst',handler:function()
																	               {
																		        		Ext.getCmp("fieldsetOne").setTitle("增加");
																		        		Ext.getCmp('INSTID').setValue("0");
																		                Ext.getCmp("saveid").setDisabled(false);
																		                Ext.getCmp('delCol-tbar').disable();
																		                Ext.getCmp('move-box').disable();
																		            	Ext.getCmp('COLNAME').setValue("");
																		            	Ext.getCmp('COLDESCRIP').setValue("");
																	               }
			                 },'-',
			                {
			                id:'delCol-tbar',pressed:true,text:'删除',iconCls:'delinst',disabled:true,handler:function()
																									               {
																									               	 Ext.MessageBox.confirm('删除','您确定要删除吗?',function (btn){
																									               	   if(btn=='yes')
																									               	   	{
																									               	   		Ext.Ajax.request({
																											        		url :'/servlet/dutyRecordConfig.do?method=delInst',
																											        		params : {INSTID:Ext.getCmp("listGrid").getSelectionModel().getSelected().get("INSTID")},
																											        		callback : function(options,success,response)
																											        			{
																												        			var responseArray = Ext.util.JSON.decode(response.responseText); 
																												        			if(responseArray.success==true)
																												        				{
																													        				 Ext.Msg.alert('成功',"["+Ext.getCmp("listGrid").getSelectionModel().getSelected().get("COLNAME")+']已经删除');
																													        				 ds.load({params:{start:0, limit:5}});
																												        			    }else{
																												        				     Ext.Msg.alert('失败','数据库交互繁忙');
																												        			    }
																											        		   }
																											        	      });
																									               	    }
																									               	 });
																									                
																								                	
																									               }
			                },'-',moveBox
			               
			                ],
			            ds: ds,
			            cm: colModel,
			            sm:new Ext.grid.RowSelectionModel({
				                singleSelect: true,
				                listeners: {
				                    rowselect: function(sm, row, rec) 
				                    { 
				                            var gd=Ext.getCmp("listGrid");
					                        Ext.getCmp("company-form").getForm().loadRecord(rec);
					                        Ext.getCmp("fieldsetOne").setTitle("修改["+gd.getSelectionModel().getSelected().get("COLNAME")+"]");
					                        Ext.getCmp('delCol-tbar').enable();
					                        Ext.getCmp("saveid").enable();
					                        if(gd.store.getTotalCount()>1)
						                        {
						                        	Ext.getCmp('move-box').enable();
						                        	comboxStore.load({params:{INSTID:gd.getSelectionModel().getSelected().get("INSTID"),config:recordConfigID}}); 
						                        }else{
						                        	Ext.getCmp('move-box').disable();
							                        }
				                    }
				                }
			            }),
			            autoExpandColumn: 'COLNAME',
			           // autoExpandColumn:2,
			            height: 200,
			            border: true,
				        listeners: {
						        	render: function(g)
						        	 {
						        		//g.getSelectionModel().selectRow(0);//加载第一个
						        	 },
						        	delay: 10
				                   },
				        buttonAlign         : 'right',
				        bbar                : new Ext.PagingToolbar({
				        id              : 'pagingbar',
				        pageSize        : 5,
				        emptyMsg:"没有数据显示",
				        store           : ds
				             })		
		        	}
		        },
		        {columnWidth: 0.1},
		          {
		        	columnWidth: 0.5,
		        	items:[{
		        		xtype: 'fieldset',
		                title:'增加',   
		                labelWidth: 60,
		                id:'fieldsetOne',
		                //buttonAlign:"center",
		                //defaults: {width: 140},	// Default config options for child items
		                //defaultType: 'textfield',
		                autoHeight: 80,//true,
		                items: [{
		                    fieldLabel: '字段名称',
		                    xtype:'textfield',
		                    name: 'COLNAME',
		                    allowBlank:false,//不允许为空
		                    blankText:'字段不能为空',
		                    id:'COLNAME'
		                    },{
		                fieldLabel: '字段描述',
		                xtype:'textfield',
		                name: 'COLDESCRIP',		                
		                id:'COLDESCRIP'
		            },
		                    {
		                        xtype:'hidden',
		                        name: 'INSTID',
		                        value:'0',
		                        id: 'INSTID'
		                        },
		        	{   
		                xtype:'radio',   
		                fieldLabel:'是否必填',   
		                boxLabel:'是',   
		                name:'ISREQUEST',   
		                id:'male', 
		                checked:true,
		                inputValue:'0BT',  
		                itemCls:'sex-male', //向左边浮动,处理控件横排   
		                clearCls:'allow-float'
		                //checked:true  
		            },{   
		                xtype:'radio',   
		                boxLabel:'否',   
		                name:'ISREQUEST',   
		                id:'female',
		                inputValue:'0BF',
		                //itemCls:'sex-female', //向左浮动,处理控件横排   
		                //clearCls:'allow-float', //不允许右边浮动   
		                hideLabel:true //不显示前面"性别"的标签   
		            }
		            ],
		            buttons:[{   
		                text:'保存',
		                id:'saveid',  
		                buttonAlign:'center', 
		                //disabled:true,
		                handler:saveInst
		            }]  
		           }
		        	]
		            
		        }
		        ]
		        
		    }); 
		   function saveInst(){
			   gridForm.form.submit({
				     clientValidation:true,
				     waitMsg:'提交数据请稍后……',
				     waitTitle:'提示',
				     url :'/servlet/dutyRecordConfig.do?method=saveUpdate',//请求的服务器地址
				     method:'post',
				     params:{configID:recordConfigID},
				     success:function(form,action)
				     {
					      if(action.result.success==true)
						      {
						    	  Ext.Msg.alert('提示','数据提交成功');
								  ds.load({params:{start:0, limit:5}});
						      }else{
						    	  Ext.Msg.alert('提示','数据交互失败');
							      }
				     },
				     failure:function(form,action)
				     {
				       Ext.Msg.alert('提示','未通过验证');
				     }
				     
				   });
			   }
		    ds.load({params:{start:0, limit:5}});
		    var win=new Ext.Window({
				title:'记录模版配置',
				items:[gridForm],
				maximizable:true,
				collapsible:true,
				closable:true,
				draggable:true,
				y:0,
				constrain:true,//则强制此window控制在viewport，默认为false
				width : 650,
				height : 300
			    });
			win.show();	
	}
