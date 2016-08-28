var waiteTime;
function onLoadData(){
	//加载集团ITSM首页菜单栏和工作导航、客户端下载--(resource/js/index_navigation.js)
	navJTITSM();	
	iniBillInfos();//加载公告（滚动效果）
	
	refreshGrid();//加载代办
	loadTrackList();//加载待办跟踪
	
	loadOftenFunction();//加载常用功能
	loadFriendshipLink();//加载友情链接
	curTab = 1;//初始化tab为待办明细（刷新功能用到）
	
	var dataObj = new Object();
	knowledgeConfig.init();
	dataObj.source = 'sql';
	dataObj.pageFlag = '1';   	
	getModelData(dataObj);	//发送请求加载模块 个人定制模块
	//定时刷新待办
	waiteTime = $getSysVar('JTITSM_UNREAD_WAITE_TIME');//刷新频率
	onlineNum(waiteTime);
	waiteTime = waiteTime&&waiteTime!='' ? waiteTime:300000;
	setTimeout(function(){
		refreshMsgInfo();
	},waiteTime);
}

//页面自适应
/*function window.onresize(){
	var wrap = $(".logoDiv");
   if(document.body.clientWidth <1250){  
       for(var i = 0  ;i < wrap.length ; i++){
           wrap[i].style.width = 1250;
       }
   }else{
       for(var i = 0  ;i < wrap.length ; i++){
           wrap[i].style.width = document.body.clientWidth;
       }
   }   
}*/

function getObj(obj){
    return document.getElementById(obj);
}
function showObj(name){
    getObj(name).style.display = "block";
}
function hideObj(id){
    getObj(id).style.display = "none";
}
	//下拉查询
	function searchBySelect(divId){
		var titlePosition = GetAbsoluteLocationEx(type_name_id);
		
		getObj(divId).style.height = 60;
		getObj(divId).style.width = titlePosition.offsetWidth;
		getObj(divId).style.top = titlePosition.absoluteTop + titlePosition.offsetHeight;
		getObj(divId).style.left = titlePosition.absoluteLeft;
		//getObj(divId).style.display = "";
		$("#"+divId).slideDown("fast");
		$("body").bind("mousedown", onBodyDownForSelect);		
	}
	function onBodyDownForSelect(event) {
		if (!mousePon) {			
			$("#divSelectId").slideUp("fast");
			$("#SearchText").slideUp("fast");
			mousePon=true;
		}
	}
	
	function selectValue(code,mean){
		getObj("type_name_id").value=mean;
	}
	
// 获取元素在页面上的绝对位置	
function GetAbsoluteLocationEx(element) {
    if ( arguments.length != 1 || element == null ) {
        return null;
    }
    var elmt = element;
    var offsetTop = elmt.offsetTop;
    var offsetLeft = elmt.offsetLeft;
    var offsetWidth = elmt.offsetWidth;
    var offsetHeight = elmt.offsetHeight;
    while( elmt = elmt.offsetParent ) {
        if ( elmt.style.position == 'absolute' || elmt.style.position == 'relative' || ( elmt.style.overflow != 'visible' && elmt.style.overflow != '' ) ) {
            break;
        }
        offsetTop += elmt.offsetTop;
        offsetLeft += elmt.offsetLeft;
    }
    
    return { absoluteTop: offsetTop, absoluteLeft: offsetLeft, offsetWidth: offsetWidth, offsetHeight: offsetHeight };
}

function nameMouseOver(){
	document.getElementById("userNameDiv").className="userNameOver";
	document.getElementById("showDivId").style.display="";
}
function nameMouseOut(){
	document.getElementById("userNameDiv").className="userName";
	document.getElementById("showDivId").style.display="none";
}

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
                                outHTMLStr += " onClick=\"doMenu_open('" + serverUrlName + "','',''," + menuList[i].getAttribute("id") + ")\" ";
                          }else{
                                outHTMLStr += " onClick=\"niOpenWind('" + serverUrlName + "',true)\" ";
                          }
                          outHTMLStr += ">"; 
                          outHTMLStr += favoriteName; 
                          outHTMLStr += "</a>";
                      }
                  }catch(e){continue}
                }
            }
        }
        document.getElementById('shortCutMenu').innerHTML = outHTMLStr + "<div style=\"clear:both;\"></div>";
    } 
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
    sFeatures.push("location="+1);
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
    doMenu_open(url);
	return;//都用打开新窗口方式
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


