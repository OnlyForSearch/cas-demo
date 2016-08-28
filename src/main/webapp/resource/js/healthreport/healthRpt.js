Ext.namespace("health.rpt");
Ext.LoadMask.prototype.msg = "数据载入中...";
Ext.BLANK_IMAGE_URL = '../../resource/js/ext-2.0.2/resources/images/default/s.gif';

// Ext.Ajax.timeout = 900000;
// *************************************************************中间部分
health.rpt.cTitlePanel = function(config) {
	config['_makepn']['health.rpt.center.cTitlePanel'] = this;
	Ext.apply(this, config);
	this.config = config;
	health.rpt.cTitlePanel.superclass.constructor.call(this, {
		border : false,
		height : 30,
		frame : true,
		// style='border:#00FF99 dotted 1px; height:100%;width:100%'
		html : "<div  style=' height:50%;width:100%'><table  align='center' ><tr><td><h4>"
				+ this.config.bigTitle + "</h4></td></tr><table><div>"
	});
};

Ext.extend(health.rpt.cTitlePanel, Ext.Panel, {});
health.rpt.cListPanel = function(config) {
	config['_makepn']['health.rpt.cListPanel'] = this;
	Ext.apply(this, config);
	this.config = config;
	this.locatName = new Ext.XTemplate('<table><tbody><tr><td valign="middle"><br><br><br><br><br><br><br><br><br>{hrpoNa}</td></tr></tbody></table>');
	this.locatResult = new Ext.XTemplate(
			'<div   style="width:100%"><br/><div align="left"><span>诊断科目：{verifySt}个</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>抽查指标：{verifyKpi}个</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>正常指标：{normalKpi}个</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>异常指标：{execeKpi}个</span></div>',
			'<br/>',
			'<div align="center"><font color="#3d3ab6">————————————————————————————————————————————————————————————————————————————————————————————————————</font></div>',
			'<div align="left">&nbsp;<span class="imgSpan"><img src="{img1}" ext:qtip="双击图片可以查看详细信息" ></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="imgSpan"><img src="{img2}" ext:qtip="双击图片可以查看详细信息" ></span></div></br>',
			'<tpl if="this.isGirl(ststisInfo)">',
			'<div align="center">——————————————————————————————————————改进建议——————————————————————————————————————————————————</div>',
			'<div><table width="700px"><tbody><tr><td>{ststisInfo}</td></tr></tbody></table></div>',
			'</tpl>', '</div>', {
				isGirl : function(ststisInfo) {
					var flag = true;
					if (ststisInfo == "") {
						flag = false;
					}
					return flag;
				}

			}

	);
	var loadM = new Ext.LoadMask(Ext.getBody(), {
				msg : "加载中..."
			});
	this.locatResult.compile();
	this.dsStore = new Ext.data.Store({
				id : 'hds',
				proxy : new Ext.data.HttpProxy(new Ext.data.Connection({
							url : '../../servlet/healthRptAction?action=2',
							timeout : 300000,
							method : 'POST'
						})),
				reader : new Ext.data.JsonReader({
							root : 'rows'
						}, [{
									name : 'hrpoId'
								}, {
									name : 'hrpoNa'
								}, {
									name : 'verifySt'
								}, {
									name : 'verifyKpi'
								}, {
									name : 'normalKpi'
								}, {
									name : 'execeKpi'
								}, {
									name : 'img1'
								}, {
									name : 'uid'
								}, {
									name : 'img2'
								}, {
									name : 'ststisInfo'
								}])
			});

	var colModel = new Ext.grid.ColumnModel([{
		header : "诊断对象",
		renderer : (function(value, metadata, record, rowIndex, colIndex, store) {
			var data = record.data;
			this.uid = data.uid;
			var html = this.locatName.apply(data);
			return html;
		}).createDelegate(this),
		// sortable: true,
		width : 200

	}, {
		header : "诊断结果",
		renderer : (function(value, metadata, record, rowIndex, colIndex, store) {
			var data = record.data;
			var html = this.locatResult.apply(data);
			return html;
		}).createDelegate(this),
		width : 1240
	}

	]);
	function nowDate() {
		var now = new Date()
		return (now.getYear() + "-" + (now.getMonth() + 1) + "-"
				+ now.getDate() + " " + now.getHours() + ":" + now.getMinutes()
				+ ":" + now.getSeconds());

	}

	this.startDate = new Ext.form.DateField({
				id : 'beginDate',
				format : 'Y-m-d H:i:s',
				allowBlank : false,
				blankText : '开始日期不能为空',
				value : this.getStartDate(),
				dateRange : {
					begin : 'beginDate',
					end : 'endDate'
				},
				editable : true,
				menuListeners : {
					select : function(m, d) {
						var dt = new Date(d);
						dt.setHours(0);
						dt.setMinutes(0);
						dt.setSeconds(0);
						this.setValue(dt);
					}
				},
				// vtype: 'dateRange' ,
				width : 150
			});
	this.endDate = new Ext.form.DateField({
				id : 'endDate',
				format : "Y-m-d H:i:s",
				allowBlank : false,
				value : this.getEndDate(),
				dateRange : {
					begin : 'beginDate',
					end : 'endDate'
				},
				editable : true,
				menuListeners : {
					select : function(m, d) {

						var dt = new Date(d);
						dt.setHours(23);
						dt.setMinutes(59);
						dt.setSeconds(59);
						this.setValue(dt);
					}
				},
				width : 150
			});
	health.rpt.cListPanel.superclass.constructor.call(this, {
				cm : colModel,
				store : this.dsStore,
				border : false,
				cls : 'qp-center-centerGrid-panel',
				pinstance_id : "",
				nowDate : nowDate(),
				uid : '',
				listeners : {
					rowdblclick : {
						fn : this.onRowDblClickFn,
						scope : this
					}
				},
				tbar : ['<b>开始时间：</b>', this.startDate,
						'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', '<b>结束时间：</b>',
						this.endDate, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', {
							text : '查询',
							iconCls : 'searchl',
							pressed : true,
							handler : this.aginLoad,
							scope : this
						}, '-', {
							text : '提交报告',
							iconCls : 'submitRpt',
							pressed : true,
							tooltip : '提交',
							handler : this.subRptFn,
							scope : this
						}, {
							text : '生成打印页',
							iconCls : 'flowPrint',
							pressed : true,
							handler : this.createPrintHtml,
							scope : this
						}, '->', '&nbsp;' + nowDate() + '&nbsp;&nbsp;'],
				stripeRows : true,
				loadMask : true,
				height : 350,
				autoScroll : true,
				viewConfig : {
					forceFit : false,
					rowSelectorDepth : 100,
					getRowClass : function(record, rowIndex, rowParams, store) {
						var colorr = "";
						if (rowIndex % 2 == 0) {
							colorr = 'qp-x-grid3-row1';
						} else {
							colorr = 'qp-x-grid3-row2';
						}
						return colorr;
					}
				}

			});
	var dt = new Date(this.startDate.getValue());
	var dt2 = new Date(this.endDate.getValue());
	params = {
		startDate : dt.format('Y-m-d H:i:s'),
		endDate : dt2.format('Y-m-d H:i:s'),
		ptype : 'RPT'
	}
};

