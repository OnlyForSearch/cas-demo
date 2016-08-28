/* =========================================================================

NAME:树形菜单的实现类

AUTHOR:方旭尘
DATE:2006-2-26

COMMENT: 实现树形菜单类,提供接口的功能

============================================================================ */
//定义默认语言资源
var xmlTreeJSDefaultLang = {
	waitText : '请稍候......',
	addNode : '新建节点',
	xmlFormatErrorMsg : 'xml文档格式错误!',
	otherErrorMsg : '后台程序出现异常![错误代码:'
};
//获取语言资源
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
/*========以下是一些常量========*/
//本文件名字
var JS_NAME = 'XMLTree.js';
//等待展开的时间
var WAIT_EXPAND = 50;
//选中项的颜色
var SELECTED_BACKGROUND = '#808080';
//选中项的边框
var SELECTED_BORDER = '1px solid #3F3F3F';
//选中项的字体颜色
var SELECTED_COLOR = 'white';
//修改时的边框
var EDIT_BORDER = '1px solid #808080';
//失去焦点的单击选中对象的边框样式
var UNFORCE_CLICKEDITEM_BORDER = '1px dashed black';
//拖动popup的左边距
var DRAGBODY_LEFT = 2;
//开始滚动的范围
var SCROLL_RANGE = 36;
var SCROLL_STEP = 20;
var SCROLL_TIME = 200;
//xsl转化开始的入口
var TRANSFORMTYPE_INIT = 1;
var TRANSFORMTYPE_DYNAMICLOAD = 2;
var TRANSFORMTYPE_ADDCHILDRENDIV = 3;

var FIND_FILE_PATH_REG = new RegExp("^.*/");
/*========以下是静态变量========*/
var _dragPopup;
var _dragDiv;

/*========树类的声明========*/
function XMLTree()
{
    //树xml所在的路径
    this.xmlUrl;
    //树的XML对象
    this.xmlObj;
    //xsl所在的路径
    this.xslPath = getRealPath('../../xsl/XMLTree.xsl',JS_NAME);
    //是否显示等待页面
    this.isWait = true;
    //每次动态载入后显示几层
    this.dynamicLoadShowDepth = 1;
    //新建的时候默认的节点名
    this.addText = getXmlTreeJSLan('addNode');
    //右键菜单对象
    this.rightMenu;
	//单击选中菜单后是否打开子菜单
    this.isOpenChildAtferClick = false;
    //右键是否激活单击事件
    this.isRightFireOnClick = true;
    //是否拖动菜单项目(在页面间拖动)
    this.isDragOnPage = false;
    this.isDragOnPageBySelf = false;
    //是否拖动菜单项目(在树间拖动)
    this.isDragOnTree = false;
    this.isDragOnTreeBySelf = true;
    //是否单击选择对象
    this.isSelectedClick = false;
    this.isReadOnly = false;
    //每次是否同步更新DOC对象
    this.isSyncDoc = false;
    this.waitIco = 'spinner.gif';
    this.errorIco = this.icoPath + 'error.gif';
    this.waitText = getXmlTreeJSLan('waitText');

	//选中项的颜色
	this.selectedBackground = SELECTED_BACKGROUND;
	//选中项的边框
	this.selectedBorder = SELECTED_BORDER;
    
    /*========以下几项为xsl中的属性配置,如果为空,则说明采用xsl中的默认配置的值========*/
    //树形显示几层(缺省值见xsl中的配置)
    this.showDepth;
    //是否动态载入菜单
    this.isDynamicLoad;
    //树形图标所在路径
    this.icoPath = getRealPath('../../image/ico/',JS_NAME);
    //树形连线所在路径
    this.linePath = getRealPath('../../image/line/',JS_NAME);
    //连线的图片名称
    this.topLine = new Array('rminus.gif','rplus.gif','r.gif');
    this.bottomLine = new Array('lminus.gif','lplus.gif','l.gif');
    this.otherLine = new Array('tminus.gif','tplus.gif','t.gif');
    this.backgroundLine = 'i.gif';
    //缺省的叶节点图标
    this.defaultIco;
    //缺省的父节点图标
    this.defaultParentIco;
    //是否有子结点的属性
    this.hasChildAttName;
    //排序字段的属性名称
    this.sortAtt;
    //显示样式(默认为图标)
    this.showType;
  //显示样式(默认为图标)
    this.isShowDesc;
    //父节点收缩事件的方法名称
    this.parentNodeClickEvent;
    //节点划过事件的方法名称
    this.itemOverEvent;
    //节点划出事件的方法名称
    this.itemOutEvent;
    //节点单击事件的方法名称
    this.itemClickEvent;
    //节点双击事件的方法名称
    this.itemDblClickEvent;
    //checkbox单击事件的方法名称
    this.checkBoxClickEvent;
    
	/*========以下为各个接口对象========*/
    //初始化载入时预处理的接口
    this.pretreatmentAction;
    //动态取数据时的接口
    this.dynamicLoadAction;
    //成功动态获取后回调接口
    this.afterDynamicLoadAction;
    //单击处理的接口
    this.clickAction;
    //双击处理的接口
    this.dblclickAction;
    //编辑的接口
    this.editAction;
    //拖拽开始的接口
    this.startDragAction;
    //拖拽结束的接口
    this.endDragAction;
    //右键接口
    this.rightAction;
    //checkbox单击接口
    this.checkBoxClickAction;
    //载入完成接口
    this.loadAction;
    
	/*========以下为运行时保存的一些变量========*/
    this._xslDoc = new ActiveXObject("Microsoft.XMLDOM");
    this._treeDoc = new ActiveXObject("Microsoft.XMLDOM");
    this._treeDoc.setProperty("SelectionLanguage", "XPath");
    //树的根节点
    this._treeRoot;
    //在那个节点下显示树
    this._showAtElement;
    //单击选择中的对象
    this._oSelectedItem;
    //右键单击时候保存前选中的对象
    this._oClickedItem;
    //拖拽的对象
    this._DragItem;
    this._DragItemDiv;
    this._DragParentItem;
    //拖拽划过的对象
    this._oOverItem;
    //是否开始拖动
    this._isFireDrag = false;
    //添加节点时用的临时变量
    this._addParentItem;
    this._addId;
    this._addText;
    this._addAttNames;
    this._addAttValues;
    this._isClick;
    this._isEdit;
    //显示区域的定位
    this._showAtElementTop;
    this._showAtElementBottom;
   	this._showAtElementLeft;
   	this._showAtElementRight;
   	//滚动树的函数ID
   	this.autoScrollTreeByYFunId;
   	this.autoScrollTreeByXFunId;
   	//寻找节点的路径
   	this.itemPath;
}

