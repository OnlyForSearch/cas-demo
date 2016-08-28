var INPUT = 2;	//普通输入框
var CALENDAR = 3; //日期输入框
var SELECT = 4; //下拉菜单
var INPUT_INT = 5;//数字输入框
var PASSED = 6;//密码输入框

var ATT_URL = "../../servlet/netElementManage?";
var ATT_PREFIX = "att_";
var DEFAULT_GROUP_NAME = "未分组网元属性";

function NetElementAtt(typeId)
{
	this.isLoad = false;
	this.oAttXML = null;
	this.attElementList = null;
	this.attGroupMap = new Map();
	this.isReadOnly = false;
	this.neId = -1;
	this.getAttXML(typeId);
}

NetElementAtt.prototype.getAttXML = function (typeId)
{
	var xmlRequst = new ActiveXObject("Microsoft.XMLHTTP");
	var sendParam = new Array("action=0","typeId="+typeId);
	var sendUrl = getSendUrl(ATT_URL,sendParam);
	xmlRequst.Open("POST",sendUrl,false);
	xmlRequst.send("");
	this.isLoad = isSuccess(xmlRequst);
	if(this.isLoad)
	{
		this.oAttXML = new ActiveXObject("Microsoft.XMLDOM"); 
		this.oAttXML.async = false;
		this.oAttXML.load(xmlRequst.responseXML);
	}
	xmlRequst.abort();
	xmlRequst = null;
}

NetElementAtt.prototype.getAttElement = function (oNode)
{
	var oElement;
	var id = oNode.getAttribute("id");
	var label = oNode.selectSingleNode("ATTR_CHARACTER").text;
	var type = parseInt(oNode.selectSingleNode("ATTR_VALUE_TYPE_ID").text,10);
	var IsRequired = oNode.selectSingleNode("ALLOW_NULL_FLAG").text;
	var group = oNode.selectSingleNode("ATTR_GROUP_NAME").text;
	var sql = oNode.selectSingleNode("ATTR_SELECT_SQL").text
	var isAttReadOnly = this.isReadOnly || (oNode.selectSingleNode("ALLOW_UPDATE_FLAG").text=="0BT")
	//var isAttReadOnly = this.isReadOnly;
	var checkFunc = oNode.selectSingleNode("CHECK_FUNC").text;
	switch(type)
	{
		case INPUT:
			oElement = new NEAttInput(id,label,type,IsRequired,group,isAttReadOnly,this.neId,checkFunc);
			break;
		case CALENDAR:
			oElement = new NEAttCalendar(id,label,type,IsRequired,group,isAttReadOnly,this.neId,checkFunc);
			break;
		case SELECT:
			oElement = new NEAttSelect(id,label,type,IsRequired,group,isAttReadOnly,this.neId,checkFunc,sql);
			break;
		case INPUT_INT:
			oElement = new NEAttInputInt(id,label,type,IsRequired,group,isAttReadOnly,this.neId,checkFunc);
			break;
		case PASSED:
			oElement = new NEAttPasswd(id,label,type,IsRequired,group,isAttReadOnly,this.neId,checkFunc);
			break;
	}
	return oElement;
}

NetElementAtt.prototype.show = function (oElement)
{
	if(this.isLoad)
	{
		var outHTML = '<div>';
		var attNodeList = this.oAttXML.selectNodes('/root/rowSet');
		this.attElementList = new Array(attNodeList.length);
		var oAttElement;
		for(var i=0;i<attNodeList.length;i++)
		{
			oAttElement = this.getAttElement(attNodeList[i]);
			this.attElementList[i] = oAttElement;
			var groupHtml = this.attGroupMap.getByKey(oAttElement.group);
			if(groupHtml==null)
			{
				groupHtml =   '<div style="height:26">'
						  +     '<IMG src="../../resource/image/form_title_item.gif" align="baseline">'
						  +     '<span style="height:100%;padding:11 0 0 6;font-weight:bold;color:#716D63">'
						  +       oAttElement.group
						  +     '</span>'
						  +   '</div>'
			}
			groupHtml +=  '<div style="padding:0 16 0 16">'
			           +    '<div style="height:26">'
			           +     '<IMG src="../../resource/image/arrow.gif" align="absmiddle">'
			           +     '<NOBR style="color:#7A7672;height:100%;width:180;overflow:hidden;text-overflow:ellipsis;padding:7 0 0 6">'
			           +       oAttElement.label
			           +     '</NOBR>'
			           +     '<span style="height:100%">'
			           +       oAttElement.show()
			           +     '</span>'
			           +   '</div>'
			           +   '<div style="width:100%;height:1;overflow:hidden;background:url(../../resource/image/dashed.gif)"></div>'
			           + '</div>'
			this.attGroupMap.put(oAttElement.group,groupHtml);
		}
		for(var i=0;i<this.attGroupMap.length;i++)
		{
			outHTML += this.attGroupMap.getByIndex(i)
		}
		outHTML += '</div>';
		oElement.innerHTML = outHTML;
	}
}

