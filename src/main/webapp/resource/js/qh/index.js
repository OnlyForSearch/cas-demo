Global = {
    oShowPendingRowNum:12,
    oPendingEllipsisLength:98,
    oDefaultEllipsisLength:72,
    oIndexOperateBtn:['pending','pended','reading','readed','draft','tail'],
    oPendingBox:null,
    oBillXmlhttp:null,
    oPendingList:null,
    oPendingParam:null,
    oPendedList:null,
    oPendedParam:null,
    oReadingDate:4,
    oReadingTitle:2,
    oReadingMessageID:0,
    oReadingMessageType:1,
    oReadingMessageTag:5,
    oReadingIsSelf:8,
    oReadingList:null,
    oReadingParam:null, 
    oReadedDate:4,
    oReadedTitle:2, 
    oReadedMessageID:0,
    oReadedMessageType:1,
    oReadedMessageTag:5,
    oReadedIsSelf:8,
    oReadedList:null,
    oReadedParam:null,  
    oDraftDate:6,
    oDraftTitle:3,
    oDraftFlowId:0,
    oDraftFlowMod:1,    
    oDraftList:null,
    oDraftParam:null,
    oTailList:null,
    oTailParam:null
}

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
	window.setTimeout("document.getElementById('boardInfo').src = 'workshop/board/boardScroll.htm'", 10);
	setLink();
	Global.oPendingEllipsisLength = 94;
	Global.oDefaultEllipsisLength = 66;
    //加载待办
    loadPending();
    window.setInterval(loadPending, 60000);
    //加载计费动态信息
    loadBillInfosBusiness();
    //加载常用资料
    loadCommonFile();
}

function loadPending() {
    Global.oPendingBox = document.getElementById("pendingUL");
    Global.oPendingList = ResultFactory.newResult("BUSINESS_PERSON_PENDING");
    clearUL(Global.oPendingBox);
    if (!Global.oPendingList) {
        return;
    }
    Global.oPendingList.onLoad = function(oXml) {
        var aPendingLI;
        var resultRows = oXml.selectNodes("/root/rowSet");
        for(var i = 0; i < resultRows.length; i++) {
            aPendingLI = document.createElement("li");
            aPendingLI.innerHTML = '<a href="#" onclick="openPending(this);" ' 
                                    + 'PENDING_ID="' + resultRows[i].childNodes[5].text + '" ' 
                                    + 'TASK_OR_EVENT="' + resultRows[i].childNodes[8].text + '" ' 
                                    + 'PENDING_TYPE="' + resultRows[i].childNodes[7].text + '" ' 
                                    + 'CONTENT_ID="' + resultRows[i].childNodes[6].text + '" ' 
                                    + 'ISBINDFORM="' + resultRows[i].childNodes[9].text + '" ' 
                                    + 'SEND_URL="' + resultRows[i].childNodes[10].text + '" '
                                    + 'THETYPE="' + resultRows[i].childNodes[11].text + '" ' 
                                    + 'title="' + resultRows[i].childNodes[3].text + '" >'
                                    + '<div class="pending_box_con_right_title_no_date"><NOBR>' 
                                        + resultRows[i].childNodes[3].text + '</NOBR></div>'
                                    + '</a>';
            Global.oPendingBox.appendChild(aPendingLI);
        }
        activeBtn('pending');
    }
    Global.oPendingParam = {P_ROWNUM:Global.oShowPendingRowNum};
    Global.oPendingList.send(Result.FORCE_GET, Global.oPendingParam);
}