/*========以下为public方法========*/

/**
 * 设定树的显示区域
 * @param 
 * 		oElement-指定显示的区域
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
    //设置XSL属性
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

    //获取树的数据
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
    //树的根节点
    this._treeRoot = null;
    //单击选择中的对象
    this._oSelectedItem = null;
    //右键单击时候保存前选中的对象
    this._oClickedItem = null;
    //拖拽的对象
    this._DragItem = null;
    this._DragItemDiv = null;
    this._DragParentItem = null;
    //拖拽划过的对象
    this._oOverItem = null;
    //是否开始拖动
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
 * 动态载入指定节点的下级节点
 * @param
 * 		oItem-指定节点对象
 * 		fireType-载入事件类型
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
 * 获取选中对象
 * @param
 * 		null
 * @return
 * 		选中的对象
 */
XMLTree.prototype.getSelectedItem = function()
{
	return this._oSelectedItem;
}

/**
 * 设置预处理的接口
 * @param
 * 		oAction-预处理的接口对象
 * @return
 * 		null
 */
XMLTree.prototype.setPretreatmentAction = function(oAction)
{
	this.pretreatmentAction = oAction;
}

/**
 * 返回预处理的接口
 * @param
 * 		null
 * @return
 * 		预处理的接口
 */
XMLTree.prototype.getPretreatmentAction = function()
{
	return this.pretreatmentAction;
}

/**
 * 设置动态载入的接口
 * @param
 * 		oAction-动态载入的接口对象
 * @return 
 * 		null
 */
XMLTree.prototype.setDynamicLoadAction = function(oAction)
{
	this.dynamicLoadAction = oAction;
}

/**
 * 返回动态载入的接口
 * @param 
 * 		null
 * @return 
 * 		动态载入的接口对象
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
 * 设置单击事件接口
 * @param 
 * 		oAction-单击事件接口对象
 * @return 
 * 		null
 */
