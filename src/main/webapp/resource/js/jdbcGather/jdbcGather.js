Ext.BLANK_IMAGE_URL = '/resource/js/ext-2.0.2/resources/images/default/s.gif';
Ext.QuickTips.init();
Ext.onReady(initExt);

var curStaffId = getCurrentUserInfo('staff_id');

var Global = {
	levelopp : 0,
	dsopp : 0,
	newService:0,
	paramopp :0,
	hisWin : null
};

function initExt() {
	initHisWin();
	Ext.form.Field.prototype.msgTarget = 'side';// ͳһָ��������Ϣ��ʾ��ʽ
	var Pid;// Ŀ¼ID
	var type;// ��������
	var service_id;// ����ID

	var prodrootnode = new Ext.tree.AsyncTreeNode({
				text : '����Ŀ¼',
				expanded : false,
				id : '0'
			});

	var contextMenu = new Ext.menu.Menu({
				listWidth : 200,
				items : [{
							text : '���Ŀ¼',
							iconCls : 'icon-add',
							handler : addLevel
						}, {
							text : '�޸�Ŀ¼',
							iconCls : 'icon-edit',
							handler : modLevel
						}, {
							iconCls : 'icon-plugin',
							text : 'ɾ��Ŀ¼',
							iconCls : 'icon-del',
							handler : delLevel
						}, {
							iconCls : 'icon-reflash',
							text : '���¼���',
							handler : newagain
						}]
			});

	function newagain() {
		var selnode = TREE1.getSelectionModel().getSelectedNode();
		selnode.reload();
	}

	function delLevel() {
		var sm = TREE1.getSelectionModel();
		var node = sm.getSelectedNode();
		if (node == null || node.isLeaf()) {
		} else {
			var msgTip = Ext.MessageBox.show({
						title : '��ʾ',
						width : 250,
						msg : '����ɾ��......'
					});

			Ext.Ajax.request({
						url : '/servlet/jdbcGatherAction.do?method=delLEVEL',
						params : {
							ID : node.id
						},
						method : 'POST',
						success : function(response, options) {
							msgTip.hide();
							var result = Ext.util.JSON
									.decode(response.responseText);
							if (result.success) {
								Ext.Msg.alert('��ʾ', 'ɾ���ɹ���');
								var loader = TREE1.getLoader()
								loader.load(prodrootnode, function() {
											prodrootnode.collapse();
										});
								R_PANEL1_STORE.removeAll();
								R_PANEL2_STORE.removeAll();
							} else {
								Ext.Msg.alert('��ʾ', 'Ŀ¼��������ģ�����ɾ����');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('��ʾ', 'ɾ����Ϣ����ʧ��!');
						}
					});
		}
	}

	function addLevel() {
		var sm = TREE1.getSelectionModel();
		var node = sm.getSelectedNode();
		if (node == null || node.isLeaf())
			Ext.MessageBox.alert("����", "��ѡ��һ��Ŀ¼");
		else {
			Global.levelopp = 0;
			Form1.form.reset();
			mywin.setTitle("����Ŀ¼��Ϣ");
			mywin.show();
			Pid = node.id;
		}
	}

	function modLevel() {
		var sm = TREE1.getSelectionModel();
		var node = sm.getSelectedNode();
		if (node == null)
			Ext.MessageBox.alert("����", "��ѡ��һ��Ŀ¼");
		else {
			Form1.form.reset();
			mywin.show();
			mywin.setTitle("�޸�Ŀ¼��Ϣ");
			Form1.form.load({
						waitMsg : '���ڼ����������Ժ�',// ��ʾ��Ϣ
						waitTitle : '��ʾ',// ����
						url : '/servlet/jdbcGatherAction.do?method=getLevelInfo',// �����url��ַ
						params : {
							ID : node.id
						},
						method : 'GET',// ����ʽ
						success : function(form, action) {// ���سɹ��Ĵ�����
							Global.levelopp = 1;
							Pid = node.id;
						},
						failure : function(form, action) {// ����ʧ�ܵĴ�����
							Ext.Msg.alert('��ʾ', '������Ϣ����ʧ��');
						}
					});
		}
	}

	var Form1 = new Ext.FormPanel({
				height : 400,
				labelSeparator : "��",
				frame : true,
				border : false,
				items : [{
							xtype : 'textfield',
							width : 200,
							value : '',
							allowBlank : false,
							blankText : 'Ŀ¼����',
							name : 'LEVEL_NAME',
							fieldLabel : 'Ŀ¼����'
						}],
				buttons : [{
							text : '�ύ',
							handler : submitForms
						}]
			});

	var mywin = new Ext.Window({
				layout : 'fit',
				width : 380,
				closeAction : 'hide',
				height : 270,
				resizable : false,
				shadow : true,
				modal : true,
				closable : true,
				bodyStyle : 'padding:5 5 5 5',
				animCollapse : true,
				items : [Form1]
			});

	var Form2 = new Ext.FormPanel({
				height : 350,
				labelSeparator : "��",
				frame : true,
				border : false,
				items : [{
							xtype : 'textfield',
							width : 290,
							value : '',
							allowBlank : false,
							blankText : '����Դ����',
							name : 'JNDI',
							fieldLabel : '����Դ����'
						},{
                            xtype : 'textfield',
                            width : 290,
                            value : '',
                            allowBlank : false,
                            blankText : '�û���',
                            name : 'userName',
                            fieldLabel : '�û���'
                        },{
                            xtype : 'textfield',
                            inputType: 'password',
                            width : 290,
                            value : '',
                            allowBlank : false,
                            blankText : '����',
                            name : 'password',
                            fieldLabel : '����'
                        },{
                            xtype : 'textfield',
                            width : 290,
                            value : 'jdbc:oracle:thin:@IP��ַ:�˿�:ʵ����',
                            allowBlank : false,
                            blankText : '���Ӵ�',
                            name : 'jdbcUrl',
                            fieldLabel : '���Ӵ�'
                        },{
                            xtype : 'textfield',
                            width : 290,
                            value : 'oracle.jdbc.OracleDriver',
                            allowBlank : false,
                            blankText : '��������',
                            name : 'jdbcDriver',
                            fieldLabel : '��������'
                        },{
                            xtype : 'textarea',
                            width : 290,
                            value : '{miniPoolSize:1,maxPoolSize:20,initialPoolSize:3,maxIdleTime:60,acquireIncrement:3}',
                            allowBlank : false,
                            blankText : '���ӳز���',
                            name : 'poolCfg',
                            fieldLabel : '���ӳز���',
                            height : 108
                }, {
							xtype : 'textarea',
							width : 290,
							value : '',
							allowBlank : false,
							blankText : '˵��',
							name : 'remark',
							fieldLabel : '��ע˵��'
						}],
				buttons : [{
							text : '�ύ',
							handler : submitForms2
						}]
			});

	var mywin2 = new Ext.Window({
				layout : 'fit',
				width : 450,
				closeAction : 'hide',
				height : 390,
				resizable : false,
				shadow : true,
				modal : true,
				closable : true,
				bodyStyle : 'padding:5 5 5 5',
				animCollapse : true,
				items : [Form2]
			});

	function submitForms() {
		Form1.form.submit({
					params : {
						Pid : Pid,
						levelopp : Global.levelopp
					},
					// clientValidation : true,// ���пͻ�����֤
					waitMsg : '�����ύ�������Ժ�',// ��ʾ��Ϣ
					waitTitle : '��ʾ',// ����
					url : '/servlet/jdbcGatherAction.do?method=addLEVEL',// �����url��ַ
					method : 'POST',// ����ʽ
					success : function(form, action) {// ���سɹ��Ĵ�����
						mywin.hide();
						Ext.Msg.alert('��ʾ', "�����ɹ�");
						var loader = TREE1.getLoader();
						loader.load(prodrootnode, function() {
									prodrootnode.collapse();
								});// ���¼��ظ��ڵ�
						// typeStore.load({
						// params : {
						// node : myid
						// }
						// });
					},
					failure : function(form, action) {
						Ext.Msg.alert('��ʾ', "����ʧ��");
					}
				});
		Global.levelopp = 0;
	}

	function submitForms2() {
		Form2.form.submit({
					params : {
						Pid : Pid,
						dsopp : Global.dsopp
					},
					// clientValidation : true,// ���пͻ�����֤
					waitMsg : '�����ύ�������Ժ�',// ��ʾ��Ϣ
					waitTitle : '��ʾ',// ����
					url : '/servlet/jdbcGatherAction.do?method=addJNDI',// �����url��ַ
					method : 'POST',// ����ʽ
					success : function(form, action) {// ���سɹ��Ĵ�����
						mywin2.hide();
                        if(Global.dsopp==0)
						    Ext.Msg.alert('��ʾ', '�����ɹ�');
                        else
                            Ext.Msg.alert('��ʾ', '�����ɹ����޸�����Դ����JDBC�ɼ������ͻ��˲�����Ч��');
						R_PANEL2_STORE.load({
									params : {
										node : TREE1.getSelectionModel()
												.getSelectedNode().id,
										style : 'R_PANEL2',
										start : 0,
										limit : 20
									}
								});
					},
					failure : function(form, action) {
						Ext.Msg.alert('��ʾ', '����ʧ��');
					}
				});
	}

	function submitForms4() {
		var opptype = 0;
        var vservice_id=service_id;
        var paramId = 0;
		if (Global.paramopp==1) { //paramopp=1��ʾ�޸Ĳ���  paramopp=0��ʾ��������
			paramId = JNDIpanel2.getSelectionModel().getSelected().id;
			opptype = 1;
		}
		if(!Form4.form.isValid()) 
			return;		
		Form4.form.submit({
					params : {
						Pid : vservice_id,
						paramId : paramId,
						opptype : opptype
					},
					// clientValidation : true,// ���пͻ�����֤
					waitMsg : '�����ύ�������Ժ�',// ��ʾ��Ϣ
					waitTitle : '��ʾ',// ����
					url : '/servlet/jdbcGatherAction.do?method=addJDBC2',// �����url��ַ
					method : 'POST',// ����ʽ
					success : function(form, action) {// ���سɹ��Ĵ�����
						Ext.Msg.alert('��ʾ', '�����ɹ�');
						mywin4.hide();
						JNDIpanel2_STORE.load({
									params : {
										node : service_id,
										style : 'R_PANEL2',
										start : 0,
										limit : 20
									}
								});
						JNDIpanel3_STORE.reload();
						JNDIpanel5_STORE.reload();
					},
					failure : function(form, action) {
						Ext.Msg.alert("������Ϣ", unescape(action.result.message));
					}
				});
	}

	var TREE1 = new Ext.tree.TreePanel({
		id : 'TREE1',
		autoScroll : true,
		contextMenu : contextMenu,
		loader : new Ext.tree.TreeLoader({
					baseAttrs : {
						cust : 'happy'
					},
					dataUrl : '/servlet/jdbcGatherAction.do?method=getTreeWithout'
				}),
		listeners : {
			'contextmenu' : function(node, e) {
				if (!node.isLeaf()) {
					node.select();
					var menu = node.getOwnerTree().contextMenu;
					menu.contextNode = node;
					menu.showAt(e.getXY());
				}
			},
			click : function(node, e) {
				Ext.getCmp('R_tabPanel1').setActiveTab(R_PANEL1);

				R_PANEL1_STORE.load({
							params : {
								node : node.id,
								style : 'R_PANEL1',
								start : 0,
								limit : 20
							}
						});
				R_PANEL2_STORE.load({
							params : {
								node : node.id,
								style : 'R_PANEL2',
								start : 0,
								limit : 20
							}
						});
			}
		},
		//width : 188,
		//height : 726,
		border	   :false,
		root : prodrootnode
	});

	var leftPanel = new Ext.Panel({
		id : 'lefttabPanel',
		//height : 800,
		autoHeight  : true,
		title : 'JDBC�ɼ���������',
		collapsible : true,
		region : 'west',// ָ���������������Ϊwest
		width : 200,
		border	   :false,
		animScroll : true,// ʹ�ö�������Ч��
		items : TREE1,
		enableTabScroll : true
		});

	// JNDIpanel1 ���������Ϣ
	function submitForms3() {
		JNDIpanel1.form.submit({
					params : {
						Pid : Pid,
						optype : type,
						service_id : service_id
					},
					// clientValidation : true,// ���пͻ�����֤
					waitMsg : '�����ύ�������Ժ�',// ��ʾ��Ϣ
					waitTitle : '��ʾ',// ����
					url : '/servlet/jdbcGatherAction.do?method=addJDBC1',// �����url��ַ
					method : 'POST',// ����ʽ
					success : function(form, action) {// ���سɹ��Ĵ�����
						Ext.Msg.alert('��ʾ', '�����ɹ�');
						service_id = action.result.service_id;
						Global.newService=1;
					},
					failure : function(form, action) {
						Ext.Msg.alert('��ʾ', '����ʧ��');
					}
				});
	}
	
	var gather_client_store = new Ext.data.JsonStore({
		url : '/servlet/jdbcGatherAction.do?method=getGatherClient',
		root : 'items',
		fields : ['client_id', 'client_name'],
		baseParams : {
		}
	});
	
	gather_client_store.load({
		params : {
			start : 0,
			limit : 20
		}
	});

	var JNDIpanel1 = new Ext.FormPanel({
				id : 'JNDIpanel1',
				height : 300,
				labelSeparator : "��",
				frame : true,
				title : "���������Ϣ",
				border : false,
				items : [{
							xtype : 'textfield',
							width : 500,
							value : '',
							allowBlank : false,
							blankText : '��������',
							name : 'NAME',
							fieldLabel : '��������'
						}, {
							xtype : 'textarea',
							width : 500,
							height : 300,
							value : '',
							allowBlank : false,
							blankText : '˵��',
							name : 'REMARK',
							fieldLabel : '��ע˵��'
						}, {
							fieldLabel : '״̬',
							hiddenName : 'state',
							xtype : 'combo',
							editable : false,
							allowBlank : false,
							triggerAction : 'all',
							mode : 'local',
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [["0SA", "��Ч"], ["0SX", "ʧЧ"]]
									}),
							valueField : 'value',
							displayField : 'text'
						},{
							//width : 200,
							fieldLabel : '�ɼ��ͻ���',
							hideLabel:true,
							name : 'client_name',
							hiddenName : 'client_id',
							id : 'clientId',
							allowBlank : true,
							blankText : '�ɼ��ͻ���',
							xtype : 'combo',
							editable : false,
							triggerAction : 'all',
							mode : 'local', // localֱ���ȼ��ؽ��� remote�ǵ���ż���
							store : gather_client_store,
							emptyText : '��ѡ��...',
							valueField : 'client_id',
							displayField : 'client_name'
						}],
				buttons : [{
							text : '����',
							handler : submitForms3
						}]
			});

	var JNDIpanel2_STORE = new Ext.data.Store({// �������ݼ�
		id : 'JNDIpanel2_STORE',

		autoLoad : false,
		reader : new Ext.data.XmlReader({
					totalRecords : "results",
					record : "JDBCPram",
					id : "param_id"
				}, Ext.data.Record.create([{
							name : 'param_id',
							type : 'float'
						}, {
							name : 'param_name'
						}, {
							name : 'pri_value'
						}, {
							name : 'gen_sql'
						},{
							name : 'paramType'
						}])),
		proxy : new Ext.data.HttpProxy({
					url : '/servlet/jdbcGatherAction.do?method=getJNDI_PARAM'
				}),
		listeners : {
			'beforeload' : function(store, options)
			{
				if(this.lastOptions)
				{
					var lastParam = this.lastOptions.params;
					Ext.applyIf(options.params, lastParam);
				}
			}
		}
	})

	var JNDIpanel3_STORE = new Ext.data.Store({// �ɼ�SQL
		id : 'JNDIpanel3_STORE',
		autoLoad : false,
		reader : new Ext.data.XmlReader({
					totalRecords : "results",
					record : "JNDISQLObj",
					id : "SQL_ID"
				}, Ext.data.Record.create([{
							name : 'SQL_ID',
							type : 'float'
						}, {
							name : 'SQL_TEXT1'
						}, {
							name : 'SQL_TEXT2'
						}, {
							name : 'SORT_ID'
						}, {
							name : 'SQL_TYPE'
						}, {
							name : 'POOL_ID'
						},{
							name : 'DEST_POOL_ID'
						}, {
							name : 'REMARK'
						},{
                            name : 'QUERY_TIMEOUT'
                        }])),
		proxy : new Ext.data.HttpProxy({
					url : '/servlet/jdbcGatherAction.do?method=getJNDISQL'
				}),
		listeners : {
			'beforeload' : function(store, options)
			{
				if(this.lastOptions)
				{
					var lastParam = this.lastOptions.params;
					Ext.applyIf(options.params, lastParam);
				}
			}
		}
	})

	// JNDIpanel2 �ɼ�����
	var JNDIpanel2 = new Ext.grid.GridPanel({
		id : 'JNDIpanel2',
		store : JNDIpanel2_STORE,
		animScroll : true,// ʹ�ö�������Ч��
		autoScroll : true,
		height : 500,
		width : 400,

		title : '�ɼ�����',
		enableTabScroll : true,// tab��ǩ����ʱ�Զ����ֹ�����ť
		tbar : new Ext.Toolbar([{
					text : '��Ӳ���',
					iconCls : 'icon-add',
					handler : addPARAM
				}, {
					text : '�޸Ĳ���',
					iconCls : 'icon-delete',
					handler : modPARAM
				}, {
					text : 'ɾ������',
					iconCls : 'icon-delete',
					handler : delPARAM
				}, {
					text : '��ʾ',
					iconCls : 'icon-delete',
					handler : function() {
						Ext.Msg
								.alert(
										"��ʾ��",
										"ϵͳȱʡ������<br> BATCH_ID ���κţ�ÿ��������ʱ�Զ����� <br> GAGHER_S_TIME �ɼ�������ʼʱ�� <br> GAGHER_E_TIME �ɼ���������ʱ��");
					}
				}]),
		bbar : new Ext.PagingToolbar({// ��ҳ������
			store : JNDIpanel2_STORE,
			pageSize : 20,
			displayInfo : true,
			displayMsg : '�� {0} ���� {1} ����һ�� {2} ��',
			emptyMsg : "û�м�¼"
		}),
		columns : [// ���ñ����
				new Ext.grid.RowNumberer({
							header : '�к�',
							width : 36
						}),// ����к����
				{
					header : "��������",
					width : 100,
					dataIndex : 'param_name',
					sortable : true
				}, {
					header : "��ʼֵ",
					width : 160,
					dataIndex : 'pri_value',
					sortable : true
				}, {
					header : "���ɹ���SQL",
					xtype : 'textarea',
					height : 250,
					width : 300,
					dataIndex : 'gen_sql',
					sortable : true
				}, {
					header : "��������",
					width : 150,
					dataIndex : 'paramType',
					sortable : true,
					renderer : paramTypeRender
				}]
	});
	//
	// // JNDIpanel3 sql����
	//
	var Form4 = new Ext.FormPanel({
		height : 400,
		labelSeparator : "��",
		frame : true,
		border : false,
		items : [{
					xtype : 'textfield',
					width : 200,
					value : '',
					allowBlank : false,
					blankText : '��������',
					name : 'NAME',
					fieldLabel : '��������'
				}, {
					xtype : 'textfield',
					width : 200,
					value : '',
//					allowBlank : false,
					blankText : '��ʼֵ',
					name : 'p_VALUE',
					fieldLabel : '��ʼֵ'
				}, {
					xtype : 'textfield',
					width : 200,
					value : '',
					allowBlank : false,
					blankText : '���ɹ���SQL',
					name : 'SQLRULE',
					fieldLabel : '���ɹ���SQL'
				},{
					xtype : 'combo',
					width : 200,
					value : '',
					allowBlank : false,
					name : 'PARAM_TYPE',
					fieldLabel : '��������',
					store : new Ext.data.SimpleStore({
						fields : ['value', 'text'],
						data : [["1", "��ͨ����"],
								["2", "��̬SQL����"]]
					}),
					hiddenName : 'paramType',
					editable : false,
					triggerAction : 'all',
					mode : 'local',
					valueField : 'value',
					displayField : 'text'
				}],
		buttons : [{
					text : '�ύ',
					handler : submitForms4
				}, {
					text : '����',
					handler : function() {
						Ext.Msg
								.alert("��ʾ��",
										"������Ĭ��ΪSTRING ���ͣ�������ǰֵдΪ :CUR_VALUE��SQL��䲻����';'");
					}
				}]
	});

	var mywin4 = new Ext.Window({
				layout : 'fit',
				width : 380,
				closeAction : 'hide',
				height : 270,
				resizable : false,
				shadow : true,
				modal : true,
				closable : true,
				bodyStyle : 'padding:5 5 5 5',
				animCollapse : true,
				items : [Form4]
			});

	function addPARAM() {
		if(!service_id){
			Ext.Msg.alert('��ʾ', '������ӱ������������Ϣ');
			return;
		}
		
		mywin4.show();
		Form4.form.reset();
		Global.paramopp=0;

	}

	function modPARAM(store, node) {
		mywin4.show();

		var id = JNDIpanel2.getSelectionModel().getSelected();
		Global.paramopp=1;
		Form4.form.load({
					waitMsg : '���ڼ����������Ժ�',// ��ʾ��Ϣ
					waitTitle : '��ʾ',// ����
					url : '/servlet/jdbcGatherAction.do?method=getJDBC2',// �����url��ַ
					params : {
						ID : id.id
					},
					method : 'GET',// ����ʽ
					success : function(form, action) {// ���سɹ��Ĵ�����
						// Ext.Msg.alert('��ʾ','���ݼ��سɹ�');
					},
					failure : function(form, action) {// ����ʧ�ܵĴ�����
						Ext.Msg.alert('��ʾ', '��Ϣ����ʧ��');
					}
				});
	}

	JNDIpanel2.on("rowdblclick", modPARAM, this)

	function delPARAM() {

		var id = JNDIpanel2.getSelectionModel().getSelected();
		if (id == null) {
			alert("��ѡ��һ����¼");
		} else {
			var msgTip = Ext.MessageBox.show({
						title : '��ʾ',
						width : 250,
						msg : '����ɾ��......'
					});

			Ext.Ajax.request({
						url : '/servlet/jdbcGatherAction.do?method=delJNDI_PARAM',
						params : {
							ID : id.id
						},
						method : 'POST',
						success : function(response, options) {
							msgTip.hide();
							var result = Ext.util.JSON
									.decode(response.responseText);
							if (result.success) {
								// �����������ݳɹ�ɾ����ͬ��ɾ���ͻ����б��е�����

								Ext.Msg.alert('��ʾ', 'ɾ���ɹ���');
								JNDIpanel2_STORE.load({
											params : {
												node : service_id,
												style : 'R_PANEL2',
												start : 0,
												limit : 20
											}
										});
								JNDIpanel3_STORE.reload();
								JNDIpanel5_STORE.reload();
							} else {
								Ext.Msg.alert('��ʾ', 'Ŀ¼�����ֽڵģ�����ɾ����');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('��ʾ', 'ɾ����Ϣ����ʧ�ܣ�');
						}
					});
		}

	}
	//

	function submitForms6() {
		var sql_id = 0;
		if (type == 2) {
			sql_id = JNDIpanel3.getSelectionModel().getSelected().id;
		}
		if(!Form5.form.isValid())
			return;		
			
		Form5.form.submit({
					params : {
						Pid : service_id,
						start : type,
						limit : sql_id
					},
					// clientValidation : true,// ���пͻ�����֤
					waitMsg : '�����ύ�������Ժ�',// ��ʾ��Ϣ
					waitTitle : '��ʾ',// ����
					url : '/servlet/jdbcGatherAction.do?method=addJDBC3',// �����url��ַ
					method : 'POST',// ����ʽ
					success : function(form, action) {// ���سɹ��Ĵ�����
						Ext.Msg.alert('��ʾ', '�����ɹ�');
						JNDIpanel3_STORE.removeAll();
						JNDIpanel3_STORE.load({
									params : {
										node : service_id,
										style : 'R_PANEL2',
										start : type,
										limit : 20
									}
								});
						JNDIpanel2_STORE.reload();
						JNDIpanel5_STORE.reload();
						mywin5.hide();
					},
					failure : function(form, action) {
					    Ext.Msg.alert("������Ϣ", unescape(action.result.message));
					}
				});
	}

	function submitForms7() {
		Ext.MessageBox.prompt('Ԥ���������', '������Ԥ�����', callBack, this, true);
		function callBack(id, msg) {
			if (id != 'ok')
				return;
			if (Ext.getCmp('sqlcombo').getValue() == "") {
				alert('��ѡ��һ������Դ');
				return;
			}
			var msgTip = Ext.MessageBox.show({
						title : '��ʾ',
						width : 250,
						msg : '���ڲ���......'
					});
			Ext.Ajax.request({
				url : '/servlet/jdbcGatherAction.do?method=execSELECT',
				params : {
					Pid : service_id,
					POOL_ID : Ext.getCmp('sqlcombo').getValue(),
					sql : msg
				},
				method : 'POST',
				success : function(response, options) {
					msgTip.hide();
					var result = Ext.util.JSON.decode(response.responseText);
					if (result.success) {
						Ext.Msg.alert('��ʾ', 'ִ�н��(ֻ��ʾ��һ��)��' + result.message);

					} else {
						Ext.Msg.alert('��ʾ', 'Ԥ��ʧ�ܣ��������');
					}
				},
				failure : function(response, options) {
					msgTip.hide();
					Ext.Msg.alert('��ʾ', '����ʧ�ܣ��������');
				}
			});
		}
	}

	var sql_con_store = new Ext.data.JsonStore({
				url : '/servlet/jdbcGatherAction.do?method=getSqlJNDI',
				totalProperty : 'totalCount',
				root : 'items',
				fields : ['POOL_ID', 'JNDI_NAME'],
				baseParams : {
					node : service_id
				}
			});

	sql_con_store.on("beforeload", function(store, node) {
				sql_con_store.baseParams.style = service_id;
			}, this);

	var Form5 = new Ext.FormPanel({
		height : 500,
		labelWidth : 120,
		labelSeparator : "��",
		frame : true,
		id : 'Form5',
		border : false,
		items : [{
			fieldLabel : 'SQL����',
			hiddenName : 'SQL_TYPE',
			name : 'sched.CYCLE_TYPE_NAME',
			xtype : 'combo',
			width : 260,
			allowBlank : false,
			editable : false,
			tooltip : '<b>�����òɼ�����������ɺ󣬵���˰�ť���иòɼ�����</b>',
			triggerAction : 'all',
			mode : 'local',
			store : new Ext.data.SimpleStore({
						fields : ['value', 'text'],
						data : [["0SA", "SELECT-INSERT���"],
								["0SB", "SELECT-�洢���̵���"], ["0SC", "INSERT���"],
								["0SD", "�洢���̵���"], ["0SE", "�ز�ǰ��SQL"], ["0SF", "�洢����-INSERT���"]]
					}),
			valueField : 'value',
			displayField : 'text',
			listeners : {
				'select' : function(cmb,rec,idx) {
					if(rec.data.value=="0SC" || rec.data.value=="0SD" || rec.data.value=="0SE"){
						Ext.getCmp("sqlText2").disable();
						Ext.getCmp("poolCombo").disable();
					}else{
						Ext.getCmp("sqlText2").enable();
						Ext.getCmp("poolCombo").enable();
					}
				}
			}
		}, {
			xtype : 'textarea',
			height : 150,
			width : 400,
			value : '',
			allowBlank : false,
			blankText : 'SQL�ı�1',
			emptyText : "��:select C1,C2 from tab1 where C3 between to_date(:GAGHER_S_TIME,'yymmddhh24miss') and to_date(:GAGHER_E_TIME,'yymmddhh24miss')",
			name : 'SQL1',
			fieldLabel : 'SQL�ı�1'
		}, {
			width : 260,
			fieldLabel : 'SQL�ı�1����Դ',
			name : 'FIR_DIR_NAME',
			hiddenName : 'POOL_ID',
			id : 'sqlcombo',
			allowBlank : false,
			blankText : 'ѡ������Դ',
			xtype : 'combo',
			editable : false,
			triggerAction : 'all',
			mode : 'local', // localֱ���ȼ��ؽ��� remote�ǵ���ż���
			store : sql_con_store,
			emptyText : '��ѡ��...',
			valueField : 'POOL_ID',
			displayField : 'JNDI_NAME'
		}, {
			xtype : 'textarea',
			height : 150,
			width : 400,
			value : '',
			allowBlank : true,
			emptyText : 'SELECT-INSERT���,����INSERT���,��:insert into tab2 values(RS.C1,RS.C2, :BATCH_ID,SYSDATE) ; SELECT-�洢���̵���,����洢���̵�������,�磺pro1(:batch_id,rs.c1,rs.c2)',
			name : 'SQL2',
			id : 'sqlText2',
			fieldLabel : 'SQL�ı�2'
		}, {
			width : 260,
			fieldLabel : 'SQL�ı�2����Դ',
			name : 'SEC_DIR_NAME',
			hiddenName : 'DEST_POOL_ID',
			id : 'poolCombo',
//			allowBlank : false,
			blankText : 'ѡ������Դ',
			xtype : 'combo',
			editable : false,
			triggerAction : 'all',
			mode : 'local', // localֱ���ȼ��ؽ��� remote�ǵ���ż���
			store : sql_con_store,
			emptyText : '��ѡ��...',
			valueField : 'POOL_ID',
			displayField : 'JNDI_NAME'
		}, {
            xtype : 'textfield',
            width : 260,
            value : '',
            allowBlank : false,
            blankText : 'ִ��˳��',
            regex : /^[1-9]*[1-9][0-9]*$/,
            regexText : '�����������������.',
            name : 'SORT',
            fieldLabel : 'ִ��˳��'
        }, {
			xtype : 'textfield',
			width : 260,
			value : '',
			blankText : '��ѯ��ʱʱ��',
			regex : /^[1-9]*[1-9][0-9]*$/,
			regexText : '�����������������.',
			name : 'QUERY_TIMEOUT',
			fieldLabel : '��ѯ��ʱ���룩'
		}, {
			xtype : 'textfield',
			width : 260,
			value : '',
			allowBlank : false,
			blankText : '��ע˵��',
			name : 'REMARK',
			fieldLabel : '��ע˵��'
		}],
		buttons : [{
					text : 'SELECT���Ԥ��',
					handler : submitForms7
				}, {
					text : '�ύ',
					handler : submitForms6
				}, {
					text : '����',
					handler : function() {
						Ext.Msg
								.alert(
										"��ʾ��",
										"�ɼ�����дΪ :������;<br>Ĭ�ϲɼ������� <br>    GAGHER_S_TIME  �ɼ�������ʼʱ��,��ʽΪyymmddhh24miss <br>   GAGHER_E_TIME �ɼ���������ʱ��,��ʽΪyymmddhh24miss<br>   BATCH_ID ����ID<br>SELECT����SELECT�����Ϊ RS.����  <br>���н�����Ͳ�����Ĭ��ΪSTRING ����<br>SQL��䲻Ҫ��';'");
					}
				}]
	});

	var mywin5 = new Ext.Window({
				layout : 'fit',
				width : 580,
				closeAction : 'hide',
				height : 568,
				resizable : false,
				shadow : true,
				modal : true,
				closable : true,
				bodyStyle : 'padding:5 5 5 5',
				animCollapse : true,
				items : [Form5]
			});

	function addSQL() {
		type = 0;
		sql_con_store.load({
					params : {
						style : service_id,
						start : 0,
						limit : 20
					}
				});
		mywin5.show();
		Form5.form.reset();
		Form5.getForm().findField('POOL_ID').clearValue();
		Form5.getForm().findField('DEST_POOL_ID').clearValue();
	}

	function delSQL() {
		var id = JNDIpanel3.getSelectionModel().getSelected();
		if (id == null) {
			alert("��ѡ��һ����¼");
		} else {
			var msgTip = Ext.MessageBox.show({
						title : '��ʾ',
						width : 250,
						msg : '����ɾ��......'
					});

			Ext.Ajax.request({
						url : '/servlet/jdbcGatherAction.do?method=delJDBC3',
						params : {
							ID : id.id
						},
						method : 'POST',
						success : function(response, options) {
							msgTip.hide();
							var result = Ext.util.JSON
									.decode(response.responseText);
							if (result.success) {
								// �����������ݳɹ�ɾ����ͬ��ɾ���ͻ����б��е�����
								Ext.Msg.alert('��ʾ', 'ɾ���ɹ���');
								JNDIpanel2_STORE.reload();
								JNDIpanel3_STORE.reload();
								JNDIpanel5_STORE.reload();
							} else {
								Ext.Msg.alert('��ʾ', 'Ŀ¼�����ֽڵģ�����ɾ����');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('��ʾ', 'ɾ����Ϣ����ʧ�ܣ�');
						}
					});
		}
	}

	var JNDIpanel3 = new Ext.grid.GridPanel({
				id : 'JNDIpanel3',
				store : JNDIpanel3_STORE,
				animScroll : true,// ʹ�ö�������Ч��
				autoScroll : true,
				height : 500,
				width : 400,
				title : '�ɼ�SQL����',
				enableTabScroll : true,// tab��ǩ����ʱ�Զ����ֹ�����ť
				tbar : new Ext.Toolbar([{
							text : '���SQL',
							iconCls : 'icon-add',
							handler : addSQL
						}, {
							text : '�޸�SQL',
							iconCls : 'icon-delete',
							handler : modSQL
						}, {
							text : 'ɾ��SQL',
							iconCls : 'icon-delete',
							handler : delSQL
						}]),
				bbar : new Ext.PagingToolbar({// ��ҳ������
					store : JNDIpanel3_STORE,
					pageSize : 20,
					displayInfo : true,
					displayMsg : '�� {0} ���� {1} ����һ�� {2} ��',
					emptyMsg : "û�м�¼"
				}),
				columns : [// ���ñ����
						new Ext.grid.RowNumberer({
									header : '�к�',
									width : 36
								}),// ����к����
						{
							header : "�ɼ�SQL����",
							width : 80,
							renderer : datarender,
							dataIndex : 'SQL_TYPE',
							sortable : true
						}, {
							header : "SQL�ı�1",
							width : 150,
							dataIndex : 'SQL_TEXT1',
							sortable : true
						}, {
							header : "SQL�ı�2",
							width : 160,
							dataIndex : 'SQL_TEXT2',
							sortable : true
						},{
                            header : "��ѯ��ʱ",
                            width : 60,
                            dataIndex : 'QUERY_TIMEOUT',
                            sortable : true
                        }, {
							header : "ִ��˳��",
							width : 60,
							dataIndex : 'SORT_ID',
							sortable : true
						}, {
							header : "��ע˵��",
							width : 60,
							dataIndex : 'REMARK',
							sortable : true
						}, {
							header : "����Դ",
							width : 60,
							dataIndex : 'POOL_ID',
							sortable : true
						},{
							header : "Ŀ������Դ",
							width : 60,
							dataIndex : 'DEST_POOL_ID',
							sortable : true
						}]
			});
	//

	//
	// ��ʱ�ƻ�
	var JNDIpanel4 = new Ext.FormPanel({
				id : 'JNDIpanel4',
				height : 300,
                labelWidth : 150,
				labelSeparator : "��",
				frame : true,
				title : "����ʱ�ƻ�",
				border : false,
				items : [{
					fieldLabel : '��ʱ�ƻ�����',
					hiddenName : 'SCHED_TYPE',
					name : 'sched.SCHED_TYPE_NAME',
					xtype : 'combo',
					width : 350,
					editable : false,
					triggerAction : 'all',
					mode : 'local',
					store : new Ext.data.SimpleStore({
								fields : ['value', 'text'],
								data : [["0SA", "����"], ["0SB", "��ʱ"],
										["0SC", "��ʱ"]]
							}),
					valueField : 'value',
					displayField : 'text',
					listeners : {}
				}, {
					fieldLabel : '�ɼ�����',
					hiddenName : 'CYCLE_TYPE',
					name : 'sched.CYCLE_TYPE_NAME',
					xtype : 'combo',
					width : 350,
					allowBlank : false,
					editable : false,
					triggerAction : 'all',
					mode : 'local',
					store : new Ext.data.SimpleStore({
								fields : ['value', 'text'],
								data : [["N", "��"], ["H", "ʱ"], ["D", "��"],
										["W", "��"], ["M", "��"]]
							}),
					valueField : 'value',
					displayField : 'text'
				}, {
					name : 'INTERVAL',
					xtype : 'textfield',
					fieldLabel : '�ɼ�Ƶ��',
					width : 350,
					allowBlank : false,
					regex : /^[1-9]*[1-9][0-9]*$/,
					regexText : '�����������������.',
					maxLength : 50
				}, {
					name : 'RUN_TIME',
					xtype : 'itnmCronField',
                    baseCls: 'x-plain',
                    fieldWidth: 60,
					width : 350,
                    maskRe: /^[0-9|*|,|-]{0,1}$/,
					fieldLabel : '��ʱ����ʱ��'
				}, {
					id : 'startdt',
					name : 'START_TIME',
					endDateField : 'enddt',
					// vtype: 'daterange',
					width : 350,
					xtype : 'datefield',
					fieldLabel : '�ƻ���Чʱ��',
					allowBlank : false,
					minValue : '01/01/1900',
					format : 'Y-m-d H:i',
					menu : new DatetimeMenu(),
					readOnly : true
				}, {
					id : 'enddt',
					startDateField : 'startdt',
					name : 'END_TIME',
					// vtype: 'daterange',
					width : 350,
					xtype : 'datefield',
					fieldLabel : '�ƻ�ʧЧʱ��',
					format : 'Y-m-d H:i',
					allowBlank : false,
					maxValue : '01/01/2038',
					menu : new DatetimeMenu(),
					readOnly : true
				}, {
					id : 'Gstartdt',
					name : 'GSTART_TIME',
					endDateField : 'Genddt',
					// vtype: 'daterange',
					width : 350,
					xtype : 'datefield',
					fieldLabel : '�ɼ���ʼʱ�����',
					allowBlank : false,
					minValue : '01/01/1900',
					format : 'Y-m-d H:i',
					menu : new DatetimeMenu(),
					readOnly : true
				}, {
					id : 'Genddt',
					startDateField : 'Gstartdt',
					name : 'GEND_TIME',
					// vtype: 'daterange',
					width : 350,
					xtype : 'datefield',
					fieldLabel : '�ɼ�����ʱ�����',
					format : 'Y-m-d H:i',
					allowBlank : false,
					maxValue : '01/01/2038',
					menu : new DatetimeMenu(),
					readOnly : true
				}, {
                    fieldLabel : '�������ȼ���Խ��Խ�ߣ�',
                    hiddenName : 'PRIORITY_LEVEL',
                    name : 'sched.PRIORITY_LEVEL',
                    xtype : 'combo',
                    width : 350,
                    allowBlank : false,
                    editable : false,
                    triggerAction : 'all',
                    mode : 'local',
                    value : 5,
                    store : new Ext.data.SimpleStore({
                        fields : ['value', 'text'],
                        data : [["1", "1���ͣ�"], ["2", "2"], ["3", "3"],
                            ["4", "4"], ["5", "5"],
                            ["6", "6"], ["7", "7"], ["8", "8"],
                            ["9", "9"], ["10", "10���ߣ�"]]
                    }),
                    valueField : 'value',
                    displayField : 'text'
                }, {
					xtype : 'textarea',
					width : 560,
					height : 150,
					value : '',
					allowBlank : false,
					blankText : '˵��',
					name : 'REMARK',
					fieldLabel : '��ע˵��'
				}],
				buttons : [{
							text : '����',
							handler : submitForms5
						}]
			});
			
	function applyPlan() {
		var node = R_PANEL1.getSelectionModel().getSelected();
		if (node == null) {
			alert("��ѡ��һ������");
		} else {
			var msgTip = Ext.MessageBox.show({
						title : '��ʾ',
						width : 250,
						msg : '���ڲ���......'
					});
			Ext.Ajax.request({
						url : '/servlet/jdbcGatherAction.do?method=applyPlan',
						params : {
							ID : node.id
						},
						method : 'POST',
						success : function(response, options) {
							msgTip.hide();
							var result = Ext.util.JSON
									.decode(response.responseText);
							if (result.success) {
								Ext.Msg.alert('��ʾ', '�����ɹ���');
							} else {
								Ext.Msg.alert('��ʾ', '����ʧ�ܣ����鶨ʱ�ƻ������Ƿ���ȷ��');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('��ʾ', '����ʧ�ܣ����鶨ʱ�ƻ������Ƿ���ȷ��');
						}
					});
		}
	}
	
	function sendSchdeule(){
		var node = R_PANEL1.getSelectionModel().getSelected();
		if (node == null) {
			alert("��ѡ��һ������");
		} else {
			var msgTip = Ext.MessageBox.show({
						title : '��ʾ',
						width : 250,
						msg : '���ڲ���......'
					});
			Ext.Ajax.request({
						url : '/servlet/jdbcGatherAction.do?method=sendSchdeule',
						params : {
							ID : node.id
						},
						method : 'POST',
						success : function(response, options) {
							msgTip.hide();
							var result = Ext.util.JSON
									.decode(response.responseText);
							if (result.success) {
								Ext.Msg.alert('��ʾ', '�����ɹ���');
								R_PANEL1_STORE.reload();
							} else {
								Ext.Msg.alert('��ʾ', '����ʧ�ܣ����鶨ʱ�ƻ������Ƿ���ȷ��');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('��ʾ', '����ʧ�ܣ����鶨ʱ�ƻ������Ƿ���ȷ��');
						}
					});
		}
	}
	
	function delSchdeuleTask(){
		var node = R_PANEL1.getSelectionModel().getSelected();
		if (node == null) {
			alert("��ѡ��һ������");
		} else {
			var msgTip = Ext.MessageBox.show({
						title : '��ʾ',
						width : 250,
						msg : '���ڲ���......'
					});
			Ext.Ajax.request({
						url : '/servlet/jdbcGatherAction.do?method=delScheduleTask',
						params : {
							ID : node.id
						},
						method : 'POST',
						success : function(response, options) {
							msgTip.hide();
							var result = Ext.util.JSON
									.decode(response.responseText);
							if (result.success) {
								Ext.Msg.alert('��ʾ', '�����ɹ���');
								R_PANEL1_STORE.reload();
							} else {
								Ext.Msg.alert('��ʾ', '����ʧ�ܣ�����ɼ��ͻ������ã�');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('��ʾ', '����ʧ�ܣ����鶨ʱ�ƻ������Ƿ���ȷ��');
						}
					});
		}
	}

	function submitForms5() {
		if(Global.newService==0){
		    Ext.Msg.alert("��ʾ","���ȱ��������Ϣ");
		    return;
		}
		
		if(!JNDIpanel4.form.isValid()) 
			return;	
		
		JNDIpanel4.form.submit({
					params : {
						service_id : service_id,
						type : type
					},
					// clientValidation : true,// ���пͻ�����֤
					waitMsg : '�����ύ�������Ժ�',// ��ʾ��Ϣ
					waitTitle : '��ʾ',// ����
					url : '/servlet/jdbcGatherAction.do?method=addJDBC4',// �����url��ַ
					method : 'POST',// ����ʽ
					success : function(form, action) {// ���سɹ��Ĵ�����
						if(mywin.hidden)
						{
							mywin.hide();
						}
						Ext.Msg.alert('��ʾ', '�����ɹ�');
						JNDIpanel5_STORE.reload();
					},
					failure : function(form, action) {
                        Ext.Msg.alert('��ʾ', '����ʧ��');
                    }
				});
	}
	var JNDIpanel5_STORE = new Ext.data.Store({
		id : 'JNDIpanel5_STORE',
		autoLoad : false,
		reader : new Ext.data.XmlReader({
					record : "rowSet"
				}, Ext.data.Record.create([{
							name : 'VERSION_ID'
						}, {
							name : 'SERVICE_ID'
						}, {
							name : 'STAFF_ID'
						}, {
							name : 'STAFF_NAME'
						}, {
							name : 'VERSION_TIME'
						}, {
							name : 'REMARK'
						}])),
		proxy : new Ext.data.HttpProxy({
					url : '/servlet/jdbcGatherAction.do?method=getGatherVersion'
				}),
		listeners : {
			'beforeload' : function(store, options)
			{
				if(this.lastOptions)
				{
					var lastParam = this.lastOptions.params;
					Ext.applyIf(options.params, lastParam);
				}
			}
		}
	});
	
	var JNDIpanel5 = new Ext.grid.EditorGridPanel({
		id : 'JNDI_VERSION_HIS_PANEL',
		title : '�������',
		store : JNDIpanel5_STORE,
		animScroll : true,
		autoScroll : true,
		height : 500,
		bbar : new Ext.PagingToolbar({
			store : JNDIpanel5_STORE,
			pageSize : 20,
			displayInfo : true,
			displayMsg : '�� {0} ���� {1} ����һ�� {2} ��',
			emptyMsg : "û�м�¼"
		}),
		columns : [
					new Ext.grid.RowNumberer(),
					{
						hidden : true,
						dataIndex : 'SERVICE_ID'
					},{
						hidden : true,
						dataIndex : 'STAFF_ID'
					},{
						header : "�����Ա",
						dataIndex : 'STAFF_NAME',
						width : 130
					}, {
						header : "���ʱ��",
						dataIndex : 'VERSION_TIME',
						width : 130
					},{
                        header : "�����ע",
                        dataIndex : 'REMARK',
                        width : 330,
                    	editor : new Ext.form.TextField({
								allowBlank : true,
								allowNegative : false,
								minValue : 1,
								listeners : {
									'change' : function() {
										var record = JNDIpanel5.getStore().getAt(JNDIpanel5.selectedRow);
										var versionId = record.get('VERSION_ID');
										updateGatherVersionRemark(versionId, this.getValue());
									}
								}
                    		})
                    },{
                    	dataIndex : 'VERSION_ID',
                    	renderer : function()
                    	{
                    		return '<input type="button" value="�鿴" onclick="showHisCfg()"/>';
                    	}
                    }],
		listeners : {
			
			'beforeedit' : function(grid)
			{
				this.selectedRow = grid.row;
				var record = this.getStore().getAt(this.selectedRow);
				var staffId = record.get('STAFF_ID');
				if(staffId != curStaffId)
				{
					Ext.Msg.alert('����', '�������޸����˵ı������!');
					return false;
				}
			}
		}
	});
	
	//
	// �����ɼ�����TabPanel
	var JNDItabPanel = new Ext.TabPanel({
				id : 'JNDItabPanel',
				height : 500,
				width : 778,
				activeTab : 0,// Ĭ�ϼ����һ��tabҳ
				animScroll : true,// ʹ�ö�������Ч��
				autoScroll : true,
				frame : false,
				items : [JNDIpanel4, JNDIpanel1, JNDIpanel2, JNDIpanel3, JNDIpanel5],
				enableTabScroll : false
			});

	var R_PANEL1_STORE = new Ext.data.Store({// ���÷������ݼ�
		id : 'R_PANEL1_STORE',
		autoLoad : false,
		reader : new Ext.data.XmlReader({
					totalRecords : "results",
					record : "ServiceInfo",
					id : "ID"
				}, Ext.data.Record.create([{
							name : 'ID',
							type : 'float'
						}, {
							name : 'serviceName'
						}, {
							name : 'state1'
						}, {
							name : 'cTime'
						}, {
							name : 'mTime'
						}, {
							name : 'remark'
						}, {
							name : 'msgState'
						}, {
							name : 'sendTime'
						}, {
							name : 'recvTime'
						}])),
		proxy : new Ext.data.HttpProxy({
					url : '/servlet/jdbcGatherAction.do?method=getService'
				})
	})

	var R_PANEL2_STORE = new Ext.data.Store({// ���÷������ݼ�
		id : 'R_PANEL2_STORE',
		autoLoad : false,
		reader : new Ext.data.XmlReader({
					totalRecords : "results",
					record : "JNDIObj",
					id : "POOL_ID"
				}, Ext.data.Record.create([{
							name : 'POOL_ID',
							type : 'float'
						}, {
							name : 'JNDI_NAME'
						}, {
							name : 'REMARK'
						}])),
		proxy : new Ext.data.HttpProxy({
					url : '/servlet/jdbcGatherAction.do?method=getJNDI'
				})
	})

	function getServicebyname() {
		Ext.getCmp('R_tabPanel1').setActiveTab(R_PANEL1);
		var levelName=0;
		if (TREE1.getSelectionModel().getSelectedNode())
		levelName=TREE1.getSelectionModel().getSelectedNode().id
		R_PANEL1_STORE.load({
					params : {
						serviceName : Ext.getCmp('Q_SERIVCE_NAME').getValue(),
						levelName:levelName
					}
				});
	}

	function callBack(id) {
		Ext.getCmp('JNDItabPanel').setActiveTab(JNDIpanel1);
	}

	var R_PANEL1 = new Ext.grid.GridPanel({
		id : 'R_PANEL1',
		anchor : '99%',
		// autoHeight :true,
		height : 500,
		width : 400,
		store : R_PANEL1_STORE,
		animScroll : true,// ʹ�ö�������Ч��
		autoScroll : true,
		title : 'JDBC�ɼ������б�',
		enableTabScroll : true,
		tbar : new Ext.Toolbar([{
			text : '����',
			iconCls : 'icon-add',
			tooltip : '<b>�����ɼ�����</b>',
			handler : function() {
				var btnName = "Ӧ��";
				if(!Ext.getCmp("btnSendSchdeule").hidden)
					btnName = "�·���ʱ����";
				
				var sm = TREE1.getSelectionModel();
				var node = sm.getSelectedNode();
				if (node == null || node.isLeaf())
					Ext.MessageBox.alert("����", "��ѡ��һ��Ŀ¼");
				else {
					type = 0;
					JNDIpanel1.form.reset();
					JNDIpanel4.form.reset();
					JNDIpanel2_STORE.removeAll();
					JNDIpanel3_STORE.removeAll();
					win.show();
					win.center();
					//���ñ���������
					JNDIpanel5.disable();
					Ext.MessageBox.alert('��ʾ', '�����ɼ�������޸Ķ�ʱ�ƻ��󣬵����'+btnName+'����ť������������',
							callBack);
					Pid = node.id;
					Global.newService=0;
				}
			}
		}, '-', {
			text : 'ɾ��',
			tooltip : '<b>ɾ���ɼ�����</b>',
			iconCls : 'icon-del',
			handler : function() {
				var id = R_PANEL1.getSelectionModel().getSelected();
				service_id = id;
				if (id == null) {
					alert("��ѡ��һ����¼");
				} else {
					var msgTip = Ext.MessageBox.show({
								title : '��ʾ',
								width : 250,
								msg : '����ɾ��......'
							});

					Ext.Ajax.request({
								url : '/servlet/jdbcGatherAction.do?method=delJDBC',
								params : {
									ID : id.id
								},
								method : 'POST',
								success : function(response, options) {
									msgTip.hide();
									var result = Ext.util.JSON
											.decode(response.responseText);
									if (result.success) {
										Ext.Msg.alert('��ʾ', 'ɾ���ɹ���');
										R_PANEL1_STORE.reload();
										var loader = TREE1.getLoader()
										loader.load(prodrootnode, function() {
													prodrootnode.collapse();
												});// ���¼��ظ��ڵ�
									} else {
										Ext.Msg.alert('��ʾ', 'ɾ��ʧ��');
									}
								},
								failure : function(response, options) {
									msgTip.hide();
									Ext.Msg.alert('��ʾ', 'ɾ����Ϣ����ʧ�ܣ�');
								}
							});
				}
			}
		}, '-', {
			text : '�޸�',
			iconCls : 'icon-edit',
			tooltip : '<b>�޸Ĳɼ�����</b>',
			handler : function modService() {
				var id = R_PANEL1.getSelectionModel().getSelected();
				if(!id){
					alert("��ѡ��һ����¼");
				}else{
					service_id = id.id;
					type = 1;// �޸�
					JNDIpanel1.form.reset();
					JNDIpanel4.form.reset();
					JNDIpanel2_STORE.removeAll();
					JNDIpanel3_STORE.removeAll();
					win.show();
					win.center();
					//���� ���������
					JNDIpanel5.enable();
					Global.newService=1;
					Ext.getCmp('JNDItabPanel').setActiveTab(JNDIpanel1);
					JNDIpanel1.form.load({
								waitMsg : '���ڼ����������Ժ�',// ��ʾ��Ϣ
								waitTitle : '��ʾ',// ����
								url : '/servlet/jdbcGatherAction.do?method=getJDBC1',// �����url��ַ
								params : {
									ID : service_id
								},
								method : 'GET',// ����ʽ
								success : function(form, action) {// ���سɹ��Ĵ�����
									// Ext.Msg.alert('��ʾ','���ݼ��سɹ�');
								},
								failure : function(form, action) {// ����ʧ�ܵĴ�����
									Ext.Msg.alert('��ʾ', '������Ϣ����ʧ��');
								}
							});
	
					JNDIpanel2_STORE.load({
								params : {
									node : service_id,
									style : 'R_PANEL2',
									start : 0,
									limit : 20
								}
							});
					JNDIpanel3_STORE.load({
								params : {
									node : service_id,
									style : 'R_PANEL2',
									start : 0,
									limit : 20
								}
							});
					
					JNDIpanel4.form.load({
								waitMsg : '���ڼ����������Ժ�',// ��ʾ��Ϣ
								waitTitle : '��ʾ',// ����
								url : '/servlet/jdbcGatherAction.do?method=getJDBC4',// �����url��ַ
								params : {
									ID : service_id
								},
								method : 'GET',// ����ʽ
								success : function(form, action) {// ���سɹ��Ĵ�����
									// Ext.Msg.alert('��ʾ','���ݼ��سɹ�');
								},
								failure : function(form, action) {// ����ʧ�ܵĴ�����
									//Ext.Msg.alert('��ʾ', '��ʱ�ƻ���Ϣ����ʧ��');
								}
							});
					JNDIpanel5_STORE.load({
								params : {
									serviceId : service_id,
									start : 0,
									limit : 20
								}
							});
				}

			}
		}, '-', {
			text : 'Ӧ��',
			iconCls : 'icon-apply',
			id : "btnApplyPlan",
			tooltip : '<b>�����ɼ�������޸����вɼ�����Ķ�ʱ�ƻ�������Ӧ�ð�ť��ʹ������Ч</b>',
			handler : applyPlan
		}, {
			text : '�·���ʱ����',
			id : "btnSendSchdeule",
			iconCls : 'icon-timer',
			tooltip : '<b>�����ɼ�������޸����вɼ�����Ķ�ʱ�ƻ��������·���ť��ʹ������Ч</b>',
			handler : sendSchdeule
		},{
			text : 'ɾ���·�����',
			id : "btnDelSchdeuleTask",
			iconCls : 'icon-del',
			tooltip : '<b>�޸Ĳɼ��ͻ���ǰ��Ҫ��ɾ��ԭ�ͻ����ϵ�����</b>',
			handler : delSchdeuleTask
		}, '-', {
			xtype : 'textfield',
			id : 'Q_SERIVCE_NAME',
			fieldLabel : '��������:'
		}, {
			text : '��ѯ',
			iconCls : 'icon-search',
			tooltip : '<b>�����������ƣ���ѯ</b>',
			handler : getServicebyname
		}]),

		columns : [// ���ñ����
				new Ext.grid.RowNumberer({
							header : '�к�',
							width : 36
						}),// ����к����
				{
					header : "�����ʶ",
					width : 70,
					dataIndex : 'ID',
					sortable : true
				}, {
					header : "��������",
					width : 180,
					dataIndex : 'serviceName',
					sortable : true
				}, {
					header : "״̬",
					width : 80,
					dataIndex : 'state1',
					sortable : true
				}, {
					header : "����ʱ��",
					width : 135,
					dataIndex : 'cTime',
					sortable : true
				}, {
					header : "�޸�ʱ��",
					width : 135,
					dataIndex : 'mTime',
					sortable : true
				}, {
					header : "����˵��",
					width : 135,
					dataIndex : 'remark',
					sortable : true
				},{
					header : "�·�״̬",
					width : 70,
					dataIndex : 'msgState',
					sortable : true
				},{
					header : "�·�ʱ��",
					width : 135,
					dataIndex : 'sendTime',
					sortable : true
				},{
					header : "����ʱ��",
					width : 135,
					dataIndex : 'recvTime',
					sortable : true
				}]
	});
	

	R_PANEL1.on("rowdblclick", modService);
	var R_PANEL2 = new Ext.grid.GridPanel({
				id : 'R_PANEL2',
				store : R_PANEL2_STORE,
				animScroll : true,// ʹ�ö�������Ч��
				autoScroll : true,
				height : 500,
				width : 400,
				title : '����Դ����',
				enableTabScroll : true,// tab��ǩ����ʱ�Զ����ֹ�����ť
				tbar : new Ext.Toolbar([{
							text : '�������Դ',
							handler : addJNDI
						}, '-', {
							text : '�޸�����Դ',
							handler : modJNDI
						}, '-', {
							text : 'ɾ������Դ',
							handler : delJNDI
						}]),
				columns : [// ���ñ����
						new Ext.grid.RowNumberer({
									header : '�к�',
									width : 36
								}),// ����к����
						{
							header : "����ԴJNDI",
							width : 200,
							dataIndex : 'JNDI_NAME',
							sortable : true
						}, {
							header : "˵��",
							width : 400,
							dataIndex : 'REMARK',
							sortable : true
						}]
			});

	R_PANEL2.on("rowdblclick", modJNDI);

	JNDIpanel3.on("rowdblclick", function modSQL(store, node) {
				var id = JNDIpanel3.getSelectionModel().getSelected();
				if(id==null){
					alert("��ѡ��һ����¼");
					return;
				}
										
				Form5.form.load({
							waitMsg : '���ڼ����������Ժ�',// ��ʾ��Ϣ
							waitTitle : '��ʾ',// ����
							url : '/servlet/jdbcGatherAction.do?method=getJDBC3',// �����url��ַ
							params : {
								ID : id.id
							},
							method : 'GET',// ����ʽ
							success : function(form, action) {// ���سɹ��Ĵ�����
								// Ext.Msg.alert('��ʾ','���ݼ��سɹ�');
								if(action.result.data && action.result.data.DEST_POOL_ID)
									Form5.getForm().findField('DEST_POOL_ID').setValue(action.result.data.DEST_POOL_ID);
							},
							failure : function(form, action) {// ����ʧ�ܵĴ�����
								Ext.Msg.alert('��ʾ', '��Ϣ����ʧ��');
							}
						});
		        sql_con_store.load({
					params : {
						style : service_id,
						start : 0,
						limit : 20
					}
				});						
				mywin5.show();
				type = 2;// �޸�
			}, this);

	var R_tabPanel1 = new Ext.TabPanel({
				id : 'R_tabPanel1',
				// anchor : '99%',
				autoHeight : true,
				// height :555,
				activeTab : 0,// Ĭ�ϼ����һ��tabҳ
				animScroll : true,// ʹ�ö�������Ч��
				autoScroll : true,
				frame : true,
				items : [R_PANEL1, R_PANEL2],
				enableTabScroll : false
			});
	

	function addJNDI() {
		var sm = TREE1.getSelectionModel();
		var node = sm.getSelectedNode();
		if (node == null || node.isLeaf())
			Ext.MessageBox.alert("����", "�����ϲ����������Դ");
		else {
			Form2.form.reset();
			mywin2.setTitle("��������Դ");
			mywin2.show();
			Pid = node.id;
			Global.dsopp = 0;
		}
	}

	function modJNDI() {
		var id = R_PANEL2.getSelectionModel().getSelected();
		if (id == null) {
			alert("��ѡ��һ������Դ");
		} else {
			Form2.form.reset();
			mywin2.show();
			mywin2.setTitle("�޸�����Դ");
			Pid = id.id;
			Global.dsopp = 1;
			Form2.form.load({
						waitMsg : '���ڼ����������Ժ�',// ��ʾ��Ϣ
						waitTitle : '��ʾ',// ����
						url : '/servlet/jdbcGatherAction.do?method=getJNDIInfo',// �����url��ַ
						params : {
							ID : id.id
						},
						method : 'GET',// ����ʽ
						success : function(form, action) {// ���سɹ��Ĵ�����

						},
						failure : function(form, action) {// ����ʧ�ܵĴ�����
							Ext.Msg.alert('��ʾ', '������Ϣ����ʧ��');
						}
					});
		}

	}

	function delJNDI() {
		var id = R_PANEL2.getSelectionModel().getSelected();
		if (id == null) {
			alert("��ѡ��һ������Դ");
		} else {
			var msgTip = Ext.MessageBox.show({
						title : '��ʾ',
						width : 250,
						msg : '����ɾ��......'
					});

			Ext.Ajax.request({
						url : '/servlet/jdbcGatherAction.do?method=delJNDI',
						params : {
							ID : id.id
						},
						method : 'POST',
						success : function(response, options) {
							msgTip.hide();
							var result = Ext.util.JSON
									.decode(response.responseText);
							if (result.success) {
								// �����������ݳɹ�ɾ����ͬ��ɾ���ͻ����б��е�����
								Ext.Msg.alert('��ʾ', 'ɾ���ɹ���');
								R_PANEL2_STORE.reload();
							} else {
								Ext.Msg.alert('��ʾ', 'Ŀ¼�����ֽڵģ�����ɾ����');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('��ʾ', 'ɾ����Ϣ����ʧ�ܣ�����Դ�ѱ�����');
						}
					});
		}

	}

	var win = new Ext.Window({
				// layout : 'fit',
				width : 810,
				x : 100,
				y : 10,
				autoHeight : true,
				resizable : false,
				title : 'JDBC�ɼ�����',
				bodyStyle : 'background-color:#22FFFF',// ���������ı���ɫ
				closeAction : 'hide',
				// height : 805,
				// resizable : true,
				shadow : true,
				modal : true,
				closable : true,
				bodyStyle : 'padding:10 10 10 10',
				animCollapse : true,
				items : [JNDItabPanel]
			});

	win.on("beforehide", function() {
				R_PANEL1_STORE.reload();

			}, this)

	new Ext.Viewport({
				title : 'JDBC�ɼ�����',
				layout : 'border',// ��񲼾�
				defaults : {
					collapsible : true,
					split : true
				},
				items : [{
							title : 'JDBC�ɼ�',
							autoScroll : true,
							
							items : [{
										layout : 'accordion',
										region : 'center',
										border	   :false,
										id : 'mainBox',
										layoutConfig : {
											animate : true
										},										
										items : [leftPanel]
									}],
							region : 'west',// ָ���������������Ϊwest
							width : 150
						}, {
							title : '��ӭʹ��',
							items : [R_tabPanel1],
							// layout:'fit',
							region : 'center'// ָ���������������Ϊcenter
						}]
			});
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST","/servlet/@Deprecated/ExecServlet?action=101&paramValue="+getAESEncode(encodeURIComponent("select sys_var_value from sys_config where sys_var='JDBC_GATHER_JOB_STORE'")),false);
    xmlhttp.send();
    if (isSuccess(xmlhttp)) {
        var oRow = xmlhttp.responseXML.selectSingleNode("/root/rowSet");
        var sMode=oRow.attributes[0].value;
        if(sMode=="JOB_RAM") {
        	Ext.getCmp("btnApplyPlan").hide();
        	Ext.getCmp("clientId").hideLabel=false;
        }
        else {
        	Ext.getCmp("btnSendSchdeule").hide();
        	Ext.getCmp("btnDelSchdeuleTask").hide();
        	Ext.getCmp("clientId").hide();
        	Ext.getCmp("clientId").hideLabel=true;
            R_PANEL1.getColumnModel().setHidden(7,true);
            R_PANEL1.getColumnModel().setHidden(8,true);
            R_PANEL1.getColumnModel().setHidden(9,true);
        }
    }

}

function paramTypeRender(val) 
{
	var result;
	switch (val) 
	{
		case '1' :
			result = "��ͨ����";
			break;
		case '2' :
			result = "��̬SQL����";
			break;
		default :
			result = "";
	}
	return result;
}

function datarender(val) 
{
	switch (val) 
	{
		case '0SA' :
			return "SELECT-INSERT���";
			break;
		case '0SB' :
			return "SELECT-�洢���̵���";
			break;
		case '0SC' :
			return 'INSERT���';
			break;
		case '0SD' :
			return '�洢���̵���';
			break;
		case '0SE' :
			return '�ز�ǰ��SQL';
			break;
		case '0SF' :
			return '�洢����-INSERT���';
			break;
		default :
			return val;
	}
}

function showHisCfg()
{
	var oPanel = Ext.getCmp('JNDI_VERSION_HIS_PANEL');
	var record = oPanel.getSelectionModel().selection.record;
	var versionId = record.get('VERSION_ID');
	var serviceId = record.get('SERVICE_ID');
	Global.hisJNDIpanel1.form.reset();
	Global.hisJNDIpanel4.form.reset();
	Global.hisJNDIpanel2_STORE.removeAll();
	Global.hisJNDIpanel3_STORE.removeAll();
	Global.hisWin.show();
	Global.hisWin.center();
	Global.hisJNDItabPanel.setActiveTab(1);
	Global.hisJNDIpanel1.form.load({
				waitMsg : '���ڼ����������Ժ�',
				waitTitle : '��ʾ',
				url : '/servlet/jdbcGatherAction.do?method=getJDBC1',
				params : {
					ID : serviceId
				},
				method : 'GET',
				success : function(form, action) {
				},
				failure : function(form, action) {
					Ext.Msg.alert('��ʾ', '������Ϣ����ʧ��');
				}
			});

	Global.hisJNDIpanel2_STORE.load({
				params : {
					versionId : versionId,
					style : 'R_PANEL2',
					start : 0,
					limit : 20
				}
			});
	Global.hisJNDIpanel3_STORE.load({
				params : {
					versionId : versionId,
					style : 'R_PANEL2',
					start : 0,
					limit : 20
				}
			});

	Global.hisJNDIpanel4.form.load({
				waitMsg : '���ڼ����������Ժ�',
				waitTitle : '��ʾ',
				url : '/servlet/jdbcGatherAction.do?method=getJDBC4His',
				params : {
					versionId : versionId
				},
				method : 'GET',
				success : function(form, action) {
				},
				failure : function(form, action) {
				}
			});
}

function initHisWin()
{
	Global.his_gather_client_store = new Ext.data.JsonStore({
		url : '/servlet/jdbcGatherAction.do?method=getGatherClient',
		root : 'items',
		fields : ['client_id', 'client_name'],
		baseParams : {
		}
	});
	
	Global.his_gather_client_store.load({
		params : {
			start : 0,
			limit : 20
		}
	});
	
	Global.hisJNDIpanel1 = new Ext.FormPanel({
				height : 300,
				labelSeparator : "��",
				frame : true,
				title : "���������Ϣ",
				border : false,
				items : [{
							xtype : 'textfield',
							width : 500,
							allowBlank : false,
							blankText : '��������',
							name : 'NAME',
							disabled : true,
							fieldLabel : '��������'
						}, {
							xtype : 'textarea',
							width : 500,
							height : 300,
							allowBlank : false,
							blankText : '˵��',
							name : 'REMARK',
							disabled : true,
							fieldLabel : '��ע˵��'
						}, {
							fieldLabel : '״̬',
							hiddenName : 'state',
							xtype : 'combo',
							editable : false,
							allowBlank : false,
							disabled : true,
							triggerAction : 'all',
							mode : 'local',
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [["0SA", "��Ч"], ["0SX", "ʧЧ"]]
									}),
							valueField : 'value',
							displayField : 'text'
						}]
			});

	Global.hisJNDIpanel2_STORE = new Ext.data.Store({
		autoLoad : false,
		reader : new Ext.data.XmlReader({
					totalRecords : "results",
					record : "JDBCPram",
					id : "param_id"
				}, Ext.data.Record.create([{
							name : 'param_id',
							type : 'float'
						}, {
							name : 'param_name'
						}, {
							name : 'pri_value'
						}, {
							name : 'gen_sql'
						},{
							name : 'paramType'
						}])),
		proxy : new Ext.data.HttpProxy({
					url : '/servlet/jdbcGatherAction.do?method=getJNDIHisParam'
				})
	});
	
	Global.hisJNDIpanel2 = new Ext.grid.GridPanel({
		store : Global.hisJNDIpanel2_STORE,
		animScroll : true,
		autoScroll : true,
		height : 500,
		width : 400,
		title : '�ɼ�����',
		enableTabScroll : true,
		bbar : new Ext.PagingToolbar({
			store : Global.hisJNDIpanel2_STORE,
			pageSize : 20,
			displayInfo : true,
			displayMsg : '�� {0} ���� {1} ����һ�� {2} ��',
			emptyMsg : "û�м�¼"
		}),
		columns : [
				new Ext.grid.RowNumberer({
							header : '�к�',
							width : 36
						}),
				{
					header : "��������",
					width : 100,
					dataIndex : 'param_name',
					sortable : true
				}, {
					header : "��ʼֵ",
					width : 160,
					dataIndex : 'pri_value',
					sortable : true
				}, {
					header : "���ɹ���SQL",
					xtype : 'textarea',
					height : 250,
					width : 300,
					dataIndex : 'gen_sql',
					sortable : true
				}, {
					header : "��������",
					width : 150,
					dataIndex : 'paramType',
					sortable : true,
					renderer : paramTypeRender
				}]
	});
	
	Global.hisJNDIpanel3_STORE = new Ext.data.Store({
		autoLoad : false,
		reader : new Ext.data.XmlReader({
					totalRecords : "results",
					record : "JNDISQLObj",
					id : "SQL_ID"
				}, Ext.data.Record.create([{
							name : 'SQL_ID',
							type : 'float'
						}, {
							name : 'SQL_TEXT1'
						}, {
							name : 'SQL_TEXT2'
						}, {
							name : 'SORT_ID'
						}, {
							name : 'SQL_TYPE'
						}, {
							name : 'POOL_ID'
						},{
							name : 'DEST_POOL_ID'
						}, {
							name : 'REMARK'
						},{
                            name : 'QUERY_TIMEOUT'
                        }])),
		proxy : new Ext.data.HttpProxy({
					url : '/servlet/jdbcGatherAction.do?method=getJNDISQLHis'
				})
	});
	
	Global.hisJNDIpanel3 = new Ext.grid.GridPanel({
				store : Global.hisJNDIpanel3_STORE,
				animScroll : true,
				autoScroll : true,
				height : 500,
				width : 400,
				title : '�ɼ�SQL����',
				enableTabScroll : true,
				bbar : new Ext.PagingToolbar({// ��ҳ������
					store : Global.hisJNDIpanel3_STORE,
					pageSize : 20,
					displayInfo : true,
					displayMsg : '�� {0} ���� {1} ����һ�� {2} ��',
					emptyMsg : "û�м�¼"
				}),
				columns : [
						new Ext.grid.RowNumberer({
									header : '�к�',
									width : 36
								}),
						{
							header : "�ɼ�SQL����",
							width : 80,
							renderer : datarender,
							dataIndex : 'SQL_TYPE',
							sortable : true
						}, {
							header : "SQL�ı�1",
							width : 150,
							dataIndex : 'SQL_TEXT1',
							sortable : true
						}, {
							header : "SQL�ı�2",
							width : 160,
							dataIndex : 'SQL_TEXT2',
							sortable : true
						},{
                            header : "��ѯ��ʱ",
                            width : 60,
                            dataIndex : 'QUERY_TIMEOUT',
                            sortable : true
                        }, {
							header : "ִ��˳��",
							width : 60,
							dataIndex : 'SORT_ID',
							sortable : true
						}, {
							header : "��ע˵��",
							width : 60,
							dataIndex : 'REMARK',
							sortable : true
						}, {
							header : "����Դ",
							width : 60,
							dataIndex : 'POOL_ID',
							sortable : true
						},{
							header : "Ŀ������Դ",
							width : 60,
							dataIndex : 'DEST_POOL_ID',
							sortable : true
						}]
			});
	Global.hisJNDIpanel4 = new Ext.FormPanel({
				height : 300,
                labelWidth : 150,
				labelSeparator : "��",
				frame : true,
				title : "����ʱ�ƻ�",
				border : false,
				items : [{
					fieldLabel : '��ʱ�ƻ�����',
					hiddenName : 'SCHED_TYPE',
					name : 'SCHED_TYPE',
					xtype : 'combo',
					width : 350,
					editable : false,
					disabled : true,
					triggerAction : 'all',
					mode : 'local',
					store : new Ext.data.SimpleStore({
								fields : ['value', 'text'],
								data : [["0SA", "����"], ["0SB", "��ʱ"],
										["0SC", "��ʱ"]]
							}),
					valueField : 'value',
					displayField : 'text'
				}, {
					fieldLabel : '�ɼ�����',
					hiddenName : 'CYCLE_TYPE',
					name : 'SCHED_TYPE',
					xtype : 'combo',
					width : 350,
					allowBlank : false,
					disabled : true,
					editable : false,
					triggerAction : 'all',
					mode : 'local',
					store : new Ext.data.SimpleStore({
								fields : ['value', 'text'],
								data : [["N", "��"], ["H", "ʱ"], ["D", "��"],
										["W", "��"], ["M", "��"]]
							}),
					valueField : 'value',
					displayField : 'text'
				}, {
					name : 'INTERVAL',
					xtype : 'textfield',
					fieldLabel : '�ɼ�Ƶ��',
					width : 350,
					allowBlank : false,
					disabled : true,
					regex : /^[1-9]*[1-9][0-9]*$/,
					regexText : '�����������������.',
					maxLength : 50
				}, {
					name : 'RUN_TIME',
					xtype : 'itnmCronField',
                    baseCls: 'x-plain',
                    fieldWidth: 60,
					width : 350,
					disabled : true,
                    maskRe: /^[0-9|*|,|-]{0,1}$/,
					fieldLabel : '��ʱ����ʱ��'
				}, {
					name : 'START_TIME',
					endDateField : 'enddt',
					width : 350,
					xtype : 'datefield',
					fieldLabel : '�ƻ���Чʱ��',
					allowBlank : false,
					minValue : '01/01/1900',
					format : 'Y-m-d H:i',
					menu : new DatetimeMenu(),
					disabled : true
				}, {
					disabled : true,
					startDateField : 'startdt',
					name : 'END_TIME',
					// vtype: 'daterange',
					width : 350,
					xtype : 'datefield',
					fieldLabel : '�ƻ�ʧЧʱ��',
					format : 'Y-m-d H:i',
					allowBlank : false,
					maxValue : '01/01/2038',
					menu : new DatetimeMenu()
				}, {
					name : 'GSTART_TIME',
					endDateField : 'Genddt',
					width : 350,
					xtype : 'datefield',
					fieldLabel : '�ɼ���ʼʱ�����',
					allowBlank : false,
					minValue : '01/01/1900',
					format : 'Y-m-d H:i',
					menu : new DatetimeMenu(),
					disabled : true
				}, {
					startDateField : 'Gstartdt',
					name : 'GEND_TIME',
					// vtype: 'daterange',
					width : 350,
					xtype : 'datefield',
					fieldLabel : '�ɼ�����ʱ�����',
					format : 'Y-m-d H:i',
					allowBlank : false,
					maxValue : '01/01/2038',
					menu : new DatetimeMenu(),
					disabled : true
				}, {
                    fieldLabel : '�������ȼ���Խ��Խ�ߣ�',
                    hiddenName : 'PRIORITY_LEVEL',
                    name : 'SCHED_TYPE',
                    xtype : 'combo',
                    width : 350,
                    allowBlank : false,
                    editable : false,
                    disabled : true,
                    triggerAction : 'all',
                    mode : 'local',
                    value : 5,
                    store : new Ext.data.SimpleStore({
                        fields : ['value', 'text'],
                        data : [["1", "1���ͣ�"], ["2", "2"], ["3", "3"],
                            ["4", "4"], ["5", "5"],
                            ["6", "6"], ["7", "7"], ["8", "8"],
                            ["9", "9"], ["10", "10���ߣ�"]]
                    }),
                    valueField : 'value',
                    displayField : 'text'
                }, {
					xtype : 'textarea',
					width : 560,
					height : 150,
					value : '',
					allowBlank : false,
					disabled : true,
					blankText : '˵��',
					name : 'REMARK',
					fieldLabel : '��ע˵��'
				}]
			});

	Global.hisJNDItabPanel = new Ext.TabPanel({
				height : 500,
				width : 778,
				activeTab : 0,// Ĭ�ϼ����һ��tabҳ
				animScroll : true,// ʹ�ö�������Ч��
				autoScroll : true,
				frame : false,
				items : [Global.hisJNDIpanel4, Global.hisJNDIpanel1, Global.hisJNDIpanel2, Global.hisJNDIpanel3],
				enableTabScroll : false
	});
	
	Global.hisWin = new Ext.Window({
				width : 810,
				autoHeight : true,
				resizable : false,
				title : '�����¼',
				bodyStyle : 'background-color:#22FFFF',
				closeAction : 'hide',
				shadow : true,
				modal : true,
				closable : true,
				bodyStyle : 'padding:10 10 10 10',
				items : [Global.hisJNDItabPanel]
			});
}

function updateGatherVersionRemark(versionId, remark)
{
	var  oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	var param = new Array();
	param.push("versionId=" + versionId);
	param.push("remark=" + remark);
	oXMLHTTP.open("POST","/servlet/jdbcGatherAction.do?method=updateVersionRemark&" + param.join('&'), false);
	oXMLHTTP.send();
	isSuccess(oXMLHTTP);
}