//-------------常用功能开始--------

function loadOftenFunction(){
	var busiClassList = ResultFactory.newResult("JT_ITSM_OFTEN_FUNCTION");
	if(!busiClassList) {
		return;
	}
	busiClassList.onLoad=function(oXML){
		var oRows = oXML.selectNodes('/root/rowSet');
		var outHTML = '';
		if(oRows.length != 0) {
			for(var i=0;i<oRows.length;i++){
				var v_function_id = oRows[i].childNodes[0].text;
				var v_short_description = oRows[i].childNodes[1].text;
				var v_icon = oRows[i].childNodes[2].text;
				var v_server_url_name = oRows[i].childNodes[6].text;
				outHTML += '<a href="'+v_server_url_name+'" target="_blank" style="background-image:url('+v_icon+');"><span title="'+v_short_description+'">'+v_short_description+'</span></a>';
			}
		}else {
            outHTML += '<div style="line-heigth:35px; color:#0066CD; padding:0 0 6px 5px; margin-top:30px;">您好！您目前无常用功能！</div>';
        }
		oftenFunctionDiv.innerHTML = outHTML;
	}
	busiClassList.async=true;
	busiClassList.send(Result.FORCE_GET,{V_CURRENT_STAFF_ID:curStaffId});
}

//-------------常用功能结束--------

//-------------友情链接开始--------

function loadFriendshipLink(){
	var busiClassList = ResultFactory.newResult("JT_ITSM_INDEX_FRIENDSHIP_LINK");
	if(!busiClassList) {
		return;
	}
	busiClassList.onLoad=function(oXML){
		var oRows = oXML.selectNodes('/root/rowSet');
		var outHTML = '<span class="footerWrapSpan">友情链接：</span>';
		if(oRows.length != 0) {
			for(var i=0;i<oRows.length;i++){
				var v_link_value = oRows[i].childNodes[0].text;
				var v_link_title = oRows[i].childNodes[1].text;
				outHTML += '&nbsp;&nbsp;&nbsp;<a class="footerWrapSpan" href="'+v_link_value+'" target="_blank">'+v_link_title+'</a>';
			}
		}
		outHTML += '<br/>';
		friendshipLink.innerHTML = outHTML;
	}
	busiClassList.async=true;
	busiClassList.send(Result.FORCE_GET,{});
}

//-------------友情链接结束--------


//-------------代办方块开始--------

var curTab;
function refreshAll(){
	if(curTab==1){//加载待办
		WaitLoadingMsgInfo.showWaitMsgInfo("待办明细加载中...");
		refreshGrid();
	}
	else if(curTab==2){//加载阅办
		WaitLoadingMsgInfo.showWaitMsgInfo("阅办加载中...");
		pendingListCount();
		loadPendingList("ITSM_NEW_INDEX_READ","readPageTable","1");}
	else if(curTab==3){//加载待办汇总	
		setMsgInfo();
	}
	else if(curTab==4){//加载待办跟踪
		WaitLoadingMsgInfo.showWaitMsgInfo("待办跟踪加载中...");
		loadTrackList();
	}
}

