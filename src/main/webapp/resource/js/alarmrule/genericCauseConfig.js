// Ext.form.Field.prototype.msgTarget = 'side';
var RuleGlobal = {
	methodAdd : 'method=add',
	methodEdit : 'method=edit',
	methodDel : 'method=del',
	isEdit : false,
	ruleForm : null,
	hisGrid : null,
	hisForm : null,
	ruleTabPanel : null,
	ruleWin : null,
	hisWin : null,
	groupForm : null,
	groupWin : null,
	groupGrid : null,
	gridWin : null,
	grid : null,
	view : null,
	sqlForm : null,
	sqlWin : null,
	ruleDatas : {},
	url:"/servlet/AlarmRuleAction.do?method=genericRule&action="
}

Ext.apply(Ext.form.VTypes, {
			time : function(val, field) {
				return /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\s[a|p]m)$/i
						.test(val);
			},
			timeText : '时间格式不正确，例子： "12:34:00 am".',
			// vtype Mask property: The keystroke filter mask
			timeMask : /[\d\s:amp]/i,

			number : function(val, field) {
				var v = /^\d+$/.test(val);
				if (!v)
					showMessageBox("提示", "只能输入整数！", Ext.Msg.INFO);
				return v;
			},
			numberText : '只能输入整数.',
			packname : function(val, field) {
				return /^[a-zA-Z0-9_\.]*[a-zA-Z0-9_]*$/.test(val);
			},
			packnameText : '只能输入英文字母和"."',
			strLength : function(val, field) {
				if (val.length > 249)
					return false;
				else
					return true;
			},
			strLengthText : '长度不能超过250个字符'
		});

Ext.onReady(function() {
			Ext.QuickTips.init();
			createGrid();
		});

function createGrid() {
	var store = new Ext.data.JsonStore({
				// autoLoad : true,
				proxy : new Ext.data.HttpProxy(new Ext.data.Connection({
							url : RuleGlobal.url+"42",
							timeout : 30000,
							method : 'POST'
						})),
				totalProperty : 'totalCount',
				idProperty : 'GROUP_ID',
				root : 'record',
				fields : [{
							name : 'GROUP_ID'
						}, {
							name : 'RULE_NAME'
						}, {
							name : 'TIME_RANGE'
						}, {
							name : 'CLOSE_METHOD'
						}, {
							name : 'REMARK'
						}, {
							name : 'STATUS'
						}],
				baseParams : {}
			});
	RuleGlobal.groupGrid = new Ext.grid.GridPanel({
				store : store,
				cm : new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
							header : '分组标识',
							dataIndex : 'GROUP_ID',
							sortable : true,
							//menuDisabled : true,
							width : 80
						}, {
							header : '规则名称',
							dataIndex : 'RULE_NAME',
							sortable : true,
							menuDisabled : true,
							width : 260
						}, {
							header : '时间窗口',
							dataIndex : 'TIME_RANGE',
							menuDisabled : true,
							sortable : true,
							width : 100
						}, {
							header : '告警关闭方式',
							dataIndex : 'CLOSE_METHOD',
							renderer : renderCloseMethod,
							sortable : true,
							menuDisabled : true,
							width : 200
						}, {
							header : '备注',
							dataIndex : 'REMARK',
							menuDisabled : true
							// width : 500
					}]),
				sm : new Ext.grid.RowSelectionModel({
							singleSelect : true
						}),
				autoScroll : true,
				tbar : [{
							text : "新增",
							iconCls : "icon-add",
							handler : function() {
								addGroup();
							}
						}, {
							text : "修改",
							iconCls : "icon-edit",
							handler : function() {
								editGroup();
							}
						}, {
							text : "删除",
							iconCls : "icon-del",
							handler : function() {
								delGroup();
							}
						}],
				bbar : new Ext.PagingToolbar({
							pageSize : 20,
							store : store,
							displayInfo : true,
							displayMsg : '显示规则记录 {0} - {1} of {2}',
							emptyMsg : "没有规则记录"
						}),
				listeners : {
					rowdblclick : {
						fn : function() {
							editGroup();
						},
						scope : this
					}
				},
				region : 'center',
				frame : false,
				autoExpandColumn : 5,
				animCollapse : false,
				title : '告警根原因通用规则配置',
				iconCls : 'icon-grid',
				loadMask : {
					msg : '数据载入中...'
				}
			});

	RuleGlobal.view = new Ext.Viewport({
				layout : 'border',
				items : [RuleGlobal.groupGrid]
			});
	store.load({
				params : {
					start : 0,
					limit : 20
				}
			});
}

function addRule(grid) {
	if (!RuleGlobal.groupForm.form.isValid()) {
		showMessageBox("提示", "请先填写规则基本信息，并保存！", Ext.Msg.INFO)
		return false;
	}
	var groupId = RuleGlobal.groupForm.form.findField("groupId");
	if (groupId.getValue() == null || groupId.getValue() == "") {
		Ext.Msg.confirm("提示", "添加详细规则前需先保存规则基本信息，点击“是”将自动保存！", function(btn,
						text) {
					if (btn == "yes") {
						saveGroup(true, grid);
					} else {
						return false;
					}
				});
	} else {
		showAddRule(grid);
	}
}

function showAddRule(grid) {
	if (!RuleGlobal.ruleForm) {
		createRuleForm();
	}
	if (!RuleGlobal.ruleWin) {
		createRuleWindow(grid);
	} else {
		resetForm();
	}
	var gForm = RuleGlobal.groupForm.form;
	var rForm = RuleGlobal.ruleForm.form;
	gForm.items.each(function(item, index, length) {
				var rField = rForm.findField(item.name);
				if (rField && item.getValue() != "")
					rField.setValue(item.getValue());
			}, this);
	grid.getEl().mask();
	RuleGlobal.isEdit = false;
	RuleGlobal.ruleWin.setTitle("新增告警规则");
	RuleGlobal.ruleWin.show();
	RuleGlobal.ruleWin.center();
	RuleGlobal.ruleTabPanel.setActiveTab(0);
}

