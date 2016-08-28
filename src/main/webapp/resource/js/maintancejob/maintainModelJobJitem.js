
// 1. ���ڣ��ڶ���
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

// 2. �Զ����������
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
	        // ����ǡ��Զ�ִ�С�ʱ��������Ԫ��Χ����Ϊ��Ӧ��ƽ̨����
	        if(IF_APPSYS.checked) NON_APPSYS.click();
	    }
	}
}

// 3. �߰죺���
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

// 4. �߰죺��������
function checkIsInt(obj)
{
	try
	{
		if(obj.value=="") return;
		
		var value = parseInt(obj.value);
		if(value == null)
		{
			EMsg("ֻ��������ֵ!");
			obj.focus();
		}
		if(value<0) value = value * -1;
		obj.value = value;
		obj.value = obj.value.replace("NaN","");
	}catch(e){
			EMsg("ֻ��������ֵ!");
			obj.focus();
	}
}

//*****************************************************************************
//*********************** ��Ԫ��Χ **********************************
//*****************************************************************************/
// 1. ��Ԫ������(ҵ��ϵͳ)
function businessTree(oNeTypeValue)
{
	try
	{
		var tree = event.xmlDom;
		var menuRoot = tree.selectSingleNode("/root/Menu");
		
		//(1). ȡ��Ԫ�ڵ�
		var oNode = tree.selectSingleNode("//MenuItem[@moduleID=4]");//ѡ��ҵ��ϵͳ
		menuRoot.appendChild(oNode);
		menuRoot.removeChild(menuRoot.childNodes[0]);
		
		//(2). ɾ��ʵ�ʽڵ�
		var oNodeList = tree.selectNodes("//MenuItem[@tag=6 and ../@tag=6]");//ɾ��ʵ������
		oNodeList.removeAll();
	}catch(e){}
}

// 2. ��Ԫ��ѡ��/��λ
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
	    setFlowDomainBlank();//��λ����Ԫ��Χ���͡��Զ��жϡ�
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
	    	alert("��ѡ����Ԫ��Ԫ���ͱ�����ͬ");
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
//*********************** �Զ��жϲ��� ******************************************
//*****************************************************************************/
// 1. KPIѡ����
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
//*********************** �Զ�ִ�в��� *******************************************
//*****************************************************************************/
// 1. ���������������
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
 	    // (2-1). ��������KPI
 	    //var sql = "SELECT kpi_id VALUE, kpi_name TEXT FROM exec_script a, kpi_code_list b WHERE a.ne_type_id="+neTypeId+" AND a.script_type=2 AND a.exec_script_id=b.exec_script_id AND ne_msg_type='10' ";
 	    rebuildSelect("../../servlet/maintjobitemservlet?tag=14&neTypeId="+neTypeId, ctrlMsg, "false");
 	}
 	rebuildExecScript();
}

// 2. ִ�нű�����������
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

// 3. ������������
function reloadNeTask()
{
 	// (1). ���������������
    var datas = neCtlMsgConfig.rows;
    for(var i=datas.length-1;i>0;i--)
    {
        datas[i].removeNode(true);
    }
	if(NE_ID_INPUT.value=="") return;
    
    // (2). ����������������
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
 	            cellObject.innerHTML = '������';
 	        }else
 	        {
 	            cellObject.style.color = "red";
 	            cellObject.style.textDecoration = "underline";
 	            cellObject.innerHTML = 'δ����';
 	            //isAllCtrlCfg = false;
 	        }
 	        
 	        cellObject = rowObject.insertCell();//4
 	        cellObject.innerHTML = '<IE:button value="�鿴" onclick="showCtrlMsgTaskConfig('+neIds[i]+','+"'"+neNames[i]+"'"+')"/>';
 	    }
	}
}

// 4 ���ܣ�����ִ�нű�
function configExecScriptM()
{
	var dialogsFeatures = "dialogWidth=800px;dialogHeight=600px;help=0;scroll=0;status=0;"
    window.showModalDialog("../execscript/exec_script_list.html",null,dialogsFeatures);
    rebuildExecScript();
}

// 5 ���ܣ����ÿ�����������
function showCtrlMsgTaskConfig(neId, neName)
{
	var params = new Array();
	params.push(neId);
	params.push(neName);
	params.push(neTypeId);
	params.push(2);//��������ű�
	var retValue = window.showModalDialog("../config/task/ne_task_configs.htm",params,"dialogWidth=800px;dialogHeight=600px;help=0;scroll=1;resizable=0;status=0;");
	reloadNeTask();
}




//*****************************************************************************
//*********************** ���ú��� **********************************************
//*****************************************************************************/
// ���ܣ�����ӽڵ�
// ���룺(1).ԭ�ڵ� (2).�����ڵ��� (3).�����ڵ�ֵ (4).���������� (5).����ֵ���� (6).XML�ļ�ͷ
function addNewNode(infoNode, nodeName, nodeValue, attrNameArr, attrValueArr, processInstruction)
{
    if(nodeName==null) return;
    
    var dXML = infoNode.ownerDocument;
    
    // (1). ����Ԫ��
    var itemNode;
    if(dXML!=null)// ������Ԫ��
    {
        itemNode = dXML.createElement(nodeName);
    }else         // ������Ԫ��
    {
        itemNode = infoNode.createElement(nodeName);
        
        if(processInstruction && processInstruction!=null)
        {
            var pi = infoNode.createProcessingInstruction("xml", processInstruction);
            infoNode.appendChild(pi);
        }
    }
    if(nodeValue && nodeValue!="") itemNode.text = nodeValue;
    
    // (2). �������
    if(attrNameArr && attrNameArr!=null)
    {
        for(var i=0;i<attrNameArr.length;i++)
        {
              itemNode.setAttribute(attrNameArr[i], attrValueArr[i]);
        }
    }
    
    // (3). ��Ӹ�Ԫ��
    infoNode.appendChild(itemNode);
    
    return itemNode;
}
