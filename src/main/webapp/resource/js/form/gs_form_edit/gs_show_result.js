//begin--add:g.huangxm time:2010-10-27
//�������������ɾ��ҳ��

//����˵��
//ҳ��url��show_result.html?result=''formid=''opentype=''admin=''
//result����ѯ���ID 
//formid����ID
//opentype���򿪴���ķ�ʽ 0 open   1 showDial
//admin������ԱSTAFFID ��,�ֿ���
//����workshop/query/show_result.html?result=999990125&formid=550000000163&opentype=0&admin=1,361,1161,1158,1397,362

//�����ݱ�����ֶ�˵��
//1��REQUEST_ID������������Ψһ����ID
//2��RECORD_PEOPLE_ID������¼�����ԱID

var callbackFn;      //�ص�
var result = "";     //��ѯ���ID
var formid = "";     //��ID
var opentype = "";   //�򿪴���ķ�ʽ
var arry;            //�����б�
var loadMarsk = new Ext.LoadMask(document.body, {  
     msg     : '���������ɵ��У����Ժ򡣡���������'
 });  
$import("../../../../workshop/excelImporter/excelImporter.js","gs_show_result.js");
function AhDataAdd(grid) {
    arry = getURLSearch();
    formid = arry['formid'];
    opentype = arry['opentype'];
    admin = arry['admin'];
    if (!grid || (typeof grid.getSelectionModel != 'function')) {
        grid = this;
    }
    callbackFn = refresh.callback([grid]);
    if (formid != undefined && formid != "" && opentype != undefined && opentype != "") {
        switch (opentype) {
            case "0":
                var url = "/workshop/form/index.jsp?callback=window.opener.callbackFn()&formId=" + formid + "&admin=" + admin;
                OpenForm(url, 'DataAdd');
                break;
            case "1":
                var url = "/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formid + "&admin=" + admin;
                window.showModalDialog(url, window, "dialogWidth:780px;dialogHeight:700px;center:yes;help:no;resizable:no;status:no");
                break;
            case "2":
                var url = "/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formid + "&admin=" + admin;
                window.showModalDialog(url, window, "status:no;help:no;resizable:yes");
                break;
        }
    } else {
        alert("��ID����Ϊ�գ�");
    }
}

function AhDataModify(grid) {
    arry = getURLSearch();
    formid = arry['formid'];
    opentype = arry['opentype'];
    admin = arry['admin'];
    if (!grid || (typeof grid.getSelectionModel != 'function')) {
        grid = this;
    }
    callbackFn = refresh.callback([grid]);
    var row = grid.getSelectionModel().getSelected();
    if (formid != undefined && formid != "" && opentype != undefined && opentype != "") {
        if (row) {
            var v_serial= row.get("�ɵ�������");
            if(v_serial){
               MMsg("��©�����ɵ����޷��޸�!");
               return;
            }
            switch (opentype) {
                case "0":
                    var url = "/workshop/form/index.jsp?callback=window.opener.callbackFn()&formId=" + formid + "&requestId=" + row.get("REQUEST_ID") + "&admin=" + admin;
                    OpenForm(url, 'DataModify'+parseInt(1000*Math.random()));
                    break;
                case "1":
                    var url = "/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formid + "&requestId=" + row.get("REQUEST_ID") + "&admin=" + admin;
                    window.showModalDialog(url, window, "dialogWidth:780px;dialogHeight:700px;center:yes;help:no;resizable:no;status:no");
                    break;
                case "2":
	                var url = "/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formid + "&requestId=" + row.get("REQUEST_ID") + "&admin=" + admin;
	                window.showModalDialog(url, window, "status:no;help:no;resizable:yes");
	                break;
            }
        }
        else {
            MMsg("��ѡ��һ�");
            return;
        }

    } else {
        alert("��ID����Ϊ�գ�");
    }
}

function dataAddForID(grid) {
    arry = getURLSearch();
    formid = arry['formid'];
    opentype = arry['opentype'];
    admin = arry['admin'];
    id = arry['id'];
    if (!grid || (typeof grid.getSelectionModel != 'function')) {
        grid = this;
    }
    callbackFn = refresh.callback([grid]);
    if (formid != undefined && formid != "" && opentype != undefined && opentype != "") {
        switch (opentype) {
            case "0":
                var url = "/workshop/form/index.jsp?callback=window.opener.callbackFn()&formId=" + formid + "&admin=" + admin + "&id=" + id;
                OpenForm(url, 'DataAdd');
                break;
            case "1":
                var url = "/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formid + "&admin=" + admin + "&id=" + id;
                window.showModalDialog(url, window, "dialogWidth:780px;dialogHeight:700px;center:yes;help:no;resizable:no;status:no");
                break;
        }
    } else {
        alert("��ID����Ϊ�գ�");
    }
}

