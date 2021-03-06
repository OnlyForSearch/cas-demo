//菜单所在区域和页面顶端之间的距离
var treeDIVTop;
//菜单所在区域和页面底端之间的距离
var treeDIVBottom;
//常用快捷菜单所在的区域的滚动条最大的距离
var treeDIVScrollHeight;
//当前左键选中的菜单项
var clickedMenuItem;
//当前右键选中的菜单项
var rightClickedMenuItem;
//是否需要移动,移动事件开始的标志
var isDrag = false;
//是否有移动过
var isMove = false;
//当前拖拽的菜单项目
var dragedMenuItem;
//拖拽通过的对象
var dragOverMenuItem;
//上下滚动的步长
var step = 3;
//上下滚动的加速事件
var second = 10;
//更改输入框
var oInput;
//新增对象默认名词
var newItemText = "新增流程类别";
//修改前对象名称
var itemTextFirst;

//菜单选中前景色
var clickedMenuItemColor = "white";
//菜单选中背景色
var clickedMenuItemBgColor = "#808080";
//选中菜单的边框样式
var clickedMenuItemBorder = "1px solid #94918C"
//拖拽对象划过菜单前景色
var dragOverMenuItemColor = clickedMenuItemColor;
//拖拽对象划过菜单背景色
var dragOverMenuItemBgColor = clickedMenuItemBgColor;
//选中节点失去焦点时背景颜色
var blurClickedMenuItemBgColor = "#E2E4DE";
//选中节点失去焦点时前景颜色
var blurClickedMenuItemColor = "black";

//xmlhttp对象
var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
//后台操作的HttpURL(type的值参考后台servlet)
var httpURL = "netElementManage?";
//传递参数的数组
var paramArray;
//错误之后是否刷新页面
var isRefreshAferError = true;

var sFeatures = "height=520,width=760,top=0,left=0,location=0,menubar=0,status=0,titlebar=0,toolbar=0,resizable=1";

//画图的框架名
var dargTargetFrameName = "fraMidFrame";
//网元信息框架名
var netElementFrameName = "NetFrame";
//目标调用方法名
var targetMethod="oPalette.createNode"
var oPopup;
var dragDiv;
var oPopupWidth;
var oPopupHeight;

var isLoadNetElementManage;

//页面错误处理
function pageError(msg)
{
	document.body.oncontextmenu = function(){event.returnValue = false;};
	EMsg(msg);
}

//菜单初始化
function iniPage()
{
	treeDIV.style.height="100%";
	treeDIV.style.width="100%";
	var treeDIVRect = treeDIV.getBoundingClientRect();
	treeDIVTop = treeDIVRect.top;
	treeDIVBottom = treeDIVRect.bottom;
	//treeDIVScrollHeight = treeDIV.scrollHeight - treeDIV.offsetHeight;
	//设置重命名时input属性
	oInput = document.createElement("input");
	oInput.style.width="90%";
	oInput.style.border = clickedMenuItemBorder;
	oInput.style.height=(menuItemHeight-2)+"px";
	oInput.attachEvent("onmouseup",cancelBubble);
	oInput.attachEvent("oncontextmenu",cancelBubble);
	oInput.attachEvent("onmousedown",cancelBubble);
	oInput.attachEvent("onmousemove",cancelBubble);
	oInput.attachEvent("onclick",cancelBubble);
	oInput.attachEvent("ondblclick",cancelBubble);
	oInput.attachEvent("onselectstart",cancelBubble);
	oInput.attachEvent("onblur",endReName);
	oInput.attachEvent("onkeydown",oInputKeyDown);
	
	isLoadNetElementManage = (top.location.pathname.indexOf("netElement.html")!=-1);

    if(!isLoadNetElementManage)
    {
	    treeTable.height="100%";
	    topoTreeTR.firstChild.firstChild.src = "topoTree";
	    topoTreeTR.style.display = "";
	    //生成拖动层
	    oPopup = window.createPopup();
	    dragDiv = oPopup.document.createElement('<div id="dragLayer" class="DragDIV"/>');
	    oPopup.document.createStyleSheet(getCssPath("default.css"));
	    oPopup.document.createStyleSheet(getCssPath("netElement.css"));
	    oPopup.document.body.appendChild(dragDiv);
    }
}

function cancelBubble()
{
	event.cancelBubble = true;
}

//更改对象键盘输入事件
function oInputKeyDown()
{
	if(event.keyCode==13)
	{
		event.srcElement.blur();
	}
}

//鼠标划过菜单
function itemOver()
{
	var overMenuItem = getElement(event.srcElement,"nobr");
	if(overMenuItem!=clickedMenuItem && overMenuItem!=rightClickedMenuItem)
		overMenuItem.runtimeStyle.textDecoration = "underline";
}

//鼠标划出菜单
function itemOut()
{
	var overMenuItem = getElement(event.srcElement,"nobr");
	overMenuItem.runtimeStyle.textDecoration = "";
}

