/*

	���湤����������

*/

var fnav = {}
fnav.divName = 'navChoiceDialog'
fnav.dialogReady = false

var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var iniXML = new ActiveXObject("Microsoft.XMLDOM");
var xslDoc = new ActiveXObject("Microsoft.XMLDOM");
var delPri = new ActiveXObject("Microsoft.XMLDOM");
var addPri = new ActiveXObject("Microsoft.XMLDOM");
var sendXML = new ActiveXObject("Microsoft.XMLDOM");
var url = "/servlet/staff_manage?";
var favoUrl = "/servlet/FavoritesAction?"
var action;
var parentHandle;
var msg = new Array("���Ա���ɹ�!","����Ա����Ϣ�ɹ�!");
var mailUserName;
var iniStaffTaskHTML="";
var isCensorStaff = true;

var isLoadPri = false;
var isLoadTask = false;

var isSubmitStaff;
var isSubmitTask;
var isSubmitStaffPri;

var root;
var delPriRoot;
var addPriRoot;
var orgName;

var privilegeTree;
var initStaffState;
var isClearPri = false;

$(function(){
	$('input').click(function(e){
		this.defaultChecked = this.checked; 
		e.stopPropagation();
	})
})

// ��ʼ��Ȩ����
fnav.initPriTree=function(){
	privilegeTree = new XMLTree();
	var loadAction = new LoadAction();
	var checkAction = new CheckAction();
	privilegeTree.xmlUrl = "../../servlet/privilegeTree?navReq=1";
	privilegeTree.showType = 'checkbox';
	privilegeTree.showDepth = 100;
	privilegeTree.isRightFireOnClick = false;
	privilegeTree.itemClickEvent = 'priItemClick()';
	privilegeTree.setLoadAction(loadAction);
	privilegeTree.setCheckBoxClickAction(checkAction);
	choosePri()
}


// ��ʼ���������öԻ���
fnav.initDialog=function(){
	var dialogHTML = fnav.createDialogContent()
	$('body').prepend(dialogHTML)
	fnav.initPriTree()
	$('#' + fnav.divName).dialog({
        modal: true,
        width: '500px',
        heigth: '600px',
        autoOpen: false,
        zIndex : -1000,
       // show: 'drop',
       // hide: 'drop',
        close : fnav.onClose,
        overlay: {
                backgroundColor: '#000',
                opacity: 0.1
        },
        buttons: {
            '�� ��' : function(){
                $(this).dialog('close');
                if(window.dialogArguments) window.close();
            },
            'Ӧ ��' : function(){
                fnav.changeRight = true;
            	fnav.onOk();
            },
            'ȷ ��' : function(){
                fnav.changeRight = true;
            	fnav.onOk()
            	if(!fnav.changeRight) return;
                $(this).dialog('close');
                if(window.dialogArguments) window.close();
            }
        }
    });
    fnav.dialogReady = true
}

// ������
fnav.onOk=function(){
	var s = addPriRoot == delPriRoot
	var ctrls = $('#privilegeTreeDiv').find('input')
	var vals = []
	var count = 0;
	ctrls.each(function(){
		var ctrl = $(this)
		if(ctrl[0].checked){
			var v = ctrl.attr('id')
			//if(v=='')return
			vals.push(v);
			//��ȡ��ѡҶ�ӽڵ�������ж����Ӹ���
			if(ctrl.parent().attr('type') == 'singleNode'){
				count++;
			}
			
		}
	});
	if(fnav.quickLimitNum&&count>fnav.quickLimitNum){
	    alert("���������Ѿ�����"+fnav.quickLimitNum+"�������ʵ�����");
	    fnav.changeRight = false;
	    return;
	}
	//if(vals.length == 0)return
	// ��������
	
	if(isAsynchronous){//�첽���Ĵ�����̨����
		var paramArray = new Array();
		paramArray.push("action="+199);
		paramArray.push("ids="+vals.join(','));
		xmlhttp.Open("POST",favoUrl+paramArray.join("&"),isAsynchronous)
		xmlhttp.send(null);
		xmlhttp.onreadystatechange=function(){
			if(window.dialogArguments)
	           window.dialogArguments.loadShortCutMenu();
	        else
	          loadShortCutMenu();
		}
	}
	else{
		var paramArray = new Array();
		paramArray.push("action="+199);
		paramArray.push("ids="+vals.join(','));
		xmlhttp.Open("POST",favoUrl+paramArray.join("&"),isAsynchronous)
		xmlhttp.send();
		if(isSuccess(xmlhttp)){
//			MMsg('����ɹ�!')
			if(window.dialogArguments)
	           window.dialogArguments.loadShortCutMenu();
	        else
	          loadShortCutMenu();
		}
	}
}

