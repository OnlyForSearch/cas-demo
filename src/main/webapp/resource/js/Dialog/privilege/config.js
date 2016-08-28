var Global = {
	url					: null,
	ajax				: null,
	tree				: null,
	loadMask			: null,
	afterSave			: null,
	configXml			: null,
	privilegeConfig		: null,
	defaultPrivilege	: [],
	itfReg				: /^null|CHILD_TABLE_PRI_CFG$/i,
	hasChildCfg			: true,
	privilegeCount		: 0
};

var LabelPanel = Ext.extend(Ext.Panel, {
	initComponent	: function()
	{
		this.border = false;
		LabelPanel.superclass.initComponent.call(this);
	},
	afterRender		: function()
	{
		var self = this;
		this.html = [{
					tag		: "div",
					style	: {
						height		: 30,
						overflow	: "hidden"
					},
					cn		: [{
								tag		: "img",
								src		: "../../../image/ico/item1.gif",
								align	: "absmiddle"
							}, {
								tag		: "span",
								style	: Ext.apply({
											height			: "100%",
											"font-weight"	: "bold",
											padding			: "8 0 0 5"
										}, self.labelStyle),
								html	: self.label[0]
							}, {
								tag		: "span",
								style	: {
									height	: "100%",
									padding	: "8 0 0 3"
								},
								html	: ":"
							}, {
								tag		: "span",
								style	: {
									height	: "100%",
									width : "135",
									padding	: "8 0 0 10"
								}
							},{
								tag		: "img",
								src		: "../../../image/ico/item1.gif",
								align	: "absmiddle"
							}, {
								tag		: "span",
								style	: Ext.apply({
											height			: "100%",
											"font-weight"	: "bold",
											padding			: "8 0 0 5"
										}, self.labelStyle),
								html	: self.label[1]
							}, {
								tag		: "span",
								style	: {
									height	: "100%",
									padding	: "8 0 0 3"
								},
								html	: ":"
							}, {
								tag		: "span",
								style	: {
									height	: "100%",
									padding	: "8 0 0 10"
								}
							}]
				}, {
					tag		: "div",
					style	: {
						background	: "url(../../../image/dashed.gif) repeat-x",
						height		: 1,
						overflow	: "hidden"
					}
				}]
		LabelPanel.superclass.afterRender.call(this);
		this.text1 = this.body.dom.firstChild.children[3];
		this.text2 = this.body.dom.firstChild.lastChild;
	},
	setText			: function(s)
	{
		// this.text.innerText = s.replace(/\/$/, "");
		this.text2.innerText = s[1];
		this.text1.innerText = s[0];
	}
})

var ConfigLayout = Ext.extend(Ext.layout.ContainerLayout, {
	getLegend		: function(img, label)
	{
		return [{
					tag		: "img",
					src		: "../../../image/ico/" + img,
					align	: "absmiddle"
				}, {
					tag		: "span",
					style	: "padding-right:10",
					html	: ":" + label
				}]
	},
	getTableBody	: function()
	{
		var cn = []
		for (var i = 0; i < 2; i++)
		{
			var r = {
				tag	: "tr",
				cn	: []
			};
			for (var j = 0; j < 4; j++)
			{
				r.cn[j] = {
					tag		: "td",
					html	: (i == 0) ? "&nbsp;" : ""
				};
			}
			if (i == 0)
			{
				r.height = 30;
				r.cls = 'table-label'
			}
			cn[i] = r;
		}
		cn.push({
			tag	: "tr",
			cn	: {
				tag		: "td",
				height	: 10,
				colspan	: 4,
				align	: "button",
				cn		: {
					tag		: "div",
					style	: {
						background	: "url(../../../image/dashed.gif) repeat-x",
						height		: 1,
						overflow	: "hidden"
					}
				}
			}
		})

		cn.push({
					tag	: "tr",
					cn	: {
						tag		: "td",
						height	: 25,
						colspan	: 4,
						align	: "button",
						cn		: [].concat(this.getLegend("organ.gif", "部门"),
								this.getLegend("project.gif", "虚拟团队"), this
										.getLegend("staff.gif", "员工"), this
										.getLegend("station.gif", "任务"))
					}
				})
		return cn;
	},
	onLayout		: function(ct, target)
	{
		var self = this;
		this.table = target.createChild({
					tag			: 'table',
					cls			: 'x-table-layout',
					cellspacing	: 0,
					style		: "width:100%;height:100%",
					cn			: self.getTableBody()
				}, null, true);
		ConfigLayout.superclass.onLayout.call(this, ct, target);
		var items = ct.items.items;
		for (var i = 0, c; c = items[i]; i++)
		{
			c.setSize(c.container.getStyleSize());
		}
	},
	renderItem		: function(c, position, target)
	{
		var cell = this.table.rows[1].cells[position];
		if (c.cellCls)
		{
			cell.className = c.cellCls;
		}
		if (c.label)
		{
			var labelCell = this.table.rows[0].cells[position];
			labelCell.innerHTML = c.label;
		}
		c.render(cell);
		this.configureItem(c, position);
	}
})

