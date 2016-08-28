/*
    �°���ҳģ�幦��  Laixh 2011-03
    //����ͷ������ʱ����Ϣ��setDateTimeInfo();
    //���ز˵���loadMenu();
    //��ʱͨ����Ϣδ�Ķ���ʾ��setWebIMMsgInfo();
    //���ظ��Բ˵���loadShortCutMenu(); 
    //�ڲ�����(��Ϣ����)��loadBillInfos();
    //���죺setMsgInfo();
    //ά����ҵ��setJobs();
    //֪ʶ�⣺setKbase()
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

//���ز˵�
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

//��ҳ��
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
// ֪ʶ��
function setKbase(){
    var htmls = ''
    var template = 
            "<div style=\"width:220px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; margin-bottom:5px;\">\n" +
            "  <img src=\"resource/image/indexITSM/$TIMG\" align=\"texttop\" style=\"margin:2px 8px 0 5px;\"/>\n" + 
            "  $TITLE &nbsp;&nbsp; |&nbsp; $STAFF<br>\n" + 
            "<font style=\"margin-left:30px;color:#666666; font-family:Arial, Helvetica, sans-serif;\">$DATE&nbsp;&nbsp;|&nbsp;&nbsp;</font><a target=_blank href=\"$LINK\" class=\"ni_moreLink\" style=\"text-decoration:underline;\">��ϸ��Ϣ</a>\n" + 
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
        inHTMLStr =  '<div style="width:220px;text-align:left;font-weight:bold;">֪ʶ����������</div>'
    }
    $('#kbasediv').html(inHTMLStr)
}
**/

