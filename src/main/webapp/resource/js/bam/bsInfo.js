var GRAPH_URL = '../../servlet/DisplayChart?filename=';
var REPORT_URL = '../../servlet/ReportAction?';
var CHART_URL = '../../servlet/ReportChart?';
var BAM_URL = '../../servlet/BAMAction?';
var ALARM_MSG_URL = '../alarmManage/alarmMergeList.htm?';

function BuildChart()
{
	this.showAt;
	this.width;
	this.height;
	this.cfgXml;
	this.paramCfgId;
	this.reportId;
	this.chartType;
	this.isOutHead = -1;
	this.isShowBase = -1;
	this.attributeList;
	this.metricList;
	this.otherIndex = -1;
	this.orderStr = '';
	this.legendShow = 1;
	this.onloadChart;
	this.onBuild;
	this.filterXml;
	this.filterList;
	this.hasMap;
	this.mapId;
	this.dataXml;
	this.chartXml;
	this.chartHtml;
	this.headNode;
	this.mapNode;
	this.sendChartRequest;
}

BuildChart.prototype.setWidth = function(iWidth)
{
	this.width = iWidth;
	getElement(this.showAt,'span').style.width = iWidth;
}

BuildChart.prototype.setHeight = function(iHeight)
{
	this.height = iHeight;
	this.showAt.style.height = iHeight+2;
}

BuildChart.prototype.loadCfg = function(oXml,id)
{
	if(typeof id == "undefined")
	{
		id = this.showAt.id;
	}
	this.cfgXml = oXml.selectSingleNode('/root/PAGE/ELEMENT[@id="'+id+'"]');
	if(this.cfgXml)
	{
		this.paramCfgId = this.cfgXml.getAttribute("paramCfgId");
		this.reportId = this.cfgXml.getAttribute("reportId");
		this.chartType = this.cfgXml.getAttribute("chart");
		this.isOutHead = this.cfgXml.getAttribute("isOutHead");
		this.attributeList =this.doNodeList(this.cfgXml.selectNodes('CFG_LIST/CFG[@category="ATTRIBUTE"]'));
		this.metricList = this.doNodeList(this.cfgXml.selectNodes('CFG_LIST/CFG[@category="METRIC"]'));
		var sortNode = this.cfgXml.selectSingleNode('SORT_STR');
		if(sortNode)
		{
			this.orderStr = sortNode.text;
		}
		var onLoadNode = this.cfgXml.selectSingleNode('ONLOAD_FUNC');
		if(onLoadNode)
		{
			this.onloadChart = eval(onLoadNode.text);
		}
		var onBuildNode = this.cfgXml.selectSingleNode('BUILD_FUNC');
		if(onBuildNode)
		{
			this.onBuild = onBuildNode.text;
		}
	}
}

BuildChart.prototype.doNodeList = function(nodeList)
{
	var returnList = new Array(nodeList.length);
	for(var i=0;i<nodeList.length;i++)
	{
		returnList[i] = nodeList[i].text;
	}
	return returnList;
}

BuildChart.prototype.build = function ()
{
	if(this.reportId)
	{
		switch(this.onBuild.toLowerCase())
		{
			case 'buildchart':
				this.buildChart();
				break;
			case 'builddata':
				this.buildDataXml();
				break;
			default:
				EMsg('构建方法配置错误,请查看数据库配置!');
		}
	}
}

BuildChart.prototype.wait = function ()
{
	this.showAt.innerHTML = '<div style="height:29">'
			              +   '<img src="../../resource/image/ico/spinner.gif" align="absmiddle">'
			              +   '<span style="height:100%;padding:9 0 0 3">图片载入中...</span>'
			              + '</div>';
}

BuildChart.prototype.getFilterXml = function ()
{
	var sendParams;
	if(this.paramCfgId)
	{
		sendParams = new Array("action=3","id="+this.reportId,"paramCfgId="+this.paramCfgId);
	}
	else
	{
		sendParams = new Array("action=5","id="+this.reportId);
	}
	var sendUrl = getSendUrl(REPORT_URL,sendParams);
	var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
	xmlRequest.open("post",sendUrl,"false");
	xmlRequest.send();
	if(isSuccess(xmlRequest))
	{
		this.filterXml = getRequestXml(xmlRequest);
	}
	cancelRequest(xmlRequest);
}

