Ext.namespace("bosswg.ipp");
Ext.LoadMask.prototype.msg = "数据载入中...";
Ext.BLANK_IMAGE_URL = '../../resource/js/ext-2.0.2/resources/images/default/s.gif';

bosswg.ipp.CreateMediaWin = function(config) {

	// Ext.apply(this, config);
	this.config = config;
	this.mediaType = new Ext.form.ComboBox({
				// name : "allowLogin",
				msgTarget : 'side',
				labelSeparator : '：',
				anchor : '90%',
				hiddenName : "state",
				fieldLabel : "媒体类型",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '短信'], ['0SB', '彩信'],
									['0SC', '邮件'], ['0SX', '未定义'],
									['0SD', '语音']]
						}),
				valueField : "value",
				displayField : "text",
				value : '0SA',
				mode : "local",
				triggerAction : "all",
				allowBlank : false,
				editable : false
			});
	this.mediaIp = new Ext.form.TextField({
				name : 'mediaIp',
				fieldLabel : '接入地址',
				style : 'margin-top:2px',
				maxLength : 48,
				maxLengthText : '接入地址长度不能超过50',
				anchor : '95%',
				labelSeparator : '：'
			})
	this.mediaPort = new Ext.form.TextField({
				name : 'mediaPort',
				fieldLabel : '接入端口',
				style : 'margin-top:2px',
				maxLength : 19,
				maxLengthText : '接入端口长度不能超过20',
				anchor : '90%',
				labelSeparator : '：'
			})
	this.inTimeout = new Ext.form.TextField({
				name : 'inTimeout',
				fieldLabel : '接入超时时长',
				regexText : '必须为正整数',
				regex : /^\d+$/,
				style : 'margin-top:2px',
				maxLength : 5,
				maxLengthText : '接入超时时长度不能超过5',
				anchor : '90%',
				labelSeparator : '：'
			})
	this.inUser = new Ext.form.TextField({
				name : 'inUser',
				fieldLabel : '接入用户',
				style : 'margin-top:2px',
				maxLength : 19,
				maxLengthText : '接入用户长度不能超过20',
				anchor : '90%',
				labelSeparator : '：'
			})
	this.inPass = new Ext.form.TextField({
				name : 'inPass',
				fieldLabel : '接入密码',
				style : 'margin-top:2px',
				maxLength : 19,
				maxLengthText : '接入密码长度不能超过20',
				anchor : '90%',
				labelSeparator : '：'
			})
	this.sendTimeOut = new Ext.form.TextField({
				name : 'sendTimeOut',
				fieldLabel : '发送超时时长',
				regexText : '必须为正整数',
				regex : /^\d+$/,
				style : 'margin-top:2px',
				maxLength : 5,
				maxLengthText : '长度不能超过5',
				anchor : '90%',
				labelSeparator : '：'
			})
	this.extConfig = new Ext.form.HtmlEditor({
				name : 'extConfig',
				height : 170,
				sourceEditMode : false,
				fieldLabel : '扩展配置信息',
				anchor : '95%',
				maxLength : 3800,
				maxLengthText : '长度不能超过4000',
				enableSourceEdit : true,
				enableLinks : false,
				enableLists : false,
				fontFamilies : ['宋体', '隶书', '黑体']
			})
	this.mediaForm = new Ext.FormPanel({
				labelWidth : 100,
				labelPad : 1,
				border : false,
				style : 'padding:2',
				frame : true,
				autoScroll : true,
				items : [{
					xtype : 'panel',// columnWidth:.30
					layout : 'column',
					items : [{
								columnWidth : .5,
								layout : 'form',
								items : [this.mediaType, this.inUser,
										this.mediaPort]
							}, {
								columnWidth : .5,
								layout : 'form',
								items : [this.sendTimeOut, this.inPass,
										this.inTimeout]
							}]

				}, this.mediaIp, this.extConfig]

			})
	bosswg.ipp.CreateMediaWin.superclass.constructor.call(this, {
				title : '业务系统信息',
				layout : 'fit',
				collapsible : false,
				closable : true,
				closeAction : 'close',
				iconCls : 'mediaList1',
				modal : true,
				roleId : '',
				draggable : true,
				layout : 'fit',
				resizable : false,
				// x:0,
				y : 10,
				width : 600,// (Ext.getBody().getSize().width -50),
				height : 380,// (Ext.getBody().getSize().height-25),
				// constrain : true,
				items : [this.mediaForm],
				buttonAlign : 'right',
				buttons : [{
							text : '保存',
							iconCls : 'queryAdd1',
							handler : this.onSaveMediaFn,
							scope : this
						}, {
							text : '退出',
							iconCls : 'closeWin',
							handler : function() {
								this.close()
							},
							scope : this
						}]
			});
	this.on('afterlayout', this.onAfterlayoutFn, this, {
				single : true
			});
	this.show();

}
Ext.extend(bosswg.ipp.CreateMediaWin, Ext.Window, {
	onAfterlayoutFn : function() {

		if (this.config.rd) {
			var data = this.config.rd;
			this.mediaType.setValue(data.MEDIA_TYPE);
			this.inUser.setValue(data.IN_USER);
			this.mediaPort.setValue(data.MEDIA_PORT);
			this.sendTimeOut.setValue(data.SEND_TIMEOUT);
			this.inPass.setValue(data.IN_PASS);
			this.inTimeout.setValue(data.IN_TIMEOUT);
			this.mediaIp.setValue(data.MEDIA_IP);
			this.extConfig.setValue(data.EXT_CONFIG)
		}
	},
	onSaveMediaFn : function() {
		if (this.mediaForm.form.isValid()) {
			params = {
				mediaType : this.mediaType.getValue(),
				saveType : this.config.saveType
			};
			if (this.config.rd) {
				params.MEDIA_ID = this.config.rd.MEDIA_ID;
			}
			this.mediaForm.form.submit({
						clientValidation : true,
						waitMsg : '数据提交中...',
						waitTitle : '信息',
						params : params,
						url : '/servlet/ippAction.do?method=createEditDelMedia',
						method : 'post',
						failure : function(form, action) {
							Ext.MessageBox.alert('错误', '填写的数据没有通过验证');
						},
						success : function(form, action) {
							if (action.result.success == true) {
								Ext.MessageBox.alert('成功', '数据已经保存');
								this.config.owner.getStore().reload();
								this.close();
							} else {
								Ext.MessageBox.alert('失败', '数据保存失败,请重新尝试');
							}
						},
						scope : this
					});
		}
	}
})

//发布媒体*********************************
bosswg.ipp.MediaListPanel = function(config) {
	this.config = config || {};
	this.config['_makepn']['bosswg.ipp.MediaListPanel'] = this;
	this.dstore = new Ext.data.Store({
				// pruneModifiedRecords : true,
				// id : 'hds',
				autoLoad : true,
				proxy : new Ext.data.HttpProxy({
							url : '/servlet/ippAction.do?method=getMediaList'

						}),
				reader : new Ext.data.JsonReader({
							root : 'rows'

						}, [{
									name : 'MEDIA_ID'
								}, {
									name : 'MEDIA_TYPE'
								}, {
									name : 'MEDIA_IP'
								}, {
									name : 'MEDIA_PORT'
								}, {
									name : 'IN_USER'
								}, {
									name : 'MEDIA_TYPE_NAME'
								}, {
									name : 'IN_PASS'
								}, {
									name : 'IN_TIMEOUT'
								}, {
									name : 'SEND_TIMEOUT'
								}, {
									name : 'EXT_CONFIG'
								}]),
				remoteSort : true

			});

	var colModel = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				header : '媒体类型',
				dataIndex : 'MEDIA_TYPE_NAME',
				menuDisabled : true,
				width : 80
			}, {
				header : '接入地址',
				dataIndex : 'MEDIA_IP',
				menuDisabled : true,
				width : 230
			}, {
				header : '接入端口',
				dataIndex : 'MEDIA_PORT',
				menuDisabled : true,
				width : 130
			}, {
				header : '接入用户',
				dataIndex : 'IN_USER',
				menuDisabled : true,
				width : 130
			}, {
				header : '接入密码',
				dataIndex : 'IN_PASS',
				menuDisabled : true,
				width : 130
			}, {
				header : '接入超时时长',
				dataIndex : 'IN_TIMEOUT',
				menuDisabled : true,

				width : 120
			}, {
				header : '发送信息超时时长',
				dataIndex : 'IN_PASS',
				menuDisabled : true,
				width : 100
			}, {
				header : '接入有效时长',
				dataIndex : 'SEND_TIMEOUT',
				menuDisabled : true,
				width : 100
			}

	]);
	bosswg.ipp.MediaListPanel.superclass.constructor.call(this, {
				title : '发布媒体信息',
				iconCls : 'mediaList1',
				tbar : [{
							text : '增加',
							iconCls : 'icon-add',
							handler : this.onAddMediaFn,
							scope : this
						}, '&nbsp;&nbsp;', {
							text : '修改',
							iconCls : 'icon-edit',
							handler : this.onEditMediaFn,
							scope : this
						}, '&nbsp;&nbsp;', {
							text : '删除',
							iconCls : 'icon-del',
							handler : this.onDeleteMediaFn,
							scope : this
						}],
				cm : colModel,
				listeners : {
					rowdblclick : {
						fn : this.onRowDblMediaClickFn,
						scope : this
					}
				},
				border : false,
				autoScroll : true,
				selModel : new Ext.grid.RowSelectionModel({
							singleSelect : false
						}),
				sm : new Ext.grid.RowSelectionModel({
							singleSelect : true
						}),
				store : this.dstore,
				loadMask : {
					msg : '数据载入中...'
				},
				viewConfig : {
					forceFit : false
				}
			});

}

