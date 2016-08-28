/* =========================================================================

NAME:���β˵���ʵ����

AUTHOR:����
DATE:2006-2-26

COMMENT: ʵ�����β˵���,�ṩ�ӿڵĹ���

============================================================================ */
//����Ĭ��������Դ
var xmlTreeJSDefaultLang = {
	waitText : '���Ժ�......',
	addNode : '�½��ڵ�',
	xmlFormatErrorMsg : 'xml�ĵ���ʽ����!',
	otherErrorMsg : '��̨��������쳣![�������:'
};
//��ȡ������Դ
function getXmlTreeJSLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('xmlTreeJSDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.xmlTreeJS.' + code);
	}
}
/*========������һЩ����========*/
//���ļ�����
var JS_NAME = 'XMLTree.js';
//�ȴ�չ����ʱ��
var WAIT_EXPAND = 50;
//ѡ�������ɫ
var SELECTED_BACKGROUND = '#808080';
//ѡ����ı߿�
var SELECTED_BORDER = '1px solid #3F3F3F';
//ѡ�����������ɫ
var SELECTED_COLOR = 'white';
//�޸�ʱ�ı߿�
var EDIT_BORDER = '1px solid #808080';
//ʧȥ����ĵ���ѡ�ж���ı߿���ʽ
var UNFORCE_CLICKEDITEM_BORDER = '1px dashed black';
//�϶�popup����߾�
var DRAGBODY_LEFT = 2;
//��ʼ�����ķ�Χ
var SCROLL_RANGE = 36;
var SCROLL_STEP = 20;
var SCROLL_TIME = 200;
//xslת����ʼ�����
var TRANSFORMTYPE_INIT = 1;
var TRANSFORMTYPE_DYNAMICLOAD = 2;
var TRANSFORMTYPE_ADDCHILDRENDIV = 3;

var FIND_FILE_PATH_REG = new RegExp("^.*/");
/*========�����Ǿ�̬����========*/
var _dragPopup;
var _dragDiv;

/*========���������========*/
function XMLTree()
{
    //��xml���ڵ�·��
    this.xmlUrl;
    //����XML����
    this.xmlObj;
    //xsl���ڵ�·��
    this.xslPath = getRealPath('../../xsl/XMLTree.xsl',JS_NAME);
    //�Ƿ���ʾ�ȴ�ҳ��
    this.isWait = true;
    //ÿ�ζ�̬�������ʾ����
    this.dynamicLoadShowDepth = 1;
    //�½���ʱ��Ĭ�ϵĽڵ���
    this.addText = getXmlTreeJSLan('addNode');
    //�Ҽ��˵�����
    this.rightMenu;
	//����ѡ�в˵����Ƿ���Ӳ˵�
    this.isOpenChildAtferClick = false;
    //�Ҽ��Ƿ񼤻���¼�
    this.isRightFireOnClick = true;
    //�Ƿ��϶��˵���Ŀ(��ҳ����϶�)
    this.isDragOnPage = false;
    this.isDragOnPageBySelf = false;
    //�Ƿ��϶��˵���Ŀ(�������϶�)
    this.isDragOnTree = false;
    this.isDragOnTreeBySelf = true;
    //�Ƿ񵥻�ѡ�����
    this.isSelectedClick = false;
    this.isReadOnly = false;
    //ÿ���Ƿ�ͬ������DOC����
    this.isSyncDoc = false;
    this.waitIco = 'spinner.gif';
    this.errorIco = this.icoPath + 'error.gif';
    this.waitText = getXmlTreeJSLan('waitText');

	//ѡ�������ɫ
	this.selectedBackground = SELECTED_BACKGROUND;
	//ѡ����ı߿�
	this.selectedBorder = SELECTED_BORDER;
    
    /*========���¼���Ϊxsl�е���������,���Ϊ��,��˵������xsl�е�Ĭ�����õ�ֵ========*/
    //������ʾ����(ȱʡֵ��xsl�е�����)
    this.showDepth;
    //�Ƿ�̬����˵�
    this.isDynamicLoad;
    //����ͼ������·��
    this.icoPath = getRealPath('../../image/ico/',JS_NAME);
    //������������·��
    this.linePath = getRealPath('../../image/line/',JS_NAME);
    //���ߵ�ͼƬ����
    this.topLine = new Array('rminus.gif','rplus.gif','r.gif');
    this.bottomLine = new Array('lminus.gif','lplus.gif','l.gif');
    this.otherLine = new Array('tminus.gif','tplus.gif','t.gif');
    this.backgroundLine = 'i.gif';
    //ȱʡ��Ҷ�ڵ�ͼ��
    this.defaultIco;
    //ȱʡ�ĸ��ڵ�ͼ��
    this.defaultParentIco;
    //�Ƿ����ӽ�������
    this.hasChildAttName;
    //�����ֶε���������
    this.sortAtt;
    //��ʾ��ʽ(Ĭ��Ϊͼ��)
    this.showType;
  //��ʾ��ʽ(Ĭ��Ϊͼ��)
    this.isShowDesc;
    //���ڵ������¼��ķ�������
    this.parentNodeClickEvent;
    //�ڵ㻮���¼��ķ�������
    this.itemOverEvent;
    //�ڵ㻮���¼��ķ�������
    this.itemOutEvent;
    //�ڵ㵥���¼��ķ�������
    this.itemClickEvent;
    //�ڵ�˫���¼��ķ�������
    this.itemDblClickEvent;
    //checkbox�����¼��ķ�������
    this.checkBoxClickEvent;
    
	/*========����Ϊ�����ӿڶ���========*/
    //��ʼ������ʱԤ����Ľӿ�
    this.pretreatmentAction;
    //��̬ȡ����ʱ�Ľӿ�
    this.dynamicLoadAction;
    //�ɹ���̬��ȡ��ص��ӿ�
    this.afterDynamicLoadAction;
    //��������Ľӿ�
    this.clickAction;
    //˫������Ľӿ�
    this.dblclickAction;
    //�༭�Ľӿ�
    this.editAction;
    //��ק��ʼ�Ľӿ�
    this.startDragAction;
    //��ק�����Ľӿ�
    this.endDragAction;
    //�Ҽ��ӿ�
    this.rightAction;
    //checkbox�����ӿ�
    this.checkBoxClickAction;
    //������ɽӿ�
    this.loadAction;
    
	/*========����Ϊ����ʱ�����һЩ����========*/
    this._xslDoc = new ActiveXObject("Microsoft.XMLDOM");
    this._treeDoc = new ActiveXObject("Microsoft.XMLDOM");
    this._treeDoc.setProperty("SelectionLanguage", "XPath");
    //���ĸ��ڵ�
    this._treeRoot;
    //���Ǹ��ڵ�����ʾ��
    this._showAtElement;
    //����ѡ���еĶ���
    this._oSelectedItem;
    //�Ҽ�����ʱ�򱣴�ǰѡ�еĶ���
    this._oClickedItem;
    //��ק�Ķ���
    this._DragItem;
    this._DragItemDiv;
    this._DragParentItem;
    //��ק�����Ķ���
    this._oOverItem;
    //�Ƿ�ʼ�϶�
    this._isFireDrag = false;
    //��ӽڵ�ʱ�õ���ʱ����
    this._addParentItem;
    this._addId;
    this._addText;
    this._addAttNames;
    this._addAttValues;
    this._isClick;
    this._isEdit;
    //��ʾ����Ķ�λ
    this._showAtElementTop;
    this._showAtElementBottom;
   	this._showAtElementLeft;
   	this._showAtElementRight;
   	//�������ĺ���ID
   	this.autoScrollTreeByYFunId;
   	this.autoScrollTreeByXFunId;
   	//Ѱ�ҽڵ��·��
   	this.itemPath;
}

/*========����Ϊpublic����========*/

/**
 * �趨������ʾ����
 * @param 
 * 		oElement-ָ����ʾ������
 * @return
 * 		null
 */
XMLTree.prototype.showAt = function (oElement)
{
    this._showAtElement = oElement;
    this._showWait();
    var showAtElementRect = this._showAtElement.getBoundingClientRect();
    this._showAtElementTop = showAtElementRect.top;
    this._showAtElementBottom = showAtElementRect.bottom;
   	this._showAtElementLeft = showAtElementRect.left;
   	this._showAtElementRight = showAtElementRect.right;
    this._xslDoc.async = false;
    this._xslDoc.load(this.xslPath);
    //����XSL����
    this._setXslAttribute('TreeObjId',this._showAtElement.uniqueID);
    this._setXslAttribute('IcoUrl',this.icoPath);
    this._setXslAttribute('LineUrl',this.linePath);
    this._setXslAttributeArray('topLine');
    this._setXslAttributeArray('bottomLine');
    this._setXslAttributeArray('otherLine');
    this._setXslAttribute('backgroundLine',this.backgroundLine);
    this._setXslAttribute('showDepth',this.showDepth);
    this._setXslAttribute('isDynamicLoad',this.isDynamicLoad);
    
    this._setXslAttribute('defaultIco',this.defaultIco);
    this._setXslAttribute('defaultParentIco',this.defaultParentIco);
    this._setXslAttribute('hasChildAttName',this.hasChildAttName);
    this._setXslAttribute('sortAtt',this.sortAtt);
    this._setXslAttribute('showType',this.showType);
    this._setXslAttribute('isShowDesc',this.isShowDesc);
    this._setXslAttribute('parentNodeClickEvent',this.parentNodeClickEvent);
    this._setXslAttribute('itemOverEvent',this.itemOverEvent);
    this._setXslAttribute('itemOutEvent',this.itemOutEvent);
    this._setXslAttribute('itemClickEvent',this.itemClickEvent);
    this._setXslAttribute('itemDblClickEvent',this.itemDblClickEvent);
    this._setXslAttribute('checkBoxClickEvent',this.checkBoxClickEvent);

    //��ȡ��������
    if(this.xmlObj == null)
    {
    	this._iniTreeXML(this.xmlUrl);
    }
    else
    {
    	this._iniXMLObj(this.xmlObj);
    }
    //this._showAtElement.attachEvent('onselectstart',_cancel)
    this._showAtElement.attachEvent('ondrag',_cancel);
        
    if(this.isDragOnTree)
    {
    	this._createDragDiv();
    }
    else if(this.isDragOnPage)
    {
    	this._createDragPopup();
    }
}

