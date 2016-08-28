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
	Ext.form.Field.prototype.msgTarget = 'side';// 统一指定错误信息提示方式
	var Pid;// 目录ID
	var type;// 操作类型
	var service_id;// 服务ID

	var prodrootnode = new Ext.tree.AsyncTreeNode({
				text : '任务目录',
				expanded : false,
				id : '0'
			});

	var contextMenu = new Ext.menu.Menu({
				listWidth : 200,
				items : [{
							text : '添加目录',
							iconCls : 'icon-add',
							handler : addLevel
						}, {
							text : '修改目录',
							iconCls : 'icon-edit',
							handler : modLevel
						}, {
							iconCls : 'icon-plugin',
							text : '删除目录',
							iconCls : 'icon-del',
							handler : delLevel
						}, {
							iconCls : 'icon-reflash',
							text : '重新加载',
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
						title : '提示',
						width : 250,
						msg : '正在删除......'
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
								Ext.Msg.alert('提示', '删除成功。');
								var loader = TREE1.getLoader()
								loader.load(prodrootnode, function() {
											prodrootnode.collapse();
										});
								R_PANEL1_STORE.removeAll();
								R_PANEL2_STORE.removeAll();
							} else {
								Ext.Msg.alert('提示', '目录包含任务的，不能删除！');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('提示', '删除信息请求失败!');
						}
					});
		}
	}

	function addLevel() {
		var sm = TREE1.getSelectionModel();
		var node = sm.getSelectedNode();
		if (node == null || node.isLeaf())
			Ext.MessageBox.alert("错误", "请选择一个目录");
		else {
			Global.levelopp = 0;
			Form1.form.reset();
			mywin.setTitle("新增目录信息");
			mywin.show();
			Pid = node.id;
		}
	}

	function modLevel() {
		var sm = TREE1.getSelectionModel();
		var node = sm.getSelectedNode();
		if (node == null)
			Ext.MessageBox.alert("错误", "请选择一个目录");
		else {
			Form1.form.reset();
			mywin.show();
			mywin.setTitle("修改目录信息");
			Form1.form.load({
						waitMsg : '正在加载数据请稍后',// 提示信息
						waitTitle : '提示',// 标题
						url : '/servlet/jdbcGatherAction.do?method=getLevelInfo',// 请求的url地址
						params : {
							ID : node.id
						},
						method : 'GET',// 请求方式
						success : function(form, action) {// 加载成功的处理函数
							Global.levelopp = 1;
							Pid = node.id;
						},
						failure : function(form, action) {// 加载失败的处理函数
							Ext.Msg.alert('提示', '基本信息加载失败');
						}
					});
		}
	}

	var Form1 = new Ext.FormPanel({
				height : 400,
				labelSeparator : "：",
				frame : true,
				border : false,
				items : [{
							xtype : 'textfield',
							width : 200,
							value : '',
							allowBlank : false,
							blankText : '目录名称',
							name : 'LEVEL_NAME',
							fieldLabel : '目录名称'
						}],
				buttons : [{
							text : '提交',
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
				labelSeparator : "：",
				frame : true,
				border : false,
				items : [{
							xtype : 'textfield',
							width : 290,
							value : '',
							allowBlank : false,
							blankText : '数据源名称',
							name : 'JNDI',
							fieldLabel : '数据源名称'
						},{
                            xtype : 'textfield',
                            width : 290,
                            value : '',
                            allowBlank : false,
                            blankText : '用户名',
                            name : 'userName',
                            fieldLabel : '用户名'
                        },{
                            xtype : 'textfield',
                            inputType: 'password',
                            width : 290,
                            value : '',
                            allowBlank : false,
                            blankText : '密码',
                            name : 'password',
                            fieldLabel : '密码'
                        },{
                            xtype : 'textfield',
                            width : 290,
                            value : 'jdbc:oracle:thin:@IP地址:端口:实例名',
                            allowBlank : false,
                            blankText : '连接串',
                            name : 'jdbcUrl',
                            fieldLabel : '连接串'
                        },{
                            xtype : 'textfield',
                            width : 290,
                            value : 'oracle.jdbc.OracleDriver',
                            allowBlank : false,
                            blankText : '驱动类名',
                            name : 'jdbcDriver',
                            fieldLabel : '驱动类名'
                        },{
                            xtype : 'textarea',
                            width : 290,
                            value : '{miniPoolSize:1,maxPoolSize:20,initialPoolSize:3,maxIdleTime:60,acquireIncrement:3}',
                            allowBlank : false,
                            blankText : '连接池参数',
                            name : 'poolCfg',
                            fieldLabel : '连接池参数',
                            height : 108
                }, {
							xtype : 'textarea',
							width : 290,
							value : '',
							allowBlank : false,
							blankText : '说明',
							name : 'remark',
							fieldLabel : '备注说明'
						}],
				buttons : [{
							text : '提交',
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
					// clientValidation : true,// 进行客户端验证
					waitMsg : '正在提交数据请稍后',// 提示信息
					waitTitle : '提示',// 标题
					url : '/servlet/jdbcGatherAction.do?method=addLEVEL',// 请求的url地址
					method : 'POST',// 请求方式
					success : function(form, action) {// 加载成功的处理函数
						mywin.hide();
						Ext.Msg.alert('提示', "操作成功");
						var loader = TREE1.getLoader();
						loader.load(prodrootnode, function() {
									prodrootnode.collapse();
								});// 重新加载根节点
						// typeStore.load({
						// params : {
						// node : myid
						// }
						// });
					},
					failure : function(form, action) {
						Ext.Msg.alert('提示', "操作失败");
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
					// clientValidation : true,// 进行客户端验证
					waitMsg : '正在提交数据请稍后',// 提示信息
					waitTitle : '提示',// 标题
					url : '/servlet/jdbcGatherAction.do?method=addJNDI',// 请求的url地址
					method : 'POST',// 请求方式
					success : function(form, action) {// 加载成功的处理函数
						mywin2.hide();
                        if(Global.dsopp==0)
						    Ext.Msg.alert('提示', '操作成功');
                        else
                            Ext.Msg.alert('提示', '操作成功，修改数据源后需JDBC采集重启客户端才能生效！');
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
						Ext.Msg.alert('提示', '操作失败');
					}
				});
	}

	function submitForms4() {
		var opptype = 0;
        var vservice_id=service_id;
        var paramId = 0;
		if (Global.paramopp==1) { //paramopp=1表示修改参数  paramopp=0表示新增参数
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
					// clientValidation : true,// 进行客户端验证
					waitMsg : '正在提交数据请稍后',// 提示信息
					waitTitle : '提示',// 标题
					url : '/servlet/jdbcGatherAction.do?method=addJDBC2',// 请求的url地址
					method : 'POST',// 请求方式
					success : function(form, action) {// 加载成功的处理函数
						Ext.Msg.alert('提示', '操作成功');
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
						Ext.Msg.alert("错误信息", unescape(action.result.message));
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
		title : 'JDBC采集任务配置',
		collapsible : true,
		region : 'west',// 指定子面板所在区域为west
		width : 200,
		border	   :false,
		animScroll : true,// 使用动画滚动效果
		items : TREE1,
		enableTabScroll : true
		});

	// JNDIpanel1 任务基本信息
	function submitForms3() {
		JNDIpanel1.form.submit({
					params : {
						Pid : Pid,
						optype : type,
						service_id : service_id
					},
					// clientValidation : true,// 进行客户端验证
					waitMsg : '正在提交数据请稍后',// 提示信息
					waitTitle : '提示',// 标题
					url : '/servlet/jdbcGatherAction.do?method=addJDBC1',// 请求的url地址
					method : 'POST',// 请求方式
					success : function(form, action) {// 加载成功的处理函数
						Ext.Msg.alert('提示', '操作成功');
						service_id = action.result.service_id;
						Global.newService=1;
					},
					failure : function(form, action) {
						Ext.Msg.alert('提示', '操作失败');
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
				labelSeparator : "：",
				frame : true,
				title : "任务基本信息",
				border : false,
				items : [{
							xtype : 'textfield',
							width : 500,
							value : '',
							allowBlank : false,
							blankText : '任务名称',
							name : 'NAME',
							fieldLabel : '任务名称'
						}, {
							xtype : 'textarea',
							width : 500,
							height : 300,
							value : '',
							allowBlank : false,
							blankText : '说明',
							name : 'REMARK',
							fieldLabel : '备注说明'
						}, {
							fieldLabel : '状态',
							hiddenName : 'state',
							xtype : 'combo',
							editable : false,
							allowBlank : false,
							triggerAction : 'all',
							mode : 'local',
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [["0SA", "生效"], ["0SX", "失效"]]
									}),
							valueField : 'value',
							displayField : 'text'
						},{
							//width : 200,
							fieldLabel : '采集客户端',
							hideLabel:true,
							name : 'client_name',
							hiddenName : 'client_id',
							id : 'clientId',
							allowBlank : true,
							blankText : '采集客户端',
							xtype : 'combo',
							editable : false,
							triggerAction : 'all',
							mode : 'local', // local直接先加载进来 remote是点击才加载
							store : gather_client_store,
							emptyText : '请选择...',
							valueField : 'client_id',
							displayField : 'client_name'
						}],
				buttons : [{
							text : '保存',
							handler : submitForms3
						}]
			});

	var JNDIpanel2_STORE = new Ext.data.Store({// 参数数据集
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

	var JNDIpanel3_STORE = new Ext.data.Store({// 采集SQL
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

	// JNDIpanel2 采集参数
	var JNDIpanel2 = new Ext.grid.GridPanel({
		id : 'JNDIpanel2',
		store : JNDIpanel2_STORE,
		animScroll : true,// 使用动画滚动效果
		autoScroll : true,
		height : 500,
		width : 400,

		title : '采集参数',
		enableTabScroll : true,// tab标签超宽时自动出现滚动按钮
		tbar : new Ext.Toolbar([{
					text : '添加参数',
					iconCls : 'icon-add',
					handler : addPARAM
				}, {
					text : '修改参数',
					iconCls : 'icon-delete',
					handler : modPARAM
				}, {
					text : '删除参数',
					iconCls : 'icon-delete',
					handler : delPARAM
				}, {
					text : '提示',
					iconCls : 'icon-delete',
					handler : function() {
						Ext.Msg
								.alert(
										"提示：",
										"系统缺省参数：<br> BATCH_ID 批次号，每批次运行时自动生成 <br> GAGHER_S_TIME 采集参数开始时间 <br> GAGHER_E_TIME 采集参数结束时间");
					}
				}]),
		bbar : new Ext.PagingToolbar({// 分页工具栏
			store : JNDIpanel2_STORE,
			pageSize : 20,
			displayInfo : true,
			displayMsg : '第 {0} 条到 {1} 条，一共 {2} 条',
			emptyMsg : "没有记录"
		}),
		columns : [// 配置表格列
				new Ext.grid.RowNumberer({
							header : '行号',
							width : 36
						}),// 表格行号组件
				{
					header : "参数名称",
					width : 100,
					dataIndex : 'param_name',
					sortable : true
				}, {
					header : "初始值",
					width : 160,
					dataIndex : 'pri_value',
					sortable : true
				}, {
					header : "生成规则SQL",
					xtype : 'textarea',
					height : 250,
					width : 300,
					dataIndex : 'gen_sql',
					sortable : true
				}, {
					header : "参数类型",
					width : 150,
					dataIndex : 'paramType',
					sortable : true,
					renderer : paramTypeRender
				}]
	});
	//
	// // JNDIpanel3 sql配置
	//
	var Form4 = new Ext.FormPanel({
		height : 400,
		labelSeparator : "：",
		frame : true,
		border : false,
		items : [{
					xtype : 'textfield',
					width : 200,
					value : '',
					allowBlank : false,
					blankText : '参数名称',
					name : 'NAME',
					fieldLabel : '参数名称'
				}, {
					xtype : 'textfield',
					width : 200,
					value : '',
//					allowBlank : false,
					blankText : '初始值',
					name : 'p_VALUE',
					fieldLabel : '初始值'
				}, {
					xtype : 'textfield',
					width : 200,
					value : '',
					allowBlank : false,
					blankText : '生成规则SQL',
					name : 'SQLRULE',
					fieldLabel : '生成规则SQL'
				},{
					xtype : 'combo',
					width : 200,
					value : '',
					allowBlank : false,
					name : 'PARAM_TYPE',
					fieldLabel : '参数类型',
					store : new Ext.data.SimpleStore({
						fields : ['value', 'text'],
						data : [["1", "普通参数"],
								["2", "动态SQL参数"]]
					}),
					hiddenName : 'paramType',
					editable : false,
					triggerAction : 'all',
					mode : 'local',
					valueField : 'value',
					displayField : 'text'
				}],
		buttons : [{
					text : '提交',
					handler : submitForms4
				}, {
					text : '帮助',
					handler : function() {
						Ext.Msg
								.alert("提示：",
										"参数都默认为STRING 类型，参数当前值写为 :CUR_VALUE，SQL语句不能有';'");
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
			Ext.Msg.alert('提示', '请先添加保存任务基本信息');
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
					waitMsg : '正在加载数据请稍后',// 提示信息
					waitTitle : '提示',// 标题
					url : '/servlet/jdbcGatherAction.do?method=getJDBC2',// 请求的url地址
					params : {
						ID : id.id
					},
					method : 'GET',// 请求方式
					success : function(form, action) {// 加载成功的处理函数
						// Ext.Msg.alert('提示','数据加载成功');
					},
					failure : function(form, action) {// 加载失败的处理函数
						Ext.Msg.alert('提示', '信息加载失败');
					}
				});
	}

	JNDIpanel2.on("rowdblclick", modPARAM, this)

	function delPARAM() {

		var id = JNDIpanel2.getSelectionModel().getSelected();
		if (id == null) {
			alert("请选择一条记录");
		} else {
			var msgTip = Ext.MessageBox.show({
						title : '提示',
						width : 250,
						msg : '正在删除......'
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
								// 服务器端数据成功删除后，同步删除客户端列表中的数据

								Ext.Msg.alert('提示', '删除成功。');
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
								Ext.Msg.alert('提示', '目录包含字节的，不能删除！');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('提示', '删除信息请求失败！');
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
					// clientValidation : true,// 进行客户端验证
					waitMsg : '正在提交数据请稍后',// 提示信息
					waitTitle : '提示',// 标题
					url : '/servlet/jdbcGatherAction.do?method=addJDBC3',// 请求的url地址
					method : 'POST',// 请求方式
					success : function(form, action) {// 加载成功的处理函数
						Ext.Msg.alert('提示', '操作成功');
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
					    Ext.Msg.alert("错误信息", unescape(action.result.message));
					}
				});
	}

	function submitForms7() {
		Ext.MessageBox.prompt('预跑语句输入', '请输入预跑语句', callBack, this, true);
		function callBack(id, msg) {
			if (id != 'ok')
				return;
			if (Ext.getCmp('sqlcombo').getValue() == "") {
				alert('请选择一个数据源');
				return;
			}
			var msgTip = Ext.MessageBox.show({
						title : '提示',
						width : 250,
						msg : '正在操作......'
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
						Ext.Msg.alert('提示', '执行结果(只显示第一行)：' + result.message);

					} else {
						Ext.Msg.alert('提示', '预跑失败，请检查语句');
					}
				},
				failure : function(response, options) {
					msgTip.hide();
					Ext.Msg.alert('提示', '请求失败，请检查语句');
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
		labelSeparator : "：",
		frame : true,
		id : 'Form5',
		border : false,
		items : [{
			fieldLabel : 'SQL类型',
			hiddenName : 'SQL_TYPE',
			name : 'sched.CYCLE_TYPE_NAME',
			xtype : 'combo',
			width : 260,
			allowBlank : false,
			editable : false,
			tooltip : '<b>启动该采集任务，配置完成后，点击此按钮运行该采集任务</b>',
			triggerAction : 'all',
			mode : 'local',
			store : new Ext.data.SimpleStore({
						fields : ['value', 'text'],
						data : [["0SA", "SELECT-INSERT语句"],
								["0SB", "SELECT-存储过程调用"], ["0SC", "INSERT语句"],
								["0SD", "存储过程调用"], ["0SE", "重采前置SQL"], ["0SF", "存储过程-INSERT语句"]]
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
			blankText : 'SQL文本1',
			emptyText : "如:select C1,C2 from tab1 where C3 between to_date(:GAGHER_S_TIME,'yymmddhh24miss') and to_date(:GAGHER_E_TIME,'yymmddhh24miss')",
			name : 'SQL1',
			fieldLabel : 'SQL文本1'
		}, {
			width : 260,
			fieldLabel : 'SQL文本1数据源',
			name : 'FIR_DIR_NAME',
			hiddenName : 'POOL_ID',
			id : 'sqlcombo',
			allowBlank : false,
			blankText : '选择数据源',
			xtype : 'combo',
			editable : false,
			triggerAction : 'all',
			mode : 'local', // local直接先加载进来 remote是点击才加载
			store : sql_con_store,
			emptyText : '请选择...',
			valueField : 'POOL_ID',
			displayField : 'JNDI_NAME'
		}, {
			xtype : 'textarea',
			height : 150,
			width : 400,
			value : '',
			allowBlank : true,
			emptyText : 'SELECT-INSERT语句,输入INSERT语句,如:insert into tab2 values(RS.C1,RS.C2, :BATCH_ID,SYSDATE) ; SELECT-存储过程调用,输入存储过程调用名称,如：pro1(:batch_id,rs.c1,rs.c2)',
			name : 'SQL2',
			id : 'sqlText2',
			fieldLabel : 'SQL文本2'
		}, {
			width : 260,
			fieldLabel : 'SQL文本2数据源',
			name : 'SEC_DIR_NAME',
			hiddenName : 'DEST_POOL_ID',
			id : 'poolCombo',
//			allowBlank : false,
			blankText : '选择数据源',
			xtype : 'combo',
			editable : false,
			triggerAction : 'all',
			mode : 'local', // local直接先加载进来 remote是点击才加载
			store : sql_con_store,
			emptyText : '请选择...',
			valueField : 'POOL_ID',
			displayField : 'JNDI_NAME'
		}, {
            xtype : 'textfield',
            width : 260,
            value : '',
            allowBlank : false,
            blankText : '执行顺序',
            regex : /^[1-9]*[1-9][0-9]*$/,
            regexText : '请输入非零整型数据.',
            name : 'SORT',
            fieldLabel : '执行顺序'
        }, {
			xtype : 'textfield',
			width : 260,
			value : '',
			blankText : '查询超时时间',
			regex : /^[1-9]*[1-9][0-9]*$/,
			regexText : '请输入非零整型数据.',
			name : 'QUERY_TIMEOUT',
			fieldLabel : '查询超时（秒）'
		}, {
			xtype : 'textfield',
			width : 260,
			value : '',
			allowBlank : false,
			blankText : '备注说明',
			name : 'REMARK',
			fieldLabel : '备注说明'
		}],
		buttons : [{
					text : 'SELECT语句预跑',
					handler : submitForms7
				}, {
					text : '提交',
					handler : submitForms6
				}, {
					text : '帮助',
					handler : function() {
						Ext.Msg
								.alert(
										"提示：",
										"采集参数写为 :参数名;<br>默认采集参数： <br>    GAGHER_S_TIME  采集参数开始时间,格式为yymmddhh24miss <br>   GAGHER_E_TIME 采集参数结束时间,格式为yymmddhh24miss<br>   BATCH_ID 批次ID<br>SELECT语句的SELECT结果集为 RS.列名  <br>所有结果集和参数都默认为STRING 类型<br>SQL语句不要加';'");
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
			alert("请选择一条记录");
		} else {
			var msgTip = Ext.MessageBox.show({
						title : '提示',
						width : 250,
						msg : '正在删除......'
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
								// 服务器端数据成功删除后，同步删除客户端列表中的数据
								Ext.Msg.alert('提示', '删除成功。');
								JNDIpanel2_STORE.reload();
								JNDIpanel3_STORE.reload();
								JNDIpanel5_STORE.reload();
							} else {
								Ext.Msg.alert('提示', '目录包含字节的，不能删除！');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('提示', '删除信息请求失败！');
						}
					});
		}
	}

	var JNDIpanel3 = new Ext.grid.GridPanel({
				id : 'JNDIpanel3',
				store : JNDIpanel3_STORE,
				animScroll : true,// 使用动画滚动效果
				autoScroll : true,
				height : 500,
				width : 400,
				title : '采集SQL配置',
				enableTabScroll : true,// tab标签超宽时自动出现滚动按钮
				tbar : new Ext.Toolbar([{
							text : '添加SQL',
							iconCls : 'icon-add',
							handler : addSQL
						}, {
							text : '修改SQL',
							iconCls : 'icon-delete',
							handler : modSQL
						}, {
							text : '删除SQL',
							iconCls : 'icon-delete',
							handler : delSQL
						}]),
				bbar : new Ext.PagingToolbar({// 分页工具栏
					store : JNDIpanel3_STORE,
					pageSize : 20,
					displayInfo : true,
					displayMsg : '第 {0} 条到 {1} 条，一共 {2} 条',
					emptyMsg : "没有记录"
				}),
				columns : [// 配置表格列
						new Ext.grid.RowNumberer({
									header : '行号',
									width : 36
								}),// 表格行号组件
						{
							header : "采集SQL类型",
							width : 80,
							renderer : datarender,
							dataIndex : 'SQL_TYPE',
							sortable : true
						}, {
							header : "SQL文本1",
							width : 150,
							dataIndex : 'SQL_TEXT1',
							sortable : true
						}, {
							header : "SQL文本2",
							width : 160,
							dataIndex : 'SQL_TEXT2',
							sortable : true
						},{
                            header : "查询超时",
                            width : 60,
                            dataIndex : 'QUERY_TIMEOUT',
                            sortable : true
                        }, {
							header : "执行顺序",
							width : 60,
							dataIndex : 'SORT_ID',
							sortable : true
						}, {
							header : "备注说明",
							width : 60,
							dataIndex : 'REMARK',
							sortable : true
						}, {
							header : "数据源",
							width : 60,
							dataIndex : 'POOL_ID',
							sortable : true
						},{
							header : "目标数据源",
							width : 60,
							dataIndex : 'DEST_POOL_ID',
							sortable : true
						}]
			});
	//

	//
	// 定时计划
	var JNDIpanel4 = new Ext.FormPanel({
				id : 'JNDIpanel4',
				height : 300,
                labelWidth : 150,
				labelSeparator : "：",
				frame : true,
				title : "任务定时计划",
				border : false,
				items : [{
					fieldLabel : '定时计划类型',
					hiddenName : 'SCHED_TYPE',
					name : 'sched.SCHED_TYPE_NAME',
					xtype : 'combo',
					width : 350,
					editable : false,
					triggerAction : 'all',
					mode : 'local',
					store : new Ext.data.SimpleStore({
								fields : ['value', 'text'],
								data : [["0SA", "周期"], ["0SB", "定时"],
										["0SC", "即时"]]
							}),
					valueField : 'value',
					displayField : 'text',
					listeners : {}
				}, {
					fieldLabel : '采集周期',
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
								data : [["N", "分"], ["H", "时"], ["D", "日"],
										["W", "周"], ["M", "月"]]
							}),
					valueField : 'value',
					displayField : 'text'
				}, {
					name : 'INTERVAL',
					xtype : 'textfield',
					fieldLabel : '采集频率',
					width : 350,
					allowBlank : false,
					regex : /^[1-9]*[1-9][0-9]*$/,
					regexText : '请输入非零整型数据.',
					maxLength : 50
				}, {
					name : 'RUN_TIME',
					xtype : 'itnmCronField',
                    baseCls: 'x-plain',
                    fieldWidth: 60,
					width : 350,
                    maskRe: /^[0-9|*|,|-]{0,1}$/,
					fieldLabel : '定时运行时间'
				}, {
					id : 'startdt',
					name : 'START_TIME',
					endDateField : 'enddt',
					// vtype: 'daterange',
					width : 350,
					xtype : 'datefield',
					fieldLabel : '计划生效时间',
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
					fieldLabel : '计划失效时间',
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
					fieldLabel : '采集开始时间参数',
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
					fieldLabel : '采集结束时间参数',
					format : 'Y-m-d H:i',
					allowBlank : false,
					maxValue : '01/01/2038',
					menu : new DatetimeMenu(),
					readOnly : true
				}, {
                    fieldLabel : '任务优先级（越大越高）',
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
                        data : [["1", "1（低）"], ["2", "2"], ["3", "3"],
                            ["4", "4"], ["5", "5"],
                            ["6", "6"], ["7", "7"], ["8", "8"],
                            ["9", "9"], ["10", "10（高）"]]
                    }),
                    valueField : 'value',
                    displayField : 'text'
                }, {
					xtype : 'textarea',
					width : 560,
					height : 150,
					value : '',
					allowBlank : false,
					blankText : '说明',
					name : 'REMARK',
					fieldLabel : '备注说明'
				}],
				buttons : [{
							text : '保存',
							handler : submitForms5
						}]
			});
			
	function applyPlan() {
		var node = R_PANEL1.getSelectionModel().getSelected();
		if (node == null) {
			alert("请选择一个任务");
		} else {
			var msgTip = Ext.MessageBox.show({
						title : '提示',
						width : 250,
						msg : '正在操作......'
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
								Ext.Msg.alert('提示', '操作成功！');
							} else {
								Ext.Msg.alert('提示', '操作失败，请检查定时计划配置是否正确！');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('提示', '请求失败，请检查定时计划配置是否正确！');
						}
					});
		}
	}
	
	function sendSchdeule(){
		var node = R_PANEL1.getSelectionModel().getSelected();
		if (node == null) {
			alert("请选择一个任务");
		} else {
			var msgTip = Ext.MessageBox.show({
						title : '提示',
						width : 250,
						msg : '正在操作......'
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
								Ext.Msg.alert('提示', '操作成功。');
								R_PANEL1_STORE.reload();
							} else {
								Ext.Msg.alert('提示', '请求失败，请检查定时计划配置是否正确！');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('提示', '请求失败，请检查定时计划配置是否正确！');
						}
					});
		}
	}
	
	function delSchdeuleTask(){
		var node = R_PANEL1.getSelectionModel().getSelected();
		if (node == null) {
			alert("请选择一个任务");
		} else {
			var msgTip = Ext.MessageBox.show({
						title : '提示',
						width : 250,
						msg : '正在操作......'
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
								Ext.Msg.alert('提示', '操作成功。');
								R_PANEL1_STORE.reload();
							} else {
								Ext.Msg.alert('提示', '请求失败，请检查采集客户端配置！');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('提示', '请求失败，请检查定时计划配置是否正确！');
						}
					});
		}
	}

	function submitForms5() {
		if(Global.newService==0){
		    Ext.Msg.alert("提示","请先保存基本信息");
		    return;
		}
		
		if(!JNDIpanel4.form.isValid()) 
			return;	
		
		JNDIpanel4.form.submit({
					params : {
						service_id : service_id,
						type : type
					},
					// clientValidation : true,// 进行客户端验证
					waitMsg : '正在提交数据请稍后',// 提示信息
					waitTitle : '提示',// 标题
					url : '/servlet/jdbcGatherAction.do?method=addJDBC4',// 请求的url地址
					method : 'POST',// 请求方式
					success : function(form, action) {// 加载成功的处理函数
						if(mywin.hidden)
						{
							mywin.hide();
						}
						Ext.Msg.alert('提示', '操作成功');
						JNDIpanel5_STORE.reload();
					},
					failure : function(form, action) {
                        Ext.Msg.alert('提示', '操作失败');
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
		title : '变更履历',
		store : JNDIpanel5_STORE,
		animScroll : true,
		autoScroll : true,
		height : 500,
		bbar : new Ext.PagingToolbar({
			store : JNDIpanel5_STORE,
			pageSize : 20,
			displayInfo : true,
			displayMsg : '第 {0} 条到 {1} 条，一共 {2} 条',
			emptyMsg : "没有记录"
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
						header : "变更人员",
						dataIndex : 'STAFF_NAME',
						width : 130
					}, {
						header : "变更时间",
						dataIndex : 'VERSION_TIME',
						width : 130
					},{
                        header : "变更备注",
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
                    		return '<input type="button" value="查看" onclick="showHisCfg()"/>';
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
					Ext.Msg.alert('提醒', '不允许修改他人的变更履历!');
					return false;
				}
			}
		}
	});
	
	//
	// 单个采集任务TabPanel
	var JNDItabPanel = new Ext.TabPanel({
				id : 'JNDItabPanel',
				height : 500,
				width : 778,
				activeTab : 0,// 默认激活第一个tab页
				animScroll : true,// 使用动画滚动效果
				autoScroll : true,
				frame : false,
				items : [JNDIpanel4, JNDIpanel1, JNDIpanel2, JNDIpanel3, JNDIpanel5],
				enableTabScroll : false
			});

	var R_PANEL1_STORE = new Ext.data.Store({// 配置分组数据集
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

	var R_PANEL2_STORE = new Ext.data.Store({// 配置分组数据集
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
		animScroll : true,// 使用动画滚动效果
		autoScroll : true,
		title : 'JDBC采集任务列表',
		enableTabScroll : true,
		tbar : new Ext.Toolbar([{
			text : '新增',
			iconCls : 'icon-add',
			tooltip : '<b>新增采集任务</b>',
			handler : function() {
				var btnName = "应用";
				if(!Ext.getCmp("btnSendSchdeule").hidden)
					btnName = "下发定时任务";
				
				var sm = TREE1.getSelectionModel();
				var node = sm.getSelectedNode();
				if (node == null || node.isLeaf())
					Ext.MessageBox.alert("错误", "请选择一个目录");
				else {
					type = 0;
					JNDIpanel1.form.reset();
					JNDIpanel4.form.reset();
					JNDIpanel2_STORE.removeAll();
					JNDIpanel3_STORE.removeAll();
					win.show();
					win.center();
					//禁用变更履历面板
					JNDIpanel5.disable();
					Ext.MessageBox.alert('提示', '新增采集任务或修改定时计划后，点击“'+btnName+'”按钮，启动该任务',
							callBack);
					Pid = node.id;
					Global.newService=0;
				}
			}
		}, '-', {
			text : '删除',
			tooltip : '<b>删除采集任务</b>',
			iconCls : 'icon-del',
			handler : function() {
				var id = R_PANEL1.getSelectionModel().getSelected();
				service_id = id;
				if (id == null) {
					alert("请选择一条记录");
				} else {
					var msgTip = Ext.MessageBox.show({
								title : '提示',
								width : 250,
								msg : '正在删除......'
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
										Ext.Msg.alert('提示', '删除成功。');
										R_PANEL1_STORE.reload();
										var loader = TREE1.getLoader()
										loader.load(prodrootnode, function() {
													prodrootnode.collapse();
												});// 重新加载根节点
									} else {
										Ext.Msg.alert('提示', '删除失败');
									}
								},
								failure : function(response, options) {
									msgTip.hide();
									Ext.Msg.alert('提示', '删除信息请求失败！');
								}
							});
				}
			}
		}, '-', {
			text : '修改',
			iconCls : 'icon-edit',
			tooltip : '<b>修改采集任务</b>',
			handler : function modService() {
				var id = R_PANEL1.getSelectionModel().getSelected();
				if(!id){
					alert("请选择一条记录");
				}else{
					service_id = id.id;
					type = 1;// 修改
					JNDIpanel1.form.reset();
					JNDIpanel4.form.reset();
					JNDIpanel2_STORE.removeAll();
					JNDIpanel3_STORE.removeAll();
					win.show();
					win.center();
					//启用 变更履历面
					JNDIpanel5.enable();
					Global.newService=1;
					Ext.getCmp('JNDItabPanel').setActiveTab(JNDIpanel1);
					JNDIpanel1.form.load({
								waitMsg : '正在加载数据请稍后',// 提示信息
								waitTitle : '提示',// 标题
								url : '/servlet/jdbcGatherAction.do?method=getJDBC1',// 请求的url地址
								params : {
									ID : service_id
								},
								method : 'GET',// 请求方式
								success : function(form, action) {// 加载成功的处理函数
									// Ext.Msg.alert('提示','数据加载成功');
								},
								failure : function(form, action) {// 加载失败的处理函数
									Ext.Msg.alert('提示', '基本信息加载失败');
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
								waitMsg : '正在加载数据请稍后',// 提示信息
								waitTitle : '提示',// 标题
								url : '/servlet/jdbcGatherAction.do?method=getJDBC4',// 请求的url地址
								params : {
									ID : service_id
								},
								method : 'GET',// 请求方式
								success : function(form, action) {// 加载成功的处理函数
									// Ext.Msg.alert('提示','数据加载成功');
								},
								failure : function(form, action) {// 加载失败的处理函数
									//Ext.Msg.alert('提示', '定时计划信息加载失败');
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
			text : '应用',
			iconCls : 'icon-apply',
			id : "btnApplyPlan",
			tooltip : '<b>新增采集任务或修改已有采集任务的定时计划后，需点击应用按钮，使配置生效</b>',
			handler : applyPlan
		}, {
			text : '下发定时任务',
			id : "btnSendSchdeule",
			iconCls : 'icon-timer',
			tooltip : '<b>新增采集任务或修改已有采集任务的定时计划后，需点击下发按钮，使配置生效</b>',
			handler : sendSchdeule
		},{
			text : '删除下发任务',
			id : "btnDelSchdeuleTask",
			iconCls : 'icon-del',
			tooltip : '<b>修改采集客户端前需要先删除原客户端上的任务！</b>',
			handler : delSchdeuleTask
		}, '-', {
			xtype : 'textfield',
			id : 'Q_SERIVCE_NAME',
			fieldLabel : '任务名称:'
		}, {
			text : '查询',
			iconCls : 'icon-search',
			tooltip : '<b>输入任务名称，查询</b>',
			handler : getServicebyname
		}]),

		columns : [// 配置表格列
				new Ext.grid.RowNumberer({
							header : '行号',
							width : 36
						}),// 表格行号组件
				{
					header : "任务标识",
					width : 70,
					dataIndex : 'ID',
					sortable : true
				}, {
					header : "任务名称",
					width : 180,
					dataIndex : 'serviceName',
					sortable : true
				}, {
					header : "状态",
					width : 80,
					dataIndex : 'state1',
					sortable : true
				}, {
					header : "创建时间",
					width : 135,
					dataIndex : 'cTime',
					sortable : true
				}, {
					header : "修改时间",
					width : 135,
					dataIndex : 'mTime',
					sortable : true
				}, {
					header : "任务说明",
					width : 135,
					dataIndex : 'remark',
					sortable : true
				},{
					header : "下发状态",
					width : 70,
					dataIndex : 'msgState',
					sortable : true
				},{
					header : "下发时间",
					width : 135,
					dataIndex : 'sendTime',
					sortable : true
				},{
					header : "接收时间",
					width : 135,
					dataIndex : 'recvTime',
					sortable : true
				}]
	});
	

	R_PANEL1.on("rowdblclick", modService);
	var R_PANEL2 = new Ext.grid.GridPanel({
				id : 'R_PANEL2',
				store : R_PANEL2_STORE,
				animScroll : true,// 使用动画滚动效果
				autoScroll : true,
				height : 500,
				width : 400,
				title : '数据源配置',
				enableTabScroll : true,// tab标签超宽时自动出现滚动按钮
				tbar : new Ext.Toolbar([{
							text : '添加数据源',
							handler : addJNDI
						}, '-', {
							text : '修改数据源',
							handler : modJNDI
						}, '-', {
							text : '删除数据源',
							handler : delJNDI
						}]),
				columns : [// 配置表格列
						new Ext.grid.RowNumberer({
									header : '行号',
									width : 36
								}),// 表格行号组件
						{
							header : "数据源JNDI",
							width : 200,
							dataIndex : 'JNDI_NAME',
							sortable : true
						}, {
							header : "说明",
							width : 400,
							dataIndex : 'REMARK',
							sortable : true
						}]
			});

	R_PANEL2.on("rowdblclick", modJNDI);

	JNDIpanel3.on("rowdblclick", function modSQL(store, node) {
				var id = JNDIpanel3.getSelectionModel().getSelected();
				if(id==null){
					alert("请选择一条记录");
					return;
				}
										
				Form5.form.load({
							waitMsg : '正在加载数据请稍后',// 提示信息
							waitTitle : '提示',// 标题
							url : '/servlet/jdbcGatherAction.do?method=getJDBC3',// 请求的url地址
							params : {
								ID : id.id
							},
							method : 'GET',// 请求方式
							success : function(form, action) {// 加载成功的处理函数
								// Ext.Msg.alert('提示','数据加载成功');
								if(action.result.data && action.result.data.DEST_POOL_ID)
									Form5.getForm().findField('DEST_POOL_ID').setValue(action.result.data.DEST_POOL_ID);
							},
							failure : function(form, action) {// 加载失败的处理函数
								Ext.Msg.alert('提示', '信息加载失败');
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
				type = 2;// 修改
			}, this);

	var R_tabPanel1 = new Ext.TabPanel({
				id : 'R_tabPanel1',
				// anchor : '99%',
				autoHeight : true,
				// height :555,
				activeTab : 0,// 默认激活第一个tab页
				animScroll : true,// 使用动画滚动效果
				autoScroll : true,
				frame : true,
				items : [R_PANEL1, R_PANEL2],
				enableTabScroll : false
			});
	

	function addJNDI() {
		var sm = TREE1.getSelectionModel();
		var node = sm.getSelectedNode();
		if (node == null || node.isLeaf())
			Ext.MessageBox.alert("错误", "任务上不能添加数据源");
		else {
			Form2.form.reset();
			mywin2.setTitle("新增数据源");
			mywin2.show();
			Pid = node.id;
			Global.dsopp = 0;
		}
	}

	function modJNDI() {
		var id = R_PANEL2.getSelectionModel().getSelected();
		if (id == null) {
			alert("请选择一个数据源");
		} else {
			Form2.form.reset();
			mywin2.show();
			mywin2.setTitle("修改数据源");
			Pid = id.id;
			Global.dsopp = 1;
			Form2.form.load({
						waitMsg : '正在加载数据请稍后',// 提示信息
						waitTitle : '提示',// 标题
						url : '/servlet/jdbcGatherAction.do?method=getJNDIInfo',// 请求的url地址
						params : {
							ID : id.id
						},
						method : 'GET',// 请求方式
						success : function(form, action) {// 加载成功的处理函数

						},
						failure : function(form, action) {// 加载失败的处理函数
							Ext.Msg.alert('提示', '基本信息加载失败');
						}
					});
		}

	}

	function delJNDI() {
		var id = R_PANEL2.getSelectionModel().getSelected();
		if (id == null) {
			alert("请选择一个数据源");
		} else {
			var msgTip = Ext.MessageBox.show({
						title : '提示',
						width : 250,
						msg : '正在删除......'
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
								// 服务器端数据成功删除后，同步删除客户端列表中的数据
								Ext.Msg.alert('提示', '删除成功。');
								R_PANEL2_STORE.reload();
							} else {
								Ext.Msg.alert('提示', '目录包含字节的，不能删除！');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('提示', '删除信息请求失败！数据源已被引用');
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
				title : 'JDBC采集配置',
				bodyStyle : 'background-color:#22FFFF',// 设置面板体的背景色
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
				title : 'JDBC采集任务',
				layout : 'border',// 表格布局
				defaults : {
					collapsible : true,
					split : true
				},
				items : [{
							title : 'JDBC采集',
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
							region : 'west',// 指定子面板所在区域为west
							width : 150
						}, {
							title : '欢迎使用',
							items : [R_tabPanel1],
							// layout:'fit',
							region : 'center'// 指定子面板所在区域为center
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
			result = "普通参数";
			break;
		case '2' :
			result = "动态SQL参数";
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
			return "SELECT-INSERT语句";
			break;
		case '0SB' :
			return "SELECT-存储过程调用";
			break;
		case '0SC' :
			return 'INSERT语句';
			break;
		case '0SD' :
			return '存储过程调用';
			break;
		case '0SE' :
			return '重采前置SQL';
			break;
		case '0SF' :
			return '存储过程-INSERT语句';
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
				waitMsg : '正在加载数据请稍后',
				waitTitle : '提示',
				url : '/servlet/jdbcGatherAction.do?method=getJDBC1',
				params : {
					ID : serviceId
				},
				method : 'GET',
				success : function(form, action) {
				},
				failure : function(form, action) {
					Ext.Msg.alert('提示', '基本信息加载失败');
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
				waitMsg : '正在加载数据请稍后',
				waitTitle : '提示',
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
				labelSeparator : "：",
				frame : true,
				title : "任务基本信息",
				border : false,
				items : [{
							xtype : 'textfield',
							width : 500,
							allowBlank : false,
							blankText : '任务名称',
							name : 'NAME',
							disabled : true,
							fieldLabel : '任务名称'
						}, {
							xtype : 'textarea',
							width : 500,
							height : 300,
							allowBlank : false,
							blankText : '说明',
							name : 'REMARK',
							disabled : true,
							fieldLabel : '备注说明'
						}, {
							fieldLabel : '状态',
							hiddenName : 'state',
							xtype : 'combo',
							editable : false,
							allowBlank : false,
							disabled : true,
							triggerAction : 'all',
							mode : 'local',
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [["0SA", "生效"], ["0SX", "失效"]]
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
		title : '采集参数',
		enableTabScroll : true,
		bbar : new Ext.PagingToolbar({
			store : Global.hisJNDIpanel2_STORE,
			pageSize : 20,
			displayInfo : true,
			displayMsg : '第 {0} 条到 {1} 条，一共 {2} 条',
			emptyMsg : "没有记录"
		}),
		columns : [
				new Ext.grid.RowNumberer({
							header : '行号',
							width : 36
						}),
				{
					header : "参数名称",
					width : 100,
					dataIndex : 'param_name',
					sortable : true
				}, {
					header : "初始值",
					width : 160,
					dataIndex : 'pri_value',
					sortable : true
				}, {
					header : "生成规则SQL",
					xtype : 'textarea',
					height : 250,
					width : 300,
					dataIndex : 'gen_sql',
					sortable : true
				}, {
					header : "参数类型",
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
				title : '采集SQL配置',
				enableTabScroll : true,
				bbar : new Ext.PagingToolbar({// 分页工具栏
					store : Global.hisJNDIpanel3_STORE,
					pageSize : 20,
					displayInfo : true,
					displayMsg : '第 {0} 条到 {1} 条，一共 {2} 条',
					emptyMsg : "没有记录"
				}),
				columns : [
						new Ext.grid.RowNumberer({
									header : '行号',
									width : 36
								}),
						{
							header : "采集SQL类型",
							width : 80,
							renderer : datarender,
							dataIndex : 'SQL_TYPE',
							sortable : true
						}, {
							header : "SQL文本1",
							width : 150,
							dataIndex : 'SQL_TEXT1',
							sortable : true
						}, {
							header : "SQL文本2",
							width : 160,
							dataIndex : 'SQL_TEXT2',
							sortable : true
						},{
                            header : "查询超时",
                            width : 60,
                            dataIndex : 'QUERY_TIMEOUT',
                            sortable : true
                        }, {
							header : "执行顺序",
							width : 60,
							dataIndex : 'SORT_ID',
							sortable : true
						}, {
							header : "备注说明",
							width : 60,
							dataIndex : 'REMARK',
							sortable : true
						}, {
							header : "数据源",
							width : 60,
							dataIndex : 'POOL_ID',
							sortable : true
						},{
							header : "目标数据源",
							width : 60,
							dataIndex : 'DEST_POOL_ID',
							sortable : true
						}]
			});
	Global.hisJNDIpanel4 = new Ext.FormPanel({
				height : 300,
                labelWidth : 150,
				labelSeparator : "：",
				frame : true,
				title : "任务定时计划",
				border : false,
				items : [{
					fieldLabel : '定时计划类型',
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
								data : [["0SA", "周期"], ["0SB", "定时"],
										["0SC", "即时"]]
							}),
					valueField : 'value',
					displayField : 'text'
				}, {
					fieldLabel : '采集周期',
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
								data : [["N", "分"], ["H", "时"], ["D", "日"],
										["W", "周"], ["M", "月"]]
							}),
					valueField : 'value',
					displayField : 'text'
				}, {
					name : 'INTERVAL',
					xtype : 'textfield',
					fieldLabel : '采集频率',
					width : 350,
					allowBlank : false,
					disabled : true,
					regex : /^[1-9]*[1-9][0-9]*$/,
					regexText : '请输入非零整型数据.',
					maxLength : 50
				}, {
					name : 'RUN_TIME',
					xtype : 'itnmCronField',
                    baseCls: 'x-plain',
                    fieldWidth: 60,
					width : 350,
					disabled : true,
                    maskRe: /^[0-9|*|,|-]{0,1}$/,
					fieldLabel : '定时运行时间'
				}, {
					name : 'START_TIME',
					endDateField : 'enddt',
					width : 350,
					xtype : 'datefield',
					fieldLabel : '计划生效时间',
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
					fieldLabel : '计划失效时间',
					format : 'Y-m-d H:i',
					allowBlank : false,
					maxValue : '01/01/2038',
					menu : new DatetimeMenu()
				}, {
					name : 'GSTART_TIME',
					endDateField : 'Genddt',
					width : 350,
					xtype : 'datefield',
					fieldLabel : '采集开始时间参数',
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
					fieldLabel : '采集结束时间参数',
					format : 'Y-m-d H:i',
					allowBlank : false,
					maxValue : '01/01/2038',
					menu : new DatetimeMenu(),
					disabled : true
				}, {
                    fieldLabel : '任务优先级（越大越高）',
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
                        data : [["1", "1（低）"], ["2", "2"], ["3", "3"],
                            ["4", "4"], ["5", "5"],
                            ["6", "6"], ["7", "7"], ["8", "8"],
                            ["9", "9"], ["10", "10（高）"]]
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
					blankText : '说明',
					name : 'REMARK',
					fieldLabel : '备注说明'
				}]
			});

	Global.hisJNDItabPanel = new Ext.TabPanel({
				height : 500,
				width : 778,
				activeTab : 0,// 默认激活第一个tab页
				animScroll : true,// 使用动画滚动效果
				autoScroll : true,
				frame : false,
				items : [Global.hisJNDIpanel4, Global.hisJNDIpanel1, Global.hisJNDIpanel2, Global.hisJNDIpanel3],
				enableTabScroll : false
	});
	
	Global.hisWin = new Ext.Window({
				width : 810,
				autoHeight : true,
				resizable : false,
				title : '变更记录',
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