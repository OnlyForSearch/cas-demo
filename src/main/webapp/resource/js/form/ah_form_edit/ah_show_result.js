//begin--add:g.huangxm time:2010-10-27
//安徽基本数据增删改页面

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

var v_line;
var callbackFn;      //回调
var result = "";     //查询语句ID
var formid = "";     //表单ID
var opentype = "";   //打开窗体的方式
var arry;            //参数列表

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
                OpenForm(url, 'DataAdd'+parseInt(1000*Math.random()));
                break;
            case "1":
                var url = "/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formid + "&admin=" + admin;
                window.showModalDialog(url, window, "dialogWidth:780px;dialogHeight:700px;center:yes;help:no;resizable:no;status:no");
                break;
            case "2":
                var url = "/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formid + "&admin=" + admin;
                window.showModalDialog(url, window, "status:no;help:no;resizable:no");
                break;
        }
    } else {
        MMsg("表单ID不能为空！");
        return;
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
                OpenForm(url, 'DataAdd'+parseInt(1000*Math.random()));
                break;
            case "1":
                var url = "/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formid + "&admin=" + admin + "&id=" + id;
                window.showModalDialog(url, window, "dialogWidth:780px;dialogHeight:700px;center:yes;help:no;resizable:no;status:no");
                break;
        	case "2":
	        	var url = "/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formid + "&admin=" + admin + "&id=" + id;
	            window.showModalDialog(url, window, "status:no;help:no;resizable:no");
	            break;
	    	case "3":
	        	var url = "/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formid + "&admin=" + admin + "&id=" + id;
	            window.showModalDialog(url, window, "status:no;help:no;resizable:no");
	            window.parent.getSumValue();
	            break;
        }
    } else {
        MMsg("表单ID不能为空！");
        return;
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
	                window.showModalDialog(url, window, "status:no;help:no;resizable:no");
	                break;
	        	case "3":
	                var url = "/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formid + "&requestId=" + row.get("REQUEST_ID") + "&admin=" + admin;
	                window.showModalDialog(url, window, "status:no;help:no;resizable:no");
	                window.parent.getSumValue();
	                break;
            }
        }
        else {
            MMsg("请选择一项！");
            return;
        }

    } else {
        MMsg("表单ID不能为空！");
        return;
    }
}

