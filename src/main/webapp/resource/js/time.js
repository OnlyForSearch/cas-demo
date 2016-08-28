/* =========================================================================

JavaScript Source File

NAME:  时间选择控件

AUTHOR:  方旭尘, 
DATE  : 2004-10-25

COMMENT: 

============================================================================ */
//定义默认语言资源
var timeJSDefaultLang = {
	 initializeFailed : '初始化数据错误'
};
//获取语言资源
function getTimeLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('timeJSDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.timeJS.' + code);
	}
}

function timeControl(name,timeValue,_isAddSecond)
{
	var timesValue = new Array();
	this.Id = name;
	this.obj = document.getElementById(this.Id);
	this.value = "";
	this.isAddSecond = (arguments.length==2)?true:_isAddSecond;
	if(arguments.length==1)
	{
		this.hourValue = 0;
		this.minuteValue = 0;
		this.secondValue = 0;
	}
	else
	{
		timesValue=timeValue.split(":");
		this.hourValue = parseInt(timesValue[0],10);
		this.minuteValue = parseInt(timesValue[1],10);
		if(this.isAddSecond)
		{
			this.secondValue = parseInt(timesValue[2],10);
		}
		if((this.hourValue>23||this.hourValue<0||isNaN(this.hourValue))
		     ||(this.minuteValue>59||this.minuteValue<0||isNaN(this.minuteValue))
		     ||((this.isAddSecond)&&(this.secondValue>59||this.secondValue<0||isNaN(this.secondValue))))
		{
			alert(getTimeLan('initializeFailed'));
			return false;
		}
	}
	this.hour = formatTime(this.hourValue);
	this.minute = formatTime(this.minuteValue);
	this.value = this.hour+":"+this.minute;
	if(this.isAddSecond)
	{
		this.second = formatTime(this.secondValue);
		this.value += ":"+this.second;
	}
	this.show = iniTimeControl;
	this.getValue = getTimeValue;
	this.show();
}

function getTimeValue()
{
	this.value = this.hour+":"+this.minute;
	if(this.isAddSecond)
	{
		this.value += ":"+this.second;
	}
	return this.value;
}

