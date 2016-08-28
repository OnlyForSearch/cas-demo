var NULL_VALUE = "NULL";
var reloadStaffListTimeout = 120000;//60000
var reloadStateTimeout = 120000;
var reloadMessageTimeout = 10000;
var MESSAGE_VALIDITY = "90";

var TYPE_OF_TALK_TO_USER = "TYPE_OF_TALK_TO_USER";
var TYPE_OF_TALK_TO_EVENT = "TYPE_OF_TALK_TO_EVENT";
var TYPE_OF_TALK_TO_MESSAGE = "TYPE_OF_TALK_TO_MESSAGE";
var TYPE_OF_TALK_TO_BROADCAST = "N";

var TYPE_OF_ATTACHMENT = "1";
var TYPE_OF_IMAGE = "2";

var dutyId = "";
var stateId = "";

var registerEvents = new Array();   //�Ѿ��򿪵�Ⱥ�Ĵ��� (event_id)
var registerUsers  = new Array();   //�Ѿ��򿪵�˽�Ĵ��� (staff_id)
var registerMessages = new Array(); //�Ѿ��򿪵���Ϣ���� (message_id)

var isSender = -1;//�Ƿ����� (0��ʾ�Ƿ����ߣ�1��ʾ�����ߣ�-1��ʾ����ȷ��)

//function test()
//{
//    //alert(registerEvents.length+" -- "+registerUsers.length+" -- "+registerMessages.length);
//    for(var i=0;i<registerEvents.length;i++)
//    {
//        alert("registerEvents: "+registerEvents[i]);
//    }
//    for(var i=0;i<registerUsers.length;i++)
//    {
//        alert("registerUsers: "+registerUsers[i]);
//    }
//    for(var i=0;i<registerMessages.length;i++)
//    {
//        alert("registerMessages: "+registerMessages[i]);
//    }
//}

var staffStateXmlHttp;
var eventStateXmlHttp;
var eventStatisticXmlHttp;
var sourceTargetsXmlHttp;
var talkRecordsXmlHttp;
//1. ��ʱ����
function recycleStaffState()
{
    reloadStaffState();
    window.setTimeout("recycleStaffState()", reloadStateTimeout);
}
function reloadStaffState()
{
    staffStateXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	staffStateXmlHttp.open("POST", httpUrl+"tag=21&stateId="+stateId,true);
	staffStateXmlHttp.onreadystatechange = function ()
	{
	    if(staffStateXmlHttp!=null && staffStateXmlHttp.readyState==4 && isSuccess(staffStateXmlHttp))
        {
            var dXML = staffStateXmlHttp.responseXML;
            staffStateXmlHttp = null;
            stateId = dXML.selectSingleNode("/root/STATE_ID").text;
        }
	};
    staffStateXmlHttp.send();
}

function recycleStaffList()
{
    outlook.location.reload();
    window.setTimeout("recycleStaffList()", reloadStaffListTimeout);
}





function formatTime(dateStr)
{
    if(dateStr==null || dateStr=="") {return "00";}
    else if(dateStr<10) {return "0"+dateStr;}
    else {return dateStr;}
}

function openFlowWindow(url,flowId){
	displayMaxWindow(url);
	if(flowId!=''||flowId!=0){
  		xmlhttp.open("POST",httpUrl+"tag=34&flowId="+flowId,false);
	    xmlhttp.send();
	    if(isSuccess(xmlhttp))
	    {
	        var dXML = new ActiveXObject("Microsoft.XMLDOM");
	        //dXML.load(xmlhttp.responseXML);
	  	}
	 }
}

function getNewImage(stateDate)
{
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate()-3);
    var dateStr = currentDate.getFullYear()+"-"+formatTime(currentDate.getMonth()+1)+"-"+formatTime(currentDate.getDate())+" "+
                  formatTime(currentDate.getHours())+":"+formatTime(currentDate.getMinutes());
    if(stateDate>dateStr)
    {
        return '<IMG SRC="../../resource/image/indexImage/new_info.gif">';
    }
    return '';
}function formatTime(dateStr)
{
    if(dateStr==null || dateStr=="") {return "00";}
    else if(dateStr<10) {return "0"+dateStr;}
    else {return dateStr;}
}