XMLTree.prototype.refresh = function ()
{
    //���ĸ��ڵ�
    this._treeRoot = null;
    //����ѡ���еĶ���
    this._oSelectedItem = null;
    //�Ҽ�����ʱ�򱣴�ǰѡ�еĶ���
    this._oClickedItem = null;
    //��ק�Ķ���
    this._DragItem = null;
    this._DragItemDiv = null;
    this._DragParentItem = null;
    //��ק�����Ķ���
    this._oOverItem = null;
    //�Ƿ�ʼ�϶�
    this._isFireDrag = false;
    this.showAt(this._showAtElement);
}

XMLTree.prototype.selectItemByPath = function(_path)
{
	this.itemPath = _path.split("/");
	this.selectItem();
}

XMLTree.prototype.selectItem = function()
{
	var isContinue = true;
	var oItem;
	while(this.itemPath.length>0 && isContinue)
	{
		var oItemId = this.itemPath.shift();
		oItem = document.getElementById(oItemId);
		if(oItem)
		{
			var oItemDiv = getElement(oItem,'div');
			if(this._isClosed(oItemDiv))
			{
				if(oItemDiv.type == 'dynamicLoadNode')
				{
					this.dynamicLoadTree(oItem,'from_select');
					isContinue = false;
				}
				else if(oItemDiv.type == 'parentNode')
				{
					oItemDiv.firstChild.click();
				}
			}
		}
		else
		{
			isContinue = false;
		}
	}
	if(this.itemPath.length==0 && oItem)
	{
		oItem.click();
	}
}
/**
 * ��̬����ָ���ڵ���¼��ڵ�
 * @param
 * 		oItem-ָ���ڵ����
 * 		fireType-�����¼�����
 * @return
 * 		null
 */
XMLTree.prototype.dynamicLoadTree = function(oItem,fireType)
{
	if(isNull(oItem))
	{
		oItem = this._oSelectedItem;
	}
	var oItemDiv = getElement(oItem,'div');
	if(!isNull(oItemDiv.nextSibling))
	{
		oItemDiv.nextSibling.removeNode(true);
		oItemDiv.type = 'dynamicLoadNode';
	}
	if(isAction(this.dynamicLoadAction,XMLTree_onDynamicLoad_Action))
    {
        var url = this.dynamicLoadAction.dynamicLoad(oItem);
        if(!isNull(url) && url!='')
        {
        	var attName = ["ico"];
        	var attValue = [this.waitIco];
        	var oWaitItem = this._addItem(oItemDiv,'waitItem',this.waitText,attName,attValue);
        	this._dynamicLoadXML(url,oItemDiv,oWaitItem,fireType);
        }
        else
        {
        	this._addChildToSingleNode(null,oItemDiv);
        }
    }
    else
    {
    	this._addChildToSingleNode(null,oItemDiv);
    }
}

/**
 * ��ȡѡ�ж���
 * @param
 * 		null
 * @return
 * 		ѡ�еĶ���
 */
XMLTree.prototype.getSelectedItem = function()
{
	return this._oSelectedItem;
}

/**
 * ����Ԥ����Ľӿ�
 * @param
 * 		oAction-Ԥ����Ľӿڶ���
 * @return
 * 		null
 */
XMLTree.prototype.setPretreatmentAction = function(oAction)
{
	this.pretreatmentAction = oAction;
}

/**
 * ����Ԥ����Ľӿ�
 * @param
 * 		null
 * @return
 * 		Ԥ����Ľӿ�
 */
XMLTree.prototype.getPretreatmentAction = function()
{
	return this.pretreatmentAction;
}

/**
 * ���ö�̬����Ľӿ�
 * @param
 * 		oAction-��̬����Ľӿڶ���
 * @return 
 * 		null
 */
XMLTree.prototype.setDynamicLoadAction = function(oAction)
{
	this.dynamicLoadAction = oAction;
}

/**
 * ���ض�̬����Ľӿ�
 * @param 
 * 		null
 * @return 
 * 		��̬����Ľӿڶ���
 */
XMLTree.prototype.getDynamicLoadAction = function()
{
	return this.dynamicLoadAction;
}

XMLTree.prototype.setAfterDynamicLoadAction = function(oAction)
{
	this.afterDynamicLoadAction = oAction;
}

/**
 * ���õ����¼��ӿ�
 * @param 
 * 		oAction-�����¼��ӿڶ���
 * @return 
 * 		null
 */
XMLTree.prototype.setClickAction = function(oAction)
{
	this.clickAction = oAction;
}

/**
 * ���ص����¼��ӿ�
 * @param
 * 		null
 * @return 
 * 		�����¼��ӿڶ���
 */
XMLTree.prototype.getClickAction = function()
{
	return this.clickAction;
}

/**
 * ����˫���¼��Ľӿ�
 * @param 
 * 		oAction-˫���¼��Ľӿڶ���
 * @return 
 * 		null
 */
XMLTree.prototype.setDblClickAction = function(oAction)
{
	this.dblclickAction = oAction;
}

/**
 * ���ñ༭�¼��Ľӿ�
 * @param 
 * 		oAction-�༭�¼��Ľӿڶ���
 * @return 
 * 		null
 */
XMLTree.prototype.setEditAction = function(oAction)
{
	this.editAction = oAction;
}

/**
 * ���ر༭�¼��Ľӿ�
 * @param
 * 		null
 * @return
 * 		�༭�¼��Ľӿڶ���
 */
XMLTree.prototype.getEditAction = function()
{
	return this.editAction;
}

/**
 * ������ק��ʼ�¼��Ľӿ�
 * @param 
 * 		oAction-��ק��ʼ�¼��Ľӿڶ���
 * @return 
 * 		null
 */
XMLTree.prototype.setStartDragAction = function(oAction)
{
	this.startDragAction = oAction;
}

/**
 * ������ק��ʼ�¼��Ľӿ�
 * @param 
 * 		null
 * @return 
 * 		��ק��ʼ�¼��Ľӿڶ���
 */
XMLTree.prototype.getStartDragAction = function()
{
	return this.startDragAction;
}

/**
 * ������ק�����¼��Ľӿ�
 * @param 
 * 		oAction-��ק�����¼��Ľӿڶ���
 * @return
 * 		null
 */
XMLTree.prototype.setEndDragAction = function(oAction)
{
	this.endDragAction = oAction;
}

/**
 * ������ק�����¼��Ľӿ�
 * @param
 * 		null
 * @return
 * 		��ק�����¼��Ľӿڶ���
 */
XMLTree.prototype.getEndDragAction = function()
{
	return this.endDragAction;
}

/**
 * �����Ҽ��¼��Ľӿ�
 * @param
 * 		oAction-�Ҽ��¼��Ľӿڶ���
 * @return
 * 		null
 */
XMLTree.prototype.setRightAction = function(oAction)
{
	this.rightAction = oAction;
}

/**
 * �����Ҽ��¼��Ľӿ�
 * @param
 * 		null
 * @return
 * 		�Ҽ��¼��Ľӿڶ���
 */
XMLTree.prototype.getRightAction = function()
{
	return this.rightAction;
}

/**
 * ����ѡ���¼��Ľӿ�
 * @param
 * 		oAction-ѡ���¼��Ľӿ�
 * @return
 * 		null
 */
XMLTree.prototype.setCheckBoxClickAction = function(oAction)
{
	this.checkBoxClickAction = oAction;
}

/**
 * ����ѡ���¼��Ľӿ�
 * @param
 * 		null
 * @return
 * 		ѡ���¼��Ľӿ�
 */
XMLTree.prototype.getCheckBoxClickAction = function()
{
	return this.checkBoxClickAction;
}

/**
 * ������������¼��ӿ�
 * @param
 * 		oAction-��������¼��ӿڶ���
 * @return
 * 		null
 */
XMLTree.prototype.setLoadAction = function(oAction)
{
	this.loadAction = oAction;
}

/**
 * ������������¼��ӿ�
 * @param
 * 		null
 * @return
 * 		��������¼��ӿڶ���
 */
XMLTree.prototype.getLoadAction = function()
{
	return this.loadAction;
}

/**
 * �����Ҽ�����
 * @param
 * 		oRightMenu-�Ҽ�����
 * @return
 * 		null
 */
XMLTree.prototype.setRightMenu = function(oRightMenu)
{
	this.rightMenu = oRightMenu;
}

/**
 * ���ظ��ڵ�
 * @param
 * 		isFireAction:ѡ�и��ڵ��,�Ƿ񼤷������¼�
 *  	attName:���ڹ��˸��ڵ����������
 * 		attVal:ƥ������ָ�����Ե�ֵ
 * @return
 * 		ѡ�еĸ��ڵ�
 */
XMLTree.prototype.toParent = function(isFireAction,attName,attVal)
{
	var oItem = this._oSelectedItem;
	isFireAction = isNull(isFireAction)?true:isFireAction;
	var parentItem = this._getParent(oItem);
	if(!isNull(parentItem))
	{
		if(parentItem.getAttribute(attName) == attVal)
		{
			if(isFireAction)
			{
				parentItem.click();
			}
			else
			{
				this._click(parentItem,'No_FireAction');
			}
		}
		else
		{
			parentItem = null;
		}
	}
	return parentItem;
}

/**
 * ��ת��ָ���ڵ�
 * @param
 * 		index-ָ���ڵ��ID
 * 		isFireAction-��ת���Ƿ񼤷������¼�
 * @return
 * 		null
 */
XMLTree.prototype.gotoItem = function(index,isFireAction)
{
	isFireAction = isNull(isFireAction)?true:isFireAction;
	var oItem = document.getElementById(index);
	if(!isNull(oItem))
	{
		this._openParent(oItem);
		if(isFireAction)
		{
			oItem.click();
		}
		else
		{
			this._click(oItem,'No_FireAction');
		}
	}
}

/**
 * Ϊ������һ���µĽڵ�
 * @param
 * 		addId-�½��ڵ��IDֵ(����)
 * 		addText-�½��ڵ������(ȱʡΪ����Ĭ��ָ����)
 * 		addAttNames-�����������(�ɿ�)
 * 		addAttValues-������Ե�ֵ(�ɿ�)
 * 		isClick-��Ӻ��Ƿ񵥻�(ȱʡΪ����)
 * 		isEdit-��Ӻ��Ƿ�༭(ȱʡΪ���༭)
 * 		oAddItem-ָ���ڵ������(ȱʡΪ��ǰѡ�нڵ�)
 * @return
 * 	null
 */
