xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var alarmMergeUrl = "../../servlet/alarmMergeServlet?";//�澯�鲢
var submitURL;
var returnXml;//�ӷ���˷��ص�XML��

var oData;                //��ǰtable��id
///////////////// 

var alarm_state_no_clear = 0  ; //�澯״̬��δ���
var alarm_state_clear    = 1  ; //�澯״̬�������

var oprt_state_no_oprt   = 10 ; //����״̬��δ����
var oprt_state_ack       = 20 ; //����״̬��ȷ��
var oprt_state_spd       = 25 ; //����״̬������
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
var reFreshFlag = 0;//ˢ�±��,�ж��Ƿ������������ӽ�����,����Ǳ��Ϊ1,˵��Ҫˢ��

var comeFrom = "";
var alarmType = "";

var step =200;//���������澯ʱ��ÿ�δ���ĸ澯����
var isAlarmPageUseTemplate;
//��ʼ��������
function iniOprtResult(){
	var params = window.dialogArguments;
	if(typeof(alarmIds)=='undefined' || typeof(alarmIds)=='object' ){		
		if(params.alarmId){
			
			alarmIds = params.alarmId;
		}
		else{
			alarmIds = params[0];
		}		
	}
	
	var oexpert_advice = document.getElementById("expert_advice");
	if(alarmIds.length==1)alarmIds = alarmIds[0];
	if(typeof(alarmIds)=='number' || (typeof(alarmIds)=='string'&& (alarmIds. indexOf(",") == -1))){
		//��дԭ���Ĵ������
		submitURL = alarmMergeUrl + "tag=10&alarmId="+alarmIds;
		xmlhttp.Open("POST",submitURL,false);
		xmlhttp.send();
		returnXml = new ActiveXObject("Microsoft.XMLDOM");
		returnXml.load(xmlhttp.responseXML);
		returnXml.async = false;
		var oRow = returnXml.selectSingleNode("/root/rowSet/OPRT_RESULT");
		if(oRow!=null){
			if(document.getElementById("oprtResultOld")){
				document.getElementById("oprtResultOld").value = oRow.text;
			}
		}
		var nProPheno= returnXml.selectSingleNode("/root/rowSet/PRO_PHENO");
		if(nProPheno !=null){
				document.getElementById("proPheno").value=nProPheno.text;
		}
		
		var nProReason= returnXml.selectSingleNode("/root/rowSet/PRO_REASON");
		if(nProReason !=null){
				document.getElementById("proReason").value=nProReason.text;
		}
		
		var nMeasures= returnXml.selectSingleNode("/root/rowSet/MEASURES");
		if(nMeasures !=null){
				document.getElementById("measures").value=nMeasures.text;
		}
		
		var nAftermath= returnXml.selectSingleNode("/root/rowSet/AFTERMATH");
		if(nAftermath !=null){
				document.getElementById("aftermath").value=nAftermath.text;
		}

		var nExpertAdvice = returnXml.selectSingleNode("/root/rowSet/EXPERT_ADVICE");
		if (nExpertAdvice != null && oexpert_advice) {
			oexpert_advice.value = nExpertAdvice.text;
		}
	}
	if(oexpert_advice!=null){
		if(params.expertAdvice){
			oexpert_advice.value = params.expertAdvice;
	  }
	}
	//��ɽ��
	if(params.aftermath){
		aftermath.innerText = params.aftermath;
  }
		var useTemp =false;
		alarmType = params.alarmType;
		useTemp = isUseTemplate();
		if(!useTemp){
			document.getElementById("proReason").style.display='block';
		  document.getElementById("measures").style.display='block';
		  
		  var measures_temp = document.getElementById("measures_temp");
		  var reason_temp =  document.getElementById("reason_temp");
		  var mParent = measures_temp.parentElement;
		  var rParent = reason_temp.parentElement;
		  mParent.removeChild(measures_temp);
		  rParent.removeChild(reason_temp);
		}
		else{
		
			document.getElementById("proReason").style.display='none';
			document.getElementById("measures").style.display='none';
			if(params.proPheno){
				document.getElementById("proPheno").value=params.proPheno;
		  }
		
		  
		  if(params.proReasons){
				//����ԭ��
				var proReasons=params.proReasons;
				if(proReasons.length>0){
					for(var i=0,len = proReasons.length;i<len;i++){
						var tmpName = "";
						var tmpRemark = "";
						tmpName = proReasons[i].name;
						tmpRemark =proReasons[i].detail;
						addTemRow('zhchsReason','sltReasonTemplate',tmpName,tmpRemark);						
					}		
				}
		 	}
		
		  if(params.measures){
				//��ȡ��ʩ		
				var meass = params.measures;
					 if(meass.length>0){
						for(var i=0,len = meass.length;i<len;i++){
							var tmpName = "";
							var tmpRemark = "";
							tmpName = meass[i].name;
							tmpRemark =  meass[i].detail;					
							addTemRow('zhchs','sltTemplate',tmpName,tmpRemark);	
						}		
					}
			}
		}
}

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
function getPrivilege(isInfoPage){
	if(!isInfoPage){
		setCurrentTable();
	  	var flowIds = oData.getPropertys("flow_id");
	  	submitURL = alarmMergeUrl + "tag=8&flowIds="+flowIds;  	
	 	getServeXML()	
		var row=returnXml.selectSingleNode("/root/Privilege");
		if(row.text == "false")
			return false;
		else 
			return true;
	}else return true;
}

//*************************************************************************
//******************** 1. �澯�鿴 *****************************************
//*************************************************************************/
/**
 * 1-1. �Ķ��澯
 *
 */
function viewAlarm()
{
	setCurrentTable();
	var alarmIds = oData.getPropertys("id");
    var flag = oMPC.selectedIndex;
    if(typeof alarmOprtConfig != "undefined") {
    	flag = (alarmOprtConfig.systemType=="2"?"":alarmOprtConfig.systemType);
    }
    
	if(alarmIds.length==0)
	{
		alert("��ѡ��һ��");
		return false;
	}
	else if(alarmIds.length>1)
	{
		alert("ֻ��ѡ��һ��");
		return false;
	}
	var	alarmId = window.oData.getPropertys("id")[0];
	//����Ǵ���Ԫ���򿪵ĸ澯��Ϣҳ�棬�������ɾ����ʱ����Ҫ����ˢ��
	var neParam = (comeFrom == "neTree")?"&comeFrom=neTree&isRefresh=true&refreshFunc=window.opener.top.frames[0].window.loadAlarmLevel()":"";
	currenWin.open("viewAlarmInfo.htm?alarmId="+alarmId+"&flag="+flag+ neParam,'_blank',"resizable=1,scrollbars=1,top=0,left=0,help=0,status=0");
}

//*************************************************************************
//******************** 2. �澯ȷ�� ******************************************
//*************************************************************************/
/**
 * 2-1. ȷ�ϸ澯ʱ����������
 *
 *      (1). ���������ɾ���ĸ澯�����ٽ��и澯ȷ�ϣ���ѡ�������¼ʱ����һ���������ɾ����Ҳ����
 *      (2). isInfoPage true��ʾ�澯��ϸҳ����� falseΪ�鲢�澯�б����
 *      (3). ifWorker ��ʾ�Ƿ��ɵ� 1 ��ʾ�ɵ�ϵͳ 0��ʾ���ɵ�ϵͳ
 */
function popupACKWindow(isInfoPage,ifWorker)//�����澯ȷ�ϴ���
{
	var vState="";
	var length=0;
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0)
		{
			alert("��ѡ����(�ɶ�ѡ)");
			return false;
		}
		var tFirst=0;
		//var SalarmState=oData.getPropertys("alarmState");// �澯״̬
		var SoprtState=oData.getPropertys("oprtState");  //����״̬
		//var SalarmClass=oData.getPropertys("alarmClass");// �澯����
		length=SoprtState.length;
		if(length==1)
			vState=SoprtState[0];
	}else{
		var alarmIds=alarmId;
		vState=oprtState;
		length=1;
	}
	if(length==1)
	{
		if(vState.isInArray([oprt_state_spd,oprt_state_clear,oprt_state_del]))
		{
			alert("�澯�Ѿ������������ɾ�������ܽ��и澯ȷ�ϲ���..!");
			return;
		}
	}else{
		for(var i=0;i<length;i++)
		{
			if(SoprtState[i].isInArray([oprt_state_spd,oprt_state_clear,oprt_state_del]))
			{
				alert("��ѡ�澯��¼�����Ѿ������������ɾ���ĸ澯��������ѡ��..!");
				return;
			}
		}
	}

	var params = fetchReasonSolve(alarmIds,ifWorker);
	var rnd = Math.random()*100;
	if(length==1){
		window.showModalDialog("ACKAlarm.htm?rnd="+rnd,params,"dialogWidth=40;dialogHeight=70;help=0;scroll=0;status=0;");
	}else{
		window.showModalDialog("ACKAlarmAll.htm?rnd="+rnd,params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");
	}
	
	if(!isInfoPage)
		oData.doRefresh(false);
		
	//����Ǵ���Ԫ�����ӹ����ģ�ֻ�������ɾ����������Ҫִ�и��¸澯����Ĳ���
	//��ʱ��ˢ�º�������Ԫ���ж���ģ�������ˢ����Ԫ���ĸ澯����
	if(comeFrom == "neTree") {
		return;
	} 
	callbackRefresh(isInfoPage);
}

function fetchReasonSolve(_alarmId,_ifWorker){
	this.alarmId = _alarmId;
	this.ifWorker = _ifWorker;
	this.expertAdvice = '';
	if(document.getElementById("oExpert_advice")){
		this.expertAdvice = document.getElementById("oExpert_advice").innerText;
	}
	
	this.proReasons = [];
	var zhchsReason = document.getElementById("zhchsReason");
	if(zhchsReason){
		for(var i=1,len=zhchsReason.rows.length;i<len;i++){
			var sNo = zhchsReason.rows[i].cells[0].innerText;
			var sName =zhchsReason.rows[i].cells[1].innerText;
			var sDetail= zhchsReason.rows[i].cells[2].children[0].value;
			this.proReasons.push({no:sNo,name:sName,detail:sDetail});
		}
	}
	
	this.measures =[];
	var zhchs  = document.getElementById("zhchs");
	if(zhchs){
		for(var i=1,len=zhchs.rows.length;i<len;i++){
			var sNo = zhchs.rows[i].cells[0].innerText;
			var sName =zhchs.rows[i].cells[1].innerText;
			var sDetail= zhchs.rows[i].cells[2].children[0].value;
			this.measures.push({no:sNo,name:sName,detail:sDetail});
		}
	}
	
	this.alarmType = '';
	this.aftermath = '';
	//�б����
	if(typeof(oData)!='undefined'){
		var rowDoc = oData.getSelectedRowXML();
		if(rowDoc!=null){
			var alarmTypeNode=rowDoc.selectSingleNode("//rowSet/ALARM_TYPE");
			if(alarmTypeNode){
				this.alarmType = alarmTypeNode.text;
			}
		}
	}
	else{//��ϸҳ�����
		if(typeof(ori_alarm_type)!='undefined'){
			var _alarmType = ori_alarm_type.innerText;
			if(_alarmType!=null && typeof(_alarmType)!='undefined'){
				this.alarmType = _alarmType;
			}
		}
	}
	
	this.aftermath ='';
	if(document.getElementById("aftermath")!=null){
			this.aftermath = document.getElementById("aftermath").innerText;
	}
	 
	this.proPheno ='';
	if(document.getElementById("pro_Pheno")!=null){
			this.proPheno = document.getElementById("pro_Pheno").innerText;
	}
	
	return this;
}