Ext.extend(health.rpt.cListPanel, Ext.grid.GridPanel, {
	createPrintHtml : function() {
		// alert(this.store.getCount());
		if (this.store.getCount() < 1) {
			alert('没有可生成的打印数据!!');
			return false;
		}
		var neLists = "[";
		for (var i = 0; i < this.store.getCount(); i++) {
			var r = this.store.getAt(i);
			neLists += "{neName:'" + r.data.hrpoNa + "',neid:'" + r.data.hrpoId
					+ "',uid:'" + r.data.uid + "'},"
		}
		neLists = neLists.substring(0, neLists.length - 1) + "]";
		var dt = new Date(this.startDate.getValue());
		var dt2 = new Date(this.endDate.getValue());
		dt2.setDate(dt2.getDate() + 1)
		var nePath = this.config.nodeTextSuperPath + this.config.nodeText;
		document.getElementById("paramsHiden").value = "info={startDate:'"
				+ dt.format('Y-m-d') + "',endDate:'" + dt2.format('Y-m-d')
				+ "',nePath:'" + nePath + "',ptype:'initShow',neLists:"
				+ neLists + "}";
		forwdForm.submit();
		// var feature ='width='+w+',height='+h;
		// window.showModelessDialog("healthRptPrint.html",params,"dialogWidth="+w+";dialogHeight="+h+";help=0;scroll=yes;status=0;resizable=yes;center=yes");
		// window.open("healthRptPrint.html?"+params.join("&"),'_blank',"channelmode=yes,scrollbars=1,menubar=1,location=1,status=1,toolbar=1,resizable=1,scrollbars=1,top=0,left=0,help=1,status=1");
	},
	getEndDate : function() {
		var now = new Date()
		now.setDate(now.getDate() - 1);
		now.setHours(23);
		now.setMinutes(59);
		now.setSeconds(59);
		return now;
	},
	getStartDate : function() {
		var now = new Date()
		now.setDate(now.getDate() - 1);
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		return now;
	},
	getDate : function(days) {
		var myDate = new Date();

		myDate.setDate(myDate.getDate() + days);

		return myDate;
	},
	getNowDate : function() {
		var now = new Date();
		var todayString = now.format("Y-m-d H:m:s");
		return todayString;
	},
	onRowDblClickFn : function(grid, rowIndex, e) {
		var data = grid.getStore().getAt(rowIndex).data;
		var params = {};
		var dt = new Date(this.startDate.getValue());
		var dt2 = new Date(this.endDate.getValue());
		params.ptype = "initShow";
		params['data'] = data;
		params['startDate'] = dt.format('Y-m-d H:i:s');
		params['endDate'] = dt2.format('Y-m-d H:i:s');
		var w = window.screen.width;
		var h = window.screen.height - 20;
		window
				.showModelessDialog(
						"rptGuideline.html",
						params,
						"dialogWidth="
								+ w
								+ ";dialogHeight="
								+ h
								+ ";help=0;scroll=yes;status=0;resizable=yes;center=yes");
	},
	subRptFn : function() {
		var dt = new Date(this.startDate.getValue());
		var dt2 = new Date(this.endDate.getValue());
		if (this.pinstance_id == "") {// 判断是否已经提交了报告
			url = '../../servlet/healthRptAction?action=7&uid=' + this.uid;// 请求的服务器地址
			var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
			sendRequest.open("post", url, false);
			sendRequest.send(null);
			if (sendRequest.readyState == 4 && sendRequest.status == 200) {
				var responseInfo = Ext.util.JSON
						.decode(sendRequest.responseText);
				this.pinstance_id = responseInfo.pinstid;
			}
		}
		var params = {};
		var sRequest = new ActiveXObject("Microsoft.XMLHTTP");
		sRequest.open("post",
				'../../servlet/healthRptAction?action=16&pinstance_id='
						+ this.pinstance_id, false);
		sRequest.send(null);
		if (sRequest.readyState == 4 && sRequest.status == 200) {

			var responseInfo = Ext.util.JSON.decode(sRequest.responseText);
			params['nowDate'] = responseInfo.prt.submit_time;
			params['startDate'] = responseInfo.prt.begin_time;
			params['endDate'] = responseInfo.prt.end_time;
			params['prtTile'] = responseInfo.prt.health_instance_name;
			params['ckPerson'] = responseInfo.chekInfo;
			if (responseInfo.chekInfo == "") {
				params['flag'] = false;
				var getDefalutRequest = new ActiveXObject("Microsoft.XMLHTTP");
				getDefalutRequest.open("post",
						'../../servlet/healthRptAction?action=23&pinstance_id='
								+ this.pinstance_id, false);
				getDefalutRequest.send(null);
				if (getDefalutRequest.readyState == 4
						&& getDefalutRequest.status == 200) {
					var backInfo = eval(getDefalutRequest.responseText);
					var tit = backInfo.prtTitle;
					params['prtTile'] = tit[0].NE_NAME + "诊断报告";
					var pers = backInfo.persons;
					var ckPid = "";
					var ckPname = "";
					for (i = 0; i < pers.length; i++) {
						ckPid += pers[i].STAFF_ID + ",";
						ckPname += pers[i].STAFF_NAME + "、";

					}
					params['ckPerson'] = ckPname;
					params['ckPid'] = ckPid;
				}
			} else {
				params['flag'] = true;
			}
		}

		params['pinstance_id'] = this.pinstance_id;
		window
				.showModalDialog("subitRptinfo.html", params,
						"dialogWidth=908px;dialogHeight=680px;help=0;scroll=0;status=0;");
	},
	aginLoad : function() {
		/*
		 * this.pinstance_id=""; var dt = new Date(this.startDate.getValue());
		 * var dt2 = new Date(this.endDate.getValue()); params= {
		 * startDate:dt.format('Y-m-d H:i:s'), endDate:dt2.format('Y-m-d
		 * H:i:s'), neid:this.config.neId, viewType:this.config.viewType }
		 * 
		 * this.dsStore.load({params:params});
		 */

		var sw = this.config._makepn['health.rpt.searchWin'];
		sw.show();

	}
});
health.rpt.centerPanel = function(config) {
	config['_makepn']['health.rpt.centerPanel'] = this;
	Ext.apply(this, config);
	this.config = config;
	this.ctPanel = new health.rpt.cTitlePanel(config);
	this.clPanel = new health.rpt.cListPanel(config);
	this.centerpanel = new Ext.Panel({
				border : false,
				region : 'center',
				layout : 'fit',
				items : [this.clPanel]
			});

	this.southpanel = new Ext.Panel({
				border : false,
				// collapseMode:'mini',
				split : true,
				region : 'north',

				autoWidth : true,
				height : 30,
				layout : 'fit',
				items : [this.ctPanel]
			});
	health.rpt.centerPanel.superclass.constructor.call(this, {
				border : true,
				region : 'center',
				layout : 'border',
				items : [this.centerpanel, this.southpanel]
			});
};

