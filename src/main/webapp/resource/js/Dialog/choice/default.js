//定义默认语言资源
var defaultJSPDefaultLang = {
	emptyText : '查找...',
	SearchAllEmptyText:'输入区域、部门名称、常用小组、虚拟团队、员工登入名、姓名、邮箱、手机进行查询；组合查询中间用空格隔开，如：张三 北京',
	firstPage : '第一页',
	prewPage : '上一页',
	nextPage : '下一页',
	lastPage : '最后页',
	currentPagePrefix : '第',
	currentPageSuffix : '页/共',
	page : '页',
	pleaseWait : '---正在搜索请稍候---',
	noResult : '---没有搜索到结果---',
	commonProjectGroup : '常用项目组',
	customProjectGroup : '自定义项目组',
	withoutProfessional : '无专业',
	xmlError : 'xml文档格式错误!',
	requestSendError : '发送请求错误!',
	department : '部门',
	prepareStaffList : '待选员工',
	SelectedStaffList : '选中员工',
	staff : '人员',
	projectGroup : '项目组',
	projectGroupManagement : '项目组管理',
	setCommonlyUsedGroup : '设为常用组',
	editCommonlyUsedGroup : '编辑常用组',
	notSelectedProjectGroup : '还未选中项目组',
	setCommonSuccess : '设为常用组成功',
	removeCommonGroup : '删除常用组',
	removeCommonSuccess : '删除常用组成功',
	commonGroupConfiguration : '常用小组配置',
	commonGroup : '常用小组',
	groupName : '小组名称...',
	pleaseEnterGroupName : '请输入小组名称',
	addToGroup : '添加选择人员到小组',
	pleaseSelectStaff : '请在‘人员’卡项选择人员',
	addCustomGroupSuccess : '添加自定义小组成功',
	removeGroup : '删除小组',
	removeCustomGroupSuccess : '删除自定义组成功',
	loadingDataPleaseWait : '数据载入中,请稍后...',
	groupedOrganization : '按组织机构',
	groupedStaff : '按个人',
	confirmation : '确定',
	cancel : '取消',
	editGroupStaff:"编辑小组人员",
	onlyEditOneGroup:"每次只能编辑一个常用小组！"
};
//获取语言资源
function getDefaultJsLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('defaultJSPDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.defaultJSP.' + code);
	}
}

var Choice = {
	"xmlAttrToObj" : function(obj, node, trans)
	{
		var attName;
		trans = trans || {};
		for (var i = 0, att; att = node.attributes[i]; i++)
		{
			var attName = trans[att.name] || att.name
			obj[attName] = att.value
		}
		return obj;
	},
	"xmlNodeToObj" : function(obj, node)
	{
		var cn = node.childNodes;
		for (var i = 0, cNode; cNode = cn[i]; i++)
		{
			obj[cNode.tagName.toLowerCase()] = cNode.text;
		}
		return obj;
	}
};
Choice.ListView = Ext.extend(Ext.Component, {
			initComponent : function()
			{
				Choice.ListView.superclass.initComponent.call(this);
				this.addEvents("click");
				this.addEvents("dblclick");
				this.itemLength = 0;
				this.selected = [];
				this.lastIndex = -1;
				this.data = [];
				if (this.filter)
				{
					this.filter = new RegExp("^("
							+ this.filter.replace(/,/g, "|") + ")$")
				};
				this.tipTemplate = new Ext.Template("<div id='FL_EGN_STAFF_TITLE' style='z-index:1006;position:absolute;background:#636666;filter:alpha(opacity=80);width:200px;padding:9px 3px 9px 9px;border:1px solid #C8C8C8'><div>"				
				+"<span id='FL_EGN_STAFF_TITLE_NAME' style='font-weight:bold;font-family:\"Microsoft YaHei\";font-size:14px;color:#fdb000'>{staff_name}</span>"
				+ "<span id='FL_EGN_STAFF_TITLE_TEL' style='font-size:12px;font-family:\"Times New Roman\";font-weight:bold;color:#ffffff'>[{mobile}]</span></div>"
				+ "<div><span style='font-family:\"Microsoft YaHei\";font-size:12px;color:#ffffff;font-weight:bold'>区域&nbsp;:&nbsp;</span>"
				+ "<span id='FL_EGN_STAFF_TITLE_REGION' style='font-size:12px;font-family:\"Microsoft YaHei\";color:#ffffff;font-weight:bold'>{self_region_name}</span></div>"
				+ "<div><div style='font-family:\"Microsoft YaHei\";font-size:12px;color:#ffffff;font-weight:bold;float:left;padding-right:9px'>部门&nbsp;:</div>"
				+ "<div id='FL_EGN_STAFF_TITLE_FULL_ORG' style='word-break:break-all;font-size:12px;font-family:\"Microsoft YaHei\";color:#ffffff;font-weight:bold;float:left'>{org_name}</div>"
				+ "<div style='clear:both'></div> </div><div>"
				+ "<span style='font-family:\"Microsoft YaHei\";font-size:12px;color:#ffffff;font-weight:bold'>邮箱&nbsp;:&nbsp;</span>"
				+ "<span id='FL_EGN_STAFF_TITLE_MAIL' style='font-size:12px;font-family:\"Times New Roman\";color:#ffffff;font-weight:bold'>{email}</span></div></div>");

			},
			getData : function()
			{
				return this.data;
			},
			onRender : function(ct, position)
			{
				Choice.ListView.superclass.onRender.call(this, ct, position);
				// 将事件绑定在list上，通过激活事件具体对象去寻找class=choice-search-list-item的父对象
				this.el.unselectable();
				this.el.on({
							scope : this,
							click : this.itemClick,
							dblclick : this.itemDblClick
						});
				// this.el.addClass("choice-list-view");
				this.el.dom.style.width = '100%';
				if (this.items)
				{
					this.setItems(this.items);
					delete this.items;
				}
			},
			getSingleItemHtml : Ext.emptyFn,
			getItemHtml : function(itemConfig)
			{
				var key = itemConfig[this.key];
				if (this.filter && this.filter.test(key))
				{
					return ""
				}
				for (var i = 0, len = this.data.length; i < len; i++)
				{
					if (this.data[i][this.key] == key)
					{
						return "";
					}
				}
				this.data.push(itemConfig);
				return "<div class='choice-list-view-item'>"
						+ this.getSingleItemHtml(itemConfig) + "</div>";
			},
			addItem : function(config, isRefresh)
			{
				if (this.oneRecord === true)
				{
					this.setItems([config]);
				}
				else
				{
					var shtml = this.getItemHtml(config);
					if (shtml)
					{
						this.el.insertHtml('beforeEnd', shtml);
						if (isRefresh !== false)
						{
							this.refresh();
						}
					}
				}

			},
			addItems : function(configs)
			{
				for (var i = 0, config; config = configs[i]; i++)
				{
					this.addItem(config, false);
				}
				this.refresh();
			},
			setItems : function(configs)
			{
				this.data = [], shtml = "";
				for (var i = 0, config; config = configs[i]; i++)
				{
					shtml += this.getItemHtml(config);
				}
				this.el.update(shtml || "");
				this.refresh();
			},
			setTip : function(configs){
				for (var i = 0, config; config = configs[i]; i++)
				{				
					Ext.QuickTips.register({
					    target: config.staff_id+'_STAFF',
					    text : this.tipTemplate.apply(config)
					});
				}
			},
			removeSelectedItem : function()
			{
				var selectData = this.getSelectedDatas();
				for (var i = 0, item; item = this.selected[i]; i++)
				{
					this.data.splice(this.getItemIndex(item), 1);
					this.el.dom.removeChild(item);
					this.refresh();
				}
				this.selected = [];
				this.lastIndex = -1;
				return selectData;
			},
			removeAll : function()
			{
				var all = this.data;
				this.el.dom.innerHTML = "";
				this.data = [];
				this.selected = [];
				this.lastIndex = -1;
				return all;
			},
			refresh : function()
			{
				var childs = this.el.dom.childNodes;
				var i = 0, len = childs.length;
				for (i = 0; i < len; i++)
				{
					childs[i].setAttribute("itemIndex", i);
					childs[i].style.width = this.el.dom.scrollWidth;
				}
				this.itemLength = i;
			},
			findItem : function(node)
			{
				return node
						&& Ext.Element.fly(node).findParent(
								"div.choice-list-view-item", this.el);
			},
			getItemIndex : function(item)
			{
				return parseInt(item.getAttribute("itemIndex"), 10);
			},
			itemDblClick : function(event, target)
			{
				var item = this.findItem(target);
				if (item)
				{
					this.fireEvent("dblclick", item);
				}
			},
			itemClick : function(event, target)
			{
				var item = this.findItem(target);
				if (this.singleSelect)
				{
					this.doSingleSelection(event, item);
				}
				else
				{
					this.doMultiSelection(event, item);
				}
				if (item)
				{
					this.fireEvent("click", item);
				}
			},
			doSingleSelection : function(event, item)
			{
				this.select(item, false);
			},
			getNode : function(index)
			{
				return this.el.dom.children[index];
			},
			doMultiSelection : function(event, item)
			{
				if (event.shiftKey && this.lastIndex != -1)
				{
					var last = this.lastIndex;
					var current = this.getItemIndex(item);
					this.clearSelections();
					var start, end;
					if (current > last)
					{
						start = last;
						end = current;
					}
					else
					{
						start = current;
						end = last;
					}
					for (var i = start; i <= end; i++)
					{
						this.select(this.getNode(i), true);
					}
					this.lastIndex = last;
				}
				else
				{
					if (event.ctrlKey && this.isSelected(item))
					{
						this.unselect(item);
					}
					else
					{
						this.select(item, event.ctrlKey)
					}
				}
			},
			isSelected : function(item)
			{
				return Ext.Element.fly(item)
						.hasClass("choice-list-view-item-select");
			},
			select : function(item, keepExisting)
			{
				if (item)
				{
					if (!keepExisting)
					{
						this.clearSelections();
					}
					Ext.Element.fly(item)
							.addClass("choice-list-view-item-select");
					this.lastIndex = this.getItemIndex(item);
					this.selected.push(item);
				}
			},
			unselect : function(item)
			{
				Ext.Element.fly(item)
						.removeClass("choice-list-view-item-select");
				this.selected.splice(this.selected.indexOf(item), 1);
			},
			clearSelections : function()
			{
				for (var i = 0, item; item = this.selected[i]; i++)
				{
					Ext.Element.fly(item)
							.removeClass("choice-list-view-item-select");
				}
				this.selected = [];
				this.lastIndex = -1;
			},
			getSelectedDatas : function()
			{
				var selectData = [];
				for (var i = 0, len = this.selected.length; i < len; i++)
				{
					selectData[i] = this.data[this
							.getItemIndex(this.selected[i])]
				}
				return selectData;
			},
			getSelectedItems : function()
			{
				return this.selected;
			},
			getItemLength : function()
			{
				return this.itemLength;
			}
		});

Choice.StaffListView = Ext.extend(Choice.ListView, {
			key : "staff_id",
			icons : {
				"C" : "choice-staff-director-ico",
				"D" : "choice-staff-director-ico",
				"E" : "choice-staff-commissioner-ico",
				"F" : "choice-staff-commissioner-ico"
			},
			initComponent : function()
			{
				Choice.StaffListView.superclass.initComponent.call(this);
				this.template = new Ext.Template(
						'<span class="choice-staff-ico-item {icon}"></span>',
						'<span>{staff_name}</span>',
						'<span class="choice-staff-org-text">[{org_name}]</span>')
				
				this.newTemplate = new Ext.Template(
						'<div id="{staff_id}_STAFF" width="100%"><span class="choice-staff-ico-item {icon}"></span>',
						'<span>{staff_name}</span>',
						'<span class="choice-staff-org-text">[{self_region_name}-{self_org_name}]</span></div>')
						
				this.template.compile();
				this.newTemplate.compile();
			},
			getSingleItemHtml : function(config)
			{
				config.icon = this.icons[config.staff_post] || "";
				if(config.self_org_name){
					return this.newTemplate.apply(config);					
				}
				return this.template.apply(config);
			}
		});
		