function editRule(grid) {
	if (showRuleEdit(grid))
		RuleGlobal.ruleTabPanel.setActiveTab(0);
}

function delRule(grid) {
	Ext.MessageBox.confirm("提示", "是否删除选择的规则？", function(btn, text) {
				if (btn == "no")
					return false;
				var row = grid.getSelectionModel().getSelected();
				if (row) {
					var control = "del";
					var ruleId = row.get("RULE_ID");
					sendDel(ruleId);
				} else {
					showMessageBox("提示", "请先选择记录！", Ext.Msg.INFO);
				}
			});
}

function showRuleEdit(grid) {
	var row = grid.getSelectionModel().getSelected();
	if (row) {
		var rowObj = {
			groupId : row.get("GROUP_ID"),
			sqlId : row.get("SQL_ID"),
			ruleId : row.get("RULE_ID"),
			headRevision : row.get("HEAD_REVISION"),
			ruleName : row.get("RULE_NAME"),
			ruleRemark : row.get("RULE_REMARK"),
			// configSource : row.get("CONFIG_SOURCE"),
			closeMethod : row.get("CLOSE_METHOD"),
			sourceKpi : row.get("SOURCE_KPI"),
			sourceKpiName : row.get("SOURCE_KPI_NAME"),
			destinationKpi : row.get("DESTINATION_KPI"),
			destinationKpiName : row.get("DESTINATION_KPI_NAME"),
			timeRange : row.get("TIME_RANGE"),
			correlationSql : row.get("CORRELATION_SQL"),
			createTime : row.get("CREATE_TIME"),
			lastModifyTime : row.get("LAST_MODIFY_TIME"),
			srcAlarmLevel:row.get("SRC_ALARM_LEVEL"),
			destAlarmLevel:row.get("DEST_ALARM_LEVEL")
		};
		if (!RuleGlobal.ruleForm) {
			createRuleForm();
		}
		if (!RuleGlobal.ruleWin) {
			createRuleWindow(grid);
		} else {
			resetForm();
		}
		var form = RuleGlobal.ruleForm.form;
		form.findField("sqlId").getStore().load();
		for (k in rowObj) {
			var val = rowObj[k];
			var field = form.findField(k);
			if (field) {
				field.setValue(val);
			}
		}
		grid.getEl().mask();
		RuleGlobal.isEdit = true;
		RuleGlobal.ruleWin.setTitle("修改告警规则");
		RuleGlobal.ruleWin.show();
		RuleGlobal.ruleWin.center();
		// 载入历史版本
		RuleGlobal.hisGrid.getStore().reload({
					params : {
						ruleId : rowObj.ruleId
					}
				});
		return true;
	} else {
		showMessageBox("提示", "请先选择记录！", Ext.Msg.INFO);
		return false;
	}
}

function showHistory(grid) {
	if (showRuleEdit(grid))
		RuleGlobal.ruleTabPanel.setActiveTab(1);
}

function ruleSave() {
	if (RuleGlobal.ruleTabPanel.getActiveTab() != 0)
		RuleGlobal.ruleTabPanel.setActiveTab(0);
	var form = RuleGlobal.ruleForm.getForm();
	if (!form.isValid()) {
		showMessageBox("提示", "请完成必填项！", Ext.Msg.INFO);
		return false;
	}
	var groupId = form.findField("groupId").getValue();
	var sqlId = form.findField("sqlId").getValue();
	var ruleId = form.findField("ruleId").getValue();
	var ruleName = form.findField("ruleName").getValue();
	// var configSource = form.findField("configSource").getValue();
	var closeMethod = form.findField("closeMethod").getValue();
	var sourceKpi = form.findField("sourceKpi").getValue();
	var destinationKpi = form.findField("destinationKpi").getValue();
	var timeRange = form.findField("timeRange").getValue();
	var correlationSql = form.findField("correlationSql").getValue();
	var ruleRemark = form.findField("ruleRemark").getValue();
	var srcAlarmLevel = form.findField("srcAlarmLevel").getValue();
	var destAlarmLevel = form.findField("destAlarmLevel").getValue();
	var control;
	if (RuleGlobal.isEdit) {
		control = "edit";
	} else {
		control = "add";
	}
	if (!ruleId)
		ruleId = "";
	sendRule(control, ruleName, ruleRemark, closeMethod, sourceKpi,
			destinationKpi, timeRange, correlationSql, ruleId, groupId, sqlId ,srcAlarmLevel?srcAlarmLevel:"" ,destAlarmLevel?destAlarmLevel:"");
	// RuleGlobal.grid.search();
}

function ruleWinCancel() {
	resetForm();
	RuleGlobal.ruleWin.hide();
}

