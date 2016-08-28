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
			MMsg("�ü�¼����л�������ˣ������޸�");
			return;
		}


		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formId +"&requestId="+row.get("REQUEST_ID"),
                                window,
                                "dialogWidth:1024px;dialogHeight:768px;center:no;help:no;resizable:no;status:no");
	}
	else
	{
		MMsg("��ѡ��һ�");
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
			MMsg("�ü�¼����л�������ˣ�����ɾ��");
			return;
		}

  		if(QMsg("ȷ��ɾ����ѡ���¼��")==MSG_YES)
  		{
  			var sRequestId=row.get("REQUEST_ID");
  			var delByClassIdUrl="../../../servlet/formDispatch?OperType=15&formId=" + formId + "&requestId="+sRequestId;
		    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		    xmlhttp.Open("POST",delByClassIdUrl,false);
		    xmlhttp.send();
		    if(isSuccess(xmlhttp))
		    {
		        MMsg("ɾ���ɹ���");
		        grid.search();
		    }
  		}
	}else
	{
		MMsg("��ѡ��һ�");
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
		MMsg("��ѡ��Ҫ�����������̵ļ�¼��");
		return;
	}

	var ids = "";
	var sp = "";
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		if (row.get("AUDIT_STATE") != "" && row.get("AUDIT_STATE") != "AUDIT_NORMAL") {
			MMsg("��ѡ���¼�к�����л�������˵ģ�����������������");
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
		MMsg("��ѡ��һ�");
		return;
	}
	*/
}
var exportArg;
function toWord()
{
	exportArg = '����Word';
	window.open("/workshop/evaluation/custJTQuesWord.html",'����Word',"dialogWidth:1024px;dialogHeight:768px;center:no;help:no;resizable:no;status:no");
}

function toPDF(){
	exportArg = '����Pdf';
	window.open("/workshop/evaluation/custJTQuesWord.html",'����Pdf',"dialogWidth:1024px;dialogHeight:768px;center:no;help:no;resizable:no;status:no");
}