//代办刷新按钮流程 类型代办执行完刷新
function refreshGrid(){
	pendingListCount();//统计代办\已阅的个数
	loadPendingList("ITSM_NEW_INDEX_EVENT","eventPageTable","0");
}
//定时刷新待办
function refreshMsgInfo(){
	if(curTab==1){//加载待办
		WaitLoadingMsgInfo.showWaitMsgInfo("待办明细加载中...");
	}else if(curTab==2){//加载阅办
		WaitLoadingMsgInfo.showWaitMsgInfo("阅办加载中...");
	}
	refreshGrid();
	pendingListCount();
	loadPendingList("ITSM_NEW_INDEX_READ","readPageTable","1");
	setTimeout(function(){refreshMsgInfo()},waiteTime);
}
// 代办 阅办等切换
var eventTabArr = ['eventPage','trackPage','readPage','eventCollectPage'];
var readPageFalg = false;
var eventCollectPageFalg = false;
function selectTab(obj,tabId){
	for(var i = 0; i < eventTabArr.length; i ++ ){
		if(eventTabArr[i] == tabId){
			document.getElementById(eventTabArr[i]).style.display = '';
		}else{
			document.getElementById(eventTabArr[i]).style.display = 'none';
		}
	}
	var wrap2 = $(".personCenter_AA");
    for(var i = 0  ;i < wrap2.length ; i++){
       wrap2[i].className="personCenter_AA";
    }
    var wrap1 = $(".personCenter_AA_over");
    for(var i = 0  ;i < wrap1.length ; i++){
       wrap1[i].className="personCenter_AA";
    }
    obj.className="personCenter_AA_over";
	
	if(tabId=='eventPage'){curTab=1;}
	else if(tabId=='readPage'){curTab=2;}
	else if(tabId=='eventCollectPage'){curTab=3;}
	else if(tabId=='trackPage'){curTab=4;}
	
	if(tabId == 'readPage'){
		if(!readPageFalg){
			loadPendingList("ITSM_NEW_INDEX_READ","readPageTable","1");//加载阅办
			readPageFalg = true;
		}
	}else if(tabId == 'eventCollectPage'){
		if(!eventCollectPageFalg){
			setMsgInfo();//加载待办汇总
			eventCollectPageFalg = true;
		}
	}
}


//首页代办配置在sql_cfg中
var pendingInfoArray0;
var pendingInfoArray1;
function loadPendingList(paramName,tableName,num){
	var pendingInfo;		
	var pendingList = ResultFactory.newResult(paramName);
	var page_size = 8;
	pendingList.onLoad = function(oXml)
	{
		var pendingTitle = "";
		var pendingStateDate = "";
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
		var rowsNum=resultRows.length;
		var loopTimes;
		if (rowsNum>page_size){
			loopTimes =page_size;
		}else{
			loopTimes =rowsNum;
		}
		var pendingInfoArray = new Array(resultRows.length);
		for(var i=0; i<loopTimes; i++) {
			pendingInfo = getPendingInfo(resultRows[i]);
			pendingInfoArray[i] = pendingInfo;
			aPendingRow = aPendingTable.insertRow(aPendingTable.rows.length);
			aPendingCell = aPendingRow.insertCell(0);
			aPendingCell.className = "mid_content_d";
            var contentTitle =  pendingInfo.content ;
			         
            if(num == "0"){
            	/*pendingTitle = "<span class='daibanNameDiv_1' title='" + pendingInfo.type_name + "'>" + "【待办类型】" + "</span><span class='daibanNameDiv_2'><a href='javascript:openSingle(" + i+","+num + ")' title='"+contentTitle+"'>" + pendingInfo.content + "</a></span>";*/
            	pendingTitle = "<span class='daibanNameDiv_4'><a href='javascript:openSingle(" + i+","+num + ")' title='"+contentTitle+"'>" + pendingInfo.content + "</a></span>";
    			pendingStateDate="<span class='daibanNameDiv_3'>" +pendingInfo.state_date +"</span>";
            }else{
            	pendingTitle = "<span class='daibanNameDiv_4'><a href='javascript:openSingle(" + i+","+num + ")' title='"+contentTitle+"'>" + pendingInfo.content + "</a></span>";
            	pendingStateDate="<span class='daibanNameDiv_3'>" +pendingInfo.state_date +"</span>";
            }
			aPendingCell.innerHTML = pendingTitle+pendingStateDate;
		}
		
		//判断是哪种代办
		if(num=="0"){
			pendingInfoArray0=pendingInfoArray;
		}
		if(num=="1"){
			pendingInfoArray1=pendingInfoArray;
		}					
		addRowEmpty(aPendingTable, resultRows.length, page_size);
		WaitLoadingMsgInfo.hideWaitMsgInfo();
	}
	pendingList.async=true;
	//var pendingListParam = {P_START_ROW:startRow, P_END_ROW:endRow};
	pendingList.send(Result.FORCE_GET,'');
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
	  	if(event_type_id=="3"){//已启动
	  		if(isBindForm=="0")//无表单流程
	  			curr_window=window.open('/FlowBrowse?flow_id=' +content_id+'&system_code=G');
	  		else
	  			curr_window=window.open(send_url,'SparePartEdit');
	  	}else if (event_type_id=="2"){//待办
	  		send_url = "/workshop/form/index.jsp?tchId="+content_id+"&callback=opener.refreshGrid()&fullscreen=yes";
	  		if(isBindForm=="0")//无表单流程
	  			curr_window=window.open('/TacheExec?tch_id=' +content_id+'&system_code=G');
	  		else
	  			curr_window=window.open(send_url);
	  	}else if (event_type_id=="g"){//阅办
	  		send_url = "/workshop/form/index.jsp?tchId="+content_id+"&callback=opener.refreshGrid()&fullscreen=yes&type=view";
	  		curr_window=window.open(send_url);
	  	}
	  	else{//非流程类表单
	  		curr_window=window.open(send_url);
	  	}
	}else if(thetype==04){
        send_url = "/workshop/form/index.jsp?flowId=" + content_id + "&showStat=1&callback=opener.refreshGrid()&fullscreen=yes";
        curr_window = window.open(send_url);
    } else{
		if(event_type_id=="0" || event_type_id=="1" || event_type_id=="2"
			|| event_type_id=="3" || event_type_id=="g" || event_type_id=="H"){//这几个类型有走 流程在待办的已处理事务里直接打开流程图
	  		curr_window=window.open('/FlowBrowse?flow_id=' +content_id+'&system_code=G');
	  	}
	  	else{
	  		curr_window=window.open('/OtherWorkAccept?type='+type+'&id='+selectedRows);
	  	}
	}
	curr_window.focus();
}

