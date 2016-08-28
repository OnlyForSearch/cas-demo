
//单击流程单号或标题
function showAllInfo(flow_id,flow_mod)
{
	var sFeatures = "location=0,menubar=0,resizable=1,scrollbars=1,status=0,titlebar=0,toolbar=0";
	window.open('/workshop/form/index.jsp?fullscreen=yes&flowId='+flow_id+'&flowMod='+flow_mod, flow_id ,sFeatures);
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

function eventRelatian(grid){
	var flowIds = "";
	var selectedRows = grid.getSelectionModel().getSelections();
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	if(selectedRows.length < 1){
		MMsg('请至少选择一条记录！');
		return;
	}
	for(var i=0; i<selectedRows.length; i++){
		xmlhttp.Open("POST","/servlet/NdFormServlet?tag=17&flowId="+selectedRows[i].get('FLOW_ID'),false);
	    xmlhttp.send();
	    if(isSuccess(xmlhttp)){
		    dXML.load(xmlhttp.responseXML);
	        var count = dXML.selectSingleNode("/root/rowSet/COUNT").text;
	        if(count > 0 ){
	        	MMsg(selectedRows[i].get('SERIAL_ID')+"已存在关联关系，不能在创建！");
	        	return false;
	        }
	        flowIds += selectedRows[i].get('FLOW_ID') + ",";
	    }else{
	    	EMsg('查询事件是否已存在关联失败！');
	    }
	}
	flowIds = flowIds.substr(0,flowIds.length-1);
	var params = new Object();
	params.action = "add";
	params.flowIds = flowIds;
	var sunResult = window.showModalDialog("/workshop/form/index.jsp?formId=452014032&hiddenToolBar=y",params,"resizable=yes;dialogWidth=1150px;dialogHeight=750px;help=0;scroll=1;status=0;");
	if(sunResult != undefined){
		MMsg('关联成功');
	}
}

function evnetCount(){
	window.top.evnetCount();
	Global.mainPanel.search();
}