BuildChart.prototype.buildFilterXml = function ()
{
	var filterNode;
	var filterList = this.filterXml.selectNodes('/root/params/param');
	for(var i=0;i<filterList.length;i++)
	{
		if(this.paramCfgId)
		{
			filterNode = filterList[i];
			var getFunc = filterNode.getAttribute("getFunc");
			if(getFunc)
			{
				filterNode.text = eval(getFunc);
			}
		}
		else
		{
			var xPath = '/root/params/param[@name="'+this.filterList[i].key+'"]'
			oFilterNode = this.filterXml.selectSingleNode(xPath);
			if(oFilterNode)
			{
				oFilterNode.text = this.filterList[i].value;
			}
		}
	}
}

BuildChart.prototype.addFieldCfg = function (sendList,cfgList,tagName)
{
	for(var i=0;i<cfgList.length;i++)
	{
		sendList.push(tagName+"="+cfgList[i]);
	}
}

BuildChart.prototype.buildChart = function ()
{
	this.getFilterXml();
	if(this.filterXml)
	{
		this.wait();
		if(this.mapId)
		{
			document.getElementById(this.mapId).removeNode(true);
		}
		this.buildFilterXml();
		var oBuildChart = this;
		this.mapId = (this.hasMap===false)?"null":document.uniqueID;
		var sendParams = new Array();
		sendParams.push("id="+this.reportId);
		sendParams.push("chart="+this.chartType);
		sendParams.push("width="+this.width);
		sendParams.push("height="+this.height);
		sendParams.push("mapId="+this.mapId);
		sendParams.push("isOutHead="+this.isOutHead);
		sendParams.push("isShowBase="+this.isShowBase);
		sendParams.push("other="+this.otherIndex);
		sendParams.push("orderStr="+this.orderStr);
		sendParams.push("legendShow="+this.legendShow);
		this.addFieldCfg(sendParams,this.attributeList,"attribute");
		this.addFieldCfg(sendParams,this.metricList,"metric");
		var sendUrl = getSendUrl(CHART_URL,sendParams);
		//alert(sendUrl);
		this.sendChartRequest = new ActiveXObject("Microsoft.XMLHTTP");
		this.sendChartRequest.onreadystatechange = function ()
		{
			oBuildChart.outChartXml();
		}
		this.sendChartRequest.open("post",sendUrl,"true");
		this.sendChartRequest.send(this.filterXml);
	}
}

BuildChart.prototype.buildDataXml = function ()
{
	this.getFilterXml();
	if(this.filterXml)
	{
		this.buildFilterXml();
		var sendParams = new Array("action=0","id="+this.reportId);
		var sendUrl = getSendUrl(REPORT_URL,sendParams);
		var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
		xmlRequest.open("post",sendUrl,"false");
		xmlRequest.send(this.filterXml);
		if(isSuccess(xmlRequest))
		{
			this.dataXml = getRequestXml(xmlRequest);
		}
		cancelRequest(xmlRequest);
		if(this.onloadChart)
		{
			this.onloadChart();
		}
	}
}

BuildChart.prototype.buildChartXml = function ()
{
	this.getFilterXml();
	if(this.filterXml)
	{
		this.buildFilterXml();
		var sendParams = new Array();
		sendParams.push("action="+4);
		sendParams.push("id="+this.reportId);
		this.addFieldCfg(sendParams,this.attributeList,"attribute");
		this.addFieldCfg(sendParams,this.metricList,"metric");
		this.addFieldCfg(sendParams,this.orderList,"order");
		var sendUrl = getSendUrl(REPORT_URL,sendParams);
		var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
		xmlRequest.open("post",sendUrl,"false");
		xmlRequest.send(this.filterXml);
		if(isSuccess(xmlRequest))
		{
			this.dataXml = getRequestXml(xmlRequest);
		}
		cancelRequest(xmlRequest);
	}
}

BuildChart.prototype.outChartXml = function ()
{
	if(this.sendChartRequest.readyState == 4)
	{
		if(isSuccess(this.sendChartRequest))
		{
			this.chartXml = getRequestXml(this.sendChartRequest);
			this.chartHtml = '<img width="'+this.width+'" '
				           +    'height="'+this.height+'" '
				           +    'src="'+GRAPH_URL+this.chartXml.selectSingleNode('/root/src').text+'" '
				           +    'usemap="#'+this.mapId+'" '
				           +    'style="border:0" '
				           + '>';
			this.headNode = this.chartXml.selectSingleNode('/root/Fields');
			this.mapNode = this.chartXml.selectSingleNode('/root/map');
			if(this.onloadChart)
			{
				this.onloadChart();
			}
			else
			{
				this.buildChartMap();
				this.showAt.innerHTML = this.chartHtml;
			}
		}
		cancelRequest(this.sendChartRequest);
	}
}