/**
 * ��ȡ��ҳ����֪ʶ ��Ȩ�� ��Ȩ��������
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
            "<font style=\"margin-left:30px;color:#666666; font-family:Arial, Helvetica, sans-serif;\">$STAFF&nbsp;&nbsp;|&nbsp;&nbsp;$DATE&nbsp;&nbsp;|&nbsp;&nbsp;</font><a target=_blank href=\"$LINK\" class=\"ni_moreLink\" style=\"text-decoration:underline;\">��ϸ��Ϣ</a>\n" + 
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
            html = html.replace(/\=true/g, "=false");  //��ֹ�༭
            htmls += html;
            m++;
        }
        
        if(oRows.length<=0){
        	htmls =  '<div style="width:225px;text-align:left;font-weight:bold;">֪ʶ����������</div>';
        }
    }
    
     $('#kbasediv').html(htmls);
}

var cur_StaffId = getCurrentStaffId();//ȡ�õ�ǰ�û�ID
//ά����ҵ��
/*function setJobs() {
    var jobHtml="";
    
    var jobs = queryJobs();
    //linjl 2011-6-13 ��ʱ��ҵ
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
    jobHtml += '<div style="width:225px;text-align:left;"><font style="font-weight:bold;">��ʱ��ҵ��</font>'
    jobHtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/tempJobList.jsp\',true)" class="ni_moreLink">���մ���:<font style="color:red">'+dom.selectSingleNode("/root/recordCount").text+'</font></a>&nbsp;&nbsp;'
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
    jobHtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/tempJobApproveList.jsp\',true)" class="ni_moreLink">�����:<font style="color:red">'+dom.selectSingleNode("/root/recordCount").text+'</font></a>'
    jobHtml += '</div>'
    jobHtml += '</div>';
    //end
    //ά����ҵ����
    jobHtml += '<div style="width:225px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">';
    jobHtml += '<div style="width:225px;text-align:left;"><font style="font-weight:bold;">ά����ҵ��</font>'
    sendXML = '<?xml version="1.0" encoding="gbk"?>'
           + '<root>'
           + '<search pagesize="15" page="1"/>'
           + '<query_type>1</query_type>'//ά����ҵ����
           + '<QRY_TYPE>init</QRY_TYPE>'
           + '<QRY_STATE>0SA</QRY_STATE>'
           + '<QRY_EXEC_STAFF>'+cur_StaffId+'</QRY_EXEC_STAFF>'
           + '</root>';
    xmlHttp.Open("POST","/servlet/tempJobServlet?action=5",false);
    xmlHttp.send(sendXML);
    dom = xmlHttp.responseXML;
    jobHtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/jobApproveList.jsp\',true)" class="ni_moreLink">������:<font style="color:red">'+dom.selectSingleNode("/root/recordCount").text+'</font></a>'
    jobHtml += '</div>'
    jobHtml += '</div>';
    //END ά����ҵ����   
    if(jobs.length>0){
        jobHtml += '<div style="width:225px;text-align:left;"><font style="font-weight:bold;">���������ҵ�ƻ��У�</font>'
            +'&nbsp;&nbsp;&nbsp;&nbsp;<a onclick="niOpenWind(\'workshop/maintjobplan/itemResultSearchList.jsp\',true)" href="#" class="ni_moreLink">����>></a></div>';
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
        jobHtml += '<div style="width:225px;text-align:left;font-weight:bold;">������������ҵ�ƻ���</div>';
    }
    jobsDiv.innerHTML = jobHtml;
}*/
//ά����ҵ���첽����
function setJobs() {
    var jobHtml="";
    var LShtml="";
    var WHhtml="";
    var JHhtml="";
    var jobs = queryJobs();
    //linjl 2011-6-13 ��ʱ��ҵ
    var xmlHttp1 = new ActiveXObject("Microsoft.XMLHTTP");
    xmlHttp1.onreadystatechange=function(){
        if(xmlHttp1.readyState==4){
            if(isSuccess(xmlHttp1)){
                var dom1 = xmlHttp1.responseXML;
                LShtml += '<div style="width:225px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">';
                LShtml += '<div style="width:225px;text-align:left;"><font style="font-weight:bold;">��ʱ��ҵ��</font>'
                LShtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/tempJobList.jsp\',true)" class="ni_moreLink">���մ���:<font style="color:red">'+dom1.selectSingleNode("/root/recordCount").text+'</font></a>&nbsp;&nbsp;'
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
                 //��ֹ�첽����ʱ ���²��ֱ����沿����ִ���� ��Ⱦ����������½����Ű����
                setTimeout(function(){
		    		LShtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/tempJobApproveList.jsp\',true)" class="ni_moreLink">�����:<font style="color:red">'+dom1.selectSingleNode("/root/recordCount").text+'</font></a>'
                	LShtml += '</div>'
                	LShtml += '</div>';
                	LSdiv.innerHTML = LShtml;
				},500);
            }
        }
    }
    xmlHttp2.Open("POST","/servlet/tempJobServlet?action=5",true);
    xmlHttp2.send(sendXML2);
    
    //end��ʱ��ҵ
    
    //ά����ҵ����
    var xmlHttp3 = new ActiveXObject("Microsoft.XMLHTTP");
    sendXML3 = '<?xml version="1.0" encoding="gbk"?>'
           + '<root>'
           + '<search pagesize="15" page="1"/>'
           + '<query_type>1</query_type>'//ά����ҵ����
           + '<QRY_TYPE>init</QRY_TYPE>'
           + '<QRY_STATE>0SA</QRY_STATE>'
           + '<QRY_EXEC_STAFF>'+cur_StaffId+'</QRY_EXEC_STAFF>'
           + '</root>';
    xmlHttp3.onreadystatechange=function(){
        if(xmlHttp3.readyState==4){
            if(isSuccess(xmlHttp3)){
                var dom3 = xmlHttp3.responseXML;
                WHhtml += '<div style="width:225px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">';
                WHhtml += '<div style="width:225px;text-align:left;"><font style="font-weight:bold;">ά����ҵ��</font>'
                WHhtml += '<a href="#" onclick="niOpenWind(\'workshop/maintjobplan/jobApproveList.jsp\',true)" class="ni_moreLink">������:<font style="color:red">'+dom3.selectSingleNode("/root/recordCount").text+'</font></a>'
                WHhtml += '</div>'
                WHhtml += '</div>';
                WHdiv.innerHTML = WHhtml;
            }
        }
    }
    xmlHttp3.Open("POST","/servlet/tempJobServlet?action=5",true);
    xmlHttp3.send(sendXML3);
    
    //END ά����ҵ����   
    
    if(jobs.length>0){
        JHhtml += '<div style="width:225px;text-align:left;"><font style="font-weight:bold;">���������ҵ�ƻ��У�</font>'
            +'&nbsp;&nbsp;&nbsp;&nbsp;<a onclick="niOpenWind(\'workshop/maintjobplan/itemResultSearchList.jsp\',true)" href="#" class="ni_moreLink">����>></a></div>';
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
        JHhtml += '<div style="width:225px;text-align:left;font-weight:bold;">������������ҵ�ƻ���</div>';
    }
    JHdiv.innerHTML = JHhtml;
}



