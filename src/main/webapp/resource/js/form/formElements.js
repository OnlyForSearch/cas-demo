var MSGWIN_STEP = 17;
var MSGWIN_ACCELERATION = 1;
var MSGWIN_JS_NAME = 'form/formElements.js';
var MSGWIN_TITLE_HEIGHT = 22;
function MsgWin() {
    this.titile = "流程信息";
    this.contentXML;
    this.id = 'MSNMsg_' + document.uniqueID;
    this.height = 120;
    this.width = 200;
    this.bottom = 2;
    // 需要扣除标题的高度和两条边4个像素
    this.contentHeight = this.height - MSGWIN_TITLE_HEIGHT - 4;
    this.imgUrl = '/resource/image/msgWin/';
    this.oMsgWin;
    this.finishHeight;
    this.objTimer;
    this.step = MSGWIN_STEP;
}

MsgWin.prototype.show = function(_contentXML, _bottom) {
    this.contentXML = (_contentXML) ? _contentXML : "";
    this.bottom = _bottom ? _bottom : 2;
    var outHTML = '<div id="'
			+ this.id
			+ '" onselectstart="return false" style="'
			+ 'POSITION: absolute;Z-INDEX:99;bottom:' + this.bottom + 'px;right: 14px;WIDTH: '
			+ this.width
			+ 'px;'
			+ 'HEIGHT: '
			+ this.height
			+ 'px;">'
			+ '<div style="'
			+ 'BORDER-TOP: white 1px solid;'
			+ 'BORDER-RIGHT: #CFDEF4 1px solid;'
			+ 'BORDER-BOTTOM: #CFDEF4 1px solid;'
			+ 'BORDER-LEFT: white 1px solid;">'
			+ '<div style="'
			+ 'background-image:url('
			+ this.imgUrl
			+ 'msg_title_bg.gif);'
			+ 'height:'
			+ MSGWIN_TITLE_HEIGHT
			+ 'px;'
			+ 'padding:2px 0px 0px 5px">'
			+ '<table width="100%"><tr><td><img src="'
			+ this.imgUrl
			+ 'msg.gif" align="absmiddle">'
			+ '</td><td><span style="color:#1F336B;margin:3px 0px 0px 6px;">'
			+ this.titile
			+ '</span>'
			+ '</td><td align="right"><img src="'
			+ this.imgUrl
			+ 'msg_close.gif"  onclick="msgWinClose()"></td></tr></table>'
			+ '</div>'
			+ '<div style="'
			+ 'filter:progid:DXImageTransform.Microsoft.gradient(startcolorstr=white,endcolorstr=#a9ccf2,gradientType=0);'
			+ 'height:' + this.contentHeight + ';'
			+ 'BORDER-TOP: #728EB8 1px solid;'
			+ 'BORDER-RIGHT: #B9C9EF 1px solid;'
			+ 'BORDER-BOTTOM: #B9C9EF 1px solid;'
			+ 'BORDER-LEFT: #728EB8 1px solid;">' + this.contentXML + '</div>'
			+ '</div>' + '</DIV>'
    document.body.insertAdjacentHTML('beforeEnd', outHTML);
    this.oMsgWin = document.getElementById(this.id);
    this.oMsgWin.obj = this;
}

MsgWin.prototype.close = function() {
    this.oMsgWin.removeNode(true);
}

function msgWinClose() {
    getElement(event.srcElement, 'div', 2).obj.close();
}
function getScValue() {
    document.getElementById("myQuickOpinion").innerText = event.srcElement.value;
}
//快捷意见栏
function shortCutOpinion(rowNum) {
    var rows = 3;
    if (rowNum) {
        rows = rowNum;
    }

    if (oFormContext) {
        if (oFormContext.FLOW.FLOW_STATUS == "F" || oFormContext.FLOW.TCH_ID == 0) {
            oMPC.style.height="93%";
            return;
        }
    }
    var outHTML = '<div id="menu" style="display:block;width:100%; bottom:2px;\
     left:2px;height:30px; position:absolute;text-align:left;\
      font-weight:bold; color:blue; ">\
      <font size="2pt" style="padding-left:12px; font-weight:bold;">审批意见在此输入：\
      </font>&nbsp;&nbsp;<select onchange="getScValue()">\
      <option value="">...请您选择...</option><option value="已办。">已办。</option>\
      <option value="已阅。">已阅。</option> <option value="传阅。">传阅。</option>\
     <option value="同意。">同意。</option><option value="签发。">签发。</option>\
       <option value="已审核。">已审核。</option> <option value="审核通过。">审核通过。</option> \
      </select><div align="left" style="float:left; "><textarea rows="' + rows + '" id="myQuickOpinion" \
      onkeydown="altQuickGetOpinion()" style="margin-left:12px;overflow:auto;border:1px solid gray;\
     width:91%;" title="按alt+1:同意;alt+2:已审核;alt+c:清空"></textarea></div></div>';

    document.body.insertAdjacentHTML('beforeEnd', outHTML);
    oFormContext.QuickOpinion = document.getElementById("myQuickOpinion");
}