function sendRule(control, name, remark, closeMethod, sourceKpi,
		destinationKpi, timeRange, correlationSql, ruleId, groupId, sqlId,srcAlarmLevel,destAlarmLevel) {
	if (timeRange == null || timeRange == "")
		timeRange = 7200;
	var sendXml = "<rules type=\"alarmRootGeneralRule\" baseOn=\"alarmRuleBaseOnNe\">";
	sendXml += "	<rule>";
	sendXml += "		<id>" + ruleId + "</id>";
	sendXml += "		<neId>-1</neId>";
	sendXml += "		<sortId>0</sortId>";
	sendXml += "		<use>1</use>";
	sendXml += "		<templateId/>";
	sendXml += "		<control>" + control + "</control>";
	sendXml += "		<name>" + name + "</name>";
	sendXml += "		<state>0SA</state>";
	sendXml += "		<isAdvanced>0</isAdvanced>";
	sendXml += "		<remark>" + remark + "</remark>";
	sendXml += "		<ruletype>13</ruletype>";
	sendXml += "		<effective_time/>";
	sendXml += "		<condition>";
	sendXml += "        <c key='kpi_id' value='"+sourceKpi+","+destinationKpi+"' operate='in' value_type='number'></c>";
	sendXml += "		</condition>";
	sendXml += "		<actions>";
	sendXml += "			<c configSource='" + "0SA" + "'" + " closeMethod='"
			+ closeMethod + "'" + " sourceKpi='" + sourceKpi + "'" + " sqlId='"
			+ sqlId + "'" + " groupId='" + groupId + "'" + " destinationKpi='"
			+ destinationKpi + "'" + " timeRange='" + timeRange  + "' " + " srcAlarmLevel='"
			+ srcAlarmLevel  + "' " + " destAlarmLevel='" + destAlarmLevel  + "' " + " />";
	sendXml += "            <correlationSql><![CDATA[" + correlationSql
			+ "]]></correlationSql>";
	sendXml += "		</actions>";
	sendXml += "	</rule>";
	sendXml += "</rules>";
	// alert(sendXml);
	var rootRuleUrl, strMsg;
	if (control == "add") {
		strMsg = "添加成功！";
		rootRuleUrl = "../../servlet/alarmRuleCtrl.do?method=add";
	} else if (control == "edit") {
		strMsg = "编辑成功！";
		rootRuleUrl = "../../servlet/alarmRuleCtrl.do?method=edit";
	} else {
		strMsg = "删除成功！";
		rootRuleUrl = "../../servlet/alarmRuleCtrl.do?method=del";
	}
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", rootRuleUrl, false);
	oXMLHTTP.send(sendXml);
	if (isSuccess(oXMLHTTP)) {
		showMessageBox("提示", strMsg, Ext.Msg.INFO);
		RuleGlobal.grid.search({
					groupId : groupId
				});
		RuleGlobal.ruleForm.form.reset();
		RuleGlobal.ruleWin.hide();
	}
}

function sendDel(ruleId) {
	var rootRuleUrl, strMsg;
	strMsg = "删除成功！";
	rootRuleUrl = "../../servlet/alarmRuleCtrl.do?method=del" + "&id=" + ruleId;
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", rootRuleUrl, false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		showMessageBox("提示", strMsg, Ext.Msg.INFO);
		RuleGlobal.grid.search({
					groupId : RuleGlobal.groupForm.form.findField("groupId")
							.getValue()
				});
	}
}

