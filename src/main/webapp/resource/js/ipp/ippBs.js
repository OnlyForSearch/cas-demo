Ext.namespace("bosswg.ipp");
Ext.LoadMask.prototype.msg = "����������...";
Ext.BLANK_IMAGE_URL = '../../resource/js/ext-2.0.2/resources/images/default/s.gif';

bosswg.ipp.CreateMediaWin = function(config) {

	// Ext.apply(this, config);
	this.config = config;
	this.mediaType = new Ext.form.ComboBox({
				// name : "allowLogin",
				msgTarget : 'side',
				labelSeparator : '��',
				anchor : '90%',
				hiddenName : "state",
				fieldLabel : "ý������",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '����'], ['0SB', '����'],
									['0SC', '�ʼ�'], ['0SX', 'δ����'],
									['0SD', '����']]
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
				fieldLabel : '�����ַ',
				style : 'margin-top:2px',
				maxLength : 48,
				maxLengthText : '�����ַ���Ȳ��ܳ���50',
				anchor : '95%',
				labelSeparator : '��'
			})
	this.mediaPort = new Ext.form.TextField({
				name : 'mediaPort',
				fieldLabel : '����˿�',
				style : 'margin-top:2px',
				maxLength : 19,
				maxLengthText : '����˿ڳ��Ȳ��ܳ���20',
				anchor : '90%',
				labelSeparator : '��'
			})
	this.inTimeout = new Ext.form.TextField({
				name : 'inTimeout',
				fieldLabel : '���볬ʱʱ��',
				regexText : '����Ϊ������',
				regex : /^\d+$/,
				style : 'margin-top:2px',
				maxLength : 5,
				maxLengthText : '���볬ʱʱ���Ȳ��ܳ���5',
				anchor : '90%',
				labelSeparator : '��'
			})
	this.inUser = new Ext.form.TextField({
				name : 'inUser',
				fieldLabel : '�����û�',
				style : 'margin-top:2px',
				maxLength : 19,
				maxLengthText : '�����û����Ȳ��ܳ���20',
				anchor : '90%',
				labelSeparator : '��'
			})
	this.inPass = new Ext.form.TextField({
				name : 'inPass',
				fieldLabel : '��������',
				style : 'margin-top:2px',
				maxLength : 19,
				maxLengthText : '�������볤�Ȳ��ܳ���20',
				anchor : '90%',
				labelSeparator : '��'
			})
	this.sendTimeOut = new Ext.form.TextField({
				name : 'sendTimeOut',
				fieldLabel : '���ͳ�ʱʱ��',
				regexText : '����Ϊ������',
				regex : /^\d+$/,
				style : 'margin-top:2px',
				maxLength : 5,
				maxLengthText : '���Ȳ��ܳ���5',
				anchor : '90%',
				labelSeparator : '��'
			})
	this.extConfig = new Ext.form.HtmlEditor({
				name : 'extConfig',
				height : 170,
				sourceEditMode : false,
				fieldLabel : '��չ������Ϣ',
				anchor : '95%',
				maxLength : 3800,
				maxLengthText : '���Ȳ��ܳ���4000',
				enableSourceEdit : true,
				enableLinks : false,
				enableLists : false,
				fontFamilies : ['����', '����', '����']
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
				title : 'ҵ��ϵͳ��Ϣ',
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
							text : '����',
							iconCls : 'queryAdd1',
							handler : this.onSaveMediaFn,
							scope : this
						}, {
							text : '�˳�',
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
						waitMsg : '�����ύ��...',
						waitTitle : '��Ϣ',
						params : params,
						url : '/servlet/ippAction.do?method=createEditDelMedia',
						method : 'post',
						failure : function(form, action) {
							Ext.MessageBox.alert('����', '��д������û��ͨ����֤');
						},
						success : function(form, action) {
							if (action.result.success == true) {
								Ext.MessageBox.alert('�ɹ�', '�����Ѿ�����');
								this.config.owner.getStore().reload();
								this.close();
							} else {
								Ext.MessageBox.alert('ʧ��', '���ݱ���ʧ��,�����³���');
							}
						},
						scope : this
					});
		}
	}
})

