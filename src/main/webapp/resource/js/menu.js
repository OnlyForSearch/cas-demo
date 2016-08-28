var selfName = "menu.js";
var menuUrl = getRealPath("../../servlet/menu?id=",selfName);
var menuPageUrl = getRealPath("../../menu.html",selfName);
var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
var oSelectedItem;
var rightClickedMenuItem;
var sortAtt = "SORT_ID";
var action = 0;// 主页按钮是否隐藏 1:隐藏 0:显示


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
function addTopMenu(id,oMenuBar,curMenuId)
{
	var i;
	var menuId="-1";
    var arrayUrl=getURLSearch();
    var aMenuBg=getaMenuBg();
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
	        outHTML +=  '<span style="cursor:hand;float:left" onmouseover="doMenuOver(this)" '
	                    +    'onmouseout="doMenuOut(this)" onclick="doMenu_refresh()">'
	                    +   '<img src="'+aMenuBg.left+'" align="absbottom"/>'
	                    +  '<span class="'+aMenuBg.menuNormalClass+'">主页</span>'
	                    +  '<img src="'+aMenuBg.right+'" align="absbottom"/>'
	                    +'</span>';
	    }
		xmlDoc.load(xmlhttp.responseXML);
		var oNodes = xmlDoc.selectNodes(xPath);
		var iLen=oNodes.length;
		for(i=0;i<iLen;i++)
		{
		    var oNode=oNodes[i];
			if(action==1&&oNode.getAttribute("PRIVILEGE_ID")==10){
		    	continue;
		    }
		    var isCurMenu=(curMenuId==oNode.getAttribute("PRIVILEGE_ID"));
		    var leftImg=(isCurMenu)?aMenuBg.selLeft:aMenuBg.left;
		    var rightImg=(isCurMenu)?aMenuBg.selRight:aMenuBg.right;
		    var menuClass=(isCurMenu)?aMenuBg.menuSelClass:aMenuBg.menuNormalClass;
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
			   outHTML +=    ' onmouseover="doMenuOver(this)" onmouseout="doMenuOut(this)"'
			}
			outHTML +=   '>'
			outHTML +=  '<img src="'+leftImg+'" align="absbottom"/>'
	        outHTML +=  '<span class="'+menuClass+'">'+oNode.getAttribute("PRIVILEGE_NAME")+'</span>'
	        //将PRIVILEGE_NAME改成变量，根据中文英文显示不同字段，如MENU_LOCATE_CN="PRIVILEGE_NAME" MENU_LOCATE_EN="PRIVILEGE_NAME_EN"
	        outHTML +=  '<img src="'+rightImg+'" align="absbottom"/>'
	        outHTML +='</span>';
	        
		}
		oMenuBar.innerHTML = outHTML;
	}
}
function doMenuOver(oMenuItem)
{
   var aMenuBg=getaMenuBg();
   oMenuItem.childNodes[1].className=aMenuBg.menuSelClass;
}
function doMenuOut(oMenuItem)
{
   var aMenuBg=getaMenuBg();
   oMenuItem.childNodes[1].className=aMenuBg.menuNormalClass;
}
function doMenu_refresh()
{  
    var oMenuJS=document.getElementById("menuJS");
    var sMainPageURL=(oMenuJS==null)?"/":oMenuJS.mainPage;
	window.top.location.replace(sMainPageURL);
}

function doMenu_loadTree(frameName,mainFrame,mainUrl)
{
    //top.window.location.replace("indexFrame.html?id="+oSelectedItem.id);
	//window.top.document.all(frameName).src = menuPageUrl+"?id="+oSelectedItem.id;
    var sSecondPageURL="indexFrame.jsp";
    if(typeof(pageVersion) != 'undefined' && pageVersion.toUpperCase() == 'AH')
    {
    	sSecondPageURL = "indexFrame_AH.jsp";
    }
	var menuId="-1";
    var arrayUrl=getURLSearch();
    if(arrayUrl!=null)
    {
	  var menuId = arrayUrl.menuId;
	}     
	var defaultWelComePage = 'welcome.jsp?name='+encodeURIComponent(trimall(oSelectedItem.innerText));
	var mainLoadUrl = oSelectedItem.CUSTOM_URL_NAME || (mainUrl || defaultWelComePage);
	top.window.location.replace(sSecondPageURL+"?id="+oSelectedItem.id+"&mainUrl="+encodeURIComponent(mainLoadUrl)+"&menuId="+menuId+"&action="+action);
}

function doMenuFuncDesc()
{
	var sSecondPageURL="indexFrame.jsp";
	if(typeof(pageVersion) != 'undefined' && pageVersion.toUpperCase() == 'AH')
    {
    	sSecondPageURL = "indexFrame_AH.jsp";
    }
	var menuId="-1";
    var arrayUrl=getURLSearch();
    if(arrayUrl!=null)
    {
	  var menuId = arrayUrl.menuId;
	}
	var mainLoadUrl = 'privilege_func_desc.html?privilege_id=' + oSelectedItem.id;
	top.window.location.replace(sSecondPageURL+"?id="+oSelectedItem.id+"&mainUrl="+encodeURIComponent(mainLoadUrl)+"&menuId="+menuId);
}
function doMenuReplace(frameName,mainFrame,mainUrl)
{
    //top.window.location.replace("indexFrame.html?id="+oSelectedItem.id);
	//window.top.document.all(frameName).src = menuPageUrl+"?id="+oSelectedItem.id;
    var sSecondPageURL="indexFrame.jsp";
    if(typeof(pageVersion) != 'undefined' && pageVersion.toUpperCase() == 'AH')
    {
    	sSecondPageURL = "indexFrame_AH.jsp";
    }
	menuId=oSelectedItem.id;
	var defaultWelComePage = 'welcome.jsp?name='+encodeURIComponent(trimall(oSelectedItem.innerText));
	var mainLoadUrl = oSelectedItem.CUSTOM_URL_NAME || (mainUrl || defaultWelComePage);
	top.window.location.replace(sSecondPageURL+"?id=2050&mainUrl="+encodeURIComponent(mainLoadUrl)+"&menuId="+menuId+"&action="+action);
}

