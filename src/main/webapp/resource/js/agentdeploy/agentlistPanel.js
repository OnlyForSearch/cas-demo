/** ********************************************总界面********************************* */
Ext.namespace("agentdeploy.list");
Ext.LoadMask.prototype.msg = "数据载入中...";
Ext.BLANK_IMAGE_URL = '../../resource/js/ext/resources/images/default/s.gif';

agentdeploy.list.agentListPanel = function(config) {
	var e = document.body;
	Ext.EventManager.onWindowResize(this.fireResize.createDelegate(this));
	Ext.QuickTips.init();
	/** *******************************************变量定义************************************************** */
	this.pageSize = 20;// 显示条数
	this.deployingAgents = [];// 部署的对象集
	this.deployedAgents = [];
	this.deployStart = 0;// 开始位置
	this.deployEnd = 0;// 结束位置
	// 定时器
	this.task = {
		run : function() {
			this.deployRresh(this.deployedAgents);
		},
		scope : this,
		interval : 3000
	};
	/** **********************************************元素定义******************************************************** */
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
		fieldLabel : '安装包名',
		displayField : 'mean',
		valueField : 'code',
		editable : false,
		mode : 'remote',
		width : 120,
		triggerAction : 'all',
		emptyText : '请选择',
		name : 'fileName'

	})
	// 搜索窗口
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
							fieldLabel : 'agent名称'
						}, {
							xtype : "treefield",
							name : "region",
							fieldLabel : "区域",
							emptyText : '请选择...',
							treeHeight : 260,
							xmlUrl : "../../servlet/RegionTree?action=6"
						}, this.fileName, {
							xtype : 'combo',
							name : 'linkType',
							store : new Ext.data.SimpleStore({
										fields : ['code', 'name'],
										data : [['1', 'telnet'], ['2', 'ssh']]
									}),
							fieldLabel : '连接类型',
							emptyText : '请选择...',
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
							fieldLabel : '开始时间',
							format : 'Y-m-d',
							readOnly : true,
							width : 120
						}, {
							xtype : 'datefield',
							name : 'endDeployTime',
							fieldLabel : '结束时间',
							format : 'Y-m-d',
							readOnly : true,
							width : 120
						}, {
							xtype : 'combo',
							name : 'STATE',
							store : new Ext.data.SimpleStore({
										fields : ['code', 'name'],
										data : [['0', '未部署'], ['3', '部署成功'],
												['2', '部署失败']]
									}),
							fieldLabel : '部署状态',
							emptyText : '请选择...',
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
				title : '条件查询',
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
							text : '查询',
							handler : function() {
								this.search();
							},
							scope : this
						}, {
							text : '清空',
							handler : function() {
								this.clear();
							},
							scope : this
						}, {
							text : '取消',
							handler : function() {
								this.queryWin.hide();
							},
							scope : this
						}]

			});// 创建搜索窗口结束
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

	var sm = new Ext.grid.CheckboxSelectionModel(); // 复选框

	var cmd = [
			new Ext.grid.RowNumberer(), // 序号
			sm, {
				header : 'agent网元IP',
				dataIndex : 'IP',
				sortable : true,
				width : 110,
				menuDisabled : true,
				align : 'center'
			}, {
				header : 'agent名称',
				dataIndex : 'AGENTNAME',
				sortable : true,
				width : 150,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '区域',
				dataIndex : 'REGION',
				sortable : true,
				width : 80,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '用户名',
				dataIndex : 'USERNAME',
				sortable : true,
				menuDisabled : true,
				width : 150,
				// renderer : showInfo,
				align : 'center'
			}, {
				header : '安装包名',
				dataIndex : 'FILENAME',
				sortable : true,
				menuDisabled : true,
				width : 150,
				align : 'center'
			}, {
				header : '连接类型',
				dataIndex : 'LINKTYPEVALUE',
				sortable : true,
				width : 75,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '部署时间',
				dataIndex : 'DEPLOYTIME',
				sortable : true,
				menuDisabled : true,
				width : 140,
				align : 'center'
			}, {
				header : '状态',
				dataIndex : 'STATE',
				sortable : true,
				menuDisabled : true,
				width : 100,
				align : 'center',
				renderer : function(value) {
					if (value == '0') {
						return "<span style=color:blue onclick='lookLog()'>未部署</span>";
					} else if (value == '1') {
						var image = "spinner.gif";
						return "<img src='../../resource/image/ico/" + image
								+ "'><span style=color:blue>部署中</span>";
					} else if (value == '2') {
						return "<span style=color:red onclick='lookLog()'>部署失败</span>"
					} else if (value == '3') {
						return "<span onclick='lookLog()' style=color:blue>部署成功</span>";
					} else if (value == '4') {
						return "<span style=color:blue>准备部署中..</span>";
					}
				}
			},{
				header : '创建者',
				dataIndex : 'CREATE_STAFF_NAME',
				sortable : true,
				menuDisabled : true,
				width : 80,
				align : 'center'
			},{
				header : '备注',
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
							data : [[10, '10条'], [20, '20条'], [30, '30条'],
									[40, '40条'], [50, '50条'], [60, '60条'],
									[70, '70条'], [80, '80条'], [90, '90条'],
									[100, '100条']]
						}),
				fieldLabel : '状态',
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
				text : '查询',
				iconCls : 'searchl',
				handler : function() {
					this.queryWin.show();
				},
				id : 'test',
				scope : this
			}, {
				text : '添加',
				iconCls : 'addAgentInfo',
				handler : this.addAgentInfo,
				scope : this
			}, {
				text : '修改',
				iconCls : 'icon-edit',
				handler : this.updateAgentInfo,
				scope : this
			}, {
				text : '删除',
				iconCls : 'icon-del',
				handler : this.deleteAgentInfo,
				scope : this
			}, '-', {
				text : '部署',
				iconCls : 'deploy',
				handler : this.deploy,
				scope : this
			}, {
				text : '停止部署',
				iconCls : 'stopDeploy',
				handler : this.stopDeploy,
				disabled : true,
				name : 'stopDeploy',
				scope : this
			},{
				text : '属性配置',
				iconCls : 'config',
				handler : this.attrConfig,
				name : 'attrConfig',
				scope : this
			},{
				text : '预览',
				iconCls : 'preview',
				handler : this.preview,
				name : 'preview',
				scope : this
			}, {
				text : '查看日志',
				iconCls : 'icon-search',
				handler : lookLog,
				scope : this
			}, '-', {
				text : '导入excel',
				iconCls : 'exportExcel',
				handler : this.importExcel,
				scope : this
			}, {
				text : '导出excel',
				iconCls : 'importExcel',
				handler : this.exportExcel,
				scope : this
			}, {
				text : '下载模板',
				iconCls : 'upLoad',
				handler : this.upLoadModel,
				scope : this
			}, '-', {
				xtype : 'label',
				text : '显示条数:',
				iconCls : 'icon-search'
			}, {
				xytpe : 'fill'
			}, countCom])
	this.bbarObj = new Ext.PagingToolbar({
				displayInfo : true,
				emptyMsg : "无数据",
				store : this.store
			})
	this.rightClick = new Ext.menu.Menu({
				items : [{

							text : '查看详细信息',
							iconCls : 'searchl',
							handler : this.updateAgentInfo,
							scope : this
						}, {
							text : '修改',
							iconCls : 'icon-edit',
							handler : this.updateAgentInfo,
							scope : this
						}, {
							text : '删除',
							iconCls : 'icon-del',
							handler : this.deleteAgentInfo,
							scope : this
						}, {
							text : '部署',
							iconCls : 'deploy',
							handler : this.deploy,
							scope : this
						}, {
							text : '查看日志',
							iconCls : 'icon-search',
							handler : lookLog,
							scope : this
						}]
			});// gridPanel结束
	agentdeploy.list.agentListPanel.superclass.constructor.call(this, {
				title : 'agent信息列表',
				border : true,
				store : this.store,
				layout : 'fit',
				stripeRows : true,
				renderTo : Ext.getBody(),// 渲染
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
	// 查询操作
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
	// 查询窗口清空事件
	clear : function() {
		this.searchPanel.getForm().reset();
	},
	// 查看日志
	lookLog : function() {
		var sm = this.getSelectionModel();
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
	// 显示右击菜单
	rightMemu : function(gird, row, cell, e) {
		var sm = this.getSelectionModel();
		sm.selectRow(row);
		e.preventDefault();
		this.rightClick.showAt(e.getXY());

	},
	// 删除操作
	deleteAgentInfo : function() {
		var sm = this.getSelectionModel();
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
					// 网元Id
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
										title : '提示',
										msg : rs.msg,
										width : 180,
										buttons : Ext.MessageBox.OK,
										icon : rs.flag
									});
							// 刷新数据
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
		// 修改的信息
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
//			title : '修改agent信息',
//			store : this.store,
//			buttonText : '应用',
//			type : '2',
//			'record' : record
			// 该行记录
			// sid:
	//	}
		//var updatePanel = new agentdeploy.update.updateWin(config);
		//updatePanel.show();
	
	},
	addAgentInfo : function() {
		var config = {
			title : '添加agent信息',
			store : this.store,
			buttonText : '下一条',
			'record' : {},
			type : '1'// 1代表添加

		}
		//var addPanel = new agentdeploy.update.updateWin(config);
		//addPanel.show();
		Global.inputMode = 'new';
		Global.agentInfoId = '';
		Global.agentInfoWin.show();
	},
	// 导出
	exportExcel : function() {
		var exportform = document.getElementById("exportExcelForm");
		exportform.param.value = this.getParamXml();
		exportform.submit();

	},
	checkImportExcel : function(filePath) {
		var flag = false;
		if (filePath == null || filePath == '') {
			Ext.MessageBox.show({
						title : '提示',
						msg : '文件名不能为空!',
						width : 200,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
		} else {
			var fileType = filePath.substring(filePath.lastIndexOf(".") + 1)
			if (fileType.toLowerCase() != 'xls') {

				Ext.MessageBox.show({
							title : '提示',
							msg : '文件要为xls格式!',
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
	// 导入
	importExcel : function() {

		var imPortFile = new Ext.form.TextField({
					fieldLabel : '导入Excel文件',
					inputType : 'file',
					height : 20,
					name : 'uploadFile',
					width : 250
				})
		
		var label= new Ext.form.Label({
			width : 250,
			html : '<span style="font-size:9pt;color:red">提示:如果改变属性配置,需下载最新的模板导入</span>',
			autoWidth : false
		})
		var imPortPanel = new Ext.FormPanel({
					fileUpload : true,
					items : [imPortFile,label]

				})
		var imPortwin = new Ext.Window({
			title : '请选择文件',
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
				text : '确定',
				handler : function() {
					var filePath = imPortFile.getValue();
					var flag = this.checkImportExcel(filePath);
					var store = this.store;
					if (flag)// 提交
					{

						imPortwin
								.setTitle("<span style=color:blue>提示:"
										+ "<img src='../../resource/image/ico/spinner.gif'/>"
										+ "正在导入中,请稍后...</span>");
						var url = "../../servlet/DeployAgentServlet?action=15";
						imPortPanel.url = url;
						imPortPanel.getForm().submit({
									url : url,
									success : function(f, a) {

										Ext.MessageBox.show({
													title : '提示',
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
													title : '提示',
													msg : a.result.msg,
													width : 200,
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.ERROR
												});
										imPortwin.setTitle('请选择文件');
									}
								})
					}
				},
				scope : this
			}, {
				text : '取消',
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
	},// 下载模板
	upLoadModel : function() {
		//window.location.href = "/workshop/agentdeploy/agentfile/model/代理部署模板.xls";
		var exportform = document.getElementById("downloadTemplate");
		exportform.submit();
	},
	// 发送数据
	sendDeployData : function() {
		this.deployedAgents = [];// 每次发送数据后清空对象
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
						title : '提示',
						msg : "您还未选择记录！",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
			return;
		}
		if(!this.checkIsDeploy(records)){
		
			Ext.MessageBox.show({
						title : '提示',
						msg : "您所选的记录中有正在部署的记录！",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
				return;
			
		}
		// 设置工具条不可编辑
		var tbItems = this.tbarObj.items;// 是一集合
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
		// 改变所有已选记录部署状态
		for (var i = 0; i < records.length; i++) {
			records[i].set("STATE", '4');
		}
		this.deployingAgents = records;// //初始化变量
		if (records.length > 20) {
			this.deployEnd = 20;
		} else {
			this.deployEnd = records.length;
		}
		this.sendDeployData();
		var task = new Ext.util.DelayedTask(function() {
					Ext.TaskMgr.start(this.task);// 启动定时器
				}, this);
		task.delay(1000);
		// 全部部署后
	},
	stopDeploy : function() {
		var tbItems = this.tbarObj.items;// 是一集合
		for (var i = 0; i < tbItems.length; i++) {
			var obj = tbItems.get(i);
			if ('stopDeploy' != obj.name) {
				obj.enable();
			} else {
				obj.disable();
			}
		}

		Ext.TaskMgr.stop(this.task);
		// 数据的清空
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
						title : '提示',
						msg : "您还未选择记录！",
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
	// 定时刷新agents为已发送的数据
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
					//定时刷新
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
					//该轮结束
					if (isEnd) {
						if(agentListPanel.deployEnd == agentListPanel.deployingAgents.length) {// 已部署到最后
							Ext.MessageBox.show({
										title : '提示',
										msg : "部署结束！",
										width : 180,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.OK
									});
							agentListPanel.stopDeploy();

						}else {//未到最后,并且该轮结束，部署下一个20条
							agentListPanel.deployStart = agentListPanel.deployEnd;
							if (agentListPanel.deployingAgents.length
									- agentListPanel.deployedAgents.length > 20) {
								agentListPanel.deployEnd = agentListPanel.deployStart
										+ 20;
							} else {
								agentListPanel.deployEnd = agentListPanel.deployingAgents.length;
							}
							
							agentListPanel.sendDeployData();//继续发送数据

						}

					}

				}
			}

		}

	},
	// 验证list中的状态是否结束
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
	//验证是否有数据在部署中
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
 * 查看日志
 */
function lookLog() {
	var sm = agentListPanel.getSelectionModel();
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
						title : '提示',
						msg : "该记录无日志信息!",
						width : 180,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
		}
	}

}