Choice.FavouriteProjectListView = Ext.extend(Choice.ListView, {
			key : "id",
			initComponent : function()
			{
				Choice.StaffListView.superclass.initComponent.call(this);
				this.template = new Ext.Template(
						'<span class="choice-staff-ico-item {icon}"></span>',
						'<span style="width:150px">{name}</span>',
						'<span id="edit_{id}" class="edit-span-common"><img src="edit.png" id="edit_png_{id}"/>&nbsp;<img src="delete.png" id="del_png_{id}"/></span>')
						
				this.template.compile();
			},
			getSingleItemHtml : function(config)
			{
				return this.template.apply(config);
			},
			setItems : function(configs)
			{
				this.data = [], shtml = "";
				for (var i = 0, config; config = configs[i]; i++)
				{
					shtml += this.getItemHtml(config);
				}
				this.el.update(shtml || "");
				this.refresh();				
			},
			select : function(item, keepExisting)
			{
				if (item)
				{					
					if (!keepExisting)
					{
						this.clearSelections();
					}
					Ext.Element.fly(item)
							.addClass("choice-list-view-item-select");
					this.lastIndex = this.getItemIndex(item);
					this.selected.push(item);					
					Ext.get("edit_"+this.data[this.getItemIndex(item)].id).removeClass("edit-span-common");
					this.setEidtFlag(false);
				}
			},
			removeGroup : function(id) {
				Choice.ajax.request({
							url : "../../../../servlet/projectGroupServlet?",
							params : {
								tag : 152,
								groupIds :id
							},
							success : function(oXml) {
								Choice.Message
										.alert(getDefaultJsLan('removeCustomGroupSuccess'));
								this.refreshFavorite();
							},
							scope : this
						});
			},
			itemClick : function(event, target)
			{
				var item = this.findItem(target);
				if(item){
					var id = this.data[this.getItemIndex(item)].id;
					if(target.id=='edit_png_'+id){
						this.setEidtFlag(true,item);
						
						for (var i = 0, len = this.preparedView.view.data.length; i < len; i++)
						{
							this.selectedView.addItem(this.preparedView.view.data[i])
						}
						return;
					}else if(target.id=='del_png_'+id){
						this.removeGroup(id);
						return;
					}
				}
				if (this.singleSelect)
				{
					this.doSingleSelection(event, item);
				}
				else
				{
					this.doMultiSelection(event, item);
				}
				if (item)
				{
					this.fireEvent("click", item);
				}
			},
			setEidtFlag: function(flag,item)
			{
				this.editFlg = flag;
				if(this.editFlg){
					var temp = this.data[this.getItemIndex(item)];
					
					document.getElementById("DEFINE_NAME").value=temp.name;
					document.getElementById("btnSaveOpen").innerText = getDefaultJsLan('editCommonlyUsedGroup');
					this.editId = temp.id;
				}else{
					document.getElementById("DEFINE_NAME").value="";
					document.getElementById("btnSaveOpen").innerText = getDefaultJsLan('setCommonlyUsedGroup');
					this.editId = null;
				}
			},
			unselect : function(item)
			{
				Ext.Element.fly(item)
						.removeClass("choice-list-view-item-select");
						
				Ext.get("edit_"+this.data[this.getItemIndex(item)].id).addClass("edit-span-common");
				this.setEidtFlag(false);
				this.selected.splice(this.selected.indexOf(item), 1);
			},
			clearSelections : function()
			{
				for (var i = 0, item; item = this.selected[i]; i++)
				{
					Ext.Element.fly(item)
							.removeClass("choice-list-view-item-select");
							
					Ext.get("edit_"+this.data[this.getItemIndex(item)].id).addClass("edit-span-common");
					this.setEidtFlag(false);
				}
				this.selected = [];
				this.lastIndex = -1;
			},
			save : function() {
				var in_projectName = document.getElementById("DEFINE_NAME").value;
				var datas = this.selectedView.view.getData();
				var names = [];
				var ids = [];
				for (var i = 0, data; data = datas[i]; i++) {
					names[i] = data.staff_name;
					ids[i] = data.staff_id;
				}
				var value = {
					id : ids.join(","),
					name : names.join(",")
				}
				if(this.editFlg){
					// 编辑
						Choice.ajax.request({
						url : "../../../../servlet/projectGroupServlet?",
						params : {
							tag : 155,
							projectName : in_projectName,
							staffIds : value.id,
							groupId : this.editId
						},
						success : function(oXml) {
							Choice.Message
									.alert(getDefaultJsLan('addCustomGroupSuccess'));
							// 刷新常用小组
							this.refreshFavorite();
							// staffListView.items[0].view.refreshFavorite();
							document.getElementById("DEFINE_NAME").value = "";
						},
						scope : this
					});
				}else{
					// 添加人员
						Choice.ajax.request({
						url : "../../../../servlet/projectGroupServlet?",
						params : {
							tag : 151,
							projectName : in_projectName,
							staffIds : value.id
						},
						success : function(oXml) {
							Choice.Message
									.alert(getDefaultJsLan('addCustomGroupSuccess'));
							// 刷新常用小组
							this.refreshFavorite();
							// staffListView.items[0].view.refreshFavorite();
							document.getElementById("DEFINE_NAME").value = "";
						},
						scope : this
					});
				}
				this.setEidtFlag(false);
			}
		
				
		});

Choice.AllListView = Ext.extend(Choice.ListView, {
			key : "staff_id",
			replaceStyle :function(hText)
			{
				//var fontFamily=(fontType=='cn')?"'Microsoft YaHei'":"'Times New Roman'";
				var sText=['font-weight:bold;',
						  'font-family:',
						';color:#93BEFF'].join('');
				return hText.replace(/\{\$STYLE\}/g,sText);
			},
			initComponent : function()
			{
				Choice.StaffListView.superclass.initComponent.call(this);
				this.Stafftemplate = new Ext.Template(
						'<span> &nbsp;{staff_name}({highlighting_self_region_name}-{highlighting_self_org_name})</span>',
						'<span class="choice-staff-org-text">{highlighting_mobile} {highlighting_email}</span>');
				this.Stafftemplate.compile();
				this.othertemplate = new Ext.Template(
						'<span>&nbsp;{highlighting_name}</span>');
				this.othertemplate.compile();
				this.typetemplate = new Ext.Template(
						'<span>{highlighting_name}</span>');
				this.typetemplate.compile();
				
			},
			getSingleItemHtml : function(config)
			{
				if(config.type=='STAFF')
					return this.replaceStyle(this.Stafftemplate.apply(config));
				else if(config.type=='type')
				   return this.typetemplate.apply(config);
				 else
				   return this.replaceStyle(this.othertemplate.apply(config));
			}
		});

Choice.OrgListView = Ext.extend(Choice.ListView, {
			key : "ORG_ID",
			icons : {
				"C" : "choice-staff-director-ico",
				"D" : "choice-staff-director-ico",
				"E" : "choice-staff-commissioner-ico",
				"F" : "choice-staff-commissioner-ico"
			},
			initComponent : function()
			{
				Choice.OrgListView.superclass.initComponent.call(this);
				this.template = new Ext.Template(
						'<span class="choice-staff-ico-item {icon}"></span>',
						'<span>{ORG_NAME}</span>',
						'<span class="choice-staff-org-text"></span>')
				this.template.compile();
			},
			getSingleItemHtml : function(config)
			{
				config.icon = this.icons[config.staff_post] || "";
				return this.template.apply(config);
			}
		});

Choice.ListPanel = (function()
{
	var ListPanel = Ext.extend(Ext.Panel, {
				initComponent : function()
				{
					this.autoScroll = true;
					this.items = this.view;
					ListPanel.superclass.initComponent.call(this);
				},
				getView : function()
				{
					return this.view;
				}
			})
	for (var i = 0, methodName; methodName = ["addItem", "addItems",
			"setItems", "removeSelectedItem", "removeAll","setTip"][i]; i++)
	{
		ListPanel.prototype[methodName] = (function(methodName)
		{
			var fn = Choice.ListView.prototype[methodName];
			return function()
			{
				return fn.apply(this.view, arguments);
			}
		})(methodName);
	}
	return ListPanel;
})()

Choice.SearchIpt = Ext.extend(Ext.BoxComponent, {
			isSearch : false,
			setSize : function(w, h)
			{
				Choice.SearchIpt.superclass.setSize.call(this, w, h);
				if (this.rendered)
				{
					var iWidth = w - this.searchEl.getPadding("lr")
							- this.searchEl.getBorderWidth("lr")
							- this.searchBtn.getWidth();
					this.searchTxt.setWidth(iWidth);
				}
			},
			initComponent : function()
			{
				Choice.SearchIpt.superclass.initComponent.call(this);
				this.addEvents("select");
			},
			onRender : function(ct, position)
			{
				Choice.SearchIpt.superclass.onRender.call(this, ct, position);
				var sHtml = Ext.DomHelper.markup({
							tag : "div",
							cls : "choice-search",
							children : [{
										tag : "input",
										type : "text",
										cls : "choice-search-text"
									}, {
										tag : "div",
										cls : "choice-search-btn"
									}]
						});
				this.el.update(sHtml);
				this.searchEl = this.el.first();
				this.searchTxt = this.searchEl.first();
				this.searchBtn = this.searchEl.last();
				this.initList();
				this.initSearchEvent();
				this.clearSearchText();
			},
			initSearchEvent : function()
			{
				this.searchTxt.on({
							scope : this,
							focus : this.focusSearch,
							blur : this.blurSearch,
							keyup : {
								fn : this.search,
								buffer : 150,
								scope : this
							}
						})
				this.searchBtn.on("click", function()
						{
							if (this.isSearch)
							{
								this.clearSearchText();
							}
						}, this);
				this.keyNav = new Ext.KeyNav(this.searchTxt, {
							"down" : function()
							{
								this.selectNext();
							},
							"up" : function()
							{
								this.selectPrev();
							},
							"enter" : function()
							{
								this.selectItem();
							},
							// "esc" : function(e)
							// {
							// this.collapse();
							// },
							scope : this
						});
			},
			setSearchText : function(value)
			{
				this.searchTxt.dom.value = value;
			},
			clearSearchText : function()
			{
				this.setSearchText(this.emptyText);
				this.searchTxt.addClass("choice-search-text-clear-color");
				this.searchBtn.removeClass("choice-search-clear-btn");
				this.isSearch = false;
				this.collapse();
			},
			focusSearch : function()
			{
				if (this.searchTxt.getValue() == this.emptyText)
				{
					this.setSearchText("");
					this.searchTxt
							.removeClass("choice-search-text-clear-color");
				}
			},
			blurSearch : function()
			{
				!this.searchTxt.getValue() && this.clearSearchText();
			},
			initList : function()
			{
				this.searchList = new Ext.Layer({
							cls : "choice-search-list",
							shim : false
						});
				this.searchList.setHeight(this.listHeight || 298);
				this.searchView = new this.seachViewClass(Ext.apply({
							singleSelect : true,
							renderTo : this.searchList,
							listeners : {
								"click" : function(item)
								{
									this.selectItem();
								},
								scope : this
							}

						}, this.viewConfig));
				this.searchList.on({
							scope : this,
							"mouseover" : function(e, t)
							{
								var item = this.searchView.findItem(t);
								if (item)
								{
									this.searchView.select(item, false);
									this.selectedIndex = this.searchView
											.getItemIndex(item);
								}
							}
						})
			},
			select : function(index)
			{
				var item = this.searchView.getNode(index);
				if (item)
				{
					Ext.Element.fly(item)
							.scrollIntoView(this.searchList, false);
					this.searchView.select(item, false);
				}
			},
			selectNext : function()
			{
				if (this.selectedIndex == -1)
				{
					this.selectedIndex = 0;
				}
				else
				{
					this.selectedIndex++;
					if (this.selectedIndex == this.searchView.getItemLength())
					{
						this.selectedIndex = 0;
					}
				}
				this.select(this.selectedIndex);
			},
			selectPrev : function()
			{
				var last = this.searchView.getItemLength() - 1;
				if (last >= 0)
				{
					if (this.selectedIndex == -1)
					{
						this.selectedIndex = last;
					}
					else
					{
						this.selectedIndex--;
						if (this.selectedIndex < 0)
						{
							this.selectedIndex = last;
						}
					}
					this.select(this.selectedIndex);
				}
			},
			selectItem : function()
			{
				var oConfig = this.searchView.getSelectedDatas()[0];
				if (oConfig)
				{
					this.collapse();
					this.setSearchText(oConfig.staff_name||'');
					this.fireEvent("select", oConfig);
				}
			},

			//解决中文输入法下无法按下回车无法查询的问题
			searchTimerCn: function() {
				var self = this;
				self.timer = setInterval(function(){
					if (self.searchTxt.getValue() != "" && self.searchTxt.getValue() != self.emptyText)
					{
						if (!self.isSearch)
						{
							self.isSearch = true;
							self.searchBtn.addClass("choice-search-clear-btn");
						}
						self.expand();
						self.onSearch();
						self.timer ? clearInterval(self.timer) : null;
						self.timer = undefined;
					}
					
				}, 100);
			},

			search : function(e)
			{
				// 特殊键不予以过滤
				if (e.getKey() in this.keyNav.keyToHandler)
				{
					return;
				}
				if (this.searchTxt.getValue() == "")
				{
					this.collapse();
					if(!this.timer)
					{
						this.searchTimerCn();
					}
					return;
				}
				if (!this.isSearch)
				{
					this.isSearch = true;
					this.searchBtn.addClass("choice-search-clear-btn");
				}
				this.expand();
				this.onSearch();
			},
			collapse : function()
			{
				if (!this.isExpanded())
				{
					return;
				}
				this.searchList.hide();
				Ext.getDoc().un('mousewheel', this.collapseIf, this);
				Ext.getDoc().un('mousedown', this.collapseIf, this);
			},
			isExpanded : function()
			{
				return this.searchList && this.searchList.isVisible();
			},
			expand : function()
			{
				if (this.isExpanded())
				{
					return;
				}
				this.searchList.setWidth(this.searchEl.getWidth());
				this.searchList.alignTo(this.searchEl, "bl");
				this.searchList.show();
				this.selectedIndex = -1;
				Ext.getDoc().on({
							scope : this,
							mousewheel : this.collapseIf,
							mousedown : this.collapseIf
						});
			},
			collapseIf : function(e)
			{
				if (!e.within(this.searchEl) && !e.within(this.searchList))
				{
					this.collapse();
				}
			},
			onSearch : Ext.emptyFn
		});