XMLTree.prototype.setClickAction = function(oAction)
{
	this.clickAction = oAction;
}

/**
 * 返回单击事件接口
 * @param
 * 		null
 * @return 
 * 		单击事件接口对象
 */
XMLTree.prototype.getClickAction = function()
{
	return this.clickAction;
}

/**
 * 设置双击事件的接口
 * @param 
 * 		oAction-双击事件的接口对象
 * @return 
 * 		null
 */
XMLTree.prototype.setDblClickAction = function(oAction)
{
	this.dblclickAction = oAction;
}

/**
 * 设置编辑事件的接口
 * @param 
 * 		oAction-编辑事件的接口对象
 * @return 
 * 		null
 */
XMLTree.prototype.setEditAction = function(oAction)
{
	this.editAction = oAction;
}

/**
 * 返回编辑事件的接口
 * @param
 * 		null
 * @return
 * 		编辑事件的接口对象
 */
XMLTree.prototype.getEditAction = function()
{
	return this.editAction;
}

/**
 * 设置拖拽开始事件的接口
 * @param 
 * 		oAction-拖拽开始事件的接口对象
 * @return 
 * 		null
 */
XMLTree.prototype.setStartDragAction = function(oAction)
{
	this.startDragAction = oAction;
}

/**
 * 返回拖拽开始事件的接口
 * @param 
 * 		null
 * @return 
 * 		拖拽开始事件的接口对象
 */
XMLTree.prototype.getStartDragAction = function()
{
	return this.startDragAction;
}

/**
 * 设置拖拽结束事件的接口
 * @param 
 * 		oAction-拖拽结束事件的接口对象
 * @return
 * 		null
 */
XMLTree.prototype.setEndDragAction = function(oAction)
{
	this.endDragAction = oAction;
}

/**
 * 返回拖拽结束事件的接口
 * @param
 * 		null
 * @return
 * 		拖拽结束事件的接口对象
 */
XMLTree.prototype.getEndDragAction = function()
{
	return this.endDragAction;
}

/**
 * 设置右键事件的接口
 * @param
 * 		oAction-右键事件的接口对象
 * @return
 * 		null
 */
XMLTree.prototype.setRightAction = function(oAction)
{
	this.rightAction = oAction;
}

/**
 * 返回右键事件的接口
 * @param
 * 		null
 * @return
 * 		右键事件的接口对象
 */
XMLTree.prototype.getRightAction = function()
{
	return this.rightAction;
}

/**
 * 设置选中事件的接口
 * @param
 * 		oAction-选中事件的接口
 * @return
 * 		null
 */
XMLTree.prototype.setCheckBoxClickAction = function(oAction)
{
	this.checkBoxClickAction = oAction;
}

/**
 * 返回选中事件的接口
 * @param
 * 		null
 * @return
 * 		选中事件的接口
 */
XMLTree.prototype.getCheckBoxClickAction = function()
{
	return this.checkBoxClickAction;
}

/**
 * 设置载入完成事件接口
 * @param
 * 		oAction-载入完成事件接口对象
 * @return
 * 		null
 */
XMLTree.prototype.setLoadAction = function(oAction)
{
	this.loadAction = oAction;
}

/**
 * 返回载入完成事件接口
 * @param
 * 		null
 * @return
 * 		载入完成事件接口对象
 */
XMLTree.prototype.getLoadAction = function()
{
	return this.loadAction;
}

/**
 * 设置右键对象
 * @param
 * 		oRightMenu-右键对象
 * @return
 * 		null
 */
XMLTree.prototype.setRightMenu = function(oRightMenu)
{
	this.rightMenu = oRightMenu;
}

