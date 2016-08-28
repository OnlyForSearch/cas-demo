var NULL_VALUE = "NULL";
var reloadTimeout = 20000;
var reloadStaffListTimeout = 120000;//60000
var reloadStateTimeout = 120000;
var reloadMessageTimeout = 10000;
var reloadCrmTimeOut = 18000;
var MESSAGE_VALIDITY = "90";

var TYPE_OF_TALK_TO_USER = "TYPE_OF_TALK_TO_USER";
var TYPE_OF_TALK_TO_EVENT = "TYPE_OF_TALK_TO_EVENT";
var TYPE_OF_TALK_TO_MESSAGE = "TYPE_OF_TALK_TO_MESSAGE";
var TYPE_OF_TALK_TO_BROADCAST = "N";

var TYPE_OF_ATTACHMENT = "1";
var TYPE_OF_IMAGE = "2";

var dutyId = "";
var stateId = "";

var registerEvents = new Array();   //已经打开的群聊窗口 (event_id)
var registerUsers  = new Array();   //已经打开的私聊窗口 (staff_id)
var registerMessages = new Array(); //已经打开的消息窗口 (message_id)

var isSender = -1;//是否发送者 (0表示非发送者；1表示发送者；-1表示不能确定)
var isShowBaseNet = false;//工单跟踪列表是显示 “工单状态字段”(false) 还是 “工单区域字段”true。

//function test()
//{
//    //alert(registerEvents.length+" -- "+registerUsers.length+" -- "+registerMessages.length);
//    for(var i=0;i<registerEvents.length;i++)
//    {
//        alert("registerEvents: "+registerEvents[i]);
//    }
//    for(var i=0;i<registerUsers.length;i++)
//    {
//        alert("registerUsers: "+registerUsers[i]);
//    }
//    for(var i=0;i<registerMessages.length;i++)
//    {
//        alert("registerMessages: "+registerMessages[i]);
//    }
//}

var staffStateXmlHttp;
var eventStateXmlHttp;
var eventStatisticXmlHttp;
var sourceTargetsXmlHttp;
var talkRecordsXmlHttp;
//1. 定时在线
function recycleStaffState()
{
    reloadStaffState();
    window.setTimeout("recycleStaffState()", reloadStateTimeout);
}
function reloadStaffState()
{
    staffStateXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	staffStateXmlHttp.open("POST", httpUrl+"tag=21&stateId="+stateId,true);
	staffStateXmlHttp.onreadystatechange = function ()
	{
	    if(staffStateXmlHttp!=null && staffStateXmlHttp.readyState==4 && isSuccess(staffStateXmlHttp))
        {
            var dXML = staffStateXmlHttp.responseXML;
            staffStateXmlHttp = null;
            stateId = dXML.selectSingleNode("/root/STATE_ID").text;
        }
	};
    staffStateXmlHttp.send();
}

function recycleStaffList()
{
    outlook.location.reload();
    window.setTimeout("recycleStaffList()", reloadStaffListTimeout);
}

//2. 重载事件
var eventStateTitleLength;
var eventIsOnDuty = 0;
var eventIsNx = 0;
function recycleEventState(titleLength, isOnDuty,IS_SERVICE_DESK_NX)
{
    eventStateTitleLength = titleLength;
    eventIsNx = IS_SERVICE_DESK_NX;
    reloadEventState(isOnDuty);
    window.setTimeout("recycleEventState("+titleLength+", "+isOnDuty+","+IS_SERVICE_DESK_NX+")",reloadTimeout);
}

function reloadEventState(isOnDuty,isLoadTable)
{
    if(isLoadTable == undefined || isLoadTable == null){
        isLoadTable = 1;
    }
	var url = httpUrl+"tag=2&isOnDuty="+isOnDuty+"&dutyId="+dutyId;
	if(document.getElementById("eventState"))
		url = url + "&eventState="+document.getElementById("eventState").value;
		
	eventIsOnDuty  = isOnDuty;
    eventStateXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	eventStateXmlHttp.onreadystatechange = function(){loadEventState(isOnDuty,isLoadTable)};
	eventStateXmlHttp.open("POST",url,true);
    eventStateXmlHttp.send();
}