/**
 * 2-2. ȷ�Ϲ���ʱ����������
 *
 *      (1). ���ݴ����flowId, ȷ��ͬһ���̵ĸ澯��
 */
function popupACKWorkWindow(isInfoPage)//���������ĸ澯ȫ��ȷ�ϴ���
{
	var ErrMsg="";
	if(isInfoPage){
		ErrMsg="�ø澯δ�ɵ������ܹ���ȷ��!";
	}else {
		ErrMsg="�ø澯δ�ɵ�����ѡ�ĸ澯����ͬһ�����ϵ��ϣ����ܹ���ȷ�ϣ�";
		setCurrentTable();
	}
	
	var inflowId;
	var alarmIds;
	if(!isInfoPage){
		alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0)
		{
			alert("��ѡ����(�ɶ�ѡ)");
			return false;
		}
		if(flowId==null || flowId==""){
  			var flowIds = oData.getPropertys("flow_id");
  			var cnt=flowIds.length;
			inflowId=flowIds[0];
			if(inflowId==""){
				MMsg(ErrMsg);
				return ;				
			}
  			if(cnt>0){
				for(var i=1;i<cnt;i++){					
					if(flowIds[i]!=inflowId){
						MMsg(ErrMsg);
						return ;
					}
				}
			}
		}else inflowId=flowId;		
	}else{
		alarmIds=alarmId;
		if(flowId==null || flowId=="")
		{
			MMsg(ErrMsg);
			return ;
		}else inflowId=flowId;
	}
	
	if(typeof inflowId == "undefined") {//Update by guoyg
		MMsg("û�ж�Ӧ�Ĺ����ţ�������ȷ�ϣ�");
		return;
	}
	if(!confirm("��ȷ��Ҫȷ�ϵ�ǰ���������и澯��"))
		return;
	
	var params = fetchReasonSolve(alarmIds,"1");	
	window.showModalDialog("ACKAlarmAll.htm?flowId="+inflowId,params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");	
	if(!isInfoPage)
		oData.doRefresh(false);
		
	//����Ǵ���Ԫ�����ӹ����ģ�ֻ�������ɾ����������Ҫִ�и��¸澯����Ĳ���
	//��ʱ��ˢ�º�������Ԫ���ж���ģ�������ˢ����Ԫ���ĸ澯����
	if(comeFrom == "neTree") {
		return;
	} 
	callbackRefresh(isInfoPage);
}

/**
 * 2-3. ȷ��ȫ���澯ʱ����������
 *
 *      (1). ֻ��ȷ�ϡ���Ȩ�ޡ��ĸ澯��
 */
function popupACKAllWindow(ifWorker)//������ѯ����ĸ澯ȫ��ȷ�ϴ���
{
	setCurrentTable(); 
	
	if(!confirm("��ȷ��Ҫȷ�ϵ�ǰ��ѯ��������и澯��"))
		return;
	var alarmIds;
	var dom = new ActiveXObject("Microsoft.XMLDOM");
	dom.loadXML(getSearchXmlStr());
	//alert(dom.xml)
	submitURL = alarmMergeUrl + "tag=13"+getSearchParam();  
	getServeXML(dom)
	var error_code = xmlhttp.responseXML.selectSingleNode("/root/error_code");
	if(ifWorker=="1" && error_code==null)
	{
		MMsg("����������������ĸ澯,���ܲ�����,��ѡ������������ĸ澯��");
		return;
	}
	var row=returnXml.selectSingleNode("/root/ALARM_ID");
	alarmIds = row.text;
	if(alarmIds==''){
		alert('��ǰҳû�п�ȷ�ϵĸ澯');
		return false;
	}
	var alarmIdArray=alarmIds.split(",");
	if(alarmIdArray.length>1000){
		alert('��ǰ׼��ȷ�ϵĸ澯������1000�����޷�ȫ��ȷ��');
		return;
	} 	
	var params = fetchReasonSolve(alarmIds,ifWorker);
	window.showModalDialog("ACKAlarmAll.htm",params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");
	oData.doRefresh(false);
	
	//����Ǵ���Ԫ�����ӹ����ģ�ֻ�������ɾ����������Ҫִ�и��¸澯����Ĳ���
	//��ʱ��ˢ�º�������Ԫ���ж���ģ�������ˢ����Ԫ���ĸ澯����
	if(comeFrom == "neTree") {
		return;
	} 	
	callbackRefresh();
}

/**
 * 2-4. ȷ�ϲ���
 * 
 */
function ACKAlarm(bClosed)//�澯ȷ��
{
	var alarmValidity = document.getElementById('alarmValidity').value;
	var invalidReasonCode = document.getElementById('invalidReason').value;
	
	if(alarmValidity == '0SX' && invalidReasonCode == "")
	{
		alert("��ѡ����Чԭ��");
		return;
	}
	
	var errorXML="";
    var flag=true;
    var sumDealNums=0;
    var errorNums=0;
	if(!confirm("��ȷ��Ҫ���и澯ȷ�ϲ�����(�澯�����������º�̨����ʱ�佫�п����Գ��������ĵȴ�...)"))
		return;
	if(!validateData())return;
	var value = oprtResult.value;
	if(!value.hasText()){
		value = "��";
	}
	var cId="";
	
	if( typeof currentFlowId=='undefined'||currentFlowId ==null){
		//���� �����澯ȷ��
		submitURL = alarmMergeUrl + "tag=11&oprtResult="+encodeURIComponent(value);  
		cId="";
	}
	else{
		//���������и澯ȷ��
		submitURL = alarmMergeUrl + "tag=12&flowId="+currentFlowId+"&oprtResult="+encodeURIComponent(value);
		cId=currentFlowId;
	}

	if(alarmIds != null) {
		var alarmItems = (new String(alarmIds)).split(",");
		
		var reTimes = Math.ceil(alarmItems.length / step);
		
		for(var i=0;i<reTimes;i++) {
			/*if(reTimes > 1) {//ֻ�зֶ�β���ʱ�������û�ȷ�ϲ������
				alert("�����ĵȴ���" + (i + 1) + "�β����������,��" + reTimes + "��");
			}*/
			
			var sAlarmIds = "";
			
			for(var j=i*step;j<alarmItems.length && j<(i+1)*step;j++) {
				sAlarmIds +=  "," + alarmItems[j]; 
			}
			sAlarmIds = sAlarmIds.replace(",","");
			setReasonSolveRows();
			var expertAdviceXML= "";
			if(typeof(expert_advice)!='undefined'){
				expertAdviceXML= '<expertAdvice>'+xmlEncode(document.getElementById("expert_advice").value)+'</expertAdvice>';
			}
			var measures,proReason;
			var arr = getInfo();
			measures = arr[0];
			proReason = arr[1];
			var sendXML='<?xml version="1.0" encoding="gb2312"?>'
			           +  '<root>'
			           +     '<alarmId>'+sAlarmIds+'</alarmId>'
			           +     '<flowId>'+cId+'</flowId>'
			           +     '<tFirst>'+tFirst+'</tFirst>'
			           +     '<oprtResult>'+xmlEncode(document.getElementById("oprtResult").value)+'</oprtResult>'
			           +	 '<expertAdvice>'+xmlEncode(document.getElementById("expert_advice").value)+'</expertAdvice>'
			           +     '<proPheno>'+xmlEncode(document.getElementById("proPheno").value)+'</proPheno>'
			           +     '<proReason>'+proReason+'</proReason>'
			           +     '<measures>'+measures+'</measures>'
			           +     '<aftermath>'+xmlEncode(document.getElementById("aftermath").value)+'</aftermath>'
			           +     '<alarmValidity>'+alarmValidity+'</alarmValidity>'           
			           +     '<invalidReasonCode>'+invalidReasonCode+'</invalidReasonCode>'
			           +     expertAdviceXML
			           +     '<ifWorker>'+ifworker+'</ifWorker>'
			           +  '</root>';
	
			var dom = new ActiveXObject("Microsoft.XMLDOM");
			dom.loadXML(sendXML);
			xmlhttp.Open("POST",submitURL,false);
			xmlhttp.send(dom);
			if(isSuccess(xmlhttp)){
				dom.loadXML(xmlhttp.responseXML.xml);
				var alarmNums=dom.selectSingleNode("/root/alarmNum").text;
				var dealNums=dom.selectSingleNode("/root/dealNum").text;
				errorNums+=(Number(alarmNums)-Number(dealNums));
				sumDealNums+=Number(dealNums);
				if(alarmNums!=dealNums){
					
					var dealNumsErrors=xmlhttp.responseXML.selectSingleNode("/root");
				    errorXML+=dealNumsErrors.xml;
					flag=false;
				}
			} else {
				flag = false;
				break;
			}
		}
		if(flag==false){
			var params ={};
			params['errorXML']=errorXML;
			params['sumDealNums']=sumDealNums;
			params.errorNums=errorNums;
			window.showModalDialog("AlarmDealResult.htm",params,"dialogWidth=140;dialogHeight=20;help=0;scroll=0;status=0;");
		} else {
			alert("ȷ�ϳɹ���");
		}
	}
	if(bClosed)
		window.close();
	
}

//*************************************************************************
//******************** 3. �澯���� ******************************************
//*************************************************************************/
/**
 * 3.1 �����澯���𴰿�
 * �����澯���𴰿�,isInfoPage�Ƿ�����ϸ��Ϣҳ�棬ifWorker�Ƿ���Ҫ����У��
 */
function popupSPDWindow(isInfoPage,ifWorker) {//�����澯���𴰿�
	var vState="";
	var length=0;
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0)
		{
			alert("��ѡ����(�ɶ�ѡ)");
			return false;
		}
		var tFirst=0;
		//var SalarmState=oData.getPropertys("alarmState");// �澯״̬
		var SoprtState=oData.getPropertys("oprtState");  //����״̬
		//var SalarmClass=oData.getPropertys("alarmClass");// �澯����
		length=SoprtState.length;
		if(length==1)
			vState=SoprtState[0];
	}else{
		var alarmIds=alarmId;
		vState=oprtState;
		length=1;
	}
	
	if(length==1)
	{
		if(vState.isInArray([oprt_state_clear,oprt_state_del]))
		{
			alert("�澯�Ѿ��������ɾ�������ܽ��и澯ȷ�ϲ���..!");
			return;
		}
	}else{
		for(var i=0;i<length;i++)
		{
			if(SoprtState[i].isInArray([oprt_state_clear,oprt_state_del]))
			{
				alert("��ѡ�澯��¼�����Ѿ��������ɾ���ĸ澯��������ѡ��..!");
				return;
			}
		}
	}

	var params = fetchReasonSolve(alarmIds,ifWorker);
	if(length==1){
		window.showModalDialog("SPDAlarm.htm",params,"dialogWidth=40;dialogHeight=70;help=0;scroll=0;status=0;");
	}else{
		window.showModalDialog("SPDAlarmAll.htm",params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");
	}
	if(!isInfoPage)
		oData.doRefresh(false); 

	//����Ǵ���Ԫ�����ӹ����ģ�ֻ�������ɾ����������Ҫִ�и��¸澯����Ĳ���
	//��ʱ��ˢ�º�������Ԫ���ж���ģ�������ˢ����Ԫ���ĸ澯����
	if(comeFrom == "neTree") {
		return;
	} 	
	callbackRefresh(isInfoPage);
}

