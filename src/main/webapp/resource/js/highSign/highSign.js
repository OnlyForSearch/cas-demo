//更新高额签到的状态
function highSign(grid)
{
	var actionURL = "/servlet/highMonitorServlet?";	
	var selectionModel = grid.getSelectionModel();
	var rows = selectionModel.getSelections();
	if(rows.length < 1)
	{
		MMsg("请至少选择一条记录!");
		return;
	}
	var highIds = [];		
	for (var i = 0, row; row = rows[i]; i++)
	{
		highIds[i] = row.get("HIGNID");
	}
	Ext.Msg.show({
	   title:'提示',
	   msg: '确定要对你选择记录进行高额签到吗?',
	   buttons: Ext.Msg.YESNO,
	   fn: function(btn){
	   		if(btn=='yes'){
	   			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				xmlhttp.Open("POST",actionURL+"action=7&highIds="+highIds.join(','),false);
				xmlhttp.send();
				if (isSuccess(xmlhttp))
				{
					//MMsg("保存成功!");
					grid.search();
				}
	   		}
	   },
	   icon: Ext.MessageBox.QUESTION
	});		
	
}