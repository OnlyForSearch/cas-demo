var isShowAlarmNodePop = true;
function iniTopoBase(pShowAlarmNodePop)
{
   isShowAlarmNodePop = pShowAlarmNodePop ? true : false;
   if(isShowAlarmNodePop == true)
   {
   	   getAlarmNodeListXML();
   }
   iniNodePopEvent();
   buildRefreshTimePanel();
   setRefreshTime();
}

function refreshData()
{
    setRefreshTime();
    getAlarmNodeXML();
    if(isShowAlarmNodePop == true)
    {
   	   getAlarmNodeListXML();
    }
    getImpactStateXML();
    playAlarmAudio();
    getNodeAttrXML();
    getNodePerfXML();
    reLoadNodeFill();
}

//覆盖workshop\topo\monitor.html页面的函数
function showAlarm(oXMLDoc)
{
    var oNodes=oMonitor.nodes;
    var iLen=oNodes.length;
	var nodeId,oAlarmNode,sAlarmType,sAlarmOperState,sBorderStyle,oOfflineNode;
	var sUnConfirmState='10';
    iMaxAlarmLevel=1000;
	for(var i=0;i<iLen;i++)
	{
	   nodeId=oNodes[i].getAttribute("id");
       oAlarmNode=oXMLDoc.selectSingleNode("/root/node[@NODE_ID='"+nodeId+"']"); 
       oOfflineNode=oXMLDoc.selectSingleNode("/root/offlineNode[@id='"+nodeId+"']");
       showOfflineNode(oOfflineNode,oNodes[i]);
       var bAlarm=oNodes[i].bAlarm;
       if(typeof(bAlarm)!="undefined" && bAlarm=="true")
       {
            oNodes[i].removeChild(document.getElementById("node_alarm_"+nodeId));            
       }
       if(oAlarmNode!=null)
       {
            sAlarmType=oAlarmNode.getAttribute("ALARM_TYPE");
            getMaxAlarmLevel(sAlarmType);
            oNodes[i].style.backgroundColor= '#E63232';  //告警节点使用红色背景
            oNodes[i].bAlarm="true";
       }
       else
       {
           sAlarmType="";
           oNodes[i].style.border=oNodes[i].style.baseBorder || '';
           oNodes[i].bAlarm="false";
           oNodes[i].style.backgroundColor = '';
       }
    }
}

//获取有告警的拓扑节点(包含子拓扑节点)
function getAlarmNodeListXML()
{
    var businessIds = topoParam.BUSINESS_ID;
    if(!businessIds) businessIds='-99';
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    oXMLHTTP.onreadystatechange= function(){onAlarmNodeChange(oXMLHTTP)};
    oXMLHTTP.open("POST","../../servlet/TopoChartCtrl?OperType=58&chartId="
                        +iChartId+"&regionIds="+topoParam.REGION_ID+"&businessIds="+businessIds,true);
    oXMLHTTP.send("");
}

var oAlarmNodeTime;
function onAlarmNodeChange(oXMLHTTP)
{
	try
	{
		var state = oXMLHTTP.readyState;
		if(state == 4)
		{
			if(isSuccess(oXMLHTTP))
			{  
				buildAlarmNodePop(oXMLHTTP.ResponseXML);
				oXMLHTTP = null;
				var topoRefreshTime = parseInt(aAttr.topoRefreshInterval, 10) * 1000;
				oAlarmNodeTime = window.setTimeout("getAlarmNodeListXML()",topoRefreshTime);
			}
			else
			{
			    window.clearTimeout(oAlarmNodeTime);
			}
		}
	}
	catch(e)
	{
	   window.clearTimeout(oAlarmNodeTime);
	}
}

