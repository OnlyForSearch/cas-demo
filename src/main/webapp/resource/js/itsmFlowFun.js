
//�������̵��Ż����
function showAllInfo(flow_id,flow_mod)
{
	var sFeatures = "location=0,menubar=0,resizable=1,scrollbars=1,status=0,titlebar=0,toolbar=0";
	window.open('/workshop/form/index.jsp?fullscreen=yes&flowId='+flow_id+'&flowMod='+flow_mod, flow_id ,sFeatures);
}

//ͨ�������Ҽ��˵�����-����Ϣ
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

//ͨ�������Ҽ��˵�����-�������
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

//��ͨ�������Ҽ��˵�����-����Ϣ
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

//��ͨ�������Ҽ��˵�����-���������
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
//��ͨ�������Ҽ��˵�����-���Ŵ߰�
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
    		alert("�����ѿ���");
    	}
  		else if(state =='P')
  		{
  			alert("�����ѳ���");
		}
		else
		{
			
			notify(notifyType,flowId,staffIds,tchId, actionType, remarks);
			alert ("�߰�ɹ�");
		}
	}
}

//��ͨ�������Ҽ��˵�����-�ʼ��߰�
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
    		alert("�����ѿ���");
    	}
  		else if(state =='P')
  		{
  			alert("�����ѳ���");
		}
		else
		{
			notify(notifyType,flowId,staffIds,tchId, actionType, remarks);
			alert ("�߰�ɹ�");	
		}
	}
}

//��ͨ�������Ҽ��˵�����-�����ʼ��߰�
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
    		alert("�����ѿ���");
    	}
  		else if(state =='P')
  		{
  			alert("�����ѳ���");
		}
		else
		{
			notify(notifyType,flowId,staffIds,tchId, actionType, remarks);
			alert ("�߰�ɹ�");	
		}
	}
}

// �����ʼ�֪ͨͨ�÷���(notifyTypeΪ֪ͨ���ͣ�1Ϊ���Ŵ߰죬2Ϊ�ʼ��߰죬3Ϊ�����ʼ�ͬʱ�߰죬4Ϊ�������޸Ĺ���֪ͨ��һ���ڴ�����)---wangjian
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
		alert("�첽����ʧ�ܣ�");
	}
}

//�Զ�����Ŵ߰�
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
        alert("û���ҵ�����ID!");
        return;
    }
    var x=(window.screen.width-780)/2;
    var y=(window.screen.height-560)/2;    
    var url = "/workshop/form/jtitsmFormFile/placing_executeInfo.jsp?flow_id="+flow_id;
    
    curr_window=window.open(url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
}
//����ITSM��������
function custHurryBySms(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
	  	var flowId = row.get("FLOW_ID");
		var actionType = '1';
		var notifyType = "1";
		if(confirm("�Ƿ�Ҫ�� "+getStaffNames(flowId)+" ���Ͷ��Ŵ߰죿")){
			notifyUser(notifyType,flowId,actionType);
			alert ("�߰�ɹ�");	
		}
	}
}

//��ͨ�������Ҽ��˵�����-�ʼ��߰�
function custHurryByEmail(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
	  	var flowId = row.get("FLOW_ID");
		var actionType = '1';
		var notifyType = "2";		
    	if(confirm("�Ƿ�Ҫ�� "+getStaffNames(flowId)+" �����ʼ��߰죿")){
			notifyUser(notifyType,flowId,actionType);
    		alert ("�߰�ɹ�");
		}
	}
}

