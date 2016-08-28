/*****************************************
 *加载头部日期时间信息:setDateTimeInfo();
 *加载菜单:loadReLocMenuInfo();loadMenu();
 *加载工作导航:WorkLink();//loadLeftItem();
 *即时通信消息 未阅读提示:setWebIMMsgInfo();
 *流程阅办未读消息:loadUnReadWebIMList();
 *加载个性菜单:loadShortCutMenu(); 
 *内部公告(信息发布):loadBillInfos();
 *待办:setMsgInfo();
 *首页报表:homePageReport_Init();
 *维护作业：setJobs();//普通用户
 *知识库：setKbase()
 *功能地图: showSysMap();
 ******************************************/
//引入新菜单功能  
document.write("<script language='javascript' src='resource/js/newMenu_ITSM.js'></script>");
document.write("<link href='resource/css/newMenu_ITSM.css' type='text/css' rel='stylesheet'/>");

var menuDoc = new ActiveXObject("Microsoft.XMLDOM");

/*******************
 *加载头部日期时间信息
 *******************/
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
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六");
    //当浏览器为firefox时
    if(navigator.appName == "Netscape") {
        year=1900 + today.getYear();
    }
    if(navigator.appVersion.indexOf("MSIE") != -1) {
        year= today.getYear();
    }
    theday = year+"年" + [today.getMonth()+1]+"月" +today.getDate() + "日&nbsp;"+d[today.getDay()+1];
    intHours = today.getHours();
    intMinutes = today.getMinutes();
    intSeconds = today.getSeconds();
    if (intHours == 0) {
        hours = "12:";
        xfile = "午夜";
    } else if (intHours < 12) {
        hours = intHours+":";
        xfile = "上午";
    } else if (intHours == 12) {
        hours = "12:";
        xfile = "正午";
    } else {
        intHours = intHours - 12
        hours = intHours + ":";
        xfile = "下午";
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

/*****************
 *加载菜单
 *****************/
var reloc_id = [];
var reloc_url =[];
var userName;
var pswd;
function loadReLocMenuInfo(){
    var xmlDoc = getPrivilegeLocXML();
        var oRows = xmlDoc.selectNodes("//rowSet");
        if (oRows != null){
            var iLen = oRows.length;
            for(var i=0;i<iLen;i++)
            {
                var oRow = oRows[i];
                var sClassCode = oRow.getAttribute("id");
                var sClassText = oRow.selectSingleNode("TO_URL").text
                if(sClassCode != "" && sClassCode != "")
                {
                    reloc_id[i]=sClassCode;
                    reloc_url[i]=sClassText;
                }
            }
        }
}

function getPrivilegeLocXML()
{
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    var submitURL = "/servlet/menu?id=-1&action=9";
    xmlhttp.Open("GET",submitURL,false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
       return xmlhttp.responseXML;
    }
}

//加载菜单
var fMenuMU = 0;
function loadMenu(){
    userName = getCurrentUserInfo("user_name");
    pswd = getCurrentUserInfo("pswd");
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState==4){
            loadMenuList(xmlhttp)
        }
    }
    xmlhttp.open("post","/servlet/menu?id=-1&action=1",true);
    xmlhttp.send("");
}
function loadMenuList(xmlhttp){
    var menuInHtml="";
    var oErrCodeNode = xmlhttp.responseXML.selectSingleNode("/root/error_code");
    if(oErrCodeNode && oErrCodeNode.text == 0){
        var fMenuItemList = xmlhttp.responseXML.selectNodes("/root/Menu/MenuItem");
        if(fMenuItemList.length>0){
            menuInHtml += loadSMenuItemList(fMenuItemList);
        }
    }
    sysMenuDiv.innerHTML = menuInHtml;
    setMenuHtml();
}

function loadSMenuItemList(sMenuItemList){
    //loadReLocMenuInfo();
    var retMenuHtml = "";
    for(var i=0;i<sMenuItemList.length;i++){
        fMenuMU++;
        var privilegeId= sMenuItemList[i].getAttribute("PRIVILEGE_ID")||"";
        var privilegeName= sMenuItemList[i].getAttribute("PRIVILEGE_NAME")||"";
        var serverUrlName= sMenuItemList[i].getAttribute("SERVER_URL_NAME")||"";
        var scriptName= sMenuItemList[i].getAttribute("SCRIPT_NAME")||"";
        var ulMenuItemList = sMenuItemList[i].childNodes;
        var openUrl="";
        
        if(serverUrlName!=undefined && serverUrlName!=""){
            if(scriptName=="doMenu_open()"){
                openUrl = " onClick='doMenu_open(\""+serverUrlName+"\")'";
            }else{
                openUrl = " onClick='niOpenWind(\""+encodeURIComponent(serverUrlName)+"\",false)'";
            }
        }else{
            if(scriptName=="testMessageBox()"){//弹出层界面
                 openUrl = " onClick='testMessageBox("+privilegeId+")'";
            }else if(scriptName=="showSwitchDiv()"){//弹出接入流程选择界面
                 openUrl = " onClick='showSwitchDiv()'";
            }
        }
        retMenuHtml += "<div id='menu"+fMenuMU+"' class='menusel'>";
        if(fMenuMU==1){
            if(ulMenuItemList.length>0){
                retMenuHtml += "<h2 style='border-left-width:0px;'><a href='#' "+openUrl+" class='hasDomMenu'>"+privilegeName+"</a></h2>";
            }else{
                retMenuHtml += "<h2 style='border-left-width:0px;'><a href='#' "+openUrl+">"+privilegeName+"</a></h2>";
            }
        }else{
            if(ulMenuItemList.length>0){
                retMenuHtml += "<h2><a href='#' "+openUrl+" class='hasDomMenu'>"+privilegeName+"</a></h2>";
            }else{
                retMenuHtml += "<h2><a href='#' "+openUrl+">"+privilegeName+"</a></h2>";
            }
        }
        retMenuHtml += "    <div class='position'>";
        if(ulMenuItemList.length>0){
            retMenuHtml += loadUlMenuItemList(ulMenuItemList);
        }
        retMenuHtml += "    </div>";
        retMenuHtml += "</div>";
    }
    return retMenuHtml;
}

function loadUlMenuItemList(ulMenuItemList){
    var retMenuHtml = "";
    retMenuHtml += "    <ul>";
    for(var i=0;i<ulMenuItemList.length;i++){
        var privilegeId= ulMenuItemList[i].getAttribute("PRIVILEGE_ID")||"";
        var privilegeName= ulMenuItemList[i].getAttribute("PRIVILEGE_NAME")||"";
        var serverUrlName= ulMenuItemList[i].getAttribute("SERVER_URL_NAME")||"";
        var scriptName= ulMenuItemList[i].getAttribute("SCRIPT_NAME")||"";
        var cUlMenuItemList = ulMenuItemList[i].childNodes;
        var openUrl="";
        //added by panchh
        // 如果配置有带地址则不加地址头，如果没有则默认是当前的服务地址跳转
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
                openUrl = " onClick='doMenu_open(\""+serverUrlName+"\")'";
            }else{
                openUrl = " onClick='niOpenWind(\""+encodeURIComponent(serverUrlName)+"\",false)'";
            }
        }else{
            if(scriptName=="testMessageBox()"){//弹出层界面
                 openUrl = " onClick='testMessageBox("+privilegeId+")'";
            }else if(scriptName=="showSwitchDiv()"){//弹出接入流程选择界面
                 openUrl = " onClick='showSwitchDiv()'";
            }
        }
        if(i==0){
            if(cUlMenuItemList.length>0){
                retMenuHtml += "    <li class='noBorderLi'><a href='#' "+openUrl+" class='hasDomRight'>"+privilegeName+"</a>";
            }else{
                retMenuHtml += "    <li class='noBorderLi'><a href='#' "+openUrl+">"+privilegeName+"</a>";
            }
        }else{
            if(cUlMenuItemList.length>0){
                retMenuHtml += "    <li><a href='#' "+openUrl+" class='hasDomRight'>"+privilegeName+"</a>";
            }else{
                retMenuHtml += "    <li><a href='#' "+openUrl+">"+privilegeName+"</a>";
            }
        }
        if(cUlMenuItemList.length>0){
            retMenuHtml += loadUlMenuItemList(cUlMenuItemList);
        }
        retMenuHtml += "    </li>";
    }
    retMenuHtml += "    </ul>";
    return retMenuHtml;
}

function setMenuHtml(){
    for(var x = 1; x <= fMenuMU; x++){
        var menuid = document.getElementById("menu"+x);
        menuid.num = x;
        sType();
    }
    function sType(){
        var menuh2 = menuid.getElementsByTagName("h2");
        var menuul = menuid.getElementsByTagName("ul");
        if(!menuul || menuul.length==0) return;
        var menuli = menuul[0].getElementsByTagName("li");
        if(!menuli || menuli.length==0) return;
        menuh2[0].onmouseover = show;
        menuh2[0].onmouseout = unshow;
        menuul[0].onmouseover = show;
        menuul[0].onmouseout = unshow;
        function show(){
            menuul[0].className = "clearfix typeul block"
        }
        function unshow(){
            menuul[0].className = "typeul"
        }
        for(var i = 0; i < menuli.length; i++){
            menuli[i].num = i;
            var liul = menuli[i].getElementsByTagName("ul")[0];
            if(liul) {
                typeshow()
            }
        }
        function typeshow() {
            menuli[i].onmouseover = showul;
            menuli[i].onmouseout = unshowul;
        }
        function showul(){
            menuli[this.num].getElementsByTagName("ul")[0].className = "block";
        }
        function unshowul(){
            menuli[this.num].getElementsByTagName("ul")[0].className = "";
        }
    }
}