Ext.extend(bosswg.ipp.MediaListPanel, Ext.grid.GridPanel, {
	onRowDblMediaClickFn : function(grid, rowIndex, e) {
		this.config.owner = this
		this.config.saveType = "edit";
		this.config.rd = grid.getStore().getAt(rowIndex).data;
		var cmw = new bosswg.ipp.CreateMediaWin(this.config);
	},
	onDeleteMediaFn : function() {
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('请选择一条记录修改!');
			return false;
		}
		var url = '/servlet/ippAction.do?method=createEditDelMedia&saveType=del&MEDIA_ID='
				+ records[0].data.MEDIA_ID;
		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
		sendRequest.open("post", url, false);
		sendRequest.send(null);
		var responseInfo = Ext.util.JSON.decode(sendRequest.responseText);
		if (responseInfo.success) {
			alert('删除成功');
			this.getStore().reload();
		}
	},
	onAddMediaFn : function() {
		this.config.owner = this
		this.config.saveType = "add";
		if (this.config.rd) {
			delete this.config.rd;
		}
		var cmw = new bosswg.ipp.CreateMediaWin(this.config);
	},
	onEditMediaFn : function() {
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('请选择一条记录修改!');
			return false;
		}
		this.config.owner = this;
		this.config.saveType = "edit";
		this.config.rd = records[0].data;
		var cmw = new bosswg.ipp.CreateMediaWin(this.config);
	}

});

// 服务配置******************************************************
//*******************其他配置
bosswg.ipp.servOtherPanel = function(config) {
	// Ext.apply(this, config);
	this.config = config;
		this.TS_MediaStore = new Ext.data.Store({
				// pruneModifiedRecords : true,
				autoLoad : true,
				// id : 'hds',
				proxy : new Ext.data.HttpProxy({
							url : '/servlet/ippAction.do?method=getMediaList'

						}),
				reader : new Ext.data.JsonReader({
							root : 'rows'

						}, [{
									name : 'MEDIA_ID'
								}, {
									name : 'MEDIA_TYPE_NAME'
								}]),
								listeners : {
					load : {
						fn : this.onExpandFn,
						scope : this
					}
				}
			});
	this.TS_Media = new Ext.ux.form.LovCombo({
				labelSeparator : '：',
				anchor : '80%',
				fieldLabel : "服务发布媒体类别",
				// hideOnSelect:false,
				allowBlank:false,
				blankText:'类别不能为空',
				editable : false,
				maxHeight : 200,
				store : this.TS_MediaStore,
				triggerAction : 'all',
				valueField : 'MEDIA_ID',
				displayField : 'MEDIA_TYPE_NAME',
				mode : 'remote'
			});
	this.paraForm = new Ext.FormPanel({
				labelWidth : 120,
				// border : true,
				 style : 'padding:10,2,2,10',
				// frame : true,
				autoScroll : true,
				items : [this.TS_Media,{
							buttonAlign : 'center',
							border : false,
							buttons : [{
										text : '保存/修改',
										handler : this.onSaveParaFn,
										scope : this
									}]
						}]

			})
	bosswg.ipp.servOtherPanel.superclass.constructor.call(this, {
				title : '其他配置',
				// bodyStyle:'padding:2px;',
				layout : 'fit',
				border : false,
				frame : true,
				items : [this.paraForm]
			});
	this.on("activate", this.onActivateFn, this);
	// /afterlayout
}
Ext.extend(bosswg.ipp.servOtherPanel, Ext.Panel, {
	onExpandFn:function(){
		if(this.rrwIDValue){
			this.TS_Media.setValue(this.rrwIDValue);
		}	
	},
			onActivateFn : function() {
				var url = '/servlet/ippAction.do?method=getServOtherConfig&SERV_ID='
						+ this.config.rd.attributes.SERV_ID;
				var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
				sendRequest.open("post", url, false);
				sendRequest.send(null);
				var responseInfo = Ext.util.JSON
						.decode(sendRequest.responseText);
				
				var rowsMedia=responseInfo.rowsMedia;
				if (rowsMedia.length > 0) {
				var rrwID = "";
				for (var rw = 0; rw < rowsMedia.length; rw++) {
					rrwID += rowsMedia[rw].MEDIA_ID+ ",";
				}
				this.rrwIDValue=rrwID;
				this.TS_Media.setValue(rrwID);
			  }
			},
			onSaveParaFn : function() {
				if (this.paraForm.form.isValid()) {
					params = {
						SERV_ID : this.config.rd.attributes.SERV_ID,
						TS_Media:this.TS_Media.getValue()
					};
					this.paraForm.form.submit({
								clientValidation : true,
								waitMsg : '数据提交中...',
								waitTitle : '信息',
								params : params,
								url : '/servlet/ippAction.do?method=createEditServOtherConfig',
								method : 'post',
								failure : function(form, action) {
									Ext.MessageBox.alert('错误', '填写的数据没有通过验证');
								},
								success : function(form, action) {
									if (action.result.success == true) {
										Ext.MessageBox.alert('成功', '数据已经保存');
									} else {
										Ext.MessageBox.alert('失败',
												'数据保存失败,请重新尝试');
									}
								},
								scope : this
							});
				}
			}
		});
//***************取数参数
bosswg.ipp.servParaPanel = function(config) {
	// Ext.apply(this, config);
	this.config = config;
	this.papaName = new Ext.form.TextField({
				name : 'papaName',
				fieldLabel : '参数名称(英文)',
				regex : /^[a-zA-Z0-9_]{3,18}$/,
				regexText : '不是有效英文标识',
				labelSeparator : '：',
				maxLength : 48,
				maxLengthText : '参数名称不能超过50位',
				style : 'margin-top:2',
				anchor : '80%',
				msgTarget : 'side'
			})
	this.defaultVal = new Ext.form.TextField({
				name : 'defaultVal',
				fieldLabel : '默认值',
				labelSeparator : '：',
				maxLength : 48,
				maxLengthText : '参数名称不能超过50位',
				style : 'margin-top:2',
				anchor : '80%',
				msgTarget : 'side'
			})
	this.order = new Ext.form.TextField({
				name : 'order',
				fieldLabel : '序号',
				regexText : '序号必须为正整数',
				allowBlank:false,
				blankText:'序号不能为空',
				regex : /^\d+$/,
				labelSeparator : '：',
				maxLength : 2,
				maxLengthText : '只能是两位数',
				style : 'margin-top:2',
				anchor : '80%',
				msgTarget : 'side'
			})
	this.paraType = new Ext.form.ComboBox({
		// name:'grid',
		labelSeparator : '：',
		anchor : '80%',
		fieldLabel : "类型",
		store : new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : [['0SA', '字符串'], ['0SB', '数字'], ['0SC', '日期'], ['0SD', '其他']]
		}),
		valueField : "value",
		displayField : "text",
		mode : "local",
		triggerAction : "all",
		value : '0SA',
		editable : false
	});
	this.paraStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/servlet/ippAction.do?method=getServPara'
						}),
				reader : new Ext.data.JsonReader({
							root : 'rows'

						}, [{
									name : 'PARA_NAME'
								}, {
									name : 'PARA_TYPE'
								}, {
									name : 'DEFAULT_VAL'
								}, {
									name : 'ORDERS'
								}]),

				remoteSort : true
			});

	this.colModel = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				header : '参数名称',
				// align : 'center',
				dataIndex : 'PARA_NAME',
				menuDisabled : true,
				// renderer:
				width : 150
			}, {
				header : '参数类型',
				dataIndex : 'PARA_TYPE',
				menuDisabled : true,
				width : 100
			}, {
				header : '默认值',
				dataIndex : 'DEFAULT_VAL',
				menuDisabled : true,
				width : 100
			}, {
				header : '序号',
				dataIndex : 'ORDERS',
				menuDisabled : true,
				width : 100
			}

	]);
	this.paraGrid = new Ext.grid.GridPanel({
				tbar : [{
							text : '增加',
							handler : this.onAddPapaFn,
							iconCls : 'icon-add',
							scope : this
						}, '-', '&nbsp;&nbsp;', {
							text : '修改',
							iconCls : 'icon-edit',
							handler : this.onEditPapaFn,
							scope : this
						}, '-', '&nbsp;&nbsp;', {
							text : '删除',
							iconCls : 'icon-del',
							handler : this.onDeleteParaFn,
							scope : this
						}],
				cm : this.colModel,
				selModel : new Ext.grid.RowSelectionModel({
							singleSelect : false
						}),
				sm : new Ext.grid.RowSelectionModel({
							singleSelect : true
						}),
				store : this.paraStore,
				listeners : {
					rowdblclick : {
						fn : this.onSubRowDblClickFn,
						scope : this
					}
				},
				loadMask : {
					msg : '数据载入中...'
				}
			})
	this.paraForm = new Ext.FormPanel({
				labelWidth : 120,
				 border : false,
				 style : 'padding:10,0,0,10',
				// frame : true,
				autoScroll : true,
				items : [this.papaName, this.paraType, this.defaultVal,
						this.order, {
							buttonAlign : 'center',
							border : false,
							buttons : [{
										text : '保存/修改',
										handler : this.onSaveParaFn,
										scope : this
									}, {
										text : '返回',
										iconCls : 'icon-undo',
										handler : function() {
											this.getLayout().setActiveItem(0);
										},
										scope : this
									}]
						}]

			})
	bosswg.ipp.servParaPanel.superclass.constructor.call(this, {
				title : '取数参数',
				// bodyStyle:'padding:2px;',
				layout : 'card',
				activeItem : 0,
				border : false,
				items : [this.paraGrid, this.paraForm]
			});
	this.on("activate", this.onActivateFn, this);
	// /afterlayout
}
Ext.extend(bosswg.ipp.servParaPanel, Ext.Panel, {
		onDeleteParaFn : function() {
		var sm = this.paraGrid.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('请选择一条要删除的记录!');
			return false;
		}
		Ext.Ajax.request({
			waitMsg : '数据提交中...',
			waitTitle : '信息',
			url : '/servlet/ippAction.do?method=createEditPara',
			params : {
				papaName:records[0].data.PARA_NAME,
				saveType:'del',
				SERV_ID : this.config.rd.attributes.SERV_ID
				
			},
			callback : function(options, success, response) {
				var responseArray = Ext.util.JSON.decode(response.responseText);
				if (responseArray.success == true) {
					Ext.Msg.alert('成功', '选中的记录已经删除');
					this.paraGrid.getStore().reload();
				} else {
					Ext.Msg.alert('失败', '数据库交互繁忙');
				}
			},
			scope : this
		});
	},
		onAddPapaFn : function() {
		this.getLayout().setActiveItem(1);
		this.paraForm.getForm().reset();
		this.config.saveType = "add";
	   },
	onSubRowDblClickFn : function(grid, rowIndex, e) {
		rd = grid.getStore().getAt(rowIndex).data;
		this.config.saveType = "edit";
		this.config.oldPapaName=rd.PARA_NAME;
		this.papaName.setValue(rd.PARA_NAME)
		this.defaultVal.setValue(rd.DEFAULT_VAL)
		this.order.setValue(rd.ORDERS)
		this.paraType.setValue(rd.PARA_TYPE)
		this.getLayout().setActiveItem(1);
	},
		onEditPapaFn : function() {
		var sm = this.paraGrid.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('请选择一条记录修改!');
			return false;
		}
		var rd = records[0].data;
		this.config.saveType = "edit";
		this.config.oldPapaName=rd.PARA_NAME;//由于表中是用到名称为联合主键
		this.papaName.setValue(rd.PARA_NAME)
		this.defaultVal.setValue(rd.DEFAULT_VAL)
		this.order.setValue(rd.ORDERS)
		this.paraType.setValue(rd.PARA_TYPE)
		this.getLayout().setActiveItem(1);

	},
			onActivateFn : function() {
				this.getLayout().setActiveItem(0);
				this.paraStore.load({
							params : {
								SERV_ID : this.config.rd.attributes.SERV_ID
							}
						});
			},
			onSaveParaFn : function() {
				if (this.paraForm.form.isValid()) {
					params = {
						oldPapaName:this.config.oldPapaName,
						SERV_ID : this.config.rd.attributes.SERV_ID,
						saveType:this.config.saveType,
						paraType : this.paraType.getValue()
					};
					this.paraForm.form.submit({
								clientValidation : true,
								waitMsg : '数据提交中...',
								waitTitle : '信息',
								params : params,
								url : '/servlet/ippAction.do?method=createEditPara',
								method : 'post',
								failure : function(form, action) {
									Ext.MessageBox.alert('错误', '填写的数据没有通过验证');
								},
								success : function(form, action) {
									if (action.result.success == true) {
										this.onActivateFn();
										Ext.MessageBox.alert('成功', '数据已经保存');
									} else {
										Ext.MessageBox.alert('失败',
												'数据保存失败,请重新尝试');
									}
								},
								scope : this
							});
				}
			}
		});