function createRuleForm() {
	var alarmLevelStore = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [['1', '严重告警(Critical)'],
						['2', '重要告警(Major)'],['3', '一般告警(Minor)'],['4', '通知（事件）']]
			});
	var sqlStore = new Ext.data.JsonStore({
				// autoLoad : true,
				proxy : new Ext.data.HttpProxy(new Ext.data.Connection({
							url : RuleGlobal.url+"45",
							timeout : 30000,
							method : 'POST'
						})),
				fields : [{
							name : 'SQL_ID'
						}, {
							name : 'SQL_NAME'
						}, {
							name : 'CORRELATION_SQL'
						}],
				root : 'record',
				idProperty : 'SQL_ID',
				listeners : {
					load : function(s, r, o) {
						var rForm = RuleGlobal.ruleForm;
						if (!rForm)
							return;
						var sqlId = rForm.form.findField("sqlId");
						if (sqlId && sqlId.getValue() != "") {
							var rec = sqlId.getStore()
									.getById(sqlId.getValue());
							if (rec) {
								rForm.form.findField("correlationSql")
										.setValue(rec.get("CORRELATION_SQL"));
								sqlId.setValue(sqlId.getValue());
							}
						}
					}
				},
				baseParams : {}
			});
	RuleGlobal.ruleForm = new Ext.FormPanel({
		region : 'center',
		labelAlign : 'left',
		title : '规则信息',
		iconCls : 'icon-view',
		bodyStyle : 'padding:3px',
		labelSeparator : '：',
		frame : true,
		labelWidth : 80,
		items : [{
					layout : 'column',
					border : false,
					labelSeparator : '：',
					items : [{
								width : 260,
								layout : 'form',
								border : false,
								items : [{
											style : 'padding-top:5px',
											xtype : 'textfield',
											fieldLabel : '规则标识',
											disabled : true,
											// value : '自动生成',
											name : 'ruleId',
											anchor : '95%'
										}]
							}, {
								width : 260,
								layout : 'form',
								border : false,
								items : [{
											style : 'padding-top:5px',
											xtype : 'textfield',
											fieldLabel : '最新版本标识',
											disabled : true,
											// value : '自动生成',
											name : 'headRevision',
											anchor : '96%'
										}]
							}]
				}, {
					layout : 'column',
					border : false,
					labelSeparator : '：',
					items : [{
								width : 260,
								layout : 'form',
								border : false,
								items : [{
											xtype : 'hidden',
											name : 'groupId'
										}, {
											xtype : 'hidden',
											name : 'timeRange'
										}, {
											xtype : 'hidden',
											name : 'closeMethod'
										}, {
											xtype : 'hidden',
											name : 'ruleName'
										}, {
											style : 'padding-top:5px',
											xtype : 'textfield',
											fieldLabel : '来源KPI',
											readOnly : true,
											allowBlank : false,
											listeners : {
												focus : selectSubmitKPI
											},
											name : 'sourceKpiName',
											anchor : '95%'
										},
										 {
											style : 'padding-top:5px',
											fieldLabel : '来源告警级别',
											xtype : 'combo',
											displayField : 'text',
											valueField : 'value',
											triggerAction : 'all',
											editable : false,
											//allowBlank : false,
											mode : 'local',
											hiddenName : 'srcAlarmLevel',
											store : alarmLevelStore,
											name : 'srcAlarmLevel',
											anchor : '95%'
										}, {
											xtype : 'hidden',
											name : 'sourceKpi'
										}]
							}, {
								width : 260,
								layout : 'form',
								border : false,
								items : [{
											style : 'padding-top:5px',
											xtype : 'textfield',
											fieldLabel : '目标KPI',
											readOnly : true,
											allowBlank : false,
											listeners : {
												focus : selectSubmitKPI
											},
											name : 'destinationKpiName',
											anchor : '96%'
										},
										 {
											style : 'padding-top:5px',
											fieldLabel : '目标告警级别',
											xtype : 'combo',
											displayField : 'text',
											valueField : 'value',
											triggerAction : 'all',
											editable : false,
											//allowBlank : false,
											mode : 'local',
											hiddenName : 'destAlarmLevel',
											store : alarmLevelStore,
											name : 'destAlarmLevel',
											anchor : '95%'
										}, {
											xtype : 'hidden',
											name : 'destinationKpi'
										}]
							}]
				}, {
					layout : 'column',
					border : false,
					labelSeparator : '：',
					items : [{
						width : 406,
						layout : 'form',
						border : false,
						items : [{
							style : 'padding-top:5px',
							xtype : 'combo',
							fieldLabel : '关联SQL名称',
							displayField : 'SQL_NAME',
							valueField : 'SQL_ID',
							triggerAction : 'all',
							editable : false,
							allowBlank : false,
							store : sqlStore,
							mode : 'remote',
							hiddenName : 'sqlId',
							name : 'sqlName',
							anchor : '96%',
							listeners : {
								select : function(combo, record, index) {
									var correlationSql = RuleGlobal.ruleForm.form
											.findField("correlationSql");
									correlationSql.setValue(record
											.get("CORRELATION_SQL"));
								}
							}
						}]
					}, {
						xtype : 'button',
						text : '新增',
						handler : function() {
							if (!RuleGlobal.sqlWin)
								createSqlWin();
							resetForm(RuleGlobal.sqlForm);
							RuleGlobal.sqlWin.show();
						}
					}, {
						xtype : 'button',
						text : '修改',
						handler : function() {
							var sqlId = RuleGlobal.ruleForm.form
									.findField("sqlId").getValue();
							if (sqlId && sqlId != "") {
								if (!RuleGlobal.sqlWin)
									createSqlWin();
								var rec = RuleGlobal.ruleForm.form
										.findField("sqlId").getStore()
										.getById(sqlId);
								RuleGlobal.sqlForm.form.findField("sqlId")
										.setValue(sqlId);
								RuleGlobal.sqlForm.form.findField("sqlName")
										.setValue(rec.get("SQL_NAME"));
								RuleGlobal.sqlForm.form
										.findField("correlationSql")
										.setValue(rec.get("CORRELATION_SQL"));
								RuleGlobal.sqlWin.show();
							} else {
								showMessageBox("提示", "请先选择要修改的关联限制SQL",
										Ext.Msg.INFO)
							}
						}
					}, {
						xtype : 'button',
						text : '删除',
						handler : function() {
							var sqlId = RuleGlobal.ruleForm.form
									.findField("sqlId").getValue();
							if (sqlId && sqlId != "") {
								Ext.Ajax.request({
									url : RuleGlobal.url+"46",
									method : "post",
									async : true,
									params : {
										sqlId : sqlId,
										del : 'del'
									},
									success : function(resp, opts) {
										var respText = Ext.util.JSON
												.decode(resp.responseText);
										if (respText != null
												&& respText.success == true) {
											showMessageBox("提示", "所选项目删除成功！",
													Ext.MessageBox.OK);
											RuleGlobal.ruleForm.form
													.findField("sqlId")
													.getStore().reload();
											RuleGlobal.ruleForm.form
													.findField("sqlId")
													.clearValue();
											RuleGlobal.ruleForm.form
													.findField("correlationSql")
													.setValue("");
										} else {
											var respText = Ext.util.JSON
													.decode(resp.responseText);
											showMessageBox("错误",
													"删除失败！<br>错误原因："
															+ respText.errmsg,
													Ext.MessageBox.ERROR);
										}
									},
									failure : function(resp, opts) {
										var respText = Ext.util.JSON
												.decode(resp.responseText);
										showMessageBox("错误", "删除失败！<br>错误原因："
														+ respText.errmsg,
												Ext.MessageBox.ERROR);
									}
								});
							} else {
								showMessageBox("提示", "请先选择要修改的关联限制SQL",
										Ext.Msg.INFO)
							}
						}
					}]
				}, {
					layout : 'column',
					border : false,
					labelSeparator : '：',
					items : [{
								width : 510,
								layout : 'form',
								border : false,
								items : [{
											style : 'padding-top:5px',
											xtype : 'textarea',
											fieldLabel : '关联限制SQL',
											allowBlank : false,
											name : 'correlationSql',
											readOnly : true,
											height : 120,
											anchor : '100%'
										}]
							}]
				}, {
					layout : 'column',
					border : false,
					labelSeparator : '：',
					items : [{
								width : 510,
								layout : 'form',
								border : false,
								items : [{
											style : 'padding-top:5px',
											xtype : 'textarea',
											fieldLabel : '备注',
											vtype : 'strLength',
											// allowBlank : false,
											name : 'ruleRemark',
											height : 86,
											anchor : '100%'
										}]
							}]
				}]
	});
}