Ext.extend(health.rpt.centerPanel, Ext.Panel, {
			myPrint : function() {
				window.print();
			}
		});
health.rpt.MainPanel = function(config) {
	config = config || {};
	config['_makepn'] = {
		'MainPanel' : this
	};
	this.searchWin = new health.rpt.SearchWin(config);
	this.centerPanel = new health.rpt.centerPanel(config);
	health.rpt.MainPanel.superclass.constructor.call(this, {
				layout : 'border',
				items : [this.centerPanel]
			});
	this.searchWin.show();
	// this.on("afterlayout",this.onAfterlayoutFn,this);
};
Ext.extend(health.rpt.MainPanel, Ext.Viewport, {
			onAfterlayoutFn : function() {

			}
		});
function initLoad() {
	var win;
	var par = getUrlParam();
	url = '../../servlet/healthRptAction?action=4&HrptBigTitle=HEALTH_RPT_BIG_TITLE&node_id='
			+ par.neId + '&viewType=' + par.viewType;// 请求的服务器地址
	var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
	sendRequest.open("post", url, false);
	sendRequest.send(null);
	if (sendRequest.readyState == 4 && sendRequest.status == 200) {
		var responseInfo = eval(sendRequest.responseText);
		par.bigTitle = responseInfo.bigtTitle;
		var pathList = responseInfo.pathList;
		par.nodeText = "";
		par.nodeTextSuperPath = "";
		if (pathList.length > 0) {
			for (var p = 1; p < pathList.length - 2; p++) {
				par.nodeTextSuperPath += pathList[p].ITEM_LABEL + "-";
			}
			par.nodeText = pathList[pathList.length - 1].ITEM_LABEL
		} else {
			alert('配置项节点没有健康报告');
			return false;
		}

	} else {
		par.bigTitle = "网元健康报告";
	}
	var mainPanel = new health.rpt.MainPanel(par);
	/*
	 * if (!win) { win = new Ext.Window({ id:'be-win', layout:'fit',
	 * title:'健康报告', collapsible:false, closable:false,
	 * 
	 * draggable:false, resizable:false, x:0, y:0,
	 * 
	 * //modal:true, width : 1000,//(Ext.getBody().getSize().width -50), height
	 * :431,// (Ext.getBody().getSize().height-25), constrain:true,
	 * items:[mainPanel]
	 * 
	 * }); } win.show();
	 */
	var gridLt = mainPanel.centerPanel.clPanel;
	var dt = new Date(gridLt.startDate.getValue());
	var dt2 = new Date(gridLt.endDate.getValue());
	params = {
		startDate : dt.format('Y-m-d H:i:s'),
		endDate : dt2.format('Y-m-d H:i:s'),
		neid : par.neId,
		viewType : par.viewType
	}
	// gridLt.dsStore.load({params:params});
}