function loadEventState(isOnDuty,isLoadTable)
{
	if(eventStateXmlHttp!=null && eventStateXmlHttp.readyState==4 && isSuccess(eventStateXmlHttp))
    {
        var dXML = eventStateXmlHttp.responseXML;
        //alert(dXML.xml);return;
        staffStateXmlHttp = null;       
   
        var iLen ;
        var rowObject;
        var cellObject;
       
        // 载入事件列表
        if(isLoadTable != 0){
            loadEventList(dXML);
        }
        //(3). 载入事件统计
        //var oRows = dXML.selectNodes("/root/COUNTS/rowSet");
        /*overdueEvents.innerHTML = dXML.selectSingleNode("/root/COUNTS/rowSet[EVENT_STATE=\"1\"]/COUNT_EVENT").text;
        waitingEvents.innerHTML = dXML.selectSingleNode("/root/COUNTS/rowSet[EVENT_STATE=\"2\"]/COUNT_EVENT").text;
        processingEvents.innerHTML = dXML.selectSingleNode("/root/COUNTS/rowSet[EVENT_STATE=\"3\"]/COUNT_EVENT").text;
        auditEvents.innerHTML = dXML.selectSingleNode("/root/COUNTS/rowSet[EVENT_STATE=\"4\"]/COUNT_EVENT").text;
        finishEvents.innerHTML = dXML.selectSingleNode("/root/COUNTS/rowSet[EVENT_STATE=\"5\"]/COUNT_EVENT").text;
        cancelEvents.innerHTML = dXML.selectSingleNode("/root/COUNTS/rowSet[EVENT_STATE=\"6\"]/COUNT_EVENT").text;
        */
        //事件统计
        parent.saveEvents.innerHTML = dXML.selectSingleNode("/root/COUNTS/rowSet[EVENT_STATE=\"7\"]/COUNT_EVENT").text;
        parent.newEvents.innerHTML = dXML.selectSingleNode("/root/COUNTS/rowSet[EVENT_STATE=\"8\"]/COUNT_EVENT").text;
        parent.waitDealEvents.innerHTML = dXML.selectSingleNode("/root/COUNTS/rowSet[EVENT_STATE=\"9\"]/COUNT_EVENT").text;
        parent.soonOverDueEvents.innerHTML = dXML.selectSingleNode("/root/COUNTS/rowSet[EVENT_STATE=\"10\"]/COUNT_EVENT").text;
        parent.runAfterEvents.innerHTML = dXML.selectSingleNode("/root/COUNTS/rowSet[EVENT_STATE=\"11\"]/COUNT_EVENT").text;
        parent.dealFinishEvents.innerHTML = dXML.selectSingleNode("/root/COUNTS/rowSet[EVENT_STATE=\"12\"]/COUNT_EVENT").text;
        
        var oTranEventNode=dXML.selectSingleNode("/root/COUNTS/rowSet[EVENT_STATE=\"13\"]/COUNT_EVENT");
        var transEvents = (oTranEventNode)?oTranEventNode.text:0;
        if(document.all.transEvents)
        {
            transEvents.innerHTML = transEvents;
        }
        else if(oTranEventNode && transEvents>0)
        {
            var url = 'service_requests_nx.htm?eventState=7&isOnDuty='+eventIsOnDuty+'&dutyId='+((dutyId)?dutyId:'');
            
            var oTable = document.all.serviceEventStateCounts;
            rowObject = oTable.insertRow();
            rowObject.id = "transTR";
            rowObject.onclick = function(){displayMaxWindow(url)};
            rowObject.style.cursor = "hand";
            rowObject.className = "SummCellBg";
            rowObject.onMouseOver = function(){settingStyle(this, "SummCellBghover")};
            rowObject.onMouseOut = function(){settingStyle(this, "SummCellBg")};
            
            cellObject = rowObject.insertCell();
            cellObject.height = '70';
            cellObject.align = 'center';
            cellObject.innerHTML = '&nbsp;&nbsp;<a href="javascript:"><img src="../../resource/image/serviceDesk/summary_finish.gif" width="32" height="32" border="0"></a>';
            
            cellObject = rowObject.insertCell();
            cellObject.innerHTML = '<span class="fontBlackBold"><a href="javascript:" class="fontBlackBoldLink">转需求的请求</a></span> 提出的请求被竣工，并转需求 ';
            
            cellObject = rowObject.insertCell();
            cellObject.nowrap = '';
            cellObject.className = 'fontBlack';
            cellObject.innerHTML = '<a href="javascript:" style=text-decoration:none;width:100%><strong><font id="transEvents" color="#3466A9" size="4" face="Verdana, Arial, Helvetica, sans-serif">'+transEvents+'</font></strong></a>';
            
              //'<tr id="transTR" onclick=displayMaxWindow("'+url+'") style="cursor:hand" class="SummCellBg" onMouseOver=settingStyle(this, "SummCellBghover") onMouseOut=settingStyle(this,"SummCellBg")>'+
              //  '<td height="70" align="center" >&nbsp;&nbsp;<a href="javascript:"><img src="../../resource/image/serviceDesk/summary_finish.gif" width="32" height="32" border="0"></a></td>'+
              //  '<td><span class="fontBlackBold"><a href="javascript:" class="fontBlackBoldLink">转需求的请求</a></span> 提出的请求被竣工，并转需求 </td>'+
              //  '<td nowrap class="fontBlack"><a href="javascript:" style=text-decoration:none;width:100%><strong><font id="transEvents" color="#3466A9" size="4" face="Verdana, Arial, Helvetica, sans-serif">'+transEvents+'</font></strong></a></td>'+
              //'</tr>';
        }
        
        var overTimeObj = (dXML.selectSingleNode("/root/TIME/rowSet/SYS_VAR_VALUE"));
        var time=0;
        if(overTimeObj!=null){
        	time=overTimeObj.text;
        }
        //alert(time);
        parent.FOverTime.innerHTML="派给当前员工剩余"+time+"小时将超时的单"
    }
}

