
// 1. 作业类型: 配置
function configTypecode()
{
    var params = new Array();
    params.push("jobInfo.html");
    resultArr = window.showModalDialog("jobType.html",params,"resizable=yes;dialogWidth=720px;dialogHeight=580px;help=0;scroll=0;status=0;");
    if(resultArr=="ok"){
		buildTree();
    }
    if(resultArr=="buildtree"){
      window.returnValue = "buildtree";
      buildTree();
    }
}

// 2. 作业类型: 载入
function buildTree()
{
 var value=JOB_TYPE_CODE.value;
  JOB_TYPE_CODE.outerHTML = '<IE:tree xmlUrl="../../servlet/maintancejobservlet?tag=12"  showFullPath="true" width="250" id="JOB_TYPE_CODE" treeHeight="200"  readonly="false"/>';
  JOB_TYPE_CODE.value = value;
}

// 3.1 周期：载入
function rebuildCycle()
{
	var oXml = getXmlFromHtmlData("JOB_CYCLE_DATA");
	var oRowSets = oXml.selectNodes("/root/rowSet");
	if(!oRowSets) return;
	var len = oRowSets.length;
	for(var i = 0; i < len ; i++){
		var text = oRowSets[i].selectSingleNode("TEXT").text;
		var value = oRowSets[i].selectSingleNode("VALUE").text;
		var objOption = new Option(text,value);
		JOB_CYCLE.add(objOption);
	}
}

// 3.2 周期：删除日期
function deleteList(obj)
{
  if(obj.length>0){
    if(obj.selectedIndex>=0){
      obj.remove(obj.selectedIndex);
    }
  }
}

// 3.3 周期：选择日期
function selectSycle()
{
	var params = new Array();
	params.push(window);
	var sycle = JOB_CYCLE.value;
	var height = 0;
	switch(sycle){
		case "1":  //日
			height = "270";
			break;
		case "2":  //周
			height = "280";
			break;
		case "3":  //月
			height = "280";
			break;
		case "4":  //季度
			height = "320";
			break;
		case "5":  //半年
			height = "320";
			break;
		case "6":  //年
			height = "300";
			break;
	}
	resultArr = window.showModalDialog("selectSycle.htm",params,"resizable=yes;dialogWidth=280px;dialogHeight="+height+"px;help=0;scroll=0;status=0;");
}

// 3.4 周期：选择时间
function selectExecDateTime(){
	var params = new Array();
	params.push(EXEC_DATETIME);
	var resultArr = window.showModalDialog("selectExecDateTime.htm",params,"resizable=yes;dialogWidth=280px;dialogHeight=280px;help=0;scroll=0;status=0;");
}

// 4. 当前时间： 服务器端
function getSysdate()
{
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST","../../servlet/jobiteminstanceservlet?tag=12&sysdate=sysdate",false);
	xmlhttp.send();
	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	dXML.load(xmlhttp.responseXML);
	var element = dXML.selectSingleNode("/root/rowSet");
	var sysdate = element.selectSingleNode("VALUE").text;
    return sysdate;
}