/*************
 * 加载工作导航
 *************//*
function loadLeftItem(){
    var orgType = getStaffOrgType();
    //集团（不包含上海运营中心和北京运营中心）的登陆，展示“新建任务单”“新建质询单”“新建需事件单”“新建需求单”
    if (orgType == "1"){
        document.getElementById("leftItem1").style.display = "block";
        document.getElementById("leftItem2").style.display = "block";
        document.getElementById("leftItem3").style.display = "none";
        document.getElementById("leftItem4").style.display = "block";
        document.getElementById("leftItem5").style.display = "none";
        document.getElementById("leftItem6").style.display = "block";
        document.getElementById("leftItem7").style.display = "none";
        document.getElementById("leftItem8").style.display = "none";
        document.getElementById("leftItem9").style.display = "none";
    }
    //上海运营中心，北京运营中心展示“新建工作联系单”“新建需求单”
    if (orgType == "2"){
        document.getElementById("leftItem1").style.display = "none";
        document.getElementById("leftItem2").style.display = "none";
        document.getElementById("leftItem3").style.display = "block";
        document.getElementById("leftItem4").style.display = "none";
        document.getElementById("leftItem5").style.display = "none";
        document.getElementById("leftItem6").style.display = "block";
        document.getElementById("leftItem7").style.display = "none";
        document.getElementById("leftItem8").style.display = "none";
        document.getElementById("leftItem9").style.display = "none";
    }
    //省公司展示“新建申告单”“集团任务派发查询”“本省工号维护”
    if (orgType == "3"){
        document.getElementById("leftItem1").style.display = "none";
        document.getElementById("leftItem2").style.display = "none";
        document.getElementById("leftItem3").style.display = "none";
        document.getElementById("leftItem4").style.display = "none";
        document.getElementById("leftItem5").style.display = "none";
        document.getElementById("leftItem6").style.display = "none";
        document.getElementById("leftItem7").style.display = "block";
        document.getElementById("leftItem8").style.display = "block";
        document.getElementById("leftItem9").style.display = "block";
    }
}*/
/*获取当前员工所属组织类型
 * 1为集团员工，
 * 2为上海运营中心和北京运营中心，
 * 3为省公司员工
 */
function getStaffOrgType(){
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    oXMLHTTP.open("get", "/servlet/staff_manage?tag=96", false);
    oXMLHTTP.send("");
    if (isSuccess(oXMLHTTP)) {
        return oXMLHTTP.responseXML.selectSingleNode("/root/org_type").text;
    }
}

/*********************
 * 即时通信消息未阅读提示 *
 *********************/
var isUnreadMessages = false;
var lastTopUnreadMsgId = 0;
var curTopUnreadMsgId = 0;
function setWebIMMsgInfo(){
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState==4){
            setWebIMMsgInfoSet(xmlhttp)
        }
    }
    xmlhttp.open("post","/servlet/UnReadAction?action=5",true);//action=4
    xmlhttp.send("");
}
function setWebIMMsgInfoSet(xmlhttp) {
    if(isSuccess(xmlhttp)){ 
        var ALL_countNum = "";
        var FLOW_DISPOSE_countNum = "";
        var oErrCodeNode = xmlhttp.responseXML.selectSingleNode("/root/error_code");
        if(oErrCodeNode && oErrCodeNode.text == 0) {
            var uodoNodeList = xmlhttp.responseXML.selectNodes("/root/UNDO_COUNT");
            var uodoNodeListLength=uodoNodeList.length;
            if(uodoNodeListLength != 0) {
                for(var i=0;i<uodoNodeListLength;i++){
                    if(uodoNodeList[i].getAttribute("type") =="ALL"){
                        ALL_countNum = uodoNodeList[i].text;
                        isUnreadMessages = true;
                    }
                    if(uodoNodeList[i].getAttribute("type") =="FLOW_DISPOSE"){
                        FLOW_DISPOSE_countNum = uodoNodeList[i].text;
                    }
                }
            }
        }
        if (ALL_countNum > 0){
            var mHtml="";
            curTopUnreadMsgId = ALL_countNum;
                mHtml +='<span style="display:inline;color:#0055E5;font-size:13px;line-height:25px;height:25px;cursor:hand;text-align:center;" ';
                mHtml +='onMouseOver="this.style.textDecoration=\'underline\'" onMouseOut="this.style.textDecoration=\'\'" ';
                mHtml +='onclick="webIMMeeting();" title="点击查看">';
                mHtml +="<img src='resource/image/indexITSM/advert.gif' align='absmiddle' style='margin-right:3px;'>您有<b style='color:#FF0000'>"+ALL_countNum+"</b>条即时通信消息,请注意查收!";
                mHtml +='</span>';
            newMsg.innerHTML = mHtml;
            newMsg.style.display="block";
        }else{
            newMsg.style.display="none";            
        }
    }
    
    if(!isUnreadMessages) curTopUnreadMsgId = 0;
    if(isUnreadMessages && lastTopUnreadMsgId < curTopUnreadMsgId) {
        //oBGSound.src = "resource/media/message.wav";  //"你有新的消息,请注意查收"声音提示
    }
    isUnreadMessages = false;
    lastTopUnreadMsgId = curTopUnreadMsgId;
}

/****************
 * 流程阅办未读消息*
 ****************/
 var waiteTime=300000;
function loadUnReadWebIMList(){
    waiteTime = $getSysVar('JTITSM_UNREAD_WAITE_TIME');//刷新频率
    unRead();
    window.setInterval("unRead()",waiteTime);
}

function unRead(){//未读
        param = new Array('action=20');   
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState==4){
                loadUnReadWebIMListSet(xmlhttp)
            }
        }
        xmlhttp.open("post","../../servlet/msgAction?"+param.join("&"),true);
        xmlhttp.send("");
    }
    

function loadUnReadWebIMListSet(xmlhttp) {
    if(isSuccess(xmlhttp)){
        var oErrCodeNode = xmlhttp.responseXML.selectSingleNode("/root/error_code");
        var outHTML_start = '';
        var DBcountN = 0;
        if(oErrCodeNode.text == 0){
            DBcountN = xmlhttp.responseXML.selectSingleNode("/root/COUNT").text;
        }
        
        if(DBcountN>0){
            DBcount.innerHTML = "(<font color='#ff0000'>"+DBcountN+"</font>)";
        }else{
            DBdiv.innerHTML = "<span style='padding-left:10px;color:#999999;'><br>暂无新的流程阅办单。</span>";
            DBcount.innerHTML = "";
        }
        
        if (DBcountN > 0){
            var mHtmlDC="";
                mHtmlDC +='<span style="display:inline;color:#0055E5;font-size:13px;line-height:25px;height:25px;cursor:hand;text-align:center;" ';
                mHtmlDC +='onMouseOver="this.style.textDecoration=\'underline\'" onMouseOut="this.style.textDecoration=\'\'" ';
                mHtmlDC +='onclick="doMenu_open(\'workshop/queryTemplate/ReadItsm.html?result=91000002&tab=1\');" title="点击查看">';//&callback=window.opener.unRead()
                mHtmlDC +="<img src='resource/image/indexITSM/advert.gif' align='absmiddle' style='margin-right:3px;'>您有<b style='color:#FF0000'>"+DBcountN+"</b>条流程阅办消息，请处理！";
                mHtmlDC +='</span>';
            newMsg_FLOW_DISPOSE.innerHTML = mHtmlDC;
            newMsg_FLOW_DISPOSE.style.display="block";
        }else{
            var mHtmlDC="";
                mHtmlDC +='<span style="display:inline;color:#6D8591;font-size:13px;line-height:25px;height:25px;cursor:hand;text-align:center;" ';
                mHtmlDC +='onMouseOver="this.style.textDecoration=\'underline\'" onMouseOut="this.style.textDecoration=\'\'" ';
                mHtmlDC +='onclick="doMenu_open(\'workshop/queryTemplate/ReadItsm.html?result=91000002&tab=2\');" title="点击查看">';
                mHtmlDC +="<img src='resource/image/indexITSM/qbxs.gif' align='absmiddle'>暂无新的流程阅办单。";
                mHtmlDC +='</span>';    
            newMsg_FLOW_DISPOSE.innerHTML = mHtmlDC;
            newMsg_FLOW_DISPOSE.style.display="block";
        }
    }
}


/***************************
 * 加载个性菜单，也就是收藏夹菜单*
 ****************************/
function loadShortCutMenu(){
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState==4){
            loadShortCutMenuList(xmlhttp)
        }
    }
    xmlhttp.open("POST","servlet/FavoritesAction?action=0",true);
    xmlhttp.send("");
}
function loadShortCutMenuList(xmlhttp) {
    if(isSuccess(xmlhttp)){ 
        menuDoc.load(xmlhttp.responseXML);
        var outHTMLStr = "";
        var oNodes = menuDoc.selectNodes("//rowSet"); 
        var oErrCodeStr = oNodes.context.selectSingleNode("/root/error_code"); 
        if(oErrCodeStr.text == 0) {
            var menuList = oNodes.context.selectNodes("/root/Menu/MenuItem/MenuItem");
            if(menuList.length >0){
                for(i=0; i<menuList.length&&i<20; i++){     //
                  try{
                      var privilegeId = menuList[i].getAttribute("PRIVILEGE_ID");//ADDED BY PANCHH
                      var favoriteName = menuList[i].getAttribute("FAVORITE_NAME");
                      var serverUrlName = menuList[i].getAttribute("SERVER_URL_NAME")
                      var scriptName = menuList[i].getAttribute("SCRIPT_NAME");
                      //added by panchh
                      // 如果配置有带地址则不加地址头，如果没有则默认是当前的服务地址跳转
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
                      if(favoriteName != null && favoriteName != "" && serverUrlName != null && serverUrlName != ""){
                          outHTMLStr += "<a class='ni_staffMenu' href='#' title='"+ favoriteName +"' ";
                          if(scriptName!=null && scriptName!="" && scriptName.indexOf("doMenu_open")>-1){ 
                                outHTMLStr += " onClick=\"doMenu_open('" + serverUrlName + "','',''," + menuList[i].getAttribute("id") + ")\" ";
                          }else{
                                outHTMLStr += " onClick=\"niOpenWind('" + serverUrlName + "',true)\" ";
                          }
                          outHTMLStr += "><img src='resource/image/indexITSM/ni_title_img_2.gif' align='absmiddle'/>"; 
                          outHTMLStr += favoriteName; 
                          outHTMLStr += "</a>";
                      }
                  }catch(e){continue}
                }
            }
        }
        shortCutMenu.innerHTML = outHTMLStr;
    } 
}
/*********************
 * 加载内部公告(信息发布)*
 *********************/
