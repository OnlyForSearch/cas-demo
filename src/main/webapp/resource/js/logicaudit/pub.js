var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

//====================logicdatagather.jsp  业务逻辑分析数据采集==============================================
function LogicDataGatherRefresh(){
   var sendXML='<?xml version="1.0" encoding="gb2312"?>'
	             +  '<root>'
                     +     '<search pagesize="10" page="1">'
                     +        '<param fieldName="a.FIELD_DESC_ID" oper="=" type="string">'+FIELD_DESC_ID+'</param>'
                     +     '</search>'
                     +  '</root>';
   document.all.LogicDataGatherData.sendXML=sendXML;
   document.all.LogicDataGatherData.xmlSrc="../../servlet/logicdatagatherservlet?tag=1";
}

function addLogicDataGather(flag){
	var neId = LogicDataGatherData.getPropertys("NE_ID");
    var params = new Array();
    params.push(LogicDataGatherData);
    params.push(flag);
    if(typeof(neId)=="object"){
   	 params.push("");	
  	}
  	else{
  		params.push(neId[0]);	
  	}
  
    resultArr = window.showModalDialog("logicdatagatherinfo.jsp",params,"resizable=yes;dialogWidth=778px;dialogHeight=620px;help=0;scroll=1;status=0;");
}

function modifyLogicDataGather(){
  var logicdatagatherid = LogicDataGatherData.getPropertys("LOGIC_DATA_GATHER_ID");
  var neId = LogicDataGatherData.getPropertys("NE_ID");
  if(logicdatagatherid.length>1) {MMsg("同时只能查看一条记录");return false}
  if(logicdatagatherid== "") {MMsg("请选择要查看的记录"); return false;}
  if(isExecute(logicdatagatherid))
  {
      var params = new Array();
      params.push("logicdatagatherid="+logicdatagatherid);
      params.push(LogicDataGatherData);	
      params.push(neId);	
      resultArr = window.showModalDialog("updatelogicdatagather.jsp?logicdatagatherid="+logicdatagatherid,params,"resizable=yes;dialogWidth=778px;dialogHeight=620px;help=0;scroll=1;status=0;");
  }
  else
  {
    EMsg("无法修改该信息!");
  }
}

function deleteLogicDataGather(){
  var httpUrl = "../../servlet/logicdatagatherservlet?"
  var arrid = LogicDataGatherData.getPropertys("LOGIC_DATA_GATHER_ID");
  var ok = true;
  if(arrid== "") {MMsg("请选择要删除的记录"); return false;}
  if(QMsg("是否删除该信息?")==MSG_YES)
  {
  	//for(var i=0;i<arrid.length;i++){
          var logicdatagatherid = arrid.join(",");
  	  	  var params = new Array();
          params.push("tag="+5);
          params.push("logicdatagatherid="+logicdatagatherid);
          xmlhttp.open("POST",httpUrl+params.join("&"),false);
          xmlhttp.send();
          ok = ok && isSuccess(xmlhttp);
      //}
      if(ok){
        MMsg("删除成功!");
      }
      LogicDataGatherData.doRefresh(false);
  }
}

function showTaFieldDescForDG(){
  	var FIELD_DESC_ID = LogicDataGatherData.getPropertys("FIELD_DESC_ID");
       var logicdatagatherid = LogicDataGatherData.getPropertys("LOGIC_DATA_GATHER_ID");
       if(logicdatagatherid== "" ) {alert("请选中要查看的记录"); return false;}
       if(FIELD_DESC_ID!="" && FIELD_DESC_ID!=null){
         modifyTaFieldDesc(FIELD_DESC_ID,"LOGIC_DATA_GATHER","LOGIC_DATA_GATHER_ID",logicdatagatherid,LogicDataGatherData);
       }
       if(FIELD_DESC_ID==""){
         addTaFieldDesc("LOGIC_DATA_GATHER","LOGIC_DATA_GATHER_ID",logicdatagatherid,LogicDataGatherData);
       }
}
//===========================tafielddesc.jsp  字段描述表=======================================