// 订阅信息*****************************
bosswg.ipp.subscribePanel = function(config) {
	// Ext.apply(this, config);
	this.config = config;
	this.subscrDays = new Ext.form.TextField({
				name : 'subscrDays',
				fieldLabel : '订阅有效天数',
				regexText : '订阅有效天数必须为正整数',
				regex : /^\d+$/,
				labelSeparator : '：',
				maxLength : 3,
				maxLengthText : '只能是三位数',
				style : 'margin-top:2',
				anchor : '90%',
				msgTarget : 'title'
			})
	this.userIdStore = new Ext.data.Store({
				autoLoad : true,
				// baseParams:{roleType:'0SA___ddd'},
				proxy : new Ext.data.HttpProxy({
							url : '/servlet/ippAction.do?method=getRegisterUserList'

						}),
				reader : new Ext.data.JsonReader({
							root : 'rows'

						}, [{
									name : 'USER_ID'
								}, {
									name : 'REAL_NAME'
								}])

			});
	this.userId = new Ext.form.ComboBox({
				labelSeparator : '：',
				anchor : '90%',
				fieldLabel : "订阅者",
				// hideOnSelect:false,
				editable : false,
				maxHeight : 200,
				store : this.userIdStore,
				triggerAction : 'all',
				valueField : 'USER_ID',
				displayField : 'REAL_NAME',
				allowBlank : false,
				blankText : '订阅者标识不能为空',
				mode : 'remote'
			});
	this.subscribeForm = new Ext.FormPanel({
				labelWidth : 120,
				border : false,
				style : 'padding:30,10,0,10',
				frame : false,
				autoScroll : true,
				items : [this.userId, this.subscrDays, {
							buttonAlign : 'center',
							border : false,
							buttons : [{
										text : '保存',
										handler : this.onSaveSubFn,
										iconCls : 'queryAdd1',
										scope : this
									}, {
										text : '返回',
										iconCls : 'icon-undo',
										handler : function() {
											this.getLayout().setActiveItem(0);
										},
										scope : this
									}]
						}]

			})
	this.subStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/servlet/ippAction.do?method=getSubscribeList'
						}),
				reader : new Ext.data.JsonReader({
							root : 'rows'

						}, [{
									name : 'SUBSCR_ID'
								}, {
									name : 'USER_ID'
								}, {
									name : 'REAL_NAME'
								}, {
									name : 'SUBSCR_DAYS'
								}, {
									name : 'GENERATE'
								}]),

				remoteSort : true
			});

	this.colModel = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				header : '订阅者',
				// align : 'center',
				dataIndex : 'REAL_NAME',
				menuDisabled : true,
				// renderer:
				width : 130
			}, {
				header : '订阅有效天数',
				dataIndex : 'SUBSCR_DAYS',
				menuDisabled : true,
				width : 130
			}, {
				header : '订阅开始时间',
				dataIndex : 'GENERATE',
				menuDisabled : true,
				width : 150
			}

	]);
	this.subeGrid = new Ext.grid.GridPanel({
				tbar : [{
							text : '增加',
							handler : this.onAddsubFn,
							iconCls : 'icon-add',
							scope : this
						}, '-', '&nbsp;&nbsp;', {
							text : '修改',
							iconCls : 'icon-edit',
							handler : this.onEditSubFn,
							scope : this
						}, '-', '&nbsp;&nbsp;', {
							text : '删除',
							iconCls : 'icon-del',
							handler : this.onDeleteSubFn,
							scope : this
						}],
				cm : this.colModel,
				selModel : new Ext.grid.RowSelectionModel({
							singleSelect : false
						}),
				sm : new Ext.grid.RowSelectionModel({
							singleSelect : true
						}),
				store : this.subStore,
				listeners : {
					rowdblclick : {
						fn : this.onSubRowDblClickFn,
						scope : this
					}
				},
				loadMask : {
					msg : '数据载入中...'
				}
			})
	bosswg.ipp.subscribePanel.superclass.constructor.call(this, {
				title : '订阅信息',
				// bodyStyle:'padding:2px;',
				layout : 'card',
				border : false,
				activeItem : 0,
				subId : '',
				constrain : true,
				items : [this.subeGrid, this.subscribeForm]
			});
	this.on("activate", this.onActivateFn, this);

}
Ext.extend(bosswg.ipp.subscribePanel, Ext.Panel, {
	onActivateFn : function() {
		this.getLayout().setActiveItem(0);
		this.subStore.reload({
					params : {
						SERV_ID : this.config.rd.attributes.SERV_ID
					}
				});
	},
	onDeleteSubFn : function() {
		var sm = this.subeGrid.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('请选择一条要删除的记录!');
			return false;
		}
		Ext.Ajax.request({
			waitMsg : '数据提交中...',
			waitTitle : '信息',
			url : '/servlet/ippAction.do?method=createEditDelSubscribe',
			params : {
				saveType : 'del',
				subId : records[0].data.SUBSCR_ID
			},
			callback : function(options, success, response) {
				var responseArray = Ext.util.JSON.decode(response.responseText);
				if (responseArray.success == true) {
					Ext.Msg.alert('成功', '选中的记录已经删除');
					this.subeGrid.getStore().reload();
				} else {
					Ext.Msg.alert('失败', '数据库交互繁忙');
				}
			},
			scope : this
		});
	},
	onEditSubFn : function() {
		var sm = this.subeGrid.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('请选择一条记录修改!');
			return false;
		}
		var rd = records[0].data;
		this.subId = rd.SUBSCR_ID;
		this.config.saveType = "edit";
		this.userId.setValue(rd.USER_ID);
		this.subscrDays.setValue(rd.SUBSCR_DAYS);
		this.getLayout().setActiveItem(1);

	},
	onSubRowDblClickFn : function(grid, rowIndex, e) {
		rd = grid.getStore().getAt(rowIndex).data;
		this.subId = rd.SUBSCR_ID;
		this.config.saveType = "edit";
		this.userId.setValue(rd.USER_ID);
		this.subscrDays.setValue(rd.SUBSCR_DAYS);
		this.getLayout().setActiveItem(1);
	},
	onAddsubFn : function() {
		this.subscribeForm.getForm().reset();
		this.config.saveType = "add";
		this.getLayout().setActiveItem(1);
	},
	onSaveSubFn : function() {
		if (this.subscribeForm.form.isValid()) {

			params = {
				SERV_ID : this.config.rd.attributes.SERV_ID,
				userId : this.userId.getValue(),
				subId : this.subId,
				saveType : this.config.saveType,
				subscrDays : this.subscrDays.getValue()
			};
			this.subscribeForm.form.submit({
						clientValidation : true,
						waitMsg : '数据提交中...',
						waitTitle : '信息',
						params : params,
						url : '/servlet/ippAction.do?method=createEditDelSubscribe',
						method : 'post',
						failure : function(form, action) {
							Ext.MessageBox.alert('错误', '填写的数据没有通过验证');
						},
						success : function(form, action) {
							if (action.result.success == true) {
								Ext.MessageBox.alert('成功', '数据已经保存');
								this.subeGrid.getStore().reload();
								this.getLayout().setActiveItem(0)
							} else {
								Ext.MessageBox.alert('失败', '数据保存失败,请重新尝试');
							}
						},
						scope : this
					});
		}
	}
})
// 权限配置类***********************************************
bosswg.ipp.rolePanel = function(config) {
	// Ext.apply(this, config);
	this.config = config;
	this.roleType = new Ext.form.ComboBox({
				// name:'grid',
				labelSeparator : '：',
				anchor : '90%',
				fieldLabel : "权限类型",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '角色'], ['0SB', '用户']]
						}),
				valueField : "value",
				displayField : "text",
				listeners : {
					select : {
						fn : this.onRoleTypeSelectFn,
						scope : this
					}
				},
				mode : "local",
				triggerAction : "all",
				allowBlank : false,
				blankText : '权限类型必须选择',
				editable : false
			});
	this.roleIdStore = new Ext.data.Store({
				// autoLoad:true,
				// baseParams:{roleType:'0SA___ddd'},
				proxy : new Ext.data.HttpProxy({
							url : '/servlet/ippAction.do?method=getServRoleList'

						}),
				reader : new Ext.data.JsonReader({
							root : 'rows'

						}, [{
									name : 'RID'
								}, {
									name : 'RNAME'
								}])

			});
	this.roleId = new Ext.form.ComboBox({
				labelSeparator : '：',
				anchor : '90%',
				fieldLabel : "权限实体标识",
				// hideOnSelect:false,
				editable : false,
				maxHeight : 200,
				store : this.roleIdStore,
				triggerAction : 'all',
				valueField : 'RID',
				displayField : 'RNAME',
				allowBlank : false,
				blankText : '权限实体标识不能为空',
				listeners : {
					beforequery : {
						fn : this.onRoleIdExpandFn,
						scope : this
					}
				},
				mode : 'remote'
			});
	this.submitForm = new Ext.FormPanel({
				labelWidth : 120,
				border : false,
				style : 'padding:30,10,0,10',
				frame : false,
				autoScroll : true,
				items : [this.roleType, this.roleId, {
							buttonAlign : 'center',
							border : false,
							buttons : [{
										text : '保存',
										iconCls : 'queryAdd1',
										handler : this.onSaveRoleFn,
										scope : this
									}, {
										text : '返回',
										iconCls : 'icon-undo',
										handler : function() {
											this.getLayout().setActiveItem(0);
										},
										scope : this
									}]
						}]

			})
	this.dstore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/servlet/ippAction.do?method=getServRoleList'
						}),
				reader : new Ext.data.JsonReader({
							root : 'rows'

						}, [{
									name : 'SERV_ID'
								}, {
									name : 'ROLE_TYPE'
								}, {
									name : 'ROLE_ID'
								}, {
									name : 'ROLE_NAME'
								}]),

				remoteSort : true
			});

	this.colModel = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
		header : '角色名称',
		// align : 'center',
		// dataIndex : 'ROLE_NAME',
		menuDisabled : true,
		renderer : function(value, metadata, record, rowIndex, colIndex, store) {
			var rd = record.data;
			return rd.ROLE_NAME;
		},
		width : 250
	}, {
		header : '角色类型',
		dataIndex : 'ROLE_TYPE',
		// hideable : true,
		// hidden : true,
		renderer : function(val) {
			if (val == '0SA') {
				return '<font color="#9400D3">角色</font>'
			} else {
				return '<font color="#FF4500">用户</font>'
			}

		},
		menuDisabled : true,
		width : 180
	}

	]);
	this.roleGrid = new Ext.grid.GridPanel({
				tbar : [{
							text : '增加',
							iconCls : 'icon-add',
							handler : this.onAddRoleFn,
							scope : this
						}, '-', '&nbsp;&nbsp;', {
							text : '删除',
							iconCls : 'icon-del',
							handler : this.onDeleteRoleFn,
							scope : this
						}],
				cm : this.colModel,
				selModel : new Ext.grid.RowSelectionModel({
							singleSelect : false
						}),
				sm : new Ext.grid.RowSelectionModel({
							singleSelect : true
						}),
				store : this.dstore,
				loadMask : {
					msg : '数据载入中...'
				}
			})
	bosswg.ipp.rolePanel.superclass.constructor.call(this, {
				title : '查询权限',
				// bodyStyle:'padding:2px;',
				layout : 'card',
				activeItem : 0,
				border : false,
				// width : 500,
				// height : 405,
				constrain : true,
				items : [this.roleGrid, this.submitForm]
			});
	this.on("activate", this.onActivateFn, this);

}
Ext.extend(bosswg.ipp.rolePanel, Ext.Panel, {
	onDeleteRoleFn : function() {
		var sm = this.roleGrid.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('请选择一条记录修改!');
			return false;
		}
		Ext.Ajax.request({
			waitMsg : '数据提交中...',
			waitTitle : '信息',
			url : '/servlet/ippAction.do?method=createEditDelServRole',
			params : {
				SERV_ID : records[0].data.SERV_ID,
				roleType : records[0].data.ROLE_TYPE,
				saveType : 'del',
				roleId : records[0].data.ROLE_ID
			},
			callback : function(options, success, response) {
				var responseArray = Ext.util.JSON.decode(response.responseText);
				if (responseArray.success == true) {
					Ext.Msg.alert('成功', '选中的记录已经删除');
					// {params:{hello:'ddffdfd'}}
					this.roleGrid.getStore().reload();
				} else {
					Ext.Msg.alert('失败', '数据库交互繁忙');
				}
			},
			scope : this
		});

	},
	onSaveRoleFn : function() {
		if (this.submitForm.form.isValid()) {

			params = {
				roleId : this.roleId.getValue(),
				roleType : this.roleType.getValue(),
				saveType : 'add',
				SERV_ID : this.config.rd.attributes.SERV_ID
			};
			this.submitForm.form.submit({
						clientValidation : true,
						waitMsg : '数据提交中...',
						waitTitle : '信息',
						params : params,
						url : '/servlet/ippAction.do?method=createEditDelServRole',
						method : 'post',
						failure : function(form, action) {
							Ext.MessageBox.alert('错误', '填写的数据没有通过验证');
						},
						success : function(form, action) {
							if (action.result.success == true) {
								Ext.MessageBox.alert('成功', '数据已经保存');
								this.roleGrid.getStore().reload();
								this.getLayout().setActiveItem(0)
							} else {
								Ext.MessageBox.alert('失败', '数据保存失败,请重新尝试');
							}
						},
						scope : this
					});
		}
	},
	onActivateFn : function() {
		this.getLayout().setActiveItem(0);
		this.dstore.baseParams = {
			roleType : 'all',
			SERV_ID : this.config.rd.attributes.SERV_ID
		};
		this.dstore.reload();
	},
	onAddRoleFn : function() {
		this.submitForm.form.reset();
		this.getLayout().setActiveItem(1)
	},
	onRoleIdExpandFn : function() {
		if (this.roleType.getValue() == '') {
			alert('请选择类型');
			return false;
		}

	},
	onRoleTypeSelectFn : function() {
		// this.roleIdStore.load({roleType:'0SA___ddd'});
		this.roleIdStore.baseParams = {
			roleType : this.roleType.getValue()
		};
		this.roleId.clearValue();
		this.roleIdStore.reload()
	}
})
// 配置窗口****************************************************************
bosswg.ipp.serviceConfigWin = function(config) {
	// Ext.apply(this, config);
	this.config = config;
	this.showTab = new Ext.TabPanel({
				activeTab : 0,
				deferredRender : false,
				border : false,
				tabPosition : 'top',
				// autoScroll:true,
				listeners : {
					tabchange : {
						fn : this.tabChangeFn,
						scope : this
					}
				}

			})
	bosswg.ipp.serviceConfigWin.superclass.constructor.call(this, {
				// title : '增加',
				// collapsible : false,
				closable : true,
				closeAction : 'close',

				// iconCls : 'queryTiaoJian',
				y : 10,
				modal : true,
				draggable : true,
				resizable : false,
				// bodyStyle:'padding:2px;',
				layout : 'fit',
				buttonAlign : 'right',
				border : false,
				buttons : [{
							text : '退出',
							iconCls : 'closeWin',
							handler : function() {
								this.close()
							},
							scope : this
						}],
				width : 500,
				height : 350,
				constrain : true,
				items : [this.showTab]
			});

	this.show();

}
Ext.extend(bosswg.ipp.serviceConfigWin, Ext.Window, {
			tabChangeFn : function(tabpanel, panel) {

			}
		})
