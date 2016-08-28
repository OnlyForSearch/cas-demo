Ext.BLANK_IMAGE_URL = '/resource/js/ext-2.0.2/resources/images/default/s.gif';
Ext.QuickTips.init();
Ext.onReady(initExt);
function initExt() {
	// Ext.Msg.alert("sdf", "sdafsdf");

	Ext.form.Field.prototype.msgTarget = 'side';// 统一指定错误信息提示方式
	var Pid;
	var type;// 操作类型
	var service_id = 22;

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
							iconCls : 'icon-plugin',
							text : '删除目录',
							handler : delLevel
						}]
			});

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
								// 服务器端数据成功删除后，同步删除客户端列表中的数据

								Ext.Msg.alert('提示', '删除成功。');
								var loader = TREE1.getLoader()
								loader.load(prodrootnode, function() {
											prodrootnode.collapse();
										});// 重新加载根节点
							} else {
								Ext.Msg.alert('提示', '目录包含字节的，不能删除！');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('提示', '删除信息请求失败！' );
						}
					});
		}

	}

	var Pid;

	function addLevel() {
		var sm = TREE1.getSelectionModel();
		var node = sm.getSelectedNode();
		if (node == null || node.isLeaf())
			Ext.MessageBox.alert("错误", "请选择一个目录");
		else {
			Form1.form.reset();
			mywin.setTitle("新增目录信息");
			mywin.show();
			Pid = node.id;
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
							text : '关闭',
							handler : function() {
								mywin.hide();
							}
						}, {
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
				height : 400,
				labelSeparator : "：",
				frame : true,
				border : false,
				items : [{
							xtype : 'textfield',
							width : 200,
							value : '',
							allowBlank : false,
							blankText : '数据源JNDI',
							name : 'JNDI',
							fieldLabel : '数据源JNDI'
						}, {
							xtype : 'textfield',
							width : 200,
							value : '',
							allowBlank : false,
							blankText : '说明',
							name : 'remark',
							fieldLabel : '备注说明'
						}],
				buttons : [{
							text : '关闭',
							handler : function() {
								mywin2.hide();
							}
						}, {
							text : '提交',
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
					// clientValidation : true,// 进行客户端验证
					waitMsg : '正在提交数据请稍后',// 提示信息
					waitTitle : '提示',// 标题
					url : '/servlet/jdbcGatherAction.do?method=addLEVEL',// 请求的url地址
					method : 'POST',// 请求方式
					success : function(form, action) {// 加载成功的处理函数
						mywin.hide();
						Ext.Msg.alert('提示', action.result.message);
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
					failure : function(form, action) {}
				});

	}

	function submitForms2() {
		Form2.form.submit({
					params : {
						Pid : Pid
					},
					// clientValidation : true,// 进行客户端验证
					waitMsg : '正在提交数据请稍后',// 提示信息
					waitTitle : '提示',// 标题
					url : '/servlet/jdbcGatherAction.do?method=addJNDI',// 请求的url地址
					method : 'POST',// 请求方式
					success : function(form, action) {// 加载成功的处理函数
						mywin.hide();
						Ext.Msg.alert('提示', action.result.message);
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
					// clientValidation : true,// 进行客户端验证
					waitMsg : '正在提交数据请稍后',// 提示信息
					waitTitle : '提示',// 标题
					url : '/servlet/jdbcGatherAction.do?method=addJDBC2',// 请求的url地址
					method : 'POST',// 请求方式
					success : function(form, action) {// 加载成功的处理函数
						mywin.hide();
						Ext.Msg.alert('提示', action.result.message);
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
				tabTip :"双击查询",
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
		title : 'JDBC采集任务',
		collapsible : true,
		region : 'west',// 指定子面板所在区域为west
		width : 250,
		border:false,
		animScroll : true,// 使用动画滚动效果
        autoScroll:true,
		items : TREE1,
		enableTabScroll : true
			// tab标签超宽时自动出现滚动按钮
		});

	// JNDIpanel1 任务基本信息
	function submitForms3() {
		JNDIpanel1.form.submit({
					params : {
						Pid : Pid
					},
					// clientValidation : true,// 进行客户端验证
					waitMsg : '正在提交数据请稍后',// 提示信息
					waitTitle : '提示',// 标题
					url : '/servlet/jdbcGatherAction.do?method=addJDBC1',// 请求的url地址
					method : 'POST',// 请求方式
					success : function(form, action) {// 加载成功的处理函数

						Ext.Msg.alert('提示', action.result.message);
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
							height : 250,
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
						}])),
		proxy : new Ext.data.HttpProxy({
					url : '/servlet/jdbcGatherAction.do?method=getJNDI_PARAM'
				})
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
						}, {
							name : 'REMARK'
						}])),
		proxy : new Ext.data.HttpProxy({
					url : '/servlet/jdbcGatherAction.do?method=getJNDISQL'
				})
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
							text : '删除参数',
							iconCls : 'icon-delete',
							handler : delPARAM
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
							width : 300,
							dataIndex : 'pri_value',
							sortable : true
						}, {
							header : "生成规则SQL",
							width : 300,
							dataIndex : 'gen_sql',
							sortable : true
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
							allowBlank : false,
							blankText : '初始值',
							name : 'P_VALUE',
							fieldLabel : '初始值'
						}, {
							xtype : 'textfield',
							width : 200,
							value : '',
							allowBlank : false,
							blankText : '生成规则SQL',
							name : 'SQLRULE',
							fieldLabel : '生成规则SQL'
						}],
				buttons : [{
							text : '关闭',
							handler : function() {
								mywin4.hide();
							}
						}, {
							text : '提交',
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

		Form5.form.submit({
					params : {
						Pid : service_id
					},
					// clientValidation : true,// 进行客户端验证
					waitMsg : '正在提交数据请稍后',// 提示信息
					waitTitle : '提示',// 标题
					url : '/servlet/jdbcGatherAction.do?method=addJDBC3',// 请求的url地址
					method : 'POST',// 请求方式
					success : function(form, action) {// 加载成功的处理函数
						mywin.hide();
						Ext.Msg.alert('提示', action.result.message);
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
				labelSeparator : "：",
				frame : true,
				border : false,
				items : [{
					fieldLabel : 'SQL类型',
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
								data : [["0SA", "SELECT-INSERT语句"],
										["0SB", "SELECT-存储过程调用"],
										["0SC", "INSERT语句"], ["0SD", "存储过程调用"],
										["0SE", "重采前置SQL"]]
							}),
					valueField : 'value',
					displayField : 'text'
				}, {
					xtype : 'textfield',
					width : 200,
					value : '',
					allowBlank : false,
					blankText : 'SQL文本1',
					name : 'SQL1',
					fieldLabel : 'SQL文本1'
				}, {
					xtype : 'textfield',
					width : 200,
					value : '',
					allowBlank : false,
					blankText : 'SQL文本2',
					name : 'SQL2',
					fieldLabel : 'SQL文本2'
				}, {
					xtype : 'textfield',
					width : 200,
					value : '',
					allowBlank : false,
					blankText : '执行顺序',
					name : 'SORT',
					fieldLabel : '执行顺序'
				}, {
					xtype : 'textfield',
					width : 200,
					value : '',
					allowBlank : false,
					blankText : '备注说明',
					name : 'REMARK',
					fieldLabel : '备注说明'
				}, {
					width : 120,
					fieldLabel : '连接数据源',
					name : 'FIR_DIR_NAME',
					hiddenName : 'POOL_ID',
					allowBlank : false,
					blankText : '连接数据源',
					xtype : 'combo',
					editable : false,
					triggerAction : 'all',
					mode : 'remote', // local直接先加载进来 remote是点击才加载
					store : sql_con_store,
					emptyText : '请选择...',
					valueField : 'POOL_ID',
					displayField : 'JNDI_NAME'
				}],
				buttons : [{
							text : '关闭',
							handler : function() {
								mywin5.hide();
							}
						}, {
							text : '提交',
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
								JNDIpanel3_STORE.reload();
							} else {
								Ext.Msg.alert('提示', '目录包含字节的，不能删除！');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('提示', '删除信息请求失败！' );
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
							dataIndex : 'SQL_TYPE',
							sortable : true
						}, {
							header : "SQL文本1",
							width : 160,
							dataIndex : 'SQL_TEXT1',
							sortable : true
						}, {
							header : "SQL文本2",
							width : 160,
							dataIndex : 'SQL_TEXT2',
							sortable : true
						}, {
							header : "执行顺序",
							width : 80,
							dataIndex : 'SORT_ID',
							sortable : true
						}, {
							header : "备注说明",
							width : 140,
							dataIndex : 'REMARK',
							sortable : true
						}, {
							header : "数据源",
							width : 80,
							dataIndex : 'POOL_ID',
							sortable : true
						}]
			});
	//

	//
	// 定时计划
	var JNDIpanel4 = new Ext.FormPanel({
				id : 'JNDIpanel4',
				height : 300,
				labelSeparator : "：",
				frame : true,
				title : "任务定时计划",
				border : false,
				items : [{
					fieldLabel : '定时计划类型',
					hiddenName : 'SCHED_TYPE',
					name : 'sched.SCHED_TYPE_NAME',
					xtype : 'combo',
					width : 300,
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
					fieldLabel : '采集周期',
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
								data : [["N", "分"], ["H", "时"], ["D", "日"],
										["W", "周"], ["M", "月"]]
							}),
					valueField : 'value',
					displayField : 'text'
				}, {
					name : 'INTERVAL',
					xtype : 'textfield',
					fieldLabel : '采集频率',
					width : 300,
					allowBlank : false,
					regex : /^[1-9]*[1-9][0-9]*$/,
					regexText : '请输入非零整型数据.',
					maxLength : 50
				}, {
					name : 'RUN_TIME',
					xtype : 'uxruntimefield',
					width : 300,
					fieldLabel : '定时运行时间'
				}, {
					id : 'startdt',
					name : 'START_TIME',
					endDateField : 'enddt',
					// vtype: 'daterange',
					width : 300,
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
					width : 300,
					xtype : 'datefield',
					fieldLabel : '计划失效时间',
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
					fieldLabel : '采集开始时间参数',
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
					fieldLabel : '采集结束时间参数',
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
		var rows = R_PANEL1.getSelectionModel().getSelections();
		if(rows.length == 0){
			var msgBox = Ext.MessageBox.show({
				id : 'msgBox',
				title : '提示',
				width : 200,
				msg : '至少选中一个批次进行重采.',
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
					title : '提示',
					width : 250,
					msg : '正在操作......'
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
							Ext.Msg.alert('提示', '发送重采消息成功，请稍候重新查询查看结果！');
						} else {
							Ext.Msg.alert("错误信息", unescape(result.message));
						}
					},
					failure : function(response, options) {
						msgTip.hide();
						Ext.Msg.alert("错误信息", unescape(options.result.message));
					}
				});
	}
	
	function submitForms5() {
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
						mywin.hide();
						Ext.Msg.alert('提示', action.result.message);
					},
					failure : function(form, action) {// 加载失败的处理函数
						// Ext.Msg.alert('提示', '新增货架失败');
						for (var err in action.result.errors) {}
					}
				});

	}
	//
	// 单个采集任务TabPanel
	var JNDItabPanel = new Ext.TabPanel({
				id : 'JNDItabPanel',
				height : 400,
				width : 770,
				activeTab : 0,// 默认激活第一个tab页
				animScroll : true,// 使用动画滚动效果
				autoScroll : true,
				frame : false,
				items : [JNDIpanel4, JNDIpanel1, JNDIpanel2, JNDIpanel3],
				// items : [JNDIpanel1, JNDIpanel2, JNDIpanel3],
				enableTabScroll : false
			});

	// -----------------------------------------------------------------------------流程定义面板
	// END
	// -------------------------------------------------------------------流程实例面板

	var R_PANEL1_STORE = new Ext.data.Store({// 配置分组数据集
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
					Ext.MessageBox.alert("输入条件错误", "请选择一个采集任务");
					return;
				}
				R_PANEL1_STORE.removeAll();
				var SDate = Ext.getCmp('beginDate').getValue().format('Y-m-d');
				var EDate = Ext.getCmp('endDate').getValue().format('Y-m-d');
				R_PANEL1_STORE.baseParams.node = node.id;
				R_PANEL1_STORE.baseParams.SDate = SDate;
				R_PANEL1_STORE.baseParams.EDate = EDate;
			}, this)

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
		animScroll : true,// 使用动画滚动效果
		autoScroll : true,
		title : 'JDBC采集任务列表',
		enableTabScroll : true,
		tbar : new Ext.Toolbar([{
					xtype : 'tbtext',
					text : '开始时间:'
				}, {
					id : 'beginDate',
					xtype : 'datefield',
					format : 'Y年m月d日',// 显示日期的格式
					width : 150,
					allowBlank : false,// 不允许为空
					readOnly : true,// 设置只读
					value : new Date(),// 设置默认值
					fieldLabel : '开始日期'
					// dateRange:{begin:'beginDate',end:'endDate'},//用于vtype类型dateRange
				// vtype:'dateRange'
			}	, '-', {
					xtype : 'tbtext',
					text : '结束时间:'
				}, new Ext.form.DateField({
					id : 'endDate',
					format : 'Y年m月d日',// 显示日期的格式
					width : 150,
					allowBlank : false,// 不允许为空
					readOnly : true,// 设置只读
					value : new Date(),// 设置默认值
					fieldLabel : '结束日期'
						// dateRange:{begin:'beginDate',end:'endDate'},//
						// 用于vtype类型dateRange
						// vtype:'dateRange'
					}), '-', new Ext.Button({
							text : '  查询',
							width : 110,
							handler : function quary() {
								var sm = TREE1.getSelectionModel();
								var node = sm.getSelectedNode();
								if (node == null) {
									Ext.MessageBox.alert("输入条件错误", "请选择一个采集任务");
									return;
								}
								R_PANEL1_STORE.removeAll();

								var SDate = Ext.getCmp('beginDate').getValue()
										.format('Y-m-d');
								var EDate = Ext.getCmp('endDate').getValue()
										.format('Y-m-d');

								if (SDate > EDate) {

									Ext.MessageBox.alert("输入条件错误",
											"开始日期不能大于结束日期");
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
					text : '批次重采',
					tooltip : '<b>重新执行该批次</b>',
					handler : applyPlan
				}]),
		bbar : new Ext.PagingToolbar({// 分页工具栏
			store : R_PANEL1_STORE,
			pageSize : 20,
			displayInfo : true,
			displayMsg : '第 {0} 条到 {1} 条，一共 {2} 条',
			emptyMsg : "没有记录"
		}),
		sm : sm,
		columns : [// 配置表格列
				//new Ext.grid.RowNumberer({
					//		header : '行号',
					//		width : 36
					//	}),// 表格行号组件
				sm,
				{
					header : "批次标识",
					width : 120,
					dataIndex : 'batch_id',
					sortable : true
				}, {
					header : "开始时间",
					width : 160,
					dataIndex : 's_time',
					sortable : true
				}, {
					header : "结束时间",
					width : 160,
					dataIndex : 'e_time',
					sortable : true
				}, {
					header : "状态",
					width : 80,
					dataIndex : 'state',
					renderer : RWD_datarender,
					sortable : true
				}, {
					header : "详细信息",
					renderer : qtips,
					dataIndex : 'exec_info',
					renderer : qtips,
					sortable : true
				}]
	});
	
	function RWD_datarender(val) {
		switch (val) {
			case '执行成功' :
				return val;
				break
			case '执行失败' :
				return '<font color=red>'+val+'</font>';
				break
            case '执行超时' :
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
							width : 100,
							dataIndex : 'JNDI_NAME',
							sortable : true
						}, {
							header : "说明",
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
				activeTab : 0,// 默认激活第一个tab页
				animScroll : true,// 使用动画滚动效果
				autoScroll : true,
				frame : true,
				items : [R_PANEL1],
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
								// R_PANEL2_STORE.load({
								// params : {
								// node : node.id,
								// style : 'R_PANEL2',
								// start : 0,
								// limit : 20
								// }
								// });
							} else {
								Ext.Msg.alert('提示', '目录包含字节的，不能删除！');
							}
						},
						failure : function(response, options) {
							msgTip.hide();
							Ext.Msg.alert('提示', '删除信息请求失败！' );
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

				title : 'JDBC采集配置',
				bodyStyle : 'background-color:#22FFFF',// 设置面板体的背景色
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
				title : 'JDBC采集任务',
				defaults : {
					collapsible : true,
					split : true
				},
				layout : 'border',// 表格布局
				items : [{
							title : 'JDBC采集',
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
							region : 'west',// 指定子面板所在区域为west
							width : 320
						}, {
							title : '批次采集结果',
							layout : 'fit',
							items : [R_tabPanel1],
							region : 'center'// 指定子面板所在区域为center
						}]
			});
}
