/** ********************************************�ܽ���********************************* */
Ext.namespace("agentdeploy.list");
Ext.LoadMask.prototype.msg = "����������...";
Ext.BLANK_IMAGE_URL = '../../resource/js/ext/resources/images/default/s.gif';

agentdeploy.list.agentListPanel = function(config) {
	var e = document.body;
	Ext.EventManager.onWindowResize(this.fireResize.createDelegate(this));
	Ext.QuickTips.init();
	/** *******************************************��������************************************************** */
	this.pageSize = 20;// ��ʾ����
	this.deployingAgents = [];// ����Ķ���
	this.deployedAgents = [];
	this.deployStart = 0;// ��ʼλ��
	this.deployEnd = 0;// ����λ��
	// ��ʱ��
	this.task = {
		run : function() {
			this.deployRresh(this.deployedAgents);
		},
		scope : this,
		interval : 3000
	};
	/** **********************************************Ԫ�ض���******************************************************** */
	this.fileName = new Ext.form.ComboBox({
		store : new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : '../../servlet/DeployAgentServlet?action=5'
							}),
					reader : new Ext.data.JsonReader({
								root : 'fileName'
							}, ['code', 'mean']),
					autoLoad : true
				}),
		fieldLabel : '��װ����',
		displayField : 'mean',
		valueField : 'code',
		editable : false,
		mode : 'remote',
		width : 120,
		triggerAction : 'all',
		emptyText : '��ѡ��',
		name : 'fileName'

	})
	// ��������
	this.searchPanel = new Ext.form.FormPanel({
				frame : true,
				bodyStyle : "margin-left:50",
				labelWidth : 80,
				labelPad : 6,
				labelAlign : 'right',
				layout : 'form',
				buttonAlign : 'center',
				items : [{
							xtype : 'textfield',
							name : 'agentIp',
							fieldLabel : 'agentIp'
						}, {
							xtype : 'textfield',
							name : 'agentName',
							fieldLabel : 'agent����'
						}, {
							xtype : "treefield",
							name : "region",
							fieldLabel : "����",
							emptyText : '��ѡ��...',
							treeHeight : 260,
							xmlUrl : "../../servlet/RegionTree?action=6"
						}, this.fileName, {
							xtype : 'combo',
							name : 'linkType',
							store : new Ext.data.SimpleStore({
										fields : ['code', 'name'],
										data : [['1', 'telnet'], ['2', 'ssh']]
									}),
							fieldLabel : '��������',
							emptyText : '��ѡ��...',
							displayField : 'name',
							valueField : 'code',
							typeAhead : true,
							editable : false,
							mode : 'local',
							triggerAction : 'all',
							triggerAction : 'all',
							selectOnFocus : true,
							width : 120

						}, {
							xtype : 'datefield',
							name : 'startDeployTime',
							fieldLabel : '��ʼʱ��',
							format : 'Y-m-d',
							readOnly : true,
							width : 120
						}, {
							xtype : 'datefield',
							name : 'endDeployTime',
							fieldLabel : '����ʱ��',
							format : 'Y-m-d',
							readOnly : true,
							width : 120
						}, {
							xtype : 'combo',
							name : 'STATE',
							store : new Ext.data.SimpleStore({
										fields : ['code', 'name'],
										data : [['0', 'δ����'], ['3', '����ɹ�'],
												['2', '����ʧ��']]
									}),
							fieldLabel : '����״̬',
							emptyText : '��ѡ��...',
							displayField : 'name',
							valueField : 'code',
							typeAhead : true,
							editable : false,
							mode : 'local',
							triggerAction : 'all',
							triggerAction : 'all',
							selectOnFocus : true,
							width : 120

						}]
			})
	this.queryWin = new Ext.Window({
				title : '������ѯ',
				width : 400,
				height : 300,
				layout : 'fit',
				collapsible : true,
				closeAction : 'hide',
				closable : true,
				draggable : true,
				resizable : false,
				buttonAlign : 'center',
				modal : true,
				frame : true,
				items : [this.searchPanel],
				buttons : [{
							text : '��ѯ',
							handler : function() {
								this.search();
							},
							scope : this
						}, {
							text : '���',
							handler : function() {
								this.clear();
							},
							scope : this
						}, {
							text : 'ȡ��',
							handler : function() {
								this.queryWin.hide();
							},
							scope : this
						}]

			});// �����������ڽ���
	// girdPanel
	var fields = [{
				name : 'AGENTINFOID'
			}, {
				name : 'NEID'
			}, {
				name : 'AGENTNAME'
			}, {
				name : 'REGION'
			}, {
				name : 'FILENAME'
			}, {
				name : 'LINKTYPE'
			}, {
				name : 'DEPLOYTIME'
			}, {
				name : 'STATE'
			}, {
				name : 'USERNAME'
			}, {
				name : 'IP'
			}, {
				name : 'LINKPORT'
			}, {
				name : 'FTPPORT'
			}, {
				name : 'LOCALIP'
			}, {
				name : 'NATIP'
			}, {
				name : 'PROXYGROUPID'
			}, {
				name : 'REGIONID'
			}, {
				name : 'PASSWORD'
			}, {
				name : 'LINKTYPEVALUE'
			}, {
				name : 'FILENAMECODE'
			}, {
				name : 'PROXYGROUPNAME'
			},{
				name : 'REMARK'
			},{
				name : 'PARENT_NE_ID'
			},{
				name : 'PROXY1'
			},{
				name : 'PROXY2'
			},{
				name : 'CREATE_STAFF_NAME'
			},{
				name : 'MAINFRAME_NE_ITEM_ID'
			}];

	var sm = new Ext.grid.CheckboxSelectionModel(); // ��ѡ��

	var cmd = [
			new Ext.grid.RowNumberer(), // ���
			sm, {
				header : 'agent��ԪIP',
				dataIndex : 'IP',
				sortable : true,
				width : 110,
				menuDisabled : true,
				align : 'center'
			}, {
				header : 'agent����',
				dataIndex : 'AGENTNAME',
				sortable : true,
				width : 150,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '����',
				dataIndex : 'REGION',
				sortable : true,
				width : 80,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '�û���',
				dataIndex : 'USERNAME',
				sortable : true,
				menuDisabled : true,
				width : 150,
				// renderer : showInfo,
				align : 'center'
			}, {
				header : '��װ����',
				dataIndex : 'FILENAME',
				sortable : true,
				menuDisabled : true,
				width : 150,
				align : 'center'
			}, {
				header : '��������',
				dataIndex : 'LINKTYPEVALUE',
				sortable : true,
				width : 75,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '����ʱ��',
				dataIndex : 'DEPLOYTIME',
				sortable : true,
				menuDisabled : true,
				width : 140,
				align : 'center'
			}, {
				header : '״̬',
				dataIndex : 'STATE',
				sortable : true,
				menuDisabled : true,
				width : 100,
				align : 'center',
				renderer : function(value) {
					if (value == '0') {
						return "<span style=color:blue onclick='lookLog()'>δ����</span>";
					} else if (value == '1') {
						var image = "spinner.gif";
						return "<img src='../../resource/image/ico/" + image
								+ "'><span style=color:blue>������</span>";
					} else if (value == '2') {
						return "<span style=color:red onclick='lookLog()'>����ʧ��</span>"
					} else if (value == '3') {
						return "<span onclick='lookLog()' style=color:blue>����ɹ�</span>";
					} else if (value == '4') {
						return "<span style=color:blue>׼��������..</span>";
					}
				}
			},{
				header : '������',
				dataIndex : 'CREATE_STAFF_NAME',
				sortable : true,
				menuDisabled : true,
				width : 80,
				align : 'center'
			},{
				header : '��ע',
				dataIndex : 'REMARK',
				sortable : true,
				menuDisabled : true,
				width : 180,
				align : 'center'
			}]

	var colModel = new Ext.grid.ColumnModel(cmd);
	var jsR = new Ext.data.JsonReader({
				root : 'rowSet',
				totalProperty : 'rowCount',
				fields : fields
			});
	this.store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '../../servlet/DeployAgentServlet?action=1'
						}),
				reader : jsR,
				remoteSort : true

			});

	this.store.load({
				params : {
					limit : this.pageSize,
					start : 0
				}
			});
	var countCom = new Ext.form.ComboBox({
				store : new Ext.data.SimpleStore({
							fields : ['code', 'name'],
							data : [[10, '10��'], [20, '20��'], [30, '30��'],
									[40, '40��'], [50, '50��'], [60, '60��'],
									[70, '70��'], [80, '80��'], [90, '90��'],
									[100, '100��']]
						}),
				fieldLabel : '״̬',
				name : 'count',
				displayField : 'name',
				valueField : 'code',
				typeAhead : true,
				editable : false,
				mode : 'local',
				triggerAction : 'all',
				value : 20,
				triggerAction : 'all',
				selectOnFocus : true,
				width : 100,
				listeners : {
					'select' : {

						fn : function() {
							this.pageSize = countCom.getValue();
							this.search();
						},
						scope : this
					}
				}

			})
	this.tbarObj = new Ext.Toolbar([{
				text : '��ѯ',
				iconCls : 'searchl',
				handler : function() {
					this.queryWin.show();
				},
				id : 'test',
				scope : this
			}, {
				text : '���',
				iconCls : 'addAgentInfo',
				handler : this.addAgentInfo,
				scope : this
			}, {
				text : '�޸�',
				iconCls : 'icon-edit',
				handler : this.updateAgentInfo,
				scope : this
			}, {
				text : 'ɾ��',
				iconCls : 'icon-del',
				handler : this.deleteAgentInfo,
				scope : this
			}, '-', {
				text : '����',
				iconCls : 'deploy',
				handler : this.deploy,
				scope : this
			}, {
				text : 'ֹͣ����',
				iconCls : 'stopDeploy',
				handler : this.stopDeploy,
				disabled : true,
				name : 'stopDeploy',
				scope : this
			},{
				text : '��������',
				iconCls : 'config',
				handler : this.attrConfig,
				name : 'attrConfig',
				scope : this
			},{
				text : 'Ԥ��',
				iconCls : 'preview',
				handler : this.preview,
				name : 'preview',
				scope : this
			}, {
				text : '�鿴��־',
				iconCls : 'icon-search',
				handler : lookLog,
				scope : this
			}, '-', {
				text : '����excel',
				iconCls : 'exportExcel',
				handler : this.importExcel,
				scope : this
			}, {
				text : '����excel',
				iconCls : 'importExcel',
				handler : this.exportExcel,
				scope : this
			}, {
				text : '����ģ��',
				iconCls : 'upLoad',
				handler : this.upLoadModel,
				scope : this
			}, '-', {
				xtype : 'label',
				text : '��ʾ����:',
				iconCls : 'icon-search'
			}, {
				xytpe : 'fill'
			}, countCom])
	this.bbarObj = new Ext.PagingToolbar({
				displayInfo : true,
				emptyMsg : "������",
				store : this.store
			})
	this.rightClick = new Ext.menu.Menu({
				items : [{

							text : '�鿴��ϸ��Ϣ',
							iconCls : 'searchl',
							handler : this.updateAgentInfo,
							scope : this
						}, {
							text : '�޸�',
							iconCls : 'icon-edit',
							handler : this.updateAgentInfo,
							scope : this
						}, {
							text : 'ɾ��',
							iconCls : 'icon-del',
							handler : this.deleteAgentInfo,
							scope : this
						}, {
							text : '����',
							iconCls : 'deploy',
							handler : this.deploy,
							scope : this
						}, {
							text : '�鿴��־',
							iconCls : 'icon-search',
							handler : lookLog,
							scope : this
						}]
			});// gridPanel����
	agentdeploy.list.agentListPanel.superclass.constructor.call(this, {
				title : 'agent��Ϣ�б�',
				border : true,
				store : this.store,
				layout : 'fit',
				stripeRows : true,
				renderTo : Ext.getBody(),// ��Ⱦ
				cm : colModel,
				loadMask : true,
				width : e.clientWidth,
				height : e.clientHeight,
				tbar : this.tbarObj,
				sm : sm,
				viewConfig : {
					forceFit : false,
					rowSelectorDepth : 50

				},
				listeners : {
					cellcontextmenu : {
						fn : this.rightMemu,
						scope : this
					},
					rowdblclick : {
						fn : this.onRowDblClickFn,
						scope : this
					}
				},
				bbar : this.bbarObj
			});

};

