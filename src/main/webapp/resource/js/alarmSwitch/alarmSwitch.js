var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var sendXML = new ActiveXObject("Microsoft.XMLDOM");
var params;
var url = "../../servlet/AlarmTransConfigServlet?";


function iniPage()
{
    reloadDate();
    
    doSearch();
}

function doSearch() {
	var switchName = ALARM_SWITCH_NAME.value;
	if(switchName != "") {
		switchName = "%" + switchName + "%"; 
	}
	
	sendXML.loadXML('<?xml version="1.0" encoding="gb2312"?><root></root>');
    var rootNode = sendXML.selectSingleNode("root");
    var searchNode = addNewNode(rootNode, "search", '', new Array('pagesize', 'page', 'orderby'), new Array('15', '1', ' A.STATE,A.ALARM_SWITCH_LEVEL,A.SEQ '));
    
    addNewNode(searchNode, "param", switchName, new Array('fieldName', 'oper', 'type'), new Array('A.ALARM_SWITCH_NAME', 'like', 'string'));
    if(SWITCH_STATE.value!="-1") {
    	addNewNode(searchNode, "param", SWITCH_STATE.value, new Array('fieldName', 'oper', 'type'), new Array('A.STATE', '=', 'string'));
    }
    if(VALID_DATE1.value!="") {
    	addNewNode(searchNode, "param", VALID_DATE1.value, new Array('fieldName', 'oper', 'type', 'format'), new Array('A.VALID_DATE', '>=', 'date', 'yyyy-MM-dd'));
    }
    if(VALID_DATE2.value!="") {
    	addNewNode(searchNode, "param", VALID_DATE2.value, new Array('fieldName', 'oper', 'type', 'format'), new Array('A.VALID_DATE', '<=', 'date', 'yyyy-MM-dd'));
    }
    if(CANCEL_DATE1.value!="") {
    	addNewNode(searchNode, "param", CANCEL_DATE1.value, new Array('fieldName', 'oper', 'type', 'format'), new Array('A.CANCEL_DATE', '>=', 'date', 'yyyy-MM-dd'));
    }
    if(CANCEL_DATE2.value!="") {
    	addNewNode(searchNode, "param", CANCEL_DATE2.value, new Array('fieldName', 'oper', 'type', 'format'), new Array('A.CANCEL_DATE', '<=', 'date', 'yyyy-MM-dd'));
    }
    
   	document.all.oData.sendXML=sendXML.xml;
    document.all.oData.xmlSrc="../../servlet/AlarmTransConfigServlet?tag=2";
}

function addSwitch() {
	params = new Array(0,-1);//"0"说明是新增操作
	window.showModalDialog("alarmSwitchInfo.jsp",window,"dialogWidth=600px;dialogHeight=666px;help=0;scroll=0;status=0;");
}

function readSwitch() {
	editSwitch();
}

function editSwitch() {
	var selectedRows = oData.getPropertys("ALARM_SWITCH_CONFIG_ID");
	if(isExecute(selectedRows)) {
		params = new Array(1,selectedRows[0]);//"1"说明是修改操作，同时传递要修改的对象
		window.showModalDialog("alarmSwitchInfo.jsp",window,"dialogWidth=600px;dialogHeight=666px;help=0;scroll=0;status=0;");
	}
}

function storageSwitch() {
	var selectedRows = oData.getPropertys("ALARM_SWITCH_CONFIG_ID");
	if(isExecute(selectedRows)) {
		if(oData.getTexts(6) == "归档") {
			MMsg("开关已是归档状态！");
		} else {
			params = new Array();
			params.push("tag=" + 5);
			params.push("id=" + selectedRows[0])
			
			xmlhttp.open("POST", url + params.join('&'), false);
			xmlhttp.send();
			if(isSuccess(xmlhttp)) {
				MMsg("归档成功！");
			}
			window.oData.doRefresh(false);
		}
	}
}

function moveSwitch(direction) {
	var selectedRows = oData.getPropertys("ALARM_SWITCH_CONFIG_ID");
	if(isExecute(selectedRows)) {
		params = new Array();
		params.push("tag=" + 6);
		params.push("id=" + selectedRows[0]);
		params.push("direction=" + direction);
		
		xmlhttp.open("POST", url + params.join('&'), false);
		xmlhttp.send(sendXML.xml);
		
		if(isSuccess(xmlhttp)) {
			var iniXML = xmlhttp.responseXML;
			var result = iniXML.selectSingleNode("/root/Msg").text
			if(result != "success") {
				EMsg(result);
			}
		}
		
		window.oData.doRefresh(false);
	}
}

/**
 * 初始化日期
 */
function reloadDate()
{
	//起始日期
    var submitDate = new Date();//生效日期：上个月当天 (如果上个月不存在这个日期，则取下个月最后一天)
    
    var tempMonth = submitDate.getMonth();//结束日期：当天
    submitDate.setMonth(submitDate.getMonth() - 1);
    if(submitDate.getMonth()==tempMonth)
    {
        submitDate.setDate(0);
    }
    //结束日期
    VALID_DATE1.setYear(submitDate.getFullYear());//生效日期
    VALID_DATE1.setMonth(submitDate.getMonth() + 1);
    VALID_DATE1.setDay(submitDate.getDate());
    
    //失效日期段
    CANCEL_DATE1.setYear(submitDate.getFullYear());//结束日期
    CANCEL_DATE1.setMonth(submitDate.getMonth() + 1);
    CANCEL_DATE1.setDay(submitDate.getDate());
}

function clearDate(obj){
	obj.value = "";
}

/**
 * (1). 为XML节点添加子节点
 */
function addNewNode(infoNode, nodeName, nodeValue, attrNameArr, attrValueArr)
{
    if(nodeName==null) return;
    
    var dXML = infoNode.ownerDocument;
    var itemNode = dXML.createElement(nodeName);
    if(nodeValue!="") itemNode.text = nodeValue;
       
    if(attrNameArr!=null)
    {
        for(var i=0;i<attrNameArr.length;i++)
        {
              itemNode.setAttribute(attrNameArr[i], attrValueArr[i]);
        }
    }
    infoNode.appendChild(itemNode);
    return itemNode;
}