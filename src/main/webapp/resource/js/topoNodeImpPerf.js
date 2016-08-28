var perfThresholdBoxArr = new Array();
var perfBoxArr = new Array();
var impPerfThresholdIdPrefix = 'IMP_PERF_THRESHOLD_';
var impPerfIdPrefix = 'IMP_PERF_';
var impPerfThresholdTemplate = '<div onmouseout="hideImpPerfThreshold(#ID)" onmouseover="showImpPerfThreshold(#ID)" id="#ID" style="display:none;POSITION:absolute;z-index:420;top:#TOP;left:#LEFT;text-align:center;width:190px;padding:2px 0px 2px 2px;">' +
	'<b class="b1"></b><b class="b2 d1"></b><b class="b3 d1"></b><b class="b4 d1"></b>' +
	'<div class="b d1 k">#CONTENT_HTML' +
	'</div>' +
	'<b class="b4b d1"></b><b class="b3b d1"></b><b class="b2b d1"></b><b class="b1b"></b></div>';
	
var impPerfTemplate = '<span id="#ID" onmouseout="hideImpPerfThreshold(\'#THRESHOLDID\')" onmouseover="showImpPerfThreshold(\'#THRESHOLDID\')" style="eight:8px;width:8px;POSITION:absolute;z-index:400;top:#TOP;left:#LEFT;border:1px solid #000000;background-color:#BG_COLOR;">&nbsp;&nbsp;</span>';

var mapImpPerfPrefix = 'MAP_IMPPERF_PREFIX_';
var mapImpPerfThresholdTemplate = '<div id="#ID" style="display:none;POSITION:absolute;z-index:420;top:0;left:0;text-align:center;padding:4px;background-color:#FFFFFF;border:1px solid #DDDDFF;">' +
	'#CONTENT_HTML</div>';
var curStaffRegionId = getCurrentUserInfo('region_id');
var selRegionId = curStaffRegionId;
var parentNodeNeId;
function iniNodeDescPerf(){
	var oRegionList = document.getElementById('sfmRegionListDiv');
	
	oRegionList.style.display = '';
	sfmRegionList.value = curStaffRegionId;
	sfmRegionList.onResultChange = loadNodeDescAndPerf;
	
	if(curStaffRegionId != '-1' && curStaffRegionId != '0' && curStaffRegionId != '1' && curStaffRegionId != '2')
	{
		oRegionList.style.display = 'none';
	}
	loadNodeDescAndPerf();
}

function loadNodeDescAndPerf(){
	loadDesc();
	loadNodeImpPerf();
}
//加载节点重要性能，以小方块的方式显示在节点右上角
function loadNodeImpPerf(){
	if(document.getElementById('sfmRegionListDiv').style.display == '')
	{
		if(!sfmRegionList.value)
		{
			sfmRegionList.value = curStaffRegionId;
		}
		selRegionId = sfmRegionList.value;
	}	
	if(selRegionId == '-1' || selRegionId == '0' || selRegionId == '1')
	{
		selRegionId = 2;
	}
	
	for(var i = 0 ; i < perfThresholdBoxArr.length; i++)
	{
		oMonitor.removeChild(perfThresholdBoxArr[i]);
	}
	
	for(var i = 0 ; i < perfBoxArr.length; i++)
	{
		oMonitor.removeChild(perfBoxArr[i]);
	}
	
	perfThresholdBoxArr = new Array();
	perfBoxArr = new Array();
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST","/servlet/TopoChartCtrl?OperType=50&regionId=" + selRegionId,false);
   	oXMLHTTP.send("");
   	var thresholdDoc = null;
   	if(isSuccess(oXMLHTTP))
   	{
   		thresholdDoc = oXMLHTTP.responseXML;
   	}
   	
	oXMLHTTP.open("POST","/servlet/TopoChartCtrl?OperType=51&chartId=" + oMonitor.chartId + "&regionId=" + selRegionId,false);
   	oXMLHTTP.send("");
   	if(isSuccess(oXMLHTTP))
   	{
   		var rows = oXMLHTTP.responseXML.selectNodes("root/rowSet");
   		var count = 0;
   		for(var i = 0; i < rows.length; i ++)
   		{
   			var nodeNeId = rows[i].getAttribute('id');
   			var perfName = rows[i].selectSingleNode("PERF_NAME").text;
   			var perfValue = rows[i].selectSingleNode("PERF_VALUE").text;
   			var resultColor = rows[i].selectSingleNode("RESULT_COLOR").text;
   			var thresholdTypeCode = rows[i].selectSingleNode("THRESHOLD_TYPE_CODE").text;
   			var perfConfigId = rows[i].selectSingleNode("PERF_CONFIG_ID").text;
   			if(i == 0 || nodeNeId == rows[i-1].getAttribute('id'))
   			{
   				count ++;
   			}
   			else
   			{
   				count = 0;
   			}
			buildNodeImpPerfBox(nodeNeId,perfName,perfValue,resultColor,thresholdTypeCode,perfConfigId,count);
			buildNodeImpPerfThreshold(thresholdDoc,nodeNeId,perfName,perfValue,resultColor,perfConfigId,thresholdTypeCode,count);
   		}
   	}
   	topoParam.REGION_ID = selRegionId;
   	window.setTimeout(loadNodeImpPerf,topoDataRefreshInterval);
}

