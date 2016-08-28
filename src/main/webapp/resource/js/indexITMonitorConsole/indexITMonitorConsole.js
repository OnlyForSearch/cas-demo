/**
 * �㽭 IT���̨************************************
 * ����ͷ������ʱ����Ϣ�� setDateTimeInfo();
 * �޸����룺                   chagePswd();
 * ע����                         logout();
 * ֵ����Ա��          setCurStaff();
 * ���˵���    loadLeftMenu();
 * ����澯������loadAlarmList();
 * ά����ҵ���죺setJobs();
 * �߶�ǩ�� ����: loadHighSign();
 * ����ͳ�ƹ�����:getCountEvent();
 * ���°��:punched();
 * �ж��Ƿ��:hasPunched();
 */
 //�ж��Ƿ��
function hasPunched(){
    var xmlDom = getXmlFromHtmlData("hasPunchedData");
    if(xmlDom){
    	var hasPunch = xmlDom.selectSingleNode("/root/HAS_PUNCH").text;
    	if(hasPunch=='T'){//�Ѵ�
		var ON_WORKING_TIME = xmlDom.selectSingleNode("/root/ON_WORKING_TIME").text;
		var OFF_WORKING_TIME = xmlDom.selectSingleNode("/root/OFF_WORKING_TIME").text;
            	if(ON_WORKING_TIME!='' && ON_WORKING_TIME!=null && ON_WORKING_TIME!='null'){
        		document.getElementById('onWorkButton').innerHTML = '<img src="resource/image/indexITMonitorConsole/on_working_time.png" style="margin-right:-1px;" ' +
        									' title="�ϰ��ʱ��" align="absmiddle"><font style="font-family:����;font-size:9pt;font-weight:bold;color:#FFCC00;">'+ON_WORKING_TIME+'</font>';
        		}
            	if(OFF_WORKING_TIME!='' && OFF_WORKING_TIME!=null && OFF_WORKING_TIME!='null'){
            		document.getElementById('offWorkButton').innerHTML = '<img src="resource/image/indexITMonitorConsole/off_working_time.png" style="margin-right:-1px;" ' +
            									' title="�°��ʱ��" align="absmiddle"><font style="font-family:����;font-size:9pt;font-weight:bold;color:#FFCC00;">'+OFF_WORKING_TIME+'</font>';
            	} 	
           }
    }else{
        alert("��ѯ�Ƿ��ʧ��!");
    }
}
 //���°��
 function punched(type){
 	var today = new Date();
 	var theday = today.getFullYear()+"-" + [today.getMonth()+1]+"-" +today.getDate() + " "+ today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
 	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.open("post","/servlet/itMConsoleServlet?action=7&type="+type+"&punchDate="+theday,false);
    xmlhttp.send("");
    if(isSuccess(xmlhttp)){
    	var result = xmlhttp.responseXML.selectSingleNode("/root/result").text;
    	if(result=='T'){
	    		if(type==1){//�ϰ�
 						document.getElementById('onWorkButton').innerHTML = '<img src="resource/image/indexITMonitorConsole/on_working_time.png" style="margin-right:-1px;" ' +
 										' title="�ϰ��ʱ��" align="absmiddle"> <font style="font-family:����;font-size:9pt;font-weight:bold;color:#FFCC00;">'+theday+'</font>';
 				}else if(type==2){//�°�
 						document.getElementById('offWorkButton').innerHTML = '<img src="resource/image/indexITMonitorConsole/off_working_time.png" style="margin-right:-1px;" ' +
 										' title="�°��ʱ��" align="absmiddle"> <font style="font-family:����;font-size:9pt;font-weight:bold;color:#FFCC00;">'+theday+'</font>';
 				} 	
	    }else{
	    	alert("��ʧ�ܣ�");
	    }
    }else{
        alert("��ʧ�ܣ�");
    }
 }
 
