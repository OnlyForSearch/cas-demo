//定义默认语言资源
var choiceDialogJSDefaultLang = {
	readingData : '正在读取数据',
	waitText : '请稍候......',
	pleaseInput : '请输入数据'
};
//获取语言资源
function getChoiceDialogJsLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('choiceDialogJSDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.choiceDialogJS.' + code);
	}
}

var choiceDialogUrl = getRealPath("Dialog/choice/default.jsp","ChoiceDialog.js");
var choiceParentStaffUrl = getRealPath("Dialog/ChoiceParentStaff.html","ChoiceDialog.js");
var choiceStaffByPriUrl = getRealPath("Dialog/ChoiceStaffByPrivilege.html","ChoiceDialog.js");
var choiceStaffByDutyUrl = getRealPath("Dialog/ChoiceStaffByDuty.html","ChoiceDialog.js");
var choiceStaffByContactUrl = getRealPath("Dialog/ChoiceStaffByContact.html","ChoiceDialog.js");
var choiceNeUrl = getRealPath("Dialog/ChoiceNe.html", "ChoiceDialog.js");

//浙江新增
var choiceCascadeUrl = getRealPath("Dialog/ChoiceCascade.html","ChoiceDialog.js");
var choiceEventUrl = getRealPath("Dialog/ChoiceEvent.html","ChoiceDialog.js");
var choiceSwitchUrl = getRealPath("Dialog/ChoiceSwitch.html","ChoiceDialog.js");
var choiceStaffMessageUrl = getRealPath("Dialog/ChoiceStaffMessage.html","ChoiceDialog.js");
var choiceReasonUrl = getRealPath("Dialog/ChoiceReason.html","ChoiceDialog.js");

var WAIT_ELEMENT_ID; 
var INPUT_ELEMENT_ID;
var BLUR_ELEMENT_ID;
var OVER_LAYER_ID;
var waitImg = getRealPath("../image/ani_wait.gif", "Dialog.js");

var ChoiceDialog = {};

ChoiceDialog.staff = function(params, size)
{
	size = size || {};
	params = params || {};
	var width = size.width || 770;
	var height = size.height || 460;
	var dialogsFeatures = "dialogWidth=" + width + "px;dialogHeight=" + height
			+ "px;help=0;scroll=0;status=0;"
	params.parentWin = window;
	return window.showModalDialog(choiceDialogUrl, params, dialogsFeatures);
}

// orgText,iniName不再生效，会根据对应id去数据库查询对应的name
function choiceStaff(isMultiple, orgId, orgText, isReadOnly, filter, iniName,
		iniId, isSetRoot, oAction, filterStaffWhere)
{
	return ChoiceDialog.staff({
				panelType : "StaffByOrg",
				isMultiple : (isMultiple === true),
				orgId : orgId,
				isReadOnly : (isReadOnly === true),
				isSetRoot : (isSetRoot === true),
				iniId : iniId,
				filter : filter,
				action : oAction,
				filterStaffWhere : filterStaffWhere
			});
}

//部门组织树和专项小组
function choiceStaffAll(isMultiple, orgId, orgText, isReadOnly, filter, iniName,
		iniId, isSetRoot, oAction, filterStaffWhere)
{
	return ChoiceDialog.staff({
				panelType : "StaffForItsm",
				isMultiple : (isMultiple === true),
				orgId : orgId,
				isReadOnly : (isReadOnly === true),
				isSetRoot : (isSetRoot === true),
				iniId : iniId,
				filter : filter,
				action : oAction,
				filterStaffWhere : filterStaffWhere
			});
}

// projectText,iniName无效参数
function choiceStaffByProject(isMultiple, projectId, projectText, isReadOnly,
		filter, iniName, iniId, isSetRoot, aRootOrgParam, group,
		filterStaffWhere)
{
	return ChoiceDialog.staff({
				panelType : "StaffByProject",
				isMultiple : (isMultiple === true),
				projectId : projectId,
				isReadOnly : (isReadOnly === true),
				isSetRoot : (isSetRoot === true),
				iniId : iniId,
				filter : filter,
				iniGroup : group,
				aRootOrgParam : aRootOrgParam,
				filterStaffWhere : filterStaffWhere || ""
			});
}

