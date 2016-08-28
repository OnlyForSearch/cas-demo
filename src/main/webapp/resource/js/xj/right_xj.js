Global = {
	oShowPendingRowNum:9,//12,
	oPendingEllipsisLength:98,
	oDefaultEllipsisLength:72,
	oIndexOperateBtn:['pending','pended','readed','reading','draft','tail'],//,'draft','tail'],
	
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
	oDraftParam:null,//,
	
	oTailList:null,
	oTailParam:null
}

function initData() {
	//加载待办
	loadPending();	
	window.setInterval(loadPending, 60000);

	//加载计费动态信息
	loadBillInfosBusiness(); 

}

function loadPending() {
	Global.oPendingBox = document.getElementById("pendingUL");
	Global.oPendingList = ResultFactory.newResult("XJ_BUSINESS_PERSON_PENDING");
	clearUL(Global.oPendingBox);
	if (!Global.oPendingList) {
		return;
	}
	
	Global.oPendingList.onLoad = function(oXml) {
		var aPendingLI;
		var resultRows = oXml.selectNodes("/root/rowSet");
		
		if(resultRows.length==0){
			aPendingLI = document.createElement("li");
			aPendingLI.innerHTML = '<b>您当前无[待办]信息!</b>';
			Global.oPendingBox.appendChild(aPendingLI);
		}else{
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
		}
		activeBtn('pending');
	}
	Global.oPendingParam = {P_ROWNUM:Global.oShowPendingRowNum};
	Global.oPendingList.send(Result.FORCE_GET, Global.oPendingParam);
}

function loadPended() {
	Global.oPendingBox = document.getElementById("pendingUL");
	Global.oPendedList = ResultFactory.newResult("XJ_BUSINESS_PERSON_PENDED");
	
	clearUL(Global.oPendingBox);
	if (!Global.oPendedList) {
		return;
	}
		
	Global.oPendedList.onLoad = function(oXml) {
		var aPendedLI;
		var resultRows = oXml.selectNodes("/root/rowSet");
		
		if(resultRows.length==0){
			aPendedLI = document.createElement("li");
			aPendedLI.innerHTML = '<b>您当前无[将超时]信息!</b>';
			Global.oPendingBox.appendChild(aPendedLI);
		}else{
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
		}
		activeBtn('pended');
	}
	Global.oPendedParam = {P_ROWNUM:Global.oShowPendingRowNum};
	Global.oPendedList.send(Result.FORCE_GET, Global.oPendedParam);
}

function loadReading() {
	Global.oPendingBox = document.getElementById("pendingUL");
	Global.oReadingList = ResultFactory.newResult("XJ_BUSINESS_PERSON_READING");
	
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
		
		if(resultRows.length==0){
			aReadingLI = document.createElement("li");
			aReadingLI.innerHTML = '<b>您当前无[待阅]信息!</b>';
			Global.oPendingBox.appendChild(aReadingLI);
		}else{
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
		}
		activeBtn('reading');
	}
	Global.oReadingParam = {P_ROWNUM:Global.oShowPendingRowNum};
	Global.oReadingList.send(Result.FORCE_GET, Global.oReadingParam);
}

function loadReaded() {
	Global.oPendingBox = document.getElementById("pendingUL");
	Global.oReadedList = ResultFactory.newResult("XJ_BUSINESS_PERSON_READED");

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
		
		if(resultRows.length==0){
			aReadedLI = document.createElement("li");
			aReadedLI.innerHTML = '<b>您当前无[已超时]信息!</b>';
			Global.oPendingBox.appendChild(aReadedLI);
		}else{
			for(var i = 0; i < resultRows.length; i++) {
				aReadedIsSelf = resultRows[i].childNodes[Global.oReadedIsSelf].text;
				aReadedMessageId = resultRows[i].childNodes[Global.oReadedMessageID].text;
				aReadedMessageTag = resultRows[i].childNodes[Global.oReadedMessageTag].text;
				aReadedMessageType = resultRows[i].childNodes[Global.oReadedMessageType].text;
				aReadedLI = document.createElement("li");
				aReadedLI.innerHTML = '<a href="#" onclick="openPending(this);" ' 
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
				Global.oPendingBox.appendChild(aReadedLI);
			}
		}
		activeBtn('readed');
	}
	Global.oReadedParam = {P_ROWNUM:Global.oShowPendingRowNum};
	Global.oReadedList.send(Result.FORCE_GET, Global.oReadedParam);
}

function loadDraft() {
	Global.oPendingBox = document.getElementById("pendingUL");
	Global.oDraftList = ResultFactory.newResult("XJ_BUSINESS_PERSON_DRAFT");

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
				Global.oPendingBox.appendChild(aDraftLI);
			}
		}
		activeBtn('draft');
	}
	Global.oDraftParam = {P_ROWNUM:Global.oShowPendingRowNum};
	Global.oDraftList.send(Result.FORCE_GET, Global.oDraftParam);
}

function loadTail() {
	Global.oPendingBox = document.getElementById("pendingUL");
	Global.oTailList = ResultFactory.newResult("XJ_BUSINESS_PERSON_TAIL");

	clearUL(Global.oPendingBox);
	if (!Global.oTailList) {
		return;
	}
	
	Global.oTailList.onLoad = function(oXml) {
		var aPendingLI;
		var resultRows = oXml.selectNodes("/root/rowSet");
		if(resultRows.length==0){
			aPendingLI = document.createElement("li");
			aPendingLI.innerHTML = '<b>您当前无[跟踪]信息!</b>';
			Global.oPendingBox.appendChild(aPendingLI);
		}else{
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

function showBillInfoWindowBusiness(tag, billInfoId)
{
    var openWin = displayMaxWindowWithHandle("/workshop/info/billInfoContent.htm?billInfoId="+billInfoId,"", true);
    openWin.attachEvent('onunload', function(){loadBillInfosBusiness();});
}