var billInfoBeforeItems = new Array();
var billInfoAfterItems = new Array();
var billXmlhttp;
function loadBillInfos(){
    document.getElementById('billInfos').innerHTML='<img src="resource/image/indexITSM/loading3.gif" style="margin:30px 0 0 0px;">';
    billXmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    var actionUrl = "servlet/billInfoServlet?tag=35&recent=10";//tag=1
    billXmlhttp.open("POST", actionUrl,true);
    billXmlhttp.onreadystatechange = loadBillInfoDetails;
    billXmlhttp.send("");
}
function loadBillInfoDetails(){
    if(billXmlhttp!=null && billXmlhttp.readyState==4 && isSuccess(billXmlhttp))
    {
        //(1). 信息发布列表
        var dXML = billXmlhttp.responseXML; 
        billXmlhttp = null;
        var billOutput = '';
        var firstBillOutput = '';
        var hasPrivilege = dXML.selectSingleNode("/root/HAS_PRIVILEGE").text;
        if(hasPrivilege=="true"){
            var oRows=dXML.selectNodes("/root/BILL_INFOS/rowSet");
            var iLen=oRows.length;
            var isSpecial;
            var isGreat;
            var msgIsRead="";
            for(var i=0;i<iLen&&i<8;i++)
            {
                isSpecial = oRows[i].selectSingleNode("IS_SPECIAL").text;
                var submitDate = oRows[i].selectSingleNode("SUBMIT_DATE").text;
                submitDate = submitDate.substring(5,10);
                if("1"==oRows[i].selectSingleNode("IS_READ").text){
                    msgIsRead = '<IMG SRC="resource/image/ico/msg_read.gif" ALT="已读" align="absmiddle">';
                }else{
                    msgIsRead = '<IMG SRC="resource/image/ico/msg_unread.gif" ALT="未读" align="absmiddle">';
                }
                
                if(isSpecial!=null && typeof isSpecial!="undefined" && isSpecial=="0BT"){
                    //精华贴加“精”:
                    isGreat = '<IMG SRC="resource/image/indexImage/great.gif" align="absmiddle" style="margin:0 2px;"/>';
                }else{
                    isGreat = '';
                }
                if(i==0){
                    firstBillOutput += "<div style='height:22px;padding-left:8px;line-height:22px;width:280px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'><IMG SRC=\"resource/image/ico/newImg4.gif\" ALT=\"未读\" align=\"absmiddle\"><span style='color:#2067A9;font-size:13px;'>";
                    firstBillOutput += "<a onclick=\"showBillInfoWindow(3,'"+oRows[i].selectSingleNode('BILL_INFO_ID').text+"','"+oRows[i].selectSingleNode("CATEGORY_NAME").text+"')\" style='color:#2166A9;' ";
                    firstBillOutput += "onMouseOver=\"this.style.color='#FF0000'\" onMouseOut=\"this.style.color='#2166A9'\" href='#'>"+oRows[i].selectSingleNode("TITLE").text+"</a>";
                    firstBillOutput += isGreat;
                    firstBillOutput += getNewImage(oRows[i].selectSingleNode("STATE").text, oRows[i].selectSingleNode("SUBMIT_DATE").text);
                    firstBillOutput += "<font style='color:#999999'> "+ oRows[i].selectSingleNode("SUBMIT_DATE").text +"</font>";
                    firstBillOutput += "</span></div>"; 
                }else{
                    billOutput += "<div title='"+ oRows[i].selectSingleNode("TITLE").text +"' style='height:22px;line-height:22px;width:280px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'>";
                    billOutput += msgIsRead;
                    billOutput += "<a onclick=\"showBillInfoWindow(3,'"+oRows[i].selectSingleNode('BILL_INFO_ID').text+"','"+oRows[i].selectSingleNode("CATEGORY_NAME").text+"')\" href='#'>"+oRows[i].selectSingleNode("TITLE").text+"</a>";
                    billOutput += isGreat;
                    billOutput += getNewImage(oRows[i].selectSingleNode("STATE").text, oRows[i].selectSingleNode("SUBMIT_DATE").text);
                    billOutput += "<font style='color:#999999'> "+submitDate+"</font>";
                    billOutput += "</div>";
                }
            }
        }
        billInfos.innerHTML = billOutput;
        firstBillInfos.innerHTML = firstBillOutput;
    }
}



function showBillInfoWindow(tag, billInfoId, categoryName){
    if(categoryName!=null && categoryName!=undefined && categoryName=="GG"){
        //公告栏
        MM_openBrWindow("workshop/board/boardInfoContent.jsp?boardInfoId="+billInfoId,"");
        return;
    }
    if(categoryName!=null && categoryName!=undefined && categoryName=="ZSK"){
        //知识库
        MM_openBrWindow("workshop/knowledge/knowledgeRead.html?kId="+billInfoId+"&state=4SA&configName=KNOWLEDGES&IS_PRI_UPDATE=false&IS_PRI_DELETE=false&IS_PRI_AUDIT=false&IS_PRI_STORAGE=false","");
        return;
    }
    var openWin = displayMaxWindowWithHandle("workshop/info/billInfoContent.jsp?billInfoId="+billInfoId,"", true);
    openWin.attachEvent('onunload', function(){loadBillInfos();});
}
function MM_openBrWindow(theURL,winName) {
    x=(window.screen.width-780)/2;
    y=(window.screen.height-580)/2;
    var curr_window=window.open(theURL,winName,"scrollbars=yes,top=50,left=250,width=780,height=670,resizable=yes");
    curr_window.focus();
}
function displayMaxWindowWithHandle(url, name, isCheckPrivilege)
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
    return window.open(url, name, sFeatures.join(","));
}
/***************
 *    待 办  *
 * ***************/
//定时刷新待办
function refreshMsgInfo(){
     window.setInterval("setMsgInfo()",waiteTime);
}


var gEType;
function setMsgInfo(){
    document.getElementById('eventPageIfr').src = 'eventPageList_itsm.html'; //待办明细
    //loadFlowMsgInfoStart(); //初始加载：待办明细
//    msgCountDiv.innerHTML = '<img src="resource/image/indexITSM/loading3.gif" style="margin:100px 0 0 0px;">';
//    var staffId = cur_StaffId;
//    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
//    xmlhttp.onreadystatechange=function(){
//    	renderTODOList(xmlhttp);renderToTrackList(xmlhttp);
//    }
//    xmlhttp.open("post","servlet/EventPageSimple?tag=3",true);    //"/servlet/Flows_Count?staff_id="+staffId,true);
//    xmlhttp.send(null);
}


function renderTODOList(xmlhttp){//待办汇总
    var state = xmlhttp.readyState;
    if(state!=4)return
    var outHTML = "";
//        var staffName = getCurrentUserName();
        var rowSetList = xmlhttp.responseXML.selectNodes("/root/rowSet");
        if(rowSetList.length != 0) {
            outHTML += '<table class="ni_msgInfoTable" align="center" border="0" cellspacing="0" cellpadding="0" style="margin:4px 0px;">';
            for(var i=0;i<rowSetList.length;i++){
                var flowMod = rowSetList[i].selectSingleNode("flow_mod").text;
//                if(flowMod=="133739" || flowMod=="133759"){
//                    //过虑掉固资"人工打分审批流程133759"、"考核指标修改审批流程133739"流程
//                    continue;
//                }
                var bgColor="#FFFFFF";;
                if(i%2==1){
                    bgColor = "#F6F6F6";
                }
                outHTML +=  '<tr style="background-color:'+bgColor+';">';
                outHTML +=  '   <th>'+ rowSetList[i].selectSingleNode("flow_name").text +'：</th>'; 
                outHTML +=  '   <td>';
                if ( rowSetList[i].selectSingleNode("type12_num").text >0){
                    outHTML +=  '<span style="width:75px;text-align:left;font-weight:bold;cursor:hand;" onClick="changeTab(1,'+ rowSetList[i].selectSingleNode("queryResultId").text+','+rowSetList[i].selectSingleNode("flow_mod").text+')" onMouseOver="this.style.color=\'#FF0000\'; this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\'; this.style.textDecoration=\'none\';" title="点击查看">';
                    outHTML +=  '待办理:';
                    outHTML +=  '<font style="color:#FF0000;font-weight:normal;">'+ rowSetList[i].selectSingleNode("type12_num").text +'</font>';
                    outHTML +=  '</span>';
                }
                if ( rowSetList[i].selectSingleNode("type3_num").text >0){
                    outHTML +=  '<span style="width:60px;text-align:left;font-weight:normal;cursor:hand;" onClick="changeTab(2,'+ rowSetList[i].selectSingleNode("queryResultId").text+','+rowSetList[i].selectSingleNode("flow_mod").text+')" onMouseOver="this.style.color=\'#FF0000\'; this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\'; this.style.textDecoration=\'none\';" title="点击查看">';
                    outHTML +=  '发起:';
                    outHTML +=  '<font style="color:#FF0000;font-weight:normal;">'+ rowSetList[i].selectSingleNode("type3_num").text +'</font>';
                    outHTML +=  '</span>';
                }
                if ( rowSetList[i].selectSingleNode("type100_num").text >0){
                    outHTML +=  '<span style="width:75px;text-align:left;font-weight:normal;cursor:hand;" onClick="changeTab(3,'+ rowSetList[i].selectSingleNode("queryResultId").text+','+rowSetList[i].selectSingleNode("flow_mod").text+')" onMouseOver="this.style.color=\'#FF0000\'; this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\'; this.style.textDecoration=\'none\';" title="点击查看">';
                    outHTML +=  '已办理:';
                    outHTML +=  '<font style="color:#FF0000;font-weight:normal;">'+ rowSetList[i].selectSingleNode("type100_num").text +'</font>';
                    outHTML +=  '</span>';
                }
                outHTML +=  '   </td>';
                outHTML +=  '</tr>';
            }
            outHTML += '</table>';
        }else {
            outHTML += '<br/><br/><div style="line-heigth:35px; color:#0066CD; padding:0 0 6px 5px;">您好！您目前无待办工作！</div>';
        }
    xmlhttp = null;
    msgCountDiv.innerHTML = outHTML;
}

