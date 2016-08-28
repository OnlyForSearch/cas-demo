
var staff_id=getCurrentStaffId();
var flagShow=getIsExitsOrgld();
//代办刷新按钮
function refeshDaiban(){
	loadPendingList("HUBEI_DAIBAN","pendingList","1");
	loadPendingList("HUBEI_YIBAN","eventPageedList","2");
	loadPendingList("HUBEI_BENRENFAQI","followList","3");
	loadPendingList("HUBEI_YUEBAN","readList","4");
}

// 公告栏权限
function boardInfos(){
	var staffId=staff_id; 
	if(getHasPrivilege("906302", staffId)=="false"){//发布
		boardInfoId.href = "javascript:";
		boardInfoId.disabled = true;
	}
	if(getHasPrivilege("906301", staffId)=="false"){//查看
		boardInfoMoreId.href = "javascript:";
		boardInfoMoreId.disabled = true;		
	}else{
		window.setTimeout("document.getElementById('boardInfo').src = 'workshop/board/boardScroll_JT.htm'",10);//公告栏滚动boardScroll_JT.htm boardScroll.jsp
	}
}

//--------------菜单栏开始--------------------

//湖北菜单导航	
function addTopMenuHB(id,oMenuBar,curMenuId)
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
	        outHTML +=  '<span style="cursor:hand;float:left" onmouseover="doMenuOverHB(this)" '
	                    +    'onmouseout="doMenuOutHB(this)" onclick="doMenu_refresh()">'
	                    +  '<span style="height:34px;" class="menuTitle">主页</span>'
	                    +'<img width="10px" height="35px" src="/resource/image/indexHb2/index/space1.png" align="absbottom"/>'
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
			   outHTML +=    ' onmouseover="doMenuOverHB(this)" onmouseout="doMenuOutHB(this)"';
			   tempStr='<span class="menuTitle" style="height:34px;">&nbsp;'+oNode.getAttribute("PRIVILEGE_NAME")+'&nbsp;</span>';
			}else{
				tempStr='<span class="menuTitleBgOver" style="height:34px;">&nbsp;'+oNode.getAttribute("PRIVILEGE_NAME")+'&nbsp;</span>';
			}
			outHTML +=   '>'
	        outHTML +=  tempStr
	        outHTML +=  '<img width="10px" height="35px" src="/resource/image/indexHb2/index/space1.png" align="absbottom"/>'
	        outHTML +='</span>';
	        
		}
		oMenuBar.innerHTML = outHTML;
	}
}

function doMenuOverHB(oMenuItem){
   oMenuItem.childNodes[0].className="menuTitleBgOver";
}
function doMenuOutHB(oMenuItem){
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
	                          outHTMLStr += "><img src='resource/image/indexHb2/index/item.gif' align='absmiddle'/>&nbsp;";
	                          outHTMLStr +=favoriteName; 
	                          outHTMLStr += "</a>";
	                      }
	                  }catch(e){continue}
	                }
	            }
	        }
	        document.getElementById('shortCutMenu22').innerHTML = outHTMLStr + "<div style=\"clear:both;\"></div>";//alert(outHTMLStr);
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
function setWorkLinkHb(linkNodes)
{
	var outHTML = '';
	for(var i=0;i<linkNodes.length&&i<7;i++)
	{
		var linkImg = getNodeValue(linkNodes[i],'LINK_IMG');
		var linkVal = getNodeValue(linkNodes[i],'LINK_VALUE');
		var linkTitle = getNodeValue(linkNodes[i],'LINK_TITLE');
		var checkEd=getNodeValue(linkNodes[i],'CHECKED');
		//var linkTitle = linkImg!=null&&linkImg!='undefined'&&linkImg!=''?"<img src='" + linkImg + "' alt='" + linkTitle + "' border='0'>":linkTitle;  
		var temp='<a href="'+linkVal+'" class="gongzuolianjieACss">';
		if(checkEd=="0"){//权限判断 没有权限链接无效
			linkVal="#";
			temp='<a href="javascript:OpenLink()" class="gongzuolianjieACss">';
		}
		outHTML += temp
				+		'<div style="float:left;"><img src="resource/image/indexImage/style1/about_link.jpg"/>&nbsp;</div>'
				+		'<div style="float:left;font-family:"Microsoft YaHei";">'+linkTitle+'</div></a>'		
	}
	workLinkSpan.innerHTML = outHTML;		
}
// 
//-------------工作链接函数结束---------