/**
 * 3.2. ��������ʱ����������
 * ���ݴ����flowId, ����ͬһ���̵ĸ澯
 */
function popupSPDWorkWindow(isInfoPage)//���������ĸ澯ȫ�����𴰿�
{
	var ErrMsg="";
	if(isInfoPage){
		ErrMsg="�ø澯δ�ɵ������ܹ�������!";
	}else {
		ErrMsg="�ø澯δ�ɵ�����ѡ�ĸ澯����ͬһ�����ϵ��ϣ����ܹ�������";
		setCurrentTable();
	}
	
	var inflowId;
	if(!isInfoPage){
		if(flowId==null || flowId==""){
  			var flowIds = oData.getPropertys("flow_id");
  			var cnt=flowIds.length;
			inflowId=flowIds[0];
			if(inflowId==""){
				MMsg(ErrMsg);
				return ;				
			}
  			if(cnt>0){
				for(var i=1;i<cnt;i++){					
					if(flowIds[i]!=inflowId){
						MMsg(ErrMsg);
						return ;
					}
				}
			}
		}else inflowId=flowId;		
	}else{
		if(flowId==null || flowId=="")
		{
			MMsg(ErrMsg);
			return ;
		}else inflowId=flowId;
	}
	
	if(typeof inflowId == "undefined") {//Update by guoyg
		MMsg("û�ж�Ӧ�Ĺ����ţ�������ȷ�ϣ�");
		return;
	}
	if(!confirm("��ȷ��Ҫ����ǰ���������и澯��"))
		return;
	/**
	var params = new Array();
	params.push("");
	params.push("1");
	*/
	var params = {
		alarmId: "",
		ifWorker: "1"
	}
	window.showModalDialog("SPDAlarmAll.htm?flowId="+inflowId,params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");	
	if(!isInfoPage)
		oData.doRefresh(false);

	//����Ǵ���Ԫ�����ӹ����ģ�ֻ�������ɾ����������Ҫִ�и��¸澯����Ĳ���
	//��ʱ��ˢ�º�������Ԫ���ж���ģ�������ˢ����Ԫ���ĸ澯����
	if(comeFrom == "neTree") {
		return;
	} 		
	callbackRefresh(isInfoPage);
}

/**
 * 3.3. ����ȫ���澯ʱ����������
 * ֻ�ܹ�����Ȩ�ޡ��ĸ澯��
 */
function popupSPDAllWindow(ifWorker)//������ѯ����ĸ澯ȫ�����𴰿�
{
	setCurrentTable(); 
	
	if(!confirm("��ȷ��Ҫ����ǰ��ѯ��������и澯��"))
		return;
	var alarmIds;
	var dom = new ActiveXObject("Microsoft.XMLDOM");
	dom.loadXML(getSearchXmlStr());
	//alert(dom.xml)
	submitURL = alarmMergeUrl + "tag=13"+getSearchParam();  
	getServeXML(dom)
	var error_code = xmlhttp.responseXML.selectSingleNode("/root/error_code");
	if(ifWorker=="1" && error_code==null)
	{
		MMsg("����������������ĸ澯,���ܲ�����,��ѡ������������ĸ澯��");
		return;
	}
	var row=returnXml.selectSingleNode("/root/ALARM_ID");
	alarmIds = row.text;
	if(alarmIds==''){
		alert('��ǰҳû�пɹ���ĸ澯');
		return false;
	}
	var alarmIdArray=alarmIds.split(",");
	if(alarmIdArray.length>1000){
		alert('��ǰ׼������ĸ澯������1000�����޷�ȫ������');
		return;
	}
	/**
	var params = new Array();
	params.push(alarmIds);
	params.push(ifWorker);
	*/
	var params = {
		alarmId: alarmIds,
		ifWorker: ifWorker
	}
	window.showModalDialog("SPDAlarmAll.htm",params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");
	oData.doRefresh(false);

	//����Ǵ���Ԫ�����ӹ����ģ�ֻ�������ɾ����������Ҫִ�и��¸澯����Ĳ���
	//��ʱ��ˢ�º�������Ԫ���ж���ģ�������ˢ����Ԫ���ĸ澯����
	if(comeFrom == "neTree") {
		return;
	}	
	callbackRefresh();
}

/**
 * 3.4. �������
 * 
 */
function SPDAlarm(bClosed)//�澯����
{
	var alarmValidity = document.getElementById('alarmValidity').value;
	var invalidReasonCode = document.getElementById('invalidReason').value;
	
	if(alarmValidity == '0SX' && invalidReasonCode == "")
	{
		alert("��ѡ����Чԭ��");
		return;
	}
	
	var errorXML="";
    var flag=true;
    var sumDealNums=0;
    var errorNums=0;
	if(!confirm("��ȷ��Ҫ���и澯���������(�澯�����������º�̨����ʱ�佫�п����Գ��������ĵȴ�...)"))
		return;
	if(!validateData())return;
	var value = oprtResult.value;
	if(!value.hasText()){
		value = "��";
	}
	var cId="";
	
	if( typeof currentFlowId=='undefined'||currentFlowId ==null){
		//���� �����澯����
		submitURL = alarmMergeUrl + "tag=38&oprtResult="+encodeURIComponent(value);  
		cId="";
	}
	else{
		//���������и澯����
		submitURL = alarmMergeUrl + "tag=39&flowId="+currentFlowId+"&oprtResult="+encodeURIComponent(value);
		cId=currentFlowId;
	}

	if(alarmIds != null) {
		var alarmItems = (new String(alarmIds)).split(",");
		
		var reTimes = Math.ceil(alarmItems.length / step);
		
		for(var i=0;i<reTimes;i++) {
			/*if(reTimes > 1) {//ֻ�зֶ�β���ʱ�������û�ȷ�ϲ������
				alert("�����ĵȴ���" + (i + 1) + "�β����������,��" + reTimes + "��");
			}*/
			
			var sAlarmIds = "";
			
			for(var j=i*step;j<alarmItems.length && j<(i+1)*step;j++) {
				sAlarmIds +=  "," + alarmItems[j]; 
			}
			sAlarmIds = sAlarmIds.replace(",","");
			setReasonSolveRows();	
			var measures,proReason;
			var arr = getInfo();
			measures = arr[0];
			proReason = arr[1];
			var sendXML='<?xml version="1.0" encoding="gb2312"?>'
			           +  '<root>'
			           +     '<alarmId>'+sAlarmIds+'</alarmId>'
			           +     '<flowId>'+cId+'</flowId>'
			           +     '<tFirst>'+tFirst+'</tFirst>'
			           +     '<oprtResult>'+xmlEncode(document.getElementById("oprtResult").value)+'</oprtResult>'
			           +	 '<expertAdvice>'+xmlEncode(document.getElementById("expert_advice").value)+'</expertAdvice>'
			           +     '<proPheno>'+xmlEncode(document.getElementById("proPheno").value)+'</proPheno>'
			           +     '<proReason>'+proReason+'</proReason>'
			           +     '<measures>'+measures+'</measures>'
			           +     '<aftermath>'+xmlEncode(document.getElementById("aftermath").value)+'</aftermath>'
			           +     '<alarmValidity>'+alarmValidity+'</alarmValidity>'           
			           +     '<invalidReasonCode>'+invalidReasonCode+'</invalidReasonCode>'
			           +     '<ifWorker>'+ifworker+'</ifWorker>'
			           +  '</root>';
			var dom = new ActiveXObject("Microsoft.XMLDOM");
			dom.loadXML(sendXML);
			//alert(dom.xml)
			xmlhttp.Open("POST",submitURL,false);
			xmlhttp.send(dom);
			if(isSuccess(xmlhttp)){
				dom.loadXML(xmlhttp.responseXML.xml);
				var alarmNums=dom.selectSingleNode("/root/alarmNum").text;
				var dealNums=dom.selectSingleNode("/root/dealNum").text;
				errorNums+=(Number(alarmNums)-Number(dealNums));
				sumDealNums+=Number(dealNums);
				if(alarmNums!=dealNums){
					var dealNumsErrors=xmlhttp.responseXML.selectSingleNode("/root");
				     errorXML+=dealNumsErrors.xml;
					flag=false;
				}
			} else {
				flag = false;
				break;
			}
		}
		
        if(flag==false){
			var params ={};
			params['errorXML']=errorXML;
			params['sumDealNums']=sumDealNums;
			params.errorNums=errorNums;
			window.showModalDialog("AlarmDealResult.htm",params,"dialogWidth=40;dialogHeight=20;help=0;scroll=0;status=0;");
		} else {
			alert("����ɹ���");
		}
	}
	if(bClosed)
		window.close();
	
}


//*************************************************************************
//******************** 4. �澯ɾ�� ******************************************
//*************************************************************************/
/**
 * 4-1. ɾ���澯ʱ����������
 *
 *      (1). ״̬Ϊ����ɾ�����ļ�¼������ɾ����
 *      (2). flag ���澯ɾ��ʱ��flag="sg"���������Ϊ""
 */
function popupDELWindow(flag,isInfoPage,ifWorker)//�����澯ɾ������
{
	var vState="";
	var length=0;
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0)
		{
			alert("��ѡ����(�ɶ�ѡ)");
			return false;
		}
		var SoprtState=oData.getPropertys("oprtState"); 
		//var SalarmState=oData.getPropertys("alarmState"); 
		//var SalarmClass=oData.getPropertys("alarmClass");
		length=SoprtState.length;
		if(length==1)
			vState=SoprtState[0];
	}else{
		length=1;
		var alarmIds=alarmId;
		vState=oprtState;
	}
	if(length==1)
	{
		if(vState==oprt_state_del)
		{
			alert("�澯�Ѿ���ɾ�������ܽ��и澯ɾ������..!");
			return;
		}
	}else{
		for(var i=0;i<length;i++)
		{
			if(SoprtState[i]==oprt_state_del)
			{
				alert("��ѡ�澯��¼�����Ѿ���ɾ���ĸ澯��������ѡ��..!");
				return;
			}
		}
	}


	var temp="";
	//���澯���
	if(flag!=null && flag!="")
		temp="?flag="+flag;
	else temp="?flag=";

	var params = fetchReasonSolve(alarmIds,ifWorker);
	if(length==1){   
		window.showModalDialog("DELAlarm.jsp"+temp,params,"dialogWidth=40;dialogHeight=70;help=0;scroll=0;status=0;");
	}else{
		window.showModalDialog("DELAlarmAll.jsp"+temp,params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");
	}
	if(!isInfoPage)
		oData.doRefresh(false);
	callbackRefreshByIndex();
	callbackRefresh(isInfoPage);
}

/**
 * 4-2. ɾ��ȫ���澯ʱ����������
 *
 *      (1). ֻ��ɾ������Ȩ�ޡ��ĸ澯��
 */
function popupDELAllWindow(ifWorker)//������ѯ����ĸ澯ȫ��ȷ�ϴ���
{
	setCurrentTable(); 
	
	if(!confirm("��ȷ��Ҫɾ����ǰ��ѯ��������и澯��"))
		return;
	var alarmIds;
	var dom = new ActiveXObject("Microsoft.XMLDOM");
	dom.loadXML(getSearchXmlStr());
	//alert(dom.xml)
	submitURL = alarmMergeUrl + "tag=13"+getSearchParam();  
	getServeXML(dom)
	var error_code = xmlhttp.responseXML.selectSingleNode("/root/error_code");
	if(ifWorker=="1" && error_code==null)
	{
		MMsg("����������������ĸ澯,���ܲ�����,��ѡ������������ĸ澯��");
		return;
	}
	//alert(returnXml.xml)
	var row=returnXml.selectSingleNode("/root/ALARM_ID");
	alarmIds = row.text;
	if(alarmIds==''){
		alert('��ǰҳû�п�ɾ���ĸ澯');
		return false;
	}
	var alarmIdArray=alarmIds.split(",");
	if(alarmIdArray.length>1000){
		alert('��ǰ׼��ɾ���ĸ澯������1000�����޷�ȫ��ɾ��');
		return;
	}
	
	var params = fetchReasonSolve(alarmIds,ifWorker);	
	var temp="?flag=";
	window.showModalDialog("DELAlarmAll.jsp"+temp,params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");
	oData.doRefresh(false); 
	callbackRefresh();
}

/**
 * 4.3. ɾ������
 * 
 */
function DelAlarm(bClosed)//�澯ɾ��
{
	var alarmValidity = document.getElementById('alarmValidity').value;
	var invalidReasonCode = document.getElementById('invalidReason').value;
	
	if(alarmValidity == '0SX' && invalidReasonCode == "")
	{
		alert("��ѡ����Чԭ��");
		return;
	}
	
	var errorXML="";
    var flag=true;
    var sumDealNums=0;
    var errorNums=0;
	if(!confirm("��ȷ��Ҫ���и澯ɾ��������(�澯�����������º�̨����ʱ�佫�п����Գ��������ĵȴ�...)"))
		return;
	if(!validateData())return;
	if(!showMsgByConfig(checkConfigObj))return;
	var value = oprtResult.value;
	if(!value.hasText()){
		value = "��";
	}
	var cId="";
	
	if( typeof currentFlowId=='undefined'||currentFlowId ==null){
		//���� �����澯ɾ��
		submitURL = alarmMergeUrl + "tag=14&oprtResult="+encodeURIComponent(value);  
		cId="";
	}	
	else{
		//���������и澯ɾ��
		submitURL = alarmMergeUrl + "tag=15&flowId="+currentFlowId+"&oprtResult="+encodeURIComponent(value);
		cId=currentFlowId;
	}
	if(alarmIds != null) {
		var alarmItems = (new String(alarmIds)).split(",");
		
		var reTimes = Math.ceil(alarmItems.length / step);
		
		for(var i=0;i<reTimes;i++) {
			/*if(reTimes > 1) {//ֻ�зֶ�β���ʱ�������û�ȷ�ϲ������
				alert("�����ĵȴ���" + (i + 1) + "�β����������,��" + reTimes + "��");
			}*/
			var sAlarmIds = "";
			
			for(var j=i*step;j<alarmItems.length && j<(i+1)*step;j++) {
				sAlarmIds +=  "," + alarmItems[j]; 
			}
			sAlarmIds = sAlarmIds.replace(",","");
			setReasonSolveRows();
			var measures,proReason;
			var arr = getInfo();
			measures = arr[0];
			proReason = arr[1];
			var sendXML='<?xml version="1.0" encoding="gb2312"?>'
			           +  '<root>'
			           +     '<alarmId>'+sAlarmIds+'</alarmId>'
			           +     '<flowId>'+cId+'</flowId>'
			           +     '<tFirst></tFirst>'
			           +     '<oprtResult>'+xmlEncode(document.getElementById("oprtResult").value)+'</oprtResult>'
			           +	 '<expertAdvice>'+xmlEncode(document.getElementById("expert_advice").value)+'</expertAdvice>'
			           +     '<proPheno>'+xmlEncode(document.getElementById("proPheno").value)+'</proPheno>'
			           +     '<proReason>'+proReason+'</proReason>'
			           +     '<measures>'+measures+'</measures>'
			           +     '<aftermath>'+xmlEncode(document.getElementById("aftermath").value)+'</aftermath>'
			           +     '<alarmValidity>'+alarmValidity+'</alarmValidity>'           
			           +     '<invalidReasonCode>'+invalidReasonCode+'</invalidReasonCode>'
			           +     '<sgFlag>'+sgFlag+'</sgFlag>'
			           +     '<ifWorker>'+ifworker+'</ifWorker>'
			           +  '</root>';
			var dom = new ActiveXObject("Microsoft.XMLDOM");
			dom.loadXML(sendXML);
			xmlhttp.Open("POST",submitURL,false);
			xmlhttp.send(dom);
			if(isSuccess(xmlhttp)){
				dom.loadXML(xmlhttp.responseXML.xml);
				var alarmNums=dom.selectSingleNode("/root/alarmNum").text;
				var dealNums=dom.selectSingleNode("/root/dealNum").text;
				errorNums+=(Number(alarmNums)-Number(dealNums));
				sumDealNums+=Number(dealNums);
				if(alarmNums!=dealNums){
					var dealNumsErrors=xmlhttp.responseXML.selectSingleNode("/root");
				     errorXML+=dealNumsErrors.xml;
					flag=false;
				}
			} else {
				flag = false;
				break;
			}
		}
		
        if(flag==false){
			var params ={};
			params['errorXML']=errorXML;
			params['sumDealNums']=sumDealNums;
			params.errorNums=errorNums;
			window.showModalDialog("AlarmDealResult.htm",params,"dialogWidth=40;dialogHeight=20;help=0;scroll=0;status=0;");
		} else {
			alert("ɾ���ɹ���");
		}
	}
	if(bClosed)
		window.close();
	
}



//*************************************************************************
//******************** 5. �澯��� ******************************************
//*************************************************************************/
/**
 * 5.1. ����澯ʱ����������
 *
 *      (1). ��������������ɾ���ĸ澯�����������
 */
function popupCLRWindow(isInfoPage,ifWorker)//�����澯�������
{
	var vState="";
	var length=0;
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0)
		{
			alert("��ѡ����(�ɶ�ѡ)");
			return false;
		}
		var SalarmState=oData.getPropertys("alarmState"); 
		var SoprtState=oData.getPropertys("oprtState"); 
		length=SoprtState.length;
		if(length==1)
			vState=SoprtState[0];
	}else{
		length=1;
		var alarmIds=alarmId;
		vState=oprtState;
	}
	if(length==1)
	{
		if(vState.isInArray([oprt_state_clear,oprt_state_del]))
		{
			alert("�澯�Ѿ��������ɾ�������ܽ��и澯�������..!");
			return;
		}
	}else{
		for(var i=0;i<length;i++)
		{
			if(SoprtState[i].isInArray([oprt_state_clear,oprt_state_del]))
			{
				alert("��ѡ�澯��¼�����Ѿ��������ɾ���ĸ澯��������ѡ��..!");
				return;
			}
		}
	}
	var params = fetchReasonSolve(alarmIds,ifWorker);	
	if(length==1){		
		resultArr = window.showModalDialog("CLRAlarm.jsp",params,"dialogWidth=40;dialogHeight=70;help=0;scroll=0;status=0;");
	}else{
		resultArr = window.showModalDialog("CLRAlarmAll.jsp",params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");
	}
	if(!isInfoPage)
		oData.doRefresh(false);
	callbackRefresh(isInfoPage);
	callbackRefreshByIndex();
}


/**
 * 5.2. ���ȫ���澯ʱ����������
 *
 *      (1). ֻ���������Ȩ�ޡ��ĸ澯��
 */
function popupCLRAllWindow(ifWorker)//������ѯ����ĸ澯ȫ���������
{
	setCurrentTable();
	
	if(!confirm("��ȷ��Ҫ�����ǰ��ѯ��������и澯��"))
		return;
	var alarmIds;
	var dom = new ActiveXObject("Microsoft.XMLDOM");
	dom.loadXML(getSearchXmlStr());
	submitURL = alarmMergeUrl + "tag=13"+getSearchParam();  
	getServeXML(dom)
	var error_code = xmlhttp.responseXML.selectSingleNode("/root/error_code");
	if(ifWorker=="1" && error_code==null)
	{
		MMsg("����������������ĸ澯,���ܲ�����,��ѡ������������ĸ澯��");
		return;
	}
	var row=returnXml.selectSingleNode("/root/ALARM_ID");
	alarmIds = row.text;
	if(alarmIds==''){
		alert('��ǰҳû�п�����ĸ澯');
		return false;
	}
	var alarmIdArray=alarmIds.split(",");
	if(alarmIdArray.length>1000){
		alert('��ǰ׼������ĸ澯������1000�����޷�ȫ�����');
		return;
	}
	
	var params = fetchReasonSolve(alarmIds,ifWorker);	
	window.showModalDialog("CLRAlarmAll.jsp",params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");
	oData.doRefresh(false);
	callbackRefresh();
}
/**
 * 5.3. �������
 */

function popupCLRWorkWindow(isInfoPage)
{
	var ErrMsg="";
	if(isInfoPage){
		ErrMsg="�ø澯δ�ɵ������ܹ��������";
	}else{
		setCurrentTable();
		ErrMsg="�ø澯δ�ɵ�����ѡ�ĸ澯����ͬһ�����ϵ��ϣ����ܹ������";
	}
	var inflowId;
	if(!isInfoPage){	
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0)
		{
			alert("��ѡ����(�ɶ�ѡ)");
			return false;
		}
		if(flowId==null || flowId==""){
  			var flowIds = oData.getPropertys("flow_id");
  			var cnt=flowIds.length;
			inflowId=flowIds[0];
			if(inflowId==""){
				MMsg(ErrMsg);
				return ;				
			}
  			if(cnt>0){
				for(var i=1;i<cnt;i++){				
					if(flowIds[i]!=inflowId){
						MMsg(ErrMsg);
						return ;
					}
				}
			}
		}else inflowId=flowId;			
	}else{
		var alarmIds = alarmId;
		if(flowId==null || flowId=="")
		{
			MMsg(ErrMsg);
			return ;
		}else inflowId=flowId;
	}

	if(typeof inflowId == "undefined") {//Update by guoyg
		MMsg("û�ж�Ӧ�Ĺ����ţ�������ȷ�ϣ�");
		return;
	}
	if(!confirm("��ȷ��Ҫ�����ǰ���������и澯��"))
		return;
	var temp="";
	
	var params = fetchReasonSolve(alarmIds,"1");
	window.showModalDialog("CLRAlarmAll.jsp?flowId="+inflowId,params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");	
	if(!isInfoPage)
		oData.doRefresh(false);
	callbackRefresh(isInfoPage);	
}
/**
 * 5.4. �������
 *
 */

var isSave=false;//����֪ʶǰ���ж��Ƿ�ɹ������������Ϣ �㽭ITSM��PATCH_20140526_01330
function CLRAlarm(bClosed)//�澯���
{
	var alarmValidity = document.getElementById('alarmValidity').value;
	var invalidReasonCode = document.getElementById('invalidReason').value;

	if(alarmValidity == '0SX' && invalidReasonCode == "")
	{
		alert("��ѡ����Чԭ��");
		return;
	}
	 
	var errorXML="";
    var flag=true;
    var sumDealNums=0;
    var errorNums=0;
	if(!confirm("��ȷ��Ҫ���и澯���������(�澯�����������º�̨����ʱ�佫�п����Գ��������ĵȴ�...)"))
		return;	
	if(!validateData())return;
	if(!showMsgByConfig(checkConfigObj))return;	
	
	var value = oprtResult.value; 
	var cId="";
	if( typeof currentFlowId=='undefined'||currentFlowId ==null){
		//���� �����澯���		
		submitURL = alarmMergeUrl + "tag=16&oprtResult="+encodeURIComponent(value);
		cId="";
	} 
	else{
		//���������и澯���
		submitURL = alarmMergeUrl + "tag=17&flowId="+currentFlowId+"&oprtResult="+encodeURIComponent(value); 
		cId=currentFlowId;
	}
	
	if(alarmIds != null) {
		var alarmItems = (new String(alarmIds)).split(",");
		
		var reTimes = Math.ceil(alarmItems.length / step);
		for(var i=0;i<reTimes;i++) {
		/*	if(reTimes > 1) {//ֻ�зֶ�β���ʱ�������û�ȷ�ϲ������
				alert("�����ĵȴ���" + (i + 1) + "�β����������,��" + reTimes + "��");
			}*/
			
			var sAlarmIds = "";
			
			for(var j=i*step;j<alarmItems.length && j<(i+1)*step;j++) {
				sAlarmIds +=  "," + alarmItems[j]; 
			}
			sAlarmIds = sAlarmIds.replace(",","");
			setReasonSolveRows();
			
			var measures,proReason;
			var arr = getInfo();
			measures = arr[0];
			proReason = arr[1];
			var sendXML='<?xml version="1.0" encoding="gb2312"?>'
			           +  '<root>'
			           +     '<alarmId>'+sAlarmIds+'</alarmId>'
			           +     '<flowId>'+cId+'</flowId>'
			           +     '<oprtResult>'+xmlEncode(document.getElementById("oprtResult").value)+'</oprtResult>'
			           +	 '<expertAdvice>'+xmlEncode(document.getElementById("expert_advice").value)+'</expertAdvice>'
			           +     '<proPheno>'+xmlEncode(document.getElementById("proPheno").value)+'</proPheno>'
			           +     '<proReason>'+proReason+'</proReason>'
			           +     '<measures>'+measures+'</measures>'
			           +     '<aftermath>'+xmlEncode(document.getElementById("aftermath").value)+'</aftermath>'
			           +     '<ifWorker>'+ifworker+'</ifWorker>'
			           +     '<alarmValidity>'+alarmValidity+'</alarmValidity>'			           
			           +     '<invalidReasonCode>'+invalidReasonCode+'</invalidReasonCode>'
			           +  '</root>';
			var dom = new ActiveXObject("Microsoft.XMLDOM");
			dom.loadXML(sendXML);
			xmlhttp.Open("POST",submitURL,false);
			xmlhttp.send(dom);
			if(isSuccess(xmlhttp)){
				dom.loadXML(xmlhttp.responseXML.xml);
				var alarmNums=dom.selectSingleNode("/root/alarmNum").text;
				var dealNums=dom.selectSingleNode("/root/dealNum").text;
				errorNums+=(Number(alarmNums)-Number(dealNums));
				sumDealNums+=Number(dealNums);
				if(alarmNums!=dealNums){
					var dealNumsErrors=xmlhttp.responseXML.selectSingleNode("/root");
				     errorXML+=dealNumsErrors.xml;
					flag=false;
				}
			} else {
				//������̨����ʧ�ܣ��򱾴β���ʧ�ܣ��˳�
				flag = false;
				break;
			}
		}
		if(flag==false){
			var params ={};
			params['errorXML']=errorXML;
			params['sumDealNums']=sumDealNums;
			params.errorNums=errorNums;
			window.showModalDialog("AlarmDealResult.htm",params,"dialogWidth=40;dialogHeight=20;help=0;scroll=0;status=0;");
		} else {
			alert("����ɹ���");
			isSave=true;
		}
	}
	if(bClosed)
		window.close();
}

//ȷ�ϲ�����֪ʶ
function alarmToKnowledge(){
	if(!isSave){
		CLRAlarm(false);
	}
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var url = "/servlet/ZJKnowledge?tag=10&alarmId="+alarmIds;//��alarmIds��CLRAlarm.jsp�е�
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
	var nodes =xmlhttp.responseXML.selectNodes("/ERR_INFO");
	var flagReturn=nodes[0].selectSingleNode("ERROR_CODE").text;
	if (flagReturn=="0"){
		isSave=false;
		alert("����֪ʶ�ɹ�!");
		window.close();
	}else{
		alert("����֪ʶʧ��!");
	}
}

//�澯���������ѯ
function showKnowledge(){
	var strArray=new Array();
	strArray[0]=document.getElementById("ne_name").innerHTML;
	strArray[1]=document.getElementById("kpi_name").innerHTML;
	strArray[2]=document.getElementById("config_ne_name").innerHTML;
	window.showModalDialog("alarmKnowledgeShow.html",strArray,"dialogWidth=1000px;dialogHeight=600px;;help=0;scroll=0;status=0;");
}

//��ȡ����ԭ��Ͳ�ȡ��ʩ����Ϣ
function getInfo(){
	var arr = [],measures,proReason;
	if(isAlarmPageUseTemplate == null || isAlarmPageUseTemplate == '' || isAlarmPageUseTemplate=='0'){
		measures = xmlEncode(document.getElementById("measures").value);
		proReason = xmlEncode(document.getElementById("proReason").value);
	} else {		
		measures = xmlEncode(rep('zhchs'));
		proReason = xmlEncode(rep('zhchsReason'));
	}	
	arr.push(measures,proReason);
	function rep(id){
		var outHtml = "";						
		var rowsObj = document.getElementById(id).rows;
		for(var i=1; i<rowsObj.length; i++){
			//outHtml += document.getElementById(id).rows[i].innerText+"  "+document.getElementById(id).rows[i].children[2].children[0].value+"��  ";
			outHtml += document.getElementById(id).rows[i].cells[0].innerText+"�� "+document.getElementById(id).rows[i].cells[1].innerText+"�� "+document.getElementById(id).rows[i].children[2].children[0].value+"\r\n";
			
		}				
		return outHtml;
	}
	return arr;
}
function showMsgByConfig(obj){	
	if(!obj){
		MMsg("��ȡ�������ݳ���!");
		return false;
	}
	var arr = [{name:'proPheno',value:'�Բ��𣬲�������Ϊ�գ������ύ��'},
	           {name:'proReason',value:'�Բ��𣬲���ԭ��Ϊ�գ������ύ��'},
	           {name:'aftermath',value:'�Բ�����ɺ��Ϊ�գ������ύ��'},
	           {name:'measures',value:'�Բ��𣬲�ȡ��ʩΪ�գ������ύ��'},
	           {name:'oprtResult',value:'�Բ������ս��Ϊ�գ������ύ��'}
	           ];		
	for(var i=0; i<arr.length; i++){
		if(obj[arr[i].name]){
			if(isAlarmPageUseTemplate == null || isAlarmPageUseTemplate == '' || isAlarmPageUseTemplate=='0'){
				if(!document.getElementById(arr[i].name).value.hasText()){
					MMsg(arr[i].value);
					return false;					
				}
			}else{
				if(arr[i].name == 'measures'){
					var zhchs = document.getElementById("zhchs");
					if(zhchs && zhchs.rows.length ==1){
						MMsg(arr[i].value);
						return false;	
					}
				}else if(arr[i].name == 'proReason'){ 
					var zhchsReason = document.getElementById("zhchsReason");
					if(zhchsReason && zhchsReason.rows.length ==1){
						MMsg(arr[i].value);
						return false;	
					}
				}else{
					if(!document.getElementById(arr[i].name).value.hasText()){
						MMsg(arr[i].value);
						return false;					
					}
				}
			}			
		}
	}
	return true;
}
function validateData(){	
	
	var arr = [{name:'expert_advice',value:'�Բ����������ר�ҽ������2000���ַ��������ύ��'}];		
	if(document.getElementById(arr[0].name).value.length > 2000) {
		MMsg(arr[0].value);
		return false;
	}
	return true;
}
function json2Obj(str){
	if(!str)return null;
	if(typeof str == 'object')return str;
	try{
    	return Function("return "+str)();
	}catch(e){ return null;}
}

//*************************************************************************
//******************** 6. �澯���� *****************************************
//*************************************************************************/
/**
 * 6.1. �����澯ʱ����������
 *
 *      (1). ����ǡ�����������ѿ������ģ�����������
 *      (2). �����¼�������������
 */
function popupUpgradeWindow(isInfoPage,ifWorker)//�����澯��������
{
	var vState="";
	var vLevel="";
	var length=0;
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0){
			alert("��ѡ����(�ɶ�ѡ)");
			return false;
		}
		var SalarmLevel=oData.getPropertys("alarmLevel"); 
		var SoprtState=oData.getPropertys("oprtState"); 
		var SalarmState=oData.getPropertys("alarmState");  
		var SalarmClass=oData.getPropertys("alarmClass");
		length=SoprtState.length;
		if(length==1){
			vState=SoprtState[0];
			vLevel=SalarmLevel[0];
		}
	}else{
		length=1;
		var alarmIds=alarmId;
		vState=oprtState;
		vLevel=alarmLevel;
	}
	if(length==1)
	{
		if(vLevel==1){
			alert("�澯������߼��𣬲����ٽ��и澯��������..!");
			return;
		}
		if(vState.isInArray([oprt_state_clear,oprt_state_del]))
		{
			alert("�澯�Ѿ��������ɾ�������ܽ��и澯��������..!");
			return;
		}
	}else{
		for(var i=0;i<length;i++)
		{			
			if(SalarmLevel[i]==1){
				alert("��ѡ�澯������߼���澯�������ٽ��и澯��������..!");
				return;
			}			
			if(SoprtState[i].isInArray([oprt_state_clear,oprt_state_del]))
			{
				alert("��ѡ�澯��¼�����Ѿ��������ɾ���ĸ澯��������ѡ��..!");
				return;
			}
		}
	}

	var params = fetchReasonSolve(alarmIds,ifWorker);
	if(length==1){
		resultArr = window.showModalDialog("upgradeAlarm.htm?alarmLevel="+vLevel,params,"dialogWidth=40;dialogHeight=70;help=0;scroll=0;status=0;");
	}else{
		resultArr = window.showModalDialog("upgradeAlarmAll.htm",params,"dialogWidth=40;dialogHeight=33;help=0;scroll=0;status=0;");
	}	
	if(!isInfoPage)
		oData.doRefresh(false);
	callbackRefresh(isInfoPage);
}