var alarmNodeIdPrefix = "alarmNodePop_";
function buildAlarmNodePop(oXML)
{
	//清除上一次生成的dom
	var oNodes = oMonitor.nodes;
	for(var i = 0, node; node = oNodes[i]; i++)
	{
		var oAlarmNode = document.getElementById((alarmNodeIdPrefix + node.getAttribute('id')));
		if(oAlarmNode)
		{
			oAlarmNode.innerHTML = "";
		}
	}
	//创建告警列表浮动框
	var aChecker = {};
	var rows = oXML.selectNodes("/root/rowSet");
	for(var i = 0, row; row = rows[i]; i++)
	{
		var topo_node_id = row.selectSingleNode("TOPO_NODE_ID").text;
		var topo_chart_id = row.selectSingleNode("TOPO_CHART_ID").text;
		var ne_name = row.selectSingleNode("NE_NAME").text;
		var path = row.selectSingleNode("PATH").text;
		var oGraph = oMonitor.getNodeByDataId(topo_node_id);
		var oAlarmNode = document.getElementById((alarmNodeIdPrefix + 'n' + topo_node_id));
		if(!oAlarmNode)
		{
			oAlarmNode = document.createElement("div");
			oAlarmNode.id = alarmNodeIdPrefix + 'n' + topo_node_id;
			oAlarmNode.style.backgroundColor = '#D8EAFC';
			oAlarmNode.style.border = '1px solid #cccccc';
			oAlarmNode.style.width = oGraph.style.pixelWidth;
			var iTop = oGraph.offsetTop + oGraph.style.pixelHeight;
	        var iLeft = oGraph.offsetLeft;
	        oAlarmNode.style.top = iTop;
	        oAlarmNode.style.left = iLeft;
	        oAlarmNode.style.position = 'absolute';
	        oAlarmNode.style.zIndex = 12;
	        oAlarmNode.style.display = 'none';
	        oAlarmNode.onmouseenter = function(){this.focused = true;this.style.display = 'block';};
	        oAlarmNode.onmouseleave = function(){this.focused = false;this.style.display = 'none';};
			oMonitor.appendChild(oAlarmNode);
		}
		if(!aChecker[topo_node_id + "_" + ne_name])
		{
			aChecker[topo_node_id + "_" + ne_name] = topo_node_id + "_" + ne_name;
			oAlarmNode.innerHTML += '<div style="text-overflow:ellipsis;white-space:nowrap;padding:2px;height:20px;"><a title="' + ne_name + '" style="font-family:Microsoft YaHei;font-size:12px;color:#242426;" onclick="selectTreeItem(\'' + path + '\')" target="_self" href="javascript:void(0);">' + (oAlarmNode.childNodes.length + 1) + '、' + ne_name + '</a></div>';
		}
	}
}

//选中拓扑树节点
function selectTreeItem(path)
{
    var leftFrame = top.frames["leftFrame"];
	if(typeof(leftFrame)!="undefined")
	{
		var expandPath = path.substring(0 ,path.length - 1);
		expandPath = expandPath.split('/');
		for(i = 0; i < expandPath.length; i++)
		{
			expandPath[i] = leftFrame.prefixTopoId + expandPath[i];
		}
		var selectItemPath = expandPath[expandPath.length - 1];
		expandPath = expandPath.join('/') + '/';
		var treeFrame = leftFrame.document.getElementById("topoTree");
		if(treeFrame)
		{		
			treeFrame.contentWindow.cfgTree.selectItemByPath(expandPath);
			gotoTopoTreeItem(selectItemPath,true);
		}
		else
		{
			leftFrame.cfgTree.selectItemByPath(expandPath);
			gotoTopoTreeItem(selectItemPath,true);
		}
	}
}

function gotoTopoTreeItem(path,flag){
	var sPath = path;
	var leftFrame = top.frames["leftFrame"];
	if(typeof(leftFrame)!="undefined")
	{
		if(sPath.indexOf(leftFrame.prefixTopoId) == -1)
		{
			sPath = leftFrame.prefixTopoId + sPath; 
		}
		var treeFrame = leftFrame.document.getElementById("topoTree");
		if(treeFrame)
		{
			var oItem = treeFrame.contentWindow.document.getElementById(sPath);
			if(oItem)
			{
				treeFrame.contentWindow.cfgTree.gotoItem(sPath,flag);
			}
			else
			{
				window.setTimeout(function(){gotoTopoTreeItem(sPath,flag)},100);
			}
		}
		else
		{
			var oItem = leftFrame.document.getElementById(sPath);
			if(oItem)
			{
				leftFrame.cfgTree.gotoItem(sPath,flag);
			}
			else
			{
				window.setTimeout(function(){gotoTopoTreeItem(sPath,flag)},100);
			}
		}
	}
}

//绑定节点鼠标移入移出事件
function iniNodePopEvent()
{
	var nodes = oMonitor.nodes;
	for(var i = 0; i < nodes.length; i++)
	{
		nodes[i].onmouseover = function()
		{
			var oAlarmNode = document.getElementById((alarmNodeIdPrefix + this.getAttribute('id')));
			if(oAlarmNode)
			{
				showAlarmNodePop(this,oAlarmNode);
			}
		}
		nodes[i].onmouseout = function()
		{
			setTimeout('alarmNodeHideHander("' + this.getAttribute('id') + '")', 500);
		}
	}
}

function showAlarmNodePop(oTopoNode,oAlarmNode)
{
	oAlarmNode.style.display = "block";
	var iWidth = oAlarmNode.offsetWidth;
	var iHeight = oAlarmNode.offsetHeight;
	var iLeft = oAlarmNode.offsetLeft;
	var iTop = oAlarmNode.offsetTop;
	if(iWidth + iLeft > document.body.clientWidth)
	{
		oAlarmNode.style.left = document.body.clientWidth - iWidth;
	}
	if(iHeight + iTop > document.body.clientHeight)
	{
		oAlarmNode.style.top = oTopoNode.offsetTop - iHeight;
	}
}

var alarmNodeHideHander = function(nodeId)
{
	var oAlarmNode = document.getElementById((alarmNodeIdPrefix + nodeId));
	if(oAlarmNode && (!oAlarmNode.focused || oAlarmNode.focused == false))
	{
		oAlarmNode.style.display = "none";
	}
}