function loadTaFieldDesc(logicdatagatherid){
   var FIELD_DESC_ID = logicdatagatherid;

   var sendXML='<?xml version="1.0" encoding="gb2312"?>'
	             +  '<root>'
                     +     '<search pagesize="10" page="1">'
                     +        '<param fieldName="a.FIELD_DESC_ID" oper="=" type="string">'+FIELD_DESC_ID+'</param>'
                     +     '</search>'
                     +  '</root>';
   document.all.TaFieldDescData.sendXML=sendXML;
   document.all.TaFieldDescData.xmlSrc="../../servlet/tafielddescservlet?tag=1";
}

function addTaFieldDesc(table,tableid,tableidvalue,obj,objWin,neId,regionId,gatherTitle,gatherId,drId){
    var httpUrl = "../../servlet/tafielddescservlet?"
    var params = new Array();
    params.push("table="+table);
    params.push("tableid="+tableid);
    params.push("tableidvalue="+tableidvalue);
    params.push(obj);
    params.push(neId);
    params.push(objWin);
    params.push(regionId);
    params.push(gatherTitle);
    params.push(gatherId);
    params.push(drId);
    resultArr = window.showModelessDialog("tafielddescinfo.jsp",params,"resizable=no;dialogWidth=420px;dialogHeight=465px;help=0;scroll=1;status=0;");
    //document.all.TaFieldDescData.doRefresh(false);
}

function modifyTaFieldDesc(id,table,tableid,tableidvalue,obj,objWin,neId,regionId,gatherTitle,gatherId){
  var httpUrl = "../../servlet/tafielddescservlet?"
  var tafielddescid = id;
  if(tafielddescid== "") {alert("请选择要查看的记录"); return false;}
  if(isExecute(tafielddescid))
  {
      var params = new Array();
      params.push("tafielddescid="+tafielddescid);
      params.push("table="+table);
      params.push("tableid="+tableid);
      params.push("tableidvalue="+tableidvalue);
      params.push(obj);
      params.push(neId);
      params.push(objWin);
      params.push(regionId);
      params.push(gatherTitle);
      params.push(gatherId);
      resultArr = window.showModelessDialog("updatetafielddesc.jsp",params,"resizable=no;dialogWidth=420px;dialogHeight=465px;help=0;scroll=1;status=0;");
  }
  else
  {
    EMsg("无法修改该信息!");
  }
}

function deleteTaFieldDesc(){
  var httpUrl = "../../servlet/tafielddescservlet?"
  var tafielddescid = TaFieldDescData.getPropertys("id");

  if(tafielddescid== "") {alert("请选择要删除的记录"); return false;}
  if(isExecute(tafielddescid))
  {
    if(QMsg("是否删除该信息?")==MSG_YES)
    {
      var params = new Array();
      params.push("tag="+5);
      params.push("tafielddescid="+tafielddescid);
      xmlhttp.open("POST",httpUrl+params.join("&"),false);
      xmlhttp.send();
      if(isSuccess(xmlhttp))
      {
        MMsg("删除成功!");
        document.all.TaFieldDescData.doRefresh(false);
      }
    }
  }
}

function viewAllTaFieldDesc(){
   var sendXML='<?xml version="1.0" encoding="gb2312"?>'
	             +  '<root>'
                     +     '<search pagesize="10" page="1">'
                     +     '</search>'
                     +  '</root>';
   document.all.TaFieldDescData.sendXML=sendXML;
   document.all.TaFieldDescData.xmlSrc="../../servlet/tafielddescservlet?tag=1";
}
//=========================logicgathertask.jsp 业务逻辑分析数据采集任务表===================================
function addLogicGatherTask(){
    var httpUrl = "../../servlet/logicgathertaskservlet?"
    var params = new Array();
    params.push(LogicGatherTaskData);
    resultArr = window.showModalDialog("logicgathertaskinfo.jsp",params,"resizable=yes;dialogWidth=600px;dialogHeight=365px;help=0;scroll=0;status=0;");
}

