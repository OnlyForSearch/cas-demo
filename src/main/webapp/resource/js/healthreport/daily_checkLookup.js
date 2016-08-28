Ext.namespace("daily.checklook");
Ext.LoadMask.prototype.msg = "数据载入中...";
Ext.BLANK_IMAGE_URL = '../../resource/js/ext/resources/images/default/s.gif';
daily.checklook.QueryWin = function(config) {
	this.startDate = new Ext.form.DateField({
				fieldLabel : '&nbsp;记录时间',
				name : 'begDate',
				format : 'Y-m-d',
				readOnly : true,
				// labelSeparator:'',
				// anchor:'95%',
				width : 160,
				value : this.getDate(-100)

			});
	this.endDate = new Ext.form.DateField({
				fieldLabel : '&nbsp;至',
				format : 'Y-m-d',
				name : 'endDate',
				readOnly : true,
				width : 160,
				value : this.getDate(1)

			});
	this.subPerson = new Ext.form.TextField({
			    fieldLabel : '记录人',
				name : 'subPerson',
				width : 160,
				style : 'margin:0,0,2,0;'
	})
	this.isChkCombo = new Ext.form.ComboBox({
				store : new Ext.data.SimpleStore({
							fields : ['ck_code', 'ck_name'],
							data : [['-1', '全部'], ['1', '已审核'], ['0', '未审核']]
						}),
				fieldLabel : '状态',
				name : 'isChk',
				displayField : 'ck_name',
				valueField : 'ck_code',
				typeAhead : true,
				editable : false,
				mode : 'local',
				triggerAction : 'all',
				emptyText : '请选择',
				triggerAction : 'all',
				selectOnFocus : true,
				anchor : '95%'
			});
	this.neName = new Ext.form.TextField({
				fieldLabel : '设备名称',
				name : 'neName',
				width : 160,
				style : 'margin:0,0,2,0;'
			})
	this.qForm = new Ext.form.FormPanel({
				labelWidth : '10',
				labelPad : 1,
				border : false,
				frame : true,
				items : [this.startDate, this.endDate, this.subPerson,
						this.isChkCombo, this.neName]
			});
	daily.checklook.QueryWin.superclass.constructor.call(this, {
		//id : 'search_win',
		layout : 'fit',
		title : '查询',
		collapsible : true,
		closeAction : 'hide',
		closable : true,
		draggable : true,
		resizable : false,
		width : 300,// (Ext.getBody().getSize().width -50),
		height : 250,// (Ext.getBody().getSize().height-25),
		items : [this.qForm],
		constrain : true,
		buttonAlign : 'right',
		buttons : [{
					text : '确定',
					handler : this.querySearch,
					scope : this
				}, {
					text : '取消',
					handler : function() {
						this.hide();
					},
					scope : this
				}]
			// hideMode:'offsets',

		});

}

Ext.extend(daily.checklook.QueryWin, Ext.Window, {
			querySearch : function() {
				var atab = Ext.getCmp('checklook_chck_center_tab')
						.getActiveTab();
				params = {
					typeid : atab.sid,
					start : 0,
					limit : 18
				}
				Ext.apply(params, this.qForm.getForm().getValues());
				params.subPerson = encodeURIComponent(this.qForm.getForm().findField('subPerson').getValue());
				params.neName = encodeURIComponent(this.qForm.getForm().findField('neName')
						.getValue());
				var isChk = this.qForm.getForm().findField('isChk')
						.getValue();
				if(isChk==undefined||isChk=='')
				{
					isChk ='0';
				}
				params.isChk = isChk;
				atab.store.load({
							params : params
						});
				this.hide();
			},
			getDate : function(days) {
				var myDate = new Date();
				myDate.setDate(myDate.getDate() + days);
				return myDate;
			}
		});