function loadEventList(dXML)
{
	 //(1). 清空数据 (首行的标题不删除)
	    var eventRequests = parent.eventRequests;
	    var datas = parent.eventRequests.rows;
	    for(var i=datas.length-1;i>0;i--){
	        datas[i].removeNode(true);
	    }
        //(2). 载入事件列表
        var oRows = dXML.selectNodes("/root/EVENTS/rowSet");
        var iLen = oRows.length;
        var rowObject;
        var cellObject;
        var isOverdue;
        var isEdit;
        var clickAction;
        var eventState;
        var tchName;
        var tempStr;
        var flowId;
        var eventKindName;
        var eventStateName;
        var eventTypeName;
        var overdatestate;
        var staff_name;
        var event_serial;
        var baseNet;
        var event_state_value;
        for(var i=0;i<iLen;i++)
        {
            isOverdue = oRows[i].selectSingleNode("IS_OVERDUE").text;
            isEdit = oRows[i].selectSingleNode("IS_EDIT").text;
            eventState = oRows[i].selectSingleNode("EVENT_STATE").text;
            tchName = oRows[i].selectSingleNode("TCH_NAME").text;
            flowId = oRows[i].selectSingleNode("FLOW_ID").text;
            eventKindName = oRows[i].selectSingleNode("EVENT_KIND_NAME").text;
            eventStateName = oRows[i].selectSingleNode("EVENT_STATE_NAME").text;
            eventTypeName = oRows[i].selectSingleNode("EVENT_TYPE_NAME").text;
            overDateState = oRows[i].selectSingleNode("OVERDATESTATE").text;
            staff_name = oRows[i].selectSingleNode("STAFF_NAME").text;
            event_serial = oRows[i].selectSingleNode("EVENT_SERIAL").text;
            baseNet = oRows[i].selectSingleNode("BASE_NET").text;
            event_state_value = oRows[i].selectSingleNode("EVENT_STATE_VALUE").text;
            submitTime = oRows[i].selectSingleNode("SUBMIT_TIME").text; 
            if(isEdit=="1")
            {
                clickAction = "../workshop/form/index.html?tchId="+oRows[i].selectSingleNode("TCH_ID").text+"&fullscreen=yes&callback=opener.reloadEventState()";
            }else
            {
                clickAction = "../workshop/form/index.html?tchId="+oRows[i].selectSingleNode("TCH_ID").text+"&fullscreen=yes&callback=opener.reloadEventState()";
            }
            rowObject = eventRequests.insertRow();
            rowObject.style.cursor = "hand";
            rowObject.className = "SummCellBg";
            rowObject.height = "30px";
                     
            //图片
            cellObject = rowObject.insertCell();//2
            cellObject.style.width="10px";
            cellObject.innerHTML = '<img src="../../resource/image/indexImage/index1_55.gif">';
            
             //提单时间
            cellObject = rowObject.insertCell();//1
            cellObject.innerHTML = ''+submitTime+'';
            
            
            //if(eventIsOnDuty != 1){
	        //    cellObject = rowObject.insertCell();//3cellObject = rowObject.insertCell();//3
	        //    cellObject.innerHTML = ''+event_serial+'';
            //}
            
            //标题
            cellObject = rowObject.insertCell();//2
            cellObject.style.textAlign = "left";
            cellObject.innerHTML = getNewImage(oRows[i].selectSingleNode("STATE_DATE").text)+
                                   '<a href="javascript:openFlowWindow(\''+clickAction+'\',\''+flowId+'\')" style="height:100%;text-overflow:ellipsis;overflow:hidden;">'+
                                     oRows[i].selectSingleNode("EVENT_TITLE").text+
                                   '</a>';
                                    
            //处理情况
            cellObject = rowObject.insertCell();//5
            cellObject.style.width="65px";
            if(!isShowBaseNet)
            {
                tempStr = '<div style="height:100%;width=75px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">';
                if(isOverdue=="1") {cellObject.style.color="#000000";tempStr += '<span id="eventState_'+flowId+'">逾期</span>';}
                else if(isEdit=="1") {cellObject.style.color="#000000";tempStr += '<span id="eventState_'+flowId+'">'+eventState+'</span>'}
                else {tempStr += eventState;}
                tempStr += '</div>';
                cellObject.innerHTML = tempStr;
            }else{
                cellObject.innerHTML = '<span id="eventState_'+flowId+'" style="color:black;">'+baseNet+'</span>';
            }
            
            //处理结果
            cellObject = rowObject.insertCell();//2
            cellObject.style.textAlign = "center";
            cellObject.innerHTML = '<span id="dealOption_'+flowId+'"></span>';
            
            //操作
            cellObject = rowObject.insertCell();//2
            cellObject.style.textAlign = "center";
            if(event_state_value == '4'){
                cellObject.innerHTML = '<a href="javascript:execTache(\''+flowId+'\')" style="height:100%;text-overflow:ellipsis;overflow:hidden;">'+
                                            '确认结果'+
                                       '</a>'
                                       + "&nbsp;&nbsp;&nbsp;"
                                       +'<a href="javascript:openFlowWindow(\''+clickAction+'\',\''+flowId+'\')" style="height:100%;text-overflow:ellipsis;overflow:hidden;">'+
                                            '详细'+
                                       '</a>';
            }else{
                cellObject.innerHTML = '<a href="javascript:openFlowWindow(\''+clickAction+'\',\''+flowId+'\')" style="height:100%;text-overflow:ellipsis;overflow:hidden;">'+
                                            '详细'+
                                       '</a>';
            }    
            /**
            cellObject = rowObject.insertCell();//3cellObject = rowObject.insertCell();//3
            cellObject.innerHTML = ''+eventTypeName+'';
            
            
            
            cellObject = rowObject.insertCell();//3cellObject = rowObject.insertCell();//3
            cellObject.innerHTML = ''+eventKindName+'';
            
            
            
            cellObject = rowObject.insertCell();//3cellObject = rowObject.insertCell();//3
            cellObject.innerHTML = ''+staff_name+'';
           
            
           
            
                
           		cellObject = rowObject.insertCell();//4
	            cellObject.style.width="85px";
	            tempStr = '<div style="height:100%;width=85px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">';
	            if(isOverdue=="1") {cellObject.style.color="#ff0000";if(isEdit=="1"){tempStr+='<span style="color:#FFA500">'+tchName+'</span>';}else{tempStr+=tchName;}}
	            else if(isEdit=="1") {cellObject.style.color="#FFA500";tempStr += tchName;}
	            else {tempStr += tchName;}
	            tempStr += '</div>';
	            cellObject.innerHTML = tempStr;
	            
	            cellObject = rowObject.insertCell();//3cellObject = rowObject.insertCell();//3
                //cellObject.style.width="110px";
                if(overDateState == "超时")
                    cellObject.style.color = "red";
                cellObject.innerHTML = '<nobr>'+overDateState+'</nobr>';
           **/		
         
        }
}

function formatTime(dateStr)
{
    if(dateStr==null || dateStr=="") {return "00";}
    else if(dateStr<10) {return "0"+dateStr;}
    else {return dateStr;}
}

function openFlowWindow(url,flowId){
	displayMaxWindow(url);
	if(flowId!=''||flowId!=0){
  		xmlhttp.open("POST",httpUrl+"tag=34&flowId="+flowId,false);
	    xmlhttp.send();
	    if(isSuccess(xmlhttp))
	    {
	        var dXML = new ActiveXObject("Microsoft.XMLDOM");
	        //dXML.load(xmlhttp.responseXML);
	  	}
	 }
}

function getNewImage(stateDate)
{
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate()-3);
    var dateStr = currentDate.getFullYear()+"-"+formatTime(currentDate.getMonth()+1)+"-"+formatTime(currentDate.getDate())+" "+
                  formatTime(currentDate.getHours())+":"+formatTime(currentDate.getMinutes());
    if(stateDate>dateStr)
    {
        return '<IMG SRC="../../resource/image/indexImage/new_info.gif">';
    }
    return '';
}function formatTime(dateStr)
{
    if(dateStr==null || dateStr=="") {return "00";}
    else if(dateStr<10) {return "0"+dateStr;}
    else {return dateStr;}
}


