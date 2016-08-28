var hoverShowDescIdPrefix = 'hover_show_desc_';
var alwaysShowDescIdPrefix = 'always_show_desc_';
var alwaysShowDescContentIdPrefix = 'always_show_desc_content_';
var hoverShowDescContentIdPrefix = 'hover_show_desc_content_';

var alwaysShowTemplate = '<div id="' + alwaysShowDescIdPrefix +'#ID" style="POSITION:absolute;z-index:300;top:#TOP;left:#LEFT;text-align:left;width:50px;padding:0px 2px;">' +
	'<div id="' + alwaysShowDescContentIdPrefix + '#CONTENT_ID">#CONTENT_HTML' +
	'</div></div>';

var hoverShowTemplate = '<div onmouseout="hideHoverShowDesc(this)" onmouseover="showHoverShowDesc(this)" id="' + hoverShowDescIdPrefix + '#ID" style="display:none;POSITION:absolute;z-index:430;top:#TOP;left:#LEFT;padding:4px;width:180px;background-color:#FFFFFF;border:1px solid #DDDDFF;">' +
	'<div id="' + hoverShowDescContentIdPrefix +'#CONTENT_ID">#CONTENT_HTML' +
	'</div></div>';

var topoDataRefreshInterval = $getSysVar('SFM_TOPO_REFRESH_STEP')||20000;
function hideHoverShowDesc(desc){
	desc.style.display = 'none';
}

function showHoverShowDesc(desc){
	desc.allowsHide = false;
	desc.style.display = '';
}
var curStaffRegionId = getCurrentUserInfo('region_id');
var selRegionId = curStaffRegionId;
var alwaysShowDescArr = new Array();
var hoverShowDescArr = new Array();
function loadDesc(){
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
	for(var i = 0 ; i < alwaysShowDescArr.length; i++)
	{
		oMonitor.removeChild(alwaysShowDescArr[i]);
	}
	
	for(var i = 0 ; i < hoverShowDescArr.length; i++)
	{
		oMonitor.removeChild(hoverShowDescArr[i]);
	}
	alwaysShowDescArr = new Array();
	hoverShowDescArr = new Array();
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST","/servlet/TopoChartCtrl?OperType=47&chartId=" + oMonitor.chartId + "&regionId=" + selRegionId,false);
   	oXMLHTTP.send("");
   	if(isSuccess(oXMLHTTP))
   	{
   		var rows = oXMLHTTP.responseXML.selectNodes("root/rowSet");
   		var alwaysShowDescHTML = "";
   		var hoverShowDescHTML = "";
   		for(var i = 0; i < rows.length; i ++)
   		{
   			var nodeNeId = rows[i].getAttribute('id');
   			if(i != 0 && nodeNeId != rows[i-1].getAttribute('id'))
   			{
   				if(alwaysShowDescHTML != "")
   				{
   					alwaysShowDescHTML = '<div>' + alwaysShowDescHTML + '</div>';
   					buildAlwaysShowDesc(rows[i-1].getAttribute('id'),alwaysShowDescHTML);
   				}
   				if(hoverShowDescHTML != "")
   				{
   					hoverShowDescHTML = '<div>' + hoverShowDescHTML + '</div>';
   					buildHoverShowDesc(rows[i-1].getAttribute('id'),hoverShowDescHTML);
   				}
   				alwaysShowDescHTML = "";
   				hoverShowDescHTML = "";
   			}
   			var descType = rows[i].selectSingleNode("DESC_TYPE").text;
   			var descName = rows[i].selectSingleNode("DESC_NAME").text;
   			var descValue = rows[i].selectSingleNode("DESC_VALUE").text;
   			var displayForm = rows[i].selectSingleNode("DISPLAY_FORM").text;
   			if(descType == 'value')
   			{
   				if(!descName)
   				{
   					continue;
   				}
   				if(displayForm == '0SA')
   				{
   					alwaysShowDescHTML += "<div><span style='font-size:10px;'>" + descName + ":" + descValue + "</span></div>";
   				}
   				else if(displayForm == '0SB')
   				{
   					hoverShowDescHTML += "<div style='padding:2px;'><span style='font-weight:bold;font-size:12px;'>" + descName + ":</span><span style='font-size:12px;'>" + descValue + "</span></div>";
   				}
   			}
   			else
   			{
   				if(displayForm == '0SA')
   				{
   					alwaysShowDescHTML += '<div style="width:80px;margin-top:-17px;height:2px;border-bottom:1px #ccc solid;"></div>';
   				}
   				else if(displayForm == '0SB')
   				{
   					hoverShowDescHTML += '<div style="width:80px;margin-top:-17px;height:2px;border-bottom:1px #ccc solid;"></div>';
   				}
   			}
   			if(i + 1 == rows.length)
   			{
	   			if(alwaysShowDescHTML != "")
				{
					alwaysShowDescHTML = '<div>' + alwaysShowDescHTML + '</div>';
					buildAlwaysShowDesc(nodeNeId,alwaysShowDescHTML);
				}
				if(hoverShowDescHTML != "")
				{
					hoverShowDescHTML = '<div>' + hoverShowDescHTML + '</div>';
					buildHoverShowDesc(nodeNeId,hoverShowDescHTML);
				}
   			}
   		}   		
   	}
   	window.setTimeout(loadDesc,topoDataRefreshInterval);
}