/**
 * 跟踪
 * @param {} xmlhttp
 */
function renderToTrackList(xmlhttp){
	var state = xmlhttp.readyState;
    if(state!=4)return
    var oData = ResultFactory.newResult("JTITSM_TRACK_LIST");
	var trDetail = "";
	var divLabelInfo = "";
	oData.async = false;
	oData.onLoad = function(oXml)
	{
		var oRows = oXml.selectNodes("/root/rowSet");
		var divObj = document.getElementById("trackDiv");
		var firstInHTMLStr = "";
		var inHTMLStr = "";
		if(oRows.length > 0){
			document.getElementById("TrackTab").innerHTML="跟踪工单("+oRows.length+")";
			document.getElementById("TrackTab").style.display = "block";
			for(var i = 0; i < oRows.length; i++) {
			  	if(i>7){
			  		document.getElementById("moreDiv").style.display = "block";
			  		break;
			  	}
			  	try{
					var flowId			= oRows[i].childNodes[0].text;
					var flowTitle		= oRows[i].childNodes[1].text;
					var flowCreatedDate	= oRows[i].childNodes[2].text;
					
					if(i==0){
						firstInHTMLStr += "<span style='color:#2067A9;font-size:13px;'>";
				    	firstInHTMLStr += '<span onclick="showTrackWin(\'/workshop/form/index.jsp?fullscreen=yes&flowId='+ flowId +'&system_code=G\')" target="_blank" style="color:#2167AC;" '
				        			+'onMouseOver=this.style.color="#F84201" onMouseOut=this.style.color="#2167AC" style = "cursor:hand" >' + flowTitle;
						firstInHTMLStr += "<br/><font style='color:#999999'> "+ flowCreatedDate +"</font>";
						firstInHTMLStr += "</span>";
					}else{
		            	flowCreatedDate = flowCreatedDate.substring(5,10);
				        inHTMLStr += "<div style='height:22px;line-height:22px;width:100%;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'>";
				        inHTMLStr += "<img src='resource/image/indexITSM/ni_title_img_3.gif' style='margin-right:8px;' align='absmiddle'/>";
				        inHTMLStr += '<span onclick="showTrackWin(\'/workshop/form/index.jsp?fullscreen=yes&flowId='+ flowId +'&system_code=G\')" target="_blank" style="color:#2167AC;" '
				        			+'onMouseOver=this.style.color="#F84201" onMouseOut=this.style.color="#2167AC" style = "cursor:hand" >' + flowTitle +'</span>';
				        inHTMLStr += "<font style='color:#999999'> "+flowCreatedDate+"</font>";
				        inHTMLStr += "</div>";
			        }
				}catch(e){continue}
			}
			oTrackFirstDiv.innerHTML = firstInHTMLStr;
			oTrackListDiv.innerHTML =  inHTMLStr;
		}else{
			
			//oTrackListDiv.innerHTML = '<br/><br/><div style="line-heigth:35px; color:#0066CD; padding:0 0 6px 5px;">您好！您目前无跟踪工单！</div>';
		}
	}
	oData.send(Result.FORCE_GET,{});
}

/**
 * 打开跟踪流程表单页面
 * @type 
 */