// 3. 打开新窗口
function openNormalWindow(url, height)
{
    var iWidth = 780;
    var iHeight = ((height==null)?580:height);
    var top = (screen.availHeight-iHeight)/2;
    var left = (screen.availWidth-iWidth)/2;
    var sFeatures = new Array();
    sFeatures.push("width="+iWidth);
    sFeatures.push("height="+iHeight);
    sFeatures.push("top="+top);
    sFeatures.push("left="+left);
    sFeatures.push("location="+0);
    sFeatures.push("menubar="+0);
    sFeatures.push("resizable="+1);
    sFeatures.push("scrollbars="+1);
    sFeatures.push("status="+0);
    sFeatures.push("titlebar="+0);
    sFeatures.push("toolbar="+0);
    window.open(url, "", sFeatures.join(","));
}
function displayMaxWindow(url)
{
    var width = screen.availWidth;
    var height = screen.availHeight;
    var top = (screen.availHeight-height)/2;
    var left = (screen.availWidth-width)/2;
    var sFeatures = new Array();
    sFeatures.push("width="+width);
    sFeatures.push("height="+height);
    sFeatures.push("top="+top);
    sFeatures.push("left="+left);
    sFeatures.push("location="+0);
    sFeatures.push("menubar="+0);
    sFeatures.push("resizable="+1);
    sFeatures.push("scrollbars="+1);
    sFeatures.push("status="+0);
    sFeatures.push("titlebar="+0);
    sFeatures.push("toolbar="+0);
    window.open(url, "", sFeatures.join(","));
}
function sendMessageDialog(url)
{
    //window.showModalDialog("service_broadcast.htm", null,"dialogWidth=520px;dialogHeight=610px;help=0;scroll=0;status=0;");
    
    var iWidth = 720;//930
    var iHeight = 500;//430
    var top = (screen.availHeight-iHeight)/2;
    var left = (screen.availWidth-iWidth)/2;
    var sFeatures = new Array();
    sFeatures.push("width="+iWidth);
    sFeatures.push("height="+iHeight);
    sFeatures.push("top="+top);
    sFeatures.push("left="+left);
    sFeatures.push("location=0");
    sFeatures.push("menubar=0");
    sFeatures.push("resizable=0");
    sFeatures.push("scrollbars=0");
    sFeatures.push("status=0");
    sFeatures.push("titlebar=0");
    sFeatures.push("toolbar=0");
    window.open(url, "", sFeatures.join(","));
}

// 4. 样式装换
function settingStyle(obj, className)
{
    //var obj = getElement(event.srcElement, "TR");
    obj.className=className;
}

// 5. 为XML节点添加子节点
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

var crmComplainXmlHttp,show_High;
function reloadCRMComplain(showHigh){
	var hUrl = "../../servlet/serviceDeskServlet?";
	crmComplainXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	crmComplainXmlHttp.onreadystatechange = loadCRMComplain;
	crmComplainXmlHttp.open("POST", hUrl+"tag=33",true);
    crmComplainXmlHttp.send();
    show_High=showHigh;
    window.setTimeout("reloadCRMComplain("+showHigh+")",reloadCrmTimeOut);
}

var crmUrl;
function loadCRMComplain(){
	if(crmComplainXmlHttp!=null && crmComplainXmlHttp.readyState==4 && isSuccess(crmComplainXmlHttp)){
		var dXML = crmComplainXmlHttp.responseXML;
		//alert(dXML.selectNodes("/root/rowSet/CNT_UNPROC").text);
		//var CNT_UNPROC = dXML.selectSingleNode("/root/COUNT/rowSet/CNT_UNPROC").text;
		//var CNT_PROC = dXML.selectSingleNode("/root/COUNT/rowSet/CNT_PROC").text;
		var isShow = dXML.selectSingleNode("/root/rowSet/IS_SHOW").text;
		var isLink = dXML.selectSingleNode("/root/rowSet/IS_LINK").text;
		var isShowHigh = dXML.selectSingleNode("/root/rowSet/IS_SHOW_HIGH").text;
		if(isShow=='0BF'){
			crmComplain.style.display="none";
		}
		if(show_High=='1'&&isShowHigh=='0BT'){
			formHigh.style.display="";
		}
		
		var GHGH = dXML.selectSingleNode("/root/rowSet/GHGH").text;
		var GH_NAME = dXML.selectSingleNode("/root/rowSet/GH_NAME").text;
		var TEAM_ID = dXML.selectSingleNode("/root/rowSet/TEAM_ID").text;
		var TEAM_NAME = dXML.selectSingleNode("/root/rowSet/TEAM_NAME").text;
		var TEAM_NET = dXML.selectSingleNode("/root/rowSet/TEAM_NET").text;
		var AREA_ID = dXML.selectSingleNode("/root/rowSet/AREA_ID").text;
		var TEAM_MEMBER_ID = dXML.selectSingleNode("/root/rowSet/TEAM_MEMBER_ID").text;
		
		var temp_un_count = dXML.selectSingleNode("/root/rowSet/TEMP_UN_COUNT").text;
		var temp_count = dXML.selectSingleNode("/root/rowSet/TEMP_COUNT").text;
		var staff_count = dXML.selectSingleNode("/root/rowSet/STAFF_COUNT").text;
		var current_team_count = dXML.selectSingleNode("/root/rowSet/CURRENT_TEAM_COUNT").text;
		
		crmUrl = "http://135.160.9.28:10093/crmweb/module_gensoinfo/custintqueryInterface.htm?"
		+ "staff="+GHGH+"&staffName="+GH_NAME+"&teamId="+TEAM_ID+"&teamName="+TEAM_NAME
		+"&localAreaId="+TEAM_NET+"&areaId="+AREA_ID+"&teamMemberId="+TEAM_MEMBER_ID;
		
		//crmUnCount.innerHTML=""+CNT_UNPROC+"条投诉未认领;&nbsp;"
		//crmCount.innerHTML="已认领投诉"+CNT_PROC+"条";
		var datas = serviceCrmCounts.rows;
        //alert(datas.length);
        for(var i=datas.length-1;i>0;i--)
        {
            datas[i].removeNode(true);
        }
		
		rowObject = serviceCrmCounts.insertRow();
        if(isLink=='0BT'){
        	//rowObject.onclick = function(){openCrmWindow();};
        }
        rowObject.style.cursor = "hand";
        rowObject.className = "SummCellBg";
        //rowObject.onmouseover = function(){settingStyle(this, 'SummCellBghover');};
        //rowObject.onmouseout = function(){settingStyle(this, 'SummCellBg');};
        
        cellObject = rowObject.insertCell();//1
        cellObject.style.width="10px";
        cellObject.innerHTML = '<img src="../../resource/image/indexImage/index1_55.gif">';
        
        cellObject = rowObject.insertCell();
        cellObject.innerHTML = "<a href=\""+crmUrl+"\" target='_blank'>"+temp_un_count+"</a>";
        
        cellObject = rowObject.insertCell();
        cellObject.innerHTML = "<a href=\""+crmUrl+"\"  target='_blank'>"+temp_count+"</a>";
        
        cellObject = rowObject.insertCell();
        cellObject.innerHTML = "<a href=\""+crmUrl+"\"  target='_blank'>"+staff_count+"</a>";
        
        cellObject = rowObject.insertCell();
        cellObject.innerHTML = "<a href=\""+crmUrl+"\"  target='_blank'>"+current_team_count+"</a>";
        
	}
}

