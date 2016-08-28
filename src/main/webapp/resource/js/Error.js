//定义默认语言资源
var errorJSDefaultLang = {
	verificationCodeError : '验证码错误',
	logOutMsg : '您已经退出系统,请重新登录!',
	xmlError : 'xml文档格式错误!',
	otherError : '后台程序出现异常![错误代码:',
	notNull : '的值不能为空',
	pleaseSelect : '还未选定记录,无法执行操作'
};
//获取语言资源
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
//判断后台的执行结果是否正确
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
                	top.location.href("/logout");	//自动返回到登录页面
                }
            }
        }
        else
        {
            EMsg(getErrorJsLan('xmlError'));
        }
    }else if(xmlhttp.status == 12029){  //屏蔽掉12029错误的提示<网络连接问题
    	xmlhttp.abort();
    }else if(xmlhttp.status == 12019){  //屏蔽掉12019错误的提示<网络连接问题
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
//判断后台的执行结果是否正确(新XML规范)
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
    }else if(xmlhttp.status == 12029){  //屏蔽掉12029错误的提示<网络连接问题
    	xmlhttp.abort();
    }else if(xmlhttp.status == 12019){  //屏蔽掉12019错误的提示<网络连接问题
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