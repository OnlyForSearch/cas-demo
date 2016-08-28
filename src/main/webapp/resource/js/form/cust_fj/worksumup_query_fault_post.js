var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var callbackFn;
var formId = 590000000062; //这里需要在生成新的seq后手动修改
var arrStaff=new Array(2701,2740,2742,712019,2721,2728,2744,2735,716003,71063,10616,10520);

function isManager(staffId)
{
	for(var i=0;i<12;i++)
	{
		if(arrStaff[i]==staffId)
			return true;
	}
	return false;
}

function RelaAdd(grid)
{
	if(!isHb())
		return false;
    callbackFn = refresh.callback([grid]);
    window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formId,
                            window,
                            "dialogWidth:800px;dialogHeight:600px;center:no;help:no;resizable:no;status:no");
}


function RelaModify(grid)
{
	if(!isHb())
		return false;
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	callbackFn = refresh.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{	
		/*var currStaffId=getCurrentStaffId();
		if(row.get("SUBMIT_STAFF_ID")!=currStaffId && !isManager(currStaffId))
		{
			MMsg("这条记录的值班人不是当前用户，您没有权限编辑!");
			return;
		}*/
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
		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&isEdit=0&formId=" + formId +"&requestId="+row.get("REQUEST_ID"),
                                window,
                                "dialogWidth:800px;dialogHeight:600px;center:no;help:no;resizable:no;status:no");
	}
	else
	{
		MMsg("请选择一项！");
		return;
	}
}

function getCurrentOrgId()
{
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", "/servlet/util?OperType=6", false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP))
	{
		return oXMLHTTP.responseXML.selectSingleNode("/root/org_id").text;
	}
}

//取得当前登陆员工ID
function getCurrentStaffId()
{
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", "/servlet/util?OperType=6", false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP))
	{
		return oXMLHTTP.responseXML.selectSingleNode("/root/staff_id").text;
	}
}

function RelaDelete(grid)
{
	if(!isHb())
		return false;
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
		var currStaffId=getCurrentStaffId();
		/*if(row.get("SUBMIT_STAFF_ID")!=currStaffId && !isManager(currStaffId))
		{
			MMsg("这条记录的值班人不是当前用户，您没有权限删除!");
			return;
		}*/
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

function isHb()
{
	var orgId=getCurrentOrgId();
	if(orgId==62 || orgId==63 || orgId==107 )
	{
		return true;
	}
	else
	{
		EMsg("您不是省中心或武汉市用户,没有修改权限!");
		return false;
	}
}