var LoadData = {
	comps			: null,
	fns				: [],
	count			: 0,
	complete		: 0,
	add				: function(fn)
	{
		this.fns.push(fn);
		this.count++;
	},
	load			: function()
	{
		this.complete = 0;
		Ext.MessageBox.progress("", '数据载入...');
		for (var i = 0, fn; fn = this.fns[i]; i++)
		{
			fn.call(window, this.comps);
		}
	},
	loadComplete	: function()
	{
		this.complete++;
		if (this.complete == this.count)
		{
			Ext.MessageBox.updateProgress(1);
			Ext.MessageBox.hide();
		}
		else
		{
			Ext.MessageBox.updateProgress(this.complete / this.count);
		}
	}
}

function iniPage()
{
	Global.url = getUrlParam();
	Global.privilegeConfig = window.dialogArguments || {};
	Ext.onReady(initExt)
}

function initExt()
{
	initAjax(); 
	
	Global.ajax = new Ext.data.Connection({
				url			: "../../../../servlet/PermissionAction?",
				autoAbort	: false,
				extraParams	: Global.url,
				method		: 'POST',
				timeout		: null,
				listeners	: {
					requestexception	: function()
					{
						Ext.MessageBox.alert("错误", "发送请求错误!");
					},
					requestcomplete		: function(self, response, options)
					{
						var oXml = response.responseXML;
						var errNode = oXml.selectSingleNode("/root/error_code");
						if (errNode)
						{
							if (errNode.text == 0)
							{
								options.success.call(options.scope, oXml,
										options);
							}
							else
							{
								Ext.MessageBox.alert("错误",
										errNode.nextSibling.text);
							}
						}
						else
						{
							Ext.MessageBox.alert("错误", "xml文档格式错误!");
						}
						options.success = null;
					}
				}
			});

	var win = new Ext.Window({
				title		: "设置方式",
				width		: 420,
				height		: 260,
				resizable	: false,
				modal		: true,
				closeAction	: 'hide',
				padding		: "5 5 5 5",
				bodyStyle	: {
					background	: "white"
				},
				defaults	: {
					xtype		: 'fieldset',
					autoHeight	: true,
					layout		: 'anchor',
					defaultType	: 'radio'
				},
				items		: [{
							title	: "只将该权限更改应用于该节点,还是同时应用于所有的子节点",
							items	: [{
										checked		: true,
										name		: 'r1',
										inputValue	: 0,
										boxLabel	: '仅将更改应用于该节点'
									}, {									
										name		: 'r1',
										inputValue	: 1,
										boxLabel	: '将更改应用于该节点和所有子节点',
										listeners	: {
											check	: function(o, checked)
											{
												var comp = win.getComponent(1);
												if (checked)
												{
													comp.enable()
												}
												else
												{
													comp.disable();
												}
											}
										}
									}]
						}, {
							disabled        : true,
							maskDisabled	: false,
							title			: "子节点应用方式",
							items			: [{
										checked		: true,
										name		: 'r2',
										inputValue	: 1,
										boxLabel	: '继承此次修改的权限'
									}, {
										name		: 'r2',
										inputValue	: 2,
										boxLabel	: '继承全部权限'
									}]
						}],
				buttons		: [{
					text	: '确定',
					handler	: function()
					{
						var setChildType = win.getComponent(0).getComponent(0)
								.getGroupValue();
						if (setChildType == 1)
						{
							setChildType = win.getComponent(1).getComponent(0)
									.getGroupValue();
						}
						Assign.save(setChildType);
						win.hide();
					}
				}, {
					text	: '取消',
					handler	: function()
					{
						win.hide();
					}
				}]
			});

	var panel = new Ext.Panel({
		renderTo	: Ext.getBody(),
		width		: 650,
		border		: false,
		padding		: "5 10 5 10",
		items		: [new LabelPanel({
							label	: ["节点名称","创建者"]
						}), {
							html:'<div  style="font-weight:bold;padding:8 5 5 5;"><span style="float:left;">员工搜索:</span><span id="search"></span></div>' +
									'<div style="background:url(../../../image/dashed.gif) repeat-x;overflow:hidden;height:1"></div>',
							border	: false,
							margins: '5 0 0 5'							
						},
							{
					height	: 350,
					layout	: new ConfigLayout(),
					border	: false,
					items	: [{
								autoScroll	: true,
								cellCls		: "selection",
								label		: "待选信息"
							}, {
								border	: false,
								layout	: {
									type	: 'vbox',
									pack	: 'center',
									align	: 'center'
								},
								width	: 22,
								items	: [{
									xtype	: 'button',
									iconCls	: 'icon-next3',
									handler	: function()
									{
										addAssign(Global.tree.getSelectedItem());
									}
								}, {
									xtype	: 'button',
									margins	: '10 0 0 0',
									iconCls	: 'icon-prev3',
									handler	: function()
									{
										delAssign();
									}
								}]
							}, {
								currentAssign	: null,
								assignList		: new Ext.util.MixedCollection(),
								delAssignList	: new Ext.util.MixedCollection(),
								autoScroll		: true,
								cellCls			: "selection",
								label			: "已选信息"
							}, {
								cellCls			: "privilege-item",
								defaultType		: 'checkbox',
								maskDisabled	: false,
								disabled		: true,
								border			: false,
								autoScroll		: true,
								width			: 170
							}]
				}],
		tbar		: [{
					text	: '保存',
					iconCls	: 'icon-save',
					handler	: function()
					{
						Global.afterSave = closeWin;
						savePrivilegeConfig(win);
					}
				}, {
					text	: '应用',
					iconCls	: 'icon-apply',
					handler	: function()
					{
						Global.afterSave = refresh;
						savePrivilegeConfig(win);
					}
				}, {
					text	: '关闭',
					iconCls	: 'icon-exit',
					handler	: function()
					{
						window.close();
					}
				}]
	})
	Global.loadmask = new Ext.LoadMask(Ext.getBody(), {
				msg	: "请稍后..."
			})
	var comps = panel.items.items
	LoadData.comps = comps;
	Assign.build(comps);
	LoadData.add(loadLabel);
	LoadData.add(loadPrivilegeGroup);
	LoadData.add(loadTree);
	LoadData.load();
	
	new Choice.SearchStaff({
							width:250,						
							height : 25,
							renderTo:'search',
							margins :'5 0 5 5',
							listeners	: {
								'select' :  function(o){
									var item={
										tag:'STAFF',
										ico :'staff.gif',
										id:o.staff_id,
										innerText:o.staff_name
									}
									addAssign(item);
								}
							}		
	})
}