function loadPended() {
    Global.oPendingBox = document.getElementById("pendingUL");
    Global.oPendedList = ResultFactory.newResult("BUSINESS_PERSON_PENDED");
    clearUL(Global.oPendingBox);
    if (!Global.oPendedList) {
        return;
    }
    Global.oPendedList.onLoad = function(oXml) {
        var aPendedLI;
        var resultRows = oXml.selectNodes("/root/rowSet");
        for(var i = 0; i < resultRows.length; i++) {
            aPendedLI = document.createElement("li");
            aPendedLI.innerHTML = '<a href="#" onclick="openPending(this);" ' 
                                    + 'PENDING_ID="' + resultRows[i].childNodes[5].text + '" ' 
                                    + 'TASK_OR_EVENT="' + resultRows[i].childNodes[8].text + '" ' 
                                    + 'PENDING_TYPE="' + resultRows[i].childNodes[7].text + '" ' 
                                    + 'CONTENT_ID="' + resultRows[i].childNodes[6].text + '" ' 
                                    + 'ISBINDFORM="' + resultRows[i].childNodes[9].text + '" ' 
                                    + 'SEND_URL="' + resultRows[i].childNodes[10].text + '" '
                                    + 'THETYPE="' + resultRows[i].childNodes[11].text + '" ' 
                                    + 'title="' + resultRows[i].childNodes[3].text + '" >'
                                    + '<div class="pending_box_con_right_title"><NOBR>' 
                                        + resultRows[i].childNodes[3].text + '</NOBR></div>'
                                    + '<div class="pending_box_con_right_date">' 
                                        + resultRows[i].childNodes[4].text +'</div>'    
                                    + '</a>';
            Global.oPendingBox.appendChild(aPendedLI);
        }
        activeBtn('pended');
    }
    Global.oPendedParam = {P_ROWNUM:Global.oShowPendingRowNum};
    Global.oPendedList.send(Result.FORCE_GET, Global.oPendedParam);
}

function loadReading() {
    Global.oPendingBox = document.getElementById("pendingUL");
    Global.oReadingList = ResultFactory.newResult("BUSINESS_PERSON_READING");
    clearUL(Global.oPendingBox);
    if (!Global.oReadingList) {
        return;
    }   
    Global.oReadingList.onLoad = function(oXml) {
        var aReadingLI;
        var aReadingIsSelf;
        var aReadingMessageId;
        var aReadingMessageTag;
        var aReadingMessageType;        
        var resultRows = oXml.selectNodes("/root/rowSet");
        for(var i = 0; i < resultRows.length; i++) {
            aReadingIsSelf = resultRows[i].childNodes[Global.oReadingIsSelf].text;
            aReadingMessageId = resultRows[i].childNodes[Global.oReadingMessageID].text;
            aReadingMessageTag = resultRows[i].childNodes[Global.oReadingMessageTag].text;
            aReadingMessageType = resultRows[i].childNodes[Global.oReadingMessageType].text;
                    
            aReadingLI = document.createElement("li");
            aReadingLI.innerHTML = '<a href="/workshop/msg/showMsg.html?msg_id=' 
                + aReadingMessageId + '&msg_tag=' + aReadingMessageTag + '&msg_type=' 
                + aReadingMessageType + '&msg_isSelf=' + aReadingIsSelf + '" title="' 
                + resultRows[i].childNodes[Global.oReadingTitle].text + '" target=_blank>' 
                + '<div class="pending_box_con_right_title"><NOBR>' 
                    + resultRows[i].childNodes[Global.oReadingTitle].text + '</NOBR></div>'
                + '<div class="pending_box_con_right_date">' 
                    + resultRows[i].childNodes[Global.oReadingDate].text +'</div>'  
                + '</a>';
            Global.oPendingBox.appendChild(aReadingLI);
        }
        activeBtn('reading');
    }
    Global.oReadingParam = {P_ROWNUM:Global.oShowPendingRowNum};
    Global.oReadingList.send(Result.FORCE_GET, Global.oReadingParam);
}