// 5. 作业信息: 验证
function checkData()
{
	if(MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/IF_DEL").text=="0BT")
	{
		MMsg("不能修改已删除的作业!");
		return false;
	}
	
    if(JOB_NAME.value=="")
    {
            EMsg("作业名称不能为空!");
            JOB_NAME.focus();
            return false;
    }
    
    if(REGION_ID.value=="")
    {
            EMsg("区域不能为空!");
            REGION_ID.focus();
            return false;
    }
    
    if(JOB_CYCLE.value=="")
    {
            EMsg("周期不能为空!");
            JOB_CYCLE.focus();
            return false;
    }
    
	if(EXEC_TIME.length==0 && JOB_CYCLE.value!="1")
    {
            EMsg("执行日期不能为空!");
            EXEC_TIME.focus();
            return false;
    }

	if(REPORTTO.value=="" && (typeof isJtitsmJob == "undefined" || isJtitsmJob == "0"))
    {
            EMsg("主送人不能为空!");
            return false;
    }
    
    if(ENABLED_DATE.value == ""){
    		EMsg("生效时间不能为空");
    		return false;
    }
    
    if(ENABLED_DATE.value > CANCEL_DATE.value && (CANCEL_DATE.value !=null && CANCEL_DATE.value !="")){
    		EMsg("生效时间不能比失效时间晚！");
    		return false;
    }
    
    /*if(JOB_GROUP.value=="") {
    	if(typeof isJtitsmJob != "undefined") {
    		if(isJtitsmJob == "1") {
    			EMsg("所属工作集不能为空！");
		    	return false;
    		}
    	}
    }*/
    
    var variable = /^[\d]{0,3}$/;  
    if(!variable.test(sla_time.value)){
    	EMsg("审核时限只能为0~3位数字！");
    	return false;
    }
    
    var copyto = "";
    for(var i=0;i<COPYTO.length;i++)
    {
      if(copyto==""){
        copyto = COPYTO.options[i].value;
      }else{
        copyto = copyto + ","+COPYTO.options[i].value;
      }
    }
    var exectime = "";
    for(var i=0;i<EXEC_TIME.length;i++){
        if(exectime==""){
          exectime = EXEC_TIME.options[i].value;
        }else{
          exectime = exectime + ","+EXEC_TIME.options[i].value;
        }
    }
    
    var execDateTime=EXEC_DATETIME.value;
    if(oper=="update"){	
    	if(JOB_CYCLE.value!=oJobCycle){
    		if(ifInstanceNoExec(params[1])){
    			EMsg("有未提交的作业项目，全部提交后才能修改！");
    			return false;
    		}
    	}else if(exectime!="" && exectime!=oExecTime){
    		if(ifInstanceNoExec(params[1])){
    			EMsg("有未提交的作业项目，全部提交后才能修改！");
    			return false;
    		}
    	}else if(execDateTime!=null && execDateTime!=oExecDateTime){
    		if(ifInstanceNoExec(params[1])){
    			EMsg("有未提交的作业项目，全部提交后才能修改！");
    			return false;
    		}
    	}else if((oWeekendOpr == "NO_EXEC" && WEEKEND_OPR.value == 'EXEC') || (oWeekendOpr == "EXEC" && WEEKEND_OPR.value == 'NO_EXEC') 
    	|| (oHolidayOpr == "NO_EXEC" && HOLIDAY_OPR.value == 'EXEC') || (oHolidayOpr == "EXEC" && HOLIDAY_OPR.value == 'NO_EXEC')) {
    		if(ifInstanceNoExec(params[1])) {
    			EMsg("有未提交的作业项目，全部提交后才能修改！");
    			return false;
    		}
    	}
    }
    
	var typecode =  JOB_TYPE_CODE.value;
    if(typecode=="-1") typecode = "";
    MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/JOB_NAME").text = JOB_NAME.value;
    MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/JOB_CYCLE").text = JOB_CYCLE.value;
    MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/EXEC_TIME").text = exectime;
    MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/JOB_GROUP").text = JOB_GROUP.value;
    MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/REPORTTO").text = REPORTTO.value;
    MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/COPYTO").text = copyto;
    MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/JOB_TYPE_CODE").text = typecode;
    MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/ENABLED_DATE").text = ENABLED_DATE.value;
    MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/CANCEL_DATE").text = CANCEL_DATE.value;
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/REGION_ID").text = REGION_ID.value;
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/EXEC_DATETIME").text = EXEC_DATETIME.value;
	
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/WEEKEND_OPR").text = WEEKEND_OPR.value; // (WEEKEND_OPR.checked == true)?"0BT":"0BF";
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/HOLIDAY_OPR").text = HOLIDAY_OPR.value; // (HOLIDAY_OPR.checked == true)?"0BT":"0BF";
	
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/IF_SEND_EVENT").text = (if_send_event.checked == true)?"0BT":"0BF";
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/SLA_TIME").text = sla_time.value;
	
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/IF_AUTO_PUTIN_AUDIT").text = (if_auto_putin_audit.checked == true)?"0BT":"0BF";
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/IF_AUTO_AUDIT").text = (if_auto_audit.checked == true)?"0BT":"0BF";
	
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/JOB_SN").text = JOB_SN.value;
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/JOB_CLASSIFY").text = JOB_CLASSIFY.value;
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/IF_SQL_CONFIG").text = IF_SQL_CONFIG.value;
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/HOST_IP").text = HOST_IP.value;
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/PORT").text = PORT.value;
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/USER_NAME").text = USER_NAME.value;
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/PASSWORD").text = PASSWORD.value;
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/DATABASE").text = DATABASE.value;
	MAINTANCE_JOB.XMLDocument.selectSingleNode("/Msg/SQL").text = SQL.value;
    return true;
}

function ifInstanceNoExec(JobId){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST","../../servlet/jobiteminstanceservlet?tag=22&jobid="+JobId,false);
	xmlhttp.send();
	var num=xmlhttp.responseText;
	if(num==0) 
		return false;
	else 
		return true;	
}
 var isRefAlarmCfg = false;
  //是否选中月末为执行时间
 function selectYearCycle(){
  	  EXEC_TIME.length=0;
	  if(JOB_CYCLE.value=="6")
	  {
	  	if(QMsg("是否选择每个月的月末为执行日期？") == MSG_YES)
	  	{
			var monthDays={1:31,2:28,3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31};
			for(var a in monthDays){
				addOptionForYear(a,monthDays[a]);
			}
		}
	  }
	  if(document.getElementById("tab3")!=null){
		  if(document.getElementById("tab3").display!='none'){
			 isRefAlarmCfg = true;
			 var oCycleId = JOB_CYCLE.value;
			 var cWindow = document.getElementById("if_item").contentWindow;
			 cWindow.topCycle = oCycleId
			 cWindow.document.getElementById("KPI_CYCLE").value = oCycleId;
			 if(oCycleId == "1"){
				cWindow.document.getElementById("dayCycle").style.display = '';
				cWindow.document.getElementById("otherCycle").style.display = 'none';
			}
			else{
				cWindow.document.getElementById("dayCycle").style.display = 'none';
				cWindow.document.getElementById("otherCycle").style.display = '';
				cWindow.document.getElementById("oIF_END_JOB_SUBMIT_KT").checked = true;
			}
		  }
	  }
  }
//添加月末为执行时间
  function addOptionForYear(i,date){
  	EXEC_TIME.length++;
	EXEC_TIME.options[i-1].text = (i>9?i:"0"+i)+ "月" + date + "日";
	EXEC_TIME.options[i-1].value = i+"-"+date;
  }
//是否显示自动审核、自动提交配置
function initAutoConfig()
{
	var json = eval('('+$getSysVar("IS_SHOW_JOB_AUTO_CONFIG")+')');
	if(json.IS_SHOW_AUTO_PUTIN_AUDIT =='0BT' || json.IS_SHOW_AUTO_AUDIT =='0BT'){
		document.all.autoConfig.style.display="block";
		if(json.IS_SHOW_AUTO_PUTIN_AUDIT =='0BT'){			
			document.all.auto_putin_audit.style.visibility="visible";
			document.all.auto_putin_audit_name.style.visibility="visible";
			document.all.auto_putin_audit_img.style.visibility="visible";
		}
		if(json.IS_SHOW_AUTO_AUDIT =='0BT'){
			document.all.auto_audit.style.visibility="visible";
			document.all.auto_audit_name.style.visibility="visible";
			document.all.auto_audit_img.style.visibility="visible";
		}
	}
}

// 添加作业集
function addGroup(){
	var resultArr = window.showModalDialog('jobGroupInfo.jsp',null,"resizable=yes;dialogWidth=600px;dialogHeight=560px;help=0;scroll=yes;status=0;");
	initGroupSelect()
}

function initGroupSelect() {
	rebuildSelect("../../servlet/maintancejobservlet?tag=36&job_cycle="+JOB_CYCLE.value,JOB_GROUP,false);
}

function loadJobGroup(jobId) {
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	xmlhttp.Open("POST","../../servlet/maintancejobservlet?tag=39&jobId="+jobId,false);
	xmlhttp.send();
	if(isSuccess(xmlhttp)) {
		dXML.load(xmlhttp.responseXML);
		if(dXML.selectSingleNode("root/Msg/MAINT_JOB_GROUP_ID")) {
			JOB_GROUP.value = dXML.selectSingleNode("root/Msg/MAINT_JOB_GROUP_ID").text;
		}
	}
}