function choiceStaffByContact(isMultiple, orgId, orgText, isReadOnly, filter,
		iniName, iniId, isSetRoot, oAction)
{
	var dialogsFeatures = "dialogWidth=450px;dialogHeight=370px;help=0;scroll=1;status=0;"
	if (isMultiple == null)
	{
		isMultiple = false;
	}
	if (isReadOnly == null)
	{
		isReadOnly = false;
	}
	var paramArray = new Array();
	paramArray.push(isMultiple);
	paramArray.push(orgId);
	paramArray.push(orgText);
	paramArray.push(isReadOnly);
	paramArray.push(filter);
	paramArray.push(iniName);
	paramArray.push(iniId);
	paramArray.push(isSetRoot);
	paramArray.push(oAction);
	paramArray.push(window);
	return window.showModalDialog(choiceStaffByContactUrl, paramArray,
			dialogsFeatures);
}

function choiceNe(isMultiple, orgId, orgText, isReadOnly, filter, iniName,
		iniId, isSetRoot, oAction)
{
	var dialogsFeatures = "dialogWidth=800px;dialogHeight=370px;help=0;scroll=1;status=0;"
	if (isMultiple == null)
	{
		isMultiple = false;
	}
	if (isReadOnly == null)
	{
		isReadOnly = false;
	}
	var paramArray = new Array();
	paramArray.push(isMultiple);
	paramArray.push(orgId);
	paramArray.push(orgText);
	paramArray.push(isReadOnly);
	paramArray.push(filter);
	paramArray.push(iniName);
	paramArray.push(iniId);
	paramArray.push(isSetRoot);
	paramArray.push(oAction);
	paramArray.push(window);
	return window.showModalDialog(choiceNeUrl, paramArray, dialogsFeatures);
}

function choiceStaffToElement(oName,oId,isMultiple,orgId,orgText,isReadOnly,filter,iniName,iniId,isSetRoot,oAction)
{
	if(!iniName)
	{
		iniName = oName.value;
	}
	if(!iniId && oId)
	{
		iniId = oId.value;
	}
	var staffInfo = choiceStaff(isMultiple,orgId,orgText,isReadOnly,filter,iniName,iniId,isSetRoot,oAction);
	if(staffInfo!=null)
	{
		oName.value = staffInfo.name;
		if(oId!=null)
		{
			oId.value = staffInfo.id;
		}
	}
}

function choiceStaffByDuty(isMultiple, orgId, orgText, isReadOnly, filter,
		iniName, iniId, isSetRoot, oAction, filterStaffWhere)
{
	var dialogsFeatures = "dialogWidth=450px;dialogHeight=370px;help=0;scroll=1;status=0;"
	if (isMultiple == null)
	{
		isMultiple = false;
	}
	if (isReadOnly == null)
	{
		isReadOnly = false;
	}
	var paramArray = new Array();
	paramArray.push(isMultiple);
	paramArray.push(orgId);
	paramArray.push(orgText);
	paramArray.push(isReadOnly);
	paramArray.push(filter);
	paramArray.push(iniName);
	paramArray.push(iniId);
	paramArray.push(isSetRoot);
	paramArray.push(oAction);
	paramArray.push(window);
	paramArray.push(filterStaffWhere);
	return window.showModalDialog(choiceStaffByDutyUrl, paramArray,
			dialogsFeatures);
}

function choiceStaffByDutyToElement(oName, oId, isMultiple, orgId, isReadOnly,
		filter, iniName, iniId, isSetRoot, oAction)
{
	if (!iniName)
	{
		iniName = oName.value;
	}
	if (!iniId)
	{
		iniId = oId.value;
	}
	var staffInfo = choiceStaffByDuty(isMultiple, orgId, "", isReadOnly,
			filter, iniName, iniId, isSetRoot, oAction);
	if (staffInfo != null)
	{
		oName.value = staffInfo.name;
		if (oId != null)
		{
			oId.value = staffInfo.id;
		}
	}
}

function choiceStaffByProjectToElement(oName, oId, isMultiple, orgId, orgText,
		isReadOnly, filter, iniName, iniId, isSetRoot)
{
	if (!iniName)
	{
		iniName = oName.value;
	}
	if (!iniId)
	{
		iniId = oId.value;
	}
	var staffInfo = choiceStaffByProject(isMultiple, orgId, orgText,
			isReadOnly, filter, iniName, iniId, isSetRoot);
	if (staffInfo != null)
	{
		oName.value = staffInfo.name;
		if (oId != null)
		{
			oId.value = staffInfo.id;
		}
	}
}