var flowWind=null;
function showTrackWin(theURL,winName) 
{
	if (winName == "undefined" || winName == null){
		winName = "_blank";
	}
    var curr_window;
    x=(window.screen.width-780)/2;
    y=(window.screen.height-560)/2;
    flowWind = window.open(theURL,winName,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
}

/**
 * 打开跟踪更多页面
 */
function showTrackMore(){
	var sql = "select t.get_value_id text from get_value_cfg t where t.get_value_cfg_id = (select a.get_value_cfg_id from value_cfg_param a where a.param_name = 'JTITSM_TRACK_LIST')";
	showTrackWin('/workshop/query/show_result.html?result='+queryData(sql));
}

/*************************************** 
 * 获取员工本人配置的首页展示报表(异步执行)
 * ******************/
// 加载统计图表
// 图表页面url
var charts = [];  
var tabName = [];  
$(function(){});

function homePageReport_Init(){
   var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   xmlhttp.onreadystatechange=function(){
      if(xmlhttp.readyState!=4){
          return;
      }
      var state = getHomePage_Action(xmlhttp);
      if(!state){
         getHomePrivileges();
      }
      if(charts.length >0){
         buildTab();
         switchChart(0);
         document.getElementById("rightChartDiv").style.display = "block";       
      }else{
         document.getElementById("rightChartDiv").style.display = "none";
      }
   }
   xmlhttp.open("POST","/servlet/staff_manage?tag=118",true);//tag=95
   xmlhttp.send();
}
//获取员工本人配置的首页展示报表(异步响应后执行的动作)
function getHomePage_Action(xmlhttp){
   var flag = false;
   var list = xmlhttp.responseXML.selectNodes("/root/rowSet");
   if(list.length <=0){
      return flag;
   }
   charts = [];
   tabName = [];
   for(var i=0; i<list.length; i++){
       var pri_id = list[i].selectSingleNode("PRI_ID").text;
       var checked = list[i].selectSingleNode("CHECKED").text;
       if(pri_id == '10301' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=201&chart=905&height=170";
          tabName[tabName.length] = "派发单各省完成情况";
          continue;
       }
       if(pri_id == '10302' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=202&chart=907&height=170";
          tabName[tabName.length] = "本部门派发单执行情况";
          continue;
       }
       if(pri_id == '10303' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=203&chart=908&height=170";
          tabName[tabName.length] = "各省申告请求统计";
          continue;
       }
       if(pri_id == '10304' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=204&chart=910&height=170";
          tabName[tabName.length] = "集团申告处理统计";
          continue;
       }
       if(pri_id == '10305' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=209&chart=915&height=170";
          tabName[tabName.length] = "部门派单完成率"; 
          continue;
       }
       if(pri_id == '10306' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=210&chart=916&height=170";
          tabName[tabName.length] = "部门派单完成及时率";
          continue;
       }
   }
   if(charts.length<=0){
      flag=false;
   }else{
      flag = true;
   }
   return flag;
}

function buildTab(){
   if(tabName.length >0){     
       for(var i=0;i<tabName.length && i<4;i++){
           document.getElementById('tb_'+i).innerText = tabName[i]; 
           document.getElementById('td_'+i).style.display = 'block';      
       }
       if(tabName.length <4){
          for(var j=tabName.length;j<4;j++){
              document.getElementById('td_'+j).style.display = 'none';
          } 
       }
   }
}
function switchChart(idx){
    var orgId = getCurrentUserInfo("org_id");
    if(idx == 0 || idx == 1){
       charts[idx] = charts[idx]+'&orgId='+orgId; 
    }
    $('#chartDiv').attr('src', charts[idx]);
    setTbListDef(idx);
}
function setTbListDef(idx){
    document.getElementById('tb_0').className = "tbListDef";
    document.getElementById('tb_1').className = "tbListDef";
    document.getElementById('tb_2').className = "tbListDef";
    document.getElementById('tb_3').className = "tbListDef";
    document.getElementById('tb_'+idx).className = "tbListSel";
}

//获取员工首页报表的相关权限
function getHomePrivileges(){
   var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   xmlhttp.open("GET","/servlet/staff_manage?tag=93",false);
   xmlhttp.send("");
   var list = xmlhttp.responseXML.selectNodes("/root/rowSet"); 
   if(list.length <=0){
      return ;
   }
   charts  = [];
   tabName = [];
   for(var i=0; i<list.length; i++){
       var pri_id = list[i].selectSingleNode("PRI_ID").text;
       switch(pri_id){
          case '10301' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=201&chart=905&height=170";
                         tabName[tabName.length] = "派发单各省完成情况";
                         break;
          case '10302' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=202&chart=907&height=170";
                         tabName[tabName.length] = "本部门派发单执行情况";
                         break;
          case '10303' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=203&chart=908&height=170";
                         tabName[tabName.length] = "各省申告请求统计";
                         break;    
          case '10304' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=204&chart=910&height=170";
                         tabName[tabName.length] = "集团申告处理统计";
                         break;   
          case '10305' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=209&chart=915&height=170";
                         tabName[tabName.length] = "部门派单完成率";
                         break;
          case '10306' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=210&chart=916&height=170";
                         tabName[tabName.length] = "部门派单完成及时率";
                         break;                                                    
       }                                         
   }
}

//获取员工本人配置的首页展示报表
function getHomePage(){
   var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   xmlhttp.open("GET","/servlet/staff_manage?tag=118",false);//tag=95 
   xmlhttp.send("");
   var flag = false;
   var list = xmlhttp.responseXML.selectNodes("/root/rowSet");
   if(list.length <=0){
      return flag;
   }
   charts = [];
   tabName = [];
   for(var i=0; i<list.length; i++){
       var pri_id = list[i].selectSingleNode("PRI_ID").text;
       var checked = list[i].selectSingleNode("CHECKED").text;
       if(pri_id == '10301' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=201&chart=905&height=170";
          tabName[tabName.length] = "派发单各省完成情况";
          continue;
       }
       if(pri_id == '10302' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=202&chart=907&height=170";
          tabName[tabName.length] = "本部门派发单执行情况";
          continue;
       }
       if(pri_id == '10303' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=203&chart=908&height=170";
          tabName[tabName.length] = "各省申告请求统计";
          continue;
       }
       if(pri_id == '10304' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=204&chart=910&height=170";
          tabName[tabName.length] = "集团申告处理统计";
          continue;
       }
       if(pri_id == '10305' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=209&chart=915&height=170";
          tabName[tabName.length] = "部门派单完成率"; 
          continue;
       }
       if(pri_id == '10306' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=210&chart=916&height=170";
          tabName[tabName.length] = "部门派单完成及时率";
          continue;
       }
   }
   if(charts.length<=0){
      flag=false;
   }else{
      flag = true;
   }
   return flag;
}
/*************
 * 知识库
 ************/
function setKbase(){
    var htmls = ''
    var template = 
            "<div style=\"text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; margin-bottom:12px;\">\n" +
            "  <img src=\"resource/image/indexITSM/$TIMG\" align=\"texttop\" style=\"margin:1px 8px 0 5px;\"/>\n" + 
            "  $TITLE<br>\n" + 
            "<font style=\"margin-left:30px;color:#666666; font-family:Arial, Helvetica, sans-serif;\">$STAFF&nbsp;&nbsp;|&nbsp;&nbsp;$DATE&nbsp;&nbsp;|&nbsp;&nbsp;</font><a target=_blank href=\"$LINK\" class=\"ni_moreLink\" style=\"text-decoration:underline;\">详细信息</a>\n" + 
            " </div>";
    var datas = queryKnowledges()
    if(datas.length > 0){
        var m=1;
        for(var i=0; i<datas.length&&i<4; i++){//只显示4条
            var k = datas[i]
            var html = template.replace(/\$STAFF/g, k.STAFF_NAME)
            html = html.replace(/\$TITLE/g, k.SUBJECT)
            html = html.replace(/\$DATE/g, k.STATE_DATE)
            html = html.replace(/\$LINK/g, k.LINK)
            html = html.replace(/\$TIMG/g, "ni_number_"+m+".gif");
            html = html.replace(/\=true/g, "=false");  //禁止编辑
            htmls += html
            m++;
        }
    }else{
        htmls =  '<div style="width:225px;text-align:left;font-weight:bold;">知识库暂无内容</div>'
    }
    $('#kbasediv').html(htmls)
}

/*****************
 * 打开论坛
 * ***************/
function GetDiscuzUrl(){
 var pwd        = pswd;
 hrefValue = window.location.href;
 //linjl 2011-5-23
 alertUrls = queryAllData("select sys_var_value from sys_config where sys_var='DISCUZ_URL_MAP'")[0].SYS_VAR_VALUE;
 alertUrls = eval('('+alertUrls+')');
 for(var i=0;i<alertUrls.length;i++){
   for(var h in alertUrls[i]){
     if(String(hrefValue).indexOf(h)>=0){
        //document.getElementById("lturl").href="http://"+alertUrls[i][h]+"/discuz/testLogin.php?username="+userName+"&password="+pwd;
        document.getElementById("lturl_more").href="http://"+alertUrls[i][h]+"/discuz/testLogin.php?username="+userName+"&password="+pwd;
        return true;
     } 
   }
 }
 return false;
}

/************************
 * 初始化论坛消息列表
 ************************/
//add by wuqing , 2012/01/04
function getDiscuzPostsList(){
    var discuzUrl = "../../servlet/DiscuzServlet?tag=1&staffId="+getCurrentStaffId();
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    xmlhttp.onreadystatechange=function(){renderPostsList(xmlhttp)}
    xmlhttp.open("post",discuzUrl,true);
    xmlhttp.send("");   
//  alert(xmlhttp.responseText);
}

function renderPostsList(xmlhttp){
    var state = xmlhttp.readyState;
    if(state!=4)return
    var innerHTML = "";
    var rowSetList = xmlhttp.responseXML.selectNodes("/root/rowSet");
    if(rowSetList.length != 0) {
        for(var i=0;i<rowSetList.length;i++){
            var pid = rowSetList[i].selectSingleNode("PID").text;       
            var fid = rowSetList[i].selectSingleNode("FID").text;       
            var tid = rowSetList[i].selectSingleNode("TID").text;   
            var author = rowSetList[i].selectSingleNode("AUTHOR").text;     
            var subject = rowSetList[i].selectSingleNode("SUBJECT").text;   
            var postTime = rowSetList[i].selectSingleNode("POST_TIME").text;    

            innerHTML += '<div style="width:315px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; margin-bottom:12px;">';
            innerHTML += '<img src="resource/image/indexITSM/ni_number_'+(i+1)+'.gif" align="texttop" style="margin-right:8px;"/>';
            innerHTML += subject + '<br>';
            innerHTML += '<font style="margin-left:30px;color:#999999; font-family:Arial, Helvetica, sans-serif;">';
            innerHTML += author + '&nbsp;&nbsp;|&nbsp;&nbsp;' + postTime + '&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;</font>';
            innerHTML += '<a href="'+GetDiscuzUrlStr()+'/testLogin.php?username='+userName+'&userFrom=message&tid='+tid+'&amp;extra=page%3D1'+'" target="_blank" class="ni_moreLink" style="text-decoration:underline;">详细信息</a>';
            innerHTML += '</div>';
        }
    }
    document.getElementById("postDiv").innerHTML = innerHTML;
}
//获得论坛url
function GetDiscuzUrlStr(){
 var pwd        = pswd;
 hrefValue = window.location.href;
 //linjl 2011-5-23
 alertUrls = queryAllData("select sys_var_value from sys_config where sys_var='DISCUZ_URL_MAP'")[0].SYS_VAR_VALUE;
 alertUrls = eval('('+alertUrls+')');
 for(var i=0;i<alertUrls.length;i++){
   for(var h in alertUrls[i]){
     if(String(hrefValue).indexOf(h)>=0){
        return "http://"+alertUrls[i][h]+"/discuz";
     } 
   }
 }
 return "";
}
/***************************
 * 点击首页报表【配置】
 ***************************/
function confShowReport(){
    //linjl 2011-12-29
    reportConfigDate();
     // 建立对话框
    $("#reportConfig").dialog({
        title:'报表配置',
        modal:true,
        width:window.screen.width/5+'px',
        heigth:'500px',
        autoOpen:false,
        zIndex:-1000,
        overlay:{
                backgroundColor: '#000',
                opacity: 0.1
        },
        buttons:{
             '关 闭':function(){
                net_ElementList_Type=0;
                $(this).dialog('close');
             },
             '应 用':function(){
                var state =  reportCfgSave();
                $(this).dialog('close');
                if(state){
                   getHomePage();
                   if(charts.length >0){
                      buildTab();
                      switchChart(0);
                      document.getElementById("rightChartDiv").style.display = "block";
                   }else{
                      document.getElementById("rightChartDiv").style.display = "none";
                   }
                }
            }
        }
    });
    $("#reportConfig").dialog('open');
}

var pri_id = [];
//linjl 2011-12-29 首页报表配置初始化
function reportConfigDate(){
   pri_id = [];
   var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   xmlhttp.open("GET","/servlet/staff_manage?tag=118",false);//tag=95
   xmlhttp.send();
   var list = xmlhttp.responseXML.selectNodes("/root/rowSet");
   var innerHtml = '<table width="99%" align="center" border="0" cellspacing="4" cellpadding="0">';
   if(list.length>0){
      for(var i=0; i<list.length; i++){
          var privilege_id = list[i].selectSingleNode("PRI_ID").text;
         // pri_id[pri_id.length] = privilege_id;
          var chk = list[i].selectSingleNode("CHECKED").text;  
          var check = false;
          if(chk == '1'){
             check = true;
          }else{
             check = false;
          }
          switch(privilege_id){
             case '10301' : tabName = "派发单各省完成情况";
                  break;
             case '10302' : tabName = "本部门派发单执行情况";
                  break;
             case '10303' : tabName = "各省申告请求统计";
                  break;     
             case '10304' : tabName = "集团申告处理统计";
                  break;   
             case '10305' : tabName = "部门派单完成率";   
                  break;
             case '10306' : tabName = "部门派单完成及时率";
                  break;                           
             default :
                  break;                               
          }  
          if(privilege_id == '10301' || privilege_id == '10302'  || privilege_id == '10303'  || privilege_id == '10304'  || privilege_id == '10305'  || privilege_id == '10306'){
              pri_id[pri_id.length] = privilege_id;
              innerHtml += "<tr><td align='center' style='width:10px'><img src='/resource/image/picExmaple.gif' width='16px' /></td>"; 
              innerHtml += "<td align='left' style='font-size:13px'>"; 
              if(check){
                 innerHtml += "<input type='checkbox' value='"+tabName+"' checked="+check+" id='check_"+i+"'>"+tabName+"</input>";
              }else{
                 innerHtml += "<input type='checkbox' value='"+tabName+"' id='check_"+i+"'>"+tabName+"</input>";
              }
              innerHtml += "</td></tr>";
          }
      }
   }else{
      xmlhttp.open("GET","/servlet/staff_manage?tag=93",false);
      xmlhttp.send("");
      var list = xmlhttp.responseXML.selectNodes("/root/rowSet"); 
      if(list.length <=0){
         return;
      }
      for(var i=0; i<list.length; i++){
       var priIdd = list[i].selectSingleNode("PRI_ID").text;
       innerHtml += "<tr><td align='center'><img src='/resource/image/picExmaple.gif' width='16px' /></td>"; 
       innerHtml += "<td align='left' style='font-size:13px'>"; 
       switch(priIdd){
          case '10301' : tabName = "派发单各省完成情况";
                         innerHtml += "<input type='checkbox' value='"+tabName+"' checked='true' id='check_"+i+"'>"+tabName+"</input>";
                         pri_id[pri_id.length] = "10301";
                         break;
          case '10302' : tabName = "本部门派发单执行情况";
                         innerHtml += "<input type='checkbox' value='"+tabName+"' checked='true' id='check_"+i+"'>"+tabName+"</input>";
                         pri_id[pri_id.length] = "10302";
                         break;
          case '10303' : tabName = "各省申告请求统计";
                         innerHtml += "<input type='checkbox' value='"+tabName+"' checked='true' id='check_"+i+"'>"+tabName+"</input>";
                         pri_id[pri_id.length] = "10303";
                         break;    
          case '10304' : tabName = "集团申告处理统计";
                         innerHtml += "<input type='checkbox' value='"+tabName+"' checked='true' id='check_"+i+"'>"+tabName+"</input>";
                         pri_id[pri_id.length] = "10304";
                         break;  
          case '10305' : tabName = "部门派单完成率";
                         innerHtml += "<input type='checkbox' value='"+tabName+"' checked='true' id='check_"+i+"'>"+tabName+"</input>";
                         pri_id[pri_id.length] = "10305";
                         break;   
          case '10306' : tabName = "部门派单完成及时率";
                         innerHtml += "<input type='checkbox' value='"+tabName+"' checked='true' id='check_"+i+"'>"+tabName+"</input>";
                         pri_id[pri_id.length] = "10306";
                         break;                                                  
       }   
       innerHtml += "</td></tr>";                                             
     }
   }
   innerHtml += "</table>";
   document.getElementById("reportConfig").innerHTML = innerHtml;
}

//linjl 2011-12-29 报表配置数据保存[应用]
function reportCfgSave(){
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.open("post","/servlet/staff_manage?tag=97",false);//tag=94 
    
    var sendXML = '<?xml version="1.0" encoding="gbk"?><root>';
    var dXML = new ActiveXObject("Microsoft.XMLDOM");
    for(var i=0;i<pri_id.length;i++){
        var ch = document.getElementById("check_"+i).checked;
        if(ch == true){
           ch = 1;
        }else{
           ch = 0;
        }
        sendXML = sendXML + '<rowSet><PRI_ID>'+ pri_id[i] +'</PRI_ID>'+'<CHECKED>'+ch+'</CHECKED></rowSet>';
    }
    sendXML = sendXML + '</root>';
    dXML.loadXML(sendXML);
    xmlhttp.send(dXML);
    if(isSuccess(xmlhttp)){
        MMsg("保存成功！");
        return true;
    }else{
        EMsg("保存失败！");
        return false;
    }
}


/*********************************************
 *************** 公用方法 *********************
 ********************************************/
/*判断某用户是否有某菜单的权限
 *privilegeId:菜单ID;
 *staffId:用户ID(为空时为当前用户);
 */
function getHasPrivilege(privilegeId, staffId){
    if (privilegeId == "" || privilegeId == undefined) {
        return "false";
    }
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    oXMLHTTP.open("get","/servlet/staff_manage?tag=99&privilegeId="+privilegeId+"&staffId="+staffId,false);
    oXMLHTTP.send("");
    if (isSuccess(oXMLHTTP)){
        return oXMLHTTP.responseXML.selectSingleNode("/root/HAS_PRIVILEGE").text;
    }
}

/*工作导航新建流程 */
//function doMenuOpenByUrl(queryId,flowMod,type) {
function doMenuOpenByUrl(queryId,flowNum,type){
    //权限判断
    var hasPrivilege = 'false';
    if(flowNum=="jtitsm_11092"){//任务派发流程
        if(type=="RWD"){
            hasPrivilege = getHasPrivilege("308011024");//新建任务单
        }
        if(type=="ZXD"){
            hasPrivilege = getHasPrivilege("308011025");//新建质询单
        }
        if(queryId=="32"){
            hasPrivilege = getHasPrivilege("308011063");//新建工作联系单
        }
    }else if(flowNum=="jtitsm_3158"){   //事件管理流程
        hasPrivilege = getHasPrivilege("308030203");    //新建事件单
    }else if(flowNum=="jtitsm_12072"){  //需求管理流程
        hasPrivilege = getHasPrivilege("308080001");    //新建需求单
    }else if(flowNum=="jtitsm_3175"){   //问题管理流程
        hasPrivilege = getHasPrivilege("308050203");    //新建问题单
    }else if(flowNum=="jtitsm_11923"){  //申告管理流程
        hasPrivilege = getHasPrivilege("308011033");    //新建申告单
    }else if(flowNum=="taskListFromGroup"){ //集团任务派发查询
        hasPrivilege = getHasPrivilege("308011041");//集团任务派发查询
    }
    
    if(hasPrivilege=="false"){
        alert("你无权限进行此操作！");
        return;
    }
    
    var flowMod;
    //根据固定flow_num获得对应的flow_mod
    if(flowNum != "taskListFromGroup"){
        var tmpData = queryAllData("select flow_mod from flow_model where flow_num='"+flowNum+"'");
        if(tmpData && tmpData.length>0){
            flowMod = tmpData[0].FLOW_MOD;
        }else {
            alert("无此FLOW_MOD!请技术人员确认配置！");
            return;
        }
    }
    
    
    if (flowNum=="taskListFromGroup"){
        var url = "workshop/queryTemplate/mainFrame.html?result=90000400&tab=1";
    }else{
        var url = "workshop/form/index.html?flowMod="+flowMod;
        if(queryId=="31"){
            url+="&taskClass=1";
        }
        if(queryId=="32"){
            url+="&taskClass=2";
        }
        if(queryId=="26"){//任务派发流程
            if(type=="ZXD"){//新增质询单
                url+="&createType=ZXD&taskClass=1";
            }else{          //新增任务单
                url+="&createType=RWD";
            }
        }
    }
    width = screen.availWidth;
    height = screen.availHeight;
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
    if(!flowMod)
    {
        flowMod = '_blank';
    }
    window.open(url,flowMod,sFeatures.join(","));
}

/*通过调用此方法打开即时通信WebIM窗口 */
function webIMMeeting(id, name, tag, listTag) {
    if (!window.top.w) {
        eval("window.top.w = new Object();"); // eval执行：定义全局变量对象: window.top.w
    }
    if (window.top.w && window.top.w.open && !window.top.w.closed) {
        window.top.w.moveTo(0, 0); // 将窗口移到屏幕左上角
        window.top.w.resizeTo(screen.width, screen.height - 30); // 将窗口最大化
        window.top.w.focus(); // 将窗口置为当前窗口
        if (id != null && name != null && tag != null && id != "" && name != "" && tag != "") {
            var params = new Array();
            params.push("sendId=" + id); // id为用户ID或组织机构ID
            params.push("name=" + encodeURIComponent(name)); // name为用户名称或组织机构名称
            params.push("tag=" + tag); // 用户：tag="STAFF", 组织机构：tag="ORG"
            window.top.w.tabWinTitle.openWin("/workshop/webIM/messenger.jsp?" + params.join("&"), name, id, tag);
        }
        window.top.w.tabWinTitle.flashWindowTitle(); // 闪烁窗口标题
    } else {
        var wProperties = "top=0, left=0, height="+(window.screen.availHeight-35)+", width="+(window.screen.availWidth-10)+", toolbar=no, menubar=no, scrollbars=auto,resizable=yes,status=no";
        if (id != null && name != null && tag != null && id != "" && name != "" && tag != "") {
            var params = new Array();
            params.push("sendId=" + id); // id为用户ID或组织机构ID
            params.push("name=" + encodeURIComponent(name)); // name为用户名称或组织机构名称
            params.push("tag=" + tag); // 用户：tag="STAFF", 组织机构：tag="ORG"
            window.top.w = window.open("/workshop/webIM/index.jsp?"+params.join("&"),'WebIM',wProperties);
        } else {
            // 2010.08.27 linjx
            if(listTag!=null){
                window.top.w = window.open('/workshop/webIM/index.jsp?listTag='+listTag,'WebIM',wProperties);
            }else{         
                window.top.w = window.open('/workshop/webIM/index.jsp','WebIM',wProperties);
            }                       
        }
        window.top.w.moveTo(0, 0);
    }
}
/*打开个性化菜单(收藏夹菜单)*/
function shortCutdoReplaceURL(mainLoadUrl){
    window.top.document.all("rightFrame").src = mainLoadUrl;
}

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
/*打开页面*/
function niOpenWind(url,isNewWind){
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
    if(location.href.indexOf('index_CRMFrame.jsp') >= 0)
    {
    	document.all("rightFrame").src = decodeURIComponent(url);
    }
    else
    {
    	location.replace("index_CRMFrame.jsp?mainUrl="+url);
    }
}

/*****************************************************************
 *  头部功能块  *************************************************
 *****************************************************************/
//员工基本信息：
function editStaff(){
    window.showModalDialog("workshop/user/individualInfo.jsp?tag=1",null,"dialogWidth=500px;dialogHeight=566px;help=0;scroll=0;status=0;");
}

//角色转换：
function windowOpenStaffChang() {
    window.showModalDialog("workshop/stafferrand/staffErrandInfoNoFilter.html",window,"dialogWidth=530px;dialogHeight=410px;help=0;scroll=0;status=0;");
}

//修改密码：
function chagePswd(){
    window.showModalDialog("workshop/user/changePw.html",window,"dialogWidth=408px;dialogHeight=250px;help=0;scroll=0;status=0;");
}

//注销：
function logout(){
  //if (confirm('你确定要注销系统？')){
    document.frmLogin.submit();
}
//搜索
function searchEntrance(){
    document.getElementById('queryString').value = document.getElementById('queryString').value.trimall();
    var queryInput = document.getElementById('queryString').value;
    if(queryInput.length==0){
        alert("请输入搜索条件!");
        document.getElementById('queryString').focus();
        return;
    }
    var queryStr = encodeURIComponent(document.getElementById('queryString').value); //关键字
    var indexDir = "publish_index_directory";  //源
    var module = "knowledge";    //模块
    niOpenWind("workshop/searchEngine/search_entrance_result.htm?queryString="+queryStr+"&indexDirectory="+indexDir+"&module="+module+"&category=",false);
}


//-------------------------------------------------------------------------------------
/*//维护作业：
function setJobs() {
    var jobHtml="";
    var jobs = queryJobs();//维护作业待办
    
    //临时作业
    var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlHttp.Open("POST","/servlet/tempJobServlet?action=5",false);
    var sendXML = '<?xml version="1.0" encoding="gbk"?>'
           + '<root>'
           + '<search pagesize="15" page="1"/>'
           + '<query_type>2</query_type>'//临时维护作业待办
           + '<QRY_TYPE>init</QRY_TYPE>'
           + '<QRY_STATE>0SA</QRY_STATE>'
           + '<QRY_EXEC_STAFF>'+cur_StaffId+'</QRY_EXEC_STAFF>'
           + '</root>';
    xmlHttp.send(sendXML);
    var dom = xmlHttp.responseXML;
    jobHtml += '<div style="width:225px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">';
    jobHtml += '<div style="width:225px;text-align:left;"><font style="font-weight:bold;">临时作业：</font>'
    jobHtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/tempJobList.jsp\',true)" class="ni_moreLink">今日待办:<font style="color:red">'+dom.selectSingleNode("/root/recordCount").text+'</font></a>&nbsp;&nbsp;'
    sendXML = '<?xml version="1.0" encoding="gbk"?>'
           + '<root>'
           + '<search pagesize="15" page="1"/>'
           + '<query_type>3</query_type>'//临时维护作业审批
           + '<query_param><exec_staff>'+cur_StaffId
           + '</exec_staff></query_param>'
           + '</root>';
    xmlHttp.Open("POST","/servlet/tempJobServlet?action=5",false);
    xmlHttp.send(sendXML);
    dom = xmlHttp.responseXML;
    jobHtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/tempJobApproveList.jsp\',true)" class="ni_moreLink">待审核:<font style="color:red">'+dom.selectSingleNode("/root/recordCount").text+'</font></a>'
    jobHtml += '</div>'
    jobHtml += '</div>';
    //end
    //维护作业审批
    jobHtml += '<div style="width:225px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">';
    jobHtml += '<div style="width:225px;text-align:left;"><font style="font-weight:bold;">维护作业：</font>'
    sendXML = '<?xml version="1.0" encoding="gbk"?>'
           + '<root>'
           + '<search pagesize="15" page="1"/>'
           + '<query_type>1</query_type>'//维护作业审批
           + '<QRY_TYPE>init</QRY_TYPE>'
           + '<QRY_STATE>0SA</QRY_STATE>'
           + '<QRY_EXEC_STAFF>'+cur_StaffId+'</QRY_EXEC_STAFF>'
           + '</root>';
    xmlHttp.Open("POST","/servlet/tempJobServlet?action=5",false);
    xmlHttp.send(sendXML);
    dom = xmlHttp.responseXML;
    jobHtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/jobApproveList.jsp\',true)" class="ni_moreLink">待审批:<font style="color:red">'+dom.selectSingleNode("/root/recordCount").text+'</font></a>'
    jobHtml += '</div>'
    jobHtml += '</div>';
    //END 维护作业审批    
    
    if(jobs.length>0){
        jobHtml += '<div style="width:225px;text-align:left;"><font style="font-weight:bold;">今天你的作业计划有：</font>'
                        +'&nbsp;&nbsp;&nbsp;&nbsp;<a onclick="niOpenWind(\'workshop/maintjobplan/itemResultSearchList.jsp\',true)" href="#" class="ni_moreLink">更多>></a></div>';
        for(var i=0; i<jobs.length&&i<14; i++){
            var job = jobs[i]
            var doneImg = "ni_title_img_2.gif";
            if(job.ISDONE==true || job.ISDONE=="true"){
                doneImg = "ni_title_img_4.gif";
            }
            jobHtml += '<div style="width:225px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">';
            jobHtml += '<img src="resource/image/indexITSM/'+doneImg+'" align="texttop" style="margin-right:8px;"/>';
            jobHtml += '<a onClick="javascript:doMenu_open(\'' +job.URL + '\')"  href="#">'+job.CONTENT+'</a>';
          //  jobHtml += '<a onClick="javascript:openJob(\'' + job.BID + '\',\''+ job.ITEM_NAME + '\')" href="#">'+job.ITEM_NAME+'</a>';
            jobHtml += '</div>';
        }
    }else{
        jobHtml += '<div style="width:225px;text-align:left;font-weight:bold;">今天你暂无作业计划！</div>';
    }
    jobsDiv.innerHTML = jobHtml;
}*/
//维护作业：异步处理
function setJobs() {
    var jobHtml="";
    var LShtml="";
    var WHhtml="";
    var JHhtml="";
    var jobs = queryJobs();//维护作业待办
    
    //临时作业
    var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    
     xmlHttp.onreadystatechange=function(){
        if(xmlHttp.readyState==4){
            if(isSuccess(xmlHttp)){
                var dom = xmlHttp.responseXML;
                LShtml += '<div style="width:225px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">';
                LShtml += '<div style="width:225px;text-align:left;"><font style="font-weight:bold;">临时作业：</font>'
                LShtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/tempJobList.jsp\',true)" class="ni_moreLink">今日待办:<font style="color:red">'+dom.selectSingleNode("/root/recordCount").text+'</font></a>&nbsp;&nbsp;'
                LSdiv.innerHTML = LShtml;
            }
        }
     }
     
    xmlHttp.Open("POST","/servlet/tempJobServlet?action=5",true);
    var sendXML = '<?xml version="1.0" encoding="gbk"?>'
           + '<root>'
           + '<search pagesize="15" page="1"/>'
           + '<query_type>2</query_type>'//临时维护作业待办
           + '<QRY_TYPE>init</QRY_TYPE>'
           + '<QRY_STATE>0SA</QRY_STATE>'
           + '<QRY_EXEC_STAFF>'+cur_StaffId+'</QRY_EXEC_STAFF>'
           + '</root>';
    xmlHttp.send(sendXML);
    
    var xmlHttp1 = new ActiveXObject("Microsoft.XMLHTTP");
    xmlHttp1.onreadystatechange=function(){
        if(xmlHttp1.readyState==4){
            if(isSuccess(xmlHttp1)){
                var dom1 = xmlHttp1.responseXML;
                LShtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/tempJobApproveList.jsp\',true)" class="ni_moreLink">待审核:<font style="color:red">'+dom1.selectSingleNode("/root/recordCount").text+'</font></a>'
                LShtml += '</div>'
                LShtml += '</div>';
                LSdiv.innerHTML = LShtml;
            }
        }
     }
     
    var sendXML1 = '<?xml version="1.0" encoding="gbk"?>'
           + '<root>'
           + '<search pagesize="15" page="1"/>'
           + '<query_type>3</query_type>'//临时维护作业审批
           + '<query_param><exec_staff>'+cur_StaffId
           + '</exec_staff></query_param>'
           + '</root>';
    xmlHttp1.Open("POST","/servlet/tempJobServlet?action=5",true);
    xmlHttp1.send(sendXML1);
    
    //end
    //维护作业审批
    
    var xmlHttp2 = new ActiveXObject("Microsoft.XMLHTTP");
    xmlHttp2.onreadystatechange=function(){
        if(xmlHttp2.readyState==4){
            if(isSuccess(xmlHttp2)){
                var dom2 = xmlHttp2.responseXML;
                WHhtml += '<div style="width:225px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">';
                WHhtml += '<div style="width:225px;text-align:left;"><font style="font-weight:bold;">维护作业：</font>';
                WHhtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/jobApproveList.jsp\',true)" class="ni_moreLink">待审批:<font style="color:red">'+dom2.selectSingleNode("/root/recordCount").text+'</font></a>'
                WHhtml += '</div>'
                WHhtml += '</div>';
                WHdiv.innerHTML = WHhtml;
            }
        }
     }
     
    var sendXML2 = '<?xml version="1.0" encoding="gbk"?>'
           + '<root>'
           + '<search pagesize="15" page="1"/>'
           + '<query_type>1</query_type>'//维护作业审批
           + '<QRY_TYPE>init</QRY_TYPE>'
           + '<QRY_STATE>0SA</QRY_STATE>'
           + '<QRY_EXEC_STAFF>'+cur_StaffId+'</QRY_EXEC_STAFF>'
           + '</root>';
    xmlHttp2.Open("POST","/servlet/tempJobServlet?action=5",true);
    xmlHttp2.send(sendXML2);
    
    //END 维护作业审批    
    
    if(jobs.length>0){
        JHhtml += '<div style="width:225px;text-align:left;"><font style="font-weight:bold;">今天你的作业计划有：</font>'
                        +'&nbsp;&nbsp;&nbsp;&nbsp;<a onclick="niOpenWind(\'workshop/maintjobplan/itemResultSearchList.jsp\',true)" href="#" class="ni_moreLink">更多>></a></div>';
        for(var i=0; i<jobs.length&&i<14; i++){
            var job = jobs[i]
            var doneImg = "ni_title_img_2.gif";
            if(job.ISDONE==true || job.ISDONE=="true"){
                doneImg = "ni_title_img_4.gif";
            }
            JHhtml += '<div style="width:225px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">';
            JHhtml += '<img src="resource/image/indexITSM/'+doneImg+'" align="texttop" style="margin-right:8px;"/>';
            JHhtml += '<a onClick="javascript:doMenu_open(\'' +job.URL + '\')"  href="#">'+job.CONTENT+'</a>';
            JHhtml += '</div>';
        }
    }else{
        JHhtml += '<div style="width:225px;text-align:left;font-weight:bold;">今天你暂无作业计划！</div>';
    }
    JHdiv.innerHTML = JHhtml;
}





function changeTab(type,queryResultId,flow_mod){
    //result:是monitor_menu表的monitor_id
    //tab顺序:1待办理 2:发起 3:已处理 4:全部
    //menutree:决定是否显示左边的树(0隐藏，1显示，默认显示)
    var url ="workshop/queryTemplate/main.html?id="+queryResultId+"&tab="+type+"&flow_mod="+flow_mod+"&menutree=0";
    niOpenWind(url,true);
}

function getNewImage(state, stateDate)
{
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate()-3);
    var dateStr = currentDate.getFullYear()+"-"+formatTime(currentDate.getMonth()+1)+"-"+formatTime(currentDate.getDate())+" "+
                  formatTime(currentDate.getHours())+":"+formatTime(currentDate.getMinutes());
    if((state=='4SB' || state=='4SE') && stateDate>dateStr)
    {
        return '<IMG SRC="resource/image/indexImage/new_info.gif" align="absmiddle">';
    }
    return '';
}
function formatTime(dateStr)
{
    if(dateStr==null || dateStr=="") {return "00";}
    else if(dateStr<10) {return "0"+dateStr;}
    else {return dateStr;}
}


