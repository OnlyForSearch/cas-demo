//$import("/resource/js/charts/fusionCharts/FusionCharts.js", "FusionChart.js");
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
	var SELF = "GD_DTP_FusionChart.js";
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
			if(this.chart){
				this.oResult = ResultFactory.newResult(this.chart);
				this.oResult.loadRenderCfg();
				
				if(this.oResult.renderCfg){
					var showCfg = this.oResult.renderCfg.show.config;
					if(showCfg){
						this.descResult = showCfg.descResult;
						this.descParams = showCfg.descParams;
						this.descTitle = showCfg.descTitle;
						this.descText = showCfg.descText;
					}
				}
				
			}
			//FusionChartPanel.superclass.constructor.call(this, config);
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
						this.descResult = showCfg.descResult;
						this.descParams = showCfg.descParams;
						this.descTitle = showCfg.descTitle;
						this.descText = showCfg.descText;
				}
			}
			this.buildChartConfig(this.chart);
			this.buildChart();
			this.search(this.searchObject,this.searchArg);
		},
		buildChartConfig : function(result){
			var oXmlConfig;// = new ActiveXObject("Microsoft.XMLDOM");
			//oXmlConfig.async = false;
			var sendRequest = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
			var sendParams = {
				method	: "getChartConfig",
				result	: result
			};
			var sendUrl = getSendUrlByObj(CHART_CTRL_URL, sendParams);
			sendRequest.open("post", sendUrl, false);
			sendRequest.send();
			if(window.ActiveXObject)
			{
				oXmlConfig  = new ActiveXObject("Microsoft.XMLDOM");
				oXmlConfig.async = false;
				if (isSuccess(sendRequest)){
					oXmlConfig.load(sendRequest.responseXML);
				}
			}
			else
			{
				var parser = new DOMParser();
        		oXmlConfig = parser.parseFromString(sendRequest.responseText, "text/xml");
			}
			sendRequest.abort();
			sendRequest = null;
			var oChart = selectSingleNode(oXmlConfig,'/root/chart');
			if (oChart){
				this.chartConfig.chartSwf = CHART_SWF+oChart.getAttribute("chartType")+".swf";
				this.chartConfig.chartType = oChart.getAttribute("chartType");
				this.chartConfig.width = oChart.getAttribute("width");
				this.chartConfig.height = oChart.getAttribute("height");
				this.title = getXmlText(selectSingleNode(oChart, "title"));

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
			this.oChartConfigXml = oChart.cloneNode(true);
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
					var resultRows = selectNodes(oXml, "/root/rowSet");
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
				if(window.ActiveXObject)
				{			
					if (isSuccess(this.sendRequest)){
						this.chartXml = new ActiveXObject("Microsoft.XMLDOM");
						this.chartXml.load(this.sendRequest.responseXML);
					}
				}
				else
				{
					var parser = new DOMParser();
        			this.chartXml = parser.parseFromString(this.sendRequest.responseText, "text/xml");
				}
				var root = this.chartXml.documentElement;

				if (typeof this.filterChartXml == 'function') {
					this.filterChartXml(this.chartXml);
				}

				//var oChart = this.chartXml.selectSingleNode('/root').firstChild;
				var oChart = selectSingleNode(this.chartXml, '/root').firstChild;
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
				this.FCharts.setXMLData(oChart);
				this.FCharts.configure("ChartNoDataText", getBusiMonitorFusionChartJSLan('noData'));
				if(this.isExist==false)	this.FCharts.write(this.body.dom.id);
				this.isExist = true;
				this.createZoomElement();
			}
		},

		// 用于手动设置图表数据
		setChartDataXML : function(chartXml){
			this.chartXml = chartXml;
			var oChart = this.chartXml.selectSingleNode('/root').firstChild;

			var attrs = this.oAttrs;
			if (attrs) {
				for (var o in attrs){
					oChart.setAttribute(o, attrs[o]);
				}	
			}
			oChart.setAttribute('showAboutMenuItem',0);
			oChart.setAttribute('showPrintMenuItem','0');
			
			this.FCharts.configure("ChartNoDataText", getBusiMonitorFusionChartJSLan('noData'));
			if (!this.isExist)	
				this.FCharts.write(this.body.dom.id);
			this.isExist = true;


			this.FCharts.setXMLData(oChart);
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
			this.sendRequest = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
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
			this.buildChartConfig(this.chart);
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

function selectSingleNode(node, xpath) {
    if (!window.ActiveXObject) 
    {
        var x = selectNodes(node, xpath)
        if (!x || x.length < 1) return null;
        return x[0];
    }
    else 
    {
        return node.selectSingleNode(xpath);
    }
}

function selectNodes(node, xpath) {
    if (!window.ActiveXObject)
    {
        var xpe = new XPathEvaluator();
        var nsResolver = xpe.createNSResolver(node.ownerDocument == null ? node.documentElement : node.ownerDocument.documentElement);
        var result = xpe.evaluate(xpath, node, nsResolver, 0, null);
        var found = [];
        var res;
        while (res = result.iterateNext())
            found.push(res);
        return found;
    }
    else {
        return node.selectNodes(xpath);
    }
}

function getXmlText(node) {
    if (typeof(node.text) != "undefined")
    {
        return node.text;
    }
    else
    {
        return node.textContent;
    }
}