//ɾ������
function DataDel(grid) {
    arry = getURLSearch();
    formid = arry['formid'];
    if (formid != 'undefined' && formid != "") {
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        if (!grid || (typeof grid.getSelectionModel != 'function')) {
            grid = this;
        }
         var rows = grid.getSelectionModel().getSelections();
         if(rows.length>1){
              EMsg("ֻ�ܵ���ɾ����¼!");
              return;
        }
        var row = grid.getSelectionModel().getSelected();
        if (row) {
            var v_serial= row.get("�ɵ�������");
            if(v_serial){
               EMsg("��©�����ɵ����޷�ɾ��!");
               return;
            }
            if (isAdminPer(row.get("RECORD_PEOPLE_ID"),"1")) {
                if (QMsg("ȷ��ɾ����ѡ���¼��") == MSG_YES) {
                    var sRequestId = row.get("REQUEST_ID");
                    var delByClassIdUrl = "/servlet/AhFlowManagerServlet?tag=15&formId=" + formid + "&requestId=" + sRequestId;
                    xmlhttp.Open("POST", delByClassIdUrl, false);
                    xmlhttp.send();
                    if (isSuccess(xmlhttp)) {
                        MMsg("ɾ���ɹ���");
                        grid.search();
                    }
                }
            }
            else {
                alert("��û��ɾ��Ȩ�ޣ�");
            }
        } else {
            MMsg("��ѡ��һ�");
            return;
        }
    } else {
        alert("��ID����Ϊ�գ�");
    }
}

//ɾ������(�汾)
function DataDelForVersion(grid) {
	checkHasCryptoJS();
    arry = getURLSearch();
    formid = arry['formid'];
    if (formid != 'undefined' && formid != "") {
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        if (!grid || (typeof grid.getSelectionModel != 'function')) {
            grid = this;
        }
        var row = grid.getSelectionModel().getSelected();
        if (row) {
            if (isAdminPer(row.get("RECORD_PEOPLE_ID"),"1")) {
                if (QMsg("ȷ��ɾ����ѡ���¼��") == MSG_YES) {
                    var sRequestId = row.get("REQUEST_ID");
                    var sqltmp = "select count(*) from CUST_AH_IT_FUNC_VER_RELA a,CUST_AH_FUNCTION b,CUST_AH_IT_DEMAND c where a.STATE='0SA' AND A.MAIN_REQUEST_ID = C.REQUEST_ID AND A.SECOND_REQUEST_ID = B.REQUEST_ID AND C.STATE in ('0','1') and to_char(a.SUB_REQUEST_ID)="+sRequestId;
				    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				    xmlhttp.Open("POST", "/servlet/@Deprecated/ExecServlet?action=101&paramValue=" + getAESEncode(encodeURIComponent(sqltmp)), false);
				    xmlhttp.send();
				    if(isSuccess(xmlhttp)) {
				        var dataArr = xmlhttp.responseXML.getElementsByTagName("rowSet");
				        var v_count = dataArr[0].attributes[0].value;
				        if(v_count>0){
				        	MMsg("�ð汾�ѹ������ܵ㣬����ɾ����");
				        	return;
				        }else{
				        	var delByClassIdUrl = "/servlet/AhFlowManagerServlet?tag=15&formId=" + formid + "&requestId=" + sRequestId;
                    		xmlhttp.Open("POST", delByClassIdUrl, false);
                    		xmlhttp.send();
                    		if (isSuccess(xmlhttp)) {
                        		MMsg("ɾ���ɹ���");
                        		grid.search();
                   			}
				        }
				    }
                }
            }else {
                MMsg("��û��ɾ��Ȩ�ޣ�");
                return;
            }
        } else {
            MMsg("��ѡ��һ�");
            return;
        }
    } else {
        MMsg("��ID����Ϊ�գ�");
        return;
    }
}

//����©����
function importSaveVulnerabilityData(grid){
    arry = getURLSearch();
	var configId = arry['configId'];
    var params = '';
    var tip = '';
    var refeshList = function() {
       grid.search();
    }
    openExcelImporter(configId, params, tip, refeshList);
}

