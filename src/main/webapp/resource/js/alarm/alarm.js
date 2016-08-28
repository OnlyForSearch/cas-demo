//告警处理的...todo
var oData;//当前table的id
var alarm_no_work =10;//未派单
var alarm_process_wait=30;//待处理
var alarm_end=31;//竣工
var alarm_ack = 32;//确认
var alarm_clean = 40;//清除
var noPrivilege ="您不是所选告警的受理人员!";
var currenWin;
if(typeof parentWin=="undefined")
	currenWin=window;
else
	currenWin=parentWin;
//设置当前分页
function setCurrentTable()
{
	//汇总列表的没有定义oMPC
	if(typeof oMPC=="undefined"){
		oData = oData1;
	}else if(oMPC.selectedIndex==0){
		oData = oData1;
	}else if(oMPC.selectedIndex==1){
	    oData = oData2; 
	}
}
//取得权限
function getPrivilege(){
	//return true;
	setCurrentTable();
  	var listCheckId = oData.getPropertys("id");
  	var submitURL = "../../servlet/AlarmOperServlet?postAction=getPrivilege&alarmId="+listCheckId+"&privilege_id=205902";//205902汇总
  	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
 	xmlhttp.Open("POST",submitURL,false);
	xmlhttp.send();
	var alarmXml = new ActiveXObject("Microsoft.XMLDOM");
	alarmXml.load(xmlhttp.responseXML);
	var row=alarmXml.selectSingleNode("/root/Privilege");
	if(row.text == "false")
		return false;
	else
		return true;
}
//告警归并列表
function viewMsglist()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("请选择一项");
		return false;
	}else if(listCheckId.length>1){
		alert("只能选择一项");
		return false;
	}

    resultArr = window.showModalDialog("alarmMsglist.jsp",window.oData,"dialogWidth=50;dialogHeight=20;help=0;scroll=1;status=0;");
}
//相关性能列表
function viewCapList()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("请选择一项");
		return false;
	}else if(listCheckId.length>1){
		alert("只能选择一项");
		return false;
	}
	//查找指定ID的告警列表
	var submitURL = "../../servlet/AlarmOperServlet?postAction=findCapCountByAlarmId&alarmId="+listCheckId;
	var submitXML = new ActiveXObject("Microsoft.XMLDOM");
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",submitURL,false);
	xmlhttp.send(submitXML);
	var alarmXml = new ActiveXObject("Microsoft.XMLDOM");
	alarmXml.load(xmlhttp.responseXML);
	var AlarmListInfo = alarmXml.selectSingleNode("/root/CapCount");
	var count=AlarmListInfo.getAttribute("capCount");
	if(count==0){
		alert("没有相关性能记录..!");
		return false;
	}
	resultArr = window.showModalDialog("../capability/reCapabilityList.jsp?alarmId="+listCheckId,window.oData,"dialogWidth=780px;dialogHeight=550px;help=0;scroll=1;status=0;");
}
//弹出告警确认窗口
function affirmAlarm()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("请选择项(可多选)");
		return false;
	}
	var alarmState=oData.getPropertys("alarmState"); 
	var length=alarmState.length;
	if(length==1){
		if(alarmState[0]==alarm_ack){
		alert("告警已确认，不能再进行告警确认操作..!");
		return false;
		}else if(alarmState[0]==alarm_clean){
			alert("告警已清除，不能再进行告警确认操作..!");
			return false;
		}else if(alarmState[0]==alarm_no_work){
			alert("告警未派单，不能再进行告警确认操作..!");
			return false;
		}
	}else{
		for(var i=0;i<length;i++){
			if(alarmState[i]==alarm_ack){
				alert("所选告警记录包含\"已确认\"状态的告警，请重新选择..!");
				return false;
			}else if(alarmState[i]==alarm_clean){
				alert("所选告警记录包含\"已清除\"状态的告警，请重新选择..!");
				return false;
			}else if(alarmState[i]==alarm_no_work){
				alert("所选告警记录包含\"未派单\"状态的告警，请重新选择..!");
				return false;
			}
		}
	}
	//判断这个用户是否有权限
	if(!getPrivilege()){
		alert(noPrivilege);
		return false;
	}
	if(length==1){   
		resultArr = window.showModalDialog("confirmAlarm.jsp",window.oData,"dialogWidth=30;dialogHeight=20;help=0;scroll=0;status=0;");
	}else{
		resultArr = window.showModalDialog("confirmAlarmAll.jsp",window.oData,"dialogWidth=30;dialogHeight=15;help=0;scroll=0;status=0;");
	}
	if(resultArr==null || typeof resultArr=='undefined')
	{
	    //setTimeout("oData.doRefresh(false);", 1000);
	    oData.doRefresh(false);
	}
}
//弹出工单的告警全部确认窗口
function affirmAlarmWork(){
	setCurrentTable();
	if(flowIdT==null){		
		MMsg("所有的告警不在同一个故障单上，不能全部确认！");
		return ;
	}
	if(!confirm("你确定要确认当前工单的所有告警吗？"))
		return;
	resultArr = window.showModalDialog("confirmAlarmAll.jsp?flowId="+flowIdT,window.oData,"dialogWidth=30;dialogHeight=15;help=0;scroll=0;status=0;");	
	if(resultArr==null || typeof resultArr=='undefined')
	{
	    oData.doRefresh(false);
	}
}
//弹出告警清除窗口
function cancelAlarm()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("请选择项(可多选)");
		return false;
	}
	var alarmState=oData.getPropertys("alarmState"); 
	var length=alarmState.length;
	if(length==1){
		if(alarmState[0]==alarm_ack){
			alert("告警已确认，不能再进行告警清除操作..!");
			return false;
		}else if(alarmState[0]==alarm_clean){
			alert("告警已清除，不能再进行告警清除操作..!");
			return false;
		}else if(alarmState[0]==alarm_end){
			alert("告警已竣工，不能再进行告警清除操作..!");
			return false;
		}
	}else{
		for(var i=0;i<length;i++){
			if(alarmState[i]==alarm_ack){
				alert("所选告警记录包含\"已确认\"状态的告警，请重新选择..!");
				return false;
			}else if(alarmState[i]==alarm_clean){
				alert("所选告警记录包含\"已清除\"状态的告警，请重新选择..!");
				return false;
			}else if(alarmState[i]==alarm_end){
				alert("所选告警记录包含\"已竣工\"状态的告警，请重新选择..!");
				return false;
			}
		}//for的循环
	}
	//判断这个用户是否有权限
	if(!getPrivilege()){
		alert(noPrivilege);
		return false;
	}   
	if(length==1){
		resultArr = window.showModalDialog("cancelAlarm.jsp",window.oData,"dialogWidth=30;dialogHeight=20;help=0;scroll=0;status=0;");
	}else{
		resultArr = window.showModalDialog("cancelAlarmAll.jsp",window.oData,"dialogWidth=30;dialogHeight=15;help=0;scroll=0;status=0;");
	}
	if(resultArr==null || typeof resultArr=='undefined')
	{
	    //setTimeout("oData.doRefresh(false);", 1000);
	    oData.doRefresh(false)
	}
}
//弹出告警升级窗口
function upgradeAlarm()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("请选择项(可多选)");
		return false;
	}
	var alarmLevel=oData.getPropertys("alarmLevel"); 
	if(alarmLevel==1){
		alert("告警已是最高级别，不能再进行告警升级操作..!");
		return false;
	}
	var alarmState=oData.getPropertys("alarmState"); 
	var length=alarmState.length;
	if(length==1){
		if(alarmState[0]==40){
		alert("告警已清除，不能再进行告警升级操作..!");
		return false;
	}else if(alarmState[0]==31){
		alert("告警已竣工，不能再进行告警升级操作..!");
		return false;
	}
	}else{
		for(var i=0;i<length;i++){
			if(alarmState[i]==40){
				alert("所选告警记录包含\"已清除\"状态的告警，请重新选择..!");
				return false;
			}else if(alarmState[i]==31){
				alert("所选告警记录包含\"已竣工\"状态的告警，请重新选择..!");
				return false;
			}
		}//for的循环
	}
	if(length==1){
		resultArr = window.showModalDialog("upgradeAlarm.jsp",window.oData,"dialogWidth=30;dialogHeight=22;help=0;scroll=0;status=0;");
	}else{
		resultArr = window.showModalDialog("upgradeAlarmAll.jsp",window.oData,"dialogWidth=30;dialogHeight=18;help=0;scroll=0;status=0;");
	}
	if(resultArr==null || typeof resultArr=='undefined')
	{
	    //setTimeout("oData.doRefresh(false);", 1000);
	    oData.doRefresh(false);
	}
}
//告警派单 
function sendAlarmSubmit()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("请选择项(可多选)");
		return false;
	}
	var alarmState=oData.getPropertys("alarmState"); 
	var length=alarmState.length;
	if(length==1){
		if(alarmState[0]==40){
			alert("告警已清除，不能再进行告警派单操作..!");
			return false;
		}else if(alarmState[0]==31){
			alert("告警已竣工，不能再进行告警派单操作..!");
			return false;
		}
	}else{
		for(var i=0;i<length;i++){
			if(alarmState[i]==40){
				alert("所选告警记录包含\"已清除\"状态的告警，请重新选择..!");
				return false;
			}else if(alarmState[i]==31){
				alert("所选告警记录包含\"已竣工\"状态的告警，请重新选择..!");
				return false;
			}
		}//for的循环
	}
	
	var flowId=oData.getPropertys("flowId"); //判断当前告警记录是否已经派单，存在流程ID则已派单
	if(confirm("你确定要告警派单操作吗..?")){
		if(flowId!=null&&flowId!="null"&&flowId!=""){
			if(!(confirm("告警已派单，你确定要进行告警分派操作吗..?"))){
				return;
			}
		}
		var submitURL = "../../servlet/AlarmOperServlet?alarmTag=6&alarmId="+listCheckId+"&alarmState="+alarmState;
		var submitXML = new ActiveXObject("Microsoft.XMLDOM");
		var root = submitXML.createElement("root");				
		submitXML.appendChild(root);  				
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.Open("POST",submitURL,false);
		xmlhttp.send(submitXML);
		var alarmXml = new ActiveXObject("Microsoft.XMLDOM");
		alarmXml.load(xmlhttp.responseXML);
		//alert(alarmXml.xml);
		var oRows=alarmXml.selectSingleNode("/root/tchLong");
		if(isSuccess(xmlhttp))
		{
			MMsg("流程启动成功！");
		    if(neIdT=="")
			    window.open("../../FlowCreateNext?system_code=D&tch_id="+oRows.text);
		    else
			    window.dialogArguments.open("../../FlowCreateNext?system_code=D&tch_id="+oRows.text);
		}
	}
	oData.doRefresh(false);
}
//事件派单 
function sendEventWork()
{
	var alarmMergeUrl = "../../servlet/alarmMergeServlet?";
	setCurrentTable();
	var alarmIds = oData.getPropertys("id");
	if(alarmIds.length==0){
		alert("请选择项(可多选)");
		return false;
	}
	var alarmState=oData.getPropertys("alarmState"); 
	var alarmClass=oData.getPropertys("alarmClass"); 
	var length=alarmState.length;
	if(length==1){
		if(alarmState[0]==40){
			alert("事件已清除，不能再进行事件派单操作..!");
			return false;
		}
	}else{
		for(var i=0;i<length;i++){
			if(alarmState[i]==40){
				alert("所选事件记录包含\"已清除\"状态的事件，请重新选择..!");
				return false;
			}
			if((alarmClass[i]==null || alarmClass[i]=="") || (alarmClass[i]!=9 && alarmClass[i]!="9")){
				alert("所选事件记录中包含告警，请重新选择..!");
				return false;
			}
		}//for的循环
	}
	
	var flowId=oData.getPropertys("flow_id"); //判断当前事件记录是否已经派单，存在流程ID则已派单
	if(confirm("你确定要事件派单操作吗..?")){
		if(flowId!=null&&flowId!=""){
			if(!(confirm("事件已派单，你确定要进行事件分派操作吗..?"))){
				return;
			}
		}

		submitURL = alarmMergeUrl + "tag=19&alarmId="+alarmIds+"&alarmClass=9";
		var submitXML = new ActiveXObject("Microsoft.XMLDOM");
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.Open("POST",submitURL,false);
		xmlhttp.send();

		var alarmXml = new ActiveXObject("Microsoft.XMLDOM");
		alarmXml.load(xmlhttp.responseXML);
		var oRows=alarmXml.selectSingleNode("/root/tchLong");
		if(isSuccess(xmlhttp))
		{
			MMsg("流程启动成功！");
			    window.open("../../FlowCreateNext?system_code=D&tch_id="+oRows.text);
		}
	}
	oData.doRefresh(false);
}
//查看
function viewAlarm()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("请选择一项");
		return false;
	}else if(listCheckId.length>1){
		alert("只能选择一项");
		return false;
	}
	//resultArr = window.showModalDialog("viewAlarmInfo.jsp",window.oData,"dialogWidth=57;dialogHeight=46;help=0;scroll=0;status=0;");
	var alarmIds = oData.getPropertys("id");
	var	alarmId = window.oData.getPropertys("id")[0];
	currenWin.open("../alarmManage/viewAlarmInfo.htm?alarmId="+alarmId,'_blank',"resizable=1;top=0;left=0;help=0;scroll=0;status=0;");
}
//查看故障单(应该是流程处理模板)
function alarmFlowView() {
	setCurrentTable();
	var alarmId = oData.getPropertys("id");
	if(alarmId.length==0){
		alert("请选择一项");
		return false;
	}else if(alarmId.length>1){
		alert("只能选择一项");
		return false;
	}
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var flowId=oData.getPropertys("flowId"); //判断当前告警记录是否已经派单，存在流程ID则已派单
	if(flowId == null||flowId=="null"||flowId==""){
		alert("告警没有相关的处理流程，未派单!");
		return ;
	}
	var theURL = "../../FlowBrowse?system_code=D&flow_id="+flowId;
	var winName = "SparePartEdit";
	var curr_window;
	x=(window.screen.width-780)/2;
	y=(window.screen.height-560)/2;
	curr_window=window.open(theURL,winName,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	curr_window.focus();
}

//弹出告警竣工窗口
function endAlarm()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("请选择项(可多选)");
		return false;
	}
	var alarmState=oData.getPropertys("alarmState"); 
	var length=alarmState.length;
	if(length==1){
		if(alarmState[0]!=32){
			alert("告警不是“已确认”状态，不能竣工!");
			return false;
		}
	}else{
		for(var i=0;i<length;i++){
			if(alarmState[i]!=32){
				alert("所选告警记录包含不是\"已确认\"状态的告警，请重新选择..!");
				return false;
			}
		}
	}
	//判断这个用户是否有权限
	if(!getPrivilege()){
		alert(noPrivilege);
		return false;
	}
	if(length==1){   
		resultArr = window.showModalDialog("endAlarm.jsp",window.oData,"dialogWidth=30;dialogHeight=20;help=0;scroll=0;status=0;");
	}else{
		resultArr = window.showModalDialog("endAlarmAll.jsp",window.oData,"dialogWidth=30;dialogHeight=15;help=0;scroll=0;status=0;");
	}
	if(resultArr==null || typeof resultArr=='undefined')
	{
	    oData.doRefresh(false);
	}
}