// 3. ���´���
function openNormalWindow(url, height)
{
    var iWidth = 780;
    var iHeight = ((height==null)?580:height);
    var top = (screen.availHeight-iHeight)/2;
    var left = (screen.availWidth-iWidth)/2;
    var sFeatures = new Array();
    sFeatures.push("width="+iWidth);
    sFeatures.push("height="+iHeight);
    sFeatures.push("top="+top);
    sFeatures.push("left="+left);
    sFeatures.push("location="+0);
    sFeatures.push("menubar="+0);
    sFeatures.push("resizable="+1);
    sFeatures.push("scrollbars="+1);
    sFeatures.push("status="+0);
    sFeatures.push("titlebar="+0);
    sFeatures.push("toolbar="+0);
    window.open(url, "", sFeatures.join(","));
}
function displayMaxWindow(url)
{
    var width = screen.availWidth;
    var height = screen.availHeight;
    var top = (screen.availHeight-height)/2;
    var left = (screen.availWidth-width)/2;
    var sFeatures = new Array();
    sFeatures.push("width="+width);
    sFeatures.push("height="+height);
    sFeatures.push("top="+top);
    sFeatures.push("left="+left);
    sFeatures.push("location="+0);
    sFeatures.push("menubar="+0);
    sFeatures.push("resizable="+1);
    sFeatures.push("scrollbars="+1);
    sFeatures.push("status="+0);
    sFeatures.push("titlebar="+0);
    sFeatures.push("toolbar="+0);
    window.open(url, "", sFeatures.join(","));
}
function sendMessageDialog(url)
{
    //window.showModalDialog("service_broadcast.htm", null,"dialogWidth=520px;dialogHeight=610px;help=0;scroll=0;status=0;");
    
    var iWidth = 720;//930
    var iHeight = 500;//430
    var top = (screen.availHeight-iHeight)/2;
    var left = (screen.availWidth-iWidth)/2;
    var sFeatures = new Array();
    sFeatures.push("width="+iWidth);
    sFeatures.push("height="+iHeight);
    sFeatures.push("top="+top);
    sFeatures.push("left="+left);
    sFeatures.push("location=0");
    sFeatures.push("menubar=0");
    sFeatures.push("resizable=0");
    sFeatures.push("scrollbars=0");
    sFeatures.push("status=0");
    sFeatures.push("titlebar=0");
    sFeatures.push("toolbar=0");
    window.open(url, "", sFeatures.join(","));
}

// 4. ��ʽװ��
function settingStyle(obj, className)
{
    //var obj = getElement(event.srcElement, "TR");
    obj.className=className;
}

// 5. ΪXML�ڵ�����ӽڵ�
function addNewNode(infoNode, nodeName, nodeValue, attrNameArr, attrValueArr)
{
    if(nodeName==null) return;
    
    var dXML = infoNode.ownerDocument;
    var itemNode = dXML.createElement(nodeName);
    if(nodeValue!="") itemNode.text = nodeValue;
       
    if(attrNameArr!=null)
    {
        for(var i=0;i<attrNameArr.length;i++)
        {
              itemNode.setAttribute(attrNameArr[i], attrValueArr[i]);
        }
    }
    infoNode.appendChild(itemNode);
    return itemNode;
}

var crmComplainXmlHttp;
function reloadCRMComplain(){
	var hUrl = "../../servlet/serviceDeskServlet?";
	crmComplainXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	crmComplainXmlHttp.onreadystatechange = loadCRMComplain;
	crmComplainXmlHttp.open("POST", hUrl+"tag=33",true);
    crmComplainXmlHttp.send();
}

var crmUrl;
function loadCRMComplain(){
	if(crmComplainXmlHttp!=null && crmComplainXmlHttp.readyState==4 && isSuccess(crmComplainXmlHttp)){
		var dXML = crmComplainXmlHttp.responseXML;
		//alert(dXML.selectNodes("/root/rowSet/CNT_UNPROC").text);
		var CNT_UNPROC = dXML.selectSingleNode("/root/COUNT/rowSet/CNT_UNPROC").text;
		var CNT_PROC = dXML.selectSingleNode("/root/COUNT/rowSet/CNT_PROC").text;
		
		var GHGH = dXML.selectSingleNode("/root/ITMANAGER/rowSet/GHGH").text;
		var GH_NAME = dXML.selectSingleNode("/root/ITMANAGER/rowSet/GH_NAME").text;
		var TEAM_ID = dXML.selectSingleNode("/root/ITMANAGER/rowSet/TEAM_ID").text;
		var TEAM_NAME = dXML.selectSingleNode("/root/ITMANAGER/rowSet/TEAM_NAME").text;
		var TEAM_NET = dXML.selectSingleNode("/root/ITMANAGER/rowSet/TEAM_NET").text;
		var AREA_ID = dXML.selectSingleNode("/root/ITMANAGER/rowSet/AREA_ID").text;
		var TEAM_MEMBER_ID = dXML.selectSingleNode("/root/ITMANAGER/rowSet/TEAM_MEMBER_ID").text;
		
		crmUrl = "http://135.160.9.28:10093/crmweb/module_gensoinfo/custintqueryInterface.htm?"
		+ "staff="+GHGH+"&staffName="+GH_NAME+"&teamId="+TEAM_ID+"&teamName="+TEAM_NAME
		+"&localAreaId="+TEAM_NET+"&areaId="+AREA_ID+"&teamMemberId="+TEAM_MEMBER_ID;
		
		crmUnCount.innerHTML=""+CNT_UNPROC+"��Ͷ��δ����;&nbsp;"
		crmCount.innerHTML="������Ͷ��"+CNT_PROC+"��";
	}
}

function openCrmWindow(){
	displayMaxWindow(crmUrl);
}

//7. ע��
function registerObject(type, objId)
{
    if(objId==null) return;
    
    var isExists = false;
    var registerArr;
    
    if(type==TYPE_OF_TALK_TO_EVENT) registerArr = registerEvents;
    else if(type==TYPE_OF_TALK_TO_USER) registerArr = registerUsers;
    else registerArr = registerMessages;
    
    for(var i=0;i<registerArr.length;i++)
    {
        if(registerArr[i]==objId)
        {
            isExists = true;
            break;
        }
    }
    
    if(!isExists) registerArr.push(objId);
}

