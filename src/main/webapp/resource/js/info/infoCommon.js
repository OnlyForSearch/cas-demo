//------------------------------------------------------------------
//------------------ 留言信息 ----------------------------------------
//------------------------------------------------------------------
function reloadMessage(dXML)
{
    //(1). 清除信息
    var datas = messages.rows;
    for(var i=datas.length-1;i>=0;i--)
    {
        datas[i].removeNode(true);
    }
    //(2). 载入信息
    var oRows = dXML.selectNodes("/root/MESSAGES/rowSet");
    var iLen = oRows.length;
    var rowObject;
    var cellObject;
    
    rowObject = messages.insertRow();
    cellObject = rowObject.insertCell();
    cellObject.noWrap=true;
    cellObject.colSpan="6";
    //cellObject.align="right";
    cellObject.style.lineHeight = "25px";
    cellObject.style.color = "#46A718";
    cellObject.innerHTML = '&nbsp;&nbsp;共<span style="border:0;color:red;text-decoration:underline;"> '+dXML.selectSingleNode("/root/MESSAGES/recordCount").text+' </span>条留言';
    
    for(var i=0;i<iLen;i++)
    {//留言时间，人员，所在单位，IP地址，留言内容。
        //(1)
        rowObject = messages.insertRow();
        rowObject.bgColor="F3F3F3";
        rowObject.height= "23px";
        cellObject = rowObject.insertCell();//1
        cellObject.noWrap=true;
        cellObject.width = "24px";
        cellObject.align="center";
        cellObject.innerHTML = '<img src="../../resource/image/form_cell_item.gif">';
        cellObject = rowObject.insertCell();//2
        cellObject.noWrap=true;
        cellObject.width = "20%";
        cellObject.style.color = "#46A718";
        cellObject.innerHTML = oRows[i].selectSingleNode("SUBMIT_DATE").text;
        cellObject = rowObject.insertCell();//3
        cellObject.noWrap=true;
        cellObject.width = "20%";
        cellObject.className = "link";
        cellObject.innerHTML = '<a href="javascript:showStaffInfo('+oRows[i].selectSingleNode("STAFF_ID").text+')">'+oRows[i].selectSingleNode("STAFF_NAME").text+'</a>';
        cellObject = rowObject.insertCell();//4
        cellObject.noWrap=true;
        cellObject.width = "20%";
        cellObject.style.color = "#46A718";
        cellObject.innerHTML = oRows[i].selectSingleNode("ORG_NAME").text;
        cellObject = rowObject.insertCell();//5
        cellObject.noWrap=true;
        cellObject.width = "20%";
        cellObject.innerHTML = oRows[i].selectSingleNode("STAFF_IP").text;
        cellObject = rowObject.insertCell();//6
        cellObject.noWrap=true;
        cellObject.width = "100";
        if(oRows[i].selectSingleNode("IS_SELF").text=="1")
        {
          cellObject.innerHTML = '<a href="javascript:editMessage('+oRows[i].getAttribute("id")+', messageArray['+i+'])">'+
                                 '  <img style="height:14;width:14;" src="../../resource/image/edit.gif" border=0 onmouseover="showTip2(this, popTip, '+"'"+'编辑该条留言'+"'"+')" onmouseout="hideTip(this, popTip, event)">'+
                                 '</a>&nbsp;&nbsp;'+
                                 '<a href="javascript:deleteMessage('+oRows[i].getAttribute("id")+')">'+
                                 '  <img style="height:14;width:14;" src="../../resource/image/del.gif" border=0 onmouseover="showTip2(this, popTip, '+"'"+'删除该条留言'+"'"+')" onmouseout="hideTip(this, popTip, event)">'+
                                 '</a>';
        }
        //(2). 
        rowObject = messages.insertRow();
        cellObject = rowObject.insertCell();//1
        cellObject = rowObject.insertCell();//2-6
        cellObject.colSpan = 5;
        //cellObject.style.wordWrap ="break-word";
        cellObject.style.wordBreak = "break-all";
        cellObject.style.lineHeight = "23px";
        cellObject.innerHTML = parseMessageText(oRows[i].selectSingleNode("MESSAGES").text);
        messageArray[i]= oRows[i].selectSingleNode("MESSAGES").text;
    }
}

function submitMessage(messageObj)
{
    messageObj.value = messageObj.value.trimall();
    if(messageObj.value=="")
    {
      EMsg("\"留言\"不能为空!");
      return false;
    }
    if(messageObj.value.Tlength()>2000)
    {
      EMsg("\"留言\"长度不能大于2000个字符!");
      return false;
    }
    var dXML = new ActiveXObject("Microsoft.XMLDOM");
    var sendXML = '<?xml version="1.0" encoding="gb2312"?>'+
                  '<root>'+
                  '  <BILL_INFO_ID>'+billInfoId+'</BILL_INFO_ID>'+
                  '  <BILL_INFO_MESSAGE_ID>'+billInfoForm.messageId.value+'</BILL_INFO_MESSAGE_ID>'+
                  '  <MESSAGE>'+messageObj.value+'</MESSAGE>'+
                  '</root>';
    dXML.loadXML(sendXML);
    xmlhttp.open("POST",billUrl+"tag="+billInfoForm.messageTag.value,false);
    xmlhttp.send(dXML);
    if(isSuccess(xmlhttp))
    {
        MMsg("\""+messageButton.value+"\"留言成功！");
        //(1). 恢复默认值
        resetMessageStatus();
        //(2). 更新留言列表
        dXML.load(xmlhttp.responseXML);
        reloadMessage(dXML);
    }
}

