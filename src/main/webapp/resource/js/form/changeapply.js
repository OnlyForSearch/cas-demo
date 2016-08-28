var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var callbackFn;
var formId = 20001; 

function RelaAdd(grid)
{	
    callbackFn = refresh.callback([grid]);
    window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formId,
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
		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formId +"&requestId=" + row.get("REQUEST_ID"),
                                window,
                                "dialogWidth:850px;dialogHeight:450px;center:no;help:no;resizable:no;status:no");
	}
	else
	{
		MMsg("��ѡ��һ�");
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
                                window,
                                "dialogWidth:850px;dialogHeight:600px;center:no;help:no;resizable:no;status:no");
	}
	else
	{
		MMsg("��ѡ��һ�");
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
  		if(QMsg("ȷ��ɾ����ѡ���¼��")==MSG_YES)
  		{
  			var sRequestId=row.get("REQUEST_ID");
  			var delByClassIdUrl="../../../servlet/formDispatch?OperType=15&formId=" + formId + "&requestId=" + sRequestId;
		    xmlhttp.Open("POST",delByClassIdUrl,false);
		    xmlhttp.send();
		    if(isSuccess(xmlhttp))
		    {
		        MMsg("ɾ���ɹ���");
		        grid.search();
		    }
  		}
	}
	else
	{
		MMsg("��ѡ��һ�");
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