/*
    //加载头部日期时间信息：setDateTimeInfo();
	//加载菜单：loadMenu();
	//即时通信消息未阅读提示：setWebIMMsgInfo();
	//加载个性菜单：loadShortCutMenu(); 
	//待办：setPendOder();
	//工作导航：loadWorkLink();
	//加载图表：loadCharts();
*/

var menuDoc = new ActiveXObject("Microsoft.XMLDOM");
//加载菜单
var fMenuMU = 0;
function loadMenu(){
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
				if(privilegeName == '网管监控'){
						openUrl = '  onClick="'+scriptName+'"';
					//openUrl = 'id="'+privilegeId+'" SERVER_URL_NAME="'+serverUrlName+'"  onClick="oSelectedItem=this;'+scriptName+'"';
				}
		}else{
				if(privilegeName =='主页'){
					openUrl = " onClick='"+scriptName+"'";
				}
				if(privilegeName =='数据稽核'){
					openUrl = " onClick='"+scriptName+"'";
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
		retMenuHtml += "	<div class='position'>";
		if(ulMenuItemList.length>0){
			retMenuHtml += loadUlMenuItemList(ulMenuItemList);
 		}
		retMenuHtml += "	</div>";
		retMenuHtml += "</div>";
	}
	return retMenuHtml;
}
function loadUlMenuItemList(ulMenuItemList){
	var retMenuHtml = "";
	retMenuHtml += "	<ul>";
	for(var i=0;i<ulMenuItemList.length;i++){
		var privilegeId= ulMenuItemList[i].getAttribute("PRIVILEGE_ID");
		var privilegeName= ulMenuItemList[i].getAttribute("PRIVILEGE_NAME");
		var serverUrlName= ulMenuItemList[i].getAttribute("SERVER_URL_NAME");
		var scriptName= ulMenuItemList[i].getAttribute("SCRIPT_NAME");
		var cUlMenuItemList = ulMenuItemList[i].childNodes;
		var openUrl="";
		if(serverUrlName!=undefined && serverUrlName!=""){
			if(scriptName=="doMenu_open()"){
				openUrl = " onClick='doMenu_open(\""+serverUrlName+"\")'";
			}else{
				openUrl = " onClick='niOpenWind(\""+serverUrlName+"\",false)'";
			}
		}
		if(i==0){
			if(cUlMenuItemList.length>0){
				retMenuHtml += "	<li class='noBorderLi'><a href='#' "+openUrl+" class='hasDomRight'>"+privilegeName+"</a>";
	 		}else{
				retMenuHtml += "	<li class='noBorderLi'><a href='#' "+openUrl+">"+privilegeName+"</a>";
			}
		}else{
			if(cUlMenuItemList.length>0){
				retMenuHtml += "	<li><a href='#' "+openUrl+" class='hasDomRight'>"+privilegeName+"</a>";
	 		}else{
				retMenuHtml += "	<li><a href='#' "+openUrl+">"+privilegeName+"</a>";
			}
		}
		if(cUlMenuItemList.length>0){
			retMenuHtml += loadUlMenuItemList(cUlMenuItemList);
 		}
		retMenuHtml += "	</li>";
	}
	retMenuHtml += "	</ul>";
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
		
		if(menuul.length>0){
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
}
function doMenu_refresh()//点击主页
{  
    var oMenuJS=document.getElementById("menuJS");
    var sMainPageURL=(oMenuJS==null)?"indexITSM.jsp":oMenuJS.mainPage;
	window.top.location.replace(sMainPageURL);
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
    if(isNewWind){
    	window.open("indexITSMFrame.jsp?mainUrl="+encodeURIComponent(url),"_blank",sFeatures.join(","));
    }else{
		//window.location.replace("indexFrame.html?mainUrl="+encodeURIComponent(url));
    	window.open("indexITSMFrame.jsp?mainUrl="+encodeURIComponent(url),"_blank",sFeatures.join(","));             
		top.window.close();
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
	xmlhttp.open("post","/servlet/UnReadAction?action=4",true);
	xmlhttp.send("");
}
function setWebIMMsgInfoSet(xmlhttp) {
	if(isSuccess(xmlhttp)){ 
		var countNum ="";
		var oErrCodeNode = xmlhttp.responseXML.selectSingleNode("/root/error_code");
		if(oErrCodeNode && oErrCodeNode.text == 0) {
			var uodoNodeList = xmlhttp.responseXML.selectNodes("/root/UNDO_COUNT");
			var uodoNodeListLength=uodoNodeList.length;
			if(uodoNodeListLength != 0) {
				for(var i=0;i<uodoNodeListLength;i++){
					if(uodoNodeList[i].getAttribute("type") =="ALL"){
						countNum = uodoNodeList[i].text;
		   				isUnreadMessages = true;
	   				}
				}
			}
		}
		if (countNum > 0){
			curTopUnreadMsgId = countNum;
			var mHtml = '<span style="display:inline;color:#0055E5;font-size:13px;line-height:25px;height:25px;cursor:hand;text-align:center;" ';
				mHtml +='onMouseOver="this.style.textDecoration=\'underline\'" onMouseOut="this.style.textDecoration=\'\'" ';
				mHtml +='onclick="more_msg();" title="点击查看">';
				mHtml +="<img src='resource/image/itsmImages/advert.gif' align='absmiddle' style='margin-right:3px;'>您有<b style='color:#FF0000'>"+countNum+"</b>条新的消息,请注意查收!";
				mHtml +='</span>';
			newMsg.innerHTML = mHtml;
		}
	}
	
	if(!isUnreadMessages) curTopUnreadMsgId = 0;
    if(isUnreadMessages && lastTopUnreadMsgId < curTopUnreadMsgId) {
    }
    isUnreadMessages = false;
    lastTopUnreadMsgId = curTopUnreadMsgId;
}

var openWinParames;
var openWinLeft;
var openWinTop;
var openWinHeight = 580;
var openWinWidth = 780;
function more_msg()
{
	openWinLeft = (screen.width - openWinWidth)/2;
	openWinTop = (screen.height - openWinHeight)/2;
	openWinParames = 'height='+openWinHeight
				   			  + ',width='+openWinWidth
				              + ',top='+openWinTop
				              + ',left='+openWinLeft;
	window.open("MoreMessagePage.html",'MoreMsgWin',openWinParames);
}


//加载个性菜单:
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
				for(i=0; i<menuList.length&&i<20; i++){		//
	              try{
		              var favoriteName = menuList[i].getAttribute("FAVORITE_NAME");
		              var serverUrlName = menuList[i].getAttribute("SERVER_URL_NAME")
		              var scriptName = menuList[i].getAttribute("SCRIPT_NAME");
		              if(favoriteName != null && favoriteName != "" && serverUrlName != null && serverUrlName != ""){
	              		  outHTMLStr += "<a class='ni_staffMenu' href='#' title='"+ favoriteName +"' ";
			              if(scriptName!=null && scriptName!="" && scriptName.indexOf("doMenu_open")>-1){ 
			              		outHTMLStr += " onClick=\"doMenu_open('" + serverUrlName + "','',''," + menuList[i].getAttribute("id") + ")\" ";
			              }else{
						  		outHTMLStr += " onClick=\"niOpenWind('" + serverUrlName + "',true)\" ";
			              }
	              		  outHTMLStr += "><img src='resource/image/niImages/ni_title_img_2.gif' align='absmiddle'/>"; 
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

function doMenu_open(url,width,height,winId) {
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
	if(!winId)
	{
		winId = '_blank';
	}
	window.open(url,winId,sFeatures.join(","));
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

//知识库搜索:
function searchEntrance(){
    document.getElementById('queryString').value = document.getElementById('queryString').value.trimall();
    var queryInput = document.getElementById('queryString').value;
    if(queryInput.length==0){
        alert("请输入搜索条件!");
        document.getElementById('queryString').focus();
        return;
    }
    var queryStr = encodeURIComponent(document.getElementById('queryString').value); //关键字
    var indexDir = "";	//源
    var module = "";	//模块
    niOpenWind("workshop/searchEngine/search_entrance_result.htm?queryString="+queryStr+"&indexDirectory="+indexDir+"&module="+module+"&category=",false);
}

//注销：
function logout(){
    document.frmLogin.submit();
}


// 加载统计图表frame zhengqch

// 图表页面url
var charts = [];  
var tabName = [];  
function loadCharts(){
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
}

//获取员工首页报表的相关权限
function getHomePrivileges(){
   var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   xmlhttp.open("GET","/servlet/staff_manage?tag=95",false);
   xmlhttp.send("");
   var list = xmlhttp.responseXML.selectNodes("/root/rowSet"); 
   if(list.length <=0){
      return ;
   }
   charts  = [];
   tabName = [];
   for(var i=0; i<list.length; i++){
       var pri_id = list[i].selectSingleNode("PRI_ID").text;
       charts[charts.length] = list[i].selectSingleNode("SERVER_URL_NAME").text;
       tabName[tabName.length] =  list[i].selectSingleNode("PRI_NAME").text;
   }
}
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
       if(checked == 1){
       		charts[charts.length] = list[i].selectSingleNode("SERVER_URL_NAME").text;
       		tabName[tabName.length] =  list[i].selectSingleNode("PRI_NAME").text;
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
//点击首页图表配置
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
    document.getElementById('chartDiv').src = charts[idx];
    setTbListDef(idx);
}
function setTbListDef(idx){
    document.getElementById('tb_0').className = "tbListDef";
    document.getElementById('tb_1').className = "tbListDef";
    document.getElementById('tb_2').className = "tbListDef";
    document.getElementById('tb_3').className = "tbListDef";
    document.getElementById('tb_'+idx).className = "tbListSel";
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


///待办
var pendingInfoArray;
function setPendOder(){//待办
	document.getElementById('oFlowLoadImgDiv').innerHTML = '<img src="resource/image/itsmImages/loading3.gif" style="margin:-130px 0 0 0px;">';
	document.getElementById('oFlowList').innerHTML =  '<table id="pendingList" cellpadding="0" cellspacing="0" >'+
																				'<tr><td height="8" colspan="2">&nbsp;</td></tr></table>';
	document.getElementById("msgCountDiv").innerHTML="";
	loadPendingList();//待办明细
	waitTODO();//待办汇总
	document.getElementById('oFlowLoadImgDiv').innerHTML = '';
}
function loadPendingList()//待办明细
{
	var pendingInfo;	
	var pendingList = ResultFactory.newResult("PENDING_LIST");
	pendingList.onLoad = function(oXml)
	{
		var pendingType;
		var pendingTitle;
		var aPendingRow;
		var aPendingCell;
		var aPendingTable = document.getElementById("pendingList");
		//删除待办列表记录
		var rowLength = aPendingTable.rows.length;
		for(var i=rowLength-1; i>=2; i--)
		{
			aPendingTable.deleteRow(aPendingTable.rows(i).rowIndex);
		}
		//加载待办列表记录
		var resultRows = oXml.selectNodes("/root/rowSet");
		
		pendingInfoArray = new Array(resultRows.length);
		for(var i=0; i<resultRows.length; i++) {
		
			pendingInfo = getPendingInfo(resultRows[i]);
			pendingInfoArray[i] = pendingInfo;
		
			aPendingRow = aPendingTable.insertRow(aPendingTable.rows.length);
			aPendingCell = aPendingRow.insertCell(0);
			aPendingCell.className = "mid_content_d"; 
			pendingType = "<img align='absMiddle' style='margin-right: 8px;' src='resource/image/niImages/ni_title_img_3.gif' complete='complete'/>";
			pendingType += "<span style='display:-moz-inline-box;display:inline-block;width:120px;font-size:13px;color:#2167AC;overflow:hidden;'>" + pendingInfo.type_name + "</span>";
			pendingTitle = "<a class='flowItem' href='javascript:openSingle(" + i + ")'>"+
						   "<span style='color:#2167AC;' onMouseOver=this.style.color='#FF0000' onMouseOut=this.style.color='#2167AC'>" + ellipsisOverText(pendingInfo.content, 30) + "</span></a>";
			aPendingCell.innerHTML =  pendingType + pendingTitle;
		}
		addRowEmpty(aPendingTable, resultRows.length, 7);
	}
	var pendingListParam = {P_ROWNUM:8};
	pendingList.send(Result.FORCE_GET, pendingListParam);
}

function addRowEmpty(tableName, startRow, endRow)
{
	var aRow;
	var aCell;
	for(var i=startRow; i<endRow; i++)
	{
		aRow = tableName.insertRow(tableName.rows.length);
		aCell = aRow.insertCell(0);
		i%2==0 ? aCell.className = "mid_content_d" : aCell.className = "mid_content_s";
		aCell.innerHTML = "&nbsp;";
	}
}

function getPendingInfo(aRowSet)
{
	//待办记录信息
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
		thetype:aRowSet.childNodes[11].text
	}
	return pendingInfo;
}

function ellipsisOverText(text, maxLength) 
{
	if (text !=null && text.length > maxLength) {
		return text.substring(0, maxLength) + "...";
	}
	return text;
}


function openSingle(index) {
	if(index == null || typeof(index)=='undefined'){
		return;
	}
	var pendingInfo = pendingInfoArray[index];
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
	  		if(isBindForm=="0")//无表单流程
	  			curr_window=window.open('/TacheExec?tch_id=' +content_id+'&system_code=G','SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  		else
	  			curr_window=window.open(send_url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  	}
	  	else{
	  		curr_window=window.open(send_url,'SparePartEdit','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
	  	}
	}else{
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


//待办汇总
function waitTODO(){
	var outHTML = "";
	var msgList = ResultFactory.newResult("WAITTODO_LIST");
	msgList.onLoad = function(oXml)
	{
		var msgType;
		var msgTitle;
		var msgRow;
		var msgCell;
		var msgCountDiv = document.getElementById("msgCountDiv");
		
		var rowSetList = oXml.selectNodes("/root/rowSet");	
		if(rowSetList.length != 0) {
			outHTML += '<table class="ni_msgInfoTable" align="center" border="0" cellspacing="0" cellpadding="0" style="margin:4px 0px;">';
			for(var i=0;i<rowSetList.length;i++){
				var bgColor="#FFFFFF";;
				if(i%2==1){
					bgColor = "#F6F6F6";
				}
				outHTML +=  '<tr style="background-color:'+bgColor+';">';
				outHTML +=  '	<th>'+ rowSetList[i].selectSingleNode("FLOW_NAME").text +'：</th>'; 
				outHTML +=  '	<td>';
				if ( rowSetList[i].selectSingleNode("TYPE12_NUM").text >0){
					outHTML +=  '<span style="width:75px;text-align:left;font-weight:bold;cursor:hand;" onClick="displayMaxWindow(\''+rowSetList[i].selectSingleNode("SEND_URL").text+'\',true)" onMouseOver="this.style.color=\'#FF0000\'; this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\'; this.style.textDecoration=\'none\';" title="点击查看">';
					outHTML +=  '待办理:';
					outHTML +=  '<font style="color:#FF0000;font-weight:normal;">'+ rowSetList[i].selectSingleNode("TYPE12_NUM").text +'</font>';
					outHTML +=  '</span>';
				}
				if ( rowSetList[i].selectSingleNode("TYPE3_NUM").text >0){
					outHTML +=  '<span style="width:60px;text-align:left;font-weight:normal;cursor:hand;" onClick="displayMaxWindow(\''+rowSetList[i].selectSingleNode("SEND_URL").text+'\',true)" onMouseOver="this.style.color=\'#FF0000\'; this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\'; this.style.textDecoration=\'none\';" title="点击查看">';
					outHTML +=  '发起:';
					outHTML +=  '<font style="color:#FF0000;font-weight:normal;">'+ rowSetList[i].selectSingleNode("TYPE3_NUM").text +'</font>';
					outHTML +=  '</span>';
				}
				if ( rowSetList[i].selectSingleNode("TYPE100_NUM").text >0){
					outHTML +=  '<span style="width:75px;text-align:left;font-weight:normal;cursor:hand;" onClick="displayMaxWindow(\''+rowSetList[i].selectSingleNode("SEND_URL").text+'\',true)" onMouseOver="this.style.color=\'#FF0000\'; this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\'; this.style.textDecoration=\'none\';" title="点击查看">';
					outHTML +=  '已办理:';
					outHTML +=  '<font style="color:#FF0000;font-weight:normal;">'+ rowSetList[i].selectSingleNode("TYPE100_NUM").text +'</font>';
					outHTML +=  '</span>';
				}
				outHTML +=  '	</td>';
				outHTML +=	'</tr>';
			}
			outHTML += '</table>';
		}else {
			outHTML += '<div style="line-heigth:35px; color:#0066CD; padding:0 0 6px 5px;">您好！您目前无待办工作！</div>';
		}
		msgCountDiv.innerHTML = outHTML;
	}
	var staffId = getCurrentStaffId();
	var msgListParam = {USER_ID:staffId};
	msgList.send(Result.FORCE_GET, msgListParam);
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

//WebIM对应打开"飞鸽传书"，保持在线
var staffStateXmlHttp;
var stateId = "";
var reloadStateTimeout = 120000;
function sendBroadcastMessage()
{
    var iWidth = 720;
    var iHeight = 500;
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
    sFeatures.push("status=0");
    sFeatures.push("titlebar=0");
    sFeatures.push("toolbar=0");
    window.open("workshop/serviceDesk/service_messages.htm?isOnDuty=0", "", sFeatures.join(","));   
}


//显示最大化页面
function displayMaxWindow(url, name, isCheckPrivilege)
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
    window.open(url, name, sFeatures.join(","));
}


function openNormalWindow(url, name, isCheckPrivilege)
{    
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

function doMenuReplace(frameName,mainFrame,url)
{
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
    window.open("indexITSMFrame.jsp?mainUrl="+encodeURIComponent(url),"_blank",sFeatures.join(","));             
	top.window.close();
}
/*
 * 判断某用户是否有某菜单ID的权限 privilegeId：菜单ID，staffId：用户ID（为空时为当前用户）； add laixh 20100411
 */
function getHasPrivilege(privilegeId, staffId) {
	if (privilegeId == "" || privilegeId == undefined) {
		return "false";
	}
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("get", "/servlet/staff_manage?tag=99&privilegeId="
					+ privilegeId + "&staffId=" + staffId, false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		return oXMLHTTP.responseXML.selectSingleNode("/root/HAS_PRIVILEGE").text;
	}
}