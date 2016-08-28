//定义默认语言资源
var dialogJSDefaultLang = {
	info : '信息',
	warn : '提示',
	error : '错误'
};
//获取语言资源
function getDialogJsLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('dialogJSDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.dialogJS.' + code);
	}
}

//显示的信息(支持HTML)
var dialogMsg;
//对话框的标题
var dialogTitle;
//对话框类型(信息,查询还是错误)
var dialogType;
//对话框显示的按钮
var dialogBtn;
//默认得到焦点的按钮
var dialogDefaultBtn;
//对话框显示的具体参数
var dialogsFeatures = "dialogWidth=236px;dialogHeight=133px;help=0;scroll=0;status=0;";
//对话框所在位置
var dialogUrl = getRealPath("Dialog/dialog.htm","Dialog.js");
/**
 * 常数定义:
 *
 * 常数                             值			    描述
 * MSG_OKONLY                       0           只显示确定按钮。
 * MSG_OKCANCEL                     1           显示确定和取消按钮。
 * MSG_YESNO                        2           显示是和否按钮。
 * MSG_YESNOCANCEL                  3           显示是、否和取消按钮。
 * MSG_ABORTRETRYIGNORE             4           显示放弃、重试和忽略按钮。
 * MSG_RETRYCANCEL                  5           显示重试和取消按钮。
 * 
 * MSG_INFORMATION                  16          显示信息消息图标。
 * MSG_QUESTION                     32          显示警告查询图标。
 * MSG_ERROR                        48          显示错误警告图标。
 * 
 * MSG_DEFAULTBUTTON1               0           第一个按钮为默认按钮。
 * MSG_DEFAULTBUTTON2               256         第二个按钮为默认按钮。
 * MSG_DEFAULTBUTTON3               512         第三个按钮为默认按钮。
 * 
 * MSG_OK                           1           确定
 * MSG_YES                          2           是
 * MSG_NO                           3           否
 * MSG_ABORT                        4           放弃
 * MSG_RETRY                        5           重试
 * MSG_IGNORE                       6           忽略
 * MSG_CANCEL                       7           取消
 */
var MSG_OKONLY=0;
var MSG_OKCANCEL=1;
var MSG_YESNO=2;
var MSG_YESNOCANCEL=3;
var MSG_ABORTRETRYIGNORE=4;
var MSG_RETRYCANCEL=5;

var MSG_INFORMATION=16;
var MSG_QUESTION=32;
var MSG_ERROR=48;

var MSG_DEFAULTBUTTON1=0;
var MSG_DEFAULTBUTTON2=256;
var MSG_DEFAULTBUTTON3=512;

var MSG_OK=1;
var MSG_YES=2;
var MSG_NO=3;
var MSG_ABORT=4;
var MSG_RETRY=5;
var MSG_IGNORE=6;
var MSG_CANCEL=7;

//标准函数可以自定义对话框样式
function msgBox(oMsg,oBtn,oType,oDefaultBtn,oTitle)
{
	//dialogMsg缺省值为空
	dialogMsg = (typeof(oMsg)=="undefined")?"":oMsg;

	//dialogBtn缺省值为MSG_OKONLY
	dialogBtn = (typeof(oBtn)=="undefined")?MSG_OKONLY:oBtn;

	//dialogType缺省值为MSG_INFORMATION
	dialogType = (typeof(oType)=="undefined")?MSG_INFORMATION:oType;

	//dialogDefaultBtn缺省值为MSG_DEFAULTBUTTON1
	dialogDefaultBtn = (typeof(oDefaultBtn)=="undefined")?MSG_DEFAULTBUTTON1:oDefaultBtn;

	//dialogTitle缺省值为"信息"
	dialogTitle = (typeof(oTitle)=="undefined")? getDialogJsLan('info') : oTitle;

	return window.showModalDialog(dialogUrl,window,dialogsFeatures);
}

//默认的提示对话框
function QMsg(oMsg,btnCount,defaultBtn)
{
	if(typeof(btnCount)=="undefined")
	{
		btnCount = 2;
	}
	if (btnCount == 2)
	{
		return msgBox(oMsg,MSG_YESNO,MSG_QUESTION,defaultBtn,getDialogJsLan('warn'));
	}
	else if (btnCount == 3)
	{
		return msgBox(oMsg,MSG_YESNOCANCEL,MSG_QUESTION,defaultBtn,getDialogJsLan('warn'));
	}
}

//默认的信息对话框
function MMsg(oMsg)
{
	return msgBox(oMsg);
}

//默认的错误对话框
function EMsg(oMsg)
{
    return msgBox(oMsg,MSG_OKONLY,MSG_ERROR,MSG_DEFAULTBUTTON1,getDialogJsLan('error'));
}