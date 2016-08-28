var INPUT_HIDDEN = 0;	//隐藏输入框
var INPUT = 1;	//普通输入框
var INPUT_INT = 2; //整型输入框
var INPUT_FLOAT = 3; //浮点型输入框
var CALENDAR = 4; //日期输入框
var SELECT_SINGLE = 5; //下拉菜单
var SELECT_STAFF = 6;//员工选择框
var ORG_TREE = 7;//组织树
var DOMAIN_SELECT = 8 //域选择
var SELECT_MULTIPLE = 9 //多选
var SELECT_STAFF_MULTIPLE = 10 //员工选择框(多选)
var INPUT_CONTAIN = 11 //模糊匹配输入框
var TREE = 12 //树的下拉菜单
var DB_TREE = 13 //动态树

var EXEC_SQL_URL = "../../servlet/@Deprecated/ExecServlet?";
var QUERY_URL = '../../servlet/QueryAction?';
var QUERY_PARAMS_URL = QUERY_URL+'action=1&id=';
var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var sendParams;
var sendUrl;

function Params()
{
	this.paramList = new Array();
	this.inputParamList = new Array();
	this.length = 0;
}

Params.prototype.loadParamXml = function(oXML)
{
	var paramNodeList = oXML.selectNodes('/root/rowSet');
	for(var i=0;i<paramNodeList.length;i++)
	{
		var oParam = this.createParam(paramNodeList[i]);
		this.paramList.push(oParam);
		if(oParam.type == "IN")
		{
			this.inputParamList.push(oParam);
		}
	}
	this.length = this.inputParamList.length;
}

Params.prototype.createParam = function (paramElement)
{
	var param;
	var name = paramElement.selectSingleNode("PARAM_NAME").text;
	var type = paramElement.selectSingleNode("PARAM_TYPE").text;
	var dataType = paramElement.selectSingleNode("DATA_TYPE").text;
	var showType = paramElement.selectSingleNode("SHOW_TYPE").text;
	var sql = paramElement.selectSingleNode("PARAM_SQL").text;
	var label = paramElement.selectSingleNode("DISPLAY_NAME").text;
	var eventName = paramElement.selectSingleNode("EVENT_NAME").text;
	var eventHandle = paramElement.selectSingleNode("EVENT_SCRIPT").text;
	showType = parseInt(showType,10);
	switch(showType)
	{
		case INPUT_HIDDEN:
			param = new ParamInputHidden(name,dataType,type,label,showType);
			break;
		case INPUT:
			param = new ParamInput(name,dataType,type,label,showType);
			break;
		case INPUT_INT:
			param = new ParamInputInt(name,dataType,type,label,showType);
			break;
		case INPUT_FLOAT:
			param = new ParamInputFloat(name,dataType,type,label,showType);
			break;
		case CALENDAR:
			param = new ParamCalendar(name,dataType,type,label,showType);
			break;
		case SELECT_SINGLE:
			param = new ParamSelectSingle(name,dataType,type,label,sql,eventName,eventHandle,showType);
			break;
		case SELECT_STAFF:
			param = new ParamSelectStaff(name,dataType,type,label,showType);
			break;
		case ORG_TREE:
			param = new ParamOrgTree(name,dataType,type,label,showType);
			break;
		case DOMAIN_SELECT:
			param = new ParamDomainSelect(name,dataType,type,label,sql,showType);
			break;
		case SELECT_MULTIPLE:
			param = new ParamSelectMultiple(name,dataType,type,label,sql,showType);
			break;
		case SELECT_STAFF_MULTIPLE:
			param = new ParamSelectStaffMultiple(name,dataType,type,label,showType);
			break;
		case INPUT_CONTAIN:
			param = new ParamInputContain(name,dataType,type,label,showType);
			break;
		case TREE:
			sendParams = new Array(2);
			sendParams[0] = "action=2";
			sendParams[1] = "sql="+encodeURIComponent(sql);
			param = new ParamTree(name,dataType,type,label,getSendUrl(EXEC_SQL_URL,sendParams),showType);
			break;
		case DB_TREE:
			param = new ParamDBTree(name,dataType,type,label,sql,showType);
			break;
	}
	return param;
}

Params.prototype.show = function ()
{
	var outHTML = "";
	outHTML += '<TABLE border="0" cellpadding="3" cellspacing="1" width="100%">';
	for(var i=0;i<this.inputParamList.length;i++)
	{
		var param = this.inputParamList[i];
		if(param.showType!=INPUT_HIDDEN)
		{
			outHTML += '<TR>'
				+	 '<TD width="11"><IMG src="../../resource/image/arrow.gif"></TD>'
				+	 '<TD width="66" style="padding-top:4px"><span class="title">'+param.label+':</span></TD>'
				+	 '<TD>'+param.show()+'</TD>'
				+  '</TR>'
				+  '<TR>'
				+  	 '<TD colspan="3" background="../../resource/image/dashed.gif"></TD>'
				+  '</TR>'
		}
		else
		{
			outHTML += param.show();
		}
	}
	outHTML += '</TABLE>';
	return outHTML;
}