daily.checklook.gridPanel = function(config) {
	Ext.QuickTips.init();
	config['_makepn']['daily.checklook.gridPanel'] = this;
	Ext.apply(this, config);
	this.config = config;
	var sendR = new ActiveXObject("Microsoft.XMLHTTP");
	sendR.open("post", "../../servlet/healthRptAction?action=40&dailyInstId="
					+ config.sid, false);
	sendR.send(null);
	// alert(sendR.responseText)
	var aryL = Ext.util.JSON.decode(sendR.responseText);
	var col_one = aryL.col1;
	var col_two = aryL.col2;
	var fields = [{
				name : 'DAILY_INSTANCE_ID'
			}, {
				name : 'NE_ID'
			}, {
				name : 'NE_NAME'
			}, {
				name : 'SUBMIT_PERSON'
			}, {
				name : 'STAFF_ID'
			}, {
				name : 'BEGIN_TIME'
			}, {
				name : 'SUBMIT_TIME'
			}, {
				name : 'CHECK_IDEA'
			}, {
				name : 'VERIFY_PERSON'
			},// 审核人id
			{
				name : 'VERIFY_TIME'
			}, {
				name : 'VERIFY_IDEA'
			}, {
				name : 'STATE'
			}, {
				name : 'STAFF_NAME'
			}];

	for (i = 0; i < col_one.length; i++) {
		fields.push({
					name : col_one[i].BY_NAME
				});
	}
	for (i = 0; i < col_two.length; i++) {
		fields.push({
					name : col_two[i].BY_NAME
				});
	}

	function showInfo(val, metadata, record, rowIndex, colIndex, store) {
		if (val.length > 20) {
			val = val.substring(0, 20) + '...';
		}
		var disable = '<div>' + val + '</div>';
		return disable;
	};
	function showInfo1(val, metadata, record, rowIndex, colIndex, store) {
		if (val.length > 20) {
			val = val.substring(0, 20) + '...';
		}
		var disable = '<table><tr><td>' + val + '</td></tr></table>';
		return disable;
	};
	var sm = new Ext.grid.CheckboxSelectionModel(); // 复选框

	/*
	 * sm.on('rowselect',function(sm_,rowIndex,record){
	 * 
	 * var dd=sm.getSelections();
	 * 
	 * alert(dd.rowIndex); // sm.deselectRow(rowIndex); //sm.selectRow(5);
	 * return ; })
	 */
	var cmd = [
			new Ext.grid.RowNumberer(), // 序号
			sm, {
				header : '状态',
				dataIndex : 'STATE',
				sortable : true,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '设备名称',
				dataIndex : 'NE_NAME',
				sortable : true,
				width : 150,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '诊断时间',
				dataIndex : 'BEGIN_TIME',
				sortable : true,
				width : 100,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '检查说明',
				dataIndex : 'CHECK_IDEA',
				sortable : true,
				menuDisabled : true,
				width : 200,
				renderer : showInfo,
				align : 'center'
			}, {
				header : '填写人',
				dataIndex : 'SUBMIT_PERSON',
				sortable : true,
				menuDisabled : true,
				width : 100,
				align : 'center'
			}, {
				header : '填写时间',
				dataIndex : 'SUBMIT_TIME',
				sortable : true,
				width : 150,
				menuDisabled : true,
				hidden : true,
				align : 'center'
			}, {
				header : '审核人',
				dataIndex : 'STAFF_NAME',
				sortable : true,
				menuDisabled : true,
				width : 100,
				align : 'center'
			}, {
				header : '审核信息',
				dataIndex : 'VERIFY_IDEA',
				sortable : true,
				menuDisabled : true,
				width : 200,
				renderer : showInfo,
				align : 'center'
			}, {
				header : '审核时间',
				dataIndex : 'VERIFY_TIME',
				sortable : true,
				menuDisabled : true,
				width : 100,
				align : 'center'
			}]

	for (i = 0; i < col_one.length; i++) {
		cmd.push({
					header : col_one[i].KPI_NAME,
					dataIndex : col_one[i].BY_NAME,
					sortable : true,
					menuDisabled : true,
					width : 200,
					align : 'center'
				});
	}
	for (i = 0; i < col_two.length; i++) {
		cmd.push({
					header : col_two[i].KPI_NAME,
					dataIndex : col_two[i].BY_NAME,
					sortable : true,
					menuDisabled : true,
					width : 200,
					align : 'center'
				});
	}
	var colModel = new Ext.grid.ColumnModel(cmd);
	var jsR = new Ext.data.JsonReader({
				root : 'rowSet',
				totalProperty : 'rowCount',
				fields : fields
			});
	store = new Ext.data.Store({
		// baseParams:{pinstance_id:this.config.pinstance_id},
		proxy : new Ext.data.HttpProxy({
					url : '../../servlet/healthRptAction?action=31&queryType=look'
				}),
		reader : jsR,
		remoteSort : true

	});
	this.ckDailyBtn = new Ext.Toolbar.Button({
				text : '审核意见',
				tooltip : '审核维护日志',
				iconCls : 'icon-view',
				pressed : true,
				handler : this.ckDailyck,
				scope : this

			});
	this.queryDailyBtn = new Ext.Toolbar.Button({
				text : '查询',
				tooltip : '按条件查询',
				iconCls : 'searchl',
				pressed : true,
				handler : this.checkDailyFn,
				scope : this

			});
	// 以下为多表头功能
	/*
	 * var rows=[{},{},{},{},{},{},{},{},{},{},{}];
	 * rows.push({header:this.config.col1Tit, colspan:col_one.length, align:
	 * 'center'}); rows.push({header: this.config.col2Tit,
	 * colspan:col_two.length, align: 'center'}); this.groupG=new
	 * Ext.ux.plugins.GroupHeaderGrid({ rows: [rows], hierarchicalColMenu: true })
	 */
	daily.checklook.gridPanel.superclass.constructor.call(this, {
				title : this.config.tabTitle,
				sid : this.config.sid,
				lgStaffid : config.lgStaffid,
				border : true,
				store : store,
				stripeRows : true,
				cm : colModel,
				loadMask : true,
				// height : 450,
				// width:800,
				sm : sm,
				tbar : [this.queryDailyBtn, '-', this.ckDailyBtn, '->',
						'<font color=red>*&nbsp;已审核的记录不能重复审核；用户只能审核下级员工填写的日志</font>'],
				// plugins: [this.groupG],
				viewConfig : {
					forceFit : false,
					rowSelectorDepth : 50

				},

				listeners : {
					rowdblclick : {
						fn : this.onRowDblClickFn,
						scope : this

					},
					render : {
						fn : this.onRenderFn,
						scope : this
					}
				},
				bbar : new Ext.PagingToolbar({
							// id : 'pagingbar',
							pageSize : 18,
							displayInfo : true,
							// displayMsg : '当前显示 {0} - {1} 条，共 {2} 条',
							emptyMsg : "无数据",
							store : store
						})
			});
	store.on('beforeload', this.onBeforeloadFn, this);

};