//基本的菜单单击事件
function menuItemClick()
{
	var currentMenuItem = getElement(event.srcElement,"nobr");
	if(currentMenuItem == clickedMenuItem)
	{
		return;
	}
	currentMenuItem.runtimeStyle.backgroundColor = clickedMenuItemBgColor;
	currentMenuItem.runtimeStyle.color = clickedMenuItemColor;
	if(clickedMenuItem)
	{
		clickedMenuItem.runtimeStyle.backgroundColor = "";
		clickedMenuItem.runtimeStyle.color = "";
	}
	clickedMenuItem = currentMenuItem;
}

//父节点菜单的单击事件
function parentNodeClick(oTR)
{
	oTR = getElement(oTR,"tr");
	var oImg = getImgElement(oTR);
	var oImgSrc = oImg.src;
	var childRow = oTR.nextSibling;
	if(childRow.style.display == "none")
	{
		childRow.style.display = "";
		oImgSrc = oImgSrc.replace("plus.gif","minus.gif");
		oImg.src = oImgSrc;
	}
	else
	{
		if(clickedMenuItem && childRow.contains(clickedMenuItem))
		{
			oTR.cells[1].firstChild.rows[0].cells[1].firstChild.click();
		}
		childRow.style.display = "none";
		oImgSrc = oImgSrc.replace("minus.gif","plus.gif");
		oImg.src = oImgSrc;
	}
}

function startDrag()
{
	//设置开始拖动事件标志为真
	if(!isLoadNetElementManage)
		isDrag = true;        
}

//如果有移动鼠标则真正激发拖拽事件
function itemMove(oTR)
{
	if(isDrag && event.button==1)
	{
		//存下拖动原对象
		oTR = oTR.firstChild.rows[0];
		dragedMenuItem = oTR;
        dragDiv.innerHTML = "<table>"+oTR.outerHTML+"</table>";
        dragedMenuItem.cells[1].firstChild.fireEvent("onmouseout");
		if(clickedMenuItem)
		{
			clickedMenuItem.runtimeStyle.backgroundColor = blurClickedMenuItemBgColor;
			clickedMenuItem.runtimeStyle.color = blurClickedMenuItemColor;
		}
        isMove = true;
        oPopupWidth = dragedMenuItem.cells[1].firstChild.offsetWidth+36;
        oPopupHeight = dragedMenuItem.offsetHeight+6;
        document.body.setCapture();
	}
}

//拖拽事件
function drag()
{
    if(isMove)
	{
        oPopup.show(event.screenX-icoHeight/2,event.screenY-dragedMenuItem.offsetHeight/2,oPopupWidth,oPopupHeight);
        //window.moveTo(100,100);
        //设置拖动层的属性样式
		/*dragLayer.runtimeStyle.cursor = "default";
		dragLayer.runtimeStyle.display = "block";
		dragLayer.runtimeStyle.top = event.y-dragedMenuItem.offsetHeight/2;
		dragLayer.runtimeStyle.left = event.x-icoHeight/2;
		//要滚动滚动条
		if(event.y<(treeDIVTop+menuItemHeight))
		{
			menuScroll(-step);
		}
		if(event.y>(treeDIVBottom-menuItemHeight))
		{
			menuScroll(step);
		}
		//得到划过菜单选项的对象
		var overItem = getOverItem(treeTable.rows);
		if(overItem)
		{
			dragOver(overItem.cells[1].firstChild.rows[0].cells[1].firstChild);
		}
		else
		{
			dragOut();
			dragOverMenuItem = null;
		}*/
	}
}

//结束拖拽事件
function endDrag()
{
    isDrag = false;
	if(isMove)
	{
		//结束的初始工作
		isMove = false;
		document.releaseCapture();
        oPopup.hide();
		if(clickedMenuItem)
		{
			clickedMenuItem.runtimeStyle.backgroundColor = clickedMenuItemBgColor;
			clickedMenuItem.runtimeStyle.color = clickedMenuItemColor;
		}
		eval('var drawHandle = window.parent.frames["'+dargTargetFrameName+'"];');
        eval("var iX = event.clientX - parent.document.all."+dargTargetFrameName+".getBoundingClientRect().left;");
        eval("var iY = event.clientY - parent.document.all."+dargTargetFrameName+".getBoundingClientRect().top;");
        var oDragTarget = drawHandle.document.elementFromPoint(iX,iY);
        if(oDragTarget)
        {
            var drawDiv = drawHandle.document.getElementById(drawHandle.drawId);
            var noDrawDiv = drawHandle.document.getElementById(drawHandle.noDrawId);
            if(!drawDiv)
            {
            	return;
            }
            if(drawDiv.contains(oDragTarget) && (!noDrawDiv||!noDrawDiv.contains(oDragTarget)))
            {
				var oNobr=dragedMenuItem.cells[1].firstChild
				var iWidth=oNobr.offsetWidth;
                var id = getElement(dragedMenuItem,"tr",1).id;
                var name = oNobr.innerText;
                eval("drawHandle."+targetMethod+"("+id+",'"+name+"',"+iX+","+iY+","+iWidth+")");
            }
        }
        dragedMenuItem = null;
	}
}

//得到鼠标拖拽划过的对象;
function getOverItem(oChildNodes)
{
	for(i=0;i<oChildNodes.length;i++)
	{
		var menuItem = oChildNodes[i];
		if(menuItem.style.display == "")
		{
			var menuItemRect = menuItem.getBoundingClientRect();
			if(event.y>menuItemRect.top&&event.y<menuItemRect.bottom&&event.x>menuItemRect.left&&event.x<menuItemRect.right)
			{
				if(menuItem.name == "menuItem")
				{
					return menuItem;
				}
				else
				{
					return getOverItem(menuItem.childNodes);
				}
			}
		}
	}
	return null;
}

