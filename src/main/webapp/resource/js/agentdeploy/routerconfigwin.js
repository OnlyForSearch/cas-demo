/** ************************路由配置界面************************ */
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
	var sm = new Ext.grid.CheckboxSelectionModel(); // 复选框
	var cmd = [
			new Ext.grid.RowNumberer(), // 序号
			sm, {
				header : '名称',
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
							html : '<span style=color:red>★★★</span>'
						}, {
							xytpe : 'fill'
						}, {
							text : '添加',
							handler : this.addAgentProxyGroup,
							iconCls : 'addAgentInfo',
							scope : this
						}, {
							text : '修改',
							handler : this.updateAgentProxyGroup,
							iconCls : 'icon-edit',
							scope : this
						}, {
							text : '删除',
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
							emptyMsg : "无数据",
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
				title : '路由列表',
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
							text : '路由:',
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
					fieldLabel : '<span style=color:blue>路由名称</span>',
					listeners : {
						change : {
							fn : function(obj, newValue) {
								this.treePanel.getRootNode().setText('路由:'
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
		fieldLabel : '连接类型',
		displayField : 'mean',
		valueField : 'code',
		editable : false,
		mode : 'remote',
		width : 120,
		triggerAction : 'all',
		emptyText : '请选择',
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
		title : 'proxy1详细信息',
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
									fieldLabel : '用户名',
									name : 'userName',
									maxLength :20
								}, {
									xtype : 'textfield',
									fieldLabel : '密码',
									inputType : 'password',
									name : 'password',
									maxLength :20
								}, this.linkType, {
									xtype : 'numberfield',
									fieldLabel : '连接端口',
									name : 'linkPort',
									maxLength :5
								}, {
									xtype : 'numberfield',
									fieldLabel : 'ftp端口',
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
						text : '保存',
						handler : this.addAgentProxy,
						scope : this
					}, {
						text : '清空',
						handler : this.clearAgentProxy,
						scope : this
					}]
		}]
	})
	this.agentParamsMaiPanelTbar = new Ext.Toolbar({
				items : [{
							xtype : 'label',
							html : '<span style=color:red>★★★</span>'
						}, {
							xytpe : 'fill'
						}, {
							text : '保存路由',
							handler : this.commit,
							iconCls : 'save',
							scope : this
						}, {
							xytpe : 'fill'
						}, {
							xytpe : 'fill'
						}, {
							text : '取消',
							handler : this.cancel,
							iconCls : 'cancel',
							scope : this
						}]
			})
	this.agentParamsMaiPanel = new Ext.Panel({
				layout : 'border',
				width : 700,// 必须设置
				height : 300,

				tbar : this.agentParamsMaiPanelTbar,
				items : [this.westPanel, this.proxyInfoPanel]
			})
	var recordClass = Ext.data.Record.create([]);// 创建自定义构造器
	this.agentParamsMaiPanel.proxyGroup = new recordClass([]);// 页面保存对象3个proxy
	this.agentParamsMaiPanel.nodeId = 1;// 页面编辑对象标识
	this.proxyGroupInfoSet = new Ext.form.FieldSet({
				title : '详细信息配置',
				animCollapse : true,
				layout : 'form',
				collapsed : true,
				width : 700,// 必须设置
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
						title : '提示',
						msg : "您还未选择记录！",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;
		}
		if (records.length > 1) {
			Ext.MessageBox.show({
						title : '提示',
						msg : "您只能选择一条记录!",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;
		}
		var record = records[0];

		this.agentParamsMaiPanel.proxyGroup.data = {};// 清空对象
		Ext.apply(this.agentParamsMaiPanel.proxyGroup, record);// 复制对象
		this.proxyGroupSet.collapse();
		if(!flag||(flag&&flag!=true))
		{
			this.proxyGroupInfoSet.expand();
		}
		this.getForm().findField('proxyGroupName')
				.setValue(this.agentParamsMaiPanel.proxyGroup
						.get('PROXY_GROUP_NAME'));
		this.treePanel.getRootNode().setText('路由:'
				+ this.agentParamsMaiPanel.proxyGroup.get('PROXY_GROUP_NAME'));
		this.initProxyGroupInfo(this.agentParamsMaiPanel.proxyGroup, 1);
	},
	addAgentProxyGroup : function() {
		this.agentParamsMaiPanel.proxyGroup.data = {};// 清空对象
		this.agentParamsMaiPanel.nodeId = 1;
		this.getForm().findField('proxyGroupName').setValue();
		this.treePanel.getRootNode().setText('路由:');
		this.clearAgentProxyForPage();
		this.proxyGroupSet.collapse();
		this.proxyGroupInfoSet.expand();

	},
	delAgentProxyGroup : function() {
		var sm = this.proxyGroupPanel.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			Ext.MessageBox.show({
						title : '提示',
						msg : "您还未选择记录！",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;
		}
		Ext.MessageBox.show({
			title : '提示',
			msg : '真的要删除吗?',
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
										title : '提示',
										msg : rs.msg,
										width : 180,
										buttons : Ext.MessageBox.OK,
										icon : rs.flag
									});
							// 刷新数据
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
		this.agentParamsMaiPanel.nodeId = index;// 记住编辑对象
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
	// 将proxy信息保存到页面中
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
						title : '提示',
						msg : '带<span  style=color:red>*</span>必须填写',
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
					title : '提示',
					msg : 'proxy' + this.agentParamsMaiPanel.nodeId + '保存成功',
					width : 180,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.OK
				});
	},
	clearAgentProxy : function() {
		Ext.MessageBox.show({
					title : "提示",
					msg : "清空操作将清空其子节点的数据(页面数据),是否继续?",
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
		// 页面清空
		this.getForm().findField('Ip').setValue();
		this.getForm().findField('userName').setValue();
		this.getForm().findField('password').setValue();
		this.getForm().findField('linkType').setValue();
		this.getForm().findField('linkPort').setValue();
		this.getForm().findField('ftpPort').setValue();
	},
	clearAgentProxyForValue : function() {
		// 清空该页面的保存值以及它的子节点的值
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
			if (nodeId != 1) {// 不是第一个节点
				var parentProxyId = proxyGroup.get('PROXY' + (nodeId - 1)
						+ '_IP');
				if (parentProxyId == undefined || parentProxyId == '') {
					Ext.MessageBox.show({
								title : '提示',
								msg : "请先填写proxy" + (nodeId - 1) + '信息',
								width : 180,
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
					return;
				}

			}
			this.proxyInfoPanel.setTitle('proxy' + nodeId + '详细信息');
			this.initProxyGroupInfo(proxyGroup, nodeId);
		}

	},
	// 取消操作
	cancel : function() {
		// 清空页面保存对象
		this.agentParamsMaiPanel.proxyGroup.data = {};
		this.agentParamsMaiPanel.nodeId = 1;
		this.proxyInfoPanel.setTitle('proxy' + 1 + '详细信息');
		this.getForm().findField("proxyGroupName").setValue('');
		this.treePanel.getRootNode().setText("路由:");
		this.clearAgentProxyForPage();
		this.proxyGroupSet.expand();
		this.proxyGroupInfoSet.collapse();
		this.proxyGroupPanel.store.reload();
	},
	// 提交操作
	commit : function() {
		var proxyGroup = this.agentParamsMaiPanel.proxyGroup;
		var proxy1_ip = proxyGroup.get("PROXY" + 1 + "_IP");
		var proxyGroupNameValue = this.getForm().findField('proxyGroupName')
				.getValue();

		if (proxyGroupNameValue == undefined || proxyGroupNameValue == '') {

			Ext.MessageBox.show({
						title : '提示',
						msg : "路由名称不能为空!",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;

		}
		if (proxy1_ip == undefined || proxy1_ip == '') {

			Ext.MessageBox.show({
						title : '提示',
						msg : "路由必须至少填写一个proxy",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;

		}
		// xml提交
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
			action = 10;// 修改
			var proxyGroupId = sendXml.createElement("proxyGroupId");
			proxyGroupId.text = proxyGroupIdValue;
			root.appendChild(proxyGroupId);
		}
		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");// XML提交
		sendRequest.open("POST", '../../servlet/DeployAgentServlet?action='
						+ action, false);
		sendRequest.send(sendXml);
		if (sendRequest.readyState == 4 && sendRequest.status == 200) {
			var obj = Ext.util.JSON.decode(sendRequest.responseText);
			Ext.MessageBox.show({
						title : '提示',
						msg : obj.msg,
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : obj.flag
					});
			// 刷新数据
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
							text : '退出',
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