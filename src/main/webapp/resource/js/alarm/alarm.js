//�澯�����...todo
var oData;//��ǰtable��id
var alarm_no_work =10;//δ�ɵ�
var alarm_process_wait=30;//������
var alarm_end=31;//����
var alarm_ack = 32;//ȷ��
var alarm_clean = 40;//���
var noPrivilege ="��������ѡ�澯��������Ա!";
var currenWin;
if(typeof parentWin=="undefined")
	currenWin=window;
else
	currenWin=parentWin;
//���õ�ǰ��ҳ
function setCurrentTable()
{
	//�����б��û�ж���oMPC
	if(typeof oMPC=="undefined"){
		oData = oData1;
	}else if(oMPC.selectedIndex==0){
		oData = oData1;
	}else if(oMPC.selectedIndex==1){
	    oData = oData2; 
	}
}
//ȡ��Ȩ��
function getPrivilege(){
	//return true;
	setCurrentTable();
  	var listCheckId = oData.getPropertys("id");
  	var submitURL = "../../servlet/AlarmOperServlet?postAction=getPrivilege&alarmId="+listCheckId+"&privilege_id=205902";//205902����
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
//�澯�鲢�б�
function viewMsglist()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("��ѡ��һ��");
		return false;
	}else if(listCheckId.length>1){
		alert("ֻ��ѡ��һ��");
		return false;
	}

    resultArr = window.showModalDialog("alarmMsglist.jsp",window.oData,"dialogWidth=50;dialogHeight=20;help=0;scroll=1;status=0;");
}
//��������б�
function viewCapList()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("��ѡ��һ��");
		return false;
	}else if(listCheckId.length>1){
		alert("ֻ��ѡ��һ��");
		return false;
	}
	//����ָ��ID�ĸ澯�б�
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
		alert("û��������ܼ�¼..!");
		return false;
	}
	resultArr = window.showModalDialog("../capability/reCapabilityList.jsp?alarmId="+listCheckId,window.oData,"dialogWidth=780px;dialogHeight=550px;help=0;scroll=1;status=0;");
}
//�����澯ȷ�ϴ���
function affirmAlarm()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("��ѡ����(�ɶ�ѡ)");
		return false;
	}
	var alarmState=oData.getPropertys("alarmState"); 
	var length=alarmState.length;
	if(length==1){
		if(alarmState[0]==alarm_ack){
		alert("�澯��ȷ�ϣ������ٽ��и澯ȷ�ϲ���..!");
		return false;
		}else if(alarmState[0]==alarm_clean){
			alert("�澯������������ٽ��и澯ȷ�ϲ���..!");
			return false;
		}else if(alarmState[0]==alarm_no_work){
			alert("�澯δ�ɵ��������ٽ��и澯ȷ�ϲ���..!");
			return false;
		}
	}else{
		for(var i=0;i<length;i++){
			if(alarmState[i]==alarm_ack){
				alert("��ѡ�澯��¼����\"��ȷ��\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}else if(alarmState[i]==alarm_clean){
				alert("��ѡ�澯��¼����\"�����\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}else if(alarmState[i]==alarm_no_work){
				alert("��ѡ�澯��¼����\"δ�ɵ�\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}
		}
	}
	//�ж�����û��Ƿ���Ȩ��
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
//���������ĸ澯ȫ��ȷ�ϴ���
function affirmAlarmWork(){
	setCurrentTable();
	if(flowIdT==null){		
		MMsg("���еĸ澯����ͬһ�����ϵ��ϣ�����ȫ��ȷ�ϣ�");
		return ;
	}
	if(!confirm("��ȷ��Ҫȷ�ϵ�ǰ���������и澯��"))
		return;
	resultArr = window.showModalDialog("confirmAlarmAll.jsp?flowId="+flowIdT,window.oData,"dialogWidth=30;dialogHeight=15;help=0;scroll=0;status=0;");	
	if(resultArr==null || typeof resultArr=='undefined')
	{
	    oData.doRefresh(false);
	}
}
//�����澯�������
function cancelAlarm()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("��ѡ����(�ɶ�ѡ)");
		return false;
	}
	var alarmState=oData.getPropertys("alarmState"); 
	var length=alarmState.length;
	if(length==1){
		if(alarmState[0]==alarm_ack){
			alert("�澯��ȷ�ϣ������ٽ��и澯�������..!");
			return false;
		}else if(alarmState[0]==alarm_clean){
			alert("�澯������������ٽ��и澯�������..!");
			return false;
		}else if(alarmState[0]==alarm_end){
			alert("�澯�ѿ����������ٽ��и澯�������..!");
			return false;
		}
	}else{
		for(var i=0;i<length;i++){
			if(alarmState[i]==alarm_ack){
				alert("��ѡ�澯��¼����\"��ȷ��\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}else if(alarmState[i]==alarm_clean){
				alert("��ѡ�澯��¼����\"�����\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}else if(alarmState[i]==alarm_end){
				alert("��ѡ�澯��¼����\"�ѿ���\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}
		}//for��ѭ��
	}
	//�ж�����û��Ƿ���Ȩ��
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
//�����澯��������
function upgradeAlarm()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("��ѡ����(�ɶ�ѡ)");
		return false;
	}
	var alarmLevel=oData.getPropertys("alarmLevel"); 
	if(alarmLevel==1){
		alert("�澯������߼��𣬲����ٽ��и澯��������..!");
		return false;
	}
	var alarmState=oData.getPropertys("alarmState"); 
	var length=alarmState.length;
	if(length==1){
		if(alarmState[0]==40){
		alert("�澯������������ٽ��и澯��������..!");
		return false;
	}else if(alarmState[0]==31){
		alert("�澯�ѿ����������ٽ��и澯��������..!");
		return false;
	}
	}else{
		for(var i=0;i<length;i++){
			if(alarmState[i]==40){
				alert("��ѡ�澯��¼����\"�����\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}else if(alarmState[i]==31){
				alert("��ѡ�澯��¼����\"�ѿ���\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}
		}//for��ѭ��
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
//�澯�ɵ� 
function sendAlarmSubmit()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("��ѡ����(�ɶ�ѡ)");
		return false;
	}
	var alarmState=oData.getPropertys("alarmState"); 
	var length=alarmState.length;
	if(length==1){
		if(alarmState[0]==40){
			alert("�澯������������ٽ��и澯�ɵ�����..!");
			return false;
		}else if(alarmState[0]==31){
			alert("�澯�ѿ����������ٽ��и澯�ɵ�����..!");
			return false;
		}
	}else{
		for(var i=0;i<length;i++){
			if(alarmState[i]==40){
				alert("��ѡ�澯��¼����\"�����\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}else if(alarmState[i]==31){
				alert("��ѡ�澯��¼����\"�ѿ���\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}
		}//for��ѭ��
	}
	
	var flowId=oData.getPropertys("flowId"); //�жϵ�ǰ�澯��¼�Ƿ��Ѿ��ɵ�����������ID�����ɵ�
	if(confirm("��ȷ��Ҫ�澯�ɵ�������..?")){
		if(flowId!=null&&flowId!="null"&&flowId!=""){
			if(!(confirm("�澯���ɵ�����ȷ��Ҫ���и澯���ɲ�����..?"))){
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
			MMsg("���������ɹ���");
		    if(neIdT=="")
			    window.open("../../FlowCreateNext?system_code=D&tch_id="+oRows.text);
		    else
			    window.dialogArguments.open("../../FlowCreateNext?system_code=D&tch_id="+oRows.text);
		}
	}
	oData.doRefresh(false);
}
//�¼��ɵ� 
function sendEventWork()
{
	var alarmMergeUrl = "../../servlet/alarmMergeServlet?";
	setCurrentTable();
	var alarmIds = oData.getPropertys("id");
	if(alarmIds.length==0){
		alert("��ѡ����(�ɶ�ѡ)");
		return false;
	}
	var alarmState=oData.getPropertys("alarmState"); 
	var alarmClass=oData.getPropertys("alarmClass"); 
	var length=alarmState.length;
	if(length==1){
		if(alarmState[0]==40){
			alert("�¼�������������ٽ����¼��ɵ�����..!");
			return false;
		}
	}else{
		for(var i=0;i<length;i++){
			if(alarmState[i]==40){
				alert("��ѡ�¼���¼����\"�����\"״̬���¼���������ѡ��..!");
				return false;
			}
			if((alarmClass[i]==null || alarmClass[i]=="") || (alarmClass[i]!=9 && alarmClass[i]!="9")){
				alert("��ѡ�¼���¼�а����澯��������ѡ��..!");
				return false;
			}
		}//for��ѭ��
	}
	
	var flowId=oData.getPropertys("flow_id"); //�жϵ�ǰ�¼���¼�Ƿ��Ѿ��ɵ�����������ID�����ɵ�
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
			    window.open("../../FlowCreateNext?system_code=D&tch_id="+oRows.text);
		}
	}
	oData.doRefresh(false);
}
//�鿴
function viewAlarm()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("��ѡ��һ��");
		return false;
	}else if(listCheckId.length>1){
		alert("ֻ��ѡ��һ��");
		return false;
	}
	//resultArr = window.showModalDialog("viewAlarmInfo.jsp",window.oData,"dialogWidth=57;dialogHeight=46;help=0;scroll=0;status=0;");
	var alarmIds = oData.getPropertys("id");
	var	alarmId = window.oData.getPropertys("id")[0];
	currenWin.open("../alarmManage/viewAlarmInfo.htm?alarmId="+alarmId,'_blank',"resizable=1;top=0;left=0;help=0;scroll=0;status=0;");
}
//�鿴���ϵ�(Ӧ�������̴���ģ��)
function alarmFlowView() {
	setCurrentTable();
	var alarmId = oData.getPropertys("id");
	if(alarmId.length==0){
		alert("��ѡ��һ��");
		return false;
	}else if(alarmId.length>1){
		alert("ֻ��ѡ��һ��");
		return false;
	}
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var flowId=oData.getPropertys("flowId"); //�жϵ�ǰ�澯��¼�Ƿ��Ѿ��ɵ�����������ID�����ɵ�
	if(flowId == null||flowId=="null"||flowId==""){
		alert("�澯û����صĴ������̣�δ�ɵ�!");
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

//�����澯��������
function endAlarm()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("��ѡ����(�ɶ�ѡ)");
		return false;
	}
	var alarmState=oData.getPropertys("alarmState"); 
	var length=alarmState.length;
	if(length==1){
		if(alarmState[0]!=32){
			alert("�澯���ǡ���ȷ�ϡ�״̬�����ܿ���!");
			return false;
		}
	}else{
		for(var i=0;i<length;i++){
			if(alarmState[i]!=32){
				alert("��ѡ�澯��¼��������\"��ȷ��\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}
		}
	}
	//�ж�����û��Ƿ���Ȩ��
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

//������ǰ���̵����и澯��������
function endAlarmWork()
{
	setCurrentTable();
	if(flowIdT==null){		
		MMsg("���еĸ澯����ͬһ�����ϵ��ϣ�����ȫ��������");
		return ;
	}
	if(!confirm("��ȷ��Ҫ������ǰ���������и澯��"))
		return;
	resultArr = window.showModalDialog("endAlarmAll.jsp?flowId="+flowIdT,window.oData,"dialogWidth=30;dialogHeight=15;help=0;scroll=0;status=0;");	
	if(resultArr==null || typeof resultArr=='undefined')
	{
	    oData.doRefresh(false);
	}
}
//�澯ȷ��
function affirmAlarmSubmit(bClosed)
{
	var listCheckId = getParams;
	if(!confirm("��ȷ��Ҫ���и澯ȷ�ϲ�����(�澯�����������º�̨����ʱ�佫�п����Գ��������ĵȴ�...)"))
		return;
	var submitURL;
	if( typeof confirmFlowId=='undefined'||confirmFlowId ==null)	
		//���������澯ȷ��
		submitURL = "../../servlet/AlarmOperServlet?alarmTag=1&alarmId="+listCheckId;
	else
		//���������и澯ȷ��
		submitURL = "../../servlet/AlarmOperServlet?alarmTag=9&flowId="+confirmFlowId;
	var submitXML = new ActiveXObject("Microsoft.XMLDOM");
	var root = submitXML.createElement("root");
	var value = oprtResult.value;
	if(!value.hasText()){
		MMsg("�Բ��𣬴���������Ϊ�գ������ύ��");		  		
		return;
	}
	root.setAttribute("oprtResult",oprtResult.value);
	submitXML.appendChild(root);  
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",submitURL,false);
	xmlhttp.send(submitXML);
	if(isSuccess(xmlhttp))
	{
		MMsg("�����ɹ���");
	}
	if(bClosed)
		window.close();
}
//�澯���  type=40
function cancelAlarmSubmit(bClosed)
{
	var listCheckId = getParams;
	if(!confirm("��ȷ��Ҫ���и澯���������"))
		return;
	var submitURL = "../../servlet/AlarmOperServlet?alarmTag=2&alarmId="+listCheckId;
	var submitXML = new ActiveXObject("Microsoft.XMLDOM");
	var root = submitXML.createElement("root");
	var value = oprtResult.value;
	if(!value.hasText()){
		MMsg("�Բ��𣬴���������Ϊ�գ������ύ��");
		return;
	}
	root.setAttribute("oprtResult",oprtResult.value);
	submitXML.appendChild(root);  
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",submitURL,false);
	xmlhttp.send(submitXML);
	if(isSuccess(xmlhttp))
	{
		MMsg("�����ɹ���");
	}
	if(bClosed)
		window.close();
}
//�澯���� type=90
function upgradeAlarmSubmit(bClosed)
{
	var listCheckId = getParams;
	if(alarmLevel.value==""){
		alert("�澯������Ϊ��..!");
		return false;
	}
	var value = oprtResult.value;
	if(!confirm("��ȷ��Ҫ�澯����������"))
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
		MMsg("�����ɹ���");
	}
	if(bClosed)
		window.close();
}
//����
function endAlarmSubmit(bClosed)
{
	var listCheckId = getParams;
	if(!confirm("��ȷ��Ҫ���и澯����������(�澯�����������º�̨����ʱ�佫�п����Գ��������ĵȴ�...)"))
		return;
	var submitURL;
	if( typeof endFlowId=='undefined'||endFlowId ==null)	
		//���������澯����
		submitURL = "../../servlet/AlarmOperServlet?alarmTag=4&alarmId="+listCheckId;
	else
		//���������и澯����
		submitURL = "../../servlet/AlarmOperServlet?alarmTag=5&flowId="+endFlowId;	
	var submitXML = new ActiveXObject("Microsoft.XMLDOM");
	var root = submitXML.createElement("root");
	var value = oprtResult.value;
	if(!value.hasText()){
		value ="ͬȷ��";		  		
	}
	root.setAttribute("oprtResult",value);
	submitXML.appendChild(root);  
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",submitURL,false);
	xmlhttp.send(submitXML);
	if(isSuccess(xmlhttp))
	{
		MMsg("�����ɹ���");
	}
	if(bClosed)
		window.close();
}

//���Ӵ������
function addOperAlarmSubmit()
{
	setCurrentTable();
	var listCheckId = oData.getPropertys("id");
	if(listCheckId.length==0){
		alert("��ѡ����(�ɶ�ѡ)");
		return false;
	}
	var alarmState=oData.getPropertys("alarmState"); 
	var length=alarmState.length;
	if(length==1){
		if(alarmState[0]==10){
			alert("�澯δ�ɵ����������Ӵ������!");
			return false;
		}else if(alarmState[0]==31){
			alert("�澯�ѿ������������Ӵ������!");
			return false;
		}else if(alarmState[0]==40){
			alert("�澯��������������Ӵ������!");
			return false;
		}
	}else{
		for(var i=0;i<length;i++){
			if(alarmState[i]==10){
				alert("��ѡ�澯��¼����\"δ�ɵ�\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}else if(alarmState[i]==31){
				alert("��ѡ�澯��¼����\"�ѿ���\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}else if(alarmState[i]==40){
				alert("��ѡ�澯��¼����\"�����\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}
		}//for��ѭ��
	}
	//�ж�����û��Ƿ���Ȩ��
	if(!getPrivilege()){
		alert(noPrivilege);
		return false;
	}  
	resultArr = window.showModalDialog("operAlarm.jsp",window.oData,"dialogWidth=30;dialogHeight=15;help=0;scroll=0;status=0;");
}