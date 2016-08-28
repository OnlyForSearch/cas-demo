/*
    新版首页模板功能  Laixh 2011-03
    //加载头部日期时间信息：setDateTimeInfo();
    //加载菜单：loadMenu();
    //即时通信消息未阅读提示：setWebIMMsgInfo();
    //加载个性菜单：loadShortCutMenu(); 
    //内部公告(信息发布)：loadBillInfos();
    //待办：setMsgInfo();
    //维护作业：setJobs();
    //知识库：setKbase()
*/

var menuDoc = new ActiveXObject("Microsoft.XMLDOM");

//added by panchh for login itnm
var reloc_id = [];
var reloc_url =[];
var userName = getCurrentUserInfo("user_name");
var pswd = getCurrentUserInfo("pswd");

function getPrivilegeLocXML()
{
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    var submitURL = "../../servlet/menu?id=-1&action=9";
    xmlhttp.Open("GET",submitURL,false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
       return xmlhttp.responseXML;
    }
}
function loadReLocMenuInfo(){
    var xmlDoc=getPrivilegeLocXML();
        var oRows=xmlDoc.selectNodes("//rowSet");
        if (oRows != null){
            var iLen=oRows.length;
            for(var i=0;i<iLen;i++)
            {
                var oRow=oRows[i];
                var sClassCode=oRow.getAttribute("id");
                var sClassText=oRow.selectSingleNode("TO_URL").text
                if(sClassCode!="" && sClassCode!="")
                {
                    reloc_id[i]=sClassCode;
                    reloc_url[i]=sClassText;
                }
            }
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
        var privilegeId= sMenuItemList[i].getAttribute("PRIVILEGE_ID");
        var privilegeName= sMenuItemList[i].getAttribute("PRIVILEGE_NAME");
        var serverUrlName= sMenuItemList[i].getAttribute("SERVER_URL_NAME");
        var scriptName= sMenuItemList[i].getAttribute("SCRIPT_NAME");
        var ulMenuItemList = sMenuItemList[i].childNodes;
        var openUrl="";
        
        if(serverUrlName!=undefined && serverUrlName!=""){
            if(scriptName=="doMenu_open()"){
                openUrl = " onClick='doMenu_open(\""+serverUrlName+"\")'";
            }else{
                openUrl = " onClick='niOpenWind(\""+serverUrlName+"\",false)'";
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
        var privilegeId= ulMenuItemList[i].getAttribute("PRIVILEGE_ID");
        var privilegeName= ulMenuItemList[i].getAttribute("PRIVILEGE_NAME");
        var serverUrlName= ulMenuItemList[i].getAttribute("SERVER_URL_NAME");
        var scriptName= ulMenuItemList[i].getAttribute("SCRIPT_NAME");
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
                openUrl = " onClick='niOpenWind(\""+serverUrlName+"\",false)'";
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
        var menuli = menuul[0].getElementsByTagName("li");
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

//打开页面
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
    
    location.replace("index_ITSMFrame.jsp?mainUrl="+encodeURIComponent(url));
}

/**Old Version
// 知识库
function setKbase(){
    var htmls = ''
    var template = 
            "<div style=\"width:220px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; margin-bottom:5px;\">\n" +
            "  <img src=\"resource/image/indexITSM/$TIMG\" align=\"texttop\" style=\"margin:2px 8px 0 5px;\"/>\n" + 
            "  $TITLE &nbsp;&nbsp; |&nbsp; $STAFF<br>\n" + 
            "<font style=\"margin-left:30px;color:#666666; font-family:Arial, Helvetica, sans-serif;\">$DATE&nbsp;&nbsp;|&nbsp;&nbsp;</font><a target=_blank href=\"$LINK\" class=\"ni_moreLink\" style=\"text-decoration:underline;\">详细信息</a>\n" + 
            "</div>";
    var datas = queryKnowledges()
    var inHTMLStr="";
    if(datas.length > 0){
        var m=1;
        inHTMLStr += '<table class="mssTable" width="100%" height="25px" align="center" border="0" cellspacing="0" cellpadding="0">';
        for(var i=0; i<datas.length&&i<8; i++){
            var k = datas[i]
            var trColor="#FBFCFE";
            if(i%2==0){
                trColor="#FBFCFE";
            }else{
                trColor="#F5F9FC";
            }
            inHTMLStr += '<tr style="background-color:'+trColor+';">';
            inHTMLStr += '  <td align="center" width="30px"><img src="resource/image/indexITSM/ni_number_'+m+'.gif" align="absmiddle"/></td>';
            inHTMLStr += '  <td align="left" style="padding:0;"><div style="width:200px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;"><a target="_blank" href="'+k.LINK+'" class="ni_moreLink">'+k.SUBJECT+'</a></div></td>';
            inHTMLStr += '  <td align="left" width="102px">'+k.STATE_DATE+'</td>';
            inHTMLStr += '</tr>';
            m++;
        }
        inHTMLStr += '</table>';
    }else{
        inHTMLStr =  '<div style="width:220px;text-align:left;font-weight:bold;">知识库暂无内容</div>'
    }
    $('#kbasediv').html(inHTMLStr)
}
**/

/**
 * 获取首页最新知识 加权限 用权限树控制
 * zhangye 2015-3-17 15:03:02
 */
function setKbase(){
	 var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("GET", "/servlet/KnowledgeManagerNew?tag=2&topNum=4", false);
    xmlhttp.send();
    
    var htmls = ''
    var template = 
            "<div style=\"width:315px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; margin-bottom:12px;\">\n" +
            "  <img src=\"resource/image/indexITSM/$TIMG\" align=\"texttop\" style=\"margin:1px 8px 0 5px;\"/>\n" + 
            "  $TITLE<br>\n" + 
            "<font style=\"margin-left:30px;color:#666666; font-family:Arial, Helvetica, sans-serif;\">$STAFF&nbsp;&nbsp;|&nbsp;&nbsp;$DATE&nbsp;&nbsp;|&nbsp;&nbsp;</font><a target=_blank href=\"$LINK\" class=\"ni_moreLink\" style=\"text-decoration:underline;\">详细信息</a>\n" + 
            " </div>";
    if (isSuccess(xmlhttp)){       
        var oRows = xmlhttp.responseXML.selectNodes("/root/rowSet");
       
        var m=1;
        for(var i=0;i<oRows.length;i++){
        	var staff_name = oRows[i].selectSingleNode("STAFF_NAME").text;
        	var kId = oRows[i].selectSingleNode("KNOWLEDGE_ID").text;
        	var subject = oRows[i].selectSingleNode("SUBJECT").text;
        	var state_date = oRows[i].selectSingleNode("STATE_DATE").text;
        	var link = '/workshop/knowledge/knowledgeRead1.jsp?kId='+kId+'&state=4SA&configName=KNOWLEDGES&IS_PRI_UPDATE=true&IS_PRI_DELETE=true&IS_PRI_AUDIT=true&IS_PRI_STORAGE=true';

        	var html = template.replace(/\$STAFF/g, staff_name);
            html = html.replace(/\$TITLE/g, subject);
            html = html.replace(/\$DATE/g, state_date);
            html = html.replace(/\$LINK/g, link);
            html = html.replace(/\$TIMG/g, "ni_number_"+m+".gif");
            html = html.replace(/\=true/g, "=false");  //禁止编辑
            htmls += html;
            m++;
        }
        
        if(oRows.length<=0){
        	htmls =  '<div style="width:225px;text-align:left;font-weight:bold;">知识库暂无内容</div>';
        }
    }
    
     $('#kbasediv').html(htmls);
}

var cur_StaffId = getCurrentStaffId();//取得当前用户ID
//维护作业：
/*function setJobs() {
    var jobHtml="";
    
    var jobs = queryJobs();
    //linjl 2011-6-13 临时作业
    var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlHttp.Open("POST","/servlet/tempJobServlet?action=5",false);
    var sendXML = '<?xml version="1.0" encoding="gbk"?>'
           + '<root>'
           + '<search pagesize="15" page="1"/>'
           + '<query_type>2</query_type>'
           + '<QRY_TYPE>init</QRY_TYPE>'
           + '<QRY_STATE>0SA</QRY_STATE>'
           + '<QRY_EXEC_STAFF>'+getCurrentStaffId()+'</QRY_EXEC_STAFF>'
           + '</root>';
    xmlHttp.send(sendXML);
    var dom = xmlHttp.responseXML;
    jobHtml += '<div style="width:225px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">';
    jobHtml += '<div style="width:225px;text-align:left;"><font style="font-weight:bold;">临时作业：</font>'
    jobHtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/tempJobList.jsp\',true)" class="ni_moreLink">今日待办:<font style="color:red">'+dom.selectSingleNode("/root/recordCount").text+'</font></a>&nbsp;&nbsp;'
    sendXML = '<?xml version="1.0" encoding="gbk"?>'
           + '<root>'
           + '<search pagesize="15" page="1"/>'
           + '<query_type>3</query_type>'
           + '<query_param><exec_staff>'+getCurrentStaffId()
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
            //jobHtml += '<a onClick="javascript:openJob(\'' + job.BID + '\',\''+ job.ITEM_NAME + '\')" href="#">'+job.ITEM_NAME+'</a>';
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
    var jobs = queryJobs();
    //linjl 2011-6-13 临时作业
    var xmlHttp1 = new ActiveXObject("Microsoft.XMLHTTP");
    xmlHttp1.onreadystatechange=function(){
        if(xmlHttp1.readyState==4){
            if(isSuccess(xmlHttp1)){
                var dom1 = xmlHttp1.responseXML;
                LShtml += '<div style="width:225px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">';
                LShtml += '<div style="width:225px;text-align:left;"><font style="font-weight:bold;">临时作业：</font>'
                LShtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/tempJobList.jsp\',true)" class="ni_moreLink">今日待办:<font style="color:red">'+dom1.selectSingleNode("/root/recordCount").text+'</font></a>&nbsp;&nbsp;'
                LSdiv.innerHTML = LShtml;
            }
        }
    }
    xmlHttp1.Open("POST","/servlet/tempJobServlet?action=5",true);
    var sendXML1 = '<?xml version="1.0" encoding="gbk"?>'
           + '<root>'
           + '<search pagesize="15" page="1"/>'
           + '<query_type>2</query_type>'
           + '<QRY_TYPE>init</QRY_TYPE>'
           + '<QRY_STATE>0SA</QRY_STATE>'
           + '<QRY_EXEC_STAFF>'+getCurrentStaffId()+'</QRY_EXEC_STAFF>'
           + '</root>';
    xmlHttp1.send(sendXML1);
   
    var xmlHttp2 = new ActiveXObject("Microsoft.XMLHTTP");
    sendXML2 = '<?xml version="1.0" encoding="gbk"?>'
           + '<root>'
           + '<search pagesize="15" page="1"/>'
           + '<query_type>3</query_type>'
           + '<query_param><exec_staff>'+getCurrentStaffId()
           + '</exec_staff></query_param>'
           + '</root>';
    
    xmlHttp2.onreadystatechange=function(){
        if(xmlHttp2.readyState==4){
            if(isSuccess(xmlHttp2)){
                var dom2 = xmlHttp2.responseXML;
                 //防止异步加载时 以下部分比上面部分先执行完 渲染到界面而导致界面排版错乱
                setTimeout(function(){
		    		LShtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/tempJobApproveList.jsp\',true)" class="ni_moreLink">待审核:<font style="color:red">'+dom1.selectSingleNode("/root/recordCount").text+'</font></a>'
                	LShtml += '</div>'
                	LShtml += '</div>';
                	LSdiv.innerHTML = LShtml;
				},500);
            }
        }
    }
    xmlHttp2.Open("POST","/servlet/tempJobServlet?action=5",true);
    xmlHttp2.send(sendXML2);
    
    //end临时作业
    
    //维护作业审批
    var xmlHttp3 = new ActiveXObject("Microsoft.XMLHTTP");
    sendXML3 = '<?xml version="1.0" encoding="gbk"?>'
           + '<root>'
           + '<search pagesize="15" page="1"/>'
           + '<query_type>1</query_type>'//维护作业审批
           + '<QRY_TYPE>init</QRY_TYPE>'
           + '<QRY_STATE>0SA</QRY_STATE>'
           + '<QRY_EXEC_STAFF>'+cur_StaffId+'</QRY_EXEC_STAFF>'
           + '</root>';
    xmlHttp3.onreadystatechange=function(){
        if(xmlHttp3.readyState==4){
            if(isSuccess(xmlHttp3)){
                var dom3 = xmlHttp3.responseXML;
                WHhtml += '<div style="width:225px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">';
                WHhtml += '<div style="width:225px;text-align:left;"><font style="font-weight:bold;">维护作业：</font>'
                WHhtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/jobApproveList.jsp\',true)" class="ni_moreLink">待审批:<font style="color:red">'+dom3.selectSingleNode("/root/recordCount").text+'</font></a>'
                WHhtml += '</div>'
                WHhtml += '</div>';
                WHdiv.innerHTML = WHhtml;
            }
        }
    }
    xmlHttp3.Open("POST","/servlet/tempJobServlet?action=5",true);
    xmlHttp3.send(sendXML3);
    
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
    }else if(flowNum=="jtitsm_11923"){ //申告管理流程
        hasPrivilege = getHasPrivilege("308011033");    //新建申告单
    }else if(flowNum=="taskListFromGroup"){ //集团任务派发查询
        hasPrivilege = getHasPrivilege("308011041");//集团任务派发查询
    }else if(flowNum=="jtitsm_13052"){
        hasPrivilege = true //新建北方九省需求单
    }else if(flowNum=="jtitsm_13089"){
        hasPrivilege = true //新建海外需求单
    }else if(flowNum=="jtitsm_3176"){
        hasPrivilege = true //新建变更单
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
            alert("无此FLOW_MOD!请技术人员确认配置！FLOW_NUM:"+flowNum);
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

//单点登录北方9省新建北方9省事件单和北方9省需求单
function doMenuOpenByTag(type) {
    var url='';
    var userName=getCurrentUserName();
    var regionId=getCurrentUserInfo("region_id");
    var sql="select PKP_CUST_JTITSM_REQ_NORTH9.getSingleLoginUrl('"+type+"','"+regionId+"','"+userName+"') URL from dual";
    var data=queryAllData(sql);
    if(data==null||data[0]==null||data[0].URL==''){
        alert('对不起，该省还未配置新建流程单地址，请与系统维护人员联系！');
    }else{
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
        url=data[0].URL;
        if(regionId == 531){//山东需要通过httpheader传参
    		var page ="/workshop/form/jtitsmFormFile/proMssOutLogin.jsp";
    		window.open(page,'_blank',sFeatures.join(","));
	    }else{
	        window.open(url,'_blank',sFeatures.join(","));
	    }
    }
}

//即时通信消息未阅读提示:
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
    xmlhttp.open("post","/servlet/UnReadAction?action=5",true);//atcion=4
    xmlhttp.send("");
}
function setWebIMMsgInfoSet(xmlhttp) {
    if(isSuccess(xmlhttp)){ 
        var ALL_countNum ="";
        var FLOW_DISPOSE_countNum ="";
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

//加载收藏夹菜单:
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
                for(i=0; i<menuList.length&&i<12; i++){     //
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

//打开收藏夹菜单：
function shortCutdoReplaceURL(mainLoadUrl){
    window.top.document.all("rightFrame").src = mainLoadUrl;
}
function doMenu_open(url,width,height,winId) {
    width = (typeof(width)=="undefined")?screen.availWidth:width;
    height = (typeof(height)=="undefined")?screen.availHeight:height;
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
    if(!winId)
    {
        winId = '_blank';
    }
    window.open(url,winId,sFeatures.join(","));
}


//待办：
//定时刷新待办
function refreshMsgInfo(){
     window.setInterval("setMsgInfo()",waiteTime);
}

var gEType;
function setMsgInfo(){
    document.getElementById('eventPageIfr').src = 'eventPageListMSS_itsm.html'; //待办明细
   // loadFlowMsgInfoStart(); //初始加载：待办明细
    msgCountDiv.innerHTML = '<img src="resource/image/indexITSM/loading3.gif" style="margin:100px 0 0 0px;">';
    var staffId = getCurrentStaffId();
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange=function(){renderTODOList(xmlhttp)}
    xmlhttp.open("post","servlet/EventPageSimple?tag=3",true);///servlet/Flows_Count?staff_id="+staffId
    xmlhttp.send(null);
}
function renderTODOList(xmlhttp){//待办汇总
    var state = xmlhttp.readyState;
    if(state!=4)return
    var outHTML = "";
        //var staffName = getCurrentUserName();
        var rowSetList = xmlhttp.responseXML.selectNodes("/root/rowSet");
        if(rowSetList.length != 0) {
            outHTML += '<table class="ni_msgInfoTable" align="center" border="0" cellspacing="0" cellpadding="0" style="margin:4px 0px;">';
            for(var i=0;i<rowSetList.length;i++){
                var flowMod = rowSetList[i].selectSingleNode("flow_mod").text;
//                if(flowMod=="133739" || flowMod=="133759"){
//                    //过虑掉"人工打分（非自动）审批流程133759"、"考核指标修改审批流程133739"流程
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
                    outHTML +=  '<span style="width:95px;text-align:left;font-weight:bold;cursor:hand;" onClick="changeTab(1,'+ rowSetList[i].selectSingleNode("queryResultId").text+','+rowSetList[i].selectSingleNode("flow_mod").text+')" onMouseOver="this.style.color=\'#FF0000\'; this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\'; this.style.textDecoration=\'none\';" title="点击查看">';
                    outHTML +=  '待办理:';
                    outHTML +=  '<font style="color:#FF0000;font-weight:normal;">'+ rowSetList[i].selectSingleNode("type12_num").text +'</font>';
                    outHTML +=  '</span>';
                }
                
                if ( rowSetList[i].selectSingleNode("type100_num").text >0){
                    outHTML +=  '<span style="width:95px;text-align:left;font-weight:normal;cursor:hand;" onClick="changeTab(3,'+ rowSetList[i].selectSingleNode("queryResultId").text+','+rowSetList[i].selectSingleNode("flow_mod").text+')" onMouseOver="this.style.color=\'#FF0000\'; this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\'; this.style.textDecoration=\'none\';" title="点击查看">';
                    outHTML +=  '已办理:';
                    outHTML +=  '<font style="color:#FF0000;font-weight:normal;">'+ rowSetList[i].selectSingleNode("type100_num").text +'</font>';
                    outHTML +=  '</span>';
                }
                
                if ( rowSetList[i].selectSingleNode("type3_num").text >0){
                    outHTML +=  '<span style="width:95px;text-align:left;font-weight:normal;cursor:hand;" onClick="changeTab(2,'+ rowSetList[i].selectSingleNode("queryResultId").text+','+rowSetList[i].selectSingleNode("flow_mod").text+')" onMouseOver="this.style.color=\'#FF0000\'; this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\'; this.style.textDecoration=\'none\';" title="点击查看">';
                    outHTML +=  '发起:';
                    outHTML +=  '<font style="color:#FF0000;font-weight:normal;">'+ rowSetList[i].selectSingleNode("type3_num").text +'</font>';
                    outHTML +=  '</span>';
                }
                outHTML +=  '   </td>';
                outHTML +=  '</tr>';
            }
            outHTML += '</table>';
        }else {
            outHTML += '<div style="line-heigth:35px; color:#0066CD; padding:0 0 6px 5px;">您好！您目前无待办工作！</div>';
        }
    xmlhttp = null;
    msgCountDiv.innerHTML = outHTML;
}

function changeTab(type,queryResultId,flow_mod){
    //id:是monitor_menu表的monitor_id
    //tab顺序:1待办理 2:发起 3:已处理 4:全部
    var url ="workshop/queryTemplate/main.html?id="+queryResultId+"&tab="+type+"&flow_mod="+flow_mod+"&menutree=0";
    niOpenWind(url,true);
}

//加载内部公告(信息发布):
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
        var dXML = billXmlhttp.responseXML;//new ActiveXObject("Microsoft.XMLDOM");dXML.load(billXmlhttp.responseXML);
        billXmlhttp = null;
        var billOutput = '';
        var firstBillOutput = '';
        var hasPrivilege = dXML.selectSingleNode("/root/HAS_PRIVILEGE").text;
        var inHTMLStr = "";
        if(hasPrivilege=="true"){
            var oRows=dXML.selectNodes("/root/BILL_INFOS/rowSet");
            var iLen=oRows.length;
            var isSpecial;
            var isGreat;
            var msgIsRead="";
            inHTMLStr += '<table class="mssTable" width="100%" height="25px" align="center" border="0" cellspacing="0" cellpadding="0">';
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
                    var trColor="#FBFCFE";
                    if(i%2==0){
                        trColor="#FBFCFE";
                    }else{
                        trColor="#F5F9FC";
                    }
                    inHTMLStr += '<tr style="background-color:'+trColor+';">';
                    
                    inHTMLStr += '  <td align="center">'+msgIsRead+'</td>';
                    inHTMLStr += '  <td align="left">';
                    
                    inHTMLStr += "<div title='"+ oRows[i].selectSingleNode("TITLE").text +"' style='width:265px;height:20px;line-height:20px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'>";
                    inHTMLStr += "<a onclick=\"showBillInfoWindow(3,'"+oRows[i].selectSingleNode('BILL_INFO_ID').text+"','"+oRows[i].selectSingleNode("CATEGORY_NAME").text+"')\" href='#' class='ni_moreLink'>"+oRows[i].selectSingleNode("TITLE").text+"</a>";
                    inHTMLStr += isGreat;
                    inHTMLStr += getNewImage(oRows[i].selectSingleNode("STATE").text, oRows[i].selectSingleNode("SUBMIT_DATE").text);
                    inHTMLStr += "</div>";
                    
                    inHTMLStr += '  </td>';
                    inHTMLStr += '  <td width="45" align="center">'+submitDate+'</td>';
                    inHTMLStr += '</tr>';
            }
            inHTMLStr += '</table>';
        }
        billInfos.innerHTML = inHTMLStr;
    }
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

//加载头部日期时间信息
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
    theday = year+"年" + [today.getMonth()+1]+"月" +today.getDate() + "日&nbsp;&nbsp;"+d[today.getDay()+1];
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
    timeString = theday+"<br>"+xfile+"&nbsp;<font style='font-size:26px;line-height:26px;'>"+hours+minutes+seconds+"</font>";
    document.getElementById('oCurDateTime').innerHTML = timeString;
    window.setTimeout("setDateTimeInfo();", 1000);
}

//搜索:
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
    var urlPath ="/workshop/knowledge/knowledgeCenterNew.jsp?queryString="+queryStr+"&catalogId=&regionName=&orgId=&searchRange=1";
    window.open('index_ITSMFrame.jsp?mainUrl='+encodeURIComponent(urlPath));
    //niOpenWind(urlPath,false);
}

//注销：
function logout(){
  //if (confirm('你确定要注销系统？')){
    document.frmLogin.submit();
}


// 加载统计图表frame zhengqch
/**
var charts = [];  
var tabName = [];  
$(function(){
    return;
    if(!getHomePage()){
        getHomePrivileges();
    }
    if(charts.length >0){
       buildTab();
       switchChart(0);
       document.getElementById("rightChartDiv").style.display = "block";       
    }else{
       document.getElementById("rightChartDiv").style.display = "none";
    }
})**/
//获取员工首页报表的相关权限
/**
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
          case '10301' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=201&chart=905&height=180";
                         tabName[tabName.length] = "派发单各省完成情况";
                         break;
          case '10302' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=202&chart=907&height=180";
                         tabName[tabName.length] = "本部门派发单执行情况";
                         break;
          case '10303' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=203&chart=908&height=180";
                         tabName[tabName.length] = "各省申告请求统计";
                         break;    
          case '10304' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=204&chart=910&height=180";
                         tabName[tabName.length] = "集团申告处理统计";
                         break;   
          case '10305' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=209&chart=915&height=180";
                         tabName[tabName.length] = "部门派单完成率";
                         break;
          case '10306' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=210&chart=916&height=180";
                         tabName[tabName.length] = "部门派单完成及时率";
                         break;                                                    
       }                                         
       
   }
}**//**
//获取员工本人配置的首页展示报表
function getHomePage(){
   var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   xmlhttp.open("GET","/servlet/staff_manage?tag=95",false);
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
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=201&chart=905&height=180";
          tabName[tabName.length] = "派发单各省完成情况";
          continue;
       }
       if(pri_id == '10302' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=202&chart=907&height=180";
          tabName[tabName.length] = "本部门派发单执行情况";
          continue;
       }
       if(pri_id == '10303' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=203&chart=908&height=180";
          tabName[tabName.length] = "各省申告请求统计";
          continue;
       }
       if(pri_id == '10304' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=204&chart=910&height=180";
          tabName[tabName.length] = "集团申告处理统计";
          continue;
       }
       if(pri_id == '10305' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=209&chart=915&height=180";
          tabName[tabName.length] = "部门派单完成率"; 
          continue;
       }
       if(pri_id == '10306' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=210&chart=916&height=180";
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
}**/
//点击首页报表配置
/**
function confShowReport(){
    var dialogsFeatures = "dialogWidth=620px;dialogHeight=495px;help=0;scroll=yes;status=0";
    var obj = window.showModalDialog("/report_conf.html","", dialogsFeatures);
    if(obj == "ok"){
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
}**/

//打开论坛
function GetDiscuzUrl(){
 var pwd        = pswd;
 hrefValue = window.location.href;
 //linjl 2011-5-23
 alertUrls = queryAllData("select sys_var_value from sys_config where sys_var='DISCUZ_URL_MAP'")[0].SYS_VAR_VALUE;
 alertUrls = eval('('+alertUrls+')');
 for(var i=0;i<alertUrls.length;i++){
   for(var h in alertUrls[i]){
     if(String(hrefValue).indexOf(h)>=0){
        document.getElementById("lturl").href="http://"+alertUrls[i][h]+"/discuz/testLogin.php?username="+userName+"&password="+pwd;
        document.getElementById("lturl_more").href="http://"+alertUrls[i][h]+"/discuz/testLogin.php?username="+userName+"&password="+pwd;
        //document.getElementById("lturl_word_item").href="http://"+alertUrls[i][h]+"/discuz/testLogin.php?username="+userName+"&password="+pwd;
        return true;
     } 
   }
 }
 return false;
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

//初始化论坛消息列表
//add by wuqing , 2012/01/04
function getDiscuzPostsList(){
    var discuzUrl = "../../servlet/DiscuzServlet?tag=1&staffId="+getCurrentStaffId();
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    xmlhttp.onreadystatechange=function(){renderPostsList(xmlhttp)}
    xmlhttp.open("post",discuzUrl,true);
    xmlhttp.send("");   
}

function renderPostsList(xmlhttp){
    var state = xmlhttp.readyState;
    if(state!=4)return
    var innerHTML = "";
    var rowSetList = xmlhttp.responseXML.selectNodes("/root/rowSet");
    if(rowSetList.length != 0) {
        var m=1;
        innerHTML += '<table class="mssTable" width="100%" height="25px" align="center" border="0" cellspacing="0" cellpadding="0">';
        for(var i=0;i<rowSetList.length;i++){
            var pid = rowSetList[i].selectSingleNode("PID").text;       
            var fid = rowSetList[i].selectSingleNode("FID").text;       
            var tid = rowSetList[i].selectSingleNode("TID").text;   
            var author = rowSetList[i].selectSingleNode("AUTHOR").text;     
            var subject = rowSetList[i].selectSingleNode("SUBJECT").text;   
            var postTime = rowSetList[i].selectSingleNode("POST_TIME").text;    

            var trColor="#FBFCFE";
            if(i%2==0){
                trColor="#FBFCFE";
            }else{
                trColor="#F5F9FC";
            }
            
            innerHTML += '<tr style="background-color:'+trColor+';">';
            innerHTML += '  <td align="center"><img src="resource/image/indexITSM/ni_number_'+m+'.gif" style="margin-right:8px;" align="absmiddle"/></td>';
            innerHTML += '  <td align="left" style="padding:0;"><div style="width:200px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;"><a target="_blank" href="'+GetDiscuzUrlStr()+'/testLogin.php?username='+userName+'&userFrom=message&tid='+tid+'&amp;extra=page%3D1'+'" class="ni_moreLink">'+subject+'</a></div></td>';
            innerHTML += '  <td align="left" width="102px">'+postTime+'</td>';
            innerHTML += '</tr>';
            m++;
        }
        innerHTML += '</table>';
    }
    document.getElementById("postDiv").innerHTML = innerHTML;
}
/*
function loadLeftItem(){    //itnm00050655
    document.getElementById("leftItem1").style.display = "none";
    document.getElementById("leftItem2").style.display = "none";
    document.getElementById("leftItem3").style.display = "none";
    
    document.getElementById("leftItem4").style.display = "block";
    document.getElementById("leftItem5").style.display = "none";
    document.getElementById("leftItem6").style.display = "none";
    document.getElementById("leftItem7").style.display = "none";
    document.getElementById("leftItem8").style.display = "none";
    document.getElementById("leftItem9").style.display = "none";
    
    document.getElementById("leftItem10").style.display = "block";
    document.getElementById("leftItem11").style.display = "none";
    document.getElementById("leftItem12").style.display = "none";
    
    document.getElementById("leftItem13").style.display = "block";
    
    document.getElementById("leftItem14").style.display = "none";
    document.getElementById("leftItem16").style.display = "block";
    
    var hasPrivilege = getHasPrivilege("10501");    //判断是否有首页下的“服务台”菜单权限点
    if(hasPrivilege=="true"){
        document.getElementById("leftItem15").style.display = "block";
    }
}*/

//业务数据变更流程新增：
function createBosswgFlowByFlowMod(flowMod){
    var relocateUrl = 'workshop/form/index.html?flowMod=11083';
    var params = new Array();
    window.showModalDialog(relocateUrl,params,"resizable=yes;dialogWidth=100;dialogHeight=100;help=0;scroll=1;status=0;");
}

function setUserInfo(){
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState==4){
            setUserInfoSet(xmlhttp)
        }
    }
    xmlhttp.open("post", "../../servlet/billInfoServlet?tag=23&staffId="+staffId,true);
    xmlhttp.send("");
}
function setUserInfoSet(xmlhttp){
    if(isSuccess(xmlhttp)) {
        if (xmlhttp.responseXML.selectSingleNode("/root/Msg").text != "") {
            var dXML = new ActiveXObject("Microsoft.XMLDOM");
            dXML.load(xmlhttp.responseXML);
            var calledName = dXML.selectSingleNode("/root/Msg/CALLED_NAME").text;
            var staffName = dXML.selectSingleNode("/root/Msg/STAFF_NAME").text;
            name_TD.innerHTML = (calledName&&calledName!="null")?calledName:staffName;     //姓名
            orgName_TD.innerHTML = dXML.selectSingleNode("/root/Msg/ORG_NAME").text;        //所属部门
            if(dXML.selectSingleNode("/root/Msg/EMAIL").text !=""){
                Email_TD.innerHTML = dXML.selectSingleNode("/root/Msg/EMAIL").text + "<a href='mailto:"+dXML.selectSingleNode("/root/Msg/EMAIL").text+"'><font style='font-family:wingdings;font-size:14px;color:#6BA5D7;margin-left:2px;' title='发送邮件'>*</font></a>";      //email
            }
            tel_TD.innerHTML = dXML.selectSingleNode("/root/Msg/TEL").text;         //电话
        } else {
        }
    }
}

function whowMorUserInfo(){
    showStaffInfo(staffId);
}

/**
 * WebIM未读消息列表加载
 * @author: Laixh
 * @add: 2009-11-11
 * @修改 2010-08-27 linjx
 */
var imgPath = '../../resource/image/ico/';
var attachImg = 'attachment.gif';
var unreadImg = 'msg_unread.gif';
var unreadReplyImg = 'msg_unreadreplied.gif';
var readImg = 'msg_read.gif';
var readReplyImg = 'msg_replied.gif';
var replyImg = 'msg_forwarded.gif';
var newImg = 'newImg4.gif';
var trHeight = 22;
function loadWebIMList(){
    var showUnReadRowNum = 8;
    var param = new Array('action=12','id='+showUnReadRowNum);
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState==4){
            loadWebIMListSet(xmlhttp)
        }
    }
    xmlhttp.open("post","/servlet/msgAction?"+param.join("&"),true);
    xmlhttp.send("");
}

