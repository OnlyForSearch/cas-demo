var busiMonitorResultPanelJSDefaultLang = {
	saveAsDefaultConditions : '保存为默认条件',
	saveDefaultConditionsSucessMsg : '保存默认条件已成功',
	saveDefaultConditionsSucessTitle : '操作完成',
	saveDefaultConditionsFailMsg : '保存默认条件失败!',
	saveDefaultConditionsFailTitle : '保存失败',
	columnChart : '柱图',
	lineChart : '线图',
	pieChart : '饼图',
	defaultChart : '默认图形',
	search : '查询'
};
//获取语言资源
function getBusiMonitorResultPanelJSLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('busiMonitorResultPanelJSDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.busiMonitorResultPanelJS.' + code);
	}
}

Ext.namespace("ResultPanel");
ResultPanel.SelfName = "ResultPanel.js";
ResultPanel.ActionUrl = getRealPath("../../../servlet/panelCtrl.do?",
		ResultPanel.SelfName);

$import("../funcMenu/funcMenu.js", ResultPanel.SelfName);
$import("Result.js", ResultPanel.SelfName);
$import("ResultProxy.js", ResultPanel.SelfName);
$import("ResultChartProxy.js", ResultPanel.SelfName);
$import("Chart.js", ResultPanel.SelfName);
$import("ResultGrid.js", ResultPanel.SelfName);
$import("ResultChart.js", ResultPanel.SelfName);

var isExistsFusionChartSvg = false;
var scripts = document.scripts;
for(var i = 0, script; script = scripts[i]; i ++)
{
	if(script.src.toUpperCase().indexOf("FUSIONCHARTSVG.JS") > -1)
	{
		isExistsFusionChartSvg = true;
		break;
	}
}
$import("../charts/fusionCharts/FCharts.js", ResultPanel.SelfName);
if(!isExistsFusionChartSvg)
{
	$import("../charts/fusionCharts/FusionCharts.js", ResultPanel.SelfName);
	$import("FusionChart.js", ResultPanel.SelfName);
	$import("ResultConvertUtil.js", ResultPanel.SelfName);
}

var GLOBAL_MAIN_RESULT_PANEL;
ResultPanel.ToolBarFactory = (function()
{
	var ClsMap = {};
	return {
		reg			: function(key, cls)
		{
			ClsMap[key] = cls;
		},
		newInstance	: function(node, grid)
		{
			var key = node.getAttribute("type");
			var position = node.getAttribute("position");
			var isSave = node.getAttribute("isSave");
			var Cls = ClsMap[key];
			return new Cls(position, node, grid);
		}
	}
})();

ResultPanel.ToolBarAction = function(position, node, panel)
{
	this.position = position;
	this.node = node;
	this.panel = panel;
}

ResultPanel.ToolBarByMenu = (function()
{
	var Cls = Ext.extend(ResultPanel.ToolBarAction, {
				type	: "menu",
				getMenu	: function()
				{
					var funcmenu = new ExtFuncMenu();
					funcmenu.eventParams = [this.panel];
					funcmenu.menuId = this.node.text;
					funcmenu.getMenuDataFunc = "menuId";
					// funcmenu.buildRule();
					// grid.tbarFuncMenu = funcmenu;
					return funcmenu.buildMenuData();
				}
			})
	ResultPanel.ToolBarFactory.reg(Cls.prototype.type, Cls);
	return Cls;
})()