health.rpt.SearchWin = function(config) {
	config['_makepn']['health.rpt.searchWin'] = this;
	Ext.apply(this, config);
	this.config = config;
	this.kpiVerify = new health.rpt.kpiVerifyPanel(this.config);

	// **********************************
	this.queryTree = new Ext.tree.TreePanel({
				animate : true,
				region : 'center',
				enableDD : false,
				border : false,
				// width:400,
				// height :350,
				autoScroll : true,
				animate : false,
				rootVisible : false,
				checkModel : 'cascade', // 对树的级联多选
				onlyLeafCheckable : false,// 对树所有结点都可选
				root : new Ext.tree.AsyncTreeNode({
							text : this.config.nodeText,
							leaf : false,
							// icon:'zhibiao'
							checked : false,
							draggable : false,
							expanded : true,
							clev : 0,
							ne_id : config.neId,
							baseAttrs : {
								uiProvider : Ext.ux.TreeCheckNodeUI
							},
							p_view_type : this.config.viewType,
							p_node_id : this.config.neId
						}),
				listeners : {
					beforeload : {
						fn : this.treeClick,
						scope : this
					},
					load : {
						fn : this.onLoadAnyFn,
						single : true,
						delay : 100
					},
					click : {
						fn : this.onClickFn,
						scope : this
					}
				}
			});

	// rt.setFirstChild()
	// this.queryTree.setRootNode(this.root);
	// this.queryTree.expandAll();
	health.rpt.SearchWin.superclass.constructor.call(this, {
				title : this.config.nodeTextSuperPath + this.config.nodeText,
				layout : 'border',
				collapsible : false,
				closable : false,
				closeAction : 'hide',
				iconCls : 'queryTiaoJian',
				modal : true,
				draggable : true,
				resizable : false,
				// x:0,
				y : 10,
				width : 700,// (Ext.getBody().getSize().width -50),
				height : 380,// (Ext.getBody().getSize().height-25),
				constrain : true,
				buttonAlign : 'left',
				buttons : [{
							text : '保存查询条件',
							iconCls : 'queryAdd1',
							handler : this.onConditionFn,
							scope : this
						}, {
							text : '查询',
							iconCls : 'searchl',
							handler : this.onQueryHrptFn,
							scope : this
						}, {
							text : '刷新',
							iconCls : 'refresh1',
							handler : this.onResefFn,
							scope : this
						}],
				items : [this.queryTree, this.kpiVerify]
			});

	this.queryTree.loader = new Ext.tree.TreeLoader({
				dataUrl : '',
				expanded : true,
				baseAttrs : {
					uiProvider : Ext.ux.TreeCheckNodeUI
				}
			})
	/*
	 * this.queryTree.on('checkchange', function(node, checked) { node.expand();
	 * node.attributes.checked = checked; child.ui.toggleCheck(checked);
	 * node.eachChild(function(child) { //alert(checked); child.expand();
	 * child.ui.toggleCheck(checked); child.attributes.checked = checked;
	 * child.fireEvent('checkchange', child, checked); }); }, this.queryTree);
	 */

	this.queryTree.on('checkchange', function(node, checked) {
				if (!node.isLeaf()) {
					if (checked) {
						node.expand();
					} else {
						node.collapse();
					}
				}
				node.eachChild(function(child) {
							// child.ui.toggleCheck(checked);
							// child.attributes.checked = checked;
							if (!child.isLeaf()) {
								if (checked) {
									child.expand();
									child.fireEvent('checkchange', child,
											checked);
								} else {
									child.collapse();
								}
							}
						});
			}, this.queryTree);
};
Ext.extend(health.rpt.SearchWin, Ext.Window, {
	onClickFn : function(node) {
		if (node.attributes.clev == 3) {
			this.kpiVerify.config.defaultReport_Config_id = node.parentNode.parentNode.attributes.report_config_id
			this.kpiVerify.config.kpiID = node.attributes.kpi_id
			this.kpiVerify.expand();
			this.kpiVerify.setDisabled(false);
			this.kpiVerify.getLayout().setActiveItem(0);
			this.kpiVerify.dstore.load({
				params : {
					start : 0,
					limit : 5,
					kpi_id : this.kpiVerify.config.kpiID,
					defaultReport_Config_id : this.kpiVerify.config.defaultReport_Config_id
				}
			});
		} else {
			this.kpiVerify.getLayout().setActiveItem(1);
			this.kpiVerify.setDisabled(true);
			this.kpiVerify.collapse();
		}

	},
	onResefFn : function() {

		this.queryTree.getRootNode().reload();

	},
	onQueryHrptFn : function() {
		/*
		 * 传递后台的数据格式为: 1.网元1;科目1,科目2;指标1,指标2|网元2;科目1,科目2;指标1,指标2 2.网元1,网元2,网元3
		 */
		var nck = this.queryTree.getChecked();
		var cks = new Array();
		var neList = ",";
		for (var i = 0; i < nck.length; i++) {
			if (nck[i].attributes.clev == 1) {
				neList += nck[i].attributes.ne_id + ",";
				cks.push(nck[i]);
			}
		}
		if (neList == ",") {
			alert('必须要有选中的查询指标');
			return false;
		}
		var lastInfo = "";
		for (var n = 0; n < cks.length; n++) {
			var ck2 = cks[n].childNodes;
			var km = "";
			var zb = "";
			for (var g = 0; g < ck2.length; g++) {
				if (ck2[g].attributes.checked) {
					km += ck2[g].attributes.kpi_group_id + ',';
					var ck3 = ck2[g].childNodes;
					for (var k = 0; k < ck3.length; k++) {
						if (ck3[k].attributes.checked) {
							zb += ck3[k].attributes.kpi_id + ',';

						}
					}
				}
			}
			lastInfo += cks[n].attributes.ne_id + ";"
					+ km.slice(0, km.length - 1) + ";"
					+ zb.slice(0, zb.length - 1) + "|"
		}
		lastParm = lastInfo.slice(0, lastInfo.length - 1);
		var gridLt = this.config._makepn['health.rpt.cListPanel']
		var dt = new Date(gridLt.startDate.getValue());
		var dt2 = new Date(gridLt.endDate.getValue());
		params = {
			startDate : dt.format('Y-m-d H:i:s'),
			endDate : dt2.format('Y-m-d H:i:s'),
			neid : this.config.neId,
			viewType : this.config.viewType,
			p_con_str : lastParm,
			p_net_limit : neList
		}
		this.hide();
		gridLt.dsStore.load({
					params : params
				});
		// alert( dd.height);
	},
	treeClick : function(node, e) {
		url = "../../servlet/healthRptAction?action=42";
		if (!node.isLeaf()) {
			// alert(node.attributes.clev);
			if (node.attributes.clev == 0) {
				/*
				 * this.queryTree.loader=new Ext.tree.TreeLoader({ dataUrl:
				 * url+'&p_view_type='+
				 * node.attributes.p_view_type+'&p_node_id='+this.config.neId+'&clev='+node.attributes.clev,
				 * baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI } //添加
				 * uiProvider 属性 })
				 */
				Ext.apply(this.queryTree.loader, {
							dataUrl : url + '&p_view_type='
									+ node.attributes.p_view_type
									+ '&p_node_id=' + this.config.neId
									+ '&clev=' + node.attributes.clev
						})
				// this.queryTree.loader.baseAttrs={uiProvider:
				// Ext.ux.TreeCheckNodeUI};
			} else if (node.attributes.clev == 1) {
				/*
				 * this.queryTree.loader=new Ext.tree.TreeLoader({ dataUrl:
				 * url+'&report_config_id='+
				 * node.attributes.report_config_id+'&p_node_id='+this.config.neId+'&clev='+node.attributes.clev+'&ne_id='+node.attributes.ne_id,
				 * baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI } //添加
				 * uiProvider 属性 })
				 */
				Ext.apply(this.queryTree.loader, {
							dataUrl : url + '&report_config_id='
									+ node.attributes.report_config_id
									+ '&p_node_id=' + this.config.neId
									+ '&clev=' + node.attributes.clev
									+ '&ne_id=' + node.attributes.ne_id
						});
			} else if (node.attributes.clev == 2) {
				Ext.apply(this.queryTree.loader, {
							dataUrl : url + '&kpi_group_id='
									+ node.attributes.kpi_group_id
									+ '&p_node_id=' + this.config.neId
									+ '&clev=' + node.attributes.clev
									+ '&ne_type_id='
									+ node.parentNode.attributes.ne_type_id
									+ '&ne_id='
									+ node.parentNode.attributes.ne_id
						});
			}

		}

	},
	onAfterLayoutFn : function(node) {
		node.expand();
		node.eachChild(function(child) {
			child.expand();
			child.ui.toggleCheck(true);
			child.attributes.checked = true;
				// child.fireEvent('checkchange', child, checked);
			});

	},
	onConditionFn : function() {

		var nck = this.queryTree.getChecked();
		if (nck.length < 1) {
			alert('请选中你要保存的指标为查询条件');
			return false;
		}
		var sendXml = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXml.createElement("root");
		sendXml.appendChild(root);
		var addSearch = sendXml.createElement("addSearch");
		root.appendChild(addSearch);
		var objects = sendXml.createElement('objects');
		var nodeId = sendXml.createElement('node_id');
		nodeId.text = this.config.neId;
		objects.appendChild(nodeId);
		root.appendChild(objects);
		var ngkList = "";
		for (var n = 0; n < nck.length; n++) {
			if (nck[n].attributes.clev == 1) {
				var ck2 = nck[n].childNodes;
				for (var g = 0; g < ck2.length; g++) {
					if (ck2[g].attributes.checked) {
						var ck3 = ck2[g].childNodes;
						for (var k = 0; k < ck3.length; k++) {
							if (ck3[k].attributes.checked) {
								el = sendXml.createElement("guidLine");
								el.setAttribute("ne_id",
										nck[n].attributes.ne_id);
								el.setAttribute("kpi_group_id",
										ck2[g].attributes.kpi_group_id);
								el.setAttribute("kpi_id",
										ck3[k].attributes.kpi_id);
								el.setAttribute("level", 3);
								addSearch.appendChild(el);
							}
						}
					}
				}
			}
		}

		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
		sendRequest.open("post", '../../servlet/healthRptAction?action=43',
				false);
		sendRequest.send(sendXml);

		if (sendRequest.readyState == 4 && sendRequest.status == 200) {
			var responseRoot = Ext.util.JSON.decode(sendRequest.responseText);
			if (responseRoot.success == true) {
				alert('查询条件保存成功');
			} else {
				alert('查询条件保存失败');
			}
		}

	},
	onLoadAnyFn : function() {
		// alert();
	}
});

