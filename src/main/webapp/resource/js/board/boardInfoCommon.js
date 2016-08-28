//------------------------------------------------------------------
//------------------ �ظ���Ϣ ----------------------------------------
//------------------------------------------------------------------
var messageArray = new Array();
function reloadMessage(dXML)
{
    //(1). �����Ϣ
    var datas = messages.rows;
    for(var i=datas.length-1;i>=0;i--)
    {
        datas[i].removeNode(true);
    }
    //(2). ������Ϣ
    var oRows = dXML.selectNodes("/root/BOARD_INFO_RE/rowSet");
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
    cellObject.innerHTML = '&nbsp;&nbsp;��<span style="border:0;color:red;text-decoration:underline;"> '+dXML.selectSingleNode("/root/BOARD_INFO_RE/recordCount").text+' </span>���ظ�';
    
    for(var i=0;i<iLen;i++)
    {//�ظ�ʱ�䣬��Ա�����ڵ�λ��IP��ַ���ظ����ݡ�
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
                                 '  <img style="height:14;width:14;" src="../../resource/image/edit.gif" border=0 onmouseover="showTip2(this, popTip, '+"'"+'�༭�����ظ�'+"'"+')" onmouseout="hideTip(this, popTip, event)">'+
                                 '</a>&nbsp;&nbsp;'+
                                 '<a href="javascript:deleteMessage('+oRows[i].getAttribute("id")+')">'+
                                 '  <img style="height:14;width:14;" src="../../resource/image/del.gif" border=0 onmouseover="showTip2(this, popTip, '+"'"+'ɾ�������ظ�'+"'"+')" onmouseout="hideTip(this, popTip, event)">'+
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
        cellObject.innerHTML = parseMessageText(oRows[i].selectSingleNode("RE_CONTENT").text);
        messageArray[i]= oRows[i].selectSingleNode("RE_CONTENT").text;
    }
}

function submitMessage(messageObj)
{
    messageObj.value = messageObj.value.trimall();
    if(messageObj.value=="")
    {
      EMsg("\"�ظ�\"����Ϊ��!");
      return false;
    }
    if(messageObj.value.Tlength()>4000)
    {
      EMsg("\"�ظ�\"���Ȳ��ܴ���4000���ַ�!");
      return false;
    }
    var dXML = new ActiveXObject("Microsoft.XMLDOM");
    var sendXML = '<?xml version="1.0" encoding="gb2312"?>'+
                  '<root>'+
                  '  <BOARD_ID>'+boardInfoId+'</BOARD_ID>'+
                  '  <BOARD_INFO_RE_ID>'+billInfoForm.messageId.value+'</BOARD_INFO_RE_ID>'+
                  '  <RE_CONTENT>'+messageObj.value+'</RE_CONTENT>'+
                  '</root>';
    dXML.loadXML(sendXML);
    xmlhttp.open("POST",boardUrl+"tag="+billInfoForm.messageTag.value,false);
    xmlhttp.send(dXML);
    if(isSuccess(xmlhttp))
    {
        MMsg("\""+messageButton.value+"\"�ظ��ɹ���");
        //(1). �ָ�Ĭ��ֵ
        resetMessageStatus();
        //(2). ���»ظ��б�
        dXML.load(xmlhttp.responseXML);
        reloadMessage(dXML);
    }
}

function editMessage(id, messageContents)
{
    billInfoForm.messageId.value = id;
    billInfoForm.words.value=messageContents;
    billInfoForm.messageTag.value=14;
    messageButton.value="��  ��";
}

function deleteMessage(id)
{
    xmlhttp.open("POST",boardUrl+"tag=15&boardInfoReId="+id+"&boardInfoId="+boardInfoId,false);
    xmlhttp.send(dXML);
    if(isSuccess(xmlhttp))
    {
        MMsg("ɾ���ظ��ɹ���");
        //(1). ���ɾ�����ڱ༭�����ָ�Ĭ��ֵ
        if(billInfoForm.messageId.value==id)
        {
            resetMessageStatus();
        }
        //(2). ���»ظ��б�
        var dXML = new ActiveXObject("Microsoft.XMLDOM");
        dXML.load(xmlhttp.responseXML);
        reloadMessage(dXML);
    }
}

function resetMessageStatus()
{
    billInfoForm.messageId.value=billInfoForm.messageId.defaultValue;
    billInfoForm.messageTag.value=billInfoForm.messageTag.defaultValue;
    messageButton.value="��  ��";
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
    // (1). ȡ���Ƴ���
    var retValue = this.substr(start, maxLength);
    // (2). ȡ��ʵ����
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