// *************************************************
bosswg.ipp.serviceWin = function(config) {
	// Ext.apply(this, config);
	this.config = config;
	this.servName = new Ext.form.TextField({
				name : 'servName',
				fieldLabel : '服务名称',
				labelSeparator : '：',
				style : 'margin-top:2',
				anchor : '90%',
				msgTarget : 'title',
				maxLength : 48,
				maxLengthText : '服务编码长度不能超过50',
				allowBlank : false,
				blankText : '服务名称名称不能为空'
			})

	this.parentServIdStore = new Ext.data.JsonStore({
		autoLoad : true,
		proxy : new Ext.data.HttpProxy(new Ext.data.Connection({
			url : '/servlet/ippAction.do?method=getServiceTypeList&serviceType=0SA',
			timeout : 300000,
			method : 'POST'
		})),
		root : 'rows',
		fields : [{
					name : 'SERV_ID'
				}, {
					name : 'SERV_NAME'
				}],
		baseParams : {

	}	,
		listeners : {
			load : {
				fn : this.onParentServIdStoreFn,
				scope : this
			}
		}
	});

	this.parentTree = new Ext.tree.TreePanel({
		rootVisible : false,
		expandable : false,
		animate : true,
		lines : true,
		border : false,
		// useArrows : true,
		enableDD : true,
		listeners : {
			click : {
				fn : this.onParentTreeClickFn,
				scope : this
			}
		},
		loader : new Ext.tree.TreeLoader({
			// preloadChildren:true,
			dataUrl : '/servlet/ippAction.do?method=getServiceTreeList&getType=OSA',
			uiProviders : {
				'col' : Ext.tree.ColumnNodeUI
			},
			listeners : {
				beforeload : function(sel, node) {
					sel.baseParams.pid = node.attributes.SERV_ID;
				}
			},
			baseParams : {
				pid : -1
			}
		}),

		root : new Ext.tree.AsyncTreeNode({
					text : '根服务',
					leaf : false,
					id : -1,
					PARENT_SERV_ID : -2,
					// icon:'zhibiao'
					draggable : false,
					expanded : true,
					SERV_ID : -1,
					clev : 0
				})
	});
	this.parentServId = new Ext.form.ComboBox({
		fieldLabel : "父服务标识",
		maxHeight : 150,
		anchor : '90%',
		allowBlank : false,
		blankText : '父服务标识必须选择',
		selectParentId : '',
		labelSeparator : '：',
		store : new Ext.data.SimpleStore({
					fields : [],
					data : [[]]
				}),
		editable : false,
		mode : 'local',
		triggerAction : 'all',
		maxHeight : 130,
		tpl : "<tpl for='.'><div style='height:130px' id='parentTreeDiv'></div></tpl>",
		selectedClass : '',
		listeners : {
			expand : {
				fn : this.onparentTreeExpandFn,
				scope : this
			}
		}
			// ,onSelect:Ext.emptyFn
	})
	this.servType = new Ext.form.ComboBox({
				// name : "servType",
				labelSeparator : '：',
				anchor : '90%',
				fieldLabel : "服务类别",
				msgTarget : 'title',
				emptyText : '请选择...',
				allowBlank : false,
				blankText : '服务类别必须选择',
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '目录'], ['0SB', '功能']]
						}),
				valueField : "value",
				displayField : "text",
				// value:'0SB',
				mode : "local",
				triggerAction : "all",
				editable : false,
				listeners : {
					select : {
						fn : this.onSerTypeSelectFn,
						scope : this
					}
				}
			});
	this.allowSubscr = new Ext.form.ComboBox({
				// name : "allowSubscr",
				labelSeparator : '：',
				anchor : '90%',
				fieldLabel : "允许订阅",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '允许'], ['0SB', '禁止']]
						}),
				valueField : "value",
				displayField : "text",
				value : '0SA',
				mode : "local",
				triggerAction : "all",
				editable : false
			});
	this.allowPublish = new Ext.form.ComboBox({
				// name : "allowPublish",
				labelSeparator : '：',
				anchor : '90%',
				fieldLabel : "允许发布",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '允许'], ['0SB', '禁止']]
						}),
				valueField : "value",
				value : '0SA',
				displayField : "text",
				mode : "local",
				triggerAction : "all",
				editable : false
			});
	// *************************
	this.servCode = new Ext.form.TextField({
				name : 'servCode',
				fieldLabel : '服务编码',
				labelSeparator : '：',
				style : 'margin-top:2',
				anchor : '90%',
				msgTarget : 'title',
				maxLength : 48,
				maxLengthText : '服务编码长度不能超过50',
				allowBlank : false,
				blankText : '服务编码不能为空'
			})
	this.smsCode = new Ext.form.TextField({
				name : 'smsCode',
				fieldLabel : '短信编码',
				labelSeparator : '：',
				style : 'margin-top:2',
				anchor : '90%',
				msgTarget : 'title',
				maxLength : 20,
				allowBlank : false,
				blankText : '短信编码不能为空',
				maxLengthText : '短信编码长度不能超过20'
			})
	this.method = new Ext.form.TextField({
				name : 'ippMethod',
				fieldLabel : '取数方法',
				labelSeparator : '：',
				style : 'margin-top:2',
				anchor : '90%',
				msgTarget : 'title',
				maxLength : 50,
				maxLengthText : '取数方法长度不能超过50'
			})
	this.actionUrl = new Ext.form.TextField({
				name : 'actionUrl',
				fieldLabel : '取数地址',
				labelSeparator : '：',
				// regex:/(http\:\/\/)?([\w.]+)(\/[\w-\.\/\?%&=]*)?/gi,
				// regexText:'必须是有效的网址',
				style : 'margin-top:2',
				anchor : '90%',
				msgTarget : 'title',
				maxLength : 198,
				maxLengthText : '取数方法长度不能超过200'
			})
	this.bsIdStore = new Ext.data.Store({
				// pruneModifiedRecords : true,
				autoLoad : true,
				// id : 'hds',
				proxy : new Ext.data.HttpProxy({
							url : '/servlet/ippAction.do?method=getIppBsList'

						}),
				reader : new Ext.data.JsonReader({
							root : 'rows'

						}, [{
									name : 'BS_ID'
								}, {
									name : 'BS_CHNAME'
								}]),
				listeners : {
					load : {
						fn : this.onBsIdStoreFn,
						scope : this
					}
				}

			});

	this.bsId = new Ext.form.ComboBox({
				// id : "Region_Id_Compare",
				// name:'bsId',
				fieldLabel : "业务系统标识",
				maxHeight : 150,
				anchor : '90%',
				labelSeparator : '：',
				emptyText : '请选择...',
				editable : false,
				typeAhead : true,
				// listWidth:50,
				labelSeparator : '：',
				triggerAction : 'all',
				valueField : 'BS_ID',
				displayField : 'BS_CHNAME',
				mode : 'remote',
				store : this.bsIdStore
			})
	this.timeOut = new Ext.form.TextField({
				name : 'timeOut',
				fieldLabel : '取数超时时长',
				regexText : '不是有效正整数',
				regex : /^\d+$/,
				labelSeparator : '：',
				style : 'margin-top:2',
				anchor : '90%',
				msgTarget : 'title'
			})
	this.publishTime = new Ext.form.TextField({
				name : 'publishTime',
				fieldLabel : '发布时刻',
				labelSeparator : '：',
				style : 'margin-top:2',
				anchor : '90%',
				maxLength : 98,
				maxLengthText : '取数方法长度不能超过100'
			})
	this.servRemark = new Ext.form.TextArea({
				name : 'servRemark',
				fieldLabel : '服务说明',
				labelSeparator : '：',
				style : 'margin-top:2',
				anchor : '90%',
				height : 45,
				maxLength : 498,
				maxLengthText : '取数方法长度不能超过500'
			})
	this.typePanel = new Ext.form.FormPanel({
				labelWidth : 100,
				border : false,
				// style : 'padding:2',
				frame : true,
				autoScroll : true,
				items : [{
					layout : 'form',
					border : false,
					items : [this.servType, this.parentServId, this.servName,
							this.allowSubscr, this.allowPublish, this.servCode,
							this.smsCode]
				}, {
					layout : 'form',
					border : false,
					items : [this.bsId, this.method, this.actionUrl,
							this.timeOut, this.publishTime, this.servRemark]
				}]
			})

	bosswg.ipp.serviceWin.superclass.constructor.call(this, {
				title : '增加',
				collapsible : false,
				closable : true,
				closeAction : 'close',
				iconCls : 'serve_config2',
				modal : true,
				draggable : true,
				resizable : false,
				// bodyStyle:'padding:2px;',
				layout : 'fit',
				// activeItem : 0,
				x : 20,
				y : 10,
				width : 450,
				height : 485,
				constrain : true,
				items : [this.typePanel],
				buttonAlign : 'right',
				buttons : [{
							text : '保存',
							iconCls : 'queryAdd1',
							handler : this.onServiceSaveFn,
							scope : this
						}, {
							text : '退出',
							iconCls : 'closeWin',
							handler : function() {
								this.close()
							},
							scope : this
						}]

			});
	this.on('activate', this.onAfterlayoutFn, this, {
				single : true
			});
	this.show();

}
Ext.extend(bosswg.ipp.serviceWin, Ext.Window, {
	onParentTreeClickFn : function(node) {

		// document.getElementById("parentTreeDiv").style.display="none";
		this.parentServId.setValue(node.text);
		this.parentServId.selectParentId = node.attributes.SERV_ID;
		this.parentServId.collapse();
	},
	onparentTreeExpandFn : function() {
		// this.parentTree.expand();
		this.parentTree.render('parentTreeDiv');
	},
	initComponent : function() {
		bosswg.ipp.serviceWin.superclass.initComponent.call(this);
		this.addEvents('creationsuccess');
	},
	onServiceSaveFn : function() {
		if (this.typePanel.form.isValid()) {
			if (this.servType.getValue() == '0SB') {
				if (this.bsId.getValue() == '') {
					alert('业务系统标识必须选择');
					this.bsId.focus();
					return false;
				}
			}
			params = {
				saveType : this.config.saveType,
				servType : this.servType.getValue(),
				allowSubscr : this.allowSubscr.getValue(),
				parentServId : this.parentServId.selectParentId,
				allowPublish : this.allowPublish.getValue(),
				bsId : this.bsId.getValue()
			};
			if (this.config.editNode) {
				params.servId = this.config.editNode.attributes.SERV_ID;
			}
			this.typePanel.form.submit({
						clientValidation : true,
						waitMsg : '数据提交中...',
						waitTitle : '信息',
						params : params,
						url : '/servlet/ippAction.do?method=createEditDelService',
						method : 'post',
						failure : function(form, action) {
							Ext.MessageBox.alert('错误', '提交数据出现异常，请稍后重试');
						},
						success : function(form, action) {
							if (action.result.success == true) {
								Ext.MessageBox.alert('成功', '数据已经保存');
								this.config.nodeId = this.parentServId.selectParentId;
								this.fireEvent('creationsuccess', true);
								this.close();
							} else {
								Ext.MessageBox.alert('失败', '数据保存失败,请重新尝试');
							}
						},
						scope : this
					});
		}

	},
	onParentServIdStoreFn : function(stroe) {

	},
	onBsIdStoreFn : function(store) {
		if (this.config.editNode) {
			var en = this.config.editNode;
			this.bsId.setValue(en.attributes.BS_ID)
		}
	},
	onSerTypeSelectFn : function(box) {
		var secondPanel = this.typePanel.items.get(1);
		if (box.getValue() == '0SA') {
			this.timeOut.reset();
			secondPanel.hide();
			this.setHeight(280);
			this.setTitle('增加服务项-目录');
		} else if (box.getValue() == '0SB') {
			secondPanel.show();
			this.setHeight(485);
			this.setTitle('增加服务项-功能');

		}
		// secondPanel.doLayout();
	},
	onAfterlayoutFn : function() {
		var secondPanel = this.typePanel.items.get(1);
		if (this.config.saveType == 'add') {
			secondPanel.hide();
			this.setHeight(280);
			this.setTitle('增加服务项');
			if (this.config.addNode) {
				var nd = this.config.addNode;
				if (nd.attributes.SERV_TYPE == '0SA') {
					this.parentServId.selectParentId = nd.attributes.SERV_ID;
					this.parentServId.setValue(nd.attributes.SERV_NAME)
				} else {
					this.parentServId.selectParentId = nd.attributes.PARENT_SERV_ID;
					this.parentServId.setValue(nd.attributes.parentNodeName)
				}
			}
		}

		if (this.config.editNode) {

			var edo = this.config.editNode;
			this.servType.hide();
			this.servType.getEl().up('.x-form-item').setDisplayed(false);
			this.parentServId.selectParentId = edo.attributes.PARENT_SERV_ID;
			this.parentServId.setValue(edo.attributes.parentNodeName)
			this.servName.setValue(edo.attributes.SERV_NAME);
			this.allowSubscr.setValue(edo.attributes.ALLOW_SUBSCR);
			this.allowPublish.setValue(edo.attributes.ALLOW_PUBLISH);
			this.servCode.setValue(edo.attributes.SERV_CODE);
			this.servType.setValue(edo.attributes.SERV_TYPE)
			if (edo.attributes.SERV_TYPE == '0SA') {
				secondPanel.hide();
				this.setHeight(280);
				this.setTitle('修改目录-' + edo.attributes.SERV_NAME);
			} else {
				secondPanel.show();
				this.setHeight(460);
				this.setTitle('修改功能-' + edo.attributes.SERV_NAME);
				this.smsCode.setValue(edo.attributes.SMS_CODE == 'null'
						? ''
						: edo.attributes.SMS_CODE);
				this.method.setValue(edo.attributes.METHOD == 'null'
						? ''
						: edo.attributes.METHOD);
				this.actionUrl.setValue(edo.attributes.ACTIONURL == 'null'
						? ''
						: edo.attributes.ACTIONURL);
				this.timeOut.setValue(edo.attributes.TIMEOUT == 'null'
						? ''
						: edo.attributes.TIMEOUT);
				this.publishTime.setValue(edo.attributes.PUBLISH_TIME == 'null'
						? ''
						: edo.attributes.PUBLISH_TIME);
				this.servRemark.setValue(edo.attributes.SERV_REMARK == 'null'
						? ''
						: edo.attributes.SERV_REMARK);
			}

		}
	}

})
// ************************************************8