function loadWebIMListSet(xmlhttp) {
    if(isSuccess(xmlhttp)){
        var u = 0;
        var um = 0;
        var f = 0;
        var isExistUser;
        var isExistMorUser;
        var isExistFlow;
        var oMsgList = xmlhttp.responseXML.selectNodes("/root/rowSet");
        var msgId;
        var msgType;
        var msgTitle
        var msgTag;
        var isSelf
        var attachCount;
        var msgDate;
        var staffCount; //参与人个数
        var outHTMLUser =   '<div id="htmlUserDiv" style="width:100%;float:left;padding:0px 0 0px 0; overflow-X:hidden; OVERFLOW-Y:auto;">';
            outHTMLUser +=    '<table class="mssTable" width="98%" align="center" border="0" cellspacing="0" cellpadding="0">';

        if(oMsgList.length>0)
        {
            curTopUnreadMsgId = oMsgList[0].selectSingleNode('MESSAGE_ID').text;
            for(var i=0;i<oMsgList.length;i++) {
                msgTag = oMsgList[i].selectSingleNode('TAG').text;
                msgType = oMsgList[i].selectSingleNode('MESSAGE_TYPE').text;
                msgDate =  oMsgList[i].selectSingleNode('CREATED_DATE').text;
                msgId = oMsgList[i].selectSingleNode('MESSAGE_ID').text;
                msgTitle = oMsgList[i].selectSingleNode('TITLE').text;
                attachCount = oMsgList[i].selectSingleNode('ATTACH_COUNT').text;
                isSelf = oMsgList[i].selectSingleNode('IS_SELF').text;
                staffCount = oMsgList[i].selectSingleNode('STAFF_CONUT').text;
                if(msgType=="I"){
                    continue;   //不加载流程阅办消息
                }
              //数据总数不超过100  2010.08.26
                isExistUser = true;
                var title = '';
                var trColor="#FBFCFE";
                if(i%2==0){
                    trColor="#FBFCFE";
                }else{
                    trColor="#F5F9FC";
                }
                outHTMLUser += '<tr height="'+trHeight+'" style="background-color:'+trColor+';line-height:20px">';
                outHTMLUser +=  '<td width="10">';
                if(attachCount>0) {
                    outHTMLUser += '<img src="'+imgPath+attachImg+'" align="absmiddle">';
                }
                outHTMLUser +=  '</td>';
                outHTMLUser +=  '<td width="26">';
                if (msgTag == "A"){
                    outHTMLUser += '<img src="'+imgPath+unreadImg+'" align="absmiddle" title="未读消息">';
                }else if(msgTag == "F"){
                    outHTMLUser += '<img src="'+imgPath+unreadReplyImg+'" align="absmiddle" title="未读的回复消息">';  
                }
                outHTMLUser +=  '</td>';
                outHTMLUser +=  '<td height="'+trHeight+'">';
                outHTMLUser +=      '<div class="title fontImg" style="width:auto;float:left;" title="'+msgTitle+'" ';
                outHTMLUser +=      'id="'+msgId+'" type="'+msgType+'" attachCount="'+attachCount+'" tag="'+msgTag+'" isSelf="'+isSelf+'" ';
                outHTMLUser +=      'onmouseover="over()" onmouseout="out()" onclick="webIMMeeting()">';
                outHTMLUser +=      msgTitle;
                outHTMLUser +=      '&nbsp;<font style="color:#666666;text-align:left;font-size:12px;">'+ msgDate.substring(5,10) +'</font>';
                outHTMLUser +=      '</div>';
                outHTMLUser +=  '</td>';
                outHTMLUser +=  "</tr>";

            }
        }
        outHTMLUser += '</table></div>';    
        
        if (!isExistUser){
            outHTMLUser = "<span style='display:block; color:#748189; font-size:12px;line-height:20px; padding:10px 0 10px 25px;text-align:left;'>您目前没有未读信息。</span>";
        }      
        
        msgDivFirst.innerHTML = outHTMLUser;
                   
     }
}

