var staff_id=getCurrentStaffId();
var flagShow=getIsExitsOrgld();
//代办刷新按钮
function refeshDaiban(){
	loadPendingList("GANSU_DAIBAN","pendingList","1");
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
function addTopMenuGS2(id,oMenuBar,curMenuId)
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
		var outHTML = '<ul class="ulhide">';
	    if(menuId!="-1"&&action!=1)
	    {
	        outHTML += '<li><a href="#" onclick="doMenu_refresh()">主页</a></li>';
	    	outHTML +="<li style='background:url(/resource/image/indexGS/line.png) no-repeat;width:2px;height:50px;overflow:hidden;'></li>";
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
			outHTML +=   '<li><a href="#" '
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
			   tempStr='&nbsp;'+oNode.getAttribute("PRIVILEGE_NAME")+'&nbsp;';
			}else{
			   	outHTML +=' style="color: #007bc7;background: #E9EEF5;"';
				tempStr='&nbsp;'+oNode.getAttribute("PRIVILEGE_NAME")+'&nbsp;';
			}
			outHTML +=   '>'
	        outHTML +=  tempStr	
	        outHTML +='</a></li>';
		    outHTML +="<li style='background:url(/resource/image/indexGS/line.png) no-repeat;width:2px;height:50px;overflow:hidden;'></li>";
		}
		outHTML+="</ul>"
		oMenuBar.innerHTML = outHTML;
	}
}
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
	                    +'<span class="spaceFilter" align="absbottom"></span>'
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
	        outHTML +=  '<span class="spaceFilter" align="absbottom"></span>'
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
	                          outHTMLStr += "><img src='resource/image/arrow.gif' align='absmiddle'/>&nbsp;";
	                          outHTMLStr +=favoriteName; 
	                          outHTMLStr += "</a>";
	                      }
	                  }catch(e){continue}
	                }
	            }
	        }
	        document.getElementById('shortCutMenu22').innerHTML = outHTMLStr + "<div style=\"clear:both;\"></div>";
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
		var temp='<a href="'+linkVal+'" style="float:left; height:45px;width:240px;margin:3px 1% 3px 3%;" class="zhuantiACSS">';
		if(checkEd=="0"){//权限判断 没有权限链接无效
			linkVal="#";
			temp='<a href="javascript:OpenLink()" style="float:left; height:45px;width:240px;margin:3px 1% 3px 3%;" class="zhuantiACSS">'
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
			loopTimes =rowsNum;
		}else{
			loopTimes =rowsNum;
		}
		var pendingInfoArray = new Array(loopTimes);
		
		for(var i=0; i<loopTimes; i++) {
			var alert_img="";// 是否超时标记
			var new_state="";// 是否new标示
			pendingInfo = getPendingInfo(resultRows[i],num);
			pendingInfoArray[i] = pendingInfo;
		
			aPendingRow = aPendingTable.insertRow(aPendingTable.rows.length);
			aPendingCell = aPendingRow.insertCell(0);
			aPendingCell.className = "mid_content_d";
			
			if (pendingInfo.alert_flag=="2"){
	        	alert_img ="<div style='float:right;padding-right:3px;width:35px;padding-top:3px; font-weight:bold; font-style:italic;'><font face='Microsoft YaHei' color='#FF0000'>超时</font></div>";
			}else if (pendingInfo.alert_flag=="1"){
	        	alert_img ="<div style='float:right;padding-left:3px;width:35px;padding-top:-3px;cursor:hand;'><img title='橙色告警！' border='0' src='./images/orange_alert.gif' height='16' width='16'></div>";
			}else{
				alert_img =alert_img;
			}
			if (pendingInfo.type!="")
				new_state ="<img src='/resource/local/gs/image/f_new3.gif'>";
				else
					new_state=new_state;
			

			if(num=="1" && pendingInfo.is_read=="0")
			pendingTitle = "<div style='float:left;padding-left:10px;font-family:Microsoft YaHei;width:73%;font-size:13px;'><a href='javascript:openSingle(" + i+","+num + ")'class='daibanACss' title='"+pendingInfo.content+"'>"+new_state+"" + pendingInfo.content+"</a></div>";
				else
	        pendingTitle = "<div style='float:left;padding-left:10px;font-family:Microsoft YaHei;width:70%;font-size:13px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:openSingle(" + i+","+num + ")'class='daibanACss' title='"+pendingInfo.content+"'>" + pendingInfo.content+"</a></div>";
	        
	        if(num=="1"||num=="4")
				pendingStateDate="<div style='float:right;color:black;width:120px;text-align:right;'>[" +pendingInfo.state_date +"]</div>";
			else
				pendingStateDate="<div style='float:right;width:120px;font-family:Microsoft YaHei;'><a href='#' class='daibanACss' title='"+pendingInfo.state_date+"'>执行人:" +ellipsisOverText(pendingInfo.state_date, 5) +"</a></div>";
			
			aPendingCell.innerHTML =pendingTitle+pendingStateDate+alert_img;
		}
		//判断是哪种代办
		if(num=="1"){
			var d = ResultFactory.newResult("GANSU_DAIBAN_COUNT");
			var total_count;//代办总条数
			d.onLoad=function(oXML){
				var oRows = oXML.selectNodes('/root/rowSet');
				total_count=parseInt(oRows[0].childNodes[0].text);
			};
			d.async=false;
			d.send(Result.FORCE_GET,null);
			pendingInfoArray1=pendingInfoArray;
			document.getElementById("eventPageNum").innerHTML = '待办('+total_count+')';
		}			
		if(num=="2"){
			pendingInfoArray2=pendingInfoArray;
			document.getElementById("eventPageedNum").innerHTML = '已办('+rowsNum+')';
		}
		if(num=="3"){
			pendingInfoArray3=pendingInfoArray;	
			document.getElementById("followNum").innerHTML = '本人发起('+rowsNum+')';
		}
		if(num=="4"){
			pendingInfoArray4=pendingInfoArray;	
			document.getElementById("readPageNum").innerHTML = '已阅('+rowsNum+')';
		}
		addRowEmpty(aPendingTable, loopTimes, 8);
	}
	var pendingListParam = {P_ROWNUM:7};
	pendingList.send(Result.FORCE_GET, pendingListParam);
	
}