//����ͳ�� ������
function getCountEvent(){
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState==4){
             setCountEvent(xmlhttp)
        }
    } 
    xmlhttp.open("post","servlet/itMConsoleServlet?action=5",true);
    xmlhttp.send("");
}
function setCountEvent(xmlhttps){ 
    if(isSuccess(xmlhttps)){
        var inHTMLStr = ""; 
        var oErrCodeStr = xmlhttps.responseXML.selectSingleNode("/root/error_code"); 
        if(oErrCodeStr &&oErrCodeStr.text == 0) {
            var oNodes = xmlhttps.responseXML.selectNodes("/root/rowSet");
            
            for (i=0; i<oNodes.length; i++) { 
                try{
                        var alarm                = oNodes[i].selectSingleNode("ALARM_COUNT").text;;
                        var mainJob            = oNodes[i].selectSingleNode("MAIN_JOB_COUNT").text;
                        var highSign            = oNodes[i].selectSingleNode("HIGH_SIGN_COUNT").text;
                        
                        var countEvent = parseInt(alarm)+parseInt(mainJob)+parseInt(highSign);
                        if(countEvent>0){//���ڴ�������ʾ��
                            document.getElementById("oBGSound").src = "resource/media/message.wav";
                        }
                        
                        inHTMLStr += "<span style=\"color:#0055E5;font-size:13px;line-height:25px;height:25px;cursor:hand;padding:5px 0 0 10px;\" "+
			                                 "           onMouseOver=\"this.style.textDecoration=\'underline\'\" onMouseOut=\"this.style.textDecoration=\'\'\"> "+
			                                 "      <img src='resource/image/indexITSM/advert.gif' align='absmiddle' style='margin-right:3px;'> " +
			                                 "                ����<b style='color:#FF0000'>"+alarm+"</b>���澯����; " +
			                                 "                <b style='color:#FF0000'>"+mainJob+"</b>��ά����ҵ����; " +
			                                 "                <b style='color:#FF0000'>"+highSign+"</b>���߶�ǩ�����죬��ע�����! " +
			                                 "</span>";
                }catch(e){continue}
            }
        }
        marqueeSpan.innerHTML = inHTMLStr; 
    } 
}
//�߶�ǩ�� ����
function loadHighSign(){
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("post","/servlet/itMConsoleServlet?action=4",false);
    xmlhttp.send();
    var dXML = new ActiveXObject("Microsoft.XMLDOM");
    dXML.load(xmlhttp.responseXML);
    iniHighSign(dXML);
}
function iniHighSign(dXML){
    var oRows = dXML.selectNodes("/root/rowSet");
    var iLen = oRows.length;
    var oItem = null;
    var rowObject;
    var cellObject;
    for(var i=0;i<iLen && i<6;i++) {
        oItem = oRows[i];
        rowObject = highSignDiv.insertRow();
        //rowObject.height=25;
        
        cellObject = rowObject.insertCell();
        cellObject.noWrap=true;
        cellObject.align="left";
        cellObject.innerHTML = '<span onclick="doMenu_open(\'/workshop/form/zjFormFile/zj_sign.jsp?imsi='+oItem.selectSingleNode("IMSI").text+'&rowid='+oItem.selectSingleNode("ROW_ID").text+'\')" style="padding-left:10px;width:215px;overflow:hidden;text-overflow:ellipsis;cursor:default;color:#2167AC;cursor:hand;" onmouseover="this.style.textDecoration=\'underline\';" onmouseout="this.style.textDecoration=\'none\';">'+
                                                oItem.selectSingleNode("IMSI").text+  
                                            '</span>';
       
        cellObject = rowObject.insertCell();
        cellObject.noWrap=true;
        cellObject.align="left";
        cellObject.innerHTML = '<span style="padding-left:10px;width:115px;overflow:hidden;text-overflow:ellipsis;color:#2167AC;">'+
                                                oItem.selectSingleNode("YW_CLASS_ID").text+  
                                            '</span>';
                                          
        cellObject = rowObject.insertCell();
        cellObject.noWrap=true;
        cellObject.align="left";
        cellObject.innerHTML = '<span style="overflow:hidden;text-overflow:ellipsis;cursor:default;color:#7C7E7D;">'+
                                                oItem.selectSingleNode("START_DATE").text+  
                                            '</span>';
    }
}
//����澯����
function loadAlarmList(){
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState==4){
             setAlarmList(xmlhttp)
        }
    } 
    xmlhttp.open("post","servlet/itMConsoleServlet?action=2&listNum=10",true);
    xmlhttp.send("");
}
function setAlarmList(xmlhttps){ 
    if(isSuccess(xmlhttps)){
       
        alarmListDiv.innerHTML = '<img src="resource/image/indexITSM/loading3.gif" style="margin:100px 0 0 230px;">';
        var inHTMLStr = ""; 
        var oErrCodeStr = xmlhttps.responseXML.selectSingleNode("/root/error_code"); 
        if(oErrCodeStr &&oErrCodeStr.text == 0) {
            var oNodes = xmlhttps.responseXML.selectNodes("/root/rowSet");
            
            inHTMLStr += '<table class="alarTable" align="center" border="0" cellspacing="0" cellpadding="0">';
            inHTMLStr += '  <tr>';
            inHTMLStr += '      <th width="25px">&nbsp;</th>';
            inHTMLStr += '      <th align="left" style="padding-left:40px">�� ��</th>';
            inHTMLStr += '      <th align="center">����״̬</th>';
            inHTMLStr += '      <th align="center">����ʱ��</th>';
            inHTMLStr += '      <th align="center">�澯����</th>';
            inHTMLStr += '  </tr>';
            var trColor="#FBFCFE";
            
            for (i=0; i<oNodes.length&&i<8; i++) { 
                try{
                        var content              = oNodes[i].selectSingleNode("CONTENT").text;;
                        var createdDate       = oNodes[i].selectSingleNode("CREATED_DATE").text;
                        var contenId            = oNodes[i].selectSingleNode("CONTENT_ID").text;
                        var alarmLevel         = oNodes[i].selectSingleNode("ALARM_LEVEL").text;
                        var state                 = oNodes[i].selectSingleNode("STATE").text;
                        var alarmLevelCN    = "֪ͨ";
                        switch (alarmLevel) {
                            case '1': alarmLevelCN = '<span style="color:red;font-weight:bolder;">����<span>'; break;
                            case '2': alarmLevelCN = '��Ҫ'; break;
                            case '3': alarmLevelCN = 'һ��'; break;
                            case '4': alarmLevelCN = '֪ͨ'; break;
                            default: break; 
                        }
	                    if(i%2==0){ trColor="#FBFCFE"; }else{ trColor="#F5F9FC"; }
	                    inHTMLStr += '<tr style="background-color:'+trColor+';">';
	                    inHTMLStr += '  <td align="center"><img src="resource/image/indexITSM/ni_title_img_3.gif" style="margin-right:8px;" align="absmiddle"/></td>';
	                    inHTMLStr += '  <td align="left"><div style="width:400px;white-space:nowrap; overflow:hidden;text-overflow:ellipsis;">'+content+'</div></td>';
                        inHTMLStr += '  <td>'+state+'</td>';
	                    inHTMLStr += '  <td>'+createdDate+'</td>';
	                    inHTMLStr += '  <td>'+alarmLevelCN+'</td>';
	                    inHTMLStr += '</tr>';
                }catch(e){continue}
            }
        }
        alarmListDiv.innerHTML = inHTMLStr; 
    } 
}
//ά����ҵ
function setJobs(){
    var JHhtml="";
    var jobs = getJobs();
    if(jobs.length>0){
        //jobMore.innerHTML = '<a onclick="niOpenWind(\'workshop/maintjobplan/itemResultSearchList.jsp\',true)" href="#" class="ni_moreLink" >����>></a>';
        for(var i=0; i<jobs.length&&i<=7; i++){
            var job = jobs[i]
            JHhtml += '<div style="height:20px;padding-left:5px;width:100%;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+
                            '     <img src="resource/image/indexITSM/ni_title_img_2.gif" align="absMiddle"/>'+
                            '     <span onClick="doMenu_open(\'' +job.URL + '\')" onmouseover="this.style.textDecoration=\'underline\';" ' +
                            '               onmouseout="this.style.textDecoration=\'none\';" style="text-decoration:none;overflow: hidden; cursor: hand; TEXT-OVERFLOW: ellipsis; color: #7195B7;" >'+job.CONTENT+'</span>'+
                             '</div>';
        }
    }else{
        JHhtml += '<div style="width:225px;text-align:left;font-weight:bold;">������������ҵ�ƻ���</div>';
    }
    JHdiv.innerHTML = JHhtml;
}
function getJobs(){
    var retVal = []
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("post", "/servlet/itMConsoleServlet?action=3", false);
    xmlhttp.send();
    if (!isSuccess(xmlhttp))  return;
    var dXML = new ActiveXObject("Microsoft.XMLDOM");
    dXML.load(xmlhttp.responseXML);
    var element = dXML.selectSingleNode("/root/rowSet");
    while (element != null) {
        var childs = element.childNodes
        var obj = {}
        for (var i = 0; i < childs.length; i++) {
            var e = childs[i]
            var toel = 'obj.' + e.nodeName + '="' + e.text + '"';
            toel = toel.replace(/\n/g, '<br/>')
            try{
                eval(toel)
            }catch(ex){ 
                // �쳣, ��ֵ���õ���������
                var errKey = "err" + i
                obj[errKey] = e.text
            }
        }
        retVal.push(obj);
        element = element.nextSibling;
    }
    if(retVal.length==0){
        return ''
    }
    return retVal; 
}

 //�������˵�
