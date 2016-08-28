Ext.BLANK_IMAGE_URL = '/resource/js/ext-2.0.2/resources/images/default/s.gif';
Ext.QuickTips.init();
Ext.onReady(initExt);
function initExt() {
	// Ext.Msg.alert("sdf", "sdafsdf");

	Ext.form.Field.prototype.msgTarget = 'side';// ͳһָ��������Ϣ��ʾ��ʽ
	var Pid;
	var type;// ��������
	var service_id = 22;

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
							iconCls : 'icon-plugin',
							text : 'ɾ��Ŀ¼',
							handler : delLevel
						}]
			});

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
								// �����������ݳɹ�ɾ����ͬ��ɾ���ͻ����б��е�����

								Ext.Msg.alert('��ʾ', 'ɾ���ɹ���');
								var loader = TREE1.getLoader()
								loader.load(prodrootnode, function() {
											prodrootnode.collapse();
										});// ���¼��ظ��ڵ�
							} else {
								Ext.Msg.alert('��ʾ', 'Ŀ¼�����ֽڵģ�����ɾ����');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('��ʾ', 'ɾ����Ϣ����ʧ�ܣ�' );
						}
					});
		}

	}

	var Pid;

	function addLevel() {
		var sm = TREE1.getSelectionModel();
		var node = sm.getSelectedNode();
		if (node == null || node.isLeaf())
			Ext.MessageBox.alert("����", "��ѡ��һ��Ŀ¼");
		else {
			Form1.form.reset();
			mywin.setTitle("����Ŀ¼��Ϣ");
			mywin.show();
			Pid = node.id;
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
							text : '�ر�',
							handler : function() {
								mywin.hide();
							}
						}, {
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
				height : 400,
				labelSeparator : "��",
				frame : true,
				border : false,
				items : [{
							xtype : 'textfield',
							width : 200,
							value : '',
							allowBlank : false,
							blankText : '����ԴJNDI',
							name : 'JNDI',
							fieldLabel : '����ԴJNDI'
						}, {
							xtype : 'textfield',
							width : 200,
							value : '',
							allowBlank : false,
							blankText : '˵��',
							name : 'remark',
							fieldLabel : '��ע˵��'
						}],
				buttons : [{
							text : '�ر�',
							handler : function() {
								mywin2.hide();
							}
						}, {
							text : '�ύ',
							handler : submitForms2
						}]
			});

	var mywin2 = new Ext.Window({
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
				items : [Form2]
			});

	function submitForms() {
		Form1.form.submit({
					params : {
						Pid : Pid
					},
					// clientValidation : true,// ���пͻ�����֤
					waitMsg : '�����ύ�������Ժ�',// ��ʾ��Ϣ
					waitTitle : '��ʾ',// ����
					url : '/servlet/jdbcGatherAction.do?method=addLEVEL',// �����url��ַ
					method : 'POST',// ����ʽ
					success : function(form, action) {// ���سɹ��Ĵ�����
						mywin.hide();
						Ext.Msg.alert('��ʾ', action.result.message);
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
					failure : function(form, action) {}
				});

	}

	function submitForms2() {
		Form2.form.submit({
					params : {
						Pid : Pid
					},
					// clientValidation : true,// ���пͻ�����֤
					waitMsg : '�����ύ�������Ժ�',// ��ʾ��Ϣ
					waitTitle : '��ʾ',// ����
					url : '/servlet/jdbcGatherAction.do?method=addJNDI',// �����url��ַ
					method : 'POST',// ����ʽ
					success : function(form, action) {// ���سɹ��Ĵ�����
						mywin.hide();
						Ext.Msg.alert('��ʾ', action.result.message);
						R_PANEL2_STORE.load({
									params : {
										node : Pid,
										style : 'R_PANEL2',
										start : 0,
										limit : 20
									}
								});
					},
					failure : function(form, action) {}
				});

	}

	function submitForms4() {
		Form4.form.submit({
					params : {
						Pid : service_id
					},
					// clientValidation : true,// ���пͻ�����֤
					waitMsg : '�����ύ�������Ժ�',// ��ʾ��Ϣ
					waitTitle : '��ʾ',// ����
					url : '/servlet/jdbcGatherAction.do?method=addJDBC2',// �����url��ַ
					method : 'POST',// ����ʽ
					success : function(form, action) {// ���سɹ��Ĵ�����
						mywin.hide();
						Ext.Msg.alert('��ʾ', action.result.message);
						JNDIpanel2_STORE.load({
									params : {
										node : service_id,
										style : 'R_PANEL2',
										start : 0,
										limit : 20
									}
								});
					},
					failure : function(form, action) {}
				});

	}

	var TREE1 = new Ext.tree.TreePanel({

				id : 'TREE1',
				autoScroll : true,
				
                containerScroll : true,
				contextMenu : contextMenu,
				loader : new Ext.tree.TreeLoader({
							baseAttrs : {
								cust : 'happy'
							},
							dataUrl : '/servlet/jdbcGatherAction.do?method=getTree'
						}),


				//width : 188,
				tabTip :"˫����ѯ",
				//height : 726,
				listeners : {
				  dblclick :quary
				
				},
				border	   :false,
				root : prodrootnode
			});

	var leftPanel = new Ext.Panel({
		id : 'lefttabPanel',
		//height : 800,
		autoHeight  : true,
		title : 'JDBC�ɼ�����',
		collapsible : true,
		region : 'west',// ָ���������������Ϊwest
		width : 250,
		border:false,
		animScroll : true,// ʹ�ö�������Ч��
        autoScroll:true,
		items : TREE1,
		enableTabScroll : true
			// tab��ǩ����ʱ�Զ����ֹ�����ť
		});

	// JNDIpanel1 ���������Ϣ
	function submitForms3() {
		JNDIpanel1.form.submit({
					params : {
						Pid : Pid
					},
					// clientValidation : true,// ���пͻ�����֤
					waitMsg : '�����ύ�������Ժ�',// ��ʾ��Ϣ
					waitTitle : '��ʾ',// ����
					url : '/servlet/jdbcGatherAction.do?method=addJDBC1',// �����url��ַ
					method : 'POST',// ����ʽ
					success : function(form, action) {// ���سɹ��Ĵ�����

						Ext.Msg.alert('��ʾ', action.result.message);
						service_id = action.result.service_id;
						// R_PANEL2_STORE.load({
						// params : {
						// node : Pid,
						// style : 'R_PANEL2',
						// start : 0,
						// limit : 20
						// }
						// });
					},
					failure : function(form, action) {}
				});

	}

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
							height : 250,
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
						}])),
		proxy : new Ext.data.HttpProxy({
					url : '/servlet/jdbcGatherAction.do?method=getJNDI_PARAM'
				})
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
						}, {
							name : 'REMARK'
						}])),
		proxy : new Ext.data.HttpProxy({
					url : '/servlet/jdbcGatherAction.do?method=getJNDISQL'
				})
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
							text : 'ɾ������',
							iconCls : 'icon-delete',
							handler : delPARAM
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
							width : 300,
							dataIndex : 'pri_value',
							sortable : true
						}, {
							header : "���ɹ���SQL",
							width : 300,
							dataIndex : 'gen_sql',
							sortable : true
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
							allowBlank : false,
							blankText : '��ʼֵ',
							name : 'P_VALUE',
							fieldLabel : '��ʼֵ'
						}, {
							xtype : 'textfield',
							width : 200,
							value : '',
							allowBlank : false,
							blankText : '���ɹ���SQL',
							name : 'SQLRULE',
							fieldLabel : '���ɹ���SQL'
						}],
				buttons : [{
							text : '�ر�',
							handler : function() {
								mywin4.hide();
							}
						}, {
							text : '�ύ',
							handler : submitForms4
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
		mywin4.show();

	}

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

		Form5.form.submit({
					params : {
						Pid : service_id
					},
					// clientValidation : true,// ���пͻ�����֤
					waitMsg : '�����ύ�������Ժ�',// ��ʾ��Ϣ
					waitTitle : '��ʾ',// ����
					url : '/servlet/jdbcGatherAction.do?method=addJDBC3',// �����url��ַ
					method : 'POST',// ����ʽ
					success : function(form, action) {// ���سɹ��Ĵ�����
						mywin.hide();
						Ext.Msg.alert('��ʾ', action.result.message);
						JNDIpanel3_STORE.load({
									params : {
										node : service_id,
										style : 'R_PANEL2',
										start : 0,
										limit : 20
									}
								});
					},
					failure : function(form, action) {}
				});

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

	var Form5 = new Ext.FormPanel({
				height : 400,
				labelSeparator : "��",
				frame : true,
				border : false,
				items : [{
					fieldLabel : 'SQL����',
					hiddenName : 'SQL_TYPE',
					name : 'sched.CYCLE_TYPE_NAME',
					xtype : 'combo',
					width : 200,
					allowBlank : false,
					editable : false,
					triggerAction : 'all',
					mode : 'local',
					store : new Ext.data.SimpleStore({
								fields : ['value', 'text'],
								data : [["0SA", "SELECT-INSERT���"],
										["0SB", "SELECT-�洢���̵���"],
										["0SC", "INSERT���"], ["0SD", "�洢���̵���"],
										["0SE", "�ز�ǰ��SQL"]]
							}),
					valueField : 'value',
					displayField : 'text'
				}, {
					xtype : 'textfield',
					width : 200,
					value : '',
					allowBlank : false,
					blankText : 'SQL�ı�1',
					name : 'SQL1',
					fieldLabel : 'SQL�ı�1'
				}, {
					xtype : 'textfield',
					width : 200,
					value : '',
					allowBlank : false,
					blankText : 'SQL�ı�2',
					name : 'SQL2',
					fieldLabel : 'SQL�ı�2'
				}, {
					xtype : 'textfield',
					width : 200,
					value : '',
					allowBlank : false,
					blankText : 'ִ��˳��',
					name : 'SORT',
					fieldLabel : 'ִ��˳��'
				}, {
					xtype : 'textfield',
					width : 200,
					value : '',
					allowBlank : false,
					blankText : '��ע˵��',
					name : 'REMARK',
					fieldLabel : '��ע˵��'
				}, {
					width : 120,
					fieldLabel : '��������Դ',
					name : 'FIR_DIR_NAME',
					hiddenName : 'POOL_ID',
					allowBlank : false,
					blankText : '��������Դ',
					xtype : 'combo',
					editable : false,
					triggerAction : 'all',
					mode : 'remote', // localֱ���ȼ��ؽ��� remote�ǵ���ż���
					store : sql_con_store,
					emptyText : '��ѡ��...',
					valueField : 'POOL_ID',
					displayField : 'JNDI_NAME'
				}],
				buttons : [{
							text : '�ر�',
							handler : function() {
								mywin5.hide();
							}
						}, {
							text : '�ύ',
							handler : submitForms6
						}]
			});

	var mywin5 = new Ext.Window({
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
				items : [Form5]
			});

	function addSQL() {
		service_id = 22;
		sql_con_store.load({
					params : {
						node : service_id,
						style : 'R_PANEL2',
						start : 0,
						limit : 20
					}
				});
		mywin5.show();

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
								JNDIpanel3_STORE.reload();
							} else {
								Ext.Msg.alert('��ʾ', 'Ŀ¼�����ֽڵģ�����ɾ����');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('��ʾ', 'ɾ����Ϣ����ʧ�ܣ�' );
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
							dataIndex : 'SQL_TYPE',
							sortable : true
						}, {
							header : "SQL�ı�1",
							width : 160,
							dataIndex : 'SQL_TEXT1',
							sortable : true
						}, {
							header : "SQL�ı�2",
							width : 160,
							dataIndex : 'SQL_TEXT2',
							sortable : true
						}, {
							header : "ִ��˳��",
							width : 80,
							dataIndex : 'SORT_ID',
							sortable : true
						}, {
							header : "��ע˵��",
							width : 140,
							dataIndex : 'REMARK',
							sortable : true
						}, {
							header : "����Դ",
							width : 80,
							dataIndex : 'POOL_ID',
							sortable : true
						}]
			});
	//

	//
	// ��ʱ�ƻ�
	var JNDIpanel4 = new Ext.FormPanel({
				id : 'JNDIpanel4',
				height : 300,
				labelSeparator : "��",
				frame : true,
				title : "����ʱ�ƻ�",
				border : false,
				items : [{
					fieldLabel : '��ʱ�ƻ�����',
					hiddenName : 'SCHED_TYPE',
					name : 'sched.SCHED_TYPE_NAME',
					xtype : 'combo',
					width : 300,
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
					listeners : {
				// 'select' : function(combo, record, index) {
					// var frm = usrFlowForm.getForm();
					// var v_type = record.data['value'];
					//
					// if (v_type != '0SC') {
					// frm.findField("sched.RUN_TIME").enable();
					// frm.findField("sched.INTERVAL").enable();
					// frm.findField("sched.CYCLE_TYPE").enable();
					// } else {
					// frm.findField("sched.RUN_TIME").disable();
					// frm.findField("sched.INTERVAL").disable();
					// frm.findField("sched.CYCLE_TYPE").disable();
					// }
					// if (v_type == '0SA') {
					// frm.findField("sched.RUN_TIME").disable();
					// };
					// }
					}
				}, {
					fieldLabel : '�ɼ�����',
					hiddenName : 'CYCLE_TYPE',
					name : 'sched.CYCLE_TYPE_NAME',
					xtype : 'combo',
					width : 300,
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
					width : 300,
					allowBlank : false,
					regex : /^[1-9]*[1-9][0-9]*$/,
					regexText : '�����������������.',
					maxLength : 50
				}, {
					name : 'RUN_TIME',
					xtype : 'uxruntimefield',
					width : 300,
					fieldLabel : '��ʱ����ʱ��'
				}, {
					id : 'startdt',
					name : 'START_TIME',
					endDateField : 'enddt',
					// vtype: 'daterange',
					width : 300,
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
					width : 300,
					xtype : 'datefield',
					fieldLabel : '�ƻ�ʧЧʱ��',
					format : 'Y-m-d H:i',
					allowBlank : false,
					maxValue : '01/01/2038',
					menu : new DatetimeMenu(),
					readOnly : true
				}, {
					id : 'Gstartdt',
					name : 'G_START_TIME',
					endDateField : 'Genddt',
					// vtype: 'daterange',
					width : 300,
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
					name : 'G_END_TIME',
					// vtype: 'daterange',
					width : 300,
					xtype : 'datefield',
					fieldLabel : '�ɼ�����ʱ�����',
					format : 'Y-m-d H:i',
					allowBlank : false,
					maxValue : '01/01/2038',
					menu : new DatetimeMenu(),
					readOnly : true
				}, {
					xtype : 'textarea',
					width : 500,
					height : 250,
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
		var rows = R_PANEL1.getSelectionModel().getSelections();
		if(rows.length == 0){
			var msgBox = Ext.MessageBox.show({
				id : 'msgBox',
				title : '��ʾ',
				width : 200,
				msg : '����ѡ��һ�����ν����ز�.',
				buttons : Ext.Msg.OK,
				icon : Ext.Msg.INFO
			});
			return false;
		}
		var ids = new Array();
		for (var i = 0, row; row = rows[i]; i++) {
			ids.push(row.id);
		}
		var msgTip = Ext.MessageBox.show({
					title : '��ʾ',
					width : 250,
					msg : '���ڲ���......'
				});
		Ext.Ajax.request({
					url : '/servlet/jdbcGatherAction.do?method=reGather',
					params : {
						ID : ids.join(','),
						service_id:TREE1.getSelectionModel().getSelectedNode().id
					},
					method : 'POST',
					success : function(response, options) {
						msgTip.hide();
						var result = Ext.util.JSON.decode(response.responseText);
						if (result.success) {
							Ext.Msg.alert('��ʾ', '�����ز���Ϣ�ɹ������Ժ����²�ѯ�鿴�����');
						} else {
							Ext.Msg.alert("������Ϣ", unescape(result.message));
						}
					},
					failure : function(response, options) {
						msgTip.hide();
						Ext.Msg.alert("������Ϣ", unescape(options.result.message));
					}
				});
	}
	
	function submitForms5() {
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
						mywin.hide();
						Ext.Msg.alert('��ʾ', action.result.message);
					},
					failure : function(form, action) {// ����ʧ�ܵĴ�����
						// Ext.Msg.alert('��ʾ', '��������ʧ��');
						for (var err in action.result.errors) {}
					}
				});

	}
	//
	// �����ɼ�����TabPanel
	var JNDItabPanel = new Ext.TabPanel({
				id : 'JNDItabPanel',
				height : 400,
				width : 770,
				activeTab : 0,// Ĭ�ϼ����һ��tabҳ
				animScroll : true,// ʹ�ö�������Ч��
				autoScroll : true,
				frame : false,
				items : [JNDIpanel4, JNDIpanel1, JNDIpanel2, JNDIpanel3],
				// items : [JNDIpanel1, JNDIpanel2, JNDIpanel3],
				enableTabScroll : false
			});

	// -----------------------------------------------------------------------------���̶������
	// END
	// -------------------------------------------------------------------����ʵ�����

	var R_PANEL1_STORE = new Ext.data.Store({// ���÷������ݼ�
		id : 'R_PANEL1_STORE',
		autoLoad : false,
		reader : new Ext.data.XmlReader({
					totalRecords : "results",
					record : "BatchInfo",
					id : "batch_id"
				}, Ext.data.Record.create([{
							name : 'batch_id',
							type : 'float'
						}, {
							name : 's_time'
						}, {
							name : 'e_time'
						}, {
							name : 'state'
						}, {
							name : 'exec_info'
						}])),
		proxy : new Ext.data.HttpProxy({
					url : '/servlet/jdbcGatherAction.do?method=queryBatch'
				})
	})

	R_PANEL1_STORE.on("beforeload", function(store, node) {
				var sm = TREE1.getSelectionModel();
				var node = sm.getSelectedNode();
				if (node == null) {
					Ext.MessageBox.alert("������������", "��ѡ��һ���ɼ�����");
					return;
				}
				R_PANEL1_STORE.removeAll();
				var SDate = Ext.getCmp('beginDate').getValue().format('Y-m-d');
				var EDate = Ext.getCmp('endDate').getValue().format('Y-m-d');
				R_PANEL1_STORE.baseParams.node = node.id;
				R_PANEL1_STORE.baseParams.SDate = SDate;
				R_PANEL1_STORE.baseParams.EDate = EDate;
			}, this)

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

	function callBack(id) {
		Ext.getCmp('JNDItabPanel').setActiveTab(JNDIpanel1);
	}

	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect	: false,
				header			: ''
			});
			
	var R_PANEL1 = new Ext.grid.GridPanel({
		id : 'R_PANEL1',
		layout : 'fit',
        autoExpandColumn : 5,
		//anchor : '99%',
		// autoHeight :true,
		//height : 500,
		//width : 400,
		store : R_PANEL1_STORE,
		animScroll : true,// ʹ�ö�������Ч��
		autoScroll : true,
		title : 'JDBC�ɼ������б�',
		enableTabScroll : true,
		tbar : new Ext.Toolbar([{
					xtype : 'tbtext',
					text : '��ʼʱ��:'
				}, {
					id : 'beginDate',
					xtype : 'datefield',
					format : 'Y��m��d��',// ��ʾ���ڵĸ�ʽ
					width : 150,
					allowBlank : false,// ������Ϊ��
					readOnly : true,// ����ֻ��
					value : new Date(),// ����Ĭ��ֵ
					fieldLabel : '��ʼ����'
					// dateRange:{begin:'beginDate',end:'endDate'},//����vtype����dateRange
				// vtype:'dateRange'
			}	, '-', {
					xtype : 'tbtext',
					text : '����ʱ��:'
				}, new Ext.form.DateField({
					id : 'endDate',
					format : 'Y��m��d��',// ��ʾ���ڵĸ�ʽ
					width : 150,
					allowBlank : false,// ������Ϊ��
					readOnly : true,// ����ֻ��
					value : new Date(),// ����Ĭ��ֵ
					fieldLabel : '��������'
						// dateRange:{begin:'beginDate',end:'endDate'},//
						// ����vtype����dateRange
						// vtype:'dateRange'
					}), '-', new Ext.Button({
							text : '  ��ѯ',
							width : 110,
							handler : function quary() {
								var sm = TREE1.getSelectionModel();
								var node = sm.getSelectedNode();
								if (node == null) {
									Ext.MessageBox.alert("������������", "��ѡ��һ���ɼ�����");
									return;
								}
								R_PANEL1_STORE.removeAll();

								var SDate = Ext.getCmp('beginDate').getValue()
										.format('Y-m-d');
								var EDate = Ext.getCmp('endDate').getValue()
										.format('Y-m-d');

								if (SDate > EDate) {

									Ext.MessageBox.alert("������������",
											"��ʼ���ڲ��ܴ��ڽ�������");
									return;
								}
								R_PANEL1_STORE.load({
											params : {
												node : node.id,
												SDate : SDate,
												EDate : EDate,
												style : 'R_PANEL1',
												start : 0,
												limit : 20
											}
										});

							}
						}), '-', {
					text : '�����ز�',
					tooltip : '<b>����ִ�и�����</b>',
					handler : applyPlan
				}]),
		bbar : new Ext.PagingToolbar({// ��ҳ������
			store : R_PANEL1_STORE,
			pageSize : 20,
			displayInfo : true,
			displayMsg : '�� {0} ���� {1} ����һ�� {2} ��',
			emptyMsg : "û�м�¼"
		}),
		sm : sm,
		columns : [// ���ñ����
				//new Ext.grid.RowNumberer({
					//		header : '�к�',
					//		width : 36
					//	}),// ����к����
				sm,
				{
					header : "���α�ʶ",
					width : 120,
					dataIndex : 'batch_id',
					sortable : true
				}, {
					header : "��ʼʱ��",
					width : 160,
					dataIndex : 's_time',
					sortable : true
				}, {
					header : "����ʱ��",
					width : 160,
					dataIndex : 'e_time',
					sortable : true
				}, {
					header : "״̬",
					width : 80,
					dataIndex : 'state',
					renderer : RWD_datarender,
					sortable : true
				}, {
					header : "��ϸ��Ϣ",
					renderer : qtips,
					dataIndex : 'exec_info',
					renderer : qtips,
					sortable : true
				}]
	});
	
	function RWD_datarender(val) {
		switch (val) {
			case 'ִ�гɹ�' :
				return val;
				break
			case 'ִ��ʧ��' :
				return '<font color=red>'+val+'</font>';
				break
            case 'ִ�г�ʱ' :
                return '<font color=orange>'+val+'</font>';
                break
		}
	}
	
	function qtips(val) {
		return '<span style="display:table;width:100%;" qtip="' + val + '">'
				+ val + '</span>'
	}

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
							width : 100,
							dataIndex : 'JNDI_NAME',
							sortable : true
						}, {
							header : "˵��",
							width : 300,
							dataIndex : 'REMARK',
							sortable : true
						}]
			});

	R_PANEL2.on("click", function(store, node) {

				//
				// RWDstore.load({
				// params : {
				// target : R_PANEL2.getSelectionModel()
				// .getSelected().get('FLOW_INST_ID')
				// }
				// });

			}, this)

	var R_tabPanel1 = new Ext.TabPanel({
				id : 'R_tabPanel1',
				// anchor : '99%',
				//autoHeight : true,
				// height :555,
				activeTab : 0,// Ĭ�ϼ����һ��tabҳ
				animScroll : true,// ʹ�ö�������Ч��
				autoScroll : true,
				frame : true,
				items : [R_PANEL1],
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
								// R_PANEL2_STORE.load({
								// params : {
								// node : node.id,
								// style : 'R_PANEL2',
								// start : 0,
								// limit : 20
								// }
								// });
							} else {
								Ext.Msg.alert('��ʾ', 'Ŀ¼�����ֽڵģ�����ɾ����');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('��ʾ', 'ɾ����Ϣ����ʧ�ܣ�' );
						}
					});
		}

	}

	var win = new Ext.Window({
				// layout : 'fit',
				width : 805,
				x : 100,
				y : 10,
				autoHeight : true,

				title : 'JDBC�ɼ�����',
				bodyStyle : 'background-color:#22FFFF',// ���������ı���ɫ
				closeAction : 'hide',
				// height : 805,
				// resizable : true,
				shadow : true,
				modal : true,
				closable : true,
				bodyStyle : 'padding:15 15 15 15',
				animCollapse : true,
				items : [JNDItabPanel]
			});

	new Ext.Viewport({
				title : 'JDBC�ɼ�����',
				defaults : {
					collapsible : true,
					split : true
				},
				layout : 'border',// ��񲼾�
				items : [{
							title : 'JDBC�ɼ�',
							autoScroll : true,
							items : [{
										layout : 'accordion',
										border	   :false,
										region : 'center',
										id : 'mainBox',
										layoutConfig : {
											animate : true
										},
										items : [leftPanel]
									}],
							region : 'west',// ָ���������������Ϊwest
							width : 320
						}, {
							title : '���βɼ����',
							layout : 'fit',
							items : [R_tabPanel1],
							region : 'center'// ָ���������������Ϊcenter
						}]
			});
}
