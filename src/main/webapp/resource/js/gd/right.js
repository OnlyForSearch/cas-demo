Global = {
	oShowPendingRowNum:200,//12,
	oPendingEllipsisLength:98,
	oDefaultEllipsisLength:72,
	oIndexOperateBtn:['pending','pended','reading','readed','focus'],//,'tail'],
	
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
	
	oDraftDate:3,
	oDraftTitle:2,
	oDraftFlowId:0,
	oDraftFlowMod:1,	
	oDraftList:null,
	oDraftParam:null//,
}

/***
function loadPending(objUl,isActive) {
    var state = loadPendingPri(objUl);
	if(state==2){
		return;
	}
	//Global.oPendingBox = document.getElementById("pendingUL");
	Global.oPendingBox = objUl;
	Global.oPendingList = ResultFactory.newResult("CUST_GD_BUSINESS_PERSON_PENDING");
    
    if(objUl.id!='focusUL'&&state!='3'){
		clearUL(Global.oPendingBox);
	}

	if (!Global.oPendingList) {
		return;
	}
	
	Global.oPendingList.onLoad = function(oXml) {
		var aPendingLI;
		var resultRows = oXml.selectNodes("/root/rowSet");
		if(resultRows.length==0){
		    if(state!='3'){
				aPendingLI = document.createElement("span");
				aPendingLI.innerHTML = '<b>您当前无[待办]信息!</b>';
				Global.oPendingBox.appendChild(aPendingLI);
			}
			document.getElementById("pendingCount").innerHTML 
				= "<font style='font-size:11px;'>(0)</font>";
		}else{
			for(var i = 0; i < resultRows.length; i++) {
				aPendingLI = document.createElement("li");
				aPendingLI.innerHTML = '<a href="#" id="focus_Pendding" onclick="openPending(this);" '
				                        + ' onmousedown="rightAction(this)" ' 
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
										+ '<div class="pending_box_con_right_date"><NOBR>'+resultRows[i].childNodes[4].text+'</NOBR>'
										+ '</div>'
										+ '</a>';
				//Global.oPendingBox.appendChild(aPendingLI);
				//document.getElementById("pendingUL").appendChild(aPendingLI);
				objUl.appendChild(aPendingLI);
			}
			
			if(state==3&&objUl.id!='focusUL'){
			    //待办帅选为:flow,job
				document.getElementById("pendingCount").innerHTML 
					= "<font style='font-size:11px;color:red'>("+objUl.getElementsByTagName("li").length+")</font>";
			}else if(objUl.id!='focusUL'){
				document.getElementById("pendingCount").innerHTML 
					= "<font style='font-size:11px;color:red'>("+resultRows.length+")</font>";
			}
			
			if(objUl.id=='focusUL'){
				recodes = recodes + resultRows.length;
			}
		}
		if(objUl.id!='focusUL'){
			activeBtn('pending');
		}
		//changeContentTab(pendingUL);
		changeContentTab(objUl);
	}
	Global.oPendingParam = {P_ROWNUM:Global.oShowPendingRowNum};
	Global.oPendingList.send(Result.FORCE_GET, Global.oPendingParam);
}
***/


//待办筛选改造
function loadPending(objUl,isActive,eventType) {
	//Global.oPendingBox = document.getElementById("pendingUL");
	var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	clearUL(objUl);
	if(eventType==null||typeof(eventType)=='undefined'){
		xmlHttp.open("POST","../../../servlet/GdCommonRequest?tag=5&action=7",true);
	}else{
		xmlHttp.open("POST","../../../servlet/GdCommonRequest?tag=5&action=7&event_types="+eventType,true);
	}
	xmlHttp.onreadystatechange = function(){
		if(xmlHttp!==null && xmlHttp.readyState==4 && isSuccess(xmlHttp)){
			var oXml = xmlHttp.responseXML;
			var aPendingLI;
		var resultRows = oXml.selectNodes("/root/rowSet");
		if(resultRows.length==0){
			aPendingLI = document.createElement("span");
			aPendingLI.innerHTML = '<b>您当前无[待办]信息!</b>';
			objUl.appendChild(aPendingLI);
			document.getElementById("pendingCount").innerHTML 
				= "<font style='font-size:11px;'>(0)</font>";
		}else{
			for(var i = 0; i < resultRows.length; i++) {
				aPendingLI = document.createElement("li");
				aPendingLI.innerHTML = '<a href="#" id="focus_Pendding" onclick="openPending(this);" '
				                        + ' onmousedown="rightAction(this)" ' 
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
										+ '<div class="pending_box_con_right_date"><NOBR>'+resultRows[i].childNodes[4].text+'</NOBR>'
										+ '</div>'
										+ '</a>';
				objUl.appendChild(aPendingLI);
			}
			
			document.getElementById("pendingCount").innerHTML 
				= "<font style='font-size:11px;color:red'>("+resultRows.length+")</font>";
		}
		if(isActive){
			activeBtn('pending');
			changeContentTab(objUl);
		}
		
		}
	
	}
	xmlHttp.send();
}

