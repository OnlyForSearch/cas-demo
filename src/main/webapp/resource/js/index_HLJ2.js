
var staff_id=getCurrentStaffId();
var beforeAlarmClass='';
var hasFlag = false;
var quickNum=0;

//代办刷新按钮
function refeshDaiban(){
    loadPendingList("HLJ_DAILY_FLOW_TO_DO","pendingList0","0");
    loadPendingList("HLJ_REQUIRE_FLOW_TO_DO","pendingList1","1");
    loadPendingList("HLJ_ALARM_FLOW_TO_DO","pendingList2","2");
    loadPendingList("HLJ_MAINTEN_WORK_TO_DO","pendingList3","3");
    loadPendingList("HLJ_OTHERS_TO_DO","pendingList4","4");
    
    loadPendingList("HLJ_ATTENTION_READ","attentionReadPageList","11");
    loadPendingList("HLJ_INDEX_PAGE_READ","otherReadPageList","12");
    
    loadPendingList("HLJ_ATTENTION_PAGGED","attentionPageedList","13");
    loadPendingList("HLJ_INDEX_PAGE_HAS_READ","otherPageedList","14");
    
    
    loadPendingList("HLJ_INDEX_PAGE_BENREN_FAQI","followTab","7");
    loadPendingList("HLJ_ATTENTION_TO_DO","pendingList8","8");
    pendingListCount();//统计代办的个数
}

// 公告栏权限
function boardInfos(){
    /**
    var staffId=staff_id; 
    if(getHasPrivilege("906302", staffId)=="false"){//发布
        boardInfoId.href = "javascript:";
        boardInfoId.disabled = true;
    }
    if(getHasPrivilege("906301", staffId)=="false"){//查看
        boardInfoMoreId.href = "javascript:";
        boardInfoMoreId.disabled = true;        
    }else{*/
        window.setTimeout("document.getElementById('boardInfo').src = 'workshop/board/boardScroll_JT.htm'",10);//公告栏滚动boardScroll_JT.htm boardScroll.jsp
    //}
}

//--------------菜单栏开始--------------------

//黑龙江菜单导航    
function addTopMenuHLJ(id,oMenuBar,curMenuId)
{
    var i;
    var menuId="-1";
    var arrayUrl=getURLSearch();
    if(arrayUrl!=null)
    {
       menuId = arrayUrl.menuId;
       if(typeof(arrayUrl.action)!='undefined'
            &&arrayUrl.action=='1'){
            action = arrayUrl.action;
       }
    }    
    
    var xPath = "/root/rowSet";
    xmlhttp.Open("POST",menuUrl+id+'&action=0',false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        var outHTML = '';
        if(menuId!="-1"&&action!=1)
        {
            outHTML +=  '<span style="cursor:hand;float:left" onmouseover="doMenuOverHLJ(this)" '
                        +    'onmouseout="doMenuOutHLJ(this)" onclick="doMenu_refresh()">'
                        +  '<span style="height:34px;" class="menuTitle">主页</span>'
                        +'<img width="10px" height="35px" src="/resource/image/indexHlj2/index/space1.png" align="absbottom"/>'
                        +'</span>';
        }
        xmlDoc.load(xmlhttp.responseXML);
        var oNodes = xmlDoc.selectNodes(xPath);
        var iLen=oNodes.length;
        for(i=0;i<iLen;i++)
        {
            var oNode=oNodes[i];
            var tempStr='';
            if(action==1&&oNode.getAttribute("PRIVILEGE_ID")==10){
                continue;
            }
            var isCurMenu=(curMenuId==oNode.getAttribute("PRIVILEGE_ID"));
            outHTML +=   '<span style="cursor:hand;float:left"'
            outHTML +=    ' id="'+oNode.getAttribute("PRIVILEGE_ID")+'"';
            outHTML +=    ' oncontextmenu="rightClickedMenuItem=this;itemRight_add.show()"'
            if(oNode.getAttribute("SCRIPT_NAME"))
            {
                outHTML += ' onclick="oSelectedItem=this;'+oNode.getAttribute("SCRIPT_NAME")+'"';
            }
            if(oNode.getAttribute("SERVER_URL_NAME"))
            {
                outHTML += ' SERVER_URL_NAME="'+oNode.getAttribute("SERVER_URL_NAME")+'"';
            }
            if(oNode.getAttribute("CUSTOM_URL_NAME"))
            {
                outHTML += ' CUSTOM_URL_NAME="'+oNode.getAttribute("CUSTOM_URL_NAME")+'"';
            }
            if(!isCurMenu)
            {
               outHTML +=    ' onmouseover="doMenuOverHLJ(this)" onmouseout="doMenuOutHLJ(this)"';
               tempStr='<span class="menuTitle" style="height:34px;">&nbsp;'+oNode.getAttribute("PRIVILEGE_NAME")+'&nbsp;</span>';
            }else{
                tempStr='<span class="menuTitleBgOver" style="height:34px;">&nbsp;'+oNode.getAttribute("PRIVILEGE_NAME")+'&nbsp;</span>';
            }
            outHTML +=   '>'
            outHTML +=  tempStr
            outHTML +=  '<img width="10px" height="35px" src="/resource/image/indexHlj2/index/space1.png" align="absbottom"/>'
            outHTML +='</span>';
            
        }
        oMenuBar.innerHTML = outHTML;
    }
}

function doMenuOverHLJ(oMenuItem){
   oMenuItem.childNodes[0].className="menuTitleBgOver";
}
function doMenuOutHLJ(oMenuItem){
    oMenuItem.childNodes[0].className="menuTitle";
}
function doMenu_open(width,height)
{
    if(oSelectedItem.SERVER_URL_NAME)
    {
        doMenu_open_by_url(oSelectedItem.SERVER_URL_NAME,width,height,oSelectedItem.id);
    }
}

    
    // 快速通道 个性化菜单开始
    var reloc_id = [];
    var reloc_url =[];
    var menuDoc = new ActiveXObject("Microsoft.XMLDOM");
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
            quickNum=0;
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
                                    outHTMLStr += " onClick=\"doMenu_open2('" + serverUrlName + "','',''," + menuList[i].getAttribute("id") + ")\" ";
                              }else{
                                    outHTMLStr += " onClick=\"niOpenWind('" + serverUrlName + "',true)\" ";
                              }
                              outHTMLStr += "><img src='resource/image/indexHlj2/index/item.gif' align='absmiddle'/>&nbsp;";
                              outHTMLStr +=favoriteName; 
                              outHTMLStr += "</a>";
                              quickNum++;
                          }
                      }catch(e){continue}
                    }
                }
            }
            document.getElementById('shortCutMenu22').innerHTML = outHTMLStr + "<div style=\"clear:both;\"></div>";//alert(outHTMLStr);
            hasFlag = true;
            
        } 
    }
    // 快速通道 个性化菜单结束
    
    
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
    function doMenu_open2(url,width,height,winId) {
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
        if(isNewWind)
        {
            window.open(url,"_blank",sFeatures.join(","));
        }
        else
        {
            location.replace(url);
        }
    }