function iniTimeControl()
{
	var i=0;
	var inputEles = new Array();
	inputEles.length = 5;
	for(i=0;i<5;i++)
		inputEles[i] = document.createElement("input");
	this.table = document.createElement("table");
	this.table.style.border="1px solid #999999";
	this.table.border=0;
	this.table.cellSpacing=0;
	this.table.cellPadding=0;
	var oTR1 = this.table.insertRow();
	var oTDs = new Array();
	oTDs.length=7;
	for(i=0;i<6;i++)
	{
		oTDs[i] = oTR1.insertCell();
		oTDs[i].rowSpan = 2;
	}
	oTDs[i] = oTR1.insertCell();
	for(i=0;i<3;i++)
	{
		inputEles[i].type="text";
		inputEles[i].size="2";
		inputEles[i].maxLength="2";
		inputEles[i].timeEle = this;
		inputEles[i].style.border="0px solid black";
		inputEles[i].style.textAlign="right";
		inputEles[i].style.imeMode="disabled";
		inputEles[i].id="Time_"+inputEles[i].uniqueID;
		inputEles[i].attachEvent ("ondragenter",returnFalse);
		inputEles[i].attachEvent ("onpaste",returnFalse);
		inputEles[i].attachEvent ("onkeypress",eleKeyPress);
		inputEles[i].attachEvent ("onkeyup",eleKeyUp);
		inputEles[i].attachEvent ("onclick",eleClick);
		inputEles[i].attachEvent ("onblur",eleBlur);
	}
	
	for(i=3;i<5;i++)
	{
		inputEles[i].type="button";
		inputEles[i].ctrlId=inputEles[2].id;
		inputEles[i].id="Ctrl_"+inputEles[i].uniqueID;
		inputEles[i].style.width="18px";
		inputEles[i].style.height="9px";
		inputEles[i].style.fontFamily="Webdings";
		inputEles[i].style.fontSize="9px";
		inputEles[i].style.lineHeight="2px";
		inputEles[i].style.backgroundColor="#D4D0C8";
		inputEles[i].style.paddingLeft="2px";
		inputEles[i].attachEvent ("onfocus",arrowFocus);
	}


	inputEles[0].value = this.hour;
	inputEles[0].ctrlDecId = inputEles[3].id
	inputEles[0].ctrlAddId = inputEles[4].id
	inputEles[0].ctrlTag = "hour";
	inputEles[0].radix = "23";
	oTDs[0].appendChild(inputEles[0]);

	oTDs[1].innerHTML=":";

	inputEles[1].value = this.minute;
	inputEles[1].radix = "59";
	inputEles[1].ctrlDecId = inputEles[3].id
	inputEles[1].ctrlAddId = inputEles[4].id
	inputEles[1].ctrlTag = "minute";
	oTDs[2].appendChild(inputEles[1]);

	oTDs[3].innerHTML=":";

	inputEles[2].value = this.second;
	inputEles[2].radix = "59";
	inputEles[2].ctrlDecId = inputEles[3].id
	inputEles[2].ctrlAddId = inputEles[4].id
	inputEles[2].ctrlTag = "second";
	oTDs[4].appendChild(inputEles[2]);

	oTDs[5].width="20";
	
	inputEles[3].value = "5";
	inputEles[3].attachEvent ("onclick",decTime);
	oTDs[6].appendChild(inputEles[3]);

	var oTR2 = this.table.insertRow();
	var oTD2 = oTR2.insertCell();
	inputEles[4].value = "6";
	inputEles[4].attachEvent ("onclick",addTime);
	oTD2.appendChild(inputEles[4]);
	if(!this.isAddSecond)
	{
		oTDs[3].removeNode(true);
		oTDs[4].removeNode(true);
	}
	this.obj.appendChild(this.table);
}

function formatTime(timeStr)
{
	timeStr = timeStr.toString();
	if(timeStr.length==0)
		timeStr = "00";
	if(timeStr.length==1)
		timeStr = "0"+timeStr;
    return timeStr;
}

function returnFalse()
{
	return false;
}

function eleClick()
{
	event.srcElement.select();
	document.getElementById(event.srcElement.ctrlDecId).ctrlId=event.srcElement.id;
	document.getElementById(event.srcElement.ctrlAddId).ctrlId=event.srcElement.id;
}

function eleKeyPress()
{
	if (!/[0-9]/.test(String.fromCharCode(event.keyCode))) 
		event.keyCode=0
}

function eleKeyUp()
{
	var timeValue = parseInt(event.srcElement.value);
	var timeRadix = parseInt(event.srcElement.radix);
	if (timeValue>timeRadix||timeValue<0) 
	{
		event.srcElement.value = event.srcElement.value.substr(0,1);
	}
}

function eleBlur()
{
	event.srcElement.value = formatTime(event.srcElement.value);
	eval("event.srcElement.timeEle."+event.srcElement.ctrlTag+"=event.srcElement.value");
}

function arrowFocus()
{
	document.getElementById(event.srcElement.ctrlId).select();
}

function decTime()
{
	var ctrlElement = document.getElementById(event.srcElement.ctrlId);
	var timeVal = parseInt(ctrlElement.value);
	timeVal--;
	if(timeVal<0)
		timeVal = parseInt(ctrlElement.radix);
	ctrlElement.value = formatTime(timeVal);
	eval("ctrlElement.timeEle."+ctrlElement.ctrlTag+"=ctrlElement.value");
}

function addTime()
{
	var ctrlElement = document.getElementById(event.srcElement.ctrlId);
	var timeVal = parseInt(ctrlElement.value);
	timeVal++;
	if(timeVal>parseInt(ctrlElement.radix))
		timeVal = 0;
	ctrlElement.value = formatTime(timeVal);
	eval("ctrlElement.timeEle."+ctrlElement.ctrlTag+"=ctrlElement.value");
}