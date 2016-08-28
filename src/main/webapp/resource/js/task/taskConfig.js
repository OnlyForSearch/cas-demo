var TYPE_STRING = 2;
var TYPE_DATE = 3;
var TYPE_LIST = 4;
var DEFAULT_DATE = "AAAAAAAAAAAAAA";
var IS_PASSWORD_VALUE = "0BT";

var curStepIndex = 1;

var tabCount = 0;    // �ܱ�ǩҳ
var curTabIndex = -1;// ��ǰ��ǩҳ

var isWizard = false;
var agentNeId = "";

var tabContentArray = new Array();
var execScriptObject = new Object();

var TASK_MODEL_ID = "TASK_MODEL_ID";  // ģ����Ϣ
var EXEC_SCRIPT = "EXEC_SCRIPT";
var AGENT_NE = "AGENT_NE";
var SAMPLE_INTERVAL = "SAMPLE_INTERVAL";
var TIME_UNIT = "TIME_UNIT";
var SAMPLE_START_TIME = "SAMPLE_START_TIME";
var SAMPLE_END_TIME = "SAMPLE_END_TIME";
var EXEC_SCRIPT_PARAM = "EXEC_SCRIPT_PARAM";

var EXEC_SCRIPT_ID = "EXEC_SCRIPT_ID";// �ű���Ϣ
var EXEC_NAME = "EXEC_NAME";
var EXEC_NAME_CN = "EXEC_NAME_CN";
var EXEC_CONTENT = "EXEC_CONTENT";
var NE_TYPE_NAME = "NE_TYPE_NAME";
var REMARK = "REMARK";
var SCRIPT_TYPE = "SCRIPT_TYPE";

var PARAM_DESC = "PARAM_DESC";        //������Ϣ
var NE_TYPE_ATTR_ID = "NE_TYPE_ATTR_ID";
var ATTR_VALUE_TYPE_ID = "ATTR_VALUE_TYPE_ID";
var PARAM_VALUE = "PARAM_VALUE";
var DEFAULT_VALUE = "DEFAULT_VALUE";
var DISABLED= "DISABLED";
var SEQ = "SEQ";
var IS_PASSWORD = "IS_PASSWORD";
var tmpParams;
var execContentMessage = "";
var ATTR_GROUP_ID="ATTR_GROUP_ID";
var PROP_VALUE="PROP_VALUE";

function checkDates(sampleStartMonth,sampleStartDay,sampleEndMonth,sampleEndDay)
{
	/*if(''==sampleStartMonth){MMsg("�Բ���,��ʼ���ڴ�����ѡ��������ڣ�");return false;}
	if(''==sampleStartDay){MMsg("�Բ���,��ʼ���ڴ�����ѡ��������ڣ�");return false;}
	if(''==sampleEndMonth){MMsg("�Բ���,�������ڴ�����ѡ��������ڣ�");return false;}
	if(''==sampleEndDay){MMsg("�Բ���,�������ڴ�����ѡ��������ڣ�");return false;}*/
	var toDate = new Date();
    var theDate1 = new Date(toDate.getYear(),sampleStartMonth,0);
    if(sampleStartDay>theDate1.getDate()){MMsg("�Բ���,��ʼ���ڴ��󣬸����ڲ����ڣ�");return false;}
    var theDate2 = new Date(toDate.getYear(),sampleEndMonth,0);
    if(sampleEndDay>theDate2.getDate()){MMsg("�Բ���,�������ڴ��󣬸����ڲ����ڣ�");return false;}
    return true;
}

// 1. ����������
function reloadSelection(selectionObj, oRows)
{
    if(oRows==null) {return;}
    var oOption;
    var childs;
    var iLen = selectionObj.length;
    for(var i=iLen-1;i>=0;i--){
        selectionObj.options.remove(i);
    }
    iLen = oRows.length;
    for(var i=0;i<iLen;i++)
    {
        childs = oRows[i].childNodes;
        oOption = document.createElement("OPTION");
        oOption.value = childs[0].text;
        oOption.text = childs[1].text;
        selectionObj.add(oOption);
    }
}

// 2. ��ʼ��ʱ��
function initDateTime()
{
    initDateTimeSelection(sampleStartMonth, 1, 12);//��
    initDateTimeSelection(sampleEndMonth, 1, 12);
    initDateTimeSelection(sampleStartDay, 1, 31);//��
    initDateTimeSelection(sampleEndDay, 1, 31);
    initDateTimeSelection(sampleStartHour, 0, 23);//ʱ
    initDateTimeSelection(sampleEndHour, 0, 23);
    initDateTimeSelection(sampleStartMinute, 5, 59, 5);//��
    initDateTimeSelection(sampleEndMinute, 5, 59, 5);
}

