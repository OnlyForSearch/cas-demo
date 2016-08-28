var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var callbackFn;
var formId = 20002; //修改

function RelaAdd(grid)
{	
    callbackFn = refresh.callback([grid]);
    window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formId,
                            window,"dialogWidth:1000px;dialogHeight:720px");
}

function RelaModify(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	callbackFn = refresh.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{	
		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formId +"&requestId=" + row.get("REQUEST_ID"),
                                window,"dialogWidth:1000px;dialogHeight:720px");
	}
	else
	{
		MMsg("请选择一项！");
		return;
	}
}

function ViewDetail(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	callbackFn = refresh.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{	
		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&isEdit=0&formId=" + formId +"&requestId=" + row.get("REQUEST_ID"),
                                window,"dialogWidth:1000px;dialogHeight:720px");
	}
	else
	{
		MMsg("请选择一项！");
		return;
	}
}

function RelaDelete(grid)
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
  			var delByClassIdUrl="../../../servlet/formDispatch?OperType=15&formId=" + formId + "&requestId=" + sRequestId;
		    xmlhttp.Open("POST",delByClassIdUrl,false);
		    xmlhttp.send();
		    if(isSuccess(xmlhttp))
		    {
		        MMsg("删除成功！");
		        grid.search();
		    }
  		}
	}
	else
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