function hideImpPerfThreshold(thresholdId){
	var oThreshold = document.getElementById(thresholdId);
	if(oThreshold)
		oThreshold.style.display = 'none';
}

function showImpPerfThreshold(thresholdId){
	var oThreshold = document.getElementById(thresholdId);
	if(oThreshold)
		oThreshold.style.display = '';
}

function buildNodeImpPerfBox(nodeNeId,perfName,perfValue,resultColor,thresholdTypeId,perfConfigId,count){
	var nodes = oMonitor.nodes;
	var node;
	for(var i = 0; i < nodes.length; i ++)
	{
		var nodeDoc = oMonitor.getXMLDocByNodeId(nodes[i].id);
        var neId = nodeDoc.getAttribute('NE_ID');
        if(nodeNeId == neId)
        {
        	node = nodes[i];
        	break;
        }
	}
	if(!node) return;
	var perfBoxHTML = impPerfTemplate.replace('#ID',impPerfIdPrefix + nodeNeId+'_' + perfConfigId);
	var reg = /#THRESHOLDID/gi;
    perfBoxHTML = perfBoxHTML.replace(reg,impPerfThresholdIdPrefix + nodeNeId + '_' + thresholdTypeId);
    
    var top = node.offsetTop;
    var left = node.offsetLeft + node.offsetWidth;
    perfBoxHTML = perfBoxHTML.replace('#TOP',top + 'px');
    perfBoxHTML = perfBoxHTML.replace('#LEFT',left + (count-1)*19 + 'px');
    perfBoxHTML = perfBoxHTML.replace('#BG_COLOR','#' + resultColor);
	oMonitor.insertAdjacentHTML('afterBegin',perfBoxHTML);
	perfBoxArr.push(document.getElementById(impPerfIdPrefix + nodeNeId+'_' + perfConfigId));
}

function buildNodeImpPerfThreshold(thresholdDoc,nodeNeId,perfName,perfValue,resultColor,perfConfigId,thresholdTypeCode,count){
	var nodes = oMonitor.nodes;
	var node;
	for(var i = 0; i < nodes.length; i ++)
	{
		var nodeDoc = oMonitor.getXMLDocByNodeId(nodes[i].id);
        var neId = nodeDoc.getAttribute('NE_ID');
        if(nodeNeId == neId)
        {
        	node = nodes[i];
        	break;
        }
	}
	if(!node) return;
    var thresholdHTML = "<tr><td width='50%' style='font-weight:bold;font-size:12px;' align='right'>" + perfName + "</td><td style='font-size:12px;' align='left'>" + perfValue + "</tr>";
    thresholdHTML += '<tr><TD colSpan="2" height="2px"><div style="margin-top:-17px;height:2px;border-bottom:1px #ccc solid;"></div></TD></tr>';
   	var rows = thresholdDoc.selectNodes("root/rowSet");
   	for(var i = 0; i < rows.length; i ++)
   	{
   		var THRESHOLD_TYPE_CODE = rows[i].selectSingleNode("THRESHOLD_TYPE_CODE").text;
   		if(THRESHOLD_TYPE_CODE == thresholdTypeCode)
   		{
   			var UP_THRESHOLD = rows[i].selectSingleNode("UP_THRESHOLD").text;
   			var DOWN_THRESHOLD = rows[i].selectSingleNode("DOWN_THRESHOLD").text;
   			var RESULT_COLOR = rows[i].selectSingleNode("RESULT_COLOR").text;
   			var VALUE_SUFFIX = rows[i].selectSingleNode("VALUE_SUFFIX").text;
   			thresholdHTML += "<tr><td colspan='2' style='font-weight:bold;font-size:12px;' align='left'><span style='width:10px;height:10px;background-color:" + RESULT_COLOR + "'>&nbsp;&nbsp;</span>&nbsp;" + UP_THRESHOLD + VALUE_SUFFIX + ' >= ' + perfName + ' > ' + DOWN_THRESHOLD + VALUE_SUFFIX + "</td></tr>";
   		}
   	}
 	thresholdHTML = '<table width="95%" cellSpacing="5">' + thresholdHTML + '</table>';
 	var reg = /#ID/gi;
    var thresholdBoxHTML = impPerfThresholdTemplate.replace(reg,impPerfThresholdIdPrefix + nodeNeId + '_' + thresholdTypeCode);
    thresholdBoxHTML = thresholdBoxHTML.replace('#CONTENT_HTML',thresholdHTML);
    var top = node.offsetTop - 10;
    var left = node.offsetLeft + node.offsetWidth;
    thresholdBoxHTML = thresholdBoxHTML.replace('#TOP',top + 'px');
    thresholdBoxHTML = thresholdBoxHTML.replace('#LEFT',left + count*20 + 'px');
	oMonitor.insertAdjacentHTML('afterBegin',thresholdBoxHTML);
	perfThresholdBoxArr.push(document.getElementById(impPerfThresholdIdPrefix + nodeNeId + '_' + thresholdTypeCode));
}