Params.prototype.getParamXML = function ()
{
	try
	{
		var paramDom = new ActiveXObject("Microsoft.XMLDOM");
		var paramRoot = paramDom.createElement("params");
		var param,paramNode;
		paramDom.appendChild(paramRoot);
		for(var i=0;i<this.paramList.length;i++)
		{
			param = this.paramList[i];
			paramNode = createNode(paramRoot,"param");
			paramNode.setAttribute("name",param.name);
			paramNode.setAttribute("type",param.dataType);
			paramNode.setAttribute("isMultiple",param.isMultiple);
			if(param.type == "IN")
			{
				paramNode.text = param.getValue();
			}
		}
		return paramDom.xml;
	}
	catch(e)
	{
		throw e;
	}
}

Params.prototype.reset = function ()
{
	for(var i=0;i<this.paramList.length;i++)
	{
		param = this.paramList[i];
		param.reset();
	}
}

function Param(_name,_dataType,_type,_label,_showType)
{
	this.id = document.uniqueID;
	this.name = _name;
	this.dataType = _dataType;
	this.type = _type;
	this.label = _label;
	this.isMultiple = false;
	this.showType = _showType;
}

Param.prototype.getValue = function ()
{
	return document.getElementById(this.id).value;
}

Param.prototype.reset = function()
{
	if(this.showType==6||this.showType==10){
		document.getElementById("oName_"+this.id).value="";
		document.getElementById(this.id).value="";
	}else{
		document.getElementById(this.id).value="";
	}
}

function ParamInputHidden(_name,_dataType,_type,_label,_showType)
{
	Param.call(this,_name,_dataType,_type,_label,_showType);
	this.showType = _showType;
}
ParamInputHidden.prototype = new Param();
ParamInputHidden.prototype.show = function ()
{
	return '<INPUT type="hidden" id="'+this.id+'">';
}

function ParamInput(_name,_dataType,_type,_label,_showType)
{
	Param.call(this,_name,_dataType,_type,_label,_showType);
}
ParamInput.prototype = new Param();
ParamInput.prototype.show = function ()
{
	return '<INPUT type="text" class="input" style="width:100%" id="'+this.id+'">';
}

function ParamInputInt(_name,_dataType,_type,_label,_showType)
{
	ParamInput.call(this,_name,_dataType,_type,_label,_showType);
}
ParamInputInt.prototype = new ParamInput();
ParamInputInt.prototype.getValue = function ()
{
	var value = ParamInput.prototype.getValue.apply(this, arguments);
	if(!value.is_num())
	{
		throw '"'+this.label+'"只支持整型数字!';
	}
	return value;
}

function ParamInputFloat(_name,_dataType,_type,_label,_showType)
{
	ParamInput.call(this,_name,_dataType,_type,_label,_showType);
}
ParamInputFloat.prototype = new ParamInput();
ParamInputFloat.prototype.getValue = function ()
{
	var value = ParamInput.prototype.getValue.apply(this, arguments);
	if(value!="" && !value.is_float())
	{
		throw '"'+this.label+'"只支持浮点型!';
	}
	return value;
}

function ParamInputContain(_name,_dataType,_type,_label,_showType)
{
	ParamInput.call(this,_name,_dataType,_type,_label,_showType);
}
ParamInputContain.prototype = new ParamInput();
ParamInputContain.prototype.getValue = function ()
{
	var value = ParamInput.prototype.getValue.apply(this, arguments);
	return "%"+value+"%";
}

function ParamCalendar(_name,_dataType,_type,_label,_showType)
{
	Param.call(this,_name,_dataType,_type,_label,_showType);
}
ParamCalendar.prototype = new Param();
ParamCalendar.prototype.show = function ()
{
	//return '<IE:CalendarIpt class=DPFrame id="'+this.id+'"/>';
	return '<input type="text" id="' + this.id +'" name="endTime" class="Wdate" onFocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})" readonly="readonly" style="width:150px;"/>';
}

