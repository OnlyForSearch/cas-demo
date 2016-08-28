var selfName = "menu.js";
var menuUrl = getRealPath("../../../servlet/menu?id=", selfName);
var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
var oSelectedItem;


function addTopMenu(id, oMenuBar, curMenuId) {
	xmlhttp.Open("POST", menuUrl+id+'&action=0', true);
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp!==null && xmlhttp.readyState==4 && isSuccess(xmlhttp)) {
			xmlDoc.load(xmlhttp.responseXML);
			var xPath = "/root/rowSet";
			var oMenus = xmlDoc.selectNodes(xPath);
			var oMenu,oMenuLI,outHTML,isCurMenu;
			
			clearUL(oMenuBar);
			if (id && id != "-1") {
				oMenuLI = document.createElement("li"); 
				oMenuLI.innerHTML = '<a href="#" onclick="doMenu_refresh()">主页</a>';
				oMenuBar.appendChild(oMenuLI);
			}
			
			for(var i=0; i<oMenus.length; i++) {
				oMenu = oMenus[i];
				isCurMenu = (curMenuId == oMenu.getAttribute("PRIVILEGE_ID"));
				oMenuLI = document.createElement("li"); 
				outHTML = '<a href="#" id="' + oMenu.getAttribute("PRIVILEGE_ID") + '"';
				if(oMenu.getAttribute("SCRIPT_NAME")) {
					outHTML += ' onclick="oSelectedItem=this;' + oMenu.getAttribute("SCRIPT_NAME") + '"';
				}
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
				outHTML += '</a>';
				
				oMenuLI.innerHTML = outHTML;					
				oMenuBar.appendChild(oMenuLI);
			}
		}	
	};
	xmlhttp.send();
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
	var mainPage = document.getElementById("mainPage");
	if(mainPage != null && mainPage != undefined)
	{
		if(mainPage.value == 'indexITSM_GS.jsp')
		{//甘肃首页刷新
			window.top.location.replace("/"+mainPage.value);
		}
	}
	else{
		var oMenuJS=document.getElementById("menuJS");
	    //var sMainPageURL=(oMenuJS==null)?"/":oMenuJS.mainPage;
	    var sMainPageURL=(oMenuJS==null)?"/indexCRM.jsp":oMenuJS.mainPage;
		window.top.location.replace("/indexCRM.jsp");
	}
}

function doMenu_loadTree(frameName,mainFrame,mainUrl) 
{
    //top.window.location.replace("indexFrame.html?id="+oSelectedItem.id);
	//window.top.document.all(frameName).src = menuPageUrl+"?id="+oSelectedItem.id;
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
	top.window.location.replace(sSecondPageURL+"?id="+oSelectedItem.id+"&mainUrl="+encodeURIComponent(mainLoadUrl)+"&menuId="+menuId+"&from=itsm");
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
        window.top.document.all(iFrame).src = url;		
		//window.open(url,oSelectedItem.id,sFeatures.join(","));
	}
}

function doMenu_loadWin(frameName)
{
	window.top.document.all(frameName).src = oSelectedItem.SERVER_URL_NAME;
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