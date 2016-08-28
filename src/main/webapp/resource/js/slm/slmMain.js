Ext.BLANK_IMAGE_URL = '../../resource/js/ext/resources/images/default/s.gif';
Ext.onReady(initLoad)

function initLoad() {
	management = new managementPanel();
	dashboard = new dashboardPanel();
	var tabs = new Ext.TabPanel({
				activeTab : 0,
				deferredRender : false,
				region : 'center',
				plain : true,
				listeners : {
					tabchange : {
						fn : function(tab, card) {
							card.activeFn();
						}
					}
				},
				items : [dashboard, management]
			});
	new Ext.Viewport({
				layout : 'border',
				items : [{
							region : 'north',
							baseCls : 'x-plain',
							height : 20
						}, tabs]
			});
}

managementPanel = function(config) {
	this.slmtree = this.createManage();
	this.rootGrid = this.createRootGrid();
	this.serviceTab = this.createServicePanel();
	managementPanel.superclass.constructor.call(this, {
				title : '管理模块',
				layout : 'border',
				frame : false,
				baseCls : 'x-plan',
				border : false,
				items : [this.slmtree, {
							layout : 'card',
							region : 'center',
							margins : '28 5 5 0',
							baseCls : 'x-plan',
							// frame : true,
							activeItem : 0,
							items : [this.rootGrid, this.serviceTab]
						}]
			});
}

Ext.extend(managementPanel, Ext.Panel, {
	activeFn : function() {
		this.slmtree.expandAll();
	},
	createManage : function() {
		var vtree = new Ext.tree.TreePanel({
			animate : true,
			enableDD : false,
			width : 200,
			border : false,
			frame : true,
			useArrows : true,
			autoScroll:true,
			maxWidth:500,
			minWidth:180,
			split:true,
			margins : '1 1 5 1',
			title : '目录->服务',
			region : 'west',
			isload : 0,
			rootVisible : false,
			root : new Ext.tree.AsyncTreeNode({
						leaf : false,
						text : '根目录',
						draggable : false,
						ptype : 'CATALOG',
						sid : '-1'
					}),
			listeners : {
				beforeload : {
					fn : function(node, e) {
						if (!node.isLeaf()) {
							vtree.loader.dataUrl = '/servlet/slmAction.do?method=getNodeList&node='
									+ node.attributes.sid;

						}
					}
				},
				expandnode : {
					fn : function() {
						if (vtree.isload == 0) {
							var node = (vtree.getRootNode().childNodes[0])
							node.select();
							this.rootGrid.search({
										CATALOG_ID : node.attributes.sid
									});
						}
						vtree.isload = +1;;
					},
					scope : this
				},
				click : {
					fn : function(node) {
						node.select();
						var p = this.items.get(1);
						var sid=node.attributes.sid;
						if (node.attributes.ptype == 'CATALOG') {
							this.rootGrid.search({
										CATALOG_ID : sid
									});
							p.getLayout().setActiveItem(0);
						} else {
							p.getLayout().setActiveItem(1);
							var sitems = this.serviceTab.items;
							sitems.get(0).search({
										SERVICE_ID : sid
									});
							sitems.get(1).search({
										SERVICE_ID : sid
									});
							this.serviceTab.setActiveTab(sitems.get(0));
						}

					},
					scope : this
				},
				contextmenu : {
					fn : this.contextmenu,
					scope : this
				}
			}
		});
		return vtree;
	},
	// 右键菜单
	contextmenu : function(node, e) {
		node.expand(false, true);
		node.select();
		node.fireEvent("click", node, e);
		var mary = []
		if (node.attributes.ptype == 'CATALOG') {
			mary.push({
						text : '添加服务',
						iconCls : "addChild",
						handler : createService

					})
			mary.push({
						text : '添加目录',
						iconCls : "addChild",
						handler : createCatalog
					})
		}
		mary.push({
					text : '编辑',
					iconCls : "edit",
					handler : nodeEdit
				})
		if (node.attributes.sid != '0') {
			mary.push({
						text : '删除当前元素',
						iconCls : "delete",
						handler : delNode
					})
		}

		var treeMenu = new Ext.menu.Menu({
					items : mary
				});
		treeMenu.showAt(e.getXY());
		function nodeEdit() {
			var sm = management.slmtree.getSelectionModel();
			var node = sm.getSelectedNode();
			var ptype = node.attributes.ptype;
			if (ptype == 'SERVICE') {
				url = '/servlet/commonservlet?tag=201&paramValue='
						+ getAESEncode(encodeURIComponent('SELECT SS.SERVICE_ID, SS.SERVICE_NAME,SS.SERVICE_TIME_DESC,SS.SERVICE_DESC,SS.SERVICE_CLIENT FROM SLM_SERVICE SS where  SS.SERVICE_ID='
						+ node.attributes.sid));
				var resultRequest = new ActiveXObject("Microsoft.XMLHTTP");
				resultRequest.open("post", url, false);
				resultRequest.send(null);
				if (resultRequest.readyState == 4&& resultRequest.status == 200) {
					var oRows = resultRequest.responseXML.selectNodes("/root/rowSet");
					createService({
						opetype : 'edit',
						name : oRows[0].selectSingleNode("SERVICE_NAME").text,
						date : oRows[0].selectSingleNode("SERVICE_TIME_DESC").text,
						desc : oRows[0].selectSingleNode("SERVICE_DESC").text,
						object : oRows[0].selectSingleNode("SERVICE_CLIENT").text
					})
				}
			} else {
				createCatalog({
							opetype : 'edit',
							name : node.attributes.text
						});
			}
		}
		function delNode() {
			var ptype = node.attributes.ptype;
			if (ptype == 'SERVICE') {
				delService();
			} else {
				Ext.Msg.show({
					title : '提示',
					msg : '是否确定删除?',
					buttons : Ext.Msg.YESNO,
					fn : function(bid, text) {
						if ('yes' == bid) {
							if (node.childNodes.length > 0) {
								Ext.Msg.alert('信息', '有子节点,不能删除!');
								return false;
							}
							url = '/servlet/slmAction.do?method=delNode&node='
									+ node.attributes.sid + '&ptype='
									+ node.attributes.ptype;
							var addRequest = new ActiveXObject("Microsoft.XMLHTTP");
							addRequest.open("post", url, false);
							addRequest.send(null);
							if (addRequest.readyState == 4
									&& addRequest.status == 200) {
								var responseAdd = Ext.util.JSON
										.decode(addRequest.responseText);
								if (responseAdd.success == true) {
									node.ui.remove();
								}
							}
						}
					},
					icon : Ext.MessageBox.QUESTION
				})

			}
		}
		function createCatalog(config) {
			var sm = management.slmtree.getSelectionModel();
			var node = sm.getSelectedNode();
			var optype = config.opetype || 'add';
			var nameFiled = new Ext.form.TextField({
						fieldLabel : '目录名称',
						// style:'margin-top:10px;',
						anchor : '98%',
						value : optype == 'edit' ? config.name : '',
						allowBlank : false
					})
			var vForm = new Ext.form.FormPanel({
						items : [{
									height : 10,
									html : '&nbsp;',
									border : false
								}, nameFiled],
						border : false

					});

			var win = new Ext.Window({
				width : 400,
				height : 120,
				title : '服务目录',
				modal : true,
				layout : 'fit',
				items : [vForm],
				buttonAlign : 'right',
				buttons : [{
					text : '保存',
					handler : function() {
						var nValue = nameFiled.getValue();
						if ((vForm.getForm()).isValid()) {
							url = '/servlet/slmAction.do?method=addChild&ptype=CATALOG&node='
									+ node.attributes.sid
									+ '&text='
									+ encodeURIComponent(nValue)
									+ '&opetype='
									+ optype;
							var addRequest = new ActiveXObject("Microsoft.XMLHTTP");
							addRequest.open("post", url, false);
							addRequest.send(null);
							if (addRequest.readyState == 4
									&& addRequest.status == 200) {
								var responseAdd = Ext.util.JSON
										.decode(addRequest.responseText);
								if (responseAdd.success == true) {
									win.close();
									if (optype == 'edit') {
										node.setText(nValue)
									} else {
										node.reload();
				(function				() {
											node.eachChild(function(child) {
														if (!child.isLeaf()) {
															child.expand(true);
														}
													});
										}).defer(100)
									}
								}
							}
						}
					}
				}, {
					text : '取消',
					handler : function() {
						win.close()
					}
				}]
			})
			win.show()
		}
	},
	createRootGrid : function() {
		return new Ext.data.ResultGrid({
					title : '服务列表',
					// bodyStyle:'border-width:0px;',
					// style:'border-width:0px;',
					// frame:true,
					border : true,
					result : 8380280
				});

	},
	createServicePanel : function() {
		var slaGrid = new Ext.data.ResultGrid({
					title : '服务水平协议',
					border : false,
					result : 8380281
				});
		var kpiGrid = new Ext.data.ResultGrid({
					title : '服务指标',
					border : false,
					listeners : {
						'rowclick' : {
						  fn : function() {
							var rd = getSelRecord(kpiGrid);
							if (rd) {
							   var tb= kpiGrid.getTopToolbar()
							   var its=tb.items;
							   var enBtn=its.itemAt(4);
							   var disBtn=its.itemAt(3);
							   if(rd.data.STATUS==2){
							     enBtn.setDisabled(true);
							     disBtn.setDisabled(false)
							   }else{
							     enBtn.setDisabled(false);
							     disBtn.setDisabled(true)
							    }
							   
							}
						}
					  }
					},
					result : 8380282
				});
		return new Ext.TabPanel({
					deferredRender : false,
					activeTab : 0,
					minTabWidth : 80,
					tabWidth : 80,
					items : [slaGrid,kpiGrid]
				})

	}
});