function choiceStaffByPri(priId, isMultiple, orgId, isReadOnly, filter,
		iniName, iniId)
{
	var dialogsFeatures = "dialogWidth=450px;dialogHeight=370px;help=0;scroll=1;status=0;"
	if (isMultiple == null)
	{
		isMultiple = false;
	}
	if (isReadOnly == null)
	{
		isReadOnly = false;
	}
	var paramArray = new Array();
	paramArray.push(priId);
	paramArray.push(isMultiple);
	paramArray.push(orgId);
	paramArray.push(isReadOnly);
	paramArray.push(filter);
	paramArray.push(iniName);
	paramArray.push(iniId);
	return window.showModalDialog(choiceStaffByPriUrl, paramArray,
			dialogsFeatures);
}

function choiceStaffByPriToElement(oName, oId, priId, isMultiple, orgId,
		isReadOnly, filter, iniName, iniId)
{
	if (!iniName)
	{
		iniName = oName.value;
	}
	if (!iniId)
	{
		iniId = oId.value;
	}
	var staffInfo = choiceStaffByPri(priId, isMultiple, orgId, isReadOnly,
			filter, iniName, iniId);
	if (staffInfo != null)
	{
		oName.value = staffInfo.name;
		if (oId != null)
		{
			oId.value = staffInfo.id;
		}
	}
}

function choice(oName, oId)
{
	var staffId;
	if (action == 1)
	{
		staffId = StaffMsg.XMLDocument.selectSingleNode("/Msg/STAFF_ID").text;

	}
	var staffInfo = choiceStaff(false, StaffMsg.XMLDocument
					.selectSingleNode("/Msg/ORG_ID").text, orgName, false,
			staffId);
	if (staffInfo != null)
	{
		oName.value = staffInfo.name;
		oId.value = staffInfo.id;
	}
}

function choiceParentStaffById(staffId, filter)
{
	var dialogsFeatures = "dialogWidth=450px;dialogHeight=365px;help=0;scroll=1;status=0;"
	var paramArray = new Array();
	paramArray.push(staffId);
	paramArray.push(filter);
	return window.showModalDialog(choiceParentStaffUrl, paramArray,
			dialogsFeatures);
}

function choiceParentStaffBySession(filter,action)
{
	var dialogsFeatures = "dialogWidth=450px;dialogHeight=365px;help=0;scroll=1;status=0;"
	var paramArray = new Array();
	paramArray.push(filter);
	if(typeof(action)=='undefined'){
		action = '';
	}
	return window.showModalDialog(choiceParentStaffUrl+'?action='+action, paramArray,
			dialogsFeatures);
}

function choiceCascade(isMultiple,orgId,orgText,isReadOnly,filter,iniName,iniId,isSetRoot,oAction)
{
	var dialogsFeatures = "dialogWidth=860px;dialogHeight=530px;help=0;scroll=1;status=0;"
	if(isMultiple==null)
	{
		isMultiple = false;
	}
	if(isReadOnly==null)
	{
		isReadOnly = false;
	}
	var paramArray = new Array();
	paramArray.push(window);
	return window.showModalDialog(choiceCascadeUrl,window,dialogsFeatures);
}

function choiceEvent(isMultiple,orgId,orgText,isReadOnly,filter,iniName,iniId,isSetRoot,oAction)
{
	var dialogsFeatures = "dialogWidth=860px;dialogHeight=530px;help=0;scroll=1;status=0;"
	if(isMultiple==null)
	{
		isMultiple = false;
	}
	if(isReadOnly==null)
	{
		isReadOnly = false;
	}
	var paramArray = new Array();
	paramArray.push(window);
	return window.showModalDialog(choiceEventUrl,window,dialogsFeatures);
}

function choiceReason(isMultiple,orgId,orgText,isReadOnly,filter,iniName,iniId,isSetRoot,oAction)
{
	
	var dialogsFeatures = "dialogWidth=960px;dialogHeight=530px;help=0;scroll=1;status=0;"
	if(isMultiple==null)
	{
		isMultiple = false;
	}
	if(isReadOnly==null)
	{
		isReadOnly = false;
	}
	var params = {};
	params.isMultiple = isMultiple;
	params.isReadOnly = isReadOnly;
	return window.showModalDialog(choiceReasonUrl,params,dialogsFeatures);
}