function altQuickGetOpinion() {

    if (event.keyCode == "49" && event.altKey) {
        event.srcElement.value = "同意";
    }
    else if (event.keyCode == "50" && event.altKey) {
        event.srcElement.value = "已审核";
    }
    else if (event.keyCode == "67" && event.altKey) {
        event.srcElement.value = "";
    }
}

function date_count_down() {
    var rlabel = document.getElementById('colDownTime');
    
    if (rlabel) {
       setTimeout("date_count_down()", 1000);
        var results = rlabel.vDate
				.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
       
        var dateStr =   results[4]+":"+results[5]+":"+results[6]+" "+
        results[2]+"/"+results[3]+"/"+results[1];
        var overTime = new Date(dateStr);
        var now =  new Date().getTime();
        var msDiff = overTime - now ;
        
        var second = 1000;
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;     
        
        var daysDiff =  Math.floor(msDiff/day);
        var hoursDiff = Math.floor(msDiff/hour%24);
        var minutesDiff = Math.floor(msDiff/minute%60);
        var secondsDiff = Math.floor(msDiff/second%60);
        
        if (msDiff < 0) {        	
            rlabel.innerText = "已超时";
        } else {
        	hoursDiff = hoursDiff < 10 ? "0" + hoursDiff : hoursDiff ;
            minutesDiff = minutesDiff < 10 ? "0" + minutesDiff:  minutesDiff;
            secondsDiff = secondsDiff < 10 ? "0" + secondsDiff : secondsDiff;
           
            if (daysDiff < 3) {
                rlabel.innerHTML = "<font color=red>" + daysDiff + "天" + hoursDiff
						+ "小时" + minutesDiff + "分" + secondsDiff + "秒</font>";
            } else {
                rlabel.innerHTML = daysDiff + "天" + hoursDiff + "小时" + minutesDiff
						+ "分" + secondsDiff + "秒";
            }
        }
    } else {
        window.clearInterval();
    }

}

// ******************************************************************
function dateDisabledImgDisabled() {
    var imgList = document.getElementsByName("imgDateDisable77");
    for (var g = 0; g < imgList.length; g++) {
        var inputId = imgList[g].getAttribute("inputDateId");
        var dateText = document.getElementById(inputId);
        if (dateText) {
            if (dateText.getAttribute("disabled")) {
                // dateText.className="imgDisable";
                imgList[g].disabled = true;
                imgList[g].className = "imgDisable";
            }
        }
    }
    textReadonlyImgDisable();
}

function textReadonlyImgDisable() {
    var imgRedList = document.getElementsByName("imgTextReadonly88");
    for (var ir = 0; ir < imgRedList.length; ir++) {
        var textId = imgRedList[ir].getAttribute("inputTextId");
        var txtComd = document.getElementById(textId);
        if (txtComd) {
            if (txtComd.getAttribute("readonly") || txtComd.getAttribute("disabled")) {
                // txtComd.className="imgDisable";
                imgRedList[ir].disabled = true;
                imgRedList[ir].className = "imgDisable";
            }
        }
    }
}

var oState = new Object();
var olaV = "";
/**
* 显示多选框
*/
var boxUrl = "/servlet/flowRelationshipAction.do?method=getSelectCheckBoxList&SYS_VAL=";
function showInvolveSystem(labelStr, sys_var, w, h) {
    var oLabel = document.getElementById(labelStr);
    olaV = oLabel;
    initMultiSelection(boxUrl + sys_var, oState);
    var iLeft = getWinScreenLeft(window) + oLabel.getBoundingClientRect().left;
    var iBotton = getWinScreenTop(window)
			+ oLabel.getBoundingClientRect().bottom;
    oState["POPUP"].show(iLeft, iBotton, w, h);

}
/**
* 获取URL下的结果集并初始化为多选框
*/
function initMultiSelection(url, oMulti) {
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST", url, false);
    xmlhttp.send();
    var dXML = xmlhttp.responseXML;
    initMultiSelections(dXML.selectNodes("/root/rowSet"), oMulti);
}

