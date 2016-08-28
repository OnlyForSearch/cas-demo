
var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var alarmRuleUrl = "../../servlet/ruleServlet?";
var ne_TreeURL = "../../servlet/ne_tree?";
var ruleTypeId=null;//当前规则类型
var ruleTypeName=null;//当前规则类型名称
var ruleId=null;    //当前规则
var ruleName=null;    //当前规则名称
var currentTree;    //当前树
var currentTreeDiv; //当前树DIV
var currentDom;//当前Dom
//var currentItem; //当前项
var ruleTree=null;  //规则树
var ruleTree2=null; //规则树2
var valueList3Tree; //属性值列表3的树
var neTree;
var ruleDom = new ActiveXObject("Microsoft.XMLDOM");//规则DOM
var ruleDom2 = new ActiveXObject("Microsoft.XMLDOM");//规则DOM2
var attributeName="";//当前规则属性
var inputTypeObj = new Object();//属性类型列表
var operatorLengthObj = new Object();//关系操作符
var isValueListTreeLoaded = false;
var isUpdate = false;
var NE_TYPE = "neTypeId";//常量：网元类型
var NEID = "neId";//常量：网元
var flag=0;//0查看1新增2修改
var regionId="-1",regionName="全部区域";
var oTime1;
var lockedTreeItemId=new Array(2);
var staffId;
var isCopy;

function initPage()
{
    //1. 初始化规则类别
    //ruleType.xmlsrc = alarmRuleUrl+"tag=1";
   // if(ruleType.getLength()>0)
   // {
        //ruleType.getObject().options[0].selected=true;
        //ruleTypeId = ruleType.getObject().options[0].value;
        //2. 初始化规则列表
       // getRuleListByType();
        //3. 初始化属性节点
        //initProperty();
   // }
    //4. 初始化操作符长度限制。
    //initOperatorListLength();
    var arrayUrl=getURLSearch();
	if(arrayUrl!=null){
		flag=arrayUrl.flag;
		ruleTypeId = arrayUrl.ruleTypeId;
		ruleTypeName=arrayUrl.ruleTypeName;
		ruleId = arrayUrl.ruleId;
		ruleName=arrayUrl.ruleName;
		staffId=arrayUrl.staffId;
		isCopy=arrayUrl.isCopy;
	}
	if(flag=="0" || flag==0)
	{
		document.getElementById("editDiv").style.display="none";
	}
	getRuleListByType();
	showRuleTree();
	
}
function initOperatorListLength()
{
    operatorLengthObj.Equal=1;//有且只有一个
    operatorLengthObj.NotEqual=1;//有且只有一个
    operatorLengthObj.GreaterThan=1;//有且只有一个
    operatorLengthObj.GreaterOrEqual=1;//有且只有一个
    operatorLengthObj.LessThan=1;//有且只有一个
    operatorLengthObj.LessOrEqual=1;//有且只有一个
    operatorLengthObj.In=2;//大于等于一个
    operatorLengthObj.NotIn=2;//大于等于一个
    operatorLengthObj.Like=1;//有且只有一个
    operatorLengthObj.NotLike=1;//有且只有一个
    operatorLengthObj.BeginWith=1;//有且只有一个
    operatorLengthObj.NotBeginWith=1;//有且只有一个
    operatorLengthObj.EndWith=1;//有且只有一个
    operatorLengthObj.NotEndWith=1;//有且只有一个
}
//---------------------------------------------------------------------
//----------1。规则类型----------------------------------------------------
//---------------------------------------------------------------------
function getRuleListByType()
{
        if(ruleTypeId!=null && typeof ruleTypeId!='undefined')
        {
            if(ruleTypeId==2)
            {
                treeDiv.style.height = "268px";
                tree2Div.style.display="";
                treeDiv.className="input";
                tree2Div.className="input";
            }else
            {
                tree2Div.style.display="none";
                treeDiv.style.height = "460px";
                treeDiv.className="";
                tree2Div.className="";
            }
            //(2). 属性节点
            initProperty();
            //(3). 清空规则树和属性列表
            //clearRuleInfo();
        }
}

//---------------------------------------------------------------------
//----------2。规则列表----------------------------------------------------
//---------------------------------------------------------------------
function showRuleListMenu()//2-0. 右键菜单
{
    if(ruleId!=null && typeof ruleId!='undefined')//(1). 选中项
    {
        ruleListMenu.show();
    }else                                         //(2). 未选中项
    {
        ruleListMenu.setItemDisable("0");
        ruleListMenu.setItemDisable("2");
        ruleListMenu.setItemDisable("3");
        ruleListMenu.setItemDisable("4");
        ruleListMenu.setItemDisable("5");
        ruleListMenu.setItemDisable("6");
        ruleListMenu.show();
    }
}

function copyRule()//2-1. 复制规则
{
    if(ruleId==null || typeof ruleId=='undefined') {MMsg("对不起，您未选中任何项！");return;}
    if(ruleName.indexOf("作废")!=-1){
   		alert("规则已经作废,请先启用!");
    	return;
    }
    var params = new Object();
    var oTarget = ruleType.getObject();
    params.ruleId = ruleId;
    params.ruleTypeId = oTarget.options[oTarget.selectedIndex].value;
    params.ruleTypeName = oTarget.options[oTarget.selectedIndex].text;
    params.isCopy=true;
    params = showProperty(params);
    //getRuleListByType();

    if(typeof params!="undefined")
    {
       addOption(params);              
    }
   
}

function addRule()//2-2. 添加规则
{
    var params = new Object();
    var oTarget = ruleType.getObject();
    params.ruleId=null;
    params.ruleTypeId = oTarget.options[oTarget.selectedIndex].value;
    params.ruleTypeName = oTarget.options[oTarget.selectedIndex].text;
    params.isCopy=false;
    params = showProperty(params);
    if(typeof params!="undefined")
    {
		addOption(params);
    }
}
function addOption(params){

    oTarget = ruleList.getObject();
    var oOption=document.createElement("OPTION");
    oOption.value = params[0];
    oOption.text = params[1];
    //规则列表为空时
    if(oTarget.options.length==0){
    	oTarget.add(oOption); return;
    }
	for(var i=0;i<oTarget.options.length;i++){
		var tmp = oTarget.options[i];
		if(tmp.text.indexOf("作废")!=-1){
			oTarget.add(oOption,i); 
			return;
		}
	} 
	oTarget.add(oOption);
}
function deleteRule()//2-3. 删除规则
{
	
    if(ruleId!=null && typeof ruleId!='undefined')
    {
        if(QMsg("是否删除该规则(不可恢复，建议使用作废功能)?")==MSG_YES)
        {
            var oTarget = ruleList.getObject();
            xmlhttp.Open("POST", alarmRuleUrl+"tag=5&ruleId="+ruleId, false);
            ruleId=null;
        	ruleName = null;
            xmlhttp.send();
            if(isSuccess(xmlhttp))
            {
                oTarget.options.remove(oTarget.selectedIndex);
            }
            //else oTarget.options.remove(oTarget.selectedIndex);
        }
    }else
    {
        MMsg("对不起，您未选中任何项！");
    }
}

