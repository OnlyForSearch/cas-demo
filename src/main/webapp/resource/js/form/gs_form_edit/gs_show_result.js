//begin--add:g.huangxm time:2010-10-27
//甘肃基本数据增删改页面

//参数说明
//页面url：show_result.html?result=''formid=''opentype=''admin=''
//result：查询语句ID 
//formid：表单ID
//opentype：打开窗体的方式 0 open   1 showDial
//admin：管理员STAFFID 用,分开　
//例：workshop/query/show_result.html?result=999990125&formid=550000000163&opentype=0&admin=1,361,1161,1158,1397,362

//表单数据表具有字段说明
//1、REQUEST_ID　　　　　表单唯一请求ID
//2、RECORD_PEOPLE_ID　　记录添加人员ID

var callbackFn;      //回调
var result = "";     //查询语句ID
var formid = "";     //表单ID
var opentype = "";   //打开窗体的方式
var arry;            //参数列表
var loadMarsk = new Ext.LoadMask(document.body, {  
     msg     : '正在批量派单中，请稍候。。。。。。'
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
        alert("表单ID不能为空！");
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
            var v_serial= row.get("派单工单号");
            if(v_serial){
               MMsg("该漏洞已派单，无法修改!");
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
            MMsg("请选择一项！");
            return;
        }

    } else {
        alert("表单ID不能为空！");
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
        alert("表单ID不能为空！");
    }
}

//删除数据
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
              EMsg("只能单条删除记录!");
              return;
        }
        var row = grid.getSelectionModel().getSelected();
        if (row) {
            var v_serial= row.get("派单工单号");
            if(v_serial){
               EMsg("该漏洞已派单，无法删除!");
               return;
            }
            if (isAdminPer(row.get("RECORD_PEOPLE_ID"),"1")) {
                if (QMsg("确认删除所选择记录？") == MSG_YES) {
                    var sRequestId = row.get("REQUEST_ID");
                    var delByClassIdUrl = "/servlet/AhFlowManagerServlet?tag=15&formId=" + formid + "&requestId=" + sRequestId;
                    xmlhttp.Open("POST", delByClassIdUrl, false);
                    xmlhttp.send();
                    if (isSuccess(xmlhttp)) {
                        MMsg("删除成功！");
                        grid.search();
                    }
                }
            }
            else {
                alert("您没有删除权限！");
            }
        } else {
            MMsg("请选择一项！");
            return;
        }
    } else {
        alert("表单ID不能为空！");
    }
}

//删除数据(版本)
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
                if (QMsg("确认删除所选择记录？") == MSG_YES) {
                    var sRequestId = row.get("REQUEST_ID");
                    var sqltmp = "select count(*) from CUST_AH_IT_FUNC_VER_RELA a,CUST_AH_FUNCTION b,CUST_AH_IT_DEMAND c where a.STATE='0SA' AND A.MAIN_REQUEST_ID = C.REQUEST_ID AND A.SECOND_REQUEST_ID = B.REQUEST_ID AND C.STATE in ('0','1') and to_char(a.SUB_REQUEST_ID)="+sRequestId;
				    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				    xmlhttp.Open("POST", "/servlet/@Deprecated/ExecServlet?action=101&paramValue=" + getAESEncode(encodeURIComponent(sqltmp)), false);
				    xmlhttp.send();
				    if(isSuccess(xmlhttp)) {
				        var dataArr = xmlhttp.responseXML.getElementsByTagName("rowSet");
				        var v_count = dataArr[0].attributes[0].value;
				        if(v_count>0){
				        	MMsg("该版本已关联功能点，不能删除！");
				        	return;
				        }else{
				        	var delByClassIdUrl = "/servlet/AhFlowManagerServlet?tag=15&formId=" + formid + "&requestId=" + sRequestId;
                    		xmlhttp.Open("POST", delByClassIdUrl, false);
                    		xmlhttp.send();
                    		if (isSuccess(xmlhttp)) {
                        		MMsg("删除成功！");
                        		grid.search();
                   			}
				        }
				    }
                }
            }else {
                MMsg("您没有删除权限！");
                return;
            }
        } else {
            MMsg("请选择一项！");
            return;
        }
    } else {
        MMsg("表单ID不能为空！");
        return;
    }
}

//导入漏洞库
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