function loadPrivilegeGroup(comps)
{
	var panel = comps[2].items.items[3];
	Global.ajax.request({
		params	: {
			action	: 0
		},
		success	: function(oXml)
		{
			var privilegeNodeList = oXml.selectNodes('/root/rowSet');
			var list = [], po, pConfig;
			Global.privilegeCount = privilegeNodeList.length;
			for (var i = 0, privilegeNode; privilegeNode = privilegeNodeList(i); i++)
			{
				pConfig = Global.privilegeConfig[privilegeNode
						.selectSingleNode("PRIVILEGE_VALUE").text]
				po = {
					boxLabel	: privilegeNode
							.selectSingleNode("PRIVILEGE_NAME").text,
					disabled	: (privilegeNode.selectSingleNode("HAS_PRI").text != 1),
					index		: i,
					handler		: function(o, checked)
					{
						var oAssign = Assign.getCurrentAssign();
						oAssign.changePrivalue(o.index, (checked) ? 1 : 0);
					}
				}
				Ext.apply(po, pConfig);
				list[i] = po;
				Global.defaultPrivilege[i] = (privilegeNode
						.selectSingleNode("DEFAULT_VALUE").text == "0BT")
						? 1
						: 0;
			}
			panel.add(list);
			panel.doLayout();
			loadAssignList(comps);
		}
	})
}