function openCrmWindow(isLink){
	
	if(isLink=="0BT"){
		//displayMaxWindow(crmUrl);
		var width = screen.availWidth;
	    var height = screen.availHeight;
	    var sFeatures = new Array();
	    //sFeatures.push("width="+iWidth);
	    //sFeatures.push("height="+iHeight);
	    //sFeatures.push("top="+0);
	    //sFeatures.push("left="+0);
	    sFeatures.push("location=1");
	    sFeatures.push("menubar=1");
	    sFeatures.push("resizable=1");
	    sFeatures.push("scrollbars=1");
	    sFeatures.push("status=1");
	    sFeatures.push("titlebar=1");
	    sFeatures.push("toolbar=1");
	    sFeatures.push("fullscreen=1");
    
		window.open(crmUrl,"",sFeatures);
	}
}


// 6. 重载统计表
function recycleEventStatistic()
{
    reloadEventStatistic();
    window.setTimeout("recycleEventStatistic()",60000);
}
function reloadEventStatistic()
{
    eventStatisticXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	eventStatisticXmlHttp.onreadystatechange = loadEventStatistic;
	eventStatisticXmlHttp.open("POST", httpUrl+"tag=4&column="+eventCategory.value+"&dutyId="+dutyId,true);
    eventStatisticXmlHttp.send();
}

function loadEventStatistic()
{
	if(eventStatisticXmlHttp!=null && eventStatisticXmlHttp.readyState==4 && isSuccess(eventStatisticXmlHttp))
    {
        var dXML = eventStatisticXmlHttp.responseXML;
        eventStatisticXmlHttp = null;
        
        //(1). 清空数据 (首行的标题不删除)
        var datas = eventStatistic.rows;
        //alert(datas.length);
        for(var i=datas.length-1;i>0;i--)
        {
            datas[i].removeNode(true);
        }
   
        //(2). 载入事件列表
        var oCols = dXML.selectNodes("/root/CATEGORYS/rowSet");//NAME,ID
        var oRows = dXML.selectNodes("/root/COUNTS/rowSet");//ID, EVENT_STATE, COUNT_EVENT
        var iLen = oCols.length;
        var rowObject;
        var cellObject;
        var colId;
        var rowCount;
        var totalEvents = new Array(0, 0, 0, 0);
   		
        //(2-1). 已指派
        for(var i=0;i<iLen;i++)
        {
            colId = oCols[i].childNodes[1].text;
            rowObject = eventStatistic.insertRow();
            
            cellObject = rowObject.insertCell();//1
            cellObject.id = "columnvertical";
            cellObject.style.width = "67px";
            cellObject.innerHTML = oCols[i].childNodes[0].text;
            
            cellObject = rowObject.insertCell();//2
            cellObject.id = "columneven";
            rowCount = fetchEventAmounts(dXML, colId, 1);
            totalEvents[0] += rowCount;
            cellObject.innerHTML = settingEventAmounts(dXML, colId, 1, rowCount);
            
           
           	cellObject = rowObject.insertCell();//3
            cellObject.id = "columnodd";
            rowCount = fetchEventAmounts(dXML, colId, 8);
            totalEvents[1] += rowCount;
            cellObject.innerHTML = settingEventAmounts(dXML, colId, 8, rowCount);
           
            cellObject = rowObject.insertCell();//4
            cellObject.id = "columneven";
            rowCount = fetchEventAmounts(dXML, colId, 3);
            totalEvents[2] += rowCount;
            cellObject.innerHTML = settingEventAmounts(dXML, colId, 3, rowCount);
            
            cellObject = rowObject.insertCell();//5
            cellObject.id = "columnodd";
            rowCount = fetchEventAmounts(dXML, colId, 4);
            totalEvents[3] += rowCount;
            cellObject.innerHTML = settingEventAmounts(dXML, colId, 4, rowCount);
        }
        
        //(2-2). 未指派
        colId = '';
        rowObject = eventStatistic.insertRow();
        cellObject = rowObject.insertCell();//1
        cellObject.id = "unassignedhead";
        cellObject.style.width = "67px";
        cellObject.innerHTML = "未分配";
        
        cellObject = rowObject.insertCell();//2
        cellObject.id = "unassignedonhold";
        rowCount = fetchEventAmounts(dXML, colId, 1);
        totalEvents[0] += rowCount;
        cellObject.innerHTML = settingEventAmounts(dXML, NULL_VALUE, 1, rowCount);
        
        //if(IS_SERVICE_DESK_NX!="1"){
	        cellObject = rowObject.insertCell();//3
	        cellObject.id = "unassignedover";
	        rowCount = fetchEventAmounts(dXML, colId, 8);
	        totalEvents[1] += rowCount;
	        cellObject.innerHTML = settingEventAmounts(dXML, NULL_VALUE, 8, rowCount);
       // }
        cellObject = rowObject.insertCell();//4
        cellObject.id = "unassignedonhold";
        rowCount = fetchEventAmounts(dXML, colId, 3);
        totalEvents[2] += rowCount;
        cellObject.innerHTML = settingEventAmounts(dXML, NULL_VALUE, 3, rowCount);
        
        cellObject = rowObject.insertCell();//5
        cellObject.id = "unassignedover";
        rowCount = fetchEventAmounts(dXML, colId, 4);
        totalEvents[3] += rowCount;
        cellObject.innerHTML = settingEventAmounts(dXML, NULL_VALUE, 4, rowCount);
        
        //(2-3). 总计 (因为一个事件可能允许经过多个"值班人员"，所以必须排重)
        rowObject = eventStatistic.insertRow();
        cellObject = rowObject.insertCell();//1
        cellObject.id = "totalhead";
        cellObject.style.width = "67px";
        cellObject.innerHTML = "总计";
        
        var isTotal = (dXML.selectSingleNode("/root/COUNTS/rowSet[ID=\"-1\"]")!=null);
        //isTotal = false;
        cellObject = rowObject.insertCell();//2
        cellObject.id = "totalonhold";
        if(isTotal)
        {
            rowCount = fetchEventAmounts(dXML, -1, 1);
            cellObject.innerHTML = settingEventAmounts(dXML, null, 1, rowCount);//totalEvents[0]
        }else
        {
            cellObject.innerHTML = settingEventAmounts(dXML, null, 1, totalEvents[0]);
        }
        //if(IS_SERVICE_DESK_NX!="1"){
	        cellObject = rowObject.insertCell();//3
	        cellObject.id = "totalover";
	        if(isTotal)
	        {
	            rowCount = fetchEventAmounts(dXML, -1, 8);
	            cellObject.innerHTML = settingEventAmounts(dXML, null, 8, rowCount);//totalEvents[1]
	        }else
	        {
	            cellObject.innerHTML = settingEventAmounts(dXML, null, 8, totalEvents[1]);
	        }
        //}
        cellObject = rowObject.insertCell();//4
        cellObject.id = "totalonhold";
        if(isTotal)
        {
            rowCount = fetchEventAmounts(dXML, -1, 3);
            cellObject.innerHTML = settingEventAmounts(dXML, null, 3, rowCount);//totalEvents[2]
        }else
        {
            cellObject.innerHTML = settingEventAmounts(dXML, null, 3, totalEvents[2]);
        }
        
        cellObject = rowObject.insertCell();//5
        cellObject.id = "totalover";
        if(isTotal)
        {
            rowCount = fetchEventAmounts(dXML, -1, 4);
            cellObject.innerHTML = settingEventAmounts(dXML, null, 4, rowCount);//totalEvents[3]
        }else
        {
            cellObject.innerHTML = settingEventAmounts(dXML, null, 4, totalEvents[3]);
        }
        
        
        //alert(dXML.selectSingleNode("/root/COUNTS/rowSet[ID=\"\" and EVENT_STATE=\"3\"]/COUNT_EVENT").text);return;
    }
}