//-----------------------------------
// 显示等待框
var WAIT_ELEMENT_ID;
function showWaitITSM(text, oParent) {
    if (text == null) {
        text = '正在读取数据';
    }
    if (oParent == null) {
        oParent = window.document.body;
    }
    var oWait;
    if (WAIT_ELEMENT_ID == null
            || (oWait = document.getElementById(WAIT_ELEMENT_ID)) == null) {
        WAIT_ELEMENT_ID = document.uniqueID;
        var sDivHTML = "<div id='"
                + WAIT_ELEMENT_ID
                + "' style='width:165px;height:60px;z-index:1000;border:4px solid #FBFBFB;display:none;position:absolute;'>"
                + "<div style='width:160px;height:55px;border:2px solid #ADD4EC;background-color:#FAFDFF;'>"
                + "<div style='width:35px;;float:left; margin:13px 0 0 8px; border:0px solid #eee;'>"
                + "<img src='../../resource/image/itsmImages/loading3.gif'/>"
                + "</div>"
                + "<div style='width:90px;float:left;color:#0B4696;font:12px/18px 宋体; margin:8px 0 0 5px;border:0px solid #eee;'>"
                + text + "<br><font color='#FF0000'>请稍候...</font>" + "</div>"
                + "</div></div>";
        oParent.insertAdjacentHTML("beforeEnd", sDivHTML);
        oWait = document.getElementById(WAIT_ELEMENT_ID)
    }
    oWait.style.pixelLeft = (window.document.body.clientWidth - oWait.style.pixelWidth) / 2;
    oWait.style.pixelTop = (window.document.body.clientHeight - oWait.style.pixelHeight) / 2;
    oWait.style.display = "block";
}