function loadReaded() {
    Global.oPendingBox = document.getElementById("pendingUL");
    Global.oReadedList = ResultFactory.newResult("BUSINESS_PERSON_READED");
    clearUL(Global.oPendingBox);
    if (!Global.oReadedList) {
        return;
    }   
    Global.oReadedList.onLoad = function(oXml) {
        var aReadedLI;
        var aReadedIsSelf;
        var aReadedMessageId;
        var aReadedMessageTag;
        var aReadedMessageType;     
        var resultRows = oXml.selectNodes("/root/rowSet");
        for(var i = 0; i < resultRows.length; i++) {
            aReadedIsSelf = resultRows[i].childNodes[Global.oReadedIsSelf].text;
            aReadedMessageId = resultRows[i].childNodes[Global.oReadedMessageID].text;
            aReadedMessageTag = resultRows[i].childNodes[Global.oReadedMessageTag].text;
            aReadedMessageType = resultRows[i].childNodes[Global.oReadedMessageType].text;
            aReadedLI = document.createElement("li");
            aReadedLI.innerHTML = '<a href="/workshop/msg/showMsg.html?msg_id=' 
                + aReadedMessageId + '&msg_tag=' + aReadedMessageTag + '&msg_type=' 
                + aReadedMessageType + '&msg_isSelf=' + aReadedIsSelf + '" title="' 
                + resultRows[i].childNodes[Global.oReadedTitle].text + '" target=_blank>' 
                + '<div class="pending_box_con_right_title"><NOBR>' 
                    + resultRows[i].childNodes[Global.oReadedTitle].text + '</NOBR></div>'
                + '<div class="pending_box_con_right_date">' 
                    + resultRows[i].childNodes[Global.oReadedDate].text +'</div>'   
                + '</a>';
            Global.oPendingBox.appendChild(aReadedLI);
        }
        activeBtn('readed');
    }
    Global.oReadedParam = {P_ROWNUM:Global.oShowPendingRowNum};
    Global.oReadedList.send(Result.FORCE_GET, Global.oReadedParam);
}

function loadDraft() {
    Global.oPendingBox = document.getElementById("pendingUL");
    Global.oDraftList = ResultFactory.newResult("BUSINESS_PERSON_DRAFT");
    clearUL(Global.oPendingBox);
    if (!Global.oDraftList) {
        return;
    }
    Global.oDraftList.onLoad = function(oXml) {
        var aDraftLI;
        var aDraftFlowId;
        var aDraftFlowMod;
        var resultRows = oXml.selectNodes("/root/rowSet");
        for(var i = 0; i < resultRows.length; i++) {
            aDraftFlowId = resultRows[i].childNodes[Global.oDraftFlowId].text;
            aDraftFlowMod = resultRows[i].childNodes[Global.oDraftFlowMod].text;
            aDraftLI = document.createElement("li");
            aDraftLI.innerHTML = "<a href='/workshop/form/index.html?fullscreen=yes&flowId=" 
                + aDraftFlowId + "&flowMod=" + aDraftFlowMod + "' title='" 
                + resultRows[i].childNodes[Global.oDraftTitle].text + "' target=_blank>" 
                + '<div class="pending_box_con_right_title"><NOBR>' 
                    + resultRows[i].childNodes[Global.oDraftTitle].text + '</NOBR></div>'
                + '<div class="pending_box_con_right_date">' 
                    + resultRows[i].childNodes[Global.oDraftDate].text +'</div>'    
                + '</a>';
            Global.oPendingBox.appendChild(aDraftLI);
        }
        activeBtn('draft');
    }
    Global.oDraftParam = {P_ROWNUM:Global.oShowPendingRowNum};
    Global.oDraftList.send(Result.FORCE_GET, Global.oDraftParam);
}

function loadTail() {
    Global.oPendingBox = document.getElementById("pendingUL");
    Global.oTailList = ResultFactory.newResult("BUSINESS_PERSON_TAIL");
    clearUL(Global.oPendingBox);
    if (!Global.oTailList) {
        return;
    }
    Global.oTailList.onLoad = function(oXml) {
        var aPendingLI;
        var resultRows = oXml.selectNodes("/root/rowSet");
        for(var i = 0; i < resultRows.length; i++) {
            aPendingLI = document.createElement("li");
            aPendingLI.innerHTML = '<a href="#" onclick="openPending(this);" ' 
                                    + 'PENDING_ID="' + resultRows[i].childNodes[5].text + '" ' 
                                    + 'TASK_OR_EVENT="' + resultRows[i].childNodes[8].text + '" ' 
                                    + 'PENDING_TYPE="' + resultRows[i].childNodes[7].text + '" ' 
                                    + 'CONTENT_ID="' + resultRows[i].childNodes[6].text + '" ' 
                                    + 'ISBINDFORM="' + resultRows[i].childNodes[9].text + '" ' 
                                    + 'SEND_URL="' + resultRows[i].childNodes[10].text + '" '
                                    + 'THETYPE="' + resultRows[i].childNodes[11].text + '" ' 
                                    + 'title="' + resultRows[i].childNodes[3].text + '" >'
                                    + '<div class="pending_box_con_right_title_no_date"><NOBR>' 
                                        + resultRows[i].childNodes[3].text + '</NOBR></div>'
                                    + '</a>';
            Global.oPendingBox.appendChild(aPendingLI);
        }
        activeBtn('tail');
    }
    Global.oTailParam = {P_ROWNUM:Global.oShowPendingRowNum};
    Global.oTailList.send(Result.FORCE_GET, Global.oTailParam);
}