function createRuleWindow(g) {
	var st = new Ext.data.JsonStore({
				autoLoad : false,
				proxy : new Ext.data.HttpProxy(new Ext.data.Connection({
							url : RuleGlobal.url+"39",
							timeout : 30000,
							method : 'POST'
						})),
				fields : [{
							name : 'ruleRevisionId'
						}, {
							name : 'creator'
						}, {
							name : 'createTime'
						}, {
							name : 'lastModifier'
						}, {
							name : 'lastModifyTime'
						}, {
							name : 'ruleName'
						}, {
							name : 'ruleRemark'
						}, {
							name : 'closeMethod'
						}, {
							name : 'sourceKpi'
						}, {
							name : 'destinationKpi'
						}, {
							name : 'timeRange'
						}, {
							name : 'correlationSql'
						}, {
							name : 'ruleId'
						}],
				baseParams : {}
			});
	var cl = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				header : '版本标识',
				dataIndex : 'ruleRevisionId',
				menuDisabled : true,
				width : 100
			}, {
				header : '修改人',
				dataIndex : 'lastModifier',
				menuDisabled : true,
				width : 100
			}, {
				header : '修改时间',
				dataIndex : 'lastModifyTime',
				menuDisabled : true,
				width : 200
			}]);
	RuleGlobal.hisGrid = new Ext.grid.GridPanel({
				title : '修改历史',
				iconCls : 'icon-grid',
				autoScroll : true,
				frame : true,
				cm : cl,
				store : st,
				sm : new Ext.grid.RowSelectionModel({
							singleSelect : true
						}),
				listeners : {
					rowdblclick : {
						fn : function(g, i, e) {
							var record = g.getSelectionModel().getSelected();
							showHisWin(record);
						},
						scope : this
					}
				}
			});
	RuleGlobal.ruleTabPanel = new Ext.TabPanel({
				autoScroll : true,
				enableTabScroll : true,
				border : false,
				region : 'center',
				xtype : 'tabpanel',
				activeTab : 0,
				items : [RuleGlobal.ruleForm, RuleGlobal.hisGrid]
			});
	RuleGlobal.ruleWin = new Ext.Window({
				layout : 'border',
				title : '新增规则',
				width : 560,
				height : 400,
				iconCls : 'icon-add',
				closeAction : 'hide',
				plain : true,
				items : [RuleGlobal.ruleTabPanel],
				listeners : {
					show : function() {
						g.getEl().mask();
					},
					hide : function() {
						g.getEl().unmask();
					}
				},
				tbar : [{
							text : '保存',
							id : 'btnSave',
							iconCls : 'icon-save',
							handler : ruleSave
						}, {
							text : '关闭',
							iconCls : 'icon-undo',
							handler : ruleWinCancel
						}]
			});
}

function addGroup() {
	showGroupWin();
	resetForm(RuleGlobal.groupForm);
	RuleGlobal.grid.getStore().removeAll();
}

function editGroup() {
	var sm = RuleGlobal.groupGrid.getSelectionModel();
	var row = sm.getSelected();
	if (row) {
		showGroupWin();
		RuleGlobal.grid.getStore().load({
					params : {
						groupId : row.get("GROUP_ID")
					}
				});
		resetForm(RuleGlobal.groupForm);
		var form = RuleGlobal.groupForm.form;
		form.findField("groupId").setValue(row.get("GROUP_ID"));
		form.findField("ruleName").setValue(row.get("RULE_NAME"));
		form.findField("timeRange").setValue(row.get("TIME_RANGE"));
		form.findField("closeMethod").setValue(row.get("CLOSE_METHOD"));
		form.findField("remark").setValue(row.get("REMARK"));
	}
}

function delGroup() {
	var row = RuleGlobal.groupGrid.getSelectionModel().getSelected();
	if (row) {
		Ext.Ajax.request({
					url : RuleGlobal.url+"44",
					method : "post",
					async : true,
					params : {
						groupId : row.get("GROUP_ID")
					},
					success : function(resp, opts) {
						var respText = Ext.util.JSON.decode(resp.responseText);
						if (respText != null && respText.success == true) {
							showMessageBox("提示", "所选项目删除成功！", Ext.MessageBox.OK);
							RuleGlobal.groupGrid.getStore().reload();
						} else {
							var respText = Ext.util.JSON
									.decode(resp.responseText);
							showMessageBox("错误", "删除失败！<br>错误原因："
											+ respText.errmsg,
									Ext.MessageBox.ERROR);
						}
					},
					failure : function(resp, opts) {
						var respText = Ext.util.JSON.decode(resp.responseText);
						showMessageBox("错误",
								"删除失败！<br>错误原因：" + respText.errmsg,
								Ext.MessageBox.ERROR);
					}
				});
	}
}

function showGroupWin() {
	if (!RuleGlobal.groupWin)
		createGroupWin();
	RuleGlobal.groupWin.show();
}