/**
* 初始化多选框
*/
function initMultiSelections(oRows, oMulti) {
    if (oRows == null || oRows.length == 0)
        return;

    var iLen = oRows.length;
    var multiList = new Array();
    var isChecked = false;
    for (var i = 0; i < iLen; i++) {
        if (oRows[i].attributes[0].value == "")
            continue;

        multiList[i] = "<tr>\n"
				+ "<td style=\"border-bottom:1px dotted #666666;\">"
				+ "<input id=\"multiItem_" + i + "\" type=\"checkbox\" "
				+ "value=\"" + oRows[i].attributes[0].value + "\" "
				+ "onclick=\"parent.window.changeMultiSelection(this)\" " + ">"
				+ "<label for=\"multiItem_" + i + "\" style=\"cursor:hand;\">"
				+ oRows[i].selectSingleNode("VALUE").text + "</label>"
				+ "</td>\n" + "</tr>";
    }
    var sHtml = "<table id=\"multiTable\" style='font-size:9pt;width:200'>"
			+ multiList.join("\n") + "</table>";
    var popup = window.createPopup();
    var oPopBody = popup.document.body;
    popup.document.body.style.overflow = 'auto';
    oPopBody.style.backgroundColor = "white";
    oPopBody.style.color = "black";
    oPopBody.style.border = "1px solid black";
    oPopBody.innerHTML = sHtml;
    delete oMulti.POPUP;
    oMulti["POPUP"] = popup;
  
}
/**
* 选择多选框
*/
function changeMultiSelection(oItem) {
    var oTD;
    var oChecked;
    var j = 0;
    var lavelArr = new Array();
    var valueArr = new Array();
    var tab = oItem.document.body.firstChild;
    var oRows = tab.rows;
    for (var i = 0; i < oRows.length; i++) {
        oTD = oRows(i).cells(0);
        oChecked = oTD.childNodes[0];
        if (oChecked.checked) {
            valueArr[j] = oChecked.value;
            lavelArr[j] = oTD.innerText;
            j++;
        }
    }
    olaV.value = lavelArr.join(",");
}

// 只需要返回姓名
function choosePersonName(oStaffName, defaultOrg) {
    var oReturnStaffn;
    if (defaultOrg) {
        oReturnStaffn = choiceStaff(null, defaultOrg, null, null, null, null, defaultOrg);
    }
    else {
        oReturnStaffn = choiceStaff();
    }

    if (oReturnStaffn != null) {
        oStaffName.value = oReturnStaffn.name;
    }
}
// 根据部门找人员
function choosePersonFromOrg(oStaffId, oStaffName, orgId) {
    var oReturnStaff = choiceStaff(false, orgId.value);
    if (oReturnStaff != null) {
        oStaffId.value = oReturnStaff.id;
        oStaffName.value = oReturnStaff.name;
    }
}

// 选人员带出部门
function chooseStaffOrg(valueId,nameId,obj_org){
	var oStaffName = document.getElementById(nameId);
	var oStaffId = document.getElementById(valueId);
	var oOrgId = document.getElementById(obj_org);
	var obj = choiceStaff(true, null, null, null, null, oStaffName.value, oStaffId.value);
	if(obj!=null){
		oStaffId.value = obj.id;
		oStaffName.value = obj.name;
		oOrgId.value = obj.group;
	}
}

//新疆：添加配合人
function getStaffOrgXML(oForm){
	var mergerXML = "";
	//mergerXML =  xStaffOrg.imple.asXML();
	//新疆报表统计_方案设计、新疆新功能_方案设计、新疆问题管理(新)_方案设计
	if(oForm.FLOW.TCH_NUM=='xj_bb_new_fasj' || oForm.FLOW.TCH_NUM=='xj_xgn_fasj' ||
		oForm.FLOW.TCH_NUM=='xj_wt_new_fasj'){
		mergerXML =  xStaffOrg.imple.asXML();
	}
	mergerXML=mergerXML.replace("UTF-8","GBK");
	var doc = new ActiveXObject("Microsoft.XMLDOM");
	if(mergerXML!=""){
		 doc.loadXML(mergerXML);
		 var root = doc.selectSingleNode("root");
		  var element = doc.selectSingleNode("/root/rowSet");
		 while (element != null && element.tagName=="rowSet") {
			var oxStaffId = element.selectSingleNode("STAFF_NAME").getAttribute("staffId");
			if(oxStaffId!=null && oxStaffId!=""){
				 var _oxStaffId = doc.createElement("STAFF_ID");
				 _oxStaffId.text = oxStaffId;
				 element.appendChild(_oxStaffId);
			}
			
			var oxOrgId = element.selectSingleNode("ORG_NAME").getAttribute("orgId");
			if(oxOrgId!=null && oxOrgId!=""){
				 var _oxOrgId = doc.createElement("ORG_ID");
				 _oxOrgId.text = oxOrgId;
				 element.appendChild(_oxOrgId);
			}
			element = element.nextSibling;
		 }
		 var _requestId =  doc.createElement("REQUEST_ID");
		 _requestId.text = osRequestId;
		 root.appendChild(_requestId);
 
		 var _tchNum =  doc.createElement("TCH_NUM");
		 _tchNum.text = oForm.FLOW.TCH_NUM;
		 root.appendChild(_tchNum);
	}
	else{
		mergerXML = "<?xml version=\"1.0\" encoding=\"GBK\"?>"+
						"<root>"+
							"<REQUEST_ID>"+osRequestId+"</REQUEST_ID>"+
							"<TCH_NUM>"+oForm.FLOW.TCH_NUM+"</TCH_NUM>"+
						"</root>";
		doc.loadXML(mergerXML);
	}
	 return doc.xml;
}

