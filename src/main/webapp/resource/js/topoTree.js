//�˵����������ҳ�涥��֮��ľ���
var treeDIVTop;
//�˵����������ҳ��׶�֮��ľ���
var treeDIVBottom;
//���ÿ�ݲ˵����ڵ�����Ĺ��������ľ���
var treeDIVScrollHeight;
//��ǰ���ѡ�еĲ˵���
var clickedMenuItem;
//��ǰ�Ҽ�ѡ�еĲ˵���
var rightClickedMenuItem;
//�Ƿ���Ҫ�ƶ�,�ƶ��¼���ʼ�ı�־
var isDrag = false;
//�Ƿ����ƶ���
var isMove = false;
//��ǰ��ק�Ĳ˵���Ŀ
var dragedMenuItem;
//��קͨ���Ķ���
var dragOverMenuItem;
//���¹����Ĳ���
var step = 3;
//���¹����ļ����¼�
var second = 10;
//���������
var oInput;
//��������Ĭ������
var newItemText = new Array("�½�����ͼ����","�½�����ͼ");
//�޸�ǰ��������
var itemTextFirst;

//�˵�ѡ��ǰ��ɫ
var clickedMenuItemColor = "white";
//�˵�ѡ�б���ɫ
var clickedMenuItemBgColor = "#808080";
//ѡ�в˵��ı߿���ʽ
var clickedMenuItemBorder = "1px solid #94918C"
//��ק���󻮹��˵�ǰ��ɫ
var dragOverMenuItemColor = clickedMenuItemColor;
//��ק���󻮹��˵�����ɫ
var dragOverMenuItemBgColor = clickedMenuItemBgColor;
//ѡ�нڵ�ʧȥ����ʱ������ɫ
var blurClickedMenuItemBgColor = "#E2E4DE";
//ѡ�нڵ�ʧȥ����ʱǰ����ɫ
var blurClickedMenuItemColor = "black";

//xmlhttp����
var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
//��̨������HttpURL(type��ֵ�ο���̨servlet)
var httpURL = "topoTreeManage?";
//���ݲ���������
var paramArray;
//����֮���Ƿ�ˢ��ҳ��
var isRefreshAferError = true;

//ҳ�����servlet��λ��
var pageUrl = "../workshop/user/";

//Ա���б�ҳ��ľ��
var staffListHandle = window.parent.frames["mainFrame"];

var oTopoChartParent;

//ҳ�������
function pageError(msg)
{
	document.body.oncontextmenu = function(){event.returnValue = false;};
	EMsg(msg);
}

//�˵���ʼ��
function iniPage()
{
	treeDIV.style.height="100%";
	treeDIV.style.width="100%";
	var treeDIVRect = treeDIV.getBoundingClientRect();
	treeDIVTop = treeDIVRect.top;
	treeDIVBottom = treeDIVRect.bottom;
	//treeDIVScrollHeight = treeDIV.scrollHeight - treeDIV.offsetHeight;
	//����������ʱinput����
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
}

function cancelBubble()
{
	event.cancelBubble = true;
}

//���Ķ�����������¼�
function oInputKeyDown()
{
	if(event.keyCode==13)
	{
		event.srcElement.blur();
	}
}

//��껮���˵�
function itemOver()
{
	var overMenuItem = getElement(event.srcElement,"nobr");
	if(overMenuItem!=clickedMenuItem && overMenuItem!=rightClickedMenuItem)
		overMenuItem.runtimeStyle.textDecoration = "underline";
}

//��껮���˵�
function itemOut()
{
	var overMenuItem = getElement(event.srcElement,"nobr");
	overMenuItem.runtimeStyle.textDecoration = "";
}

//�����Ĳ˵������¼�
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

//���ڵ�˵��ĵ����¼�
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
	//���ÿ�ʼ�϶��¼���־Ϊ��
	isDrag = true;
}

//������ƶ����������������ק�¼�
function itemMove(oTR)
{
	if(isDrag)
	{
		//�����϶�ԭ����
		oTR = oTR.firstChild.rows[0];
		dragedMenuItem = oTR;
		dragLayer.innerHTML = "<table>"+oTR.outerHTML+"</table>";
		dragedMenuItem.cells[1].firstChild.fireEvent("onmouseout");
		if(clickedMenuItem)
		{
			clickedMenuItem.runtimeStyle.backgroundColor = blurClickedMenuItemBgColor;
			clickedMenuItem.runtimeStyle.color = blurClickedMenuItemColor;
		}
		isMove = true;
		dragLayer.setCapture();
	}
}

