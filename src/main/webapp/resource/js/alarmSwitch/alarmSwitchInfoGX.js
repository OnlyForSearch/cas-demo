var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var sendXML = new ActiveXObject("Microsoft.XMLDOM");
var regionRoot = new ActiveXObject("Microsoft.XMLDOM");
var levelRoot = new ActiveXObject("Microsoft.XMLDOM");

var root;

var url = "../../servlet/AlarmTransConfigGXServlet?";

var action;
var parentHandle;
var switchCfgId;

var iniSwitchXML = new ActiveXObject("Microsoft.XMLDOM");
var iniRegionHTML = "";
var iniAlarmLevel = "";
var iniBusiSysHTML = "";
var iniNeId = "";

var isChgLevel = false;
var isLoadRegion = false;
var isLoadBusiSys = false;
var isLoadNeId = false;
var isClearBusiSys = false;

var isSubmitSwitch = false;
var isSubmitRegion = false;
var isSubmitLevel  = false;
var isSubmitBusiSys = false;
var isSubmitNeId = false;
var isSubmitKPI = false;

var tagName;

//add by chenjw
var currentNeId;
var globalMap = new Map();

function iniPage() {
	parentHandle = window.dialogArguments;
	action = parentHandle.params[0];
	switchCfgId = parentHandle.params[1];
	
	if(action ==0) {
		add();
	} else {
		edit();
	}
	
	iniSwitchXML.load(SwitchMsg.XMLDocument);
	
	//1.��ʼ���澯�������
	//setSwitchLevel();
	
	//2.��ʼ��ϵͳ��
	neTree = new XMLTree();
	neTree.xmlUrl = url + 'tag=20&neId=4&isBuildTree=1';
	neTree.isDynamicLoad = true;
	neTree.setDynamicLoadAction(new DynamicLoadAction());
	//neTree.setPretreatmentAction(new newTree());
	neTree.isRightFireOnClick = false;
	neTree.setDblClickAction(new DblClickAction());
	
	//3.�ѹ鵵���أ���������
	setSwitchPrivilege();
	
	root = sendXML.createElement("Submit");
	sendXML.appendChild(root);
}

function add() {
	//1.����ֻ�ڱ༭����ʾ����Ϣ
	var i = 0;
	for(;i<display_tag.length;i++) {
		 display_tag[i].style.display = "none";
	}
	
}

function setSwitchLevel() {
	var staff_id = SwitchMsg.XMLDocument.selectSingleNode("/Msg/CREATE_STAFF_ID").text;
	
	if(staff_id != 1) {//ֻ�й���Ա������ͨ�ÿ���
		switchLevel.options.remove(0);
	}
	
	//��ʼ����ʾ��ҳ�棬ֻ��������ͨ�ÿ���ʱ����ʾ���򡢼���ҳ��
	if(SwitchMsg.XMLDocument.selectSingleNode("/Msg/ALARM_SWITCH_LEVEL").text == "0") {
		oRegion.display = "";
		oBusiSys.display = "none";
		oNeId.display = "none";
	}
	
	switchLevel.disabled = false;
}

function setSwitchPrivilege() {
	if(action == 1) {
		var state = SwitchMsg.XMLDocument.selectSingleNode("/Msg/STATE").text;
		if(state.trimall() == "�鵵") {
			enterButton.disabled = "true";
			applyButton.disabled = "true";
			enterButton.insertAdjacentHTML("beforeBegin","<font color='red'>�������޸Ĺ鵵��Ϣ</font>&nbsp;&nbsp;&nbsp;");
		} /*else if(SwitchMsg.XMLDocument.selectSingleNode("/Msg/ALARM_SWITCH_LEVEL").text == 0 && currUser.value != 1) {//admin����Ȩ���޸�ͨ�ù���
			enterButton.disabled = "true";
			applyButton.disabled = "true";
			enterButton.insertAdjacentHTML("beforeBegin","<font color='red'>�������Admin�û��޸�ͨ�ù���</font>&nbsp;&nbsp;&nbsp;");
		} else if(currUser.value != 1) {
			switchLevel.disabled = true;
		}*/
	}
}