/**
 * 6.2. ��������
 *
 */
function upgradeAlarm(bClosed)//�澯����
{
	var value = oprtResult.value;
	if(!validateData())return;
	if(alarmLevel.getObject().selectedIndex <=0)
	{
		alert("�澯������Ϊ��..!");
		return false;
	}
	if(!value.hasText())
	{
		MMsg("�Բ������ս��Ϊ�գ������ύ��");
		return;
	}
	if(!confirm("��ȷ��Ҫ�澯����������"))
		return;
	submitURL = alarmMergeUrl + "tag=18&oprtResult="+encodeURIComponent(value)+"&alarmLevel="+alarmLevel.getObject().value;  
	setReasonSolveRows();
	var measures,proReason;
	var arr = getInfo();
	measures = arr[0];
	proReason = arr[1];
	var sendXML='<?xml version="1.0" encoding="gb2312"?>'
	           +  '<root>'
	           +     '<alarmId>'+alarmIds+'</alarmId>'
	           +     '<flowId></flowId>'
	           +     '<oprtResult>'+xmlEncode(document.getElementById("oprtResult").value)+'</oprtResult>'
	           +	 '<expertAdvice>'+xmlEncode(document.getElementById("expert_advice").value)+'</expertAdvice>'
			   +     '<proPheno>'+xmlEncode(document.getElementById("proPheno").value)+'</proPheno>'
			   +     '<proReason>'+proReason+'</proReason>'
			   +     '<measures>'+measures+'</measures>'
			   +     '<aftermath>'+xmlEncode(document.getElementById("aftermath").value)+'</aftermath>'
	           +     '<alarmLevel>'+alarmLevel.getObject().value+'</alarmLevel>'
	           +     '<ifWorker>'+ifworker+'</ifWorker>'
	           +  '</root>';
	var dom = new ActiveXObject("Microsoft.XMLDOM");
	dom.loadXML(sendXML);
	xmlhttp.Open("POST",submitURL,false);
	xmlhttp.send(dom);
	if(isSuccess(xmlhttp))
	{
		dom.loadXML(xmlhttp.responseXML.xml);
		var alarmNums=dom.selectSingleNode("/root/alarmNum").text;
		var dealNums=dom.selectSingleNode("/root/dealNum").text;
		if(alarmNums==dealNums){
			alert("�����ɹ���");
		}else{
			var params ={};
			var dealNumsErrors=xmlhttp.responseXML.selectSingleNode("/root");
			params['errorXML']=dealNumsErrors.xml;
			params['sumDealNums']=0;
			params['errorNums']=1;
			window.showModalDialog("AlarmDealResult.htm",params,"dialogWidth=40;dialogHeight=20;help=0;scroll=0;status=0;");
		}
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
	var alarmClass=oData.getPropertys("alarmClass"); 
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
			if((alarmClass[i]!=null || alarmClass[i]!="") && (alarmClass[i]==9 || alarmClass[i]=="9")){
				alert("��ѡ�澯��¼�а����¼���������ѡ��..!");
				return;
			}
		}//for��ѭ��
	}

	resultArr = window.showModalDialog("operAlarm.jsp",window.oData,"dialogWidth=30;dialogHeight=15;help=0;scroll=0;status=0;");
}