/*���������½����� */
//function doMenuOpenByUrl(queryId,flowMod,type) {
function doMenuOpenByUrl(queryId,flowNum,type){
    //Ȩ���ж�
    var hasPrivilege = 'false';
    if(flowNum=="jtitsm_11092"){//�����ɷ�����
        if(type=="RWD"){
            hasPrivilege = getHasPrivilege("308011024");//�½�����
        }
        if(type=="ZXD"){
            hasPrivilege = getHasPrivilege("308011025");//�½���ѯ��
        }
        if(queryId=="32"){
            hasPrivilege = getHasPrivilege("308011063");//�½�������ϵ��
        }
    }else if(flowNum=="jtitsm_3158"){   //�¼���������
        hasPrivilege = getHasPrivilege("308030203");    //�½��¼���
    }else if(flowNum=="jtitsm_12072"){  //�����������
        hasPrivilege = getHasPrivilege("308080001");    //�½�����
    }else if(flowNum=="jtitsm_3175"){   //�����������
        hasPrivilege = getHasPrivilege("308050203");    //�½����ⵥ
    }else if(flowNum=="jtitsm_11923"){ //����������
        hasPrivilege = getHasPrivilege("308011033");    //�½���浥
    }else if(flowNum=="taskListFromGroup"){ //���������ɷ���ѯ
        hasPrivilege = getHasPrivilege("308011041");//���������ɷ���ѯ
    }else if(flowNum=="jtitsm_13052"){
        hasPrivilege = true //�½�������ʡ����
    }else if(flowNum=="jtitsm_13089"){
        hasPrivilege = true //�½���������
    }else if(flowNum=="jtitsm_3176"){
        hasPrivilege = true //�½������
    }
    
    if(hasPrivilege=="false"){
        alert("����Ȩ�޽��д˲�����");
        return;
    }
    
    var flowMod;
    //���ݹ̶�flow_num��ö�Ӧ��flow_mod
    if(flowNum != "taskListFromGroup"){
        var tmpData = queryAllData("select flow_mod from flow_model where flow_num='"+flowNum+"'");
        if(tmpData && tmpData.length>0){
            flowMod = tmpData[0].FLOW_MOD;
        }else {
            alert("�޴�FLOW_MOD!�뼼����Աȷ�����ã�FLOW_NUM:"+flowNum);
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
        if(queryId=="26"){//�����ɷ�����
            if(type=="ZXD"){//������ѯ��
                url+="&createType=ZXD&taskClass=1";
            }else{          //��������
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

//�����¼����9ʡ�½�����9ʡ�¼����ͱ���9ʡ����
function doMenuOpenByTag(type) {
    var url='';
    var userName=getCurrentUserName();
    var regionId=getCurrentUserInfo("region_id");
    var sql="select PKP_CUST_JTITSM_REQ_NORTH9.getSingleLoginUrl('"+type+"','"+regionId+"','"+userName+"') URL from dual";
    var data=queryAllData(sql);
    if(data==null||data[0]==null||data[0].URL==''){
        alert('�Բ��𣬸�ʡ��δ�����½����̵���ַ������ϵͳά����Ա��ϵ��');
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
        if(regionId == 531){//ɽ����Ҫͨ��httpheader����
    		var page ="/workshop/form/jtitsmFormFile/proMssOutLogin.jsp";
    		window.open(page,'_blank',sFeatures.join(","));
	    }else{
	        window.open(url,'_blank',sFeatures.join(","));
	    }
    }
}

//��ʱͨ����Ϣδ�Ķ���ʾ:
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
                mHtml +='onclick="webIMMeeting();" title="����鿴">';
                mHtml +="<img src='resource/image/indexITSM/advert.gif' align='absmiddle' style='margin-right:3px;'>����<b style='color:#FF0000'>"+ALL_countNum+"</b>����ʱͨ����Ϣ,��ע�����!";
                mHtml +='</span>';
            newMsg.innerHTML = mHtml;
            newMsg.style.display="block";
        }else{
            newMsg.style.display="none";            
        }
        
    }
    
    if(!isUnreadMessages) curTopUnreadMsgId = 0;
    if(isUnreadMessages && lastTopUnreadMsgId < curTopUnreadMsgId) {
        //oBGSound.src = "resource/media/message.wav";  //"�����µ���Ϣ,��ע�����"������ʾ
    }
    isUnreadMessages = false;
    lastTopUnreadMsgId = curTopUnreadMsgId;
}

//�����ղؼв˵�:
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

//���ղؼв˵���
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


//���죺
//��ʱˢ�´���
function refreshMsgInfo(){
     window.setInterval("setMsgInfo()",waiteTime);
}

var gEType;
function setMsgInfo(){
    document.getElementById('eventPageIfr').src = 'eventPageListMSS_itsm.html'; //������ϸ
   // loadFlowMsgInfoStart(); //��ʼ���أ�������ϸ
    msgCountDiv.innerHTML = '<img src="resource/image/indexITSM/loading3.gif" style="margin:100px 0 0 0px;">';
    var staffId = getCurrentStaffId();
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange=function(){renderTODOList(xmlhttp)}
    xmlhttp.open("post","servlet/EventPageSimple?tag=3",true);///servlet/Flows_Count?staff_id="+staffId
    xmlhttp.send(null);
}
function renderTODOList(xmlhttp){//�������
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
//                    //���ǵ�"�˹���֣����Զ�����������133759"��"����ָ���޸���������133739"����
//                    continue;
//                }
                var bgColor="#FFFFFF";;
                if(i%2==1){
                    bgColor = "#F6F6F6";
                }
                outHTML +=  '<tr style="background-color:'+bgColor+';">';
                outHTML +=  '   <th>'+ rowSetList[i].selectSingleNode("flow_name").text +'��</th>'; 
                outHTML +=  '   <td>';
                if ( rowSetList[i].selectSingleNode("type12_num").text >0){
                    outHTML +=  '<span style="width:95px;text-align:left;font-weight:bold;cursor:hand;" onClick="changeTab(1,'+ rowSetList[i].selectSingleNode("queryResultId").text+','+rowSetList[i].selectSingleNode("flow_mod").text+')" onMouseOver="this.style.color=\'#FF0000\'; this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\'; this.style.textDecoration=\'none\';" title="����鿴">';
                    outHTML +=  '������:';
                    outHTML +=  '<font style="color:#FF0000;font-weight:normal;">'+ rowSetList[i].selectSingleNode("type12_num").text +'</font>';
                    outHTML +=  '</span>';
                }
                
                if ( rowSetList[i].selectSingleNode("type100_num").text >0){
                    outHTML +=  '<span style="width:95px;text-align:left;font-weight:normal;cursor:hand;" onClick="changeTab(3,'+ rowSetList[i].selectSingleNode("queryResultId").text+','+rowSetList[i].selectSingleNode("flow_mod").text+')" onMouseOver="this.style.color=\'#FF0000\'; this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\'; this.style.textDecoration=\'none\';" title="����鿴">';
                    outHTML +=  '�Ѱ���:';
                    outHTML +=  '<font style="color:#FF0000;font-weight:normal;">'+ rowSetList[i].selectSingleNode("type100_num").text +'</font>';
                    outHTML +=  '</span>';
                }
                
                if ( rowSetList[i].selectSingleNode("type3_num").text >0){
                    outHTML +=  '<span style="width:95px;text-align:left;font-weight:normal;cursor:hand;" onClick="changeTab(2,'+ rowSetList[i].selectSingleNode("queryResultId").text+','+rowSetList[i].selectSingleNode("flow_mod").text+')" onMouseOver="this.style.color=\'#FF0000\'; this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\'; this.style.textDecoration=\'none\';" title="����鿴">';
                    outHTML +=  '����:';
                    outHTML +=  '<font style="color:#FF0000;font-weight:normal;">'+ rowSetList[i].selectSingleNode("type3_num").text +'</font>';
                    outHTML +=  '</span>';
                }
                outHTML +=  '   </td>';
                outHTML +=  '</tr>';
            }
            outHTML += '</table>';
        }else {
            outHTML += '<div style="line-heigth:35px; color:#0066CD; padding:0 0 6px 5px;">���ã���Ŀǰ�޴��칤����</div>';
        }
    xmlhttp = null;
    msgCountDiv.innerHTML = outHTML;
}