function showMsgNew() {
    var msg_id = event.srcElement.id;
    var msg_type = event.srcElement.type;
    var msg_title = event.srcElement.innerText;//event.srcElement.title;
    var msg_attach_count = event.srcElement.attachCount;
    var msg_tag = event.srcElement.tag;
    var msg_isSelf = event.srcElement.isSelf;
    
    var params = new Array();
    params.push("isOnDuty=0");
    params.push("type="+msg_type);//((msg_type=="A")?"TYPE_OF_TALK_TO_MESSAGE":msg_type)
    params.push("id="+msg_id);
    params.push("title="+encodeURIComponent(msg_title));
    params.push("isSender="+msg_isSelf);
    
    webIMMeeting(msg_id, encodeURIComponent(msg_title), msg_tag);
    
    //window.open("/workshop/webIM/index.htm?"+params.join("&"),window.top.w,"");  
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



function over()
{
    event.srcElement.runtimeStyle.color = 'red';
    isMarquee = false;
}

function out()
{
    event.srcElement.runtimeStyle.color = '#167ABD';
    isMarquee = true;
}




//员工基本信息(查看)：
function showStaffInfo(id) {
    window.showModalDialog("../workshop/info/staff_info.htm?staffId="+id,window,"dialogWidth=440px;dialogHeight=420px;help=0;scroll=0;status=0;");
}

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





/**
 * 流程阅办未读消息 laixh 2011-11-29
 */
var waiteTime = 300000;
function loadUnReadWebIMList(){
    unRead();
    waiteTime = $getSysVar('JTITSM_UNREAD_WAITE_TIME');//刷新频率
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
                mHtmlDC +='<span style="display:inline;color:#0055E5;font-size:13px;line-height:20px;height:20px;cursor:hand;text-align:center;" ';
                mHtmlDC +='onMouseOver="this.style.textDecoration=\'underline\'" onMouseOut="this.style.textDecoration=\'\'" ';
                mHtmlDC +='onclick="doMenu_open(\'workshop/queryTemplate/ReadItsm.html?result=91000002&tab=1\');" title="点击查看">';
                mHtmlDC +="<img src='resource/image/indexITSM/advert.gif' align='absmiddle' style='margin-right:3px;'>您有<b style='color:#FF0000'>"+DBcountN+"</b>条流程阅办消息，请处理！";
                mHtmlDC +='</span>';
            newMsg_FLOW_DISPOSE.innerHTML = mHtmlDC;
            newMsg_FLOW_DISPOSE.style.display="block";
        }else{
            var mHtmlDC="";
                mHtmlDC +='<span style="display:inline;color:#6D8591;font-size:13px;line-height:20px;height:20px;cursor:hand;text-align:center;" ';
                mHtmlDC +='onMouseOver="this.style.textDecoration=\'underline\'" onMouseOut="this.style.textDecoration=\'\'" ';
                mHtmlDC +='onclick="doMenu_open(\'workshop/queryTemplate/ReadItsm.html?result=91000002&tab=2\');" title="点击查看">';
                mHtmlDC +="<img src='resource/image/indexITSM/qbxs.gif' align='absmiddle'>暂无新的流程阅办单。";
                mHtmlDC +='</span>';    
            newMsg_FLOW_DISPOSE.innerHTML = mHtmlDC;
            newMsg_FLOW_DISPOSE.style.display="block";
        }
    }
}