//拖拽划过菜单
function dragOver(overNOBR)
{
	if(overNOBR && dragOverMenuItem!=overNOBR)
	{
		dragOut();
		dragOverMenuItem = overNOBR;
		dragOverMenuItem.runtimeStyle.color = dragOverMenuItemColor;
		dragOverMenuItem.runtimeStyle.backgroundColor = dragOverMenuItemBgColor;
	}
}

//拖拽划出菜单
function dragOut()
{
	if(dragOverMenuItem)
	{
		if(dragOverMenuItem == clickedMenuItem)
		{
			dragOverMenuItem.runtimeStyle.color = blurClickedMenuItemColor;
			dragOverMenuItem.runtimeStyle.backgroundColor = blurClickedMenuItemBgColor;
		}
		else
		{
			dragOverMenuItem.runtimeStyle.color = "";
			dragOverMenuItem.runtimeStyle.backgroundColor = "";
		}
	}
}

//自动激发滚动常用菜单
function menuScroll(step)
{
	if(isMove)
	{
		treeDIV.scrollTop = treeDIV.scrollTop + parseInt(step);
		/*if(treeDIV.scrollTop>0 && treeDIV.scrollTop<treeDIVScrollHeight)
		{
			setTimeout("menuScroll("+step+")",second);
		}*/
	}
}


//移动菜单项
function moveMenuItem()
{
	var rowArray;
	if(rowArray = isMoveMenuItem())
	{
		var sSId = getElement(rowArray[1],"tr",1).rowIndex;
		var sortId = (rowArray[0].type=="parentNode")?rowArray[0].nextSibling.lastChild.firstChild.rows.length:0;
		if(moveMenuItemDB(rowArray[1].id,rowArray[1].parentId,sSId,rowArray[0].id,sortId))
		{
			rowArray[1].parentId = rowArray[0].id;
			var childTBody = getChildNodes(rowArray[0]);
			appendMenuItem(rowArray[1],childTBody);
		}
	}
}

//实际拖动数据库数据
function moveMenuItemDB(id,sourcePId,sourceSId,parentId,sortId)
{
	paramArray = new Array();
	paramArray.push("type="+3);
	paramArray.push("id="+id);
	paramArray.push("parentId="+parentId);
	paramArray.push("sortId="+sortId);
	paramArray.push("sPId="+sourcePId);
	paramArray.push("sSId="+sourceSId);

	var url = httpURL+paramArray.join("&");
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
	var errElement = xmlhttp.responseXML.selectSingleNode("//error/error_code");
	if(errElement.text!=0)
	{
		EMsg(errElement);
		if(isRefreshAferError) refresh();
		return false;
	}
	return true;
}

//判断是否允许移动菜单
function isMoveMenuItem()
{
	var rowArray = new Array("","");
	dragOverMenuItem = getElement(dragOverMenuItem,"tr");
	if(dragOverMenuItem && dragOverMenuItem != dragedMenuItem)
	{
		var sourceRow = getElement(dragedMenuItem,"tr",1);
		var targetRow;
		var sourceRowType = sourceRow.getAttribute("type");
		if(sourceRowType != "parentNode" || (sourceRowType=="parentNode" && !sourceRow.nextSibling.contains(dragOverMenuItem)) )
		{
			targetRow = getElement(dragOverMenuItem,"tr",1);
			//不允许拖到自己的父节点下,没有意义
			if(sourceRow.parentId == targetRow.id)
				return false;

			rowArray[0] = targetRow;
			rowArray[1] = sourceRow;
			return rowArray;
		}
		//不能将自己添加到自己子节点下
		else
		{
			return false;
		}
	}
	//如果目标文件不存在,或者目标文件和源文件一样不允许移动
	else
	{
		return false;
	}
}

