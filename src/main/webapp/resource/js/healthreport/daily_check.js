Ext.namespace("daily.check");
Ext.LoadMask.prototype.msg = "数据载入中...";
Ext.BLANK_IMAGE_URL = '../../resource/js/ext/resources/images/default/s.gif';
var Global = {
		url : null,
		hiddenJob : true
	}
daily.check.QueryWin = function(config) {
	this.startDate = new Ext.form.DateField({
				fieldLabel : '&nbsp;检查时间',
				name : 'begDate',
				format : 'Y-m-d',
				readOnly : true,
				width : 160,
				value : this.getDate(0)
			});
	this.endDate = new Ext.form.DateField({
				fieldLabel : '&nbsp;至',
				format : 'Y-m-d',
				name : 'endDate',
				readOnly : true,
				width : 160,
				value : this.getDate(+1)
			});
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
			});
    
    //linjl 2012-3-13
    this.isLinkJobItem = new Ext.form.ComboBox({
				store : new Ext.data.SimpleStore({
							fields : ['ck_code', 'ck_name'],
							data : [['0', '否'], ['1', '是']]
						}),
				fieldLabel : '关联配置项',
				name : 'isLinkJobItem',
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
    //end

	this.qForm = new Ext.form.FormPanel({
				labelWidth : '10',
				labelPad : 1,
				border : false,
				frame : true,
				items : [this.startDate, this.endDate, this.isChkCombo, this.isLinkJobItem,
						this.neName]
			});
	daily.check.QueryWin.superclass.constructor.call(this, {
				//id : 'daily_check_QueryWin_q',
				layout : 'fit',
				title : '查询',
				collapsible : true,
				closeAction : 'hide',
				closable : true,
				draggable : true,
				resizable : false,
				width : 300,// (Ext.getBody().getSize().width -50),
				height : 220,// (Ext.getBody().getSize().height-25),
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
								this.ownerCt.hide()
							}
						}]
			});

}