function hideWaitITSM() {
    var oWait;
    if (WAIT_ELEMENT_ID != null
            && (oWait = document.getElementById(WAIT_ELEMENT_ID)) != null) {
        oWait.style.display = "none";
    }
}

/************
 * 工作导航
 *************/
function WorkLink(){
    var staffId = getCurrentStaffId();
    var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
    xmlRequest.onreadystatechange=function(){
        if(xmlRequest.readyState==4){
            loadWorkLink(xmlRequest)
        }
    }
    xmlRequest.Open("POST","servlet/MainPageAction?action=1&staffId="+staffId,true);
    xmlRequest.send();  
}


function loadWorkLink(xmlRequest){
    var pri_id_list="";
    var workLinkDivHTML = "";
    if(isSuccess(xmlRequest))
    {
        var LinkIds = xmlRequest.responseXML.selectNodes("/root/rowSet");
        if(LinkIds.length <=0){
                return document.getElementById("workLink").innerHTML = "";  
                //return document.getElementById("workLinkDiv").innerHTML = '<div style="margin-top:30px;"><b>您好！您目前无工作导航！</b></div>';
        }else{
            workLinkDivHTML = '';
            for(var i=0;i<LinkIds.length;i++)
            {
                linkVal = getNodeValue(LinkIds[i],'LINK_VALUE');
                linkImg = getNodeValue(LinkIds[i],'LINK_IMG');
                linkTitle = getNodeValue(LinkIds[i],'LINK_TITLE');
                
                workLinkDivHTML += '<span id="leftItem"'+ i + '>' +
                                                 '         <a  class="ni_RWD"  style="background-image:url('+linkImg+');" href="'+linkVal+'"> ' +
                                                 '                 <br style="line-height:55px;"/> ' + linkTitle +
                                                 '         </a></span>';
            }
        }
        document.getElementById("workLinkDiv").innerHTML = workLinkDivHTML;
    }
}