//得到需要插入的节点的集合
function getChildNodes(_targetRow)
{
	var childTBody;
	var oImg;
	var oImgName;
	//被拖动到的对象如果是父节点
	if(_targetRow.type == "parentNode")
	{
		var oChildTR = _targetRow.nextSibling;
		if(oChildTR.style.display == "none")
		{
			_targetRow.firstChild.click();
		}
		childTBody = oChildTR.cells[1].firstChild.firstChild;
		var lastMenuItem = childTBody.lastChild.firstChild.firstChild;//得到的是所在的Table
		//节点集合的最后一个节点是父结点
		if(lastMenuItem.rows[0].type == "parentNode")
		{
			lastMenuItem.rows[1].firstChild.background=lineURL+"i.gif";
			oImg = getImgElement(lastMenuItem.rows[0]);
			oImgName = (lastMenuItem.rows[1].style.display == "none")?"tplus.gif":"tminus.gif";
			setMenuLine(oImg,oImgName);
		}
		//节点集合的最后一个节点是普通节点
		else
		{
			oImg = getImgElement(lastMenuItem.rows[0]);
			setMenuLine(oImg,"t.gif");
		}
	}
	//被拖动到的对象如果是子节点
	else
	{
		//目标节点是不是集合的最后一个节点
		var isLast = isLastNode(getElement(_targetRow,"tr",1));
		_targetRow.type = "parentNode";
		oImg = getImgElement(_targetRow);
		oImgName = (isLast)?"lminus.gif":"tminus.gif";
		setMenuLine(oImg,oImgName);
		//设置节点单击事件
		_targetRow.firstChild.onclick = function ()
		{
			parentNodeClick(this);
		}
		_targetRow.lastChild.ondblclick = function ()
		{
			parentNodeClick(this);
		}
		//_targetRow.attachEvent("onclick",function(){parentNodeClick(_targetRow);})
		var oChildTR = document.createElement("tr");
		_targetRow.insertAdjacentElement("afterEnd",oChildTR);
		oChildTR.type = "childNodes";
		var oLineTD = document.createElement("td");
		oChildTR.appendChild(oLineTD);
		//如果是根节点则无需显示菜单连线
		if(_targetRow.parentId=="")
		{
			oLineTD.style.display = "none";
		}
		//如果目标节点不是所在集合的最后一个节点,则需要添加菜单连线
		else if(!isLast)
		{
			oLineTD.background = lineURL+"i.gif";
		}
		var oMenuTD = document.createElement("td");
		oChildTR.appendChild(oMenuTD);
		var oMenuTable = document.createElement('<table border="0" cellspacing="0" cellpadding="0" width="100%">');
		oMenuTD.appendChild(oMenuTable);
		var childTBody = document.createElement("TBODY");
		oMenuTable.appendChild(childTBody);
	}
	return childTBody;
}

//插入拖动到的目标节点
function appendMenuItem(sourceMenuItem,oTbody)
{
	//是否要插入到新的节点下,如果为false则只是单单删除sourceMenuItem节点;
	var isApp = (typeof(oTbody)=="undefined")?false:true;
	var insertMenuItem;
	var oImgName;
	var oImg;
	var isLast
	//需要移动的节点
	insertMenuItem = getElement(sourceMenuItem,"tr",1);
	//源节点所在的集合
	var sourceMenuItemParent = insertMenuItem.parentElement;
	isLast = isLastNode(insertMenuItem);
	insertMenuItem = insertMenuItem.removeNode(true);
	if(isApp)
	{
		//如果移动的源节点是父节点的话
		if(sourceMenuItem.type == "parentNode")
		{
			var childNode = sourceMenuItem.nextSibling;
			childNode.firstChild.background = null;
			oImg = getImgElement(sourceMenuItem);
			oImgName = (childNode.style.display=="none")?"lplus.gif":"lminus.gif";
			setMenuLine(oImg,oImgName);
		}
		//源节点是子节点
		else
		{
			oImg = getImgElement(sourceMenuItem);
			setMenuLine(oImg,"l.gif");
		}
		//插入节点
		oTbody.appendChild(insertMenuItem);
	}
	//源节点所在的集合为空,则删除该节点集合
	if(sourceMenuItemParent.childNodes.length==0)
	{
		var sourceMenuItemParentTR = getElement(sourceMenuItemParent,"tr");
		var sourceMenuItemParentNode = sourceMenuItemParentTR.previousSibling;
		sourceMenuItemParentNode.type = null;
		sourceMenuItemParentNode.firstChild.onclick = null;
		sourceMenuItemParentNode.lastChild.ondblclick = null;
		sourceMenuItemParentTR.removeNode(true);
		oImg = getImgElement(sourceMenuItemParentNode);
		oImgName = (isLastNode(getElement(sourceMenuItemParentNode,"tr",1)))?"l.gif":"t.gif";
		setMenuLine(oImg,oImgName);
	}
	//移除源节点后,源节点上一个节点为最后一个节点
	else if(isLast)
	{
		var lastMenuItem = sourceMenuItemParent.lastChild.firstChild.firstChild.rows[0];
		if(lastMenuItem.type == "parentNode")
		{
			var lastMenuItemChild  = lastMenuItem.nextSibling;
			lastMenuItemChild.firstChild.background = null;
			oImg = getImgElement(lastMenuItem);
			oImgName = (lastMenuItemChild.style.display=="none")?"lplus.gif":"lminus.gif";
			setMenuLine(oImg,oImgName);
		}
		else
		{
			oImg = getImgElement(lastMenuItem);
			setMenuLine(oImg,"l.gif");
		}
	}
}

function getImgElement(oElement)
{
	return oElement.firstChild.firstChild.firstChild;
}

function setMenuLine(oImg,lineName)
{
	oImg.src = lineURL + lineName;
}