//8. ���ע��
function unregisterObject(type, objId)
{
    if(objId==null) return;
    
    var isReplace = false;
    var registerArr;
    
    if(type==TYPE_OF_TALK_TO_EVENT) registerArr = registerEvents;
    else if(type==TYPE_OF_TALK_TO_USER) registerArr = registerUsers;
    else registerArr = registerMessages;
        
    for(var i=0;i<registerArr.length;i++)
    {
        if(isReplace)
        {
            registerArr[i-1] = registerArr[i];
        }
        else if(registerArr[i]==objId)
        {
            registerArr[i] = null;//��ɾ��
            isReplace = true;
        }
    }
    
    if(isReplace)
    {
        if(registerArr.length>0) registerArr.length = registerArr.length-1;
    }
}


//9. δ������Ϣ��Դ����
var sourceTargetOnDuty = 0;
function recycleSourceTargets(isOnDuty)
{
    sourceTargetOnDuty = isOnDuty;
    receiveSourceTargets();
    window.setTimeout("recycleSourceTargets("+isOnDuty+")", reloadMessageTimeout);
}

function receiveSourceTargets(isOnDuty)
{
    //(1). ��ȡ��Դ����
    var sendXML = new ActiveXObject("Microsoft.XMLDOM");
    sendXML.loadXML('<?xml version="1.0" encoding="gb2312"?><root></root>');
    var rootNode = sendXML.selectSingleNode("root");
    //(1-1). �¼�
    var eventNode = addNewNode(rootNode, "EVENTS");
    for(var i=0;i<registerEvents.length;i++)
    {
        if(registerEvents[i]!=null) addNewNode(eventNode, "EVENT_ID", registerEvents[i]);
    }
    //(1-2). �û�
    var userNode = addNewNode(rootNode, "USERS");
    for(var i=0;i<registerUsers.length;i++)
    {
        if(registerUsers[i]!=null) addNewNode(userNode, "USER_ID", registerUsers[i]);
    }
    //(1-3). ��Ϣ
    var messageNode = addNewNode(rootNode, "MESSAGES");
    for(var i=0;i<registerMessages.length;i++)
    {
        if(registerMessages[i]!=null) addNewNode(messageNode, "MESSAGE_ID", registerMessages[i]);
    }
    
    //(2). �������ڣ���ע��
    sourceTargetsXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	sourceTargetsXmlHttp.onreadystatechange = loadSourceTargets;
	sourceTargetsXmlHttp.open("POST", httpUrl+"tag=11",true);
    sourceTargetsXmlHttp.send(sendXML);
}

function loadSourceTargets()
{
	if(sourceTargetsXmlHttp!=null && sourceTargetsXmlHttp.readyState==4 && isSuccess(sourceTargetsXmlHttp))
    {
        var dXML = sourceTargetsXmlHttp.responseXML;
        sourceTargetsXmlHttp = null;
        //alert(dXML.xml);
        
        var oRows = dXML.selectNodes("/root/rowSet");
        var oItem;
        var type;
        var params = new Array();
        for(var i=0;i<oRows.length;i++)
        {
            oItem = oRows[i];
            type = oItem.selectSingleNode("TYPE").text;
            params.push("isOnDuty="+sourceTargetOnDuty);
            params.push("type="+type);
            params.push("id="+oItem.selectSingleNode("ID").text);
            params.push("title="+encodeURIComponent(oItem.selectSingleNode("TITLE").text));
            params.push("isSender="+oItem.selectSingleNode("IS_SELF").text);
            if(type==TYPE_OF_TALK_TO_EVENT)//type==TYPE_OF_TALK_TO_USER || 
            {
                openNormalWindow("service_call_talk.htm?"+params.join("&"), "433");
            }else
            {
                sendMessageDialog("service_broadcast.htm?"+params.join("&"));
            }
        }
    }
}

//10. ��ʼ��������
function reloadSelection(selectionObj, oRows)
{
    var oOption;
    var iLen = selectionObj.length;
    for(var i=iLen-1;i>=0;i--){
        selectionObj.options.remove(i);
    }
    if(oRows==null) {return;}
    
    iLen = oRows.length;
    for(var i=0;i<iLen;i++)
    {
        oOption = document.createElement("OPTION");
        oOption.value = oRows[i].childNodes[0].text;
        oOption.text = oRows[i].childNodes[1].text;
        selectionObj.add(oOption);
    }
}

//11. ������Ϣ
function initEmotions(emotionList, popEmotion)
{
    var dXML=new ActiveXObject("Microsoft.XMLDOM");
	dXML.async = false;
	dXML.load("../../resource/xml/emotion.xml");
	var oRows=dXML.selectNodes("/EMOTIONS/EMOTION");
	var iLen = oRows.length;
	
    var rowObject1;
    var rowObject2;
    var cellObject;
    
    var src;
    var titile;
    
    for(var i=0;i<iLen;)
    {
        rowObject1 = emotionList.insertRow();
        //rowObject2 = emotionList.insertRow();
        for(var j=0;j<10 && i<iLen;j++,i++)
        {
            src = "../../"+oRows[i].selectSingleNode("SRC").text;
            title = oRows[i].getAttribute("title");
            cellObject = rowObject1.insertCell();
            cellObject.innerHTML = '<img src="'+src+'" baksrc="'+src+'" onclick="addEmotion(this,popEmotion)" style="cursor:hand" alt="'+title+'" title="'+title+'">';
            
            //cellObject = rowObject2.insertCell();
            //cellObject.innerHTML = '<nobr>'+title+'</nobr>';
        }
    }
}

