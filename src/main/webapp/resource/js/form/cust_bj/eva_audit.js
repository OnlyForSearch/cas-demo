function auditAlarm(grid){
	var selectionModel = grid.getSelectionModel(); 
	if(selectionModel.getSelected()){
		var selections = selectionModel.getSelections();
		var alarmid = "";
		var type_ = "G";
		for(var i=0;i<selections.length;i++){
			alarmid += selections[i].get("对象ID") + ",";
		}
		type_ = selections[0].get("审核类型");
		var arr = new Array();
		arr.push(alarmid);
		arr.push(type_);
		arr.push(window.parent.oFlowId);
		window.showModalDialog("/workshop/alarmManage/alarmAuditSubmit.html",arr,"resizable=yes;dialogWidth=560px;dialogHeight=300px;help=0;scroll=0;status=0;");
		grid.search();
	}else{
		Ext.Msg.getDialog().setWidth(500);
		Ext.MessageBox.alert("提示","请至少选中一条记录，谢谢！");
	}
}


function inportExcel(grid)
{
	window.showModalDialog("/workshop/alarmManage/eva_ImportExcel.html?",parent.flow_id,"resizable=yes;dialogWidth=700px;dialogHeight=100px;help=0;scroll=0;status=0;");
	grid.search();
}