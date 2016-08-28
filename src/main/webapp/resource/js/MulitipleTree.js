var selfName = "MulitipleTree.js";
var cfgPage = getRealPath("Dialog/MultipleTree.html",selfName);
var actionUrl = getRealPath("../../../servlet/PermissionAction?",selfName);
var MultipleTreeParams;
var iniMultipleTreeId;

function showChoiceTreeWin(action,oObj,_iniMultipleTreeId)
{
	iniMultipleTreeId = _iniMultipleTreeId;
	MultipleTreeParams = new Array(action,oObj,iniMultipleTreeId);
	var dialogsFeatures = "dialogWidth=510px;dialogHeight=370px;help=0;scroll=0;status=0;"
	return window.showModalDialog(cfgPage,MultipleTreeParams,dialogsFeatures);
}

function showChoiceTreeWinByURL(URL,_iniMultipleTreeId)
{
	return showChoiceTreeWin('BY_URL','../../../servlet/'+URL,_iniMultipleTreeId);
}

function showChoiceTreeWinByDoc(oDoc,_iniMultipleTreeId)
{
	return showChoiceTreeWin('BY_DOC',oDoc,_iniMultipleTreeId);
}

