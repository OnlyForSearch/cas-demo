
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
var aoto_config_json = eval('('+$getSysVar("IS_SHOW_JOB_AUTO_CONFIG")+')');//根据配置是否”显示自动提交“
function changeifauto()
{
	if(NON_AUTO.checked)
	{
	    document.getElementById("tab2").display="none";
	    document.getElementById("tab3").display="none";
	    document.getElementById("tab4").display="none";
	    document.getElementById("tabExpect").display="none";
	    oMPC.selectedIndex = 0;
	    document.getElementById("next_exectime_tr1").style.display="none";
	    document.getElementById("next_exectime_tr2").style.display="none";
	    
	    document.getElementById("IF_AUTO_PUTIN_AUDIT_TR1").style.display="none";
	    document.getElementById("IF_AUTO_PUTIN_AUDIT_TR2").style.display="none";
	    
	    if(isJtitsmJob == '1'){
	    	document.getElementById("TARGET_NAME_TR1").style.display="";
	    	document.getElementById("TARGET_NAME_TR2").style.display="";
	    }
	} else if(AUTO_INSPECT.checked){
		document.getElementById("TARGET_NAME_TR1").style.display="none";
	    document.getElementById("TARGET_NAME_TR2").style.display="none";
		
	    document.getElementById("next_exectime_tr1").style.display="";
	    document.getElementById("next_exectime_tr2").style.display="";
	    
	    document.getElementById("tab2").display="none";
	    document.getElementById("tab3").display="none";
	    document.getElementById("tab4").display="none";
	    document.getElementById("tabExpect").display="";
	}
	else
	{
	    document.getElementById("TARGET_NAME_TR1").style.display="none";
	    document.getElementById("TARGET_NAME_TR2").style.display="none";
		
	    document.getElementById("next_exectime_tr1").style.display="";
	    document.getElementById("next_exectime_tr2").style.display="";
	    
	    document.getElementById("tabExpect").display="none";
	    
	    if(aoto_config_json.IS_ITEM_INFO_SHOW_AUTO_PUTIN_AUDIT == '0BT'){
	    	document.getElementById("IF_AUTO_PUTIN_AUDIT_TR1").style.display="";
	    	document.getElementById("IF_AUTO_PUTIN_AUDIT_TR2").style.display="";
	    }
	    
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
	        	neTypeId=oNeType.value;
	        }
	        if(neTypeId!=""){
	        	rebuildCtrlMsg();}
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
		HASTEN_TIME_MI.disabled = false;
	}else{
		HASTEN_TD.disabled = true;
		HASTEN_TIME.disabled = true;
		HASTEN_TIME_MI.disabled = true;
	}
}

// 催办：变更
function changeSubPasten()
{
	var HASTEN_TD = document.getElementById('SUB_HASTEN_TD');
	var HASTEN_COUNT_TD = document.getElementById('SUB_HASTEN_COUNT_TD');
	if(IF_SUB_HASTEN.checked)
	{
		SUB_HASTEN_TD.disabled = true;
		SUB_HASTEN_COUNT.disabled = true;
		
		SUB_HASTEN_COUNT_TD.disabled = false;
		SUB_HASTEN_TIME.disabled = false;
		SUB_HASTEN_TIME_MI.disabled = false;
		SUB_NOTIFY_STEP.disabled = false;
		SUB_HASTEN_CHECKBOX.disabled = false;
		
	}else if(IF_SUB_HASTEN_COUNT.checked){
		SUB_HASTEN_TD.disabled = false;
		SUB_HASTEN_COUNT.disabled = false;
		
		SUB_HASTEN_COUNT_TD.disabled = true;
		SUB_HASTEN_TIME.disabled = true;
		SUB_HASTEN_TIME_MI.disabled = true;
		SUB_NOTIFY_STEP.disabled = false;
		SUB_HASTEN_CHECKBOX.disabled = false;
		
	}else{
		SUB_HASTEN_TD.disabled = true;
		SUB_HASTEN_COUNT_TD.disabled = true;
		SUB_HASTEN_COUNT.disabled = true;
		SUB_HASTEN_TIME.disabled = true;
		SUB_HASTEN_TIME_MI.disabled = true;
		SUB_NOTIFY_STEP.disabled = true;
		SUB_HASTEN_CHECKBOX.disabled = true;
	}
}