//加载“项目文档管理”列表 laixh
var startDragClientX;  // 开始点X
var startDragClientY;  // 开始点Y
var documentConfigName = "DOCUMENTS";
var selectedRowNum = 0;
function loadDocumentList(){
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    var documentUrl = "../../servlet/documentManagementServlet?";
    var submitURL = documentUrl+"tag=19";
    xmlhttp.Open("POST",submitURL,false);
    xmlhttp.send();
    var dXML = new ActiveXObject("Microsoft.XMLDOM");
    dXML.load(xmlhttp.responseXML);
    iniDocuments(dXML);
}

function iniDocuments(dXML){
    var oRows = dXML.selectNodes("/root/DOCUMENTS/rowSet");
    var iLen = oRows.length;
    var oItem = null;
    var rowObject;
    var cellObject;
    for(var i=0;i<iLen && i<7;i++)
    {//名称(文档Id、目录ID、路径)，大小，创建日期，创建人，(描述)。
        oItem = oRows[i];
        if(oItem.selectSingleNode("HAS_PRIVILEGE").text!="1") continue;
        
        rowObject = catalogContents.insertRow();
        rowObject.height="23";
        
        //名称:
        cellObject = rowObject.insertCell();//1
        cellObject.noWrap=true;
        cellObject.align="left";
        cellObject.innerHTML = '&nbsp;&nbsp;<img width="16" height="16" align="absmiddle" src="../../resource/image/ico/new.gif">'+
                               '<span id="document" onclick="downloadDocument()" style="width:315px;overflow:hidden;text-overflow:ellipsis;cursor:default;color:#2167AC;cursor:hand;" title="点击下载" onmouseover="onItemOver()" onmouseout="onItemOut()">'+
                                 oItem.selectSingleNode("DOCUMENT_NAME").text+
                                 '<input type="hidden" value="'+oItem.selectSingleNode("DOCUMENT_ID").text+'">'+
                                 '<input type="hidden" value="'+oItem.selectSingleNode("DOCUMENT_PATH").text+'">'+
                               '</span>';
    }
}

