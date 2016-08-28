/* =========================================================================

NAME:树形菜单的接口类

AUTHOR:方旭尘
DATE:2006-3-1

COMMENT: 树形菜单的接口类,当添加树形功能时候需继承相应的接口类

============================================================================ */

//初始化时XML处理的接口
function XMLTree_onBeforeXMLTrans_Action()
{
    /**
     * 函数功能说明:在XML转化前可以修改该XML文档内容
     *
     * 参数说明: oDoc 需要修改的XML文档对象
     *
     * 返回值:处理后的XML文档对象
     **/
    this.pretreatment = function(oDoc)
    {}
}

//动态载入时取下一级数据的接口
function XMLTree_onDynamicLoad_Action()
{
    /**
     * 函数功能说明:用户执行动态载入时取得XML文档对象
     *
     * 参数说明:oItem --- 目前选中对象的节点
     *
     * 返回值:需要动态载入的XML流所在的地址
     **/
     this.dynamicLoad = function(oItem)
     {}
}

function XMLTree_AfterDynamicLoad_Action()
{
    /**
     * 函数功能说明:用户执行动态载入时取得XML文档对象
     *
     * 参数说明:oItem --- 目前选中对象的节点
     *
     * 返回值:需要动态载入的XML流所在的地址
     **/
     this.afterDynamicLoad = function()
     {}
}

//用户单击事件时处理的接口
function XMLTree_onClick_Action()
{
    /**
     * 函数功能说明:用户单击事件时处理
     *
     * 参数说明: oItem --- 目前选中节点的对象
     *
     * 返回值: 无
     **/
     this.click = function(oItem)
    {}
}

//用户双击事件时处理的接口
function XMLTree_onDblClick_Action()
{
    /**
     * 函数功能说明:用户单击事件时处理
     *
     * 参数说明: oItem --- 目前选中节点的对象
     *
     * 返回值: 无
     **/
     this.dblclick = function(oItem)
    {}
}

//用户修改树的值的处理接口
function XMLTree_onEditItem_Action()
{
    /**
     * 函数功能说明:用户修改完选择对象的值之后的处理过程
     *
     * 参数说明:
     *       oItem --- 目前选中节点的对象
     *       value --- 修改后的值
     *
     * 返回值:true(替换为修改后的值),false(保持原值不变)
     **/
     this.edit = function(oItem,value)
    {}
}

function XMLTree_onDragStart_Action()
{
	/**
     * 函数功能说明:用户拖拽节点开始时调用
     *
     * 参数说明: 当前要拖动的节点
     *
     * 返回值: ture启动拖拽 false不启动拖拽
     **/
	this.isStartDrag = function(oItem)
	{}
}

function XMLTree_onDragEnd_Action()
{
	//获取鼠标指针位置相对于父文档的 x 像素坐标
	this.iX;
	//获取鼠标指针位置相对于父文档的 y 像素坐标
	this.iY;
	//获取鼠标指针位置相对于窗口客户区域的 x 坐标，其中客户区域不包括窗口自身的控件和滚动条
	this.iClientX;
	//获取鼠标指针位置相对于窗口客户区域的 y 坐标，其中客户区域不包括窗口自身的控件和滚动条
	this.iClientY;
	/**
     * 函数功能说明:用户拖拽节点结束时调用
     *
     * 参数说明: 无
     *
     * 返回值: 是否要移动节点
     **/
	this.endDrag = function(oDragItem,oOverItem)
	{}
	
	/**
	 * 
	 */
	this.endMove = function(oDragParentItem,oDragItem,oOverItem)
	{}
}

function XMLTree_oncontextmenu_Action()
{
	/**
     * 函数功能说明:用户右键单击事件
     *
     * 参数说明: 无
     *
     * 返回值: 无
     **/
     this.rightClick = function(oItem)
     {}
}

function XMLTree_onCheckBoxClick_Action()
{
	/**
     * 函数功能说明:用户checkBox单击事件
     *
     * 参数说明: 无
     *
     * 返回值: 无
     **/
     this.check = function(oCheckBox,oItem)
     {}
}

function XMLTree_onLoad_Action()
{
	/**
     * 函数功能说明:完成树载入后执行
     *
     * 参数说明: 无
     *
     * 返回值: 无
     **/
	this.load = function()
	{}
}