function changeSub(){

	SUB_HASTEN_TD.disabled = true;
	SUB_HASTEN_COUNT_TD.disabled = true;
	SUB_HASTEN_COUNT.disabled = true;
	SUB_HASTEN_TIME.disabled = true;
	SUB_HASTEN_TIME_MI.disabled = true;
	SUB_NOTIFY_STEP.disabled = true;
	SUB_HASTEN_CHECKBOX.disabled = true;
	
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

function deleteList(obj)
{
  if(obj.length>0){
    if(obj.selectedIndex>=0){
      obj.remove(obj.selectedIndex);
    }
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
	DR_ID_FLAG.disabled = true;
	DR_ID.disabled = true;
	REGION_ID_IMG.disabled = true;
	REGION_ID_SELECT.disabled = true;
	REGION_ID_GROUP_FLAG.disabled = true;
	REGION_ID_GROUP.disabled = true;
	REGION_ID_GROUP_BNT.disabled = true;
	REGION_ID_GROUP_IMG.disabled = true;
	REGION_ID_GROUP_SELECT.disabled = true;
	
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
	DR_ID_FLAG.disabled = false;
	DR_ID.disabled = false;
	REGION_ID_SELECT.disabled = false;
	REGION_ID_GROUP_FLAG.disabled = false;
	REGION_ID_GROUP.disabled = false;
	REGION_ID_GROUP_BNT.disabled = false;
	REGION_ID_GROUP_IMG.disabled = false;
	REGION_ID_GROUP_SELECT.disabled = false;
  }
}


// 3. 网元：选择(多选)
function selectNeId(oNeTypeValue)
{
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.open("POST","../../servlet/netElementTree",false);
    xmlhttp.send();
    
    var dXML = xmlhttp.responseXML;
   	var delNode = dXML.selectNodes("//MenuItem[@tag=3 or @tag=4 or @id=4]");
   	delNode.removeAll();
   	
   	var neTypeStr = neTypeId;
   	if(oNeTypeValue && oNeTypeValue!="")
   	{
   	    neTypeStr = oNeTypeValue;
   	}
   	if(neTypeStr!="")
   	{
	   	var menuRoot = dXML.selectSingleNode("/root/Menu");
	   	var addNodes = dXML.selectNodes("//MenuItem[@neTypeId="+neTypeStr+" and @tag!=1]");
	   	for(var i=0;i<addNodes.length;i++)
	   	{
	   	    menuRoot.appendChild(addNodes[i]);
	   	}
	   	menuRoot.removeChild(menuRoot.childNodes[0]);
   	}
		
   	//弹出选择框，选择网元
    var queryIds = "";
	var a = showChoiceTreeWinByDoc(xmlhttp.responseXML, NE_ID_INPUT.value);
	
	if(a!=null)
	{
		NE_ID_INPUT.value = "";
		NE_NAME.value     = "";
		for(var i=0;i<a.length;i++)
		{
			if(i==0){
				NE_ID_INPUT.value = a[i].value;
				NE_NAME.value = a[i].text;
				queryIds += "@id="+a[i].value;
			}else{
				NE_NAME.value += ","+a[i].text;
				NE_ID_INPUT.value += ","+a[i].value;
				queryIds += " or @id="+a[i].value;
			}
		}
        //如果启用了“自动执行”，则获取对应控制命令。
        //if(AUTO_EXEC.checked || AUTO_BOTH.checked)
        //{
            var neType = "";
            
            if(queryIds.length>0)
            {
            	neTypeId = "";
                var oRows = dXML.selectNodes("//MenuItem["+queryIds+"]");
                for(var i=0;i<oRows.length;i++)
                {
                    neType = oRows[i].getAttribute("neTypeId");
                    if(neTypeId=="")
                    {
                        neTypeId = neType;
                    }else if(neTypeId!=neType)
                    {
                        neTypeId = "";
                        break;
                    }
                }
                if(AUTO_EXEC.checked || AUTO_BOTH.checked) {               	
					setNeId(NE_ID_INPUT.value);
                	rebuildCtrlMsg();
                }
                NE_ID_INPUT.setAttribute("neTypeId", neTypeId);
            }/*else{
            	
 				// (1). 清空数据任务配置
    			var datas = neCtlMsgConfig.rows;
    			for(var i=datas.length-1;i>0;i--)
    			{
        			datas[i].removeNode(true);
    			}
            }*/
        //}
	}
}


function setNeId(netId){
	eval("oNetElement_"+netId).value=netId;
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
 	/*if(neTypeId=="")
 	{
 	    ctrlMsg.length = 0;
 	}else
 	{
 	    // (2-1). 控制命令KPI
 	    //var sql = "SELECT kpi_id VALUE, kpi_name TEXT FROM exec_script a, kpi_code_list b WHERE a.ne_type_id="+neTypeId+" AND a.script_type=2 AND a.exec_script_id=b.exec_script_id AND ne_msg_type='10' ";
 	    rebuildSelect("../../servlet/maintjobitemservlet?tag=14&neTypeId="+neTypeId, ctrlMsg, "false");
 	}
 	rebuildExecScript();*/
}

// 2. 执行脚本：重新载入
/*function rebuildExecScript()
{
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
    //reloadNeTask();
}*/

// 3. 任务：重新载入
/*function reloadNeTask()
{
	if(NE_ID_INPUT.value==""){
		alert("请先选取网元!")
		return;
	}else
		initExecTask();
/*	var nIds = NE_ID_INPUT.value;
	if(nIds=="") return;
	var nId=nIds.split(",");	
	for (var i=0;i<nId.length;i++){		
		rebuildSelect("../../servlet/maintjobitemservlet?tag=15&kpiId="+ctrlMsg.value+"&neTypeId="+neTypeId, eval("execScriptInfo_"+nId[i]), "false");	
		eval("execScriptInfo_"+nId[i]).value = execScriptInfo.value;
		//alert(eval("ne_task_config_id_"+nId[i]).value);
		loadScript(execScriptInfo.value,nId[i],eval("ne_task_config_id_"+nId[i]).value,"1");
	}
 	// (1). 清空数据任务配置
    /*var datas = neCtlMsgConfig.rows;
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
 	            isAllCtrlCfg = false;
 	        }
 	        
 	        cellObject = rowObject.insertCell();//4
 	        cellObject.innerHTML = '<IE:button value="查看" onclick="showCtrlMsgTaskConfig('+neIds[i]+','+"'"+neNames[i]+"'"+')"/>';
 	    }
	}
}*/

function setConfig_ne_id(obj)
{
	buildAgentSelect("/../../servlet/taskConfigServlet?tag=34&ciId="+obj.getAttribute("CI_ID"),eval("config_ne_id"),true)
}

function buildAgentSelect(url,obj,istext)
{
	for (var i = obj.length - 1; i >= 0; i--) {
			obj.options.remove(i);
	}
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST", url, false);
	xmlhttp.send();
	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	dXML.load(xmlhttp.responseXML);

	var element = dXML.selectSingleNode("/root/rowSet");
	while (element != null)
	{
		var text;
		var val;
		var objOption;
		if(istext === true){
			val = element.selectSingleNode("VALUE").text;
			text = (element.selectSingleNode("NAME")||element.selectSingleNode("TEXT")).text;
			objOption = new Option(text, val);
		}
		else{
			text = element.childNodes[1].text;
			val = element.childNodes[0].text;
			objOption = new Option(text, val);
			
			if(element.childNodes[2].text == '1')
				objOption.selected=true;			
		}
		obj.add(objOption);
		element = element.nextSibling;
	}
}

function initExecInfo(){
	EXEC_NET.value = NE_ID_INPUT.value.split(",")[0];
	
	if(EXEC_NET.value){
		var url = "../../servlet/commonservlet?tag=201&paramValue=" + getAESEncode(encodeURIComponent("SELECT I.INSPECT_ID VALUE,I.INSPECT_NAME TEXT FROM CI_CTRL_INSPECT I,CI_CTRL_COL C WHERE " +
				"I.CI_CTRL_COL_ID = C.CI_CTRL_COL_ID AND C.DEST_MODULE = 1 AND I.STATE = '0SA' AND C.STATE = '0SA' AND I.INSTANCE_ID = "+EXEC_NET.value));
		rebuildSelect(url,INSPECT_ID,"false");
		INSPECT_ID.selectedIndex="-1";
		loadAutoExecInfo();
	}
}

function loadAutoExecInfo(){
	if(INSPECT_ID.value){
		var submitURL = "/servlet/NetExecAbilityAction.do?method=loadAutoExecInfo&INSPECT_ID=" +INSPECT_ID.value;
		xmlhttp.Open('post', submitURL, false);
		xmlhttp.send();

	    if (isSuccess(xmlhttp)) {
			var dXML = new ActiveXObject("Microsoft.XMLDOM");
			dXML.load(xmlhttp.responseXML);
			document.all.CTRL_CLASS_NAME_CN.innerText = dXML.selectSingleNode("/root/Msg/CTRL_CLASS_NAME_CN").text;
			document.all.CTRL_NAME.innerText = dXML.selectSingleNode("/root/Msg/CTRL_NAME").text;
			document.all.CTRL_DESC.innerText = dXML.selectSingleNode("/root/Msg/CTRL_DESC").text;
			document.all.OVERTIME.innerText = dXML.selectSingleNode("/root/Msg/OVERTIME").text+"秒";
		}
	}
}

function configNetAbility(){
	//var oItem=cfgTree.getSelectedItem();
	if(EXEC_NET.value){
		var params = new Array();
		params[0] = "INSTANCE_ID="+EXEC_NET.value;
		params[1] = "CLASS_ID="+neTypeId;//已经控制只能选择一个网元
		window.showModalDialog("/workshop/config/netExecAbility.html?"+params.join('&'),null,"dialogWidth=870px;dialogHeight=650px;help=0;scroll=0;status=0;");
		initExecInfo();
	}else{
		EMsg("请先选择执行网元!");
	}
}

function JUDGE_BY_EXEC_CHANGE()
{
	//if(JUDGE_BY_EXEC_RESULT.checked){
	//	JUDGE_BY_EXEC.checked = true;
	//}
}

function JUDGE_BY_EXEC_RESULT_CHANGE(){
	
	if(JUDGE_BY_EXEC_RESULT.checked){
		JUDGE_BY_EXEC.checked = true;
	}
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