function addEmotion(obj, popEmotion)
{
    var emotionObj = document.createElement("img");
    emotionObj.src = obj.baksrc;
    emotionObj.title = obj.title;
    emotionObj.alt = obj.alt;
    messageContent.appendChild(emotionObj);
    hideObj(popEmotion);
    //popupPage.hide();
}

//12. ��������¼
function appendTalkRecords(replyName, replyDate, replyContent)
{
    if(talkingRecords==null) return;
    var rowObject = talkingRecords.insertRow();
    var cellObject = rowObject.insertCell();
    cellObject.style.wordWrap = "break-word";
    cellObject.style.wordBreak = "break-all";
    cellObject.innerHTML = '<div style="color: #7A7672;white-space:nowrap;padding-right:10px;">'+replyName+' ('+replyDate+')</div>'+
                           '<div style="padding-left:10px;">'+convertToHtml(replyContent)+'</div>';
}

//13. δ�������¼
function recycleTalkRecords(currentType, currentObjId, isSender)
{
    receiveTalkRecords(currentType, currentObjId, isSender);
    timeoutObj = window.setTimeout("recycleTalkRecords('"+currentType+"',"+currentObjId+","+isSender+")", reloadMessageTimeout);
}

function receiveTalkRecords(currentType, currentObjId, isSender)
{
    talkRecordsXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	talkRecordsXmlHttp.onreadystatechange = loadTalkRecords;
	talkRecordsXmlHttp.open("POST", httpUrl+"tag=10&type="+currentType+"&targetId="+currentObjId+"&isSender="+isSender,true);
    talkRecordsXmlHttp.send();
}

function loadTalkRecords()
{
	if(talkRecordsXmlHttp!=null && talkRecordsXmlHttp.readyState==4 && isSuccess(talkRecordsXmlHttp))
    {
        var dXML = talkRecordsXmlHttp.responseXML;
        talkRecordsXmlHttp = null;
        //alert(dXML.xml);
        
        var oRows = dXML.selectNodes("/root/rowSet");
        var oItem;
        var params = new Array();
        var iLen = oRows.length;
        for(var i=0;i<iLen;i++)
        {
            oItem = oRows[i];
            appendTalkRecords(oItem.selectSingleNode("REPLY_NAME").text, 
                              oItem.selectSingleNode("REPLY_DATE").text, 
                              oItem.selectSingleNode("REPLY_CONTENT").text);
        }
        
        if(iLen>0)
        {
            historyTalk.scrollTop = historyTalk.scrollHeight;
            window.focus();//��ý���
            if(typeof(reloadOnlineStaffState)=="function"){reloadOnlineStaffState();}
        }
    }
}

//14. ��ʷ�����¼
function showMessageHistory(isOnDuty, currentType, currentObjId)
{
    var params = new Array();
    params.push("isOnDuty="+isOnDuty);
    params.push("type="+currentType);
    params.push("id="+currentObjId);
    displayMaxWindow("service_message_history.htm?"+params.join("&"));
}

function showCurrentMessage(messageId)
{
    var iWidth = 500;
    var iHeight = 580;
    var top = (screen.availHeight-iHeight)/2;
    var left = (screen.availWidth-iWidth)/2;
    var sFeatures = new Array();
    sFeatures.push("width="+iWidth);
    sFeatures.push("height="+iHeight);
    sFeatures.push("top="+top);
    sFeatures.push("left="+left);
    sFeatures.push("location=0");
    sFeatures.push("menubar=0");
    sFeatures.push("resizable=1");
    sFeatures.push("scrollbars=1");
    sFeatures.push("status=0");
    sFeatures.push("titlebar=0");
    sFeatures.push("toolbar=0");
    window.open("service_message_records.htm?messageId="+currentObjId, "", sFeatures.join(","));
    //openNormalWindow("service_message_records.htm?messageId="+currentObjId);
    //window.showModalDialog("service_message_records.htm?messageId="+currentObjId,null,"resizable=no;dialogWidth=500px;dialogHeight=580px;help=0;status=0;");
}

//15. ��������
function getCurrentDate()
{
    var currentDate = new Date();
    return currentDate.getFullYear() + "-" + getFullTime(currentDate.getMonth()+1) + "-" + getFullTime(currentDate.getDate()) + " "+
           getFullTime(currentDate.getHours()) + ":" + getFullTime(currentDate.getMinutes()) + ":" + getFullTime(currentDate.getSeconds());
}

function getFullTime(inputTime)
{
    if(inputTime<10)
    {
        return "0"+inputTime;
    }else
    {
        return inputTime;
    }
}

function convertToHtml(contentStr)
{
    return contentStr.replace(/\n/g, '<br/>');
}

//16. �����¼�����
var flowMod = "";
function startFlow(state)
{
    var isService="1";
    if(flowMod==null || flowMod=="")
    {
        xmlhttp.open("POST",httpUrl+"tag=22",false);
        xmlhttp.send();
        if(isSuccess(xmlhttp))
        {
            var dXML = new ActiveXObject("Microsoft.XMLDOM");
            dXML.load(xmlhttp.responseXML);
            //alert(dXML.xml);
            flowMod = dXML.selectSingleNode("/root/FLOW_MOD").text;
        }
    }
   xmlhttp.open("POST",httpUrl+"tag=32",false);
   xmlhttp.send();
   if(isSuccess(xmlhttp))
   {
       var dXML = new ActiveXObject("Microsoft.XMLDOM");
       dXML.load(xmlhttp.responseXML);
       isService = dXML.selectSingleNode("/root/IS_SERVICE_DUTY_USER").text;
   }
    openNormalWindow('../../workshop/form/index.jsp?flowMod='+flowMod+"&fullscreen=yes&callback=opener.refreshEventContext()&isduty="+isService+"&newflow="+state+"");
}



