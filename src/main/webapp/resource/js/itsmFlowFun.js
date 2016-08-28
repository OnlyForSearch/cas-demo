
//单击流程单号或标题
function showAllInfo(flow_id,flow_mod)
{
	var sFeatures = "location=0,menubar=0,resizable=1,scrollbars=1,status=0,titlebar=0,toolbar=0";
	window.open('/workshop/form/index.jsp?fullscreen=yes&flowId='+flow_id+'&flowMod='+flow_mod, flow_id ,sFeatures);
}

//通用流程右键菜单函数-表单信息
function showFormInfo(grid)
	{
		var row = grid.getSelectionModel().getSelected();
		if(row)
		{
			var flow_id = row.get("FLOW_ID");
			//var sql = "SELECT MAX(TCH_ID) MAXTACHE FROM V_TACHE WHERE FLOW_ID = " + flow_id;
			//var tchId = getValueBySql(sql);
			var sFeatures = "location=0,menubar=0,resizable=1,scrollbars=1,status=0,titlebar=0,toolbar=0";
			//window.open('/workshop/form/index.jsp?fullscreen=yes&tchId='+tchId,null,sFeatures);
			window.open('/workshop/form/index.jsp?fullscreen=yes&flowId='+flow_id,null,sFeatures);
		}
	}

//通用流程右键菜单函数-处理过程
	function dealProcess(grid)
	{
		var row = grid.getSelectionModel().getSelected();
		if(row)
		{
			var flow_id = row.get("FLOW_ID");
			var sFeatures = "location=0,menubar=0,resizable=1,scrollbars=1,status=0,titlebar=0,toolbar=0";
			window.open('/FlowBrowse?flow_id='+flow_id,null,sFeatures);
		}
	}

//非通用流程右键菜单函数-表单信息
function nmShowFormInfo(grid)
{
	var row = grid.getSelectionModel().getSelected();
		if(row)
		{
			var flowId = row.get("FLOW_ID");
			//var tchId = row.get("TCH_ID");
			//if (tchId == 0)
			//{
			//	tchId = getTchIdByFlowId(flowId);
			//}
			window.open("/workshop/form/index.jsp?fullscreen=yes&flowId=" + flowId);
		}
}

//非通用流程右键菜单函数-任务处理过程
function nmShowDealProcess(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
	  var flowId = row.get("FLOW_ID");
		var tchMod = row.get("TCH_MOD");
		window.open("/FlowBrowse?dealFlag=0&flag=1&flow_id=" + flowId + "&tchMod=" + tchMod);
	}
}
//非通用流程右键菜单函数-短信催办
function hurryBySms(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
	  	var flowId = row.get("FLOW_ID");
		var tchId = row.get("TCH_ID");
		var staffIds = row.get("TACHE_PERSON_ID");
		var state = row.get("STATE");
		var actionType = '2';
		var remarks = "FLOW_LIST_MSG";
		var notifyType = "1";
		
    	if(state =='F')
    	{
    		alert("工单已竣工");
    	}
  		else if(state =='P')
  		{
  			alert("工单已撤消");
		}
		else
		{
			
			notify(notifyType,flowId,staffIds,tchId, actionType, remarks);
			alert ("催办成功");
		}
	}
}

//非通用流程右键菜单函数-邮件催办
function hurryByEmail(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
	  	var flowId = row.get("FLOW_ID");
		var tchId = row.get("TCH_ID");
		var staffIds = row.get("TACHE_PERSON_ID");
		var state = row.get("STATE");
		var actionType = '2';
		var remarks = "FLOW_LIST_MAIL";
		var notifyType = "2";		
    	if(state =='F')
    	{
    		alert("工单已竣工");
    	}
  		else if(state =='P')
  		{
  			alert("工单已撤消");
		}
		else
		{
			notify(notifyType,flowId,staffIds,tchId, actionType, remarks);
			alert ("催办成功");	
		}
	}
}

