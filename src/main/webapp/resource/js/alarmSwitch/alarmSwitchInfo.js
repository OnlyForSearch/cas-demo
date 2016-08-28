var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var sendXML = new ActiveXObject("Microsoft.XMLDOM");
var regionRoot = new ActiveXObject("Microsoft.XMLDOM");
var levelRoot = new ActiveXObject("Microsoft.XMLDOM");

var root;

var url = "../../servlet/AlarmTransConfigServlet?";

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

var tagName;

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
	
	//1.初始化告警开关类别
	setSwitchLevel();
	
	//2.初始化系统树
	neTree = new XMLTree();
	neTree.xmlUrl = '../../servlet/netElementTree';
	neTree.setPretreatmentAction(new newTree());
	neTree.isRightFireOnClick = false;
	neTree.setDblClickAction(new DblClickAction());
	
	//3.已归档开关，不允许变更
	setSwitchPrivilege();
	
	root = sendXML.createElement("Submit");
	sendXML.appendChild(root);
}

function add() {
	//1.隐藏只在编辑才显示的信息
	var i = 0;
	for(;i<display_tag.length;i++) {
		 display_tag[i].style.display = "none";
	}
	
}

function setSwitchLevel() {
	var staff_id = SwitchMsg.XMLDocument.selectSingleNode("/Msg/CREATE_STAFF_ID").text;
	
	if(staff_id != 1) {//只有管理员可配置通用开关
		switchLevel.options.remove(0);
	}
	
	//初始化显示的页面，只有在配置通用开关时才显示区域、级别页面
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
		if(state.trimall() == "归档") {
			enterButton.disabled = "true";
			applyButton.disabled = "true";
			enterButton.insertAdjacentHTML("beforeBegin","<font color='red'>不允许修改归档信息</font>&nbsp;&nbsp;&nbsp;");
		} else if(SwitchMsg.XMLDocument.selectSingleNode("/Msg/ALARM_SWITCH_LEVEL").text == 0 && currUser.value != 1) {//admin才有权限修改通用规则
			enterButton.disabled = "true";
			applyButton.disabled = "true";
			enterButton.insertAdjacentHTML("beforeBegin","<font color='red'>不允许非Admin用户修改通用规则</font>&nbsp;&nbsp;&nbsp;");
		} else if(currUser.value != 1) {
			switchLevel.disabled = true;
		}
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
	
	if((action==0||isSubmitSwitch||isSubmitRegion||isSubmitLevel||isSubmitBusiSys||isSubmitNeId) && checkData()) {
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
		EMsg("开关名称不能为空!");
		return false;
	}
	if(!validDate.value.hasText()) {
		EMsg("生效日期不能为空!");
		return false;
	}
	if(!cancelDate.value.hasText()) {
		EMsg("失效日期不能为空!");
		return false;
	}
	return true;
}

function addSuccess() {
	MMsg("增加成功！");
	
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
	MMsg("修改成功！");
	
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

//是否修改了基本信息
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

//是否修改了区域
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

//是否修改级别
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

//是否修改业务系统
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

//是否修改网元
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

//修改告警开关类别时的事件
function changeLevel() {
	//1.需要提示会重新刷新数据
	if(MSG_YES == QMsg("修改开关类型，将重置区域、级别、系统、网元等信息。是否修改？")) {
		if(switchLevel.options[switchLevel.selectedIndex].value == 1) {//如果是从通用变更为特殊开关
			//1.隐藏区域级别页面,显示系统、网元页面
			oRegion.display="none";
			oBusiSys.display = "";
			oNeId.display = "";
			
			isLoadRegion = true;
			isLoadBusiSys = false;
			isLoadNeId = false;
			
			//2.重置已选区域的值
			selectedRegion.getObject().options.length = 0;
			
			//3.重置已选择级别的值
			setBlankAlarmLevel();
		} else {
			oRegion.display = "";
			oBusiSys.display = "none";
			oNeId.display = "none";
			
			isLoadRegion = false;
			isLoadBusiSys = true;
			isLoadNeId = true;
			
			//重置已选系统的值，这里是因为在提交的时候需要把这些值置为空（因为已经变成了通用开关，是没有这些值的，具体重置哪个值是根据在提交是所读取的是那个变量）
			configTarget.getObject().options.length = 0;
			
			//重置已选网元的值
			selectedNe.innerHTML="";
		}
		
		isChgLevel = true;
	} else {
		event.isChange = false;
	}
	
}

//选择了区域、级别页面
function chooseRegion() {
	if(!isLoadRegion) {
		//1.需要对未选区域、已选区域赋值
		setRegion();
		//2.需要对告警级别赋值
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


//获取当前已选中的告警级别的值，并以','分隔
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

//自定义初始化树
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

//双击事件
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
				
				//保存已选网元初始值。用户判断是否有做修改
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

//判断sId值是否已存在于dDivObj中，是返回true，否则返回false
function isExist(sId,dDivObj) {
	var j=0;
	
	var dDivChilds = dDivObj.childNodes;
	var len = dDivChilds.length;
	for(;j<len;j++) {
		if(dDivChilds[j].firstChild.value == sId) {
			break;
		} 
	}
	//如果没有找到相同的，则添加
	if(j == len) {
		return false;
	} else {
		return true;
	}
}

//从源中删除一项，并往目标增加一项
function addSelect(sDivObj,dDivObj) {
	//在sDivObj中判断哪些子节点被选中了
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

//从源中删除所有，并往目标增加
function addAllSelect(sDivObj,dDivObj) {
	var sNes = sDivObj.childNodes;
	if(sNes.length>1000) {
		EMsg("选择网元数据太多，请重新选择！");
	} else {
		for(var i=0;i<sNes.length;i++) {
			var ne = sNes[i];
			
			sDivObj.removeChild(ne);
			appendNe(ne,dDivObj);
			
			i=i-1;
		}
	}
}

//判断目标列表中是否已包含要添加的元素，若没有，则添加，否则什么也不做
function appendNe(ne, dDivObj) {
	var neFirstChildValue = ne.firstChild.value;
	
	//如果没有找到相同的，则添加(不过因为在搜索时其实已经把相同的记录去除了，所以可以不用判断)
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
                      + '<span style="font:normal normal normal 9pt normal 宋体;vertical-align:bottom;margin-left:5px">数据载入中...</span>';
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
		var paramArr = new Array(selectedRows[0]);//"1"说明是修改操作，同时传递要修改的对象
		window.showModalDialog("alarmTransHisInfo.jsp",paramArr,"dialogWidth=600px;dialogHeight=700px;help=0;scroll=yes;status=0;");
	}
}