//创建"刷新时间"面板
function buildRefreshTimePanel()
{
	var refreshCtrlPanel = document.createElement("DIV");
	refreshCtrlPanel.id = 'refreshCtrlPanel';
	refreshCtrlPanel.style.top = 15;
	refreshCtrlPanel.style.left = 30;
	refreshCtrlPanel.style.position = 'absolute';
	refreshCtrlPanel.innerHTML = '<div style="font-family:Microsoft YaHei;font-size:14px;color:#ffffff;">刷新时间：' +
				'<span style="font-family:Microsoft YaHei;font-size:13px;color:#ffffff;" id="refreshTime"></span>' +
				'<input style="margin-left:15px;border:0;width:20px;height:20px;cursor:hand;background:url(../../resource/image/ico/refresh16_16.png) no-repeat 3px 3px;" type="button" onclick="refreshData()"/></div>';
	document.body.insertAdjacentElement("beforeEnd",refreshCtrlPanel);
}

//设置刷新时间
function setRefreshTime()
{
	var curDate = new Date();
	var curTime = curDate.getFullYear() + '-' + formatNumber((curDate.getMonth() + 1)) + '-' + formatNumber(curDate.getDate()) + ' ' + formatNumber(curDate.getHours()) + ':' + formatNumber(curDate.getMinutes()) + ":" + formatNumber(curDate.getSeconds());
	document.getElementById('refreshTime').innerHTML = curTime;
}

function formatNumber(oNum)
{
	return oNum > 9 ? oNum : '0' + oNum;
}

//创建拓扑导航条
function buildNavBar()
{
	buildNavArea();
	buildTopoPath();
	buildTopoList();
}

function buildNavArea()
{
	var navArea = document.createElement("div");
	navArea.id = 'topoNavArea';
	navArea.style.height = 25;
	navArea.style.position = 'absolute';
	navArea.style.top = 0;
	navArea.style.left = 0;
	navArea.style.paddingLeft = 20;
	navArea.style.background = 'url(../../resource/image/nav_bg.jpg) repeat-x';
	document.body.insertAdjacentElement("beforeEnd",navArea);
	var oRefreshCtrlPanel = document.getElementById('refreshCtrlPanel');
	if(oRefreshCtrlPanel)
	{
		oRefreshCtrlPanel.style.top = oRefreshCtrlPanel.offsetTop + 35; 
	}
}

//创建拓扑路径
function buildTopoPath()
{
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    oXMLHTTP.open("POST","../../servlet/TopoChartCtrl?OperType=59&chartId=" + oMonitor.chartId, false);
    oXMLHTTP.send("");
    if(isSuccess(oXMLHTTP))
   	{
		var rows = oXMLHTTP.responseXML.selectNodes("/root/rowSet");
		var aPath = new Array();
		for(var i = 0, row; row = rows[i]; i++)
		{
			var id = row.getAttribute("id");
			var name = row.selectSingleNode("TOPO_CHART_NAME").text;
			var path = row.selectSingleNode("PATH").text;
			aPath.push('<a style="line-height:25px;height:25px;font-family:Microsoft YaHei;font-size:13px;color:#ffffff;" onclick="selectTreeItem(\'' + path + '\')" href="javascript:void(0);">' + name + '</a>');
		}
		var oTopoNavArea = document.getElementById("topoNavArea");
		oTopoNavArea.innerHTML += '<div style="float:left;font-family:Microsoft YaHei;font-size:13px;color:#ffffff;">' + aPath.join("&nbsp;>&nbsp;") + '</div>';
   	}
}

//创建同级拓扑下拉框
function buildTopoList()
{
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    oXMLHTTP.open("POST","../../servlet/TopoChartCtrl?OperType=60&chartId=" + oMonitor.chartId, false);
    oXMLHTTP.send("");
    if(isSuccess(oXMLHTTP))
   	{
		var rows = oXMLHTTP.responseXML.selectNodes("/root/rowSet");
		var sHTML = "";
		for(var i = 0, row; row = rows[i]; i++)
		{
			var id = row.getAttribute("id");
			var name = row.selectSingleNode("TOPO_CHART_NAME").text;
			if(id == oMonitor.chartId)
			{
				sHTML += '<option selected value="' + id + '">' + name + '</option>';
			}
			else
			{
				sHTML += '<option value="' + id + '">' + name + '</option>';
			}
		}
		sHTML = '<select onchange="gotoTopoTreeItem(this.value,true)">' + sHTML + '</select>';
		var oTopoNavArea = document.getElementById("topoNavArea");
		oTopoNavArea.innerHTML += '<div style="padding-right:100px;padding-top:2px;float:right;font-family:Microsoft YaHei;font-size:13px;color:#ffffff;">当前拓扑：' + sHTML + '</div>';
   	}
}