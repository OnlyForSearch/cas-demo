var formId=10141;

function add(grid)
{
	  callbackFn = refresh.callback([grid]);
    window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formId,
                            window,
                            "dialogWidth:1024px;dialogHeight:768px;center:no;help:no;resizable:no;status:no");
}

function edit(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	callbackFn = refresh.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{	
		if (row.get("AUDIT_STATE") != "" && row.get("AUDIT_STATE") != "AUDIT_NORMAL") {
			MMsg("该记录审核中或者已审核，不能修改");
			return;
		}


		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formId +"&requestId="+row.get("REQUEST_ID"),
                                window,
                                "dialogWidth:1024px;dialogHeight:768px;center:no;help:no;resizable:no;status:no");
	}
	else
	{
		MMsg("请选择一项！");
		return;
	}
}

function del(grid)
{
	
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{  
		if (row.get("AUDIT_STATE") != "" && row.get("AUDIT_STATE") != "AUDIT_NORMAL") {
			MMsg("该记录审核中或者已审核，不能删除");
			return;
		}

  		if(QMsg("确认删除所选择记录？")==MSG_YES)
  		{
  			var sRequestId=row.get("REQUEST_ID");
  			var delByClassIdUrl="../../../servlet/formDispatch?OperType=15&formId=" + formId + "&requestId="+sRequestId;
		    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
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
function reFresh()
{
	Global.grid.search();
}

setInterval(reFresh, 30000);


function flowStart(grid) {
	if(!grid || (typeof grid.getSelectionModel != 'function')) {
		grid = this;
	}
	callbackFn = refresh.callback([grid]);
	
	var rows = grid.getSelectionModel().getSelections();
	if (rows.length == 0) {
		MMsg("请选择要启动审批流程的记录！");
		return;
	}

	var ids = "";
	var sp = "";
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		if (row.get("AUDIT_STATE") != "" && row.get("AUDIT_STATE") != "AUDIT_NORMAL") {
			MMsg("所选择记录中含审核中或者已审核的，不能启动申批流程");
			return;
		}


		ids += sp + row.get("TF_QUES_RECORD_LIST_ID");
		sp = ",";
	}

	window.showModalDialog($getSysVar('CUST_TF_QUES_FLOW') + "&quesDataIds=" + ids,
                           window,
                           "dialogWidth:1024px;dialogHeight:768px;center:no;help:no;resizable:no;status:no");
	
	/*
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{	
		window.showModalDialog($getSysVar('CUST_TF_QUES_FLOW')+"&quesId="+row.get("REQUEST_ID"),
                                window,
                                "dialogWidth:1024px;dialogHeight:768px;center:no;help:no;resizable:no;status:no");
	}
	else
	{
		MMsg("请选择一项！");
		return;
	}
	*/
}
var exportArg;
function toWord()
{
	exportArg = '导出Word';
	window.open("/workshop/evaluation/custJTQuesWord.html",'导出Word',"dialogWidth:1024px;dialogHeight:768px;center:no;help:no;resizable:no;status:no");
}

function toPDF(){
	exportArg = '导出Pdf';
	window.open("/workshop/evaluation/custJTQuesWord.html",'导出Pdf',"dialogWidth:1024px;dialogHeight:768px;center:no;help:no;resizable:no;status:no");
}