//功能地图
function showSysMap(){
    window.showModalDialog("../../workshop/itsmBJ/map_BJ_ITSM.jsp",null,"dialogWidth=500px;dialogHeight=566px;help=0;scroll=1;status=0;");
}

//员工信息编辑
function editStaff()
{
    window.showModalDialog("workshop/user/individualInfo.jsp?tag=1",null,"dialogWidth=500px;dialogHeight=560px;help=0;scroll=0;status=0;");
}

var flag = '';
function getAlarmList(alarmClass)
{
	if(flag!=''){
		clearTimeout(flag);
	}
    var limitCount=6;
    var iRefreshTime=30*1000;
    var url = "servlet/alarmMergeServlet?tag=29&limitCount="+limitCount;
    if(alarmClass!=null&&alarmClass!=''&&alarmClass!=undefined){
    	url+="&alarmClass="+alarmClass;
    }
    oAlarmXMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
    oAlarmXMLHttp.onreadystatechange=doAlarmStateReady;
	oAlarmXMLHttp.open("POST", url,true);
	oAlarmXMLHttp.send();
	flag = window.setTimeout("getAlarmList("+alarmClass+")",iRefreshTime);
	//popCategory.style.display = 'none';
}

function doAlarmStateReady()
{
	var state = oAlarmXMLHttp.readyState;	
	if(oAlarmXMLHttp!=null &&state==4)
	{
		if(isSuccess(oAlarmXMLHttp))
		{
			var oXMLDoc=oAlarmXMLHttp.responseXML;
			showAlarmList(oXMLDoc);
		}
		oAlarmXMLHttp=null;
    }
}
function showAlarmList(oXMLDoc)
{
   var oRowSets=oXMLDoc.selectNodes("/root/rowSet");
   var iLen=oRowSets.length;
   var aHTML=new Array();
   aHTML[0]=' <table width="100%" border="0" cellpadding="0" cellspacing="0">'
   for(var i=0;i<iLen-3;i++)
   {   
       var oRowSet=oRowSets[i];
       var iAlarmId=oRowSet.selectSingleNode("NE_ALARM_LIST_ID").text;
       var sAlarmTitle=oRowSet.selectSingleNode("ALARM_TITLE").text;
       var iAlarmLevel=oRowSet.selectSingleNode("ALARM_LEVEL").text;
       var sCreatTime=oRowSet.selectSingleNode("CREATE_TIME").text;
       aHTML[i+1]='<tr class="alarmOut" onmouseover="this.className=\'alarmOver\'" onmouseout="this.className=\'alarmOut\'">'
                 + '<td align="right" width="7">'
                 +  '<img src="resource/image/indexAh/index/lable.gif" width="6" height="12" />'
                 +  '</td>'
                 + '<td align="left" width="10px">&nbsp;</td>'
                 +   '<td noWrap align="left" height="25" >'
                 +   '<a class="alarmDiv" onclick="showAlarmById('+iAlarmId
                 +   ')">'
                 +   sAlarmTitle+'</a></td><td width="20px">'
                 +   '<img src="resource/image/s_'+getAlarmColor(iAlarmLevel)+'.gif" />'
                 +   '</td>'
                 //+  '<td noWrap align="right" class="td_hidden">'+sCreatTime+'</td>'
                 +'</tr>';
   }
   aHTML[i+1]="</table>";
   oAlarmList.innerHTML=aHTML.join("");
}       							       
function getAlarmColor(sAlarmType)
{
   var str;
   switch (sAlarmType)
   {
       case "1" :
           str="red";
           break;
       case "2" :
           str='orange';
           break;
       case "3" :
           str='yellow';
           break;
       case "4" :
           str='green';
           break;
       default:
           str='green';
   } 
   return str;
}
function showAlarmById(iAlarmId)
{
    //判断是否稽核系统产生的告警
	var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
    var row = null;
	sendRequest.open("post", "servlet/alarmMergeServlet?tag=46&alarmId="+iAlarmId, false);
	sendRequest.send();
	if (isSuccess(sendRequest)){
		row = sendRequest.responseXML.selectSingleNode("/root/rowSet");
	}
	if(row){
		var sendParams = ['username='+userName,'key='+ encodeKey];
		sendParams.push("dasys_sn="+row.selectSingleNode('DASYS_SN').text);
		sendParams.push("daitem_sn="+row.selectSingleNode('DAITEM_SN').text);
		sendParams.push("dadiff_sn="+row.selectSingleNode('DADIFF_SN').text);
		sendParams.push("node_id="+row.selectSingleNode('NODE_ID').text);
		sendParams.push("data_batch="+row.selectSingleNode('DATA_BATCH').text);
		displayMaxWindowWithHandle(getSendUrl($getSysVar("AUDIT_ALARM_INFO_URL")+'?',sendParams));		
	}else {
		displayMaxWindow('workshop/alarmManage/viewAlarmInfo.htm?alarmId='+iAlarmId,iAlarmId,false);
	}
}
function displayMaxWindowWithHandle(url, name, isCheckPrivilege)
{
    //if(isCheckPrivilege && !checkPrivilege()) return;
    
    var width = screen.availWidth-10;
    var height = screen.availHeight-30;
    var top = 0;
    var left = 0;
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
    return window.open(url, name, sFeatures.join(","));
}

function openNormalWindow(url, name, isCheckPrivilege) {
    //if(isCheckPrivilege && !checkPrivilege()) return;
    
    var sFeatures = new Array();
    sFeatures.push("width="+780);
    sFeatures.push("height="+580);
    sFeatures.push("location="+0);
    sFeatures.push("menubar="+0);
    sFeatures.push("resizable="+1);
    sFeatures.push("scrollbars="+1);
    sFeatures.push("status="+0);
    sFeatures.push("titlebar="+0);
    sFeatures.push("toolbar="+0);
    window.open(url, name, sFeatures.join(","));
}
function displayMaxWindow(url, name, isCheckPrivilege)
{
    displayMaxWindowWithHandle(url, name, isCheckPrivilege);
}

function loadCustomTabTitle()
{
	var title = $getSysVar('CRM_INDEX_ATTENTION_TITLE');
	if(title)
	{
		document.getElementById("customTabTitle").innerText = title;
	}
	else
	{
		document.getElementById("customTabTitle").innerText = "考核关注";
	}
}

function loadCustomAttention()
{
	var customResult = ResultFactory.newResult("CRM_INDEX_CUSTOM_ATTENTION");
	if(customResult)
	{
		customResult.async = false;
		customResult.onLoad = function(oXml)
		{
			var oRows = oXml.selectNodes("/root/rowSet");
			var dataHTML = "";
			for(var i = 0; i < oRows.length; i++)
			{
				dataHTML += "<div onMouseOver=\"this.style.backgroundColor='#c5e7f3'\" onMouseOut=\"this.style.backgroundColor=''\" class='customInfoItem'>" + oRows[i].firstChild.text + "</div>"
			}
			document.getElementById("customInfoAttentionDiv").innerHTML = dataHTML;
		}
		customResult.send(Result.FORCE_GET);
	}
}