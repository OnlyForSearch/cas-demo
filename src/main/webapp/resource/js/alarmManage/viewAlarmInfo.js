var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var alarmMergeUrl = "../../servlet/alarmMergeServlet?";//�澯�鲢
var submitURL;
var returnXml;//�ӷ���˷��ص�XML��

var alarm_no_work =10;    //״̬��δ�ɵ� -- δȷ�ϡ�δ���
var alarm_clean = 40;     //״̬����  �� -- δȷ�ϡ������
var alarm_ack = 32;       //״̬��ȷ  �� -- ��ȷ�ϡ�δ���
var alarm_end=31;         //״̬����  �� -- ��ȷ�ϡ������
var alarm_process_wait=30;//״̬��������


var alarm_state_no_clear = 0  ; //�澯״̬��δ���
var alarm_state_clear    = 1  ; //�澯״̬�������

var oprt_state_no_oprt   = 10 ; //����״̬��δ����
var oprt_state_ack       = 20 ; //����״̬��ȷ��
var oprt_state_clear     = 30 ; //����״̬�����
var oprt_state_del       = 40 ; //����״̬��ɾ��

var noPrivilege ="��������ѡ�澯��������Ա!";
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
//ȡ��Ȩ��
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
//******************** 2. �澯ȷ�� ******************************************
//*************************************************************************/
/**
 * 2-1. ȷ�ϸ澯ʱ����������
 *
 *      (1). ֻ�н��롰�������ģ�����ȷ�ϡ�
 *      (2). �����¼�������ȷ�ϡ�
 */