//待办汇总
function setMsgInfo(){
	WaitLoadingMsgInfo.showWaitMsgInfo("待办汇总加载中...");
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.open("post","servlet/EventPageSimple?tag=3",true);    //"/servlet/Flows_Count?staff_id="+staffId,true);
    xmlhttp.send(null);
    xmlhttp.onreadystatechange=function(){
	    renderTODOList(xmlhttp);
	    WaitLoadingMsgInfo.hideWaitMsgInfo();
	    //window.setTimeout("WaitLoadingMsgInfo.hideWaitMsgInfo()", 2000);
    }
}

function renderTODOList(xmlhttp){
    var state = xmlhttp.readyState;
    if(state!=4)return;
    var outHTML = "";
        var rowSetList = xmlhttp.responseXML.selectNodes("/root/rowSet");
        if(rowSetList.length != 0) {
            outHTML += '<table class="" align="left" border="0" cellspacing="0" cellpadding="0" style="margin:0;">';
            for(var i=0;i<rowSetList.length;i++){
                var flowMod = rowSetList[i].selectSingleNode("flow_mod").text;
                var bgColor="#FFFFFF";;
                if(i%2==1){
                    bgColor = "#F6F6F6";
                }
                outHTML +=  '<tr style="background-color:'+bgColor+';height:30px;width:100%;border-bottom: 1px solid #cdcdcd;">';
                outHTML +=  '   <td style="height:30px;width:270px;"><span style="width:250px;float:left;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+ rowSetList[i].selectSingleNode("flow_name").text +'：</span></td>'; 
                outHTML +=  '   <td style="height:30px;width:520px;">';
                if ( rowSetList[i].selectSingleNode("type12_num").text >0){
                    outHTML +=  '<span style="width:135px;float:left;cursor:hand;text-align:left;" onClick="changeTab(1,'+ rowSetList[i].selectSingleNode("queryResultId").text+','+rowSetList[i].selectSingleNode("flow_mod").text+')" onMouseOver="this.style.color=\'#FF0000\'; this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\'; this.style.textDecoration=\'none\';" title="点击查看">';
                    outHTML +=  '待办理:';
                    outHTML +=  '<font style="color:#FF0000;font-weight:normal;">'+ rowSetList[i].selectSingleNode("type12_num").text +'</font>';
                    outHTML +=  '</span>';
                }
                if ( rowSetList[i].selectSingleNode("type3_num").text >0){
                    outHTML +=  '<span style="width:135px;float:left;cursor:hand;text-align:left;" onClick="changeTab(2,'+ rowSetList[i].selectSingleNode("queryResultId").text+','+rowSetList[i].selectSingleNode("flow_mod").text+')" onMouseOver="this.style.color=\'#FF0000\'; this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\'; this.style.textDecoration=\'none\';" title="点击查看">';
                    outHTML +=  '发起:';
                    outHTML +=  '<font style="color:#FF0000;font-weight:normal;">'+ rowSetList[i].selectSingleNode("type3_num").text +'</font>';
                    outHTML +=  '</span>';
                }
                if ( rowSetList[i].selectSingleNode("type100_num").text >0){
                    outHTML +=  '<span style="width:135px;float:left;cursor:hand;text-align:left;" onClick="changeTab(3,'+ rowSetList[i].selectSingleNode("queryResultId").text+','+rowSetList[i].selectSingleNode("flow_mod").text+')" onMouseOver="this.style.color=\'#FF0000\'; this.style.textDecoration=\'underline\';" onMouseOut="this.style.color=\'\'; this.style.textDecoration=\'none\';" title="点击查看">';
                    outHTML +=  '已办理:';
                    outHTML +=  '<font style="color:#FF0000;font-weight:normal;">'+ rowSetList[i].selectSingleNode("type100_num").text +'</font>';
                    outHTML +=  '</span>';
                }
                outHTML +=  '   </td>';
                outHTML +=  '</tr>';
            }
            outHTML += '</table>';
        }else {
            outHTML += '<div style="line-heigth:35px; color:#0066CD; padding:0 0 6px 5px; margin-top:30px;">您好！您目前无待办工作！</div>';
        }
    xmlhttp = null;
    eventCollectPage_div.innerHTML = outHTML;
}