function edit() {
	var paramArray = new Array();
	paramArray.push("tag="+3);
	paramArray.push("id="+switchCfgId);
	xmlhttp.open("post",url+paramArray.join("&"),false);
	xmlhttp.send();
	if(isSuccess(xmlhttp)) {
		SwitchMsg.XMLDocument.load(getMsgXML(xmlhttp.responseXML));
		validDate.value = SwitchMsg.XMLDocument.selectSingleNode("/Msg/VALID_DATE").text;
		cancelDate.value = SwitchMsg.XMLDocument.selectSingleNode("/Msg/CANCEL_DATE").text;
	} else {
		window.close();
	}
}

function enter() {
	var isOK = apply();
	if((action==1&&!isSubmitSwitch&&!isSubmitRegion&&!isSubmitLevel) || isOK)
	{
		window.close();
	}
}

function apply() {
	if(validDate.value != SwitchMsg.XMLDocument.selectSingleNode("/Msg/VALID_DATE").text) {
		SwitchMsg.XMLDocument.selectSingleNode("/Msg/VALID_DATE").text = validDate.value;
	}
	if(cancelDate.value != SwitchMsg.XMLDocument.selectSingleNode("/Msg/CANCEL_DATE").text) {
		SwitchMsg.XMLDocument.selectSingleNode("/Msg/CANCEL_DATE").text = cancelDate.value;
	}
	
	isSubmitSwitch = submitSwitchMsg();
	isSubmitRegion = submitRegionMsg();
	isSubmitLevel  = submitAlarmLevelMsg();
	isSubmitBusiSys = submitBusiSysMsg();
	isSubmitNeId = submitNeId();
	isSubmitKPI = submitKPI();
	if((action==0||isSubmitSwitch||isSubmitRegion||isSubmitLevel||isSubmitBusiSys||isSubmitNeId || isSubmitKPI) && checkData()) {
		var paramArray = new Array();
		var actionTag = (action==0)?1:4;
		xmlhttp.Open("POST",url+"tag="+actionTag,false);
		xmlhttp.send(sendXML);
		if(isSuccess(xmlhttp)) {
			if(action==0) {
				addSuccess();
			} else {
				editSuccess();
			}
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
	
}

function checkData() {
	if(!switchName.value.hasText()) {
		EMsg("�������Ʋ���Ϊ��!");
		return false;
	}
	if(!validDate.value.hasText()) {
		EMsg("��Ч���ڲ���Ϊ��!");
		return false;
	}
	if(!cancelDate.value.hasText()) {
		EMsg("ʧЧ���ڲ���Ϊ��!");
		return false;
	}
	return true;
}

function addSuccess() {
	MMsg("���ӳɹ���");
	
	if(isSubmitSwitch) {
		parentHandle.oData.doRefresh(false);
		SwitchMsg.XMLDocument.load(iniSwitchXML);
		validDate.value = "";
		cancelDate.value = "";
	}
	if(isSubmitRegion || isSubmitLevel) {
		isLoadRegion = false;
		setBlankAlarmLevel();
	}
	if(isSubmitBusiSys) {
		isLoadBusiSys = false;
	}
	if(isSubmitNeId) {
		isLoadNeId = false;
	}
}

function editSuccess() {
	MMsg("�޸ĳɹ���");
	
	parentHandle.oData.doRefresh(false);
	if(isSubmitSwitch) {
		iniSwitchXML.load(SwitchMsg.XMLDocument);
	}
	if(isSubmitRegion) {
		iniRegionHTML = selectedRegion.getObject().innerHTML;
	}
	if(isSubmitLevel) {
		iniAlarmLevel = getAlarmLevel();
	}
	if(isSubmitBusiSys) {
		iniBusiSysHTML = configTarget.getObject().innerHTML;
	}
	if(isSubmitNeId) {
		iniNeId = getSelectedNeId();
	}
}

//�Ƿ��޸��˻�����Ϣ
function submitSwitchMsg() {
	tagName = "SwitchMsg";
	removeNode(root,tagName);
	
	if(SwitchMsg.XMLDocument.xml != iniSwitchXML.xml) {
		var switchElement = createNode(root,tagName);
		if(switchElement != null) {
			switchElement.appendChild(SwitchMsg.XMLDocument.documentElement.cloneNode(true));
		}
		return true;
	} else {
		return false;
	}
}

//�Ƿ��޸�������
function submitRegionMsg() {
	tagName = "RegionMsg";
	removeNode(root,tagName);
	
	if((isLoadRegion && iniRegionHTML != selectedRegion.getObject().innerHTML) || isChgLevel) {
		if(root.selectSingleNode(tagName) == null) {
			var regionElement = createNode(root,tagName);
			regionElement.setAttribute("id", switchCfgId);
			if(regionElement != null) {
				selectedRegion.getXmlNode(regionElement,"Region");
			}
		}
		return true;	} else {
		return false;
	}
}

//�Ƿ��޸ļ���
function submitAlarmLevelMsg() {
	tagName = "LevelMsg";
	removeNode(root,tagName);
	
	if((isLoadRegion && iniAlarmLevel != getAlarmLevel())|| isChgLevel) {
		var levelElement = createNode(root,tagName);
		if(levelElement != null) {
			levelElement.setAttribute("id", switchCfgId);
			levelElement.text = getAlarmLevel();
		}
		return true;
	} else {
		return false;
	}
}

//�Ƿ��޸�ҵ��ϵͳ
function submitBusiSysMsg() {
	tagName = "BusiSysMsg";
	removeNode(root,tagName);
	
	if((isLoadBusiSys && iniBusiSysHTML != configTarget.getObject().innerHTML) || isChgLevel) {
		if(root.selectSingleNode(tagName) == null) {
			var busiSysElement = createNode(root,tagName);
			busiSysElement.setAttribute("id", switchCfgId);
			if(busiSysElement != null) {
				configTarget.getXmlNode(busiSysElement,"BusiSys");
			}
		}
		return true;
	} else {
		return false;
	}
}

//�Ƿ��޸���Ԫ
function submitNeId() {
	tagName = "NeIdMsg";
	removeNode(root, tagName);
	
	if((isLoadNeId && iniNeId != getSelectedNeId()) || isChgLevel) {
		var neIdElement = createNode(root, tagName);
		if(neIdElement != null) {
			neIdElement.setAttribute("id", switchCfgId);
			neIdElement.text = getSelectedNeId();
		}
		return true;
	} else {
		return false;
	}
}

//�޸ĸ澯�������ʱ���¼�
function changeLevel() {
	//1.��Ҫ��ʾ������ˢ������
	if(MSG_YES == QMsg("�޸Ŀ������ͣ����������򡢼���ϵͳ����Ԫ����Ϣ���Ƿ��޸ģ�")) {
		if(switchLevel.options[switchLevel.selectedIndex].value == 1) {//����Ǵ�ͨ�ñ��Ϊ���⿪��
			//1.�������򼶱�ҳ��,��ʾϵͳ����Ԫҳ��
			oRegion.display="none";
			oBusiSys.display = "";
			oNeId.display = "";
			
			isLoadRegion = true;
			isLoadBusiSys = false;
			isLoadNeId = false;
			
			//2.������ѡ�����ֵ
			selectedRegion.getObject().options.length = 0;
			
			//3.������ѡ�񼶱��ֵ
			setBlankAlarmLevel();
		} else {
			oRegion.display = "";
			oBusiSys.display = "none";
			oNeId.display = "none";
			
			isLoadRegion = false;
			isLoadBusiSys = true;
			isLoadNeId = true;
			
			//������ѡϵͳ��ֵ����������Ϊ���ύ��ʱ����Ҫ����Щֵ��Ϊ�գ���Ϊ�Ѿ������ͨ�ÿ��أ���û����Щֵ�ģ����������ĸ�ֵ�Ǹ������ύ������ȡ�����Ǹ�������
			configTarget.getObject().options.length = 0;
			
			//������ѡ��Ԫ��ֵ
			selectedNe.innerHTML="";
		}
		
		isChgLevel = true;
	} else {
		event.isChange = false;
	}
	
}

//ѡ�������򡢼���ҳ��
function chooseRegion() {
	if(!isLoadRegion) {
		//1.��Ҫ��δѡ������ѡ����ֵ
		setRegion();
		//2.��Ҫ�Ը澯����ֵ
		setAlarmLevel();
		isLoadRegion = true;
	}
}

function setRegion() {
	if(action ==0) {
		unSelectedRegion.xmlsrc = url + "tag=11";
		selectedRegion.getObject().options.length = 0;
	} else {
		unSelectedRegion.xmlsrc = url + "tag=12&id=" + switchCfgId;
		selectedRegion.xmlsrc = url + "tag=13&id=" + switchCfgId;
		iniRegionHTML = selectedRegion.getObject().innerHTML;
	}
}

function setAlarmLevel() {
	if(action == 0) {
		setBlankAlarmLevel();
	} else {
		var paramArray = new Array();
		paramArray.push("tag="+14);
		paramArray.push("id="+switchCfgId);
		xmlhttp.open("post",url+paramArray.join("&"),false);
		xmlhttp.send();
		if(isSuccess(xmlhttp)) {
			iniAlarmLevel = xmlhttp.responseXML.selectSingleNode("/root/AlarmLevel").text;
			var alarmItems = iniAlarmLevel.split(",");
			var oAlarmLevel = document.getElementsByName("alarmLevel");
			for(var i=0;i<alarmItems.length&&!isNaN(alarmItems[i]);i++) {
				oAlarmLevel[alarmItems[i] - 1].checked = true;
			}
		}
	}
}

function setBlankAlarmLevel() {
	var oAlarmLevel = document.getElementsByName("alarmLevel");
	for(var i=0;i<oAlarmLevel.length;i++) {
		oAlarmLevel[i].checked = false;
	}
}


//��ȡ��ǰ��ѡ�еĸ澯�����ֵ������','�ָ�
function getAlarmLevel() {
	var alarmLevelHTML = "";
	var oAlarmLevel = document.getElementsByName("alarmLevel");
	for(var i =0;i < oAlarmLevel.length;i++) {
		if(oAlarmLevel[i].checked) {
			alarmLevelHTML += "," + oAlarmLevel[i].value;
		}
	}
	
	return alarmLevelHTML.replace(",","");
}

//��̬������
function DynamicLoadAction() {
	this.parent = new XMLTree_onDynamicLoad_Action
	this.parent.dynamicLoad = function(oItem)
	{
		return url + "tag=20&isBuildTree=0&neId=" + oItem.getAttribute("id");
	}
	return this.parent;
}

//�Զ����ʼ����
function newTree()
{
	this.parent = new XMLTree_onBeforeXMLTrans_Action
	this.parent.pretreatment = function(oDoc)
	{
		var menuRoot = oDoc.selectSingleNode("/root/Menu");
		var oNode = oDoc.selectSingleNode("//MenuItem[@moduleID=4]");
		menuRoot.appendChild(oNode);
		menuRoot.removeChild(menuRoot.childNodes[0]);
		var oNodeList = oDoc.selectNodes("//MenuItem[@tag=6 and ../@tag=6]");
		oNodeList.removeAll();
		return oDoc;
	}
	return this.parent;
}

//˫���¼�
function DblClickAction()
{
	this.parent = new XMLTree_onDblClick_Action;
	this.parent.dblclick = function(oItem)
	{
		document.getElementById("addOneConfig").click();
	}
	return this.parent;
}

function addSelected(oTargetSelect,isOnly)
{
	var oItem = neTree.getSelectedItem();
	var oTarget = oTargetSelect.getObject();
	var oOption = document.createElement("OPTION");
	oOption.text = oItem.innerText;
	oOption.value = oItem.id;
	
	var oSelect = configTarget.getObject();	
	var flag=0;
	for(var i=0;i<oSelect.options.length;i++)
	{
		if(oSelect.options[i].value==oOption.value)
			flag=1;
	}
	if(flag==0)
		oTarget.add(oOption);
}

function chooseBusiSys() {
	if(!isLoadBusiSys) {
		neTree.showAt(neTreeDiv)
		setBusiSys();
		isLoadBusiSys = true;
	}
}

function setBusiSys() {
	if(action ==0) {
		configTarget.getObject().options.length = 0;
	} else {
		configTarget.xmlsrc=url + "tag=15&id=" + switchCfgId;
		iniBusiSysHTML = configTarget.getObject().innerHTML;
	}
}

function chooseNe() {
	if(!isLoadNeId) {
		setNe();
		isLoadNeId = true;
	}
}

function setNe() {
	if(action ==0) {
		selectedNe.innerHTML = "";
	} else {
		var paramArray = new Array();
		paramArray.push("tag=" + 18);
		paramArray.push("id=" + switchCfgId);
		
		xmlhttp.open("POST",url + paramArray.join('&'),false);
		xmlhttp.send();
		
		if(isSuccess(xmlhttp)) {
			var neIdText = "";
			var neMsg = xmlhttp.responseXML.selectNodes("//rowSet");
			for(var i=0;i<neMsg.length;i++) {
				var id = neMsg[i].getAttribute("id");
				var neText = neMsg[i].text;
				
				selectedNe.appendChild(createSelectDiv(id,neText));
				//������ѡ��Ԫ��ʼֵ���û��ж��Ƿ������޸�
				neIdText += "," + id;
			}
			
			iniNeId = neIdText.replace(",","");
		} 
	}
}

function doNeSearch() {
	showWait();
	
	setTimeout("doSearch()",100);
}

function doSearch() {
	var paramArray = new Array();
	paramArray.push("tag=" + 17);
	paramArray.push("regionId="  + regionId.value);
	paramArray.push("neTypeId=" + neTypeId.value);
	paramArray.push("neBusiId=" + neBusiId.value);
	paramArray.push("neId=" + neId.value);
	
	xmlhttp.open("POST",url + paramArray.join('&'),false);
	xmlhttp.send();
	
	if(isSuccess(xmlhttp)) {
		delAllChildNodes(unSelectedNe);
		var neMsg = xmlhttp.responseXML.selectNodes("//rowSet");
		for(var i=0;i<neMsg.length;i++) {
			var id = neMsg[i].getAttribute("id");
			var neText = neMsg[i].text;
			
			if(!isExist(id,selectedNe)) {
				unSelectedNe.appendChild(createSelectDiv(id,neText));
			}
		}
	}
}

//�ж�sIdֵ�Ƿ��Ѵ�����dDivObj�У��Ƿ���true�����򷵻�false
function isExist(sId,dDivObj) {
	var j=0;
	
	var dDivChilds = dDivObj.childNodes;
	var len = dDivChilds.length;
	for(;j<len;j++) {
		if(dDivChilds[j].firstChild.value == sId) {
			break;
		} 
	}
	//���û���ҵ���ͬ�ģ������
	if(j == len) {
		return false;
	} else {
		return true;
	}
}

//��Դ��ɾ��һ�����Ŀ������һ��
function addSelect(sDivObj,dDivObj) {
	//��sDivObj���ж���Щ�ӽڵ㱻ѡ����
	var sNes = sDivObj.childNodes;

	for(var i=0;i<sNes.length;i++) {
		var ne = sNes[i];
		
		if(ne.firstChild.checked == true) {
			sDivObj.removeChild(ne);
			appendNe(ne,dDivObj);
			
			i=i-1;
		}
	}
}

//��Դ��ɾ�����У�����Ŀ������
function addAllSelect(sDivObj,dDivObj) {
	var sNes = sDivObj.childNodes;
	if(sNes.length>1000) {
		EMsg("ѡ����Ԫ����̫�࣬������ѡ��");
	} else {
		for(var i=0;i<sNes.length;i++) {
			var ne = sNes[i];
			
			sDivObj.removeChild(ne);
			appendNe(ne,dDivObj);
			
			i=i-1;
		}
	}
}

//�ж�Ŀ���б����Ƿ��Ѱ���Ҫ��ӵ�Ԫ�أ���û�У�����ӣ�����ʲôҲ����
function appendNe(ne, dDivObj) {
	var neFirstChildValue = ne.firstChild.value;
	
	//���û���ҵ���ͬ�ģ������(������Ϊ������ʱ��ʵ�Ѿ�����ͬ�ļ�¼ȥ���ˣ����Կ��Բ����ж�)
	if(!isExist(neFirstChildValue, dDivObj)) {
		dDivObj.appendChild(ne);
	}
}

function delAllChildNodes(sDivObj) {
	sDivObj.innerHTML="";
}

function createCheckBoxInput(val) {
	var cbInput = document.createElement("input");
	cbInput.type = "checkBox";
	cbInput.value = val;
	return cbInput;
}

function createSelectDiv(inputVal,textVal) {
	var oDiv = document.createElement("div");
	var oText = document.createTextNode(textVal);
	oDiv.appendChild(createCheckBoxInput(inputVal));
	oDiv.appendChild(oText);
	//��ӵ����¼�
	oDiv.attachEvent("onclick",selectDivClick);
	//����Ҽ��¼������ӵ��澯����
	oDiv.attachEvent("oncontextmenu",linkToRule);
	return oDiv;
}

function getSelectedNeId() {
	var sNes = selectedNe.childNodes;
	
	var neIdText = "";
	for(var i=0;i<sNes.length;i++) {
		neIdText += "," + sNes[i].firstChild.value;
	}
	
	return neIdText.replace(",","");
}

function selectAll(sDivObj) {
	var sNes = sDivObj.childNodes;
	for(var i=0;i<sNes.length;i++) {
		sNes[i].firstChild.checked = !sNes[i].firstChild.checked;
	}
}


function showWait() {
	var waitDiv = document.createElement('div');
    waitDiv.style.position = 'absolute';
    waitDiv.style.zIndex = 99;
    waitDiv.innerHTML = '<img src="../../resource/image/ico/spinner.gif" align="absmiddle"/>'
                      + '<span style="font:normal normal normal 9pt normal ����;vertical-align:bottom;margin-left:5px">����������...</span>';
    unSelectedNe.appendChild(waitDiv);
    waitDiv.style.left=(unSelectedNe.offsetWidth - waitDiv.offsetWidth)/2;
    waitDiv.style.top=(unSelectedNe.offsetHeight - waitDiv.offsetHeight)/2;
}

function chooseHis() {
	var sendXML='<?xml version="1.0" encoding="gb2312"?>'
               +  '<root>'
               +     '<search pagesize="" page="" orderby="a.modify_time">'
               +        '<param fieldName="a.alarm_switch_config_id" oper="=" type="String">'+switchCfgId+'</param>'
               +     '</search>'
               +  '</root>'
   hisData.sendXML=sendXML;
   hisData.xmlSrc = url + "tag=16";
}

function viewHis() {
	var selectedRows = hisData.getPropertys("HIS_ID");
	if(isExecute(selectedRows)) {
		var paramArr = new Array(selectedRows[0]);//"1"˵�����޸Ĳ�����ͬʱ����Ҫ�޸ĵĶ���
		window.showModalDialog("alarmTransHisInfoGX.jsp",paramArr,"dialogWidth=600px;dialogHeight=700px;help=0;scroll=yes;status=0;");
	}
}

function linkToRule() {
	var url = "../../../workshop/alarmrule/alarmRuleList.html?fromTopoNeId=";
	if(event.srcElement.tagName=='INPUT' || event.srcElement.parentNode.id=="unSelectedNe") return;
	var neId = event.srcElement.childNodes[0].value;
	window.showModalDialog("/workshop/alarmrule/alarmRuleList.html?fromNe=1&ruleTypeId=0&neId=" + neId,"��Ԫ��ظ澯����ҳ��","help=0;scroll=yes;status=0;dialogWidth=1000px;dialogHeight=600px");
}

function selectDivClick()
{
	if(event.srcElement.tagName=='INPUT' || event.srcElement.parentNode.id=="unSelectedNe") return;
	for (var i=0;i<event.srcElement.parentNode.childNodes.length;i++)
	{
		event.srcElement.parentNode.childNodes[i].style.color="blue";
	}
	event.srcElement.style.color="red";
	var neId=event.srcElement.childNodes[0].value;
	currentNeId=neId;
	//alert(neId);
	//alert(switchCfgId);
	//if(action ==0) {
		//selectedKPI.innerHTML = "";
	//} else {
		selectedKPI.innerHTML = "";
		var paramArray = new Array();
		paramArray.push("tag=" + 21);
		paramArray.push("neId=" + neId);
		paramArray.push("switchCfgId=" + switchCfgId);
		
		xmlhttp.open("POST",url + paramArray.join('&'),false);
		xmlhttp.send();
		
		if(isSuccess(xmlhttp)) {
			var neMsg = xmlhttp.responseXML.selectNodes("//rowSet");
			var arrKPI=[];
			for(var i=0;i<neMsg.length;i++) {
				var id = neMsg[i].getAttribute("KPI_ID");
				var switchId = neMsg[i].getAttribute("ALARM_TRRNS_SWITCH_KPI_ID");
				var neText = neMsg[i].text;
				createSelectKPI(id,neText,neId,switchId,selectedKPI);
				if(switchId!="")
					arrKPI.push(id);
			}
			if(!globalMap.getByKey(neId))
			{
				globalMap.put(neId,arrKPI);
			}
		} 
	//}
}

function selectKPIClick()
{
	//alert(getSelectedNeId());
	var selectKPI=event.srcElement.value;
	var arrKPI;
	if(event.srcElement.checked==true)
	{
		if(globalMap.getByKey(currentNeId))
		{
			arrKPI=globalMap.getByKey(currentNeId);
			//����Ѿ��洢�򷵻�
			for(var i = 0;i<arrKPI.length;i++)
			{
				if(arrKPI[i]==selectKPI) return;
			}
			arrKPI.push(selectKPI);
		}
		else
		{
			arrKPI=[];
			arrKPI.push(selectKPI);
		}
		globalMap.put(currentNeId,arrKPI);
	}
	else
	{
		if(globalMap.getByKey(currentNeId))
		{
			arrKPI=globalMap.getByKey(currentNeId);
			for(var i = 0;i<arrKPI.length;i++)
			{
				if(arrKPI[i]==selectKPI) arrKPI.splice(i,1);
			}
		}
	}
}

function createSelectKPI(inputVal,textVal,neId,switchId,selectedKPI) {
	var oDiv = document.createElement("div");
	var oText = document.createTextNode(textVal);
	oDiv.appendChild(createKPICheckBoxInput(inputVal,neId));
	oDiv.appendChild(oText);
	//��ӵ����¼�
	oDiv.attachEvent("onclick",selectKPIClick);
	selectedKPI.appendChild(oDiv);
	//�ж��Ƿ���ѡ
	var cbInput=oDiv.childNodes[0];
	if(globalMap.getByKey(neId))
	{
		var arrKPI=globalMap.getByKey(neId);
		for(var i = 0;i<arrKPI.length;i++)
		{
			if(arrKPI[i]==inputVal) cbInput.checked=true;
		}
	}
	else
	{
		if (switchId != "")
		{
			cbInput.checked=true;
		}
	}
	
	return selectedKPI;
}

function createKPICheckBoxInput(val,neId) {
	var cbInput = document.createElement("input");
	cbInput.type = "checkBox";
	cbInput.value = val;
	return cbInput;
}

//�Ƿ��޸�KPI
function submitKPI() {
	tagName = "KPIMsg";
	removeNode(root,tagName);
	
	if(globalMap.length>0) {
		if(root.selectSingleNode(tagName) == null) {
			var kpiElement = createNode(root,tagName);
			kpiElement.setAttribute("id", switchCfgId);
			if(kpiElement != null) {
				for(var i = 0;i < globalMap.length;i++)
				{
					var kpiChildElement = createNode(kpiElement,"neId");
					kpiChildElement.setAttribute("id", globalMap.getKeyByIndex(i));
					for(var j=0;j<globalMap.getByIndex(i).length;j++)
					{
						kpiChildElement.text+="," + globalMap.getByIndex(i)[j];
					}
					kpiChildElement.text=kpiChildElement.text.replace(",","");
				}
			}
		}
		return true;
	} else {
		return false;
	}
}

//ͬ����ԪKPI
function syncKPI()
{
	if(selectedKPI.innerHTML=="") 
	{
		EMsg("����û��ѡ����Ԫ");
		return false;
	}
	if(currentNeId)
	{
		var compareNeId = getCheckedNeId();
		if(compareNeId=="")
		{
			EMsg("����ѡ����Ҫͬ������Ԫ!");
			return false;
		}
		var paramArray = new Array();
		paramArray.push("tag=" + 23);
		paramArray.push("currentNeId=" + currentNeId);
		paramArray.push("compareNeId=" + compareNeId);
		xmlhttp.open("post",url+paramArray.join("&"),false);
		xmlhttp.send();
		if(isSuccess(xmlhttp)) 
		{
			var sameNeId = xmlhttp.responseXML.selectSingleNode("/root/SAME").text;
			var differentNeId = xmlhttp.responseXML.selectSingleNode("/root/DIFFERENT").text
			var sameNeIdItems = sameNeId.split(",");
			if(differentNeId!="")
			{
				if(QMsg("��Ԫ:" + differentNeId + " ����Ԫ��������ѡ��Ԫ���Ͳ�һ��,�Ƿ�ͬ��������Ԫ")!=MSG_YES)
				{
					return false;
				}
			}
			//var differentNeIdItems = differentNeId.split(",");
			//��ʼͬ����ͬ��Ŀ
			var arrKPI=globalMap.getByKey(currentNeId);
			if(arrKPI)
			{
				for(var i=0;i<sameNeIdItems.length;i++)
				{
					if(currentNeId!=sameNeIdItems[i])
					{
						if(!globalMap.getByKey(sameNeIdItems[i]))
						{
							//��������Ԫδ���ù�KPI
							globalMap.put(sameNeIdItems[i],arrKPI);
						}
						else
						{
							//������ù�KPI,����ɾ��ԭ����
							globalMap.remove(sameNeIdItems[i]);
							globalMap.put(sameNeIdItems[i],arrKPI);
						}
					}
				}
			}
		}
	}
}

//ȡ�ø�ѡ��Ϊ������Ԫ
function getCheckedNeId() {
	var sNes = selectedNe.childNodes;
	var neIdText = "";
	for(var i=0;i<sNes.length;i++) {
		if(sNes[i].firstChild.checked)
			neIdText += "," + sNes[i].firstChild.value;
	}
	return neIdText.replace(",","");
}