// 3. ***********************�����롰��������� *****************************
function loadExecScriptInfo(isDisabled,isNeId)
{
    if(execScriptInfo.selectedIndex==-1) {clearExecScriptInfo();return;}
    var disabledStr = ((isDisabled)?" disabled ":"");
    var oExecScript = execScriptObject[execScriptInfo.value];
    var paramObject;
    if(curTabIndex>=0)
    {
        paramObject = tabContentArray[curTabIndex][EXEC_SCRIPT_PARAM];//ģ������
    }
   
    if(oExecScript!=null)
    {
        //(1). ������Ϣ
    
        execName.innerHTML = oExecScript[EXEC_NAME];
        scriptTypeName.innerHTML = oExecScript[SCRIPT_TYPE];
        execContentMessage = oExecScript[EXEC_CONTENT];
        execContent.innerHTML = '<span onclick="showExecContent()" style="color:blue;cursor:hand;">' + oExecScript[EXEC_CONTENT] + '</span>';
        //execContent.title = oExecScript[EXEC_CONTENT];
        //execMethod.innerHTML = oExecScript[EXEC_MOTHODS];
        //ssy 3-11���
        exec_name_cn.innerHTML = oExecScript[EXEC_NAME_CN];
        neType.innerHTML = oExecScript[NE_TYPE_NAME];
        remark.innerHTML = oExecScript[REMARK];
       
        
        
        //(2). �������
        var oParamArray = oExecScript[EXEC_SCRIPT_PARAM];//����ű�
        var oParam;
        
        var iLen = oParamArray.length;
        var rowObject;
        var cellObject;
        var datas = scriptParamTable.rows;
        var displayValue;
        var neTypeAttr;
        var groupId;
        var remoteDesc="&nbsp";
        var propValue="";
        for(var i=datas.length-1;i>=0;i--)
        {
            datas[i].removeNode(true);
        }
        for(var i=0;i<iLen;i++)
        {
        	remoteDesc="&nbsp";
            oParam = oParamArray[i];
            displayValue = oParam[DEFAULT_VALUE];//����ű�
            if(paramObject!=null && paramObject[oParam[SEQ]]!=null)
            {
                //displayValue = paramObject[oParam[SEQ]];
            }           
            neTypeAttr = oParam[NE_TYPE_ATTR_ID];
            groupId= oParam[ATTR_GROUP_ID];
			propValue = oParam[PROP_VALUE];
            rowObject = scriptParamTable.insertRow();
            cellObject = rowObject.insertCell();//0
            //cellObject.style.height="26";
            cellObject.style.width="5";
            cellObject.innerHTML = '&nbsp;';
            cellObject = rowObject.insertCell();//1
            cellObject.style.width="13";
            if(neTypeAttr == null || neTypeAttr ==""){
            	cellObject.innerHTML = '<IMG src="../../../resource/image/form_cell_item.gif" width="6" height="6">'
            }else if(groupId!=null && groupId=="3"){
            	cellObject.innerHTML = '<IMG src="../../../resource/image/form_cell_item_red.jpg" width="6" height="6">'
            }else{
            	cellObject.innerHTML = '<IMG src="../../../resource/image/form_cell_item_yello.jpg" width="6" height="6">'
            }
            
            cellObject = rowObject.insertCell();//2
            cellObject.noWrap="true";
            cellObject.style.width="60";
            cellObject.className = "form_cell";
            disabledStr=oParam[DISABLED];
            //���˵�������˫���� 
            var str = '<nobr onmouseover=\'showTip2(this, popTip, "'+oParam[REMARK].replace(/"/g, '\\"').replace(/'/g, "&acute;")+'")\' onmouseout=\'hideTip(this, popTip, event)\'>'+oParam[PARAM_DESC]+'</nobr>';
            if(neTypeAttr == null || neTypeAttr ==""){
 //           	cellObject.innerHTML = '<nobr onmouseover="showTip2(this, popTip, '+"'"+oParam[REMARK]+"'"+')" onmouseout="hideTip(this, popTip, event)">'+oParam[PARAM_DESC]+'</nobr>';//
            	cellObject.innerHTML = str;
            }else if(groupId!=null && groupId=="3"){
//            	cellObject.innerHTML = '<nobr onmouseover="showTip2(this, popTip, '+"'"+oParam[REMARK]+"'"+')" onmouseout="hideTip(this, popTip, event)"> '+oParam[PARAM_DESC]+'</nobr>';//           	            	
            	cellObject.innerHTML = str;
            	if(isNeId && propValue=="" && displayValue==""){
            		remoteDesc="������ֵΪ�գ�Զ�̲ɼ�ʱ���";
            	}else if(isNeId && propValue=="" && displayValue!="")
            	{
            		remoteDesc="������ֵΪ�գ���ǰֵȡ��ʵ����";
            	}
            }else{
//            	cellObject.innerHTML = '<nobr onmouseover="showTip2(this, popTip, '+"'"+oParam[REMARK]+"'"+')" onmouseout="hideTip(this, popTip, event)"> '+oParam[PARAM_DESC]+'</nobr>';//           	            	
            	cellObject.innerHTML = str;
            }
            cellObject = rowObject.insertCell();//3
            cellObject.noWrap=true;
            cellObject.style.width="160";
            //IS_PASSWORD
            if(oParam[ATTR_VALUE_TYPE_ID]==TYPE_LIST)// && neTypeAttrId!=null && neTypeAttrId.length>0
            {
                cellObject.innerHTML = getScriptParamSelection(oParam[EXEC_SCRIPT_ID], oParam[SEQ], oParam[NE_TYPE_ATTR_ID], oParam[PARAM_VALUE], displayValue, disabledStr);
            }else if(oParam[ATTR_VALUE_TYPE_ID]==TYPE_DATE)
            {
                cellObject.innerHTML = '<IE:CalendarIpt style="width:150px;" value="'+displayValue+'" initValue="'+oParam[PARAM_VALUE]+'" '+disabledStr+'/>';
            }else if(oParam[IS_PASSWORD]==IS_PASSWORD_VALUE)
            {
                cellObject.innerHTML = '<input type="password" style="width:152px;" value="'+displayValue+'" initValue="'+oParam[PARAM_VALUE]+'" '+disabledStr+'>';
            }else
            {
                cellObject.innerHTML = "<textarea type=text style='width:200px;height:23px;' id=txt"+i+" initValue='"+oParam[PARAM_VALUE]+"' "+disabledStr+">"+displayValue+"</textarea><a onclick=openMemopanelWin('"+disabledStr+"','txt"+i+"');><img src='../../../resource/image/editPLSQL.gif' width=16 height=16 border=0></a>";
            }
            cellObject.insertAdjacentHTML('beforeEnd', '<input type="hidden" value="'+oParam[SEQ]+'">');

            cellObject = rowObject.insertCell();//4
            cellObject.noWrap=true;
            cellObject.style.width="100";
            cellObject.style.color="red";
            cellObject.innerHTML = remoteDesc+"&nbsp;";
            
            rowObject = scriptParamTable.insertRow();
            cellObject = rowObject.insertCell();//0
            cellObject.style.height="1";
            cellObject.style.width="5";
            cellObject.innerHTML = "&nbsp;";
                        
            cellObject = rowObject.insertCell();//1-3
            cellObject.colSpan = "3";
            cellObject.style.backgroundRepeat="repeat-x";
            cellObject.background = "../../../resource/image/dashed.gif";
        }        
        scriptParamTable.insertRow().insertCell();// **********���һ��Ϊ��**********
    }
}