function modifyLogicGatherTask(){
  var httpUrl = "../../servlet/logicgathertaskservlet?";
  var taskid = LogicGatherTaskData.getPropertys("id");
  if(taskid.length>1) {MMsg("同时只能查看一条记录");return false}
  if(taskid== "") {MMsg("请选择要查看的记录"); return false;}
  if(isExecute(taskid)){
      var params = new Array();
      params.push(taskid);
      params.push(LogicGatherTaskData);
      resultArr = window.showModalDialog("updatelogicgathertask.jsp?taskid="+taskid,params,"resizable=yes;dialogWidth=600px;dialogHeight=365px;help=0;scroll=0;status=0;");
  }else{
    EMsg("无法修改该信息!");
  }
}

function deleteLogicGatherTask(){
  var httpUrl = "../../servlet/logicgathertaskservlet?"
  var arrid = LogicGatherTaskData.getPropertys("id");
  var ok = true;
  if(arrid== "") {MMsg("请选择要删除的记录"); return false;}
  if(QMsg("是否删除该信息?")==MSG_YES)
  {
  	for(var i=0;i<arrid.length;i++){
          var taskid = arrid[i];
  	  var params = new Array();
          params.push("tag="+5);
          params.push("taskid="+taskid);
          xmlhttp.open("POST",httpUrl+params.join("&"),false);
          xmlhttp.send();
          ok = ok + isSuccess(xmlhttp);
          if(!ok)
          {
            MMsg("删除失败!");
          }
      }
      if(ok){
        MMsg("删除成功!");
      }
      LogicGatherTaskData.doRefresh(false);
  }
}
//===============================logicanalyzerule.jsp  业务逻辑分析规则=====================================================

function loadLogicAnalyzrRuleDate(){
   var logicdatagatherid = LogicDataGatherData.getPropertys("LOGIC_DATA_GATHER_ID");
   var sendXML='<?xml version="1.0" encoding="gb2312"?>'
	             +  '<root>'
                     +     '<search pagesize="10" page="1">'
                     +        '<param fieldName="a.LOGIC_DATA_GATHER_ID" oper="=" type="string">'+logicdatagatherid+'</param>'
                     +     '</search>'
                     +  '</root>';
   document.all.LogicAnalyzeRuleData.sendXML=sendXML;
   document.all.LogicAnalyzeRuleData.xmlSrc="../../servlet/logicanalyzeruleservlet?tag=1";
}

function addLogicAnalyzeRule(){
    var httpUrl = "logicannalyzeruleinfo.jsp"
    var params = new Array();
    try{
      if(LogicDataGatherData!=null){
     	 var logicdatagatherid = LogicDataGatherData.getPropertys("LOGIC_DATA_GATHER_ID");
     	 var neid = LogicDataGatherData.getPropertys("NE_ID");
     	 var nename = LogicDataGatherData.getPropertys("NE_NAME");
    	  params.push(neid);
    	  params.push(nename);
   	  params.push(logicdatagatherid);
          httpUrl = httpUrl + "?neid="+neid;
      }
    }catch(e){
       params = new Array();
    }
    resultArr = window.showModalDialog(httpUrl,params,"resizable=no;dialogWidth=700px;dialogHeight=570px;help=0;scroll=0;status=0;");
    document.all.LogicAnalyzeRuleData.doRefresh(false);
}

function modifyLogicAnalyzeRule(){
  var httpUrl = "updatelogicannalyzerule.jsp"
  var logicanalyzeruleid = LogicAnalyzeRuleData.getPropertys("KEY");
  if(logicanalyzeruleid== "") {alert("请选择要查看的记录"); return false;}
  if(isExecute(logicanalyzeruleid))
  {
    try{
      if(LogicDataGatherData!=null){
          httpUrl = httpUrl + "?neid="+neid;
      }
    }catch(e){
    }
      resultArr = window.showModalDialog(httpUrl,logicanalyzeruleid,"resizable=no;dialogWidth=700px;dialogHeight=570px;help=0;scroll=0;status=0;");
      document.all.LogicAnalyzeRuleData.doRefresh(false);
  }
  else
  {
    EMsg("无法修改该信息!");
  }
}