Choice.SearchStaff = Ext.extend(Choice.SearchIpt, {
	emptyText : getDefaultJsLan('emptyText'),
	seachViewClass : Choice.StaffListView,
	currentPage : 1,//当前页
	totalPage : 0,
	searchType : 'STAFF',
	pageControl : function(e,t){		
		var flag = t.id;
		if(flag == 'page-first'){
			this.currentPage = 1;
		}else if(flag == 'page-prev'){
			this.currentPage = this.currentPage - 1;
		}else if(flag == 'page-next'){
			this.currentPage = this.currentPage + 1;
		}else if(flag == 'page-last'){
			this.currentPage = this.totalPage;
		}
		this.onSearch(true);
	},
	pagebar : function()
	{
		var html = "<div align='center'>";
		if (this.currentPage > 1) {
			html = html
					+ "<label id='lbFirstPage'>"
					+ "<img src='/resource/js/ext/resources/images/default/grid/page-first.gif' id='page-first' title='" + getDefaultJsLan('firstPage') + "'/>"
					+ "<img src='/resource/js/ext/resources/images/default/grid/page-prev.gif' id='page-prev' title='" + getDefaultJsLan('prewPage') + "'/>"
					+ "</label>";
		}

		html = html + "&nbsp;<label font>" + getDefaultJsLan('currentPagePrefix') + this.currentPage + getDefaultJsLan('currentPageSuffix')
				+ this.totalPage + getDefaultJsLan('page') + "</label>&nbsp;";
		if (this.currentPage < this.totalPage) {
			html = html
					+ "<label id='lbLastPage'>"
					+ "<img src='/resource/js/ext/resources/images/default/grid/page-next.gif'/ id='page-next' title='" + getDefaultJsLan('nextPage') + "'>"
					+ "<img src='/resource/js/ext/resources/images/default/grid/page-last.gif' id='page-last' title='" + getDefaultJsLan('lastPage') + "'/>"
					+ "</label>";
		}
		html = html + "</div>";
		return html;
	},
	onSearch : function(isPageControl)
	{
		if(!isPageControl) this.currentPage = 1;//如果不是点击分页控制，就从第一页开始
		
		if (!this.sendTemplate)
		{
			this.sendTemplate = new Ext.Template('<root>',
					'<orgId>{orgId}</orgId>',
					'<searchStaffName>{searchStaffName}</searchStaffName>',
					'<filterStaffWhere>{filterStaffWhere}</filterStaffWhere>',
					'<currentPage>{currentPage}</currentPage>',
					'<searchType>{searchType}</searchType>',
					'</root>');
			this.sendTemplate.compile();
		}
		if (this.searchTxt.getValue() != "")
		{
			var sendXml = this.sendTemplate.apply({
				"searchStaffName" : this.searchTxt.getValue(),
				"filterStaffWhere" : Choice.params.filterStaffWhere,
				"currentPage" : this.currentPage,
				"searchType" : this.searchType,
				// 如果设置只读或者根目录的属性那就只过滤指定orgid的员工
				"orgId" : (Choice.params.orgId && (Choice.params.isReadOnly || Choice.params.isSetRoot))
						? Choice.params.orgId.join(",")
						: ""
			});
			Choice.ajax.request({
						params : {
							tag : 78
						},
						xmlData : sendXml,
						success : function(oXml)
						{
							var staffNodes = oXml
									.selectNodes('/root/rowset/row');
							this.totalPage = oXml.selectSingleNode('/root/totalPage').text;
							var staffConfigs = [];
							for (var i = 0, node; node = staffNodes[i]; i++)
							{
								staffConfigs[i] = Choice.xmlAttrToObj({}, node,
										{
											"id" : "staff_id"
										});
							}
							this.searchView.setItems(staffConfigs);
							
							if (staffConfigs.length >= 1) {
								this.searchView.el.insertHtml('beforeEnd', this.pagebar());								
								var arry = ['page-first', 'page-prev', 'page-next','page-last']//4个图标的id
								for (var i =0;i < arry.length; i++) {
									if(Ext.get(arry[i])){
										Ext.get(arry[i]).on('click', function(e,t) {												
													this.pageControl(e,t);
												}, this);
									}
								}

					}
						},
						scope : this
					})
		}
	}
});

Choice.SearchAll = Ext.extend(Choice.SearchStaff,{
	emptyText : getDefaultJsLan('SearchAllEmptyText'),
	seachViewClass : Choice.AllListView,
	searchType : 'ALL'
});

Choice.SearchOrg = Ext.extend(Choice.SearchIpt, {
	emptyText : getDefaultJsLan('emptyText'),
	seachViewClass : Choice.OrgListView,
	currentPage : 1,//当前页
	totalPage : 0,
	view :  null,
	pageControl : function(e,t){		
		var flag = t.id;
		if(flag == 'page-first'){
			this.currentPage = 1;
		}else if(flag == 'page-prev'){
			this.currentPage = this.currentPage - 1;
		}else if(flag == 'page-next'){
			this.currentPage = this.currentPage + 1;
		}else if(flag == 'page-last'){
			this.currentPage = this.totalPage;
		}
		this.onSearch(true);
	},
	selectItem : function()
	{
		var oConfig = this.searchView.getSelectedDatas()[0];
		if (oConfig&&oConfig.ORG_ID)
		{
			this.collapse();
			if(this.view){
				this.view.isExpandItem = true;
			}
			this.setSearchText(oConfig.ORG_NAME);
			this.fireEvent("select", oConfig);
		}
	},
	pagebar : function()
	{
		var html = "<div align='center'>";
		if (this.currentPage > 1) {
			html = html
					+ "<label id='lbFirstPage'>"
					+ "<img src='/resource/js/ext/resources/images/default/grid/page-first.gif' id='page-first' title='" + getDefaultJsLan('firstPage') + "'/>"
					+ "<img src='/resource/js/ext/resources/images/default/grid/page-prev.gif' id='page-prev' title='" + getDefaultJsLan('prewPage') + "'/>"
					+ "</label>";
		}

		html = html + "&nbsp;<label font>" + getDefaultJsLan('currentPagePrefix') + this.currentPage + getDefaultJsLan('currentPageSuffix')
				+ this.totalPage + getDefaultJsLan('page') + "</label>&nbsp;";
		if (this.currentPage < this.totalPage) {
			html = html
					+ "<label id='lbLastPage'>"
					+ "<img src='/resource/js/ext/resources/images/default/grid/page-next.gif'/ id='page-next' title='" + getDefaultJsLan('nextPage') + "'>"
					+ "<img src='/resource/js/ext/resources/images/default/grid/page-last.gif' id='page-last' title='" + getDefaultJsLan('lastPage') + "'/>"
					+ "</label>";
		}
		html = html + "</div>";
		return html;
	},
	clearSearchText : function()
	{
		this.setSearchText(this.emptyText);
		this.searchTxt.addClass("choice-search-text-clear-color");
		this.searchBtn.removeClass("choice-search-clear-btn");
		this.isSearch = false;
		if(this.view){
			this.view.isExpandItem = false;
			this.view.addItem();
		}
		this.collapse();
		
	},
	onSearch : function(isPageControl)
	{
		if(!isPageControl) this.currentPage = 1;//如果不是点击分页控制，就从第一页开始
		
		if (!this.sendTemplate)
		{
			this.sendTemplate = new Ext.Template('<root>',
					'<orgName>{orgName}</orgName>',
					'<currentPage>{currentPage}</currentPage>',
					'<startOrg>{startOrg}</startOrg>',
					'</root>');
			this.sendTemplate.compile();
		}
		if (this.searchTxt.getValue() != "")
		{
			var sendXml = this.sendTemplate.apply({
				"orgName" : this.searchTxt.getValue(),
				"currentPage" : this.currentPage,
				// 如果设置只读或者根目录的属性那就只过滤指定orgid的员工
				"startOrg" : (Choice.params.orgId && (Choice.params.isReadOnly || Choice.params.isSetRoot))
						? Choice.params.orgId.join(",")
						: "0"
			});
			this.searchView.removeAll();
			var configs = [];
			configs[0] = {ORG_NAME:"&nbsp;&nbsp;&nbsp;<font color='red'>" + getDefaultJsLan('pleaseWait') + "</font>"};
			this.searchView.setItems(configs);
			Choice.ajaxStaffMenu.request({
						params : {
							action : 46
						},
						xmlData : sendXml,
						success : function(oXml)
						{
							var nodes = oXml
									.selectNodes('/root/rowSet');
							var configs = [];
							for (var i = 0, node; node = nodes[i]; i++)
							{
								configs[i] = Choice.xmlAttrToObj({}, node,
										{
											"id" : "ORG_ID"
										});
							}
							if(configs<=0){
								configs[0] = {ORG_NAME:"&nbsp;&nbsp;&nbsp;<font color='red'>" + getDefaultJsLan('noResult') + "</font>"};
								this.searchView.setItems(configs);
							}else{
								this.searchView.setItems(configs);
							}
						},
						scope : this
					})
		}
	}
});

Choice.TreePanel = Ext.extend(Ext.Panel, {
			initComponent : function()
			{
				Choice.TreePanel.superclass.initComponent.call(this);
				this.addEvents("click");
				this.addEvents("dbclick");
				this.addEvents("load");
				this.addEvents("pretreatment");
				this.addEvents("dynamicLoad");
				this.tree = new XMLTree();
				if (this.treeConfig)
				{
					Ext.apply(this.tree, this.treeConfig);
				}
				this.initAction();
			},
			initAction : function()
			{
				var self = this;
				var ClickAction = function()
				{
					this.parent = new XMLTree_onClick_Action;
					this.parent.click = function(oItem)
					{
						self.fireEvent("click", oItem);
					}
					return this.parent
				}
				var DblClickAction = function()
				{
					this.parent = new XMLTree_onDblClick_Action;
					this.parent.dblclick = function(oItem)
					{
						self.fireEvent("dbclick", self.tree,oItem);
					}
					return this.parent
				}
				var LoadAction = function()
				{
					this.parent = new XMLTree_onLoad_Action;
					this.parent.load = function()
					{
						self.fireEvent("load", self.tree);
					}
					return this.parent;
				}
				var PretreatmentAction = function()
				{
					this.parent = new XMLTree_onBeforeXMLTrans_Action
					this.parent.pretreatment = function(oXml)
					{
						self.fireEvent("pretreatment", oXml, self.tree);
						return oXml;
					}
					return this.parent;
				}
				var DynamicLoadAction = function()
				{
					this.parent = new XMLTree_onDynamicLoad_Action;
					this.parent.dynamicLoad = function(oItem)
					{
						self.fireEvent("dynamicLoad", oItem);
						return oItem.dloadUrl;
					}
					return this.parent;
				}
				this.tree.setLoadAction(new LoadAction());
				this.tree.setClickAction(new ClickAction());
				this.tree.setDblClickAction(new DblClickAction());
				this.tree.setPretreatmentAction(new PretreatmentAction());
				this.tree.setDynamicLoadAction(new DynamicLoadAction())
			},
			onRender : function(ct, position)
			{
				Choice.TreePanel.superclass.onRender.call(this, ct, position);
				this.body.addClass("choice-tree-panel-body");
				if (this.tree.xmlUrl)
				{
					this.tree.showAt(this.body.dom);
				}
			},
			refresh : function(){
				if (this.treeConfig)
				{
					Ext.apply(this.tree, this.treeConfig);
				}
				if (this.tree.xmlUrl)
				{
					this.tree.showAt(this.body.dom);
				}
			},
			selectItemByPath:function(path)
			{
				this.tree.selectItemByPath(path);
				this.bySelectItemByPath = true;
			}
		});


Choice.SearchTreePanel = Ext.extend(Choice.TreePanel,{
	
})

Choice.SearchPanel = Ext.extend(Ext.BoxComponent, {
			searchHeight : 30,
			onRender : function(ct, position)
			{
				Choice.SearchPanel.superclass.onRender.call(this, ct, position);
				this.search.render(this.el);
				this.view.render(this.el);
				this.search.view = this.view;
				this.search.on("select", function(o)
						{
							this.view.addItem(o);
						}, this);
			},
			setSize : function(w, h)
			{
				Choice.SearchPanel.superclass.setSize.call(this, w, h);
				if (!this.search.rendered)
				{
					this.search.setSize(w, this.searchHeight);
				}
				if (!this.view.rendered)
				{
					this.view.setSize(w, h - this.searchHeight);
				}
			}
		});

Choice.SearchAllPanel = Ext.extend(Ext.BoxComponent, {
			onRender : function(ct, position)
			{
				Choice.SearchPanel.superclass.onRender.call(this, ct, position);
				this.search.render(this.el);
				
				this.search.on("select", function(o)
						{
							this.view.addItem(o);
						}, this);
			}
		});

Choice.Buttons = Ext.extend(Ext.BoxComponent, {
	onRender : function(ct, position)
	{
		Choice.Buttons.superclass.onRender.call(this, ct, position);
		this.el
				.update("<TABLE height='100%' width='100%' border=0><TR><TD align='center'></TD></TR></TABLE>");
		this.btnTD = this.el.child("td");
		for (var i = 0, j = this.buttons.length; i < j; i++)
		{
			new Ext.Button(Ext.apply(this.buttons[i], {
						width : 30,
						cls : "choice-panel-btn",
						renderTo : this.btnTD
					}));
		}
	}
});

Choice.Panel = Ext.extend(Ext.BoxComponent, {
			onRender : function(ct, position)
			{
				Choice.Panel.superclass.onRender.call(this, ct, position);
				this.el.addClass("choice-panel");
			},
			createComponent : function(config)
			{
				return Ext.create(config, "panel");
			}
		});

Choice.ThreeColumnPanel = Ext.extend(Choice.Panel, {
	columnHeight : 350,
	onRender : function(ct, position)
	{
		Choice.ThreeColumnPanel.superclass.onRender.call(this, ct, position);
		this.el
				.update('<TABLE cellSpacing=3 cellPadding=0 border=0><TR><TD></TD><TD></TD><TD></TD><TD></TD></TR></table>');
		this.columns = this.el.first().dom.rows[0].cells;
		this.columnWidths = [230, 230, 50, 240];
		for (var i = 0, len = this.items.length; i < len; i++)
		{
			this.items[i] = this.createComponent(this.items[i]);
		}
		this.renderView(this.items[0], 0);
		this.renderView(this.items[1], 1);
		this.renderView(new Choice.Buttons({
							buttons : this.buttons
						}), 2);
		this.renderView(this.items[2], 3);
	},
	renderView : function(view, index)
	{
		view.setSize(this.columnWidths[index], this.columnHeight)
		view.render(this.columns[index]);
	}
});