BuildChart.prototype.buildChartMap = function()
{
	if(this.hasMap !== false)
	{
		for(var i=0;i<this.mapNode.childNodes.length;i++)
		{
			var oNode = this.mapNode.childNodes[i];
			var title = oNode.getAttribute("g");
			var obj = new Object();
			obj.x = oNode.getAttribute("x");
			obj.y = oNode.getAttribute("y");
			var list = new Array(obj);
			oNode.setAttribute("overHtml",buildTitle(title,list));
		}
		document.body.insertAdjacentHTML('afterBegin',this.mapNode.xml);
	}
}

function getPageCfg(pageId)
{
	var pageCfgXml;
	var sendParams = new Array();
	sendParams.push("action="+4);
	sendParams.push("pageId="+pageId);
	var sendUrl = getSendUrl(BAM_URL,sendParams);
	var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
	xmlRequest.open("post",sendUrl,"false");
	xmlRequest.send();
	if(isSuccess(xmlRequest))
	{
		pageCfgXml = getRequestXml(xmlRequest);
	}
	cancelRequest(xmlRequest);
	return pageCfgXml;
}

function getRequestXml(_xmlRequest)
{
	var oXml = new ActiveXObject("Microsoft.XMLDOM");
	oXml.async = false;
	oXml.load(_xmlRequest.responseXML);
	return oXml;
}

function cancelRequest(_xmlRequest)
{
	_xmlRequest.abort();
	_xmlRequest = null;
}

function toNumber(val)
{
	var re = /,/g;
	return parseFloat(val.replace(re,''));
}

function buildTitle(g,list)
{
	var sHtml = '<div style="padding:3">'
	if(g)
	{
		sHtml += '<span style="font-weight:bold;border-bottom:1px dashed black;padding:0 20 0 0">'+g+'</span>'
	}
  	sHtml += '<div style="padding:5 0 0 10">';
	for(var i=0;i<list.length;i++)
	{
		sHtml += '<div style="margin-top:1">'+list[i].x+'='+list[i].y+'</div>';
	}		  
	sHtml	  +=   '</div>'
	          + '</div>';
	return sHtml;
}

function overlib()
{
	showPopupLayer(event.srcElement.overHtml,160);
}

function nd()
{
	hiddenPopupLayer();
}

function getWaitImgHtml()
{
	var sHtml = '<div style="height:29">'
              +   '<img src="../../resource/image/ico/spinner.gif" align="absmiddle">'
              +   '<span style="height:100%;padding:9 0 0 3">图片载入中...</span>'
              + '</div>';
    return sHtml;
}

function buildKpiListHtml()
{
	if(this.dataXml)
	{
		var sHtml = ''
		var kpiList = this.dataXml.selectNodes('/root/rowSet');
		var kpiNode,label,value;
		for(var i=0;i<kpiList.length;i++)
		{
			kpiNode = kpiList[i];
			label = kpiNode.selectSingleNode('*[0]').text;
			value = kpiNode.selectSingleNode('*[1]').text;
			sHtml += '<div style="white-space:nowrap;overflow-y:hidden;width:100%;height:20;cursor:default">'
			       +   '<img src="../../resource/image/ico/item1.gif" align="absmiddle"/>'
			       +   '<span style="height:100%;padding:4 0 0 3;">'+label+':</span>'
			       +   '<span style="height:100%;padding:4 0 0 5;">'+value+'</span>'
			       + '</div>'
		}
		this.showAt.innerHTML = sHtml;
	}
}

function linkTopoChart()
{
	doWindow_open('../topo/linkTopo.html?chartId='+topoChart+'&comeFrom=job');
}

function linkHight()
{
	doWindow_open('bsMonitor.html?reportCategory=HIGH&id='+neTypeId);
}

function linkStudy()
{
	doWindow_open('bsMonitor.html?reportCategory=STUDY&id='+neTypeId);
}