//17. ��ʷ��Ϣ��
function showMsgBox()
{
	openNormalWindow("../../MoreMessagePage.html");
}

//18. �����ı���Ϣ
function sendTextMessage(sendXML)
{
	var params = new Array();
	xmlhttp.Open("POST",httpUrl+"tag=9",false);
	xmlhttp.send(sendXML);
	if(isSuccess(xmlhttp))
	{
	    var dXML = xmlhttp.responseXML;
        // �ж��Ƿ�Ϊ������Ϣ�� ��Ϣ����Ч����
        params.push(dXML.selectSingleNode("/root/MESSAGE_ID").text);
        params.push(dXML.selectSingleNode("/root/VALIDITY_DATE").text);
        params.push(dXML.selectSingleNode("/root/IS_TUNNEL_MESSAGE").text);
	    return params;
	}
}
// 19. ������Ϣ�͸���
function sendMessageWidthAttachment(sendXML)
{
    return window.showModalDialog("service_message_attachments.htm", sendXML,"dialogWidth=540px;dialogHeight=320px;help=0;status=0;");
}


/**
 * 20. ���ܣ�Ԫ�صĿ�����
 *
 *      (1). ����Ƿ���������Ϣ����ֻ�����һ�η��͸������ظ���ֻ��������ͨ�ı���
 *      (2). ����Ƿ����ߣ�����Ϣ������ظ���������ظ���
 *      (3). ����Ƿ����ߣ�����Ϣ����ظ���  ������ظ���
 */
function checkElement()// �������������Ϣ����ֻ�����һ�η��͸�����
{
    if(currentObjId!=null && currentObjId.length>0)
    {
        historyMessage.style.display = "";
        
        if(isTunnelMessage)// (1). ������Ϣ
        {
            sendAttachmentTag.disabled = true;
            sendImageTag.disabled = true;
        }
        else if(isSender!=1 
                && currentType!=TYPE_OF_TALK_TO_MESSAGE 
                && currentType!=TYPE_OF_TALK_TO_EVENT 
                && currentType!=TYPE_OF_TALK_TO_USER)// (2). �Ƿ����ߣ�����Ϣ������ظ�
        {
            sendAttachmentTag.disabled = true;
            sendImageTag.disabled = true;
            sendEmotionTag.disabled = true;
            sendMessageButton.disabled = true;
            messageContent.disabled = true;
        }else
        {
            sendAttachmentTag.disabled = false;
            sendImageTag.disabled = false;
        }
    }else
    {
        sendAttachmentTag.disabled = true;
        sendImageTag.disabled = true;
        isSender = 1;
    }
}



var stateLinks = new Array();
var followMoreLinks = new Array();
var statisticLinks = new Array();
var statisticLink;
var followListTitleLength=150;//px
var reloadStateLinksTime = 20000;//ms
var reloadFollowListTime = 20000;//ms
var reloadStatisticTime = 60000;//ms

//һ���Ի�ȡevent_show_states�������õ�Ҫ��ʾ�����г�����
function loadLinks(){
	xmlhttp.open("POST",httpUrl+"tag=43",false);
 	xmlhttp.send();
	var dataXML = new ActiveXObject("Microsoft.XMLDOM");
	dataXML.load(xmlhttp.responseXML);	
	classifyDate( dataXML.selectNodes("/root/rowSet"));
}
function reloadFollowList(){
	loadFollowList();				//���ع��������б�
	window.setInterval(loadFollowList,reloadFollowListTime);
}
function reloadStateLinks(){
	loadStateLinks("event",3158);	//�����¼��������б�
	loadStateLinks("appeal",4480);	//����Ͷ�ߵ������б�
	window.setInterval(function(){loadStateLinks("event",3158);loadStateLinks("appeal",4480);},reloadStateLinksTime);
}
function reloadEventStatistic(){
 	loadEventStatistic();		//���빤��ͳ�Ʊ�
	window.setInterval(loadEventStatistic,reloadStatisticTime);
}