//©���ⵥ���ɵ�
function singleDispatchForVul(grid){
   var selectionModel = grid.getSelectionModel();
    var rows = selectionModel.getSelections();
    if(rows.length < 1){
        EMsg("��ѡ��һ����¼!");
        return;
    }
    if(rows.length > 1){
        EMsg("��ѡ������¼!");
        return;
    }
    var row = rows[0];
    var v_system = row.get("ҵ��ϵͳ");
    var v_vul_type = row.get("©������");
    var V_REQUEST_ID = row.get("REQUEST_ID");
    var V_FLAW_STATE = row.get("©��״̬");
    if(typeof(v_system)=='undefined'||v_system==''){
        EMsg("δ�ҵ�ҵ��ϵͳ��ʶ!");
        return;
    }else if(typeof(v_vul_type)=='undefined'||v_vul_type==''){
        EMsg("δ�ҵ�©�����ͱ�ʶ!");
        return;
    }else if(typeof(V_REQUEST_ID)=='undefined'||V_REQUEST_ID==''){
        EMsg("δ�ҵ�REQUEST_ID��ʶ!");
        return;
    }
    if(V_FLAW_STATE!='δ����'){
        EMsg("��ѡ��δ�����©����¼�����ɵ�!");
        return;
    }
    var obj = choiceStaff(true);
    if(obj){
      var staffIds = obj.id;
      if(!staffIds){
        EMsg("��ѡ���ɵ�������!");
        return;
      }else 
        singleDispatchSavePinUpFlow(V_REQUEST_ID,staffIds,grid);
    }
}

function singleDispatchSavePinUpFlow(pRequestId,dispathStaffIds,grid){       
       var url = "/servlet/GSFormServlet?tag=6&pRequestId="+pRequestId+"&dispathStaffIds="+dispathStaffIds;
       var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
       oXMLHTTP.open("POST",url ,false);
       oXMLHTTP.send(); 
       if(isSuccess(oXMLHTTP)){
           MMsg("�ɵ��ɹ�"); 
           grid.search();   
       }        
}

function mergeDispatchSavePinUpFlow(flawRequestIds,dispathStaffIds,grid){        
         loadMarsk.show();       
         var url = "/servlet/GSFormServlet?tag=5&flawRequestIds="+flawRequestIds+"&dispathStaffIds="+dispathStaffIds;
         var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
         oXMLHTTP.open("POST",url ,false);
         oXMLHTTP.send(); 
         if(isSuccess(oXMLHTTP)){  
              var retXml = oXMLHTTP.responseXML;
              var rowSet= retXml.selectSingleNode("/root/rowSet");   
              if(rowSet){
                  var sucess_num =  parseInt(rowSet.selectSingleNode("sucess_num").text);
                  var fail_num = parseInt(rowSet.selectSingleNode("fail_num").text);
                  var batch_id = rowSet.selectSingleNode("batch_id").text;                 
                  if(fail_num==0){
                     MMsg("�����ɵ��ɹ�"); 
                  }else{
                     Ext.MessageBox.alert('ϵͳ��ʾ',"�����ɵ�,�ɹ�"+sucess_num+"��,ʧ��"+fail_num+"��,�����뿴<a style='color:red;text-decoration:underline' href='javascript:doWindow_open(\"/workshop/query/show_result.html?result=30010000&P_BATCH_ID="+
                                                 batch_id+"\")'>��־ҳ����Ϣ</a>"); 
                  }
                 
                 grid.search();
              }else{
                  EMsg("��̨�����쳣"); 
              }   
        }  
        loadMarsk.hide();       
}
 
    
//©����ϲ��ɵ�
function mergeDispatchForVul(grid){
   dispatchForVul(grid);
}
function dispatchForVul(grid){
    var selectionModel = grid.getSelectionModel();
    var rows = selectionModel.getSelections();
    if(rows.length < 2){
        EMsg("��ѡ�����������ϼ�¼!");
        return;
    }
    var highIds = [];
    for (var i = 0, row; row = rows[i]; i++){
        var v_system = row.get("ҵ��ϵͳ");
        var v_vul_type = row.get("©������");
        var V_REQUEST_ID = row.get("REQUEST_ID");
        var V_FLAW_STATE = row.get("©��״̬");
        if(typeof(v_system)=='undefined'||v_system==''){
            EMsg("δ�ҵ�ҵ��ϵͳ��ʶ!");
            return;
        }else if(typeof(v_vul_type)=='undefined'||v_vul_type==''){
            EMsg("δ�ҵ�©�����ͱ�ʶ!");
            return;
        }else if(typeof(V_REQUEST_ID)=='undefined'||V_REQUEST_ID==''){
            EMsg("δ�ҵ�REQUEST_ID��ʶ!");
            return;
        }
        if(V_FLAW_STATE!='δ����'){
            EMsg("��ѡ��δ�����©����¼�����ɵ�!");
            return;
        }
        var V_SYSTEM_NAME = rows[0].get("ҵ��ϵͳ");
        var V_VULNERABILITY_TYPE = rows[0].get("©������");
        if(v_system!=V_SYSTEM_NAME){
            EMsg("��ѡ��ͬһҵ��ϵͳ��©�������ɵ�!");
            return;
        }else if(v_vul_type!=V_VULNERABILITY_TYPE){
            EMsg("��ѡ��ͬһ���͵�©�������ɵ�!");
            return;
        }
        highIds[i] = V_REQUEST_ID;
    }
    var obj = choiceStaff(true);
    if(obj){
        var staffIds = obj.id;
	    if(!staffIds){
	        EMsg("��ѡ���ɵ�������!");
	        return;
	    }else 
		  mergeDispatchSavePinUpFlow(highIds.join(","),staffIds,grid);
	}
}