function fetchEventAmounts(dXML, id, eventState)
{
    var eventAmounts = dXML.selectSingleNode("/root/COUNTS/rowSet[ID=\""+id+"\" and EVENT_STATE=\""+eventState+"\"]/COUNT_EVENT");
    if(eventAmounts!=null)
    {
        return parseInt(eventAmounts.text);
    }else
    {
        return 0;
    }
}

function settingEventAmounts(dXML, id, eventState, eventAmounts)
{
    if(eventAmounts>0)
    {
        if(id!=null) return '<a href="javascript:displayMaxWindow(\'service_requests_nx.htm?isOnDuty=1&dutyId='+dutyId+'&'+eventCategory.value+'='+id+'&eventState='+eventState+'\')">'+eventAmounts+'</a>';
        else return '<a href="javascript:displayMaxWindow(\'service_requests_nx.htm?isOnDuty=1&dutyId='+dutyId+'&eventState='+eventState+'\')">'+eventAmounts+'</a>';
    }else
    {
        return 0;
    }
}

//7. 注册
function registerObject(type, objId)
{
    if(objId==null) return;
    
    var isExists = false;
    var registerArr;
    
    if(type==TYPE_OF_TALK_TO_EVENT) registerArr = registerEvents;
    else if(type==TYPE_OF_TALK_TO_USER) registerArr = registerUsers;
    else registerArr = registerMessages;
    
    for(var i=0;i<registerArr.length;i++)
    {
        if(registerArr[i]==objId)
        {
            isExists = true;
            break;
        }
    }
    
    if(!isExists) registerArr.push(objId);
}

//8. 解除注册
function unregisterObject(type, objId)
{
    if(objId==null) return;
    
    var isReplace = false;
    var registerArr;
    
    if(type==TYPE_OF_TALK_TO_EVENT) registerArr = registerEvents;
    else if(type==TYPE_OF_TALK_TO_USER) registerArr = registerUsers;
    else registerArr = registerMessages;
        
    for(var i=0;i<registerArr.length;i++)
    {
        if(isReplace)
        {
            registerArr[i-1] = registerArr[i];
        }
        else if(registerArr[i]==objId)
        {
            registerArr[i] = null;//可删除
            isReplace = true;
        }
    }
    
    if(isReplace)
    {
        if(registerArr.length>0) registerArr.length = registerArr.length-1;
    }
}


//9. 未读的信息来源对象
var sourceTargetOnDuty = 0;
function recycleSourceTargets(isOnDuty)
{
    sourceTargetOnDuty = isOnDuty;
    receiveSourceTargets();
    window.setTimeout("recycleSourceTargets("+isOnDuty+")", reloadMessageTimeout);
}

function receiveSourceTargets(isOnDuty)
{
    //(1). 获取来源对象
    var sendXML = new ActiveXObject("Microsoft.XMLDOM");
    sendXML.loadXML('<?xml version="1.0" encoding="gb2312"?><root></root>');
    var rootNode = sendXML.selectSingleNode("root");
    //(1-1). 事件
    var eventNode = addNewNode(rootNode, "EVENTS");
    for(var i=0;i<registerEvents.length;i++)
    {
        if(registerEvents[i]!=null) addNewNode(eventNode, "EVENT_ID", registerEvents[i]);
    }
    //(1-2). 用户
    var userNode = addNewNode(rootNode, "USERS");
    for(var i=0;i<registerUsers.length;i++)
    {
        if(registerUsers[i]!=null) addNewNode(userNode, "USER_ID", registerUsers[i]);
    }
    //(1-3). 消息
    var messageNode = addNewNode(rootNode, "MESSAGES");
    for(var i=0;i<registerMessages.length;i++)
    {
        if(registerMessages[i]!=null) addNewNode(messageNode, "MESSAGE_ID", registerMessages[i]);
    }
    
    //(2). 弹出窗口，并注册
    sourceTargetsXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	sourceTargetsXmlHttp.onreadystatechange = loadSourceTargets;
	sourceTargetsXmlHttp.open("POST", httpUrl+"tag=11",true);
    sourceTargetsXmlHttp.send(sendXML);
}

