var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var alarmMergeUrl = "../../servlet/alarmMergeServlet?";//告警归并
var submitURL;
var returnXml;//从服务端返回的XML串

var alarm_no_work =10;    //状态：未派单 -- 未确认、未清除
var alarm_clean = 40;     //状态：清  除 -- 未确认、已清除
var alarm_ack = 32;       //状态：确  认 -- 已确认、未清除
var alarm_end=31;         //状态：竣  工 -- 已确认、已清除
var alarm_process_wait=30;//状态：待处理


var alarm_state_no_clear = 0  ; //告警状态：未清除
var alarm_state_clear    = 1  ; //告警状态：已清除

var oprt_state_no_oprt   = 10 ; //操作状态：未操作
var oprt_state_ack       = 20 ; //操作状态：确认
var oprt_state_clear     = 30 ; //操作状态：清除
var oprt_state_del       = 40 ; //操作状态：删除

var noPrivilege ="您不是所选告警的受理人员!";
var parentWin=window.dialogArguments;
var currenWin;
if(typeof parentWin=="undefined" || parentWin==null)
	currenWin=window;
else
	currenWin=parentWin;

var isRefresh = false;
var refreshFunc = null;

/////////////////
var flowId;
var alarmId;
var alarmClass;
var oprt_state;
var alarmLevel;
var perf_msg_id;

function getServeXML(dom){
 	xmlhttp.Open("POST",submitURL,false);
 	if(dom!=null)
		xmlhttp.send(dom);
	else
		xmlhttp.send();
	returnXml = new ActiveXObject("Microsoft.XMLDOM");
	returnXml.load(xmlhttp.responseXML);
} 
//取得权限
function getPrivilege(){
  	submitURL = alarmMergeUrl + "tag=8&flowIds="+flowId;  	
 	getServeXML()	
	var row=returnXml.selectSingleNode("/root/Privilege");
	if(row.text == "false")
		return false;
	else 
		return true;
}

//*************************************************************************
//******************** 2. 告警确认 ******************************************
//*************************************************************************/
/**
 * 2-1. 确认告警时，弹出窗口
 *
 *      (1). 只有进入“待处理”的，才能确认。
 *      (2). 对于事件，则不能确认。
 */
function popupACKWindow()//弹出告警确认窗口
{
	var tFirst=0;

	if(oprt_state!=alarm_process_wait)
	{
		if(oprt_state==alarm_ack){
			tFirst=1;
		}else{
			alert("告警不是“待处理”或“待确认”状态，不能进行告警确认操作..!");
			return;
		}
	}
	//判断这个用户是否有权限
	if(!getPrivilege()){
		alert(noPrivilege);
		return false;
	}
  
	var params = new Array();
	params.push(alarmId);
	params.push(tFirst);
	window.showModalDialog("ACKAlarm.htm",params,"dialogWidth=40;dialogHeight=35;help=0;scroll=0;status=0;");

	callbackRefresh();
}
/**
 * 2-1-2. 确认告警(不启用流程)时，弹出窗口
 *
 *      (1). 只有进入“未派单”或者“清  除”的，才能确认。
 *      (2). 对于事件，则不能确认。
 */
function popupACKWindowWithoutFlow()//弹出告警确认窗口
{
	var tFirst=0;
	//var length=alarmState.length;
	if(oprt_state!=alarm_no_work && oprt_state!=alarm_clean)
	{
		if(oprt_state==alarm_ack){
			tFirst=1;
		}else{
			alert("告警已经竣工，无需再进行告警确认操作..!");
			return;
		}
	}
	var params = new Array();
	params.push(alarmId);
	params.push(tFirst);
	window.showModalDialog("ACKAlarm.htm",params,"dialogWidth=40;dialogHeight=35;help=0;scroll=0;status=0;");

	callbackRefresh();
}

/**
 * 2-2. 确认工单时，弹出窗口
 *
 *      (1). 根据传入的flowId, 确认同一流程的告警。
 */