//--------------菜单栏结束--------------------   

//-------------工作链接函数开始---------
//工作链接,友情链接
function setWorkLinkHLJ(linkNodes)
{
    var outHTML = '';
    for(var i=0;i<linkNodes.length&&i<7;i++)
    {
        var linkImg = getNodeValue(linkNodes[i],'LINK_IMG');
        var linkVal = getNodeValue(linkNodes[i],'LINK_VALUE');
        var linkTitle = getNodeValue(linkNodes[i],'LINK_TITLE');
        var checkEd=getNodeValue(linkNodes[i],'CHECKED');
        if(checkEd=="0"){//权限判断 没有权限不显示
            continue;
        }
        //var linkTitle = linkImg!=null&&linkImg!='undefined'&&linkImg!=''?"<img src='" + linkImg + "' alt='" + linkTitle + "' border='0'>":linkTitle;  
        var temp='<a href="'+linkVal+'" class="gongzuolianjieACss">';
        outHTML += temp
                +       '<div style="float:left;"><img src="resource/image/indexImage/style1/about_link.jpg"/>&nbsp;</div>'
                +       '<div style="float:left;font-family:"Microsoft YaHei";">'+linkTitle+'</div></a>'        
    }
    workLinkSpan.innerHTML = outHTML;       
}
// 
//-------------工作链接函数结束---------


//-------------专题应用函数开始---------

function setSenimalLinkHlj(type)
{   
    var staffId=staff_id;
    var url='servlet/RequireHLJServlet?tag=2&staffId='+staffId+"&type="+type;
    xmlRequest.Open("POST",url,false); //mainpage.js中定义
    xmlRequest.send();
    if(isSuccess(xmlhttp))
    {
        if(type=="C"){
            var workLinks = xmlRequest.responseXML.selectNodes("/root/rowSet[LINK_TYPE='C']");      
            setWorkLinkHLJZhuanti(workLinks);
        }
        if(type=="B"){
            var workLinks = xmlRequest.responseXML.selectNodes("/root/rowSet[LINK_TYPE='B']");
            setWorkLinkHLJ(workLinks);
        }
    }
}

function OpenLink(){
    alert('您没有查看链接的权限！');
}
// 专题应用
function setWorkLinkHLJZhuanti(linkNodes)
{
    var outHTML = '';
    for(var i=0;i<linkNodes.length;i++)
    {
        var linkImg = getNodeValue(linkNodes[i],'LINK_IMG');
        var linkVal = getNodeValue(linkNodes[i],'LINK_VALUE');
        var linkTitle = getNodeValue(linkNodes[i],'LINK_TITLE');
        var linkImg2 ="<img style='width:30px;height:30px;' src='" + linkImg + "' alt='" + linkTitle + "' border='0'>";  
        var checkEd=getNodeValue(linkNodes[i],'CHECKED');
        if(checkEd=="0"){//权限判断 没有权限不显示
           continue;  
        }
        var temp='<a href="'+linkVal+'" style="float:left; height:35px;width:118px;margin:3px 1% 3px 3%;" class="zhuantiACSS">';       
        if(linkTitle=="易信支撑群"){
            linkTitle='<span style="color:red;">'+linkTitle+'</span>';
        }
        outHTML += temp
                +       '<div class="zhuantiImg">'+linkImg2+'</div>'
                +       '<div class="zhuantiTitle">'+linkTitle+'</div>' 
                +   '</a>';
    }
    zhuantiyingyong.innerHTML = outHTML;        
}

//-------------专题应用函数结束---------




//-------------首页快捷链接工作台、角色变更等结束--------

//-------------代办方块开始--------
// 代办 阅办等切换
var eventTabArr = ['eventPageTab','readPageTab','eventPageedTab','followTab'];
function selectTab(e,tabId){
    for(var i = 0; i < eventTabArr.length; i ++ ){
        if(eventTabArr[i] == tabId){
            document.getElementById(eventTabArr[i]).style.display = '';
        }else{
            document.getElementById(eventTabArr[i]).style.display = 'none';
        }
    }
    var ulNode = e.parentNode.parentNode;
    for(var li = 0; li < ulNode.childNodes.length; li++){   
        var liNode = ulNode.childNodes[li];
        liNode.childNodes[0].childNodes[0].className = 'colHeadLeft';
        liNode.childNodes[0].childNodes[1].className = 'colHead';
        liNode.childNodes[0].childNodes[2].className = 'colHeadRight';
    }
    e.childNodes[0].className = 'colHeadLeftSel';
    e.childNodes[1].className = 'colHeadSel';
    e.childNodes[2].className = 'colHeadRightSel';  
    
}


//控制标题长度
function ellipsisOverText(text, maxLength) {
    if (text !=null && text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    }
    return text;
}


// 代办 阅办等切换
var eventTabArr = ['eventPage','readPage','eventPageed','follow'];
function selectTab(e,tabId){
    for(var i = 0; i < eventTabArr.length; i ++ ){
        if(eventTabArr[i] == tabId){
            document.getElementById(eventTabArr[i]).style.display = '';
        }else{
            document.getElementById(eventTabArr[i]).style.display = 'none';
        }
    }
    var ulNode = e.parentNode.parentNode;
    for(var li = 0; li < ulNode.childNodes.length; li++){   
        var liNode = ulNode.childNodes[li];
        liNode.childNodes[0].childNodes[0].className = 'colHeadLeft';
        liNode.childNodes[0].childNodes[1].className = 'colHead';
        liNode.childNodes[0].childNodes[2].className = 'colHeadRight';
    }
    e.childNodes[0].className = 'colHeadLeftSel';
    e.childNodes[1].className = 'colHeadSel';
    e.childNodes[2].className = 'colHeadRightSel';
    
    if(tabId=='eventPage'){curTab=0;}
    if(tabId=='readPage'){curTab=5;}
    if(tabId=='eventPageed'){curTab=6;}
    if(tabId=='follow'){curTab=7;}
}

Array.prototype.contains = function(item){
	for(var i = 0 ;i < this.length; i++){
		 if(this[i]==item){return true;}
	}
	return false;
}