function loadSourceTargets()
{
	if(sourceTargetsXmlHttp!=null && sourceTargetsXmlHttp.readyState==4 && isSuccess(sourceTargetsXmlHttp))
    {
        var dXML = sourceTargetsXmlHttp.responseXML;
        sourceTargetsXmlHttp = null;
        //alert(dXML.xml);
        
        var oRows = dXML.selectNodes("/root/rowSet");
        var oItem;
        var type;
        var params = new Array();
        for(var i=0;i<oRows.length;i++)
        {
            oItem = oRows[i];
            type = oItem.selectSingleNode("TYPE").text;
            params.push("isOnDuty="+sourceTargetOnDuty);
            params.push("type="+type);
            params.push("id="+oItem.selectSingleNode("ID").text);
            params.push("title="+encodeURIComponent(oItem.selectSingleNode("TITLE").text));
            params.push("isSender="+oItem.selectSingleNode("IS_SELF").text);
            if(type==TYPE_OF_TALK_TO_EVENT)//type==TYPE_OF_TALK_TO_USER || 
            {
                openNormalWindow("service_call_talk.htm?"+params.join("&"), "433");
            }else
            {
                sendMessageDialog("service_broadcast.htm?"+params.join("&"));
            }
        }
    }
}

//10. 初始化下拉框
function reloadSelection(selectionObj, oRows)
{
    var oOption;
    var iLen = selectionObj.length;
    for(var i=iLen-1;i>=0;i--){
        selectionObj.options.remove(i);
    }
    if(oRows==null) {return;}
    
    iLen = oRows.length;
    for(var i=0;i<iLen;i++)
    {
        oOption = document.createElement("OPTION");
        oOption.value = oRows[i].childNodes[1].text;
        oOption.text = oRows[i].childNodes[0].text;
        selectionObj.add(oOption);
    }
}

//11. 表情信息
function initEmotions(emotionList, popEmotion)
{
    var dXML=new ActiveXObject("Microsoft.XMLDOM");
	dXML.async = false;
	dXML.load("../../resource/xml/emotion.xml");
	var oRows=dXML.selectNodes("/EMOTIONS/EMOTION");
	var iLen = oRows.length;
	
    var rowObject1;
    var rowObject2;
    var cellObject;
    
    var src;
    var titile;
    
    for(var i=0;i<iLen;)
    {
        rowObject1 = emotionList.insertRow();
        //rowObject2 = emotionList.insertRow();
        for(var j=0;j<10 && i<iLen;j++,i++)
        {
            src = "../../"+oRows[i].selectSingleNode("SRC").text;
            title = oRows[i].getAttribute("title");
            cellObject = rowObject1.insertCell();
            cellObject.innerHTML = '<img src="'+src+'" baksrc="'+src+'" onclick="addEmotion(this,popEmotion)" style="cursor:hand" alt="'+title+'" title="'+title+'">';
            
            //cellObject = rowObject2.insertCell();
            //cellObject.innerHTML = '<nobr>'+title+'</nobr>';
        }
    }
}

function addEmotion(obj, popEmotion)
{
    var emotionObj = document.createElement("img");
    emotionObj.src = obj.baksrc;
    emotionObj.title = obj.title;
    emotionObj.alt = obj.alt;
    messageContent.appendChild(emotionObj);
    hideObj(popEmotion);
    //popupPage.hide();
}

//12. 添加聊天记录
function appendTalkRecords(replyName, replyDate, replyContent)
{
    if(talkingRecords==null) return;
    var rowObject = talkingRecords.insertRow();
    var cellObject = rowObject.insertCell();
    cellObject.style.wordWrap = "break-word";
    cellObject.style.wordBreak = "break-all";
    cellObject.innerHTML = '<div style="color: #7A7672;white-space:nowrap;padding-right:10px;">'+replyName+' ('+replyDate+')</div>'+
                           '<div style="padding-left:10px;">'+convertToHtml(replyContent)+'</div>';
}

//13. 未读聊天记录
function recycleTalkRecords(currentType, currentObjId, isSender)
{
    receiveTalkRecords(currentType, currentObjId, isSender);
    timeoutObj = window.setTimeout("recycleTalkRecords('"+currentType+"',"+currentObjId+","+isSender+")", reloadMessageTimeout);
}

function receiveTalkRecords(currentType, currentObjId, isSender)
{
    talkRecordsXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	talkRecordsXmlHttp.onreadystatechange = loadTalkRecords;
	talkRecordsXmlHttp.open("POST", httpUrl+"tag=10&type="+currentType+"&targetId="+currentObjId+"&isSender="+isSender,true);
    talkRecordsXmlHttp.send();
}

function loadTalkRecords()
{
	if(talkRecordsXmlHttp!=null && talkRecordsXmlHttp.readyState==4 && isSuccess(talkRecordsXmlHttp))
    {
        var dXML = talkRecordsXmlHttp.responseXML;
        talkRecordsXmlHttp = null;
        //alert(dXML.xml);
        
        var oRows = dXML.selectNodes("/root/rowSet");
        var oItem;
        var params = new Array();
        var iLen = oRows.length;
        for(var i=0;i<iLen;i++)
        {
            oItem = oRows[i];
            appendTalkRecords(oItem.selectSingleNode("REPLY_NAME").text, 
                              oItem.selectSingleNode("REPLY_DATE").text, 
                              oItem.selectSingleNode("REPLY_CONTENT").text);
        }
        
        if(iLen>0)
        {
            historyTalk.scrollTop = historyTalk.scrollHeight;
            window.focus();//获得焦点
            if(typeof(reloadOnlineStaffState)=="function"){reloadOnlineStaffState();}
        }
    }
}

//14. 历史聊天记录
function showMessageHistory(isOnDuty, currentType, currentObjId)
{
    var params = new Array();
    params.push("isOnDuty="+isOnDuty);
    params.push("type="+currentType);
    params.push("id="+currentObjId);
    displayMaxWindow("service_message_history.htm?"+params.join("&"));
}