function deleteLogicAnalyzeRule(){
  var httpUrl = "../../servlet/logicanalyzeruleservlet?"
  var logicanalyzeruleid = LogicAnalyzeRuleData.getPropertys("KEY");

  if(logicanalyzeruleid== "") {alert("请选择要删除的记录"); return false;}
  if(isExecute(logicanalyzeruleid))
  {
    if(QMsg("是否删除该信息?")==MSG_YES)
    {
      var params = new Array();
      params.push("tag="+5);
      params.push("logicanalyzeruleid="+logicanalyzeruleid);
      xmlhttp.open("POST",httpUrl+params.join("&"),false);
      xmlhttp.send();
      if(isSuccess(xmlhttp))
      {
        MMsg("删除成功!");
        document.all.LogicAnalyzeRuleData.doRefresh(false);
      }
    }
  }
}

//function cancel(){
//  var httpUrl = "../../servlet/logicanalyzeruleservlet?"
//  var logicanalyzeruleid = LogicAnalyzeRuleData.getPropertys("KEY");
//
//  if(logicanalyzeruleid== "") {alert("请选择要删除的记录"); return false;}
//  if(isExecute(logicanalyzeruleid))
//  {
//    if(QMsg("是否作废该信息?")==MSG_YES)
//    {
//      var params = new Array();
//      params.push("tag="+7);
//      params.push("logicanalyzeruleid="+logicanalyzeruleid);
//      xmlhttp.open("POST",httpUrl+params.join("&"),false);
//      xmlhttp.send();
//      if(isSuccess(xmlhttp))
//      {
//        MMsg("操作成功!");
//        document.all.LogicAnalyzeRuleData.doRefresh(false);
//      }
//    }
//  }
//}

//function showLogicAnalyzeTask(){
//	var logicdatagatherid = LogicDataGatherData.getPropertys("LOGIC_DATA_GATHER_ID");
//	if(logicdatagatherid== "" ) {alert("请选择要查看的记录"); return false;}
//	if(isExecute(logicdatagatherid))
//	{
//	        var params = new Array();
//	        xmlhttp.open("POST","logicanalyzetask.jsp",false);
//	        xmlhttp.send();
//    		 try{
//   		    document.all.logicanalyzerulediv.style.display="none";
// 		 }catch(e){}
//	        document.getElementById("showLogicAnalyzeTask").innerHTML = "<div align='center' id='titleidv'  class='form_title'><BR><BR>业务逻辑分析任务</div>"+xmlhttp.responseText;
//
//                showDiv("showLogicAnalyzeTask");
//                loadLogicAnalyzeTaskData();
//	}
//}

function showTaFieldDescForRule(){
  	var FIELD_DESC_ID = LogicAnalyzeRuleData.getPropertys("FIELD_DESC_ID");
       var logicdatagatherid = LogicAnalyzeRuleData.getPropertys("KEY");
       if(logicdatagatherid== "" ) {alert("请选中要查看的记录"); return false;}

       if(FIELD_DESC_ID!="" && FIELD_DESC_ID!=null){
         modifyTaFieldDesc(FIELD_DESC_ID,"LOGIC_ANALYZE_RULE","LOGIC_ANALYZE_RULE_ID",logicdatagatherid,LogicAnalyzeRuleData);
       }
       if(FIELD_DESC_ID==""){
         addTaFieldDesc("LOGIC_ANALYZE_RULE","LOGIC_ANALYZE_RULE_ID",logicdatagatherid,LogicAnalyzeRuleData);
       }
       //LogicAnalyzeRuleData.doRefresh(false);
}

function loadLogicAnalyzeTaskData(){
   var LOGIC_ANALYZE_RULE_ID = LogicAnalyzeRuleData.getPropertys("KEY");
   var sendXML='<?xml version="1.0" encoding="gb2312"?>'
	             +  '<root>'
                     +     '<search pagesize="10" page="1">'
                     +        '<param fieldName="a.LOGIC_ANALYZE_RULE_ID" oper="=" type="string">'+LOGIC_ANALYZE_RULE_ID+'</param>'
                     +     '</search>'
                     +  '</root>';
   document.all.LogicAnalyzeTaskData.sendXML=sendXML;
   document.all.LogicAnalyzeTaskData.xmlSrc="../../servlet/logicanalyzetaskservlet?tag=1";
}