function createGroupWin() {
	RuleGlobal.grid = new Ext.grid.GridPanel({
				store : new Ext.data.JsonStore({
							url : RuleGlobal.url+"41",
							root : 'record',
							fields : ['RULE_ID', 'HEAD_REVISION', 'RULE_NAME',
									'RULE_REMARK', 'SOURCE_KPI',
									'DESTINATION_KPI', 'TIME_RANGE',
									'CLOSE_METHOD', 'CORRELATION_SQL',
									'CREATE_TIME', 'LAST_MODIFY_TIME',
									'GROUP_ID','SQL_ID', 'SOURCE_KPI_NAME',
									'DESTINATION_KPI_NAME','SRC_ALARM_LEVEL','DEST_ALARM_LEVEL']
						}),
				columns : [new Ext.grid.RowNumberer(), {
							header : "规则标识",
							width : 58,
							sortable : true,
							dataIndex : 'RULE_ID'
						}, {
							header : "规则备注",
							width : 153,
							dataIndex : 'RULE_REMARK'
						}, {
							header : "源KPI",
							width : 153,
							dataIndex : 'SOURCE_KPI_NAME'
						}, {
							header : "目标KPI",
							width : 150,
							dataIndex : 'DESTINATION_KPI_NAME'
						}, {
							header : "关联SQL语句",
							width : 80,
							dataIndex : 'CORRELATION_SQL'
						}, {
							header : "创建时间",
							width : 120,
							dataIndex : 'CREATE_TIME'
						}, {
							header : "修改时间",
							width : 120,
							dataIndex : 'LAST_MODIFY_TIME'
						}],
				tbar : [{
							text : "新增规则",
							iconCls : "icon-add",
							handler : function() {
								addRule(RuleGlobal.grid)
							}
						}, {
							text : "修改",
							iconCls : "icon-edit",
							handler : function() {
								editRule(RuleGlobal.grid)
							}
						}, {
							text : "删除",
							iconCls : "icon-del",
							handler : function() {
								delRule(RuleGlobal.grid)
							}
						}, '->', {
							text : "查看历史",
							iconCls : "icon-grid",
							handler : function() {
								showHistory(RuleGlobal.grid)
							}
						}],
				listeners : {
					rowdblclick : {
						fn : function() {
							editRule(RuleGlobal.grid)
						},
						scope : this
					}
				},
				region : 'center',
				// frame : true,
				border : true,
				height : 368,
				animCollapse : false,
				loadMask : true,
				// title : '告警根原因通用规则',
				iconCls : 'icon-grid'
			})
	RuleGlobal.grid.search = function(param) {
		if (param)
			RuleGlobal.grid.getStore().reload({
						params : param
					});
		else
			RuleGlobal.grid.getStore().reload();
	}
	var cfgSrcStore = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [['0SA', '直接配置'], ['0SB', 'CSK配置']]
			});
	var clsMethodStore = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [['0SA', '根告警出现时关联清除派生告警'], ['0SB', '根告警清除时关联清除派生告警'],
						['0SC', '根告警清除时不关联清除派生告警']]
			});
	RuleGlobal.groupForm = new Ext.FormPanel({
				region : 'center',
				labelAlign : 'left',
				// title : '规则信息',
				iconCls : 'icon-view',
				bodyStyle : 'padding:3px',
				labelSeparator : '：',
				frame : true,
				labelWidth : 80,
				items : [{
							layout : 'column',
							border : false,
							labelSeparator : '：',
							items : [{
										width : 586,
										layout : 'form',
										border : false,
										items : [{
													xtype : 'hidden',
													name : 'groupId'
												}, {
													style : 'padding-top:5px',
													xtype : 'textfield',
													fieldLabel : '规则名称',
													allowBlank : false,
													name : 'ruleName',
													anchor : '100%'
												}]
									}]
						}, {
							layout : 'column',
							border : false,
							labelSeparator : '：',
							items : [{
										width : 300,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textfield',
													fieldLabel : '时间窗口',
													// allowBlank : false,
													vtype : 'number',
													name : 'timeRange',
													anchor : '95%'
												}]
									}, {
										width : 300,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'combo',
													fieldLabel : '事件关闭方式',
													displayField : 'text',
													valueField : 'value',
													triggerAction : 'all',
													editable : false,
													allowBlank : false,
													store : clsMethodStore,
													mode : 'local',
													hiddenName : 'closeMethod',
													name : 'closeMethod',
													anchor : '96%'
												}]
									}]
						}, {
							layout : 'column',
							border : false,
							labelSeparator : '：',
							items : [{
										width : 873,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textarea',
													fieldLabel : '备注',
													vtype : 'strLength',
													// allowBlank : false,
													name : 'remark',
													height : 60,
													anchor : '100%'
												}]
									}]
						}, {
							layout : 'column',
							border : false,
							// width : 510,
							labelSeparator : '：',
							items : [RuleGlobal.grid]
						}]
			});
	RuleGlobal.groupWin = new Ext.Window({
				layout : 'border',
				title : '新增规则',
				width : 906,
				height : 560,
				iconCls : 'icon-add',
				closeAction : 'hide',
				plain : true,
				items : [RuleGlobal.groupForm],
				listeners : {
					show : function() {
						RuleGlobal.groupGrid.getEl().mask();
					},
					hide : function() {
						RuleGlobal.groupGrid.getEl().unmask();
					}
				},
				tbar : [{
							text : '保存',
							iconCls : 'icon-save',
							handler : function() {
								saveGroup();
							}
						}, {
							text : '确定',
							iconCls : 'icon-apply',
							handler : function() {
								saveGroup();
								RuleGlobal.groupWin.hide();
							}
						}, {
							text : '关闭',
							iconCls : 'icon-undo',
							handler : function() {
								RuleGlobal.groupWin.hide();
							}
						}]
			});
}

function saveGroup(isShowRuleWin, grid) {
	if (RuleGlobal.groupForm.form.isValid()) {
		RuleGlobal.groupForm.form.submit({
					url : RuleGlobal.url+"43",
					success : function(f, a) {
						var gId = a.result.groupId;
						if (gId) {
							RuleGlobal.groupForm.form.findField("groupId")
									.setValue(gId);
						}
						showMessageBox("提示", "保存成功！", Ext.Msg.OK);
						RuleGlobal.groupGrid.getStore().reload();
						if (isShowRuleWin)
							showAddRule(grid);

					},
					failure : function(f, a) {
						showMessageBox("提示",
								"保存失败！<br>错误原因：" + a.result.errmsg,
								Ext.Msg.ERROR);
					}
				});
		return true;
	} else {
		showMessageBox("提示", "请完成必填项！", Ext.Msg.INFO);
		return false;
	}
}