function hideObjects()
{
    for (var i = 0; i < document.all.tags("select").length; i++)
    {
         var obj = document.all.tags("select")[i];
         obj.style.visibility = "hidden";
    }
}

function showObjects()
{
     for (var i = 0; i < document.all.tags("select").length; i++) 
     {
          var obj = document.all.tags("select")[i];
          obj.style.visibility ="visible";
     }
}

function openMemopanelWin()
{
    var bDisable = arguments[0];
    var objId = arguments[1];
    if(bDisable=='disabled') return false;
    hideObjects();
 	memopanel.style.display = "block";
	memopanel.style.left = (document.body.offsetWidth-memopanel.offsetWidth)/2;
	memopanel.style.top = (document.body.offsetHeight-memopanel.offsetHeight)/2;
	hidobj.value = objId;
	memotextarea.value = document.getElementById(objId).value;
	memotextarea.focus();
}

function closeMemopanelWin()
{
    var result = arguments[0];
    if(result) {
       var ol = memotextarea.value;
       if(ol.Tlength() > 4000) {
           alert('�༭���ݳ���2000���ַ�!');
           memotextarea.focus();
           return false;
       }
       if(hidobj.value) document.getElementById(hidobj.value).value = memotextarea.value;
    }
	memopanel.style.display = "none";
	showObjects();
}

// 4. �������
function clearExecScriptInfo()
{
    //(1). ������Ϣ
    execName.innerHTML = "";
    scriptTypeName.innerHTML = "";
    execContentMessage = "";
    execContent.innerHTML = "";
    exec_name_cn.innerHTML="";
    //execContent.title = "";
    //execMethod.innerHTML = "";
    neType.innerHTML = "";
    remark.innerHTML = "";
    
    //(2). �������
    var datas = scriptParamTable.rows;
    for(var i=datas.length-1;i>=0;i--)
    {
        datas[i].removeNode(true);
    }
    scriptParamTable.insertRow().insertCell();
}

// 5. �������ֵ�б�
function getScriptParamSelection(scriptId, seq, neTypeAttrId, paramValue, displayValue, disabledStr)
{
    var returnSelection = "<select style='width:150px;' initValue='"+paramValue+"' "+disabledStr+">";
    xmlhttp.Open("POST", httpUrl+"tag=13&execScriptId="+scriptId+"&seq="+seq+"&neTypeAttrId="+neTypeAttrId, false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        var dXML = new ActiveXObject("Microsoft.XMLDOM");
        dXML.load(xmlhttp.responseXML);
        
        var oRows = dXML.selectNodes("/root/rowSet");
        var tempValue;
        var childs;
        for(var i=0;i<oRows.length;i++)
        {
            childs = oRows[i].childNodes;
            tempValue = childs[1].text;
            if(tempValue == displayValue)
            {
                returnSelection += "<option value="+tempValue+" selected>"+childs[0].text+"</option>";
            }else
            {
                returnSelection += "<option value="+tempValue+">"+childs[0].text+"</option>";
            }
        }
    }
    returnSelection += "</select>";
    return returnSelection;
    
}

// 6. ***********************�����ء�ִ�нű��� *****************************
function reloadExecScript(neTypeId, neId, scriptType, isDisabled,isNeId)
{
    var execScriptId = execScriptInfo.value;
    
    xmlhttp.Open("POST", httpUrl+"tag=11&neTypeId="+neTypeId+"&neId="+neId+"&scriptType="+scriptType, false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        var dXML = xmlhttp.responseXML;
        // ���½ű���Ϣ
        reloadSelection(execScriptInfo, dXML.selectNodes("/root/EXEC_SCRIPTS/rowSet"));
        loadExecScript(dXML.selectNodes("/root/EXEC_SCRIPTS/EXEC_SCRIPT"));
        
        execScriptInfo.value = execScriptId;
        if(execScriptInfo.selectedIndex==-1) execScriptInfo.selectedIndex = 0;
        
        // ����ģ����Ϣ
        if(curTabIndex>=0)
        {
            for(var i=0;i<tabCount;i++)
            {
                if(oMPC.getTab(i).style.display=="none") continue;
                
                execScriptId = tabContentArray[i][EXEC_SCRIPT];
                isSelected = false;
                for(var j=0;j<execScriptInfo.length;j++)
                {
                    if(execScriptInfo.options[j].value==execScriptId)
                    {
                        isSelected = true;
                        break;
                    }
                }
                
                // ����ҵ��ˣ�����ԭ�в������ã�
                // ���δ�ҵ�������գ��������²���ֵ��
                if(!isSelected)
                {
                    setTabName(i);
                    execScriptId = execScriptInfo.value
                    tabContentArray[i][EXEC_SCRIPT] = execScriptId;
                    
                    setExecScriptParams(tabContentArray[i], execScriptId);
                }
            }
        }
        loadExecScriptInfo(isDisabled,isNeId);
    }
}