function loadPended(objUl,isActive) {
	//Global.oPendingBox = document.getElementById("pendedUL");
	cleanSortPend();
	Global.oPendingBox = objUl;
	Global.oPendedList = ResultFactory.newResult("CUST_GD_BUSINESS_PERSON_PENDED");
	
	if(objUl.id!='focusUL'){
		clearUL(Global.oPendingBox);
	}
	//clearUL(Global.oPendingBox);
	if (!Global.oPendedList) {
		return;
	}
		
	Global.oPendedList.onLoad = function(oXml) {
		var aPendedLI;
		var resultRows = oXml.selectNodes("/root/rowSet");
		if(resultRows.length==0){
			aPendedLI = document.createElement("span");
			aPendedLI.innerHTML = '<b>您当前无[已办]信息!</b>';
			Global.oPendingBox.appendChild(aPendedLI);
			//document.getElementById("pendedCount").innerHTML 
				//= "<font style='font-size:11px'>(0)</font>";
		}else{
		    if(typeof(isActive)!='undefined'&&isActive){
				aPendingLI = document.createElement("span");
				aPendingLI.innerHTML = '<font color="red">只显示前'+Global.oShowPendingRowNum+'条已办理工单,查看更多工单,请点击[>更多].<font>';
				Global.oPendingBox.appendChild(aPendingLI);
			}
			for(var i = 0; i < resultRows.length; i++) {
				aPendedLI = document.createElement("li");
				aPendedLI.innerHTML = '<a href="#" id="focus_Pended" onclick="openPending(this);" ' 
										+ ' onmousedown="rightAction(this)" ' 
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
				//Global.oPendingBox.appendChild(aPendedLI);
				//document.getElementById("pendedUL").appendChild(aPendedLI);
				if(typeof(isActive)!='undefined'&&isActive){
					objUl.appendChild(aPendedLI);
				}
			}
			if(objUl.id=='focusUL'){
				recodes = recodes + resultRows.length;
			}
			
			//document.getElementById("pendedCount").innerHTML 
				//= "<font style='font-size:11px;color:red'>("+resultRows.length+")</font>";
		}
		if(objUl.id!='focusUL'){
		    if(typeof(isActive)!='undefined'&&isActive)
			   activeBtn('pended');
		}
		//changeContentTab(pendedUL);
		if(typeof(isActive)!='undefined'&&isActive){
			changeContentTab(objUl);
		}
	}
	Global.oPendedParam = {P_ROWNUM:Global.oShowPendingRowNum};
	Global.oPendedList.send(Result.FORCE_GET, Global.oPendedParam);
}