function popupACKWindow()//�����澯ȷ�ϴ���
{
	var tFirst=0;

	if(oprt_state!=alarm_process_wait)
	{
		if(oprt_state==alarm_ack){
			tFirst=1;
		}else{
			alert("�澯���ǡ��������򡰴�ȷ�ϡ�״̬�����ܽ��и澯ȷ�ϲ���..!");
			return;
		}
	}
	//�ж�����û��Ƿ���Ȩ��
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
 * 2-1-2. ȷ�ϸ澯(����������)ʱ����������
 *
 *      (1). ֻ�н��롰δ�ɵ������ߡ���  �����ģ�����ȷ�ϡ�
 *      (2). �����¼�������ȷ�ϡ�
 */
function popupACKWindowWithoutFlow()//�����澯ȷ�ϴ���
{
	var tFirst=0;
	//var length=alarmState.length;
	if(oprt_state!=alarm_no_work && oprt_state!=alarm_clean)
	{
		if(oprt_state==alarm_ack){
			tFirst=1;
		}else{
			alert("�澯�Ѿ������������ٽ��и澯ȷ�ϲ���..!");
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
 * 2-2. ȷ�Ϲ���ʱ����������
 *
 *      (1). ���ݴ����flowId, ȷ��ͬһ���̵ĸ澯��
 */
function popupACKWorkWindow()//���������ĸ澯ȫ��ȷ�ϴ���
{
	if(flowId==null || flowId=="")
	{		
		alert("û�и澯����������ȷ�ϣ�");
		return ;
	}
	if(!confirm("��ȷ��Ҫȷ�ϵ�ǰ�澯�Ĺ��������и澯��"))
		return;
	window.showModalDialog("ACKAlarmAll.htm?flowId="+flowId,null,"dialogWidth=40;dialogHeight=30;help=0;scroll=0;status=0;");	
	callbackRefresh();
}
//*************************************************************************
//******************** 3. �澯���� ******************************************
//*************************************************************************/
/**
 * 3-1. �����澯ʱ����������
 *
 *      (1). ֻ�С����������ߡ���ȷ�ϡ��ģ����ܿ�����
 *      (2). �����¼������ܿ�����
 */
function popupEndWindow()//�����澯��������
{	
	if(oprt_state!=alarm_ack && oprt_state != alarm_process_wait)
	{
		alert("�澯���ǡ�����������ȷ�ϡ�״̬�����ܿ���!");
		return false;
	}

	//�ж�����û��Ƿ���Ȩ��
	if(!getPrivilege()){
		alert(noPrivilege);
		return false;
	}
	window.showModalDialog("endAlarm.htm",alarmId,"dialogWidth=40;dialogHeight=35;help=0;scroll=0;status=0;");

	callbackRefresh();
}

/**
 * 3-2. ��������ʱ����������
 *
 *      (1). ���ݴ����flowId, ����ͬһ���̵ĸ澯��
 */
function popupEndWorkWindow()//���������ĸ澯ȫ����������
{
	if(flowId==null || flowId=="")
	{
		alert("û�й��������ܿ�����");
		return ;
	}
	if(!confirm("��ȷ��Ҫ������ǰ�澯�Ĺ��������и澯��"))
		return;
	window.showModalDialog("endAlarmAll.htm?flowId="+flowId,null,"dialogWidth=40;dialogHeight=30;help=0;scroll=0;status=0;");	
	callbackRefresh();
}
//*************************************************************************
//******************** 4. �澯��� ******************************************
//*************************************************************************/
/**
 * 4-1. ����澯ʱ����������
 *
 *      (1). ����ǡ���ȷ�ϡ���������������ѿ������ģ����������
 */
function popupCLRWindow(flag)//�����澯�������
{
	if(oprt_state==alarm_ack)
	{
		alert("�澯��ȷ�ϣ������ٽ��и澯�������..!");
		return false;
	}
	else if(oprt_state==alarm_clean)
	{
		alert("�澯������������ٽ��и澯�������..!");
		return false;
	}
	else if(oprt_state==alarm_end)
	{
		alert("�澯�ѿ����������ٽ��и澯�������..!");
		return false;
	}
	
	//�ж�����û��Ƿ���Ȩ��
	if(!getPrivilege()){
		alert(noPrivilege);
		return false;
	}
	var temp="";
	//���澯���
	if(flag!=null && flag!="")
		temp="?flag="+flag;
	resultArr = window.showModalDialog("CLRAlarm.jsp"+temp,alarmId,"dialogWidth=40;dialogHeight=35;help=0;scroll=0;status=0;");

	callbackRefresh();
}

/**
 * 4-1-2. ����澯(����������)ʱ����������
 *
 *      (1). ����ǡ�����������ѿ������ģ����������
 */
function popupCLRWindowWithoutFlow(flag)//�����澯�������
{
	if(oprt_state==alarm_clean)
	{
		alert("�澯������������ٽ��и澯�������..!");
		return false;
	}
	else if(oprt_state==alarm_end)
	{
		alert("�澯�ѿ����������ٽ��и澯�������..!");
		return false;
	}
	var temp="";
	//���澯���
	if(flag!=null && flag!="")
		temp="?flag="+flag;
	resultArr = window.showModalDialog("CLRAlarm.jsp"+temp,alarmId,"dialogWidth=40;dialogHeight=35;help=0;scroll=0;status=0;");
	callbackRefresh();
}

//*************************************************************************
//******************** 5. �澯���� *****************************************
//*************************************************************************/
/**
 * 5-1. �����澯ʱ����������
 *
 *      (1). ����ǡ�����������ѿ������ģ�����������
 *      (2). �����¼�������������
 */
function popupUpgradeWindow()//�����澯��������
{
	if(alarmLevel==1)
	{
		alert("�澯������߼��𣬲����ٽ��и澯��������..!");
		return false;
	}
	
	if(oprt_state==alarm_clean)
	{
		alert("�澯������������ٽ��и澯��������..!");
		return false;
	}
	else if(oprt_state==alarm_end)
	{
		alert("�澯�ѿ����������ٽ��и澯��������..!");
		return false;
	}

	resultArr = window.showModalDialog("upgradeAlarm.htm?alarmLevel="+alarmLevel,alarmId,"dialogWidth=40;dialogHeight=37;help=0;scroll=0;status=0;");
	callbackRefresh();
}
/**
 * 5-1-2. �����澯(����������)ʱ����������
 *
 *      (1). ����ǡ��ѿ������ģ�����������
 *      (2). �����¼�������������
 */
function popupUpgradeWindowWithoutFlow()//�����澯��������
{
	if(alarmLevel==1)
	{
		alert("�澯������߼��𣬲����ٽ��и澯��������..!");
		return false;
	}
	if(oprt_state==alarm_end)
	{
		alert("�澯�ѿ����������ٽ��и澯��������..!");
		return false;
	}
	resultArr = window.showModalDialog("upgradeAlarm.htm?alarmLevel="+alarmLevel,alarmId,"dialogWidth=40;dialogHeight=37;help=0;scroll=0;status=0;");
	callbackRefresh();
}

//�澯�ɵ� 
function sendAlarmWork()
{
	if(oprt_state==40){
		alert("�澯������������ٽ��и澯�ɵ�����..!");
		return false;
	}else if(oprt_state==31){
		alert("�澯�ѿ����������ٽ��и澯�ɵ�����..!");
		return false;
	}
	
	if(confirm("��ȷ��Ҫ�澯�ɵ�������..?")){
		if(flowId!=null&&flowId!=""){
			if(!(confirm("�澯���ɵ�����ȷ��Ҫ���и澯���ɲ�����..?"))){
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
			MMsg("���������ɹ���");
			    currenWin.open("../../FlowCreateNext?system_code=D&tch_id="+oRows.text);
		}
	}
}

//�¼��ɵ� 
function sendEventWork()
{
	if(oprt_state==40){
		alert("�¼�������������ٽ����¼��ɵ�����..!");
		return false;
	}
	
	if(confirm("��ȷ��Ҫ�¼��ɵ�������..?")){
		if(flowId!=null&&flowId!=""){
			if(!(confirm("�¼����ɵ�����ȷ��Ҫ�����¼����ɲ�����..?"))){
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
			MMsg("���������ɹ���");
			    currenWin.open("../../FlowCreateNext?system_code=D&tch_id="+oRows.text);
		}
	}
}

//�鿴���ϵ�(Ӧ�������̴���ģ��)
function alarmFlowView() {
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	if(flowId == null||flowId=="null"||flowId==""){
		alert("�澯û����صĴ������̣�δ�ɵ�!");
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
//ԭʼ�澯��Ϣ��ѯ
function oriAlarmMsgQry()
{
	window.showModalDialog("oriAlarmMsgQry.htm",alarmId,"dialogWidth=50;dialogHeight=29;help=0;scroll=1;status=0;");
}
//ԭʼ������Ϣ��ѯ
function oriPerfMsgQry()
{
	if(perf_msg_id==0){
		alert("��ԭʼ������Ϣ����!");
		return false;
	}
    var params = "?flag=" + flag + "&perfid=" + perf_msg_id + "&lastdate=" + last_generate_time;
	window.showModalDialog("../permanager/originPerView.htm" + params,window,"dialogWidth=40;dialogHeight=31;help=0;scroll=0;status=0;");
	//window.showModalDialog("oriPerfMsgQry.htm",perf_msg_id,"dialogWidth=50;dialogHeight=29;help=0;scroll=1;status=0;");
}
//�����澯��ѯ
function relationAlarmQry(){
	window.showModalDialog("relationAlarmQry.htm",alarmId,"dialogWidth=50;dialogHeight=29;help=0;scroll=1;status=0;");
}
//�޸ĵ��¸澯������
function editAlarmRegion(){
	window.showModalDialog("editAlarmRegion.htm",alarmId,"dialogWidth=29;dialogHeight=15;help=0;scroll=1;status=0;");
}

function callbackRefresh()
{
	iniAllTextField("../../servlet/alarmMergeServlet?tag=9&alarmId="+alarmId);
	initCommonVar();
}