// 7. ***********************���������롰�����б� *****************************
function showAgentNeList()
{
    var agentId = agentNeInfo.value;
    
	var dialogsFeatures = "dialogWidth=720px;dialogHeight=540px;help=0;scroll=0;status=0;"
    window.showModalDialog("../agent_ne_index.htm",null,dialogsFeatures);
    
	//��������ɼ������б�
    xmlhttp.Open("POST", httpUrl+"tag=1", false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        var dXML = xmlhttp.responseXML;
        
        // ���´�����Ϣ
        reloadSelection(agentNeInfo, dXML.selectNodes("/root/rowSet"));
        agentNeInfo.add(document.createElement("OPTION"), 0);
        
        agentNeInfo.value = agentId;
        if(agentNeInfo.selectedIndex==-1) {agentNeInfo.selectedIndex=0;}
        
        agentNeInfo.style.width="";
        setTimeout(new function(){if(agentNeInfo.offsetWidth<150) {agentNeInfo.style.width=150;}}, 10);
        
        // ����ģ����Ϣ
        if(curTabIndex>=0)
        {
            for(var i=0;i<tabCount;i++)
            {
                if(oMPC.getTab(i).style.display=="none") continue;
                
                agentId = tabContentArray[i][AGENT_NE];
                isSelected = false;
                for(var j=0;j<agentNeInfo.length;j++)
                {
                    if(agentNeInfo.options[j].value==agentId)
                    {
                        isSelected = true;
                        break;
                    }
                }
                
                // ����ҵ��ˣ�����ԭֵ��
                // ���δ�ҵ�������´���
                if(!isSelected)
                {
                    agentId = agentNeInfo.value
                    tabContentArray[i][AGENT_NE] = agentId;
                }
            }
        }
    }
}

// 8. ִ�нű�
function configExecScript(neTypeId, neId, scriptType, isDisabled,isNeId,execScript)
{
	var dialogsFeatures = "dialogWidth=800px;dialogHeight=600px;help=0;scroll=0;status=0;"
    window.showModalDialog("../../execscript/exec_script_list.html",execScript,dialogsFeatures);
    reloadExecScript(neTypeId, neId, scriptType, isDisabled,isNeId);
}

// 9. ��֤����
function checkData(execScriptId, sampleIntervalValue, stateDateVal, endDateVal)
{
    // (1). �ɼ��ű�����Ϊ��
    if(execScriptId=="") {MMsg("�Բ�����ѡ��ɼ�����");execScriptInfo.focus();return false;}
    
    // (2). ��������
    sampleIntervalValue = ((sampleIntervalValue!="")?parseFloat(sampleIntervalValue):"");
    if(sampleIntervalValue.length==0){MMsg("�Բ���������\"��������\"��");sampleInterval.focus();return false;}
    if(sampleIntervalValue<=0) {MMsg("�Բ�������\"��������\"���������0������");sampleInterval.focus();return false;}
    
    // (3). ��֤ʱ��
    if(stateDateVal!=DEFAULT_DATE && endDateVal!=DEFAULT_DATE)
    {
        var tempStartDate = stateDateVal.replace(/AA/g, "00");
        var tempEndDate = endDateVal.replace(/AA/g, "00");
        if(tempStartDate>tempEndDate) {MMsg("�Բ���\"��ʼʱ��\"ҪС��\"����ʱ��\"��");return false;}
    }
    return true;
}



//---------------------------------------------------------------------
//---------- ����ģ������ ------------------------------------------------
//---------------------------------------------------------------------
// 2.1. ����ģ�� (�ȳ�ʼ�� --> ��ģ��)
function initPageModel(isNeId,isReflesh)
{
    xmlhttp.Open("POST", httpUrl+"tag=15&neTypeId="+neTypeId+"&taskSuiteModelId="+taskSuiteModelId+"&neId="+neId+"&scriptType="+scriptType, false);
    //alert(httpUrl+"tag=15&neTypeId="+neTypeId+"&taskSuiteModelId="+taskSuiteModelId+"&neId="+neId+"&scriptType="+scriptType)
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        var dXML = xmlhttp.responseXML;
        //(1). �����б�
        reloadSelection(execScriptInfo, dXML.selectNodes("/root/EXEC_SCRIPTS/rowSet"));
        loadExecScript(dXML.selectNodes("/root/EXEC_SCRIPTS/EXEC_SCRIPT"));
        //alert(execScriptObject[execScriptInfo.value][EXEC_SCRIPT_ID].length);
        //(2). ������Ԫ
        reloadSelection(agentNeInfo, dXML.selectNodes("/root/AGENT_NES/rowSet"));
        if(agentNeInfo.value!="")
        {
            agentNeInfo.add(document.createElement("OPTION"), 0);
            agentNeInfo.selectedIndex=0;
        }
        //(3). ʱ�䵥λ
        reloadSelection(timeUnits, dXML.selectNodes("/root/TIME_UNITS/rowSet"));
        //(4). ��ʼ��"��"��"��"
        initDateTime();
        //(5). ��ʼ��������
        var msg = dXML.selectSingleNode("/root/Msg");
        if(taskSuiteModelId!=null && taskSuiteModelId.length>0 && msg!=null)
        {
            if(!isWizard)
            {
                updateButton.value = "������";
                oNeType.readOnly = true;
                
                modelName.value = msg.selectSingleNode("MODEL_NAME").text;
                neTypeId = msg.selectSingleNode("NE_TYPE_ID").text;
                xmlhttp.Open("POST","../../../servlet/NECustomViewAction?action=39&viewId=1&itemType=FROM_CI_VIEW_CLASS&ciId="+neTypeId,false);
                xmlhttp.send();
                if(isSuccess(xmlhttp))
                {
              	  oNeType.value = xmlhttp.responseXML.selectSingleNode("/root/itemId").text;
                }
                //oNeType.value = neTypeId;
                if(isPublish.value==msg.selectSingleNode("IS_PUBLISHED").text) isPublish.checked = true;
                else isPrivate.checked = true;
                creatorName.innerHTML = msg.selectSingleNode("CREATOR").text;
                state = msg.selectSingleNode("STATE").text;
                stateCN.innerHTML = msg.selectSingleNode("STATE_CN").text;
                stateDate.innerHTML = msg.selectSingleNode("STATE_DATE").text;
            }
            
            // ��������ģ��
            loadTaskModel(dXML.selectNodes("/root/TASK_MODELS/rowSet"),isNeId,isReflesh);
        }else
        {
            if(agentNeId!="") agentNeInfo.value = agentNeId;
            tabContentArray[0] = getNewTabContent();
            changeExecScriptInfo(isNeId);
        }
        if(!isReflesh){
        	addNewPage(true,isNeId);
        }
        oMPC.selectedIndex = 0;
    }
}

