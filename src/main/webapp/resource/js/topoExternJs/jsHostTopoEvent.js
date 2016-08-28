//覆盖monitor.html页面的doNodeRightMenu函数
function doNodeRightMenu()
{
	var curNode = oMonitor.getSelectedObj();
	var oXml = oMonitor.getSelectedObjXMLDoc();
    var ciId = oXml.getAttribute("NE_ID");
    if(ciId && ciId != 'undefined' && ciId > 0)
    {
		document.getElementById("nePerfPanel").style.display = '';
		document.getElementById("ifNePerfPanel").src = '';
	    var contextMenuPanel = document.getElementById("contextMenuPanel");
	    contextMenuPanel.style.display = 'block';
	    contextMenuPanel.focus();    
	    var top = curNode.offsetTop;
	    var left = curNode.offsetLeft + curNode.offsetWidth;
	    contextMenuPanel.style.top = top;
	    contextMenuPanel.style.left = left;
    }
}

function clearRightClickFlag()
{
	var oMonitor = document.getElementById("oMonitor");
	var nodes = oMonitor.nodes;
	for(var i = 0; i < nodes.length; i++)
	{
		nodes[i].isRightClick = false;
	}
}

(function createContextMenu()
{
	//右键菜单面板
	var contextMenuPanel = document.createElement("DIV");
	contextMenuPanel.id = "contextMenuPanel";
	contextMenuPanel.className = "sysTopoNodeContextMenuPanel";
	contextMenuPanel.onblur = function(){
		//点击的不是右键菜单,隐藏右键菜单
		if(document.activeElement.name != "sysMonitorContextMenuItem")
		{
			document.getElementById("contextMenuPanel").style.display = "none";
			clearRightClickFlag();
		}
	};
	var menuItem = document.createElement("DIV");
	menuItem.innerHTML = '<a name="sysMonitorContextMenuItem" href="javascript:void(0);" onclick="showNePerf()" class="sysMonitorContextMenuItem">性能</a>';
	contextMenuPanel.appendChild(menuItem);
	menuItem = document.createElement("DIV");
	menuItem.innerHTML = '<a name="sysMonitorContextMenuItem" href="javascript:void(0);" onclick="showNeConfig()" class="sysMonitorContextMenuItem"/>配置</a>';
	contextMenuPanel.appendChild(menuItem);
	menuItem = document.createElement("DIV");
	menuItem.innerHTML = '<a name="sysMonitorContextMenuItem" href="javascript:void(0);" onclick="showNeAlarm()" class="sysMonitorContextMenuItem"/>告警信息</a>';
	contextMenuPanel.appendChild(menuItem);
	document.body.insertAdjacentElement("beforeEnd",contextMenuPanel);
})();

function showNePerf()
{
    var oXml = oMonitor.getSelectedObjXMLDoc();
    var param = new Array();
    param.push("CI_ID=" + oXml.getAttribute("NE_ID"));
    param.push("CLASS_ID=" + oXml.getAttribute("NE_TYPE_ID"));
    openFullScreenWin('../config/newPerf.html?' + param.join('&'));
    document.getElementById("contextMenuPanel").style.display = "none";
}

function showNeConfig()
{
	var oXml = oMonitor.getSelectedObjXMLDoc();
    var param = new Array();
    param.push("classId=" + oXml.getAttribute("NE_TYPE_ID"));
    param.push("dataSetId=" + oXml.getAttribute("DATASET_ID"));
    param.push("requestId=" + oXml.getAttribute("REQ_ID"));
    param.push("readOnly=y");
    param.push("hiddenToolBar=y");
	openFullScreenWin('../form/index.jsp?' + param.join('&'));
	document.getElementById("contextMenuPanel").style.display = "none";
}

function showNeAlarm()
{
	var oXml = oMonitor.getSelectedObjXMLDoc();
    var param = new Array();
    param.push("neId=" + oXml.getAttribute("NE_ID"));
    param.push("fromUrl=GD_ITOP");
	openFullScreenWin('../alarmManage/alarmMergeList.htm?' + param.join('&'));
	document.getElementById("contextMenuPanel").style.display = "none";
}

function openFullScreenWin(url)
{
	window.showModelessDialog(url,'','dialogTop=0;dialogLeft=0;center:yes;dialogHeight=' + screen.availHeight + 'px;dialogWidth=' + screen.availWidth  + 'px;scrollbars=1;toolbar=0;status=0;');
}