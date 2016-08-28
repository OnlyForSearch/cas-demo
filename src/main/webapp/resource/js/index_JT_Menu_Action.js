var selfName = "index_JT_Menu_Action.js";
var menuUrl = getRealPath("../../servlet/menu?id=",selfName);
var menuPageUrl = getRealPath("../../menu_JT.html",selfName);
var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
var oSelectedItem;
var rightClickedMenuItem;
var sortAtt = "SORT_ID";

function trimall (str)//去首尾空格函数
{
    var reg=/^ +| +$/g;
    var str=str.replace(reg,"");
    return str;
}
function getaMenuBg()
{
    var aMenuBg=
    {
      left:'resource/image/indexImage/style1/bg_daohang_left.jpg',
      right:'resource/image/indexImage/style1/bg_daohang_right.jpg',
      selLeft:'resource/image/indexImage/style1/bg_daohang2_left.jpg',
      selRight:'resource/image/indexImage/style1/bg_daohang2_right.jpg',
      menuNormalClass:'menu',
      menuSelClass:'SelMenu'
    }
    return aMenuBg;
}

function doMenu_relocation() {
	if (oSelectedItem) {
		var sSecondPageURL="indexFrame_JT.jsp";
		
		if (oSelectedItem.targetScriptName && oSelectedItem.targetScriptName.toLowerCase().indexOf("domenu_open()") == 0) {
			oSelectedItem.SERVER_URL_NAME = oSelectedItem.targetServerUrlName;
			eval(oSelectedItem.targetScriptName);
			oSelectedItem = null;
			return;
		} 
		
		if (oSelectedItem.targetScriptName && oSelectedItem.targetScriptName.toLowerCase().indexOf("domenu_loadwin('rightframe')") == 0) {	
			var defaultWelComePage = 'welcome.jsp?name='+encodeURIComponent(trimall(oSelectedItem.id));
			var mainLoadUrl = oSelectedItem.CUSTOM_URL_NAME || (oSelectedItem.targetServerUrlName || defaultWelComePage);
			
			top.window.location.replace(sSecondPageURL+"?id="+oSelectedItem.id+"&mainUrl="+encodeURIComponent(oSelectedItem.targetServerUrlName));
			oSelectedItem = null;
			return;
		}
		
		if (oSelectedItem.targetScriptName && oSelectedItem.targetScriptName.toLowerCase().indexOf("domenu_sso") == 0) {
			var scriptName = oSelectedItem.targetScriptName;
			var scriptNameArray = scriptName.split(',');

			if (scriptNameArray && scriptNameArray.length >= 3) {
				var serverMainUrlStr = scriptNameArray[2];
				var serverMainUrl = serverMainUrlStr.slice(serverMainUrlStr.indexOf("'") + 1, serverMainUrlStr.lastIndexOf("'"));			
				if (scriptNameArray.length == 4 && (scriptNameArray[3].indexOf("1") == 0 || scriptNameArray[3].indexOf("'1") == 0)) {
					oSelectedItem.SERVER_URL_NAME = serverMainUrl;
					eval("doMenu_open()");
				} else {
					top.window.location.replace(sSecondPageURL+"?id="+oSelectedItem.id+"&mainUrl="+encodeURIComponent(serverMainUrl));
				}
			}
			oSelectedItem = null;
			return;
		}
		
		if (oSelectedItem.targetScriptName && oSelectedItem.targetScriptName.toLowerCase().indexOf("domenu_loadtree") == 0) {
			oSelectedItem.SERVER_URL_NAME = oSelectedItem.targetServerUrlName;
			oSelectedItem.CUSTOM_URL_NAME = oSelectedItem.targetCustomUrlName;
			eval(oSelectedItem.targetScriptName);
			oSelectedItem = null;
			return;
		}
	}
}

function doMenu_refresh() {  
    var oMenuJS=document.getElementById("menuJS");
    var sMainPageURL=(oMenuJS==null)?"/":oMenuJS.mainPage;
	window.top.location.replace(sMainPageURL);
}

function doMenu_loadTree(frameName,mainFrame,mainUrl) {
	var mainLoadUrl;
	var defaultWelComePage;
	var oElement = event.srcElement;
	var sSecondPageURL="indexFrame_JT.jsp";
	
	if (oSelectedItem) {	
		defaultWelComePage = 'welcome.jsp?name='+encodeURIComponent(trimall(oSelectedItem.id));
		mainLoadUrl = oSelectedItem.CUSTOM_URL_NAME || (mainUrl || defaultWelComePage);
		
		top.window.location.replace(sSecondPageURL+"?id="+oSelectedItem.id+"&mainUrl="+encodeURIComponent(mainLoadUrl));
		oSelectedItem = null;
		
		return;	
	}	
	
	if (oElement) {
		defaultWelComePage = 'welcome.jsp?name='+encodeURIComponent(trimall(oElement.innerText));
		
		if (oElement.CUSTOM_URL_NAME && oElement.CUSTOM_URL_NAME != 'null') {
			mainLoadUrl = oElement.CUSTOM_URL_NAME;
		} else {
			mainLoadUrl = mainUrl || defaultWelComePage;
		}
		
		top.window.location.replace(sSecondPageURL+"?id="+oElement.PRIVILEGE_ID+"&mainUrl="+encodeURIComponent(mainLoadUrl));
	}
}

