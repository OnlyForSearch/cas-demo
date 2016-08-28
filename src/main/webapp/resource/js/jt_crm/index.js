var tabPanel;
function initData() {
	addMsg();
	setInterval('addMsg()',$getSysVar('REFRESH_TIME'));
	
	addTopMenu(-1,oMenuBar,10);
	openWinLeft = (screen.width - openWinWidth)/2;
	openWinTop = (screen.height - openWinHeight)/2;
	openWinParames = 'height='+openWinHeight
				   + ',width='+openWinWidth
				   + ',top='+openWinTop
				   + ',left='+openWinLeft;
				   
	window.setTimeout("document.getElementById('boardInfo').src = 'workshop/board/boardScroll_CRM.htm'",10);
	window.setTimeout("document.getElementById('eventPageIfr').src = 'CrmEventPage'",10);
	loadCommonFile();
	setLink();
	getAlarmList();
	//-- 使用业务部门首页的待办框 right.js --//
	Global.oPendingEllipsisLength = 94;
	Global.oDefaultEllipsisLength = 66;
	loadPending();
	window.setInterval(loadPending, 60000);
	//-- 使用业务部门首页的待办框 right.js --//
	
	loadBillInfos();
	Ext.onReady(loadIndexView);
}
function ClickAction()
{
	this.parent = new XMLTree_onClick_Action;
	this.parent.click = function(oItem)
	{
		var toPid = oItem.getAttribute("PRIVILEGE_ID");
		var tab = tabPanel.getActiveTab();
		var forPid = tab.privilegeId;
		var sortId = tab.sortId;
		var url = "/servlet/menu?action=3&id=-1&sortId="+sortId + "&forPid=" + forPid + "&toPid=" + toPid;
		if(!oItem.getAttribute("SERVER_URL_NAME")) 
		{
			return false;
		}
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.Open("POST",url,false);
		xmlhttp.send();
		if (isSuccess(xmlhttp))
		{		
			tab.setTitle(oItem.getAttribute("PRIVILEGE_NAME"));
			tab.defaultSrc = oItem.getAttribute("SERVER_URL_NAME");
			tab.setSrc();
			hideKpiTree();
		}
	}
	return this.parent;
}
function showKpiTree()
{
	var oElement = document.getElementById("index_view");
	var oTreeBox = document.getElementById("kpiTreeBox"); 
	oTreeBox.style.display = "";
    oTreeBox.style.left = getPos(oElement, "Left") + oElement.offsetWidth - oTreeBox.offsetWidth - 2;
    oTreeBox.style.top = getPos(oElement,"Top") + 20;
    
    menuTree = new XMLTree();
	var clickAction = new ClickAction();
	menuTree.xmlUrl ="/servlet/menu?action=1&id=70";
	menuTree.setClickAction(clickAction);
	menuTree.showAt(index_view_kpi_tree);
}
function hideKpiTree(){
	document.getElementById("kpiTreeBox").style.display = "none";
}
function loadIndexView(){
	tabPanel = new Ext.TabPanel({
		id : "crmtabpanel",
		renderTo : "index_view",
		height : document.getElementById("index_view").clientHeight-20,//,+660
		width  : document.getElementById("index_view").offsetWidth,//add+90
		border : false,
		style : "border:1px solid #dbdbdb;",
		deferredRender: false,
	    layoutOnTabChange:true,
		defaultType: 'iframepanel',
	    defaults:{
	              closable: false,
	              loadMask: {msg: '页面载入中...'},
	              bodyStyle: {width:document.getElementById("index_view").offsetWidth, height:'90%'},
	              autoShow: true,
	              style: {position:'absolute'},
	              hideMode:'visibility'         
	            },		
		tools : [{
					id:'gear',
					handler : function(){						
						showKpiTree();
					}
			}],
		items : [],
		listeners: {
	            'tabchange': function(tabPanel, tab){
	                 if(tab.defaultSrc=='about:blank') {
	                     tab.defaultSrc = tab.replaceSrc;
	                     tab.setSrc();
	                 }
	             },
	             'beforetabchange' : function(TabPanel , newTab, tab ) {
			         if(!tab) return;
			         if (tab.defaultSrc != 'about:blank' && tab.getFrameWindow().Global&& tab.getFrameWindow().Global.mainPanel) {			             
			          	Ext.each(tab.getFrameWindow().Global.mainPanel.find('chartPanel','chartPanel'),function(chart){
							var o = chart.get(0).cloneConfig({});
							chart.remove(chart.get(0),true);
							chart.add(o);
							chart.doLayout();
						},this);
					}
	         	}
	         }
	});
	var url = "/servlet/menu?action=2&id=-1";
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
	if (isSuccess(xmlhttp))
	{	
		var oRow = xmlhttp.responseXML.selectNodes("/root/rowSet");
		for(var i=0;i<oRow.length;i++){
			var cRows = oRow[i].childNodes;
			tabPanel.add({
				scripts:true,
				id:i+"crmtab",
				title:cRows[0].text,
				autoScroll:true,border : true,
				defaultSrc :'about:blank',
				sortId : cRows[2].text,
				replaceSrc : cRows[1].text,
				privilegeId : cRows[3].text
			});
			
		}
		if(oRow.length>0){
			tabPanel.setActiveTab(0);
		}
	}
}