//©����ϵͳ������ά��
function systemHeaderManage(grid){
	var sHref="/workshop/query/show_result.html?result=550000471&formid=550000028121&opentype=2&admin=1";
	var width = screen.availWidth - 10;
    var height = screen.availHeight - 30;
	var sPara='dialogWidth:'+width+';dialogHeight:'+height+';status:no;help:no;resizable:yes';
	var oDialogWin = window.showModalDialog(sHref,null,sPara);
}

//ˢ��
function refresh(grid) {
    grid.search();
}

function OpenForm(url, formname) {
    var width = screen.availWidth - 10;
    var height = screen.availHeight - 30;

    var sFeatures = new Array();
    sFeatures.push("width=" + width);
    sFeatures.push("height=" + height);
    sFeatures.push("top=" + 0);
    sFeatures.push("left=" + 0);
    sFeatures.push("location=" + 0);
    sFeatures.push("menubar=" + 0);
    sFeatures.push("resizable=" + 1);
    sFeatures.push("scrollbars=" + 1);
    sFeatures.push("status=" + 0);
    sFeatures.push("titlebar=" + 0);
    sFeatures.push("toolbar=" + 0);
    window.open(url, formname, sFeatures.join(","));
}

function ShowDialForm(url) {
    window.showModalDialog(url, window, "dialogWidth:780px;dialogHeight:700px;center:yes;help:no;resizable:no;status:no");
}

function OpenOtherForm(requestid) {
    var url = "http://134.64.60.160:85/WH_SPI.prSPI.login.do?userId=ITSM&processInstID=" + requestid;
    OpenForm(url, 'other');
}

function $GetUrlPar() {
    var Url = top.window.location.href;
    var u, g, StrBack = '';
    if (arguments[arguments.length - 1] == "#") {
        u = Url.split("#");
    }
    else {
        u = Url.split("?");
    }
    if (u.length == 1) { g = ''; }
    else { g = u[1]; }

    if (g != '') {
        gg = g.split("&");
        var MaxI = gg.length;
        str = arguments[0] + "=";
        for (i = 0; i < MaxI; i++) {
            if (gg[i].indexOf(str) == 0) {
                StrBack = gg[i].replace(str, "");
                break;
            }
        }
    }
    return StrBack;
}

function getCurrentStaffId() {
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    oXMLHTTP.open("POST", "/servlet/util?OperType=6", false);
    oXMLHTTP.send("");
    if (isSuccess(oXMLHTTP)) {
        return oXMLHTTP.responseXML.selectSingleNode("/root/staff_id").text;
    }
}

function IsInPerArr(staffid, perarr) {
    if (perarr.indexOf(staffid) >= 0) {
        return true;
    }
    else {
        return false;
    }
}

