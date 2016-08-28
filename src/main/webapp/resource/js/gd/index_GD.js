
function initData() {
	//加载菜单
	loadMenu();
	
	
	//addMsg();
	//setInterval('addMsg()',$getSysVar('REFRESH_TIME'));
	openWinLeft = (screen.width - openWinWidth)/2;
	openWinTop = (screen.height - openWinHeight)/2;
	openWinParames = 'height='+openWinHeight
				   + ',width='+openWinWidth
				   + ',top='+openWinTop
				   + ',left='+openWinLeft;
	window.setTimeout("document.getElementById('boardInfo').src = 'workshop/board/boardScroll.htm'",10);
//	setLink();
	//-- 使用业务部门首页的待办框 right.js --//
	Global.oPendingEllipsisLength = 94;
	Global.oDefaultEllipsisLength = 66;
	loadPended(pendedUL,false);//已办理
	loadReading(readingUL,false);//待阅
	loadReaded(readedUL,false);//已阅
	loadFocus(false);//关注
	loadPending(pendingUL,true);//待办
	//window.setInterval("refPendRead()",60000);
	//-- 使用业务部门首页的待办框 right.js --//
	loadBillInfos();
///	loadRoles();
	loadFucusOn();
}




//加载菜单
var reloc_id = [];
var reloc_url =[];
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
                retMenuHtml += "    <li class='noBorderLi'><a href='#' "+openUrl+" class='hasDomRight'>&nbsp;"+privilegeName+"</a>";
            }else{
                retMenuHtml += "    <li class='noBorderLi'><a href='#' "+openUrl+">&nbsp;"+privilegeName+"</a>";
            }
        }else{
            if(cUlMenuItemList.length>0){
                retMenuHtml += "    <li><a href='#' "+openUrl+" class='hasDomRight'>&nbsp;"+privilegeName+"</a>";
            }else{
                retMenuHtml += "    <li><a href='#' "+openUrl+">&nbsp;"+privilegeName+"</a>";
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
    location.replace("indexFrame_GD.jsp?mainUrl="+encodeURIComponent(url));
   // location.replace(encodeURIComponent(url));
}




















function openPending(aPending) {
		if(!aPending || typeof(aPending)=='undefined'){
			return;
		}
	   	var selectedRows = aPending.PENDING_ID;
	   	var type = aPending.TASK_OR_EVENT;
	   	var event_type_id = aPending.PENDING_TYPE; //取得表单类型
	   	var content_id = aPending.CONTENT_ID;//取得流程或者环节标识
	   	var isBindForm = aPending.ISBINDFORM;//取得是否有绑定表单
	   	var send_url = aPending.SEND_URL; //取得待办打开的链接
	   	if(send_url.indexOf('/')!=0){
	   		send_url = '/'+send_url;
	   	}
	   	var curr_window;
	  	x=(window.screen.width-780)/2;
	  	y=(window.screen.height-560)/2;
	  	var thetype = aPending.THETYPE;
	  	if(thetype==01||thetype==03){
	  		//curr_window=window.open('/WorkAccept?type='+type+'&id='+selectedRows,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		//待办修改为点击直接打开表单界面，已启动也不先打开流转过程图 jiangmt 20100517
	  		if(event_type_id=="3"){//已启动
	  			if(isBindForm=="0")//无表单流程
	  				curr_window=window.open('/FlowBrowse?flow_id=' +content_id+'&system_code=G',content_id,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  			else
	  				curr_window=window.open(send_url,content_id,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}else if (event_type_id=="2"){//待办
	  			if(isBindForm=="0")//无表单流程
	  				curr_window=window.open('/TacheExec?tch_id=' +content_id+'&system_code=G',content_id,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  			else
	  				curr_window=window.open(send_url,content_id,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}
	  		else{
	  			curr_window=window.open(send_url,content_id,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}
	  	}else{
	  		//curr_window=window.open('/OtherWorkAccept?type='+type+'&id='+selectedRows,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
		  	if(event_type_id=="0" || event_type_id=="1" || event_type_id=="2"
		  		|| event_type_id=="3" || event_type_id=="g" || event_type_id=="H"){//这几个类型有走 流程在待办的已处理事务里直接打开流程图
	  			curr_window=window.open('/FlowBrowse?flow_id=' +content_id+'&system_code=G',content_id,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}
	  		else{
	  			curr_window=window.open('/OtherWorkAccept?type='+type+'&id='+selectedRows,content_id,'scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		}
	  	}
	  	curr_window.focus();
}

function clearPendingBox(ulObj) {
	if (ulObj) {
		for (var j = ulObj.childNodes.length - 1; j>=0; j--) {
			ulObj.removeChild(ulObj.childNodes[j]);
		}	
	}
}

function showBillInfoWindow(tag, billInfoId)
{
    var openWin = displayMaxWindowWithHandle("/workshop/info/billInfoContent.htm?billInfoId="+billInfoId,"", true);
    openWin.attachEvent('onunload', function(){loadBillInfos();});
}

/***
function displayMaxWindow(url, name, isCheckPrivilege)
{
    displayMaxWindowWithHandle(url, name, isCheckPrivilege);
}
***/

function displayMaxWindowWithHandle(url, name, isCheckPrivilege)
{
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

function searchEntrance() {
    queryString.value = queryString.value.trimall();
    var queryInput = queryString.value;
    if(queryInput.length==0)
    {
		MMsg("对不起，请输入搜索条件!");return;
    }
    var queryStr = encodeURIComponent(queryString.value);
    var indexDir = "publish_index_directory";
    openNormalWindow("/workshop/searchEngine/search_entrance_result.htm?queryString="+queryStr+"&indexDirectory="+indexDir+"&module=knowledge&category=", "");
}

function more_msg() {
	window.open("/MoreMessagePage.html",'MoreMsgWin',openWinParames);
}

function editStaff() {
	window.showModalDialog("/workshop/user/individualInfo.jsp?tag=1",null,"dialogWidth=500px;dialogHeight=566px;help=0;scroll=0;status=0;");
}

function addMsg()
{
	unDoXmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	unDoXmlhttp.open("post","servlet/UnReadAction?action=0",true);
	unDoXmlhttp.onreadystatechange = addMsgDetails;
	unDoXmlhttp.send();
}
var count = 0;
function addMsgDetails()
{
	if(unDoXmlhttp!=null && unDoXmlhttp.readyState==4)
	{
		if(count == 0){
			msgWin = new MsgWin();
			if(msgWinHeight!=null && msgWinHeight!="")
				msgWin.height=msgWinHeight;
			if(msgWinWidth!=null && msgWinWidth!="")
				msgWin.width=msgWinWidth;
		}
		var isShow = true;
		var outHTML = '<div style="width:100%;height:100%;padding:10px 10px 0px 10px">';
		var oErrCodeNode = unDoXmlhttp.responseXML.selectSingleNode("/root/error_code");
		if(oErrCodeNode.text == 0)
		{
			outHTML +=  '<div>'
					+	  '<span style="font-weight:bold">尊敬的' + name + '同仁，您目前有:</span>'
					+   '</div>';
					var uodoNodeList = unDoXmlhttp.responseXML.selectNodes("/root/UNDO_COUNT");
					var uodoNodeListLength=uodoNodeList.length;
					if(uodoNodeListLength == 0)
					{
						isShow = false;
					}
					else
					{
						for(var i=0;i<uodoNodeListLength;i++)	
						{
							outHTML +=   '<div style="margin:8px 0px 0px 6px">'
									+	  '<a href="'+uodoNodeList[i].getAttribute("link")+'"  target="_blank"><span style="color:red;font-weight:bold">'+uodoNodeList[i].text+'</span>'
									+	  '<span style="color:#1F336B;margin-left:3px;">'+uodoNodeList[i].getAttribute("name")+';</span></a>'
									+	'</div>';
						}
						if(count == 0){
							if(uodoNodeListLength-3>0)
							{
								msgWin.height+=(uodoNodeListLength-3)*25;
								msgWin.contentHeight+=(uodoNodeListLength-3)*25;
							}
						}
					}
		}
		else
		{
			outHTML = oErrCodeNode.nextSibling.text;
		}
		outHTML += '</div>'
		unDoXmlhttp = null;
		if(isShow)
		{
			if(count ==0)
				msgWin.show(outHTML,msgWinPosition);
			else{
				if(document.getElementById('UNDO_WIN_STATE').getAttribute('class')!=0)
					document.getElementById('refresh').innerHTML = outHTML;
			}
			count++;
		}
	}
}

function setLink()
{
	var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
	var mainPageUrl = 'servlet/MainPageAction?';
	var reqParams = new Array('action=0');
	xmlRequest.Open("POST",mainPageUrl+reqParams.join('&'),false);
	xmlRequest.send();
	if(isSuccess(xmlRequest))
	{
		var linkUL;
		var linkLI;
		var linkImg;
		var linkVal;
		var linkTitle;
		var workLinks = xmlRequest.responseXML.selectNodes("/root/rowSet[LINK_TYPE='A'||LINK_TYPE='B']");
		for(var i=0;i<workLinks.length;i++)
		{
			linkImg = getNodeValue(workLinks[i],'LINK_IMG');
			linkVal = getNodeValue(workLinks[i],'LINK_VALUE');
			linkTitle = getNodeValue(workLinks[i],'LINK_TITLE')
			linkTitle = linkImg!=null&&linkImg!='undefined'&&linkImg!=''?"<img src='" + linkImg + "' alt='" + linkTitle + "' border='0'>":linkTitle; 
			
			linkUL = document.getElementById("links");
			linkLI = document.createElement("li");
			linkLI.innerHTML = '<a href="' + linkVal + '">' + linkTitle + '</a>';
			linkUL.appendChild(linkLI);
		}
		
	}
}

function loadBillInfos(categoryId) {//isLoadCategory,
    billXmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    var actionUrl = "/servlet/billInfoServlet?tag=1&recent=8";//isLoadCategory = eval(isLoadCategory);
    if(categoryId!=null) {actionUrl += "&categoryId="+categoryId;}
	billXmlhttp.open("POST", actionUrl,true);
	billXmlhttp.onreadystatechange = loadBillInfoDetails;
    billXmlhttp.send("");
}

function loadBillInfoDetails() {
	if(billXmlhttp!=null && billXmlhttp.readyState==4 && isSuccess(billXmlhttp)) {
		var dXML = billXmlhttp.responseXML;
		var oRows = dXML.selectNodes("/root/BILL_INFOS/rowSet");
		var ul,li,billInfosId,billInfosTitle,submitDate;
		ul = document.getElementById("billInfosUL");
		
		clearUL(ul);
		for (var i=0; i<oRows.length; i++) {
			billInfosId = oRows[i].selectSingleNode("BILL_INFO_ID").text;
			billInfosTitle = oRows[i].selectSingleNode("TITLE").text;
			submitDate = oRows[i].selectSingleNode("SUBMIT_DATE").text;
			li = document.createElement("li"); 
			li.innerHTML = "<a href='javascript:showBillInfoWindow(3,&#039;" 
								+ billInfosId + "&#039;);' title='" + billInfosTitle + "'>" 
								+ "<div class='it_news_box_con_left'>" + ellipsisOverText(billInfosTitle, 70, true) + "</div>"
								+ "<div class='it_news_box_con_right'>[ " + submitDate +" ]</div>"
								+ "</a>";
			ul.appendChild(li);
		}
    }	
}

function clearUL(ulObj) {
	if (ulObj) {
		for (var j = ulObj.childNodes.length - 1; j>=0; j--) {
			ulObj.removeChild(ulObj.childNodes[j]);
		}	
	}
}

//截取字符串 包含中文处理 
//(串,长度,增加...) 
function ellipsisOverText(str, len, hasDot) { 
    var newLength = 0; 
    var newStr = ""; 
    var chineseRegex = /[^\x00-\xff]/g; 
    var singleChar = ""; 
    var strLength = str.replace(chineseRegex,"**").length;
    if (str == "") {
    	return "&nbsp;";
    }
    for(var i = 0;i < strLength;i++) { 
        singleChar = str.charAt(i).toString(); 
        if(singleChar.match(chineseRegex) != null) { 
            newLength += 2; 
        }     
        else { 
            newLength++; 
        } 
        if(newLength > len) { 
            break; 
        } 
        newStr += singleChar; 
    } 
     
    if(hasDot && strLength > len) { 
        newStr += "..."; 
    } 
    return newStr; 
}
function chagePswd()
{
	window.showModalDialog("workshop/user/changePw.html",window,"dialogWidth=408px;dialogHeight=222px;help=0;scroll=0;status=0;");
}
//登录数据稽核系统
function loginAuditSystem(){
	var sendParams = ['username='+userName,'key='+ encodeKey];
	displayMaxWindowWithHandle(getSendUrl($getSysVar("AUDIT_SYSTEM_URL")+'?',sendParams));
}

function setFlowRead(obj){
	document.getElementById("pending").className='dbTitleDef_R';
	document.getElementById("pended").className='dbTitleDef_R';
	document.getElementById("reading").className='dbTitleDef_R';
	document.getElementById("readed").className='dbTitleDef_R';
	document.getElementById("focus").className='dbTitleDef_R';
	obj.className='dbTitleSel';
}

//linjl 待办列表内容页面切换
function changeContentTab(obj){
	obj.style.display = "block";
	var object = document.getElementById("beHandList");
	object = object.getElementsByTagName("ul");
	for(var i=0;i<object.length;i++){
		//alert("object[i].id="+object[i].id);
		if(obj.id!=object[i].id){
			object[i].style.display = "none";
		}
	}
}

//显示收藏夹
function showFav(oElement)
{
    var iRight=oElement.getBoundingClientRect().right+document.body.scrollLeft;
    var iTop=oElement.getBoundingClientRect().bottom+document.body.scrollTop;
    oFavorites.style.display="";
    oFavorites.left=iRight-oFavorites.width;
    oFavorites.top=iTop;
	showFavoritesTree(oFavorites.getElementById("oFavDiv"));
	favorites_tree.isCallPage = 'index.jsp'
}

//显示角色面板
function showRole(oElement)
{
    /***
    var iRight=oElement.getBoundingClientRect().right+document.body.scrollLeft;
    var iTop=oElement.getBoundingClientRect().bottom+document.body.scrollTop;
    rolePanel.style.display="";
    rolePanel.left=iRight-oFavorites.width;
    rolePanel.top=iTop;
    ***/
    roleDiv.style.position="absolute"; 
    roleDiv.style.top = oElement.getBoundingClientRect().bottom+document.body.scrollTop;
    roleDiv.style.left = oElement.getBoundingClientRect().left+document.body.scrollLeft;
    roleDiv.style.display = "block";
}


//选择角色
function chooseRole(roleid){
    role_id = roleid;
	addTopMenu(roleid,oMenuBar,10);
	roleDiv.style.display="none";
}

//设置默认角色
function setDefaultRole(){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var actionUrl = "/servlet/GdCommonRequest?tag=2&role_id="+role_id;//isLoadCategory = eval(isLoadCategory);
	roleXmlhttp.open("POST", actionUrl,false);
	roleXmlhttp.send("");
	roleDiv.style.display="none";
}

//初始化角色列表
function loadRoles(){
	roleXmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    var actionUrl = "/servlet/GdCommonRequest?tag=1";//isLoadCategory = eval(isLoadCategory);
	roleXmlhttp.open("POST", actionUrl,true);
	roleXmlhttp.onreadystatechange = initRoleDiv;
    roleXmlhttp.send("");
}

//初始化角色div
function initRoleDiv(){
	if(roleXmlhttp!=null && roleXmlhttp.readyState==4 && isSuccess(roleXmlhttp)) {
		var dXML = roleXmlhttp.responseXML;
		var oRows = dXML.selectNodes("/root/rowSet");
		var ROLE_ID,ROLE_NAME,PARENT_PRIVILEGE_ID,STATE,REMARK,IS_DEFAULT;
		var chooseDefault = '0';
		var htmlStr = '';  
		for (var i=0; i<oRows.length; i++) {
		    // A.ROLE_ID,A.ROLE_NAME,A.PARENT_PRIVILEGE_ID,A.STATE,REMARK
			ROLE_ID = oRows[i].selectSingleNode("ROLE_ID").text;
			ROLE_NAME = oRows[i].selectSingleNode("ROLE_NAME").text;
			//PARENT_PRIVILEGE_ID = oRows[i].selectSingleNode("PARENT_PRIVILEGE_ID").text;
			STATE = oRows[i].selectSingleNode("STATE").text;
			REMARK = oRows[i].selectSingleNode("REMARK").text;
			IS_DEFAULT = oRows[i].selectSingleNode("IS_DEFAULT").text;
			htmlStr += '<input id="roleId_'+ROLE_ID+'" type="radio" name="role" value="'+ROLE_ID+'" onclick="chooseRole('+ROLE_ID+')" />';
			htmlStr += '<span id="roleName_'+ROLE_ID+'">'+ROLE_NAME+'</span>';
			htmlStr += '<br />';
			if(IS_DEFAULT == '0BT'){
				chooseDefault = ROLE_ID;
				role_id = ROLE_ID;
			}
		}
		document.getElementById("roleDiv").innerHTML = htmlStr + document.getElementById("roleDiv").innerHTML;
		document.getElementById("roleId_"+chooseDefault).checked = true;
		addTopMenu(document.getElementById("roleId_"+chooseDefault).value,oMenuBar,10);
    }	
}

//分配角色
function roleGrant(){
    var params = new Array();
	var state = window.showModalDialog("roleGrant.jsp",params,"dialogWidth=500px;dialogHeight=320px;help=0;scroll=1;status=0;");
	
}


/*********** linjl 2012-3-30 **********/
/**************************************/
var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
var objDom = new ActiveXObject("Microsoft.XMLDOM");
var actionUrl = "../../../servlet/GdCommonRequest?";

//待办栏右键菜单
var activeFocus; //右键当前关注目标
var url;
var label;
function rightAction(obj){
  	if(event.button==2){
		if(obj.id=='focus_Pendding'||obj.id=='focus_Pended'){
		var selectedRows = obj.PENDING_ID;
	   	var type = obj.TASK_OR_EVENT;
	   	var event_type_id = obj.PENDING_TYPE; //取得表单类型
	   	var content_id = obj.CONTENT_ID;//取得流程或者环节标识
	   	var isBindForm = obj.ISBINDFORM;//取得是否有绑定表单
	   	var send_url = obj.SEND_URL; //取得待办打开的链接
	   	var rsUrl = null;
	   	if(send_url.indexOf('/')!=0){
	   		send_url = '/'+send_url;
	   	}
	  	var thetype = obj.THETYPE;
	  	if(thetype==01||thetype==03){
	  		//待办修改为点击直接打开表单界面，已启动也不先打开流转过程图 jiangmt 20100517
	  		if(event_type_id=="3"){//已启动
	  			if(isBindForm=="0")//无表单流程
	  				rsUrl = '/FlowBrowse?flow_id=' +content_id+'&system_code=G';
	  			else
	  				rsUrl = send_url;
	  		}else if(event_type_id=="2"){//待办
	  			if(isBindForm=="0")//无表单流程
	  				rsUrl = '/TacheExec?tch_id=' +content_id+'&system_code=G';
	  			else
	  				rsUrl = send_url;
	  		}else{
	  			rsUrl = send_url;
	  		}
	  	}else{
		  	if(event_type_id=="0" || event_type_id=="1" || event_type_id=="2"
		  		|| event_type_id=="3" || event_type_id=="g" || event_type_id=="H"){//这几个类型有走 流程在待办的已处理事务里直接打开流程图
	  			rsUrl ='/FlowBrowse?flow_id=' +content_id+'&system_code=G';
	  		}else{
	  			rsUrl = '/OtherWorkAccept?type='+type+'&id='+selectedRows;
	  		}
	  	}
		}else if(obj.id=='focus_Readding'||obj.id=='focus_Readed'
			||obj.id=='focus_job'||obj.id=='focus_on'){
			rsUrl = obj.URL;
		}
		url = rsUrl;
		label = obj.title;
		//控制菜单权限
		objDom.loadXML("<?xml version=\"1.0\" ?><root><label>"
			+label+'</label><url><![CDATA['+url+']]></url></root>');
		xmlHttp.open("POST",actionUrl+"tag=5&action=1",false);
		xmlHttp.send(objDom);
		var rsXml = xmlHttp.responseXML;
		if(rsXml.selectSingleNode("/root/rowSet/COUNTS").text=='0'){
			oMenu.setItemDisable("1");
		}else{
			oMenu.setItemDisable("0");
		}
  		oMenu.show();
  	}
}

//待办帅选
function pendingSort(oElement){
	var prvObj = document.getElementsByName("pendSort_Ckb");
    xmlHttp.open("POST",actionUrl+"tag=5&action=8",false);
    xmlHttp.send();
    var rsXml = xmlHttp.responseXML;
    try{
    var obj = rsXml.selectNodes("/root/rowSet");
    var innerHtm = '<ul id="pendSort_Ul" style="list-style-type:none;margin-bottom:3px">';
    for(var i=0;i<obj.length;i++){
    	var state = obj[i].selectSingleNode("STATE").text;
    	var desc = obj[i].selectSingleNode("STATE_DESC").text;
    	if(isCheck(prvObj,state)){
    		innerHtm += '<li><input type="checkbox" name="pendSort_Ckb" value="'+state+'" checked=true />'+desc+'</li>';
    	}else{
    		innerHtm += '<li><input type="checkbox" name="pendSort_Ckb" value="'+state+'" />'+desc+'</li>';
    	}
    }
    innerHtm += '</ul>';
    innerHtm += '<hr style="margin-top:0px;margin-right:5px;margin-left:5px;"/>'
		+'<div style="margin-right:5px;margin-top:0;margin-bottom:3px" align="right">'
		+'<span style="cursor:hand;margin-right:8px" onmouseover="this.style.color=\'red\'" onmouseout="this.style.color=\'black\'" onClick="qryPendSort()">确定</span>'
		+'<span style="cursor:hand;margin-right:2px" onmouseover="this.style.color=\'red\'" onmouseout="this.style.color=\'black\'" onClick="sortDiv.style.display=\'none\'">取消</span>';
    sortDiv.innerHTML = innerHtm;
    }catch(e){}
    sortDiv.style.position="absolute"; 
    sortDiv.style.top = "193px";
    sortDiv.style.left = oElement.getBoundingClientRect().left+document.body.scrollLeft;
    sortDiv.style.display = "block";
}

//首页待办帅选查询
function qryPendSort(){
    var obj = document.getElementsByName("pendSort_Ckb");
    var eventTypes = new Array();
    for(var i=0;i<obj.length;i++){
    	if(obj[i].checked){
    		eventTypes.push(obj[i].value);
    	}
    }
    eventTypes = eventTypes.join(",");
	loadPending(pendingUL,true,eventTypes);    
    sortDiv.style.display = "none";
}

function isCheck(obj,value){
	var state = false;
	for(var i=0;i<obj.length;i++){
		if(obj[i].checked&&obj[i].value==value){
			state = true;
		}
	}
	return state;
}

//清楚筛选项
function cleanSortPend(){
	var obj = document.getElementById("pendSort_Ul");
	if(obj!=null&&typeof(obj)!='undefined'){
		clearUL(pendSort_Ul);
	}
}

//初始化checkBox
function initCheckBox(objName,key,val){
	//var obj = sortPanel.getElementById(objName+"_"+key);
	var obj = document.getElementById(objName+"_"+key);
	if(val=='T'){
		obj.checked = true;
	}
}

//获取checkBox值
function getCheckBox(objName){
	//var obj = sortPanel.getElementById(objName);
	var obj = document.getElementById(objName);
	if(obj.checked){
		return 'T';
	}else{
		return 'F';
	}	
}

var recodes = 0;
//加载关注
function loadFocus(isActive){
	cleanSortPend();
	clearUL(focusUL)
	xmlHttp.open("POST",actionUrl+"tag=5&action=2",false);
	xmlHttp.send();
	var rsXml = xmlHttp.responseXML;
	var objs = rsXml.selectNodes("/root/rowSet");
	var aPendingLI;
	if(objs.length==0){
		aPendingLI = document.createElement("span");
		aPendingLI.innerHTML = '<b>您当前无[关注]信息!</b>';
		focusUL.appendChild(aPendingLI);
		document.getElementById("focusCount").innerHTML 
			= "<font style='font-size:11px;'>(0)</font>";
	}else{
		for(var i=0;i<objs.length;i++) {
			var label = objs[i].selectSingleNode("LABEL").text;
			var url = objs[i].selectSingleNode("URL").text;
			aPendingLI = document.createElement("li");
			aPendingLI.innerHTML = '<a href="#" id="focus_on" onclick=doWindow_open(\''
				+ url +'\') onmousedown="rightAction(this)" '
				+ 'title="' + label + '" ' 
				+ 'URL=\''+ url +'\' >'
				+ '<div class="pending_box_con_right_title"><NOBR>' 
				+ label + '</NOBR></div>'
				+ '</a>';
			focusUL.appendChild(aPendingLI);
		}
	    document.getElementById("focusCount").innerHTML 
	    	= "<font style='font-size:11px;color:red'>("+objs.length+")</font>";
	}
	if(isActive){
		changeContentTab(focusUL);
		activeBtn('focus');
	}
	//window.setTimeout("lazyLoad("+isActive+")",1000);
}

//延迟加载
function lazyLoad(isActive){
	var counts = focusUL.getElementsByTagName("li").length;
	if(recodes=='0'){
		focusCount.innerHTML = "<font style='font-size:11px;'>(0)</font>";
		if(isActive){
			changeContentTab(focusUL);
		}
	}else{
		focusCount.innerHTML = "<font style='font-size:11px;color:red'>("+recodes+")</font>";
	}

	if(isActive){
		activeBtn('focus');
	}
}

//保存关注 action 1:加入关注 0:取消关注
function savaFocus(action){
	/***
	var objDom = new ActiveXObject("Microsoft.XMLDOM");
	objDom.loadXML("<?xml version=\"1.0\" ?><root><label>"
		+label+"</label><url><![CDATA["+url+"]]></url></root>");
	***/
	if(action==1){
		xmlHttp.open("POST",actionUrl+"tag=6&action=add",false);
		xmlHttp.send(objDom);
		if(isSuccess(xmlHttp)){
			MMsg("已经关注!");
			window.location.reload();
		}else{
			EMsg("关注失败!");
		}
	}else if(action==0){
		xmlHttp.open("POST",actionUrl+"tag=6&action=del",false);
		xmlHttp.send(objDom);
		if(isSuccess(xmlHttp)){
			MMsg("已取消关注!");
			window.location.reload();
		}else{
			EMsg("取消关注失败!");
		}
	}
}

//待办维护作业执行查询
function openJobExec(obj){
	var x = (window.screen.width-780)/2;
	var y = (window.screen.height-560)/2;
	/***
	var url = "../../../workshop/maintjobplan/itemResultSearch.html?";
	var param = new Array();
	param.push("maintjobid="+obj.MAINTANCE_JOB_ID);
	param.push("jobname="+obj.TITLE);
	param.push("start_date="+getSysdate('sysdate-8'));
	param.push("qry_type=job_pendding");
	***/
	var url = obj.SERVER_URL;
	window.open(url,null,'scrollbars=yes,width=780,height=560,top='
		+y+',left='+x+',resizable=yes');
}

function getSysdate(date){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	if(date==""||date == null){
		date = "sysdate";
	}
	xmlhttp.Open("POST","/servlet/jobiteminstanceservlet?tag=12&sysdate="+date,false);
	xmlhttp.send();
	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	dXML.load(xmlhttp.responseXML);
	var element = dXML.selectSingleNode("/root/rowSet");
	var sysdate = element.selectSingleNode("VALUE").text;
    return sysdate;
}

//加载重点关注配置
function loadFucusOn(){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("POST",actionUrl+"tag=9",false);
	xmlhttp.send();
	var obj = xmlhttp.responseXML;
	var nodes = obj.selectNodes("/root/rowSet");
	var innerHtml = '<div>';
	innerHtml += '	<table width="100%" height="25px" align="center" border="0" cellspacing="0" cellpadding="0">';
	innerHtml += '		<tr>';
	innerHtml += '			<td style="width:10px;" class="dbTitleBl">&nbsp;</td>';
	innerHtml += '			<td class="dbTitleSel">重点关注</td>';
	innerHtml += '			<td class="dbTitleBl">&nbsp;</td>';
	innerHtml += '		</tr>';
	innerHtml += '	</table>';
	innerHtml += '</div>';
	
	innerHtml += '<div class="side_con boardInfo">';
	innerHtml += '<table border="0" cellspacing="2" cellpadding="0" width="95%" align="center">'; 
	
	for(var i=0;i<nodes.length;(i=i+2)){
		var label = nodes[i].selectSingleNode("LINK_TITLE").text;
		var url = nodes[i].selectSingleNode("LINK_URL").text;
		var img = nodes[i].selectSingleNode("LINK_IMG").text;
		innerHtml += '<tr>';
		/***
	    innerHtml += '<td><a onclick="'+url+'" class="ni_RWD" href="javascript:void(0);">'
	              +'<img src="'+img+'" style="width:56px;hight:56px;margin-right:3px;float:left;" align="middle" /><font style="font-weight:bold;font-size:11px;height:56px;line-height:56px;position:absolute">'
	              +label+'</font></a></td>';
	              ***/
	    innerHtml += '<td><a onclick="'+url+'" class="ni_RWD" href="javascript:void(0);">'
	              +'<img src="'+img+'" style="width:56px;hight:56px;" align="middle" /></a></td>';
	    innerHtml += '<td><a onclick="'+url+'" class="ni_RWD" href="javascript:void(0);"><font style="font-weight:bold;font-size:11px;">'+label+'</font></a></td>';
		try{
			 /***
			 innerHtml += '<td><a onclick="'+nodes[i+1].selectSingleNode("LINK_URL").text+'" class="ni_RWD" href="javascript:void(0);">'
	              +'<img src="'+nodes[i+1].selectSingleNode("LINK_IMG").text+'" style="width:56px;hight:56px;margin-right:3px;float:left;" align="middle"/><font style="font-weight:bold;font-size:11px;height:56px;line-height:56px;position:absolute">'
	              +nodes[i+1].selectSingleNode("LINK_TITLE").text+'</font></a></td>';
			***/
			innerHtml += '<td><a onclick="'+nodes[i+1].selectSingleNode("LINK_URL").text+'" class="ni_RWD" href="javascript:void(0);">'
	              +'<img src="'+nodes[i+1].selectSingleNode("LINK_IMG").text+'" style="width:56px;hight:56px;" align="middle"/></a></td>';
			innerHtml += '<td><a onclick="'+nodes[i+1].selectSingleNode("LINK_URL").text+'" class="ni_RWD" href="javascript:void(0);"><font style="font-weight:bold;font-size:11px;">'+nodes[i+1].selectSingleNode("LINK_TITLE").text+'</font></a></td>';
		}catch(e){
			innerHtml += '<td></td>';
		}
		innerHtml += '</tr>';
	}
	innerHtml += '<tr><td colspan="2" height="10px"></td></tr> ';
	innerHtml += '</table>';
	innerHtml += '</div>';
	if(nodes.length>0){
		document.getElementById("focusOn").innerHTML = innerHtml;
	}else{
		document.getElementById("focusOn").style.display = "none";
	}
}

//验证重点关注页面访问权限
function displayMaxWindow(url,obj,state) {
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
    //判断是否有菜单权限
    var sendXml = new ActiveXObject("Microsoft.XMLDOM");
    sendXml.loadXML("<?xml version=\"1.0\" ?><root><url><![CDATA["+url+"]]></url></root>");
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("POST",actionUrl+"tag=5&action=5",false);
	xmlhttp.send(sendXml);
    var obj = xmlhttp.responseXML;
    if(getCurrentStaffId()=='1'||parseInt(obj.selectSingleNode("/root/rowSet/COUNTS").text)>0){
    	window.open(url,null,sFeatures.join(","));
    }else{
    	EMsg("对不起，您没有相应功能的使用权限，请联系系统管理员！");
    }
}