//新疆：添加供应商
function getSupplierXML(oForm){
	if(!oForm){
		oForm = oFormContext;
	}
	var mergerXML = "";
	//mergerXML =  xSupplierDesign.imple.asXML();
	//新疆变更管理流程_变更设计
	if(oForm.FLOW.TCH_NUM=='xj_bg_sj'){
		mergerXML =  xSupplierDesign.imple.asXML();
	}
	//新疆变更管理流程_实施变更、新疆数据修改流程_系统实施
	else if(oForm.FLOW.TCH_NUM=='xj_bg_ss' || oForm.FLOW.TCH_NUM=='xj_sjxg_stss'){
		mergerXML =  xSupplierImp.imple.asXML();
	}
	mergerXML=mergerXML.replace("UTF-8","GBK");
	var doc = new ActiveXObject("Microsoft.XMLDOM");
	if(mergerXML!=""){
		 doc.loadXML(mergerXML);
		 var root = doc.selectSingleNode("root");
		 var _requestId =  doc.createElement("REQUEST_ID");
		 _requestId.text = osRequestId;
		 root.appendChild(_requestId);
 
		 var _tchNum =  doc.createElement("TCH_NUM");
		 _tchNum.text = oForm.FLOW.TCH_NUM;
		 root.appendChild(_tchNum);
		
		 var _staffId = doc.createElement("SUBMIT_STAFF_ID");
		 _staffId.text = oForm.GLOBAL_VAR.STAFF_ID;
		 root.appendChild(_staffId);
		
		 var element = doc.selectSingleNode("/root/rowSet");
		 while (element != null && element.tagName=="rowSet") {
			/*
			var oAttach = element.selectSingleNode("attach");
			if(oAttach!=null){
				var fRealName = "";
				if(oAttach.text.indexOf("href")!=-1 && oAttach.text.indexOf("fullPath")!=-1){
					var iStart = oAttach.text.indexOf("form%2F")+7;
					var iEnd = oAttach.text.indexOf("&amp;filename");
					fRealName =oAttach.text.substr(iStart,iEnd - iStart);
					iStart = oAttach.text.indexOf(">")+1;
					iEnd = oAttach.text.indexOf("</a>");
					var fOldName = oAttach.text.substr(iStart,iEnd - iStart);
					oAttach.text = fOldName;
				}
				var _emt2 =  doc.createElement("ATTACH_ADDR");
				_emt2.text = fRealName;
				element.appendChild(_emt2);
			}
			*/
			var attachName = element.selectSingleNode("SUPPLIER").getAttribute("attachName");
			if(attachName!=null && attachName!=""){
				 var _attachName = doc.createElement("ATTACH_NAME");
				 _attachName.text = attachName;
				 element.appendChild(_attachName);
			}
			
			var attachAddr = element.selectSingleNode("COMPLETE_DATE").getAttribute("attachAddr");
			if(attachAddr!=null && attachAddr!=""){
				 var _attachAddr = doc.createElement("ATTACH_ADDR");
				 _attachAddr.text = attachAddr;
				 element.appendChild(_attachAddr);
			}
			element = element.nextSibling;
		 }
	}
	else{
		mergerXML = "<?xml version=\"1.0\" encoding=\"GBK\"?>"+
						"<root>"+
							"<REQUEST_ID>"+osRequestId+"</REQUEST_ID>"+
							"<TCH_NUM>"+oForm.FLOW.TCH_NUM+"</TCH_NUM>"+
							"<SUBMIT_STAFF_ID>"+oForm.GLOBAL_VAR.STAFF_ID+"</SUBMIT_STAFF_ID>"+
						"</root>";
		doc.loadXML(mergerXML);
	}
	 return doc.xml;
}

function viewStaffOrg(obj) {
	var oTable = obj.dataTable;
	var od = oTable.getSelectedRows();
	if (od.length < 1) {
		return false;
	}

	var sHref = "addStaffOrg.html";
	var sPara = 'dialogwidth:30;dialogheight:100px;status:no;help:no;resizable:yes';
	obj.tableKeyId = od[0].getAttribute("id");
	obj.staffName = od[0].children[1].innerText;
	obj.orgName = od[0].children[2].innerText;
	obj.requestId = osRequestId;
	obj.opType = 'edit';
	var oDialogWin = window.showModalDialog(sHref, obj, sPara);
}

function viewSupplier(obj) {
	var oTable = obj.dataTable;
	var od = oTable.getSelectedRows();
	if (od.length < 1) {
		return false;
	}

	var sHref = "addSupplier.html";
	var sPara = 'dialogwidth:30;dialogheight:320px;status:no;help:no;resizable:yes';
	obj.tableKeyId = od[0].getAttribute("id");
	
	obj.supplier = od[0].children[1].innerText;
	obj.completedate = od[0].children[2].innerText;
	obj.requestId = osRequestId;
	obj.tchNum = oFormContext.FLOW.TCH_NUM;
	obj.opType = 'edit';
	var oDialogWin = window.showModalDialog(sHref, obj, sPara);
}

