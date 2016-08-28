var selfName = "menu.js";
var menuUrl = getRealPath("../../../servlet/menu?id=", selfName);
var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
var oSelectedItem;
var menuIndex = 0;
var menuLength = 0;
var showMenuLength = 0;

function addTopMenu(id, oMenuBar, curMenuId) {
	xmlhttp.Open("POST","../../../servlet/GdCommonRequest?tag=8&role_id="+id,true);
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp!==null && xmlhttp.readyState==4 && isSuccess(xmlhttp)) {		 
			xmlDoc.load(xmlhttp.responseXML);
			var xPath = "/root/rowSet";
			var oMenus = xmlDoc.selectNodes(xPath);
			var oMenu,oMenuLI,outHTML,isCurMenu;
			oMenuLI = "<table id = 'menuTable' border='0' cellspacing='0' cellpadding='0'><tr>";
			oMenuLI += "<td id='preMenuBtn' width='5px' style=\"color:gray;display:none;text-align='left'\" onclick='preMenu()'><font style='cursor:hand;font-family:Webdings;font-size:14px;'>3</font></td>";
			clearUL(oMenuBar);
			menuLength = oMenus.length;
			for(var i=0; i<oMenus.length; i++) {
				oMenu = oMenus[i];
				isCurMenu = (curMenuId == oMenu.getAttribute("PRIVILEGE_ID"));
				oMenuLI += "<td id='menuTd_"+i+"' style='height:28px'>";
                if(i == 0){
                  	oMenuLI += '<div class="menusel"><h2 id="menu_h2_'+i+'" style="border-left-width:0px;">';
                }else{
                	oMenuLI += '<div class="menusel"><h2 id="menu_h2_'+i+'">';
                }
				outHTML = '<a href="#" id="' + oMenu.getAttribute("PRIVILEGE_ID") + '"';
				
				//if(oMenu.getAttribute("MENU_LEVEL")=='2'){
					//一级菜单
					//outHTML += ' onclick="getNextMenu('+oMenu.getAttribute("PRIVILEGE_ID")+',oMenuBar)" ';
				//}else{
					if(oMenu.getAttribute("SCRIPT_NAME")&&oMenu.getAttribute("SCRIPT_NAME")!='') {
						outHTML += ' onclick="oSelectedItem=this;' + oMenu.getAttribute("SCRIPT_NAME") + '"';
						//outHTML += ' onclick="oSelectedItem=this;doMenu_open()"';
					}else{
						outHTML += ' onclick="oSelectedItem=this;doMenu_open()"';
					}
				//}
				
				if(oMenu.getAttribute("SERVER_URL_NAME")) {
					outHTML += ' SERVER_URL_NAME="' + oMenu.getAttribute("SERVER_URL_NAME") + '"';
				}				
				if(oMenu.getAttribute("CUSTOM_URL_NAME")) {
					outHTML += ' CUSTOM_URL_NAME="' + oMenu.getAttribute("CUSTOM_URL_NAME") + '"';
				}
				if (isCurMenu) {
					if (i === 0) {
						outHTML += ' style="font-weight:bold;">' + oMenu.getAttribute("PRIVILEGE_NAME");
					} else {
						outHTML += ' style="font-weight:bold;"><span>&nbsp;</span>' + oMenu.getAttribute("PRIVILEGE_NAME");
					}
				} else {
					if (i === 0) {
						outHTML += '>' + oMenu.getAttribute("PRIVILEGE_NAME");
					} else {
						outHTML += '><span>&nbsp;</span>' + oMenu.getAttribute("PRIVILEGE_NAME");
					}
				}				
				outHTML += '</a></h2></div>';				
				oMenuLI += outHTML;	
				oMenuLI += '</td>';	
			}
			oMenuLI += "<td id='nextMenuBtn' width='5px' style=\"display:none;text-align='right'\" onclick='nextMenu()'><font style='cursor:hand;font-family:Webdings;font-size:14px;'>4</font></td>";
			oMenuLI += '</tr></table>';
			document.getElementById('oMenuBar').innerHTML = oMenuLI;
			setShowMenu();
		}	
	};
	
	xmlhttp.send();
}