health.rpt.kpiVerifyPanel = function(config) {
	this.config = config || {};
	this.dstore = new Ext.data.Store({
				pruneModifiedRecords : true,
				id : 'hds',
				proxy : new Ext.data.HttpProxy({
							url : '../../servlet/healthRptAction?action=47'

						}),
				reader : new Ext.data.JsonReader({
							root : 'rows'

						}, [{
									name : 'HKPI_VERIFY_ID'
								}, {
									name : 'REPORT_CONFIG_ID'
								}, {
									name : 'VALUE_FROM'
								}, {
									name : 'VALUE_TO'
								}, {
									name : 'UNIT_WEIGHT'
								}, {
									name : 'UNIT_TYPE'
								}, {
									name : 'VALUE_TYPE'
								}, {
									name : 'CALC_TYPE'
								}, {
									name : 'SCORE'
								}]),
				remoteSort : true

			});

	this.colModel = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				header : '上限值',
				dataIndex : 'VALUE_FROM',
				menuDisabled : true,
				width : 50
			}, {
				header : '下限值',
				dataIndex : 'VALUE_TO',
				menuDisabled : true,
				width : 70
			}, {
				header : '单位(比率)',
				dataIndex : 'UNIT_WEIGHT',
				menuDisabled : true,
				width : 60
			}, {
				header : '单位类型',
				dataIndex : 'UNIT_TYPE',
				menuDisabled : true,
				width : 60
			}, {
				header : '取值类型',
				dataIndex : 'VALUE_TYPE',
				menuDisabled : true,
				width : 60
			}, {
				header : '计算方式',
				dataIndex : 'CALC_TYPE',
				menuDisabled : true,
				width : 70
			}, {
				header : '增减可用度',
				dataIndex : 'SCORE',
				menuDisabled : true,
				width : 70
			}

	]);
	this.kpiVerifyGrid = new Ext.grid.GridPanel({
				tbar : [{
							text : '增加',
							handler : this.onAddFn,
							scope : this
						}, '&nbsp;&nbsp;', {
							text : '修改',
							handler : this.onEditFn,
							scope : this
						}, '&nbsp;&nbsp;', {
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
				loadMask : {
					msg : '数据载入中...'
				}
			})
	this.valeFrom = new Ext.form.TextField({
				fieldLabel : '上限值',
				msgTarget : 'title',
				allowBlank : false,
				maxLength : 13,
				blankText : '上限值不能为空',
				regex : /^-?(?:\d+\.?)?\d{1,2}$/,
				regexText : '上限值必须为有理数',
				name : 'valeFrom',
				style : 'margin-bottom:2px',
				labelSeparator : '：',
				anchor : '95%'

			});
	this.valeTo = new Ext.form.TextField({
				fieldLabel : '下限值',
				allowBlank : false,
				maxLength : 13,
				msgTarget : 'title',
				blankText : '下限值不能为空',
				regex : /^-?(?:\d+\.?)?\d{1,2}$/,
				regexText : '下限值必须为有理数',
				labelSeparator : '：',
				msgTarget : 'title',
				name : 'valeTo',
				style : 'margin-bottom:2px',
				anchor : '95%'
			});
	this.unitWeight = new Ext.form.TextField({
				fieldLabel : '单位(比率)',
				labelSeparator : '：',
				allowBlank : false,
				maxLength : 5,
				regex : /^0\.\d*[1-9]\d*$/,
				regexText : '大于0小于1的小数',
				msgTarget : 'title',
				maxLengthText:'长度不能大于5',
				value : '0.01',
				blankText : '单位(比率)不能为空',
				name : 'unitWeight',
				style : 'margin-bottom:2px',
				anchor : '95%'
			});

	this.unitType = new Ext.form.ComboBox({
				fieldLabel : '单位类型',
				anchor : '95%',
				// name:'unitType',
				displayField : 'text',
				labelSeparator : '：',
				typeAhead : true,
				editable : false,
				width : 100,
				loadingText : 'loading...',
				style : 'margin-bottom:1px',
				valueField : 'id',
				triggerAction : 'all',
				emptyText : '选择……',
				mode : 'local',
				selectOnFocus : true,
				store : new Ext.data.SimpleStore({
							autoLoad : true,
							fields : ['id', 'text'],
							data : [[0, '比率来匹配'], [1, '实际值匹配']],
							value : 0
						})
			})
	this.unitType.setValue(0);
	this.valueType = new Ext.form.TextField({
				fieldLabel : '取值类型',
				name : 'valueType',
				msgTarget : 'title',
				maxLength : 5,
				allowBlank : false,
				blankText : '取值类型不能为空',
				regex : /^\d+$/,
				regexText : '取值类型必须为正整数',
				value : 0,
				style : 'margin-bottom:2px',
				labelSeparator : '：',
				anchor : '95%'
			});
	this.callType = new Ext.form.ComboBox({
				fieldLabel : '计算方式',
				labelSeparator : '：',
				anchor : '95%',
				// name:'callType',
				displayField : 'text',
				style : 'margin-bottom:1px',
				typeAhead : true,
				loadingText : 'loading...',
				valueField : 'id',
				emptyText : '选择……',
				triggerAction : 'all',
				mode : 'local',
				editable : false,
				selectOnFocus : true,
				store : new Ext.data.SimpleStore({
							autoLoad : true,
							fields : ['id', 'text'],
							data : [[0, '逐条匹配'], [1, '最近值'], [2, '最早值'],
									[3, '平均值'], [4, '最大值'], [5, '最小值']],
							value : 0
						})
			})
	this.callType.setValue(0);
	this.score = new Ext.form.NumberField({
				fieldLabel : '增减可用度',
				labelSeparator : '：',
				name : 'score',
				msgTarget : 'title',
				allowBlank : false,
				blankText : '增减可用度不能为空',
				minValue : -100,
				maxValue : 100,
				value : -1,
				style : 'margin-bottom:2px',
				anchor : '95%'
			});

	this.submitForm = new Ext.FormPanel({
				labelWidth : 85,
				anchor : '95%',
				border : false,
				autoScroll : true,
				autoHeight : true,
				style : 'padding:10,0,0,10;',
				defaultType : 'textfield',
				buttonAlign : 'right',
				buttons : [{
							text : '保存',
							handler : this.onSaveTypeFn,
							scope : this
						}, {
							text : '返回',
							handler : this.onCenFn,
							scope : this
						}],
				items : [this.valeFrom, this.valeTo, this.unitWeight,
						this.unitType, this.valueType, this.callType,
						this.score]
			})
	health.rpt.kpiVerifyPanel.superclass.constructor.call(this, {
				// id : 'grid' + this.config,
				// margins : '5',
				width : 400,
				collapsible : true,
				collapsed : true,
				collapseMode : 'mini',
				split : true,
				region : 'east',
				layout : 'card',
				deferredRender : true,
				disabled : true,
				activeItem : 0,
				items : [this.kpiVerifyGrid, this.submitForm]
			});
}

Ext.extend(health.rpt.kpiVerifyPanel, Ext.Panel, {
	onDeleteFn : function() {
		if (this.kpiVerifyGrid.getStore().getCount() < 2) {
			alert('配置数据只有一条不能删除');
			return false;
		}
		var sm = this.kpiVerifyGrid.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('请选择一条记录修改!');
			return false;
		}
		var rd = records[0];
		if (rd.data.REPORT_CONFIG_ID == -1) {
			alert('默认配置暂时不能删除');
			return false;
		}
		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
		sendRequest.open("post",
				'../../servlet/healthRptAction?action=49&hkpiVerifyId='
						+ rd.data.HKPI_VERIFY_ID, false);
		sendRequest.send(null);
		if (sendRequest.readyState == 4 && sendRequest.status == 200) {
			var responseRoot = Ext.util.JSON.decode(sendRequest.responseText);
			if (responseRoot.success == true) {
				alert('指标阀值删除 成功!');
				this.kpiVerifyGrid.getStore().load(this.kpiVerifyGrid
						.getStore().lastOptions);
			} else {
				alert('指标阀值删除失败!');
			}
		}
	},
	onSaveTypeFn : function() {
		if (!this.submitForm.form.isValid()) {
			return false;
		}
		params = {
			kpi_id : this.config.kpiID,
			defaultReport_Config_id : this.config.defaultReport_Config_id,
			unitType : this.unitType.getValue(),
			callType : this.callType.getValue(),
			verify_Ord : this.dstore.getCount() + 1,
			saveType : this.config.saveType
		};

		if (this.config.saveType == 'edit') {
			params.hkpiVerifyId = this.config.hkpiVerifyId;
			params.report_configId = this.config.report_configId;
			if (this.config.report_configId == -1) {
				params.saveType = 'add';
			}
		}
		this.lastSubmit(params);
	},
	lastSubmit : function(params) {
		this.submitForm.form.submit({
					// clientValidation:true,
					waitMsg : '提交数据请稍后……',
					waitTitle : '提示',
					url : '../../servlet/healthRptAction?action=48',
					method : 'post',
					params : params,
					success : function(form, action) {
						if (action.result.success == true) {

							alert('数据提交成功');
							this.getLayout().setActiveItem(0);
							this.kpiVerifyGrid
									.getStore()
									.load(this.kpiVerifyGrid.getStore().lastOptions);
						} else {
							alert('数据交互失败');
						}
					},
					scope : this

				});
	},
	onAddFn : function() {
		this.submitForm.form.reset();
		this.config.saveType = "add";
		this.getLayout().setActiveItem(1);
	},
	onCenFn : function() {
		this.getLayout().setActiveItem(0);
	},
	onEditFn : function() {

		var sm = this.kpiVerifyGrid.getSelectionModel();
		var records = sm.getSelections();
		if (records.length < 1) {
			alert('请选择一条记录修改!');
			return false;
		}
		this.config.saveType = "edit";
		var rd = records[0].data
		this.config.hkpiVerifyId = rd.HKPI_VERIFY_ID;
		this.config.report_configId = rd.REPORT_CONFIG_ID;
		this.getLayout().setActiveItem(1);
		this.valeFrom.setValue(rd.VALUE_FROM);
		this.valeTo.setValue(rd.VALUE_TO);
		this.unitWeight.setValue(rd.UNIT_WEIGHT);
		this.unitType.setValue(rd.UNIT_TYPE);
		this.valueType.setValue(rd.VALUE_TYPE);
		this.callType.setValue(rd.CALC_TYPE);
		this.score.setValue(rd.SCORE);
	}

});
Ext.EventObject