function NeIdObj() {
	this.value;
	this.text;
	this.neTypeId;
}

function KPISelectObj() {
	this.moduleSet = new Array();
	this.moduleFlag = "";
	this.busiClassSet = new Array();
	this.busiClassFlag = "";
	this.dataTypeSet = new Array();
	this.dataTypeFlag = "";
	this.kpiSet = new Array();
	this.kpiFlag = "";
	this.neidObj = new NeIdObj();
	this.if_appsys = ""; // 是否只选择业务系统KPI
	this.ne_msg_type = ""; // 消息类型
	this.ifGetKpiValue = false; // 时候也要获取KPI 值
}

// 选择KPI时候返回的对象
function ReturnObject() {
	this.name = "";
	this.value = "";
	this.kpi_value;
	this.key = "";
}

function selectSubmitKPI(src) {
	var if_appsys, ci_class_id, ne_msg_type;
	if (src.getName() == "sourceKpiName") {
		var kpiNameField = RuleGlobal.ruleForm.getForm()
				.findField("sourceKpiName");
		var kpiIdField = RuleGlobal.ruleForm.getForm().findField("sourceKpi");
	} else {
		var kpiNameField = RuleGlobal.ruleForm.getForm()
				.findField("destinationKpiName");
		var kpiIdField = RuleGlobal.ruleForm.getForm()
				.findField("destinationKpi");
	}
	if (ne_msg_type == null) {
		ne_msg_type = "20";
	}
	if (if_appsys == null) {
		if_appsys = "";
	}
	var kpiselectobj = new KPISelectObj();
	kpiselectobj.selectOneOnly = 1;
	kpiselectobj.ifGetKpiValue = true;
	kpiselectobj.if_appsys = if_appsys;
	var params = new Array();
	params.push(window);
	params.push(ci_class_id);
	params.push(ne_msg_type);
	params.push(kpiselectobj);
	var returnObj = window
			.showModalDialog("../alarm/KPISelect.html", params,
					"resizable=yes;dialogWidth=800px;dialogHeight=600px;help=0;scroll=1;status=0;");
	if (returnObj != null) {
		kpiNameField.setValue(returnObj.name);
		kpiIdField.setValue(returnObj.value);
	}
}

function showMessageBox(title, errMsg, ico) {
	var boxWidth = (errMsg.length * 12) + 90;
	if (boxWidth > 600) {
		boxWidth = 600;
	}
	Ext.MessageBox.show({
				title : title,
				msg : errMsg,
				buttons : Ext.Msg.OK,
				width : boxWidth,
				icon : ico
			});
}

function resetForm(form) {
	if (form != null) {
		form.getForm().items.each(function(item, index, length) {
					if (item.isXType("combo")) {
						item.clearValue();
					} else {
						item.setRawValue();
					}
					if (item.items && item.items.getCount() > 0) {
						item.items.each(eachItem, this);
					}
				}, this);
	} else {
		RuleGlobal.hisGrid.getStore().removeAll();
		RuleGlobal.ruleForm.getForm().items.each(function(item, index, length) {
					if (item.isXType("combo")) {
						item.clearValue();
					} else {
						item.setRawValue();
					}
					if (item.items && item.items.getCount() > 0) {
						item.items.each(eachItem, this);
					}
				}, this);
	}
}

function createHisForm() {
	var cfgSrcStore = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [['0SA', '直接配置'], ['0SB', 'CSK配置']]
			});
	var clsMethodStore = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [['0SA', '关联上根告警时关联告警自动清除'], ['0SB', '根告警清除时关联告警自动清除'],
						['0SC', '根告警清除时关联告警不做清除']]
			});
	RuleGlobal.hisForm = new Ext.FormPanel({
				region : 'center',
				labelAlign : 'left',
				bodyStyle : 'padding:3px',
				labelSeparator : '：',
				frame : true,
				labelWidth : 80,
				items : [{
							layout : 'column',
							border : false,
							labelSeparator : '：',
							items : [{
										width : 260,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textfield',
													fieldLabel : '规则标识',
													disabled : true,
													name : 'ruleId',
													anchor : '95%'
												}]
									}, {
										width : 260,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textfield',
													fieldLabel : '最新版本标识',
													disabled : true,
													name : 'headRevision',
													anchor : '96%'
												}]
									}]
						}, {
							layout : 'column',
							border : false,
							labelSeparator : '：',
							items : [{
										width : 510,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textfield',
													fieldLabel : '规则名称',
													name : 'ruleName',
													anchor : '100%'
												}]
									}]
						}, {
							layout : 'column',
							border : false,
							labelSeparator : '：',
							items : [{
										width : 260,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textfield',
													fieldLabel : '时间窗口',
													readOnly : true,
													name : 'timeRange',
													anchor : '95%'
												}]
									}, {
										width : 260,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'combo',
													fieldLabel : '事件关闭方式',
													displayField : 'text',
													valueField : 'value',
													triggerAction : 'all',
													editable : false,
													store : clsMethodStore,
													mode : 'local',
													name : 'closeMethod',
													anchor : '96%'
												}]
									}]
						}, {
							layout : 'column',
							border : false,
							labelSeparator : '：',
							items : [{
										width : 260,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textfield',
													fieldLabel : '来源KPI',
													readOnly : true,
													name : 'sourceKpiName',
													anchor : '95%'
												}, {
													xtype : 'hidden',
													name : 'sourceKpi'
												}]
									}, {
										width : 260,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textfield',
													fieldLabel : '目标KPI',
													readOnly : true,
													name : 'destinationKpiName',
													anchor : '96%'
												}, {
													xtype : 'hidden',
													name : 'destinationKpi'
												}]
									}]
						}, {
							layout : 'column',
							border : false,
							labelSeparator : '：',
							items : [{
										width : 510,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textarea',
													fieldLabel : '关联限制SQL',
													readOnly : true,
													name : 'correlationSql',
													height : 180,
													anchor : '100%'
												}]
									}]
						}, {
							layout : 'column',
							border : false,
							labelSeparator : '：',
							items : [{
										width : 510,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textarea',
													fieldLabel : '备注',
													readOnly : true,
													name : 'ruleRemark',
													height : 90,
													anchor : '100%'
												}]
									}]
						}]
			});
	RuleGlobal.hisWin = new Ext.Window({
				layout : 'border',
				title : '查看历史版本',
				width : 560,
				height : 516,
				closeAction : 'hide',
				plain : true,
				items : [RuleGlobal.hisForm],
				listeners : {
					show : function() {
						// g.getEl().mask();
					},
					hide : function() {
						// g.getEl().unmask();
					}
				}
			});
}