//日常运营类流程、需求类流程等切换
var eventTabArr2 = [];
var tabArr1 = ['attentionFlow','dailyRunFlow','requireFlow','alarmPage','maintenWorkPage','othersPage'];
var tabArr2 = ['attentionReadPageFlow','otherReadPageFlow'];
var tabArr3 = ['attentionPageedFlow','otherPageedFlow'];

function selectTab2(e,tabId,pTabId){
	var productionLineElem;
	if(tabArr1.contains(tabId)){
		eventTabArr2 = tabArr1;
		productionLineElem = document.getElementById('productionLineId');
	}else if(tabArr2.contains(tabId)){
		eventTabArr2 = tabArr2;
		productionLineElem = document.getElementById('productionLineId2');
	}else if(tabArr3.contains(tabId)){
		eventTabArr2 = tabArr3;
		productionLineElem = document.getElementById('productionLineId3');
	}
    for(var i = 0; i < eventTabArr2.length; i ++ ){
        var TabArr=eventTabArr2[i]+"1";
        var production_line="production_line2_"+i;  
        document.getElementById(TabArr).className = 'production2';
        if(eventTabArr2[i] == tabId){
            document.getElementById(eventTabArr2[i]).style.display = '';            
            document.getElementById(TabArr).className='production';     
            productionLineElem.style.marginLeft=document.getElementById(pTabId).offsetLeft+25;
            productionLineElem.className = production_line;
            
        }else{
            document.getElementById(eventTabArr2[i]).style.display = 'none';            
        }
    }
}



var srn_0=1, ern_0=7, hasBack_0=false; hasNext_0=false;
var srn_1=1, ern_1=7, hasBack_1=false; hasNext_1=false;
var srn_2=1, ern_2=7, hasBack_2=false; hasNext_2=false;
var srn_3=1, ern_3=7, hasBack_3=false; hasNext_3=false;
var srn_4=1, ern_4=8, hasBack_4=false; hasNext_4=false;
var srn_7=1, ern_7=8, hasBack_7=false; hasNext_7=false;
var srn_8=1, ern_8=8, hasBack_8=false; hasNext_8=false;
var srn_11=1, ern_11=8, hasBack_11=false; hasNext_11=false;
var srn_12=1, ern_12=8, hasBack_12=false; hasNext_12=false;
var srn_13=1, ern_13=8, hasBack_13=false; hasNext_13=false;
var srn_14=1, ern_14=8, hasBack_14=false; hasNext_14=false;

function pangeCtrl(action,num){
    if(num=="0"){
        if(action=="BACK" && hasBack_0){
            srn_0 = srn_0 - 7;
            ern_0 = ern_0 - 7;
            document.getElementById("nextPageBut_0").style.display="";
            hasNext_0 = true;
        }
        if(action=="NEXT" && hasNext_0){
            srn_0 = srn_0 + 7;
            ern_0 = ern_0 + 7;
            document.getElementById("backPageBut_0").style.display="";
            hasBack_0 = true;
        }
        loadPendingList("HLJ_DAILY_FLOW_TO_DO","pendingList0","0");
    }
    if(num=="1"){
        if(action=="BACK" && hasBack_1){
            srn_1 = srn_1 - 7;
            ern_1 = ern_1 - 7;
            document.getElementById("nextPageBut_1").style.display="";
            hasNext_1 = true;
        }
        if(action=="NEXT" && hasNext_1){
            srn_1 = srn_1 + 7;
            ern_1 = ern_1 + 7;
            document.getElementById("backPageBut_1").style.display="";
            hasBack_1 = true;
        }
        loadPendingList("HLJ_REQUIRE_FLOW_TO_DO","pendingList1","1");
    }
    if(num=="2"){
        if(action=="BACK" && hasBack_2){
            srn_2 = srn_2 - 7;
            ern_2 = ern_2 - 7;
            document.getElementById("nextPageBut_2").style.display="";
            hasNext_2 = true;
        }
        if(action=="NEXT" && hasNext_2){
            srn_2 = srn_2 + 7;
            ern_2 = ern_2 + 7;
            document.getElementById("backPageBut_2").style.display="";
            hasBack_2 = true;
        }
        loadPendingList("HLJ_ALARM_FLOW_TO_DO","pendingList2","2");
    }
    if(num=="3"){
        if(action=="BACK" && hasBack_3){
            srn_3 = srn_3 - 7;
            ern_3 = ern_3 - 7;
            document.getElementById("nextPageBut_3").style.display="";
            hasNext_3 = true;
        }
        if(action=="NEXT" && hasNext_3){
            srn_3 = srn_3 + 7;
            ern_3 = ern_3 + 7;
            document.getElementById("backPageBut_3").style.display="";
            hasBack_3 = true;
        }
        loadPendingList("HLJ_MAINTEN_WORK_TO_DO","pendingList3","3");
    }
    if(num=="4"){
        if(action=="BACK" && hasBack_4){
            srn_4 = srn_4 - 7;
            ern_4 = ern_4 - 7;
            document.getElementById("nextPageBut_4").style.display="";
            hasNext_4 = true;
        }
        if(action=="NEXT" && hasNext_4){
            srn_4 = srn_4 + 7;
            ern_4 = ern_4 + 7;
            document.getElementById("backPageBut_4").style.display="";
            hasBack_4 = true;
        }
        loadPendingList("HLJ_OTHERS_TO_DO","pendingList4","4");
    }
    
    if(num=="7"){
        if(action=="BACK" && hasBack_7){
            srn_7 = srn_7 - 8;
            ern_7 = ern_7 - 8;
            document.getElementById("nextPageBut_7").style.display="";
            hasNext_7 = true;
        }
        if(action=="NEXT" && hasNext_7){
            srn_7 = srn_7 + 8;
            ern_7 = ern_7 + 8;
            document.getElementById("backPageBut_7").style.display="";
            hasBack_7 = true;
        }
        loadPendingList("HLJ_INDEX_PAGE_BENREN_FAQI","followTab","7");
    }
    
    if(num=="8"){
        if(action=="BACK" && hasBack_8){
            srn_8 = srn_8 - 8;
            ern_8 = ern_8 - 8;
            document.getElementById("nextPageBut_8").style.display="";
            hasNext_8 = true;
        }
        if(action=="NEXT" && hasNext_8){
            srn_8 = srn_8 + 8;
            ern_8 = ern_8 + 8;
            document.getElementById("backPageBut_8").style.display="";
            hasBack_8 = true;
        }
        loadPendingList("HLJ_INDEX_PAGE_BENREN_FAQI","followTab","8");
    }

    if(num=="11"){
        if(action=="BACK" && hasBack_11){
            srn_11 = srn_11 - 8;
            ern_11 = ern_11 - 8;
            document.getElementById("nextPageBut_11").style.display="";
            hasNext_11 = true;
        }
        if(action=="NEXT" && hasNext_11){
            srn_11 = srn_11 + 8;
            ern_11 = ern_11 + 8;
            document.getElementById("backPageBut_11").style.display="";
            hasBack_11 = true;
        }
        loadPendingList("HLJ_ATTENTION_READ","attentionReadPageList","11");
    }
    
    if(num=="12"){
        if(action=="BACK" && hasBack_12){
            srn_12 = srn_12 - 8;
            ern_12 = ern_12 - 8;
            document.getElementById("nextPageBut_12").style.display="";
            hasNext_12 = true;
        }
        if(action=="NEXT" && hasNext_12){
            srn_12 = srn_12 + 8;
            ern_12 = ern_12 + 8;
            document.getElementById("backPageBut_12").style.display="";
            hasBack_12 = true;
        }
        loadPendingList("HLJ_INDEX_PAGE_READ","otherReadPageList","12");
    }
    
    if(num=="13"){
        if(action=="BACK" && hasBack_13){
            srn_13 = srn_13 - 8;
            ern_13 = ern_13 - 8;
            document.getElementById("nextPageBut_13").style.display="";
            hasNext_13 = true;
        }
        if(action=="NEXT" && hasNext_13){
            srn_13 = srn_13 + 8;
            ern_13 = ern_13 + 8;
            document.getElementById("backPageBut_13").style.display="";
            hasBack_13 = true;
        }
        loadPendingList("HLJ_ATTENTION_PAGGED","attentionPageedList","13");
    }
    
    if(num=="14"){
        if(action=="BACK" && hasBack_14){
            srn_14 = srn_14 - 8;
            ern_14 = ern_14 - 8;
            document.getElementById("nextPageBut_14").style.display="";
            hasNext_14 = true;
        }
        if(action=="NEXT" && hasNext_14){
            srn_14 = srn_14 + 8;
            ern_14 = ern_14 + 8;
            document.getElementById("backPageBut_14").style.display="";
            hasBack_14 = true;
        }
        loadPendingList("HLJ_INDEX_PAGE_HAS_READ","otherPageedList","14");
    }
    
}