function menuItemRight()
{
	event.cancelBubble = true;
	cancelRightClicked();
	rightClickedMenuItem = event.srcElement;
	var MenuItemTR = getElement(rightClickedMenuItem,"tr",2);
	if(clickedMenuItem)
	{
		clickedMenuItem.runtimeStyle.backgroundColor = blurClickedMenuItemBgColor;
		clickedMenuItem.runtimeStyle.color = blurClickedMenuItemColor;
	}
	rightClickedMenuItem.runtimeStyle.backgroundColor = clickedMenuItemBgColor;
	rightClickedMenuItem.runtimeStyle.color = clickedMenuItemColor;
	itemRight.srcElement = rightClickedMenuItem;
	var netTag = parseInt(rightClickedMenuItem.getAttribute("tag"),10);
	switch (netTag)
	{
		case 1:
			itemRight.setItemDisable("1");
			itemRight.setItemDisable("2");
			itemRight.setItemDisable("3");
			itemRight.setItemAttValue("0",'label','添加 "'+rightClickedMenuItem.innerText+'"');
			itemRight.show();
			break;
		case 2:
			paramArray = new Array("action="+3,"typeId="+rightClickedMenuItem.getAttribute("neTypeId"),"id="+getElement(rightClickedMenuItem,"tr",1).id);
			var url = httpURL+paramArray.join("&");
			xmlhttp.Open("POST",url,false);
			xmlhttp.send();
			if(isSuccess(xmlhttp))
			{
				itemRight.setItemAttValue("0","event","");
				itemRight.show(xmlhttp.responseXML.documentElement.childNodes,"0");
			}
			break;
		case 3:
			itemRight.setItemDisable("0");
			itemRight.show();
			break;
		case 4:
			itemRight.setItemDisable("1");
			itemRight.setItemDisable("2");
			itemRight.setItemDisable("3");
			var netName = rightClickedMenuItem.innerText.substring(0,rightClickedMenuItem.innerText.indexOf('组'));
			itemRight.setItemAttValue("0",'label','添加 "'+netName+'"');
			itemRight.setItemAttValue("0",'event',"addNetConfig("+rightClickedMenuItem.getAttribute("neTypeId")+",'"+netName+"')");
			itemRight.show();
			break;
		case 5:
			itemRight.setItemDisable("0");
			itemRight.show();
			break;
		case 6:
			event.returnValue = false;
			break;		
	}
}

//右键菜单消失后处理
function cancelRightClicked()
{
	if(rightClickedMenuItem && rightClickedMenuItem!=clickedMenuItem)
	{
		rightClickedMenuItem.runtimeStyle.color = "";
		rightClickedMenuItem.runtimeStyle.backgroundColor = "";
	}
	if(clickedMenuItem)
	{
				clickedMenuItem.runtimeStyle.backgroundColor = clickedMenuItemBgColor;
				clickedMenuItem.runtimeStyle.color = clickedMenuItemColor;
	}
}

function addNetElement()
{
	var oParent = getElementByName(itemRight.srcElement,"menuItem");
	var parentId = oParent.id;
	var oSource = itemRight.srcElement;
	var neTypeId = oSource.getAttribute("neTypeId");
	var path = oSource.getAttribute("path");
	paramArray = new Array(0,parentId,neTypeId,2,path,oParent,oSource.innerText);
	window.showModalDialog("../workshop/config/netElementInfo.html",window,"dialogWidth=400px;dialogHeight=500px;help=0;scroll=1;status=0;");
	cancelRightClicked();
}

function addNetConfig(neTypeId,netName)
{
	var oParent = getElementByName(itemRight.srcElement,"menuItem");
	var parentId = oParent.id;
	var path = itemRight.srcElement.getAttribute("path");
	var sendURL = httpURL+'action=10&netTypeId='+itemRight.srcElement.getAttribute("neTypeId");
	xmlhttp.open("POST",sendURL,false);
	xmlhttp.send();
	if(isSuccess(xmlhttp))
	{
		var flag = xmlhttp.responseXML.selectSingleNode("//flag").text;
		if(flag==4)
		{
			flag = 3;
		}
		paramArray = new Array(0,parentId,neTypeId,flag,path,oParent,netName);
		window.showModalDialog("../workshop/config/netElementInfo.html",window,"dialogWidth=400px;dialogHeight=500px;help=0;scroll=1;status=0;");
		cancelRightClicked();
	}
}

function addNetConfigGroup(neTypeId,netName)
{
	var oParent = getElementByName(itemRight.srcElement,"menuItem");
	var parentId = oParent.id;
	var path = itemRight.srcElement.getAttribute("path");
	paramArray = new Array(0,parentId,neTypeId,4,path,oParent,netName);
	var sendURL = httpURL+'action=9&parentId='+paramArray[1]+'&type='+paramArray[2]+'&flag='+paramArray[3]+'&name='+encodeURIComponent(netName)+'&path='+encodeURIComponent(paramArray[4]);
	xmlhttp.open("POST",sendURL,false);
	xmlhttp.send();
	if(isSuccess(xmlhttp))
	{
		var id = xmlhttp.responseXML.selectSingleNode("//id").text;
		paramArray.push(id);
		addMenuItem();
		cancelRightClicked();
	}
}

function editNetElement()
{
	var oParent = getElementByName(itemRight.srcElement,"menuItem");
	paramArray = new Array(1,oParent.id,itemRight.srcElement);
	window.showModalDialog("../workshop/config/netElementInfo.html",window,"dialogWidth=366px;dialogHeight=500px;help=0;scroll=1;status=0;");
	cancelRightClicked();
}