function createSqlWin() {
	RuleGlobal.sqlForm = new Ext.FormPanel({
				region : 'center',
				labelAlign : 'left',
				iconCls : 'icon-view',
				bodyStyle : 'padding:3px',
				labelSeparator : '：',
				frame : true,
				labelWidth : 80,
				items : [{
							layout : 'column',
							border : false,
							labelSeparator : '：',
							items : [{
										width : 410,
										layout : 'form',
										border : false,
										items : [{
													xtype : 'hidden',
													name : 'sqlId'
												}, {
													style : 'padding-top:5px',
													xtype : 'textfield',
													fieldLabel : 'SQL语句名称',
													allowBlank : false,
													name : 'sqlName',
													anchor : '100%'
												}]
									}]
						}, {
							layout : 'column',
							border : false,
							labelSeparator : '：',
							items : [{
										width : 410,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textarea',
													fieldLabel : 'SQL语句内容',
													allowBlank : false,
													// vtype : 'strLength',
													// allowBlank : false,
													name : 'correlationSql',
													height : 186,
													anchor : '100%'
												}]
									}]
						}]
			});

	RuleGlobal.sqlWin = new Ext.Window({
				layout : 'border',
				title : '编辑SQL语句',
				width : 450,
				height : 295,
				iconCls : 'icon-add',
				closeAction : 'hide',
				plain : true,
				items : [RuleGlobal.sqlForm],
				listeners : {
					show : function() {
						// g.getEl().mask();
					},
					hide : function() {
						// g.getEl().unmask();
					}
				},
				tbar : [{
					text : '确定',
					id : 'btnSave',
					iconCls : 'icon-save',
					handler : function() {
						RuleGlobal.sqlForm.form.submit({
									url : RuleGlobal.url+"46",
									success : function(f, a) {
										var sId = a.result.sqlId;
										showMessageBox("提示", "保存成功！",
												Ext.Msg.OK);
										RuleGlobal.ruleForm.form
												.findField("sqlId").getStore()
												.reload();
										RuleGlobal.sqlWin.hide();
									},
									failure : function(f, a) {
										showMessageBox("提示", "保存失败！<br>错误原因："
														+ a.result.errmsg,
												Ext.Msg.ERROR);
									}
								});
					}
				}, {
					text : '关闭',
					iconCls : 'icon-undo',
					handler : function() {
						RuleGlobal.sqlWin.hide();
					}
				}]
			});
}

function getRuleData(ruleId) {
	var prefix = "r-";
	var objName = prefix + ruleId;
	if (RuleGlobal.ruleDatas == null)
		RuleGlobal.ruleDatas = {};
	return RuleGlobal.ruleDatas[objName];
}

function setRuleData(ruleId, value) {
	var prefix = "r-";
	var objName = prefix + ruleId;
	if (RuleGlobal.ruleDatas == null)
		RuleGlobal.ruleDatas = {};
	RuleGlobal.ruleDatas[objName] = value;
}

function renderCloseMethod(value, p, record) {
	var c = [['0SA', '关联上根告警时关联告警自动清除'], ['0SB', '根告警清除时关联告警自动清除'],
			['0SC', '根告警清除时关联告警不做清除']];
	for (var i = 0; i < c.length; i++) {
		if (c[i][0] == "0SA")
			return c[i][1];
	}
}

function showHisWin(row) {
	if (!RuleGlobal.hisForm) {
		createHisForm();
	} else {
		resetForm(RuleGlobal.hisForm);
	}
	if (row) {
		var rowObj = {
			ruleId : row.get("ruleId"),
			headRevision : row.get("ruleRevisionId"),
			ruleName : row.get("ruleName"),
			ruleRemark : row.get("ruleRemark"),
			closeMethod : row.get("closeMethod"),
			sourceKpiName : row.get("sourceKpi"),
			destinationKpiName : row.get("destinationKpi"),
			timeRange : row.get("timeRange"),
			correlationSql : row.get("correlationSql"),
			ruleId : row.get("ruleId")
		};
		var form = RuleGlobal.hisForm.form;
		for (k in rowObj) {
			var val = rowObj[k];
			var field = form.findField(k);
			if (field) {
				field.setValue(val);
			}
		}
		RuleGlobal.hisWin.show();

		var cliWidth = document.body.clientWidth;
		var cliHeight = document.body.clientHeight;
		var sumWinWidth = RuleGlobal.ruleWin.width + RuleGlobal.hisWin.width;
		var ruleX = (cliWidth - sumWinWidth) / 2;
		var ruleY = (cliHeight - RuleGlobal.hisWin.height) / 2;
		RuleGlobal.ruleWin.setPagePosition(ruleX, ruleY);
		RuleGlobal.hisWin.setPagePosition(RuleGlobal.ruleWin.width + ruleX,
				ruleY);
		RuleGlobal.ruleTabPanel.setActiveTab(0);
	}
}