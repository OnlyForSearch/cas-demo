xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var alarmMergeUrl = "../../servlet/alarmMergeServlet?";//告警归并
var submitURL;
var returnXml;//从服务端返回的XML串

var oData;                //当前table的id
///////////////// 

var alarm_state_no_clear = 0  ; //告警状态：未清除
var alarm_state_clear    = 1  ; //告警状态：已清除

var oprt_state_no_oprt   = 10 ; //操作状态：未操作
var oprt_state_ack       = 20 ; //操作状态：确认
var oprt_state_spd       = 25 ; //操作状态：挂起
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
var reFreshFlag = 0;//刷新标记,判断是否是主界面链接进来的,如果是标记为1,说明要刷新

var comeFrom = "";
var alarmType = "";

var step =200;//批量操作告警时，每次处理的告警数量
var isAlarmPageUseTemplate;
//初始化处理结果
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
		//填写原来的处理情况
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
	//造成结果
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
				//产生原因
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
				//采取措施		
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
//取得权限
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
//******************** 1. 告警查看 *****************************************
//*************************************************************************/
/**
 * 1-1. 阅读告警
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
		alert("请选择一项");
		return false;
	}
	else if(alarmIds.length>1)
	{
		alert("只能选择一项");
		return false;
	}
	var	alarmId = window.oData.getPropertys("id")[0];
	//如果是从网元树打开的告警信息页面，在清除、删除的时候需要进行刷新
	var neParam = (comeFrom == "neTree")?"&comeFrom=neTree&isRefresh=true&refreshFunc=window.opener.top.frames[0].window.loadAlarmLevel()":"";
	currenWin.open("viewAlarmInfo.htm?alarmId="+alarmId+"&flag="+flag+ neParam,'_blank',"resizable=1,scrollbars=1,top=0,left=0,help=0,status=0");
}

//*************************************************************************
//******************** 2. 告警确认 ******************************************
//*************************************************************************/
/**
 * 2-1. 确认告警时，弹出窗口
 *
 *      (1). 已清除或已删除的告警不能再进行告警确认，当选择多条记录时，有一条已清除或删除的也不行
 *      (2). isInfoPage true表示告警详细页面调用 false为归并告警列表调用
 *      (3). ifWorker 表示是否派单 1 表示派单系统 0表示不派单系统
 */
