
// 1. 日期：第二天
function getNexedate(date)
{
	var sysdate;
	if(date=="" || date ==null){
		sysdate = "sysdate-(-1)";
	}else{
		sysdate = date;
	}
	xmlhttp.Open("POST","../../servlet/jobiteminstanceservlet?tag=12&sysdate="+sysdate,false);
	xmlhttp.send();
	var dXML = xmlhttp.responseXML;
	var element = dXML.selectSingleNode("/root/rowSet");
	var sysdate = element.selectSingleNode("VALUE").text;
    return sysdate;
}

// 2. 自动操作：变更
function changeifauto()
{	
	if(NON_AUTO.checked)
	{
	    document.getElementById("tab2").display="none";
	    document.getElementById("tab3").display="none";
	    document.getElementById("tab4").display="none";
	    oMPC.selectedIndex = 0;
	    document.getElementById("next_exectime_tr1").style.display="none";
	    document.getElementById("next_exectime_tr2").style.display="none";
	}else
	{
	    document.getElementById("next_exectime_tr1").style.display="";
	    document.getElementById("next_exectime_tr2").style.display="";
	    
	    if(AUTO_QUERY.checked)
	    {
	        document.getElementById("tab2").display="";
	        document.getElementById("tab3").display="";
	        document.getElementById("tab4").display="none";
	        IF_APPSYS.disabled = false;
	    }else{
	        if(AUTO_EXEC.checked)
	        {
	            document.getElementById("tab2").display="";
	            document.getElementById("tab3").display="none";
	            document.getElementById("tab4").display="";
	            IF_APPSYS.disabled = true;
	        }else{
	            document.getElementById("tab2").display="";
	            document.getElementById("tab3").display="";
	            document.getElementById("tab4").display="";
	            IF_APPSYS.disabled = true;
	        }
	        if(!typeof(oNeType)=="undefined"){
	        	neTypeId=oNeType.getAttribute("CI_CLASS_ID");
	        }
	        if(neTypeId!=""){
	        	rebuildCtrlMsg();
	        	}
	        else{
	        	neTypeId=NE_ID_INPUT.getAttribute("neTypeId");
	        	rebuildCtrlMsg();
	        }
	        // 如果是“自动执行”时，将“网元范围”定为“应用平台”。
	        if(IF_APPSYS.checked) NON_APPSYS.click();
	    }
	}
}

// 3. 催办：变更
function changePasten()
{
	var HASTEN_TD = document.getElementById('HASTEN_TD');
	if(IF_HASTEN.checked)
	{
		HASTEN_TD.disabled = false;
		HASTEN_TIME.disabled = false;
	}else{
		HASTEN_TD.disabled = true;
		HASTEN_TIME.disabled = true;
	}
}

// 4. 催办：输入数字
function checkIsInt(obj)
{
	try
	{
		if(obj.value=="") return;
		
		var value = parseInt(obj.value);
		if(value == null)
		{
			EMsg("只能输入数值!");
			obj.focus();
		}
		if(value<0) value = value * -1;
		obj.value = value;
		obj.value = obj.value.replace("NaN","");
	}catch(e){
			EMsg("只能输入数值!");
			obj.focus();
	}
}

//*****************************************************************************
//*********************** 网元范围 **********************************
//*****************************************************************************/
// 1. 网元：过滤(业务系统)
function businessTree(oNeTypeValue)
{
	try
	{
		var tree = event.xmlDom;
		var menuRoot = tree.selectSingleNode("/root/Menu");
		
		//(1). 取网元节点
		var oNode = tree.selectSingleNode("//MenuItem[@moduleID=4]");//选择业务系统
		menuRoot.appendChild(oNode);
		menuRoot.removeChild(menuRoot.childNodes[0]);
		
		//(2). 删除实际节点
		var oNodeList = tree.selectNodes("//MenuItem[@tag=6 and ../@tag=6]");//删除实际子项
		oNodeList.removeAll();
	}catch(e){}
}

