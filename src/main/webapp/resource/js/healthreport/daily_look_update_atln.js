Ext.namespace("daily.ck.addatln");
Ext.BLANK_IMAGE_URL = '../../resource/js/ext/resources/images/default/s.gif';
daily.ck.addatln.centerPanel = function(config) {
	var minuteArray = new Array();
	var secendArray = new Array();
	for (var i = 0; i <= 5; i++) {
		for (var j = 0; j <= 9; j++) {
			var temp = [i + "" + j, i + "" + j];
			secendArray.push(temp);
		}
	}
	for (var i = 0; i <= 2; i++) {
		if (i != 2) {
			for (var j = 0; j <= 9; j++) {
				var temp = [i + "" + j, i + "" + j];
				minuteArray.push(temp);
			}
		} else {
			for (var k = 0; k <= 4; k++) {
				var temp = [i + "" + k, i + "" + k];
				minuteArray.push(temp);
			}
		}
	}
	var startTimeObj = this.getTimeInfo(config.tartTime);
	var endTimeObj = this.getTimeInfo(config.endTime);
	this.dailyAtlnInstanceId = config.dailyAtlnInstanceId;
	var verify_timeObj = this.getTimeInfo(config.verify_time);
	this.firstRowPanel = new Ext.form.FormPanel({
				align : 'center',
				style : 'margin:10,10,10,30',
				layout : 'column',
				width:'800',
				border : true,
				items : [new Ext.Panel({
									layout : 'form',
									columnWidth : 0.3,
									labelWidth:60,
									labelPad:1,
									hideBorders : true,
									items : [new Ext.form.DateField({
												fieldLabel : '填写时间:',
												value : new Date(Date.parse(config.submiTime.replace(/-/g,"/"))),
												labelSeparator : '',
												name : 'submitTime',
												format:'Y-m-d',
												width:130,
												labelAlign : 'right',
												readOnly : true,
												disabled : config.type
											})]
								}), new Ext.Panel({
									layout : 'form',
									columnWidth : 0.25,
									labelWidth:50,
									labelPad:1,
									items : [new Ext.form.TextField({
												fieldLabel : '填写人:',
												value : config.staffName,
												labelSeparator : '',
												name : 'subPerson',
												labelAlign : 'left',
												width:100,
												readOnly : true
											})]
								}), new Ext.Panel({
									layout : 'form',
									columnWidth : 0.45,
									labelWidth:60,
									labelPad:1,
									items : [new Ext.form.TextField({
												fieldLabel : '设备名称:',
												value : config.deviceName,
												name : 'deviceName',
												labelSeparator : '',
												width:150,
												labelAlign : 'left',
												disabled : config.type
											})]
								})]
			})

	this.secondPanel = new Ext.FormPanel({
		align : 'center',
		style : 'margin:10,10,10,30',
		layout : 'column',
		border : false,
		items : [new Ext.Panel({
			layout : 'form',
			columnWidth : 1,
			labelWidth:60,
			labelPad:1,
			labelAlign : 'right',
			items : [new Ext.form.TextArea({
				fieldLabel : "备份内容:<br>(<span style='color:red'><200汉字</span>)",
				value : config.atlnContent,
				labelSeparator : '',
				name : 'atlnContent',
				anchor : '91%',
				height : 120,
				labelAlign : 'left'
			})]
		})]
	})
	var atlnClassCombo = new Ext.form.ComboBox({
				store : new Ext.data.Store({
							proxy : new Ext.data.HttpProxy({
										url : '../../servlet/healthRptAction?action=52'
									}),
							reader : new Ext.data.JsonReader({
										root : 'atlnClass'
									}, ['mean', 'code']),
							listeners : {
								load : function() {
									atlnClassCombo.setValue(config.atlnClass);
								}
							},
							autoLoad : true

						}),
				fieldLabel : '备份等级',
				displayField : 'mean',
				valueField : 'code',
				editable : false,
				mode : 'remote',
				width : 80,
				disabled : config.type,
				triggerAction : 'all',
				emptyText : '请选择',
				// value : config.atlnClass,
				name : 'atlnClass'
			})
	this.thirdRowPanel = new Ext.FormPanel({
				align : 'center',
				style : 'margin:10,10,10,30',
				width : 400,
				layout : 'column',
				border : false,
				items : [new Ext.Panel({
							layout : 'form',
							columnWidth : 0.5,
							labelWidth:60,
							labelPad:1,
							items : [atlnClassCombo]
						})]
			})
	this.fouthRowPanel = new Ext.FormPanel({
				align : 'center',
				style : 'margin:10,10,10,30',
				layout : 'column',
				border : false,
				items : [new Ext.form.Label({
									html : '备份时间:',
									style : 'margin:0,10,0,0'
								}), new Ext.form.DateField({
									value : startTimeObj.YMD,
									disabled : config.type,
									format : 'Y-m-d',
									name : 'startTimeD'

								}), new Ext.form.ComboBox({
									store : new Ext.data.SimpleStore({
												fields : ['ck_code', 'ck_name'],
												data : minuteArray
											}),
									displayField : 'ck_name',
									valueField : 'ck_code',
									typeAhead : true,
									disabled : config.type,
									mode : 'local',
									triggerAction : 'all',

									triggerAction : 'all',
									selectOnFocus : true,
									width : 60,
									name : 'startTimeM',
									value : startTimeObj.M
								}), new Ext.form.Label({
									html : '&nbsp;&nbsp;:&nbsp;&nbsp;',
									columnWidth : 0.05
								}), new Ext.form.ComboBox({
									store : new Ext.data.SimpleStore({
												fields : ['ck_code', 'ck_name'],
												data : secendArray
											}),
									displayField : 'ck_name',
									valueField : 'ck_code',
									typeAhead : true,
									disabled : config.type,
									mode : 'local',
									triggerAction : 'all',
									value : startTimeObj.S,
									triggerAction : 'all',
									selectOnFocus : true,
									width : 60,
									name : 'startTimeS'
								}), new Ext.form.Label({
									html : '&nbsp;&nbsp;开始&nbsp;&nbsp;  '
								}), new Ext.form.DateField({
									value : new Date(),
									disabled : config.type,
									format : 'Y-m-d',
									name : 'endTimeD',
									value : endTimeObj.YMD

								}), new Ext.form.ComboBox({
									store : new Ext.data.SimpleStore({
												fields : ['ck_code', 'ck_name'],
												data : minuteArray
											}),
									displayField : 'ck_name',
									valueField : 'ck_code',
									typeAhead : true,
									disabled : config.type,
									mode : 'local',
									triggerAction : 'all',
									value : endTimeObj.M,
									triggerAction : 'all',
									selectOnFocus : true,
									width : 60,
									name : 'endTimeM'
								}), new Ext.form.Label({
									html : '&nbsp;&nbsp;:&nbsp;&nbsp;'
								}), new Ext.form.ComboBox({
									store : new Ext.data.SimpleStore({
												fields : ['ck_code', 'ck_name'],
												data : secendArray
											}),
									displayField : 'ck_name',
									valueField : 'ck_code',
									typeAhead : true,
									disabled : config.type,
									mode : 'local',
									triggerAction : 'all',
									value : endTimeObj.S,
									triggerAction : 'all',
									selectOnFocus : true,
									width : 60,
									name : 'endTimeS'
								}), new Ext.form.Label({
									html : '&nbsp;&nbsp;结束  '
								})]
			})
	this.fiveRowPanel = new Ext.FormPanel({
		align : 'center',
		style : 'margin:10,10,10,30',
		layout : 'column',
		border : false,
		items : [new Ext.Panel({
			layout : 'form',
			columnWidth : 1,
			labelWidth:60,
			labelPad:1,
			items : [new Ext.form.TextArea({
				fieldLabel : "结果和说明:<br>(<span style='color:red'><200汉字</span>)",
				value : config.atlnIdea,
				labelSeparator : '',
				anchor : '91%',
				height : 100,
				labelAlign : 'left',
				name : 'atlnIdea'
			})]
		})]
	})
	this.checkPanel = new Ext.Panel({
				layout : 'form',
				labelWidth:50,
				labelAlign:'right',
				labelPad:1,
				items : [new Ext.Panel({
							layout : 'column',
							items : [new Ext.form.Label({
												text : '审核人:',
												style : 'margin:0,13,0,0'
											}), new Ext.form.TextField({
												columnWidth : 0.13,
												disabled : true,
												value : config.verify_person
											}), new Ext.form.Label({
												html : '&nbsp;&nbsp;'
											}), new Ext.form.Label({
												text : '审核时间:',
												columnWidth : 0.12
											}), new Ext.form.TextField({
												columnWidth : 0.16,
												disabled : true,
												value : config.verify_time
											}), new Ext.form.Label({
												html : '&nbsp;&nbsp;'
											}), new Ext.form.Label({
												text : '审核状态:'
											}), new Ext.form.Label({
												html : '&nbsp;&nbsp;&nbsp;'
											}), new Ext.form.ComboBox({
												store : new Ext.data.SimpleStore(
														{
															fields : [
																	'ck_code',
																	'ck_name'],
															data : [
																	['1', '已审核'],
																	['0', '未审核']]
														}),
												fieldLabel : '状态',
												name : 'isChk',
												displayField : 'ck_name',
												valueField : 'ck_code',
												typeAhead : true,
												disabled : true,
												mode : 'local',
												triggerAction : 'all',
												selectOnFocus : true,
												columnWidth : 0.09,
												value : config.ischeck
											})]

						}), new Ext.Panel({
							height : 10
						}), new Ext.form.HtmlEditor({
					height : 130,
					sourceEditMode : false,
					anchor : '83%',
					fieldLabel : '    信息',
					value : config.verify_idea,
					enableSourceEdit : true,
					disabled : true,
					enableLinks : false, // 这是把链接的按钮去掉.
					enableLists : false, // 这是把list 排序给去掉,
					fontFamilies : ['宋体', '隶书', '黑体']

						// 字体列表
					})]
			})
	this.sixRowPanel = new Ext.FormPanel({
				align : 'center',
				style : 'margin:10,10,10,30',
				border : false,
				
				items : [new Ext.form.FieldSet({
							autoHeight : true,
							autoScroll : true,
							buttonAlign : 'left',
							width : 800,
							collapsible : true,
							title : '审核信息',
							items : [this.checkPanel]
						})]

			})

	daily.ck.addatln.centerPanel.superclass.constructor.call(this, {
				border : false,
				layout : 'form',
				region : 'center',
				autoHeight : true,
				frame : true,
				buttonAlign : 'center',
				items : [this.firstRowPanel, this.secondPanel,
						this.thirdRowPanel, this.fouthRowPanel,
						this.fiveRowPanel, this.sixRowPanel],
				buttons : [{
							text : config.btText,
							handler : this.updateAtlnFn,
							scope : this,
							changType : config.type,
							disabled : config.lookType
						}, {
							text : '取消',
							handler : function() {
								window.close();
							}
						}],
				listeners : {
					beforeadd : {
						fn : this.isAddSixPanel,
						scope : this
					}

				}
			});
}
Ext.extend(daily.ck.addatln.centerPanel, Ext.Panel, {
	isAddSixPanel : function(panel, addObj, index) {
		return true;
	},
	updateAtlnFn : function() {
		if (this.buttons[0].text == '确定') {
			window.close();
			return;
		}
		var params = {};
		var atlnContent = this.secondPanel.getForm().getValues().atlnContent;
		if (atlnContent == null || atlnContent == '') {
			Ext.MessageBox.show({
						title : '错误提示',
						msg : '备份内容必须填写!',
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.WARNING
					})
			return;
		}
		if (atlnContent.length > 200) {
			Ext.MessageBox.show({
						title : '错误提示',
						msg : '备份内容过长!',
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.WARNING
					})
			return;
		}
		params.atlnContent = encodeURIComponent(atlnContent);
		var atlnIdea = this.fiveRowPanel.getForm().getValues().atlnIdea;
		if (atlnIdea == null || atlnIdea == '') {

			Ext.MessageBox.show({
						title : '错误提示',
						msg : '结果和说明内容必须填写!',
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.WARNING
					})
			return;
		}
		if (atlnIdea.length > 200) {
			Ext.MessageBox.show({
						title : '错误提示',
						msg : '结果和说明内容过长!',
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.WARNING
					})
			return;
		}
		params.atlnIdea = encodeURIComponent(atlnIdea);
		if (!(this.buttons[0].changType))// 未审核
		{
			var submitTime = this.firstRowPanel.getForm().getValues().submitTime;
			var now =new Date();
			if(submitTime>now.format("Y-m-d").toString())
			{
				Ext.MessageBox.alert('提示', '填写时间不能比现在时间晚!');
				return;
			}
			var deviceName = this.firstRowPanel.getForm().getValues().deviceName;
			if (deviceName == '') {
				Ext.MessageBox.show({
							title : '错误提示',
							msg : '设备名称必须填写!',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.WARNING
						})
				return;
			}
			if (deviceName.length > 83) {
				Ext.MessageBox.show({
							title : '错误提示',
							msg : '设备名称过长!',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.WARNING
						})
				return;
			}
			params.deviceName = encodeURIComponent(deviceName);

			var atlnClass = this.thirdRowPanel.getForm().findField("atlnClass")
					.getValue();
			if (atlnClass == '' || atlnClass == '请选择') {
				Ext.MessageBox.show({
							title : '错误提示',
							msg : '备份等级必填!',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.WARNING
						})
				return;
			}
			params.atlnClass = atlnClass;
			var fouthPanelValues = this.fouthRowPanel.getForm().getValues();
			var startTime = fouthPanelValues.startTimeD + " "
					+ fouthPanelValues.startTimeM + ":"
					+ fouthPanelValues.startTimeS;
			var endTime = fouthPanelValues.endTimeD + " "
					+ fouthPanelValues.endTimeM + ":"
					+ fouthPanelValues.endTimeS;
			if (!(this.checkTime(startTime, endTime))) {
				
				Ext.MessageBox.show({
							title : '错误提示',
							msg : '结束时间不能比开始时间早!',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.WARNING
						})
				return;
			}
			params.startTime = startTime;
			params.submitTime = submitTime;
			params.endTime = endTime;
			params.action = 57;
		} else {
			params.action = 58;
		}
		params.dailyAtlnInstanceId = this.dailyAtlnInstanceId;
		// 提交
		Ext.Ajax.request({
					url : '../../servlet/healthRptAction?',
					params : params,
					method : 'post',
					success : function(response) {
						if (response.responseText == 'true') {
							Ext.MessageBox.alert('提示', ' 修 改 成 功!');
						} else {
							Ext.MessageBox.show({
										title : '系统提示',
										msg : '修改失败,请重试!',
										autoWidth : true,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					}

				})

	},
	checkTime : function(time1, time2) {
		var flag = true;
		var time1Array = time1.split(' ');
		var time2Array = time2.split(' ');
		var time1Date = time1Array[0].replace('-') + time1Array[1].replace(':');
		var time2Date = time2Array[0].replace('-') + time2Array[1].replace(':');
		if (time2Date < time1Date) {
			flag = false;
		}
		return flag;
	},
	getTimeInfo : function(timeStr) {
		var timeObj = {};
		if (timeStr == undefined || timeStr == '') {
			return timeObj;
		}

		var timeArray = timeStr.split(' ');
		timeObj.YMD = timeArray[0];

		timeObj.M = timeArray[1].split(':')[0];
		timeObj.S = timeArray[1].split(':')[1];
		return timeObj;

	}

});
daily.ck.addatln.addatlnPanel = function(config) {
	this.centerPanel = new daily.ck.addatln.centerPanel(config);
	this.titlePanel = new Ext.Panel({
		region : 'north',
		align : 'center',
		html : '<div style="width:100%"><table align="center"><tr><td align="center"><h3>'
				+ config.bigTitle + '</h3></td></tr></table></div>'
	})
	daily.ck.addatln.addatlnPanel.superclass.constructor.call(this, {
				hideBorders : true,
				layout : 'border',
				width : 800,
				frame : true,
				autoScroll : true,
				items : [this.titlePanel, this.centerPanel]
			});
}
Ext.extend(daily.ck.addatln.addatlnPanel, Ext.Panel, {

});

function initLoad() {

	//var w = window.screen.width - 45;
	var h = window.screen.height - 85;
	var params = window.dialogArguments;

	var addatlnPanel = new daily.ck.addatln.addatlnPanel(params);
	var win;
	if (!win) {
		win = new Ext.Window({
					//id : 'be-win',
					layout : 'fit',
					title : params.ptitle,
					iconCls : 'objectIco',
					collapsible : false,
					closable : false,
					draggable : false,
					resizable : false,
					modal : true,
					y : 0,
					width : 1000,// 1000,//(Ext.getBody().getSize().width -50),
					height : h,// 650,// (Ext.getBody().getSize().height-25),
					constrain : true,
					items : [addatlnPanel]
				});

	}
	win.show();
}
