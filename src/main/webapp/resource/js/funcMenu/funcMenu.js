FuncMenu = (function()
{
	var ACTION = getRealPath("../../../servlet/FuncMenuAction?", "funcMenu.js");
	var DEFAULT_PROPERTY_ID = "$DEFAULT";

	function cancelRequest(_xmlRequest)
	{
		_xmlRequest.abort();
		_xmlRequest = null;
	}

	function autoShowRightMenu(sId)
	{
		var oRightMenu = document.getElementById(sId);
		if (oRightMenu.readyState == "complete")
		{
			oRightMenu.funcMenuObj.executeRule();
			oRightMenu.show(null, null, oRightMenu.iX, oRightMenu.iY);
		}
	}

	var Class = function()
	{
		this.menuId;
		this.dhtmlId;
		this.menuObj;
		this.menuType;
		this.propertys = [];
		this.menuRoot;
		this.docRule;
		this.setDisabledList = [];
		this.setEnabledList = [];
		this.isAutoShowRight = true;
		this.getMenuDataFunc = "propertys";
		// 存储菜单项 {ITEM_NAME: ID} 的信息
		this.menuItemIdInfo = {};
	}
	Class.prototype = {
		getItemId			: function(sId)
		{
			return this.dhtmlId + sId;
		},
		setProperty			: function(sName, sValue)
		{
			var oProperty = {
				type	: sName,
				value	: sValue || DEFAULT_PROPERTY_ID
			};
			this.propertys.push(oProperty);
		},
		getSendDoc			: function()
		{
			var sendDoc = new ActiveXObject("Microsoft.XMLDOM");
			var root = sendDoc.createElement("root");
			sendDoc.appendChild(root);
			var menuTypeNode = sendDoc.createElement("menu_type");
			root.appendChild(menuTypeNode);
			menuTypeNode.text = this.menuType;
			var menuPropertyRoot = sendDoc.createElement("menu_property");
			root.appendChild(menuPropertyRoot);
			for (var i = 0; i < this.propertys.length; i++)
			{
				var oProperty = this.propertys[i];
				var menuPropertyNode = sendDoc.createElement("property");
				menuPropertyRoot.appendChild(menuPropertyNode);
				menuPropertyNode.setAttribute("type", oProperty.type);
				if (oProperty.value)
				{
					menuPropertyNode.text = oProperty.value;
				}
			}
			return sendDoc;
		},
		revertRule			: function()
		{
			this.setBarRule(this.setDisabledList, this.setEnabledList);
			this.setDisabledList = new Array();
			this.setEnabledList = new Array();
		},
		executeRule			: function()
		{
			if (this.menuType == "barMenu")
			{
				this.revertRule();
			}
			var ruleList = this.docRule.selectNodes('/root/rowSet');
			var isResult = true;
			for (var i = 0; i < ruleList.length && isResult; i++)
			{
				isResult = this.executeRuleItem(ruleList[i])
			}
		},
		executeRuleItem		: function(oRuleNode)
		{
			var sRule = eval(oRuleNode.selectSingleNode('FUNC_MENU_RULE').text);
			var enabledList = oRuleNode.selectSingleNode('ENABLED_MENU_ITEM').text
					.split(",");
			var disabledList = oRuleNode.selectSingleNode('DISABLED_MENU_ITEM').text
					.split(",");
			var isBreak = (oRuleNode.selectSingleNode('IS_BREAK').text == '0BT');
			if (sRule)
			{
				if (this.menuType == "barMenu")
				{
					this.setBarRule(enabledList, disabledList);
					this.setEnabledList = this.setEnabledList
							.concat(enabledList);
					this.setDisabledList = this.setDisabledList
							.concat(disabledList);
				}
				else
				{
					this.setRightRule(enabledList, disabledList);
				}
			}
			return !(isBreak && sRule);
		},
		setRightRule		: function(enabledList, disabledList)
		{
			for (var i = 0; i < enabledList.length; i++)
			{
				this.menuObj.setItemAttValue(this.getItemId(enabledList[i]),
						"disable", "false");
			}
			for (var i = 0; i < disabledList.length; i++)
			{
				this.menuObj.setItemDisable(this.getItemId(disabledList[i]));
			}
		},
		setBarRule			: function(enabledList, disabledList)
		{
			var sDisabledType = this.menuRoot.getAttribute("disabledType");
			for (var i = 0; i < enabledList.length; i++)
			{
				if(sDisabledType==="hidden")
				{
					this.menuObj.setItemHidden(this.getItemId(enabledList[i]),
							false);
				}
				else
				{
					this.menuObj.setItemDisabled(this.getItemId(enabledList[i]),
						false);
				}
			}
			for (var i = 0; i < disabledList.length; i++)
			{
				if(sDisabledType==="hidden")
				{
					this.menuObj.setItemHidden(this.getItemId(disabledList[i]),
							true);
				}
				else
				{
					this.menuObj.setItemDisabled(this.getItemId(disabledList[i]),
						true);
				}
			}
		},
		buildByPropertys	: function()
		{
			var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
			var sendDoc = this.getSendDoc();
			var sendParams = new Array("action=0");
			var sendUrl = getSendUrl(ACTION, sendParams);
			xmlRequest.open("post", sendUrl, "false");
			xmlRequest.send(sendDoc);
			return xmlRequest;
		},
		buildByMenuId		: function()
		{
			var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
			var sendParams = ["action=3", "menuId=" + this.menuId];
			var sendUrl = getSendUrl(ACTION, sendParams);
			xmlRequest.open("post", sendUrl, "false");
			xmlRequest.send();
			return xmlRequest;
		},
		buildMenuData		: function()
		{
			var doc = getXmlFromHtmlData(this.menuId+"#menuData");
			if(!doc)
			{
				var fn = MENU_DATA_FUNC[this.getMenuDataFunc];
				var xmlRequest = fn.apply(this);
				if (isSuccess(xmlRequest))
				{
					doc = new ActiveXObject("Microsoft.XMLDOM");
					doc.async = false;
					doc.load(xmlRequest.responseXML);
				}
				cancelRequest(xmlRequest);
			}
			if(doc)
			{
				var jsAttr = doc.selectSingleNode('/root/Menu/@JsPath');
				if (jsAttr)
				{
					var jsPaths = jsAttr.text.split(",");
					for (var i = 0, js; js = jsPaths[i]; i++)
					{
						$import(js);
					}
				}
			}
			return doc;
		},
		build				: function()
		{
			if (this.menuObj)
			{
				this.menuObj.removeNode(true);
			}
			var menuDoc = this.buildMenuData();
			if (menuDoc)
			{
				this.menuRoot = menuDoc.selectSingleNode('/root/Menu');
				this.menuId = this.menuRoot.getAttribute("MenuId");
				var sDhtmlId = this.menuRoot.getAttribute("dhtmlId");
				this.dhtmlId = (sDhtmlId) ? sDhtmlId : document.uniqueID;
				var sSelectType = this.menuRoot.getAttribute("SelectType");
				var sOtherAttrs = this.menuRoot.getAttribute("OtherAttrs");
				var sWith = this.menuRoot.getAttribute("Width");
				var sElementTagName = (this.menuType == "barMenu")
						? "bar"
						: "PopupMenu";
				var sHtml = '<IE:' + sElementTagName + ' id="' + this.dhtmlId
						+ '"' + ' selectType="' + sSelectType + '"';
				if (sOtherAttrs)
				{
					sHtml += ' ' + sOtherAttrs;
				}
				if (sWith)
				{
					sHtml += ' width="' + sWith + '"';
				}
				sHtml += '>' + this.parseXml(this.menuRoot) + '</IE:'
						+ sElementTagName + '>';
				document.body.insertAdjacentHTML('afterBegin', sHtml);
				this.menuObj = document.getElementById(this.dhtmlId);
				this.buildRule();
				if (this.menuType == "barMenu")
				{
					this.executeRule();
				}
				else if (this.isAutoShowRight)
				{
					this.menuObj.iX = event.screenX + 1;
					this.menuObj.iY = event.screenY + 1
					this.menuObj.funcMenuObj = this;
					var fn = (function(sid)
					{
						return function()
						{
							autoShowRightMenu.call(window, sid)
						};
					})(this.dhtmlId)
					window.setTimeout(fn, 500);
				}
			}
		},
		buildRule			: function()
		{
			this.docRule = getXmlFromHtmlData(this.menuId+"#menuRule");
			if(!this.docRule)
			{
				var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
				var sendParams = new Array("action=1", "menuId=" + this.menuId);
				var sendUrl = getSendUrl(ACTION, sendParams);
				xmlRequest.open("post", sendUrl, "false");
				xmlRequest.send();
				if (isSuccess(xmlRequest))
				{
					this.docRule = new ActiveXObject("Microsoft.XMLDOM");
					this.docRule.async = false;
					this.docRule.load(xmlRequest.responseXML);
				}
				cancelRequest(xmlRequest);
			}
		},
		parseXml			: function(oNode)
		{
			var sHtml = '';
			for (var i = 0; i < oNode.childNodes.length; i++)
			{
				var oChildNode = oNode.childNodes[i];
				var sId = oChildNode.getAttribute("id");
				var sIco = oChildNode.getAttribute("ICO");
				var sLabel = oChildNode.getAttribute("label");
				var sDisabled = oChildNode.getAttribute("DISABLED");
				var sEvent = oChildNode.getAttribute("EVENT");
				var sType = oChildNode.getAttribute("ITEM_TYPE");
				var sDynamicTextEvent = oChildNode.getAttribute("DYNAMIC_TEXT_EVENT");
				var sAlign = oChildNode.getAttribute("ITEM_ALIGN");
				var sOtherAttrs = oChildNode.getAttribute("OTHER_ATTRS")||"";
				var sDynamicLoadEvent = oChildNode
						.getAttribute("DYNAMIC_LOAD_EVENT");
				var sName = oChildNode.getAttribute("ITEM_NAME");
				
				if (sName) {
					this.menuItemIdInfo[sName] = this.getItemId(sId);
				}

				var sItemTagName, sLineTagName, sKeyAttName, sDisabledAttName, sEventAttName;
				if(sDynamicTextEvent)
				{
					sLabel = eval(sDynamicTextEvent);
				}
				if (this.menuType == "barMenu")
				{
					sItemTagName = (sType == 'label') ? "bar:input" : "bar:item";
					sLineTagName = "bar:line";
					sKeyAttName = "id";
					sDisabledAttName = "disabled";
					sEventAttName = "onClick";
					if(sAlign=="right")
					{
						sOtherAttrs = 'align="right"'+' '+sOtherAttrs;
					}
				}
				else
				{
					sItemTagName = "item";
					sLineTagName = "line";
					sKeyAttName = "NAME";
					sDisabledAttName = "disable";
					sEventAttName = "event"
				}

				if (sType == "line")
				{
					sHtml += '<' + sLineTagName +' '+sOtherAttrs+ ' />'
				}
				else
				{
					sHtml += '<' + sItemTagName + ' ' + sKeyAttName + '="'
							+ this.getItemId(sId) + '"'
					if (sOtherAttrs)
					{
						sHtml += ' ' + sOtherAttrs;
					}
					if (sIco)
					{
						sHtml += ' ico="' + sIco + '"';
					}
					if (sLabel)
					{
						sHtml += ' label="' + sLabel.replace(/"/g,"'") + '"';
					}
					if (sDisabled == '0BT')
					{
						sHtml += ' ' + sDisabledAttName + '="true"';
					}
					if (sEvent)
					{
						sHtml += ' ' + sEventAttName + '="' + sEvent + '"';
					}
					if (sDynamicLoadEvent)
					{
						sHtml += ' DynamicLoadEvent="' + sDynamicLoadEvent
								+ '"';
					}
					
					sHtml += '>'
					sHtml += this.parseXml(oChildNode, sHtml);
					sHtml += '</' + sItemTagName + '>';
				}
			}
			return sHtml;
		},
		getHeight:function()
		{
			return this.menuObj.getHeight();
		},
		setItemDisabledByName: function(name, disabled)
		{
			// 只适用于 barMenu
			if (this.menuType != "barMenu")
				return;

			var itemId = this.menuItemIdInfo[name];

			if (!itemId)
				return;
				
			if (this.isMenuHidden())
				this.menuObj.setItemHidden(itemId, disabled);
			else
				this.menuObj.setItemDisabled(itemId, disabled);
		},
		isMenuHidden: function() {
			return (this.menuRoot.getAttribute("disabledType") == 'hidden');
		}
	};

	Class.loadCss = function(css)
	{
		if (css)
		{
			var oImportCss = window.document.createElement("link");
			oImportCss.rel = "stylesheet";
			oImportCss.type = "text/css";
			oImportCss.href = css;
			document.getElementsByTagName("head")[0].appendChild(oImportCss);
		}
	}

	var MENU_DATA_FUNC = {
		propertys	: Class.prototype.buildByPropertys,
		menuId		: Class.prototype.buildByMenuId
	};
	return Class;
})();

ExtFuncMenu = (function()
{
	var uniqueID = 1;

	var Class = function()
	{
		this.Super();
		this.scope = window;
		this.eventParams = [];
		this.icoUrl = getRealPath("../../../resource/image/ico/", "funcMenu.js");
		this.uniqueID = 'Menu' + (uniqueID++) + '_';
	};

	return Class.extend(FuncMenu, {
		buildMenuData	: function()
		{
			var data = [];
			var menuDoc = ExtFuncMenu.superclass.buildMenuData.call(this)
			if (menuDoc)
			{
				var list = menuDoc.selectNodes("/root/Menu/MenuItem");
				this.disabledTypeIsHidden = (menuDoc.selectSingleNode('/root/Menu').getAttribute("disabledType") == 'hidden');

				data = this.createMenu(list);
			}
			return data;
		},
		createNode		: function(oXml)
		{
			var oItem;
			if (oXml.getAttribute("ITEM_TYPE") == "line")
			{
				oItem = "-";
			}
			else
			{
				oItem = {
					id			: this.uniqueID + oXml.getAttribute("id"),
					disabled	: (oXml.getAttribute("DISABLED") == '0BT')
				};
				var text = oXml.getAttribute("label");
				var icon = oXml.getAttribute("ICO");
				var event = oXml.getAttribute("EVENT");
				var dynamicLoadEvent = oXml.getAttribute("DYNAMIC_LOAD_EVENT");
				var sOtherAttr = oXml.getAttribute("OTHER_ATTRS");

				var otherConfig = {};
				try {
					otherConfig = eval("("+sOtherAttr+")") || {};
				} catch(e) {
				}

				if (otherConfig.xtype)
					oItem.xtype = otherConfig.xtype;
				if (otherConfig.hidden)
					oItem.hidden = !!otherConfig.hidden;

				if (text && icon)
				{
					oItem.text = text;
					oItem.icon = this.icoUrl + oXml.getAttribute("ICO");
					oItem.cls = "x-btn-text-icon";
				}
				else if (text)
				{
					oItem.text = text;
				}
				else
				{
					oItem.icon = this.icoUrl + oXml.getAttribute("ICO");
					oItem.cls = "x-btn-icon";
				}
				if (event)
				{
					oItem.handler = (function(o)
					{
						return function()
						{
							var fn = eval(event);
							if (typeof fn == "function")
							{
								//o.eventParams.push(otherConfig);
								var params = [this,otherConfig];
								fn.apply(o.scope, o.eventParams.concat(params));
							}
						}
					})(this);
				}

				if (dynamicLoadEvent)
				{
				
					oItem.listeners = {
						afterrender : (function(o) {
							return function() {
								try {
									var fn = eval(dynamicLoadEvent);

									if (typeof fn === 'function') {
										fn.apply(o.scope, o.eventParams.concat([this]));
									}
								} catch(e) {
									if (typeof console != 'undefined')
										console.log(e);
								}
							};
						})(this)
					}
				}
			}
			return oItem;
		},
		createMenu		: function(list)
		{
			var listRtn = [];
			for (var i = 0, n; n = list[i]; i++)
			{
				var cn = this.createNode(n);
				var cList = this.createMenu(n.selectNodes("MenuItem"))
				if (cList.length > 0)
				{
					cn.menu = cList;
				}
				listRtn[i] = cn;
			}
			return listRtn;
		},
		setRule			: function(enabledList, disabledList)
		{
			for (var i = 0, id; id = enabledList[i]; i++)
			{
				for (var j = 0, m; m = this.menuObjs[j]; j++)
				{
					var item = m.items.item(m.uniqueID + id);
					if (this.disabledTypeIsHidden)
						item.show();
					else
						item.enable();
				}
			}
			for (var i = 0, id; id = disabledList[i]; i++)
			{
				for (var j = 0, m; m = this.menuObjs[j]; j++)
				{
					var item = m.items.item(m.uniqueID + id);
					if (this.disabledTypeIsHidden)
						item.hide();
					else
						item.disable();
				}
			}
		},
		revertRule		: function()
		{
			this.setRule(this.setDisabledList, this.setEnabledList);
			this.setDisabledList = new Array();
			this.setEnabledList = new Array();
		},
		executeRule		: function(o)
		{
			this.menuObjs = o;
			this.revertRule();
			var ruleList = this.docRule.selectNodes('/root/rowSet');
			var isResult = true;
			for (var i = 0; i < ruleList.length && isResult; i++)
			{
				isResult = this.executeRuleItem(ruleList[i])
			}
		},
		executeRuleItem	: function(oRuleNode)
		{
			var result = eval(oRuleNode.selectSingleNode('FUNC_MENU_RULE').text);
			if (typeof result == "function")
			{
				result = result.apply(this.scope, o.eventParams);
			}
			var enabledList = oRuleNode.selectSingleNode('ENABLED_MENU_ITEM').text
					.split(",");
			var disabledList = oRuleNode.selectSingleNode('DISABLED_MENU_ITEM').text
					.split(",");
			var isBreak = (oRuleNode.selectSingleNode('IS_BREAK').text == '0BT');
			if (result)
			{
				this.setRule(enabledList, disabledList);
				this.setEnabledList = this.setEnabledList.concat(enabledList);
				this.setDisabledList = this.setDisabledList
						.concat(disabledList);
			}
			return !(isBreak && result);
		}
	});
})();

// itnm00053377
// 供 sys_func_menu event配置调用的，可执行存储过程的 js 函数,存储过程参数可为系统参数、SQL_PARAM
var $ExecMproc = function(procName) {
	return function() {
		ExtMenuUtil.exec(procName);
	}
}

var ExtMenuUtil = {
	init: function(grid) {
		this.grid = grid;
		this.result = grid.result;
		this.initExistParamNameList();
	
		this.actionUrl = getRealPath("../../../servlet/FuncMenuAction?", "funcMenu.js");
		this.xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
	},
	initExistParamNameList: function() {
		this.existParamNames = {};
		for (var i = 0, p; p = this.result.paramList[i]; i++) {
			this.existParamNames[p.send.name] = 1;
		}
	},
	getRowData: function(colName) {
		var row = this.grid.getSelectionModel().getSelected();
		if (row) {
			return row.get(colName);
		} else {
			return null;	
		}
	},
	getRowsData : function(colName)
	{
		var selRows = this.grid.getSelectionModel().getSelections();
		var pnames = new Array();
		for(var k = 0,row; row = selRows[k]; k++)
		{
			pnames.push(row.get(colName));
		}
		return pnames;
	},
	exec: function(procName) {
		if (!this.result)
			return;

		var pname = procName.replace(/\s/g, '');

		var params = {};
		for (c in this.result.oParam) {
			params[c] = this.result.oParam[c];
		}

		var prefix = '_';
		var pnames = ExtMenuUtil.getRowsData();
		var sendParams = ["action=10"];
		var sendUrl = getSendUrl(this.actionUrl, sendParams);		
		var selRows = this.grid.getSelectionModel().getSelections();
		
		var oprtResult = new Array();
		var existsError = false;
		for(var i = 0, row; row = selRows[i]; i++)
		{
			var procName = pname.replace(/#\w+/g, function(s) {
				var str = s.substring(1);
				var v = row.get(str);
				if (v != null) {
					while (ExtMenuUtil.existParamNames[str])
						str += prefix;
					
					params[str] = v;
				}
	
				return ':' + str;
			});
			params._procName = procName;
			this.xmlRequest.open("post", sendUrl, false);
			this.xmlRequest.send(this.result.buildSendXml(params));
			if (!isSuccess(this.xmlRequest))
			{
				existsError = true;
				break;
			}
		}
		if(!existsError)
		{
			MMsg("执行成功");		
		}
	}
}