//��ק�¼�
function drag()
{
	if(isMove)
	{
		//�����϶����������ʽ
		dragLayer.runtimeStyle.cursor = "default";
		dragLayer.runtimeStyle.display = "block";
		dragLayer.runtimeStyle.top = event.y-dragedMenuItem.offsetHeight/2;
		dragLayer.runtimeStyle.left = event.x-icoHeight/2;
		//Ҫ����������
		if(event.y<(treeDIVTop+menuItemHeight))
		{
			menuScroll(-step);
		}
		if(event.y>(treeDIVBottom-menuItemHeight))
		{
			menuScroll(step);
		}
		//�õ������˵�ѡ��Ķ���
		var overItem = getOverItem(treeTable.rows);
		if(overItem)
		{
			dragOver(overItem.cells[1].firstChild.rows[0].cells[1].firstChild);
		}
		else
		{
			dragOut();
			dragOverMenuItem = null;
		}
	}
}

//�õ������ק�����Ķ���;
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

//��ק�����˵�
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

//��ק�����˵�
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

//�Զ������������ò˵�
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

//������ק�¼�
function endDrag()
{
	isDrag = false;
	if(isMove)
	{
		//�����ĳ�ʼ����
		isMove = false;
		dragLayer.releaseCapture();
		dragLayer.runtimeStyle.display = "none";
		dragOut();
		moveMenuItem();
		if(clickedMenuItem)
		{
			clickedMenuItem.runtimeStyle.backgroundColor = clickedMenuItemBgColor;
			clickedMenuItem.runtimeStyle.color = clickedMenuItemColor;
		}
		dragOverMenuItem = null;
		dragedMenuItem = null;
	}
}

//�ƶ��˵���
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

//ʵ���϶����ݿ�����
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

//�ж��Ƿ������ƶ��˵�
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
			//�������ϵ��Լ��ĸ��ڵ���,û������
			if(sourceRow.parentId == targetRow.id)
				return false;

			rowArray[0] = targetRow;
			rowArray[1] = sourceRow;
			return rowArray;
		}
		//���ܽ��Լ���ӵ��Լ��ӽڵ���
		else
		{
			return false;
		}
	}
	//���Ŀ���ļ�������,����Ŀ���ļ���Դ�ļ�һ���������ƶ�
	else
	{
		return false;
	}
}