function changeTab(type,queryResultId,flow_mod){
    //id:��monitor_menu���monitor_id
    //tab˳��:1������ 2:���� 3:�Ѵ��� 4:ȫ��
    var url ="workshop/queryTemplate/main.html?id="+queryResultId+"&tab="+type+"&flow_mod="+flow_mod+"&menutree=0";
    niOpenWind(url,true);
}

//�����ڲ�����(��Ϣ����):
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
        //(1). ��Ϣ�����б�
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
                    msgIsRead = '<IMG SRC="resource/image/ico/msg_read.gif" ALT="�Ѷ�" align="absmiddle">';
                }else{
                    msgIsRead = '<IMG SRC="resource/image/ico/msg_unread.gif" ALT="δ��" align="absmiddle">';
                }
                
                if(isSpecial!=null && typeof isSpecial!="undefined" && isSpecial=="0BT"){
                    //�������ӡ�����:
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
        //������
        MM_openBrWindow("workshop/board/boardInfoContent.jsp?boardInfoId="+billInfoId,"");
        return;
    }
    if(categoryName!=null && categoryName!=undefined && categoryName=="ZSK"){
        //֪ʶ��
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
    theday = year+"��" + [today.getMonth()+1]+"��" +today.getDate() + "��&nbsp;&nbsp;"+d[today.getDay()+1];
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
    timeString = theday+"<br>"+xfile+"&nbsp;<font style='font-size:26px;line-height:26px;'>"+hours+minutes+seconds+"</font>";
    document.getElementById('oCurDateTime').innerHTML = timeString;
    window.setTimeout("setDateTimeInfo();", 1000);
}