function createService(config, rootgrid, gridId) {
	var sm = management.slmtree.getSelectionModel();
	var node = sm.getSelectedNode();
	var optype = config.opetype || 'add';
	var nameFiled = new Ext.form.TextField({
				fieldLabel : '&nbsp;&nbsp;服务名称',
				anchor : '98%',
				allowBlank : false
			})
	var dateFiled = new Ext.form.TextField({
				fieldLabel : '&nbsp;&nbsp;时间描述',
				anchor : '98%',
				allowBlank : false
			})
	var descFiled = new Ext.form.TextArea({
				fieldLabel : '&nbsp;&nbsp;服务描述',
				height : 70,
				anchor : '98%',
				allowBlank : false
			})
	var objectFiled = new Ext.form.TextField({
				fieldLabel : '&nbsp;&nbsp;服务对象',
				// height:80,
				anchor : '98%',
				allowBlank : false
			})
	var vForm = new Ext.form.FormPanel({
				items : [{
							height : 10,
							html : '&nbsp;',
							border : false
						}, nameFiled, dateFiled, descFiled, objectFiled],
				border : false

			})
	var sid = gridId || node.attributes.sid
	var win = new Ext.Window({
		width : 500,
		height : 280,
		title : '服务',
		modal : true,
		layout : 'fit',
		items : [vForm],
		buttonAlign : 'right',
		buttons : [{
			text : '保存',
			handler : function() {
				if ((vForm.getForm()).isValid()) {
					var nValue = nameFiled.getValue()
					url = '/servlet/slmAction.do?method=addChild&ptype=SERVICE&node='
							+ sid
							+ '&text='
							+ encodeURIComponent(nValue)
							+ "&date="
							+ encodeURIComponent(dateFiled.getValue())
							+ "&desc="
							+ encodeURIComponent(descFiled.getValue())
							+ "&object="
							+ encodeURIComponent(objectFiled.getValue())
							+ '&opetype=' + optype;
					var addRequest = new ActiveXObject("Microsoft.XMLHTTP");
					addRequest.open("post", url, false);
					addRequest.send(null);
					if (addRequest.readyState == 4 && addRequest.status == 200) {
						var responseAdd = Ext.util.JSON
								.decode(addRequest.responseText);
						if (responseAdd.success == true) {
							win.close();
							if (optype == 'edit' && !rootgrid) {
								node.setText(nValue)
							} else {
								node.reload();
		(function				() {
									node.eachChild(function(child) {
												if (!child.isLeaf()) {
													child.expand(true);
												}
											});
								}).defer(100)
							}
							(management.rootGrid.getStore()).reload();

						}
					}
				}
			}
		}, {
			text : '取消',
			handler : function() {
				win.close()
			}
		}]
	})
	win.show();
	if (optype == 'edit') {
		nameFiled.setValue(config.name);
		dateFiled.setValue(config.date)
		descFiled.setValue(config.desc);
		objectFiled.setValue(config.object)
	}
}
function addService(grid) {
	createService({
				opetype : 'add'
			}, grid);
}
function editService(grid) {
	var rd = getSelRecord(grid);
	if (rd) {
		url = '/servlet/commonservlet?tag=201&paramValue='
				+ getAESEncode(encodeURIComponent('SELECT SS.SERVICE_ID, SS.SERVICE_NAME,SS.SERVICE_TIME_DESC,SS.SERVICE_DESC,SS.SERVICE_CLIENT FROM SLM_SERVICE SS where  SS.SERVICE_ID='
				+ rd.data['SERVICE_ID']));
		var resultRequest = new ActiveXObject("Microsoft.XMLHTTP");
		resultRequest.open("post", url, false);
		resultRequest.send(null);
		if (resultRequest.readyState == 4 && resultRequest.status == 200) {
			var oRows = resultRequest.responseXML.selectNodes("/root/rowSet");
			createService({
						opetype : 'edit',
						name : oRows[0].selectSingleNode("SERVICE_NAME").text,
						date : oRows[0].selectSingleNode("SERVICE_TIME_DESC").text,
						desc : oRows[0].selectSingleNode("SERVICE_DESC").text,
						object : oRows[0].selectSingleNode("SERVICE_CLIENT").text
					}, grid, rd.data['SERVICE_ID'])
		}
	}
}
function delService(grid) {
	var sm = management.slmtree.getSelectionModel();
	var node = sm.getSelectedNode();
	var sId = node.attributes.sid;
	if (grid) {
		var rd = getSelRecord(grid);
		if (rd) {
			sId = rd.data['SERVICE_ID'];
		} else {
			return false;
		}
	}
	var url = '/servlet/commonservlet?tag=201&paramValue='
			+ getAESEncode(encodeURIComponent('select (select count(*) from SLM_SLA  where 1=1 and STATUS!=0 and SERVICE_ID='
			+ sId
			+ ' ) SLA,(select count(*) from SLM_SERVICE_KPI where 1=1 and STATUS =2 and SERVICE_ID='
			+ sId + ') KPI from DUAL'));
	var resultRequest = new ActiveXObject("Microsoft.XMLHTTP");
	resultRequest.open("post", url, false);
	resultRequest.send(null);
	if (resultRequest.readyState == 4 && resultRequest.status == 200) {
		var oRows = resultRequest.responseXML.selectNodes("/root/rowSet");
		var csla = oRows[0].selectSingleNode("SLA").text;
		var ckpi = oRows[0].selectSingleNode("KPI").text;
		if (Number(csla) > 0 || Number(ckpi) > 0) {
			Ext.Msg.alert('', '该服务存在【服务水平】与【服务指标】,不能删除!')
			return false;
		} else {
			Ext.Msg.show({
				title : '提示',
				msg : '是否确定删除?',
				buttons : Ext.Msg.YESNO,
				fn : function(bid, text) {
					if ('yes' == bid) {
						var purl = '/servlet/slmAction.do?method=delNode&node='
								+ sId + '&ptype=SERVICE';
						var addRequest = new ActiveXObject("Microsoft.XMLHTTP");
						addRequest.open("post", purl, false);
						addRequest.send(null);
						if (addRequest.readyState == 4
								&& addRequest.status == 200) {
							var responseAdd = Ext.util.JSON
									.decode(addRequest.responseText);
							if (responseAdd.success == true) {
								if (grid) {
									node.reload();
								} else {
									node.ui.remove();
								}
								(management.rootGrid.getStore()).reload();
							}
						}
					}
				},
				icon : Ext.MessageBox.QUESTION
			})

		}
	}
}
function addSla(grid, config, purview) {

	var slaId = config['SLA_ID'] || "add";
	var sm = management.slmtree.getSelectionModel();
	var node = sm.getSelectedNode();
	var serviceId = node.attributes.sid;
	var slaTitle = new Ext.form.TextField({
				fieldLabel : '名称',
				// style:'margin-left:5px;',
				anchor : '98%',
				allowBlank : false
			})
	/*
	 * var slaType= new Ext.form.ComboBox({ //msgTarget : 'side', anchor:'98%',
	 * fieldLabel:'类型', store : new Ext.data.SimpleStore({ fields : ['value',
	 * 'text'], data : [['SLA', '服务等级协议'], ['OLA', '运营等级协议'], ['UC', '支撑合同']]
	 * }), valueField : "value", displayField : "text", mode : "local",
	 * triggerAction : "all", allowBlank : false, editable : false });
	 */
	var desc = new Ext.form.TextField({
				fieldLabel : '描述',
				// style:'margin-left:5px;',
				anchor : '99%'
			})
	var status = new Ext.form.ComboBox({
				// msgTarget : 'side',
				anchor : '98%',
				fieldLabel : "状态",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [[0, '禁用'], [1, '过期'], [2, '启用']]
						}),
				valueField : "value",
				value : 2,
				displayField : "text",
				mode : "local",
				triggerAction : "all",
				allowBlank : false,
				editable : false
			});
	/*
	 * var expireDate=new Ext.form.DateField({ fieldLabel:'过期日期',
	 * editable:false, format:'Y-m-d', allowBlank:false, anchor:'98%' })
	 */
	var expireDate = new Ext.ux.form.DateTime({
				anchor : '98%',
				fieldLabel : '过期日期',
				timeFormat : 'H:i:s',
				format : 'Y-m-d H:i:s',
				timeConfig : {
					altFormats : 'H:i:s',
					// value:'00:00:00',
					allowBlank : false
				},
				dateFormat : 'Y-m-d',
				dateConfig : {
					altFormats : 'Y-m-d|Y-n-d',
					// value:dc,
					allowBlank : false
				}
			})
	/*
	 * var reviewPeriod=new Ext.form.TextField({ fieldLabel:'审计周期',
	 * //style:'margin-left:5px;', anchor:'98%', allowBlank:false })
	 */
	var reviewPeriod = new Ext.form.ComboBox({
				// msgTarget : 'side',
				anchor : '98%',
				fieldLabel : '审计周期',
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [[0, '每天'], [1, '每周'], [2, '每月'], [3, '每季度']]
						}),
				valueField : "value",
				displayField : "text",
				mode : "local",
				value : 0,
				triggerAction : "all",
				allowBlank : false,
				editable : false
			});
	var target = new Ext.form.NumberField({
				fieldLabel : '合规目标',
				maxValue : 100,
				minValue : 0.1,
				allowBlank : false,
				maxLength : 5,
				emptyText : '该字段为数字格式',
				// style:'margin-left:5px;',
				anchor : '98%'
			})
	var riskTarget = new Ext.form.NumberField({
				fieldLabel : '危险的目标值',
				emptyText : '该字段为数字格式',
				maxLength : 5,
				maxValue : 100,
				minValue : 0.1,
				// style:'margin-left:5px;',
				anchor : '98%'
			})
	var refkpiGrid = new Ext.data.ResultGrid({
				title : '服务水平和指标关联表',
				region : 'center',
				result : 8380284
			})
	var tabpanel = new Ext.TabPanel({
				columnWidth : 1,
				deferredRender : false,
				activeTab : 0,
				height : 320,
				minTabWidth : 80,
				tabWidth : 80,
				activeTab : 0,
				padding : 1,
				plain : true,
				items : [{
							baseCls : "x-plan",
							border : false,
							title : '关联指标',
							layout : 'border',
							items : [{
										baseCls : "x-plan",
										region : 'north',
										border : false,
										layout : 'form',
										items : [target, riskTarget],
										height : 50
									}, refkpiGrid]
						}]
			})
	var vForm = new Ext.form.FormPanel({
				layout : 'column',
				padding : '10 5 5 10',
				// frame:true,
				baseCls : "x-plan",
				border : false,
				items : [{
							baseCls : "x-plan",
							border : false,
							columnWidth : .45,
							layout : 'form',
							items : [slaTitle, expireDate]
						}, {
							baseCls : "x-plan",
							border : false,
							columnWidth : .1,
							html : '&nbsp;'
						}, {
							baseCls : "x-plan",
							border : false,
							columnWidth : .45,
							layout : 'form',
							items : [status, reviewPeriod]
						}, {
							layout : 'form',
							border : false,
							columnWidth : 1,
							items : [desc]
						}, tabpanel]

			})

	var win = new Ext.Window({
		width : 780,
		height : 500,
		title : '服务水平信息',
		modal : true,
		// layout:'fit',
		items : [vForm],
		buttonAlign : 'right',
		buttons : [{
			text : '保存',
			hidden : (purview == 'view' ? true : false),
			handler : function() {
				if (vForm.getForm().isValid()) {
					if (riskTarget.getValue() != '') {
						if (riskTarget.getValue() <= target.getValue()) {
							Ext.Msg.alert('警告', '危险的目标值要大于合规目标!');
							return false;
						}
					}

					var st = refkpiGrid.getStore();
					var refStr = "";
					for (var i = 0; i < st.getCount(); i++) {
						var rd = st.getAt(i);
						refStr += rd.data["KPI_ID"] + "=" + rd.data["WEIGHT"]
						if (i != st.getCount() - 1) {
							refStr += ",";
						}
					}
					var ddf=(expireDate.df.getValue()).format('Y-m-d');
					var dtf=expireDate.tf.getValue();
					Ext.Ajax.request({
								waitMsg : '数据提交中...',
								waitTitle : '信息',
								url : '/servlet/slmAction.do?method=editSla',
								params : {
									slaId : slaId,
									title : slaTitle.getValue(),
									type : 'SLA',// slaType.getValue(),
									serviceId : serviceId,
									desc : desc.getValue(),
									status : status.getValue(),
									expireDate : (ddf+" "+dtf),//expireDate.getValue(),
									reviewPeriod : reviewPeriod.getValue(),
									target : target.getValue(),
									riskTarget : riskTarget.getValue() || 0,
									refstr : refStr

								},
								callback : function(options, success, response) {
									var responseArray = Ext.util.JSON
											.decode(response.responseText);
									if (responseArray.success == true) {
										grid.search({
													SERVICE_ID : node.attributes.sid
												});
										win.close();
									} else {
										Ext.Msg.alert('保存失败', '数据库交互繁忙');
									}
								},
								scope : this
							});
				}
			}
		}, {
			text : '取消',
			handler : function() {
				win.close()
			}
		}]

	})
	win.show()
	if (config['TITLE']) {
		slaTitle.setValue(config['TITLE']);
		// slaType.setValue(config['SLA_TYPE']);
		desc.setValue(config['SLA_DESC']);
		status.setValue(config['STATUS']);
		expireDate.setValue(config['EXPIRE_DATE']);
		reviewPeriod.setValue(config['REVIEW_PERIOD']);
		if (config['TARGET'] > 0) {
			target.setValue(config['TARGET']);
		}
		if (config['RISK_TARGET'] > 0) {
			riskTarget.setValue(config['RISK_TARGET']);
		}
		refkpiGrid.search({
					SLA_ID : slaId
				})
	} else {
		var dc = new Date();
		var ld = (dc.getYear()) + 10
		dc.setYear(ld);
		expireDate.setValue(dc)
	}

}
function editSla(grid, purview) {
	var gm = grid.getSelectionModel();
	var sels = gm.getSelections();
	if (sels.length != 0) {
		var rd = sels[0];
		url = "/servlet/commonservlet?tag=201&paramValue=" + getAESEncode(encodeURIComponent("SELECT SS.SLA_ID,SS.SERVICE_ID,SS.TITLE,SS.SLA_TYPE,SS.SLA_DESC,SS.TARGET,SS.RISK_TARGET,SS.REVIEW_PERIOD,SS.STATUS,to_char(SS.EXPIRE_DATE,'yyyy-mm-dd hh24:mi:ss') EXPIRE_DATE,SS.CREATE_USER,SS.CREATE_DATE,SS.MODIFY_USER FROM SLM_SLA SS  where SS.SLA_ID="
				+ rd.data['SLA_ID']));
		var resultRequest = new ActiveXObject("Microsoft.XMLHTTP");
		resultRequest.open("post", url, false);
		resultRequest.send(null);
		if (resultRequest.readyState == 4 && resultRequest.status == 200) {
			var oRows = resultRequest.responseXML.selectNodes("/root/rowSet");
			var it = oRows[0];
			addSla(grid, {
						opetype : 'edit',
						SLA_ID : it.selectSingleNode("SLA_ID").text,
						SERVICE_ID : it.selectSingleNode("SERVICE_ID").text,
						TITLE : it.selectSingleNode("TITLE").text,
						SLA_TYPE : it.selectSingleNode("SLA_TYPE").text,
						SLA_DESC : it.selectSingleNode("SLA_DESC").text,
						TARGET : it.selectSingleNode("TARGET").text,
						RISK_TARGET : it.selectSingleNode("RISK_TARGET").text,
						REVIEW_PERIOD : it.selectSingleNode("REVIEW_PERIOD").text,
						STATUS : it.selectSingleNode("STATUS").text,
						EXPIRE_DATE : it.selectSingleNode("EXPIRE_DATE").text,
						CREATE_USER : it.selectSingleNode("CREATE_USER").text,
						CREATE_DATE : it.selectSingleNode("CREATE_DATE").text,
						MODIFY_USER : it.selectSingleNode("MODIFY_USER").text
					}, purview)
		}
	} else {
		Ext.Msg.alert('Info', ' 对不起,请选中一条记录进行修改!')
	}

}
function getSelRecord(grid) {
	var gm = grid.getSelectionModel();
	var sels = gm.getSelections();
	if (sels.length != 0) {
		var rd = sels[0];
		return rd;

	} else {
		Ext.Msg.alert('信息', ' 对不起,请选中一条记录进行操作!');
		return false;
	}
}
function delSla(grid) {
	var serviceId = (grid.getStore()).lastOptions.params['SERVICE_ID'];
	var rd = getSelRecord(grid);
	if (rd) {
		Ext.Msg.show({
					title : '提示',
					msg : '是否确定删除?',
					buttons : Ext.Msg.YESNO,
					fn : function(bid, text) {
						if ('yes' == bid) {
							url = "/servlet/slmAction.do?method=delSla&slaId="
									+ rd.data['SLA_ID'];
							var resultRequest = new ActiveXObject("Microsoft.XMLHTTP");
							resultRequest.open("post", url, false);
							resultRequest.send(null);
							if (resultRequest.readyState == 4
									&& resultRequest.status == 200) {
								var bkMsg = Ext.util.JSON
										.decode(resultRequest.responseText);
								if (bkMsg.success == true) {
									grid.search({
												SERVICE_ID : serviceId
											});
								} else {
									Ext.Msg.alert('信息', ' 对不起,数据库交互繁忙,请稍后再试!');
								}
							}
						}
					},
					icon : Ext.MessageBox.QUESTION
				})
	}
}
function addServicekpi(grid, config, purview) {
	var kpiId = config['KPI_ID'] || "add";
	var sm = management.slmtree.getSelectionModel();
	var node = sm.getSelectedNode();
	var serviceId = node.attributes.sid;
	var title = new Ext.form.TextField({
				fieldLabel : '指标名称',
				allowBlank : false,
				anchor : '98%'
			})
	/*
	 * var slaType= new Ext.form.ComboBox({ //msgTarget : 'side', anchor:'98%',
	 * fieldLabel:'SLA 类型', store : new Ext.data.SimpleStore({ fields :
	 * ['value', 'text'], data : [['SLA', '服务等级协议'], ['OLA', '运营等级协议'], ['UC',
	 * '支撑合同']] }), valueField : "value", displayField : "text", mode : "local",
	 * triggerAction : "all", allowBlank : false, editable : false }); */
	 
	/*var status = new Ext.form.ComboBox({
				anchor : '98%',
				fieldLabel : "状态",
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [[0, '禁用'], [1, '过期'], [2, '启用']]
						}),
				valueField : "value",
				displayField : "text",
				mode : "local",
				value : 2,
				triggerAction : "all",
				allowBlank : false,
				editable : false
			});*/
	var effectDate = new Ext.ux.form.DateTime({
				anchor : '98%',
				fieldLabel : '生效日期',
				timeFormat : 'H:i:s',
				format : 'Y-m-d H:i:s',
				timeConfig : {
					altFormats : 'H:i:s',
					allowBlank : false
				},
				dateFormat : 'Y-m-d',
				dateConfig : {
					altFormats : 'Y-m-d|Y-n-d',
					allowBlank : false
				}
			})
	var desc = new Ext.form.TextArea({
				fieldLabel : '描述',
				height : 60,
				anchor : '98%'
			})

	var hours = new Ext.form.NumberField({
				fieldLabel : '小时',
				emptyText : '该字段为数字格式',
				maxLength : 17,
				anchor : '96%'
			})
	var minutes = new Ext.form.NumberField({
				fieldLabel : '分钟',
				emptyText : '该字段为数字格式',
				maxLength : 5,
				anchor : '96%'
			})
	var formFlow = new Ext.form.RadioGroup({
				anchor : '96%',
				fieldLabel : "取自流程",
				columns : 2,
				baseCls : "x-plan",
				listeners : {
					"change" : {
						fn : function(rg, box) {
							var lfgag = false;
							if (box.inputValue == 1) {
								hours.reset();
								minutes.reset();
								lfgag = true;
							}
							hours.setDisabled(lfgag);
							minutes.setDisabled(lfgag);
						}

					}
				},
				items : [{
							boxLabel : '是',
							name : 'rb-flow',
							inputValue : 1
						}, {
							boxLabel : '否',
							name : 'rb-flow',
							inputValue : 0,
							checked : true
						}]
			})
	var goalSet = new Ext.form.FieldSet({
				title : '服务指标目标',
				anchor : '98%',
				items : [hours, minutes, formFlow]
			})
	var flowMod = new Ext.form.TextField({
				fieldLabel : '关联流程',
				readOnly : true,
				allowBlank : false,
				modId : 0,
				anchor : '100%'
			})
	var dsql="select obj_id,obj_show_name,kpi_value,target_value,status,eval_time from someTable"
	var dsql2="select flow_id,  min(CREATED_DATE) as start_time,min(finish_date) as end_time,min(sla_date) as sla_date,min(sla_time) as sla_time from v_tache where tch_mod = 1  group by flow_id"
	var defineSql = new Ext.form.TextArea({
		height : 70,
		allowBlank : false,
		// emptyText:'select flow_id, min(CREATED_DATE) as
		// start_time,min(finish_date) as end_time,min(sla_date) as
		// sla_date,min(sla_time) as sla_time from v_tache where tch_mod =
		// :TCH_MOD group by flow_id',
		value :dsql2,
		fieldLabel : '定义SQL ',
		anchor : '100%'
	})

	var fn = function(sels) {
		var data = (sels[0]).data;
		flowMod.modId = data['FLOW_MOD'];
		flowMod.setValue(data['FLOW_NAME']);
	}
	var defineSet = new Ext.form.FieldSet({
		title : '基于请求的指标定义',
		anchor : '98%',
		items : [{layout:'column',id:'flow_desc',border:false,items:[{
			baseCls : "x-plan",
			border : false,
			layout : 'form',
			columnWidth : .96,
			items : [flowMod ]
		}, {
			baseCls : "x-plan",
			border : false,
			columnWidth : .04,
			items : [new Ext.Button({
						iconCls : 'attrib',
						handler : function() {
							selectGrid(fn, 8380283, 600, 550, '选择关联流程模板', true);
						}
					})]
		}]},{
				html : '<div  style="color:red;width:100%;padding-left:80px;" id="sql_explain">&nbsp;&nbsp;sql中必须包含flow_id，start_time，end_time三个字段，如果配置为“取自流程”，必须包含sla_date或者sla_time，并且flow_id在sql结果集中必须唯一，以下示例sql，详细说明请见配置文档.</div>',
				height :65,
				border : false
			},defineSql]
	})
	
	 var kpiType = new Ext.form.ComboBox(
			{
				anchor : '98%',
				fieldLabel : '指标类型',
				store : new Ext.data.SimpleStore({
							fields : ['value', 'text'],
							data : [['req', '基于服务请求'],['comp', '基于外部合规评价']]
						}),
			    listeners:{
			    	   select:{
			    	   	  fn:function(sv){
			    	   	  	var fhp=Ext.getCmp('flow_desc')
			    	   	     if(sv.getValue()=='comp'){
			    	   	     	goalSet.hide()
			    	   	     	fhp.hide();
			    	   	     	flowMod.setValue(1)
			    	   	     	win.setHeight(420)
			    	   	     	win.doLayout();
			    	   	     	defineSql.setValue(dsql)
			    	   	     	document.getElementById("sql_explain").innerHTML="&nbsp;&nbsp;sql中必须包含obj_id，obj_show_name，status,eval_times四个字段，并且obj_id在sql结果集中必须唯一，以下示例sql，详细说明请见配置文档.";
			    	   	     }else{
			    	   	     	 goalSet.show()
			    	   	     	 flowMod.reset();
			    	   	     	 fhp.show();
			    	   	     	 defineSql.setValue(dsql2)
			    	   	     	 win.setHeight(580)
			    	   	     	 win.doLayout();
			    	   	     	 document.getElementById("sql_explain").innerHTML="&nbsp;&nbsp;sql中必须包含flow_id，start_time，end_time三个字段，如果配置为“取自流程”，必须包含sla_date或者sla_time，并且flow_id在sql结果集中必须唯一，以下示例sql，详细说明请见配置文档.";
			    	   	      }
			    	   	  },
			    	   	  scope:this
			    	   
			    	   }
			    	 
			    },
				valueField : "value",
				displayField : "text",
				mode : "local",
				triggerAction : "all",
				allowBlank : false,
				editable : false
			});
	var vForm = new Ext.form.FormPanel({
				padding : '10 5 5 10',
				// frame:true,
				labelPad : 1,
				labelWidth : 80,
				baseCls : "x-plan",
				border : false,
				items : [title, kpiType,effectDate, desc, goalSet, defineSet]
			})
	var win = new Ext.Window({
		width : 480,
		height : 580,
		title : '服务指标',
		modal : true,
		layout : 'fit',
		items : [vForm],
		buttonAlign : 'right',
		buttons : [{
			text : '保存',
			hidden : (purview == 'view' ? true : false),
			handler : function() {
				if (vForm.getForm().isValid()) {
					var fflowValue = (formFlow.getValue()).inputValue;
					if (fflowValue == 0) {
						if (kpiType.getValue()!='comp'&&hours.getValue() == 0 && minutes.getValue() == 0) {
							Ext.Msg.alert('错误', '当取自流程为否时，小时或者分钟需要大于0!');
							return false;
						}
					}
					var sqlValue=defineSql.getValue();
					if(sqlValue==dsql||sqlValue==dsql2){
					  Ext.Msg.alert('信息', '需要改动下默认SQL才能提交!');
					  return false;
					}
					var ddf=(effectDate.df.getValue()).format('Y-m-d');
					var dtf=effectDate.tf.getValue();
					//return false;
					Ext.Ajax.request({
								waitMsg : '数据提交中...',
								waitTitle : '信息',
								url : '/servlet/slmAction.do?method=editServiceKpi',
								params : {
									kpiid : kpiId,
									serviceId : serviceId,
									title : title.getValue(),
									slatype : 'SLA',// slaType.getValue(),
									kpitype :kpiType.getValue(),
									status : 2,//status.getValue(),
									desc : desc.getValue(),
									effectdate : (ddf+" "+dtf),//effectDate.getValue(),
									hours : hours.getValue() || 0,
									minutes : minutes.getValue() || 0,
									formflow : fflowValue,
									flowmod : flowMod.modId,
									definesql : defineSql.getValue()
								},
								callback : function(options, success, response) {
									var responseArray = Ext.util.JSON
											.decode(response.responseText);
									if (responseArray.success == true) {
										grid.search({
													SERVICE_ID : node.attributes.sid
												});
										win.close();
									} else {
										Ext.Msg.alert('保存失败', '数据库交互繁忙');
									}
								},
								scope : this
							});
				}
			}
		}, {
			text : '取消',
			handler : function() {
				win.close()
			}
		}]

	})
	win.show();
	if (config["KPI_TITLE"]) {
		title.setValue(config["KPI_TITLE"]);
		// slaType.setValue(config["SLA_TYPE"]);
		kpiType.setValue(config["KPI_TYPE"])
		//status.setValue(config["STATUS"])
		desc.setValue(config["KPI_DESC"])
		effectDate.setValue(config["EFFECT_DATE"]);
		if(config["KPI_TYPE"]=='comp'){
			var fhp=Ext.getCmp('flow_desc');
		    goalSet.hide()
   	     	fhp.hide();
   	     	flowMod.setValue(1)
   	     	win.setHeight(420)
   	     	win.doLayout()
   	     	document.getElementById("sql_explain").innerHTML="sql中必须包含obj_id，obj_show_name，status,eval_times四个字段，并且obj_id在sql结果集中必须唯一，以下示例sql，详细说明请见配置文档.";
			
		}else{
			   if (config["HOURS"] != 0) {
				hours.setValue(config["HOURS"])
			}
			if (config["MINUTES"] != 0) {
				minutes.setValue(config["MINUTES"])
			}
			flowMod.setValue(config["FLOW_MOD_NAME"]);
			formFlow.setValue(config["IS_FROM_FLOW"]);
		}
		defineSql.setValue(config["DEFINE_SQL"])

		if (config["IS_FROM_FLOW"] == 1) {
			hours.setDisabled(true);
			minutes.setDisabled(true);
		}
		flowMod.modId = config["FLOW_MOD"];
		kpiType.setDisabled(true)
		
	} else {
		 var dc = new Date();
		 var ld=(dc.getYear())-10
		 dc.setYear(ld);
		 effectDate.setValue(dc);
	}

}
function editServicekpi(grid, purview) {
	var rd = getSelRecord(grid);
	if (rd) {
		url = "/servlet/commonservlet?tag=201&paramValue=" + getAESEncode(encodeURIComponent("SELECT SSK.KPI_ID,SSK.KPI_TITLE,SSK.SLA_TYPE,SSK.KPI_DESC,SSK.KPI_TYPE,SSK.STATUS, to_char(SSK.EFFECT_DATE,'yyyy-mm-dd hh24:mi:ss') EFFECT_DATE,SSKG.HOURS,SSKG.MINUTES,SSKG.IS_FROM_FLOW, (select  fm.flow_name from flow_model  fm where fm.flow_mod=SSRKD.FLOW_MOD) FLOW_MOD_NAME,SSRKD.FLOW_MOD,SSRKD.DEFINE_SQL FROM SLM_SERVICE_KPI SSK left join   SLM_SEVICE_KPI_GOAL     SSKG on SSK.KPI_ID = SSKG.KPI_ID left join SLM_SERV_REQ_KPI_DEFINE SSRKD  on SSK.KPI_ID = SSRKD.KPI_ID  WHERE SSK.KPI_ID ="
				+ rd.data['KPI_ID']));
		var resultRequest = new ActiveXObject("Microsoft.XMLHTTP");
		resultRequest.open("post", url, false);
		resultRequest.send(null);
		if (resultRequest.readyState == 4 && resultRequest.status == 200) {
			var oRows = resultRequest.responseXML.selectNodes("/root/rowSet");
			var it = oRows[0];
			addServicekpi(grid, {
						KPI_ID : it.selectSingleNode("KPI_ID").text,
						KPI_TITLE : it.selectSingleNode("KPI_TITLE").text,
						SLA_TYPE : it.selectSingleNode("SLA_TYPE").text,
						KPI_DESC : it.selectSingleNode("KPI_DESC").text,
						KPI_TYPE : it.selectSingleNode("KPI_TYPE").text,
						STATUS : it.selectSingleNode("STATUS").text,
						EFFECT_DATE : it.selectSingleNode("EFFECT_DATE").text,
						HOURS : it.selectSingleNode("HOURS").text,
						MINUTES : it.selectSingleNode("MINUTES").text,
						IS_FROM_FLOW : it.selectSingleNode("IS_FROM_FLOW").text,
						FLOW_MOD : it.selectSingleNode("FLOW_MOD").text,
						FLOW_MOD_NAME : it.selectSingleNode("FLOW_MOD_NAME").text,
						DEFINE_SQL : it.selectSingleNode("DEFINE_SQL").text
					}, purview)
		}
	}
}
function delServicekpi(grid,optype) {
	var serviceId = (grid.getStore()).lastOptions.params['SERVICE_ID'];
	var rd = getSelRecord(grid);
	if (rd) {
		var vmsg='是否确定删除?'
        if(optype=='disable'){
          vmsg='是否确定禁用!'
        }else if(optype=='enable'){
          vmsg='是否确定启用!'
        }
		Ext.Msg.show({
					title : '提示',
					msg : vmsg,
					buttons : Ext.Msg.YESNO,
					fn : function(bid, text) {
						if ('yes' == bid) {
							url = "/servlet/slmAction.do?method=delSerkpi&optype="+optype+"&kpiId="
									+ rd.data['KPI_ID'];
							var resultRequest = new ActiveXObject("Microsoft.XMLHTTP");
							resultRequest.open("post", url, false);
							resultRequest.send(null);
							if (resultRequest.readyState == 4
									&& resultRequest.status == 200) {
								var bkMsg = Ext.util.JSON
										.decode(resultRequest.responseText);
								if (bkMsg.success == true) {
									grid.search({
												SERVICE_ID : serviceId
											});
								} else {
									Ext.Msg.alert('信息', ' 对不起,数据库交互繁忙,请稍后再试!');
								}
							}
						}
					},
					icon : Ext.MessageBox.QUESTION
				})

	}
}
function disableServicekpi(grid){
  delServicekpi(grid,'disable')
}
function enableServicekpi(grid){
  delServicekpi(grid,'enable')
}
function addSlaRefKpiFn(grid) {
	var st = grid.getStore();
	var fn = function(sels) {
		for (var v = 0; v < sels.length; v++) {
			var data = (sels[v]).data;
			var defaultData = {
				KPI_ID : data['KPI_ID'],
				KPI_TITLE : data['KPI_TITLE'],
				WEIGHT : 1,
				type : 'new'
			};
			var p = new st.recordType(defaultData, st.getCount());
			st.insert(st.getCount(), p);
			st.commitChanges()
		}
		var view = grid.getView();
		view.refresh();
	}
	var kpiStr = "0";
	for (var c = 0; c < st.getCount(); c++) {
		var rd = st.getAt(c);
		kpiStr += "," + rd.get("KPI_ID")
	}
	selectGrid(fn, 8380285, 800, 510, '选择关联指标', false, {
				KPI_ID : kpiStr ? kpiStr : null
			})

}
function editSlaRefKpiFn(grid) {
	var rd = getSelRecord(grid);
	if (rd) {
		var wieght = new Ext.form.NumberField({
					value : rd.data['WEIGHT']
				})

		var win = new Ext.Window({
					width : 300,
					height : 100,
					title : '修改权重',
					modal : true,
					layout : 'fit',
					items : [wieght],
					buttonAlign : 'center',
					buttons : [{
								text : '保存',
								handler : function() {
									if (wieght.getValue() !== '') {
										if (wieght.getValue() > 0) {
											rd.set('WEIGHT', wieght.getValue());
											rd.commit();
											win.close();
										} else {
											Ext.Msg.alert('提示', '权重需要大于0')
										}
									}
								}
							}, {
								text : '取消',
								handler : function() {
									win.close();
								}
							}]
				})
		win.show();
	} else {

	}
}
function delSlaRefKpiFn(grid) {
	var rd = getSelRecord(grid);
	if (rd) {
		var st = grid.getStore();
		st.remove(rd)
	}
}
function selectGrid(fn, result, wh, hg, title, single, param) {
	var grid = new Ext.data.ResultGrid({
				result : result,
				resultParam : param,
				isAddParamTbar : true,
				// isAddParamTbar : true,
				// isDisplayRowNum : false,
				border : false,
				sm : new Ext.grid.CheckboxSelectionModel({
							singleSelect : single
						}),
				iconCls : 'icon-grid'
			});
	var win = new Ext.Window({
				width : wh || 780,
				height : hg || 400,
				title : title || '选择',
				layout : 'fit',
				modal : true,
				items : [grid],
				buttonAlign : 'right',
				buttons : [{
							text : '确定',
							handler : function(btn) {
								var gm = grid.getSelectionModel();
								var sels = gm.getSelections();
								if (sels.length != 0) {
									// var rd=sels[0];
									win.close();
									fn.call(window, sels);
								} else {
									Ext.Msg.alert('错误', '请选择一项,谢谢!')
								}
							}
						}, {
							text : '取消',
							handler : function() {
								win.close()
							}
						}]

			})
	win.show();
	grid.search();

}
/* 显示模块 */
dashboardPanel = function(config) {
	this.rootTree = this.createRootTree();
	this.slaLastct = this.createSlaLast();
	this.slaHistory = this.createSlaHistory();
	this.slmkpi = this.createSlmKpi();
	dashboardPanel.superclass.constructor.call(this, {
				title : '控制台',
				layout : 'border',
				frame : false,
				baseCls : 'x-plan',
				hideMode : 'offsets',
				border : false,
				items : [this.rootTree, {
							xtype : 'tabpanel',
							margins : '28 5 5 2',
							region : 'center',
							deferredRender : false,
							frame : true,
							activeTab : 0,
							items : [this.slaLastct, this.slaHistory,
									this.slmkpi]
						}]
			});
}