function LogicAnalyzeRuleDataRefresh(){
	 LogicAnalyzeRuleData.doRefresh(false);
}

//==============================================================================================
function checkdate(){
		if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=8){
			alert("只能输入数字");
                        var value1 = event.srcElement.value;
                        event.srcElement.value = value1.substring(0,value1.length-1);
			return false;
		}
		return true;
}
function checkdate1(min,max){
		if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=8){
			alert("只能输入数字");
                        var value1 = event.srcElement.value;
                        event.srcElement.value = value1.substring(0,value1.length-1);
			return false;
		}else{
          	      if((parseInt(event.srcElement.value)<min || parseInt(event.srcElement.value)>max) && event.keyCode!=8){
               		alert("输入的数字只能是"+min+"到"+max+"范围内！");
                        event.srcElement.value = "";
         	      }
		}
		return true;
}
function checkdate13(min,max)
{
	var regu = "^([0-9]{1,10})?$";
	var re = new RegExp(regu);
	if (!re.test(event.srcElement.value)){
		alert("只能输入数字");
		event.srcElement.value = "";
		return false;
	}else{
		if(parseInt(event.srcElement.value)<min || parseInt(event.srcElement.value)>max){
		  alert("输入的数字只能是"+min+"到"+max+"范围内！");		
          event.srcElement.value = "";
        }
	}		
	return true;
}
function onChangeto1(){	
	if(event.srcElement.id=="date_FAILURE_START_DATETIME"||event.srcElement.id=="date_FAILURE_END_DATETIME"){
		getStopTime();
		return true;
	}
	return false;
}
function onChangeto2(nid){
	//if(nid=="FAILURE_START_DATETIME"||nid=="FAILURE_END_DATETIME"){
	if(nid.toString().indexOf("FAILURE_START_DATETIME") != -1 || nid.toString().indexOf("FAILURE_END_DATETIME") != -1){
		getStopTime();
	}
}
function timepicker(name,dateObj,showUID){
    this.name = name;
    this.dateObj = dateObj;
    this.hh = "";
    this.mm = "";
    this.ss = "";
    this.showUID = showUID;
    if(dateObj!=""){
  	  this.outputstr = '<table width="267" height="16"  border="0" cellpadding="0" cellspacing="0">'+
		  '<tr>'+
		    '<td height="16" nowrap>'+
                    '<IE:CalendarIpt class=DPFrame id="date_'+this.name+'" style="width:150" value="" sHiddenObject="STATE" onblur="return onChangeto1();"/>'+
                    '&nbsp;<input style="border: 1px solid #999999; " maxlength="2" onBlur=onChangeto2("'+this.name+'") onKeyUp="return checkdate13(0,23);"  id="h_'+this.name+'" type="text" size="2">&nbsp;时&nbsp;'+
 		    '<input style="border: 1px solid #999999; " maxlength="2" onBlur=onChangeto2("'+this.name+'") onKeyUp="return checkdate13(0,59);" name="textfield2" id="m_'+this.name+'"  type="text" size="2">&nbsp;分&nbsp;'+
 		    '<input style="border: 1px solid #999999; " maxlength="2" onKeyUp="return checkdate13(0,59);" name="textfield3" id="s_'+this.name+'"  type="text" size="2">&nbsp;秒&nbsp;'+
 		    '<img src="../../resource/image/line_schema.gif" style="width:10" title="清空时间" class="imgButton" onClick=clearDate("'+this.name+'")></td>'+
 		 '</tr>'+
	   '</table>';
    }
    if(showUID=="" || showUID==null){
      document.write(this.outputstr);
    }
    this.ini = function(){
    	document.getElementById(showUID).innerHTML = this.outputstr;
    }

    this.getDateTime = function(){
          var returnstr = "";
	  this.hh = document.getElementById("h_"+this.name).value==""?"00":document.getElementById("h_"+this.name).value;
	  this.mm = document.getElementById("m_"+this.name).value==""?"00":document.getElementById("m_"+this.name).value;
	  this.ss = document.getElementById("s_"+this.name).value==""?"00":document.getElementById("s_"+this.name).value;

     	 if(this.dateObj==true){
    	    returnstr = document.getElementById("date_"+this.name).GetDate();
                if(returnstr!=""){
			returnstr = returnstr + " " + this.hh;
			returnstr = returnstr + ":" + this.mm;
			returnstr = returnstr + ":" + this.ss;
                }
   	   }else{
		returnstr = returnstr + " " + this.hh;
		returnstr = returnstr + ":" + this.mm;
		returnstr = returnstr + ":" + this.ss;
    	  }
          return returnstr;
    }
    this.checkDate=function(){
      if(this.getDateTime()=="") return "";
          var returnstr = "";
          if(this.hh<0 || this.hh>23 ){
            alert("小时必须在0到23之间");
            returnstr = "false";
          }
          if( this.mm<0 || this.mm>59){
            alert("分钟必须在0到59之间");
            returnstr = "false";
          }
          if(this.ss<0 || this.ss>59){
            alert("秒钟必须在0到59之间");
            returnstr = "false";
          }
          return returnstr;
    }
	this.setShowDate= function(ifshowdate){
		this.dateObj = ifshowdate;
		if(ifshowdate){
			document.getElementById("date_"+this.name).style.display = "";
		}else{
			document.getElementById("date_"+this.name).style.display = "none";
		}
	}

	this.setDate = function(date){
		document.getElementById("date_"+this.name).value = date;
	}

	this.setTime = function(time){
		var arr = time.split(":");
                if(time==""){
                	arr = new Array(3);
                        arr[0] = "";
                        arr[1] = "";
                        arr[2] = "";
                }
		document.getElementById("h_"+this.name).value = arr[0];
		document.getElementById("m_"+this.name).value = arr[1];
		document.getElementById("s_"+this.name).value = arr[2];
	}
        this.setDateTime = function(datetime){
          var arr = datetime.split(" ");
          if(datetime==""){
            arr = new Array(2);
            arr[0]="";
            arr[1]="";
          }
          this.setDate(arr[0]);
          this.setTime(arr[1]);
        }
        this.setEnable = function(){
			document.getElementById("date_"+this.name).disabled="none";
			document.getElementById("h_"+this.name).disabled="none";
			document.getElementById("m_"+this.name).disabled="none";
			document.getElementById("s_"+this.name).disabled="none";
        }
        this.isNumber = function(){
        	if(!isNumber(document.getElementById("h_"+this.name).value)){
        		alert("您输入的时间不对！");
        		document.getElementById("h_"+this.name).focus();
        		document.getElementById("h_"+this.name).select();
        		return false;
        	}
        	if(!isNumber(document.getElementById("m_"+this.name).value)){
        		alert("您输入的时间不对！");
        		document.getElementById("m_"+this.name).focus();
        		document.getElementById("m_"+this.name).select();
        		return false;
        	}
        	if(!isNumber(document.getElementById("s_"+this.name).value)){
        		alert("您输入的时间不对！");
        		document.getElementById("s_"+this.name).focus();
        		document.getElementById("s_"+this.name).select();
        		return false;
        	}
        	return true;
        }
}