// 加载环节处理意见填充到表单体现相应的环节中
function getTachemodResultDesc(fld) {
    var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
    sendRequest.open("post",
			'/servlet/flowRelationshipAction.do?method=getTachResultDesc&flowId='
					+ fld, false);
    sendRequest.send(null);

    if (sendRequest.readyState == 4 && sendRequest.status == 200) {
        var retXml = sendRequest.responseXML;

        var oRows = retXml.selectNodes("/root/rowSet");
        var iLen = oRows.length;
        for (var i = 0; i < iLen; i++) {
			var rediv = document.getElementById(oRows[i].getAttribute("id") + "div");
			if (rediv) {
				rediv.innerHTML = oRows[i].selectSingleNode("RESULT_DESC").text.replace(/\n/g, "<br/>");
			}
        }
    }
}


// 加载环节处理意见填充到表单体现相应的环节中(新）
function getTachemodResultDescNew(fld) {
    var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
    sendRequest.open("post",
			'/servlet/flowRelationshipAction.do?method=getTachResultDescNew&flowId='
					+ fld, false);
    sendRequest.send(null);

    if (sendRequest.readyState == 4 && sendRequest.status == 200) {
        var retXml = sendRequest.responseXML;
        var oRows = retXml.selectNodes("/root/rowSet");
        var iLen = oRows.length;
        for (var i = 0; i < iLen; i++) {
			var rediv = document.getElementById(oRows[i].getAttribute("id")+"div");
			if (rediv) {
				rediv.innerHTML = oRows[i].selectSingleNode("RESULT_DESC").text.replace(/\n/g, "<br/>");
			}
		}
    }
}
// 弹出窗口
function addMsgDetails(oForm, _bottom) {
    var iTchId = oForm.FLOW.TCH_ID;
    var vType = oForm.FLOW.FLOW_STATUS != 'F' ? 'N' : 'F';
    if (vType == 'N' && iTchId == 0) {
        return false;
    }
    var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
    sendRequest.open("post",
			'/servlet/flowRelationshipAction.do?method=getTacheInfo&vType='
					+ vType + '&tchId=' + oForm.FLOW.TCH_ID, false);
    sendRequest.send(null);
    var vHtml = "";
    var slDate;
    var msgShow = true;
    if (sendRequest.readyState == 4 && sendRequest.status == 200) {
        var retXml = sendRequest.responseXML;
        if (vType == 'F') {
            vHtml += '<div style="margin:5px 0px 0px 1px">'
					+ '<span style="color:#1F336B;">处理人:'
					+ retXml.selectSingleNode("//rowSet/STAFF_NAME").text
					+ '</span>' + '</div>';
            vHtml += '<div style="margin:5px 0px 0px 1px">'
					+ '<span style="color:#1F336B;">竣工时间:'
					+ retXml.selectSingleNode("//rowSet/FINISH_DATE").text
					+ '</span></div>';
        }
        else {
            var nodePerson = retXml.selectSingleNode("//rowSet/PERSON");
            if (nodePerson == null || typeof (nodePerson) == "undefined") {
                msgShow = false;
            }
            else {
                var powerPerson = nodePerson.text;
                if (powerPerson.substr(0, 1) == ",") {
                    powerPerson = powerPerson.substr(1);
                }
                vHtml += '<div style="margin:5px 0px 0px 1px">'
					+ '<span style="color:#1F336B;">可处理人:'
					+ powerPerson
					+ '</span></div>';
            }

            var nodeDate = retXml.selectSingleNode("//rowSet/SLA_DATE");
            if (nodeDate == null || typeof (nodeDate) == "undefined") {
                msgShow = false;
            }
            else {
                var vDate = nodeDate.text;
                if (vDate != '') {
                    var results = vDate
						.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);

                    slDate = new Date(parseInt(results[1]), parseInt(results[2]),
						parseInt(results[3]), results[4], parseInt(results[5]),
						parseInt(results[6]));

                    vHtml += '<div style="margin:5px 0px 0px 1px">'
						+ '<span style="color:#1F336B;" >距处理超时:<label id="colDownTime" vDate="'
						+ vDate + '"></label></span>' + '</div>';
                }
            }
        }
    }
    var msgWin = new MsgWin();
    var isShow = true;
    var outHTML = '<div style="width:100%;height:100%;padding:10px 10px 0px 10px">\
   <div><span style=\"color:#1F336B;font-weight:bold\">当前环节:'
			+ oForm.FLOW.TCH_NAME + '</span>' + vHtml + '</div></div>';

    if (msgShow) {
        msgWin.show(outHTML, _bottom);
    }
    if (slDate) {
        window.setTimeout("date_count_down()", 100);
    }
}