function loadAssignList(comps)
{
	var panel = comps[2].items.items[2];
	Global.ajax.request({
		params	: {
			action	: 2
		},
		success	: function(oXml)
		{
			var list = oXml.selectNodes("/root/rowSet");
			for (var i = 0, node; node = list[i]; i++)
			{
				var config = {
					id				: node.selectSingleNode("ASSIGN_ID").text,
					tag				: node.selectSingleNode("ASSIGN_TYPE").text,
					innerText		: node.selectSingleNode("ASSIGN_NAME").text,
					ico				: node.selectSingleNode("ICO_NAME").text,
					privilegeValue	: node.selectSingleNode("PRIVILEGE_VALUE").text
				}
				o = Assign.newAssign(config);
				o.add((i == 0));
			}
			LoadData.loadComplete();
		}
	})
}

function loadLabel(comps)
{
	Global.ajax.request({
				params	: {
					action	: 5
				},
				success	: function(oXml)
				{
					var labelList = oXml.selectNodes('/root/item');
					var labelNode;
					for (var i = 0; i < 2; i++)
					{
						//labelNode = labelList[i];
						comps[0].setText([labelList[0].text,labelList[1].text]);
					}
					Global.hasChildCfg = !(Global.itfReg
							.test(labelList[2].text));
					LoadData.loadComplete();
				}
			})
}

var loadTree = function()
{
	var treeUrl = "../../../../servlet/staffmenu?";

	var LoadTreeAction = function()
	{
		this.parent = new XMLTree_onLoad_Action;
		this.parent.load = function()
		{
			LoadData.loadComplete();
		}
		return this.parent;
	}

	var DynamicLoadAction = function()
	{
		this.parent = new XMLTree_onDynamicLoad_Action;
		this.parent.dynamicLoad = function(oItem)
		{
			var xmlUrl;
			switch (oItem.tag)
			{
				case 'ORG' :
					xmlUrl = Org_DynamicLoad(oItem);
					break;
				case 'LINE' :
					xmlUrl = Line_DynamicLoad(oItem);
					break;
			}
			return xmlUrl;
		}

		function Org_DynamicLoad(oItem)
		{
			return treeUrl + "action=4&id=" + oItem.id;
		}

		function Line_DynamicLoad(oItem)
		{
			return treeUrl + "action=5&id=" + oItem.id;
		}

		return this.parent;
	}

	var DblClickAction = function()
	{
		this.parent = new XMLTree_onDblClick_Action;
		this.parent.dblclick = function(oItem)
		{
			addAssign(oItem);
		}
		return this.parent;
	}

	var DragStartAction = function()
	{
		this.parent = new XMLTree_onDragStart_Action;
		this.parent.isStartDrag = function(oItem)
		{
			return Assign.canAdd(oItem.tag);
		}
		return this.parent;
	}

	function DragEndAction()
	{
		this.parent = new XMLTree_onDragEnd_Action;
		this.parent.endDrag = function(oDragItem, oOverItem)
		{
			var endDragItem = document.elementFromPoint(this.iX, this.iY);
			if (Assign.prototype.renderTo.body.dom.contains(endDragItem))
			{
				addAssign(oDragItem);
			}
		}
		return this.parent;
	}

	return function(comps)
	{
		var panel = comps[2].items.items[0];
		Global.tree = new XMLTree();
		Global.tree.hasChildAttName = 'child_count'
		Global.tree.xmlUrl = treeUrl + "action=3";
		Global.tree.isDynamicLoad = true;
		Global.tree.isDragOnTree = true;
		Global.tree.isDragOnTreeBySelf = false;
		Global.tree.setLoadAction(new LoadTreeAction());
		Global.tree.setDynamicLoadAction(new DynamicLoadAction());
		Global.tree.setDblClickAction(new DblClickAction());
		Global.tree.setStartDragAction(new DragStartAction());
		Global.tree.setEndDragAction(new DragEndAction());
		Global.tree.showAt(panel.body.dom);
	}
}();