/**
 * 返回父节点
 * @param
 * 		isFireAction:选中父节点后,是否激发单击事件
 *  	attName:用于过滤父节点的属性名称
 * 		attVal:匹配上面指定属性的值
 * @return
 * 		选中的父节点
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
 * 跳转到指定节点
 * @param
 * 		index-指定节点的ID
 * 		isFireAction-跳转后是否激发单击事件
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
 * 为树增加一个新的节点
 * @param
 * 		addId-新建节点的ID值(必须)
 * 		addText-新建节点的名称(缺省为类中默认指定的)
 * 		addAttNames-添加属性名称(可空)
 * 		addAttValues-添加属性的值(可空)
 * 		isClick-添加后是否单击(缺省为单击)
 * 		isEdit-添加后是否编辑(缺省为不编辑)
 * 		oAddItem-指定节点下添加(缺省为当前选中节点)
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
 * 删除当前选择的节点
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
 * 修改当前节点的属性
 * @param
 * 		attName:属性名称
 * 		attValue:属性值
 * 		oItem:修改的节点(默认为当前选中的节点)
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
 * 修改当前节点的显示的值
 * @param
 * 		attName:属性名称
 * 		attValue:属性值
 * 		oItem:修改的节点(默认为当前选中的节点)
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
 * 修改选中节点的值
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
 * 折叠指定节点
 * @param 
 * 		oItemDiv-指定节点对象
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
 * 展开指定节点
 * @param
 * 		oItemDiv-指定节点对象
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
 * 还原原先的单击对象
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
 * 释放右键单击事件
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
 * 上下移动选择的项
 * @param {} direction 移动标记up down
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

/*========以下为private方法========*/

/**
 * 修改指定节点的颜色
 * @private
 * @param
 * 		oItem-指定节点
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
 * 设置失去焦点的单击选中对象样式
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
 * 判断指定节点是否是顶极节点
 * @private
 * @param
 * 		oItem-指定节点
 * @return
 * 		null
 */
XMLTree.prototype._isTop = function(oItem)
{
	return (getElement(oItem,'div',1).parentElement==this._showAtElement);
}

/**
 * 展开指定节点的上级节点
 * @private
 * @param
 * 		oItem-指定节点对象
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
 * 得到指定子节点的父节点
 * @private
 * @param
 * 		oItem-指定节点
 * @return
 * 		父节点
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
 * 父节点的收缩事件的处理
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
    //已经载入的
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
    //动态载入时执行
    else if(oItemDiv.type == 'dynamicLoadNode')
    {
        this.dynamicLoadTree(oImg.nextSibling.nextSibling,event.fireType);
    }
}

/**
 * 鼠标划过每个项目时候的事件处理
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
 * 鼠标划出每个项目时候的事件处理
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
 * 鼠标单击时的事件处理
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
 * 树双击时执行的事件
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
 * 树节点右键事件处理
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
 * checkBox选中事件的处理
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
 * 更改指定对象的checkbox
 * @private
 * @param
 * 		oItemDiv-指定的节点对象
 * 		isChecked-需要更改的状态
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
 * 拖拽开始时激发该事件
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
 * 具体拖拽的实现
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
 * 在页面间拖动时候执行(通过popup实现)
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
 * 在树间拖动时候执行(通过div实现)
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
 * 拖拽结束时执行
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
 * 获得根节点
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
 * 通过给类的属性指定值添加新节点
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
 * 在指定节点处添加父节点
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
		 * 有待修改完善的
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
 * 添加的具体底层操作
 * @private
 * @param
 * 		oItem-被添加的节点
 * 		addId-新建节点的ID值
 * 		addText-新建节点的名称
 * 		addAttNames-添加属性名称(可选)
 * 		addAttValues-添加属性的值(可选)
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
 * 判断指定节点是关闭还是张开
 * @private
 * @param
 * 		oItem-指定节点对象
 * @return
 * 		展开-false
 * 		关闭-true
 */
XMLTree.prototype._isClosed = function(oItem)
{
	var oItemDiv = getElement(oItem,'div');
	return (oItemDiv.firstChild.imgType == 1);
}

/**
 * 函数功能说明:设置xsl属性
 *
 * 参数说明:
 *       name --- 属性名(必须)
 *       value --- 属性的值(必须)
 *
 * 返回值:
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
 * 函数功能说明:批量设置XSL属性
 *
 * 参数说明:属性名的规则
 *
 * 返回值:无
 **/
XMLTree.prototype._setXslAttributeArray = function(name)
{
    for(var i=0;i<eval("this." + name + ".length");i++)
    {
        this._setXslAttribute(name+i,eval("this." + name+"["+i+"]"));
    }
}

/**
 * 函数功能说明:初始化树
 *
 * 参数说明:url --- xml所在的地址(必须) 
 *
 * 返回值:无
 **/
XMLTree.prototype._iniTreeXML = function(url)
{
	this._setTreeXML(url,0);
}

