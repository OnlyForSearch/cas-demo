/* =========================================================================

NAME:选择框的接口类

AUTHOR:方旭尘
DATE:2007-3-1

============================================================================ */

//初始化时XML处理的接口
function Choice_Staff_Action()
{
    this.isReplace = false;
    this.isInit = false;
    
    /**
     * 函数功能说明:初始化选择框接口
     *
     * 参数说明: 初始化的树ID
     *
     * 返回值:对应员工所在XML的路径
     **/
    this.init = function(initId)
    {}
    /**
     * 函数功能说明:在XML转化前可以修改该XML文档内容
     *
     * 参数说明: oDoc 需要修改的XML文档对象
     *
     * 返回值:无
     **/
    this.pretreatment = function(oDoc)
    {}
    
    /**
     * 函数功能说明:更改组织ID时候
     *
     * 参数说明: 选中的组织ID
     *
     * 返回值:对应员工所在XML的路径
     **/
    this.change = function(oEvent)
    {}
}