bosswg.ipp.servicePanel = function(config) {

	// Ext.apply(this, config);
	this.config = config;
	this.tree = new Ext.tree.ColumnTree({
				rootVisible : false,
				autoScroll : true,
				listeners : {
					dblclick : {
						fn : this.onDblclickFn,
						scope : this
					},
					click : {
						fn : this.onTreeClickFn,
						scope : this
					}
				},
				expandable : false,
				animate : true,
				lines : true,
				useArrows : true,
				enableDD : true,
				columns : [{
							header : '服务名称',
							width : 280,
							dataIndex : 'SERV_NAME'
						}, {
							header : '服务编码',
							align : 'center',
							width : 80,
							dataIndex : 'SERV_CODE',
							renderer : function(val) {
								if (val == 'null') {
									return "";
								} else {
									return val;
								}
							}
						}, {
							header : '短信编码',
							align : 'center',
							width : 80,
							dataIndex : 'SMS_CODE',
							renderer : function(val) {
								if (val == 'null') {
									return "";
								} else {
									return val;
								}
							}
						}
						// ,{ header:'服务类别', width:58, dataIndex:'SERV_TYPE'}
						, {
							header : '允许订阅',
							align : 'center',
							width : 80,
							dataIndex : 'ALLOW_SUBSCR',
							renderer : function(val) {
								if (val == '0SA') {
									return "允许";
								} else {
									return "禁止"
								}
							}
						}, {
							header : '允许发布',
							align : 'center',
							width : 80,
							dataIndex : 'ALLOW_PUBLISH',
							renderer : function(val) {
								if (val == '0SA') {
									return "允许";
								} else {
									return "禁止"
								}
							}
						}, {
							header : '生成时间',
							align : 'center',
							width : 120,
							dataIndex : 'GENERATE_TIME',
							renderer : function(val) {
								if (val == null || val == 'null') {
									return "";
								} else {
									return val
								}
							}
						}

						, {
							header : '取数方法',
							align : 'center',
							width : 80,
							dataIndex : 'METHOD',
							renderer : function(val) {
								if (val == null || val == 'null') {
									return "";
								} else {
									return val
								}
							}
						}
						// ,{ header:'取数地址',width:180, dataIndex:'ACTIONURL',
						// renderer:function(val){ return "<div
						// style='width:50px;white-space:normal'>"+val+"</div>"}}

						, {
							header : '取数超时时长',
							align : 'center',
							width : 80,
							dataIndex : 'TIMEOUT',
							renderer : function(val) {
								if (val == null || val == 'null') {
									return "";
								} else {
									return val
								}
							}
						}, {
							header : '发布时刻',
							width : 80,
							dataIndex : 'PUBLISH_TIME',
							renderer : function(val) {
								if (val == null || val == 'null') {
									return "";
								} else {
									return val
								}
							}
						}, {
							header : '业务系统标识',
							width : 90,
							dataIndex : 'BS_CHNAME',
							renderer : function(val) {
								if (val == null || val == 'null') {
									return "";
								} else {
									return val
								}
							}
						}

				],

				loader : new Ext.tree.TreeLoader({
							// preloadChildren:true,
							dataUrl : '/servlet/ippAction.do?method=getServiceList',
							uiProviders : {
								'col' : Ext.tree.ColumnNodeUI
							},
							listeners : {
								beforeload : function(sel, node) {
									sel.baseParams.pid = node.attributes.SERV_ID;
								}
							},
							baseParams : {
								pid : 0
							}
						}),

				root : new Ext.tree.AsyncTreeNode({
							text : '根服务',
							leaf : false,
							id : -1,
							PARENT_SERV_ID : -2,
							// icon:'zhibiao'
							draggable : false,
							expanded : true,
							SERV_ID : -1,
							clev : 0
						})
			});

	bosswg.ipp.servicePanel.superclass.constructor.call(this, {
				title : '服务配置',
				iconCls : 'serve_config2',
				border : false,
				layout : 'fit',
				items : [this.tree],
				tbar : [{
							text : '增加',
							id : 'addNode1',
							handler : this.onAddNodeFn,
							iconCls : 'icon-add',
							scope : this
						}, {
							text : '修改',
							id : 'editNode2',
							iconCls : 'icon-edit',
							disabled : true,
							handler : this.onEditNodeFn,
							scope : this
						}, {
							text : '删除',
							id : 'deleteNode3',
							iconCls : 'icon-del',
							disabled : true,
							handler : this.onDeleteNodeFn,
							scope : this
						}, '-', {
							text : '配置信息',
							id : 'configNode4',
							iconCls : 'serve_config',
							disabled : true,
							handler : this.onConfigNodeFn,
							scope : this
						}]
			});

}
Ext.extend(bosswg.ipp.servicePanel, Ext.Panel, {
	onConfigNodeFn : function() {
		var sNode = this.tree.getSelectionModel().getSelectedNode();
		if (sNode) {
			this.config.rd = sNode;
			var win = new bosswg.ipp.serviceConfigWin(this.config);
			var roleP = new bosswg.ipp.rolePanel(this.config);
			win.setTitle("配置信息-" + sNode.attributes.SERV_NAME)
			win.showTab.add(roleP);
			win.showTab.setActiveTab(roleP);
			if (sNode.attributes.SERV_TYPE == '0SB') {
				var sup = new bosswg.ipp.subscribePanel(this.config);
				win.showTab.add(sup);
				var servp = new bosswg.ipp.servParaPanel(this.config);
				win.showTab.add(servp);
                var serop=new bosswg.ipp.servOtherPanel(this.config);
                win.showTab.add(serop);
			}
		} else {
			alert('请选中一条记录');
			return false;
		}

	},
	onDeleteNodeFn : function() {
		var sNode = this.tree.getSelectionModel().getSelectedNode();
		if (sNode) {
			Ext.MessageBox.confirm('提示', '您确定要删除服务('
							+ sNode.attributes.SERV_NAME + ')的注册信息', function(
							btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
								waitMsg : '数据提交中...',
								waitTitle : '信息',
								url : '/servlet/ippAction.do?method=createEditDelService',
								params : {
									servId : sNode.attributes.SERV_ID,
									saveType : 'del'
								},
								callback : function(options, success, response) {
									var responseArray = Ext.util.JSON
											.decode(response.responseText);
									if (responseArray.success == true) {
										Ext.Msg.alert('成功',
												sNode.attributes.SERV_NAME
														+ '的信息已经删除');

										sNode.parentNode.removeChild(sNode);

									} else {
										Ext.Msg.alert('失败', '数据库交互繁忙');
									}
								},
								scope : this
							});
						}
					}, this)
		}
	},
	onDblclickFn : function(node, e) {
		if (node.attributes.PARENT_SERV_ID != '-1') {
			this.config.editNode = node;
			delete this.config.addNode;
			this.config.saveType = "edit";
			this.config.owner = this;
			var win = new bosswg.ipp.serviceWin(this.config);
			var items = this.topToolbar.items;
			items.item("editNode2").setDisabled(true);
			items.item("deleteNode3").setDisabled(true);
			win.on('creationsuccess', function() {
						/*
						 * var nodep =
						 * this.tree.getNodeById(this.config.nodeId); if (nodep) {
						 * nodep.reload(); } else {
						 * this.tree.getNodeById(0).reload(); }
						 */
						this.tree.getNodeById(0).reload();

					}, this)
		}
	},
	onTreeClickFn : function(node) {
		var items = this.topToolbar.items;
		if (node.attributes.PARENT_SERV_ID == '-1') {
			items.item("editNode2").setDisabled(true);
			items.item("deleteNode3").setDisabled(true);
			items.item("configNode4").setDisabled(true);

		} else {
			items.item("editNode2").setDisabled(false);
			items.item("deleteNode3").setDisabled(false);
			items.item("configNode4").setDisabled(false);
		}

	},
	onAddNodeFn : function() {
		var sNode = this.tree.getSelectionModel().getSelectedNode();
		if (sNode) {
			this.config.addNode = sNode;
		} else {
			delete this.config.addNode;
		}
		delete this.config.editNode;
		this.config.saveType = "add";
		this.config.owner = this;
		var win = new bosswg.ipp.serviceWin(this.config);
		win.on('creationsuccess', function() {
					/*
					 * var nodep = this.tree.getNodeById(this.config.nodeId); if
					 * (nodep) { nodep.reload(); } else {
					 * this.tree.getNodeById(0).reload(); }
					 */
					this.tree.getNodeById(0).reload();

				}, this)
	},
	onEditNodeFn : function() {
		var sNode = this.tree.getSelectionModel().getSelectedNode();
		if (sNode) {
			this.config.editNode = sNode;
		} else {
			alert('必须选择一条记录才能继续修改')
			return false;
		}
		delete this.config.addNode;
		this.config.saveType = "edit";
		this.config.owner = this;
		var win = new bosswg.ipp.serviceWin(this.config);
		var items = this.topToolbar.items;
		items.item("editNode2").setDisabled(true);
		items.item("deleteNode3").setDisabled(true);
		win.on('creationsuccess', function() {
					/*
					 * var nodep = this.tree.getNodeById(this.config.nodeId); if
					 * (nodep) { nodep.reload(); } else {
					 * this.tree.getNodeById(0).reload(); }
					 */
					this.tree.getNodeById(0).reload();
				}, this)
	}
})
// ***********************************************
bosswg.ipp.CreateIppBsWin = function(config) {

	// Ext.apply(this, config);
	this.config = config;
	this.bsChname = new Ext.form.TextField({
				name : 'bsChname',
				fieldLabel : '业务系统标识(中文)',
				maxLength : 4,
				maxLengthText : '名称太长',
				regex : /^[\u4e00-\u9fa5]+$/,
				regexText : '标识只能是中文',
				msgTarget : 'side',
				style : 'margin-top:2px',
				allowBlank : false,
				blankText : '标识不能为空',
				anchor : '90%',
				labelSeparator : '：'
			})
	this.bsEnname = new Ext.form.TextField({
				name : 'bsEnname',
				fieldLabel : '业务系统标识(英文)',
				regex : /^[a-zA-Z0-9_]{3,18}$/,
				regexText : '不是有效英文标识',
				allowBlank : false,
				blankText : '英文标识不能为空',
				msgTarget : 'side',
				style : 'margin-top:2px',
				anchor : '90%',
				labelSeparator : '：'
			})
	this.bsIp = new Ext.form.TextField({
				name : 'bsIp',
				fieldLabel : '验证Ip地址',
				regexText : '不是有效Ip地址',
				regex : /\d+\.\d+\.\d+\.\d+/,
				msgTarget : 'side',
				style : 'margin-top:2px',
				anchor : '90%',
				labelSeparator : '：'
			})
	this.outUser = new Ext.form.TextField({
				name : 'outUser',
				fieldLabel : '验证用户',
				style : 'margin-top:2px',
				maxLength : 19,
				anchor : '90%',
				labelSeparator : '：'
			})

	this.outPass = new Ext.form.TextField({
				name : 'outPass',
				fieldLabel : '验证密码',
				style : 'margin-top:2px',
				maxLength : 19,
				anchor : '90%',
				labelSeparator : '：'
			})
	this.allowLogin = new Ext.form.ComboBox({
				// name : "allowLogin",
				msgTarget : 'side',
				labelSeparator : '：',
				anchor : '90%',
				hiddenName : "state",
				fieldLabel : "是否允许接入",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '有效'], ['0SX', '无效']]
						}),
				valueField : "value",
				displayField : "text",
				value : '0SA',
				mode : "local",
				triggerAction : "all",
				allowBlank : false,
				editable : true
			});
	this.inUser = new Ext.form.TextField({
				name : 'inUser',
				fieldLabel : '接入用户',
				style : 'margin-top:2px',
				maxLength : 19,
				anchor : '90%',
				labelSeparator : '：'
			})

	this.inPass = new Ext.form.TextField({
				name : 'inPass',
				fieldLabel : '接入密码',
				style : 'margin-top:2px',
				maxLength : 19,
				anchor : '90%',
				labelSeparator : '：'
			})
	this.inTime = new Ext.form.TextField({
				name : 'inTime',
				fieldLabel : '接入有效时长',
				style : 'margin-top:2px',
				regexText : '不是有效正整数',
				regex : /^\d+$/,
				msgTarget : 'side',
				maxLength : 9,
				anchor : '90%',
				labelSeparator : '：'
			})
	this.submitForm = new Ext.FormPanel({
				labelWidth : 130,
				border : false,
				style : 'padding:2',
				frame : true,
				autoScroll : true,
				items : [this.bsChname, this.bsEnname, this.bsIp, this.outUser,
						this.outPass, this.allowLogin, this.inUser,
						this.inPass, this.inTime]

			})
	bosswg.ipp.CreateIppBsWin.superclass.constructor.call(this, {
				title : '业务系统信息',
				layout : 'fit',
				collapsible : false,
				closable : true,
				closeAction : 'close',
				iconCls : 'bsList1',
				modal : true,
				roleId : '',
				draggable : true,
				layout : 'fit',
				resizable : false,
				// x:0,
				y : 10,
				width : 400,// (Ext.getBody().getSize().width -50),
				height : 360,// (Ext.getBody().getSize().height-25),
				// constrain : true,
				items : [this.submitForm],
				buttonAlign : 'right',
				buttons : [{
							text : '保存',
							iconCls : 'queryAdd1',
							handler : this.onSaveFn,
							scope : this
						}, {
							text : '退出',
							iconCls : 'closeWin',
							handler : function() {
								this.close()
							},
							scope : this
						}]
			});
	this.on('afterlayout', this.onAfterlayoutFn, this, {
				single : true
			});
	this.show();

}
Ext.extend(bosswg.ipp.CreateIppBsWin, Ext.Window, {

			onAfterlayoutFn : function() {
				if (this.config.rd) {
					var data = this.config.rd;
					this.bsChname.setValue(data.BS_CHNAME);
					this.bsEnname.setValue(data.BS_ENNAME);
					this.bsIp.setValue(data.BS_IP);
					this.outUser.setValue(data.OUT_USER);
					this.outPass.setValue(data.OUT_PASS);
					this.allowLogin.setValue(data.ALLOW_LOGIN);
					this.inUser.setValue(data.IN_USER);
					this.inPass.setValue(data.IN_PASS);
					this.inTime.setValue(data.IN_TIME);

				}
			},
			onSaveFn : function() {
				// this.bsIp, ,this.outPass,

				if (this.submitForm.form.isValid()) {
					if (this.bsIp.getValue() != '') {
						if (this.outUser.getValue() == '') {
							alert('验证地址不为空时、验证用户必须填写');
							this.outUser.focus();
							return false;
						}
						if (this.outPass.getValue() == '') {
							alert('验证地址不为空时、验证密码必须填写');
							this.outPass.focus();
							return false;
						}
					}
					if (this.allowLogin.getValue() == '0SA') {
						if (this.inUser.getValue() == '') {
							alert('允许接入为有效时、接入用户必须填写');
							this.inUser.focus();
							return false;
						}
						if (this.inPass.getValue() == '') {
							alert('允许接入为有效时、接入密码必须填写');
							this.inPass.focus();
							return false;
						}
						if (this.inTime.getValue() == '') {
							alert('允许接入为有效时、接入有效时长必须填写');
							this.inTime.focus();
							return false;
						}
					}

					params = {
						saveType : this.config.saveType,
						allowLogin : this.allowLogin.getValue()
					};
					if (this.config.rd) {
						params.bsId = this.config.rd.BS_ID;
					}
					this.submitForm.form.submit({
								clientValidation : true,
								waitMsg : '数据提交中...',
								waitTitle : '信息',
								params : params,
								url : '/servlet/ippAction.do?method=addEditDelIppBs',
								method : 'post',
								failure : function(form, action) {
									Ext.MessageBox.alert('错误', '填写的数据没有通过验证');
								},
								success : function(form, action) {
									if (action.result.success == true) {
										Ext.MessageBox.alert('成功', '数据已经保存');
										this.close();
										this.config.owner.getStore().reload();
									} else {
										Ext.MessageBox.alert('失败',
												'数据保存失败,请重新尝试');
									}
								},
								scope : this
							});
				}
			}
		})
