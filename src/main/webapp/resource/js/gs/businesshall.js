function initData() {
	addMsg();
	setInterval('addMsg()',$getSysVar('REFRESH_TIME'));
	
	openWinLeft = (screen.width - openWinWidth)/2;
	openWinTop = (screen.height - openWinHeight)/2;
	openWinParames = 'height='+openWinHeight
				   + ',width='+openWinWidth
				   + ',top='+openWinTop
				   + ',left='+openWinLeft;
	//工单汇总
	//isServiceDeskNx();			   
	//recycleEventState(350, 0, IS_SERVICE_DESK_NX);
	
	window.setTimeout("document.getElementById('boardInfo').src = 'workshop/board/boardScroll.htm'",10);
	window.setTimeout("document.getElementById('msgIfr').src = 'MessagePage.html'",10);
	
}

function isServiceDeskNx(){
	var sys_var_value;
    sys_var_value = $getSysVar('IS_SERVICE_DESK_NX');
    IS_SERVICE_DESK_NX = sys_var_value;
}

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

function displayMaxWindow_(url, name, isCheckPrivilege)
{
    displayMaxWindowWithHandle(url, name, isCheckPrivilege);
}

function displayMaxWindowWithHandle(url, name, isCheckPrivilege)
{
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
//登录数据稽核系统
function loginAuditSystem(){
	var sendParams = ['username='+userName,'key='+ encodeKey];
	displayMaxWindowWithHandle(getSendUrl($getSysVar("AUDIT_SYSTEM_URL")+'?',sendParams));
}