Ext.extend(daily.checklook.gridPanel, Ext.grid.GridPanel, {
	ckDailyck : function() {
		var infoValue = "";
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			Ext.Msg.show({
						title : '没选中',
						msg : '必须选中你要审核的记录',
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.WARNING
					});
			return false;
		}
		for (var rl = 0, e; e = records[rl]; rl++) {
			if (e.data['STATE'] == '<font color=blue>已审核</font>') {
				Ext.Msg.show({
							title : '重复错误',
							msg : '第' + (this.store.indexOf(e)+1)
									+ '行;不能重复审核',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.WARNING
						});
				return false;
			}
			if (this.lgStaffid == e.data['STAFF_ID']&&this.lgStaffid!=1) {
				Ext.Msg.show({
							title : '验证错误',
							msg : '第' + (this.store.indexOf(e)+1)
									+ '行;不能自己审核自己填写的日志',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.WARNING
						});
				return false;
			}
		}
		if (records.length == 1) {
			var rd = records[0];
			var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
			sendRequest.open("post",
					'../../servlet/healthRptAction?action=39&dailyInstId='
							+ rd.data['DAILY_INSTANCE_ID'], false);
			sendRequest.send(null);
			if (sendRequest.readyState == 4 && sendRequest.status == 200) {
				var responseText = Ext.util.JSON
						.decode(sendRequest.responseText);
				if (responseText.info == 'null') {
					responseText.info = '';
				}
				infoValue = responseText.info;
			}
		}
		var win;
		this.htmleE = new Ext.form.HtmlEditor({
			height : 150,
			sourceEditMode : false,
			width : 400,
			value : infoValue,
			enableSourceEdit : true,
			enableLinks : false, // 这是把链接的按钮去掉.
			enableLists : false, // 这是把list 排序给去掉,
			fontFamilies : ['宋体', '隶书', '黑体']
				// 字体列表
			})
		if (!win) {
			win = new Ext.Window({
						layout : 'fit',
						title : '审核信息',
						collapsible : true,
						closable : true,
						draggable : true,
						resizable : false,
						modal : true,
						closeAction : 'hide',
						y : 1,
						width : 450,// (Ext.getBody().getSize().width -50),
						height : 400,// (Ext.getBody().getSize().height-25),
						constrain : true,
						buttonAlign : 'right',
						buttons : [{
							text : '确定',
							handler : this.onCkInfoFn.createDelegate(this,
									[this.htmleE]),
							scope : this
						}, {
							text : '取消',
							handler : function() {
								win.hide()
							}
						}],
						items : [this.htmleE]
					});
		}
		win.show();
	},
	onCkInfoFn : function(info) {
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (info.getValue() == '') {
			Ext.Msg.show({
						title : '验证错误',
						msg : '审核内容不能为空!',
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.WARNING
					});
			return false;
		}

		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXml.createElement("root");
		sendXml.appendChild(root);
		var editRoot = sendXml.createElement("addInfo");
		root.appendChild(editRoot);
		var objects = sendXml.createElement('objects');
		var typeid = sendXml.createElement('TYPE_ID');
		typeid.text = this.config.sid;
		objects.appendChild(typeid);
		var ckInfo = sendXml.createElement('ck_info');
		ckInfo.text = info.getValue();
		objects.appendChild(ckInfo);
		root.appendChild(objects);
		for (var i = 0, n; n = records[i]; i++) {

			el = sendXml.createElement("instRows");
			el.setAttribute('DAILY_INSTANCE_ID', n.get('DAILY_INSTANCE_ID'));
			editRoot.appendChild(el);
		}
		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
		sendRequest.open("post", '../../servlet/healthRptAction?action=38',
				false);
		sendRequest.send(sendXml);
		if (sendRequest.readyState == 4 && sendRequest.status == 200) {
			var responseRoot = Ext.util.JSON.decode(sendRequest.responseText);
			if (responseRoot.success == true) {
				this.store.load(this.store.lastOptions);
				Ext.Msg.show({
							title : '成功',
							msg : '选中记录已经审核!',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.OK
						});
				var dd = info.ownerCt;
				dd.close();
			} else {
				Ext.Msg.show({
							title : '失败',
							msg : '选中记录审核失败!',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.ERROR
						});
			}
		}
	},
	checkDailyFn : function(e) {
		this.ownerCt.queryWin.setPosition(120, 10);
		this.ownerCt.queryWin.show();
	},
	onRowDblClickFn : function(grid, rowIndex, e) {
		var data = grid.getStore().getAt(rowIndex).data;
		var params = {};
		params.deNE_NAME = data['NE_NAME'];
		params.deNE_ID = data['DAILY_INSTANCE_ID'];
		params.staffName = data['SUBMIT_PERSON'];
		params.oprateType = "update";// 操作类型
		params.oprateFlag = false;// 按钮是否可以选
		params.saveFlag = true;
		params.sid = this.sid;
		params.beginTime = data['BEGIN_TIME'];
		params.submitTime = data['SUBMIT_TIME'];
		params.ptitle = this.title;
		params.bigTitle = '查&nbsp;看&nbsp;维&nbsp;护&nbsp;日&nbsp;记';
		params.content = data['CHECK_IDEA'];
		params.atTab = grid;
		var w = window.screen.width;
		var h = window.screen.height - 20;
		window
				.showModelessDialog(
						"dailyGuidelineLookup.html",
						params,
						"dialogWidth="
								+ w
								+ ";dialogHeight="
								+ h
								+ ";help=0;scroll=yes;status=0;resizable=yes;center=yes");
	},
	onRenderFn : function() {
		var tbar = new Ext.Toolbar([{
					//"id" : "ROLE_ADD",
					"text" : ""
				}]);
		tbar.render(this.bbar);
	},
	onBeforeloadFn : function(thiz, options) {
		var win = this.ownerCt.queryWin;
		var isChk = win.isChkCombo.getValue();
		if (isChk==undefined||isChk == '') {
			isChk = '0';
		}
		var neName = win.neName.getValue();
		var subPerson = win.subPerson.getValue();
		if(neName==undefined)
		{
			neName = "";
		}
		if(subPerson==undefined)
		{
			subPerson = "";
		}
		params = {
			begDate : win.startDate.getValue().format('Y-m-d'),
			endDate : win.endDate.getValue().format('Y-m-d'),
			subPerson : encodeURIComponent(subPerson),
			isChk : isChk,
			neName :encodeURIComponent(neName)
		};
		Ext.apply(thiz.baseParams, {
					typeid : this.sid
				});
		Ext.apply(thiz.baseParams, params);
	},
	addDailyck : function() {
		var params = {};
		url = '../../servlet/healthRptAction?action=27&typeid=' + this.sid;// 请求的服务器地址
		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
		sendRequest.open("post", url, false);
		sendRequest.send(null);
		if (sendRequest.readyState == 4 && sendRequest.status == 200) {
			var ifText = eval(sendRequest.responseText);
			var neList = ifText.rows;
			if (neList.length == 0) {
				alert('您还未配置该类型的维护设备');
				return false;
			} else {
				params.deNE_NAME = neList[0].NE_NAME;
				params.deNE_ID = neList[0].NE_ID;
				params.staffName = ifText.staffName;
			}
		}
		params.oprateType = "save";// 操作类型
		params.oprateFlag = false;// 按钮是否可以选
		params.sid = this.sid;
		params.ptitle = this.title;
		params.bigTitle = '填&nbsp;&nbsp;写&nbsp;维&nbsp;护&nbsp;日&nbsp;记';
		params.content = "";
		var w = window.screen.width;
		var h = window.screen.height - 20;
		window
				.showModelessDialog(
						"dailyGuideline.html",
						params,
						"dialogWidth="
								+ w
								+ ";dialogHeight="
								+ h
								+ ";help=0;scroll=yes;status=0;resizable=yes;center=yes");
	}
});