//��һ���Ի�ȡ�������ӳ����ࣺ����������״̬�б��� ������������ĸ��ࡱ���ӡ�������ͳ�Ʊ����ݡ�����
function classifyDate(rowSet){
	var type;
	for(var i=0;i<rowSet.length;i++) {
		type = rowSet[i].selectSingleNode("TYPE").text;
		switch (type) {
		   case 'STATELINK' :
		       stateLinks.push(rowSet[i]);
		       break;
		   case 'FOLLOWMORELINK' :
		       followMoreLinks.push(rowSet[i]);
		       break;
		   case 'STATISTICLINK' :
		       statisticLinks.push(rowSet[i]);
		       statisticLink = rowSet[i].selectSingleNode("URL").text;//��Ϊ������ͳ�Ʊ����ݡ�����ֻ��һ��������ֱ�Ӹ�ֵ��
		       break;
		} 
	}	
}
//��ȡҪ��ʾ�Ĺ��������б��״̬������
function loadStateLinks(eventType,flowModId){
	var Global = {
		url				: undefined,
		sqlid		    : undefined
	};
    Global.url = getUrlParam();
		var param = {
			isOnDuty : {
				type : "STRING",
				isMultiple : "0BT",
				value : isOnDuty_
			},
			dutyId : {
				type : "INTEGER",
				isMultiple : "0BT",
				value : dutyId
			},
			flowModId : {
				type : "INTEGER",
				isMultiple : "0BT",
				value : flowModId
			}
			
		};
		Global.xResult = ResultFactory.newResult("SERVICE_EVENT_STATE_COUNTS",{
			hasField : false
		});	
		Global.xResult.send(Result.FORCE_GET, param);
		Global.xResult.onLoad = function(oXml){	
			showStateLinks(eventType,flowModId,oXml.selectNodes("/root/rowSet"));
		}
}
//��ʾ���������б�
function showStateLinks(eventType,flowModId,countResults){
	var listHtml = '<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:1px;"> <thead>';
	for(var i=0;i<stateLinks.length;i++) {
		var state = stateLinks[i].selectSingleNode("STATE").text;	
		var name = stateLinks[i].selectSingleNode("NAME").text;
		var url = stateLinks[i].selectSingleNode("URL").text;
		var remark = stateLinks[i].selectSingleNode("REMARK").text;
		var img_src = stateLinks[i].selectSingleNode("IMG_SRC").text;
		
		for(var j=0;j<countResults.length;j++){
			var child = countResults[j].childNodes;
			var countState = child[0].text;
			var counts = child[2].text;
			//alert("state:"+child[0].text+" Name:"+child[1].text+" Counts:"+child[2].text);
			if(state==countState){
				listHtml +='<tr onclick="displayMaxWindow(\''+url+'&isOnDuty='+isOnDuty_+'&dutyId='+dutyId+'&flowModId='+flowModId+'\')" style="cursor:hand" class="SummCellBg" onMouseOver="settingStyle(this, \'SummCellBghover\');" onMouseOut="settingStyle(this,\'SummCellBg\');">'+ 
				          '<td width="64" height="70" align="center">&nbsp;&nbsp;<a href="javascript:"><img src="'+img_src+'" width="32" height="32" border="0"></a></td>'+
				          '<td><span class="fontBlackBold"><a href="javascript:" class="fontBlackBoldLink">'+name+'</a></span> '+remark+'</td>'+
				          '<td width="50" nowrap><a href="javascript:" style=text-decoration:none;width:100%><strong><font id="overdueEvents" color="#3466A9" size="4" face="Verdana, Arial, Helvetica, sans-serif">'+counts+'</font></strong></a></td>'+
				        '</tr>';
				break;
			}
		}
	}
	listHtml += '</thead></table>';
	if(eventType == "event")
		eventStateList.innerHTML = listHtml
	else if ((eventType == "appeal"))
		appealStateList.innerHTML = listHtml
}

