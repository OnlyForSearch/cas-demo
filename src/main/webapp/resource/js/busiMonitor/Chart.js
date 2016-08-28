var busiMonitorChartJSDefaultLang = {
	picLoding : '图片载入中...'
};
//获取语言资源
function getBusiMonitorChartJSLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('busiMonitorChartJSDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.busiMonitorChartJS.' + code);
	}
}

var Chart = (function()
{
	var SELF = "Chart.js";
	var CHART_CTRL_URL = getRealPath("../../../servlet/chart.do?", SELF);
	var GRAPH_URL = getRealPath("../../../servlet/DisplayChart?filename=", SELF);
	var WAIT_IMG_SRC = getRealPath("../../image/ico/spinner.gif", SELF);
	var COYP_ATT_NAME = ["order", "isAuotGroup", "groupType", "chartType",
			"legend", "width", "height", "DateFormat", "TimeSeriesType",
			"isShowItem", "isShapesVisible", "imgPointUrl", "imgOnClick",
			"buildType", "xField"];
	var mapId = 1;

	function buildFieldNode(oDoc, oParent, oInfo)
	{
		var index = oParent.childNodes.length;
		for (var i = 0, oField, oFieldNode; oField = oInfo.list[i]; i++)
		{
			oFieldNode = oDoc.createElement("rowSet");
			ResultFactory.copyObjAtt(oFieldNode, oField, ["NAME", "LABEL"]);
			ResultFactory.copyObjAtt(oFieldNode, oInfo, ["TYPE"]);
			index = (oParent.getAttribute("isAuotGroup") == "-1")
					? index + 1
					: oField.INDEX || "0";
			oFieldNode.setAttribute("INDEX", index - 1);
			oParent.appendChild(oFieldNode);
		}
	}

	var BUILD_TYPE = {
		img		: {
			method		: "getChart",
			loadFunc	: "buildChart"
		},
		data	: {
			method		: "getChartData",
			loadFunc	: "buildChartData"
		}
	}

	function Obj(config)
	{
		config = config || {};
		this.buildType = 'img';
		this.oResult;
		this.renderTo;
		this.oParam = {};
		this.attrInfo = {
			list	: [],
			TYPE	: "ATTRIBUTE"
		}
		this.metrInfo = {
			list	: [],
			TYPE	: "METRIC"
		};
		this.renderTo;
		this.isAuotGroup = true;
		this.order = "";
		this.groupType;
		this.chartType;
		this.legend = 1;
		this.width = 300;
		this.height = 200;
		this.DateFormat = "MM-dd HH:mm";
		this.TimeSeriesType = 7;
		this.isShowItem = "0";
		this.isShapesVisible = "0";
		this.imgPointUrl = "0";
		this.imgOnClick = "";
		this.imgOndblClick = "";
		this.isOutMap = false;
		this.imgMapId;
		this.sendRequest;
		this.chartXml;
		this.oImg;
		this.onLoad;
		if (config.attrList)
		{
			this.attrInfo.list = config.attrList;
			delete config.attrList;
		}
		if (config.metrList)
		{
			this.metrInfo.list = config.metrList;
			delete config.metrList;
		}
		if (config.result)
		{
			this.oResult = ResultFactory.newResult(config.result, null,
					this.oParam);
			// delete config.result;
		}
		ResultFactory.copy(this, config);
		
		if(typeof((this.result))!="undefined" && !isNaN(this.result)){
			var oChartXmlConfig = Obj.getChartConfig(this.result);
			if (oChartXmlConfig)
			{
				var sJfreeChartConfig = oChartXmlConfig
						.selectSingleNode('jfreeChartConfig').text;
				if (sJfreeChartConfig)
				{
					var jfreeChartConfig = EncodeSpecialStrs(sJfreeChartConfig, [
									"&amp;", "&gt;", "&lt;", "&quot;"], ['&', '>',
									'<', '"'])
					if (jfreeChartConfig && jfreeChartConfig != '')
					{
						if (jfreeChartConfig.attrList)
						{
							this.attrInfo.list = jfreeChartConfig.attrList;
							delete jfreeChartConfig.attrList;
						}
						if (jfreeChartConfig.metrList)
						{
							this.metrInfo.list = jfreeChartConfig.metrList;
							delete jfreeChartConfig.metrList;
						}
						ResultFactory.copy(this, Ext.decode(jfreeChartConfig));
					}
				}
			}
		}
	}

	ResultFactory.copy(Obj, {
				METRIC_GROUP	: "Metr",
				ATTRIBUTE_GROUP	: "Attr",
				getChartConfig	: function(result)
				{
					var oXmlConfig = new ActiveXObject("Microsoft.XMLDOM");
					oXmlConfig.async = false;
					var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
					var sendParams = {
						method	: "getChartConfig",
						result	: result
					};
					var sendUrl = getSendUrlByObj(CHART_CTRL_URL, sendParams);
					sendRequest.open("post", sendUrl, false);
					sendRequest.send();
					if (isSuccess(sendRequest))
					{
						oXmlConfig.load(sendRequest.responseXML);
					}
					sendRequest.abort();
					sendRequest = null;
					var oChart = oXmlConfig.selectSingleNode('/root/chart');
					if (oChart)
					{
						if (oChart.attributes.length == 0)
						{
							oChart = null;
						}
					}
					return oChart;
				}
			});

	Obj.prototype = {
		getRender			: function()
		{
			if (typeof this.renderTo == "string")
			{
				this.renderTo = document.getElementById(this.renderTo)
			}
			return this.renderTo;
		},
		setResult			: function(oResult)
		{
			this.oResult = oResult;
		},
		setKey				: function(key)
		{
			this.oResult = ResultFactory.newResult(key, null, this.oParam);
		},
		setParam			: function(name, value)
		{
			this.oParam[name] = value;
		},
		addAttr				: function(oField)
		{
			this.attrInfo.list.push(oField);
		},
		setAttrs			: function(list)
		{
			this.attrInfo.list = list;
		},
		addMetr				: function(oField)
		{
			this.metrInfo.list.push(oField);
		},
		setMetrs			: function(list)
		{
			this.metrInfo.list = list;
		},
		getMapId			: function()
		{
			var sRtn = "chart_map_" + mapId;
			mapId++;
			return sRtn;
		},
		wait				: function()
		{
			this.getRender().innerHTML = '<div style="height:29">'
					+ '<img src="../../resource/image/ico/spinner.gif" align="absmiddle">'
					+ '<span style="height:100%;padding:9 0 0 3;font-size:9pt;">' + getBusiMonitorChartJSLan('picLoding') + '</span>'
					+ '</div>';
		},
		buildSendXml		: function(params, options)
		{
			var op = [];
			for (var c in params)
			{	
				op[c] = params[c];
			}
			var oSendXml = this.oResult.buildSendXml(params, options);
			var root = oSendXml.documentElement;
			if (this.chartXmlConfig)
			{
				if(this.oResult.renderCfg){
					var showCfg = this.oResult.renderCfg.show.config;
					if (showCfg && showCfg.isAddParamTbar) {
						for(var c in op)
						{
							var path = "root/result/param[@name='" + c + "']";
							var node = oSendXml.selectSingleNode(path);
							if(node)
							{
								if(typeof op[c] == 'object')
									node.text = op[c].value;
								else
									node.text = op[c];
							}
						}
					}
				}
				root.appendChild(this.chartXmlConfig.cloneNode(true));
			}
			else
			{
				var chartRoot = oSendXml.createElement("chart");
				ResultFactory.copyObjAtt(chartRoot, this, COYP_ATT_NAME);
				if (this.isOutMap)
				{
					this.imgMapId = this.getMapId();
					chartRoot.setAttribute("mapId", this.imgMapId);
				}
				root.appendChild(chartRoot);
				buildFieldNode(oSendXml, chartRoot, this.attrInfo);
				buildFieldNode(oSendXml, chartRoot, this.metrInfo);
			}
			return oSendXml;
		},
		send				: function(getType, params, options)
		{
			if (this.getRender())
			{
				this.wait();
			}
			var oBuildType = BUILD_TYPE[this.buildType];
			this.sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
			this.sendRequest.onreadystatechange = (function(self)
			{
				return function()
				{
					self.readyStateChange(oBuildType);
				}
			})(this)
			var sendParams = {
				method	: oBuildType.method,
				ref		: this.oResult.ref,
				getType	: getType
			};
			var sendUrl = getSendUrlByObj(CHART_CTRL_URL, sendParams);
			this.sendRequest.open("post", sendUrl, "true");
			this.sendRequest.send(this.buildSendXml(params, options));
		},
		readyStateChange	: function(o)
		{
			if (this.sendRequest.readyState == 4)
			{
				if (isSuccess(this.sendRequest))
				{
					this.chartXml = new ActiveXObject("Microsoft.XMLDOM");
					this.chartXml.async = false;
					this.chartXml.load(this.sendRequest.responseXML);
					var buildFunc = Obj.prototype[o.loadFunc];
					buildFunc.apply(this);
				}
			}
		},
		buildChart			: function()
		{
			this.oImg = document.createElement("img");
			var imgSrc = this.chartXml.selectSingleNode('/root/src').text;
			var mapNd = this.chartXml.selectSingleNode('/root/map');
			this.oImg.src = GRAPH_URL + imgSrc;
			this.oImg.width = this.width;
			this.oImg.height = this.height;
			this.oImg.style.border = '0px';
			if (this.imgOnClick != "")
			{
				this.oImg.onclick = this.imgOnClick;
			}
			if (this.imgOndblClick != "")
			{
				this.oImg.ondblclick = this.imgOndblClick;
			}
			if (mapNd)
			{
				var mapId = mapNd.getAttribute("id");
				this.oImg.useMap = "#" + mapId;
				document.body.insertAdjacentHTML('afterBegin', mapNd.xml);
			}
			if (this.onLoad && typeof this.onLoad == "function")
			{
				this.onLoad(this.oImg, this.chartXml);
			}
			else
			{
				this.getRender().innerHTML = this.oImg.outerHTML;
			}
		},
		buildChartData		: function()
		{
			if (this.onLoad && typeof this.onLoad == "function")
			{
				this.onLoad(this.chartXml);
			}
		}
	};

	return Obj;
})();