function loadCommonFile(){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("POST", "../../servlet/codeListCtrl.do?method=getCodeList&type=JT_CLASSIFY_SUM",false);
	xmlhttp.send();
	if (isSuccess(xmlhttp))
	{		
		var oRow = xmlhttp.responseXML.selectNodes("/root/rowSet");		
		var commonFileInnerHtml = "";	
		var showLine=0;
		
		for(var i=0;i<oRow.length;i++){
			var cff = eval( "(" +(oRow[i].selectSingleNode("MEAN").text) + ")");
				
			var xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp2.open("POST", "../../../servlet/codeListCtrl.do?method=getCodeList&type="+cff.code, false);
			xmlhttp2.send();
			if (isSuccess(xmlhttp2))
			{
				var oRow2 = xmlhttp2.responseXML.selectNodes("/root/rowSet");				
				for(var j=0;j<oRow2.length;j++){
					var cf = eval( "(" +(oRow2[j].selectSingleNode("MEAN").text) + ")");
					commonFileInnerHtml += "<li><a href=\"/" + cf.href + "\">" + cf.text
					commonFileInnerHtml += "</a></li>";
					showLine++;
					if(showLine>=3){
						break;
					}
				}
			}
			if(showLine>=3){
				break;
			}
		}
		commonFileInnerHtml = "<ul>" + commonFileInnerHtml + "</ul>";
		document.getElementById("commonFile").innerHTML = commonFileInnerHtml;
		
	}
}
/* 注释于 2011-06-16 注释原因：使用业务部门首页的待办框
function loadPending() {
	var pendingBox = document.getElementById("pending");
	var oPendingList = ResultFactory.newResult("BUSINESS_PERSON_PENDING");
	
	clearPendingBox(pendingBox);
	if (!oPendingList) {
		return;
	}
	
	oPendingList.onLoad = function(oXml) {
		var pendingLI;
		var resultRows = oXml.selectNodes("/root/rowSet");
		
		for(var i = 0; i < resultRows.length; i++) {
			pendingLI = document.createElement("li");
			pendingLI.innerHTML = '<a href="#" onclick="openPending(this);" ' 
									+ 'PENDING_ID="' + resultRows[i].childNodes[5].text + '" ' 
									+ 'TASK_OR_EVENT="' + resultRows[i].childNodes[8].text + '" ' 
									+ 'PENDING_TYPE="' + resultRows[i].childNodes[7].text + '" ' 
									+ 'CONTENT_ID="' + resultRows[i].childNodes[6].text + '" ' 
									+ 'ISBINDFORM="' + resultRows[i].childNodes[9].text + '" ' 
									+ 'SEND_URL="' + resultRows[i].childNodes[10].text + '" '
									+ 'THETYPE="' + resultRows[i].childNodes[11].text + '" ' 
									+ 'title="' + resultRows[i].childNodes[3].text + '" >'
									+ ellipsisOverText(resultRows[i].childNodes[3].text, 72, true) + '</a>';
			pendingBox.appendChild(pendingLI);
		}
	}
	
	var oPendingParam = {P_ROWNUM:12};
	oPendingList.send(Result.FORCE_GET, oPendingParam);
}
*/