//-------------专题应用函数开始---------

function setSenimalLinkHb(type)
{	
	var staffId=staff_id;
	var url='servlet/MainPageAction?action=11&staffId='+staffId+"&type="+type;
	xmlRequest.Open("POST",url,false); //mainpage.js中定义
	xmlRequest.send();
	if(isSuccess(xmlhttp))
	{
		if(type=="C"){
			var workLinks = xmlRequest.responseXML.selectNodes("/root/rowSet[LINK_TYPE='C']");		
			setWorkLinkHbZhuanti(workLinks);
		}
		if(type=="B"){
			var workLinks = xmlRequest.responseXML.selectNodes("/root/rowSet[LINK_TYPE='B']");
			setWorkLinkHb(workLinks);
		}
	}
}

function OpenLink(){
	alert('您没有查看链接的权限！');
}
// 专题应用
function setWorkLinkHbZhuanti(linkNodes)
{
	var outHTML = '';
	for(var i=0;i<linkNodes.length;i++)
	{
		var linkImg = getNodeValue(linkNodes[i],'LINK_IMG');
		var linkVal = getNodeValue(linkNodes[i],'LINK_VALUE');
		var linkTitle = getNodeValue(linkNodes[i],'LINK_TITLE');
		var linkImg2 ="<img src='" + linkImg + "' alt='" + linkTitle + "' border='0'>";  
		var checkEd=getNodeValue(linkNodes[i],'CHECKED');
		var temp='<a href="'+linkVal+'" style="float:left; height:35px;width:118px;margin:3px 1% 3px 3%;" class="zhuantiACSS">';
		if(checkEd=="0"){//权限判断 没有权限链接无效
			linkVal="#";
			temp='<a href="javascript:OpenLink()" style="float:left; height:35px;width:118px;margin:3px 1% 3px 3%;" class="zhuantiACSS">'
		}
		if(linkTitle=="易信支撑群"){
			linkTitle='<span style="color:red;">'+linkTitle+'</span>';
		}
		outHTML += temp
				+		'<div class="zhuantiImg">'+linkImg2+'</div>'
				+		'<div class="zhuantiTitle">'+linkTitle+'</div>'	
				+   '</a>';
	}
	zhuantiyingyong.innerHTML = outHTML;		
}

//-------------专题应用函数结束---------



//-------------首页快捷链接收藏夹等开始--------
function showFav(oElement)
{
    var iRight=oElement.getBoundingClientRect().right+document.body.scrollLeft;
    var iTop=oElement.getBoundingClientRect().bottom+document.body.scrollTop;
    oFavorites.style.display="";
    oFavorites.left=iRight-oFavorites.width-35;
    oFavorites.top=iTop;
	showFavoritesTree(oFavorites.getElementById("oFavDiv"));
	favorites_tree.isCallPage = 'index_HB2.jsp'
}
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
	
	var outHref='';
	if(tabId=='eventPageTab')
		outHref='<a href="/workshop/query/show_result.html?result=WORK_DESK_FLOW" target="_blank" class="shezhiCss">更多&nbsp;|&nbsp;</a>';
	if(tabId=='eventPageedTab')
		outHref='<a href="/workshop/query/show_result.html?result=WORK_DESK_PENDED" target="_blank" class="shezhiCss">更多&nbsp;|&nbsp;</a>';
	if(tabId=='followTab')
		outHref='<a href="/workshop/query/show_result.html?result=WORK_DESK_PENDING" target="_blank" class="shezhiCss">更多&nbsp;|&nbsp;</a>';
	if(tabId=='readPageTab')
		outHref='<a href="/workshop/query/show_result.html?result=WORK_DESK_JOB" target="_blank" class="shezhiCss">更多&nbsp;|&nbsp;</a>';
	
	document.getElementById("moreHref").innerHTML=outHref;
}