// 返回选择树的路径
function onResultChangeFn(v) {
    var oRepeatNode = v.xmlDom.selectSingleNode("//MenuItem[@id=" + v.value
			+ "]");
    var pleg = oRepeatNode.getAttribute('TYPE_LEVEL');
    var pathText = oRepeatNode.getAttribute('label');
    for (var p = 1; p < pleg; p++) {
        oRepeatNode = oRepeatNode.parentNode;
        pathText = oRepeatNode.getAttribute('label') + "-" + pathText;
    }
    //v.value = pathText;
    v.text = pathText;
}

//返回部门树路径
function onOrganizationChangeFn(v) {
    if (v.value == "") return;
    var oRepeatNode = v.xmlDom.selectSingleNode("//MenuItem[@id=" + v.value + "]");
    var pleg = oRepeatNode.getAttribute('LEVEL');
    var pathText = oRepeatNode.getAttribute('label');
    for (var p = 2; p < pleg; p++) {//从2开始，不把根节点显示出来
        oRepeatNode = oRepeatNode.parentNode;
        pathText = oRepeatNode.getAttribute('label') + "-" + pathText;
    }
    v.text = pathText;
}
//根据部门找人员
function choosePersontest(orgId, oStaffName, tel, chgOrgValue) {
	var org_id = null;
	if(orgId){
		org_id = orgId.value;
	}
    var oReturnStaff = choiceStaff(false, org_id);
    if (oReturnStaff != null) {
        oStaffName.value = oReturnStaff.name;
        var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
        sendRequest.open("post", '/servlet/staff_manage?tag=19&id=' + oReturnStaff.id,
				false);
        sendRequest.send(null);
        if (sendRequest.readyState == 4 && sendRequest.status == 200) {
            var retXml = sendRequest.responseXML;
            tel.value = retXml.selectSingleNode("root/Msg/MOBILE").text;
            if (orgId) {
            	if(chgOrgValue) return;
                orgId.value = retXml.selectSingleNode("root/Msg/ORG_ID").text;
                onOrganizationChangeFn(orgId);
            }
        }
    }
}

// 新疆流程表单内嵌表格公用方法**************************************************

function makeReadonlyInputDisabled() {
    var readOnlyinputs = document.getElementsByTagName("INPUT");
    if (readOnlyinputs.length > 0) {
        for (var i = 0; i < readOnlyinputs.length; i++) {
            if (readOnlyinputs[i].className != 'dateInput') {
                if (readOnlyinputs[i].readOnly) {
                    readOnlyinputs[i].disabled = true;
                }
            }
        }
    }
    var readOnlytextareas = document.getElementsByTagName("TEXTAREA");
    if (readOnlytextareas.length > 0) {
        for (var i = 0; i < readOnlytextareas.length; i++) {
            if (readOnlytextareas[i].readOnly) {
                readOnlytextareas[i].disabled = true;
            }
        }
    }
}

//验证正整数
function checkint(obj) {
    if (obj.value == '') return;
    var pattern = /^[0-9]*[1-9][0-9]*$/;
    var flag = pattern.test(obj.value);
    if (!flag) { obj.value = isNaN(parseInt(obj.value)) ? "" : parseInt(obj.value); }
}

//验证浮点数
function checkfloat(obj) {
    if (obj.value.lastIndexOf(".") == obj.value.length - 1) {
        var arrMatches = obj.value.match(/[.]/g);
        if (arrMatches != null) {
            if (arrMatches.length > 1) {
                this.removeLast();
            } else if (arrMatches.length == 1) {
                obj.attachEvent('onblur', this.removePoint);
            } 
        }
    }
    else {
        var pattern = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
        var flag = pattern.test(obj.value);
        if (!flag) { if (isNaN(parseFloat(obj.value))) { obj.value = ""; } else { obj.value = parseFloat(obj.value); obj.value = isNaN(chgFix2(obj.value)) ? "" : obj.value = chgFix2(obj.value); } }
        else {
            var pIndex = obj.value.indexOf('.');
            if (pIndex > 0) {
                obj.value = obj.value.substr(0, pIndex + 3);
                this.getValue();
            }
        }
    }
    this.removePoint = function() { if (obj.value.lastIndexOf(".") == obj.value.length - 1 || obj.value.lastIndexOf("e") == obj.value.length - 1) { obj.value = obj.value.substr(0, obj.value.length - 1); return; } obj.detachEvent('onblur', removePoint); };
    this.removeLast = function() { obj.value = obj.value.substr(0, obj.value.length - 1); };
    this.chgFix2 =function (x){ return Math.round(x * 100) / 100; };
    this.getValue = function() { if (isNaN(parseFloat(obj.value))) { obj.value = ""; } else if (obj.value.substr(obj.value.length - 2, 2) == ".0") { return; } else { obj.value = parseFloat(obj.value); obj.value = isNaN(chgFix2(obj.value)) ? "" : obj.value = chgFix2(obj.value); } };
}

function judgeDemandItemDescLen() {
    //验证[需求事项概述]长度
    var regex = /[^\x00-\xff]/gi;
    var arrMatches = xDemandItemDesc.value.match(regex);
    if (arrMatches != null) {
        if (arrMatches.length > 50) {
            alert('需求事项概述请输入50个汉字以内');
            xDemandItemDesc.focus();
            return false;
        }
    }
    return true;
}