function choiceSwitch(isMultiple,orgId,orgText,isReadOnly,filter,iniName,iniId,isSetRoot,oAction)
{
	var dialogsFeatures = "dialogWidth=880px;dialogHeight=530px;help=0;scroll=1;status=0;"
	if(isMultiple==null)
	{
		isMultiple = false;
	}
	if(isReadOnly==null)
	{
		isReadOnly = false;
	}
	var paramArray = new Array();
	paramArray.push(window);
	return window.showModalDialog(choiceSwitchUrl,window,dialogsFeatures);
}

function choiceStaffMessage(isMultiple,orgId,orgText,isReadOnly,filter,iniName,iniId,isSetRoot,oAction)
{
	var dialogsFeatures = "dialogWidth=500px;dialogHeight=580px;help=0;scroll=1;status=0;"
	if(isMultiple==null)
	{
		isMultiple = false;
	}
	if(isReadOnly==null)
	{
		isReadOnly = false;
	}
	var paramArray = new Array();
	paramArray.push(isMultiple);
	paramArray.push(orgId);
	paramArray.push(orgText);
	paramArray.push(isReadOnly);
	paramArray.push(filter);
	paramArray.push(iniName);
	paramArray.push(iniId);
	paramArray.push(isSetRoot);
	paramArray.push(oAction);
	paramArray.push(window);
	return window.showModalDialog(choiceStaffMessageUrl,paramArray,dialogsFeatures);
}

function showOverlay(oElement)
{
	if (oElement == null)
	{
		oElement = window.document.body;
	}
	var oOverlayDiv;
	if (OVER_LAYER_ID == null
			|| (oOverlayDiv = document.getElementById(OVER_LAYER_ID)) == null)
	{
		OVER_LAYER_ID = document.uniqueID;
		var sDivHTML = "<div style='position:absolute;z-index:98;display:none;top:0;left:0;"
				+ "background-color:white;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=36);'"
				+ " id='" + OVER_LAYER_ID + "'>" + "</div>";
		oElement.insertAdjacentHTML("beforeEnd", sDivHTML);
		oOverlayDiv = document.getElementById(OVER_LAYER_ID)
		oOverlayDiv.style.width = oElement.clientWidth;
		oOverlayDiv.style.height = oElement.clientHeight;
	}
	oOverlayDiv.style.display = "block";
}

function hideOverlay()
{
	var oOverlayDiv;
	if (OVER_LAYER_ID != null
			&& (oOverlayDiv = document.getElementById(OVER_LAYER_ID)) != null)
	{
		oOverlayDiv.style.display = "none";
	}
}

// 显示等待框
function showWait(text, oParent)
{
	if (text == null)
	{
		text = getChoiceDialogJsLan('readingData');
	}
	if (oParent == null)
	{
		oParent = window.document.body;
	}	
	var oWait;
	if (WAIT_ELEMENT_ID == null
			|| (oWait = document.getElementById(WAIT_ELEMENT_ID)) == null)
	{
		WAIT_ELEMENT_ID = document.uniqueID;
		var sDivHTML = "<div style='width:250px;height:100px;border:1px solid black;position:absolute;z-index:99;display:none;"
				+ "background-color:white' id='"
				+ WAIT_ELEMENT_ID
				+ "'>"
				+ "<img src='"
				+ waitImg
				+ "' style='float:left'/>"
				+ "<span style='font-family:宋体;font-size:9pt;font-weight:bold'>"
				+ "<br><br><br>"
				+ text
				+ "<br>" + getChoiceDialogJsLan('waitText')
				+ "</span>"
				+ "</div>";
		oParent.insertAdjacentHTML("beforeEnd", sDivHTML);
		oWait = document.getElementById(WAIT_ELEMENT_ID)
	}
	oWait.style.pixelLeft = (window.document.body.clientWidth - oWait.style.pixelWidth)
			/ 2;
	oWait.style.pixelTop = (window.document.body.clientHeight - oWait.style.pixelHeight)
			/ 2;
	oWait.style.display = "block";
}

