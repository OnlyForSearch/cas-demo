Ext.namespace("daily.checklook");
Ext.LoadMask.prototype.msg = "����������...";
Ext.BLANK_IMAGE_URL = '../../resource/js/ext/resources/images/default/s.gif';
daily.checklook.QueryWin = function(config) {
	this.startDate = new Ext.form.DateField({
				fieldLabel : '&nbsp;��¼ʱ��',
				name : 'begDate',
				format : 'Y-m-d',
				readOnly : true,
				// labelSeparator:'',
				// anchor:'95%',
				width : 160,
				value : this.getDate(-100)

			});
	this.endDate = new Ext.form.DateField({
				fieldLabel : '&nbsp;��',
				format : 'Y-m-d',
				name : 'endDate',
				readOnly : true,
				width : 160,
				value : this.getDate(1)

			});
	this.subPerson = new Ext.form.TextField({
			    fieldLabel : '��¼��',
				name : 'subPerson',
				width : 160,
				style : 'margin:0,0,2,0;'
	})
	this.isChkCombo = new Ext.form.ComboBox({
				store : new Ext.data.SimpleStore({
							fields : ['ck_code', 'ck_name'],
							data : [['-1', 'ȫ��'], ['1', '�����'], ['0', 'δ���']]
						}),
				fieldLabel : '״̬',
				name : 'isChk',
				displayField : 'ck_name',
				valueField : 'ck_code',
				typeAhead : true,
				editable : false,
				mode : 'local',
				triggerAction : 'all',
				emptyText : '��ѡ��',
				triggerAction : 'all',
				selectOnFocus : true,
				anchor : '95%'
			});
	this.neName = new Ext.form.TextField({
				fieldLabel : '�豸����',
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
		title : '��ѯ',
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
					text : 'ȷ��',
					handler : this.querySearch,
					scope : this
				}, {
					text : 'ȡ��',
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
			},// �����id
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
	var sm = new Ext.grid.CheckboxSelectionModel(); // ��ѡ��

	/*
	 * sm.on('rowselect',function(sm_,rowIndex,record){
	 * 
	 * var dd=sm.getSelections();
	 * 
	 * alert(dd.rowIndex); // sm.deselectRow(rowIndex); //sm.selectRow(5);
	 * return ; })
	 */
	var cmd = [
			new Ext.grid.RowNumberer(), // ���
			sm, {
				header : '״̬',
				dataIndex : 'STATE',
				sortable : true,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '�豸����',
				dataIndex : 'NE_NAME',
				sortable : true,
				width : 150,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '���ʱ��',
				dataIndex : 'BEGIN_TIME',
				sortable : true,
				width : 100,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '���˵��',
				dataIndex : 'CHECK_IDEA',
				sortable : true,
				menuDisabled : true,
				width : 200,
				renderer : showInfo,
				align : 'center'
			}, {
				header : '��д��',
				dataIndex : 'SUBMIT_PERSON',
				sortable : true,
				menuDisabled : true,
				width : 100,
				align : 'center'
			}, {
				header : '��дʱ��',
				dataIndex : 'SUBMIT_TIME',
				sortable : true,
				width : 150,
				menuDisabled : true,
				hidden : true,
				align : 'center'
			}, {
				header : '�����',
				dataIndex : 'STAFF_NAME',
				sortable : true,
				menuDisabled : true,
				width : 100,
				align : 'center'
			}, {
				header : '�����Ϣ',
				dataIndex : 'VERIFY_IDEA',
				sortable : true,
				menuDisabled : true,
				width : 200,
				renderer : showInfo,
				align : 'center'
			}, {
				header : '���ʱ��',
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
				text : '������',
				tooltip : '���ά����־',
				iconCls : 'icon-view',
				pressed : true,
				handler : this.ckDailyck,
				scope : this

			});
	this.queryDailyBtn = new Ext.Toolbar.Button({
				text : '��ѯ',
				tooltip : '��������ѯ',
				iconCls : 'searchl',
				pressed : true,
				handler : this.checkDailyFn,
				scope : this

			});
	// ����Ϊ���ͷ����
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
						'<font color=red>*&nbsp;����˵ļ�¼�����ظ���ˣ��û�ֻ������¼�Ա����д����־</font>'],
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
							// displayMsg : '��ǰ��ʾ {0} - {1} ������ {2} ��',
							emptyMsg : "������",
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
						title : 'ûѡ��',
						msg : '����ѡ����Ҫ��˵ļ�¼',
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.WARNING
					});
			return false;
		}
		for (var rl = 0, e; e = records[rl]; rl++) {
			if (e.data['STATE'] == '<font color=blue>�����</font>') {
				Ext.Msg.show({
							title : '�ظ�����',
							msg : '��' + (this.store.indexOf(e)+1)
									+ '��;�����ظ����',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.WARNING
						});
				return false;
			}
			if (this.lgStaffid == e.data['STAFF_ID']&&this.lgStaffid!=1) {
				Ext.Msg.show({
							title : '��֤����',
							msg : '��' + (this.store.indexOf(e)+1)
									+ '��;�����Լ�����Լ���д����־',
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
			enableLinks : false, // ���ǰ����ӵİ�ťȥ��.
			enableLists : false, // ���ǰ�list �����ȥ��,
			fontFamilies : ['����', '����', '����']
				// �����б�
			})
		if (!win) {
			win = new Ext.Window({
						layout : 'fit',
						title : '�����Ϣ',
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
							text : 'ȷ��',
							handler : this.onCkInfoFn.createDelegate(this,
									[this.htmleE]),
							scope : this
						}, {
							text : 'ȡ��',
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
						title : '��֤����',
						msg : '������ݲ���Ϊ��!',
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
							title : '�ɹ�',
							msg : 'ѡ�м�¼�Ѿ����!',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.OK
						});
				var dd = info.ownerCt;
				dd.close();
			} else {
				Ext.Msg.show({
							title : 'ʧ��',
							msg : 'ѡ�м�¼���ʧ��!',
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
		params.oprateType = "update";// ��������
		params.oprateFlag = false;// ��ť�Ƿ����ѡ
		params.saveFlag = true;
		params.sid = this.sid;
		params.beginTime = data['BEGIN_TIME'];
		params.submitTime = data['SUBMIT_TIME'];
		params.ptitle = this.title;
		params.bigTitle = '��&nbsp;��&nbsp;ά&nbsp;��&nbsp;��&nbsp;��';
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
		url = '../../servlet/healthRptAction?action=27&typeid=' + this.sid;// ����ķ�������ַ
		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
		sendRequest.open("post", url, false);
		sendRequest.send(null);
		if (sendRequest.readyState == 4 && sendRequest.status == 200) {
			var ifText = eval(sendRequest.responseText);
			var neList = ifText.rows;
			if (neList.length == 0) {
				alert('����δ���ø����͵�ά���豸');
				return false;
			} else {
				params.deNE_NAME = neList[0].NE_NAME;
				params.deNE_ID = neList[0].NE_ID;
				params.staffName = ifText.staffName;
			}
		}
		params.oprateType = "save";// ��������
		params.oprateFlag = false;// ��ť�Ƿ����ѡ
		params.sid = this.sid;
		params.ptitle = this.title;
		params.bigTitle = '��&nbsp;&nbsp;д&nbsp;ά&nbsp;��&nbsp;��&nbsp;��';
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
	url = '../../servlet/healthRptAction?action=26';// ����ķ�������ַ
	var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
	sendRequest.open("post", url, false);
	sendRequest.send(null);
	if (sendRequest.readyState == 4 && sendRequest.status == 200) {
		if (sendRequest.responseText == "") {
			alert('��������δ����');
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
		// ���ݼ��
		config.tabTitle = "����ά��";
		config.sid = "daily.checklook.atlnid";
		var atlnPanel = new daily.checklook.atlnPanel(config)
		this.centerPanel.add(atlnPanel);
		if (this.centerPanel.items.length == 1) {
			this.centerPanel.setActiveTab(atlnPanel);
		}

	}

};
// ���ݼ��
daily.checklook.atlnPanel = function(config) {
	Ext.QuickTips.init();
	// �ж��Ƿ��Ƕ�̬����
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
				header : '״̬',
				dataIndex : 'ischeck',
				sortable : true,
				menuDisabled : true,
				renderer : function(value) {
					if (value == '0') {
						return "<span style=color:red>δ���</span>";
					} else if (value == '1') {
						return "<span style=color:blue>�����</span>";
					}

				},
				align : 'center'
			}, {
				header : '�豸����',
				dataIndex : 'daily_atln_device_name',
				sortable : true,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '��дʱ��',
				dataIndex : 'submit_time',
				sortable : true,
				width : 140,
				menuDisabled : true,
				hidden : true,
				align : 'center'
			}, {
				header : '��д��',
				dataIndex : 'staff_name',
				sortable : true,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '���ݵȼ�',
				dataIndex : 'mean',
				sortable : true,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '���ݿ�ʼʱ��',
				dataIndex : 'atln_start_time',
				sortable : true,
				width : 140,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '���ݽ���ʱ��',
				dataIndex : 'atln_end_time',
				sortable : true,
				width : 140,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '��������',
				dataIndex : 'atln_content',
				width : 200,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '�����˵��',
				dataIndex : 'atln_idea',
				width : 200,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '�����',
				dataIndex : 'verify_person',
				sortable : true,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '���ʱ��',
				dataIndex : 'verify_time',
				width : 140,
				sortable : true,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '�������',
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
				text : '��ѯ',
				tooltip : '��������ѯ',
				iconCls : 'searchl',
				pressed : true,
				handler : this.checkDailyFn,
				scope : this

			});
	this.ckDailyBtn = new Ext.Toolbar.Button({
				text : '������',
				tooltip : '���ά����־',
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
							displayMsg : '��ǰ��ʾ {0} - {1} ������ {2} ��',
							emptyMsg : "������",

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
						title : 'ûѡ��',
						msg : '����ѡ����Ҫ��˵ļ�¼',
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.WARNING
					});
			return false;
		}
		for (var rl = 0, e; e = records[rl]; rl++) {
			if (e.data['verify_person'] != null
					&& e.data['verify_person'] != '') {
				Ext.Msg.show({
							title : '�ظ�����',
							msg : '��'+(this.store.indexOf(e)+1)+'��,�����ظ����',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.WARNING
						});
				return false;
			}
			if (this.lgStaffid == e.data['staff_id']&&this.lgStaffid!=1) {
				Ext.Msg.show({
							title : '��֤����',
							msg : '��'+(this.store.indexOf(e)+1)+'��,�����Լ�����Լ���д����־',
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
			enableLinks : false, // ���ǰ����ӵİ�ťȥ��.
			enableLists : false, // ���ǰ�list �����ȥ��,
			fontFamilies : ['����', '����', '����']
				// �����б�
			})
		if (!win) {
			win = new Ext.Window({
						layout : 'fit',
						title : '�����Ϣ',
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
							text : 'ȷ��',
							scope : this,
							handler : this.onCkInfoFn.createDelegate(this,
									[this.htmleE])
						}, {
							text : 'ȡ��',
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
						title : '��֤����',
						msg : '������ݲ���Ϊ��!',
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
										title : '�ɹ�',
										msg : 'ѡ�м�¼�Ѿ����!',
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.OK
									});
							var dd = info.ownerCt;
							dd.close();
							this.store.load(this.store.lastOptions);
						} else {
							Ext.Msg.show({
										title : 'ʧ��',
										msg : 'ѡ�м�¼���ʧ��!',
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

		params.type = true;// �����
		params.bigTitle = '��&nbsp;��&nbsp;��&nbsp;��&nbsp;ά&nbsp;��&nbsp;��&nbsp;��';
		params.btText = 'ȷ��';
		params.lookType = true;//��˲鿴
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