XMLTree.prototype.add = function(addId,addText,addAttNames,addAttValues,isClick,isEdit,oAddItem)
{    
   this._addParentItem = (isNull(oAddItem))?this._oSelectedItem:oAddItem;
   this._addId = addId;
   this._addText = (isNull(addText))?this.addText:addText;
   this._addAttNames = addAttNames;
   this._addAttValues = addAttValues;
   this._isClick = (isNull(isClick))?true:isClick;
   this._isEdit = (isNull(isEdit))?false:isEdit;

   var oItemDiv = getElement(this._addParentItem,'div');
   if(this._isClosed(oItemDiv))
   {
   		if(oItemDiv.type == 'dynamicLoadNode')
		{
			this.dynamicLoadTree(this._addParentItem,'from_add');
			return;
		}
		else if(oItemDiv.type == 'parentNode')
		{
			oItemDiv.firstChild.click();
		}
	}
	this._add();
}

/**
 * ɾ����ǰѡ��Ľڵ�
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.del = function()
{
	this.delItem(this._oSelectedItem);
}

/**
 * �޸ĵ�ǰ�ڵ������
 * @param
 * 		attName:��������
 * 		attValue:����ֵ
 * 		oItem:�޸ĵĽڵ�(Ĭ��Ϊ��ǰѡ�еĽڵ�)
 */
XMLTree.prototype.setItemAttribute = function(attName,attValue,oItem)
{
	if(!oItem)
	{
		oItem = this._oSelectedItem;
	}
	if(oItem)
	{
		oItem.setAttribute(attName,attValue);
		this._changeTreeDoc(oItem,attName,attValue);
		if(attName == "ico")
		{
			var icoPath = oItem.previousSibling.src.match(FIND_FILE_PATH_REG);
			oItem.previousSibling.src = icoPath+attValue;
		}
	}
}

/**
 * �޸ĵ�ǰ�ڵ����ʾ��ֵ
 * @param
 * 		attName:��������
 * 		attValue:����ֵ
 * 		oItem:�޸ĵĽڵ�(Ĭ��Ϊ��ǰѡ�еĽڵ�)
 */
XMLTree.prototype.setItemLabel = function(label,oItem)
{
	if(!oItem)
	{
		oItem = this._oSelectedItem;
	}
	oItem.innerText = label;
	this._changeTreeDoc(oItem,"label",label);
}

/**
 * �޸�ѡ�нڵ��ֵ
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.edit = function()
{
    var oInput = document.createElement('input');
    oInput.style.width = this._oSelectedItem.offsetWidth+10;
    oInput.style.border = EDIT_BORDER;
    oInput.value = this._oSelectedItem.innerText;

    oInput.style.fontSize = this._oSelectedItem.currentStyle.fontSize;
    oInput.style.fontWeight = this._oSelectedItem.currentStyle.fontWeight;
    oInput.style.fontStyle = this._oSelectedItem.currentStyle.fontStyle;
    oInput.style.fontFamily = this._oSelectedItem.currentStyle.fontFamily;
    oInput.style.textDecoration = this._oSelectedItem.currentStyle.textDecoration;
    oInput.style.margin = this._oSelectedItem.currentStyle.margin;
    oInput.attachEvent('onkeyup',KeyboardInEdit);
    oInput.attachEvent('onblur',_afterItemEdit);
    oInput.XMLTreeObj = this;
    this._oSelectedItem.style.display = 'none';
    this._oSelectedItem.insertAdjacentElement('afterEnd',oInput);
    oInput.select();
}

/**
 * �۵�ָ���ڵ�
 * @param 
 * 		oItemDiv-ָ���ڵ����
 * @return
 * 		null
 */
XMLTree.prototype.collapseItem = function(oItemDiv)
{
	if(isNull(oItemDiv))
	{
		oItemDiv = getElement(this._oSelectedItem,'div');
	}
	if(oItemDiv.type=='parentNode')
	{
		if(!this._isClosed(oItemDiv))
		{
			oItemDiv.firstChild.click();
		}
		var childList = oItemDiv.nextSibling.firstChild.rows[0].cells[1].childNodes;
		for(var i=0; i<childList.length;i++)
		{
			this.collapseItem(childList[i].firstChild);
		}
	}
}

/**
 * չ��ָ���ڵ�
 * @param
 * 		oItemDiv-ָ���ڵ����
 * @return
 * 		null
 */
XMLTree.prototype.expandItem = function(oItemDiv)
{
	if(isNull(oItemDiv))
	{
		oItemDiv = getElement(this._oSelectedItem,'div');
	}
	if(oItemDiv.type == 'parentNode')
	{
		if(this._isClosed(oItemDiv))
		{
			oItemDiv.firstChild.click();
		}
		this._expandItem(oItemDiv);
	}
	else if(oItemDiv.type == 'dynamicLoadNode')
	{
		this._click(oItemDiv.firstChild,'from_expand');
	}
}

/**
 * ��ԭԭ�ȵĵ�������
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.releaseClick = function()
{
	if(this._oClickedItem != this._oSelectedItem)
	{
		this._changeClickColor(this._oClickedItem);
	}
}

/**
 * �ͷ��Ҽ������¼�
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.releaseRightClick = function()
{
	if(!this.isRightFireOnClick)
	{
		this.releaseClick();
	}
}

/**
 * �����ƶ�ѡ�����
 * @param {} direction �ƶ����up down
 * @param {} oEvent
 */
XMLTree.prototype.moveSelectItem=function(direction,oEvent)
{
   if(!isNull(this._oSelectedItem) && !this._isTop(this._oSelectedItem))
   {
       var oSelItemDiv=getElement(this._oSelectedItem,'div',1);
       var oPrevItemDiv=oSelItemDiv.previousSibling;
       var oNextItemDiv=oSelItemDiv.nextSibling;
       var oToSwapDiv=(direction=="up")?oPrevItemDiv:oNextItemDiv;
       var isOK=true;
       if(oToSwapDiv)
       {
           if(oEvent && oEvent.onBeforeMove)
           {
              isOK=oEvent.onBeforeMove.call(this,this._oSelectedItem,oToSwapDiv.firstChild.lastChild);
	       }
	       if(isOK)
           {
              swapItem(this,oSelItemDiv,oToSwapDiv);
	       }	       
	   }
   }
   function swapItem(oTree,oSelItemDiv,oToSwapDiv)
   {
      var isSwapLast=((oSelItemDiv.firstChild.isLast=="true")||(oToSwapDiv.firstChild.isLast=="true"));
      if(isSwapLast)
      {
          var isSelectLast=oSelItemDiv.firstChild.isLast;
          var isToSwapLast=oToSwapDiv.firstChild.isLast;
          var sSelectLineStyle=oSelItemDiv.firstChild.firstChild.lineType;
          var sToSwapLineStyle=oToSwapDiv.firstChild.firstChild.lineType;
          oSelItemDiv.firstChild.isLast=isToSwapLast;
          oToSwapDiv.firstChild.isLast=isSelectLast;
          oTree._changeImgState(oSelItemDiv.firstChild.firstChild,sToSwapLineStyle);
          oTree._changeImgState(oToSwapDiv.firstChild.firstChild,sSelectLineStyle);          
      }
      oSelItemDiv.swapNode(oToSwapDiv);
   }
}

/*========����Ϊprivate����========*/

/**
 * �޸�ָ���ڵ����ɫ
 * @private
 * @param
 * 		oItem-ָ���ڵ�
 * @return
 * 		null
 */
XMLTree.prototype._changeClickColor = function(oItem)
{
	if(!isNull(this._oSelectedItem))
    {
        this._oSelectedItem.runtimeStyle.backgroundColor = '';
        this._oSelectedItem.runtimeStyle.color = '';
        this._oSelectedItem.runtimeStyle.border = '';
    }
    if(!isNull(this._oClickedItem) && this._oClickedItem != this._oSelectedItem)
    {
        this._oClickedItem.runtimeStyle.backgroundColor = '';
        this._oClickedItem.runtimeStyle.color = '';
        this._oClickedItem.runtimeStyle.border = '';
    }
    this._oSelectedItem = oItem;
    if(!isNull(this._oSelectedItem))
    {
	    this._oSelectedItem.fireEvent('onmouseout');
	    this._oSelectedItem.runtimeStyle.backgroundColor = this.selectedBackground;
	    this._oSelectedItem.runtimeStyle.color = SELECTED_COLOR;
	    this._oSelectedItem.runtimeStyle.border = this.selectedBorder;
    }
}

/**
 * ����ʧȥ����ĵ���ѡ�ж�����ʽ
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype._setUnforceClickedItemStyle = function()
{
	if(this._oClickedItem && this._oClickedItem!=this._oSelectedItem)
	{
		this._oClickedItem.runtimeStyle.border = UNFORCE_CLICKEDITEM_BORDER;
	}
}

/**
 * �ж�ָ���ڵ��Ƿ��Ƕ����ڵ�
 * @private
 * @param
 * 		oItem-ָ���ڵ�
 * @return
 * 		null
 */
XMLTree.prototype._isTop = function(oItem)
{
	return (getElement(oItem,'div',1).parentElement==this._showAtElement);
}

/**
 * չ��ָ���ڵ���ϼ��ڵ�
 * @private
 * @param
 * 		oItem-ָ���ڵ����
 * @return
 * 		null
 */
XMLTree.prototype._openParent = function(oItem)
{
	if(!this._isTop(oItem))
	{
		var parentItemDiv = getElement(oItem,'div',2)
		var oParentItem = parentItemDiv.previousSibling;
		if(parentItemDiv.style.display=='none')
		{
			oParentItem.firstChild.click();
		}
		this._openParent(oParentItem);
	}
}

/**
 * �õ�ָ���ӽڵ�ĸ��ڵ�
 * @private
 * @param
 * 		oItem-ָ���ڵ�
 * @return
 * 		���ڵ�
 */