function showCurrentMessage(messageId)
{
    var iWidth = 500;
    var iHeight = 580;
    var top = (screen.availHeight-iHeight)/2;
    var left = (screen.availWidth-iWidth)/2;
    var sFeatures = new Array();
    sFeatures.push("width="+iWidth);
    sFeatures.push("height="+iHeight);
    sFeatures.push("top="+top);
    sFeatures.push("left="+left);
    sFeatures.push("location=0");
    sFeatures.push("menubar=0");
    sFeatures.push("resizable=1");
    sFeatures.push("scrollbars=1");
    sFeatures.push("status=0");
    sFeatures.push("titlebar=0");
    sFeatures.push("toolbar=0");
    window.open("service_message_records.htm?messageId="+currentObjId, "", sFeatures.join(","));
    //openNormalWindow("service_message_records.htm?messageId="+currentObjId);
    //window.showModalDialog("service_message_records.htm?messageId="+currentObjId,null,"resizable=no;dialogWidth=500px;dialogHeight=580px;help=0;status=0;");
}

//15. 其他函数
function getCurrentDate()
{
    var currentDate = new Date();
    return currentDate.getFullYear() + "-" + getFullTime(currentDate.getMonth()+1) + "-" + getFullTime(currentDate.getDate()) + " "+
           getFullTime(currentDate.getHours()) + ":" + getFullTime(currentDate.getMinutes()) + ":" + getFullTime(currentDate.getSeconds());
}

function getFullTime(inputTime)
{
    if(inputTime<10)
    {
        return "0"+inputTime;
    }else
    {
        return inputTime;
    }
}

function convertToHtml(contentStr)
{
    return contentStr.replace(/\n/g, '<br/>');
}

//16. 启动事件流程
var flowMod = "";
function startFlow(state)
{
    var isService="1";
    if(flowMod==null || flowMod=="")
    {
        xmlhttp.open("POST",httpUrl+"tag=22",false);
        xmlhttp.send();
        if(isSuccess(xmlhttp))
        {
            var dXML = new ActiveXObject("Microsoft.XMLDOM");
            dXML.load(xmlhttp.responseXML);
            //alert(dXML.xml);
            flowMod = dXML.selectSingleNode("/root/FLOW_MOD").text;
        }
    }
   xmlhttp.open("POST",httpUrl+"tag=32",false);
   xmlhttp.send();
   if(isSuccess(xmlhttp))
   {
       var dXML = new ActiveXObject("Microsoft.XMLDOM");
       dXML.load(xmlhttp.responseXML);
       isService = dXML.selectSingleNode("/root/IS_SERVICE_DUTY_USER").text;
   }
    openNormalWindow('../../workshop/form/index.html?flowMod='+flowMod+"&fullscreen=yes&callback=opener.refreshEventContext()&isduty="+isService+"&newflow="+state+""+"&eventSource=2");
}



//17. 历史消息箱
function showMsgBox()
{
	openNormalWindow("../../MoreMessagePage.html");
}

//18. 发送文本信息
function sendTextMessage(sendXML)
{
	var params = new Array();
	xmlhttp.Open("POST",httpUrl+"tag=9",false);
	xmlhttp.send(sendXML);
	if(isSuccess(xmlhttp))
	{
	    var dXML = xmlhttp.responseXML;
        // 判断是否为两级消息， 消息的有效期限
        params.push(dXML.selectSingleNode("/root/MESSAGE_ID").text);
        params.push(dXML.selectSingleNode("/root/VALIDITY_DATE").text);
        params.push(dXML.selectSingleNode("/root/IS_TUNNEL_MESSAGE").text);
	    return params;
	}
}
// 19. 发送消息和附件
function sendMessageWidthAttachment(sendXML)
{
    return window.showModalDialog("service_message_attachments.htm", sendXML,"dialogWidth=540px;dialogHeight=320px;help=0;status=0;");
}


/**
 * 20. 功能：元素的可用性
 *
 *      (1). 如果是发送两级消息，则只允许第一次发送附件，回复则只允许是普通文本。
 *      (2). 如果非发送者，且消息不允许回复，则不允许回复。
 *      (3). 如果是发送者，或消息允许回复，  则允许回复。
 */
function checkElement()// 如果属于两级消息，则只允许第一次发送附件。
{
    if(currentObjId!=null && currentObjId.length>0)
    {
        historyMessage.style.display = "";
        
        if(isTunnelMessage)// (1). 两级消息
        {
            sendAttachmentTag.disabled = true;
            sendImageTag.disabled = true;
        }
        else if(isSender!=1 
                && currentType!=TYPE_OF_TALK_TO_MESSAGE 
                && currentType!=TYPE_OF_TALK_TO_EVENT 
                && currentType!=TYPE_OF_TALK_TO_USER)// (2). 非发送者，且消息不允许回复
        {
            sendAttachmentTag.disabled = true;
            sendImageTag.disabled = true;
            sendEmotionTag.disabled = true;
            sendMessageButton.disabled = true;
            messageContent.disabled = true;
        }else
        {
            sendAttachmentTag.disabled = false;
            sendImageTag.disabled = false;
        }
    }else
    {
        sendAttachmentTag.disabled = true;
        sendImageTag.disabled = true;
        isSender = 1;
    }
}
/**
 * 服务台页面定时弹出提示新单数量的窗口
 * 包括前端人员和值班人员页面
 */
function showEventCountMsg(times) {
	showMsg(140, 250);
	window.setTimeout("showEventCountMsg(" + times+")",times);
}

/**
 * 提示新单数量窗口
 */
function showMsg(h,w) {
	var top = screen.availHeight - h - 33;
	var left = screen.availWidth - w - 10;
	window.open("../../workshop/serviceDesk/eventMsg.jsp","","directories=no,location=no,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no,height=" + h +",width=" + w + ",top=" + top + ",left=" + left);
}

/**
 * 确认人处理，环节竣工
 */
function execTache(flowId){
    if(document.getElementById('eventState_'+flowId).innerHTML == '已完成'){
       alert('该事件已完成，不能重复进行确认！');
       return;
    }
    //环节竣工
    var url = httpUrl+"tag=55&flowId="+flowId;
    var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlHttp.open("POST",url,false);
    xmlHttp.send();
    if(isSuccess(xmlHttp)){
	    document.getElementById('eventState_'+flowId).innerHTML = '已完成';
	    
	    //获得处理环节的处理意见
	    url = httpUrl+"tag=54&flowId="+flowId;
	    xmlHttp.open("POST",url,false);
	    xmlHttp.send();
	    var dXML = xmlHttp.responseXML;
	    document.getElementById('dealOption_'+flowId).innerHTML = dXML.selectSingleNode("/root/RESULT_DESC").text;
	    reloadEventState(350, 0);
    }   
}