function popupACKWorkWindow()//弹出工单的告警全部确认窗口
{
	if(flowId==null || flowId=="")
	{		
		alert("没有告警工单，不能确认！");
		return ;
	}
	if(!confirm("你确定要确认当前告警的工单的所有告警吗？"))
		return;
	window.showModalDialog("ACKAlarmAll.htm?flowId="+flowId,null,"dialogWidth=40;dialogHeight=30;help=0;scroll=0;status=0;");	
	callbackRefresh();
}
//*************************************************************************
//******************** 3. 告警竣工 ******************************************
//*************************************************************************/
/**
 * 3-1. 竣工告警时，弹出窗口
 *
 *      (1). 只有“待处理”或者“已确认”的，才能竣工。
 *      (2). 对于事件，则不能竣工。
 */
function popupEndWindow()//弹出告警竣工窗口
{	
	if(oprt_state!=alarm_ack && oprt_state != alarm_process_wait)
	{
		alert("告警不是“待处理”或“已确认”状态，不能竣工!");
		return false;
	}

	//判断这个用户是否有权限
	if(!getPrivilege()){
		alert(noPrivilege);
		return false;
	}
	window.showModalDialog("endAlarm.htm",alarmId,"dialogWidth=40;dialogHeight=35;help=0;scroll=0;status=0;");

	callbackRefresh();
}

/**
 * 3-2. 竣工工单时，弹出窗口
 *
 *      (1). 根据传入的flowId, 竣工同一流程的告警。
 */
function popupEndWorkWindow()//弹出工单的告警全部竣工窗口
{
	if(flowId==null || flowId=="")
	{
		alert("没有工单，不能竣工！");
		return ;
	}
	if(!confirm("你确定要竣工当前告警的工单的所有告警吗？"))
		return;
	window.showModalDialog("endAlarmAll.htm?flowId="+flowId,null,"dialogWidth=40;dialogHeight=30;help=0;scroll=0;status=0;");	
	callbackRefresh();
}
//*************************************************************************
//******************** 4. 告警清除 ******************************************
//*************************************************************************/
/**
 * 4-1. 清除告警时，弹出窗口
 *
 *      (1). 如果是“已确认”、“已清除”或“已竣工”的，不能清除。
 */
function popupCLRWindow(flag)//弹出告警清除窗口
{
	if(oprt_state==alarm_ack)
	{
		alert("告警已确认，不能再进行告警清除操作..!");
		return false;
	}
	else if(oprt_state==alarm_clean)
	{
		alert("告警已清除，不能再进行告警清除操作..!");
		return false;
	}
	else if(oprt_state==alarm_end)
	{
		alert("告警已竣工，不能再进行告警清除操作..!");
		return false;
	}
	
	//判断这个用户是否有权限
	if(!getPrivilege()){
		alert(noPrivilege);
		return false;
	}
	var temp="";
	//申告告警清除
	if(flag!=null && flag!="")
		temp="?flag="+flag;
	resultArr = window.showModalDialog("CLRAlarm.jsp"+temp,alarmId,"dialogWidth=40;dialogHeight=35;help=0;scroll=0;status=0;");

	callbackRefresh();
}

/**
 * 4-1-2. 清除告警(不启用流程)时，弹出窗口
 *
 *      (1). 如果是“已清除”或“已竣工”的，不能清除。
 */
function popupCLRWindowWithoutFlow(flag)//弹出告警清除窗口
{
	if(oprt_state==alarm_clean)
	{
		alert("告警已清除，不能再进行告警清除操作..!");
		return false;
	}
	else if(oprt_state==alarm_end)
	{
		alert("告警已竣工，不能再进行告警清除操作..!");
		return false;
	}
	var temp="";
	//申告告警清除
	if(flag!=null && flag!="")
		temp="?flag="+flag;
	resultArr = window.showModalDialog("CLRAlarm.jsp"+temp,alarmId,"dialogWidth=40;dialogHeight=35;help=0;scroll=0;status=0;");
	callbackRefresh();
}

//*************************************************************************
//******************** 5. 告警升级 *****************************************
//*************************************************************************/
/**
 * 5-1. 升级告警时，弹出窗口
 *
 *      (1). 如果是“已清除”或“已竣工”的，不能升级。
 *      (2). 对于事件，则不能升级。
 */