function downloadDocument()
{
    oSelectedItem = event.srcElement;
    var fileName = encodeURIComponent(oSelectedItem.firstChild.nodeValue);
    var pathName = encodeURIComponent(oSelectedItem.childNodes[2].value);
    var path = "../../servlet/downloadservlet?action=1&filename="+fileName+"&fullPath="+pathName;
    window.top.location.href=path;
}


function onItemOver()
{
    event.srcElement.runtimeStyle.textDecoration = 'underline';
}

//----------------------------------------------------------------
//-------------  5.2 鼠标滑出  --------------------------------------
//----------------------------------------------------------------
function onItemOut()
{
    event.srcElement.runtimeStyle.textDecoration = '';
}
function getSize(documentSize)
{
    var result = parseFloat(documentSize);
    var unit = "字节";
    if(result>1000)
    {
        result = result/1024;
        unit = "KB";
        if(result>1000){
            result = result/1024;
            unit = "MB";
            if(result>1000)
            {
                result = result/1024;
                unit = "GB";
            }
        }
        result = result.toFixed(2);
    }
    return result +" "+unit;
}

// 取得当前登陆用户名：
function getCurrentUserName() {
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    oXMLHTTP.open("get", "/servlet/util?OperType=6", false);
    oXMLHTTP.send("");
    if (isSuccess(oXMLHTTP)) {
        return oXMLHTTP.responseXML.selectSingleNode("/root/user_name").text;
    }
}

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