function tacheDescThresholdConfig(){
	if(curStaffRegionId == '-1' || curStaffRegionId == '0' || curStaffRegionId == '1' || curStaffRegionId == '2')
	{
		var params = new Array();
		params.push(selRegionId);
		var sNE_ID=oMonitor.getSelectedObjXMLDoc().getAttribute("NE_ID");
		params.push(sNE_ID);
		var sNE_NAME = oMonitor.getSelectedObjXMLDoc().getAttribute("NE_NAME");
		params.push(sNE_NAME);
		var sHref="../../workshop/topo/tacheThresholdConfig.html";
		var sPara='scroll:1;resizable:0;dialogwidth:360px;dialogheight:396px;tatus:no;help:no;dialogTop:96px;'
		window.showModalDialog(sHref,params,sPara);
	}
}

function iniMapPerf(){
	loadSfmPerfList();
	if(!parentNodeNeId)
	{
		parentNodeNeId = getParentNodeNeId(oMonitor.chartId);
	}
	var mapEl = document.getElementById("SFM_CHINA_MAP_EL");
	if(!mapEl)
	{
		var mapHTML = "<div id='SFM_CHINA_MAP_EL' style='position:absolute;top:-15;left:100;z-index:100;'></div>";
		document.body.insertAdjacentHTML('afterBegin',mapHTML);
	}
	var mapDataXml = new ActiveXObject("Microsoft.XMLDOM");
	mapDataXml.async = false;
	mapDataXml.load("../../resource/flash/mapDefaultData.xml");
	var s1 = new SWFObject("../../resource/flash/ChinaMap.swf","ply",610,489,"10","#ffffff");
	s1.addParam("allowfullscreen","true");
	s1.addParam("allownetworking","all");
	s1.addParam("allowscriptaccess","always");
	s1.addParam("wmode","transparent");
	s1.addVariable("clickHandler","mapClickHandler");
	s1.addVariable("mouseOverHandler","mapMouseOverHandler");
	s1.addVariable("mouseOutHandler","mapMouseOutHandler");
	s1.addVariable("xml",encodeURIComponent(mapDataXml.xml));
	s1.write("SFM_CHINA_MAP_EL");
	reloadMapPerf();
}

function refleshMap()
{
	if(selRegionId == '-1' || selRegionId == '0' || selRegionId == '1')
	{
		selRegionId = 2;
	}
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST","/servlet/TopoChartCtrl?OperType=54&chartId=" + oMonitor.chartId + "&regionId=" + selRegionId + "&perfId=" + sfmPerfList.value,false);
   	oXMLHTTP.send("");
   	if(isSuccess(oXMLHTTP))
   	{
   		window.document.ply.refleshMap(oXMLHTTP.responseXML.xml);
   	}
	window.setTimeout(refleshMap,topoDataRefreshInterval);
}
var mouseX = 0;
var mouseY = 0;
function mouseMove(ev)
{ 
	var oev = ev || window.event; 
	var mousePos = mouseCoords(oev);  
	mouseX = mousePos.x; 
	mouseY = mousePos.y; 
} 

function mouseCoords(ev) 
{ 
	return {
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
		y:ev.clientY + document.body.scrollTop - document.body.clientTop
	}; 
} 