ResultPanel.ToolBarByParam = (function()
{
	var defaultTbtext = {
		xtype	: "tbtext",
		style	: {
			height	: 24,
			padding	: '3 4 0 4',
			cursor	: 'default'
		}
	}

	function createComp(node)
	{
		var comp = ResultCompUtils.createComp(node);
		var width = Result.getNumber(node, "WIDTH");
		if (width)
		{
			comp.width = width;
		}
		ResultCompUtils.setDefaultValue(comp);
		return comp;
	}

	function getLabel(comp)
	{
		return Ext.apply({
					text	: comp.fieldLabel + ":"
				}, defaultTbtext)
	}

	var Cls = Ext.extend(ResultPanel.ToolBarAction, {
				type		: "param",
				searchFn	: null,
				getMenu		: function()
				{
					var compList = this.node.selectNodes('rowSet');
					var items = [];
					var funButtons = [];
					var self = this;
					GLOBAL_MAIN_RESULT_PANEL = this;
					for (var i = 0, compNode; compNode = compList[i]; i++)
					{
						var comp = createComp(compNode);
						if(comp.xtype == 'fun_button')
						{
							if(comp.isInLast === false){
								items.push(comp);
								items.push("-");
							}else{
								funButtons.push(comp);
							}
							continue;
						}
						comp.toolbarId = this.node.getAttribute("id");
						items.push(getLabel(comp));
						comp = ResultCompUtils.createExtComp(comp,
								this.panel.oParam);
						if(comp.autoSearch)
						{
							Ext.apply(comp,{searchFn : function(){
								self.searchFn.call(self.panel,
												self.panel.paramByToolbar);
							}});
							Ext.apply(comp,{paramByToolbar : self.panel.paramByToolbar});
							
							Ext.apply(comp,{searchPanel : self.panel});
						}
						items.push(comp);
						items.push("-");
						this.panel.paramByToolbar[ResultCompUtils
								.getExistCompKey(comp.name)] = comp;
					}
					items.pop();
					if(this.node.getAttribute("isSave") == '0SA')
					{					
						items.push("-");
						var self = this;
						items.push({
									text	: getBusiMonitorResultPanelJSLan('saveAsDefaultConditions'),
									iconCls	: 'icon-save',
									handler	: function()
									{
										var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
										var sendParams = {
											method	: "saveToolbarParam"
										};
										var sendUrl = ResultPanel.ActionUrl+ Ext.urlEncode(sendParams);
										sendRequest.open("post", sendUrl, false);
										var sendXml = self.buildSendXml(self.panel.paramByToolbar);
										sendRequest.onreadystatechange = function()
										{
											if (sendRequest.readyState == 4)
											{
												if (isSuccess(sendRequest))
												{
													var errElement = getErrorCode(sendRequest);
													if(errElement){
														Ext.Msg.alert(getBusiMonitorResultPanelJSLan('saveDefaultConditionsSucessTitle'),getBusiMonitorResultPanelJSLan('saveDefaultConditionsSucessMsg'))
													}else{
														Ext.Msg.alert(getBusiMonitorResultPanelJSLan('saveDefaultConditionsFailTitle'),getBusiMonitorResultPanelJSLan('saveDefaultConditionsFailMsg'))
													}
												}
											}
										}
										sendRequest.send(sendXml);
									}
								});
					}
					if(this.node.getAttribute("isChangeChartType") == '0SA')
					{
						var attrs = [['icon-chart','column',getBusiMonitorResultPanelJSLan('columnChart')],['icon-chart-line','line',getBusiMonitorResultPanelJSLan('lineChart')],['icon-chart-pie','pie',getBusiMonitorResultPanelJSLan('pieChart')]];
						var self = this;
						for(var k = 0, attr; attr = attrs[k]; k++)
						{
							items.push("-");
							items.push({									
									iconCls	: attr[0],
									chartType : attr[1],
									handler	: function()
									{	
										//每个图形控件都默认有属性chartPanel:chartPanel
										Ext.each(self.panel.find('chartPanel','chartPanel'),function(chart){
											chart.changeChartType(this.chartType,'1');
										},this);
									}
								});
						}
						items.push("-");
						var self = this;
						items.push({
									title   : '默认图形',
									iconCls	: 'icon-undo',
									handler	: function()
									{
										Ext.each(self.panel.find('chartPanel','chartPanel'),function(chart){
											chart.changeChartType('line','0');
										},this);
									}
								});
					}
					if (Result.isFunction(this.searchFn))
					{
						items.push("-");
						var self = this;
						items.push({
									text	: getBusiMonitorResultPanelJSLan('search'),
									iconCls	: 'icon-search',
									handler	: function()
									{
										self.searchFn.call(self.panel,
												self.panel.paramByToolbar);
									}
								});
					}
					for(var i = 0; funbutton = funButtons[i]; i++)
					{
						items.push(funbutton);
					}
					return items;
				},
				buildSendXml		: function(params)
				{
					params = params || {};
					var sendXml = new ActiveXObject("Microsoft.XMLDOM");
					var root = sendXml.createElement("root");
					var result = sendXml.createElement("result");
					var np;
					for (var c in params)
					{
						var name = c.replace("param_item_","");
						var param = params[c];
						var text;
						if (typeof param == "object")
						{
							text = param.getValue();
						}
						np = sendXml.createElement("param");
						np.setAttribute("paramCompId", name);
						np.setAttribute("toolbarId",param.toolbarId);
						np.text = text;
						result.appendChild(np);
					}
					root.appendChild(result);
					sendXml.appendChild(root);
					return sendXml;
				}
			})
	ResultPanel.ToolBarFactory.reg(Cls.prototype.type, Cls);
	return Cls;
})()