//增加一个菜单选项
function addMenuItem()
{
	var oParent = paramArray[5];
	var parentId = oParent.id;
	var childTBody = getChildNodes(oParent);
	var oMenuItemTR = document.createElement("tr");
	childTBody.appendChild(oMenuItemTR);
	var oMenuItemTD = document.createElement("td");
	oMenuItemTR.appendChild(oMenuItemTD);
	var oMenuItemTable = document.createElement('<table border="0" cellpadding="0" cellspacing="0" width="100%">');
	oMenuItemTD.appendChild(oMenuItemTable);
	var oMenuItemTBody = document.createElement('TBODY');
	oMenuItemTable.appendChild(oMenuItemTBody);
	var oChildTR = document.createElement('<tr valign="middle" name="menuItem" id="'+paramArray[7]+'" parentId="'+parentId+'">');
	oMenuItemTBody.appendChild(oChildTR);

	var oLineTD = document.createElement('<td width="'+icoHeight+'">');
	oLineTD.innerHTML = '<div style="width:'+icoHeight+'px;"><img src="'+lineURL+'l.gif" width="20" height="19"></div>';

	var oMenuTD = document.createElement('<td width="100%" onMouseDown="startDrag()" onMouseUp="endDrag()" onMouseMove="itemMove(this)">');
	var oMenuTable = document.createElement('<table border="0" cellspacing="0" cellpadding="0" width="100%">');
	oMenuTD.appendChild(oMenuTable);
	var oMenuTBody = document.createElement('TBODY');
	oMenuTable.appendChild(oMenuTBody);
	var oMenuTR = document.createElement('<tr valign="middle" height="'+menuItemHeight+'">');
	oMenuTBody.appendChild(oMenuTR);
	var oIcoTd = document.createElement('<td width="'+icoHeight+'">');
	oIcoTd.innerHTML = '<div class="icoItem" style="width:'+icoHeight+'px"><img width="16" height="16" src="'+icoURL+defaultIco+'"></div>';
	var oCellTd = document.createElement('<td width="100%">');
	var oNOBR = document.createElement('<nobr tag="'+paramArray[3]+'" neTypeId="'+paramArray[2]+'" path="'+paramArray[4]+'/'+paramArray[7]+'" class="MenuItem" onMouseOver="itemOver()" onMouseOut="itemOut()" oncontextmenu="menuItemRight()" onclick=itemClick('+paramArray[7]+')>');
	oNOBR.innerText = paramArray[6];
	oCellTd.appendChild(oNOBR);
	oMenuTR.appendChild(oIcoTd);
	oMenuTR.appendChild(oCellTd);

	oChildTR.appendChild(oLineTD);
	oChildTR.appendChild(oMenuTD);
	return oNOBR;
}

//实际增加数据库的菜单
function addMenuItemDB(parentId,name,sortId)
{
	paramArray = new Array();
	paramArray.push("type="+1);
	paramArray.push("parentId="+parentId);
	paramArray.push("name="+encodeURIComponent(name));
	paramArray.push("sortId="+sortId);
	var url = httpURL+paramArray.join("&");

	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
	var errElement = xmlhttp.responseXML.selectSingleNode("//error/error_code");
	if(errElement.text == 0)
	{
		return errElement.nextSibling.text;
	}
	else{
		EMsg(errElement);
		if(isRefreshAferError) refresh();
		return -1;
	}
}

//删除一个菜单选项
function delMenuItem()
{
	var oSrc = itemRight.srcElement;
	var oMenuItem = getElementByName(oSrc,"menuItem");
	var oMsg = "是否删除 \""+oSrc.innerText+"\" ";
	if (oMenuItem.type == "parentNode")
	{
		oMsg += "与其子节点";
	}
	oMsg += "?";
	var isDel = QMsg(oMsg);
	var isDelClickedItem = (clickedMenuItem == oSrc);
	if (isDel == MSG_YES)
	{
		if(delMenuItemDB(oSrc.path))
		{
			var oClickNode;
			if(isDelClickedItem)
			{
				var oClickedTR = getElement(clickedMenuItem,"tr",2);
				oClickNode = (isLastNode(oClickedTR))?getElement(oClickedTR,"tr",1).previousSibling:oClickedTR.nextSibling.firstChild.firstChild.rows[0];
				oClickNode = oClickNode.lastChild.firstChild.rows[0].lastChild.firstChild;
				oClickNode.click();
			}
			appendMenuItem(oMenuItem);
			MMsg("删除成功!");
		}
	}
	cancelRightClicked();
}

//实际删除数据库的菜单
function delMenuItemDB(path)
{
	paramArray = new Array();
	paramArray.push("action="+5);
	paramArray.push("path="+path);
	var url = httpURL+paramArray.join("&");
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
	return isSuccess(xmlhttp);
}

//重命名一个菜单选项
function rename()
{
	var oSrc = itemRight.srcElement;
	oSrc.style.display = "none";
	itemTextFirst = oSrc.innerText
	oInput.value = itemTextFirst;
	oSrc.parentElement.appendChild(oInput);
	oInput.select();
}