document.onmousemove = mouseMove;

function mapClickHandler(map){
	topoParam.REGION_ID = map.regionId;
	if(typeof parent.fraBotFrame.fromTopoNeClick == 'function')
	{
		parent.fraBotFrame.fromTopoNeClick(parentNodeNeId);
	}
}
function mapMouseOverHandler(map){
	var perfBox = document.getElementById(mapImpPerfPrefix + map.regionId);
	if(perfBox)
	{
		perfBox.style.left = mouseX;
		perfBox.style.top = mouseY;
		perfBox.style.display = '';
	}
}
function mapMouseOutHandler(map){
	var perfBox = document.getElementById(mapImpPerfPrefix + map.regionId);
	if(perfBox)
	{
		perfBox.style.display = 'none';
	}
}

var mapImpPerfArr = new Array();
function loadMapImpPerf(){
	for(var i = 0 ; i < mapImpPerfArr.length; i++)
	{
		document.body.removeChild(mapImpPerfArr[i]);
	}
	mapImpPerfArr = new Array();
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST","/servlet/TopoChartCtrl?OperType=56&chartId=" + oMonitor.chartId + "&regionId=" + selRegionId + "&perfId=" + sfmPerfList.value,false);
   	oXMLHTTP.send("");
   	if(isSuccess(oXMLHTTP))
   	{
   		var rows = oXMLHTTP.responseXML.selectNodes("root/rowSet");
   		var perfHTML = "";
   		for(var i = 0; i < rows.length; i ++)
   		{
   			var neId = rows[i].getAttribute('id');
   			var perfName = rows[i].selectSingleNode("PERF_NAME").text;
   			var perfValue = rows[i].selectSingleNode("PERF_VALUE").text;
   			var resultColor = rows[i].selectSingleNode("RESULT_COLOR").text;
   			var regionId = rows[i].selectSingleNode("REGION_ID").text;
   			var regionName = rows[i].selectSingleNode("REGION_NAME").text;   			
   			if(i != 0 && neId != rows[i-1].getAttribute('id'))
   			{
   				perfHTML = '<div style="text-align:center;font-size:13px;font-weight:bold;">' + rows[i-1].selectSingleNode("REGION_NAME").text + '</div>' + perfHTML;
   				var mapPerfHTML = mapImpPerfThresholdTemplate.replace('#ID',mapImpPerfPrefix + rows[i-1].selectSingleNode("REGION_ID").text);
   				mapPerfHTML = mapPerfHTML.replace('#CONTENT_HTML',perfHTML);
   				document.body.insertAdjacentHTML('afterBegin',mapPerfHTML);
   				mapImpPerfArr.push(document.getElementById(mapImpPerfPrefix + rows[i-1].selectSingleNode("REGION_ID").text));
				perfHTML = "<div style='padding:3px;'><span style='width:10px;height:10px;background-color:#" + resultColor + "'>&nbsp;&nbsp;</span>&nbsp;<span style='font-weight:bold;font-size:12px;'>" + perfName + ":</span><span style='font-size:12px;'>" + perfValue + "</span></div>";
   			}
   			else
   			{
   				perfHTML += "<div style='padding:3px;'><span style='width:10px;height:10px;background-color:#" + resultColor + "'>&nbsp;&nbsp;</span>&nbsp;<span style='font-weight:bold;font-size:12px;'>" + perfName + ":</span><span style='font-size:12px;'>" + perfValue + "</span></div>";
   			}
   			
   			if(i + 1 == rows.length)
   			{
   				perfHTML = '<div style="text-align:center;font-size:13px;font-weight:bold;">' + regionName + '</div>' + perfHTML;
   				var mapPerfHTML = mapImpPerfThresholdTemplate.replace('#ID',mapImpPerfPrefix + regionId);
   				mapPerfHTML = mapPerfHTML.replace('#CONTENT_HTML',perfHTML);
   				document.body.insertAdjacentHTML('afterBegin',mapPerfHTML);
   				mapImpPerfArr.push(document.getElementById(mapImpPerfPrefix + regionId));
   			}
   		}
   	}
   	window.setTimeout(loadMapImpPerf,topoDataRefreshInterval);
}

function reloadMapPerf(){
	loadMapImpPerf();
	refleshMap();
}

function loadSfmPerfList(){
	var oPerfList = document.getElementById('sfmPerfListDiv');
	oPerfList.style.display = '';
	sfmPerfList.onResultChange = reloadMapPerf;
}