Choice.ProjectPanel = Ext.extend(Ext.Panel, {
	initComponent : function()
	{
		Choice.ProjectPanel.superclass.initComponent.call(this);

		this.titleTemplate = new Ext.Template(
				'<div class="choice-project-title" id="group-{groupId}">',
				'<span class="choice-project-title-ico {icon}"></span>',
				'<span class="choice-project-title-text">{title}：</span>',
				'</div><div class="choice-project-body" id="group-{groupId}-body"></div>');
		this.titleTemplate.compile();

		this.bodyTemplate = new Ext.Template(
				'<table cellSpacing=0 cellPadding=0 border=0>',
				'<tr><td width="150px"></td><td width="150px"></td><td width="150px"></td><td width="150px"></td><td width="150px"></td></tr>',
				'{body}</table>');
		this.bodyTemplate.compile();

		this.trTemplate = new Ext.Template('<tr height=26>{td}</tr>');
		this.trTemplate.compile();

		this.tdTemplate = new Ext.Template(
				'<td><INPUT TYPE="checkbox" {checked} id="check-{bpr_line_cfg_id}-{id}" name="check-{id}" projectId="{id}" groupId="{bpr_line_cfg_id}">',
				'<LABEL for="check-{bpr_line_cfg_id}-{id}" class="choice-check-text" onclick="selectGroupStaffReturn({id},\'check-{bpr_line_cfg_id}-{id}\')" style="cursor:hand;" onMouseOver="this.style.color=\'#FF0000\';this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\';this.style.textDecoration=\'none\';">{name}</label></td>');
		this.tdTemplate.compile();
		this.selected = [];
	},
	getSelected : function()
	{
		return this.selected;
	},
	onBodyClick : function(e)
	{
		var srcDom = e.getTarget();
		if (srcDom.type == "checkbox")
		{
			this.onCheck(srcDom);
		}
	},
	onCheck : function(oCheck)
	{
		var id = oCheck.projectId;
		var smallChecks = document.getElementsByName("check-" + id);
		for (var i = 0, c; c = smallChecks[i]; i++)
		{
			c.checked = oCheck.checked;
		}
		var index = this.selected.indexOf(id);
		if (oCheck.checked)
		{
			if (index == -1)
			{
				this.selected.push(id);
			}
		}
		else
		{
			this.selected.splice(index, 1);
		}
	},
	onRender : function(ct, position)
	{
		Choice.ProjectPanel.superclass.onRender.call(this, ct, position);
		this.body.insertHtml('beforeEnd', this.titleTemplate.apply({
							title : getDefaultJsLan('commonProjectGroup'),
							icon : "choice-project-favorite-ico",
							groupId : "favorite"
						}) + this.titleTemplate.apply({
							title : getDefaultJsLan('customProjectGroup'),
							icon : "choice-project-group-ico",
							groupId : "custom"
						}));
		this.body.on("click", this.onBodyClick, this);
		Choice.ajax.request({
					params : {
						tag : 46			// servlet/staff_manage?tag=46   获取专业列表
					},
					success : function(oXml)
					{
						var pgNodes = oXml.selectNodes('/root/rowSet');
						var sHtml = "";
						for (var i = 0, pgNode; pgNode = pgNodes[i]; i++)
						{
							sHtml += this.titleTemplate.apply({
										title : pgNode.selectSingleNode("NAME").text,
										icon : "choice-project-group-ico",
										groupId : pgNode.getAttribute("id")
									});
						}
						
						//增加一个“无专业”，将未定义专业的项目组列出来：itnm00053304:
						sHtml += this.titleTemplate.apply({
										title : getDefaultJsLan('withoutProfessional'),
										icon : "choice-project-group-ico",
										groupId : '0'
									});
									
						var oEl = this.body.dom.all("group-favorite-body");
						oEl.insertAdjacentHTML('afterEnd', sHtml);
						this.refreshProject();
						this.refreshFavorite();
					},
					scope : this
				});
	},
	maxProjectEachRow : 5,
	createProjectConfig : function(node)
	{
		var config = Choice.xmlNodeToObj({}, node);
		if (this.selected.indexOf(config.id) != -1)
		{
			config.checked = "checked";
		}
		return config;
	},
	createProjectRowHtml : function(projectConfigs)
	{
		var sHtml = "";
		for (var i = 0, config; config = projectConfigs[i]; i++)
		{
			sHtml += this.tdTemplate.apply(config);
		}
		return this.trTemplate.apply({
					td : sHtml
				});
	},
	refreshFavorite : function()
	{
		var itemConfigs = [], bodyHtml = "", groupId;
		Choice.ajax.request({
					url : "../../../../servlet/projectGroupServlet?tag=45",
					success : function(oXml)
					{
						var projectNodes = oXml.selectNodes('/root/rowSet');
						var groupBody = document
								.getElementById("group-favorite-body");
						for (var i = 0, node; node = projectNodes[i]; i++)
						{
							itemConfigs.push(this.createProjectConfig(node));
							if (itemConfigs.length == this.maxProjectEachRow)
							{
								bodyHtml += this
										.createProjectRowHtml(itemConfigs);
								itemConfigs = [];
							}
						}
						if (itemConfigs.length != 0)
						{
							bodyHtml += this.createProjectRowHtml(itemConfigs);
						}
						groupBody.innerHTML = this.bodyTemplate.apply({
									body : bodyHtml
								});
					},
					scope : this
				});
	},
	refreshProject : function()
	{
		var projectGroup = {}, groupId, groupConfig, groupBody;
		Choice.ajax.request({
					url : "../../../../servlet/projectGroupServlet?tag=44",
					success : function(oXml)
					{
						var projectNodes = oXml.selectNodes('/root/rowSet');
						for (var i = 0, node; node = projectNodes[i]; i++)
						{
							groupId = "group-"
									+ node.selectSingleNode("BPR_LINE_CFG_ID").text
									+ "-body";
							groupConfig = projectGroup[groupId];
							if (!groupConfig)
							{
								groupConfig = {
									items : [],
									html : ""
								};
								projectGroup[groupId] = groupConfig;
							}
							groupConfig.items.push(this
									.createProjectConfig(node));
							if (groupConfig.items.length == this.maxProjectEachRow)
							{
								groupConfig.html += this
										.createProjectRowHtml(groupConfig.items);
								groupConfig.items = [];
							}
						}
						for (var key in projectGroup)
						{
							groupBody = document.getElementById(key);
							if (groupBody)
							{
								groupConfig = projectGroup[key];
								if (groupConfig.items.length != 0)
								{
									groupConfig.html += this
											.createProjectRowHtml(groupConfig.items);
								}
								groupBody.innerHTML = this.bodyTemplate.apply({
											body : groupConfig.html
										});
							}
						}
					},
					scope : this
				});
	}
});

Choice.OrgPanel = Ext.extend(Ext.Panel, {
	initComponent : function()
	{
		Choice.OrgPanel.superclass.initComponent.call(this);
		this.tdTemplate = new Ext.Template(
				'<td width="100px"><INPUT TYPE="checkbox" id="{id}" {checked} orgName="{name}">',
				'<LABEL for="{id}">{name}</label></td>');
		this.tdTemplate.compile();

		this.trTemplate = new Ext.Template('<tr height=26>{td}</tr>');
		this.trTemplate.compile();

		this.bodyTemplate = new Ext.Template('<table cellSpacing=0 cellPadding=0 border=0>{body}</table>');

		this.data = [["北京", "天津", "河北", "山西", "内蒙古", "辽宁"],
				["吉林", "黑龙江", "上海", "江苏", "浙江", "安徽"],
				["福建", "江西", "山东", "河南", "湖北", "湖南"],
				["广东", "广西", "海南", "重庆", "四川", "贵州"],
				["云南", "西藏", "陕西", "甘肃", "青海", "宁夏"], ["新疆"]];
		// 北方九省：黑龙江,吉林,辽宁,天津,河北,河南,山东,山西,内蒙古
		// 1-1,1-0,0-5,0-1,0-2,2-3,2-2,0-3,0-4
		this.selected = [];
		this.checks = [];
		
		//获取“区域MSS（原北方9省）”的省份配置（select sys_var_value from sys_config where sys_var='JTITSM_MSS_REGION_CONFIG'）：
		this.MSS_RegionName="";
		Choice.ajax.request({
			url : "../../../../servlet/util?OperType=5&varName=JTITSM_MSS_REGION_CONFIG",
			success : function(oXml)
			{
				var valueNodes = oXml.selectNodes('/root/value');
				this.MSS_RegionName = valueNodes[0].text;
			},
			scope : this
		});
		
	},
	getCheckId : function(i, j)
	{
		return 'org-' + i + '-' + j
	},
	onBodyClick : function(e)
	{
		var srcdom = e.getTarget();
		if (srcdom.type == "checkbox")
		{
			if (srcdom.range)
			{
				this.selected = [];
				if (srcdom.range == 'all')
				{
					for (var i = 0, len = this.checks.length; i < len; i++)
					{
						var checkdom = document.getElementById(this.checks[i]);
						checkdom.checked = srcdom.checked
						if (srcdom.checked)
						{
							this.selected.push(checkdom.orgName)
						}
					}
					if (srcdom.checked)
					{
						document.getElementById("org-nine").checked = false;
					}
				}
				else
				{
					for (var i = 0, len = this.checks.length; i < len; i++)
					{
						var checkdom = document.getElementById(this.checks[i]);
						checkdom.checked = false
					}

					var mssRegionNames = this.MSS_RegionName.split(",");
					for (var i = 0, len = mssRegionNames.length; i < len; i++)
					{
						var mssRegionName = mssRegionNames[i];
						for (var j = 0, len = this.checks.length; j < len; j++)
						{
							var checkdom = document.getElementById(this.checks[j]);
							if(mssRegionName==checkdom.orgName){
								checkdom.checked = srcdom.checked
								if (srcdom.checked)
								{
									this.selected.push(checkdom.orgName)
								}
							}
						}

					}
					if (srcdom.checked)
					{
						document.getElementById("org-all").checked = false;
					}
				}
			}
			else
			{
				if (srcdom.checked)
				{
					this.selected.push(srcdom.orgName)
				}
				else
				{
					var index = this.selected.indexOf(srcdom.orgName)
					this.selected.splice(index, 1);
				}
			}
		}
	},
	onRender : function(ct, position)
	{
		Choice.OrgPanel.superclass.onRender.call(this, ct, position);
		this.body.on("click", this.onBodyClick, this);
		this.body.dom.innerHTML = '<div class="choice-org-body">'
				+ '<span><input type="checkbox" id="org-all" range="all"><label for="org-all" class="choice-check-text">全国</label></span>'
				+ '<span style="margin-left:50px;"><input type="checkbox" id="org-nine" range="1-1,1-0,0-5,0-1,0-2,2-3,2-2,0-3,0-4"><label for="org-nine" class="choice-check-text">区域MSS</label></span>'
				+ '</div><div class="choice-org-body" id="org-body" style="border-top:2px solid #B8B8B8;margin:10px 10px 0px 10px"></div>'
		var orgBody = document.getElementById("org-body");
		var i, j, iLen, jLen, bodyHtml = "";
		for (i = 0, iLen = this.data.length; i < iLen; i++)
		{
			var _data = this.data[i];
			var tdHtml = '';
			for (j = 0, jLen = _data.length; j < jLen; j++)
			{
				var name = _data[j];
				var id = this.getCheckId(i, j);
				this.checks.push(id);
				tdHtml += this.tdTemplate.apply({
							id : id,
							name : name,
							checked : (this.selected.indexOf(name) == -1
									? ""
									: "checked")
						})

			}
			bodyHtml += this.trTemplate.apply({
						td : tdHtml
					});
		}
		orgBody.innerHTML = this.bodyTemplate.apply({
					body : bodyHtml
				});
	},
	getSelected : function()
	{
		return this.selected;
	}
});

Choice.Connection = (function()
{
	var getConnection = function(url)
	{
		var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
		xmlRequest.open("post", url, false);
		xmlRequest.setRequestHeader("Content-Type",
				"application/x-www-form-urlencoded; charset=UTF-8");
		return xmlRequest;
	}
	var Conn = function(o)
	{
		Ext.apply(this, o);
	}
	Conn.prototype = {
		request : function(o)
		{
			var url = o.url || this.url
			var p = o.params
			p = Ext.isObject(p) ? Ext.urlEncode(p) : p;
			if (o.xmlData)
			{
				url = Ext.urlAppend(url, p);
				p = o.xmlData;
			}
			var connection = getConnection(url);
			connection.send(p);
			if (connection.status == 200)
			{
				var oXml = connection.responseXML;
				var errNode = oXml.selectSingleNode("/root/error_code");
				if (errNode)
				{
					if (errNode.text == 0)
					{
						o.success(oXml);
					}
					else
					{
						Choice.Message.error(errNode.nextSibling.text);
					}
				}
				else
				{
					Choice.Message.error(getDefaultJsLan('xmlError'));
				}
			}
			else
			{
				Choice.Message.error(getDefaultJsLan('requestSendError'));
			}
		}
	}
	return Conn;
})();

Choice.Message = (function()
{
	var msg;
	var timeId
	return {
		init : function()
		{
			msg = new Ext.Layer({
						shim : false
					});
			msg.addClass('choice-message');
		},
		show : function(text, bg)
		{
			window.clearInterval(timeId);
			msg.update(text);
			msg.dom.style.background = bg;
			msg.alignTo(document.body, 'br-br', [-10, -10]);
			msg.show();
		},
		hide : function()
		{
			msg.hide();
		},
		alert : function(text)
		{
			this.show(text, '#68AF02');
			timeId = this.hide.defer(2000);
		},
		warn : function(text)
		{
			this.show(text, '#EF8F00');
			timeId = this.hide.defer(2000);
		},
		error : function(text)
		{
			this.show(text, '#D02709');
		}
	}

})()