daily.checklook.CenterPanel = function(config) {
	this.queryWin = new daily.checklook.QueryWin();
	daily.checklook.CenterPanel.superclass.constructor.call(this, {
		id : 'checklook_chck_center_tab',
		border : false,
		activeTab : 0,
		height : 400,
		minTabWidth : 135,
		tabWidth : 135,
		enableTabScroll : true,
		listeners : {
			tabchange : {
				fn : this.tabChangeFn,
				scope : this
			}
		}
			// hideMode:'offsets',

		});
}

Ext.extend(daily.checklook.CenterPanel, Ext.TabPanel, {
			tabChangeFn : function(tabpanel, panel) {
				var atab = this.getActiveTab();
				var date = new Date();
				var queryWin = this.queryWin;
				if(queryWin!=undefined)
				{
					this.queryWin.subPerson.setValue('');
					this.queryWin.isChkCombo.setValue('0');
					var endDate = new Date();
					endDate.setDate(endDate.getDate() + 1);
					endDate.format('Y-m-d')
					this.queryWin.endDate.setValue(endDate);
					var startDate = new Date();
					startDate.setDate(startDate.getDate() + -100);
					startDate.format('Y-m-d')
					this.queryWin.startDate.setValue(startDate);
					this.queryWin.neName.setValue('');
				}
				atab.store.load({
							params :{
						typeid : atab.sid,
						start : 0,
						limit : 18
					}
						});
			}
		});