//�õ���Ҫ����Ľڵ�ļ���
function getChildNodes(_targetRow)
{
	var childTBody;
	var oImg;
	var oImgName;
	//���϶����Ķ�������Ǹ��ڵ�
	if(_targetRow.type == "parentNode")
	{
		var oChildTR = _targetRow.nextSibling;
		if(oChildTR.style.display == "none")
		{
			_targetRow.firstChild.click();
		}
		childTBody = oChildTR.cells[1].firstChild.firstChild;
		var lastMenuItem = childTBody.lastChild.firstChild.firstChild;//�õ��������ڵ�Table
		//�ڵ㼯�ϵ����һ���ڵ��Ǹ����
		if(lastMenuItem.rows[0].type == "parentNode")
		{
			lastMenuItem.rows[1].firstChild.background=lineURL+"i.gif";
			oImg = getImgElement(lastMenuItem.rows[0]);
			oImgName = (lastMenuItem.rows[1].style.display == "none")?"tplus.gif":"tminus.gif";
			setMenuLine(oImg,oImgName);
		}
		//�ڵ㼯�ϵ����һ���ڵ�����ͨ�ڵ�
		else
		{
			oImg = getImgElement(lastMenuItem.rows[0]);
			setMenuLine(oImg,"t.gif");
		}
	}
	//���϶����Ķ���������ӽڵ�
	else
	{
		//Ŀ��ڵ��ǲ��Ǽ��ϵ����һ���ڵ�
		var isLast = isLastNode(getElement(_targetRow,"tr",1));
		_targetRow.type = "parentNode";
		oImg = getImgElement(_targetRow);
		oImgName = (isLast)?"lminus.gif":"tminus.gif";
		setMenuLine(oImg,oImgName);
		//���ýڵ㵥���¼�
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
		//����Ǹ��ڵ���������ʾ�˵�����
		if(_targetRow.parentId=="")
		{
			oLineTD.style.display = "none";
		}
		//���Ŀ��ڵ㲻�����ڼ��ϵ����һ���ڵ�,����Ҫ��Ӳ˵�����
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

//�����϶�����Ŀ��ڵ�
function appendMenuItem(sourceMenuItem,oTbody)
{
	//�Ƿ�Ҫ���뵽�µĽڵ���,���Ϊfalse��ֻ�ǵ���ɾ��sourceMenuItem�ڵ�;
	var isApp = (typeof(oTbody)=="undefined")?false:true;
	var insertMenuItem;
	var oImgName;
	var oImg;
	var isLast
	//��Ҫ�ƶ��Ľڵ�
	insertMenuItem = getElement(sourceMenuItem,"tr",1);
	//Դ�ڵ����ڵļ���
	var sourceMenuItemParent = insertMenuItem.parentElement;
	isLast = isLastNode(insertMenuItem);
	insertMenuItem = insertMenuItem.removeNode(true);
	if(isApp)
	{
		//����ƶ���Դ�ڵ��Ǹ��ڵ�Ļ�
		if(sourceMenuItem.type == "parentNode")
		{
			var childNode = sourceMenuItem.nextSibling;
			childNode.firstChild.background = null;
			oImg = getImgElement(sourceMenuItem);
			oImgName = (childNode.style.display=="none")?"lplus.gif":"lminus.gif";
			setMenuLine(oImg,oImgName);
		}
		//Դ�ڵ����ӽڵ�
		else
		{
			oImg = getImgElement(sourceMenuItem);
			setMenuLine(oImg,"l.gif");
		}
		//����ڵ�
		oTbody.appendChild(insertMenuItem);
	}
	//Դ�ڵ����ڵļ���Ϊ��,��ɾ���ýڵ㼯��
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
	//�Ƴ�Դ�ڵ��,Դ�ڵ���һ���ڵ�Ϊ���һ���ڵ�
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

function menuItemRight(depth)
{
	event.cancelBubble = true;
	cancelRightClicked();
	rightClickedMenuItem = event.srcElement;
	var MenuItemTR = getElement(rightClickedMenuItem,"tr",1);
	if(clickedMenuItem)
	{
		clickedMenuItem.runtimeStyle.backgroundColor = blurClickedMenuItemBgColor;
		clickedMenuItem.runtimeStyle.color = blurClickedMenuItemColor;
	}
	rightClickedMenuItem.runtimeStyle.backgroundColor = clickedMenuItemBgColor;
	rightClickedMenuItem.runtimeStyle.color = clickedMenuItemColor;
	itemRight.srcElement = rightClickedMenuItem;
	if(depth==1)
	{
		itemRight.setItemDisable("1");
		itemRight.setItemDisable("2");
	}
	if(rightClickedMenuItem.type == "1")
	{
		itemRight.setItemDisable("0");
	}
    itemRight.show();
}

//�Ҽ��˵���ʧ����
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

//����һ����λ�˵�ѡ��
function addTopoTreeItem(type)
{
    var oParent = getElementByName(itemRight.srcElement,"menuItem");
    var parentId = oParent.id;
    var childId = addTopoTreeItemDB(parentId,newItemText[type],type+2);
	if(childId!=-1)
	{
		itemRight.srcElement = addMenuItem(childId,newItemText[type],type,oParent);
		rename();
	}
}

function addMenuItem(id,name,type,oParent)
{
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
	var oChildTR = document.createElement('<tr valign="middle" name="menuItem" id="'+id+'" parentId="'+parentId+'">');
	oMenuItemTBody.appendChild(oChildTR);

	var oLineTD = document.createElement('<td width="'+icoHeight+'">');
	oLineTD.innerHTML = '<div style="width:'+icoHeight+'px;"><img src="'+lineURL+'l.gif" width="20" height="19"></div>';

	var oMenuTD = document.createElement('<td width="100%">');
	var oMenuTable = document.createElement('<table border="0" cellspacing="0" cellpadding="0" width="100%">');
	oMenuTD.appendChild(oMenuTable);
	var oMenuTBody = document.createElement('TBODY');
	oMenuTable.appendChild(oMenuTBody);
	var oMenuTR = document.createElement('<tr valign="middle" height="'+menuItemHeight+'">');
	oMenuTBody.appendChild(oMenuTR);
	var oIcoTd = document.createElement('<td width="'+icoHeight+'">');
	oIcoTd.innerHTML = '<div class="icoItem" style="width:'+icoHeight+'px"><img width="16" height="16" src="'+icoURL+newItemIco[type]+'"></div>';
	var oCellTd = document.createElement('<td width="100%">');
	var oNOBR = document.createElement('<nobr type="'+type+'" class="MenuItem" onMouseOver="itemOver()" onMouseOut="itemOut()" oncontextmenu="menuItemRight()" onclick=itemClick('+id+')>');
	if(type==1)
	{
		oNOBR.id = 'chart_'+id;
	}
	oNOBR.innerText = name;
	oCellTd.appendChild(oNOBR);
	oMenuTR.appendChild(oIcoTd);
	oMenuTR.appendChild(oCellTd);

	oChildTR.appendChild(oLineTD);
	oChildTR.appendChild(oMenuTD);
	return oNOBR;
}

//ʵ���������ݿ�Ĳ˵�
function addTopoTreeItemDB(parentId,name,action)
{
    paramArray = new Array();
	paramArray.push("action="+action);
	paramArray.push("parentId="+parentId);
	paramArray.push("name="+encodeURIComponent(name));
	var url = httpURL+paramArray.join("&");

	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        return getMsgNode(xmlhttp.responseXML).text;
    }
    else
    {
        return -1;
    }
}

//ɾ��һ���˵�ѡ��
function delMenuItem()
{
	var oSrc = itemRight.srcElement;
	var oMenuItem = getElementByName(oSrc,"menuItem");
	var oMsg = "�Ƿ�ɾ�� \""+oSrc.innerText+"\" ";
	oMsg += "?";
	var isDel = QMsg(oMsg);
	var isDelClickedItem = (clickedMenuItem == oSrc);
	var isDelSuccess = false;
	if (isDel == MSG_YES)
	{
		if(oSrc.type==0)
		{
			isDelSuccess = delTopoClassifyDB(oMenuItem.id,0);
		}
		else
		{
			isDelSuccess = delTopoChartDB(oMenuItem.id);
		}
		if(isDelSuccess)
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
			MMsg("ɾ���ɹ�!");
		}
	}
	cancelRightClicked();
}

//ʵ��ɾ�����ݿ�Ĳ˵�
function delTopoChartDB(id)
{
	paramArray = new Array();
	paramArray.push("action="+5);
	paramArray.push("id="+id);
	var url = httpURL+paramArray.join("&");
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
	return isSuccess(xmlhttp);
}

//ʵ��ɾ�����ݿ�Ĳ˵�
function delTopoClassifyDB(id,isForce)
{
	paramArray = new Array();
	paramArray.push("action="+4);
	paramArray.push("id="+id);
	paramArray.push("isForce="+isForce);
	var url = httpURL+paramArray.join("&");
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
	if(isSuccess(xmlhttp))
	{
		var result = getMsgNode(xmlhttp.responseXML).text;
		if(result == "success")
		{
			return true;
		}
		else
		{
			if(QMsg(result) == MSG_YES)
			{
				return delTopoClassifyDB(id,1);
			}
		}
	}
	return false;
}

//������һ���˵�ѡ��
function rename()
{
	var oSrc = itemRight.srcElement;
	oSrc.style.display = "none";
	itemTextFirst = oSrc.innerText
	oInput.value = itemTextFirst;
	oSrc.parentElement.appendChild(oInput);
	oInput.select();
}

//��������
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
		var srcMenuItem = getElementByName(oSrc,"menuItem");
		if(updateMenuItemDB(srcMenuItem.id,oInput.value,oSrc.type))
		{
			oSrc.innerText = oInput.value;
			oSrc.parentElement.removeChild(oInput);
			oSrc.style.display = "";
		}
	}
	cancelRightClicked();
}