Ext.extend(dashboardPanel, Ext.Panel, {
	activeFn : function() {
		// var node=(this.rootTree.getRootNode().childNodes[0])
		// node.select();
		this.rootTree.expandAll(); // 展开tree 所有节点
		if (this.rootTree.isload != 0) {// 不是初次打开时要刷新数据
			var sm = this.rootTree.getSelectionModel();
			var node = sm.getSelectedNode();
			var param = {};
			if (node) {
				param = {
					CATALOG_ID : node.attributes.sid
				}
				if (node.attributes.ptype == 'SERVICE') {
					param = {
						CATALOG_ID : -2,
						SERVICE_ID : node.attributes.sid
					}
				}
			} else {
				param = {
					CATALOG_ID : 0
				}
			}
			this.loadData(param);
		}
	},
	loadData : function(param) {
		this.slaLastct.search(param);
		this.slaHistory.search(param);
		this.slmkpi.search(param);
	},
	createRootTree : function() {
		var vtree = new Ext.tree.TreePanel({
			animate : true,
			enableDD : false,
			width : 200,
			border : false,
			style : 'border-width:0px;',
			frame : true,
			useArrows : true,
			autoScroll:true,
			maxWidth:500,
			minWidth:180,
			split:true,
			// title : '域配置',
			margins : '1 0 5 1',
			region : 'west',
			isload : 0,
			rootVisible : false,
			root : new Ext.tree.AsyncTreeNode({
						leaf : false,
						text : '根目录111',
						draggable : false,
						expand : true,
						ptype : 'CATALOG',
						sid : '-1'
					}),
			listeners : {
				beforeload : {
					fn : function(node, e) {
						if (!node.isLeaf()) {
							vtree.loader.dataUrl = '/servlet/slmAction.do?method=getNodeList&node='
									+ node.attributes.sid;

						}
					}
				},
				expandnode : {
					fn : function() {
						if (vtree.isload == 0) {
							var node = (vtree.getRootNode().childNodes[0])
							node.select();
							var param = {
								CATALOG_ID : node.attributes.sid
							}
							this.slaLastct.search(param);
							this.slaHistory.search(param);
							this.slmkpi.search(param);
						}
						vtree.isload = +1;;
					},
					scope : this
				},
				click : {
					fn : function(node) {
						node.select();
						var param = {
							CATALOG_ID : node.attributes.sid
						}
						if (node.attributes.ptype == 'SERVICE') {
							param = {
								CATALOG_ID : -2,
								SERVICE_ID : node.attributes.sid
							}
						}
						this.slaLastct.search(param);
						this.slaHistory.search(param);
						this.slmkpi.search(param);
					},
					scope : this
				},
				contextmenu : {
					fn : function(e) {
						e.stopEvent();
					}
				}
			}
		});
		return vtree;
	},
	createSlaLast : function() {
		var chartPanel = new ResultChart({
					result : 8380287,
					autoWidth : true,
					// region : "center",
					series : [{
								style : {
									colors : ["#fef619", "#2ad44a","#fe4819"]
								}
							}],
					border : false
				})
       var st = chartPanel.store
		st.on("load", function(sto) { // 查询之前隐藏图形面板
					var fields =sto.fields.items;
					var ct='COUNTS'
						for (var i = 0, field; field = fields[i]; i++)
					{
						if(ct==field.label){
							ct=field.name
						}
					}
					var c0=(sto.getAt(0)).get(ct);
					var c1=(sto.getAt(1)).get(ct);
					var c2=(sto.getAt(2)).get(ct);
					if(c0==0&&c1==0&&c2==0){
					 chartPanel.hide()
					}else{
					 chartPanel.show()
					 }
				})
		var sgrid = new Ext.data.ResultGrid({
					border : false,
					result : 8380293
				});
		var deails = new Ext.Panel({
					region : 'south',
					split : true,
					collapseMode : 'mini',
					// collapsed:true,
					border : false,
					height : 300,
					layout : 'border',
					items : [{
								border : false,
								margins : '0 2 0 0',
								region : 'west',
								width : 600,
								layout : 'fit',
								bodyStyle:'background:#ffffff;',
								items : [chartPanel]
							}, {
								border : false,
								margins : '0 2 0 2',
								region : 'center',
								items : [sgrid],
								layout : 'fit'
							}]
				})
		var ngrid = new Ext.data.ResultGrid({
			result : 8380286,
			isAddParamTbar : true,
			listeners : {
				'rowclick' : {
					fn : function() {
						var rd = getSelRecord(ngrid);
						if (rd) {
							sgrid.search({
										SLA_ID : rd.data["SLA_ID"]
									})
						}
					}
				},
				'afterrender' : {
					fn : function(p) {
						var bbar = p.getBottomToolbar()
						bbar.insert(11, {
									xtype : 'tbseparator'
								})
						bbar.insert(12, {
									xtype : 'button',
									text : '查看服务水平',
									iconCls : 'audit_info',
									handler : function() {
										editSla(ngrid, 'view')
									}
								})

						bbar.insert(13, {
									xtype : 'tbseparator'
								})
						bbar.insert(14, {
							xtype : 'button',
							text : '统计报表',
							iconCls : 'audit_report',
							handler : function() {
								var rd = getSelRecord(ngrid);
								if (rd) {
									var rp = rd.data['REVIEW_PERIOD'];
									var title = rd.data['TITLE'];
									if (rp == '0' || rp == '1') {
										title="本月【"+title+"】统计报表"
									} else {
									   title="本年【"+title+"】统计报表"
									}
									
									var tab=dashboard.items.get(1);
									var c=tab.add({
										title:title,
										autoScroll:false,
										height:800,
										autoWidth:true,
										closable:true,
										html : '<iframe width="100%"  height="100%" src="slmReport.html?SLAID='+rd.data["SLA_ID"]+'" style="width: 100%; height: 100%; border: 0px solid black"  frameborder="0"></iframe>'
									})
									tab.setActiveTab(c)
									
								/*window
											.open(
													"slmReport.html?title="+title+"&SLAID="
															+ rd.data["SLA_ID"],
													null,
													'fullscreen=yes,Status=yes,scrollbars=yes,resizable=no')*/
								}
							}
						})
					}
				}
			},
			border : false,
			region : 'center'
		});
		return new Ext.Container({
					title : '服务水平',
					layout : 'border',
					hideMode : 'offsets',
					items : [ngrid, deails],
					search : function(param) {
						(ngrid.getStore()).baseParams = param;
						ngrid.search();
						chartPanel.search(param);
					}

				})

	},
	createSlaHistory : function() {
		var bglDate = new Ext.form.DateField({
					format : 'Y-m-d',
					width : 150
				})
		var edlDate = new Ext.form.DateField({
					format : 'Y-m-d',
					width : 150
				})
		var chartLeftPanel = new ResultChart({
					result : 8380289
				})
		var chartRigthPanel = new ResultChart({
					result : 8380290
				})
		var deails = new Ext.Panel({
			region : 'south',
			split : true,
			deferHeight : false,
			collapseEl : "",
			// collapseMode : 'mini',
			// collapsed:true,
			height : 350,
			layout : 'border',
			border : false,
			// items:[chartRigthPanel]
			tbar : [
					'开始时间:',
					bglDate,
					'&nbsp;&nbsp;',
					'结束时间:',
					edlDate,
					'-',
					{
						text : '查询',
						iconCls : 'icon-search',
						handler : function() {
							if (bglDate.getValue() != ''
									&& edlDate.getValue() != ''
									&& bglDate.getValue() < edlDate.getValue()) {
								if (chartLeftPanel.sparam) {
									var sp = chartLeftPanel.sparam;
									sp["BEGINDATE"] = (bglDate.getValue())
											.format('Y-m-d')
									sp["ENDDATE"] = (edlDate.getValue())
											.format('Y-m-d')
									chartLeftPanel.search(sp);
									chartRigthPanel.search(sp)
								}
							} else {
								Ext.Msg.alert('信息', '截止时间要大于开始时间!')
							}

						}
					},
					'->',
					'<div id="histinfo1" style="color:red;font-weight:bold;"></div>',
					'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'],
			items : [{
						border : false,
						layout : 'fit',
						region : 'west',
						width : 600,
						split : true,
						margins : '4 2 4 4',
						items : [chartLeftPanel]
					}, {
						border : false,
						region : 'center',
						layout : 'fit',
						margins : '4 4 4 2',
						items : [chartRigthPanel]
					}]
				// items:[{
				// height:300,items:[chartLeftPanel],columnWidth:0.5,layout:'fit'},{
				// height:300,columnWidth:0.5,items:[chartRigthPanel],layout:'fit'}]
		});

		// chartRigthPanel.search({CATALOG_ID:0});
		var gd = new Ext.data.ResultGrid({
					region : 'center',
					border : false,
					listeners : {
						'rowclick' : {
							fn : function() {
								var rd = getSelRecord(gd);

								if (rd) {
									deails.show();
									deails.ownerCt.doLayout();
									var nd = new Date();

									var param = {
										DUNIT : "mm"
									}
									var rp = rd.data['REVIEW_PERIOD'];
									
									var dInfo = document
											.getElementById("histinfo1")
									if (rp == '每周' || rp == '每天') {
										param = {
											DUNIT : "dd"
										}
										param["BEGINDATE"] = (nd
												.getFirstDateOfMonth())
												.format('Y-m-d')
										param["ENDDATE"] = (nd
												.getLastDateOfMonth())
												.format('Y-m-d');
										dInfo.innerHTML = "[当前以'每天'为一单位,来分部线条的走势!]"
									} else {
										param = {
											DUNIT : "mm"
										}
										var bt = nd.getFullYear()
										param["BEGINDATE"] = bt + "-01-01";
										param["ENDDATE"] = bt + "-12-31"
										dInfo.innerHTML = "[当前以'每月'为一单位,来分部线条的走势!]"
									}
									param["SLA_ID"] = rd.get("SLA_ID");

									chartLeftPanel.search(param);
									chartLeftPanel.sparam = param; // 将查询参数保存起来

									chartRigthPanel.search(param)

									bglDate.setValue(param["BEGINDATE"]);
									edlDate.setValue(param["ENDDATE"])
									// deails.expand()

								}
							},
							scope : this
						},
						'afterrender' : {
							fn : function(p) {
								var bbar = p.getBottomToolbar()
								bbar.insert(11, {
											xtype : 'tbseparator'
										})
								bbar.insert(12, {
											xtype : 'button',
											text : 'SLA信息',
											iconCls : 'audit_info',
											handler : function() {
												editSla(gd, 'view')
											}
										})
							}
						}
					},
					isAddParamTbar : true,
					result : 8380288
				});

		var st = gd.getStore()
		st.on("beforeload", function(st) { // 查询之前隐藏图形面板
					deails.hide();
					deails.ownerCt.doLayout();
				})
		return new Ext.Container({
					title : '趋势分析',
					hideMode : 'offsets',
					layout : 'border',
					items : [gd, deails],
					search : function(param) {
						(gd.getStore()).baseParams = param;
						gd.search();
						deails.hide();
						deails.ownerCt.doLayout();
						// deails.collapse()
						// chartRigthPanel.search({CATALOG_ID:0});
						// chartLeftPanel.search({CATALOG_ID:0});
					}
				})

	},
	createSlmKpi : function() {

		var kgrid = new Ext.data.ResultGrid({
					region : 'west',
					isAddParamTbar : true,
					//split : true,
					margins : '0 2 4 4',
					border : false,
					width : 800,
					result : 8380291,
					listeners : {
						'afterrender' : {
							fn : function(p) {
								var bbar = p.getBottomToolbar()
								bbar.insert(11, {
											xtype : 'tbseparator'
										})
								bbar.insert(12, {
											xtype : 'button',
											text : '指标信息',
											iconCls : 'audit_info',
											handler : function() {
												editServicekpi(kgrid, 'view')
											}
										})
							}
						}
					}
				});
		var kChart = new ResultChart({
					result : 8380292,
					autoWidth : true,
					series : [{
								style : {
									colors : ["#fe4819", "#2ad44a"]
								}
							}],
					border : false
				})
		var st = kgrid.getStore()
		st.on("beforeload", function(st) {
					var bgDate = Ext.getCmp('kpibegindate').getValue();
					var edDate = Ext.getCmp('kpienddate').getValue();
					if (bgDate || edDate) {
						var param = {};
						if (bgDate) {
							param.BEGINDATE = bgDate.format('Y-m-d');
						}
						if (edDate) {
							param.ENDDATE = edDate.format('Y-m-d');
						}
						kChart.search(param)
					}else{
					  kChart.search(st.lastOptions.params)
					}
					
				})
		var stc = kChart.store
		stc.on("load", function(sto) { // 查询之前隐藏图形面板
					var fields =sto.fields.items;
					var ct='COUNTS'
						for (var i = 0, field; field = fields[i]; i++)
					{
						if(ct==field.label){
							ct=field.name
						}
					}
					var c0=(sto.getAt(0)).get(ct);
					var c1=(sto.getAt(1)).get(ct);
					if(c0==0&&c1==0){
					  kChart.hide()
					}else{
					  kChart.show()
					 }
					
				})
				
	//--------------------------------------------------------------------		
		var kgrid2 = new Ext.data.ResultGrid({
					region : 'west',
					isAddParamTbar : true,
					//split : true,
					margins : '0 2 4 4',
					border : false,
					width : 800,
					result : 888388551
				});
		var kChart2 = new ResultChart({
					result : 888388552,
					autoWidth : true,
					series : [{
								style : {
									colors : ["#fe4819", "#2ad44a"]
								}
							}],
					border : false
				})
		var st2 = kgrid2.getStore()
		st2.on("beforeload", function(st) {
					var bgDate = Ext.getCmp('kpibegindate2').getValue();
					var edDate = Ext.getCmp('kpienddate2').getValue();
					if (bgDate || edDate) {
						var param = {};
						if (bgDate) {
							param.BEGINDATE = bgDate.format('Y-m-d');
						}
						if (edDate) {
							param.ENDDATE = edDate.format('Y-m-d');
						}
						kChart2.search(param)
					}else{
					  kChart2.search(st.lastOptions.params)
					}
					
				})
		var stc2 = kChart2.store
		stc2.on("load", function(sto) { // 查询之前隐藏图形面板
					var fields =sto.fields.items;
					var ct='COUNTS'
						for (var i = 0, field; field = fields[i]; i++)
					{
						if(ct==field.label){
							ct=field.name
						}
					}
					var c0=(sto.getAt(0)).get(ct);
					var c1=(sto.getAt(1)).get(ct);
					if(c0==0&&c1==0){
					  kChart2.hide()
					}else{
					  kChart2.show()
					 }
					
				})
				
		return new Ext.Container({
					title : '指标详情',
					layout : 'border',
					hideMode : 'offsets',
					items : [{split:true,border:false,region:'north',height:350,minHeight:300,maxHeight:450,layout:'border',items:[kgrid,{bodyStyle:'background-color:#ffffff;',tbar:['实时工单指标状态'],border:false,region:'center',layout:'fit',items:[kChart]}]},
						     {border:false,region:'center',layout:'border',items:[kgrid2,{tbar:['实时外部评价指标状态'],bodyStyle:'background-color:#ffffff;',border:false,region:'center',layout:'fit',items:[kChart2]}]}],
					search : function(param) {
						(kgrid.getStore()).baseParams = param;
						kgrid.search();
						var st = kChart.store;
						st.baseParams = param;
						(kgrid2.getStore()).baseParams = param;
						 kgrid2.search();
						 (kChart2.store).baseParams = param;

					}
				})
	}
});