XMLTree.prototype._getParent = function(oItem)
{
	var parentItem
	if(this._isTop(oItem))
	{
		parentItem = null;
	}
	else
	{
		parentItem = getElement(oItem,'div',2).previousSibling.lastChild;
	}
	return parentItem;
}

XMLTree.prototype._getChildNodes = function(oItem)
{
	var oItemChildNodes = new Array();
	if(oItem)
	{
		var oItemDiv = getElement(oItem,"div");
		if(oItemDiv.nextSibling)
		{
			oItemChildNodes = oItemDiv.nextSibling.firstChild.rows[0].cells[1].childNodes;
		}
	}
	return oItemChildNodes
}

/**
 * ���ڵ�������¼��Ĵ���
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.onParentNodeClick = function()
{
    var oImg = event.srcElement;
    var oItemDiv = getElement(event.srcElement,"div");
    //�Ѿ������
    if(oItemDiv.type == 'parentNode')
    {
        var oChildrenDiv = oItemDiv.nextSibling;
        if(oChildrenDiv.style.display == "none")
        {
            oChildrenDiv.style.display = "";
            this._changeImgSrc(oImg,0);
        }
        else
        {
            oChildrenDiv.style.display = "none";
            this._changeImgSrc(oImg,1);
        }
    }
    //��̬����ʱִ��
    else if(oItemDiv.type == 'dynamicLoadNode')
    {
        this.dynamicLoadTree(oImg.nextSibling.nextSibling,event.fireType);
    }
}

/**
 * ��껮��ÿ����Ŀʱ����¼�����
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.onItemOver = function()
{
    if(event.srcElement == this._oSelectedItem) return;
    event.srcElement.runtimeStyle.textDecoration = 'underline';
}

/**
 * ��껮��ÿ����Ŀʱ����¼�����
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.onItemOut = function()
{
    event.srcElement.runtimeStyle.textDecoration = '';
}

/**
 * ��굥��ʱ���¼�����
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.onItemClick = function()
{
    if (this.isReadOnly===true ||(!this.isSelectedClick && this._oSelectedItem == event.srcElement))
    {
    	return false;
    }
    this._changeClickColor(event.srcElement);
		this._oClickedItem = this._oSelectedItem;
    if (isAction(this.clickAction,XMLTree_onClick_Action) && event.fireType!='No_FireAction')
    {
        this.clickAction.click(this._oSelectedItem);
    }
    if(this.isOpenChildAtferClick && event.fireType!="from_other")
    {
        if(this._isClosed(this._oSelectedItem))
        {
        	this._oSelectedItem.previousSibling.previousSibling.click();
        }
    }
}

/**
 * ��˫��ʱִ�е��¼�
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.onItemDblClick = function()
{
    if (isAction(this.dblclickAction,XMLTree_onDblClick_Action))
    {
        this.dblclickAction.dblclick(this._oSelectedItem);
    }
}

/**
 * ���ڵ��Ҽ��¼�����
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.rightClickEvent = function()
{
	this._oClickedItem = this._oSelectedItem;
	if(this.isRightFireOnClick)
	{
		if(this._oSelectedItem != event.srcElement)
		{
			this._click(event.srcElement);
		}
	}
	else
	{
		this._changeClickColor(event.srcElement);
		this._setUnforceClickedItemStyle();
	}
	if(isAction(this.rightAction,XMLTree_oncontextmenu_Action))
	{
		this.rightAction.rightClick(this._oSelectedItem);
	}
	if(!isNull(this.rightMenu))
	{
		this.rightMenu.show();
	}
	event.returnValue = false;
}

/**
 * checkBoxѡ���¼��Ĵ���
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.itmeCheckEvent = function()
{
	var oCheckBox = event.srcElement;
	if(isAction(this.checkBoxClickAction,XMLTree_onCheckBoxClick_Action))
	{
		this.checkBoxClickAction.check(oCheckBox,oCheckBox.nextSibling);
	}
	var oItemDiv = getElement(oCheckBox,'DIV');
	if(oItemDiv.type == 'parentNode')
	{
		this.checkedItem(oItemDiv,event.srcElement.checked);
	}
}

/**
 * ����ָ�������checkbox
 * @private
 * @param
 * 		oItemDiv-ָ���Ľڵ����
 * 		isChecked-��Ҫ���ĵ�״̬
 * @return
 * 		null
 */
XMLTree.prototype.checkedItem = function(oItemDiv,isChecked)
{
	var oChilds = oItemDiv.nextSibling.firstChild.rows[0].cells[1].childNodes;
	var oChildItemDiv;
	var oCheckBox;
	for(var i=0;i<oChilds.length;i++)
	{
		oChildItemDiv = oChilds[i].firstChild;
		oCheckBox = oChildItemDiv.childNodes[1];
		if(oCheckBox.checked != isChecked)
		{
			oCheckBox.checked = isChecked;
			if(isAction(this.checkBoxClickAction,XMLTree_onCheckBoxClick_Action))
			{
				this.checkBoxClickAction.check(oCheckBox,oCheckBox.nextSibling);
			}
		}
		if(oChildItemDiv.type == 'parentNode')
		{
			this.checkedItem(oChildItemDiv,isChecked);
		}
	}
}

/**
 * ��ק��ʼʱ�������¼�
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.startDrag = function()
{
	if(event.button == 1)
	{		
		if(this.isDragOnTree || this.isDragOnPage)
		{
 			this.startDragClientX = event.clientX;
 			this.startDragClientY = event.clientY;
 			if(isAction(this.startDragAction,XMLTree_onDragStart_Action))
 			{
 				this._isFireDrag = this.startDragAction.isStartDrag(event.srcElement)
 			}
 			else
 			{
 				this._isFireDrag = true;
 			}
		}
	}
}
 
/**
 * ������ק��ʵ��
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.drag = function()
{
 	var offsetClientX = event.clientX - this.startDragClientX;
 	var offsetClientY = event.clientY - this.startDragClientY;
 	var isOffset = ( offsetClientX>3 || offsetClientX<-3 || offsetClientY>3 || offsetClientY<-3);
 	if(isOffset && this._isFireDrag && event.button == 1)
 	{
 		this._DragItem = event.srcElement;
		this._DragItem.fireEvent('onmouseout');
		this._DragItemDiv = getElement(this._DragItem,'div');
		this._DragParentItem = this._getParent(this._DragItem);
		var oIco = this._DragItem.previousSibling;
		var oIcoWidth = oIco.offsetWidth;
		var oIcoHeight = oIco.offsetHeight;
		var oItemLeft = parseInt(this._DragItem.style.marginLeft,10);
		var iX = oIcoWidth/2 + DRAGBODY_LEFT;
		var iY = oIcoHeight/2;
 		if(this.isDragOnTree)
 		{
 			this.dragOnTree(oIco,iX,iY);
 		}
 		else if(this.isDragOnPage)
 		{
 			this.dragOnPage(oIco,iX,iY,oIcoWidth,oItemLeft); 			
 		}
 	}
}

/**
 * ��ҳ����϶�ʱ��ִ��(ͨ��popupʵ��)
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.dragOnPage = function(oIco,iX,iY,oIcoWidth,oItemLeft)
{
	this._createDragPopup();
	var treeObj = this;
	var iWidth = oIcoWidth+this._DragItem.offsetWidth+oItemLeft+DRAGBODY_LEFT+2;
	var iHeight = this._DragItemDiv.offsetHeight;
	_dragPopup.document.body.innerHTML = oIco.outerHTML + this._DragItem.outerHTML;
 	window.document.body.setCapture();
	
	window.document.body.onmouseup = function()
	{
		treeObj._isFireDrag = false;
    	_dragPopup.hide();
		document.releaseCapture();
    	window.document.body.onmousemove = null;
    	window.document.body.onmouseup = null;
    	treeObj._endDrag();
	}
	
	window.document.body.onmousemove = function()
	{
		_dragPopup.show(event.screenX-iX,event.screenY-iY,iWidth,iHeight);
		if(treeObj.isDragOnPageBySelf)
		{
			treeObj._drag(event.clientX,event.clientY);
		}
	}
}

/**
 * �������϶�ʱ��ִ��(ͨ��divʵ��)
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.dragOnTree = function(oIco,iX,iY)
{
	this._createDragDiv();
	var treeObj = this;
	_dragDiv.innerHTML = oIco.outerHTML + this._DragItem.outerHTML;
	_dragDiv.style.display = 'block';
	_dragDiv.style.whiteSpace = 'nowrap';
 	_dragDiv.setCapture();
	
	_dragDiv.onmouseup = function()
	{
		treeObj._isFireDrag = false;
		_dragDiv.releaseCapture();
    	_dragDiv.style.display = 'none';
    	_dragDiv.onmousemove = null;
    	_dragDiv.onmouseup = null;
    	treeObj._endDrag();
	}
	
	_dragDiv.onmousemove = function()
	{
		_dragDiv.style.left = event.clientX-iX+document.body.scrollLeft;
		_dragDiv.style.top = event.clientY-iY+document.body.scrollTop;
		if(treeObj.isDragOnTreeBySelf)
		{
			treeObj._drag(event.clientX,event.clientY);
		}
	}
}
/**
 * ��ק����ʱִ��
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype.endDragEvent = function()
{
 	if(this._isFireDrag)
 	{
 		this._isFireDrag = false;
 	}
}

/**
 * ��ø��ڵ�
 */
 
XMLTree.prototype.getRoot = function()
{
 	var rootItem;
 	var rootItemDiv = this._showAtElement.firstChild;
 	if(rootItemDiv)
 	{
 		rootItem = rootItemDiv.firstChild.lastChild;
 	}
 	return rootItem;
}
 
/**
 * ͨ�����������ָ��ֵ����½ڵ�
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype._add = function()
{
	var containerDiv = getElement(this._addParentItem,'div',1);
	var addItem = document.getElementById(this._addId);
	if(isNull(addItem) || !containerDiv.contains(addItem))
	{
		addItem = this._addItem(this._addParentItem,this._addId,this._addText,this._addAttNames,this._addAttValues);
	}
	if (this._isClick)
    {
    	this._click(addItem);
    }
    if (this._isEdit)
    {
    	this.edit();
    }
}
 
/**
 * ��ָ���ڵ㴦��Ӹ��ڵ�
 */