//��ȡ���������б�����
function loadFollowList(){
	var Global = {
		url				: undefined,
		sqlid		    : undefined
	};
    Global.url = getUrlParam();
		var param = {
			isOnDuty : {
				type : "STRING",
				isMultiple : "0BT",
				value : isOnDuty_
			},
			dutyId : {
				type : "INTEGER",
				isMultiple : "0BT",
				value : dutyId
			}
		};
		Global.xResult = ResultFactory.newResult("SERVICE_EVENT_FOLLOW",{
			hasField : false
		});	
		Global.xResult.send(Result.FORCE_GET, param);
		Global.xResult.onLoad = function(oXml){	
			showFollowList(oXml.selectNodes("/root/rowSet"));
		}
}
//���Ǹ��հ�,�����������б�ÿ�а󶨵����¼�ʹ��
function rowClick(clickAction,flowId){
          this.clickFunc=function(){openFlowWindow(clickAction,flowId);}
}
//���빤�������б�
function showFollowList(results){
	//(1). ������� (���еı��ⲻɾ��)
    var datas = eventRequests.rows;
	for(var i=datas.length-1;i>0;i--) {
        datas[i].removeNode(true);
    }
    var rowObject;
    var cellObject;
	var isOverdue;
    var isEdit;
    var clickAction;
    var eventState;
    var tchName;
    var tempStr;
    var flowId;
    var eventType;
	for(var i=0;i<results.length;i++){ 
		isOverdue = results[i].selectSingleNode("IS_OVERDUE").text;
        isEdit = results[i].selectSingleNode("IS_EDIT").text;
        eventState = results[i].selectSingleNode("EVENT_STATE").text;
        tchName = results[i].selectSingleNode("TCH_NAME").text;
        flowId = results[i].selectSingleNode("FLOW_ID").text;
		clickAction = "../form/index.jsp?tchId="+results[i].selectSingleNode("TCH_ID").text+"&fullscreen=yes&callback=opener.refreshEventContext()";
		eventType = results[i].selectSingleNode("EVENTTYPE").text;
           
            rowObject = eventRequests.insertRow();
            //rowObject.onclick = function(){displayMaxWindow(clickAction);};
            rowObject.style.cursor = "hand";
            rowObject.className = "SummCellBg";
            //rowObject.onmouseover = function(){settingStyle(this, 'SummCellBghover');};
            //rowObject.onmouseout = function(){settingStyle(this, 'SummCellBg');};
            
            //��for�а�click�¼���ʹ�ñհ��������ܰ󶨣�modify by sunyj 2011-5-27
            var rc = new rowClick(clickAction, flowId); 
            rowObject.onclick = rc.clickFunc;
            
            cellObject = rowObject.insertCell();//1
            cellObject.style.width="10px";
            cellObject.innerHTML = '<img src="../../resource/image/indexImage/index1_55.gif">';
            
            cellObject = rowObject.insertCell();//2
            cellObject.style.width="60px";
            cellObject.innerHTML = eventType;
            
            cellObject = rowObject.insertCell();//3
            //cellObject.style.width="100%";
            cellObject.style.textAlign = "left";
            cellObject.innerHTML = getNewImage(results[i].selectSingleNode("STATE_DATE").text)+//'<IMG SRC="../../resource/image/indexImage/new_info.gif">'+
                                   '<a  style="height:100%;width='+followListTitleLength+'px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">'+
                                     results[i].selectSingleNode("EVENT_TITLE").text+
                                   '</a>';
            
            cellObject = rowObject.insertCell();//4
            cellObject.style.width="110px";
            cellObject.innerHTML = '<nobr>'+results[i].selectSingleNode("STATE_DATE").text+'</nobr>';
            
            if(IS_SERVICE_DESK_NX!="1"){
	            cellObject = rowObject.insertCell();//5
	            cellObject.style.width="110px";
	            tempStr = '<div style="height:100%;width=110px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">';
	            //if(isOverdue=="1") {cellObject.style.color="#ff0000";tempStr += '<span>����</span>&nbsp;';if(isEdit=="1"){tempStr+='<span style="color:#FFA500">('+tchName+')</span>';}else{tempStr+='('+tchName+')';}}
	            //else if(isEdit=="1") {cellObject.style.color="#FFA500";tempStr += '<span>'+eventState+'</span>&nbsp;('+tchName+')';}
	            if(isOverdue=="1") {cellObject.style.color="#ff0000";if(isEdit=="1"){tempStr+='<span style="color:#FFA500">'+tchName+'</span>';}else{tempStr+=tchName;}}
	            else if(isEdit=="1") {cellObject.style.color="#FFA500";tempStr += tchName;}
	            else {tempStr += eventState+' ('+tchName+')';}
	            tempStr += '</div>';
	            cellObject.innerHTML = tempStr;
           }else{
           		cellObject = rowObject.insertCell();//5
	            cellObject.style.width="85px";
	            tempStr = '<div style="height:100%;width=85px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">';
	            if(isOverdue=="1") {cellObject.style.color="#ff0000";if(isEdit=="1"){tempStr+='<span style="color:#FFA500">'+tchName+'</span>';}else{tempStr+=tchName;}}
	            else if(isEdit=="1") {cellObject.style.color="#FFA500";tempStr += tchName;}
	            else {tempStr += tchName;}
	            tempStr += '</div>';
	            cellObject.innerHTML = tempStr;
           		
           		cellObject = rowObject.insertCell();//6
	            cellObject.style.width="65px";
	            tempStr = '<div style="height:100%;width=75px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">';
	            if(isOverdue=="1") {cellObject.style.color="#ff0000";tempStr += '<span>����</span>';}
	            else if(isEdit=="1") {cellObject.style.color="#FFA500";tempStr += '<span>'+eventState+'</span>'}
	            else {tempStr += eventState;}
	            tempStr += '</div>';
	            cellObject.innerHTML = tempStr;
           } 
            
		
	}
}

function loadFollowLinks(){
	var innerHtml = "<table><tr>";
	for(var i=0;i<followMoreLinks.length;i++) {
		var name = followMoreLinks[i].selectSingleNode("NAME").text;
		var url = followMoreLinks[i].selectSingleNode("URL").text;
		
		innerHtml += "<td><a style='width:100px;' href=\"javascript:displayMaxWindow('"+url+"&isOnDuty="+isOnDuty_+"&dutyId="+dutyId+"')\"><b>"+name+"</b></a></td>";
	}
	innerHtml += "</tr></table>";
	more.innerHTML = innerHtml;
}

//���빤��ͳ�Ʊ�
function loadEventStatistic()
{	
	var paramName_category;
	var paramName_count;
	switch (eventCategory.value) {
		case 'person':
			paramName_category = 'SERVICEDESK_STATISTIC_PERSON_CATEGORY';
			paramName_count = 'SERVICEDESK_STATISTIC_PERSON_COUNT';
			break;
		case 'level':
			paramName_category = 'SERVICEDESK_STATISTIC_LEVEL_CATEGORY';
			paramName_count = 'SERVICEDESK_STATISTIC_LEVEL_COUNT';
			break;
		case 'type':
			paramName_category = 'SERVICEDESK_STATISTIC_TYPE_CATEGORY';
			paramName_count = 'SERVICEDESK_STATISTIC_TYPE_COUNT';
			break;
		case 'kind':
			paramName_category = 'SERVICEDESK_STATISTIC_KIND_CATEGORY';
			paramName_count = 'SERVICEDESK_STATISTIC_KIND_COUNT';
			break;
		case 'source':
			paramName_category = 'SERVICEDESK_STATISTIC_SOURCE_CATEGORY';
			paramName_count = 'SERVICEDESK_STATISTIC_SOURCE_COUNT';
			break;
		case 'mode':
			paramName_category = 'SERVICEDESK_STATISTIC_MODE_CATEGORY';
			paramName_count = 'SERVICEDESK_STATISTIC_MODE_COUNT';
			break;
	}
	var Global = {
		url				: undefined,
		sqlid		    : undefined
	};
    Global.url = getUrlParam();
	var param = {
		dutyId : {
			type : "INTEGER",
			isMultiple : "0BT",
			value : dutyId
		}
	};
	Global.xResult = ResultFactory.newResult(paramName_category,{
		hasField : false
	});	
	Global.xResult.send(Result.FORCE_GET, param);
	Global.xResult.onLoad = function(colsXml){
		
		Global.xResult = ResultFactory.newResult(paramName_count,{
			hasField : false
		});	
		Global.xResult.send(Result.FORCE_GET, param);
		Global.xResult.onLoad = function(rowsXml){	
			showStatistic(colsXml,rowsXml);
		}
		
	}
}