//首页代办配置在sql_cfg中
var pendingInfoArray0;
var pendingInfoArray1;
var pendingInfoArray2;
var pendingInfoArray3;
var pendingInfoArray4;
var pendingInfoArray7;
var pendingInfoArray8;
var pendingInfoArray11;
var pendingInfoArray12;
var pendingInfoArray13;
var pendingInfoArray14;
function loadPendingList(paramName,tableName,num){
    var pendingInfo;        
    var pendingList = ResultFactory.newResult(paramName);
    var startRow = 1;
    var endRow = 7;
    pendingList.onLoad = function(oXml)
    {
        var pendingType;
        var pendingTitle;
        var pendingFlowType
        var aPendingRow;
        var aPendingCell;
        var aPendingTable = document.getElementById(tableName);
        //删除待办列表记录
        var rowLength = aPendingTable.rows.length;
        for(var i=rowLength-1; i>=0; i--)
        {
            aPendingTable.deleteRow(aPendingTable.rows(i).rowIndex);
        }
        //加载待办列表记录
        var resultRows = oXml.selectNodes("/root/rowSet");
        var pendingInfoArray = new Array(resultRows.length);
                
        for(var i=0; i<resultRows.length; i++) {
        
            pendingInfo = getPendingInfo(resultRows[i]);
            pendingInfoArray[i] = pendingInfo;
        
            aPendingRow = aPendingTable.insertRow(aPendingTable.rows.length);
            aPendingCell = aPendingRow.insertCell(0);
            aPendingCell.className = "mid_content_d"; 
            pendingType = "<span class='daibanType';>" + pendingInfo.type_name + "</span>";
            var contentTitle =  pendingInfo.content ;
            var fetIndex = pendingInfo.content.toLocaleLowerCase().indexOf("</font>");
            if (fetIndex != -1){
                 try{contentTitle = contentTitle.substr( fetIndex +7);}catch(e){};
            }           
            pendingTitle = "<a href='javascript:openSingle(" + i+","+num + ")' class='daibanName' title='"+contentTitle+"'>" + pendingInfo.content + "</a>";        
            aPendingCell.innerHTML = pendingType + pendingTitle;

        }
        setPageRowNum(resultRows.length,num);
        
        //判断是哪种代办
        if(num=="0"){
            pendingInfoArray0=pendingInfoArray;
        }
        if(num=="1"){
            pendingInfoArray1=pendingInfoArray;
        }
        if(num=="2"){
            pendingInfoArray2=pendingInfoArray;
        }
        if(num=="3"){
            pendingInfoArray3=pendingInfoArray;
        }
        if(num=="4"){
            pendingInfoArray4=pendingInfoArray;
        }
      
        if(num=="7"){
            pendingInfoArray7=pendingInfoArray;
        }
        
        if(num=="8"){  //待办-本人关注
            pendingInfoArray8=pendingInfoArray;
        }
        
        if(num=="11"){
        	pendingInfoArray11=pendingInfoArray;
        }
        if(num=="12"){
        	pendingInfoArray12=pendingInfoArray;
        }
        if(num=="13"){
        	pendingInfoArray13=pendingInfoArray;
        }
        if(num=="14"){
        	pendingInfoArray14=pendingInfoArray;
        }
        
        addRowEmpty(aPendingTable, resultRows.length, 7);
    }
      
    if(num=="0"){
        startRow= srn_0;
        endRow  = ern_0;
    }
    if(num=="1"){
        startRow= srn_1;
        endRow  = ern_1;
    }
    if(num=="2"){
        startRow= srn_2;
        endRow  = ern_2;
    }
    if(num=="3"){
        startRow= srn_3;
        endRow  = ern_3;
    }
    if(num=="4"){
        startRow= srn_4;
        endRow  = ern_4;
    }
    
    if(num=="7"){
        startRow= srn_7;
        endRow  = ern_7;
    }
    
    if(num=="8"){
        startRow= srn_8;
        endRow  = ern_8;
    }
    
    if(num=="11"){
        startRow= srn_11;
        endRow  = ern_11;
    }
    
    if(num=="12"){
        startRow= srn_12;
        endRow  = ern_12;
    }
    
    if(num=="13"){
        startRow= srn_13;
        endRow  = ern_13;
    }
    
    if(num=="14"){
        startRow= srn_14;
        endRow  = ern_14;
    }
    var pendingListParam = {P_START_ROW:startRow, P_END_ROW:endRow};
    pendingList.send(Result.FORCE_GET, pendingListParam);
}



