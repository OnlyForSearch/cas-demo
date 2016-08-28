var selfName = "CfgTreePri.js";
var cfgTreePage = getRealPath("Dialog/privilege/config.html?", selfName);
var actionUrl = getRealPath("../../../servlet/PermissionAction?", selfName);
var param;

function configTreePri(cfgName, primaryId, priConfig)
{
/*	if(!Is_Insert_Privilege_Table(cfgName, primaryId))
		return;
*/
	var dialogsFeatures = "dialogWidth=650px;dialogHeight=470px;help=0;scroll=0;status=0;"
	var param = ["cfgName=" + cfgName, "primaryId=" + primaryId];
	return window.showModalDialog(getSendUrl(cfgTreePage, param), priConfig,
			dialogsFeatures);
}

function hasPrivilege(cfgName, primaryId, priVal)
{
	param = new Array();
	param.push("action=6");
	param.push("cfgName=" + cfgName);
	param.push("primaryId=" + primaryId);
	param.push("priVal=" + priVal);
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open('post', actionUrl + param.join('&'), false);
	xmlhttp.send();
	if (isSuccess(xmlhttp))
	{
		if(!xmlhttp.responseXML.selectSingleNode("/root/IS_HAS"))
			return false;
		else
			return (xmlhttp.responseXML.selectSingleNode("/root/IS_HAS").text == 'true');
	}else{
      return false;
    }

}

function Is_Insert_Privilege_Table(cfgName, primaryId)
{
	if(cfgName != 'NET_ELEMENT')
		return true;
	
	param = new Array();
	param.push("action=8");
	param.push("cfgName=" + cfgName);
	param.push("primaryId=" + primaryId);
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open('post', "../../../servlet/PermissionAction?" + param.join('&'), false);
	xmlhttp.send();
	if (isSuccess(xmlhttp))
	{
		if(!(xmlhttp.responseXML.selectSingleNode("/root/IS_INSERT").text == 'true')){
			EMsg("配置项除进程(服务)外，权限不落地");
			return false;
		}
	}
	
	return true;
}