//��ͨ�������Ҽ��˵�����-�����ʼ��߰�
function custHurryBySmsEmail(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
	  	var flowId = row.get("FLOW_ID");
		var actionType = '1';
		var notifyType = "3";		
    	if(confirm("�Ƿ�Ҫ�� "+getStaffNames(flowId)+" ���Ͷ��ż��ʼ��߰죿")){
			notifyUser(notifyType,flowId,actionType);
			alert ("�߰�ɹ�");
		}	
	}
}
function notifyUser(notifyType,flowId,actionType){
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	try {
		oXMLHTTP.open('get',"/servlet/customSms?action="+actionType+"&notifyType="+notifyType+"&flowId="+flowId, true);
		oXMLHTTP.send();
	} catch (e) {
		alert("�첽����ʧ�ܣ�");
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
 * ���ʹ߰찴ť�û���������
 * @param {} grid
 * @return {String}
 */
function setItemDisabled(){
	var row = Global.gridPanel.getSelectionModel().getSelected();
	if(row)
	{
		var state = row.get("FLOW_STATE");	
    	if(state =='F' || state =='P')//������ע��
    	{
    		return '0';
    	}
    	return '1';
	}
}

//���Ͷ����ʼ��߰� add by tangft 2013.10.20
function hurryBySmsEmail(notifyType,oForm){
	var flowId = oForm.FLOW.TOP_FLOW_ID;
	var msg = "���ż��ʼ�";
	if(notifyType==1){
		msg = "����";
	}else if(notifyType==2){
		msg = "�ʼ�";
	}
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	try {
		var staffs = getHurryStaffsInfo(flowId);
		if(!staffs || staffs == "" || staffs == null || staffs == "null"){
			alert("��ǰ�����˲����ϴ߰����������ܷ��ʹ߰죡");
			return;
		}
		if(confirm("�Ƿ�Ҫ�� "+staffs+" ����"+msg+"�߰죿")){
			oXMLHTTP.Open("POST","/servlet/flowOper?OperType=21&notifyType="+notifyType+"&flowId="+flowId,false);
			oXMLHTTP.send();
			if(isSuccess(oXMLHTTP)){
				alert ("�߰�ɹ�");
			}else{
				alert ("�߰�ʧ��");
			}
		}	
	} catch (e) {
		alert("�첽����ʧ�ܣ�");
	}
}

function addStaff(grid){
	var retVal = window.showModalDialog("/workshop/user/staffInfo_lte.jsp?staffId=",window,"dialogWidth=700px;dialogHeight=260px;scroll=0;status=0;");
	if(retVal){
		grid.search();
	}
}
//��ӣ��޸�Ա�� type=1 ��ӣ�type=2 �޸� add by tangft 2014.2.27
function modifyStaff(grid){
	var staffId = "";
	var row = grid.getSelectionModel().getSelected();
	if(row){
		staffId = row.get("STAFF_ID");
	}else{
		alert("��ѡ����Ҫ�޸ĵ�Ա����");
		return;
	}
	var retVal = window.showModalDialog("/workshop/user/staffInfo_lte.jsp?staffId="+staffId,window,"dialogWidth=700px;dialogHeight=260px;scroll=0;status=0;");
	if(retVal){
		grid.search();
	}
}

//ע��Ա�� add by tangft 2014.2.27
function delStaff(grid){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var httpUrl = "../../servlet/staff_manage?";
	var row = grid.getSelectionModel().getSelected();
	
	if(row){
		var selectedRows = row.get("STAFF_ID");
		var userName=row.get("USER_NAME");
		var groups = ""; //Ա������������
		var msg = new Array("�Ƿ�ע����Ա��?","ע��Ա���ɹ�!");
		var staffId = selectedRows;
		groups = getStaffProjectGroup(staffId);
		if(groups != "" && groups != null){
			msg[0] = "��Ա�����ڡ�" + groups + "�������飬�Ƿ����ע��?";
			msg[1] = "ע��Ա���ɹ���������Ա���������顾" + groups + "����ɾ����";
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
		alert("��ѡ����Ҫע����Ա����");
		return;
	}
}

//����Ա�� add by tangft 2014.2.27
function reRunStaff(grid){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var httpUrl = "../../servlet/staff_manage?";
	var row = grid.getSelectionModel().getSelected();
	if(row){
		var selectedRows = row.get("STAFF_ID");
		var groups = ""; //Ա������������
		var msg = new Array("�Ƿ����ø�Ա��?","����Ա���ɹ�!");
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
		alert("��ѡ����Ҫ���õ�Ա����");
		return;
	}
}

//��ȡԱ����������������
function getStaffProjectGroup(staffId){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var httpUrl = "../../servlet/staff_manage?";
	var groups = "";//����������
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

//SFM�澯������������ add by tangft 2014.6.10
function warningBatchProcess(grid){
	var aWarningId = new Array();
	var rows = grid.getSelectionModel().getSelections();//��ѡ�е���
	if(rows.length == 0){
		alert("��ѡ����Ҫ����Ĺ�����");
		return;
	}
	for(var i=0; i<rows.length; i++){//ѭ����ȡ��ѡ�еĹ���warning_id
		aWarningId.push(rows[i].get("WARNING_ID"));
	}
	
	var retVal = window.showModalDialog("/workshop/form/jtitsmFormFile/warningBatchProcess.jsp?sWarningIds="+aWarningId.join(","),window,"dialogWidth=700px;dialogHeight=260px;scroll=0;status=0;");
	if(retVal){
		grid.search();
	}
}

//����ITSM�����ɷ��������ش��� add by tangft 2014.10.8
function placingFlowDisabled(oForm){
	var tchNum = oForm.FLOW.TCH_NUM;
	if(tchNum == '11819' || tchNum == '11822'){//����ִ��
		var regionLev = getRegionType();
		if(regionLev == '97B'){//ʡ��˾Ա��
			return true;
		}
	}
	return false;
}

//��ȡԱ���������� 
function getRegionType(){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var httpUrl = "../../servlet/staff_manage?";
	var regionType = "";//����������
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