Ext.extend(daily.check.QueryWin, Ext.Window, {
			querySearch : function() {
				var atab = Ext.getCmp('daily_chck_center_tab').getActiveTab();
				params = {
					typeid : atab.sid,
					start : 0,
					limit : 18
				}
				Ext.apply(params, this.qForm.getForm().getValues());
				var isChk = this.qForm.getForm().findField("neName").getValue();
				if(isChk==undefined||isChk=='')
				{
					isChk = '-1';
				}
				params.isChk = isChk;
				params.neName = encodeURIComponent(this.qForm.getForm().findField("neName").getValue());
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

daily.check.gridPanel = function(config) {
	Ext.QuickTips.init();
	// 判断是否是动态生成
	config['_makepn']['daily.check.gridPanel'] = this;
	Ext.apply(this, config);
	this.config = config;
	var fields;
	var sendR = new ActiveXObject("Microsoft.XMLHTTP");
	sendR.open("post", "../../servlet/healthRptAction?action=40&dailyInstId="
					+ config.sid, false);
	sendR.send(null);
	var aryL = Ext.util.JSON.decode(sendR.responseText);
	var col_one = aryL.col1;
	var col_two = aryL.col2;
	fields = [{
				name : 'DAILY_INSTANCE_ID'
			}, {
				name : 'NE_ID'
			}, {
				name : 'NE_NAME'
			}, {
				name : 'SUBMIT_PERSON'
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
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cmd = [new Ext.grid.RowNumberer(), sm, {
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
							url : '../../servlet/healthRptAction?action=31'
						}),
				reader : jsR,
				remoteSort : true

			});

	this.addDailyBtn = new Ext.Toolbar.Button({
				text : '增加',
				tooltip : '增加维护日志',
				iconCls : 'icon-add',
				pressed : true,
				handler : this.addDailyck,
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
	this.delDailyBtn = new Ext.Toolbar.Button({
				text : '删除',
				tooltip : '删除',
				iconCls : 'delete',
				pressed : true,
				handler : this.delDailyBtnFn,
				scope : this

			});
	this.ckDailyBtn = new Ext.Toolbar.Button({
				text : '查看审核信息',
				tooltip : '审核维护日志',
				iconCls : 'icon-view',
				// pressed:true,
				handler : this.ckDailyck,
				scope : this
		});
	this.putinJobBtn = new Ext.Toolbar.Button({
		    text:'提交维护作业',
		    tooltip:'提交维护作业',
		    iconCls:'jobIco',
		  //  pressed:true,
		    hidden: config.hiddenJob,
		    handler: this.putinJobFn,
		    scope:this
		});
	// 以下为多表头功能。
	/*
	 * var rows=[{},{},{},{},{},{},{},{},{},{},{}];
	 * rows.push({header:this.config.col1Tit, colspan:col_one.length, align:
	 * 'center'}); rows.push({header: this.config.col2Tit,
	 * colspan:col_two.length, align: 'center'}); this.groupG=new
	 * Ext.ux.plugins.GroupHeaderGrid({ rows: [rows], hierarchicalColMenu: true })
	 */
	daily.check.gridPanel.superclass.constructor.call(this, {
				title : this.config.tabTitle,
				sid : this.config.sid,
				border : true,
				store : store,
				stripeRows : true,
				cm : colModel,
				loadMask : true,
				sm : sm,
				// plugins: [this.groupG],
				tbar : [this.queryDailyBtn, '-', this.addDailyBtn, '-',
						this.delDailyBtn, '-', this.ckDailyBtn, '-',this.putinJobBtn],
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

};

Ext.extend(daily.check.gridPanel, Ext.grid.GridPanel, {
	ckDailyck : function() {
		// return false;
		var infoValue = "";
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length != 1) {
			alert('你只能选中一条记录进行查看审核信息');
			return false;
		}
		if (records.length == 1) {
			var rd = records[0];
			if (rd.data['VERIFY_TIME'] == '') {
				alert('该信息还未审核');
				return false;
			}
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
						items : [this.htmleE]
					});
		}
		win.show();
	},
	//提交维护作业
	putinJobFn:function() {
		var params = new Array(); 
		params.push(Global.url.iteminstanceid);  //实例ID
		params.push(Global.url.itemid);  //项目ID
		params.push(Global.url.date);  //日期
		params.push(Global.url.jobid);
		params.push(Global.url.value);
		params.push(Global.url.jobitemsts);
		params.push(decodeURIComponent(Global.url.jobname));
		params.push(decodeURIComponent(Global.url.itemname));
		params.push(window);
		
	    var iWidth = screen.availWidth;//500px
	    var iHeight = screen.availHeight;//430px
		var resultArr = window.showModalDialog("../../../workshop/maintjobplan/itemResultFillIn.jsp",params,"resizable=yes;dialogWidth="+iWidth+";dialogHeight="+iHeight+";help=0;scroll=1;status=0;");
		
		if(resultArr) {
	        if(resultArr.length>0)
	        {
	            if(resultArr[0]=="ok")
	            {
	            	if(Global.url.iteminstanceid == -2) {
	            		Global.url.iteminstanceid = resultArr[1];
	            	}
	            	Global.url.value = resultArr[2];
		            	
	            	var xml = '<?xml version="1.0" encoding="gb2312"?><root><itemIntsIds>'+Global.url.iteminstanceid+'</itemIntsIds></root>';
	            	var dXML = new ActiveXObject("Microsoft.XMLDOM");
					dXML.loadXML(xml);
		
					var xmlhttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
					var submitURL = "../../servlet/jobiteminstanceservlet?tag=14";
					xmlhttpRequest.open("POST",submitURL,false);
					xmlhttpRequest.send(dXML);
					if(isSuccess(xmlhttpRequest)) {
						alert("作业提交成功！")
					}
	            }
	        }
	    }
	},
	delDailyBtnFn : function() {
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('必须选中你要删除的文件');
			return false;
		}
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXml.createElement("root");
		sendXml.appendChild(root);
		var editRoot = sendXml.createElement("del");
		root.appendChild(editRoot);
		var objects = sendXml.createElement('objects');
		var typeid = sendXml.createElement('TYPE_ID');
		typeid.text = this.config.sid;
		objects.appendChild(typeid);
		root.appendChild(objects);
		for (var i = 0, n; n = records[i]; i++) {
			el = sendXml.createElement("guidLine");
			el.setAttribute('DAILY_INSTANCE_ID', n.get('DAILY_INSTANCE_ID'));
			editRoot.appendChild(el);
		}
		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
		sendRequest.open("post", '../../servlet/healthRptAction?action=37',
				false);
		sendRequest.send(sendXml);
		if (sendRequest.readyState == 4 && sendRequest.status == 200) {
			var responseRoot = Ext.util.JSON.decode(sendRequest.responseText);
			if (responseRoot.success == true) {
				this.store.load(this.store.lastOptions);
				// alert(responseRoot.instId);
				alert('数据删除成功!');
			} else {
				alert('数据删除失败!');
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
		params.oprateFlag = true;// 按钮是否可以选
		params.sid = this.sid;
		params.saveFlag = false;
		params.beginTime = data['BEGIN_TIME'];
		params.submitTime = data['SUBMIT_TIME'];
		params.ptitle = this.title;
		params.bigTitle = '修&nbsp;改&nbsp;维&nbsp;护&nbsp;日&nbsp;记';
		params.content = data['CHECK_IDEA'];
		params.grid = grid;
		var w = window.screen.width;
		var h = window.screen.height - 20;
	    window.showModelessDialog(
						"dailyGuidelineLookup.html",
						params,
						"dialogWidth="
								+ w
								+ ";dialogHeight="
								+ h
								+ ";help=0;scroll=yes;status=0;resizable=yes;center=yes");
	     window.setTimeout("showBusiReport("+data['DAILY_INSTANCE_ID']+","+this.sid
	     	+",'"+data['BEGIN_TIME']+"')",1500);
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
		if(isChk==undefined||isChk=='')
		{
				isChk = '-1';
		}
		//linjl 2012-4-17
		/**
		if(this.sid=='21'||this.sid=='22'){
			win.isLinkJobItem.setValue("0");
		}
		**/
		//end
		var neName = win.neName.getValue();
		if(neName==undefined)
		{
			neName = "";
		}
		params = {
			begDate : win.startDate.getValue().format('Y-m-d'),
			endDate : win.endDate.getValue().format('Y-m-d'),
			isChk : isChk,
			neName : encodeURIComponent(neName),
			//linjl 2012-3-12
			itemId : Global.url.itemid,
			curPlanDate : Global.url.date,
			isLinkJobItem : win.isLinkJobItem.getValue()
			//end
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
		params.atTab = this;
		params.itemid = this.config.url.itemid;//linjl 2012-4-18
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

//linjl 2012-3-28 查看业务稽核报告
function showBusiReport(DAILY_INSTANCE_ID,sid,BEGIN_TIME){
	 var w = window.screen.width;
	 var h = window.screen.height - 20;
	 if(sid!='1111'){return}
	 var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	 xmlHttp.open("POST","../../servlet/commonservlet?tag=201&paramValue=" + getAESEncode(encodeURIComponent("select * from (select logic_analyze_rule_id,analyze_task_batch_id,ANALYZE_END_DATE,rownum M from ( "
 		+" select b.logic_analyze_rule_id,b.analyze_task_batch_id,b.ANALYZE_END_DATE from DAILY_INSTANCE a,ANALYZE_TASK_BATCH b "
 		+" where a.daily_instance_id="+DAILY_INSTANCE_ID+" and a.daily_vindicate_id="+sid
		+" and a.ne_id=b.logic_analyze_rule_id and b.ANALYZE_END_DATE>=to_date('"+BEGIN_TIME+" 00:00:00','yyyy-mm-dd hh24:mi:ss') "
		+" and b.ANALYZE_END_DATE<=to_date('"+BEGIN_TIME+" 23:00:00','yyyy-mm-dd hh24:mi:ss') "
		+" order by b.ANALYZE_END_DATE DESC)) where M=1")),false);
	 xmlHttp.send();
	 var id1='',id2='';
	 try{
        id1 = xmlHttp.responseXML.selectSingleNode("/root/rowSet/LOGIC_ANALYZE_RULE_ID").text;
	    id2 = xmlHttp.responseXML.selectSingleNode("/root/rowSet/ANALYZE_TASK_BATCH_ID").text;
     }catch(e){}
	 window.showModelessDialog("../../../workshop/logicaudit/infoList.jsp?logicAnalyseRuleId="+id1
		 +"&type=&analyseTaskBatchId="+id2,null,"dialogWidth="+w+";dialogHeight="+h
		 +";help=0;scroll=yes;status=0;resizable=yes;center=yes");
}

daily.check.CenterPanel = function(config) {
	this.queryWin = new daily.check.QueryWin();
	daily.check.CenterPanel.superclass.constructor.call(this, {
		id : 'daily_chck_center_tab',
		border : false,
		activeTab : 0,
		deferredRender : true,
		minTabWidth : 135,
		tabWidth : 135,
		enableTabScroll : true,
		height : 400,
		listeners : {
			tabchange : {
				fn : this.tabChangeFn,
				scope : this
			}
		}
			// hideMode:'offsets',

		});
}
Ext.extend(daily.check.CenterPanel, Ext.TabPanel, {
			tabChangeFn : function(tabpanel, panel) {
				var atab = this.getActiveTab();
				/*
				 * var sendXml = new ActiveXObject("Microsoft.XMLDOM"); var root =
				 * sendXml.createElement("root"); sendXml.appendChild(root); var
				 * editRoot = sendXml.createElement("del");
				 * root.appendChild(editRoot); var objects =
				 * sendXml.createElement('objects'); var typeid =
				 * sendXml.createElement('TYPE_ID'); typeid.text='中欧国内地方领导';
				 * objects.appendChild(typeid); root.appendChild(objects);
				 */
				// this.queryWin.querySearch();
				var queryWin = this.queryWin;
				if(queryWin!=undefined)
				{
					this.queryWin.isChkCombo.setValue('0');
					//linjl 2012-3-26
					if(Global.url.iteminstanceid!=null&&Global.url.itemid!=null){
						//作业执行,作业审核
						this.queryWin.isLinkJobItem.setValue('1');
					}else if(Global.url.action_type==null&&Global.url.itemid==null){
						//日常检查->个人日常检查
						this.queryWin.isLinkJobItem.setValue('1');
					}else{
						this.queryWin.isLinkJobItem.setValue('0');
					}
					//end
					var endDate = new Date();
					endDate.setDate(endDate.getDate() + 1);
					endDate.format('Y-m-d')
					this.queryWin.endDate.setValue(endDate);
					var startDate = new Date();
					if(Global.url.itemid==null){
						startDate.setDate(startDate.getDate() + -100);
					}
					startDate.setDate(startDate.getDate());
					startDate.format('Y-m-d')
					this.queryWin.startDate.setValue(startDate);
					this.queryWin.neName.setValue('');
				}
				atab.store.load({
							params : {
								typeid : atab.sid,
								start : 0,
								limit : 18
							}
						});

			}
		});
daily.check.MainPanel = function(config) {

	config = config || {};
	config['_makepn'] = {
		'MainPanel' : this
	};
	var e = document.body;
	Ext.EventManager.onWindowResize(this.fireResize.createDelegate(this));
	this.centerPanel = new daily.check.CenterPanel(config);
	daily.check.MainPanel.superclass.constructor.call(this, {
				renderTo : Ext.getBody(),
				layout : 'fit',
				width : e.clientWidth,
				height : e.clientHeight,
				// width:1200,
				items : [this.centerPanel]
			});
	url = '../../servlet/healthRptAction?action=26';// 请求的服务器地址
	var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
	sendRequest.open("post", url, false);
	sendRequest.send(null);
	if (sendRequest.readyState == 4 && sendRequest.status == 200) {
		if (sendRequest.responseText != "") {
			var backStore = eval(sendRequest.responseText);
			var configTypes = backStore.rowSet;
			for (ip = 0; ip < configTypes.length; ip++) {
				config.tabTitle = configTypes[ip].DAILY_VINDICATE_NAME;
				config.sid = configTypes[ip].DAILY_VINDICATE_ID;
				config.col1Tit = configTypes[ip].COL_ONE;
				config.col2Tit = configTypes[ip].COL_TWO;
				var gp = new daily.check.gridPanel(config);
				this.centerPanel.add(gp);
				if (ip == 0) {
					this.centerPanel.setActiveTab(gp);
				}
			}
		}
	}
	// 备份检查
	config.tabTitle = "备份维护";
	config.sid = "daily.check.atlnid";
	var atlnPanel = new daily.check.atlnPanel(config)
	this.centerPanel.add(atlnPanel);
	if (this.centerPanel.items.length == 1) {
		this.centerPanel.setActiveTab(atlnPanel);
	}
};
// 备份检查
daily.check.atlnPanel = function(config) {
	Ext.QuickTips.init();
	// 判断是否是动态生成
	config['_makepn']['daily.check.atlnPanel'] = this;
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
				name : 'ischeck'
			}];
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cmd = [new Ext.grid.RowNumberer(), sm, {
				header : '状态',
				dataIndex : 'ischeck',
				sortable : true,
				menuDisabled : true,
				align : 'center',
				renderer : function(value) {
					if (value == "0") {
						return "<span style=color:red>未审核</span>";
					} else if (value == '1') {
						return "<span style=color:blue>已审核</span>";
					}

				}
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
				width : 150,
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
				width : 150,
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
				width : 150,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '结果和说明',
				dataIndex : 'atln_idea',
				width : 150,
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
				sortable : true,
				width : 150,
				menuDisabled : true,
				align : 'center'
			}, {
				header : '审核内容',
				dataIndex : 'verify_idea',
				sortable : false,
				width : 150,
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
							url : '../../servlet/healthRptAction?action=51'
						}),
				reader : jsR,
				remoteSort : true

			});

	this.addDailyBtn = new Ext.Toolbar.Button({
				text : '增加',
				tooltip : '增加备份日志',
				iconCls : 'icon-add',
				pressed : true,
				handler : this.addDailyck,
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
	this.delDailyBtn = new Ext.Toolbar.Button({
				text : '删除',
				tooltip : '删除',
				iconCls : 'delete',
				pressed : true,
				handler : this.delDailyBtnFn,
				scope : this

			});
	this.ckDailyBtn = new Ext.Toolbar.Button({
				text : '查看审核信息',
				tooltip : '审核维护日志',
				iconCls : 'icon-view',
				handler : this.ckDailyck,
				scope : this

			});

	daily.check.atlnPanel.superclass.constructor.call(this, {
				title : this.config.tabTitle,
				sid : this.config.sid,
				border : true,
				store : store,
				stripeRows : true,
				cm : colModel,
				loadMask : true,
				sm : sm,
				tbar : [this.queryDailyBtn, '-', this.addDailyBtn, '-',
						this.delDailyBtn, '-', this.ckDailyBtn, '-'],
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


Ext.extend(daily.check.atlnPanel, Ext.grid.GridPanel, {
	ckDailyck : function() {
		var infoValue = "";
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length != 1) {
			alert('你只能选中一条记录进行查看审核信息');
			return false;
		}
		var rd = records[0];
		if (rd.data['verify_person'] == '') {
			alert('该信息还未审核');
			return false;
		}
		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
		sendRequest.open("post",
				'../../servlet/healthRptAction?action=56&dailyInstId='
						+ rd.data['daily_atln_instance_id'], false);
		sendRequest.send(null);
		if (sendRequest.readyState == 4 && sendRequest.status == 200) {
			if (sendRequest.responseText == 'null'
					|| sendRequest.responseText == '') {
				infoValue = '';
			}
			infoValue = sendRequest.responseText;
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
			});
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
						items : [this.htmleE]
					});
		}
		win.show();
	},
	delDailyBtnFn : function() {
		var sm = this.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('必须选中你要删除的文件');
			return false;
		}
		var deleteIds = '';
		for (var i = 0; i < records.length; i++) {
			if (deleteIds == '') {
				deleteIds += records[i].get('daily_atln_instance_id');
			} else {
				deleteIds += ',' + records[i].get('daily_atln_instance_id');
			}
		}
		Ext.Ajax.request({
					url : '../../servlet/healthRptAction?',
					method : 'post',
					params : {
						action : '54',
						'deleteIds' : deleteIds
					},
					success : function(response) {
						if (response.responseText == 'true') {
							this.store.load(this.store.lastOptions);
							Ext.MessageBox.alert('提示', '   删 除 成 功!   ');
						} else {
							Ext.MessageBox.show({
										title : '系统提示',
										msg : '删除失败,请刷新后重试!',
										autoWidth : true,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
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
		if (verify_person == null || verify_person == '') {
			params.type = false;
			params.ischeck = '0';
		} else {
			params.type = true;// 已审核
			params.ischeck = '1';
		}
		params.submiTime = data['submit_time'];
		params.bigTitle = '修&nbsp;改&nbsp;备&nbsp;份&nbsp;日&nbsp;记';
		params.btText = '修改';
		params.tartTime = data['atln_start_time'];
		params.endTime = data['atln_end_time'];
		params.atlnContent = data['atln_content'];
		params.staffName = data['staff_name'];
		params.atTab = grid;
		params.atlnIdea = data['atln_idea'];
		params.atlnClass = data['code'];
		params.ptitle = this.title;
		params.verify_person = data['verify_person'];
		params.verify_time = data['verify_time'];
		params.verify_idea = data['verify_idea'];
		params.lookType = false;//个人查看
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
		if(isChk==undefined||isChk=='')
		{
				isChk = '-1';
		}
		var neName = win.neName.getValue();
		if(neName==undefined)
		{
			neName = "";
		}
		params = {
			begDate : win.startDate.getValue().format('Y-m-d'),
			endDate : win.endDate.getValue().format('Y-m-d'),
			isChk : isChk,
			neName : encodeURIComponent(neName)
		};
		Ext.apply(thiz.baseParams, {
					typeid : this.sid
				});
		Ext.apply(thiz.baseParams, params);
	},
	addDailyck : function() {
		var params = {};
		// params.oprateType = "save";// 操作类型
		// params.oprateFlag = false;// 按钮是否可以选
		params.sid = this.sid;
		params.ptitle = this.title;
		params.bigTitle = '备&nbsp;&nbsp;份&nbsp;&nbsp;维&nbsp;&nbsp;护&nbsp;&nbsp;日&nbsp;&nbsp;志';
		params.content = "";
		params.staffName = this.staffName;
		params.atTab = this;
		var w = window.screen.width;
		var h = window.screen.height - 20;
		window
				.showModelessDialog(
						"daily_add_atln.html",
						params,
						"dialogWidth="
								+ w
								+ ";dialogHeight="
								+ h
								+ ";help=0;scroll=yes;status=0;resizable=yes;center=yes");
	}
});

Ext.extend(daily.check.MainPanel, Ext.Panel, {
			fireResize : function() {
				var e = document.body;
				this.setSize(e.clientWidth, e.clientHeight);
				this.doLayout();
			}
		});

function initLoad() {
	Global.url = getUrlParam();
	Global.hiddenJob = (Global.url.itemid)?false:true;
	var mainPanel = new daily.check.MainPanel(Global);
}