// *****************************************************
bosswg.ipp.BSListPanel = function(config) {
	this.config = config || {};
	this.config['_makepn']['bosswg.ipp.BSListPanel'] = this;
	this.dstore = new Ext.data.Store({
				// pruneModifiedRecords : true,
				// id : 'hds',
				autoLoad : true,
				proxy : new Ext.data.HttpProxy({
							url : '/servlet/ippAction.do?method=getIppBsList'

						}),
				reader : new Ext.data.JsonReader({
							root : 'rows'

						}, [{
									name : 'BS_ID'
								}, {
									name : 'BS_ENNAME'
								}, {
									name : 'BS_CHNAME'
								}, {
									name : 'BS_IP'
								}, {
									name : 'OUT_USER'
								}, {
									name : 'OUT_PASS'
								}, {
									name : 'STAT'
								}, {
									name : 'ALLOW_LOGIN'
								}, {
									name : 'IN_USER'
								}, {
									name : 'IN_PASS'
								}, {
									name : 'IN_TIME'
								}]),
				remoteSort : true

			});

	var colModel = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				header : '中文名称',
				dataIndex : 'BS_CHNAME',
				menuDisabled : true,
				width : 130
			}, {
				header : '英文标识',
				dataIndex : 'BS_ENNAME',
				menuDisabled : true,
				width : 130
			}, {
				header : '验证Ip',
				dataIndex : 'BS_IP',
				menuDisabled : true,
				width : 130
			}, {
				header : '验证用户',
				dataIndex : 'OUT_USER',
				menuDisabled : true,
				width : 130
			}, {
				header : '验证密码',
				dataIndex : 'OUT_PASS',
				menuDisabled : true,
				width : 130
			}, {
				header : '允许接入用户',
				dataIndex : 'ALLOW_LOGIN',
				menuDisabled : true,
				renderer : function(val) {
					if (val == '0SA') {
						return '有效'
					} else {
						return '无效'
					}
				},

				width : 120
			}, {
				header : '接入密码',
				dataIndex : 'IN_PASS',
				menuDisabled : true,
				width : 130
			}, {
				header : '接入有效时长',
				dataIndex : 'IN_TIME',
				menuDisabled : true,
				width : 130
			}

	]);
	bosswg.ipp.BSListPanel.superclass.constructor.call(this, {
				title : '业务系统信息',
				iconCls : 'bsList1',
				tbar : [{
							text : '增加',
							handler : this.onAddFn,
							iconCls : 'icon-add',
							scope : this
						}, '&nbsp;&nbsp;', {
							text : '修改',
							iconCls : 'icon-edit',
							handler : this.onEditFn,
							scope : this
						}, '&nbsp;&nbsp;', {
							text : '删除',
							iconCls : 'icon-del',
							handler : this.onDeleteFn,
							scope : this
						}],
				cm : colModel,
				listeners : {
					rowdblclick : {
						fn : this.onRowDblClickFn,
						scope : this
					}
				},
				border : false,
				autoScroll : true,
				selModel : new Ext.grid.RowSelectionModel({
							singleSelect : false
						}),
				sm : new Ext.grid.RowSelectionModel({
							singleSelect : true
						}),
				store : this.dstore,
				loadMask : {
					msg : '数据载入中...'
				},
				viewConfig : {
					forceFit : false
				}
			});

}