function showStatistic(colsXml,rowsXml)
{		
		var oCols = colsXml.selectNodes("/root/rowSet");
		var oRows = rowsXml.selectNodes("/root/rowSet");
		
        //(1). ������� (���еı��ⲻɾ��)
        var datas = eventStatistic.rows;
        for(var i=datas.length-1;i>0;i--) {
            datas[i].removeNode(true);
        }
   
        var rowObject;
        var cellObject;
        var colId;
        var rowCount;
        var totalEvents = new Array(0, 0, 0, 0);
   		var statisticStates = IS_SERVICE_DESK_NX!="1" ? new Array(1, 2, 3, 4) : new Array(1, 2, 8, 4);
        //(2-1). ��ָ��
        for(var i=0;i<oCols.length;i++)
        {
            colId = oCols[i].childNodes[1].text;
            rowObject = eventStatistic.insertRow();
            
            cellObject = rowObject.insertCell();//1
            cellObject.style.width = "67px";
            cellObject.className = "columnvertical";
            cellObject.innerHTML = oCols[i].childNodes[0].text;
            
            for (var j=0; j<statisticStates.length; j++) {
	            cellObject = rowObject.insertCell();//2
	            cellObject.className = j%2==0?"columneven":"columnodd";
	            rowCount = fetchEventAmounts(rowsXml, colId, statisticStates[j]);
	            totalEvents[j] += rowCount;
	            cellObject.innerHTML = settingEventAmounts(rowsXml, colId, statisticStates[j], rowCount);
            }
        }
        
        //(2-2). δָ��
        rowObject = eventStatistic.insertRow();
        cellObject = rowObject.insertCell();//1
        cellObject.className = "unassignedhead";
        cellObject.style.width = "67px";
        cellObject.innerHTML = "δ����";
        
        colId = '';
        for (var j=0; j<statisticStates.length; j++) {
           cellObject = rowObject.insertCell();//2
           cellObject.className = j%2==0?"unassignedonhold":"unassignedover";
           rowCount = fetchEventAmounts(rowsXml, colId, statisticStates[j]);
           totalEvents[j] += rowCount;
           cellObject.innerHTML = settingEventAmounts(rowsXml, 'NULL', statisticStates[j], rowCount);
        }
        
        //(2-3). �ܼ� (��Ϊһ���¼��������������"ֵ����Ա"�����Ա�������)
        rowObject = eventStatistic.insertRow();
        cellObject = rowObject.insertCell();//1
        cellObject.className = "totalhead";
        cellObject.style.width = "67px";
        cellObject.innerHTML = "�ܼ�";
        
        var isTotal = (rowsXml.selectSingleNode("/root/rowSet[ID=\"-1\"]")!=null);
        for (var j=0; j<statisticStates.length; j++) {
           cellObject = rowObject.insertCell();//2
           cellObject.className = j%2==0?"totalonhold":"totalover";
           if(isTotal){
	          	rowCount = fetchEventAmounts(rowsXml, -1, statisticStates[j]);
	          	cellObject.innerHTML = settingEventAmounts(rowsXml, null, statisticStates[j], rowCount);
	       }else{
	       		cellObject.innerHTML = settingEventAmounts(rowsXml, null, statisticStates[j], totalEvents[j]);
	       }
        }
        
}


function fetchEventAmounts(rowsXml, id, eventState)
{
    var eventAmounts = rowsXml.selectSingleNode("/root/rowSet[ID=\""+id+"\" and EVENT_STATE=\""+eventState+"\"]/COUNT_EVENT");
    if(eventAmounts!=null)
    {
        return parseInt(eventAmounts.text);
    }else
    {
        return 0;
    }
}

function settingEventAmounts(rowsXml, id, eventState, eventAmounts)//(dXML,�кţ�״̬������)
{
    if(eventAmounts>0)
    {
        if(id!=null) return '<a href="javascript:displayMaxWindow(\''+statisticLink+'&isOnDuty='+isOnDuty_+'&dutyId='+dutyId+'&'+eventCategory.value+'='+id+'&event_state='+eventState+'\')">'+eventAmounts+'</a>';
        else return '<a href="javascript:displayMaxWindow(\''+statisticLink+'&isOnDuty='+isOnDuty_+'&dutyId='+dutyId+'&event_state='+eventState+'\')">'+eventAmounts+'</a>';
    }else
    {
        return 0;
    }
}
