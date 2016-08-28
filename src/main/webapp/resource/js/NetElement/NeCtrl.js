var NE_CTRL_JS_NAME = 'NeCtrl.js'
var NE_CTRL_ACTION = getRealPath("../../../servlet/NeCtrlOper?",NE_CTRL_JS_NAME);
var NE_CTRL_RESULT = getRealPath("../../../servlet/NeCtrlResult?",NE_CTRL_JS_NAME);
var NE_STATE ={UNSEND:'10',HANDING:'20',TIMEOUT:'30',SUCCEED:'40',FAIL:'50',CALLFAIL:'60'};
var NE_STATE_CN = {10:"������...",20:'������...',30:'����ʱ',40:'����ɹ�',50:'����ʧ��',60:'����ɹ��ص�ʧ��'};
var NE_CTRL_RESULT_PARA = "resizable=yes;dialogwidth:800px;dialogheight:500px;status:no;help:no;";
var RE_HAS_FILE_TAG = /\[FILEID\]\d+/;

function getNeCtrlList(neId,iClass)
{
	if(!iClass)
	{
		iClass = 1;
	}
	var	xmlReturn;
	var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
	var sendParams = ["OperType=13","neId="+neId,"class="+iClass];
	var sendUrl = getSendUrl(NE_CTRL_ACTION,sendParams);
	xmlRequest.open("post",sendUrl,false);
	xmlRequest.send();
	if(isSuccess(xmlRequest))
	{
		xmlReturn = xmlRequest.responseXML;
	}
	return xmlReturn;
}

function hasFileTag(remark)
{
	return remark.match(RE_HAS_FILE_TAG) != null;
}

function NeCtrl()
{
	this.neId;
	this.kpiId;
	this.ctrlName;
	this.msgId;
	this.msgXml;
	this.state;
	this.stateCN;
	this.file;
	this.oTime;
	this.time = 2000;
	this.onStateChange;
	this.onRun;
	this.onError;
	this.onSuccess;
}

NeCtrl.prototype.send = function()
{
	var self = this;
	var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
	var sendParams = ["OperType=10","neId="+this.neId,"kpiId="+this.kpiId];
	var sendUrl = getSendUrl(NE_CTRL_ACTION,sendParams);
	xmlRequest.open("post",sendUrl,true);
	xmlRequest.onreadystatechange = function ()
	{
		if(xmlRequest.readyState==4)
		{
			if(isSuccess(xmlRequest))
			{
				self.msgId = xmlRequest.responseXML.selectSingleNode("/root/msgId").text;
				self.getCtrlMsg();
			}
			else if(typeof self.onError=="function")
			{
				self.stateCN = '���ɿ����������!'
				self.onError();
			}
		}
	}
	xmlRequest.send();
	if(typeof this.onRun == "function")
	{
		this.onRun();
	}
}

NeCtrl.prototype.getCtrlMsg = function()
{
	var self = this;
	var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
	var sendParams = ["OperType=11","msgId="+this.msgId];
	var sendUrl = getSendUrl(NE_CTRL_ACTION,sendParams);
	xmlRequest.open("post",sendUrl,true);
	xmlRequest.onreadystatechange = function ()
	{
		self.doMsgStateChange(xmlRequest);
	}
	xmlRequest.send();
}

NeCtrl.prototype.doMsgStateChange = function (sendRequest)
{
	if(sendRequest.readyState==4)
	{
		if(isSuccess(sendRequest))
		{			    
			var oResponseXml = sendRequest.responseXML;
			var _state = oResponseXml.selectSingleNode('/root/rowSet/STATE').text;
			if((this.state != _state) && (typeof this.onStateChange == 'function'))
			{
				this.onStateChange();
			}
			this.state = _state;
			this.stateCN = NE_STATE_CN[this.state];
			this.file = oResponseXml.selectSingleNode('/root/rowSet/BACK_VALUE').text;
			this.doMsgState();
		}
		else
		{
		    this.stop();
		    if(typeof this.onError=="function")
			{
				this.stateCN = '��ȡ��������״̬����!'
				this.onError();
			}
		}
	}
}

NeCtrl.prototype.doMsgState = function ()
{
	if(this.state == NE_STATE.UNSEND || this.state == NE_STATE.HANDING)
	{
		var self = this;
		var oTimeFunc = function ()
		{
			self.getCtrlMsg();
		}
		this.oTime = window.setTimeout(oTimeFunc,this.time);
	}
	else if(this.state == NE_STATE.SUCCEED)
	{
		(typeof this.onSuccess == "function")?this.onSuccess():this.showResult();
	}
	else if(typeof this.onError=="function")
	{
		this.onError();
	}
}

NeCtrl.prototype.showResult = function ()
{
	var sendParams = ["file="+this.file,"ctrlName="+encodeURIComponent(this.ctrlName)];
	var sendUrl = getSendUrl(NE_CTRL_RESULT,sendParams);
    window.showModelessDialog(sendUrl,null,NE_CTRL_RESULT_PARA);
}

NeCtrl.prototype.stop = function ()
{
	window.clearTimeout(this.oTime);
}
