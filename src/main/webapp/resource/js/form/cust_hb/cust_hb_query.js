var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var callbackFn;
var formId = 270000000001; //这里需要在生成新的seq后手动修改

function RelaAdd(grid)
{
    callbackFn = refresh.callback([grid]);
    window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formId,
                            window,
                            "dialogWidth:800px;dialogHeight:600px;center:no;help:no;resizable:no;status:no");
}
//
function RelaModify(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	callbackFn = refresh.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{	/*
		if(row.get("SUBMIT_STAFF_ID")!=getCurrentStaffId())
		{
			MMsg("这条记录的值班人不是当前用户，您没有权限编辑!");
			return;
		}
		*/
		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formId +"&requestId="+row.get("REQUEST_ID"),
                                window,
                                "dialogWidth:800px;dialogHeight:600px;center:no;help:no;resizable:no;status:no");
	}
	else
	{
		MMsg("请选择一项！");
		return;
	}
}
//
function RelaDelete(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
		//alert(row.get("SUBMIT_STAFF_ID"));
		//alert(getCurrentStaffId());
		//判断当前用户是否是表单中的值班人
		if(row.get("SUBMIT_STAFF_ID")!=getCurrentStaffId())
		{
			MMsg("这条记录的值班人不是当前用户，您没有权限删除!");
			return;
		}
  		if(QMsg("确认删除所选择记录？")==MSG_YES)
  		{
  			var sRequestId=row.get("REQUEST_ID");
  			var delByClassIdUrl="../../../servlet/formDispatch?OperType=15&formId=" + formId + "&requestId="+sRequestId;
  			//alert(delByClassIdUrl)
		    xmlhttp.Open("POST",delByClassIdUrl,false);
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