//控制标题长度
function ellipsisOverText(text, maxLength) {
	if (text !=null && text.length > maxLength) {
		return text.substring(0, maxLength) + "...";
	}
	return text;
}
//首页代办配置在sql_cfg中
var pendingInfoArray1;
var pendingInfoArray2;
var pendingInfoArray3;
var pendingInfoArray4;

function loadPendingList(paramName,tableName,num){
	var pendingInfo;		
	var pendingList = ResultFactory.newResult(paramName);
	pendingList.onLoad = function(oXml)
	{
		var pendingType;
		var pendingTitle;
		var pendingFlowType;
		var pendingStateDate;		
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
		var rowsNum=resultRows.length;
		var loopTimes;
		if (rowsNum>8){
			loopTimes =8;
		}else{
			loopTimes =rowsNum;
		}
		var pendingInfoArray = new Array(loopTimes);
		
		for(var i=0; i<loopTimes; i++) {
			var alert_img="";// 是否超时标记
			pendingInfo = getPendingInfo(resultRows[i]);
			pendingInfoArray[i] = pendingInfo;
		
			aPendingRow = aPendingTable.insertRow(aPendingTable.rows.length);
			aPendingCell = aPendingRow.insertCell(0);
			aPendingCell.className = "mid_content_d";
			
			if (pendingInfo.alert_flag=="2"){
	        	alert_img ="<div style='float:left;padding-left:3px;width:35px;'><font face='黑体' color='#FF0000'>超时</font></div>";
			}else if (pendingInfo.alert_flag=="1"){
	        	alert_img ="<div style='float:left;padding-left:3px;width:35px;padding-top:-3px'><img title='橙色告警！' border='0' src='./images/orange_alert.gif' height='16' width='16'></div>";
			}else{
				alert_img ="<div style='float:left;padding-left:3px;width:35px;padding-top:-3px'>&nbsp;</div>";
			}
			
	         if(alert_img!="")
	              pendingTitle = "<div style='float:left;padding-left:0px;font-family:Microsoft YaHei;width:73%;'><a href='javascript:openSingle(" + i+","+num + ")'class='daibanACss' title='"+pendingInfo.content+"'>" + ellipsisOverText(pendingInfo.content, 40) + "</a></div>";
	         else
	              pendingTitle = "<div style='float:left;padding-left:35px;font-family:Microsoft YaHei;width:73%;'><a href='javascript:openSingle(" + i+","+num + ")'class='daibanACss' title='"+pendingInfo.content+"'>" + ellipsisOverText(pendingInfo.content, 40) + "</a></div>";
			
	        if(num=="1"||num=="4")
				pendingStateDate="<div style='float:right;color:black;width:90px'>[" +pendingInfo.state_date +"]</div>";
			else
				pendingStateDate="<div style='float:right;width:90px;font-family:Microsoft YaHei;'><a href='#' class='daibanACss' title='"+pendingInfo.state_date+"'>执行人:" +ellipsisOverText(pendingInfo.state_date, 3) +"</a></div>";
			
			aPendingCell.innerHTML =alert_img+pendingTitle+pendingStateDate;
		}
		//判断是哪种代办
		if(num=="1"){
			pendingInfoArray1=pendingInfoArray;
			document.getElementById("eventPageNum").innerHTML = '待办任务('+rowsNum+')';
		}			
		/*if(num=="2"){
			pendingInfoArray2=pendingInfoArray;
			document.getElementById("eventPageedNum").innerHTML = '已办('+rowsNum+')';
		}*/
		if(num=="3"){
			pendingInfoArray3=pendingInfoArray;	
			document.getElementById("followNum").innerHTML = '已办事项';
		}
		if(num=="4"){
			pendingInfoArray4=pendingInfoArray;	
			document.getElementById("readPageNum").innerHTML = '阅办信息('+rowsNum+')';
		}
		addRowEmpty(aPendingTable, loopTimes, 8);
	}
	var pendingListParam = {P_ROWNUM:7};
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
		sort_id:aRowSet.childNodes[12].text,
		alert_flag:aRowSet.childNodes[13].text
	}
	return pendingInfo;
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
	if(num=="1")
		pendingInfo = pendingInfoArray1[index];
	if(num=="2")
		pendingInfo = pendingInfoArray2[index];
	if(num=="3")
		pendingInfo = pendingInfoArray3[index];
	if(num=="4")
		pendingInfo = pendingInfoArray4[index];

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
	  		send_url = "/workshop/form/index.jsp?tchId="+content_id+"&callback=opener.refeshDaiban()&fullscreen=yes";
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

