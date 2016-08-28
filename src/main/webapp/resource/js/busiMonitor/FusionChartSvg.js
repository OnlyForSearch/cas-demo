var busiMonitorFusionChartJSDefaultLang = {
	clickBlowUp : '点击图表放大显示',
	noData : '无数据'
};
//获取语言资源
function getBusiMonitorFusionChartJSLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('busiMonitorFusionChartJSDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.busiMonitorFusionChartJS.' + code);
	}
}

ChartEvent = {
		zoomOut : function(fObject){

			var gHei = document.body.clientHeight;
			var gWid = document.body.clientWidth;
			
			var zoomOutdiv = document.createElement("div");
			document.body.appendChild(zoomOutdiv);
			zoomOutdiv.style.position="absolute"; 
			zoomOutdiv.style.display=""; 
			zoomOutdiv.style.zIndex=10000;
			zoomOutdiv.style.width=gWid*0.9; 
			zoomOutdiv.style.height=gHei*0.9; 
			zoomOutdiv.style.top = gHei*0.1/2;
			zoomOutdiv.style.left = gWid*0.1/2;
			zoomOutdiv.style.backgroundColor = "transparent";
			zoomOutdiv.style.borderWidth = "1";
			zoomOutdiv.style.borderStyle = "solid";
			zoomOutdiv.style.borderColor = "#FFFFFF";
			zoomOutdiv.id="zoomOutdivId";
			
			var zoomOutHead = document.createElement("div");
			zoomOutHead.style.width="100%";
			zoomOutHead.style.height="23";
			zoomOutHead.style.textAlign="right";
			zoomOutHead.style.backgroundColor = "#999999";
			zoomOutHead.style.filter="alpha(opacity=80)";
			var closeImg = document.createElement("image");
			closeImg.src="/resource/image/itsmImages/close.gif";
			closeImg.style.cursor = "hand";
			closeImg.onclick = function(){
				zoomOutdiv.style.display="none"; 
			}
			zoomOutHead.appendChild(closeImg);
			zoomOutdiv.appendChild(zoomOutHead);
			
			var zoomOutData = document.createElement("div");
			zoomOutData.style.width="100%";
			zoomOutData.style.height=gHei*0.9-23; 
			zoomOutData.style.backgroundImage="url('/resource/image/chartBg.jpg')" 
			zoomOutdiv.appendChild(zoomOutData);
			
			var resultPanel = new FusionChart({
				result : fObject.result,
				minHeight : 200,
				border : false,
				renderTo:zoomOutData,
				baseCls :'ex-panel',
				isShowZoomOut : false,
				isTransparent : fObject.isTransparent
			});
			resultPanel.setAttrs(fObject.oAttrs);
			resultPanel.FCharts.setTransparent(true);
			resultPanel.search(fObject.searchObject,fObject.searchArg);
		},
		clearZoomOutChart:function(){
			document.getElementById("zoomOutChart").innerHTML="";
		}
}