function openPending(aPending) {
		if(!aPending || typeof(aPending)=='undefined'){
			return;
		}
	   	var selectedRows = aPending.PENDING_ID;
	   	var type = aPending.TASK_OR_EVENT;
	   	var event_type_id = aPending.PENDING_TYPE; //取得表单类型
	   	var content_id = aPending.CONTENT_ID;//取得流程或者环节标识
	   	var isBindForm = aPending.ISBINDFORM;//取得是否有绑定表单
	   	var send_url = aPending.SEND_URL; //取得待办打开的链接
	   	if(send_url.indexOf('/')!=0){
	   		send_url = '/'+send_url;
	   	}
	   	var curr_window;
	  	x=(window.screen.width-780)/2;
	  	y=(window.screen.height-560)/2;
	  	var thetype = aPending.THETYPE;
	  	if(thetype==01||thetype==03){
	  		//curr_window=window.open('/WorkAccept?type='+type+'&id='+selectedRows,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		//待办修改为点击直接打开表单界面，已启动也不先打开流转过程图 jiangmt 20100517
	  		if(event_type_id=="3"){//已启动
	  			if(isBindForm=="0")//无表单流程
	  				curr_window=window.open('/FlowBrowse?flow_id=' +content_id+'&system_code=G',content_id,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  			else
	  				curr_window=window.open(send_url,content_id,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}else if (event_type_id=="2"){//待办
	  			if(isBindForm=="0")//无表单流程
	  				curr_window=window.open('/TacheExec?tch_id=' +content_id+'&system_code=G',content_id,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  			else
	  				curr_window=window.open(send_url,content_id,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}
	  		else{
	  			curr_window=window.open(send_url,content_id,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}
	  	}else{
	  		//curr_window=window.open('/OtherWorkAccept?type='+type+'&id='+selectedRows,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		  	if(event_type_id=="0" || event_type_id=="1" || event_type_id=="2"
		  		|| event_type_id=="3" || event_type_id=="g" || event_type_id=="H"){//这几个类型有走 流程在待办的已处理事务里直接打开流程图
	  			curr_window=window.open('/FlowBrowse?flow_id=' +content_id+'&system_code=G',content_id,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}
	  		else{
	  			curr_window=window.open('/OtherWorkAccept?type='+type+'&id='+selectedRows,content_id,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}
	  	}
	  	curr_window.focus();
}

function clearPendingBox(ulObj) {
	if (ulObj) {
		for (var j = ulObj.childNodes.length - 1; j>=0; j--) {
			ulObj.removeChild(ulObj.childNodes[j]);
		}	
	}
}

function showBillInfoWindow(tag, billInfoId)
{
    var openWin = displayMaxWindowWithHandle("/workshop/info/billInfoContent.htm?billInfoId="+billInfoId,"", true);
    openWin.attachEvent('onunload', function(){loadBillInfos();});
}

function displayMaxWindow(url, name, isCheckPrivilege)
{
    displayMaxWindowWithHandle(url, name, isCheckPrivilege);
}

function displayMaxWindowWithHandle(url, name, isCheckPrivilege)
{
    //if(isCheckPrivilege && !checkPrivilege()) return;
    
    var width = screen.availWidth-10;
    var height = screen.availHeight-30;
    var top = 0;
    var left = 0;
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
    return window.open(url, name, sFeatures.join(","));
}

function openNormalWindow(url, name, isCheckPrivilege) {
    //if(isCheckPrivilege && !checkPrivilege()) return;
    
    var sFeatures = new Array();
    sFeatures.push("width="+780);
    sFeatures.push("height="+580);
    sFeatures.push("location="+0);
    sFeatures.push("menubar="+0);
    sFeatures.push("resizable="+1);
    sFeatures.push("scrollbars="+1);
    sFeatures.push("status="+0);
    sFeatures.push("titlebar="+0);
    sFeatures.push("toolbar="+0);
    window.open(url, name, sFeatures.join(","));
}

function searchEntrance() {
    queryString.value = queryString.value.trimall();
    var queryInput = queryString.value;
    if(queryInput.length==0)
    {
		MMsg("对不起，请输入搜索条件!");return;
    }
    var queryStr = encodeURIComponent(queryString.value);
    var indexDir = "publish_index_directory";
    openNormalWindow("/workshop/searchEngine/search_entrance_result.htm?queryString="+queryStr+"&indexDirectory="+indexDir+"&module=knowledge&category=", "");
}

function more_msg() {
	window.open("/MoreMessagePage.html",'MoreMsgWin',openWinParames);
}

function editStaff() {
	window.showModalDialog("/workshop/user/individualInfo.jsp?tag=1",null,"dialogWidth=500px;dialogHeight=566px;help=0;scroll=0;status=0;");
}

function addMsg()
{
	unDoXmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	unDoXmlhttp.open("post","servlet/UnReadAction?action=0",true);
	unDoXmlhttp.onreadystatechange = addMsgDetails;
	unDoXmlhttp.send();
}
var count = 0;
function addMsgDetails()
{
	if(unDoXmlhttp!=null && unDoXmlhttp.readyState==4)
	{
		if(count == 0){
			msgWin = new MsgWin();
			if(msgWinHeight!=null && msgWinHeight!="")
				msgWin.height=msgWinHeight;
			if(msgWinWidth!=null && msgWinWidth!="")
				msgWin.width=msgWinWidth;
		}
		var isShow = true;
		var outHTML = '<div style="width:100%;height:100%;padding:10px 10px 0px 10px">';
		var oErrCodeNode = unDoXmlhttp.responseXML.selectSingleNode("/root/error_code");
		if(oErrCodeNode.text == 0)
		{
			outHTML +=  '<div>'
					+	  '<span style="font-weight:bold">尊敬的' + name + '同仁，您目前有:</span>'
					+   '</div>';
					var uodoNodeList = unDoXmlhttp.responseXML.selectNodes("/root/UNDO_COUNT");
					var uodoNodeListLength=uodoNodeList.length;
					if(uodoNodeListLength == 0)
					{
						isShow = false;
					}
					else
					{
						for(var i=0;i<uodoNodeListLength;i++)	
						{
							outHTML +=   '<div style="margin:8px 0px 0px 6px">'
									+	  '<a href="'+uodoNodeList[i].getAttribute("link")+'"  target="_blank"><span style="color:red;font-weight:bold">'+uodoNodeList[i].text+'</span>'
									+	  '<span style="color:#1F336B;margin-left:3px;">'+uodoNodeList[i].getAttribute("name")+';</span></a>'
									+	'</div>';
						}
						if(count == 0){
							if(uodoNodeListLength-3>0)
							{
								msgWin.height+=(uodoNodeListLength-3)*25;
								msgWin.contentHeight+=(uodoNodeListLength-3)*25;
							}
						}
					}
		}
		else
		{
			outHTML = oErrCodeNode.nextSibling.text;
		}
		outHTML += '</div>'
		unDoXmlhttp = null;
		if(isShow)
		{
			if(count ==0)
				msgWin.show(outHTML,msgWinPosition);
			else{
				if(document.getElementById('UNDO_WIN_STATE').getAttribute('class')!=0)
					document.getElementById('refresh').innerHTML = outHTML;
			}
			count++;
		}
	}
}

function setLink()
{
	var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
	var mainPageUrl = 'servlet/MainPageAction?';
	var reqParams = new Array('action=0');
	xmlRequest.Open("POST",mainPageUrl+reqParams.join('&'),false);
	xmlRequest.send();
	if(isSuccess(xmlRequest))
	{
		var linkUL;
		var linkLI;
		var linkImg;
		var linkVal;
		var linkTitle;
		var workLinks = xmlRequest.responseXML.selectNodes("/root/rowSet[LINK_TYPE='A'||LINK_TYPE='B']");
		for(var i=0;i<workLinks.length;i++)
		{
			linkImg = getNodeValue(workLinks[i],'LINK_IMG');
			linkVal = getNodeValue(workLinks[i],'LINK_VALUE');
			linkTitle = getNodeValue(workLinks[i],'LINK_TITLE')
			linkTitle = linkImg!=null&&linkImg!='undefined'&&linkImg!=''?"<img src='" + linkImg + "' alt='" + linkTitle + "' border='0'>":linkTitle; 
			
			linkUL = document.getElementById("links");
			linkLI = document.createElement("li");
			linkLI.innerHTML = '<a href="' + linkVal + '">' + linkTitle + '</a>';
			linkUL.appendChild(linkLI);
		}
		
	}
}

function loadBillInfos(categoryId) {//isLoadCategory,
    billXmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    var actionUrl = "/servlet/billInfoServlet?tag=1&recent=8";//isLoadCategory = eval(isLoadCategory);
    if(categoryId!=null) {actionUrl += "&categoryId="+categoryId;}
	billXmlhttp.open("POST", actionUrl,true);
	billXmlhttp.onreadystatechange = loadBillInfoDetails;
    billXmlhttp.send("");
}

function loadBillInfoDetails() {
	if(billXmlhttp!=null && billXmlhttp.readyState==4 && isSuccess(billXmlhttp)) {
		var dXML = billXmlhttp.responseXML;
		var oRows = dXML.selectNodes("/root/BILL_INFOS/rowSet");
		var ul,li,billInfosId,billInfosTitle,submitDate;
		ul = document.getElementById("billInfosUL");

		clearUL(ul);
		for (var i=0; i<oRows.length; i++) {
			billInfosId = oRows[i].selectSingleNode("BILL_INFO_ID").text;
			billInfosTitle = oRows[i].selectSingleNode("TITLE").text;
			submitDate = oRows[i].selectSingleNode("SUBMIT_DATE").text;
			li = document.createElement("li"); 
			li.innerHTML = "<a href='javascript:showBillInfoWindow(3,&#039;" 
								+ billInfosId + "&#039;);' title='" + billInfosTitle + "'>" 
								+ "<div class='it_news_box_con_left'>" + ellipsisOverText(billInfosTitle, 70, true) + "</div>"
								+ "<div class='it_news_box_con_right'>" + submitDate +"</div>"
								+ "</a>";
			ul.appendChild(li);
		}
    }	
}

function clearUL(ulObj) {
	if (ulObj) {
		for (var j = ulObj.childNodes.length - 1; j>=0; j--) {
			ulObj.removeChild(ulObj.childNodes[j]);
		}	
	}
}

//截取字符串 包含中文处理 
//(串,长度,增加...) 
function ellipsisOverText(str, len, hasDot) { 
    var newLength = 0; 
    var newStr = ""; 
    var chineseRegex = /[^\x00-\xff]/g; 
    var singleChar = ""; 
    var strLength = str.replace(chineseRegex,"**").length;
    if (str == "") {
    	return "&nbsp;";
    }
    for(var i = 0;i < strLength;i++) { 
        singleChar = str.charAt(i).toString(); 
        if(singleChar.match(chineseRegex) != null) { 
            newLength += 2; 
        }     
        else { 
            newLength++; 
        } 
        if(newLength > len) { 
            break; 
        } 
        newStr += singleChar; 
    } 
     
    if(hasDot && strLength > len) { 
        newStr += "..."; 
    } 
    return newStr; 
}
function chagePswd()
{
	window.showModalDialog("workshop/user/changePw.html",window,"dialogWidth=408px;dialogHeight=222px;help=0;scroll=0;status=0;");
}

var flag = '';
function getAlarmList(alarmClass)
{
	if(flag!=''){
		clearTimeout(flag);
	}
    var limitCount=6;
    var iRefreshTime=30*1000;
    var url = "servlet/alarmMergeServlet?tag=29&limitCount="+limitCount;
    if(alarmClass!=null&&alarmClass!=''&&alarmClass!=undefined){
    	url+="&alarmClass="+alarmClass;
    }
    oAlarmXMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
    oAlarmXMLHttp.onreadystatechange=doAlarmStateReady;
	oAlarmXMLHttp.open("POST", url,true);
	oAlarmXMLHttp.send();
	flag = window.setTimeout("getAlarmList("+alarmClass+")",iRefreshTime);
	//popCategory.style.display = 'none';
}

function doAlarmStateReady()
{
	var state = oAlarmXMLHttp.readyState;	
	if(oAlarmXMLHttp!=null &&state==4)
	{
		if(isSuccess(oAlarmXMLHttp))
		{
			var oXMLDoc=oAlarmXMLHttp.responseXML;
			showAlarmList(oXMLDoc);
		}
		oAlarmXMLHttp=null;
    }
}
function showAlarmList(oXMLDoc)
{
   var oRowSets=oXMLDoc.selectNodes("/root/rowSet");
   var iLen=oRowSets.length;
   var aHTML=new Array();
   aHTML[0]=' <table width="100%" border="0" cellpadding="0" cellspacing="0">'
   for(var i=0;i<iLen-3;i++)
   {   
       var oRowSet=oRowSets[i];
       var iAlarmId=oRowSet.selectSingleNode("NE_ALARM_LIST_ID").text;
       var sAlarmTitle=oRowSet.selectSingleNode("ALARM_TITLE").text;
       var iAlarmLevel=oRowSet.selectSingleNode("ALARM_LEVEL").text;
       var sCreatTime=oRowSet.selectSingleNode("CREATE_TIME").text;
       aHTML[i+1]='<tr class="alarmOut" onmouseover="this.className=\'alarmOver\'" onmouseout="this.className=\'alarmOut\'">'
                 + '<td align="right" width="7">'
                 +  '<img src="resource/image/indexAh/index/lable.gif" width="6" height="12" />'
                 +  '</td>'
                 + '<td align="left" width="10px">&nbsp;</td>'
                 +   '<td noWrap align="left" height="25" >'
                 +   '<div class="alarmDiv" onclick="showAlarmById('+iAlarmId
                 +   ')">'
                 +   sAlarmTitle+'</div>'
                 +   '<img style="float:right" src="resource/image/s_'+getAlarmColor(iAlarmLevel)+'.gif" />'
                 +   '</td>'
                 //+  '<td noWrap align="right" class="td_hidden">'+sCreatTime+'</td>'
                 +'</tr>';
   }
   aHTML[i+1]="</table>";
   oAlarmList.innerHTML=aHTML.join("");
}       							       
function getAlarmColor(sAlarmType)
{
   var str;
   switch (sAlarmType)
   {
       case "1" :
           str="red";
           break;
       case "2" :
           str='orange';
           break;
       case "3" :
           str='yellow';
           break;
       case "4" :
           str='green';
           break;
       default:
           str='green';
   } 
   return str;
}
function showAlarmById(iAlarmId)
{
    //判断是否稽核系统产生的告警
	var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
    var row = null;
	sendRequest.open("post", "servlet/alarmMergeServlet?tag=46&alarmId="+iAlarmId, false);
	sendRequest.send();
	if (isSuccess(sendRequest)){
		row = sendRequest.responseXML.selectSingleNode("/root/rowSet");
	}
	if(row){
		var sendParams = ['username='+userName,'key='+ encodeKey];
		sendParams.push("dasys_sn="+row.selectSingleNode('DASYS_SN').text);
		sendParams.push("daitem_sn="+row.selectSingleNode('DAITEM_SN').text);
		sendParams.push("dadiff_sn="+row.selectSingleNode('DADIFF_SN').text);
		sendParams.push("node_id="+row.selectSingleNode('NODE_ID').text);
		sendParams.push("data_batch="+row.selectSingleNode('DATA_BATCH').text);
		displayMaxWindowWithHandle(getSendUrl($getSysVar("AUDIT_ALARM_INFO_URL")+'?',sendParams));		
	}else {
		displayMaxWindow('workshop/alarmManage/viewAlarmInfo.htm?alarmId='+iAlarmId,iAlarmId,false);
	}
}
//登录数据稽核系统
function loginAuditSystem(){
	var sendParams = ['username='+userName,'key='+ encodeKey];
	displayMaxWindowWithHandle(getSendUrl($getSysVar("AUDIT_SYSTEM_URL")+'?',sendParams));
}