function changeTaskType(){
	var tasktype = document.getElementById("TASK_TYPE");
	var tasktypeid = tasktype.options[tasktype.selectedIndex].value;
	var td_interval=document.getElementById("TD_TASK_INTERVAL");
	var td_executedate=document.getElementById("TR_NEXT_TASK_DATE");
	var val = TASK_INTERVAL.value;

	switch(tasktypeid){
		case "1": //按时
			td_interval.innerHTML = '<input value="'+val+'" onKeyUp="return checkdate();"  style="border: 1px solid #999999;width:165px " id="TASK_INTERVAL" type="text" >&nbsp;秒'
			                        +'<font width="26" class="required" style="margin-left:7px">*</font>';
			break;
		case "2": //按天
			td_interval.innerHTML = '<input value="'+val+'" onKeyUp="return checkdate();"  style="border: 1px solid #999999;width:165px " id="TASK_INTERVAL" type="text" >&nbsp;天'
			                        +'<font width="26" class="required" style="margin-left:7px">*</font>';
			break;
		case "3": //按月
			td_interval.innerHTML = '<input value="'+val+'" onKeyUp="return checkdate();"  style="border: 1px solid #999999;width:165px " id="TASK_INTERVAL" type="text">&nbsp;月'
			                        +'<font width="26" class="required" style="margin-left:7px">*</font>';
			break;
	}
}