//-------------业务调度------------



function loadBillInfos(categoryId)//isLoadCategory,
{
    billXmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    var actionUrl = "servlet/billInfoServlet?tag=1&recent=9"+((delCategoryId!=null)? "&delCategoryId="+delCategoryId : "");//isLoadCategory = eval(isLoadCategory);
    if(categoryId!=null) {actionUrl += "&categoryId="+categoryId;}
    //alert(actionUrl);
	billXmlhttp.open("POST", actionUrl,true);
	billXmlhttp.onreadystatechange = loadBillInfoDetails;
    billXmlhttp.send("");
}


function loadBillInfoDetails()
{
	if(billXmlhttp!=null && billXmlhttp.readyState==4 && isSuccess(billXmlhttp))
    {
        //(1). 计费信息列表
        var dXML = billXmlhttp.responseXML;//new ActiveXObject("Microsoft.XMLDOM");dXML.load(billXmlhttp.responseXML);
        billXmlhttp = null;
        var billOutput = '<table width="100%" border="0" cellspacing="0" cellpadding="0">'+
                         '  <tr>'+
                         '    <td height="3" colspan="6"> </td>'+
                         '  </tr>'+
                         '  <TR align="center" bgcolor="#F1F1F6">'+
                         '    <TD height="18" width="20"></TD>'
       
            billOutput+= '    <TD style="border-right:2px solid #ffffff;padding-left:5px;" width="50"><nobr>业务类型</nobr></TD>';
            billOutput+= '    <TD style="border-right:2px solid #ffffff;padding-left:5px;"><nobr>标题</nobr></TD>';  
            billOutput+= '    <TD style="border-right:2px solid #ffffff;padding-left:5px;" width="80"><nobr>发布者</nobr></TD>'; 
            billOutput+= '    <TD style="border-right:2px solid #ffffff;padding-left:5px;" width="120"><nobr>发布时间</nobr></TD>'; 
            billOutput+= '    <TD style="border-right:0px solid #ffffff;padding-left:5px;" width="50"><nobr>状态</nobr></TD>'+
                         '  </tr>'+
                         '  <tr>'+
                         '    <td height="2" colspan="6"> </td>'+
                         '  </tr>';
        var hasPrivilege = dXML.selectSingleNode("/root/HAS_PRIVILEGE").text;
        
        if(hasPrivilege=="true")
        {
            var oRows=dXML.selectNodes("/root/BILL_INFOS/rowSet");
            var iLen=oRows.length;
            var categoryName;

            for(var i=0;i<iLen;i++)
            {
                categoryName = oRows[i].selectSingleNode("CATEGORY_NAME").text;// 类型名称        
                if(categoryName==null || categoryName.length==0) {categoryName="[无]";}
                else {categoryName="["+categoryName+"]";}
                
              //isSpecial = oRows[i].selectSingleNode("IS_SPECIAL").text;//是否精品信息
                
                billOutput+= '  <tr onclick="showBillInfoWindow(3,'+oRows[i].selectSingleNode("BILL_INFO_ID").text+','+flagShow+');" style="cursor:hand;" onmouseover="doMouseOver(this)" onmouseout="doMouseOut(this)">';
               
                if("1"==oRows[i].selectSingleNode("IS_READ").text)
                    billOutput+= '<td  height="20"> <div align="center"><IMG SRC="resource/image/ico/msg_read.gif" WIDTH=20 HEIGHT=15 ALT="已读"></div></td>';
                else
                   billOutput+= '<td height="20"> <div align="center"><IMG SRC="resource/image/ico/msg_unread.gif" WIDTH=20 HEIGHT=15 ALT="未读"></div></td>';
                
                billOutput+= '<td><nobr>'+categoryName+'</nobr></td>';     
                
                
                billOutput+= '    <td>'+
                             '       <nobr><span style="width:5px;"></span>'+
                                       getTitle(oRows[i].selectSingleNode("BILL_INFO_ID").text,oRows[i].selectSingleNode("TITLE").text)+
                             '       </nobr>'+
                             '    </td>';
                billOutput+= '<td><nobr>'+oRows[i].selectSingleNode("STAFF_NAME").text+'</nobr></td>';   
                billOutput+= '<td><nobr>'+oRows[i].selectSingleNode("SUBMIT_DATE").text+'</nobr></td>';              
                billOutput+= '    <td><nobr>'+getState(oRows[i].selectSingleNode("STATE").text, oRows[i].selectSingleNode("LIST_LABEL").text)+'</nobr></td>'+
                             '  </tr>';
            }
        }else//没有查看权限
        {
            releaseNewBillInfo.href = "javascript:";
            releaseNewBillInfo.disabled = true;
            billInfoHistory.href = "javascript:";
            billInfoHistory.disabled = true;
        }
        billOutput   +=  '  <tr>'+
                         '    <td height="3" colspan="6"> </td>'+
                         '  </tr>'+
                         '</table>';
        billInfos.innerHTML = billOutput;             
    }
}