//弹出当前流程的所有告警竣工窗口
function endAlarmWork()
{
	setCurrentTable();
	if(flowIdT==null){		
		MMsg("所有的告警不在同一个故障单上，不能全部竣工！");
		return ;
	}
	if(!confirm("你确定要竣工当前工单的所有告警吗？"))
		return;
	resultArr = window.showModalDialog("endAlarmAll.jsp?flowId="+flowIdT,window.oData,"dialogWidth=30;dialogHeight=15;help=0;scroll=0;status=0;");	
	if(resultArr==null || typeof resultArr=='undefined')
	{
	    oData.doRefresh(false);
	}
}
//告警确认
function affirmAlarmSubmit(bClosed)
{
	var listCheckId = getParams;
	if(!confirm("你确定要进行告警确认操作吗？(告警数量多的情况下后台处理时间将有可能稍长，请耐心等待...)"))
		return;
	var submitURL;
	if( typeof confirmFlowId=='undefined'||confirmFlowId ==null)	
		//单条多条告警确认
		submitURL = "../../servlet/AlarmOperServlet?alarmTag=1&alarmId="+listCheckId;
	else
		//工单的所有告警确认
		submitURL = "../../servlet/AlarmOperServlet?alarmTag=9&flowId="+confirmFlowId;
	var submitXML = new ActiveXObject("Microsoft.XMLDOM");
	var root = submitXML.createElement("root");
	var value = oprtResult.value;
	if(!value.hasText()){
		MMsg("对不起，处理结果描述为空，不能提交！");		  		
		return;
	}
	root.setAttribute("oprtResult",oprtResult.value);
	submitXML.appendChild(root);  
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",submitURL,false);
	xmlhttp.send(submitXML);
	if(isSuccess(xmlhttp))
	{
		MMsg("操作成功！");
	}
	if(bClosed)
		window.close();
}
//告警清除  type=40
function cancelAlarmSubmit(bClosed)
{
	var listCheckId = getParams;
	if(!confirm("你确定要进行告警清除操作吗？"))
		return;
	var submitURL = "../../servlet/AlarmOperServlet?alarmTag=2&alarmId="+listCheckId;
	var submitXML = new ActiveXObject("Microsoft.XMLDOM");
	var root = submitXML.createElement("root");
	var value = oprtResult.value;
	if(!value.hasText()){
		MMsg("对不起，处理结果描述为空，不能提交！");
		return;
	}
	root.setAttribute("oprtResult",oprtResult.value);
	submitXML.appendChild(root);  
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",submitURL,false);
	xmlhttp.send(submitXML);
	if(isSuccess(xmlhttp))
	{
		MMsg("操作成功！");
	}
	if(bClosed)
		window.close();
}
//告警升级 type=90
function upgradeAlarmSubmit(bClosed)
{
	var listCheckId = getParams;
	if(alarmLevel.value==""){
		alert("告警级别不能为空..!");
		return false;
	}
	var value = oprtResult.value;
	if(!confirm("你确定要告警升级操作吗？"))
		return;
	var submitURL = "../../servlet/AlarmOperServlet?alarmTag=3&alarmId="+listCheckId;
	var submitXML = new ActiveXObject("Microsoft.XMLDOM");
	var root = submitXML.createElement("root");
	root.setAttribute("alarmLevel",alarmLevel.value);
	root.setAttribute("oprtResult",oprtResult.value);
	submitXML.appendChild(root);  
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",submitURL,false);
	xmlhttp.send(submitXML);
	if(isSuccess(xmlhttp))
	{
		MMsg("操作成功！");
	}
	if(bClosed)
		window.close();
}
//竣工
function endAlarmSubmit(bClosed)
{
	var listCheckId = getParams;
	if(!confirm("你确定要进行告警竣工操作吗？(告警数量多的情况下后台处理时间将有可能稍长，请耐心等待...)"))
		return;
	var submitURL;
	if( typeof endFlowId=='undefined'||endFlowId ==null)	
		//单条多条告警竣工
		submitURL = "../../servlet/AlarmOperServlet?alarmTag=4&alarmId="+listCheckId;
	else
		//工单的所有告警竣工
		submitURL = "../../servlet/AlarmOperServlet?alarmTag=5&flowId="+endFlowId;	
	var submitXML = new ActiveXObject("Microsoft.XMLDOM");
	var root = submitXML.createElement("root");
	var value = oprtResult.value;
	if(!value.hasText()){
		value ="同确认";		  		
	}
	root.setAttribute("oprtResult",value);
	submitXML.appendChild(root);  
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",submitURL,false);
	xmlhttp.send(submitXML);
	if(isSuccess(xmlhttp))
	{
		MMsg("操作成功！");
	}
	if(bClosed)
		window.close();
}