var reloc_id = [];
var reloc_url =[];
function loadLeftMenu(parentId){
    var xmlDom = getXmlFromHtmlData("loadLeftMenuData");
    var menuInHtml="";
    var oErrCodeNode = xmlDom.selectSingleNode("/root/error_code");
    if(oErrCodeNode && oErrCodeNode.text == 0){
        var fMenuItemList = xmlDom.selectNodes("/root/Menu/MenuItem");
        if(fMenuItemList.length>0){
            menuInHtml += loadSMenuItemList(fMenuItemList);
        }
    } 
   
    if(menuInHtml!='' && menuInHtml != null){
        //���ò˵� ��չʾ!!
        menuDIV.style.display = 'block';
        accordion.innerHTML = menuInHtml;
        iniMenuEvent();
        $('#menu_top').click();
    }
}

function loadSMenuItemList(sMenuItemList){//һ���˵�
    var retMenuHtml = "";
    for(var i=0;i<sMenuItemList.length;i++){
        var privilegeId= sMenuItemList[i].getAttribute("PRIVILEGE_ID");
        var privilegeName= sMenuItemList[i].getAttribute("PRIVILEGE_NAME");
        var serverUrlName= sMenuItemList[i].getAttribute("SERVER_URL_NAME");
        var scriptName= sMenuItemList[i].getAttribute("SCRIPT_NAME");
        var ulMenuItemList = sMenuItemList[i].childNodes;
        
        if(i==0){//��һ��
            retMenuHtml += "<h3 id='menu_"+i+"' class='menu_item_title_top'>"+privilegeName+"</h3>";
        }else{
            retMenuHtml += "<h3 id='menu_"+i+"' class='menu_item_title'>"+privilegeName+"</h3>";
        }
        
        if(ulMenuItemList.length>0){
            retMenuHtml += "<div class='position' style='height:200px;'>";
            retMenuHtml += loadUlMenuItemList(ulMenuItemList);
            retMenuHtml += "</div>";
        }else{
            retMenuHtml += "<div></div>";
        }
    }
    return retMenuHtml;
}
function loadUlMenuItemList(ulMenuItemList){//�����˵�
    var retMenuHtml = "";
    retMenuHtml += "    <ul>";
    for(var i=0;i<ulMenuItemList.length;i++){
        var privilegeId= ulMenuItemList[i].getAttribute("PRIVILEGE_ID");
        var privilegeName= ulMenuItemList[i].getAttribute("PRIVILEGE_NAME");
        var serverUrlName= ulMenuItemList[i].getAttribute("SERVER_URL_NAME");
        var scriptName= ulMenuItemList[i].getAttribute("SCRIPT_NAME");
        var openUrl="";
        // ��������д���ַ�򲻼ӵ�ַͷ�����û����Ĭ���ǵ�ǰ�ķ����ַ��ת
        for(var x=0;x<reloc_id.length;x++){
            if (reloc_id[x]===privilegeId){
                if(reloc_url[x].indexOf("http")==-1)
                    serverUrlName = location.protocol+"//"+location.hostname+":"+
                        reloc_url[x]+"&userName="+userName+"&passwd="+pswd;
                else 
                    serverUrlName = reloc_url[x]+"&userName="+userName+"&passwd="+pswd;
                break;
            }
        }
        if(serverUrlName!=undefined && serverUrlName!=""){
            if(scriptName=="doMenu_open()"){
                openUrl = " onClick='doMenu_open(\""+serverUrlName+"\")' ";
            }else{
                openUrl = " onClick='niOpenWind(\""+serverUrlName+"\")' ";
            }
        } 
         retMenuHtml += " <li><a href='#'"+ openUrl +">"+privilegeName+"</a></li>";
    }
    retMenuHtml += "    </ul>";
    return retMenuHtml;
}
//���´��ڴ�ҳ��
function doMenu_open(url,width,height,winId) {
    width = (typeof(width)=="undefined")?screen.availWidth:width;
    height = (typeof(height)=="undefined")?screen.availHeight:height;
    var top = (screen.availHeight-height)/2;
    var left =(screen.availWidth-width)/2;
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
    if(!winId)
    {
        winId = '_blank';
    }
    window.open(url,winId,sFeatures.join(","));
}