function moveRule(direction)//2-4. 移动规则
{
    var oTarget = ruleList.getObject();
    if(oTarget.selectedIndex!=-1)
    {
        ruleId = oTarget.options[oTarget.selectedIndex].value;
        ruleName = oTarget.options[oTarget.selectedIndex].text;
    }else {
    	return;
    }

    if(ruleName.indexOf("作废")!=-1)
    	return;
    if(ruleId!=null && typeof ruleId!='undefined')
    {
        var submitUrl = alarmRuleUrl+"&tag=";
        var swapItem;
        if(direction=="-1")
        {
            if(oTarget.selectedIndex==0){return;}
            submitUrl+="7";
            swapItem = oTarget.options[oTarget.selectedIndex-1];
        }else
        {
            if(oTarget.selectedIndex==oTarget.length-1){return;}
            //coll(0).options(i).value
            var nextRuleName =oTarget.options(oTarget.selectedIndex+1).text;
    		if(nextRuleName.indexOf("作废")!=-1)
    			return;
            submitUrl+="8";
            swapItem = oTarget.options[oTarget.selectedIndex+1];
        }
        
        xmlhttp.Open("POST", submitUrl+"&ruleId="+ruleId, false);
        xmlhttp.send();
        if(isSuccess(xmlhttp))
        {
            oTarget.options[oTarget.selectedIndex].swapNode(swapItem);
        }
        //else oTarget.options[oTarget.selectedIndex].swapNode(swapItem);
    }else
    {
        MMsg("对不起，您未选中任何项！");
    }
}
function enableRule()//2-5. 启用规则
{
    if(ruleId==null || typeof ruleId=='undefined') {MMsg("对不起，您未选中任何项！");return;}
    var oTarget = ruleList.getObject();
    //var ruleName = oTarget.options[oTarget.selectedIndex].text;
   	if(ruleName.indexOf("作废")==-1){
   		alert("规则已经启用!");
    	return;
    }
    xmlhttp.Open("POST", alarmRuleUrl+"tag=23&ruleId="+ruleId, false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    	getRuleListByType();    
    //else getRuleListByType();  
}
function disableRule()//2-6. 作废规则
{
    if(ruleId==null || typeof ruleId=='undefined') {MMsg("对不起，您未选中任何项！");return;}
    if(ruleName.indexOf("作废")!=-1){
   		alert("规则已经作废!");
    	return;
    }
    xmlhttp.Open("POST", alarmRuleUrl+"tag=24&ruleId="+ruleId, false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    	getRuleListByType();    
    //else getRuleListByType();  
}
function modifyRule()//2-7. 规则属性
{
    if(ruleId==null || typeof ruleId=='undefined') {MMsg("对不起，您未选中任何项！");return;}
    if(ruleName.indexOf("作废")!=-1){
   		alert("规则已经作废,请先启用!");
    	return;
    }
    var params = new Object();
    var oTarget = ruleType.getObject();
    params.ruleId = ruleId;
    params.ruleTypeId = oTarget.options[oTarget.selectedIndex].value;
    params.ruleTypeName = oTarget.options[oTarget.selectedIndex].text;
    params.isCopy=false;
    params = showProperty(params);
    if(typeof params!="undefined")
    {
        oTarget = ruleList.getObject();
        oTarget.options[oTarget.selectedIndex].value = params[0];
        oTarget.options[oTarget.selectedIndex].text = params[1];
    }
    showRuleTree();
}

function reflash() {//2-8. 规则列表的刷新
	getRuleListByType();
}

function synchro() {//2-9. 规则同步

	xmlhttp.Open("POST", alarmRuleUrl+"tag=25&ruleType="+ruleTypeId, false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        MMsg("同步成功！");
    }
}

function showProperty(params)
{
    ruleListMenu.hidden();
    return window.showModalDialog("alarm_rule_property.htm",params,"dialogWidth=640px;dialogHeight=420px;help=0;scroll=1;resizable=0;status=0;");
    //getRuleListByType();
}
//---------------------------------------------------------------------
//----------3。属性节点----------------------------------------------------
//---------------------------------------------------------------------
//3-1. 获取属性节点列表
function initProperty()
{
    xmlhttp.Open("POST", alarmRuleUrl+"tag=11&ruleType="+ruleTypeId, false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        var dXML = new ActiveXObject("Microsoft.XMLDOM");
        dXML.load(xmlhttp.responseXML);
        var oRows = dXML.selectNodes("/root/rowSet");
        
        var attrId;
        var attrType;
        var attributeNameCn;
        var attributeNameEn;
        
        var propertyObj;//
        //settingPropertyTagWidth();
        var iLen = oRows.length;
        propertyTag.innerHTML = "";
        for(var i=0;i<iLen;i++)
        {
            propertyObj = new Array();
            attrId = oRows[i].selectSingleNode("ATTR_ID").text;//attributeId
            attributeNameEn = oRows[i].selectSingleNode("NAME_EN").text;//英文名
            attributeNameCn = oRows[i].selectSingleNode("NAME_CN").text;//中文名
            attrType = oRows[i].selectSingleNode("ATTR_TYPE").text;//属性类型
            remark = oRows[i].selectSingleNode("REMARK").text;//描述
            
            propertyObj[0] = attrId;
            propertyObj[1] = (attributeNameEn!="kpiId")?(oRows[i].selectSingleNode("INPUT_TYPE").text):5;//类型
            propertyObj[2] = attributeNameCn;
            propertyObj[3] = attrType;
            inputTypeObj[attributeNameEn] = propertyObj;
            //属性结点
            propertyTag.insertAdjacentHTML("beforeEnd", '<span id="property" onmouseover="showTip2(this, popTip, '+"'"+remark+"'"+')" onmouseout="hideTip(this, popTip, event)"><IE:button value="'+attributeNameCn+'" onclick="showPropertyValues('+"'"+attributeNameEn+"'"+')"/>&nbsp;</span>');
        }
        moveRightTag.disabled = true;
        moveLeftTag.disabled = false;
        if(iLen==0) {propertyOperate.style.visibility="hidden";}
    }
}
function settingPropertyTagWidth()
{
   //var maxLength = parseInt(propertyOperate.offsetWidth);//允许长度
   var maxLength = WebForm_GetClentX();
   if(maxLength>38)
   		propertyTag.style.width = maxLength-138;
}
function WebForm_GetClentX() 
{
    if (typeof window.pageYOffset != 'undefined') 
    {
        return window.pageXOffset;
    }
    else 
    {
        if (document.documentElement && document.documentElement.clientWidth) 
        {
            return document.documentElement.clientWidth;
        }
        else if (document.body) 
        {
            return document.body.clientWidth;
        }
    }
    return 0;
}
//3-2. 显示"值列表"
function showPropertyValues(attributeNameEn)
{
    if(currentTree!=null)
    {
    	if(currentTree.getSelectedItem()==null){
			MMsg("请先点击选择规则树的结点！");
			return ;
		}
        var attrId = currentTree.getSelectedItem().getAttribute("AttrId");
        if(attrId!=null && typeof attrId!="undefined")
        {
            currentTree.toParent();
        }
    }
    ShowAttrInfo();
    clearAndShowValueList(attributeNameEn, null,null,null);
}
//3-3. 左移
function moveLeftProperty()
{
    if(property==null || typeof property=="undefined") {return;}
    var iLen = property.length;
    if(property.length<=1) {return;}
    //判断：滚动长度是否超过界定长度。
    //==> 是，则取"第一个显示元素"，将其隐藏。
    //==> 否，则返回。
    if(propertyTag.scrollWidth<=propertyTag.offsetWidth) {return;}
    for(var i=0;i>=0;i++)
    {
        if(property[i].style.display!="none")
        {
            property[i].style.display = "none";
            break;
        }
    }
    moveRightTag.disabled=false;
    if(propertyTag.scrollWidth<=propertyTag.offsetWidth) {moveLeftTag.disabled=true;}
}
//3-4. 右移
function moveRightProperty()
{
    if(property==null || typeof property=="undefined") {return;}
    var iLen = property.length;
    if(property.length<=1) {return;}
    //判断：是否存在"隐藏元素"。
    //==> 是，则取"最后一个隐藏元素"，将其显示。
    //==> 否，则返回。
    if(property[0].style.display!="none"){return;}
    for(var i=0;i>=0;i++)
    {
        if(property[i].style.display!="none")
        {
            break;
        }
    }
    property[i-1].style.display = "";
    //左右移动的按钮。
    if(propertyTag.scrollWidth<=propertyTag.offsetWidth) {moveLeftTag.disabled = true;}
    else {moveLeftTag.disabled = false;}
    if(i==1) {moveRightTag.disabled=true;}
}
//取得规则的提示信息
function getRuleSetUpInfo(ruleTypeId){
	var start = "双击规则名称或者规则树根节点进行规则基本信息、生效时段";
	var end = "的配置";
	if(ruleTypeId=="1"){
		return start + "、性能阀值" + end;
	}else if(ruleTypeId=="4"){
		return start + "、告警重定义" + end;
	}else if(ruleTypeId=="7"){
		return start + "、告警升级" + end;
	}else if(ruleTypeId=="8"){
		return start + "、告警自动确认清除" + end;
	}else{
		return start+ end;
	}
}
//---------------------------------------------------------------------
//----------4。规则树----------------------------------------------------
//---------------------------------------------------------------------
//4-1. 获得规则树
function showRuleTree()
{
    //var oTarget = ruleList.getObject();
    //if(oTarget.selectedIndex!=-1)
	if(ruleId!=null && typeof ruleId!='undefined' && ruleId!="")
    {
		//ruleId = oTarget.options[oTarget.selectedIndex].value;
        //ruleName = oTarget.options[oTarget.selectedIndex].text;
        //if(ruleId!=null && typeof ruleId!='undefined')
        //{
            ruleTree = new XMLTree();
            ruleTree.xmlUrl = alarmRuleUrl+"tag=10&ruleId="+ruleId;
            ruleTree.isOpenChildAtferClick = true;
            ruleTree.isSelectedClick = true;
            ruleTree.showDepth=100;
            ruleTree.defaultIco = "orange_ball1.gif";
            ruleTree.setClickAction(new ClickAction(ruleTree, treeDiv, ruleDom));
            ruleTree.setRightAction(new RightAction(ruleTree, ruleTreeMainMenu));
            //DblClickAction
            //ruleTree.setDblClickAction(new DblClickAction())
            ruleTree.showAt(treeDiv);
            //ruleTree.isDragOnTree = true;
			ruleTree.setEndDragAction(new endDragAction());
            if(ruleTypeId==2)
            {
                //treeDiv.style.height = "276px";
                //tree2Div.style.display="";
                ruleTree2 = new XMLTree();
                ruleTree2.xmlUrl = alarmRuleUrl+"tag=15&ruleId="+ruleId;
                ruleTree2.isOpenChildAtferClick = true;
                ruleTree2.isSelectedClick = true;
                ruleTree2.showDepth=100;
                ruleTree2.defaultIco = "orange_ball1.gif";
                ruleTree2.setClickAction(new ClickAction(ruleTree2, tree2Div, ruleDom2));
                ruleTree2.setRightAction(new RightAction(ruleTree2, ruleTree2MainMenu));
                //ruleTree2.setDblClickAction(new DblClickAction())
                ruleTree2.showAt(tree2Div);
                //ruleTree2.isDragOnTree = true;
				ruleTree2.setEndDragAction(new endDragAction());
            }else
            {
                //tree2Div.style.display="none";
                //treeDiv.style.height = "554px";
            }
       // }
    }
    //默认为第一颗树
    currentTree = ruleTree;
    currentTreeDiv = treeDiv;
    currentDom = ruleDom;
   	//ShowRuleInfo();

	xmlhttp.Open("POST", alarmRuleUrl+"tag=33", false);
	xmlhttp.send();
	if(isSuccess(xmlhttp))
	{
		regionId=xmlhttp.responseXML.selectSingleNode("/root/region_id").text;
		regionName=xmlhttp.responseXML.selectSingleNode("/root/region_name").text;
	}
	
	if((flag=="1" || flag==1) && (isCopy=="false"||isCopy==false))
		oTime1 = window.setInterval("initTreeAdd()",100);
	else
	{
		oTime1 = window.setInterval("setLockTreeItem()",100);
	}
}
//新增时默认添加一个与节点以及区域等于本地的节点
function initTreeAdd(){
	if(getRootElement(treeDiv)!=null)
	{
		window.clearTimeout(oTime1);
		var rootElementId = getRootElement(treeDiv).getAttribute("id");
		document.getElementById(rootElementId).click();
		var id=addTreeItem(ruleTree, treeDiv, ruleDom, 'And');
		if(id!=null && id!="")
			lockedTreeItemId[0] =id;

		showPropertyValues('regionId');
		var oTarget = valueList3Target.getObject();
		reloadSelection(oTarget, regionName, regionId);
		
		id=updateTreePropertyItem();
		showPropertyValues("neId");
		//初始化添加一个网元结点 chenjw
		AddNeItem();
		
		if(id!=null && id!="")
			lockedTreeItemId[1] = id;
	}
	isAdmin();		
}
//设置默认的锁定节点
function setLockTreeItem(){
	if(getRootElement(treeDiv)!=null)
	{
		window.clearTimeout(oTime1);
		var element = ruleDom.selectSingleNode("/root/Menu/MenuItem");
		if(element!=null && element.selectNodes("MenuItem")[0]!=null)
		{
			var element1 = element.selectNodes("MenuItem")[0];
			if(element1.getAttribute("Value")=="And")
			{
				lockedTreeItemId[0] = element1.getAttribute("id");
				if(element1.selectNodes("MenuItem")[0]!=null)
				{
					var element2 = element1.selectNodes("MenuItem")[0];
					if(element2.getAttribute("AttrId")=="regionId")
						lockedTreeItemId[1] = element2.getAttribute("id");
					else
						lockedTreeItemId[1]="noItemLock";
				}
				else
					lockedTreeItemId[1]="noItemLock";
			}
			else
				lockedTreeItemId[0]="noItemLock";
		}
		else
			lockedTreeItemId[0]="noItemLock";
	}
	isAdmin();
}
function isAdmin(){
	if(staffId!=null && (staffId=="1"||staffId==1))
	{
		lockedTreeItemId[0]="noItemLock";
		lockedTreeItemId[1]="noItemLock";
	}
}
function ShowRuleInfo(){
    propertyValuesBlock.style.display="none";
    ruleInfo.style.display="";
    logicNodeInfo.style.display="none";
    if(ruleId!=null && typeof ruleId!="undefined")
    {
        xmlhttp.Open("POST", alarmRuleUrl+"tag=9&ruleId="+ruleId, false);
        xmlhttp.send();
        if(isSuccess(xmlhttp))
        {
            var dXML = new ActiveXObject("Microsoft.XMLDOM");
            //var oTarget = ruleType.getObject();
            dXML.load(xmlhttp.responseXML); 
            //(1). 基本信息
            document.getElementById("alarmRuleName").innerText  = dXML.selectSingleNode("/root/Msg/ALARM_RULE_NAME").text;
            document.getElementById("ruleTypeName").innerText  = ruleTypeName;
            document.getElementById("ruleRemark").innerText = dXML.selectSingleNode("/root/Msg/REMARK").text;
            //document.getElementById("otherInfo").innerText = getRuleSetUpInfo(ruleTypeId);
        }
    }
}
function ShowLogicInfo(value){
	var and  = "注意 与结点下面必须至少要有两个子结点";
	var or ="注意 或结点下面必须至少要有两个子结点";
	var not ="注意 非结点下面有且仅有一个子结点";
    propertyValuesBlock.style.display="none";
    ruleInfo.style.display="none";
    logicNodeInfo.style.display="";	
    if(value == "And"){
    	document.getElementById("otherLogicInfo").innerText = and;
    }else if(value == "Or"){
    	document.getElementById("otherLogicInfo").innerText = or;
    }else if(value == "Not"){
    	document.getElementById("otherLogicInfo").innerText = not;
    }
}
function ShowAttrInfo(){
    propertyValuesBlock.style.display="";
    ruleInfo.style.display="none";
    logicNodeInfo.style.display="none";	
}
function ClickAction(treeObj, treeDivObj, domObj)//左键单击事件
{
	this.parent = new XMLTree_onClick_Action;
	this.parent.click = function(oItem)
	{
		var attributeNameEn = oItem.getAttribute("AttrId");
        var rootElementId = getRootElementByTree(treeObj).getAttribute("id");
        var value = oItem.getAttribute("Value");
        //根节点
        if(oItem.getAttribute("id")==rootElementId){
        	;
			//ShowRuleInfo();	
        //逻辑结点
        }else if(value=="And"||value=="Or"||value=="Not"){
        	ShowLogicInfo(value);
        	if(value=="And" && attributeName!=null && attributeName.length>0) //"与"节点，则进行valueList3刷新。
            {
                //如果为inputType==3，则获得所有"网元类型"的属性节点-->重新载入valueList3Tree。
                var inputType = inputTypeObj[attributeName][1];
                if(inputType==3)
                {
                    //var selectedNode = domObj.selectSingleNode("//MenuItem[@id='"+oItem.getAttribute("id")+"']");
                    //var childNodes = selectedNode.selectNodes("MenuItem[@AttrId='"+NE_TYPE+"']");
                    //if(childNodes.length>0) {}//todo, 单击"与"节点(获得所有的值，构造这个相应的树)
                }
            }
            updatePropertyValueListButon.value = "增 加";//按钮恢复
            isUpdate = false;
        //属性节点
        }else if(oItem.getAttribute("id")!=rootElementId && attributeNameEn!=null && typeof attributeNameEn!="undefined"){        
        	ShowAttrInfo();
            //属性节点<MenuItem label=\"对象类型 等于 严重告警\" AttrId=\"OBJECT_CLASS\" MatchTag=\"Equal\" Value=\"30030107\"/>
            attributeName = attributeNameEn;
            var matchTag = oItem.getAttribute("MatchTag");
            var label = oItem.firstChild.nodeValue;
            label = label.substr(label.indexOf(" ", label.indexOf(" ")+1)+1);
            //var inputType = inputTypeObj[attributeNameEn][1];
            //var label = getLabelByInputType(inputType, value);
            clearAndShowValueList(attributeNameEn, matchTag, label, value);
        }
        currentTree = treeObj;
        currentTreeDiv = treeDivObj;
        currentDom = domObj;
	}
	return this.parent;
}
function RightAction(treeObj, rightMenu)//右键单击事件
{
	this.parent = new XMLTree_oncontextmenu_Action;
	this.parent.rightClick = function(oItem)
	{
        //var valueAttribute = oItem.getAttribute("Value");
        var attributeNameEn = oItem.getAttribute("AttrId");
        var rootElementId = getRootElementByTree(treeObj).getAttribute("id");
        var oItem = treeObj.getSelectedItem();
        if(oItem.getAttribute("id")==rootElementId)//(1). 根节点
        {
            rightMenu.setItemDisable("1");
            //rightMenu.setItemDisable("0/3");
        }
        else if(attributeNameEn!=null && typeof attributeNameEn!="undefined")//(2). 属性节点
        {
            attributeName = attributeNameEn;
            rightMenu.setItemDisable("0");
            rightMenu.setItemDisable("1");
        }//(3). 关系节点 
        rightMenu.show();
	}
	
	return this.parent;
}
function DblClickAction()
{
	this.parent = new XMLTree_onDblClick_Action;
	this.parent.dblclick = function (oItem)
	{
		var value = oItem.getAttribute("Value");
        //根节点
        if(value==null){
        	modifyRule();
        }		
	}
	return this.parent;
}
function endDragAction()
{
	this.parent = new XMLTree_onDragEnd_Action;
	this.parent.endDrag = function(oDragItem,oOverItem)
	{
		//落点为空 或是 落点为属性结点则不拖拉
		if(oOverItem==null || oOverItem.getAttribute("AttrId")!=null)
			return false
		else{
			var dragNode = currentDom.selectSingleNode("//MenuItem[@id='"+oDragItem.getAttribute("id")+"']");
			var overNode = currentDom.selectSingleNode("//MenuItem[@id='"+oOverItem.getAttribute("id")+"']");
			//添加子结点
			overNode.appendChild(dragNode);
			return true;
		}
	}
	return this.parent;
}
//4-2. 清空规则树，并清空属性列表
function clearRuleInfo()
{
    ruleId=null;
    ruleName =null;
    ruleTree = null;
    ruleTree2 = null;
    treeDiv.innerHTML = "";
    tree2Div.innerHTML = "";
    attributeName="";
    propertyName.innerHTML = "";
    operatorList.getObject().length = 0;
    valueList1.style.display="none";
    valueList2.style.display="none";
    valueList3.style.display="none";
    valueList4.style.display="none";
    valueList5.style.display="none";
    updatePropertyValueListButon.style.display="none";
    clearPropertyValueListButon.style.display="none";
}
//4-3. 获得根节点
function getRootElement(treeDivObj)
{
    if(treeDivObj.firstChild.firstChild!=null)
    {
        return treeDivObj.firstChild.firstChild.childNodes[2];
    }
}
function getRootElementByTree(treeObj)
{
    var dXML = treeObj._treeDoc;
    var rootItem = dXML.selectSingleNode("/root/Menu/MenuItem");
    return rootItem;
}
//4-4. 展开整个树
function expandAll(treeObj, treeDivObj, domObj)
{
    try
    {
        var rootElement = getRootElement(treeDivObj);
        if(rootElement!=null)
        {
            //rootElement.click();
            //treeObj.expandItem();
            domObj.load(treeObj._treeDoc);
        }
    }catch(e){}
}
//4-5. 添加节点 ("与"、"或"、"非")
function addTreeItem1(type){addTreeItem(ruleTree, treeDiv, ruleDom, type);}
function addTreeItem2(type){addTreeItem(ruleTree2, tree2Div, ruleDom2, type);}
function addTreeItem(treeObj, treeDivObj, domObj, type, isRootFlag)
{
    var oItem = treeObj.getSelectedItem();
    var selectedNode = domObj.selectSingleNode("//MenuItem[@id='"+oItem.getAttribute("id")+"']");
    //(1). 是根节点
    var rootElementId = getRootElement(treeDivObj).getAttribute("id");
    if(oItem.getAttribute("id")==rootElementId)
    {
        //--> 只能有一个子节点
        var childNodes = selectedNode.hasChildNodes();
        if(childNodes) {MMsg("对不起，根节点只能存在一个子节点！");return;}
    }
    //(2). 是属性节点
    var attrIdAttribute = oItem.getAttribute("AttrId");
    if(attrIdAttribute!=null && typeof attrIdAttribute!="undefined")//(2). 属性节点
    {
        MMsg("对不起，不能属性节点添加子节点！");return;
    }
    //(3). 是"非"节点
    if(oItem.getAttribute("Value")=="Not")
    {
        var childNodes = selectedNode.hasChildNodes();
        if(childNodes) {MMsg("对不起，\"非节点\"只能存在一个子节点！");return;}
    }
    //(4-1). 添加显示元素
    var oItem = treeObj.getSelectedItem();

    var id = document.uniqueID;
    var label = "";
    var addNameArr = new Array();
    var addValueArr = new Array();
    if(type=="And")//与节点<MenuItem label=\"与\" value=\"And\">
    {
        label = "与";
    }
    else if(type=="Or")//或节点<MenuItem label=\"或\" value=\"Or\">
    {
        label = "或";
    }
    else if(type=="Not")//非节点<MenuItem label=\"非\" value=\"Or\">
    {
        label = "非";
    }else//属性节点<MenuItem label=\"对象类型 等于 严重告警\" AttrId=\"OBJECT_CLASS\" MatchTag=\"Equal\" value=\"30030107\"/>
    {
        var oTarget = operatorList.getObject();//
        if(attributeName=="" || oTarget.selectedIndex==-1) {MMsg("对不起，请选择属性类型！");return;}
        showPropertyValues(attributeName);
        return;
    }
    addNameArr.push("Value");
    addNameArr.push("ico");
    addValueArr.push(type);
    addValueArr.push("folder1.gif");
    treeObj.add(id, label, addNameArr, addValueArr, false);
    document.getElementById(id).click();
    //(4-2). 添加DOM
    var addDoc = treeObj._createAddDoc(id, label, addNameArr, addValueArr);
	
    selectedNode.appendChild(addDoc.selectSingleNode("/root/Menu/MenuItem"));
	return id;
}
//4-6. 删除节点 ("与"、"或"、"非"、"属性")
function deleteTreeItem1(){deleteTreeItem(ruleTree, treeDiv, ruleDom);}
function deleteTreeItem2(){deleteTreeItem(ruleTree2, tree2Div, ruleDom2);}
function deleteTreeItem(treeObj, treeDivObj, domObj)
{
    var rootElementId = getRootElement(treeDivObj).getAttribute("id");
    var oItem = treeObj.getSelectedItem();
    if(oItem.getAttribute("id")==rootElementId)
    {
        MMsg("对不起，不能删除根节点！");
    }
	else if(oItem.getAttribute("id")==lockedTreeItemId[0]||oItem.getAttribute("id")==lockedTreeItemId[1])
	{//被锁定的节点
		MMsg("对不起，该节点已被锁定，不能删除！");return;
	}
	else if(QMsg("是否删除该节点?")==MSG_YES)
    {
    //属性节点<MenuItem label=\"对象类型 等于 严重告警\" AttrId=\"OBJECT_CLASS\" MatchTag=\"Equal\" value=\"30030107\"/>
        var parentNodeId = treeObj.toParent().getAttribute("id");
        //(1). 删除显示元素
        treeObj.delItem(oItem);
        //(2). 删除DOM
        var parentNode = domObj.selectSingleNode("//MenuItem[@id='"+parentNodeId+"']");
        var selectedNode = domObj.selectSingleNode("//MenuItem[@id='"+oItem.getAttribute("id")+"']");
        parentNode.removeChild(selectedNode);
    }
}
//4-7. 修改节点 ("与"、"或"、"非")
function updateTreeItem1(type){updateTreeItem(ruleTree, treeDiv, ruleDom, type);}
function updateTreeItem2(type){updateTreeItem(ruleTree2, tree2Div, ruleDom2, type);}
function updateTreeItem(treeObj, treeDivObj, domObj, type)
{
    //(1). 根节点
    var rootElementId = getRootElement(treeDivObj).getAttribute("id");
    var oItem = treeObj.getSelectedItem();
    if(oItem.getAttribute("id")==rootElementId)
    {
        MMsg("对不起，不能更改根节点！");return;
    }
	//被锁定的节点
	if(oItem.getAttribute("id")==lockedTreeItemId[0]||oItem.getAttribute("id")==lockedTreeItemId[1])
	{
		MMsg("对不起，该节点已被锁定，不能更改！");return;
	}
    //(2). 属性节点
    var attrIdAttribute = oItem.getAttribute("AttrId");
    if(attrIdAttribute!=null && typeof attrIdAttribute!="undefined")
    {
        MMsg("对不起，不能对属性节点进行替换！");return;
    }
    //(3). 关系节点
    if(type=="And")//与节点<MenuItem label=\"与\" value=\"And\">
    {
        label = "与";
    }
    else if(type=="Or")//或节点<MenuItem label=\"或\" value=\"Or\">
    {
        label = "或";
    }
    else if(type=="Not")//非节点<MenuItem label=\"非\" value=\"Or\">
    {
        var selectedNode = currentDom.selectSingleNode("//MenuItem[@id='"+oItem.getAttribute("id")+"']");
        var childNodesLength = selectedNode.childNodes.length;
        if(childNodesLength>1) {MMsg("对不起，\"非节点\"只能存在一个子节点！");return;}
        label = "非";
    }
    //(3-1). 修改显示元素
    oItem.setAttribute("Value", type);
    oItem.innerHTML = label;
    //(3-2). 修改DOM
    var selectedNode = domObj.selectSingleNode("//MenuItem[@id='"+oItem.getAttribute("id")+"']");
    selectedNode.setAttribute("label", label);
    selectedNode.setAttribute("Value", type);
    
}
//4-8. 更新
function updateTreePropertyItem()
{
    if(ruleTree==null) {return;}
    var inputType = inputTypeObj[attributeName][1];
    var labelArr = new Array();
    var valueArr = new Array();
    var oTarget;
    //(1). 判断：是否值为空，是否操作符与值列表长度相匹配。
    var isValid = false;
    if(inputType==1)
    {
        oTarget = valueList1Target.getObject();
        isValid = isSelectionValid(oTarget.length);
        if(!isValid) {return;}
        getDataFromSelection(oTarget, labelArr, valueArr);
    }
    else if(inputType==2)
    {
        isValid = isSelectionValid(valueList2Selection.length);
        if(!isValid) {return;}
        getDataFromSelection(valueList2Selection, labelArr, valueArr);
    }
    else if(inputType==3)
    {
        oTarget = valueList3Target.getObject();
        isValid = isSelectionValid(oTarget.length);
        if(!isValid) {return;}
        getDataFromSelection(oTarget, labelArr, valueArr);
    }
    else if(inputType==4)
    {
        if(valueList4Date.value==""){MMsg("对不起，请选择日期！");isValid = false;}
        else if(valueList4Hour.value>23) {MMsg("对不起，\"小时\"不能大于23！");isValid = false;}
        else if(valueList4Minute.value>59) {MMsg("对不起，\"分钟\"不能大于59！");isValid = false;}
        else if(valueList4Second.value>59) {MMsg("对不起，\"秒\"不能大于59！");isValid = false;}
        else
        {
            isValid = true;
        }
        if(!isValid) {return;}
        var dateTime = getDateTime(valueList4Date, valueList4Hour, valueList4Minute, valueList4Second);
        labelArr[0] = dateTime;
        valueArr[0] = dateTime;
    }
    else if(inputType==5)
    {
        isValid = isSelectionValid(KPI_LIST.length);
        if(!isValid) {return;}
        getDataFromSelection(KPI_LIST, labelArr, valueArr);
    }
    //网元
    else if(inputType==6)
    {
    	oTarget = valueList6Target.getObject();
        isValid = isSelectionValid(oTarget.length);
        if(!isValid) {return;}
        getDataFromSelection(oTarget, labelArr, valueArr);
    }
    
    var oItem = currentTree.getSelectedItem();
    oTarget = operatorList.getObject();
    var matchTag = oTarget.options[oTarget.selectedIndex].value
    label = inputTypeObj[attributeName][2]+
            " "+oTarget.options[oTarget.selectedIndex].text+
            " "+labelArr.join(",");
    if(isUpdate)
    {
        //(2). 更新显示元素
        oItem.setAttribute("AttrId", attributeName);
        oItem.setAttribute("MatchTag", matchTag);
        oItem.setAttribute("Value", valueArr.join(","));
        oItem.innerHTML = label;
        //(3). 修改DOM
        var selectedNode = currentDom.selectSingleNode("//MenuItem[@id='"+oItem.getAttribute("id")+"']");
        selectedNode.setAttribute("AttrId", attributeName);
        selectedNode.setAttribute("MatchTag", matchTag);
        selectedNode.setAttribute("label", label);
        selectedNode.setAttribute("Value", valueArr.join(","));
    }
    else
    {
        //(2). 判断：树的当前位置是否可以添加属性节点。
        //currentTree currentDom currentTreeDiv
        var id = document.uniqueID;
        var selectedNode = currentDom.selectSingleNode("//MenuItem[@id='"+oItem.getAttribute("id")+"']");
        var rootElementId = getRootElement(currentTreeDiv).getAttribute("id");
        if(oItem.getAttribute("id")==rootElementId)//(1). 根节点
        {
            var childNodes = selectedNode.hasChildNodes();
            if(childNodes) {MMsg("对不起，根节点只能存在一个属性节点！");return;}
            //MMsg("对不起，根节点下不能直接添加属性节点！");return;
        }
        var attrIdAttribute = oItem.getAttribute("AttrId");
        if(attrIdAttribute!=null && typeof attrIdAttribute!="undefined")//(2). 属性节点
        {
            MMsg("对不起，不能属性节点添加子节点！");return;
        }
        if(oItem.getAttribute("Value")=="Not")
        {
            var childNodes = selectedNode.hasChildNodes();
            if(childNodes) {MMsg("对不起，\"非节点\"只能存在一个子节点！");return;}
        }
        //(3). 添加界面元素
        var addNameArr = new Array();
        var addValueArr = new Array();
        addNameArr.push("AttrId");
        addValueArr.push(attributeName);
        addNameArr.push("AttrType");
        addValueArr.push(inputTypeObj[attributeName][3]);
        addNameArr.push("MatchTag");
        addValueArr.push(matchTag);
        addNameArr.push("Value");
        addValueArr.push(valueArr.join(","));
        currentTree.add(id, label, addNameArr, addValueArr, false);
        //(4). 添加DOM
        var addDoc = currentTree._createAddDoc(id, label, addNameArr, addValueArr);
        selectedNode.appendChild(addDoc.selectSingleNode("/root/Menu/MenuItem"));

		return id;
    }
}
function isSelectionValid(selectionLength)//限制长度
{
    if(selectionLength==0) {MMsg("对不起，请选择属性值！");return false;}
    var lengthType = operatorLengthObj[operatorList.getObject().value];
    if(lengthType==1 && selectionLength!=1) {MMsg("对不起，不能选择多个值！");return false;}
    return true;
}
//4-8. 校验
function checkTree()
{
    if(ruleTree==null) {return;}
    xmlhttp.Open("POST", alarmRuleUrl+"tag=16&ruleId="+ruleId, false);
    xmlhttp.send(mergeTree());
    if(isSuccess(xmlhttp))
    {
        MMsg("验证成功！");
    }
}
//4-9. 提交更新
function saveTree()
{
    if(ruleTree==null) {return;}
    xmlhttp.Open("POST", alarmRuleUrl+"tag=17&ruleId="+ruleId, false);
    xmlhttp.send(mergeTree());
    if(isSuccess(xmlhttp))
    {
        MMsg("规则树保存成功！");
    } else {
    	return false;
    }
}
function mergeTree()
{
    if(ruleTypeId!=null && ruleTypeId==2)
    {
        var mergeDom = new ActiveXObject("Microsoft.XMLDOM");
        mergeDom.load(ruleDom);
        var rootElement = mergeDom.selectSingleNode("/root");
        var menuElement = ruleDom2.selectSingleNode("/root/Menu").cloneNode(true);
        rootElement.appendChild(menuElement);
        return mergeDom;
    }else
    {
        return ruleDom;
    }
}
//---------------------------------------------------------------------
//----------5。值列表----------------------------------------------------
//---------------------------------------------------------------------
//5-1. 功能：显示相应"值列表"，并清除数据。
//     输入：(1).属性类型, (2).关系操作符, (3).显示元素, (4).值元素
//     输出：(无) 
function clearAndShowValueList(attributeNameEn, currentOperator, currentLabel, currentValue)
{
    attributeName = attributeNameEn;
    //(1). 名称
    propertyName.innerHTML = inputTypeObj[attributeNameEn][2];
    //(2). 关系操作符。
    //operatorList.xmlsrc = alarmRuleUrl+"tag=13&attributeId="+inputTypeObj[attributeNameEn][0];
    xmlhttp.Open("POST", alarmRuleUrl+"tag=13&attributeId="+inputTypeObj[attributeNameEn][0], false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        var dXML = new ActiveXObject("Microsoft.XMLDOM");
        dXML.load(xmlhttp.responseXML);
        
        var oTarget = operatorList.getObject();
        oTarget.length = 0;
        var oOption;
        var oId;
        var oIsMulti;
        var oRows = dXML.selectNodes("/root/rowSet");
        for(var i=0;i<oRows.length;i++)
        {
            oId = oRows[i].getAttribute("id");
            oLength = oRows[i].selectSingleNode("ISMULTI").text;
            
            oOption = document.createElement("OPTION");
            oOption.text = oRows[i].selectSingleNode("NAME_CN").text;
            oOption.value = oId;
            oTarget.add(oOption);
            
            if(oLength=="0BF") {operatorLengthObj[oId]=1;}
            else {operatorLengthObj[oId]=2;}
        }
    }
    operatorList.getObject().selectedIndex=0;
    //(3). 显示相应的"值列表"，并隐藏其他"值列表"
    var inputType = inputTypeObj[attributeNameEn][1];
    var valueListObj;
    for(var i=1;i<7;i++)
    {
        valueListObj = eval("valueList"+i);
        if(i!=inputType){valueListObj.style.display="none";}
        else
        {
            valueListObj.style.display="";
            //(1). 操作符和按钮
            if(currentOperator!=null && typeof currentOperator!="undefined")
            {
                operatorList.getObject().value = currentOperator;
                updatePropertyValueListButon.value = "更 新";
                isUpdate = true;
                updatePropertyValueListButon.style.display = "";
            }else
            {
                operatorList.getObject().selectedIndex = 0;
                updatePropertyValueListButon.value = "增 加";
                isUpdate = false;
                updatePropertyValueListButon.style.display = "";
            }
            clearPropertyValueListButon.style.display = "";
            //(2). 值列表
            if(i==1)
            {
                valueList1Source.xmlsrc = alarmRuleUrl+"tag=12&attributeId="+inputTypeObj[attributeNameEn][0];
                initSelect(valueList1Source,"160","20");
                var oTarget = valueList1Target.getObject();
                reloadSelection(oTarget, currentLabel, currentValue);//清空，并填充数据
                initSelect(valueList1Target,"160","20");
            }
            else if(i==2)
            {
                clearValueList2();
                reloadSelection(valueList2Selection, currentLabel, currentValue);//清空，并填充数据
            }
            else if(i==3)
            {
                //if(!isValueListTreeLoaded)
                //{
                    valueList3Tree = new XMLTree();
                    switch (attributeNameEn)
                    {
                      case NE_TYPE:
                          valueList3Tree.xmlUrl = alarmRuleUrl+"tag=21&neTypeId=";
                          break;
                      case NEID:
                          //获得neTypeIds (判断是否为根节点，判断是否为属性节点，判断是否为与节点)
                          var neTypeIdObject = getTreeNeTypeIds();
                          valueList3Tree.xmlUrl = alarmRuleUrl+"tag=22&neTypeIds="+neTypeIdObject.neTypeIds+"&nonNeTypeIds="+neTypeIdObject.nonNeTypeIds+"&neId=";
                          break;
                      case "regionId":
                          valueList3Tree.xmlUrl = alarmRuleUrl+"tag=32&regionId=" + regionId + "&isBuildTree=1";
                          break;
                      //case 'kpiId':
                      //    var neTypeIdObject = getTreeNeTypeIds();
                      //    valueList3Tree.xmlUrl = alarmRuleUrl+"tag=23&kpiId=";
                      //    break;
                    }
                    valueList3Tree.isOpenChildAtferClick = true;
                    //valueList3Tree.showType = 'checkbox';
                    valueList3Tree.isDynamicLoad = true;
                    valueList3Tree.setDynamicLoadAction(new DynamicLoadAction());
                    valueList3Tree.showAt(valueList3TreeDiv);
                    isValueListTreeLoaded=true;
                //}
                var oTarget = valueList3Target.getObject();
                reloadSelection(oTarget, currentLabel, currentValue);//清空，并填充数据
                initSelect(valueList3Target,'160','20');
            }
            else if(i==4)
            {
                settingDateTime(currentValue, valueList4Date, valueList4Hour, valueList4Minute, valueList4Second);//清空或填充数据
            }
            else if(i==6)
            {
            	var params = ["action=0"];
            	neTree = new XMLTree();
            	neTree.xmlUrl = getSendUrl(ne_TreeURL,params);
            	neTree.isOpenChildAtferClick = true;
            	neTree.isDynamicLoad = true;
            	neTree.setDynamicLoadAction(new DynamicLoadNeTreeAction());
            	neTree.setClickAction(new ClickNeTreeAction());
            	neTree.showAt(valueList6Tree);
            	valueList6Source.delAllOption();
            	valueList6Source.getObject().style.width="160";
            	var oTarget = valueList6Target.getObject();
                reloadSelection(oTarget, currentLabel, currentValue);
                initSelect(valueList6Target,"160","13");
            }
            else
            {
                var neTypeIdObject = getTreeNeTypeIds();
                if(neTypeIdObject.neTypeIds.length>0 && neTypeIdObject.neTypeIds.indexOf(",")==-1)
                {
                    NE_ID.setAttribute("neTypeId", neTypeIdObject.neTypeIds);
                }
                
                reloadSelection(KPI_LIST, currentLabel, currentValue);//清空，并填充数据
                //KPI_LIST_TEXT.value = (currentLabel!=null && typeof currentLabel!="undefined")?currentLabel:"";
            }
        }
    }
    //(4). 初始化长度
    changeValueListLength();
}

//动态改变选择列表框,主要为动态实现滚动条提供服务
//输入参数:(1)选择框对象,(2)选择框默认的宽度,(3)选择框默认的行数
//说明:当选择框对象超出设置默认的参数时就改变,如果没有超出设置的默认参数就以默认的参数初始化
function initSelect(selectObject,selectWidth,selectSize)
{				
                var oSelect=selectObject.getObject();
                if (typeof(oSelect)=='undefined'||typeof(oSelect.scrollWidth)=='undefined'||typeof(selectObject.getLength())=='undefined')
                {	
                	oSelect.style.width=selectWidth;
                	oSelect.size=selectSize;
                	return;
                }
                var maxLength=selectWidth;
                var curLength=0;
                 for(i=0;i<oSelect.options.length;i++)
                 	{	
                 		curLength=getStrWidth(oSelect.options[i].text)+40;
                 		if (curLength>maxLength)
                 			maxLength = curLength;                		
                 	}               
				if (maxLength>selectWidth) oSelect.style.width=maxLength;
				else oSelect.style.width=selectWidth;		
				if (selectObject.getLength()>=selectSize) oSelect.size=selectObject.getLength();
				else oSelect.size=selectSize;
			    oSelect.multiple="true";
			    
}
//获取字符串宽度
function getStrWidth(str)
{
    var w = 0;
    var id = 'check_new_line_span_leonny';
    var s = document.getElementById(id);
    s.innerHTML = str;
    s.style.display = '';
    w = s.scrollWidth;
    s.style.display = 'none';
    return w;
}

function ClickNeTreeAction()
{
	this.parent = new XMLTree_onClick_Action;
	this.parent.click = function(oItem)
	{
		var params = ["action=31","id="+oItem.getAttribute("id")]
		valueList6Source.xmlsrc = getSendUrl("../../servlet/netElementManage?",params);
		initSelect(valueList6Source,"160","13")
	}
	return this.parent;
}

function DynamicLoadNeTreeAction()
{
	this.parent = new XMLTree_onDynamicLoad_Action;
	this.parent.dynamicLoad = function(oItem)
	{
		var params =["action=2","id="+oItem.getAttribute("id")];
		return getSendUrl(ne_TreeURL,params);
	}
	
	return this.parent;
}

function DynamicLoadAction()
{
	this.parent = new XMLTree_onDynamicLoad_Action;
	this.parent.dynamicLoad = function(oItem)
	{
		var xmlUrl;
		switch (attributeName)
		{
			case NE_TYPE:
				xmlUrl = alarmRuleUrl+"tag=21&neTypeId=";
				break;
			case NEID:
				var neTypeIdObject = getTreeNeTypeIds();
                xmlUrl = alarmRuleUrl+"tag=22&neTypeIds="+neTypeIdObject.neTypeIds+"&nonNeTypeIds="+neTypeIdObject.nonNeTypeIds+"&neId=";
                //xmlUrl = alarmRuleUrl+"tag=22&neId=";
				break;
			case "regionId":
			    xmlUrl = alarmRuleUrl+"tag=32&regionId=";
			    break;
			//case 'kpiId':
			//	xmlUrl = alarmRuleUrl+"tag=23&kpiId=";
			//	break;			
		}
		return xmlUrl+oItem.getAttribute("id");
	}
	
	return this.parent;
}
//5-2. 功能：根据inputType从"值列表"中获得显示数据
//     输入：(1).类型, (2).值串
//     输出：返回显示串
function getLabelByInputType(inputType, valueStr)
{
    var labelArr = new Array();
    if(valueStr==null || typeof valueStr=="undefined" || valueStr.length==0) {return labelArr;}
    if(inputType==1)
    {
        var oTarget = valueList1Source.getObject();
        labelArr = getLabelFromList(oTarget, valueStr);
        return labelArr.join(",");
    }
    else if(inputType==2)
    {
        return valueStr;
    }
    else if(inputType==3)
    {
        var dXML = valueList3Tree._treeDoc;
        labelArr = getLabelFromTree(dXML, valueStr);
        return labelArr.join(",");
    }
    else if(inputType==5)
    {
        var label = oItem.firstChild.nodeValue;
        label = label.substr(label.indexOf(" ", label.indexOf(" ")+1)+1);
        return label;
    }
}
function getLabelFromList(selectionObj, valueStr)
{
    var valueArr = valueStr.split(",");
    var labelArr = new Array();
    for(var i=0;i<valueArr.length;i++)
    {
        for(var j=0;j<selectionObj.length;j++)
        {
            if(selectionObj.options[j].value==valueArr[i])
            {
                labelArr[i] = selectionObj.options[j].text;
                break;
            }
        }
    }
    return labelArr;
}
function getLabelFromTree(domObj, valueStr)
{
    var valueArr = valueStr.split(",");
    var labelArr = new Array();
    var oItem;
    for(var i=0;i<valueArr.length;i++)
    {
        oNode = domObj.selectSingleNode("//MenuItem[@id='"+valueArr[i]+"']");
        if(oNode!=null) {labelArr[i] = oNode.getAttribute("label");}
    }
    return labelArr;
}
//5-3. 功能：将"数据源"加载到"下拉框"
//     输入：(1). 下拉框对象, (2). 显示元素, (3). 值元素
//     输出：(无)
function reloadSelection(selectionObj, labelStr, valueStr)
{
    selectionObj.length = 0;
    if(valueStr==null || typeof valueStr=="undefined" || valueStr.length==0) {return;}
    var labelArr = labelStr.split(",");
    var valueArr = valueStr.split(",");
    var iLen = valueArr.length;
    for(var i=0;i<iLen;i++)
    {
        selectionObj.length++;
        selectionObj.options[i].text = labelArr[i];
        selectionObj.options[i].value = valueArr[i];
    }
}

//5-4. 功能：限制选择框的输入值(只能选择一项)。
function moveIn()
{
	event.srcElement.setLength(0);
}
//5-5. 功能：设置值列表允许的长度
function changeValueListLength()
{
    var oTarget = operatorList.getObject();
    if(operatorList.getObject()==null || oTarget.selectedIndex==-1) {return;}//刚刚初始化时，返回。
    var operatorLength = operatorLengthObj[oTarget.options[oTarget.selectedIndex].value];//限制的长度
    var inputType = inputTypeObj[attributeName][1];
    if(inputType==1)
    {
        var oTarget = valueList1Target.getObject();
        valueList1Target.detachEvent("onMoveOptionIn", moveIn);
        if(operatorLength==1)
        {
            valueList1MultipleAddBtn.style.display = "none";
            valueList1MultipleDelBtn.style.display = "none";
            valueList1Target.attachEvent("onMoveOptionIn", moveIn);
            if(oTarget.length>1) {oTarget.length=1;}
        }else
        {
            valueList1MultipleAddBtn.style.display = "";
            valueList1MultipleDelBtn.style.display = "";
        }
    }
    else if(inputType==2)
    {
        if(operatorLength==1 && valueList2Selection.length>1) {valueList2Selection.length=1;}
    }
    else if(inputType==3)
    {
        var oTarget = valueList3Target.getObject();
        valueList3Target.detachEvent("onMoveOptionIn", moveIn);
        if(operatorLength==1)
        {
            valueList3Target.attachEvent("onMoveOptionIn", moveIn);
            if(oTarget.length>1) {oTarget.length=1;}
        }
    }
    else if(inputType==5)
    {
        if(operatorLength==1 && KPI_LIST.length>1)
        {
            KPI_LIST.length=1;
        }
    }
    else if(inputType==6)
    {
    	var oTarget = valueList6Target.getObject();
        valueList6Target.detachEvent("onMoveOptionIn", moveIn);
        if(operatorLength==1)
        {
            valueList6Target.attachEvent("onMoveOptionIn", moveIn);
            if(oTarget.length>1) {oTarget.length=1;}
        }
    }
}
//5-6. 功能：值列表2的维护操作
function showValueList2Option()
{
    //(1). 赋值
    valueList2Text.value = valueList2Selection.value;
    //(2). 显示按钮
    addValueList2Button.style.display = "none";
    updateValueList2Button.style.display = "";
    deleteValueList2Button.style.display = "";
}
function updateValueList2()
{
    //(1). 清除数据的前后空格
    valueList2Text.value = valueList2Text.value.trimall();
    if(valueList2Text.value.length==0) {return;}
    if(valueList2Selection.selectedIndex==-1) {return;}
    //(2). 更新，并清除数据
    valueList2Selection.options[valueList2Selection.selectedIndex].value = valueList2Text.value;
    valueList2Selection.options[valueList2Selection.selectedIndex].text = valueList2Text.value;
    clearValueList2();
}
function addValueList2()
{
    //(1). 清除数据的前后空格
    valueList2Text.value = valueList2Text.value.trimall();
    if(valueList2Text.value.length==0) {return;}
    //(2). 判断长度
    var oTarget = operatorList.getObject();
    var operatorLength = operatorLengthObj[oTarget.options[oTarget.selectedIndex].value];//限制长度
    if(operatorLength==1 && valueList2Selection.length==1) {MMsg("对不起，\"关系操作符\"只允许输入一个值！");return;}
    //(3). 添加，并清空数据
    valueList2Selection.length++;
    valueList2Selection.options[valueList2Selection.length-1].text = valueList2Text.value;
    valueList2Selection.options[valueList2Selection.length-1].value = valueList2Text.value;
    clearValueList2();
}
function clearValueList2()
{
    //(1). 清除数据
    valueList2Text.value = "";
    //(2). 清除选中项
    valueList2Selection.selectedIndex = -1;
    updateValueList2Button.style.display = "none";
    addValueList2Button.style.display = "";
    deleteValueList2Button.style.display = "none";
}
function deleteValueList2()
{
    valueList2Selection.options.remove(valueList2Selection.selectedIndex);
    clearValueList2();
}
//5-7. 功能：值列表3的维护操作
function addSelectionFromTree(treeObj, selection)
{
    //(1). 过滤
    var oItem = treeObj.getSelectedItem();
    if(attributeName==NE_TYPE)//如果是网元类型，则只过滤根节点
    {
        var rootElementId = getRootElementByTree(treeObj).getAttribute("id");
        if(oItem.getAttribute("id")==rootElementId) {MMsg("对不起，该值不属于网元类型！");return;}
    }
    else if(attributeName==NEID)//如果是网元，则只取(2,6)节点
    {
        if(oItem.getAttribute("NE_FLAG")!="2" && oItem.getAttribute("NE_FLAG")!="6") {MMsg("对不起，该值为虚拟网元！");return;}
    }
    //(2). 构造
    var oOption = document.createElement("OPTION");
    oOption.text = oItem.firstChild.nodeValue;
    oOption.value = oItem.getAttribute("id");
    //(3). 添加
    var oTarget = selection.getObject();
    oTarget.parentElement.fireMoveOptionIn(oOption);
    var i=0;
    for(i=0;i<oTarget.options.length && !isSame(oOption,oTarget.options[i]);i++);
    if(i==oTarget.options.length){oTarget.add(oOption);}
}
function isSame(oOption1,oOption2)
{
    return (oOption1.text==oOption2.text && oOption1.value==oOption2.value);
}
//5-8. 功能：值列表5的输入控制
function settingValueList5()
{
	if(ruleTypeId==1)
		selectsubmitKPI(null,"40");
	else{
		
    	selectsubmitKPI(null,"20");
    }
    var oTarget = operatorList.getObject();
    var operatorLength = operatorLengthObj[oTarget.options[oTarget.selectedIndex].value];//限制长度
    if(operatorLength==1 && KPI_LIST.length>1)
    {
        MMsg("对不起，\"关系操作符\"只允许输入一个值！");
        KPI_LIST.length = 1;
    }
    
}
//---------------------------------------------------------------------
//----------6。公用函数----------------------------------------------------
//---------------------------------------------------------------------
//6-1. 功能：限制输入数值,并且判断在规定的范围内
//     输入：(1).键盘的键值
//     输出：true/false
function inputNumber(keyCode)
{
    if( keyCode>47 && keyCode<58 )//(数值在0~9)
    {
          if( (event.srcElement.id=='valueList4Hour') )
          {
              if((event.srcElement.value*10 + keyCode -48)>23) {return false;}
          }
          else if( (event.srcElement.id=='valueList4Minute') )
          {
              if((event.srcElement.value*10 + keyCode -48)>59) {return false;}
          }
          else if( (event.srcElement.id=='valueList4Second') )
          {
              if((event.srcElement.value*10 + keyCode -48)>59) {return false;}
          }
          return true;
    }
    else if( (keyCode==8) || (keyCode==46) )//(Backspace键)||(Delete键)
    {
          return true;
    }
    else
    {
          return false;
    }
}
//6-2. 功能：将"日期时间"分解到"日期、时、分、秒"对象
//     输入：(1).日期时间(yyyy-mm-dd hh:mm:ss), (2).日期对象, (3).小时对象, (4).分钟对象, (5).秒对象
//     输出：(无)
function settingDateTime(dateTimeValue, dateObj, hourObj, minuteObj, secondObj)
{
	if(dateTimeValue!=null && typeof dateTimeValue!="undefined" && dateTimeValue.length==14)
    {
        dateObj.value = dateTimeValue.substring(0, 4)+"-"+dateTimeValue.substring(4, 6)+"-"+dateTimeValue.substring(6, 8);
        hourObj.value = dateTimeValue.substring(8, 10);
        minuteObj.value = dateTimeValue.substring(10, 12);
        secondObj.value = dateTimeValue.substring(12, 14);
    }else
    {
        dateObj.value = "";
        hourObj.value = "";
        minuteObj.value = "";
        secondObj.value = "";
    }
}
//6-3. 功能：从"下拉框"中获取数据
//     输入：(1).下拉框对象, (2).显示数组, (3).值数组
//     输出：(无)
function getDataFromSelection(oSelection, labelArr, valueArr)
{
    if(oSelection==null || typeof oSelection=="undefined") return;
    var oItem;
    for(var i=0;i<oSelection.length;i++)
    {
        oItem = oSelection.options[i];
        labelArr[i] = oItem.text;
        valueArr[i] = oItem.value;
    }
}
//6-4. 功能：将"日期、时、分、秒"对象组合为"日期时间"
//     输入：(1).日期对象, (2).小时对象, (3).分钟对象, (4).秒对象
//     输出：日期时间(yyyy-mm-dd hh:mm:ss)
function getDateTime(dateObj, hourObj, minuteObj, secondObj)
{
	var sDate=dateObj.value;
	if(sDate!=null && sDate!="")
	{
		sDate=sDate.substring(0,4)+sDate.substring(5,7)+sDate.substring(8,10);
	}
    return sDate+
           formatTime(hourObj.value)+formatTime(minuteObj.value)+formatTime(secondObj.value);
}
function formatTime(inputStr)
{
    if(inputStr.length==0) {return "00";}
    else if(inputStr.length==1) {return "0"+inputStr;}
    return inputStr;
}
//6-5. 功能：定位本节点,进行判断，并获得neTypeIds
function getTreeNeTypeIds()
{
    var neTypeIdObject = new Object();//"包含的网元类型"和"不包含的网元类型"
    neTypeIdObject.neTypeIds = "";
    neTypeIdObject.nonNeTypeIds = "";
    if(currentTree==null) return neTypeIdObject;
    
    var oItem = currentTree.getSelectedItem();
    var attributeNameEn = oItem.getAttribute("AttrId");
    var rootElementId = getRootElementByTree(currentTree).getAttribute("id");
    var value = oItem.getAttribute("Value");
    var relationNode;
    //(1). "根"节点 ==> 返回
    if(oItem.getAttribute("id")==rootElementId)
    {
        return neTypeIdObject;
    }
    //(2). "属性"节点 ==> 更新操作 ==> 同级节点中的网元类型Ids
    else if(attributeNameEn!=null && typeof attributeNameEn!="undefined")
    {
        relationNode = currentDom.selectSingleNode("//MenuItem[@id='"+oItem.getAttribute("id")+"']");
        relationNode = relationNode.parentNode;
    }
    //(3). "与"节点 ==> 添加操作 ==> 直属子节点中的网元类型Ids
    else if(value=="And")
    {
        relationNode = currentDom.selectSingleNode("//MenuItem[@id='"+oItem.getAttribute("id")+"']");
    }
    //(4). 其他关系节点
    else
    {
        return neTypeIdObject;
    }
    var neTypeIds = "";
    var nonNeTypeIds = "";
    var matchTag = "";
    var childNodes = relationNode.selectNodes("MenuItem[@AttrId='"+NE_TYPE+"']");
    for(var i=0;i<childNodes.length;i++)
    {
        matchTag = childNodes[i].getAttribute("MatchTag");
        if(matchTag.indexOf("Not")!=-1)
        {
            nonNeTypeIds += childNodes[i].getAttribute("Value")+",";
        }else
        {
            neTypeIds += childNodes[i].getAttribute("Value")+",";
        }
    }
    if(neTypeIds.length==0 && nonNeTypeIds.length==0)
    {
        return neTypeIdObject;
    }
    else
    {
        if(neTypeIds.length>0)
        {
            neTypeIds = neTypeIds.substring(0, neTypeIds.length-1);
        }
        if(nonNeTypeIds.length>0)
        {
            nonNeTypeIds = nonNeTypeIds.substring(0, nonNeTypeIds.length-1);
        }
    }
    neTypeIdObject.neTypeIds = neTypeIds;
    neTypeIdObject.nonNeTypeIds = nonNeTypeIds;
    return neTypeIdObject;
}
//6-6. 验证时间
var oldTimeValue=0;
function checkTime(timeObj, timeName, limit)
{
    if(timeObj.value>limit)
    {
        MMsg("对不起，\""+timeName+"\"不能大于"+limit+"！");
        timeObj.value = oldTimeValue;
    }
}
//---------------------------------------------------------------------
//----------7。提示信息----------------------------------------------------
//---------------------------------------------------------------------
document.writeln("<style>.tipdiv {z-index:3;font-family:verdana, arial, helvetica; font-size:12px; color:black; background-color:lightyellow; border:black 1px solid; padding:1px;}</style>");
document.writeln("<div id=popTip class=tipdiv style='position:absolute;display:none;' onmouseout='hideSelf(this, event)'></div>");

var popup_tip = null;

function getPos(el,sProp) {
	var iPos = 0;
	while (el!=null) {
		iPos+=el["offset" + sProp];
		el = el.offsetParent;
	}
	return iPos;
}

function showTip2(el, popObj, tipstr) {	
	if (tipstr.length > 1) {
		if (popObj) {
			popObj.style.display='';
			popObj.style.left = getPos(el,"Left") + el.offsetWidth;
			popObj.style.top = getPos(el,"Top") + el.offsetHeight;
			if (popObj.innerHTML.length<1) {
				popObj.innerHTML = tipstr;
			}
		}
	}
	if ((popObj!=popup_tip) && (popup_tip)) popup_tip.style.display = 'none';
	popup_tip = popObj;

}
function showVarMenu(varMenu,oButton)
{
    event.cancelBubble=true;
    var iLeft=window.screenLeft+oButton.getBoundingClientRect().left;
    var iBottom=window.screenTop+oButton.getBoundingClientRect().bottom;
    varMenu.show(null,null,iLeft,iBottom);
}

function hideTip(el, popObj, e) {
	var cx, cy;
	if (!e) {
		cx = window.event.x;
		cy = window.event.y;
	} else {
		cx = e.clientX;
		cy = e.clientY;
	}

	if (el && popObj && popObj.style.display=='') {
		if ((document.body.scrollLeft + cx > el.offsetLeft) 
				&& (document.body.scrollLeft + cx < el.offsetLeft + el.offsetWidth) 
				&& (document.body.scrollTop + cy > el.offsetTop) 
				&& (document.body.scrollTop + cy < el.offsetTop + el.offsetHeight)
				|| (document.body.scrollLeft + cx > popObj.offsetLeft)                
				&& (document.body.scrollLeft + cx < popObj.offsetLeft + popObj.offsetWidth) 
				&& (document.body.scrollTop + cy > popObj.offsetTop)
				&& (document.body.scrollTop + cy < popObj.offsetTop + popObj.offsetHeight)) {
		} else {
			popObj.style.display = 'none';
			popObj.innerHTML = "";
		}
	}
}


//添加网元项
function AddNeItem()
{
	//传入的网元ID和网元名称
	var neIdValue;
	var neIdLabel;
    var arrayUrl=getURLSearch();
	if(arrayUrl!=null){
		neIdValue=arrayUrl.neIdValue;
		neIdLabel=arrayUrl.neIdLabel;
	}
	if(neIdValue == null || typeof neIdValue == 'undefined' || neIdValue=='undefined')
	{
		return;
	}
    if(ruleTree==null) {return;}
    var labelArr = new Array();
    var valueArr = new Array();
    var oTarget;
	labelArr[0]=neIdLabel;
	valueArr[0]=neIdValue;

    var oItem = currentTree.getSelectedItem();
    oTarget = operatorList.getObject();
    var matchTag = oTarget.options[oTarget.selectedIndex].value
    label = inputTypeObj[attributeName][2]+
            " "+oTarget.options[oTarget.selectedIndex].text+
            " "+labelArr.join(",");
    if(isUpdate)
    {
        //(2). 更新显示元素
        oItem.setAttribute("AttrId", attributeName);
        oItem.setAttribute("MatchTag", matchTag);
        oItem.setAttribute("Value", valueArr.join(","));
        oItem.innerHTML = label;
        //(3). 修改DOM
        var selectedNode = currentDom.selectSingleNode("//MenuItem[@id='"+oItem.getAttribute("id")+"']");
        selectedNode.setAttribute("AttrId", attributeName);
        selectedNode.setAttribute("MatchTag", matchTag);
        selectedNode.setAttribute("label", label);
        selectedNode.setAttribute("Value", valueArr.join(","));
    }
    else
    {
        //(2). 判断：树的当前位置是否可以添加属性节点。
        //currentTree currentDom currentTreeDiv
        var id = document.uniqueID;
        var selectedNode = currentDom.selectSingleNode("//MenuItem[@id='"+oItem.getAttribute("id")+"']");
        var rootElementId = getRootElement(currentTreeDiv).getAttribute("id");
        if(oItem.getAttribute("id")==rootElementId)//(1). 根节点
        {
            var childNodes = selectedNode.hasChildNodes();
            if(childNodes) {MMsg("对不起，根节点只能存在一个属性节点！");return;}
            //MMsg("对不起，根节点下不能直接添加属性节点！");return;
        }
        var attrIdAttribute = oItem.getAttribute("AttrId");
        if(attrIdAttribute!=null && typeof attrIdAttribute!="undefined")//(2). 属性节点
        {
            MMsg("对不起，不能属性节点添加子节点！");return;
        }
        if(oItem.getAttribute("Value")=="Not")
        {
            var childNodes = selectedNode.hasChildNodes();
            if(childNodes) {MMsg("对不起，\"非节点\"只能存在一个子节点！");return;}
        }
        //(3). 添加界面元素
        var addNameArr = new Array();
        var addValueArr = new Array();
        addNameArr.push("AttrId");
        addValueArr.push(attributeName);
        addNameArr.push("AttrType");
        addValueArr.push(inputTypeObj[attributeName][3]);
        addNameArr.push("MatchTag");
        addValueArr.push(matchTag);
        addNameArr.push("Value");
        addValueArr.push(valueArr.join(","));
        currentTree.add(id, label, addNameArr, addValueArr, false);
        //(4). 添加DOM
        var addDoc = currentTree._createAddDoc(id, label, addNameArr, addValueArr);
        selectedNode.appendChild(addDoc.selectSingleNode("/root/Menu/MenuItem"));

		return id;
    }
}
