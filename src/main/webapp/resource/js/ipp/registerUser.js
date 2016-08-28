Ext.namespace("bosswg.ipp");
Ext.LoadMask.prototype.msg = "����������...";
Ext.BLANK_IMAGE_URL = '../../resource/js/ext-2.0.2/resources/images/default/s.gif';
bosswg.ipp.DeployWin = function(config) {

	// Ext.apply(this, config);
	this.config = config;
	this.roleName = new Ext.form.TextField({
				name : 'roleName',
				fieldLabel : '��ɫ����',
				labelSeparator : '��',
				style : 'margin-top:2',
				anchor : '90%',
				msgTarget : 'side',
				allowBlank : false,
				blankText : '��ɫ���Ʋ���Ϊ��'
			})
	this.roleHelp = new Ext.form.TextArea({
				name : 'roleHelp',
				height : 100,
				//style:"word-wrap : break-word;",
				//style:"table-layout:fixed;word-break :break-all;",
				msgTarget : 'side',
				sourceEditMode : false,
				fieldLabel : '��ɫ����',
				anchor : '90%',
				maxLength : 190,
				maxLengthText : '���Ȳ��ܳ���200'
			})
	this.submitForm = new Ext.FormPanel({
				labelWidth : 80,
				border : false,
				style : 'padding:5',
				frame : false,
				autoScroll : true,
				items : [this.roleName,this.roleHelp,{
							buttonAlign : 'right',
							border : false,
							buttons : [{
										text : '����',
										handler : this.onAddRoleFn,
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
	this.dstore = new Ext.data.Store({
				// pruneModifiedRecords : true,
				// id : 'hds',
				autoLoad : true,
				proxy : new Ext.data.HttpProxy({
							url : '/servlet/ippAction.do?method=getRoleList'
						}),
				reader : new Ext.data.JsonReader({
							root : 'rows'

						}, [{
									name : 'ROLE_ID'
								}, {
									name : 'ROLE_NAME'
								},{name:'ROLE_HELP'}]),
				remoteSort : true

			});

	this.colModel = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				header : 'ROLE_ID',
				dataIndex : 'VALUE_FROM',
				hideable : true,
				hidden : true,
				menuDisabled : true
			}, {
				header : '��ɫ����',
				align : 'left',
				dataIndex : 'ROLE_NAME',
				menuDisabled : true,
				width :120
			},
			{
				header : '��ɫ����',
				align : 'left',
				dataIndex : 'ROLE_HELP',
				menuDisabled : true,
				width : 360
			}

	]);
	this.roleGrid = new Ext.grid.GridPanel({
				tbar : [{
							text : '����',
							handler : this.onAddFn,
							scope : this
						}, '-', '&nbsp;&nbsp;', {
							text : '�޸�',
							handler : this.onEditFn,
							scope : this
						}, '-', '&nbsp;&nbsp;', {
							text : 'ɾ��',
							handler : this.onDeleteFn,
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
				listeners : {
					rowdblclick : {
						fn : this.onRowDblClickFn,
						scope : this
					}
				},
				loadMask : {
					msg : '����������...'
				}
			})
	bosswg.ipp.DeployWin.superclass.constructor.call(this, {
				title : '������Ϣ',
				collapsible : false,
				closable : true,
				closeAction : 'close',
				iconCls : 'usersConfig',
				modal : true,
				roleId : '',
				draggable : true,
				layout : 'card',
				activeItem : 0,
				resizable : false,
				// x:0,
				y : 10,
				width : 545,// (Ext.getBody().getSize().width -50),
				height : 370,// (Ext.getBody().getSize().height-25),
				// constrain : true,
				items : [this.roleGrid, this.submitForm]
			});
	this.on('afterlayout', this.onAfterlayoutFn, this, {
				single : true
			});
	this.show();

}
Ext.extend(bosswg.ipp.DeployWin, Ext.Window, {
			onRowDblClickFn : function(grid, rowIndex, e) {
				var rd = grid.getStore().getAt(rowIndex).data;
				this.config.saveType = "edit";
				//.replace(/(\n|\r)+/g,'<br>')"; / <br(\/?)> /ig
				var ron=rd.ROLE_HELP
				var laN=ron.replace(/<br([^>]?)>/ig, "\r\n"); 
				this.roleName.setValue(rd.ROLE_NAME);
				this.roleHelp.setValue(laN);
				this.roleId = rd.ROLE_ID;
				this.getLayout().setActiveItem(1);

			},
			onDeleteFn : function() {
				var sm = this.roleGrid.getSelectionModel();
				var records = sm.getSelections();
				if (records.length < 1) {
					alert('��ѡ��һ����¼�޸�!');
					return false;
				}
				var url = '/servlet/ippAction.do?method=addUpdateDelRole&roleId='
						+ records[0].data.ROLE_ID;
				var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
				sendRequest.open("post", url, false);
				sendRequest.send(null);
				var responseInfo = Ext.util.JSON
						.decode(sendRequest.responseText);
				if (responseInfo.success) {
					alert('ɾ���ɹ�');
					this.roleGrid.getStore().reload();
				}
			},
			onEditFn : function() {
				var sm = this.roleGrid.getSelectionModel();
				var records = sm.getSelections();
				if (records.length < 1) {
					alert('��ѡ��һ����¼�޸�!');
					return false;
				}
				this.config.saveType = "edit";
				var rd = records[0].data
				var ron=rd.ROLE_HELP
				var laN=ron.replace(/<br([^>]?)>/ig, "\r\n"); 
				this.roleName.setValue(rd.ROLE_NAME);
				this.roleHelp.setValue(laN);
				this.roleId = rd.ROLE_ID;
				this.getLayout().setActiveItem(1);
			},
			onAfterlayoutFn : function() {

			},
			onAddFn : function() {
				this.submitForm.form.reset();
				this.config.saveType = "add";
				this.getLayout().setActiveItem(1);

			},
			onAddRoleFn : function() {
				params = {
					saveType : this.config.saveType,
					roleId : this.roleId
				};
				if (this.submitForm.form.isValid()) {
					this.submitForm.form.submit({
								clientValidation : true,
								waitMsg : '�����ύ��...',
								waitTitle : '��Ϣ',
								params : params,
								url : '/servlet/ippAction.do?method=addUpdateDelRole',
								method : 'post',
								failure : function(form, action) {
									Ext.MessageBox.alert('��֤����', '��д�Ľ�ɫ������������');
								},
								success : function(form, action) {
									if (action.result.success == true) {
										Ext.MessageBox.alert('�ɹ�', '�����Ѿ�����');
										this.getLayout().setActiveItem(0);
										this.roleGrid.getStore().reload();
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
// **************************
bosswg.ipp.CreateEditUserWin = function(config) {

	// Ext.apply(this, config);
	this.config = config;
	// this.config['_makepn']['bosswg.ipp.CreateEditUserWin'] = this;
	this.realName = new Ext.form.TextField({
				name : 'realName',
				fieldLabel : '�û�����(����)',
				maxLength : 4,
				maxLengthText : '����̫��',
				// regex:/[\u4e00-\u9fa5]/,
				regex : /^[\u4e00-\u9fa5]+$/,
				regexText : 'ֻ��������',
				msgTarget : 'side',
				style : 'margin-top:2px',
				// style : 'padding:5,0,0,5;margin-bottom:5',
				allowBlank : false,
				blankText : '�û�������Ϊ��',
				anchor : '90%',
				labelSeparator : '��'
			})
	this.aliasName = new Ext.form.TextField({
				name : 'aliasName',
				fieldLabel : '�û���(Ӣ��)',
				regex : /^[a-zA-Z0-9_]{3,18}$/,
				regexText : '������ЧӢ������',
				allowBlank : false,
				blankText : 'Ӣ��������Ϊ��',
				msgTarget : 'side',
				style : 'margin-top:2px',
				anchor : '90%',
				labelSeparator : '��'
			})
	this.regionStroe = new Ext.data.Store({
				url : "../../servlet/busiMonitorCtrl.do?method=getRegion",
				autoLoad : true,
				reader : new Ext.data.XmlReader({
							record : 'rowSet',
							id : 'VALUE'
						}, ["VALUE", "NAME"])
			});

	this.regionID = new Ext.form.ComboBox({
				// id : "Region_Id_Compare",
				// name:'regionID',
				fieldLabel : "��������",
				maxHeight : 150,
				anchor : '90%',
				allowBlank : false,
				blankText : '�����������ѡ��',
				labelSeparator : '��',
				emptyText : '��ѡ��...',
				editable : false,
				typeAhead : true,
				labelSeparator : '��',
				triggerAction : 'all',
				valueField : 'VALUE',
				displayField : 'NAME',
				mode : 'local',
				store : this.regionStroe,
				listeners : {
					'select' : {
						fn : function(o) {
							// ѡ���¼�
						}
					}
				}
			})

	this.phoneNumber = new Ext.form.TextField({
				name : 'phoneNumber',
				fieldLabel : '�ֻ���',
				msgTarget : 'side',
				// regex:/(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/,
				regex : /^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/,
				regexText : '������Ч�ĵ绰����',
				style : 'margin-top:2px',
				// style : 'padding:5,0,0,5;margin-bottom:5',
				allowBlank : false,
				blankText : '�ֻ��Ų���Ϊ��',
				anchor : '90%',
				labelSeparator : '��'
			})
	this.email = new Ext.form.TextField({
				name : 'email',
				fieldLabel : '��������',
				regex : /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/,
				regexText : '������Ч�������ַ',
				msgTarget : 'side',
				style : 'margin-top:2px',
				// style : 'padding:5,0,0,5;margin-bottom:5',
				allowBlank : false,
				blankText : '�������䲻��Ϊ��',
				anchor : '90%',
				labelSeparator : '��'
			})
	this.grid = new Ext.form.ComboBox({
				// name:'grid',
				labelSeparator : '��',
				anchor : '90%',
				fieldLabel : "�ȼ�",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [[0, 'һ��'], [1, '����']]
						}),
				valueField : "value",
				displayField : "text",
				mode : "local",
				triggerAction : "all",
				value : 0,
				allowBlank : false,
				editable : false
			});
	this.advanUser = new Ext.form.ComboBox({
				name : "advanUser",
				labelSeparator : '��',
				anchor : '90%',
				fieldLabel : "�Ƿ���Ȩ�û�",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '��'], ['0SX', '��']]
						}),
				valueField : "value",
				displayField : "text",
				allowBlank : false,
				blankText : '��Ȩ����ѡ��',
				mode : "local",
				triggerAction : "all",
				value : '0SX',
				editable : false
			});
	this.state = new Ext.form.ComboBox({
				name : "state",
				msgTarget : 'side',
				labelSeparator : '��',
				anchor : '90%',
				listeners : {
					select : {
						fn : this.onStateSelectFn,
						scope : this
					}
				},

				hiddenName : "state",
				fieldLabel : "״̬",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', 'δ����'], ['0SB', '�����'],
									['0SC', '�Ѽ���'], ['0SX', '��ʧЧ']]
						}),
				valueField : "value",
				displayField : "text",
				value : '0SA',
				mode : "local",
				triggerAction : "all",
				allowBlank : false,
				editable : true
			});
	this.staffBNameCk = new Ext.form.TextField({
				name : 'staffBNameCk',
				readOnly : true,
				fieldLabel : '�����',
				style : 'margin-top:2px',
				// style : 'padding:5,0,0,5;margin-bottom:5',
				anchor : '98%',
				labelSeparator : '��'
			})
	this.handleType = new Ext.form.ComboBox({
				name : "handleType",
				labelSeparator : '��',
				anchor : '98%',
				fieldLabel : "���շ�ʽ",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '����'], ['0SB', '����']]
						}),
				valueField : "value",
				displayField : "text",
				mode : "local",
				triggerAction : "all",
				editable : false
			});
			
	this.mediaGroup = new Ext.ux.form.LovCombo({
				labelSeparator : '��',
				anchor : '98%',
				fieldLabel : "����ý�弯��",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '����'], ['0SB', '����'],
									['0SC', '�ʼ�'], ['0SX', 'δ����'],
									['0SD', '����']]
						}),
				valueField : "value",
				displayField : "text",
				mode : "local",
				triggerAction : "all",
				// value:'SMS',
				editable : false
			});
	this.roleStore = new Ext.data.Store({
				// pruneModifiedRecords : true,
				autoLoad : true,
				// id : 'hds',
				proxy : new Ext.data.HttpProxy({
							url : '/servlet/ippAction.do?method=getRoleList'

						}),
				reader : new Ext.data.JsonReader({
							root : 'rows'

						}, [{
									name : 'ROLE_ID'
								}, {
									name : 'ROLE_NAME'
								}]),
				listeners : {
					load : {
						fn : this.onRoleStoreFn,
						scope : this
					}
				}

			});
	this.role = new Ext.ux.form.LovCombo({
				labelSeparator : '��',
				anchor : '98%',
				fieldLabel : "��ɫ",
				// hideOnSelect:false,
				editable : false,
				maxHeight : 200,
				store : this.roleStore,
				triggerAction : 'all',
				valueField : 'ROLE_ID',
				displayField : 'ROLE_NAME',
				mode : 'remote'
			});

	this.deployFileset = new Ext.form.FieldSet({
		// checkboxToggle:true,
		collapsible : true,
		title : '������Ϣ',
		height : 110,
		items : [{
					layout : 'column',
					items : [{
								columnWidth : 0.8,
								layout : 'form',
								items : [this.role]
							}, {
								columnWidth : 0.2,
								style : 'margin-top:3',
								html : "<a class='role-config-css' href='#' >��ɫ����</a>"
							}]
				}, this.handleType, this.mediaGroup]
	})

	this.submitForm = new Ext.FormPanel({
				labelWidth : 100,
				border : false,
				frame : true,
				autoScroll : true,
				items : [this.realName, this.aliasName, this.regionID,
						this.phoneNumber, this.email, this.grid,
						this.advanUser, this.state, {
							id : 'audit_info_ck_panel10000',
							hidden : true,
							layout : 'column',
							items : [{
										columnWidth : 0.65,
										layout : 'form',
										items : [this.staffBNameCk]
									}, {
										columnWidth : 0.35,
										style : 'margin-top:3',
										items : [new Ext.Button({
													text : 'ѡ�������',
													handler : this.selectPersonFn,
													scope : this
												})]
									}]
						}, this.deployFileset]
			})

	bosswg.ipp.CreateEditUserWin.superclass.constructor.call(this, {
				title : '�޸�',
				layout : 'fit',
				collapsible : false,
				closable : true,
				closeAction : 'close',
				modal : true,

				draggable : true,
				resizable : false,
				staffidCk : '',
				// x:0,
				y : 10,
				width : 400,// (Ext.getBody().getSize().width -50),
				height : 480,// (Ext.getBody().getSize().height-25),
				// constrain : true,
				buttonAlign : 'right',
				buttons : [{
							text : '����',
							iconCls : 'queryAdd1',
							handler : this.onSaveFn,
							scope : this
						}, {
							text : '�˳�',
							iconCls : 'refresh1',
							handler : function() {
								this.close()
							},
							scope : this
						}],
				items : [{
							style : 'padding:10',
							border : false,
							layout : 'fit',
							items : [this.submitForm]
						}]
			});
	this.on('show', this.onAfterlayoutFn, this, {
				single : true
			});
	this.on('render', function() {
				this.body.on('click', function(e) {
							var tgEl = Ext.get(e.getTarget());
							if (tgEl.hasClass('role-config-css')) {
								new bosswg.ipp.DeployWin(this.config);
								this.close();
							}

						}, this);
			});
	this.show();

}
Ext.extend(bosswg.ipp.CreateEditUserWin, Ext.Window, {
	onRoleStoreFn : function(stroe) {
		// this.role.setValue('1')
		// __________
		if (this.config.rd) {
			var data = this.config.rd;
			var url = '/servlet/ippAction.do?method=getUpdateUserConfigDate&userId='
					+ data.USER_ID;// ����ķ�������ַ
			var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
			sendRequest.open("post", url, false);
			sendRequest.send(null);
			var responseInfo = Ext.util.JSON.decode(sendRequest.responseText);
			var AuditInfoRow = responseInfo.AuditInfoRow;
			var rsRoleRow = responseInfo.rsRoleRow;
			var handleRow = responseInfo.handleRow;
			if (rsRoleRow.length > 0) {
				var rrwID = "";
				var rrwName = "";
				for (var rw = 0; rw < rsRoleRow.length; rw++) {
					rrwID += rsRoleRow[rw].ROLE_ID + ",";
					rrwName += rsRoleRow[rw].ROLE_NAME + ",";

				}
				// var dh=this.role.el.parent()
				// var ddl=dh.dom.childNodes[0];

				this.role.setValue(rrwID);
			}
			if (handleRow.length > 0) {
				this.handleType.setValue(handleRow[0].HANDLE_TYPE);
				this.mediaGroup.setValue(handleRow[0].MEDIA_GROUP);
			}
			if (AuditInfoRow.length > 0) {
				this.staffidCk = AuditInfoRow[0].STAFF_ID;
				this.staffBNameCk.setValue(AuditInfoRow[0].STAFF_NAME);
			}
		}
	},
	selectPersonFn : function(btn, e) {
		var staffId;
		var staffInfo = choiceStaffToElement(staffBName, staffBId, true, "",
				"", false, staffId);

		if (staffBId.value == '' || staffBId.value == null) {
			alert('����û�����ѡ��һ��');
			this.selectPersonFn();
			return false;
		}
		var stfidList = staffBId.value;
		var stfid = stfidList.split(',');
		if (stfid.length > 1) {
			alert('����û�ֻ��ѡ��һ��');
			this.selectPersonFn();
			return false;
		}
		this.staffBNameCk.setValue(staffBName.value)
		this.staffidCk = staffBId.value;
		// this.ckPerson.setValue(staffBName.value);
		// this.ckPersonid.setValue(staffBId.value);
	},
	onStateSelectFn : function(cobox) {
		var ckPan = Ext.getCmp('audit_info_ck_panel10000');
		if (cobox.value == '0SB') {
			ckPan.show();
		} else {
			ckPan.hide()
		}
		this.submitForm.doLayout();
		// ckPan.hide()
	},
	onAfterlayoutFn : function() {

		if (this.config.rd) {
			var data = this.config.rd;
			this.setTitle("�޸��û���" + data.REAL_NAME)
			this.realName.setValue(data.REAL_NAME);
			this.aliasName.setValue(data.ALIAS_NAME)
			this.realName.el.dom.readOnly = true;
			this.aliasName.el.dom.readOnly = true;
			this.regionID.setValue(data.REGION_ID);
			this.regionID.el.dom.value = data.REGION_NAME;
			this.phoneNumber.setValue(data.PHONENUMBER)
			this.email.setValue(data.MAIL);
			this.grid.setValue(data.GRADE);
			this.advanUser.setValue(data.ADVAN_USER);
			this.state.setValue(data.STAT);

			if (data.STAT == '0SB') {
				var ckPan = Ext.getCmp('audit_info_ck_panel10000');
				ckPan.show();
				this.submitForm.doLayout();
			}
		} else {
			this.setTitle("ע���û�")
			this.realName.readOnly = false;
			this.aliasName.readOnly = false;
		}
	},
	onSaveFn : function() {

		if (this.state.getValue() == '0SB') {
			if (this.staffBNameCk.getValue() == '') {
				alert('����û�����ѡ��');
				this.selectPersonFn();
			}
		}

		if (this.handleType.getValue() != '') {
			if (this.mediaGroup.getValue() == '') {
				this.mediaGroup.focus('', 100);
				alert('����ý�弯�ϱ���ѡ��');
				return false;
			}
		}
		if (this.mediaGroup.getValue() != '') {
			if (this.handleType.getValue() == '') {
				this.handleType.focus('', 100);
				alert('���շ�ʽ');
				return false;
			}
		}
		var params = {
			staffidCk : this.staffidCk,
			staffBNameCk : this.staffBNameCk.getValue(),
			role : this.role.getValue(),
			handleType : this.handleType.getValue(),
			mediaGroup : this.mediaGroup.getValue(),
			regionID : this.regionID.getValue(),
			grid : this.grid.getValue(),
			advanUser : this.advanUser.getValue(),
			state : this.state.getValue()
		};
		if (this.config.rd) {
			params.userId = this.config.rd.USER_ID;
		}
		if (this.submitForm.form.isValid()) {
			this.submitForm.form.submit({
						clientValidation : true,
						waitMsg : '�����ύ��...',
						waitTitle : '��Ϣ',
						params : params,
						url : '/servlet/ippAction.do?method=registerEditUser',
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
// *****************************************************
bosswg.ipp.UsersListPanel = function(config) {
	this.config = config || {};
	this.config['_makepn']['bosswg.ipp.UsersListPanel'] = this;
	this.dstore = new Ext.data.Store({
				// pruneModifiedRecords : true,
				// id : 'hds',
				autoLoad : true,
				proxy : new Ext.data.HttpProxy({
							url : '/servlet/ippAction.do?method=getRegisterUserList'

						}),
				reader : new Ext.data.JsonReader({
							root : 'rows'

						}, [{
									name : 'USER_ID'
								}, {
									name : 'REAL_NAME'
								}, {
									name : 'ALIAS_NAME'
								}, {
									name : 'REGION_ID'
								}, {
									name : 'GENERATE_TIME'
								}, {
									name : 'REGION_NAME'
								}, {
									name : 'PHONENUMBER'
								}, {
									name : 'MAIL'
								}, {
									name : 'GRADE'
								}, {
									name : 'ADVAN_USER'
								}, {
									name : 'STAT'
								}]),
				remoteSort : true

			});

	var colModel = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				header : '�û�����(����)',
				dataIndex : 'REAL_NAME',
				menuDisabled : true,
				width : 100
			}, {
				header : '�û�����(Ӣ��)',
				dataIndex : 'ALIAS_NAME',
				menuDisabled : true,
				width : 100
			}, {
				header : '����ʱ��',
				dataIndex : 'GENERATE_TIME',
				menuDisabled : true,
				width : 150
			}, {
				header : '��������',
				dataIndex : 'REGION_NAME',
				menuDisabled : true,
				width : 80
			}, {
				header : 'ע���ֻ���',
				dataIndex : 'PHONENUMBER',
				menuDisabled : true,
				width : 80
			}, {
				header : 'ע������',
				dataIndex : 'MAIL',
				menuDisabled : true,
				width : 100
			}, {
				header : '����',
				dataIndex : 'GRADE',
				menuDisabled : true,
				renderer : function(val) {
					if (val == 0) {
						return 'һ��'
					} else {
						return '����'
					}
				},
				width : 50
			}, {
				header : '�Ƿ���Ȩ',
				dataIndex : 'ADVAN_USER',
				menuDisabled : true,
				renderer : function(val) {

					if (val == '0SA') {
						return '��'
					} else {
						return '��'
					}
				},
				width : 70
			}, {
				header : '״̬',
				dataIndex : 'STAT',
				renderer : function(val) {
					data = [['0SA', 'δ����'], ['0SB', '�����'], ['0SC', '�Ѽ���'],
							['0SX', '��ʧЧ']]
					var rstr = "";
					if (val == '0SA') {
						rstr = '<font color="#3405ff">δ����</font>';
					} else if (val == '0SB') {
						rstr = '<font color="#ff0575">�����</font>';
					} else if (val == '0SC') {
						rstr = '<font color="#19e5d4">�Ѽ���</font>';
					} else if (val == '0SX') {
						rstr = '<font color="red">��ʧЧ</font>';
					}
					return rstr;

				},
				menuDisabled : true,
				width : 70
			}

	]);
	bosswg.ipp.UsersListPanel.superclass.constructor.call(this, {
				tbar : [{
							text : '����',
							handler : this.onAddFn,
							iconCls : 'icon-add',
							scope : this
						}, '&nbsp;&nbsp;', {
							text : '�޸�',
							handler : this.onEditFn,
							iconCls : 'icon-edit',
							scope : this
						}, '&nbsp;&nbsp;', {
							text : 'ɾ��',
							handler : this.onDeleteFn,
							iconCls : 'icon-del',
							scope : this
						}, '-', {
							text : '��ɫ����',
							handler : this.toDeployFn,
							iconCls : 'usersConfig',
							scope : this
						}],
				cm : colModel,
				listeners : {
					rowdblclick : {
						fn : this.onRowDblClickFn,
						scope : this
					}
				},
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

Ext.extend(bosswg.ipp.UsersListPanel, Ext.grid.GridPanel, {
	toDeployFn : function() {
		var dep = new bosswg.ipp.DeployWin(this.config);
	},
	onRowDblClickFn : function(grid, rowIndex, e) {
		this.config.owner = this
		this.config.rd = grid.getStore().getAt(rowIndex).data;
		var cew = new bosswg.ipp.CreateEditUserWin(this.config);
	},
	onAddFn : function() {

		this.config.owner = this
		if (this.config.rd) {
			delete this.config.rd;
		}
		var cew = new bosswg.ipp.CreateEditUserWin(this.config);
	},
	onEditFn : function() {
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('��ѡ��һ����¼�޸�!');
			return false;
		}
		this.config.owner = this
		this.config.rd = records[0].data;
		var cew = new bosswg.ipp.CreateEditUserWin(this.config);
	},
	onDeleteFn : function() {
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('��ѡ��һ����¼�޸�!');
			return false;
		}
		Ext.MessageBox.confirm('��ʾ', '��ȷ��Ҫɾ���û�(' + records[0].data.REAL_NAME
						+ ')��ע����Ϣ', function(btn) {
					if (btn == 'yes') {
						Ext.Ajax.request({
							waitMsg : '�����ύ��...',
							waitTitle : '��Ϣ',
							url : '/servlet/ippAction.do?method=delRegisterUser',
							params : {
								userId : records[0].data.USER_ID
							},
							callback : function(options, success, response) {
								var responseArray = Ext.util.JSON
										.decode(response.responseText);
								if (responseArray.success == true) {
									Ext.Msg.alert('�ɹ�',
											records[0].data.REAL_NAME
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

// ************************************

bosswg.ipp.MainPanel = function(config) {
	config = config || {};
	config['_makepn'] = {
		'MainPanel' : this
	};
	var e = document.body;
	this.userListPanel = new bosswg.ipp.UsersListPanel(config);
	Ext.EventManager.onWindowResize(this.fireResize.createDelegate(this));
	bosswg.ipp.MainPanel.superclass.constructor.call(this, {
				title : '��ѯ',
				closable : true,
				draggable : false,
				autoScroll : true,
				layout : 'fit',
				items : [this.userListPanel],
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

function initLoad() {
	Ext.QuickTips.init();
	new bosswg.ipp.MainPanel({
				uid : 1
			});

}