//加载下一级菜单
function getNextMenu(priId,oMenuBar){
	xmlhttp.Open("POST","../../../servlet/GdCommonRequest?tag=5&action=6&pri_id="+priId,false);
	xmlhttp.send();
	var oMenus = xmlhttp.responseXML.selectNodes("/root/rowSet");
	var oMenu,oMenuLI,outHTML,isCurMenu;
	oMenuLI = "<table id = 'menuTable'><tr>";
	oMenuLI += "<td id='preMenuBtn' width='5px' style=\"color:gray;display:none;text-align='left'\" onclick='preMenu()'><font style='cursor:hand;font-family:Webdings;font-size:14px;'>3</font></td>";
	clearUL(oMenuBar);
	menuLength = oMenus.length;
	for(var i=0; i<oMenus.length; i++){
		oMenu = oMenus[i];
		oMenuLI += "<td id='menuTd_"+i+"' style='height:28px;'>";
        if(i == 0){
           oMenuLI += '<div class="menusel"><h2 id="menu_h2_'+i+'" style="border-left-width:0px;">';
        }else{
           oMenuLI += '<div class="menusel"><h2 id="menu_h2_'+i+'">';
        }
		outHTML = '<a href="#" id="' + oMenu.selectSingleNode("PRIVILEGE_ID").text + '"';
				
		if(oMenu.selectSingleNode("MENU_LEVEL").text=='2'){
			//一级菜单
			outHTML += ' onclick="getNextMenu('+oMenu.selectSingleNode("PRIVILEGE_ID").text+',oMenuBar)" ';
		}else{
			if(oMenu.selectSingleNode("SCRIPT_NAME")&&oMenu.selectSingleNode("SCRIPT_NAME").text!='') {
				outHTML += ' onclick="oSelectedItem=this;' + oMenu.selectSingleNode("SCRIPT_NAME").text + '"';
			}else{
				outHTML += ' onclick="oSelectedItem=this;doMenu_open()"';
			}
		}
		if(oMenu.selectSingleNode("SERVER_URL_NAME")) {
			outHTML += ' SERVER_URL_NAME="' + oMenu.selectSingleNode("SERVER_URL_NAME").text + '"';
		}				
		if(oMenu.selectSingleNode("CUSTOM_URL_NAME")) {
			outHTML += ' CUSTOM_URL_NAME="' + oMenu.selectSingleNode("CUSTOM_URL_NAME").text + '"';
		}
		outHTML += '><span>&nbsp;</span>' + oMenu.selectSingleNode("PRIVILEGE_NAME").text;
		outHTML += '</a></h2></div>';				
		oMenuLI += outHTML;	
		oMenuLI += '</td>';		
	}
	oMenuLI += "<td id='nextMenuBtn' width='5px' style=\"display:none;text-align='right'\" onclick='nextMenu()'><font style='cursor:hand;font-family:Webdings;font-size:14px;'>4</font></td>";
	oMenuLI += '</tr></table>';
	document.getElementById('oMenuBar').innerHTML = oMenuLI;
	setShowMenu();
}

//上一个菜单
function preMenu(){
	if(menuIndex == 0){
		return;
	}
	document.getElementById("menuTd_"+(menuIndex-1)).style.display = 'block';
	document.getElementById("menu_h2_"+(menuIndex)).style.borderLeftWidth = '1';
	document.getElementById("menuTd_"+(menuIndex+showMenuLength-1)).style.display = 'none';
	menuIndex--;
	if(menuIndex == 0){
		document.getElementById('preMenuBtn').style.color = 'gray';
	}else{
		document.getElementById('preMenuBtn').style.color = 'black';	
	}
	document.getElementById('nextMenuBtn').style.color = 'black';
}

//下一个菜单
function nextMenu(){
	if((menuIndex+showMenuLength) == menuLength){
		return;
	}
	document.getElementById("menuTd_"+(menuIndex+showMenuLength)).style.display = 'block';
	document.getElementById("menuTd_"+menuIndex).style.display = 'none';
	document.getElementById("menu_h2_"+(menuIndex+1)).style.borderLeftWidth = '0';
	menuIndex++;
	if((menuIndex+showMenuLength) == menuLength){
		document.getElementById('nextMenuBtn').style.color = 'gray';
	}else{
		document.getElementById('nextMenuBtn').style.color = 'black';	
	}
	document.getElementById('preMenuBtn').style.color = 'black';
}

//设置显示的菜单
function setShowMenu(){
    menuIndex = 0;	
    showMenuLength = 0;
    var length = document.getElementById("menuTable").offsetWidth;
    var divLength = 0;
	for(var i = 0; i < menuLength; i++){
		document.getElementById("menuTd_"+i).style.display = 'none';
	}	
	for(var i = 0; i < menuLength; i++){
	    divLength = parseInt(divLength)+parseInt(document.getElementById("menuTd_"+i).clientWidth);
	    if(parseInt(divLength)>parseInt(oMenuBar.clientWidth)){
	    	break;
	    }
		document.getElementById("menuTd_"+i).style.display = 'block';
		showMenuLength++;
	}
	if(showMenuLength < menuLength){
		//document.getElementById('menuTable').align = 'center';
		document.getElementById('nextMenuBtn').style.display = 'block';
		document.getElementById('preMenuBtn').style.display = 'block';	
	}
}

function clearUL(ulObj) {
	if (ulObj) {
		for (var j = ulObj.childNodes.length - 1; j>=0; j--) {
			ulObj.removeChild(ulObj.childNodes[j]);
		}	
	}
}

function doMenu_refresh() 
{  
	window.top.location.replace("/index_GD.jsp");
}