// 2. 网元：选择/复位
function rebuiltNeid(isClearData, oNeTypeValue)
{
  if(IF_APPSYS.checked==false)
  {
	//neTypeId = NE_ID_INPUT.getAttribute("neTypeId");
	//NE_ID.style.display="none";
	//NE_NAME.style.display="";
	//neIdBt.style.display="";
	
	nonAppSysBlock.disabled = false;
	NE_NAME.disabled = false;
	neIdBt.disabled = false;
	
	appSysBlock.disabled = true;
	NE_ID.readOnly = true;
	MODULE_CODE_FLAG.disabled = true;
	MODULE_CODE_TEXT.disabled = true;
	MODULE_CODE_IMG.disabled = true;
	MODULE_CODE_SELECT.disabled = true;
	document.bcordt_form.BcOrDt[0].disabled = true;
	document.bcordt_form.BcOrDt[1].disabled = true;
	BUSI_CLASS_FLAG.disabled = true;
	BUSI_CLASS_TEXT.disabled = true;
	BUSI_CLASS_IMG.disabled = true;
	BUSI_CLASS_SELECT.disabled = true;
	DATA_TYPE_FLAG.disabled = true;
	DATA_TYPE_TEXT.disabled = true;
	DATA_TYPE_IMG.disabled = true;
	DATA_TYPE_SELECT.disabled = true;
	document.datasource_form.datasource[0].disabled = true;
	document.datasource_form.datasource[1].disabled = true;
	REGION_ID_FLAG.disabled = true;
	REGION_ID_TEXT.disabled = true;
	REGION_ID_IMG.disabled = true;
	REGION_ID_SELECT.disabled = true;
	REGION_ID_GROUP_FLAG.disabled = true;
	REGION_ID_GROUP.disabled = true;
	REGION_ID_GROUP_BNT.disabled = true;
	REGION_ID_GROUP_IMG.disabled = true;
	REGION_ID_GROUP_SELECT.disabled = true;
	DR_ID_FLAG.disabled=true;
	DR_ID.disabled=true;
	if(isClearData)
	{
	    setFlowDomainBlank();//复位“网元范围”和“自动判断”
	    rebuildCtrlMsg();
	}else
	{
		if(oNeTypeValue && oNeTypeValue!="" && neTypeId!="" && oNeTypeValue!=neTypeId)
		{
		    NE_ID_INPUT.value = "";
		    NE_NAME.value = "";
		    //neTypeId = "";
		    rebuildCtrlMsg();
		}
	}
  }else{
	//neTypeId = NE_ID.getAttribute("neTypeId");
	//NE_NAME.style.display="none";
	//neIdBt.style.display="none";
	//NE_ID.style.display="";
	
	if(isClearData)
	{
	    NE_NAME.value     = "";
	    NE_ID_INPUT.value = "";
	    NE_ID.value       = "";
	    NE_ID.text        = "";
	    //neTypeId          = "";
	    rebuildCtrlMsg();
	}else
	{
		if(oNeTypeValue && oNeTypeValue!="" && neTypeId!="" && oNeTypeValue!=neTypeId)
		{
		    NE_ID.value = "";
		    NE_ID.text = "";
		    //neTypeId = "";
		    rebuildCtrlMsg();
		}
	}
	nonAppSysBlock.disabled = true;
	NE_NAME.disabled = true;
	neIdBt.disabled = true;
	
	appSysBlock.disabled = false;
	NE_ID.readOnly = false;
	MODULE_CODE_FLAG.disabled = false;
	MODULE_CODE_TEXT.disabled = false;
	MODULE_CODE_IMG.disabled = false;
	MODULE_CODE_SELECT.disabled = false;
	document.bcordt_form.BcOrDt[0].disabled = false;
	document.bcordt_form.BcOrDt[1].disabled = false;
	BUSI_CLASS_FLAG.disabled = false;
	BUSI_CLASS_TEXT.disabled = false;
	BUSI_CLASS_IMG.disabled = false;
	BUSI_CLASS_SELECT.disabled = false;
	DATA_TYPE_FLAG.disabled = false;
	DATA_TYPE_TEXT.disabled = false;
	DATA_TYPE_IMG.disabled = false;
	DATA_TYPE_SELECT.disabled = false;
	document.datasource_form.datasource[0].disabled = false;
	document.datasource_form.datasource[1].disabled = false;
	REGION_ID_FLAG.disabled = false;
	REGION_ID_TEXT.disabled = false;
	REGION_ID_IMG.disabled = false;
	REGION_ID_SELECT.disabled = false;
	REGION_ID_GROUP_FLAG.disabled = false;
	REGION_ID_GROUP.disabled = false;
	REGION_ID_GROUP_BNT.disabled = false;
	REGION_ID_GROUP_IMG.disabled = false;
	REGION_ID_GROUP_SELECT.disabled = false;
	DR_ID_FLAG.disabled=false;
	DR_ID.disabled=false;
	
  }
}

