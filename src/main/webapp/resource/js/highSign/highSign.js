//���¸߶�ǩ����״̬
function highSign(grid)
{
	var actionURL = "/servlet/highMonitorServlet?";	
	var selectionModel = grid.getSelectionModel();
	var rows = selectionModel.getSelections();
	if(rows.length < 1)
	{
		MMsg("������ѡ��һ����¼!");
		return;
	}
	var highIds = [];		
	for (var i = 0, row; row = rows[i]; i++)
	{
		highIds[i] = row.get("HIGNID");
	}
	Ext.Msg.show({
	   title:'��ʾ',
	   msg: 'ȷ��Ҫ����ѡ���¼���и߶�ǩ����?',
	   buttons: Ext.Msg.YESNO,
	   fn: function(btn){
	   		if(btn=='yes'){
	   			var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				xmlhttp.Open("POST",actionURL+"action=7&highIds="+highIds.join(','),false);
				xmlhttp.send();
				if (isSuccess(xmlhttp))
				{
					//MMsg("����ɹ�!");
					grid.search();
				}
	   		}
	   },
	   icon: Ext.MessageBox.QUESTION
	});		
	
}