//命名结束
function endReName()
{
	var oSrc = itemRight.srcElement;
	if(itemTextFirst == oInput.value)
	{
		oSrc.parentElement.removeChild(oInput);
		oSrc.style.display = "";
	}
	else
	{
		if(updateMenuItemDB(getElementByName(oSrc,"menuItem").id,oInput.value))
		{
			oSrc.innerText = oInput.value;
			oSrc.parentElement.removeChild(oInput);
			oSrc.style.display = "";
			if(clickedMenuItem && rightClickedMenuItem==clickedMenuItem)
			{
				clickedMenuItem.click();
			}
		}
	}
	cancelRightClicked();
}

//实际修改数据库的菜单
function updateMenuItemDB(id,name)
{
	paramArray = new Array();
	paramArray.push("action="+4);
	paramArray.push("id="+id);
	paramArray.push("name="+encodeURIComponent(name));
	var url = httpURL+paramArray.join("&");
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
	return isSuccess(xmlhttp);
}

//上下移动菜单
function moveByStep(step)
{
	var oSource = getElementByName(itemRight.srcElement,"menuItem");
	var oSourceTR = getElement(oSource,"tr",1);
	var oTargetTR;
	var oTarget;
	var oImg;
	var oImgName;
	var oChildNode;
	//上移
	if(step==-1)
	{
		oTargetTR = oSourceTR.previousSibling;
		oTarget = oTargetTR.firstChild.firstChild.rows[0];
		if(isLastNode(oSourceTR))
		{
			oImg = getImgElement(oSource);
			oImgName = "t.gif";
			if(oSource.type=="parentNode")
			{
				oChildNode = oSource.nextSibling;
				oChildNode.firstChild.background = lineURL+"i.gif";
				oImgName = (oChildNode.style.display=="none")?"tplus.gif":"tminus.gif";
			}
			setMenuLine(oImg,oImgName);

			oImg = getImgElement(oTarget);
			oImgName = "l.gif";
			if(oTarget.type=="parentNode")
			{
				oChildNode = oTarget.nextSibling;
				oChildNode.firstChild.background = null;
				oImgName = (oChildNode.style.display=="none")?"lplus.gif":"lminus.gif";
			}
			setMenuLine(oImg,oImgName);
		}
	}
	//下移
	else
	{
		oTargetTR = oSourceTR.nextSibling;
		oTarget = oTargetTR.firstChild.firstChild.rows[0];
		if(isLastNode(oTargetTR))
		{
			oImg = getImgElement(oTarget);
			oImgName = "t.gif";
			if(oTarget.type=="parentNode")
			{
				oChildNode = oTarget.nextSibling;
				oChildNode.firstChild.background = lineURL+"i.gif";
				oImgName = (oChildNode.style.display=="none")?"tplus.gif":"tminus.gif";
			}
			setMenuLine(oImg,oImgName);

			oImg = getImgElement(oSource);
			oImgName = "l.gif";
			if(oSource.type=="parentNode")
			{
				oChildNode = oSource.nextSibling;
				oChildNode.firstChild.background = null;
				oImgName = (oChildNode.style.display=="none")?"lplus.gif":"lminus.gif";
			}
			setMenuLine(oImg,oImgName);
		}
	}
	oSourceTR.swapNode(oTargetTR);
	moveByStepDB(oSource.id,oSourceTR.rowIndex,oTarget.id,oTargetTR.rowIndex);
	cancelRightClicked();
}

//实际上下移动数据库菜单
function moveByStepDB(id0,sid0,id1,sid1)
{
	paramArray = new Array();
	paramArray.push("type="+4);
	paramArray.push("id="+id0);
	paramArray.push("sSId="+sid0);
	paramArray.push("tId="+id1);
	paramArray.push("tSId="+sid1);

	var url = httpURL+paramArray.join("&");
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
	var errElement = xmlhttp.responseXML.selectSingleNode("//error/error_code");
	if(errElement.text!=0)
	{
		EMsg(errElement);
		if(isRefreshAferError) refresh();
		return false;
	}
	return true;
}

//置顶
function moveTop()
{
	var oSource = getElementByName(itemRight.srcElement,"menuItem");
	var oSourceTR = getElement(oSource,"tr",1);
	var oSourceTRIndex = oSourceTR.rowIndex;
	if(isLastNode(oSourceTR))
	{
		var oTarget = oSourceTR.previousSibling.firstChild.firstChild.rows[0];
		var oImg = getImgElement(oTarget);
		var oImgName = "l.gif";
		if(oTarget.type=="parentNode")
		{
			oChildNode = oTarget.nextSibling;
			oChildNode.firstChild.background = null;
			oImgName = (oChildNode.style.display=="none")?"lplus.gif":"lminus.gif";
		}
		setMenuLine(oImg,oImgName);

		oImg = getImgElement(oSource);
		oImgName = "t.gif";
		if(oSource.type=="parentNode")
		{
			oChildNode = oSource.nextSibling;
			oChildNode.firstChild.background = lineURL+"i.gif";
			oImgName = (oChildNode.style.display=="none")?"tplus.gif":"tminus.gif";
		}
		setMenuLine(oImg,oImgName);
	}
	if(moveTopDB(oSource.id,oSourceTRIndex,oSource.parentId))
	{
		var oTargetTR = oSourceTR.parentElement.firstChild;
		for(i=oTargetTR.rowIndex;i<oSourceTRIndex;i++)
		{
			oSourceTR.swapNode(oSourceTR.previousSibling);
		}
	}
	cancelRightClicked();
}