function selectNeId(){
	var oNeid=NE_ID_INPUT.value;
	oneIds=oNeid;
	var oNeName=NE_NAME.value;
	var params = new Array();
	var neidobj = new NeIdObj();
	neidobj.value = NE_ID_INPUT.value;
	neidobj.text = NE_NAME.value;
	params.push(neidobj);
    var returnObj = window.showModalDialog("../maintjobplan/NeIdSelect.html",params,"resizable=yes;dialogWidth=400px;dialogHeight=300px;help=0;scroll=1;status=0;");
    if(returnObj!=null){
	    NE_ID_INPUT.value = returnObj.value;
	    NE_NAME.value = returnObj.text;
	    var aurl= "../../servlet/commonservlet?tag=5&netid="+returnObj.value;
	    xmlhttp.Open("POST",aurl,false);
	    xmlhttp.send();
	    neTypeId=xmlhttp.responseText;
	    if(neTypeId.indexOf(",")==-1){
	    	rebuildCtrlMsg();
	    }else{
	    	alert("所选择网元网元类型必须相同");
	    	NE_ID_INPUT.value=oNeid;
	    	NE_NAME.value=oNeName;
	    	return;
	    }
    }
}

function setNeId(netIds){
	neIds=netIds.split(",");
	for (i=0;i<neIds.length;i++){
	    oNetElement.value=neIds[i];
	}
}
//*****************************************************************************
//*********************** 自动判断操作 ******************************************
//*****************************************************************************/
// 1. KPI选择器
function selectKPI()
{
	if(IF_APPSYS.checked==true)
	{
		selectsubmitKPI("true");
	}else
	{
		selectsubmitKPI("false");
	}
}

//*****************************************************************************
//*********************** 自动执行操作 *******************************************
//*****************************************************************************/
// 1. 控制命令：重新载入
function rebuildCtrlMsg()
{
	if(oNeType.value != "") {
		neTypeId = oNeType.getAttribute("CI_CLASS_ID");
	}
 	if(neTypeId=="")
 	{
 	    ctrlMsg.length = 0;
 	}else
 	{
 	    // (2-1). 控制命令KPI
 	    //var sql = "SELECT kpi_id VALUE, kpi_name TEXT FROM exec_script a, kpi_code_list b WHERE a.ne_type_id="+neTypeId+" AND a.script_type=2 AND a.exec_script_id=b.exec_script_id AND ne_msg_type='10' ";
 	    rebuildSelect("../../servlet/maintjobitemservlet?tag=14&neTypeId="+neTypeId, ctrlMsg, "false");
 	}
 	rebuildExecScript();
}

// 2. 执行脚本：重新载入
function rebuildExecScript()
{
	if(oNeType.value != "") {
		neTypeId=oNeType.getAttribute("CI_CLASS_ID");
	}
    if(ctrlMsg.length == 0)
    {
        execScriptInfo.length = 0;
    }else
    {
        if(ctrlMsg.value=="")
        {
            execScriptInfo.disabled = false;
        }else
        {
            execScriptInfo.disabled = true;
        }
        rebuildSelect("../../servlet/maintjobitemservlet?tag=15&kpiId="+ctrlMsg.value+"&neTypeId="+neTypeId, execScriptInfo, "false");
    }
}