function doIT_impSystem(rqId) {
	if(typeof(xImp)!="undefined"){
	    if (rqId) {
	        xImp.requestId = rqId;
	        xImp.readOnly = true;
	    }
	    else {
	        xImp.requestId = xRequestId.value;
	        xImp.dblAction = "viewImple()";
	    }
	    xImp.tDay = oFormContext.GLOBAL_VAR.TODAY;
	    xImp.staffName = oFormContext.GLOBAL_VAR.STAFF_NAME;
	    xImp.doInit();
    }
}

function viewImple() {

    var oTable = xImp.dataTable;
    var od = oTable.getSelectedRows();
    if (od.length < 1) {
        return false;
    }

    var sHref = "qtb_add_impSystem.html";
    var sPara = 'dialogwidth:30;dialogheight:320px;status:no;help:no;resizable:yes';
    xImp.tableKeyId = od[0].getAttribute("id");
    xImp.requestId = xRequestId.value;
    xImp.tDay = oFormContext.GLOBAL_VAR.TODAY;
    xImp.staffName = oFormContext.GLOBAL_VAR.STAFF_NAME;
    xImp.opType = 'edit';

    var oDialogWin = window.showModalDialog(sHref, xImp, sPara);
}

function doIT_testSystem(rqId) {
	if(typeof(xSystest)!="undefined"){
	    if (rqId) {
	        xSystest.requestId = rqId;
	        xSystest.readOnly = true;
	    }
	    else {
	        xSystest.requestId = xRequestId.value;
	        xSystest.dblAction = "viewSystest()";
	    }
	    xSystest.doInit();
	}
}

function viewSystest() {
    var oTable = xSystest.dataTable;
    var od = oTable.getSelectedRows();
    if (od.length < 1) {
        return false;
    }

    var sHref = "qtb_add_itTestSystem.html";
    var sPara = 'dialogwidth:30;dialogheight:280px;status:no;help:no;resizable:yes';
    xSystest.tableKeyId = od[0].getAttribute("id");
    xSystest.requestId = xRequestId.value;
    xSystest.opType = 'edit';
    var oDialogWin = window.showModalDialog(sHref, xSystest, sPara);
}

var loadTableData = function(rqId) {
    doIT_impSystem(rqId);
    doIT_testSystem(rqId);
};



function choosePerson(obj_man_id,obj_man_name){
	var obj = choiceStaff();
	if(obj!=null){
		obj_man_id.value = obj.id;
		obj_man_name.value = obj.name;
	}
}
		
function controlPage(oDiv,oImg){
	if(oDiv.style.display=="none"){
		oDiv.style.display = "";
		oImg.src="/resource/image/ico/00044.gif";
	}else{
		oDiv.style.display = "none";
		oImg.src="/resource/image/ico/00043.gif";
	}
}
		
//初始化下拉框
function setList(url,obj){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var selectXml = new ActiveXObject("Microsoft.XMLDOM");
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
	selectXml.load(xmlhttp.responseXML);
	obj.options.length=1;
	var oRows=selectXml.selectNodes("//root/Info");
	for(var i=0;i<oRows.length;i++)
	{
		// 建立Option对象
		var objOption = new Option(oRows[i].getAttribute("typeName"),oRows[i].attributes[0].value);
		obj.add(objOption);
	}
}
	//是否发送点击事件
function checkPhsSendFlag() {
	var obj = document.getElementsByName("IS_SEND");
	var a = obj.length;
	for(i=0;i<a;i++) {
		if(obj[i].checked) {
			if(obj[i].value=="1") {
				var contentObj = document.getElementsByName("SEND_TYPE");
				var contentObjLength = contentObj.length;
				for(j = 0; j < contentObjLength; j ++) {
					if(contentObj[j].checked) {
						if(contentObj[j].value == '1') {
							document.all.SEND_TR.style.display="";
						}
					}
				}
				document.all.SEND_TBODY.style.display="";
			} else {
				document.all.SEND_TBODY.style.display="none";
				document.all.SEND_TR.style.display="none";
			}
		}
	}
}

//监测发送短信类型，是系统默认还是自己编写
function checkSendPhsType() {
	var obj = document.getElementsByName("SEND_TYPE");
	var a = obj.length;
	for(i=0;i<a;i++){
		if(obj[i].checked) {
			if(obj[i].value=="1") {
				document.all.SEND_TR.style.display="";
			} else {
				document.all.SEND_TR.style.display="none";
			}
		}
	}
}

