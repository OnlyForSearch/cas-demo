var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var callbackFn;
var formId = 590000000062; //������Ҫ�������µ�seq���ֶ��޸�
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
			MMsg("������¼��ֵ���˲��ǵ�ǰ�û�����û��Ȩ�ޱ༭!");
			return;
		}*/
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
		MMsg("��ѡ��һ�");
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

//ȡ�õ�ǰ��½Ա��ID
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
		//�жϵ�ǰ�û��Ƿ��Ǳ��е�ֵ����
		var currStaffId=getCurrentStaffId();
		/*if(row.get("SUBMIT_STAFF_ID")!=currStaffId && !isManager(currStaffId))
		{
			MMsg("������¼��ֵ���˲��ǵ�ǰ�û�����û��Ȩ��ɾ��!");
			return;
		}*/
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

function isHb()
{
	var orgId=getCurrentOrgId();
	if(orgId==62 || orgId==63 || orgId==107 )
	{
		return true;
	}
	else
	{
		EMsg("������ʡ���Ļ��人���û�,û���޸�Ȩ��!");
		return false;
	}
}
