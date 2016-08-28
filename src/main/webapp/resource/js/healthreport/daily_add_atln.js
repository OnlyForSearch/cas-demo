Ext.namespace("daily.ck.addatln");
Ext.BLANK_IMAGE_URL = '../../resource/js/ext/resources/images/default/s.gif';
daily.ck.addatln.centerPanel = function(config) {
	this.submitTime = new Ext.form.TextField({
				value : new Date(),
				readOnly : true
			})
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
							labelAlign : 'right',
							hideBorders : true,
							items : [new Ext.form.DateField({
										fieldLabel : '填写时间:',
										value : new Date(),
										labelSeparator : '',
										name : 'submitTime',
										format:'Y-m-d',
										width:130,
										readOnly : true
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
										value : '',
										name : 'deviceName',
										width:150,
										labelSeparator : ''
									})]
						})]
			})

	this.secondPanel = new Ext.FormPanel({
		align : 'center',
		style : 'margin:10,10,10,30',
		layout : 'column',
		width:'800',
		border : false,
		items : [new Ext.Panel({
			layout : 'form',
			columnWidth : 1,
			labelWidth:60,
			labelPad:1,
			labelAlign : 'right',
			items : [new Ext.form.TextArea({
				fieldLabel : "备份内容:<br><span style='color:red'>(<200汉字)</span>",
				value : '',
				labelSeparator : '',
				name : 'atlnContent',
				anchor : '82%',
				height : 120,
				labelAlign : 'left'
			})]
		})]
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
			items : [new Ext.form.ComboBox({
				store : new Ext.data.Store({
							proxy : new Ext.data.HttpProxy({
										url : '../../servlet/healthRptAction?action=52'
									}),
							reader : new Ext.data.JsonReader({
										root : 'atlnClass'
									}, ['code', 'mean'])
						}),
				fieldLabel : '备份等级',
				displayField : 'mean',
				valueField : 'code',
				editable : false,
				mode : 'remote',
				width : 80,
				triggerAction : 'all',
				emptyText : '请选择',
				name : 'atlnClass'
			})]
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
									value : new Date(),
									editable : false,
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
									editable : false,
									mode : 'local',
									triggerAction : 'all',
									value : '00',
									triggerAction : 'all',
									selectOnFocus : true,
									width : 60,
									name : 'startTimeM'
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
									editable : false,
									mode : 'local',
									triggerAction : 'all',
									value : '59',
									triggerAction : 'all',
									selectOnFocus : true,
									width : 60,
									name : 'startTimeS'
								}), new Ext.form.Label({
									html : '&nbsp;&nbsp;开始&nbsp;&nbsp;  '
								}), new Ext.form.DateField({
									value : new Date(),
									editable : false,
									format : 'Y-m-d',
									name : 'endTimeD'

								}), new Ext.form.ComboBox({
									store : new Ext.data.SimpleStore({
												fields : ['ck_code', 'ck_name'],
												data : minuteArray
											}),
									displayField : 'ck_name',
									valueField : 'ck_code',
									typeAhead : true,
									editable : false,
									mode : 'local',
									triggerAction : 'all',
									value : '00',
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
									editable : false,
									mode : 'local',
									triggerAction : 'all',
									value : '59',
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
		width:'800',
		items : [new Ext.Panel({
			layout : 'form',
//			columnWidth : 1,
			labelWidth:60,
			labelPad:1,
			items : [new Ext.form.TextArea({
				fieldLabel : "结果和说明:<br>(<span style='color:red'><200汉字</span>)",
				value : '',
				labelSeparator : '',
				anchor:'82%',
				height : 130,
				labelAlign : 'left',
				name : 'atlnIdea'
			})]
		})]
	})
	daily.ck.addatln.centerPanel.superclass.constructor.call(this, {
				border : false,
				layout : 'form',
				region : 'center',
				autoHeight : true,
				width:800,
				frame : true,
				buttonAlign : 'center',
				items : [this.firstRowPanel, this.secondPanel,
						this.thirdRowPanel, this.fouthRowPanel,
						this.fiveRowPanel],
				buttons : [{
							text : '确定',
							handler : this.addAtlnFn,
							scope : this
						}, {
							text : '取消',
							handler : function() {
								window.close();
							}
						}]
			});
}
Ext.extend(daily.ck.addatln.centerPanel, Ext.Panel, {
	addAtlnFn : function() {
		var params ={};
		// 验证
		var submitTime = this.firstRowPanel.getForm().getValues().submitTime;
		var now =new Date();
		if(submitTime>now.format("Y-m-d").toString())
		{
			Ext.MessageBox.alert('提示', '填写时间不能比现在时间晚!');
			return;
		}
		var deviceName = this.firstRowPanel.getForm().getValues().deviceName;
		if (deviceName == '') {
			Ext.MessageBox.alert('提示', '设备名称必须填写!');
			return;
		}
		if(deviceName.length>83)
		{
			Ext.MessageBox.alert('提示', '设备名称过长!');
			return;
		}
		params.deviceName=encodeURIComponent(deviceName);
		var atlnContent = this.secondPanel.getForm().getValues().atlnContent;
		if(atlnContent==null||atlnContent=='')
		{
			Ext.MessageBox.alert('提示', '备份内容不能为空!');
			return;
		}
		if (atlnContent.length > 200) {
			Ext.MessageBox.alert('提示', '备份内容过长!');
			return;
		}
		params.atlnContent=encodeURIComponent(atlnContent);
		var atlnClass = this.thirdRowPanel.getForm().findField('atlnClass').getValue();;
		if (atlnClass == '' || atlnClass == '请选择') {
			Ext.MessageBox.alert('提示', '备份等级必填!');
			return;
		}
		params.atlnClass=atlnClass;
		var fouthPanelValues = this.fouthRowPanel.getForm().getValues();
		var startTime = fouthPanelValues.startTimeD + " "
				+ fouthPanelValues.startTimeM + ":"
				+ fouthPanelValues.startTimeS;
		var endTime = fouthPanelValues.endTimeD + " "
				+ fouthPanelValues.endTimeM + ":" + fouthPanelValues.endTimeS;
		if (!(this.checkTime(startTime, endTime))) {
			Ext.MessageBox.alert('提示', '结束时间不能比开始时间早!');
			return;
		}
		
		params.startTime=startTime;
		params.submitTime = submitTime;
		params.endTime=endTime;
		var atlnIdea = this.fiveRowPanel.getForm().getValues().atlnIdea;
		if(atlnIdea==null||atlnIdea=='')
		{
			Ext.MessageBox.alert('提示', '结果和说明不能为空!');
			return;
		}
		if (atlnIdea.length > 200) {
			Ext.MessageBox.alert('提示', '结果和说明内容过长!');
			return;
		}
		params.atlnIdea=encodeURIComponent(atlnIdea);
		params.action=53;
		//提交
		Ext.Ajax.request({
			url:'../../servlet/healthRptAction?',
			params:params,
			method:'post',
			success:function(response)
			{
				if(response.responseText=='true')
				{
					Ext.MessageBox.alert('提示',' 添 加 成 功!',function(select){
						if(select=='ok')
						{
							window.close();
						}
					});

				}else
				{
					Ext.MessageBox.show({
					title : '系统提示',
					msg : '添加失败,请重试!',
					autoWidth:true,
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
				items : [this.titlePanel, this.centerPanel]
			});
}
Ext.extend(daily.ck.addatln.addatlnPanel, Ext.Panel, {

});

function initLoad() {
	
	var w = window.screen.width - 45;
	var h = window.screen.height - 85;
	var params = window.dialogArguments;
	params.staffName = getSubmitPerson();
	addatlnPanel = new daily.ck.addatln.addatlnPanel(params);

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
					//bodyStyle:"margin-left:100",//padding-left:20%;
					y : 0,
					width : 1000,// 1000,//(Ext.getBody().getSize().width -50),
					height : 650,// 650,// (Ext.getBody().getSize().height-25),
					constrain : true,
					items : [addatlnPanel]
				});
			
	}
	
	win.show();
	
}
function getSubmitPerson() {
	var submitPerson = "";
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var queryUrl = '../../servlet/healthRptAction?';
	xmlhttp.Open("POST", queryUrl + "action=18", false);
	xmlhttp.send();
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		var responseRoot = Ext.util.JSON.decode(xmlhttp.responseText);
		submitPerson = responseRoot.staffName;
	}

	return submitPerson;
}