XMLTree.prototype._addParentToItem = function(oItem,addId,addText,addAttNames,addAttValues)
{
	var targetItem = this._addItemBefore(oItem,addId,addText,addAttNames,addAttValues);
	this._moveItemToItem(targetItem,oItem);
	return targetItem;
}

XMLTree.prototype._addItemBefore = function(oItem,addId,addText,addAttNames,addAttValues)
{
	var addDoc = this._createAddDoc(addId,addText,addAttNames,addAttValues);
	var oAddItem;
	var oNodeDiv = getElement(oItem,'div',1);
	var oParentItem = this._getParent(oItem);
	this._addTreeDocBeforeByDoc(oItem,addDoc);
	if(oParentItem)
	{
		this._setAddItemXSL(TRANSFORMTYPE_INIT,getElement(oParentItem,'div'));
	}
	else
	{
		/**
		 * �д��޸����Ƶ�
		 */
		var oItemDiv = oNodeDiv.firstChild;
		if(oItemDiv.isOnlyNode=="true")
		{
			oItemDiv.firstChild.style.display = '';
			oItemDiv.isLast = 'true';
			this._changeImgState(oItemDiv.firstChild,'bottomLine');
		}
		this._setXslAttribute('transformType',TRANSFORMTYPE_INIT);
    	this._setXslAttribute('isShowLineInOnlyNode',false);
    	this._setXslAttribute('showDepth',this.dynamicLoadShowDepth);
	}
	oNodeDiv.insertAdjacentHTML('beforeBegin',addDoc.transformNode(this._xslDoc));
	var oAddItemDiv = oNodeDiv.previousSibling.firstChild
	var lastItemImg = oAddItemDiv.firstChild;
	oAddItem = oAddItemDiv.lastChild;
	oAddItemDiv.isLast = 'false';
	this._changeImgState(lastItemImg,'otherLine');
	return oAddItem;
}

/**
 * ��ӵľ���ײ����
 * @private
 * @param
 * 		oItem-����ӵĽڵ�
 * 		addId-�½��ڵ��IDֵ
 * 		addText-�½��ڵ������
 * 		addAttNames-�����������(��ѡ)
 * 		addAttValues-������Ե�ֵ(��ѡ)
 * @return
 */
XMLTree.prototype._addItem = function(oItem,addId,addText,addAttNames,addAttValues)
{
	var oItemDiv = getElement(oItem,'div');
	var oAddItem;
	var addDoc = this._createAddDoc(addId,addText,addAttNames,addAttValues);
	if(oItem == this._showAtElement)
	{
		this.xmlObj = addDoc;
		this.showAt(oItem);
		oAddItem = this.getRoot();
	}
	else 
	{
		if (oItemDiv.type == 'parentNode')
		{
			this._addChildToParentNode(addDoc,oItemDiv);
		}
		else
	   	{
	   		this._addChildToSingleNode(addDoc,oItemDiv);
	   	}
	   	oAddItem = oItemDiv.nextSibling.firstChild.rows[0].cells[1].lastChild.firstChild.lastChild;
	   	if(this.isDynamicLoad)
	   	{
	   		var oAddItemDiv = getElement(oAddItem,'div');
	   		var oAddItemImg = oAddItemDiv.firstChild
	   		oAddItemDiv.type = 'singleNode';
	   		oAddItemImg.imgType = '2';
	   		oAddItemImg.src = oAddItemImg.src2;
	   	}
		if(addId != "waitItem")
		{
			this._addTreeDocByDoc(oItem,addDoc);
		}
	}
   	return oAddItem;
}

XMLTree.prototype._expandItem = function(oItemDiv)
{
	var childList = oItemDiv.nextSibling.firstChild.rows[0].cells[1].childNodes;
	for(var i=0; i<childList.length;i++)
	{
		this.expandItem(childList[i].firstChild);
	}
}

/**
 * �ж�ָ���ڵ��ǹرջ����ſ�
 * @private
 * @param
 * 		oItem-ָ���ڵ����
 * @return
 * 		չ��-false
 * 		�ر�-true
 */
XMLTree.prototype._isClosed = function(oItem)
{
	var oItemDiv = getElement(oItem,'div');
	return (oItemDiv.firstChild.imgType == 1);
}

/**
 * ��������˵��:����xsl����
 *
 * ����˵��:
 *       name --- ������(����)
 *       value --- ���Ե�ֵ(����)
 *
 * ����ֵ:
 **/
XMLTree.prototype._setXslAttribute = function(name,value)
{
    if(!isNull(value))
    {
        switch(value.constructor)
        {
            case String:
                value = "'"+value+"'";
                break;
            case Boolean:
                value = value+"()";
                break;
        }
        name = '/xsl:stylesheet/xsl:variable[@name="'+name+'"]';
        this._xslDoc.selectSingleNode(name).setAttribute("select",value);
    }
}

/**
 * ��������˵��:��������XSL����
 *
 * ����˵��:�������Ĺ���
 *
 * ����ֵ:��
 **/
XMLTree.prototype._setXslAttributeArray = function(name)
{
    for(var i=0;i<eval("this." + name + ".length");i++)
    {
        this._setXslAttribute(name+i,eval("this." + name+"["+i+"]"));
    }
}

/**
 * ��������˵��:��ʼ����
 *
 * ����˵��:url --- xml���ڵĵ�ַ(����) 
 *
 * ����ֵ:��
 **/
XMLTree.prototype._iniTreeXML = function(url)
{
	this._setTreeXML(url,0);
}

/**
 * ��������˵��:��̬������
 *
 * ����˵��:url --- xml���ڵĵ�ַ(����) 
 *
 * ����ֵ:��
 **/
XMLTree.prototype._dynamicLoadXML = function(url,oItemDiv,oWaitItem,fireType)
{
	this._setTreeXML(url,1,oItemDiv,oWaitItem,fireType);
}

/**
 * ��������˵��:��ȡ����xml����
 *
 * ����˵��:
 *    url --- xml���ڵĵ�ַ(����)
 *    action --- ״̬ 0��ʾ��ʼ�� 1��ʾ��̬����     
 *
 * ����ֵ:��
 **/
XMLTree.prototype._setTreeXML = function(url,action,oElement,oWaitItem,fireType)
{
    var treeObj = this;
    var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
    xmlRequest.open("post",url,true);
    xmlRequest.onreadystatechange = function ()
    {
    	switch(action)
    	{
    		case 0:
    			treeObj._iniTrans(xmlRequest);
    			break;
    		case 1:
    			treeObj._dynamicLoadTrans(xmlRequest,oElement,oWaitItem,fireType);
    			break;
    	}
    }
    xmlRequest.send();
}

/**
 * ����XML����ڵ�
 * @private
 * @param
 * 		xmlObj-����XML����
 * 		oElement-������ʾ�ڵ�
 * 		xmlTreeMsg-����������,������Ϣ
 * @return
 * 		null
 */
XMLTree.prototype._loadXMLObj = function(xmlObj,xmlTreeMsg)
{
	if(xmlTreeMsg=="OK")
	{
		this._treeDoc.load(xmlObj);
		if(isAction(this.pretreatmentAction,XMLTree_onBeforeXMLTrans_Action))
        {
            this._treeDoc = this.pretreatmentAction.pretreatment(this._treeDoc);
        }
        
    	this._showAtElement.innerHTML = this._treeDoc.transformNode(this._xslDoc);
    	this._showAtElement.XMLTreeObj = this;
    	//alert( this._treeDoc.xml);
    	var roots = this._treeDoc.selectNodes('/root/Menu/MenuItem');
    	if(roots && roots.length==1)
    	{
    		this._treeRoot = this.getRoot();
    		if(this._isClosed(this._treeRoot))
	        {
	        	this._treeRoot.previousSibling.previousSibling.click();
	        }
    	}
    	
    	if(isAction(this.loadAction,XMLTree_onLoad_Action))
		{
			this.loadAction.load();
		}
	}
	else
	{
		this._showAtElement.innerHTML = xmlTreeMsg;
	}
}


XMLTree.prototype._iniXMLObj = function(xmlObj)
{
	this._loadXMLObj(xmlObj,this._isSuccessXMLObj(xmlObj))
}

XMLTree.prototype._iniTrans = function(xmlRequest,oElement)
{
	if(xmlRequest.readyState==4)
	{
		this._loadXMLObj(xmlRequest.responseXML,this._isSuccess(xmlRequest))
    	xmlRequest = null;
	}
}

XMLTree.prototype._dynamicLoadTrans = function(xmlRequest,oItemDiv,oWaitItem,fireType)
{
	if(xmlRequest.readyState==4)
	{
		var xmlTreeMsg = this._isSuccess(xmlRequest)
		if(xmlTreeMsg=="OK")
		{
			this._addChildToSingleNode(xmlRequest.responseXML,oItemDiv);
			getElement(oWaitItem,'div',2).removeNode(true);
			this._afterDynamicLoadTrans(fireType,oItemDiv);
			this._addTreeDocByDoc(oItemDiv,xmlRequest.responseXML);
			if(isAction(this.afterDynamicLoadAction,XMLTree_AfterDynamicLoad_Action))
		    {
		        this.afterDynamicLoadAction.afterDynamicLoad();
		    }
		}
		else
		{
			oWaitItem.innerText = xmlTreeMsg;
			oWaitItem.previousSibling.src = this.errorIco;
		}
		xmlRequest = null;
	}
}

XMLTree.prototype._getItemXpath = function(oItem)
{
	if(oItem)
	{
		var parentItem = this._getParent(oItem);
		var oNodeDiv = getElement(oItem,'div',1);
		var parentChildNodes = oNodeDiv.parentNode.childNodes;
		for(var i=0;i<parentChildNodes.length && oNodeDiv!=parentChildNodes[i];i++);
		return this._getItemXpath(parentItem)+"/MenuItem[position() = "+(i+1)+"]";
	}
	else
	{
		return "/root/Menu";
	}
}

XMLTree.prototype.getXMLNodeByItem = function(oItem)
{
	return this._treeDoc.selectSingleNode(this._getItemXpath(oItem));
}

