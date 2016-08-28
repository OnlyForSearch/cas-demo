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
								Ext.getCmp("fieldsetOne").setTitle("����");
								Ext.getCmp('INSTID').setValue("0");
								Ext.getCmp('move-box').disable();
								Ext.getCmp('move-box').el.dom.value="�ƶ���";
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
					 return "��";   
					}else{
						  return "��";   
						 } 
			}  
		    var colModel = new Ext.grid.ColumnModel([
			        {id:'COLNAME',header: "�ֶ�����", width: 160, sortable: true, locked:false, dataIndex: 'COLNAME'},
			        {header: "�Ƿ����", width: 75, dataIndex: 'ISREQUEST',renderer:chiaREQUEST},
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
		    	emptyText:'�ƶ���', 
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
					        		url :'/servlet/dutyRecordConfig.do?method=moveRow',//����ķ�������ַ
					        		params : {beginInstid:Ext.getCmp("listGrid").getSelectionModel().getSelected().get("INSTID"),beginSortnum:Ext.getCmp("listGrid").getSelectionModel().getSelected().get("SORTNUM"),endInstid:movb.value},//�������
					        		callback : function(options,success,response)
					        		{
					        			var responseMove = Ext.util.JSON.decode(response.responseText); 
					        			if(responseMove.success==true)
						        			{
						        				 Ext.Msg.alert('�ɹ�',"["+Ext.getCmp("listGrid").getSelectionModel().getSelected().get("COLNAME")+']�Ѿ��ƶ���'+movb.el.dom.value);
						        				 ds.load({params:{start:0, limit:5}});
					        			   }else{
					        				     	Ext.Msg.show({
														title : '������ʾ',
														msg : '�ƶ�����!',
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
					           pressed:true,text:'���',iconCls:'addinst',handler:function()
																	               {
																		        		Ext.getCmp("fieldsetOne").setTitle("����");
																		        		Ext.getCmp('INSTID').setValue("0");
																		                Ext.getCmp("saveid").setDisabled(false);
																		                Ext.getCmp('delCol-tbar').disable();
																		                Ext.getCmp('move-box').disable();
																		            	Ext.getCmp('COLNAME').setValue("");
																		            	Ext.getCmp('COLDESCRIP').setValue("");
																	               }
			                 },'-',
			                {
			                id:'delCol-tbar',pressed:true,text:'ɾ��',iconCls:'delinst',disabled:true,handler:function()
																									               {
																									               	 Ext.MessageBox.confirm('ɾ��','��ȷ��Ҫɾ����?',function (btn){
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
																													        				 Ext.Msg.alert('�ɹ�',"["+Ext.getCmp("listGrid").getSelectionModel().getSelected().get("COLNAME")+']�Ѿ�ɾ��');
																													        				 ds.load({params:{start:0, limit:5}});
																												        			    }else{
																												        				     Ext.Msg.alert('ʧ��','���ݿ⽻����æ');
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
					                        Ext.getCmp("fieldsetOne").setTitle("�޸�["+gd.getSelectionModel().getSelected().get("COLNAME")+"]");
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
						        		//g.getSelectionModel().selectRow(0);//���ص�һ��
						        	 },
						        	delay: 10
				                   },
				        buttonAlign         : 'right',
				        bbar                : new Ext.PagingToolbar({
				        id              : 'pagingbar',
				        pageSize        : 5,
				        emptyMsg:"û��������ʾ",
				        store           : ds
				             })		
		        	}
		        },
		        {columnWidth: 0.1},
		          {
		        	columnWidth: 0.5,
		        	items:[{
		        		xtype: 'fieldset',
		                title:'����',   
		                labelWidth: 60,
		                id:'fieldsetOne',
		                //buttonAlign:"center",
		                //defaults: {width: 140},	// Default config options for child items
		                //defaultType: 'textfield',
		                autoHeight: 80,//true,
		                items: [{
		                    fieldLabel: '�ֶ�����',
		                    xtype:'textfield',
		                    name: 'COLNAME',
		                    allowBlank:false,//������Ϊ��
		                    blankText:'�ֶβ���Ϊ��',
		                    id:'COLNAME'
		                    },{
		                fieldLabel: '�ֶ�����',
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
		                fieldLabel:'�Ƿ����',   
		                boxLabel:'��',   
		                name:'ISREQUEST',   
		                id:'male', 
		                checked:true,
		                inputValue:'0BT',  
		                itemCls:'sex-male', //����߸���,����ؼ�����   
		                clearCls:'allow-float'
		                //checked:true  
		            },{   
		                xtype:'radio',   
		                boxLabel:'��',   
		                name:'ISREQUEST',   
		                id:'female',
		                inputValue:'0BF',
		                //itemCls:'sex-female', //���󸡶�,����ؼ�����   
		                //clearCls:'allow-float', //�������ұ߸���   
		                hideLabel:true //����ʾǰ��"�Ա�"�ı�ǩ   
		            }
		            ],
		            buttons:[{   
		                text:'����',
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
				     waitMsg:'�ύ�������Ժ󡭡�',
				     waitTitle:'��ʾ',
				     url :'/servlet/dutyRecordConfig.do?method=saveUpdate',//����ķ�������ַ
				     method:'post',
				     params:{configID:recordConfigID},
				     success:function(form,action)
				     {
					      if(action.result.success==true)
						      {
						    	  Ext.Msg.alert('��ʾ','�����ύ�ɹ�');
								  ds.load({params:{start:0, limit:5}});
						      }else{
						    	  Ext.Msg.alert('��ʾ','���ݽ���ʧ��');
							      }
				     },
				     failure:function(form,action)
				     {
				       Ext.Msg.alert('��ʾ','δͨ����֤');
				     }
				     
				   });
			   }
		    ds.load({params:{start:0, limit:5}});
		    var win=new Ext.Window({
				title:'��¼ģ������',
				items:[gridForm],
				maximizable:true,
				collapsible:true,
				closable:true,
				draggable:true,
				y:0,
				constrain:true,//��ǿ�ƴ�window������viewport��Ĭ��Ϊfalse
				width : 650,
				height : 300
			    });
			win.show();	
	}