ResultPanel.Base = Ext.extend(Ext.Panel, {
			initComponent	: function()
			{
				var configDoc = getXmlFromHtmlData(this.panelId+"#ResultPanelConfig");
				if(!configDoc)
				{
					var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
					var sendParams = {
						method	: "getPanel",
						id		: this.panelId
					};
					var sendUrl = ResultPanel.ActionUrl + Ext.urlEncode(sendParams);
					sendRequest.open("post", sendUrl, false);
					sendRequest.send();
					if (isSuccess(sendRequest))
					{
						configDoc = sendRequest.responseXML;
					}
				}
				if (configDoc)
				{
					var configNode = configDoc.selectSingleNode('/root/rowSet');
					var config = this.createConfig(configNode);
					Ext.apply(this, config);
					var barList = configDoc
							.selectNodes('/root/toolbars/toolbar');
					this.barActionInfo = {
						top		: {
							count	: 0,
							render	: "tbar"
						},
						bottom	: {
							count	: 0,
							render	: "bbar"
						}
					}
					this.lastParamBar;
					this.panelBarList = [];
					this.paramByToolbar = {};
					for (var i = 0, bar; bar = barList[i]; i++)
					{
						var barAction = ResultPanel.ToolBarFactory.newInstance(
								bar, this);
						this.panelBarList.push(barAction);
						this.barActionInfo[barAction.position].count++;
						if (barAction.type == 'param')
						{
							this.lastParamBar = barAction;
						}
					}
					if (!this.tbar && this.barActionInfo.top.count > 0)
					{
						this.tbar = true;
					}
					if (!this.bbar && this.barActionInfo.bottom.count > 0)
					{
						this.bbar = true;
					}
				}
				ResultPanel.Base.superclass.initComponent.call(this);
			},
			createConfig	: function(oNode)
			{
				var importJs = oNode.selectSingleNode("IMPORT_JS").text;
				$import(importJs);
				var o = {};
				var sTitle = oNode.selectSingleNode('TITLE').text;
				sTitle && (o.title = sTitle);
				var sConfig = oNode.selectSingleNode('CONFIG_SCRIPT').text;
				if (sConfig)
				{
					Ext.applyIf(o, eval(sConfig));
				}
				return o;
			},
			onRender		: function(ct, position)
			{
				ResultPanel.Base.superclass.onRender.call(this, ct, position);
				if (this.lastParamBar)
				{
					this.lastParamBar.searchFn = this.onSearchByToolBar;
				}
				for (var i = 0, bar; bar = this.panelBarList[i]; i++)
				{
					var topToolbar = new Ext.Toolbar(bar.getMenu());
					topToolbar.ownerCt = this;
					topToolbar
							.render(this[this.barActionInfo[bar.position].render]);
					this.toolbars.push(topToolbar);
				}
				if(this.initCompValueByUrl)
				{
					this.setCompValueByUrl();
				}
			},
			setCompValueByUrl : function()
			{
				var oUrlParam = getUrlParam();
				for(key in this.paramByToolbar)
				{
					var comp = this.paramByToolbar[key];
					if(comp.id)
					{
						var value = oUrlParam[comp.id] || oUrlParam[comp.id.toUpperCase()] || oUrlParam[comp.id.toLowerCase()];
						if(value)
						{
							 comp.setValue(value);
						}
					}
				}
			},
			search			: function()
			{
				if (Result.isFunction(this.onSearchByToolBar))
				{
					 if(parent.publicToolPanel){
					    this.onSearchByToolBar(parent.publicToolPanel.paramByToolbar);
					  }else{
					    this.onSearchByToolBar(this.paramByToolbar);
					  }
					
				}
			}
		});