Choice.Factory = (function()
{
	function getXMLSrc(xmlSrc)
	{
		var documentURL = Choice.params.parentWin.document.URL
		var re = /(.*\/)(.*)/g;
		return documentURL.replace(re, "$1" + xmlSrc);
	}

	var factory = {
		RootOrgId : function(){
			if((Choice.params.orgId && (Choice.params.isReadOnly || Choice.params.isSetRoot))){
				return Ext.isArray(Choice.params.orgId)?Choice.params.orgId.join(",") : Choice.params.orgId;
			}
			return  "";								
		},
		OrgTree : function(listView)
		{
			var url = '../../../../servlet/staffmenu?action=40&startOrg='
			var searchUrl = '../../../../servlet/staffmenu?action=47&startOrg='
			if (Choice.params.isSetRoot && Choice.params.orgId)
			{
				url += Choice.params.orgId;
				searchUrl += Choice.params.orgId;
			}
			else
			{
				url += 0;
				searchUrl += 0;
			}
			var panel = new Choice.TreePanel({
				title : getDefaultJsLan('department'),
				treeConfig : {
					xmlUrl : url,
					isDynamicLoad : true
				},
				disabled : Choice.params.isReadOnly,
				addItem  : function(config){
					if(config){
						this.treeConfig.xmlUrl = searchUrl+'&orgId='+config.ORG_ID;
						this.path = config.ORG_PATH.substr(1,config.ORG_PATH.length-1);
					}else{
						this.treeConfig.xmlUrl = url
						this.path = null;
					}
					
					this.refresh();
				},
				listeners : {
					"click" : function(oItem)
					{
						if(this.bySelectItemByPath){
							Ext.get(this.tree._oSelectedItem).scrollIntoView(this.tree._showAtElement);
							this.bySelectItemByPath = false;
						}
						
						var url;
						if (Choice.params.action)
						{
							var _url = Choice.params.action.change(event);
							if (Choice.params.action.isReplace)
							{
								url = getXMLSrc(_url);
							}
						}
						Choice.conn.request({
							url : url,
							params : {
								tag : 36,
								id : Ext.isEmpty(oItem.id) ? -1 : oItem.id,//如果id为空时，默认传入-1
								filterStaffWhere : Choice.params.filterStaffWhere
							},
							success : function(oXml)
							{
								var staffNodes = oXml
										.selectNodes('/root/rowSet');
								var staffConfigs = []
								for (var i = 0, staffNode; staffNode = staffNodes[i]; i++)
								{
									staffConfigs[i] = Choice.xmlNodeToObj({},
											staffNode);
								}
								// 初始化的时候可能存在view还未rendered
								if (listView.rendered)
								{
									listView.setItems(staffConfigs);
									listView.setTip(staffConfigs);
								}
								else
								{
									listView.on("afterrender", function()
											{
												listView.setItems(staffConfigs);
												listView.setTip(staffConfigs);
											})
								}
							}
						});
						if (Choice.params.panelType == 'StaffByOrgAndProjuct2'){
						    Ext.getCmp('moveToSelected').setDisabled(false);
						    Ext.getCmp('moveToPrepare').setDisabled(false);
							Ext.getCmp('moveToSelected').setVisible(true);
							Ext.getCmp('moveToPrepare').setVisible(true);
						}
					},
					"dbclick" : function(tree,oItem){
						var oImg = oItem.previousSibling.previousSibling;//获取最前面那个加减图标
						var oItemDiv = getElement(oItem,"div");
					    //已经载入的
					    if(oItemDiv.type == 'parentNode')
					    {
					        var oChildrenDiv = oItemDiv.nextSibling;
					        if(oChildrenDiv.style.display == "none")
					        {
					            oChildrenDiv.style.display = "";
					            tree._changeImgSrc(oImg,0);
					        }
					        else
					        {
					            oChildrenDiv.style.display = "none";
					            tree._changeImgSrc(oImg,1);
					        }
					    }
					    //动态载入时执行
					    else if(oItemDiv.type == 'dynamicLoadNode')
					    {
					        tree.dynamicLoadTree(oItem);
					    }
					},
					"beforerender" : function()
					{
						if (!Choice.params.orgId)
							Choice.conn.request({
										params : "tag=43",
										success : function(o)
										{
											var orgIdNode = o
													.selectSingleNode('//ORG_ID');
											if (orgIdNode != null)
											{
												Choice.params.orgId = orgIdNode.text;
											}
										}
									});
						if (Choice.params.orgId)
						{
							if (!Ext.isArray(Choice.params.orgId))
							{
								Choice.params.orgId = Ext
										.isString(Choice.params.orgId)
										? Choice.params.orgId.split(",")
										: [Choice.params.orgId];
							}
						}
					},
					"load" : function(tree)
					{
						var self = this;
						if (Choice.params.orgId)
						{
							if (Choice.params.action)
							{
								tree.gotoItem(Choice.params.orgId, true);
							}
							else
							{
								Choice.conn.request({
									params : {
										tag : 82,
										orgId : Choice.params.orgId[0],
										rootOrgId : (Choice.params.isSetRoot)
												? Choice.params.orgId[0]
												: 0
									},
									success : function(o)
									{
										var path = o.selectSingleNode('//PATH');
										if(self.path){
											tree.selectItemByPath(self.path);
										}else if (path)
											tree.selectItemByPath(path.text
													.replace(/^\//g, ""));
									  	
									}
								});
							}
						}
						if(this.loadedSelectedPath){
							this.selectItemByPath(this.loadedSelectedPath);
						}
					},
					"dynamicLoad" : function(oItem)
					{
						oItem.dloadUrl = "../../../../servlet/staffmenu?action=41&id="
								+ oItem.id;
					},
					"pretreatment" : function(oXml)
					{
						// if (Choice.params.isSetRoot && Choice.params.orgId)
						// {
						// var menuRoot = oXml.selectSingleNode('/root/Menu');
						// var xpath = [];
						// for (var i = 0, len = Choice.params.orgId.length; i <
						// len; i++)
						// {
						// menuRoot
						// .appendChild(oXml
						// .selectSingleNode('//MenuItem[@id='
						// + Choice.params.orgId[i]
						// + ']'));
						// xpath[i] = "@id!=" + Choice.params.orgId[i];
						// }
						//
						// oXml.selectNodes("/root/Menu/MenuItem["
						// + xpath.join(" and ") + "]").removeAll();
						// }
						if (Choice.params.action)
						{
							Choice.params.action.pretreatment(oXml);
						}
					}
				}
			})
			return panel;
		},
		ProjectTree : function(listView, selectedView)
		{
			var selectedValue = Choice.params.projectId;
			var actionNm = 7;
			var isSpecial = Choice.params.isSpecial;
			if(isSpecial && isSpecial=="JTITSM_FLOW_PLACING"){	//集团ITSM任务派发流程"主送"人员选择窗口,"虚拟团队"列表增加人员过滤
				actionNm = 50;
			}
			return new Choice.TreePanel({
				title : projectLabel,
				disabled : Choice.params.isReadOnly,
				treeConfig : {
					xmlUrl : '../../../../servlet/staffmenu?action='+actionNm
				},
				listeners : {
					"click" : function(oItem)
					{
						Ext.get(this.tree._oSelectedItem).scrollIntoView(this.tree._showAtElement,false);
						Choice.conn.request({
							params : {
								tag : 64,
								id : oItem.id,
								filterStaffWhere : Choice.params.filterStaffWhere,
								org_id : factory.RootOrgId()
							},
							success : function(oXml)
							{
								var staffNodes = oXml
										.selectNodes('/root/rowSet');
								var staffConfigs = []
								for (var i = 0, staffNode; staffNode = staffNodes[i]; i++)
								{
									staffConfigs[i] = Choice.xmlNodeToObj({},
											staffNode);
								}
								// 初始化的时候可能存在view还未rendered
								if (listView.rendered)
								{
									listView.setItems(staffConfigs);
									listView.setTip(staffConfigs);
								}
								else
								{
									listView.on("afterrender", function()
											{
												listView.setItems(staffConfigs);
												listView.setTip(staffConfigs);
											})
								}
								if (oItem.id != selectedValue
										&& selectedView
										&& Choice.params.aRootOrgParam
										&& Choice.params.aRootOrgParam.toSelected)
								{
									selectedView.setItems(staffConfigs);
								}
								selectedValue = oItem.id;
								if (Choice.params.panelType == 'StaffByOrgAndProjuct2'){
									//listView.setDisabled(true);
									Ext.getCmp('moveToSelectedAll').handler();
									Ext.getCmp('moveToSelected').setVisible(true);
									Ext.getCmp('moveToPrepare').setVisible(true);
									Ext.getCmp('moveToSelected').setDisabled(false);
									Ext.getCmp('moveToPrepare').setDisabled(false);
								}
							}
						});
					},
					"load" : function(tree)
					{
						if(this.loadedSelectedPath){
							this.selectItemByPath(this.loadedSelectedPath);
						}
						
						if (Choice.params.projectId)
						{
							tree.gotoItem(Choice.params.projectId, true);
						}
					},
					"dbclick" : function(tree,oItem){
						var oImg = oItem.previousSibling.previousSibling;//获取最前面那个加减图标
						var oItemDiv = getElement(oItem,"div");
					    //已经载入的
					    if(oItemDiv.type == 'parentNode')
					    {
					        var oChildrenDiv = oItemDiv.nextSibling;
					        if(oChildrenDiv.style.display == "none")
					        {
					            oChildrenDiv.style.display = "";
					            tree._changeImgSrc(oImg,0);
					        }
					        else
					        {
					            oChildrenDiv.style.display = "none";
					            tree._changeImgSrc(oImg,1);
					        }
					    }
					    //动态载入时执行
					    else if(oItemDiv.type == 'dynamicLoadNode')
					    {
					        tree.dynamicLoadTree(oItem);
					    }
					},
					"pretreatment" : function(oXml)
					{
						/*if (Choice.params.action)
						{
							Choice.params.action.pretreatment(oXml);
						}*/
						if (Choice.params.isSetRoot && Choice.params.projectId)
						{
							var menuRoot = oXml.selectSingleNode('/root/Menu');
							menuRoot.appendChild(oXml
									.selectSingleNode('//MenuItem[@id='
											+ Choice.params.projectId + ']'));
							oXml.selectNodes("/root/Menu/MenuItem[@id!="
									+ Choice.params.projectId + "]")
									.removeAll();
						}
					}
				}
			})
		},
		OrgProjectGroup : function(listView)
		{
			var orgTree = this.OrgTree(listView);
			orgTree.autoHeight = true;
			var projectTree = this.ProjectTree(listView);
			
			var c1 = factory.OrgTreeWithSearch(orgTree);
			
			if (Choice.params.panelType == 'StaffByOrgAndProjuct2'){
				return new Ext.Panel({
							layout : 'accordion',
							defaults : {
								border : false
							},
							autoScroll : true,
							items : [projectTree,orgTree]
						})
			}else{
				return new Ext.Panel({
							layout : 'accordion',
							defaults : {
								border : false
							},
							autoScroll : true,
							items : [orgTree,projectTree]
						})
			}
		},
		PrepareStaffList : function(config)
		{
			return new Choice.ListPanel({
						title : getDefaultJsLan('prepareStaffList'),
						view : new Choice.StaffListView({
									singleSelect : !Choice.params.isMultiple,
									filter : Choice.params.filter
								})
					})
		},
		SelectedStaffList : function(config)
		{
			var view = new Choice.StaffListView({
				singleSelect : !Choice.params.isMultiple,
				oneRecord : !Choice.params.isMultiple,
				listeners : {
					"afterrender" : function()
					{
						if (Choice.params.iniId)
						{
							Choice.conn.request({
								params : {
									tag : 81,
									ids : Choice.params.iniId
								},
								success : function(o)
								{
									var staffNodes = o
											.selectNodes('/root/rowSet');
									var staffConfigs = [], staffConfig;
									for (var i = 0, staffNode; staffNode = staffNodes[i]; i++)
									{
										staffConfig = Choice.xmlNodeToObj({},
												staffNode);
										if (config && config.doStaffConfig)
										{
											staffConfig = config
													.doStaffConfig(staffConfig);
										}
										staffConfigs[i] = staffConfig;
									}
									view.setItems(staffConfigs);
								}
							});
						}
					}
				}
			})
			return new Choice.ListPanel({
						title : getDefaultJsLan('SelectedStaffList'),
						view : view,
						region: 'center'
					})
		},
		FavouriteProjectList : function(listView, selectedView)
		{
			var view = new Choice.FavouriteProjectListView({
				selectedView :selectedView,
				preparedView : listView,
				loaded :false,
				beforeLoadedPath:'',
				refreshFavorite : function(){
                   Choice.ajax.request({
							url : "../../../../servlet/projectGroupServlet?tag=45",
							success : function(o) {
								if(view.rendered){
									view.removeSelectedItem();
									view.removeAll();
									
									var staffNodes = o.selectNodes('/root/rowSet');
									var staffConfigs = [], staffConfig;
									for (var i = 0, staffNode; staffNode = staffNodes[i]; i++) {
										staffConfig = Choice.xmlNodeToObj({},
												staffNode);
										staffConfigs[i] = staffConfig;
									}								
									view.setItems(staffConfigs);
								}
								view.loaded=true;
								if(view.beforeLoadedPath){
									view.selectItemByPath(view.beforeLoadedPath)
								}
							}
						});
                },
                selectItemByPath : function(path){
                	if(this.loaded){
                		this.select(this.findItem(Ext.get('edit_'+path)));
                		this.loadStaff();
                		this.beforeLoadedPath='';
                	}else{
                		this.beforeLoadedPath=path;
                	}
                },
                loadStaff:function(){
                	Choice.conn.request({
                            params : {
                                tag : 64,
                                id : view.getSelectedDatas()[0].id,
                                filterStaffWhere : Choice.params.filterStaffWhere,
                                org_id : factory.RootOrgId()
                            },
                            success : function(oXml)
                            {
                                var staffNodes = oXml
                                        .selectNodes('/root/rowSet');
                                var staffConfigs = []
                                for (var i = 0, staffNode; staffNode = staffNodes[i]; i++)
                                {
                                    staffConfigs[i] = Choice.xmlNodeToObj({},
                                            staffNode);
                                }
                                // 初始化的时候可能存在view还未rendered
                                if (listView.rendered)
                                {
                                    listView.setItems(staffConfigs);
                                    listView.setTip(staffConfigs);
                                }
                                else
                                {
                                    listView.on("afterrender", function()
                                            {
                                                listView.setItems(staffConfigs);
                                                listView.setTip(staffConfigs);
                                            })
                                }
                                /*if (oItem.id != selectedValue
                                        && selectedView
                                        && Choice.params.aRootOrgParam
                                        && Choice.params.aRootOrgParam.toSelected)
                                {
                                    selectedView.setItems(staffConfigs);
                                }
                                selectedValue = oItem.id;*/
                            }
                        });
                },
				listeners : {
					"afterrender" : function() {
						this.refreshFavorite();
					},
					"click" : function(oItem){
						this.loadStaff();
					}
				}
			})
			return new Choice.ListPanel({
						title : getDefaultJsLan('commonGroup'),
						view : view
					})
		},
		OrgTreeWithSearch : function(listView){
			return new Choice.SearchPanel({
				search : new Choice.SearchOrg({
					// 只读无默认：不查询
					disabled : (Choice.params.isReadOnly && !Choice.params.orgId),
					viewConfig : {
						filter : Choice.params.filter
					}
				}),
				view : factory.OrgTree(listView)
			})			
		},
		OrgTreeWithSearchForFav : function(listView,config){
			var viewPanel = factory.OrgAndFavouriteTreePanel(listView,config);
			return new Choice.SearchPanel({
				search : new Choice.SearchOrg({
					// 只读无默认：不查询
					disabled : (Choice.params.isReadOnly && !Choice.params.orgId),
					viewConfig : {
						filter : Choice.params.filter
					}
				}),
				view : viewPanel
			})	
			return viewPanel;
		},
		SelectedStaffListWithSearch : function(config)
		{
			return new Choice.SearchPanel({
				search : new Choice.SearchStaff({
					// 只读无默认：不查询
					disabled : (Choice.params.isReadOnly && !Choice.params.orgId),
					viewConfig : {
						filter : Choice.params.filter
					}
				}),
				view : factory.SelectedStaffList()
			})
		},
		MoveButtonGroup : function(config)
		{
			var moveToSelected = function()
			{
				if (Choice.params.panelType == 'StaffByOrgAndProjuct2' && Ext.getCmp('moveToSelected').disabled == true){
					
				}else{
					var dataConfig = config.selectedView.getView().data[0];
					var itemConfig = config.prepareView.removeSelectedItem();
					config.selectedView.addItems(itemConfig);
					if (!Choice.params.isMultiple && dataConfig)
					{
						config.prepareView.addItem(dataConfig);
					}
				}
			}

			var moveToPrepare = function()
			{
				if (Choice.params.panelType == 'StaffByOrgAndProjuct2' && Ext.getCmp('moveToSelected').disabled == true){
					
				}else{
					var itemConfig = config.selectedView.removeSelectedItem();
					config.prepareView.addItems(itemConfig);
				}
			}

			config.prepareView.getView().on("dblclick", moveToSelected)
			config.selectedView.getView().on("dblclick", moveToPrepare)

			return [{
						text : '>',
						id : 'moveToSelected',
						handler : moveToSelected
					}, {
						text : '<',
						id : 'moveToPrepare',
						handler : moveToPrepare
					}, {
						text : '>>',
						id : 'moveToSelectedAll',
						hidden : !Choice.params.isMultiple,
						handler : function()
						{
							var all = config.prepareView.removeAll();
							config.selectedView.addItems(all);
						}
					}, {
						text : '<<',
						hidden : !Choice.params.isMultiple,
						handler : function()
						{
							var all = config.selectedView.removeAll();
							config.prepareView.addItems(all);
						}
					}]
		},
		StaffByOrgAndProject : function(config)
		{
			var c2 = factory.PrepareStaffList();
			var c1 = factory.OrgProjectGroup(c2);
			var c3 = factory.SelectedStaffListWithSearch();
			return new Choice.ThreeColumnPanel(Ext.apply({
						items : [c1, c2, c3],
						buttons : factory.MoveButtonGroup({
									prepareView : c2,
									selectedView : c3.view
								}),
						returnValue : function()
						{
							var list = c3.view.getView();
							var datas = list.getData();
							var names = [];
							var ids = [];
							var orgIds = [];
							var orgNames = [];
							for (var i = 0, data; data = datas[i]; i++)
							{
								names[i] = data.staff_name;
								ids[i] = data.staff_id;
								orgIds[i]=data.org_id;
								orgNames[i]=data.org_name;
							}
							var value = {
								iniId : ids.join(","),
								id : ids.join(","),
								name : names.join(","),
								orgId:orgIds.join(","),
								orgName:orgNames.join(",")
							};
							return value;
						}
					}, config))
		},
		
		// 左边列表有部门和虚拟小组的人员选择框   add by zhangye
		StaffByOrgAndProjuct2: function(config)
		{			
			var t3 = factory.StaffByOrgAndProject({
						title : getDefaultJsLan('staff'),
						type : "staff"
					});
		    
			var activeTabType = Choice.params.type;
			return new Ext.TabPanel({
						items : [t3],
						returnValue : function()
						{
							var value = this.activeTab.returnValue();
							value.type = this.activeTab.type
							return value;
						},
						listeners : {
							"beforerender" : function()
							{
								var tab;
								this.items.each(function()
										{
											if (this.type == activeTabType)
											{
												tab = this;
											}
										})
								tab = tab || 0;
								this.activeTab = tab;
							}
						}
					});
		},
		
		StaffForItsm : function(config)
		{
			var t1 = new factory.StaffByProjectForItsm({
						title : getDefaultJsLan('projectGroup'),
						type : "project"
					});
			/*
			var t2 = new Choice.OrgPanel({
				title : "部门",
				type : "region",
				returnValue : function()
				{
					var value;
					var regionName = [];
					for (var i = 0, len = this.selected.length; i < len; i++)
					{
						regionName[i] = "'" + this.selected[i] + "'";
					}
					Choice.conn.request({
						params : {
							"tag" : 201,
							"regionName" : regionName.join(",") || "''"
						},
						success : function(oXml)
						{
							var nodes = oXml.selectNodes("/root/rowSet");
							var staffIds = [], staffNames = [];
							for (var i = 0, node; node = nodes[i]; i++)
							{
								staffIds[i] = node.selectSingleNode("STAFF_ID").text;
								staffNames[i] = node
										.selectSingleNode("STAFF_NAME").text;
							}
							value = {
								"regionId" : t2.selected.join(","),
								"id" : staffIds.join(","),
								"name" : staffNames.join(",")
							}
						}
					});
					return value;
				},
				listeners : {
					beforerender : function(p)
					{
						if (Choice.params.regionId)
						{
							p.selected = Choice.params.regionId.split(",");
						}
					}
				}
			});
			*/
			var t3 = factory.StaffByOrgAndProject({
						title : getDefaultJsLan('staff'),
						type : "staff"
					})
			var activeTabType = Choice.params.type;
			return new Ext.TabPanel({
						//items : [t1, t2, t3],
						items : [t1, t3],
						returnValue : function()
						{
							var value = this.activeTab.returnValue();
							value.type = this.activeTab.type;
							return value;
						},
						listeners : {
							"beforerender" : function()
							{
								var tab;
								this.items.each(function()
										{
											if (this.type == activeTabType)
											{
												tab = this;
											}
										})
								tab = tab || 1;
								this.activeTab = tab;
							}
						}
					});
		},
		StaffByProjectForItsm : function(config)
		{
			var panel = new Choice.ProjectPanel(Ext.apply({
				autoScroll : true,
				border : false,
				returnValue : function()
				{
					
					var projectId = this.selected.join(",");
					var proRegArr = new Array();
					var proRegObjArr = new Array();//现项目组区域数组
					if(Choice.params.proRegObjArr){
						var proRegObjArrSou = Choice.params.proRegObjArr;//原项目组区域数组
						var projectObj={//项目组对象
							id : this.selected[k],//项目组ID
							regionIds : "" //项目组区域
						};
						for(var k=0 ; k<this.selected.length; k++){
							var addFlag = true;
							for(var m=0; m<proRegObjArrSou.length; m++){
								if(this.selected[k] == proRegObjArrSou[m].id){//原有项目组添加到项目组区域数组中
									proRegObjArr.push(proRegObjArrSou[m]);
									proRegArr.push(proRegObjArrSou[m].id+"_"+proRegObjArrSou[m].regionIds);////项目组_区域,区域#项目组_区域,区域
									addFlag = false;
									break;
								}
							}
							if(addFlag){//新增加的项目组
								projectObj={
									id : this.selected[k],//项目组ID
									regionIds : "" //项目组区域
								};
								proRegObjArr.push(projectObj);
								proRegArr.push(this.selected[k]);
							}
						}
					}
					
					var value= {
							"projectId"	: "",
							"id" 	: "",
							"name" 	: "",
							"type" 	: "",
							"proRegObjArr" : ""
						};
					if(projectId !=""){
						Choice.conn.request({
							params : {
								tag : 200,
								projectId : projectId,
								proRegArrStr : proRegArr.join("#") //项目组_区域,区域#项目组
							},
							success : function(oXml)
							{
								var nodes = oXml.selectNodes("/root/rowSet");
								var staffIds = [], staffNames = [];
								for (var i = 0, node; node = nodes[i]; i++)
								{
									staffIds[i] = node.selectSingleNode("STAFF_ID").text;
									staffNames[i] = node
											.selectSingleNode("STAFF_NAME").text;
								}
								value = {
									"projectId" : projectId,
									"id" : staffIds.join(","),
									"name" : staffNames.join(","),
									"type" : "project",
									"proRegObjArr" : proRegObjArr
								}
							}
						});
					}
					return value;
				},
				tbar : [{
					text : "<font color='red'>点击项目组名称进行省份过滤</font>"
				}, '->',{
					text : getDefaultJsLan('projectGroupManagement'),
					handler : function()
					{
						window.showModalDialog(
										"../../../../workshop/projectGroup/jtitsm/project_group.jsp",
										[99],
										"dialogWidth=60;dialogHeight=30;help=0;scroll=0;status=0;");
						panel.refreshProject();
					}
				}, {
					text : getDefaultJsLan('setCommonlyUsedGroup'),
					handler : function()
					{
						if (panel.getSelected() == 0)
						{
							Choice.Message.warn(getDefaultJsLan('notSelectedProjectGroup'));
						}
						else
						{
							Choice.ajax.request({
								url : "../../../../servlet/projectGroupServlet?",
								params : {
									tag : 22,
									groupIds : panel.getSelected().join(",")
								},
								success : function(oXml)
								{
									Choice.Message.alert(getDefaultJsLan('setCommonSuccess'));
									panel.refreshFavorite();
								},
								scope : this
							});
						}
					}
				}, {
					text : getDefaultJsLan('removeCommonGroup'),
					handler : function()
					{
						if (panel.getSelected() == 0)
						{
							Choice.Message.warn(getDefaultJsLan('notSelectedProjectGroup'));
						}
						else
						{
							Choice.ajax.request({
								url : "../../../../servlet/projectGroupServlet?",
								params : {
									tag : 23,
									groupIds : panel.getSelected().join(",")
								},
								success : function(oXml)
								{
									Choice.Message.alert(getDefaultJsLan('removeCommonSuccess'));
									panel.refreshFavorite();
								},
								scope : this
							});
						}
					}
				}],
				listeners : {
					beforerender : function(p)
					{
						if (Choice.params.projectId)
						{
							p.selected = Choice.params.projectId.split(",");
						}
					}
				}
			}, config));
			return panel;
		},
		StaffByProject : function(config)
		{
			var iniGroups;
			// 存在送入默认员工但无默认虚拟团队ID的情况，这时候选择后会产生员工id和虚拟团队ID不对应的情况
			// 这时候不返回虚拟团队id，外围自行处理
			var isReturnGroup = true;
			if (Choice.params.iniId)
			{
				if (Choice.params.iniGroup)
				{
					iniGroups = {};
					var gs = Choice.params.iniGroup.split(",");
					var ids = Choice.params.iniId.split(",");
					for (var i = 0, id; id = ids[i]; i++)
					{
						iniGroups[id] = gs[i];
					}
				}
				else
				{
					isReturnGroup = false;
				}
			}
			var c2 = factory.PrepareStaffList();
			var c3 = factory.SelectedStaffList({
						doStaffConfig : function(staffConfig)
						{
							if (iniGroups)
							{
								staffConfig.group_id = iniGroups[staffConfig.staff_id];
							}
							return staffConfig;
						}
					});
			var c1 = factory.ProjectTree(c2, c3);
			return new Choice.ThreeColumnPanel(Ext.apply({
						items : [c1, c2, c3],
						buttons : factory.MoveButtonGroup({
									prepareView : c2,
									selectedView : c3
								}),
						returnValue : function()
						{
							var list = c3.getView();
							var datas = list.getData();
							var names = [];
							var ids = [];
							var groups = [];
							for (var i = 0, data; data = datas[i]; i++)
							{
								names[i] = data.staff_name;
								ids[i] = data.staff_id;
								groups[i] = data.group_id;
							}
							var value = {
								id : ids.join(","),
								name : names.join(","),
								group : groups.join(",")
							}
							if (!isReturnGroup)
							{
								value.group = ""
							}
							return value;
						}
					}, config))
		},
		StaffByOrg : function(config)
		{         
			var c2 = factory.PrepareStaffList();
			var c3 = factory.SelectedStaffList();
			var orgTree = factory.OrgTree(c2);
            var favouriteTree = factory.FavouriteProjectList(c2,c3);//factory.FavouriteTree(c2);
            var projectTree = factory.ProjectTree(c2);
             
            var panelItems = [orgTree,favouriteTree,projectTree];
            var c1= new Ext.TabPanel({
                        defaults : {
                            border : false
                        },
                        activeTab :0,
                        autoScroll : true,
                        items : panelItems,
                        addItem : function(o){
                        	orgTree.addItem(o);
                        },
                        map : {'DEFINE':1,'TEAM':2,"ORG":0},
                        refreshFavorite: function(){
                        	favouriteTree.refreshFavorite();
                        },
                        active : function(type,path){
                        	this.setActiveTab(this.map[type]);
                        	if(this.getActiveTab().tree !=undefined || this.getActiveTab().tree!=null){
                        		this.getActiveTab().loadedSelectedPath = path;
                        		this.getActiveTab().selectItemByPath(path);
                        	}else{
                        		this.getActiveTab().view.selectItemByPath(path)
                        	}
                        	
                        },
                        listeners : {
                        	beforetabchange : function( TabPanel, newTab, currentTab )  {
                        		if(currentTab){
                        			if(currentTab.tree !=undefined || currentTab.tree!=null){
                        				currentTab.tree._oSelectedItem=null;
                        			}else{
                        				currentTab.getView().clearSelections();
                        			}
                        		}
                        	}
                        }
            });
			
			//c3.setRegion('center');
			var button = new Ext.Button({
				region: 'south',
				 height: 30,
				 cls:'saveOpenCss',
			     text:'<div class="btnSaveOpenCss" id="btnSaveOpen">'+getDefaultJsLan('setCommonlyUsedGroup')+'</div>',
			     save : function() {
					favouriteTree.getView().save();
				},
			     listeners :{
			     	click:function(button){
			     		var datas = c3.view.getData();
			     		if(datas.length<=0){
			     			Choice.Message.warn(getDefaultJsLan('pleaseSelectStaff'));
			     			return;
			     		}
			     		document.getElementById("maskDivId").style.display = "block";
			     		document.getElementById("maskDivId").extObject =button;// 投机
			     		document.getElementById("maskDivId").style.top=c3.getPosition()[1]
			     		document.getElementById("maskDivId").style.left=c3.getPosition()[0]
			     		document.getElementById("maskDivId").style.width = c3.getWidth() ;
			     		document.getElementById("maskDivId").style.height = c3.getHeight() ;
			     	}
			     }
			})
			
			var p= new Ext.Panel({
				    layout: 'border',
				    border :false,
				    margins : '0 0 2 0',
				    items: [c3,button]
				});
				
			
			var c4= new Choice.ThreeColumnPanel(Ext.apply({
						items : [c1, c2, p],
						region: 'center',
						buttons : factory.MoveButtonGroup({
									prepareView : c2,
									selectedView : c3
								}),
						returnValue : function()
						{
							var list = c3;
							var datas = list.view.getData();
							var names = [];
							var ids = [];
							var groups = [];
							for (var i = 0, data; data = datas[i]; i++)
							{
								names[i] = data.staff_name;
								ids[i] = data.staff_id;
								groups[i] = data.org_id;
							}
							var value = {
								id : ids.join(","),
								iniId : ids.join(","),
								name : names.join(","),
								group : groups.join(",")
							}
							return value;
						}
					}, config));
					
			var c5 = new Choice.SearchAll({
						// 只读无默认：不查询
						disabled : (Choice.params.isReadOnly && !Choice.params.orgId),
						region : 'north',
						margins : '5 0 5 5',
						width : 50,
						orgTree : orgTree,						
						height : 25,
						viewConfig : {
							filter : Choice.params.filter
						}
					});
			c5.on("select", function(o){				
				if(o.type=='STAFF'){
					c3.addItem(o);
					c3.setTip([o]);
				}else if(o.type=='ORG'){
					c1.active(o.type,o.org_id.split(',').reverse().join('/'));					
				}else if(o.type=='TEAM' || o.type=='DEFINE' ){
					c1.active(o.type,o.project_id.split(',').reverse().join('/'));
				}
				
		
			}, this);	
					
			return new Ext.Panel({
				    layout: 'border',
				    border :false,
				    items: [c4,c5],
				    returnValue : function(){
				    	return c4.returnValue();
				    }
				});
			
			
			
			
			//var isShowFav = "0"; //判断是否显示常用小组，1显示，0不显示
			//var selTip = "";//搜索提示内容
			//var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
			/*var sendParams = ["OperType=5","varName=FLOW_IS_SHOW_FAV_GROUP"];
			var sendUrl = "../../../../servlet/util?OperType=5&varName=FLOW_IS_SHOW_FAV_GROUP";
			sendRequest.open("post", sendUrl, false);
			sendRequest.send();
			if (isSuccess(sendRequest))
			{
				var oXml = sendRequest.responseXml;
				var valueNodes = oXml.selectNodes('/root/value');
				isShowFav = valueNodes[0].text;
			}*/
			
			/*sendUrl = "../../../../servlet/util?OperType=5&varName=STAFF_SEL_TIP";
			sendRequest.open("post", sendUrl, false);
			sendRequest.send();
			if (isSuccess(sendRequest))
			{
				var oXml = sendRequest.responseXml;
				var valueNodes = oXml.selectNodes('/root/value');
				if(valueNodes[0].text && valueNodes[0].text != "null"){
					// selTip = valueNodes[0].xml;
					// servlet/util?OperType=5 已经加上<![CDATA[]]>, .xml会造成数据解析不正确, 用text即可
					selTip = valueNodes[0].text;
				}
			}
            var t3 = factory.StaffByOrgAndFavouriteColumnPanel({
                title : getDefaultJsLan('staff'),
                type : "staff",
                isShowFav : isShowFav
            });
            
		    /*var t1 = new factory.StaffByProjectForFavo({
		                title : getDefaultJsLan('commonGroupConfiguration'),
		                type : "project"
		            },t3);*/
		    
		    /*var tabPanelItems = null;
		    if(isShowFav=="1")
		    	tabPanelItems = [t1,t3];
		    else
		    	tabPanelItems = [t3];
		              
		    if(Choice.params.type == undefined){
		        Choice.params.type = 'staff'; 
		    }
		    
//		    var activeTabType = Choice.params.type;
		    var activeTabType = "staff";
		    return t3;*/
		    /*return new Ext.TabPanel({
		                html : selTip,
		                items : tabPanelItems,
		                returnValue : function()
		                {
		                    var value = this.activeTab.returnValue();
		                    value.type = this.activeTab.type
		                    return value;
		                },
		                listeners : {
		                    "beforerender" : function()
		                    {
		                        var tab;
		                        this.items.each(function()
		                                {
		                                    if (this.type == activeTabType)
		                                    {
		                                        tab = this;
		                                    }
		                                })
		                        tab = tab || 1;
		                        this.activeTab = tab;
		                    },
		                    "tabchange" : function(tpanel,tab) {
		                    	if(document.getElementById("sel_tip_#")){
		                    		document.getElementById("sel_tip_#").style.display = "none";//搜索提示
		                    	}
		                    	if(tab.type=="staff"){
		                    		Ext.getCmp("btnConfirm").enable();
		                    		if(document.getElementById("sel_tip_#")){
			                    		document.getElementById("sel_tip_#").style.display = "block";
			                    	}
		                    	}
		                    	else if(tab.type=="project"){
		                    		Ext.getCmp("btnConfirm").disable();
		                    	}
		                    	else{
		                    		Ext.getCmp("btnConfirm").enable();
		                    	}
		                    }
		                }
		            });*/
		    
		},
		StaffForFavo : function(config)
        {
            var t3 = factory.StaffByOrgAndProjectAndFavourite({
                        title : getDefaultJsLan('staff'),
                        type : "staff"
                    });
                    
            var t1 = new factory.StaffByProjectForFavo({
                        title : getDefaultJsLan('commonGroupConfiguration'),
                        type : "project"
                    },t3);
                      

            if(Choice.params.type == undefined){
                Choice.params.type = 'staff'; 
            }
            var activeTabType = Choice.params.type;
            return new Ext.TabPanel({
//                        items : [t1, t2, t3],
                        items : [t1,t3],
                        returnValue : function()
                        {
                            var value = this.activeTab.returnValue();
                            value.type = this.activeTab.type
                            return value;
                        },
                        listeners : {
                            "beforerender" : function()
                            {
                                var tab;
                                this.items.each(function()
                                        {
                                            if (this.type == activeTabType)
                                            {
                                                tab = this;
                                            }
                                        })
                                tab = tab || 1;
                                this.activeTab = tab;
                            }
                        }
                    });
        },
        StaffByOrgAndProjectAndFavourite : function(config)
        {
            var c2 = factory.PrepareStaffList();
            var c1 = factory.OrgProjectGroupFavourite(c2);
            var c3 = factory.SelectedStaffListWithSearch();
            return new Choice.ThreeColumnPanel(Ext.apply({
                        items : [c1, c2, c3],
                        buttons : factory.MoveButtonGroup({
                                    prepareView : c2,
                                    selectedView : c3.view
                                }),
                        returnValue : function()
                        {
                            var list = c3.view.getView();
                            var datas = list.getData();
                            var names = [];
                            var ids = [];
                            for (var i = 0, data; data = datas[i]; i++)
                            {
                                names[i] = data.staff_name;
                                ids[i] = data.staff_id;
                            }
                            var value = {
                                iniId : ids.join(","),
                                id : ids.join(","),
                                name : names.join(",")
                            }
                            return value;
                        }
                    }, config))
        },
        StaffByOrgAndFavouriteColumnPanel : function(config)
        {
            var c2 = factory.PrepareStaffList();
            var c1 = factory.OrgTreeWithSearchForFav(c2,config);
            var c3 = factory.SelectedStaffListWithSearch();
            return new Choice.ThreeColumnPanel(Ext.apply({
                        items : [c1, c2, c3],
                        buttons : factory.MoveButtonGroup({
                                    prepareView : c2,
                                    selectedView : c3.view
                                }),
                        returnValue : function()
                        {
                            var list = c3.view.getView();
                            var datas = list.getData();
                            var names = [];
                            var ids = [];
                            var groups = [];
                            for (var i = 0, data; data = datas[i]; i++)
                            {
                                names[i] = data.staff_name;
                                ids[i] = data.staff_id;
                                groups[i] = data.org_id;
                            }
                            var value = {
                                iniId : ids.join(","),
                                id : ids.join(","),
                                name : names.join(","),
                                group : groups.join(",")
                            }
                            return value;
                        }
                    }, config))
        },
        OrgProjectGroupFavourite : function(listView)
        {
            var orgTree = this.OrgTree(listView);
            var projectTree = this.ProjectTree(listView);
            var favouriteTree = this.FavouriteTree(listView);
            return new Ext.Panel({
                        layout : 'accordion',
                        defaults : {
                            border : false
                        },
                        autoScroll : true,
                        items : [orgTree, projectTree,favouriteTree]
                    })
        },
        //部门树和常用小组，树面板
        OrgAndFavouriteTreePanel : function(listView,config)
        {
           var orgTree = this.OrgTree(listView);
            orgTree.autoHeight = true;
            var favouriteTree = this.FavouriteTree(listView);
            var panelItems = null;
            var isShowFav = "1";
            if(config &&  config.isShowFav=="0")
            	isShowFav = "0";
            if(isShowFav=="1")
            	panelItems = [orgTree,favouriteTree];
            else
            	panelItems = [orgTree];
            return new Ext.Panel({
                        layout : 'accordion',
                        defaults : {
                            border : false
                        },
                        autoScroll : true,
                        items : panelItems,
                        addItem : function(o){
                        	orgTree.addItem(o);
                        },
                        refreshFavorite: function(){
                        	favouriteTree.refreshFavorite();
                        }
                    })
        },
        FavouriteTree : function(listView, selectedView)
        {
            var selectedValue = Choice.params.projectId;
            return new Choice.TreePanel({
                title : getDefaultJsLan('commonGroup'),
                disabled : Choice.params.isReadOnly,
                treeConfig : {
                    xmlUrl : '../../../../servlet/staffmenu?action=107'
                },
                refreshFavorite : function(){
                    this.tree.refresh();
                },
                listeners : {
                    "click" : function(oItem)
                    {
                        Choice.conn.request({
                            params : {
                                tag : 64,
                                id : oItem.id,
                                filterStaffWhere : Choice.params.filterStaffWhere
                            },
                            success : function(oXml)
                            {
                                var staffNodes = oXml
                                        .selectNodes('/root/rowSet');
                                var staffConfigs = []
                                for (var i = 0, staffNode; staffNode = staffNodes[i]; i++)
                                {
                                    staffConfigs[i] = Choice.xmlNodeToObj({},
                                            staffNode);
                                }
                                // 初始化的时候可能存在view还未rendered
                                if (listView.rendered)
                                {
                                    listView.setItems(staffConfigs);
                                    listView.setTip(staffConfigs);
                                }
                                else
                                {
                                    listView.on("afterrender", function()
                                            {
                                                listView.setItems(staffConfigs);
                                                listView.setTip(staffConfigs);
                                            })
                                }
                                if (oItem.id != selectedValue
                                        && selectedView
                                        && Choice.params.aRootOrgParam
                                        && Choice.params.aRootOrgParam.toSelected)
                                {
                                    selectedView.setItems(staffConfigs);
                                }
                                selectedValue = oItem.id;
                            }
                        });
                    },
                    "load" : function(tree)
                    {
                        if (Choice.params.projectId)
                        {
                            tree.gotoItem(Choice.params.projectId, true);
                        }
                    },
                    "pretreatment" : function(oXml)
                    {
                        /*if (Choice.params.isSetRoot && Choice.params.projectId)
                        {
                            var menuRoot = oXml.selectSingleNode('/root/Menu');
                            menuRoot.appendChild(oXml
                                    .selectSingleNode('//MenuItem[@id='
                                            + Choice.params.projectId + ']'));
                            oXml.selectNodes("/root/Menu/MenuItem[@id!="
                                    + Choice.params.projectId + "]")
                                    .removeAll();
                        }*/
                    	
                    	if (Choice.params.action)
						{
							Choice.params.action.pretreatment(oXml);
						}
                    }
                }
            })
        },
        StaffByProjectForFavo : function(config,staffListView)
        {       
            var panel = new Choice.FavouriteProjectPanel(Ext.apply({
                autoScroll : true,
                border : false,
                returnValue : function()
                {
                    var projectId = this.selected.join(",");
                    var value;
                    Choice.conn.request({
                        params : {
                            tag : 200,
                            projectId : projectId
                        },
                        success : function(oXml)
                        {
                            var nodes = oXml.selectNodes("/root/rowSet");
                            var staffIds = [], staffNames = [];
                            for (var i = 0, node; node = nodes[i]; i++)
                            {
                                staffIds[i] = node.selectSingleNode("STAFF_ID").text;
                                staffNames[i] = node
                                        .selectSingleNode("STAFF_NAME").text;
                            }
                            value = {
                                "projectId" : projectId,
                                "id" : staffIds.join(","),
                                "name" : staffNames.join(","),
                                "type" : "project"
                            }
                        }
                    });
                    return value;
                },
                tbar : ['->','小组名称：', {
                    xtype     : "textfield",
                    id        : "addProjectTextId",
                    emptyText : getDefaultJsLan('groupName'),
                    style     : "color:black;background-color:white;border:1px solid #a0a0a0;",
                    width     : 150  
                },{
                    text : getDefaultJsLan('addToGroup'),
                    handler : function()
                    {
                        //判断是否输入小组名称
                        var in_projectName = panel.getTopToolbar().items.get("addProjectTextId").getValue();
                        if(in_projectName == ''){
                            Choice.Message.warn(getDefaultJsLan('pleaseEnterGroupName'));
                            return;
                        }
                        
                        //判断是否有选择人员
                        var list = staffListView.items[2].view.getView();
                        var datas = list.getData();
                        var names = [];
                        var ids = [];
                        var groups = [];
                        for (var i = 0, data; data = datas[i]; i++)
                        {
                                names[i] = data.staff_name;
                                ids[i] = data.staff_id;
                                groups[i] = data.group_id;
                        }
                        var value = {
                                id : ids.join(","),
                                name : names.join(",")
                        }
                        if(value.id == ''){
                            Choice.Message.warn(getDefaultJsLan('pleaseSelectStaff'));
                            return;
                        }
                        
                        //添加人员
                        Choice.ajax.request({
                                url : "../../../../servlet/projectGroupServlet?",
                                params : {
                                    tag : 151,
                                    projectName : in_projectName,
                                    staffIds    : value.id
                                },
                                success : function(oXml)
                                {
                                    Choice.Message.alert(getDefaultJsLan('addCustomGroupSuccess'));
                                    //刷新常用小组
                                    panel.refreshFavorite();
                                    staffListView.items[0].view.refreshFavorite();  
                                    panel.getTopToolbar().items.get("addProjectTextId").setValue("");                                 
                                },
                                scope : this
                        });                  
                    }
                },{
                	text:getDefaultJsLan('editGroupStaff'),
                	handler : function()
                	{
                        if (panel.getSelected() == 0)
                        {
                            Choice.Message.warn(getDefaultJsLan('notSelectedProjectGroup'));
                            return;
                        }
                        if (panel.getSelected().length > 1)
                        {
                            Choice.Message.warn(getDefaultJsLan('onlyEditOneGroup'));
                            return;
                        }
                        var groupId = panel.getSelected()[0];
                        var paramArray = null;
                        var dialogsFeatures = "dialogWidth=600px;dialogHeight=480px;help=0;scroll=1;status=0;"
                        var returnVal = window.showModalDialog("/workshop/query/favGroupEdit.html?result=100009001&GROUP_ID="+groupId,
                        		paramArray, dialogsFeatures);
                	}
                }, {
                    text : getDefaultJsLan('removeGroup'),
                    handler : function()
                    {
                        if (panel.getSelected() == 0)
                        {
                            Choice.Message.warn(getDefaultJsLan('notSelectedProjectGroup'));
                        }
                        else
                        {
                            Choice.ajax.request({
                                url : "../../../../servlet/projectGroupServlet?",
                                params : {
                                    tag : 152,
                                    groupIds : panel.getSelected().join(",")
                                },
                                success : function(oXml)
                                {
                                    Choice.Message.alert(getDefaultJsLan('removeCustomGroupSuccess'));
                                    panel.refreshFavorite();
                                    staffListView.items[0].view.refreshFavorite(); 
                                    panel.selected=[];
                                },
                                scope : this
                            });
                        }
                    }
                }],
                listeners : {
                    beforerender : function(p)
                    {
                        if (Choice.params.projectId)
                        {
                            p.selected = Choice.params.projectId.split(",");
                        }
                    }
                }
            }, config));
            return panel;
        }
	}

	return {
		newPanel : function(type, config)
		{
			return new factory[type](config);
		}
	}
})();

function iniPage()
{
	Ext.onReady(iniExt);
	document.getElementById("maskDivName").innerText=(getDefaultJsLan('setEnterGroupName'));
}

function initAjax()
{
	Ext.QuickTips.init();
	Ext.QuickTips.getQuickTip().dismissDelay = 600000;
	
	Choice.params = Ext.applyIf(window.dialogArguments || {}, {
				panelType : "StaffForItsm",
				isMultiple : true,
				isReadOnly : false,
				isSetRoot : false
			});
//	Choice.params.panelType = "StaffForFavo";
	Choice.Message.init();
	Choice.ajax = new Ext.data.Connection({
				url : "../../../../servlet/staff_manage",
				autoAbort : false,
				method : 'POST',
				timeout : null,
				listeners : {
					requestexception : function()
					{
						Choice.Message.error(getDefaultJsLan('requestSendError'));
					},
					requestcomplete : function(self, response, options)
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
								Choice.Message.error(errNode.nextSibling.text);
							}
						}
						else
						{
							Choice.Message.error(getDefaultJsLan('xmlError'));
						}
						options.success = null;
					}
				}
			});
    Choice.ajaxStaffMenu = new Ext.data.Connection({
				url : "../../../../servlet/staffmenu",
				autoAbort : false,
				method : 'POST',
				timeout : null,
				listeners : {
					requestexception : function()
					{
						Choice.Message.error(getDefaultJsLan('requestSendError'));
					},
					requestcomplete : function(self, response, options)
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
								Choice.Message.error(errNode.nextSibling.text);
							}
						}
						else
						{
							Choice.Message.error(getDefaultJsLan('xmlError'));
						}
						options.success = null;
					}
				}
			});

	Choice.conn = new Choice.Connection({
				url : "../../../../servlet/staff_manage"
			});

	Choice.loadMask = new Ext.LoadMask(Ext.getBody(), {
				msg : getDefaultJsLan('loadingDataPleaseWait')
			});
}