function hiddenDiv(divid){
  document.getElementById(divid).style.display = "none";
}
function showDiv(divid){
  document.getElementById(divid).style.display = "";
  document.getElementById(divid).focus();
  eval("window.location.href='#"+divid+"'");
}
function hiddenAllDiv(){
  document.getElementById("showLogicDataGatherTask").style.display = "none";
  document.getElementById("showLogicAnalyzeRule").style.display = "none";
}
function writePLSQL(id){
  var obj = document.getElementById(id);
  window.showModalDialog("writeplsql.jsp",obj,"resizable=no;dialogWidth=420px;dialogHeight=465px;help=0;scroll=1;status=0;");
}

function LogicAnalyzeRuleSearch(){
    var params = new Array();
    params.push("/workshop/logicaudit/logicAnalyzeRule.xml");
    params.push(document.getElementById("LogicAnalyzeRuleData"));
    params.push("../../servlet/logicanalyzeruleservlet?tag=1");
    window.showModalDialog("../companyequip/search.jsp",params,"resizable=yes;dialogWidth=620px;dialogHeight=180px;help=0;scroll=1;status=0;");
}

function doBeforeRightClick(obj,MenuName)
{
    obj.rightMenu=MenuName;
}
//判断数据是否是数字
function isNumber(s)
{
	var regu = "^([0-9]{1,10})?$"; //只能输入有0-10位的正实数
	var re = new RegExp(regu);
	if (re.test(s)){
		return true;
	}
	else{
		return false;
	}
}

/**
 * 清除日期
 */
function clearDate(obj){
	alert(obj);
	eval("date_"+obj).value = "";
	eval("h_"+obj).value = "";
	eval("m_"+obj).value = "";
	eval("s_"+obj).value = "";
}

/*
 * 选择入库任务类型
 * */
function openIndbTask(){
	var result = window.showModalDialog("/workshop/queryTemplate/mainFrame.html?result=900014210",null,"resizable=no;dialogWidth=400px;dialogHeight=370px;help=0;scroll=0;status=0;");
	if(result && result.task_id){
		document.getElementById("C_INDB_ID").value = result.task_id;
		document.getElementById("C_INDB_TYPE").value = result.task_type;
		document.getElementById("C_INDB_NAME").value = result.task_name;
		doChange();
	}
} 

function clearIndbTask(){
	document.getElementById("C_INDB_ID").value = "";
	document.getElementById("C_INDB_TYPE").value = "";
	document.getElementById("C_INDB_NAME").value = "";
	doChange();
}



function chooseTask(grid){
	var result = {};
	var row = grid.getSelectionModel().getSelected();
	if(row){
		result.task_id = row.get("TASK_ID");
		result.task_name = row.get("TASK_NAME");
		result.task_type = grid.TASK_TYPE;
	    window.returnValue = result;
	    window.close();
	}
}


function doChange(){
	//入库任务类型为ifs，且任务类型为触发任务，显示触发条件SQL，否则隐藏
	if((C_INDB_TYPE.value == 'ifs') && C_TRIGGER_TYPE.value == 2){
		TRIGGER_SQL_ROW.style.display = "";
	}else{
		TRIGGER_SQL_ROW.style.display = "none";
	}
	
	//入库任务类型不是ifs，只能选择定时稽核任务
	if(C_INDB_TYPE.value != 'ifs'){
		for (var i = 0 , option; option=C_TRIGGER_TYPE.options[i]; i++){
	        if(option.value==1){
	            option.selected=true;
	            C_TRIGGER_TYPE.readOnly = true;
	            break;
	        }
	    }
	}else{
	     C_TRIGGER_TYPE.readOnly = false;
	}
	
	//定时任务，显示任务标签页,触发任务，隐藏任务标签页
	tab3.display = C_TRIGGER_TYPE.value == 1 ? "" : "none";
}