//实际将数据库菜单置顶
function moveTopDB(id,sortId,parentId)
{
	paramArray = new Array();
	paramArray.push("type="+5);
	paramArray.push("id="+id);
	paramArray.push("sortId="+sortId);
	paramArray.push("parentId="+parentId);

	var url = httpURL+paramArray.join("&");
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
	var errElement = xmlhttp.responseXML.selectSingleNode("//error/error_code");
	if(errElement.text!=0)
	{
		EMsg(errElement);
		if(isRefreshAferError) refresh();
		return false;
	}
	return true;
}

//置底
function moveBottom()
{
	var oSource = getElementByName(itemRight.srcElement,"menuItem");
	var oSourceTR = getElement(oSource,"tr",1);
	var oSourceTRIndex = oSourceTR.rowIndex;
	var oImg = getImgElement(oSource);
	var oImgName = "l.gif";
	if(oSource.type=="parentNode")
	{
		oChildNode = oSource.nextSibling;
		oChildNode.firstChild.background = null;
		oImgName = (oChildNode.style.display=="none")?"lplus.gif":"lminus.gif";
	}
	setMenuLine(oImg,oImgName);
	var oTargetTR = oSourceTR.parentElement.lastChild;
	var oTarget = oTargetTR.firstChild.firstChild.rows[0];
	oImg = getImgElement(oTarget);
	oImgName = "t.gif";
	if(oTarget.type=="parentNode")
	{
		oChildNode = oTarget.nextSibling;
		oChildNode.firstChild.background = lineURL+"i.gif";
		oImgName = (oChildNode.style.display=="none")?"tplus.gif":"tminus.gif";
	}
	setMenuLine(oImg,oImgName);
	for(i=oSourceTRIndex;i<oTargetTR.rowIndex;i++)
	{
		oSourceTR.swapNode(oSourceTR.nextSibling);
	}
	moveBottomDB(oSource.id,oSourceTRIndex,oSource.parentId,getElement(oSource,"tr",1).rowIndex);
	cancelRightClicked();
}

//实际将数据库菜单置底
function moveBottomDB(id,sortId,parentId,tSId)
{
	paramArray = new Array();
	paramArray.push("type="+6);
	paramArray.push("id="+id);
	paramArray.push("sSId="+sortId);
	paramArray.push("parentId="+parentId);
	paramArray.push("tSId="+tSId);

	var url = httpURL+paramArray.join("&");
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
	var errElement = xmlhttp.responseXML.selectSingleNode("//error/error_code");
	if(errElement.text!=0)
	{
		EMsg(errElement);
		if(isRefreshAferError) refresh();
		return false;
	}
	return true;
}

function openAll()
{
	var oTRs = document.getElementsByTagName("tr");
	for(i=0;i<oTRs.length;i++)
	{
		if(oTRs[i].type=="childNodes" && oTRs[i].style.display == "none")
		{
			oTRs[i].style.display = "";
			var oImg = getImgElement(oTRs[i].previousSibling);
			oImg.src = oImg.src.replace("plus.gif","minus.gif");
		}
	}
}

function closeAll()
{
	var oTRs = document.getElementsByTagName("tr");
	for(i=0;i<oTRs.length;i++)
	{
		if(oTRs[i].type=="childNodes" && oTRs[i].style.display == "")
		{
			oTRs[i].style.display = "none";
			var oImg = getImgElement(oTRs[i].previousSibling);
			oImg.src = oImg.src.replace("minus.gif","plus.gif");
		}
	}
}

//菜单项目单击事件
function itemClick(id)
{
	menuItemClick();
	if(isLoadNetElementManage)
	{
		if(event.srcElement.tag==5)
		{
			window.frameElement.nextSibling.src = '../../workshop/log/neInfoLogFlatList.jsp?id='+id+'&name='+encodeURIComponent(event.srcElement.innerText);
		}
		else
		{
			window.frameElement.nextSibling.src = 'netElementList.html?id='+id+'&tag='+event.srcElement.tag;
		}
	}
	else if(window.top != window)
	{
		var frames = top.frames["fstMain"];
		frames.rows = "0,*";
		frames.childNodes[0].src ="about:blank";
	    if(event.srcElement.tag==5)
		{
			frames.childNodes[1].src = '../log/neInfoLogFlatList.jsp?id='+id+'&name='+encodeURIComponent(event.srcElement.innerText);
		}
		else
		{
			frames.childNodes[1].src = "../config/netElementList.html";
		}			
		execLoadDate("fraMidFrame",id,event.srcElement.tag);		
	}
	//window.status = id;
	//window.parent.frames["mainFrame"].self.load(id);
	//window.open(event.srcElement.openUrl,"win"+id,sFeatures);
	//top.document.all.MainFrame.src = event.srcElement.openUrl;
}

function execLoadDate(handleName,id,tag)
{
	var handle = top.frames[handleName];
	if(handle.document.readyState == "complete")
	{
		handle.paramArray = new Array();		
		handle.paramArray.push(id);		
		handle.paramArray.push(tag);		
		handle.loadData();		
	}
	else
	{
	    window.setTimeout("execLoadDate('"+handleName+"',"+id+",'"+tag+"')",10);
	}
}
//加个右键方法