function iniExt()
{
	initAjax();
	var mainPanel = Choice.Factory.newPanel(Choice.params.panelType);
    
	new Ext.Viewport({
				layout : "fit",
				defaults : {
					border : false
				},
				items : {
					buttonAlign : "center",
					layout : "fit",
					items : mainPanel,
					autoScroll : true,
					buttons : [ new Ext.form.Radio({
						          boxLabel : getDefaultJsLan('groupedOrganization'),
						          name : "dispatchType",
						          id : "dispatchType2",
						          checked : true,
						          inputValue : "2",
						          listeners : {
					        					'check' : function(){
					        						if(this.checked){
					        							Ext.getCmp('moveToSelected').setVisible(false);
					        							Ext.getCmp('moveToPrepare').setVisible(false);
					        							Ext.getCmp('moveToSelected').setDisabled(true);
														Ext.getCmp('moveToPrepare').setDisabled(true);
					        						}
					        					}
											 }
						        }),
						        new Ext.form.Radio({
						          boxLabel : getDefaultJsLan('groupedStaff'),
						          name : "dispatchType",
						          id : "dispatchType",
						          inputValue : "1",
						          listeners : {
					        					'check' : function(){
					        						if(this.checked){
					        							Ext.getCmp('moveToSelected').setVisible(true);
					        							Ext.getCmp('moveToPrepare').setVisible(true);
					        							Ext.getCmp('moveToSelected').setDisabled(false);
														Ext.getCmp('moveToPrepare').setDisabled(false);
					        						}
					        					}
											 }
						        }),{
									text : getDefaultJsLan('confirmation'),
									id : 'btnConfirm',
									scope : this,
									handler : function()
									{
										var value = mainPanel.returnValue();
										if (value)
										{
											if (Ext.getCmp('dispatchType').getValue()){
												value.returnType = 1;
											}else{
												value.returnType = 2;
											}
											window.returnValue = value;
											window.close();
										}
									}
								}, {
									text : getDefaultJsLan('cancel'),
									handler : function()
									{
										// window.returnValue = null;
										window.close();
									}
								}]
				}
			})
			if (Choice.params.panelType == 'StaffByOrgAndProjuct2'){
				Ext.getCmp('dispatchType').setVisible(true);
				Ext.getCmp('dispatchType2').setVisible(true);
				Ext.getCmp('dispatchType').setDisabled(true);
				Ext.getCmp('moveToSelected').setVisible(true);
				Ext.getCmp('moveToPrepare').setVisible(true);
				Ext.getCmp('moveToSelected').setDisabled(false);
				Ext.getCmp('moveToPrepare').setDisabled(false);
			}else{
				Ext.getCmp('dispatchType').setVisible(false);
				Ext.getCmp('dispatchType2').setVisible(false);
			}
}