function popupUpgradeWindow()//弹出告警升级窗口
{
	if(alarmLevel==1)
	{
		alert("告警已是最高级别，不能再进行告警升级操作..!");
		return false;
	}
	
	if(oprt_state==alarm_clean)
	{
		alert("告警已清除，不能再进行告警升级操作..!");
		return false;
	}
	else if(oprt_state==alarm_end)
	{
		alert("告警已竣工，不能再进行告警升级操作..!");
		return false;
	}

	resultArr = window.showModalDialog("upgradeAlarm.htm?alarmLevel="+alarmLevel,alarmId,"dialogWidth=40;dialogHeight=37;help=0;scroll=0;status=0;");
	callbackRefresh();
}
/**
 * 5-1-2. 升级告警(不启用流程)时，弹出窗口
 *
 *      (1). 如果是“已竣工”的，不能升级。
 *      (2). 对于事件，则不能升级。
 */
function popupUpgradeWindowWithoutFlow()//弹出告警升级窗口
{
	if(alarmLevel==1)
	{
		alert("告警已是最高级别，不能再进行告警升级操作..!");
		return false;
	}
	if(oprt_state==alarm_end)
	{
		alert("告警已竣工，不能再进行告警升级操作..!");
		return false;
	}
	resultArr = window.showModalDialog("upgradeAlarm.htm?alarmLevel="+alarmLevel,alarmId,"dialogWidth=40;dialogHeight=37;help=0;scroll=0;status=0;");
	callbackRefresh();
}

//告警派单 
function sendAlarmWork()
{
	if(oprt_state==40){
		alert("告警已清除，不能再进行告警派单操作..!");
		return false;
	}else if(oprt_state==31){
		alert("告警已竣工，不能再进行告警派单操作..!");
		return false;
	}
	
	if(confirm("你确定要告警派单操作吗..?")){
		if(flowId!=null&&flowId!=""){
			if(!(confirm("告警已派单，你确定要进行告警分派操作吗..?"))){
				return;
			}
		}
		submitURL = alarmMergeUrl + "tag=19&alarmId="+alarmId+"&alarmClass=-1";
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
			    currenWin.open("../../FlowCreateNext?system_code=D&tch_id="+oRows.text);
		}
	}
}

//事件派单 
function sendEventWork()
{
	if(oprt_state==40){
		alert("事件已清除，不能再进行事件派单操作..!");
		return false;
	}
	
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
			    currenWin.open("../../FlowCreateNext?system_code=D&tch_id="+oRows.text);
		}
	}
}

//查看故障单(应该是流程处理模板)
function alarmFlowView() {
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	if(flowId == null||flowId=="null"||flowId==""){
		alert("告警没有相关的处理流程，未派单!");
		return ;
	}
	var theURL = "../../FlowBrowse?system_code=D&flow_id="+flowId;
	var winName = "SparePartEdit";
	var curr_window;
	x=(window.screen.width-780)/2;
	y=(window.screen.height-560)/2;
	curr_window=currenWin.open(theURL,winName,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	curr_window.focus();
}
//原始告警消息查询
function oriAlarmMsgQry()
{
	window.showModalDialog("oriAlarmMsgQry.htm",alarmId,"dialogWidth=50;dialogHeight=29;help=0;scroll=1;status=0;");
}
//原始性能消息查询
function oriPerfMsgQry()
{
	if(perf_msg_id==0){
		alert("无原始性能消息数据!");
		return false;
	}
    var params = "?flag=" + flag + "&perfid=" + perf_msg_id + "&lastdate=" + last_generate_time;
	window.showModalDialog("../permanager/originPerView.htm" + params,window,"dialogWidth=40;dialogHeight=31;help=0;scroll=0;status=0;");
	//window.showModalDialog("oriPerfMsgQry.htm",perf_msg_id,"dialogWidth=50;dialogHeight=29;help=0;scroll=1;status=0;");
}
//关联告警查询
function relationAlarmQry(){
	window.showModalDialog("relationAlarmQry.htm",alarmId,"dialogWidth=50;dialogHeight=29;help=0;scroll=1;status=0;");
}
//修改导致告警的区域
function editAlarmRegion(){
	window.showModalDialog("editAlarmRegion.htm",alarmId,"dialogWidth=29;dialogHeight=15;help=0;scroll=1;status=0;");
}

function callbackRefresh()
{
	iniAllTextField("../../servlet/alarmMergeServlet?tag=9&alarmId="+alarmId);
	initCommonVar();
}