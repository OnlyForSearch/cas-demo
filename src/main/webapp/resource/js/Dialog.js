//����Ĭ��������Դ
var dialogJSDefaultLang = {
	info : '��Ϣ',
	warn : '��ʾ',
	error : '����'
};
//��ȡ������Դ
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

//��ʾ����Ϣ(֧��HTML)
var dialogMsg;
//�Ի���ı���
var dialogTitle;
//�Ի�������(��Ϣ,��ѯ���Ǵ���)
var dialogType;
//�Ի�����ʾ�İ�ť
var dialogBtn;
//Ĭ�ϵõ�����İ�ť
var dialogDefaultBtn;
//�Ի�����ʾ�ľ������
var dialogsFeatures = "dialogWidth=236px;dialogHeight=133px;help=0;scroll=0;status=0;";
//�Ի�������λ��
var dialogUrl = getRealPath("Dialog/dialog.htm","Dialog.js");
/**
 * ��������:
 *
 * ����                             ֵ			    ����
 * MSG_OKONLY                       0           ֻ��ʾȷ����ť��
 * MSG_OKCANCEL                     1           ��ʾȷ����ȡ����ť��
 * MSG_YESNO                        2           ��ʾ�Ǻͷ�ť��
 * MSG_YESNOCANCEL                  3           ��ʾ�ǡ����ȡ����ť��
 * MSG_ABORTRETRYIGNORE             4           ��ʾ���������Ժͺ��԰�ť��
 * MSG_RETRYCANCEL                  5           ��ʾ���Ժ�ȡ����ť��
 * 
 * MSG_INFORMATION                  16          ��ʾ��Ϣ��Ϣͼ�ꡣ
 * MSG_QUESTION                     32          ��ʾ�����ѯͼ�ꡣ
 * MSG_ERROR                        48          ��ʾ���󾯸�ͼ�ꡣ
 * 
 * MSG_DEFAULTBUTTON1               0           ��һ����ťΪĬ�ϰ�ť��
 * MSG_DEFAULTBUTTON2               256         �ڶ�����ťΪĬ�ϰ�ť��
 * MSG_DEFAULTBUTTON3               512         ��������ťΪĬ�ϰ�ť��
 * 
 * MSG_OK                           1           ȷ��
 * MSG_YES                          2           ��
 * MSG_NO                           3           ��
 * MSG_ABORT                        4           ����
 * MSG_RETRY                        5           ����
 * MSG_IGNORE                       6           ����
 * MSG_CANCEL                       7           ȡ��
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

//��׼���������Զ���Ի�����ʽ
function msgBox(oMsg,oBtn,oType,oDefaultBtn,oTitle)
{
	//dialogMsgȱʡֵΪ��
	dialogMsg = (typeof(oMsg)=="undefined")?"":oMsg;

	//dialogBtnȱʡֵΪMSG_OKONLY
	dialogBtn = (typeof(oBtn)=="undefined")?MSG_OKONLY:oBtn;

	//dialogTypeȱʡֵΪMSG_INFORMATION
	dialogType = (typeof(oType)=="undefined")?MSG_INFORMATION:oType;

	//dialogDefaultBtnȱʡֵΪMSG_DEFAULTBUTTON1
	dialogDefaultBtn = (typeof(oDefaultBtn)=="undefined")?MSG_DEFAULTBUTTON1:oDefaultBtn;

	//dialogTitleȱʡֵΪ"��Ϣ"
	dialogTitle = (typeof(oTitle)=="undefined")? getDialogJsLan('info') : oTitle;

	return window.showModalDialog(dialogUrl,window,dialogsFeatures);
}

//Ĭ�ϵ���ʾ�Ի���
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

//Ĭ�ϵ���Ϣ�Ի���
function MMsg(oMsg)
{
	return msgBox(oMsg);
}

//Ĭ�ϵĴ���Ի���
function EMsg(oMsg)
{
    return msgBox(oMsg,MSG_OKONLY,MSG_ERROR,MSG_DEFAULTBUTTON1,getDialogJsLan('error'));
}