/**
 * Add by @author guoyg
 * @version 2008-06-12 1.0
 * �澯���Ͳ���
 */
function sendAlarmTrans(isInfoPage) {
	var len = 0;
	var vState = "";
	var sumDealNums=0;
    var errorNums=0;
	var flag = true;
	if(!isInfoPage) {
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length == 0) {
			alert("��ѡ����(�ɶ�ѡ)");
			return false;
		} else if(alarmIds.toString().length > 2000) {
			alert("��ѡ�ĸ澯��Ŀ̫�࣬��������ѡ��");
			return false;
		}
		
		var SoprtState = oData.getPropertys("oprtState");
		
		len = SoprtState.length;
		if(len == 1) {
			vState = SoprtState[0];
		}
	} else {
		len = 1;
		var alarmIds = alarmId;
		vState = oprtState;
	}
	
	if(len == 1) {
		if(vState.isInArray([oprt_state_ack,oprt_state_clear,oprt_state_del])) {
			alert("��ѡ�澯�Ѿ���ȷ�ϡ������ɾ���������ٽ��и澯���Ͳ���..!");
			return false;
		}
	} else {
		for(var i=0;i<len;i++){
			if(SoprtState[i].isInArray([oprt_state_ack,oprt_state_clear,oprt_state_del])){
				alert("��ѡ�澯��¼����\"��ȷ�ϡ����������ɾ��\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}
		}
	}
	if(confirm("��ȷ��Ҫ�澯���Ͳ�����..?(�澯�����������º�̨����ʱ�佫�п����Գ��������ĵȴ�...)")){
		var sendXML='<?xml version="1.0" encoding="gb2312"?>'
	           +  '<root>'
	           +     '<alarmId>'+alarmIds+'</alarmId>'
	           +     '<flowId></flowId>'
	           +     '<ifWorker>'+0+'</ifWorker>'
	           +  '</root>';
		var dom = new ActiveXObject("Microsoft.XMLDOM");
		dom.loadXML(sendXML);
		xmlhttp.Open("POST",alarmMergeUrl + "tag=37",false);
		xmlhttp.send(dom);
		if(isSuccess(xmlhttp)){
			dom.loadXML(xmlhttp.responseXML.xml);
			var alarmNums=dom.selectSingleNode("/root/alarmNum").text;
			var dealNums=dom.selectSingleNode("/root/dealNum").text;
			errorNums+=(Number(alarmNums)-Number(dealNums));
			sumDealNums+=Number(dealNums);
			if(alarmNums==dealNums){
				alert("���ͳɹ���");
			}else{
				var params ={};
				params['errorXML']=xmlhttp.responseXML.selectSingleNode("/root").xml;
				params['sumDealNums']=sumDealNums;
				params.errorNums=errorNums;
				window.showModalDialog("AlarmDealResult.htm",params,"dialogWidth=40;dialogHeight=20;help=0;scroll=0;status=0;");
			}
		}
	}
	if(!isInfoPage) {
		oData.doRefresh(false);
	}
}

/**
 * Add by @author linyi
 * @version 2010-08-19 1.0
 * �澯�ɵ���ת���Ϲ������̲���
 */
function sendAlarmList(isInfoPage,flowMod){
	var alarmIds;
	var iFlowId = new Array();
	
	if(!isInfoPage){
		setCurrentTable();
		alarmIds = oData.getPropertys('id');
		iFlowId = oData.getPropertys('flow_id');
		if(alarmIds.length==0){
			alert("��ѡ����");
			return false;
		} else if(alarmIds.length>1) {
			alert("ֻ��ѡ��һ��");
			return false;
		}	
		var SoprtState=oData.getPropertys("oprtState");  
		var SalarmState=oData.getPropertys("alarmState");	
		vState=SoprtState[0];
		vAlarmState=SalarmState[0];
	}else{
	   var alarmIds=alarmId;
	   vState=oprtState;
	   iFlowId[0]=flowId;
	}
	/*if(vState.isInArray([oprt_state_clear,oprt_state_del]) || vAlarmState==1){
		alert("��ѡ�澯�Ѿ��������ɾ���������ٽ��и澯�ɵ�����..!");
		return false;
	}*/
	if(confirm("��ȷ��Ҫ�澯�ɵ�������..?")){
		if(iFlowId[0]!=null && iFlowId[0]!=""){
			if(!(confirm("�澯���ɵ�����ȷ��Ҫ���и澯���ɲ�����..?"))){
				return;
			}
		}
		currenWin.open("../../workshop/form/index.jsp?flowMod=" + flowMod + "&alarmId=" + alarmIds);
	}
	if(!isInfoPage)
		oData.doRefresh(false);
}

//�澯�ɵ� 
function sendAlarmWork(isInfoPage, isOnly)
{
	var length=0;
	var vState="";
	var iFlowId = new Array();
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");	
		iFlowId=oData.getPropertys("flow_id"); //�жϵ�ǰ�澯��¼�Ƿ��Ѿ��ɵ�����������ID�����ɵ�
		if(alarmIds.length==0){
			alert("��ѡ����" + (isOnly)?"(����)":"(�ɶ�ѡ)");
			return false;
		} else if(isOnly && alarmIds.length>1) {
			alert("ֻ��ѡ��һ��");
			return false;
		}
		var SalarmState=oData.getPropertys("alarmState");  
		var SoprtState=oData.getPropertys("oprtState");  
		var SalarmClass=oData.getPropertys("alarmClass"); 
	    length=SoprtState.length;
	    if(length==1)
	    	vState=SoprtState[0];
	 }else{
	 	length=1;
	 	var alarmIds=alarmId;
	 	vState=oprtState;
	 	iFlowId[0]=flowId;
	 }
	var eventCnt = 0;
	var eventClass = -1;
	if(length==1){
		if(vState.isInArray([oprt_state_clear,oprt_state_del])){
			alert("��ѡ�澯�Ѿ��������ɾ���������ٽ��и澯�ɵ�����..!");
			return false;
		}
		if(SalarmClass==9 || SalarmClass=="9"){
			eventClass=9;
		}
	}else{
		for(var i=0;i<length;i++){
			if(SoprtState[i].isInArray([oprt_state_clear,oprt_state_del])){
				alert("��ѡ�澯��¼����\"���������ɾ��\"״̬�ĸ澯��������ѡ��..!");
				return false;
			}
			if((SalarmClass[i]!=null || SalarmClass[i]!="") && (SalarmClass[i]==9 || SalarmClass[i]=="9")){
				eventCnt=eventCnt+1;
			}
		}//for��ѭ��
		if(eventCnt==0){
			eventClass=-1;
		}else if(eventCnt==length){
			eventClass=9;
		}else{	
			alert("��ѡ�澯��¼����ȫ���¼���ȫ���澯��������ѡ��..!");
			return false;
		}
	}
	if(confirm("��ȷ��Ҫ�澯�ɵ�������..?")){
		for(var k=0;k<iFlowId.length;k++){
			if(iFlowId[k]!=null && iFlowId[k]!=""){
				if(!(confirm("�澯���ɵ�����ȷ��Ҫ���и澯���ɲ�����..?"))){
					return;
				}
			}
		}
		submitURL = alarmMergeUrl + "tag=19&alarmId="+alarmIds+"&alarmClass="+eventClass;
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
	if(!isInfoPage)
		oData.doRefresh(false);
}

/**
 * ���ϵ�����
 */
function doAlarmWork(isInfoPage) {
	var inFlowId = "";
	var workAlarmId = "";
	if(!isInfoPage) {
		setCurrentTable();
		var alarmId = oData.getPropertys("id");
		if(alarmId.length == 0) {
			alert("��ѡ��һ��");
			return false;
		} else if(alarmId.length>1){
			alert("ֻ��ѡ��һ��");
			return false;
		}
		
		inFlowId = oData.getPropertys("flow_id");
		workAlarmId = alarmId;
	} else {
		inFlowId = flowId;
		workAlarmId = alarmId;
	}
	
	if(inFlowId == null || inFlowId == ""){
		alert("�澯û����صĴ������̣�δ�ɵ�!");
		return ;
	}
	
	var theURL = "../../workshop/form/index.jsp?flowId="+inFlowId + "&callback=opener.callbackRefresh(" + isInfoPage + ")";
	var winName = "SparePartEdit";
	var curr_window;
	x=window.screen.width;
	y=window.screen.height;
	curr_window=currenWin.open(theURL,winName,'scrollbars=yes,top=0,left=0,width=' + x + ',height=' + y + ',resizable=yes');
	curr_window.focus();
}

//�鿴���ϵ�(Ӧ�������̴���ģ��)
function alarmFlowView(isInfoPage) {
	var inFlowId="";
	if(!isInfoPage){
		setCurrentTable();
		var alarmId = oData.getPropertys("id");
		if(alarmId.length==0){
			alert("��ѡ��һ��");
			return false;
		}else if(alarmId.length>1){
			alert("ֻ��ѡ��һ��");
			return false;
		}
		inFlowId=oData.getPropertys("flow_id"); //�жϵ�ǰ�澯��¼�Ƿ��Ѿ��ɵ�����������ID�����ɵ�
	} else {
		inFlowId=flowId;
	}
	if(inFlowId == null || inFlowId == ""){
		alert("�澯û����صĴ������̣�δ�ɵ�!");
		return ;
	}
	var theURL = "../../FlowBrowse?system_code=D&flow_id="+inFlowId;
	var winName = "SparePartEdit";
	var curr_window;
	x=(window.screen.width-780)/2;
	y=(window.screen.height-560)/2;
	curr_window=currenWin.open(theURL,winName,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	curr_window.focus();
}
//ԭʼ�澯��Ϣ��ѯ
function oriAlarmMsgQry(isInfoPage)
{
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
			if(alarmIds.length==0){
			alert("��ѡ��һ��");
			return false;
		}else if(alarmIds.length>1){
			alert("ֻ��ѡ��һ��");
			return false;
		}
		var generatedate = oData.getPropertys("generatedate");
		var last_date = oData.getPropertys("lastdate");		
        var params = "?alarmIds=" + alarmIds + "&lastdate=" + last_date + "&generatedate=" + generatedate;		
	}else {
	    var params = "?alarmIds=" + alarmId;
	}
	window.showModalDialog("oriAlarmMsgQry.htm" + params,window,"dialogWidth=50;dialogHeight=29;help=0;scroll=1;status=0;");
}
//ԭʼ������Ϣ��ѯ
function oriPerfMsgQry(isInfoPage)
{
	if(!isInfoPage){
		setCurrentTable();
		var flag = oMPC.selectedIndex; //0:ҵ��ϵͳ 1:��ҵ��ϵͳ
		if(typeof alarmOprtConfig != "undefined") {
    		flag = (alarmOprtConfig.systemType=="2"?"":alarmOprtConfig.systemType);
    	}		
		var perfId = oData.getPropertys("perf_msg_id");
		var generatedate = oData.getPropertys("generatedate");
		var last_date = oData.getPropertys("lastdate");		
		if(perfId.length==0){
			alert("��ѡ��һ��");
			return false;
		}else if(perfId.length>1){
			alert("ֻ��ѡ��һ��");
			return false;
		}
    	var params = "?flag=" + flag + "&perfid=" + perfId + "&lastdate=" + last_date + "&generatedate=" + generatedate;
	}else{
    	var params = "?flag=" + isOptSysflag + "&perfid=" + perf_msg_id + "&lastdate=" + last_date + "&generatedate=" + generatedate;
    }
	window.showModalDialog("../permanager/originPerView.htm" + params,window,"dialogWidth=40;dialogHeight=31;help=0;scroll=0;status=0;");
}
//�����澯��ѯ
function relationAlarmQry(isInfoPage){
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0){
			alert("��ѡ��һ��");
			return false;
		}else if(alarmIds.length>1){
			alert("ֻ��ѡ��һ��");
			return false;
		}
	}else alarmIds=alarmId;
	window.showModalDialog("relationAlarmQry.htm",alarmIds,"dialogWidth=50;dialogHeight=29;help=0;scroll=1;status=0;");
}