function loadExecScript(oRows)// ���롰�ű���
{
    execScriptObject = new Object();
    
    var oItem;
    var oExecScript;
    var execScriptId;
    for(var i=0;i<oRows.length;i++)
    {
        oItem = oRows[i];
        oExecScript = new Object();
        execScriptId = oItem.selectSingleNode("Msg/EXEC_SCRIPT_ID").text;
        oExecScript[EXEC_SCRIPT_ID] = execScriptId;
        oExecScript[EXEC_NAME] = oItem.selectSingleNode("Msg/EXEC_NAME").text;
        oExecScript[NE_TYPE_NAME] = oItem.selectSingleNode("Msg/NE_TYPE_NAME").text;
        oExecScript[SCRIPT_TYPE] = oItem.selectSingleNode("Msg/SCRIPT_TYPE").text;
        oExecScript[EXEC_CONTENT] = oItem.selectSingleNode("Msg/EXEC_CONTENT").text;
        oExecScript[REMARK] = oItem.selectSingleNode("Msg/REMARK").text;
        //ssy 3-12 ��� oExecScript[EXEC_NAME_CN]
        oExecScript[EXEC_NAME_CN] = oItem.selectSingleNode("Msg/EXEC_NAME_CN").text;
        oExecScript[EXEC_SCRIPT_PARAM] = loadExecScriptParams(oItem.selectNodes("EXEC_SCRIPT_PARAMS/rowSet"));
        
        execScriptObject[execScriptId] = oExecScript;
    }
}

function loadExecScriptParams(oRows)// ���롰�ű�������
{
    var oItem;
    var oParamArray = new Array();
    var oParam;
    var tempValue;
    for(var i=0;i<oRows.length;i++)
    {
        oItem = oRows[i];
        //alert(oItem.xml)
        oParam = new Object();
        oParam[EXEC_SCRIPT_ID] = oItem.selectSingleNode("EXEC_SCRIPT_ID").text;
        tempValue = oItem.selectSingleNode("PARAM_DESC").text;
        var neTypeAttr=oItem.selectSingleNode("NE_TYPE_ATTR_ID").text;
        //var groupId=oItem.selectSingleNode("ATTR_GROUP_ID").text
        if(tempValue==null || typeof tempValue=="undefined" || tempValue.length==0) tempValue = oItem.selectSingleNode("PARAM_NAME").text;
        oParam[PARAM_DESC] = tempValue;
        oParam[REMARK] = oItem.selectSingleNode("REMARK").text;
        oParam[NE_TYPE_ATTR_ID] = neTypeAttr;
        //oParam[ATTR_VALUE_TYPE_ID] = oItem.selectSingleNode("ATTR_VALUE_TYPE_ID").text;
        tempValue = oItem.selectSingleNode("PARAM_VALUE").text;
        oParam[PARAM_VALUE] = tempValue;
        tempValue = (tempValue!=""?tempValue:oItem.selectSingleNode("DEFAULT_VALUE").text);
        oParam[DEFAULT_VALUE] = tempValue;
        oParam[SEQ] = oItem.selectSingleNode("SEQ").text;
        oParam[IS_PASSWORD] = oItem.selectSingleNode("IS_PASSWORD").text;
		//oParam[ATTR_GROUP_ID]=groupId;
		oParam[PROP_VALUE]=oItem.selectSingleNode("PROP_VALUE").text;
		if(neTypeAttr == null || neTypeAttr =="")
		{
		    oParam[DISABLED]="";
        }
        /*else if(groupId!=null && groupId=="3")
        {
            oParam[DISABLED]="disabled";
        }*/
        else
        {
            oParam[DISABLED]="disabled";
        }
        oParamArray[i] = oParam;
    }
    return oParamArray;
}

function loadTaskModel(oRows,isNeId,isReflesh)// ���롰ģ�塱
{
    var oItem;
    var tabContent;
    var execScriptId;
    var agentId = agentNeId;
    for(var i=0;i<oRows.length;i++)
    {
        oItem = oRows[i];
        execScriptId = oItem.selectSingleNode("EXEC_SCRIPT_ID").text;
        
        tabContent = new Object();
        if(agentId=="")
        {
            setTabContent(tabContent,
                          oItem.selectSingleNode("TASK_MODEL_ID").text,
                          execScriptId,
                          oItem.selectSingleNode("AGENT_ID").text,
                          oItem.selectSingleNode("SAMPLING_INTERVAL_NUM").text,
                          oItem.selectSingleNode("TIME_UNIT").text,
                          oItem.selectSingleNode("SAMPL_START_POINT").text,
                          oItem.selectSingleNode("SAMPL_END_POINT").text
                         );
        }else
        {
            setTabContent(tabContent,
                          oItem.selectSingleNode("TASK_MODEL_ID").text,
                          execScriptId,
                          agentId,
                          oItem.selectSingleNode("SAMPLING_INTERVAL_NUM").text,
                          oItem.selectSingleNode("TIME_UNIT").text,
                          oItem.selectSingleNode("SAMPL_START_POINT").text,
                          oItem.selectSingleNode("SAMPL_END_POINT").text
                         );
        }
        
        setExecScriptParams(tabContent, execScriptId);
        tabContentArray[i] = tabContent;
        
        if(i>0 && !isReflesh)
        {
            addNewPage(false,isNeId);
        }
        setTabName(i, oItem.selectSingleNode("EXEC_NAME").text);
    }
    showTabContent(0,isNeId);
}

