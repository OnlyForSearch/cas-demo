//引入新菜单功能  
$import('resource/js/newMenu_ITSM.js');
//document.write('<link rel="stylesheet" href="resource/css/newMenu_ITSM.css" type="text/css" />');

/*tabpanel : 全局TabPanel,来自页面workshop/query/queryTemplate/mainFrame.html*/
function getSingleGrid(){
	//获取列表对象
	var tab = tabpanel.getActiveTab();
	var grid;
	tab.getFrameWindow().Global.mainPanel.items.each(function(item){
		if(item.isPage){
			grid = item;
		}
	});
	return grid;
}
function getToolBarSingleGrid(){
	//获取列表对象
	var tab = parent.tabpanel.getActiveTab();
	var grid;
	tab.getFrameWindow().Global.mainPanel.items.each(function(item){
		if(item.isPage){
			grid = item;
		}
	});
	return grid;
}
function refresh(){
	var grid = getSingleGrid();
	//操作代码
	if(grid)
	{
		grid.store.reload();
	}
}

function createFlow()
{
	
	var strSearch =document.getElementsByTagName("IFRAME")[0].contentWindow.location.href;
	
	var reg1 = /=/gi;
	var reg2 = /&/gi;
	strSearch = strSearch.substr(1, strSearch.length);
	strSearch = strSearch.replace(reg1, '":"');
	strSearch = strSearch.replace(reg2, '","');
	if (strSearch == "")
		return null;
	else
		strSearch = '{"' + strSearch + '"}';
	eval("var ArrayUrl=" + strSearch);
	
//	var arrayUrl=getURLSearch();
//	alert(document.getElementsByTagName("IFRAME").length);
//	alert(document.getElementsByTagName("IFRAME")[0].contentWindow.location.href); 
	var flow_mod = ArrayUrl.flow_mod;
	var taskClass = ArrayUrl.taskClass;
	
    var x=(window.screen.width-780)/2;
    var y=(window.screen.height-560)/2;
    var url = "/workshop/form/index.jsp?flowMod="+flow_mod+"&taskClass="+taskClass;
    curr_window=window.open(url,'','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');

    //curr_window=window.open(url,'','scrollbars=yes,width=780,height=560,top='+y+',left='+x+',resizable=yes');
}