//��������¼�
function openSearchEngine(){
    var kpi_name=oData.getTexts(2)[0];
	var url = "../searchEngine/search_entrance_result.htm?queryString="+kpi_name+"&indexDirectory=publish_index_directory&module=&category=";
	doWindow_open(url);
}

function isSearchEngineRun() {
   var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
   oXMLHTTP.open("POST","../../servlet/searchEngineServlet?tag=8",false);
   oXMLHTTP.send("");
   if(isSuccess(oXMLHTTP)) {
      return oXMLHTTP.responseXML.selectSingleNode("/root/value").text;
   } else {
      return "0";
   }
}
//�޸ĵ��¸澯������
function editAlarmRegion(isInfoPage){
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0){
			alert("��ѡ��һ��");
			return false;
		}else if(alarmIds.length>1){
			alert("ֻ��ѡ��һ��");
			return false;
		}
	}else alarmIds=alarmId;
	window.showModalDialog("editAlarmRegion.htm",alarmIds,"dialogWidth=29;dialogHeight=15;help=0;scroll=1;status=0;");
}

function callbackRefresh(isInfoPage)
{
	if(!isInfoPage){
		if(isRefresh)
		{
		    try
		    {
		        eval(refreshFunc);
		    }catch(e){}
		}
	}else{
		if(isRefresh) {
			try
			{
				eval(refreshFunc);
			} catch(e){}
		}
		
		iniAllTextField("../../servlet/alarmMergeServlet?tag=9&alarmId="+alarmId);
		initCommonVar();		
	}
}
//���������ӽ�����ˢ��
function callbackRefreshByIndex()
{
	if(reFreshFlag!=null && reFreshFlag!="" && reFreshFlag==1){
		if(refreshFunc!=null && refreshFunc!="")
		    try
		    {
		        eval(refreshFunc);
		    }catch(e){}
		}
}
//��ѯ���������Ϣ
function openConfigInfo()
{
	var reqId;
	var classId;
	var dataSetId;
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	var neId=document.getElementById("ne_id").innerText
	oXMLHTTP.open("POST", "/servlet/alarmMergeServlet?tag=41&neId="+neId, false);
	oXMLHTTP.send();
	if (isSuccess(oXMLHTTP))
	{
		var result = oXMLHTTP.responseXML.selectSingleNode("/root/result").text;
		if(result==null || result=="")
		{
			MMsg("δ�ҵ����������Ϣ!");
		}
		else
		{
			reqId = oXMLHTTP.responseXML.selectSingleNode("/root/result/request_id").text;
			classId = oXMLHTTP.responseXML.selectSingleNode("/root/result/class_id").text;
			dataSetId = oXMLHTTP.responseXML.selectSingleNode("/root/result/dataset_id").text;
			//var url="/workshop/form/index.jsp?classId=CIM_MAINFRAME&requestId=" + reqId;
			//��V3�汾�޸� 20121008
			var url="/workshop/form/index.jsp?classId="+ classId +"&dataSetId="+ dataSetId +"&requestId=" + reqId +"&hiddenToolBar=y&readOnly=y";
			doWindow_open(url);
		}
	}
}