daily.checklook.MainPanel = function(config) {
	config = config || {};
	config['_makepn'] = {
		'MainPanel' : this
	};
	this.centerPanel = new daily.checklook.CenterPanel(config);
	var e = document.body;
	Ext.EventManager.onWindowResize(this.fireResize.createDelegate(this));
	daily.checklook.MainPanel.superclass.constructor.call(this, {
				renderTo : Ext.getBody(),
				layout : 'fit',
				// sid : '',
				width : e.clientWidth - 30,
				height : e.clientHeight - 300,
				// width:1200,
				items : [this.centerPanel]
			});
	url = '../../servlet/healthRptAction?action=26';// 请求的服务器地址
	var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
	sendRequest.open("post", url, false);
	sendRequest.send(null);
	if (sendRequest.readyState == 4 && sendRequest.status == 200) {
		if (sendRequest.responseText == "") {
			alert('类型名称未配置');
			return false;
		}
		var backStore = eval(sendRequest.responseText);
		var configTypes = backStore.rowSet;
		config.lgStaffid = backStore.longinStaffid;
		for (ip = 0; ip < configTypes.length; ip++) {
			config.tabTitle = configTypes[ip].DAILY_VINDICATE_NAME;
			config.sid = configTypes[ip].DAILY_VINDICATE_ID;
			config.col1Tit = configTypes[ip].COL_ONE;
			config.col2Tit = configTypes[ip].COL_TWO;
			var gp = new daily.checklook.gridPanel(config);
			this.centerPanel.add(gp);
			if (ip == 0) {
				this.centerPanel.setActiveTab(gp);
			}
		}
		// 备份检查
		config.tabTitle = "备份维护";
		config.sid = "daily.checklook.atlnid";
		var atlnPanel = new daily.checklook.atlnPanel(config)
		this.centerPanel.add(atlnPanel);
		if (this.centerPanel.items.length == 1) {
			this.centerPanel.setActiveTab(atlnPanel);
		}

	}

};
// 备份检查
daily.checklook.atlnPanel = function(config) {
	Ext.QuickTips.init();
	// 判断是否是动态生成
	config['_makepn']['daily.checklook.atlnPanel'] = this;
	Ext.apply(this, config);
	this.config = config;
	var fields = [{
				name : 'daily_atln_instance_id'
			}, {
				name : 'state'
			}, {
				name : 'daily_atln_device_name'
			}, {
				name : 'submit_time'
			}, {
				name : 'atln_content'
			}, {
				name : 'staff_name'
			}, {
				name : 'atln_end_time'
			}, {
				name : 'atln_start_time'
			}, {
				name : 'verify_person'
			}, {
				name : 'verify_time'
			}, {
				name : 'verify_idea'
			}, {
				name : 'atln_idea'
			}, {
				name : 'mean'
			}, {
				name : 'code'
			}, {
				name : 'staff_id'
			}, {
				name : 'ischeck'
			}];
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cmd = [new Ext.grid.RowNumberer(), sm, {
				header : '状态',
				dataIndex : 'ischeck',
				sortable : true,
				menuDisabled : true,
				renderer : function(value) {
					if (value == '0') {
						return "<span style=color:red>未审核</span>";
					} else if (value == '1') {
						return "<span style=color:blue>已审核</span>";
					}

				},
				align : 'center'
			}, {
				header : '设备名称',
				dataIndex : 'daily_atln_device_name',
				sortable : true,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '填写时间',
				dataIndex : 'submit_time',
				sortable : true,
				width : 140,
				menuDisabled : true,
				hidden : true,
				align : 'center'
			}, {
				header : '填写人',
				dataIndex : 'staff_name',
				sortable : true,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '备份等级',
				dataIndex : 'mean',
				sortable : true,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '备份开始时间',
				dataIndex : 'atln_start_time',
				sortable : true,
				width : 140,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '备份结束时间',
				dataIndex : 'atln_end_time',
				sortable : true,
				width : 140,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '备份内容',
				dataIndex : 'atln_content',
				width : 200,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '结果和说明',
				dataIndex : 'atln_idea',
				width : 200,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '审核人',
				dataIndex : 'verify_person',
				sortable : true,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '审核时间',
				dataIndex : 'verify_time',
				width : 140,
				sortable : true,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '审核内容',
				dataIndex : 'verify_idea',
				sortable : false,
				width : 200,
				menuDisabled : true,
				align : 'center'
			}]
	var colModel = new Ext.grid.ColumnModel(cmd);
	var jsR = new Ext.data.JsonReader({
				root : 'rowSet',
				totalProperty : 'rowCount',
				fields : fields
			});
	store = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
					url : '../../servlet/healthRptAction?action=51&queryType=look'
				}),
		reader : jsR,
		remoteSort : true

	});

	this.queryDailyBtn = new Ext.Toolbar.Button({
				text : '查询',
				tooltip : '按条件查询',
				iconCls : 'searchl',
				pressed : true,
				handler : this.checkDailyFn,
				scope : this

			});
	this.ckDailyBtn = new Ext.Toolbar.Button({
				text : '审核意见',
				tooltip : '审核维护日志',
				iconCls : 'icon-view',
				handler : this.ckDailyck,
				scope : this

			});

	daily.checklook.atlnPanel.superclass.constructor.call(this, {
				title : this.config.tabTitle,
				sid : this.config.sid,
				border : true,
				store : store,
				stripeRows : true,
				cm : colModel,
				loadMask : true,
				sm : sm,
				tbar : [this.queryDailyBtn, '-', this.ckDailyBtn, '-'],
				viewConfig : {
					forceFit : false,
					rowSelectorDepth : 50

				},
				listeners : {
					rowdblclick : {
						fn : this.onRowDblClickFn,
						scope : this

					},
					render : {
						fn : this.onRenderFn,
						scope : this
					}
				},
				bbar : new Ext.PagingToolbar({
							// id : 'pagingbar',
							pageSize : 18,
							displayInfo : true,
							displayInfo : true,
							displayMsg : '当前显示 {0} - {1} 条，共 {2} 条',
							emptyMsg : "无数据",

							store : store
						})
			});
	store.on('beforeload', this.onBeforeloadFn, this);
}
Ext.extend(daily.checklook.atlnPanel, Ext.grid.GridPanel, {
	ckDailyck : function() {
		var infoValue = "";
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			Ext.Msg.show({
						title : '没选中',
						msg : '必须选中你要审核的记录',
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.WARNING
					});
			return false;
		}
		for (var rl = 0, e; e = records[rl]; rl++) {
			if (e.data['verify_person'] != null
					&& e.data['verify_person'] != '') {
				Ext.Msg.show({
							title : '重复错误',
							msg : '第'+(this.store.indexOf(e)+1)+'行,不能重复审核',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.WARNING
						});
				return false;
			}
			if (this.lgStaffid == e.data['staff_id']&&this.lgStaffid!=1) {
				Ext.Msg.show({
							title : '验证错误',
							msg : '第'+(this.store.indexOf(e)+1)+'行,不能自己审核自己填写的日志',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.WARNING
						});
				return false;
			}
		}
		var win;
		this.htmleE = new Ext.form.HtmlEditor({
			height : 150,
			sourceEditMode : false,
			width : 400,
			enableSourceEdit : true,
			enableLinks : false, // 这是把链接的按钮去掉.
			enableLists : false, // 这是把list 排序给去掉,
			fontFamilies : ['宋体', '隶书', '黑体']
				// 字体列表
			})
		if (!win) {
			win = new Ext.Window({
						layout : 'fit',
						title : '审核信息',
						collapsible : true,
						closable : true,
						draggable : true,
						resizable : false,
						modal : true,
						closeAction : 'hide',
						y : 1,
						width : 450,// (Ext.getBody().getSize().width -50),
						height : 400,// (Ext.getBody().getSize().height-25),
						constrain : true,
						buttonAlign : 'right',
						buttons : [{
							text : '确定',
							scope : this,
							handler : this.onCkInfoFn.createDelegate(this,
									[this.htmleE])
						}, {
							text : '取消',
							handler : function() {
								win.hide()
							}
						}],
						items : [this.htmleE]
					});
		}
		win.show();
	},
	onCkInfoFn : function(info) {
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (info.getValue() == '' || info.getValue() == '&nbsp;') {
			Ext.Msg.show({
						title : '验证错误',
						msg : '审核内容不能为空!',
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.WARNING
					});
			return false;
		}
		var checkIds = '';
		for (var i = 0, n; n = records[i]; i++) {
			if (checkIds == '') {
				checkIds += n.get('daily_atln_instance_id');
			} else {
				checkIds += ',' + n.get('daily_atln_instance_id');
			}
		}
		Ext.Ajax.request({
					url : '../../servlet/healthRptAction?',
					method : 'post',
					params : {
						action : '55',
						checkIds : checkIds,
						info : encodeURIComponent(info.getValue())
					},
					success : function(response) {
						if (response.responseText == 'true') {
							Ext.Msg.show({
										title : '成功',
										msg : '选中记录已经审核!',
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.OK
									});
							var dd = info.ownerCt;
							dd.close();
							this.store.load(this.store.lastOptions);
						} else {
							Ext.Msg.show({
										title : '失败',
										msg : '选中记录审核失败!',
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.ERROR
									});

						}
					}
				})
	},
	checkDailyFn : function(e) {
		this.ownerCt.queryWin.setPosition(120, 10);
		this.ownerCt.queryWin.show();
	},
	onRowDblClickFn : function(grid, rowIndex, e) {
		var data = grid.getStore().getAt(rowIndex).data;
		var params = {};
		params.dailyAtlnInstanceId = data['daily_atln_instance_id'];
		params.deviceName = data['daily_atln_device_name'];
		var verify_person = data['verify_person'];

		params.type = true;// 已审核
		params.bigTitle = '查&nbsp;看&nbsp;备&nbsp;份&nbsp;维&nbsp;护&nbsp;日&nbsp;记';
		params.btText = '确定';
		params.lookType = true;//审核查看
		params.verify_time = data['verify_time'];
		params.tartTime = data['atln_start_time'];
		params.endTime = data['atln_end_time'];
		params.atlnContent = data['atln_content'];
		params.staffName = data['staff_name'];
		params.submiTime = data['submit_time'];
		params.atlnIdea = data['atln_idea'];
		params.atlnClass = data['code'];
		params.ptitle = this.title;
		params.atTab = grid;
		params.ischeck = '1';
		params.verify_person = data['verify_person'];
		if (verify_person == null || verify_person == '') {
			params.ischeck = '0';
		} else {
			params.ischeck = '1';
		}
		params.verify_time = data['verify_time'];
		params.verify_idea = data['verify_idea'];
		var w = window.screen.width;
		var h = window.screen.height - 20;
		window
				.showModelessDialog(
						"daily_look_update_atln.html",
						params,
						"dialogWidth="
								+ w
								+ ";dialogHeight="
								+ h
								+ ";help=0;scroll=yes;status=0;resizable=yes;center=yes");
	},
	onRenderFn : function() {
		var tbar = new Ext.Toolbar([{
					//"id" : "ROLE_ADD",
					"text" : ""
				}]);
		tbar.render(this.bbar);
	},
	onBeforeloadFn : function(thiz, options) {
		var win = this.ownerCt.queryWin;
		var isChk = win.isChkCombo.getValue();
		var subPerson = win.subPerson.getValue();
		var neName = win.neName.getValue();
		if(neName==undefined)
		{
			neName = "";
		}
		if(subPerson==undefined)
		{
			subPerson = "";
		}
		if(isChk==undefined||isChk=='')
		{
			isChk='0';
		}
		params = {
			begDate : win.startDate.getValue().format('Y-m-d'),
			endDate : win.endDate.getValue().format('Y-m-d'),
			isChk : isChk,
			subPerson:encodeURIComponent(subPerson),
			neName : encodeURIComponent(neName)
		};
		Ext.apply(thiz.baseParams, {
					typeid : this.sid
				});
		Ext.apply(thiz.baseParams, params);
	}
});
Ext.extend(daily.checklook.MainPanel, Ext.Viewport, {
			fireResize : function() {
				// alert(this.sid);
				var e = document.body;
				// (this.el.dom.innerHTML);
				// this.setWidth(e.clientWidth);
				// this.setHeight(e.clientHeight);
				this.setSize(e.clientWidth, e.clientHeight);
				this.doLayout();
			}
		});
function initLoad() {
	var mainPanel = new daily.checklook.MainPanel({
				ss : 8
			});
}