// fuck ie6
fnav.hideSelect=function(){
	$('select').hide()
}

// fuck ie6
fnav.showSelect=function(){
	$('select').show()
}

// �򿪶Ի���
var isAsynchronous = false;//�Ƿ��첽��Ĭ��ͬ����
fnav.open=function(quickLimitNum,parameter){
    fnav.quickLimitNum = quickLimitNum;
	fnav.hideSelect()
	if(!fnav.dialogReady){
		fnav.initDialog()
	}else{
		//$('#privilegeTreeDiv').html('')
	}
	$('#' + fnav.divName).dialog('open')
	if(parameter == 'asynchronous'){
		isAsynchronous = true;
		$('.ui-state-default').eq(1).hide();//����Ӧ�ð�ť
	}
}

fnav.onClose=function(event, ui){
	var onlyMenu = true
	fnav.showSelect()
	//parent.loadMenuFrame(onlyMenu)
}

// ���ɶԻ�������
fnav.createDialogContent=function(){
	var html = '<div title="������Ŀѡ��" id="' + fnav.divName + '" style="padding:0;">'
	html += '<div id="privilegeTreeDiv" onselectstart="return false"' 
	html += ' style="height:400px;padding:0px;overflow:auto;text-align:left;"></div>' 
	//html += '<br/>'
	html += '</div>'
	return html
}

function priItemClick()
{
	event.srcElement.previousSibling.click();
}

function LoadAction()
{
	this.parent = new XMLTree_onLoad_Action;
	this.parent.load = function()
	{
		loadCheck();
	}
	return this.parent;
}

function loadCheck()
{
	var paramArray = new Array();
	paramArray.push("action="+99);
	xmlhttp.Open("POST",favoUrl+paramArray.join("&"),false)
	xmlhttp.send();
	if(isSuccess(xmlhttp))
	{
		var checkedItems = xmlhttp.responseXML.selectNodes("//rowSet");
		var oCheck;
		var oItem
		for(var i=0;i<checkedItems.length;i++)
		{
			if(isClearPri)
			{
				oItem = createNode(delPriRoot,"Pri");
				oItem.setAttribute("id",checkedItems[i].getAttribute("id"));
			}
			else
			{
				oItem = document.getElementById(checkedItems[i].getAttribute("id"));
				if(oItem)
				{
					oCheck = oItem.previousSibling;
					if(oCheck!=null){
						$(oCheck).attr('id', oItem.id)
						oCheck.checked = true;
						$('#' +oItem.id ).attr('checked', true);
					}					
				}
			}
		}
		isClearPri = false;
	}
	else
	{
		//window.close();
	}
}

function CheckAction()
{
	this.parent = new XMLTree_onCheckBoxClick_Action;
	this.parent.check = function(oCheckBox,oItem)
	{	
		$(oCheckBox).attr('id', oItem.id)
		if(oItem.FRONT_TYPE == 901)
		{
			var priId = oItem.id;
			TagName = "Pri";
			if(oCheckBox.checked)
			{
				ctrlXMLNode(delPriRoot,addPriRoot,TagName,priId);
			}
			else
			{
				ctrlXMLNode(addPriRoot,delPriRoot,TagName,priId);
			}
		}
	}
	return this.parent;
}

function onBoxClickOver(){
	//fnav.onOk()
}

function choosePri()
{
	if(!isLoadPri)
	{
		privilegeTree.showAt(privilegeTreeDiv);
		isLoadPri = true;
		iniPriXML();
	}
}

function iniPriXML()
{
	delPriRoot = delPri.createElement("DelPri");
	delPri.appendChild(delPriRoot);
	addPriRoot = addPri.createElement("AddPri");
	addPri.appendChild(addPriRoot);
}