NetElementAtt.prototype.load = function (netElementId)
{
	this.neId = netElementId;
	if(this.isLoad)
	{
		var xmlRequst = new ActiveXObject("Microsoft.XMLHTTP");
		var sendParam = new Array("action=7","id="+netElementId);
		var sendUrl = getSendUrl(ATT_URL,sendParam);
		xmlRequst.Open("POST",sendUrl,false);
		xmlRequst.send("");
		if(isSuccess(xmlRequst))
		{
			for(var i=0;i<this.attElementList.length;i++)
			{
				var oAttElement = this.attElementList[i];
				var oAttNode = xmlRequst.responseXML.selectSingleNode('/root/rowSet[@id="'+oAttElement.id+'"]');
				if(oAttNode)
				{
					oAttElement.setValue(oAttNode.firstChild.text);
				}
				oAttElement.neId = this.neId;
			}
			return true;
		}
		else
		{
			return false;
		}
	}
}

NetElementAtt.prototype.setValue = function(key,value)
{
	for(var i=0;i<this.attElementList.length&&this.attElementList[i].id != key; i++);
	if(i!=this.attElementList.length)
	{
		this.attElementList[i].setValue(value);
	}
}

NetElementAtt.prototype.isEdit = function ()
{
	for(var i=0;i<this.attElementList.length&&!this.attElementList[i].isEdit();i++);
	return (i!=this.attElementList.length);
}

NetElementAtt.prototype.check = function ()
{
	for(var i=0;i<this.attElementList.length&&this.attElementList[i].check();i++);
	return (i==this.attElementList.length);
}

NetElementAtt.prototype.toXML = function (oXML)
{
	var root = oXML.documentElement;
	for(var i=0;i<this.attElementList.length;i++)
	{
		oAttElement = netAtt.attElementList[i];
		oAttNode = oXML.selectSingleNode("//NET_ATT[@id="+oAttElement.id+"]");
		if(oAttNode)
		{
			oAttNode.text = oAttElement.getValue();
		}
		else
		{
			oAttNode = oXML.createElement("NET_ATT");
			oAttNode.setAttribute("id",oAttElement.id);
			oAttNode.setAttribute("type",oAttElement.type);
			oAttNode.text = oAttElement.getValue();
			root.appendChild(oAttNode);
		}
	}
}

NetElementAtt.prototype.reload = function ()
{
	for(var i=0;i<this.attElementList.length;i++)
	{
		netAtt.attElementList[i].reload();
	}
}

NetElementAtt.prototype.clearData = function()
{
	for(var i=0;i<this.attElementList.length;i++)
	{
		netAtt.attElementList[i].setValue("");
	}
}

function NEAtt(id,label,type,IsRequired,group,isReadOnly,neId,checkFunc)
{
	this.id = id;
	this.elementId = ATT_PREFIX + id;
	this.label = label;
	this.type = type;
	this.IsRequired = (IsRequired!="0BT");
	this.group = group;
	this.isReadOnly = isReadOnly;
	this.neId = neId;
	this.checkFunc = checkFunc;
	if(!this.group)
	{
		this.group = DEFAULT_GROUP_NAME;
	}
	this.initValue = "";
}

NEAtt.prototype.setValue = function (value)
{
	this.initValue = value;
	if(this.isReadOnly)
	{
		document.getElementById(this.elementId).innerText = value;
	}
	else
	{
		document.getElementById(this.elementId).value = value;
	}
}

NEAtt.prototype.getValue = function ()
{
	if(this.isReadOnly)
	{
		return this.initValue;
	}
	else
	{
		return document.getElementById(this.elementId).value;
	}
}

NEAtt.prototype.isEdit = function ()
{
	return (this.initValue != this.getValue());
}