//一条待办记录信息封装到数组
function getPendingInfo(aRowSet){   
    var pendingInfo = {
        src_staff_name:aRowSet.childNodes[0].text,
        exec_staff_name:aRowSet.childNodes[1].text,
        type_name:aRowSet.childNodes[2].text,
        content:aRowSet.childNodes[3].text,
        state_date:aRowSet.childNodes[4].text,
        id:aRowSet.childNodes[5].text,
        content_id:aRowSet.childNodes[6].text,
        type:aRowSet.childNodes[7].text,
        task_or_event:aRowSet.childNodes[8].text,
        isBindForm:aRowSet.childNodes[9].text,
        send_url:aRowSet.childNodes[10].text,
        thetype:aRowSet.childNodes[11].text,
        sort_id:aRowSet.childNodes[12].text
    }
    return pendingInfo;
}

function setPageRowNum(rowsLength, num){
    var pageRows = 0;
    if(num=="0"){
        pageRows = ern_0 - srn_0 + 1;
        if(rowsLength == pageRows){
            document.getElementById("nextPageBut_0").style.display="";
            hasNext_0 = true;
        }else{
            document.getElementById("nextPageBut_0").style.display="none";
            hasNext_0 = false;
        }
        if(srn_0 <= 1){
            document.getElementById("backPageBut_0").style.display="none";
            hasBack_0 = false;
        }
    }
    if(num=="1"){ 
        pageRows = ern_1 - srn_1 + 1;
        if(rowsLength == pageRows){
            document.getElementById("nextPageBut_1").style.display="";
            hasNext_1 = true;
        }else{
            document.getElementById("nextPageBut_1").style.display="none";
            hasNext_1 = false;
        }
        if(srn_1 <= 1){
            document.getElementById("backPageBut_1").style.display="none";
            hasBack_1 = false;
        }
    }
    if(num=="2"){
        pageRows = ern_2 - srn_2 + 1;
        if(rowsLength == pageRows){
            document.getElementById("nextPageBut_2").style.display="";
            hasNext_2 = true;
        }else{
            document.getElementById("nextPageBut_2").style.display="none";
            hasNext_2 = false;
        }
        if(srn_2 <= 1){
            document.getElementById("backPageBut_2").style.display="none";
            hasBack_2 = false;
        }
    }
    if(num=="3"){
        pageRows = ern_3 - srn_3 + 1;
        if(rowsLength == pageRows){
            document.getElementById("nextPageBut_3").style.display="";
            hasNext_3 = true;
        }else{
            document.getElementById("nextPageBut_3").style.display="none";
            hasNext_3 = false;
        }
        if(srn_3 <= 1){
            document.getElementById("backPageBut_3").style.display="none";
            hasBack_3 = false;
        }
    }
    if(num=="4"){
        pageRows = ern_4 - srn_4 + 1;
        if(rowsLength == pageRows){
            document.getElementById("nextPageBut_4").style.display="";
            hasNext_4 = true;
        }else{
            document.getElementById("nextPageBut_4").style.display="none";
            hasNext_4 = false;
        }
        if(srn_4 <= 1){
            document.getElementById("backPageBut_4").style.display="none";
            hasBack_4 = false;
        }
    }
   
    if(num=="7"){
        pageRows = ern_7 - srn_7 + 1;
        if(rowsLength == pageRows){
            document.getElementById("nextPageBut_7").style.display="";
            hasNext_7 = true;
        }else{
            document.getElementById("nextPageBut_7").style.display="none";
            hasNext_7 = false;
        }
        if(srn_7 <= 1){
            document.getElementById("backPageBut_7").style.display="none";
            hasBack_7 = false;
        }
    }
    if(num=="8"){
        pageRows = ern_8 - srn_8 + 1;
        if(rowsLength == pageRows){
            document.getElementById("nextPageBut_8").style.display="";
            hasNext_8 = true;
        }else{
            document.getElementById("nextPageBut_8").style.display="none";
            hasNext_8 = false;
        }
        if(srn_8 <= 1){
            document.getElementById("backPageBut_8").style.display="none";
            hasBack_8 = false;
        }
    }
    
    if(num=="11"){
        pageRows = ern_11 - srn_11 + 1;
        if(rowsLength == pageRows){
            document.getElementById("nextPageBut_11").style.display="";
            hasNext_11 = true;
        }else{
            document.getElementById("nextPageBut_11").style.display="none";
            hasNext_11 = false;
        }
        if(srn_11 <= 1){
            document.getElementById("backPageBut_11").style.display="none";
            hasBack_11 = false;
        }
    }
    if(num=="12"){
        pageRows = ern_12 - srn_12 + 1;
        if(rowsLength == pageRows){
            document.getElementById("nextPageBut_12").style.display="";
            hasNext_12 = true;
        }else{
            document.getElementById("nextPageBut_12").style.display="none";
            hasNext_12 = false;
        }
        if(srn_12 <= 1){
            document.getElementById("backPageBut_12").style.display="none";
            hasBack_12 = false;
        }
    }
    
    if(num=="13"){
        pageRows = ern_13 - srn_13 + 1;
        if(rowsLength == pageRows){
            document.getElementById("nextPageBut_13").style.display="";
            hasNext_13 = true;
        }else{
            document.getElementById("nextPageBut_13").style.display="none";
            hasNext_13 = false;
        }
        if(srn_13 <= 1){
            document.getElementById("backPageBut_13").style.display="none";
            hasBack_13 = false;
        }
    }
    
    if(num=="14"){
        pageRows = ern_14 - srn_14 + 1;
        if(rowsLength == pageRows){
            document.getElementById("nextPageBut_14").style.display="";
            hasNext_14 = true;
        }else{
            document.getElementById("nextPageBut_14").style.display="none";
            hasNext_14 = false;
        }
        if(srn_14 <= 1){
            document.getElementById("backPageBut_14").style.display="none";
            hasBack_14 = false;
        }
    }
}


function addRowEmpty(tableName, startRow, endRow){
    var aRow;
    var aCell;
    for(var i=startRow; i<endRow; i++){
        aRow = tableName.insertRow(tableName.rows.length);
        aCell = aRow.insertCell(0);
        //i%2==0 ? aCell.className = "mid_content_d" : aCell.className = "mid_content_s";
        aCell.innerHTML = "&nbsp;";
    }
}