//漏洞库单条派单
function singleDispatchForVul(grid){
   var selectionModel = grid.getSelectionModel();
    var rows = selectionModel.getSelections();
    if(rows.length < 1){
        EMsg("请选择一条记录!");
        return;
    }
    if(rows.length > 1){
        EMsg("请选择单条记录!");
        return;
    }
    var row = rows[0];
    var v_system = row.get("业务系统");
    var v_vul_type = row.get("漏洞类型");
    var V_REQUEST_ID = row.get("REQUEST_ID");
    var V_FLAW_STATE = row.get("漏洞状态");
    if(typeof(v_system)=='undefined'||v_system==''){
        EMsg("未找到业务系统标识!");
        return;
    }else if(typeof(v_vul_type)=='undefined'||v_vul_type==''){
        EMsg("未找到漏洞类型标识!");
        return;
    }else if(typeof(V_REQUEST_ID)=='undefined'||V_REQUEST_ID==''){
        EMsg("未找到REQUEST_ID标识!");
        return;
    }
    if(V_FLAW_STATE!='未处理'){
        EMsg("请选择未处理的漏洞记录进行派单!");
        return;
    }
    var obj = choiceStaff(true);
    if(obj){
      var staffIds = obj.id;
      if(!staffIds){
        EMsg("请选择派单处理人!");
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
           MMsg("派单成功"); 
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
                     MMsg("批量派单成功"); 
                  }else{
                     Ext.MessageBox.alert('系统提示',"批量派单,成功"+sucess_num+"个,失败"+fail_num+"个,详情请看<a style='color:red;text-decoration:underline' href='javascript:doWindow_open(\"/workshop/query/show_result.html?result=30010000&P_BATCH_ID="+
                                                 batch_id+"\")'>日志页面信息</a>"); 
                  }
                 
                 grid.search();
              }else{
                  EMsg("后台程序异常"); 
              }   
        }  
        loadMarsk.hide();       
}
 
    
//漏洞库合并派单
function mergeDispatchForVul(grid){
   dispatchForVul(grid);
}
function dispatchForVul(grid){
    var selectionModel = grid.getSelectionModel();
    var rows = selectionModel.getSelections();
    if(rows.length < 2){
        EMsg("请选择两条或以上记录!");
        return;
    }
    var highIds = [];
    for (var i = 0, row; row = rows[i]; i++){
        var v_system = row.get("业务系统");
        var v_vul_type = row.get("漏洞类型");
        var V_REQUEST_ID = row.get("REQUEST_ID");
        var V_FLAW_STATE = row.get("漏洞状态");
        if(typeof(v_system)=='undefined'||v_system==''){
            EMsg("未找到业务系统标识!");
            return;
        }else if(typeof(v_vul_type)=='undefined'||v_vul_type==''){
            EMsg("未找到漏洞类型标识!");
            return;
        }else if(typeof(V_REQUEST_ID)=='undefined'||V_REQUEST_ID==''){
            EMsg("未找到REQUEST_ID标识!");
            return;
        }
        if(V_FLAW_STATE!='未处理'){
            EMsg("请选择未处理的漏洞记录进行派单!");
            return;
        }
        var V_SYSTEM_NAME = rows[0].get("业务系统");
        var V_VULNERABILITY_TYPE = rows[0].get("漏洞类型");
        if(v_system!=V_SYSTEM_NAME){
            EMsg("请选择同一业务系统的漏洞进行派单!");
            return;
        }else if(v_vul_type!=V_VULNERABILITY_TYPE){
            EMsg("请选择同一类型的漏洞进行派单!");
            return;
        }
        highIds[i] = V_REQUEST_ID;
    }
    var obj = choiceStaff(true);
    if(obj){
        var staffIds = obj.id;
	    if(!staffIds){
	        EMsg("请选择派单处理人!");
	        return;
	    }else 
		  mergeDispatchSavePinUpFlow(highIds.join(","),staffIds,grid);
	}
}

//漏洞库系统负责人维护
function systemHeaderManage(grid){
	var sHref="/workshop/query/show_result.html?result=550000471&formid=550000028121&opentype=2&admin=1";
	var width = screen.availWidth - 10;
    var height = screen.availHeight - 30;
	var sPara='dialogWidth:'+width+';dialogHeight:'+height+';status:no;help:no;resizable:yes';
	var oDialogWin = window.showModalDialog(sHref,null,sPara);
}

//刷新
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

//是否是管理员
//staffid：数据添加人员
//tag ：1 取当前页的URL参数 0 取最父页的URL
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
    //---数据添加人员或者指定人员
    var currentStaffId = getCurrentStaffId();
    if ((staffid == currentStaffId) || IsInPerArr(currentStaffId, admin)) {
        return true;
    }
    else {
        return false;
    }
}

//灰显表单编辑按扭
//formContext 表单对象
//menuItemId  菜单项ID
function isDisabledBtn(formContext, menuItemId) {
    var result = false;
	for (var item in formContext.TABLE) {
		switch (item.toUpperCase()) {
		  case "AH_GROUP_DATA":   //保障数据表
			if (menuItemId == "2013") {
				result = true;
			} else {
				if (menuItemId == "2012") {
					result = false;
				}
			}
			break;
		  case "AH_MBOSS_ANALYSIS":   //省级投诉单的工单分析ITSM需求
			if (menuItemId == "2013") {
				result = true;
			} else {
				if (menuItemId == "2012") {
					result = false;
				}
			}
			break;
		  case "AH_FAULT_RECORDS": //故障记录表
			var datastaffid = formContext.TABLE.AH_FAULT_RECORDS.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "AH_PART_FAULT_RECORDS": //分公司故障记录表
			var datastaffid = formContext.TABLE.AH_PART_FAULT_RECORDS.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "AH_SHIFT_CHANGE": //交接班打卡记录
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
		  case "CUST_AH_SAVE_VULNERABILITY"://安全漏洞库表单表
			var datastaffid = formContext.TABLE.CUST_AH_SAVE_VULNERABILITY.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
		  case "CUST_AH_SERVICE_HOTLINE_ANSWER"://热线接听记录表单表
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
	return "<div ext:qtip='<div style=\"font-size:10pt;padding:3;\">"+value+"</div>' ext:qtitle='详细信息：'>"+value+"</div>";	
}

function checkHasCryptoJS() {
	if(typeof CryptoJS === "undefined" ||
		(typeof window.CryptoJS !== "undefined" && typeof CryptoJS.enc === "undefined")) {
		$import("../../resource/js/encode/aes.js", "Common.js");
		$import("../../resource/js/encode/mode-ecb.js", "Common.js");
	}
}