function setExecScriptParams(tabContent, execScriptId)// ת����������
{
    if(execScriptId=="") return;
    
    var oParam = new Object();
    var oParamArray = execScriptObject[execScriptId][EXEC_SCRIPT_PARAM];
    for(var j=0;j<oParamArray.length;j++)
    {
        oParam[oParamArray[j][SEQ]] = oParamArray[j][DEFAULT_VALUE];
    }
    tabContent[EXEC_SCRIPT_PARAM] = oParam;
}

function setTabContent(tabContent, taskModelId, execScriptId, agentId, 
                       sampleIntervalValue, timeUnint, sampleStartTime, sampleEndTime)// ת����ģ�塱
{
    tabContent[TASK_MODEL_ID] = taskModelId;
    tabContent[EXEC_SCRIPT] = execScriptId;
    tabContent[AGENT_NE] = agentId;
    tabContent[SAMPLE_INTERVAL] = sampleIntervalValue;
    tabContent[TIME_UNIT] = timeUnint;
    tabContent[SAMPLE_START_TIME] = sampleStartTime;
    tabContent[SAMPLE_END_TIME] = sampleEndTime;
}

// 2.2. ��� -- ����
function changeExecScriptInfo(isNeId)
{
    setTabName(oMPC.selectedIndex);
    loadExecScriptInfo(!isWizard,isNeId);
}


// 2.3. ��ӷ�ҳ -- ��ӡ����
function addNewPage(isAddNewModel,isNeId)
{
    var oPage=document.createElement("IE:page");
    oPage.TABTEXT = "��������>><span style='height:20px;'></span>";
    oPage.TABTITLE="";
    oPage.innerHTML='';
    oPage.iIndex= (++tabCount);
    if(isAddNewModel) oPage.onfocus=function(){showLastPage(this,isNeId);};
    else oPage.onfocus=function(){saveAndShowTabContent(isNeId);}//{execContentMessage = document.getElementById("oTakModel_"+oPage.uniqueID).all("execContent");};
    oMPC.addPage(oPage);
}

function showLastPage(oTab,isNeId)
{
    if(!saveTabContent()) return;
    
    curTabIndex = oMPC.selectedIndex;
    clearPageContent();
    setTabName(curTabIndex);
    tabContentArray[curTabIndex] = getNewTabContent();
    loadExecScriptInfo(!isWizard,isNeId);
    
    oTab.onfocus = function(){saveAndShowTabContent(isNeId)};
    
    addNewPage(true,isNeId);
}

function clearPageContent()//���ģ�����ã�������������
{
    execScriptInfo.selectedIndex = 0;
    //agentNeInfo.selectedIndex = 0;
    sampleInterval.value = "";
    timeUnits.selectedIndex = 0;
    sampleStartMonth.value = "";
    sampleStartDay.value = "";
    sampleStartHour.value = "";
    sampleStartMinute.value = "";
    sampleEndMonth.value = "";
    sampleEndDay.value = "";
    sampleEndHour.value = "";
    sampleEndMinute.value = "";
}

function getNewTabContent()// �½���ҳ����
{
    var tabContent = new Object();
    tabContent[TASK_MODEL_ID] = "";
    tabContent[EXEC_SCRIPT] = execScriptInfo.value;
    tabContent[AGENT_NE] = agentNeInfo.value;
    tabContent[SAMPLE_INTERVAL] = "";
    tabContent[TIME_UNIT] = timeUnits.value;
    tabContent[SAMPLE_START_TIME] = "";
    tabContent[SAMPLE_END_TIME] = "";
    if(tmpParams!=null&&tmpParams!='undefined') {
       tabContent[EXEC_SCRIPT_PARAM] = tmpParams;
    }else {
       setExecScriptParams(tabContent, execScriptInfo.value);
    }
    return tabContent;
}

function setTabName(curIndex, tabName)//���ñ�ǩҳ����
{
    if(!tabName)
    {
        if(execScriptInfo.selectedIndex==-1) tabName = "";
        else tabName = execScriptInfo.options[execScriptInfo.selectedIndex].text;
    }
    
    oMPC.getTab(curIndex).childNodes[0].innerHTML = 
            tabName + "&nbsp;<img src='../../../resource/image/del.gif' style='cursor:hand' onclick='deleteTaskModel("+curIndex+");'>";
}



// 3.4. ɾ����ҳ -- ɾ������ʾ��һ��ҳ��
function deleteTaskModel(curIndex)
{
    if(!curIndex) curIndex = oMPC.selectedIndex;
    oMPC.getTab(curIndex).style.display = "none";
    
    if(curTabIndex == curIndex) showNextTab(curIndex, 1);
}

function showNextTab(iIndex, interval)
{
    var nextIndex = iIndex + interval;
    if(nextIndex<0)
    {
        oMPC.selectedIndex = tabCount;
        return;
    }
    
    var oTab = oMPC.getTab(nextIndex);
    if(oTab.style.display=="none")
    {
        showNextTab(nextIndex, interval);
    }else
    {
        if(nextIndex==tabCount)
        {
            showNextTab(iIndex, -interval);
        }else
        {
            oMPC.selectedIndex = nextIndex;
        }
    }
}

