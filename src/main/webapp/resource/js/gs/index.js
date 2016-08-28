function initData() {
	//加载菜单
	loadMenu();
	
	addMsg();
	setInterval('addMsg()',$getSysVar('REFRESH_TIME'));
	
	//addTopMenu(-1,oMenuBar,10);
	openWinLeft = (screen.width - openWinWidth)/2;
	openWinTop = (screen.height - openWinHeight)/2;
	openWinParames = 'height='+openWinHeight
				   + ',width='+openWinWidth
				   + ',top='+openWinTop
				   + ',left='+openWinLeft;
				   
	window.setTimeout("document.getElementById('boardInfo').src = 'workshop/board/boardScroll.htm'",10);
	setLink();
	
	//-- 使用业务部门首页的待办框 right.js --//
	Global.oPendingEllipsisLength = 94;
	Global.oDefaultEllipsisLength = 66;
	loadPending();
	window.setInterval(loadPending, 60000);
	//-- 使用业务部门首页的待办框 right.js --//
	
	loadBillInfos();
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

function displayMaxWindow(url, name, isCheckPrivilege)
{
    displayMaxWindowWithHandle(url, name, isCheckPrivilege);
}

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
	var reqParams = new Array('action=2');
	xmlRequest.Open("POST",mainPageUrl+reqParams.join('&'),false);
	xmlRequest.send();
	if(isSuccess(xmlRequest))
	{
		var linkUL = document.getElementById("links");
        linkUL.innerHTML = '';
		var linkLI;
        var checked;
		var linkImg;
		var linkVal;
		var linkTitle;
		var workLinks = xmlRequest.responseXML.selectNodes("/root/rowSet[CHECKED='1']");
		for(var i=0;i<workLinks.length;i++)
		{
				linkImg = getNodeValue(workLinks[i],'LINK_IMG');
				linkVal = getNodeValue(workLinks[i],'LINK_VALUE');
				linkTitle = getNodeValue(workLinks[i],'LINK_TITLE');
				//linkTitle = (linkImg!='null' && linkImg!=null && linkImg!='undefined' && linkImg!='') ? "<img src='" + linkImg + "' alt='" + linkTitle + "' border='0'>" : linkTitle; 
				
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
								+ "<div class='it_news_box_con_right'>" + submitDate +"</div>"
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
    location.replace("indexFrame_GS.jsp?mainUrl="+encodeURIComponent(url));
   // location.replace(encodeURIComponent(url));
}



/* *******************************
 * 流程通道 点击设置弹出的界面*
 * *********************************/
function confFlowChannelPannel(){
    flowConfigDate();
    $("#reportConfig").dialog({
        title:'流程通道配置',
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
                var state =  setFlowCfgSave();
                $(this).dialog('close');
                if(state){
                   setLink();
                }
            }
        }
    });
    $("#reportConfig").dialog('open');
}

/**
 * 流程通道配置 初始化数据*/
var link_id = [];
var tabName = [];  
var pri_id = [];
function flowConfigDate(){
    link_id = [];
    pri_id = [];
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("GET","servlet/MainPageAction?action=2",false);
    xmlhttp.send();  
    var list = xmlhttp.responseXML.selectNodes("/root/rowSet");
    var innerHtml = '<table width="99%" align="center" border="0" cellspacing="4" cellpadding="0">';
    if(list.length>0){
      for(var i=0; i<list.length; i++){
          var check = list[i].selectSingleNode("CHECKED").text;
          var linkId = list[i].selectSingleNode("LINK_ID").text;
          tabName = list[i].selectSingleNode("LINK_TITLE").text;
          
          link_id[link_id.length] = linkId;
          pri_id[pri_id.length] = list[i].selectSingleNode("PRIVILEGE_ID").text;
          innerHtml += "<tr><td align='center' style='width:10px'><img src='/resource/image/picExmaple.gif' width='16px' /></td>"; 
          innerHtml += "<td align='left' style='font-size:13px'>"; 
          if(check == '1'){
                 innerHtml += "<input type='checkbox' value='"+tabName+"' checked="+check+" id='check_"+i+"'>"+tabName+"</input>";
          }else{
                 innerHtml += "<input type='checkbox' value='"+tabName+"' id='check_"+i+"'>"+tabName+"</input>";
          }
          innerHtml += "</td></tr>";
      }
   }else{
       innerHtml += "<tr><td align='center'>&nbsp;</td>"
                  + "<td align='left' style='font-size:13px'>"
                  + "   您好,目前暂无可选[流程通道]..."
                  + "</td></tr>";                                             
   }
   innerHtml += "</table>";
   document.getElementById("reportConfig").innerHTML = innerHtml;
}

/**
 * '流程通道'配置 数据保存[应用]
 * @return {Boolean}
 */
function setFlowCfgSave(){
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.open("post","servlet/MainPageAction?action=3",false);
    
    var sendXML = '<?xml version="1.0" encoding="gbk"?><root>';
    var dXML = new ActiveXObject("Microsoft.XMLDOM");
    for(var i=0;i<link_id.length;i++){
        var ch = document.getElementById("check_"+i).checked;
        if(ch == true){
           ch = 1;
        }else{
           ch = 0;
        }
        sendXML += '<rowSet><PRI_ID>'+ pri_id[i] +'</PRI_ID>'+'<CHECKED>'+ch+'</CHECKED></rowSet>';
    }
    sendXML += '</root>';
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