XMLTree.prototype._addTreeDocByDoc = function(oItem,oDoc)
{
	if(this.isSyncDoc)
	{
		var oAddNode = this._treeDoc.selectSingleNode(this._getItemXpath(oItem));
		if(oAddNode)
		{
			var oNewNodeList = oDoc.selectNodes("/root/Menu/MenuItem");
			
			while(oAddNode.hasChildNodes()) {
				oAddNode.removeChild(oAddNode.childNodes[0]);
			}
			
			for(var i=0;i<oNewNodeList.length;i++)
			{
				oAddNode.appendChild(oNewNodeList[i].cloneNode(true));
			}
		}
	}
}

XMLTree.prototype._addTreeDocByItem = function(oItem_1,oItem_2)
{
	if(this.isSyncDoc)
	{
		var oAddNode;
		if(oItem_1)
		{
			oAddNode = this._treeDoc.selectSingleNode(this._getItemXpath(oItem_1));
		}
		else
		{
			oAddNode = this._treeDoc.selectSingleNode('/root/Menu');
		}
		var oNewNode = this._treeDoc.selectSingleNode(this._getItemXpath(oItem_2));
		oAddNode.appendChild(oNewNode);
	}
}

XMLTree.prototype._addTreeDocBeforeByDoc = function(oItem,oDoc)
{
	if(this.isSyncDoc)
	{
		var oAddNode = this._treeDoc.selectSingleNode(this._getItemXpath(oItem));
		var oNewNodeList = oDoc.selectNodes("/root/Menu/MenuItem");
		for(var i=0;i<oNewNodeList.length;i++)
		{
			oAddNode.parentNode.insertBefore(oNewNodeList[i].cloneNode(true),oAddNode);
		}
	}
}

XMLTree.prototype._delTreeDocByItem = function(oItem)
{
	if(this.isSyncDoc)
	{
		var oDelNode = this._treeDoc.selectSingleNode(this._getItemXpath(oItem));
		oDelNode.parentNode.removeChild(oDelNode);
	}
}

XMLTree.prototype._changeTreeDoc = function(oItem,attName,attValue)
{
	if(this.isSyncDoc)
	{
		var oChangeNode = this._treeDoc.selectSingleNode(this._getItemXpath(oItem));
		oChangeNode.setAttribute(attName,attValue);
	}
}

XMLTree.prototype.getTreeDoc = function ()
{
	return this._treeDoc;
}

XMLTree.prototype._afterDynamicLoadTrans = function(fireType,oItemDiv)
{
	if(fireType=='from_expand' && oItemDiv.type == 'parentNode')
	{
		this._expandItem(oItemDiv);
	}
	else if(fireType == 'from_add')
	{
		this._add();
	}
	else if(fireType == 'from_drag')
	{
		this._moveAfterDrag();
	}
	else if(fireType == 'from_select')
	{
		this.selectItem();
	}
}

XMLTree.prototype._drag = function(iX,iY)
{
	this._clearScrollTree();
	with(this._showAtElement)
	{
		if(scrollHeight>clientHeight)
		{
			if(iY>this._showAtElementBottom-SCROLL_RANGE)
			{
				this.autoScrollTreeByYFunId = 
					window.setInterval("atuoScrollTreeByY("+uniqueID+","+SCROLL_STEP+","+iX+","+iY+")",SCROLL_TIME);
			}
			else if(iY<this._showAtElementTop+SCROLL_RANGE)
			{
				this.autoScrollTreeByYFunId = 
					window.setInterval("atuoScrollTreeByY("+uniqueID+",-"+SCROLL_STEP+","+iX+","+iY+")",SCROLL_TIME);
			}
		}
		if(scrollWidth>clientWidth)
		{
			if(iX>this._showAtElementRight-SCROLL_RANGE)
			{
				this.autoScrollTreeByXFunId = 
					window.setInterval("atuoScrollTreeByX("+uniqueID+","+SCROLL_STEP+","+iX+","+iY+")",SCROLL_TIME);
			}
			else if(iX<this._showAtElementLeft+SCROLL_RANGE)
			{
				this.autoScrollTreeByXFunId = 
					window.setInterval("atuoScrollTreeByX("+uniqueID+",-"+SCROLL_STEP+","+iX+","+iY+")",SCROLL_TIME);
			}
		}
	}
	this._fireOverItem(iX,iY);
}

XMLTree.prototype._fireOverItem = function (iX,iY)
{
	if(this._contains(this._showAtElement,iX,iY))
	{
		if (isNull(this._oOverItem) || !this._contains(this._oOverItem,iX,iY))
		{
			this._oOverItem = this._getOverItem(this._showAtElement.childNodes,iX,iY);
			if(!isNull(this._oOverItem))
			{
				this._oOverItem = this._oOverItem.lastChild
				if(this._DragParentItem==this._oOverItem)
				{
					this._oOverItem = null;
					this._changeClickColor();
					this._setUnforceClickedItemStyle();
				}
				else
				{
					this._changeClickColor(this._oOverItem);
				}
			}
			else
			{
				this._changeClickColor();
				this._setUnforceClickedItemStyle();
			}
		}
	}
	else
	{
		if(!isNull(this._oOverItem))
		{
			this._oOverItem = null;
			this._changeClickColor();
			this._setUnforceClickedItemStyle();
		}
	}
}

XMLTree.prototype._getOverItem = function(oChildNodes,iX,iY)
{
	var i=0;
	for(i=0;i<oChildNodes.length && !this._contains(oChildNodes[i],iX,iY);i++);
	if (i==oChildNodes.length || oChildNodes[i].firstChild==this._DragItemDiv)
	{
		return null;
	}
	else
	{
		var oItemDiv= oChildNodes[i].firstChild;
		if(isNull(oItemDiv.nextSibling)
			|| oItemDiv.nextSibling.style.display=='none' 
			|| this._contains(oItemDiv,iX,iY))
		{
			return oItemDiv;
		}
		else
		{
			return this._getOverItem(oItemDiv.nextSibling.firstChild.rows[0].cells[1].childNodes,iX,iY);
		}
	}
}

XMLTree.prototype._contains = function(oItemDiv,iX,iY)
{
	var rect = oItemDiv.getBoundingClientRect();
	return (iY>rect.top && iY<rect.bottom && iX>rect.left && iX<rect.right);
}

XMLTree.prototype._endDrag = function()
{
	this.releaseClick();
	this._clearScrollTree();
	if (isAction(this.endDragAction,XMLTree_onDragEnd_Action))
	{
		this.endDragAction.iX = event.x;
		this.endDragAction.iY = event.y;
		this.endDragAction.iClientX = event.clientX;
		this.endDragAction.iClientY = event.clientY;
		if(this.endDragAction.endDrag(this._DragItem,this._oOverItem))
		{
			var oParentDragItem = this._getParent(this._DragItem);
			this._moveAfterDrag();		
			this.endDragAction.endMove(oParentDragItem,this._oDragItem,this._oOverItem);
		}
	}
	else
	{
		this._moveAfterDrag();
	}
}

/**
 * �϶����ƶ��ڵ�
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype._moveAfterDrag = function()
{
	if(!isNull(this._oOverItem))
	{
		var oOverItemDiv = getElement(this._oOverItem,'div');
		if(oOverItemDiv.type == 'dynamicLoadNode')
		{
			this.dynamicLoadTree(this._oOverItem,'from_drag');
		}
		else
		{
			this._moveItemToItem(this._oOverItem,this._DragItem);
		}
	}
}

XMLTree.prototype._moveItemToItem = function(oTargetItem,oMoveItem)
{
	if(oTargetItem)
	{
		var oTargetItemDiv = getElement(oTargetItem,'div');
		if(oTargetItemDiv.type == 'singleNode')
		{
			this._beforeAddChildToSingleNode(TRANSFORMTYPE_ADDCHILDRENDIV,this._createChildDivDoc(),oTargetItemDiv);
		}
	}
	var childTd = (oTargetItem)?this._beforeAddChildToParentNode(oTargetItemDiv):this._beforeAddChildToTop();
	
	var oMoveItemDiv = getElement(oMoveItem,'div');
	var oMoveItemAllDiv = oMoveItemDiv.parentElement;
	var oMovePrentItemAllDiv = oMoveItemAllDiv.parentElement;
    var isLast = this._isLastItem(oMoveItemDiv);
    var isTop = this._isTopItem(oMoveItemDiv);
    var oPrevItemDiv;
    var oNextItemDiv;
    if(isLast)
    {
    	if (oMovePrentItemAllDiv.childNodes.length > 1)
    	{
    		oPrevItemDiv = oMoveItemAllDiv.previousSibling.firstChild;
    	}
    }
    else
    {
    	oNextItemDiv = oMoveItemAllDiv.nextSibling.firstChild;
    	oMoveItemDiv.isLast = 'true';
    	this._changeImgState(oMoveItemDiv.firstChild,'bottomLine');
    	if(oMoveItemDiv.type == 'parentNode')
    	{
    		this._setHasLine(oMoveItemDiv,false);
    	}
    }
	this._addTreeDocByItem(oTargetItem,oMoveItemDiv);
	childTd.appendChild(oMoveItemAllDiv);
	this._afterDelItem(isLast,isTop,oMovePrentItemAllDiv,oPrevItemDiv,oNextItemDiv,false);
}

/**
 * ����Զ�����
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype._clearScrollTree = function()
{
	this._clearScrollByXTree();
	this._clearScrollByYTree();
}

/**
 * ���Y�����ϵ��Զ�����
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype._clearScrollByYTree = function()
{
	if(!isNull(this.autoScrollTreeByYFunId))
	{
		window.clearInterval(this.autoScrollTreeByYFunId);
		this.autoScrollTreeByYFunId = null;
	}
}

/**
 * ���X�����ϵ��Զ�����
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype._clearScrollByXTree = function()
{
	if(!isNull(this.autoScrollTreeByXFunId))
	{
		window.clearInterval(this.autoScrollTreeByXFunId);
		this.autoScrollTreeByXFunId = null;
	}
}

/**
 * ������(Y��)
 * @param
 * 		step ÿ�ι����Ĳ���
 * @return
 * 		null
 */
XMLTree.prototype._scrollTreeByY = function (step,iX,iY)
{
	step = parseInt(step,10);
	with(this._showAtElement)
	{
		if(step>0)
		{
			if(scrollHeight == clientHeight+scrollTop)
			{
				this._clearScrollByYTree();
			}
		}
		else
		{
			if(scrollTop==0)
			{
				this._clearScrollByYTree();
			}
		}
		scrollTop = scrollTop + step;
	}
	this._fireOverItem(iX,iY);
}