// 代办打开的链接
function openSingle(index,num) {
    if(index == null || typeof(index)=='undefined'){
        return;
    }
   var pendingInfo;
    if(num=="0")
        pendingInfo = pendingInfoArray0[index];
    if(num=="1")
        pendingInfo = pendingInfoArray1[index];
    if(num=="2")
        pendingInfo = pendingInfoArray2[index];
    if(num=="3")
        pendingInfo = pendingInfoArray3[index];
    if(num=="4")
        pendingInfo = pendingInfoArray4[index];
    if(num=="7")
        pendingInfo = pendingInfoArray7[index];
    if(num=="8")
        pendingInfo = pendingInfoArray8[index];
    if(num=="11")
        pendingInfo = pendingInfoArray11[index];
    if(num=="12")
        pendingInfo = pendingInfoArray12[index];
    if(num=="13")
        pendingInfo = pendingInfoArray13[index];
    if(num=="14")
        pendingInfo = pendingInfoArray14[index];

    var selectedRows = pendingInfo.id;
    var type = pendingInfo.task_or_event;
    var event_type_id = pendingInfo.type; //取得表单类型
    var content_id = pendingInfo.content_id;//取得流程或者环节标识
    var isBindForm = pendingInfo.isBindForm;//取得是否有绑定表单
    var send_url = pendingInfo.send_url; //取得待办打开的链接
    
    if(send_url.indexOf('/')!=0){
        send_url = '/'+send_url;
    }
    var curr_window;
    x=(window.screen.width-780)/2;
    y=(window.screen.height-560)/2;
    var thetype = pendingInfo.thetype;
    if(thetype==01||thetype==02){
        //curr_window=window.open('/WorkAccept?type='+type+'&id='+selectedRows,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
        //待办修改为点击直接打开表单界面，已启动也不先打开流转过程图 jiangmt 20100517
        if(event_type_id=="3"){//已启动
            if(isBindForm=="0")//无表单流程
                curr_window=window.open('/FlowBrowse?flow_id=' +content_id+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
            else
                curr_window=window.open(send_url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
        }else if (event_type_id=="2"){//待办
            send_url = "/hworkshop/form/index.jsp?tchId="+content_id+"&callback=opener.refeshDaiban()&fullscreen=yes";
            if(isBindForm=="0")//无表单流程
                curr_window=window.open('/TacheExec?tch_id=' +content_id+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
            else
                curr_window=window.open(send_url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
        }else if (event_type_id=="g"){//阅办
            send_url = "/workshop/form/index.jsp?tchId="+content_id+"&callback=opener.refeshDaiban()&fullscreen=yes&type=view";
            curr_window=window.open(send_url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
        }
        else{
            curr_window=window.open(send_url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
        }
    }else{
        //curr_window=window.open('/OtherWorkAccept?type='+type+'&id='+selectedRows,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
        if(event_type_id=="0" || event_type_id=="1" || event_type_id=="2"
            || event_type_id=="3" || event_type_id=="g" || event_type_id=="H"){//这几个类型有走 流程在待办的已处理事务里直接打开流程图
            curr_window=window.open('/FlowBrowse?flow_id=' +content_id+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
        }
        else{
            curr_window=window.open('/OtherWorkAccept?type='+type+'&id='+selectedRows,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
        }
    }
    curr_window.focus();
}

//-------------代办方块结束--------

//-------------告警信息------------

function refreshAlarmInfo(){
   getAlarmList(beforeAlarmClass);
}

var flag = '';
function getAlarmList(alarmClass)
{    
    beforeAlarmClass = alarmClass;
    if(flag!=''){
        clearTimeout(flag);
    }
    var limitCount=10;
    var iRefreshTime=30*1000;
    var url = "servlet/RequireHLJServlet?tag=1&limitCount="+limitCount;
    if(alarmClass!=null&&alarmClass!=''&&alarmClass!=undefined){
        url+="&alarmClass="+alarmClass;
    }
    oAlarmXMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
    oAlarmXMLHttp.onreadystatechange=doAlarmStateReady;
    oAlarmXMLHttp.open("POST", url,true);
    oAlarmXMLHttp.send();
    flag = window.setTimeout("getAlarmList("+alarmClass+")",iRefreshTime);
    popCategory.style.display = 'none';
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
    
   var alarmOutput = '<table width="100%" border="0" cellspacing="0" cellpadding="0">'+
                   '  <tr>'+
                   '    <td height="3" colspan="4"> </td>'+
                   '  </tr>'+
                   '  <TR align="center" bgcolor="#F1F1F6">';
 
  alarmOutput+= '    <TD style="border-right:2px solid #ffffff;padding-left:5px;" width="70"><nobr>告警类型</nobr></TD>';
  alarmOutput+= '    <TD style="border-right:2px solid #ffffff;padding-left:5px;"><nobr>告警标题</nobr></TD>';  
  alarmOutput+= '    <TD style="border-right:2px solid #ffffff;padding-left:5px;" width="80"><nobr>告警等级</nobr></TD>'; 
  alarmOutput+= '    <TD style="border-right:2px solid #ffffff;padding-left:5px;" width="120"><nobr>告警产生时间</nobr></TD>'+
               '  </tr>'+
               '  <tr>'+
               '    <td height="2" colspan="6"> </td>'+
               '  </tr>';
   for(var i=0;i<iLen;i++)
   {   
       var oRowSet=oRowSets[i];
       var iAlarmId=oRowSet.selectSingleNode("NE_ALARM_LIST_ID").text;
       var sAlarmTitle=oRowSet.selectSingleNode("ALARM_TITLE").text;
       var iAlarmLevel=oRowSet.selectSingleNode("ALARM_LEVEL").text;
       var sCreatTime=oRowSet.selectSingleNode("CREATE_TIME").text;  
       var alarmTypeName = oRowSet.selectSingleNode("ALARM_TYPE_NAME").text;               
       alarmOutput+= '  <tr  style="cursor:hand;" onmouseover="doMouseOver(this)" onmouseout="doMouseOut(this)" onclick="showAlarmById('+iAlarmId+ 
                    ')">';       
       alarmOutput+= '<td><nobr>['+alarmTypeName+']</nobr></td>';
       alarmOutput+= '    <td>'+
                     '       <nobr>'+
                              getTitle2(sAlarmTitle)+
                    '     </nobr>'+
                    '    </td>';
       alarmOutput+= '<td align="center"><img  src="resource/image/s_'+getAlarmColor(iAlarmLevel)+'.gif" /></td>';   
       alarmOutput+= '<td><nobr>'+sCreatTime+'</nobr></td>';              
       alarmOutput+= '  </tr>';   
   }
   alarmOutput   +=  '  <tr>'+
                         '    <td height="3" colspan="4"> </td>'+
                         '  </tr>'+
                         '</table>';
   oAlarmList.innerHTML=alarmOutput;
}                                          

function showAlarmById(iAlarmId)
{
   displayMaxWindow('workshop/alarmManage/viewAlarmInfo.htm?alarmId='+iAlarmId,iAlarmId,false);
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

function showBillInfoCategory(dropDownCategory, popObj)
{
    popObj.style.display='';
    popObj.style.zIndex="100";
    popObj.style.left = getPos(dropDownCategory,"Left") + dropDownCategory.offsetWidth;
    popObj.style.top = getPos(dropDownCategory,"Top");
}

function hideBillCategory(dropDownObj, popObj)
{
    var cx = window.event.x;
    var cy = window.event.y;
    
    if (dropDownObj && popObj && popObj.style.display=='') {
      if ((document.body.scrollLeft + cx > dropDownObj.offsetLeft) 
          && (document.body.scrollLeft + cx < dropDownObj.offsetLeft + dropDownObj.offsetWidth) 
          && (document.body.scrollTop + cy > dropDownObj.offsetTop) 
          && (document.body.scrollTop + cy < dropDownObj.offsetTop + dropDownObj.offsetHeight)
          || (document.body.scrollLeft + cx > popObj.offsetLeft)                
          && (document.body.scrollLeft + cx < popObj.offsetLeft + popObj.offsetWidth) 
          && (document.body.scrollTop + cy > popObj.offsetTop)
          && (document.body.scrollTop + cy < popObj.offsetTop + popObj.offsetHeight)) {
      } else {
        popObj.style.display = 'none';
      }
    }
}

function loadAlarmInformation(){
    var categoryList = '<table width="100%" border="0" cellspacing="0" cellpadding="2">'+
                             '  <tr style="cursor:hand;"  onmouseover="doMouseOver2(this)" onmouseout="doMouseOut(this)">'+
                             '    <td bgcolor="#ffffff" height="20"> <div align="center"><IMG SRC="resource/image/indexImage/index1_55.gif" WIDTH=5 HEIGHT=5 ALT=""></div></td>'+
                             '    <td><nobr class="title"><a onClick="getAlarmList()">所有类别</a><nobr></td>'+
                             '  </tr>';
    billXmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    var actionUrl = "servlet/commonservlet?tag=3&code_type=ALARM_CLASS&orderby=sort_id";
    //alert(actionUrl); 
    billXmlhttp.open("POST", actionUrl,false);
    billXmlhttp.send("");
    dXML = billXmlhttp.responseXML;
    if(billXmlhttp!=null && billXmlhttp.readyState==4 && isSuccess(billXmlhttp)){
        oRows = dXML.selectNodes("/root/rowSet");
        iLen = oRows.length;
           for(var i=0;i<iLen;i++)
           {
               var categoryId = oRows[i].selectSingleNode("VALUE").text;
               var categoryName = oRows[i].selectSingleNode("TEXT").text;
               categoryList +='  <tr style="cursor:hand;" onmouseover="doMouseOver2(this)" onmouseout="doMouseOut(this)">'+
                              '    <td bgcolor="#ffffff" height="20"> <div align="center"><IMG SRC="resource/image/indexImage/index1_55.gif" WIDTH=5 HEIGHT=5 ALT=""></div></td>'+
                              '    <td><nobr class="title"><a onClick="getAlarmList('+categoryId+')">'+categoryName+'<a><nobr></td>'+
                              '  </tr>';
           }
    }
    categoryList += '</table>';
    popCategory.innerHTML = categoryList;
}


function hideSelf2(popObj)
{
    var cx, cy;
    cx = window.event.x;
    cy = window.event.y;
    if (popObj.style.display=='') {
        if ((document.body.scrollLeft + cx >= popObj.offsetLeft)                
        && (document.body.scrollLeft + cx <= popObj.offsetLeft + popObj.offsetWidth) 
        && (document.body.scrollTop + cy >= popObj.offsetTop)
        && (document.body.scrollTop + cy <= popObj.offsetTop + popObj.offsetHeight)) {
        } else {
          popObj.style.display = 'none';
        }
    }
}

function getTitle2(title)
{
    var titleStr = ellipsisOverText(title,44);
    return  titleStr;

}
//-------------告警信息结束------------



function getPos(el,sProp) 
{
    var iPos = 0;
    while (el!=null) {
        iPos+=el["offset" + sProp];
        el = el.offsetParent;
    }
    return iPos;
}


var oCurSelDiv=null;
function doMouseOver(oDiv) {oDiv.className="BtnOver";}
function doMouseOver2(oDiv) {oDiv.className="BtnOver2";}
function doMouseOut(oDiv) {if(oCurSelDiv!=oDiv) oDiv.className="Btn";}



//------------业务调度结束--------

// 知识库开始

function checkPrivilege()
{
    var actionUrl = "servlet/billInfoServlet?tag=3";
    xmlhttp.open("POST", actionUrl,false);
    xmlhttp.send("");
    if(isSuccess(xmlhttp))
    {
        return true;
    }
    return false;
}
//搜索引擎
function loadIndexDirectory()
{
    // (1). 载入索引库
    xmlhttp.open("POST", "servlet/searchEngineServlet?tag=6",false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        var dXML = xmlhttp.responseXML;
        var hasPrivilege = dXML.selectSingleNode("/root/HAS_PRIVILEGE").text;
        if(hasPrivilege=="true")
        {
            addOption(indexDirectory, "\"来源\"信息", "temp_index_directory");
            addOption(indexDirectory, "\"删除库\"信息", "delete_index_directory");
            addOption(indexDirectory, "\"全部\"信息", "");
        }
    }
    // (2). 载入来源
    xmlhttp.open("POST","servlet/searchEngineServlet?tag=7",false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        var dXML = xmlhttp.responseXML;        
        // (1-1). 默认索引库
        indexDirectory.value = dXML.selectSingleNode("/root/DEFAULT_INDEX_DIRECTORY").text;
        // (1-2). 载入模块
        var defaultModule = dXML.selectSingleNode("/root/DEFAULT_DATA_SOURCE").text;
        reloadModules(dXML, defaultModule);
    }
}

function addOption(oSelection, name, value)
{
    var oOption = document.createElement("OPTION");
    oOption.text = name;
    oOption.value = value;
    oSelection.add(oOption);
}

function loadModules(indexDir, defaultModule)
{
    xmlhttp.open("POST", "servlet/searchEngineServlet?tag=4&indexDirectory="+indexDir,false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        var dXML = xmlhttp.responseXML;
        reloadModules(dXML, defaultModule);
    }
}

function reloadModules(dXML, defaultModule)
{
    var oRows = dXML.selectNodes("/root/MODULES/MODULE");
    var oOption;
    var iLen = module.length;
    for(var i=iLen-1;i>=0;i--){
        module.options.remove(i);
    }
    if(oRows==null) {return;}    
    iLen = oRows.length;
    for(var i=0;i<iLen;i++)
    {
        oOption = document.createElement("OPTION");
        oOption.value = oRows[i].childNodes[0].text;
        oOption.text = oRows[i].childNodes[1].text;
        module.add(oOption);
    }
    
    oOption = document.createElement("OPTION");
    oOption.text = "-- 所有模块 --";
    oOption.value = "";
    module.add(oOption, 0);    
    if(defaultModule) module.value = defaultModule;
    else module.selectedIndex=0;
}

function searchEntrance()
{
    var queryString= document.getElementById("queryString").value.trimall();
    if(queryString.length==0||queryString=="知识库搜索")
    {
         MMsg("对不起，请输入搜索条件!");return;
    }
    var queryStr = encodeURIComponent(queryString);
    var indexDir = indexDirectory.value;
    openNormalWindow("workshop/searchEngine/search_entrance_result.htm?queryString="+queryStr+"&indexDirectory="+indexDir+"&module="+module.value+"&category=", "");
}

// 是否显示小窗口 修改
function isShowWin(){
    
    var staffId=staff_id;
    var boxValue;
    
    if(document.getElementById("mybox").checked==true){
        if(confirm('系统登录后，将不再显示右下角窗口。是否确认操作?')){
            boxValue=1;
            msgWin.close();
        }else{          
            return;
        }
    }else{
        if(confirm('系统登录后，将显示右下角小窗口。是否确认操作?')){
            boxValue=0;
            addMsg();
        }else{
            return;
        }
    }       
                                            
    var url='servlet/MainPageAction?action=10&staffId='+staffId+'&boxValue='+boxValue;
    xmlRequest.Open("POST",url,false); 
    xmlRequest.send();      
}

function getIsShowFlag(){
    var staffId=staff_id;
    var url='servlet/MainPageAction?action=12&staffId='+staffId;
    xmlRequest.Open("POST",url,false);
    xmlRequest.send();
    
    if (isSuccess(xmlRequest))  {
        var nodes = xmlRequest.responseXML.selectNodes("/root/rowSet");
        return  nodes[0].selectSingleNode("IS_SHOW_FLAG").text;
    }
    return "1";
}
function chagePswd()
{
    window.showModalDialog("workshop/user/changePw.html",window,"dialogWidth=408px;dialogHeight=222px;help=0;scroll=0;status=0;");
}
function editStaff()
{
    window.showModalDialog("workshop/user/individualInfo.jsp?tag=1",null,"dialogWidth=580px;dialogHeight=540px;help=0;scroll=0;status=0;");
}



//统计代办个数
function pendingListCount()
{
    var d = ResultFactory.newResult("HLJ_INDEX_PAGE_TO_DO_TYPE_NUM");
    d.onLoad=function(oXML){
        var oRows = oXML.selectNodes('/root/rowSet');
        var total_count=parseInt(oRows[0].childNodes[0].text)+parseInt(oRows[0].childNodes[1].text)+parseInt(oRows[0].childNodes[2].text)+parseInt(oRows[0].childNodes[3].text)+parseInt(oRows[0].childNodes[4].text)+parseInt(oRows[0].childNodes[8].text);
        document.getElementById("total_count").innerHTML = '待办('+total_count+')';
        document.getElementById("attentionFlow1").innerHTML = '本人关注('+oRows[0].childNodes[8].text+')';
        document.getElementById("dailyRunFlow1").innerHTML = '日常运营管理类流程('+oRows[0].childNodes[0].text+')';
        document.getElementById("requireFlow1").innerHTML = '&nbsp;需求类流程('+oRows[0].childNodes[1].text+')&nbsp;';
        document.getElementById("alarmPage1").innerHTML = '&nbsp;告警('+oRows[0].childNodes[2].text+')&nbsp;';
        document.getElementById("maintenWorkPage1").innerHTML = '&nbsp;维护作业('+oRows[0].childNodes[3].text+')&nbsp;';
        document.getElementById("othersPage1").innerHTML = '&nbsp;其他('+oRows[0].childNodes[4].text+')&nbsp;';
        document.getElementById("waitRead").innerHTML = '阅办('+oRows[0].childNodes[5].text+')';
        document.getElementById("followNum").innerHTML = '本人发起('+oRows[0].childNodes[7].text+')';
        
        
        
        document.getElementById("attentionReadPageFlow1").innerHTML = '本人关注('+oRows[0].childNodes[10].text+')';
        document.getElementById("otherReadPageFlow1").innerHTML = '其他阅办('+oRows[0].childNodes[5].text+')';
        document.getElementById("waitRead").innerHTML = '阅办('+(parseInt(oRows[0].childNodes[5].text)+parseInt(oRows[0].childNodes[10].text))+')';
        
        document.getElementById("attentionPageedFlow1").innerHTML = '本人关注('+oRows[0].childNodes[9].text+')';
        document.getElementById("otherPageedFlow1").innerHTML = '其他已办('+oRows[0].childNodes[6].text+')';
        document.getElementById("hasDeal").innerHTML = '已办('+(parseInt(oRows[0].childNodes[6].text)+parseInt(oRows[0].childNodes[9].text))+')';
        
    };
    d.async=false;
    d.send(Result.FORCE_GET,null);
}


function doReplaceURL_ah(sSecondPageURL,mainLoadUrl,menuId,moduleId)
{
    top.window.location.replace(sSecondPageURL+"?id="+moduleId+"&mainUrl="+encodeURIComponent(mainLoadUrl)+"&menuId="+menuId);
}


function  quickSet(){
   if(hasFlag){
       if(quickNum>=20){
          alert("快速通道只显示20个,设置时候，请适当增减");
       }
       fnav.open();
   }
}

//显示新建流程
function showFrame(src,width,height,top){
	getObj("mask_div").style.height =  document.body.scrollHeight;
	getObj("mask_div").style.display="block";//遮罩层
	obj = getObj("FLOW_FRAME_DIV");
	obj.style.top = top?top:60;
	obj.style.width = width;
	obj.style.height = height;
	obj.style.left = (document.body.clientWidth-obj.style.pixelWidth)/2; 
	obj.style.display = "block";
	getObj("flowFrame").src = src;
}

function getObj(id){
	return document.getElementById(id);
}