//����ý��*********************************
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
				header : 'ý������',
				dataIndex : 'MEDIA_TYPE_NAME',
				menuDisabled : true,
				width : 80
			}, {
				header : '�����ַ',
				dataIndex : 'MEDIA_IP',
				menuDisabled : true,
				width : 230
			}, {
				header : '����˿�',
				dataIndex : 'MEDIA_PORT',
				menuDisabled : true,
				width : 130
			}, {
				header : '�����û�',
				dataIndex : 'IN_USER',
				menuDisabled : true,
				width : 130
			}, {
				header : '��������',
				dataIndex : 'IN_PASS',
				menuDisabled : true,
				width : 130
			}, {
				header : '���볬ʱʱ��',
				dataIndex : 'IN_TIMEOUT',
				menuDisabled : true,

				width : 120
			}, {
				header : '������Ϣ��ʱʱ��',
				dataIndex : 'IN_PASS',
				menuDisabled : true,
				width : 100
			}, {
				header : '������Чʱ��',
				dataIndex : 'SEND_TIMEOUT',
				menuDisabled : true,
				width : 100
			}

	]);
	bosswg.ipp.MediaListPanel.superclass.constructor.call(this, {
				title : '����ý����Ϣ',
				iconCls : 'mediaList1',
				tbar : [{
							text : '����',
							iconCls : 'icon-add',
							handler : this.onAddMediaFn,
							scope : this
						}, '&nbsp;&nbsp;', {
							text : '�޸�',
							iconCls : 'icon-edit',
							handler : this.onEditMediaFn,
							scope : this
						}, '&nbsp;&nbsp;', {
							text : 'ɾ��',
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
					msg : '����������...'
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
			alert('��ѡ��һ����¼�޸�!');
			return false;
		}
		var url = '/servlet/ippAction.do?method=createEditDelMedia&saveType=del&MEDIA_ID='
				+ records[0].data.MEDIA_ID;
		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
		sendRequest.open("post", url, false);
		sendRequest.send(null);
		var responseInfo = Ext.util.JSON.decode(sendRequest.responseText);
		if (responseInfo.success) {
			alert('ɾ���ɹ�');
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
			alert('��ѡ��һ����¼�޸�!');
			return false;
		}
		this.config.owner = this;
		this.config.saveType = "edit";
		this.config.rd = records[0].data;
		var cmw = new bosswg.ipp.CreateMediaWin(this.config);
	}

});

// ��������******************************************************
//*******************��������
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
				labelSeparator : '��',
				anchor : '80%',
				fieldLabel : "���񷢲�ý�����",
				// hideOnSelect:false,
				allowBlank:false,
				blankText:'�����Ϊ��',
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
										text : '����/�޸�',
										handler : this.onSaveParaFn,
										scope : this
									}]
						}]

			})
	bosswg.ipp.servOtherPanel.superclass.constructor.call(this, {
				title : '��������',
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
								waitMsg : '�����ύ��...',
								waitTitle : '��Ϣ',
								params : params,
								url : '/servlet/ippAction.do?method=createEditServOtherConfig',
								method : 'post',
								failure : function(form, action) {
									Ext.MessageBox.alert('����', '��д������û��ͨ����֤');
								},
								success : function(form, action) {
									if (action.result.success == true) {
										Ext.MessageBox.alert('�ɹ�', '�����Ѿ�����');
									} else {
										Ext.MessageBox.alert('ʧ��',
												'���ݱ���ʧ��,�����³���');
									}
								},
								scope : this
							});
				}
			}
		});