function kpiStatusTip(val){
	var cls = "enable"
	if (val == 1) {
		cls = "disable"
	}
	return "<span class='"+ cls+ "' style='width:20px;height:20px;'>&nbsp;&nbsp;&nbsp;&nbsp;</span>"
	
}
function slaStatusRenderFn(val) {
	var cls = "audit_unknown"
	if (val == 2) {
		cls = "audit_pass"
	} else if (val == 1) {
		cls = "audit_alert"
	} else if (val == '0') {
		cls = "audit_error"
	}
	return "<span class='"
			+ cls
			+ "' style='width:20px;height:20px;'>&nbsp;&nbsp;&nbsp;&nbsp;</span>"
}

function secondsRenderFn(val) {
	var val = Number(val)
	var h = "00", m = "00";
	var mdd = val % 86400;
	var d = (val - mdd) / 86400;
	var mdh = mdd % 3600;
	h = (mdd - mdh) / 3600;
	var mdm = mdh % 60;
	var m = (mdh - mdm) / 60;

	if (d < 10) {
		d = "0" + d;
	}

	if (h < 10) {
		h = "0" + h;
	}
	if (m < 10) {
		m = "0" + m
	}
	if (mdm < 10) {
		mdm = "0" + mdm
	}
	return d + "&nbsp;&nbsp;" + h + "&nbsp;:&nbsp;" + m + "&nbsp;:&nbsp;" + mdm
}
function kpiStatusRenderFn(val) {
	var cls = "audit_error"
	if (val == 2) {
		cls = "audit_pass"
	} else if (val == 1) {
		cls = "audit_alert"
	}

	return "<span class='"
			+ cls
			+ "' style='width:20px;height:20px;'>&nbsp;&nbsp;&nbsp;&nbsp;</span>"
}
function kpirtStatusRenderFn(val) {
	var cls = "audit_error"
	if (val == 1) {
		cls = "audit_pass"
	}

	return "<span class='"
			+ cls
			+ "' style='width:20px;height:20px;'>&nbsp;&nbsp;&nbsp;&nbsp;</span>"

}
function openFlow(grid) {

	var rd = getSelRecord(grid);
	if (rd) {
		 window.open('/workshop/form/index.jsp?fullscreen=yes&flowId=' + rd.data['FLOW_ID']);
		//window.open('/workshop/form/index.jsp?tchId=' + rd.data['FLOW_ID']+ '&fullscreen=yes');
				
	}
}