var WaitLoadingMsgInfo = {

    eleId: undefined,

    hideWaitMsgInfo: function() {
        var oWait;
        if (this.eleId != null && (oWait = document.getElementById(this.eleId)) != null) {
            oWait.style.display = "none";
        }
    },
    
    showWaitMsgInfo: function(text, oParent) {
        if (text == null) {
            text = '数据加载中...';
        }
        if (oParent == null) {
            oParent = window.document.body;
        }
        var oWait;
        //if (this.eleId == null || (oWait = document.getElementById(this.eleId)) == null) {
            this.eleId = document.uniqueID;
            var sDivHTML = "<div id='" + this.eleId + "' style='width:165px;height:60px;z-index:1000;border:4px solid #FBFBFB;display:none;position:absolute;'>" + "<div style='width:160px;height:55px;border:2px solid #ADD4EC;background-color:#FAFDFF;'>" + "<div style='width:35px;;float:left; margin:13px 0 0 8px; border:0px solid #eee;'>" + "<img src='/resource/image/itsmImages/loading3.gif'/>" + "</div>" + "<div style='width:90px;float:left;color:#0B4696;font:12px/18px 宋体; margin:8px 0 0 5px;border:0px solid #eee;'>" + text + "</div>" + "</div></div>";
            oParent.insertAdjacentHTML("beforeEnd", sDivHTML);
            oWait = document.getElementById(this.eleId)
        //}
        oWait.style.pixelLeft = 300;
        oWait.style.pixelTop = 450;
        oWait.style.display = "block";
    }
};