var vSwitch = false; 	// ��������
/**
 * Add by @author linyi
 * @version 2010-08-30 1.0
 * �澯�鲢��ѯҳ��������ͣ
 */
function stopAlarmAudio(){
	if(document.getElementById("alarmsound")!=null && !vSwitch){
		var oDel = document.getElementById("alarmsound");
		oDel.parentNode.removeChild(oDel);
		vSwitch = true;
	}else
		EMsg("��������ͣ��");
}
/**
 * Add by @author linyi
 * @version 2010-08-30 1.0
 * �澯�鲢��ѯҳ����������
 */
function openAlarmAudio(){
	var pNode = document.getElementById("sounddiv");
	if(document.getElementById("alarmswitch").value == 1) {
		if(pNode.childNodes.length==0 && vSwitch){
			var newNode = document.createElement("bgsound");
			newNode.setAttribute("src","#");
			newNode.setAttribute("loop",1);
			newNode.setAttribute("id","alarmsound");
			newNode.setAttribute("autostart",true);
			pNode.appendChild(newNode);
			vSwitch = false;
			alarmaudio();
		}else{
			EMsg("�����ѿ�����");
		}
	}else{
		EMsg("�������������йرգ�");
	}
}

function isUseTemplate(){
	//��ȡ����
	isAlarmPageUseTemplate = $getSysVar("IS_ALARM_PAGE_USE_TEMPLATE");
	if(isAlarmPageUseTemplate == null || isAlarmPageUseTemplate == '' || isAlarmPageUseTemplate=='0'){
		if(document.getElementById("reason_temp")){
			document.getElementById("reason_temp").style.display='none';
		}
	   
		if( document.getElementById("measures_temp")){
			 document.getElementById("measures_temp").style.display='none';
		}
	  
	  return false;
	}
	
	  var aType = "";
	  if(alarmType){
	  	aType = alarmType;
	  }
	  else{
		  if(typeof(ori_alarm_type)!='undefined')aType=ori_alarm_type.innerText;
	  }
	
	//��ר�ҽ���ᵽ¼����ȥ
		if(typeof(oExpert_advice)!='undefined'){
	  	oExpert_advice.innerText=expert_advice.innerText;
	  }

		var sendURL = "../../servlet/alarmMergeServlet?tag=45&tempType="+
		encodeURIComponent(aType+",����澯ģ��");
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.Open("POST", sendURL, false);
		xmlhttp.send();
		var returnXml = xmlhttp.responseXML;
		var oRows = returnXml.selectNodes("/root/rowSet");
		if (oRows.length == 0) {return;}
		var ctTmp = document.getElementById("sltTemplate");
		var ctTmpRsn = document.getElementById("sltReasonTemplate");
		var oSize = oRows.length;
	
		var oOption=null, mRsnCount =0,mSolveCount= 0;
		for (var i = 0; i < oSize; i++){
		    oOption = document.createElement("OPTION");
			if(oRows[i].selectSingleNode("TMP_TYPE").text=='����澯ģ��'){
				ctTmp.options.add(oOption);
				mSolveCount++;	
			}
			else{
				ctTmpRsn.options.add(oOption);
				mRsnCount++;
			}
			oOption.innerText = oRows[i].selectSingleNode("CODE").text;
			oOption.value = oRows[i].selectSingleNode("TEXT").text;
		}
		// block
		if(mSolveCount==0){	document.getElementById("spnSolve").style.display='none'}
		if(mRsnCount==0){ document.getElementById("spnRsn").style.display='none'}

	return true;
}