//***************ȡ������
bosswg.ipp.servParaPanel = function(config) {
	// Ext.apply(this, config);
	this.config = config;
	this.papaName = new Ext.form.TextField({
				name : 'papaName',
				fieldLabel : '��������(Ӣ��)',
				regex : /^[a-zA-Z0-9_]{3,18}$/,
				regexText : '������ЧӢ�ı�ʶ',
				labelSeparator : '��',
				maxLength : 48,
				maxLengthText : '�������Ʋ��ܳ���50λ',
				style : 'margin-top:2',
				anchor : '80%',
				msgTarget : 'side'
			})
	this.defaultVal = new Ext.form.TextField({
				name : 'defaultVal',
				fieldLabel : 'Ĭ��ֵ',
				labelSeparator : '��',
				maxLength : 48,
				maxLengthText : '�������Ʋ��ܳ���50λ',
				style : 'margin-top:2',
				anchor : '80%',
				msgTarget : 'side'
			})
	this.order = new Ext.form.TextField({
				name : 'order',
				fieldLabel : '���',
				regexText : '��ű���Ϊ������',
				allowBlank:false,
				blankText:'��Ų���Ϊ��',
				regex : /^\d+$/,
				labelSeparator : '��',
				maxLength : 2,
				maxLengthText : 'ֻ������λ��',
				style : 'margin-top:2',
				anchor : '80%',
				msgTarget : 'side'
			})
	this.paraType = new Ext.form.ComboBox({
		// name:'grid',
		labelSeparator : '��',
		anchor : '80%',
		fieldLabel : "����",
		store : new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : [['0SA', '�ַ���'], ['0SB', '����'], ['0SC', '����'], ['0SD', '����']]
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
				header : '��������',
				// align : 'center',
				dataIndex : 'PARA_NAME',
				menuDisabled : true,
				// renderer:
				width : 150
			}, {
				header : '��������',
				dataIndex : 'PARA_TYPE',
				menuDisabled : true,
				width : 100
			}, {
				header : 'Ĭ��ֵ',
				dataIndex : 'DEFAULT_VAL',
				menuDisabled : true,
				width : 100
			}, {
				header : '���',
				dataIndex : 'ORDERS',
				menuDisabled : true,
				width : 100
			}

	]);
	this.paraGrid = new Ext.grid.GridPanel({
				tbar : [{
							text : '����',
							handler : this.onAddPapaFn,
							iconCls : 'icon-add',
							scope : this
						}, '-', '&nbsp;&nbsp;', {
							text : '�޸�',
							iconCls : 'icon-edit',
							handler : this.onEditPapaFn,
							scope : this
						}, '-', '&nbsp;&nbsp;', {
							text : 'ɾ��',
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
					msg : '����������...'
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
										text : '����/�޸�',
										handler : this.onSaveParaFn,
										scope : this
									}, {
										text : '����',
										iconCls : 'icon-undo',
										handler : function() {
											this.getLayout().setActiveItem(0);
										},
										scope : this
									}]
						}]

			})
	bosswg.ipp.servParaPanel.superclass.constructor.call(this, {
				title : 'ȡ������',
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
			alert('��ѡ��һ��Ҫɾ���ļ�¼!');
			return false;
		}
		Ext.Ajax.request({
			waitMsg : '�����ύ��...',
			waitTitle : '��Ϣ',
			url : '/servlet/ippAction.do?method=createEditPara',
			params : {
				papaName:records[0].data.PARA_NAME,
				saveType:'del',
				SERV_ID : this.config.rd.attributes.SERV_ID
				
			},
			callback : function(options, success, response) {
				var responseArray = Ext.util.JSON.decode(response.responseText);
				if (responseArray.success == true) {
					Ext.Msg.alert('�ɹ�', 'ѡ�еļ�¼�Ѿ�ɾ��');
					this.paraGrid.getStore().reload();
				} else {
					Ext.Msg.alert('ʧ��', '���ݿ⽻����æ');
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
			alert('��ѡ��һ����¼�޸�!');
			return false;
		}
		var rd = records[0].data;
		this.config.saveType = "edit";
		this.config.oldPapaName=rd.PARA_NAME;//���ڱ������õ�����Ϊ��������
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
								waitMsg : '�����ύ��...',
								waitTitle : '��Ϣ',
								params : params,
								url : '/servlet/ippAction.do?method=createEditPara',
								method : 'post',
								failure : function(form, action) {
									Ext.MessageBox.alert('����', '��д������û��ͨ����֤');
								},
								success : function(form, action) {
									if (action.result.success == true) {
										this.onActivateFn();
										Ext.MessageBox.alert('�ɹ�', '�����Ѿ�����');
									} else {
										Ext.MessageBox.alert('ʧ��',
												'���ݱ���ʧ��,�����³���');
									}
								},
								scope : this
							});
				}
			}
		});