//待办跟踪
function loadTrackList(){
	var pendingInfo;		
	var pendingList = ResultFactory.newResult("JTITSM_TRACK_LIST");
	var page_size;
	pendingList.onLoad = function(oXml)
	{
		var pendingTitle = "";
		var pendingStateDate = "";
		var pendingFlowType
		var aPendingRow;
		var aPendingCell;
		var aPendingTable = document.getElementById("trackPageTable");
		//删除列表记录
		var rowLength = aPendingTable.rows.length;
		for(var i=rowLength-1; i>=0; i--)
		{
			aPendingTable.deleteRow(aPendingTable.rows(i).rowIndex);
		}
		//加载列表记录
		var resultRows = oXml.selectNodes("/root/rowSet");
		page_size = resultRows.length;
		var pendingInfoArray = new Array(resultRows.length);
		for(var i=0; i<page_size; i++) {
			document.getElementById("trackNum").innerHTML = page_size;
			
			var flowId = resultRows[i].childNodes[0].text;
			var flowTitle = resultRows[i].childNodes[1].text;
			var flowCreatedDate	= resultRows[i].childNodes[2].text;
			
			aPendingRow = aPendingTable.insertRow(aPendingTable.rows.length);
			aPendingCell = aPendingRow.insertCell(0);
			aPendingCell.className = "mid_content_d";
			         
            pendingTitle = "<span class='daibanNameDiv_4'><a href='/workshop/form/index.jsp?fullscreen=yes&flowId="+ flowId +"&system_code=G' target='_blank' title='"+flowTitle+"'>" + flowTitle + "</a></span>";
    		pendingStateDate="<span class='daibanNameDiv_3'>" +flowCreatedDate +"</span>";
			aPendingCell.innerHTML = pendingTitle+pendingStateDate;
		}
		if(page_size <= 8) page_size = 8;
		addRowEmpty(aPendingTable, resultRows.length, page_size);
		WaitLoadingMsgInfo.hideWaitMsgInfo();
	}
	pendingList.async=true;
	pendingList.send(Result.FORCE_GET,'');
}

function changeTab(type,queryResultId,flow_mod){
    //result:是monitor_menu表的monitor_id
    //tab顺序:1待办理 2:发起 3:已处理 4:全部
    //menutree:决定是否显示左边的树(0隐藏，1显示，默认显示)
    var url ="workshop/queryTemplate/main.html?id="+queryResultId+"&tab="+type+"&flow_mod="+flow_mod+"&menutree=0";
    niOpenWind(url,true);
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
    location.replace("index_ITSMFrame.jsp?mainUrl="+encodeURIComponent(url));
   // location.replace(encodeURIComponent(url));
}

//统计代办个数
function pendingListCount()
{
	var d = ResultFactory.newResult("ITSM_NEW_INDEX_COUNT");
	d.onLoad=function(oXML){
		var oRows = oXML.selectNodes('/root/rowSet');
		document.getElementById("eventNum").innerHTML = oRows[0].childNodes[0].text;
		//document.getElementById("messageNum").innerHTML = oRows[0].childNodes[1].text;
		document.getElementById("readNum").innerHTML = oRows[0].childNodes[2].text;		
	};
	d.async=true;
	d.send(Result.FORCE_GET,null);
}

//-------------代办方块结束--------


//菜单栏-鼠标移入移出方法
var getByClass = function (oParent, sClass) {
	var aEle = oParent.getElementsByTagName("*");
	var re = new RegExp("\\b" + sClass + "\\b");
	var arr = [];
	for (var i = 0; i < aEle.length; i++) {
		if (re.test(aEle[i].className)) {
			arr.push(aEle[i]);
		}
	}
	return arr;
}
var setMainNav = function () {
	var oMainNav = getObj("mainNav");
	var aLi = getByClass(oMainNav, "navMenuLi");
	var aGameHover = getByClass(oMainNav, "game_hover");
	var aHoverCont = getByClass(oMainNav, "hover_cont");
	for (var i = 0; i < aGameHover.length; i++) {
		aGameHover[i].index = i;
		aGameHover[i].onmouseover = function () {
			this.className += " "+"game_hover_current";
			for (var j = 0; j < aHoverCont.length; j++) {
				aHoverCont[j].index_j = j;
				aHoverCont[j].style.display = "none";
				aHoverCont[j].onmouseover = function () {
					this.style.display = "block";
					aGameHover[this.index_j].className += " "+"game_hover_current";
				}
				aHoverCont[j].onmouseout = function () {
					this.style.display = "none";
				}
			}
			if (aHoverCont[this.index]) {
				aHoverCont[this.index].style.display = "block";
			}
		}
	}
	for (var i = 0; i < aLi.length; i++) {
		aLi[i].index = i;
		aLi[i].onmouseout = function () {
			if (aHoverCont[this.index]) {
				aHoverCont[this.index].style.display = "none";
			}
			aGameHover[this.index].className = "game_hover";
		}
	}
}