//点击项目组名称，打开省份选择，返回该项目组的所选省份的组员：
function selectGroupStaffReturn(projectId,checkBoxId){
	projectId = projectId+"";
	var proRegObjArrSou = new Array();
	var proRegObjArr = new Array();//现项目组区域数组
	var proRegArr = new Array();
	var regionIds = "";//区域选择页面返回的区域ID
	var projectIds = Choice.params.projectId;//目前选中的项目组ID
	var delFlag = false;
	var checkFlag = document.getElementById(checkBoxId).checked;
	if(Choice.params.proRegObjArr){
		proRegObjArrSou = Choice.params.proRegObjArr;//原项目组区域数组
		var projectObj={//项目组对象
			id : "",//项目组ID
			regionIds : "" //项目组区域
		};
		
		for(var m=0; m<proRegObjArrSou.length; m++){
			if(projectId == proRegObjArrSou[m].id){//原有项目组添加到项目组区域数组中
				regionIds = proRegObjArrSou[m].regionIds;
				proRegObjArrSou.splice(m,1);//去掉项目组
				delFlag = true;
				continue;//不插入中间数组
			}
			proRegArr.push(proRegObjArrSou[m].id+"_"+proRegObjArrSou[m].regionIds);////项目组_区域,区域#项目组_区域,区域
		}
	}
	var isSel = 0;
	if(document.getElementById(checkBoxId).checked){
		isSel = 1;
	}
	
	var oRet = window.showModalDialog('selectGroupStaff.html?id='+projectId+"&regionIds="+regionIds+"&isSel="+isSel,'',
		'dialogWidth=33;dialogHeight=16;help=0;scroll=0;status=0;');

	if(oRet!=undefined && oRet.FLAG){
		regionIds = oRet.REGION_ID;
		if(regionIds){//插入项目组
			projectObj={//项目组对象
				id : projectId,//项目组ID
				regionIds : regionIds //项目组区域
			};
			proRegObjArrSou.push(projectObj);
			proRegArr.push(projectId+"_"+regionIds);////项目组_区域,区域#项目组_区域,区域
			Choice.params.proRegObjArr = proRegObjArrSou;
			checkFlag = true;
		}else{
			var projectArr = new Array();
			if(projectIds){
				projectArr = projectIds.split(",");
				//项目组数组中踢除选中的组
				for(var m=0; m<projectArr.length; m++){
					if(projectId == projectArr[m]){//原有项目组添加到项目组区域数组中
						projectArr.splice(m,1);//去掉项目组
						break;
					}
				}
			}
			projectIds = projectArr.join(",");//生成新项目组字符串
			checkFlag = false;
		}
	}else{
		if(delFlag){
			projectObj={//项目组对象
				id : projectId,//项目组ID
				regionIds : regionIds //项目组区域
			};
			proRegObjArrSou.push(projectObj);
		}
	}
	Choice.params.proRegObjArr = proRegObjArrSou;
	Choice.params.projectId = projectIds;
	document.getElementById(checkBoxId).checked = !checkFlag;
	
}