function loadReading(objUl,isActive) {
	//Global.oPendingBox = document.getElementById("readingUL");
	cleanSortPend();
	Global.oPendingBox = objUl;
	Global.oReadingList = ResultFactory.newResult("CUST_GD_BUSINESS_PERSON_READING");
	
	if(objUl.id!='focusUL'){
		clearUL(Global.oPendingBox);
	}
	//clearUL(Global.oPendingBox);
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
		
		if(resultRows.length==0){
			aReadingLI = document.createElement("span");
			aReadingLI.innerHTML = '<b>您当前无[待阅]信息!</b>';
			Global.oPendingBox.appendChild(aReadingLI);
			document.getElementById("readingCount").innerHTML 
				= "<font style='font-size:11px;'>(0)</font>";
		}else{
			if(typeof(isActive)!='undefined'&&isActive){
				aPendingLI = document.createElement("span");
				aPendingLI.innerHTML = '<font color="red">只显示前'+Global.oShowPendingRowNum+'条待阅工单.</font>';
				Global.oPendingBox.appendChild(aPendingLI);
			}
			for(var i = 0; i < resultRows.length; i++) {
				aReadingIsSelf = resultRows[i].childNodes[Global.oReadingIsSelf].text;
				aReadingMessageId = resultRows[i].childNodes[Global.oReadingMessageID].text;
				aReadingMessageTag = resultRows[i].childNodes[Global.oReadingMessageTag].text;
				aReadingMessageType = resultRows[i].childNodes[Global.oReadingMessageType].text;
						
				aReadingLI = document.createElement("li");
				aReadingLI.innerHTML = '<a id="focus_Readding" href="/workshop/msg/showMsg.html?msg_id=' 
					+ aReadingMessageId + '&msg_tag=' + aReadingMessageTag + '&msg_type=' 
					+ aReadingMessageType + '&msg_isSelf=' + aReadingIsSelf + '" title="' 
					+ resultRows[i].childNodes[Global.oReadingTitle].text 
					+ '" onmousedown="rightAction(this)" '
					+ 'title="'+resultRows[i].childNodes[Global.oReadingTitle].text+'" '
					+ 'URL="/workshop/msg/showMsg.html?msg_id=' 
					+ aReadingMessageId + '&msg_tag=' + aReadingMessageTag + '&msg_type=' 
					+ aReadingMessageType + '&msg_isSelf=' + aReadingIsSelf + '" '
					
					+ ' target=_blank>' 
					+ '<div class="pending_box_con_right_title"><NOBR>' 
						+ resultRows[i].childNodes[Global.oReadingTitle].text + '</NOBR></div>'
					+ '<div class="pending_box_con_right_date">' 
						+ resultRows[i].childNodes[Global.oReadingDate].text +'</div>'	
					+ '</a>';
				//Global.oPendingBox.appendChild(aReadingLI);
				//document.getElementById("readingUL").appendChild(aReadingLI);
				if(typeof(isActive)!='undefined'&&isActive){
					objUl.appendChild(aReadingLI);
				}
			}
			if(objUl.id=='focusUL'){
				recodes = recodes + resultRows.length;
			}
	
			document.getElementById("readingCount").innerHTML 
				= "<font style='font-size:11px;color:red'>("+resultRows.length+")</font>";
		}
		if(objUl.id!='focusUL'){
		    if(typeof(isActive)!='undefined'&&isActive)
			 activeBtn('reading');
		}
		//changeContentTab(readingUL);
		if(typeof(isActive)!='undefined'&&isActive){
			changeContentTab(objUl);
		}
	}
	Global.oReadingParam = {P_ROWNUM:Global.oShowPendingRowNum};
	Global.oReadingList.send(Result.FORCE_GET, Global.oReadingParam);
}