/**
 *   加载内部公告(信息发布)*
 */
var bill_titles = [];
var bill_dates = [];
var bill_info_ids = [];
var bill_category_names = [];
var billCount = 0;//公告总条数
function iniBillInfos()
{
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var list_number =10000;//定义显示的记录个数（10000：全部）
	var submitURL = "/servlet/billInfoServlet?tag=41&recent=5";
    xmlhttp.Open("POST",submitURL,true);
    xmlhttp.send(null);
    
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readystate == 4) {
        	var dXML = new ActiveXObject("Microsoft.XMLDOM");
            dXML.load(xmlhttp.responseXML);
            
            var hasPrivilege = dXML.selectSingleNode("/root/HAS_PRIVILEGE").text;
            if(hasPrivilege=="true"){
        	    var oRows=dXML.selectNodes("/root/BILL_INFOS/rowSet");
        	    billCount=oRows.length;
        	    for(var i=0;i<billCount;i++)
        	    {
        	    	bill_titles[i] = oRows[i].selectSingleNode("TITLE").text;
        	    	bill_dates[i] = oRows[i].selectSingleNode("SUBMIT_DATE").text;
        	    	bill_info_ids[i] = oRows[i].selectSingleNode("BILL_INFO_ID").text;
        	    	bill_category_names[i] = oRows[i].selectSingleNode("CATEGORY_NAME").text;
        	    }
            }
        	loadBillInfos();
        	ScrollImgLeft();
        }
	}       
}

