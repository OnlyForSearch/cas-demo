/** ************************·�����ý���************************ */
Ext.namespace("agentdeploy.router");
Ext.BLANK_IMAGE_URL = '../../resource/js/ext/resources/images/default/s.gif';
agentdeploy.router.routerPanel = function(config) {
	Ext.QuickTips.init();
	this.isdelete = false;
	var fields = [{
				name : 'PROXY_GROUP_ID'
			}, {
				name : 'PROXY_GROUP_NAME'
			}, {
				name : 'PROXY1_IP'
			}, {
				name : 'PROXY2_IP'
			}, {
				name : 'PROXY3_IP'
			}, {
				name : 'PROXY1_USER_NAME'
			}, {
				name : 'PROXY2_USER_NAME'
			}, {
				name : 'PROXY3_USER_NAME'
			}, {
				name : 'PROXY1_PASSWORD'
			}, {
				name : 'PROXY2_PASSWORD'
			}, {
				name : 'PROXY3_PASSWORD'
			}, {
				name : 'PROXY1_LINK_TYPE'
			}, {
				name : 'PROXY2_LINK_TYPE'
			}, {
				name : 'PROXY3_LINK_TYPE'
			}, {
				name : 'PROXY1_LINK_PORT'
			}, {
				name : 'PROXY2_LINK_PORT'
			}, {
				name : 'PROXY3_LINK_PORT'
			}, {
				name : 'PROXY1_FTP_PORT'
			}, {
				name : 'PROXY2_FTP_PORT'
			}, {
				name : 'PROXY3_FTP_PORT'
			}];
	var sm = new Ext.grid.CheckboxSelectionModel(); // ��ѡ��
	var cmd = [
			new Ext.grid.RowNumberer(), // ���
			sm, {
				header : '����',
				dataIndex : 'PROXY_GROUP_NAME',
				sortable : true,
				menuDisabled : true,
				align : 'center'
			}, {
				header : 'proxy1Ip',
				dataIndex : 'PROXY1_IP',
				sortable : true,
				menuDisabled : true,
				width : 150,
				align : 'center'
			}, {
				header : 'proxy2Ip',
				dataIndex : 'PROXY2_IP',
				sortable : true,
				menuDisabled : true,
				width : 150,
				align : 'center'
			}, {
				header : 'proxy3Ip',
				dataIndex : 'PROXY3_IP',
				sortable : true,
				menuDisabled : true,
				width : 150,
				align : 'center'
			}]

	var colModel = new Ext.grid.ColumnModel(cmd);
	var jsR = new Ext.data.JsonReader({
				root : 'rowSet',
				totalProperty : 'rowCount',
				fields : fields
			});
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '../../servlet/DeployAgentServlet?action=8'
						}),
				reader : jsR,
				remoteSort : true

			});
	store.load({
				params : {
					limit : 10,
					start : 0
				}
			});
	this.proxyGroupPanelTbar = new Ext.Toolbar({
				items : [{
							xtype : 'label',
							html : '<span style=color:red>����</span>'
						}, {
							xytpe : 'fill'
						}, {
							text : '���',
							handler : this.addAgentProxyGroup,
							iconCls : 'addAgentInfo',
							scope : this
						}, {
							text : '�޸�',
							handler : this.updateAgentProxyGroup,
							iconCls : 'icon-edit',
							scope : this
						}, {
							text : 'ɾ��',
							handler : this.delAgentProxyGroup,
							iconCls : 'icon-del',
							scope : this
						}]
			})
	this.proxyGroupPanel = new Ext.grid.GridPanel({
				store : store,
				layout : 'fit',
				stripeRows : true,
				cm : colModel,
				loadMask : true,
				height : 200,
				autoScroll : true,
				sm : sm,
				viewConfig : {
					forceFit : false,
					rowSelectorDepth : 50

				},
				tbar : this.proxyGroupPanelTbar,
				bbar : new Ext.PagingToolbar({
							pageSize : 10,
							displayInfo : true,
							emptyMsg : "������",
							store : store
						}),
				listeners:{
					rowdblclick : {
						fn : this.onRowDblClickFn,
						scope : this
					}
				}		
			

			})
	this.proxyGroupSet = new Ext.form.FieldSet({
				title : '·���б�',
				animCollapse : true,
				collapsible : true,
				items : [this.proxyGroupPanel]
			})
	this.treePanel = new Ext.tree.TreePanel({
				border : false,
				frame : false,
				bodyBorder : false,
				root : new Ext.tree.AsyncTreeNode({
							id : '0',
							text : '·��:',
							expanded : true,
							children : [{
										id : '1',
										text : 'proxy1',
										iconCls : 'proxy',
										expandable : false,
										expanded : true,
										children : [{
													id : '2',
													text : 'proxy2',
													iconCls : 'proxy',
													expandable : false,
													expanded : true,
													children : [{
																id : '3',
																text : 'proxy3',
																leaf : true,
																iconCls : 'proxy'

															}]
												}]

									}]
						}),
				listeners : {
					click : {
						fn : this.checkTreeFn,
						scope : this
					}
				}
			});
	this.westPanel = new Ext.Panel({
				width : 240,
				region : 'west',
				layout : 'form',
				labelWidth : 60,
				labelPad : 3,
				labelAlign : 'right',
				items : [{
					xtype : 'textfield',
					name : 'proxyGroupName',
					fieldLabel : '<span style=color:blue>·������</span>',
					listeners : {
						change : {
							fn : function(obj, newValue) {
								this.treePanel.getRootNode().setText('·��:'
										+ newValue);
							},
							scope : this
						}
					}
				}, {
					xtype : 'panel',
					height : 20,
					bodyBorder : false,
					title : '  '
				}, this.treePanel]
			})

	this.linkType = new Ext.form.ComboBox({
		store : new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : '../../servlet/DeployAgentServlet?action=7'
							}),
					reader : new Ext.data.JsonReader({
								root : 'linkType'
							}, ['code', 'mean']),
					autoLoad : true
				}),
		fieldLabel : '��������',
		displayField : 'mean',
		valueField : 'code',
		editable : false,
		mode : 'remote',
		width : 120,
		triggerAction : 'all',
		emptyText : '��ѡ��',
		name : 'linkType',
		listeners:{
			'select':{
				fn:function(box,record,index){
				
					var newValue = box.getValue();
					if(newValue==1)
					{
						this.getForm().findField('linkPort').setValue(23);
						this.getForm().findField('ftpPort').setValue(21);
					}else if(newValue==2)
					{
						this.getForm().findField('linkPort').setValue(22);
						this.getForm().findField('ftpPort').setValue(21);
					}

				},
				scope:this
				
			}
		}
	})
	this.proxyInfoPanel = new Ext.Panel({
		title : 'proxy1��ϸ��Ϣ',
		layout : 'form',
		bodyBorder : false,
		region : 'center',
		border : false,
		frame : false,
		buttonAlign : 'center',
		width : 500,
		labelWidth : 90,
		labelPad : 3,
		labelAlign : 'right',
		items : [{
			xtype : 'panel',
			layout : 'column',
			buttonAlign : 'center',
			border : false,
			bodyBorder : false,
			frame : false,
			items : [{
						xtype : 'panel',
						layout : 'form',
						columnWidth : 0.6,
						border : false,
						bodyBorder : false,
						frame : false,
						buttonAlign : 'center',
						items : [{
									xtype : 'textfield',
									fieldLabel : 'Ip',
									name : 'Ip',
									maxLength :15
								}, {
									xtype : 'textfield',
									fieldLabel : '�û���',
									name : 'userName',
									maxLength :20
								}, {
									xtype : 'textfield',
									fieldLabel : '����',
									inputType : 'password',
									name : 'password',
									maxLength :20
								}, this.linkType, {
									xtype : 'numberfield',
									fieldLabel : '���Ӷ˿�',
									name : 'linkPort',
									maxLength :5
								}, {
									xtype : 'numberfield',
									fieldLabel : 'ftp�˿�',
									name : 'ftpPort',
									maxLength :5
								}]
					}, {
						xtype : 'panel',
						layout : 'form',
						border : false,
						bodyBorder : false,
						frame : false,
						columnWidth : 0.4,
						items : [{
							xtype : 'label',
							html : "<span style='color:red;height:25px;line-height:30px;overflow:hidden;'>*</span>",
							width : 100

						},{
							xtype : 'label',
							html : "<span style='color:red;height:25px;line-height:30px;overflow:hidden;'>*</span>",
							width : 100

						},{
							xtype : 'label',
							html : "<span style='color:red;height:25px;line-height:30px;overflow:hidden;'>*</span>",
							width : 100

						},{
							xtype : 'label',
							html : "<span style='color:red;height:25px;line-height:30px;overflow:hidden;'>*</span>",
							width : 100

						},{
							xtype : 'label',
							html : "<span style='color:red;height:25px;line-height:30px;overflow:hidden;'>*</span>",
							width : 100

						},{
							xtype : 'label',
							html : "<span style='color:red;height:25px;line-height:30px;overflow:hidden;'>*</span>",
							width : 100

						}]
					}],
			buttons : [{
						text : '����',
						handler : this.addAgentProxy,
						scope : this
					}, {
						text : '���',
						handler : this.clearAgentProxy,
						scope : this
					}]
		}]
	})
	this.agentParamsMaiPanelTbar = new Ext.Toolbar({
				items : [{
							xtype : 'label',
							html : '<span style=color:red>����</span>'
						}, {
							xytpe : 'fill'
						}, {
							text : '����·��',
							handler : this.commit,
							iconCls : 'save',
							scope : this
						}, {
							xytpe : 'fill'
						}, {
							xytpe : 'fill'
						}, {
							text : 'ȡ��',
							handler : this.cancel,
							iconCls : 'cancel',
							scope : this
						}]
			})
	this.agentParamsMaiPanel = new Ext.Panel({
				layout : 'border',
				width : 700,// ��������
				height : 300,

				tbar : this.agentParamsMaiPanelTbar,
				items : [this.westPanel, this.proxyInfoPanel]
			})
	var recordClass = Ext.data.Record.create([]);// �����Զ��幹����
	this.agentParamsMaiPanel.proxyGroup = new recordClass([]);// ҳ�汣�����3��proxy
	this.agentParamsMaiPanel.nodeId = 1;// ҳ��༭�����ʶ
	this.proxyGroupInfoSet = new Ext.form.FieldSet({
				title : '��ϸ��Ϣ����',
				animCollapse : true,
				layout : 'form',
				collapsed : true,
				width : 700,// ��������
				height : 320,
				collapsible : true,
				items : [this.agentParamsMaiPanel],
				listeners:{
					beforeexpand:{
						fn:function(){
								var sm = this.proxyGroupPanel.getSelectionModel();
								var records = sm.getSelections();
								if (records.length ==1) {
									this.updateAgentProxyGroup(true);
								}
						},
						scope:this
					}
					
				}

			})
	agentdeploy.router.routerPanel.superclass.constructor.call(this, {
				border : false,
				autoHeight : true,
				width : 600,
				bodyStyle : 'background:#dfe8f6',
				buttonAlign : 'center',
				items : [this.proxyGroupSet, this.proxyGroupInfoSet]

			});
}
Ext.extend(agentdeploy.router.routerPanel, Ext.form.FormPanel, {
	onRowDblClickFn:function(grid, row, e){
		var sm = this.proxyGroupPanel.getSelectionModel();
		sm.selectRow(row);
		this.updateAgentProxyGroup();
	},
	updateAgentProxyGroup : function(flag) {
		var sm = this.proxyGroupPanel.getSelectionModel();
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
		var record = records[0];

		this.agentParamsMaiPanel.proxyGroup.data = {};// ��ն���
		Ext.apply(this.agentParamsMaiPanel.proxyGroup, record);// ���ƶ���
		this.proxyGroupSet.collapse();
		if(!flag||(flag&&flag!=true))
		{
			this.proxyGroupInfoSet.expand();
		}
		this.getForm().findField('proxyGroupName')
				.setValue(this.agentParamsMaiPanel.proxyGroup
						.get('PROXY_GROUP_NAME'));
		this.treePanel.getRootNode().setText('·��:'
				+ this.agentParamsMaiPanel.proxyGroup.get('PROXY_GROUP_NAME'));
		this.initProxyGroupInfo(this.agentParamsMaiPanel.proxyGroup, 1);
	},
	addAgentProxyGroup : function() {
		this.agentParamsMaiPanel.proxyGroup.data = {};// ��ն���
		this.agentParamsMaiPanel.nodeId = 1;
		this.getForm().findField('proxyGroupName').setValue();
		this.treePanel.getRootNode().setText('·��:');
		this.clearAgentProxyForPage();
		this.proxyGroupSet.collapse();
		this.proxyGroupInfoSet.expand();

	},
	delAgentProxyGroup : function() {
		var sm = this.proxyGroupPanel.getSelectionModel();
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
					var deleteProxyGroupIds = '';
					this.isdelete = true;
					for (var i = 0; i < records.length; i++) {
						if (deleteProxyGroupIds == '') {
							deleteProxyGroupIds += records[i]
									.get("PROXY_GROUP_ID");
						} else {
							deleteProxyGroupIds += ','
									+ records[i].get("PROXY_GROUP_ID");
						}
					}
					Ext.Ajax.request({
						url : '../../servlet/DeployAgentServlet?action=11&deleteProxyGroupIds='
								+ deleteProxyGroupIds,
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
							this.proxyGroupPanel.store.reload();
						},
						scope : this

					})
				}
			},
			scope : this
		});

	},
	initProxyGroupInfo : function(proxyGroup, index) {
		this.agentParamsMaiPanel.nodeId = index;// ��ס�༭����
		this.getForm().findField('Ip').setValue(proxyGroup.get('PROXY' + index
				+ '_IP'));
		this.getForm().findField('userName').setValue(proxyGroup.get('PROXY'
				+ index + '_USER_NAME'));
		this.getForm().findField('password').setValue(proxyGroup.get('PROXY'
				+ index + '_PASSWORD'));
		this.getForm().findField('linkType').setValue(proxyGroup.get('PROXY'
				+ index + '_LINK_TYPE'));
		this.getForm().findField('linkPort').setValue(proxyGroup.get('PROXY'
				+ index + '_LINK_PORT'));
		this.getForm().findField('ftpPort').setValue(proxyGroup.get('PROXY'
				+ index + '_FTP_PORT'));

	},
	// ��proxy��Ϣ���浽ҳ����
	addAgentProxy : function() {
		var nodeId = this.agentParamsMaiPanel.nodeId;
		var proxyGroupName = this.getForm().findField('proxyGroupName')
				.getValue();
		var proxyIp = this.getForm().findField('Ip').getValue();
		var username = this.getForm().findField('userName').getValue();
		var password = this.getForm().findField('password').getValue();
		var linkType = this.getForm().findField('linkType').getValue();
		var linkPort = this.getForm().findField('linkPort').getValue();
		var ftpPort = this.getForm().findField('ftpPort').getValue();
		if (proxyIp == ''||username == ''||password == ''||linkType == ''||linkPort == ''||ftpPort == '') {
			Ext.MessageBox.show({
						title : '��ʾ',
						msg : '��<span  style=color:red>*</span>������д',
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;
		}

		this.agentParamsMaiPanel.proxyGroup.set('PROXY' + nodeId + '_IP',
				proxyIp);
		this.agentParamsMaiPanel.proxyGroup.set(
				'PROXY' + nodeId + '_USER_NAME',username);
		this.agentParamsMaiPanel.proxyGroup.set('PROXY' + nodeId + '_PASSWORD',password
				);
		this.agentParamsMaiPanel.proxyGroup.set(
				'PROXY' + nodeId + '_LINK_TYPE',linkType );
		this.agentParamsMaiPanel.proxyGroup.set(
				'PROXY' + nodeId + '_LINK_PORT',linkPort );
		this.agentParamsMaiPanel.proxyGroup.set('PROXY' + nodeId + '_FTP_PORT',
				ftpPort);

		Ext.MessageBox.show({
					title : '��ʾ',
					msg : 'proxy' + this.agentParamsMaiPanel.nodeId + '����ɹ�',
					width : 180,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.OK
				});
	},
	clearAgentProxy : function() {
		Ext.MessageBox.show({
					title : "��ʾ",
					msg : "��ղ�����������ӽڵ������(ҳ������),�Ƿ����?",
					width : 300,
					buttons : Ext.MessageBox.YESNO,
					icon : Ext.MessageBox.QUESTION,
					fn : function(select) {
						if (select == 'yes') {
							this.clearAgentProxyForPage();
							this.clearAgentProxyForValue();
						}
					},
					scope : this
				});
	},
	clearAgentProxyForPage : function() {
		// ҳ�����
		this.getForm().findField('Ip').setValue();
		this.getForm().findField('userName').setValue();
		this.getForm().findField('password').setValue();
		this.getForm().findField('linkType').setValue();
		this.getForm().findField('linkPort').setValue();
		this.getForm().findField('ftpPort').setValue();
	},
	clearAgentProxyForValue : function() {
		// ��ո�ҳ��ı���ֵ�Լ������ӽڵ��ֵ
		var nodeId = this.agentParamsMaiPanel.nodeId;
		for (var i = nodeId; i <= 3; i++) {
			this.agentParamsMaiPanel.proxyGroup.set('PROXY' + i + '_IP', '');
			this.agentParamsMaiPanel.proxyGroup.set('PROXY' + i + '_USER_NAME',
					'');
			this.agentParamsMaiPanel.proxyGroup.set('PROXY' + i + '_PASSWORD',
					'');
			this.agentParamsMaiPanel.proxyGroup.set('PROXY' + i + '_LINK_TYPE',
					'');
			this.agentParamsMaiPanel.proxyGroup.set('PROXY' + i + '_LINK_PORT',
					'');
			this.agentParamsMaiPanel.proxyGroup.set('PROXY' + i + '_FTP_PORT',
					'');
		}
	},
	checkTreeFn : function(node) {
		var proxyGroup = this.agentParamsMaiPanel.proxyGroup;
		var nodeId = node.id;
		if (nodeId != 0) {
			if (nodeId != 1) {// ���ǵ�һ���ڵ�
				var parentProxyId = proxyGroup.get('PROXY' + (nodeId - 1)
						+ '_IP');
				if (parentProxyId == undefined || parentProxyId == '') {
					Ext.MessageBox.show({
								title : '��ʾ',
								msg : "������дproxy" + (nodeId - 1) + '��Ϣ',
								width : 180,
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
					return;
				}

			}
			this.proxyInfoPanel.setTitle('proxy' + nodeId + '��ϸ��Ϣ');
			this.initProxyGroupInfo(proxyGroup, nodeId);
		}

	},
	// ȡ������
	cancel : function() {
		// ���ҳ�汣�����
		this.agentParamsMaiPanel.proxyGroup.data = {};
		this.agentParamsMaiPanel.nodeId = 1;
		this.proxyInfoPanel.setTitle('proxy' + 1 + '��ϸ��Ϣ');
		this.getForm().findField("proxyGroupName").setValue('');
		this.treePanel.getRootNode().setText("·��:");
		this.clearAgentProxyForPage();
		this.proxyGroupSet.expand();
		this.proxyGroupInfoSet.collapse();
		this.proxyGroupPanel.store.reload();
	},
	// �ύ����
	commit : function() {
		var proxyGroup = this.agentParamsMaiPanel.proxyGroup;
		var proxy1_ip = proxyGroup.get("PROXY" + 1 + "_IP");
		var proxyGroupNameValue = this.getForm().findField('proxyGroupName')
				.getValue();

		if (proxyGroupNameValue == undefined || proxyGroupNameValue == '') {

			Ext.MessageBox.show({
						title : '��ʾ',
						msg : "·�����Ʋ���Ϊ��!",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;

		}
		if (proxy1_ip == undefined || proxy1_ip == '') {

			Ext.MessageBox.show({
						title : '��ʾ',
						msg : "·�ɱ���������дһ��proxy",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;

		}
		// xml�ύ
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXml.createElement("root");
		sendXml.appendChild(root);
		var proxyGroupName = sendXml.createElement("proxyGroupName");
		proxyGroupName.text = proxyGroupNameValue;
		root.appendChild(proxyGroupName);
		for (var i = 1; i <= 3; i++) {
			var proxyIp = sendXml.createElement("proxy" + i + "Ip");
			var proxyUserName = sendXml.createElement("proxy" + i + "UserName");
			var proxyPwd = sendXml.createElement("proxy" + i + "Password");
			var proxyLinkType = sendXml.createElement("proxy" + i + "LinkType");
			var proxyLinkPort = sendXml.createElement("proxy" + i + "LinkPort");
			var proxyFtpPort = sendXml.createElement("proxy" + i + "FtpPort");

			proxyIp.text = proxyGroup.get("PROXY" + i + "_IP");
			proxyUserName.text = proxyGroup.get("PROXY" + i + "_USER_NAME");
			proxyPwd.text = proxyGroup.get("PROXY" + i + "_PASSWORD");
			proxyLinkType.text = proxyGroup.get("PROXY" + i + "_LINK_TYPE");
			proxyLinkPort.text = proxyGroup.get("PROXY" + i + "_LINK_PORT");
			proxyFtpPort.text = proxyGroup.get("PROXY" + i + "_FTP_PORT");

			root.appendChild(proxyIp);
			root.appendChild(proxyUserName);
			root.appendChild(proxyPwd);
			root.appendChild(proxyLinkType);
			root.appendChild(proxyLinkPort);
			root.appendChild(proxyFtpPort);
		}
		var proxyGroupIdValue = proxyGroup.get("PROXY_GROUP_ID");
		var action = 9;
		if (proxyGroupIdValue != undefined && proxyGroupIdValue != '') {
			action = 10;// �޸�
			var proxyGroupId = sendXml.createElement("proxyGroupId");
			proxyGroupId.text = proxyGroupIdValue;
			root.appendChild(proxyGroupId);
		}
		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");// XML�ύ
		sendRequest.open("POST", '../../servlet/DeployAgentServlet?action='
						+ action, false);
		sendRequest.send(sendXml);
		if (sendRequest.readyState == 4 && sendRequest.status == 200) {
			var obj = Ext.util.JSON.decode(sendRequest.responseText);
			Ext.MessageBox.show({
						title : '��ʾ',
						msg : obj.msg,
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : obj.flag
					});
			// ˢ������
			this.proxyGroupPanel.store.reload();
		}

	}

});
agentdeploy.router.routerWin = function(config) {
	this.config = config;
	this.proxyGroupPanel = new agentdeploy.router.routerPanel(config);
	agentdeploy.router.routerWin.superclass.constructor.call(this, {
				layout : 'fit',
				title : config.title,
				iconCls : 'objectIco',
				draggable : true,
				resizable : false,
				modal : true,
				closable : true,
				width : 700,
				y : 15,
				autoHeight : true,
				buttonAlign : 'center',
				items : [this.proxyGroupPanel],
				buttons : [{
							text : '�˳�',
							handler : function() {
								this.close();
							},
							scope : this
						}],
				listeners :{
					beforeclose :function(){
						if(this.proxyGroupPanel.isdelete){
							config.proxygroup.setValue();
						}
					}
				}
			});
}
Ext.extend(agentdeploy.router.routerWin, Ext.Window, {});