//加载阅办明细列表：
function loadFlowDisposeList(){
    var sendXML='<?xml version="1.0" encoding="gbk"?>'
    +  '<root>'
    +     '<pagesize>15</pagesize>'
    +  '</root>';
    
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    var submitURL = "/servlet/QueryAction?action=85";
    xmlhttp.Open("POST",submitURL,false);
    xmlhttp.send(sendXML);
    var dXML = new ActiveXObject("Microsoft.XMLDOM");
    dXML.load(xmlhttp.responseXML);
    iniFlowDisposeList(dXML);
}
function iniFlowDisposeList(dXML){
    //先清除所有行：
    var tb = document.getElementById('flowDisposeList');
    var rowNum=tb.rows.length;
    for (var r=0;r<rowNum;r++){
        tb.deleteRow(r);
        rowNum=rowNum-1;
        r--;
    }
     
    var oRows = dXML.selectNodes("/root/rowSet");
    var iLen = oRows.length;
    var oItem = null;
    var rowObject;
    var cellObject;
    for(var i=0;i<iLen && i<7;i++){
        oItem = oRows[i];
        var flow_name   = oItem.selectSingleNode("FLOW_NAME").text;
        var title       = oItem.selectSingleNode("TITLE").text;
        var tch_id      = oItem.selectSingleNode("MSG_TCH_ID").text;
        
        rowObject = flowDisposeList.insertRow();
        rowObject.height="23";
        
        //名称:
        cellObject = rowObject.insertCell();//1
        cellObject.noWrap=true;
        cellObject.align="left";
        cellObject.innerHTML = '&nbsp;<img width="16" height="16" align="absmiddle" src="../../resource/image/ico/new.gif">'+
           '<span id="document" onclick="dispose('+tch_id+')" style="width:315px;overflow:hidden;text-overflow:ellipsis;cursor:default;color:#2167AC;cursor:hand;" title="点击下载" onmouseover="this.style.color=\'#FF0000\';" onmouseout="this.style.color=\'\';">'+
           '<font style="color:#555555;">['+ flow_name +']</font> '+ title +
           '</span>';
    }
}