/**
 * 函数功能说明:动态载入树
 *
 * 参数说明:url --- xml所在的地址(必须) 
 *
 * 返回值:无
 **/
XMLTree.prototype._dynamicLoadXML = function(url,oItemDiv,oWaitItem,fireType)
{
	this._setTreeXML(url,1,oItemDiv,oWaitItem,fireType);
}

/**
 * 函数功能说明:获取树的xml数据
 *
 * 参数说明:
 *    url --- xml所在的地址(必须)
 *    action --- 状态 0表示初始化 1表示动态加载     
 *
 * 返回值:无
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
 * 载入XML对象节点
 * @private
 * @param
 * 		xmlObj-树的XML对象
 * 		oElement-树的显示节点
 * 		xmlTreeMsg-如果处理错误,错误信息
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
 * 拖动后移动节点
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
 * 清除自动滚动
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
 * 清除Y坐标上的自动滚动
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
 * 清除X坐标上的自动滚动
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
 * 滚动树(Y轴)
 * @param
 * 		step 每次滚动的步长
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
 * 滚动树(X轴)
 * @param
 * 		step 每次滚动的步长
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
 * 函数功能说明: 创建新增节点的XML对象
 *
 * 参数说明:
 *       addId --- 新建节点的ID值(必须)
 *       addText --- 新建节点的名称(可选)
 *       addAttNames --- 添加属性名称(可选)
 *       addAttValues --- 添加属性的值(可选)
 *
 * 返回值: 创建的XML文档
 **/
XMLTree.prototype._createAddDoc = function(addId,addText,addAttNames,addAttValues)
{
	return this._createDoc(true,addId,addText,addAttNames,addAttValues);
}
 
/**
 * 创建子结点区域
 * @private
 * @param
 * 		null
 * @return
 * 		创建的XML文档
 */
XMLTree.prototype._createChildDivDoc = function()
{
	return this._createDoc(false);
}

/**
 * 创建新增的XML文档
 * @private
 * @param
 * 		isAddMenuItem-是否要添加item节点
 * 		addId-新建节点的ID值
 * 		addText-新建节点的名称(可选)
 * 		addAttNames-添加属性名称(可选)
 * 		addAttValues-添加属性的值(可选)
 * @return
 * 		创建的XML文档
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
 * 判断指定节点是不是最后一个节点
 * @param
 * 		oItem-指定节点
 * @return
 * 		是否是最后一个节点
 */
XMLTree.prototype._isLastItem = function(oItem)
{
	return (getElement(oItem,'div').isLast == 'true');
}

/**
 * 判断指定节点是不是第一个节点
 * @param
 * 		oItem-指定节点
 * @return
 * 		是否是第一个节点
 */
XMLTree.prototype._isTopItem = function(oItem)
{
	var oItemDiv = getElement(oItem,'div');
	var oItemImg = oItemDiv.firstChild;
	return (oItemImg.lineType == 'topLine');
}
 
 /**
  * 函数功能说明:删除树的一个节点(内部脚本删除,与接口无关)
  *
  * 参数说明: oItem --- 需要删除的节点
  *
  * 返回值: 无
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
 * 删除之后处理
 * @private
 * @param
 * 		isLast-删除节点是否是最后一个节点
 * 		isTop-删除节点是否是第一个节点
 * 		oParentItemAllDiv-删除节点所在的区域
 * 		oPrevItemDiv-删除节点的上一个节点
 * 		oNextItemDiv-删除节点的下一个节点
 * 		isFireClick-删除后是否单击相应节点
 * @return
 * 		null
 */