// 3. 任务：重新载入
function reloadNeTask()
{
 	// (1). 清空数据任务配置
    var datas = neCtlMsgConfig.rows;
    for(var i=datas.length-1;i>0;i--)
    {
        datas[i].removeNode(true);
    }
	if(NE_ID_INPUT.value=="") return;
    
    // (2). 重新载入任务配置
 	if(execScriptInfo.value=="") return;
	xmlhttp.Open("POST","../../servlet/maintjobitemservlet?tag=13&neIds="+NE_ID_INPUT.value+"&execScriptId="+execScriptInfo.value,false);
	xmlhttp.send();
	if(isSuccess(xmlhttp))
	{
	    var dXML = xmlhttp.responseXML;
 	    var neIds = NE_ID_INPUT.value.split(",");
 	    var neNames = NE_NAME.value.split(",");
 	    var rowObject;
 	    var cellObject;
 	    var oItem;
 	    if(neIds.length>5) neCtlMsgConfigBlock.style.height = "220px";//4-170px
 	    isAllCtrlCfg = true;
 	    for(var i=0;i<neIds.length;i++)
 	    {
 	        rowObject = neCtlMsgConfig.insertRow();
 	        rowObject.bgColor="#FFFFFF";
 	        
 	        cellObject = rowObject.insertCell();
 	        cellObject.style.width="10px";
 	        cellObject.innerHTML = '<img src="../../resource/image/indexImage/index1_55.gif">';
 	        
 	        cellObject = rowObject.insertCell();//2
 	        cellObject.style.textAlign = "left";
 	        cellObject.innerHTML = neNames[i];
 	        
 	        cellObject = rowObject.insertCell();//3
 	        oItem = dXML.selectSingleNode("/root/rowSet[NE_ID=\""+neIds[i]+"\"]");
 	        if(oItem!=null)
 	        {
 	            cellObject.innerHTML = '已配置';
 	        }else
 	        {
 	            cellObject.style.color = "red";
 	            cellObject.style.textDecoration = "underline";
 	            cellObject.innerHTML = '未配置';
 	            //isAllCtrlCfg = false;
 	        }
 	        
 	        cellObject = rowObject.insertCell();//4
 	        cellObject.innerHTML = '<IE:button value="查看" onclick="showCtrlMsgTaskConfig('+neIds[i]+','+"'"+neNames[i]+"'"+')"/>';
 	    }
	}
}

// 4 功能：配置执行脚本
function configExecScriptM()
{
	var dialogsFeatures = "dialogWidth=800px;dialogHeight=600px;help=0;scroll=0;status=0;"
    window.showModalDialog("../execscript/exec_script_list.html",null,dialogsFeatures);
    rebuildExecScript();
}

// 5 功能：配置控制命令任务
function showCtrlMsgTaskConfig(neId, neName)
{
	var params = new Array();
	params.push(neId);
	params.push(neName);
	params.push(neTypeId);
	params.push(2);//控制命令脚本
	var retValue = window.showModalDialog("../config/task/ne_task_configs.htm",params,"dialogWidth=800px;dialogHeight=600px;help=0;scroll=1;resizable=0;status=0;");
	reloadNeTask();
}




//*****************************************************************************
//*********************** 公用函数 **********************************************
//*****************************************************************************/
// 功能：添加子节点
// 输入：(1).原节点 (2).新增节点名 (3).新增节点值 (4).属性名数组 (5).属性值数组 (6).XML文件头
function addNewNode(infoNode, nodeName, nodeValue, attrNameArr, attrValueArr, processInstruction)
{
    if(nodeName==null) return;
    
    var dXML = infoNode.ownerDocument;
    
    // (1). 创建元素
    var itemNode;
    if(dXML!=null)// 创建子元素
    {
        itemNode = dXML.createElement(nodeName);
    }else         // 创建根元素
    {
        itemNode = infoNode.createElement(nodeName);
        
        if(processInstruction && processInstruction!=null)
        {
            var pi = infoNode.createProcessingInstruction("xml", processInstruction);
            infoNode.appendChild(pi);
        }
    }
    if(nodeValue && nodeValue!="") itemNode.text = nodeValue;
    
    // (2). 添加属性
    if(attrNameArr && attrNameArr!=null)
    {
        for(var i=0;i<attrNameArr.length;i++)
        {
              itemNode.setAttribute(attrNameArr[i], attrValueArr[i]);
        }
    }
    
    // (3). 添加该元素
    infoNode.appendChild(itemNode);
    
    return itemNode;
}