//发送短信提示的显示与隐藏
var mark = 0;
function showMessageConfig(){
var oFlowImgOther = document.getElementById("flowImgOther");
	if(mark==0){
	  	oShowMessageConfigDiv.style.display="";
	  	oFlowImgOther.src="/resource/image/ico/00044.gif";
	  	mark = 1;
  	}else{
	  	oFlowImgOther.src="/resource/image/ico/00043.gif";
	  	oShowMessageConfigDiv.style.display="none";
	  	mark = 0;
  	}
}
//点击流转
function onForward(){
	var vMobile = document.getElementById("MOBILE").value;
	vMobile = vMobile.replace(/(^\s*)|(\s*$)/g,"");
	var reg = new RegExp("^\\d{6,15}([;]\\d{6,15})*$");
	var vIsSends = document.getElementsByName("IS_SEND");
	for(var i=0;i<vIsSends.length;i++){
		if(vIsSends[i].checked){
			var vIsSend = vIsSends[i].value;
			if(vIsSend == 1){
				if(vMobile!=null&&vMobile!=''&&vMobile!=undefined){
					var oFlowImgOther = document.getElementById("flowImgOther");
					if(!reg.test(vMobile)){
						alert('短信提示号码格式不正确，请核实后再流转!');
						oShowMessageConfigDiv.style.display="";
					  	oFlowImgOther.src="/resource/image/ico/00044.gif";
					  	mark = 1;
					  	return false;
					}
					else {
						var mobiles = vMobile.split(';');
						for(var i = 0;i< mobiles.length-1;i++)
							for(j = i+1;j<mobiles.length;j++)
								if(mobiles[i]==mobiles[j]){
									alert('手机号码不能重复，请核实后在输入!');
									oShowMessageConfigDiv.style.display="";
					  				oFlowImgOther.src="/resource/image/ico/00044.gif";
									return false;
								}
									
						return true;
					}
						
				}
				else{
					var oFlowImgOther = document.getElementById("flowImgOther");
					oShowMessageConfigDiv.style.display="";
					alert('短信提示号码不能为空!');
					return false;
				}
			}
			else 
				return true;
			break;
		}
	}
}
//返回是否发送
function getSendType(){
	var obj = document.getElementsByName("IS_SEND");
	var a = obj.length;
	for(i=0;i<a;i++) {
		if(obj[i].checked) {
			return obj[i].value;
		}
	}
	return 0;
}

//返回短信提示号码
function getMobile(){
	return document.getElementById("MOBILE").value;
}

//返回短信内容类型
function getContentType(){
	var obj = document.getElementsByName("SEND_TYPE");
	var a = obj.length;
	for(i=0;i<a;i++) {
		if(obj[i].checked) {
			return obj[i].value;
		}
	}
	return 0;
}

//返回短信内容
function getMessageContent(){
	return document.getElementById("MESSAGE_CONTENT").value;
}

function loadJs(){
	$import("../ext/adapter/ext/ext-base.js","formElements.js");
	$import("../ext/ext-all.js","formElements.js");
	$import("../ext/src/locale/ext-lang-zh_CN.js","formElements.js");
	$import("../busiMonitor/Result.js","formElements.js");
	$import("../busiMonitor/ResultProxy.js","formElements.js");
	$import("../busiMonitor/ResultGrid.js","formElements.js");
	$import("flowRelationship.js","formElements.js");
}


// 加载变更或者测试环节处理意见
function getChangeOrTestTachemodResultDesc() { 

         var tempFlowId=0;        
         var changeGrid = formField_1.gridSub;
         if(changeGrid.getStore().getCount()>0){
                 tempFlowId = changeGrid.getStore().getAt(0).get("FLOW_ID"); 
         }
         if(tempFlowId){
             var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
             sendRequest.open("post",
	         '/servlet/flowRelationshipAction.do?method=getTachResultDesc&flowId='+ tempFlowId, false);
	         sendRequest.send(null);
             if (sendRequest.readyState == 4 && sendRequest.status == 200) {
                var rowSets = sendRequest.responseXML.selectNodes("/root/rowSet");
                var len = rowSets.length;               
                var signs = [];           
                for (var i = 0; i < len; i++) {
                   signs.push(rowSets[i].selectSingleNode("RESULT_DESC").text);
                }
                 var htmls = signs.join('');                
                 changeDiv.innerHTML= htmls; 
             }           
        }    
}
 
 
 //查看对应工单的相关信息
 function viewOrderInfo(grid){
       var row = grid.getSelectionModel().getSelected();
       if(row){
         var flowId=row.get("FLOW_ID");
         var sFeatures = "location=0,menubar=0,resizable=1,scrollbars=1,status=0,titlebar=0,toolbar=0";
		 window.open('/workshop/form/index.jsp?fullscreen=yes&flowId='+flowId, null, sFeatures);
       }
 }
 
//到变更实施环节或者测试环节是否能流转
function isCanTurn(){
       var his_num=-1;
       var changeGrid = formField_1.gridSub; 
        if(changeGrid.getStore().getCount()>0){
                 his_num = changeGrid.getStore().getAt(0).get("HIS_NUM");               
        }
        if(his_num==0){
           alert("\"变更实施流程\"还没有竣工,不能流转");
           return false;
        }
        return true;
}