//非通用流程右键菜单函数-短信邮件催办
function hurryBySmsEmail(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
	  	var flowId = row.get("FLOW_ID");
		var tchId = row.get("TCH_ID");
		var staffIds = row.get("TACHE_PERSON_ID");
		var state = row.get("STATE");
		var actionType = '2';
		var remarks = "FLOW_LIST_MSG_MAIL";
		var notifyType = "3";		
    	if(state =='F')
    	{
    		alert("工单已竣工");
    	}
  		else if(state =='P')
  		{
  			alert("工单已撤消");
		}
		else
		{
			notify(notifyType,flowId,staffIds,tchId, actionType, remarks);
			alert ("催办成功");	
		}
	}
}

// 短信邮件通知通用方法(notifyType为通知类型：1为短信催办，2为邮件催办，3为短信邮件同时催办，4为发起人修改功能通知下一环节处理人)---wangjian
function notify(notifyType, flowId, staffIds, tacheId, actionType, remarks) {
	if (actionType == null)
		actionType = "0"
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	try {
		oXMLHTTP.open('get', '../../FlowQry?FLOW_TASK=NotifyCustService&flowId='
						+ flowId + '&staffIds=' + staffIds + '&notifyType='
						+ notifyType + '&tacheId=' + tacheId + '&actionType='
						+ actionType +'&remark='+remarks, true);
		oXMLHTTP.send();
	} catch (e) {
		alert("异步调用失败！");
	}
}

//自定义短信催办
function customSms(grid){
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
		var flowId = row.get("FLOW_ID");
		var staffIds = row.get("TACHE_PERSON_ID");
		var params={
				flowId:flowId,
				staffIds:staffIds,
				tchId:""
		};
		window.showModalDialog("/workshop/form/formFile/customsms.jsp",params,"dialogWidth=40;dialogHeight=21;help=0;scroll=0;s tatus=0;");
	}
}

function getTchIdByFlowId(flow_id){
	var tchId;
	var sql = "SELECT MAX(TCH_ID) TCH_ID FROM TACHE WHERE FLOW_ID IN (SELECT SUB_FLOW_ID FROM TACHE WHERE FLOW_ID = " + flow_id + ") OR FLOW_ID = " + flow_id;
	var sqlResult = getValueBySql(sql);
	if (sqlResult != "" && sqlResult != null)
	{
		tchId = sqlResult;
	}else{
		tchId = 0;
	}
	return tchId;
}

function getValueBySql(sql)
{
	var rsValue = "";
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
  oXMLHTTP.open("POST","/servlet/@Deprecated/ExecServlet?action=101&paramValue="+getAESEncode(encodeURIComponent(sql)),false);
  oXMLHTTP.send("");
  if(isSuccess(oXMLHTTP))
  {
  	var oRow = oXMLHTTP.responseXML.selectSingleNode("/root/rowSet");
		rsValue = oRow.attributes[0].value;
  }
  return rsValue;
}

function doHang(){
	parent.fraForm.doHangUp();
}
function showForm(grid)
{
    var row = grid.getSelectionModel().getSelected();
    
    if(typeof(row)=='undefined'){
        return;
    }
    var flow_id = row.get("FLOW_ID");
    if(typeof(flow_id)=='undefined'||flow_id==""){
        alert("没有找到流程ID!");
        return;
    }
    var x=(window.screen.width-780)/2;
    var y=(window.screen.height-560)/2;    
    var url = "/workshop/form/jtitsmFormFile/placing_executeInfo.jsp?flow_id="+flow_id;
    
    curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
}
//集团ITSM短信提醒
function custHurryBySms(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
	  	var flowId = row.get("FLOW_ID");
		var actionType = '1';
		var notifyType = "1";
		if(confirm("是否要向 "+getStaffNames(flowId)+" 发送短信催办？")){
			notifyUser(notifyType,flowId,actionType);
			alert ("催办成功");	
		}
	}
}

//非通用流程右键菜单函数-邮件催办
function custHurryByEmail(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
	  	var flowId = row.get("FLOW_ID");
		var actionType = '1';
		var notifyType = "2";		
    	if(confirm("是否要向 "+getStaffNames(flowId)+" 发送邮件催办？")){
			notifyUser(notifyType,flowId,actionType);
    		alert ("催办成功");
		}
	}
}