var disposeWind = null;
function dispose(tch_id){
    var width = (typeof(width)=="undefined")?screen.availWidth:width;
    var height = (typeof(height)=="undefined")?screen.availHeight:height;
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
    disposeWind = window.open('/workshop/form/index.jsp?tchId='+tch_id+'&fullscreen=yes&type=view',"_blank",sFeatures.join(","));
    refreshDisposeList();
}
function refreshDisposeList(){
    if(disposeWind && disposeWind.open && !disposeWind.closed){
        //窗口未关闭：
        window.setTimeout("refreshDisposeList()",1000);
    }else{
        //窗口已关闭：
        loadFlowDisposeList();  //刷新列表
        setWebIMMsgInfo();
        loadUnReadWebIMList();
        disposeWind = null;
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
                
				workLinkDivHTML += '<span title="'+linkTitle+'">';
				workLinkDivHTML += '<a class="ni_RWD" style="background-image:url('+linkImg+');" href="'+linkVal+'"><br style="line-height:58px;"/>'+linkTitle+'</a>';
				workLinkDivHTML += '</span>';
            }
        }
        document.getElementById("workLinkDiv").innerHTML = workLinkDivHTML;
    }
}


function showFlowMore(){
    var x=(window.screen.width-880)/2;
    var y=(window.screen.height-420)/2;
    window.open("eventPageMore_itsm.html","",'scrollbars=yes,width=880,height=420,top='+y+',left='+x+',resizable=yes');
}