function exportExcel()
{
	var grid = getSingleGrid();
	var result = grid.result;
	var oSend = result.buildSendXml(grid.oParam,{comp:tabpanel.getActiveTab().getFrameWindow().Global.mainPanel.paramByToolbar});
	var field = oSend.createElement('fields');
	var cm = grid.getColumnModel();
	for (var i = 0, len = cm.getColumnCount(), f; i < len; i++)
	{
		if (!cm.isHidden(i))
		{
			var name = cm.getDataIndex(i);
			if (name)
			{
				f = oSend.createElement('field');
				f.setAttribute("name", name);
				f.text = cm.getColumnHeader(i);
				field.appendChild(f);
			}
		}
	}
	oSend.documentElement.appendChild(field);
	var excelForm = document.getElementById("exportExcelForm");
	excelForm.param.value = oSend.xml;
	excelForm.submit();
}
//通过show_result.html模板发派发单
function dispatchByShowResult(){
	var url=getUrlParam();
	var grid = Global.grid;
	var len=grid.getSelectionModel().selections.items.length;
    if(len<1){
    	alert('请选择要派发的记录');
        return;
    }
    var param= new Array();
    param.push(grid);
    param.push(url.result);
	window.showModalDialog("/workshop/form/jtitsmFormFile/auto_placing.jsp",param,"dialogWidth=60;dialogHeight=30;help=0;scroll=0;s tatus=0;");
}
//查询show_result模板使用
function searchShowResult()
{
	var grid = Global.grid;
	grid.showParamWin(grid.el)
}
//刷新show_resulut使用
function refreshShowResult()
{
	var grid = Global.grid;
	if(grid)
	{
		grid.store.reload();
	}
}
//导出show_resulut使用
function exportExcelShowResult()
{
	var grid = Global.grid;
	var result = grid.result
	var oSend = result.buildSendXml(result.oParam);
	var field = oSend.createElement('fields');
	var cm = grid.getColumnModel();
	for (var i = 0, len = cm.getColumnCount(), f; i < len; i++)
	{
		if (!cm.isHidden(i))
		{
			var name = cm.getDataIndex(i);
			if (name)
			{
				f = oSend.createElement('field');
				f.setAttribute("name", name);
				f.text = cm.getColumnHeader(i);
				field.appendChild(f);
			}
		}
	}
	oSend.documentElement.appendChild(field);
	var form = document.getElementById("exportExcelForm");
	form.param.value = oSend.xml;
	form.submit();
}
//通过TemplateGrid.html模板发派发单只能配置在全局面板按钮上
function dispatchTemplateInGlobalTooBar(){
	var tab = tabpanel.getActiveTab();
	var strSearch =tab.replaceSrc;
	var reg1 = /=/gi;
	var reg2 = /&/gi;
	strSearch = strSearch.substr(1, strSearch.length);
	strSearch = strSearch.replace(reg1, '":"');
	strSearch = strSearch.replace(reg2, '","');
	if (strSearch == "")
		return null;
	else
		strSearch = '{"' + strSearch + '"}';
	eval("var ArrayUrl=" + strSearch);
	var grid = getSingleGrid();
	var len=grid.getSelectionModel().selections.items.length;
    if(len<1){
    	alert('请选择要派发的记录');
        return;
    }
    var param= new Array();
    param.push(grid);
    param.push(ArrayUrl.grid);
	window.showModalDialog("/workshop/form/jtitsmFormFile/auto_placing.jsp",param,"dialogWidth=60;dialogHeight=35;help=0;scroll=yes;status=0;");
}
//通过TemplateGrid.html模板发派发单
function dispatchTemplateMenuInTooBar(){
	var tab = parent.tabpanel.getActiveTab();
	var strSearch =tab.replaceSrc;
	var reg1 = /=/gi;
	var reg2 = /&/gi;
	strSearch = strSearch.substr(1, strSearch.length);
	strSearch = strSearch.replace(reg1, '":"');
	strSearch = strSearch.replace(reg2, '","');
	if (strSearch == "")
		return null;
	else
		strSearch = '{"' + strSearch + '"}';
	eval("var ArrayUrl=" + strSearch);
	var grid = getToolBarSingleGrid();
	var len=grid.getSelectionModel().selections.items.length;
    if(len<1){
    	alert('请选择要派发的记录');
        return;
    }
    var param= new Array();
    param.push(grid);
    param.push(ArrayUrl.grid);
	window.showModalDialog("/workshop/form/jtitsmFormFile/auto_placing.jsp",param,"dialogWidth=60;dialogHeight=35;help=0;scroll=yes;status=0;");
}
//导出通过TemplateGrid.html模板发派发单只能配置在全局面板按钮上
function exportExcelTemplateInMenuInTooBar()
{
	var grid = getToolBarSingleGrid();
	var result = grid.result
	var oSend = result.buildSendXml(result.oParam);
	var field = oSend.createElement('fields');
	var cm = grid.getColumnModel();
	for (var i = 0, len = cm.getColumnCount(), f; i < len; i++)
	{
		if (!cm.isHidden(i))
		{
			var name = cm.getDataIndex(i);
			if (name)
			{
				f = oSend.createElement('field');
				f.setAttribute("name", name);
				f.text = cm.getColumnHeader(i);
				field.appendChild(f);
			}
		}
	}
	oSend.documentElement.appendChild(field);
	var form = document.getElementById("exportExcelForm");
	form.param.value = oSend.xml;
	form.submit();
}