var Assign = function()
{
	var cls = function(config)
	{
		Ext.apply(this, config);
		this.isRender = false;
		this.isChange = false;
		this.privilege = [];
		this.buildPrivilege();
	}
	Ext.apply(cls, {
		canAdd					: function(tag)
		{
			return (tag != 'ORG_TOP' && tag != 'LINE_TOP' && tag != 'LINE');
		},
		build					: function(comps)
		{
			cls.prototype.renderTo = comps[2].items.items[2];
			cls.prototype.privilegeGroupPanel = comps[2].items.items[3];
			cls.prototype.privileges = cls.prototype.privilegeGroupPanel.items.items;
		},
		newAssign				: function(o)
		{
			var oAssign;
			if (o && cls.canAdd(o.tag))
			{
				var key = o.tag + "-" + o.id;
				oAssign = cls.prototype.renderTo.assignList.key(key);
				if (!oAssign)
				{
					oAssign = cls.prototype.renderTo.delAssignList.key(key);
					if (oAssign)
					{
						cls.prototype.renderTo.delAssignList.removeKey(key);
					}
					else
					{
						var newConfig = {
							key				: key,
							id				: o.id,
							tag				: o.tag,
							label			: o.innerText,
							ico				: o.ico,
							privilegeValue	: o.privilegeValue
						}
						oAssign = new cls(newConfig);
					}
				}
			}
			return oAssign;
		},
		getCurrentAssign		: function()
		{
			return cls.prototype.renderTo.currentAssign;
		},
		getPrivilegeValueIndex	: function(index)
		{
			return Global.privilegeCount - 1 - index;
		},
		getInitPri				: function(v)
		{
			var l = [];
			for (var i = 0; i < Global.privilegeCount; i++)
			{
				l[i] = v;
			}
			return l;
		},
		getConfigXml			: function()
		{
			var isChange = false;
			var p = cls.prototype.renderTo;
			var oAssign;
			var sendDom = new ActiveXObject("Microsoft.XMLDOM");
			sendRoot = sendDom.createElement("root");
			for (var i = 0; oAssign = p.delAssignList.itemAt(i); i++)
			{
				if (oAssign.isFromDB)
				{
					var delNode = sendDom.createElement("del");
					delNode.setAttribute("type", oAssign.tag);
					delNode.setAttribute("id", oAssign.id);
					sendRoot.appendChild(delNode);
					isChange = true;
				}
			}
			for (var i = 0; oAssign = p.assignList.itemAt(i); i++)
			{
				if (oAssign.isChange)
				{
					var buildNode = sendDom.createElement("build");
					buildNode.setAttribute("type", oAssign.tag);
					buildNode.setAttribute("id", oAssign.id);
					var addList = cls.getInitPri(0);
					var delList = cls.getInitPri(1);
					for (var j = 0, pri; pri = oAssign.privilege[j]; j++)
					{
						if (pri.isChange)
						{
							var pIndex = Assign.getPrivilegeValueIndex(j);
							if (pri.value == 1)
							{
								addList[pIndex] = pri.value;
							}
							else
							{
								delList[pIndex] = pri.value;
							}
						}
					}
					var addValue = addList.join("");
					var delValue = delList.join("");
					buildNode.setAttribute("add", addValue);
					if (addValue != delValue)
					{
						buildNode.setAttribute("del", delValue);
					}
					sendRoot.appendChild(buildNode);
					isChange = true;
				}
			}
			sendDom.appendChild(sendRoot);
			return (isChange) ? sendDom : isChange;
		},
		save					: function(setChildType)
		{
			Global.loadmask.show();
			Global.ajax.request({
						params	: {
							action		: 3,
							isSetChild	: setChildType
						},
						xmlData	: Global.configXml,
						success	: function(oXml)
						{
							Global.loadmask.hide();
							Ext.MessageBox.alert("信息", "权限设置成功",
									Global.afterSave);
						}
					})
		}
	})
	cls.prototype = {
		del					: function()
		{
			this.delItem();
		},
		delItem				: function()
		{
			this.el.style.display = 'none';
			this.isRender = false;
			this.renderTo.assignList.removeKey(this.key);
			this.renderTo.delAssignList.add(this.key, this);
			if (this.renderTo.assignList.length == 0)
			{
				this.renderTo.currentAssign = null;
				this.privilegeGroupPanel.disable();
			}
			else
			{
				this.renderTo.assignList.itemAt(0).onClick();
			}
		},
		add					: function(isClick, isChange)
		{
			if (!this.isRender)
			{
				this.addItem(isChange);
			}
			if (isClick && this != cls.getCurrentAssign())
			{
				this.el.scrollIntoView();
				this.onClick();
			}
		},
		loadPrivilege		: function()
		{
			for (var i = 0, priCheck; priCheck = this.privileges[i]; i++)
			{
				priCheck.checked = (this.privilege[i].value == 1)
				priCheck.el.dom.checked = priCheck.checked;
			}
		},
		change				: function()
		{
			if (!this.isChange)
			{
				this.labelEl.innerHTML = this.label + "*";
				this.isChange = true;
			}
		},
		init				: function()
		{
			this.isChange = false;
			this.labelEl.innerHTML = this.label;
			for (var i = 0; i < Global.privilegeCount; i++)
			{
				this.privilege[i].isChange = false;
			}
			this.isFromDB = true;
		},
		changePrivalue		: function(index, value)
		{
			Ext.apply(this.privilege[index], {
						value		: value,
						isChange	: true
					});
			this.change();
		},
		setDefaultPrivilege	: function()
		{
			for (var i = 0; i < Global.privilegeCount; i++)
			{
				this.privilege[i] = {
					value		: Global.defaultPrivilege[i],
					isChange	: true
				}
			}
		},
		setInitPrivilege	: function()
		{
			this.privilegeValue = parseInt(this.privilegeValue, 10).toString(2);
			for (var i = 0, len = Global.privilegeCount
					- this.privilegeValue.length; i < len; i++)
			{
				this.privilegeValue = '0' + this.privilegeValue;
			}
			for (var i = 0; i < Global.privilegeCount; i++)
			{
				this.privilege[i] = {
					value		: this.privilegeValue.charAt(Assign
							.getPrivilegeValueIndex(i)),
					isChange	: false
				}
			}
		},
		buildPrivilege		: function()
		{
			this.isFromDB = !(typeof this.privilegeValue == "undefined");
			if (this.isFromDB)
			{
				this.setInitPrivilege()
			}
			else
			{
				this.setDefaultPrivilege();
			}
		},
		addItem				: function(isChange)
		{
			if (this.el)
			{
				this.el.style.display = '';
			}
			else
			{
				var self = this;
				this.isChange = (isChange === true);
				this.el = this.renderTo.body.createChild({
							tag		: "div",
							style	: {
								height			: 20,
								width			: "100%",
								overflow		: "hidden",
								cursor			: "default",
								"white-space"	: "nowrap",
								"padding-left"	: 5
							},
							cn		: [{
										tag		: "img",
										src		: "../../../image/ico/"
												+ self.ico,
										align	: "absmiddle"
									}, {
										tag		: "nobr",
										style	: {
											height			: "100%",
											"margin-left"	: 2,
											padding			: "4 2 0 2"
										},
										html	: self.label
												+ ((this.isChange) ? "*" : "")
									}]
						}, false, true);
				this.el.attachEvent("onclick", cls.prototype.onClick
								.createDelegate(this));
				this.labelEl = this.el.lastChild;
			}
			this.renderTo.assignList.add(this.key, this);
			this.isRender = true;
		},
		onClick				: function()
		{
			if (this.privilegeGroupPanel.disabled)
			{
				this.privilegeGroupPanel.enable();
			}
			this.selected();
			this.loadPrivilege();
		},
		selected			: function()
		{
			if (this.renderTo.currentAssign)
			{
				this.renderTo.currentAssign.unselected();
			}
			this.el.runtimeStyle.backgroundColor = '#808080';
			this.el.runtimeStyle.color = 'white';
			this.renderTo.currentAssign = this;
		},
		unselected			: function()
		{
			this.el.runtimeStyle.backgroundColor = '';
			this.el.runtimeStyle.color = '';
		}
	};
	return cls;
}()

function addAssign(oItem)
{
	var o = Assign.newAssign(oItem);
	if (o)
	{
		o.add(true, true);
	}
}

function delAssign()
{
	var oAssign = Assign.getCurrentAssign();
	if (oAssign)
	{
		oAssign.del();
	}
}

function refresh()
{
	var p = Assign.prototype.renderTo;
	for (var i = 0; oAssign = p.assignList.itemAt(i); i++)
	{
		if (oAssign.isChange)
		{
			oAssign.init();
		}
	}
	p.delAssignList = new Ext.util.MixedCollection();
}

function closeWin()
{
	window.close();
}

function savePrivilegeConfig(win)
{
	Global.configXml = Assign.getConfigXml();
	if (Global.configXml !== false)
	{
		if (Global.hasChildCfg)
		{
			win.show();
		}
		else
		{
			Assign.save(0);
		}
	}
}