/**
 * ������(X��)
 * @param
 * 		step ÿ�ι����Ĳ���
 * @return
 * 		null
 */
XMLTree.prototype._scrollTreeByX = function (step,iX,iY)
{
	step = parseInt(step,10);
	with(this._showAtElement)
	{
		if(step>0)
		{
			if(scrollWidth == clientWidth+scrollLeft)
			{
				this._clearScrollByXTree();
			}
		}
		else
		{
			if(scrollLeft==0)
			{
				this._clearScrollByXTree();
			}
		}
		scrollLeft = scrollLeft + step;
	}
	this._fireOverItem(iX,iY);
}

/**
 * ��������˵��: ���������ڵ��XML����
 *
 * ����˵��:
 *       addId --- �½��ڵ��IDֵ(����)
 *       addText --- �½��ڵ������(��ѡ)
 *       addAttNames --- �����������(��ѡ)
 *       addAttValues --- ������Ե�ֵ(��ѡ)
 *
 * ����ֵ: ������XML�ĵ�
 **/
XMLTree.prototype._createAddDoc = function(addId,addText,addAttNames,addAttValues)
{
	return this._createDoc(true,addId,addText,addAttNames,addAttValues);
}
 
/**
 * �����ӽ������
 * @private
 * @param
 * 		null
 * @return
 * 		������XML�ĵ�
 */
XMLTree.prototype._createChildDivDoc = function()
{
	return this._createDoc(false);
}

/**
 * ����������XML�ĵ�
 * @private
 * @param
 * 		isAddMenuItem-�Ƿ�Ҫ���item�ڵ�
 * 		addId-�½��ڵ��IDֵ
 * 		addText-�½��ڵ������(��ѡ)
 * 		addAttNames-�����������(��ѡ)
 * 		addAttValues-������Ե�ֵ(��ѡ)
 * @return
 * 		������XML�ĵ�
 */
XMLTree.prototype._createDoc = function(isAddMenuItem,addId,addText,addAttNames,addAttValues)
{
    var addDoc = new ActiveXObject("Microsoft.XMLDOM");
    var root = addDoc.createElement('root');
    addDoc.appendChild(root);
    var error_code = addDoc.createElement('error_code');
    error_code.text = 0;
    root.appendChild(error_code);
    var menu = addDoc.createElement('Menu');
    root.appendChild(menu);
    if(isAddMenuItem)
    {
	    var menuItem = addDoc.createElement('MenuItem');
	    menu.appendChild(menuItem);
	    menuItem.setAttribute('id',addId);
	    menuItem.setAttribute('label',addText);
	    if (!isNull(addAttNames))
	    {
	        for (var i=0;i<addAttNames.length;i++)
	        {
	            menuItem.setAttribute(addAttNames[i],addAttValues[i]);
	        }
	    }
    }
    return addDoc;	
}

/**
 * �ж�ָ���ڵ��ǲ������һ���ڵ�
 * @param
 * 		oItem-ָ���ڵ�
 * @return
 * 		�Ƿ������һ���ڵ�
 */
XMLTree.prototype._isLastItem = function(oItem)
{
	return (getElement(oItem,'div').isLast == 'true');
}

/**
 * �ж�ָ���ڵ��ǲ��ǵ�һ���ڵ�
 * @param
 * 		oItem-ָ���ڵ�
 * @return
 * 		�Ƿ��ǵ�һ���ڵ�
 */
XMLTree.prototype._isTopItem = function(oItem)
{
	var oItemDiv = getElement(oItem,'div');
	var oItemImg = oItemDiv.firstChild;
	return (oItemImg.lineType == 'topLine');
}
 
 /**
  * ��������˵��:ɾ������һ���ڵ�(�ڲ��ű�ɾ��,��ӿ��޹�)
  *
  * ����˵��: oItem --- ��Ҫɾ���Ľڵ�
  *
  * ����ֵ: ��
  **/
 XMLTree.prototype.delItem = function(oItem,isFireClick)
 {
    var oItemDiv = getElement(oItem,'div');
    var oItemAllDiv = oItemDiv.parentElement;
    var oParentItemAllDiv = oItemAllDiv.parentElement;
    var isLast = this._isLastItem(oItemDiv);
    var isTop = this._isTopItem(oItemDiv);
    var oPrevItemDiv;
    var oNextItemDiv;
    if(isLast)
    {
    	if (oParentItemAllDiv.childNodes.length > 1)
    	{
    		oPrevItemDiv = oItemAllDiv.previousSibling.firstChild;
    	}
    }
    else
    {
    	oNextItemDiv = oItemAllDiv.nextSibling.firstChild;
    }
    this._delTreeDocByItem(oItem);
    oItemAllDiv.removeNode(true);
    this._afterDelItem(isLast,isTop,oParentItemAllDiv,oPrevItemDiv,oNextItemDiv,isFireClick);
 }

/**
 * ɾ��֮����
 * @private
 * @param
 * 		isLast-ɾ���ڵ��Ƿ������һ���ڵ�
 * 		isTop-ɾ���ڵ��Ƿ��ǵ�һ���ڵ�
 * 		oParentItemAllDiv-ɾ���ڵ����ڵ�����
 * 		oPrevItemDiv-ɾ���ڵ����һ���ڵ�
 * 		oNextItemDiv-ɾ���ڵ����һ���ڵ�
 * 		isFireClick-ɾ�����Ƿ񵥻���Ӧ�ڵ�
 * @return
 * 		null
 */
XMLTree.prototype._afterDelItem = function(isLast,isTop,oParentItemAllDiv,oPrevItemDiv,oNextItemDiv,isFireClick)
{
	if(isNull(isFireClick))
    {
    	isFireClick = true;
    }
	//Ҫɾ���Ľڵ������һ���ڵ�
	if(isLast)
	{
		//ɾ���ڵ�����ڵļ����Ѿ�Ϊ����
		if(oParentItemAllDiv.childNodes.length==0)
		{
			//Ҫɾ���Ľڵ㲻Ϊ��һ��ڵ�,ɾ�����ڽڵ�ļ���,���ĸ��ڵ��״̬
            if (oParentItemAllDiv != this._showAtElement)
            {
                var oParentItemChildrenDiv = getElement(oParentItemAllDiv,'div');
                var oParentItemDiv = oParentItemChildrenDiv.previousSibling;
                oParentItemDiv.type = 'singleNode';
                var oParentItem = oParentItemDiv.lastChild;
                var oParentItemImg = oParentItemDiv.firstChild;
                this._changeImgSrc(oParentItemImg,2);
				oParentItemChildrenDiv.removeNode(true);
                
                if(isFireClick)
                {
                	this._click(oParentItem);
                }
            }
		}
		//Ҫɾ���ڵ����ڵļ��ϲ�ֹһ���ڵ�,ɾ���ýڵ㲢�޸���һ���ڵ��״̬
        else
        {
            var oPrevItemImg = oPrevItemDiv.firstChild;
            oPrevItemDiv.isLast = 'true';
            if (oPrevItemImg.lineType == 'topLine')
            {
                this._setRoot(oPrevItemDiv);
            }
            else
            {
                if (oPrevItemDiv.type == 'parentNode')
                {
                    this._setHasLine(oPrevItemDiv,false);
                }
                
                this._changeImgState(oPrevItemImg,'bottomLine');
            }

            if(isFireClick)
            {
	            var oClickedItem;
	            //Ҫɾ���Ľڵ�Ϊ��һ��ڵ�ʱ��,���޸��ڵ�
	            if (oParentItemAllDiv == this._showAtElement)
	            {
	                oClickedItem = oParentItemAllDiv.firstChild.firstChild.lastChild;
	            }
	            else
	            {
	                oClickedItem = getElement(oParentItemAllDiv,'div').previousSibling.lastChild;
	            }
            	this._click(oClickedItem);
            }
        }
	}
	//Ҫɾ���Ľڵ㲻�����һ���ڵ�
	else
	{
		var oNextItem = oNextItemDiv.lastChild;
        if (isTop)
        {
            var oNextItemImg = oNextItemDiv.firstChild;
            if (oNextItemDiv.isLast =='true')
            {
                this._setRoot(oNextItemDiv);
            }
            else
            {
                this._changeImgState(oNextItemImg,'topLine');
            }
        }
        if(isFireClick)
        {
        	this._click(oNextItem);
        }
	}
}

/**
 * ��������˵��:���ýڵ�Ϊ���ڵ�
 *
 * ����˵��: ��Ҫ���õĽڵ�
 *
 * ����ֵ: ��
 **/
XMLTree.prototype._setRoot = function(oItemDiv)
{
    oItemDiv.firstChild.style.display = 'none';
    oItemDiv.isOnlyNode = 'true';
    if (oItemDiv.type == 'parentNode')
    {
        oItemDiv.nextSibling.firstChild.rows[0].cells[0].style.display = 'none';
    }
}

/**
 * �������ʱXSL������
 * @param
 * 		isInit-�Ƿ��ǳ�ʼ��,���������Ƿ�Ҫ���������
 * @return
 * 		null
 */
XMLTree.prototype._setAddItemXSL = function (transformType,oItemDiv)
{
	this._setXslAttribute('transformType',transformType);
    this._setXslAttribute('isShowLineInOnlyNode',true);
    this._setXslAttribute('showDepth',this.dynamicLoadShowDepth);
    this._setXslAttribute('isParentLast',this._isLastItem(oItemDiv));
    this._setXslAttribute('isParentOnlyNode',(oItemDiv.isOnlyNode=='true'));
}

/**
 * ��������˵��: ���ӽڵ������һ���ڵ�
 *
 * ����˵��:
 *      transformType --- ����ķ�ʽ 
 * 		loadDoc --- ��Ҫ������һ���ڵ��XML����(����)
 *      oItemDiv --- ��������ӽ�����()����
 *
 * ����ֵ: ��
 **/
