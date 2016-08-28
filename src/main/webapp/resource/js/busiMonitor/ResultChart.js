var busiMonitorResultChartJSDefaultLang = {
	search : '查询'
};
//获取语言资源
function getBusiMonitorResultChartJSLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('busiMonitorResultChartJSDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.busiMonitorResultChartJS.' + code);
	}
}

ResultChart = (function()
{
	var CHART_SWF = "/resource/js/ext/resources/charts.swf";

	var ResultChartPanel = Ext.extend(Ext.chart.CartesianChart, {
				defaultLineTypeConfig	: {
					lineSize	: 2,
					size		: 8
				},
				initComponent			: function()
				{
					ResultChartPanel.superclass.initComponent.call(this);
					this.lineConfig = rebuildObjToUpperCase(this.lineConfig
							|| {});	
				},
				refresh					: function()
				{
					var data = [], rs = this.store.data.items;
					for (var j = 0, len = rs.length; j < len; j++)
					{
						data[j] = rs[j].data;
					}
					var fields = this.store.fields.items;
					var defaultType = this.type;
					var dataProvider = [];
					for (var i = 0, field; field = fields[i]; i++)
					{
						if (field.label == this.xField)
						{
							this.xField = field.name;
						}
						else if (field.name != this.xField)
						{
							var lconfig = this.lineConfig[field.label];
							var config = Ext.apply({
										yField			: field.name,
										displayName		: this.labelConfig[field.label]
												|| field.label,
										type			: defaultType,
										dataProvider	: data
									}, lconfig);
							if (config.type == "line")
							{
								if (config.style)
								{
									Ext.applyIf(config.style,
											this.defaultLineTypeConfig);
								}
								else
								{
									config.style = this.defaultLineTypeConfig;
								}
							}
							config.style = Ext.encode(config.style)
							if (defaultType == "line"
									&& config.type == 'column')
							{
								dataProvider.splice(0, 0, config);
							}
							else
							{
								dataProvider.push(config);
							}
						}
					}
					if (defaultType == "pie")
					{
						
						this.swf.setCategoryField(this.xField);
						if (dataProvider.length > 0)
						{
							this.swf.setDataField(dataProvider[0].yField);
						}
						
						//饼图颜色代码临时改动ssy*********************************************************
						  if(this.series){
							        dataProvider = [];
						            var seriesCount = 0;
						            var currentSeries = null;
						            var i = 0;
						                seriesCount = this.series.length;
						                for(i = 0; i < seriesCount; i++){
						                    currentSeries = this.series[i];
						                    var clonedSeries = {};
						                    for(var prop in currentSeries){
						                            clonedSeries.style = Ext.encode(currentSeries.style);
						                            styleChanged = true;
						                    }
						                    dataProvider.push(clonedSeries);
						                }
						            if(seriesCount > 0){
						                for(i = 0; i < seriesCount; i++){
						                    currentSeries = dataProvider[i];
						                    if(!currentSeries.type){
						                        currentSeries.type = this.type;
						                    }
						                    currentSeries.dataProvider = data;
						                }
						            } 
								 }			
						
						//*************************************************************
					}
					else
					{
						this.swf.setHorizontalField(this.xField);
					}
					this.swf.setDataProvider(dataProvider);
				}
			})

	var Read = Ext.extend(Ext.data.ResultGrid.Read, {
				isBuildFieldEvery	: true,
				getNameType			: Ext.data.ResultGrid.Read.NAME
			});

	var CHART_TYPE = {
		reg	: /^chart_.*?(bar|line|pie)(?:_|$)/i,
		fn	: function(type)
		{
			var type = type.toLowerCase();
			return (type == "bar") ? "column" : type;
		}
	}

	function createFieldList(fields, labelConfig)
	{
		if (fields)
		{
			var list = new Array(len);
			var len = fields.length;
			var field;
			for (var i = 0; i < len; i++)
			{
				field = fields[i];
				if (typeof field == 'string')
				{
					field = field.toUpperCase();
					field = {
						NAME	: field,
						LABEL	: field
					};
				}
				else
				{
					field = rebuildObjToUpperCase(field);
					labelConfig[field.NAME] = field.LABEL;
				}
				list[i] = field;
			}
			return list;
		}
		else
		{
			return [];
		}
	}

	var Cls = Ext.extend(Ext.Panel, {
		gridLines		: "X",
		createStore		: function()
		{
			var self = this;
			var labelConfig = {};
			var buildType = "data";
			var chart;
			this.oChartXmlConfig = Chart.getChartConfig(this.result);
			if (this.oChartXmlConfig)
			{
				this.oChartXmlConfig.setAttribute("buildType", buildType);
				ResultFactory.copyXmlAtt(this, this.oChartXmlConfig, ["xField",
								"chartType", "legend", "gridLines",
								"labelRotation", "xLabel", "yLabel","is_show_zero","click"]);
				var title = Result.getText(this.oChartXmlConfig, "title")
				if (title)
				{
					this.title = title
				}
				var fList = this.oChartXmlConfig
						.selectNodes('rowSet[@NAME != @LABEL]')
				for (var i = 0, f; f = fList[i]; i++)
				{
					labelConfig[f.getAttribute("NAME")] = f
							.getAttribute("LABEL");
				}
				chart = new Chart({
							result			: self.result,
							buildType		: buildType,
							chartXmlConfig	: self.oChartXmlConfig
						})
			}
			else
			{
				var attrList = createFieldList(this.attrs, labelConfig);
				var metrList = createFieldList(this.metrs, labelConfig);
				var groupType = (attrList.length == 1)
						? Chart.METRIC_GROUP
						: Chart.ATTRIBUTE_GROUP;
				if (groupType == Chart.METRIC_GROUP)
				{
					this.xField = attrList[0].NAME;
				}
				else
				{
					this.xField = (this.xField)
							? this.xField.toUpperCase()
							: attrList[0].NAME;
				}
				chart = new Chart({
							result		: self.result,
							groupType	: groupType,
							isAuotGroup	: self.isAuotGroup,
							attrList	: attrList,
							metrList	: metrList,
							order		: self.orderField,
							xField		: self.xField,
							buildType	: buildType
						})
			}
			this.labelConfig = labelConfig;
			var proxy = new Ext.data.ResultChartProxy({
						chart	: chart
					});
			var reader = new Read({
						record	: "rowSet",
						success	: "error_code"
					})
			return new Ext.data.Store({
						proxy	: proxy,
						reader	: reader,
						baseParams : this.result.oParam
					})
		},
		buildLineConfig	: function()
		{
			this.lineConfig = this.lineConfig || {};
			if (this.oChartXmlConfig)
			{
				var configList = this.oChartXmlConfig
						.selectNodes("lineConfig/config");
				for (var i = 0, config; config = configList[i]; i++)
				{
					var lconfig = ResultFactory.copyXmlAtt({}, config);
					lconfig.style = (lconfig.style) ? Result
							.loadJsonText(lconfig.style) : {};
					ResultFactory.copy(lconfig.style, lconfig, ["color"]);
					this.lineConfig[config.text] = lconfig;
				}
			}
		},
		initComponent	: function()
		{
			this.tbar = this.tbar || [];
			this.paramByToolbar = {};
			var self = this;
			this.autoScroll = true;
			this.store = this.createStore();
			if (CHART_TYPE.reg.test(this.chartType))
			{
				var type = CHART_TYPE.reg.exec(this.chartType)[1];
				this.chartType = CHART_TYPE.fn(type);
			}
			this.buildLineConfig();
			this.items = [new ResultChartPanel({
						url			: CHART_SWF,
						store		: self.store,
						type		: self.chartType,
						xField		: self.xField,
						xAxis		: new Ext.chart.CategoryAxis({
									title	: self.xLabel
								}),
						yAxis		: new Ext.chart.NumericAxis({
									title	: self.yLabel,
									alwaysShowZero : (self.is_show_zero == '0BF' ? false : true)
								}),
						listeners : {
							itemclick: function(o){
						               if(!Ext.isEmpty(self.click,false)){
						                  Ext.each(self.store.fields.items,function(item){
						                    if(item.label == self.xField){        
						                      var p=this.store.proxy.chart.oResult.buildParamsObj(this.store.lastOptions);//工具栏的查询参数对象
						                      var arr = [];
						                      Ext.iterate(p,function(key){
						                        arr.push(key+'='+ p[key])
						                      });
						                      
						                      var value = this.store.data.items[o.index].data[item.name];
						                      var reg = /:\w+/g;
						                      var clickstr = self.click.replace(/arr/gi,"arr").replace(/xlable/gi,"value");
						                      clickstr = eval(clickstr.split('(')[0]);
						                      if(typeof clickstr =="function")
						                      {
						                        eval(self.click.replace(/arr/gi,"arr").replace(/xlable/gi,"value"));  
						                      }
						                      else
						                      {
						                        doWindow_open(Ext.urlAppend(self.click.replace(reg,value),arr.join('&')));
						                      }
						                      return false;
						                    }
						                  },self)
						                }  
						              }

						},
						border		: false,
						lineConfig	: self.lineConfig,
						labelConfig	: self.labelConfig,
						// tipTemplate : new Ext.Template("{g}\n{x}={y}"),
						// tipRenderer : function(chart, record, index, series)
						// {
						// var attr = {
						// x : record.get(chart.xField),
						// y : Ext.util.Format.number(record
						// .get(series.yField), '0,0'),
						// g : series.displayName
						// }
						// return chart.tipTemplate.apply(attr);
						// },
						extraStyle	: {
							yAxis	: {
								majorGridLines	: {
									size	: (this.gridLines.indexOf("X") == -1)
											? 0
											: 1
								},
								titleRotation	: -90
							},
							xAxis	: {
								majorTicks				: {
									length	: 0
								},
								minorTicks				: {
									length	: 2
								},
								majorGridLines			: {
									size	: (this.gridLines.indexOf("Y") == -1)
											? 0
											: 1
								},
								labelRotation			: this.labelRotation,
								hideOverlappingLabels	: (this.labelRotation == 0)
							},
							legend	: {
								display	: self.legend
							}
						},
						series:self.series
					})]
			Cls.superclass.initComponent.call(this);
		},
		chartPanel : 'chartPanel',//默认添加此属性，在图形类型切换时使用。
		changeChartType : function(type,tag)
		{
			this.buildLineConfig();
			var changeLineConfig = {};
			if(tag == "1" && type != "pie")
			{
			    changeLineConfig  = this.lineConfig;
				for (var s in changeLineConfig)
				{
	                for(var i in (changeLineConfig)[s])
	                {
	                	if(i == "type")
	                	{
	                		((changeLineConfig)[s])[i] = type;
	                	}
	                }
	      		}
			}
			var o = this.get(0).cloneConfig({
				//type : '1'==tag ? type :this.type,
				//lineConfig : {}
				type : type,
				lineConfig : '1'==tag ?  changeLineConfig: this.lineConfig
			});
			this.remove(this.get(0),true);
			this.add(o);
			this.doLayout();
		},
		initEvents		: function()
		{
			Cls.superclass.initEvents.call(this);
			
		},
		search			: function(o, arg)
		{
			o = o || {};
			var d=Ext.apply({
						params	: o,
						getType	: Result.FORCE_GET
					}, arg);
			this.store.load(d);
		},
		buildParamBar : function() {
			var paramBar = [];
			var paramCompList = this.createParamCompList();
			for (var i = 0, j = 0, p; p = paramCompList[i]; i++, j++) {
				paramBar[j] = p.fieldLabel + ":";
				paramBar[++j] = p;
				paramBar[++j] = '-';
			}

			paramBar.push({
						text : getBusiMonitorResultChartJSLan('search'),
						iconCls : 'icon-search',
						handler : function() {
							delete this.result.filedsearch;
							var paramArr = this.paramByToolbar;
							var params = "";
							for (var c in paramArr)
							{
								var name = c.replace("param_item_","");
								var param = paramArr[c];
								var text;
								if (typeof param == "object")
								{
									text = param.item.getValue();
								}
								params = params + name + ":" + text + ",";
							}
							var p = {};
							if(params != "")
							{
								params = "{" + params + "}";
								params = params.replace(",}","}");
								p = eval("(" + params + ")");
							}
							this.search(p);
						},
						scope : this
					});
			this.hasBuildParamBar = true;
			return paramBar;
		},
		createParamCompList : function() {
			var compList = [];
			for (var i = 0, p; p = this.result.paramList[i]; i++) {
				var comp = p.comp;
				if (comp) {
					var extComp = ResultCompUtils.createExtComp(comp,
							this.result.oParam);
					if (extComp) {
						comp.item = extComp;
						compList[i] = comp.item;
						this.paramByToolbar[ResultCompUtils.getExistCompKey(comp.name)] = comp;
					}
				}
			}
			this.compList = compList;
			return compList;
		},
		onRender : function(ct, position) {
			Cls.superclass.onRender.apply(this, arguments);
			this.result = ResultFactory.newResult(this.result);
			this.result.loadRenderCfg();
			if(this.result.renderCfg){
				var showCfg = this.result.renderCfg.show.config;
				if (showCfg && showCfg.isAddParamTbar) {
					if (this.hasBuildParamBar !== true) {
						this.tbar = new Ext.Toolbar({
							items : this.buildParamBar(),
							renderTo : this.tbar
						});
					}
				}
			}
			var bar = this.getTopToolbar();
			bar.hide();
		}
	});
	return Cls;
})();
Ext.ComponentMgr.registerType('resultChart', ResultChart);