Choice.FavouriteProjectPanel = Ext.extend(Ext.Panel, {
    initComponent : function()
    {
        Choice.FavouriteProjectPanel.superclass.initComponent.call(this);

        this.titleTemplate = new Ext.Template(
                '<div class="choice-project-title" id="group-{groupId}">',
                '<span class="choice-project-title-ico {icon}"></span>',
                '<span class="choice-project-title-text">{title}</span>',
                '</div><div class="choice-project-body" id="group-{groupId}-body"></div>');
        this.titleTemplate.compile();

        this.bodyTemplate = new Ext.Template(
                '<table cellSpacing=0 cellPadding=0 border=0>',
                '<tr><td width="150px"></td><td width="150px"></td><td width="150px"></td><td width="150px"></td><td width="150px"></td></tr>',
                '{body}</table>');
        this.bodyTemplate.compile();

        this.trTemplate = new Ext.Template('<tr height=26>{td}</tr>');
        this.trTemplate.compile();

        this.tdTemplate = new Ext.Template(
                '<td><INPUT TYPE="checkbox" {checked} id="check-{bpr_line_cfg_id}-{id}" name="check-{id}" projectId="{id}" groupId="{bpr_line_cfg_id}">',
                '<LABEL for="check-{bpr_line_cfg_id}-{id}" class="choice-check-text">{name}</label></td>');
        this.tdTemplate.compile();
        this.selected = [];
    },
    getSelected : function()
    {
        return this.selected;
    },
    onBodyClick : function(e)
    {
        var srcDom = e.getTarget();
        if (srcDom.type == "checkbox")
        {
            this.onCheck(srcDom);
        }
    },
    onCheck : function(oCheck)
    {
        var id = oCheck.projectId;
        var smallChecks = document.getElementsByName("check-" + id);
        for (var i = 0, c; c = smallChecks[i]; i++)
        {
            c.checked = oCheck.checked;
        }
        var index = this.selected.indexOf(id);
        if (oCheck.checked)
        {
            if (index == -1)
            {
                this.selected.push(id);
            }
        }
        else
        {
            this.selected.splice(index, 1);
        }
    },
    onRender : function(ct, position)
    {
        Choice.ProjectPanel.superclass.onRender.call(this, ct, position);
        this.body.insertHtml('beforeEnd', this.titleTemplate.apply({
                            title : getDefaultJsLan('commonGroup'),
                            icon : "choice-project-favorite-ico",
                            groupId : "favorite"
                        }));
        this.body.on("click", this.onBodyClick, this);
        Choice.ajax.request({
                    params : {
                        tag : 46
                    },
                    success : function(oXml)
                    {
                        var pgNodes = oXml.selectNodes('/root/rowSet');
                        var sHtml = "";                       
                        var oEl = this.body.dom.all("group-favorite-body");
                        oEl.insertAdjacentHTML('afterEnd', sHtml);
                        //this.refreshProject();
                        this.refreshFavorite();
                    },
                    scope : this
                });
    },
    maxProjectEachRow : 5,
    createProjectConfig : function(node)
    {
        var config = Choice.xmlNodeToObj({}, node);
        if (this.selected.indexOf(config.id) != -1)
        {
            config.checked = "checked";
        }
        return config;
    },
    createProjectRowHtml : function(projectConfigs)
    {
        var sHtml = "";
        for (var i = 0, config; config = projectConfigs[i]; i++)
        {
            sHtml += this.tdTemplate.apply(config);
        }
        return this.trTemplate.apply({
                    td : sHtml
                });
    },
    refreshFavorite : function()
    {
        var itemConfigs = [], bodyHtml = "", groupId;
        Choice.ajax.request({
                    url : "../../../../servlet/projectGroupServlet?tag=45",
                    success : function(oXml)
                    {
                        var projectNodes = oXml.selectNodes('/root/rowSet');
                        var groupBody = document
                                .getElementById("group-favorite-body");
                        for (var i = 0, node; node = projectNodes[i]; i++)
                        {
                            itemConfigs.push(this.createProjectConfig(node));
                            if (itemConfigs.length == this.maxProjectEachRow)
                            {
                                bodyHtml += this
                                        .createProjectRowHtml(itemConfigs);
                                itemConfigs = [];
                            }
                        }
                        if (itemConfigs.length != 0)
                        {
                            bodyHtml += this.createProjectRowHtml(itemConfigs);
                        }
                        groupBody.innerHTML = this.bodyTemplate.apply({
                                    body : bodyHtml
                                });
                    },
                    scope : this
                });
    },
    refreshProject : function()
    {
        var projectGroup = {}, groupId, groupConfig, groupBody;
        Choice.ajax.request({
                    url : "../../../../servlet/projectGroupServlet?tag=44",
                    success : function(oXml)
                    {
                        
                    },
                    scope : this
                });
    }
});