function buildAlwaysShowDesc(nodeNeId,descHTML){
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
    var desc = alwaysShowTemplate.replace('#ID',nodeNeId);
    desc = desc.replace('#CONTENT_ID',nodeNeId);
    desc = desc.replace('#CONTENT_HTML',descHTML);
    
    //var top = node.offsetTop + node.offsetHeight + 5;
    //var left = node.offsetLeft + node.offsetWidth / 2;
    var top = node.offsetTop;
    var left = node.offsetLeft + node.offsetWidth;
    desc = desc.replace('#TOP',top + 'px');
    desc = desc.replace('#LEFT',left + 'px');
	oMonitor.insertAdjacentHTML('afterBegin',desc);
	//var descWidth = document.getElementById(alwaysShowDescIdPrefix + nodeNeId).offsetWidth;
	//var descLeft = node.offsetLeft + node.offsetWidth / 2 - descWidth / 2;
	//document.getElementById(alwaysShowDescIdPrefix + nodeNeId).style.left = descLeft;
	alwaysShowDescArr.push(document.getElementById(alwaysShowDescIdPrefix + nodeNeId));
}

function buildHoverShowDesc(nodeNeId,descHTML){
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
	var desc = hoverShowTemplate.replace('#ID',nodeNeId);
	desc = desc.replace('#CONTENT_ID',nodeNeId);
	desc = desc.replace('#CONTENT_HTML',descHTML);
	
	var top = node.offsetTop;
    var left = node.offsetLeft + node.offsetWidth;
    desc = desc.replace('#TOP',top + 'px');
    desc = desc.replace('#LEFT',left + 'px');
   
	oMonitor.insertAdjacentHTML('afterBegin',desc);
	node.onmouseover = function(){
    	var nodeDoc = oMonitor.getXMLDocByNodeId(this.id);
        var neId = nodeDoc.getAttribute('NE_ID');
		var descId = hoverShowDescIdPrefix + neId;
		var desc = document.getElementById(descId);
		if(desc)
		{
			desc.style.display = '';
			desc.allowsHide = false;
		}
	}
	
	node.onmouseout = function(){
		var nodeDoc = oMonitor.getXMLDocByNodeId(this.id);
        var neId = nodeDoc.getAttribute('NE_ID');
		var descId = hoverShowDescIdPrefix + neId;
		if(document.getElementById(descId))
		{
			document.getElementById(descId).allowsHide = true;
		}
		var hideDesc = function(descId){
			var desc = document.getElementById(descId);
			if(desc && desc.allowsHide == true)
			{
				document.getElementById(descId).style.display = 'none';
				desc.allowsHide = false;
			}
		}
		window.setTimeout(function(){
			hideDesc(descId);
		},1000);
	}
		
    hoverShowDescArr.push(document.getElementById(hoverShowDescIdPrefix + nodeNeId));
}