//非通用流程右键菜单函数-短信邮件催办
function custHurryBySmsEmail(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
	  	var flowId = row.get("FLOW_ID");
		var actionType = '1';
		var notifyType = "3";		
    	if(confirm("是否要向 "+getStaffNames(flowId)+" 发送短信及邮件催办？")){
			notifyUser(notifyType,flowId,actionType);
			alert ("催办成功");
		}	
	}
}
function notifyUser(notifyType,flowId,actionType){
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	try {
		oXMLHTTP.open('get',"/servlet/customSms?action="+actionType+"&notifyType="+notifyType+"&flowId="+flowId, true);
		oXMLHTTP.send();
	} catch (e) {
		alert("异步调用失败！");
	}
}

function getStaffNames(flowId){
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open('get',"/servlet/customSms?action=3&flowId="+flowId, false);
	oXMLHTTP.send();
	if(isSuccess(oXMLHTTP)){
		if (oXMLHTTP.responseXML.selectSingleNode("/root/STAFF_NAMES").text != ""){
            return oXMLHTTP.responseXML.selectSingleNode("/root/STAFF_NAMES").text;
        }
	}
	return '';
}

/**
 * 发送催办按钮置灰设置条件
 * @param {} grid
 * @return {String}
 */
function setItemDisabled(){
	var row = Global.gridPanel.getSelectionModel().getSelected();
	if(row)
	{
		var state = row.get("FLOW_STATE");	
    	if(state =='F' || state =='P')//竣工或注销
    	{
    		return '0';
    	}
    	return '1';
	}
}

//发送短信邮件催办 add by tangft 2013.10.20
function hurryBySmsEmail(notifyType,oForm){
	var flowId = oForm.FLOW.TOP_FLOW_ID;
	var msg = "短信及邮件";
	if(notifyType==1){
		msg = "短信";
	}else if(notifyType==2){
		msg = "邮件";
	}
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	try {
		var staffs = getHurryStaffsInfo(flowId);
		if(!staffs || staffs == "" || staffs == null || staffs == "null"){
			alert("当前办理人不符合催办条件，不能发送催办！");
			return;
		}
		if(confirm("是否要向 "+staffs+" 发送"+msg+"催办？")){
			oXMLHTTP.Open("POST","/servlet/flowOper?OperType=21&notifyType="+notifyType+"&flowId="+flowId,false);
			oXMLHTTP.send();
			if(isSuccess(oXMLHTTP)){
				alert ("催办成功");
			}else{
				alert ("催办失败");
			}
		}	
	} catch (e) {
		alert("异步调用失败！");
	}
}

function addStaff(grid){
	var retVal = window.showModalDialog("/workshop/user/staffInfo_lte.jsp?staffId=",window,"dialogWidth=700px;dialogHeight=260px;scroll=0;status=0;");
	if(retVal){
		grid.search();
	}
}
//添加，修改员工 type=1 添加，type=2 修改 add by tangft 2014.2.27
function modifyStaff(grid){
	var staffId = "";
	var row = grid.getSelectionModel().getSelected();
	if(row){
		staffId = row.get("STAFF_ID");
	}else{
		alert("请选择需要修改的员工！");
		return;
	}
	var retVal = window.showModalDialog("/workshop/user/staffInfo_lte.jsp?staffId="+staffId,window,"dialogWidth=700px;dialogHeight=260px;scroll=0;status=0;");
	if(retVal){
		grid.search();
	}
}

//注销员工 add by tangft 2014.2.27
function delStaff(grid){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var httpUrl = "../../servlet/staff_manage?";
	var row = grid.getSelectionModel().getSelected();
	
	if(row){
		var selectedRows = row.get("STAFF_ID");
		var userName=row.get("USER_NAME");
		var groups = ""; //员工所属虚拟组
		var msg = new Array("是否注销该员工?","注销员工成功!");
		var staffId = selectedRows;
		groups = getStaffProjectGroup(staffId);
		if(groups != "" && groups != null){
			msg[0] = "该员工属于【" + groups + "】虚拟组，是否继续注销?";
			msg[1] = "注销员工成功，并将该员工从虚拟组【" + groups + "】中删除！";
		}
		if(QMsg(msg[0])==MSG_YES)
		{
			var params = new Array();
			params.push("tag="+16);
			params.push("id="+staffId);
			params.push("projectGroup="+groups);
			xmlhttp.open("POST",httpUrl+params.join("&"),false);
			xmlhttp.send();
			if(isSuccess(xmlhttp))
			{
				MMsg(msg[1]);
				grid.search();
			}
		}	
	}else{
		alert("请选择需要注销的员工！");
		return;
	}
}