function popupACKWindow(isInfoPage,ifWorker)//弹出告警确认窗口
{
	var vState="";
	var length=0;
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0)
		{
			alert("请选择项(可多选)");
			return false;
		}
		var tFirst=0;
		//var SalarmState=oData.getPropertys("alarmState");// 告警状态
		var SoprtState=oData.getPropertys("oprtState");  //操作状态
		//var SalarmClass=oData.getPropertys("alarmClass");// 告警级别
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
			alert("告警已经被挂起、清除或删除，不能进行告警确认操作..!");
			return;
		}
	}else{
		for(var i=0;i<length;i++)
		{
			if(SoprtState[i].isInArray([oprt_state_spd,oprt_state_clear,oprt_state_del]))
			{
				alert("所选告警记录包含已经被挂起、清除或删除的告警，请重新选择..!");
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
		
	//如果是从网元树链接过来的，只有清除和删除操作才需要执行更新告警级别的操作
	//此时的刷新函数是网元树中定义的，功能是刷新网元树的告警级别
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
	//列表入口
	if(typeof(oData)!='undefined'){
		var rowDoc = oData.getSelectedRowXML();
		if(rowDoc!=null){
			var alarmTypeNode=rowDoc.selectSingleNode("//rowSet/ALARM_TYPE");
			if(alarmTypeNode){
				this.alarmType = alarmTypeNode.text;
			}
		}
	}
	else{//详细页面入口
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
 * 2-2. 确认工单时，弹出窗口
 *
 *      (1). 根据传入的flowId, 确认同一流程的告警。
 */
function popupACKWorkWindow(isInfoPage)//弹出工单的告警全部确认窗口
{
	var ErrMsg="";
	if(isInfoPage){
		ErrMsg="该告警未派单，不能工单确认!";
	}else {
		ErrMsg="该告警未派单或所选的告警不在同一个故障单上，不能工单确认！";
		setCurrentTable();
	}
	
	var inflowId;
	var alarmIds;
	if(!isInfoPage){
		alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0)
		{
			alert("请选择项(可多选)");
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
		MMsg("没有对应的工单号，请重新确认！");
		return;
	}
	if(!confirm("你确定要确认当前工单的所有告警吗？"))
		return;
	
	var params = fetchReasonSolve(alarmIds,"1");	
	window.showModalDialog("ACKAlarmAll.htm?flowId="+inflowId,params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");	
	if(!isInfoPage)
		oData.doRefresh(false);
		
	//如果是从网元树链接过来的，只有清除和删除操作才需要执行更新告警级别的操作
	//此时的刷新函数是网元树中定义的，功能是刷新网元树的告警级别
	if(comeFrom == "neTree") {
		return;
	} 
	callbackRefresh(isInfoPage);
}

/**
 * 2-3. 确认全部告警时，弹出窗口
 *
 *      (1). 只能确认“有权限”的告警。
 */
function popupACKAllWindow(ifWorker)//弹出查询结果的告警全部确认窗口
{
	setCurrentTable(); 
	
	if(!confirm("你确定要确认当前查询结果的所有告警吗？"))
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
		MMsg("包含不是您所受理的告警,不能操作！,请选择属于您受理的告警！");
		return;
	}
	var row=returnXml.selectSingleNode("/root/ALARM_ID");
	alarmIds = row.text;
	if(alarmIds==''){
		alert('当前页没有可确认的告警');
		return false;
	}
	var alarmIdArray=alarmIds.split(",");
	if(alarmIdArray.length>1000){
		alert('当前准备确认的告警数超过1000条，无法全部确认');
		return;
	} 	
	var params = fetchReasonSolve(alarmIds,ifWorker);
	window.showModalDialog("ACKAlarmAll.htm",params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");
	oData.doRefresh(false);
	
	//如果是从网元树链接过来的，只有清除和删除操作才需要执行更新告警级别的操作
	//此时的刷新函数是网元树中定义的，功能是刷新网元树的告警级别
	if(comeFrom == "neTree") {
		return;
	} 	
	callbackRefresh();
}

/**
 * 2-4. 确认操作
 * 
 */
function ACKAlarm(bClosed)//告警确认
{
	var alarmValidity = document.getElementById('alarmValidity').value;
	var invalidReasonCode = document.getElementById('invalidReason').value;
	
	if(alarmValidity == '0SX' && invalidReasonCode == "")
	{
		alert("请选择无效原因！");
		return;
	}
	
	var errorXML="";
    var flag=true;
    var sumDealNums=0;
    var errorNums=0;
	if(!confirm("你确定要进行告警确认操作吗？(告警数量多的情况下后台处理时间将有可能稍长，请耐心等待...)"))
		return;
	if(!validateData())return;
	var value = oprtResult.value;
	if(!value.hasText()){
		value = "无";
	}
	var cId="";
	
	if( typeof currentFlowId=='undefined'||currentFlowId ==null){
		//单条 多条告警确认
		submitURL = alarmMergeUrl + "tag=11&oprtResult="+encodeURIComponent(value);  
		cId="";
	}
	else{
		//工单的所有告警确认
		submitURL = alarmMergeUrl + "tag=12&flowId="+currentFlowId+"&oprtResult="+encodeURIComponent(value);
		cId=currentFlowId;
	}

	if(alarmIds != null) {
		var alarmItems = (new String(alarmIds)).split(",");
		
		var reTimes = Math.ceil(alarmItems.length / step);
		
		for(var i=0;i<reTimes;i++) {
			/*if(reTimes > 1) {//只有分多次操作时才提醒用户确认操作结果
				alert("请耐心等待第" + (i + 1) + "次操作结果返回,共" + reTimes + "次");
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
			alert("确认成功！");
		}
	}
	if(bClosed)
		window.close();
	
}

//*************************************************************************
//******************** 3. 告警挂起 ******************************************
//*************************************************************************/
/**
 * 3.1 弹出告警挂起窗口
 * 弹出告警挂起窗口,isInfoPage是否是详细信息页面，ifWorker是否需要工单校验
 */
function popupSPDWindow(isInfoPage,ifWorker) {//弹出告警挂起窗口
	var vState="";
	var length=0;
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0)
		{
			alert("请选择项(可多选)");
			return false;
		}
		var tFirst=0;
		//var SalarmState=oData.getPropertys("alarmState");// 告警状态
		var SoprtState=oData.getPropertys("oprtState");  //操作状态
		//var SalarmClass=oData.getPropertys("alarmClass");// 告警级别
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
			alert("告警已经被清除或删除，不能进行告警确认操作..!");
			return;
		}
	}else{
		for(var i=0;i<length;i++)
		{
			if(SoprtState[i].isInArray([oprt_state_clear,oprt_state_del]))
			{
				alert("所选告警记录包含已经被清除或删除的告警，请重新选择..!");
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

	//如果是从网元树链接过来的，只有清除和删除操作才需要执行更新告警级别的操作
	//此时的刷新函数是网元树中定义的，功能是刷新网元树的告警级别
	if(comeFrom == "neTree") {
		return;
	} 	
	callbackRefresh(isInfoPage);
}

/**
 * 3.2. 工单挂起时，弹出窗口
 * 根据传入的flowId, 挂起同一流程的告警
 */
function popupSPDWorkWindow(isInfoPage)//弹出工单的告警全部挂起窗口
{
	var ErrMsg="";
	if(isInfoPage){
		ErrMsg="该告警未派单，不能工单挂起!";
	}else {
		ErrMsg="该告警未派单或所选的告警不在同一个故障单上，不能工单挂起！";
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
		MMsg("没有对应的工单号，请重新确认！");
		return;
	}
	if(!confirm("你确定要挂起当前工单的所有告警吗？"))
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

	//如果是从网元树链接过来的，只有清除和删除操作才需要执行更新告警级别的操作
	//此时的刷新函数是网元树中定义的，功能是刷新网元树的告警级别
	if(comeFrom == "neTree") {
		return;
	} 		
	callbackRefresh(isInfoPage);
}

/**
 * 3.3. 挂起全部告警时，弹出窗口
 * 只能挂起“有权限”的告警。
 */
function popupSPDAllWindow(ifWorker)//弹出查询结果的告警全部挂起窗口
{
	setCurrentTable(); 
	
	if(!confirm("你确定要挂起当前查询结果的所有告警吗？"))
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
		MMsg("包含不是您所受理的告警,不能操作！,请选择属于您受理的告警！");
		return;
	}
	var row=returnXml.selectSingleNode("/root/ALARM_ID");
	alarmIds = row.text;
	if(alarmIds==''){
		alert('当前页没有可挂起的告警');
		return false;
	}
	var alarmIdArray=alarmIds.split(",");
	if(alarmIdArray.length>1000){
		alert('当前准备挂起的告警数超过1000条，无法全部挂起');
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

	//如果是从网元树链接过来的，只有清除和删除操作才需要执行更新告警级别的操作
	//此时的刷新函数是网元树中定义的，功能是刷新网元树的告警级别
	if(comeFrom == "neTree") {
		return;
	}	
	callbackRefresh();
}

/**
 * 3.4. 挂起操作
 * 
 */
function SPDAlarm(bClosed)//告警挂起
{
	var alarmValidity = document.getElementById('alarmValidity').value;
	var invalidReasonCode = document.getElementById('invalidReason').value;
	
	if(alarmValidity == '0SX' && invalidReasonCode == "")
	{
		alert("请选择无效原因！");
		return;
	}
	
	var errorXML="";
    var flag=true;
    var sumDealNums=0;
    var errorNums=0;
	if(!confirm("你确定要进行告警挂起操作吗？(告警数量多的情况下后台处理时间将有可能稍长，请耐心等待...)"))
		return;
	if(!validateData())return;
	var value = oprtResult.value;
	if(!value.hasText()){
		value = "无";
	}
	var cId="";
	
	if( typeof currentFlowId=='undefined'||currentFlowId ==null){
		//单条 多条告警挂起
		submitURL = alarmMergeUrl + "tag=38&oprtResult="+encodeURIComponent(value);  
		cId="";
	}
	else{
		//工单的所有告警挂起
		submitURL = alarmMergeUrl + "tag=39&flowId="+currentFlowId+"&oprtResult="+encodeURIComponent(value);
		cId=currentFlowId;
	}

	if(alarmIds != null) {
		var alarmItems = (new String(alarmIds)).split(",");
		
		var reTimes = Math.ceil(alarmItems.length / step);
		
		for(var i=0;i<reTimes;i++) {
			/*if(reTimes > 1) {//只有分多次操作时才提醒用户确认操作结果
				alert("请耐心等待第" + (i + 1) + "次操作结果返回,共" + reTimes + "次");
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
			alert("挂起成功！");
		}
	}
	if(bClosed)
		window.close();
	
}


//*************************************************************************
//******************** 4. 告警删除 ******************************************
//*************************************************************************/
/**
 * 4-1. 删除告警时，弹出窗口
 *
 *      (1). 状态为“已删除”的记录不能再删除。
 *      (2). flag 申告告警删除时，flag="sg"，其他情况为""
 */
function popupDELWindow(flag,isInfoPage,ifWorker)//弹出告警删除窗口
{
	var vState="";
	var length=0;
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0)
		{
			alert("请选择项(可多选)");
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
			alert("告警已经被删除，不能进行告警删除操作..!");
			return;
		}
	}else{
		for(var i=0;i<length;i++)
		{
			if(SoprtState[i]==oprt_state_del)
			{
				alert("所选告警记录包含已经被删除的告警，请重新选择..!");
				return;
			}
		}
	}


	var temp="";
	//申告告警清除
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
 * 4-2. 删除全部告警时，弹出窗口
 *
 *      (1). 只能删除“有权限”的告警。
 */
function popupDELAllWindow(ifWorker)//弹出查询结果的告警全部确认窗口
{
	setCurrentTable(); 
	
	if(!confirm("你确定要删除当前查询结果的所有告警吗？"))
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
		MMsg("包含不是您所受理的告警,不能操作！,请选择属于您受理的告警！");
		return;
	}
	//alert(returnXml.xml)
	var row=returnXml.selectSingleNode("/root/ALARM_ID");
	alarmIds = row.text;
	if(alarmIds==''){
		alert('当前页没有可删除的告警');
		return false;
	}
	var alarmIdArray=alarmIds.split(",");
	if(alarmIdArray.length>1000){
		alert('当前准备删除的告警数超过1000条，无法全部删除');
		return;
	}
	
	var params = fetchReasonSolve(alarmIds,ifWorker);	
	var temp="?flag=";
	window.showModalDialog("DELAlarmAll.jsp"+temp,params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");
	oData.doRefresh(false); 
	callbackRefresh();
}

/**
 * 4.3. 删除操作
 * 
 */
function DelAlarm(bClosed)//告警删除
{
	var alarmValidity = document.getElementById('alarmValidity').value;
	var invalidReasonCode = document.getElementById('invalidReason').value;
	
	if(alarmValidity == '0SX' && invalidReasonCode == "")
	{
		alert("请选择无效原因！");
		return;
	}
	
	var errorXML="";
    var flag=true;
    var sumDealNums=0;
    var errorNums=0;
	if(!confirm("你确定要进行告警删除操作吗？(告警数量多的情况下后台处理时间将有可能稍长，请耐心等待...)"))
		return;
	if(!validateData())return;
	if(!showMsgByConfig(checkConfigObj))return;
	var value = oprtResult.value;
	if(!value.hasText()){
		value = "无";
	}
	var cId="";
	
	if( typeof currentFlowId=='undefined'||currentFlowId ==null){
		//单条 多条告警删除
		submitURL = alarmMergeUrl + "tag=14&oprtResult="+encodeURIComponent(value);  
		cId="";
	}	
	else{
		//工单的所有告警删除
		submitURL = alarmMergeUrl + "tag=15&flowId="+currentFlowId+"&oprtResult="+encodeURIComponent(value);
		cId=currentFlowId;
	}
	if(alarmIds != null) {
		var alarmItems = (new String(alarmIds)).split(",");
		
		var reTimes = Math.ceil(alarmItems.length / step);
		
		for(var i=0;i<reTimes;i++) {
			/*if(reTimes > 1) {//只有分多次操作时才提醒用户确认操作结果
				alert("请耐心等待第" + (i + 1) + "次操作结果返回,共" + reTimes + "次");
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
			alert("删除成功！");
		}
	}
	if(bClosed)
		window.close();
	
}



//*************************************************************************
//******************** 5. 告警清除 ******************************************
//*************************************************************************/
/**
 * 5.1. 清除告警时，弹出窗口
 *
 *      (1). 如果是已清除或已删除的告警，不能清除。
 */
function popupCLRWindow(isInfoPage,ifWorker)//弹出告警清除窗口
{
	var vState="";
	var length=0;
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0)
		{
			alert("请选择项(可多选)");
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
			alert("告警已经被清除或被删除，不能进行告警清除操作..!");
			return;
		}
	}else{
		for(var i=0;i<length;i++)
		{
			if(SoprtState[i].isInArray([oprt_state_clear,oprt_state_del]))
			{
				alert("所选告警记录包含已经被清除或被删除的告警，请重新选择..!");
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
 * 5.2. 清除全部告警时，弹出窗口
 *
 *      (1). 只能清除“有权限”的告警。
 */
function popupCLRAllWindow(ifWorker)//弹出查询结果的告警全部清除窗口
{
	setCurrentTable();
	
	if(!confirm("你确定要清除当前查询结果的所有告警吗？"))
		return;
	var alarmIds;
	var dom = new ActiveXObject("Microsoft.XMLDOM");
	dom.loadXML(getSearchXmlStr());
	submitURL = alarmMergeUrl + "tag=13"+getSearchParam();  
	getServeXML(dom)
	var error_code = xmlhttp.responseXML.selectSingleNode("/root/error_code");
	if(ifWorker=="1" && error_code==null)
	{
		MMsg("包含不是您所受理的告警,不能操作！,请选择属于您受理的告警！");
		return;
	}
	var row=returnXml.selectSingleNode("/root/ALARM_ID");
	alarmIds = row.text;
	if(alarmIds==''){
		alert('当前页没有可清除的告警');
		return false;
	}
	var alarmIdArray=alarmIds.split(",");
	if(alarmIdArray.length>1000){
		alert('当前准备清除的告警数超过1000条，无法全部清除');
		return;
	}
	
	var params = fetchReasonSolve(alarmIds,ifWorker);	
	window.showModalDialog("CLRAlarmAll.jsp",params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");
	oData.doRefresh(false);
	callbackRefresh();
}
/**
 * 5.3. 工单清除
 */

function popupCLRWorkWindow(isInfoPage)
{
	var ErrMsg="";
	if(isInfoPage){
		ErrMsg="该告警未派单，不能工单清除！";
	}else{
		setCurrentTable();
		ErrMsg="该告警未派单或所选的告警不在同一个故障单上！不能工单清除";
	}
	var inflowId;
	if(!isInfoPage){	
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0)
		{
			alert("请选择项(可多选)");
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
		MMsg("没有对应的工单号，请重新确认！");
		return;
	}
	if(!confirm("你确定要清除当前工单的所有告警吗？"))
		return;
	var temp="";
	
	var params = fetchReasonSolve(alarmIds,"1");
	window.showModalDialog("CLRAlarmAll.jsp?flowId="+inflowId,params,"dialogWidth=40;dialogHeight=32;help=0;scroll=0;status=0;");	
	if(!isInfoPage)
		oData.doRefresh(false);
	callbackRefresh(isInfoPage);	
}
/**
 * 5.4. 清除操作
 *
 */

var isSave=false;//生成知识前先判断是否成功保存了清除信息 浙江ITSM用PATCH_20140526_01330
function CLRAlarm(bClosed)//告警清除
{
	var alarmValidity = document.getElementById('alarmValidity').value;
	var invalidReasonCode = document.getElementById('invalidReason').value;

	if(alarmValidity == '0SX' && invalidReasonCode == "")
	{
		alert("请选择无效原因！");
		return;
	}
	 
	var errorXML="";
    var flag=true;
    var sumDealNums=0;
    var errorNums=0;
	if(!confirm("你确定要进行告警清除操作吗？(告警数量多的情况下后台处理时间将有可能稍长，请耐心等待...)"))
		return;	
	if(!validateData())return;
	if(!showMsgByConfig(checkConfigObj))return;	
	
	var value = oprtResult.value; 
	var cId="";
	if( typeof currentFlowId=='undefined'||currentFlowId ==null){
		//单条 多条告警清除		
		submitURL = alarmMergeUrl + "tag=16&oprtResult="+encodeURIComponent(value);
		cId="";
	} 
	else{
		//工单的所有告警清除
		submitURL = alarmMergeUrl + "tag=17&flowId="+currentFlowId+"&oprtResult="+encodeURIComponent(value); 
		cId=currentFlowId;
	}
	
	if(alarmIds != null) {
		var alarmItems = (new String(alarmIds)).split(",");
		
		var reTimes = Math.ceil(alarmItems.length / step);
		for(var i=0;i<reTimes;i++) {
		/*	if(reTimes > 1) {//只有分多次操作时才提醒用户确认操作结果
				alert("请耐心等待第" + (i + 1) + "次操作结果返回,共" + reTimes + "次");
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
				//如果与后台交互失败，则本次操作失败，退出
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
			alert("清除成功！");
			isSave=true;
		}
	}
	if(bClosed)
		window.close();
}

//确认并生成知识
function alarmToKnowledge(){
	if(!isSave){
		CLRAlarm(false);
	}
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var url = "/servlet/ZJKnowledge?tag=10&alarmId="+alarmIds;//此alarmIds是CLRAlarm.jsp中的
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
	var nodes =xmlhttp.responseXML.selectNodes("/ERR_INFO");
	var flagReturn=nodes[0].selectSingleNode("ERROR_CODE").text;
	if (flagReturn=="0"){
		isSave=false;
		alert("生成知识成功!");
		window.close();
	}else{
		alert("生成知识失败!");
	}
}

//告警解决方案查询
function showKnowledge(){
	var strArray=new Array();
	strArray[0]=document.getElementById("ne_name").innerHTML;
	strArray[1]=document.getElementById("kpi_name").innerHTML;
	strArray[2]=document.getElementById("config_ne_name").innerHTML;
	window.showModalDialog("alarmKnowledgeShow.html",strArray,"dialogWidth=1000px;dialogHeight=600px;;help=0;scroll=0;status=0;");
}

//获取产生原因和采取措施的信息
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
			//outHtml += document.getElementById(id).rows[i].innerText+"  "+document.getElementById(id).rows[i].children[2].children[0].value+"。  ";
			outHtml += document.getElementById(id).rows[i].cells[0].innerText+"、 "+document.getElementById(id).rows[i].cells[1].innerText+"； "+document.getElementById(id).rows[i].children[2].children[0].value+"\r\n";
			
		}				
		return outHtml;
	}
	return arr;
}
function showMsgByConfig(obj){	
	if(!obj){
		MMsg("获取配置数据出错!");
		return false;
	}
	var arr = [{name:'proPheno',value:'对不起，产生现象为空，不能提交！'},
	           {name:'proReason',value:'对不起，产生原因为空，不能提交！'},
	           {name:'aftermath',value:'对不起，造成后果为空，不能提交！'},
	           {name:'measures',value:'对不起，采取措施为空，不能提交！'},
	           {name:'oprtResult',value:'对不起，最终结果为空，不能提交！'}
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
	
	var arr = [{name:'expert_advice',value:'对不起，您输入的专家建议大于2000个字符，不能提交！'}];		
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
//******************** 6. 告警升级 *****************************************
//*************************************************************************/
/**
 * 6.1. 升级告警时，弹出窗口
 *
 *      (1). 如果是“已清除”或“已竣工”的，不能升级。
 *      (2). 对于事件，则不能升级。
 */
function popupUpgradeWindow(isInfoPage,ifWorker)//弹出告警升级窗口
{
	var vState="";
	var vLevel="";
	var length=0;
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0){
			alert("请选择项(可多选)");
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
			alert("告警已是最高级别，不能再进行告警升级操作..!");
			return;
		}
		if(vState.isInArray([oprt_state_clear,oprt_state_del]))
		{
			alert("告警已经被清除或删除，不能进行告警升级操作..!");
			return;
		}
	}else{
		for(var i=0;i<length;i++)
		{			
			if(SalarmLevel[i]==1){
				alert("所选告警包含最高级别告警，不能再进行告警升级操作..!");
				return;
			}			
			if(SoprtState[i].isInArray([oprt_state_clear,oprt_state_del]))
			{
				alert("所选告警记录包含已经被清除或删除的告警，请重新选择..!");
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
 * 6.2. 升级操作
 *
 */
function upgradeAlarm(bClosed)//告警升级
{
	var value = oprtResult.value;
	if(!validateData())return;
	if(alarmLevel.getObject().selectedIndex <=0)
	{
		alert("告警级别不能为空..!");
		return false;
	}
	if(!value.hasText())
	{
		MMsg("对不起，最终结果为空，不能提交！");
		return;
	}
	if(!confirm("你确定要告警升级操作吗？"))
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
			alert("升级成功！");
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
	var alarmClass=oData.getPropertys("alarmClass"); 
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
			if((alarmClass[i]!=null || alarmClass[i]!="") && (alarmClass[i]==9 || alarmClass[i]=="9")){
				alert("所选告警记录中包含事件，请重新选择..!");
				return;
			}
		}//for的循环
	}

	resultArr = window.showModalDialog("operAlarm.jsp",window.oData,"dialogWidth=30;dialogHeight=15;help=0;scroll=0;status=0;");
}


/**
 * Add by @author guoyg
 * @version 2008-06-12 1.0
 * 告警传送操作
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
			alert("请选择项(可多选)");
			return false;
		} else if(alarmIds.toString().length > 2000) {
			alert("挑选的告警数目太多，请重新挑选！");
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
			alert("所选告警已经被确认、清除或删除，不能再进行告警传送操作..!");
			return false;
		}
	} else {
		for(var i=0;i<len;i++){
			if(SoprtState[i].isInArray([oprt_state_ack,oprt_state_clear,oprt_state_del])){
				alert("所选告警记录包含\"已确认、已清除或已删除\"状态的告警，请重新选择..!");
				return false;
			}
		}
	}
	if(confirm("你确定要告警传送操作吗..?(告警数量多的情况下后台处理时间将有可能稍长，请耐心等待...)")){
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
				alert("传送成功！");
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
 * 告警派单跳转故障管理流程操作
 */
function sendAlarmList(isInfoPage,flowMod){
	var alarmIds;
	var iFlowId = new Array();
	
	if(!isInfoPage){
		setCurrentTable();
		alarmIds = oData.getPropertys('id');
		iFlowId = oData.getPropertys('flow_id');
		if(alarmIds.length==0){
			alert("请选择项");
			return false;
		} else if(alarmIds.length>1) {
			alert("只能选择一项");
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
		alert("所选告警已经被清除或删除，不能再进行告警派单操作..!");
		return false;
	}*/
	if(confirm("你确定要告警派单操作吗..?")){
		if(iFlowId[0]!=null && iFlowId[0]!=""){
			if(!(confirm("告警已派单，你确定要进行告警分派操作吗..?"))){
				return;
			}
		}
		currenWin.open("../../workshop/form/index.jsp?flowMod=" + flowMod + "&alarmId=" + alarmIds);
	}
	if(!isInfoPage)
		oData.doRefresh(false);
}

//告警派单 
function sendAlarmWork(isInfoPage, isOnly)
{
	var length=0;
	var vState="";
	var iFlowId = new Array();
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");	
		iFlowId=oData.getPropertys("flow_id"); //判断当前告警记录是否已经派单，存在流程ID则已派单
		if(alarmIds.length==0){
			alert("请选择项" + (isOnly)?"(单项)":"(可多选)");
			return false;
		} else if(isOnly && alarmIds.length>1) {
			alert("只能选择一项");
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
			alert("所选告警已经被清除或删除，不能再进行告警派单操作..!");
			return false;
		}
		if(SalarmClass==9 || SalarmClass=="9"){
			eventClass=9;
		}
	}else{
		for(var i=0;i<length;i++){
			if(SoprtState[i].isInArray([oprt_state_clear,oprt_state_del])){
				alert("所选告警记录包含\"已清除或已删除\"状态的告警，请重新选择..!");
				return false;
			}
			if((SalarmClass[i]!=null || SalarmClass[i]!="") && (SalarmClass[i]==9 || SalarmClass[i]=="9")){
				eventCnt=eventCnt+1;
			}
		}//for的循环
		if(eventCnt==0){
			eventClass=-1;
		}else if(eventCnt==length){
			eventClass=9;
		}else{	
			alert("所选告警记录必须全部事件或全部告警，请重新选择..!");
			return false;
		}
	}
	if(confirm("你确定要告警派单操作吗..?")){
		for(var k=0;k<iFlowId.length;k++){
			if(iFlowId[k]!=null && iFlowId[k]!=""){
				if(!(confirm("告警已派单，你确定要进行告警分派操作吗..?"))){
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
			MMsg("流程启动成功！");
			    currenWin.open("../../FlowCreateNext?system_code=D&tch_id="+oRows.text);
		}
	}
	if(!isInfoPage)
		oData.doRefresh(false);
}

/**
 * 故障单处理
 */
function doAlarmWork(isInfoPage) {
	var inFlowId = "";
	var workAlarmId = "";
	if(!isInfoPage) {
		setCurrentTable();
		var alarmId = oData.getPropertys("id");
		if(alarmId.length == 0) {
			alert("请选择一项");
			return false;
		} else if(alarmId.length>1){
			alert("只能选择一项");
			return false;
		}
		
		inFlowId = oData.getPropertys("flow_id");
		workAlarmId = alarmId;
	} else {
		inFlowId = flowId;
		workAlarmId = alarmId;
	}
	
	if(inFlowId == null || inFlowId == ""){
		alert("告警没有相关的处理流程，未派单!");
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

//查看故障单(应该是流程处理模板)
function alarmFlowView(isInfoPage) {
	var inFlowId="";
	if(!isInfoPage){
		setCurrentTable();
		var alarmId = oData.getPropertys("id");
		if(alarmId.length==0){
			alert("请选择一项");
			return false;
		}else if(alarmId.length>1){
			alert("只能选择一项");
			return false;
		}
		inFlowId=oData.getPropertys("flow_id"); //判断当前告警记录是否已经派单，存在流程ID则已派单
	} else {
		inFlowId=flowId;
	}
	if(inFlowId == null || inFlowId == ""){
		alert("告警没有相关的处理流程，未派单!");
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
//原始告警消息查询
function oriAlarmMsgQry(isInfoPage)
{
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
			if(alarmIds.length==0){
			alert("请选择一项");
			return false;
		}else if(alarmIds.length>1){
			alert("只能选择一项");
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
//原始性能消息查询
function oriPerfMsgQry(isInfoPage)
{
	if(!isInfoPage){
		setCurrentTable();
		var flag = oMPC.selectedIndex; //0:业务系统 1:非业务系统
		if(typeof alarmOprtConfig != "undefined") {
    		flag = (alarmOprtConfig.systemType=="2"?"":alarmOprtConfig.systemType);
    	}		
		var perfId = oData.getPropertys("perf_msg_id");
		var generatedate = oData.getPropertys("generatedate");
		var last_date = oData.getPropertys("lastdate");		
		if(perfId.length==0){
			alert("请选择一项");
			return false;
		}else if(perfId.length>1){
			alert("只能选择一项");
			return false;
		}
    	var params = "?flag=" + flag + "&perfid=" + perfId + "&lastdate=" + last_date + "&generatedate=" + generatedate;
	}else{
    	var params = "?flag=" + isOptSysflag + "&perfid=" + perf_msg_id + "&lastdate=" + last_date + "&generatedate=" + generatedate;
    }
	window.showModalDialog("../permanager/originPerView.htm" + params,window,"dialogWidth=40;dialogHeight=31;help=0;scroll=0;status=0;");
}
//关联告警查询
function relationAlarmQry(isInfoPage){
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0){
			alert("请选择一项");
			return false;
		}else if(alarmIds.length>1){
			alert("只能选择一项");
			return false;
		}
	}else alarmIds=alarmId;
	window.showModalDialog("relationAlarmQry.htm",alarmIds,"dialogWidth=50;dialogHeight=29;help=0;scroll=1;status=0;");
}

//搜索相关事件
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
//修改导致告警的区域
function editAlarmRegion(isInfoPage){
	if(!isInfoPage){
		setCurrentTable();
		var alarmIds = oData.getPropertys("id");
		if(alarmIds.length==0){
			alert("请选择一项");
			return false;
		}else if(alarmIds.length>1){
			alert("只能选择一项");
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
//主界面链接进来的刷新
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
//查询相关配置信息
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
			MMsg("未找到相关配置信息!");
		}
		else
		{
			reqId = oXMLHTTP.responseXML.selectSingleNode("/root/result/request_id").text;
			classId = oXMLHTTP.responseXML.selectSingleNode("/root/result/class_id").text;
			dataSetId = oXMLHTTP.responseXML.selectSingleNode("/root/result/dataset_id").text;
			//var url="/workshop/form/index.jsp?classId=CIM_MAINFRAME&requestId=" + reqId;
			//按V3版本修改 20121008
			var url="/workshop/form/index.jsp?classId="+ classId +"&dataSetId="+ dataSetId +"&requestId=" + reqId +"&hiddenToolBar=y&readOnly=y";
			doWindow_open(url);
		}
	}
}

var vSwitch = false; 	// 声音开关
/**
 * Add by @author linyi
 * @version 2010-08-30 1.0
 * 告警归并查询页面声音暂停
 */
function stopAlarmAudio(){
	if(document.getElementById("alarmsound")!=null && !vSwitch){
		var oDel = document.getElementById("alarmsound");
		oDel.parentNode.removeChild(oDel);
		vSwitch = true;
	}else
		EMsg("声音已暂停！");
}
/**
 * Add by @author linyi
 * @version 2010-08-30 1.0
 * 告警归并查询页面声音启动
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
			EMsg("声音已开启！");
		}
	}else{
		EMsg("声音已在设置中关闭！");
	}
}

function isUseTemplate(){
	//读取参数
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
	
	//把专家建议搬到录入框框去
		if(typeof(oExpert_advice)!='undefined'){
	  	oExpert_advice.innerText=expert_advice.innerText;
	  }

		var sendURL = "../../servlet/alarmMergeServlet?tag=45&tempType="+
		encodeURIComponent(aType+",处理告警模板");
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
			if(oRows[i].selectSingleNode("TMP_TYPE").text=='处理告警模板'){
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
 * 告警产生原因、采取措施输入模板
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
				if(proReasons[i].split('；').length>0){
					var seqIndex = proReasons[i].indexOf('、');
					tmpName = proReasons[i].split('；')[0].substring(seqIndex+1);
					tmpRemark =  proReasons[i].split('；')[1];
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
				if(meass[i].split('；').length>0){
					var seqIndex = meass[i].indexOf('、');
					tmpName = meass[i].split('；')[0].substring(seqIndex+1);
					tmpRemark =  meass[i].split('；')[1];
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
		nCell3.innerHTML ="<img style='cursor:hand' src='../../resource/image/ico/delete.gif' onclick=delTemRow('"+ctTable+"') alt='删除'/>";
}

function setReasonSolveRows(){
	var params = fetchReasonSolve(null,null);
	
	var sReason = "",sMeasure = "";
	if(params.proReasons!=null){
		for(var i=0,len = params.proReasons.length;i<len;i++){
			sReason+=(i+1)+("、"+params.proReasons[i].name+"；"+params.proReasons[i].detail+"\r\n");
		}
	}
	if(params.measures!=null){
		for(var i=0,len = params.measures.length;i<len;i++){
			sMeasure+=(i+1)+("、"+params.measures[i].name+"；"+params.measures[i].detail+"\r\n");
		}
  }
	if(sReason!='' ){
		proReason.value = sReason;
	}
	if(sMeasure!='' ){
		measures.value =  sMeasure;
	}
}

//告警故障诊断
function alarmDias(isInfoPage)
{
	if(!isInfoPage) {
		setCurrentTable();
		var alarmId = oData.getPropertys("id");
		if(alarmId.length == 0) {
			alert("请选择一项");
			return false;
		} else if(alarmId.length>1){
			alert("只能选择一项");
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


//判断是否需要验证必选 type:1=清除,2=删除 sysConfig=默认系统配置
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
//显示必填项的*号
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
//屏蔽告警
function shieldRule(isInfoPage){
	if(!isInfoPage){//右击点屏蔽
		setCurrentTable();
	  	var ne_flag = 2;
	  	var kpiId = oData.getPropertys("kpi_id");
		var neId = oData.getPropertys("ne_id");
		var configNeId = oData.getPropertys("config_ne_id");
		var busiModuleId = oData.getPropertys("busi_module_id");
		window.showModalDialog("/workshop/config/shieldRule.html",{ne_flag:ne_flag,itemId:neId,kpiId:kpiId,config_ne_id:configNeId,busi_module_id:busiModuleId},"dialogWidth=400px;dialogHeight=200px;help=0;scroll=1;resizable=0;status=0;");
	}else{
		//预留
	};
}