function doMenuReplace(frameName,mainFrame,mainUrl) {
	doMenu_loadTree(frameName,mainFrame,mainUrl);
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

function doMenu_open(width,height) {
	if (oSelectedItem) {
		doMenu_open_by_url(oSelectedItem.SERVER_URL_NAME,width,height,oSelectedItem.id);
		oSelectedItem = null;
		return;
	}
	
	var oElement = event.srcElement;
	if(oElement) {
		doMenu_open_by_url(oElement.SERVER_URL_NAME,width,height,oElement.id);
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

function doMenu_loadWin(frameName) {
	var oElement = event.srcElement;

	if (oElement && oElement.SERVER_URL_NAME) {
		window.parent.document.all(frameName).src = oElement.SERVER_URL_NAME;
	}
}

//删除快捷菜单
function delStaffMenu()
{
	var oSrc = itemRight.srcElement;
	var oMsg = "是否删除 \""+oSrc.innerText+"\"?";
	var isDel = QMsg(oMsg);
	if (isDel == MSG_YES)
	{
		xmlhttp.open("POST","servlet/staff_manage?tag=30&id="+oSrc.id,false);
		xmlhttp.send("");
		if(isSuccess(xmlhttp))
		{
			MMsg("删除成功");
			loadMenu();
		}
	}
}

//添加快捷菜单
function addStaffMenu()
{
	showAddFavPriWin(trimall(rightClickedMenuItem.innerText),rightClickedMenuItem.id);
	if(window.top == window)
	{
		if(window.favorites_tree)
		{
			window.favorites_tree.refresh();
		}
	}
	else
	{
		if(window.parent.frames["shortCutFrame"].favorites_tree)
		{
			window.parent.frames["shortCutFrame"].favorites_tree.refresh();
		}
	}
	/*xmlhttp.open("POST","/servlet/staff_manage?tag=28&id="+rightClickedMenuItem.id,false);
	xmlhttp.send("");
	if(isSuccess(xmlhttp))
	{
		MMsg("添加快捷菜单成功");
	}*/
}

function addITTopMenu(id,oNode,curMenuId)
{
	var i;
	var menuId="-1";
    var arrayUrl=getURLSearch();
    if(arrayUrl!=null)
    {
	   menuId = arrayUrl.menuId;
	}    
	var xPath = "/root/rowSet";
	xmlhttp.Open("POST",menuUrl+id+'&action=0',false);
	xmlhttp.send();
	if(isSuccess(xmlhttp))
	{
		var outHTML = '';
	    if(menuId!="-1")
	    {
	        outHTML +=   '<span style="cursor:hand" onmouseover="doITMenuOver(this)" '
	                       +'onmouseout="doITMenuOut(this)" onclick="doMenu_refresh()">'
	                       +'&nbsp;主页&nbsp;&nbsp;</span>|';
	    }
		xmlDoc.load(xmlhttp.responseXML);
		var oNodes = xmlDoc.selectNodes(xPath);
		var iLen=oNodes.length;
		for(i=0;i<iLen;i++)
		{
			outHTML +=   '<span>&nbsp;&nbsp;&nbsp;&nbsp; ';
			outHTML +=   '<span style="cursor:hand"'
			outHTML +=    ' id="'+oNodes[i].getAttribute("PRIVILEGE_ID")+'"';
			outHTML +=    ' oncontextmenu="rightClickedMenuItem=event.srcElement;itemRight_add.show()"'
			if(oNodes[i].getAttribute("SCRIPT_NAME"))
			{
				outHTML += ' onclick="oSelectedItem=event.srcElement;'+oNodes[i].getAttribute("SCRIPT_NAME")+'"';
			}
			if(oNodes[i].getAttribute("SERVER_URL_NAME"))
			{
				outHTML += ' SERVER_URL_NAME="'+oNodes[i].getAttribute("SERVER_URL_NAME")+'"';
			}
			if(oNodes[i].getAttribute("CUSTOM_URL_NAME"))
			{
				outHTML += ' CUSTOM_URL_NAME="'+oNodes[i].getAttribute("CUSTOM_URL_NAME")+'"';
			}
			if(curMenuId==oNodes[i].getAttribute("PRIVILEGE_ID"))
			{
			    outHTML += ' class="itMenuOver" ';
			}
			else
			{
			   outHTML +=    ' onmouseover="doITMenuOver(this)" onmouseout="doITMenuOut(this)"'
			}
			outHTML +=   '> '+oNodes[i].getAttribute("PRIVILEGE_NAME");
			outHTML +=   '</span>&nbsp;&nbsp;&nbsp;&nbsp; </span>';
			if(i!=iLen-1)  outHTML +="|"
		}
		oNode.innerHTML = outHTML;
	}
}

function doMenu_SSO(frameName,mainFrame,mainUrl,winFlag){
  xmlhttp.Open("POST","../../ossservlet?tag=2",false);
  xmlhttp.send();
  var dXML = new ActiveXObject("Microsoft.XMLDOM");
  dXML.load(xmlhttp.responseXML);
  
  mainUrl = mainUrl + "&userid="+dXML.selectSingleNode("/root/userid").text;
  mainUrl = mainUrl + "&token="+dXML.selectSingleNode("/root/token").text;
  if(winFlag=='1'){
    var h= screen.availHeight-30, w= screen.availWidth;
    window.open(mainUrl,'','scrollbars=yes,resizable=yes,left=0,top=0,height='+h+',width='+w);
  }if(winFlag=='2'){
	window.document.all(frameName).src=mainUrl;
  }else{
    window.parent.document.all(frameName).src=mainUrl;
  }
}