//业务调度 权限配置在sys_config表中，返回
function getIsExitsOrgld(){
	var orgIdsStr="";
	orgIdsStr=$getSysVar('YEWU_DIAODU_ORGIDS');
	if(orgIdsStr=="")
		return "1";
	var orgIds=orgIdsStr.split(',');
	var orgId=getCurrentStaffOrg();
	for(var i=0;i<orgIds.length;i++){
		if(orgId==orgIds[i]){
			return "1";
		}			
	}
	return "0";
}
function isShowMore(){
	if(flagShow=="0"){
	 	billInfoHistory.href = "javascript:";
      	billInfoHistory.disabled = true;
	}
}


function getTitle(billInfoId, title)
{
    var titleStr = ellipsisOverText(title,21);
	return	titleStr;

}

function getState(state, stateLabel)
{
    if(state!='4SB' && state!='4SE')
    {
        return '【<span style="color:#ff0000;">'+stateLabel+'</span>】';
    }
    return '【'+stateLabel+'】';
}

function getNewImage(state, stateDate)
{
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate()-3);
    var dateStr = currentDate.getFullYear()+"-"+formatTime(currentDate.getMonth()+1)+"-"+formatTime(currentDate.getDate())+" "+
                  formatTime(currentDate.getHours())+":"+formatTime(currentDate.getMinutes());
    if((state=='4SB' || state=='4SE') && stateDate>dateStr)
    {
        return '<IMG SRC="resource/image/indexImage/new_info.gif">';
    }
    return '';
}
function formatTime(dateStr)
{
    if(dateStr==null || dateStr=="") {return "00";}
    else if(dateStr<10) {return "0"+dateStr;}
    else {return dateStr;}
}

function showBillInfoCategory(dropDownCategory, popObj)
{
    popObj.style.display='';
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

function hideSelf(popObj)
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

function getPos(el,sProp) 
{
	var iPos = 0;
	while (el!=null) {
		iPos+=el["offset" + sProp];
		el = el.offsetParent;
	}
	return iPos;
}

function showBillInfoWindow(tag, billInfoId,flag)
{
    if(flag=="1"){
    	var openWin = displayMaxWindowWithHandle("workshop/info/billInfoContent.jsp?billInfoId="+billInfoId,"", true);
    	//openWin.attachEvent('onunload', function(){loadBillInfos();});
    }else{
     	OpenLink();
     	 billInfoHistory.href = "javascript:";
         billInfoHistory.disabled = true;
    }
    
}
function displayMaxWindow(url, name, isCheckPrivilege)
{
    displayMaxWindowWithHandle(url, name, isCheckPrivilege);
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
	
	if (isSuccess(xmlRequest))	{
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