//�Ƿ��ǹ���Ա
//staffid�����������Ա
//tag ��1 ȡ��ǰҳ��URL���� 0 ȡ�ҳ��URL
function isAdminPer(staffid, tag) {
    var admin = "";
    if (tag == "1") {
        var arry = getURLSearch();
        admin = arry['admin'];
    }
    if (tag == "0") {
        admin = $GetUrlPar("admin");
    }
    //alert(admin);
    //var admin = getParentUrlParam().admin;
    //---���������Ա����ָ����Ա
    var currentStaffId = getCurrentStaffId();
    if ((staffid == currentStaffId) || IsInPerArr(currentStaffId, admin)) {
        return true;
    }
    else {
        return false;
    }
}

//���Ա��༭��Ť
//formContext ������
//menuItemId  �˵���ID
function isDisabledBtn(formContext, menuItemId) {
    var result = false;
	for (var item in formContext.TABLE) {
		switch (item.toUpperCase()) {
		  case "AH_GROUP_DATA":   //�������ݱ�
			if (menuItemId == "2013") {
				result = true;
			} else {
				if (menuItemId == "2012") {
					result = false;
				}
			}
			break;
		  case "AH_MBOSS_ANALYSIS":   //ʡ��Ͷ�ߵ��Ĺ�������ITSM����
			if (menuItemId == "2013") {
				result = true;
			} else {
				if (menuItemId == "2012") {
					result = false;
				}
			}
			break;
		  case "AH_FAULT_RECORDS": //���ϼ�¼��
			var datastaffid = formContext.TABLE.AH_FAULT_RECORDS.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "AH_PART_FAULT_RECORDS": //�ֹ�˾���ϼ�¼��
			var datastaffid = formContext.TABLE.AH_PART_FAULT_RECORDS.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "AH_SHIFT_CHANGE": //���Ӱ�򿨼�¼
			var datastaffid = formContext.TABLE.AH_SHIFT_CHANGE.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_NEW_WORK_LOG":
			var datastaffid = formContext.TABLE.CUST_AH_NEW_WORK_LOG.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_MORNING_CHECK":
			var datastaffid = formContext.TABLE.CUST_AH_MORNING_CHECK.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_DISPATCH_LOG":
			var datastaffid = formContext.TABLE.CUST_AH_DISPATCH_LOG.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_LC_MENU":
			var datastaffid = 1;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_MBOSS_JICAI_INFO":
			var datastaffid = formContext.TABLE.CUST_AH_MBOSS_JICAI_INFO.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_JT_CASE_REPORT":
			var datastaffid = formContext.TABLE.CUST_JT_CASE_REPORT.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_JICAI_SHOW":
			var datastaffid = formContext.TABLE.CUST_AH_JICAI_SHOW.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_FR_VIRTUAL_MACHINE":
			var datastaffid = formContext.TABLE.CUST_AH_FR_VIRTUAL_MACHINE.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_FR_PHYSICAL_MACHINE":
			var datastaffid = formContext.TABLE.CUST_AH_FR_PHYSICAL_MACHINE.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_FR_CUNCHU":
			var datastaffid = formContext.TABLE.CUST_AH_FR_CUNCHU.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_EVA_REPORT_FORM":
			var datastaffid = formContext.TABLE.CUST_AH_EVA_REPORT_FORM.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_VERSION_MANAGEMENT":
			var datastaffid = formContext.TABLE.CUST_AH_VERSION_MANAGEMENT.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_DAILY_MANAGE":
			var datastaffid = formContext.TABLE.CUST_AH_DAILY_MANAGE.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_ACCOUNT_PROBLEMS":
			var datastaffid = formContext.TABLE.CUST_AH_ACCOUNT_PROBLEMS.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_SYSTEM_HEADER":
			var datastaffid = formContext.TABLE.CUST_AH_SYSTEM_HEADER.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_SAVE_VULNERABILITY"://��ȫ©�������
			var datastaffid = formContext.TABLE.CUST_AH_SAVE_VULNERABILITY.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_SERVICE_HOTLINE_ANSWER"://���߽�����¼����
			var datastaffid = formContext.TABLE.CUST_AH_SERVICE_HOTLINE_ANSWER.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		}
	}
	return result;
}

function tip(value,p,record){
	return "<div ext:qtip='<div style=\"font-size:10pt;padding:3;\">"+value+"</div>' ext:qtitle='��ϸ��Ϣ��'>"+value+"</div>";	
}

function checkHasCryptoJS() {
	if(typeof CryptoJS === "undefined" ||
		(typeof window.CryptoJS !== "undefined" && typeof CryptoJS.enc === "undefined")) {
		$import("../../resource/js/encode/aes.js", "Common.js");
		$import("../../resource/js/encode/mode-ecb.js", "Common.js");
	}
}