function AhDataModifyForAudit(grid) {
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
            var V_AUDIT_STATE = row.get("AUDIT_STATE");
            if(V_AUDIT_STATE=='1'){
            	MMsg("该记录已被审核过，不能修改！");
            	return;
            }else{
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
		                window.showModalDialog(url, window, "status:no;help:no;resizable:no");
		                break;
		        	case "3":
		                var url = "/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formid + "&requestId=" + row.get("REQUEST_ID") + "&admin=" + admin;
		                window.showModalDialog(url, window, "status:no;help:no;resizable:no");
		                window.parent.getSumValue();
		                break;
	            }
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

//删除数据
function DataDel(grid) {
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

function DataDelForAudit(grid) {
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
                	var V_AUDIT_STATE = row.get("AUDIT_STATE");
			        if(V_AUDIT_STATE=='1'){
			            MMsg("该记录已被审核过，不能删除！");
			            return;
			      	}else{
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

//删除数据(项目计划)
function DataDelForProPlan(grid) {
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
                    var sTaskCode = row.get("TASK_CODE");
                    var sProjectID = row.get("PROJECT_ID");
                    var sqltmp = "select count(a.request_id) from REPORT_WORK_INFO a where a.markasdeleted='0' and a.project_id='"+sProjectID+"' and a.task_code='"+sTaskCode+"'";
				    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				    xmlhttp.Open("POST", "/servlet/@Deprecated/ExecServlet?action=101&paramValue=" + getAESEncode(encodeURIComponent(sqltmp)), false);
				    xmlhttp.send();
				    if(isSuccess(xmlhttp)) {
				        var dataArr = xmlhttp.responseXML.getElementsByTagName("rowSet");
				        var v_count = dataArr[0].attributes[0].value;
				        if(v_count>0){
				        	MMsg("该任务已有报工数据，不能删除！");
				        	return;
				        }else{
				        	sqltmp = "select count(*) from PROJECT_PLAN_MANAGE where MARKASDELETED='0' and PROJECT_ID='"+sProjectID+"' and PARENT_TASK_CODE='"+sTaskCode+"'";
				        	xmlhttp.Open("POST", "/servlet/@Deprecated/ExecServlet?action=101&paramValue=" + getAESEncode(encodeURIComponent(sqltmp)), false);
				    		xmlhttp.send();
				        	if(isSuccess(xmlhttp)) {
				        		var dataArr = xmlhttp.responseXML.getElementsByTagName("rowSet");
				        		var v_count = dataArr[0].attributes[0].value;
				        		if(v_count>0){
						        	MMsg("该任务还有子任务，不能删除！");
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

//数据审核
function DataAudit(grid) {
    arry = getURLSearch();
    formid = arry['formid'];
    if (formid != 'undefined' && formid != "") {
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        var selectionModel = grid.getSelectionModel();
		var rows = selectionModel.getSelections();
		if(rows.length < 1){
			EMsg("请至少选择一项!");
			return;
		}
		var requestIDArray = [];
		for (var i = 0, row; row = rows[i]; i++){
			var V_REQUEST_ID = row.get("REQUEST_ID");
			if(typeof(V_REQUEST_ID)=='undefined'||V_REQUEST_ID==''){
				EMsg("未找到REQUEST_ID标识!");
				return;
			}
	    	requestIDArray[i] = V_REQUEST_ID;
		}
		if (QMsg("确认审核所选择记录？") == MSG_YES) {
        	var delByClassIdUrl = "/servlet/AhFlowManagerServlet?tag=16&formId=" + formid + "&requestId=" + requestIDArray.join(',');
            xmlhttp.Open("POST", delByClassIdUrl, false);
            xmlhttp.send();
            if (isSuccess(xmlhttp)) {
            	MMsg("审核成功！");
               	grid.search();
        	}
    	}
    } else {
        MMsg("表单ID不能为空！");
        return;
    }
}

function dataAddForID_4budget(grid) {
    arry = getURLSearch();
    formid = arry['formid'];
    opentype = arry['opentype'];
    admin = arry['admin'];
    id = arry['id'];
    v_line = arry['v_line'];
    if (!grid || (typeof grid.getSelectionModel != 'function')) {
        grid = this;
    }
    callbackFn = refresh.callback([grid]);
    if (formid != undefined && formid != "" && opentype != undefined && opentype != "") {
        switch (opentype) {
            case "0":
                var url = "/workshop/form/index.jsp?callback=window.opener.callbackFn()&formId=" + formid + "&admin=" + admin + "&id=" + id + "&v_line=" + v_line ;
                OpenForm(url, 'DataAdd'+parseInt(1000*Math.random()));
                break;
            case "1":
                var url = "/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formid + "&admin=" + admin + "&id=" + id + "&v_line=" + v_line ;
                window.showModalDialog(url, window, "dialogWidth:780px;dialogHeight:700px;center:yes;help:no;resizable:no;status:no");
                break;
        }
    } else {
        MMsg("表单ID不能为空！");
        return;
    }
}

function AhDataModify_4budget(grid) {
    arry = getURLSearch();
    formid = arry['formid'];
    opentype = arry['opentype'];
    admin = arry['admin'];
    v_line = arry['v_line'];
    if (!grid || (typeof grid.getSelectionModel != 'function')) {
        grid = this;
    }
    callbackFn = refresh.callback([grid]);
    var row = grid.getSelectionModel().getSelected();
    if (formid != undefined && formid != "" && opentype != undefined && opentype != "") {
        if (row) {
            switch (opentype) {
                case "0":
                    var url = "/workshop/form/index.jsp?callback=window.opener.callbackFn()&formId=" + formid + "&requestId=" + row.get("REQUEST_ID") + "&admin=" + admin + "&v_line=" + v_line ;
                    OpenForm(url, 'DataModify'+parseInt(1000*Math.random()));
                    break;
                case "1":
                    var url = "/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formid + "&requestId=" + row.get("REQUEST_ID") + "&admin=" + admin + "&v_line=" + v_line ;
                    window.showModalDialog(url, window, "dialogWidth:780px;dialogHeight:700px;center:yes;help:no;resizable:no;status:no");
                    break;
                case "2":
	                var url = "/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formid + "&requestId=" + row.get("REQUEST_ID") + "&admin=" + admin + "&v_line=" + v_line ;
	                window.showModalDialog(url, window, "status:no;help:no;resizable:no");
	                break;
            }
        }
        else {
            MMsg("请选择一项！");
            return;
        }

    } else {
        MMsg("表单ID不能为空！");
        return;
    }
}

//删除数据
function DataDel_4information(grid) {
    arry = getURLSearch();
    formid = arry['formid'];
    if (formid != 'undefined' && formid != "") {
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        if (!grid || (typeof grid.getSelectionModel != 'function')) {
            grid = this;
        }
        var row = grid.getSelectionModel().getSelected();
        if (row) {
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
        } else {
            MMsg("请选择一项！");
            return;
        }
    } else {
        MMsg("表单ID不能为空！");
        return;
    }
}

function companyInformationExcelImport(){
	var sHref="/workshop/info_manage/company_information_excel_import.html";
	var sPara='dialogwidth:449px;dialogheight:80px;status:no;help:no;resizable:yes';
	var oDialogWin = window.showModalDialog(sHref,null,sPara);
	if(oDialogWin=='OK'){
		grid.search();
	}
}

//导入EXCEL表数据
function importExcel(){
	arry = getURLSearch();
  	var FLOW_ID = arry['id'];
  	var RESULT = arry['result'];
		var sHref = "/workshop/form/ahFormFile/ah_excelToDB.html?TAG=218"
			  			+ "&RESULT="+RESULT
              + "&FLOW_ID="+FLOW_ID;
    var sPara = 'dialogwidth:410px;dialogheight:80px;status:no;help:no;resizable:yes';
    var objPara = {};
    var oDialogWin = window.showModalDialog(sHref, objPara, sPara);
    Global.grid.search();
}

//导入漏洞库
function importSaveVulnerabilityData(grid){
	var sHref="/workshop/form/ahFormFile/cust_ah_save_vulnerability_excelImport.html";
	var sPara='dialogwidth:449px;dialogheight:80px;status:no;help:no;resizable:yes';
	var oDialogWin = window.showModalDialog(sHref,window,sPara);
	grid.search();
}

//漏洞库单条派单
function singleDispatchForVul(grid){
	var selectionModel = grid.getSelectionModel();
	var rows = selectionModel.getSelections();
	if(rows.length < 1){
		EMsg("请至少选择一条记录!");
		return;
	}
	var highIds = [];
	for (var i = 0, row; row = rows[i]; i++){
		var v_system = row.get("业务系统");
		var v_vul_type = row.get("漏洞类型");
		var V_REQUEST_ID = row.get("REQUEST_ID");
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
	var sHref="/workshop/form/ahFormFile/cust_ah_save_vulnerability_dispatch.html";
	var width = screen.availWidth - 10;
    var height = screen.availHeight - 30;
	var sPara='dialogWidth:'+width+';dialogHeight:'+height+';status:no;help:no;resizable:yes';
	var param = new Object();
	param.tag = 1;
	param.request_ids = highIds.join(',');
	var oDialogWin = window.showModalDialog(sHref,param,sPara);
	grid.search();
}

//漏洞库合并派单
function mergeDispatchForVul(grid){
	var sHref="/workshop/form/ahFormFile/cust_ah_save_vulnerability_dispatch.html";
	var width = screen.availWidth - 10;
    var height = screen.availHeight - 30;
	var sPara='dialogWidth:'+width+';dialogHeight:'+height+';status:no;help:no;resizable:yes';
	var param = new Object();
	param.tag = 2;
	var oDialogWin = window.showModalDialog(sHref,param,sPara);
	grid.search();
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
    
    //权限判断改到java中 
    /* 
     *var currentStaffId = getCurrentStaffId();
    if ((staffid == currentStaffId) || IsInPerArr(currentStaffId, admin)) {
        return true;
    }
    else {
        return false;
    }*/
    
    
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    var delByClassIdUrl = "/servlet/AhFlowManagerServlet?tag=199&staffid=" + staffid + "&admin=" + admin;
    xmlhttp.Open("get", delByClassIdUrl, false);
    xmlhttp.send();
    if(xmlhttp.status == 200){
        if(xmlhttp.responseText == "true"){
        	return true;
        }
    }
    return false;
    
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
			case "MAINTENANCE_MANAGE"://维护类
			var datastaffid = formContext.TABLE.MAINTENANCE_MANAGE.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "MAINTENANCE_MANAGE_TWO"://维护类
			var datastaffid = formContext.TABLE.MAINTENANCE_MANAGE_TWO.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "MAINTENANCE_MANAGE_MAIN"://维护类
			var datastaffid = formContext.TABLE.MAINTENANCE_MANAGE_MAIN.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "CUST_AH_ACCOUNT_STAFF"://维护类
			var datastaffid = formContext.TABLE.CUST_AH_ACCOUNT_STAFF.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "CUST_AH_ROLE_POWER"://维护类
			var datastaffid = formContext.TABLE.CUST_AH_ROLE_POWER.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "CUST_AH_PACKAGE_INFO"://套餐信息
			var datastaffid = formContext.TABLE.CUST_AH_PACKAGE_INFO.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "CUST_AH_BUTIE_INFO"://补贴信息
			var datastaffid = formContext.TABLE.CUST_AH_BUTIE_INFO.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "PROJECT_GROUP_MANAGEMENT"://组定义
			var datastaffid = formContext.TABLE.PROJECT_GROUP_MANAGEMENT.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "COMPANY_STAKEHOLDERS_LIBRARY"://厂商干系人
			var datastaffid = formContext.TABLE.COMPANY_STAKEHOLDERS_LIBRARY.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "PROJECT_STAKEHOLDER_MANAGE"://项目干系人
			var datastaffid = formContext.TABLE.PROJECT_STAKEHOLDER_MANAGE.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "PROJECT_PLAN_MANAGE"://项目计划
			var datastaffid = formContext.TABLE.PROJECT_PLAN_MANAGE.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "PROJECT_TASK_INFO"://任务细项
			var datastaffid = formContext.TABLE.PROJECT_TASK_INFO.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "REPORT_WORK_INFO"://报工信息
			var datastaffid = formContext.TABLE.REPORT_WORK_INFO.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "CUST_AH_REQUEST_BUDGET"://需求预算控制
			var datastaffid = formContext.TABLE.CUST_AH_REQUEST_BUDGET.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "CUST_AH_REQUEST_BUDGET_TWO"://需求预算控制
			var datastaffid = formContext.TABLE.CUST_AH_REQUEST_BUDGET_TWO.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "CUST_AH_PRO_BUDGET_INFO"://项目预算申请详情
			var datastaffid = formContext.TABLE.CUST_AH_PRO_BUDGET_INFO.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "CUST_AH_PROJECT_LIST"://项目列表
			var datastaffid = formContext.TABLE.CUST_AH_PROJECT_LIST.RECORD_PEOPLE_ID.DEFAULT_VALUE;
			var isHavePerTmp = false;
			isHavePerTmp = isAdminPer(datastaffid, "0");
			if (isHavePerTmp) {
				result = false;
			} else {
				result = true;
			}
			break;
			case "CUST_AH_ISSU_RELA_IT_DEMAND":
			var datastaffid = formContext.TABLE.CUST_AH_ISSU_RELA_IT_DEMAND.RECORD_PEOPLE_ID.DEFAULT_VALUE;
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