FusionChart = (function(){
	var SELF = "FusionChartSvg.js";
	var CHART_SWF = "/resource/js/charts/fusionCharts/";
	var CHART_CTRL_URL = getRealPath("../../../servlet/chart.do?", SELF);
	
	var FusionChartPanel = Ext.extend(Ext.Panel, {
		// 自定义过滤图表数据的函数
		filterChartXml: null,

		//title: "charts",
		init				: function(){
			this.chart = this.result;
			this.sendRequest;
			this.renderTo;
			this.chartConfig={};
			this.FCharts;
			this.oChartConfigXml;
			this.buildType = "fusionData";
			this.oResult;
			this.oAttrs={};
			this.chartUpdateTimer = null;
			this.aSeriesName = [];
			this.aSeries = [];
			this.refreshInterval = 0;
			this.curDataIndex = 0;
			this.maxDataIndex = 0;
			this.dataIndexStep = 0;
			this.isExist=false;
			this.descResult=null;
			this.descParams=null;
			this.descTitle=null;
			this.descText=null;
			this.lisenceId = document.uniqueID;
			// 继承控件父容器的宽、高
			if (this.inheriParentWH == null)
				this.inheriParentWH = true;

			//this.isShowZoomOut=false;
			//this.isTransparent=false;
			// ZoomLine2 选择区间时回调函数，可返回区间开始、截止X轴值
			this.zoomedCallback = this.zoomedCallback || function(){};
			if(this.resultData)
			{				
				if(typeof this.resultData == 'string')
				{
					var resultCfgDom = new ActiveXObject("Microsoft.XMLDOM");
					resultCfgDom.loadXML(this.resultData);
					this.resultData = resultCfgDom;
				}
				this.setResultCfg(this.resultData);
			}
			if(this.chart){
				if(!this.oResult)
				{
					this.oResult = ResultFactory.newResult(this.chart);
				}
				
				if(!this.oResult.renderCfg)
				{
					this.oResult.loadRenderCfg();
				}
				
				if(this.oResult.renderCfg)
				{
					var showCfg = this.oResult.renderCfg.show.config;
					if(showCfg)
					{
						this.setDescCfg(showCfg);
					}
				}
				
			}
			//FusionChartPanel.superclass.constructor.call(this, config);
		},
		setDescCfg : function(showCfg){
			this.descResult = showCfg.descResult;
			this.descParams = showCfg.descParams;
			this.descTitle = showCfg.descTitle;
			this.descText = showCfg.descText;
		},
		setAttrs 			:function(pAttrs){
			this.oAttrs = pAttrs;
		},
		effectAtrr 			:function(){
			var attrs = this.oAttrs;
			if(attrs){
				for(var o in attrs){
					this.FCharts.setChartAttribute(o,attrs[o]);
				}
			}
		},
		chartLoad 			:function(){
			this.effectAtrr();
		},
		getRender			: function()
		{
			if (typeof this.renderTo == "string")
			{
				this.renderTo = document.getElementById(this.renderTo);
			}
			return this.renderTo;
		},
		changeChart : function(result){
			this.chart = result;
			this.oResult = ResultFactory.newResult(this.chart);
			this.oResult.loadRenderCfg();
			if(this.oResult.renderCfg){
				var showCfg = this.oResult.renderCfg.show.config;
				if(showCfg){
					this.setDescCfg(showCfg);
				}
			}
			this.buildChartConfig(this.chart);
			this.buildChart();
			this.search(this.searchObject,this.searchArg);
		},
		setResultCfg : function(result){		
			var valueCfg = result.selectSingleNode("/root/value_cfg");
			this.oResult = ResultFactory.newResult(valueCfg);
			var renderCfg = result.selectSingleNode("/root/render_cfg");
			if(renderCfg != null)
			{
				this.oResult.renderCfg = Result.loadJsonText(renderCfg.text);
			}
		},
		setChartConfig : function(chartCfg){
			var oXmlConfig = new ActiveXObject("Microsoft.XMLDOM");
			oXmlConfig.load(chartCfg);
			var oChart = oXmlConfig.selectSingleNode('/root/chart');
			//alert(oChart);
			if (oChart){
				this.chartConfig.chartSwf = CHART_SWF+oChart.getAttribute("chartType")+".swf";
				this.chartConfig.chartType = oChart.getAttribute("chartType");
				this.chartConfig.width = oChart.getAttribute("width");
				this.chartConfig.height = oChart.getAttribute("height");
				this.title = oChart.selectSingleNode("title").text;

				if(this.chartConfig.width==0) this.chartConfig.width = "100%";
				if(this.chartConfig.height==0) this.chartConfig.height = "100%";

				if(this.width && this.inheriParentWH) 
					this.chartConfig.width = this.width;
				if(this.height && this.inheriParentWH) 
					this.chartConfig.height = this.height;

				// workround: 用于临时解决仪表盘数据不更新的问题
				if (oChart.getAttribute("chartType") == 'AngularGauge')
					this.needRecreate = true;
			}
			var metricNode = oChart.selectSingleNode("rowSet[@TYPE='METRIC']");
			if(metricNode != null)
			{
				oChart.setAttribute("yField", metricNode.getAttribute("NAME"));
				var attributeNode = oChart.selectNodes("rowSet[@TYPE='ATTRIBUTE']");
				for(var i = 0, attr; attr = attributeNode[i]; i++)
				{
					this.aSeries.push(attr.getAttribute("NAME"));
				}
			}
			this.oChartConfigXml = oChart;
			var expandAttrs = this.oChartConfigXml.selectSingleNode("expandAttrs").text;
			var reg = /refreshInterval\s*=\s*'([^'])*'/ig;
			if(!this.setRefreshInterval(reg, expandAttrs))
			{
				reg = /refreshInterval\s*=\s*"([^"])*"/ig;
				this.setRefreshInterval(reg, expandAttrs);
			}
			
			reg = /dataIndexStep\s*=\s*'([^'])*'/ig;
			if(!this.setDataIndexStep(reg, expandAttrs))
			{
				reg = /dataIndexStep\s*=\s*"([^"])*"/ig;
				this.setDataIndexStep(reg, expandAttrs);
			}
			
			reg = /hisRealTime\s*=\s*'([^'])*'/ig;
			if(!this.setHisRealTime(reg, expandAttrs))
			{
				reg = /hisRealTime\s*=\s*"([^"])*"/ig;
				this.setHisRealTime(reg, expandAttrs);
			}
		},
		buildChartConfig : function(result){
			var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
			var sendParams = {
				method	: "getChartConfig",
				result	: result
			};
			var sendUrl = getSendUrlByObj(CHART_CTRL_URL, sendParams);
			sendRequest.open("post", sendUrl, false);
			sendRequest.send();
			if (isSuccess(sendRequest)){
				this.setChartConfig(sendRequest.responseXML);
			}
			sendRequest.abort();
			sendRequest = null;
			
		},
		setRefreshInterval : function(reg, expandAttrs){
			var group = reg.exec(expandAttrs);
			if(group != null)
			{
				this.refreshInterval = Ext.num(group[1], 0);
				return true;
			}
			return false;
		},
		setDataIndexStep : function(reg, expandAttrs){
			var group = reg.exec(expandAttrs);
			if(group != null)
			{
				this.dataIndexStep = Ext.num(group[1], 1);
				return true;
			}
			return false;
		},
		setHisRealTime : function(reg, expandAttrs){
			var group = reg.exec(expandAttrs);
			if(group != null)
			{
				this.hisRealTime = true;
				return true;
			}
			return false;
		},
		getRealParam : function(self){
			var curDataIndex = self.curDataIndex >= self.maxDataIndex ? 0 : self.curDataIndex;
			var endDataIndex = curDataIndex + (self.dataIndexStep || 1);
			endDataIndex = endDataIndex > self.maxDataIndex ? self.maxDataIndex : endDataIndex;
			self.curDataIndex = endDataIndex;
			var param = {
				startDataIndex : curDataIndex,
				endDataIndex : endDataIndex
			};
			return param;
		},
		buildSendXml : function(params, options){
			var oSendXml = this.oResult.buildSendXml(params, options);
			var root = oSendXml.documentElement;
			if(this.oChartConfigXml){
				this.oChartConfigXml.setAttribute("buildType", this.buildType);
				root.appendChild(this.oChartConfigXml.cloneNode(true));
			}
			return oSendXml;
		},
		buildChart : function(){
			var chartObj = "chart"+document.uniqueID+"id";
			//this.buildChartConfig(this.chart);
			var nocache;
			var curDate = new Date();
			nocache = curDate.getTime();
			
			this.FCharts = new FCharts(this.chartConfig.chartType,this.chartConfig.width,this.chartConfig.height);
			this.FCharts.setTransparent(this.isTransparent);
			var self = this;
			this.FCharts.oChart.addEventListener('Zoomed', function (identifier, parameter) {
				var startIndex = parameter.startIndex - 1;
				var endIndex = parameter.endIndex - 1;

				var chartDataXML = self.FCharts.oChart.getChartData('xml');
				var doc = new ActiveXObject('Microsoft.XMLDOM');
				doc.async = false;
				doc.loadXML(chartDataXML);

				var rows = doc.selectNodes('chart/dataSet/set');
				var startValue = rows[startIndex].getAttribute('labelValue');
				var endValue = rows[endIndex].getAttribute('labelValue');

				if (startValue == null)
					self.zoomedCallback(parameter.startLabel, parameter.endLabel);
				else
					self.zoomedCallback(startValue, endValue);
			});
		},
		initZoomOut : function(){
			if(this.isShowZoomOut){
				//var zoomOutDivELe = document.getElementById("zoomOut"+this.result);
				var zoomOutdiv ;
				zoomOutdiv = document.createElement("div");
				document.getElementById("zoomOutChart").appendChild(zoomOutdiv);
				zoomOutdiv.style.display="none"; 
				zoomOutdiv.id = "zoomOut"+this.result;
				this.zoomOut = zoomOutdiv;
				zoomOutdiv.style.cursor = "hand";
				var fObject = this;
				zoomOutdiv.onclick = function(){
					ChartEvent.zoomOut(fObject);
				}
				zoomOutdiv.className= "icon-fullscreen";
				zoomOutdiv.title = getBusiMonitorFusionChartJSLan('clickBlowUp');
				zoomOutdiv.onmousemove = function(){
					zoomOutdiv.className= "icon-fullscreen-over";
				}
				zoomOutdiv.onmouseout = function(){
					zoomOutdiv.className= "icon-fullscreen";
				}
			}
		},
		createZoomElement : function(){
			if(this.isShowZoomOut&&this.getRowCount()>0){
				var left =  this.getEl().getX();
				var top = this.getEl().getY();
				var width = this.getEl().getWidth();
				var height = this.getEl().getHeight();
				var zoomOutdiv = this.zoomOut;
				zoomOutdiv.style.position="absolute"; 
				zoomOutdiv.style.display=""; 
				zoomOutdiv.style.zIndex=1000;
				zoomOutdiv.style.top = top+3;
				zoomOutdiv.style.left = left+width-20;
			}
			
		},
		afterEvent : function(ct,o,arg){
			if(this.descResult){
				var self = this;
				var fusionChart_descTitle = document.getElementById("fusionChart_descTitle_"+this.lisenceId);
				var fusionChart_descText = document.getElementById("fusionChart_descText_"+this.lisenceId);
				if(fusionChart_descTitle) fusionChart_descTitle.parentNode.removeChild(fusionChart_descTitle);
				if(fusionChart_descText) fusionChart_descText.parentNode.removeChild(fusionChart_descText);
				var resultDesc= ResultFactory.newResult(this.descResult,arg,o);
				resultDesc.async = false;
				resultDesc.onLoad = function(oXml){
					var attrsConfig = {};
					var resultRows = oXml.selectNodes("/root/rowSet");
					if(resultRows.length>0){
						for(var o in self.descParams){
							attrsConfig[o] =  resultRows[0].childNodes[self.descParams[o]-1].text;
						}
						this.ctWrap = document.getElementById(self.body.dom.id);
						if(self.descTitle){
							var descTitle = resultRows[0].childNodes[self.descTitle-1].text;
							Ext.DomHelper.insertHtml('beforeBegin',this.ctWrap,'<div id="fusionChart_descTitle_'+self.lisenceId+'" class="x-panel-body x-panel-body-noheader x-panel-body-noborder"><table cellspacing="0" width="100%" height="100%"  style="font-size:24px;text-align:center;"><tr><td><div>'+descTitle+'</div></td></tr></table></div>');
						}
						if(self.descText){
							var descText = resultRows[0].childNodes[self.descText-1].text;
							var descTextId = Ext.id();
							Ext.DomHelper.insertHtml('afterEnd',this.ctWrap,'<div id="fusionChart_descText_'+self.lisenceId+'"class="x-panel-body x-panel-body-noheader x-panel-body-noborder"><table cellspacing="0" width="100%" height="100%" style="font-size:24px;text-align:center; "><tr><td><div id="'+descTextId+'">'+descText+'</div></td></tr></table></div>');
							this.ctWrap.style.height=this.ctWrap.clientHeight-document.getElementById(descTextId).offsetHeight-40;
						}
						//document.getElementById(titleId).style.height=this.ctWrap.clientHeight-400;
						self.setAttrs(attrsConfig);
					}
				}
				resultDesc.send(Result.FORCE_GET,o);
			}
		},
		loadChartDataXML : function(){
			if (this.sendRequest.readyState == 4){
				if (isSuccess(this.sendRequest)){
					this.chartXml = new ActiveXObject("Microsoft.XMLDOM");
					this.chartXml.load(this.sendRequest.responseXML);
					var root = this.chartXml.documentElement;

					if (typeof this.filterChartXml == 'function') {
						this.filterChartXml(this.chartXml);
					}

					var oChart = this.chartXml.selectSingleNode('/root').firstChild;
					var attrs = this.oAttrs;
					if(attrs){
						for(var o in attrs){
							oChart.setAttribute(o,attrs[o]);
						}	
					}
					 
					oChart.setAttribute('showAboutMenuItem',0);
					oChart.setAttribute('showPrintMenuItem','0');

					if (this.needRecreate && this.isExist) {
						if(this.oFusionChart!=undefined){
							this.oFusionChart.dispose()
						}
						var chartObj = "chart"+document.uniqueID;
						this.oFusionChart = new FusionCharts(this.chartConfig.chartSwf,chartObj,this.chartConfig.width,this.chartConfig.height);
						var oc = this.oFusionChart;
						var domId = this.body.dom.id;
						setTimeout(function() {
							oc.setXMLData(oChart.xml);
							oc.configure("ChartNoDataText", getBusiMonitorFusionChartJSLan('noData'));
							oc.render(domId);
						}, 100);
						return;
					}
					this.chartClone = oChart.cloneNode(true);
					if(/RealTime/i.test(this.getChartType()) && this.refreshInterval > 0)
					{
						this.processRealTimeTask(oChart);
					}
					this.FCharts.setXMLData(oChart);
					this.FCharts.configure("ChartNoDataText", getBusiMonitorFusionChartJSLan('noData'));
					if(this.isExist==false)	this.FCharts.write(this.body.dom.id);
					this.isExist = true;
					this.createZoomElement();
				}
			}
		},
		processRealTimeTask : function(oChart){
			var dataSets = oChart.selectNodes("dataSet");
			this.aSeriesName = [];
			for(var i = 0, dataSet; dataSet = dataSets[i]; i++)
			{
				this.aSeriesName.push(dataSet.getAttribute("seriesName"));
				this.maxDataIndex = dataSet.childNodes.length;
			}
			for(var i = oChart.childNodes.length - 1, child; child = oChart.childNodes[i]; i--)
			{
				if(child.tagName == 'categories' || child.tagName == 'dataSet')
				{
					for(var j = child.childNodes.length - 1, set; set = child.childNodes[j]; j--)
					{
						child.removeChild(set);
					}
				}
			}
			if (this.chartUpdateTimer)
			{
				window.clearInterval(this.chartUpdateTimer);
			}
			this.runRealTimeTask();
		},
		runRealTimeTask : function(){
			var self = this;
			self.oResult.onLoad = self.loadRealTimeData.createDelegate(window, self, true);
			self.chartUpdateTimer = window.setInterval(function(){
				self.updateRealChart(self);
			}, self.refreshInterval * 1000);
		},
		updateRealChart : function(oFusionChart){
			if(oFusionChart.hisRealTime == true)
			{
				oFusionChart.drawHisRealChart(oFusionChart);
			}
			else
			{
				oFusionChart.oResult.send(Result.FORCE_GET, oFusionChart.searchObject, oFusionChart.searchArg || null);
			}
		},
		drawHisRealChart : function(oFusionChart){
			if(!oFusionChart.feeded)
			{
				oFusionChart.FCharts.oChart.feedData("&label=start&value=");
				window.clearInterval(this.chartUpdateTimer);
				oFusionChart.feeded = true;
				oFusionChart.chartUpdateTimer = window.setInterval(function(){
					oFusionChart.updateRealChart(oFusionChart);
				}, oFusionChart.refreshInterval * 1000);
				return;
			}
			var dataSets = oFusionChart.chartClone.selectNodes("dataSet");
			var aTmpData = [];
			var aData = [];
			for(var i = 0, dataSet; dataSet = dataSets[i]; i++)
			{
				for(var j = 0, set; set = dataSet.childNodes[j]; j++)
				{
					var sLabel = set.getAttribute('label');
					var sValue = set.getAttribute('value');
					aTmpData[sLabel] = aTmpData[sLabel] ?  aTmpData[sLabel] + "|" + sValue : sValue;
					aData[j] = { label : sLabel, value : aTmpData[sLabel]};
				}
			}
			var param = oFusionChart.getRealParam(oFusionChart);
			for (var i = param.startDataIndex, record; record = aData[i]; i++)
			{
				if(i >= param.endDataIndex)
				{
					break;
				}
				else
				{
					oFusionChart.FCharts.oChart.feedData("&label=" + record.label + "&value=" + record.value);
				}
			}
		},
		loadRealTimeData : function(oXml, oFusionChart){
			var data = oFusionChart.createRealTimeData(oXml, oFusionChart);
			var oChart = oFusionChart.FCharts.oChart;
			for (var i = 0, record; record = data[i]; i++)
			{
				oFusionChart.FCharts.oChart.feedData("&label=" + record.label + "&value=" + record.value);
			}
		},
		createRealTimeData : function(oXml, oFusionChart)
		{
			var yField = oFusionChart.oChartConfigXml.getAttribute("yField");
			var xField = oFusionChart.oChartConfigXml.getAttribute("xField");
			var data = [];
			var rowList = oXml.selectNodes("/root/rowSet");
			var oData = {};
			for(var i = 0, seriesName; seriesName = oFusionChart.aSeriesName[i]; i++)
			{
				for (var j = 0, row; row = rowList[j]; j++)
				{
					for(var x = 0, series; series = oFusionChart.aSeries[x]; x++)
					{
						if(row.selectSingleNode(series).text == seriesName)
						{
							var sLabel = row.selectSingleNode(xField).text;
							var sValue = row.selectSingleNode(yField).text;
							oData[sLabel] = oData[sLabel] ?  oData[sLabel] + "|" + sValue : sValue;
						}
					}
				}
			}
			for(var o in oData)
			{
				var record = {
					label : o,
					value : oData[o]
				};
				data.push(record);
			}
			return data;
		},
		// 用于手动设置图表数据
		setChartDataXML : function(chartXml){
			this.chartXml = chartXml;
			var oChart = this.chartXml.selectSingleNode('/root/chart');

			var attrs = this.oAttrs;
			if (attrs) {
				for (var o in attrs){
					oChart.setAttribute(o, attrs[o]);
				}	
			}
			oChart.setAttribute('showAboutMenuItem',0);
			oChart.setAttribute('showPrintMenuItem','0');
			this.chartClone = oChart.cloneNode(true);
			if(/RealTime/i.test(this.getChartType()) && this.refreshInterval > 0)
			{
				this.processRealTimeTask(oChart);
			}
			this.FCharts.setXMLData(oChart);
			
			this.FCharts.configure("ChartNoDataText", getBusiMonitorFusionChartJSLan('noData'));
			if (!this.isExist)	
				this.FCharts.write(this.body.dom.id);
			this.isExist = true;


			//this.FCharts.setXMLData(oChart);
		},
			
		getRowCount	:	function(){
			return this.FCharts.rowCount;
		},
		getChartType: function() {
			return this.chartConfig.chartType;
		},
		setZoomedCallback: function(callback) {
			this.zoomedCallback = callback;
		},
		buildChartData :  function(params, options){
			var sendParams = {
				method	: "getChartData",
				ref		: "sqlResult",
				getType	: "FORCE"
			};
			var self = this;
			var sendUrl = getSendUrlByObj(CHART_CTRL_URL, sendParams);
			this.sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
			this.sendRequest.open("post", sendUrl, "true");
			this.sendRequest.send(this.buildSendXml(params, options));
			this.sendRequest.onreadystatechange = function(){
				self.loadChartDataXML();
			}
		},
		onRender : function(ct, position){
			FusionChartPanel.superclass.onRender.call(this, ct, position);
			this.buildChart();
		},
		initComponent	: function(){
			this.init();
			if(this.cfgData)
			{				
				if(typeof this.cfgData == 'string')
				{
					var cfgDom = new ActiveXObject("Microsoft.XMLDOM");
					cfgDom.loadXML(this.cfgData);
					this.cfgData = cfgDom;
				}
				
				this.setChartConfig(this.cfgData);
			}
			else
			{
				this.buildChartConfig(this.chart);	
			}			
			FusionChartPanel.superclass.initComponent.call(this);
		},
		initEvents		: function()
		{
			FusionChartPanel.superclass.initEvents.call(this);
		},
		search 	: function(o, arg) {
			o = o || {};
			this.searchObject = o;
			this.searchArg = arg;
			this.afterEvent(this.ctWrap,o,arg);
			this.buildChartData(o,arg);
			this.initZoomOut();
		}
	});
	return FusionChartPanel;  
})();
Ext.reg('FusionChart', FusionChart);