function loadReaded(objUl,isActive) {
	//Global.oPendingBox = document.getElementById("readedUL");
	cleanSortPend();
	Global.oPendingBox = objUl;
	Global.oReadedList = ResultFactory.newResult("CUST_GD_BUSINESS_PERSON_READED");

	if(objUl.id!='focusUL'){
		clearUL(Global.oPendingBox);
	}
	//clearUL(Global.oPendingBox);
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
		
		if(resultRows.length==0){
			aReadedLI = document.createElement("span");
			aReadedLI.innerHTML = '<b>您当前无[已阅]信息!</b>';
			Global.oPendingBox.appendChild(aReadedLI);
			//document.getElementById("readedCount").innerHTML 
				//= "<font style='font-size:11px;'>(0)</font>";
		}else{
			if(typeof(isActive)!='undefined'&&isActive){
				aPendingLI = document.createElement("span");
				aPendingLI.innerHTML = '<font color="red">只显示前'+Global.oShowPendingRowNum+'条已阅工单.</font>';
				Global.oPendingBox.appendChild(aPendingLI);
			}
			for(var i = 0; i < resultRows.length; i++) {
				aReadedIsSelf = resultRows[i].childNodes[Global.oReadedIsSelf].text;
				aReadedMessageId = resultRows[i].childNodes[Global.oReadedMessageID].text;
				aReadedMessageTag = resultRows[i].childNodes[Global.oReadedMessageTag].text;
				aReadedMessageType = resultRows[i].childNodes[Global.oReadedMessageType].text;
						
				aReadedLI = document.createElement("li");
				aReadedLI.innerHTML = '<a id="focus_Readed" href="/workshop/msg/showMsg.html?msg_id=' 
					+ aReadedMessageId + '&msg_tag=' + aReadedMessageTag + '&msg_type=' 
					+ aReadedMessageType + '&msg_isSelf=' + aReadedIsSelf + '" title="' 
					+ resultRows[i].childNodes[Global.oReadedTitle].text 
					+ '" onmousedown="rightAction(this)" '
					+ 'title="'+resultRows[i].childNodes[Global.oReadingTitle].text+'"'
					+ 'URL="/workshop/msg/showMsg.html?msg_id=' 
					+ aReadedMessageId + '&msg_tag=' + aReadedMessageTag + '&msg_type=' 
					+ aReadedMessageType + '&msg_isSelf=' + aReadedIsSelf + '" '
					
					+ ' target=_blank>' 
					+ '<div class="pending_box_con_right_title"><NOBR>' 
						+ resultRows[i].childNodes[Global.oReadedTitle].text + '</NOBR></div>'
					+ '<div class="pending_box_con_right_date">' 
						+ resultRows[i].childNodes[Global.oReadedDate].text +'</div>'	
					+ '</a>';
				//Global.oPendingBox.appendChild(aReadedLI);
				//document.getElementById("readedUL").appendChild(aReadedLI);
				if(typeof(isActive)!='undefined'&&isActive){
					objUl.appendChild(aReadedLI);
				}
			}
			//document.getElementById("readedCount").innerHTML 
				//= "<font style='font-size:11px;color:red'>("+resultRows.length+")</font>";
			if(objUl.id=='focusUL'){
				recodes = recodes + resultRows.length;
			}
		}
		if(objUl.id!='focusUL'){
		    if(typeof(isActive)!='undefined'&&isActive)
			   activeBtn('readed');
		}
		//changeContentTab(readedUL);
		if(typeof(isActive)!='undefined'&&isActive){
			changeContentTab(objUl);
		}
	}
	Global.oReadedParam = {P_ROWNUM:Global.oShowPendingRowNum};
	Global.oReadedList.send(Result.FORCE_GET, Global.oReadedParam);
}

function loadDraft() {
	Global.oPendingBox = document.getElementById("draftUL");
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
		
		if(resultRows.length==0){
			aDraftLI = document.createElement("li");
			aDraftLI.innerHTML = '<b>您当前无[草稿]信息!</b>';
			Global.oPendingBox.appendChild(aDraftLI);
		}else{
			for(var i = 0; i < resultRows.length; i++) {
				aDraftFlowId = resultRows[i].childNodes[Global.oDraftFlowId].text;
				aDraftFlowMod = resultRows[i].childNodes[Global.oDraftFlowMod].text;
				
				aDraftLI = document.createElement("li");
				aDraftLI.innerHTML = "<a href='/workshop/form/index.jsp?fullscreen=yes&flowId=" 
					+ aDraftFlowId + "&flowMod=" + aDraftFlowMod + "' title='" 
					+ resultRows[i].childNodes[Global.oDraftTitle].text + "' target=_blank>" 
					+ '<div class="pending_box_con_right_title"><NOBR>' 
						+ resultRows[i].childNodes[Global.oDraftTitle].text + '</NOBR></div>'
					+ '<div class="pending_box_con_right_date">' 
						+ resultRows[i].childNodes[Global.oDraftDate].text +'</div>'	
					+ '</a>';
				//Global.oPendingBox.appendChild(aDraftLI);
				document.getElementById("draftUL").appendChild(aDraftLI);
			}
		}
		activeBtn('draft');
		changeContentTab(draftUL);
	}
	Global.oDraftParam = {P_ROWNUM:Global.oShowPendingRowNum};
	Global.oDraftList.send(Result.FORCE_GET, Global.oDraftParam);
}

function activeBtn(btnName) {
	for (var i = 0; i < Global.oIndexOperateBtn.length; i++) {
		if (btnName == Global.oIndexOperateBtn[i]) {
			//document.getElementById(Global.oIndexOperateBtn[i]).className = "pending_btn_active";
			document.getElementById(Global.oIndexOperateBtn[i]).className = "dbTitleSel";
		} else {
			//document.getElementById(Global.oIndexOperateBtn[i]).className = "pending_btn";
			document.getElementById(Global.oIndexOperateBtn[i]).className = "dbTitleDef_R";
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

function showBillInfoWindowBusiness(tag, billInfoId)
{
    var openWin = displayMaxWindowWithHandle("/workshop/info/billInfoContent.htm?billInfoId="+billInfoId,"", true);
    openWin.attachEvent('onunload', function(){loadBillInfosBusiness();});
}



 