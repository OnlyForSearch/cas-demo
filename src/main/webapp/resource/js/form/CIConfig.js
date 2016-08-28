var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var Url = "../../../servlet/CmdbServlet?";
var callbackFn;


//新增站点、机房、机架
function CIConfigAdd(grid)
{
	callbackFn = refresh.callback([grid]);
	window.showModalDialog("/workshop/form/index.jsp?formId="+formId+"&callback=window.dialogArguments.callbackFn()",window,"dialogWidth:"+dWidth+";dialogHeight:"+dHeigth+";center:no;help:no;resizable:no;status:no");	
}

//修改站点、机房、机架
function CIConfigModify(grid)
{	
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	callbackFn = refresh.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row){
		window.showModalDialog("/workshop/form/index.jsp?formId="+formId+"&requestId="+row.get("REQUEST_ID")+"&callback=window.dialogArguments.callbackFn()",window,"dialogWidth:"+dWidth+";dialogHeight:"+dHeigth+";center:no;help:no;resizable:no;status:no");
	}else
	{
		MMsg("请选择一项！");
		return;
	}	
}


//删除站点、机房、机架
function CIConfigDelete(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
  		if(QMsg("确认删除所选择记录？")==MSG_YES)
  		{
  			var sRequestId=row.get("REQUEST_ID");
  			var delUrl="../../../servlet/formDispatch?OperType=15&formId="+formId+"&requestId="+sRequestId
  			//alert(delUrl)
		    xmlhttp.Open("POST",delUrl,false);
		    xmlhttp.send();
		    if(isSuccess(xmlhttp))
		    {
		        MMsg("删除成功！");
		        grid.search();
		    } 
  		}
	}else
	{
		MMsg("请选择一项！");
		return;
	}
}

function search(grid, btn)
{
	grid.showParamWin(btn.el)
}

function refresh(grid)
{
	grid.search();
}

function isSameNameExit(inName,tableName,colName,keyColumn,keyValue,oper)
{
	xmlhttp.Open("POST",Url+"tag=9&tableName="+tableName+"&colName="+colName+"&inName="+encodeURIComponent(inName)+"&keyColumn="+keyColumn+"&keyValue="+keyValue+"&oper="+oper,false);
	xmlhttp.send();
	var b=xmlhttp.responseText;
	if(b=="true"){
		MMsg("已存在同名的记录，请重新命名！");
		return true;
	}
	else {
		return false;
	}
}