function doMenu_replace(){
	if(oSelectedItem.SERVER_URL_NAME)
	{
		window.top.location.replace(oSelectedItem.SERVER_URL_NAME);
	}
}

function doMenuReplace2(frameName,mainFrame,mainUrl,privilegeId)
{	
    var sSecondPageURL="indexFrame.jsp";
    if(typeof(pageVersion) != 'undefined' && pageVersion.toUpperCase() == 'AH')
    {
    	sSecondPageURL = "indexFrame_AH.jsp";
    }
	menuId=oSelectedItem.id;
	var defaultWelComePage = 'welcome.jsp?name='+encodeURIComponent(trimall(oSelectedItem.innerText));
	var mainLoadUrl = oSelectedItem.CUSTOM_URL_NAME || (mainUrl || defaultWelComePage);
	top.window.location.replace(sSecondPageURL+"?id="+privilegeId+"&mainUrl="+encodeURIComponent(mainLoadUrl)+"&menuId="+menuId);
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
	if(typeof(pageVersion)!='undefined' && pageVersion.toUpperCase() == 'AH')
    {
    	var mainIFrameWin = top.document.getElementById("mainIFrame").contentWindow;
		mainIFrameWin.document.all(frameName).src = oSelectedItem.SERVER_URL_NAME;
    }
    else
    {
		window.top.document.all(frameName).src = oSelectedItem.SERVER_URL_NAME;
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
	if(typeof(pageVersion)!='undefined' && pageVersion.toUpperCase() == 'AH')
    {
    	var mainIFrame = top.document.getElementById("mainIFrame");
    	if(mainIFrame && mainIFrame.contentWindow && mainIFrame.contentWindow.frames['shortCutFrame'].favorites_tree)
    	{
			mainIFrame.contentWindow.frames['shortCutFrame'].favorites_tree.refresh();
    	}
    }
	else if(window.top == window)
	{
		if(window.favorites_tree)
		{
			window.favorites_tree.refresh();
		}
	}
	else
	{
		if(window.top.frames["shortCutFrame"].favorites_tree)
		{
			window.top.frames["shortCutFrame"].favorites_tree.refresh();
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
function doITMenuOver(oMenuItem)
{
   oMenuItem.className="itMenuOver";
}
function doITMenuOut(oMenuItem)
{
   oMenuItem.className="";
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
    window.top.document.all(frameName).src=mainUrl;
  }
}

//add by sunyj 2011-03-31 （因为SFM的menu要用不同的样式，所以在这里重写一份相关脚本）
function getaMenuBg_SFM()
{
    var aMenuBg=
    {
      menuNormalClass:'menu_SFM',
      menuSelClass:'menuSel_SFM'
    }
    return aMenuBg;
}
function addTopMenu_SFM(id,oMenuBar,curMenuId)
{
	var i;
	var menuId="-1";
    var arrayUrl=getURLSearch();
    var aMenuBg=getaMenuBg_SFM();
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
	        outHTML +=  '<span style="cursor:hand;float:left" onmouseover="doMenuOver_SFM(this)" '
	                    +    'onmouseout="doMenuOut_SFM(this)" onclick="doMenu_refresh()" class="'+aMenuBg.menuNormalClass+'">主页</span>';
	    }
		xmlDoc.load(xmlhttp.responseXML);
		var oNodes = xmlDoc.selectNodes(xPath);
		var iLen=oNodes.length;
		for(i=0;i<iLen;i++)
		{
		    var oNode=oNodes[i];
		    var isCurMenu=(curMenuId==oNode.getAttribute("PRIVILEGE_ID"));
		    var menuClass=(isCurMenu)?aMenuBg.menuSelClass:aMenuBg.menuNormalClass;
			outHTML +=   '<span '
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
			   outHTML +=    ' onmouseover="doMenuOver_SFM(this)" onmouseout="doMenuOut_SFM(this)"'
			}
			outHTML +=   ' class="'+menuClass+'">'
	        outHTML +=  oNode.getAttribute("PRIVILEGE_NAME")
	        outHTML +='</span>';
		}
		oMenuBar.innerHTML = outHTML;
	}
}
function doMenuOver_SFM(oMenuItem)
{
   var aMenuBg=getaMenuBg_SFM();
   oMenuItem.className=aMenuBg.menuSelClass;
}
function doMenuOut_SFM(oMenuItem)
{
   var aMenuBg=getaMenuBg_SFM();
   oMenuItem.className=aMenuBg.menuNormalClass;
}