//一条待办记录信息封装到数组
function getPendingInfo(aRowSet,num){
		if(num=="1"){
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
				alert_flag:aRowSet.childNodes[13].text,
				is_read:aRowSet.childNodes[14].text,
				rn:aRowSet.childNodes[15].text
				
			}
		}else{
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

//-------------待办已读---------
function daiban_read(event_id)
{	
	var xmlhttp_read = new ActiveXObject("Microsoft.XMLHTTP"); 
	var url='servlet/MainPageAction?action=13&event_id='+event_id;
	//alert(url);
	xmlhttp_read.Open("POST",url,false); //mainpage.js中定义
	xmlhttp_read.send();
	if(isSuccess(xmlhttp_read))
	{
		refeshDaiban();
	}
}

// 代办打开的链接
function openSingle(index,num) {
	if(index == null || typeof(index)=='undefined'){
		return;
	}
	var pendingInfo;
	if(num=="1"){
		pendingInfo = pendingInfoArray1[index];
		if(pendingInfo.is_read=="0"){
			daiban_read(pendingInfo.id);
		}
	}
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

//-------------通知通报------------

function loadBillInfos(categoryId)//isLoadCategory,
{
    billXmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    var actionUrl = "servlet/billInfoServlet?tag=1&recent=20";//isLoadCategory = eval(isLoadCategory);
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
                         '    <TD style="padding-left:5px;border-bottom:1px solid gary;" width="20"><nobr></nobr></TD>'
       
            billOutput+= '    <TD style="padding-left:5px;border-bottom:1px solid gary;" width="60"><nobr>域</nobr></TD>';
            billOutput+= '    <TD style="padding-left:5px;border-bottom:1px solid gary;"><nobr>标题</nobr></TD>';  
            billOutput+= '    <TD style="padding-left:5px;border-bottom:1px solid gary;" width="80"><nobr>发布者</nobr></TD>'; 
            billOutput+= '    <TD style="padding-left:5px;border-bottom:1px solid gary;" width="100"><nobr>发布时间</nobr></TD>'+ 
           // billOutput+= '    <TD style="border-right:0px solid #ffffff;padding-left:5px;" width="50"><nobr>状态</nobr></TD>'+
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
                billOutput+= '    <td title="'+oRows[i].selectSingleNode("TITLE").text+'">'+
                             //'       <nobr><span style="width:5px;"></span>'+
                                       //getTitle(oRows[i].selectSingleNode("BILL_INFO_ID").text,oRows[i].selectSingleNode("TITLE").text)+
                             '<nobr>'+          
								  '<div style="width:300px;overflow: hidden;text-overflow: ellipsis;">'+oRows[i].selectSingleNode("TITLE").text+'</div>'+
                             '</nobr>'+
                             '    </td>';
                billOutput+= '<td><nobr>'+oRows[i].selectSingleNode("STAFF_NAME").text+'</nobr></td>';   
                billOutput+= '<td><nobr>'+oRows[i].selectSingleNode("SUBMIT_DATE").text.substring(0,10)+'</nobr></td>'+              
               // billOutput+= '    <td><nobr>'+getState(oRows[i].selectSingleNode("STATE").text, oRows[i].selectSingleNode("LIST_LABEL").text)+'</nobr></td>'+
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

//通知通报 权限配置在sys_config表中，返回
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
    var titleStr = ellipsisOverText(title,20);
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

//------------通知通报结束--------

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

// 是否显示小窗口 修改
function isShowWin(){
	
    var staffId=staff_id;
    var boxValue;
    
	if(document.getElementById("mybox").checked==true){
		if(confirm('系统登录后，将不再显示左上角窗口。是否确认操作?')){
			boxValue=1;
			msgWin.close();
		}else{			
			return;
		}
	}else{
		if(confirm('系统登录后，将显示左上角小窗口。是否确认操作?')){
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

//发布版本开始
function showFaBuBanBen(){
    /*var sqlstr = "select * from (";
    sqlstr += " select a.fsearid,a.FTITLE,a.submit_name,to_char(a.submit_time,'yyyy-mm-dd') submit_time,";
    sqlstr += " (select decode(a.RSTATE,'6','上线中','7','验收中','8','已完成','已完成') from dual) state,";
    sqlstr += " to_char(a.RTIME,'yyyy-mm-dd') FTIME,a.RFLOWID RFLOWID,ROWNUM";
    sqlstr += " from ah_release_version a where a.submit_time is not null order by a.submit_time desc ";
    sqlstr += " ) b where ROWNUM <= 9";*/
	/*var sqlstr = "select t.serial,";
		sqlstr += "t.release_title || t.ver_num title,";
		sqlstr += "(select staff_name from staff s where s.user_name = t.staff_name) staff_name,";
		sqlstr += "t.real_start_time,";
		sqlstr += "(select c.mean";
        sqlstr += "from codelist c";
        sqlstr += "where c.code_type = 'LN_ITSM_RELEASE_STATE'";
        sqlstr += "and c.code = t.release_state) release_state,";
		sqlstr += "t.real_end_time";	
		sqlstr += "from RELEASE_MANAGER t";
		sqlstr += "where ROWNUM <= 9";
		sqlstr += "order by t.real_start_time desc;";*/
	var sqlstr = "select * from (select t.serial fsearid,t.release_title || '_' || t.ver_num FTITLE,";
	sqlstr += "(select staff_name from staff s where s.user_name = t.staff_name) submit_name,";
	sqlstr += "to_char(t1.submit_time,'yyyy-mm-dd') submit_time,";
	sqlstr += "decode(t.release_state,null,'发布开始',(select c.mean from codelist c where c.code_type = 'LN_ITSM_RELEASE_STATE' and c.code = t.release_state)) state,";
	sqlstr += "to_char(t.real_end_time,'yyyy-mm-dd') FTIME,t1.flow_id RFLOWID,ROWNUM ";
	sqlstr += "from RELEASE_MANAGER t ,it_flow_base t1 where t.serial=t1.serial order by t.real_end_time desc,t1.submit_time desc ) where rownum<=8";

    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST", "/servlet/@Deprecated/ExecServlet?action=101&paramValue=" + getAESEncode(encodeURIComponent(sqlstr)), false);
    xmlhttp.send();
    var tmpthml  = "<table width='97%' align='center' border='0' cellspacing='0' cellpadding='0'>";
    tmpthml      +="        <tr><td height='3' colspan='5'></td></tr>";
    tmpthml      +="        <tr align='center' bgcolor='#F1F1F6'>";
    tmpthml      +="            <td style='padding-left:5px;border-bottom:1px solid gary;' height='18' width='2'><nobr></nobr></td>";
    //tmpthml      +="            <td style='padding-left:5px;border-bottom:1px solid gary;' height='18'></td>";
    tmpthml      +="            <td style='padding-left:5px;border-bottom:1px solid gary;'><nobr>变更标题</nobr></td>";
    tmpthml      +="            <td style='padding-left:5px;border-bottom:1px solid gary;' width='60'><nobr>发起人</nobr></td>";
    tmpthml      +="            <td style='padding-left:5px;border-bottom:1px solid gary;' width='80'><nobr>发起时间</nobr></td>";
    tmpthml      +="            <td style='padding-left:5px;border-bottom:1px solid gary;' width='60'><nobr>状态</nobr></td>";
    tmpthml      +="            <td style='padding-left:5px;border-bottom:1px solid gary;' width='80'><nobr>完成时间</nobr></td>";
    tmpthml      +="        </tr>";
    tmpthml      +="        <tr><td height='2' colspan='7'></td></tr>";
    if (isSuccess(xmlhttp)) {
    var dataArr = xmlhttp.responseXML.getElementsByTagName("rowSet");
    var tmptitle = "";
    var tmptitle2 = "";
    var tmpsubmitname 	= "";
    var tmpsubmittime	= "";
    var tmpstate 	= "";
    var tmpftime  	= "";
    var flowid  = "";
    
    for (var i = 0; i < dataArr.length; i++) {
        tmptitle = "";
        tmptitle2 = "";
        tmpsubmitname = "";
        tmpsubmittime = "";
        tmpstate = "";
        tmpftime = "";
        flowid  = "";
        
        if(dataArr[i].getElementsByTagName("FTITLE")[0].firstChild != null)
	    {   
	    	tmptitle = dataArr[i].getElementsByTagName("FTITLE")[0].firstChild.nodeValue;
	    	tmptitle2 = ellipsisOverText(tmptitle,25);
	    }
	    if(dataArr[i].getElementsByTagName("SUBMIT_NAME")[0].firstChild != null)
	    {   
	    	tmpsubmitname = dataArr[i].getElementsByTagName("SUBMIT_NAME")[0].firstChild.nodeValue;
	    }
		if(dataArr[i].getElementsByTagName("SUBMIT_TIME")[0].firstChild != null)
		{   
			tmpsubmittime = dataArr[i].getElementsByTagName("SUBMIT_TIME")[0].firstChild.nodeValue;
		}
	     if(dataArr[i].getElementsByTagName("STATE")[0].firstChild != null)
	    {   
	    	tmpstate 	= dataArr[i].getElementsByTagName("STATE")[0].firstChild.nodeValue;
	    }
	    if(dataArr[i].getElementsByTagName("FTIME")[0].firstChild != null)
	    {
	    	tmpftime 	= dataArr[i].getElementsByTagName("FTIME")[0].firstChild.nodeValue;
	    }
	    if(dataArr[i].getElementsByTagName("RFLOWID")[0].firstChild != null)
	    {
	    	flowid 	= dataArr[i].getElementsByTagName("RFLOWID")[0].firstChild.nodeValue;
	    }
	    
	    tmpthml     += "<tr ondblclick='openForm("+flowid+");' style='cursor: hand;' onmouseover='doMouseOver(this)'onmouseout='doMouseOut(this)'>";
	    tmpthml     += "<td height='20' width='20' align='right'><div align='right'><img src='resource/image/ico/fieldList.gif'></div></td>";
	    //tmpthml     += "<td height='20' width='2'><div align='center'></div></td>";
	    tmpthml     += "<td width='160' title="+tmptitle+"><nobr>"+tmptitle2+"</nobr></td>";
	    tmpthml     += "<td width='60'><nobr>"+tmpsubmitname+"</nobr></td>";
	    tmpthml     += "<td width='80'><nobr>"+tmpsubmittime+"</nobr></td>";
	    tmpthml     += "<td width='60'><nobr>"+tmpstate+"</nobr></td>";
	    tmpthml     += "<td width='80'><nobr>"+tmpftime+"</nobr></td></tr>";	    
    }
    }
    tmpthml += "</table>";
	document.getElementById("versionId").innerHTML = tmpthml;
}

function openBanBen(){
	var url = '/workshop/query/show_result.html?result=999990120';
	displayMaxWindow(url,'999990120',false);
}
function openForm(flow_id){
    var flowMod = '';
	var url = "/workshop/form/index.jsp?fullscreen=yes&flowId="+flow_id+"&flowMod="+flowMod+"&callback=window.opener.callbackFn()";
	doWindow_open(url);
}
//发布版本开结束