//ʵ���޸����ݿ�Ĳ˵�
function updateMenuItemDB(id,name,type)
{
	paramArray = new Array();
	paramArray.push("action="+1);
	paramArray.push("id="+id);
	paramArray.push("type="+type);
	paramArray.push("name="+encodeURIComponent(name));
	var url = httpURL+paramArray.join("&");
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();
	return isSuccess(xmlhttp);
}

//�����ƶ��˵�
function moveByStep(step)
{
	var oSource = getElementByName(itemRight.srcElement,"menuItem");
	var oSourceTR = getElement(oSource,"tr",1);
	var oTargetTR;
	var oTarget;
	var oImg;
	var oImgName;
	var oChildNode;
	//����
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
	//����
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

//ʵ�������ƶ����ݿ�˵�
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

//�ö�
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

//ʵ�ʽ����ݿ�˵��ö�
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

//�õ�
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

//ʵ�ʽ����ݿ�˵��õ�
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

//�˵���Ŀ�����¼�
function itemClick(id)
{
	menuItemClick();
	oTopoChartParent = getElementByName(event.srcElement,"menuItem");
	if(event.srcElement.type == 1)
	{
		 var frames = top.frames["fstMain"];
		 frames.rows = "28,*";
		 frames.childNodes[0].src="../topo/monitorToolbar.html?chartId="+id;
		 frames.childNodes[1].src="../topo/monitor.html?chartId="+id;
	     //top.frames['fraTopFrame'].src="../workshop/topo/toolbar.html?chartId="+id;
	     //top.frames['fraMidFrame'].src="../workshop/topo/design.html?chartId="+id;
	}
	else
	{
		var frames = top.frames["fstMain"];
		frames.rows = "0,*";
		frames.childNodes[0].src="";
		frames.childNodes[1].src="";
	}
	//staffListHandle.parentId = id;
    //staffListHandle.parentType = event.srcElement.type;
    //staffListHandle.loadData();
}