Ext.extend(bosswg.ipp.BSListPanel, Ext.grid.GridPanel, {
	onRowDblClickFn : function(grid, rowIndex, e) {
		this.config.owner = this
		this.config.saveType = "edit";
		this.config.rd = grid.getStore().getAt(rowIndex).data;
		var cew = new bosswg.ipp.CreateIppBsWin(this.config);
	},
	onAddFn : function() {

		this.config.owner = this
		this.config.saveType = "add";
		if (this.config.rd) {
			delete this.config.rd;
		}
		var cew = new bosswg.ipp.CreateIppBsWin(this.config);
	},
	onEditFn : function() {
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('请选择一条记录修改!');
			return false;
		}
		this.config.owner = this;
		this.config.saveType = "edit";
		this.config.rd = records[0].data;
		var cew = new bosswg.ipp.CreateIppBsWin(this.config);
	},
	onDeleteFn : function() {
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('请选择一条记录修改!');
			return false;
		}
		Ext.MessageBox.confirm('提示', '您确定要删除用户(' + records[0].data.BS_CHNAME
						+ ')的注册信息', function(btn) {
					if (btn == 'yes') {
						Ext.Ajax.request({
							waitMsg : '数据提交中...',
							waitTitle : '信息',
							url : '/servlet/ippAction.do?method=addEditDelIppBs',
							params : {
								bsId : records[0].data.BS_ID,
								saveType : 'del'
							},
							callback : function(options, success, response) {
								var responseArray = Ext.util.JSON
										.decode(response.responseText);
								if (responseArray.success == true) {
									Ext.Msg.alert('成功',
											records[0].data.BS_CHNAME
													+ '的信息已经删除');
									this.getStore().reload();
								} else {
									Ext.Msg.alert('失败', '数据库交互繁忙');
								}
							},
							scope : this
						});
					}
				}, this)
	}

});