//ԭ���ڴ�
function niOpenWind(url){
    if(url=="" || url==undefined){
        return;
    }
    var width = screen.availWidth;
    var height = screen.availHeight-30;
    var sFeatures = new Array();
    sFeatures.push("width="+width);
    sFeatures.push("height="+height);
    sFeatures.push("top="+0);
    sFeatures.push("left="+0);
    sFeatures.push("location="+0);
    sFeatures.push("menubar="+0);
    sFeatures.push("resizable="+1);
    sFeatures.push("scrollbars="+1);
    sFeatures.push("status="+0);
    sFeatures.push("titlebar="+0);
    sFeatures.push("toolbar="+0);
    document.getElementById("mainFrame").src = url; 
}
//ֵ����Ա
function setCurStaff(){
    var userName = getCurrentStaffName();
    document.getElementById('curStaff').innerText = userName;
}

//ע��
function logout(){
    document.frmLogin.submit();
}

 //�޸����룺
function chagePswd(){
    window.showModalDialog("workshop/user/changePw.html",window,"dialogWidth=408px;dialogHeight=250px;help=0;scroll=0;status=0;");
}
//����ͷ������ʱ����Ϣ
function setDateTimeInfo() {
    var hours, minutes, seconds, xfile;
    var intHours, intMinutes, intSeconds;
    var today, theday ,year;
    today = new Date();
    function initArray(){
        this.length=initArray.arguments.length
        for(var i=0;i<this.length;i++)
        this[i+1]=initArray.arguments[i]
    }
    var d=new initArray(
        "������",
        "����һ",
        "���ڶ�",
        "������",
        "������",
        "������",
        "������");
    //�������Ϊfirefoxʱ
    if(navigator.appName == "Netscape") {
        year=1900 + today.getYear();
    }
    if(navigator.appVersion.indexOf("MSIE") != -1) {
        year= today.getYear();
    }
    theday = year+"��" + [today.getMonth()+1]+"��" +today.getDate() + "��&nbsp;"+d[today.getDay()+1];
    intHours = today.getHours();
    intMinutes = today.getMinutes();
    intSeconds = today.getSeconds();
    if (intHours == 0) {
        hours = "12:";
        xfile = "��ҹ";
    } else if (intHours < 12) {
        hours = intHours+":";
        xfile = "����";
    } else if (intHours == 12) {
        hours = "12:";
        xfile = "����";
    } else {
        intHours = intHours - 12
        hours = intHours + ":";
        xfile = "����";
    }
    if (intMinutes < 10) {
        minutes = "0"+intMinutes+":";
    } else {
        minutes = intMinutes+":";
    }
    if (intSeconds < 10) {
        seconds = "0"+intSeconds+" ";
    } else {
        seconds = intSeconds+" ";
    }
    timeString = theday+"&nbsp;"+xfile+"&nbsp;"+hours+minutes+seconds;
    document.getElementById('oCurDateTime').innerHTML = timeString;
    window.setTimeout("setDateTimeInfo();", 1000);
}