XMLTree.prototype._afterDelItem = function(isLast,isTop,oParentItemAllDiv,oPrevItemDiv,oNextItemDiv,isFireClick)
{
	if(isNull(isFireClick))
    {
    	isFireClick = true;
    }
	//要删除的节点是最后一个节点
	if(isLast)
	{
		//删除节点后所在的集合已经为空了
		if(oParentItemAllDiv.childNodes.length==0)
		{
			//要删除的节点不为第一层节点,删除所在节点的集合,更改父节点的状态
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
		//要删除节点所在的集合不止一个节点,删除该节点并修改上一个节点的状态
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
	            //要删除的节点为第一层节点时候,即无父节点
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
	//要删除的节点不是最后一个节点
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
 * 函数功能说明:设置节点为根节点
 *
 * 参数说明: 需要设置的节点
 *
 * 返回值: 无
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
 * 设置添加时XSL的内容
 * @param
 * 		isInit-是否是初始化,区别在于是否要添加子区域
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
 * 函数功能说明: 给子节点添加下一级节点
 *
 * 参数说明:
 *      transformType --- 载入的方式 
 * 		loadDoc --- 需要载入下一级节点的XML对象(必须)
 *      oItemDiv --- 被载入的子结点对象()必须
 *
 * 返回值: 无
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
    //有结果载入
    if(isLoad)
    {
        oItemDiv.type = 'parentNode';
        this._changeImgSrc(oImg,0);
    }
    //无结果载入
    else
    {
        oItemDiv.type = 'singleNode';
        this._changeImgSrc(oImg,2);
    }
}

/**
 * 函数功能说明: 给子节点添加下一级节点
 *
 * 参数说明:
 *       loadDoc --- 需要载入下一级节点的XML对象(必须)
 *       oItemDiv --- 被载入的子结点对象()必须
 *
 * 返回值: 无
 **/
XMLTree.prototype._addChildToSingleNode = function(loadDoc,oItemDiv)
{
    this._beforeAddChildToSingleNode(TRANSFORMTYPE_DYNAMICLOAD,loadDoc,oItemDiv);
}

/**
 * 给父节点添加子节点前的处理
 * @private
 * @param
 * 		oItemDiv-待添加的父节点
 * @return
 * 		要添加区域的对象
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
 * 函数功能说明: 给父节点添加下一级节点
 *
 * 参数说明:
 *       loadDoc --- 需要载入下一级节点的XML对象(必须)
 *       oItemDiv --- 被载入的子结点对象()必须
 *
 * 返回值: 无
 **/
XMLTree.prototype._addChildToParentNode = function(loadDoc,oItemDiv)
{
    var oImg = oItemDiv.firstChild;
    this._setAddItemXSL(TRANSFORMTYPE_INIT,oItemDiv);
	var oChildTD = this._beforeAddChildToParentNode(oItemDiv);
    oChildTD.insertAdjacentHTML('beforeEnd',loadDoc.transformNode(this._xslDoc));
}

/**
 * 函数功能说明:因为连线的改变修改相应的图片
 *
 * 参数说明:
 *       oItemImg --- 需要修改的连线对象
 *       state --- 连线目前的状态
 *
 * 返回值: 无
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
 * 函数功能说明:修改连线的图片
 *
 * 参数说明:
 *       oItemImg --- 需要修改的连线对象
 *       state --- 连线目前的状态
 *
 * 返回值:
 **/
XMLTree.prototype._changeImgSrc = function(oItemImg,state)
{
    oItemImg.src = eval('oItemImg.src'+state);
    oItemImg.imgType = state;
}

/**
 * 函数功能说明:设置是否显示延长线
 *
 * 参数说明:
 *       oItem --- 需要修改的节点
 *       isHas --- 是否显示
 *
 * 返回值: 无
 **/
XMLTree.prototype._setHasLine = function(oItem,isHas)
{
    oItem.nextSibling.firstChild.rows[0].cells[0].background = (isHas)?this.linePath + this.backgroundLine:'';
}

/**
 * 函数功能说明:修改选择对象的值完成之后执行(执行顺序在用户接口之后)
 *
 * 参数说明: oInput --- 修改框对象(必须)
 *
 * 返回值: 无
 **/
XMLTree.prototype._afterItemEdit = function(oInput)
{
    var oItem = oInput.previousSibling;
    //如果内容没有修改的话 不提交;
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
 * 函数功能说明:显示等待窗口
 *
 * 参数说明: 无
 *
 * 返回值: 无
 **/
XMLTree.prototype._showWait = function()
{
    if(this.isWait)
    {
        var waitDiv = document.createElement('div');
        waitDiv.style.position = 'absolute';
        waitDiv.style.zIndex = 99;
        waitDiv.innerHTML = '<img src='+this.icoPath +this.waitIco+' align="absmiddle"/>'
                          + '<span style="font:normal normal normal 9pt normal 宋体;vertical-align:bottom;margin-left:5px">'+this.waitText+'</span>';
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
 * 创建popup的拖动对象
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
 * 创建div的拖动对象
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

/*========以下为通用的事件方法========*/

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