XMLTree.prototype._beforeAddChildToSingleNode = function(transformType,loadDoc,oItemDiv)
{
	var oImg = oItemDiv.firstChild;
    var isLoad = false;
    if(!isNull(loadDoc))
    {
        this._setAddItemXSL(transformType,oItemDiv);
        var outHTML = loadDoc.transformNode(this._xslDoc);
        if(outHTML!="")
        {
        	oItemDiv.insertAdjacentHTML('afterEnd',outHTML);
        	isLoad = true;
        }
    }
    //�н������
    if(isLoad)
    {
        oItemDiv.type = 'parentNode';
        this._changeImgSrc(oImg,0);
    }
    //�޽������
    else
    {
        oItemDiv.type = 'singleNode';
        this._changeImgSrc(oImg,2);
    }
}

/**
 * ��������˵��: ���ӽڵ������һ���ڵ�
 *
 * ����˵��:
 *       loadDoc --- ��Ҫ������һ���ڵ��XML����(����)
 *       oItemDiv --- ��������ӽ�����()����
 *
 * ����ֵ: ��
 **/
XMLTree.prototype._addChildToSingleNode = function(loadDoc,oItemDiv)
{
    this._beforeAddChildToSingleNode(TRANSFORMTYPE_DYNAMICLOAD,loadDoc,oItemDiv);
}

/**
 * �����ڵ�����ӽڵ�ǰ�Ĵ���
 * @private
 * @param
 * 		oItemDiv-����ӵĸ��ڵ�
 * @return
 * 		Ҫ�������Ķ���
 */
XMLTree.prototype._beforeAddChildToParentNode = function(oItemDiv)
{
	var oChildTD = oItemDiv.nextSibling.firstChild.rows[0].cells[1];
	if(oChildTD.childNodes.length>0)
	{
	    var lastDiv = oChildTD.lastChild.firstChild;
	    lastDiv.isLast = 'false';
	    if (lastDiv.type == 'parentNode')
	    {
	        this._setHasLine(lastDiv,true);
	    }
	    var lastItemImg = lastDiv.firstChild;
	    this._changeImgState(lastItemImg,'otherLine');
	}
    return oChildTD;
}

XMLTree.prototype._beforeAddChildToTop = function()
{
	var oChildTD = this._showAtElement;
	if(oChildTD.childNodes.length>0)
	{
	    var lastDiv = oChildTD.lastChild.firstChild;
	    lastDiv.isLast = 'false';
	    if (lastDiv.type == 'parentNode')
	    {
	        this._setHasLine(lastDiv,true);
	    }
	    var lastItemImg = lastDiv.firstChild;
	    this._changeImgState(lastItemImg,'otherLine');
	}
    return oChildTD;
}

/**
 * ��������˵��: �����ڵ������һ���ڵ�
 *
 * ����˵��:
 *       loadDoc --- ��Ҫ������һ���ڵ��XML����(����)
 *       oItemDiv --- ��������ӽ�����()����
 *
 * ����ֵ: ��
 **/
XMLTree.prototype._addChildToParentNode = function(loadDoc,oItemDiv)
{
    var oImg = oItemDiv.firstChild;
    this._setAddItemXSL(TRANSFORMTYPE_INIT,oItemDiv);
	var oChildTD = this._beforeAddChildToParentNode(oItemDiv);
    oChildTD.insertAdjacentHTML('beforeEnd',loadDoc.transformNode(this._xslDoc));
}

/**
 * ��������˵��:��Ϊ���ߵĸı��޸���Ӧ��ͼƬ
 *
 * ����˵��:
 *       oItemImg --- ��Ҫ�޸ĵ����߶���
 *       state --- ����Ŀǰ��״̬
 *
 * ����ֵ: ��
 **/
XMLTree.prototype._changeImgState = function(oItemImg,state)
{
    oItemImg.src = this.linePath+eval('this.'+state+'[oItemImg.imgType]');
    oItemImg.lineType = state;
    for(var i=0;i<eval('this.'+state+'.length');i++)
    {
        eval('oItemImg.src'+i+'=this.linePath+this.'+state+'['+i+']');
    }
}

/**
 * ��������˵��:�޸����ߵ�ͼƬ
 *
 * ����˵��:
 *       oItemImg --- ��Ҫ�޸ĵ����߶���
 *       state --- ����Ŀǰ��״̬
 *
 * ����ֵ:
 **/
XMLTree.prototype._changeImgSrc = function(oItemImg,state)
{
    oItemImg.src = eval('oItemImg.src'+state);
    oItemImg.imgType = state;
}

/**
 * ��������˵��:�����Ƿ���ʾ�ӳ���
 *
 * ����˵��:
 *       oItem --- ��Ҫ�޸ĵĽڵ�
 *       isHas --- �Ƿ���ʾ
 *
 * ����ֵ: ��
 **/
XMLTree.prototype._setHasLine = function(oItem,isHas)
{
    oItem.nextSibling.firstChild.rows[0].cells[0].background = (isHas)?this.linePath + this.backgroundLine:'';
}

/**
 * ��������˵��:�޸�ѡ������ֵ���֮��ִ��(ִ��˳�����û��ӿ�֮��)
 *
 * ����˵��: oInput --- �޸Ŀ����(����)
 *
 * ����ֵ: ��
 **/
XMLTree.prototype._afterItemEdit = function(oInput)
{
    var oItem = oInput.previousSibling;
    //�������û���޸ĵĻ� ���ύ;
    if (oItem.innerText != oInput.value)
    {
        if(!isAction(this.editAction,XMLTree_onEditItem_Action) || this.editAction.edit(oItem,oInput.value))
        {
            oItem.innerText = oInput.value;
        }
    }
    oInput.removeNode(true);
    oItem.style.display = '';
}

/**
 * ��������˵��:��ʾ�ȴ�����
 *
 * ����˵��: ��
 *
 * ����ֵ: ��
 **/
XMLTree.prototype._showWait = function()
{
    if(this.isWait)
    {
        var waitDiv = document.createElement('div');
        waitDiv.style.position = 'absolute';
        waitDiv.style.zIndex = 99;
        waitDiv.innerHTML = '<img src='+this.icoPath +this.waitIco+' align="absmiddle"/>'
                          + '<span style="font:normal normal normal 9pt normal ����;vertical-align:bottom;margin-left:5px">'+this.waitText+'</span>';
        this._showAtElement.appendChild(waitDiv);
        waitDiv.style.left=(this._showAtElement.offsetWidth - waitDiv.offsetWidth)/2;
        waitDiv.style.top=(this._showAtElement.offsetHeight - waitDiv.offsetHeight)/2;
    }
}

XMLTree.prototype._isSuccess = function (xmlhttp)
{
	var xmlTreeMsg;
	if(xmlhttp.status == 200)
	{
		xmlTreeMsg = this._isSuccessXMLObj(xmlhttp.responseXML);
    }
    else
    {
        xmlTreeMsg = getXmlTreeJSLan('otherErrorMsg') + xmlhttp.status+"]";
    }
    return xmlTreeMsg
}

XMLTree.prototype._isSuccessXMLObj = function (xmlObj)
{
	var errElement = xmlObj.selectSingleNode("/root/error_code");
    if(errElement)
    {
        if(errElement.text == 0)
            xmlTreeMsg = "OK";
        else
            xmlTreeMsg = errElement.nextSibling.text;
    }
    else
    {
        xmlTreeMsg = getXmlTreeJSLan('xmlFormatErrorMsg');
    }
    return xmlTreeMsg;
}

XMLTree.prototype._click = function(oItem,fireType)
{
    var eventObj = document.createEventObject();
    eventObj.fireType = (isNull(fireType))?"from_other":fireType;
    oItem.fireEvent("onclick",eventObj);
}

/**
 * ����popup���϶�����
 * @private
 * @param
 * 		null
 * @return
 * 		null
 */
XMLTree.prototype._createDragPopup = function()
{
	if(isNull(_dragPopup))
	{
		_dragPopup = window.createPopup();
		with(_dragPopup.document.body.style)
		{
			filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=50)';
			border = '1px solid Silver';
			paddingLeft = DRAGBODY_LEFT+'px';
		}
	}
}

/**
 * ����div���϶�����
 * @private
 * @param
 * 		null
 * @return
 */
XMLTree.prototype._createDragDiv = function()
{
	if(isNull(_dragDiv))
	{
		_dragDiv = document.createElement("DIV");
		document.body.appendChild(_dragDiv);
		with(_dragDiv.style)
		{
			position = 'absolute';
			zIndex = 99;
			display = 'none';
			paddingLeft = DRAGBODY_LEFT+'px';
			filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=50)';
		}
	}
}

/*========����Ϊͨ�õ��¼�����========*/

function isNull(value)
{
    return (typeof value == "undefined" || value==null);
}

function isAction (action,type)
{
    return (!isNull(action) && action.constructor == type);
}

function getXMLTreeObj(oTree)
{
    return oTree.XMLTreeObj;
}

function parentNodeClick(oTree)
{
    getXMLTreeObj(oTree).onParentNodeClick();
}

function itemOver(oTree)
{
    getXMLTreeObj(oTree).onItemOver();
}

function itemOut(oTree)
{
    getXMLTreeObj(oTree).onItemOut();
}

function itemClick(oTree)
{
    getXMLTreeObj(oTree).onItemClick();
}

function itemDblClick(oTree)
{
	getXMLTreeObj(oTree).onItemDblClick();
}

function startDrag(oTree)
{
	getXMLTreeObj(oTree).startDrag();
}

function drag(oTree)
{
	getXMLTreeObj(oTree).drag();
}

function endDragEvent(oTree)
{
	getXMLTreeObj(oTree).endDragEvent();
}

function rightClickEvent(oTree)
{
	getXMLTreeObj(oTree).rightClickEvent();
}

function checkBoxClickEvent(oTree)
{
	getXMLTreeObj(oTree).itmeCheckEvent();
}

function KeyboardInEdit()
{
    if(event.keyCode==27||event.keyCode==13)
    {
        event.srcElement.detachEvent('onblur',_afterItemEdit);
        _afterItemEdit();
    }
}

function _afterItemEdit()
{
    getXMLTreeObj(event.srcElement)._afterItemEdit(event.srcElement);
}

function atuoScrollTreeByY(oTree,step,iX,iY)
{
	getXMLTreeObj(oTree)._scrollTreeByY(step,iX,iY);
}

function atuoScrollTreeByX(oTree,step,iX,iY)
{
	getXMLTreeObj(oTree)._scrollTreeByX(step,iX,iY);
}

function _cancel()
{
	return false;
}
