var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var callbackFn;
var formId = 590000000682; 

function RelaAdd(grid)
{	
    callbackFn = refresh.callback([grid]);
    window.showModalDialog("/workshop/form/index.html?callback=window.dialogArguments.callbackFn()&formId=" + formId,
                            window,
                           "dialogWidth:850px;dialogHeight:450px;center:no;help:no;resizable:no;status:no");
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
		//获取IP资源标识
		var ipmgrId = row.get("IPMGR_ID");
		//获取请求标识(主键)
		var requestId = row.get("REQUEST_ID");
		window.showModalDialog("/workshop/form/index.html?callback=window.dialogArguments.callbackFn()&formId=" + formId +"&requestId=" + requestId,
                                window,
                                "dialogWidth:850px;dialogHeight:450px;center:no;help:no;resizable:no;status:no");
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
  			//获取请求标识
  			var sRequestId=row.get("REQUEST_ID");
  			//获取IP资源标识(主键)
  			var sIpmgrId=row.get("IPMGR_ID");
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