NEAtt.prototype.check = function ()
{
	if(this.IsRequired && !this.getValue().hasText())
	{
		EMsg('"'+this.label+'"的值不能为空');
		return false;
	}
	else
	{
		if(this.checkFunc)
		{
			return eval(this.checkFunc);
		}
		else
		{
			return true;
		}
	}
}

NEAtt.prototype.reload = function ()
{
	this.initValue = this.getValue();
}

NEAtt.prototype.show = function ()
{
	var sReturn;
	if(this.isReadOnly)
	{
		sReturn = '<span id="'+this.elementId+'" style="height:100%;width:200;overflow:hidden;text-overflow:ellipsis;padding-top:7"></span>';
	}
	else
	{
		sReturn = this._show();
		if(this.IsRequired)
		{
			sReturn += '<span style="color:red;height:100%;padding:8 0 0 3">*</span>';
		}
	}
	return sReturn;
}

//2:INPUT 普通输入框
function NEAttInput(id,label,type,IsRequired,group,isReadOnly,neId,checkFunc)
{
	NEAtt.call(this,id,label,type,IsRequired,group,isReadOnly,neId,checkFunc);
}
NEAttInput.prototype = new NEAtt();
NEAttInput.prototype._show = function ()
{
	return '<INPUT type="text" class="input" id="'+this.elementId+'" style="vertical-align:text-bottom;width:200;margin-top:3;">';
}

//3: CALENDAR 日期输入框
function NEAttCalendar(id,label,type,IsRequired,group,isReadOnly,neId,checkFunc)
{
	NEAtt.call(this,id,label,type,IsRequired,group,isReadOnly,neId,checkFunc);
}
NEAttCalendar.prototype = new NEAtt();
NEAttCalendar.prototype._show = function ()
{
	return '<IE:CalendarIpt class=DPFrame id="'+this.elementId+'"/>';
}

//4: SELECT 下拉菜单
function NEAttSelect(id,label,type,IsRequired,group,isReadOnly,neId,checkFunc,sql)
{
	NEAtt.call(this,id,label,type,IsRequired,group,isReadOnly,neId,checkFunc);
	this.sql = sql;
	this.optionXML = null;
	var xmlRequst = new ActiveXObject("Microsoft.XMLHTTP");
	var sendParam = new Array("action=101","paramValue="+getAESEncode(encodeURIComponent(this.sql)));
	var sendUrl = getSendUrl(ATT_URL,sendParam);
	xmlRequst.Open("POST",sendUrl,false);
	xmlRequst.send("");
	if(isSuccess(xmlRequst))
	{
		this.optionXML = new ActiveXObject("Microsoft.XMLDOM"); 
		this.optionXML.async = false;
		this.optionXML.load(xmlRequst.responseXML);
	}
}
NEAttSelect.prototype = new NEAtt();
NEAttSelect.prototype._show = function ()
{
	var outHTML = '<select style="width:200;vertical-align:text-bottom;margin-top:3" id="'+this.elementId+'">'
	if(this.optionXML)
	{
		var selectList = this.optionXML.selectNodes("//rowSet");
		var key = "";
		var value = "";
		for(var i=0;i<selectList.length;i++)
		{
			with(selectList[i])
			{
				key = getAttribute("id");
				value = firstChild.text;
			}
			outHTML += '<option value="'+key+'">'+value+'</option>';
		}
	}
	outHTML += '</select>';
	return outHTML;
}
NEAttSelect.prototype.setValue = function (value)
{
	this.initValue = value;
	if(this.isReadOnly)
	{
		var text = "";
		if(this.optionXML)
		{
			var optionNode = this.optionXML.selectSingleNode('/root/rowSet[@id="'+value+'"]');
			if(optionNode)
			{
				text = optionNode.firstChild.text;
			}
		}
		document.getElementById(this.elementId).innerText = text;
	}
	else
	{
		var optionList = document.getElementById(this.elementId).options;
		for(var i=0;i<optionList.length&&optionList[i].value != value;i++);
		if(i!=optionList.length)
		{
			optionList[i].selected = true;
		}
	}
}
NEAttSelect.prototype.getValue = function ()
{
	if(this.isReadOnly)
	{
		return this.initValue;
	}
	else
	{
		var oSelectElement = document.getElementById(this.elementId);
		return (oSelectElement.selectedIndex==-1)?"":oSelectElement.options[oSelectElement.selectedIndex].value;
	}
}

