var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var paramArray;

function RelaAdd(grid)
{	 
    paramArray = new Array("1");
	paramArray[0]="1";
    var val = window.showModalDialog("/workshop/ipp/customInfo.html",window,"dialogWidth:500px;dialogHeight:460px");
    if(val)
    {
    	grid.search();
    }
}

function RelaModify(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{                                
        paramArray = new Array("2");
		paramArray[0]="2";
		paramArray[1]=row.get("SERV_ID");
	    var val = window.showModalDialog("/workshop/ipp/customInfo.html",window,"dialogWidth:500px;dialogHeight:460px");
	    if(val)
	    {
	    	grid.search();
	    }
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
  			xmlhttp.Open("POST","/servlet/ippAction.do?method=delCustomInfo&id="+row.get("SERV_ID"),false);
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