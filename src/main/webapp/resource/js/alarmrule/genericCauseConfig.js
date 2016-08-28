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
			timeText : 'ʱ���ʽ����ȷ�����ӣ� "12:34:00 am".',
			// vtype Mask property: The keystroke filter mask
			timeMask : /[\d\s:amp]/i,

			number : function(val, field) {
				var v = /^\d+$/.test(val);
				if (!v)
					showMessageBox("��ʾ", "ֻ������������", Ext.Msg.INFO);
				return v;
			},
			numberText : 'ֻ����������.',
			packname : function(val, field) {
				return /^[a-zA-Z0-9_\.]*[a-zA-Z0-9_]*$/.test(val);
			},
			packnameText : 'ֻ������Ӣ����ĸ��"."',
			strLength : function(val, field) {
				if (val.length > 249)
					return false;
				else
					return true;
			},
			strLengthText : '���Ȳ��ܳ���250���ַ�'
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
							header : '�����ʶ',
							dataIndex : 'GROUP_ID',
							sortable : true,
							//menuDisabled : true,
							width : 80
						}, {
							header : '��������',
							dataIndex : 'RULE_NAME',
							sortable : true,
							menuDisabled : true,
							width : 260
						}, {
							header : 'ʱ�䴰��',
							dataIndex : 'TIME_RANGE',
							menuDisabled : true,
							sortable : true,
							width : 100
						}, {
							header : '�澯�رշ�ʽ',
							dataIndex : 'CLOSE_METHOD',
							renderer : renderCloseMethod,
							sortable : true,
							menuDisabled : true,
							width : 200
						}, {
							header : '��ע',
							dataIndex : 'REMARK',
							menuDisabled : true
							// width : 500
					}]),
				sm : new Ext.grid.RowSelectionModel({
							singleSelect : true
						}),
				autoScroll : true,
				tbar : [{
							text : "����",
							iconCls : "icon-add",
							handler : function() {
								addGroup();
							}
						}, {
							text : "�޸�",
							iconCls : "icon-edit",
							handler : function() {
								editGroup();
							}
						}, {
							text : "ɾ��",
							iconCls : "icon-del",
							handler : function() {
								delGroup();
							}
						}],
				bbar : new Ext.PagingToolbar({
							pageSize : 20,
							store : store,
							displayInfo : true,
							displayMsg : '��ʾ�����¼ {0} - {1} of {2}',
							emptyMsg : "û�й����¼"
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
				title : '�澯��ԭ��ͨ�ù�������',
				iconCls : 'icon-grid',
				loadMask : {
					msg : '����������...'
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
		showMessageBox("��ʾ", "������д���������Ϣ�������棡", Ext.Msg.INFO)
		return false;
	}
	var groupId = RuleGlobal.groupForm.form.findField("groupId");
	if (groupId.getValue() == null || groupId.getValue() == "") {
		Ext.Msg.confirm("��ʾ", "�����ϸ����ǰ���ȱ�����������Ϣ��������ǡ����Զ����棡", function(btn,
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
	RuleGlobal.ruleWin.setTitle("�����澯����");
	RuleGlobal.ruleWin.show();
	RuleGlobal.ruleWin.center();
	RuleGlobal.ruleTabPanel.setActiveTab(0);
}

function editRule(grid) {
	if (showRuleEdit(grid))
		RuleGlobal.ruleTabPanel.setActiveTab(0);
}

function delRule(grid) {
	Ext.MessageBox.confirm("��ʾ", "�Ƿ�ɾ��ѡ��Ĺ���", function(btn, text) {
				if (btn == "no")
					return false;
				var row = grid.getSelectionModel().getSelected();
				if (row) {
					var control = "del";
					var ruleId = row.get("RULE_ID");
					sendDel(ruleId);
				} else {
					showMessageBox("��ʾ", "����ѡ���¼��", Ext.Msg.INFO);
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
		RuleGlobal.ruleWin.setTitle("�޸ĸ澯����");
		RuleGlobal.ruleWin.show();
		RuleGlobal.ruleWin.center();
		// ������ʷ�汾
		RuleGlobal.hisGrid.getStore().reload({
					params : {
						ruleId : rowObj.ruleId
					}
				});
		return true;
	} else {
		showMessageBox("��ʾ", "����ѡ���¼��", Ext.Msg.INFO);
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
		showMessageBox("��ʾ", "����ɱ����", Ext.Msg.INFO);
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
		strMsg = "��ӳɹ���";
		rootRuleUrl = "../../servlet/alarmRuleCtrl.do?method=add";
	} else if (control == "edit") {
		strMsg = "�༭�ɹ���";
		rootRuleUrl = "../../servlet/alarmRuleCtrl.do?method=edit";
	} else {
		strMsg = "ɾ���ɹ���";
		rootRuleUrl = "../../servlet/alarmRuleCtrl.do?method=del";
	}
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", rootRuleUrl, false);
	oXMLHTTP.send(sendXml);
	if (isSuccess(oXMLHTTP)) {
		showMessageBox("��ʾ", strMsg, Ext.Msg.INFO);
		RuleGlobal.grid.search({
					groupId : groupId
				});
		RuleGlobal.ruleForm.form.reset();
		RuleGlobal.ruleWin.hide();
	}
}

function sendDel(ruleId) {
	var rootRuleUrl, strMsg;
	strMsg = "ɾ���ɹ���";
	rootRuleUrl = "../../servlet/alarmRuleCtrl.do?method=del" + "&id=" + ruleId;
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", rootRuleUrl, false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		showMessageBox("��ʾ", strMsg, Ext.Msg.INFO);
		RuleGlobal.grid.search({
					groupId : RuleGlobal.groupForm.form.findField("groupId")
							.getValue()
				});
	}
}

function createRuleForm() {
	var alarmLevelStore = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [['1', '���ظ澯(Critical)'],
						['2', '��Ҫ�澯(Major)'],['3', 'һ��澯(Minor)'],['4', '֪ͨ���¼���']]
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
		title : '������Ϣ',
		iconCls : 'icon-view',
		bodyStyle : 'padding:3px',
		labelSeparator : '��',
		frame : true,
		labelWidth : 80,
		items : [{
					layout : 'column',
					border : false,
					labelSeparator : '��',
					items : [{
								width : 260,
								layout : 'form',
								border : false,
								items : [{
											style : 'padding-top:5px',
											xtype : 'textfield',
											fieldLabel : '�����ʶ',
											disabled : true,
											// value : '�Զ�����',
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
											fieldLabel : '���°汾��ʶ',
											disabled : true,
											// value : '�Զ�����',
											name : 'headRevision',
											anchor : '96%'
										}]
							}]
				}, {
					layout : 'column',
					border : false,
					labelSeparator : '��',
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
											fieldLabel : '��ԴKPI',
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
											fieldLabel : '��Դ�澯����',
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
											fieldLabel : 'Ŀ��KPI',
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
											fieldLabel : 'Ŀ��澯����',
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
					labelSeparator : '��',
					items : [{
						width : 406,
						layout : 'form',
						border : false,
						items : [{
							style : 'padding-top:5px',
							xtype : 'combo',
							fieldLabel : '����SQL����',
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
						text : '����',
						handler : function() {
							if (!RuleGlobal.sqlWin)
								createSqlWin();
							resetForm(RuleGlobal.sqlForm);
							RuleGlobal.sqlWin.show();
						}
					}, {
						xtype : 'button',
						text : '�޸�',
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
								showMessageBox("��ʾ", "����ѡ��Ҫ�޸ĵĹ�������SQL",
										Ext.Msg.INFO)
							}
						}
					}, {
						xtype : 'button',
						text : 'ɾ��',
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
											showMessageBox("��ʾ", "��ѡ��Ŀɾ���ɹ���",
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
											showMessageBox("����",
													"ɾ��ʧ�ܣ�<br>����ԭ��"
															+ respText.errmsg,
													Ext.MessageBox.ERROR);
										}
									},
									failure : function(resp, opts) {
										var respText = Ext.util.JSON
												.decode(resp.responseText);
										showMessageBox("����", "ɾ��ʧ�ܣ�<br>����ԭ��"
														+ respText.errmsg,
												Ext.MessageBox.ERROR);
									}
								});
							} else {
								showMessageBox("��ʾ", "����ѡ��Ҫ�޸ĵĹ�������SQL",
										Ext.Msg.INFO)
							}
						}
					}]
				}, {
					layout : 'column',
					border : false,
					labelSeparator : '��',
					items : [{
								width : 510,
								layout : 'form',
								border : false,
								items : [{
											style : 'padding-top:5px',
											xtype : 'textarea',
											fieldLabel : '��������SQL',
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
					labelSeparator : '��',
					items : [{
								width : 510,
								layout : 'form',
								border : false,
								items : [{
											style : 'padding-top:5px',
											xtype : 'textarea',
											fieldLabel : '��ע',
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
				header : '�汾��ʶ',
				dataIndex : 'ruleRevisionId',
				menuDisabled : true,
				width : 100
			}, {
				header : '�޸���',
				dataIndex : 'lastModifier',
				menuDisabled : true,
				width : 100
			}, {
				header : '�޸�ʱ��',
				dataIndex : 'lastModifyTime',
				menuDisabled : true,
				width : 200
			}]);
	RuleGlobal.hisGrid = new Ext.grid.GridPanel({
				title : '�޸���ʷ',
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
				title : '��������',
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
							text : '����',
							id : 'btnSave',
							iconCls : 'icon-save',
							handler : ruleSave
						}, {
							text : '�ر�',
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
							showMessageBox("��ʾ", "��ѡ��Ŀɾ���ɹ���", Ext.MessageBox.OK);
							RuleGlobal.groupGrid.getStore().reload();
						} else {
							var respText = Ext.util.JSON
									.decode(resp.responseText);
							showMessageBox("����", "ɾ��ʧ�ܣ�<br>����ԭ��"
											+ respText.errmsg,
									Ext.MessageBox.ERROR);
						}
					},
					failure : function(resp, opts) {
						var respText = Ext.util.JSON.decode(resp.responseText);
						showMessageBox("����",
								"ɾ��ʧ�ܣ�<br>����ԭ��" + respText.errmsg,
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
							header : "�����ʶ",
							width : 58,
							sortable : true,
							dataIndex : 'RULE_ID'
						}, {
							header : "����ע",
							width : 153,
							dataIndex : 'RULE_REMARK'
						}, {
							header : "ԴKPI",
							width : 153,
							dataIndex : 'SOURCE_KPI_NAME'
						}, {
							header : "Ŀ��KPI",
							width : 150,
							dataIndex : 'DESTINATION_KPI_NAME'
						}, {
							header : "����SQL���",
							width : 80,
							dataIndex : 'CORRELATION_SQL'
						}, {
							header : "����ʱ��",
							width : 120,
							dataIndex : 'CREATE_TIME'
						}, {
							header : "�޸�ʱ��",
							width : 120,
							dataIndex : 'LAST_MODIFY_TIME'
						}],
				tbar : [{
							text : "��������",
							iconCls : "icon-add",
							handler : function() {
								addRule(RuleGlobal.grid)
							}
						}, {
							text : "�޸�",
							iconCls : "icon-edit",
							handler : function() {
								editRule(RuleGlobal.grid)
							}
						}, {
							text : "ɾ��",
							iconCls : "icon-del",
							handler : function() {
								delRule(RuleGlobal.grid)
							}
						}, '->', {
							text : "�鿴��ʷ",
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
				// title : '�澯��ԭ��ͨ�ù���',
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
				data : [['0SA', 'ֱ������'], ['0SB', 'CSK����']]
			});
	var clsMethodStore = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [['0SA', '���澯����ʱ������������澯'], ['0SB', '���澯���ʱ������������澯'],
						['0SC', '���澯���ʱ��������������澯']]
			});
	RuleGlobal.groupForm = new Ext.FormPanel({
				region : 'center',
				labelAlign : 'left',
				// title : '������Ϣ',
				iconCls : 'icon-view',
				bodyStyle : 'padding:3px',
				labelSeparator : '��',
				frame : true,
				labelWidth : 80,
				items : [{
							layout : 'column',
							border : false,
							labelSeparator : '��',
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
													fieldLabel : '��������',
													allowBlank : false,
													name : 'ruleName',
													anchor : '100%'
												}]
									}]
						}, {
							layout : 'column',
							border : false,
							labelSeparator : '��',
							items : [{
										width : 300,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textfield',
													fieldLabel : 'ʱ�䴰��',
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
													fieldLabel : '�¼��رշ�ʽ',
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
							labelSeparator : '��',
							items : [{
										width : 873,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textarea',
													fieldLabel : '��ע',
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
							labelSeparator : '��',
							items : [RuleGlobal.grid]
						}]
			});
	RuleGlobal.groupWin = new Ext.Window({
				layout : 'border',
				title : '��������',
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
							text : '����',
							iconCls : 'icon-save',
							handler : function() {
								saveGroup();
							}
						}, {
							text : 'ȷ��',
							iconCls : 'icon-apply',
							handler : function() {
								saveGroup();
								RuleGlobal.groupWin.hide();
							}
						}, {
							text : '�ر�',
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
						showMessageBox("��ʾ", "����ɹ���", Ext.Msg.OK);
						RuleGlobal.groupGrid.getStore().reload();
						if (isShowRuleWin)
							showAddRule(grid);

					},
					failure : function(f, a) {
						showMessageBox("��ʾ",
								"����ʧ�ܣ�<br>����ԭ��" + a.result.errmsg,
								Ext.Msg.ERROR);
					}
				});
		return true;
	} else {
		showMessageBox("��ʾ", "����ɱ����", Ext.Msg.INFO);
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
	this.if_appsys = ""; // �Ƿ�ֻѡ��ҵ��ϵͳKPI
	this.ne_msg_type = ""; // ��Ϣ����
	this.ifGetKpiValue = false; // ʱ��ҲҪ��ȡKPI ֵ
}

// ѡ��KPIʱ�򷵻صĶ���
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
				data : [['0SA', 'ֱ������'], ['0SB', 'CSK����']]
			});
	var clsMethodStore = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [['0SA', '�����ϸ��澯ʱ�����澯�Զ����'], ['0SB', '���澯���ʱ�����澯�Զ����'],
						['0SC', '���澯���ʱ�����澯�������']]
			});
	RuleGlobal.hisForm = new Ext.FormPanel({
				region : 'center',
				labelAlign : 'left',
				bodyStyle : 'padding:3px',
				labelSeparator : '��',
				frame : true,
				labelWidth : 80,
				items : [{
							layout : 'column',
							border : false,
							labelSeparator : '��',
							items : [{
										width : 260,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textfield',
													fieldLabel : '�����ʶ',
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
													fieldLabel : '���°汾��ʶ',
													disabled : true,
													name : 'headRevision',
													anchor : '96%'
												}]
									}]
						}, {
							layout : 'column',
							border : false,
							labelSeparator : '��',
							items : [{
										width : 510,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textfield',
													fieldLabel : '��������',
													name : 'ruleName',
													anchor : '100%'
												}]
									}]
						}, {
							layout : 'column',
							border : false,
							labelSeparator : '��',
							items : [{
										width : 260,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textfield',
													fieldLabel : 'ʱ�䴰��',
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
													fieldLabel : '�¼��رշ�ʽ',
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
							labelSeparator : '��',
							items : [{
										width : 260,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textfield',
													fieldLabel : '��ԴKPI',
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
													fieldLabel : 'Ŀ��KPI',
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
							labelSeparator : '��',
							items : [{
										width : 510,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textarea',
													fieldLabel : '��������SQL',
													readOnly : true,
													name : 'correlationSql',
													height : 180,
													anchor : '100%'
												}]
									}]
						}, {
							layout : 'column',
							border : false,
							labelSeparator : '��',
							items : [{
										width : 510,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textarea',
													fieldLabel : '��ע',
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
				title : '�鿴��ʷ�汾',
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
				labelSeparator : '��',
				frame : true,
				labelWidth : 80,
				items : [{
							layout : 'column',
							border : false,
							labelSeparator : '��',
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
													fieldLabel : 'SQL�������',
													allowBlank : false,
													name : 'sqlName',
													anchor : '100%'
												}]
									}]
						}, {
							layout : 'column',
							border : false,
							labelSeparator : '��',
							items : [{
										width : 410,
										layout : 'form',
										border : false,
										items : [{
													style : 'padding-top:5px',
													xtype : 'textarea',
													fieldLabel : 'SQL�������',
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
				title : '�༭SQL���',
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
					text : 'ȷ��',
					id : 'btnSave',
					iconCls : 'icon-save',
					handler : function() {
						RuleGlobal.sqlForm.form.submit({
									url : RuleGlobal.url+"46",
									success : function(f, a) {
										var sId = a.result.sqlId;
										showMessageBox("��ʾ", "����ɹ���",
												Ext.Msg.OK);
										RuleGlobal.ruleForm.form
												.findField("sqlId").getStore()
												.reload();
										RuleGlobal.sqlWin.hide();
									},
									failure : function(f, a) {
										showMessageBox("��ʾ", "����ʧ�ܣ�<br>����ԭ��"
														+ a.result.errmsg,
												Ext.Msg.ERROR);
									}
								});
					}
				}, {
					text : '�ر�',
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
	var c = [['0SA', '�����ϸ��澯ʱ�����澯�Զ����'], ['0SB', '���澯���ʱ�����澯�Զ����'],
			['0SC', '���澯���ʱ�����澯�������']];
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