function editMessage(id, messageContents)
{
    billInfoForm.messageId.value = id;
    billInfoForm.words.value=messageContents;
    billInfoForm.messageTag.value=20;
    messageButton.value="保  存";
}

function deleteMessage(id)
{
    xmlhttp.open("POST",billUrl+"tag=21&billInfoMessageId="+id+"&billInfoId="+billInfoId,false);
    xmlhttp.send(dXML);
    if(isSuccess(xmlhttp))
    {
        MMsg("删除留言成功！");
        //(1). 如果删除正在编辑的项，则恢复默认值
        if(billInfoForm.messageId.value==id)
        {
            resetMessageStatus();
        }
        //(2). 更新留言列表
        var dXML = new ActiveXObject("Microsoft.XMLDOM");
        dXML.load(xmlhttp.responseXML);
        reloadMessage(dXML);
    }
}

function resetMessageStatus()
{
    billInfoForm.messageId.value=billInfoForm.messageId.defaultValue;
    billInfoForm.messageTag.value=billInfoForm.messageTag.defaultValue;
    messageButton.value="发  表";
    billInfoForm.words.value="";
}

function parseMessageText(messageText)
{
    var reg;
    var tempValue = messageText;
    reg=eval("/</g");
    tempValue = tempValue.replace(reg, "&lt;");
    reg=eval("/>/g");
    tempValue = tempValue.replace(reg, "&gt;");
    reg=eval("/ /g");
    tempValue = tempValue.replace(reg, "&nbsp;");
    reg=eval("/\\n/g");
    tempValue = tempValue.replace(reg, "<br/>");
    return tempValue;
}

function textCounter(inputStr, textMaxLength)
{
    if(inputStr.value.Tlength() > textMaxLength)
    {
        inputStr.value = inputStr.value.substrB(0, textMaxLength);
    }
    billInfoForm.remLen.value = (textMaxLength-inputStr.value.Tlength());
}

String.prototype.substrB = function(start, maxLength)
{
    // (1). 取限制长度
    var retValue = this.substr(start, maxLength);
    // (2). 取真实长度
    var bLen = retValue.Tlength();
    var aChar;
    var i;
    for(i=retValue.length-1;bLen>maxLength;i--)
    {
        aChar = retValue.charAt(i);
        if( /[^\x00-\xff]/g.test(aChar) ) bLen -= 2;
        else bLen --;
    }
    return retValue.substring(0, i+1);
}


//------------------------------------------------------------------------
//------------------- 弹出对象 ---------------------------------------------
//------------------------------------------------------------------------
document.writeln("<style>.tipdiv {z-index:3;font-family:verdana, arial, helvetica; font-size:12px; color:black; background-color:lightyellow; border:black 1px solid; padding:1px;}</style>");
document.writeln("<div id=popTip class=tipdiv style='position:absolute;display:none;' onmouseout='hideSelf(this, event)'></div>");

var popup_tip = null;

function getPos(el,sProp) {
	var iPos = 0;
	while (el!=null) {
		iPos+=el["offset" + sProp];
		el = el.offsetParent;
	}
	return iPos;
}

function showTip2(el, popObj, tipstr) {	
	if (tipstr.length > 1) {
		if (popObj) {
			popObj.style.display='';
			popObj.style.left = getPos(el,"Left") + el.offsetWidth;
			popObj.style.top = getPos(el,"Top") + el.offsetHeight;
			if (popObj.innerHTML.length<1) {
				popObj.innerHTML = tipstr;
			}
		}
	}
	if ((popObj!=popup_tip) && (popup_tip)) popup_tip.style.display = 'none';
	popup_tip = popObj;

}

function hideTip(el, popObj, e) {
	var cx, cy;
	if (!e) {
		cx = window.event.x;
		cy = window.event.y;
	} else {
		cx = e.clientX;
		cy = e.clientY;
	}

	if (el && popObj && popObj.style.display=='') {
		if ((document.body.scrollLeft + cx > el.offsetLeft) 
				&& (document.body.scrollLeft + cx < el.offsetLeft + el.offsetWidth) 
				&& (document.body.scrollTop + cy > el.offsetTop) 
				&& (document.body.scrollTop + cy < el.offsetTop + el.offsetHeight)
				|| (document.body.scrollLeft + cx > popObj.offsetLeft)                
				&& (document.body.scrollLeft + cx < popObj.offsetLeft + popObj.offsetWidth) 
				&& (document.body.scrollTop + cy > popObj.offsetTop)
				&& (document.body.scrollTop + cy < popObj.offsetTop + popObj.offsetHeight)) {
		} else {
			popObj.style.display = 'none';
			popObj.innerHTML = "";
		}
	}
}