//启用员工 add by tangft 2014.2.27
function reRunStaff(grid){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var httpUrl = "../../servlet/staff_manage?";
	var row = grid.getSelectionModel().getSelected();
	if(row){
		var selectedRows = row.get("STAFF_ID");
		var groups = ""; //员工所属虚拟组
		var msg = new Array("是否启用该员工?","启用员工成功!");
		if(QMsg(msg[0])==MSG_YES)
		{
			var params = new Array();
			params.push("tag="+66);
			params.push("id="+selectedRows);
			params.push("projectGroup="+groups);
			xmlhttp.open("POST",httpUrl+params.join("&"),false);
			xmlhttp.send();
			if(isSuccess(xmlhttp))
			{
				MMsg(msg[1]);
				grid.search();
			}
		}
	}else{
		alert("请选择需要启用的员工！");
		return;
	}
}

//获取员工所在虚拟组名称
function getStaffProjectGroup(staffId){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var httpUrl = "../../servlet/staff_manage?";
	var groups = "";//虚拟组名称
	var params = new Array();
	params.push("tag="+100);
	params.push("id="+staffId);
	xmlhttp.open("POST",httpUrl+params.join("&"),false);
	xmlhttp.send();
	if(isSuccess(xmlhttp)){
		var dXML = new ActiveXObject("Microsoft.XMLDOM");
			dXML.load(xmlhttp.responseXML);
	    	var element = dXML.selectSingleNode("/root/Msg");
	    	if(element.text != null && element.text != ''){
	    		groups = element.selectSingleNode("GROUP_NAME").text;
	    	}
	}
	return groups;
}

//SFM告警工单批量处理 add by tangft 2014.6.10
function warningBatchProcess(grid){
	var aWarningId = new Array();
	var rows = grid.getSelectionModel().getSelections();//被选中的行
	if(rows.length == 0){
		alert("请选择需要处理的工单！");
		return;
	}
	for(var i=0; i<rows.length; i++){//循环读取被选中的工单warning_id
		aWarningId.push(rows[i].get("WARNING_ID"));
	}
	
	var retVal = window.showModalDialog("/workshop/form/jtitsmFormFile/warningBatchProcess.jsp?sWarningIds="+aWarningId.join(","),window,"dialogWidth=700px;dialogHeight=260px;scroll=0;status=0;");
	if(retVal){
		grid.search();
	}
}

//集团ITSM任务派发流程隐藏处理 add by tangft 2014.10.8
function placingFlowDisabled(oForm){
	var tchNum = oForm.FLOW.TCH_NUM;
	if(tchNum == '11819' || tchNum == '11822'){//任务执行
		var regionLev = getRegionType();
		if(regionLev == '97B'){//省公司员工
			return true;
		}
	}
	return false;
}

//获取员工区域类型 
function getRegionType(){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var httpUrl = "../../servlet/staff_manage?";
	var regionType = "";//虚拟组名称
	var params = new Array();
	params.push("tag="+404);
	xmlhttp.open("POST",httpUrl+params.join("&"),false);
	xmlhttp.send();
	if(isSuccess(xmlhttp)){
		var dXML = new ActiveXObject("Microsoft.XMLDOM");
			dXML.load(xmlhttp.responseXML);
	    	var element = dXML.selectSingleNode("/root/rowSet/REGION_LEVEL");
	    	if(element.text != null && element.text != ''){
	    		regionType = element.text;
	    	}
	}
	return regionType;
}


function doCancelHang(){
	parent.fraForm.doCancelHang();
}

function doOpenAppend(){
	parent.fraForm.doOpenAppend();
}