function DuplateParamsToAll()
{
    if(curTabIndex<0){curTabIndex=oMPC.selectedIndex;return false;}
    if(oMPC.getTab(oMPC.selectedIndex).style.display=="none"){oMPC.selectedIndex=curTabIndex;return false;}
    if(oMPC.getTab(curTabIndex).style.display=="none"){return true;}    
    var tabContent = tabContentArray[curTabIndex];
    if(isWizard)  { 
    	var _Param = saveExecScriptParams(tabContent);
    	if(tmpParams) tmpParams = null;
      tmpParams = new Object();
      tmpParams = _Param;
      for(var i=0;i<tabCount;i++)
      {
        var tmpContent = tabContentArray[i];
        tmpContent[EXEC_SCRIPT_PARAM] = _Param;
      }
      MMsg("�������!");
    }
}

// 2.4. ���桢��ʾ����
function saveTabContent()
{
    
    // (1). �����ѡ�б�ǩ�������豣��
    if(curTabIndex<0){curTabIndex=oMPC.selectedIndex;return false;}
    
    // (2). ���Ҫɾ���������ǩ���ߵ�ǰ��ǩ�����豣�档
    if(oMPC.getTab(oMPC.selectedIndex).style.display=="none"){oMPC.selectedIndex=curTabIndex;return false;}
    if(oMPC.getTab(curTabIndex).style.display=="none"){return true;}
    //if(!checkChangeData()) {oMPC.selectedIndex=curTabIndex; return false;}
    var tabContent = tabContentArray[curTabIndex];
    setTabContent(tabContent,
                  tabContent[TASK_MODEL_ID],
                  execScriptInfo.value,
                  agentNeInfo.value,
                  sampleInterval.value,
                  timeUnits.value,
                  getDateTime(sampleStartMonth, sampleStartDay, sampleStartHour, sampleStartMinute),
                  getDateTime(sampleEndMonth, sampleEndDay, sampleEndHour, sampleEndMinute)
                 );
    
    if(isWizard) saveExecScriptParams(tabContent);
    return true;
}

function saveExecScriptParams(tabContent)
{
    var oParam = tabContent[EXEC_SCRIPT_PARAM];
    var datas = scriptParamTable.rows;
    var cellChilds;
    for(var j=0;j<datas.length-1;j+=2)
    {
        cellChilds = datas[j].cells[3].childNodes;
        oParam[cellChilds[cellChilds.length-1].value] = cellChilds[0].value.trimall();
    }
    return oParam;
}

function showTabContent(selectedIndex,isNeId)
{
    curTabIndex = selectedIndex;    
    var tabContent = tabContentArray[curTabIndex];
    if(!tabContent) return;
    execScriptInfo.value = tabContent[EXEC_SCRIPT];
    agentNeInfo.value = tabContent[AGENT_NE];
    sampleInterval.value = tabContent[SAMPLE_INTERVAL];
    timeUnits.value = tabContent[TIME_UNIT];
    settingDateTime(tabContent[SAMPLE_START_TIME], sampleStartMonth, sampleStartDay, sampleStartHour, sampleStartMinute);
    settingDateTime(tabContent[SAMPLE_END_TIME], sampleEndMonth, sampleEndDay, sampleEndHour, sampleEndMinute);    
    loadExecScriptInfo(!isWizard,isNeId);//if(isWizard){showExecScriptParams(selectedIndex);}
}

function saveAndShowTabContent(isNeId)
{
    var selectedIndex = oMPC.selectedIndex;
    if(curTabIndex==selectedIndex) return;
    // (1). ���浱ǰ��ǩҳ
    if(!saveTabContent()) return;    
    // (2). ��ʾѡ�б�ǩҳ
    showTabContent(selectedIndex,isNeId);
}

// 2.5. ��֤�Ƿ�������
function checkTaskSuiteData()
{
    var bCheck = true;
    var tabContent;
    var stateDateVal;
    var endDateVal;
    for(var i=0;i<tabCount;i++)
    {
        if(oMPC.getTab(i).style.display=="none") continue;        
        // ��֤��ģ����Ϣ��
        tabContent = tabContentArray[i];
        bCheck = checkData(tabContent[EXEC_SCRIPT], tabContent[SAMPLE_INTERVAL], tabContent[SAMPLE_START_TIME], tabContent[SAMPLE_END_TIME]);
        if(!bCheck)
        {
            oMPC.selectedIndex = i;
            return false;
        }        
        // ��֤���ű�������
        if(isWizard)
        {
            if(!checkExecScriptParams(tabContent, i)) return false;
        }
    }
    return true;
}

function checkExecScriptParams(tabContent, curIndex)
{
    var params = new Array();
    var paramItem;
    var isDisable;
    var datas = scriptParamTable.rows;
    var oParam = tabContent[EXEC_SCRIPT_PARAM];// ģ�����
    var oParamArray = execScriptObject[tabContent[EXEC_SCRIPT]][EXEC_SCRIPT_PARAM];//�ű�����
    var paramValue;
    if(oParamArray!=null && oParamArray.length>0)
    {
        for(var i=0;i<oParamArray.length;i++)
        {
	         paramValue = oParam[oParamArray[i][SEQ]];
	         isDisable=oParamArray[i][DISABLED];
	         if(isDisable=="")
	         {
	            if(paramValue!=null && paramValue.length>0)
	            {
	            /*
	                if(paramValue.indexOf(" ")!=-1)
	                {
	                    oMPC.selectedIndex = curIndex;
	                    MMsg("�Բ���\""+oParamArray[i][PARAM_DESC]+"\"��ֵ���ܺ��пո�");
	                    datas[i*2].cells[3].childNodes[0].focus();
	                    //MMsg("�Բ�������������\""+oMPC.getTab(curIndex).childNodes[0].innerText+"\"�Ĳ�����Ϣ��");
	                    return false;
	                }
	            */
	            }else
	            {
	                oMPC.selectedIndex = curIndex;
	                MMsg("�Բ���������\""+oParamArray[i][PARAM_DESC]+"\"��ֵ��");
	                datas[i*2].cells[3].childNodes[0].focus();
	                //MMsg("�Բ�������������\""+oMPC.getTab(curIndex).childNodes[0].innerText+"\"�Ĳ�����Ϣ��");
	                return false;
	            }
	         }
        }
    }
    return true;
}