Ext.extend(agentdeploy.list.agentListPanel, Ext.grid.GridPanel, {
	fireResize : function() {
		var e = document.body;
		this.setSize(e.clientWidth, e.clientHeight);
		this.doLayout();
	},
	// ��ѯ����
	search : function() {

		var STATE = this.searchPanel.getForm().findField("STATE").getValue();
		var agentName = encodeURIComponent(this.searchPanel.getForm()
				.findField("agentName").getValue());
		var agentIp = encodeURIComponent(this.searchPanel.getForm()
				.findField("agentIp").getValue());
		var fileName = this.searchPanel.getForm().findField("fileName")
				.getValue();
		var region = this.searchPanel.getForm().findField("region").getValue();
		var linkType = this.searchPanel.getForm().findField("linkType")
				.getValue();
		var startDeployTime = this.searchPanel.getForm()
				.findField("startDeployTime").getValue();
		var endDeployTime = this.searchPanel.getForm()
				.findField("endDeployTime").getValue();
		this.store.baseParams = {
			state : STATE,
			agentName : agentName,
			agentIp : agentIp,
			fileName : fileName,
			region : region,
			linkType : linkType,
			startDeployTime : startDeployTime,
			endDeployTime : endDeployTime,
			limit : this.pageSize
		}
		this.bbarObj.pageSize = this.pageSize;
		this.bbar = this.bbarObj;
		this.store.load({
					params : {
						start : 0
						// ,
						// limit : this.pageSize
					}
				});

		this.queryWin.hide();
	},
	// ��ѯ��������¼�
	clear : function() {
		this.searchPanel.getForm().reset();
	},
	// �鿴��־
	lookLog : function() {
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			Ext.MessageBox.show({
						title : '��ʾ',
						msg : "����δѡ���¼��",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;
		}
		if (records.length > 1) {
			Ext.MessageBox.show({
						title : '��ʾ',
						msg : "��ֻ��ѡ��һ����¼!",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;
		}

		var w = window.screen.width;
		var h = window.screen.height - 20;
		window
				.showModelessDialog(
						"agentdeploylog.html",
						{},
						"dialogWidth="
								+ w
								+ ";dialogHeight="
								+ h
								+ ";help=0;scroll=yes;status=0;resizable=yes;center=yes");
	},
	// ��ʾ�һ��˵�
	rightMemu : function(gird, row, cell, e) {
		var sm = this.getSelectionModel();
		sm.selectRow(row);
		e.preventDefault();
		this.rightClick.showAt(e.getXY());

	},
	// ɾ������
	deleteAgentInfo : function() {
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			Ext.MessageBox.show({
						title : '��ʾ',
						msg : "����δѡ���¼��",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;
		}
		Ext.MessageBox.show({
			title : '��ʾ',
			msg : '���Ҫɾ����?',
			buttons : Ext.MessageBox.YESNO,
			icon : Ext.MessageBox.QUESTION,
			fn : function(value) {
				if (value == 'yes') {
					// ��ԪId
					var deleteNetIds = '';
					var deleteAgentIps = '';
					var deleteAgentName = '';
					var deleteAgentInfoIds = '';
					for (var i = 0; i < records.length; i++) {
						if (deleteNetIds == '') {
							deleteNetIds += records[i].get("NEID");
						} else {
							deleteNetIds += "," + records[i].get("NEID");
						}
						if (deleteAgentIps == '') {
							deleteAgentIps += records[i].get("IP");
						} else {
							deleteAgentIps += "," + records[i].get("IP");
						}
						if (deleteAgentName == '') {
							deleteAgentName += records[i].get("AGENTNAME");
						} else {
							deleteAgentName += ","
									+ records[i].get("AGENTNAME");
						}
						if (deleteAgentInfoIds == '') {
							deleteAgentInfoIds += records[i].get("AGENTINFOID");
						} else {
							deleteAgentInfoIds += ","
									+ records[i].get("AGENTINFOID");
						}
					}
					Ext.Ajax.request({
						url : '../../servlet/DeployAgentServlet?action=12',
						params : {
							action : 12,
							deleteNetIds : deleteNetIds,
							deleteAgentIps : encodeURIComponent(deleteAgentIps),
							deleteAgentName : encodeURIComponent(deleteAgentName),
							deleteAgentInfoIds : deleteAgentInfoIds
						},
						success : function(response) {
							var rs = Ext.util.JSON
									.decode(response.responseText);
							Ext.MessageBox.show({
										title : '��ʾ',
										msg : rs.msg,
										width : 180,
										buttons : Ext.MessageBox.OK,
										icon : rs.flag
									});
							// ˢ������
							this.store.reload();
						},
						scope : this
					})
				}

			},
			scope : this
		});

	},
	updateAgentInfo : function() {
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			Ext.MessageBox.show({
						title : '��ʾ',
						msg : "����δѡ���¼��",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;
		}
		if (records.length > 1) {
			Ext.MessageBox.show({
						title : '��ʾ',
						msg : "��ֻ��ѡ��һ����¼!",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;
		}
		// �޸ĵ���Ϣ
		Global.inputMode = 'modify';
		Global.agentInfoId = records[0].get('AGENTINFOID');
		Global.treeFieldValue.region = records[0].get('REGIONID');
		Global.treeFieldValue.dir = records[0].get('MAINFRAME_NE_ITEM_ID');
		Global.treeFieldValue.proxy1 = records[0].get('PROXY1');
		Global.treeFieldValue.proxy2 = records[0].get('PROXY2');
		
		Global.agentInfoWin.show();
		var bForm = Global.agentForm.getForm();
		bForm.findField('agentId').setValue(records[0].get('AGENTINFOID'));		
		bForm.findField('netId').setValue(records[0].get('NEID'));
		 bForm.findField('agentName').setValue(records[0].get('AGENTNAME'));
		 bForm.findField('agentIp').setValue(records[0].get('IP'));
		 bForm.findField('password').setValue(records[0].get('PASSWORD'));
		 bForm.findField('userName').setValue(records[0].get('USERNAME'));
		 bForm.findField('fileName').setValue(records[0].get('FILENAMECODE'));
		 bForm.findField('region').setValue(records[0].get('REGIONID'));
		 bForm.findField('linkType').setValue(records[0].get('LINKTYPE'));
		 bForm.findField('linkPort').setValue(records[0].get('LINKPORT'));
		 bForm.findField('ftpPort').setValue(records[0].get('FTPPORT'));
		 bForm.findField('proxyGroup').setValue(records[0].get('PROXYGROUPID'));
		  bForm.findField('remark').setValue(records[0].get('REMARK'));
		  bForm.findField('dir').setValue(records[0].get('MAINFRAME_NE_ITEM_ID'));
		  bForm.findField('proxy1').setValue(records[0].get('PROXY1'));
		  bForm.findField('proxy2').setValue(records[0].get('PROXY2'));
//		var record = {
//			
//	
//			'DEPLOYTIME' : records[0].get('DEPLOYTIME'),
//			'STATE' : records[0].get('STATE'),
//			
//			'LOCALIP' : records[0].get('LOCALIP'),
//			'NATIP' : records[0].get('NATIP'),
//			
//			'FILENAME' : records[0].get('FILENAME'),
//			'PROXYGROUPNAME' : records[0].get('PROXYGROUPNAME'),
//
//		};
//		var config = {
//			title : '�޸�agent��Ϣ',
//			store : this.store,
//			buttonText : 'Ӧ��',
//			type : '2',
//			'record' : record
			// ���м�¼
			// sid:
	//	}
		//var updatePanel = new agentdeploy.update.updateWin(config);
		//updatePanel.show();
	
	},
	addAgentInfo : function() {
		var config = {
			title : '���agent��Ϣ',
			store : this.store,
			buttonText : '��һ��',
			'record' : {},
			type : '1'// 1�������

		}
		//var addPanel = new agentdeploy.update.updateWin(config);
		//addPanel.show();
		Global.inputMode = 'new';
		Global.agentInfoId = '';
		Global.agentInfoWin.show();
	},
	// ����
	exportExcel : function() {
		var exportform = document.getElementById("exportExcelForm");
		exportform.param.value = this.getParamXml();
		exportform.submit();

	},
	checkImportExcel : function(filePath) {
		var flag = false;
		if (filePath == null || filePath == '') {
			Ext.MessageBox.show({
						title : '��ʾ',
						msg : '�ļ�������Ϊ��!',
						width : 200,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
		} else {
			var fileType = filePath.substring(filePath.lastIndexOf(".") + 1)
			if (fileType.toLowerCase() != 'xls') {

				Ext.MessageBox.show({
							title : '��ʾ',
							msg : '�ļ�ҪΪxls��ʽ!',
							width : 200,
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});

			} else {
				flag = true;
			}
		}
		return flag;

	},
	// ����
	importExcel : function() {

		var imPortFile = new Ext.form.TextField({
					fieldLabel : '����Excel�ļ�',
					inputType : 'file',
					height : 20,
					name : 'uploadFile',
					width : 250
				})
		
		var label= new Ext.form.Label({
			width : 250,
			html : '<span style="font-size:9pt;color:red">��ʾ:����ı���������,���������µ�ģ�嵼��</span>',
			autoWidth : false
		})
		var imPortPanel = new Ext.FormPanel({
					fileUpload : true,
					items : [imPortFile,label]

				})
		var imPortwin = new Ext.Window({
			title : '��ѡ���ļ�',
			width : 400,
			//height : 120,
			 autoHeight : true,
			minimizable : false,
			maximizable : false,
			resizable : false,
			closable : true,
			modal : true,
			draggable : true,
			autoScroll : true,
			border : false,
			items : imPortPanel,
			buttonAlign : 'center',
			buttons : [{
				text : 'ȷ��',
				handler : function() {
					var filePath = imPortFile.getValue();
					var flag = this.checkImportExcel(filePath);
					var store = this.store;
					if (flag)// �ύ
					{

						imPortwin
								.setTitle("<span style=color:blue>��ʾ:"
										+ "<img src='../../resource/image/ico/spinner.gif'/>"
										+ "���ڵ�����,���Ժ�...</span>");
						var url = "../../servlet/DeployAgentServlet?action=15";
						imPortPanel.url = url;
						imPortPanel.getForm().submit({
									url : url,
									success : function(f, a) {

										Ext.MessageBox.show({
													title : '��ʾ',
													msg : a.result.msg,
													width : 200,
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.INFO
												});
										imPortwin.close();
										store.reload();

									},
									failure : function(f, a) {
										Ext.MessageBox.show({
													title : '��ʾ',
													msg : a.result.msg,
													width : 200,
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.ERROR
												});
										imPortwin.setTitle('��ѡ���ļ�');
									}
								})
					}
				},
				scope : this
			}, {
				text : 'ȡ��',
				handler : function() {
					imPortwin.close();
				}

			}]

		})
		imPortwin.show();

	},
	onRowDblClickFn : function(grid, row, e) {
		var sm = this.getSelectionModel();
		sm.selectRow(row);
		this.updateAgentInfo();
	},
	getParamXml : function() {
		var STATE = this.searchPanel.getForm().findField("STATE").getValue();
		var agentName = this.searchPanel.getForm().findField("agentName")
				.getValue();
		var agentIp = this.searchPanel.getForm().findField("agentIp")
				.getValue();
		var fileName = this.searchPanel.getForm().findField("fileName")
				.getValue();
		var region = this.searchPanel.getForm().findField("region").getValue();
		var linkType = this.searchPanel.getForm().findField("linkType")
				.getValue();
		var startDeployTime = this.searchPanel.getForm()
				.findField("startDeployTime").getValue();
		var endDeployTime = this.searchPanel.getForm()
				.findField("endDeployTime").getValue();
		if (STATE == undefined) {
			STATE = '';
		}
		
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXml.createElement("root");
		sendXml.appendChild(root);
		this.addRoot(root, "STATE", STATE, sendXml);
		this.addRoot(root, "agentName", agentName, sendXml);
		this.addRoot(root, "agentIp", agentIp, sendXml);
		this.addRoot(root, "fileName", fileName, sendXml);
		this.addRoot(root, "region", region, sendXml);
		this.addRoot(root, "linkType", linkType, sendXml);
		this.addRoot(root, "startDeployTime", startDeployTime, sendXml);
		this.addRoot(root, "endDeployTime", endDeployTime, sendXml);
		return sendXml.xml;

	},
	addRoot : function(root, el, value, sendXml) {
		var elObj = sendXml.createElement(el);
		elObj.text = value;
		root.appendChild(elObj);
	},// ����ģ��
	upLoadModel : function() {
		//window.location.href = "/workshop/agentdeploy/agentfile/model/������ģ��.xls";
		var exportform = document.getElementById("downloadTemplate");
		exportform.submit();
	},
	// ��������
	sendDeployData : function() {
		this.deployedAgents = [];// ÿ�η������ݺ���ն���
		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXml.createElement("root");
		sendXml.appendChild(root);
		for (var j = this.deployStart; j < this.deployEnd; j++) {
			var deploy = sendXml.createElement("deploy");
			deploy.setAttribute('ip', this.deployingAgents[j].get("IP"));
			deploy.setAttribute('neId', this.deployingAgents[j].get("NEID"));
			deploy.setAttribute('agentInfoId', this.deployingAgents[j]
							.get("AGENTINFOID"));
			this.deployedAgents.push(this.deployingAgents[j]);
			root.appendChild(deploy);
		}
		sendRequest.open("POST", '../../servlet/DeployAgentServlet?action='
						+ 16, true);
		sendRequest.send(sendXml);
	},
	deploy : function() {
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			Ext.MessageBox.show({
						title : '��ʾ',
						msg : "����δѡ���¼��",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;
		}
		if(!this.checkIsDeploy(records)){
		
			Ext.MessageBox.show({
						title : '��ʾ',
						msg : "����ѡ�ļ�¼�������ڲ���ļ�¼��",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
				return;
			
		}
		// ���ù��������ɱ༭
		var tbItems = this.tbarObj.items;// ��һ����
		for (var i = 0; i < tbItems.length; i++) {
			var obj = tbItems.get(i);
			if ('stopDeploy' != obj.name) {
				obj.disable();
			} else {
				obj.enable();
			}
		}
		this.getBottomToolbar().setDisabled(true);
		this.removeListener('cellcontextmenu', this.rightMemu);
		this.removeListener('rowdblclick', this.onRowDblClickFn);
		// �ı�������ѡ��¼����״̬
		for (var i = 0; i < records.length; i++) {
			records[i].set("STATE", '4');
		}
		this.deployingAgents = records;// //��ʼ������
		if (records.length > 20) {
			this.deployEnd = 20;
		} else {
			this.deployEnd = records.length;
		}
		this.sendDeployData();
		var task = new Ext.util.DelayedTask(function() {
					Ext.TaskMgr.start(this.task);// ������ʱ��
				}, this);
		task.delay(1000);
		// ȫ�������
	},
	stopDeploy : function() {
		var tbItems = this.tbarObj.items;// ��һ����
		for (var i = 0; i < tbItems.length; i++) {
			var obj = tbItems.get(i);
			if ('stopDeploy' != obj.name) {
				obj.enable();
			} else {
				obj.disable();
			}
		}

		Ext.TaskMgr.stop(this.task);
		// ���ݵ����
		this.deployEnd = 0;
		this.deployStart = 0;
		this.deployedAgents = [];
		this.deployingAgents = [];
		this.getBottomToolbar().setDisabled(false);
		this.addListener('cellcontextmenu', this.rightMemu, this);
		this.addListener('rowdblclick', this.onRowDblClickFn, this);
		this.store.reload();
	},
	attrConfig : function(){
		var winConfig = "dialogWidth=670px;dialogHeight=500px;help=0;scroll=0;status=0;";
		window.showModalDialog("attrGroup.html", null, winConfig);
	},
	preview : function(){
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			Ext.MessageBox.show({
						title : '��ʾ',
						msg : "����δѡ���¼��",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;
		}
		var config = [];
		
		for(var i = 0;i<records.length;i++)
		{
			config.push({
				name : records[i].get("AGENTNAME"),
				agentId : records[i].get("AGENTINFOID")
			})
		}
		previewAttr(config);
		
	},
	// ��ʱˢ��agentsΪ�ѷ��͵�����
	deployRresh : function(agents) {
		if (agents.length > 0) {
			var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
			var sendXml = new ActiveXObject("Microsoft.XMLDOM");
			var root = sendXml.createElement("root");
			sendXml.appendChild(root);
			for (var i = 0; i < agents.length; i++) {
				var record = agents[i];
				var deploy = sendXml.createElement("deploy");
				// deploy.setAttribute('ip', record.get("IP"));
				deploy.setAttribute('neId', record.get("NEID"));
				root.appendChild(deploy);
			}
			sendRequest.open("POST", '../../servlet/DeployAgentServlet?action='
							+ 18, true);
			sendRequest.send(sendXml);
			sendRequest.onreadystatechange = function() {
				if (sendRequest.readyState == 4 && sendRequest.status == 200) {
					var list = Ext.util.JSON.decode(sendRequest.responseText);
					var isEnd = agentListPanel.checkIsEnd(list);
					//��ʱˢ��
					for (var i = 0; i < list.length; i++) {
								var obj = list[i];
								for (var j = 0; j < agents.length; j++) {
									var record = agents[j];
									if (obj.NE_ID == record.get("NEID")
											&& obj.DEPLOY_TIME != '') {
										record.set("STATE", obj.DEPLOY_STATE);
										break;
									}
								}
							}
					//���ֽ���
					if (isEnd) {
						if(agentListPanel.deployEnd == agentListPanel.deployingAgents.length) {// �Ѳ������
							Ext.MessageBox.show({
										title : '��ʾ',
										msg : "���������",
										width : 180,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.OK
									});
							agentListPanel.stopDeploy();

						}else {//δ�����,���Ҹ��ֽ�����������һ��20��
							agentListPanel.deployStart = agentListPanel.deployEnd;
							if (agentListPanel.deployingAgents.length
									- agentListPanel.deployedAgents.length > 20) {
								agentListPanel.deployEnd = agentListPanel.deployStart
										+ 20;
							} else {
								agentListPanel.deployEnd = agentListPanel.deployingAgents.length;
							}
							
							agentListPanel.sendDeployData();//������������

						}

					}

				}
			}

		}

	},
	// ��֤list�е�״̬�Ƿ����
	checkIsEnd : function(checkList) {
		var flag = true;
		for (var i = 0; i < checkList.length; i++) {
			var record = checkList[i];
			if (record.DEPLOY_STATE && record.DEPLOY_STATE != ''
					&& record.DEPLOY_STATE != '1') {
				continue;
			} else {
				flag = false;
				break;
			}

		}
		return flag;

	},
	//��֤�Ƿ��������ڲ�����
	checkIsDeploy:function(records){
		var flag = true;
		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXml.createElement("root");
		sendXml.appendChild(root);
		for (var i=0;i<records.length;i++) {
			var deploy = sendXml.createElement("deploy");
			deploy.setAttribute('agentInfoId', records[i].get("AGENTINFOID"));
			root.appendChild(deploy);
		}
		sendRequest.open("POST", '../../servlet/DeployAgentServlet?action='
						+ 22, false);
		sendRequest.send(sendXml);
		if(sendRequest.readyState == 4 && sendRequest.status == 200) {
			if(sendRequest.responseText=='0')
			{
					flag = false;
			}

		};	 
		return flag;
	}
});

var agentListPanel;
function initLoad() {
	agentListPanel = new agentdeploy.list.agentListPanel({});
	agentInfoWinInit();
}
/**
 * �鿴��־
 */
function lookLog() {
	var sm = agentListPanel.getSelectionModel();
	var records = sm.getSelections();
	if (records.length < 1) {
		Ext.MessageBox.show({
					title : '��ʾ',
					msg : "����δѡ���¼��",
					width : 180,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});
		return;
	}
	if (records.length > 1) {
		Ext.MessageBox.show({
					title : '��ʾ',
					msg : "��ֻ��ѡ��һ����¼!",
					width : 180,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});
		return;
	}
	var params = {
		fileName : records[0].get("IP") + records[0].get("NEID")
	}
	var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
	sendRequest.open("GET",
			'../../servlet/DeployAgentServlet?action=19&fileName='
					+ params.fileName + ".log", false);
	sendRequest.send(null);
	if (sendRequest.readyState == 4 && sendRequest.status == 200) {
		if (sendRequest.responseText == 'true') {
			var w = window.screen.width;
			var h = window.screen.height - 20;
			window
					.showModelessDialog(
							"agentdeploylog.html",
							params,
							"dialogWidth="
									+ w
									+ ";dialogHeight="
									+ h
									+ ";help=0;scroll=yes;status=0;resizable=yes;center=yes");
		} else {
			Ext.MessageBox.show({
						title : '��ʾ',
						msg : "�ü�¼����־��Ϣ!",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
		}
	}

}