//5: INPUT_INT 数字输入框
function NEAttInputInt(id,label,type,IsRequired,group,isReadOnly,neId,checkFunc)
{
	NEAttInput.call(this,id,label,type,IsRequired,group,isReadOnly,neId,checkFunc);
}
NEAttInputInt.prototype = new NEAttInput();
NEAttInputInt.prototype.check = function ()
{
	var isCheck = NEAttInput.prototype.check.apply(this, arguments);
	if(isCheck && !this.getValue().is_num())
	{
		EMsg('"'+this.label+'"只支持数字类型!');
		isCheck = false;
	}
	return isCheck;
}

//6: PASSED 密码输入框
function NEAttPasswd(id,label,type,IsRequired,group,isReadOnly,neId,checkFunc)
{
	NEAtt.call(this,id,label,type,IsRequired,group,isReadOnly,neId,checkFunc);
}
NEAttPasswd.prototype = new NEAtt();
NEAttPasswd.prototype.show = function ()
{
	if(this.isReadOnly)
	{
		sReturn = '<INPUT type="password" id="'+this.elementId+'" style="vertical-align:text-bottom;width:200;margin-top:3;border:0px">';
	}
	else
	{
		sReturn = '<INPUT type="password" class="input" id="'+this.elementId+'" style="vertical-align:text-bottom;width:200;margin-top:3;">';
		if(this.IsRequired)
		{
			sReturn += '<span style="color:red;height:100%;padding:8 0 0 3">*</span>';
		}
	}
	return sReturn;
}
NEAttPasswd.prototype.setValue = function (value)
{
	this.initValue = value;
	document.getElementById(this.elementId).innerText = value;
}

function checkUniqueIP(oNetAtt,attIds)
{
	var isCheck = true;
	var xmlRequst = new ActiveXObject("Microsoft.XMLHTTP");
	var sendParam = new Array(4);
	sendParam[0] = "action=29";
	sendParam[1] = "attIds="+attIds;
	sendParam[2] = "neId="+oNetAtt.neId;
	sendParam[3] = "value="+oNetAtt.getValue();
	var sendUrl = getSendUrl(ATT_URL,sendParam);
	xmlRequst.Open("POST",sendUrl,false);
	xmlRequst.send("");
	if(isSuccess(xmlRequst))
	{
		var list = xmlRequst.responseXML.selectNodes('/root/rowSet');
		if(list.length>0)
		{
			var msgs = new Array(list.length)
			for(var i=0;i<list.length;i++)
			{
				msgs[i] = "网元:"+list[i].selectSingleNode('NE_NAME').text;
			}
			EMsg('"'+oNetAtt.label+'"的值与"'+msgs.join(",")+'"重复')
			isCheck = false;
		}
	}
	else
	{
		isCheck = false;
	}
	return isCheck;
}

function checkUniqueIPandProxy(oNetAtt,attIds,attProxyIds)
{
	var isCheck = true;
	var xmlRequst = new ActiveXObject("Microsoft.XMLHTTP");
	var sendParam = new Array(4);
	sendParam[0] = "action=49";
	sendParam[1] = "attIds="+attIds;
	sendParam[2] = "neId="+oNetAtt.neId;
	sendParam[3] = "value="+oNetAtt.getValue();
	
	sendParam[4] = "attProxyIds="+attProxyIds;
	sendParam[5] = "proxy1="+document.getElementById(ATT_PREFIX+attProxyIds.split(',')[0]).value;
	sendParam[6] = "proxy2="+document.getElementById(ATT_PREFIX+attProxyIds.split(',')[1]).value;
	
	var sendUrl = getSendUrl(ATT_URL,sendParam);
	xmlRequst.Open("POST",sendUrl,false);
	xmlRequst.send("");
	if(isSuccess(xmlRequst))
	{
		var list = xmlRequst.responseXML.selectNodes('/root/rowSet');
		if(list.length>0)
		{
			var msgs = new Array(list.length)
			for(var i=0;i<list.length;i++)
			{
				msgs[i] = "网元:"+list[i].selectSingleNode('NE_NAME').text;
			}
			EMsg('"'+oNetAtt.label+'+上层节点"的值与"'+msgs.join(",")+'"重复')
			isCheck = false;
		}
	}
	else
	{
		isCheck = false;
	}
	return isCheck;
}