function hideWait()
{
	var oWait;
	if (WAIT_ELEMENT_ID != null
			&& (oWait = document.getElementById(WAIT_ELEMENT_ID)) != null)
	{
		oWait.style.display = "none";
	}
}

function showBlur(oMsg)
{
	var oBlur;
	if (BLUR_ELEMENT_ID == null
			|| (oBlur = document.getElementById(BLUR_ELEMENT_ID)) == null)
	{
		BLUR_ELEMENT_ID = document.uniqueID;
		sDivHTML = '<DIV id="'
				+ BLUR_ELEMENT_ID
				+ '" STYLE="BACKGROUND-COLOR: white; FILTER: alpha(opacity=60); LEFT: 0px;'
				+ 'POSITION:absolute; TOP: 0px; Z-INDEX: 98" '
				+ 'onclick="window.event.cancelBubble=true; window.event.returnValue=false;">'
				+ '</DIV>';
		window.document.body.insertAdjacentHTML("beforeEnd", sDivHTML);
		oBlur = document.getElementById(BLUR_ELEMENT_ID);
	}
	oBlur.style.width = document.body.scrollWidth;
	oBlur.style.height = document.body.scrollHeight;
	window.onbeforeunload = function()
	{
		return oMsg;
	}
}

function hideBlur()
{
	var oBlur;
	if (BLUR_ELEMENT_ID != null
			&& (oBlur = document.getElementById(BLUR_ELEMENT_ID)) != null)
	{
		oBlur.style.width = '0px';
		oBlur.style.height = '0px';
		window.onbeforeunload = '';
	}
}

function showInput(text, oParent)
{
	if (text == null)
	{
		text = getChoiceDialogJsLan('pleaseInput');
	}
	if (oParent == null)
	{
		oParent = window.document.body;
	}
	var oInput;
	if (INPUT_ELEMENT_ID == null
			|| (oInput = document.getElementById(INPUT_ELEMENT_ID)) == null)
	{
		INPUT_ELEMENT_ID = document.uniqueID;
		var sDivHTML = '<DIV STYLE="BORDER: buttonhighlight 2px outset;Z-INDEX:99;POSITION: absolute;BACKGROUND-COLOR: buttonface;'
				+ 'DISPLAY: none; WIDTH: 350px; CURSOR: default" id="'
				+ INPUT_ELEMENT_ID
				+ '" '
				+ 'onselectstart="window.event.returnValue=false;">'
				+ '<DIV STYLE="PADDING: 3px; FONT-WEIGHT: bolder; COLOR: captiontext;'
				+ 'BORDER-BOTTOM: white 2px groove; BACKGROUND-COLOR: activecaption">'
				+ text
				+ '</DIV>'
				+ '<DIV STYLE="PADDING: 5px;BACKGROUND-COLOR: #FBFBFD">'
				+ '<TEXTAREA></TEXTAREA>'
				+ '</DIV>'
				+ '<DIV STYLE="BORDER-TOP: white 2px groove; PADDING-BOTTOM: 5px; PADDING-TOP: 3px; '
				+ 'BACKGROUND-COLOR: #FBFBFD; TEXT-ALIGN: center">'
				+ '<INPUT TYPE="button"  VALUE="Cancel">' + '</DIV>' + '</DIV>';
		oParent.insertAdjacentHTML("beforeEnd", sDivHTML);
		oInput = document.getElementById(INPUT_ELEMENT_ID)
	}
	showBlur();
	oInput.style.display = "block";
	oInput.style.left = ((document.body.offsetWidth - oInput.offsetWidth) / 2);
	oInput.style.top = ((document.body.offsetHeight - oInput.offsetHeight) / 2);
}

// 选择人员：包括组织树、项目组、常用小组，projectText,iniName无效参数
function choiceStaffByFavo(isMultiple, projectId, projectText, isReadOnly,
        filter, iniName, iniId, isSetRoot, aRootOrgParam, group,
        filterStaffWhere)
{
    return ChoiceDialog.staff({
                panelType : "StaffForFavo",
                isMultiple : (isMultiple === true),
                projectId : projectId,
                isReadOnly : (isReadOnly === true),
                isSetRoot : (isSetRoot === true),
                iniId : iniId,
                filter : filter,
                iniGroup : group,
                aRootOrgParam : aRootOrgParam,
                filterStaffWhere : filterStaffWhere || ""
            });
}