//����:
function searchEntrance(){
    document.getElementById('queryString').value = document.getElementById('queryString').value.trimall();
    var queryInput = document.getElementById('queryString').value;
    if(queryInput.length==0){
        alert("��������������!");
        document.getElementById('queryString').focus();
        return;
    }
    var queryStr = encodeURIComponent(document.getElementById('queryString').value); //�ؼ���
    var indexDir = "publish_index_directory";  //Դ
    var module = "knowledge";    //ģ��
    var urlPath ="/workshop/knowledge/knowledgeCenterNew.jsp?queryString="+queryStr+"&catalogId=&regionName=&orgId=&searchRange=1";
    window.open('index_ITSMFrame.jsp?mainUrl='+encodeURIComponent(urlPath));
    //niOpenWind(urlPath,false);
}

//ע����
function logout(){
  //if (confirm('��ȷ��Ҫע��ϵͳ��')){
    document.frmLogin.submit();
}


// ����ͳ��ͼ��frame zhengqch
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
//��ȡԱ����ҳ��������Ȩ��
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
                         tabName[tabName.length] = "�ɷ�����ʡ������";
                         break;
          case '10302' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=202&chart=907&height=180";
                         tabName[tabName.length] = "�������ɷ���ִ�����";
                         break;
          case '10303' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=203&chart=908&height=180";
                         tabName[tabName.length] = "��ʡ�������ͳ��";
                         break;    
          case '10304' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=204&chart=910&height=180";
                         tabName[tabName.length] = "������洦��ͳ��";
                         break;   
          case '10305' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=209&chart=915&height=180";
                         tabName[tabName.length] = "�����ɵ������";
                         break;
          case '10306' : charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=210&chart=916&height=180";
                         tabName[tabName.length] = "�����ɵ���ɼ�ʱ��";
                         break;                                                    
       }                                         
       
   }
}**//**
//��ȡԱ���������õ���ҳչʾ����
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
          tabName[tabName.length] = "�ɷ�����ʡ������";
          continue;
       }
       if(pri_id == '10302' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=202&chart=907&height=180";
          tabName[tabName.length] = "�������ɷ���ִ�����";
          continue;
       }
       if(pri_id == '10303' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=203&chart=908&height=180";
          tabName[tabName.length] = "��ʡ�������ͳ��";
          continue;
       }
       if(pri_id == '10304' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=204&chart=910&height=180";
          tabName[tabName.length] = "������洦��ͳ��";
          continue;
       }
       if(pri_id == '10305' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=209&chart=915&height=180";
          tabName[tabName.length] = "�����ɵ������"; 
          continue;
       }
       if(pri_id == '10306' && checked == '1'){
          charts[charts.length] = "workshop/queryTemplate/TemplateFourChart.html?panel=210&chart=916&height=180";
          tabName[tabName.length] = "�����ɵ���ɼ�ʱ��";
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
//�����ҳ��������
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

//����̳
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

//�����̳url
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

//��ʼ����̳��Ϣ�б�
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
    
    var hasPrivilege = getHasPrivilege("10501");    //�ж��Ƿ�����ҳ�µġ�����̨���˵�Ȩ�޵�
    if(hasPrivilege=="true"){
        document.getElementById("leftItem15").style.display = "block";
    }
}*/