bosswg.ipp.CenterPanel = function(config) {
	this.userListPanel = new bosswg.ipp.BSListPanel(config);
	this.servicePanel = new bosswg.ipp.servicePanel(config);
	this.mediaList = new bosswg.ipp.MediaListPanel(config);
	bosswg.ipp.CenterPanel.superclass.constructor.call(this, {
		id : 'daily_chck_center_tab',
		border : false,
		activeTab : 0,
		deferredRender : true,
		// plain:true,
		minTabWidth : 135,
		// layout:'fit',
		tabWidth : 135,
		enableTabScroll : true,
		height : 400,
		listeners : {
			tabchange : {
				fn : this.tabChangeFn,
				scope : this
			}
		},
		items : [this.servicePanel, this.userListPanel, this.mediaList]
			// hideMode:'offsets',

		});
}

Ext.extend(bosswg.ipp.CenterPanel, Ext.TabPanel, {
			tabChangeFn : function(tabpanel, panel) {

			}
		});
// ************************************
bosswg.ipp.MainPanel = function(config) {
	config = config || {};
	config['_makepn'] = {
		'MainPanel' : this
	};
	var e = document.body;
	this.centerTabPanel = new bosswg.ipp.CenterPanel(config);
	Ext.EventManager.onWindowResize(this.fireResize.createDelegate(this));
	bosswg.ipp.MainPanel.superclass.constructor.call(this, {
				closable : true,
				draggable : false,
				border : true,
				// frame:true,
				autoScroll : true,
				layout : 'fit',
				items : [this.centerTabPanel],
				renderTo : Ext.getBody(),
				width : e.clientWidth,
				height : e.clientHeight,
				constrain : true
			});

}

Ext.extend(bosswg.ipp.MainPanel, Ext.Panel, {
			fireResize : function() {
				var e = document.body;
				this.setSize(e.clientWidth, e.clientHeight);
				this.doLayout();
			}
		});

function initPage() {
	Ext.QuickTips.init();
	new bosswg.ipp.MainPanel({
				uid : 1
			});

}