//增加处理情况
function addOperAlarmSubmit()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("请选择项(可多选)");
		return false;
	}
	var alarmState=oData.getPropertys("alarmState"); 
	var length=alarmState.length;
	if(length==1){
		if(alarmState[0]==10){
			alert("告警未派单，不能增加处理情况!");
			return false;
		}else if(alarmState[0]==31){
			alert("告警已竣工，不能增加处理情况!");
			return false;
		}else if(alarmState[0]==40){
			alert("告警已清除，不能增加处理情况!");
			return false;
		}
	}else{
		for(var i=0;i<length;i++){
			if(alarmState[i]==10){
				alert("所选告警记录包含\"未派单\"状态的告警，请重新选择..!");
				return false;
			}else if(alarmState[i]==31){
				alert("所选告警记录包含\"已竣工\"状态的告警，请重新选择..!");
				return false;
			}else if(alarmState[i]==40){
				alert("所选告警记录包含\"已清除\"状态的告警，请重新选择..!");
				return false;
			}
		}//for的循环
	}
	//判断这个用户是否有权限
	if(!getPrivilege()){
		alert(noPrivilege);
		return false;
	}  
	resultArr = window.showModalDialog("operAlarm.jsp",window.oData,"dialogWidth=30;dialogHeight=15;help=0;scroll=0;status=0;");
}