function showExecContent() {
	if(execScriptInfo && execScriptInfo.selectedIndex != -1) {
		var myExecScriptId = execScriptInfo.options[execScriptInfo.selectedIndex].value;
		
		var object = {
			oData:{doRefresh:function(){reloadExecScript(neTypeId, neId, scriptType, false,true);} },
			action:2,
			scriptId:myExecScriptId
		}
		
		window.showModalDialog("../../execscript/scriptInfo.html",object,"dialogWidth=660px;dialogHeight=630px;help=0;scroll=0;status=0;");
		
	}
}

//---------------------------------------------------------------------
//---------- �������ú��� ------------------------------------------------
//---------------------------------------------------------------------
//3-1. ���ܣ�����������ֵ,�����ж��ڹ涨�ķ�Χ��
//     ���룺(1).���̵ļ�ֵ
//     �����true/false
function inputNumber(keyCode)
{
    if((keyCode>47 && keyCode<58) || (keyCode==8) || (keyCode==46) )//(Backspace��)||(Delete��)
    {
          return true;
    }
    else
    {
          return false;
    }
}
//3-2. ���ܣ���"����ʱ��"�ֽ⵽"���ڡ�ʱ���֡���"����
//     ���룺(1).����ʱ��(yyyymmddhhmmss), (2).�¶���, (3)�ն���, (4).Сʱ����, (5).���Ӷ���
//     �����(��)
function settingDateTime(dateTimeValue, monthObj, dayObj, hourObj, minuteObj)
{
    if(dateTimeValue!=null && typeof dateTimeValue!="undefined" 
       && dateTimeValue.length==14 && dateTimeValue!=DEFAULT_DATE)
    {
        setDateTimeValue(monthObj, dateTimeValue.substring(4, 6));
        setDateTimeValue(dayObj, dateTimeValue.substring(6, 8));
        setDateTimeValue(hourObj, dateTimeValue.substring(8, 10));
        setDateTimeValue(minuteObj, dateTimeValue.substring(10, 12));
    }else
    {
        monthObj.value = "";
        dayObj.value = "";
        hourObj.value = "";
        minuteObj.value = "";
    }
}
function setDateTimeValue(dateObj, dateTimeValue)
{
    if(dateTimeValue!="AA")
    {
        dateObj.value = dateTimeValue;
    }else
    {
        dateObj.value = "";
    }
}
//3-3. ���ܣ���"���ڡ�ʱ���֡���"�������Ϊ"����ʱ��"
//     ���룺(1).���ڶ���, (2).Сʱ����, (3).���Ӷ���, (4).�����
//     ���������ʱ��(yyyymmddhhmmss)
function getDateTime(monthObj, dayObj, hourObj, minuteObj, secondObj)
{
    return "AAAA" + getDateTimeValue(monthObj.value) + getDateTimeValue(dayObj.value) + 
           getDateTimeValue(hourObj.value) + getDateTimeValue(minuteObj.value) + "AA";
}
function getDateTimeValue(inputStr)
{
    if(inputStr.length==0) {return "AA";}
    else if(inputStr.length==1) {return "0"+inputStr;}
    return inputStr;
}
//3-4. ���ܣ���ʼ������������
//     ���룺(1).������, (2).����
function initDateTimeSelection(selectionObj, startNum, endNum, val)
{
    var oOption;
    var i=0;
    var interval = (val!=null && typeof val!="undefined")?val:1;
    //(1). �������
    var iLen = selectionObj.length;
    for(i=iLen-1;i>=0;i--){
        selectionObj.options.remove(i);
    }
    //(2). Ĭ��ѡ��
    selectionObj.add(document.createElement("OPTION"));
    //(3). ����ѡ��
    for(i=startNum;i<=endNum;i=i+interval)
    {
        oOption = document.createElement("OPTION");
        if(i<10){oOption.value = "0"+i;}
        else{oOption.value = i;}
        oOption.text = i;
        selectionObj.add(oOption);
    }
}

//3-5. ���ܣ���֤�Ƿ�Ϊ��ֵ
//     ���룺(1). ����
function checkIsFloat(obj){
	try{
		if(obj.value=="") return;
		var value = parseFloat(obj.value);
		if(value == null) {
			EMsg("ֻ��������ֵ!");
			obj.focus();
		}

		if(event.keyCode!=37 && event.keyCode!=38 && event.keyCode!=39 && event.keyCode!=40)
		{
		  if(event.keyCode!=190 && event.keyCode!=48)//��"."/"0"ʱ
		  {
		    obj.value = value;
		  }
		  else if(obj.value.indexOf(".")>0 && obj.value.indexOf(".")<obj.value.length-1 && event.keyCode!=48)//"."������ǰ�����
		  {
			obj.value = value;
		  }
		  obj.value = obj.value.replace("NaN","");
		}
		
	}catch(e){
			EMsg("ֻ��������ֵ!");
			obj.focus();
	}
}

//3-6. ���ܣ�����ӽڵ�
//     ���룺(1).ԭ�ڵ� (2).�����ڵ��� (3).�����ڵ�ֵ (4).���������� (5).����ֵ����
function addNewNode(infoNode, nodeName, nodeValue, attrNameArr, attrValueArr)
{
    if(nodeName==null) return;
    
    var dXML = infoNode.ownerDocument;
    var itemNode = dXML.createElement(nodeName);
    if(nodeValue!="") itemNode.text = nodeValue;
       
    if(attrNameArr!=null)
    {
        for(var i=0;i<attrNameArr.length;i++)
        {
              itemNode.setAttribute(attrNameArr[i], attrValueArr[i]);
        }
    }
    infoNode.appendChild(itemNode);
    return itemNode;
}