/**
 * �澯����ԭ�򡢲�ȡ��ʩ����ģ��
 */
function iniTemplate(){
  if(isUseTemplate()){
		var proReasons=null;
		if(typeof(pro_reason)=='undefined'){
			proReasons = proReason .innerText.split('\n');
		}
		else{
		   proReasons=pro_reason.innerText.split('\n');
		}
		var meass = measures.innerText.split('\n');
		if(proReasons.length>0){
			for(var i=0,len = proReasons.length;i<len;i++){
				var tmpName = "";
				var tmpRemark = "";
				if(proReasons[i].split('��').length>0){
					var seqIndex = proReasons[i].indexOf('��');
					tmpName = proReasons[i].split('��')[0].substring(seqIndex+1);
					tmpRemark =  proReasons[i].split('��')[1];
				}
				if(tmpName!=''){
					addTemRow('zhchsReason','sltReasonTemplate',tmpName,tmpRemark);	
				}
			}		
		}
	    if(meass.length>0){
			for(var i=0,len = meass.length;i<len;i++){
				var tmpName = "";
				var tmpRemark = "";
				if(meass[i].split('��').length>0){
					var seqIndex = meass[i].indexOf('��');
					tmpName = meass[i].split('��')[0].substring(seqIndex+1);
					tmpRemark =  meass[i].split('��')[1];
				}
				if(tmpName!=''){
					addTemRow('zhchs','sltTemplate',tmpName,tmpRemark);	
				}
			}		
		}
	}
}

var overColor="#F1F1C6"; 
function doRowMouseOver(oTR){
		priorColor = oTR.bgColor;
		oTR.bgColor=overColor;
}

function doRowMouseOut(oTR){
		oTR.bgColor="#ffffff";
}
function delTemRow(ctTable){
		var zhchs  = document.getElementById(ctTable);
		var emt = event.srcElement;
		var rIndex = emt.parentElement.parentElement.rowIndex;
		zhchs.deleteRow(rIndex);
		for(var i=1;i<zhchs.rows.length;i++){
			zhchs.rows[i].cells[0].innerText =zhchs.rows[i].rowIndex ;
		}
}

function addTemRow(ctTable,ctSelect,tmpName,tmpRemark){
		var zhchs  = document.getElementById(ctTable);
		var ctTemp = document.getElementById(ctSelect);
		var rLen = zhchs.rows.length;
		var nRow = zhchs.insertRow();
		nRow.onmouseover=function(){doRowMouseOver(this);};
		nRow.onmouseout=function(){doRowMouseOut(this);};
		nRow.bgColor="#ffffff";
		 
		var nCell = nRow.insertCell();
		nCell.innerText =rLen;
		nCell.style.textAlign='center';
		 
		var nCell1 = nRow.insertCell();
		if(tmpName !=null){
			nCell1.innerText =tmpName;
		}
		else{
			nCell1.innerText = ctTemp.options[ctTemp.selectedIndex].innerText;
		}
		
		var nCell2 = nRow.insertCell();
		if(tmpRemark!=null ){
			nCell2.innerHTML ="<input type='text' style='border:none;width:100%' value='"+tmpRemark+"'/>" ;
		}
		else{
				nCell2.innerHTML ="<input type='text' style='border:none;width:100%' value='"+ctTemp.value+"'/>" ;
		}
		
		var nCell3 = nRow.insertCell();
		nCell3.innerHTML ="<img style='cursor:hand' src='../../resource/image/ico/delete.gif' onclick=delTemRow('"+ctTable+"') alt='ɾ��'/>";
}

function setReasonSolveRows(){
	var params = fetchReasonSolve(null,null);
	
	var sReason = "",sMeasure = "";
	if(params.proReasons!=null){
		for(var i=0,len = params.proReasons.length;i<len;i++){
			sReason+=(i+1)+("��"+params.proReasons[i].name+"��"+params.proReasons[i].detail+"\r\n");
		}
	}
	if(params.measures!=null){
		for(var i=0,len = params.measures.length;i<len;i++){
			sMeasure+=(i+1)+("��"+params.measures[i].name+"��"+params.measures[i].detail+"\r\n");
		}
  }
	if(sReason!='' ){
		proReason.value = sReason;
	}
	if(sMeasure!='' ){
		measures.value =  sMeasure;
	}
}

//�澯�������
function alarmDias(isInfoPage)
{
	if(!isInfoPage) {
		setCurrentTable();
		var alarmId = oData.getPropertys("id");
		if(alarmId.length == 0) {
			alert("��ѡ��һ��");
			return false;
		} else if(alarmId.length>1){
			alert("ֻ��ѡ��һ��");
			return false;
		}
		window.open("/workshop/dias/Main.html?alarmListId="+alarmId);
	} else {
		return false;
	} 
}

function alarmValidityChanage(validity)
{
	if(validity == 'true')
	{
		document.getElementById('invalidReason').selectedIndex = -1;
		document.getElementById('alarmValidity').value = '0SA';
		document.getElementById('invalidReasonBox').style.display = 'none';
	}
	else
	{
		document.getElementById('alarmValidity').value = '0SX';
		document.getElementById('invalidReasonBox').style.display = '';
	}
}

function loadInvalidReason()
{
	var validityCfg = $getSysVar("ALARM_VALIDITY_PAGE_CONFIG");
	if(validityCfg == '1')
	{
		document.getElementById('alarmValidityTR').style.display = '';
	}
	else
	{
		document.getElementById('alarmValidityTR').style.display = 'none';
	}
	xmlhttp.open("POST", "../../../servlet/codeListCtrl.do?method=getCodeList&type=ALAER_INVALID_REASON", false);
	xmlhttp.send();
	if (isSuccess(xmlhttp))
	{
		var selectObj = document.getElementById('invalidReason');
		var rowSet = xmlhttp.responseXML.selectNodes("/root/rowSet");
		selectObj.add(document.createElement("OPTION"));
		for (var i = 0; i < rowSet.length; i++) {
			var node = rowSet[i];
			var oOption = document.createElement("OPTION");
			oOption.value = node.selectSingleNode("CODE").text;
			oOption.text = node.selectSingleNode("MEAN").text;	
			selectObj.add(oOption);
		}
	}
}


//�ж��Ƿ���Ҫ��֤��ѡ type:1=���,2=ɾ�� sysConfig=Ĭ��ϵͳ����
var checkConfigObj;
function initCheckConfig(type,sysConfigVar){
	var sysConfigValue;
	var alarmConfig;
	var length = alarmIds.length,arr=[];
	var alarmAry;
	if(typeof(alarmIds)=='string'){
		arr.push(alarmIds);
		alarmAry = arr[0].split(",");
	}else{
		arr = alarmIds;
		alarmAry = alarmIds;
	}
	var alarmAryLen = alarmAry.length || 1;
	if((length == 1 || arr.length==1)&&alarmAryLen==1){
		var data;
		data = queryData("select b.VALUE TEXT from ne_alarm_list a right join alarm_info_control_config b on a.kpi_id = b.kpi_id where b.type = "+type+" and a.ne_alarm_list_id = "+arr[0]);		
		if(data && data.length > 0){
			alarmConfig = data[0];
		}
	}
	if(alarmConfig){
		sysConfigValue = alarmConfig;
	}
	sysConfigValue = alarmConfig ? alarmConfig : $getSysVar(sysConfigVar);
	
	checkConfigObj = json2Obj(sysConfigValue);
	showX();
}
//��ʾ�������*��
function showX(){
	try{
		for (var objName in checkConfigObj){
	    	//alert(objName + ":" + checkConfigObj[objName]);
			if(checkConfigObj[objName]){
	    		var node = document.getElementById(objName);
	    		node.parentNode.nextSibling.firstChild.style.display = "";
			}
		}
	}catch(e){
	}
}

//{proPheno:false,proReason:false,aftermath:false,measures:false,oprtResult:true}
//���θ澯
function shieldRule(isInfoPage){
	if(!isInfoPage){//�һ�������
		setCurrentTable();
	  	var ne_flag = 2;
	  	var kpiId = oData.getPropertys("kpi_id");
		var neId = oData.getPropertys("ne_id");
		var configNeId = oData.getPropertys("config_ne_id");
		var busiModuleId = oData.getPropertys("busi_module_id");
		window.showModalDialog("/workshop/config/shieldRule.html",{ne_flag:ne_flag,itemId:neId,kpiId:kpiId,config_ne_id:configNeId,busi_module_id:busiModuleId},"dialogWidth=400px;dialogHeight=200px;help=0;scroll=1;resizable=0;status=0;");
	}else{
		//Ԥ��
	};
}