//ҵ�����ݱ������������
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
            name_TD.innerHTML = (calledName&&calledName!="null")?calledName:staffName;     //����
            orgName_TD.innerHTML = dXML.selectSingleNode("/root/Msg/ORG_NAME").text;        //��������
            if(dXML.selectSingleNode("/root/Msg/EMAIL").text !=""){
                Email_TD.innerHTML = dXML.selectSingleNode("/root/Msg/EMAIL").text + "<a href='mailto:"+dXML.selectSingleNode("/root/Msg/EMAIL").text+"'><font style='font-family:wingdings;font-size:14px;color:#6BA5D7;margin-left:2px;' title='�����ʼ�'>*</font></a>";      //email
            }
            tel_TD.innerHTML = dXML.selectSingleNode("/root/Msg/TEL").text;         //�绰
        } else {
        }
    }
}

function whowMorUserInfo(){
    showStaffInfo(staffId);
}

/**
 * WebIMδ����Ϣ�б����
 * @author: Laixh
 * @add: 2009-11-11
 * @�޸� 2010-08-27 linjx
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
        var staffCount; //�����˸���
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
                    continue;   //�����������İ���Ϣ
                }
              //��������������100  2010.08.26
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
                    outHTMLUser += '<img src="'+imgPath+unreadImg+'" align="absmiddle" title="δ����Ϣ">';
                }else if(msgTag == "F"){
                    outHTMLUser += '<img src="'+imgPath+unreadReplyImg+'" align="absmiddle" title="δ���Ļظ���Ϣ">';  
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
            outHTMLUser = "<span style='display:block; color:#748189; font-size:12px;line-height:20px; padding:10px 0 10px 25px;text-align:left;'>��Ŀǰû��δ����Ϣ��</span>";
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


/*ͨ�����ô˷����򿪼�ʱͨ��WebIM���� */
function webIMMeeting(id, name, tag, listTag) {
    if (!window.top.w) {
        eval("window.top.w = new Object();"); // evalִ�У�����ȫ�ֱ�������: window.top.w
    }
    if (window.top.w && window.top.w.open && !window.top.w.closed) {
        window.top.w.moveTo(0, 0); // �������Ƶ���Ļ���Ͻ�
        window.top.w.resizeTo(screen.width, screen.height - 30); // ���������
        window.top.w.focus(); // ��������Ϊ��ǰ����
        if (id != null && name != null && tag != null && id != "" && name != "" && tag != "") {
            var params = new Array();
            params.push("sendId=" + id); // idΪ�û�ID����֯����ID
            params.push("name=" + encodeURIComponent(name)); // nameΪ�û����ƻ���֯��������
            params.push("tag=" + tag); // �û���tag="STAFF", ��֯������tag="ORG"
            window.top.w.tabWinTitle.openWin("/workshop/webIM/messenger.jsp?" + params.join("&"), name, id, tag);
        }
        window.top.w.tabWinTitle.flashWindowTitle(); // ��˸���ڱ���
    } else {
        var wProperties = "top=0, left=0, height="+(window.screen.availHeight-35)+", width="+(window.screen.availWidth-10)+", toolbar=no, menubar=no, scrollbars=auto,resizable=yes,status=no";
        if (id != null && name != null && tag != null && id != "" && name != "" && tag != "") {
            var params = new Array();
            params.push("sendId=" + id); // idΪ�û�ID����֯����ID
            params.push("name=" + encodeURIComponent(name)); // nameΪ�û����ƻ���֯��������
            params.push("tag=" + tag); // �û���tag="STAFF", ��֯������tag="ORG"
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




//Ա��������Ϣ(�鿴)��
function showStaffInfo(id) {
    window.showModalDialog("../workshop/info/staff_info.htm?staffId="+id,window,"dialogWidth=440px;dialogHeight=420px;help=0;scroll=0;status=0;");
}

//Ա��������Ϣ��
function editStaff(){
    window.showModalDialog("workshop/user/individualInfo.jsp?tag=1",null,"dialogWidth=500px;dialogHeight=566px;help=0;scroll=0;status=0;");
}

//��ɫת����
function windowOpenStaffChang() {
    window.showModalDialog("workshop/stafferrand/staffErrandInfoNoFilter.html",window,"dialogWidth=530px;dialogHeight=410px;help=0;scroll=0;status=0;");
}

//�޸����룺
function chagePswd(){
    window.showModalDialog("workshop/user/changePw.html",window,"dialogWidth=408px;dialogHeight=250px;help=0;scroll=0;status=0;");
}





/**
 * �����İ�δ����Ϣ laixh 2011-11-29
 */
var waiteTime = 300000;
function loadUnReadWebIMList(){
    unRead();
    waiteTime = $getSysVar('JTITSM_UNREAD_WAITE_TIME');//ˢ��Ƶ��
    window.setInterval("unRead()",waiteTime);
}

function unRead(){//δ��
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
            DBdiv.innerHTML = "<span style='padding-left:10px;color:#999999;'><br>�����µ������İ쵥��</span>";
            DBcount.innerHTML = "";
        }
        
        if (DBcountN > 0){
            var mHtmlDC="";
                mHtmlDC +='<span style="display:inline;color:#0055E5;font-size:13px;line-height:20px;height:20px;cursor:hand;text-align:center;" ';
                mHtmlDC +='onMouseOver="this.style.textDecoration=\'underline\'" onMouseOut="this.style.textDecoration=\'\'" ';
                mHtmlDC +='onclick="doMenu_open(\'workshop/queryTemplate/ReadItsm.html?result=91000002&tab=1\');" title="����鿴">';
                mHtmlDC +="<img src='resource/image/indexITSM/advert.gif' align='absmiddle' style='margin-right:3px;'>����<b style='color:#FF0000'>"+DBcountN+"</b>�������İ���Ϣ���봦��";
                mHtmlDC +='</span>';
            newMsg_FLOW_DISPOSE.innerHTML = mHtmlDC;
            newMsg_FLOW_DISPOSE.style.display="block";
        }else{
            var mHtmlDC="";
                mHtmlDC +='<span style="display:inline;color:#6D8591;font-size:13px;line-height:20px;height:20px;cursor:hand;text-align:center;" ';
                mHtmlDC +='onMouseOver="this.style.textDecoration=\'underline\'" onMouseOut="this.style.textDecoration=\'\'" ';
                mHtmlDC +='onclick="doMenu_open(\'workshop/queryTemplate/ReadItsm.html?result=91000002&tab=2\');" title="����鿴">';
                mHtmlDC +="<img src='resource/image/indexITSM/qbxs.gif' align='absmiddle'>�����µ������İ쵥��";
                mHtmlDC +='</span>';    
            newMsg_FLOW_DISPOSE.innerHTML = mHtmlDC;
            newMsg_FLOW_DISPOSE.style.display="block";
        }
    }
}


//���ء���Ŀ�ĵ������б� laixh
var startDragClientX;  // ��ʼ��X
var startDragClientY;  // ��ʼ��Y
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
    {//����(�ĵ�Id��Ŀ¼ID��·��)����С���������ڣ������ˣ�(����)��
        oItem = oRows[i];
        if(oItem.selectSingleNode("HAS_PRIVILEGE").text!="1") continue;
        
        rowObject = catalogContents.insertRow();
        rowObject.height="23";
        
        //����:
        cellObject = rowObject.insertCell();//1
        cellObject.noWrap=true;
        cellObject.align="left";
        cellObject.innerHTML = '&nbsp;&nbsp;<img width="16" height="16" align="absmiddle" src="../../resource/image/ico/new.gif">'+
                               '<span id="document" onclick="downloadDocument()" style="width:315px;overflow:hidden;text-overflow:ellipsis;cursor:default;color:#2167AC;cursor:hand;" title="�������" onmouseover="onItemOver()" onmouseout="onItemOut()">'+
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
//-------------  5.2 ��껬��  --------------------------------------
//----------------------------------------------------------------
function onItemOut()
{
    event.srcElement.runtimeStyle.textDecoration = '';
}
function getSize(documentSize)
{
    var result = parseFloat(documentSize);
    var unit = "�ֽ�";
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

// ȡ�õ�ǰ��½�û�����
function getCurrentUserName() {
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    oXMLHTTP.open("get", "/servlet/util?OperType=6", false);
    oXMLHTTP.send("");
    if (isSuccess(oXMLHTTP)) {
        return oXMLHTTP.responseXML.selectSingleNode("/root/user_name").text;
    }
}

// ��ʾ�ȴ���
var WAIT_ELEMENT_ID;
function showWaitITSM(text, oParent) {
    if (text == null) {
        text = '���ڶ�ȡ����';
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
                + "<div style='width:90px;float:left;color:#0B4696;font:12px/18px ����; margin:8px 0 0 5px;border:0px solid #eee;'>"
                + text + "<br><font color='#FF0000'>���Ժ�...</font>" + "</div>"
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

//�����İ���ϸ�б�
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
    //����������У�
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
        
        //����:
        cellObject = rowObject.insertCell();//1
        cellObject.noWrap=true;
        cellObject.align="left";
        cellObject.innerHTML = '&nbsp;<img width="16" height="16" align="absmiddle" src="../../resource/image/ico/new.gif">'+
           '<span id="document" onclick="dispose('+tch_id+')" style="width:315px;overflow:hidden;text-overflow:ellipsis;cursor:default;color:#2167AC;cursor:hand;" title="�������" onmouseover="this.style.color=\'#FF0000\';" onmouseout="this.style.color=\'\';">'+
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
        //����δ�رգ�
        window.setTimeout("refreshDisposeList()",1000);
    }else{
        //�����ѹرգ�
        loadFlowDisposeList();  //ˢ���б�
        setWebIMMsgInfo();
        loadUnReadWebIMList();
        disposeWind = null;
    }
}


/************
 * ��������
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
                //return document.getElementById("workLinkDiv").innerHTML = '<div style="margin-top:30px;"><b>���ã���Ŀǰ�޹���������</b></div>';
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