// ������Ϣ*****************************
bosswg.ipp.subscribePanel = function(config) {
	// Ext.apply(this, config);
	this.config = config;
	this.subscrDays = new Ext.form.TextField({
				name : 'subscrDays',
				fieldLabel : '������Ч����',
				regexText : '������Ч��������Ϊ������',
				regex : /^\d+$/,
				labelSeparator : '��',
				maxLength : 3,
				maxLengthText : 'ֻ������λ��',
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
				labelSeparator : '��',
				anchor : '90%',
				fieldLabel : "������",
				// hideOnSelect:false,
				editable : false,
				maxHeight : 200,
				store : this.userIdStore,
				triggerAction : 'all',
				valueField : 'USER_ID',
				displayField : 'REAL_NAME',
				allowBlank : false,
				blankText : '�����߱�ʶ����Ϊ��',
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
										text : '����',
										handler : this.onSaveSubFn,
										iconCls : 'queryAdd1',
										scope : this
									}, {
										text : '����',
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
				header : '������',
				// align : 'center',
				dataIndex : 'REAL_NAME',
				menuDisabled : true,
				// renderer:
				width : 130
			}, {
				header : '������Ч����',
				dataIndex : 'SUBSCR_DAYS',
				menuDisabled : true,
				width : 130
			}, {
				header : '���Ŀ�ʼʱ��',
				dataIndex : 'GENERATE',
				menuDisabled : true,
				width : 150
			}

	]);
	this.subeGrid = new Ext.grid.GridPanel({
				tbar : [{
							text : '����',
							handler : this.onAddsubFn,
							iconCls : 'icon-add',
							scope : this
						}, '-', '&nbsp;&nbsp;', {
							text : '�޸�',
							iconCls : 'icon-edit',
							handler : this.onEditSubFn,
							scope : this
						}, '-', '&nbsp;&nbsp;', {
							text : 'ɾ��',
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
					msg : '����������...'
				}
			})
	bosswg.ipp.subscribePanel.superclass.constructor.call(this, {
				title : '������Ϣ',
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
			alert('��ѡ��һ��Ҫɾ���ļ�¼!');
			return false;
		}
		Ext.Ajax.request({
			waitMsg : '�����ύ��...',
			waitTitle : '��Ϣ',
			url : '/servlet/ippAction.do?method=createEditDelSubscribe',
			params : {
				saveType : 'del',
				subId : records[0].data.SUBSCR_ID
			},
			callback : function(options, success, response) {
				var responseArray = Ext.util.JSON.decode(response.responseText);
				if (responseArray.success == true) {
					Ext.Msg.alert('�ɹ�', 'ѡ�еļ�¼�Ѿ�ɾ��');
					this.subeGrid.getStore().reload();
				} else {
					Ext.Msg.alert('ʧ��', '���ݿ⽻����æ');
				}
			},
			scope : this
		});
	},
	onEditSubFn : function() {
		var sm = this.subeGrid.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('��ѡ��һ����¼�޸�!');
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
						waitMsg : '�����ύ��...',
						waitTitle : '��Ϣ',
						params : params,
						url : '/servlet/ippAction.do?method=createEditDelSubscribe',
						method : 'post',
						failure : function(form, action) {
							Ext.MessageBox.alert('����', '��д������û��ͨ����֤');
						},
						success : function(form, action) {
							if (action.result.success == true) {
								Ext.MessageBox.alert('�ɹ�', '�����Ѿ�����');
								this.subeGrid.getStore().reload();
								this.getLayout().setActiveItem(0)
							} else {
								Ext.MessageBox.alert('ʧ��', '���ݱ���ʧ��,�����³���');
							}
						},
						scope : this
					});
		}
	}
})
// Ȩ��������***********************************************
bosswg.ipp.rolePanel = function(config) {
	// Ext.apply(this, config);
	this.config = config;
	this.roleType = new Ext.form.ComboBox({
				// name:'grid',
				labelSeparator : '��',
				anchor : '90%',
				fieldLabel : "Ȩ������",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '��ɫ'], ['0SB', '�û�']]
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
				blankText : 'Ȩ�����ͱ���ѡ��',
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
				labelSeparator : '��',
				anchor : '90%',
				fieldLabel : "Ȩ��ʵ���ʶ",
				// hideOnSelect:false,
				editable : false,
				maxHeight : 200,
				store : this.roleIdStore,
				triggerAction : 'all',
				valueField : 'RID',
				displayField : 'RNAME',
				allowBlank : false,
				blankText : 'Ȩ��ʵ���ʶ����Ϊ��',
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
										text : '����',
										iconCls : 'queryAdd1',
										handler : this.onSaveRoleFn,
										scope : this
									}, {
										text : '����',
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
		header : '��ɫ����',
		// align : 'center',
		// dataIndex : 'ROLE_NAME',
		menuDisabled : true,
		renderer : function(value, metadata, record, rowIndex, colIndex, store) {
			var rd = record.data;
			return rd.ROLE_NAME;
		},
		width : 250
	}, {
		header : '��ɫ����',
		dataIndex : 'ROLE_TYPE',
		// hideable : true,
		// hidden : true,
		renderer : function(val) {
			if (val == '0SA') {
				return '<font color="#9400D3">��ɫ</font>'
			} else {
				return '<font color="#FF4500">�û�</font>'
			}

		},
		menuDisabled : true,
		width : 180
	}

	]);
	this.roleGrid = new Ext.grid.GridPanel({
				tbar : [{
							text : '����',
							iconCls : 'icon-add',
							handler : this.onAddRoleFn,
							scope : this
						}, '-', '&nbsp;&nbsp;', {
							text : 'ɾ��',
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
					msg : '����������...'
				}
			})
	bosswg.ipp.rolePanel.superclass.constructor.call(this, {
				title : '��ѯȨ��',
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
			alert('��ѡ��һ����¼�޸�!');
			return false;
		}
		Ext.Ajax.request({
			waitMsg : '�����ύ��...',
			waitTitle : '��Ϣ',
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
					Ext.Msg.alert('�ɹ�', 'ѡ�еļ�¼�Ѿ�ɾ��');
					// {params:{hello:'ddffdfd'}}
					this.roleGrid.getStore().reload();
				} else {
					Ext.Msg.alert('ʧ��', '���ݿ⽻����æ');
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
						waitMsg : '�����ύ��...',
						waitTitle : '��Ϣ',
						params : params,
						url : '/servlet/ippAction.do?method=createEditDelServRole',
						method : 'post',
						failure : function(form, action) {
							Ext.MessageBox.alert('����', '��д������û��ͨ����֤');
						},
						success : function(form, action) {
							if (action.result.success == true) {
								Ext.MessageBox.alert('�ɹ�', '�����Ѿ�����');
								this.roleGrid.getStore().reload();
								this.getLayout().setActiveItem(0)
							} else {
								Ext.MessageBox.alert('ʧ��', '���ݱ���ʧ��,�����³���');
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
			alert('��ѡ������');
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
// ���ô���****************************************************************
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
				// title : '����',
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
							text : '�˳�',
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
				fieldLabel : '��������',
				labelSeparator : '��',
				style : 'margin-top:2',
				anchor : '90%',
				msgTarget : 'title',
				maxLength : 48,
				maxLengthText : '������볤�Ȳ��ܳ���50',
				allowBlank : false,
				blankText : '�����������Ʋ���Ϊ��'
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
					text : '������',
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
		fieldLabel : "�������ʶ",
		maxHeight : 150,
		anchor : '90%',
		allowBlank : false,
		blankText : '�������ʶ����ѡ��',
		selectParentId : '',
		labelSeparator : '��',
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
				labelSeparator : '��',
				anchor : '90%',
				fieldLabel : "�������",
				msgTarget : 'title',
				emptyText : '��ѡ��...',
				allowBlank : false,
				blankText : '����������ѡ��',
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', 'Ŀ¼'], ['0SB', '����']]
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
				labelSeparator : '��',
				anchor : '90%',
				fieldLabel : "������",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '����'], ['0SB', '��ֹ']]
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
				labelSeparator : '��',
				anchor : '90%',
				fieldLabel : "������",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '����'], ['0SB', '��ֹ']]
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
				fieldLabel : '�������',
				labelSeparator : '��',
				style : 'margin-top:2',
				anchor : '90%',
				msgTarget : 'title',
				maxLength : 48,
				maxLengthText : '������볤�Ȳ��ܳ���50',
				allowBlank : false,
				blankText : '������벻��Ϊ��'
			})
	this.smsCode = new Ext.form.TextField({
				name : 'smsCode',
				fieldLabel : '���ű���',
				labelSeparator : '��',
				style : 'margin-top:2',
				anchor : '90%',
				msgTarget : 'title',
				maxLength : 20,
				allowBlank : false,
				blankText : '���ű��벻��Ϊ��',
				maxLengthText : '���ű��볤�Ȳ��ܳ���20'
			})
	this.method = new Ext.form.TextField({
				name : 'ippMethod',
				fieldLabel : 'ȡ������',
				labelSeparator : '��',
				style : 'margin-top:2',
				anchor : '90%',
				msgTarget : 'title',
				maxLength : 50,
				maxLengthText : 'ȡ���������Ȳ��ܳ���50'
			})
	this.actionUrl = new Ext.form.TextField({
				name : 'actionUrl',
				fieldLabel : 'ȡ����ַ',
				labelSeparator : '��',
				// regex:/(http\:\/\/)?([\w.]+)(\/[\w-\.\/\?%&=]*)?/gi,
				// regexText:'��������Ч����ַ',
				style : 'margin-top:2',
				anchor : '90%',
				msgTarget : 'title',
				maxLength : 198,
				maxLengthText : 'ȡ���������Ȳ��ܳ���200'
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
				fieldLabel : "ҵ��ϵͳ��ʶ",
				maxHeight : 150,
				anchor : '90%',
				labelSeparator : '��',
				emptyText : '��ѡ��...',
				editable : false,
				typeAhead : true,
				// listWidth:50,
				labelSeparator : '��',
				triggerAction : 'all',
				valueField : 'BS_ID',
				displayField : 'BS_CHNAME',
				mode : 'remote',
				store : this.bsIdStore
			})
	this.timeOut = new Ext.form.TextField({
				name : 'timeOut',
				fieldLabel : 'ȡ����ʱʱ��',
				regexText : '������Ч������',
				regex : /^\d+$/,
				labelSeparator : '��',
				style : 'margin-top:2',
				anchor : '90%',
				msgTarget : 'title'
			})
	this.publishTime = new Ext.form.TextField({
				name : 'publishTime',
				fieldLabel : '����ʱ��',
				labelSeparator : '��',
				style : 'margin-top:2',
				anchor : '90%',
				maxLength : 98,
				maxLengthText : 'ȡ���������Ȳ��ܳ���100'
			})
	this.servRemark = new Ext.form.TextArea({
				name : 'servRemark',
				fieldLabel : '����˵��',
				labelSeparator : '��',
				style : 'margin-top:2',
				anchor : '90%',
				height : 45,
				maxLength : 498,
				maxLengthText : 'ȡ���������Ȳ��ܳ���500'
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
				title : '����',
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
							text : '����',
							iconCls : 'queryAdd1',
							handler : this.onServiceSaveFn,
							scope : this
						}, {
							text : '�˳�',
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
					alert('ҵ��ϵͳ��ʶ����ѡ��');
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
						waitMsg : '�����ύ��...',
						waitTitle : '��Ϣ',
						params : params,
						url : '/servlet/ippAction.do?method=createEditDelService',
						method : 'post',
						failure : function(form, action) {
							Ext.MessageBox.alert('����', '�ύ���ݳ����쳣�����Ժ�����');
						},
						success : function(form, action) {
							if (action.result.success == true) {
								Ext.MessageBox.alert('�ɹ�', '�����Ѿ�����');
								this.config.nodeId = this.parentServId.selectParentId;
								this.fireEvent('creationsuccess', true);
								this.close();
							} else {
								Ext.MessageBox.alert('ʧ��', '���ݱ���ʧ��,�����³���');
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
			this.setTitle('���ӷ�����-Ŀ¼');
		} else if (box.getValue() == '0SB') {
			secondPanel.show();
			this.setHeight(485);
			this.setTitle('���ӷ�����-����');

		}
		// secondPanel.doLayout();
	},
	onAfterlayoutFn : function() {
		var secondPanel = this.typePanel.items.get(1);
		if (this.config.saveType == 'add') {
			secondPanel.hide();
			this.setHeight(280);
			this.setTitle('���ӷ�����');
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
				this.setTitle('�޸�Ŀ¼-' + edo.attributes.SERV_NAME);
			} else {
				secondPanel.show();
				this.setHeight(460);
				this.setTitle('�޸Ĺ���-' + edo.attributes.SERV_NAME);
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
							header : '��������',
							width : 280,
							dataIndex : 'SERV_NAME'
						}, {
							header : '�������',
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
							header : '���ű���',
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
						// ,{ header:'�������', width:58, dataIndex:'SERV_TYPE'}
						, {
							header : '������',
							align : 'center',
							width : 80,
							dataIndex : 'ALLOW_SUBSCR',
							renderer : function(val) {
								if (val == '0SA') {
									return "����";
								} else {
									return "��ֹ"
								}
							}
						}, {
							header : '������',
							align : 'center',
							width : 80,
							dataIndex : 'ALLOW_PUBLISH',
							renderer : function(val) {
								if (val == '0SA') {
									return "����";
								} else {
									return "��ֹ"
								}
							}
						}, {
							header : '����ʱ��',
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
							header : 'ȡ������',
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
						// ,{ header:'ȡ����ַ',width:180, dataIndex:'ACTIONURL',
						// renderer:function(val){ return "<div
						// style='width:50px;white-space:normal'>"+val+"</div>"}}

						, {
							header : 'ȡ����ʱʱ��',
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
							header : '����ʱ��',
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
							header : 'ҵ��ϵͳ��ʶ',
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
							text : '������',
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
				title : '��������',
				iconCls : 'serve_config2',
				border : false,
				layout : 'fit',
				items : [this.tree],
				tbar : [{
							text : '����',
							id : 'addNode1',
							handler : this.onAddNodeFn,
							iconCls : 'icon-add',
							scope : this
						}, {
							text : '�޸�',
							id : 'editNode2',
							iconCls : 'icon-edit',
							disabled : true,
							handler : this.onEditNodeFn,
							scope : this
						}, {
							text : 'ɾ��',
							id : 'deleteNode3',
							iconCls : 'icon-del',
							disabled : true,
							handler : this.onDeleteNodeFn,
							scope : this
						}, '-', {
							text : '������Ϣ',
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
			win.setTitle("������Ϣ-" + sNode.attributes.SERV_NAME)
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
			alert('��ѡ��һ����¼');
			return false;
		}

	},
	onDeleteNodeFn : function() {
		var sNode = this.tree.getSelectionModel().getSelectedNode();
		if (sNode) {
			Ext.MessageBox.confirm('��ʾ', '��ȷ��Ҫɾ������('
							+ sNode.attributes.SERV_NAME + ')��ע����Ϣ', function(
							btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
								waitMsg : '�����ύ��...',
								waitTitle : '��Ϣ',
								url : '/servlet/ippAction.do?method=createEditDelService',
								params : {
									servId : sNode.attributes.SERV_ID,
									saveType : 'del'
								},
								callback : function(options, success, response) {
									var responseArray = Ext.util.JSON
											.decode(response.responseText);
									if (responseArray.success == true) {
										Ext.Msg.alert('�ɹ�',
												sNode.attributes.SERV_NAME
														+ '����Ϣ�Ѿ�ɾ��');

										sNode.parentNode.removeChild(sNode);

									} else {
										Ext.Msg.alert('ʧ��', '���ݿ⽻����æ');
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
			alert('����ѡ��һ����¼���ܼ����޸�')
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
				fieldLabel : 'ҵ��ϵͳ��ʶ(����)',
				maxLength : 4,
				maxLengthText : '����̫��',
				regex : /^[\u4e00-\u9fa5]+$/,
				regexText : '��ʶֻ��������',
				msgTarget : 'side',
				style : 'margin-top:2px',
				allowBlank : false,
				blankText : '��ʶ����Ϊ��',
				anchor : '90%',
				labelSeparator : '��'
			})
	this.bsEnname = new Ext.form.TextField({
				name : 'bsEnname',
				fieldLabel : 'ҵ��ϵͳ��ʶ(Ӣ��)',
				regex : /^[a-zA-Z0-9_]{3,18}$/,
				regexText : '������ЧӢ�ı�ʶ',
				allowBlank : false,
				blankText : 'Ӣ�ı�ʶ����Ϊ��',
				msgTarget : 'side',
				style : 'margin-top:2px',
				anchor : '90%',
				labelSeparator : '��'
			})
	this.bsIp = new Ext.form.TextField({
				name : 'bsIp',
				fieldLabel : '��֤Ip��ַ',
				regexText : '������ЧIp��ַ',
				regex : /\d+\.\d+\.\d+\.\d+/,
				msgTarget : 'side',
				style : 'margin-top:2px',
				anchor : '90%',
				labelSeparator : '��'
			})
	this.outUser = new Ext.form.TextField({
				name : 'outUser',
				fieldLabel : '��֤�û�',
				style : 'margin-top:2px',
				maxLength : 19,
				anchor : '90%',
				labelSeparator : '��'
			})

	this.outPass = new Ext.form.TextField({
				name : 'outPass',
				fieldLabel : '��֤����',
				style : 'margin-top:2px',
				maxLength : 19,
				anchor : '90%',
				labelSeparator : '��'
			})
	this.allowLogin = new Ext.form.ComboBox({
				// name : "allowLogin",
				msgTarget : 'side',
				labelSeparator : '��',
				anchor : '90%',
				hiddenName : "state",
				fieldLabel : "�Ƿ��������",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '��Ч'], ['0SX', '��Ч']]
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
				fieldLabel : '�����û�',
				style : 'margin-top:2px',
				maxLength : 19,
				anchor : '90%',
				labelSeparator : '��'
			})

	this.inPass = new Ext.form.TextField({
				name : 'inPass',
				fieldLabel : '��������',
				style : 'margin-top:2px',
				maxLength : 19,
				anchor : '90%',
				labelSeparator : '��'
			})
	this.inTime = new Ext.form.TextField({
				name : 'inTime',
				fieldLabel : '������Чʱ��',
				style : 'margin-top:2px',
				regexText : '������Ч������',
				regex : /^\d+$/,
				msgTarget : 'side',
				maxLength : 9,
				anchor : '90%',
				labelSeparator : '��'
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
				title : 'ҵ��ϵͳ��Ϣ',
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
							text : '����',
							iconCls : 'queryAdd1',
							handler : this.onSaveFn,
							scope : this
						}, {
							text : '�˳�',
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
							alert('��֤��ַ��Ϊ��ʱ����֤�û�������д');
							this.outUser.focus();
							return false;
						}
						if (this.outPass.getValue() == '') {
							alert('��֤��ַ��Ϊ��ʱ����֤���������д');
							this.outPass.focus();
							return false;
						}
					}
					if (this.allowLogin.getValue() == '0SA') {
						if (this.inUser.getValue() == '') {
							alert('�������Ϊ��Чʱ�������û�������д');
							this.inUser.focus();
							return false;
						}
						if (this.inPass.getValue() == '') {
							alert('�������Ϊ��Чʱ���������������д');
							this.inPass.focus();
							return false;
						}
						if (this.inTime.getValue() == '') {
							alert('�������Ϊ��Чʱ��������Чʱ��������д');
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
								waitMsg : '�����ύ��...',
								waitTitle : '��Ϣ',
								params : params,
								url : '/servlet/ippAction.do?method=addEditDelIppBs',
								method : 'post',
								failure : function(form, action) {
									Ext.MessageBox.alert('����', '��д������û��ͨ����֤');
								},
								success : function(form, action) {
									if (action.result.success == true) {
										Ext.MessageBox.alert('�ɹ�', '�����Ѿ�����');
										this.close();
										this.config.owner.getStore().reload();
									} else {
										Ext.MessageBox.alert('ʧ��',
												'���ݱ���ʧ��,�����³���');
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
				header : '��������',
				dataIndex : 'BS_CHNAME',
				menuDisabled : true,
				width : 130
			}, {
				header : 'Ӣ�ı�ʶ',
				dataIndex : 'BS_ENNAME',
				menuDisabled : true,
				width : 130
			}, {
				header : '��֤Ip',
				dataIndex : 'BS_IP',
				menuDisabled : true,
				width : 130
			}, {
				header : '��֤�û�',
				dataIndex : 'OUT_USER',
				menuDisabled : true,
				width : 130
			}, {
				header : '��֤����',
				dataIndex : 'OUT_PASS',
				menuDisabled : true,
				width : 130
			}, {
				header : '��������û�',
				dataIndex : 'ALLOW_LOGIN',
				menuDisabled : true,
				renderer : function(val) {
					if (val == '0SA') {
						return '��Ч'
					} else {
						return '��Ч'
					}
				},

				width : 120
			}, {
				header : '��������',
				dataIndex : 'IN_PASS',
				menuDisabled : true,
				width : 130
			}, {
				header : '������Чʱ��',
				dataIndex : 'IN_TIME',
				menuDisabled : true,
				width : 130
			}

	]);
	bosswg.ipp.BSListPanel.superclass.constructor.call(this, {
				title : 'ҵ��ϵͳ��Ϣ',
				iconCls : 'bsList1',
				tbar : [{
							text : '����',
							handler : this.onAddFn,
							iconCls : 'icon-add',
							scope : this
						}, '&nbsp;&nbsp;', {
							text : '�޸�',
							iconCls : 'icon-edit',
							handler : this.onEditFn,
							scope : this
						}, '&nbsp;&nbsp;', {
							text : 'ɾ��',
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
					msg : '����������...'
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
			alert('��ѡ��һ����¼�޸�!');
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
			alert('��ѡ��һ����¼�޸�!');
			return false;
		}
		Ext.MessageBox.confirm('��ʾ', '��ȷ��Ҫɾ���û�(' + records[0].data.BS_CHNAME
						+ ')��ע����Ϣ', function(btn) {
					if (btn == 'yes') {
						Ext.Ajax.request({
							waitMsg : '�����ύ��...',
							waitTitle : '��Ϣ',
							url : '/servlet/ippAction.do?method=addEditDelIppBs',
							params : {
								bsId : records[0].data.BS_ID,
								saveType : 'del'
							},
							callback : function(options, success, response) {
								var responseArray = Ext.util.JSON
										.decode(response.responseText);
								if (responseArray.success == true) {
									Ext.Msg.alert('�ɹ�',
											records[0].data.BS_CHNAME
													+ '����Ϣ�Ѿ�ɾ��');
									this.getStore().reload();
								} else {
									Ext.Msg.alert('ʧ��', '���ݿ⽻����æ');
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