function activeBtn(btnName) {
    for (var i = 0; i < Global.oIndexOperateBtn.length; i++) {
        if (btnName == Global.oIndexOperateBtn[i]) {
            document.getElementById(Global.oIndexOperateBtn[i]).className = "pending_btn_active";
        } else {
            document.getElementById(Global.oIndexOperateBtn[i]).className = "pending_btn";
        }
    }
}

function loadBillInfosBusiness(categoryId) {//isLoadCategory,
    Global.oBillXmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    var actionUrl = "/servlet/billInfoServlet?tag=1&recent=6";//isLoadCategory = eval(isLoadCategory);
    if(categoryId!=null) {actionUrl += "&categoryId="+categoryId;}
    Global.oBillXmlhttp.open("POST", actionUrl,true);
    Global.oBillXmlhttp.onreadystatechange = loadBillInfoDetailsBusiness;
    Global.oBillXmlhttp.send("");
}

function loadBillInfoDetailsBusiness() {
    if(Global.oBillXmlhttp!=null && Global.oBillXmlhttp.readyState==4 && isSuccess(Global.oBillXmlhttp)) {
        var dXML = Global.oBillXmlhttp.responseXML;
        var oRows = dXML.selectNodes("/root/BILL_INFOS/rowSet");
        var ul,li,billInfosId,billInfosTitle;
        ul = document.getElementById("billInfosUL");
        
        clearUL(ul);
        for (var i=0; i<oRows.length; i++) {
            billInfosId = oRows[i].selectSingleNode("BILL_INFO_ID").text;
            billInfosTitle = oRows[i].selectSingleNode("TITLE").text;
            li = document.createElement("li"); 
            li.innerHTML = "<a href='javascript:showBillInfoWindowBusiness(3,&#039;" 
                                + billInfosId + "&#039;);' title='" + billInfosTitle + "'>" 
                                + ellipsisOverText(billInfosTitle, 40, true) + "</a>";
            ul.appendChild(li);
        }
    }   
}

function showBillInfoWindowBusiness(tag, billInfoId) {
    var openWin = displayMaxWindowWithHandle("/workshop/info/billInfoContent.htm?billInfoId="+billInfoId,"", true);
    openWin.attachEvent('onunload', function(){loadBillInfosBusiness();});
}

function loadCommonFile() {
    var commonFileData = queryAllData("select M.MOD_ID, M.MOD_, M.MOD_NAME, M.MOD_PATH, M.SAVE_NAME from ZJ_UPLOAD_MOD M where M.MOD_ID in (25,42,43,21,861,4)");   
    var ul,li;
    ul = document.getElementById("commonFileUL");
            
    if (commonFileData && commonFileData.length > 0) {
        for (var i = 0; i < commonFileData.length; i++) {
            li = document.createElement("li");
             li.innerHTML = '<a id="CM_' + commonFileData[i].MOD_ID + '" href="javascript:fileDownload(\'' 
                                + commonFileData[i].MOD_ +'\', \'' + commonFileData[i].MOD_PATH + '/' + commonFileData[i].SAVE_NAME + '\')">' + commonFileData[i].MOD_NAME + '</a>';    
             ul.appendChild(li);
        }   
    }       
}
    
function fileDownload(fileName, filePath) {
    window.open("/servlet/downloadservlet?action=1&filename="+encodeURIComponent(fileName)+"&fullPath="+encodeURIComponent(filePath));
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
					+	  '<span style="font-weight:bold">尊敬的' + name + '，您目前有:</span>'
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