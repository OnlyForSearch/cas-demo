var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var callbackFn;
var formId = 270000000001; //������Ҫ�������µ�seq���ֶ��޸�

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
			MMsg("������¼��ֵ���˲��ǵ�ǰ�û�����û��Ȩ�ޱ༭!");
			return;
		}
		*/
		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=" + formId +"&requestId="+row.get("REQUEST_ID"),
                                window,
                                "dialogWidth:800px;dialogHeight:600px;center:no;help:no;resizable:no;status:no");
	}
	else
	{
		MMsg("��ѡ��һ�");
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
		//�жϵ�ǰ�û��Ƿ��Ǳ��е�ֵ����
		if(row.get("SUBMIT_STAFF_ID")!=getCurrentStaffId())
		{
			MMsg("������¼��ֵ���˲��ǵ�ǰ�û�����û��Ȩ��ɾ��!");
			return;
		}
  		if(QMsg("ȷ��ɾ����ѡ���¼��")==MSG_YES)
  		{
  			var sRequestId=row.get("REQUEST_ID");
  			var delByClassIdUrl="../../../servlet/formDispatch?OperType=15&formId=" + formId + "&requestId="+sRequestId;
  			//alert(delByClassIdUrl)
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

function search(grid, btn)
{
	grid.showParamWin(btn.el)
}

function refresh(grid)
{
	grid.search();
}