//走马灯方法
function ScrollImgLeft(){ 
	var speed=15 ;
	var scroll_begin = document.getElementById("scroll_begin"); 
	var scroll_end = document.getElementById("scroll_end"); 
	var scroll_div = document.getElementById("scroll_div"); 
	scroll_end.innerHTML=scroll_begin.innerHTML;
	function Marquee(){ 
		if(scroll_end.offsetWidth-scroll_div.scrollLeft<=0) 
			scroll_div.scrollLeft-=scroll_begin.offsetWidth ;
		else 
			scroll_div.scrollLeft++ ;
	} 
	var MyMar=setInterval(Marquee,speed) 
	scroll_div.onmouseover=function() {
		clearInterval(MyMar);
	} 
	scroll_div.onmouseout=function() {
		MyMar=setInterval(Marquee,speed);
	} 
} 
//实现地方
var billStartRow = 1;
var billEndRow = 1;
function loadBillInfos(){
	if(billCount != 0){
		if(billStartRow == billCount){
			billEndRow = billStartRow;
	    }
		var tableStr="<div style='margin-left:20px;'><div> <div class='sqBorder'><div id='scroll_div' class='scroll_div'><div id='scroll_begin'><ul>";
	    var item = "";
	    for(var i=(billStartRow-1);i<bill_titles.length;i++)
	    {
	    	var title = bill_titles[i];
	    	var date = bill_dates[i];
	    	var boardInfoId = bill_info_ids[i];
	    	var category_name = bill_category_names[i];
	    	item += "<li>"
	    	item += "<a class='colorCss1' onclick=\"showBillInfoWindow(3,'"+boardInfoId+"','"+category_name+"')\" width='70%'><IMG SRC='resource/image/indexITSM3/gonggao.png'>";
	    	item += "<span title='"+ title +"' style='margin-left:10px;'>"+title+"</span></a>";
	    	item += "<span  style='margin-left:50px;'>"+date+"</span></a></li><li><span style='margin-left:100px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></li>";
	    }
	    tableStr = tableStr+item+"</ul></div><div id='scroll_end'></div></div></div></div></div><div class='clear-b'></div>";
	    scrollList.innerHTML=tableStr;
	    
	    if(billStartRow == billCount || billEndRow == billCount){
	    	billStartRow = 1;
	    	billEndRow = 1;
	    }else{
	    	billStartRow=billStartRow+1;
	    	billEndRow=billEndRow+1;
	    }
	}else{
		var tableStr =	"<div><table border='0' width='100%' height='100%' cellspacing='0'>" +
						"<tr><td class='bill_table_td'><div class='billinfoTitleDiv'>" +
						"<IMG SRC='resource/image/indexITSM3/gonggao.png'>" +
						"<a class='colorCss1'><span title='无' style='margin-left:10px;'>无</span></a>" +
						"</td></tr>" +
						"</table></div>";
		scrollList.innerHTML=tableStr;
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
}
function MM_openBrWindow(theURL,winName) {
	var curr_window;
	x=(window.screen.width-780)/2;
	y=(window.screen.height-580)/2;
	curr_window=window.open(theURL,winName,'scrollbars=yes,width=780,height=580,resizable=yes');
	curr_window.focus();
}

function openFunctionNavigation(){
	window.open("/workshop/servicedirectory/index.jsp");
}
//返回登陆页
function goToEnter(){
	location.replace(enterUrl);
	if(enterUrl=="/LoginForm.jsp?flag=0" || enterUrl=="LoginForm.jsp?flag=0"){
		document.frmLogin.submit();
	}
}
//功能地图
 function showSysMap(){
     window.showModalDialog("../../workshop/itsmBJ/map_BJ_ITSM.jsp",null,"dialogWidth=500px;dialogHeight=566px;help=0;scroll=1;status=0;");
 }
//修改密码：
 function chagePswd(){
     window.showModalDialog("workshop/user/changePw.html",window,"dialogWidth=408px;dialogHeight=250px;help=0;scroll=0;status=0;");
 }
//角色转换：
 function windowOpenStaffChang() {
     window.showModalDialog("workshop/stafferrand/staffErrandInfoNoFilter.html",window,"dialogWidth=530px;dialogHeight=410px;help=0;scroll=0;status=0;");
 }
//修改信息：
 function editStaff(){
		window.showModalDialog("/workshop/user/individualInfo.jsp?tag=1",null,"dialogWidth=580px;dialogHeight=540px;help=0;scroll=0;status=0;");
 }
 //知识库搜素
 function searchEntrance(){
	queryString.value = queryString.value.trimall();
    var queryInput = queryString.value;
    if(queryInput.length==0)
    {
        MMsg("请输入搜索条件!");return;
    }
    var queryStr = encodeURIComponent(queryInput);
    
    if(getObj("type_name_id").value == "系统功能"){
        window.open("workshop/servicedirectory/index.jsp?queryString="+queryStr,false);
    }else if(getObj("type_name_id").value == "知识库"){
    	//var chk =1;//全文检索
    	//var openWin = window.open("/workshop/knowledge/knowledgeCenterNew.jsp?queryString="+queryStr+"&catalogId=&regionName=&orgId=&searchRange="+chk);
        var indexDir = "publish_index_directory";  //源
        var module = "knowledge";    //模块
        window.open("workshop/knowledge/knowledgeCenterNew.jsp?queryString="+queryStr+"&indexDirectory="+indexDir+"&module="+module+"&catalogId=",false);
    }
}
 function knowledgeOnFocus(){
	if(document.getElementById("queryString").value=="请输入搜索条件"){
		document.getElementById("queryString").value="";
	}
}

 //打开流程
function openFlowForm(flowNum){
	var flowMod=getFlowModByFlowNum(flowNum);
	if(flowMod!=""){
		window.open("workshop/form/index.jsp?flowMod="+flowMod);
	}	 
}

//控制字符串长度
function ellipsisOverText(text, maxLength) {
	if (text !=null && text.length > maxLength) {
		return text.substring(0, maxLength) + "...";
	}
	return text;
}
/**
 * 在线用户数
 */
function onlineNum(time){
	time = time ? time : 300000;
	$.ajax({
		type: 'get',
		url: '/JtitsmIndexController/onlineNum.do',
		dataType : 'json',
		cache : false,
		async: true,
		success:function(msg){
			if(msg && msg.errorCode == '0'){
				var num = formatNum(msg.onlineNum);
				$("#onlineNum").text(num);
				$(".onlineNum").show();
			}else{
				alert("获取用户在线数失败");
			}
			setTimeout(function(){onlineNum(time)},time);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			alert("提交失败");
		}
	});
}

function formatNum(str){
	str = '' + str ;
    if(str.length <= 3){
        return str;
    } else {
        return formatNum(str.substr(0,str.length-3))+','+str.substr(str.length-3);
    }
}



