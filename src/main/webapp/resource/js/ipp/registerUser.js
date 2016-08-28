Ext.namespace("bosswg.ipp");
Ext.LoadMask.prototype.msg = "数据载入中...";
Ext.BLANK_IMAGE_URL = '../../resource/js/ext-2.0.2/resources/images/default/s.gif';
bosswg.ipp.DeployWin = function(config) {

	// Ext.apply(this, config);
	this.config = config;
	this.roleName = new Ext.form.TextField({
				name : 'roleName',
				fieldLabel : '角色名称',
				labelSeparator : '：',
				style : 'margin-top:2',
				anchor : '90%',
				msgTarget : 'side',
				allowBlank : false,
				blankText : '角色名称不能为空'
			})
	this.roleHelp = new Ext.form.TextArea({
				name : 'roleHelp',
				height : 100,
				//style:"word-wrap : break-word;",
				//style:"table-layout:fixed;word-break :break-all;",
				msgTarget : 'side',
				sourceEditMode : false,
				fieldLabel : '角色帮助',
				anchor : '90%',
				maxLength : 190,
				maxLengthText : '长度不能超过200'
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
										text : '保存',
										handler : this.onAddRoleFn,
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
				header : '角色名称',
				align : 'left',
				dataIndex : 'ROLE_NAME',
				menuDisabled : true,
				width :120
			},
			{
				header : '角色帮助',
				align : 'left',
				dataIndex : 'ROLE_HELP',
				menuDisabled : true,
				width : 360
			}

	]);
	this.roleGrid = new Ext.grid.GridPanel({
				tbar : [{
							text : '增加',
							handler : this.onAddFn,
							scope : this
						}, '-', '&nbsp;&nbsp;', {
							text : '修改',
							handler : this.onEditFn,
							scope : this
						}, '-', '&nbsp;&nbsp;', {
							text : '删除',
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
					msg : '数据载入中...'
				}
			})
	bosswg.ipp.DeployWin.superclass.constructor.call(this, {
				title : '配置信息',
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
					alert('请选择一条记录修改!');
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
					alert('删除成功');
					this.roleGrid.getStore().reload();
				}
			},
			onEditFn : function() {
				var sm = this.roleGrid.getSelectionModel();
				var records = sm.getSelections();
				if (records.length < 1) {
					alert('请选择一条记录修改!');
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
								waitMsg : '数据提交中...',
								waitTitle : '信息',
								params : params,
								url : '/servlet/ippAction.do?method=addUpdateDelRole',
								method : 'post',
								failure : function(form, action) {
									Ext.MessageBox.alert('验证错误', '填写的角色帮助字数过长');
								},
								success : function(form, action) {
									if (action.result.success == true) {
										Ext.MessageBox.alert('成功', '数据已经保存');
										this.getLayout().setActiveItem(0);
										this.roleGrid.getStore().reload();
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
// **************************
bosswg.ipp.CreateEditUserWin = function(config) {

	// Ext.apply(this, config);
	this.config = config;
	// this.config['_makepn']['bosswg.ipp.CreateEditUserWin'] = this;
	this.realName = new Ext.form.TextField({
				name : 'realName',
				fieldLabel : '用户姓名(中文)',
				maxLength : 4,
				maxLengthText : '名称太长',
				// regex:/[\u4e00-\u9fa5]/,
				regex : /^[\u4e00-\u9fa5]+$/,
				regexText : '只能是中文',
				msgTarget : 'side',
				style : 'margin-top:2px',
				// style : 'padding:5,0,0,5;margin-bottom:5',
				allowBlank : false,
				blankText : '用户名不能为空',
				anchor : '90%',
				labelSeparator : '：'
			})
	this.aliasName = new Ext.form.TextField({
				name : 'aliasName',
				fieldLabel : '用户名(英文)',
				regex : /^[a-zA-Z0-9_]{3,18}$/,
				regexText : '不是有效英文名称',
				allowBlank : false,
				blankText : '英文名不能为空',
				msgTarget : 'side',
				style : 'margin-top:2px',
				anchor : '90%',
				labelSeparator : '：'
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
				fieldLabel : "所属区域",
				maxHeight : 150,
				anchor : '90%',
				allowBlank : false,
				blankText : '所属区域必须选择',
				labelSeparator : '：',
				emptyText : '请选择...',
				editable : false,
				typeAhead : true,
				labelSeparator : '：',
				triggerAction : 'all',
				valueField : 'VALUE',
				displayField : 'NAME',
				mode : 'local',
				store : this.regionStroe,
				listeners : {
					'select' : {
						fn : function(o) {
							// 选择事件
						}
					}
				}
			})

	this.phoneNumber = new Ext.form.TextField({
				name : 'phoneNumber',
				fieldLabel : '手机号',
				msgTarget : 'side',
				// regex:/(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/,
				regex : /^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/,
				regexText : '不是有效的电话号码',
				style : 'margin-top:2px',
				// style : 'padding:5,0,0,5;margin-bottom:5',
				allowBlank : false,
				blankText : '手机号不能为空',
				anchor : '90%',
				labelSeparator : '：'
			})
	this.email = new Ext.form.TextField({
				name : 'email',
				fieldLabel : '电子邮箱',
				regex : /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/,
				regexText : '不是有效的邮箱地址',
				msgTarget : 'side',
				style : 'margin-top:2px',
				// style : 'padding:5,0,0,5;margin-bottom:5',
				allowBlank : false,
				blankText : '电子邮箱不能为空',
				anchor : '90%',
				labelSeparator : '：'
			})
	this.grid = new Ext.form.ComboBox({
				// name:'grid',
				labelSeparator : '：',
				anchor : '90%',
				fieldLabel : "等级",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [[0, '一级'], [1, '二级']]
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
				labelSeparator : '：',
				anchor : '90%',
				fieldLabel : "是否特权用户",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '是'], ['0SX', '否']]
						}),
				valueField : "value",
				displayField : "text",
				allowBlank : false,
				blankText : '特权必须选择',
				mode : "local",
				triggerAction : "all",
				value : '0SX',
				editable : false
			});
	this.state = new Ext.form.ComboBox({
				name : "state",
				msgTarget : 'side',
				labelSeparator : '：',
				anchor : '90%',
				listeners : {
					select : {
						fn : this.onStateSelectFn,
						scope : this
					}
				},

				hiddenName : "state",
				fieldLabel : "状态",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '未激活'], ['0SB', '审核中'],
									['0SC', '已激活'], ['0SX', '已失效']]
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
				fieldLabel : '审核人',
				style : 'margin-top:2px',
				// style : 'padding:5,0,0,5;margin-bottom:5',
				anchor : '98%',
				labelSeparator : '：'
			})
	this.handleType = new Ext.form.ComboBox({
				name : "handleType",
				labelSeparator : '：',
				anchor : '98%',
				fieldLabel : "接收方式",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '串行'], ['0SB', '并行']]
						}),
				valueField : "value",
				displayField : "text",
				mode : "local",
				triggerAction : "all",
				editable : false
			});
			
	this.mediaGroup = new Ext.ux.form.LovCombo({
				labelSeparator : '：',
				anchor : '98%',
				fieldLabel : "接收媒体集合",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['0SA', '短信'], ['0SB', '彩信'],
									['0SC', '邮件'], ['0SX', '未定义'],
									['0SD', '语音']]
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
				labelSeparator : '：',
				anchor : '98%',
				fieldLabel : "角色",
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
		title : '配置信息',
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
								html : "<a class='role-config-css' href='#' >角色配置</a>"
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
													text : '选择审核人',
													handler : this.selectPersonFn,
													scope : this
												})]
									}]
						}, this.deployFileset]
			})

	bosswg.ipp.CreateEditUserWin.superclass.constructor.call(this, {
				title : '修改',
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
							text : '保存',
							iconCls : 'queryAdd1',
							handler : this.onSaveFn,
							scope : this
						}, {
							text : '退出',
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
					+ data.USER_ID;// 请求的服务器地址
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
			alert('审核用户必须选择一个');
			this.selectPersonFn();
			return false;
		}
		var stfidList = staffBId.value;
		var stfid = stfidList.split(',');
		if (stfid.length > 1) {
			alert('审核用户只能选择一个');
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
			this.setTitle("修改用户：" + data.REAL_NAME)
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
			this.setTitle("注册用户")
			this.realName.readOnly = false;
			this.aliasName.readOnly = false;
		}
	},
	onSaveFn : function() {

		if (this.state.getValue() == '0SB') {
			if (this.staffBNameCk.getValue() == '') {
				alert('审核用户必须选择');
				this.selectPersonFn();
			}
		}

		if (this.handleType.getValue() != '') {
			if (this.mediaGroup.getValue() == '') {
				this.mediaGroup.focus('', 100);
				alert('接收媒体集合必须选择');
				return false;
			}
		}
		if (this.mediaGroup.getValue() != '') {
			if (this.handleType.getValue() == '') {
				this.handleType.focus('', 100);
				alert('接收方式');
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
						waitMsg : '数据提交中...',
						waitTitle : '信息',
						params : params,
						url : '/servlet/ippAction.do?method=registerEditUser',
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
				header : '用户姓名(中文)',
				dataIndex : 'REAL_NAME',
				menuDisabled : true,
				width : 100
			}, {
				header : '用户代码(英文)',
				dataIndex : 'ALIAS_NAME',
				menuDisabled : true,
				width : 100
			}, {
				header : '生成时间',
				dataIndex : 'GENERATE_TIME',
				menuDisabled : true,
				width : 150
			}, {
				header : '所属区域',
				dataIndex : 'REGION_NAME',
				menuDisabled : true,
				width : 80
			}, {
				header : '注册手机号',
				dataIndex : 'PHONENUMBER',
				menuDisabled : true,
				width : 80
			}, {
				header : '注册邮箱',
				dataIndex : 'MAIL',
				menuDisabled : true,
				width : 100
			}, {
				header : '级别',
				dataIndex : 'GRADE',
				menuDisabled : true,
				renderer : function(val) {
					if (val == 0) {
						return '一级'
					} else {
						return '二级'
					}
				},
				width : 50
			}, {
				header : '是否特权',
				dataIndex : 'ADVAN_USER',
				menuDisabled : true,
				renderer : function(val) {

					if (val == '0SA') {
						return '是'
					} else {
						return '否'
					}
				},
				width : 70
			}, {
				header : '状态',
				dataIndex : 'STAT',
				renderer : function(val) {
					data = [['0SA', '未激活'], ['0SB', '审核中'], ['0SC', '已激活'],
							['0SX', '已失效']]
					var rstr = "";
					if (val == '0SA') {
						rstr = '<font color="#3405ff">未激活</font>';
					} else if (val == '0SB') {
						rstr = '<font color="#ff0575">审核中</font>';
					} else if (val == '0SC') {
						rstr = '<font color="#19e5d4">已激活</font>';
					} else if (val == '0SX') {
						rstr = '<font color="red">已失效</font>';
					}
					return rstr;

				},
				menuDisabled : true,
				width : 70
			}

	]);
	bosswg.ipp.UsersListPanel.superclass.constructor.call(this, {
				tbar : [{
							text : '增加',
							handler : this.onAddFn,
							iconCls : 'icon-add',
							scope : this
						}, '&nbsp;&nbsp;', {
							text : '修改',
							handler : this.onEditFn,
							iconCls : 'icon-edit',
							scope : this
						}, '&nbsp;&nbsp;', {
							text : '删除',
							handler : this.onDeleteFn,
							iconCls : 'icon-del',
							scope : this
						}, '-', {
							text : '角色管理',
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
					msg : '数据载入中...'
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
			alert('请选择一条记录修改!');
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
			alert('请选择一条记录修改!');
			return false;
		}
		Ext.MessageBox.confirm('提示', '您确定要删除用户(' + records[0].data.REAL_NAME
						+ ')的注册信息', function(btn) {
					if (btn == 'yes') {
						Ext.Ajax.request({
							waitMsg : '数据提交中...',
							waitTitle : '信息',
							url : '/servlet/ippAction.do?method=delRegisterUser',
							params : {
								userId : records[0].data.USER_ID
							},
							callback : function(options, success, response) {
								var responseArray = Ext.util.JSON
										.decode(response.responseText);
								if (responseArray.success == true) {
									Ext.Msg.alert('成功',
											records[0].data.REAL_NAME
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
				title : '查询',
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