function doMenu_loadTree(frameName,mainFrame,mainUrl) 
{
    //top.window.location.replace("indexFrame.html?id="+oSelectedItem.id);
	//window.top.document.all(frameName).src = menuPageUrl+"?id="+oSelectedItem.id;
	var width =  screen.availWidth;
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
    var sSecondPageURL="indexFrame.jsp";
	var menuId="-1";
    var arrayUrl=getURLSearch();
    if(arrayUrl!=null)
    {
	  var menuId = arrayUrl.menuId;
	}
	var defaultWelComePage = 'welcome.jsp?name='+encodeURIComponent(oSelectedItem.innerText.trimall());
	var mainLoadUrl = oSelectedItem.CUSTOM_URL_NAME || (mainUrl || defaultWelComePage);
	//top.window.location.replace(sSecondPageURL+"?id="+oSelectedItem.id+"&mainUrl="+encodeURIComponent(mainLoadUrl)+"&menuId="+menuId);
	//top.window.location.replace(sSecondPageURL+"?id="+oSelectedItem.id+"&mainUrl="+encodeURIComponent(mainLoadUrl)+"&menuId="+menuId+"&from=itsm");
	window.open(sSecondPageURL+"?id="+oSelectedItem.id+"&mainUrl="+encodeURIComponent(mainLoadUrl)
		+"&menuId="+menuId+"&from=itsm",null,sFeatures.join(","));
}

function doMenuFuncDesc()
{
	var sSecondPageURL="indexFrame.jsp";
	var menuId="-1";
    var arrayUrl=getURLSearch();
    if(arrayUrl!=null)
    {
	  var menuId = arrayUrl.menuId;
	}
	var mainLoadUrl = 'privilege_func_desc.html?privilege_id=' + oSelectedItem.id;
	top.window.location.replace(sSecondPageURL+"?id="+oSelectedItem.id+"&mainUrl="+encodeURIComponent(mainLoadUrl)+"&menuId="+menuId+"&from=itsm");
}

function doMenuReplace(frameName,mainFrame,mainUrl)
{
    //top.window.location.replace("indexFrame.html?id="+oSelectedItem.id);
	//window.top.document.all(frameName).src = menuPageUrl+"?id="+oSelectedItem.id;
    var sSecondPageURL="indexFrame.jsp";
	menuId=oSelectedItem.id;
	var defaultWelComePage = 'welcome.jsp?name='+encodeURIComponent(oSelectedItem.innerText.trimall());
	var mainLoadUrl = oSelectedItem.CUSTOM_URL_NAME || (mainUrl || defaultWelComePage);
	top.window.location.replace(sSecondPageURL+"?id=2050&mainUrl="+encodeURIComponent(mainLoadUrl)+"&menuId="+menuId+"&from=itsm");
}

function doMenu_open_by_url(url,width,height,winId)
{
	var maxWidth = screen.availWidth - 10;
	var maxHeight = screen.availHeight - 30;
	width = (typeof(width) == "undefined") ? maxWidth : width;
	height = (typeof(height) == "undefined") ? maxHeight : height;
	var top = (maxHeight - height) / 2;
	var left = (maxWidth - width) / 2;
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

function doMenu_open(width,height)
{
	if(oSelectedItem.SERVER_URL_NAME)
	{
		doMenu_open_by_url(oSelectedItem.SERVER_URL_NAME,width,height,oSelectedItem.id);
	}
}

function doMenu_loadFullWin(isSlider)
{
    var sURL=oSelectedItem.SERVER_URL_NAME;
    if(isSlider)
    {
       sURL="workshop/topo/slider.html?url="+encodeURIComponent(oSelectedItem.SERVER_URL_NAME);
    }
    if(sURL)
	{
		window.open(sURL,null,
		    "status=no,toolbar=no,menubar=no,location=no,fullscreen=1");
	}
}

function doMenu_open_parameter(ipAddress,moduleId,iFrame)
{	
	var url=oSelectedItem.SERVER_URL_NAME.concat("?ipAddress="+ipAddress).concat("&moduleId="+moduleId);
	width =  screen.availWidth;
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
	if(oSelectedItem.SERVER_URL_NAME)
	{
        //window.top.document.all(iFrame).src = url;		
		window.open(url,oSelectedItem.id,sFeatures.join(","));
	}
}

function doMenu_loadWin(frameName)
{
	width =  screen.availWidth;
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
	//window.top.document.all(frameName).src = oSelectedItem.SERVER_URL_NAME;
	window.open(oSelectedItem.SERVER_URL_NAME,null,sFeatures.join(","));
	
}
//登录数据稽核系统
function loginAuditSystem(){
	var sendParams = ['username='+userName,'key='+ encodeKey];
	displayMaxWindowWithHandle(getSendUrl($getSysVar("AUDIT_SYSTEM_URL")+'?',sendParams));
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