function ParamSelectSingle(_name,_dataType,_type,_label,_sql,_eventName,_eventHandle,_showType)
{
	Param.call(this,_name,_dataType,_type,_label,_showType);
	this.sql = _sql;
	this.eventName = _eventName;
	this.eventHandle = _eventHandle;	
}
ParamSelectSingle.prototype = new Param();
ParamSelectSingle.prototype.getOptions = function ()
{
	var outHTML = "";
	sendParams = new Array(2);
	sendParams[0] = "action=101";
	sendParams[1] = "paramValue="+getAESEncode(encodeURIComponent(this.sql));
	sendUrl = getSendUrl(EXEC_SQL_URL,sendParams);
	xmlhttp.Open("POST",sendUrl,false);
	xmlhttp.send("");
	if(isSuccess(xmlhttp))
	{
		var selectList = xmlhttp.responseXML.selectNodes("//rowSet");
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
	return outHTML;
}

ParamSelectSingle.prototype.show = function ()
{
	var _event = '';
	if(this.eventName!=='' && this.eventHandle!=='') {
	  try{eval('ParamSelectSingle.prototype.' + this.id + '_'+ this.eventName + '=' + this.eventHandle);}catch(e){alert(e);}
       _event = this.eventName + '="ParamSelectSingle.prototype.' + this.id + '_'+ this.eventName +'(this);"';
	}
	var outHTML = '<select style="width:100%" id="'+this.id+'" name="' + this.name + '"' + _event +'>'
				+   '<option value=""></option>'
				+   this.getOptions()
				+ '</select>';
	return outHTML;
}

ParamSelectSingle.prototype.getValue = function ()
{
	var oSelectNode = document.getElementById(this.id);
	var _value = oSelectNode.options[oSelectNode.selectedIndex].value;
	if(_value.indexOf("|")>0) {
		var sL = _value.split("|");
		_value = sL[0];
	}
	return (oSelectNode.selectedIndex==-1)?"":_value;
}

function ParamSelectMultiple(_name,_dataType,_type,_label,_sql,_showType)
{
	ParamSelectSingle.call(this,_name,_dataType,_type,_label,_sql,null,null,_showType);
	this.isMultiple = true;
}
ParamSelectMultiple.prototype = new ParamSelectSingle();
ParamSelectMultiple.prototype.show = function ()
{
	var outHTML = '<select style="width:100%" id="'+this.id+'" MULTIPLE="true" size="5">'
				+   '<option value=""></option>'
				+   this.getOptions()
				+ '</select>';
	return outHTML;
}
ParamSelectMultiple.prototype.getValue = function ()
{
	var oSelectNode = document.getElementById(this.id);
	var returnList = new Array();
	for(var i=0;i<oSelectNode.options.length;i++)
	{
		if(oSelectNode.options[i].selected)
		{
			returnList.push(oSelectNode.options[i].value);
		}
	}
	return returnList.join(',');
}


function ParamSelectStaff(_name,_dataType,_type,_label,_showType)
{
	Param.call(this,_name,_dataType,_type,_label,_showType);
}
ParamSelectStaff.prototype = new Param();
ParamSelectStaff.prototype.show = function ()
{
	var outHTML = '<INPUT type="text" class="input" READONLY id="oName_'+this.id+'">&nbsp;&nbsp;'
				+ '<input type="hidden" id="'+this.id+'">'
				+ '<IE:button value="选&nbsp;择" onclick="choiceStaffToParam('+this.id+',false)"/>';	
	return outHTML;
}

function choiceStaffToParam(oStaffId,isMultiple)
{
	var oName = document.getElementById("oName_"+oStaffId.id);
	choiceStaffToElement(oName,oStaffId,isMultiple);
}

function ParamSelectStaffMultiple(_name,_dataType,_type,_label,_showType)
{
	ParamSelectStaff.call(this,_name,_dataType,_type,_label,_showType);
	this.isMultiple = true;
}
ParamSelectStaffMultiple.prototype = new ParamSelectStaff();
ParamSelectStaffMultiple.prototype.show = function ()
{
	var outHTML = '<INPUT type="text" class="input" READONLY id="oName_'+this.id+'">&nbsp;&nbsp;'
				+ '<input type="hidden" id="'+this.id+'">'
				+ '<IE:button value="选&nbsp;择" onclick="choiceStaffToParam('+this.id+',true)"/>';	
	return outHTML;
}


function ParamTree(_name,_dataType,_type,_label,_xmlUrl,_showType)
{
	Param.call(this,_name,_dataType,_type,_label,_showType);
	this.xmlUrl = _xmlUrl;
}
ParamTree.prototype = new Param();
ParamTree.prototype.show = function ()
{
	var outHTML = '<IE:tree '
				+ 'id="'+this.id+'" '
				+ 'xmlurl="'+this.xmlUrl+'"/>';
	return outHTML;
}

function ParamOrgTree(_name,_dataType,_type,_label,_showType)
{
	ParamTree.call(this,_name,_dataType,_type,_label,'../../servlet/staffmenu?action=6',_showType);
}
ParamOrgTree.prototype = new ParamTree();

function ParamDomainSelect(_name,_dataType,_type,_label,_sql)
{
	ParamSelectSingle.call(this,_name,_dataType,_type,_label,_sql,null,null);
}
ParamDomainSelect.prototype = new ParamSelectSingle();
ParamDomainSelect.prototype.getOptions = function ()
{
	var outHTML = "";
	var param = new Array();
	param.push("action=12");
	param.push("domainCode="+this.sql);
	xmlhttp.Open("POST",QUERY_URL+param.join('&'),false);
	xmlhttp.send();
	if(isSuccess(xmlhttp))
	{
		var oOptions = xmlhttp.responseXML.selectNodes('/root/option');
		for(var i=0;i<oOptions.length;i++)
		{
			outHTML += oOptions[i].xml;
		}
	}
	return outHTML;
}

function ParamDBTree(_name,_dataType,_type,_label,_cfg)
{
	Param.call(this,_name,_dataType,_type,_label);
	this.cfg = _cfg;
}
ParamDBTree.prototype = new Param();
ParamDBTree.prototype.show = function ()
{
	var outHTML = '<IE:dbTree '
				+ 'id="'+this.id+'" '
				+ 'cfg="'+this.cfg+'"/>';
	return outHTML;
}





