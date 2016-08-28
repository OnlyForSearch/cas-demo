var lineArr = new Array();
var neIdArr = new Array();
var refreshTime = 30000;
var rankCss = 'font-family:Microsoft YaHei;font-size:14px;font-weight:bold;height:20px;line-height:20px;';

function initMonitor()
{
	var links = oMonitor.XMLDoc.selectNodes('/root/links/link');
	for(var i = 0, link; link = links[i]; i++)
	{
		var node = oMonitor.getNodeById(link.getAttribute('LINK_ID'));
		if(node.children(0).NE_ID)
		{
			lineArr.push(node);
			neIdArr.push(node.children(0).NE_ID);
		}
	}
	buildRankPanel();
	showMointor();
	showRealtimeLineRank();
}

function showMointor()
{
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
   	oXMLHTTP.open("POST","/servlet/LargeScreeMonitorServlet?action=1",false);
   	oXMLHTTP.send("");
   	if(isSuccess(oXMLHTTP))
   	{
       	var rowSet = oXMLHTTP.responseXML.selectNodes("/root/rowSet");
       	for(var i = 0; i < rowSet.length; i++)
       	{
       		var color = rowSet[i].selectSingleNode("LINK_COLOR").text;
       		var neId = rowSet[i].selectSingleNode("NE_ID").text;;
       		drawMonitorLine(neId,color);
       	}
       	setTimeout("showMointor()",refreshTime);
   	}
}

function drawMonitorLine(neId,color)
{
	for(var i = 0; i < lineArr.length; i++)
	{
		if(lineArr[i].children(0).NE_ID == neId)
		{
			lineArr[i].strokecolor = color;
			break;
		}
	}
}

function showRealtimeLineRank()
{
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
   	oXMLHTTP.open("POST","/servlet/LargeScreeMonitorServlet?action=2&neId=" + neIdArr.join(','),false);
   	oXMLHTTP.send("");
   	if(isSuccess(oXMLHTTP))
   	{	
   		var rankHTML = "";
       	var rowSet = oXMLHTTP.responseXML.selectNodes("/root/rowSet");
       	for(var i = 0; i < rowSet.length; i++)
       	{
       		var neName = rowSet[i].selectSingleNode("SHORT_DESCRIPTION").text;
       		var packetlossRate = rowSet[i].selectSingleNode("PACKETLOSS_RATE").text;
       		if(packetlossRate >= 100)
       		{
       			rankHTML += "<div style='color:red;" + rankCss + "'>" + (i + 1) + "&nbsp;" + neName + ":&nbsp;连接断开";
       		}
       		else if(packetlossRate > 0 && packetlossRate < 100)
       		{
       			rankHTML += "<div style='color:#FF9224;" + rankCss + "'>" + (i + 1) + "&nbsp;" + neName + ":&nbsp;丢包率" + packetlossRate + "%";
       		}
       		else
       		{
       			rankHTML += "<div style='color:green;" + rankCss + "'>" + (i + 1) + "&nbsp;" + neName + ":&nbsp;连接正常";
       		}
       	}
       	document.getElementById('lineRank').innerHTML = rankHTML;
       	var box = document.getElementById('rankWrap');
		box.style.left = 70;
		box.style.top = document.body.clientHeight - rowSet.length * 20 - 100;
       	setTimeout("showRealtimeLineRank()",refreshTime);
   	}
}

function buildRankPanel()
{
	var rankWrap = document.createElement('<div id="rankWrap" style="position: absolute;width:420px;border:2px solid #9D9D9D;padding:7px 10px;"></div>');
	var rankTitle = document.createElement('<div style="font-family:Microsoft YaHei;font-size:14px;font-weight:bold;height:20px;line-height:20px;"></div>');
	rankTitle.innerHTML = '网络异常实时排名：';
	var lineRank = document.createElement('<div id="lineRank"></div>');
	rankWrap.appendChild(rankTitle);
	rankWrap.appendChild(lineRank);
	document.body.appendChild(rankWrap);
}