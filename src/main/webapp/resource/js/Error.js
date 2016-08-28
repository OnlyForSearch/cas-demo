//����Ĭ��������Դ
var errorJSDefaultLang = {
	verificationCodeError : '��֤�����',
	logOutMsg : '���Ѿ��˳�ϵͳ,�����µ�¼!',
	xmlError : 'xml�ĵ���ʽ����!',
	otherError : '��̨��������쳣![�������:',
	notNull : '��ֵ����Ϊ��',
	pleaseSelect : '��δѡ����¼,�޷�ִ�в���'
};
//��ȡ������Դ
function getErrorJsLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('errorJSDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.errorJS.' + code);
	}
}
//�жϺ�̨��ִ�н���Ƿ���ȷ
function isSuccess(xmlhttp)
{
	var msg = false;
	if(xmlhttp.status == 200)
	{
		var errElement = getErrorCode(xmlhttp);
        if(errElement)
        {
            if(errElement.text == 0)
                msg = true;
            else
            {
                EMsg(errElement.nextSibling.text);
                if(errElement.nextSibling.text == getErrorJsLan('verificationCodeError'))
                {
                	top.location.reload();
                }
                if(errElement.nextSibling.text == getErrorJsLan('logOutMsg'))
                {
                	top.location.href("/logout");	//�Զ����ص���¼ҳ��
                }
            }
        }
        else
        {
            EMsg(getErrorJsLan('xmlError'));
        }
    }else if(xmlhttp.status == 12029){  //���ε�12029�������ʾ<������������
    	xmlhttp.abort();
    }else if(xmlhttp.status == 12019){  //���ε�12019�������ʾ<������������
    	xmlhttp.abort();
    }else{
        EMsg(getErrorJsLan('otherError')+xmlhttp.status+"]");
        xmlhttp.abort();
    }
    return msg
}

function getErrorCode(xmlhttp)
{
	return xmlhttp.responseXML.selectSingleNode("/root/error_code");
}

function checkSubmit(doc,fileds,names)
{
	for(var i=0;i<fileds.length;i++)
	{
		if(!doc.selectSingleNode("//"+fileds[i]).text.hasText())
		{
			EMsg('"'+names[i]+'"' + getErrorJsLan('notNull'));
			return false;
		}
	}
	return true;
}

function isExecute(arrSelected)
{
	var isSelected = false;
	if(	arrSelected.length==0)
	{
		EMsg(getErrorJsLan('pleaseSelect'));
	}
	else
	{
		isSelected = true;
	}
	return isSelected;
}
/**********
 * ITSM2.0*
 **********/
//�жϺ�̨��ִ�н���Ƿ���ȷ(��XML�淶)
function isSuccessNew(xmlhttp) {
    var msg = false;
    if(xmlhttp.status == 200){
        var errElement = xmlhttp.responseXML.selectSingleNode("/retVo/retCode");
        var errInfo = getErroInfo(xmlhttp).text;
        if(errElement){
            if(errElement.text == 0){
                msg = true;
            }else{
                EMsg(errElement.nextSibling.text);
            }
        }else{
            EMsg(getErrorJsLan('xmlError'), errInfo);
        }
    }else if(xmlhttp.status == 12029){  //���ε�12029�������ʾ<������������
    	xmlhttp.abort();
    }else if(xmlhttp.status == 12019){  //���ε�12019�������ʾ<������������
    	xmlhttp.abort();
    }else{
        EMsg(getErrorJsLan('otherError')+xmlhttp.status+"]");
        xmlhttp.abort();
    }
    return msg
}

function getErroInfo(xmlhttp)
{
    var errInfo = xmlhttp.responseXML.selectSingleNode("/root/info");
    if(errInfo == null){
        return "";
    }
    return errInfo;
}